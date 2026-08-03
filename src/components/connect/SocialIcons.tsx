import { cn } from "@/lib/utils";

type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-5 w-5", className)} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)} aria-hidden>
      <path d="M6.94 8.5H3.75V20h3.19V8.5zM5.34 7.05a1.85 1.85 0 1 0 0-3.7 1.85 1.85 0 0 0 0 3.7zM20.25 20h-3.18v-5.6c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94V20H9.9V8.5h3.05v1.57h.04c.42-.8 1.46-1.65 3-1.65 3.21 0 3.8 2.11 3.8 4.86V20z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)} aria-hidden>
      <path d="M14.5 20v-7.2h2.4l.36-2.8h-2.76V8.2c0-.81.22-1.36 1.39-1.36H17.5V4.14C17.18 4.1 16.1 4 14.86 4 12.26 4 10.5 5.6 10.5 8.5v1.5H8v2.8h2.5V20h4z" />
    </svg>
  );
}

export function PinterestIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)} aria-hidden>
      <path d="M12 3.2C7.03 3.2 3.5 6.7 3.5 11.3c0 3.3 1.9 6.13 4.7 7.2-.07-.61-.13-1.55.03-2.22.14-.61.92-3.9.92-3.9s-.23-.47-.23-1.16c0-1.09.63-1.9 1.42-1.9.67 0 1 .5 1 1.1 0 .67-.43 1.67-.65 2.6-.18.77.39 1.4 1.15 1.4 1.38 0 2.3-1.77 2.3-3.87 0-1.6-1.08-2.8-3.04-2.8-2.22 0-3.6 1.65-3.6 3.5 0 .64.19 1.1.49 1.45.05.07.06.13.05.2l-.18.74c-.03.12-.1.15-.22.09-1.2-.55-1.76-2.02-1.76-3.67 0-2.73 2.3-6 6.86-6 3.67 0 6.1 2.65 6.1 5.5 0 3.77-2.1 6.6-5.2 6.6-1.04 0-2.02-.56-2.36-1.2l-.64 2.45c-.2.76-.6 1.58-.95 2.2A8.9 8.9 0 0 0 12 20.8c4.97 0 8.5-3.5 8.5-8.5S16.97 3.2 12 3.2z" />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)} aria-hidden>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18.1 5 12 5 12 5s-6.1 0-7.7.3a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C5.9 19 12 19 12 19s6.1 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8zM10 15.2V8.8l5.2 3.2L10 15.2z" />
    </svg>
  );
}
