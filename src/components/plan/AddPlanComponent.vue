 <template>
  <v-card>
    <v-container>
      <v-row>
        <v-col class="v-col-7">
          <v-list-item-content align="left">
            <v-list-item-title class="text-h5 mb-1"
              >새 여행 계획</v-list-item-title
            >
            <!---->
            <v-text-field
              v-model="newPlan.plan_title"
              class="text-h5 mb-1"
              label="제목을 입력하세요."
            ></v-text-field>
          </v-list-item-content>
        </v-col>
        <v-col class="v-col-5"
          ><v-list-item-avatar tile size="100" color="grey"></v-list-item-avatar
        ></v-col>
      </v-row>

      <!-- -->
      <v-text-field
        v-model="newPlan.plan_desc"
        label="내용을 입력하세요."
      ></v-text-field>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="dates[0]"
            hint="시작 날짜"
            prepend-icon="mdi-calendar"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="dates[1]"
            hint="끝 날짜"
            prepend-icon="mdi-calendar"
          ></v-text-field>
        </v-col>
        <!--model: {{ dates }}-->
        <v-card>
          <v-date-picker v-model="dates" range></v-date-picker>
        </v-card>
        <hr />
      </v-row>
      <v-btn btn-primary @click.prevent="registerPlan">계획 등록</v-btn>
    </v-container>
  </v-card>
</template>


<script>
import planRestAPI from "@/util/http-common.js";
import { mapState } from "vuex";

export default {
  data() {
    const today = new Date().toISOString().slice(0, 10);
    const plan = {
      user_id: "",
      plan_title: "",
      plan_desc: "",
      plan_start_date: null,
      plan_end_date: null,
      plan_thumbnail: null,
    };
    return {
      dates: [today, today],
      newPlan: { ...plan },
    };
  },

  computed: {
    ...mapState("memberStore", ["userInfo"]),

    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },

  methods: {
    //change 이벤트 > 이전 입력 날짜 임시로 저장해뒀다가 날짜 유효성 맞으면 교체
    registerPlan() {
      this.newPlan.user_id = this.userInfo.user_id;
      this.newPlan.plan_start_date = this.dates[0];
      this.newPlan.plan_end_date = this.dates[1];

      planRestAPI
        .post(`/api/plans`, this.newPlan)
        .then(({ data }) => {
          console.log("등록이 완료되었습니다.");

          const newPlanInfo = {
            plan_id: data,
            plan_title: this.newPlan.plan_title,
            plan_start_date: this.newPlan.plan_start_date,
            plan_end_date: this.newPlan.plan_end_date,
          };

          //초기화
          this.newPlan = { ...this.plan };

          //emit으로 리스트에 알리고 리스트 갱신, detail로 넘어감
          this.$emit("newPlanAdded", newPlanInfo);
        })
        .catch((error) =>
          console.log("등록 처리시 문제가 발생했습니다. " + error.message)
        );
    },
  },
};
</script>
 
 <style>
</style>