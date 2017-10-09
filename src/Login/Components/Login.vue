<style lang="scss" >

  a.basic {
    color:#fff;
    text-decoration: underline;
  }

  #login-form {
      width: 350px;
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

</style>

<template>
    <div id="login-container">
      <div v-if="password_success" id="error-message-container">
          <div id="error-message" class="ui message inverted green secondary segment">
              <i class="inverted close icon" @click.prevent="hidePasswordMessage"></i>
              <div class="">We have emailed you a password reset link. Just follow the instructions provided with it to gain access to Croud Control.</div>
          </div>
      </div>

      <div v-if="error_message" id="error-message-container">
          <div id="error-message" class="ui message inverted red secondary segment">
              <i class="close icon" @click.prevent="hideErrorMessage"></i>
              <div class="">Sorry, we can't find you with the details you have entered. Please try again.</div>
              <p>
                <a class="ui mini inverted button" @click="view='password'">Forgot your password?</a>
              </p>
          </div>
      </div>

      <div v-if="password_error" id="error-message-container">
          <div id="error-message" class="ui message inverted red secondary segment">
              <i class="close icon" @click.prevent="hidePasswordErrorMessage"></i>
              <div class="">Sorry, we can't find you with your email address. Please try again.<br />If this continues, please email <a class="basic" href="mailto:croudsupport@croud.co.uk">croudsupport@croud.co.uk</a> for further assistance.</div>
          </div>
      </div>

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
                            <div v-bind:class="['field', {'field-error' : errors}]">
                                <input ref="username" type="text" name="email" placeholder="Enter your username" v-model="username" @focus="this.errors = false" @keypress.enter.prevent="focusPassword">
                            </div>
                            <div v-bind:class="['ui', 'action', 'input', 'fluid', {'field-error' : errors}]">
                                <input ref="password" :type="!display_password ? 'password' : 'text'" name="password" placeholder="Enter your password" :value="password" @input="password = $event.target.value"  @focus="this.errors = false" @keypress.enter.prevent="check">
                                <button class="toggle-button ui button" :class="{yellow: display_password}" @click.prevent="display_password = !display_password">
                                    <span v-if="display_password">Hide</span>
                                    <span v-else>Show</span>
                                </button>
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
                             <input type="text" name="email" placeholder="Email" v-model="reminder_email">
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
