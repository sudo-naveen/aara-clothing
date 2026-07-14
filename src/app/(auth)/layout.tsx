import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login - Aara Clothing",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <Image
          src="/login-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          quality={85}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-aara-primary/40 via-transparent to-aara-secondary/30" />
      </div>

      {/* Decorative floating shapes */}
      <div className="absolute left-[10%] top-[20%] size-64 rounded-full bg-aara-accent/10 blur-3xl" style={{ animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute bottom-[15%] right-[15%] size-48 rounded-full bg-primary/10 blur-3xl" style={{ animation: "float 6s ease-in-out infinite 1s" }} />
      <div className="absolute left-[60%] top-[10%] size-32 rounded-full bg-aara-highlight/8 blur-2xl" style={{ animation: "pulse-soft 4s ease-in-out infinite" }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl glass-strong shadow-elevated p-3">
            <Image
              src="/aara-logo-white.png"
              alt="Aara Clothing"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Aara Clothing
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Inventory & Order Management
            </p>
          </div>
        </div>

        {/* Login card with glassmorphism */}
        <div className="glass-strong rounded-3xl shadow-elevated p-1">
          {children}
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-white/40">
          Internal use only. Authorized personnel.
        </p>
      </div>
    </div>
  );
}
