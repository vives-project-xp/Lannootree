<script>
    export default {
      data() {
        return {
          count: 0
        }
      }
    }
    </script>
    
    <template>
        <div class="container">
      <button @click="count++">Effects: {{ count }}</button>
    </div>
    </template>