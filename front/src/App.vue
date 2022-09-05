<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <br>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <img src="./assets/logo.jpeg" alt="Logo" app>
          </v-list-item-title>
          <v-list-item-title class="text-h6">
            Módulo Acadêmico
          </v-list-item-title>          

        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link @click="title = item.title">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      prominent
      color="#fcb69f"
      dark
      src="./assets/bg.jpg"      
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>{{ title }}</v-app-bar-title>  

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
  data: () => ({
    title: 'Listar alunos',
    drawer: null,
    items: [
      { title: "Listar alunos", icon: "mdi-account-multiple", to: "/" },
      { title: "Listar funcionários", icon: "mdi-account", to: "/AddStudent" },
    ],
  }),
};
</script>

<style>
  .v-app-bar-title__content{
    width: 200px !important;
  }
</style>