import mysql from 'mysql2';
import { promisify } from 'util';

import { DATABASE_PASSWORD, DATABASE_SETTINGS } from '@shared/constants/env';

type Options = {
  multipleStatements?: boolean;
  timezone?: string;
};

export class MySQL {
  private mySQL;

  constructor(options?: Options) {
    const defaultOptions = {
      multipleStatements: false,
      // Interpret all received timestamps as UTC. Otherwise local timezone is assumed.
      timezone: 'Z',
    };

    this.mySQL = mysql.createConnection({
      ...DATABASE_SETTINGS,
      password: DATABASE_PASSWORD,
      ...defaultOptions,
      ...options,
      typeCast: this.typeCast,
    });
  }

  typeCast(field, useDefaultTypeCasting) {
    // We only want to cast TINY fields that have a single digit in them. If the field
    // has more than one integer, then we cannot assume it is supposed to be a Boolean.

    if (field.type === 'TINY' && field.length === 1) {
      const bytes = field.buffer(); // Extract value

      // If there are no bytes, we are at a NULL value
      if (!bytes) return;
      // Convert from ASCII to string, then to number and finally to boolean
      const value = Boolean(Number(String.fromCharCode(bytes[0])));

      return value;
    }

    return useDefaultTypeCasting();
  }

  query(sql: string, args?: undefined | { [key: string]: number | boolean | string } | Array<number | boolean | string>) {
    // If we receive args object, transform it to an array of values; otherwise undefined
    const arrayArgs = args ? Object.values(args) : undefined;
    if (process.env.NODE_ENV === 'development') console.log(sql, args);

    return promisify(this.mySQL.query).call(this.mySQL, sql, arrayArgs);
  }

  close() {
    return promisify(this.mySQL.end).call(this.mySQL);
  }

  beginTransaction() {
    return promisify(this.mySQL.beginTransaction).call(this.mySQL);
  }

  commit() {
    return promisify(this.mySQL.commit).call(this.mySQL);
  }

  rollback() {
    return promisify(this.mySQL.rollback).call(this.mySQL);
  }
}
