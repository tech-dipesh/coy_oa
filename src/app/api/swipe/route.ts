import { NextResponse } from "next/server"
import { z } from "zod"
import { withErrorHandling } from "@/infra/catch"
import { swipeSchema } from "@/discover/schema"
import { saveSwipe } from "@/discover/service"
export const POST = withErrorHandling(async (req) => {
  const parsed = swipeSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: z.flattenError(parsed.error) }, { status: 400 })
  return NextResponse.json(await saveSwipe(parsed.data))
})
