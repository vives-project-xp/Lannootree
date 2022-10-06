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
      <button @click="count++">Camera: {{ count }}</button>
    </div>
    </template>