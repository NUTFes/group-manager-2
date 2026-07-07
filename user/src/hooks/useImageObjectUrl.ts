import { useEffect, useState } from 'react';

export const useImageObjectUrl = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const setPreviewFile = (file: File) => {
    const nextUrl = URL.createObjectURL(file);

    setPreviewUrl((previousUrl) => {
      if (previousUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previousUrl);
      }

      return nextUrl;
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    previewUrl,
    setPreviewFile,
  };
};
