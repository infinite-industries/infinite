<template>
  <div class="container admin-page">
    <DatePicker :allow-past="allowPast" :date="picker" @change="dateChanged" />

<!--    <date-time-picker v-model="dateTimes" :mode="'upload'" @change="onDateTimeVenueChanged" />-->
  </div>
</template>

<script setup>

const { picker, allowPast, dateTimes } = defineProps(['picker', 'allowPast', 'dateTimes' ])

function onDateTimeVenueChanged() {
  console.log('!!! onDateTimeVenueChanged');
}
// const props = defineProps({
//   picker: {
//     type: String, // Defines the type of the prop
//     default: picker, // Sets a default value for the prop (optional)
//   },
//   allowPast: {
//     type: Boolean,
//     default: false
//   }
// });

const dataChanged = () => {
  console.log('!!! data changed')

}
</script>

<style>

</style>
