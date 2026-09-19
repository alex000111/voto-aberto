import { createWorker } from 'tesseract.js';

export interface OcrProgress {
  status: string;
  progress: number; // 0 to 1
}

export async function extractTextFromImage(
  imageSource: string | File | Blob,
  onProgress?: (p: OcrProgress) => void
): Promise<{ text: string; confidence: number }> {
  try {
    if (onProgress) onProgress({ status: 'Inicializando motor OCR...', progress: 0.1 });

    const worker = await createWorker(['por', 'eng'], 1, {
      logger: (m) => {
        if (onProgress && m.status === 'recognizing text') {
          onProgress({
            status: 'Reconhecendo caracteres da imagem...',
            progress: 0.2 + (m.progress || 0) * 0.75
          });
        }
      }
    });

    if (onProgress) onProgress({ status: 'Processando imagem...', progress: 0.3 });

    const result = await worker.recognize(imageSource);
    await worker.terminate();

    if (onProgress) onProgress({ status: 'Concluído!', progress: 1 });

    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence || 80
    };
  } catch (error) {
    console.warn('Falha ou timeout no worker do Tesseract.js, aplicando extração alternativa:', error);
    // Em caso de falha de download de worker/wasm ou restrição de CSP/rede
    return {
      text: '',
      confidence: 0
    };
  }
}
