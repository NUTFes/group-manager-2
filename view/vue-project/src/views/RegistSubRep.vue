<template>
  <div id="app">
    <h2>副代表者の詳細情報の登録</h2>
    <div>
      <div class="cp_iptxt">
        <p>名前</p>
        <input type="text" name="name" placeholder="名前を入力してください" v-model="name">
      </div>
      <div class="cp_iptxt">
        <p>学籍番号</p>
        <input type="text" name="studentId" placeholder="学籍番号を入力してください" v-model="studentIdd">
      </div>
      <div class="cp_iptxt">
        <p>電話番号</p>
        <input type="text" name="phone" placeholder="電話番号を入力してください" v-model="phone">
      </div>
      <div class="cp_iptxt">
        <p>Eメール</p>
        <input type="text" name="email" placeholder="Emailを入力してください" v-model="email">
      </div>
    </div>
    <div>
      <select>
        <option
          v-for="item in departments"
          :value="item.id"
          :key="item.id"
        >
          {{ item.name }}
        </option>
      </select>
    </div>
    <div>
      <select>
        <option
          v-for="item in grades"
          :value="item.id"
          :key="item.id"
        >
          {{ item.name }}
        </option>
      </select>
    </div>
    <div>
      <button>送信する</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      departments: [
        { name: "機械創造工学課程", id: 1 },
        { name: "電気電子情報工学課程", id: 2 },
        { name: "物質材料工学課程", id: 3 },
        { name: "環境社会基盤工学課程", id: 4 },
        { name: "生物機能工学課程", id: 5 },
        { name: "情報・経営システム工学課程", id: 6 },
        { name: "機械創造工学専攻", id: 7 },
        { name: "電気電子情報工学専攻", id: 8 },
        { name: "物質材料工学専攻", id: 9 },
        { name: "環境社会基盤工学専攻", id: 10 },
        { name: "生物機能工学専攻", id: 11 },
        { name: "情報・経営システム工学専攻", id: 12 },
        { name: "原子力システム安全工学専攻", id: 13 },
        { name: "システム安全専攻", id: 14 },
        { name: "技術科学イノベーション専攻", id: 15 },
        { name: "情報・制御工学専攻", id: 16 },
        { name: "材料工学専攻", id: 17 },
        { name: "エネルギー・環境工学専攻", id: 18 },
        { name: "生物統合工学専攻", id: 19 },
        { name: "その他", id: 20 },
      ],
      grades: [
        { name: "B1[学部1年]", id: 1 },
        { name: "B2[学部2年]", id: 2 },
        { name: "B3[学部3年]", id: 3 },
        { name: "B4[学部4年]", id: 4 },
        { name: "M1[修士1年]", id: 5 },
        { name: "M2[修士2年]", id: 6 },
        { name: "D1[博士1年]", id: 7 },
        { name: "D2[博士2年]", id: 8 },
        { name: "D3[博士3年]", id: 9 },
        { name: "GD1[イノベ1年]", id: 10 },
        { name: "GD2[イノベ2年]", id: 11 },
        { name: "GD3[イノベ3年]", id: 12 },
        { name: "GD4[イノベ4年]", id: 13 },
        { name: "GD5[イノベ5年]", id: 14 },
        { name: "その他", id: 15 },
      ],
    };
  },
};
</script>

<style scoped>
 #app{
  padding: 1%;
 }
  .cp_iptxt {
    position: relative;
    width: 80%;
    margin: 40px 3%;
  }
  .cp_iptxt input[type=text] {
    margin: 0;
    padding: 1%;
    border: 1px solid #1b2538;
  }
  .cp_iptxt input[type=text]:focus {
    border-color: #da3c41;
  }
  button{
    background-color: teal;
    color:white;
    padding:1%;
    margin: 0;
    border:none;
    border-radius:10px;
}
</style>