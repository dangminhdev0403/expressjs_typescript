// src/utils/response.util.ts
export interface Response<T = object> {
  statusCode: number
  message: string | Record<string, object> | null
  data: T | null
  errors: T | null
}

const createResponse = <T = object>(
  statusCode: number,
  message?: string | Record<string, object>,
  data: T | null = null,
  errors: T | null = null
): Response<T> => {
  return {
    statusCode,
    message: message ?? null,
    errors: errors ?? null,

    data: data ?? null
  }
}

export { createResponse }
