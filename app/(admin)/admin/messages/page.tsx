import { getContactMessages } from "@/lib/actions/contact"
import { formatDate } from "@/lib/utils/format"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Clock } from "lucide-react"

export const metadata = { title: "Messages | Admin" }
export const dynamic = "force-dynamic"

export default async function MessagesPage() {
  const { data: messages, total } = await getContactMessages(1, 50)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} message{total !== 1 ? "s" : ""} total</p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Mail className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">No messages yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 transition-colors ${
                msg.is_read ? "border-border bg-card/50" : "border-primary/20 bg-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary border border-border">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{msg.name}</p>
                    <p className="text-xs text-muted-foreground">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!msg.is_read && <Badge variant="blue" className="text-xs">New</Badge>}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(msg.created_at)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
              {(msg.company || msg.role) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {[msg.role, msg.company].filter(Boolean).join(" at ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
