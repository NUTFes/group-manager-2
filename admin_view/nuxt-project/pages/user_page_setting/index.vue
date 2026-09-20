<template>
  <div class="main-content" v-if="this.$role(roleID).user_page_setting.read">
    <SubHeader pageTitle="ユーザー画面制御"></SubHeader>
    <Card width="100%">
      <VerticalTable v-if="settingId !== null">
        <!--代表者-->
        <tr>
          <th rowspan="1">代表者</th>
          <td>登録</td>
          <td>
            <p v-if="is_edit_user === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_user"
              :disabled="!!saving.is_edit_user"
              :on_click="() => saveToggle('is_edit_user')"
            />
          </td>
        </tr>
        <!--団体-->
        <tr>
          <th rowspan="2">団体</th>
          <td>登録</td>
          <td>
            <p v-if="is_regist_group === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <!-- roleのupdateがtrueになっているroleだけ，トグルボタンが表示される -->
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_regist_group"
              :disabled="!!saving.is_regist_group"
              :on_click="() => saveToggle('is_regist_group')"
            />
          </td>
        </tr>
        <tr>
          <td>編集・削除</td>
          <td>
            <p v-if="is_edit_group === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_group"
              :disabled="!!saving.is_edit_group"
              :on_click="() => saveToggle('is_edit_group')"
            />
          </td>
        </tr>
        <!--副代表-->
        <tr>
          <th rowspan="1">副代表</th>
          <td>登録・編集</td>
          <td>
            <p v-if="is_edit_sub_rep === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_sub_rep"
              :disabled="!!saving.is_edit_sub_rep"
              :on_click="() => saveToggle('is_edit_sub_rep')"
            />
          </td>
        </tr>
        <!--会場-->
        <tr>
          <th rowspan="1">会場</th>
          <td>登録・編集</td>
          <td>
            <p v-if="is_edit_place === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_place"
              :disabled="!!saving.is_edit_place"
              :on_click="() => saveToggle('is_edit_place')"
            />
          </td>
        </tr>
        <!--電力-->
        <tr>
          <th rowspan="2">電力</th>
          <td>登録</td>
          <td>
            <p v-if="add_power_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="add_power_order"
              :disabled="!!saving.add_power_order"
              :on_click="() => saveToggle('add_power_order')"
            />
          </td>
        </tr>
        <tr>
          <td>編集・削除</td>
          <td>
            <p v-if="is_edit_power_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_power_order"
              :disabled="!!saving.is_edit_power_order"
              :on_click="() => saveToggle('is_edit_power_order')"
            />
          </td>
        </tr>
        <!--物品-->
        <tr>
          <th rowspan="2">物品</th>
          <td>登録</td>
          <td>
            <p v-if="add_rental_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="add_rental_order"
              :disabled="!!saving.add_rental_order"
              :on_click="() => saveToggle('add_rental_order')"
            />
          </td>
        </tr>
        <tr>
          <td>編集・削除</td>
          <td>
            <p v-if="is_edit_rental_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_rental_order"
              :disabled="!!saving.is_edit_rental_order"
              :on_click="() => saveToggle('is_edit_rental_order')"
            />
          </td>
        </tr>
        <!--ステージ-->
        <tr>
          <th rowspan="2">ステージ</th>
          <td>登録</td>
          <td>
            <p v-if="add_stage_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="add_stage_order"
              :disabled="!!saving.add_stage_order"
              :on_click="() => saveToggle('add_stage_order')"
            />
          </td>
        </tr>
        <tr>
          <td>編集・削除</td>
          <td>
            <p v-if="is_edit_stage_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_stage_order"
              :disabled="!!saving.is_edit_stage_order"
              :on_click="() => saveToggle('is_edit_stage_order')"
            />
          </td>
        </tr>
        <!--ステージオプション-->
        <tr>
          <th rowspan="1">ステージオプション</th>
          <td>登録・編集</td>
          <td>
            <p v-if="is_edit_stage_common_option === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_stage_common_option"
              :disabled="!!saving.is_edit_stage_common_option"
              :on_click="() => saveToggle('is_edit_stage_common_option')"
            />
          </td>
        </tr>
        <!--従業員-->
        <tr>
          <th rowspan="2">従業員</th>
          <td>登録</td>
          <td>
            <p v-if="add_employee === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="add_employee"
              :disabled="!!saving.add_employee"
              :on_click="() => saveToggle('add_employee')"
            />
          </td>
        </tr>
        <tr>
          <td>編集・削除</td>
          <td>
            <p v-if="is_edit_employee === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_employee"
              :disabled="!!saving.is_edit_employee"
              :on_click="() => saveToggle('is_edit_employee')"
            />
          </td>
        </tr>
        <!--販売品-->
        <tr>
          <th rowspan="3">販売品</th>
        </tr>
        <tr>
          <td>登録</td>
          <td>
            <p v-if="add_food_product === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="add_food_product"
              :disabled="!!saving.add_food_product"
              :on_click="() => saveToggle('add_food_product')"
            />
          </td>
        </tr>
        <tr>
          <td>編集・削除</td>
          <td>
            <p v-if="is_edit_food_product === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_food_product"
              :disabled="!!saving.is_edit_food_product"
              :on_click="() => saveToggle('is_edit_food_product')"
            />
          </td>
        </tr>
        <!--購入品-->
        <tr>
          <th rowspan="2">購入品</th>
          <td>登録</td>
          <td>
            <p v-if="add_purchase_list === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="add_purchase_list"
              :disabled="!!saving.add_purchase_list"
              :on_click="() => saveToggle('add_purchase_list')"
            />
          </td>
        </tr>
        <tr>
          <td>編集・削除</td>
          <td>
            <p v-if="is_edit_purchase_list === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_purchase_list"
              :disabled="!!saving.is_edit_purchase_list"
              :on_click="() => saveToggle('is_edit_purchase_list')"
            />
          </td>
        </tr>
        <!--アナウンス文-->
        <tr>
          <th rowspan="1">アナウンス文</th>
          <td>登録・編集</td>
          <td>
            <p v-if="is_edit_announcement === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_announcement"
              :disabled="!!saving.is_edit_announcement"
              :on_click="() => saveToggle('is_edit_announcement')"
            />
          </td>
        </tr>
        <!--PR-->
        <tr>
          <th rowspan="1">PR</th>
          <td>登録・編集</td>
          <td>
            <p v-if="is_edit_public_relation === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_public_relation"
              :disabled="!!saving.is_edit_public_relation"
              :on_click="() => saveToggle('is_edit_public_relation')"
            />
          </td>
        </tr>
        <!--模擬店平面図-->
        <tr>
          <th rowspan="1">模擬店平面図</th>
          <td>登録・編集</td>
          <td>
            <p v-if="is_edit_venue_map === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_venue_map"
              :disabled="!!saving.is_edit_venue_map"
              :on_click="() => saveToggle('is_edit_venue_map')"
            />
          </td>
        </tr>
        <!--調理工程-->
        <tr>
          <th rowspan="1">調理工程</th>
          <td>登録・編集</td>
          <td>
            <p v-if="is_edit_cooking_process === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_cooking_process"
              :disabled="!!saving.is_edit_cooking_process"
              :on_click="() => saveToggle('is_edit_cooking_process')"
            />
          </td>
        </tr>
        <!--火気使用申請-->
        <tr>
          <th rowspan="2">火気使用申請</th>
          <td>登録</td>
          <td>
            <p v-if="add_fire_equipment_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="add_fire_equipment_order"
              :disabled="!!saving.add_fire_equipment_order"
              :on_click="() => saveToggle('add_fire_equipment_order')"
            />
          </td>
        </tr>
        <tr>
          <td>編集・削除</td>
          <td>
            <p v-if="is_edit_fire_equipment_order === true">募集中</p>
            <p v-else>募集締め切り</p>
          </td>
          <td>
            <SwitchButton
              v-if="this.$role(roleID).user_page_setting.update"
              :isOn="is_edit_fire_equipment_order"
              :disabled="!!saving.is_edit_fire_equipment_order"
              :on_click="() => saveToggle('is_edit_fire_equipment_order')"
            />
          </td>
        </tr>
        <!--開催年-->
        <tr>
          <td>現在の開催年</td>
          <td>
            <Row gap="0px">
              <span class="material-icons">expand_more</span>
              <select
                v-model.number="selectedFesYearId"
                :disabled="
                  !$role(roleID).user_page_setting.update ||
                  !!saving.fes_year_id ||
                  fes_year_list.length === 0
                "
                @change="saveYear"
              >
                <option
                  v-for="item in fes_year_list"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.year_num }}
                </option>
              </select>
            </Row>
            <small>選択すると現在の開催年がすぐに切り替わります。</small>
          </td>
        </tr>
      </VerticalTable>
      <p v-else>
        {{
          isLoading
            ? "設定を読み込み中です。"
            : "設定を読み込めませんでした。ページを再読み込みしてください。"
        }}
      </p>
    </Card>
    <v-snackbar v-model="snackbar" color="error" top :timeout="6000">
      {{ errorMessage }}
    </v-snackbar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";

const settingKeys = [
  "is_regist_group",
  "is_edit_group",
  "is_edit_user",
  "is_edit_sub_rep",
  "is_edit_place",
  "is_edit_power_order",
  "is_edit_rental_order",
  "is_edit_stage_order",
  "is_edit_stage_common_option",
  "is_edit_employee",
  "is_edit_food_product",
  "is_edit_purchase_list",
  "is_edit_announcement",
  "is_edit_public_relation",
  "is_edit_venue_map",
  "is_edit_cooking_process",
  "is_edit_fire_equipment_order",
  "add_fire_equipment_order",
  "add_power_order",
  "add_rental_order",
  "add_stage_order",
  "add_employee",
  "add_food_product",
  "add_purchase_list",
];

export default {
  data() {
    return {
      settingId: null,
      isLoading: true,
      saving: {},
      is_regist_group: false,
      is_edit_group: false,
      is_edit_user: false,
      is_edit_sub_rep: false,
      is_edit_place: false,
      is_edit_power_order: false,
      is_edit_rental_order: false,
      is_edit_stage_order: false,
      is_edit_stage_common_option: false,
      is_edit_employee: false,
      is_edit_food_product: false,
      is_edit_purchase_list: false,
      is_edit_announcement: false,
      is_edit_public_relation: false,
      is_edit_venue_map: false,
      is_edit_cooking_process: false,
      is_edit_fire_equipment_order: false,
      add_power_order: false,
      add_rental_order: false,
      add_stage_order: false,
      add_employee: false,
      add_food_product: false,
      add_purchase_list: false,
      add_announcement: false,
      add_fire_equipment_order: false,
      fes_year_id: null,
      selectedFesYearId: null,
      fes_year_list: [],
      snackbar: false,
      errorMessage: "",
    };
  },

  mounted() {
    window.addEventListener("scroll", this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(
        0,
        Number(localStorage.getItem("scrollPosition-" + this.$route.path)) || 0
      );
    });

    this.loadSettings();
    this.loadFesYears();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.saveScrollPosition);
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },
    async loadSettings() {
      try {
        const response = await this.$axios.get("/user_page_settings");
        const setting = response.data.data;
        if (!setting || !setting.id) throw new Error("Setting not found");

        settingKeys.forEach((key) => {
          this[key] = setting[key] === true;
        });
        this.settingId = setting.id;
        this.fes_year_id = setting.fes_year_id;
        this.selectedFesYearId = setting.fes_year_id;
      } catch (_) {
        this.errorMessage =
          "設定を読み込めませんでした。ページを再読み込みしてください。";
        this.snackbar = true;
      } finally {
        this.isLoading = false;
      }
    },
    async loadFesYears() {
      try {
        const response = await this.$axios.get("/fes_years");
        if (!Array.isArray(response.data.data))
          throw new Error("Years not found");
        this.fes_year_list = response.data.data;
      } catch (_) {
        this.errorMessage = "開催年一覧を読み込めませんでした。";
        this.snackbar = true;
      }
    },
    saveToggle(key) {
      this.saveSetting(key, !this[key]);
    },
    async saveYear() {
      if (this.selectedFesYearId === this.fes_year_id) return;
      await this.saveSetting("fes_year_id", this.selectedFesYearId);
      this.selectedFesYearId = this.fes_year_id;
    },
    async saveSetting(key, nextValue) {
      if (this.settingId === null || this.saving[key]) return;

      const previous = this[key];
      this.$set(this.saving, key, true);
      this[key] = nextValue;

      try {
        const response = await this.$axios.patch(
          `/user_page_settings/${this.settingId}`,
          { [key]: nextValue }
        );
        if (response.data.status.code !== 200) throw new Error("Save failed");
      } catch (_) {
        this[key] = previous;
        this.errorMessage =
          "変更を保存できませんでした。時間をおいて再度お試しください。";
        this.snackbar = true;
      } finally {
        this.$set(this.saving, key, false);
      }
    },
  },
};
</script>
