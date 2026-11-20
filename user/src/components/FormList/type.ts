import { ReactNode } from 'react';

export type FormItem = {
  label: string;
  content: ReactNode;
  isEditable?: boolean;
};
