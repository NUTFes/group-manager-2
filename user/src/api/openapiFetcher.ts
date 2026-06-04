import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

export type OpenApiError = Error & {
  info?: unknown;
  status?: number;
};

type FetchOptions = RequestInit & {
  params?: Record<string, unknown>;
};

const appendParams = (url: string, params?: Record<string, unknown>) => {
  if (!params) return url;

  const normalizedParams = snakecaseKeys(params, { deep: true });
  const searchParams = new URLSearchParams();

  Object.entries(normalizedParams).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.append(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${url}${url.includes('?') ? '&' : '?'}${query}` : url;
};

export const openApiFetch = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { params, body, headers, ...requestOptions } = options;
  const response = await fetch(appendParams(url, params), {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body:
      body && typeof body === 'string'
        ? JSON.stringify(snakecaseKeys(JSON.parse(body), { deep: true }))
        : body,
  });

  const data = await response.json().catch(() => undefined);

  if (!response.ok) {
    const error = new Error(
      `${requestOptions.method ?? 'GET'} ${url} failed (status ${response.status})`
    ) as OpenApiError;
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return {
    data: camelcaseKeys(data, { deep: true }),
    headers: response.headers,
    status: response.status,
  } as T;
};
