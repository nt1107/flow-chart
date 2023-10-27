<template>
  <div id="cy"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import cytoscape from 'cytoscape';
import mockData from '@/assets/lineGraph/mock/all';
import Graph from '@/assets/lineGraph/index';
import * as type from '@/assets/lineGraph/type';

const shapeTypeMap: type.typeMap = {
  container: 'rectangle',
  description: 'ellipse',
  entity: 'ellipse',
  event: 'rectangle'
};
onMounted(() => {
  document.addEventListener('DOMContentLoaded', function () {
    const graph = new Graph(mockData, shapeTypeMap);
    graph.beforeRender((list: type.renderNode[]) => {
      list.forEach((item: type.renderNode) => {
        if (item.data.type === 'container') {
          item.classes = 'class2';
        } else if (item.data.source) {
          item.classes = 'classLine';
        } else {
          item.classes = 'class1';
        }
        item.style!.shape = shapeTypeMap[item.data.type];
      });
    });
    const elements = graph.parse();
    console.log(elements);
    var cy = cytoscape({
      container: document.getElementById('cy'),
      elements: elements,
      style: [
        {
          selector: '.classLine',
          style: {
            'font-size': 8,
            width: 1,
            'line-color': '#000',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'text-halign': 'left',
            'text-valign': 'top'
          }
        }
      ],
      layout: {
        name: 'preset'
      }
    });

    cy.style().selector('.class1').css({
      'background-color': 'white',
      'border-width': 1,
      'border-color': '#000',
      'font-size': 8,
      'line-height': 1.2,
      color: 'black',
      'text-halign': 'center',
      'text-valign': 'center',
      'text-wrap': 'wrap'
    });
    cy.style().selector('.class2').css({
      'background-color': 'white',
      'border-width': 1,
      'border-color': '#000',
      'font-size': 8,
      'line-height': 1.2,
      color: 'black',
      'text-halign': 'center',
      'text-valign': 'top',
      'text-wrap': 'wrap'
    });
  });
});
</script>

<style scoped>
#cy {
  width: 1500px;
  height: 800px;
}
</style>
@/assets/lineGraph/mock/mock
