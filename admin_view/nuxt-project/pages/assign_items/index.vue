<template>
  <div>
    <v-row>
      <v-col v-for="stocker_place in stocker_places">
        <v-hover v-slot:default="{ hover }">
        <v-card 
          width="300" height="120"
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
