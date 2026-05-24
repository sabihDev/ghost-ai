import type { ReactNode } from "react";
import { Bot, FileText, Network, Users } from "lucide-react";

interface AuthPageShellProps {
  children: ReactNode;
}

const features = [
  {
    icon: Bot,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="grid min-h-screen bg-base font-sans text-copy-primary lg:grid-cols-2">
      <section className="hidden border-r border-surface-border bg-subtle px-8 py-8 lg:flex lg:flex-col lg:justify-between xl:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-base font-semibold text-primary-foreground shadow-[0_0_0_1px_var(--accent-primary-dim)]">
            <Network className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold tracking-normal text-copy-primary">
            Ghost AI
          </span>
        </div>

        <div className="max-w-[44rem] space-y-12">
          <div className="space-y-4">
            <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-normal text-copy-primary">
              Design systems at the speed of thought.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-copy-muted">
              Describe your architecture in plain English. Ghost AI maps it to
              a shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="space-y-8">
            {features.map(({ description, icon: Icon, title }) => (
              <li key={title} className="flex gap-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-accent-dim text-brand">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-semibold tracking-normal text-copy-secondary">
                    {title}
                  </h2>
                  <p className="max-w-2xl text-sm leading-6 text-copy-muted">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-muted">
          &copy; 2026 Ghost AI. All rights reserved.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-base px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-[420px]">{children}</div>
      </section>
    </main>
  );
}
