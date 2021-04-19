<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text>
            <div class="breadcrumbs">
              <ul>
                <li><div class="breadcrumbs-item"><router-link to="/assign_items">物品割り当て</router-link></div></li>
                <li><div class="breadcrumbs-item">{{ stocker_place.name }}</div></li>
              </ul>
            </div>
          </v-card-text>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols=6>
        <v-row>
          <v-col>
            <v-card flat class="ml-15">
              <v-row>
                <v-col cols=1></v-col>
                <v-col cols=10>
                  <v-card-title>
                    在庫情報 | {{ stocker_place.name }} |
                    <v-chip small v-if="stocker_place.stock_item_status == 1" color="red" class="ml-2" @click="stock_item_status_dialog = true"><div style="color:white">未着手</div></v-chip>
                    <v-chip small v-if="stocker_place.stock_item_status == 2" color="blue" class="ml-2"><div style="color:white" @click="stock_item_status_dialog = true">入力中</div></v-chip>
                    <v-chip small v-if="stocker_place.stock_item_status == 3" color="green" class="ml-2" @click="stock_item_status_dialog = true"><div style="color:white">完了</div></v-chip>
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs  }">
                        <v-btn 
                                class="mx-2" 
                                fab 
                                text
                                v-bind="attrs"
                                v-on="on"
                                @click="open_stocker()"
                                >
                                <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>在庫物品を追加する</span>
                    </v-tooltip>
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-data-table
                    :headers="stocker_items_headers"
                    :items="stocker_items"
                    class="elevation-0 my-9"
                    >
                    <template v-slot:item.actions="{ item }">
                      <v-icon
                        small
                        class="mr-2"
                        @click="open_edit_stocker_item(item)"
                        >
                        mdi-pencil
                      </v-icon>
                        <v-icon
                          small
                          @click="delete_stocker_item(item)"
                          >
                          mdi-delete
                        </v-icon>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols=1></v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card flat class="ml-15">
              <v-row>
                <v-col cols=1></v-col>
                <v-col cols=10>
                  <v-card-title>
                    割り当て情報 | {{ stocker_place.name }} |
                    <v-chip small v-if="stocker_place.assign_item_status == 1" color="red" class="ml-2"><div style="color:white" @click="assign_item_status_dialog = true">未着手</div></v-chip>
                    <v-chip small v-if="stocker_place.assign_item_status == 2" color="blue" class="ml-2"><div style="color:white" @click="assign_item_status_dialog = true">入力中</div></v-chip>
                    <v-chip small v-if="stocker_place.assign_item_status == 3" color="green" class="ml-2" @click="assign_item_status_dialog = true"><div style="color:white">完了</div></v-chip>
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs  }">
                        <v-btn 
                                class="mx-2" 
                                fab 
                                text
                                v-bind="attrs"
                                v-on="on"
                                @click="open_assign()"
                                >
                                <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>物品を割り当てる</span>
                    </v-tooltip>
                  </v-card-title>
                  <hr class="mt-n3" />
                  <v-data-table
                    :headers="assign_items_headers"
                    :items="assign_items"
                    class="elevation-0 my-9"
                    >
                    <template v-slot:item.actions="{ item }">
                      <v-icon
                        small
                        class="mr-2"
                        @click="open_edit_assign_item(item)"
                        >
                        mdi-pencil
                      </v-icon>
                        <v-icon
                          small
                          @click="delete_assign_item(item)"
                          >
                          mdi-delete
                        </v-icon>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols=1></v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols=6>
        <v-row>
          <v-col>
            <ItemOrders />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn text color="white" to="/assign_items"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div class="back-button">在庫場所一覧に戻る</div></v-btn>
      </v-col>
    </v-row>

    <!-- 在庫情報ステータス更新 -->
    <v-dialog
      v-model="stock_item_status_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline secondary">
          <div style="color:white">在庫ステータス更新</div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols=1></v-col>
            <v-col cols=10>
              <v-form>
                <v-select
                  v-model="stock_item_status"
                  label="ステータス"
                  :items="status_name"
                  item-text="name"
                  item-value="id"
                  outlined
                  />
              </v-form>
            </v-col>
            <v-col cols=1></v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            dark
            color="btn"
            @click="update_stock_status"
          >
            更新
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 割り当て情報ステータス更新 -->
    <v-dialog
      v-model="assign_item_status_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline secondary">
          <div style="color:white">割り当てステータス更新</div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols=1></v-col>
            <v-col cols=10>
              <v-form>
                <v-select
                  v-model="assign_item_status"
                  label="ステータス"
                  :items="status_name"
                  item-text="name"
                  item-value="id"
                  outlined
                  />
              </v-form>
            </v-col>
            <v-col cols=1></v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            dark
            color="btn"
            @click="update_assign_status"
            >
            更新
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 在庫物品追加 -->
    <v-dialog
      v-model="stocker_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline secondary">
          <div style="color:white">在庫を追加する</div>
          <v-spacer />
          <v-btn text @click="stocker_dialog = false" fab dark>
            <v-icon class="ma-5">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
              <v-select
                label="物品"
                v-model="item"
                :items="item_name"
                :rules="rules.required"
                item-text="name"
                item-value="id"
                text
                outlined
                clearable
                />
                <v-text-field
                  label="個数"
                  v-model="num"
                  type="number"
                  :rules="rules.required"
                  text
                  outlined
                  required
                  clearable
                ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          depressed
          dark
          color="btn"
          @click="submit"
          >
          登録
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 

    <!-- 在庫物品編集 -->
    <v-dialog
      v-model="stocker_edit_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline secondary">
          <div style="color:white">在庫物品を編集する</div>
          <v-spacer />
          <v-btn text @click="stocker_edit_dialog = false" fab dark>
            <v-icon class="ma-5">mdi-close</v-icon>
          </v-btn>

        </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
              <v-select
                label="物品"
                v-model="edited_stocker_item.item"
                :items="item_name"
                :rules="rules.required"
                item-text="name"
                item-value="id"
                text
                outlined
                clearable
                />
                <v-text-field
                  label="個数"
                  v-model="edited_stocker_item.num"
                  type="number"
                  :rules="rules.required"
                  text
                  outlined
                  required
                  clearable
                ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          dark
          depressed
          color="btn"
          @click="edit_stocker_item"
          >
          編集
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 


    <!-- 物品割り当て -->
    <v-dialog
      v-model="assign_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline secondary">
          <div style="color:white">物品を割り当てる</div>
          <v-spacer />
          <v-btn text @click="assign_dialog = false" fab dark>
            <v-icon class="ma-5">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
              <v-select
                label="参加団体"
                v-model="group_id"
                :items="group_name"
                :rules="rules.required"
                item-text="name"
                item-value="id"
                text
                outlined
                clearable
                />
              <v-select
                label="物品"
                v-model="rental_item"
                :items="item_name"
                :rules="rules.required"
                item-text="name"
                item-value="id"
                text
                outlined
                clearable
                />
                <v-text-field
                  label="個数"
                  v-model="assign_num"
                  type="number"
                  :rules="rules.required"
                  text
                  outlined
                  required
                  clearable
                ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          depressed
          dark
          color="btn"
          @click="assign"
          >
          割り当て
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 

    <!-- 物品割り当て編集 -->
    <v-dialog
      v-model="assign_edit_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline secondary">
          <div style="color:white">物品を割り当てを編集する</div>
        </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form ref="form">
              <v-select
                label="参加団体"
                v-model="edited_assign_item.group"
                :items="group_name"
                :rules="rules.required"
                item-text="name"
                item-value="id"
                text
                outlined
                clearable
                />
              <v-select
                label="物品"
                v-model="edited_assign_item.item"
                :items="item_name"
                :rules="rules.required"
                item-text="name"
                item-value="id"
                text
                outlined
                clearable
                />
                <v-text-field
                  label="個数"
                  v-model="edited_assign_item.num"
                  type="number"
                  :rules="rules.required"
                  text
                  outlined
                  required
                  clearable
                ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          depressed
          dark
          color="btn"
          @click="edit_assign_item"
          >
          編集
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 
  </div>
</template>

<script>
import ItemOrders from '~/components/ItemOrders.vue'
export default{
  components: {
    ItemOrders
  },
  data() {
    return {
      stocker_items: [],
      stocker_place: [],
      item_name: [],
      group_name: [],
      stocker_dialog: false,
      stocker_edit_dialog: false,
      assign_dialog: false,
      assign_edit_dialog: false,
      item: [],
      num: [],
      group_id: [],
      rental_item: [],
      assign_num: [],
      assign_items: [],
      stock_item_status_dialog: false, 
      assign_item_status_dialog: false, 
      stock_item_status: [],
      assign_item_status: [],
      stocker_items_headers:[
        { text: '物品', value: 'item' },
        { text: '個数', value: 'num' },
        { text: '編集/削除', value: 'actions' },
      ],
      assign_items_headers:[
        { text: 'ID', value: 'id' },
        { text: '参加団体', value: 'group' },
        { text: '物品', value: 'item' },
        { text: '個数', value: 'num' },
        { text: '編集/削除', value: 'actions' },
      ],
      edited_stocker_item: {
        id: '',
        item: '',
        num: ''
      },
      edited_assign_item: {
        id: '',
        group: '',
        item: '',
        num: '',
      },
      status_name: [
        { id: 1, name: '未着手' },
        { id: 2, name: '入力中' },
        { id: 3, name: '完了' },
      ],
      rules: {
        required: value => !!value || "入力してください"
      },
    }
  },
  mounted(){
    this.$axios
      .get("stocker_places/" + this.$route.params.id, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stocker_place = response.data;
        this.stock_item_status = response.data.stock_item_status
        this.assign_item_status = response.data.assign_item_status
      })

    this.$axios
      .get("api/v1/get_stocker_item_for_stocker_place/" + this.$route.params.id, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stocker_items = response.data;
      })

    this.$axios
      .get("api/v1/get_assign_rental_item_for_stocker_place/" + this.$route.params.id, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.assign_items = response.data;
      })
    this.get_items()
    this.get_groups()
  },
  methods: {
    get_items: function(){
      this.$axios
        .get("api/v1/get_item_name", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.item_name = response.data;
        })
    },
    get_groups: function() {
      this.$axios
        .get("api/v1/get_group_name", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.group_name = response.data;
        })
    },
    open_stocker: function(){
      this.stocker_dialog = true
      this.get_items()
    },
    open_assign: function(){
      this.assign_dialog = true
      this.get_items()
      this.get_groups()
    },
    stocker_reload: function() {
      this.$axios
        .get("api/v1/get_stocker_item_for_stocker_place/" + this.$route.params.id, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stocker_items = response.data;
        })
    },
    stocker_place_reload: function(){
      this.$axios
        .get("stocker_places/" + this.$route.params.id, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stocker_place = response.data;
          this.stock_item_status = response.data.stock_item_status
          this.assign_item_status = response.data.assign_item_status
        })
    },
    assign_reload: function() {
      this.$axios
        .get("api/v1/get_assign_rental_item_for_stocker_place/" + this.$route.params.id, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.assign_items = response.data;
        })
    },
    submit: function() {
      this.$axios.defaults.headers.common['Content-Type'] = 'application/json';
      let params = new URLSearchParams();
      params.append('rental_item_id', this.item);
      params.append('stocker_place_id', this.$route.params.id);
      params.append('fes_year_id', 1);
      params.append('num', this.num);
      this.$axios.post('/stocker_items', params).then(
        (response) => {
          console.log('response:', response)
          this.stocker_dialog = false
          this.stocker_reload()
          this.item = []
          this.num = []
        },
        (error) => {
          console.log('登録できませんでした')
          return error;
        }
      )
    },

    // 物品の割り当て
    assign: function() {
      this.$axios.defaults.headers.common['Content-Type'] = 'application/json';
      let params = new URLSearchParams();
      params.append('group_id', this.group_id);
      params.append('rental_item_id', this.rental_item);
      params.append('num', this.assign_num);
      params.append('stocker_place_id', this.$route.params.id);
      this.$axios.post('/assign_rental_items', params).then(
        (response) => {
          console.log('response:', response)
          this.assign_dialog = false
          this.group_id = []
          this.rental_item = []
          this.assign_num = []
          this.assign_reload()
        },
        (error) => {
          console.log('登録できませんでした')
          return error;
        }
      )
    },
    // 在庫物品の編集ダイアログを表示
    open_edit_stocker_item: function(item) {
      this.get_items()
      this.edited_stocker_item.id = item.id
      this.edited_stocker_item.num = item.num
      for(var i=0; i < this.item_name.length; i++){
        if(this.item_name[i].name === item.item){
          this.edited_stocker_item.item = this.item_name[i].id
        }
      } 
      this.stocker_edit_dialog = true 
    },
    // 在庫物品の編集
    edit_stocker_item: function(){
      const edit_url = '/stocker_items/' + this.edited_stocker_item.id + '?rental_item_id=' + this.edited_stocker_item.item + '&stocker_place_id=' + this.stocker_place.id + '&fes_year_id=1&num=' + this.edited_stocker_item.num;
      this.$axios.put(edit_url , {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        console.log(response)
        this.stocker_edit_dialog = false
        this.stocker_reload()
      }) 
    },
    // 在庫物品の削除
    delete_stocker_item: function(item){
      console.log(item.id)
      const delete_url = '/stocker_items/' + item.id
      this.$axios.delete(delete_url, {
        headers: {
          "Content-Type": "application/json", 
        }
      }).then(response => {
        console.log(response)
        this.stocker_reload()
      })
    },
    // 割り当て物品の編集のダイアログの表示
    open_edit_assign_item: function(item){
      this.get_items()
      for(var i=0; i < this.item_name.length; i++){
        if(this.item_name[i].name === item.item){
          this.edited_assign_item.item = this.item_name[i].id
        }
      } 
      this.get_groups()
      for(var i=0; i < this.group_name.length; i++){
        if(this.group_name[i].name === item.group){
          this.edited_assign_item.group = this.group_name[i].id
        }
      } 
      this.edited_assign_item.id = item.id
      this.edited_assign_item.num = item.num
      this.assign_edit_dialog = true
    },
    // 物品割り当ての編集
    edit_assign_item: function(){
      const edit_url = '/assign_rental_items/' + this.edited_assign_item.id + '?group_id=' + this.edited_assign_item.group + '&rental_item_id=' + this.edited_assign_item.item + '&num=' + this.edited_assign_item.num + '&stocker_place_id=' + this.stocker_place.id;
      this.$axios.put(edit_url , {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        console.log(response)
        this.assign_edit_dialog = false
        this.assign_reload()
      }) 
    },
    // 物品割り当ての削除
    delete_assign_item: function(item){
      const delete_url = '/assign_rental_items/' + item.id
      this.$axios.delete(delete_url, {
        headers: {
          "Content-Type": "application/json", 
        }
      }).then(response => {
        console.log(response)
        this.assign_reload()
      })
   },
    // 在庫ステータス更新
    update_stock_status: function(){
      const update_stock_url = '/stocker_places/' + this.stocker_place.id + '?stock_item_status=' + this.stock_item_status
      this.$axios.put(update_stock_url, {
        headers: {
          "Content-Type": "application/json", 
        }
      }).then(response => {
        console.log(response)
        this.stocker_place_reload()
        this.stock_item_status_dialog = false
      })
    },
    // 割り当てステータス更新
    update_assign_status: function(){
      const update_assign_url = '/stocker_places/' + this.stocker_place.id + '?assign_item_status=' + this.assign_item_status
      this.$axios.put(update_assign_url, {
        headers: {
          "Content-Type": "application/json", 
        }
      }).then(response => {
        console.log(response)
        this.stocker_place_reload()
        this.assign_item_status_dialog = false
      })
    }
  }
}
</script>
