<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color: #eceff1; font-size: 30px">
        <v-icon class="pr-3" size="35">mdi-microphone-plus</v-icon
        ><b>ステージオプション申請情報を修正する</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <v-form ref="form">
              <v-select
                label="所持機器の使用"
                ref="ownEquipment"
                v-model="ownEquipment"
                :items="this.itemsAvailable"
                :menu-props="{
                  top: true,
                  offsetY: true,
                }"
                item-text="label"
                item-value="value"
                text
                outlined
              ></v-select>
              <v-select
                label="音楽"
                ref="Bgm"
                v-model="Bgm"
                :items="this.itemsAvailable"
                :menu-props="{
                  top: true,
                  offsetY: true,
                }"
                item-text="label"
                item-value="value"
                text
                outlined
              ></v-select>
              <v-select
                label="撮影許可"
                ref="cameraPermission"
                v-model="cameraPermission"
                :items="this.photoAvailable"
                :menu-props="{
                  top: true,
                  offsetY: true,
                }"
                item-text="label"
                item-value="value"
                text
                outlined
              ></v-select>
              <v-select
                label="騒音"
                ref="loudSound"
                v-model="loudSound"
                :items="this.loudAble"
                :menu-props="{
                  top: true,
                  offsetY: true,
                }"
                item-text="label"
                item-value="value"
                text
                outlined
              ></v-select>
              <v-textarea
                class="body-1"
                label="ステージ内容"
                v-model="stageContent"
                background-color="white"
                outlined
                clearable
              >
              </v-textarea>
            </v-form>
            <br />
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
        <v-row>
          <v-col cols="4"></v-col>
          <v-col cols="4">
            <v-btn color="blue darken-1" large block dark @click="edit"
              >編集する</v-btn
            >
          </v-col>
          <v-col cols="4"></v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: {
    id: Number,
    groupId: Number,
    ownEquipment: String,
    Bgm: String,
    cameraPermission: String,
    loudSound: String,
    stageContent: String,
  },
  data() {
    return {
      isDisplay: false,
      groups: [],
      itemsAvailable: [
        { label: "使用", value: true },
        { label: "使用しない", value: false },
      ],
      photoAvailable: [
        { label: "許可", value: true },
        { label: "許可しない", value: false },
      ],
      loudAble: [
        { label: "出す", value: true },
        { label: "出さない", value: false },
      ],
    };
  },
  computed: {
    form() {
      return {};
    },
  },
  methods: {
    adjustHeight() {
      const textarea = this.$refs.activity;
      const resetHeight = new Promise(function (resolve) {
        resolve((textarea.style.height = "auto"));
      });
      resetHeight.then(function () {
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    cancel: function () {
      this.$refs.form.reset();
    },
    edit: function () {
      if (!this.$refs.form.validate()) return;

      const url =
        process.env.VUE_APP_URL + "/stage_common_options" + "/" + this.id + "?group_id=" + this.groupId + "&own_equipment=" + this.ownEquipment + "&bgm=" + this.Bgm + "&camera_permission=" + this.cameraPermission + "&loud_sound=" + this.loudSound + "&stage_content=" + this.stageContent;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.put(url).then(
        (response) => {
          this.isDisplay = false;
          this.$emit("openEmployeeSnackbar");
          this.$emit("reload");
        },
        (error) => {
          return error;
        }
      );
    },
  },
  mounted() {
    const groupUrl = process.env.VUE_APP_URL + "/groups";
    axios
      .get(groupUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(
        (response) => {
          this.groups = response.data;
        },
        (error) => {
          return error;
        }
      );
  },
};
</script>
