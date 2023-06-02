<template>
  <v-container class="mt-5" ref="searchTab">
    <div class="input-group flex-nowrap">
      <select
        v-model="sido_code"
        id="search-area"
        name="sido_code"
        class="form-select me-2"
      >
        <option value="0" selected>지역</option>
        <option
          v-bind:value="key"
          v-for="(key, index) in Object.keys(sidoOptions)"
          :key="index"
        >
          {{ sidoOptions[key] }}
        </option>
      </select>
      <!--
      <select
        v-model="sido_code"
        id="search-area"
        name="sido_code"
        class="form-select me-2"
      >
        <option value="0" selected>지역</option>
        <option
          v-bind:value="key"
          v-for="(key, index) in Object.keys(sidoOptions)"
          :key="index"
        >
          {{ sidoOptions[key] }}
        </option>
      </select>
      -->
      <input
        id="search_keyword"
        v-model="search_keyword"
        name="search_keyword"
        type="search"
        class="form-control"
        placeholder="Search"
        aria-label="Search"
      />
      <input
        id="btn-search"
        type="submit"
        class="input-group-text"
        value="🔍︎"
        @click="searchAttraction"
      />
    </div>
    <attr-icon-component
      class="mt-5"
      @filterUpdated="selectedArray = $event"
    ></attr-icon-component>
    <v-row class="mt-5">
      <v-col cols="6">
        <v-card style="height: 100%; max-width: 100%">
          <v-toolbar color="light-blue" dark>
            <v-toolbar-title> 관광지 조회 결과 </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-subtitle
            v-if="searchResult == null"
            style="text-align: center; padding-top: 15%"
          >
            <p>🔎 검색 버튼을 눌러 관광지를 검색하세요.</p>
            <p>- 📍 가고 싶은 지역의 관광지를 찾아보세요.</p>
            <p>- ⚽️ 여러가지 아이콘을 눌러 원하는 타입의 관광지만 검색해요.</p>
          </v-card-subtitle>
          <v-list>
            <template v-for="(item, index) in searchResult">
              <v-list-item v-bind:key="index">
                <v-list-item-avatar tile size="100" color="grey">
                  <v-img
                    :src="item.first_image"
                    lazy-src="@/assets/img/logo/logo_white.png"
                  >
                    <template v-slot:placeholder>
                      <div
                        class="d-flex align-center justify-center fill-height"
                      >
                        <v-progress-circular
                          v-if="showProgress"
                          color="grey-lighten-4"
                          indeterminate
                        ></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                </v-list-item-avatar>
                <v-list-item-content align="left">
                  <v-list-item-title class="text-h5 mb-1">
                    {{ item.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ item.addr1 }}</v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <i
                      class="bx bxs-heart"
                      @click="() => toggleLike(item)"
                      :style="item.user_liked > 0 ? { color: 'red' } : {}"
                    ></i>
                    {{ item.likes }}
                  </v-list-item-subtitle>
                  <!--<v-list-item-text>평점 : {{ item.rating }}</v-list-item-text>-->
                  <v-list-item-icon
                    v-if="$route.name === 'map'"
                    @click="$emit('callPlan')"
                  >
                    <i class="bx bx-flag"></i>여행계획추가
                  </v-list-item-icon>
                  <v-list-item-icon
                    v-if="$route.name === 'plan'"
                    @click="
                      registerPlanDetail(item.content_id, item.first_image)
                    "
                  >
                    <i class="bx bx-flag"></i>현재 여행계획에 추가
                  </v-list-item-icon>
                </v-list-item-content>
              </v-list-item>

              <v-divider
                v-if="index + 1 < searchResult.length"
                :key="`divider-${index}`"
              >
              </v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="6">
        <div ref="maparea" id="map"></div>
        <!--
    <div class="button-group">
      <button @click="changeSize(0)">Hide</button>
      <button @click="changeSize(400)">show</button>
      <button @click="displayMarker(markerPositions1)">marker set 1</button>
      <button @click="displayMarker(markerPositions2)">marker set 2</button>
      <button @click="displayMarker([])">marker set 3 (empty)</button>
      <button @click="displayInfoWindow">infowindow</button>
    </div>-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import restAPI from "@/util/http-common.js";
import AttrIconComponent from "@/components/attraction/AttrIconComponent.vue";

import { mapState, mapGetters } from "vuex";
const memberStore = "memberStore";
export default {
  name: "KakaoMap",
  components: {
    AttrIconComponent,
  },

  props: {
    plan_thumbnail: {
      type: String,
      default: null,
    },
    plan_id: {
      type: Number,
      default: 0, // Set a default value
    },
    plannedMarkers: [],
    drawline: {
      type: Number,
    },
  },

  data() {
    return {
      showProgress: false,
      progressValue: 0,
      duration: 5000,
      sido_code: 0,
      search_keyword: "",
      selectedArray: [],

      searchResult: null,
      polyline: {},
      sidoOptions: {
        1: "서울",
        2: "인천",
        3: "대전",
        4: "대구",
        5: "광주",
        6: "부산",
        7: "울산",
        8: "세종특별자치시",
        31: "경기도",
        32: "강원도",
        33: "충청북도",
        34: "충청남도",
        35: "경상북도",
        36: "경상남도",
        37: "전라북도",
        38: "전라남도",
        39: "제주도",
      },

      markerPositions1: [
        [33.452278, 126.567803],
        [33.452671, 126.574792],
        [33.451744, 126.572441],
      ],
      markerPositions2: [
        [37.499590490909185, 127.0263723554437],
        [37.499427948430814, 127.02794423197847],
        [37.498553760499505, 127.02882598822454],
        [37.497625593121384, 127.02935713582038],
        [37.49629291770947, 127.02587362608637],
        [37.49754540521486, 127.02546694890695],
        [37.49646391248451, 127.02675574250912],
      ],
      markers: [],
      infowindow: null,
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);

      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=7fafcfaa79144580b71860569e0fd544";
      document.head.appendChild(script);

      console.log("맵에서 마커 조회");
      console.log(this.plannedMarkers);
      this.displayMarker(this.plannedMarkers);
    }
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "isLoginError", "userInfo"]),
    ...mapGetters(["checkUserInfo"]),
  },

  watch: {
    plannedMarkers(newValue) {
      console.log(newValue);
      // React to changes in the prop value
      if (window.kakao && window.kakao.maps && this.drawline != 1) {
        console.log(this.drawline);
        this.displayMarker(newValue);
      }
      //else if (window.kakao && window.kakao.maps && this.drawline==1) this.draw();
    },
    drawline(newValue) {
      console.log(newValue);
      if (window.kakao && window.kakao.maps) {
        this.draw();
      }
    },
  },

  methods: {
    startProgress() {
      this.showProgress = true;
      const interval = 50; // Interval to update the progress value (milliseconds)
      const steps = this.duration / interval;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        this.progressValue = (step / steps) * 100;

        if (step >= steps) {
          clearInterval(timer);
          this.showProgress = false;
        }
      }, interval);
    },
    //관광지 검색
    searchAttraction() {
      this.startProgress();
      // const contentTypeIds = this.selectedArray.join(",");
      const searchData = {
        sidoCode: this.search_keyword == "" ? this.sido_code : null, //지역선택 없이 검색어만 입력할 경우 정상 검색.
        searchKeyword: this.search_keyword,
        contentTypeIds: this.selectedArray,
        user_id: this.userInfo.user_id,
      };

      restAPI
        .post(`/api/attractions`, searchData)
        .then(({ data }) => {
          this.searchResult = data;
          const resultMarkers = [];
          //시도, 구군 코드까지 반영 가능?
          for (let i = 0; i < data.length; i++) {
            resultMarkers.push([data[i].latitude, data[i].longitude]);
          }
          console.log(resultMarkers);
          this.displayMarker(resultMarkers);
        })
        .catch(() => alert("통신 중 문제가 발생했습니다."));
      //catch문 위치 수정.
      let scroll = "";
      scroll = this.$refs.maparea;
      scroll.scrollIntoView({ behavior: "smooth" });
    },

    //좋아요
    toggleLike(item) {
      //다른 브라우저 탭에서 이미 좋아요를 제거한 경우?
      //특정 Exception만 캐치할 수 있을까?
      const likesData = {
        user_id: this.userInfo.user_id,
        content_id: item.content_id,
      };
      if (item.user_liked > 0) {
        /*
        const likesData = {
          user_id: "ssafy",
          content_id: item.content_id,
        };
        console.log(likesData);*/
        restAPI
          .delete(`/api/attractions/likes`, { data: likesData })
          .then(((item.user_liked = 0), (item.likes -= 1)))
          .catch(() => alert("통신 중 문제가 발생했습니다."));
      } else {
        /*
        const likesData = {
          user_id: "ssafy",
          content_id: item.content_id,
        };
        console.log(likesData);*/
        restAPI
          .post(`/api/attractions/likes`, likesData)
          .then(((item.user_liked = 1), (item.likes += 1)))
          .catch(() => alert("통신 중 문제가 발생했습니다."));
      }
    },

    updatePlanThumbnail(first_image) {
      const planData = {
        plan_id: this.plan_id,
        plan_thumbnail: first_image,
      };

      restAPI
        .put(`/api/plans/`, planData)
        .then()
        .catch((error) => console.log(error));
    },

    registerPlanDetail(content_id, first_image) {
      const planDetailData = {
        plan_id: this.plan_id,
        content_id: content_id,
      };
      restAPI
        .post(`/api/plans/details`, planDetailData)
        .then(alert("등록되었습니다."), this.$emit("newPlanDetailAdded"))
        .catch(() => alert("통신 중 문제가 발생했습니다."));

      if (this.plan_thumbnail === null && first_image !== null) {
        this.updatePlanThumbnail(first_image);
      }
      //등록할 때마다 현재 목록에 있는지 없는지 대조?
    },

    //=================카카오 지도 메서드=========================
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };

      //지도 객체를 등록합니다.
      //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options);
      this.polyline = new kakao.maps.Polyline();
    },
    draw() {
      if (this.drawline == 0) {
        this.polyline.setMap(null);
        return;
      }
      this.polyline.setMap(null);
      const positions = this.plannedMarkers.map(
        (position) => new kakao.maps.LatLng(...position)
      );
      this.polyline = new kakao.maps.Polyline({
        path: positions, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 4, // 선의 두께 입니다
        strokeColor: "#1DADE2", // 선의 색깔입니다
        strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: "solid", // 선의 스타일입니다
      });
      // 지도에 선을 표시합니다
      this.polyline.setMap(this.map);
    },
    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },
    displayMarker(markerPositions) {
      /*
let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(40, 45), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(15, 35)}; 
     // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);*/
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      if (positions.length > 0) {
        this.markers = positions.map(
          (position) =>
            new kakao.maps.Marker({
              map: this.map,
              position,
              //image: markerImage // 마커이미지 설정 
            })
        );
        //foreach로 설정할 방법?

        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds()
        );

        this.map.setBounds(bounds);
      }
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        this.map.setCenter(this.infowindow.getPosition());
        return;
      }

      var iwContent =
          '<div style="padding:5px; border-radius:20%;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      this.map.setCenter(iwPosition);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: 400px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>
