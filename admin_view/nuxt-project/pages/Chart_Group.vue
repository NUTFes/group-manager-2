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
            label: "参加団体数",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "団体数",
              },
              ticks: {
                min: 0,
                max: 30,
                fontSize: 14,
                stepSize: 5  
              },
            },
          ],
        },
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
