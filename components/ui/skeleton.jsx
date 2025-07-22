import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div className={cn("skeleton-shimmer rounded-md bg-muted relative overflow-hidden", className)} {...props} />
  );
}

export { Skeleton }

// In globals.css, add:
// .skeleton-shimmer::after {
//   content: "";
//   position: absolute;
//   top: 0; left: 0; right: 0; bottom: 0;
//   background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
//   animation: shimmer 1.2s infinite;
// }
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
