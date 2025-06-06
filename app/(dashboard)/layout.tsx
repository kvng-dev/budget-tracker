import Navbar from "@/components/navbar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-full flex-col">
     
      <div className="w-full">{children}</div>
    </div>
  );
}

export default layout;
