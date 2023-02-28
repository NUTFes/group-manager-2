interface CurrentUser{
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

interface User{
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

interface UserDetail{
  department: string
  department_id: number
  grade: string
  grade_id: number
  student_id: number
  tel: string
}

export default CurrentUser
