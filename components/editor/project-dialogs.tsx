"use client";

import { type FormEvent } from "react";
import { Trash2 } from "lucide-react";

import { EditorDialogPattern } from "@/components/editor/editor-dialog-pattern";
import { type MockProject } from "@/components/editor/use-project-dialogs";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ProjectDialogsProps {
  activeProject: MockProject | null;
  dialogMode: "create" | "rename" | "delete" | null;
  isLoading: boolean;
  projectName: string;
  slugPreview: string;
  onClose: () => void;
  onProjectNameChange: (value: string) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteConfirm: () => void;
  onRenameSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const createFormId = "create-project-form";
const renameFormId = "rename-project-form";

export function ProjectDialogs({
  activeProject,
  dialogMode,
  isLoading,
  projectName,
  slugPreview,
  onClose,
  onProjectNameChange,
  onCreateSubmit,
  onDeleteConfirm,
  onRenameSubmit,
}: ProjectDialogsProps) {
  return (
    <>
      <Dialog open={dialogMode === "create"} onOpenChange={(open) => !open && onClose()}>
        <EditorDialogPattern
          title="Create Project"
          description="Name the architecture workspace before opening the canvas."
          footerActions={
            <>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form={createFormId}
                disabled={isLoading || !projectName.trim()}
              >
                Create Project
              </Button>
            </>
          }
        >
          <form id={createFormId} className="space-y-4" onSubmit={onCreateSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="create-project-name"
                className="text-sm font-medium text-copy-secondary"
              >
                Project name
              </label>
              <Input
                id="create-project-name"
                value={projectName}
                autoFocus
                placeholder="Customer data platform"
                onChange={(event) => onProjectNameChange(event.target.value)}
                className="text-copy-secondary"
              />
            </div>
            <div className="rounded-xl border border-surface-border bg-subtle px-3 py-2">
              <p className="text-xs uppercase tracking-normal text-copy-faint">
                Slug preview
              </p>
              <p className="mt-1 font-mono text-sm text-brand">{slugPreview}</p>
            </div>
          </form>
        </EditorDialogPattern>
      </Dialog>

      <Dialog open={dialogMode === "rename"} onOpenChange={(open) => !open && onClose()}>
        <EditorDialogPattern
          title="Rename Project"
          description={`Current project: ${activeProject?.name ?? "Unknown project"}`}
          footerActions={
            <>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form={renameFormId}
                disabled={isLoading || !projectName.trim()}
              >
                Save Name
              </Button>
            </>
          }
        >
          <form id={renameFormId} className="space-y-2" onSubmit={onRenameSubmit}>
            <label
              htmlFor="rename-project-name"
              className="text-sm font-medium text-copy-secondary"
            >
              Project name
            </label>
            <Input
              id="rename-project-name"
              value={projectName}
              autoFocus
              onChange={(event) => onProjectNameChange(event.target.value)}
              className="text-copy-secondary"
            />
          </form>
        </EditorDialogPattern>
      </Dialog>

      <Dialog open={dialogMode === "delete"} onOpenChange={(open) => !open && onClose()}>
        <EditorDialogPattern
          title="Delete Project"
          description={`This will remove ${activeProject?.name ?? "this project"} from the mock project list.`}
          footerActions={
            <>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isLoading}
                onClick={onDeleteConfirm}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete Project
              </Button>
            </>
          }
        />
      </Dialog>
    </>
  );
}
