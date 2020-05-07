<template>
  <div v-show="open" id="jumbotron">
    <div id="content">
      <div id="close-jumbotron">
        <button @click="CloseJumbotron">
          <ii-close width="25" height="25" iconColor="#000000" />
        </button>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="message"
        v-if="currentAnnouncement"
        v-html="currentAnnouncement.message"
      ></div>
    </div>
  </div>
</template>

<script>
  import Close from './vectors/Close.vue'

  export default {
    name: 'Jumbotron',
    data: function () {
      return {
        open: false
      }
    },
    computed: {
      currentAnnouncement: function () {
        return this.$store.getters.GetActiveAnnouncement
      }
    },
    fetch: function () {
      return this.$store.dispatch('LoadAnnouncements').then(() => {
        if (this.currentAnnouncement && this.currentAnnouncement.message.trim().length !== 0) {
          this.open = true
        }
      })
    },
    mounted: function () {
      // close jumbotron if user presses escape
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('keydown', this.onKeyDown)
      }
    },
    destroyed: function () {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('keydown', this.onKeyDown)
      }
    },
    methods: {
      CloseJumbotron: function () {
        this.open = false
      },
      onKeyDown: function (e) {
        if (e && (e.key === 27 || e.keyCode === 27)) {
          this.CloseJumbotron()
        }
      }
    },
    components: {
      'ii-close': Close
    }
  }
</script>

<style scoped>
  #jumbotron {
    position:fixed;
    padding:0;
    margin:0;

    top:0;
    left:0;

    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.8);

    color: white;
    z-index: 1024;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  #content {
    border: 1px white solid;
    margin-left: auto;
    margin-right: auto;

    width: 75%;

    padding: 20px;
    border-radius: 5px;

    font-family: "EB Garamond";
    font-size: 1.25em;

    background-color: white;
    color: black;
  }

  @media only screen and (min-width: 960px) {
    #content {
      width: 50%;
    }
  }

  #close-jumbotron {
    text-align: right;
  }

</style>
