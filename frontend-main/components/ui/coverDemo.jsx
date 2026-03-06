import React from "react";
import { Cover } from "./cover";

export function CoverDemo() {
  return (
    <div>
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">
          Ask ProcureGenie
        </span>
        <br />
        <Cover>Anything ⚡️</Cover>
      </h1>
    </div>
  );
}
