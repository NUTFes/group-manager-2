import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import RentItemForm from './RentItemForm';
import '../../styles/globals.css';

// Prepare for Storybook environment
if (typeof window !== 'undefined') {
    // Mock fetch for Storybook
    window.fetch = function mockFetch(url: RequestInfo | URL, options?: RequestInit): Promise<Response> {
        console.log('Storybook mock fetch:', { url, options });

        // Create a proper Response object with explicit typing
        const createResponse = (data: unknown): Response => {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        };

        // If fetching items
        if (url.toString().includes('/api/v1/get_outside_shop_rentable_items')) {
            const mockData = [
                { id: '1', name: 'テント' },
                { id: '2', name: 'テーブル' },
                { id: '3', name: 'いす' },
                { id: '4', name: 'ホワイトボード' },
                { id: '5', name: 'マイク' },
                { id: '6', name: 'スピーカー' },
            ];
            return Promise.resolve(createResponse(mockData));
        }

        // For form submission
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(createResponse({ success: true }));
            }, 1000);
        });
    };

    // Mock localStorage
    if (!window.localStorage.getItem('groupId')) {
        // Only set this if it doesn't exist already
        window.localStorage.setItem('groupId', '1');
    }
}

export default {
    title: 'Forms/RentItemForm',
    component: RentItemForm,
    parameters: {
        docs: {
            description: {
                component: '物品申請フォームコンポーネント。複数の物品を一度に申請することができます。',
            },
            source: {
                type: 'auto',
            },
        },
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div className="bg-gray-100 p-4 min-h-screen">
                <Story />
            </div>
        ),
    ],
} as Meta<typeof RentItemForm>;

// Create a template for your stories
type Story = StoryObj<typeof RentItemForm>;

// Default story
export const Default: Story = {};
