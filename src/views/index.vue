<template>
    <div class="index-part-box">
        <!--为echarts准备一个具备大小的容器dom-->

        <el-row :gutter="20">
            <el-col :span="12">
                <div style="background-color: #fff;border-radius: 4px">
                    <div class="system-monitor-box">
                        <div style="display: flex;align-items: center">cpu<el-progress type="circle" :percentage="cpu" color="#f56c6c"></el-progress></div>
                        <div style="display: flex;align-items: center">内存<el-progress type="circle" :percentage="memory" color="#919192"></el-progress></div>
                        <div style="display: flex;align-items: center" v-for="(item,index) in disks" :key="index">{{item.name}}<el-progress type="circle" :percentage="item.disk" color="#a0c5ca"></el-progress></div>
                    </div>
                <div id="chart" style="width: 100%;min-height: 400px;"></div>
                <el-button style="margin: 16px" type="primary" @click="changeMonitor">{{monitorChange}}</el-button>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="index-advise-content">
                    <div style="height: 50px;
        line-height: 50px;
        padding: 20px;">
                        <el-divider content-position="left">博客通知:</el-divider>
                    </div>
                        <div style="padding: 20px">
                            <el-input style="margin-bottom: 10px"
                                    disabled
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 5}"
                                    placeholder="请输入博客通知"
                                    v-model="blogAdvise">
                            </el-input>
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 5}"
                                    placeholder="请输入博客通知"
                                    v-model="blogAdviseEditor">
                            </el-input>
                            <el-button style="margin-top: 10px" type="primary" @click="postWebSizeAdvice">确定修改</el-button>

                        </div>



                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import echarts from 'echarts'
    import userApi from "../api/userApi";
    import settingsApi from "../api/settingsApi";

    export default {
        name: "index",


        data () {
            return {
                isMounted: true,
                intervalFunction: '',
                monitorChange: '停止监测',
                cpu: 0,
                memory: 0,
                disks: [],
                isDisksDataInit: false,
                interval: '',
                blogAdviseEditor: '',
                blogAdvise: '',
                charts: null,
                chartsOption: {
                    title: {
                        text: '系统信息监测'
                    },
                    legend: {
                        data: ['cpu占用率', '内存使用率']
                    },
                    toolbox: {
                        // y: 'bottom',
                        feature: {
                            magicType: {
                                type: ['stack', 'tiled']
                            },
                            dataView: {},
                            saveAsImage: {
                                pixelRatio: 2
                            }
                        }
                    },
                    tooltip: {},
                    xAxis: {
                        data: [],
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                    },
                    series: [{
                        name: 'cpu占用率',
                        type: 'line',
                        data: [],
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        animationDelay: function (idx) {
                            return idx * 10;
                        }
                    }, {
                        name: '内存使用率',
                        type: 'line',
                        data: [],
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        animationDelay: function (idx) {
                            return idx * 10 + 100;
                        }
                    },],
                    animationEasing: 'elasticOut',
                    animationDelayUpdate: function (idx) {
                        return idx * 5;
                    }
                }
            }
        },
        methods:{
            postWebSizeAdvice() {
                let postData = {
                    advice: this.blogAdviseEditor
                };
                settingsApi.postWebSizeAdvice(postData)
                .then(res=>{
                    if (res.data.code === settingsApi.success_code()) {
                        console.log(res.data.message);
                        this.blogAdviseEditor = '';
                        this.getWebSizeAdvice();
                    }
                })
            },
            getWebSizeAdvice() {
                settingsApi.getWebSizeAdvice()
                .then(resolve=>{
                    if (resolve.data.code === settingsApi.success_code()) {
                        this.blogAdvise = resolve.data.data.data;
                    }
                })
            },
            changeMonitor() {
                if (this.monitorChange === '停止监测') {
                    this.monitorChange = '开始监测';
                    clearInterval(this.interval);
                    this.interval = '';
                }else if (this.monitorChange === '开始监测') {
                    this.monitorChange = '停止监测';
                    this.interval = setInterval(this.intervalFunction, 3000);
                }
            },
            getSystemMonitorData() {
                userApi.getSystemMonitorData()
                    .then(resolve => {
                        console.log(resolve);
                        if (resolve.data.code === userApi.success_code()) {
                            this.cpu = resolve.data.data.data.cpu;
                            this.memory = resolve.data.data.data.memory;
                            let disksMap = resolve.data.data.data.disks;
                            if (!this.isDisksDataInit) {
                                for (let name in disksMap) {
                                    this.disks.push({
                                        name: name,
                                        disk: Number(disksMap[name])
                                    });
                                }
                            }

                            console.log(this.disks);
                        }
                    });
            },
            showChart() {
                this.initChartData()

                this.setChart()
            },

            // 准备图表数据
            initChartData() {
                if (!this.isDisksDataInit) {
                    Date.prototype.Format = function (fmt) {
                        var o = {
                            "M+": this.getMonth() + 1, //月份
                            "d+": this.getDate(), //日
                            "H+": this.getHours(), //小时
                            "m+": this.getMinutes(), //分
                            "s+": this.getSeconds(), //秒
                            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                            "S": this.getMilliseconds() //毫秒
                        };
                        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                        for (var k in o)
                            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                        return fmt;
                    }
                }


                let internalFunction = () => {
                    var time = new Date().Format("HH:mm:ss");
                    if (this.chartsOption.xAxis.data.length >= 6) {
                        this.chartsOption.xAxis.data.shift();
                    }
                    this.chartsOption.xAxis.data.push(time);

                    if (!this.isDisksDataInit) {
                    } else {
                        this.getSystemMonitorData();
                    }

                    if (this.chartsOption.series[0].data.length >= 6) {
                        this.chartsOption.series[0].data.shift();
                    }
                    this.chartsOption.series[0].data.push(this.cpu);
                    if (this.chartsOption.series[1].data.length >= 6) {
                        this.chartsOption.series[1].data.shift();
                    }

                    this.chartsOption.series[1].data.push(this.memory);

                    for (let i = 0; i < this.disks.length; i++) {
                        if (!this.isDisksDataInit) {
                            let diskItem = {
                                name: this.disks[i].name + '占用率',
                                type: 'bar',
                                data: [],
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                                animationDelay: function (idx) {
                                    return idx * 10 + 100;
                                }
                            };
                            this.chartsOption.series.push(diskItem);
                        }
                        if (this.chartsOption.series[i + 2].data.length >= 6) {
                            this.chartsOption.series[i + 2].data.shift();
                        }
                        this.chartsOption.series[i + 2].data.push(this.disks[i].disk);
                    }

                    if (!this.isDisksDataInit)
                        this.isDisksDataInit = true;

                    this.setChart()
                };

                if (this.isMounted) {
                    let testData = setInterval(internalFunction, 3000);

                    this.interval = testData;
                    this.intervalFunction = internalFunction;
                    this.isMounted = false;
                }

            },

            // 设置图标参数
            setChart() {
                // 基于准备好的dom，初始化echarts实例
                this.chart = echarts.init(document.getElementById('chart'))
                // console.log(this.chart)

                // 指定图表的配置项和数据


                this.chart.setOption(this.chartsOption);
            }
        },
        //调用
        mounted(){
            this.getSystemMonitorData();
            this.$nextTick(function () {
                this.showChart()
            });
            this.getWebSizeAdvice();
        },
        beforeDestroy() {
            if (this.monitorChange === '停止监测') {

                clearInterval(this.interval);
            }
        }

    }
</script>

<style lang="less">
    .system-monitor-box {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }
    .index-advise-content {
        border-radius: 4px;
        width: 100%;
        background-color: #fff;
    }
    #chart{
        width: 100%;
    }
    .index-part-box{
        padding: 2rem;
    }

</style>