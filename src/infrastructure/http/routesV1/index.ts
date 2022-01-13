import express from 'express';

import { ArticlesRoute } from '@infrastructure/http/routesV1/ArticlesRoute';
import { FilesRoute } from '@infrastructure/http/routesV1/FilesRoute';
import { LanguagesRoute } from '@infrastructure/http/routesV1/LanguagesRoute';
import { LoginRoute } from '@infrastructure/http/routesV1/LoginRoute';
import { ProjectsRoute } from '@infrastructure/http/routesV1/ProjectsRoute';
import { StateRoute } from '@infrastructure/http/routesV1/StateRoute';
import { UsersRoute } from '@infrastructure/http/routesV1/UsersRoute';

const RouterV1 = express.Router();

RouterV1.use('/:language([a-z]{2})?/state', StateRoute);
RouterV1.use('/:language([a-z]{2})?/login', LoginRoute);
RouterV1.use('/:language([a-z]{2})?/users', UsersRoute);
RouterV1.use('/:language([a-z]{2})?/languages', LanguagesRoute);
RouterV1.use('/:language([a-z]{2})?/files', FilesRoute);
RouterV1.use('/:language([a-z]{2})?/articles', ArticlesRoute);
RouterV1.use('/:language([a-z]{2})?/projects', ProjectsRoute);

export { RouterV1 };
