<template>
	<view>
		<view class="uploadImage">
			<!-- <u-upload ref="uUpload" :action="uploadUrl"  max-count="3" :file-list="images" :form-data="qiniuDataFrom" :auto-upload="false"></u-upload> -->
		<u-swiper class="images" :list="goodsInfo.images" height="400"></u-swiper>
		</view>
		<view class="form">
			<u-form ref="uForm" label-width="130rpx" >
				<u-form-item label="名称"><u-input v-model="goodsInfo.goodsName" placeholder="请输入物品的名字"/></u-form-item>
				<u-form-item label="分类">
					<u-input v-model="goodsInfo.typeName" type="select" @click="chooseNavbarShow= true" :select-open="chooseNavbarShow" />
					<u-picker v-model="chooseNavbarShow" mode="selector" :range="navbar" @confirm="chooseNavbar" ></u-picker>
				</u-form-item>
				<u-form-item label="描述"><u-input v-model="goodsInfo.description" /></u-form-item>
				<u-form-item label="所在学校">
					<u-input v-model="goodsInfo.schoolName" type="select" @click="chooseSchoolShow=true" :select-open="chooseSchoolShow" />
					<u-picker v-model="chooseSchoolShow" mode="selector" :range="schoolList" @confirm="chooseSchool" ></u-picker>
				</u-form-item>
				<u-form-item label="数量"><u-input v-model="goodsInfo.num" type="number" placeholder="请输入该商品的数量"></u-input></u-form-item>
				<u-form-item label="价格"><u-input v-model="goodsInfo.price" type="number" placeholder="请输入商品的价格"></u-input></u-form-item>
			</u-form>
		</view>
		<u-button @click="submit" type="primary">确定修改</u-button>
		<u-modal v-model="confirmBoxShow" content="修改后商品将需要重新进行审核" @confirm="confirm" @cancel="confirmBoxShow=false" :show-cancel-button="true"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState(['csrf', 'navbar', 'schoolList', 'uploadToken', 'baseUrl']),
	},
	data() {
		return {
			goodsId: '',
			uploadUrl: '',
			goodsInfo: {},
			images: [],
			chooseNavbarShow: false,
			chooseSchoolShow: false,
			qiniuDataFrom: { 
				filseName: 'test_new',
			},
			confirmBoxShow: false,
		}
	},
	created() {
		this.qiniuDataFrom.upload_token = this.uploadToken;
	},
	onLoad(option) {
		this.goodsId = option.goodsId;
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
					this.images = data.goods.images;
				} else {
					console.log('没有找到该物品');
					// 返回 或者 错误页
				}
			},
		})

	},
	methods: {
		submit() {
			this.confirmBoxShow = true;
		},
		async confirm() {
			if (this.goodsInfo.goodsName === "") {
				this.$refs.uToast.show({
					title: '请输入商品名称',
					type: 'error',
				})
				return;
			}
			if (this.goodsInfo.typeName === "") {
				this.$refs.uToast.show({
					title: '请选择商品商品的类别',
					type: 'error',
				})
				return;
			}
			if (this.goodsInfo.description === "") {
				this.$refs.uToast.show({
					title: '请输入商品商品的描述',
					type: 'error',
				})
				return;
			}
			if (this.goodsInfo.num === "") {
				this.$refs.uToast.show({
					title: '请输入商品的数量',
					type: 'error',
				})
				return;
			}
			if (this.goodsInfo.price === "") {
				this.$refs.uToast.show({
					title: '请输入商品的价格',
					type: 'error',
				})
				return;
			}
			uni.request({
				header: { 'Content-Type': 'application/x-www-form-urlencoded' },
				// url: 'https://wrpxcx.com/api/v1/goods/modify',
				url: `${this.baseUrl}/api/v1/goods/modify`,
				method: 'POST',
				data: {
					_csrf: this.csrf,
					...this.goodsInfo,
					// _id: this.goodsInfo._id,
					// goodsName: this.goodsInfo.goodsName,
					// typeName: this.goodsInfo.typeName,
					// schooName: this.goodsInfo.schoolName,
					// description: this.goodsInfo.description,
					// num: this.goodsInfo.num,
					// price: this.goodsInfo.price
				},
				success: (res) => {
					if (res.data.code === 0) {
						this.$refs.uToast.show({
							title: '修改成功',
							type: 'success',
						})
						uni.navigateBack({
							delta: 1,
							animationType: 'pop-out',
							animationDuration: 200
						});
					} else {
						this.$refs.uToast.show({
							title: `修改失败: ${res.data.msg}`,
							type: 'success',
						})
					}
				},
				fail: res => {
					console.log(res);
					this.$refs.uToast.show({
						title: '修改失败',
						type: 'fail',
					})
				}
			})
		},
		chooseNavbar(index) {
			this.goodsInfo.typeName = this.navbar[index[0]];
		},
		chooseSchool(index) {
			this.goodsInfo.schoolName = this.schoolList[index[0]];
		}
	}
}
</script>

<style>
.form {
	margin-left: 20rpx;
	margin-right: 20rpx;
}

</style>
