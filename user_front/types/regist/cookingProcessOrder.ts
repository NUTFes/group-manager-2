export interface CookingProcessOrder {
    id: number;
    group_id: number;
    pre_open_kitchen: boolean;
    during_open_kitchen: boolean;
    tent: Text;
    created_at: string;
    updated_at: string;
}