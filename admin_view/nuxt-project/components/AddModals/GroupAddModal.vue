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
                <input
                  placeholder="入力してください"
                  :value="searchText"
                  @input="$emit('searchText', searchText)"
                />
              </div>
              <div class="form-content">
                <h3>カテゴリー</h3>
                <select v-model="groupCategoryId">
                  <option disabled value="" class="default-option">
                    選択してください
                  </option>
                  <option
                    v-for="category in groupCategories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.id }}
                  </option>
                </select>
              </div>
              <div class="form-content">
                <h3>企画名</h3>
                <input v-model="projectName" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>活動内容</h3>
                <input v-model="activity" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>開催年</h3>
                <select v-model="fesYearId">
                  <option disabled value="" class="default-option">
                    選択してください
                  </option>
                  <option
                    v-for="year in year_list"
                    :key="year.id"
                    :value="year.id"
                  >
                    {{ year.id }}
                  </option>
                </select>
              </div>
            </form>
          </div>
          <CommonButton iconName="add_circle" :on_click="submitGroup"
            >登録</CommonButton
          >
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
      groupName: [],
      projectName: [],
      activity: [],
      groupCategoryId: [],
      fesYearId: [],
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
    groupCategories: {
      type: Array,
      required: false,
      default: [],
    },
    submitGroup: {
      type: Function,
      required: false,
    },
    searchText: {
      type: String,
      required: false,
    },
  },
  mounted() {
      console.log("aaaaaaaaaaaaa");
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
  flex-flow: column;
  gap: 20px;
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
