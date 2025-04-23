import { useEffect, useState } from 'react';
import {
  useGetPowerOrders,
  useGetUnregisteredGroup,
  useMutatePowerOrders,
} from '@/api/powerApi';
import { DEFAULT_DEVICE } from '../constants';
import { PowerApplicationFormData } from '../schema';
import { PowerApplicationOption } from '../types';
import { usePowerForm } from './usePowerForm';

// 電力申請フォームの状態管理型
type PowerApplicationState = {
  isEditing: boolean;
  applyPower: PowerApplicationOption;
  submitError: string | null;
  isSubmitted: boolean;
};

export const usePowerApplication = (groupId: number) => {
  // 電力申請のステート管理
  const [state, setState] = useState<PowerApplicationState>({
    isEditing: false,
    applyPower: 'undecided',
    submitError: null,
    isSubmitted: false,
  });

  // 電力申請データの取得
  const {
    devices,
    isLoading: isLoadingPowerOrders,
    hasError: hasErrorPowerOrders,
    hasExisting,
    mutate: mutatePowerOrders,
  } = useGetPowerOrders(groupId);

  // 未登録テーブルのデータの取得
  const {
    hasUnregistered,
    isLoading: isLoadingUnregistered,
    hasError: hasErrorUnregistered,
    mutate: mutateUnregistered,
  } = useGetUnregisteredGroup(groupId);

  // 電力申請の登録・更新・削除機能
  const {
    submitPowerOrders,
    deletePowerOrder,
    registerUnregisteredGroup,
    deleteUnregisteredGroup,
  } = useMutatePowerOrders();

  // フォーム管理
  const powerForm = usePowerForm(hasExisting ? { devices } : undefined);
  const { formMethods } = powerForm;

  // 状態更新のヘルパー関数
  const updateState = (newState: Partial<PowerApplicationState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  // ラジオボタンの値を計算するヘルパー関数
  const getRadioValue = (option: PowerApplicationOption): string => {
    if (option === 'yes') return '1';
    if (option === 'no') return '2';
    return '';
  };

  // 初期状態の設定
  useEffect(() => {
    // 両方のデータが読み込まれた後に実行する
    if (isLoadingPowerOrders || isLoadingUnregistered) return;

    // まだユーザーが選択していない初期状態の場合のみ設定する
    if (state.applyPower === 'undecided') {
      if (hasExisting && devices.length > 0) {
        // 電力申請データが存在する場合は「はい」を選択
        updateState({ applyPower: 'yes' });
      } else if (hasUnregistered) {
        // 未登録グループデータが存在する場合は「いいえ」を選択
        updateState({ applyPower: 'no' });
      }
    }
  }, [
    isLoadingPowerOrders,
    isLoadingUnregistered,
    hasExisting,
    hasUnregistered,
    devices,
    state.applyPower,
  ]);

  // フォームを編集モードを準備する関数
  const prepareFormForEditing = () => {
    if (devices && devices.length > 0) {
      // 既存デバイスのコピーを作成し、フォームをリセットする
      const devicesWithId = devices.map((device) => ({ ...device }));

      formMethods.reset(
        { devices: devicesWithId },
        {
          keepDirty: false,
          keepErrors: false,
          keepDirtyValues: false,
          keepValues: false,
        }
      );

      // 各フィールドを設定
      devicesWithId.forEach((device, index) => {
        formMethods.setValue(
          `devices.${index}.productName`,
          device.productName
        );
        formMethods.setValue(`devices.${index}.maxPower`, device.maxPower);
        formMethods.setValue(
          `devices.${index}.manufacturer`,
          device.manufacturer
        );
        formMethods.setValue(`devices.${index}.model`, device.model);
        formMethods.setValue(`devices.${index}.url`, device.url || '');

        if (device.id) {
          formMethods.setValue(`devices.${index}.id`, device.id);
        }
      });
    }
    updateState({ isEditing: true });
  };

  // 申請しないを選択した場合の処理
  const handleApplyNegative = async () => {
    try {
      // 既存の申請があれば削除
      if (hasExisting && devices.length > 0) {
        const deletePromises = devices.map((device) =>
          device.id
            ? deletePowerOrder(device.id)
            : Promise.resolve({ success: true })
        );
        await Promise.all(deletePromises);
      }

      // 未登録グループとして登録する
      const result = await registerUnregisteredGroup(groupId);

      if (result.success) {
        updateState({ applyPower: 'no' });
        await mutatePowerOrders();
        await mutateUnregistered();
      } else {
        updateState({
          submitError: '申請の登録に失敗しました。もう一度お試しください。',
        });
      }
    } catch {
      updateState({
        submitError: '申請の処理に失敗しました。もう一度お試しください。',
      });
    }
  };

  // フォーム送信の処理
  const handleFormSubmit = async (data: PowerApplicationFormData) => {
    updateState({ submitError: null });

    if (!groupId) {
      updateState({ submitError: 'グループIDが取得できませんでした。' });
      return;
    }

    try {
      // 申請なしから申請ありに変更した場合、未登録テーブルの情報を削除
      await deleteUnregisteredGroup(groupId);

      // IDが保持されているか確認
      const devicesWithId = data.devices.map((device, index) => {
        // 既存のデバイスと対応するIDをマッピング
        if (devices && devices[index] && devices[index].id) {
          return { ...device, id: devices[index].id };
        }
        return device;
      });

      const result = await submitPowerOrders(devicesWithId, groupId, devices);

      if (result.success) {
        await mutatePowerOrders(); // 電力申請データを再取得
        await mutateUnregistered(); // 未登録テーブルデータを再取得
        updateState({ isEditing: false });
      } else {
        updateState({
          submitError: '申請の送信に失敗しました。もう一度お試しください。',
        });
      }
    } catch {
      updateState({
        submitError: '申請の送信中にエラーが発生しました。',
      });
    }
  };

  // デバイス削除の処理
  const handleDeleteDevice = async (deviceId: number) => {
    try {
      // 削除前に残りのデバイス数を計算する
      const remainingDevices = devices.filter((d) => d.id !== deviceId);
      const willBeEmpty = remainingDevices.length === 0;

      const result = await deletePowerOrder(deviceId);
      if (result.success) {
        await mutatePowerOrders();

        // すべてのデバイスが削除された場合、編集モードに切り替える
        if (willBeEmpty) {
          updateState({
            isEditing: true,
            applyPower: 'yes',
          });

          // フォームを初期化
          formMethods.reset({ devices: [{ ...DEFAULT_DEVICE }] });
        }
      } else {
        updateState({
          submitError: '機器の削除に失敗しました。もう一度お試しください。',
        });
      }
    } catch {
      updateState({
        submitError: '機器の削除中にエラーが発生しました。',
      });
    }
  };

  // ラジオボタンの値変更ハンドラー
  const handleRadioChange = (value: string) => {
    const radioValue =
      value === '1' ? 'yes' : value === '2' ? 'no' : 'undecided';

    if (radioValue === 'yes') {
      updateState({
        applyPower: 'yes',
        isEditing: true,
        isSubmitted: false,
      });
    } else if (radioValue === 'no') {
      updateState({
        applyPower: 'no',
        isSubmitted: false,
        isEditing: false,
      });
    } else {
      updateState({ applyPower: 'undecided' });
    }
  };

  // フォーム登録完了を知らせる
  const completeSubmission = () => {
    updateState({ isSubmitted: true });
  };

  // ローディング状態
  const isLoading = isLoadingPowerOrders || isLoadingUnregistered;

  // エラー状態
  const hasError = hasErrorPowerOrders || hasErrorUnregistered;

  return {
    // 状態
    state,
    isLoading,
    hasError,
    hasExisting,
    hasUnregistered,
    devices,

    // フォーム関連
    powerForm,

    // アクション
    handleFormSubmit,
    handleApplyNegative,
    handleDeleteDevice,
    handleRadioChange,
    prepareFormForEditing,
    completeSubmission,

    // ヘルパー
    getRadioValue,
  };
};
