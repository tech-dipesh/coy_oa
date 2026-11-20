import { defineConfig, globalIgnores } from "eslint/config"
import next from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
export default defineConfig([...next, ...nextTs, { rules: { "@next/next/no-page-custom-font": "off" } }, globalIgnores([".next/**", "next-env.d.ts"])])
