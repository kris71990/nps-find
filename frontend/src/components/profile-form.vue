<template>
  <div>
    <div class="profile-form">
    <form @submit="handleCreate">
      <fieldset>
        <legend>{{ editing ? 'Update' : 'Create' }} your profile</legend>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Name"
            value=firstName
            v-model="firstName"
          >
        </div>
        <div>
          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value=age
            v-model="age"
          >
        </div>
        <div>
          <label>Home State</label>
          <input
            type="text"
            name="state"
            placeholder="State"
            value=homeState
            v-model="homeState"
          >
        </div>
        <div id="modal-buttons">
          <button type="submit">{{ editing ? 'Update' : 'Create'}}</button>
          <p v-on:click="handleClose">Close</p>
        </div>
      </fieldset>
    </form>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ProfileForm',
  props: {
    onComplete: Function,
    handleClose: Function,
    editing: Boolean,
  },
  data() {
    return {
      firstName: '',
      age: 0,
      homeState: '',
    }
  },
  computed: mapState({
      profile: state => state.profileModule.profile
    }),
  methods: {
    handleCreate(e) {
      e.preventDefault();
      return this.onComplete({
        firstName: this.firstName,
        age: this.age,
        homeState: this.homeState,
      })
        .then(() => {
          this.firstName = '';
          this.age = 0;
          this.homeState = '';
        })
    }
  }
}
</script>

<style lang="scss">
.profile-form {
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
        p {
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
