// UserEvents.vue
<template>
    <!-- My List(s) -->

    <!-- Create New List -->

    <!-- Lists I follow -->

    <!-- Discover Mode with everything for my zip -->
    <div style="padding-top:30px;">
      <div class="user-events-item">
        my current lists here (need to think through an interface)

        <v-btn @click="CreateNewList()">+ Create Another List</v-btn>
      </div>

      <div class="user-events-item">
        Some lists I follow
        <ul>
          <li>WRFL Curated Events<v-btn @click="FollowList()">Follow</v-btn></li>
          <li>Death Metal Central<v-btn @click="CreateNewList()">Follow</v-btn></li>
          <li>UnderMain<v-btn @click="CreateNewList()">Follow</v-btn></li>
        </ul>
      </div>

      <div class="user-events-item">
        Discover new events in your area
        <div class="user-events-item">
          cards and shit here
        </div>
      </div>

    </div>

</template>

<script>
export default {
    // empty
}
</script>
