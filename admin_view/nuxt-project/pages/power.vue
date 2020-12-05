<template>
  <div>
    <Header/>
      <v-container>
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-card-title><v-icon>mdi-account-multiple</v-icon>電力一覧</v-card-title>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <br>
            <v-row>
              <v-col>
                <template>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th v-for="(header, i) in headers" :key="i" class="text-center">
                            {{ header.text }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="text-center"
                          v-for="power in powers"
                          :key="power.id"
                          >
                          <td>{{ power.id }}</td>
                          <td>{{ power.group_id }}</td>
                          <td>{{ power.item }}</td>
                          <td>{{ power.power }}</td>
                          <td>{{ power.manufacturer }}</td>
                          <td>{{ power.model }}</td>
                          <td>{{ power.item_id }}</td>
                          <td>{{ power.created_at | format-date }}</td>
                          <td>{{ power.updated_at | format-date}}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        </v-col>
      </v-container>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import axios from 'axios'

export default {
  components: {
    Header,
  },
  data() {
    return {
      powers: [],
      headers: [
        {
          text: 'ID'
        },
        {
          text: 'group_id'
        },
        {
          text: '製品'
        },
        {
          text: '電力'
        },
        {
          text: 'メーカー'
        },
        {
          text: '型番'
        },
        {
          text: '製品URL'
        },
        {
          text: '作成日時'
        },
        {
          text: '編集日時'
        },
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
        this.powers = response.data
      })
  }
}
</script>
