<template>
  <div class="container_content">
    <div class="left_content">
      <div id="cy"></div>
    </div>
    <div class="right_content">
      <el-button @click="download">download</el-button>
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
  person: 'cut-rectangle',
  event: 'rectangle',
  fact: 'rectangle',
  reason: 'rectangle'
};

const repeatCloneConfig: type.repeatCloneConfig = {
  match: {
    type: ['person'],
    id: ['（2020）陕刑终267号-court-1']
  }
};

const options: type.graphOptions = {
  shapeMap: shapeTypeMap,
  repeatCloneConfig: repeatCloneConfig,
  // layout: { rows: 2, colomn: 1 },
  leftRihgt: (
    node: type.node,
    fatherNode: type.node,
    edges: type.splitEdge[]
  ) => {
    for (const edge of edges) {
      if (edge.source_id === node.id && edge.target_id === fatherNode.id) {
        return 'left';
      }
    }
    return 'right';
  }
};
const graph = new Graph(mockData, options);
graph.registerShape(
  'cut-rectangle',
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
      item.classes = 'classContainer';
    } else if (item.data.source) {
      item.classes = 'classLine';
    } else if (item.data.type === 'person') {
      item.classes = 'classPerson';
    } else if (item.data.type === 'fact') {
      item.classes = 'classEvent';
    } else if (item.data.type === 'item') {
      item.classes = 'classItem';
    } else {
      item.classes = 'classItem';
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

const download = () => {
  const png64 = cy.png({
    full: true
  });
  let a = document.createElement('a');
  a.href = png64;
  a.download = 'graph.png';
  a.click();
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
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
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
  cy.style().selector('.classItem').css({
    'background-color': '#FBE0DC',
    'border-width': 1,
    'border-color': '#E89DAF',
    'font-size': 8,
    'line-height': 1.2,
    color: 'black',
    'text-halign': 'center',
    'text-valign': 'center',
    'text-wrap': 'wrap'
  });
  cy.style().selector('.classContainer').css({
    'background-color': 'white',
    'border-width': 1,
    'border-color': '#ccc',
    'font-size': 8,
    'line-height': 1.2,
    color: 'black',
    'text-halign': 'center',
    'text-valign': 'top',
    'text-wrap': 'wrap'
  });
  cy.style().selector('.classPerson').css({
    'background-color': '#F8E7C1',
    'border-width': 1,
    'border-color': '#F0CFAD',
    'font-size': 8,
    'line-height': 1.2,
    color: 'black',
    'text-halign': 'center',
    'text-valign': 'center',
    'text-wrap': 'wrap'
  });
  cy.style().selector('.classEvent').css({
    'background-color': '#E8F7FD',
    'border-width': 1,
    'border-color': '#57ACEA',
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
    width: 100%;
    #cy {
      width: 100%;
      height: 100%;
    }
  }
  .right_content {
    width: 50px;
  }
}
</style>
