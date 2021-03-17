<script>
// ここでこのコンポーネントで使用するグラフの種類を定義する。今回はドーナツグラフなのでDoughnutとなる。
import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  data() {
    return {
      data: {
        // 凡例とツールチップに表示するラベル
        labels: ["未着手", "入力中", "完了"],
        // 表示するデータ
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ["#F44336", "#2196F3", "#4CAF50"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/dashboard", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.groups_length = response.data.groups_length;
        this.data.datasets[0].data[0] = response.data.progress_assign_item_1;
        this.data.datasets[0].data[1] = response.data.progress_assign_item_2;
        this.data.datasets[0].data[2] = response.data.progress_assign_item_3;
        this.renderChart(this.data, this.options);
      });
    this.renderChart(this.datas, this.options);
  },
};
</script>
