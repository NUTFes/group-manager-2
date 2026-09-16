import { FC, ReactNode } from 'react';
import { ConfirmedInfo as ConfirmedInfoData } from '@/api/confirmedInfoApi';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import Button from '@/components/Button';
import FormContainer from '@/components/FormContainer';
import ImagePreview from '@/components/ImagePreview';
import { useConfirmedInfoActions, useConfirmedInfoTexts } from './hooks';

type ConfirmedInfoProps = {
  isLoading: boolean;
  hasError: boolean;
  confirmedInfo?: ConfirmedInfoData;
  // 共有・コピーの対象URL。押された瞬間に解決するため関数で受け取る
  getShareUrl: () => string;
  // このページのQRコード（data URI）。確定情報とは別のAPIから取るため、
  // 取得できていない間や失敗した場合は undefined になり、QRの領域だけが出ない
  qrcodePng?: string;
};

type LabeledValueProps = {
  label: string;
  children: ReactNode;
};

// 団体情報カードの1項目。ラベルと値の組を縦に積む
const LabeledValue: FC<LabeledValueProps> = ({ label, children }) => (
  <div className="flex w-full flex-col gap-1">
    <p className="text-xs text-gray-500">{label}</p>
    {children}
  </div>
);

const ConfirmedInfo: FC<ConfirmedInfoProps> = ({
  isLoading,
  hasError,
  confirmedInfo,
  getShareUrl,
  qrcodePng,
}) => {
  const texts = useConfirmedInfoTexts();
  const { handleCopy, handleShare } = useConfirmedInfoActions();

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

  const { group, rentalItems } = confirmedInfo;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 団体情報。共有されたリンクを開いた最初の一目で自分の団体か確認できるようにする */}
      <FormContainer>
        <div className="flex w-full flex-col gap-4">
          <LabeledValue label={texts.labels.groupName}>
            <p className="text-2xl font-bold text-font md:text-3xl">
              {group.name}
            </p>
          </LabeledValue>
          <LabeledValue label={texts.labels.projectName}>
            <p className="text-base font-medium text-font">
              {group.projectName || texts.labels.unset}
            </p>
          </LabeledValue>
          {/* 会場は has_many なので複数割り当てられていることがある */}
          <LabeledValue label={texts.labels.places}>
            {group.places.length === 0 ? (
              <p className="text-base font-medium text-font">
                {texts.labels.unset}
              </p>
            ) : (
              group.places.map((place) => (
                <p key={place} className="text-base font-medium text-font">
                  {place}
                </p>
              ))
            )}
          </LabeledValue>
        </div>
      </FormContainer>

      {/* 貸出物品。APIが (物品, 貸出場所) ごとにまとめ、並び順も固定して返している */}
      <FormContainer>
        <div className="flex w-full flex-col gap-6">
          <p className="text-xl font-bold text-font">
            {texts.labels.rentalItems}
          </p>

          {rentalItems.length === 0 ? (
            <p className="text-base text-font">{texts.labels.empty}</p>
          ) : (
            rentalItems.map((item) => (
              <div
                key={`${item.rentalItemName}-${item.rentalPlaceName}`}
                className="flex w-full flex-col gap-2"
              >
                <p className="text-lg font-bold text-font">
                  {item.rentalItemName}
                </p>
                <p className="text-sm text-gray-600">
                  {texts.headers.rentalPlace}:{' '}
                  {item.rentalPlaceName || texts.labels.unset}
                </p>
                <table className="w-full table-fixed border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-[#b2b2b2] px-3 py-2 text-xs font-normal text-gray-500">
                        {texts.headers.stockPlace}
                      </th>
                      <th className="w-24 border border-[#b2b2b2] px-3 py-2 text-right text-xs font-normal text-gray-500">
                        {texts.headers.num}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.stocks.map((stock) => (
                      <tr key={stock.stockPlaceName}>
                        <td className="break-words border border-[#b2b2b2] px-3 py-2 text-base font-medium text-font">
                          {stock.stockPlaceName || texts.labels.unset}
                          {/* 備考は物品貸出表に倣い、列を増やさずセル内に小さめの文字で添える。
                              確定画面は物品ごとにまとめており物品名が見出しになるため、
                              割り当て単位で対応が付く在庫場所のセルに置く */}
                          {stock.remark && (
                            <span className="mt-1 block text-sm font-normal text-gray-600">
                              {stock.remark}
                            </span>
                          )}
                        </td>
                        <td className="border border-[#b2b2b2] px-3 py-2 text-right text-base font-medium text-font">
                          {stock.num}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </FormContainer>

      {/* 共有・コピーはページ全体に対する操作なので、用途別に分けたどちらのカードにも入れない */}
      <div className="flex w-full flex-col items-center gap-3">
        {/* QRコードは data URI なので next/image の最適化を通せない。
            ImagePreview がタップでの拡大表示も持っているため、そのまま使う */}
        {qrcodePng && (
          <ImagePreview
            src={qrcodePng}
            alt={texts.labels.qrcodeAlt}
            thumbnailClassName="h-40 w-40"
            unoptimized
          />
        )}
        <p className="text-center text-sm text-gray-600">
          {texts.labels.shareNotice}
        </p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <Button
            type="button"
            size="mobile"
            color="main"
            variant
            onClick={() => handleCopy(getShareUrl())}
          >
            <span className="flex items-center gap-2">
              <FiCopy /> {texts.actions.copy}
            </span>
          </Button>
          <Button
            type="button"
            size="mobile"
            color="main"
            onClick={() => handleShare(getShareUrl(), group.name)}
          >
            <span className="flex items-center gap-2">
              <FiShare2 /> {texts.actions.share}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedInfo;
