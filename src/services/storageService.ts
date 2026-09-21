// ==============================================================================
// I-CAN PLATFORM — STORAGE & AVATAR UPLOAD SERVICE
// Direct upload to Supabase Storage ('avatars' bucket) with auto-compression,
// fallback bucket, and resilient local data URL handling.
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';

export interface UploadAvatarResult {
  url: string;
  isCloud: boolean;
  fileSizeKb: number;
}

/**
 * Compresses an image file using HTML5 Canvas to max 400x400 (ideal for avatars).
 * Produces a lightweight JPEG Blob (~30KB-60KB) and Base64 Data URL.
 */
export async function compressAvatarImage(
  file: File,
  maxDim = 400,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string; fileSizeKb: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Format berkas harus berupa gambar (JPG, PNG, WebP)'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Square cropping / center fitting for avatars
        const minSide = Math.min(width, height);
        const startX = (width - minSide) / 2;
        const startY = (height - minSide) / 2;

        const targetDim = Math.min(minSide, maxDim);
        canvas.width = targetDim;
        canvas.height = targetDim;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context tidak tersedia di browser'));
        }

        // Draw cropped square image
        ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, targetDim, targetDim);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const fileSizeKb = Math.round(blob.size / 1024);
              resolve({ blob, dataUrl, fileSizeKb });
            } else {
              reject(new Error('Gagal mengonversi gambar ke Blob'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Berkas gambar rusak atau tidak dapat dibaca'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas dari sistem'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads user avatar photo:
 * 1. Automatically compresses image to 400x400 JPEG
 * 2. Uploads to Supabase Storage ('avatars' bucket, fallback to 'action-photos')
 * 3. If Supabase is offline or unconfigured, falls back to compressed Base64 Data URL
 */
export async function uploadAvatarPhoto(
  userId: string,
  file: File
): Promise<UploadAvatarResult> {
  // 1. Compress image
  const { blob, dataUrl, fileSizeKb } = await compressAvatarImage(file, 400, 0.85);

  // 2. Upload to Supabase Storage if configured
  if (isConfigured) {
    try {
      const cleanId = (userId || 'user').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `avatar_${cleanId}_${Date.now()}.jpg`;

      // Try 'avatars' bucket first
      let bucketName = 'avatars';
      let { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      // If 'avatars' bucket doesn't exist, try fallback bucket 'action-photos'
      if (uploadError && (uploadError.message?.toLowerCase().includes('not found') || (uploadError as any).statusCode === '404')) {
        console.warn(`[storageService] Bucket '${bucketName}' not found, trying 'action-photos'...`);
        bucketName = 'action-photos';
        const fallback = await supabase.storage
          .from(bucketName)
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            upsert: true,
          });
        uploadError = fallback.error;
      }

      if (!uploadError) {
        const { data: publicData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        if (publicData?.publicUrl) {
          console.log(`[storageService] Avatar uploaded to Supabase Storage (${bucketName}):`, publicData.publicUrl);
          return {
            url: publicData.publicUrl,
            isCloud: true,
            fileSizeKb,
          };
        }
      } else {
        console.warn('[storageService] Supabase upload failed, using compressed local Data URL:', uploadError.message);
      }
    } catch (err: any) {
      console.warn('[storageService] Storage connection error, using local fallback:', err.message);
    }
  }

  // 3. Resilient Fallback: Local Base64 Data URL (guarantees zero broken state)
  return {
    url: dataUrl,
    isCloud: false,
    fileSizeKb,
  };
}
