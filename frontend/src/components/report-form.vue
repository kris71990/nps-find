<template>
  <div class="report-add">
    <form @submit="handleSubmit">
      <fieldset>
        <legend>Submit a report for {{ this.park.name }}</legend>
        <div>
          <div id="rating">
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
          <div id="length">
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
          <div id="activites">
            <label>What did you do during your stay?</label>
            <textarea
              name="activities"
              placeholder="I went hiking on several trails, enjoyed some fishing..."
              value=activities
              v-model="activities"
            ></textarea>
          </div>
          <div id="wildlife">
            <label>What wildlife did you see?</label>
            <textarea
              name="wildlife"
              placeholder="One grizzly bear, a bald eagle, and some marmots..."
              value=wildlife
              v-model="wildlife"
            ></textarea>
          </div>
          <button type="submit">Submit</button>
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

</style>
