import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";

// const events = [
//   {
//     title: "Event 1",
//     image: "/images/event1.png",
//     slug: "event1",
//     location: "Location 1",
//     date: "Date 1",
//     time: "Time 1",
//   },
//   {
//     title: "Event 2",
//     image: "/images/event2.png",
//     slug: "event2",
//     location: "Location 2",
//     date: "Date 2",
//     time: "Time 2",
//   },
//   {
//     title: "Event 3",
//     image: "/images/event3.png",
//     slug: "event3",
//     location: "Location 3",
//     date: "Date 3",
//     time: "Time 3",
//   },
//   {
//     title: "Event 4",
//     image: "/images/event4.png",
//     slug: "event4",
//     location: "Location 4",
//     date: "Date 4",
//     time: "Time 4",
//   },
//   {
//     title: "Event 5",
//     image: "/images/event5.png",
//     slug: "event5",
//     location: "Location 5",
//     date: "Date 5",
//     time: "Time 5",
//   },
// ];

const Home = () => {
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
          {events.map((item) => (
            <li key={item.title}>
              <EventCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
