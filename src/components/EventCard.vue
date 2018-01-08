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
          {{event.venues[0]}}
        </div>
        <div class="event-date" v-html="event.when"></div>
        <div>{{event.brief_description}}...</div>
      </div>
    </v-card-title>

    <v-card-actions>
      <v-btn flat class="orange--text" @click.stop="ShowEvent(event.id)">More Info</v-btn>
      <span class="addtocalendar atc-style-blue">
          <var class="atc_event">
              <var class="atc_date_start">{{event.time_start}}</var>
              <var class="atc_date_end">{{event.time_end}}</var>
              <var class="atc_timezone">America/Detroit</var>
              <var class="atc_title">{{event.title}}</var>
              <var class="atc_description">{{event.brief_description}}</var>
              <var class="atc_ical_filename">{{event.slug}}</var>
              <var class="atc_location">{{event.venues[0]}}</var>
          </var>
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>

  export default {
    name:'EventCard',
    props: ['event'],
    data: function() {
      return {
        fab: false,
        added_to_list:false,
        card_visibility: true
      }
    },
    methods: {
      OpenOptionsDialog: function(){
        this.$bus.$emit('OPEN_OPTIONS_DIALOG', {calling_event:this.event.id})
        //call EventsList to open a dialog to add event to another list or remove from current
      },
      ShowEvent: function(event_id){
        console.log(event_id);
        window.location.assign('/events/'+ event_id)
      }
    },
    mounted: function(){
      
      const event_id = this.event.id
      const _self = this
      this.$bus.$on(event_id, function(payload) {

        if(payload.action === 'hide'){
          console.log("initial state", _self.card_visibility);
          _self.card_visibility = false
          console.log("confirmed action");
        }
      })
    }
  }
</script>
