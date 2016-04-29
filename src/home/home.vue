<template>
    <div class="page-home">
        <restaurant v-for="restaurant in restaurants | orderBy 'rank' -1" :restaurant="restaurant"></restaurant>
    </div>
</template>

<script>
    module.exports = {
        route     : {
            data ({to, next}) {
                var self = this;
                var restaurants = [];
                if (AV.User.current()) {
                    var query = new AV.Query('Restaurant');
                    query.find().then(function (restaurants) {
                        var promises = [];
                        restaurants.map(function (restaurant) {
                            promises.push(self.queryLike(restaurant));
                        });
                        return AV.Promise.all(promises);
                    }).then(function (restaurants) {
                        next({
                            restaurants: restaurants
                        });
                    });
                } else {
                    var query = new AV.Query('Restaurant');
                    query.find().then(function (results) {
                        results.map(function (restaurant) {
                            var restaurant = restaurant.toJSON();
                            restaurant.like_level = 0;
                            restaurants.push(restaurant);
                        });
                        next({
                            restaurants: restaurants
                        });
                    }, function (error) {
                        console.log('Error: ' + error.code + ' ' + error.message);
                    });
                }
            }
        },
        data () {
            return {
                restaurants: []
            }
        },
        components: {
            'restaurant': require('./_components/restaurant.vue')
        },
        methods   : {
            queryLike: function (restaurant) {
                var Restaurant = new AV.Object.createWithoutData('Restaurant', restaurant.id);
                var sub_query = new AV.Query('User_likes_Restaurant');
                sub_query.equalTo('restaurant', Restaurant);
//                sub_query.equalTo('user', AV.User.current());
                return new AV.Promise(function (resolve) {
                    sub_query.find().then(function (likes) {
                        var rest = restaurant.toJSON();
                        rest.like_level = 0; // 没点赞的默认值
                        rest.like_user_count = 0; // 从0开始记
                        rest.like_total = 0; // 从0开始记
                        likes.map(function (like) {
                            var like_user = like.get('user');
                            var user_like_level = like.get('like_level');
                            if (!like_user) return;

                            // 当前用户在该饭店的喜欢数
                            if (like_user.id == AV.User.current().id) {
                                rest.like_level = parseInt(user_like_level);
                                rest.like_objectId = like.id;
                            }

                            // 该饭店的喜欢总人数
                            if (!!user_like_level && user_like_level != 0) {
                                rest.like_user_count++;
                            }

                            // 该饭店的总喜欢量(因为每人最多喜欢3下)
                            rest.like_total += user_like_level;
                        });

                        // 计算 污力指数
                        rest.rank = Math.pow(rest.like_user_count, 1.5) + rest.like_total;

                        console.log(rest);
                        resolve(rest);
                    });
                });
            }
        }
    }
</script>