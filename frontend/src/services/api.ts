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

function extractApiErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const body = data as ApiErrorBody & { message?: string }
  if (typeof body.error?.message === 'string' && body.error.message.trim()) {
    return body.error.message
  }
  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message
  }
  return null
}

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiErrorMessage(error.response?.data)
    if (apiMessage) return apiMessage

    const status = error.response?.status
    if (status === 409) return 'Ya has votado en esta encuesta.'
    if (status === 401) return 'Sesión expirada o credenciales inválidas.'
    if (status === 403) return 'No tienes permiso para realizar esta acción.'
    if (status === 404) return 'No se encontró el recurso solicitado.'
    if (status === 400) return 'Datos inválidos. Revisa el formulario e intenta de nuevo.'

    if (!error.response) {
      return 'No se pudo conectar con el servidor. Comprueba que el backend esté activo en el puerto 3000.'
    }

    return fallback
  }
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return 'No se pudo conectar con el servidor. Comprueba que el backend esté activo.'
    }
    return error.message
  }
  return fallback
}

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
