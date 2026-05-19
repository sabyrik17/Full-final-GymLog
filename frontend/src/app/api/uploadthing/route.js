import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

function cleanEnv(value) {
  return value?.trim().replace(/^['"]|['"]$/g, '');
}

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingSecret: cleanEnv(process.env.UPLOADTHING_SECRET),
    uploadthingId: cleanEnv(process.env.UPLOADTHING_APP_ID),
  },
});
