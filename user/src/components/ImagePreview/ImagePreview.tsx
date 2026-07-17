import { FC, ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal/Modal';

type ImagePreviewProps = {
  src?: string | null;
  alt: string;
  emptyFallback?: ReactNode;
  thumbnailClassName?: string;
  unoptimized?: boolean;
};

const ImagePreview: FC<ImagePreviewProps> = ({
  src,
  alt,
  emptyFallback = null,
  thumbnailClassName = 'h-48 w-full',
  unoptimized,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (!src) {
    return <>{emptyFallback}</>;
  }

  const shouldSkipOptimization = unoptimized ?? src.startsWith('blob:');

  return (
    <>
      <button
        type="button"
        aria-label={alt || '画像プレビューを開く'}
        className={`relative block cursor-pointer rounded border-0 bg-transparent p-0 ${thumbnailClassName}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized={shouldSkipOptimization}
          className="rounded object-contain"
        />
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <button
          type="button"
          aria-label={alt || '画像プレビューを閉じる'}
          className="relative h-[80vh] w-[80vw] max-w-[880px] cursor-pointer border-0 bg-transparent p-0"
          onClick={() => setIsModalOpen(false)}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 880px) 80vw, 880px"
            unoptimized={shouldSkipOptimization}
            className="object-contain"
          />
        </button>
      </Modal>
    </>
  );
};

export default ImagePreview;
