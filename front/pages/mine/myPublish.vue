<template>
	<view>
		<view v-if="list.length === 0" class="empty"> 空空如也~~</view>
		<view class="dataArea">
			<view v-for="(item, index) in list" :key="index">
				<view class="line" style="border-bottom: 10rpx rgb(241, 243, 244) solid;"/>
				<view class="item" @click="goodsDetail(item)">
					<u-image class="goodsImage" width="300rpx" height="230rpx" mode="aspectFit" :src="item.images[0]"></u-image>
					<view class="goodsName">{{ item.goodsName }}</view>
					<view class="description">{{ item.description }}</view>
					<view class="status" v-if="item.status === 1" style="color: orange;">审核状态: 待审核</view>
					<view class="status" v-if="item.status === 2" style="color: green;">审核状态: 审核通过，已上架</view>
					<view class="status" v-if="item.status === 3" style="color: red;">审核状态: 审核未通过</view>
					<view class="price">{{ item.price }}￥</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['baseUrl']),
		},
		data() {
			return {
				shoperName: '我发布的',
				background: {
					backgroundColor: '#007AFF'
				},
				userId: '',
				list: [],
			}
		},
		onLoad(option) {
			this.userId = option.userId;
		},
		onShow() {
			uni.request({
				header: { 'Content-Type': 'application/x-www-form-urlencoded' },
				// url: 'https://wrpxcx.com/api/v1/goods/userGoods',
				url: `${this.baseUrl}/api/v1/goods/userGoods`,
				method: 'GET',
				data: {
					userId: this.userId,
				},
				success: (res) => {
					this.list = res.data.goods;
					this.shoperName = res.data.userInfo.nickName + '的小店';
				},
			})

		},
		methods: {
			goodsDetail(data) {
        uni.navigateTo({
					url: '/pages/goods/goods?goodsId=' + data._id, 
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
		}
	}
</script>

<style>
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
	}
	.price {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		float: left;
		color: rgb(6, 127, 187);
		font-size: 35rpx;
	}
	.line {
		position: relative;
		top: 10rpx;
	}
	.empty {
		position: absolute;
		text-align: center;
		top: 177rpx;
		left: 40rpx;
	}
	.status {
		position: absolute;
		bottom: 20rpx;
		margin-left: 30rpx;
	}

</style>
