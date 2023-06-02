<template>
  <v-app>
    <v-app-bar app color="#ffca58" dark style="font-family: GyeonggiTitle">
      <v-row align="center" justify="center">
        <v-col cols="1"></v-col>
        <v-col cols="2" style="text-shadow: 0.5px 0.5px 0.5px #cc9b56">
          <router-link to="/">
            <v-img
              contain
              :src="require('@/assets/img/logo/logo_white.png')"
              width="100"
            />
          </router-link>
        </v-col>
        <v-col cols="8" align="end" style="text-shadow: 2px 1px 1px #cc9b56">
          <span v-if="userInfo != null" class="white--text text-decoration-none"
            ><img
              :src="userimageinfo"
              style="width: 40px; height: 40px; border-radius: 100%"
            />
            &nbsp;
            <a>{{ userInfo.user_name }}님 안녕하세요!</a>&nbsp;
            <a
              href="#"
              @click.prevent="onClickLogout"
              class="white--text text-decoration-none"
            >
              로그아웃 </a
            >&nbsp;|&nbsp;
            <router-link to="/mypage" class="white--text text-decoration-none"
              >마이 페이지</router-link
            >&nbsp;|&nbsp;
          </span>
          <span v-else>
            &nbsp;
            <a
              href="#"
              @click.prevent="showLoginModal()"
              class="white--text text-decoration-none"
            >
              로그인</a
            >&nbsp;|&nbsp;<a
              href="#"
              @click.prevent="showJoinModal()"
              class="white--text text-decoration-none"
            >
              회원가입 </a
            >&nbsp;|&nbsp;
          </span>
<!--
          <router-link to="/map" class="white--text text-decoration-none"
            >지도</router-link
          >&nbsp;|&nbsp;-->
          <span v-if="userInfo != null">
            <router-link to="/plan" class="white--text text-decoration-none"
              >여행 계획</router-link
            >&nbsp;|&nbsp;</span
          >
          <router-link to="/board" class="white--text text-decoration-none"
            >게시판</router-link
          >
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <footer-layout></footer-layout>
    <v-dialog scrollable v-model="dialog" max-width="600px">
      <v-card class="rounded-xl">
        <div style="background-color: #ffca58; padding: 3px">
          <v-img
            :src="require('@/assets/img/logo/logo_white.png')"
            class="my-3"
            contain
            height="50"
          />
        </div>
        <component :is="modalType" @closeModal="dialog = false"></component>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style>
@import url("https://webfontworld.github.io/gyeonggi/GyeonggiTitle.css");
</style>

<script>
import LoginModal from "@/components/modal/LoginModal.vue";
import JoinModal from "@/components/modal/JoinModal.vue";
import { mapState, mapGetters, mapActions } from "vuex";
import FooterLayout from "./components/layout/FooterLayout.vue";
import ReviewModal from "./components/modal/ReviewModal.vue";

const memberStore = "memberStore";

/* socket.io */
/*
const app = require("express")();
const http = require("http").createServer(app);

app.get("/", (req, res) => {
  res.send("<h1>Hey Socket.io</h1>");
});

http.listen(3000, () => {
  console.log("listeninghttp on *:3000");
});*/

export default {
  components: {
    LoginModal,
    JoinModal,
    FooterLayout,
    ReviewModal,
  },
  name: "App",

  data: () => ({
    // 모달 오픈 속성
    dialog: false,
    modalType: null,
    modalWidth: {
      "max-width": "600px",
    },
  }),
  methods: {
    showLoginModal() {
      this.dialog = true;
      this.modalType = LoginModal;
      this.modalWidth = {
        "max-width": "600px",
      };
    },
    showJoinModal() {
      this.dialog = true;
      this.modalType = JoinModal;
      this.modalWidth = {
        "max-width": "600px",
      };
    },
    ...mapActions(memberStore, ["userLogout"]),
    // ...mapMutations(memberStore, ["SET_IS_LOGIN", "SET_USER_INFO"]),
    onClickLogout() {
      // this.SET_IS_LOGIN(false);
      // this.SET_USER_INFO(null);
      // sessionStorage.removeItem("access-token");
      // if (this.$route.path != "/") this.$router.push({ name: "main" });
      console.log(this.userInfo.user_id);
      //vuex actions에서 userLogout 실행(Backend에 저장 된 리프레시 토큰 없애기
      //+ satate에 isLogin, userInfo 정보 변경)
      // this.$store.dispatch("userLogout", this.userInfo.userid);
      this.userLogout(this.userInfo.user_id);
      sessionStorage.removeItem("access-token"); //저장된 토큰 없애기
      sessionStorage.removeItem("refresh-token"); //저장된 토큰 없애기
      if (this.$route.path != "/") this.$router.push("/");
    },
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "userInfo"]),
    ...mapGetters(["checkUserInfo"]),
    //console.log(this.$store.state.userInfo),
    userimageinfo() {
      if (this.userInfo.user_img == null) {
        return require("@/assets/upload/profile/img/default.jpg");
      } else {
        return require("@/assets/upload/profile/img/" + this.userInfo.user_img);
      }
    },
  },
};
</script>
