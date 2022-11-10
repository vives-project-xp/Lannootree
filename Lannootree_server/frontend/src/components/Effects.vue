<script>
  import vSelect from "vue-select"
  import 'vue-select/dist/vue-select.css';
  import { useClientAPIStore } from '@/stores/client.connection';
    // Replaced by useClientStore
    // import { Effects } from '@/assets/api-connection.js';
    export default {
      data() {
        return {
          clientStore: useClientAPIStore(),
        }
      },
      components: {
        vSelect
      }
    }
    </script>
    
    <template>
      <div class="container">
        <v-select v-model="clientStore.status_json.current_effect" @option:selected="clientStore.setEffect(clientStore.status_json.current_effect)" :options="clientStore.status_json.effects" placeholder="Effects"/>
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