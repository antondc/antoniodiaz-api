import 'module-alias/register';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import logger from 'morgan';
import { AddressInfo } from 'net';
import path from 'path';

import { AuthMiddleware } from '@infrastructure/http/middlewares/AuthMiddleware';
import { ErrorHandlerMiddleware } from '@infrastructure/http/middlewares/ErrorHandlerMiddleware';
import { RouterV1 } from '@infrastructure/http/routesV1';
import { ENDPOINT_CLIENT, PORT_SERVER_HTTP, PORT_SERVER_HTTPS } from '@shared/constants/env';

const app = express();

/* - - - - - - - - - - - Cors - - - - - - - - - - - - - - */
app.use(cors({ credentials: true, origin: ENDPOINT_CLIENT }));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/

/* - - - - - - - - - - - Static - - - - - - - - - - - - - */
// Serving static files
app.use(express.static('media/docs'));
app.use(express.static('media/files'));
app.use(express.static('media/images'));
app.use(express.static('media/temp_files'));
app.use('/media', express.static('media'));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/

/* - - - - - - - - - - - Parsers - - - - - - - - - - - - -*/
// Parsing req.body
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Parsing JSON
app.use(express.json({ limit: '50mb' }));
// Parsing cookies
app.use(cookieParser());
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/* - - - - - - - - - - - Loggers - - - - - - - - - - - - - */
app.use(logger('dev'));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - Routes - - - - - - - - - - - - - -*/
app.use('*', AuthMiddleware);
app.use('/api/v1/', RouterV1);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/* - - - - - - - - - - - Errors Handler - - - - - - - - - -*/
app.use('*', ErrorHandlerMiddleware);
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/* - - - - - - - - - - - Server - - - - - - - - - - - - - -*/
// Try to load conf files for HTTPS. In any case, load HTTP server.
try {
  console.log('--------------------------------------------------------');
  // /* - - - - - - - - - - - SSL options - - - - - - - - - - - */
  const certOptions = {
    key: fs.readFileSync(path.resolve(process.cwd(), 'src/infrastructure/http/ssl/private.key')),
    cert: fs.readFileSync(path.resolve(process.cwd(), 'src/infrastructure/http/ssl/private.crt')),
  };
  const httpsServer = https.createServer(certOptions, app);
  httpsServer.listen(PORT_SERVER_HTTPS, () => {
    const address = httpsServer.address() as AddressInfo;
    console.log('=> App listening to HTTPS on port: ' + address.port);
  });
} catch {
  // Do nothing
} finally {
  const httpServer = http.createServer(app);
  httpServer.listen(PORT_SERVER_HTTP, () => {
    const address = httpServer.address() as AddressInfo;
    console.log('=> App listening to HTTP on port: ' + address.port);
    console.log('--------------------------------------------------------');
  });
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
