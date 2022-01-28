<template>
  <div class="main-content">
    <SubHeader pageTitle="開催年">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(fesYear, index) in fesYears"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/fes_years/` + fesYear.id,
                })
            "
          >
            <td>{{ fesYear.id }}</td>
            <td>{{ fesYear.year_num }}</td>
            <td>{{ fesYear.created_at | formatDate }}</td>
            <td>{{ fesYear.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
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
        '登録日時', 
        '編集日時',
      ],
    }
  },
  async asyncData({ $axios }) {
    const fesYearUrl = "/fes_years"
    const fesYearsRes = await $axios.$get(fesYearUrl);
    return {
      fesYears: fesYearsRes.data,
    };
  },
  methods:{
    reload: function() {
      this.$axios.get('/fes_years', {
        headers: { 
          "Content-Type": "application/json", 
        },
      }
      )
        .then(response => {
          this.fes_years = response.data
        })
    },
    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("year_num", this.year_num);
      this.$axios.post('/fes_years', params).then(response => {
        this.reload()
      })
      this.year_num = []
    },
  }
}
</script>
