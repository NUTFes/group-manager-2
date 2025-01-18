export default async function ({ $auth, redirect }) {
  if ($auth.loggedIn) {
    const tokenStatus = $auth.strategy.token.status();

    if (tokenStatus.expired()) {
      await $auth.logout();
      return redirect("/");
    }
  }
}
