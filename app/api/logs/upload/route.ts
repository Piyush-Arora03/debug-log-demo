import { db } from "@/lib/db";
import { generateFileName, fileToBuffer } from "@/lib/mime";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const deviceId = form.get("deviceId") as string;
    const timestamp = form.get("timestamp") as string;
    const tags = form.get("tags") as string;

    const file = form.get("logfile") as File | null;

    if(!file){
      return Response.json({
        success:false,
        error:"No file uploaded"
      },{status:400});
    }

    let filePath :string|null= null;
    let mimeType = file.type;

    if (file) {
      const buffer = await fileToBuffer(file);

      const filename = generateFileName(mimeType,deviceId);
      const uploadDir = path.join(process.cwd(), "uploads");
      const fullPath = path.join(uploadDir, filename);

      fs.writeFileSync(fullPath, buffer);

      filePath = `uploads/${filename}`;
    }

    // INSERT using Kysely
    const result = await db
      .withSchema("debug_log")
      .insertInto("logs")
      .values({
        device_id: deviceId,
        tags: tags,
        file_path: filePath,
        mime_type: mimeType
      })
      .returning("id")
      .executeTakeFirst();

    return Response.json({
      success: true,
      id: result?.id,
      fileSaved: !!filePath,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
