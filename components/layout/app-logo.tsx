import Image from "next/image"
import { cn } from "@/lib/utils"

interface AppLogoProps {
  position?: "left" | "center" | "right"
  size?: "small" | "medium" | "large"
  showText?: boolean
  showTagline?: boolean
  className?: string
}

export function AppLogo({
  position = "left",
  size = "medium",
  showText = false,
  showTagline = false,
  className,
}: AppLogoProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  }

  const textSizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
  }

  const taglineSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  }

  const positionClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }

  return (
    <div className={cn("flex items-center gap-3", positionClasses[position], className)}>
      <div
        className={cn(
          "bg-gradient-to-br from-[#b8d4f0] to-[#a8c8e8] rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 border border-white/30",
          sizeClasses[size],
        )}
      >
        <Image
          src="/images/shuleverse-logo-new.png"
          alt="ShuleVerse Logo"
          width={size === "small" ? 20 : size === "medium" ? 32 : 48}
          height={size === "small" ? 20 : size === "medium" ? 32 : 48}
          className="object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn("font-bold text-[#1e3a8a] drop-shadow-sm", textSizeClasses[size])}>ShuleVerse</h1>
          {showTagline && (
            <p className={cn("text-[#f59e0b] drop-shadow-sm font-medium", taglineSizeClasses[size])}>
              A Universe of Learning
            </p>
          )}
        </div>
      )}
    </div>
  )
}
