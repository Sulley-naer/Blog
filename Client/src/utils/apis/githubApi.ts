import { getWithCache, createAxiosInstance } from '../useAxios'
import { AxiosResponse } from 'axios'
import { GitHubContent } from '@/types/github' // 导入GitHubContent类型

const GITHUB_API_URL = '/github-api'

/**
 * 获取GitHub仓库内容
 * @param url - GitHub API URL
 * @param enableLoading - 是否启用全局loading，默认为true
 * @returns Promise<AxiosResponse>
 */
export const getGithubContents = async (
  url: string = `${GITHUB_API_URL}/repos/Sulley-naer/Naer-Notes/contents`,
  enableLoading: boolean = true, // 添加可选的全局loading配置
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
    enableLoading, // 传递loading配置
  })

  // 设置请求头 - 修复：使用Bearer格式
  instance.defaults.headers.common['Authorization'] = `Bearer ${githubToken}`
  instance.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json'

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
 * @param enableLoading - 是否启用全局loading，默认为true
 * @returns Promise<AxiosResponse>
 */
export const getGithubContentsWithCache = async (
  url: string = `${GITHUB_API_URL}/repos/Sulley-naer/Naer-Notes/contents`,
  cacheTime: number = 5 * 60 * 1000, // 默认5分钟缓存
  enableLoading: boolean = true, // 添加可选的全局loading配置
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
      },
    },
    cacheTime,
    enableLoading, // 传递loading配置
  )
}

/**
 * 预加载所有文件夹的树结构（静默加载，不显示loading）
 * @param rootUrl - 根目录URL
 * @returns Promise<void>
 */
export const preloadFolderStructure = async (
  rootUrl: string = `${GITHUB_API_URL}/repos/Sulley-naer/Naer-Notes/contents`
): Promise<void> => {
  try {
    // 获取根目录内容
    const rootResponse = await getGithubContentsWithCache(rootUrl, 5 * 60 * 1000, false); // 静默加载，5分钟缓存

    // 过滤出文件夹
    const folders = (rootResponse.data as GitHubContent[]).filter((item) => item.type === 'dir');

    // 并行预加载所有文件夹的内容（静默加载）
    await Promise.all(
      folders.map((folder) =>
        getGithubContentsWithCache(folder.url, 5 * 60 * 1000, false).catch((err) => {
          console.warn(`预加载文件夹 ${folder.name} 失败:`, err)
        }),
      ),
    )

    // 预加载成功时打印信息
    console.log(`预加载文件夹结构成功，共加载 ${folders.length} 个文件夹`);
  } catch (error) {
    console.warn('预加载文件夹结构失败:', error);
  }
}
