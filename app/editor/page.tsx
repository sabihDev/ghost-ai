import { EditorShell } from "@/components/editor/editor-shell";
import { getEditorProjectLists } from "@/lib/projects";

export default async function EditorPage() {
  const projectLists = await getEditorProjectLists();

  return <EditorShell {...projectLists} />;
}
