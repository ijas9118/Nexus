export class FormatTime {
  static formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure 2 digits
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    return `${hours}:${minutes} ${ampm}`;
  }
}
