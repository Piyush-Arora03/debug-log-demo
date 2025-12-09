import mime from "mime-types";

/**
 * Get extension from MIME type.
 * Falls back to .bin when unknown.
 */
export function getExtensionFromMime(mimeType: string | null): string {
  if (!mimeType) return "bin";
  return mime.extension(mimeType) || "bin";
}

/**
 * Generate a safe filename using timestamp + random number + extension.
 */
export function generateFileName(mimeType: string | null,deviceId:string): string {
  const ext = getExtensionFromMime(mimeType);
  const timestamp = Date.now();
  return `${deviceId}_${timestamp}.${ext}`;
}

/**
 * Turns a File object (from FormData) into a Node Buffer.
 * Next.js File implements arrayBuffer(), so this is safe to use.
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
