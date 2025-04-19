export interface RegisterParams {
  mail: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  role_id: number;
  user_detail_attributes: {
    student_id: string;
    department_id: number;
    grade_id: number;
  };
}
