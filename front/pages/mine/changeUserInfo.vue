<template>
	<view>
		<view class="form">
			<u-form :model="form" ref="uForm" label-width="130rpx" label-align="right">
				<u-form-item label="新昵称"><u-input v-model="form.nickName" type="text" :placeholder="this.userInfo.nickName"/></u-form-item>
				<u-form-item label="所在学校">
					<u-input v-model="form.school" type="select" @click="schoolListShow = true" :select-open="schoolListShow" :placeholder="this.userInfo.userSchool"></u-input>
					<u-picker v-model="schoolListShow" mode="selector" :range="schoolList" @confirm="confirmSchool" ></u-picker>
				</u-form-item>
			</u-form>
			<u-button class="btn_login" size="default" type="primary" @click="change">修改</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>

</template>

<script>
	import { mapState } from 'vuex';
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
					nickName: "",
					school: "",
				},
				schoolListShow: false,
				schoolNames: this.school,
			}
		},
		onShow() {
			this.nickName = this.userInfo.nickName;
		},
		created() {
			this.form.school = this.userInfo.userSchool;
		},
		methods: {
			confirmSchool(index) {
				this.form.school = this.schoolList[index[0]];
			},
			change() {
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/user/changeInfo',
					url: `${this.baseUrl}/api/v1/user/changeInfo`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						nickName: this.form.nickName,
						userSchool: this.form.school
					},
					success: (res) => {
						if (res.data.code === 0) {
							if (this.form.nickName !== "") {
								this.userInfo.nickName = this.form.nickName;
							}
							this.userInfo.userSchool = this.form.school;
							uni.setStorage({
								key: 'userInfo',
								data: this.userInfo
							})
							this.$refs.uToast.show({
								title: '修改成功',
								type: 'success',
								url: '/pages/mine/mine',
								isTab: true,
							})
						};
					}
				});
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
