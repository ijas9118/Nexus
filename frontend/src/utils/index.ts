export const formatLabel = (value: string) =>
  value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
