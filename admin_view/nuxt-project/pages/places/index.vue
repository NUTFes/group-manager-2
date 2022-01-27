<template>
  <div class="main-content">
    <SubHeader pageTitle="会場一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <table>
        <thead>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(place, index) in places"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/places/` + place.id,
                })
            "
          >
            <td>{{ place.id }}</td>
            <td>{{ place.name }}</td>
            <td>{{ place.created_at | formatDate }}</td>
            <td>{{ place.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      places: [],
      dialog: false,
      name: [],
      headers: [
        "ID",
        "名前",
        "登録日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios }) {
    const placeUrl = "/places"
    const placesRes = await $axios.$get(placeUrl);
    return {
      places: placesRes.data,
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      this.$axios
        .get("places", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.places = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      this.$axios.post("/places", params).then((response) => {
        this.dialog = false;
        this.reload();
        this.name = "";
      });
    },
  },
};
</script>
