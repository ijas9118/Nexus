export function generateTransactionId(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const timeStr = `${hours}${minutes}${seconds}`; // e.g., "174630"
  const timeBase36 = parseInt(timeStr).toString(36); // e.g., "h0ja"

  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0'); // 3-digit random

  return `TX${timeBase36}${random}`; // e.g., TXh0ja472
}
