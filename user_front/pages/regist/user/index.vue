<script lang="ts" setup>
  const formTitle = [
    "name",
    "student id",
    "department",
    "grade",
    "mail adress",
    "phone number",
  ];
  const departmentList = [
        { id: 1, name: "機械創造工学課程" },
        { id: 2, name: "電気電子情報工学課程" },
        { id: 3, name: "物質材料工学課程" },
        { id: 4, name: "環境社会基盤工学課程" },
        { id: 5, name: "生物機能工学課程" },
        { id: 6, name: "情報・経営システム工学課程" },
        { id: 7, name: "機械創造工学専攻" },
        { id: 8, name: "電気電子情報工学専攻" },
        { id: 9, name: "物質材料工学専攻" },
        { id: 10, name: "環境社会基盤工学専攻" },
        { id: 11, name: "生物機能工学専攻" },
        { id: 12, name: "情報・経営システム工学専攻" },
        { id: 13, name: "原子力システム安全工学専攻" },
        { id: 14, name: "システム安全専攻" },
        { id: 15, name: "技術科学イノベーション専攻" },
        { id: 16, name: "情報・制御工学専攻" },
        { id: 17, name: "材料工学専攻" },
        { id: 18, name: "エネルギー・環境工学専攻" },
        { id: 19, name: "生物統合工学専攻" },
        { id: 20, name: "その他" },
      ];
  const gradeList = [
        { id: 1, name: "B1[学部1年]" },
        { id: 2, name: "B2[学部2年]" },
        { id: 3, name: "B3[学部3年]" },
        { id: 4, name: "B4[学部4年]" },
        { id: 5, name: "M1[修士1年]" },
        { id: 6, name: "M2[修士2年]" },
        { id: 7, name: "D1[博士1年]" },
        { id: 8, name: "D2[博士2年]" },
        { id: 9, name: "D3[博士3年]" },
        { id: 10, name: "GD1[イノベ1年]" },
        { id: 11, name: "GD2[イノベ2年]" },
        { id: 12, name: "GD3[イノベ3年]" },
        { id: 13, name: "GD4[イノベ4年]" },
        { id: 14, name: "GD4[イノベ5年]" },
        { id: 15, name: "その他" },
      ];
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of organization</h1>
        <Card border="none" align="end" gap="20px">
          <div class="flex">
            <p class="label">name</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">student id</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">department</p>
            <select style="width:180px;">
              <option v-for = "department in departmentList" :key="department">{{department.name}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">grade</p>
            <select style="width:180px;">
              <option v-for = "grade in gradeList" :key="grade">{{grade.name}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">mail adress</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">tell number</p>
            <input class="form" />
          </div>
        </Card>
        <Button class="ml-[80%]" />
      </Card>
    </div>
  </div>
</template>

<style scoped>
  .label {
    @apply
      flex-none
      text-xl
      pr-5
  }
  .form {
    @apply
    flex-none
    border-solid
    border-2
  }
</style>>
