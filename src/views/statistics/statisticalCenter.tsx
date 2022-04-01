import React, { FC, useState, useEffect, useContext } from 'react'
import { Button, DatePicker, Tooltip } from 'antd'
import '@/style/statistics/statisticalCenter.less'
import * as echarts from 'echarts'
import {
  apiGetStatisticalData,
  apiGetDataOverview,
  apiGetSourceOfWaybill,
  apiGetWaybillDataStatistics,
  apiGetVehiclesAndDrivers,
} from '@/service/api/statistics'
import { getCurrentWeek, getCurrentMonth } from '@/utils/base'
import context from '@/store/context'

const StatisticalCenter: FC = () => {
  const { setGlobalLoading } = useContext(context)
  const [dataOverview, setDataOverview] = useState<any>({})
  const [sourceOfWaybill, setSourceOfWaybill] = useState<any>({})
  const [waybillDataStatistics, setWaybillDataStatistics] = useState<any>({})
  const [vehiclesAndDrivers, setVehiclesAndDrivers] = useState<any>({})
  const [overviewActive, setOverviewActive] = useState(1)
  const [sourceActive, setSourcewActive] = useState(1)
  const [dataActive, setDataActive] = useState(1)
  const [addedActive, setAddedActive] = useState(1)
  const [charts, setCharts] = useState<any>({
    chart1: null,
    chart2: null,
    chart3: null,
  })
  const [timeRange, setTimeRange] = useState({
    startTime: '',
    endTime: '',
  })
  const [searchType, setSearchType] = useState(0)
  const grid = {
    left: '3%',
    right: '4%',
    bottom: '12%',
    top: '10%',
    containLabel: true,
  }
  const toolbox = {
    feature: {
      dataView: { show: true, title: '数据视图', lang: ['数据视图', '关闭', '刷新'] },
      magicType: { show: true, title: { line: '切换为折线图', bar: '切换为柱状图' }, type: ['line', 'bar'] },
      restore: { show: true, title: '刷新' },
      saveAsImage: { show: true, title: '保存为图片' },
    },
    itemGap: 15,
    bottom: '2%',
    right: '2%',
  }
  const dataZoom = [
    {
      type: 'inside',
    },
  ]

  useEffect(() => {
    const currentWeek = getCurrentWeek()
    apiGetStatisticalData({
      startTime: currentWeek[0],
      endTime: currentWeek[1],
    }).then((res) => {
      if (res.code === 0) {
        const result = res.data
        setDataOverview(result.dataOverview)
        setSourceOfWaybill(result.sourceOfWaybill)
        setWaybillDataStatistics(result.waybillDataStatistics)
        setVehiclesAndDrivers(result.vehiclesAndDrivers)
      }
    })
    const chartDom1 = document.getElementById('waybill-source-chart')
    const chart1 = echarts.init(chartDom1 as HTMLElement)
    const chartDom2 = document.getElementById('waybill-data-chart')
    const chart2 = echarts.init(chartDom2 as HTMLElement)
    const chartDom3 = document.getElementById('added-chart')
    const chart3 = echarts.init(chartDom3 as HTMLElement)
    setCharts({
      chart1,
      chart2,
      chart3,
    })
  }, [])

  useEffect(() => {
    const { chart1, chart2, chart3 } = charts
    if (chart1 && chart2 && chart3) {
      setWaybillSourceChart()
      setWaybillDataChart()
      setAddedChart()
    }
  }, [charts, dataOverview, sourceOfWaybill, waybillDataStatistics, vehiclesAndDrivers])

  useEffect(() => {
    window.onresize = () => {
      for (const key in charts) {
        charts[key].resize()
      }
    }
  }, [charts])

  const getDataOverview = (sType: number, timeRange: any) => {
    setGlobalLoading(true)
    apiGetDataOverview({
      dataType: sType,
      ...timeRange,
    }).then((res) => {
      setGlobalLoading(false)
      if (res.code === 0) {
        setDataOverview(res.data)
      }
    })
  }
  const getSourceOfWaybill = (sType: number, timeRange: any) => {
    setGlobalLoading(true)
    apiGetSourceOfWaybill({
      dataType: sType,
      ...timeRange,
    }).then((res) => {
      setGlobalLoading(false)
      if (res.code === 0) {
        setSourceOfWaybill(res.data)
      }
    })
  }
  const getWaybillDataStatistics = (sType: number, timeRange: any) => {
    setGlobalLoading(true)
    apiGetWaybillDataStatistics({
      dataType: sType,
      ...timeRange,
    }).then((res) => {
      setGlobalLoading(false)
      if (res.code === 0) {
        setWaybillDataStatistics(res.data)
      }
    })
  }
  const getVehiclesAndDrivers = (sType: number, timeRange: any) => {
    setGlobalLoading(true)
    apiGetVehiclesAndDrivers({
      dataType: sType,
      ...timeRange,
    }).then((res) => {
      setGlobalLoading(false)
      if (res.code === 0) {
        setVehiclesAndDrivers(res.data)
      }
    })
  }

  const setWaybillSourceChart = () => {
    const color = ['#EF7950', '#4998F7', '#66BF8D', '#4881F7', '#1c2583', '#e0b836', '#5DD1EF']
    const { chartData, createdAt } = sourceOfWaybill
    const series = chartData
      ? chartData.map((val: any, index: number) => {
          return {
            name: val.name,
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: color[index],
            },
            data: val.data,
          }
        })
      : []
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: series.map((val: any) => val.name),
      },
      grid: grid,
      toolbox: toolbox,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: createdAt,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
        },
      },
      dataZoom: dataZoom,
      series: series,
    }
    charts.chart1.setOption(option, true)
  }

  const setWaybillDataChart = () => {
    const color = ['#EE7950', '#4897F7', '#e0b836', '#67BF8D', '#6f58ab']
    const { chartData, createdAt } = waybillDataStatistics
    const series = chartData
      ? chartData.map((val: any, index: number) => {
          if (['已完成运单总数', '已支付运单总数'].includes(val.name)) {
            return {
              name: val.name,
              type: 'bar',
              barGap: 0,
              itemStyle: {
                color: color[index],
              },
              data: val.data,
            }
          } else {
            return {
              name: val.name,
              type: 'line',
              yAxisIndex: 1,
              showSymbol: false,
              itemStyle: {
                color: color[index],
              },
              data: val.data,
            }
          }
        })
      : []
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: series.map((val: any) => val.name),
      },
      grid: grid,
      toolbox: toolbox,
      xAxis: {
        type: 'category',
        data: createdAt,
      },
      yAxis: [
        {
          type: 'value',
          name: '运单数',
          position: 'left',
          axisLine: {
            show: true,
          },
        },
        {
          type: 'value',
          name: '金额(元)',
          position: 'right',
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value} 万',
          },
        },
      ],
      dataZoom: dataZoom,
      series: series,
    }
    charts.chart2.setOption(option, true)
  }

  const setAddedChart = () => {
    const color = ['#4897F7', '#EE7950']
    const { chartData, createdAt } = vehiclesAndDrivers
    const series = chartData
      ? chartData.map((val: any, index: number) => {
          return {
            name: val.name,
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: color[index],
            },
            data: val.data,
          }
        })
      : []
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: series.map((val: any) => val.name),
      },
      grid: grid,
      toolbox: toolbox,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: createdAt,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
        },
      },
      dataZoom: dataZoom,
      series: series,
    }
    charts.chart3.setOption(option, true)
  }

  // 点击本周或本月
  const onMouthOrWeekBtn = (sType: number, timeType: number): void => {
    let currentTimeRange: string[] = []
    if (timeType === 1) {
      currentTimeRange = getCurrentWeek()
    } else {
      currentTimeRange = getCurrentMonth()
    }
    const timeRange = {
      startTime: currentTimeRange[0],
      endTime: currentTimeRange[1],
    }
    switch (sType) {
      case 1:
        setOverviewActive(timeType)
        getDataOverview(sType, timeRange)
        break
      case 2:
        setSourcewActive(timeType)
        getSourceOfWaybill(sType, timeRange)
        break
      case 3:
        setDataActive(timeType)
        getWaybillDataStatistics(sType, timeRange)
        break
      case 4:
        setAddedActive(timeType)
        getVehiclesAndDrivers(sType, timeRange)
        break
    }
  }

  // 监听时间选择器
  const onDatePicker = (sType: number, timeType: string, value: any) => {
    let temp: any = {}
    if (sType === searchType) {
      temp = { ...timeRange }
    } else {
      temp = {
        startTime: '',
        endTime: '',
      }
    }
    temp[timeType] = value.format('YYYY-MM-DD')
    setTimeRange(temp)
    setSearchType(sType)
  }

  // 查询按钮
  const handleSearchBtn = () => {
    const { startTime, endTime } = timeRange
    if (startTime && endTime) {
      switch (searchType) {
        case 1:
          getDataOverview(searchType, timeRange)
          setOverviewActive(0)
          break
        case 2:
          getSourceOfWaybill(searchType, timeRange)
          setSourcewActive(0)
          break
        case 3:
          getWaybillDataStatistics(searchType, timeRange)
          setDataActive(0)
          break
        case 4:
          getVehiclesAndDrivers(searchType, timeRange)
          setAddedActive(0)
          break
      }
    }
  }

  const isExistKey = (obj: string[] | undefined, index: number): string => {
    if (obj !== undefined && Array.isArray(obj)) {
      return obj[index]
    } else {
      return '0'
    }
  }

  return (
    <div className='statistical-center-wrap'>
      <div className='statistical-item-wrap'>
        <div className='item-header'>
          <div className='header-title'>数据总概览</div>
          <div className='header-handle-wrap'>
            <div className='header-handle-item'>
              <div
                className={overviewActive === 1 ? 'handle-btn active' : 'handle-btn'}
                onClick={() => onMouthOrWeekBtn(1, 1)}
              >
                本周
              </div>
              <div
                className={overviewActive === 2 ? 'handle-btn active' : 'handle-btn'}
                onClick={() => onMouthOrWeekBtn(1, 2)}
              >
                本月
              </div>
            </div>
            <div className='header-handle-item'>
              <DatePicker
                size='middle'
                placeholder='时间【起】'
                onChange={(time) => {
                  onDatePicker(1, 'startTime', time)
                }}
              />
              <span>&nbsp;-&nbsp;</span>
              <DatePicker
                size='middle'
                placeholder='时间【止】'
                onChange={(time) => {
                  onDatePicker(1, 'endTime', time)
                }}
              />
              <Button type='link' className='search-btn' onClick={handleSearchBtn}>
                查询
              </Button>
            </div>
          </div>
        </div>
        <div className='data-overview-wrap'>
          <div className='data-overview-row'>
            <div className='data-overview-item'>
              <span className='data-label'>已认证货主总数</span>
              <span className='data-value'>{dataOverview.shipperCount}</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>已认证司机总数</span>
              <span className='data-value'>{dataOverview.driverCount}</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>已认证车辆总数</span>
              <span className='data-value'>{dataOverview.vehicleCount}</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>运单总数</span>
              <span className='data-value'>{dataOverview.transportCount}</span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“线上”运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>线上运单总数/占比[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(dataOverview.onlineTransport, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(dataOverview.onlineTransport, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“线下”运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>线下运单总数/占比[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(dataOverview.offlineTransport, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(dataOverview.offlineTransport, 1)}%</span>
              </span>
            </div>
          </div>
          <div className='data-overview-row'>
            <div className='data-overview-item'>
              <span className='data-label'>充值总额</span>
              <span className='data-value'>{dataOverview.rechargeCount}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>充值运费总额</span>
              <span className='data-value'>{dataOverview.rechargeFreightCount}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>充值服务费总额</span>
              <span className='data-value'>{dataOverview.rechargeServiceCount}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>垫资运费总额</span>
              <span className='data-value'>{dataOverview.advanceFreightCount}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>垫资服务费总额</span>
              <span className='data-value'>{dataOverview.advanceServiceCount}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>回款运费总额</span>
              <span className='data-value'>{dataOverview.collectionFreightCount}万</span>
            </div>
          </div>
          <div className='data-overview-row'>
            <div className='data-overview-item'>
              <span className='data-label'>回款服务费总额</span>
              <span className='data-value'>{dataOverview.collectionServiceCount}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>实付运费总额</span>
              <span className='data-value'>{dataOverview.totalFreightPaid}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>已支付实际运费总额</span>
              <span className='data-value'>{dataOverview.payAmountSum}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>已卸货总吨位</span>
              <span className='data-value'>{dataOverview.grossTonnageUnloaded}万吨</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>已开票含税总额</span>
              <span className='data-value'>{dataOverview.totalInvoicedAmount}万</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>已扣服务费总额</span>
              <span className='data-value'>{dataOverview.totalServiceCount}万</span>
            </div>
          </div>
        </div>
      </div>
      <div className='statistical-item-wrap'>
        <div className='item-header'>
          <div className='header-title'>运单来源统计</div>
          <div className='header-handle-wrap'>
            <div className='header-handle-item'>
              <div
                className={sourceActive === 1 ? 'handle-btn active' : 'handle-btn'}
                onClick={() => {
                  onMouthOrWeekBtn(2, 1)
                }}
              >
                本周
              </div>
              <div
                className={sourceActive === 2 ? 'handle-btn active' : 'handle-btn'}
                onClick={() => {
                  onMouthOrWeekBtn(2, 2)
                }}
              >
                本月
              </div>
            </div>
            <div className='header-handle-item'>
              <DatePicker
                size='middle'
                placeholder='时间【起】'
                onChange={(time) => {
                  onDatePicker(2, 'startTime', time)
                }}
              />
              <span>&nbsp;-&nbsp;</span>
              <DatePicker
                size='middle'
                placeholder='时间【止】'
                onChange={(time) => {
                  onDatePicker(2, 'endTime', time)
                }}
              />
              <Button type='link' className='search-btn' onClick={handleSearchBtn}>
                查询
              </Button>
            </div>
          </div>
        </div>
        <div className='waybill-source-wrap'>
          <div className='data-overview-row'>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“APP 抢单”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>APP抢单[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(sourceOfWaybill.appOrder, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(sourceOfWaybill.appOrder, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“APP 扫码抢单”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>APP扫码抢单[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(sourceOfWaybill.appScanningOrder, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(sourceOfWaybill.appScanningOrder, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“小程序抢单”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>小程序抢单[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(sourceOfWaybill.wechatOrder, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(sourceOfWaybill.wechatOrder, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“小程序扫码抢单”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>小程序扫码抢单[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(sourceOfWaybill.wechatScanningOrder, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(sourceOfWaybill.wechatScanningOrder, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“货主APP创建”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>货主APP创建[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(sourceOfWaybill.appShipperCreate, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(sourceOfWaybill.appShipperCreate, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“货主PC创建”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>货主PC创建[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(sourceOfWaybill.shipperCreate, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(sourceOfWaybill.shipperCreate, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“货主PC导入”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>货主PC导入[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(sourceOfWaybill.shipperImport, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(sourceOfWaybill.shipperImport, 1)}%</span>
              </span>
            </div>
          </div>
          <div id='waybill-source-chart'></div>
        </div>
      </div>
      <div className='statistical-item-wrap'>
        <div className='item-header'>
          <div className='header-title'>运单数据统计</div>
          <div className='header-handle-wrap'>
            <div className='header-handle-item'>
              <div
                className={dataActive === 1 ? 'handle-btn active' : 'handle-btn'}
                onClick={() => {
                  onMouthOrWeekBtn(3, 1)
                }}
              >
                本周
              </div>
              <div
                className={dataActive === 2 ? 'handle-btn active' : 'handle-btn'}
                onClick={() => {
                  onMouthOrWeekBtn(3, 2)
                }}
              >
                本月
              </div>
            </div>
            <div className='header-handle-item'>
              <DatePicker
                size='middle'
                placeholder='时间【起】'
                onChange={(time) => {
                  onDatePicker(3, 'startTime', time)
                }}
              />
              <span>&nbsp;-&nbsp;</span>
              <DatePicker
                size='middle'
                placeholder='时间【止】'
                onChange={(time) => {
                  onDatePicker(3, 'endTime', time)
                }}
              />
              <Button type='link' className='search-btn' onClick={handleSearchBtn}>
                查询
              </Button>
            </div>
          </div>
        </div>
        <div className='waybill-data-wrap'>
          <div className='data-overview-row'>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“已完成运单总数”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>已完成运单总数[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(waybillDataStatistics.finishedTransportCount, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(waybillDataStatistics.finishedTransportCount, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：来源是“已支付运单总数”的运单总数 ÷ 所有运单总数 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>已支付运单总数[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(waybillDataStatistics.payAmountCount, 0)}/</span>
                <span className='value-custom-two'>{isExistKey(waybillDataStatistics.payAmountCount, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='数值：状态是“已完成运单”的运单，实付⾦额总和' color={'#FFFFFF'}>
                <span className='data-label'>应付实付运费总额[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{waybillDataStatistics.payableAmount}万</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='占⽐公式：状态是“已⽀付运单”的运单总⾦额 ÷ 应付实付运费总额 x 100%' color={'#FFFFFF'}>
                <span className='data-label'>已付实付运费总额[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{isExistKey(waybillDataStatistics.payAmount, 0)}万/</span>
                <span className='value-custom-two'>{isExistKey(waybillDataStatistics.payAmount, 1)}%</span>
              </span>
            </div>
            <div className='data-overview-item'>
              <Tooltip title='数值：状态是“已开票”的运单实付总⾦额' color={'#FFFFFF'}>
                <span className='data-label'>已开票实付总额[?]</span>
              </Tooltip>
              <span className='data-value'>
                <span className='value-custom-one'>{waybillDataStatistics.invoiceAmount}万</span>
              </span>
            </div>
          </div>
          <div id='waybill-data-chart'></div>
        </div>
      </div>
      <div className='statistical-item-wrap'>
        <div className='item-header'>
          <div className='header-title'>车辆、司机新增统计</div>
          <div className='header-handle-wrap'>
            <div className='header-handle-item'>
              <div
                className={addedActive === 1 ? 'handle-btn active' : 'handle-btn'}
                onClick={() => {
                  onMouthOrWeekBtn(4, 1)
                }}
              >
                本周
              </div>
              <div
                className={addedActive === 2 ? 'handle-btn active' : 'handle-btn'}
                onClick={() => {
                  onMouthOrWeekBtn(4, 2)
                }}
              >
                本月
              </div>
            </div>
            <div className='header-handle-item'>
              <DatePicker
                size='middle'
                placeholder='时间【起】'
                onChange={(time) => {
                  onDatePicker(4, 'startTime', time)
                }}
              />
              <span>&nbsp;-&nbsp;</span>
              <DatePicker
                size='middle'
                placeholder='时间【止】'
                onChange={(time) => {
                  onDatePicker(4, 'endTime', time)
                }}
              />
              <Button type='link' className='search-btn' onClick={handleSearchBtn}>
                查询
              </Button>
            </div>
          </div>
        </div>
        <div className='added-wrap'>
          <div className='data-overview-row'>
            <div className='data-overview-item'>
              <span className='data-label'>新增司机</span>
              <span className='data-value'>{vehiclesAndDrivers.insertDriver}</span>
            </div>
            <div className='data-overview-item'>
              <span className='data-label'>新增车辆</span>
              <span className='data-value'>{vehiclesAndDrivers.insertVehicle}</span>
            </div>
          </div>
          <div id='added-chart'></div>
        </div>
      </div>
    </div>
  )
}

export default StatisticalCenter
