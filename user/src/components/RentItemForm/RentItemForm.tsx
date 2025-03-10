import React, { useState, useEffect } from 'react';
import Radio from '../Form/Radio/Radio';
import Selector from '../Form/Selector/Selector';
import TextArea from '../Form/TextArea/TextArea';
import Button from '../Button/Button';
import FormContainer from '../FormContainer/FormContainer';
import Status from '../Status/Status';

// Define the type for a single item application
type ItemApplication = {
    id: string;
    itemName: string;
    quantity: string;
    note: string;
};

// Type for item options
type ItemOption = {
    id: string;
    name: string;
};

// API configuration
const config = {
    APIURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
};

const RentItemForm: React.FC = () => {
    // State for tracking if the application will proceed
    const [willProceed, setWillProceed] = useState('はい');

    // State for all item applications
    const [applications, setApplications] = useState<ItemApplication[]>([
        {
            id: Date.now().toString(),
            itemName: '',
            quantity: '',
            note: '',
        },
    ]);

    // State for submission status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    // State for group ID
    const [groupId, setGroupId] = useState<string>('1');

    // State for item options
    const [itemOptions, setItemOptions] = useState<ItemOption[]>([
        { id: '', name: '選んでください' }
    ]);

    // Load group ID and fetch items when component mounts
    useEffect(() => {
        // Get group ID from localStorage or your auth context
        const storedGroupId = localStorage.getItem('groupId');
        if (storedGroupId) {
            setGroupId(storedGroupId);
        }

        // Fetch available items
        const fetchItems = async () => {
            try {
                const response = await fetch(`${config.APIURL}/api/v1/get_outside_shop_rentable_items`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('API response data:', data); // Log the response structure

                    // Handle different data structures
                    let itemsArray = [];

                    if (Array.isArray(data)) {
                        // If data is already an array
                        itemsArray = data;
                    } else if (data && typeof data === 'object') {
                        // If data is an object (possibly with a data/items property)
                        if (Array.isArray(data.data)) {
                            itemsArray = data.data;
                        } else if (Array.isArray(data.items)) {
                            itemsArray = data.items;
                        } else {
                            // Try to convert object to array if it has numeric keys
                            const possibleArray = Object.entries(data)
                                .filter(([key]) => !isNaN(Number(key)))
                                .map(([_, value]) => value);

                            if (possibleArray.length > 0) {
                                itemsArray = possibleArray;
                            } else {
                                console.error('Unable to extract array from API response:', data);
                                itemsArray = [];
                            }
                        }
                    }

                    // Add empty option at the beginning
                    setItemOptions([
                        { id: '', name: '選んでください' },
                        ...itemsArray.map((item: any) => ({
                            id: item.id?.toString() || '',
                            name: item.name || 'Unknown Item'
                        }))
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        };

        fetchItems();
    }, []);

    // Default options for quantity
    const quantityOptions = [
        { id: '', name: '選んでください' },
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
        { id: '4', name: '4' },
        { id: '5', name: '5' },
        { id: '10', name: '10' },
        { id: '15', name: '15' },
        { id: '20', name: '20' },
    ];

    // Proceed options for radio buttons
    const proceedOptions = [
        { id: 'はい', name: 'はい' },
        { id: 'いいえ', name: 'いいえ' },
    ];

    // Handle change for item name
    const handleItemNameChange = (id: string, value: string) => {
        setApplications(
            applications.map((app) =>
                app.id === id ? { ...app, itemName: value } : app
            )
        );
    };

    // Handle change for quantity
    const handleQuantityChange = (id: string, value: string) => {
        setApplications(
            applications.map((app) =>
                app.id === id ? { ...app, quantity: value } : app
            )
        );
    };

    // Handle change for note
    const handleNoteChange = (id: string, value: string) => {
        setApplications(
            applications.map((app) =>
                app.id === id ? { ...app, note: value } : app
            )
        );
    };

    // Add a new item application
    const handleAddItem = () => {
        setApplications([
            ...applications,
            {
                id: Date.now().toString(),
                itemName: '',
                quantity: '',
                note: '',
            },
        ]);
    };

    // Remove an item application
    const handleRemoveItem = (id: string) => {
        if (applications.length > 1) {
            setApplications(applications.filter((app) => app.id !== id));
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (willProceed === 'いいえ') {
            alert('申請をキャンセルしました');
            return;
        }

        // Validate form fields
        const validApplications = applications.filter(
            (app) => app.itemName && app.quantity
        );

        if (validApplications.length === 0) {
            alert('すべての必須項目を入力してください');
            return;
        }

        if (!groupId) {
            alert('グループIDが設定されていません');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitResult(null);

            // Submit each application individually
            for (let i = 0; i < validApplications.length; i++) {
                const app = validApplications[i];

                // Prepare parameters - without remarks/notes
                const params = new URLSearchParams({
                    group_id: groupId,
                    num: parseInt(app.quantity, 10).toString(),
                    rental_item_id: app.itemName
                });

                await fetch(`${config.APIURL}/rental_orders?${params.toString()}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            }

            setSubmitResult({
                success: true,
                message: '申請が正常に保存されました！',
            });

            // Reset form after successful submission
            setApplications([
                {
                    id: Date.now().toString(),
                    itemName: '',
                    quantity: '',
                    note: '',
                },
            ]);

        } catch (error) {
            console.error('Form submission error:', error);

            setSubmitResult({
                success: false,
                message: error instanceof Error
                    ? `申請の送信に失敗しました: ${error.message}`
                    : '申請の送信に失敗しました',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
            <div className="container mx-auto py-8 bg-white">
                <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 text-black">
                    <div className="flex items-center mb-4">
                        <div className="text-xl font-bold mr-2">物品申請</div>
                        <Status statusType="reception" status="open" />
                    </div>

                    {submitResult && (
                        <div
                            className={`mb-6 p-4 rounded ${
                                submitResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {submitResult.message}
                        </div>
                    )}

                    <div className="mb-6 w-full">
                            <div className="w-full">
                                <p className="mb-2 text-black">会場申請を先に申請してください。</p>

                                <Radio
                                    label="物品申請を行いますか？"
                                    value={willProceed}
                                    onChange={setWillProceed}
                                    required={true}
                                    options={proceedOptions}
                                />
                            </div>
                    </div>

                    {willProceed === 'はい' && (
                        <>
                            {applications.map((application) => (
                                <div
                                    key={application.id}
                                    className="mb-6 w-full"
                                >
                                    <FormContainer>
                                        <div className="w-full">
                                            <div className="mb-4 w-full">
                                                <Selector
                                                    label="物品名"
                                                    value={application.itemName}
                                                    onChange={(value) => handleItemNameChange(application.id, value)}
                                                    required={true}
                                                    options={itemOptions.length > 0 ? itemOptions : [{ id: '', name: '選んでください' }]}
                                                />
                                            </div>

                                            <div className="mb-4 w-full">
                                                <Selector
                                                    label="個数"
                                                    value={application.quantity}
                                                    onChange={(value) => handleQuantityChange(application.id, value)}
                                                    required={true}
                                                    options={quantityOptions}
                                                    note="大きな数で(20個以上)使用する場合はメールを送ってください 23.r.tagawa.nutfes@gmail.com"
                                                />
                                            </div>

                                            <div className="mb-4 w-full">
                                                <TextArea
                                                    label="備考"
                                                    value={application.note}
                                                    onChange={(value) => handleNoteChange(application.id, value)}
                                                />
                                            </div>

                                            {applications.length > 1 && (
                                                <div className="flex justify-end w-full">
                                                    <button
                                                        onClick={() => handleRemoveItem(application.id)}
                                                        className="flex items-center justify-center w-32 h-12 border-2 border-alert text-alert rounded-[10px] hover:bg-red-50"
                                                    >
                                                        <span className="mr-2">×</span>
                                                        削除
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </FormContainer>
                                </div>
                            ))}

                            <div className="mt-6 flex sm:flex-row justify-between w-full gap-x-10">
                                <button
                                    onClick={handleAddItem}
                                    className="flex items-center py-7 justify-center w-1/3 sm:w-48 h-12 border-2 border-main text-main rounded-[10px] hover:bg-green-50"
                                >
                                    <span className="mr-2">+</span>
                                    物品の追加
                                </button>

                                <Button
                                    size="pc"
                                    color="main"
                                    isDisable={isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    登録
                                </Button>
                            </div>
                        </>
                    )}

                    {isSubmitting && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl">
                                <p className="text-lg mb-4">申請を送信中...</p>
                                <div className="w-12 h-12 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    );
};

export default RentItemForm;