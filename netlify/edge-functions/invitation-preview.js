const LANG_TEXT = {
  es: {
    title: "Máximo | Bautizo & Cumpleaños",
    description: "Te invitamos a celebrar el bautizo y cumpleaños de Máximo · 24 de octubre de 2026 · Querétaro, Qro.",
  },
};

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export default async (request, context) => {
  const url = new URL(request.url);

  // Only decorate the public landing page. Other files/assets pass through untouched.
  if (url.pathname !== "/" && url.pathname !== "") return context.next();

  try {
    const pageResponse = await context.next();
    if (!pageResponse.ok) return pageResponse;

    let page = await pageResponse.text();
    const text = LANG_TEXT.es;
    const imageUrl = new URL("/assets/invitacion-maximo.jpg", url.origin).href;
    const canonical = `${url.origin}${url.pathname}${url.search}`;

    const tags = `
<meta property="og:type" content="website">
<meta property="og:site_name" content="Bautizo &amp; Cumpleaños de Máximo">
<meta property="og:title" content="${esc(text.title)}">
<meta property="og:description" content="${esc(text.description)}">
<meta property="og:image" content="${esc(imageUrl)}">
<meta property="og:image:alt" content="Invitación de Máximo">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(text.title)}">
<meta name="twitter:description" content="${esc(text.description)}">
<meta name="twitter:image" content="${esc(imageUrl)}">
<link rel="canonical" href="${esc(canonical)}">`;

    // Remove any previous preview tags so the response always contains one clean set.
    page = page.replace(/<meta\s+property=["']og:[^>]*>\s*/gi, "");
    page = page.replace(/<meta\s+name=["']twitter:[^>]*>\s*/gi, "");
    page = page.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");
    page = page.replace("</head>", `${tags}\n</head>`);

    return new Response(page, {
      status: pageResponse.status,
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "no-store, max-age=0",
      },
    });
  } catch {
    return context.next();
  }
};

export const config = {
  path: "/",
};
