<template>
  <section>
    <v-app>
      <v-card class="mx-auto mt-10">
        <!--이 구간을 foreach로 반복합니다.-->
        <v-row v-for="(plan, index) in plans" :key="plan.plan_id">
          <v-col cols="10">
            <v-list-item
              v-if="!showEditBlock[index]"
              @click="toggleDetailModal(plan)"
            >
              <v-list-item-avatar tile size="100" color="grey">
                <!--이미지 url 걸기.-->
                <v-img src="@/assets/img/util/plan_default.png"></v-img>
              </v-list-item-avatar>
              <v-list-item-content align="left">
                <v-list-item-title class="text-h5 mb-1">
                  {{ plan.plan_title }}
                </v-list-item-title>

                <!--new Date(plan.plan_start_date).toISOString().split("T")[0]-->
                <v-list-item-subtitle
                  >{{ formatDate(plan.plan_start_date) }}
                  -
                  {{ formatDate(plan.plan_end_date) }}</v-list-item-subtitle
                >
                <!--new Date(plan.plan_end_date).toISOString().split("T")[0]-->
                <v-list-item>{{ plan.plan_desc }}</v-list-item>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-else>
              <v-list-item-avatar tile size="100" color="grey">
                <!--이미지 url 걸기.-->
              </v-list-item-avatar>
              <div>
                <v-text-field
                  v-model="plan.plan_title"
                  clearable
                  hide-details="auto"
                  label="제목"
                ></v-text-field>
                <v-text-field
                  v-model="plan.plan_start_date"
                  clearable
                  type="date"
                  hide-details="auto"
                  label="시작 날짜"
                ></v-text-field>
              </div>
              <div>
                <v-text-field
                  v-model="plan.plan_desc"
                  clearable
                  hide-details="auto"
                  label="내용"
                ></v-text-field>
                <v-text-field
                  v-model="plan.plan_end_date"
                  clearable
                  type="date"
                  hide-details="auto"
                  label="끝 날짜"
                ></v-text-field>
              </div>
              <v-btn @click="updatePlan(plan, index)">수정</v-btn>
            </v-list-item>
          </v-col>
          <v-col cols="2">
            <i bx bx-icon class="updateBtn" @click="toggleEditBox(index)">V</i>
            &nbsp;
            <i bx bx-icon class="delBtn" @click="deletePlan(plan.plan_id)">X</i>
          </v-col>
        </v-row>
        <hr />

        <!--반복 끝-->
        <div v-if="plans.length == 0">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                아직 등록된 계획이 없네요!
              </v-list-item-title>
              <v-list-item-subtitle
                >하단의 버튼을 눌러 계획을 추가해 보세요.</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <hr />
        </div>

        <v-dialog v-model="planListDialogue" max-width="800">
          <!--신규등록은 너비 500, 계획 상세는 800-->
          <!--<add-plan-component></add-plan-component>-->
          <component
            :is="modalType"
            :plan="selectedPlan"
            @newPlanAdded="
              getPlanList;
              toggleDetailModal($event);
            "
          ></component>
          <hr />
        </v-dialog>

        <div class="d-flex flex-column justify-center align-center">
          <v-btn
            @click="togglePlanModal"
            class="elevation-0"
            fab
            dark
            color="#ffdb58"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
          <div class="mt-5"></div>
        </div>
      </v-card>
    </v-app>
  </section>
</template>

<style scoped>
.delBtn {
  color: gray;
  transition: all ease-in-out 0.1s;
}

.delBtn:hover {
  color: #ff524b;
}
.v-dialog.v-dialog--active {
  z-index: 10000;
}
.v-btn--fixed {
  z-index: 21000;
}
</style>

<script>
import restAPI from "@/util/http-common.js";
import AddPlanComponent from "@/components/plan/AddPlanComponent.vue";
import PlanDetailComponent from "@/components/plan/PlanDetailComponent.vue";

import { mapState } from "vuex";

export default {
  components: {
    AddPlanComponent,
  },

  data: () => ({
    planListDialogue: false,
    modalType: null,
    selectedPlan: null,
    /*
    plan_id: 0,
    plan_title: "",*/
    plans: [],
    showEditBlock: [],
  }),
  created() {
    this.getPlanList();
  },

  methods: {
    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },

    togglePlanModal() {
      this.planListDialogue = !this.planListDialogue;
      //transform: rotate(0.5turn);
      this.modalType = AddPlanComponent;
    },

    toggleDetailModal(plan) {
      this.selectedPlan = plan;
      /*this.plan_id = plan_id;
      this.plan_title = plan_title;
      this.plan_user_id = plan_user_id;*/
      this.planListDialogue = true;
      this.modalType = PlanDetailComponent;
    },

    getPlanList() {
      this.planListDialogue = false;
      const uri = `/api/plans/list/`;
      const user_id = this.userInfo.user_id;

      restAPI
        .get(uri + user_id)
        .then(({ data }) => {
          //console.log(data);
          this.plans = data;

          const size = Object.keys(data).length;
          this.showEditBlock = Array(size).fill(false);
        })
        .catch(() => console.log("계획 조회 실패!"));
    },

    async updatePlan(plan, index) {
      const uri = `/api/plans/`;
      try {
        await restAPI
          .put(uri, plan)
          .then(() => {
            console.log("여행계획이 수정되었습니다.");
          })
          .catch((error) => console.log("계획 수정 실패! " + error.message));

        this.getPlanList();
        this.toggleEditBox(index);
      } catch (error) {
        console.log(error);
      }
    },

    async deletePlan(plan_id) {
      console.log(plan_id);
      const uri = `/api/plans/`;
      try {
        await restAPI
          .delete(uri + plan_id)
          .then(() => {
            //          alert("삭제되었습니다.");
          })
          .catch((error) => console.log("계획 삭제 실패! " + error.message));

        this.getPlanList();
      } catch (error) {
        console.log(error);
      }
    },

    toggleEditBox(index) {
      this.showEditBlock[index] = true;
      this.$forceUpdate();
    },
  },

  computed: {
    ...mapState("memberStore", ["userInfo"]),

    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
};
</script>

