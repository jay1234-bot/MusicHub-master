import Link from "next/link";
import { Instagram, Twitter, Github, Send } from "lucide-react";
import { motion } from "framer-motion";

const socials = [
  { href: "https://instagram.com/", label: "Instagram", icon: Instagram },
  { href: "https://twitter.com/", label: "Twitter", icon: Twitter },
  { href: "https://github.com/", label: "GitHub", icon: Github },
  { href: "https://t.me/censored_politicss", label: "Telegram", icon: Send },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur py-6 px-6 md:px-20 lg:px-32 mt-8 flex flex-col items-center">
      <div className="flex gap-4 mb-2">
        {socials.map(({ href, label, icon: Icon }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.18, rotate: -6 }}
            whileTap={{ scale: 0.92 }}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={label}
          >
            <Icon className="h-6 w-6" />
          </motion.a>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Made with <span className="text-red-500">♥</span> by <a className="underline text-primary hover:text-primary" href="https://t.me/censored_politicss">krishan</a>.
      </p>
    </footer>
  );
}
