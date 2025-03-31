export const defaultHeaders = (apiKey: string) => ({
  "Content-Type": "application/json",
  "FSTCM-API-KEY": apiKey,
});

export const streamHeaders = {
  Accept: "text/event-stream",
  Connection: "keep-alive",
  "Cache-Control": "no-cache",
};

export const apiClient = ({
  clientUrl,
  apiKey,
}: {
  clientUrl: string;
  apiKey: string;
}) => {
  const baseUrl = `${clientUrl}/api/v1`;

  const request = async (
    path: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const url = `${baseUrl}${path}`;

    const mergedOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders(apiKey),
        ...(options.headers || {}),
      },
    };

    return await fetch(url, mergedOptions);
  };

  return {
    get: (path: string, options: RequestInit = {}) =>
      request(path, { ...options, method: "GET" }),

    post: (path: string, body: any, options: RequestInit = {}) =>
      request(path, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),

    put: (path: string, body: any, options: RequestInit = {}) =>
      request(path, {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      }),

    patch: (path: string, body: any, options: RequestInit = {}) =>
      request(path, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(body),
      }),

    delete: (path: string, options: RequestInit = {}) =>
      request(path, { ...options, method: "DELETE" }),
  };
};
