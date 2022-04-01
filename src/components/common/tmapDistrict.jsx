/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react'
import 'react-photo-view/dist/index.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/common/amapDistrict.less'
import { Modal, Form, Select, AutoComplete, message, Button, Input, Space, Spin } from 'antd'
import { TMAP_KEY } from '@/enums/pluginEnum'
import fetchJsonp from 'fetch-jsonp'

const TmapDistrict = (props) => {
  // 父组件传值
  const { province, city, county, address, latItude, longItude, isEdit, allowRange, getMapInfo } = props

  const { Option } = Select
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  const [antdForm] = Form.useForm()
  const [map, setMap] = useState(null)
  const [provinceOptions, setProvinceOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [countyOptions, setCountyOptions] = useState([])
  const [mapInfo, setMapInfo] = useState({})
  const markerRef = useRef(null)
  const circleVector = useRef(null)
  const [completeOptions, setCompleteOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [multiPolygon, setMultiPolygon] = useState(null)

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
      let tiemout = setTimeout(() => {
        initMap()
        clearTimeout(tiemout)
      }, 200)
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
    setLoading(true)
    //定义地图中心点坐标
    let center = new TMap.LatLng(39.98412, 116.307484)
    //定义map变量，调用 TMap.Map() 构造函数创建地图
    let map = new TMap.Map(document.getElementById('container'), {
      center: center, //设置地图中心点坐标
      zoom: 17.2, //设置地图缩放级别
      viewMode: '2D',
    })
    setMap(map)
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
      await addMarker(latItude, longItude)
      if (allowRange) {
        await addCircleRange(latItude, longItude)
      }
    }
    setLoading(false)
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
          markerRef.current.setMap(null)
        }
        if (circleVector.current) {
          circleVector.current.setMap(null)
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
        markerRef.current.setGeometries([])
      } // 清除marker
      if (circleVector.current) {
        circleVector.current.setMap(null)
      } // 清除圆形矢量
      if (adcode && type) {
        if (type === 'country') {
          fetchJsonp(`//apis.map.qq.com/ws/district/v1/list?output=jsonp&key=${TMAP_KEY}`)
            .then((res) => {
              return res.json()
            })
            .then((resJson) => {
              if (resJson.status === 0) {
                const districtList = resJson.result[0]
                setProvinceOptions(sortDistrictList(districtList, '610000'))
                resolve()
              }
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          let districtList = []
          /**
           * 直辖市需要特殊处理
           * '110000' 北京市, '120000' 天津市, '310000' 上海市, '500000' 重庆市，
           */
          const directManangeArea = ['110000', '120000', '310000', '500000']
          fetchJsonp(`//apis.map.qq.com/ws/district/v1/getchildren?output=jsonp&id=${adcode}&key=${TMAP_KEY}`)
            .then((res) => {
              return res.json()
            })
            .then((resJson) => {
              if (resJson.status === 0) {
                districtList = resJson.result[0]
                fetchJsonp(
                  `//apis.map.qq.com/ws/district/v1/search?output=jsonp&keyword=${adcode}&get_polygon=2&key=${TMAP_KEY}`
                )
                  .then((res) => {
                    return res.json()
                  })
                  .then((resJson) => {
                    if (resJson.status === 0) {
                      const bounds = resJson.result[0][0].polygon[0]
                      switch (type) {
                        case 'province':
                          if (directManangeArea.includes(adcode)) {
                            setCityOptions([{ id: adcode, fullname: resJson.result[0][0].name + '城区' }])
                          } else {
                            setCityOptions(sortDistrictList(districtList, '610800'))
                          }
                          if (isDraw) {
                            setCountyOptions([])
                          }
                          break
                        case 'city':
                          setCountyOptions(sortDistrictList(districtList, '610881'))
                          break
                        default:
                          break
                      }
                      if (isDraw) drawDistrictboundary(bounds)
                      resolve()
                    }
                  })
                  .catch((err) => {
                    reject(err)
                  })
              }
            })
            .catch((err) => {
              reject(err)
            })
        }
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
    if (bounds.length > 0) {
      if (multiPolygon) {
        multiPolygon.setMap(null)
      }
      let latlngBounds = new TMap.LatLngBounds()
      for (let i = 0; i < bounds.length - 1; i = i + 2) {
        let polygon = new TMap.LatLng(bounds[i + 1], bounds[i])
        latlngBounds.extend(polygon)
        polygons.push(polygon)
      }
      const multiPolygonTemp = new TMap.MultiPolygon({
        map: map, //设置多边形图层显示到哪个地图实例中
        //多边形样式
        styles: {
          polygon: new TMap.PolygonStyle({
            color: 'rgba(37,160,235, 0.2)', //面填充色
            showBorder: true, //是否显示拔起面的边线
            borderColor: '#25A0EB', //边线颜色
          }),
        },
        //多边形数据
        geometries: [
          {
            id: 'p1', //该多边形在图层中的唯一标识（删除、更新数据时需要）
            styleId: 'polygon', //绑定样式名
            paths: polygons, //多边形轮廓
          },
        ],
      })
      setMultiPolygon(multiPolygonTemp)
      multiPolygonTemp.on('click', getDistrictInfo)
      // 地图自适应
      map.fitBounds(latlngBounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 200 },
      })
    }
  }

  // 获取行政信息
  const getDistrictInfo = (e) => {
    antdForm
      .validateFields(['province', 'city', 'county'])
      .then(() => {
        let lat = e.latLng.getLat().toString()
        let lng = e.latLng.getLng().toString()
        addMarker(lat, lng)
        if (mapInfo.allowRange) {
          addCircleRange(lat, lng)
        }
        getDetailAddress(lat, lng)
      })
      .catch((err) => {
        message.warn('信息不完整')
        console.warn(err)
      })
  }

  // 添加marker
  const addMarker = (lat, lng) => {
    return new Promise((resolve) => {
      if (lat && lng) {
        if (markerRef.current) {
          markerRef.current.setGeometries([])
        }
        markerRef.current = new TMap.MultiMarker({
          map: map, //指定地图容器
          //点标记数据数组
          geometries: [
            {
              id: '1', //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此
              position: new TMap.LatLng(lat, lng), //点标记坐标位置
            },
          ],
        })
        resolve()
      } else {
        resolve()
      }
    })
  }

  // 设置矢量圆形
  const addCircleRange = (lat, lng) => {
    return new Promise((resolve) => {
      if (lat && lng && mapInfo.allowRange) {
        if (circleVector.current) {
          circleVector.current.setMap(null)
        }
        circleVector.current = new TMap.MultiCircle({
          map: map,
          styles: {
            // 设置圆形样式
            circle: new TMap.CircleStyle({
              color: 'rgba(255,51,51,0.16)',
              showBorder: true,
              borderColor: 'rgba(255,51,51,1)',
              borderWidth: 2,
            }),
          },
          geometries: [
            {
              styleId: 'circle',
              center: new TMap.LatLng(lat, lng), //圆形中心点坐标
              radius: mapInfo.allowRange ? mapInfo.allowRange : 0, //半径（单位：米）
            },
          ],
        })
        resolve()
      } else {
        resolve()
      }
    })
  }

  // 获取具体信息
  const getDetailAddress = (lat, lng) => {
    fetchJsonp(`//apis.map.qq.com/ws/geocoder/v1/?output=jsonp&location=${lat},${lng}&key=${TMAP_KEY}`)
      .then((res) => {
        return res.json()
      })
      .then((resJson) => {
        if (resJson.status === 0) {
          let tempMapInfo = {
            ...mapInfo,
            address: `${resJson.result.address}(${resJson.result.formatted_addresses.recommend})`,
            longItude: lng,
            latItude: lat,
          }
          setMapInfo(tempMapInfo)
        }
      })
      .catch((err) => {
        message.warn('获取详细地址出错，请重试')
        console.warn(err)
      })
  }

  // 设置AutoComplete选项
  const onSearchComplete = (val) => {
    const region = countyOptions.filter((val) => val.id === mapInfo.county)[0]
    fetchJsonp(
      `//apis.map.qq.com/ws/place/v1/suggestion?output=jsonp&keyword=${val}&region=${region.fullname}&region_fix=1&key=${TMAP_KEY}`
    )
      .then((res) => {
        return res.json()
      })
      .then((resJson) => {
        if (resJson.status === 0) {
          let options = resJson.data.map((val) => {
            return {
              value: val.title,
              location: val.location,
              key: val.id,
            }
          })
          setCompleteOptions(options)
        }
      })
  }

  // AutoComplete选择地址
  const onSelectComplete = (val, option) => {
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }
    const lng = option.location.lng.toString()
    const lat = option.location.lat.toString()

    fetchJsonp(`//apis.map.qq.com/ws/geocoder/v1/?output=jsonp&location=${lat},${lng}&key=${TMAP_KEY}`)
      .then((res) => {
        return res.json()
      })
      .then((resJson) => {
        if (resJson.status === 0) {
          if (resJson.result.ad_info.adcode === mapInfo.county) {
            let tempAddress = {
              ...mapInfo,
              address: val,
              longItude: lng,
              latItude: lat,
            }
            setMapInfo(tempAddress)
            addMarker(lat, lng)
            if (mapInfo.allowRange) {
              addCircleRange(lat, lng)
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
      .catch((err) => {
        message.warn('请完善信息后再提交')
        console.warn(err)
      })
  }

  // dialog取消
  const handleCancel = () => {
    if (map) map.destroy()
    setMapInfo({})
    setMap(null)
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
                <Option key={val.id}>{val.fullname}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='city' rules={[{ required: true, message: '请输入市' }]}>
            <Select placeholder='市'>
              {cityOptions.map((val) => (
                <Option key={val.id}>{val.fullname}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='county' rules={[{ required: true, message: '请输入区' }]}>
            <Select placeholder='区/县'>
              {countyOptions.map((val) => (
                <Option key={val.id}>{val.fullname}</Option>
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

export default connect(mapStateProps, mapDispatchToProps)(TmapDistrict)
