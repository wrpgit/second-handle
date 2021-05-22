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
			<view class="type"><span :style="{ color: '#aaaaaa'}">类别: </span> {{goodsInfo.typeName}}</view>
			<u-line color="gray" />
			<view class="school"><span :style="{ color: '#aaaaaa'}">所在学校: </span> {{goodsInfo.schoolName}}</view>
			<u-line color="gray" />
			<view class="price">{{goodsInfo.price}}￥</view>
			<u-line color="gray" />
			<view class="num"><span :style="{ color: '#aaaaaa'}">库存：</span>{{goodsInfo.num}}</view>
			<view class="createTime">创建时间: {{goodsInfo.createTime}}</view>
			<u-input class="reason" v-model="reason" type="textarea" :border="true" :height="height" :auto-height="true" placeholder="请说明原因, 可选,如果为不通过审核,则必须填此项"/>
			<u-button class="btn" type="success" @click="approved(true)" size="medium">通过审核</u-button>
			<u-button class="btn" type="error" @click="approved(false)" size="medium">拒绝上架</u-button>
		</view>
		<u-toast ref="uToast" />
		
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
				reason: '',
				height: 100
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
								url: '/pages/mine/reviewList',
								animationType: 'pop-in',
								animationDuration: 200
							})
						}, 2000);
					}
				},
			})
		},
		methods: {
			approved(isApproved) {
				if (isApproved === false) {
					if (this.reason === '') {
						this.$refs.uToast.show({
							title: '拒绝审核时原因不能为空',
							type: 'warning',
						})
						return;
					}
				}
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					url: `${this.baseUrl}/api/v1/goods/goodsReview`,
					method: 'GET',
					data: {
						goodsId: this.goodsId,
						reason: this.reason,
						status: isApproved ? 2 : 3,  // 2 为通过审核，3为不通过审核
					},
					success: (res) => {
						if (res.data.code === 0) {
							this.$refs.uToast.show({
								title: '操作成功',
								type: 'success'
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							},1000)
						}
					},
					fail: (res) => {
						this.$refs.uToast.show({
							title: '操作失败，请稍后再试',
							type: 'error'
						})
					}
				})
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
	.type {
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
	.reason {
		margin: 30rpx;
	}
}

</style>
