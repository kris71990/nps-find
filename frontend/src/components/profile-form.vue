<template>
  <div>
    <div class="profile-form">
    <form @submit="handleCreate">
      <fieldset>
        <legend>Create your profile</legend>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Name"
            value=firstName
            v-model="firstName"
          >
        </div>
        <div>
          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value=age
            v-model="age"
          >
        </div>
        <div>
          <label>Home State</label>
          <input
            type="text"
            name="state"
            placeholder="State"
            value=homeState
            v-model="homeState"
          >
        </div>
        <button type="submit">Create</button>
      </fieldset>
    </form>
  </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileForm',
  props: {
    onComplete: Function,
  },
  data() {
    return {
      firstName: '',
      age: 0,
      homeState: '',
    }
  },
  methods: {
    handleCreate(e) {
      e.preventDefault();
      return this.onComplete({
        firstName: this.firstName,
        age: this.age,
        homeState: this.homeState,
      })
        .then(() => {
          this.firstName = '';
          this.age = 0;
          this.homeState = '';
        })
    }
  }
}
</script>

<style lang="scss">

</style>
