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
        getGithubContentsWithCache(`/github-api/repos/Sulley-naer/Naer-Notes/contents/${folder.path}`, 5 * 60 * 1000, false).catch(err => {
          console.warn(`预加载文件夹 ${folder.name} 失败:`, err);
        })
      )
    );

    // 预加载成功时打印信息
    console.log(`预加载文件夹结构成功，共加载 ${folders.length} 个文件夹`);
  } catch (error) {
    console.warn('预加载文件夹结构失败:', error);
  }
}
