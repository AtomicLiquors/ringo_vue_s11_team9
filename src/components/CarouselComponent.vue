<template>
  <v-carousel cycle hide-delimiter-background show-arrows-on-hover>
    <v-carousel-item v-for="(item, i) in items" :key="i" eager>
      <v-img :src="item.src" height="100%" eager />
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: require("@/assets/img/photo/main1.png"),
        },
        {
          src: require("@/assets/img/photo/main2.jpg"),
        },
        {
          src: require("@/assets/img/photo/main333.jpg"),
        },
        {
          src: "https://images.pexels.com/photos/1024981/pexels-photo-1024981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          src: require("@/assets/img/photo/main5.jpg"),
        },
      ],
    };
  },
};
</script>