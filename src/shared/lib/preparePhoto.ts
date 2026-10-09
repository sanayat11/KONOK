export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

export type PhotoError = 'type' | 'size' | 'read';

export class PhotoProcessingError extends Error {
  reason: PhotoError;

  constructor(reason: PhotoError) {
    super(reason);
    this.reason = reason;
  }
}

/** Kept for the vehicle form, which predates the shared helper. */
export { PhotoProcessingError as VehiclePhotoError };

/**
 * Decodes an uploaded photo and re-encodes it as a downscaled JPEG data URL,
 * small enough to keep a few photos per listing in localStorage.
 */
export const preparePhoto = async (file: File, maxSide = 1000, quality = 0.8): Promise<string> => {
  if (!file.type.startsWith('image/')) throw new PhotoProcessingError('type');
  if (file.size > MAX_PHOTO_BYTES) throw new PhotoProcessingError('size');

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new PhotoProcessingError('read');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch (error) {
    throw error instanceof PhotoProcessingError ? error : new PhotoProcessingError('read');
  } finally {
    URL.revokeObjectURL(url);
  }
};
