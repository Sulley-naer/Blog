import { ref } from 'vue'

const _url = "https://api.example.com"

export interface UseFetchOptions extends Omit<RequestInit, 'body'> {
  timeout?: number // 超时时间（毫秒）
  body?: any // 允许对象字面量
}

export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    data.value = null
    const { timeout, body, headers, ...rest } = options
    let fetchOptions: RequestInit = { ...rest }
    let controller: AbortController | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    // 自动 JSON.stringify body
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      fetchOptions.body = JSON.stringify(body)
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...(headers || {})
      }
    } else if (body !== undefined) {
      fetchOptions.body = body as any
      if (headers) fetchOptions.headers = headers
    } else if (headers) {
      fetchOptions.headers = headers
    }
    if (timeout) {
      controller = new AbortController()
      fetchOptions.signal = controller.signal
      timer = setTimeout(() => {
        controller!.abort()
      }, timeout)
    }
    try {
      const response = await fetch(_url+url, fetchOptions)
      if (!response.ok) throw new Error(response.statusText)
      // 自动按 content-type 判断是否 json
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data.value = await response.json()
      } else {
        // @ts-ignore
        data.value = await response.text()
      }
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
      if (timer) clearTimeout(timer)
    }
  }

  // 立即请求
  fetchData()

  return { data, error, loading, refetch: fetchData }
}
