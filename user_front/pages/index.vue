<template>
  <div>
    <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1>
    <form>
      <label for="locale-select">{{ $t('language') }}: </label>
      <select id="locale-select" v-model="$i18n.locale">
        <option value="ja">ja</option>
        <option value="en">en</option>
      </select>
    </form>
  </div>
</template>
