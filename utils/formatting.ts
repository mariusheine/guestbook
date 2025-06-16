import dayjs from "dayjs";

export function formatTimestamp(timestamp: string): string {
  return dayjs(timestamp).format('DD.MM.YYYY HH:mm:ss');
}