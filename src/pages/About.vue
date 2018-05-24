// About.vue
<template>
  <v-container grid-list-xs id="static-page-wrapper">

        <h4>About</h4>

        <p>
          mission here
        </p>
        <!--
        <a href="/calendar/?name=test-cal-event"><button>Test Cal ICS Gen</button></a>
        \\\
        <a href="/calendar/?name=test-cal-event"><button>Test Cal Google Cal</button></a>
        -->
        <div class="ii-spacer">. . .</div>

        <p>
          <h2>
            <v-avatar class="teal">
              <span class="white--text headline">D</span>
            </v-avatar>
            Dima
          </h2>
          <p class="brief-bio">
            people here
          </p>
          <p class="personal-social-media">
            facebook | twitter | medium | github | website
          </p>
        </p>
        <p>
          <h2>
            <v-avatar class="red">
              <span class="white--text headline">C</span>
            </v-avatar>
            Chris
          </h2>
          <p class="brief-bio">
            people here
          </p>
          <p class="personal-social-media">
            facebook | twitter | medium | github | website
          </p>
        </p>
        <p>
          <h2>
            <v-avatar class="indigo darken-2">
              <span class="white--text headline">E</span>
            </v-avatar>
            Eugene
          </h2>
          <p class="brief-bio">
            people here
          </p>
          <p class="personal-social-media">
            facebook | twitter | medium | github | website
          </p>
        </p>
        <p>
          <h2>
            <v-avatar>
              <img src="images/evan.jpg" alt="Evan">
            </v-avatar>
            Evan
          </h2>
          <p class="brief-bio">
            Front-end
          </p>
          <p class="personal-social-media">
            facebook | twitter | medium | github | <a href="http://wallchart.tk">website</a>
          </p>
        </p>
        <p>
          And many awesome peoples from the past.
        </p>
        <p>
          On org level please like and follow us on the social media of your choice.

          <p>
            Looking forward to your comments on <a href="https://www.facebook.com/Infinite-Industries-1041120505976874/" target="_new">Facebook</a> and some terse prose on <a href="https://twitter.com/1nfinite_1" target="_new">Twitter</a>.
          </p>

          <p>
            If enjoy longer-form writing, please <a href="https://medium.com/infinite-industries" target="_new">check us out on Medium</a>. Appreciate any highlights, <3 or comments.
          </p>
          <p> If <a href="https://www.instagram.com/1nfinite_1ndustries/" target="_new">Instagram</a> is your thing, we got one of those. All the messages, comments and, of course, hashtags are super welcome and definitely nurture our will to live and thrive ;) i.e. regardless if you actually read this far or just skipped to the end, BIG THNX for checking us out!
        </p>

  </v-container>
</template>

<script>
export default {
  methods: {
    TestCal: function(){

    }
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 8px;
}
.personal-social-media {
  margin-bottom: 20px;
}
.ii-spacer {
  margin: 20px;
  font-size: 20px;
  text-align: center;
}
</style>
