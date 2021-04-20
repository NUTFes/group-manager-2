<template>
  <div>
    <div v-if="stage_common_option.length === 0">
      <NoData />
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <div class="card">
            <v-card-text>
              <div class="breadcrumbs">
                <ul>
                  <li>
                    <div class="breadcrumbs-item">
                      <router-link to="/stage_common_options"
                        >ステージオプション一覧</router-link
                      >
                    </div>
                  </li>
                  <li>
                    <div class="breadcrumbs-item">
                      {{ stage_common_option.id }}
                    </div>
                  </li>
                </ul>
              </div>
            </v-card-text>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card flat class="mx-15">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3"
                  >{{ group }}
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="edit_dialog_open"
                        fab
                      >
                        <v-icon class="ma-5">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>編集</span>
                  </v-tooltip>
                  <v-tooltip top v-if="selfRoleId == (1 || 2)">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        v-bind="attrs"
                        v-on="on"
                        @click="delete_dialog = true"
                        fab
                      >
                        <v-icon class="ma-5">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>削除</span>
                  </v-tooltip>
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>ID：</th>
                        <td class="caption">{{ stage_common_option.id }}</td>
                      </tr>
                      <tr>
                        <th>所持機器の使用：</th>
                        <td>
                          <v-chip
                            v-if="stage_common_option.own_equipment == true"
                            color="red"
                            text-color="white"
                            small
                            >使用</v-chip
                          >
                          <v-chip
                            v-if="stage_common_option.own_equipment == false"
                            color="blue"
                            text-color="white"
                            small
                            >使用しない</v-chip
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>音楽をかける：</th>
                        <td>
                          <v-chip
                            v-if="stage_common_option.bgm == true"
                            color="red"
                            text-color="white"
                            small
                            >使用</v-chip
                          >
                          <v-chip
                            v-if="stage_common_option.bgm == false"
                            color="blue"
                            text-color="white"
                            small
                            >使用しない</v-chip
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>撮影許可：</th>
                        <td>
                          <v-chip
                            v-if="
                              stage_common_option.camera_permission == true
                            "
                            color="red"
                            text-color="white"
                            small
                            >許可</v-chip
                          >
                          <v-chip
                            v-if="
                              stage_common_option.camera_permission == false
                            "
                            color="blue"
                            text-color="white"
                            small
                            >許可しない</v-chip
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>大きな音：</th>
                        <td>
                          <v-chip
                            v-if="stage_common_option.loud_sound == true"
                            color="red"
                            text-color="white"
                            small
                            >出す</v-chip
                          >
                          <v-chip
                            v-if="stage_common_option.loud_sound == false"
                            color="blue"
                            text-color="white"
                            small
                            >出さない</v-chip
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>ステージ内容：</th>
                        <td class="caption">
                          {{ stage_common_option.stage_content }}
                        </td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{
                            stage_common_option.created_at | format-date
                          }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{
                            stage_common_option.updated_at | format-date
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="card">
            <v-btn text color="white" to="/stage_common_options"
              ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
              <div class="back-button">ステージオプション一覧に戻る</div></v-btn
            >
          </div>
        </v-col>
      </v-row>

      <!-- 編集ダイアログ -->

      <v-dialog v-model="edit_dialog" width="500">
        <v-card>
          <v-card-title class="headline blue-grey darken-3">
            <div style="color: white">
              <v-icon class="ma-5" dark>mdi-pencil</v-icon>編集
            </div>
            <v-spacer></v-spacer>
            <v-btn text @click="edit_dialog = false" fab dark>
              ​ <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col>
                <v-form ref="form">
                  <v-select
                    label="参加団体"
                    v-model="group_id"
                    :items="groups"
                    item-text="name"
                    item-value="id"
                    outlined
                  />
                  <v-select
                    label="所持機器の使用"
                    v-model="own_equipment"
                    :items="enable_items"
                    item-text="label"
                    item-value="value"
                    outlined
                  />
                  <v-select
                    label="音楽をかける"
                    v-model="bgm"
                    :items="enable_items"
                    item-text="label"
                    item-value="value"
                    outlined
                  />
                  <v-select
                    label="撮影許可"
                    v-model="camera_permission"
                    :items="allow_items"
                    item-text="label"
                    item-value="value"
                    outlined
                  />
                  <v-select
                    label="大きな音"
                    v-model="loud_sound"
                    :items="sound_items"
                    item-text="label"
                    item-value="value"
                    outlined
                  />
                  <v-textarea
                    label="ステージ内容"
                    v-model="stage_content"
                    clearable
                    outlined
                    :rules="[rules.required]"
                  />
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed dark color="btn" @click="edit">
              編集する
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 削除ダイアログ -->
      <v-dialog v-model="delete_dialog" width="500">
        <v-card>
          <v-card-title class="headline blue-grey darken-3">
            <div style="color: white">
              <v-icon class="ma-5" dark>mdi-delete</v-icon>削除
            </div>
            <v-spacer></v-spacer>
            <v-btn text @click="delete_dialog = false" fab dark>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-title>
            削除してよろしいですか？
          </v-card-title>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed dark color="yes" @click="delete_yes">
              はい
            </v-btn>
            <v-btn depressed dark color="no" @click="delete_dialog = false">
              いいえ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 編集成功SnackBar -->
      <v-snackbar
        v-model="success_snackbar"
        color="blue-grey"
        top
        elevation="24"
      >
        編集しました

        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NoData from "../../components/NoData.vue";
import { mapState } from "vuex";
export default {
  components: {
    NoData
  },
  data() {
    return {
      id: [],
      stage_common_option: [],
      group: [],
      group_id: [],
      own_equipment: [],
      bgm: [],
      camera_permission: [],
      loud_sound: [],
      stage_content: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
      enable_items: [
        { label: "使用", value: true },
        { label: "使用しない", value: false }
      ],
      allow_items: [
        { label: "許可", value: true },
        { label: "許可しない", value: false }
      ],
      sound_items: [
        { label: "出す", value: true },
        { label: "出さない", value: false }
      ],
      rules: {
        required: value => !!value || "入力してください"
      }
    };
  },
  computed: {
    ...mapState({
      selfRoleId: state => state.users.role
    })
  },
  mounted() {
    this.$store.dispatch("users/getUser");
    this.$axios
      .get("/groups", {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.groups = response.data;
      });
    const url =
      "/api/v1/get_stage_common_options_with_group/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.data = response.data;
        this.stage_common_option = response.data.stage_common_option;
        this.id = response.data.stage_common_option.id;
        this.group = response.data.group;
        this.group_id = response.data.stage_common_option.group_id;
        this.own_equipment = response.data.stage_common_option.own_equipment;
        this.bgm = response.data.stage_common_option.bgm;
        this.loud_sound = response.data.stage_common_option.loud_sound;
        this.camera_permission =
          response.data.stage_common_option.camera_permission;
        this.stage_content = response.data.stage_common_option.stage_content;
        this.stage_common_option = response.data.stage_common_option;

        console.log(this.group);
      });
  },
  methods: {
    reload: function() {
      console.log("reload");
      const url =
        "/api/v1/get_stage_common_options_with_group/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.data = response.data;
          this.stage_common_option = response.data.stage_common_option;
          this.id = response.data.stage_common_option.id;
          this.group = response.data.group;
          this.group_id = response.data.stage_common_option.group_id;
          this.own_equipment = response.data.stage_common_option.own_equipment;
          this.bgm = response.data.stage_common_option.bgm;
          this.loud_sound = response.data.stage_common_option.loud_sound;
          this.camera_permission =
            response.data.stage_common_option.camera_permission;
          this.stage_content = response.data.stage_common_option.stage_content;
          this.stage_common_option = response.data.stage_common_option;
        });
    },
    edit_dialog_open: function() {
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url =
        "/stage_common_options/" +
        this.id +
        "?group_id=" +
        this.group_id +
        "&own_equipment=" +
        this.own_equipment +
        "&bgm=" +
        this.bgm +
        "&camera_permission=" +
        this.camera_permission +
        "&loud_sound=" +
        this.loud_sound +
        "&stage_content=" +
        this.stage_content;
      console.log(edit_url);
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          console.log(response);
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function() {
      const url = "/stage_common_options/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/stage_common_options");
    }
  }
};
</script>
