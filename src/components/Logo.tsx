interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`relative w-full max-w-[200px] ${className}`}>
      <img
        src="https://cannabis.bio-apo.de/_next/image?url=https%3A%2F%2Fcannaleo.fra1.digitaloceanspaces.com%2Fcannaleo_apo%2F57ef1f354afe7f32ac77a0282a8d158d.png&w=1920&q=75"
        alt="Cannabis Bio Apo Logo"
        className="w-full h-auto object-contain"
      />
    </div>
  );
} 