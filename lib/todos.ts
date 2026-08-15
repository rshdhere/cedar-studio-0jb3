export type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
};

const globalStore = globalThis as typeof globalThis & {
  __cedarTodos?: Todo[];
};

function store(): Todo[] {
  if (!globalStore.__cedarTodos) {
    globalStore.__cedarTodos = [
      {
        id: "welcome",
        title: "Try Cedar Todos — add, complete, delete",
        done: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return globalStore.__cedarTodos;
}

export function listTodos(): Todo[] {
  return [...store()].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });
}

export function createTodo(title: string): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: title.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  store().unshift(todo);
  return todo;
}

export function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "done">>,
): Todo | null {
  const todos = store();
  const index = todos.findIndex((t) => t.id === id);
  if (index < 0) return null;
  const current = todos[index];
  const next: Todo = {
    ...current,
    ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
    ...(patch.done !== undefined ? { done: patch.done } : {}),
  };
  todos[index] = next;
  return next;
}

export function deleteTodo(id: string): boolean {
  const todos = store();
  const index = todos.findIndex((t) => t.id === id);
  if (index < 0) return false;
  todos.splice(index, 1);
  return true;
}
