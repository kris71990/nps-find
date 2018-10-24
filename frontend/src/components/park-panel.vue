<template>
  <div class="park-panel">
    <div class="interests">
      <h4>You are interested in...</h4>
      <ul>
        <li v-for="interest in interests" :key="interest">
          {{ interest }}
        </li>
      </ul>
    </div>
    <div class="panel">
      <h4>{{ total }} locations found.</h4>
      <ul>
        <li v-for="park in parks" :key="park.id">
          <div class="park-card">
            <p>{{ park.fullName }}</p>
            <img v-bind:src="randomizedImage(park)"/>
          </div>
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
  },
  methods: {
    randomizedImage:
      function (park) {
        const arr = park.imageUrl.split('\n');
        arr.pop();
        const index = Math.round(Math.random() * (arr.length - 1));
        return arr[index];
      }, 
  }
}
</script>

<style lang="scss">
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
  margin-bottom: 5%;
  ul {
    padding-left: 0;
    display: flex;
    flex-direction: row;
    li {
      margin: 1%;
      width: 25%;
      display: inline-block;
      list-style-type: none;
      border: 8px groove #336E55;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
