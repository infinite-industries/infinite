// OurMission.vue
<template>
  <div class="container info-page">

    <h1>Our Mission</h1>

    <p>
      Infinite Industries makes experimental contemporary culture more accessible to everyone. Our digital platform and open-source tools highlight cultural events and experiences so more of us can discover, share and participate in them.
    </p>
    <h2>What does this mean in practice?</h2>
      <p>
        In a word: experience. Our online platform features a curated and regularly updated list of current cultural events that you can attend, encounter and immerse yourself in. The range of activities is broad: gallery openings, film, punk shows, theater, street art, orchestra, festivals, record releases, retrospectives, rap shows, house concerts, Thriller parades, comedy. Basically, if it’s happening, and it’s <em>happening</em>, Infinite Industries will let you know about it. We’re also developing tools that allow users to curate their own event lists and share them with friends, so you can call the shots about what’s going on and what’s worth doing.

      </p>
      <p>
        Right now, our focus is on the Lexington, Kentucky area (‘cause it’s home sweet home, that’s why), but we have solid plans in place to expand our geographic reach in an organic and meaningful fashion.
      </p>

      <h2>Why focus on "experimental"?</h2>

      <p>
        Culture isn’t fixed. It ebbs, flows, transforms and doubles back. Experimentation, play and exploration are paths by which we participate in culture’s creation, dreaming up scenarios where our social, political and financial norms are redefined. Infinite Industries focuses on makers, venues, events and processes whose experimentation untethers us from the everyday. Not only does this untethering help keep life interesting, but it also assists in making our collective future more human, more inhabitable, more

        <span id="fill-in-the-blank"
        v-on:mouseenter="FillInTheBlank('ON')"
        v-on:click="FillInTheBlank('ON')"
        v-on:mouseleave="FillInTheBlank('OFF')">
          <span v-if="show_blank">____________</span>
          <span v-else style="color:white;background-color:black;">...what are the values you'd like to see in the world that are conspicuously absent now, that you also believe art can help usher in?</span>
        </span>
      </p>

      <h2>Why make it accessible to “everyone”?</h2>

      <p>
        Why not? Too often the Arts and Culture sphere feels cloistered, closed off, tucked away for only those lucky few who are in the money and in-the-know. Or — conversely — it feels banal, over-simplified, like it has nothing to offer beyond a popularity contest. Diverse points of view, diverse thicknesses of wallets, diverse expressions and mediums — these things add to the vitality of a culture’s experiments. Without a lot of people making, participating, talking and experiencing, we can end up lost inside one of the monocultural extremes described above, lacking the varied sustenance we need to survive and thrive. Infinite Industries seeks to make the arts accessible to everyone, because we believe the arts can be primary in anyone’s life, regardless of what they like, how much money they have or where they live.
      </p>
      <h2>Why this? Why now?</h2>

      <p>
        Within our economy, data is abundant. It’s our audiences’ attention spans that are finite. As a non-profit  —That’s right. We’re a 501(c)(3) — we especially want to provide space for those cultural activities that fly under the radar. More often than not, they’re under the radar because they lack an advertising budget. Infinite Industries exists to provide a platform where folks can discover and promote some of these events, ideas, works and experiences in a space with few commercial constraints.
      </p>

      <h2>Finally, why the name?</h2>

      <p>
        Artists have always had to invent new genres and redefine working methods. The processes and mediums of the past are not always sufficient for the challenges and opportunities of the present and the future. Because of this reality, artists must constantly create an infinity of possibilities. Also, given the fact that humans tend to organize production trends beneath the umbrella term “industry,” combining the two felt appropriate.
      </p>


  </div>
</template>

<script>
export default {
  data: function(){
    return {
      show_blank: true
    }
  },
  methods: {
    FillInTheBlank: function(status){
      if(status==='ON'){
        this.show_blank=false;
      }
      else {
        this.show_blank=true;
      }
    }
  }
}
</script>

<style scoped>
  #fill-in-the-blank{
    cursor: pointer;
  }
</style>
