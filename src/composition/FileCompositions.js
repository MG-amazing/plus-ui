import { ElMessageBox } from 'element-plus'
import { api as viewerApi } from 'v-viewer'

export default function () {
    function getFileSuffix(mediaUrl) {
        return mediaUrl.substring(mediaUrl.lastIndexOf('.')).toLowerCase()
    }
    function getMediaType(mediaUrl) {
        const iconMap = {
            '.jpg': 'img',
            '.jpeg': 'img',
            '.png': 'img',
            '.mp3': 'audio',
            '.mp4': 'video'
        }

        const fileSuffix = getFileSuffix(mediaUrl)
        const type = iconMap[fileSuffix]
        if (type) {
            return type
        } else {
            return 'other'
        }
    }
    function getOfficeType(mediaUrl) {
        const iconMap = {
            '.docx': 'docx',
            '.pdf': 'pdf',
            '.xlsx': 'xlsx'
        }

        const fileSuffix = getFileSuffix(mediaUrl)
        const type = iconMap[fileSuffix]
        if (type) {
            return type
        } else {
            return 'other'
        }
    }
    function previewImg(filePath) {
        viewerApi({
            options: {
                zIndex: 9999
            },
            images: [filePath]
        })
    }

    function getIcon(mediaUrl) {
        const iconMap = {
            '.doc': 'message-file-doc',
            '.docx': 'message-file-docx',
            '.pdf': 'message-file-pdf',
            '.ppt': 'message-file-ppt',
            '.pptx': 'message-file-pptx',
            '.xls': 'message-file-xls',
            '.xlsx': 'message-file-xlsx',
            '.zip': 'message-file-zip',
            '.txt': 'message-file-txt',
            '.jpg': 'message-file-jpg',
            '.jpeg': 'message-file-jpg',
            '.png': 'message-file-png',
            '.mp3': 'message-file-mp3',
            '.mp4': 'message-file-mp4'
        }

        const fileSuffix = getFileSuffix(mediaUrl)
        const icon = iconMap[fileSuffix]
        if (icon) {
            return icon
        } else {
            return 'message-file-other'
        }
    }
    /**
     * 附件下载
     * @param file
     */
    function download(file) {
        ElMessageBox.confirm('是否确定下载当前附件?', '系统提示', { type: 'warning' })
            .then(() => {
                global.$http({
                    method: 'get',
                    url: file,
                    responseType: 'arraybuffer'// arraybuffer/blob
                }).then(function(data) {
                    const blob = new Blob([data])
                    const downloadElement = document.createElement('a')
                    const href = window.URL.createObjectURL(blob) // 创建下载的链接
                    downloadElement.href = href
                    downloadElement.download = new Date().toLocaleDateString() + '.' + getFileSuffix(file) // 下载后文件名
                    document.body.appendChild(downloadElement)
                    downloadElement.click() // 点击下载
                    document.body.removeChild(downloadElement) // 下载完成移除元素
                    window.URL.revokeObjectURL(href) // 释放掉blob对象
                })
            })
    }

    return {
        previewImg,
        getMediaType,
        getOfficeType,
        getFileSuffix,
        getIcon,
        download
    }
}