<template>
  <div class="main-content" v-if="this.$role(roleID).venue_maps.read">
    <SubHeader pageTitle="模擬店平面図申請一覧">
      <CommonButton
        v-if="this.$role(roleID).venue_maps.create"
        iconName="add_circle"
        :on_click="openAddModal"
      >
        追加
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementVenueMaps"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchVenueMaps"
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
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(venueMap, index) in venueMaps"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/venue_maps/` + venueMap.group.id,
                })
            "
          >
            <td>{{ venueMap.group.id }}</td>
            <td>{{ venueMap.group.name }}</td>
            <td>
              <div v-if="venueMap.venue_map">登録済み</div>
              <div v-else>未登録</div>
            </td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="模擬店平面図の登録"
    >
      <template v-slot:form>
        <div>
          <h3>参加団体</h3>
          <select v-model="group_id">
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
          <h3>模擬店平面図</h3>
          <label>
            <input type="file" accept=".png, .jpg" @change="fileUpload" />
            {{ files[0].name }}
          </label>
          <div v-if="isInvalidFile && !isFileCheck" style="color: red">
            ファイル形式は[.pngか.jpeg又は.jpg]にしてください
          </div>
          <div v-else-if="isFileCheck && !isInvalidFile" style="color: red">
            ファイル名は「参加形式_団体名」の形式で入力してください
          </div>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton
          iconName="add_circle"
          :on_click="submit"
          :disabled="!isFile"
          >{{ buttonState }}</CommonButton
        >
      </template>
    </AddModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ snackMessage }}
    </SnackBar>
  </div>
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
      snackMessage: "",
      group_id: "",
      refYears: "Years",
      refYearID: 0,
      searchText: "",
      buttonState: "登録",
      isPush: { disabled: false },
      files: [{ name: "選択してください" }],
      isInvalidFile: false,
      isFile: false,
      isFileCheck: false,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const url =
      "/api/v1/get_refinement_venue_maps?fes_year_id=" +
      currentYearRes.data.fes_year_id;
    const venueMapsRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      venueMaps: venueMapsRes.data,
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
    window.addEventListener("scroll", this.saveScrollPosition);

    const storedYearID = localStorage.getItem(this.$route.path + "RefYear");
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = "Year";
    }
    this.fetchFilteredData();
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },
    async openAddModal() {
      const groupUrl = "/api/v1/get_groups_have_no_venue_map";
      const groupRes = await this.$axios.$get(groupUrl);
      this.groupList = groupRes.data;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(snackMessage) {
      this.snackMessage = snackMessage;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload() {
      const url =
        "/api/v1/get_refinement_venue_maps?fes_year_id=" + this.refYearID;
      this.venueMaps = [];
      this.$axios.$post(url).then((response) => {
        this.venueMaps = response.data;
      });
    },
    fileUpload(event) {
      this.files = event.target.files;
      if (this.files.length > 0) {
        const file = this.files[0];

        const validFileName = ["png", "jpeg", "jpg"];
        const fileName = file.name.split(".").pop().toLowerCase();
        this.isInvalidFile = !validFileName.includes(fileName);
        const fileNameRegex = /^[^\\/:*?"<>|\r\n]+_[^\\/:*?"<>|\r\n]+$/;

        // ファイル形式のバリデーション
        if (this.isInvalidFile) {
          this.openSnackBar(
            "ファイル形式は[.pngか.jpeg又は.jpg]にしてください。"
          );
          this.isInvalidFile = true;
          return;
          // ファイル名のチェック。"_"で区切られているかどうかのチェック
        } else if (!fileNameRegex.test(file.name)) {
          this.openSnackBar(
            "ファイル名は「参加形式_団体名」の形式で入力してください"
          );
          this.isFileCheck = true;
          return;
        } else {
          this.isInvalidFile = false;
          this.isFileCheck = false;
          this.isFile = true;
        }
      }
    },
    submit() {
      for (let f of this.files) {
        let storageRef = ref(this.$storage, f.name);
        let uploadTask = uploadBytesResumable(storageRef, f);
        this.run(uploadTask);
        this.isFile = false;
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
              this.buttonState = "待機";
              this.isPush.disabled = true;
              this.state = "paused";
              break;
            case "running":
              this.buttonState = "待機";
              this.isPush.disabled = true;
              this.state = "Uploading ... (" + this.progress.toFixed() + "%)";
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const data = {
              group_id: this.group_id,
              picture_name: uploadTask.snapshot.ref.name,
              picture_path: downloadURL,
            };

            const url = `/venue_maps?group_id=${this.group_id}`;
            this.$axios.$post(url, data).then((response) => {
              this.reload(response.data.group_id);
              this.closeAddModal();
              this.openSnackBar("模擬店平面図を登録しました");
              this.isPush.disabled = false;
              this.files = null;
            });
          });
        }
      );
    },
    async refinementVenueMaps(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + "RefYear", this.refYearID);
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
      this.venueMaps = [];
      const refUrl =
        "/api/v1/get_refinement_venue_maps?fes_year_id=" + this.refYearID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.venueMaps.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchPurchaseLists();
      }
      this.$nextTick(() => {
        window.scrollTo(
          0,
          parseInt(localStorage.getItem("scrollPosition-" + this.$route.path))
        );
      });
    },
    async searchVenueMaps() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.venueMaps = [];
      const searchUrl = "/api/v1/get_search_venue_maps?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.venueMaps.push(res);
      }
    },
  },
};
</script>

<style>
.common-button[disabled] {
  pointer-events: none;
  opacity: 0.6;
}
</style>
