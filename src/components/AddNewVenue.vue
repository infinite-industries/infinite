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

          <!-- Venue Address -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="Address*" v-model="new_venue.address" :rules="[v => !!v || 'Address is required']"></v-text-field>
            </v-flex>
          </v-layout>

          <!-- City -->
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="City*" v-model="new_venue.city" :rules="[v => !!v || 'City is required']"></v-text-field>
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
              <v-text-field label="Google Maps Link" v-model="new_venue.google_maps_link"></v-text-field>
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
  import Axios from 'axios'

  export default {
    data: function () {
      return {
        showAddVenue: [false],
        showVenueLoadingSpinner: false,    // maybe
        new_venue: {
          name: "",
          address: "",
          city: "",
          zip: "",
          neighborhood: "",
          google_maps_link: ""
        }
      }
    },
    computed: {
      venueRequiredFields: function() {
        return this.new_venue.name != "" &&
          this.new_venue.address != "" &&
          this.new_venue.city != "" &&
          this.new_venue.zip != "";
      }
    },
    methods: {
      toggleVenueDropdown: function() {
        this.showAddVenue[0] = !this.showAddVenue[0]
      },
      closeVenueDropdown: function() {
        this.showAddVenue = [];
      },
      submitNewVenue: function() {
        this.showVenueLoadingSpinner = true;
        Axios.post('/venues/submit-new', this.new_venue).then( response => {
          this.showVenueLoadingSpinner = false;
          this.closeVenueDropdown();
          if (response.data.status == "success") {
            this.$store.dispatch('LoadAllVenueData')
          }
        }).catch( err => {
          console.error(err);
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
