<template>
  <div class="comming-soon">
    <h1>Comming Soon ...</h1>
  </div>
</template>

<style scoped>
.comming-soon {
  background: linear-gradient(
    45deg,
    #654d58,
    #190a18,
    #a22a97,
    #a612e1,
    #3485ff,
    #3485ff
  );
  background-size: 1200% 1200%;
  animation: GradientBackground 10s ease infinite;
  width: 1000px;
  height: 400px;
}

h1 {
  padding: 10%;
  color: #fff;
  text-align: center;
  color: #fff;
  font-family: "Heebo", sans-serif;
  font-size: 50px;
  font-weight: bold;
  letter-spacing: 0.06em;
}

@keyframes GradientBackground {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
} ;
</style>
