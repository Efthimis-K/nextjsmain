"use client";
import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button
      type="button"
      id="explore-btn"
      onClick={() => console.log("clicked")}
      className=" mt-7 mx-auto "
    >
      <a href="#events">
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="Arrow Down"
          width={24}
          height={24}
          className="max-sm:hidden"
        ></Image>
      </a>
    </button>
  );
};

export default ExploreBtn;
