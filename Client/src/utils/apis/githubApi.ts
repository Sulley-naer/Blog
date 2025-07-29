import { getWithCache, createAxiosInstance } from '../useAxios'
import { AxiosResponse } from 'axios'

const GITHUB_API_URL = '/github-api'

/**
 * 获取GitHub仓库内容
 * @param url - GitHub API URL
 * @returns Promise<AxiosResponse>
 */
export const getGithubContents = async (
  url: string = `${GITHUB_API_URL}/repos/Sulley-naer/Naer-Notes/contents`,
): Promise<AxiosResponse> => {
  // 从环境变量中获取GitHub令牌
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN

  // 检查token是否存在
  if (!githubToken) {
    throw new Error('GitHub token未配置，请检查.env文件')
  }
  console.log("token",githubToken)
  // 创建带有特定配置的axios实例
  const instance = createAxiosInstance({
    timeout: 10000, // 10秒超时
    retries: 3, // 重试3次
  })

  // 设置请求头 - 修复：使用Bearer格式
  instance.defaults.headers.common['Authorization'] = `Bearer ${githubToken}`
  instance.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json'
  instance.defaults.headers.common['User-Agent'] = 'Naer-Blog-Client'

  try {
    // 发送请求
    const response = await instance.get(url)
    return response
  } catch (error) {
    console.error('获取GitHub内容失败:', error)
    throw error
  }
}

/**
 * 获取GitHub仓库内容(带缓存版本)
 * @param url - GitHub API URL
 * @param cacheTime - 缓存时间(毫秒)
 * @returns Promise<AxiosResponse>
 */
export const getGithubContentsWithCache = async (
  url: string = `${GITHUB_API_URL}/repos/Sulley-naer/Naer-Notes/contents`,
  cacheTime: number = 5 * 60 * 1000, // 默认5分钟缓存
): Promise<AxiosResponse> => {
  // 从环境变量中获取GitHub令牌
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN

  // 检查token是否存在
  if (!githubToken) {
    throw new Error('GitHub token未配置，请检查.env文件')
  }

  // 使用带缓存的请求 - 修复：使用Bearer格式
  return await getWithCache(
    url,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Naer-Blog-Client',
      },
    },
    cacheTime,
  )
}
