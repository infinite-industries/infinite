<template>
<div class="container info-page">
  <div id="Toolbar"></div>

  <div class="container form-container">
    <div class="copy-container">

      <h1>Subscribe to Weekly Email Event List</h1>
      <p>
        If it’s happening, and it’s happening - it’s here.
      </p>
      <p style="margin-top:0px;">
        Infinite Industries highlights experiments in contemporary culture so more of us can discover, share and participate. Gallery openings, punk shows, theater, street art, orchestra, museums, hip-hop, dance; it’s all here for you to experience.
      </p>
      <p>
        <b>Curated list of events delivered to your mailbox once a week.</b>
      </p>
    </div>

    <div id="mc_embed_signup">
      <form
        action="https://industries.us13.list-manage.com/subscribe/post?u=55944da642302ef43bc8c0f27&amp;id=f571a7e653"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        class="validate"
        target="_blank"
        novalidate>
        <div id="mc_embed_signup_scroll">

          <div class="layout row wrap">
              <div class="flex xs12 sm3">
                <label for="mce-EMAIL" class="form-label">Email Address:</label>
              </div>
              <div class="flex xs12 sm8">
                <div class="v-input brief-description v-text-field">
                  <div class="v-input__control">
                    <div class="v-input__slot">
                      <div class="v-text-field__slot">
                        <input type="email" value="" name="EMAIL" id="mce-EMAIL">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div class="layout row wrap">
            <div class="flex xs12 sm3">
              <label for="mce-FNAME" class="form-label">First Name:</label>
            </div>
            <div class="flex xs12 sm8">
              <div class="v-input brief-description v-text-field">
                <div class="v-input__control">
                  <div class="v-input__slot">
                    <div class="v-text-field__slot">
                      <input type="text" value="" name="FNAME" id="mce-FNAME">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="layout row wrap">
            <div class="flex xs12 sm3">
              <label for="mce-LNAME" class="form-label">Last Name:</label>
            </div>
            <div class="flex xs12 sm8">
              <div class="v-input brief-description v-text-field">
                <div class="v-input__control">
                  <div class="v-input__slot">
                    <div class="v-text-field__slot">
                      <input type="text" value="" name="LNAME" id="mce-LNAME">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="mce-responses" class="clear">
            <div class="response" id="mce-error-response" style="display:none"></div>
            <div class="response" id="mce-success-response" style="display:none"></div>
          </div>

          <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
          <div style="position: absolute; left: -5000px;" aria-hidden="true">
            <input type="text" name="b_55944da642302ef43bc8c0f27_f571a7e653" tabindex="-1" value=""/>
          </div>

          <div class="submit-container">
            <button type="submit" class="v-btn v-btn--depressed grey">Subscribe</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    methods: {
      isIos: function () {
        const userAgent = window.navigator.userAgent.toLowerCase()
        return /iphone|ipad|ipod/.test(userAgent)
      }
    },
    mounted: function () {
      const self = this
      document.getElementById('mc-embedded-subscribe-form').onsubmit = function (e) {
        if (!self.isIos()) {
          window.setTimeout(function () {
            window.location = window.location.origin + '/'
          }, 10)
        }
      }
    }
  }
</script>

<style scoped>
.form-container {
  padding: 10px;
  padding-left: 20px;
  border-radius: 10px;
  color: black;
  background-color: white;
  width: 85%;
}

h1, h2, h3 {
  font-family: "Open Sans", sans-serif;
  letter-spacing: .02em;

}

h1{
  font-size: 1.9em;
  font-weight: bold;
  margin-bottom: 0.7em;
}

h2, h3{
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: .5em;
}

p {
  font-family: "EB Garamond";
  font-size: 1.25em;
}

.copy-container {
  padding:20px;
}

.copy-container p {
  margin-top: 30px;
}

form {
  font-family: "Open Sans", sans-serif;
}

form .layout .form-label {
  display: block;
  padding-right: 15px;
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 22px;
  letter-spacing: normal;
  line-height: normal;
}

@media only screen and (min-width: 600px) {
  form .layout .form-label {
    text-align: right;
  }
}

@media only screen and (max-width: 576px) {

    .form-container {
        padding-left: 0px;
        padding-right: 0px;
    }

    .copy-container {
        padding-left: 0px;
        padding-right: 0px;
    }
}
form .submit-container {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
}
</style>
