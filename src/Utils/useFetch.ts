import { useEffect, useState } from "react"

type FetchResult<T> = {
  data: T,
  isLoading: boolean,
  error: string | null
}

function useFetch<T>(url: string): FetchResult<T> {

  const [data, setData] = useState<T>({} as T)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async function () {

      try {
        const response = await fetch(url)

        if (response.ok) {
          const responseData: T = await response.json()

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

  return {
    data,
    isLoading,
    error
  }
}

export default useFetch