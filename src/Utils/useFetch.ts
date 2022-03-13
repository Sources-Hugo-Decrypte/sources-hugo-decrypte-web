import { useEffect, useState } from "react"

type FetchResult<T> = {
  data: T,
  isLoading: boolean,
  error: string | null
}

function useFetch<T>(url: string, storeInCache: boolean = false): FetchResult<T> {

  const [result, setResult] = useState({
    data: {} as T,
    isLoading: true,
    error: null
  } as FetchResult<T>)
  const cacheKey = `cache::${url}`

  useEffect(() => {
    const cachedString = storeInCache ? sessionStorage.getItem(cacheKey) : null

    if (cachedString !== null) {
      setResult(res => res = { ...res, data: JSON.parse(cachedString) as T, isLoading: false })
    } else {
      (async function () {

        try {
          const response = await fetch(url)

          if (response.ok) {
            const responseData: T = await response.json()

            if (storeInCache) {
              sessionStorage.setItem(cacheKey, JSON.stringify(responseData))
            }
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
    }

  }, [url, storeInCache, cacheKey])

  return result
}

export default useFetch