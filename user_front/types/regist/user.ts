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

export interface RegisterParams {
  name: string;
  studentId: string;
  tel: string;
  mail: string;
  departmentId: number | null;
  gradeId: number | null;
  password: string;
  passwordConfirm: string;
  userId: number;
}
