import { useEffect, useMemo, useState } from 'react';
import {
  HealthCenterSubmissionStatus,
  useGetHealthCenterSubmissionStatus,
} from '@/api/healthCenterSubmissionStatusApi';
import { useGetPowerOrders, useMutatePowerOrders } from '@/api/powerApi';
import {
  ORDER_TYPES,
  useGetUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { revalidateCheckAllRegistered } from '../../shared';
import { PowerApplicationFormData } from '../schema';
import { Device, PowerApplicationOption } from '../types';
import { usePowerForm } from './usePowerForm';

// 電力申請フォームの状態管理型
type PowerApplicationState = {
  isEditing: boolean;
  applyPower: PowerApplicationOption;
  submitError: string | null;
  isSubmitted: boolean;
};

export const usePowerApplication = (
  groupId: number,
  status?: HealthCenterSubmissionStatus
) => {
  void status;

  const { t } = useTranslation('common');
  // 電力申請のステート管理
  const [state, setState] = useState<PowerApplicationState>({
    isEditing: false,
    applyPower: 'undecided',
    submitError: null,
    isSubmitted: false,
  });

  // 「はい」未登録時の入力内容を一時保存するstate
  const [pendingDevices, setPendingDevices] = useState<Device[] | null>(null);

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
    mutateUnregisteredGroup,
  } = useGetUnregisteredGroup(groupId, ORDER_TYPES.POWER_ORDER);
  const { mutateHealthCenterSubmissionStatus } =
    useGetHealthCenterSubmissionStatus(groupId);

  // 電力申請の登録・更新・削除機能
  const { submitPowerOrders } = useMutatePowerOrders();

  // フォーム管理
  const initialDefaultValues = useMemo(() => {
    if (!hasExisting) return undefined;

    return {
      devices: devices.map((d) => ({ ...d })),
    };
  }, [hasExisting, devices]);
  const powerForm = usePowerForm(initialDefaultValues);
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
      const result = await submitPowerOrders([], groupId, false);
      if (!result.success) {
        const message = t('applications.power.messages.registerNegativeFailed');
        updateState({ submitError: message });
        toast.error(message);
        return;
      }

      updateState({ applyPower: 'no', isEditing: false });
      await mutatePowerOrders();
      await mutateUnregisteredGroup();
      await mutateHealthCenterSubmissionStatus();
      await revalidateCheckAllRegistered(groupId); // 全体登録状態を再取得
      toast.success(t('applications.power.messages.registerNegativeSuccess'));
    } catch {
      const message = t('applications.power.messages.processError');
      updateState({
        submitError: message,
      });
      toast.error(message);
    }
  };

  // フォーム送信の処理
  const handleFormSubmit = async (data: PowerApplicationFormData) => {
    updateState({ submitError: null });

    if (!groupId) {
      const message = t('applications.power.messages.missingGroup');
      updateState({ submitError: message });
      toast.error(message);
      return;
    }

    try {
      const result = await submitPowerOrders(data.devices, groupId, true);

      if (result.success) {
        await mutatePowerOrders(); // 電力申請データを再取得
        await mutateUnregisteredGroup(); // 未登録テーブルデータを再取得
        await mutateHealthCenterSubmissionStatus();

        updateState({ isEditing: false });
        // 編集か新規登録かによって通知メッセージを変える
        if (hasExisting) {
          toast.success(t('applications.power.messages.updateSuccess'));
        } else {
          toast.success(t('applications.power.messages.createSuccess'));
        }
      } else {
        const message = t('applications.power.messages.submitFailed');
        updateState({
          submitError: message,
        });
        toast.error(message);
      }
    } catch {
      const message = t('applications.power.messages.submitUnexpectedError');
      updateState({
        submitError: message,
      });
      toast.error(message);
    }
  };

  // デバイス削除の処理
  const handleDeleteDevice = (deviceId: number) => {
    const remainingDevices = devices.filter((d) => d.id !== deviceId);

    if (remainingDevices.length === 0) {
      setPendingDevices(devices.map((device) => ({ ...device })));
      updateState({
        applyPower: 'no',
        isEditing: false,
        isSubmitted: false,
        submitError: null,
      });
      return;
    }

    formMethods.reset(
      { devices: remainingDevices.map((device) => ({ ...device })) },
      {
        keepDirty: false,
        keepErrors: false,
        keepDirtyValues: false,
        keepValues: false,
      }
    );
    updateState({
      applyPower: 'yes',
      isEditing: true,
      isSubmitted: false,
      submitError: null,
    });
  };

  // ラジオボタンの値変更ハンドラー
  const handleRadioChange = (value: string) => {
    const radioValue =
      value === '1' ? 'yes' : value === '2' ? 'no' : 'undecided';

    if (radioValue === 'yes') {
      // 「はい」を選択した場合
      const isChangingFromNo = state.applyPower === 'no';

      updateState({
        applyPower: 'yes',
        isEditing: true,
        isSubmitted: false,
      });

      // 「いいえ」から「はい」に戻す場合、pendingDevicesがあればそれを復元する
      if (isChangingFromNo && pendingDevices) {
        formMethods.reset(
          { devices: pendingDevices },
          {
            keepDirty: false,
            keepErrors: false,
            keepDirtyValues: false,
            keepValues: false,
          }
        );
      }
    } else if (radioValue === 'no') {
      // 「はい」から「いいえ」に変えるとき、未登録内容をpendingDevicesに保存する
      if (state.applyPower === 'yes') {
        const currentDevices = formMethods.getValues('devices');
        setPendingDevices(currentDevices);
      }
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
