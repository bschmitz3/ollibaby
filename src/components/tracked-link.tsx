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
  secondaryEventName?: AnalyticsEventName;
  secondaryEventPayload?: AnalyticsEventPayload;
};

export function TrackedLink({
  href,
  children,
  className,
  target,
  rel,
  eventName,
  eventPayload,
  secondaryEventName,
  secondaryEventPayload,
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => {
        trackEvent(eventName, eventPayload);
        if (secondaryEventName) {
          trackEvent(secondaryEventName, secondaryEventPayload);
        }
      }}
    >
      {children}
    </a>
  );
}
