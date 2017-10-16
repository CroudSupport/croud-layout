<style lang="scss" >
  @import "~animate.css/source/_base";
  @import "~animate.css/source/attention_seekers/shake";
  @import "~animate.css/source/bouncing_entrances/bounceInDown";
  @import "~animate.css/source/fading_exits/fadeOutDown";

  a.basic {
    color:#fff;
    text-decoration: underline;
  }

  #login-form {
      width: 350px;
      margin: 0 auto;
      .logo-background,
      .ui.segments {
          margin:0 !important;
          border: none !important;
      }
      .ui.segment.footer
       {
         padding-bottom:0;
       }
  }

  .logo-background {
      border-bottom-right-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      background: #292929!important;
  }

  .form-fields-container {
      border-top-right-radius: 0 !important;
      border-top-left-radius: 0 !important;
      position: absolute;
      z-index: 5;
      overflow: visible;
      width: 100%;
  }

  i.inverted.circular.blue.icon {
      &.twitter {
          background-color: #00ACED !important;
      }
      &.facebook {
          background-color: #3B5998 !important;
      }
      &.facebook {
          background-color: #0077B5 !important;
      }
  }

  #login-logo {
      background: url(/static/img/croud_logo_new.svg) no-repeat scroll 50% transparent;
      background-size: 90%;
      display: block;
      float: none;
      height: 150px;
      margin: 0;
      overflow: hidden;
      text-indent: -999px;
  }

  .remember-me {
      margin-bottom: 20px;
  }

  #form-fields-container {
      background-color: #ffffff;
  }

  #error-message-container {
    position: fixed;
    margin: 0 auto;
    top: 15px;
    left: 0;
    right: 0;
    width: 40%;
    z-index: 10;
    text-align: center;
}

</style>

<template>
    <div id="login-container">
        <transition
        name="custom-classes-transition"
        enter-active-class="animated bounceInDown"
        leave-active-class="animated fadeOutDown">
            <div v-if="passwordSuccess && view === 'password'" id="error-message-container">
                <div id="error-message" class="ui message inverted green secondary segment">
                    <i class="inverted close icon" @click.prevent="hidePasswordMessage"></i>
                    <div> {{ passwordSuccessMessage }} <br /> <span v-html="emailUs"/> </div>
                </div>
            </div>
        </transition>

        <transition
        name="custom-classes-transition"
        enter-active-class="animated bounceInDown"
        leave-active-class="animated fadeOutDown">
            <div v-if="errorMessage || passwordError" id="error-message-container">
                <div id="error-message" class="ui message inverted red secondary segment">
                    <i class="close icon" @click.prevent="hideErrorMessage"></i>
                    <div> {{ generalError }} <br /> <span v-html="emailUs"/> </div>
                    <p>
                    <a class="ui mini inverted button" @click="view='password'">Forgot your password?</a>
                    </p>
                </div>
            </div>
        </transition>

        <div id="login-form">
            <div class="ui segments">
              <div class="ui segment logo-background">
                  <div id="login-logo">Welcome to Croud Control</div>
              </div>
              <transition name="slider" mode="out-in"
                @enter-cancelled="$options.transitions.slider.enterCancelled"
                @leave="$options.transitions.slider.leave"
                @leave-cancelled="$options.transitions.slider.leaveCancelled"
                @enter="$options.transitions.slider.enter">
                <div v-if="view == 'login'" class="ui segments login-segment">
                    <form class="ui form" id="form-fields-container">
                        <div class="ui segment padded">
                            <div ref="userCredFields" class="animated">
                                <div v-bind:class="['field', {'field-error' : errors}]">
                                    <input ref="username" type="text" name="email" placeholder="Enter your email address" v-model="username" @focus="errors = false" @keypress.enter.prevent="focusPassword">
                                </div>
                                <div v-bind:class="['ui', 'action', 'input', 'fluid', {'field-error' : errors}]">
                                    <input ref="password" :type="!displayPassword ? 'password' : 'text'" name="password" placeholder="Enter your password" :value="password" @input="password = $event.target.value"  @focus="errors = false" @keypress.enter.prevent="check">
                                    <button class="toggle-button ui button" :class="{yellow: displayPassword}" @click.prevent="displayPassword = !displayPassword">
                                        <span v-if="displayPassword">Hide</span>
                                        <span v-else>Show</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <!-- <div class="ui segment padded" ></div> -->
                    <div class="ui segment center aligned padded" id="form-container">
                        <div class="field remember-me">
                            <div class="ui checkbox">
                                <input type="checkbox" tabindex="0" v-model="remember">
                                <label class="light">Remember me next time</label>
                            </div>
                        </div>
                        <button v-bind:class="['ui','button', 'fluid', 'blue', {'loading': loading}]" @click="check">Sign in to Croud Control</button>
                        <div class="ui horizontal divider">Or</div>
                        <i title="Google" class="red inverted circular large google link icon" @click="socialAuth('google')"></i>
                        <i title="Facebook" class="blue inverted circular large facebook link icon" @click="socialAuth('facebook')"></i>
                        <!-- <i title="Twitter" class="blue inverted circular large twitter link icon" @click="socialAuth('twitter')"></i> -->
                        <i title="Linkedin" class="blue inverted circular large linkedin link icon" @click="socialAuth('linkedin')"></i>
                        <!-- <i title="Github" class="circular large github alternate link icon" @click="socialAuth('github')"></i> -->

                        <div class="ui segment basic footer">
                            <button class="ui button mini basic" @click.prevent="view='password'">Forgot your password?</button>
                        </div>
                    </div>
                </div>
              </transition>
              <transition name="slider" mode="out-in"
                @enter-cancelled="$options.transitions.slider.enterCancelled"
                @leave="$options.transitions.slider.leave"
                @leave-cancelled="$options.transitions.slider.leaveCancelled"
                @enter="$options.transitions.slider.enter">
                <div v-if="view == 'password'" class="ui segments login-segment form-fields-container"  transition="slider" transition-mode="out-in">
                 <div class="ui segment padded">
                     <form class="ui form">
                         <p>Enter your email address and we will send you a link to reset your password</p>
                         <div class="ui field">
                             <input ref="reminderEmail" class="animated" type="text" name="email" placeholder="Email" v-model="reminderEmail">
                         </div>
                     </form>
                 </div>
                 <div class="ui segment padded">
                     <button v-bind:class="['ui','button', 'fluid', 'blue', {'loading': loading}]" @click="submitPasswordLink">Send Password Reset Link</button>

                     <div class="ui segment basic footer">
                         <button class="ui button mini basic" @click.prevent="view='login'">Sign in instead</button>
                     </div>
                 </div>
             </div>
              </transition>
          </div>
        </div>
    </div>
</template>

<script>
    import Mixin from '../mixin'

    export default {
        mixins: [Mixin],
    }
</script>
