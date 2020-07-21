<template>
  <div>
 <template>
  <v-row justify="center">
    <v-dialog v-model="show" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">SIGN IN</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field label="EMAIL" v-model="email" required></v-text-field>
            <v-text-field label="PASSWORD" v-model="password" required></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="show = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template> 
  </div>
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

