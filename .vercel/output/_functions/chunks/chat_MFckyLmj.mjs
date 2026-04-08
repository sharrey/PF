const prerender = false;
const SYSTEM_PROMPT = `You are sharriy's AI assistant on his DevOps portfolio website (sharriy.sh).
sharriy is a DevOps engineer with hands-on experience in:
- Containers: Kubernetes (80%), Docker (92%), Helm (70%)
- CI/CD: GitHub Actions (90%), Jenkins (80%), ArgoCD (70%)
- Cloud: AWS (82%), Azure (70%), GCP (60%)
- IaC: Terraform (80%), Ansible (72%), Pulumi (50%)
He writes blog posts about practical DevOps topics: Kubernetes debugging, Docker multi-stage builds, GitHub Actions pipelines, Terraform state management, AWS/Anthropic cybersecurity, and S3 filesystem changes.
His philosophy: "logs > lectures, break things, fix them faster."

Rules:
- Keep replies short and sharp — 2-3 sentences unless the user asks for detail
- Be technical and direct, match the hacker/terminal energy of the site
- If asked about hiring or contact, say he's open to opportunities and to find him on GitHub
- Never make up specific projects or companies — stick to what you know
- If asked something totally off-topic, gently redirect back to sharriy's work`;
const POST = async ({ request }) => {
  const apiKey = "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";
  let messages;
  try {
    ({ messages } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const sanitized = messages.filter(
    (m, i) => i === 0 || m.role !== messages[i - 1].role
  );
  if (!sanitized.length || sanitized[sanitized.length - 1].role !== "user") {
    return new Response(JSON.stringify({ error: "Last message must be from user" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://sharriy.sh",
      "X-Title": "sharriy.sh"
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...sanitized
      ]
    })
  });
  if (!resp.ok) {
    const errBody = await resp.text();
    console.error("[chat] OpenRouter error", resp.status, errBody);
    return new Response(JSON.stringify({ error: `API error ${resp.status}: ${errBody}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
  const data = await resp.json();
  const reply = data?.choices?.[0]?.message?.content ?? "...";
  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
