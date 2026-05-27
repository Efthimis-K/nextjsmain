"use client";

// import posthog here
import posthog from "posthog-js";
import { createBooking } from "@/lib/actions/booking.actions";
import { useState } from "react";

type BookEventProps = {
  eventId: string;
  slug: string;
};

const BookEvent = ({ eventId, slug }: BookEventProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, error } = await createBooking({
      eventId,
      email,
    });
    if (success) {
      posthog.capture("event_booked", {
        event_id: eventId,
        slug,
        email,
      });
    } else {
      console.error(error);
      posthog.captureException({ error });
    }
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  // const handleBookEvent = () => {
  //   setSubmitted(true);
  //   console.log(email);
  //   setTimeout(() => {
  //     setSubmitted(false);
  //   }, 2000);
  // };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-light-100 text-lg">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-light-100 text-lg">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
