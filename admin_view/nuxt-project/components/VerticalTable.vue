<template>
  <table class="vertical-table">
    <tbody>
      <slot></slot>
    </tbody>
  </table>
</template>
<style>
.vertical-table {
  font-size: 14px;
  width: 100%;
  border-collapse: collapse;
}

.vertical-table th {
  letter-spacing: 1px;
  text-align: left;
  font-weight: 500;
  padding: 25px;
  width: 25%;
  border-bottom: solid 1px var(--accent-2);
}

.vertical-table td {
  padding: 25px;
  text-align: left;
  border-bottom: solid 1px var(--accent-2);
}

.vertical-table tr:last-child td,
.vertical-table tr:last-child th {
  border-bottom: none;
}

.vertical-table a {
  color: var(--accent-7);
}

.vertical-table select {
  color: var(--accent-5);
  border: 1px solid var(--accent-3);
  width: 130px;
  padding: 5px;
  padding-left: 30px;
  margin-left: -30px;
  transition: all 0.5s 0s ease;
}

.vertical-table select:focus {
  border: 1px solid var(--accent-7);
  z-index: 2;
  outline: 0;
}
</style>
