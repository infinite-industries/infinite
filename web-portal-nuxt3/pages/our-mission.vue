<template>
  <div class="container info-page">
    <h1>Our Mission</h1>

    <p>
      Infinite Industries makes experimental contemporary culture more accessible to everyone. Our digital platform and open-source tools highlight cultural events and experiences so more of us can discover, share and participate in them.
    </p>

    <h2>If it’s happening, and it’s happening - it’s here.</h2>
    <p>
      Infinite Industries highlights experiments in contemporary culture so more of us can discover, share and participate. Gallery openings, punk shows, theater, street art, orchestra, museums, hip-hop, dance; it’s all curated here for you to experience.
    </p>

    <h2>Art belongs to everyone who wants it</h2>
    <p>We’re an idealistic bunch. We understand that Art can be intimidating. It can feel like a privilege for the few who are in the money, or the few who are in the know; like it’s done for “them”, not for “us.” We want to change this. Infinite Industries makes Art accessible to everyone because Art can be primary to anyone.</p>

    <h2>Find the folks who aren’t paying to find you</h2>
    <p>We provide space for the cultural activities that fly under the radar, because the ones that do make it to your screen typically have an advertising budget to thank for it. As a non-profit, we believe in leveling ground where commercial constraints indeed constrain. </p>

    <h2>Experimental, contemporary culture is our way back</h2>
    <p>
      Culture isn’t fixed. It ebbs, flows, transforms, doubles back. Experimentation is the path for its creation and eventually, we find our lives redefined. Infinite Industries focuses on the experimentation that untethers us from the everyday. It keeps life interesting, and assists in making our collective future more human, more inhabitable, more

      <span
        id="fill-in-the-blank"
        @mouseenter="FillInTheBlank('ON')"
        @click="FillInTheBlank('ON')"
        @mouseleave="FillInTheBlank('OFF')"
      >
        <span v-if="show_blank">____________</span>
        <span v-else style="color:white;background-color:black;">...what are the values you'd like to see in the world that are conspicuously absent now, that you believe art can help usher in?</span>
      </span>
    </p>

    <h2>And finally, why the name?</h2>

    <p>
      Artists constantly evolve, inventing new genres and redefining their methods. The processes and mediums of the past aren’t always sufficient for the challenges of the future. We can thank artists for an <em>infinity</em> of possibilities. Production trends organize beneath the umbrella term <em>"industry,"</em> creating an <em>infinity</em> of industries and our special name ;)
    </p>

  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        show_blank: true
      }
    },
    methods: {
      FillInTheBlank: function (status) {
        if (status === 'ON') {
          this.show_blank = false
        } else {
          this.show_blank = true
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
