import Logo from "@/components/logo";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center h-screen justify-center flex-col space-y-12">
      <Logo />
      {children}
    </div>
  );
};
export default layout;
