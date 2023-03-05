export interface Group {
  status: Status
  data: Data
}

interface Status {
  code: number
  message: string
}

interface Data {
  activity: string
  committee: string
  created_at: string
  fes_year_id: number
  group_category_id: number
  id: number
  name: string
  project_name: string
  updated_at: string
  user_id: number
}
