<template>
<!--background-color: #FFF7DA; -->
  <div style="padding: 30px; min-height: 100%;">
    <!-- Board -->
    <h2 class="mb-5">{{ getTitle() }}</h2>

    <!--[05.17 관통 요구사항 추가에 따른 게시판 타입 동적 변경]-->
    <div v-if="board_type == 'qna'">
      궁금한 여행 정보를 자유롭게 질문하고, 댓글로 자유롭게 답하세요.
    </div>
    <div ref="writeblock">
      <v-btn href="#" @click.prevent="getBoards('normal')" color="#FFDB58" class="blue--text text-decoration-none">여행정보공유</v-btn>&nbsp;|&nbsp;
      <v-btn href="#" @click.prevent="getBoards('notice')" color="#FFDB58" class="blue--text text-decoration-none">공지사항</v-btn>&nbsp;|&nbsp;
      <v-btn href="#" @click.prevent="getBoards('qna')" color="#FFDB58" class="blue--text text-decoration-none" >QnA</v-btn>
    </div>
    <div class="mt-5"></div>

    
    <div class="d-flex mb-3">
      <v-btn @click="sort('board_id')" id="boardIdSort" class="sortBtn"
        >최신순</v-btn
      >
      <v-btn @click="sort('date')" id="dateSort" class="sortBtn" 
        >오래된 순</v-btn
      >
      <v-btn
        @click="sort('subject')"
        id="subjectSort"
        class="sortBtn"
        >제목순</v-btn
      >
      <v-btn @click="sort('user_id')" id="userIdSort" class="sortBtn" 
        >사용자순</v-btn
      >
    </div>
    <v-card
      v-if="showWrite"
      class="mt-5 p-4 border border-secondary rounded"
      style="background-color: #FFFFFF"
    >
      <!-- 글쓰기창 -->
      <v-form @submit.prevent="board_id ? updateBoard() : submitForm()">
        <input type="hidden" name="boar_type" :value="board_type" />
        <input type="hidden" name="user_id" :value="user.user_id" />
        <v-text-field
          v-model="subject"
          label="제목"
          outlined
          required
          class="title-field"
          input-class="input-field"
        ></v-text-field>
        <v-textarea
          v-model="content"
          autofocus
          label="내용"
          background-color="amber lighten-4"
          filled
          rows="5"
          auto-grow
          required
          class="content-field"
          input-class="input-field"
        ></v-textarea>
        <div class="d-flex gap-3 justify-end">
          <v-btn type="submit" class="btn btn-primary">저장</v-btn>
          <v-btn @click="cancelForm" class="btn btn-danger">취소</v-btn>
        </div>
      </v-form>
    </v-card>
    <!-- Show content    background-color="amber lighten-4"  ,  #FFECA7-->
    <v-container v-if="selectedPost" class="selected-post">
      <!-- <h3>제목: {{ selectedPost.board_subject }}</h3> -->
      <v-container class="post-content">
        <v-card>
          
          <v-card-title style="display:flex;">
           
          <v-img 
          :src="userimageinfo"
          max-height="100px"
          max-width="100px"
          v-on:error="userimageinfo='@/assets/upload/profile/img/default.jpg'"
          contain
        ></v-img>
        
        <div style="margin-left:10px;">
          <div> 글 제목 : {{ selectedPost.board_subject }}</div>
        <p class="post-info">
          작성자: {{ selectedPost.user_id }} &nbsp; 작성 시간:
          {{ selectedPost.board_regtime }}
        </p>
        </div>
        
        </v-card-title>
          <!-- <v-card-text> {{ selectedPost.board_content }}</v-card-text> -->
        </v-card>

        <div style="min-height:100px; border:1px solid gray; border-radius:5px; padding:20px">
          <!-- <v-row> <v-img 
          :src="userimageinfo"
          max-height="300px"
          max-width="300px"
          class="mx-auto"
          v-on:error="userimageinfo='@/assets/upload/profile/img/default.jpg'"
        ></v-img></v-row> -->
          <v-row> {{ selectedPost.board_content }}</v-row>
       </div>
        <p class="post-info">
          댓글창
        </p>

        <!-- Display comments -->
        <div
          class="comments"
          v-for="comment in comments"
          :key="comment.board_comments_id"
        >
          <div v-if="comment.isEditing">
            <v-textarea
              v-model="editedCommentContent"
              background-color="amber lighten-4"
              label="수정할 댓글 내용"
              filled
              rows="3"
              auto-grow
              required
              class="comment-field"
              input-class="input-field"
            ></v-textarea>
            <v-btn @click="updateComment(comment)" class="btn btn-primary"
              >댓글 수정</v-btn
            >
            <v-btn @click="cancelEdit(comment)" class="btn btn-danger"
              >취소</v-btn
            >
          </div>
          <div v-else>
            <p>{{ comment.user_id }}: {{ comment.board_comments_content }}</p>
            <p class="comment-info">
              작성 시간: {{ comment.board_comments_regtime }}
            </p>
            <v-btn v-show="userInfo!=null&&userInfo.user_id==comment.user_id" small @click="startEdit(comment)">수정</v-btn>
            <v-btn v-show="userInfo!=null&&userInfo.user_id==comment.user_id" small @click="deleteComment(comment)">삭제</v-btn>
          </div>
        </div>

        <!-- Add comment section -->
        <div v-if="this.userInfo!=null" class="comment-section">
          <h3>댓글 작성</h3>
          <v-textarea
            v-model="newComment"
            background-color="amber lighten-4"
            label="댓글 내용"
            filled
            rows="3"
            auto-grow
            required
            class="comment-field"
            input-class="input-field"
          ></v-textarea>
          <v-btn @click="submitComment" class="btn btn-primary"
            >댓글 작성</v-btn
          >
        </div>
      </v-container>
    </v-container>
    <!-- 글목록시작 -->
    <v-data-table
      :headers="headers"
      :items="boards"
      :page.sync="page"
      item-key="board_id"
      :items-per-page=10
      class="mt-4 elevation-1"
      hide-default-footer
      @page-count="pageCount = $event"
    >
      <!-- <template v-slot:[`item.board_id`]="{ board_id }">
        {{ index + 1 }}"v-show="userInfo.user_id==item.user_id"
      </template> -->
      <template v-slot:[`item.board_subject`]="{ item }">
        <a @click.stop="showContent(item)">{{ item.board_subject }}</a>
      </template>
      <template v-slot:[`item.actions`]="{ item }" >
        <v-btn v-show="userInfo !== null ? userInfo.user_id === item.user_id: false" small @click="editBoard(item)">수정</v-btn>
        <v-btn v-show="userInfo !== null ? userInfo.user_id === item.user_id: false" small @click="deleteBoard(item)">삭제</v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
    <!-- End Board -->
    <hr />
    <v-btn v-if="this.userInfo!=null" id="writeBtn" class="btn btn-primary mb-5" @click="showWriteBlock"
      >글쓰기</v-btn
    >
    <v-btn
      fixed
      right
      bottom
      elevation="2"
      color="#FFDB58"
      rounded
      @click="goUp"
      >
      ▲
    </v-btn>
  </div>
</template>

<script>
import empRestAPI from "@/util/http-common.js";
import { mapState,mapGetters} from "vuex";
const memberStore = "memberStore";
export default {
  data() {
    return {
      board_type: "",
      board_id: null,
      editedCommentContent: "",
      user: {
        user_id: "",
      },
      page: 1,
      pageCount: 0,
      headers: [
        { text: "글번호", value: "board_id" },
        { text: "제목", value: "board_subject" },
        { text: "작성자", value: "user_id" },
        { text: "작성시간", value: "board_regtime" },
        { text: "조회수", value: "board_views" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      list: [],
      showWrite: false,
      subject: "",
      content: "",
      tempuser_id:"",
      userimageinfo:"",
      boards: [],
      selectedPost: null, // Track the selected post
      comments: [], // To store the comments of the selected post
      newComment: "", // To bind to the comment input field
      editedComment: null, // To track the comment being edited
    };
  },
  computed:{
    ...mapState(memberStore, ["isLogin", "userInfo"]),
    ...mapGetters(["checkUserInfo"]),
    //console.log(this.$store.state.userInfo),
  },
  created() {
    //[05.17] getBoards가 수정됨에 따라 최초 호출시 매개변수 입력을 받는다.
    this.getBoards("normal");
  },
  methods: {
    goUp(){
      window.scrollBy(0,-1000000)
    },
    replaceImg() {
      this.userimageinfo = require("@/assets/upload/profile/img/default.jpg");
    },
    startEdit(comment) {
      comment.isEditing = true;
      this.editedCommentContent = comment.board_comments_content;
    },
    cancelEdit(comment) {
      comment.isEditing = false;
    },
    // editComment(comment) {
    //   this.editedComment = comment;
    //   this.newComment = comment.board_comments_content;
    // },this.showWrite=false;
    updateComment(comment) {
      const updatedComment = {
        ...comment,
        board_comments_content: this.editedCommentContent,
      };

      empRestAPI
        .put(`/api/comments/${comment.board_comments_id}`, updatedComment)
        .then(() => {
          // Refresh the comments after updating
          this.showContent(this.selectedPost);
          // Clear the comment edit field
          this.editedCommentContent = "";
          // Exit edit mode
          comment.isEditing = false;
        })
        .catch(() => console.log("댓글 수정 실패!"));
    },
    getTitle() {
      switch (this.board_type) {
        case "notice":
          return "공지사항";
        case "common":
          return "여행정보공유";
        case "qna":
          return "QnA";
        default:
          return "여행정보공유";
      }
      
    },
    showWriteBlock() {
      if(this.board_type=="notice" && this.userInfo.user_grade<10){
        alert("일반계정은 공지사항에 글쓰기가 불가합니다.")
      }else{
        this.showWrite = !this.showWrite;
        this.selectedPost = null;
        
      }
      //this.showWrite = !this.showWrite;
      //this.selectedPost = null; 
      
      /*
      switch (this.showWrite) {
        case true:
          return (this.showWrite = false);
        case false:
          return (this.showWrite = true);
      }*/
      //this.showWrite = true;
    },
    cancelForm() {
      this.showWrite = false;
      this.subject = "";
      this.content = "";
    },
    submitForm() {
      const now = new Date();
      const board = {
        user_id: this.userInfo.user_id,
        board_subject: this.subject,
        board_content: this.content, 
        board_type: this.board_type,
        board_regtime: now,
        board_view: 1,
      };

      alert(this.board_type);

      empRestAPI
        .post("/api/boards", board)
        .then(() => {
          this.getBoards(this.board_type); // Refresh the list after adding
          this.cancelForm(); // Clear the form
        })
        .catch(() => console.log("글 작성 실패!"));
      this.showWrite = false;
    },
    getBoards(board_type_param) {
      //[05.17] getBoards는 매개변수를 받아서 동적으로 uri를 변경하여 페이지를 호출한다.
      if (board_type_param == "") this.board_type = "normal";
      else{
        if(this.board_type!=board_type_param){
          this.cancelForm();
          this.selectedPost = null;
        }
        this.board_type = board_type_param;
      } 
      const uri = `/api/boards/list/${this.board_type}`;
      //
      if(this.showWrite==true){
        this.showWrite=false;
      }
      //백엔드와 통신하여 부서 목록을 요청한다.
      // empRestAPI.get("/api/boards/list/normal").then((response)=>(this.boards=response.data))
      // .catch(()=>console.log('목록 조회의 실패!!!!!!!'))
      // console.log("asd")
      empRestAPI
        .get(uri)
        .then((response) => {
          this.boards = response.data;

          // Sort the boards in descending order by board_id
          this.boards.sort((a, b) => {
            return b.board_id - a.board_id;
          });
        })
        .catch(() => console.log("글 목록 조회 실패!"));
    },
    sort(criteria) {
      switch (criteria) {
        case "subject":
          this.boards.sort((a, b) => {
            return a.board_subject.localeCompare(b.board_subject);
          });
          break;
        case "date":
          this.boards.sort((a, b) => {
            return -b.board_id + a.board_id;
          });
          break;
        case "board_id":
          this.boards.sort((a, b) => {
            return b.board_id - a.board_id;
          });
          break;
        case "user_id":
          this.boards.sort((a, b) => {
            return a.user_id.localeCompare(b.user_id);
          });
          break;
        default:
          break;
      }
    },
    async showContent(item) {
      //[05.17] 상세보기를 호출할 때마다 글쓰기 폼을 화면에서 제거하도록 한다.
      this.cancelForm();
      this.selectedPost = item;

      // Fetch the comments of the selected post
      await empRestAPI
        .get(`/api/boards/${item.board_id}`)
        .then((response) => {
          item.board_views = response.data.board_views;
          console.log(response.data.user_id);
          this.getBoards(item.board_type);
          this.tempuser_id = response.data.user_id;
        })
        .catch(() => console.log("조회수 조회 실패!"));
      await empRestAPI
        .get(`/api/comments/list/${item.board_id}`)
        .then((response) => {
          this.comments = response.data.map((comment) => ({
            ...comment,
            isEditing: false, // Add the isEditing state here
          }));
        })
        .catch(() => console.log("댓글 조회 실패!"));
        let scroll2 = "";
        scroll2 = this.$refs.writeblock;
        scroll2.scrollIntoView({ behavior: "smooth" });

        await empRestAPI
        .get(`/api/users/${this.tempuser_id}`)
        .then((response) => {
          if(response.data.user_img == null){
            this.userimageinfo = require("@/assets/upload/profile/img/default.jpg");
          }else{
            this.userimageinfo = require("@/assets/upload/profile/img/"+response.data.user_img);
          }
        })
    },
    updateBoard() {
      const board = {
        board_type: this.board_type,
        user_id: this.user.user_id,
        board_id: this.board_id,
        board_subject: this.subject,
        board_content: this.content,
        board_regtime: this.board_regtime,
        board_view: 1,
      };

      empRestAPI
        .put(`/api/boards/${this.board_id}`, board)
        .then(() => {
          this.getBoards(this.board_type); // Refresh the list after updating
          this.cancelForm(); // Clear the form
        })
        .catch(() => console.log("글 수정 실패!"));
      this.showWrite = false;
      this.selectedPost = "";
      this.board_id = "";
    },
    deleteBoard(board) {
      this.board = this.editBoard2(board);
      empRestAPI
        .delete(`/api/boards/${board.board_id}`)
        .then(() => {
          this.getBoards(this.board_type); // Refresh the list after deleting
        })
        .catch(() => console.log("글 삭제 실패!"));
      this.content = "";
      this.subject = "";
      this.board_id = null;
    },
    editBoard(board) {
      // Populate the form with the board data to be updated
      this.board_id = board.board_id;
      this.board_type = board.board_type;
      this.user.user_id = board.user_id;
      this.subject = board.board_subject;
      this.content = board.board_content;
      this.showWrite = true; // Show the form
    },
    editBoard2(board) {
      // Populate the form with the board data to be updated
      this.board_id = board.board_id;
      this.board_type = board.board_type;
      this.user.user_id = board.user_id;
      this.subject = board.board_subject;
      this.content = board.board_content;
    },
    submitComment() {
      const now = new Date();
      const comment = {
        board_id: this.selectedPost.board_id,
        board_comments_content: this.newComment,
        user_id: this.userInfo.user_id, // Replace with the actual user_id
        board_comments_regtime: now,
      };

      empRestAPI
        .post("/api/comments", comment)
        .then(() => {
          // Refresh the comments after adding a new one
          this.showContent(this.selectedPost);
          // Clear the comment input field
          this.newComment = "";
        })
        .catch(() => console.log("댓글 작성 실패!"));
    },
    deleteComment(comment) {
      empRestAPI
        .delete(`/api/comments/${comment.board_comments_id}`)
        .then(() => {
          // Refresh the comments after deleting
          this.showContent(this.selectedPost);
        })
        .catch(() => console.log("댓글 삭제 실패!"));
    },
  },
};
</script>
<style scoped>
*{
  font-family: GyeonggiTitle;
}


.board-link {
  text-decoration: none;
  color: #2196f3;
}

.sortBtn {
  border-radius: 20px;
  background-color: white;
}

button {
  margin-left: 10px;
}

.selected-post {
  background-color: white;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.post-content {
  margin-top: 10px;
}

.post-info {
  color: #888;
  margin-top: 10px;
}

.comment-section {
  margin-top: 20px;
}

.comments {
  margin-top: 10px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}

.comment-info {
  color: #888;
}
</style>