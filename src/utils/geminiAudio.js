// Utility to convert Gemini Flash raw PCM mono 24kHz audio into standard playable WAV Blob URL
export function createAudioUrlFromInlineData(inlineData) {
  if (!inlineData || !inlineData.data) return null;
  const mime = (inlineData.mimeType || '').toLowerCase();
  
  // If it's already a standard audio container
  if (mime.includes('mp3') || mime.includes('mpeg') || mime.includes('ogg') || (mime.includes('wav') && !mime.includes('pcm'))) {
    return `data:${inlineData.mimeType};base64,${inlineData.data}`;
  }

  try {
    const rateMatch = mime.match(/rate=(\d+)/);
    const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
    
    const binary = atob(inlineData.data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // RIFF chunk descriptor
    view.setUint8(0, 0x52); view.setUint8(1, 0x49); view.setUint8(2, 0x46); view.setUint8(3, 0x46); // "RIFF"
    view.setUint32(4, 36 + bytes.length, true);
    view.setUint8(8, 0x57); view.setUint8(9, 0x41); view.setUint8(10, 0x56); view.setUint8(11, 0x45); // "WAVE"

    // fmt sub-chunk
    view.setUint8(12, 0x66); view.setUint8(13, 0x6d); view.setUint8(14, 0x74); view.setUint8(15, 0x20); // "fmt "
    view.setUint32(16, 16, true);         // SubChunk1Size (16 for PCM)
    view.setUint16(20, 1, true);          // AudioFormat (1 = PCM linear)
    view.setUint16(22, 1, true);          // NumChannels (1 = Mono)
    view.setUint32(24, sampleRate, true); // SampleRate (24000 Hz)
    view.setUint32(28, sampleRate * 2, true); // ByteRate (sampleRate * numChannels * bitsPerSample/8)
    view.setUint16(32, 2, true);          // BlockAlign (numChannels * bitsPerSample/8)
    view.setUint16(34, 16, true);         // BitsPerSample (16 bits)

    // data sub-chunk
    view.setUint8(36, 0x64); view.setUint8(37, 0x61); view.setUint8(38, 0x74); view.setUint8(39, 0x61); // "data"
    view.setUint32(40, bytes.length, true);

    const blob = new Blob([view, bytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Gemini audio decode error:', err);
    return null;
  }
}

// Reusable function to request text + natural studio speech from Gemini Flash models (supporting Hindi & English)
export async function requestGeminiSpeech({ apiKey, prompt, voiceName = 'Aoede' }) {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  // Active models: Google recommended gemini-3.8-flash for audio, with fallbacks
  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash-exp'
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName || 'Aoede'
              }
            }
          }
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        
        let text = '';
        let audioBlobUrl = null;

        for (const part of parts) {
          if (part.text) {
            text += (text ? ' ' : '') + part.text.trim();
          }
          if (part.inlineData && part.inlineData.data) {
            audioBlobUrl = createAudioUrlFromInlineData(part.inlineData);
          }
        }

        return { text, audioBlobUrl, modelUsed: model };
      }

      const errorJson = await response.json().catch(() => ({}));
      const msg = errorJson.error?.message || `Model ${model} returned status ${response.status}`;
      lastError = new Error(msg);
      console.warn(`Model ${model} failed, trying next fallback:`, msg);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate speech with available Gemini models');
}
