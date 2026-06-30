import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell";
import {
  getAccessibleProject,
  getCurrentClerkIdentity,
} from "@/lib/project-access";
import { getEditorProjectLists } from "@/lib/projects";

interface EditorWorkspacePageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function EditorWorkspacePage({
  params,
}: EditorWorkspacePageProps) {
  const { roomId } = await params;
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const project = await getAccessibleProject(roomId, identity);

  if (!project) {
    return <AccessDenied />;
  }

  const projectLists = await getEditorProjectLists();

  return <EditorWorkspaceShell project={project} {...projectLists} />;
}
