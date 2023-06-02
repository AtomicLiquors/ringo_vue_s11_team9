<template>
  <footer class="mainfooter" role="contentinfo">
    <v-container class="justify-center mt-5">
      <v-row justify="center" align="center">
        <v-spacer></v-spacer>
        <v-col cols="1">
          <!--Column1-->
          <v-img
            src="@/assets/img/logo/vueLogo.png"
            max-height="50px"
            max-width="50px"
            contain
          ></v-img>
        </v-col>
        <v-col cols="1">
          <!--Column1-->
          <v-img
            src="@/assets/img/logo/ssafyLogo.png"
            max-height="70px"
            max-width="70px"
            contain
          ></v-img>
        </v-col>
        <v-col cols="1">
          <!--Column1-->
          <v-img
            src="@/assets/img/logo/vuetifyLogo.png"
            max-height="50px"
            max-width="50px"
            contain
          ></v-img>
        </v-col>
        <v-col cols="1">
          <!--Column1-->
          <v-img
            src="@/assets/img/logo/springLogo.png"
            max-height="50px"
            max-width="50px"
            contain
          ></v-img>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row justify="center" align="center">
        <v-col cols="1">
          <!--Column1-->
          <v-img
            src="@/assets/img/logo/openaiLogo.png"
            max-height="200px"
            max-width="200px"
            contain
          ></v-img>
        </v-col>
        <v-col cols="2">
          <!--Column1-->
          <v-img
            src="@/assets/img/logo/kakaodevLogo.png"
            max-height="230px"
            max-width="230px"
            contain
          ></v-img>
        </v-col>
      </v-row>
      <br />
      <div class="col-md-12 copy">
        <!--
        <v-row align="center" justify="center" class="mt-3">
          <ul class="social-network social-circle">
            <li>
              <a href="#" class="icoFacebook" title="Facebook"
                ><i class="fa fa-facebook"></i
              ></a>
            </li>
            <li>
              <a href="#" class="icoLinkedin" title="Linkedin"
                ><i class="fa fa-linkedin"></i
              ></a>
            </li>
            <li>
              <a href="#" class="icoLinkedin" title="Linkedin"
                ><i class="fa fa-linkedin"></i
              ></a>
            </li>
          </ul>  
        </v-row>-->

        <v-row class="mt-3 mb-5 text-center">
          <div>최효빈 email : gyqls234@naver.com</div>
          <div>이강희 email : kanghee96@gmail.com</div>
        </v-row>
      </div>
    </v-container>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
footer {
  background: -webkit-linear-gradient(59deg, #3a6073, #16222a);
  background: linear-gradient(59deg, #3a6073, #16222a);

  background: #541c0d; /*카카오톡 짭*/
  background: #587cff; /*보색*/
  background: #7fd8be; /* 채도와 명도가 모두 낮아야 된다. 파스텔톤으로 가겠다면 채도를 낮춰라. */
  background: #71807b;
  color: #f0f0f0;
}

footer ul {
  padding-left: 10px;
}

footer a {
  font-size: 14px;
  transition-duration: 0.2s;
  color: #f0f0f0 !important;
  text-decoration: none;
}

footer a:hover {
  color: #9cb4ff !important;
  text-decoration: underline;
}

.copy {
  font-size: 12px;
  padding: 10px;
  border-top: 1px solid #ffffff;
}

.footer-middle {
  padding-top: 2em;
  color: white;
}

/*SOCİAL İCONS*/

/* footer social icons */

ul.social-network {
  list-style: none;
  display: inline;
  text-align: center;
  margin-left: 0 !important;
  padding: 0;
}

ul.social-network li {
  display: inline;
  margin: 0 5px;
}

/* footer social icons */

.social-network a.icoFacebook:hover {
  background-color: #3b5998;
}

.social-network a.icoLinkedin:hover {
  background-color: #007bb7;
}

.social-network a.icoFacebook:hover i,
.social-network a.icoLinkedin:hover i {
  color: #fff;
}

.social-network a.socialIcon:hover,
.socialHoverClass {
  color: #44bcdd;
}

.social-circle li a {
  display: inline-block;
  position: relative;
  margin: 0 auto 0 auto;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  text-align: center;
  width: 30px;
  height: 30px;
  font-size: 15px;
}

.social-circle li i {
  margin: 0;
  line-height: 30px;
  text-align: center;
}

.social-circle li a:hover i,
.triggeredHover {
  -moz-transform: rotate(360deg);
  -webkit-transform: rotate(360deg);
  -ms--transform: rotate(360deg);
  transform: rotate(360deg);
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -o-transition: all 0.2s;
  -ms-transition: all 0.2s;
  transition: all 0.2s;
}

.social-circle i {
  color: #595959;
  -webkit-transition: all 0.8s;
  -moz-transition: all 0.8s;
  -o-transition: all 0.8s;
  -ms-transition: all 0.8s;
  transition: all 0.8s;
}

.social-network a {
  background-color: #f9f9f9;
}
</style>