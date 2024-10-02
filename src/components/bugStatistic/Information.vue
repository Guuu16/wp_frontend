<template>
    <div>
        <div class="content">
            <ul id="con1" ref="con1" :class="{ anim: animate == true }" style="margin:0">
                <li v-for='(item, index) in items' :key="index">{{ item.name }}</li>
            </ul>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            animate: false,
            items: [
                { name: "今天天气怎么样" },
                { name: "今天天气不好" },
                { name: "哇塞多撒打算放" },
                { name: "阿发送方三房" },
                { name: "阿萨发顺丰都是地方" },
            ]
        };
    },
    created() {
        setInterval(this.scroll, 2000)
    },
    methods: {
        scroll() {
            this.animate = true;    // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
            setTimeout(() => {      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
                this.items.push(this.items[0]);  // 将数组的第一个元素添加到数组的
                this.items.shift();               //删除数组的第一个元素
                this.animate = false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
            }, 500)
        }
    }

}
</script>
<style scoped>
#box {
    width: 300px;
    height: 32px;
    overflow: hidden;
    padding-left: 30px;
    border: 1px solid black;
}

.anim {
    transition: all 0.5s;
}

#con1 li {
    list-style: none;
    line-height: 30px;
    height: 30px;
}
</style>