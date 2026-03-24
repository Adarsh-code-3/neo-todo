"use client"

import { useState, useEffect, useRef } from "react"
import {
  Plus,
  Trash2,
  Check,
  Circle,
  Sun,
  Moon,
  ListFilter,
  Pencil,
  X,
  CheckCircle2,
  ClipboardList,
} from "lucide-react"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type FilterType = "all" | "active" | "completed"

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("neo-todo-items")
    if (saved) {
      try {
        setTodos(JSON.parse(saved))
      } catch {
        /* ignore */
      }
    }
    const theme = localStorage.getItem("neo-todo-theme")
    setIsDark(
      theme === "dark" ||
        (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    )
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("neo-todo-items", JSON.stringify(todos))
    }
  }, [todos, mounted])

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [editingId])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem("neo-todo-theme", next ? "dark" : "light")
    document.documentElement.classList.toggle("dark", next)
  }

  const addTodo = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ])
    setInput("")
    inputRef.current?.focus()
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (!editingId) return
    const trimmed = editText.trim()
    if (trimmed) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text: trimmed } : t))
      )
    }
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed
    if (filter === "completed") return t.completed
    return true
  })

  const activeCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length

  if (!mounted) return null

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-[#F43F5E] border-2 border-black dark:border-gray-300 rounded-xl shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#333]">
              <ClipboardList className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-[clamp(2rem,5vw+1rem,3.5rem)] font-extrabold tracking-tight leading-none">
              Neo Todo
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-300 rounded-xl shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#333] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] dark:hover:shadow-[6px_6px_0px_#333] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E] focus-visible:ring-offset-2"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-6 sm:mb-8">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-300 rounded-xl px-4 py-3 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#333] focus:outline-none focus:shadow-[4px_4px_0px_#000] dark:focus:shadow-[4px_4px_0px_#333] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150 ease-out placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base font-medium min-h-[48px]"
            autoFocus
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="flex items-center justify-center gap-2 bg-[#F43F5E] text-white font-semibold px-5 py-3 border-2 border-black dark:border-gray-300 rounded-xl shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#333] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] dark:hover:shadow-[6px_6px_0px_#333] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000] min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E] focus-visible:ring-offset-2"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Stats + Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold">
            <ListFilter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div className="flex bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-300 rounded-xl overflow-hidden shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#333]">
              {(["all", "active", "completed"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 font-semibold capitalize transition-colors duration-100 ease-out min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E] focus-visible:ring-inset ${
                    filter === f
                      ? "bg-[#F43F5E] text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <span>{activeCount} remaining</span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-[#F43F5E] hover:underline underline-offset-2 transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E] focus-visible:ring-offset-2 rounded"
              >
                Clear done ({completedCount})
              </button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-300 rounded-xl shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#333]">
              <CheckCircle2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-bold">
                {filter === "all"
                  ? "No tasks yet"
                  : filter === "active"
                    ? "All caught up"
                    : "Nothing completed yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                {filter === "all"
                  ? "Add your first task above to get started."
                  : filter === "active"
                    ? "You have finished all your tasks. Nice work."
                    : "Complete a task to see it here."}
              </p>
            </div>
          )}

          {filtered.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center gap-3 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-300 rounded-xl px-4 py-3 shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#333] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] dark:hover:shadow-[6px_6px_0px_#333] transition-all duration-200 ease-out ${
                todo.completed ? "opacity-70" : ""
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border-2 border-black dark:border-gray-300 transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E] focus-visible:ring-offset-2 min-h-[44px] min-w-[44px] -m-2 p-2"
                aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
              >
                {todo.completed ? (
                  <div className="w-8 h-8 rounded-lg bg-[#F43F5E] border-2 border-black dark:border-gray-300 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
              </button>

              {/* Text */}
              {editingId === todo.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    ref={editRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit()
                      if (e.key === "Escape") cancelEdit()
                    }}
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border-2 border-[#F43F5E] rounded-lg px-3 py-1.5 text-base font-medium focus:outline-none min-h-[36px]"
                  />
                  <button
                    onClick={saveEdit}
                    className="flex items-center justify-center w-9 h-9 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors duration-100 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E]"
                    aria-label="Save"
                  >
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center justify-center w-9 h-9 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-100 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E]"
                    aria-label="Cancel"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <span
                  className={`flex-1 text-base font-medium leading-relaxed ${
                    todo.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : ""
                  }`}
                >
                  {todo.text}
                </span>
              )}

              {/* Actions */}
              {editingId !== todo.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => startEdit(todo)}
                    className="flex items-center justify-center w-9 h-9 text-gray-500 dark:text-gray-400 hover:text-[#F43F5E] hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors duration-100 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E]"
                    aria-label="Edit task"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex items-center justify-center w-9 h-9 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-100 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E]"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400 dark:text-gray-500 font-medium">
          Built with precision. Ship fast, stay focused.
        </div>
      </div>
    </div>
  )
}
