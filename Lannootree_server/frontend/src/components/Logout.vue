<script>
    export default {
      data() {
        return {
          logoutUrl: import.meta.env.VITE_LOGOUT_URL
        }
      }
    }
    </script>
    
    <template>
<a :href="logoutUrl" class="linkbutton">Log out</a>
    </template>