<template>
  <div class="component-container">
    <input
      type="text"
      class="text-input venue"
      v-model="searchterm"
      placeholder="Search for a venue"
      @focusin="showDropdownContent()"
      @focusout="hideDropdownContent()"
      @keyup.enter="hitEnter()"
    />
    <div class="results-container" v-if="show">
      <div href="#" v-for="venue in queryResults" :key="venue.id" @mousedown="selectVenue(venue)">
        {{ venue.name }}
        <p>{{ venue.address }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['venues', 'initial_venue_id'],
    data: function () {
      return {
        searchterm: '',
        show: false
      }
    },
    methods: {
      showDropdownContent: function () {
        this.show = true
      },
      hideDropdownContent: function () {
        this.show = false
      },
      selectVenue: function (venue) {
        this.searchterm = venue.name
        this.hideDropdownContent()
        this.$emit('selectVenue', venue)
      },
      handleNewVenue: function (venue) {
        this.searchterm = venue.name
      },
      hitEnter: function () {
        if (this.queryResults.length === 1) {
          this.selectVenue(this.queryResults[0])
        }
      },
      initToVenueId: function () {
        const venue = this.venues.find(v => v.id === this.initial_venue_id)
        this.searchterm = (venue && venue.name) || this.searchterm
      }
    },
    mounted: function () {
      // for some reason these props aren't set when we get here
      // they _should_ be, though
      if (this.initial_venue_id && this.venues) {
        this.initToVenueId()
      }
    },
    computed: {
      queryResults: function () {
        if (this.venues === undefined) {
          return []
        } else {
          return this.venues.filter((venue) => {
            return venue.name.toLowerCase().includes(this.searchterm.toLowerCase()) ||
              venue.address.toLowerCase().includes(this.searchterm.toLowerCase())
          })
        }
      }
    },
    watch: {
      initial_venue_id: function (initial_venue_id, old_venue_id) {
        // this works around timing issues where this component's props aren't initialized at mount time
        // should only try to do this once, when initial_venue_id is populated
        if (!old_venue_id && initial_venue_id && this.venues && this.venues.length > 0) {
          this.initToVenueId()
        }
      },
      venues: function (venues, old_venues) {
        // more timing issues; need to rethink the way we're loading this data
        if ((!old_venues || old_venues.length === 0) && venues && venues.length > 0 && this.initial_venue_id) {
          this.initToVenueId()
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
