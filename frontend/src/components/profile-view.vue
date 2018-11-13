<template>
  <div id="profile-view">
    <div>
      <div v-if="!profile">
        <ProfileForm v-bind:onComplete="handleCreate" v-bind:editing="false"
        v-bind:handleClose="handleClose"/>
      </div>
      <div v-else>
        <h2>
          {{ profile.firstName }} -/- {{ profile.age }} -/- 
          <span>{{ states[profile.homeState] }}</span>
        </h2>
        <p id="update-button" v-on:click="editing = !editing">
          {{ editing ? 'Close' : 'Update Details' }}
        </p>
        <div v-if="profile.reports.length > 0" id="report-view">
          <h3>{{ createReportLine(profile.reports) }}</h3>
          <ul>
            Park | Rating
            <li v-for="report in profile.reports" :key="report.id">
              {{ report.parkId }} | {{ report.rating }}
            </li>
          </ul>
        </div>
      </div>
      <div v-if="profile && editing">
        <ProfileForm :onComplete="handleUpdate" :editing="true" :profile="profile" v-bind:handleClose="handleClose"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProfileForm from './profile-form.vue';
import { stateAbbreviations } from '../utils/states';

export default {
  name: 'ProfileView',
  components: {
    ProfileForm,
  },
  data() {
    return {
      editing: false,
      states: stateAbbreviations,
    }
  },
  computed: mapState({
    profile: state => state.profileModule.profile,
  }),
  methods: {
    handleCreate(event, a) {
      return this.$store.dispatch('createProfileReq', event)
        .then(() => {
          this.editing = false;
          return this.$router.push('/profile');
        })
    },
    handleUpdate(event, a) {
      return this.$store.dispatch('updateProfileReq', event)
        .then(() => {
          this.editing = false;
          return this.$router.push('/profile');
        })
    },
    handleClose() {
      return this.editing = !this.editing;
    },
    createReportLine(reports) {
      const unique = new Map();
      reports.filter((report) => {
        if (!unique[report.parkId]) unique.set(report.parkId, 1);
      })
      return `You have submitted ${reports.length} reports for ${unique.size} parks.`
    }
  }
}
</script>

<style lang="scss">
#profile-view {
  width: 50%;
  margin: 0 auto;
  span {
    font-style: oblique;
  }
  #update-button {
    width: 25%;
    margin: 0 auto;
    padding: 1% 0%;
    background-color: rgb(126, 182, 112);
    border: 2px solid #336E55;
    border-radius: 5px;
    cursor: pointer;
    color: black;
  }
  #report-view {
    ul {
      padding: 0;
      list-style-type: none;
    }
  }
}
</style>
