interface StageOrder {
  id: number;
  group_id: number;
  is_sunny: boolean;
  fes_date_id: number;
  stage_first: number;
  stage_second: number;
  use_time_interval: string;
  prepare_time_interval: string;
  cleanup_time_interval: string;
  prepare_start_time: string;
  performance_start_time: string;
  performance_end_time: string;
  cleanup_end_time: string;
}

export default StageOrder;
