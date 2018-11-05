<template>
  <div class="auth">
    <form>
      <fieldset>
        <legend>{{ this.type }}</legend>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
          >
          <div v-if="this.type === 'Signup'">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
            >
          </div>
          <label>Password</label>
          <input
            type="text"
            name="password"
            placeholder="Enter Password"
          >
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AuthForm',
  props: {
    type: String,
    onComplete: Function,
  }
}
</script>

<style lang="scss">

</style>

