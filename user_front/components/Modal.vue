<script setup lang="ts">
interface Order {
  title: string
}

const order = withDefaults(defineProps<Order>(), {
	title: '電力申請',
})

const showModal = ref(true)
</script>

<template>
	<div v-if="showModal" class="fixed top-0 left-0 h-full p-24 w-full z-10 bg-[#333]/30">
		<div class="flex p-4 mx-[30%] justify-center bg-[#dadada] rounded-lg flex-col">
			<div class="flex justify-end">
				<button
					class="hover:text-black hover:opacity-75" @click="showModal=false"
				>✖</button>
			</div>
			<div class="text-3xl font-medium text-center">{{ order.title }}</div>
			<slot name="form"></slot>
			<slot name="method"></slot>
		</div>
	</div>
</template>
