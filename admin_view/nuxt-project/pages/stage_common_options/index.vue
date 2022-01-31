<template>
  <div class="main-content">
    <SubHeader pageTitle="ステージオプション申請一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSVダウンロード
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
          <input v-model="searchText" @keypress.enter="searchStageCommonOptions" type="text" size="25" placeholder="search" />
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
            <td>
              {{
                stageCommonOption.stage_common_option.created_at | formatDate
              }}
            </td>
            <td>
              {{
                stageCommonOption.stage_common_option.updated_at | formatDate
              }}
            </td>
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
          <h3>氏名</h3>
          <input v-model="stageOptionName" placeholder="入力してください" />
        </div>
        <div>
          <h3>学籍番号</h3>
          <input v-model="stageOptionStudentId" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitEmployee"
          >登録</CommonButton
        >
      </template>
    </AddModal>
  </div>
</template>

<script>
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
        "登録日時",
        "編集日時",
      ],
      isOwnEquipmentList: [
        { id: 1, value: "使用する" },
        { id: 2, value: "使用しない" }
      ],
      isBgmList: [
        { id: 1, value: "かける" },
        { id: 2, value: "かけない" }
      ],
      isCameraPermissionList: [
        { id: 1, value: "許可" },
        { id: 2, value: "許可しない" }
      ],
      isLoudSoundList: [
        { id: 1, value: "出す" },
        { id: 2, value: "出さない" }
      ],
      isOpenAddModal: false,
      //v-model
      groupID: "",
      ownEquipment: "",
      bgm: "",
      cameraPermission: "",
      loudSound: "",
      stageContent: "",
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

    // const url = "/api/v1/get_stage_common_option_index_for_admin_view";
    const url = "/api/v1/get_refinement_stage_common_options?fes_year_id=" + currentYearRes.data.fes_year_id + "&own_equipment=0&bgm=0&camera_permission=0&loud_sound=0";
    const stageCommonOptionRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id
    })
    return {
      stageCommonOption: stageCommonOptionRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num
    };
  },
  methods: {
    async refinementStageCommonOptions(item_id, name_list){
      // fes_yearで絞り込むとき
      if (Object.is(name_list, this.yearList)) {
        this.refYearID = item_id
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL"
        }else{
          this.refYears = name_list[item_id - 1].year_num
        }
      // own_equipmentで絞り込むとき
      }else if (Object.is(name_list, this.isOwnEquipmentList)){
        this.refIsOwnEquipmentID = item_id
        // ALLの時
        if (item_id == 0){
          this.refIsOwnEquipment = "ALL"
        }else{
          this.refIsOwnEquipment = name_list[item_id - 1].value
        }
      // bgmで絞り込むとき
      }else if (Object.is(name_list, this.isBgmList)){
        this.refIsBgmID = item_id
        // ALLの時
        if (item_id == 0){
          this.refIsBgm = "ALL"
        }else{
          this.refIsBgm = name_list[item_id - 1].value
        }
      // camera_permissionで絞り込むとき
      }else if (Object.is(name_list, this.isCameraPermissionList)) {
        this.refIsCameraPermissionID = item_id
        // ALLの時
        if (item_id == 0){
          this.refIsCameraPermission = "ALL"
        }else{
          this.refIsCameraPermission = name_list[item_id - 1].value
        }
      // loud_soundで絞り込むとき
      }else if (Object.is(name_list, this.isLoudSoundList)) {
        this.refIsLoudSoundID = item_id
        // ALLの時
        if (item_id == 0){
          this.refIsLoudSound = "ALL"
        }else{
          this.refIsLoudSound = name_list[item_id - 1].value
        }
      }
      this.stageCommonOption = [];
      const refUrl = "/api/v1/get_refinement_stage_common_options?fes_year_id=" + this.refYearID + "&own_equipment=" + this.refIsOwnEquipmentID + "&bgm=" + this.refIsBgmID + "&camera_permission=" + this.refIsCameraPermissionID + "&loud_sound=" + this.refIsLoudSoundID
      console.log(refUrl)
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.stageCommonOption.push(res)
      }
    },
    async searchStageCommonOptions() {
      this.stageCommonOption = []
      const searchUrl = "/api/v1/get_search_stage_common_options?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.stageCommonOption.push(res)
      }
    },
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    async submitEmployee() {
      const postStageOptionUrl =
        "/stage_common_options/" +
        "?group_id=" + this.groupID
        "&own_equipment=" + this.ownEquipment
        "&bgm=" + this.bgm
        "&camera_permission=" + this.cameraPermission
        "&loud_sound=" + this.loudSound
        "&stage_content=" + this.stageContent

      await this.$axios.$post(postStageOptionUrl).then((response) => {
        this.groupID = "";
        this.ownEquipment = "";
        this.bgm = "";
        this.cameraPermission = "";
        this.loudSound = "";
        this.stageContent = "";
        this.reload();
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        "http://localhost:3000" +
        "/api/v1/get_stage_common_options_csv/" +
        this.refYearID;
      window.open(url, "ステージオプション申請_CSV");
    },
  },
};
</script>
