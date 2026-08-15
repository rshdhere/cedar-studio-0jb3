import { NextResponse } from "next/server";
import { deleteTodo, updateTodo } from "@/lib/todos";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: { title?: string; done?: boolean } = {};
  if (
    typeof body === "object" &&
    body !== null &&
    "title" in body &&
    typeof (body as { title: unknown }).title === "string"
  ) {
    patch.title = (body as { title: string }).title;
  }
  if (
    typeof body === "object" &&
    body !== null &&
    "done" in body &&
    typeof (body as { done: unknown }).done === "boolean"
  ) {
    patch.done = (body as { done: boolean }).done;
  }

  if (patch.title !== undefined && !patch.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (patch.title === undefined && patch.done === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const todo = updateTodo(id, patch);
  if (!todo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ todo });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const ok = deleteTodo(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
