/** Respuesta estándar del backend (auth, vote, dashboard). */
export interface ApiSuccessResponse<T> {
  success: true
  message?: string
  data: T
}

export interface ApiErrorBody {
  success?: false
  message?: string
  error?: {
    code?: string
    message?: string
  }
}

/** Alias del envelope estándar del backend. */
export type ApiResponse<T> = ApiSuccessResponse<T>
