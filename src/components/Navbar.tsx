import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-neutral-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="text-neutral-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-white">PlacementGPT</span>
      </div>
      <div className="hidden lg:block font-bold text-lg text-white">
        Dashboard
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <UserButton />
      </div>
    </header>
  );
}
