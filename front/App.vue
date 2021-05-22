<script>
	import { mapMutations, mapState } from 'vuex'

 	export default {
		computed: {
			...mapState(['baseUrl']),
    },
		methods: {
			...mapMutations(['init', 'initSocket']),
		},
		computed: {
			userInfo: {
				get() {
					return this.$store.state.usreInfo;
				},
				set(userInfo) {
					this.$store.state.userInfo = userInfo;
				}
			}
		},
		onLaunch:async function() {
			await uni.request({
				header: { 'Content-Type': 'application/x-www-form-urlencoded' },
				// url: 'https://wrpxcx.com/api/v1/common/init',
				// url: 'http://192.168.23.1:7001/api/v1/common/init',
				url: '/api/v1/common/init',
				success: (res) => {
					const { csrf, school, navbar, uploadToken, isLogin } = res.data.data;
					this.init({ school, navbar, csrf, uploadToken });
					if (!isLogin) {
						uni.removeStorage({
							key: 'userInfo',
						})
						this.userInfo = null;
					}
				}
			});

			try {
				const userInfo = uni.getStorageSync('userInfo');
				// 如果缓存中有登陆信息，就保持登陆,将登陆信息放到vuex中
				if (userInfo) {
					this.userInfo = userInfo;
					this.initSocket();
				}
			} catch (err) {
				console.log(err);
			}
			
			// const socket = this.$store.state.appSocket;
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
@import "uview-ui/index.scss";
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */

@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>

