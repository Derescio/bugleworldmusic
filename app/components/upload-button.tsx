'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '../api/uploadthing/core';

export function MyUploadButton() {
  return (
    <UploadButton<OurFileRouter, 'imageUploader'>
      endpoint="imageUploader"
      onClientUploadComplete={res => {
        console.log('Files uploaded:', res);
      }}
      onUploadError={error => {
        alert(`Upload error: ${error.message}`);
      }}
    />
  );
}
