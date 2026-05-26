import { EditorShell } from "@/components/editor/editor-shell";
import { getEditorProjectLists } from "@/lib/projects";

interface EditorWorkspacePageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditorWorkspacePage({
  params,
}: EditorWorkspacePageProps) {
  const [{ projectId }, projectLists] = await Promise.all([
    params,
    getEditorProjectLists(),
  ]);

  return <EditorShell activeProjectId={projectId} {...projectLists} />;
}
