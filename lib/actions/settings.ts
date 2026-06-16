"use server"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/server"
import type { Setting, ActionResult } from "@/lib/types"

export async function getSettings(): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data } = await supabase.from("settings").select("key, value")
  if (!data) return {}
  return Object.fromEntries(data.map((s) => [s.key, s.value]))
}

export async function getSetting(key: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.from("settings").select("value").eq("key", key).single()
  return data?.value ?? null
}

export async function updateSetting(key: string, value: string): Promise<ActionResult<Setting>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function getAllSettings(): Promise<ActionResult<Setting[]>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("settings").select("*").order("key")
  if (error) return { success: false, error: error.message }
  return { success: true, data: data ?? [] }
}
