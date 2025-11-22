
import FileSaver from 'file-saver';

export const downloadFile = (content: string | Blob, filename: string) => {
  const saveAs = (FileSaver as any).saveAs || FileSaver;
  saveAs(content, filename);
};

export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};
