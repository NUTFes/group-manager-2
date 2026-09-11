<template>
  <div class="main-content" v-if="this.$role(roleID).places.read">
    <SubHeader pageTitle="会場割り当て">
    </SubHeader>

    <Row wrap="nowrap" align="start">
      <Column width="50%" height="800px">
      <Card width="100%" style="overflow: scroll">
        <SubHeader pageTitle="割り当て情報">
          <CommonButton iconName="add_circle" :on_click="openAddModal">
            割り当て
          </CommonButton>
        </SubHeader>
        <Card width="100%" style="overflow: scroll" v-for="place in placeNumbers" v-bind:key="place.place.id">
          <Row justify="start">
            <h4>{{ place.place.name }}</h4>
          </Row>
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in headers" v-bind:key="index">
                {{ header }}
              </th>
            </template>
            <template v-slot:table-body>
              <tr
                v-for="n in place.place_numbers"
                v-bind:key="n.num"
                @click="openEditModal(n.group_identification_id, n.place_number.id, n.place_number.place_id)"
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
          <SubHeader pageTitle="会場申請一覧">
          </SubHeader>
          <Card width="100%" style="overflow: scroll">
            <Table>
              <template v-slot:table-header>
                <th v-for="(header, index) in placeOrderHeaders" :key="index">
                  {{ header }}
                </th>
              </template>
              <template v-slot:table-body>
                <tr
                  v-for="(placeOrder, index) in placeOrders"
                  :key="index"
                >
                  <td>{{ placeOrder.group.name }}</td>
                  <td>{{ placeOrder.place_order_name.first }}</td>
                  <td>{{ placeOrder.place_order_name.second }}</td>
                  <td>{{ placeOrder.place_order_name.third }}</td>
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
      title="会場の割り当て"
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
          <select v-model="placeId">
            <option disabled value="">選択してください</option>
            <option
              v-for="place in places"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
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
      title="会場割り当ての編集"
    >
      <template v-slot:form>
        <div>
          <h3>会場</h3>
          <select v-model="placeId">
            <option disabled value="">選択してください</option>
            <option
              v-for="place in places"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
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
import Column from '../../components/Column.vue';
import { mapState } from "vuex";
export default {
  components: { AddModal, CommonButton, Column },
  data() {
    return {
      headers: [
        "識別番号",
        "団体名"
      ],
      placeOrderHeaders: [
        "参加団体",
        "第一希望",
        "第二希望",
        "第三希望",
      ],
      isAddModal: false,
      isEditModal: false,
      placeNumbers: null,
      places: null,
      groupIdentifications: null,
      groupIdentificationId: null,
      placeId: null,
      placeNumberId: null,
      placeOrders: null
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const url = "/place_numbers?fes_year_id=" +
        currentYearRes.data.fes_year_id;
    const placesRes = await $axios.$get(url);
    const placeOrderUrl =
      "/api/v1/get_refinement_place_orders?fes_year_id=" +
      currentYearRes.data.fes_year_id;
    const placeOrderRes = await $axios.$post(placeOrderUrl);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
        return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      placeOrders: placeOrderRes.data,
      placeNumbers: placesRes.data,
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
    } ,
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    openAddModal() {
      this.$axios.$get("/places").then((res) => {
        this.places = res.data;
      });
      this.$axios.$get("/group_identification?fes_year_id=" + this.refYearID + "&group_category_id=0").then((res) => {
        this.groupIdentifications = res.data.filter(v => v.place === null)
        this.groupIdentifications = this.groupIdentifications.filter(v => v.number !== null)
        this.groupIdentifications = this.groupIdentifications.filter(v => v.group_category_id !== 3)
      });
      this.isAddModal = true;
    },
    openEditModal(groupIdentificationId, placeNumberId, placeId) {
      this.placeNumberId = placeNumberId
      this.placeId = placeId
      this.groupIdentificationId = groupIdentificationId
      this.$axios.$get("/places").then((res) => {
        this.places = res.data;
      });
      this.isEditModal = true;
    },
    closeAddModal() {
      this.isAddModal = false;
      this.isEditModal = false;
    },
    reload() {
      const url = "/place_numbers?fes_year_id=" + this.refYearID;
      this.$axios.$get(url).then((res) => {
        this.placeNumbers = res.data
      })
    },
    submit() {
      const url = "/place_numbers?group_identification_id=" + this.groupIdentificationId + "&place_id=" + this.placeId
      this.$axios.$post(url).then(() => {
        this.reload()
        this.closeAddModal()
      })
      this.placeId = null
      this.groupIdentificationId = null
    },
    edit() {
      const url = "/place_numbers/"+ this.placeNumberId +"?group_identification_id=" + this.groupIdentificationId + "&place_id=" + this.placeId
      this.$axios.$put(url).then(() => {
        this.reload()
        this.closeAddModal()
        this.placeId = null
        this.groupIdentificationId = null
      })
    }
  },
}
</script>
