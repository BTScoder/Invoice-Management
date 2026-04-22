import React from "react";
import Logo from "./logo/Logo";
import { Moon } from "lucide-react";
export default function SideBar() {
  return (
    <div className="lg:h-screen lg:w-25.75 bg-side rounded-tr-xl rounded-br-xl flex items-center justify-between pe-10">
      <Logo />

      <div className="lg:fixed lg:left-0 lg:inset-y-0 flex items-center lg:flex-col lg:pb-10 lg:justify-end  lg:w-25.75  gap-10">
        <Moon className="h-8 w-8 border-none fill-icon border-b border-icon lg:mb-20" />

        <div>
          <p className="h-10 w-10 rounded-full bg-icon"></p>
        </div>
      </div>
    </div>
  );
}
