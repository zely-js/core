import { createVirtualPage, GET } from '@zely-js/core';
import { defineConfig } from '@zely-js/zely';

export default defineConfig({
  server: { port: 3001 },
  experimental: {
    useHTML: true,
  },
  allowAutoMiddlewares: true,
  __virtuals__: [createVirtualPage('main.ts', [GET(() => {})])],
});
