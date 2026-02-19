const store = /* @__PURE__ */ new Map();
function saveToken(token, pdf) {
  store.set(token, {
    pdf,
    expiresAt: Date.now() + 1e3 * 60 * 10
  });
}
function consumeToken(token) {
  const entry = store.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(token);
    return null;
  }
  store.delete(token);
  return entry.pdf;
}

export { consumeToken as c, saveToken as s };
