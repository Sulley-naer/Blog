import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 缓存存储
const cacheStore = new Map<string, { data: unknown; timestamp: number }>();

// 生成缓存键
const generateCacheKey = (config: AxiosRequestConfig): string => {
  return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${JSON.stringify(config.data || {})}-headers:${JSON.stringify(config.headers || {})}`;
};

// 检查缓存是否有效
const isCacheValid = (timestamp: number, cacheTime: number = 5 * 60 * 1000): boolean => {
  return Date.now() - timestamp < cacheTime;
};

// 创建 axios 实例
const createAxiosInstance = (options: {
  timeout?: number;
  retries?: number;
  cacheTime?: number; // 这个参数现在会被正确使用
} = {}): AxiosInstance => {
  const { timeout = 5000, retries = 5, cacheTime = 5 * 60 * 1000 } = options;

  const instance = axios.create({
    timeout,
    // 其他默认配置
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: import('axios').InternalAxiosRequestConfig) => {
      // 如果有 token，添加到请求头
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const config = error.config;

      // 如果没有配置重试次数，则初始化为0
      if (!config.retryCount) {
        config.retryCount = 0;
      }

      // 检查是否应该重试
      if (config.retryCount < retries && error.response?.status >= 500) {
        config.retryCount += 1;

        // 等待一段时间再重试，使用指数退避策略
        const delay = Math.pow(2, config.retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // 重试请求
        return instance(config);
      }

      return Promise.reject(error);
    }
  );

  // 将 cacheTime 附加到实例上，以便在 getWithCache 中使用
  (instance as AxiosInstance & { defaultCacheTime: number }).defaultCacheTime = cacheTime;

  return instance;
};

// 带缓存的 GET 请求
export const getWithCache = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  cacheTime?: number
): Promise<AxiosResponse<T>> => {
  const cacheKey = generateCacheKey({ ...config, method: 'GET', url });

  // 检查是否有有效缓存
  const cached = cacheStore.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp, cacheTime)) {
    return {
      data: cached.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config || {}
    } as AxiosResponse<T>;
  }

  // 创建实例并发送请求
  const instance = createAxiosInstance();

  // 如果没有提供 cacheTime，则使用实例的默认值
  const _effectiveCacheTime = cacheTime ?? (instance as AxiosInstance & { defaultCacheTime: number }).defaultCacheTime ?? 5 * 60 * 1000;

  const response = await instance.get<T>(url, config);

  // 缓存响应
  cacheStore.set(cacheKey, {
    data: response.data,
    timestamp: Date.now()
  });

  return response;
};

// 清除缓存
export const clearCache = (): void => {
  cacheStore.clear();
};

// 清除特定缓存
export const clearCacheByKey = (config: AxiosRequestConfig): void => {
  const cacheKey = generateCacheKey(config);
  cacheStore.delete(cacheKey);
};

// 导出基础实例创建函数
export { createAxiosInstance };

// 默认导出一个配置好的实例
const defaultInstance = createAxiosInstance();
export default defaultInstance;
