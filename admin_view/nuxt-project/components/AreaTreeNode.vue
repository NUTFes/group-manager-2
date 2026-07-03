<template>
  <li>
    <details v-if="directStockerPlaces.length > 0 || children.length > 0" open>
      <summary>{{ category.name }}</summary>
      <ul class="toggle-ul-inner">
        <li v-for="sp in directStockerPlaces" :key="'sp-'+sp.id" class="room-item">
          {{ sp.name }}
        </li>
        <AreaTreeNode 
          v-for="child in children" 
          :key="'cat-'+child.id" 
          :category="child" 
          :allCategories="allCategories"
          :allStockerPlaces="allStockerPlaces"
        />
      </ul>
    </details>
    <template v-else>
      {{ category.name }}
    </template>
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
.toggle-ul-inner {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}
li {
  margin: 4px 0;
}
.room-item {
  display: list-item !important;
  list-style-type: disc !important;
  list-style-position: inside !important;
}
summary {
  cursor: pointer;
}
</style>
