<template>
  <transition name="fade" appear>
    <div class="modal">
      <div class="modal__container" @click.self="$emit('close')">
        <div class="modal__box">
          <h2>参加団体の追加</h2>
          <div class="modal_content">
            <form>
              <div class="form-content">
                <h3>団体名</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>

              <div class="form-content">
                <h3>カテゴリー</h3>
                <select v-model="selectedCategory">
                  <option disabled value="" class="default-option">
                    選択してください
                  </option>
                  <option
                    v-for="year in year_list"
                    :key="year.id"
                    :value="year.year_num"
                  >
                    {{ year.year_num }}年
                  </option>
                </select>
              </div>
              <div class="form-content">
                <h3>企画名</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>活動内容</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>開催年</h3>
                <select v-model="selectedCategory">
                  <option disabled value="" class="default-option">
                    選択してください
                  </option>
                  <option v-for="year in list" :key="year" :value="year">
                    {{ year }}年
                  </option>
                </select>
              </div>
              <CommonButton :on_click="register"> 登録 </CommonButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import CommonButton from "~/components/CommonButton.vue";
import axios from "axios";
export default {
  components: {
    CommonButton,
  },
  data() {
    return {
      selectedCategory: "",
      user: [],
      user_detail: [],
      role: [],
      grade: [],
      department: [],
      student_id: [],
      tel: [],
      rate: [],
      groups_length: [],
      dashboard_data: [],
      // v-model とバインディングされる
      // select に入れる年を入れる配列
      list: [2015, 2016, 2017, 2018, 2019],
      options: [
        { text: "One", value: "A" },
        { text: "Two", value: "B" },
        { text: "Three", value: "C" },
      ],
    };
  },
  props: {
    showContent: {
      type: Boolean,
      required: false,
      default: false,
    },
    year_list: {
      type: Array,
      required: false,
      default: [],
    },
  },
  methods: {
    setData: function () {
      const url = "/api/v1/current_user/show";
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        })
        .then(
          (response) => {
            this.user = response.data.data;
          },
          (error) => {
            console.error(error);
            return error;
          }
        );
      this.$axios
        .get("/fes_years", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.year_list = response.data;
        });
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.groups = response.data;
        });
    },
    adjustHeight() {
      const textarea = this.$refs.activity;
      const resetHeight = new Promise(function (resolve) {
        resolve((textarea.style.height = "auto"));
      });
      resetHeight.then(function () {
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      let params = new URLSearchParams();
      params.append("user_id", this.user.id);
      params.append("name", this.groupName);
      params.append("project_name", this.projectName);
      params.append("activity", this.activity);
      params.append("group_category_id", this.groupCategoryId);
      params.append("fes_year_id", this.fesYearId);
      this.$axios.post("/groups", params).then((response) => {
        console.log(response);
        $emit("close");
        console.log("*****************************:");
        //this.reload();
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
      });
    },
  },
};
</script>

<style scoped>
input {
  color: var(--accent-2);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

input:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

select {
  color: var(--accent-0);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

select:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

h3 {
  font-size: 16px;
  font-weight: 300;
}

form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-flow: column;
  gap: 25px;
}

.form-content {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.default-option {
  color: red;
}

.modal {
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 11;
  background-color: rgba(51, 51, 51, 0.3);
}
.modal__container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__box {
  height: 80%;
  z-index: 15;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding: 50px 50px;
  color: #fff;
  background: radial-gradient(
    ellipse at top left,
    rgba(51, 51, 51, 0.9),
    rgba(51, 51, 51, 0.8)
  );
  backdrop-filter: blur(4px);
  gap: 30px;
}

.modal_content {
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-flow: column;
  gap: 20px;
}

.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
