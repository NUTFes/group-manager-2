export interface GroupCategory {
    status: string
    data: Data[]
}

interface Data {
    id: number
    name: string
    created_at: string
    updated_at: string
}