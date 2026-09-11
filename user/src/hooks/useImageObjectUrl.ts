import { useEffect, useState } from 'react';

export const useImageObjectUrl = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const setPreviewUrlFromFile = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
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
    setPreviewUrlFromFile,
  };
};
