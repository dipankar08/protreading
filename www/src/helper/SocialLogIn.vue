<template>
  <div class="d_layout_col d_layout_center_all social_login">
    <p class="login_text d_mb20">Login using social account</p>
    <vue-google-login class="google-btn d_layout_row" :params="params" :onSuccess="onSuccess" :onFailure="onFailure">
      <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/componentss/5/53/Google_%22G%22_Logo.svg" />
      <p class="btn-text"><b>Sign in with google</b></p>
    </vue-google-login>
    <v-facebook-login class="d_mt20" app-id="186436819581071" @login="onFacebookLogin" @logout="onFacebookLogout"></v-facebook-login>
    <p class="d_mt20 d_test_caption">
      Using social login, you can login to ProTreading in a single click. Note that if you can login into two dirrent account if you use Facebook or
      Google Account
    </p>
  </div>
</template>
<script>
import VueGoogleLogin from "vue-google-login";
import VFacebookLogin from "vue-facebook-login-component";
import { localEvent } from "@/components/webdev/typescript/localEvent";
import { notification } from "./lib";
export default {
  name: "GoogleLogin",
  data() {
    return {
      params: {
        client_id: "290736876800-g9jg0bbgrgjkl2m2ta5hamabe2568lms.apps.googleusercontent.com",
      },
      renderParams: {
        width: 250,
        height: 50,
      },
    };
  },
  components: {
    VueGoogleLogin,
    VFacebookLogin,
  },
  methods: {
    onSuccess(data, org) {
      console.log(data);
      data = {
        type: "Google",
        user_id: data.getBasicProfile().getEmail(),
        user_name: data.getBasicProfile().getName(),
        img: data.getBasicProfile().getImageUrl(),
      };
      this.$emit("onLoginSuccess", data);
      localEvent.notify("auth", data);
    },
    onFailure(err) {
      console.log(err);
      this.$emit("onLoginFail", {
        error: "Unknown error",
      });
    },
    onFacebookLogin(data) {
      console.log(data);
      data = {
        type: "Facebook",
        user_id: data.authResponse.userID,
      };
      this.$emit("onLoginSuccess", data);
      localEvent.notify("auth", data);
    },
    onFacebookLogout(data) {
      console.log(data);
      this.$emit("onLoginFail", {
        error: "Unknown error",
      });
    },
  },
};
</script>
<style scoped lang="scss">
$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669f2;
.social_login {
  width: 320px;
}
.login_text {
  font-size: 16px;
  opacity: 0.7;
}

.google-btn {
  align-items: center;
  border: 0px;
  width: 220px;
  height: 38px;
  background-color: #4285f4;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
  align-items: center;
  justify-content: center;
  border: 0px;
  cursor: pointer;
  .google-icon {
    width: 26px;
    height: 26px;
    margin-left: 10px;
    background: white;
    margin-right: 10px;
    padding: 3px;
    border-radius: 4px;
  }
  .btn-text {
    margin: 11px 11px 0 0;
    color: $white;
    font-size: 14px;
    letter-spacing: 0.2px;
  }
  &:hover {
    box-shadow: 0 0 6px $google-blue;
  }
  &:active {
    background: $button-active-blue;
  }
}
</style>
