// src/components/RentItems/RentItemsForm/RentItemsForm.tsx
import { FC, FormEvent, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import FormContainer from '@/components/FormContainer';
import MultiItemFormButton from '../../MultiItemFormButton';
import { useRentItemsFormLogic } from '@/components/Applications/MultiItemForms/RentItems/hooks/useRentItemsFormLogic';
import { showToast } from '@/components/Toast/toastConfig';

const RentItemsForm: FC = () => {
    const {
        form,
        fields,
        control,
        hasItems,
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
    } = useRentItemsFormLogic();

    // 編集モード変更時に再レンダリングを強制
    useEffect(() => {
        if (isEditMode) {
            setTimeout(() => {
                form.trigger(); // フォームのバリデーションを更新するため強制実行
            }, 100);
        }
    }, [isEditMode, form]);

    if (isLoading) {
        return (
            <div className="w-full text-center py-4">
                <p>データを読み込み中です...</p>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">エラー：</strong>
                <span className="block sm:inline">
          データの取得に失敗しました。ページを再読込してください。
        </span>
            </div>
        );
    }

    // 「物品申請を行わない」場合の表示（UnRegisteredGroupが登録されている場合）
    if (!isEditMode && hasExplicitlyDeclinedItems && !hasExisting) {
        return (
            <div className="w-full text-font">
                <div>
                    <p className="text-sm text-alert mb-[4px]">
                        会場申請を先に申請してください。
                    </p>
                    <br />
                    <Controller
                        name="hasItems"
                        control={control}
                        render={({ field }) => (
                            <Radio
                                label="物品申請を行いますか？"
                                value={field.value ? '1' : '0'}
                                onChange={(value: string) => {
                                    field.onChange(value === '1');
                                    openEditMode();
                                }}
                                required
                                options={[
                                    { id: 1, name: 'はい' },
                                    { id: 0, name: 'いいえ' },
                                ]}
                                error={errors.hasItems?.message?.toString()}
                            />
                        )}
                    />
                </div>
                <div className="mt-4 text-center text-red-500 font-medium">
                    物品申請を行わない登録が完了しました
                </div>
            </div>
        );
    }

    // 既存の申請データがあり、編集モードでない場合は申請内容を表示
    if (hasExisting && !isEditMode) {
        return (
            <div className="w-full text-font">
                <div className="mb-4">
                    <p className="font-bold">第一希望：{form.getValues('locationType') === '1' ? '屋内' : '屋外'}</p>
                </div>

                <div className="w-full flex flex-col items-start justify-start gap-10 overflow-hidden rounded-[20px] border border-[#b2b2b2] bg-baseColor p-6 shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] md:p-20">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="w-full mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0"
                        >
                            <div className="flex justify-between items-center w-full">
                                <div className="w-full">
                                    <p className="font-medium text-font">
                                        {itemOptions.find(option => option.id.toString() === form.getValues(`items.${index}.itemId`))?.name || ''}
                                    </p>
                                    <p className="text-font text-sm">{form.getValues(`items.${index}.count`)} 個</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <MultiItemFormButton
                        type="button"
                        size="pc"
                        color="edit"
                        onClick={openEditMode}
                    >
                        <div className="flex items-center">
                            <RiEdit2Line size={18} className="mr-1" /> 修正
                        </div>
                    </MultiItemFormButton>
                </div>
            </div>
        );
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
    };

    // 編集モード、または新規申請の場合はフォームを表示
    return (
        <form
            className="w-full flex flex-col gap-8 text-font"
            onSubmit={handleFormSubmit}
        >
            <div>
                <p className="text-sm text-alert mb-[4px]">
                    会場申請を先に申請してください。
                </p>
                <br />
                <Controller
                    name="hasItems"
                    control={control}
                    render={({ field }) => (
                        <Radio
                            label="物品申請を行いますか？"
                            value={field.value ? '1' : '0'}
                            onChange={(value: string) => {
                                field.onChange(value === '1');
                                form.trigger();
                            }}
                            required
                            options={[
                                { id: 1, name: 'はい' },
                                { id: 0, name: 'いいえ' },
                            ]}
                            error={errors.hasItems?.message?.toString()}
                        />
                    )}
                />
            </div>

            {!hasItems && (
                <>
                    <div className="flex justify-center mt-4">
                        <Button
                            type="button"
                            size="pc"
                            color="main"
                            onClick={async () => {
                                // registerNoItems関数を直接呼び出し
                                const succeeded = await registerNoItems();
                                if (!succeeded) {
                                    // エラー処理
                                }
                            }}
                        >
                            登録
                        </Button>
                    </div>
                </>
            )}

            {hasItems && (
                <>
                    <div>
                        <Controller
                            name="locationType"
                            control={control}
                            render={({ field }) => (
                                <Radio
                                    label="会場申請の第一希望はどちらですか？"
                                    value={field.value}
                                    onChange={(value: string) => {
                                        // 新しい値でupdateLocationTypeを呼び出す
                                        updateLocationType(value);
                                    }}
                                    required
                                    options={[
                                        { id: 1, name: '屋内' },
                                        { id: 2, name: '屋外' },
                                    ]}
                                    error={errors.locationType?.message}
                                />
                            )}
                        />
                    </div>
                    {fields.map((field, index) => (
                        <FormContainer key={field.id}>
                            <div className="mb-4">
                                <h3 className="font-bold text-font mb-4">物品 {index + 1}</h3>
                                <Controller
                                    name={`items.${index}.itemId`}
                                    control={control}
                                    render={({ field }) => {
                                        // 現在選択されている全アイテムを取得
                                        const currentItems = form.getValues('items');

                                        // 既に選択されているアイテムを除外したオプションリストを作成
                                        // 自身の選択は除外しない
                                        const filteredOptions = itemOptions.filter(option => {
                                            const optionId = option.id.toString();
                                            return !currentItems.some(
                                                (item, idx) => idx !== index && item.itemId === optionId
                                            );
                                        });

                                        return (
                                            <Selector
                                                label="物品名"
                                                value={field.value}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    form.trigger(`items.${index}.itemId`);
                                                }}
                                                required
                                                options={filteredOptions}
                                                error={errors.items?.[index]?.itemId?.message?.toString()}
                                            />
                                        );
                                    }}
                                />
                            </div>
                            <div>
                                <Controller
                                    name={`items.${index}.count`}
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <Selector
                                                label="個数"
                                                value={field.value.toString()}
                                                onChange={(value) => {
                                                    const numValue = parseInt(value, 10);

                                                    // setValueを使用してフォーム状態を正しく更新
                                                    form.setValue(`items.${index}.count`, numValue, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                        shouldTouch: true
                                                    });

                                                    // React Hook Form用にfieldのonChangeも呼び出す
                                                    field.onChange(numValue);

                                                    // 再検証を強制実行
                                                    setTimeout(() => form.trigger(`items.${index}.count`), 0);
                                                }}
                                                required
                                                options={Array.from({ length: 20 }, (_, i) => ({
                                                    id: i + 1,
                                                    name: `${i + 1}`,
                                                }))}
                                                error={errors.items?.[index]?.count?.message?.toString()}
                                            />
                                        );
                                    }}
                                />
                                <p className="text-xs text-sub">
                                    ※必要最低限の数だけ申請してください
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-font">
                                    使用する個数が20個以上の場合はメールをお送りください
                                    <br />
                                    nutfes.soumu@gmail.com
                                </p>
                            </div>
                            {fields.length > 1 && (
                                <div className="mt-4 text-right mx-auto">
                                    <MultiItemFormButton
                                        type="button"
                                        size="mobile"
                                        color="delete"
                                        onClick={() => {
                                            remove(index);
                                            showToast.info(`物品 ${index + 1} を削除しました`);
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <RiDeleteBinLine size={18} className="mr-1" />
                                            削除
                                        </div>
                                    </MultiItemFormButton>
                                </div>
                            )}
                        </FormContainer>
                    ))}

                    <div className="flex justify-center mt-4 mb-2 gap-4">
                        <MultiItemFormButton
                            type="button"
                            size="pc"
                            color="add"
                            onClick={() => {
                                addItem();
                                showToast.info('新しい物品を追加しました');
                            }}
                        >
                            <div className="flex items-center">
                                <span className="mr-1 text-lg">+</span> 物品の追加
                            </div>
                        </MultiItemFormButton>
                        <Button type="submit" size="pc" color="main" isDisable={!isValid}>
                            {hasExisting ? '更新' : '登録'}
                        </Button>
                    </div>
                </>
            )}

            {submitError && (
                <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                    {submitError}
                </div>
            )}

            {errors.root?.message && (
                <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                    {errors.root.message.toString()}
                </div>
            )}
        </form>
    );
};

export default RentItemsForm;
