interface Group {
  id: number;
  name: string;
  activity: string;
  committee?: string;
  created_at: string;
  fes_year_id: number;
  group_category_id: number;
  updated_at: string;
  project_name: string;
  user_id: number;
  is_international?: boolean;
  is_external?: boolean;
}

export default Group;
