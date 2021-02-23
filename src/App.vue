<template>
    <div id="app">

<!--        <head>-->
<!--            <meta charset="UTF-8"/>-->
<!--            <meta name="viewport"-->
<!--                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0"/>-->
<!--        </head>-->
        <router-view/>
    </div>
</template>
<script>
    export default {
        name: 'app',
        created() {
            // setTimeout(() => {
            //     window.L2Dwidget.init({
            //         pluginRootPath: "live2dw/",
            //         pluginJsPath: "lib/",
            //         pluginModelPath: "sagiri/",
            //         // pluginModelPath: "live2d-widget-model-koharu/assets/",
            //         tagMode: false,
            //         debug: false,
            //         model: {
            //             jsonPath: "../live2dw/sagiri/sagiri.model.json"
            //             // jsonPath: "../live2dw/live2d-widget-model-koharu/assets/koharu.model.json"
            //         },
            //         display: { position: "right", width: 200, height: 400 },
            //         mobile: { show: false },
            //         log: false,
            //     });
            //     console.log(window.L2Dwidget)
            //
            // }, 1000);
        }
    }
</script>
<style lang="less">
*{
    padding: 0;
    margin: 0;
}


</style>
