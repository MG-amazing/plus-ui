import {ref} from 'vue'
import axios from 'axios'

export default function () {
    const downloadProgress = ref(0)


    async function downloadTeaching(filePath, fileName) {
        try {
            const response = await axios.get(filePath, {
                responseType: 'blob',
                onDownloadProgress: progressEvent => {
                    downloadProgress.value = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                }
            })
            // 创建下载链接
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const a = document.createElement('a')
            a.href = url
            let fileType = '.mp4'
            if (filePath.includes('.docx')) {
                fileType = '.docx'
            } else if (filePath.includes('.doc')) {
                fileType = '.doc'
            } else if (filePath.includes('.pdf')) {
                fileType = '.pdf'
            } else if (filePath.includes('.xlsx')) {
                fileType = '.xlsx'
            } else if (filePath.includes('.xls')) {
                fileType = '.xls'
            }
            a.download = fileName + fileType
            a.click()
            URL.revokeObjectURL(url)

        } catch (error) {
            console.error('下载失败:', error)
        } finally {
            downloadProgress.value = 0
        }
    }

    return {
        downloadTeaching
    }
}
