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

/* .vacp-copy-button{
    background-color:aqua;
    border-radius:50%;

}
.vacp-copy-button:enabled:focus{
    border-color: ss;
.vacp-copy-button:enabled:hover{
    background-color:#0002
} */
</style>
