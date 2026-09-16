import Image from "next/image"

interface SchoolLogoProps {
  logoUrl: string
  schoolName: string
  size?: "small" | "medium" | "large"
  showName?: boolean
}

export function SchoolLogo({ logoUrl, schoolName, size = "medium", showName = true }: SchoolLogoProps) {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  }

  const logoSize = sizeMap[size]
  const textSize = size === "small" ? "text-sm" : size === "medium" ? "text-base" : "text-lg"

  return (
    <div className="flex items-center gap-2">
      <div className="relative overflow-hidden rounded-md bg-white shadow-sm">
        <Image
          src={logoUrl || "/placeholder.svg"}
          alt={`${schoolName} Logo`}
          width={logoSize}
          height={logoSize}
          className="object-contain"
        />
      </div>
      {showName && <span className={`font-semibold text-[#003366] ${textSize}`}>{schoolName}</span>}
    </div>
  )
}
