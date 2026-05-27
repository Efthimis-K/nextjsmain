import Image from "next/image";
import { notFound } from "next/navigation";

import { Event } from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import BookEvent from "@/components/BookEvent";
import { getSimilarEvents } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";

// const toStringList = (value: unknown): string[] => {
//   if (Array.isArray(value)) {
//     // Each element might itself be a JSON-stringified array — flatten if so
//     const result: string[] = [];
//     for (const item of value) {
//       const str = String(item);
//       try {
//         const parsed = JSON.parse(str);
//         if (Array.isArray(parsed)) {
//           result.push(...parsed.map(String));
//           continue;
//         }
//       } catch {
//         // not JSON, use as-is
//       }
//       result.push(str);
//     }
//     return result;
//   }

//   if (typeof value !== "string") {
//     return [];
//   }

//   try {
//     const parsed = JSON.parse(value);
//     return Array.isArray(parsed) ? parsed.map(String) : [value];
//   } catch {
//     return [value];
//   }
// };

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Event tags component
const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div key={index} className="pill">
          {tag}
        </div>
      ))}
    </div>
  );
};

// Event agenda component

const EventAgenda = ({ agenda }: { agenda: string[] }) => {
  return (
    <div className="flex-col-gap-2">
      <h2>Agenda</h2>
      <ul className="flex-col-gap-2">
        {agenda.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

// Event detail item component

const EventDetailItem = ({
  icon,
  label,
  alt,
}: {
  icon: string;
  label: string;
  alt: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const req = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {
    event: {
      description,
      overview,
      image,
      title,
      date,
      time,
      location,
      agenda,
      tags,
      mode,
      audience,
      organizer,
    },
  } = await req.json();

  await connectDB();

  if (!description) {
    notFound();
  }

  // const agenda = toStringList(event.agenda);
  // const tags = toStringList(event.tags);

  // create bookings
  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEvents(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* left side */}
        <div className="content">
          <Image src={image} alt={title} width={800} height={800} />

          <section className=" flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>

            {/* <section className="event-details mt-4"> */}
            <h2>Event Details</h2>
            {/* use the item component */}
            <EventDetailItem
              icon="/icons/calendar.svg"
              label={date}
              alt="calendar"
            />
            {/* The remaining event detail items */}
            <EventDetailItem icon="/icons/clock.svg" label={time} alt="time" />
            <EventDetailItem
              icon="/icons/pin.svg"
              label={location}
              alt="location"
            />

            <EventDetailItem icon="/icons/mode.svg" label={mode} alt="agenda" />
            <EventDetailItem
              icon="/icons/audience.svg"
              label={audience}
              alt="audience"
            />

            {/* render agenta component elements as parsed text */}
            <EventAgenda agenda={JSON.parse(agenda[0])} />

            <section className=" flex-col-gap-2">
              <h3>About Organizer</h3>
              <p>{organizer}</p>
            </section>

            {/* Render event tags */}
            <EventTags tags={JSON.parse(tags[0])} />
            {/* </section> */}
          </section>
        </div>

        {/* right side */}
        <aside className="booking">
          <div className=" signup-card">
            <h2>Book your spot for this event</h2>
            {bookings > 0 ? (
              <p>Join {bookings} other professionals at this event</p>
            ) : (
              <p className=" text-sm">No spots left</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>

      <div className=" flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
