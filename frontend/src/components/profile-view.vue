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
        <div v-if="profile.reports && profile.reports.length > 0" id="report-view">
          <ReportView 
            v-bind:createReportLine="createReportLine"
            v-bind:createDate="createDate"
            v-bind:reports="profile.reports"
          />
          <!-- <h3>{{ createReportLine(profile.reports) }}</h3>
          <table>
            <thead>
              <tr>
                <th>Park</th>
                <th>Rating</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in profile.reports" 
                  :key="report.id" 
                  v-bind:class="`star${report.rating}`"
              >
                <td>{{ report.parkId }}</td>
                <td>{{ report.rating }}</td>
                <td>{{ createDate(report.updatedAt) }}</td>
              </tr>
            </tbody>
          </table> -->
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
import ReportView from './report-view.vue';
import { stateAbbreviations } from '../utils/states';

export default {
  name: 'ProfileView',
  components: {
    ProfileForm,
    ReportView,
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
    },
    createDate(date) {
      let dateSliced = date.slice(0, -1);
      const dateReadable = new Date(dateSliced);
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
    table {
      margin: 0 auto;
      border: 2px solid black;
      border-collapse: collapse;
      th {
        padding: 1.5em;
        background-color: #B89587;
        border: 2px solid black;
      }
      td {
        padding: 1em;
        border: 1px dotted black;
      }
      .star1 {
        background-color: #D12727;
      }
    }
  }
}
</style>
