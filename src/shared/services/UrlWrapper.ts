import psl from 'psl';

import { ServerError } from '@shared/errors/ServerError';
import { QueryStringWrapper } from './QueryStringWrapper';

export class URLWrapper {
  private url: URL;
  private origin: string;
  private host: string;
  private path: string;
  private search: string;

  constructor(rawURL: string) {
    this.instantiateURL(rawURL);
  }

  instantiateURL(rawURL: string): void {
    try {
      const url = new URL(rawURL);

      this.url = url;
      this.origin = url.origin;
      this.host = url.hostname;
      this.path = url.pathname;
      this.search = this.url.search;
    } catch (err) {
      throw new ServerError('Un-parsable url', 500);
    }
  }

  getHref(): string | undefined {
    return this.url?.href;
  }

  getPathName(): string | undefined {
    return this.url.pathname;
  }

  getFilename(): string | undefined {
    if (!this.url?.pathname.includes('.')) return undefined;

    const filename = this.url?.pathname.substring(this.url?.pathname.lastIndexOf('/') + 1);

    return filename;
  }

  getPath(): string | undefined {
    return this.path;
  }

  getOrigin(): string | undefined {
    return this.origin;
  }

  getDomain(): string | undefined {
    return this.host;
  }

  getDomainWithoutSubdomain(): string {
    return psl.get(this.url.hostname);
  }

  getSearchString(): string | undefined {
    return this.search;
  }

  getPathAndSearch(): string | undefined {
    return `${this.getPath()}${this.getSearchString()}`;
  }

  upsertSearchParams(params: Record<string, unknown>): string {
    const updatedQueryString = QueryStringWrapper.upsertSearchParams(this.url.search, params);
    const hrefWithoutSearchParams = this.getHref().split('?')[0];
    const updatedURL = `${hrefWithoutSearchParams}?${updatedQueryString}`;

    this.instantiateURL(updatedURL);

    return this.getSearchString();
  }

  getSearchParamOne(path: string): any {
    const param = QueryStringWrapper.getOneSearchParam(this.url.search, path);

    return param;
  }

  getSearchParamAll(): Record<string, unknown> {
    return QueryStringWrapper.parseQueryString(this.url.search);
  }

  deleteSearchParam(path: string): string {
    const updatedQueryString = QueryStringWrapper.deleteSearchParam(this.url.search, path);
    const hrefWithoutSearchParams = this.getHref().split('?')[0];
    const updatedURL = `${hrefWithoutSearchParams}?${updatedQueryString}`;

    this.instantiateURL(updatedURL);

    return this.getSearchString();
  }
}
