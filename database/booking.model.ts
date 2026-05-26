import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";
import { Event } from "./event.model";

/**
 * Interface representing the pure data structure of a Booking.
 */
export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IBookingDocument = HydratedDocument<IBooking>;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true, // Speeds up queries searching bookings by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
        message: (props: { value: string }) => `${props.value} is not a valid email address.`,
      },
    },
  },
  {
    timestamps: true, // Enables automatic createdAt and updatedAt fields
  }
);

BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Pre-save hook: Verify the referenced Event exists in the database
BookingSchema.pre("save", async function () {
  // Ensure the referenced Event document exists before allowing the booking
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error(`Referenced Event with ID "${this.eventId}" does not exist.`);
  }
});

// Avoid compiling the model multiple times during Next.js hot reloads
export const Booking =
  (models.Booking as Model<IBooking> | undefined) || model<IBooking>("Booking", BookingSchema);
