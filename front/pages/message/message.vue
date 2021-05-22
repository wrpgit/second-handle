<template>
	 <view class="body">
			<u-navbar class="navbar" :custom-back="back" back-icon-color="white" back-text="" :title="friendName" title-color="white" :background="background">
				<view class="right-btn" @click="toShoper">
					 <u-icon name="list" color="white" size="50"></u-icon>
				</view>
			</u-navbar>
			<scroll-view class="scrollArea" scroll-y="true" @scroll="scroll" :scrollTop="scrollTop" :scroll-with-animation="true" :style="'height: '+((scrollHeight)*(750 / this.screenWidth) - 80) +'rpx;'">
				<view v-for="(message, index) in messages" :key="index">
						<view class='time'>{{message.createTime}}</view>
						<view v-if="message.sendUserId == myInfo.userId">
							<view class="message right">
								<u-avatar class="head" :src="myInfo.avatarUrl"></u-avatar>
								<view class='word'>{{message.context}}</view>
							</view>
						</view>
						<view v-else-if="message.sendUserId == friendUserId">
							<view class="message left">
								<u-avatar class="head" :src="friendInfo.avatarUrl"></u-avatar>
								<view class='word'>{{message.context}}</view>
							</view>
						</view>
					</view>
			</scroll-view>
			<textarea class="inputArea" @linechange="linechange" :auto-height="true" v-model="inputValue"></textarea>
			<u-button style="position: fixed" :custom-style="sendBtn" size="default" @click="sendMessage" >发送</u-button>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['userInfo', 'appSocket', 'baseUrl']),
		},
		data() {
			return {
				friendUserId: '',
				friendName: '',
				background: {
					backgroundColor: '#007AFF'
				},
				scrollHeight: 0, // 获取屏幕高度后修改
				inputValue: '',
				screenHeight: 0,
				screenWidth: 0,
				navbarHeight: 0,
				messages: [],
				friendInfo: {},
				myInfo: {},
				scrollTop: 0, // scroll area 滚动条的位置
				nowScrollTop: 0,
				sendBtn: {
					position: 'absolute',
					bottom: '10rpx',
					right: '10rpx',
					height: '60rpx',
					width: '120rpx',
					'background-color': 'green',
					color: 'white'
				}
			}
		},
		onLoad: function(option) {
			this.friendUserId = option.friendUserId;
			this.myInfo = this.userInfo;
			// 获取好友信息和消息
			uni.request({
				header: { 'Content-Type': 'application/x-www-form-urlencoded' },
				// url: 'https://wrpxcx.com/api/v1/message/message',
				url: `${this.baseUrl}/api/v1/message/message`,
				method: 'GET',
				data: {
					userId: this.userInfo.userId,
					othersUserId: this.friendUserId
				},
				success: (res) => {
					this.friendInfo = res.data.friendInfo;
					this.friendName = this.friendInfo.nickName;
					this.messages = res.data.messages;
					setTimeout(() => {
						this.scrollTop = 10000;
					}, 7);
				},
			})
			this.appSocket.on('reMessage', (data) => {
				if (data === 'success') {
					this.messages.push({ createTime: '刚刚', context: this.inputValue, receiverUserId: this.friendUserId, sendUserId: this.myInfo.userId })
					this.inputValue = "";
					setTimeout(() => {
						this.scrollTop = 100000 + Math.random() * 100;
					}, 10);
				}
			});
			this.appSocket.on('message', (data) => {
				this.messages.push({ createTime: data.createTime, context: data.context, receiverUserId: data.receiverUserId, sendUserId: data.sendUserId });
				setTimeout(() => {
					this.scrollTop = 100000 + Math.random() * 100;
				}, 10);
			});

		},
		onReady: function() {
			// 调整滚动区域的高度
			try {
				const res = uni.getSystemInfoSync();
				this.scrollHeight= res.windowHeight;
				this.screenHeight = res.windowHeight;
				this.screenWidth = res.windowWidth;
			} catch (e) {
				console.log('获取屏幕高度失败');
			}	
			const query = uni.createSelectorQuery().in(this);
			query.select('.navbar').boundingClientRect(data => {
				this.navbarHeight = data.height;
			}).exec();

			query.select('.inputArea').boundingClientRect(data => {
				this.scrollHeight = this.screenHeight - this.navbarHeight - data.height;
			}).exec();

			uni.onKeyboardHeightChange(res => {
				this.scrollHeight -= res.height;
				this.scrollTop += res.height;
			})
		},
		methods: {
			scroll(e) {
				this.nowScrollTop = e.detail.scrollTop;
				this.scrollTop = e.detail.scrollTop;
			},
			sendMessage() {
				// 去掉开头的空格
				this.inputValue = this.inputValue.replace(/^\s\s*/,'');
				if (this.inputValue === '') {
					return;
				}
				this.appSocket.emit('sendMsg', {
					receiverUserId: this.friendUserId,
					context: this.inputValue,
				})
			},
			linechange() {
				const that = this;
				// 延迟10ms执行，监听的是键盘按下事件，导致高度变化有延迟
				setTimeout(() => {
					const query = uni.createSelectorQuery().in(that);
					const oldScrollHeight = that.scrollHeight;
					query.select('.inputArea').boundingClientRect(data => {
						that.scrollHeight = that.screenHeight - that.navbarHeight - data.height;
					}).exec();
					that.scrollTop += oldScrollHeight - that.scrollHeight;
				}, 7);
			},
			back() {
		    // 将未读消息清零
				uni.request({
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					// url: 'https://wrpxcx.com/api/v1/message/emptyNotReadNum',
					url: `${this.baseUrl}/api/v1/message/emptyNotReadNum`,
					method: 'GET',
					data: {
						othersUserId: this.friendUserId,
					}
				})
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
			},
			toShoper() {
        uni.navigateTo({
					url: '/pages/mine/shoper?userId=' + this.friendUserId, 
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
		}
	}
</script>

<style lang='scss'>
.body {
	background-color: black;
	background: black;
	height: 100%;
	width: 100%;
}
.right-btn {
	position: absolute;
	right: 20rpx;
}
.scrollArea {
	background-color: #eee;
	padding-bottom: 100rpx;
}
.inputArea {
	position: fixed;
	bottom: 1rpx;
	width: 77%;
	border: solid 1rpx;
	padding: 10rpx;
	margin: 10rpx;
	font-size: 30rpx;
	max-height: 300rpx;
	border-radius: 10rpx;
	background-color: white;
	z-index: 99;
}
.sendBtn {
	position: fixed;
	bottom: 10rpx;
	right: 10rpx;
	height: 60rpx;
	width: 120rpx;
	background-color: green;
	color: white;
}

.time {
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	margin-top: 10rpx;
}
.message {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	align-content: flex-start;
	flex-wrap: nowrap;
	flex-direction: row;
	margin-bottom: 30rpx;

	.head{
		width: 80rpx;
		height: 80rpx;
		border-radius: 5rpx;
	}

	.word{
		padding: 20rpx;
		max-width: 500rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	&.right {
		flex-direction: row-reverse;
		.word{
			background-color: $uni-color-success;
			margin-right: 10rpx;
			word-break: break-all;
			line-height: 36rpx;
			position: relative;
			top: 10rpx;
		}
		.head {
			margin-right: 10rpx;
		}
	}

	&.left {
		.word {
			background-color: $uni-text-color-inverse;
			margin-left: 10rpx;
			word-break: break-all;
			line-height: 36rpx;
			position: relative;
			top: 10rpx;
		}
		.head {
			margin-left: 10rpx;
		}
	}
}
	

</style>