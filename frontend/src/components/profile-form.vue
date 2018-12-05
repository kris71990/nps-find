<template>
  <div>
    <div class="profile-form">
    <form @submit="handleCreate">
      <fieldset>
        <legend>{{ editing ? 'Update' : 'Create' }} your profile</legend>
        <div class="input">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Name"
              value=firstName
              v-model="firstName"
            ><span>*</span>
          </div>
          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value=age
              v-model="age"
            ><span>*</span>
          </div>
          <div>
            <label>Home State</label>
            <input
              type="text"
              name="state"
              placeholder="ex. WA"
              value=homeState
              v-model="homeState"
            ><span>*</span>
          </div>
        </div>
        <div class="textbox">
          <div>
            <label>What are your interests?</label>
            <textarea
              name="interests"
              placeholder="ex. hiking, fishing, camping"
              value=interests
              v-model="interests"
            ></textarea>
            <label>What weather do you prefer?</label>
            <textarea
              name="weather"
              placeholder="ex. sunny, warm"
              value=weather
              v-model="weather"
            ></textarea>
          </div>
        </div>
        <div class="textbox">
          <div>
            <label>What is your favorite type of landscape?</label>
            <textarea
              name="landscape"
              placeholder="ex. mountains"
              value=landscape
              v-model="landscape"
            ></textarea>
            <label>What type of area do you live in?</label>
            <textarea
              name="residentialLocaleType"
              placeholder="ex. suburbs"
              value=residentialLocaleType
              v-model="residentialLocaleType"
            ></textarea>
          </div>
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
    profile: Object,
  },
  data() {
    if (!this.editing) {
      return {
        firstName: '',
        age: 0,
        homeState: '',
        interests: '',
        weather: '',
        landscape: '',
        residentialLocaleType: '',
      }
    } else {
      return {
        firstName: this.profile.firstName,
        age: this.profile.age,
        homeState: this.profile.homeState,
        interests: this.profile.interests,
        weather: this.profile.favoredClimate,
        landscape: this.profile.favoredLandscape,
        residentialLocaleType: this.profile.residentialLocaleType,
      }
    }
  },
  methods: {
    handleCreate(e) {
      e.preventDefault();
      return this.onComplete({
        firstName: this.firstName,
        age: this.age,
        homeState: this.homeState,
        interests: this.interests,
        favoredLandscape: this.landscape,
        favoredClimate: this.weather,
        residentialLocaleType: this.residentialLocaleType,
      })
        .then(() => {
          this.firstName = '';
          this.age = 0;
          this.homeState = '';
          this.interests = '';
          this.weather = '';
          this.landscape = '';
          this.residentialLocaleType = '';
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
      width: 75%;
      height: 80%;
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translate(-50%, -25%);
      background-color: #E8EAEB;
      .input {
        width: 100%;
        margin-bottom: 2%;
        div {
          padding: 1%;
          span {
            color: red;
          }
        }
      }
      .textbox {
        width: 40%;
        display: inline-block;
        label {
          display: inline-block;
        }
        textarea {
          margin: 2% auto;
          display: block;
          width: 80%;
          height: 5em;
        }
      }
      #modal-buttons {
        button {
          margin: 3%;
          padding: 0.6% 3%;
          background-color: rgb(126, 182, 112);
          border-radius: 5px;
          border: 2px solid #336E55;
        }
        button:hover {
          cursor: pointer;
        }
        p {
          min-width: 10%;
          margin: 3%;
          padding: 0.6% 1%;
          background-color: #96AFA7;
          border-radius: 5px;
          border: 2px solid #4A8571;
          cursor: pointer;
          text-decoration: none;
          color: black;
          display: inline-block;
        }
      }
    }
    legend {
      border: 1px solid black;
      background-color: white;
      padding: 2%;
    }
    button {
      display: inline-block;
    }
  }
}
</style>
