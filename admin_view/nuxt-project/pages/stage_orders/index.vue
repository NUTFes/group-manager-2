\<template>
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
                    <v-icon>mdi-microphone-variant</v-icon>ステージ申請一覧
                    <v-spacer></v-spacer>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs  }">
                          <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            to="/stage_orders/print"
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
                      :items="stage_orders"
                      class="elevation-0 my-9"
                      @click:row="
                        (data) =>
                        $router.push({ path: `/stage_orders/${data.id}`})
                        "
                    >
                    <template v-slot:item.is_sunny="{ item }">
                      <v-chip v-if="item.is_sunny == true" color="red" text-color="white" small>はい</v-chip>
                      <v-chip v-if="item.is_sunny == false" color="blue" text-color="white" small>いいえ</v-chip>
                    </template>
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
      stage_orders: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: 'group_id', value: 'group_id' },
        { text: '晴れ希望', value: 'is_sunny' },
        { text: '開催日', value: 'fes_date_id' },
        { text: '第一希望', value: 'stage_first' },
        { text: '第二希望', value: 'stage_second' },
        // { text: '総合時間幅', value: 'use_time_interval' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('stage_orders', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.stage_orders = response.data
      })
  },
}
</script>
