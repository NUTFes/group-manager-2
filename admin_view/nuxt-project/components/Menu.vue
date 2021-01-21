<template>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      permanent
      color="#37474F"
      >
      <!-- ヘッダーと重ならないようにする -->
      <v-list-item dark>
      </v-list-item>
      <v-list-item dark>
        <v-list-item-icon>
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.click"
          color="#A9B6BD"
          dark
          >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
      <v-divider></v-divider>

      <v-list-item dark @click="logout">
        <v-list-item-icon>
          <v-icon>mdi-exit-to-app</v-icon>
        </v-list-item-icon>
        
        <v-list-item-content>
          <v-list-item-title>ログアウト</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
  </div>
</template>
<script>
import axios from 'axios' 

export default {
  data () {
    return {
      drawer: true,
      items: [
        { title: 'マイページ', icon: 'mdi-account-circle', click: '/mypage'},
        { title: 'ユーザー一覧', icon: 'mdi-account-multiple', click: '/users' },
        { title: '副代表一覧', icon: 'mdi-account-outline', click: '/sub_reps' },
        { title: '参加団体一覧', icon: 'mdi-account-group', click: '/groups' },
        { title: '企画名一覧', icon: 'mdi-unfold-more-vertical', click: '/project_names' },
        { title: 'ステージ申請一覧', icon: 'mdi-microphone-variant', click: '/stage_orders' },
        { title: '会場申請一覧', icon: 'mdi-map-marker', click: '/place_orders' },
        { title: '電力申請一覧', icon: 'mdi-power-plug', click: '/power_orders' },
        { title: '物品申請一覧', icon: 'mdi-cube', click: '/rental_orders' },
        { title: '貸し出し物品一覧', icon: 'mdi-table-chair', click: '/item_orders' },
        { title: '従業員一覧', icon: 'mdi-account', click: '/employees' },
        { title: '販売食品一覧', icon: 'mdi-baguette', click: '/food_products' },
        { title: '購入品一覧', icon: 'mdi-cart', click: '/purchase_lists' },
      ],
      user: []
    }
  },
  mounted() {
    this.$axios.get('api/v1/users/show', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.user = response.data.data
      })
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>

 <style>

</style>
