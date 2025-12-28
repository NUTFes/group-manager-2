# frozen_string_literal: true

FesYear.seed(:id,
             { id: 1, year_num: 2025 })

FesDate.seed(:id,
             { id: 1, days_num: 1, date: '9月13日', day: '土曜日', fes_year_id: 1 },
             { id: 2, days_num: 2, date: '9月14日', day: '日曜日', fes_year_id: 1 })
