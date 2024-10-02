<template>
    <div id="container"></div>
</template>

<script setup>
import * as Highcharts from 'highcharts/highcharts-gantt.src.js'

onMounted(() => {
    var chart = document.getElementById('container')
    if (chart) {
        Highcharts.chart('container', {
            chart: {
                type: 'xrange'
            },
            title: {
                text: '简易甘特图'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    week: '%Y/%m/%d'
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                categories: ['制作产品原型', '开发', '测试'],
                reversed: true
            },
            tooltip: {
                dateTimeLabelFormats: {
                    day: '%Y/%m/%d'
                }
            },
            series: [{
                name: '项目1',
                // pointPadding: 0,
                // groupPadding: 0,
                borderColor: 'gray',
                pointWidth: 20,
                data: [{
                    x: Date.UTC(2014, 10, 21),
                    x2: Date.UTC(2014, 11, 2),
                    y: 0,
                    partialFill: 0.25
                }, {
                    x: Date.UTC(2014, 11, 2),
                    x2: Date.UTC(2014, 11, 5),
                    y: 1
                }, {
                    x: Date.UTC(2014, 11, 8),
                    x2: Date.UTC(2014, 11, 9),
                    y: 2
                }, {
                    x: Date.UTC(2014, 11, 9),
                    x2: Date.UTC(2014, 11, 19),
                    y: 1
                }, {
                    x: Date.UTC(2014, 11, 10),
                    x2: Date.UTC(2014, 11, 23),
                    y: 2
                }],
                dataLabels: {
                    enabled: true
                }
            }]
        });
    }

})


</script>

<style scoped>
#container {
    min-width: 300px;
    max-width: 800px;
    height: 300px;
    margin: 1em auto;
}
</style>
