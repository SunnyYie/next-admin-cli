export enum StorageEnum {
  UserInfo = 'userInfo',
  Token = 'token',
  RefreshToken = 'refreshToken',
  UserToken = 'userToken',
  Settings = 'settings',
  I18N = 'i18nextLng',
}

export const getItem = <T>(key: StorageEnum): T | null => {
  let value = null
  try {
    const result = window.localStorage.getItem(key)
    if (result) {
      value = JSON.parse(result)
    }
  } catch (error) {
    console.error(error)
  }
  return value
}

export const getStringItem = (key: StorageEnum): string | null => {
  return localStorage.getItem(key)
}

export const setItem = <T>(key: StorageEnum, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const removeItem = (key: StorageEnum): void => {
  localStorage.removeItem(key)
}
export const clearItems = () => {
  localStorage.clear()
}
