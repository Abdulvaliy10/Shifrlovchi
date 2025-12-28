
import CryptoJS from 'crypto-js';
import { CryptoResult } from '../types';

export const encryptText = (text: string, password: string): CryptoResult => {
  try {
    if (!text || !password) {
      return { success: false, data: '', errorKey: 'errorEmpty' };
    }
    const ciphertext = CryptoJS.AES.encrypt(text, password).toString();
    return { success: true, data: ciphertext };
  } catch (error) {
    return { success: false, data: '', errorKey: 'errorFailed' };
  }
};

export const decryptText = (ciphertext: string, password: string): CryptoResult => {
  try {
    if (!ciphertext || !password) {
      return { success: false, data: '', errorKey: 'errorEmpty' };
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalText) {
      return { success: false, data: '', errorKey: 'errorIncorrect' };
    }

    return { success: true, data: originalText };
  } catch (error) {
    return { success: false, data: '', errorKey: 'errorIncorrect' };
  }
};
