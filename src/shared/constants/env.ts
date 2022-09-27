import config from '@root/config.test.json';

export const ENVIRONMENT = process.env.NODE_ENV;
export const DEVELOPMENT = ENVIRONMENT === 'development';
export const PRODUCTION = ENVIRONMENT === 'production';
export const STAGING = ENVIRONMENT === 'staging';
export const DOMAIN = config[process.env.NODE_ENV].HOST_SERVER;
export const DATABASE_SETTINGS = config[process.env.NODE_ENV].database;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const PROTOCOL_SERVER = config[process.env.NODE_ENV].PROTOCOL_SERVER;
export const HOST_SERVER = config[process.env.NODE_ENV].HOST_SERVER;
export const PORT_SERVER_HTTP = config[process.env.NODE_ENV].PORT_SERVER_HTTP; // To be deprecated, currently useful for staging and prod
export const PORT_SERVER_HTTPS = config[process.env.NODE_ENV].PORT_SERVER_HTTPS;
export const LOGGING = config[process.env.NODE_ENV].LOGGING;
export const ENDPOINT_CLIENTS = config[process.env.NODE_ENV].ENDPOINT_CLIENTS;
export const ENDPOINT_CLIENT = config[process.env.NODE_ENV].ENDPOINT_CLIENT;
export const URL_SERVER = `${PROTOCOL_SERVER}${HOST_SERVER}${!!PORT_SERVER_HTTPS ? `:${PORT_SERVER_HTTPS}` : ''}`; // URL_SERVER will always be with https
export const PATH_API_V1 = '/api/v1';
export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL_HOST = config[process.env.NODE_ENV].EMAIL_HOST;
export const EMAIL_PORT = config[process.env.NODE_ENV].EMAIL_PORT;
export const EMAIL_USER = config[process.env.NODE_ENV].EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_ADDRESS_SENT = config[process.env.NODE_ENV].EMAIL_ADDRESS_SENT;
export const RESTORE_MODELS = config[process.env.NODE_ENV].RESTORE_MODELS;
export const RESTORE_DATA = config[process.env.NODE_ENV].RESTORE_DATA;
export const RESTORE_PROCEDURES = config[process.env.NODE_ENV].RESTORE_PROCEDURES;
export const DEFAULT_LOCATION = config[process.env.NODE_ENV].DEFAULT_LOCATION;
