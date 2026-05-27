"use server";

import connectDB from "@/lib/mongodb";
import { Event } from "@/database/event.model";

const getSimilarEvents = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });
    const similarEvents = await Event.find({
      _id: {
        $ne: event?._id,
      },
      tags: { $in: event?.tags },
    }).lean();
    return JSON.parse(JSON.stringify(similarEvents));
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};

export { getSimilarEvents };
