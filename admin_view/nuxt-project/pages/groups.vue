<template>
  <div>
    <Header/>
    <v-contanier>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="8">
          <v-card>
            <v-card-title>参加団体一覧</v-card-title>
          </v-card>
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>
    </v-contanier>
  </div>
</template>
<script>
import Header from '~/components/Header.vue'

export default {
  components: {
    Header,
  },
  data() {
    return {
    }
  },
}
</script>
