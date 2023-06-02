<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">회원가입</span>
    </v-card-title>

    <v-container>
      <v-form ref="form">
      <v-row>
        
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="user.user_email"
                label="이메일*"
                :rules="emailRule"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="user.user_id"
                label="아이디*"
                name="user_id"
                :rules="IdRule"
                v-bind:hint="user.user_id | idConstraint"
                @change="checkDuplicate(user.user_id)"
                required
              ></v-text-field>
              <!--중복확인 추가-->
              <v-text-field
                v-model="user.user_pw"
                label="비밀번호*"
                name="user_pw"
                type="password"
                :rules="passwordRule"
                v-bind:hint="user.user_pw | pwConstraint"
                required
              ></v-text-field>
              <v-text-field
                v-model="user_pw_confirm"
                label="비밀번호 확인*"
                name="user_pw_confirm"
                type="password"
                :rules="passwordConfirmRule(user)"
                v-bind:hint="user_pw_confirm | pwConfirmConstraint(user)"
                persistent-hint
                required
              ></v-text-field>
              <v-text-field
                v-model="user.user_name"
                label="이름*"
                name="user_name"
                hint="사이트 내에서 사용할 이름을 적어주세요."
                :rules="nameRule"
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
                  @fileChanged="file = $event"
                ></img-upload-component>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="9">
              <v-text-field
                label="주소*"
                name="user_addr"
                placeholder="우측의 '주소찾기' 버튼을 눌러 주소를 검색합니다."
                v-model="user.user_address_basic"
                :rules="addrressRule"
                readonly
                >{{ user.user_address_basic }}
                </v-text-field
              >
            </v-col>
            <v-col cols="3" class="mt-2">
              <v-btn @click="showDaumPostModal">주소찾기</v-btn>
            </v-col>
            <v-col cols="12"
              ><v-text-field
                label="상세주소"
                v-model="user.user_address_detail"
              ></v-text-field
            ></v-col>
          </v-row>
          <small>* : 필수 입력 항목</small>
          <v-checkbox id="agree" v-model="agreed" :rules="checkboxRule">
            <template v-slot:label>
              <a href="#" @click.prevent.stop="showAgreementModal"
                >EnjoyTrip의 이용약관</a
              >을 읽었으며, 이에 동의합니다.
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
      </v-form>
    </v-container>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="primary" text @click="submit"> 회원가입 </v-btn>
      <!--
      <v-btn class="gray" text @click="uploadFile(file)">
        업로드
      </v-btn>-->
      <v-btn class="gray" text @click="$emit('closeModal')"> 취소 </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-row class="mt-10"></v-row>

    <!--하위 모달-->
    <v-dialog v-model="joinDialog" max-width="80%">
      <div class="scroll-y">
        <component
          :is="modalType"
          @didChildAgree="agreed = $event"
          @closeParentModal="joinDialog = false"
          @getAddrInfo="updateAddress($event)"
        ></component>
      </div>
    </v-dialog>
  </v-card>
</template>

<style scoped>
* {
  font-family: "GyeonggiTitle";
}
.scroll-y {
  overflow-y: auto;
}
</style>


<script>
import AgreementModal from "@/components/modal/AgreementModal.vue";
import DaumPostModal from "@/components/modal/DaumPostModal.vue";
import ImgUploadComponent from "@/components/ImgUploadComponent.vue";

import restAPI from "@/util/http-common.js";

export default {
  components: { AgreementModal, DaumPostModal, ImgUploadComponent },
  data() {
    return {
      //joinPw: "",
      file: null,
      joinDialog: false,
      modalType: null,
      //agreed: false
      //변수명 수정 고려
      agreed: false,
      emailRule:[
      v => !!v || '이메일을 입력해주세요.',
      v => { 
        const replaceV = v.replace(/(\s*)/g, '')
        const pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
        return pattern.test(replaceV) || '이메일 형식으로 입력해주세요'
      }
      ],
      passwordRule:[
      v => !!v || '비밀번호를 입력해주세요.',
      v => {
        const replaceV = v.replace(/(\s*)/g, '')
        const length = replaceV.length;
        return (length >= 6 && length <= 10) || '6자리 이상 10자리 이하로 입력해주세요.';
      }
      ],
      IdRule:[
      v => !!v || '아이디를 입력해주세요.',
      v => {
        const replaceV = v.replace(/(\s*)/g, '')
        const length = replaceV.length;
        return (length >= 6 && length <= 10) || '6자리 이상 10자리 이하로 입력해주세요.';
      }
      ],
      nameRule:[
      v => !!v || '이름을 입력해주세요.',
      v => {
        const replaceV = v.replace(/(\s*)/g, '')
        const length = replaceV.length;
        return (length >= 1) || '이름을 입력해주세요.';
      }
      ],
      addrressRule:[
      v => !!v || '주소를 입력해주세요.',
      v => {
        const replaceV = v.replace(/(\s*)/g, '')
        const length = replaceV.length;
        return (length >= 1) || '주소를 입력해주세요.';
      }
      ],
      user: {
        user_id: "",
        user_pw: "",
        user_name: "",
        user_email: "",
        user_address_basic: "",
        user_address_detail: "",
        user_img: null,
      },
      user_pw_confirm: "",
    };
  },
  computed:{
    checkboxRule(){
       return [this.agreed==true || "약관에 동의해주세요"]
    }
  },
  methods: {
    passwordConfirmRule(user) {
      return [
        v => !!v || '비밀번호를 확인해주세요.',
        v => (v === user.user_pw) || '비밀번호가 일치하지 않습니다.'
      ];
    },
    showAgreementModal() {
      this.joinDialog = true;
      this.modalType = AgreementModal;
    },
    showDaumPostModal() {
      this.joinDialog = true;
      this.modalType = DaumPostModal;
    },

    checkDuplicate(user_id) {
      //제약조건을 통과하는 한에서 실행. 아래 조건은 여러 조건 중 하나일 뿐이며, 코드 중복.
      //제약조건 통과 여부를 통합적으로 관리했으면 함.
      // if (user_id.length >= 6 && user_id.length <= 10)
      if(user_id==null || user_id.length==0){
        return;
      }
      restAPI
        .get(`/api/users/check/${user_id}`)
        .then(({ data }) => {
          if (data == true) {
            alert("이 ID는 이미 존재합니다.");
          }
        })
        .catch(() =>
          alert(
            "ID 중복 조회 중 오류가 발생했습니다. 관리자에게 문의 바랍니다."
          )
        );
    },

    updateAddress(data) {
      this.user.user_address_basic = data.addr1;
      this.user.user_address_detail = data.zip;
    },

    submit() {
      const validate = this.$refs.form.validate()
      console.log(validate)
      console.log("일단 체크")
      if(validate==false){
        alert("잘못된 작성 칸이 존재합니다.")
        return;
      }
      if (this.file !== null) {
        this.uploadFile(this.file);
        console.log("뭐가 이상해")
      } else {
        this.registerMember();
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
          this.registerMember();
        })
        .catch((error) => {
          alert("등록 처리 중 문제가 발생했습니다." + error.message);
        });
    },

    async registerMember() {
      await restAPI
        .post(`/api/users`, this.user)
        .then(() => {
          alert("등록이 완료되었습니다.");
          this.$emit("closeModal");
        })
        .catch(() => alert("등록 처리 중 문제가 발생했습니다."));
      //user 데이터 초기화
      this.user = {
        user_id: "",
        user_pw: "",
        user_name: "",
        user_email: "",
        user_address_basic: "",
        user_address_detail: "",
        user_img: null,
      };
      this.user_pw_confirm = "";
    },
  },
  filters: {
    //올바른 이메일 형식이 아닙니다.
    idConstraint(user_id) {
      if (user_id.length >= 6 && user_id.length <= 10) {
        return "";
      } else {
        return "아이디는 6자 이상 10자 이하로 입력해주세요.";
      }
    },
    //아이디는 영문, 숫자, ~~~로만 입력해야 합니다.
    pwConstraint(user_pw) {
      if (user_pw.length >= 6 && user_pw.length <= 10) {
        return "";
      } else {
        return "비밀번호를 6자 이상 10자 이하로 입력해주세요.";
      }
    },
    //비밀번호가 일치하도록 입력해 주세요.
    pwConfirmConstraint(user_pw_confirm, user) {
      if (user_pw_confirm == user.user_pw) {
        return "";
      } else {
        return "비밀번호를 한 번 더 정확하게 입력해주세요.";
      }
    },
  },
};
</script>
