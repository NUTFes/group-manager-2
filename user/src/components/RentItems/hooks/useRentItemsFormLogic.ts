// src/components/RentItems/hooks/useRentItemsForm.ts
import { useEffect, useRef, useState } from 'react';
import {
  useMutateRentalOrders,
  useRentableItemsByType,
  useRentalOrdersByGroupId,
} from '@/api/rentItemsApi';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  RentItemsFormData,
  rentItemsFormResolver,
} from '../RentItemsForm/schema';

export const useRentItemsFormLogic = () => {
  // 認証基盤ができたら、グループIDを取得する
  const currentGroupId = 1;
  const [submitError, setSubmitError] = useState<string>('');

  // 初期化完了フラグを追加
  const isInitialized = useRef(false);
  // ユーザーが手動で変更したかどうかを追跡
  const userChangedLocationType = useRef(false);

  // React Hook Form初期化 (Zodスキーマ使用)
  const form = useForm<RentItemsFormData>({
    defaultValues: {
      hasItems: false,
      locationType: '1', // Default to indoor
      items: [{ itemId: '', count: 1 }],
    },
    resolver: rentItemsFormResolver,
    mode: 'onChange',
  });

  const { control, watch, setValue, handleSubmit, reset, formState, trigger } =
    form;
  const { errors, isValid } = formState;

  // fieldArrayを使用して動的なフォームを管理
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // フォーム値の監視
  const hasItems = watch('hasItems');
  const locationType = watch('locationType');

  // 既存のAPIフックを使用
  const { items, itemsError, itemsLoading } =
    useRentableItemsByType(locationType);

  const {
    rentalOrders,
    rentalOrdersError,
    rentalOrdersLoading,
    mutateRentalOrders,
  } = useRentalOrdersByGroupId(currentGroupId);

  const { submitRentalOrders, deleteRentalOrders } = useMutateRentalOrders();

  const hasExisting = rentalOrders.length > 0;

  // 物品のオプション
  const itemOptions = [
    { id: 0, name: '選んでください' },
    ...items.map((item) => ({
      id: item.id,
      name: item.name,
    })),
  ];

  // 初期データの設定
  useEffect(() => {
    // 既に初期化済み、またはユーザーが手動で変更した場合は実行しない
    if (
      isInitialized.current ||
      userChangedLocationType.current ||
      rentalOrders.length === 0 ||
      items.length === 0
    ) {
      return;
    }

    try {
      // 保存されている物品データを設定
      const savedItems = rentalOrders.map((item) => ({
        itemId: item.rental_item_id.toString(),
        count: item.num,
      }));

      // 各申請物品が屋内用か屋外用かを判定
      const isInsideOnly = rentalOrders.every((order) => {
        const item = items.find((i) => i.id === order.rental_item_id);
        return item?.is_inside_shop_rentable && !item?.is_outside_shop_rentable;
      });

      const isOutsideOnly = rentalOrders.every((order) => {
        const item = items.find((i) => i.id === order.rental_item_id);
        return !item?.is_inside_shop_rentable && item?.is_outside_shop_rentable;
      });

      // 明確に屋内のみ、または屋外のみと判定できる場合
      let initialLocationType: string; // デフォルトは屋内
      if (isInsideOnly) {
        initialLocationType = '1'; // 屋内
      } else if (isOutsideOnly) {
        initialLocationType = '2'; // 屋外
      } else {
        // 混在している場合は、物品の数でより多い方を判定
        let insideCount = 0;
        let outsideCount = 0;

        for (const order of rentalOrders) {
          const item = items.find((i) => i.id === order.rental_item_id);
          if (item) {
            if (item.is_inside_shop_rentable) insideCount += order.num;
            if (item.is_outside_shop_rentable) outsideCount += order.num;
          }
        }

        // 屋外物品が多ければ屋外、そうでなければ屋内をデフォルトに
        initialLocationType = outsideCount > insideCount ? '2' : '1';
      }

      // フォームをリセット - Zodスキーマに基づく値の設定
      const formData: RentItemsFormData = {
        hasItems: true,
        locationType: initialLocationType,
        items: savedItems.length > 0 ? savedItems : [{ itemId: '', count: 1 }],
      };

      // スキーマに対して値をバリデーション
      reset(formData);

      // 初期化完了をマーク
      isInitialized.current = true;
    } catch (error) {
      console.error('初期データの読み込みエラー:', error);
      // エラーが発生した場合でも初期化完了をマーク（無限ループ防止）
      isInitialized.current = true;
    }
  }, [rentalOrders, items, reset]);

  // locationType変更時の処理
  useEffect(() => {
    // ユーザーが会場タイプを変更した場合、そのタイプに適した空のフォームをセット
    if (userChangedLocationType.current && hasItems) {
      // itemsだけをリセット（会場タイプと物品利用有無は保持）
      setValue('items', [{ itemId: '', count: 1 }]);
    }
  }, [locationType, hasItems, setValue]);

  // 会場タイプのラジオボタンを更新
  const updateLocationType = (value: string) => {
    // ユーザーが手動で変更したとマーク
    userChangedLocationType.current = true;
    setValue('locationType', value);

    // フォームの検証を手動でトリガー
    trigger();
  };

  // 物品を追加
  const addItem = () => {
    append({ itemId: '', count: 1 });
    // 新しいアイテムを追加した後にフォームを再検証
    setTimeout(() => trigger(), 0);
  };

  // フォーム送信のハンドラー
  const onSubmit: SubmitHandler<RentItemsFormData> = async (data) => {
    try {
      setSubmitError('');

      // Zodスキーマを通じて既に検証済みのデータを使用

      // 「いいえ」が選択された場合、既存のデータを削除
      if (!data.hasItems) {
        if (rentalOrders.length > 0) {
          // 既存のデータをすべて削除
          const result = await deleteRentalOrders(
            rentalOrders.map((item) => item.id)
          );

          if (result.success) {
            alert('物品申請を取り消しました。');
            mutateRentalOrders();
          } else {
            setSubmitError(
              '削除中にエラーが発生しました。もう一度お試しください。'
            );
          }
        } else {
          alert('物品申請がありません。');
        }
        return;
      }

      // 「はい」が選択された場合、データを保存または更新
      // 新しい物品データを作成 - Zodによって検証済みのデータを使用
      const newItemsData = data.items!.map((item) => ({
        group_id: currentGroupId,
        rental_item_id: parseInt(item.itemId, 10),
        num: item.count,
      }));

      // データを送信
      const result = await submitRentalOrders(newItemsData, rentalOrders);

      if (result.success) {
        alert(
          rentalOrders.length > 0
            ? '物品申請を更新しました。'
            : '物品申請を登録しました。'
        );
        await mutateRentalOrders();
        // 送信が成功したら、ユーザー変更フラグをリセット
        userChangedLocationType.current = false;
      } else {
        setSubmitError(
          '送信中にエラーが発生しました。もう一度お試しください。'
        );
      }
    } catch (error) {
      console.error('物品申請エラー:', error);
      setSubmitError('予期せぬエラーが発生しました。もう一度お試しください。');
    }
  };

  const isLoading = itemsLoading || rentalOrdersLoading;
  const hasError = !!(itemsError || rentalOrdersError);

  return {
    form,
    fields,
    control,
    hasItems,
    locationType,
    updateLocationType,
    itemOptions,
    addItem,
    remove,
    handleSubmit: handleSubmit(onSubmit),
    isLoading,
    hasError,
    errors,
    submitError,
    isValid,
    hasExisting,
  };
};
