<template>
  <EditModal @close="$emit('close')" title="アナウンス申請の編集">
    <template v-slot:form>
      <div>
        <h3>アナウンス内容</h3>
        <textarea v-model="message" placeholder="入力してください"></textarea>
      </div>
      <div>
        <h3>ステータス</h3>
        <input v-model="status" placeholder="入力してください" />
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
    announcement: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      message: null,
      status: null,
    };
  },
  watch: {
    announcement: {
      immediate: true,
      handler() {
        const ann = this.getAnnouncement();
        this.groupId = ann.group_id || this.$route.params.id;
        this.message = ann.message || null;
        this.status = ann.status || null;
      },
    },
  },
  methods: {
    getAnnouncement() {
      return this.announcement?.announcement || this.announcement || {};
    },
    async edit() {
      const ann = this.getAnnouncement();
      const params = new URLSearchParams({
        group_id: String(this.groupId ?? this.$route.params.id),
        message: this.message ?? "",
        status: this.status ?? "",
      });
      const url = `/announcements/${ann.id}?${params.toString()}`;

      await this.$axios.$put(url).then(() => {
        this.$emit("saved", ann.id);
        this.$emit("close");
      });
    },
  },
};
</script>
