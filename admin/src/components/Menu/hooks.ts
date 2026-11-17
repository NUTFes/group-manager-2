type MenuItem = {
  title: string;
  icon: string;
  click: string;
  isShow?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

export const useMenuHooks = () => {
  const menuSections: MenuSection[] = [
    {
      title: '基本操作',
      items: [
        { title: 'ダッシュボード', icon: 'dashboard', click: '/dashboard' },
        {
          title: '物品割り当て',
          icon: 'assignment_return',
          click: '/assign_items',
        },
        {
          title: '物品申請数調整',
          icon: 'stadium',
          click: '/adjustment_order_items',
        },
        {
          title: '物品貸出 時間・人数調整',
          icon: 'assignment_return',
          click: '/adjustment_rental_time',
        },
        {
          title: '物品移動計画',
          icon: 'swap_horiz',
          click: '/assign_item_movements',
        },
        {
          title: '識別番号',
          icon: 'format_list_numbered',
          click: '/group_identify',
        },
        {
          title: '会場割り当て',
          icon: 'event_seat',
          click: '/assign_places',
        },
        {
          title: 'ステージ割り当て',
          icon: 'stadium',
          click: '/assign_stages',
        },
        { title: 'お知らせ作成', icon: 'newspaper', click: '/news' },
        { title: '書類印刷', icon: 'print', click: '/print' },
        {
          title: 'ユーザー画面制御',
          icon: 'supervisor_account',
          click: '/user_page_setting',
        },
      ],
    },
    {
      title: '申請情報',
      items: [
        {
          title: '申請状況一覧',
          icon: 'task',
          click: '/order_status_check',
        },
        { title: '参加団体申請', icon: 'groups', click: '/groups' },
        {
          title: '代表・副代表申請',
          icon: 'directions_walk',
          click: '/representatives',
        },
        {
          title: '会場申請',
          icon: 'person_pin_circle',
          click: '/place_orders',
        },
        { title: '電力申請', icon: 'power', click: '/power_orders' },
        { title: '物品申請', icon: 'event_seat', click: '/rental_orders' },
        {
          title: 'ステージ申請',
          icon: 'keyboard_voice',
          click: '/stage_orders',
        },
        {
          title: 'ステージオプション申請',
          icon: 'dynamic_feed',
          click: '/stage_common_options',
        },
        { title: '従業員申請', icon: 'directions_run', click: '/employees' },
        {
          title: '販売品申請',
          icon: 'fastfood',
          click: '/food_products',
        },
        {
          title: '購入品申請',
          icon: 'shopping_cart',
          click: '/purchase_lists',
        },
        {
          title: '参加団体PR申請',
          icon: 'badge',
          click: '/public_relations',
        },
        {
          title: '会場アナウンス文申請',
          icon: 'campaign',
          click: '/announcement',
        },
        {
          title: '模擬店平面図申請',
          icon: 'map',
          click: '/venue_maps',
        },
        {
          title: '調理工程申請',
          icon: 'restaurant',
          click: '/cooking_process_order',
        },
      ],
    },
    {
      title: '一覧情報',
      items: [
        {
          title: 'ユーザー一覧',
          icon: 'people',
          click: '/users',
        },
        { title: '会場一覧', icon: 'place', click: '/places' },
        { title: '物品一覧', icon: 'chair', click: '/rental_items' },
        {
          title: 'ステージ一覧',
          icon: 'festival',
          click: '/stages',
          isShow: true,
        },
        { title: '店一覧', icon: 'storefront', click: '/shops' },
        {
          title: '開催年',
          icon: 'calendar_today',
          click: '/fes_years',
          isShow: true,
        },
        { title: '開催日', icon: 'date_range', click: '/fes_dates' },
      ],
    },
  ];

  return {
    menuSections,
  };
};
