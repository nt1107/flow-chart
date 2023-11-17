import type cytoscape from 'cytoscape';
import * as type from './type';

export default class cyRender {
  cy: cytoscape.Core;
  constructor(instance: cytoscape.Core) {
    this.cy = instance;
  }

  add(element: type.renderNode | type.line) {
    // @ts-ignore
    this.cy.add(element);
  }

  updateNodes(nodes: Set<type.node>) {
    nodes.forEach((node) => {
      this.updateNode(node);
    });
  }
  updateNode(node: type.node) {
    this.cy.nodes(`#${node.id}`).positions({
      x: node.x!,
      y: node.y!
    });
  }
}
