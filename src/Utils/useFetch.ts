import { useEffect, useState } from "react"

type FetchResult<T> = {
  data: T,
  isLoading: boolean,
  error: string | null
}

function useFetch<T>(url: string): FetchResult<T> {

  const [result, setResult] = useState({
    data: {} as T,
    isLoading: true,
    error: null
  } as FetchResult<T>)

  useEffect(() => {
    (async function () {

      try {
        const response = await fetch(url)

        if (response.ok) {
          const responseData: T = await response.json()

          setResult(res => res = { ...res, data: responseData, isLoading: false })
        } else {
          setResult(res => res = { ...res, error: `Error ${response.status}: ${response.statusText}.` })
        }
      } catch (error) {
        let message = ''

        if (error instanceof Error) message = error.message
        else message = String(error)
        setResult(res => res = { ...res, error: message })
      }
    })()
  }, [url])

  return result
}

export default useFetch