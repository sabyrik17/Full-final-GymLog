import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

function cleanEnv(value) {
  let cleaned = value?.trim();

  if (!cleaned) {
    return cleaned;
  }

  if (/^[A-Z0-9_]+\s*=/.test(cleaned)) {
    cleaned = cleaned.slice(cleaned.indexOf('=') + 1).trim();
  }

  return cleaned.replace(/^['"]|['"]$/g, '').trim();
}

function getUploadThingCallbackUrl() {
  const appUrl = cleanEnv(process.env.NEXT_PUBLIC_APP_URL);
  const vercelUrl = cleanEnv(process.env.VERCEL_URL);
  const origin = appUrl || (vercelUrl ? `https://${vercelUrl}` : undefined);

  return origin ? `${origin.replace(/\/$/, '')}/api/uploadthing` : undefined;
}

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: cleanEnv(process.env.UPLOADTHING_TOKEN),
    callbackUrl: getUploadThingCallbackUrl(),
    logLevel: 'debug',
  },
});
