<template>
  <v-row>
    <v-col>
      <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon>mdi-cog</v-icon>設定
                <v-spacer></v-spacer>
              </v-card-title>
              <hr class="mt-n3">
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        
          <v-row >
            <v-col cols="1"></v-col>
            <v-col cols=3 >
              <v-card-title>
                <v-icon class="pr-2">mdi-account-group</v-icon>
                参加団体登録
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_regist_group===true">募集中</v-card-text>
              <v-card-text v-if="is_regist_group===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_regist_group"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
                <v-icon class="pr-2">mdi-account-group</v-icon>
                 団体情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_group===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_group===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_group"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
                <v-icon class="pr-2">mdi-account-outline</v-icon>
                副代表情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_sub_rep===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_sub_rep===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_sub_rep"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
              <v-icon class="pr-2">mdi-map-marker</v-icon>
                会場申請情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_place===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_place===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_place"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
              <v-icon class="pr-2">mdi-power-plug</v-icon>
                電力申請情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_power_order===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_power_order===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_power_order"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
              <v-icon class="pr-2">mdi-table-chair</v-icon>
                物品申請情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_rental_order===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_rental_order===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_rental_order"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
              <v-icon class="pr-2">mdi-microphone-variant</v-icon>  
                ステージ申請情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_stage_order===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_stage_order===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_stage_order"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
              <v-icon class="pr-2">mdi-account</v-icon>  
                従業員情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_employee===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_employee===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_employee"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
              <v-icon class="pr-2">mdi-baguette</v-icon>  
                販売食品情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_food_product===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_food_product===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_food_product"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
              <v-icon class="pr-2">mdi-cart</v-icon>  
                購入品情報編集
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_edit_purchase_list===true">募集中</v-card-text>
              <v-card-text v-if="is_edit_purchase_list===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_edit_purchase_list"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols=3>
              <v-card-title>
              <v-icon class="pr-2">mdi-baguette</v-icon>  
                販売食品登録
              </v-card-title>
            </v-col>
            <v-col cols=2>
              <v-card-text v-if="is_regist_food_product===true">募集中</v-card-text>
              <v-card-text v-if="is_regist_food_product===false">募集締め切り</v-card-text>
            </v-col>
            <v-col cols=2>
              <v-switch
                v-model="is_regist_food_product"
                color="green lighten-1"
                ></v-switch>
            </v-col>
            <v-col cols=4></v-col>
        </v-row>

        <v-row >
        <v-col cols="1"></v-col>
        <v-col cols=10 >
        <v-divider ></v-divider>
        </v-col>
        <v-col cols="1"></v-col>
        </v-row>

        <v-row>
          <v-col cols=8></v-col>
          <v-col cols=3>  
            <div >
              <v-btn
                rounded
                color="blue"
                dark
                @click="update"
                block
                >
                変更する
              </v-btn>

                <v-snackbar
                  v-model="snackbar"
                  color="blue-grey"
                  :multi-line="multiLine"
                  top
                  elevation="24"
                  >
                  変更しました
                  <template v-slot:action="{ attrs }">
                    <v-btn
                      color="white"
                      text
                      v-bind="attrs"
                      @click="snackbar = false"
                      >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                </v-snackbar>
            </div>
          </v-col>
          <v-col cols=1></v-col>
        </v-row>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>


<script>
export default {
  data() {
    return {
      is_regist_group: [],
      is_regist_food_product: [],
      is_edit_group: [],
      is_edit_sub_rep:[],
      is_edit_place: [],
      is_edit_power_order: [],
      is_edit_rental_order:[],
      is_edit_stage_order:[],
      is_edit_employee:[],
      is_edit_food_product:[],
      is_edit_purchase_list:[],
      multiLine: true,
      snackbar: false,
      text: `I'm a multi-line snackbar.`,
      
      
    }
  },

  mounted() {
    this.$axios.get('/user_page_settings', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.is_regist_group = response.data[0].is_regist_group
        this.is_regist_food_product=response.data[0].is_regist_food_product
        this.is_edit_group=response.data[0].is_edit_group
        this.is_edit_sub_rep=response.data[0].is_edit_sub_rep
        this.is_edit_place=response.data[0].is_edit_place
        this.is_edit_power_order=response.data[0].is_edit_power_order
        this.is_edit_rental_order=response.data[0].is_edit_rental_order
        this.is_edit_stage_order=response.data[0].is_edit_stage_order
        this.is_edit_employee=response.data[0].is_edit_employee
        this.is_edit_food_product=response.data[0].is_edit_food_product
        this.is_edit_purchase_list=response.data[0].is_edit_purchase_list
        
      })
 },
 methods:{
    update:function(){
        const update_url='/user_page_settings/1?is_regist_group=' + this.is_regist_group + '&is_regist_food_product=' + this.is_regist_food_product + '&is_edit_group=' + this.is_edit_group +'&is_edit_sub_rep=' + this.is_edit_sub_rep +'&is_edit_place=' + this.is_edit_place +'&is_edit_power_order=' + this.is_edit_power_order +'&is_edit_rental_order=' +this.is_edit_rental_order +'&is_edit_stage_order=' +this.is_edit_stage_order + '&is_edit_employee=' +this.is_edit_employee +'&is_edit_food_product=' +this.is_edit_food_product + '&is_edit_purchase_list=' +this.is_edit_purchase_list 
        this.$axios.put(update_url,{
            headers: { 
                "Content-Type": "application/json", 
            }

        }
        )
        .then(response=>{
          this.snackbar=true
        },error=>{

        })
        
         this.snackbar=true
    }
 }
}
</script>



<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}

</style>
