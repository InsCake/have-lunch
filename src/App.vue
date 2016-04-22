<template>
    <div>
        <router-view :class="{ 'blur': is_login_show }"></router-view>
        <login v-if="is_login_show" transition="fade"></login>
    </div>
</template>

<style>
    * { box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }
    body { font-size: 14px; }
    h1, h2, h3, h4, h5, h6, p { margin: 0; }
    .blur { filter: blur(5px); }
</style>

<script>
    module.exports = {
        data      : function () {
            return {
                is_login_show: false
            }
        },
        components: {
            'login': require('./_components/login.vue')
        },
        events    : {
            'show-login': function () {
                this.is_login_show = true;
            },
            'hide-login': function () {
                this.is_login_show = false;
            }
        }
    }
</script>
