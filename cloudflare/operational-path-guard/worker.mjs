const headers = Object.freeze({
  "Cache-Control": "no-store",
  "Content-Type": "text/plain; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex",
});

export default {
  fetch(request) {
    const body = request.method === "HEAD" ? null : "Not Found\n";
    return new Response(body, { status: 404, headers });
  },
};
