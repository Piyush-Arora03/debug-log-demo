import fs from "fs";
import path from "path";
import zlib from "zlib";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get("filePath");

    console.log("Requested filePath:", filePath);

    if (!filePath) {
      return Response.json({ error: "Missing filePath" }, { status: 400 });
    }

    const safePath = filePath.replace(/^\/+/, "");
    const absolutePath = path.join(process.cwd(), safePath);

    console.log("Resolved absolute path:", absolutePath);

    if (!fs.existsSync(absolutePath)) {
      return Response.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = fs.readFileSync(absolutePath);

    console.log("BUFFER FIRST 10 BYTES:", buffer.subarray(0, 10));

    if (absolutePath.endsWith(".gz")) {
      try {
        const decompressed = zlib.gunzipSync(buffer).toString("utf8");
        console.log("Decompressed length:", decompressed);
        return Response.json({ content: decompressed }, { status: 200 });
      } catch (e: any) {
        console.error("Decompression error:", e);
        return Response.json(
          { error: "Failed to decompress gzip file" },
          { status: 500 }
        );
      }
    }

    return Response.json(
      { content: buffer.toString("utf8") },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Server error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
