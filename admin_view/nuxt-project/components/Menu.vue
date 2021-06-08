<template>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      clipped
      permanent
      color="menu1"
      >
      <v-list-item dark class="accent">
        <v-list-item-avatar rounded class="mx-auto" width="55" height="55">
          <v-img :src="icon_src"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <v-list dense>
        <v-list-item
          v-for="item in mypage_items"
          :key="item.title"
          :to="item.click"
          color="menu2"
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

      <v-list-item dark class="menu2">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold menu1--text">一覧情報</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list dense>
        <v-list-item
          v-for="item in list_items"
          :key="item.title"
          :to="item.click"
          color="menu2"
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

      <v-list-item dark class="menu2">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold menu1--text">申請情報</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <v-list dense>
        <v-list-item
          v-for="item in order_items"
          :key="item.title"
          :to="item.click"
          color="menu2"
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

      <v-list-item dark class="menu2">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold menu1--text">操作</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list dense>
        <v-list-item
          v-for="item in operation_items"
          :key="item.title"
          :to="item.click"
          color="menu2"
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
    </v-navigation-drawer>
</template>

<script>
import axios from 'axios' 
export default {
  data () {
    return {
      icon_src: require("@/assets/symbol-mark.svg"),
      drawer: true,
      // マイページ系
      mypage_items: [
        { title: 'ダッシュボード', icon: 'mdi-view-dashboard', click: '/dashboard'},
      ],
      // 一覧系
      list_items: [
        { title: 'ユーザー一覧', icon: 'mdi-account-multiple', click: '/users' },
        { title: '会場一覧', icon: 'mdi-map-marker-outline', click: '/places' },
        { title: '使用可能会場一覧', icon: 'mdi-map-marker-check-outline', click: '/place_allow_lists' },
        { title: '物品一覧', icon: 'mdi-seat-outline', click: '/rental_items' },
        { title: '使用可能物品一覧', icon: 'mdi-table-furniture', click: '/rental_item_allow_lists' },
        { title: '在庫場所一覧', icon: 'mdi-home-map-marker', click: '/stocker_places' },
        { title: '在庫物品一覧', icon: 'mdi-table-chair', click: '/stocker_items' },
        { title: '割り当て物品一覧', icon: 'mdi-cube-outline', click: '/assign_rental_items' },
        { title: 'ステージ一覧', icon: 'mdi-microphone-variant', click: '/stages' },
        { title: '店一覧', icon: 'mdi-cart-outline', click: '/shops' },
        { title: '開催年', icon: 'mdi-calendar-blank-multiple', click: '/fes_years' },
        { title: '開催日', icon: 'mdi-calendar-month', click: '/fes_dates' },

      ],
      // 申請系
      order_items: [
        { title: '参加団体申請', icon: 'mdi-account-group', click: '/groups' },
        { title: '企画名申請', icon: 'mdi-unfold-more-vertical', click: '/project_names' },
        { title: '副代表申請', icon: 'mdi-account', click: '/sub_reps' },
        { title: '会場申請', icon: 'mdi-map-marker', click: '/place_orders' },
        { title: '電力申請', icon: 'mdi-power-plug', click: '/power_orders' },
        { title: '物品申請', icon: 'mdi-seat', click: '/rental_orders' },
        { title: 'ステージ申請', icon: 'mdi-microphone', click: '/stage_orders' },
        { title: 'ステージオプション申請', icon: 'mdi-text-to-speech', click: '/stage_common_options' },
        { title: '従業員申請', icon: 'mdi-account', click: '/employees' },
        { title: '販売食品申請', icon: 'mdi-baguette', click: '/food_products' },
        { title: '購入品申請', icon: 'mdi-cart', click: '/purchase_lists' },
      ],
      // 操作系
      operation_items: [
        { title: '物品割り当て', icon: 'mdi-cube', click: '/assign_items' },
        { title: 'お知らせ', icon: 'mdi-newspaper-variant', click: '/news' },
        { title: '印刷', icon: 'mdi-printer', click: '/print' },
        { title: '設定', icon: 'mdi-cog', click: '/user_page_setting' },
        { title: 'ユーザー個人設定', icon: 'mdi-account-cog', click: '/current_user_setting' },
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
}
</script>
