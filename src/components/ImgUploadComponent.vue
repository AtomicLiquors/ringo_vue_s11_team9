<template>
  <v-container @click="showFileUpload">
    <v-file-input
      id="fileInput"
      style="display: none"
      v-model="image"
      outlined
      dense
      @change="onFileChange"
    />
    <v-img :src="getImageSource" style="border-radius: 5%; max-width: 200px" />
    <div><small>클릭하여 이미지 업로드</small></div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["type"],

  data() {
    return {
      image: undefined,
      // to save image url
      imageUrl: "",
      //파일 첨부할 이미지 URL
      currentType: "profile",
    };
  },
  /*
  watch: {
    type(newVal) {
      this.currentType = newVal;
    },
  },
*/
  created() {
    this.currentType = this.type;
  },

  computed: {
    ...mapState("memberStore", ["userInfo"]),

    getImageSource() {
      if (this.imageUrl !== "") {
        return this.imageUrl;
      } else if (this.userInfo !== null && this.userInfo.user_img !== null) {
        return require(`@/assets/upload/profile/img/${this.userInfo.user_img}`);
      } else if (this.currentType == "photo") {
        return require("@/assets/img/util/photo_default.jpg");
      } else {
        return require("@/assets/img/util/profile_default.png");
      }
    },
  },

  methods: {
    showFileUpload() {
      const fileInput = document.getElementById("fileInput");
      fileInput.click();
    },
    createImage(file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    onFileChange(file) {
      if (!file) {
        return;
      }
      this.createImage(file);
      this.$emit("fileChanged", file);
    },
  },
};
</script>

<style>
</style>
