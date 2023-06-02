<template>
  <v-card>
    <v-container class="align-center justify-center">
      <v-card-text>주소찾기 </v-card-text>

      <v-btn @click="closeParentModal">닫기</v-btn>
      <v-card class="daummap">
        <div ref="embed"></div>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "daumMap",
  data() {
    return {
      addrInfo: {
        addr1: "",
        addr2: "",
        zip: "",
      },
    };
  },
  props: {
    agreed: {
      type: Boolean,
    },
    joinDialog: {
      type: Boolean,
    },
  },

  beforeMount() {
    /*
        (적용 실패)cdn을 모달 띄울 때만 쓰고 싶다면)
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        document.body.appendChild(script);
        /*
        By using this method, you can load JavaScript files only when needed, 
        reducing the amount of code that needs to be loaded on initial page load. 
        However, keep in mind that this method may affect the performance of your application 
        since loading a script dynamically may cause an additional HTTP request.
        */
  },
  mounted() {
    this.createApi();
  },

  methods: {
    returnAddrInfo() {
      this.$emit("getAddrInfo", this.addrInfo);
      this.closeParentModal();
    },
    closeParentModal() {
      this.$emit("closeParentModal");
    },
    createApi() {
      new window.daum.Postcode({
        //화면내에 끼워넣는 방식일 경우, 내부 스크롤이 거슬릴수도 있습니다.
        //이때 onresize 속성을 추가해서 iframe 높이를 조절하면 스크롤이 생기지 않습니다.
        //아래 '우편번호 찾기' 버튼을 클릭해서 바로 확인해보세요.
        theme: {
          // 테마 변경 : https://postcode.map.daum.net/guide -> 테마 변경 마법사
        },
        oncomplete: (data) => {
          // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

          // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
          // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
          let fullRoadAddr = data.roadAddress; // 도로명 주소 변수
          let extraRoadAddr = ""; // 도로명 조합형 주소 변수

          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraRoadAddr +=
              extraRoadAddr !== ""
                ? ", " + data.buildingName
                : data.buildingName;
          }
          // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraRoadAddr !== "") {
            extraRoadAddr = " (" + extraRoadAddr + ")";
          }
          // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
          if (fullRoadAddr !== "") {
            fullRoadAddr += extraRoadAddr;
          }

          // 우편번호와 주소 정보를 해당 필드에 넣는다.
          this.addrInfo.zip = data.zonecode; //5자리 새우편번호 사용
          this.addrInfo.addr1 = fullRoadAddr;
          this.returnAddrInfo();
        },
      }).embed(this.$refs.embed, { autoClose: false });
    },
  },
};
</script>

<style>
</style>