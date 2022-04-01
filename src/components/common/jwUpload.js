import React, { Fragment, useState, useEffect, useImperativeHandle } from 'react'
import axios from 'axios'
import { PhotoSlider } from 'react-photo-view'
import 'react-photo-view/dist/index.css'
import '@/style/common/jwUpload.less'
import { message, Upload } from 'antd'
import { LoadingOutlined, CheckCircleFilled, ExpandOutlined } from '@ant-design/icons'
import { IMAGE_TYPE } from '@/enums/common'

const JwUpload = (props) => {
  /**
     *  props接收值如下：
     *  由于其中有些命名重复，所以没有解构，可以使用props[key]取得
        title,                  // 业务名称
        initFileUrl,            // 文件服务器地址
        previewable,            // 是否可预览
        editable,               // 是否可编辑
        deleteable,             // 是否可删除
        showTools,              // 显示/隐藏工具栏
        autoUpload,             // 是否自动上传，默认是
        fileKey,                // 文件的key
        handleType,             // 操作类型，新增还是编辑
        style,                  // 样式，宽和高
        beforeUpload,           // 上传之前回调, 如果传入了该函数，则需要把返回true或false，表示当前上传是否继续
        uploadCallbackAdd,      // 新增回调
        uploadCallbackEdit,     // 编辑回调
        getUploadStatus         // 获取上传状态
        downloadable,           // 是否可下载
    */

  const {
    cRef,
    title,
    initFileUrl,
    fileKey,
    handleType,
    style,
    beforeUpload,
    uploadCallbackAdd,
    uploadCallbackEdit,
    getUploadStatus,
  } = props

  useImperativeHandle(cRef, () => ({
    // 暴露给父组件的方法
    clearUploadContent: () => {
      setShowType('add')
      setFileUrl('')
      setFileType('')
      setFileName('')
      setFileSource({})
    },
    // 调用该方法确认上传
    confirmUpload: () => {
      if (Object.keys(fileSource).length !== 0) {
        autoUploadFn(fileSource)
      } else {
        message.warn('该文件不存在')
      }
    },
    // 获取选中的文件信息，可以实现自定义上传
    getFileSource: () => {
      return fileSource
    },
  }))

  // 是否可预览
  const [previewable, setPreviewable] = useState(true)
  // 是否可编辑
  const [editable, setEditable] = useState(true)
  // 是否可删除
  const [deleteable, setDeleteable] = useState(false)
  // 显示/隐藏工具栏
  const [showTools, setShowTooles] = useState(true)
  // 当前显示类型
  const [showType, setShowType] = useState('add')
  // 文件预览地址
  const [fileUrl, setFileUrl] = useState('')
  // 文件预览地址备份
  const [fileUrlBackUp, setFileUrlBackUp] = useState('')
  // 文件名称
  const [fileName, setFileName] = useState('默认上传文件')
  // 文件类型
  const [fileType, setFileType] = useState('')
  // 预览图片索引
  const [photoIndex, setPhotoIndex] = useState(0)
  // 打开/关闭图片预览
  const [previewStatus, setPreviewStatus] = useState(false)
  // 自动上传
  const [autoUpload, setAutoUpload] = useState(true)
  // 上传loading
  const [uploadLoading, setUploadLoading] = useState(false)
  // 上传成功状态
  const [uploadSuccess, setUploadSuccess] = useState(false)
  // 当前选中的文件信息
  const [fileSource, setFileSource] = useState({})
  // 是否可下载
  const [downloadable, setDownloadable] = useState(false)

  // 初始化文件
  useEffect(() => {
    readOssFile()
  }, [initFileUrl])

  useEffect(() => {
    if (props.previewable !== undefined) setPreviewable(props.previewable)
  }, [props.previewable])

  useEffect(() => {
    if (props.editable !== undefined) setEditable(props.editable)
  }, [props.editable])

  useEffect(() => {
    if (props.deleteable !== undefined) setDeleteable(props.deleteable)
  }, [props.deleteable])

  useEffect(() => {
    if (props.showTools !== undefined) setShowTooles(props.showTools)
  }, [props.showTools])

  useEffect(() => {
    if (props.autoUpload !== undefined) setAutoUpload(props.autoUpload)
  }, [props.autoUpload])

  useEffect(() => {
    if (props.fileName !== undefined) setFileName(props.fileName)
  }, [props.fileName])

  useEffect(() => {
    if (props.downloadable !== undefined) setDownloadable(props.downloadable)
  }, [props.downloadable])

  // 读取OSS文件
  const readOssFile = () => {
    if (initFileUrl) {
      const readOssUrl = process.env.REACT_APP_READOSSURL // 读取oss图片地址
      axios
        .post(readOssUrl, {
          listData: [
            {
              field: fileKey,
              path: initFileUrl,
            },
          ],
        })
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.listData[0].NewImageUrl) {
              const fileType = initFileUrl.split('.')[1]
              setFileType(fileType)
              setFileName(title + '.' + fileType)
              setFileUrl(res.data.data.listData[0].NewImageUrl)
              setFileUrlBackUp(res.data.data.listData[0].NewImageUrl)
              setShowType('edit')
            }
          } else {
            message.warn(res.data.message)
          }
        })
    } else {
      setFileUrl('')
      setFileUrlBackUp('')
      setShowType('add')
    }
  }

  // 文件自定义上传
  const uploadFileHttpRequest = (options) => {
    if (!editable) {
      message.warn('当前不允许编辑！')
      return
    }
    const { file } = options
    const fileName = file.name.split('.')
    const currentfileType = fileName[fileName.length - 1]
    setFileType(currentfileType)
    // 图片预览
    let rd = new FileReader()
    // 创建文件读取对象
    rd.readAsDataURL(file) // 文件读取装换为base64类型
    rd.onloadend = function () {
      setShowType('edit')
      if (IMAGE_TYPE.includes(currentfileType)) {
        setFileUrl(this.result)
      } else {
        if (fileUrl.includes('blob')) {
          // 释放通过调用 URL.createObjectURL()创建的URL对象
          window.URL.revokeObjectURL(fileUrl)
        }
        setFileUrl(window.URL.createObjectURL(file))
        setFileName(title + '.' + currentfileType)
      }
      if (getUploadStatus) {
        getUploadStatus('start', props.fileKey)
      }
      if (autoUpload) {
        autoUploadFn(file)
      } else {
        setFileSource(file)
      }
    }
  }

  // 自动上传
  const autoUploadFn = (file) => {
    // 如果beforeUpload返回false，则停止上传
    if (typeof beforeUpload === 'function' && !beforeUpload(file)) {
      return false
    }
    setUploadLoading(true)
    const uploadOssUrl = process.env.REACT_APP_UPLOADOSSURL // 上传oss图片地址
    // 图片上传
    // 这里分了三步
    // 首先请求公司服务器，拿到oss的权限数据；
    // 然后请求阿里oss服务器，上传文件，提供拿到的相关权限数据；
    // 最后把oss返回的数据再次提交给公司服务器做保存
    axios
      .post(uploadOssUrl, {
        imageUrl: file.name,
      })
      .then((res) => {
        if (res.data.code === 0) {
          let result = res.data.data
          let formData = new FormData()
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
              let val = res.data.data
              if (val.status === '上传成功') {
                if (handleType === 'add') {
                  if (uploadCallbackAdd) {
                    uploadCallbackAdd(fileKey, val.imageInfo)
                  }
                  handleUploadSuccess()
                } else if (handleType === 'edit') {
                  uploadCallbackEdit(fileKey, val.imageInfo).then((res) => {
                    if (res) {
                      handleUploadSuccess()
                    } else {
                      setShowType('add')
                      setUploadLoading(false)
                      handleUploadFailure()
                    }
                  })
                }
              } else {
                handleUploadFailure()
              }
            } else {
              handleUploadFailure()
            }
          })
        }
      })
  }

  // 图片上传成功的状态处理
  const handleUploadSuccess = () => {
    // 返回上传状态
    if (getUploadStatus) {
      getUploadStatus('end', props.fileKey)
    }
    message.success(`【${props.title}】上传成功！`)
    setUploadLoading(false)
    setUploadSuccess(true)
    let timeOut = setTimeout(() => {
      setUploadSuccess(false)
      clearTimeout(timeOut)
    }, 5000)
  }

  // 图片上传失败的状态处理
  const handleUploadFailure = () => {
    // 返回上传状态
    if (getUploadStatus) {
      getUploadStatus('end', props.fileKey)
    }
    message.success(`【${props.title}】上传失败，请稍后重试！`)
    setFileUrl(fileUrlBackUp)
    setUploadLoading(false)
  }

  // 上传图片参数
  const uploadParams = {
    name: 'file',
    action: '#',
    customRequest: uploadFileHttpRequest,
    showUploadList: false,
    disabled: !editable,
  }

  // 查看图片
  const checkImageView = () => {
    if (IMAGE_TYPE.includes(fileType)) {
      setPreviewStatus(true)
    } else {
      window.open(fileUrl)
    }
  }

  // 监听Image标签加载失败
  const imageLoadError = (event) => {
    let img = event.srcElement ? event.srcElement : event.target
    img.src = require('@/assets/images/imageError.png')
    img.onerror = null // 防止闪图
  }

  // 全屏切换
  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      const element = document.getElementById('PhotoView_Slider')
      if (element) {
        element.requestFullscreen()
      }
    }
  }

  // 删除文件
  const deleteFile = () => {
    if (handleType === 'add') {
      setFileUrl('')
      setFileUrlBackUp('')
      setShowType('add')
      uploadCallbackAdd(fileKey, '')
    } else {
      uploadCallbackEdit(fileKey, '').then((res) => {
        if (res) {
          message.success(`【${title}】删除成功`)
          setFileUrl('')
          setFileUrlBackUp('')
          setShowType('add')
        } else {
          message.success(`【${title}】删除失败，请重试...`)
        }
      })
    }
  }

  //下载
  const downFile = () => {
    window.open(fileUrl)
  }

  if (showType === 'add') {
    return (
      <Upload {...uploadParams}>
        <div className='upload-content-wrap' style={{ width: `${style.width}px`, height: `${style.height}px` }}>
          <div className='upload-content-title'>{title}</div>
          <div className='upload-content'>
            <p>拖拽文件至此</p>
            <p>或'点击此处'查找文件上传</p>
          </div>
        </div>
      </Upload>
    )
  } else if (showType === 'edit') {
    return (
      <Fragment>
        <div className='image-preview-wrap' style={{ width: `${style.width}px`, height: `${style.height}px` }}>
          {uploadLoading ? (
            <div className='upload_loading_wrap'>
              <LoadingOutlined className='icon-loading' />
            </div>
          ) : null}
          <div className='img-wrap'>
            <div className='img-tip'>{title}</div>
            {IMAGE_TYPE.includes(fileType) ? (
              <img alt='图片' onError={imageLoadError} src={fileUrl}></img>
            ) : (
              <div>{fileName}</div>
            )}
          </div>
          {showTools ? (
            <div className='image-tool'>
              <div className='image-tool-top'>
                {uploadSuccess ? <CheckCircleFilled className='icon-success' /> : null}
              </div>
              <div className='image-tool-bottom'>
                {previewable ? (
                  <span className='preview-btn' onClick={checkImageView}>
                    大图
                  </span>
                ) : null}
                {downloadable ? (
                  <span className='download-btn' onClick={downFile}>
                    下载
                  </span>
                ) : null}
                {editable ? (
                  <Upload {...uploadParams}>
                    <span className='edit-btn'>修改</span>
                  </Upload>
                ) : null}
                {deleteable ? (
                  <span className='delete-btn' onClick={deleteFile}>
                    删除
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        <PhotoSlider
          images={[fileUrl].map((item) => ({ src: item }))}
          index={photoIndex}
          onClose={() => setPreviewStatus(false)}
          onIndexChange={setPhotoIndex}
          toolbarRender={({ rotate, onRotate }) => {
            return (
              <>
                <svg
                  className='PhotoView-PhotoSlider__toolbarIcon'
                  fill='white'
                  height='44'
                  onClick={() => onRotate(rotate + 90)}
                  viewBox='0 0 768 768'
                  width='44'
                >
                  <path d='M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z' />
                </svg>
                {document.fullscreenEnabled && <ExpandOutlined onClick={toggleFullScreen} />}
              </>
            )
          }}
          visible={previewStatus}
        />
      </Fragment>
    )
  } else {
    return (
      <div className='handle-error' style={{ width: `${style.width}px`, height: `${style.height}px` }}>
        文件操作状态错误！
      </div>
    )
  }
}

export default JwUpload
