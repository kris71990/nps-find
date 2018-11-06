<template>
  <div>
    <p>Profile</p>
    <div>
      <div v-if="!profile">
        <ProfileForm v-bind:onComplete="handleCreate"/>
      </div>
      <div v-else>
        <h3>Name: <span>{{ profile.firstName }}</span></h3>
        <h3>Age: <span>{{ profile.age }}</span></h3>
        <h3>Home State: <span>{{ profile.homeState }}</span></h3>
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
  computed: mapState({
    profile: state => state.profile,
  }),
  methods: {
    handleCreate(event, a) {
      return this.$store.dispatch('createProfileReq', event)
        .then(() => {
          return this.$router.push('/profile');
        })
    }
  }
}
</script>

<style lang="scss">

</style>
