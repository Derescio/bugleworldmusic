import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Music cover images
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata);
      console.log('file url', file.url);
      return { uploadedBy: metadata };
    }
  ),

  // PDF files for digital downloads
  pdfUploader: f({ pdf: { maxFileSize: '16MB', maxFileCount: 1 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log('PDF upload complete:', file.url);
      return { uploadedBy: metadata };
    }
  ),

  // Audio files (optional - for future use)
  audioUploader: f({ audio: { maxFileSize: '32MB', maxFileCount: 1 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log('Audio upload complete:', file.url);
      return { uploadedBy: metadata };
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
