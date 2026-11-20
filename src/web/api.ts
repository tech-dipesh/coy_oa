import axios from "axios"
import { useEffect, useState } from "react"
export const api = axios.create({ baseURL: "/api", timeout: 15000 })
export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState("")
  const [tries, setTries] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort();
      setError("request timed out")
    }, 15000)
    const load = async () => {
      try { setData((await api.get<T>(url, { signal: controller.signal })).data) } catch (err) { if (!axios.isCancel(err)) setError("could not load, please try again") } finally { clearTimeout(timer) }
    }
    load()
    return () => { clearTimeout(timer); controller.abort() }
  }, [url, tries])
  const reload = () => { setError(""); setTries(tries + 1) }
  return { data, setData, error, loading: !data && !error, reload }
}
