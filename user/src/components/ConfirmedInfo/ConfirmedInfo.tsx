import { FC } from 'react';
import { ConfirmedInfo as ConfirmedInfoData } from '@/api/confirmedInfoApi';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import Button from '@/components/Button';
import FormContainer from '@/components/FormContainer';
import { useConfirmedInfoActions, useConfirmedInfoTexts } from './hooks';

type ConfirmedInfoProps = {
  isLoading: boolean;
  hasError: boolean;
  confirmedInfo?: ConfirmedInfoData;
  shareUrl: string;
};

const ConfirmedInfo: FC<ConfirmedInfoProps> = ({
  isLoading,
  hasError,
  confirmedInfo,
  shareUrl,
}) => {
  const texts = useConfirmedInfoTexts();
  const { handleCopy, handleShare, isSharing } = useConfirmedInfoActions();

  if (isLoading) {
    return (
      <div className="flex w-full justify-center p-10">
        <p className="text-base text-font">{texts.loading}</p>
      </div>
    );
  }

  if (hasError || !confirmedInfo) {
    return (
      <FormContainer>
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <p className="text-xl font-bold text-font">{texts.error.title}</p>
          <p className="text-base text-font">{texts.error.description}</p>
        </div>
      </FormContainer>
    );
  }

  const { group, assignRentalItems } = confirmedInfo;

  return (
    <FormContainer>
      {/* 共有されたリンクを開いた最初の一目で「自分の団体の情報か」を確認できるようにする */}
      <div className="flex w-full flex-col gap-1">
        <p className="text-xs text-gray-500">{texts.labels.groupName}</p>
        <p className="text-2xl font-bold text-font md:text-3xl">{group.name}</p>
      </div>

      {/* このページの本題: 貸出物品ごとに、物品名を主見出し・詳細を副情報として並べる */}
      {assignRentalItems.length === 0 ? (
        <p className="text-base text-font">{texts.labels.empty}</p>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {assignRentalItems.map((item, index) => (
            <div
              key={index}
              className="flex w-full flex-col gap-2 border-b border-[#b2b2b2] pb-4 last:border-none last:pb-0"
            >
              <p className="text-lg font-bold text-font">
                {item.rentalItemName}
              </p>
              <div className="flex flex-col gap-1 text-base font-medium text-font">
                <span>
                  {texts.headers.stockPlace}:{' '}
                  {item.stockPlaceName || texts.labels.unset}
                </span>
                <span>
                  {texts.headers.rentalPlace}:{' '}
                  {item.rentalPlaceName || texts.labels.unset}
                </span>
                <span>
                  {texts.headers.num}: {item.num}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* コピー・共有ボタンとその注意書きは一つの操作単位としてまとめる */}
      <div className="flex w-full flex-col items-center gap-3">
        <p className="text-center text-sm text-gray-600">
          {texts.labels.shareNotice}
        </p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <Button
            type="button"
            size="mobile"
            color="main"
            variant
            onClick={() => handleCopy(shareUrl)}
          >
            <span className="flex items-center gap-2">
              <FiCopy /> {texts.actions.copy}
            </span>
          </Button>
          <Button
            type="button"
            size="mobile"
            color="main"
            isDisable={isSharing}
            onClick={() => handleShare(shareUrl, group.name)}
          >
            <span className="flex items-center gap-2">
              <FiShare2 /> {texts.actions.share}
            </span>
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default ConfirmedInfo;
