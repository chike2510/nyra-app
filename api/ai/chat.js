const MAX_MESSAGES = 12;

function buildSystemPrompt(policy = {}) {
  const perPayment = Number(policy.perPayment || 50000).toLocaleString("en-NG");
  const monthlyLimit = Number(policy.monthlyLimit || 1000000).toLocaleString("en-NG");
  const categories = Object.entries(policy.categories || {})
    .map(([name, mode]) => `${name}: ${mode}`)
    .join(", ");

  return `You are Nyra, a calm and transparent AI money co-pilot for a Nigerian fintech app. You help users understand their activity, plan upcoming bills, and make their payment boundaries clearer. You never claim to execute, approve, send, receive, move, invest, borrow, or reverse money. You must state that the user needs to use the relevant in-app approval flow for any real payment.

Keep responses direct, warm, and short. Use Nigerian naira formatting (₦) for money. Explain decisions with the rule that caused the result; do not imply hidden reasoning or certainty that you cannot verify.

Current sample policy: per-payment limit ₦${perPayment}; monthly limit ₦${monthlyLimit}; category modes: ${categories || "not set"}; trusted recipients: ${(policy.trusted || []).join(", ") || "none"}; first-time recipients require approval: ${policy.firstTime ? "yes" : "no"}; agent paused: ${policy.paused ? "yes" : "no"}.`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.DASHSCOPE_API_KEY;
  const baseUrl = process.env.QWEN_BASE_URL;
  const model = process.env.QWEN_MODEL || "qwen-plus";

  if (!apiKey || !baseUrl) {
    return res.status(503).json({
      error: "Qwen is not configured. Add DASHSCOPE_API_KEY and QWEN_BASE_URL to this deployment, then redeploy."
    });
  }

  const suppliedMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = suppliedMessages
    .filter(message => message && typeof message.content === "string" && ["user", "nyra", "assistant"].includes(message.role))
    .slice(-MAX_MESSAGES)
    .map(message => ({
      role: message.role === "nyra" ? "assistant" : message.role,
      content: message.content.slice(0, 4000)
    }));

  if (!messages.length) {
    return res.status(400).json({ error: "A chat message is required." });
  }

  try {
    const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_tokens: 500,
        messages: [
          { role: "system", content: buildSystemPrompt(req.body?.policy) },
          ...messages
        ]
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error("Qwen upstream error", upstream.status, data?.error?.message || data);
      return res.status(upstream.status).json({ error: "The Qwen service could not complete this request." });
    }

    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res.status(502).json({ error: "Qwen returned an empty response. Please try again." });
    }

    return res.status(200).json({ content, model: data?.model || model });
  } catch (error) {
    console.error("Qwen adapter error", error);
    return res.status(502).json({ error: "Nyra could not reach the Qwen service." });
  }
}
