<template>
  <div class="text-center" v-if="stocker_places.length === 0">
    <br><br>
    <v-progress-circular
      indeterminate
      color="#009688"
      ></v-progress-circular>
    <br><br>
  </div>
  <div v-else>
    <v-row>
      <v-col v-for="stocker_place in stocker_places">
        <v-hover v-slot:default="{ hover }">
        <v-card 
          width="300" height="180"
          :elevation="hover ? 12 : 2"
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
            <v-chip small v-if="stocker_place.stock_item_status == 1" color="red"><div style="color:white">在庫登録：未着手</div></v-chip>
            <v-chip small v-if="stocker_place.stock_item_status == 2" color="blue"><div style="color:white">在庫登録：入力中</div></v-chip>
            <v-chip small v-if="stocker_place.stock_item_status == 3" color="green"><div style="color:white">在庫登録：完了</div></v-chip>
            <br><br>
            <v-chip small v-if="stocker_place.assign_item_status == 1" color="red"><div style="color:white">物品割り当て：未着手</div></v-chip>
            <v-chip small v-if="stocker_place.assign_item_status == 2" color="blue"><div style="color:white">物品割り当て：入力中</div></v-chip>
            <v-chip small v-if="stocker_place.assign_item_status == 3" color="green"><div style="color:white">物品割り当て：完了</div></v-chip>
          </v-card-text>
        </v-card>
        </v-hover>
      </v-col>
    </v-row>
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
