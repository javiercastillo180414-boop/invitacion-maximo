export default async (request, context) => {
  const response = await context.next();
  if (!response.ok) return response;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  let html = await response.text();
  html = html.replace(/<video\s+class=["']party-video["'][^>]*>/gi, tag => {
    if (/\bmuted(?:\s|=|>)/i.test(tag)) return tag;
    return tag.replace('>', ' muted>');
  });

  return new Response(html, {
    status: response.status,
    headers: {
      'content-type': contentType,
      'cache-control': 'no-store, max-age=0',
    },
  });
};

export const config = {
  path: '/invitation.html',
};
