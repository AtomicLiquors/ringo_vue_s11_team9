<template>
        <v-card class="pa-5" height="600px">
          <v-card-title class="text-h5 mb-3">Terms and Conditions</v-card-title>
          <p>Thank you for choosing EnjoyTrip! Please read these terms and conditions carefully before using our website.</p>
          <v-card-text class="terms border rounded-lg">
            
            <h2>1. Introduction</h2>
            <p>These terms and conditions govern your use of our website; by using our website, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use our website.</p>
            <h2>2. License to use website</h2>
            <p>Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved.</p>
            <h2>3. Acceptable use</h2>
            <p>You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.</p>
            <h2>4. Changes to the terms and conditions</h2>
            <p>We reserve the right to change these terms and conditions from time to time, and your continued use of the website following such changes shall be deemed to be your acceptance of such changes.</p>
          </v-card-text>
          <v-container justify="center" align="center" class="text-center">
          <v-card-actions class="justify-center">
          <v-btn @click="agreeFromChild" class="primary">동의</v-btn>
          <v-btn @click="refuseFromChild">거부</v-btn>
          <!--modal false를 emit-->
          </v-card-actions>
          <small>약관 내용을 상세히 읽어보시고 '동의'를 눌러주세요.</small>
          </v-container>
          
        </v-card>

</template>

<script>
export default {
  props: {
    agreed:{
      type: Boolean
    },
    joinDialog:{
      type: Boolean
    },
  },
  methods:{
    agreeFromChild(){
      this.$emit('didChildAgree', true);
      this.$emit("closeParentModal");
    }
    ,
    refuseFromChild(){
      this.$emit('didChildAgree', false);
      this.$emit("closeParentModal");
    }
  },
};
</script>

<style>
.terms{
  overflow-y: auto;
  max-height: 300px;
}
</style>