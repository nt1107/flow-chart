<template>
  <div class="container_content">
    <div class="left_content">
      <div id="cy"></div>
    </div>
    <div class="right_content">
      <el-button @click="addNode">addNode</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import cytoscape from 'cytoscape';
import mockData from '@/assets/lineGraph/mock/split';
import Graph from '@/assets/lineGraph/index';
import * as type from '@/assets/lineGraph/type';

let cy;
const shapeTypeMap: type.typeMap = {
  container: 'rectangle',
  property: 'ellipse',
  person: 'round-hexagon',
  event: 'rectangle',
  fact: 'rectangle',
  reason: 'rectangle'
};

const repeatCloneConfig: type.repeatCloneConfig = {
  match: {
    type: ['person']
  }
};

const graph = new Graph(mockData, shapeTypeMap, repeatCloneConfig);
graph.registerShape(
  'round-hexagon',
  (contentWidth: number, contentHeight: number) => {
    return {
      width: contentWidth + 20,
      height: contentHeight + 10
    };
  }
);
graph.beforeRender((list: type.renderNode[]) => {
  list.forEach((item: type.renderNode) => {
    if (item.data.type === 'container') {
      item.classes = 'class2';
    } else if (item.data.source) {
      item.classes = 'classLine';
    } else if (item.data.type === 'person') {
      item.classes = 'class3';
    } else if (item.data.type === 'fact') {
      item.classes = 'class4';
    } else if (item.data.type === 'item') {
      item.classes = 'class1';
    } else {
      item.classes = 'class1';
    }
    item.style!.shape = shapeTypeMap[item.data.type];
  });
});
const elements = graph.parse();
console.log(elements);
const addNode = () => {
  graph.addNode(
    {
      label:
        '蔡英文从2022年3月24日开始被留置了， 蔡英文从2022年3月24日开始被留置了，蔡英文从2022年3月24日开始被留置了， 蔡英文从2022年3月24日开始被留置了',
      type: 'description',
      id: 1000
    },
    11
  );
};

onMounted(() => {
  cy = cytoscape({
    container: document.getElementById('cy'),
    elements: elements,
    style: [
      {
        selector: '.classLine',
        style: {
          'font-size': 8,
          width: 1,
          'line-color': '#000',
          'target-arrow-color': '#000',
          'curve-style': 'bezier',
          'target-arrow-shape': 'vee',
          'text-halign': 'left',
          'text-valign': 'top',
          'arrow-scale': 0.9
        }
      }
    ],
    layout: {
      name: 'preset'
    }
  });
  graph.registerInstance(cy);
  cy.style().selector('.class1').css({
    'background-color': 'rgb(248,206,204)',
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
    'text-valign': 'center',
    'text-wrap': 'wrap'
  });
  cy.style().selector('.class3').css({
    'background-color': 'rgb(255,230,204)',
    'border-width': 1,
    'border-color': '#000',
    'font-size': 8,
    'line-height': 1.2,
    color: 'black',
    'text-halign': 'center',
    'text-valign': 'center',
    'text-wrap': 'wrap'
  });
  cy.style().selector('.class4').css({
    'background-color': 'rgb(212,225,245)',
    'border-width': 1,
    'border-color': '#000',
    'font-size': 8,
    'line-height': 1.2,
    color: 'black',
    'text-halign': 'center',
    'text-valign': 'center',
    'text-wrap': 'wrap'
  });
});
</script>

<style scoped lang="scss">
.container_content {
  width: 100%;
  height: 100%;
  display: flex;
  .left_content {
    width: 1500px;
    #cy {
      width: 1500px;
      height: 100%;
    }
  }
  .right_content {
    flex: 1;
  }
}
</style>
