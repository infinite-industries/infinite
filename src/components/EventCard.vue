// EventCard.vue

<template>
  <v-card style="margin-bottom: 10px; min-height: 100%;" v-show="card_visibility">
    <v-card-media :src="event.image" height="200px">
      <v-speed-dial v-model="fab" :top="true" :right="true" :direction="right">
      <v-btn slot="activator" class="deep-purple lighten-1" dark fab hover v-model="fab" @click="OpenOptionsDialog()">
        <v-icon>playlist_add</v-icon>
        <!-- <v-icon>close</v-icon> -->
      </v-btn>
      <!-- <template>
        <div class="event-add-wrapper">
          <div class="event-add-to-list" @click="AddToList('eventTest','listOne')">+ List One</div>
          <div class="event-add-to-list" @click="AddToList('eventTest','listTwo')">+ List Two</div>
          <div class="event-add-to-list" @click="AddToList('eventTest','listThree')">+ List Three</div>
        </div>
      </template> -->
    </v-speed-dial>

    <div class="event-favorite" v-if="added_to_list">
      <v-icon class="purple--text event-favorite-icon">favorite</v-icon>
    </div>


    </v-card-media>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{event.title}}</h3>
        <div class="event-venue">
          {{event.venue}}
        </div>
        <div class="event-date" v-html="event.when"></div>
        <div>{{trimmedDescription}}</div>
      </div>
    </v-card-title>

    <v-card-actions class="card-actions">
      <v-btn flat class="orange--text" @click.stop="ShowEvent(event.id)">More Info</v-btn>
      <v-menu class="download-event-button" offset-y>
        <v-btn fab small color="white" slot="activator">
          <v-icon>event</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="calType in calTypes" @click="AddEventToCalendar(calType)">
            <v-list-tile-title>{{ calType }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script>

  import moment from 'moment'

  export default {
    name:'EventCard',
    props: ['event'],
    data: function() {
      return {
        fab: false,
        added_to_list:false,
        card_visibility: true,
        calTypes: ["iCal", "Outlook", "Google Calendar"]
      }
    },
    methods: {
      OpenOptionsDialog: function(){
        this.$bus.$emit('OPEN_OPTIONS_DIALOG', {calling_event:this.event})
        //call EventsList to open a dialog to add event to another list or remove from current
      },
      ShowEvent: function(event_id){
        console.log(event_id);
        window.location.assign('/events/'+ event_id)
      },
      AddEventToCalendar(calType) {
        if (calType === "iCal" || calType === "Outlook") {
          // send event data to node layer to be converted into an .ics file
          window.open(`/calendar?title=${encodeURIComponent(this.event.title)}&description=${encodeURIComponent(this.event.brief_description)}&location=${encodeURIComponent(this.event.address)}&time_start=${encodeURIComponent(this.event.time_start)}&time_end=${encodeURIComponent(this.event.time_end)}`);
        } else if (calType === "Google Calendar") {
          var time_start_formatted = moment(this.event.time_start).format('YYYYMMDDTHHmmss');
          var time_end_formatted = moment(this.event.time_end).format('YYYYMMDDTHHmmss');

          window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(this.event.title)}&dates=${encodeURIComponent(time_start_formatted)}/${encodeURIComponent(time_end_formatted)}&details=${encodeURIComponent(this.event.brief_description)}&location=${encodeURIComponent(this.event.address)}`);
        }
      }
    },
    computed: {
      trimmedDescription: function() {
        if (this.event.brief_description.length > 200) {
          return this.event.brief_description.substring(0, 200) + "...";
        } else {
          return this.event.brief_description;
        }
      }
    },
    mounted: function(){

      const event_id = this.event.id
      this.$bus.$on(event_id, payload => {

        if(payload.action === 'hide'){
          // console.log("initial state", _self.card_visibility);
          this.card_visibility = false
          // console.log("confirmed action");
        }
      })
    }
  }
</script>

<style scoped>
.card-actions {
  width: 100%;
}
.download-event-button {
  position: absolute;
  right: 0;
}
</style>
