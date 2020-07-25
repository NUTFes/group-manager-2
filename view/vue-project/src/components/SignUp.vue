<template>
  <div>
 <template>
  <v-row justify="center">
    <v-dialog v-model="show" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">SIGN UP</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field label="NAME" v-model="name" required></v-text-field>
            <v-text-field label="EMAIL" v-model="email" required></v-text-field>
            <v-text-field label="PASSWORD" v-model="password" type="password" required></v-text-field>
            <v-text-field label="PASSWORD CONFIRMATION" v-model="password_confirmation" type="password" required></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="show=false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="signUp">Sign Up</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template> 
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SignUp',
  data () {
    return {
      show: false,
    }
  },
  methods: {
    open () {
      this.show = true
    },
    signUp: function() {
      const url = 'http://localhost/api/auth'
      var params = new URLSearchParams();
      params.append('name', this.name);
      params.append('email', this.email);
      params.append('password', this.password);
      params.append('password_confirmation', this.password_confirmation);
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.post(url, params);
      this.show = false
    }
  }
}
</script>
