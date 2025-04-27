<template>
  <v-row>
    <v-col cols="0" sm="3"></v-col>
    <v-col cols="12" sm="8">
      <v-expansion-panels multiple v-model="showAddVenue">
        <v-expansion-panel style="margin-bottom: 10px;" value="add-new">
          <v-expansion-panel-title>
            Add a New Venue:
          </v-expansion-panel-title>
          <v-expansion-panel-text style="padding: 0px 15px 0px 15px;">
            <!-- Venue Name -->
            <v-row wrap>
              <v-col cols="12">
                <v-text-field label="Venue Name*" v-model="new_venue.name" :rules="[v => !!v || 'Name is required']"></v-text-field>
              </v-col>
            </v-row>

            <!-- Street Address -->
            <v-row wrap>
              <v-col cols="12">
                <v-text-field label="Street Address*" v-model="new_venue.street" :rules="[v => !!v || 'Street Address is required']"></v-text-field>
              </v-col>
            </v-row>

            <!-- City -->
            <v-row wrap>
              <v-col cols="12">
                <v-combobox
                  label="City*"
                  v-model="new_venue.city"
                  :items="suggestedCities"
                  :rules="[v => !!v || 'City is required']"
                />
              </v-col>
            </v-row>

            <!-- State -->
            <v-row wrap>
              <v-col cols="12">
                <v-combobox
                  label="State*"
                  v-model="new_venue.state"
                  :items="suggestedStates"
                  :rules="[v => !!v || 'State is required']"
                />
              </v-col>
            </v-row>

            <!-- Zip -->
            <v-row wrap>
              <v-col cols="12">
                <v-text-field label="Zip Code*" v-model="new_venue.zip" :rules="[v => !!v || 'Zip Code is required']"></v-text-field>
              </v-col>
            </v-row>

            <!-- Neighborhood -->
            <v-row wrap>
              <v-col cols="12">
                <v-text-field label="Neighborhood" v-model="new_venue.neighborhood"></v-text-field>
              </v-col>
            </v-row>

            <!-- G-maps Link -->
            <v-row wrap>
              <v-col cols="12">
                <v-text-field label="Google Maps Link" v-model="new_venue.g_map_link"></v-text-field>
              </v-col>
            </v-row>

            <v-row wrap>
              <v-col cols="12" style="text-align: center">
                <v-btn style="color: black" dark outline :disabled="!venueRequiredFields" @click="submitNewVenue()">Add Venue</v-btn>
              </v-col>
              <v-col cols="12" style="text-align: center">
                <img v-if="showVenueLoadingSpinner" class="loading-spinner" src="~/assets/images/spinner.gif">
              </v-col>
            </v-row>

          </v-expansion-panel-text>

        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
  import { FETCH_ACTIVE_VENUES } from '../store/venues'

  export default {
    emits: ['newVenue'],
    data: function () {
      return {
        showAddVenue: [],
        showVenueLoadingSpinner: false, // maybe
        new_venue: {
          name: '',
          street: '',
          city: null,
          state: null,
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
        if (this.showAddVenue.length > 0) {
          this.showAddVenue = []
        } else {
          this.showAddVenue = 'add-new'
        }
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
        this.$nuxt.$apiService.post('/venues/', payload)
          .then((data) => {
            this.showVenueLoadingSpinner = false
            this.closeVenueDropdown()
            if (data.status === 'success') {
              this.$store.dispatch(FETCH_ACTIVE_VENUES)
              this.$emit('newVenue', data.venue)
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
