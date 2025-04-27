export function extractTextFromHtml(html: string, maxLength = 150): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText || "";

  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}
