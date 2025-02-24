#!/usr/bin/env node

import animaux from 'animaux';

import pkg from '../package.json';
import { dev } from '../commands/dev';
import { build } from '../commands/build';
import { init } from '../commands/init';
import { start } from '../commands/start';

const app = animaux('zely-js');

app.version(pkg.version);

app
  .command('dev')
  .option('--serpack', 'Use serpack-loader (experimental)')
  .option('--runtime', 'Use serpack runtime (experimental)')
  .action(async (options) => {
    // development mode
    process.env.NODE_ENV = 'development';
    process.env.ZELY_WORKING_FRAMEWORK = 'zely-cli';

    if (options.serpack || process.argv.includes('--serpack')) {
      process.env.SERPACK = 'true';
    }

    if (options.runtime || process.argv.includes('--serpack-runtime')) {
      process.env.SERPACK_RUNTIME = 'true';
    }

    await dev();
  });

app.command('build').action(async () => {
  // production mode
  process.env.NODE_ENV = 'production';
  process.env.ZELY_WORKING_FRAMEWORK = 'zely-cli';

  await build();
});

app.command('start').action(async () => {
  // production mode
  process.env.NODE_ENV = 'production';
  process.env.ZELY_WORKING_FRAMEWORK = 'zely-cli';

  await start();
});

app
  .command('init')
  .option('--dir, -d', 'Provide output directory.')
  .option('--template, -t', 'Template (typescript/javascript)')
  .action(async (options) => {
    await init(options.dir, options.template);
  });

app.parse(process.argv);
