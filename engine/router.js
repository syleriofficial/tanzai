export function selectModel(type) {
  if (type === "coding") return "deepseek";
  if (type === "creative") return "mistral";
  return "llama";
}
