<template>
    <div class="czy-pagination">
        <div class="pre">
            <a href="/index" v-if="hasPrevious"><</a>
        </div>
        <div class="list">
            <a v-for="page in totalPage" :key="page">{{page}}</a>
        </div>
        <div class="next">
            <a v-if="hasNext"> > </a>
        </div>
        <div class="pages">
            总共{{totalCount}}数据<br/>
            总共{{totalPage}}页ヽ(￣ω￣(￣ω￣〃)ゝ
        </div>
    </div>
</template>

<script>
    export default {
        name: "czy-pagination",
        props:['totalPage','hasPrevious','hasNext','totalCount','currentPage','pageSize'],
        data(){
            return{
                totalPage:this.totalPage,
                currentPage:this.currentPage,
                totalCount:this.totalCount,
                pageSize : this.pageSize,
                hasPrevious:this.hasPrevious,
                hasNext:this.hasNext
            }
        }
    }
</script>

<style scoped lang="less">

    .czy-pagination {
        position: relative;
        margin: 0 auto;
        text-align: center;

        width: 600px;
        height: 70px;
        display: flex;
        justify-content: center;

        a {
            border-radius: 10px;
            background: #ff4e6a;
            height: 35px;
            width: 35px;
        }

        .pre,.pages,.next,.list{
            line-height: 35px;
        }
        .pre {
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .next {
            height: 35px;
            display: flex;
            align-items: center;
        }

        .list {
            margin-left: 15px;
            margin-right: 15px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .pages {
            position: absolute;
            right: 0;
            top: 35px;
            height: 35px;
            width: 200px;
        }
    }
</style>