import { handleUpload } from '@vercel/blob/client'

export default async function handler(req, res) {
  const body = await handleUpload({
    body: req.body,
    request: req,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      maximumSizeInBytes: 5 * 1024 * 1024,
    }),
    onUploadCompleted: async () => {},
  })
  res.json(body)
}
