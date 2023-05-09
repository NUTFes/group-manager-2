export interface CurrentUser{
  status: Status
  data: Data
}

interface Data{
  user: User
  user_detail: UserDetail
}

interface Status{
  code: number
  message: string
}

export interface User{
  allow_password_change: boolean
  created_at: string
  email: string
  id: number
  name: string
  provider: string
  role_id: number
  uid: string
  updated_at: string
}

export interface UserDetail{
  department: string
  department_id: number
  grade: string
  grade_id: number
  student_id: number
  tel: string
}

export interface EditUser{
  department: string
  department_id: number
  grade: string
  grade_id: number
  student_id: number
  tel: string
  email: string
  name: string
}
