<template>
	<ColorPicker @color-change="updateColor" :visible-formats="['rgb']" alpha-channel="hide"/>
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
border-radius: 3px;
--vacp-border-color: #333;
--vacp-border-width:1px;
}
</style>
