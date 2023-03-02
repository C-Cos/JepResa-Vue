<template>
  <v-app >
    <v-app-bar app class="primary">
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/reservation" tag="span" ><v-img class="ml-12" src="@/assets/jep-logo.png" height="40px" width="200px"> 
            </v-img></router-link>

      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn class="mr-10" color="white" target="_blank" text href="https://jaspevent.com">Contact</v-btn> 
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'App',

    data: () => ({
      //
    }),
    
  });
</script>
