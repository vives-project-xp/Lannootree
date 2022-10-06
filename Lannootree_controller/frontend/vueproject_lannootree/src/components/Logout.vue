<script>
    export default {
      data() {
        return {
          logout: 'Log out'
        }
      }
    }
    </script>
    
    <template>
        <div class="container">
      <button @click="logout = 'Logged out'">{{ logout }}</button>
    </div>
    </template>