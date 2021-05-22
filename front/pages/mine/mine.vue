<template>
	<view class="all">
		<view class="header">
			<u-avatar class="avatar" :src="src" @click='toLogin'></u-avatar>
			<view class="nickname">{{ nickName }}</view>
		</view>
		<view class="wrap">
			<view>作为购买者:</view>
			<!-- <u-row gutter="20" justify="between"> -->
			<u-row gutter="20">
				<u-col span="4">
					<view class="demo-layout" @click="toOrderList('待收货')">
						<view v-if="num.daiShouHuo && num.daiShouHuo != 0" class="num">{{num.daiShouHuo}}</view>
						<u-icon class="itemIcon" name="car" size="40"></u-icon>
						<view class="itemName">待收货</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout" @click="toOrderList('我买到的')">
						<view  v-if="num.maiDaoDe && num.maiDaoDe != 0" class="num">{{num.maiDaoDe}}</view>
						<u-icon class="itemIcon" name="shopping-cart" size="40"></u-icon>
						<view class="itemName">我买到的</view>
					</view>
				</u-col>
				<!-- <u-col span="3">
					<view class="demo-layout">
						<u-icon class="itemIcon" name="heart" size="40"></u-icon>
						<view class="itemName">我的收藏</view>
					</view>
				</u-col> -->
			</u-row>
			<view>作为发布者:</view>
			<u-row gutter="20" >
				<u-col span="4">
					<view class="demo-layout" @click="toShoper">
						<u-icon class="itemIcon" name="order" size="40"></u-icon>
						<view class="itemName">我发布的</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout" @click="toOrderList('待送货')">
						<view  v-if="num.daiSongHuo && num.daiSongHuo != 0" class="num">{{num.daiSongHuo}}</view>
						<u-icon class="itemIcon" name="car-fill" size="40"></u-icon>
						<view class="itemName">待送货</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout" @click="toOrderList('我卖出的')">
						<view v-if="num.maiChuDe && num.maiChuDe != 0" class="num">{{num.maiChuDe}}</view>
						<u-icon class="itemIcon" name="list" size="40"></u-icon>
						<view class="itemName">我卖出的</view>
					</view>
				</u-col>
			</u-row>
			<view>其它:</view>
			<u-row gutter="20" >
				<u-col span="4">
					<view class="demo-layout" @click="toSetting">
						<u-icon class="itemIcon" name="setting" size="40"></u-icon>
						<view class="itemName">设置</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout" @click="toReback">
						<u-icon class="itemIcon" name="more-circle" size="40"></u-icon>
						<view class="itemName">反馈</view>
					</view>
				</u-col>
				<!-- <u-col span="4">
					<view class="demo-layout" @click="toReward">
						<u-icon class="itemIcon" name="heart" size="40"></u-icon>
						<view class="itemName">鼓励一下</view>
					</view>
				</u-col> -->
				<u-col span="4"  v-if="userInfo && userInfo.isAdmin === true">
					<view class="demo-layout" @click="toReview">
						<u-icon class="itemIcon" name="heart" size="40"></u-icon>
						<view class="itemName">商品审核</view>
					</view>
				</u-col>
			</u-row>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>

	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['userInfo', 'baseUrl']),
		},
		data() {
			return {
				src: 'https://picture.wrpxcx.com/uni-app/unLogin',
				nickName: '点击头像登陆',
				num: {},
			}
		},
		onShow() {
			if (this.userInfo) {
				this.src = this.userInfo.avatarUrl || 'https://picture.wrpxcx.com/uni-app/unLogin',
				this.nickName = this.userInfo.nickName || '点击头像登陆';
			} else {
				this.src = 'https://picture.wrpxcx.com/uni-app/unLogin',
				this.nickName = '点击头像登陆';
			}
			if (this.userInfo) {
				// 请求数量
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/order/getOrder',
					url: `${this.baseUrl}/api/v1/order/getOrderNum`,
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							this.num = res.data.data;
						}
					},
				})
			} else {
				this.num = {};
			}
		},
		methods: {
			toLogin() {
				if (!this.userInfo) {
					uni.navigateTo({
						url: '/pages/login/login', 
						animationType: 'pop-in',
						animationDuration: 200
					})
				}
			},
			toOrderList(page) {
				if (!this.userInfo) {
					this.$refs.uToast.show({
						title: '请先登陆',
						type: 'warning',
					})
					return;
				}
        uni.navigateTo({
					url: '/pages/goods/orderList?page=' + page, 
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toShoper() {
				if (!this.userInfo) {
					this.$refs.uToast.show({
						title: '请先登陆',
						type: 'warning',
					})
					return;
				}
        uni.navigateTo({
					url: '/pages/mine/myPublish?userId=' + this.userInfo.userId, 
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toSetting() {
				if (!this.userInfo) {
					this.$refs.uToast.show({
						title: '请先登陆',
						type: 'warning',
					})
					return;
				}
        uni.navigateTo({
					url: '/pages/mine/setting',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toReback() {
        uni.navigateTo({
					url: '/pages/mine/reback',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toReward() {
        uni.navigateTo({
					url: '/pages/mine/reward',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toReview() {
			  uni.navigateTo({
					url: '/pages/mine/reviewList',
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
		}
	}
</script>

<style lang='scss'>
.all {
	background-color: rgb(243, 243, 243);
	height: 1000rpx;
}

.header {
	background-color: pink;
	height: 200rpx;

	.avatar {
		position: absolute;
		top: 30rpx;
		left: 30rpx;
	}
	.nickname {
		position: absolute;
		top: 67rpx;
		left: 144rpx;
		font-size: 40rpx;
		font-weight: 800;
	}
}
.wrap {
		padding: 24rpx;
		background-color: white;
		margin: 30rpx;
		border-radius: 30rpx;

	}
	.u-row {
		margin: 40rpx 0;
	}
	.demo-layout {
		height: 100rpx;
		border-radius: 8rpx;
		// background-color: #d3dce6;
	}

	.itemIcon {
		position: relative;
		top: 10rpx;
		left: 39%;
	}
	.itemName {
		position: relative;
		top: 15rpx;
		text-align: center;
		font-size: 25rpx;
	}
	.num {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background-color: gray;
		text-align: center;
		position: relative;
		top: 0rpx;
		right: 10rpx;
		float: right;
	}

</style>
