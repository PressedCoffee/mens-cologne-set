function cleanProductId(id) {
  if (!id) return "";
  // Just remove the v1| prefix and |0 suffix if they exist
  return String(id).replace(/^v1\|/, "").replace(/\|0$/, "");
}

module.exports = {
  cleanProductId,
};
