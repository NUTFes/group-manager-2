<template>
  <EditModal @close="$emit('close')" title="ステージ利用申請の編集">
    <template v-slot:form>
      <div>
        <h3>晴/雨</h3>
        <select v-model="isSunny">
          <option :value="true">晴</option>
          <option :value="false">雨</option>
        </select>
      </div>
      <div>
        <h3>開催日ID</h3>
        <input
          v-model="fesDateId"
          type="number"
          placeholder="入力してください"
        />
      </div>
      <div>
        <h3>第1希望ステージID</h3>
        <input
          v-model="stageFirst"
          type="number"
          placeholder="入力してください"
        />
      </div>
      <div>
        <h3>第2希望ステージID</h3>
        <input
          v-model="stageSecond"
          type="number"
          placeholder="入力してください"
        />
      </div>
      <div>
        <h3>使用時間</h3>
        <input v-model="useTimeInterval" placeholder="入力してください" />
      </div>
      <div>
        <h3>準備時間</h3>
        <input v-model="prepareTimeInterval" placeholder="入力してください" />
      </div>
      <div>
        <h3>片付け時間</h3>
        <input v-model="cleanupTimeInterval" placeholder="入力してください" />
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
    stageOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      isSunny: true,
      fesDateId: null,
      stageFirst: null,
      stageSecond: null,
      useTimeInterval: null,
      prepareTimeInterval: null,
      cleanupTimeInterval: null,
    };
  },
  watch: {
    stageOrder: {
      immediate: true,
      handler() {
        const so = this.getStageOrder();
        this.groupId = so.group_id || this.$route.params.id;
        this.isSunny = so.is_sunny ?? true;
        this.fesDateId = so.fes_date_id || null;
        this.stageFirst = so.stage_first || null;
        this.stageSecond = so.stage_second || null;
        this.useTimeInterval = so.use_time_interval || null;
        this.prepareTimeInterval = so.prepare_time_interval || null;
        this.cleanupTimeInterval = so.cleanup_time_interval || null;
      },
    },
  },
  methods: {
    getStageOrder() {
      return this.stageOrder?.stage_order || this.stageOrder || {};
    },
    async edit() {
      const so = this.getStageOrder();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        is_sunny: String(this.isSunny),
        fes_date_id: String(this.fesDateId ?? ""),
        stage_first: String(this.stageFirst ?? ""),
        stage_second: String(this.stageSecond ?? ""),
        use_time_interval: this.useTimeInterval ?? "",
        prepare_time_interval: this.prepareTimeInterval ?? "",
        cleanup_time_interval: this.cleanupTimeInterval ?? "",
      };
      const url = `/stage_orders/${so.id}`;

      await this.$axios.$put(url, data).then(() => {
        this.$emit("saved", so.id);
        this.$emit("close");
      });
    },
  },
};
</script>
