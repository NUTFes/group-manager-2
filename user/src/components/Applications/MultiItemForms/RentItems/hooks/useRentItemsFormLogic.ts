// src/components/Applications/MultiItemForms/RentItems/hooks/useRentItemsFormLogic.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ORDER_TYPES,
  useCheckUnRegisteredGroup,
  useMutateRentalOrders,
  useRegisterUnRegisteredGroup,
  useRentableItemsByType,
  useRentalOrdersByGroupId,
} from '@/api/rentItemsApi';
import { useGetPlaceOrder } from '@/api/venueApplication';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useApiGet } from '@/hooks/useApi';
import {
  RentItemsFormData,
  rentItemsFormResolver,
} from '../RentItemsForm/schema';

export const useRentItemsFormLogic = () => {
  // 認証基盤ができたら、グループIDを取得する
  const currentGroupId = 1;
  const [submitError, setSubmitError] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // 初期化完了フラグを追加
  const isInitialized = useRef(false);
  // ユーザーが手動で変更したかどうかを追跡
  const userChangedLocationType = useRef(false);
  // 自動的に会場タイプを変更中かどうかを追跡
  const autoChangingLocationType = useRef(false);

  // 全ての貸出物品データを取得（屋内・屋外の判定に使用）
  const { data: rentableItemsData, isLoading: rentableItemsLoading } =
    useApiGet<{
      data: Array<{
        id: number;
        name: string;
        is_inside_shop_rentable: boolean;
        is_outside_shop_rentable: boolean;
        is_stage_rentable: boolean;
        created_at: string;
        updated_at: string;
      }>;
    }>('/api/v1/get_all_rentable_items');

  // React Hook Form初期化 (Zodスキーマ使用)
  const form = useForm<RentItemsFormData>({
    defaultValues: {
      hasItems: false,
      locationType: '1', // デフォルトは屋内 (1 = 屋内)
      items: [{ itemId: '', count: 1 }],
    },
    resolver: rentItemsFormResolver,
    mode: 'onChange',
    // フォーム状態を適切に追跡するためのオプション
    shouldUnregister: false,
    shouldFocusError: true,
  });

  const { control, watch, setValue, reset, formState, trigger } = form;
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
  const { registerUnRegisteredGroup, deleteUnRegisteredGroup } =
    useRegisterUnRegisteredGroup();
  const { checkUnRegisteredGroup } = useCheckUnRegisteredGroup();

  const hasExisting = rentalOrders.length > 0;

  // 物品のオプション
  const itemOptions = useMemo(
    () => [
      { id: 0, name: '選んでください' },
      ...items.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    ],
    [items]
  );

  // フォームをリセットする関数 - 会場タイプを屋内にデフォルト設定
  const resetFormToDefault = () => {
    userChangedLocationType.current = false;
    reset({
      hasItems: false,
      locationType: '1', // 屋内をデフォルトに設定
      items: [{ itemId: '', count: 1 }],
    });
  };

  const openEditMode = async () => {
    try {
      // 編集に干渉する可能性のあるユーザー固有のフラグをリセット
      userChangedLocationType.current = false;
      autoChangingLocationType.current = false;
      setIgnoreItemChanges(false);

      // 編集モードを有効化
      setIsEditMode(true);

      // 現在のhasItems値を取得
      const currentHasItems = form.getValues('hasItems');

      // ユーザーが物品を希望する場合、フォームを適切に準備
      if (currentHasItems) {
        // 既存データがある場合、適切に読み込まれていることを確認
        if (hasExisting) {
          const currentValues = form.getValues();

          // Reactが状態変更を処理する時間を確保するためにsetTimeoutを使用
          setTimeout(() => {
            // 現在の値でフォームをリセット
            reset(
              {
                ...currentValues,
                hasItems: true,
              },
              {
                keepValues: true,
                keepDirty: true,
                keepIsSubmitted: false,
                keepTouched: false,
                keepErrors: false,
                keepIsValid: false,
                keepSubmitCount: false,
              }
            );

            // リセット後に検証を強制実行
            trigger();
          }, 50);
        } else {
          // 既存データがない場合はデフォルト値にリセット
          reset({
            hasItems: true,
            locationType: '1', // デフォルトは屋内
            items: [{ itemId: '', count: 1 }],
          });
        }
      } else {
        // ユーザーが物品を希望しない場合はhasItemsをfalseに設定
        reset({
          ...form.getValues(),
          hasItems: false,
        });
      }

      // フォームリセット後に検証を強制実行
      setTimeout(() => trigger(), 100);
    } catch (error) {
      console.error('編集モード起動エラー:', error);
      setSubmitError('予期せぬエラーが発生しました。');
      alert('予期せぬエラーが発生しました');
    }
  };

  // 会場申請情報を取得するフックを使用
  const { placeOrder, isLoading: placeOrderLoading } =
    useGetPlaceOrder(currentGroupId);

  // 初期データの設定
  useEffect(() => {
    // データのロード中は何もしない
    if (
      itemsLoading ||
      rentalOrdersLoading ||
      placeOrderLoading ||
      rentableItemsLoading
    ) {
      return;
    }

    // 既に初期化済み、またはユーザーが手動で変更した場合は実行しない
    if (
      isInitialized.current ||
      userChangedLocationType.current ||
      rentalOrders.length === 0
    ) {
      return;
    }

    try {
      // 既存の物品申請データを取得
      const savedItems = rentalOrders.map((item) => ({
        itemId: item.rentalItemId.toString(),
        count: item.num,
      }));

      // デフォルトは屋内('1')
      let initialLocationType = '1';

      // 1. 会場申請から会場タイプを決定（優先度1）
      if (placeOrder) {
        // first(第一希望)の会場ID
        const firstChoicePlace = placeOrder.first;

        // IDが5以下は屋内と仮定
        if (firstChoicePlace <= 2) {
          initialLocationType = '1'; // 屋内
        } else {
          initialLocationType = '2'; // 屋外
        }
      }
      // 2. 既存の物品申請から会場タイプを決定（優先度2）
      else if (rentalOrders.length > 0 && rentableItemsData?.data) {
        // 貸出物品マスタデータを取得
        const allRentableItems = rentableItemsData.data;

        // 屋内専用と屋外専用の物品カウント
        let insideOnlyCount = 0;
        let outsideOnlyCount = 0;

        // 各申請物品について、それが屋内専用か屋外専用かを判定
        for (const order of rentalOrders) {
          const item = allRentableItems.find(
            (i) => i.id === order.rentalItemId
          );
          if (item) {
            // 屋内専用の物品
            if (
              item.is_inside_shop_rentable &&
              !item.is_outside_shop_rentable
            ) {
              insideOnlyCount += order.num;
            }
            // 屋外専用の物品
            else if (
              !item.is_inside_shop_rentable &&
              item.is_outside_shop_rentable
            ) {
              outsideOnlyCount += order.num;
            }
            // 両方に対応している物品はカウントしない
          }
        }

        // 専用物品の数で判断（同数なら屋内をデフォルトに）
        if (insideOnlyCount > 0 || outsideOnlyCount > 0) {
          initialLocationType = outsideOnlyCount > insideOnlyCount ? '2' : '1';
        }
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
      // エラーが発生した場合は屋内をデフォルトに設定
      setValue('locationType', '1');
      // エラーが発生した場合でも初期化完了をマーク（無限ループ防止）
      isInitialized.current = true;
    }
  }, [
    rentalOrders,
    placeOrder,
    rentableItemsData,
    reset,
    setValue,
    rentalOrdersLoading,
    itemsLoading,
    placeOrderLoading,
    rentableItemsLoading,
  ]);

  // 物品申請を行わないことを明示的に記録するフラグ
  const [hasExplicitlyDeclinedItems, setHasExplicitlyDeclinedItems] =
    useState<boolean>(false);

  // 初期化時にUnRegisteredGroupをチェック
  useEffect(() => {
    const checkUnRegisteredGroupOnInit = async () => {
      try {
        const result = await checkUnRegisteredGroup(currentGroupId, 0);
        if (result.success && result.exists) {
          setHasExplicitlyDeclinedItems(true);
        }
      } catch (error) {
        console.error('UnRegisteredGroupの確認エラー:', error);
      }
    };

    if (!rentalOrdersLoading && rentalOrders.length === 0) {
      checkUnRegisteredGroupOnInit();
    }
  }, [
    rentalOrdersLoading,
    rentalOrders.length,
    checkUnRegisteredGroup,
    currentGroupId,
  ]);

  // 互換性チェックと自動会場タイプ変更のための特別なフラグ
  const [ignoreItemChanges, setIgnoreItemChanges] = useState<boolean>(false);

  // 会場タイプのラジオボタンを更新
  const updateLocationType = (value: string) => {
    const currentLocationType = form.getValues('locationType');

    if (value !== currentLocationType) {
      setIgnoreItemChanges(true);

      userChangedLocationType.current = true;
      autoChangingLocationType.current = false;

      setValue('locationType', value, { shouldValidate: true });

      // 会場変更に伴うフォームのリセット
      setValue('items', [{ itemId: '', count: 1 }], { shouldValidate: true });

      setTimeout(() => {
        setIgnoreItemChanges(false);
        trigger();
      }, 200);
    } else {
      trigger();
    }
  };

  // フォームの項目変更を監視してアイテムの互換性チェックと自動会場タイプ変更
  useEffect(() => {
    // 無視フラグが立っている場合は処理をスキップ
    if (
      !hasItems ||
      itemsLoading ||
      autoChangingLocationType.current ||
      ignoreItemChanges
    )
      return;

    // フォームの現在の値を取得
    const currentItems = form.getValues('items') || [];
    const currentLocationType = form.getValues('locationType');

    if (currentItems.length > 0) {
      // 現在選択されているアイテムが互換性があるかをチェック
      let needOtherLocationType = false;

      currentItems.forEach((item) => {
        if (!item.itemId || item.itemId === '' || item.itemId === '0') return;

        const itemId = parseInt(item.itemId);
        const selectedItem = itemOptions.find((opt) => opt.id === itemId);

        // この会場タイプで選択したアイテムが見つからない場合、互換性なし
        if (!selectedItem || selectedItem.id === 0) {
          needOtherLocationType = true;
        }
      });

      // 互換性のないアイテムがある場合、会場タイプを自動的に変更
      if (needOtherLocationType) {
        const newLocationType = currentLocationType === '1' ? '2' : '1';
        autoChangingLocationType.current = true;

        // 会場タイプを変更
        setValue('locationType', newLocationType);

        // 自動変更時はアラートを表示しない

        // 少し遅延してから自動変更フラグをリセット
        setTimeout(() => {
          autoChangingLocationType.current = false;
        }, 100);
      }
    }
  }, [
    items,
    itemOptions,
    hasItems,
    itemsLoading,
    setValue,
    ignoreItemChanges,
    form,
  ]);

  // 物品を追加
  const addItem = () => {
    append({ itemId: '', count: 1 });
    // 新しいアイテムを追加した後にフォームを再検証
    setTimeout(() => trigger(), 0);
  };

  const registerNoItems = async () => {
    try {
      setSubmitError('');

      // registerUnRegisteredGroupを呼び出し
      const unRegisteredResult = await registerUnRegisteredGroup({
        group_id: currentGroupId,
        order_type: ORDER_TYPES.RENT_ITEMS, // 定数を使用
      });

      // エラーチェック
      if (!unRegisteredResult.success) {
        console.error('登録エラー:', unRegisteredResult.error);
        alert('物品申請の登録に失敗しました');
        return false;
      }

      // 既存の物品申請があれば削除
      if (rentalOrders.length > 0) {
        const result = await deleteRentalOrders(
          rentalOrders.map((item) => item.id)
        );

        if (!result.success) {
          setSubmitError('既存の申請データ削除中にエラーが発生しました');
          alert('既存の物品申請の削除に失敗しました');
          return false;
        }
      }

      // 状態を更新
      setValue('hasItems', false);
      setIsEditMode(false);
      setHasExplicitlyDeclinedItems(true);

      // API更新の通知
      await mutateRentalOrders();
      return true;
    } catch (error) {
      console.error('予期せぬエラー:', error);
      const errorMessage =
        error instanceof Error ? error.message : '不明なエラー';
      setSubmitError('予期せぬエラーが発生しました: ' + errorMessage);
      alert('予期せぬエラーが発生しました');
      return false;
    }
  };

  // フォーム送信ハンドラー
  const onSubmit: SubmitHandler<RentItemsFormData> = async (data) => {
    try {
      setSubmitError('');

      // hasItemsフラグをチェック
      if (!data.hasItems) {
        return registerNoItems();
      }

      // 以下、「はい」を選択した場合の処理
      // 物品申請を行うフラグをリセット
      setHasExplicitlyDeclinedItems(false);

      // 新しい物品データを作成
      const newItemsData = data.items!.map((item) => ({
        group_id: currentGroupId,
        rental_item_id: parseInt(item.itemId, 10),
        num: item.count,
      }));

      // データを送信
      const result = await submitRentalOrders(newItemsData, rentalOrders);

      if (result.success) {
        // 既存のUnRegisteredGroupを削除（申請する場合）
        await deleteUnRegisteredGroup(currentGroupId, ORDER_TYPES.RENT_ITEMS);
        alert(
          rentalOrders.length > 0
            ? '物品申請を更新しました'
            : '物品申請を登録しました'
        );

        await mutateRentalOrders();
        setIsEditMode(false);
        userChangedLocationType.current = false;
      } else {
        setSubmitError(
          '送信中にエラーが発生しました。もう一度お試しください。'
        );
        alert('物品申請の送信に失敗しました');
      }
    } catch (error) {
      console.error('物品申請エラー:', error);
      setSubmitError('予期せぬエラーが発生しました。もう一度お試しください。');
      alert('予期せぬエラーが発生しました');
    }
  };

  const isLoading =
    itemsLoading ||
    rentalOrdersLoading ||
    placeOrderLoading ||
    rentableItemsLoading;
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
    onSubmit,
    registerNoItems,
    isLoading,
    hasError,
    errors,
    submitError,
    isValid,
    hasExisting,
    openEditMode,
    isEditMode,
    hasExplicitlyDeclinedItems,
    resetFormToDefault,
  };
};
