<template>
    <div class="profile-page">
        <div class="profile-header-card">
            <div class="avatar-container">
                <img :src="user.avatar" :alt="user.name" class="profile-avatar" />
            </div>
            <div class="user-details">
                <h1 class="user-name">{{ user.name }}</h1>
                <p class="user-bio">探索、创造、分享。一个记录技术思考与生活灵感的空间。</p>
                <div class="user-stats">
                    <div class="stat-item">
                        <span class="stat-value">128</span>
                        <span class="stat-label">文章</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">1.2k</span>
                        <span class="stat-label">关注者</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">345</span>
                        <span class="stat-label">正在关注</span>
                    </div>
                </div>
            </div>
            <div class="profile-actions">
                <button class="action-btn primary">编辑个人资料</button>
                <button class="action-btn">账号设置</button>
            </div>
        </div>

        <div class="data-dashboard">
            <h2 class="dashboard-title">数据仪表盘</h2>
            <div class="charts-grid">
                <div class="chart-card" ref="visitsChartRef"></div>
                <div class="chart-card" ref="likesChartRef"></div>
                <div class="chart-card" ref="viewsChartRef"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCounterStore } from '@/stores/counter'
import echarts from 'echarts'
import gsap from 'gsap'

const store = useCounterStore()

const user = {
    name: '张三',
    avatar: '/src/assets/images/default/light.png',
}

const visitsChartRef = ref<HTMLElement | null>(null)
const likesChartRef = ref<HTMLElement | null>(null)
const viewsChartRef = ref<HTMLElement | null>(null)

let visitsChart: echarts.ECharts | null = null;
let likesChart: echarts.ECharts | null = null;
let viewsChart: echarts.ECharts | null = null;

const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return `${d.getMonth() + 1}-${d.getDate()}`
}).reverse()

const visitsData = [150, 230, 224, 218, 135, 147, 260]
const likesData = [80, 92, 91, 94, 129, 130, 110]
const viewsData = [820, 932, 901, 934, 1290, 1330, 1320]

// **核心改动：让 ECharts 配置函数能接收 CSS 变量值**
const getBaseChartOption = (
    title: string,
    data: number[],
    themeColors: { [key: string]: string }
): echarts.EChartsOption => {

    const primaryColorRGB = gsap.utils.splitColor(themeColors.primary).join(',');
    const colorStops = [
        { offset: 0, color: `rgba(${primaryColorRGB}, 0.5)` },
        { offset: 1, color: `rgba(${primaryColorRGB}, 0)` }
    ];

    return {
        title: { text: title, textStyle: { color: themeColors.text } },
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: last7Days,
            axisLine: { lineStyle: { color: themeColors.textSecondary } },
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: themeColors.textSecondary } },
            splitLine: { lineStyle: { color: themeColors.dropdownBorder } },
        },
        series: [{
            name: title,
            type: 'line',
            smooth: true,
            data: data,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: { color: themeColors.primary },
            lineStyle: { width: 3 },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, colorStops)
            }
        }]
    };
}

const initOrUpdateCharts = () => {
    // **核心改动：在函数内部实时获取最新的 CSS 变量**
    const computedStyle = getComputedStyle(document.documentElement);
    const themeColors = {
        primary: computedStyle.getPropertyValue('--primary-color').trim(),
        text: computedStyle.getPropertyValue('--text-color').trim(),
        textSecondary: computedStyle.getPropertyValue('--text-color-secondary').trim(),
        dropdownBorder: computedStyle.getPropertyValue('--dropdown-border-color').trim(),
    };

    const chartConfigs = [
        { ref: visitsChartRef, instance: visitsChart, title: '近7天访问量', data: visitsData },
        { ref: likesChartRef, instance: likesChart, title: '近7天点赞量', data: likesData },
        { ref: viewsChartRef, instance: viewsChart, title: '近7天作品浏览量', data: viewsData },
    ];

    chartConfigs.forEach((config, index) => {
        if (config.ref.value) {
            // 如果实例不存在，则初始化；如果存在，则直接使用
            let chart = config.instance;
            if (!chart) {
                chart = echarts.init(config.ref.value);
                // 将新实例存回
                if (index === 0) visitsChart = chart;
                if (index === 1) likesChart = chart;
                if (index === 2) viewsChart = chart;
            }
            chart.setOption(getBaseChartOption(config.title, config.data, themeColors), true); // `true` 表示不与旧配置合并
        }
    });
}


const handleResize = () => {
    visitsChart?.resize()
    likesChart?.resize()
    viewsChart?.resize()
}

// **核心改动：watch 侦听器现在变得更简单**
watch(() => store.theme, () => {
    // 主题变化时，只需调用同一个函数，它会获取到最新的颜色并重绘图表
    initOrUpdateCharts();
});

onMounted(() => {
    // 首次挂载时，等待一小段时间确保 CSS 变量已应用，然后初始化
    setTimeout(() => {
        initOrUpdateCharts();
        window.addEventListener('resize', handleResize);
    }, 100);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    visitsChart?.dispose()
    likesChart?.dispose()
    viewsChart?.dispose()
})
</script>


<style scoped lang="scss">
/* 样式部分完全保持不变 */
.profile-page {
    max-width: 960px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.profile-header-card {
    background-color: var(--card-bg-color);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    box-shadow: var(--card-shadow);
}

.avatar-container {
    flex-shrink: 0;
}

.profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid var(--primary-color);
    object-fit: cover;
    box-shadow: 0 4px 15px rgba(var(--primary-color), 0.2);
}

.user-details {
    flex-grow: 1;
}

.user-name {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
}

.user-bio {
    font-size: 1rem;
    color: var(--text-color-secondary);
    margin: 0 0 1.5rem 0;
    max-width: 500px;
}

.user-stats {
    display: flex;
    gap: 2rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
}

.stat-label {
    font-size: 0.875rem;
    color: var(--text-color-secondary);
}

.profile-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.action-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: 1px solid transparent;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn.primary {
    background-color: var(--primary-color);
    color: white;
}

.action-btn:not(.primary) {
    background-color: transparent;
    border-color: var(--dropdown-border-color);
    color: var(--text-color);
}

.action-btn:not(.primary):hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.data-dashboard {
    background-color: var(--card-bg-color);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: var(--card-shadow);
}

.dashboard-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: var(--text-color);
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.chart-card {
    width: 100%;
    height: 300px;
}

@media (max-width: 768px) {
    .profile-header-card {
        flex-direction: column;
        text-align: center;
    }

    .user-stats {
        justify-content: center;
    }

    .profile-actions {
        flex-direction: row;
        width: 100%;
        justify-content: center;
    }

    .profile-actions .action-btn {
        flex-grow: 1;
    }
}
</style>
