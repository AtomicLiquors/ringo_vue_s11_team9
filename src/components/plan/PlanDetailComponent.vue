<template>
  <v-row>
    <v-col>
      <v-card max-width="800px" class="mx-auto">
        <v-img
          gradient="to top right, rgba(249, 180, 45, 1),rgba(249, 180, 45, 0.8)"
          height="200px"
          :src="getPlanImageSource"
        >
          <v-card-title class="white--text mt-8">
            <v-container>
              <div>{{ plan.plan_title }}</div>
              <div>
                {{ formatDate(plan.plan_start_date) }} -
                {{ formatDate(plan.plan_end_date) }}
              </div>

              <div class="d-flex mt-5">
                <v-avatar size="30" align="center">
                  <img alt="user" :src="getUserImageSource" />
                  <!--plan.user_img-->
                </v-avatar>

                <p class="ml-3">{{ plan.user_id }}</p>
              </div>
            </v-container>
          </v-card-title>
        </v-img>
        <v-container>
          <v-row>
            <v-col cols="10"></v-col>
            <v-col cols="2">
<!--v-show="changed"-->
              <v-btn
                id="save-order"
                fixed
                class="blue primary elevation-3"
                
                @click="saveChanges"
                ><v-icon>mdi-content-save-all-outline</v-icon>&nbsp; 변경된 순서 저장</v-btn>
              <v-container>
<v-btn
                fixed
                style="margin-top: -200px; right:180px; z-index: 200000 !important"
                @click="setAllMarkers(true)"
                fab
                 dark
                color="#FF6458"
                ><v-icon> mdi-map-marker-radius </v-icon></v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                fixed
                style="margin-top: -200px; z-index: 200000 !important;"
                 class="elevation-3"
                 fab
                 dark
                color="#FFB858"
                @click="getdraw"
                ><v-icon> mdi-map-marker-path </v-icon></v-btn
              >
              </v-container>
            </v-col>
          </v-row>
          <v-row>
            <div v-for="(ppd, index) in plansPerDay" :key="index">
              <v-card-text class="text-h5 text-left">
                {{
                  ppd[0] === null
                    ? ppd[1].length > 0
                      ? "날짜 미정"
                      : ""
                    : formatDate(ppd[0])
                }}
              </v-card-text>
              <v-timeline dense clipped>
                <draggable
                  v-model="ppd[1]"
                  group="draggable_plan"
                  @start="drag = true"
                  @end="drag = false"
                  @change="changed = true"
                >
                  <v-timeline-item
                    class="mb-4"
                    small
                    color="#ffdb58"
                    v-for="(attr, index) in ppd[1]"
                    :key="index"
                  >
                    <v-row justify="space-between" right="10" align="center">
                      <v-col cols="8">
                        <v-card>
                          <div class="d-flex justify-left">
                            <v-avatar class="ma-3" size="100" tile>
                              <v-img :src="attr.first_image" />
                            </v-avatar>
                            <div class="text-left">
                              <v-card-title>
                                {{ attr.title }}
                              </v-card-title>
                              <v-card-subtitle>{{
                                attr.addr1
                              }}</v-card-subtitle>
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col class="text-right" cols="4">
                        <!--15:25 EDT-->
                        <!--
                    <i bx bx-icon style="color: blue" @click="alert('수정')"
                      >날짜 수정</i
                    >-->
                        <v-text-field
                          clearable
                          type="date"
                          hide-details="auto"
                          label="방문 날짜"
                          :value="attr.trip_date"
                          @change="
                            updatePlanDetail(attr.plan_detail_id, $event)
                          "
                        ></v-text-field>
                        &nbsp;
                        <i
                          bx
                          bx-icon
                          class="markBtn"
                          @click="
                            setSingleMarker(attr.latitude, attr.longitude)
                          "
                          >지도</i
                        >&nbsp;
                        <i
                          bx
                          bx-icon
                          class="delBtn"
                          @click="deletePlanDetail(attr.plan_detail_id)"
                          >X삭제</i
                        >
                      </v-col>
                    </v-row>
                  </v-timeline-item>
                </draggable>
              </v-timeline>
            </div>
          </v-row>
<!--
          <v-container class="text-center">
            <v-btn @click="setAllMarkers(true)">지도에 전체 좌표 표시</v-btn>
            <v-btn @click="getdraw">좌표 선 그려보기</v-btn>
          </v-container>-->
          <v-row v-show="ifPlansPerDayExists" class="mt-3">
            <v-col cols="10" class="mx-auto">
              <gpt-component :gptKeywords="gptKeywords"></gpt-component>
            </v-col>
          </v-row>
        </v-container>

        <!-- <v-btn @click="saveChanges">변경된 순서 저장</v-btn>
        <v-btn @click="setAllMarkers(true)">지도에 전체 좌표 표시</v-btn>
        <v-btn @click="getdraw">좌표 선 그려보기</v-btn> -->

        <v-container>
          하단에서 관광지를 검색해서 여행 계획에 추가해 보세요.
        </v-container>

        <map-component
          ref="mapComp"
          :plan_id="plan.plan_id"
          :plan_thumbnail="plan.plan_thumbnail"
          :plannedMarkers="plannedMarkers"
          :drawline="drawline"
          @newPlanDetailAdded="getPlanDetail"
        ></map-component>
      </v-card>
    </v-col>
  </v-row>
</template>




<script>
import draggable from "vuedraggable";
import MapComponent from "@/components/MapComponent.vue";
import GptComponent from "@/components/plan/GptComponent.vue";
import restAPI from "@/util/http-common.js";
// http://localhost/api/plans/details/list/1 목록 가져오기

import { mapState } from "vuex";

export default {
  components: {
    draggable,
    MapComponent,
    GptComponent,
  },
  props: ["plan"],
  //props: ["plan_id", "plan_title", "plan_user_id"],
  data: () => ({
    ppdExists: false,
    gptKeywords: [],
    plansPerDay: [],
    deleteQueue: [],
    plannedMarkers: [],
    input: null,
    changed: false,
    nonce: 0,
    drawline: 0,
  }),

  computed: {
    timeline() {
      return this.events.slice().reverse();
    },

    ...mapState("memberStore", ["userInfo"]),

    getPlanImageSource() {
      if (!this.plan && this.plan.plan_thumbnail !== null) {
        return require(`@/assets/upload/profile/img/${this.plan.plan_thumbnail}`);
      } else {
        return require("@/assets/img/util/plan_default.png");
      }
    },

    getUserImageSource() {
      if (this.userInfo !== null && this.userInfo.user_img !== null) {
        return require(`@/assets/upload/profile/img/${this.userInfo.user_img}`);
      } else {
        return require("@/assets/img/util/profile_default.png");
      }
    },

    ifPlansPerDayExists() {
      return (
        this.plansPerDay !== null &&
        this.plansPerDay != "undefined" &&
        this.plansPerDay.length > 0
      );
    },
  },

  methods: {
    setSingleMarker(lat, long) {
      this.plannedMarkers = [[lat, long]];
      let scroll = "";

      scroll = this.$refs.mapComp.$refs.maparea;
      scroll.scrollIntoView({ behavior: "smooth" });
    },

    setAllMarkers(isScroll) {
      this.plannedMarkers = [];
      this.drawline = 0;
      console.log(isScroll);
      this.plansPerDay.forEach((ppd) => {
        ppd[1].forEach((record) => {
          console.log(record);
          this.plannedMarkers.push([record.latitude, record.longitude]);
        });
      });
      console.log("마킹 결과");
      console.log(this.plannedMarkers);

      console.log(this);
      console.log(this.plansPerDay);
      console.log(this.plansPerDay[0]);

      if (isScroll == true) {
        let scroll = "";
        scroll = this.$refs.mapComp.$refs.maparea;
        scroll.scrollIntoView({ behavior: "smooth" });
      }
    },
    getdraw() {
      if (this.drawline == 0) {
        this.drawline = 1;
        let scroll = "";
        scroll = this.$refs.mapComp.$refs.maparea;
        scroll.scrollIntoView({ behavior: "smooth" });
      } else this.drawline = 0;
    },

    async saveChanges() {
      const data = [];

      this.plansPerDay.forEach((ppd) => {
        let index = 0;
        let record;
        ppd[1].forEach((item) => {
          item.trip_no = index++;

          record = {
            plan_detail_id: item.plan_detail_id,
            trip_date: ppd[0],
            trip_no: item.trip_no,
          };

          data.push(record);
        });
      });

      console.log(data);
      const uri = `/api/plans/details/`;

      try {
        await restAPI
          .put(uri, data)
          .then()
          .catch(() => console.log("수정 중 에러 발생!"));
        this.getPlanDetail();
      } catch (error) {
        console.log(error);
      }
      this.changed = false;
    },

    updatePlanDetail(plan_detail_id, event) {
      console.log("update Occured");
      const plan_detail = {
        plan_detail_id: plan_detail_id,
        trip_date: event,
      };
      const uri = `/api/plans/details/`;
      restAPI
        .put(uri + plan_detail_id, plan_detail)
        .then(this.getPlanDetail())
        .catch(() => console.log("수정 중 에러 발생!"));
    },
    //alert("수정되었습니다."),
    async deletePlanDetail(plan_detail_id) {
      //삭제 후 목록이 갱신되지 않는 경우가 있나?
      //삭제 전 prevId에 해당하는 컬럼의 nextId 값을 자기 자신의 nextId로 준다.
      console.log(plan_detail_id);
      const uri = `/api/plans/details/`;

      try {
        await restAPI
          .delete(uri + plan_detail_id)
          .then(console.log("삭제되었습니다."))
          .catch((error) => console.log("삭제 중 에러 발생! " + error.message));

        this.getPlanDetail();
      } catch (error) {
        console.log(error);
      }
    },

    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
    getPlanDetail() {
      const uri = `/api/plans/details/list/`;
      console.log(this.plan);
      restAPI
        .get(uri + this.plan.plan_id)
        .then(({ data }) => {
          console.log("plan Detail on ");
          this.groupPlanDetailByDate(data);
        })
        .catch((err) => {
          console.log("계획 조회 실패! " + err.message);
        });
    },

    groupPlanDetailByDate(data) {
      //링크드리스트 도입 이전
      const dataMap = new Map();
      this.gptKeywords = [];
      data.forEach((record) => {
        const date = record.trip_date === null ? null : record.trip_date;
        //성능 우려.

        if (!dataMap.has(date)) {
          dataMap.set(date, []);
        }
        dataMap.get(date).push(record);
        this.gptKeywords.push(
          date === null ? "날짜 미정" : this.formatDate(date)
        );
        this.gptKeywords.push(record.title);
      });

      this.plansPerDay = Array.from(dataMap);
      console.log("ppd Assigned ");
      console.log(this.plansPerDay);
      this.plansPerDay = [...this.plansPerDay];

      this.setAllMarkers(false);
    },
  },

  created() {
    this.getPlanDetail();
  },

  watch: {
    plan_id() {
      this.getPlanDetail();
    },
    changed(newValue){
      const saveBtn = document.getElementById('save-order');
      
        saveBtn.style.opacity = newValue?"100%":"0%";
      
    }
  },
};
</script>

<style scoped>
* {
  font-family: "GyeonggiTitle";
}

.v-timeline::before {
  top: 55px;
  height: calc(100% - 110px);
}

.delBtn {
  color: gray;
  transition: all ease-in-out 0.1s;
}

.delBtn:hover {
  color: #ff524b;
}

.v-card {
  position: relative;
}
#save-order{
  margin-top: -115px; right:115px;  
  z-index: 200000 !important; border-radius:300; clip: rect( 0px, 220px, 220px, 0px );
  opacity: 0%;
 transition: all ease-in-out 0.3s;
}
</style>





