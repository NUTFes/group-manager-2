<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="group.group.name" pageSubTitle="参加団体申請一覧">
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="delete"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px"gap="20px">
      <Row justify="start">
      <h4>基本情報</h4>
      </Row>
      <table class="vertical-table">
        <thead>
          <th v-for="header in headers">
            {{ header }}
          </th>
        </thead>
        <tbody>
          <tr>
            <td>{{group.group.id}}</td>
            <td>{{group.user.name}}</td>
            <td>{{group.group.name}}</td>
            <td>{{group.group.project_name}}</td>
            <td>{{group.group.activity}}</td>
            <td>{{group.group_category}}</td>
            <td>{{group.fes_year}}</td>
            <td>{{group.group.created_at | formatDate}}</td>
            <td>{{group.group.updated_at | formatDate}}</td>
          </tr>
        </tbody>
      </table>
    </Card>
    </Row>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import moment from "moment";

export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "ユーザー",
        "団体名",
        "企画名",
        "活動内容",
        "カテゴリー",
        "開催年",
        "登録日時",
        "編集日時"
      ],
      data: [],
      detail_data: [],
      group: [],
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/groups/", "");
    const url = "/api/v1/get_group_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      group: response.data,
      route: url,
    };
  },
};
</script>
