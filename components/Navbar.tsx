import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="#" className="logo">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={24}
            height={24}
            // className="max-sm:hidden"
          ></Image>
          DevEvent
        </Link>
        <ul>
          <Link href="#events">Home</Link>
          <Link href="#about">Events</Link>
          <Link href="#contact">Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
