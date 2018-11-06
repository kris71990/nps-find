<template>
  <div id="profile-view">
    <p>Profile</p>
    <div>
      <div v-if="!profile">
        <ProfileForm v-bind:onComplete="handleCreate" v-bind:editing="false"
        v-bind:handleClose="handleClose"/>
      </div>
      <div v-else>
        <h3>Name: <span>{{ profile.firstName }}</span></h3>
        <h3>Age: <span>{{ profile.age }}</span></h3>
        <h3>Home State: <span>{{ profile.homeState }}</span></h3>
        <p id="update-button" v-on:click="editing = !editing">
          {{ editing ? 'Close' : 'Update Details' }}
        </p>
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

export default {
  name: 'ProfileView',
  components: {
    ProfileForm,
  },
  data() {
    return {
      editing: false,
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
  }
}
</script>

<style lang="scss">
#profile-view {
  width: 50%;
  margin: 0 auto;
  border: 2px solid black;
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
