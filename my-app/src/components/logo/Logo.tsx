import { Link } from "react-router-dom";
import type { ComponentProps } from "react";
export default function Logo(props: ComponentProps<"svg">) {
  return (
    <Link
      to="/"
      aria-label="Go to home page"
      className="bg-light-purple relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-r-3xl max-lg:w-20 max-md:w-18"
    >
      <div className="bg-dark-purple absolute bottom-0 left-0 h-1/2 w-full rounded-tl-3xl" />
      <svg
        width="40"
        height="38"
        viewBox="0 0 40 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="z-1"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.6942 0L20 18.7078L29.3058 4.74611e-08C35.6645 3.34856 40 10.0219 40 17.7078C40 28.7535 31.0457 37.7078 20 37.7078C8.9543 37.7078 0 28.7535 0 17.7078C0 10.0219 4.33546 3.34856 10.6942 0Z"
          fill="white"
        />
      </svg>
    </Link>
  );
}
