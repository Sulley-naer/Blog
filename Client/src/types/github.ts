export interface GitHubContent {
  name: string
  path: string
  sha: string
  type: 'file' | 'dir'
  html_url: string
  size: number
  download_url: string | null
}
