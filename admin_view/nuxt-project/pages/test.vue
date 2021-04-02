<template>
  <div>
    <v-row>
      <v-col cols=3></v-col>
      <v-col cols=9>
    <h1>TODOLIST</h1>

      <v-btn @click="getUser">click</v-btn>
    <p>
      {{ role }}
    </p>
    </v-col>
    </v-row>
</div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {

  computed:{
    ...mapGetters({
      role: "users/getRole"
    }),
  },
  methods: {
    ...mapActions({
      getUser: "users/getUser"
    }),
    ...mapMutations({
      setRole: "users/setRole"
    })
  },
}
</script>