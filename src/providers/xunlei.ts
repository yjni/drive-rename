import type { Provider, Resource } from '~/types'
import ButtonComponent from '~/components/ButtonXunlei.vue'

function getToken() {
  const match = document.cookie.match(/sessionid=([^;]+)/)
  if (!match)
    throw new Error('未找到迅雷云盘sessionid')
  return match[1]
}

const PAGE_SIZE = 100

async function getFileListOfCurrentDir(parentId = getParentId()) {
  const result: Resource[] = []
  let page = 1
  let has_more = true

  while (has_more) {
    const res = await post('https://pan.xunlei.com/api/v1/file/list', {
      parent_id: parentId,
      page,
      page_size: PAGE_SIZE,
      order: 'name',
      asc: true,
    })
    result.push(...res.data.files.map((x: any) => ({
      drive_id: 'whocare',
      file_id: x.id,
      name: x.name,
      parent_file_id: x.parent_id,
      file_extension: x.extension || '',
      mime_type: x.mime_type || 'application/octet-stream',
      type: x.kind === 'drive#folder' ? 'folder' : 'file',
    })))
    has_more = res.data.has_more
    page += 1
  }

  return result
}

async function rename(fileId: string, newName: string) {
  return post('https://pan.xunlei.com/api/v1/file/rename', {
    id: fileId,
    name: newName,
  })
}

function getParentId() {
  const match = location.pathname.match(/\/drive\/folders\/([^/]+)/)
  return match ? match[1] : '0'
}

const headers: Record<string, string> = {}
function setRequestHeader(key: string, value: string) {
  // 迅雷云盘无需额外请求头设置，目前留空备用
}

function post(api: URL | string, payload: object) {
  return fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Cookie': `sessionid=${getToken()}`,
      ...headers,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  }).then((res) => {
    if (res.ok)
      return res.json()
    else
      return Promise.reject(new Error('network error'))
  })
}

async function renameOne(resource: Resource, newName: string) {
  await rename(resource.file_id, newName)
}

function shouldShowEntry(url: string) {
  const u = new URL(url)
  return u.hostname === 'pan.xunlei.com' && u.pathname.startsWith('/drive')
}

function getContainer() {
  return {
    el: document.querySelector('.pan-drive-file-toolbar'),
    style: '',
    front: true,
  }
}

const provider: Provider = {
  DRIVE_NAME: '迅雷云盘',
  HOSTS: ['pan.xunlei.com'],
  ButtonComponent,
  shouldShowEntry,
  getContainer,
  renameOne,
  setRequestHeader,
  getFileListOfCurrentDir,
}

export default provider
