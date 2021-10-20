<template>
	<view>
		<view v-if="list.length > 0">
			<u-swipe-action :show="item.show" :index="item.id" v-for="(item, index)  in list" :key="item.id"
				@click="click" @open="open" :options="options">
				<view class="item u-border-bottom">
					<image mode="aspectFill" :src="item.avatar" v-if="item.avatar" />
					<image mode="aspectFill" src="https://www.uviewui.com/common/logo.png" v-else />
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<view class="title-wrap">
						<text class="title u-line-2">{{ item.name }}</text>
						<view>
							{{ item.mobile }}
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<view class="empty" v-else>
			<u-empty :text="msg" mode="list"></u-empty>
		</view>
		<u-toast ref='uToast'/>
	</view>
</template>

<script>
	// 引用代理
	import {
		PerList,
		Delete
	} from "@/proxy/index.api.js";
	export default {
		data() {
			return {
				list: [],
				disabled: false,
				btnWidth: 180,
				show: false,
				// 暂无数据
				msg: "",
				options: [{
						text: "编辑",
						style: {
							backgroundColor: "#007aff",
						},
					},
					{
						text: "删除",
						style: {
							backgroundColor: "#dd524d",
						},
					},
				],
			};
		},
		onLoad() {},
		onShow() {
			this.getPerson();
		},
		methods: {
			async getPerson() {
				var result = await PerList();
				
				// console.log(result);
				if (result.code == 1) {
					result = result.data.map(item => {
						item.show = false;
						return item;
					})
					this.list = result;
				} else {
					this.msg = result.msg
					// console.log(this.list)

				}
			},
			async click(index, idx) {
				/* 
				    如果点击删除 返回两个值 1 1 -> 第一个是item.id 第二个是options数组的索引
				*/
		
				if (idx == 1) {
					// 写删除功能
					// let result={code:1}
					// let result = await Delete({
					// 	id:index
					// })
					// if(result.code==1){
					// 	this.list.splice(index, 1);
					// 	// this.$u.toast(`删除了第${index}个cell`);
					// 	this.$u.toast(`删除了id为${index}的cell`);
						setTimeout(function(){
							uni.navigateBack({
							delta: 0,
							});
						}
						,1000
						)
					// }
					var result=await Delete({id:index})
				
					if(result.code==1){
						this.$refs.uToast.show({
							title:result.msg,
							type:'success'
						})
						this.list.forEach((item,key)=>{
							if(index==item.id){
								this.list.splice(key,1)
							}
						})
					}else{
						this.$refs.uToast.show({
							title:result.msg,
							type:'error'
						})
					}

				} else {
					// 编辑功能
					this.$u.route({
						url: '/pages/edit/edit',
						params: {
							id: index
						}
					})
					// this.list[index].show = false;
					// this.$u.toast(`收藏成功`);
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.item {
		display: flex;
		padding: 20rpx;
	}

	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}

	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
		font-weight: bold;
	}

	.empty {
		margin-top: 160px !important;
	}
</style>
