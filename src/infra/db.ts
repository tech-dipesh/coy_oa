import { Pool } from "pg"
import { env } from "@/infra/env"
export const pool = new Pool({ connectionString: env.DB_URL, max: 5 })
export const query = async <T>(text: string, params: unknown[] = []): Promise<T[]> => (await pool.query(text, params)).rows
