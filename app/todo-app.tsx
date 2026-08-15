"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Todo } from "@/lib/types";
import styles from "./todo-app.module.css";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/todos", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load todos");
      const data = (await res.json()) as { todos: Todo[] };
      setTodos(data.todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = title.trim();
    if (!next) return;
    setError(null);
    setBusyId("new");
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: next }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Could not add todo");
      }
      setTitle("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add todo");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleDone(todo: Todo) {
    setBusyId(todo.id);
    setError(null);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !todo.done }),
      });
      if (!res.ok) throw new Error("Could not update todo");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update todo");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(todo: Todo) {
    setBusyId(todo.id);
    setError(null);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete todo");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete todo");
    } finally {
      setBusyId(null);
    }
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <main className={styles.shell}>
      <header className={styles.hero}>
        <p className={styles.brand}>Cedar Todos</p>
        <h1 className={styles.headline}>What needs doing?</h1>
        <p className={styles.lede}>
          Capture tasks, check them off, and clear the noise — all in one place.
        </p>
      </header>

      <section className={styles.board} aria-label="Todo list">
        <form className={styles.composer} onSubmit={onSubmit}>
          <label className={styles.srOnly} htmlFor="todo-title">
            New todo
          </label>
          <input
            id="todo-title"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task…"
            maxLength={200}
            autoComplete="off"
            disabled={busyId === "new"}
          />
          <button
            className={styles.add}
            type="submit"
            disabled={!title.trim() || busyId === "new"}
          >
            Add
          </button>
        </form>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <div className={styles.meta}>
          <span>
            {loading
              ? "Loading…"
              : remaining === 0
                ? "All clear"
                : `${remaining} open`}
          </span>
          <span>{todos.length} total</span>
        </div>

        <ul className={styles.list}>
          {todos.map((todo, index) => (
            <li
              key={todo.id}
              className={`${styles.item} ${todo.done ? styles.done : ""}`}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <button
                type="button"
                className={styles.check}
                aria-pressed={todo.done}
                aria-label={todo.done ? "Mark incomplete" : "Mark complete"}
                disabled={busyId === todo.id}
                onClick={() => void toggleDone(todo)}
              >
                <span className={styles.checkMark} aria-hidden="true">
                  {todo.done ? "✓" : ""}
                </span>
              </button>
              <span className={styles.title}>{todo.title}</span>
              <button
                type="button"
                className={styles.delete}
                aria-label={`Delete ${todo.title}`}
                disabled={busyId === todo.id}
                onClick={() => void remove(todo)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {!loading && todos.length === 0 ? (
          <p className={styles.empty}>Nothing here yet. Add your first task above.</p>
        ) : null}
      </section>
    </main>
  );
}
