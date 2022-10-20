<script>
    import { useClientAPIStore } from '@/stores/client.connection';
    export default {
    //   data() {
    //     return {
    //     //   logoutUrl: import.meta.env.VITE_LOGOUT_URL
    //     }
    //   }
    data() {return {
        clientStore: useClientAPIStore(),
        visible: false,
    //   matrix: [
    //     [1,2,3,4],
    //     [5,6,7,8],
    //     [9,10,11,12],
    //     [13,14,15,16]
    //   ]
    matrix: [[{"red":255,"green":0,"blue":0},{"red":0,"green":255,"blue":0}],[{"red":100,"green":0,"blue":0},{"red":100,"green":0,"blue":0}]]
    }}
    }
    </script>
    
    <template>
	    <button @click="visible= !visible">Show Example</button>

        <div v-if="visible" class="lannootree-display" >
            <table>
                <tr class="lannootree-row" v-for="(line,lineIndex) in clientStore.color_matrix" :key="`row${lineIndex}`">
                    <td class="lannootree-display-column" v-for="(cell,coloumIndex) in line" :style="{ 'background-color': `rgb(${cell.red}, ${cell.green}, ${cell.blue})`}" :key="`col${coloumIndex}`">
                        <pre :style="{ 'color': `rgb(${cell.red}, ${cell.green}, ${cell.blue})`}">col</pre>
                    </td>
                </tr>
            </table>
        </div>
    </template>



    <style scoped>
        .lannootree-display table,  .lannootree-display td,  .lannootree-display tr{
            border: 1px solid;
            border-color: white;
            
        border-collapse: collapse;
        }

    </style>

