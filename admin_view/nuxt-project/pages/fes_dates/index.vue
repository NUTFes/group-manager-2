<template>
  <div class="main-content">
    <SubHeader pageTitle="開催日">
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
            v-for="(fesDate, index) in fesDates"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/fes_dates/` + fesDate.fes_date.id,
                })
            "
          >
            <td>{{ fesDate.fes_date.id }}</td>
            <td>{{ fesDate.fes_year.year_num }}</td>
            <td>{{ fesDate.fes_date.days_num }}</td>
            <td>{{ fesDate.fes_date.date }}</td>
            <td>{{ fesDate.fes_date.day }}</td>
            <td>{{ fesDate.fes_date.created_at | formatDate }}</td>
            <td>{{ fesDate.fes_date.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers:[
        'ID',
        '開催年',
        '何日目',
        '開催日',
        '曜日',
        '登録日時', 
        '編集日時',
      ],
    };
  },
  async asyncData({ $axios }) {
    const fesDateUrl = "/fes_dates"
    const fesDatesRes = await $axios.$get(fesDateUrl);
    return {
      fesDates: fesDatesRes.data,
    };
  },
  methods: {
    openModal: function () {
      this.$axios
        .get("/fes_years", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.fes_years = response.data;
        });
      this.dialog = true;
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_fes_dates", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.fes_dates = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("days_num", this.year_num);
      params.append("date", this.date);
      params.append("day", this.day);
      params.append("fes_year_id", this.fes_year_id);
      this.$axios.post("/fes_dates", params).then((response) => {
        this.reload();
        this.dialog = false;
      });
      this.fes_year_id = [];
      this.days_num = [];
      this.date = [];
      this.day = [];
    },
  },
};
</script>
