<template>
	<button @click="visible= !visible">Choose Color</button>
		<ColorPicker v-if="visible" @color-change="updateColor" :visible-formats="['rgb']" alpha-channel="hide"/>
</template>

<script setup>
import { useClientAPIStore } from '../stores/client.connection';
// Replaced by useClientStore
// import {Color} from "@/assets/api-connection.js"
// Why are u using both options and composition API ?
import { ColorPicker } from 'vue-accessible-color-picker'

const clientStore = useClientAPIStore();

function updateColor (eventData) {
 	// console.log(eventData)
	clientStore.Color(eventData.cssColor);
 }

</script>

<script>
    export default {

		data(){ return {
		visible: false
		}}
	}
</script>
<style scoped>
:deep() {
background-color: #333;
color: #00bd7e;
border-radius: 3px;
--vacp-border-color: #333;
--vacp-border-width:1px;
/* button {
  color: black;
} */
}
</style>
