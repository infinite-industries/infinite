<template>
  <div class="container info-page">

    <h1>Who We Are</h1>

    <ul class="people-cards">
      <li>
        <div>
          <img class="member-portrait" src="~/assets/images/who_we_are/dima.jpg" width="150px" height="150px">
        </div>
        <div>
          <h3>Dmitry "Dima" Strakovsky</h3>
          <p class="bio">Dima is the Founder and Creative Director of Infinite Industries. Along with his coding and design know-how, he is a practicing artist and has run and curated a wide variety of art spaces. His experiences as a technologist and artist/curator finally united when he dreamed up Infinite Industries. Dima works with an awesome team of coders, designers and marketing folk to help bring this dream to all the screens near you.</p>
        </div>
      </li>
    </ul>

    <h2>Core Dev Team</h2>

    <ul class="people-cards">
      <li>
        <div>
          <img class="member-portrait" src="~/assets/images/who_we_are/chris.jpg" width="150px" height="150px">
        </div>
        <div>
          <h3>Chris Wininger</h3>
          <p class="bio long">
            Chris Wininger is a software engineer, electronic artist and lover of the weird. He is one half of the two person team that birthed the <a href="https://fongphone.com/" target="_new">Fong Phone</a>, a collaborator on interactive art exhibitions such as <a href="https://www.wegotrats.com/call-and-response/" target="_new">Call and Response</a> and the artist behind <a href="https://www.wegotrats.com/rules-play-gallery-hop/" target="_new">Every Picture Tells a Story</a> He currently works at <a href="https://www.sonatype.com/" target="_new">Sonatype</a> where he is passionate about open source and develops tools that enhance the security and quality of enterprise software.
          </p>
          <p class="link-block">
            <a href="https://github.com/chriswininger" target="_new">Github</a>
            <a href="https://twitter.com/remembersonly" target="_new">Twitter</a>
          </p>
        </div>
      </li>
      <li>
        <div>
          <img class="member-portrait" src="~/assets/images/who_we_are/matthew.jpg" width="150px" height="150px">
        </div>
        <div>
          <h3>Matthew Gidcomb</h3>
          <p class="bio">Matthew is a software developer in Lexington, KY. When not working on code, he is involved in voter engagement and community organizing, browsing shelves at local bookstores, and fantasizing about having sufficient free time to play Kerbal Space Program.</p>
          <p class="link-block">
            <a href="https://github.com/MatthewGidcomb" target="_new">Github</a>
          </p>
        </div>
      </li>
      <li>
        <div>
          <img class="member-portrait" src="~/assets/images/who_we_are/evan.jpg" width="150px" height="150px">
        </div>
        <div>
          <h3>Evan Heaton</h3>
          <p class="bio">
            Evan is a University of Kentucky grad, JavaScript enthusiast, and aspiring producer. He lives where creativity meets code.
          </p>
          <p class="link-block">
            <a href="https://github.com/epheat" target="_new">Github</a> <a href="https://m.soundcloud.com/photographer-746696387" target="_new">Soundcloud</a>
          </p>
        </div>
      </li>
    </ul>

    <p class="join-us">
      If you got the skills and the passion join us!
    </p>

    <h2>Core Design Team</h2>

    <p><a class="grow" href="https://bullhorncreative.com/" target="_blank">Bullhorn</a> generously donated their skills and time</p>
    <p>UI/UX work by Ben Byrum</p>

    <!-- <h2>Our Board:</h2>

    <p>Together with our fearless founder, these are the folks that steer the boat</p>

    <ul>
      <li>
        <h3>Brian Frye</h3>
        <p> About Brian </p>
      </li>
      <li>
        <h3>Arthur Shechet</h3>
        <p> About Art </p>
      </li>
    </ul> -->

    <h2>Thank you! Thank you! Thank you!</h2>

    <p>
      Shout out to all the folks who have made this happen by offering their time and advice: Brian Frye, Arthur Shechet, Eugene Lukin, Jill Schinberg, Nettie Tesmer, Jourdan Rahschulte, Michael Brewster, Reva Russell English, Armando Diaz, Richie Hoagland, Ming Ying Hong, Drura Parrish, Tiffany Palumbo, Roxanne Coburn, Nicole Rademacher.

      Apologies if we have forgotten anyone. Any omission is simply a function of cluttered minds and short deadlines.
    </p>
    <p>
      Giant thanks to Kasey Hall for marketing and promo work and <a href="https://www.visitlex.com/" target="_new">VisitLex</a> for helping us out with the publicity grant.
    </p>
    <p>
      We would also like to thank Microsoft for the server space and Google for email and other digital nourishment.
    </p>
    <p>
      And finally, thanks to open-projects that we love and use: <a href="https://nodejs.org/" target="_new">Node</a>, <a href="https://vuejs.org/" target="_new">Vue</a>, <a href="https://nuxtjs.org/">Nuxt</a>, <a href="https://momentjs.com/" target="_new">Moment</a>, <a href="https://www.cypress.io/" target="_new">Cypress</a>, and many others.
    </p>

  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>
  .people-cards {
    list-style-type: none;
  }

  .people-cards h3 {
    margin-top: 0;
  }

  .people-cards .member-portrait {
    margin-top: 1em;
  }

  .people-cards .link-block a {
    color: white;
    background-color: black;
    padding: 2px 6px 4px;
    border-radius: 5px;
  }

  @media only screen and (min-width: 600px) {

    .people-cards li:after {
      content: " ";
      display: block;
      height: 0;
      clear: both;
    }

    .people-cards .member-portrait {
      float: left;
      margin-right: 2em;
    }
  }

  .join-us {
    margin-top: 40px;
    text-align: center;
    font-size: 1.7em;
  }
</style>
