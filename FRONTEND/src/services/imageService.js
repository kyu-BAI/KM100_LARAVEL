/**
 * Image processing utilities for KM100 receipt scanning and verification.
 * Ensures receipts are always saved upright in full resolution.
 */

/**
 * Physically rotates a base64 or URL image by the specified degrees (90, 180, 270)
 * and returns the new upright base64 data URL.
 * 
 * @param {string} dataUrl - The base64 or object URL of the receipt image
 * @param {number} degrees - Degrees to rotate (default 90 clockwise)
 * @param {number} quality - Output JPEG quality (0.1 - 1.0, default 0.85)
 * @returns {Promise<string>} - Resolves to the rotated base64 data URL
 */
export function rotateImageDataUrl(dataUrl, degrees = 90, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!dataUrl) return resolve(dataUrl);

    const ImgConstructor = typeof window !== 'undefined' && window.Image ? window.Image : Image;
    const img = new ImgConstructor();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const normalizedDeg = ((degrees % 360) + 360) % 360;
        if (normalizedDeg === 0) return resolve(dataUrl);

        const is90or270 = normalizedDeg === 90 || normalizedDeg === 270;
        const canvas = document.createElement('canvas');
        canvas.width = is90or270 ? img.height : img.width;
        canvas.height = is90or270 ? img.width : img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Move rotation origin to center of canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((normalizedDeg * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        const rotatedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(rotatedDataUrl);
      } catch (err) {
        console.warn('Image rotation error:', err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Checks if an image is in landscape mode (width > height) and automatically rotates
 * it 90 degrees clockwise to portrait orientation if desirable.
 */
export function autoOrientToPortrait(dataUrl, quality = 0.85) {
  return new Promise((resolve) => {
    if (!dataUrl) return resolve(dataUrl);

    const ImgConstructor = typeof window !== 'undefined' && window.Image ? window.Image : Image;
    const img = new ImgConstructor();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // If image is landscape (wider than tall), rotate 90° clockwise to make it upright portrait
      if (img.width > img.height * 1.1) {
        rotateImageDataUrl(dataUrl, 90, quality).then(resolve);
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
