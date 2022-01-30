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
  border-collapse:collapse;
}

.vertical-table th {
  letter-spacing: 1px;
  text-align: left;
  font-weight: 500;
  padding: 25px;
  padding-left: 30px;
  border-bottom: solid 1px var(--accent-2);
}

.vertical-table td {
  padding: 25px;
  text-align: left;
  padding-left: 150px;
  border-bottom: solid 1px var(--accent-2);
}

.vertical-table tr:last-child td, .vertical-table tr:last-child th {
  border-bottom: none;
}

</style>
