<template>
    <section class="restaurant pure-g">
        <div class="pure-u-3-4">
            <div class="rest-title">
                <h2 class="rest-name">{{ restaurant.name }}</h2>
                <label class="rest-average-spend"><em>&yen;{{ restaurant.average_spend }}</em> /人</label>
            </div>
            <p class="rest-address">{{ restaurant.address }}</p>
        </div>
        <div class="rest-aside pure-u-1-4">
            <em class="rest-rank">{{ rank.toFixed(1) }}</em>
            <span class="rest-like-btn" :class="'like-' + restaurant.like_level" @click="toggleLike()">
                <i class="fa fa-heart-o"></i>
                <i class="fa fa-heart"></i>
            </span>
        </div>
    </section>
</template>

<style scoped>
    .restaurant { margin-bottom: 1px; padding: 18px 15px; box-shadow: 0 4px 10px -6px rgba(0, 0, 0, .5); background-color: #fff; }
    .restaurant .rest-name { display: inline-block; font-size: 24px; font-weight: lighter; }
    .restaurant .rest-average-spend { margin-left: 5px; padding: 4px 5px 1px; font-size: 12px; color: #666; vertical-align: -1px; background-color: #eee; }
    .restaurant .rest-average-spend em { font-size: 16px; font-style: normal; vertical-align: -1px; }
    .restaurant .rest-address { margin-top: 15px; color: #999; font-size: 12px; }
    .restaurant .rest-aside { position: relative; text-align: right; color: #999; font-size: 18px; }
    .restaurant .rest-aside .rest-rank { margin-right: 3px; font-style: normal; vertical-align: 5px; }
    .restaurant .rest-like-btn { position: relative; display: inline-block; width: 26px; height: 26px; color: #ccc; }
    .restaurant .rest-like-btn .fa { position: absolute; display: block; bottom: 0; right: 0; font-size: 26px; width: 100%; height: 100%; overflow: hidden; transition: all .2s; }
    .restaurant .rest-like-btn .fa-heart:before { position: absolute; display: block; bottom: 0; }
    /*状态*/
    .restaurant .rest-like-btn .fa-heart { height: 0; }
    .restaurant .rest-like-btn.like-0 .fa-heart { height: 0; }
    .restaurant .rest-like-btn.like-1 { color: #faa; }
    .restaurant .rest-like-btn.like-1 .fa-heart { height: 42%; }
    .restaurant .rest-like-btn.like-2 { color: #f88; }
    .restaurant .rest-like-btn.like-2 .fa-heart { height: 62%; }
    .restaurant .rest-like-btn.like-3 { color: #f66; }
    .restaurant .rest-like-btn.like-3 .fa-heart { height: 100%; }
</style>

<script>
    module.exports = {
        props   : ['restaurant'],
        computed: {
            rank: function () {
                var self = this;
                return Math.pow(self.restaurant.like_user_count, 1.5) + self.restaurant.like_total;
            }
        },
        methods : {
            toggleLike: function () {
                var self = this;
                if (!AV.User.current()) {
                    self.$dispatch('show-login');
                } else {
                    if (self.restaurant.like_level < 3) {
                        if (self.restaurant.like_level == 0) {
                            self.restaurant.like_user_count++;
                        }
                        self.restaurant.like_level++;
                        self.restaurant.like_total++;
                    } else {
                        self.restaurant.like_level = 0;
                        self.restaurant.like_total -= 3;
                        self.restaurant.like_user_count--;
                    }

                    if (!self.restaurant.like_objectId) {
                        // 插入
                        self.addLike(self.restaurant.objectId);
                    } else {
                        // 更新
                        self.saveLike(self.restaurant.like_objectId, self.restaurant.like_level);
                    }
                }
            },
            saveLike  : function (like_objectId, like_level) {
                var self = this;
                var like = AV.Object.createWithoutData('User_likes_Restaurant', like_objectId);
                like.set('like_level', like_level);
                like.save().then(function () {
                    // 保存成功
                    console.log('保存成功');
                }, function (error) {
                    // 失败
                    alert('失败');
                });
            },
            addLike   : function (restaurant_objectId) {
                var self = this;
                var like = AV.Object.new('User_likes_Restaurant');
                like.set('user', AV.User.current());
                like.set('restaurant', AV.Object.createWithoutData('Restaurant', restaurant_objectId));
                like.set('like_level', 1);
                like.save().then(function (like) {
                    self.restaurant.like_objectId = like.id;
                }, function (err) {
                    alert('失败');
                });
            }
        }
    };
</script>