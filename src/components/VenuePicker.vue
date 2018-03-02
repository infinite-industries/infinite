<template>
  <div class="component-container">
    <input type="text" class="text-input" v-model="searchterm" placeholder="Search for a venue" @focusin="showDropdownContent()" @focusout="hideDropdownContent()" @keyup.enter="hitEnter()"/>
    <div class="results-container" v-if="show">
      <div href="#" v-for="venue in queryResults" @mousedown="selectVenue(venue)">
        {{venue.name}}
        <p>{{venue.address}}</p>
      </div>
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
          return venue.name.toLowerCase().includes(this.searchterm.toLowerCase())
          || venue.address.toLowerCase().includes(this.searchterm.toLowerCase());
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
  padding: 5px;
  box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
}
.results-container {
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  max-height: 250px;
  overflow: scroll;
}
.results-container div {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.results-container div:hover {
  background-color: #f1f1f1;
}
.results-container div p {
  font-size: 0.8em;
  color: rgb(88, 88, 88);
  margin: 0px;
}
</style>
