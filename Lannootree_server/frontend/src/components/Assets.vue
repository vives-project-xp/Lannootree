<script>
  import vSelect from "vue-select"
  import 'vue-select/dist/vue-select.css';
  import { useClientAPIStore } from '@/stores/client.connection';
    export default {
      data() {
        return {
          // assets:["chrismas-tree.gif", "cat.gif", "lannootree-logo.png"],
          clientStore: useClientAPIStore()

        }
      },
      components: {
        vSelect
      }
    }
    </script>

     <template>
      <div class="container">
        <v-select v-model="clientStore.status_json.current_asset" @option:selected="clientStore.setAsset(clientStore.status_json.current_asset)" :options="clientStore.status_json.assets" placeholder="Assets"/>
      </div>
    </template>
    
    <style scoped>
      .container{
        width: 250px;
      }
      :deep() {
        --vs-controls-color: #00bd7e;
        --vs-border-color: #00bd7e;
      
        --vs-dropdown-bg: #333;
        --vs-dropdown-color: ##63dba7;
        --vs-dropdown-option-color: #40fcab;
      
        --vs-selected-bg: #00bd7e;
        --vs-selected-color: #eeeeee;
      
        --vs-search-input-color: #eeeeee;
      
        --vs-dropdown-option--active-bg: #00bd7e;
        --vs-dropdown-option--active-color: #eeeeee;
      }
      </style>