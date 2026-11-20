# 調理工程申請 機能改修計画

## 概要

調理工程申請機能を、事前に登録された「販売品」の数だけフォームを表示するように改修する。

## 計画

1.  **データ取得ロジックの変更 (`hooks.ts`)**
    *   `useCookingProcessOrder` フックを修正する。
    *   `useGetFoodProducts` を使って、指定された `groupId` に紐づく販売品(`FoodProduct`)のリストを取得する。
    *   `useGetCookingProcessOrder` を使って、調理工程申請のリストを取得する。
    *   取得した販売品リストと調理工程申請リストをマージし、各販売品に対応する調理工程申請データ（未申請の場合は空のデータ）を持つオブジェクトの配列を生成して返す。

2.  **メインコンポーネントの変更 (`CookingProcessOrder.tsx`)**
    *   修正された `useCookingProcessOrder` フックから、販売品と調理工程申請の結合済みリストを受け取る。
    *   `AccordionMenu` の子要素として、リストをループ処理する。
    *   ループ内で、各販売品に対して以下の要素を表示する。
        *   「販売品名」コンポーネント。
        *   `CookingProcessOrderForm` コンポーネント。

3.  **フォームコンポーネントの変更 (`CookingProcessOrderForm.tsx`)**
    *   Propsを変更し、`foodProductId` と `foodProductName` を受け取るようにする。
    *   現在 `Selector` になっている販売品名表示部分を、Propsで受け取った `foodProductName` を表示する固定のUIに変更する。
    *   フォームの `onSubmit` 処理では、`foodProductId` を含めてAPIに送信するように `useCookingProcessOrderForm` フックを修正する。

## Mermaid図

```mermaid
graph TD
    subgraph "hooks.ts"
        A[useGetFoodProducts] --> C{データマージ};
        B[useGetCookingProcessOrder] --> C;
        C --> D[販売品リストと調理工程申請の結合済みリストを返す];
    end

    subgraph "CookingProcessOrder.tsx"
        E[hooks.tsから結合済みリスト取得] --> F{リストをループ};
        F -- 1つずつ --> G[販売品名を表示];
        G --> H[CookingProcessOrderFormを表示];
        H --> F;
    end

    subgraph "CookingProcessOrderForm.tsx"
        I[PropsでfoodProductIdとfoodProductNameを受け取る] --> J[販売品名を固定表示];
        J --> K[調理工程フォーム];
        K --> L[登録処理 (foodProductIdを付与)];
    end

    D --> E;