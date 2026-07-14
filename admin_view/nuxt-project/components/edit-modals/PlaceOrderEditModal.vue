<template>
  <EditModal @close="$emit('close')" title="会場申請の編集">
    <template v-slot:form>
      <div>
        <h3>第1希望</h3>
        <select v-model="first">
          <option disabled value="">選択してください</option>
          <option v-for="place in placeList" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>第2希望</h3>
        <select v-model="second">
          <option disabled value="">選択してください</option>
          <option v-for="place in placeList" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>第3希望</h3>
        <select v-model="third">
          <option disabled value="">選択してください</option>
          <option v-for="place in placeList" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>備考</h3>
        <input v-model="remark" placeholder="入力してください" />
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
    placeOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      first: "",
      second: "",
      third: "",
      remark: "",
      placeList: [],
    };
  },
  async mounted() {
    const res = await this.$axios.$get("/places");
    this.placeList = res.data;
  },
  watch: {
    placeOrder: {
      immediate: true,
      handler() {
        const po = this.getPlaceOrder();
        this.groupId = po.group_id || this.$route.params.id;
        this.first = po.first || "";
        this.second = po.second || "";
        this.third = po.third || "";
        this.remark = po.remark || "";
      },
    },
  },
  methods: {
    getPlaceOrder() {
      return (
        this.placeOrder?.place_order?.place_order ||
        this.placeOrder?.place_order ||
        this.placeOrder ||
        {}
      );
    },
    async edit() {
      const po = this.getPlaceOrder();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        first: String(this.first ?? ""),
        second: String(this.second ?? ""),
        third: String(this.third ?? ""),
        remark: this.remark ?? "",
      };
      try {
        const response = po.id
          ? await this.$axios.$put(`/place_orders/${po.id}`, data)
          : await this.$axios.$post(`/place_orders`, data);
        const savedId = response?.data?.id;

        if (typeof savedId === "undefined") {
          console.error("会場申請の保存レスポンスに id がありませんでした", response);
          this.$emit("error", "保存に失敗しました");
          return;
        }

        this.$emit("saved", savedId);
        this.$emit("close");
      } catch (error) {
        console.error("会場申請の編集に失敗しました", error);
        this.$emit("error", error?.response?.data?.message || error?.message || "保存に失敗しました");
      }
    },
  },
};
</script>
