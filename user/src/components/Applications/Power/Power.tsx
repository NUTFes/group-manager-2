import { FC, useEffect, useState } from 'react';
import { useGetPowerOrders, useMutatePowerOrders } from '@/api/powerApi';
import AccordionMenu from '@/components/AccordionMenu';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import PowerForm from './PowerForm/PowerForm';
import { usePowerForm } from './PowerForm/hooks';
import { PowerApplicationFormData } from './PowerForm/schema';
import { Device, PowerApplicationOption, RadioOption } from './types';

// 電力申請フォーム状態管理
type PowerApplicationState = {
  isEditing: boolean;
  applyPower: PowerApplicationOption;
  submitError: string | null;
  isSubmitted: boolean;
};

// ラジオボタンの選択肢
const RADIO_OPTIONS: RadioOption[] = [
  { id: 1, name: 'はい' },
  { id: 2, name: 'いいえ' },
];

// デバイス情報からフォームアイテムを作成する関数
const createFormItemsForDevice = (device: Device): FormItem[] => {
  const items: FormItem[] = [];
  items.push({ label: '製品名', content: device.productName });
  items.push({ label: 'メーカー名', content: device.manufacturer });
  items.push({ label: '型番', content: device.model });
  if (device.url) {
    items.push({ label: '製品URL', content: device.url });
  }
  return items;
};

// 既存デバイス表示コンポーネント
interface ExistingDevicesViewProps {
  devices: Device[];
  onEdit: () => void;
  onDeleteDevice: (id: number) => void;
  isDeadline: boolean;
}

const ExistingDevicesView: FC<ExistingDevicesViewProps> = ({
  devices,
  onEdit,
  onDeleteDevice,
  isDeadline,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {devices.map((device, index) => (
        <div key={`device-${index}`} className="mb-4">
          <FormList
            items={createFormItemsForDevice(device)}
            onEdit={onEdit}
            isDelete={!isDeadline}
            onDelete={device.id ? () => onDeleteDevice(device.id!) : undefined}
          />
        </div>
      ))}

      {!isDeadline && (
        <div className="flex w-full items-center justify-center gap-4">
          <Button
            size="pc"
            color="main"
            type="button"
            icon="pencil"
            onClick={onEdit}
          >
            修正
          </Button>
        </div>
      )}
    </div>
  );
};

type PowerProps = {
  isDeadline?: boolean;
};

const Power: FC<PowerProps> = ({ isDeadline = false }) => {
  // TODO: useGroupId()が実装されたら修正すること
  const groupId = 1;

  // 電力申請のステート管理
  const [state, setState] = useState<PowerApplicationState>({
    isEditing: false,
    applyPower: 'undecided',
    submitError: null,
    isSubmitted: false,
  });

  // 電力申請データの取得
  const { devices, isLoading, hasError, hasExisting, mutate } =
    useGetPowerOrders(groupId);

  // 電力申請の登録・更新・削除機能
  const { submitPowerOrders, deletePowerOrder, registerUnregisteredGroup } =
    useMutatePowerOrders();

  // フォーム管理
  const { formMethods, fields, addDevice, totalPower, isValid } = usePowerForm(
    hasExisting ? { devices } : undefined
  );

  const { handleSubmit } = formMethods;

  // 状態更新のヘルパー関数
  const updateState = (newState: Partial<PowerApplicationState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  // 既存データがある場合はフォームの状態を初期化
  useEffect(() => {
    if (hasExisting && devices.length > 0) {
      updateState({ applyPower: 'yes' });
    }
  }, [hasExisting, devices]);

  // フォームを編集モードに準備する関数
  const prepareFormForEditing = () => {
    if (devices && devices.length > 0) {
      // 既存デバイスのコピーを作成し、フォームをリセット
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

      // 各フィールドを明示的に設定
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
        await mutate();
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
        await mutate(); // データを再取得
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
      const result = await deletePowerOrder(deviceId);
      if (result.success) {
        await mutate(); // データを再取得
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
    if (value === '1') {
      updateState({
        applyPower: 'yes',
        isEditing: true,
        isSubmitted: false,
      });
    } else if (value === '2') {
      updateState({
        applyPower: 'no',
        isSubmitted: false,
        isEditing: false,
      });
    } else {
      updateState({ applyPower: 'undecided' });
    }
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="w-[400px] py-4 text-center">
        <p>データを読み込み中です...</p>
      </div>
    );
  }

  // エラー表示
  if (hasError) {
    return (
      <div className="relative w-[400px] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        <strong className="font-bold">エラー：</strong>
        <span className="block sm:inline">
          データの取得に失敗しました。ページを再読込してください。
        </span>
      </div>
    );
  }

  // コンポーネントのコンテンツを決定
  let content;
  const { isEditing, applyPower, submitError, isSubmitted } = state;

  if (hasExisting && !isEditing) {
    // 既存データの表示
    content = (
      <ExistingDevicesView
        devices={devices}
        onEdit={prepareFormForEditing}
        onDeleteDevice={handleDeleteDevice}
        isDeadline={isDeadline}
      />
    );
  } else {
    // 新規登録・編集モード
    content = (
      <div className="flex flex-col gap-6">
        {/* ラジオボタン */}
        <Radio
          label="電力申請を行いますか？"
          value={applyPower === 'yes' ? '1' : applyPower === 'no' ? '2' : ''}
          onChange={handleRadioChange}
          required
          options={RADIO_OPTIONS}
        />

        {/* 申請する場合のフォーム */}
        {applyPower === 'yes' && isEditing && (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-8 flex flex-col gap-10">
              {fields.map((field, index) => (
                <PowerForm key={field.id} index={index} form={formMethods} />
              ))}
            </div>

            {/* 電力超過警告 */}
            {totalPower > 1500 && (
              <div className="mb-4 text-center text-red-600">
                合計電力が1500Wを超えています。申請にはメール連絡が必要です。
              </div>
            )}

            {/* 操作ボタン */}
            <div className="mt-6 flex justify-center gap-4">
              <Button
                type="button"
                size="pc"
                color="main"
                icon="plus"
                variant
                onClick={addDevice}
              >
                物品の追加
              </Button>

              <Button
                type="submit"
                size="pc"
                color="main"
                isDisable={!isValid || totalPower > 1500}
              >
                登録
              </Button>
            </div>
          </form>
        )}

        {/* 申請しない場合の表示 */}
        {applyPower === 'no' && !isSubmitted && (
          <div className="flex flex-col items-center gap-4">
            {submitError && (
              <div className="relative w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                <strong className="font-bold">エラー：</strong>
                <span className="block sm:inline">{submitError}</span>
              </div>
            )}
            <Button
              type="button"
              size="pc"
              color="main"
              onClick={() => {
                handleApplyNegative();
                updateState({ isSubmitted: true });
              }}
            >
              登録
            </Button>
          </div>
        )}

        {/* 申請しない選択後の完了表示 */}
        {applyPower === 'no' && isSubmitted && (
          <div className="text-center">
            <p className="mb-4 text-[#FF6752]">
              電力申請を行わない登録が完了しました
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <AccordionMenu
      title={'電力申請'}
      isEdit={isEditing}
      isExist={hasExisting}
      required={false}
    >
      {content}
    </AccordionMenu>
  );
};

export default Power;
