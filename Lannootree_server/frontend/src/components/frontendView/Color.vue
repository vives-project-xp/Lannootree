<script setup lang="ts">
	import { ref, watch } from 'vue'
	import { useClientAPIStore } from '@/stores/client.connection'

	const clientStore = useClientAPIStore();

	const color = ref("");

	watch(color, (newColor, oldColor) => {
		console.log("Color update: " + newColor);
		
		clientStore.Color(newColor);
	});

</script>

<template>
	<v-color-picker
		v-model="color"
		hide-inputs
		show-swatches
	/>
</template>

<style scoped>

</style>
