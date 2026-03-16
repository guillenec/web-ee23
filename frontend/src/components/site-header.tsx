"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { TransitionLink } from "@/components/transition-link";

const enlaces = [
  { href: "/novedades", label: "Novedades" },
  { href: "/galeria", label: "Galeria" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/admin/novedades", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const contactoActivo = pathname.startsWith("/contacto");
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-dark/10 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <TransitionLink href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logos/logo1.png"
            alt="Logo Escuela Especial N 23"
            width={44}
            height={44}
            className="h-11 w-11"
          />
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-main uppercase">
              Escuela Especial N 23
            </p>
            <p className="text-sm text-brand-dark/75">Ingeniero Jacobacci - Rio Negro</p>
          </div>
        </TransitionLink>

        <button
          type="button"
          onClick={() => setMenuAbierto((prev) => !prev)}
          className="rounded-full border border-brand-dark/20 px-3 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white md:hidden"
          aria-expanded={menuAbierto}
          aria-label="Abrir menu principal"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {enlaces.map((enlace) => {
            const activa = pathname.startsWith(enlace.href);

            return (
              <TransitionLink
                key={enlace.href}
                href={enlace.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  activa
                    ? "bg-brand-main text-white"
                    : "text-brand-dark/80 hover:bg-brand-dark/10 hover:text-brand-dark"
                }`}
              >
                {enlace.label}
              </TransitionLink>
            );
          })}
          <TransitionLink
            href="/contacto"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              contactoActivo
                ? "border-brand-main bg-brand-main text-white"
                : "border-brand-main text-brand-main hover:bg-brand-main hover:text-white"
            }`}
          >
            Contacto
          </TransitionLink>
        </nav>
      </div>

      {menuAbierto ? (
        <div className="border-t border-brand-dark/10 bg-surface px-5 py-3 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2">
            {enlaces.map((enlace) => {
              const activa = pathname.startsWith(enlace.href);

              return (
                <TransitionLink
                  key={`mobile-${enlace.href}`}
                  href={enlace.href}
                  onClick={() => setMenuAbierto(false)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    activa
                      ? "bg-brand-main text-white"
                      : "text-brand-dark/80 hover:bg-brand-dark/10 hover:text-brand-dark"
                  }`}
                >
                  {enlace.label}
                </TransitionLink>
              );
            })}

            <TransitionLink
              href="/contacto"
              onClick={() => setMenuAbierto(false)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                contactoActivo
                  ? "border-brand-main bg-brand-main text-white"
                  : "border-brand-main text-brand-main hover:bg-brand-main hover:text-white"
              }`}
            >
              Contacto
            </TransitionLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
