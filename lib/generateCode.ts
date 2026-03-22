// lib/generateCode.ts
// Generates a unique 6-digit room code.

export function generateRoomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}