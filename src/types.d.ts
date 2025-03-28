export type Resource = FileResource | FolderResource

export interface BaseResource {
  drive_id: string
  file_id: string
  name: string
  parent_file_id: string
  sync_device_flag: boolean
}

export interface FileResource extends BaseResource {
  // video
  file_extension: string
  mime_type: string
  type: 'file'
}

export interface FolderResource extends BaseResource {
  type: 'folder'
}

/**
 * listen-url: fetch file list when url changes
 * manual-trigger: fetch file list when user clicks the button
 */
export type FetchMode = 'listen-url' | 'manual-trigger'

export interface ContainerInfo {
  el: Element | null
  style: string
  front: boolean
}

export interface Provider {
  /** max concurrent size */
  MAX_CONCURRENT?: number
  /** fetch timing */
  FETCH_MODE?: FetchMode
  /** hosts at which the provider will be enabled */
  HOSTS: string[]
  DRIVE_NAME: string
  /** intervals between file list page requests */
  getApiDelay?: (size: number) => number
  /** whether the rename button should be showed */
  shouldShowEntry: (url: string) => boolean
  /** API for file list */
  getFileListOfCurrentDir: () => Promise<Resource[]>
  /** API for rename single file */
  renameOne: (resource: Resource, newName: string) => Promise<void>
  /** what to do with the headers of normal requests of the website */
  setRequestHeader: (key: string, value: string) => void
  /** where to put the button into and how to style the wrapper */
  getContainer: () => ContainerInfo
  /** how long we wait for reloading */
  getReloadingDelay?: () => number
  /** the button component */
  ButtonComponent: Component
}
