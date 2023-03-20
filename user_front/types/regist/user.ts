export interface User {
  status: Status
  data: Data
}

interface Status {
  code: number
  message: string
}

interface Data {
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

export default User
