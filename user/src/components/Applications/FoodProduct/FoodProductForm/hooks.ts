import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
    FoodProductFormData,
    foodProductSchema,
    RegisteredProduct,
    ProductInput
} from './schema';

export const useFoodProductFormHooks = (
    groupId: number,
    foodProductsProp?: RegisteredProduct[] | null,
    addFoodProducts?: (products: ProductInput[]) => void,
    setFoodProductsData?: (products: ProductInput[]) => void
) => {
    const getDefaultProducts = useCallback(() => {
        if (foodProductsProp && foodProductsProp.length > 0) {
            return foodProductsProp.map((product) => ({
                id: product.id || '',
                name: product.name || '',
                isAlcohol: product.isAlcohol || false,
                hasLicense: product.hasLicense || false,
                day1Quantity: product.day1Quantity?.toString() || '',
                day2Quantity: product.day2Quantity?.toString() || '',
            }));
        }
        return [
            {
                id: '',
                name: '',
                isAlcohol: false,
                hasLicense: false,
                day1Quantity: '',
                day2Quantity: '',
            },
        ];
    }, [foodProductsProp]);

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        control,
    } = useForm<FoodProductFormData>({
        mode: 'onSubmit',
        resolver: zodResolver(foodProductSchema),
        defaultValues: {
            products: getDefaultProducts(),
        },
    });

    const { append, remove, replace } = useFieldArray({
        control,
        name: 'products',
    });

    const values = watch();
    const products = values.products || [];

    useEffect(() => {
        const defaultProducts = getDefaultProducts();
        replace(defaultProducts);
    }, [getDefaultProducts, replace]);

    const alcoholOptions = [
        { id: 1, name: 'はい' },
        { id: 0, name: 'いいえ' },
    ];

    const licenseOptions = [
        { id: 1, name: '有り　（例：酒類、加熱調理をするものなど）' },
        { id: 0, name: '無し　（例：ソフトドリンク）' },
    ];

    const handleAlcoholChange = (index: number, value: string) => {
        const isAlcohol = parseInt(value) === 1;
        setValue(`products.${index}.isAlcohol`, isAlcohol);

        if (isAlcohol) {
            setValue(`products.${index}.hasLicense`, true);
        }
    };

    const handleHasLicenseChange = (index: number, value: string) => {
        setValue(`products.${index}.hasLicense`, parseInt(value) === 1);
    };

    const addProduct = () => {
        append({
            id: '',
            name: '',
            isAlcohol: false,
            hasLicense: false,
            day1Quantity: '',
            day2Quantity: '',
        });
    };

    const removeProduct = (index: number) => {
        if (products.length > 1) {
            remove(index);
        }
    };

    const onSubmit = async (formData: FoodProductFormData) => {
        try {
            // ローディング開始のトースト
            const loadingToastId = toast.loading('処理中...');

            // 実際のAPI呼び出し（現在はモック）
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (foodProductsProp && foodProductsProp.length > 0) {
                // 更新モード
                const productsWithId = formData.products.map((product, index) => ({
                    ...product,
                    id: product.id || `product_${Date.now()}_${index}`,
                }));

                if (setFoodProductsData) {
                    setFoodProductsData(productsWithId);
                }

                // 成功トースト
                toast.update(loadingToastId, {
                    render: '販売品を更新しました',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
            } else {
                // 新規登録モード
                if (addFoodProducts) {
                    const productsWithId = formData.products.map((product, index) => ({
                        ...product,
                        id: `product_${Date.now()}_${index}`,
                    }));
                    addFoodProducts(productsWithId);
                }

                // 成功トースト
                toast.update(loadingToastId, {
                    render: '販売品申請を送信しました',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
            }

            return true;
        } catch (error) {
            // エラートースト
            toast.error('送信に失敗しました。もう一度お試しください。', {
                autoClose: 5000,
            });
            console.error('送信エラー:', error);
            return false;
        }
    };

    return {
        handleSubmit,
        errors,
        setValue,
        isFetching: false,
        isMutating: false,
        handleAlcoholChange,
        handleHasLicenseChange,
        alcoholOptions,
        licenseOptions,
        onSubmit,
        addProduct,
        removeProduct,
        products,
    };
};