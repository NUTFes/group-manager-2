<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color:#ECEFF1; font-size:30px">
        <v-icon class="pr-3" size="35">mdi-baguette</v-icon><b>販売食品情報の修正</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-container class="justify-content-center">
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8" align="center">
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    label="商品名"
                    v-model="name"
                    text
                    outlined
                    required
                    clearable
                  ></v-text-field>
                  <v-text-field
                    label="1日目の個数"
                    v-model="firstN"
                    ref="firstN"
                    type="number"
                    text
                    outlined
                    required
                    clearable
                  ></v-text-field>
                  <v-text-field
                    label="2日目の個数"
                    v-model="secondN"
                    ref="secondN"
                    type="number"
                    text
                    outlined
                    required
                    clearable
                  ></v-text-field>
                  <v-select
                  label="調理の有無"
                  ref="cooking"
                  v-model="cooking"
                  :items="this.cooking_list"
                  item-text="name"
                  item-value="id"
                  outlined
                  ></v-select>
                </v-form>
              </v-card-text>
                  <v-row>
                    <v-col cols=4></v-col>
                    <v-col cols=4>
                    <v-btn color="blue darken-1" large block dark @click="submit">編集する</v-btn>
                    </v-col>
                    <v-col cols=4></v-col>
                  </v-row>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
          </v-container>
        </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    id: Number,
    groupId: Number,
    name: String,
    firstN: Number,
    secondN: Number,
    cooking: String,
  },
  data () {
    return {
      isDisplay: false,
      cooking_list:[
          {id: true, name: 'する'},
          {id: false, name: 'しない'}
      ],
      groups: [],
    }
  },

  methods: {
    submit: function() {
      if ( !this.$refs.form.validate() ) return;

      const url = process.env.VUE_APP_URL + '/food_products' + '/' + this.id + '?group_id=' + this.groupId + '&name=' + this.name + '&first_day_num=' + this.firstN + '&second_day_num=' + this.secondN + '&is_cooking=' + this.cooking
      console.log(url)
      axios.put(url).then(
        (response) => {
          this.isDisplay = false
          this.$emit('openFoodproductSnackbar')
          this.$emit('reload')
        },
        (error) => {
          return error;
        }
      )
    }
  },

  mounted() {
    const groupUrl = process.env.VUE_APP_URL + '/groups'
    axios.get(groupUrl, {
      headers: {
        "Content-Type": "application/json",
      }
    }).then(
      (response) => {
        this.groups = response.data
      },
      (error) => {
        return error;
      }
    )
  },
}

</script>
