<template>
  <v-container class="justify-content-center">
    <v-row>
      <v-col cols=12>
        <v-form ref="form">
          <v-select
            label="物品"
            ref="rentalItem"
            v-model="item"
            :items="itemList"
            :rules="rules.required"
            item-text="name"
            item-value="id"
            text
            outlined
           />
          <v-text-field
            label="数"
            ref="rentalNum"
            v-model="itemNum"
            :rules="rules.required"
            type="number"
            text
            outlined
          />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  props: { groupId: Number },
  data() {
    return {
      itemCategories: [
        { id: 1, name: "机"},
        { id: 2, name: "長机"},
        { id: 3, name: "木の椅子"},
        { id: 4, name: "パイプ椅子"},
        { id: 5, name: "パーテーション"},
        { id: 6, name: "掲示板"},
        { id: 7, name: "暗幕"},
        { id: 8, name: "マイク"},
        { id: 9, name: "椅子"},
        { id: 10, name: "テント"},
        { id: 11, name: "パーテーション足"},
      ],
      itemList: [],
      itemAllowList: [],
      groupCategoryId: localStorage.getItem("group_category_id"),
      rules: {
        required: value => !!value || "入力してください"
      },
      valid: false
    }
  },
  computed: {
    form() {
      return {
        item: "",
        itemNum: ""
      }
    }
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        return false;
      }
      valid = false;
      return true;
    },
    submit() {
      axios.defaults.headers.common["Content-Type"] = "application/json";
      const url = process.env.VUE_APP_URL + "/rental_orders";
      var params = new URLSearchParams();
      params.append("group_id", this.groupId);
      params.append("rental_item_id", this.item);
      params.append("num", this.itemNum);
      console.log(params);

      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.post(url, params).then(
        response => {
          console.log("副代表登録");
          console.log(response)
        },
        error => {
          return error;
        }
      );
    }
  },
  mounted() {
    const allowListUrl = process.env.VUE_APP_URL + '/rental_item_allow_lists';
    axios.get(allowListUrl, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid")
      }
    })
    .then(
      response => {
        for(let i=0; i<response.data.length; i++){
          this.itemAllowList.push(response.data[i])
          if (response.data[i].group_category_id == this.groupCategoryId) {
            this.itemList.push(this.itemCategories[response.data[i].rental_item_id - 1]);
            console.log(response.data[i].rental_item_id)
          }
        }
        console.log(this.itemList)
      }, error => {
        console.error(error)
      }
    )
  }
}
</script>