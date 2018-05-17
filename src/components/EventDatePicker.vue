<template>
    <v-layout row wrap class="event-date-picker-container">
        <v-flex xs12 sm2>
            <h3 class="form-label">Title<span class="required-field">*</span>:</h3>
        </v-flex>
        <v-flex xs12 sm10>
            <v-text-field label="Date Title*" v-model="eventDateObject.title" :rules="[v => !!v || 'Title is required']"></v-text-field>
        </v-flex>
        <v-flex xs12 sm2>
            <v-btn fab dark small primary class="red floating-offset-left" @click="$emit('delete')">
                <v-icon dark>remove</v-icon>
            </v-btn>
            <h3 class="form-label">Date<span class="required-field">*</span>:</h3>
        </v-flex>
        <v-flex xs12 sm10>
            <v-menu :close-on-content-click="true">
                <v-text-field
                    slot="activator"
                    label="Start Date"
                    v-model="date"
                    prepend-icon="event"
                    readonly
                    :rules="[v => !!v || 'Required']"
                ></v-text-field>
                <v-date-picker v-model="date" no-title class="nomargin">
                    <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                        <v-btn flat color="primary" @click.native="cancel()">Cancel</v-btn>
                        <v-btn flat color="primary" @click.native="save()">OK</v-btn>
                        </v-card-actions>
                    </template>
                </v-date-picker>
            </v-menu>
        </v-flex>
        <v-flex xs12 sm2>
            <h3 class="form-label">Time<span class="required-field">*</span>:</h3>
        </v-flex>
        <v-flex xs12 sm5 class="some-padding-top">
            <time-picker :date="date" :label="'Start Time:'" @changeTime="formattedTime => { eventDateObject.time_start = formattedTime }"></time-picker>
        </v-flex>
        <v-flex xs12 sm5 class="some-padding-top">
            <time-picker :date="date" :label="'End Time:'" @changeTime="formattedTime => { eventDateObject.time_end = formattedTime }"></time-picker>
        </v-flex>
    </v-layout>
</template>
<script>
import TimePicker from "./TimePicker.vue";

export default {
    props: ["eventDateObject"],
    data: function() {
        return {
            date: undefined
        }
    },
    methods: {

    },
    computed: {

    },
    components: {
        'time-picker': TimePicker
    }
}
</script>
<style scoped>
.nomargin {
    margin: 0px;
}
.event-date-picker-container {
    padding: 4px 0px;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: rgb(205, 205, 205);
}
.some-padding-top {
    padding-top: 22px;
}
.required-field {
    color: red;
}
.form-label {
    text-align: right;
    padding-right: 15px;
    padding-top: 12px;
    font-size: 1.2em;
    margin-top: 10px;
    letter-spacing: normal;
    line-height: normal;
}
.floating-offset-left {
    position: absolute;
    left: -28px;
}
@media only screen and (max-width: 600px) {
    .form-label {
        text-align: left;
    }
}
</style>