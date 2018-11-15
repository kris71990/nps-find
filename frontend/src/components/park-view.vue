<template>
  <div class="single-park">
    <h1>{{ computedPark.fullName }}</h1>
    <div class="image-box">
      <MapView
      v-bind:coordinates="computedPark.latLong"
      v-bind:parkName="computedPark.name"
      />
      <ImageCarousel v-if="computedPark.imageUrl"
      v-bind:parkImages="computedPark.imageUrl.split('\n')" v-bind:imageCaptions="computedPark.imageCaptions.split('\n')"
      />
    </div>
    <div class="info-box">
      <h3>Park details...</h3>
      <p>{{ computedPark.description }}</p>
      <h3>How to get here...</h3>
      <p>{{ computedPark.directionsInfo }}</p>
      <h3>Weather...</h3>
      <p>{{ computedPark.weatherInfo }}</p>
      <h3>Camping...</h3>
      <div>
        <p v-if="computedPark.camping">
          See <span @click="getCampgrounds">camping</span> options in {{ computedPark.name }}.
        </p>
        <p v-else>No camping available.</p> 
      </div>
      <h3>User Reports...</h3>
      <div class="report-box">
        <div v-if="computedPark.reports" >
          <div v-if="reportView">
            <ReportView
              v-bind:createReportLine="createReportLineParkTable"
              v-bind:createDate="createDate"
              v-bind:reports="computedReports"
            />
            <p @click="reportView = !reportView"><span>Close</span></p>
          </div>
          <div v-else>
            <p>{{ createReportLinePark(computedPark.reports, computedPark.name) }}</p>
            <span @click="getReports">Click to view</span><br/>
            <!-- <span v-if="loggedIn" @click="reportForm = !reportForm">Submit a report</span> -->
            <router-link v-if="loggedIn" :to="{ path: `/park/${computedPark.parkCode}/report` }">Submit a report</router-link>
            <router-link v-else to="/">Login/signup to contribute</router-link>
            <ReportForm 
              v-if="this.$route.path === `/park/${computedPark.parkCode}/report`"
              v-bind:onComplete="submitReport" 
              v-bind:park="computedPark"
              v-bind:profile="computedProfile"
            />
          </div>
        </div>
        <div v-else>
          <p @click="reportForm = !reportForm">No user reports - Submit the first!</p>
          <ReportForm 
            v-if="reportForm"
            v-bind:onComplete="submitReport" 
            v-bind:park="computedPark"
            v-bind:profile="computedProfile"
          />
        </div>
      </div>
      <h3>More...</h3>
      <p>View page on <a :href=computedPark.url target="_blank">National Park Service</a></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageCarousel from './image-carousel.vue';
import MapView from './park-view-map.vue';
import CampgroundOptions from './campground-options.vue';
import ReportForm from './report-form.vue';
import ReportView from './report-view.vue';

export default {
  name: 'ParkView',
  components: {
    ImageCarousel,
    MapView,
    CampgroundOptions,
    ReportForm,
    ReportView,
  },
  data() {
    return {
      reportForm: false,
      reportView: false,
    }
  },
  computed: mapState({
    loggedIn: state => state.authModule.loggedIn,
    computedPark: state => state.parkModule.singlePark,
    computedProfile: state => state.profileModule.profile,
    computedReports: state => state.reportModule.singleParkReports,
  }),
  methods: {
    getCampgrounds: function() {
      const { pKeyCode, parkCode } = this.computedPark;
      return this.$store.dispatch('getCampgrounds', { pKeyCode, parkCode })
        .then(() => {
          this.$router.push(`/park/${parkCode}/campgrounds`);
        });
    },
    submitReport(event, a) {
      const { parkCode } = this.computedPark;
      return this.$store.dispatch('postReportReq', event)
        .then(() => {
          this.reportForm = !this.reportForm;
          return this.$router.push(`/park/${parkCode}`);
        })
    },
    getReports(event, a) {
      const { parkCode, pKeyCode } = this.computedPark;
      return this.$store.dispatch('fetchReportReq', pKeyCode)
        .then(() => {
          this.reportView = !this.reportView;
          return this.$router.push(`/park/${parkCode}`)
        })
    },
    createReportLinePark(reports, name) {
      if (reports > 1) {
        return `${reports} submitted for ${name}`;
      } else if (reports == 1) {
        return `${reports} submitted for ${name}`;
      } 
    },
    createReportLineParkTable(reports) {
      const unique = new Map();
      reports.filter((report) => {
        if (!unique[report.profileId]) unique.set(report.profileId, 1);
      })
      let userFormat;
      if (unique.size === 1) {
        userFormat = 'user';
      } else {
        userFormat = 'users';
      }
      return `Report Summary: ${reports.length} reports have been submitted by ${unique.size} ${userFormat}.`
    },
    createDate(date) {
      const dateReadable = new Date(date);
      return `${dateReadable.toLocaleString()}`;
    },
  }
}
</script>

<style lang="scss">
.single-park {
  h1 {
    background: repeating-linear-gradient(60deg, #076B69, #016AAB 30%,#73C9C7);
    border-bottom: 3px solid black;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 2em;
  }
  .info-box {
    width: 60%;
    line-height: 2;
    text-align: left;
    margin: 0 auto 5%;
    background-color: #E8EAEB;
    border: 5px dashed grey;
    padding: 2%;
    h3 {
      text-decoration: underline;
    }
    span {
      color: grey;
      font-weight: bold;
    }
    span:hover {
      cursor: pointer;
      color: #00CB94;
    }
  }
}
</style>
