<template>
	<view>
		<view class="form">
			<u-form :model="form" ref="uForm" label-width="130rpx" label-align="right">
				<u-form-item label="邮箱"><u-input v-model="form.email" placeholder="请输入注册时的邮箱"/></u-form-item>
				<u-form-item label="新密码"><u-input v-model="form.password" type="password" placeholder="请输入密码"/></u-form-item>
				<u-form-item label="重复密码"><u-input v-model="form.passwordSecond" type="password" placeholder="请重复密码"/></u-form-item>
				<u-form-item label="验证码"><u-input v-model="form.code" type="number" placeholder="请输入验证码"/></u-form-item>
			</u-form>
			<u-button class="btn_login" size="default" type="warning" @click="getCode">获取验证码</u-button>
			<u-button class="btn_login" size="default" type="primary" @click="change">修改</u-button>
		</view>
		<u-toast ref="uToast" />
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['csrf', 'baseUrl']),
		},
		data() {
			return {
				form: {
					email: "",
					password: "",
					passwordSecond: "",
					code: ""
				},
				
			}
		},
		methods: {
			change() {
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
				if (this.form.code === "") {
					this.$refs.uToast.show({
						title: '请输入验证码',
						type: 'error',
					})
					return;
				}
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/user/changePassword',
					url: `${this.baseUrl}/api/v1/user/changePassword`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						email: this.form.email,
						password: this.form.password,
						code: this.form.code,
					},
					success: (res) => {
						if (res.data.code === 0) {
							this.$refs.uToast.show({
								title: '修改成功',
								type: 'success',
								url: '/pages/mine/mine',
								isTab: true,
							})
						} else {
							this.$refs.uToast.show({
								title: res.data.msg,
								type: 'error',
							})
						}
					},
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
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/email/changePasswordCode',
					url: `${this.baseUrl}/api/v1/email/changePasswordCode`,
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
		}
	}
</script>

<style>

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

</style>
