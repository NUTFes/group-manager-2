<template>
  <div class="main-content">
    <SubHeader pageTitle="会場割り当て">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        割り当て
      </CommonButton>
    </SubHeader>
    <Card width="50%" v-for="place in placeNumbers" v-bind:key="place.place.id">
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
            <td>{{ n.num }}</td>
            <td>{{ n.group.name }}</td>
          </tr>
        </template>
      </Table>
    </Card>

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
      placeNumbers: null,
      places: null,
      groupIdentifications: null,
      groupIdentificationId: null,
      placeId: null,
      placeNumberId: null
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const url = "/place_numbers?fes_year_id=" +
        currentYearRes.data.fes_year_id;
    const placesRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
        return element.id == currentYearRes.data.fes_year_id;
    });
    return {
        placeNumbers: placesRes.data,
        yearList: yearsRes.data,
        refYearID: currentYearRes.data.fes_year_id,
        refYears: currentYears[0].year_num,
    };
  },
  methods: {
    openAddModal() {
      this.$axios.$get("/places").then((res) => {
        this.places = res.data;
      });
      this.$axios.$get("/group_identification?fes_year_id=" + this.refYearID).then((res) => {
        this.groupIdentifications = res.data.filter(v => v.place === null)
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
