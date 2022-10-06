<script>
    export default {
      data() {
        return {
          pause: false
        }
      }
    }
    </script>
    
    <template>
        <div class="container">
      <button>Reset</button>
      <button @click="pause = !pause">Pause</button>
      <p>paused: {{pause}}</p>
    </div>
      
    </template>