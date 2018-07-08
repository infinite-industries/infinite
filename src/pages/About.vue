// About.vue
<template>
  <v-container grid-list-xs id="static-page-wrapper">

        <h4>About</h4>
        <v-layout row>
          <v-flex sm6 xs12>
            <p>
              We are Infinite Industries:
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempor maximus augue at ornare. Ut tristique enim at justo molestie, vel dignissim lorem posuere. Nulla volutpat sodales blandit. Vestibulum tristique consequat est, nec bibendum turpis volutpat a. Fusce faucibus quis quam vel rhoncus. Nunc efficitur eleifend nibh in condimentum. Nunc quis efficitur justo. Morbi finibus, ex quis dapibus pharetra, diam lectus ultrices.
            </p>
          </v-flex>
          <v-flex sm6 xs12>
            <p>
              Nam quis diam rutrum, bibendum magna sit amet, semper magna. Curabitur fringilla sapien augue, vel consectetur augue pretium ac. Sed ullamcorper nisi leo, quis fermentum enim venenatis in. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse lacinia dolor leo. Suspendisse nec egestas est, eu fermentum odio. Integer ultrices, ipsum vitae accumsan euismod, quam erat feugiat ante.
            </p>
          </v-flex>
        </v-layout>          
        <div style="text-align: center;">
          <img class="logo-image card-shadow" src="images/ii_circle.png" />
        </div>
        <p>
          mission here
        </p>
        <!--
        <a href="/calendar/?name=test-cal-event"><button>Test Cal ICS Gen</button></a>
        \\\
        <a href="/calendar/?name=test-cal-event"><button>Test Cal Google Cal</button></a>
        -->
        <div class="ii-spacer">. . .</div>

        <v-layout row wrap>
          <v-flex sm6 xs12>
            <div class="contributor-container">
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
            </div>
          </v-flex>
          <v-flex sm6 xs12>
            <div class="contributor-container">
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
            </div>
          </v-flex>
          <v-flex sm6 xs12>
            <div class="contributor-container">
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
            </div>
          </v-flex>
          <v-flex sm6 xs12>
            <div class="contributor-container">
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
            </div>
          </v-flex>
        </v-layout>
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
.logo-image {
  border-radius: 100px;
  max-width: 200px;
}
.contributor-container {
  padding: 10px;
  margin: 10px;
}
.card-shadow {
  box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
}
</style>
