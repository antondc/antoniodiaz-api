import { defaultDecoder, parse, ParsedQs, stringify } from 'qs';

import { getNested } from '@tools/helpers/object/getNested';
import { mergeDeep } from '@tools/helpers/object/mergeDeep';
import { omit } from '@tools/helpers/object/omit';

export class QueryStringWrapper {
  static extractQueryString(string: string): string {
    if (string.includes('?')) return string.split('?')[1];
    if (string.includes('=')) return string; // Every query string must have "="

    return '';
  }

  static decoder(str: string, defaultDecoder: defaultDecoder, b: unknown, type: string): string | number | ParsedQs {
    if (type === 'value' && !isNaN(Number(str))) return Number(str);

    return defaultDecoder(str);
  }

  static parseQueryString(string = ''): Record<string, unknown> {
    const queryString = QueryStringWrapper.extractQueryString(string);
    const queryParams = parse(queryString, {
      decoder: QueryStringWrapper.decoder,
    });

    return queryParams;
  }

  static stringifyQueryParams(params: Record<string, unknown> = {}): string {
    const queryParams = stringify(params, {
      arrayFormat: 'brackets',
    });

    return decodeURIComponent(queryParams);
  }

  static upsertSearchParams(string: string, newParams: Record<string, unknown>): string {
    const queryString = QueryStringWrapper.extractQueryString(string);
    const alreadyParams = QueryStringWrapper.parseQueryString(queryString);

    const paramsEnhanced = mergeDeep<Record<string, unknown>>(alreadyParams, newParams);
    const stringifiedParams = QueryStringWrapper.stringifyQueryParams(paramsEnhanced);

    return stringifiedParams;
  }

  static addSearchParamsNoReplace(string: string, newParams: Record<string, unknown>): string {
    const queryString = QueryStringWrapper.extractQueryString(string);
    const alreadyParams = QueryStringWrapper.parseQueryString(queryString);

    const paramsEnhanced = mergeDeep<Record<string, unknown>>(newParams, alreadyParams);
    const stringifiedParams = QueryStringWrapper.stringifyQueryParams(paramsEnhanced);

    return stringifiedParams;
  }

  static deleteSearchParam(string: string, path: string): string {
    const queryString = QueryStringWrapper.extractQueryString(string);
    const params = QueryStringWrapper.parseQueryString(queryString);
    const paramsWithoutOmmitedValue = omit(params, [path]);
    const stringifiedParams = QueryStringWrapper.stringifyQueryParams(paramsWithoutOmmitedValue);

    return stringifiedParams;
  }

  static getOneSearchParam(string: string, path: string): any {
    const queryString = QueryStringWrapper.extractQueryString(string);
    const params = QueryStringWrapper.parseQueryString(queryString);

    return getNested(params, path);
  }
}
