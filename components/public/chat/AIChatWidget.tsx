"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserRound, Send, X, Loader2, Minimize2, Square } from "lucide-react"
import { cn } from "@/lib/utils/cn"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

let idCounter = 1
function genId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `m${idCounter++}-${performance.now()}`
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => abortControllerRef.current?.abort(), [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { id: genId(), role: "user", content: input.trim() }
    const assistantId = genId()

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setRequestError("")

    const assistantMessage: Message = { id: assistantId, role: "assistant", content: "" }
    setMessages((prev) => [...prev, assistantMessage])

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to AI")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      const processLine = (line: string) => {
        const trimmed = line.trim()
        if (!trimmed.startsWith("data: ")) return

        const data = trimmed.slice(6).trim()
        if (data === "[DONE]") return

        try {
          const parsed = JSON.parse(data)
          const delta = parsed.choices?.[0]?.delta?.content || ""
          if (delta) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + delta } : m
              )
            )
          }
        } catch {
          // Skip malformed SSE data
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Accumulate and only process complete lines — an SSE "data:" line
        // can be split across network reads, so we keep the trailing partial
        // line in the buffer until the rest of it arrives.
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) processLine(line)
      }

      // Flush any remaining buffered line once the stream ends.
      buffer += decoder.decode()
      if (buffer) processLine(buffer)
    } catch (error) {
      if (controller.signal.aborted) {
        setMessages((prev) => prev.filter((message) => message.id !== assistantId || message.content))
      } else {
        setMessages((prev) => prev.filter((message) => message.id !== assistantId))
        setRequestError(error instanceof Error ? error.message : "Unable to connect to chat service")
      }
    } finally {
      if (abortControllerRef.current === controller) abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  function stopResponse() {
    abortControllerRef.current?.abort()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex flex-col h-[32rem] max-h-[calc(100vh-11rem)] w-[22rem] sm:w-[27rem] max-w-[calc(100vw-3rem)] rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/50 bg-gradient-to-r from-primary/10 to-purple/10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                  <UserRound className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Sachin&apos;s Assistant</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-border">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                      <UserRound className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-secondary text-foreground rounded-tl-sm"
                    )}
                  >
                    {msg.content || (
                      <span className="flex gap-1 items-center py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="flex shrink-0 items-center gap-2 border-t border-border/40 p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                disabled={isLoading}
                className="flex-1 rounded-lg border border-primary/40 bg-background/40 px-3 py-2 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/70 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </button>
              {isLoading && (
                <button
                  type="button"
                  onClick={stopResponse}
                  className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border px-2 text-xs text-foreground hover:bg-accent"
                  aria-label="Stop response"
                  title="Stop response"
                >
                  <Square className="h-3 w-3 fill-current" />
                  Stop
                </button>
              )}
            </form>
            {requestError && <p role="alert" className="px-3 pb-3 text-xs text-destructive">{requestError}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300",
          open
            ? "bg-secondary border border-border text-muted-foreground"
            : "bg-gradient-to-br from-primary to-purple text-white shadow-primary/30"
        )}
        aria-label="Chat with Sachin's assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <UserRound className="h-7 w-7" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
