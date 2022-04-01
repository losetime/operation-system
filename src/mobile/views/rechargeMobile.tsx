import React, { FC, ReactElement, useState, useEffect } from 'react'
import { apiGetConsignorList, apiAddRechargeStore } from '@/service/api/mobile'
import { Button, Input, Picker, FilePicker, Badge, Loading, ActivityIndicator, Toast, Modal, Icon } from 'zarm'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/mobile/rechargeMobile.less'
import axios from 'axios'
import { numberReg } from '@/enums/regEnum'
import { rechargeEnum } from '@/enums/financeEnum'

const RechargeMobile: FC = (props: any): ReactElement => {
  const [accountVisible, setAccountVisible] = useState(false)
  const [dealTypeVisible, setDealTypeVisible] = useState(false)
  const [consignorList, setConsignorList] = useState<any[]>([])
  const [pickerList, setPickerList] = useState<any[]>([])
  const [consignorListCopy, setConsignorListCopy] = useState<any[]>([])
  const [showDropDown, setShowDropDown] = useState(false)
  const [userInfo, setUserInfo] = useState<string | undefined>('')
  const [dealType, setDealType] = useState<string | undefined>('充运费')
  const [uploadFile, setUploadFile] = useState<any>({})
  const [rechargeParams, setRechargeParams] = useState({
    userId: 0,
    rechargeLicense: '',
    failedExplain: '',
    rechargeAmount: '',
    rechargeType: '5',
  })

  useEffect(() => {
    if (props.userInfo.token) {
      apiGetConsignorList().then((res) => {
        if (res.code === 0) {
          const result = res.data
          setConsignorList(result.listData)
          setConsignorListCopy(result.listData)
        }
      })
    }
  }, [props.userInfo])

  const onAccountChange = (value: string | undefined) => {
    setUserInfo(value)
    if (value) {
      const tempConsignorList: any[] = consignorListCopy.filter((item: any) => item.shortCompanyName.includes(value))
      setConsignorList(tempConsignorList)
      if (tempConsignorList.length > 0) {
        setShowDropDown(true)
      }
    } else {
      setRechargeParams({ ...rechargeParams, userId: 0 })
      setShowDropDown(false)
    }
  }

  const chooseItem = (item: any) => {
    setRechargeParams({ ...rechargeParams, userId: item.userId })
    setUserInfo(`${item.shortCompanyName} ${item.contact} ${item.contactTel}`)
    setShowDropDown(false)
  }

  const showAccountPicker = () => {
    const tempConsignorList = consignorListCopy.map((val: any) => {
      return {
        label: `${val.shortCompanyName} ${val.contact} ${val.contactTel}`,
        value: val.userId,
      }
    })
    setPickerList(tempConsignorList)
    setAccountVisible(true)
  }

  const showDealTypePicker = () => {
    setPickerList(rechargeEnum)
    setDealTypeVisible(true)
  }

  const handleAccountPicker = (selected: any) => {
    setRechargeParams({ ...rechargeParams, userId: selected[0].value })
    setUserInfo(selected[0].label)
    closeAccountPicker()
  }

  const hanleDealTypePicker = (selected: any) => {
    setRechargeParams({ ...rechargeParams, rechargeType: selected[0].value })
    setDealType(selected[0].label)
    closeDealTypePicker()
  }

  const closeAccountPicker = () => {
    setAccountVisible(false)
  }

  const closeDealTypePicker = () => {
    setDealTypeVisible(false)
  }

  const onFilePickerChange = (options: any) => {
    const { file } = options
    setUploadFile(options)
    autoUploadFn(file)
  }

  const autoUploadFn = (file: any) => {
    Loading.show({
      content: <ActivityIndicator size='lg' />,
    })
    const uploadOssUrl = process.env.REACT_APP_UPLOADOSSURL // 上传oss图片地址
    // 图片上传
    // 这里分了三步
    // 首先请求公司服务器，拿到oss的权限数据；
    // 然后请求阿里oss服务器，上传文件，提供拿到的相关权限数据；
    // 最后把oss返回的数据再次提交给公司服务器做保存
    console.log(file.name)
    axios
      .post(uploadOssUrl as string, {
        imageUrl: file.name,
      })
      .then((res) => {
        if (res.data.code === 0) {
          const result = res.data.data
          const formData = new FormData()
          // oss上传需要的参数，参考以下文档
          // https://help.aliyun.com/document_detail/31925.html?spm=a2c4g.11186623.2.8.123e4367hMqpVu#concept-frd-4gy-5db
          // https://help.aliyun.com/document_detail/31988.html?spm=a2c4g.11186623.2.15.22dc49e8yGtKDc#reference-smp-nsw-wdb
          formData.append('OSSAccessKeyId', result.accessid)
          formData.append('policy', result.policy)
          formData.append('success_action_status', '200')
          formData.append('key', result.objectName)
          formData.append('signature', result.signature)
          formData.append('callback', result.callback)
          formData.append('file', file)
          axios({
            url: result.host,
            method: 'post',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then((res) => {
            if (res.data.code === 0) {
              const val = res.data.data
              if (val.status === '上传成功') {
                setRechargeParams({ ...rechargeParams, rechargeLicense: val.imageInfo })
                Loading.hide()
                Toast.show('上传成功')
              } else {
                Loading.hide()
                Toast.show('上传失败')
                setUploadFile({})
              }
            } else {
              Loading.hide()
              Toast.show('上传失败')
              setUploadFile({})
            }
          })
        }
      })
  }

  const imgRender = () => {
    return (
      <Badge
        className='file-picker-item'
        shape='circle'
        text={
          <span className='file-picker-closebtn'>
            <Icon type='wrong' onClick={() => setUploadFile({})} />
          </span>
        }
      >
        <div className='file-picker-item-img'>
          <img src={uploadFile.thumbnail} alt='' />
        </div>
      </Badge>
    )
  }

  const submitForm = () => {
    const { userId, rechargeAmount, rechargeType } = rechargeParams
    if (userId && rechargeAmount && rechargeType) {
      if (!numberReg.test(rechargeAmount)) {
        Toast.show('转账金额只能输入数字，且最多只能包含两位小数')
        return
      }
      if (parseFloat(rechargeAmount) < 0.01 || parseFloat(rechargeAmount) > 99999999.99) {
        Toast.show('转账金额必须大于等于0.01，小于等于99999999.99')
        return
      }
      Modal.confirm({
        title: '提示',
        content: '请确认是否要提交？',
        onCancel: () => {
          Toast.show('已取消')
        },
        onOk: () => {
          apiAddRechargeStore(rechargeParams).then((res) => {
            if (res.code === 0) {
              Toast.show('提交成功')
              setRechargeParams({
                userId: 0,
                rechargeLicense: '',
                failedExplain: '',
                rechargeAmount: '',
                rechargeType: '5',
              })
              setUploadFile({})
              setUserInfo('')
              setDealType('充运费')
            }
          })
        },
      })
    } else {
      Toast.show('账户信息,交易类型和转账金额为必填项，请检查')
    }
  }

  return (
    <div className='recharge-mobile-wrap'>
      <div className='recharge-title-wrap'>充值申请</div>
      <div className='recharge-info-wrap'>
        <div className='info-title'>
          <span>账户信息</span>
          <Icon type='arrow-bottom' theme='primary' size='sm' onClick={showAccountPicker} />
        </div>
        <div className='info-content'>
          <Input placeholder='输入选择' value={userInfo} onChange={onAccountChange} />
          {showDropDown ? (
            <div className='drop-down-selection'>
              {consignorList.map((item: any) => {
                return (
                  <p
                    key={item.consignorId}
                    className='selection-item'
                    onClick={() => {
                      chooseItem(item)
                    }}
                  >
                    <span>{item.shortCompanyName}</span>
                    <span>{item.contact}</span>
                    <span>{item.contactTel}</span>
                  </p>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className='recharge-info-wrap'>
        <div className='info-title'>
          <span>交易方式</span>
          <Icon type='arrow-bottom' theme='primary' size='sm' onClick={showDealTypePicker} />
        </div>
        <div>
          <Input placeholder='下拉选择' readOnly value={dealType} />
        </div>
      </div>
      <div className='recharge-info-wrap'>
        <div className='info-title'>
          <span>转账金额(元)</span>
        </div>
        <div>
          <Input
            placeholder='请输入'
            value={rechargeParams.rechargeAmount}
            onChange={(value: any) => {
              setRechargeParams({ ...rechargeParams, rechargeAmount: value })
            }}
          />
        </div>
      </div>
      <div className='recharge-info-wrap'>
        <div className='info-title'>
          <span>备注</span>
        </div>
        <div>
          <Input
            placeholder='请输入'
            type='text'
            showLength
            maxLength={15}
            rows={2}
            value={rechargeParams.failedExplain}
            onChange={(value: any) => {
              setRechargeParams({ ...rechargeParams, failedExplain: value })
            }}
          />
        </div>
      </div>
      <div className='recharge-info-wrap'>
        <div className='info-title'>
          <span>附件(转账凭证)</span>
        </div>
        <div className='info-upload-content'>
          {uploadFile.file ? (
            imgRender()
          ) : (
            <FilePicker className='file-picker-btn' onChange={onFilePickerChange}>
              <Icon type='add' size='lg' />
            </FilePicker>
          )}
        </div>
      </div>
      <div className='submit-wrap'>
        <Button block theme='primary' shape='round' onClick={submitForm}>
          提交
        </Button>
      </div>
      <div>
        <Picker
          visible={accountVisible}
          dataSource={pickerList}
          onOk={handleAccountPicker}
          onCancel={closeAccountPicker}
        />
        <Picker
          visible={dealTypeVisible}
          dataSource={pickerList}
          onOk={hanleDealTypePicker}
          onCancel={closeDealTypePicker}
        />
      </div>
    </div>
  )
}

const mapStateProps = (state: any) => {
  return {
    userInfo: state.userInfo,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(RechargeMobile)
