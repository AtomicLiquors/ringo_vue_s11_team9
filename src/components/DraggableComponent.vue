<template>
  <div>
    <draggable v-model="draggable1" group="people" @start="drag=true" @end="drag=false">
      <v-card v-for="element in draggable1" :key="element.id">{{element.data}}</v-card>
    </draggable>
    <hr>
    <draggable v-model="draggable2" group="people" @start="drag=true" @end="drag=false">
      <v-card v-for="element in draggable2" :key="element.id">{{element.data}}</v-card>
    </draggable>
    <v-btn @click="prepareData"></v-btn>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      draggable1: [
        { id: 1, data: 'Item 1' },
        { id: 5, data: 'Item 2' },
        { id: 2, data: 'Item 2' },
        
      ],
      draggable2: [
        { id: 4, data: 'Item 1' },
        { id: 3, data: 'Item 3' },
        { id: 6, data: 'Item 3' },
      ],
    };
  },
  methods:{
    printResult(){
      console.log(this.draggable1);
      console.log(this.draggable2);
    },

    prepareData(data){
      console.log(data);
      //select문으로 데이터 덩어리가 왔다. prev_id가 맨 앞에 오고, 나머지는 날짜순으로 정렬된 데이터.
      //잘하면 정렬 필요없을수도.
      //전제 : 수정, 삭제, 삽입 모두에 링크드리스트 번호 부여가 잘 되는가?

      //v-model과 연결되어 v-for를 동적으로 돌릴 plansPerDay 입갤
       
            /*
      //처음 레코드들을 각자 날짜에 해당하는 배열에 push한다. 배열 생성은 어떻게?
       //prev_id가 null일 동안 돌린다.
        //나머지는 Map에다 때려박는다.
      
      while(true){
          break;
 

          data.forEach((record) => {
            const date = record.trip_date === null ? null : record.trip_date;
            //성능 우려.

            if (!dataMap.has(date)) {
              dataMap.set(date, []);
            }
            dataMap.get(date).push(record);
          });

          this.plansPerDay = Array.from(dataMap);
          console.log(this.plansPerDay);
          console.log(this.plansPerDay[0]);
      };


        //각각의 배열에 대해서 next_id가 null일 때까지 map에서 찾아서 배열에 push.
      for(ppd in this.plansPerDay){
        let head = ppd[0];
        let next = null;
        while(head.next_id != null){
          next = map[head.next_id];
          ppd.push(next);
          head = next;
        }
      };
        
      //
/*
      const bulk = [
        { id: 1, group: 'draggable1', prev: null, next: 5, data: 'Item 1' },
        { id: 5, group: 'draggable1', prev: 1, next: 2, data:'Item 2' },
        { id: 3, group: 'draggable2', prev: 4, next: 6, data: 'Item 3' },
        { id: 4, group: 'draggable2', prev: null, next: 3, data: 'Item 1' },
        { id: 2, group: 'draggable1', prev: 5, next: null, data:'Item 2' },
        { id: 6, group: 'draggable2', prev: 3, next: null, data: 'Item 3' },        
      ];*/

      //this.draggable1 = bulk;
      


    }
  }
};
</script>
