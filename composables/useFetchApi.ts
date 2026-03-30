export default () => {
  const config = useRuntimeConfig();
  const { data } = useAuth();

  const BASE_URL = config.public.baseURL;
  const headers: Record<string, string> = {};
  const getAccessToken = () => {
    return (data.value?.user as { accessToken?: string } | undefined)
      ?.accessToken;
  };

  if (import.meta.client && getAccessToken()) {
    headers["Authorization"] = `Bearer ${getAccessToken()}`;
  }

  type RequestOptions = {
    headers?: Record<string, string>;
    [key: string]: unknown;
  };

  /**
   * Get Request
   * @param endpoint
   * @param options
   * @returns Promise<T>
   */
  const get = async <T>(endpoint: string, options?: RequestOptions) => {
    const accessToken = getAccessToken();

    if (accessToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return rawFetch<T>(endpoint, {
      ...options,
      headers,
    });
  };

  /**
   * Post Request
   * @param endpoint
   * @param options
   * @returns Promise<T>
   */
  const rawFetch = async <T>(endpoint: string, options?: RequestOptions) =>
    $fetch<T>(endpoint, {
      baseURL: BASE_URL,
      ...options,
    });

  /**
   * Post Curry Function
   * @param method
   * @returns (endpoint: string, body: any, options?: { [key: string]: any; }) => Promise<T>
   */
  const postCurry =
    (method: "POST" | "PATCH" | "PUT" | "DELETE") =>
    async <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
      $fetch<T>(endpoint, {
        baseURL: BASE_URL,
        method,
        body,
        ...options,
        headers,
      });

  /**
   * Post Request
   * @param endpoint
   * @param body
   * @param options
   * @returns Promise<T>
   */
  const post = postCurry("POST");

  /**
   * Patch Request
   * @param endpoint
   * @param body
   * @param options
   * @returns Promise<T>
   */
  const patch = postCurry("PATCH");

  /**
   * Put Request
   * @param endpoint
   * @param body
   * @param options
   * @returns Promise<T>
   */
  const put = postCurry("PUT");

  /**
   * Delete Request
   * @param endpoint
   * @param body
   * @param options
   * @returns Promise<T>
   */
  const destroy = postCurry("DELETE");

  return {
    get,
    rawFetch,
    post,
    patch,
    put,
    destroy,
  };
};
