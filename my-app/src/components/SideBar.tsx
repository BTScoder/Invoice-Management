import { useEffect, useState } from "react";
import Logo from "./logo/Logo";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "theme";

export default function SideBar() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem(THEME_KEY) === "dark"
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="bg-side dark:bg-dark-bg2 z-9999 flex h-20 w-full items-center justify-between overflow-hidden max-md:h-18 lg:h-full lg:w-25.75 lg:flex-col lg:rounded-r-3xl">
      <Logo />

      <div className="flex gap-8 max-lg:h-full lg:w-full lg:flex-col">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsDark((value) => !value)}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="text-icon transition-opacity duration-150 ease-linear hover:opacity-50"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="flex items-center justify-center border-[#494E6E] max-lg:h-full max-lg:border-l max-lg:px-6 lg:border-t lg:py-6">
          <img
            src="./public/avatar.png"
            alt="User avatar"
            className="size-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
