// src/utils/useFetch.ts

import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter.js'

export interface UseFetchOptions extends Omit<RequestInit, 'body'> {
  timeout?: number // 超时时间（毫秒）
  body?: unknown // 允许对象字面量
}

export function useLazyFetch<T = unknown>(url: string, options: UseFetchOptions = {}) {
  const store = useCounterStore()
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const _url = 'http://127.0.0.1:8080/auth'
  const finalUrl = url.startsWith('http') ? url : _url + url

  const fetchData = async (): Promise<T | null> => {
    store.toggleAwaitLoad()
    loading.value = true
    error.value = null
    data.value = null

    const { timeout, body, headers, ...rest } = options
    const fetchOptions: RequestInit = { ...rest }
    let controller: AbortController | undefined
    let timer: ReturnType<typeof setTimeout> | undefined

    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      fetchOptions.body = JSON.stringify(body)
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...headers,
      }
    } else if (body !== undefined) {
      fetchOptions.body = body as RequestInit['body']
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
      const response = await fetch(finalUrl, fetchOptions)
      if (!response.ok) throw new Error(response.statusText)

      const contentType = response.headers.get('content-type')
      const responseData = contentType?.includes('application/json')
        ? await response.json()
        : await response.text()

      data.value = responseData as T
      store.toggleAwaitLoad()
      return data.value
    } catch (err) {
      store.toggleAwaitLoad()
      if (err instanceof Error) {
        error.value = err
        throw err
      } else if (typeof err === 'string') {
        error.value = new Error(err)
        throw error.value
      } else {
        error.value = new Error('Unknown error')
        throw error.value
      }
    } finally {
      loading.value = false
      if (timer) clearTimeout(timer)
    }
  }

  return { data, error, loading, refetch: fetchData }
}
