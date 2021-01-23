User.seed( :id,
    { id: 1 ,   name: '技大太朗(dev)' ,
                email: 'nutfes-taro@email.com' ,
                password: 'gidaifes' ,
                password_confirmation: 'gidaifes' ,
                role_id: 1
    },
    { id: 2 ,   name: '技大次郎(mng)' ,
                email: 'nutfes-jiro@email.com' ,
                password: 'gidaifes' ,
                password_confirmation: 'gidaifes' ,
                role_id: 2
    },
    { id: 3 ,   name: '技大三郎(usr)' ,
                email: 'nutfes-saburo@email.com' ,
                password: 'gidaifes' ,
                password_confirmation: 'gidaifes' ,
                role_id: 3
    }
)