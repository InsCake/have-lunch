<template>
    <div class="page-home">
        <restaurant v-for="restaurant in restaurants" :restaurant="restaurant"></restaurant>
    </div>
</template>

<script>
    module.exports = {
        route     : {
            data ({to, next}) {
                var restaurants = [];
                if (AV.User.current()) {
                    var query = new AV.Query('User_likes_Restaurant');
                    query.equalTo('user', AV.User.current());
                    query.include('restaurant');
                    query.find().then(function (results) {
                        results.map(function (like) {
                            var restaurant = like.get('restaurant').toJSON();
                            restaurant.like_level = like.get('like_level');
                            restaurant.like_objectId = like.id;
                            restaurants.push(restaurant);
                        });
                        next({
                            restaurants: restaurants
                        });
                    }, function (error) {
                        console.log('Error: ' + error.code + ' ' + error.message);
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
        }
    }
</script>