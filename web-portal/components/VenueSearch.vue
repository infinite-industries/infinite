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

      <!-- Existing Venue Results -->
      <div
        href="#"
        v-for="venue in queryResults"
        :key="venue.id"
        class="venue-result"
        @mousedown="selectVenue(venue)"
      >
        {{ venue.name }}
        <p>{{ venue.address }}</p>
      </div>

      <!-- Always-visible "Add New" Option -->
      <div
        class="add-new-option"
        @mousedown="openNewVenueModal"
      >
        + Add new venue...
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'VenueSearch',
    props: ['venues', 'initial_venue_id'],
    emits: ['selectVenue', 'openNewVenueModal'],
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
      openNewVenueModal: function () {
        // Hide the search dropdown
        this.hideDropdownContent()
        // Clear the search term
        this.searchterm = ''
        // Emit event to open the modal
        this.$emit('openNewVenueModal')
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
        if (!old_venue_id && initial_venue_id && this.venues && this.venues.length > 0) {
          this.initToVenueId()
        }
      },
      venues: function (venues, old_venues) {
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
  margin: 15px 0;
  width: 100%;
  position: relative;
}
.text-input {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
}
.results-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 2;
  max-height: 250px;
  overflow-y: auto;
}
.venue-result {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}
.venue-result:hover {
  background-color: #f1f1f1;
}
.venue-result p {
  font-size: 0.8em;
  color: rgb(88, 88, 88);
  margin: 0px;
}

.add-new-option {
  color: #1976d2;
  padding: 12px 16px;
  display: block;
  cursor: pointer;
  font-style: italic;
  border-top: 1px solid #e0e0e0; /* Separator line */
  background-color: #fff;
}
.add-new-option:hover {
  background-color: #e3f2fd;
}
</style>
