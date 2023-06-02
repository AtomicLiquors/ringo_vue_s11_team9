<template>
  <v-container>
    <map-component @callPlan="callPlan"></map-component>
    <v-dialog v-model="mapDialog" max-width="600px">
      <v-card class="rounded-xl">
        <div style="background-color: #ffdb58; padding: 3px">
          <v-img
            :src="require('@/assets/img/logo/logo_white.png')"
            class="my-3"
            contain
            height="50"
          />
        </div>
        <component :is="modalType"></component>
      </v-card>
    </v-dialog>
    <v-btn
      fixed
      right
      bottom
      elevation="2"
      color="#FFDB58"
      rounded
      @click="goUp"
      >
      ▲
    </v-btn>
  </v-container>
  
</template>

<script>

import PlanListComponent from "@/components/plan/PlanListComponent.vue";
import MapComponent from "@/components/MapComponent.vue";
export default {
  components:{
    MapComponent,
    PlanListComponent
  },
  data(){
    return{
      mapDialog: false,
      modalType: null,
    }
  },
  
  methods:{
    callPlan() {
      this.mapDialog = true;
      this.modalType = PlanListComponent;
    },
    goUp(){
      window.scrollBy(0,-1000000)
    },
  }
}
</script>

<style>

</style>