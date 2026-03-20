import { createWorker } from 'tesseract.js';

/**
 * 实现本地 OCR 识别图片文字的功能
 * 使用 Tesseract.js 在浏览器端运行，不依赖后端或 API Key
 * 支持中文（简体）和英文识别 (chi_sim + eng)
 */
export async function runOCR(file: File | string): Promise<string> {
  console.log('开始 OCR 识别...', file);
  
  // 创建 worker
  const worker = await createWorker('chi_sim+eng', 1, {
    logger: m => console.log('OCR 进度:', m), // 保留进度日志
  });

  try {
    // 识别文字
    const { data: { text } } = await worker.recognize(file);
    console.log('OCR 识别完成:', text);
    return text;
  } catch (error) {
    console.error('OCR 识别出错:', error);
    throw error;
  } finally {
    // 终止 worker 释放资源
    await worker.terminate();
  }
}
