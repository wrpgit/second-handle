<template>
	<view>
		<u-input class="input" v-model="content" type="textarea" :border="true" :height="height" :auto-height="true" placeholder="发现bug或者好的建议都可已反馈"/>
		<view class="group">qq反馈群：243311607</view>
		<u-button class="btn" type="primary" @click="reback" size="medium">提交</u-button>
		<u-toast ref="uToast" />
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		computed: {
			...mapState(['csrf', 'baseUrl']),
		},
		data() {
			return {
				content: "",
				height: 100,
			}
		},
		methods: {
			reback() {
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/reback/reback',
					url: `${this.baseUrl}/api/v1/reback/reback`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						context: this.content,
					},
					success: (res) => {
						this.content = "";
						this.$refs.uToast.show({
							title: '提交成功',
							type: 'success',
						})
					}
				})
			}
		}
	}
</script>

<style>
.input {
	margin: 30rpx;
}
.btn {
	position: relative;
	float: right;
	right: 40rpx;
}
.group {
	color: gray;
	margin-bottom: 40rpx;
	margin-left: 30rpx;
}

</style>
