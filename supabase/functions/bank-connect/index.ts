// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

interface ConnectRequest {
  action: string;
  routing_number?: string;
  account_number?: string;
  account_type?: string;
  business_name?: string;
  user_id?: string;
  id?: string;
  amount_a?: number;
  amount_b?: number;
}

const DWOLLA_API_URL = "https://api-sandbox.dwolla.com";
const DWOLLA_KEY = Deno.env.get("DWOLLA_API_KEY") || "Cn3Xe8M02foBocGyjMLIluxgfdzMHHMi0k4nmFkI3Z1vHhmlUi";
const DWOLLA_SECRET = Deno.env.get("DWOLLA_API_SECRET") || "py1uI4cihcuDJRGdAm8lzEdUDgYPuQXo4fzsgYDljln6rZhOW0";

const getAccessToken = async (): Promise<string> => {
  const auth = btoa(`${DWOLLA_KEY}:${DWOLLA_SECRET}`);
  const resp = await fetch(`${DWOLLA_API_URL}/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error("Failed to get Dwolla access token");
  return data.access_token;
};

const callDwolla = async (method: string, path: string, body?: Record<string, any>): Promise<any> => {
  const token = await getAccessToken();
  const resp = await fetch(`${DWOLLA_API_URL}${path}`, {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/vnd.dwolla.v1.hal+json",
      "Accept": "application/vnd.dwolla.v1.hal+json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || `Dwolla API error: ${resp.status}`);
  }
  return data;
};

const handleConnect = async (req: ConnectRequest): Promise<any> => {
  const { routing_number, account_number, account_type, user_id } = req;
  
  if (!routing_number || !account_number || !user_id) {
    throw new Error("Missing routing_number, account_number, or user_id");
  }

  // Create or get customer
  const customerResp = await callDwolla("POST", "/customers", {
    firstName: "Business",
    lastName: "Account",
    email: `user-${user_id}@payroll.local`,
    type: "business",
  });
  const customerId = customerResp._links.self.href.split("/").pop();

  // Add funding source (bank account)
  const fundingResp = await callDwolla(
    "POST",
    `/customers/${customerId}/funding-sources`,
    {
      routingNumber: routing_number,
      accountNumber: account_number,
      bankAccountType: account_type === "savings" ? "savings" : "checking",
      name: "Business Bank Account",
    }
  );
  const fundingSourceUrl = fundingResp._links.self.href;
  const fundingSourceId = fundingSourceUrl.split("/").pop();

  // Initiate micro-deposit verification
  await callDwolla("POST", `${fundingSourceUrl}/micro-deposits`, {});

  return {
    id: fundingSourceId,
    bank_name: "Connected via Dwolla",
    account_last4: account_number.slice(-4),
    status: "pending_verification",
  };
};

const handleVerify = async (req: ConnectRequest): Promise<any> => {
  const { id, amount_a, amount_b } = req;
  
  if (!id || amount_a === undefined || amount_b === undefined) {
    throw new Error("Missing id, amount_a, or amount_b");
  }

  // Verify micro-deposits
  const verifyResp = await callDwolla("POST", `/funding-sources/${id}/micro-deposits/verify`, {
    amount1: { value: amount_a.toString(), currency: "USD" },
    amount2: { value: amount_b.toString(), currency: "USD" },
  });

  return {
    status: verifyResp.status === "verified" ? "verified" : "pending",
    verified: verifyResp.status === "verified",
  };
};

serve(async (req) => {
  try {
    // Safely read the body: avoid throwing on empty or non-JSON payloads
    let body: ConnectRequest = {} as ConnectRequest;
    try {
      const text = await req.text();
      body = text ? (JSON.parse(text) as ConnectRequest) : ({} as ConnectRequest);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid or missing JSON body' }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { action } = body;

    if (action === "connect") {
      const result = await handleConnect(body);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (action === "verify") {
      const result = await handleVerify(body);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (action === "validate_routing") {
      // Simple routing validation (9 digits, basic check)
      const { routing_number } = body;
      const valid = /^\d{9}$/.test(routing_number || "");
      return new Response(JSON.stringify({ valid, bank_name: valid ? "Bank" : null }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
