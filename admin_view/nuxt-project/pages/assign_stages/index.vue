<template>
  <div class="main-content">
    <SubHeader pageTitle="ステージ割り当て">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        割り当て
      </CommonButton>
    </SubHeader>
    <Card width="50%" v-for="stage in stageNumbers" v-bind:key="stage.stage.id">
      <Row justify="start">
        <h4>{{ stage.stage.name }}</h4>
      </Row>
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="n in stage.stage_numbers"
            v-bind:key="n.num"
            @click="openEditModal(n.group_identification_id, n.stage_number.id, n.stage_number.stage_id)"
          >
            <td>{{ n.num }}</td>
            <td>{{ n.group.name }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isAddModal"
      title="ステージの割り当て"
    >
      <template v-slot:form>
        <div>
          <h3>識別番号</h3>
          <select v-model="groupIdentificationId">
            <option disabled value="">選択してください</option>
            <option
              v-for="gi in groupIdentifications"
              :key="gi.id"
              :value="gi.id"
            >
            【識別番号：{{ gi.number }}】団体名：{{ gi.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>会場</h3>
          <select v-model="stageId">
            <option disabled value="">選択してください</option>
            <option
              v-for="stage in stages"
              :key="stage.id"
              :value="stage.id"
            >
              {{ stage.name }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit">登録</CommonButton>
      </template>
    </AddModal>

    <AddModal
      @close="closeAddModal"
      v-if="isEditModal"
      title="ステージ割り当ての編集"
    >
      <template v-slot:form>
        <div>
          <h3>会場</h3>
          <select v-model="stageId">
            <option disabled value="">選択してください</option>
            <option
              v-for="stage in stages"
              :key="stage.id"
              :value="stage.id"
            >
              {{ stage.name }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </AddModal>

  </div>
</template>

<script>
import AddModal from '../../components/AddModal.vue';
import CommonButton from '../../components/CommonButton.vue';
export default {
  components: { AddModal, CommonButton },
  data() {
    return {
      headers: [
        "識別番号",
        "団体名"
      ],
      isAddModal: false,
      isEditModal: false,
      stageNumbers: null,
      stages: null,
      groupIdentifications: null,
      groupIdentificationId: null,
      stageId: null,
      stageNumberId: null
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const url = "/stage_numbers?fes_year_id=" +
        currentYearRes.data.fes_year_id;
    const stagesRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
        return element.id == currentYearRes.data.fes_year_id;
    });
    return {
        stageNumbers: stagesRes.data,
        yearList: yearsRes.data,
        refYearID: currentYearRes.data.fes_year_id,
        refYears: currentYears[0].year_num,
    };
  },
  methods: {
    openAddModal() {
      this.$axios.$get("/stages").then((res) => {
        this.stages = res.data;
      });
      this.$axios.$get("/group_identification?fes_year_id=" + this.refYearID + "&group_category_id=3").then((res) => {
        this.groupIdentifications = res.data.filter(v => v.stage === null)
        this.groupIdentifications = this.groupIdentifications.filter(v => v.number !== null)
      });
      this.isAddModal = true;
    },
    openEditModal(groupIdentificationId, stageNumberId, stageId) {
      this.stageNumberId = stageNumberId
      this.stageId = stageId
      this.groupIdentificationId = groupIdentificationId
      this.$axios.$get("/stages").then((res) => {
        this.stages = res.data;
      });
      this.isEditModal = true;
    },
    closeAddModal() {
      this.isAddModal = false;
      this.isEditModal = false;
    },
    reload() {
      const url = "/stage_numbers?fes_year_id=" + this.refYearID;
      this.$axios.$get(url).then((res) => {
        this.stageNumbers = res.data
      })
    },
    submit() {
      const url = "/stage_numbers?group_identification_id=" + this.groupIdentificationId + "&stage_id=" + this.stageId
      this.$axios.$post(url).then(() => {
        this.reload()
        this.closeAddModal()
      })
      this.stageId = null
      this.groupIdentificationId = null
    },
    edit() {
      const url = "/stage_numbers/"+ this.stageNumberId +"?group_identification_id=" + this.groupIdentificationId + "&stage_id=" + this.stageId
      this.$axios.$put(url).then(() => {
        this.reload()
        this.closeAddModal()
        this.stageId = null
        this.groupIdentificationId = null
      })
    }
  },
}
</script>
