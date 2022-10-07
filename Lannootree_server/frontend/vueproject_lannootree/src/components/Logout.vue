<script>
    const url = import.meta.env.LOGOUT_URL
    export default {
      data() {
        return {
        }
      }
    }
    </script>
    
    <template>
        <a :href="url">
            <button>Log out</button>
        </a>
    </template>