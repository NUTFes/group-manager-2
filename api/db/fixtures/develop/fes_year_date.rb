FesYear.seed( :id,
    { id: 1, year_num: 2020 },
    { id: 2, year_num: 2021 },
    { id: 3, year_num: 2022 },
    { id: 4, year_num: 2023 },
    { id: 5, year_num: 2024 },
)

FesDate.seed( :id,
    { id: 1, days_num: 0, date: '9/18', day: 'fri', fes_year_id: 1 },
    { id: 2, days_num: 1, date: '9/19', day: 'sat', fes_year_id: 1 },
    { id: 3, days_num: 2, date: '9/20', day: 'sun', fes_year_id: 1 }, 
    { id: 4, days_num: 0, date: '9/17', day: 'fri', fes_year_id: 2 },
    { id: 5, days_num: 1, date: '9/18', day: 'sat', fes_year_id: 2 },
    { id: 6, days_num: 2, date: '9/19', day: 'sun', fes_year_id: 2 },
)

