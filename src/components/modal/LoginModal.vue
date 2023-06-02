<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">로그인</span>
    </v-card-title>
    <hr />
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="10" sm="10">
            <v-text-field
              label="아이디"
              hint="아이디는 6자 이상 10자 이하로 입력해주세요."
              v-model="user.user_id"
              persistent-hint
              required
            ></v-text-field>
            <v-text-field
              label="비밀번호"
              type="password"
              v-model="user.user_pw"
              required
            ></v-text-field>
          </v-col>

          <!--화면 크기별 고정 크기 지정-->
        </v-row>
      </v-container>
      <small>* : 필수 입력 항목</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="blue darken-1" text @click="kakaoLogin" max-height="50px"
            max-width="80px"><v-img
            src="@/assets/img/util/kakaologin.png"
            max-height="100px"
            max-width="200px"
            position="-15px"
          ></v-img></v-btn>
      <v-btn color="blue darken-1" text @click="confirm"> 로그인 </v-btn>
      <v-btn color="blue darken-1" text @click="$emit('closeModal')">
        취소
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions ,mapState,mapGetters} from "vuex";
import userRestAPI from "@/util/http-common.js";
const memberStore = "memberStore";
export default {
  name: "UserLogin",
  data() {
    return {
      // isLoginError: false,
      accessToken: '',
      ddata:{},
      userInfo2:{},
      user: {
        user_id: null,
        user_pw: null,
      },
    };
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "isLoginError", "userInfo"]),
    ...mapGetters(["checkUserInfo"]),
  },
  methods: {
    ...mapActions(memberStore, ["userConfirm", "getUserInfo","snsUserconfirm"]),
    async confirm() {
      await this.userConfirm(this.user);
      let token = sessionStorage.getItem("access-token");
      console.log("1. confirm() token >> " + token);
      if (this.isLogin) {
        await this.getUserInfo(token);
        console.log("4. confirm() userInfo :: ", this.userInfo);
        this.$emit('closeModal');
        this.$router.push('/').catch(()=>{})
      }
    },
    kakaoLogin() {
      window.Kakao.Auth.login({
      success: (authObj) => {
        // Save the access token
        this.accessToken = authObj.access_token;
        console.log(this.accessToken);
        // Get user info
        this.getUserInfo2();
      },
      fail: (err) => {
        console.error(err);
      },
     });
    },
    getUserInfo2() {
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: (res) => {
          this.userInfo2 = {
            user_id: res.kakao_account.email,
            user_pw: res.kakao_account.email,
            user_name: res.kakao_account.profile.nickname,
            user_regtime: null,
            user_email: res.kakao_account.email,
            user_address_basic: "임시",
            user_address_detail: "임시",
            user_grade:0,
            user_img: null,
            token: this.accessToken
          };
          console.log(res);
          userRestAPI
          .get(`/api/users/check/${this.userInfo2.user_id}`)
          .then(({data}) => {
            if(data==true){
              this.snsUserconfirm(this.userInfo2)
              this.$emit('closeModal');
              this.userInfo2="";
            }else{
              userRestAPI
              .post(`/api/users`, this.userInfo2)
              .then(() => {
              alert("등록이 완료되었습니다.");
              //emit으로 모달창 닫기
              this.snsUserconfirm(this.userInfo2)
              this.$emit('closeModal');
              this.userInfo2="";
              })
            }
          //emit으로 모달창 닫기
          })
        },
        fail: (error) => {
          console.log(error);
        },
        });
    },
  },
};
</script>