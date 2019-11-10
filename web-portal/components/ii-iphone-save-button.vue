// For reference -->
// https://www.netguru.co/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native

<template>
  <div id="installer-container" v-if="show_iphone_button_installer">
    install on IPhone
  </div>
</template>

<script>
export default {
  name: 'iPhoneButtonInstaller',
  data: function(){
    return {
      show_iphone_button_installer: false
    }
  },
  mounted: function(){
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      return /iphone|ipad|ipod/.test( userAgent )
    }
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone)

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      this.show_iphone_button_installer = true
    }
  }
}

</script>

<style scoped>
  #installer-container{
    position: fixed;
    width: 100%;
    height: 20px;
    bottom: 5px;
  }
</style>
