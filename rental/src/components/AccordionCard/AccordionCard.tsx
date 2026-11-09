"use client";

import { useState } from "react";
import type { FC, ReactNode } from "react";

type AccordionCardProps = {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

// Figma: accordion card (node-id=5229-2633)。状態=展開 / 折りたたみ
const AccordionCard: FC<AccordionCardProps> = ({
  title,
  icon,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-lg border border-main bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2 bg-card-head px-3 py-3 text-left"
      >
        {icon}
        <span className="flex-1 text-body font-bold text-main">{title}</span>
        <span className="text-caption text-main">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="px-3 py-2">{children}</div>}
    </section>
  );
};

export default AccordionCard;
