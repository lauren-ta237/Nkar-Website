/**
 * Storage Service for Nkar Woo Làn Admin Panel
 * Handles direct file uploads (Images, Videos, Documents)
 * Validates file sizes/types, generates previews, and stores files with persistence.
 */

const DB_NAME = 'nkar_woo_lan_files_v1';
const STORE_NAME = 'uploaded_media';

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface UploadedFileResult {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // Base64 data URL or permanent blob URL
  uploadedAt: string;
}

export interface UploadOptions {
  allowedTypes?: string[]; // e.g. ['image/*', 'video/*', '.pdf', '.docx']
  maxSizeBytes?: number;
  onProgress?: (percent: number) => void;
}

export const storageService = {
  /**
   * Validates a file against allowed MIME types / extensions and max file size.
   */
  validateFile(file: File, options?: UploadOptions): { valid: boolean; error?: string } {
    const maxSizeBytes = options?.maxSizeBytes || 50 * 1024 * 1024; // Default 50MB
    if (file.size > maxSizeBytes) {
      const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${maxMb}MB.`,
      };
    }

    if (options?.allowedTypes && options.allowedTypes.length > 0) {
      const allowed = options.allowedTypes;
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      const isMatch = allowed.some((pattern) => {
        const p = pattern.toLowerCase().trim();
        if (p.endsWith('/*')) {
          const prefix = p.replace('/*', '');
          return fileType.startsWith(prefix);
        }
        if (p.startsWith('.')) {
          return fileName.endsWith(p);
        }
        return fileType === p;
      });

      if (!isMatch) {
        return {
          valid: false,
          error: `Invalid file format. Allowed formats: ${allowed.join(', ')}`,
        };
      }
    }

    return { valid: true };
  },

  /**
   * Uploads a file with progress reporting and saves it to local persistent storage.
   */
  async uploadFile(file: File, options?: UploadOptions): Promise<UploadedFileResult> {
    const validation = this.validateFile(file, options);
    if (!validation.valid) {
      throw new Error(validation.error || 'File validation failed');
    }

    const onProgress = options?.onProgress;

    // Simulate upload progress stages
    if (onProgress) {
      onProgress(15);
      await new Promise((r) => setTimeout(r, 60));
      onProgress(50);
      await new Promise((r) => setTimeout(r, 80));
      onProgress(85);
      await new Promise((r) => setTimeout(r, 60));
    }

    // Convert file to Data URL
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file from disk'));
      reader.readAsDataURL(file);
    });

    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const result: UploadedFileResult = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      url: dataUrl,
      uploadedAt: new Date().toISOString(),
    };

    // Attempt to store in IndexedDB for long-term persistence
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(result);
    } catch (e) {
      console.warn('IndexedDB write skipped or failed:', e);
    }

    if (onProgress) {
      onProgress(100);
    }

    return result;
  },

  /**
   * Retrieves a file by ID from IndexedDB
   */
  async getFile(id: string): Promise<UploadedFileResult | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  },
};
