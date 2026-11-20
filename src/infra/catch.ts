import { NextResponse } from "next/server"
type Handler = (req: Request) => Promise<Response>
export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}
export const withErrorHandling = (handler: Handler): Handler => async (req) => {
  try { return await handler(req) } catch (err) {
    if (err instanceof HttpError) return NextResponse.json({ error: err.message }, { status: err.status })
    if (err instanceof SyntaxError) return NextResponse.json({ error: "request body must be valid json" }, { status: 400 })
    console.error(err)
    return NextResponse.json({ error: "something went wrong" }, { status: 500 })
  }
}
