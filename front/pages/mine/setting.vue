<template>
	<view class="box">
		<view class="item" @click="toChangePassword">
			<u-icon name="setting-fill" class="icon"></u-icon>
			<view class="name">修改密码</view>
		</view>
		<u-line color="gray" />
		<view class="item" @click="toChangeInfo">
			<u-icon name="setting-fill" class="icon"></u-icon>
			<view class="name">修改个人信息</view>
		</view>
		<u-line color="gray" />
		<view class="item">
			<u-icon name="email" class="icon"></u-icon>
			<view class="name">是否接收邮件消息</view>
			<u-switch class="switch" v-model="isEmailRemind" @change="change"></u-switch>
		</view>
		<u-line color="gray" />
		<view class="item">
			<u-icon name="email" class="icon"></u-icon>
			<view class="name">有人下单邮件提醒</view>
			<u-switch class="switch" v-model="isMakeOrderRemind" @change="changeMakeOrder"></u-switch>
		</view>
		<u-line color="gray" />
		<view class="item" @click="loginoutBoxShow=true">
			<u-icon name="close" class="icon"></u-icon>
			<view class="name">退出登陆</view>
		</view>
		<u-line color="gray" />
		<u-modal v-model="confirmBoxShow" :content="confirmContent" @confirm="confirm" @cancel="cancel" :show-cancel-button="true"></u-modal>
		<u-modal v-model="loginoutBoxShow" content="是否退出登陆" @confirm="confirmLoginout" @cancel="loginoutBoxShow=false" :show-cancel-button="true"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['csrf', 'baseUrl']),
			userInfo: {
				get() {
					return this.$store.state.userInfo;
				},
				set(userInfo) {
					this.$store.state.userInfo = userInfo;
				}
			}
		},
		data() {
			return {
				isEmailRemind: true,
				isMakeOrderRemind: true,
				confirmBoxShow: false,
				confirmContent: "关闭后，在您下线后, 如果有人给您发消息，将不会邮件的提醒",
				loginoutBoxShow: false,
				operation: '',
			}
		},
		onShow() {
			this.isEmailRemind = this.userInfo.isEmailRemind;
			this.isMakeOrderRemind = this.userInfo.isMakeOrderRemind;
		},
		methods: {
			change() {
				if (this.isEmailRemind === false) {
					this.confirmContent = "关闭后，在您下线后, 如果有人给您发消息，将不会邮件的提醒";
					this.operation = 'changeSubscribe';
					this.confirmBoxShow = true;
				} else {
					this.changeStatus(this.isEmailRemind);
				}
			},
			changeMakeOrder() {
				if (this.isMakeOrderRemind === false) {
					this.confirmContent = "关闭后，有人下单时将不会收到邮件通知";
					this.operation = 'changeMakeOrderRemind';
					this.confirmBoxShow = true;
				} else {
					this.changeStatus(this.isMakeOrderRemind);
				}
			},
			confirm() {
				// 修改状态为false
				if (this.operation === 'changeSubscribe') {
					this.changeStatus(this.isEmailRemind);
				} else if (this.operation === 'changeMakeOrderRemind') {
					this.changeStatus(this.isMakeOrderRemind);
				}
			},
			cancel() {
				if (this.operation === 'changeSubscribe') {
					this.isEmailRemind = true;
				} else if (this.operation === 'changeMakeOrderRemind') {
					this.isMakeOrderRemind = true;
				}
				
				this.confirmBoxShow = false;
			},
			changeStatus(status) {
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/email/changeSubscribe',
					url: `${this.baseUrl}/api/v1/email/${this.operation}`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						status,
					},
					success: res => {
						this.userInfo.isEmailRemind = this.isEmailRemind;
						this.userInfo.isMakeOrderRemind = this.isMakeOrderRemind;
						uni.setStorage({
							key: 'userInfo',
							data: this.userInfo
						})
						this.$refs.uToast.show({
							title: '修改成功',
							type: 'success',
						})
					}
				})
			},
			toChangePassword() {
				uni.navigateTo({
					url: '/pages/mine/changePassword',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toChangeInfo() {
				uni.navigateTo({
					url: '/pages/mine/changeUserInfo',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			confirmLoginout() {
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/user/loginout',
					url: `${this.baseUrl}/api/v1/user/loginout`,
					method: 'GET',
					success: res => {
						uni.removeStorage({
							key: 'userInfo',
						})
						this.userInfo = null;
						this.$refs.uToast.show({
							title: '退出成功',
							type: 'success',
							url: '/pages/mine/mine',
							isTab: true,
						})
					}
				})
			},
		}
	}
</script>

<style lang='scss'>
.item {
	position: relative;
	margin: 30rpx;
	width: 100%;

	.icon {
		position: relative;
		left: 10rpx;
		float: left;
		top: 5rpx;
	}
	.name {
		position: relative;
		left: 30rpx;
	}

	.switch {
		position: absolute;
		top: -10rpx;
		right: 70rpx;
	}
}

</style>
