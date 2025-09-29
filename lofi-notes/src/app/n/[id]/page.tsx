// src/app/n/[id]/page.tsx
import NoteReader from "./reader";

export default function Page({ params }: { params: { id: string } }) {
  return <NoteReader id={params.id} />;
}
