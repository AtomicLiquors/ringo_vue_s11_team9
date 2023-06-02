<template>
  <v-card>
    <v-row align="center">
      <!--관광지 타입 아이콘으로 표시할 수 있나요?-->
      <v-col cols="1"></v-col>
      <v-col cols="6" align="left">
        <v-card-title>{{ attr.title }}</v-card-title>
        <v-card-text>{{ attr.addr1 }}</v-card-text>
        <v-card-text><i class='bx bx-heart-circle'></i> {{ attr.likes }}</v-card-text>
      </v-col>
      <v-col cols="4">
        <v-img :src="attr.first_image" tile max-width="150"></v-img>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

    <v-container>
      <v-card>
        <v-container>
          <small class="text-muted">{{
            preview
          }}</small>
        </v-container>
      </v-card>
      <v-btn class="mt-2" @click="toggleExpansion">상세설명 펼치기/접기</v-btn>
    </v-container>
    <v-container class="mt-5">
      <h4 style="font-family: GyeonggiTitle">리뷰</h4>
    </v-container>
    <hr />
    <v-container v-model="reviews">
      <v-row v-for="(item, index) in reviews" :key="index">
        <v-col cols="3">
          <v-img :src="getPhotoImageinfo(item.review_img)"></v-img>
        </v-col>
        <v-col cols="7" align="left">
          <div>
            {{ item.review_title }}
            &nbsp;|&nbsp;
            <img
              :src="getProfileImageinfo(item.user_img)"
              style="width: 20px; height: 20px; border-radius: 100%"
            />

            <small>{{ item.user_id }}</small>
          </div>

          <small>
            {{ item.review_content }}
          </small></v-col
        >
        <v-col cols="2" style="padding-right: 10px">
          <div v-show="userInfo != null && userInfo.user_id == item.user_id">
            <v-btn>수정</v-btn>
            <v-btn class="mt-2">삭제</v-btn>
          </div></v-col
        >
        <hr />
      </v-row>
    </v-container>
    <v-container v-if="isWritingReview">
      <v-row>
        <v-card-title>새 리뷰 작성하기</v-card-title>
        <v-col cols="3">
          <img-upload-component
            :type="'photo'"
            @fileChanged="file = $event"
          ></img-upload-component>
        </v-col>
        <v-col cols="8" align="left">
          <v-text-field
            v-model="newReview.review_title"
            label="리뷰 제목*"
          ></v-text-field>
          <v-text-field
            v-model="newReview.review_content"
            label="리뷰 내용*"
          ></v-text-field
        ></v-col>
        <v-col @click="submit" cols="1" style="padding-right: 10px">등록</v-col>
      </v-row>
      <hr />
    </v-container>

    <v-row>
      <div class="d-flex flex-column justify-center align-center">
        <v-btn
          v-if="!isWritingReview"
          @click="toggleWritingReview"
          class="elevation-0"
          fab
          dark
          color="#ffdb58"
        >
          <v-icon> mdi-plus </v-icon>
        </v-btn>
        <v-btn
          v-else
          @click="toggleWritingReview"
          class="elevation-0"
          fab
          dark
          color="red"
        >
          <v-icon> mdi-plus </v-icon>
        </v-btn>
        <div class="mt-5"></div>
      </div>
    </v-row>
  </v-card>
</template>

<script>
import restAPI from "@/util/http-common.js";
import { mapState } from "vuex";
import ImgUploadComponent from "../ImgUploadComponent.vue";

export default {
  components: { ImgUploadComponent },
  props: ["selectedAttrId"],
  data: () => ({
    attr: {
      title: "",
      addr1: "",
      likes: 0,
      first_img: "",
      overview: "",
    },
    reviews: null,
    file: null,
    isWritingReview: false,
    showEditBlock: [],
    newReview: {
      review_title: "",
      review_content: "",
      review_img: null,
    },
  }),
  computed: {
    ...mapState("memberStore", ["userInfo"]),

    preview: function(){
      if(this.attr.overview === null || this.attr.overview === undefined){
        return "";
      }else if(this.attr.overview.length > 200){
        return this.attr.overview.substring(0, 200) + "...";
      }else{
        return this.attr.overview;
      }
    },
  },
  methods: {
    getPhotoImageinfo(item) {
      if (item !== null && item !== undefined) {
        return require(`@/assets/upload/profile/img/${item}`);
      } else {
        return require("@/assets/img/util/photo_default.jpg");
      }
    },

    getProfileImageinfo(item) {
      if (item !== null && item !== undefined) {
        return require(`@/assets/upload/profile/img/${item}`);
      } else {
        return require("@/assets/img/util/profile_default.png");
      }
    },

    toggleWritingReview() {
      if (this.isWritingReview) {
        //입력 내용 초기화
        this.newReview = {
          review_title: "",
          review_content: "",
          review_img: null,
        };
      } else {
        if (this.userInfo == null) {
          alert("로그인 후 이용해 주세요.");
          return;
        }
      }
      this.isWritingReview = !this.isWritingReview;
    },

    submit() {
      if (this.newReview.review_title.length < 4) {
        alert("제목은 4글자 이상 입력해 주세요.");
        return;
      }
      if (this.newReview.review_content.length < 10) {
        alert("내용은 10글자 이상 입력해 주세요.");
        return;
      }
      if (this.file !== null) {
        this.uploadFile(this.file);
      } else {
        this.registerReview();
      }
    },

    async uploadFile(file) {
      let frm = new FormData();
      frm.append("files", file);

      try {
        await restAPI
          .post(`/api/upload`, frm, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(({ data }) => {
            console.log(data[0]);
            this.newReview.review_img = data[0];
          })
          .catch((error) => {
            alert("등록 처리 중 문제가 발생했습니다." + error.message);
          });

        this.registerReview();
      } catch (error) {
        console.log(error);
      }
    },

    async registerReview() {
      const user_id = this.userInfo.user_id;

      const submitReview = {
        content_id: this.selectedAttrId,
        user_id: user_id,
        review_title: this.newReview.review_title,
        review_content: this.newReview.review_content,
        review_img: this.newReview.review_img,
      };

      //console.log(uri);
      //console.log(newReview);
      const uri = `/api/reviews`;
      await restAPI
        .post(uri, submitReview)
        .catch((error) => console.log("계획 조회 실패!" + error.message));

      this.toggleWritingReview();
      this.newReview = {
        review_title: "",
        review_content: "",
        review_img: null,
      };
    },

    async getAttractionDetail() {
      const uri = `/api/attractions/detail`;
      const req = {
        content_id: this.selectedAttrId,
        user_id: this.userInfo != null ? this.userInfo.user_id : null,
      };

      await restAPI
        .post(uri, req)
        .then(({ data }) => {
          this.attr = data;
        })
        .catch((error) => console.log("관광지 조회 실패!" + error.message));
    },

    toggleExpansion() {
      this.isOverViewExpanded = !this.isOverViewExpanded;
    },

    async getReviewList() {
      const uri = `/api/reviews/list/`;
      //http://localhost/api/reviews/list/125405

      await restAPI
        .get(uri + this.selectedAttrId)
        .then(({ data }) => {
          this.reviews = data;
          console.log(data);
          const size = Object.keys(data).length;
          this.showEditBlock = Array(size).fill(false);
        })
        .catch((error) => console.log("리뷰 조회 실패!" + error.message));
    },
  },

  watch: {
    selectedAttrId() {
      this.getAttractionDetail();
      this.getReviewList();
    },
  },

  created() {
    this.getAttractionDetail();
    this.getReviewList();
  },
};
</script>

<style scoped>
.bx-heart-circle{
  color: #FF6458;
}
</style>