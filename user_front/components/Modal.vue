<script setup lang="ts">
interface Order {
  title: string
  buttonText: string
}
const order = withDefaults(defineProps<Order>(), {
	title: '電力申請',
	buttonText: '✔追加'
})
</script>

<template>
	<transition name="modal" appear>
		<div class="font-sans m-auto pt-4 w-1/4 h-full" @click.self="$emit('close')">
			<div class="relative w-auto">
				<div class="shadow-lg flex flex-col w-full pointer-events-auto bg-gray-100 rounded-md outline-none text-current">
					<div class="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
						<div class="text-2xl font-medium">{{ title }}</div>
						<button type="button"
							class="w-4 h-4 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
						>✖</button>
					</div>
					<div class="mx-auto py-4">
						<slot name="form"></slot>
					</div>
					<div class="flex justify-around p-4 border-t font-medium text-white
							text-xs border-gray-200 leading-tight rounded-b-md">
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

<!-- card
	position: absolute;
left: 66.76%;
right: 11.42%;
top: 4.51%;
bottom: 28.09%;

background: rgba(234, 234, 234, 0.95);
border-radius: 10px;
 -->

<!-- 申請登録
position: absolute;
left: 31.59%;
right: 31.59%;
top: 10.69%;
bottom: 84.01%;

font-family: 'Noto Sans JP';
font-style: normal;
font-weight: 300;
font-size: 36px;
line-height: 52px;
text-align: center;
letter-spacing: 0.1em;

color: #000000;
 -->

 <!-- 削除ボタン
	position: absolute;
left: 69.46%;
right: 27.89%;
top: 9.78%;
bottom: 86.15%;
  -->

	<!--  リセット
		position: absolute;
left: 38.73%;
right: 52.61%;
top: 78.82%;
bottom: 17.21%;
	 -->

	 <!--  登録
		position: absolute;
left: 52.54%;
right: 38.8%;
top: 78.82%;
bottom: 17.21%;
	 -->
