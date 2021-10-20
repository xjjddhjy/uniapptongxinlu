<template>
  <view>
    <u-tabs :list="deplist" :is-scroll="true" :current="current" @change="change"></u-tabs>
	<u-search placeholder="日照香炉生紫烟" v-model="keyword" @search='search'></u-search>
    <view v-if="list.length > 0">
      
      <u-swipe-action
        :show="item.show"
        :index="item.id"
        v-for="item in list"
        :key="item.id"
        @click="click"
        @open="open"
        @content-click="contentclick(item.name,item.mobile)"
        :options="options"
      >
        <view class="item u-border-bottom">
          <image mode="aspectFill" :src="item.avatar" v-if="item.avatar" />
          <image mode="aspectFill" src="https://www.uviewui.com/common/logo.png" v-else />
          <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
          <view class="title-wrap">
            <text class="title u-line-2">{{ item.name }}</text>
            <view class="mobile">
              {{ item.mobile }}
            </view>
          </view>
        </view>
      </u-swipe-action>
    </view>
    <view class="empty" v-else>
      <u-empty :text="msg" mode="list"></u-empty>
    </view>
    <u-toast ref="uToast" />
    <u-modal v-model="ShowModal" title="是否拨打该号码" show-cancel-button @confirm="confirm">
      <view class="slot-content">
				<rich-text :nodes="content"></rich-text>
			</view>
    </u-modal>
  </view>
</template>

<script>
// 引用代理
import { PerList,Delete,getDepList,getDepListBySearch } from "@/proxy/index.api.js";
export default {
  data() {
    return {
		keyword: '遥看瀑布挂前川',
      list: [],
      deplist:[],
      disabled: false,
      btnWidth: 180,
      show: false,
      // 选择全部
      current:0,
      // 模态框
      ShowModal:false,
      // mobile:'',
      // 模态框内容
      // content:`ww`,
      content:[
        {
          name:'div',
          attrs: {
                class: 'div-class',
                style: 'line-height: 30px; text-align:center;font-weight: bold;'
          },
          children: [
            {
                  type: 'text',
                  text: ''
            }
          ]
        },
        {
          name:'div',
          attrs: {
                class: 'mobile',
                style: 'text-align:center;margin-bottom:10px;font-weight: bold;'
          },
          children: [
            {
                  type: 'text',
                  text: ''
            }
          ]
        }
      ],
      // 暂无数据
      msg: "",
      options: [
        {
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
    this.change();
    this.getdepList();
  },
  methods: {
	  async search(value){
		  console.log(value)
		  var result = await getDepListBySearch({name:value})
		  this.list = result.data
		  // this.$refs.uToast.show({
		  // 	title: '搜索内容为：' + value,
		  // 	type: 'success'
		  // })
	  },
    async getdepList(){
      var data = {
        action:'person'
      }
      var result = await getDepList(data)
      // console.log(result)
      this.deplist = result.data
    },
    async click(index, idx) {
      /* 索引item.index 改 item.id
          如果点击删除 返回两个值 1 1 -> 第一个是item.index 第二个是options数组的索引
      */
    //  var id = index + 1;
      // console.log(id,index,idx)
      // return false
      if (idx == 1) {
        // 写删除功能
        var result = await Delete({id:index})
        // console.log(result)
        if(result.code == 1){
          this.$refs.uToast.show({
						title:result.msg,
						type:'success'
					})
          this.list.forEach((item,key) => {
            if(index == item.id){// 判断index == item 说明这是删除成功的
              // 同时index==item.id 那么这条数据同一条 按索引删掉这条数据
              this.list.splice(key,1)
            }
          })
        }else{
          this.$refs.uToast.show({
						title:result.msg,
						type:'error'
					})
        }
        // this.list.splice(index, 1);
        // this.$u.toast(`删除了第${index}个cell`);
      } else {
        // 编辑功能
        this.$u.route({
          url:'/pages/edit/edit',
          params:{
            id:index
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
      // console.log(index)
      // 现在index是item.id 不是数组索引
      // 拿list数组遍历 拿到item.id 索引
      this.list.forEach((item,idx) =>{
        // 如果传的id等于item.id 说明正在滑动操作的就是该id
        if(index == item.id){
          // index 等于item.id 遍历出来的索引 id想作为this.list[index]
          this.list[idx].show = true
        }else{
          this.list[idx].show = false
        }
      })
      // return false
      // this.list[index].show = true;
      // this.list.map((val, idx) => {
      //   if (index != idx) this.list[idx].show = false;
      // });
    },
    async contentclick(name,mobile){
      
        // console.log()
        // this.mobile = mobile
        this.content[0].children[0].text = name
        this.content[1].children[0].text = mobile
        // this.content.children.text
        // var result = await Call({id:index})
        // if(result.code == 1){
          this.ShowModal = true
        // }
    },
    // 模态框 确认
    confirm(){
      var mobile =  this.content[1].children[0].text
      uni.makePhoneCall({
        phoneNumber:mobile,
        success(res){
          console.log(res)
        },
        fail(){
          console.log(111)
        }
      })
    },
    // 选择部门
    async change(index){
      // console.log(index)
      this.current = index;
      // 把数组索引封装成一个对象
      var data = {
        index:index
      }
      var result = await PerList(data)
      // console.log(result)
      if (result.code == 1) {
        this.list = result.data;
      } else {
        this.list = result.data;
        this.msg = result.msg
        // console.log(this.list)

      }

    }
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
.mobile{
  margin-top: 5px;
}
</style>