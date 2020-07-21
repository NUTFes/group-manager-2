<template>
  <v-dialog
    v-model="show"
    scrollable
    persistent
    width="500px"
    height="500px"
    eager
  >
    <v-card>
      <v-card-title>Sign Up</v-card-title>
      <v-divider/>
      <v-card-text>
        Sign Up
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
