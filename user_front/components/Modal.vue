<script setup lang="ts">
interface Order {
  title: string
}
const order = withDefaults(defineProps<Order>(), {
	title: '電力申請',
})
</script>

<template>
	<transition name="modal" appear>
		<div class="font-sans m-auto pt-4 w-1/4 h-full" @click.self="$emit('close')">
			<div class="relative w-auto">
				<div class="modal-top">
					<div class="modal-body">
						<div class="text-2xl font-medium">{{ title }}</div>
						<button type="button"
							class="	w-4 h-4 focus: shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
						>✖</button>
					</div>
					<div class="mx-auto py-4">
						<slot name="form"></slot>
					</div>
					<div class="modal">
					<slot name="method"></slot>
						<!-- <button type="button" class="px-8 py-2.5 bg-purple-600
							rounded
							shadow-md
							hover:bg-purple-700 hover:shadow-lg
							focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0
							active:bg-purple-800 active:shadow-lg"
						>
							リセット
						</button>
						<button type="button" class="px-8
							py-2.5
							bg-blue-600
							rounded
							shadow-md
							hover:bg-blue-700 hover:shadow-lg
							focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
							active:bg-blue-800 active:shadow-lg"
						>
							{{ buttonText }}
						</button> -->
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<style>
.modal-top {
	@apply
		shadow-lg flex flex-col w-full pointer-events-auto bg-gray-100 rounded-md outline-none text-current
}
.modal-body {
	@apply
		flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md
}
.modal {
	@apply
		flex justify-around p-4 border-t font-medium text-white text-xs border-gray-200 leading-tight rounded-b-md
}
/* .button {
	@apply
		w-4 h-4 focus: shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline
} */
</style>
