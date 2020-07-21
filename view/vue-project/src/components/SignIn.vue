<template>
  <v-dialog
    v-model="show"
    width="500px"
    height="500px"
  >
    <v-card>
      <v-card-title>Sign In</v-card-title>
      <v-divider/>
      <v-card-text>
        Sign In
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SignUp',
  data () {
    return {
      show: false
    }
  },
  methods: {
    open () {
      this.show = true
    }
  }
}
</script>

