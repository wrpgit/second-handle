<template>
	<view>
		<view class="header">
		</view>
		<u-swiper class="images" :list="goodsInfo.images" height="400" img-mode='aspectFit'></u-swiper>
		<view class="body">
			<view class="name">{{goodsInfo.goodsName}}</view>
			<u-line color="gray" />
			<view class="description"><span :style="{ color: '#aaaaaa'}">描述: </span> {{goodsInfo.description}}</view>
			<u-line color="gray" />
			<view class="price">{{goodsInfo.price}}￥</view>
			<u-line color="gray" />
			<view class="createTime">下单时间: {{orderInfo.createTime}}</view>
			<view class="buyerBox" v-if="userInfo.userId !== goodsInfo.userId">
				<view class="buyNum">购买数量: 
					<view class="numBtn">
						<view class="textBuyNum">×{{orderInfo.num}}</view>
					</view>
				</view>
				<view class="total">合计：<span :style="{ color: 'red', 'font-size': '50rpx'}">{{totalMoney}}￥</span></view>
			</view>
		</view>
		<view class="tail" v-if="userInfo.userId !== goodsInfo.userId">  <!-- 买家 -->
			<view class="item" @click="toMessage(goodsInfo.userId)">
				<u-icon class="itemIcon" name="chat" size="40"></u-icon>
				<view class="itemName">联系商家</view>
			</view>
			<view v-if="orderInfo.orderStatus === 1">
				<u-button class="firstBtn" type="warning" @click="receive">货已收到</u-button>
				<u-button class="secondBtn" type="error" @click="cancelOrder">取消订单</u-button>
			</view>
			<view v-else-if="orderInfo.orderStatus >= 2" class="finsh"> <view>订单已完成</view> </view>
		</view>
		<view class="tail" v-else> 																			<!-- 卖家 -->	
			<view class="item" @click="toMessage(orderInfo.buyUserId)">
				<u-icon class="itemIcon" name="chat" size="40"></u-icon>
				<view class="itemName">联系买家</view>
			</view>
			<view v-if="orderInfo.orderStatus === 1">
				<u-button class="firstBtn" type="warning" @click="arrive">货已送到</u-button>
			<!-- <u-button class="secondBtn" type="warning" @click="cancel">取消订单</u-button> -->
			</view>
			<view v-else-if="orderInfo.orderStatus >= 2" class="finsh"> <view>订单已完成</view> </view>
		</view>

		<u-toast ref="uToast" />
		<u-modal v-model="confirmBoxShow" :content="confirmContent" @confirm="confirm" @cancel="confirmBoxShow=false" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['userInfo', 'appSocket', 'csrf', 'baseUrl']),
		},
		data() {
			return {
				orderId: '',
				orderInfo: {},
				goodsInfo: {},
				totalMoney: 0,
				confirmBoxShow: false,
				confirmContent: '',
				fixedStatus: 0,
			};
		},
		onLoad: function(option) {
			this.orderId = option.orderId;
		},
		onShow() {
			// 获取订单信息
			uni.request({
				header: { 'Content-Type': 'application/x-www-form-urlencoded' },
				// url: 'https://wrpxcx.com/api/v1/order/getOrder',
				url: `${this.baseUrl}/api/v1/order/getOrder`,
				method: 'POST',
				data: {
					_csrf: this.csrf,
					orderId: this.orderId
				},
				success: (res) => {
					const { data } = res;
					if (data.code === 200) {
						this.orderInfo = data.order[0];
						this.goodsInfo = data.order[0].goodsInfo[0];
						this.totalMoney = this.goodsInfo.price * data.order[0].num;
					} else {
						console.log('没有找到该订单');
						// 返回 或者 错误页
						uni.navigateBack({
							delta: 1,
							animationType: 'pop-out',
							animationDuration: 200
						});
					}
				},
			})
		},
		methods: {
			toMessage(userId) {
        uni.navigateTo({
					url: '/pages/message/message?friendUserId=' + userId,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			confirm() {
				this.changeStatus(this.fixedStatus);
			},
			receive() {
				this.confirmBoxShow = true;
				this.confirmContent = '请在收到商品并完成交易后确认';
				this.fixedStatus = 2;
			},
			arrive() {
				this.confirmBoxShow = true;
				this.confirmContent = '请在送达商品并完成交易后确认';
				this.fixedStatus = 3;
			},
			cancelOrder() {
				this.confirmBoxShow = true;
				this.confirmContent = '点击确认取消订单';
				this.fixedStatus = 0;
			},
			changeStatus(status) {
				// 修改订单状态，0：已删除的订单， 1：新创建的订单，2：买家确认收货， 3：商家确实送货
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/order/changeStatus',
					url: `${this.baseUrl}/api/v1/order/changeStatus`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						orderId: this.orderId,
						status,
					},
					success: (res) => {
						if (res.data.code === 200) {
							if (status === 0) {
								// 返回上一界面
								uni.navigateBack({
									delta: 1,
									animationType: 'pop-out',
									animationDuration: 200
								});
							} else {
								// 刷新页面
								uni.redirectTo({
										url: `/pages/goods/order?orderId=${this.orderId}`,
								 });
							}
						}
					},
				})
			},
		}
	}
</script>

<style lang="scss">
.images {
	position: relative;
	// height: 400rpx;
	background-color: #eeeeee;
}

.body {
	position: relative;
	margin: 20rpx;
	.name {
		font-size: 30rpx;
		font-weight: 600;
		margin-bottom: 30rpx;
		margin-top: 20rpx;
	}
	.description {
		margin-top: 20rpx;
		margin-bottom: 30rpx;
	}
	.createTime {
		color: #aaaaaa;
		margin-top: 20rpx;
		margin-bottom: 30rpx;
	}
	.price {
		position: absolute;
		color: red;
		font-size: 45rpx;
		right: 20rpx;
	}
	.num {
		margin-top: 20rpx;
		margin-bottom: 30rpx;
	}

	.buyerBox {

		.numBtn {
			position: absolute;
			right: 0;
			float: left;
			display: inline;

			.textBuyNum {
				float: left;
				padding-left: 20rpx;
				padding-right: 20rpx;
			}
		}
		.total {
			position: relative;
			top: 70rpx;
			float: right;
		}
	}
}


.tail {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	
	.item {
		position: absolute;
		left: 100rpx;
		.itemIcon {
			position: relative;
			top: 10rpx;
			left: 30%;
		}
		.itemName {
			position: relative;
			top: 15rpx;
			text-align: center;
			font-size: 25rpx;
		}
	}
	.firstBtn {
		position: absolute;
		right: 20rpx;
		width: 200rpx;
	}
	.secondBtn {
		position: absolute;
		right: 280rpx;
		width: 200rpx;
	}

	.finsh {
		position: absolute;
		top: 30rpx;
		right: 100rpx;
	}
}

</style>
