import Image from "next/image";
import Link from "next/link";

interface props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: props) => {
  return (
    <>
      <Link href={`/events/${slug}`} id="event-card">
        <Image
          src={image}
          alt={title}
          width={410}
          height={300}
          className="poster"
        />
        <div className=" flex flex-row gap-2">
          <Image
            src="/icons/pin.svg"
            alt="location"
            width={14}
            height={14}
            className="inline-block"
          ></Image>
          <span>{location}</span>
        </div>

        <p className="title">{title}</p>

        <div className="datetime">
          <div className="date">
            <Image
              src="/icons/calendar.svg"
              alt="date"
              width={14}
              height={14}
            ></Image>
            <span>{date}</span>
          </div>
          <div className="time">
            <Image
              src="/icons/clock.svg"
              alt="time"
              width={14}
              height={14}
            ></Image>
            <span>{time}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default EventCard;
