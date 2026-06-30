"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Loader2,
  MailPlus,
  Trash2,
  Users,
} from "lucide-react";

import { EditorDialogPattern } from "@/components/editor/editor-dialog-pattern";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
  isOpen: boolean;
  projectId: string;
  projectName: string;
  onOpenChange: (open: boolean) => void;
}

interface Collaborator {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

interface ProjectOwner {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

interface CollaboratorsResponse {
  owner: ProjectOwner;
  collaborators: Collaborator[];
  canManageAccess: boolean;
}

const inviteFormId = "invite-collaborator-form";

function getInitial(label: string) {
  return label.charAt(0).toUpperCase();
}

export function ShareDialog({
  isOpen,
  projectId,
  projectName,
  onOpenChange,
}: ShareDialogProps) {
  const [owner, setOwner] = useState<ProjectOwner | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [canManageAccess, setCanManageAccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const projectLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/editor/${projectId}`;
  }, [projectId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;

    async function loadCollaborators() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/projects/${projectId}/collaborators`);

        if (!response.ok) {
          throw new Error("Unable to load collaborators.");
        }

        const data = (await response.json()) as CollaboratorsResponse;

        if (isMounted) {
          setOwner(data.owner);
          setCollaborators(data.collaborators);
          setCanManageAccess(data.canManageAccess);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load collaborators."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCollaborators();

    return () => {
      isMounted = false;
    };
  }, [isOpen, projectId]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 1600);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  async function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Unable to invite collaborator.");
      }

      const data = (await response.json()) as {
        collaborator: Collaborator;
        canManageAccess: boolean;
      };

      setCanManageAccess(data.canManageAccess);
      setCollaborators((current) => {
        const withoutDuplicate = current.filter(
          (collaborator) => collaborator.id !== data.collaborator.id
        );

        return [...withoutDuplicate, data.collaborator];
      });
      setEmail("");
    } catch (inviteError) {
      setError(
        inviteError instanceof Error
          ? inviteError.message
          : "Unable to invite collaborator."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    setRemovingId(collaboratorId);
    setError("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Unable to remove collaborator.");
      }

      setCollaborators((current) =>
        current.filter((collaborator) => collaborator.id !== collaboratorId)
      );
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove collaborator."
      );
    } finally {
      setRemovingId(null);
    }
  }

  async function copyProjectLink() {
    setError("");

    try {
      await navigator.clipboard.writeText(projectLink || window.location.href);
      setCopied(true);
    } catch {
      setError("Unable to copy the project link.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <EditorDialogPattern
        title="Share Project"
        description={`Manage access for ${projectName}.`}
        className="sm:max-w-lg"
        footerActions={
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        }
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-surface-border bg-surface p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-brand">
                <Clipboard className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-copy-primary">Project link</p>
                <p className="truncate font-mono text-xs text-copy-muted">
                  {projectLink}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={copyProjectLink}>
                {copied ? (
                  <Check className="h-4 w-4 text-state-success" aria-hidden="true" />
                ) : (
                  <Clipboard className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {canManageAccess ? (
            <form
              id={inviteFormId}
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={submitInvite}
            >
              <label htmlFor="collaborator-email" className="sr-only">
                Collaborator email
              </label>
              <Input
                id="collaborator-email"
                type="email"
                value={email}
                placeholder="teammate@example.com"
                className="text-copy-secondary"
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button
                type="submit"
                form={inviteFormId}
                disabled={isSubmitting || !email.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MailPlus className="h-4 w-4" aria-hidden="true" />
                )}
                Invite
              </Button>
            </form>
          ) : (
            <div className="rounded-2xl border border-surface-border bg-surface px-3 py-2 text-sm text-copy-muted">
              You can view collaborators, but only the project owner can manage
              access.
            </div>
          )}

          {error ? (
            <p className="rounded-xl border border-state-error/50 bg-surface px-3 py-2 text-sm text-state-error">
              {error}
            </p>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-copy-muted" aria-hidden="true" />
              <h3 className="text-sm font-medium text-copy-secondary">
                Collaborators
              </h3>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {isLoading ? (
                <div className="flex items-center gap-2 rounded-2xl border border-surface-border bg-surface px-3 py-3 text-sm text-copy-muted">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading collaborators
                </div>
              ) : owner || collaborators.length > 0 ? (
                <>
                  {owner ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-brand bg-accent-dim px-3 py-2">
                      {owner.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={owner.avatarUrl}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-sm font-semibold text-copy-secondary">
                          {getInitial(owner.displayName ?? owner.email ?? "Owner")}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-copy-primary">
                            {owner.displayName ?? owner.email ?? owner.id}
                          </p>
                          <span className="shrink-0 rounded-xl border border-brand/40 bg-surface px-2 py-0.5 text-xs font-medium text-brand">
                            Owner
                          </span>
                        </div>
                        {owner.email && owner.displayName ? (
                          <p className="truncate text-xs text-copy-muted">
                            {owner.email}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface px-3 py-2"
                  >
                    {collaborator.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={collaborator.avatarUrl}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-sm font-semibold text-copy-secondary">
                        {getInitial(collaborator.email)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-copy-primary">
                        {collaborator.displayName ?? collaborator.email}
                      </p>
                      {collaborator.displayName ? (
                        <p className="truncate text-xs text-copy-muted">
                          {collaborator.email}
                        </p>
                      ) : null}
                    </div>

                    {canManageAccess ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${collaborator.email}`}
                        disabled={removingId === collaborator.id}
                        onClick={() => removeCollaborator(collaborator.id)}
                      >
                        {removingId === collaborator.id ? (
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    ) : null}
                  </div>
                  ))}
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-surface-border-subtle bg-surface px-3 py-6 text-center text-sm text-copy-muted">
                  No collaborators yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </EditorDialogPattern>
    </Dialog>
  );
}
