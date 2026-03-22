"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  useViewTransition?: boolean;
};

type DocumentWithTransition = Document & {
  startViewTransition?: (callback: () => void) => void;
};

export function TransitionLink({ href, className, children, useViewTransition = false, ...rest }: Props) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const doc = document as DocumentWithTransition;

    if (useViewTransition && doc.startViewTransition) {
      doc.startViewTransition(() => {
        router.push(href);
      });
      return;
    }

    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
