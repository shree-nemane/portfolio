/**
 * Cloudflare Pages Function: /submit-form
 * Serverless proxy to Formspree keeping FORMSPREE_ID hidden from client and repo.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  const formspreeId = env.FORMSPREE_ID;
  if (!formspreeId) {
    return new Response(
      JSON.stringify({ error: "Server configuration error: FORMSPREE_ID missing." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let body;
    let headers = { Accept: "application/json" };

    if (contentType.includes("application/json")) {
      const json = await request.json();

      // Honeypot spam trap: if _gotcha is populated by a bot, absorb with mock 200 OK
      if (json._gotcha) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      body = JSON.stringify(json);
      headers["Content-Type"] = "application/json";
    } else {
      body = await request.formData();
      if (body.get("_gotcha")) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const formspreeRes = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers,
      body,
    });

    const resData = await formspreeRes.json().catch(() => ({}));

    return new Response(JSON.stringify(resData), {
      status: formspreeRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to dispatch message. Please try again later." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
