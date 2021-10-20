import Request from 'luch-request'

// const appConfig = "http://www.xjjuniapp1tp5.com/api/"
// const appConfig = "http://www.xjjuniapp1tp5.com"
const appConfig = "http://120.79.80.66:9009/api/"

const getTokenStorage = () => {
	let token = ''
	try {
		token = uni.getStorageSync('token')
	} catch (e) {
		console.log(e);
	}
	return token
}
const devHttp = new Request()

/* 设置全局配置 */
devHttp.setConfig((config) => {
	config.baseURL = appConfig
	config.custom.loading= true;
	config.header = {
		...config.header,
		'Content-Type': "application/json"
	}
	console.log(config);
	return config
})

/* 请求之前拦截器。可以使用async await 做异步操作  */
devHttp.interceptors.request.use((config) => {
	config.header = {
		...config.header,
	}
	if (getTokenStorage()) {
		config.header['token'] = getTokenStorage()
		// console.log(config.header['token'])
	}
	if (config.custom.loading) {
		uni.showLoading()
	}
	return config
}, (config) => {
	return Promise.reject(config)
})

//响应拦截器即异常处理
devHttp.interceptors.response.use((response) => {
	uni.hideLoading();
	let res = response.data
	let code = res.code
	let resultData = response.data.data;

	if (code !== 200) {
		// // 5001: 请求参数校验异常
		// if (code === 5001) {
			
		// 	uni.showToast({
		// 		title: errorMessage,
		// 		icon: 'none'
		// 	})
		// } else if (code === 51068) {
			
		// } else if (code === 51067) {
			
		// } else {
		// 	uni.showToast({
		// 		title: res.message || 'Error',
		// 		icon: 'none'
		// 	})
		// }
		// Promise.reject(new Error(res.message || 'Error'))
		// 当状态码不是200时，是否需要返回响应结果给调用方
		return res
	} else {
		return res
	}
}, (response) => {
	uni.hideLoading();
	console.log("response: " + JSON.stringify(response));
	const status = response.statusCode;
	if (status === 51067) {
		uni.showToast({
			title: "登录过期，即将跳转至登录页",
			icon: 'none',
			duration: 1000
		});
		
	} else {
		return Promise.reject(response)
	}
})
export {
	devHttp
}