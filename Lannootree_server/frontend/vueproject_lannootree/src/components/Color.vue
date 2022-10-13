<template>
	<ColorPicker @color-change="updateColor"/>
</template>

<script setup>
import {Color} from "@/assets/api-connection.js"
import { ColorPicker } from 'vue-accessible-color-picker'

function updateColor (eventData) {
 	console.log(eventData)
 }

</script>
<style scoped>
:deep() {
background-color: #333;
color: #00bd7e;
border-radius: 5px;
/* --vacp-focus-color: #123; */
}
</style>
