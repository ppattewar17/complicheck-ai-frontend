import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile) => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log(m.status),
        tessedit_pageseg_mode: 6,
        preserve_interword_spaces: 1,
      }
    );
    
    return result.data.text.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};
