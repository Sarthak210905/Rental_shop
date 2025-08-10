import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image

        src="/logo.png" // Path to your logo in public folder
        alt="Prency Hangers Logo"
        width={56} // Adjust size
        height={56}
        className="object-contain"
        priority // Ensures it loads fast for the header
      />
      <span className="font-headline text-2xl font-bold text-foreground">
        Prency Hangers
      </span>
    </Link>
  );
};

export default Logo;
