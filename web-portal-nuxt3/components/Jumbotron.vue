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
  import { useStore } from 'vuex'

  import Close from './vectors/Close.vue'

  const THROTTLE_INTERVAL = 5 * 60 * 1000 // 5 minutes

  const LAST_VIEWED = 'ii-jumbotron-viewed-at'

  function getLastViewed() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(LAST_VIEWED)
    } else return null
  }

  function setLastViewed() {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LAST_VIEWED, Date.now())
    }
  }

  export default defineNuxtComponent({
    name: 'Jumbotron',
    async setup () {
      const store = useStore()
      await callOnce('announcements', async () =>
        store.dispatch('LoadAnnouncements')
      )
    },
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
    mounted: function () {
      // see if jumbotron needs to open
      console.log('Jumbotron trying: ', this.currentAnnouncement, getLastViewed())
      if (this.currentAnnouncement && this.currentAnnouncement.message.trim().length !== 0) {
        const lastViewed = getLastViewed()
        if (!lastViewed || (Date.now() - parseFloat(lastViewed)) > THROTTLE_INTERVAL) {
          setLastViewed()
          this.open = true
        }
      }

      // close jumbotron if user presses escape
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('keydown', this.onKeyDown)
      }
    },
    unmounted: function () {
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
  })
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
