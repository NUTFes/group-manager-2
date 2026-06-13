<template>
  <li>
    <span class="tree-symbol">├─</span> {{ category.name }}
    <ul class="tree-ul-inner">
      <li v-for="sp in directStockerPlaces" :key="'sp-'+sp.id">
        <span class="tree-symbol">├─</span> {{ sp.name }}
      </li>
      <AreaTreeNode 
        v-for="child in children" 
        :key="'cat-'+child.id" 
        :category="child" 
        :allCategories="allCategories"
        :allStockerPlaces="allStockerPlaces"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'AreaTreeNode',
  props: {
    category: {
      type: Object,
      required: true,
    },
    allCategories: {
      type: Array,
      required: true,
    },
    allStockerPlaces: {
      type: Array,
      required: true,
    }
  },
  computed: {
    children() {
      return this.allCategories.filter(c => c.parent_id === this.category.id);
    },
    directStockerPlaces() {
      return this.allStockerPlaces.filter(sp => sp.place_category_id === this.category.id);
    }
  }
}
</script>

<style scoped>
.tree-ul-inner {
  margin-left: 24px !important;
  border-left: 1px solid #777;
  padding-left: 0;
  list-style-type: none;
}
.tree-symbol {
  margin-right: 4px;
  font-family: monospace;
}
li {
  margin: 4px 0;
}
</style>
