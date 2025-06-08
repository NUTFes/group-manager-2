import { z } from 'zod';

export const employeeFormItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, '従業員名は必須です'),
  studentId: z.string().regex(/^\d{8}$/, '8桁の学籍番号を入力してください'),
});

export const employeesFormSchema = z.object({
  needApplication: z.enum(['yes', 'no']).optional(),
  employees: z.array(employeeFormItemSchema).optional(),
});

export type EmployeeFormItem = z.infer<typeof employeeFormItemSchema>;
export type EmployeesForm = z.infer<typeof employeesFormSchema>;
