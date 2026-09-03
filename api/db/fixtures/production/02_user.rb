# frozen_string_literal: true

User.seed(:id,
          { id: 1, name: '管理者',
            email: 'admin@example.com',
            password: 'gidaifes',
            password_confirmation: 'gidaifes',
            role_id: 1 },
          { id: 2, name: '利用者',
            email: 'user@example.com',
            password: 'gidaifes',
            password_confirmation: 'gidaifes',
            role_id: 3 })
