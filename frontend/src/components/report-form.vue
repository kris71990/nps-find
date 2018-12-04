<template>
  <div class="report-add">
    <form @submit="handleSubmit">
      <fieldset>
        <legend>Submit a report for {{ this.park.fullName }}</legend>
        <div class="input">
          <div class="select">
            <label>Overall Score (1-5, 5 is best)</label><span> *</span>
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
          <div class="select">
            <label>How long was your visit?</label><span> *</span>
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
          <div class="select">
            <label>What area is the park located?</label><span> *</span>
            <select 
              v-model="environment"
              value=environment
            >
              <option value="empty">Select location type</option>
              <option value="urban">Urban/City</option>
              <option value="suburban">Suburban</option>
              <option value="rural">Rural</option>
            </select>
          </div>
          <div class="select">
            <label>How would you describe the temperature?</label><span> *</span>
            <select 
              v-model="temperature"
              value=temperature
            >
              <option value="empty">Select location type</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="temperate">Temperate</option>
              <option value="cool">Cool</option>
              <option value="cold">Cold</option>
            </select><span> *</span>
          </div>
          <div class="checkbox">
            <p>What type of weather?<span> *</span></p>
            <input type="checkbox" v-model="weather" value="sun">
            <label for="landscape">Sun</label>
            <input type="checkbox" v-model="weather" value="rain">
            <label for="landscape">Rain</label>
            <input type="checkbox" v-model="weather" value="snow">
            <label for="landscape">Snow</label>
            <input type="checkbox" v-model="weather" value="wind">
            <label for="landscape">Wind</label>
          </div>
          <div class="checkbox">
            <p>What type of scenery?<span> *</span></p>
            <input type="checkbox" v-model="landscape" value="mountains">
            <label for="landscape">Mountains</label>
            <input type="checkbox" v-model="landscape" value="forest">
            <label for="landscape">Forest</label>
            <input type="checkbox" v-model="landscape" value="desert">
            <label for="landscape">Desert</label>
            <input type="checkbox" v-model="landscape" value="plains">
            <label for="landscape">Plains</label>
            <input type="checkbox" v-model="landscape" value="ocean">
            <label for="landscape">Ocean</label>
            <input type="checkbox" v-model="landscape" value="river">
            <label for="landscape">River</label>
          </div>
        </div>
        <div class="textbox">
          <div>
            <label>What did you do during your stay?</label><span> *</span>
            <textarea
              name="activities"
              placeholder="I went hiking on several trails, enjoyed some fishing..."
              value=activities
              v-model="activities"
            ></textarea>
          </div>
        </div>
        <div class="textbox">
          <div>
            <label>What wildlife did you see?</label>
            <textarea
              name="wildlife"
              placeholder="One grizzly bear, a bald eagle, and some marmots..."
              value=wildlife
              v-model="wildlife"
            ></textarea>
          </div>
        </div>
        <div id="modal-buttons">
          <button type="submit">Submit</button>
          <router-link :to="{ path: `/park/${park.parkCode}` }">Close</router-link>
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
      environment: '',
      landscape: [],
      weather: [],
      temperature: '',
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      return this.onComplete({ 
        parkId: this.park.pKeyCode,
        profileId: this.profile.id,
        parkName: this.park.fullName,
        parkEnvironment: this.environment,
        parkLandscape: this.landscape,
        rating: parseInt(this.rating, 10), 
        lengthOfStay: parseInt(this.lengthOfStay, 10), 
        activities: this.activities, 
        wildlife: this.wildlife,
        weather: this.weather,
        temperature: this.temperature,
      })
        .then(() => {
          this.rating = '';
          this.lengthOfStay = '';
          this.activities = '';
          this.wildlife = '';
          this.landscape = [];
          this.environment = '';
          this.weather = [];
          this.temperature = '';
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
      height: 75%;
      margin: 3% auto;
      background-color: #E8EAEB;
      .input {
        float: left;
        width: 50%;
        height: 100%;
        .select label, .checkbox p {
          font-style: italic;
        }
        div {
          display: inline-block;
          padding: 1%;
          span {
            color: red;
          }
        }
      }
      .textbox {
        width: 50%;
        float: left;
        span {
          color: red;
        }
        label {
          font-style: italic;
          font-weight: bold;
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
