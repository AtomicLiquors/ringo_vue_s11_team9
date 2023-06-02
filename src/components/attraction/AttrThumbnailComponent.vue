<template>
  <v-container class="mx-auto"
      justify="center" max-width="600">
    <v-row><p>hotplace</p></v-row>
    <v-card class="mx-auto" align="center" justify="center" outlined style="width: 50px; border:2px solid orange;"></v-card>

    <p class="mt-3"><small>관광객이 가장 많이 찾은 관광지입니다.<br>사진을 남기고, 나의 추억을 이야기해주세요!</small></p>
    
    <v-row>
      <v-col
        v-for="(item, index) in hotplace"
        :key="index"
        class="d-flex child-flex"
        cols="4"
        @click="openReviewModal(item.content_id)"
      >
        <v-hover v-if="index < 9" v-slot="{ hover }">
          <v-card class="mx-auto" color="#ffdb58" max-width="600">
            <v-img
              :aspect-ratio="16 / 9"
              :src="`${item.first_image}`"
              class="color"
            >
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="thumbnail-status justify-content-center align-items-center d-flex transition-fast-in-fast-out"
                  style="
                    height: 20%;
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    background-color: #ffdb58;
                  "
                >
                  <i class='bx bx-heart-circle'></i>&nbsp; {{ item.likes }}
                  <!--
                  &nbsp;|&nbsp;
                  <i
                    class="bx bxs-star bx-xs"
                  ></i>
                  &nbsp;4.5
                  -->
                </div>
              </v-expand-transition>
            </v-img>
            <v-card-text class="orange" style="position: relative">
              <div class="font-weight-light white--text overflow-hidden">
                {{ item.title }}
                <br />
                {{ item.addr1 }}
              </div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-dialog scrollable v-model="reviewDialog" max-width="800px">
      <v-card class="rounded-xl">
        <div style="background-color: #ffca58; padding: 3px">
          <v-img
            :src="require('@/assets/img/logo/logo_white.png')"
            class="my-3"
            contain
            height="50"
          />
        </div>

        <review-modal
          :selectedAttrId="selectedAttrId"
          @closeModal="reviewDialog = false"
        ></review-modal>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
/*
:attr="selectedContent"
    showReviewModal(attr) {
      this.selectedContent = attr;
      this.dialog = true;
      this.modalType = ReviewModal;
    },
 */
import restAPI from "@/util/http-common.js";
import ReviewModal from "@/components/modal/ReviewModal.vue";

export default {
  components: {
    ReviewModal,
  },
  data() {
    return {
      hotplace: {},
      reviewDialog: false,
      selectedAttrId: null,
    };
  },
  created() {
    this.getHotPlace("likes");
    console.log("hotplace here:");
    console.log(this.hotplace);
  },
  computed: {
    limitedHotplace() {
      // Get an array of keys from hotplace object
      const keys = Object.keys(this.hotplace);

      // Return a sliced object with limited keys and corresponding values
      return keys.slice(0, 9).reduce((obj, key) => {
        obj[key] = this.hotplace[key];
        return obj;
      }, {});
    },
  },
  methods: {
    openReviewModal(content_id) {
      (this.reviewDialog = true), (this.selectedAttrId = content_id);
    },

    getHotPlace(sort_type) {
      const uri = `/api/attractions`;

      const searchData = {
        sortType: sort_type,
      };

      restAPI
        .post(uri, searchData)
        .then(({ data }) => {
          this.hotplace = data;
        })
        .catch(() => console.log("관광지 조회 실패!"));
    },
  },
};
</script>


<style scoped>
@import "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
.overflow-hidden {
  text-overflow: ellipsis;
}
hr {
  margin: 90% 0 0 0;
}
* {
  font-family: "GyeonggiTitle";
  font-weight: bold;
}
.color {
  transition: opacity 0.2s ease-in-out;
}

.color:hover {
  opacity: 0.7;
}

.color:hover v-expand-transition {
  opacity: 1;
}

.thumbnail-status{
  color: #574E3B;
}

.thumbnail-status .bx-heart-circle{
  color: #E84C20;
}
</style>