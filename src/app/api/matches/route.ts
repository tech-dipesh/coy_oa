import { NextResponse } from "next/server"
import { withErrorHandling } from "@/infra/catch"
import { getMatches } from "@/discover/service"
export const GET = withErrorHandling(async () => NextResponse.json(await getMatches()))
