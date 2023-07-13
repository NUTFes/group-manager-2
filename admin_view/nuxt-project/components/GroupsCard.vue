<template>
    <Card width="" height="" padding="0" flexGrow="0" border="0px">
      <div class="groups-card-content">
        <h1>{{ dashboardData.groups_length }}</h1>
        <Row>
        <Tag primaryColor="#ff6384" secondaryColor="rgba(255, 99, 132, 0.2)"
          >{{ dashboardData.cate_1_length }}  食品販売</Tag
        >
        <Tag primaryColor="#36a2eb" secondaryColor="rgba(54, 162, 235, 0.2)"
          >{{ dashboardData.cate_2_length}}  物販販売</Tag
        >
        <Tag primaryColor="#ffce56" secondaryColor="rgba(255, 206, 86, 0.2)"
          >{{ dashboardData.cate_3_length }}  ステージ企画</Tag
        >
        <Tag primaryColor="#4bc0c0" secondaryColor="rgba(75, 192, 192, 0.2)"
          >{{ dashboardData.cate_4_length}}  展示・体験</Tag
        >
        <Tag primaryColor="#9966ff" secondaryColor="rgba(153, 102, 255, 0.2)"
          >{{ dashboardData.cate_5_length }}  研究室公開</Tag
          >
        <Tag primaryColor="#ff9f40" secondaryColor="rgba(255, 159, 64, 0.2)"
          >{{ dashboardData.cate_6_length }}  その他</Tag
        >
      </Row>
      </div>
      <hr />
    </Card>
  </template>
  <script>
  import axios from "axios";
  export default {
    watchQuery: ["page"],
    props: {
      dashboardData: {
        type: Object,
        required: false,
      },
    },
  };
  </script>
  <style>
  .groups-card-content {
    font-size: 60px;
    width: 400px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    flex-flow: column;
    gap: 20px;
  }
  </style>
  