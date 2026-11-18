// src/lib/api/media.api.ts
//
// Pure API methods & TanStack Query hooks for Object Storage & Media Management.
// Pattern: useAdminMedia...

import { useMutation } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse } from '@/types';

export interface MediaUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  resource_type?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

// ---- pure api routes -----------------------------------------------------

export async function uploadAdminMedia(
  file: File,
  folder?: string,
  onProgress?: (percent: number) => void
): Promise<MediaUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const res = await api.post<ApiResponse<MediaUploadResult>>('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return res.data.data;
}

export async function deleteAdminMedia(publicId: string, resourceType: string = 'image'): Promise<{ result: string }> {
  const res = await api.delete<ApiResponse<{ result: string }>>('/media/destroy', {
    data: { public_id: publicId, resource_type: resourceType },
  });
  return res.data.data;
}

// ---- hooks ---------------------------------------------------------------

export function useAdminMediaMutations() {
  const uploadMutation = useMutation({
    mutationFn: uploadAdminMedia,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ public_id, resource_type = 'image' }: { public_id: string; resource_type?: string }) =>
      deleteAdminMedia(public_id, resource_type),
  });

  return { uploadMutation, deleteMutation };
}
