<template>
  <div class="main-content"  v-if="this.$role(roleID).public_relations.read">
    <SubHeader pageTitle="参加団体PR申請一覧">
      <CommonButton v-if="this.$role(roleID).public_relations.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSV
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementPurchaseLists"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchPurchaseLists"
            type="text"
            size="25"
            placeholder="search"
          />
        </SearchBar>
      </template>
    </SubSubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(publicRelation, index) in publicRelations"
            @click="
              () =>
                $router.push({
                  path: `/public_relations/` + publicRelation.group.id,
                })
            "
            :key="index"
          >
            <td>{{ publicRelation.group.id }}</td>
            <td>{{ publicRelation.group.name }}</td>
            <td>
              <div v-if='publicRelation.blurb === null'>未登録</div>
              <div v-else>登録済み</div>
            </td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="参加団体PR申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="appGroup">
            <option disabled value="">選択してください</option>
            <option
              v-for="group in groupList"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>画像</h3>
          <label>
            <input type="file" @change="fileUpload" />
            {{files[0].name}}
          </label>
        </div>
        <div>
          <h3>文章</h3>
          <textarea v-model="blurb" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="upload" :disabled="isPush.disabled"
          >{{ buttonState }}</CommonButton
        >
          {{ state }}
      </template>
    </AddModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "申請状況"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      isFreshList: [
        { id: 1, value: "はい" },
        { id: 2, value: "いいえ" },
      ],
      appGroup: "",
      refYears: "Years",
      refYearID: 0,
      refIsFresh: "画像",
      refIsFreshID: 0,
      searchText: "",
      state: "",
      publicRelations: [],
      blurb: [],
      files: [{name: "選択してください"}],
      buttonState: "登録",
      isPush: {disabled: false},
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const url =
      "/api/v1/get_refinement_public_relations?fes_year_id=" +
      currentYearRes.data.fes_year_id;
    const publicRelationsRes = await $axios.$post(url);
    console.log(publicRelationsRes)
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      publicRelations: publicRelationsRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);

    const storedYearID = localStorage.getItem(this.$route.path + 'RefYear');
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = 'Year';
    }
    this.fetchFilteredData();
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    async openAddModal() {
      const url = "/api/v1/get_groups_have_no_public_relation";
      const resGroups = await this.$axios.$get(url);
      this.groupList = resGroups.data;

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
    reload() {
      const url =
        "/api/v1/get_refinement_public_relations?fes_year_id=" + this.refYearID;
      this.publicRelations = [];
      this.$axios.$post(url).then((response) => {
        this.publicRelations = response.data;
      });
    },
    fileUpload(event) {
      this.files = event.target.files;
      console.log(this.files[0])
    },
    upload() {
      for (let f of this.files) {
        let storageRef = ref(this.$storage, f.name);
        let uploadTask = uploadBytesResumable(storageRef, f);
        this.run(uploadTask);
      }
    },
    run(uploadTask) {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress = snapshot.bytesTransferred / snapshot.totalBytes;
          this.progress = progress * 100;
          switch (snapshot.state) {
            case "paused":
              this.buttonState = "待機"
              this.isPush.disabled = true
              this.state = "paused";
              break;
            case "running":
              this.buttonState = "待機"
              this.isPush.disabled = true
              this.state = "Uploading ... (" + this.progress.toFixed() + "%)";
              break;
          }
        },
        (error) => {
          console.log(error);
        },
         () => {
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
             const url =
               "/public_relations?group_id=" +
               this.appGroup +
               "&picture_name=" +
               uploadTask.snapshot.ref.name +
               "&picture_path=" +
               downloadURL +
               "&blurb=" +
               this.blurb;
             console.log(url)

             this.$axios.$post(url).then((response) => {
               this.reload();
               this.closeAddModal();
               this.openSnackBar("PR画像・文申請を追加しました");
               this.buttonState = "登録"
               this.isPush.disabled = false
               this.groupID = null;
               this.blurb = null;
             })
             /*
             const url = "/api/videos?name=" + uploadTask.snapshot.ref.name + "&path=" + downloadURL
             axios.post(url).then(
               console.log("Uploading Success!")
             )
              */
           }
          )
        }
      );
    },
    async refinementPurchaseLists(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + 'RefYear', this.refYearID);
      this.fetchFilteredData();
    },
    updateFilters(item_id, name_list) {
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
      }
    },
    async fetchFilteredData() {
      this.publicRelations = [];
      const refUrl =
        "/api/v1/get_refinement_public_relations?fes_year_id=" +
        this.refYearID
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.publicRelations.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchPurchaseLists();
      }
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
    async searchPurchaseLists() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.publicRelations = [];
      const searchUrl =
        "/api/v1/get_search_public_relations?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.publicRelations.push(res);
      }
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL +
        "/api/v1/get_public_relations_csv/" +
        this.refYearID;
      window.open(url, "PR申請_CSV");
    },
  },
};
</script>
