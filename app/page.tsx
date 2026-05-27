import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

// base url should be in the env file
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
  const res = await fetch(`${BASE_URL}/api/events`);
  const data = await res.json();
  const { events } = data;
  return (
    <section>
      <h1 className=" text-center">
        The best Tech dev <br /> events around you
      </h1>
      <p className=" text-center">
        Discover the best tech events near you and connect with like-minded
        developers.
      </p>
      {/* <button>Get Started</button> */}
      <ExploreBtn />

      <div className=" mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((item: IEvent) => (
              <li key={item.title} className=" list-none">
                <EventCard {...item} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
