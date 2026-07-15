import assert from "node:assert/strict";
import { onRequest } from "../functions/api/inquiry-chat.js";

const originalFetch = globalThis.fetch;

function makeRateLimitDb({ blockedScope = "", fail = false } = {}) {
  const counters = new Map();

  return {
    prepare(sql) {
      if (/DELETE FROM inquiry_rate_limits/.test(sql)) {
        return {
          bind() {
            return {
              async run() {
                return { success: true };
              },
            };
          },
        };
      }

      if (/SELECT request_count/.test(sql)) {
        return {
          bind(scope, subjectHash, windowStartedAt, limit) {
            return {
              async first() {
                if (fail) throw new Error("D1 unavailable");
                if (scope === blockedScope) return { allowed: 0 };

                const key = `${scope}:${subjectHash}:${windowStartedAt}`;
                const current = counters.get(key);
                return current === undefined ? null : { allowed: current < Number(limit) ? 1 : 0 };
              },
            };
          },
        };
      }

      assert.match(sql, /INSERT INTO inquiry_rate_limits/);
      assert.match(sql, /WHERE inquiry_rate_limits\.request_count < \?5/);

      return {
        bind(scope, subjectHash, windowStartedAt, windowEndsAt, limit) {
          return {
            async first() {
              if (fail) throw new Error("D1 unavailable");
              if (scope === blockedScope) return null;

              const key = `${scope}:${subjectHash}:${windowStartedAt}`;
              const current = counters.get(key) || 0;

              if (current >= Number(limit)) return null;

              const requestCount = current + 1;
              counters.set(key, requestCount);
              assert.ok(Number(windowEndsAt) > Number(windowStartedAt));
              return { request_count: requestCount };
            },
          };
        },
      };
    },
  };
}

const rateLimitDb = makeRateLimitDb();

const validModelReply = {
  reply: "What outcome would make this project worth pursuing?",
  ready_to_submit: false,
  missing_fields: ["desired_outcome", "timeline"],
  inquiry: {
    lane: "software_ai",
    project_type: "Private AI workflow",
    challenge: "Manual operating procedures take too long to search.",
    current_setup: "Approved manuals and shared files",
    desired_outcome: "",
    timeline: "",
  },
};

const completeModelReply = {
  ...validModelReply,
  reply: "I have a clear draft ready for your review.",
  ready_to_submit: true,
  missing_fields: [],
  inquiry: {
    ...validModelReply.inquiry,
    desired_outcome: "Give technicians faster grounded answers.",
    timeline: "This quarter",
  },
};

function modelResponse(value = validModelReply, status = 200) {
  return new Response(
    status === 200
      ? JSON.stringify({
          status: "completed",
          steps: [
            {
              type: "model_output",
              content: [{ type: "text", text: JSON.stringify(value) }],
            },
          ],
        })
      : JSON.stringify({ error: { message: "provider failure" } }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
}

function makeRequest({
  method = "POST",
  origin = "https://aiembeddedsystems.com",
  ip = "203.0.113.10",
  contentType = "application/json",
  assistantHeader = "1",
  body = {
    page: "/edge-ai-development/",
    messages: [{ role: "user", text: "We want to reduce time spent searching technical manuals." }],
  },
} = {}) {
  const headers = new Headers({
    Origin: origin,
    "Sec-Fetch-Site": "same-origin",
    "CF-Connecting-IP": ip,
  });

  if (assistantHeader) {
    headers.set("X-Inquiry-Assistant", assistantHeader);
  }

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  return new Request("https://aiembeddedsystems.com/api/inquiry-chat", {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

function makeContext(request, env = {}) {
  return {
    request,
    env: {
      GEMINI_API_KEY: "unit-test-key-primary",
      LEAD_RATE_LIMIT_SALT: "unit-test-rate-limit-salt",
      WORKSPACE_DB: rateLimitDb,
      ...env,
    },
  };
}

async function readJson(response) {
  return JSON.parse(await response.text());
}

async function run() {
  let upstreamCalls = 0;

  globalThis.fetch = async () => {
    upstreamCalls += 1;
    return modelResponse();
  };

  const methodResponse = await onRequest(makeContext(makeRequest({ method: "GET", ip: "203.0.113.11" })));
  assert.equal(methodResponse.status, 405);
  assert.equal(methodResponse.headers.get("Allow"), "POST");

  const originResponse = await onRequest(makeContext(makeRequest({ origin: "https://attacker.example", ip: "203.0.113.12" })));
  assert.equal(originResponse.status, 403);
  assert.equal(upstreamCalls, 0);

  const assistantHeaderResponse = await onRequest(makeContext(makeRequest({ assistantHeader: "", ip: "203.0.113.22" })));
  assert.equal(assistantHeaderResponse.status, 403);
  assert.equal(upstreamCalls, 0);

  const typeResponse = await onRequest(makeContext(makeRequest({ contentType: "text/plain", ip: "203.0.113.13" })));
  assert.equal(typeResponse.status, 415);

  const invalidResponse = await onRequest(makeContext(makeRequest({ body: "{not-json", ip: "203.0.113.14" })));
  assert.equal(invalidResponse.status, 400);

  const oversizedResponse = await onRequest(makeContext(makeRequest({
    body: { page: "/", messages: [{ role: "user", text: "x".repeat(15_000) }] },
    ip: "203.0.113.15",
  })));
  assert.equal(oversizedResponse.status, 413);

  const secretResponse = await onRequest(makeContext(makeRequest({
    body: { page: "/", messages: [{ role: "user", text: "api_key=abcdefghijklmnopqrstuvwxyz123456" }] },
    ip: "203.0.113.16",
  })));
  assert.equal(secretResponse.status, 422);
  assert.equal((await readJson(secretResponse)).code, "sensitive_input");
  assert.equal(upstreamCalls, 0);

  let capturedRequest;
  globalThis.fetch = async (url, options) => {
    upstreamCalls += 1;
    capturedRequest = { url, options };
    return modelResponse(completeModelReply);
  };

  const successResponse = await onRequest(makeContext(makeRequest({
    body: {
      page: "/edge-ai-development/",
      messages: [{ role: "user", text: "My email is prospect@example.com. We need an edge AI inspection tool." }],
    },
    ip: "203.0.113.17",
  })));
  const successBody = await readJson(successResponse);
  const providerBody = JSON.parse(capturedRequest.options.body);
  assert.equal(successResponse.status, 200);
  assert.equal(successBody.ready_to_submit, true);
  assert.equal(successBody.inquiry.lane, "software_ai");
  assert.equal(capturedRequest.url, "https://generativelanguage.googleapis.com/v1beta/interactions");
  assert.equal(providerBody.model, "gemini-3.1-flash-lite");
  assert.equal(providerBody.store, false);
  assert.equal("previous_interaction_id" in providerBody, false);
  assert.equal(providerBody.response_format.mime_type, "application/json");
  assert.equal(providerBody.input.includes("prospect@example.com"), false);
  assert.equal(providerBody.input.includes("[email withheld for the final review]"), true);
  assert.equal(capturedRequest.options.headers["x-goog-api-key"], "unit-test-key-primary");

  let rotationCalls = 0;
  globalThis.fetch = async () => {
    rotationCalls += 1;
    return rotationCalls === 1 ? modelResponse({}, 429) : modelResponse();
  };
  const rotationResponse = await onRequest(makeContext(makeRequest({ ip: "203.0.113.18" }), {
    GEMINI_API_KEY_2: "unit-test-key-secondary",
  }));
  assert.equal(rotationResponse.status, 200);
  assert.equal(rotationCalls, 2);

  globalThis.fetch = async () => new Response("not-json", { status: 200 });
  const malformedProviderResponse = await onRequest(makeContext(makeRequest({ ip: "203.0.113.19" })));
  assert.equal(malformedProviderResponse.status, 502);

  globalThis.fetch = async () => modelResponse();
  let rateLimitedResponse;
  for (let call = 0; call <= 12; call += 1) {
    rateLimitedResponse = await onRequest(makeContext(makeRequest({ ip: "203.0.113.20" })));
  }
  assert.equal(rateLimitedResponse.status, 429);
  assert.ok(Number(rateLimitedResponse.headers.get("Retry-After")) > 0);

  const siteLimitResponse = await onRequest(makeContext(makeRequest({ ip: "203.0.113.23" }), {
    WORKSPACE_DB: makeRateLimitDb({ blockedScope: "site_daily" }),
  }));
  assert.equal(siteLimitResponse.status, 429);

  const callsBeforeDatabaseFailure = upstreamCalls;
  const databaseFailureResponse = await onRequest(makeContext(makeRequest({ ip: "203.0.113.24" }), {
    WORKSPACE_DB: makeRateLimitDb({ fail: true }),
  }));
  assert.equal(databaseFailureResponse.status, 503);
  assert.equal(upstreamCalls, callsBeforeDatabaseFailure);

  const noDatabaseResponse = await onRequest(makeContext(makeRequest({ ip: "203.0.113.25" }), {
    WORKSPACE_DB: undefined,
  }));
  assert.equal(noDatabaseResponse.status, 503);

  const noSecretResponse = await onRequest(makeContext(makeRequest({ ip: "203.0.113.21" }), {
    GEMINI_API_KEY: "",
    GEMINI_API_KEY_2: "",
  }));
  assert.equal(noSecretResponse.status, 503);

  console.log("Inquiry assistant API: 15 focused checks passed.");
}

try {
  await run();
} finally {
  globalThis.fetch = originalFetch;
}
