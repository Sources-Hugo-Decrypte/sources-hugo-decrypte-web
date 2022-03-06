import { useEffect, useState } from "react"

function useFetch<T>(url: string): [T, boolean, string | null] {

  const [data, setData] = useState<T>({} as T)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async function () {

      try {
        const response = await fetch(url)
        const responseData: T = await response.json()

        if (response.ok) {
          setData(d => d = responseData)
          setLoading(loading => loading = false)
        } else {
          setError(e => e = `Error ${response.status}: ${response.statusText}.`)
        }
      } catch (error) {
        let message = ''

        if (error instanceof Error) message = error.message
        else message = String(error)
        setError(e => e = message)
      }
    })()
  }, [url])

  return [
    data,
    loading,
    error
  ]
}

export default useFetch