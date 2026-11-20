import { neon } from "@neondatabase/serverless"
import { env } from "@/infra/env"
export const sql = neon(env.DB_URL)
export const query = async <T>(text: string, params: unknown[] = []) => (await sql.query(text, params)) as unknown as T[]
