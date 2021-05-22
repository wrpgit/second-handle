<template>
	<view>
		<view class="dataArea">
			<view v-if="orderList.length === 0" class="empty"> 空空如也~~</view>

			<view v-for="(item, index) in orderList" :key="index">
				<view class="line" style="border-bottom: 10rpx rgb(241, 243, 244) solid;"/>
				<view class="item" @click="orderDetail(item._id)">
					<u-image class="goodsImage" width="300rpx" height="230rpx" mode="aspectFit" :src="item.goodsInfo[0].images[0]"></u-image>
					<view class="goodsName">{{ item.goodsInfo[0].goodsName }}</view>
					<view class="description">{{ item.goodsInfo[0].description }}</view>
					<view class="num">×{{ item.num}}</view>
					<view class="price">{{ item.totalPrice }}￥</view>
					<view class="time">订单创建时间: {{ item.createTime}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['baseUrl']),
		},
		data() {
			return {
				page: '',
				orderList: [],
			}
		},
		onLoad(option) {
			this.page = option.page;
		},
		onShow() {
			uni.request({
				header: { 'Content-Type': 'application/x-www-form-urlencoded' },
				// url: 'https://wrpxcx.com/api/v1/order/orderList',
				url: `${this.baseUrl}/api/v1/order/orderList`,
				method: 'GET',
				data: {
					operation: this.page
				},
				success: (res) => {
					this.orderList = res.data.orders;
				},
			})
		},
		methods: {
			orderDetail(orderId) {
				uni.navigateTo({
					url: '/pages/goods/order?orderId=' + orderId, 
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
		}
	}
</script>

<style>
	.dataArea {
		width: 100%;
	}
	.item {
		position: relative;
		margin-bottom: 10rpx;
		width: 100%;
		height: 290rpx;
		/* background-color: #eee; */
		top: 30rpx;
	}
	.goodsImage {
		position: absolute;
		float:left;
		margin: 10rpx;
		height:230rpx;
		width: 300rpx;
		background-color: black;
	}
	.goodsName {
		position: absolute;
		top:20rpx;
		left: 350rpx;
		float: left;
		width: 330rpx;
		overflow:hidden;   /*超过2行添加省略号*/
		display:-webkit-box;
		-webkit-line-clamp:2;
		text-overflow:ellipsis;
		-webkit-box-orient:vertical;
		word-break:break-all;
	}

	.description {
		position: absolute;
		width: 330rpx;
		top: 120rpx;
		left: 350rpx;
		float: left;
		overflow:hidden;   /*超过2行添加省略号*/
		display:-webkit-box;
		-webkit-line-clamp:3;
		text-overflow:ellipsis;
		-webkit-box-orient:vertical;
		word-break:break-all;
		font-size: 25rpx;
		color: rgb(43, 33, 33);
	}
	.price {
		position: absolute;
		bottom: 15rpx;
		right: 10rpx;
		/* color: rgb(6, 127, 187); */
		color: red;
		font-size: 35rpx;
	}
	.time {
		position: absolute;
		bottom: 15rpx;
		right: 130rpx;
		color: #aaaaaa;
	}
	.num {
		position: absolute;
		bottom: 80rpx;
		right: 10rpx;
	}
	.line {
		position: relative;
		top: 10rpx;
	}

	.empty {
		position: absolute;
		text-align: center;
		top: 77rpx;
		left: 40rpx;
	}
</style>
