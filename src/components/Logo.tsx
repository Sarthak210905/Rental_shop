import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
<<<<<<< HEAD
        src="/logo.jpg" // Path to your logo in public folder
=======
        src="/logo.png" // Path to your logo in public folder
>>>>>>> 12dad75c06410c81dad5458b3a6a88f30e5c824a
        alt="Prency Hangers Logo"
        width={28} // Adjust size
        height={28}
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
