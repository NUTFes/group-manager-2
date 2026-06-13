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
      return this.stageCommonOption?.stage_common_option || this.stageCommonOption || {};
    },
    async edit() {
      const sco = this.getStageCommonOption();
      const params = new URLSearchParams({
        group_id: String(this.groupId ?? this.$route.params.id),
        own_equipment: String(this.ownEquipment),
        bgm: String(this.bgm),
        camera_permission: String(this.cameraPermission),
        loud_sound: String(this.loudSound),
      });
      const url = `/stage_common_options/${sco.id}?${params.toString()}`;

      await this.$axios.$put(url).then((response) => {
        this.$emit("saved", response.data.id);
        this.$emit("close");
      });
    },
  },
};
</script>
