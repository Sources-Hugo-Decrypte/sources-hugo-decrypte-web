import { useEffect, useState } from "react"

function useFetch<T>(url: string): [T, boolean] {

    const [data, setData] = useState<T>({} as T)
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      (async function () {
        const response = await fetch(url)
        const responseData: T = await response.json()
  
        if (response.ok) {
          setData(d => d = responseData)
          setLoading(loading => loading = false)
        } else {
          // TODO: Handle error
        }
      })()
    }, [url])
  
    return [
      data,
      loading
    ]
  }

  export default useFetch