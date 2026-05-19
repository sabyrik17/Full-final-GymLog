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

function parseUploadThingToken(token) {
  if (!token) {
    return null;
  }

  try {
    const normalized = token.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(normalized, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function GET() {
  const token = cleanEnv(process.env.UPLOADTHING_TOKEN);
  const parsed = parseUploadThingToken(token);

  return Response.json({
    hasToken: Boolean(token),
    tokenLength: token?.length || 0,
    tokenLooksLikeV7: Boolean(parsed?.apiKey && parsed?.appId && parsed?.regions),
    hasApiKey: Boolean(parsed?.apiKey),
    hasAppId: Boolean(parsed?.appId),
    regionsCount: Array.isArray(parsed?.regions) ? parsed.regions.length : 0,
  });
}
