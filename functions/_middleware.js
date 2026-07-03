const CANONICAL_HOST = "aiembeddedsystems.com";

export function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname !== CANONICAL_HOST || url.protocol !== "https:") {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
