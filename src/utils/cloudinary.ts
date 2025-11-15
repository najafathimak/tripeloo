/**
 * Adds Cloudinary transformation parameters (f_auto, q_auto) to Cloudinary URLs
 * This enables automatic format conversion (WebP) and quality optimization
 * 
 * @param url - The Cloudinary URL to transform
 * @returns The transformed URL with f_auto,q_auto parameters, or the original URL if it's not a Cloudinary URL
 */
export function optimizeCloudinaryUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') {
    return url || '';
  }

  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Check if transformation parameters already exist
  if (url.includes('/f_auto') || url.includes('/q_auto')) {
    // If f_auto or q_auto already exists, ensure both are present
    if (url.includes('/f_auto') && !url.includes('/q_auto')) {
      return url.replace('/f_auto', '/f_auto,q_auto');
    }
    if (url.includes('/q_auto') && !url.includes('/f_auto')) {
      return url.replace('/q_auto', '/f_auto,q_auto');
    }
    // Check if both are present but separated
    if (url.includes('/f_auto') && url.includes('/q_auto')) {
      // If they're separate, combine them
      if (url.includes('/f_auto/') && url.includes('/q_auto/')) {
        return url.replace('/f_auto/', '/f_auto,q_auto/').replace('/q_auto/', '');
      }
    }
    return url;
  }

  // Find the position to insert transformation parameters
  // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{version}/{public_id}.{format}
  // We need to insert after /upload/
  
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  // Insert f_auto,q_auto after /upload/
  const beforeUpload = url.substring(0, uploadIndex + 8); // +8 for '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);
  
  // Check if there are already transformations or version number
  // If there's a version number (v1234567890), insert before it
  const versionMatch = afterUpload.match(/^(v\d+\/)/);
  if (versionMatch) {
    return `${beforeUpload}f_auto,q_auto/${afterUpload}`;
  }
  
  // Check if there are existing transformations (they would be before the public_id)
  // If the path starts with something that looks like a transformation, insert before it
  // Otherwise, insert at the beginning
  return `${beforeUpload}f_auto,q_auto/${afterUpload}`;
}

