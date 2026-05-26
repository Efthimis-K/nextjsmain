import { HydratedDocument, Model, Schema, model, models } from "mongoose";

/**
 * Interface representing the pure data structure of an Event.
 */
export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type IEventDocument = HydratedDocument<IEvent>;

// Validator to ensure required strings are present and not empty or whitespace-only
const nonEmptyStringValidator = {
  validator: (v: string) => typeof v === "string" && v.trim().length > 0,
  message: (props: { path: string }) =>
    `${props.path} field is required and cannot be empty or whitespace-only.`,
};

// Validator to ensure non-empty array of non-empty strings
const nonEmptyArrayValidator = {
  validator: (v: string[]) =>
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((item) => typeof item === "string" && item.trim().length > 0),
  message: (props: { path: string }) =>
    `${props.path} must be a non-empty array of non-empty strings.`,
};

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    overview: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    image: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    venue: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    location: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    date: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    time: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    mode: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    audience: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    agenda: {
      type: [String],
      required: true,
      validate: nonEmptyArrayValidator,
    },
    organizer: {
      type: String,
      required: true,
      validate: nonEmptyStringValidator,
    },
    tags: {
      type: [String],
      required: true,
      validate: nonEmptyArrayValidator,
    },
  },
  {
    timestamps: true, // Enables automatic createdAt and updatedAt fields
  }
);

// Auto-generate slug and normalize date/time before validation and persistence.
EventSchema.pre("validate", function () {
  // 1. Slug generation: Generate only if title has changed
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-")         // Replace spaces with a single dash
      .replace(/-+/g, "-");         // Collapse duplicate dashes
  }

  // 2. Date validation and normalization: Normalize valid input to ISO string format
  if (this.isModified("date")) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date format for event: "${this.date}". Must be a valid date.`);
    }
    this.date = parsedDate.toISOString();
  }

  // 3. Time validation and normalization: Normalize to consistent HH:MM (24h) or HH:MM AM/PM format
  if (this.isModified("time")) {
    const timeStr = this.time.trim().toUpperCase();
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/;
    const match = timeStr.match(timeRegex);

    if (!match) {
      throw new Error(`Invalid time format: "${this.time}". Supported formats: HH:MM or HH:MM AM/PM.`);
    }

    const hoursStr = match[1];
    const minutesStr = match[2];
    const ampm = match[3];
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (hours < 0 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid hours or minutes in the provided time.");
    }

    if (ampm) {
      if (hours < 1 || hours > 12) {
        throw new Error("Hours must be between 1 and 12 for 12-hour format.");
      }
      this.time = `${hours.toString().padStart(2, "0")}:${minutesStr.padStart(2, "0")} ${ampm}`;
    } else {
      if (hours > 23) {
        throw new Error("Hours must be between 0 and 23 for 24-hour format.");
      }
      this.time = `${hours.toString().padStart(2, "0")}:${minutesStr.padStart(2, "0")}`;
    }
  }
});

// Avoid compiling the model multiple times during Next.js hot reloads
export const Event =
  (models.Event as Model<IEvent> | undefined) || model<IEvent>("Event", EventSchema);
