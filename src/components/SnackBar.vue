<template>
    <v-snackbar
        :value.sync="displaySnack"
        elevation="15"
        right
        top
        >
        {{ notif }}

        <template v-slot:action="{ attrs }">
            <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="displaySnackbar(false)"
            >
            Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
    import Vue from 'vue'
    import {mapMutations, mapActions} from 'vuex';

    export default Vue.extend({
        name: 'MySnackBar',

        methods:{
            ...mapActions([ 'setSnackBar']),
            ...mapMutations(['displaySnackbar']),
        },
        computed:{
            notif(){
                return this.$store.state.notif;
            },
            displaySnack(){
                return this.$store.state.displaySnack;
            }
        },
})
</script>

       