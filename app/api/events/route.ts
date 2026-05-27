import connectDB from "@/lib/mongodb";
import { Event } from "@/database/event.model";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
export const runtime = "nodejs";

type EventPayload = Record<string, FormDataEntryValue | string | string[]>;

function parseStringArray(value: unknown, fieldName: string): string[] {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => String(item).trim())
      .filter(Boolean);
    if (items.length > 0) return items;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be provided as a string or string array.`);
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw new Error(`${fieldName} cannot be empty.`);
  }

  try {
    const parsedValue = JSON.parse(trimmedValue);
    if (!Array.isArray(parsedValue)) {
      throw new Error(`${fieldName} must be a JSON array.`);
    }

    const items = parsedValue
      .map((item) => String(item).trim())
      .filter(Boolean);
    if (items.length === 0) {
      throw new Error(`${fieldName} cannot be empty.`);
    }

    return items;
  } catch {
    const items = trimmedValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (items.length === 0) {
      throw new Error(`${fieldName} must be a JSON array or comma-separated string.`);
    }

    return items;
  }
}

async function uploadPhoto(photo: File): Promise<string> {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("CLOUDINARY_URL is not configured.");
  }

  cloudinary.config({
    url: process.env.CLOUDINARY_URL,
  });

  const photoBuffer = Buffer.from(await photo.arrayBuffer());

  const photoUploadResult = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          public_id: photo.name,
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(error ?? new Error("Cloudinary upload failed."));
            return;
          }

          resolve({ secure_url: result.secure_url });
        },
      );

      uploadStream.end(photoBuffer);
    },
  );

  return photoUploadResult.secure_url;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") ?? "";
    let event: EventPayload;
    let image: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      event = Object.fromEntries(formData.entries());

      const photo = formData.get("photo");
      if (photo instanceof File && photo.size > 0) {
        image = await uploadPhoto(photo);
      } else if (typeof formData.get("image") === "string") {
        image = String(formData.get("image"));
      } else {
        return NextResponse.json(
          { error: "Provide either a photo upload or an image URL." },
          { status: 400 },
        );
      }
    } else if (contentType.includes("application/json")) {
      event = await req.json();
      image = typeof event.image === "string" ? event.image.trim() : undefined;

      if (!image) {
        return NextResponse.json(
          { error: "JSON requests must include an image URL in the image field." },
          { status: 400 },
        );
      }
    } else {
      return NextResponse.json(
        {
          error:
            "Unsupported content type. Use multipart/form-data for file uploads or application/json for JSON payloads.",
        },
        { status: 415 },
      );
    }

    const tags = parseStringArray(event.tags, "tags");
    const agenda = parseStringArray(event.agenda, "agenda");

    const createdEvent = await Event.create({
      ...event,
      image,
      tags,
      agenda,
    });

    return NextResponse.json({
      success: true,
      event: createdEvent,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create event";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET request

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    return NextResponse.json(
      { error, message: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
