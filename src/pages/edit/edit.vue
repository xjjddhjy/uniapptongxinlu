<template>
	<view class="content">
		<u-form :model="user" ref="userForm">
			<u-form-item label="姓名" prop="name">
				<u-input v-model="user.name" placeholder="请输入姓名" />
			</u-form-item>
			<u-form-item label="性别">
				<u-input v-model="user.sex" type="select" placeholder="请选择性别" @click="show = true" />
			</u-form-item>
			<u-form-item label="手机号" prop="mobile">
				<u-input type="number" v-model="user.mobile" placeholder="请输入手机号" />
			</u-form-item>
			<u-form-item label="所属部门" label-width="170">
				<u-input v-model="user.depname" type="select" placeholder="请选择所属部门" @click="selectshow = true" />
				<u-select v-model="selectshow" :list="deplist" @confirm="dep"></u-select>
			</u-form-item>
			<u-form-item label="所属职位" label-width="170">
				<u-input v-model="user.jobname" type="select" placeholder="请选择所属部门" @click="jobshow = true" />
				<u-select v-model="jobshow" :list="joblist" @confirm="job"></u-select>
			</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
		<u-action-sheet :list="list" v-model="show" @click="actionSheetCallback"></u-action-sheet>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {getDepList,getJobList,getProfile,edit} from "@/proxy/index.api.js"
	export default {
		data() {
			return {
				user:{
					id:'',
					name:'',
					sex:'保密',
					mobile:'',
					depname:'',
					jobname:''
				},
				show:false,
				list:[
					{
						text: '男'
					},
					{
						text: '女'
					},
					{
						text: '保密'
					}
				],
				// 选择器
				selectshow:false,
				deplist: [
					{
						value: '1',// id值
						label: '江'// 部门名称
					},
					{
						value: '2',
						label: '湖'
					}
				],
				jobshow:false,
				joblist:[
					{
						value: '0',// id值
						label: '请先选择部门'// 部门名称
					}
				],
				rules:{
					name:{
						// 必填值
						required: true, 
						// 提示信息
						message: '请输入姓名', 
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change','blur'],
					},
					mobile: [
						{
							required: true, 
							message: '请输入手机号',
							trigger: ['change','blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change','blur'],
						}
					]
				}
			}
		},
		onLoad(res) {
			// res = id:3 -> res.id = 3
			this.profile(res.id)
			console.log(res)
			this.user.id=res.id;
		},
		onShow(){
			this.getDep()
		},
		onReady() {
			this.$refs.userForm.setRules(this.rules);
		},
		methods: {
			submit() {
			
				console.log(this.user)
				/* 
					uForm = 要验证的表单
					validate = 验证器
				*/
				if (this.user.depname == '') {
					this.$refs.uToast.show({
						title: '请选择部门',
						type: 'warning'
					})
					// 当提交表单时 如果走进这条判断 那么停止执行后面代码
					return false
				}
				if (this.user.jobname == '') {
					this.$refs.uToast.show({
						title: '请选择职位',
						type: 'warning'
					})
					// 当提交表单时 如果走进这条判断 那么停止执行后面代码
					return false
				}
				this.$refs.userForm.validate(async valid => {
					if (!valid) {
						return false
					}
					var result = await edit(this.user)
					// console.log(result)
					if (result.code == 1) {
						this.$refs.uToast.show({
							title: result.msg,
							type: 'success',
						})
						setTimeout(function(){
							uni.navigateBack({
							delta: -1,
							});
						}
						,1000
						)
						setTimeout(() => {
							// this.$u.route({
							// 	type: "to",
							// 	// params:{
							// 	// 	age: 22,
							// 	// 	name: '李商隐'
							// 	// },
							// 	url: "/pages/library/route/routeTo",
							// 	animationType: "slide-in-bottom"
							// });

							// this.user = {
							// 	name: '',
							// 	sex: '保密',
							// 	mobile: '',
							// 	depname: '',
							// 	jobname: ''
							// }
						}, 1000);
			
						return false
					} else {
						this.$refs.uToast.show({
							title: result.msg,
							type: 'error',
						})
					}
				});
			},
			/* 根据传的id 请求数据 */
			async profile(id){
				// id = 3
				/* 封装 */
				var data= {
					id
				}
				var result = await getProfile(data)
				if(result.code == 1){
					this.user = result.data
				}else{
					
					this.$refs.uToast.show({
						title:result.msg,
						type:'error',
						url: '/pages/user/index'
					})
					setTimeout(() => {
						this.$u.route({
							type:'switchTab',
							url:'/pages/index/index'
						})
					}, 1500);
					
				}
			},
			// 点击选择性别回调
			actionSheetCallback(index) {
				console.log(this.list[index].text)
				this.user.sex = this.list[index].text
				// this.value = this.actionSheetList[index].text;
			},
			async dep(val){
				/* 当选择部门的时候先把职位的值重新赋值为空 */
				this.user.jobname = ''
				this.user.depname = val[0].label
				// console.log(val)
				/* 封装请求参数 */
				var data = {
					id:val[0].value
				}
				var result = await getJobList(data)
				if(result.code == 1){
					this.joblist = result.data
				}else{
					// 封装当返回数据是空时，就显示这个内容
					var data = [
						{
							value:0,
							label:result.msg
						}
					]

					this.joblist = data
				}

			},
			// 查询部门的所有数据
			async getDep(){
				// 请求参数
				// var data = {
				// 	id: 1,
				// 	username: 'admin'
				// }
				// this.user.jobname = 
				var result = await getDepList()
				// console.log(result)
				if(result.code == 1){
					
					this.deplist = result.data
				}else{
					// 封装当返回数据是空时，就显示这个内容
					var data = [
						{
							value:0,
							label:result.msg
						}
					]

					this.deplist = data
				}
			},
			job(val){
				this.user.jobname = val[0].label
			}
		}
	}
</script>

<style>
	.content {
		padding: 0 20px;
	}
</style>
