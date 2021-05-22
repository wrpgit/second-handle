<template>
	<view>
		<view class="uploadImage">
			<u-upload ref="uUpload" :action="uploadUrl"  max-count="3" :file-list="images" :form-data="qiniuDataFrom" :auto-upload="false"></u-upload>
		</view>
		<view class="form">
			<u-form :model="form" ref="uForm" label-width="130rpx">
				<u-form-item label="名称"><u-input v-model="form.goodsName" placeholder="请输入物品的名字"/></u-form-item>
				<u-form-item label="分类">
					<u-input v-model="form.type" type="select" @click="chooseNavbarShow= true" :select-open="chooseNavbarShow" placeholder="请选择物品的分类"/>
					<u-picker v-model="chooseNavbarShow" mode="selector" :range="navbar" @confirm="chooseNavbar" :default-selector="[0]"></u-picker>
				</u-form-item>
				<u-form-item label="描述"><u-input v-model="form.description" /></u-form-item>
				<u-form-item label="所在学校">
					<u-input v-model="form.schoolName" type="select" @click="chooseSchoolShow=true" :select-open="chooseSchoolShow" />
					<u-picker v-model="chooseSchoolShow" mode="selector" :range="schoolList" @confirm="chooseSchool" ></u-picker>
				</u-form-item>
				<u-form-item label="数量"><u-input v-model="form.num" type="number" placeholder="请输入该商品的数量"></u-input></u-form-item>
				<u-form-item label="价格"><u-input v-model="form.price" type="number" placeholder="请输入商品的价格"></u-input></u-form-item>
			</u-form>
		</view>
		<u-button class="publish" @click="submit" type="primary">发布</u-button>
		<u-toast ref="uToast" />
		<canvas canvas-id="canvas1" class="canvas"/>
		<canvas canvas-id="canvas2" class="canvas"/>
		<canvas canvas-id="canvas3" class="canvas"/>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
	computed: {
		...mapState(['csrf', 'navbar', 'schoolList','uploadToken', 'userInfo', 'baseUrl']),
	},
	created(){
		this.form.type = this.navbar[0];
		if (this.userInfo) {
			this.form.schoolName = this.userInfo.userSchool;
		}
		this.qiniuDataFrom.upload_token = this.uploadToken;
	},
		data() {
			return {
				uploadUrl: '',
				form: {
					goodsName: '',
					type: '',
					description: '',
					num: '',
					price: '',
					schoolName: '',
					canvas1: {},
					canvas2: {},
					canvas3: {},
				},
				images: [],
				chooseNavbarShow: false,
				chooseSchoolShow: false,
				qiniuDataFrom: { 
					filseName: 'test_new',
				}
			}
		},
		onReady() {
			this.canvas1 = uni.createCanvasContext('canvas1');
			this.canvas2 = uni.createCanvasContext('canvas2');
			this.canvas3 = uni.createCanvasContext('canvas3');
		},
		methods: {
			async submit() {
				if (!this.userInfo) {
					this.$refs.uToast.show({
						title: '请前往‘我的’界面进行登陆',
						type: 'warning',
					})
					return;
				}
				const imageList = this.$refs.uUpload.lists;
				if (imageList.length === 0) {
					this.$refs.uToast.show({
						title: '至少上传一张图片',
						type: 'error',
					})
					return;
				}
				if (this.form.goodsName === "") {
					this.$refs.uToast.show({
						title: '请输入商品名称',
						type: 'error',
					})
					return;
				}
				if (this.form.description === "") {
					this.$refs.uToast.show({
						title: '请输入商品商品的描述',
						type: 'error',
					})
					return;
				}
				if (this.form.num === "") {
					this.$refs.uToast.show({
						title: '请输入商品的数量',
						type: 'error',
					})
					return;
				}
				if (this.form.price === "") {
					this.$refs.uToast.show({
						title: '请输入商品的价格',
						type: 'error',
					})
					return;
				}
				await this.uploadToQiNiu();
				//提交到服务器上
				// console.log('存后端是', this.images);
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/goods/updata',
					url: `${this.baseUrl}/api/v1/goods/updata`,
					method: 'POST',
					data: {
						_csrf: this.csrf,
						...this.form,
						images: this.images,
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.$refs.uToast.show({
								title: '发布成功',
								type: 'success',
							})
							this.uploadUrl = '';
							this.form.goodsName = '';
							this.form.goodsName = '',
							this.form.description = '',
							this.form.num = '',
							this.form.price = '',
							this.images = [];
				
							this.$refs.uUpload.clear();
						} else {
							this.$refs.uToast.show({
								title: `发布失败：${res.data.msg}`,
								type: 'error',
							})
						}
					},
					fail: res => {
						console.log(res);
						this.$refs.uToast.show({
							title: '发布失败',
							type: 'error',
						})
					}
				})
				
			},
			chooseNavbar(index) {
				this.form.type = this.navbar[index[0]];
			},
			chooseSchool(index) {
				this.form.schoolName = this.schoolList[index[0]];
			},
			random(num) {
				let fileName = '';
				const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
				// 添加日期路径
				const date = new Date();
				fileName += Number(date.getMonth()) + 1 + '/';
				fileName += Number(date.getDate()) + '/';
				const maxLen = chars.length;
				for (let i = 0; i < num; i++) {
					fileName += chars.charAt(Math.floor(Math.random() * maxLen));
				}
				return fileName;
			},
			async uploadToQiNiu() {
				
				const imageList = [];
				await this.compress(imageList);
				const that = this;
				return new Promise((resolve, reject) => {
					let len = 0;
					for (let i = 0; i < imageList.length; i++) {
						uni.request({
							header: { 
								'Content-Type': 'application/octet-stream',
								'Authorization': `UpToken ${this.uploadToken}`
							},
							// url: 'https://wrpxcx.com/api/v1/goods/goods',
							url: 'https://up-z1.qiniup.com/putb64/-1',
							method: 'POST',
							data: imageList[i],
							complete: (res) => {
								len++;
								if (res.statusCode === 200) {
									that.images.push('https://picture.wrpxcx.com/' + res.data.key);
								}
								if (len === imageList.length) {
									resolve('complete');
								}
							}
						})
					}
				})
				
						// uni.uploadFile({
						// 	url: 'https://up-z1.qiniup.com',
						// 	name: 'file',
						// 	formData: {
						// 		token: this.uploadToken,
						// 		key: 'uni-app/' + this.random(16),
						// 	},
						// 	data: imageList[i],
						// 	complete: (res) => {
						// 		len++;
						// 		console.log(res);
						// 		if (res.statusCode === 200) {
						// 			console.log('上传成功');
						// 			const name = JSON.parse(res.data).key;
						// 			this.images[i] = 'https://picture.wrpxcx.com/' + name;
						// 		}
						// 		if (len === imageList.length) {
						// 			resolve('complete');
						// 		}
						// 	},
						// })
					
			},
			async compress(imageList) {
				const that = this;
				return new Promise((resolve, reject) => {
					const imageListBeforeCompress = this.$refs.uUpload.lists;
						// const imageList = [];
						// console.log('压缩图片', imageListBeforeCompress);
						for (let i = 0; i < imageListBeforeCompress.length; i++) {
							that.myDrawImage(i, imageListBeforeCompress[i].file.path);
							setTimeout(() => {
								let canvasWidth;
								let canvasHeight;
								uni.getImageInfo({
									src: imageListBeforeCompress[i].file.path,
									success: async (res) => {
										canvasWidth = res.width //图片原始长宽
										canvasHeight = res.height;
										let base = canvasWidth/canvasHeight;
										if(canvasWidth>500){
												canvasWidth = 500;
												canvasHeight = Math.floor(canvasWidth/base);
										}
										uni.canvasToTempFilePath({
											width: canvasWidth,
											height: canvasHeight,
											destWidth: canvasWidth,
											destHeight: canvasHeight,
											canvasId: `canvas${i + 1}`,
											success: (res) => {
												// 在H5平台下，tempFilePath 为 base64
												// console.log(res.tempFilePath);
												imageList.push(res.tempFilePath.split(',')[1]);
												if (imageList.length === imageListBeforeCompress.length) {
													resolve('complete');
												}
											}
										})
									},
								})
							}, 300)
						}
				})
			},
			async myDrawImage(i, src) {
				const that = this;
				let canvas;
				if (i === 0) {
					canvas = this.canvas1;
				} else if (i === 1) {
					canvas = this.canvas2;
				} else if ( i=== 2) {
					canvas = this.canvas3;
				}
					uni.getImageInfo({
						src,
						success: async function (res) {
							let canvasWidth = res.width //图片原始长宽
							let canvasHeight = res.height;
							let base = canvasWidth/canvasHeight;
							if(canvasWidth>500){
									canvasWidth = 500;
									canvasHeight = Math.floor(canvasWidth/base);
							}
							let img = new Image();
							img.src = src;
							// const canvas = uni.createCanvasContext('canvas');
							canvas.width = canvasWidth;
							canvas.height = canvasHeight;
							// 核心JS就这个
							canvas.drawImage(src,0,0,res.width, res.height,0,0,canvasWidth,canvasHeight);
							canvas.draw();
						}
				})
			}
		}
	}
</script>

<style>
.form {
	margin-left: 20rpx;
	margin-right: 20rpx;
}
.publish {
	margin-top: 30rpx;
}

.canvas {
	position: fixed;
	width: 1000rpx;
	height: 1000rpx;
	top: -99999rpx;
	/* opacity: 0; */
}

</style>
