<template>
  <div class="search-form">
    <h3>Choose a state to find National Parks near you</h3>
    <form @submit="handleSubmit">
      <fieldset>
        <legend>Submit your preferences</legend>
        <div class="search-fields">
          <div class="state-selection">
            <h3>What state are you in?</h3>
            <select 
              v-model.lazy="stateSelection"
              value=stateSelection
            >
              <option value="empty">Select State</option>
              <option v-for="state in Object.keys(stateAbbreviations)" v-bind:key=state v-bind:value=state>
                {{ stateAbbreviations[state] }}
              </option>
            </select>
          </div>
          <div class="interest-checkboxes">
            <h3>What are your interests?</h3>
            <div>
              <input type="checkbox" v-model="interests" id="camping" value="camping">
              <label for="">Camping</label>
            </div>
            <div>
              <input type="checkbox" v-model="interests" id="hiking" name="hiking" value="hiking">
              <label for="">Hiking</label>
            </div>
            <div>
              <input type="checkbox" v-model="interests" id="nature" name="nature" value="nature">
              <label for="">Nature</label>
            </div>
            <div>
              <input type="checkbox" v-model="interests" id="history" name="history" value="history">
              <label for="history">History</label>
            </div>
          </div>
          <div class="button">
            <button type="submit">
              Find parks in {{ stateSelection }}
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { stateAbbreviations } from '../utils/states';

export default {
  name: 'SearchForm',
  props: {
    handleSearch: Function,
  },
  data() {
    return {
      stateAbbreviations,
      stateSelection: null,
      interests: [],
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      return this.handleSearch({ 
        state: this.stateSelection, stateFull: stateAbbreviations[this.stateSelection], interests: this.interests })
        .then(() => this.stateSelection = null);
    },
  }
}
</script>

<style lang="scss">
.search-form {
  form {
    width: 80%;
    margin: 0 auto;
    fieldset {
      background-color: #E8EAEB;
    }
    legend {
      border: 1px solid black;
      background-color: white;
      padding: 2%;
    }
    .interest-checkboxes div {
      width: 30%;
      margin: 2% auto;
      padding: 2%;
      text-align: left;
      label {
        margin-left: 10%;
      }
    }
    .button {
      margin: 1%;
      button {
        background-color: rgb(126, 182, 112);
        padding: 10px;
        margin: 5%;
        border-radius: 5px;
        border: 2px solid #336E55;
      }
      button:hover {
        background-color: #336E55;
        color: #F1E3CB;
      }
    }
  }
}
</style>