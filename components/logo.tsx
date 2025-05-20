import Link from "next/link";
import { PiggyBank } from "lucide-react";
const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <PiggyBank className="stroke md:h-11 md:w-11 h-8 w-8 stroke-amber-500 stroke-[1.5]" />
      <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-xl sm:text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Budget Tracker
      </span>
    </Link>
  );
};
export default Logo;
