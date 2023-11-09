<template>
  <div id="cy"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import cytoscape from 'cytoscape';

onMounted(() => {
  const elements = [
    {
      data: { id: 1 },
      style: { label: '11' }
    },
    {
      data: { id: 2 },
      style: { label: '22' }
    },
    {
      data: { id: 3 },
      style: {
        label: '33',
        'background-color': 'red',
        width: 50,
        height: 50
      }
    },
    {
      data: { id: 4 },
      position: { x: 10, y: 100 },
      style: { label: '小猫', width: 100, height: 100, shape: 'rectangle' },
      classes: 'custom-node'
    },
    { data: { source: 1, target: 2, type: 'type1' } },
    { data: { source: 3, target: 2, type: 'type2' } },
    { data: { source: 4, target: 2, type: 'type3' } }
  ];
  cytoscape({
    container: document.getElementById('cy'),
    style: [
      {
        selector: 'node',
        style: {
          content: 'data(id)',
          'text-halign': 'center',
          'text-valign': 'center',
          color: 'blue'
        }
      },
      {
        selector: '#4',
        style: {
          'background-image': "url('/img/cat.jpg')",
          'background-height': '50%',
          'background-width': '50%',
          'background-repeat': 'no-repeat',
          'background-fit': 'cover',
          'text-valign': 'bottom'
        }
      },
      {
        selector: 'edge[type="type1"]',
        style: {
          width: 1,
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle'
        }
      },
      {
        selector: 'edge[type="type2"]',
        style: {
          width: 10,
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle'
        }
      },
      {
        selector: 'edge[type="type3"]',
        style: {
          width: 50,
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle'
        }
      }
    ],
    elements: elements
  });
});
</script>
<style scoped>
#cy {
  width: 1500px;
  height: 800px;
}
.custom-node {
  background-image: url('../../public/img/cat.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  text-align: bottom;
}
</style>
