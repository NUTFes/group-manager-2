<template>
  <div> 
      <v-row>
        <v-col>
          <v-card flat class="mx-15">
            <v-row>
              <v-col cols=1></v-col>
              <v-col cols=10>
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon class="mr-5">mdi-cube</v-icon>
                  物品割り当て
                </v-card-title>
              <hr class="mt-n3">
              <v-card-text>
                STEP1．在庫場所を選択<br>
                STEP2．在庫場所ごとに在庫登録<br>
                STEP3．在庫場所ごとに在庫登録を確認して参加団体に物品を割り当て<br>
                ステータス（未着手/入力中/完了）を随時変更してください
              </v-card-text>
              </v-col>
              <v-col cols=1></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    <div class="text-center" v-if="stocker_places.length === 0">
      <br><br>
      <v-progress-circular
        indeterminate
        color="#009688"
        ></v-progress-circular>
      <br><br>
    </div>
    <div v-else class="mx-15">
      <v-row justify="center">
        <v-col v-for="stocker_place in stocker_places">
          <v-hover v-slot:default="{ hover }">
            <v-card 
                   min-width = 250
                   max-width = 350
                          :elevation="hover ? 6 : 2"
                          :class="{ 'on-hover': hover  }"
                          :to="{
                               name:'assign_items-id',
                               params:{
                               id:stocker_place.id
                               }
                               }"
            >
              <v-card-title>
                {{ stocker_place.name }}
              </v-card-title>
              <v-divider/>
                <v-card-text>
                  在庫登録：
                  <v-chip small v-if="stocker_place.stock_item_status == 1" color="red" dark class="ml-7">未着手</v-chip>
                  <v-chip small v-if="stocker_place.stock_item_status == 2" color="blue" dark class="ml-7">入力中</v-chip>
                  <v-chip small v-if="stocker_place.stock_item_status == 3" color="green" dark class="ml-7">完了</v-chip>
                </v-card-text>
                <v-card-text>
                  物品割り当て：
                  <v-chip small v-if="stocker_place.assign_item_status == 1" color="red" dark >未着手</v-chip>
                  <v-chip small v-if="stocker_place.assign_item_status == 2" color="blue" dark>入力中</v-chip>
                  <v-chip small v-if="stocker_place.assign_item_status == 3" color="green" dark>完了</v-chip>
                </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stocker_places: [],
    }
  },
  mounted() {
    this.$axios.get('/stocker_places', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.stocker_places = response.data
      })
  }
}
</script>
