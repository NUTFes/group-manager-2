export interface User {
  status: Status;
  data: Data;
}

interface Status {
  code: number;
  message: string;
}

interface Data {
  allowPasswordChange: boolean;
  createdAt: string;
  email: string;
  id: number;
  name: string;
  provider: string;
  roleId: number;
  uid: string;
  updatedAt: string;
}

export interface RegisterParams {
  name: string;
  studentId: string;
  tel: string;
  mail: string;
  departmentId: number;
  gradeId: number;
  password: string;
  passwordConfirm: string;
  userId: number;
}
