<template>
	<view class="box">
		 <u-search class="searchText" 
					shape="round" 
					v-model="searchContext" 
					placeholder="search" 
					:show-action="true"
					action-text="取消" 
					@search="search"
					@custom="cancel">

			</u-search>

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
			...mapState(['baseUrl'])
		},
		data() {
			return {
				searchContext: "",
				oldSearchContext: "null",
				list: [],
				status: 'more',   // loading, nomore, more
				pageSize: 5,
				nowNum: 0
			}
		},
		methods: {
			cancel() {
				uni.switchTab ({
					url: '/pages/home/home',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			goodsDetail(data) {
        uni.navigateTo({
					url: '/pages/goods/goods?goodsId=' + data._id, 
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			search() {
				// if (this.searchContext === "" || this.searchContext === this.oldSearchContext) {
				if (this.searchContext === this.oldSearchContext) {
					return;
				}
				this.status = 'more';
				this.nowNum = 0;
				this.loadData();
			},
			onReachBottom() {
				this.status = 'loading';
				this.loadData();
			},
			loadData() {
				if (this.status === 'nomore') {
					return;
				}
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/goods/searchGoods',
					url: `${this.baseUrl}/api/v1/goods/searchGoods`,
					method: 'GET',
					data: {
						keyword: this.searchContext,
						startNum: this.nowNum,
						num: this.pageSize
					},
					success: (res) => {
						if (this.oldSearchContext !== this.searchContext) {
							this.list = [];
							this.oldSearchContext = this.searchContext;
						}
						this.list.push(...res.data.goods);
						const len = res.data.goods.length;
						this.nowNum += len;
						if (len === 0 || len < this.pageSzie) {
							this.status = 'nomore';
						}
					},
				})
			},
		}
	}
</script>

<style>
	.box{
		position: absolute;
		top: 30rpx;
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
		width: 100%;
	}

	.dataArea {
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
		line-height: 30rpx;
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
</style>
