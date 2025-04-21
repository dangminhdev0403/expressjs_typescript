// src/utils/response.util.ts
export interface Response<T = object> {
  statusCode: number
  message: string | Record<string, object> | null
  data: T | null
  error: string | null
}

const createResponse = <T = object>(
  statusCode: number,
  message?: string | Record<string, object>,
  data: T | null = null,
  error: string | null = null
): Response<T> => {
  return {
    statusCode,
    error: error ?? null,
    message: message ?? null,
    data: data ?? null
  }
}

export { createResponse }
