<template>
  <div class="text-center d-flex flex-column" style="height: 100%">
    <div class="title-frame">
      <img class="tite-logo" src = @/assets/img/logo/logo_yellow.png/>
      <carousel-component></carousel-component>
    </div>

    <div class="mt-10"></div>

    <attr-thumbnail-component></attr-thumbnail-component>
    <!-- <attr-icon-component></attr-icon-component> -->
  </div>
</template>

<style scoped>
.title-frame {
  position: relative;
}

.tite-logo {
  position: absolute;
  width: 250px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.7));
}

carousel-component {
  z-index: 2;
  /* Your styles for the content container */
}


</style>


<script>
import CarouselComponent from "@/components/CarouselComponent.vue";
//import AttrIconComponent from "@/components/attraction/AttrIconComponent.vue";
import AttrThumbnailComponent from "@/components/attraction/AttrThumbnailComponent.vue";

export default {
  components: {
    CarouselComponent,
    AttrThumbnailComponent,
  },
  data: () => ({
    //vuetify v-bottom sheet data
    sheet: false,
  }),
};
</script>




