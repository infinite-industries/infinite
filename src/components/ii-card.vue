<template>
  <div class="card-container">
    <div class="card-overlay" v-show="showCalendars" @click.stop="CloseCalendars()"></div>
    <div class="infinte-card">
        <div class="image-container">
          <div class="image-surface" :style="backGroundImage"></div>
        </div>
        <div class="info-container">
          <h3>{{calendar_event.title | truncate(33)}}</h3>
          <h4>{{venue_info.name}}<ii-location iconColor="#B7B09C" width="12" height="12" /></h4>

          <p class="date">{{when_date}}</p>
          <p class="time">{{when_time}}</p>

          <p class="description">{{calendar_event.brief_description | truncate(90)}} </p>

          <div class="btn-actions">
            <span class="card-btn more-info" style="cursor: pointer" @click.stop="ShowEvent(calendar_event.id)">More Info</span>
            <span class="card-btn add-to-calendar" style="cursor: pointer" @click.stop="OpenCalendars()"><ii-calendar iconColor="#fff" width="17" height="17" class="ii-calendar"/>Add to Calendar</span>
          </div>

          <div class="drop-down" v-show="showCalendars">
            <div @click.stop="AddEventToCalendar('iCal')">iCal</div>
            <div @click.stop="AddEventToCalendar('Outlook')">Outlook</div>
            <div @click.stop="AddEventToCalendar('Google Calendar')">Google Cal</div>
          </div>
        </div>
    </div>
   </div>

</template>


<script>
  import Location from './vectors/Location.vue'
  import Calendar from './vectors/Calendar.vue'

  import moment from 'moment'

  export default {
    name: 'Card',
    props: ['calendar_event'],
    data: function(){
      return {
        showCalendars: false
      }
    },
    methods: {
      OpenCalendars: function(){
        this.showCalendars = true
      },
      CloseCalendars: function(){
        this.showCalendars = false
      },
      ShowEvent: function(event_id){
        window.location.assign('/events/'+ event_id)
      },
      AddEventToCalendar(calType) {
        // console.log(calType);
        if (calType === "iCal" || calType === "Outlook") {
          // send calendar_event data to node layer to be converted into an .ics file
          window.open(`/calendar?title=${encodeURIComponent(this.calendar_event.title)}&description=${encodeURIComponent(this.calendar_event.brief_description)}&location=${encodeURIComponent(this.calendar_event.address)}&time_start=${encodeURIComponent(this.calendar_event.time_start)}&time_end=${encodeURIComponent(this.calendar_event.time_end)}`);
        } else if (calType === "Google Calendar") {
          var time_start_formatted = moment(this.calendar_event.time_start).format('YYYYMMDDTHHmmss');
          var time_end_formatted = moment(this.calendar_event.time_end).format('YYYYMMDDTHHmmss');

          window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(this.calendar_event.title)}&dates=${encodeURIComponent(time_start_formatted)}/${encodeURIComponent(time_end_formatted)}&details=${encodeURIComponent(this.calendar_event.brief_description)}&location=${encodeURIComponent(this.calendar_event.address)}`);
        }
      }
    },
    mounted: function(){
      console.log('card loaded:', this.calendar_event);
    },
    computed:{
      backGroundImage: function(){
        return "background: url('"+this.calendar_event.image+"') center center / cover no-repeat;"
        //
      },
      venue_info: function() {
        let all_venues = this.$store.getters.GetAllVenues

        let current_venue = all_venues.find((venue) => {
          return venue.id === this.calendar_event.venue_id
        })

        if(current_venue === undefined){
          return {}
        }
        else{
          return current_venue
        }

      },
      when_date: function() {
        const calendar = this.calendar_event
        const dateTimes = calendar.date_times
        const firstDay = dateTimes[0]
        return moment(firstDay.start_time).format('dddd, MMMM Do')
      },
      when_time: function() {
        const calendar = this.calendar_event
        const dateTimes = calendar.date_times
        const firstDay = dateTimes[0]
        let output_string = moment(firstDay.start_time).format('h:mma - ')+moment(firstDay.end_time).format('h:mma')
        return output_string
      },
    },
    filters: {
      truncate: function(text, stop, clamp){
      	return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
      }
    },
    components:{
      'ii-location': Location,
      'ii-calendar': Calendar
    }

  }
</script>

<style scoped>

/* TODO fix me on iPhones!  https://stackoverflow.com/questions/46313640/iphone-x-8-8-plus-css-media-queries */
  .card-overlay{
    position: fixed;
    z-index: 4;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
  }

  .card-container {
    /* border: 1px solid red; */
    min-width: 380px;
    min-height: 100px;

    padding:10px;
    /* margin: 5px; */
  }

  .infinte-card{
    position: relative;

    display:flex;

    width: 380px;
    min-height: 220px;

    border-radius: 10px;

    background-color: white;
    color: black;
  }

  .image-container{
    position: absolute;

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

    min-height: 220px;
    min-width: 170px;

    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    overflow: hidden;

    text-align: center;

    /* border: 1px solid black;  */
  }

  .image-container .image-surface{

    min-width: 170px;
    min-height: 220px;

    -moz-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

  }

  .image-container:hover .image-surface {
    -moz-transform: scale(1.1);
    -webkit-transform: scale(1.1);
    transform: scale(1.1);

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

  }


  .info-container{
    position: absolute;
    left: 170px;

    min-height: 210px;
    min-width: 190px;

    padding: 12px;
    padding-top: 15px;

  }

  .info-container h3 {
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 15px;
    margin-top: 0px;

    padding-right: 10px;
  }

  .info-container h4 {
    font-family: 'Open Sans', sans-serif;
    font-weight: 200;
    font-size: 11px;
    margin-bottom: 10px;
  }

  .info-container .date, .info-container .time {
    font-family: 'Open Sans', sans-serif;
    font-weight: 200;
    font-style: italic;
    font-size: 11px;
    margin-bottom: 0px;
  }

  .info-container .description {
    font-family: 'EB Garamond', serif;
    font-size: 11px;
    padding-right: 12px;

    margin-top: 10px;
  }

  .btn-actions {
    position: absolute;
    bottom: 8px;


    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
    color: white;
  }

  .ii-calendar {
    position: relative;
    top: 5px;
    margin-right: 3px;
  }
  .card-btn {
    border-radius: 5px;
    padding: 7px;
  }

  .add-to-calendar {
    background-color: #B7B09C;
    margin-left: 5px;
  }

  .more-info {
    background-color: #000;
  }

  .drop-down{
    position: absolute;
    bottom: -80px;
    right: 15px;
    z-index: 5;
    /* border: 2px solid white; */

    color: white;
    background-color: #B7B09C;
    border-radius: 10px;
    padding-top: 5px;
    padding-right:45px;
    padding-left: 10px;
    padding-bottom: 10px;

    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
  }

  .drop-down div {
    margin-top: 5px;
    width:100%;
  }

  .drop-down div:hover {
    text-decoration: underline;
  }


  @media only screen and (max-width: 890px) {

    .card-container {
      /* border: 1px solid red; */
      min-width: 220px;
      min-height: 380px;

      padding:5px;
      /* margin: 5px; */
    }

    .infinte-card{

      width: 220px;
      min-height: 380px;

      border-radius: 10px;
    }

    .image-container{

      min-height: 150px;
      min-width: 220px;

      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 0px;
    }

    .image-container .image-surface{

      min-width: 220px;
      min-height: 150px;

      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 0px;
    }

    .info-container{
      position: absolute;
      top: 150px;
      left: 0px;

      min-height: 230px;
      min-width: 220px;

      padding: 12px;
      padding-top: 15px;
    }

    .btn-actions {
      bottom: 20px;
      padding-left: 5px;
    }

    .drop-down{
      bottom: -70px;
      right: 20px;
    }

  }

@media only screen and (max-width: 480px) {
  .card-container {
    /* border: 1px solid red; */
    min-width: 85%;
    min-height: 520px;

    padding:5px;
    margin-bottom: 20px;
  }

  .infinte-card{

    width: 85%;
    min-height: 520px;

    border-radius: 10px;

    margin-left: auto;
    margin-right: auto;
  }

  .image-container{

    min-height: 200px;
    min-width: 100%;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0px;

  }

  .image-container .image-surface{

    min-width: 100%;
    min-height: 200px;

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0px;

  }

  .info-container{

    top: 200px;
    left: 0px;

    min-height: 300px;
    min-width: 220px;

    padding: 18px;
    padding-top: 15px;
  }

  .info-container h3 {
    font-size: 20px;
    padding-right: 10px;
    margin-top: 0px;
  }

  .info-container h4 {

    font-size: 16px;
    margin-bottom: 10px;
  }

  .info-container .date, .info-container .time {
    font-size: 15px;
    margin-bottom: 0px;
  }

  .info-container .description {
    font-size: 15px;
    padding-right: 12px;

    margin-top: 13px;
  }

  .card-btn {
    border-radius: 5px;
    padding: 7px;
  }

  .add-to-calendar {
    background-color: #B7B09C;
    margin-left: 5px;
  }

  .more-info {
    background-color: #000;
  }

  .drop-down{
    bottom: -110px;
    right: 20px;

    border-radius: 10px;
    padding-top: 5px;
    padding-right:45px;
    padding-left: 10px;
    padding-bottom: 10px;

    font-size: 18px;
  }

  .btn-actions {
    bottom: 8px;
    right: 20px;
    font-size: 1em;

  }

  .ii-calendar {
    position: relative;
    top: 5px;
    margin-right: 3px;
  }

}


</style>
