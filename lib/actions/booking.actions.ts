"use server";

import { Booking } from "@/database";
import connectDB from "../mongodb";

export type CreateBookingResult =
  | { success: true; error?: never }
  | { success: false; error: string };

export const createBooking = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    await connectDB();
    const bookingDocument = await Booking.create({
      eventId,
      email,
    });
    const booking = bookingDocument.toObject();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to create booking" };
  }
};
