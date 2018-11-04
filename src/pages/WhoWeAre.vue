// WhoWeAre.vue
<template>
  <div class="container info-page">

    <h1>Who We Are</h1>

    <ul>
      <li>
        <h3>Dmitry "Dima" Strakovsky</h3>
        <img class="member-portrait" src="images/who_we_are/dima.jpg" width="150px" height="150px">
        <p class="bio">Dima is the Founder and Creative Director of Infinite Industries. Along with his coding and design know-how, he is a practicing artist and has run and curated a wide variety of art spaces. His experiences as a technologist and artist/curator finally united when he dreamed up Infinite Industries. Dima works with an awesome team of coders, designers and marketing folk to help bring this dream to all the screens near you.</p>
        <div class="spacer"></div>
      </li>
    </ul>

    <h2>Core Dev Team</h2>

    <ul>
      <li>
        <h3>Chris Wininger</h3>
        <img class="member-portrait" src="https://picsum.photos/200/300" width="150px" height="150px">
        <p class="bio">About Chris</p>
        <div class="spacer"></div>
      </li>
      <li>
        <h3>Matthew Gidcomb</h3>
        <img class="member-portrait" src="images/who_we_are/matthew.png" width="150px" height="140px">
        <p class="bio">Matthew is a software developer in Lexington, KY. When not working on code, he is involved in voter engagement and community organizing, browsing shelves at local bookstores, and fantasizing about having sufficient free time to play Kerbal Space Program.</p>
        <p class="link-block">
          <a href="https://github.com/MatthewGidcomb" target="_new">Github</a>
        </p>
        <div class="spacer"></div>
      </li>
      <li>
        <h3>Evan Heaton</h3>
        <img class="member-portrait" src="images/who_we_are/evan.jpg" width="150px" height="150px">
        <p class="bio">
          Evan is a University of Kentucky grad, JavaScript enthusiast, and aspiring producer. He lives where creativity meets code.
        </p>
        <p class="link-block">
          <a href="https://github.com/epheat" target="_new">Github</a> <a href="https://m.soundcloud.com/photographer-746696387" target="_new">Soundcloud</a>
        </p>
        <div class="spacer"></div>
      </li>
    </ul>

    <p class="join-us">
      If you got the skills and the passion join us!
    </p>


    <h2>Core Design Team</h2>

    <p><a class="grow" href="https://bullhorncreative.com/" target="_blank">BullHorn Creative</a> generously donated their skills and time</p>
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
      Giant thanks to <a href="javascript:alert('?')">[Kasey’s company]</a> for marketing and promo work and <a href="https://www.visitlex.com/">VisitLex</a> for helping us out with the publicity grant.
    </p>
    <p>
      We would also like to thank Microsoft for the server space and Google for email and other digital nourishment.
    </p>
    <p>
      And finally, thanks to open-projects that we love and use: <a href="https://nodejs.org/">Node</a>, <a href="https://vuejs.org/">Vue</a>, <a href="https://momentjs.com/">Moment</a>, <a href="https://www.cypress.io/">Cypress</a>, and many others.
    </p>



  </div>
</template>

<script>
  export default {
    //
  }
</script>

<style scoped>

  ul {
    list-style-type:none
  }

  .join-us {
    margin-top: 40px;
    text-align: center;
    font-size: 1.7em;
  }

  .bio {
    padding-top: 20px;
  }

  a:visited, a:active, a:link {
    color: white;
    background-color: black;
    padding: 4px;
    padding-top: 2px;
  }


  @media only screen and (min-width: 960px) {

    .bio {
      padding-left: 180px;
    }

    .link-block {
      padding-left: 180px;
      margin-top: 0px;
    }

    .member-portrait {
      float:left;
    }

    .spacer {
      clear: both;
    }
  }


</style>
