import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useGetConfirmedInfo } from '@/api/confirmedInfoApi';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfirmedInfo from '@/components/ConfirmedInfo';

// group_id は数値の文字列のみ許可する。配列（?group_id=1&group_id=2）や非数値は不正とする
const parseGroupId = (value: string | string[] | undefined): number | null => {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  return Number(value);
};

// secret は空でない文字列のみ許可する。配列（?secret=a&secret=b）は不正とする
const parseSecret = (value: string | string[] | undefined): string | null => {
  if (typeof value !== 'string' || value === '') return null;
  return value;
};

export default function ConfirmedPage() {
  const router = useRouter();
  const groupId = parseGroupId(router.query.group_id);
  const secret = parseSecret(router.query.secret);
  const isParamsValid = groupId !== null && secret !== null;

  const { confirmedInfo, confirmedInfoError, confirmedInfoLoading } =
    useGetConfirmedInfo(
      router.isReady && isParamsValid ? groupId : null,
      router.isReady && isParamsValid ? secret : null
    );

  // router.isReady になるまではクエリが空になるため、それまでは判定を確定させない
  const isLoading = !router.isReady || confirmedInfoLoading;
  const hasError = router.isReady && (!isParamsValid || !!confirmedInfoError);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <Head>
        <title>確定情報 | Group Manager</title>
        {/* secretを含むURLが第三者に共有されても検索エンジンに登録されないようにする */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="m-4 flex justify-center lg:m-10">
        <div className="w-full max-w-[600px]">
          <ConfirmedInfo
            isLoading={isLoading}
            hasError={hasError}
            confirmedInfo={confirmedInfo}
            shareUrl={shareUrl}
          />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ja', ['common'])),
  },
});
