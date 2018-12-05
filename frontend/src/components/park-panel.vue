<template>
  <div class="park-panel">
    <span v-html="createHeader()"></span>
    <div v-if="interests.length > 0" class="interests">
      <h4>You are interested in...</h4>
      <ul>
        <li v-for="interest in interests" :key="interest">
          {{ interest }}
        </li>
      </ul>
    </div>
    <div class="panel">
      <h4>{{ total }} locations found.</h4>
      <p id="campground-button"
        v-if="interests.includes('camping') && parks.length > 0"
        v-on:click="renderCampgrounds(searchParam)"
      >
      Or see all campgrounds in the state.
      </p>
      <ul>
        <li v-for="park in parks" :key="park.pKeyCode">
          <div v-on:click="renderPark(park)" class="park-card">
            <p><a>{{ park.fullName }}</a></p>
            <img v-if="park.imageUrl" v-bind:src="randomizedImage(park)"/>
          </div>
          <p v-bind:class="park.reports ? 'yes' : 'no'" v-on:click="renderParkReport(park)">
            - {{ createReportBlurb(park.reports) }} -
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParkPanel',
  props: {
    parks: Array,
    interests: Array,
    total: Number,
    stateFull: String,
    searchParam: String,
    type: String,
  },
  methods: {
    createHeader: function() {
      switch (this.type) {
        case 'state':
          return `<h1>${this.stateFull}</h1>`;
        case 'region':
          return `<h1>In your region (${this.searchParam})...</h1>`;
        case 'climate': 
          return `<h1>If you like ${this.searchParam}...</h1>`
        case 'environment':
          return `<h1>You live in an ${this.searchParam} environment.</h1><h2>Explore somewhere different...</h2>`
        default:
          return `<h1>${searchParam}</h1>`;
      }
    },
    randomizedImage: function (park) {
      const arr = park.imageUrl.split('\n');
      arr.pop();
      const index = Math.round(Math.random() * (arr.length - 1));
      return arr[index];
    }, 
    renderPark: function (park) {
      return this.$store.dispatch('renderPark', park)
        .then(() => {
          this.$router.push(`/park/${park.parkCode}`);
        })
    },
    renderParkReport: function(park) {
      if (park.reports) {
        return this.$store.dispatch('renderPark', park)
          .then(() => this.$router.push(`/park/${park.parkCode}`));
      }
      return this.$store.dispatch('renderPark', park)
        .then(() => this.$router.push(`/park/${park.parkCode}/report`));
    },
    renderCampgrounds: function (state) {
      return this.$store.dispatch('renderCampgroundsState', state)
        .then(() => {
          this.$router.push(`/campgrounds/${state}`);
        })
    },
    createReportBlurb: function(reports) {
      return reports ? reports > 1 ? `${reports} reports` : `${reports} report` : 'No reports - submit the first!';
    }
  }
}
</script>

<style lang="scss">
.park-panel {
  h2 {
    font-style: italic;
  }
  .interests {
    width: 30%;
    margin: 0 auto;
    padding: 1%;
    background-color: #E8EAEB;
    border: 5px dashed grey;
    h4 {
      margin: 1%;
    }
    ul {
      width: 30%;
      padding-left: 0;
      margin: 0 auto;
      li {
        text-align: left;
        padding-left: 10%;
        list-style-position: inside;
        list-style-type: circle;
      }
    }
  }
  .panel {
    width: 100%;
    #campground-button {
      width: 20%;
      margin: 0 auto;
      color: grey;
      font-weight: bold;
    }
    #campground-button:hover {
      cursor: pointer;
      color: #00CB94;
    }
    ul {
      padding-left: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 5em;
      li {
        margin: 2em;
        width: 25%;
        list-style-type: none;
        .park-card {
          font-weight: bold;
          font-style: oblique;
          height: 100%;
          border: 8px double #0870B8;
          background-color: #ECF2FF;
        }
        .yes {
          font-weight: bold;
        }
        .no {
          color: grey;
          font-weight: bold;
        }
        .park-card:hover {
          border: 8px solid #930000;
          transform: scale(1.01,1.01);
          cursor: pointer;
        }
        .yes:hover {
          cursor: pointer;
          color: #13742F;
        }
        .no:hover {
          cursor: pointer;
          color: #00CB94;
        } 
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }

  @media only screen and (max-width: 900px) {
    .interests {
      width: 40%;
      ul {
        width: 40%;
      }
    }
    .panel {
      #campground-button {
        width: 50%;
      }
      ul {
        li {
          width: 40%;
          margin: 2em 1.5em;
          .yes, .no {
            padding-bottom: 1.2em;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 600px) {
    .interests {
      width: 60%;
      ul {
        width: 60%;
      }
    }
    .panel {
      #campground-button {
        width: 75%;
      }
      ul {
        display: block;
        li {
          width: 75%;
          margin: 0% auto;
          .yes, .no {
            border-bottom: 2px dashed black;
            padding-bottom: 1em;
          }
        }
      }
    }
  }
}
</style>
