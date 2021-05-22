<template>
	<view>
		<view class="header">
		</view>
		<u-swiper class="images" :list="goodsInfo.images" height="400" img-mode='aspectFit' ></u-swiper>
		<view class="body">
			<view class="name">{{goodsInfo.goodsName}}</view>
			<u-line color="gray" />
			<view class="description"><span :style="{ color: '#aaaaaa'}">描述: </span> {{goodsInfo.description}}</view>
			<u-line color="gray" />
			<view class="school"><span :style="{ color: '#aaaaaa'}">所在学校: </span> {{goodsInfo.schoolName}}</view>
			<u-line color="gray" />
			<view class="price">{{goodsInfo.price}}￥</view>
			<u-line color="gray" />
			<view class="num"><span :style="{ color: '#aaaaaa'}">库存：</span>{{goodsInfo.num}}</view>
			<!-- <view class="createTime">创建时间: {{goodsInfo.createTime}}</view> -->
			<view class="buyerBox" v-if="!userInfo || userInfo.userId !== goodsInfo.userId">
				<view class="buyNum">购买数量: 
					<view class="numBtn">
						<u-icon class="sub" name="minus" @click="sub" size="28"></u-icon>
						<view class="textBuyNum">{{buyNum}}</view>
						<u-icon class="add" name="plus" @click="add" size="28"></u-icon>
					</view>
				</view>
				<view class="total">合计：<span :style="{ color: 'red', 'font-size': '50rpx'}">{{totalMoney}}￥</span></view>
			</view>
		</view>
		<view class="approved" v-if="userInfo && userInfo.userId === goodsInfo.userId">
		<!-- 	// 如果是自己的商品，返回信息将会带上审核状态及原因 -->
			<view class="status" v-if="goodsInfo.status === 1" style="color: orange;">审核状态: 待审核</view>
			<view class="status" v-if="goodsInfo.status === 2" style="color: green;">审核状态: 审核通过，已上架</view>
			<view class="status" v-if="goodsInfo.status === 3" style="color: red;">审核状态: 审核未通过
				<view>
					原因: {{ goodsInfo.reason }}
				</view>
			</view>
		</view>
		<view class="tail" v-if="!userInfo || userInfo.userId !== goodsInfo.userId">
			<view class="item" @click="toMessage">
				<u-icon class="itemIcon" name="chat" size="40"></u-icon>
				<view class="itemName">联系商家</view>
			</view>
			<u-button class="btn" type="warning" @click="makeOrder">下单</u-button>
		</view>
		<view class="tail" v-else>
			<u-button class="del" type="error" @click="delGoods">删除商品</u-button>
			<u-button class="btn" type="warning" @click="modify">修改信息</u-button>
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
				goodsId: '',
				goodsInfo: {},
				buyNum: 1,
				totalMoney: 0,
				confirmBoxShow: false,
				confirmContent: '',
				opera: '', // 标识打开的是哪个确认框
			};
		},
		onLoad: function(option) {
			this.goodsId = option.goodsId;
		},
		onShow() {
			// 获取商品信息
			uni.request({
				header: { 'Content-Type': 'application/x-www-form-urlencoded' },
				// url: 'https://wrpxcx.com/api/v1/goods/goodsId',
				url: `${this.baseUrl}/api/v1/goods/goodsId`,
				method: 'GET',
				data: {
					goodsId: this.goodsId
				},
				success: (res) => {
					const { data } = res;
					if (data.code === 0) {
						this.goodsInfo = data.goods;
						this.totalMoney = data.goods.price;
						this.buyNum = 1;
					} else {
						console.log('没有找到该物品');
						// 返回 或者 错误页
						this.$refs.uToast.show({
							title: '没有找到该商品',	
							type: 'error',
						})
						setTimeout(() =>{
							uni.switchTab ({
								url: '/pages/home/home',
								animationType: 'pop-in',
								animationDuration: 200
							})
						}, 2000);
					}
				},
			})
		},
		methods: {
			toMessage() {
				if (!this.userInfo) {
					// 没有登陆,
					this.$refs.uToast.show({
						title: '请先前去‘我的’页面进行登陆',
						type: 'warning',
					})
					return;
				}
				const pages = getCurrentPages();
				const len = pages.length;
				let flag = 0;
				for (let i = 0; i < len; i++) {
					if (pages[i].route === 'pages/message/message') {
						flag = 1;
						uni.navigateBack({
							delta: len - i - 1,
							animationType: 'pop-out',
							animationDuration: 200
						});
					}
				}
				if (flag == 0) {
					uni.navigateTo({
						url: '/pages/message/message?friendUserId=' + this.goodsInfo.userId, 
						animationType: 'pop-in',
						animationDuration: 200
					})
				}
			},
			modify() {
        uni.navigateTo({
					url: '/pages/goods/modify?goodsId=' + this.goodsId, 
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			sub() {
				if (this.buyNum > 1) {
					this.buyNum -= 1;
					this.totalMoney -= this.goodsInfo.price;
				}
			},
			add() {
				if (this.buyNum < this.goodsInfo.num) {
					this.buyNum += 1;
					this.totalMoney += this.goodsInfo.price;
				}
			},
			makeOrder() {
				if (!this.userInfo) {
					// 没有登陆,
					this.$refs.uToast.show({
						title: '请先前去‘我的’页面进行登陆',
						type: 'warning',
					})
					return;
				}
				this.confirmContent = '下单之前可与商家协商交易的时间和方式';
				this.opera = '下单';
				this.confirmBoxShow = true;
			},
			delGoods() {
				// 删除商品
				this.confirmContent = '确定删除该商品吗';
				this.opera = '删除商品';
				this.confirmBoxShow = true;
			},
			confirm() {
				if (this.opera === '删除商品') {
					uni.request({
						header: { 'Content-Type': 'application/x-www-form-urlencoded' },
						// url: 'https://wrpxcx.com/api/v1/goods/delGoods',
						url: `${this.baseUrl}/api/v1/goods/delGoods`,
						method: 'GET',
						data: {
							goodsId: this.goodsId
						},
						success: () => {
							this.$refs.uToast.show({
								title: '删除成功',
								type: 'success',
							})
							uni.navigateBack({
								delta: 1,
								animationType: 'pop-out',
								animationDuration: 200
							});
						},
					})

				} else if (this.opera === '下单') {
					if (this.goodsInfo.num <= 0) {
						this.$refs.uToast.show({
							title: '库存不足，无法下单',
							type: 'warning',
						})
						return;
					}
					uni.request({
						header: { 'Content-Type': 'application/x-www-form-urlencoded' },
						// url: 'https://wrpxcx.com/api/v1/order/createOrder',
						url: `${this.baseUrl}/api/v1/order/createOrder`,
						method: 'POST',
						data: {
							_csrf: this.csrf,
							goodsId: this.goodsId,
							num: this.buyNum
						},
						success: (res) => {
							if (res.data.code === 200) {
								this.$refs.uToast.show({
									title: '下单成功，可以前往‘我的’中查看',
									type: 'success',
								})
								// 跳转至订单详情页面
								uni.navigateTo({
									url: '/pages/goods/order?orderId=' + res.data.order._id, 
									animationType: 'pop-in',
									animationDuration: 200
								})
							}
						},
						fail: res => {
							console.log(res);
							this.$refs.uToast.show({
								title: '下单失败',
								type: 'fail',
							})
						}
					})
				}
			}
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
	.school {
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

			.sub {
				background-color: #dddddd;
				padding: 10rpx;
				float: left;
			}
			.add {
				background-color: #eeeeee;
				padding: 10rpx;
				float: left;
			}
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

.approved {
	position: relative;
}
.status {
	margin-left: 30rpx;
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
	.btn {
		position: absolute;
		right: 20rpx;
		width: 200rpx;
	}
	.del {
		position: absolute;
		left: 200rpx;
		width: 200rpx;
	}
}

</style>
