import tsConfig from '../tsconfig.json';
require('tsconfig-paths').register({
  baseUrl: 'src',
  paths: tsConfig.compilerOptions.paths
});

import express from 'express';
import router from './routes/index.routes';
import Config from '@/config';
import db from '@/db';

(async function main() {
  await db.init().then(() => console.log('db is ready'));

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public/'));
  app.use(express.json());

  app.use('/', router);

  app.all('*', (req, res) => {
    res.sendStatus(404);
  });

  app.listen(Config.port, Config.host, () => {
    console.log(`Listening on http://${Config.host}:${Config.port}`);
  });
})();
