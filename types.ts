
export enum OperationMode {
  ENCRYPT = 'ENCRYPT',
  DECRYPT = 'DECRYPT'
}

export type Language = 'uz' | 'en' | 'tr';
export type Theme = 'dark' | 'light';

export interface CryptoResult {
  success: boolean;
  data: string;
  errorKey?: string;
}
