<script>
export default {
  name: 'authentication-logout',
  render() {
    return false
  },
  async created() {
    localStorage.removeItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`)
    localStorage.removeItem(`${process.env.VUE_APP_STORAGE_PREFIX}organizationId`)
    this.$router.replace('/login')
  },
}
</script>
