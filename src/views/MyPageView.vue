<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">마이페이지</span>
    </v-card-title>

    <v-container>
      <v-row v-if="!userChecked">
        비밀번호를 한번 더 입력해주세요.
        <v-text-field
          v-model="user_pw_check"
          label="비밀번호 확인*"
          name="user_pw_check"
          type="password"
          persistent-hint
          required
        ></v-text-field>
        <v-btn @click="confirmPassword">확인</v-btn>
      </v-row>
      <v-card v-else>
        <v-container>
          <v-row>
            <span class="text-h5">{{ user.user_id }}님</span>

            <v-col cols="6">
              <v-col cols="12">
                <v-text-field
                  v-model="user.user_email"
                  label="이메일*"
                  required
                ></v-text-field>
              </v-col>

              <v-text-field
                v-model="user.user_name"
                label="이름*"
                name="user_name"
                required
              ></v-text-field>

              <v-text-field
                v-model="user.user_pw"
                label="비밀번호 수정"
                name="user_pw"
                type="password"
                required
              ></v-text-field>

              <v-text-field
                v-model="user_pw_confirm"
                label="비밀번호 확인*"
                name="user_pw_confirm"
                type="password"
                persistent-hint
                required
              ></v-text-field>
            </v-col>

            <v-col cols="6" class="mt-10" align="center">
              <div
                width="
          80%"
              >
                <img-upload-component
                  @fileChanged="changeFile($event)"
                ></img-upload-component>
              </div>
            </v-col>
            <v-col cols="12">
              <v-btn @click="showDaumPostModal">주소찾기</v-btn>
              <v-text-field
                label="주소*"
                name="user_addr"
                placeholder="상단의 '주소찾기' 버튼을 눌러 주소를 검색합니다."
                v-model="user.user_address_basic"
                readonly
                >{{ user.user_address_basic }}</v-text-field
              >
              <v-text-field
                label="상세주소"
                v-model="user.user_address_detail"
              ></v-text-field>
            </v-col>
          </v-row>
          <small>* : 필수 입력 항목</small>
          <v-container>
            <v-btn @click="submit">수정</v-btn>
            <v-btn @click="deleteMember">탈퇴</v-btn>
          </v-container>
        </v-container>
      </v-card>
    </v-container>

    <v-dialog v-model="myPageDialog" max-width="80%">
      <div class="scroll-y">
        <component
          :is="modalType"
          @closeParentModal="myPageDialog = false"
          @getAddrInfo="updateAddress($event)"
        ></component>
      </div>
    </v-dialog>
  </v-card>
</template>



<script>
import restAPI from "@/util/http-common.js";
import DaumPostModal from "@/components/modal/DaumPostModal.vue";
import ImgUploadComponent from "@/components/ImgUploadComponent.vue";
import { mapActions } from "vuex";
import { mapMutations } from "vuex";

import { mapState } from "vuex";

export default {
  components: { DaumPostModal, ImgUploadComponent },
  data: () => ({
    //state에서 불러오도록 대체해야 함.
    userChecked: false,
    isFileChanged: false,

    modalType: DaumPostModal,

    myPageDialog: false,
    user: {
      user_no: 0,
      user_id: "",
      user_pw: "",
      user_name: "",
      user_email: "",
      user_address_basic: "",
      user_address_detail: "",
      user_img: null,
    },
    user_pw_confirm: "",
    user_pw_check: "",
  }),

  created() {
    this.getUserInfo();
  },

  computed: {
    ...mapState("memberStore", ["userInfo"]),
  },

  methods: {
    ...mapActions("memberStore", ["userLogout"]),
    ...mapMutations("memberStore", ["SET_USER_INFO"]),

    showDaumPostModal() {
      this.myPageDialog = true;
      this.modalType = DaumPostModal;
    },

    getUserInfo() {
      const uri = `/api/users/`;
      restAPI
        .get(uri + this.userInfo.user_id)
        .then(({ data }) => {
          data.user_pw = "";
          this.user = data;
        })
        .catch(() => console.log("사용자 정보 조회 실패!"));
    },

    changeFile(file) {
      this.file = file;
      this.isFileChanged = true;
    },

    submit() {
      if (this.isFileChanged && this.file !== null) {
        this.uploadFile(this.file);
      } else {
        this.editMember();
      }
    },

    uploadFile(file) {
      let frm = new FormData();
      frm.append("files", file);

      restAPI
        .post(`/api/upload`, frm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) => {
          console.log(data[0]);
          this.user.user_img = data[0];
          this.editMember();
        })
        .catch((err) => {
          alert("파일 등록 처리 중 문제가 발생했습니다.");
          console.log(err.message);
        });
    },

    editMember() {
      const uri = `/api/users/`;
      console.log(this.user);

      if (this.user.user_pw == "") {
        //수정 액션을 가하지 않은 경우, 비밀번호 수정하지 않는다.
        //+유효성 검증 로직 넣을 것
        delete this.user.user_pw;
      }

      restAPI
        .put(uri + this.userInfo.user_id, this.user)
        .then(() => {
          alert("수정완료");

          this.SET_USER_INFO(this.state, this.user);

          if (this.$route.path != "/") this.$router.push("/");
        })
        .catch((err) => {
          console.log("정보수정 실패! " + err.message);
        });
    },

    deleteMember() {
      const uri = `/api/users/`;
      restAPI
        .delete(uri + this.userInfo.user_no)
        .then(() => {
          alert("탈퇴완료");
          this.userLogout(this.userInfo.user_id);
          sessionStorage.removeItem("access-token"); //저장된 토큰 없애기
          sessionStorage.removeItem("refresh-token"); //저장된 토큰 없애기
          if (this.$route.path != "/") this.$router.push("/");
        })
        .catch(() => console.log("탈퇴 중 오류 발생!"));
    },

    updateAddress(data) {
      this.user.user_address_basic = data.addr1;
      this.user.user_address_detail = data.zip;
    },

    confirmPassword() {
      const userCheckInfo = {
        user_id: this.userInfo.user_id,
        user_pw: this.user_pw_check,
      };

      const uri = `/api/users/check/pwcheck`;
      restAPI
        .post(uri, userCheckInfo)
        .then(({ data }) => {
          this.userChecked = data;
          if (this.userChecked) {
            console.log("success!");
          } else {
            console.log("fail!");
          }
        })
        .catch(() => console.log("사용자 정보 확인 중 오류 발생!"));
    },
  },
};
</script>

<style>
</style>