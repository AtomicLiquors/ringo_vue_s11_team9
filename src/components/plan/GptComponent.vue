<template>
  <v-card class="mx-auto" style="padding: 20px">
    <v-row class="text-center">
      <div>💡 AI에게 물어보세요!</div>
      <div>계획한 여행지들을 바탕으로 여행 정보를 제공해 드려요.</div>
      <v-container class="mt-1">
        <div v-if="gptKeywords.length > 0">
          <div>- 선택 키워드 -</div>
          <small>{{ gptKeywords }}</small>
        </div>
        <div v-else>
          <small>예시 키워드 : ["해운대 해수욕장", "벡스코"]</small>
        </div>
      </v-container>
      <v-col cols="3" class="mx-auto">
        <v-btn color="blue text-white" @click="search"> AI 응답 생성 </v-btn>
      </v-col>
    </v-row>
    <v-container class="mt-5" border style="padding: 20px">
      <div v-if="isLoading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        &nbsp;
        <small
          >응답 생성 중... 응답 길이에 따라 약 30초 ~ 1분 정도
          소요됩니다.</small
        >
      </div>
      <div v-html="realme"></div>
    </v-container>
  </v-card>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { Configuration, OpenAIApi } from "openai";

const memberStore = "memberStore";

const configuration = new Configuration({
  organization: "org-qol5oGx0RH90aoXVZ8hGih5t",
  apiKey: process.env.VUE_APP_OPENAI_API_KEY,
  headers: {
    Authorization: `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});
delete configuration.baseOptions.headers["User-Agent"];
const openai = new OpenAIApi(configuration);
export default {
  props: ["gptKeywords"],
  data() {
    return {
      keywords: ["해운대 해수욕장", "벡스코"],
      realme: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "userInfo"]),
    ...mapGetters(["checkUserInfo"]),
  },
  methods: {
    async search() {
      this.isLoading = true;
      if (this.gptKeywords !== undefined && this.gptKeywords !== null)
        this.keywords = this.gptKeywords;
      //여행지 이름들 목록 들어갈 예정

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              this.keywords.join() +
              "이렇게 여행을 떠나려 하는데, 여행일정을 평가해주고 추천하는 일정 순서와 소요시간 그리고 또 추천하는 주변 여행지 한 곳만 알려줘",
          },
        ],

        max_tokens: 600,
        n: 1,
        stop: null,
        temperature: 0.7,
      });
      console.log(response);
      this.isLoading = false;
      this.realme = response.data.choices[0].message.content.replace(
        /\n/g,
        "<br/>"
      );
      console.log(this.realme);
    },
  },
};
</script>

<style>
</style>