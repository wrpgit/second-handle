<template>
	<view class="content">
		<view class="header">
			<view style="width: 100%; height: 310rpx; background: url('https://picture.wrpxcx.com/home_bg1.jpg'); background-size: 100% 100%;"></view>
			<view class="title">大学生闲置物品交易平台</view>
			<view class="schoolBox">
				<view class="label">当前展示学校: </view>
				<u-input class="showSchool" v-model="nowSchool" type="select" :border="false" @click="schoolListShow = true" />
			</view>
			<u-picker v-model="schoolListShow" mode="selector" :range="schools" @confirm="schoolsChange"></u-picker>
			<view class="searchBox">
				<u-search class="searchText" 
					shape="round" 
					v-model="searchContext"
					placeholder="search" 
					:show-action="false"
					:disabled="true"
					@click="searchFocus"
					ref="search" >
				</u-search>
			</view>
		</view>
		<view style="width: 100%" class="navbar">
			<u-tabs :list="navbarList" :is-scroll="false" :current="currentIndex" @change="changeNav"></u-tabs>
		</view>
		<view class="dataArea">
			<view v-for="(item, index) in list" :key="index">
				<view class="line" style="border-bottom: 10rpx rgb(241, 243, 244) solid;"/>
				<view class="item" @click="goodsDetail(item)">
					<u-image class="goodsImage" width="300rpx" height="230rpx" mode="aspectFit" :src="item.images[0]"></u-image>
					<view class="goodsName">{{ item.goodsName }}</view>
					<view class="description">{{ item.description }}</view>
					<view class="price">{{ item.price }}￥</view>
				</view>
			</view>
				<u-loadmore class="loadmore" :status="status" />
		</view>
	</view> 
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['csrf', 'schoolList', 'navbar', 'userInfo', 'baseUrl']),
		},
		created () {
			this.navbarList = this.navbar;
			this.schoolNames = this.schoolList.map(e => e.schoolName);
		},
		data() {
			return {
				searchContext: '',
				navbarList: [],
				currentIndex: 0,
				list: [],
				status: 'more',   // loading, nomore, more
				pageSize: 5,
				nowNum: 0,

				schoolListShow: false,
				nowSchool: '',
				schools: [],
			}
		},
		onLoad() {
			setTimeout(()=>{
				this.navbarList = this.navbar.map( item => Object({name: item}));
				this.schools = this.schoolList;
				if (this.userInfo) {
					this.nowSchool = this.userInfo.userSchool;
				} else {
					this.nowSchool = this.schoolList[0];
				}
				this.loadData();
			}, 500)
		},
		onShow() {
			// if (this.navbar) {
			// 	this.navbarList = this.navbar.map( item => Object({name: item}));
			// 	this.schools = this.schoolList;
			// }
		},
		methods: {
			searchFocus() {
        uni.navigateTo({
					url: '/pages/home/search', 
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			changeNav(index) {
				this.currentIndex = index;
				this.nowNum = 0;
				this.list = [];
				this.status = 'more';
				this.loadData();
			},
			onReachBottom() {
				this.status = 'loading';
				this.loadData();
			},
			goodsDetail(data) {
        uni.navigateTo({
					url: '/pages/goods/goods?goodsId=' + data._id, 
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			loadData() {
				if (this.status === 'nomore') {
					return;
				}
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/goods/goods',
					url: `${this.baseUrl}/api/v1/goods/goods`,
					method: 'GET',
					data: {
						type: this.navbar[this.currentIndex],
						startNum: this.nowNum,
						num: this.pageSize,
						school: this.nowSchool
					},
					success: (res) => {
						this.list.push(...res.data.goods);
						const len = res.data.goods.length;
						this.nowNum += len;
						if (len === 0 || len < this.pageSzie) {
							this.status = 'nomore';
						}
					},
				})
			},
			schoolsChange(index) {
				this.nowSchool = this.schools[index[0]];
				this.nowNum = 0;
				this.list = [];
				this.status = 'more';
				this.loadData();
			}
		}
	}
</script>

<style lang='scss'>	
.header {
	position: relative;
	width: 100%;
	height: 310rpx;
}
	.title {
		position: absolute;
		top: 50rpx;
		left: 20rpx;
		font-size: 45rpx;
		font-weight: 700;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.searchBox{
	  position: absolute;
	  top: 200rpx;
		width: 100%;
	}
	.searchText {
	  position: absolute;
	  top: 0; 
	  left: 20rpx;
	  background-color: #eee;
		width: 85%;
	  border-radius: 30rpx;
	}
	.searchIcon {
	    position: absolute;
	    top: 5rpx;
	    right: 3%;
	    color: white;
	}
	.navbar {
		position: relative;

	}
	.dataArea {
		position: relative;
		width: 100%;
	}
	.item {
		position: relative;
		margin-bottom: 10rpx;
		width: 100%;
		height: 290rpx;
		/* background-color: #eee; */
		top: 30rpx;
	}
	.goodsImage {
		position: absolute;
		float:left;
		margin: 10rpx;
		height:230rpx;
		width: 300rpx;
		background-color: black;
	}
	.goodsName {
		position: absolute;
		top:20rpx;
		left: 350rpx;
		float: left;
		width: 330rpx;
		overflow:hidden;   /*超过2行添加省略号*/
		display:-webkit-box;
		-webkit-line-clamp:2;
		text-overflow:ellipsis;
		-webkit-box-orient:vertical;
		word-break:break-all;
	}

	.description {
		position: absolute;
		width: 330rpx;
		top: 120rpx;
		left: 350rpx;
		float: left;
		overflow:hidden;   /*超过2行添加省略号*/
		display:-webkit-box;
		-webkit-line-clamp:3;
		text-overflow:ellipsis;
		-webkit-box-orient:vertical;
		word-break:break-all;
		font-size: 25rpx;
		color: rgb(43, 33, 33);
	}
	.price {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		float: left;
		color: rgb(6, 127, 187);
		font-size: 35rpx;
	}
	.loadmore {
		position: relative;
		top: 40rpx;
		padding-bottom: 60rpx;
	}
	.line {
		position: relative;
		top: 10rpx;
	}

.schoolBox {
	position: absolute;
	top: 113rpx;
	width: 100%;

	.label {
		position: absolute;
		left: 20rpx;
		top: 10rpx;
		font-size: 30rpx;
		font-weight: 500;
	}
	.showSchool {
		position: relative;
		width: 300rpx;
		left: 220rpx;
		font-size: 30rpx;
		color: black;
		font-weight: 700;
		height: 40rpx;
	}
}
</style>
