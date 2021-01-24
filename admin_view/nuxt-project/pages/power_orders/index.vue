<template>
  <div>
    <Header/>
      <v-row>
        <v-col cols=2>
          <Menu/>
        </v-col>
        <v-col cols=10>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
            <v-card>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    <v-icon>mdi-power-plug</v-icon>電力申請一覧
                    <v-spacer></v-spacer>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs  }">
                          <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            to="/power_orders/print"
                          >
                          <v-icon dark>mdi-printer</v-icon>
                          </v-btn>
                        </template>
                        <span>印刷する</span>
                      </v-tooltip>
                  </v-card-title>
                  <hr class="mt-n3">
                  <template>
                    <v-data-table
                      :headers="headers"
                      :items="power_orders"
                      class="elevation-0 my-9"
                      @click:row="
                        (data) =>
                        $router.push({ path: `/power_orders/${data.id}`})
                        "
                    >
                      <template v-slot:item.created_at="{ item }">
                        {{ item.created_at | format-date }}
                      </template>
                      <template v-slot:item.updated_at="{ item }">
                        {{ item.updated_at | format-date }}
                      </template>
                    </v-data-table>                      
                  </template>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'
export default {
  components: {
    Header,
    Menu,
  },
  data() {
    return {
      power_orders: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: 'group_id', value: 'group_id' },
        { text: '製品', value: 'item' },
        { text: '電力', value: 'power' },
        // { text: 'メーカー', value: 'manufacturer' },
        // { text: '型番', value: 'model' },
        // { text: '製品URL', value: 'item_url' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('power_orders', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.power_orders = response.data
      })
  },
}
</script>
