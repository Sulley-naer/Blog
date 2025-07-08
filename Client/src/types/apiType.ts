import type { Ref } from 'vue'
export interface TLoginResponse extends Ref<TLoginResponse> {
  code: number
  message: string
  data: string
}
