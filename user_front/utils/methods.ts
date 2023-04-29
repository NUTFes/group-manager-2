import {CurrentUser} from '@/types'

export const getCurrentUser = async () => {
  const config = useRuntimeConfig();
  const currentUser = await $fetch<CurrentUser>(config.APIURL + "/api/v1/current_user",
  {
    headers:{
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token") || "",
      "client": localStorage.getItem("client") || "",
      "uid": localStorage.getItem("uid") || ""
    },
  })
  return currentUser
}

export const loginCheck = async () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const isLogin = await $fetch(config.APIURL + "/api/v1/current_user/is_login",
  {
    headers:
    {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token") || "",
      "client": localStorage.getItem("client") || "",
      "uid": localStorage.getItem("uid") || ""
    }
  })
  if (isLogin == false) {
    router.push("/")
  }
}
