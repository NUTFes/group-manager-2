<template>
  <div class="main-content">
    <SubHeader pageTitle="参加団体申請一覧">
      <CommonButton iconName="add_circle"> 追加 </CommonButton>
    </SubHeader>
    <Card width="100%">
    {{ groups }}
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in headers" v-bind:key="index">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(group, index) in groups" v-bind:key="group.id">
            <td>{{ group.name }}</td>
            <td>{{ group.project_name }}</td>
            <td>{{ group.group_category_id }}</td>
            <td>{{ fes_year }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      group_categories: [],
      category: [],
      fes_years: [],
      years: [],
      groupName: [],
      projectName: [],
      activity: [],
      groupCategoryId: [],
      fesYearId: [],
      year_list: [],
      user: [],
      dialog: false,
      groupCategories: [
        { id: 1, name: "模擬店(食品販売)" },
        { id: 2, name: "模擬店(物品販売)" },
        { id: 3, name: "ステージ企画" },
        { id: 4, name: "展示・体験" },
        { id: 5, name: "研究室公開" },
        { id: 6, name: "その他" },
      ],
      headers: [
        "ID",
        "グループ名",
        "企画名",
        "グループカテゴリ",
        "開催年",
        "日時",
        "編集日時",
      ],
      /*
      headers: [
        { text: "ID", value: "group.id" },
        { text: "グループ名", value: "group.name" },
        { text: "企画名", value: "group.project_name" },
        { text: "グループカテゴリ", value: "group.group_category_id" },
        { text: "開催年", value: "fes_year" },
        { text: "日時", value: "group.created_at" },
        { text: "編集日時", value: "group.updated_at" },
      ],
      books: [
        {
          id: 101,
          title: "Vue.jsでレンダリング",
          price: 1730,
          published: "2021-01-01",
          isbn: "978-4-111111-11-1",
        },
        {
          id: 201,
          title: "Vue.js入門",
          price: 1500,
          published: "2021-01-15",
          isbn: "978-4-222222-22-2",
        },
        {
          id: 301,
          title: "Bulmaのすすめ",
          price: 1340,
          published: "2021-02-01",
          isbn: "978-4-333333-33-3",
        },
        {
          id: 401,
          title: "Nuxt.js入門",
          price: 2400,
          published: "2021-02-15",
          isbn: "978-4-444444-44-4",
        },
        {
          id: 501,
          title: "JavaScript入門",
          price: 1800,
          published: "2021-03-01",
          isbn: "978-4-555555-55-5",
        },
        {
          id: 601,
          title: "実践 JavaScript",
          price: 1590,
          published: "2021-03-15",
          isbn: "978-4-666666-66-6",
        },
        {
          id: 701,
          title: "CSS3リファレンス",
          price: 2680,
          published: "2021-04-01",
          isbn: "978-4-777777-77-7",
        },
        {
          id: 801,
          title: "HTML5リファレンス",
          price: 1470,
          published: "2021-04-15",
          isbn: "978-4-888888-88-8",
        },
        {
          id: 901,
          title: "Vue.js 3.x 基礎",
          price: 2230,
          published: "2021-05-01",
          isbn: "978-4-999999-99-9",
        },
      ],

      // テーブルのヘッダー配列
      headers: ["ID", "タイトル", "価格", "発行日", "ISBN"],
      */
    };
  },
  		async asyncData({ $axios }) {
			// 取得先のURL
			const url = "/api/v1/get_groups";
			// リクエスト（Get）
			const response = await $axios.$get(url);
			// 配列で返ってくるのでJSONにして返却
			return {
				groups: response
			};
		},
  mounted() {
    this.$axios
      .get("/api/v1/get_groups", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.length)
        groups = response.data.length;
        return groups
      });

    this.$axios
      .get("/group_categories", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.group_categories = response.data;
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]["name"]);
        }
      });

    this.$axios
      .get("/fes_years", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fes_years = response.data;
        for (let i = 0; i < this.fes_years.length; i++) {
          this.years.push(this.fes_years[i]["year_num"]);
        }
      });
  },
  methods: {
    open_add_dialog: function () {
      const url = "/api/v1/current_user/show";
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        })
        .then(
          (response) => {
            this.user = response.data.data;
          },
          (error) => {
            console.error(error);
            return error;
          }
        );
      this.$axios
        .get("/fes_years", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.year_list = response.data;
        });
      this.dialog = true;
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.groups = response.data;
        });
    },
    adjustHeight() {
      const textarea = this.$refs.activity;
      const resetHeight = new Promise(function (resolve) {
        resolve((textarea.style.height = "auto"));
      });
      resetHeight.then(function () {
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("user_id", this.user.id);
      params.append("name", this.groupName);
      params.append("project_name", this.projectName);
      params.append("activity", this.activity);
      params.append("group_category_id", this.groupCategoryId);
      params.append("fes_year_id", this.fesYearId);
      this.$axios.post("/groups", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
      });
    },
  },
};
</script>
