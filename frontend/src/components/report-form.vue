<template>
  <div class="report-add">
    <form @submit="handleSubmit">
      <fieldset>
        <legend>Submit a report for {{ this.park.name }}</legend>
        <div>
          <div class="input">
            <label>Overall Score (1-5, 5 is best)</label>
            <select 
              v-model="rating"
              value=rating
            >
              <option value="empty">Choose a score</option>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </div>
          <div class="input">
            <label>How long was your visit?</label>
            <select 
              v-model="lengthOfStay"
              value=lengthOfStay
            >
              <option value="empty">Length (in hours)</option>
              <option value="1">1-3</option>
              <option value="3">3-6</option>
              <option value="6">6-12</option>
              <option value="12">12-24</option>
              <option value="24">24-48 (1-2 days)</option>
              <option value="48">48-72 (2-3 days)</option>
              <option value="72">72-120 (3-5 days)</option>
              <option value="120">120-168 (5-7 days)</option>
              <option value="168">> 168 (more than one week)</option>
            </select>
          </div>
          <div class="input">
            <label>What did you do during your stay?</label>
            <textarea
              rows="4"
              cols="20"
              name="activities"
              placeholder="I went hiking on several trails, enjoyed some fishing..."
              value=activities
              v-model="activities"
            ></textarea>
          </div>
          <div class="input">
            <label>What wildlife did you see?</label>
            <textarea
              rows="4"
              cols="20"
              name="wildlife"
              placeholder="One grizzly bear, a bald eagle, and some marmots..."
              value=wildlife
              v-model="wildlife"
            ></textarea>
          </div>
          <div id="modal-buttons">
            <button type="submit">Submit</button>
            <router-link :to="{ path: `/park/${park.parkCode}` }">Close</router-link>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ReportForm',
  props: {
    onComplete: Function,
    park: Object,
    profile: Object,
  },
  data() {
    return {
      rating: '',
      lengthOfStay: '',
      activities: '',
      wildlife: '',
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      return this.onComplete({ 
        parkId: this.park.pKeyCode,
        profileId: this.profile.id,
        rating: parseInt(this.rating, 10), 
        lengthOfStay: parseInt(this.lengthOfStay, 10), 
        activities: this.activities, 
        wildlife: this.wildlife,
      })
        .then(() => {
          this.rating = '';
          this.lengthOfStay = '';
          this.activities = '';
          this.wildlife = '';
          return;
        })
    }
  }
}
</script>

<style lang="scss">
.report-add {
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
      margin: 1% auto;
      background-color: #E8EAEB;
      div {
        padding: 1%;
      }
      textarea {
        display: block;
      }
      #modal-buttons {
        button {
          margin: 3%;
          padding: 0.6% 1%;
          background-color: rgb(126, 182, 112);
          border-radius: 5px;
          border: 2px solid #336E55;
        }
        button:hover {
          cursor: pointer;
        }
        a {
          background-color: #96AFA7;
          border-radius: 5px;
          border: 2px solid #4A8571;
          padding: 0% 1.5%;
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
  }
}
</style>
