<template>
  <section class="tab_contents">
    <div>
      <input id="tab1" type="radio" name="check" />
      <span  class="bubble"></span>
      <label  for="tab1" class="tab_lab1">{{tab1}}</label>

      <input id="tab2" type="radio" name="check" />
      <span class="bubble"></span>
      <label for="tab2" class="tab_lab2">{{tab2}}</label>

      <div class="panels">
        <div id="area1" class="panel">
          <div><slot name="tab1" /></div>
        </div>

        <div id="area2" class="panel">
          <div><slot name="tab2" /></div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
export default {
    name: "Tab",
  props: {
    tab1: {
      type: String,
      required: false,
      default: "content1",
    },
    tab2: {
      type: String,
      required: false,
      default: "content2",
    },
  },
};
</script>

<style scoped>
#tab1:checked ~ .panels #area1 {
  display: block;
}
#tab2:checked ~ .panels #area2 {
  display: block;
}
#tab1:checked ~ .tab_lab1 {
  color: black;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
}
#tab2:checked ~ .tab_lab2 {
  color: black;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
}
.panel {
  padding: 3%;
  width: 100%;
  display: none;
  min-height: 100vh;
}
.tab_lab1, .tab_lab2 {
  padding: 1%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: "Noto Sans JP";
  font-style: normal;
  letter-spacing: 0.1em;
}
input[name="check"] {
  display: none;
}
</style>
