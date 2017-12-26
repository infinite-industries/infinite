// EventCard.vue

<template>
  <v-card style="margin-bottom: 10px; min-height: 100%;" >
    <v-card-media :src="event.image" height="200px">
      <v-speed-dial v-model="fab" :top="true" :right="true" :direction="right">
      <v-btn slot="activator" class="purple lighten-3" dark fab hover v-model="fab">
        <v-icon>add_circle_outline</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <template>
        <div class="event-add-wrapper">
          <div class="event-add-to-list" @click="AddToList('eventTest','listOne')">+ List One</div>
          <div class="event-add-to-list" @click="AddToList('eventTest','listTwo')">+ List Two</div>
          <div class="event-add-to-list" @click="AddToList('eventTest','listThree')">+ List Three</div>
        </div>
      </template>
    </v-speed-dial>

    <!-- <v-btn absolute dark fab top right class="pink">
      <v-icon>add</v-icon>
    </v-btn> -->

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

  import EventBus from '../helpers/EventBus.js'

  export default {
    name:'EventCard',
    props: ['event'],
    data: function() {
      return {
        fab: false,
        added_to_list:false
      }
    },
    methods: {
      ShowEvent: function(event_id){
        console.log(event_id);
        window.location.assign('/events/'+ event_id)
      },
      AddToList: function(which_event, which_list){
        EventBus.$emit('ADD_EVENT_TO_MY_LIST', {_event:{id:which_event}, _list:{id:which_list}})
        this.added_to_list=true
      }
    },
  }
</script>
