<script setup lang="ts">
interface Order {
  title: string
}
const props = withDefaults(defineProps<Order>(), {
	title: '',
})
</script>

<template>
	<div class="fixed top-0 left-0 h-full w-full	p-24 z-10 bg-[#333]/30 overflow-auto" >
		<div class="flex p-4 mx-[30%] justify-center bg-[#dadada] rounded-lg flex-col">
			<slot name="close"/>
			<div class="text-3xl font-medium text-center">{{ props.title }}</div>
			<slot name="form"></slot>
		</div>
	</div>
</template>
