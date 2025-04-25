// plugins/auth-axios.js
export default function ({ $axios }, inject) {
const authAxios = $axios.create({
    withCredentials: true,
    headers: {
    'access-token': localStorage.getItem('access-token') || '',
    client:         localStorage.getItem('client')       || '',
    uid:            localStorage.getItem('uid')          || '',
    expiry:         localStorage.getItem('expiry')       || '',
    'token-type':   localStorage.getItem('token-type')   || 'Bearer',
    },
})

inject('authAxios', authAxios)
}
