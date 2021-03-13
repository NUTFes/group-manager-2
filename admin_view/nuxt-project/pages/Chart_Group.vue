<script>
import { HorizontalBar } from "vue-chartjs";

export default {
  extends: HorizontalBar,
  name: "chart",
  data() {
    return {
      data: {
        labels: [
          "模擬店（食品販売）",
          "模擬店（物品販売）",
          "ステージ企画",
          "展示・体験",
          "研究室公開",
          "その他",
        ],
        datasets: [
          {
            label: "HorizontalBar Dataset",
            data: [0, 0, 0, 0, 0, 0],
            // data: [],
            backgroundColor: [
              "blue-gray",
              "blue-gray",
              "blue-gray",
              "blue-gray",
              "blue-gray",
              "blue-gray",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "団体数",
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/users/get_user_detail", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.user = response.data.user;
        this.role = response.data.role;
        this.grade = response.data.grad;
        this.department = response.data.department;
        this.student_id = response.data.student_id;
        this.tel = response.data.tel;
      });
    this.$axios
      .get("api/v1/dashboard", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.groups_length = response.data.groups_length;
        this.data.datasets[0].data[0] = response.data.cate_1_length;
        this.data.datasets[0].data[1] = response.data.cate_2_length;
        this.data.datasets[0].data[2] = response.data.cate_3_length;
        this.data.datasets[0].data[3] = response.data.cate_4_length;
        this.data.datasets[0].data[4] = response.data.cate_5_length;
        this.data.datasets[0].data[5] = response.data.cate_6_length;
        this.renderChart(this.data, this.options);
      });
    this.rate = Number(this.groups_length) + 1;
  },
};
</script>