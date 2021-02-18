<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
        <v-card-text>
          <div class="breadcrumbs">
            <ul>
              <li><div class="breadcrumbs-item"><router-link to="/stage_common_options">ステージオプション一覧</router-link></div></li>
              <li><div class="breadcrumbs-item">{{ stage_common_option.id }}</div></li>
            </ul>
          </div>
        </v-card-text>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10"> 
              <v-card-title class="font-weight-bold mt-3">
                {{ stage_common_option.group_id }}
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
              </v-card-title>
              <hr class="mt-n3">
              <v-simple-table class="my-9">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th>ID：</th>
                      <td class="caption">{{ stage_common_option.id }}</td>
                    </tr>
                    <tr>
                      <th>所持機器の仕様：</th>
                      <td>
                    <v-chip v-if="stage_common_option.own_equipment == true" color="red" text-color="white" small>使用</v-chip>
                    <v-chip v-if="stage_common_option.own_equipment == false" color="blue" text-color="white" small>使用しない</v-chip>
                      </td>
                    </tr>
                    <tr>
                      <th>音楽をかける：</th>
                      <td>
                    <v-chip v-if="stage_common_option.bgm == true" color="red" text-color="white" small>使用</v-chip>
                    <v-chip v-if="stage_common_option.bgm == false" color="blue" text-color="white" small>使用しない</v-chip>
                      </td>
                    </tr>
                    <tr>
                      <th>撮影許可：</th>
                      <td>
                    <v-chip v-if="stage_common_option.camera_permission == true" color="red" text-color="white" small>許可</v-chip>
                    <v-chip v-if="stage_common_option.camera_permission == false" color="blue" text-color="white" small>許可しない</v-chip>
                      </td>
                    </tr>
                    <tr>
                      <th>大きな音：</th>
                      <td>
                    <v-chip v-if="stage_common_option.loud_sound == true" color="red" text-color="white" small>出す</v-chip>
                    <v-chip v-if="stage_common_option.loud_sound == false" color="blue" text-color="white" small>出さない</v-chip>
                      </td>
                    </tr>
                    <tr>
                      <th>ステージ内容：</th>
                      <td class="caption">{{ stage_common_option.stage_content }}</td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">{{ stage_common_option.created_at | format-date }}</td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">{{ stage_common_option.updated_at | format-date }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
        <v-btn text color="white" to="/stage_common_options"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div style="color:#333333">ステージオプション一覧に戻る</div></v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- modal window to edit -->
    <v-dialog
      v-model="dialog"
      width="1200"
      >
      <v-card>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <v-card-title class="font-weight-bold"><v-icon class="pa-2">mdi-pencil</v-icon>登録情報の編集</v-card-title>
            <v-text-field
              label="氏名"
              background-color="white"
              outlined
              v-model="student_id"
              filled
              clearable
              ></v-text-field>
            <v-select
              label="権限"
              ref="groupCategory"
              v-model="groupCategoryId"
              :menu-props="{
                             top: true,
                             offsetY: true,
                             }"
              item-text="name"
              item-value="id"
              outlined
              ></v-select>
            <v-text-field
              label="学籍番号８桁"
              background-color="white"
              outlined
              v-model="student_id"
              counter="8"
              filled
              clearable
              ></v-text-field>
            <v-text-field
              label="課程（専攻）"
              background-color="white"
              outlined
              v-model="student_id"
              filled
              clearable
              ></v-text-field>
            <v-text-field
              label="団体"
              background-color="white"
              outlined
              v-model="student_id"
              filled
              clearable
              ></v-text-field>
            <v-text-field
              label="電話番号"
              background-color="white"
              outlined
              v-model="student_id"
              filled
              clearable
              ></v-text-field>
            <v-btn color="blue darken-1" block dark @click="submit">登録</v-btn>
            <v-btn color="blue darken-1" text block @click="cancel">リセット</v-btn>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      stage_common_option: [],
      expand: false,
      dialog: false,
    }
  },
  mounted() {
    const url = "/stage_common_options/" + this.$route.params.id;
    this.$axios.get(url, {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.stage_common_option = response.data
      })
  }
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
