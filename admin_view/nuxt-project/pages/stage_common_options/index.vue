<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-text-to-speech</v-icon>ステージオプション申請一覧
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            to="/stage_common_options/print"
                            >
                            <v-icon dark>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>印刷する</span>
                </v-tooltip>
              </v-card-title>
              <hr class="mt-n3">
              <template>
                <div class="text-center" v-if="stage_common_options.length === 0">
                  <br><br>
                  <v-progress-circular
                    indeterminate
                    color="#009688"
                    ></v-progress-circular>
                  <br><br>
                </div>
                <div v-else>
                <v-data-table
                  :headers="headers"
                  :items="stage_common_options"
                  class="elevation-0 my-9"
                  @click:row="
                               (data) =>
                               $router.push({ path: `/stage_common_options/${data.stage_common_option.id}`})
                               "
                  >
                  <template v-slot:item.stage_common_option.own_equipment="{ item }">
                    <v-chip v-if="item.stage_common_option.own_equipment == true" color="red" text-color="white" small>使用</v-chip>
                    <v-chip v-if="item.stage_common_option.own_equipment == false" color="blue" text-color="white" small>使用しない</v-chip>
                  </template>
                  <template v-slot:item.stage_common_option.bgm="{ item }">
                    <v-chip v-if="item.stage_common_option.bgm == true" color="red" text-color="white" small>使用</v-chip>
                    <v-chip v-if="item.stage_common_option.bgm == false" color="blue" text-color="white" small>使用しない</v-chip>
                  </template>
                  <template v-slot:item.stage_common_option.camera_permission="{ item }">
                    <v-chip v-if="item.stage_common_option.camera_permission == true" color="red" text-color="white" small>許可</v-chip>
                    <v-chip v-if="item.stage_common_option.camera_permission == false" color="blue" text-color="white" small>許可しない</v-chip>
                  </template>
                  <template v-slot:item.stage_common_option.loud_sound="{ item }">
                    <v-chip v-if="item.stage_common_option.loud_sound == true" color="red" text-color="white" small>出す</v-chip>
                    <v-chip v-if="item.stage_common_option.loud_sound == false" color="blue" text-color="white" small>出さない</v-chip>
                  </template>
                  <template v-slot:item.stage_common_option.created_at="{ item }">
                    {{ item.stage_common_option.created_at | format-date }}
                  </template>
                  <template v-slot:item.stage_common_option.updated_at="{ item }">
                    {{ item.stage_common_option.updated_at | format-date }}
                  </template>
                </v-data-table>                      
                </div>
              </template>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stage_common_options: [],
      headers:[
        { text: 'ID', value: 'stage_common_option.id' },
        { text: '参加団体', value: 'group' },
        { text: '所持機器の使用', value: 'stage_common_option.own_equipment' },
        { text: '音楽をかける', value: 'stage_common_option.bgm' },
        { text: '撮影許可', value: 'stage_common_option.camera_permission' },
        { text: '大きな音', value: 'stage_common_option.loud_sound' },
        { text: '日時', value: 'stage_common_option.created_at' },
        { text: '編集日時', value: 'stage_common_option.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('api/v1/get_stage_common_options_with_group', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.stage_common_options = response.data
      })
  },
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
