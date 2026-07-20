const canonicalOrigin = "https://cofrinhoreal.com.br";

export default {
  async fetch(request) {
    const source = new URL(request.url);
    return Response.redirect(`${canonicalOrigin}${source.pathname}${source.search}`, 308);
  },
};
