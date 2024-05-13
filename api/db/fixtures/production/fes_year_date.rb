FesYear.seed( :id,
    { id: 1, year_num: 2024 },
)

FesDate.seed( :id,
    { id: 1, days_num: 1, date: '9月14日', day: '土曜日', fes_year_id: 1 },
    { id: 2, days_num: 2, date: '9月15日', day: '日曜日', fes_year_id: 1 },
)

