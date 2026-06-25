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
        <h3>開催日</h3>
        <select v-model="fesDateId">
          <option disabled value="">選択してください</option>
          <option v-for="list in fesDatesList" :key="list.id" :value="list.id">
            {{ list.date }}
          </option>
        </select>
      </div>
      <div>
        <h3>第1希望ステージ</h3>
        <select v-model="stageFirst">
          <option disabled value="">選択してください</option>
          <option v-for="list in stageList" :key="list.id" :value="list.id">
            {{ list.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>第2希望ステージ</h3>
        <select v-model="stageSecond">
          <option disabled value="">選択してください</option>
          <option v-for="list in stageList" :key="list.id" :value="list.id">
            {{ list.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>使用時間</h3>
        <select v-model="useTimeInterval">
          <option disabled value="">選択してください</option>
          <option v-for="list in timeBox" :key="list" :value="list">
            {{ list }}
          </option>
        </select>
      </div>
      <div>
        <h3>準備時間</h3>
        <select v-model="prepareTimeInterval">
          <option disabled value="">選択してください</option>
          <option v-for="list in timeBox" :key="list" :value="list">
            {{ list }}
          </option>
        </select>
      </div>
      <div>
        <h3>片付け時間</h3>
        <select v-model="cleanupTimeInterval">
          <option disabled value="">選択してください</option>
          <option v-for="list in timeBox" :key="list" :value="list">
            {{ list }}
          </option>
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
    stageOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      isSunny: true,
      fesDateId: "",
      stageFirst: "",
      stageSecond: "",
      useTimeInterval: "",
      prepareTimeInterval: "",
      cleanupTimeInterval: "",
      fesDatesList: [],
      stageList: [],
      timeBox: [
        "5分", "10分", "15分", "20分", "25分", "30分", "35分", "40分", "45分", "50分",
        "55分", "60分", "65分", "70分", "75分", "80分", "90分", "95分", "100分",
        "105分", "110分", "115分", "120分"
      ]
    };
  },
  async mounted() {
    const fesDatesRes = await this.$axios.$get("/api/v1/get_current_fes_dates");
    this.fesDatesList = fesDatesRes.data;
    
    const stageRes = await this.$axios.$get("/stages");
    this.stageList = stageRes.data;
  },
  watch: {
    stageOrder: {
      immediate: true,
      handler() {
        const so = this.getStageOrder();
        this.groupId = so.group_id || this.$route.params.id;
        this.isSunny = so.is_sunny == null ? true : [true, 'true', 1, '1'].includes(so.is_sunny);
        this.fesDateId = so.fes_date_id || "";
        this.stageFirst = so.stage_first || "";
        this.stageSecond = so.stage_second || "";
        this.useTimeInterval = so.use_time_interval || "";
        this.prepareTimeInterval = so.prepare_time_interval || "";
        this.cleanupTimeInterval = so.cleanup_time_interval || "";
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
