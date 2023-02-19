<script lang="ts" setup>

interface Props {
  name: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '貸出物品',
})

const showModal = ref(true)
</script>

<template>
  <div class="fixed top-0 left-0 p-24 w-full h-full z-10 bg-[#333]/30" v-if="showModal">
    <div class="flex mx-[30%] flex-col justify-center rounded-xl bg-[#dadada]">
      <div class="flex justify-end mr-4">
        <button class="hover:text-black hover:opacity-75" v-on:click="showModal = false">✖</button>
      </div>
      <div class="text-2xl text-center font-bold">{{ props.name }}の削除</div>
      <span class="flex justify-around mx-16 my-4">
        <ResetButton />
        <RegistButton />
      </span>
    </div>
  </div>
</template>


<style scoped>
#btn {
  background: #032030;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  width: 30%;
  height: 30px;
  display: block;
  margin-right: 10%;
  margin-left: 10%;
  margin-top: 5%;
  margin-bottom: 5%;
}

#btn:hover {
  box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
  background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
  border: white;
}

#btn:active {
  box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
}

#btnContainer {
  display: flex;
  justify-content: end;
  width: 100%;
  margin-bottom: -1.5rem;
  z-index: 0;
}

.add-modal_box {
  display: flex;
  padding: 10px 10px;
  margin: 0 25%;
  justify-content: center;
  flex-flow: column;
  background-color: #DADADA;
  border-radius: 10px;
  margin: 0 30%;
}

.add-modal {
  top: 0;
  left: 0;
  position: fixed;
  padding: 100px;
  height: 100%;
  width: 100%;
  z-index: 11;
  background-color: rgba(51, 51, 51, 0.3);
  overflow: auto;
}
</style>
