<template>
  <div class="auth">
    <form @submit="handleSubmit">
      <fieldset>
        <legend>{{ this.type }}</legend>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value=username
            v-model="username"
          >
          <div v-if="this.type === 'Signup'">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
              value=email
              v-model="email"
            >
          </div>
          <label>Password</label>
          <input
            type="text"
            name="password"
            placeholder="Enter Password"
            value=password
            v-model="password"
          >
      </fieldset>
      <button type="submit">{{ this.type }}</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AuthForm',
  data() {
    return {
      username: '',
      password: '',
      email: '',
    }
  },
  props: {
    type: String,
    onComplete: Function,
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.type === 'Login') {
        return this.onComplete({ username: this.username, password: this.password })
          .then(() => {
            this.username = null;
            this.password = null;
          });
      } else {
        return this.onComplete({ username: this.username, password: this.password, email: this.email })
          .then(() => {
            this.username = null;
            this.email = null;
            this.password = null;
          });
      }
    }
  }
}
</script>

<style lang="scss">

</style>

