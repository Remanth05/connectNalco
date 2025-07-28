import { Building2 } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className={`flex items-center justify-center rounded-xl overflow-hidden ${sizeClasses[size]} ${className}`}>
      <img
        src="/logo.jpg"
        alt="NALCO Logo"
        className="h-full w-full object-contain"
        onError={(e) => {
          // Hide broken image and show fallback
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) {
            fallback.style.display = 'flex';
          }
        }}
      />
      {/* Fallback icon */}
      <div 
        className="h-full w-full bg-nalco-red/10 flex items-center justify-center" 
        style={{ display: 'none' }}
      >
        <Building2 className="h-3/4 w-3/4 text-nalco-red" />
      </div>
    </div>
  );
}
