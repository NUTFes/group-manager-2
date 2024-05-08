<template>
  <div class="main-content" v-if="this.$role(roleID).news.read">
    <SubHeader pageTitle="お知らせ一覧">
      <CommonButton v-if="this.$role(roleID).news.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(n, index) in news"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/news/` + n.id,
                })
            "
          >
            <td>{{ n.id }}</td>
            <td>{{ n.title }}</td>
            <td>{{ n.created_at | formatDate }}</td>
            <td>{{ n.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="お知らせの追加"
    >
      <template v-slot:form>
        <div>
          <h3>タイトル</h3>
          <input v-model="title" placeholder="入力してください" />
        </div>
        <div>
          <h3>内容</h3>
          <textarea v-model="body" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
    <SnackBar
      v-if="isOpenSnackBar"
      @close="closeSnackBar"
    >
      {{ message }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "タイトル", "日時", "編集日時"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      title: "",
      body: ""
    };
  },
  async asyncData({ $axios }) {
    const newsUrl = "/news";
    const newsRes = await $axios.get(newsUrl);
    return {
      news: newsRes.data,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
    });
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload(id) {
      const url = "/news/" + id;
      this.$axios.$get(url).then((response) => {
        this.news.unshift(response.data);
      });
    },
    async submit() {
      const url =
        "/news/" +
        "?title=" +
        this.title +
        "&body=" +
        this.body

      this.$axios.$post(url).then((res) => {
        this.title = "";
        this.body = "";
        this.reload(res.data.id);
        this.closeAddModal();
        this.openSnackBar("お知らせを作成しました")
      });
    },
  },
};
</script>
