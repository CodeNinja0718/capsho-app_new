<template>
  <div class="auth-background">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.auth-background {
  background-image: url(/src/assets/auth-background.png);
  background-size: 80% auto;
  background-repeat: no-repeat;
  background-position: center;
  background-color: $dark;
  @media only screen and (max-width: 1024px) {
    & {
      background-size: 100% auto;
    }
  }
}
</style>
