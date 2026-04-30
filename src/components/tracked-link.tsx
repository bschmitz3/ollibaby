"use client";

import type { ReactNode } from "react";

import type { AnalyticsEventName, AnalyticsEventPayload } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

export type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  eventName: AnalyticsEventName;
  eventPayload?: AnalyticsEventPayload;
};

export function TrackedLink({
  href,
  children,
  className,
  target,
  rel,
  eventName,
  eventPayload,
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => {
        trackEvent(eventName, eventPayload);
      }}
    >
      {children}
    </a>
  );
}

