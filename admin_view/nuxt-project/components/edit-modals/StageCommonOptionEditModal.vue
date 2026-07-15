<template>
  <EditModal @close="$emit('close')" title="ステージオプション申請の編集">
    <template v-slot:form>
      <div>
        <h3>自前音源</h3>
        <select v-model="ownEquipment">
          <option :value="true">〇</option>
          <option :value="false">×</option>
        </select>
      </div>
      <div>
        <h3>BGM使用</h3>
        <select v-model="bgm">
          <option :value="true">〇</option>
          <option :value="false">×</option>
        </select>
      </div>
      <div>
        <h3>撮影許可</h3>
        <select v-model="cameraPermission">
          <option :value="true">〇</option>
          <option :value="false">×</option>
        </select>
      </div>
      <div>
        <h3>大きな音</h3>
        <select v-model="loudSound">
          <option :value="true">〇</option>
          <option :value="false">×</option>
        </select>
      </div>
    </template>
    <template v-slot:method>
      <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
    </template>
  </EditModal>
</template>

<script>
export default {
  props: {
    stageCommonOption: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      ownEquipment: false,
      bgm: false,
      cameraPermission: false,
      loudSound: false,
    };
  },
  watch: {
    stageCommonOption: {
      immediate: true,
      handler() {
        const sco = this.getStageCommonOption();
        this.groupId = sco.group_id || this.$route.params.id;
        this.ownEquipment = sco.own_equipment ?? false;
        this.bgm = sco.bgm ?? false;
        this.cameraPermission = sco.camera_permission ?? false;
        this.loudSound = sco.loud_sound ?? false;
      },
    },
  },
  methods: {
    getStageCommonOption() {
      return (
        this.stageCommonOption?.stage_common_option ||
        this.stageCommonOption ||
        {}
      );
    },
    async edit() {
      const sco = this.getStageCommonOption();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        own_equipment: String(this.ownEquipment),
        bgm: String(this.bgm),
        camera_permission: String(this.cameraPermission),
        loud_sound: String(this.loudSound),
      };
      try {
        const response = sco.id
          ? await this.$axios.$put(`/stage_common_options/${sco.id}`, data)
          : await this.$axios.$post(`/stage_common_options`, data);
        const savedId = response?.data?.id;

        if (typeof savedId === "undefined") {
          console.error(
            "ステージオプションの保存レスポンスに id がありませんでした",
            response
          );
          this.$emit("error", "保存に失敗しました");
          return;
        }

        this.$emit("saved", savedId);
        this.$emit("close");
      } catch (error) {
        console.error("ステージオプションの編集に失敗しました", error);
        this.$emit(
          "error",
          error?.response?.data?.message ||
            error?.message ||
            "保存に失敗しました"
        );
      }
    },
  },
};
</script>
