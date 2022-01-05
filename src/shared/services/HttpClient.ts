import axios, { AxiosInstance } from 'axios';
import https from 'https';

import { QueryStringWrapper } from './QueryStringWrapper';

interface Options {
  timeout?: number;
  credentials?: boolean;
  contentType?: string;
}

export class HttpClient {
  private static staticInstance: AxiosInstance;
  public publicInstance: AxiosInstance;

  constructor(options?: Options) {
    const credentials = options?.credentials === undefined ? true : options?.credentials;
    const axiosInstance = axios.create({
      baseURL: process.env.ENDPOINT_API,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    if (!!options?.timeout) axiosInstance.defaults.timeout = options?.timeout;
    axiosInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axiosInstance.defaults.paramsSerializer = this.paramsSerializer;
    axiosInstance.defaults.withCredentials = credentials;

    axiosInstance.interceptors.response.use(
      (response) => {
        if (!!options?.contentType && !response?.headers['content-type']?.includes(options?.contentType)) {
          throw new Error("Received response doesn't match provided content-type");
        }

        return response.data;
      },
      (err) => Promise.reject(err)
    );

    HttpClient.staticInstance = axiosInstance;
    this.publicInstance = axiosInstance;
  }

  public static getInstance = (): AxiosInstance => {
    if (!HttpClient.staticInstance) new HttpClient();

    return HttpClient.staticInstance;
  };

  private paramsSerializer = (params) => QueryStringWrapper.stringifyQueryParams(params);
}

export default HttpClient.getInstance();
