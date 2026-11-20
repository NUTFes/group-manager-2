<template>
  <div class="main-content"  v-if="this.$role(roleID).stages.read">
    <SubHeader pageTitle="ステージ一覧">
      <CommonButton v-if="this.$role(roleID).stages.create" iconName="add_circle" :on_click="openAddModal">
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
            v-for="(stage, index) in stages"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/stages/` + stage.id,
                })
            "
          >
            <td>{{ stage.id }}</td>
            <td>{{ stage.name }}</td>
            <td>{{ stage.enable_sunny }}</td>
            <td>{{ stage.enable_rainy }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="ステージの追加"
    >
      <template v-slot:form>
        <div>
          <h3>ステージ名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>晴れ</h3>
          <select v-model="enableSunny">
            <option disabled value="">選択してください</option>
            <option
              v-for="r in isUseList"
              :key="r"
              :value="r.value"
            >
              {{ r.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>雨</h3>
          <select v-model="enableRainy">
            <option disabled value="">選択してください</option>
            <option
              v-for="r in isUseList"
              :key="r"
              :value="r.value"
            >
              {{ r.text }}
            </option>
          </select>
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
      headers: ["ID", "ステージ名", "晴れ", "雨"],
      isOpenAddModal: false,
      isUseList: [
        { text: "使用可能", value: true },
        { text: "使用不可能", value: false },
      ],
      isOpenSnackBar: false,
      name: "",
      enableSunny: null,
      enableRainy: null,
    };
  },
  async asyncData({ $axios }) {
    const stageUrl = "/stages";
    const stagesRes = await $axios.$get(stageUrl);
    return {
      stages: stagesRes.data,
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
      const url = "/stages/" + id;
      this.$axios.$get(url).then((response) => {
        this.stages.push(response.data);
      });
    },
    async submit() {
      const url =
        "/stages/" +
        "?name=" +
        this.name +
        "&enable_sunny=" +
        this.enableSunny +
        "&enable_rainy=" +
        this.enableRainy;

      this.$axios.$post(url).then((response) => {
        this.openSnackBar(response.data.name + "を追加しました");
        this.name = "";
        this.enableSunny = null;
        this.enableRainy = null;
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>
