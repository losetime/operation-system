import React, { useState, useEffect, useRef } from 'react'
import 'react-photo-view/dist/index.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/common/amapDistrict.less'
import { Modal, Form, Select, AutoComplete, message, Button, Input, Space, Spin } from 'antd'
import AMapLoader from '@amap/amap-jsapi-loader'
import { AMAP_KEY } from '@/enums/pluginEnum'

const AmapDistrict = (props) => {
  // 父组件传值
  const { province, city, county, address, latItude, longItude, isEdit, allowRange, getMapInfo } = props

  const { Option } = Select
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  const [antdForm] = Form.useForm()
  const [AMap, setAMap] = useState(null)
  const [map, setMap] = useState(null)
  const [polygons, setPolygons] = useState([])
  const [provinceOptions, setProvinceOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [countyOptions, setCountyOptions] = useState([])
  const [mapInfo, setMapInfo] = useState({})
  const markerRef = useRef(null)
  const circleVector = useRef(null)
  const [completeOptions, setCompleteOptions] = useState([])
  const [placeSearch, setPlaceSearch] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (props.addressMapDialogStatus) {
      if (province && city && county) {
        setMapInfo({
          province,
          city,
          county,
          address,
          latItude,
          longItude,
          allowRange,
        })
      } else {
        setMapInfo({
          province: '610000',
          city: '610800',
          county: '610881',
          address: '',
        })
      }
      initMap()
    }
  }, [props.addressMapDialogStatus])

  useEffect(() => {
    antdForm.setFieldsValue(mapInfo)
    const { province, city, county, address } = mapInfo
    if (address) {
      return
    } else if (county) {
      onDistrictSearch(county, 'county', true)
    } else if (city) {
      onDistrictSearch(city, 'city', true)
    } else if (province) {
      onDistrictSearch(province, 'province', true)
    }
  }, [mapInfo])

  useEffect(() => {
    loadMapInfo()
  }, [map])

  const initMap = () => {
    AMapLoader.load({
      key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.DistrictSearch', 'AMap.Geocoder', 'AMap.PlaceSearch'], //插件列表
    })
      .then((AMap) => {
        setAMap(AMap)
        let map = new AMap.Map('container', {
          zoom: 12, //级别
          center: [116.397428, 39.90923], //中心点坐标
        })
        setMap(map)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // 初始化加载地图信息
  const loadMapInfo = async () => {
    const { province, city, county, latItude, longItude, allowRange } = mapInfo
    await onDistrictSearch('100000', 'country', false)
    if (province) {
      await onDistrictSearch(province, 'province', false)
    }
    if (city) {
      await onDistrictSearch(city, 'city', false)
    }
    if (county) {
      await onDistrictSearch(county, 'county', true)
    }
    if (longItude && latItude) {
      await addMarker(longItude, latItude)
      if (allowRange) {
        await addCircleRange(longItude, latItude)
      }
    }
  }

  // 监听Form表单
  const onValuesChange = (changedFields, allFields) => {
    const key = Object.keys(changedFields)[0]
    switch (key) {
      case 'province':
        setMapInfo({ ...allFields, city: '', county: '', address: '' })
        setCityOptions([])
        setCountyOptions([])
        break
      case 'city':
        setMapInfo({ ...allFields, county: '', address: '' })
        setCountyOptions([])
        break
      case 'county':
        setMapInfo({ ...allFields, address: '' })
        break
      case 'address':
        if (markerRef.current) {
          map.remove(markerRef.current)
        }
        if (circleVector.current) {
          map.remove(circleVector.current)
        }
        setMapInfo({ ...allFields, latItude: '', longItude: '' })
        break
      default:
        setMapInfo({ ...allFields })
    }
  }

  // 行政区查询
  const onDistrictSearch = (adcode, type, isDraw) => {
    if (map === null) return
    return new Promise((resolve, reject) => {
      if (markerRef.current) {
        map.remove(markerRef.current)
      } // 清除marker
      if (circleVector.current) {
        map.remove(circleVector.current)
      } // 清除圆形矢量
      // 清除旧的行政边界
      for (let i = 0, l = polygons.length; i < l; i++) {
        polygons[i].setMap(null)
      }
      let district = new AMap.DistrictSearch({
        extensions: isDraw ? 'all' : 'base',
        subdistrict: 1, //返回下一级行政区
        showbiz: false, //最后一级返回街道信息
      })
      if (adcode && type) {
        setLoading(true)
        district.search(adcode, function (status, result) {
          if (status === 'complete') {
            let districtList = result.districtList[0].districtList
            const bounds = result.districtList[0].boundaries
            switch (type) {
              case 'country':
                setProvinceOptions(sortDistrictList(districtList, '610000'))
                break
              case 'province':
                setCityOptions(sortDistrictList(districtList, '610800'))
                if (isDraw) {
                  setCountyOptions([])
                }
                break
              case 'city':
                setCountyOptions(sortDistrictList(districtList, '610881'))
                break
              case 'county':
                creatPlaceSearchObj(adcode)
                break
              default:
                break
            }
            if (isDraw) {
              drawDistrictboundary(bounds)
            }
            resolve()
          } else {
            reject()
          }
        })
      }
    })
  }

  // 省市区列表排序
  const sortDistrictList = (districtList, adcode) => {
    const index = districtList.findIndex((val) => val.adcode === adcode)
    if (index === -1) {
      return districtList
    } else {
      districtList.unshift(districtList[index])
      districtList.splice(index + 1, 1)
      return districtList
    }
  }

  // 绘制行政边界
  const drawDistrictboundary = (bounds) => {
    let polygons = []
    if (bounds) {
      for (let i = 0, l = bounds.length; i < l; i++) {
        let polygon = new AMap.Polygon({
          map: map,
          strokeWeight: 1,
          strokeColor: '#0091ea',
          fillColor: '#80d8ff',
          fillOpacity: 0.2,
          path: bounds[i],
        })
        polygon.on('click', getDistrictInfo)
        polygons.push(polygon)
      }
      setPolygons(polygons)

      map.setFitView() //地图自适应
      setLoading(false)
    }
  }

  // 获取行政信息
  const getDistrictInfo = (e) => {
    antdForm
      .validateFields(['province', 'city', 'county'])
      .then(() => {
        const lng = e.lnglat.getLng().toString()
        const lat = e.lnglat.getLat().toString()
        addMarker(lng, lat)
        if (mapInfo.allowRange) {
          addCircleRange(lng, lat)
        }
        getDetailAddress(lng, lat)
      })
      .catch(() => {
        console.log('信息不完整')
      })
  }

  // 添加marker
  const addMarker = (lng, lat) => {
    return new Promise((resolve) => {
      if (markerRef.current) {
        map.remove(markerRef.current)
      }
      markerRef.current = new AMap.Marker({
        icon: '//webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: [lng, lat],
        offset: new AMap.Pixel(-13, -30),
      })
      markerRef.current.setMap(map)
      resolve()
    })
  }

  // 设置矢量圆形
  const addCircleRange = (lng, lat) => {
    if (circleVector.current) {
      map.remove(circleVector.current)
    }
    return new Promise((resolve) => {
      circleVector.current = new AMap.Circle({
        center: new AMap.LngLat(lng, lat), // 圆心位置
        radius: mapInfo.allowRange, //半径
        strokeColor: '#F33', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: '#ee2200', //填充颜色
        fillOpacity: 0.35, //填充透明度
      })
      circleVector.current.setMap(map)
      resolve()
    })
  }

  // 获取具体信息
  const getDetailAddress = (lng, lat) => {
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all',
    })
    setLoading(true)
    geocoder.getAddress([lng, lat], function (status, result) {
      setLoading(false)
      if (status === 'complete' && result.info === 'OK') {
        let tempAddress = {
          ...mapInfo,
          address: result.regeocode.formattedAddress,
          longItude: lng,
          latItude: lat,
        }
        setMapInfo(tempAddress)
      } else {
        message.warn('获取详细地址出错，请重试')
      }
    })
  }

  // 创建搜索地址对象
  const creatPlaceSearchObj = (city) => {
    if (AMap === null) return
    let placeSearch = new AMap.PlaceSearch({
      city: city,
      citylimit: true,
    }) //构造地点查询类
    setPlaceSearch(placeSearch)
  }

  // 设置AutoComplete选项
  const onSearchComplete = (val) => {
    if (placeSearch === null) return
    placeSearch.search(val, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        let options = result.poiList.pois.map((val) => {
          return val.address
            ? {
                value: `${val.name}(${val.address})`,
                location: val.location,
                key: val.id,
              }
            : { value: val.name, location: val.location, key: val.id }
        })
        setCompleteOptions(options)
      }
    })
  }

  // AutoComplete选择地址
  const onSelectComplete = (val, option) => {
    if (markerRef.current) {
      map.remove(markerRef.current)
    }
    const lng = option.location.lng.toString()
    const lat = option.location.lat.toString()
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all',
    })
    geocoder.getAddress([lng, lat], function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        if (result.regeocode.addressComponent.adcode === mapInfo.county) {
          let tempAddress = {
            ...mapInfo,
            address: val,
            longItude: lng,
            latItude: lat,
          }
          setMapInfo(tempAddress)
          addMarker(lng, lat)
          if (mapInfo.allowRange) {
            addCircleRange(lng, lat)
          }
        } else {
          message.warn('所选地址不在当前区域, 请重新选择')
          antdForm.setFieldsValue({ ...mapInfo, address: '' })
        }
      }
    })
  }

  // diglog确定
  const handleOk = () => {
    antdForm
      .validateFields(['province', 'city', 'county', 'address'])
      .then(() => {
        if (mapInfo.longItude && mapInfo.latItude) {
          if (getMapInfo) {
            getMapInfo(mapInfo)
          }
          handleCancel()
        } else {
          message.warn('该详细地址坐标不存在，请重新选择')
        }
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  // dialog取消
  const handleCancel = () => {
    map.clearMap()
    setMapInfo({})
    setLoading(false)
    antdForm.resetFields()
    props.actions.setAddressMapDialogStatus(false)
  }

  return (
    <Modal
      cancelText={'取消'}
      destroyOnClose
      keyboard={false}
      footer={null}
      forceRender
      getContainer={false}
      maskClosable={false}
      onCancel={handleCancel}
      title={'详细地址'}
      visible={props.addressMapDialogStatus}
      width={1180}
    >
      {loading ? (
        <div className='loading-wrap'>
          <div className='loading'>
            <Spin tip='Loading...' />
          </div>
        </div>
      ) : null}
      <div className='address-select-wrap'>
        <Form {...layout} autoComplete='off' form={antdForm} name='form' onValuesChange={onValuesChange}>
          <Form.Item colon={false} name='province' rules={[{ required: true, message: '请输入省' }]}>
            <Select placeholder='省'>
              {provinceOptions.map((val) => (
                <Option key={val.adcode}>{val.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='city' rules={[{ required: true, message: '请输入市' }]}>
            <Select placeholder='市'>
              {cityOptions.map((val) => (
                <Option key={val.adcode}>{val.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='county' rules={[{ required: true, message: '请输入区' }]}>
            <Select placeholder='区/县'>
              {countyOptions.map((val) => (
                <Option key={val.adcode}>{val.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='address' rules={[{ required: true, message: '请输入详细地址' }]}>
            <AutoComplete
              onSearch={onSearchComplete}
              onSelect={onSelectComplete}
              options={completeOptions}
              placeholder='详细地址'
            >
              {completeOptions.map((val) => (
                <Option key={val.key} value={val.value}></Option>
              ))}
            </AutoComplete>
          </Form.Item>
          {mapInfo.allowRange ? (
            <Form.Item
              colon={false}
              label='允许范围(米)'
              labelCol={{ span: 12 }}
              name='allowRange'
              rules={[{ required: true, message: '请输入允许范围' }]}
              wrapperCol={{ span: 12 }}
            >
              <Input />
            </Form.Item>
          ) : null}
        </Form>
        {isEdit === false ? (
          <div className='map-handle'>
            <Button key='关闭' onClick={handleCancel} type='primary'>
              关闭
            </Button>
          </div>
        ) : (
          <div className='map-handle'>
            <Space>
              <Button key='取消' onClick={handleCancel}>
                取消
              </Button>
              ,
              <Button key='确定' onClick={handleOk} type='primary'>
                确定
              </Button>
            </Space>
          </div>
        )}
        <div className='map-handle'></div>
      </div>
      <div id='container' style={{ width: '100%', height: '500px' }}></div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    addressMapDialogStatus: state.addressMapDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(AmapDistrict)
