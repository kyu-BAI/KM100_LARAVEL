// Google Gemini Vision AI OCR Service
// Secure proxy integration with Laravel Backend OCR API.
// Private API keys are managed server-side and never exposed to browser bundles.

import { api } from './api';
import { isLaravelDriver } from './backendAdapter';

/**
 * Returns active Gemini API key:
 * Always returns empty string since API calls are proxied securely through the backend.
 */
export function getGeminiApiKey() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('petc_gemini_api_key');
    } catch {
      // ignore localStorage errors
    }
  }
  return (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || '';
}

export function setCustomGeminiApiKey(_key) {
  // no-op: keys are managed securely on the backend server
}

/**
 * Tests whether OCR / Gemini AI service is available.
 */
export async function testGeminiApiKey(candidateKey) {
  if (isLaravelDriver()) {
    try {
      const res = await api.checkGeminiHealth();
      return { ok: res?.success === true, message: 'Backend Gemini AI service is verified and online.' };
    } catch (err) {
      return { ok: false, error: err.data?.message || err.message || 'Cannot connect to backend Gemini AI service.' };
    }
  }

  const keyToTest = (candidateKey || getGeminiApiKey() || '').trim();
  if (!keyToTest) {
    return { ok: false, error: 'No API key provided.' };
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyToTest}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Ping test. Reply with OK' }] }]
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error?.message || `HTTP ${res.status}`;
      return { ok: false, error: msg };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || 'Network connection error' };
  }
}

/**
 * Runs receipt recognition on an image:
 * Proxies securely through Laravel REST API (/api/v1/ocr/process).
 */
export async function runOcrOnImage(imageSource, onProgress, receiptType = null) {
  try {
    if (onProgress) onProgress(0.15, 'Preparing receipt image for AI analysis...');

    if (isLaravelDriver()) {
      if (onProgress) onProgress(0.35, 'Analyzing receipt with Gemini Vision AI (Server Proxy)...');

      try {
        const payload = {
          image: imageSource,
          receipt_type: receiptType?.name || null,
        };

        const response = await api.post('/ocr/process', payload);

        if (response && response.success && response.data) {
          if (onProgress) onProgress(0.95, 'Receipt details verified with Gemini AI!');
          const d = response.data;
          return {
            isReceipt: true,
            rejectionReason: '',
            establishment: d.establishment || '',
            receiptDate: d.receipt_date || '',
            description: d.description || '',
            amount: typeof d.amount === 'number' ? d.amount : parseFloat(d.amount) || 0,
            orNumber: d.or_number || '',
            lineItems: Array.isArray(d.line_items) ? d.line_items : [],
            rawOcrText: JSON.stringify(d, null, 2),
          };
        } else {
          return {
            isReceipt: false,
            rejectionReason: response?.message || 'Unable to extract structured receipt details from image.',
            establishment: '',
            receiptDate: '',
            description: '',
            amount: 0,
            orNumber: '',
            lineItems: [],
            rawOcrText: '',
          };
        }
      } catch (err) {
        console.warn('Backend OCR proxy error:', err);
        const errMsg = err.data?.message || err.message || 'Server OCR processing error';
        return {
          isReceipt: false,
          rejectionReason: `OCR extraction failed: ${errMsg}`,
          establishment: '',
          receiptDate: '',
          description: '',
          amount: 0,
          orNumber: '',
          lineItems: [],
          rawOcrText: '',
        };
      }
    }

    // Direct Gemini Vision API fallback only if explicit key is supplied
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return {
        isReceipt: false,
        rejectionReason: 'No OCR processing service is configured. Please ensure Laravel backend is running.',
        establishment: '',
        receiptDate: '',
        description: '',
        amount: 0,
        orNumber: '',
        lineItems: [],
        rawOcrText: '',
      };
    }

    return {
      isReceipt: false,
      rejectionReason: 'Legacy direct browser OCR is deprecated. Please use the secure Laravel backend proxy.',
      establishment: '',
      receiptDate: '',
      description: '',
      amount: 0,
      orNumber: '',
      lineItems: [],
      rawOcrText: '',
    };
  } catch (err) {
    console.warn('Gemini OCR processing error:', err);
    return {
      isReceipt: false,
      rejectionReason: 'Receipt scanning failed: ' + (err.message || 'Unknown network error'),
      establishment: '',
      receiptDate: '',
      description: '',
      amount: 0,
      orNumber: '',
      lineItems: [],
      rawOcrText: '',
    };
  }
}
