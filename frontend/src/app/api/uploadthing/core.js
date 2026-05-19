import { createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { API_BASE_URL } from '@/lib/api';

const f = createUploadthing();

async function requireAuth({ req }) {
  const authorization = req.headers.get('authorization');

  if (!authorization) {
    throw new UploadThingError({
      code: 'UNAUTHORIZED',
      message: 'Login is required to upload files',
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: { Authorization: authorization },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new UploadThingError({
      code: 'UNAUTHORIZED',
      message: 'Invalid auth token',
    });
  }

  const user = await response.json();
  return { userId: user._id || user.id };
}

export const ourFileRouter = {
  avatarUploader: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  })
    .middleware(requireAuth)
    .onUploadComplete(({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      url: file.url,
      key: file.key,
    })),

  exerciseMediaUploader: f({
    image: {
      maxFileSize: '8MB',
      maxFileCount: 1,
    },
    video: {
      maxFileSize: '64MB',
      maxFileCount: 1,
    },
  })
    .middleware(requireAuth)
    .onUploadComplete(({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      url: file.url,
      key: file.key,
    })),
};
