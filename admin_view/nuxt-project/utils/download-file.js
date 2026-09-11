// utils/download-file.js
export async function downloadFile(authAxios, endpoint, fileName, fileType = 'application/pdf') {
    try {
        const res = await authAxios.get(endpoint, { responseType: 'blob' })
        const blob = new Blob([res.data], { type: fileType })
        const url  = window.URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href       = url
        a.setAttribute('download', fileName)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        return true
    } catch (err) {
        console.error('downloadFile error:', err)
        return false
    }
}
