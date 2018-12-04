<template>
  <div class="single-park">
    <h1>{{ computedPark.fullName }}</h1>
    <div class="image-box">
      <MapView
        v-bind:coordinates="computedPark.latLong"
        v-bind:parkName="computedPark.name"
      />
      <ImageCarousel 
        v-if="computedPark.imageUrl"
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
            <div class="report-buttons"><p @click="reportView = !reportView">Close</p></div>
          </div>
          <div v-else>
            <p>{{ createReportLinePark(computedPark.reports, computedPark.name) }}</p>
            <div class="report-buttons">
              <p @click="getReports">Click to view</p>
              <router-link v-if="loggedIn" :to="{ path: `/park/${computedPark.parkCode}/report` }">Submit a report</router-link>
              <router-link v-else to="/">Login/signup to contribute</router-link>
            </div>
            <ReportForm 
              v-if="this.$route.path === `/park/${computedPark.parkCode}/report`"
              v-bind:onComplete="submitReport" 
              v-bind:park="computedPark"
              v-bind:profile="computedProfile"
            />
          </div>
        </div>
        <div v-else>
          <p>No user reports - 
            <router-link 
              v-if="loggedIn" 
              :to="{ path: `/park/${computedPark.parkCode}/report` }"
            ><span>Submit the first!</span>
            </router-link>
            <router-link 
              v-else to="/"><span>Login/signup to contribute</span>
            </router-link>
          </p>
          <ReportForm 
            v-if="this.$route.path === `/park/${computedPark.parkCode}/report`"
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
      const { parkCode, pKeyCode } = this.computedPark;
      return this.$store.dispatch('postReportReq', event)
        .then(() => {
          return this.$store.dispatch('getSinglePark', pKeyCode)
            .then(() => {
              return this.$router.push(`/park/${parkCode}`);
            })
        });
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
      return reports > 1 ? `${reports} submitted for ${name}` : `${reports} submitted for ${name}`;
    },
    createReportLineParkTable(reports) {
      const unique = new Map();
      reports.filter((report) => {
        if (!unique[report.profileId]) unique.set(report.profileId, 1);
      })
      let userFormat, reportFormat;
      unique.size > 1 ? userFormat = 'users' : userFormat = 'user';
      reports.length > 1 ? reportFormat = 'reports have' : reportFormat = 'report has';
      return `Report Summary: ${reports.length} ${reportFormat} been submitted by ${unique.size} ${userFormat}.`
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
    p {
      span:hover {
        cursor: pointer;
        color: #00CB94;
      }
    }
  }
  .report-box {
    a {
      text-decoration: none;
    }
    .report-buttons {
      a, p {
        background-color: #96AFA7;
        border-radius: 5px;
        border: 2px solid #4A8571;
        padding: 0% 1.5%;
        text-decoration: none;
        color: black;
        display: inline-block;
      }
      p:hover {
        cursor: pointer;
        border: 2px solid #E7CF03;
      }
      a:hover {
        border: 2px solid #E7CF03;
      }
    }
  }
}
</style>
