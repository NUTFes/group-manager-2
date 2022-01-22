<template>
  <div class="menu-container">
    <div class="menu-content">
      <div class="menu-header">
        <h4>基本操作</h4>
      </div>
      <nav class="menu">
        <ul>
          <li v-for="item in operation_items" :key="item.title">
            <nuxt-link v-bind:to="item.click"
              ><span class="material-icons">{{ item.icon }}</span
              >{{ item.title }}</nuxt-link
            >
          </li>
        </ul>
      </nav>
      <div class="menu-header">
        <h4>申請情報</h4>
      </div>
      <nav class="menu">
        <ul>
          <li v-for="item in order_items" :key="item.title">
            <nuxt-link v-bind:to="item.click"
              ><span class="material-icons">{{ item.icon }}</span
              >{{ item.title }}</nuxt-link
            >
          </li>
        </ul>
      </nav>
      <div class="menu-header">
        <h4>一覧情報</h4>
      </div>
      <nav class="menu">
        <ul>
          <li v-for="item in list_items" :key="item.title">
            <nuxt-link v-bind:to="item.click"
              ><span class="material-icons">{{ item.icon }}</span
              >{{ item.title }}</nuxt-link
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      icon_src: require("@/assets/symbol-mark.svg"),
      drawer: true,
      // マイページ系
      mypage_items: [
        {
          title: "ダッシュボード",
          icon: "mdi-view-dashboard",
          click: "/dashboard",
        },
      ],
      // 一覧系
      list_items: [
        {
          title: "ユーザー一覧",
          icon: "people",
          click: "/users",
        },
        { title: "会場一覧", icon: "place", click: "/places" },
        {
          title: "使用可能会場一覧",
          icon: "add_location_alt",
          click: "/place_allow_lists",
        },
        { title: "物品一覧", icon: "chair", click: "/rental_items" },
        {
          title: "使用可能物品一覧",
          icon: "living",
          click: "/rental_item_allow_lists",
        },
        {
          title: "在庫場所一覧",
          icon: "warehouse",
          click: "/stocker_places",
        },
        {
          title: "在庫物品一覧",
          icon: "table_restaurant",
          click: "/stocker_items",
        },
        {
          title: "割り当て物品一覧",
          icon: "inventory",
          click: "/assign_rental_items",
        },
        {
          title: "ステージ一覧",
          icon: "festival",
          click: "/stages",
        },
        { title: "店一覧", icon: "storefront", click: "/shops" },
        {
          title: "開催年",
          icon: "calendar_today",
          click: "/fes_years",
        },
        { title: "開催日", icon: "date_range", click: "/fes_dates" },
      ],
      // 申請系
      order_items: [
        { title: "参加団体申請", icon: "groups", click: "/groups" },
        {
          title: "企画名申請",
          icon: "drive_file_rename_outline",
          click: "/project_names",
        },
        { title: "副代表申請", icon: "directions_walk", click: "/sub_reps" },
        {
          title: "会場申請",
          icon: "person_pin_circle",
          click: "/place_orders",
        },
        { title: "電力申請", icon: "power", click: "/power_orders" },
        { title: "物品申請", icon: "event_seat", click: "/rental_orders" },
        {
          title: "ステージ申請",
          icon: "keyboard_voice",
          click: "/stage_orders",
        },
        {
          title: "ステージオプション申請",
          icon: "dynamic_feed",
          click: "/stage_common_options",
        },
        { title: "従業員申請", icon: "directions_run", click: "/employees" },
        {
          title: "販売食品申請",
          icon: "fastfood",
          click: "/food_products",
        },
        {
          title: "購入品申請",
          icon: "shopping_cart",
          click: "/purchase_lists",
        },
      ],
      // 操作系
      operation_items: [
        { title: "ダッシュボード", icon: "dashboard", click: "/dashboard" },
        {
          title: "物品割り当て",
          icon: "assignment_return",
          click: "/assign_items",
        },
        { title: "会場割り当て", icon: "event_seat", click: "/assign_items" },
        { title: "お知らせ作成", icon: "newspaper", click: "/news" },
        { title: "書類印刷", icon: "print", click: "/print" },
        {
          title: "ユーザー画面制御",
          icon: "supervisor_account",
          click: "/user_page_setting",
        },
      ],
      user: [],
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/users/show", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.user = response.data.data;
      });
  },
};
</script>

<style>
.menu-container {
  position: fixed;
  left: 0;
  height: 100%;
  width: 250px;
  padding-bottom: 20px;
  background: radial-gradient(
    ellipse at top left,
    rgba(51, 51, 51, 0.9),
    rgba(51, 51, 51, 0.8)
  );
  backdrop-filter: blur(4px);
  z-index: 1;
  overflow: auto;
}

.menu-content {
  margin-bottom: 60px;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding-left: 0px;
}

.menu li {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.menu li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu a {
  display: inline-flex;
  font-size: 16px;
  font-weight: 300;
  align-items: center;
  padding: 15px 20px;
  width: 100%;
  height: 100%;
}

.menu span {
  font-size: 20px;
  font-weight: 100;
  padding-right: 10px;
  padding-bottom: 1px;
}

.menu-header {
  font-size: 16px;
  font-weight: 300;
  color: var(--accent-0);
  border-top: 1px solid var(--accent-5);
  border-bottom: 1px solid var(--accent-5);
  padding: 20px 20px;
  display: flex;
  letter-spacing: 1px;
}
</style>
