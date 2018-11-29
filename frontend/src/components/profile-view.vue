<template>
  <div id="profile-view">
    <div>
      <div v-if="!profile">
        <ProfileForm 
          :onComplete="handleCreate" 
          :editing="false"
          :handleClose="handleClose"
        />
      </div>
      <div v-else>
        <h1>Welcome {{ profile.firstName }}.</h1>
        <h2>{{ profile.age }}, 
          <span>{{ states[profile.homeState].fullName }} ({{ states[profile.homeState].region }})</span>
        </h2>
        <div 
          v-if="profile.interests || 
          profile.residentialLocaleType || 
          profile.favoredClimate ||
          profile.favoredLandscape">
          <p v-if="profile.interests">
            <span>Your interests... </span>{{ profile.interests }}
          </p>
          <p v-if="profile.residentialLocaleType">
            <span>You live in... </span>{{ profile.residentialLocaleType }}
          </p>
          <p v-if="profile.favoredClimate">
            <span>You prefer... </span>{{ profile.favoredClimate }}
          </p>
          <p v-if="profile.favoredLandscape">
            <span>You prefer... </span>{{ profile.favoredLandscape }}
          </p>
        </div>
        <p id="update-button" v-on:click="editing = !editing">
          {{ editing ? 'Close' : 'Update Details' }}
        </p>
        <div v-if="profile.reports && profile.reports.length > 0">
          <ReportView 
            v-bind:createReportLine="createReportLine"
            v-bind:createDate="createDate"
            v-bind:reports="profile.reports"
          />
        </div>
      </div>
      <div v-if="profile && editing">
        <ProfileForm 
          :onComplete="handleUpdate" 
          :editing="true" 
          :profile="profile" 
          :handleClose="handleClose"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProfileForm from './profile-form.vue';
import ReportView from './report-view.vue';
import { stateData } from '../utils/states';

export default {
  name: 'ProfileView',
  components: {
    ProfileForm,
    ReportView,
  },
  data() {
    return {
      editing: false,
      states: stateData,
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
      let reportFormat, parkFormat;
      reports.length > 1 ? reportFormat = 'reports' : reportFormat = 'report';
      unique.size > 1 ? parkFormat = 'parks' : parkFormat = 'park';
      return `You have submitted ${reports.length} ${reportFormat} for ${unique.size} ${parkFormat}.`
    },
    createDate(date) {
      const dateReadable = new Date(date);
      return `${dateReadable.toLocaleString()}`;
    }
  }
}
</script>

<style lang="scss">
#profile-view {
  width: 50%;
  margin: 0 auto;
  margin-bottom: 5%;
  span {
    font-weight: bold;
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
}
</style>
