<template>
  <div class="component-container">
    <input type="text" class="text-input" v-model="searchterm" placeholder="Search for a venue" @focusin="showDropdownContent()" @focusout="hideDropdownContent()" @keyup.enter="hitEnter()"/>
    <div class="results-container" v-if="show">
      <a href="#" v-for="venue in queryResults" @click="selectVenue(venue)">{{venue.name}}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ["venues"],
  data: function() {
    return {
      searchterm: "",
      show: false
    }
  },
  methods: {
    showDropdownContent: function() {
      this.show = true;
    },
    hideDropdownContent: function() {
      this.show = false;
    },
    selectVenue: function(venue) {
      this.searchterm = venue.name;
      this.hideDropdownContent();
      this.$emit("selectVenue", venue);
    },
    hitEnter: function() {
      if (this.queryResults.length == 1) {
        this.selectVenue(this.queryResults[0]);
      }
    }
  },
  computed: {
    queryResults: function() {
      if (this.venues == undefined) {
        return [];
      } else {
        return this.venues.filter( venue => {
          return venue.name.toLowerCase().includes(this.searchterm.toLowerCase());
        })
      }
    }
  }
}
</script>

<style scoped>
.component-container {
  display: inline-block;
  margin-top: 15px;
  width: 100%;
}
.text-input {
  width: 100%;
  max-width: 300px;
  padding: 5px;
  box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
}
.results-container {
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  max-height: 200px;
  overflow: scroll;
}
.results-container a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.results-container a:hover {
  background-color: #f1f1f1;
}
</style>
