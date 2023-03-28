export const loginCheck = () =>{
  const router = useRouter();
  if (localStorage.getItem("access-token") == null){
    router.push("/welcome")
  }
}
