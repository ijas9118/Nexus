export const formatLabel = (label?: string) => {
  if (!label || typeof label !== "string") return "";
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
