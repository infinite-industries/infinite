<template>
  <v-layout row>
    <v-flex xs0 sm3></v-flex>
    <v-flex xs12 sm8>
      <v-expansion-panel expand style="margin-bottom: 10px;" v-model="showAddVenue">
        <v-expansion-panel-content style="padding: 0px 15px 0px 15px;">
          <div slot="header">Add a New Venue:</div>

          <!-- Venue Name -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="Venue Name*" v-model="new_venue.name" :rules="[v => !!v || 'Name is required']"></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Street Address -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="Street Address*" v-model="new_venue.street" :rules="[v => !!v || 'Street Address is required']"></v-text-field>
            </v-flex>
          </v-layout>

          <!-- City -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-combobox
                label="City*"
                value="Lexington"
                v-model="new_venue.city"
                :items="suggestedCities"
                :rules="[v => !!v || 'City is required']"
              />
            </v-flex>
          </v-layout>

          <!-- State -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-combobox
                label="State*"
                value="Kentucky"
                v-model="new_venue.state"
                :items="suggestedStates"
                :rules="[v => !!v || 'State is required']"
              />
            </v-flex>
          </v-layout>

          <!-- Zip -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="Zip Code*" v-model="new_venue.zip" :rules="[v => !!v || 'Zip Code is required']"></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Neighborhood -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="Neighborhood" v-model="new_venue.neighborhood"></v-text-field>
            </v-flex>
          </v-layout>

          <!-- G-maps Link -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="Google Maps Link" v-model="new_venue.g_map_link"></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 style="text-align: center">
              <v-btn style="color: black" dark outline :disabled="!venueRequiredFields" @click="submitNewVenue()">Add Venue</v-btn>
            </v-flex>
            <v-flex xs12 style="text-align: center">
              <img v-if="showVenueLoadingSpinner" class="loading-spinner" src="images/spinner.gif">
            </v-flex>
          </v-layout>

        </v-expansion-panel-content>

      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
  import { FETCH_ACTIVE_VENUES } from '../store/venues'

  export default {
    data: function () {
      return {
        showAddVenue: [false],
        showVenueLoadingSpinner: false, // maybe
        new_venue: {
          name: '',
          street: '',
          city: '',
          zip: '',
          neighborhood: '',
          g_map_link: ''
        }
      }
    },
    computed: {
      venueRequiredFields: function () {
        return this.new_venue.name !== '' &&
          this.new_venue.street !== '' &&
          this.new_venue.city !== '' &&
          this.new_venue.state !== '' &&
          this.new_venue.zip !== ''
      },
      // We suggest cities that are represented in our data as of Feb 2022
      suggestedCities: function () {
        return [
          'Lexington',
          'Danville',
          'Versailles',
          'Frankfort',
          'Berea',
          'Richmond',
          'Whitesburg',
          'Harrodsburg',
          'Georgetown',
          'Louisville',
          'Midway',
          'Winchester',
          'Nicholasville',
          'Cincinnati',
          'Covington',
          'Morehead',
          'Pikeville',
          'Hazard',
          'Paris',
          'Mount Sterling'
        ]
      },
      // We suggest states that border Kentucky
      // and are represented in our data as of Feb 2022
      suggestedStates: function () {
        return [
          'Kentucky',
          'Ohio',
          'West Virginia',
          'Tennessee'
        ]
      }
    },
    methods: {
      toggleVenueDropdown: function () {
        this.showAddVenue[0] = !this.showAddVenue[0]
      },
      closeVenueDropdown: function () {
        this.showAddVenue = []
      },
      submitNewVenue: function () {
        const newVenue = this.new_venue
        const payload = {
          name: newVenue.name,
          address: [
            newVenue.street,
            newVenue.city,
            newVenue.state,
            newVenue.zip,
            newVenue.neighborhood
          ].filter(a => a).join(', '),
          street: newVenue.street,
          city: newVenue.city,
          state: newVenue.state,
          zip: newVenue.zip,
          neighborhood: newVenue.neighborhood,
          g_map_link: newVenue.g_map_link
        }
        this.showVenueLoadingSpinner = true
        this.$apiService.post('/venues/', payload)
          .then((response) => {
            this.showVenueLoadingSpinner = false
            this.closeVenueDropdown()
            if (response.data.status === 'success') {
              this.$store.dispatch(FETCH_ACTIVE_VENUES)
              this.$emit('newVenue', response.data.venue)
            }
          }).catch((err) => {
            console.error(err)
          })
      }
    }
  }

</script>
<style scoped>
  .theme--dark.v-btn.v-btn--disabled:not(.v-btn--icon):not(.v-btn--flat) {
    background: transparent !important;
    border: 1px solid !important;
  }
  .theme--dark.v-btn.v-btn--disabled {
    color: rgba(0, 0, 0, 0.4) !important;
  }
</style>
