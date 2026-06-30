const CURSOR_PALETTE = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F0B27A",
  "#82E0AA",
  "#F1948A",
  "#85929E",
  "#73C6B6",
  "#E59866",
  "#AED6F1",
  "#D7BDE2",
  "#A3E4D7",
  "#FAD7A0",
];

export function cursorColorFor(userId: string): string {
  let hash = 0;

  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = ((hash % CURSOR_PALETTE.length) + CURSOR_PALETTE.length) % CURSOR_PALETTE.length;

  return CURSOR_PALETTE[index];
}
