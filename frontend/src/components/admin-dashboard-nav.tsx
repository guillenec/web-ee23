"use client";

import { Images, LayoutDashboard, Newspaper, Video } from "lucide-react";
import { usePathname } from "next/navigation";

import { TransitionLink } from "@/components/transition-link";

const enlaces = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/novedades", label: "Novedades", icon: Newspaper },
  { href: "/admin/galeria", label: "Galeria", icon: Images },
  { href: "/admin/canal", label: "Canal", icon: Video },
];

export function AdminDashboardNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-brand-dark/10 bg-surface/88 px-5 py-3 shadow-[0_8px_24px_rgba(75,56,49,0.06)] backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black tracking-[0.16em] text-brand-main uppercase">EE 23 Admin</p>
          <p className="text-xs font-semibold text-brand-dark/70">Gestion de contenidos</p>
        </div>
        <nav className="flex max-w-full gap-2 overflow-x-auto rounded-full border border-brand-dark/10 bg-white/65 p-1">
          {enlaces.map((enlace) => {
            const activo = enlace.href === "/admin" ? pathname === "/admin" : pathname.startsWith(enlace.href);
            const Icon = enlace.icon;

            return (
              <TransitionLink
                key={enlace.href}
                href={enlace.href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition ${
                  activo
                    ? "bg-brand-main text-white shadow-[0_8px_18px_rgba(202,66,19,0.24)]"
                    : "text-brand-dark/78 hover:bg-brand-dark hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {enlace.label}
              </TransitionLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
