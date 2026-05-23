import axios, { type AxiosError, type AxiosResponse } from 'axios'
import type { ApiErrorBody, ApiSuccessResponse } from '@/types/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const TOKEN_KEY = 'pulsevote_token'
export const USER_KEY = 'pulsevote_user'

const LEGACY_TOKEN_KEY = 'verdicta_token'
const LEGACY_USER_KEY = 'verdicta_user'

/** Migra sesión guardada con keys antiguas. */
export function migrateLegacyStorageKeys() {
  const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY)
  const legacyUser = localStorage.getItem(LEGACY_USER_KEY)
  if (legacyToken && !localStorage.getItem(TOKEN_KEY)) {
    localStorage.setItem(TOKEN_KEY, legacyToken)
    localStorage.removeItem(LEGACY_TOKEN_KEY)
  }
  if (legacyUser && !localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, legacyUser)
    localStorage.removeItem(LEGACY_USER_KEY)
  }
}

migrateLegacyStorageKeys()

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

/** Extrae `data` de `{ success, message, data }` o devuelve el cuerpo plano. */
export function unwrapData<T>(response: AxiosResponse<unknown>): T {
  const body = response.data
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    (body as ApiSuccessResponse<T>).success === true &&
    'data' in body
  ) {
    return (body as ApiSuccessResponse<T>).data
  }
  return body as T
}

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined
    if (data?.error?.message) return data.error.message
    if (error.response?.status === 409) {
      return 'Ya has votado en esta encuesta.'
    }
    return error.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
