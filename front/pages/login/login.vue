<template>
	<view>
		<view class="head">欢迎登陆</view>
		<view class="form">
			<u-form :model="form" ref="uForm">
				<u-form-item label="账号"><u-input v-model="form.userId" placeholder="请输入邮箱"/></u-form-item>
				<u-form-item label="密码"><u-input v-model="form.password" type="password" placeholder="请输入密码"/></u-form-item>
			</u-form>
			<u-button class="btn_login" size="default" type="primary" @click="login">登陆</u-button>
			<view class="btn_sign_up" @click='toSignUp'>还没账号? 点击注册</view>
			<view class="btn_forget_pass" @click='toChangePassword'>忘记密码</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
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
				form: {
					userId: "",
					password: "",
				}
			}
		},
		onLoad() {
			if (this.userInfo) {
				uni.switchTab ({
					url: '/pages/home/home',
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
		},
		methods: {
			...mapMutations(['initSocket']),
			login() {
				if (this.form.userId === "") {
					this.$refs.uToast.show({
						title: '请输入用户名',
						type: 'error',
					})
					return;
				}
				if (this.form.password === "") {
					this.$refs.uToast.show({
						title: '请输入密码',
						type: 'error',
					})
					return;
				}
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/user/login',
					url: `${this.baseUrl}/api/v1/user/login`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						userId: this.form.userId,
						password: this.form.password
					},
					success: (res) => {
						if (res.data.code === 0) {
							// 存入vuex 中，再存入缓存，刷新页面后，先从缓存中放到vuex中
							this.userInfo = res.data.user;
							this.initSocket();
							uni.setStorage({
								key: 'userInfo',
								data: res.data.user,
							});
							this.$refs.uToast.show({
								title: '登陆成功',
								type: 'success',
								url: '/pages/mine/mine',
								isTab: true
							})
						} else {
							this.$refs.uToast.show({
								title: '账户或密码错误',
								type: 'error	',
							})
						}
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
			toSignUp() {
        uni.navigateTo({
					url: '/pages/login/signUp', 
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
		}
	}
</script>

<style>
.head {
	position: relative;
	top: 30rpx;
	left: 110rpx;
	font-size: 50rpx;
	font-weight: 500;
}
.form {
	position: relative;
	top: 30rpx;
	margin-left: 20rpx;
	margin-right: 20rpx;
}
.btn_login {
	position: relative;
	top: 30rpx;
}

.btn_sign_up {
	position: relative;
	top: 70rpx;
	text-align: center;
	color: blue;
	text-decoration: underline;
}

.btn_forget_pass {
	position: relative;
	top: 20rpx;
	float: right;
	color: blue;
	text-decoration: underline;
}

</style>
