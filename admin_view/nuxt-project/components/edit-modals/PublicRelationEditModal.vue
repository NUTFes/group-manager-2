<template>
  <EditModal @close="$emit('close')" title="PR申請の編集">
    <template v-slot:form>
      <div>
        <h3>PR文</h3>
        <input v-model="blurb" placeholder="入力してください" />
      </div>
      <div>
        <h3>画像パス</h3>
        <input v-model="picturePath" placeholder="入力してください" />
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
    publicRelation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      blurb: null,
      picturePath: null,
    };
  },
  watch: {
    publicRelation: {
      immediate: true,
      handler() {
        const pr = this.getPublicRelation();
        this.groupId = pr.group_id || this.$route.params.id;
        this.blurb = pr.blurb || null;
        this.picturePath = pr.picture_path || null;
      },
    },
  },
  methods: {
    getPublicRelation() {
      return this.publicRelation?.public_relation || this.publicRelation || {};
    },
    async edit() {
      const pr = this.getPublicRelation();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        blurb: this.blurb ?? "",
        picture_path: this.picturePath ?? "",
      };
      const response = pr.id
        ? await this.$axios.$put(`/public_relations/${pr.id}`, data)
        : await this.$axios.$post(`/public_relations`, data);

      this.$emit("saved", response.data.id);
      this.$emit("close");
    },
  },
};
</script>
