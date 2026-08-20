// src/components/Applications/MultiItemForms/RentItems/hooks/useRentItemsFormHooks.ts
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  HealthCenterSubmissionStatus,
  useUpdateSubmissionStatusFor,
} from '@/api/healthCenterSubmissionStatusApi';
import {
  ORDER_TYPES,
  useAllRentableItems,
  useCheckUnRegisteredGroup,
  useMutateRentalOrders,
  useRegisterUnRegisteredGroup,
  useRentableItemsByType,
  useRentalOrdersByGroupId,
} from '@/api/rentItemsApi';
import { useGetPlaceOrder } from '@/api/venueApplication';
import { GROUP_CATEGORY } from '@/utils/constants';
import { useTranslation } from 'next-i18next';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuthenticatedGet } from '@/hooks/useApi';
import {
  ITEM_IDS,
  LOCATION_TYPES,
  RentItemsFormData,
  rentItemsFormResolver,
} from '../RentItemsForm/schema';

// Constants for venue place choice
const VENUE_PLACE = {
  MAX_INDOOR_ID: 2, // Place IDs <= 2 are indoor venues
};

// ステージ用の物品IDリスト
const STAGE_ITEM_IDS = [1, 2, 3];

// 屋外団体向けの物品IDリスト（ステージ団体以外、食品販売向け）
const OUTDOOR_ITEM_IDS = [
  Number(ITEM_IDS.TABLE), // 机
  Number(ITEM_IDS.CHAIR), // 椅子
  Number(ITEM_IDS.LONG_TABLE), // 長机
  Number(ITEM_IDS.PARTITION), // パーテーション
  Number(ITEM_IDS.DISPLAY_BOARD), // 掲示板
  Number(ITEM_IDS.TENT), // テント
  5, // パーテーション足（IDを実際の値に変更する必要あり）
];

// 特別な個数制限を持つアイテムID
const SPECIAL_COUNT_ITEM_IDS = [
  Number(ITEM_IDS.TABLE), // 机
  Number(ITEM_IDS.CHAIR), // 椅子
];

// 1個までに制限する物品ID
const SINGLE_ITEM_IDS = [
  Number(ITEM_IDS.LONG_TABLE), // 長机
  Number(ITEM_IDS.DISPLAY_BOARD), // 掲示板
  Number(ITEM_IDS.TENT), // テント
  Number(ITEM_IDS.PARTITION), // パーテーション
  5, // パーテーション足
];

// デフォルトの個数制限
const DEFAULT_MAX_COUNT = 20;
// 椅子と机の個数制限 (会場タイプによって異なる)
const TABLE_CHAIR_MAX_COUNT = {
  [LOCATION_TYPES.INDOOR]: 100, // 屋内: 100個
  [LOCATION_TYPES.OUTDOOR]: 20, // 屋外: 20個
};

export const useRentItemsFormHooks = (
  groupId: number,
  status?: HealthCenterSubmissionStatus,
  groupCategoryId?: number // 団体カテゴリID
) => {
  const { t } = useTranslation('common');
  // 認証基盤ができたら、グループIDを取得する
  const currentGroupId = groupId;
  const [submitError, setSubmitError] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // 初期化完了フラグを追加
  const isInitialized = useRef(false);
  // ユーザーが手動で変更したかどうかを追跡
  const userChangedLocationType = useRef(false);
  // 自動的に会場タイプを変更中かどうかを追跡
  const autoChangingLocationType = useRef(false);

  // 食品販売団体かどうかを判定（groupCategoryId === GROUP_CATEGORY.FOOD_SELLING）
  const isFoodSellingGroup = groupCategoryId === GROUP_CATEGORY.FOOD_SALES;

  // フォーム送信ハンドラー（FormEventを処理）
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  // React Hook Form初期化 (Zodスキーマ使用)
  const form = useForm<RentItemsFormData>({
    defaultValues: {
      // 「はい/いいえ」を選ぶ前は未選択のまま(tri-state)にする。
      hasItems: undefined,
      // 食品販売団体は強制的に屋外
      locationType: isFoodSellingGroup
        ? LOCATION_TYPES.OUTDOOR
        : LOCATION_TYPES.INDOOR,
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

  // 物品IDから最大個数を取得する関数
  const getMaxCountByItemId = (itemId: string): number => {
    // 空の値や選択なしの場合はデフォルト値を返す
    if (!itemId || itemId === '' || itemId === '0') {
      return DEFAULT_MAX_COUNT;
    }

    const numItemId = Number(itemId);

    // 1個までに制限する物品の場合
    if (SINGLE_ITEM_IDS.includes(numItemId)) {
      return 1;
    }

    // 椅子または机の場合
    if (SPECIAL_COUNT_ITEM_IDS.includes(numItemId)) {
      // 屋内の場合は100個、それ以外は20個
      return TABLE_CHAIR_MAX_COUNT[locationType] || DEFAULT_MAX_COUNT;
    }

    // その他の物品は20個まで
    return DEFAULT_MAX_COUNT;
  };

  const updateStatus = useUpdateSubmissionStatusFor(groupId, 'equipment');

  // 団体タイプがステージ団体、実行委員会、食品販売かを確認
  const isStageGroup = groupCategoryId === GROUP_CATEGORY.STAGE;
  const isCommitteeGroup = groupCategoryId === GROUP_CATEGORY.COMMITTEE;

  // ステージ団体または実行委員会の場合、全物品を取得
  const {
    items: allItems,
    itemsLoading: allItemsLoading,
    itemsError: allItemsError,
  } = useAllRentableItems();

  // その他の団体は会場タイプに応じた物品を取得
  const {
    items: locationTypeItems,
    itemsLoading: locationTypeItemsLoading,
    itemsError: locationTypeItemsError,
  } = useRentableItemsByType(locationType);

  // 物品データを団体タイプと会場タイプに応じてフィルタリング
  const filteredItems = useMemo(() => {
    if (isCommitteeGroup) {
      // 実行委員会は全物品
      return allItems;
    } else if (isStageGroup) {
      // ステージ団体はステージ用物品のみ
      return allItems.filter(
        (item) =>
          // ステージ用物品のIDリストに含まれるか、isStageRentableフラグがある場合。
          // レスポンスはcamelcase-keysでdeep変換されるため、実際のプロパティは
          // isStageRentable(以前はsnake_caseのis_stage_rentableで読んでおり、
          // 常にundefinedになってフィルタが機能していなかった)。
          STAGE_ITEM_IDS.includes(item.id) || item.isStageRentable
      );
    } else if (isFoodSellingGroup || locationType === LOCATION_TYPES.OUTDOOR) {
      // 食品販売団体または屋外団体は屋外用物品のみ
      return locationTypeItems.filter((item) =>
        // 屋外用物品のIDリストに含まれる場合
        OUTDOOR_ITEM_IDS.includes(item.id)
      );
    } else {
      // その他の団体は会場タイプに応じた物品をそのまま表示
      return locationTypeItems;
    }
  }, [
    allItems,
    locationTypeItems,
    isCommitteeGroup,
    isStageGroup,
    isFoodSellingGroup,
    locationType,
  ]);

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
      { id: 0, name: t('form.validation.select') },
      ...filteredItems.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    ],
    [filteredItems, t]
  );

  // 特殊団体の場合に会場タイプの選択を非表示にするフラグ
  // ステージ団体、実行委員会、または食品販売団体の場合は会場タイプ選択を非表示
  const hideLocationTypeSelect =
    isStageGroup || isCommitteeGroup || isFoodSellingGroup;

  // 会場申請情報を取得するフックを使用
  const { placeOrder, isLoading: placeOrderLoading } =
    useGetPlaceOrder(currentGroupId);

  // ローディング状態の統合
  const isLoading =
    rentalOrdersLoading ||
    placeOrderLoading ||
    (isStageGroup || isCommitteeGroup
      ? allItemsLoading
      : locationTypeItemsLoading);

  // エラー状態の統合
  const hasError = !!(
    rentalOrdersError ||
    (isStageGroup || isCommitteeGroup ? allItemsError : locationTypeItemsError)
  );

  // 全ての貸出物品データを取得（処理に使用）
  const { data: rentableItemsData, isLoading: rentableItemsLoading } =
    useAuthenticatedGet<{
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

  // 初期データの設定
  useEffect(() => {
    // データのロード中は何もしない
    if (isLoading || rentableItemsLoading) {
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

      // デフォルトは屋内('1') - ただし食品販売団体は強制的に屋外('2')
      let initialLocationType = isFoodSellingGroup
        ? LOCATION_TYPES.OUTDOOR
        : LOCATION_TYPES.INDOOR;

      // ステージ団体、実行委員会、食品販売団体でない場合のみ、会場申請から会場タイプを決定
      if (!isStageGroup && !isCommitteeGroup && !isFoodSellingGroup) {
        // 1. 会場申請から会場タイプを決定（優先度1）
        if (placeOrder) {
          // first(第一希望)の会場ID
          const firstChoicePlace = placeOrder.first;

          // IDが定数以下は屋内と仮定
          if (firstChoicePlace <= VENUE_PLACE.MAX_INDOOR_ID) {
            initialLocationType = LOCATION_TYPES.INDOOR; // 屋内
          } else {
            initialLocationType = LOCATION_TYPES.OUTDOOR; // 屋外
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
            initialLocationType =
              outsideOnlyCount > insideOnlyCount
                ? LOCATION_TYPES.OUTDOOR
                : LOCATION_TYPES.INDOOR;
          }
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
      // エラーが発生した場合は屋内をデフォルトに設定（食品販売は屋外）
      setValue(
        'locationType',
        isFoodSellingGroup ? LOCATION_TYPES.OUTDOOR : LOCATION_TYPES.INDOOR
      );
      // エラーが発生した場合でも初期化完了をマーク（無限ループ防止）
      isInitialized.current = true;
    }
  }, [
    rentalOrders,
    placeOrder,
    rentableItemsData,
    reset,
    setValue,
    isLoading,
    rentableItemsLoading,
    isStageGroup,
    isCommitteeGroup,
    isFoodSellingGroup,
  ]);

  // 物品申請を行わないことを明示的に記録するフラグ
  // null = 確認中, false = 申請しない記録なし, true = 申請しない記録あり
  const [hasExplicitlyDeclinedItems, setHasExplicitlyDeclinedItems] = useState<
    boolean | null
  >(null);

  // 初期化時にUnRegisteredGroupをチェック
  useEffect(() => {
    const checkUnRegisteredGroupOnInit = async () => {
      try {
        const result = await checkUnRegisteredGroup(currentGroupId, 0);
        if (result.success && result.exists) {
          setHasExplicitlyDeclinedItems(true);
        } else {
          setHasExplicitlyDeclinedItems(false);
        }
      } catch (error) {
        console.error('UnRegisteredGroupの確認エラー:', error);
        setHasExplicitlyDeclinedItems(false);
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

  // UnRegisteredGroup確認が完了するまで締切分岐を保留するためのフラグ
  const isDeclinedStateLoading =
    hasExplicitlyDeclinedItems === null && rentalOrders.length === 0;

  // 互換性チェックと自動会場タイプ変更のための特別なフラグ
  const [ignoreItemChanges, setIgnoreItemChanges] = useState<boolean>(false);

  // 会場タイプのラジオボタンを更新
  const updateLocationType = (value: string) => {
    // ステージ団体、実行委員会、食品販売団体の場合は会場タイプを変更しない
    if (isStageGroup || isCommitteeGroup || isFoodSellingGroup) return;

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
    // 特殊団体の場合はこの処理をスキップ
    if (isStageGroup || isCommitteeGroup || isFoodSellingGroup) return;

    // 無視フラグが立っている場合は処理をスキップ
    if (
      !hasItems ||
      locationTypeItemsLoading ||
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
        const newLocationType =
          currentLocationType === LOCATION_TYPES.INDOOR
            ? LOCATION_TYPES.OUTDOOR
            : LOCATION_TYPES.INDOOR;
        autoChangingLocationType.current = true;

        // 会場タイプを変更
        setValue('locationType', newLocationType);

        // 少し遅延してから自動変更フラグをリセット
        setTimeout(() => {
          autoChangingLocationType.current = false;
        }, 100);
      }
    }
  }, [
    itemOptions,
    hasItems,
    locationTypeItemsLoading,
    setValue,
    ignoreItemChanges,
    form,
    isStageGroup,
    isCommitteeGroup,
    isFoodSellingGroup,
  ]);

  // 編集モード変更時に再レンダリングを強制するuseEffectをここに移動
  useEffect(() => {
    if (isEditMode) {
      setTimeout(() => {
        trigger(); // フォームのバリデーションを更新するため強制実行
      }, 100);
    }
  }, [isEditMode, trigger]);

  // 物品を追加
  const addItem = () => {
    append({ itemId: '', count: 1 });
    // 新しいアイテムを追加した後にフォームを再検証
    setTimeout(() => trigger(), 0);
  };

  const updateStatusToUnapproved = async (): Promise<boolean> => {
    if (status === 'unapproved') return true;
    try {
      await updateStatus('unapproved');
      return true;
    } catch (e) {
      console.error(e);
      toast.error(t('applications.rentItems.messages.statusUpdateFailed'));
      return false;
    }
  };

  // 物品申請を行わない場合の登録処理
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
        // トースト通知でエラーを表示
        toast.error(t('applications.rentItems.messages.registerNoItemsFailed'));
        return false;
      }

      // 既存の物品申請があれば削除
      if (rentalOrders.length > 0) {
        const result = await deleteRentalOrders(
          rentalOrders.map((item) => item.id)
        );

        if (!result.success) {
          setSubmitError(
            t('applications.rentItems.messages.deleteExistingError')
          );
          // トースト通知でエラーを表示
          toast.error(
            t('applications.rentItems.messages.deleteExistingFailed')
          );
          return false;
        }
      }

      // 状態を更新
      setValue('hasItems', false);
      setHasExplicitlyDeclinedItems(true);

      // API更新の通知
      await mutateRentalOrders();
      const statusUpdated = await updateStatusToUnapproved();
      if (!statusUpdated) return false;
      setIsEditMode(false);
      // 成功時のトースト通知
      toast.success(
        t('applications.rentItems.messages.registerNoItemsSuccess')
      );
      return true;
    } catch (error) {
      console.error('予期せぬエラー:', error);
      const errorMessage =
        error instanceof Error ? error.message : '不明なエラー';
      setSubmitError(
        t('applications.rentItems.messages.unexpectedErrorWithDetail', {
          message: errorMessage,
        })
      );
      // トースト通知でエラーを表示
      toast.error(t('applications.rentItems.messages.unexpectedError'));
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

        // アラートの代わりにトースト通知を使用
        toast.success(
          rentalOrders.length > 0
            ? t('applications.rentItems.messages.updateSuccess')
            : t('applications.rentItems.messages.createSuccess')
        );

        await mutateRentalOrders();
        const statusUpdated = await updateStatusToUnapproved();
        if (!statusUpdated) return;
        setIsEditMode(false);
        userChangedLocationType.current = false;
      } else {
        setSubmitError(t('applications.rentItems.messages.submitError'));
        // トースト通知でエラーを表示
        toast.error(t('applications.rentItems.messages.submitFailed'));
      }
    } catch (error) {
      console.error('物品申請エラー:', error);
      setSubmitError(t('applications.rentItems.messages.unexpectedRetry'));
      // トースト通知でエラーを表示
      toast.error(t('applications.rentItems.messages.unexpectedError'));
    }
  };

  // フォームをリセットする関数 - 会場タイプを適切に設定
  const resetFormToDefault = () => {
    userChangedLocationType.current = false;
    reset({
      hasItems: false,
      // 食品販売団体は強制的に屋外
      locationType: isFoodSellingGroup
        ? LOCATION_TYPES.OUTDOOR
        : LOCATION_TYPES.INDOOR,
      items: [{ itemId: '', count: 1 }],
    });
  };

  // 編集モードを開始する関数
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
                // 食品販売団体は強制的に屋外
                locationType: isFoodSellingGroup
                  ? LOCATION_TYPES.OUTDOOR
                  : currentValues.locationType,
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
            // 食品販売団体は強制的に屋外
            locationType: isFoodSellingGroup
              ? LOCATION_TYPES.OUTDOOR
              : LOCATION_TYPES.INDOOR,
            items: [{ itemId: '', count: 1 }],
          });
        }
      } else {
        // ユーザーが物品を希望しない場合はhasItemsをfalseに設定
        reset({
          ...form.getValues(),
          hasItems: false,
          // 食品販売団体は強制的に屋外
          locationType: isFoodSellingGroup
            ? LOCATION_TYPES.OUTDOOR
            : form.getValues().locationType,
        });
      }

      // フォームリセット後に検証を強制実行
      setTimeout(() => trigger(), 100);
    } catch (error) {
      console.error('編集モード起動エラー:', error);
      setSubmitError(t('applications.rentItems.messages.unexpectedError'));
      // エラー時にトースト通知を表示
      toast.error(t('applications.rentItems.messages.editStartFailed'));
    }
  };

  const rentItemsFormTexts = {
    general: {
      loading: t('applications.rentItems.loading'),
    },
    errors: {
      fetch: {
        title: t('applications.rentItems.errors.fetchTitle'),
        description: t('applications.rentItems.errors.fetchDescription'),
      },
      translate: (key?: string) =>
        key ? t(key, { defaultValue: key }) : undefined,
    },
    summary: {
      noApplication: {
        label: t('applications.rentItems.summary.noApplication.label'),
        description: t(
          'applications.rentItems.summary.noApplication.description'
        ),
      },
      count: (value: number | string) =>
        t('applications.rentItems.summary.count', { value }),
    },
    location: {
      displayLabel: t('applications.rentItems.location.displayLabel'),
      radioQuestion: t('applications.rentItems.location.radioQuestion'),
      notes: {
        foodOnlyOutdoor: t(
          'applications.rentItems.location.notes.foodOnlyOutdoor'
        ),
        preApplication: t(
          'applications.rentItems.location.notes.preApplication'
        ),
      },
      options: {
        indoor: t('applications.rentItems.location.options.indoor'),
        outdoor: t('applications.rentItems.location.options.outdoor'),
      },
    },
    radio: {
      question: t('applications.rentItems.radio.question'),
      options: {
        yes: t('applications.rentItems.radio.options.yes'),
        no: t('applications.rentItems.radio.options.no'),
      },
    },
    fields: {
      sectionTitle: (index: number) =>
        t('applications.rentItems.fields.section', { index }),
      item: t('applications.rentItems.fields.item'),
      count: t('applications.rentItems.fields.count'),
    },
    notes: {
      minRequest: t('applications.rentItems.notes.minRequest'),
      contactLimit: t('applications.rentItems.notes.contactLimit'),
      contactEmail: t('applications.rentItems.notes.contactEmail'),
    },
    buttons: {
      edit: t('form.actions.edit'),
      register: t('form.actions.register'),
      delete: t('form.actions.delete'),
      addItem: t('applications.rentItems.buttons.addItem'),
    },
    deadline: {
      title: t('applications.rentItems.deadline.title'),
      description: t('applications.rentItems.deadline.description'),
    },
  };

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
    isDeclinedStateLoading,
    resetFormToDefault,
    handleFormSubmit,
    hideLocationTypeSelect, // 団体タイプに応じたUI表示制御フラグ
    isFoodSellingGroup, // 食品販売団体かどうかのフラグ
    getMaxCountByItemId, // 物品IDに基づいて最大個数を取得する関数
    rentItemsFormTexts,
    updateStatus,
  };
};
