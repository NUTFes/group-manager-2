export interface CookingProcessOrder {
    id: number;
    group_id: number;
    pre_open_kitchen: Text;
    pre_open_tent: Text;
    during_open_kitchen: Text;
    during_open_tent: Text;
    created_at: string;
    updated_at: string;
}