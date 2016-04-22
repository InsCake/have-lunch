<template>
    <section class="login" @click="hideLogin()">

        <!-- phone -->
        <label class="login-phone input-row"
               v-show="is_login_phone_show"
               transition="slide-up"
               @click.stop>
            <i class="fa fa-phone"></i>
            <input type="tel" v-model="user.mobilePhoneNumber">
        </label>

        <!-- SMS code -->
        <label class="login-code input-row"
               v-show="is_login_code_show"
               transition="slide-up"
               @click.stop>
            <i class="fa fa-key"></i>
            <input type="tel" v-model="user.smsCode">
            <div class="sms-code-wrap">
                <span class="sms-code-btn"
                      @click="requestSmsCode()"
                      v-show="is_sms_btn_show"
                      transition="slide-left">获取验证码</span>
                <span class="sms-code-status"
                      v-show="is_sms_status_show"
                      transition="slide-right">{{ sms_code_status }}</span>
            </div>
        </label>


        <!-- login button -->
        <i class="fa fa-sign-in" @click="doLogin"></i>

    </section>
</template>

<style scoped>
    .login { position: fixed; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; background: rgba(250, 250, 250, .5); }
    .login .fa { font-size: 26px; color: #999; vertical-align: top; }
    .input-row { position: absolute; display: block; left: 8%; box-shadow: 0 8px 32px -12px rgba(0, 0, 0, .5); background-color: #fff; width: 84%; }
    .input-row.login-phone { top: 80px; }
    .input-row.login-code { top: 127px; }
    .input-row .fa { position: absolute; left: 28px; top: 50%; margin-top: -12px; }
    .input-row .fa.fa-key { font-size: 23px; }
    .input-row input { display: block; width: 100%; height: 46px; line-height: 46px; padding-left: 70px; border: none; font-size: 18px; outline: none; }
    .input-row .sms-code-wrap { position: absolute; display: block; top: 13px; right: 0; width: 130px; height: 20px; line-height: 20px; border-left: 1px solid #ddd; text-align: center; }
    .input-row .sms-code-btn { position: absolute; left: 0; right: 0; text-decoration: underline; }
    .input-row .sms-code-status { position: absolute; left: 0; right: 0; }
    .login .fa-sign-in { position: absolute; top: 200px; left: 50%; margin-left: -22px; font-size: 44px; color: #666; text-shadow: 0 5px 5px rgba(0, 0, 0, .3); }
</style>

<script>
    module.exports = {
        data    : function () {
            return {
                user           : { // lean数据结构
                    mobilePhoneNumber: '',
                    smsCode          : ''
                },
                sms_code_status: '',

                is_login_phone_show: false,
                is_login_code_show : false,

                is_sms_btn_show   : true,
                is_sms_status_show: false
            }
        },
        attached: function () {
            var self = this;
            setTimeout(function () {
                self.is_login_phone_show = true;
                setTimeout(function () {
                    self.is_login_code_show = true;
                }, 100);
            }, 200);
        },
        methods : {
            // 数据交互
            requestSmsCode: function () {
                var self = this;
                self.sms_code_status = '发送中...';
                self.is_sms_btn_show = false;
                self.is_sms_status_show = true;
                AV.Cloud.requestSmsCode(self.user.mobilePhoneNumber).then(function () {
                    //发送成功
                    var timer = 60;
                    var interval = setInterval(function () {
                        if (timer > 0) {
                            self.sms_code_status = timer + 's 后重新获取';
                            timer--;
                        } else {
                            clearInterval(interval);
                            self.is_sms_btn_show = true;
                            self.is_sms_status_show = false;
                        }
                    }, 1000);
                }, function (err) {
                    //发送失败
                    alert('发送失败');
                });
            },
            doLogin       : function () {
                var self = this;
                var user = new AV.User();
                user.signUpOrlogInWithMobilePhone(self.user).then(function (user) {
                    //注册或者登录成功
                    alert('登陆成功');
                }, function (error) {
                    // 失败
                    console.log(error);
                });
            },
            // 页面交互
            hideLogin     : function () {
                this.$dispatch('hide-login');
            }
        }
    }
</script>