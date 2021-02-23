<template>
    <div>

        <czy :totalPage="data.totalPage"
        :currentPage="data.currentPage"
        :totalCount="data.totalCount"
        :pageSize="data.pageSize"
        :hasPrevious="data.hasPrevious"
        :hasNext="data.hasNext"/>
    </div>
</template>

<script>
    import userApi from "../api/userApi";
    import czy from "@/components/czy-pagination";
    export default {
        name: "test-component",
        components: {
            czy
        },
        data(){
            return{
                data:{
                    totalPage:1,
                    currentPage:2,
                    totalCount:10,
                    pageSize : 10,
                    hasPrevious:false,
                    hasNext:false
                }
            }
        },
        mounted() {
            userApi.listUsers(1,10,'','').then(res=>{
                console.log(res.data.data.data)
                this.data = res.data.data.data;
            })
        }
    }
</script>

<style scoped>

</style>