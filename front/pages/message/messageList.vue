<template>
	<view class="body">
		<view v-for="(item, index) in messageList" :key="index">
			<view class="item" @click="toMessage(item)">
				<view class="avatar" :src="item" size="large"><u-avatar :src="item.othersAvatar"></u-avatar></view>
				<view class="box">
					<view class="nickName">{{ item.othersNickName }}</view>
					<text class="context">{{ item.context }}</text>
					<text class="time">{{ item.createTime }}</text>
					<view v-if="item.notReadNum > 0">
						<view class='notReadNum'>{{item.notReadNum}}</view>
					</view>
				</view>
			</view>
			<u-gap height="10" bg-color="rgb(242, 244, 247)"></u-gap>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
  import { mapState } from 'vuex';
	export default {
		computed: {
			...mapState(['appSocket', 'userInfo', 'baseUrl']),
		},
		data() {
			return {
				messageList: [],
			}
		},
    onShow() {
      if (!this.userInfo) {
        setTimeout(() => {
          this.$refs.uToast.show({
            title: '请前往‘我的’界面进行登陆',
            type: 'warning',
          })
        }, 100);
        return;
      }
      this.flashMessageList();
    },
    onLoad() {
      if (!this.userInfo) {
        return;
      }
      this.flashMessageList();
      this.appSocket.on('message', () => {
        this.flashMessageList();
      })
    },
		methods: {
			toMessage(item) {
        uni.navigateTo({
					url: '/pages/message/message?friendUserId=' + item.othersUserId, 
					animationType: 'pop-in',
					animationDuration: 200
				})
      },
      flashMessageList() {
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/message/messageList',
					url: `${this.baseUrl}/api/v1/message/messageList`,
					method: 'GET',
					success: (res) => {
            this.messageList = res.data.messageList;
					},
        })
      }
		}
	}
</script>

<style>

.item{
  margin: 0;
  position: relative;
  width:100%;
  height: 140rpx;
  /* background-color: #ccc; */
}
.avatar{
  position: absolute;
  top: 20rpx;
  left: 10rpx;
}
.box{
  position: absolute;
  left: 130rpx;
  width: 620rpx;
  height: 140rpx;
  margin-top: 4rpx;
  background-color: white;
  display: inline-block;
}
.nickName{
  position: relative;
  left: 0rpx;
  top: 30rpx;
}
.context{
  position: relative;
  left: 0;
  top: 37rpx;
  width: 550rpx;

  overflow:hidden;
  display:-webkit-box;
  -webkit-line-clamp:1;
  text-overflow:ellipsis;
  -webkit-box-orient:vertical;
  word-break:break-all;
}
.time{
  position: absolute;
  top: -1rpx;
  right: 20rpx;
  font-size: 30rpx;
}

.hr{
  position: relative;
  top: 20rpx;
  margin-top: 10rpx;
  background-color: rgb(242, 244, 247);
  height: 5rpx;
  width: 100%;
}

.notReadNum{
  position: absolute;
  right: 30rpx;
  top: 80rpx;
  border-radius: 50%;
  background-color: red;
  font-size: 30rpx;
  width: 40rpx;
  height: 40rpx;
  text-align: center;
}

</style>
