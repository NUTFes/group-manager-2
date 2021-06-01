<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="font-weight-bold subtitle-2">
            <v-icon class="pr-2">mdi-microphone-plus</v-icon>
            <b>ステージオプション申請情報</b>
            <v-spacer />
              <v-btn
                  x-small
                  text
                  fab
                  @click="openStageOptionDisplay">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
          </v-card-title>
          <hr>

          <v-list class="subtitle-2">
            <v-list-item>
              <v-list-item-content>所持機器の使用</v-list-item-content>
              <v-list-item-content v-if="regist.stage_common_option.own_equipment == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else-if="regist.stage_common_option.own_equipment === true">使用</v-list-item-content>
              <v-list-item-content v-else>使用しない</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>音楽</v-list-item-content>
              <v-list-item-content v-if="regist.stage_common_option.bgm == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else-if="regist.stage_common_option.bgm === true">使用</v-list-item-content>
              <v-list-item-content v-else>使用しない</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>撮影許可</v-list-item-content>
              <v-list-item-content v-if="regist.stage_common_option.camera_permission == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else-if="regist.stage_common_option.camera_permission === true">許可</v-list-item-content>
              <v-list-item-content v-else>許可しない</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>騒音</v-list-item-content>
              <v-list-item-content v-if="regist.stage_common_option.loud_sound == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else-if="regist.stage_common_option.loud_sound === true">出す</v-list-item-content>
              <v-list-item-content v-else>出さない</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>ステージ内容</v-list-item-content>
              <v-list-item-content v-if="regist.stage_common_option.stage_content == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ regist.stage_common_option.stage_content }}</v-list-item-content>
            </v-list-item>
          </v-list>

        </v-card>
      </v-col>
    </v-row>

    <!--EditModal-->
    <StageOption ref="StageOptionDlg"
                 :id = "regist.stage_common_option.id"
                 :groupId = "regist.stage_common_option.group_id"
                 :ownEquipment = "regist.stage_common_option.own_equipment"
                 :Bgm = "regist.stage_common_option.bgm"
                 :cameraPermission = "regist.stage_common_option.camera_permission"
                 :loudSound = "regist.stage_common_option.loud_sound"
                 :stageContent = "regist.stage_common_option.stage_content"
                 @reload="reload"
                 @openStageOptionSnackbar="openStageOptionSnackbar">
    </StageOption>

    <!--Editsnackbar-->
    <v-snackbar
        top
        text
        color="purple accent-2"
        v-model="StageOptionSnackbar">
      ステージオプション情報を更新しました
    </v-snackbar>

  </v-container>
</template>

<script>
import StageOption from '@/components/Mobile/EditModal/StageCommonOption.vue'

export default {
  props: {
    num: String,
    regist: String,
  },
  components: {
    StageOption,
    StageOptionSnackbar: false,
  },
  data(){
    return{
      data: [
        localStorage.getItem('access-token'),
        localStorage.getItem('client'),
        localStorage.getItem('uid')
      ], 
    }
  },
  methods:{
    openStageOptionDisplay(id, group_id, own_equipment, bgm, camera_permission, loud_sound, stage_content) {
      this.stage_option_id = id
      this.group_id = group_id
      this.own_equipment = own_equipment
      this.bgm = bgm
      this.camera_permission = camera_permission
      this.loud_sound = loud_sound
      this.stage_content = stage_content
      this.$refs.StageOptionDlg.isDisplay = true
    },
    openStageOptionSnackbar(){
      this.StageOptionSnackbar = true
    },
    reload() {
      this.$emit('reload');
    },
  },
}
</script>

