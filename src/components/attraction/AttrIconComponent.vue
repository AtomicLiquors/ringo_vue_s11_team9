<template>
  <div>
    <div
      class="icon-wrapper d-flex flex-wrap space-around justify-content-center"
    >
      <div
        class="icon-btn icon-box"
        v-for="(value, idx) in iconBtns"
        :key="idx"
        :style="{ flex: `0 0 ${100 / Math.ceil(iconBtns.length / 2)}%` }"
      >
        <div
          class="icon"
          @mouseover="hoverStyle(idx, $event, true)"
          @click="toggleSelection(idx, $event)"
          @mouseleave="hoverStyle(idx, $event, false)"
        >
          <i
            :class="['bx', iconBtns[idx].icon]"
            :style="{ color: iconBtns[idx].colorCode }"
          ></i>
        </div>
        <label>{{ iconBtns[idx].contentLabel }}</label>
      </div>
    </div>
  </div>
</template>

<script>
class iconBtn {
  constructor(colorCode, contentType, contentLabel, icon) {
    this.colorCode = colorCode;
    this.contentType = contentType;
    this.contentLabel = contentLabel;
    this.icon = icon;
  }
}

export default {


  data() {
    return {
      
      iconBtns: [
        new iconBtn("#47aeff", 12, "관광지", "bx-flag"),
        new iconBtn("#ffa76e", 14, "문화시설", "bx-mask"),
        new iconBtn("#e80368", 15, "축제공연행사", "bx-party"),
        new iconBtn("#ffbb2c", 25, "여행코스", "bx-paper-plane"),
        new iconBtn("#ff5828", 28, "레포츠", "bx-football"),
        new iconBtn("#11dbcf", 32, "숙박", "bx-bed"),
        new iconBtn("#ff7014", 38, "쇼핑", "bx-shopping-bag"),
        new iconBtn("#e614ff", 39, "음식점", "bx-fork")
      ],
    
      contentTypes: [],
      isSelected: [false, false, false, false, false, false, false, false],
    };
  },
  created(){
    this.iconBtns.forEach(iconBtn => {
      this.contentTypes.push(iconBtn.contentType);
    });
  },
  props: {
    //selectedArray,
  },

  methods: {
    toggleSelection(idx, event) {
      console.log(idx);
      this.isSelected[idx] = !this.isSelected[idx];
      console.log(this.isSelected);

      const border = this.isSelected[idx]
        ? "3px solid #ffc107"
        : "0px solid #ffc107";
      event.currentTarget.style.border = border;
      this.filterArrayByBoolean();
      //alert(this.filteredArray);
      this.$emit("filterUpdated", this.filteredArray);
    },
    filterArrayByBoolean() {
      this.filteredArray = this.contentTypes.filter(
        (value, index) => this.isSelected[index]
      );
    },
    hoverStyle(idx, event, flag) {
      if (this.isSelected[idx]) return;
      const div = event.currentTarget;
      div.style.background = flag ? this.iconBtns[idx].colorCode : "#f5f5f5";
      const i = div.querySelector("i");
      i.style.color = flag ? "#f5f5f5" : this.iconBtns[idx].colorCode;
    },
  },
};
</script>

<style scoped>
@import "@/assets/boxicon/css/animations.css";
@import "@/assets/boxicon/css/boxicons.css";
@import "@/assets/boxicon/css/boxicons.min.css";
@import "@/assets/boxicon/css/transformations.css";

.icon-box {
  text-align: center;
  padding: 0px 3vw;
  flex: 0 0 100%;
}

.icon-box .icon {
  margin: 0 auto;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #f5f5f5;
  transition: all ease-in-out 0.1s;
  border: 0px solid #ffc107;
  border-radius: 50px;
}

.icon-box label {
  font-family: "GyeonggiTitle";
  font-size: 15x;
  color: dimgray;
}

.icon-box .icon i {
  font-size: 32px;
  line-height: 1;
  transition: all ease-in-out 0.1s;
  position: relative;
}

.icon-box p {
  line-height: 24px;
  font-size: 14px;
  margin-bottom: 0;
}
</style>