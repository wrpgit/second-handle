<template>
	<view>
		<view class="head">欢迎注册</view>
		<view class="form">
			<u-form :model="form" ref="uForm" label-width="130rpx" label-align="right">
				<u-form-item label="邮箱"><u-input v-model="form.email" placeholder="请输入邮箱"/></u-form-item>
				<u-form-item label="密码"><u-input v-model="form.password" type="password" placeholder="请输入密码"/></u-form-item>
				<u-form-item label="重复密码"><u-input v-model="form.passwordSecond" type="password" placeholder="请重复密码"/></u-form-item>
				<u-form-item label="昵称"><u-input v-model="form.nickName" type="text" placeholder="请输入昵称"/></u-form-item>
				<u-form-item label="所在学校">
					<u-input v-model="form.school" type="select" @click="schoolListShow = true" :select-open="schoolListShow"></u-input>
					<u-picker v-model="schoolListShow" mode="selector" :range="schoolList" @confirm="confirmSchool" :default-selector="[0]"></u-picker>
				</u-form-item>
				<u-form-item label="验证码"><u-input v-model="form.code" type="number" placeholder="请输入验证码"/></u-form-item>
			</u-form>
			<u-button class="btn_login" size="default" type="warning" @click="getCode">获取验证码</u-button>
			<u-button class="btn_login" size="default" type="primary" @click="signup">注册</u-button>
			<view class="btn_sign_up">已有账号?  <view class="back" @click="back">返回登陆</view></view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		computed: {
			...mapState(['csrf', 'schoolList', 'baseUrl']),
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
					email: "",
					password: "",
					passwordSecond: "",
					nickName: "",
					school: "",
					code: ""
				},
				schoolListShow: false,
				schoolNames: this.school,
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
		created() {
			this.form.school = this.schoolList[0];
		},
		methods: {
			...mapMutations(['initSocket']),
			back() {
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
			},
			signup() {
				if (this.form.email === "") {
					this.$refs.uToast.show({
						title: '邮箱不能为空',
						type: 'error',
					})
					return;
				}
				if (this.form.password.length < 6) {
					this.$refs.uToast.show({
						title: '密码不能小于6位',
						type: 'error',
					})
					return;
				}
				if (this.form.password !== this.form.passwordSecond) {
					this.$refs.uToast.show({
						title: '两次密码不一致',
						type: 'error',
					})
					return;
				}
				if (this.form.nickName === "") {
					this.$refs.uToast.show({
						title: '昵称不能为空',
						type: 'error',
					})
					return;
				}
				if (this.form.code === "") {
					this.$refs.uToast.show({
						title: '请输入验证码',
						type: 'error',
					})
					return;
				}
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/user/signup',
					url: `${this.baseUrl}/api/v1/user/signup`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						email: this.form.email,
						password: this.form.password,
						nickName: this.form.nickName,
						userSchool: this.form.school,
						code: this.form.code,
						avatarUrl: "https://picture.wrpxcx.com/moRenHead"
					},
					success: (res) => {
						if (res.data.code === 0) {
							this.initSocket();
							this.$refs.uToast.show({
								title: '注册成功',
								type: 'success',
								url: '/pages/mine/mine',
								isTab: true,
							})

							this.userInfo = res.data.user;
							uni.setStorage({
								key: 'userInfo',
								data: res.data.user,
							});
						} else if (res.data.code === 1) {
							this.$refs.uToast.show({
								title: '该邮箱已经注册',
								type: 'error',
							})
						} else if (res.data.code === 197) {
							this.$refs.uToast.show({
								title: '验证码错误',
								type: 'error',
							})
						} else if (res.data.code === 198) {
							this.$refs.uToast.show({
								title: '错误次数太多，请10分钟后重新获取验证码',
								type: 'error',
							})
						} else if (res.data.code === 199) {
							this.$refs.uToast.show({
								title: '验证码已失效，请重新获取验证码',
								type: 'error',
							})
						}
					},
					fail: (error) => {
						console.log(error);
					}
				});
			},
			getCode() {
				if (this.form.email === "") {
					this.$refs.uToast.show({
						title: '请先输入邮箱',
						type: 'error',
					})
					return;
				}
				//检验邮箱格式，发送请求
				//...
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/email/verificationCode',
					url: `${this.baseUrl}/api/v1/email/verificationCode`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						email: this.form.email
					},
					success: res=> {
						if (res.data.code === 200) {
							this.$refs.uToast.show({
								title: res.data.msg,
								type: 'success',
							})
						} else {
							this.$refs.uToast.show({
								title: res.data.msg,
								type: 'error',
							})
						}
					}
				})
			},
			confirmSchool(index) {
				this.form.school = this.schoolList[index[0]];
			}
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
	margin: 20rpx;
	top: 30rpx;
}

.btn_sign_up {
	position: relative;
	display: inline;
	top: 70rpx;
	left: 190rpx;
}
.back {
	text-decoration: underline;
	display: inline;
	cursor: pointer;
}
</style>
