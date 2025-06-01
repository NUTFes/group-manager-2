import { FC } from 'react';

export const PurchaseListsDeadlineView: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
        <div className="mb-4">
          <svg
            className="mx-auto size-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          申請期限が過ぎています
        </h3>
        <p className="text-sm text-gray-600">
          購入品申請の締切期限が過ぎているため、新規申請はできません。
        </p>
      </div>
    </div>
  );
};
