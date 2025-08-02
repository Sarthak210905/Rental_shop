import Link from "next/link";
import { cn } from "@/lib/utils"

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M15.25 22.75 8.75 16.25 2.25 22.75" />
        <path d="m10.5 16.5 5-5" />
        <path d="m10.5 16.5-5-5" />
        <path d="M5 2.75v5.5" />
        <path d="M19 2.75v5.5" />
        <path d="M5 8.25c-1.5 1-1.5 2.5 0 3.5" />
        <path d="M19 8.25c1.5 1 1.5 2.5 0 3.5" />
        <path d="M2.75 11.25h18.5" />
      </svg>
      <span className="font-headline text-2xl font-bold text-foreground">
        Prency Hangers
      </span>
    </Link>
  );
};

export default Logo;
