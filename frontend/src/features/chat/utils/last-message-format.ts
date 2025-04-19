import dayjs from "dayjs";

export const formatLastMessageTime = (date: string) => {
  const messageDate = dayjs(date);
  const now = dayjs();

  // Today: show time in HH:MM AM/PM format
  if (messageDate.isSame(now, "day")) {
    return messageDate.format("hh:mm A");
  }

  // Yesterday: show "Yesterday"
  if (messageDate.isSame(now.subtract(1, "day"), "day")) {
    return "Yesterday";
  }

  // Within last week (2-6 days ago): show day name
  if (messageDate.isAfter(now.subtract(7, "day"), "day")) {
    return messageDate.format("dddd"); // Monday, Tuesday, etc.
  }

  // Older than a week: show DD/MM/YYYY
  return messageDate.format("DD/MM/YYYY");
};
