<template>
  <div class="main-content" v-if="this.$role(roleID).stages.read">
    <SubHeader pageTitle="ステージ割り当て">
    </SubHeader>

    <Row wrap="nowrap" align="start">
      <Column width="50%" height="800px">
        <Card width="100%" style="overflow: scroll">
          <SubHeader pageTitle="ステージ割り当て">
            <CommonButton iconName="add_circle" :on_click="openAddModal">
              割り当て
            </CommonButton>
          </SubHeader>
          <Card width="100%" v-for="stage in stageNumbers" v-bind:key="stage.stage.id">
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
                <td v-if="n.group !== null && n.group.fes_year_id==refYearID">{{ n.num }}</td>
                <td v-if="n.group !== null && n.group.fes_year_id==refYearID">{{ n.group.name }}</td>
                </tr>
              </template>
            </Table>
          </Card>
        </Card>
      </Column>
      <Column width="50%" height="800px">
        <Card width="100%" style="overflow: scroll">
          <Card width="100%">
						<SubHeader pageTitle="ステージ申請一覧">
						</SubHeader>
            <Table>
              <template v-slot:table-header>
                <th v-for="(header, index) in stageOrderHeaders" v-bind:key="index">
                  {{ header }}
                </th>
              </template>
              <template v-slot:table-body>
                <tr
                  v-for="(stageOrder, index) in stageOrders"
                  :key="index"
                >
                  <td>{{ stageOrder.group.name }}</td>
                  <td>{{ stageOrder.stage_order.is_sunny }}</td>
                  <td>{{ stageOrder.stage_order_info.date }}</td>
                  <td>{{ stageOrder.stage_order_info.stage_first }}</td>
                  <td>{{ stageOrder.stage_order_info.stage_second }}</td>
                </tr>
              </template>
            </Table>
          </Card>
        </Card>
      </Column>
    </Row>

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
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import AddModal from '../../components/AddModal.vue';
import CommonButton from '../../components/CommonButton.vue';
import { mapState } from "vuex";
export default {
  components: { AddModal, CommonButton },
  data() {
    return {
      headers: [
        "識別番号",
        "団体名"
      ],
      stageOrderHeaders: [
        "参加団体",
        "晴れ希望",
        "希望日",
        "第一希望",
        "第二希望",
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
    const stageOrderUrl =
      "/api/v1/get_refinement_stage_orders?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&stage_id=0&days_num=0&is_sunny=0";
    const stageOrdersRes = await $axios.$post(stageOrderUrl);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
        return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      stageOrders: stageOrdersRes.data,
      stageNumbers: stagesRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
    mounted() {
      window.addEventListener('scroll', this.saveScrollPosition);
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
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
