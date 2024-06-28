<template>
  <table class="normal-table">
    <thead>
      <slot name="table-header"></slot>
    </thead>
    <tbody>
      <slot name="table-body"></slot>
    </tbody>
  </table>
</template>
<style>
.normal-table {
  font-size: 14px;
  width: 100%;
  border-collapse: collapse;
}

.normal-table tr {
  transition: 0.2s;
  border-bottom: solid 1px var(--accent-2);
}

.normal-table th {
  font-weight: 500;
  padding: 5px;
  border-bottom: solid 1px var(--accent-3);
  position: sticky;
  top: 60px;
  background: white;
  z-index: 1;
}

.normal-table td {
  text-align: center;
  vertical-align: middle;
  padding: 25px;
}

.normal-table a {
  background: linear-gradient(
    135deg,
    var(--button-primary) 0%,
    var(--button-secondary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.normal-table a:hover {
  background: linear-gradient(
    45deg,
    var(--button-secondary) 0%,
    var(--primary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  box-shadow: 5px 5px 6px #f0f0f0, -5px -5px 3px #fafafa;
}

.normal-table tr:hover {
  transform: translateY(-1px);
  background-color: white;
  border: solid 1px var(--accent-0);
  box-shadow: 5px 5px 14px #f0f0f0, -5px -5px 14px #fafafa;
}

.normal-table td:hover {
  background: linear-gradient(
    45deg,
    var(--button-secondary) 0%,
    var(--button-primary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.normal-table tr:active {
  border: none;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
}

.normal-table tr:last-child td {
  border-bottom: none;
}
</style>
