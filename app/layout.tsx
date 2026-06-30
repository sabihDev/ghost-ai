import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Collaborative system design workspace powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased font-sans"
    >
      <body className="flex min-h-full flex-col font-sans">
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              colorBackground: "var(--bg-surface)",
              colorInput: "var(--bg-elevated)",
              colorInputForeground: "var(--text-primary)",
              colorPrimary: "var(--accent-primary)",
              colorPrimaryForeground: "var(--bg-base)",
              colorForeground: "var(--text-primary)",
              colorMutedForeground: "var(--text-secondary)",
              colorDanger: "var(--state-error)",
              colorBorder: "var(--border-default)",
              colorRing: "var(--accent-primary)",
              borderRadius: "var(--radius)",
              fontFamily: "var(--font-sans)",
              fontFamilyButtons: "var(--font-sans)",
            },
            elements: {
              cardBox:
                "bg-surface border border-surface-border shadow-none rounded-3xl",
              card: "bg-surface text-copy-primary font-sans",
              headerTitle:
                "font-sans text-copy-primary tracking-normal font-semibold",
              headerSubtitle: "font-sans text-copy-muted",
              socialButtonsBlockButton:
                "bg-base border-surface-border text-copy-secondary font-sans",
              formFieldLabel: "font-sans text-copy-primary",
              formFieldInput:
                "bg-elevated border-surface-border text-copy-primary font-sans",
              formButtonPrimary:
                "bg-brand text-primary-foreground font-sans font-semibold",
              footerActionText: "font-sans text-copy-muted",
              footerActionLink: "font-sans text-brand font-semibold",
            },
          }}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/editor"
          signUpFallbackRedirectUrl="/editor"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
