<template>
  <div>
    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-text-to-speech</v-icon
                >ステージオプション申請一覧
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="dialog = true"
                    >
                      <v-icon dark>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>ステージオプション申請の追加</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="reload"
                    >
                      <v-icon dark>mdi-reload</v-icon>
                    </v-btn>
                  </template>
                  <span>更新する</span>
                </v-tooltip>
              </v-card-title>

              <v-dialog v-model="dialog" max-width="500">
                <v-card>
                  <v-card-title class="headline blue-grey darken-3">
                    <div style="color: white">
                      <v-icon class="ma-2" dark>mdi-text-to-speech</v-icon
                      >ステージオプション申請の追加
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false" fab dark>
                      ​ <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-form ref="form">
                          <v-select
                            label="参加団体名"
                            v-model="Group"
                            :items="groups"
                            :menu-props="{
                              top: true,
                              offsetY: true,
                            }"
                            item-text="name"
                            item-value="id"
                            outlined
                          ></v-select>
                          <v-select
                            label="所持機器の使用"
                            v-model="ownEquipment"
                            :items="items_available"
                            :menu-props="{ top: true, offsetY: true }"
                            item-text="label"
                            item-value="value"
                            background-color="white"
                            outlined
                            clearable
                          >
                          </v-select>
                          <v-select
                            label="音楽"
                            v-model="Bgm"
                            :items="items_available"
                            item-text="label"
                            item-value="value"
                            background-color="white"
                            outlined
                            clearable
                          >
                          </v-select>
                          <v-select
                            label="撮影許可"
                            v-model="cameraPermission"
                            :items="photo_available"
                            item-text="label"
                            item-value="value"
                            background-color="white"
                            outlined
                            clearable
                          >
                          </v-select>
                          <v-select
                            label="騒音"
                            v-model="loudSound"
                            :items="loud_able"
                            item-text="label"
                            item-value="value"
                            background-color="white"
                            outlined
                            clearable
                          >
                          </v-select>
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
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      depressed
                      dark
                      color="btn"
                      @click="register()"
                    >登録
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <hr class="mt-n3" />
              <template>
                <div
                  class="text-center"
                  v-if="stage_common_options.length === 0"
                >
                  <br /><br />
                  <v-progress-circular
                    indeterminate
                    color="#009688"
                  ></v-progress-circular>
                  <br /><br />
                </div>
                <div v-else>
                  <v-data-table
                    :headers="headers"
                    :items="stage_common_options"
                    class="elevation-0 my-9"
                    @click:row="
                      (data) =>
                        $router.push({
                          path: `/stage_common_options/${data.stage_common_option.id}`,
                        })
                    "
                  >
                    <template
                      v-slot:item.stage_common_option.own_equipment="{ item }"
                    >
                      <v-chip
                        v-if="item.stage_common_option.own_equipment == true"
                        color="red"
                        text-color="white"
                        small
                        >使用</v-chip
                      >
                      <v-chip
                        v-if="item.stage_common_option.own_equipment == false"
                        color="blue"
                        text-color="white"
                        small
                        >使用しない</v-chip
                      >
                    </template>
                    <template v-slot:item.stage_common_option.bgm="{ item }">
                      <v-chip
                        v-if="item.stage_common_option.bgm == true"
                        color="red"
                        text-color="white"
                        small
                        >使用</v-chip
                      >
                      <v-chip
                        v-if="item.stage_common_option.bgm == false"
                        color="blue"
                        text-color="white"
                        small
                        >使用しない</v-chip
                      >
                    </template>
                    <template
                      v-slot:item.stage_common_option.camera_permission="{
                        item,
                      }"
                    >
                      <v-chip
                        v-if="
                          item.stage_common_option.camera_permission == true
                        "
                        color="red"
                        text-color="white"
                        small
                        >許可</v-chip
                      >
                      <v-chip
                        v-if="
                          item.stage_common_option.camera_permission == false
                        "
                        color="blue"
                        text-color="white"
                        small
                        >許可しない</v-chip
                      >
                    </template>
                    <template
                      v-slot:item.stage_common_option.loud_sound="{ item }"
                    >
                      <v-chip
                        v-if="item.stage_common_option.loud_sound == true"
                        color="red"
                        text-color="white"
                        small
                        >出す</v-chip
                      >
                      <v-chip
                        v-if="item.stage_common_option.loud_sound == false"
                        color="blue"
                        text-color="white"
                        small
                        >出さない</v-chip
                      >
                    </template>
                    <template
                      v-slot:item.stage_common_option.created_at="{ item }"
                    >
                      {{
                        item.stage_common_option.created_at | format-date
                      }}
                    </template>
                    <template
                      v-slot:item.stage_common_option.updated_at="{ item }"
                    >
                      {{
                        item.stage_common_option.updated_at | format-date
                      }}
                    </template>
                  </v-data-table>
                </div>
              </template>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || "入力してください",
      },
      stage_common_options: [],
      groups: [],
      dialog: false,
      Group: [],
      ownEquipment: [],
      Bgm: [],
      cameraPermission: [],
      loudSound: [],
      stageContent: [],
      headers: [
        { text: "ID", value: "stage_common_option.id" },
        { text: "参加団体", value: "group" },
        { text: "所持機器の使用", value: "stage_common_option.own_equipment" },
        { text: "音楽をかける", value: "stage_common_option.bgm" },
        { text: "撮影許可", value: "stage_common_option.camera_permission" },
        { text: "大きな音", value: "stage_common_option.loud_sound" },
        { text: "日時", value: "stage_common_option.created_at" },
        { text: "編集日時", value: "stage_common_option.updated_at" },
      ],
      items_available:[
        {label:"使用",value:true},
        {label:"不使用",value:false}
      ],
      photo_available:[
        {label:"許可",value:true},
        {label:"禁止",value:false}
      ],
      loud_able:[
        {label:"出す",value:true},
        {label:"出さない",value:false}
      ],
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/get_stage_common_options_with_group", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stage_common_options = response.data;
        this.ownEquipment = stage_common_options.own_equipment;
        console.log(response.data)

      });
    this.$axios.get('/groups', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.groups = response.data
      })
  },

  methods: {
    reload: function () {
      this.$axios
        .get("/api/v1/get_stage_common_options_with_group", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stage_common_options = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("own_equipment", this.ownEquipment);
      params.append("bgm", this.Bgm);
      params.append("camera_permission", this.cameraPermission);
      params.append("loud_sound", this.loudSound);
      params.append("stage_content", this.stageContent);
      this.$axios.post("/stage_common_options", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.ownEquipment = "";
        this.Bgm = "";
        this.cameraPermission = "";
        this.loudSound = "";
        this.stageContent = "";
      });
    },
  }
};
</script>
