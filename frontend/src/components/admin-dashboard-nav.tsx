"use client";

import { usePathname } from "next/navigation";

import { TransitionLink } from "@/components/transition-link";

const enlaces = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/novedades", label: "Novedades" },
  { href: "/admin/galeria", label: "Galeria" },
];

export function AdminDashboardNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-brand-dark/10 bg-surface/90 px-5 py-3 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
        {enlaces.map((enlace) => {
          const activo = enlace.href === "/admin" ? pathname === "/admin" : pathname.startsWith(enlace.href);

          return (
            <TransitionLink
              key={enlace.href}
              href={enlace.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activo
                  ? "bg-brand-main text-white"
                  : "border border-brand-dark/15 bg-white text-brand-dark hover:bg-brand-dark hover:text-white"
              }`}
            >
              {enlace.label}
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
