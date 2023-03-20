export interface Place {
  status: Status
  data: PlaceList[]
}

interface Status {
  code: number
  message: string
}

export interface PlaceList {
  created_at: string
  id: number
  name: string
  updated_at: string
}
