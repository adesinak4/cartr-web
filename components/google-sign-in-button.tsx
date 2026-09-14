"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// Direct process.env reference (not lib/env.ts) — this is a client component,
// and only NEXT_PUBLIC_-prefixed vars are ever available in the browser bundle.
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/** For callers that want to conditionally render surrounding UI (e.g. an "or" divider). */
export const GOOGLE_SIGNIN_ENABLED = !!GOOGLE_CLIENT_ID;

export interface GoogleProfile {
  idToken: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; width?: number; text?: string },
          ) => void;
        };
      };
    };
  }
}

/**
 * Decodes (never verifies) the ID token's payload — purely to pre-fill the
 * name/email fields for the user to review. Real verification happens
 * server-side (GoogleAuthService) on whatever endpoint this token is
 * eventually sent to; a tampered client-side decode here can't grant
 * anything, it can only mis-populate a form field the user can still edit.
 */
function decodeProfile(idToken: string): Omit<GoogleProfile, "idToken"> {
  const [, payloadB64] = idToken.split(".");
  const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
  return {
    email: payload.email ?? "",
    firstName: payload.given_name ?? "",
    lastName: payload.family_name ?? "",
  };
}

/** Renders nothing if Google sign-in isn't configured — honest degradation, no broken button. */
export function GoogleSignInButton({ onSuccess }: { onSuccess: (profile: GoogleProfile) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !GOOGLE_CLIENT_ID || !containerRef.current || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        const profile = decodeProfile(response.credential);
        onSuccess({ idToken: response.credential, ...profile });
      },
    });

    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} className="flex w-full justify-center" />
    </>
  );
}
