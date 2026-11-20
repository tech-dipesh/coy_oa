import { z } from "zod"
export const intents = ["explore", "dating", "longterm"] as const
const profileId = z.int("Please enter a profile id, for example 3").positive("Please enter a valid profile id, for example 3")
const pass = z.object({ profileId, action: z.literal("pass") })
const like = z.object({
  profileId,
  action: z.literal("like"),
  intent: z.enum(intents, "Please enter a valid intent, for example dating"),
  note: z.string("Please enter a note").trim().max(120, "Please enter at most 120 characters for the note").optional(),
})
export const swipeSchema = z.discriminatedUnion("action", [pass, like], "Please enter a valid action, for example like")
export type Swipe = z.infer<typeof swipeSchema>
