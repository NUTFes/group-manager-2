<template>
  <div class="main-content" v-if="this.$role(roleID).stage_common_options.read">
    <SubHeader pageTitle="ステージオプション申請一覧">
      <CommonButton v-if="this.$role(roleID).stage_common_options.create" iconName="add_circle" :on_click="openAddModal">
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
          :on_click="refinementStageCommonOptions"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>

        <SearchDropDown
          :nameList="isOwnEquipmentList"
          :on_click="refinementStageCommonOptions"
          value="value"
        >
          {{ refIsOwnEquipment }}
        </SearchDropDown>

        <SearchDropDown
          :nameList="isBgmList"
          :on_click="refinementStageCommonOptions"
          value="value"
        >
          {{ refIsBgm }}
        </SearchDropDown>

        <SearchDropDown
          :nameList="isCameraPermissionList"
          :on_click="refinementStageCommonOptions"
          value="value"
        >
          {{ refIsCameraPermission }}
        </SearchDropDown>

        <SearchDropDown
          :nameList="isLoudSoundList"
          :on_click="refinementStageCommonOptions"
          value="value"
        >
          {{ refIsLoudSound }}
        </SearchDropDown>
      </template>

      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchStageCommonOptions"
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
            v-for="(stageCommonOption, index) in stageCommonOption"
            @click="
              () =>
                $router.push({
                  path:
                    `/stage_common_options/` +
                    stageCommonOption.stage_common_option.id,
                })
            "
            :key="index"
          >
            <td>{{ stageCommonOption.stage_common_option.id }}</td>
            <td>{{ stageCommonOption.group.name }}</td>
            <td>{{ stageCommonOption.stage_common_option.own_equipment }}</td>
            <td>{{ stageCommonOption.stage_common_option.bgm }}</td>
            <td>
              {{ stageCommonOption.stage_common_option.camera_permission }}
            </td>
            <td>{{ stageCommonOption.stage_common_option.loud_sound }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="ステージオプション申請の追加"
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
          <h3>所持機器の使用</h3>
          <select v-model="ownEquipment">
            <option disabled value="">選択してください</option>
            <option
              v-for="item in isOwnEquipmentList"
              :key="item.id"
              :value="item.bool"
            >
              {{ item.value }}
            </option>
          </select>
        </div>
        <div>
          <h3>音楽をかける</h3>
          <select v-model="bgm">
            <option disabled value="">選択してください</option>
            <option v-for="item in isBgmList" :key="item.id" :value="item.bool">
              {{ item.value }}
            </option>
          </select>
        </div>
        <div>
          <h3>撮影許可</h3>
          <select v-model="cameraPermission">
            <option disabled value="">選択してください</option>
            <option
              v-for="item in isCameraPermissionList"
              :key="item.id"
              :value="item.bool"
            >
              {{ item.value }}
            </option>
          </select>
        </div>
        <div>
          <h3>騒音</h3>
          <select v-model="loudSound">
            <option disabled value="">選択してください</option>
            <option
              v-for="item in isLoudSoundList"
              :key="item.id"
              :value="item.bool"
            >
              {{ item.value }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitEmployee"
          >登録</CommonButton
        >
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
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "所持機器の使用",
        "音楽をかける",
        "撮影許可",
        "大きな音",
      ],
      isOwnEquipmentList: [
        { id: 1, value: "使用する", bool: true },
        { id: 2, value: "使用しない", bool: false },
      ],
      isBgmList: [
        { id: 1, value: "かける", bool: true },
        { id: 2, value: "かけない", bool: false },
      ],
      isCameraPermissionList: [
        { id: 1, value: "許可", bool: true },
        { id: 2, value: "許可しない", bool: false },
      ],
      isLoudSoundList: [
        { id: 1, value: "出す", bool: true },
        { id: 2, value: "出さない", bool: false },
      ],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      //v-model
      appGroup: "",
      ownEquipment: "",
      bgm: "",
      cameraPermission: "",
      loudSound: "",
      //refinement
      stageCommonOption: [],
      searchText: "",
      //other
      refYears: "Years",
      refYearID: 0,
      refIsOwnEquipment: "所持機器の使用",
      refIsOwnEquipmentID: 0,
      refIsBgm: "音楽をかける",
      refIsBgmID: 0,
      refIsCameraPermission: "撮影許可",
      refIsCameraPermissionID: 0,
      refIsLoudSound: "大きな音",
      refIsLoudSoundID: 0,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    const groupUrl = "/api/v1/get_groups_refinemented_by_current_fes_year";
    const groupRes = await $axios.$get(groupUrl);

    // const url = "/api/v1/get_stage_common_option_index_for_admin_view";
    const url =
      "/api/v1/get_refinement_stage_common_options?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&own_equipment=0&bgm=0&camera_permission=0&loud_sound=0";
    const stageCommonOptionRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      stageCommonOption: stageCommonOptionRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
      groupList: groupRes.data,
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

    const storedIsOwnEquipmentID = localStorage.getItem(this.$route.path + 'RefIsOwnEquipment');
    if (storedIsOwnEquipmentID) {
      this.refIsOwnEquipmentID = Number(storedIsOwnEquipmentID);
      this.updateFilters(this.refIsOwnEquipmentID, this.isOwnEquipmentList);
    } else {
      this.refIsOwnEquipment = '所持機器の使用';
    }

    const storedIsBgmID = localStorage.getItem(this.$route.path + 'RefIsBgm');
    if (storedIsBgmID) {
      this.refIsBgmID = Number(storedIsBgmID);
      this.updateFilters(this.refIsBgmID, this.isBgmList);
    } else {
      this.refIsBgm = '音楽をかける';
    }

    const storedIsCameraPermissionID = localStorage.getItem(this.$route.path + 'RefIsCameraPermission');
    if (storedIsCameraPermissionID) {
      this.refIsCameraPermissionID = Number(storedIsCameraPermissionID);
      this.updateFilters(this.refIsCameraPermissionID, this.isCameraPermissionList);
    } else {
      this.refIsCameraPermission = '撮影許可';
    }

    const storedIsLoudSoundID = localStorage.getItem(this.$route.path + 'RefIsLoudSound');
    if (storedIsLoudSoundID) {
      this.refIsLoudSoundID = Number(storedIsLoudSoundID);
      this.updateFilters(this.refIsLoudSoundID, this.isLoudSoundList);
    } else {
      this.refIsLoudSound = '大きな音';
    }

    this.fetchFilteredData();
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },

    async refinementStageCommonOptions(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + 'RefYear', this.refYearID);
      localStorage.setItem(this.$route.path + 'RefIsOwnEquipment', this.refIsOwnEquipmentID);
      localStorage.setItem(this.$route.path + 'RefIsBgm', this.refIsBgmID);
      localStorage.setItem(this.$route.path + 'RefIsCameraPermission', this.refIsCameraPermissionID);
      localStorage.setItem(this.$route.path + 'RefIsLoudSound', this.refIsLoudSoundID);
      this.fetchFilteredData();
    },
    updateFilters(item_id, name_list) {
      // fes_yearで絞り込むとき
      if (Object.is(name_list, this.yearList)) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
        // own_equipmentで絞り込むとき
      } else if (Object.is(name_list, this.isOwnEquipmentList)) {
        this.refIsOwnEquipmentID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refIsOwnEquipment = "ALL";
        } else {
          this.refIsOwnEquipment = name_list[item_id - 1].value;
        }
        // bgmで絞り込むとき
      } else if (Object.is(name_list, this.isBgmList)) {
        this.refIsBgmID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refIsBgm = "ALL";
        } else {
          this.refIsBgm = name_list[item_id - 1].value;
        }
        // camera_permissionで絞り込むとき
      } else if (Object.is(name_list, this.isCameraPermissionList)) {
        this.refIsCameraPermissionID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refIsCameraPermission = "ALL";
        } else {
          this.refIsCameraPermission = name_list[item_id - 1].value;
        }
        // loud_soundで絞り込むとき
      } else if (Object.is(name_list, this.isLoudSoundList)) {
        this.refIsLoudSoundID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refIsLoudSound = "ALL";
        } else {
          this.refIsLoudSound = name_list[item_id - 1].value;
        }
      }
    },
    async fetchFilteredData() {
      this.stageCommonOption = [];
      const refUrl =
        "/api/v1/get_refinement_stage_common_options?fes_year_id=" +
        this.refYearID +
        "&own_equipment=" +
        this.refIsOwnEquipmentID +
        "&bgm=" +
        this.refIsBgmID +
        "&camera_permission=" +
        this.refIsCameraPermissionID +
        "&loud_sound=" +
        this.refIsLoudSoundID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.stageCommonOption.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchStageCommonOptions();
      }
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
    async searchStageCommonOptions() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.stageCommonOption = [];
      const searchUrl =
        "/api/v1/get_search_stage_common_options?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.stageCommonOption.push(res);
      }
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
    async submitEmployee() {
      const postStageOptionUrl =
        "/stage_common_options/" +
        "?group_id=" +
        this.appGroup +
        "&own_equipment=" +
        this.ownEquipment +
        "&bgm=" +
        this.bgm +
        "&camera_permission=" +
        this.cameraPermission +
        "&loud_sound=" +
        this.loudSound;
      console.log(postStageOptionUrl);

      await this.$axios.$post(postStageOptionUrl).then((response) => {
        this.openSnackBar("申請を追加しました");
        this.groupID = "";
        this.ownEquipment = "";
        this.bgm = "";
        this.cameraPermission = "";
        this.loudSound = "";
        this.refinementStageCommonOptions(0, this.yearList);
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL +
        "/api/v1/get_stage_common_options_csv/" +
        this.refYearID;
      window.open(url, "ステージオプション申請_CSV");
    },
  },
};
</script>
