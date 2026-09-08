import {
  HealthCenterSubmissionStatus,
  useUpdateSubmissionStatusFor,
} from '@/api/healthCenterSubmissionStatusApi';
import { toast } from 'react-toastify';

/**
 * 再提出フロー用の「送信成功後にステータスを unapproved へ戻す」処理を共通化する。
 *
 * 保健所の再提出ステータス管理を持つ群（RentItems / Employees / VenueMap /
 * PurchaseLists / FoodProduct / CookingProcessOrder）が、
 *
 *   1. 既に unapproved なら何もしない
 *   2. `useUpdateSubmissionStatusFor` で unapproved へ更新する
 *   3. 失敗したら console.error + toast.error で通知し、false を返す
 *
 * という同じ分岐をそれぞれ手書きしていたのを一本化したもの。
 * 戻り値が false のときは呼び出し側で後続処理（`toEdit()` 等）を中断すること。
 */
export const useSubmissionStatusReset = (
  groupId: number | undefined,
  applicationType: string,
  status: HealthCenterSubmissionStatus | undefined,
  errorMessage: string
): (() => Promise<boolean>) => {
  const updateStatus = useUpdateSubmissionStatusFor(groupId, applicationType);

  return async () => {
    if (status === 'unapproved') return true;

    try {
      await updateStatus('unapproved');
      return true;
    } catch (e) {
      console.error(e);
      toast.error(errorMessage);
      return false;
    }
  };
};
