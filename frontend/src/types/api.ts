/** Respuesta estándar del backend (auth, vote, dashboard). */
export interface ApiSuccessResponse<T> {
  success: true
  message?: string
  data: T
}

export interface ApiErrorBody {
  success?: false
  error?: {
    code?: string
    message?: string
  }
}
