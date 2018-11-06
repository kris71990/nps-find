<template>
  <div class="auth">
    <form @submit="handleSubmit">
      <fieldset>
        <legend>{{ this.type }}</legend>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value=username
            v-model="username"
          >
        </div>
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
        <div>
          <label>Password</label>
          <input
            type="text"
            name="password"
            placeholder="Enter Password"
            value=password
            v-model="password"
          >
        </div>
        <div id="modal-buttons">
          <button type="submit">{{ this.type }}</button>
          <router-link to="/">Close</router-link>
        </div>
      </fieldset>
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
.auth {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  form {
    position: relative;
    height: 100%;
    fieldset {
      width: 30%;
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translate(-50%, -25%);
      background-color: #E8EAEB;
      div {
        display: block;
        padding: 5%;
      }
      #modal-buttons {
        button {
          margin: 5% auto;
          padding: 3% 25%;
          background-color: rgb(126, 182, 112);
          border-radius: 5px;
          border: 2px solid #336E55;
        }
        button:hover {
          cursor: pointer;
        }
        a {
          width: 54%;
          margin: 0% auto;
          padding: 3% 5%;
          background-color: #96AFA7;
          border-radius: 5px;
          border: 2px solid #4A8571;
          cursor: pointer;
          text-decoration: none;
          color: black;
          display: block;
        }
      }
    }
    legend {
      border: 1px solid black;
      background-color: white;
      padding: 2%;
      margin-bottom: 5%;
    }
    button {
      display: inline-block;
    }
  }
}
</style>

