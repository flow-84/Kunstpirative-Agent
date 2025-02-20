interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Logo with enhanced visibility */}
      <div className="relative">
        <img
          src="/e56f3a_c7a05a03fb754d18802894f417bb45e7mv2.png"
          alt="RaumDesign Logo"
          className="w-full h-auto max-w-[240px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)] filter brightness-[0.97]"
          style={{
            filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.05)) drop-shadow(0 0 1px rgba(0,0,0,0.1))'
          }}
        />
      </div>
    </div>
  );
}