<template>
  <div class="landing d_layout_row d_layout_equal">
    <div class="d_layout_col left d_layout_center">
      <p class="t1 d_white_9">Find stocks before they <span class="underline">blow up.</span></p>
      <p class="t2 d_white_6">
        Save 20+ hours of research a week, hear about stocks that have the potential to 10x-100x before they actually do plus get exclusive content
        you won’t find anywhere else.
      </p>
      <p class="d_mt20 d_white_9">Pro-Treading is finest technical analysis tool which provides :</p>
      <ul class="d_mt10 d_white_8">
        <li>
          <span class="mdi mdi-checkbox-marked-circle"></span> Find the best ticker to invest in using
          <span class="underline">Advance Stock Screener</span>
        </li>
        <li>
          <span class="mdi mdi-checkbox-marked-circle"></span> Back test your treading strategy using <span class="underline"> with out code.</span>
        </li>
        <li>
          <span class="mdi mdi-checkbox-marked-circle"></span>Find-out possible breakout or breakdown down events
          <span class="underline"> for intra day.</span>
        </li>
      </ul>
    </div>
    <div class="d_layout_col d_layout_center_all">
      <social-log-in class="d_mt20" @onLoginSuccess="onLoginSuccess" />
    </div>
  </div>
</template>
<script>
import SocialLogIn from "../helper/SocialLogIn.vue";

export default {
  components: { SocialLogIn },
  methods: {
    onLoginSuccess(data) {
      console.log(data);
    },
  },
};
</script>
<style scoped lang="scss">
.landing {
  .left {
    background: #666600; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #666600, #999966); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #666600, #999966); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    padding: 40px;
    .t1 {
      font-size: 50px;
      font-weight: bold;
      width: 430px;
      line-height: 1.3;
      margin-bottom: 50px !important;
    }
    .t2 {
      font-size: 16px;
      width: 90%;
      line-height: 1.5;
    }
  }
  .right {
  }
  li {
    list-style: none;
    .mdi {
      color: #9aef18;
      font-size: 25px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  .underline {
    border-bottom: 2px solid #efef10fc;
  }
}
</style>
