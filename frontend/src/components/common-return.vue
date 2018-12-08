<template>
  <div id="search-results" >
    <div v-if="loggedIn || computedInterests.length > 0">
      <ParkPanel 
        :parks="computedParks" 
        :interests="computedInterests" 
        :total="computedTotal" 
        :searchParam="computedSearchParam" 
        :stateFull="computedState || null"
        :type="computedSearchType"
      />
    </div>
    <div v-else id="all-parks">
      <div id="title">
        <h3 v-if="computedState">National Parks in {{ computedState }} ({{ computedTotal }})</h3>
        <span v-else v-html="createHeader()"></span>
      </div>
      <ul id="park-list">
        <li v-for="item in computedParks" :key="item.id">
          <h4 v-on:click="renderPark(item)">{{ item.fullName }}</h4>
          <span v-if="!computedState">{{ item.stateCode }}</span>
          <div class="report-blurb">
            <router-link to="/">
              <div v-if="item.reports" class="with-image">
                <img src="../utils/bison-avatar.png"/>
                <p>- {{ createReportBlurb(item.reports) }} -</p>
              </div>
              <div v-else>
                <p class="no-image">- {{ createReportBlurb(item.reports) }} -</p>
              </div>
            </router-link>
          </div> 
          <ImageCarousel 
            v-if="item.imageUrl" 
            :parkImages="item.imageUrl.split('\n')" 
            :imageCaptions="item.imageCaptions.split('\n')"
          />
        </li>
      </ul> 
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageCarousel from './image-carousel.vue';
import ParkPanel from './park-panel.vue';

export default {
  name: 'CommonReturn',
  components: {
    ImageCarousel,
    ParkPanel,
  },
  computed:
    mapState({
      loggedIn: state => state.authModule.loggedIn,
      computedParks: state => state.parkModule.parks,
      computedState: state => state.parkModule.stateFull,
      computedStateAbbrev: state => state.parkModule.stateAbbrev,
      computedSearchParam: state => state.parkModule.searchParam,
      computedSearchType: state => state.parkModule.type,
      computedTotal: state => state.parkModule.parksTotal,
      computedInterests: state => state.parkModule.interests,
    }),
  methods: {
    createReportBlurb: function(reports) {
      return reports ? reports > 1 ? `${reports} reports` : `${reports} report` : 'No reports - Login to submit the first!';
    },
    createHeader: function() {
      switch (this.computedSearchType) {
        case 'top':
          return `<h1>Most Popular</h1`;
        case 'random':
          return `<h1>Discover New</h1>`;
        default:
          return `<h1>${this.computedSearchParam}</h1>`;
      }
    },
    renderPark: function (park) {
      return this.$store.dispatch('renderPark', park)
        .then(() => {
          this.$router.push(`/park/${park.parkCode}`);
        })
    },
  },
}
</script>

<style lang="scss">
#all-parks {
  width: 95%;
  margin: 3% auto;
  #park-list {
    padding-left: 0px;
    li {
      margin-top: 3%;
      margin-bottom: 5%;
      list-style-type: none;
      .report-blurb {
        width: 30%;
        margin: 0 auto;
        color: grey;
        a {
          text-decoration: none;
          color: black;
        }
        .with-image {
          display: flex;
          flex-direction: row;
          width: 60%;
          margin: 0 auto;
          img {
            margin: 0 auto;
            padding-left: 25%;
          }
          p {
            color: #1AB7BC;
            width: 80%;
            padding-right: 10%;
            margin-bottom: 5%;
          }
        }
      }
      .report-blurb a:hover {
        cursor: pointer;
        color: #00CB94;
      } 
      p {
        margin-bottom: 10px;
      }
      p:hover {
        cursor: pointer;
      }
      span {
        margin: 50px;
      }
    }
  }
}

@media only screen and (max-width: 700px) {
  #all-parks {
    h3 {
      text-decoration: underline;
    }
    #park-list {
      li {
        margin-top: 10%;
        margin-bottom: 10%;
        border-bottom: 2px dashed black;
        .report-blurb {
          margin: 2% auto;
          width: 60%;
        }
      }
    }
  }
}
</style>
