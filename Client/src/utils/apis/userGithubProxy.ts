import { createAxiosInstance } from '../useAxios'
import { AxiosResponse } from 'axios'
import { GitHubContent } from '@/types/github' // 导入GitHubContent类型


/**
 * 通过本地代理服务器获取GitHub内容
 * @param url - GitHub API URL
 * @param enableLoading - 是否启用全局loading，默认为true
 * @returns Promise<AxiosResponse>
 */
export const getGithubContentsViaProxy = async (
  url: string,
  enableLoading: boolean = true,
): Promise<AxiosResponse> => {
  // 创建axios实例
  const instance = createAxiosInstance({
    timeout: 10000, // 10秒超时
    retries: 3, // 重试3次
    enableLoading, // 传递loading配置
  })

  try {
    // 通过Vite代理发送请求，而不是直接访问本地服务器
    const response = await instance.post('/github-proxy/api/github-proxy', { url })

    // 检查响应是否成功
    if (!response.data.success) {
      throw new Error(response.data.message || '请求失败')
    }

    // 返回处理后的响应
    return {
      ...response,
      data: response.data.data,
    }
  } catch (error) {
    console.error('通过代理获取GitHub内容失败:', error)
    throw error
  }
}

/**
 * 通过本地代理服务器获取GitHub内容(带缓存版本)
 * @param url - GitHub API URL
 * @param cacheTime - 缓存时间(毫秒)
 * @param enableLoading - 是否启用全局loading，默认为true
 * @returns Promise<AxiosResponse>
 */
export const getGithubContentsViaProxyWithCache = async (
  url: string,
  cacheTime: number = 5 * 60 * 1000, // 默认5分钟缓存
  enableLoading: boolean = true,
): Promise<AxiosResponse> => {
  // 生成缓存键
  const cacheKey = `proxy:${url}`

  // 检查localStorage中是否有有效缓存
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < cacheTime) {
      // 返回缓存数据
      return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse
    }
  }

  try {
    // 获取最新数据
    const response = await getGithubContentsViaProxy(url, enableLoading)

    // 缓存数据
    const cacheData = {
      data: response.data,
      timestamp: Date.now(),
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))

    return response
  } catch (error) {
    console.error('通过代理获取GitHub内容失败:', error)
    throw error
  }
}

/**
 * 通过本地代理服务器预加载所有文件夹的树结构（静默加载，不显示loading）
 * @param rootUrl - 根目录URL
 * @returns Promise<void>
 */
export const preloadFolderStructureViaProxy = async (
  rootUrl: string = 'https://api.github.com/repos/Sulley-naer/Naer-Notes/contents',
): Promise<void> => {
  try {
    // 获取根目录内容
    const rootResponse = await getGithubContentsViaProxyWithCache(rootUrl, 5 * 60 * 1000, false) // 静默加载，5分钟缓存

    // 过滤出文件夹
    const folders = rootResponse.data.filter((item: GitHubContent) => item.type === 'dir')

    // 并行预加载所有文件夹的内容（静默加载）
    await Promise.all(
      folders.map((folder: GitHubContent) =>
        getGithubContentsViaProxyWithCache(folder.url, 5 * 60 * 1000, false).catch((err) => {
          console.warn(`预加载文件夹 ${folder.name} 失败:`, err)
        }),
      ),
    )

    // 预加载成功时打印信息
    console.log(`预加载文件夹结构成功，共加载 ${folders.length} 个文件夹`)
  } catch (error) {
    console.warn('预加载文件夹结构失败:', error)
  }
}
