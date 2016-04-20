<template>
    <div class="page-home">
        <section class="restaurant-item pure-g" v-for="restaurant in restaurants">
            <div class="pure-u-3-4">
                <div class="rest-title">
                    <h2 class="rest-name">{{ restaurant.name }}</h2>
                    <label class="rest-average-spend"><em>&yen;{{ restaurant.average_spend }}</em> /人</label>
                </div>
                <p class="rest-address">{{ restaurant.address }}</p>
            </div>
            <div class="rest-aside pure-u-1-4">
                <em class="rest-rank">12.9</em>
                <span class="rest-like-btn like-1">
                    <i class="fa fa-heart-o"></i>
                    <i class="fa fa-heart"></i>
                </span>
            </div>
        </section>
    </div>
</template>

<style scoped>
    .restaurant-item { padding : 18px 15px; box-shadow : 0 2px 4px -2px rgba(0, 0, 0, .4); }
    .restaurant-item .rest-name { display : inline-block; font-size : 24px; font-weight : lighter; }
    .restaurant-item .rest-average-spend { margin-left : 5px; padding : 4px 5px 1px; font-size : 12px; color : #666; vertical-align : -1px; background-color : #eee; }
    .restaurant-item .rest-average-spend em { font-size : 16px; font-style : normal; vertical-align : -1px; }
    .restaurant-item .rest-address { margin-top : 15px; color : #999; font-size : 12px; }
    .restaurant-item .rest-aside { position : relative; text-align : right; color : #999; font-size : 18px; }
    .restaurant-item .rest-aside .rest-rank { margin-right: 3px; font-style : normal; vertical-align : 5px; }
    .restaurant-item .rest-like-btn { position : relative; display : inline-block; width : 26px; height : 26px; }
    .restaurant-item .rest-like-btn .fa { position : absolute; display : block; bottom : 0; right : 0; font-size : 26px; width : 100%; height : 100%; overflow : hidden; transition: all .2s; }
    .restaurant-item .rest-like-btn .fa-heart:before { position : absolute; display : block; bottom : 0; }
    /*状态*/
    .restaurant-item .rest-like-btn.like-1 .fa-heart { height : 50%; }
    .restaurant-item .rest-like-btn.like-2 .fa-heart { height : 70%; }
    .restaurant-item .rest-like-btn.like-3 .fa-heart { height : 100%; }
</style>

<script>
    module.exports = {
        route: {
            data ({to, next}) {
                var query = new AV.Query('Restaurant');
                query.find().then(function (results) {
                    var restaurants = [];
                    results.map(function (restaurant) {
                        restaurants.push(restaurant.toJSON());
                    });
                    next({
                        restaurants: restaurants
                    });
                }, function (error) {
                    console.log('Error: ' + error.code + ' ' + error.message);
                });
            }
        },
        data () {
            return {
                restaurants: []
            }
        }
    }
</script>