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
      <v-list-item dark style="background-color:#bf794e">
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
          color="#81D4FA"
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
        { title: 'ステージ一覧', icon: 'mdi-microphone-variant', click: '/stages' },
        { title: 'ステージオプション一覧', icon: 'mdi-microphone-variant', click: '/stage_common_options' },
        { title: 'ステージ申請一覧', icon: 'mdi-microphone-variant', click: '/stage_orders' },
        { title: '会場一覧', icon: 'mdi-map-marker', click: '/places' },
        { title: '使用可能会場一覧', icon: 'mdi-map-marker', click: '/place_allow_lists' },
        { title: '会場申請一覧', icon: 'mdi-map-marker', click: '/place_orders' },
        { title: '電力申請一覧', icon: 'mdi-power-plug', click: '/power_orders' },
        { title: '物品一覧', icon: 'mdi-table-chair', click: '/rental_items' },
        { title: '使用可能物品一覧', icon: 'mdi-table-chair', click: '/rental_item_allow_lists' },
        { title: '在庫場所一覧', icon: 'mdi-table-chair', click: '/stocker_places' },
        { title: '在庫物品一覧', icon: 'mdi-table-chair', click: '/stocker_items' },
        { title: '貸出可能物品一覧', icon: 'mdi-table-chair', click: '/rentable_items' },
        { title: '物品申請一覧', icon: 'mdi-cube', click: '/rental_orders' },
        { title: '物品割り当て', icon: 'mdi-table-chair', click: '/assign_items' },
        { title: '割り当て物品一覧', icon: 'mdi-cube', click: '/assign_rental_items' },
        { title: '従業員一覧', icon: 'mdi-account', click: '/employees' },
        { title: '販売食品一覧', icon: 'mdi-baguette', click: '/food_products' },
        { title: '購入品一覧', icon: 'mdi-cart', click: '/purchase_lists' },
        { title: '店一覧', icon: 'mdi-cart', click: '/shops' },
        { title: 'お知らせ', icon: 'mdi-newspaper-variant', click: '/news' },
        { title: '設定', icon: 'mdi-cog', click: '/user_page_setting' },
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
      localStorage.removeItem('access-token')
      localStorage.removeItem('client')
      localStorage.removeItem('uid')
      this.$router.push('/')
    }
  }
}
</script>

 <style>

</style>
