import Tesseract from 'tesseract.js';

export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const imageData = reader.result as string;
        
        const result = await Tesseract.recognize(
          imageData,
          'eng+urd',
          {
            logger: (m: any) => console.log('[v0] OCR Progress:', m.progress)
          }
        );
        
        resolve(result.data.text);
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(imageFile);
    });
  } catch (error) {
    console.error('[v0] OCR Error:', error);
    throw error;
  }
}

export async function extractTextFromImageURL(imageUrl: string): Promise<string> {
  try {
    const result = await Tesseract.recognize(
      imageUrl,
      'eng+urd',
      {
        logger: (m: any) => console.log('[v0] OCR Progress:', m.progress)
      }
    );
    
    return result.data.text;
  } catch (error) {
    console.error('[v0] OCR Error:', error);
    throw error;
  }
}
