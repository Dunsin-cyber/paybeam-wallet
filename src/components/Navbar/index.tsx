import ThemeToggle from "@/components/ThemeToggle";
import ColourfulText from "@/components/ui/colourful-text";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import Link from "next/link";

export const links = [
  {
    title: "Wallet",
    icon: (
      <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/wallet",
  },

  {
    title: "Products",
    icon: (
      <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "#",
  },
  {
    title: "Send",
    icon: (
      <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/make-payment",
  },
  {
    title: "GitHub",
    icon: (
      <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "https://github.com/Dunsin-cyber/alby-competency-test",
  },
];
export default function FloatingDockDemo() {
  return (
    <div className=" flex justify-between items-center mt-5">
      <div className="text-3xl font-bold z-2 font-sans">
        <Link href="/wallet">
          <ColourfulText text="payBeam" />
        </Link>
      </div>
      <div className="flex space-x-4 justify-between">
        <ThemeToggle />
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
