# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Group
Group.create(   name: "nutfes",
                project_name: "nutfes",
                activity: "unei",
                user_id: 1,
                group_category_id: 1,
                fes_year_id: 1 )

# stage_common_option
StageCommonOption.create(   group_id: 1,
                            own_equipment: true,
                            bgm: true,
                            camera_permission: true,
                            loud_sound: true,
                            stage_content: "fes" )

# power_order
PowerOrder.create(  group_id: 1,
                    item: "pc",
                    power: 10,
                    manufacture: "apple",
                    model: "macbook" )

# sub_rep
SubRep.create(  group_id: 1,
                name: "技大　太朗",
                department_id: 1,
                grade_id: 1,
                tel: "111-2222-3333",
                email:"gidaitaro@email.com",
                student_id: 11223344 )

# employee
Employee.create(    group_id:1,
                    name:"技大　花子",
                    student_id: 55667788,
                    employee_category_id:1 )

