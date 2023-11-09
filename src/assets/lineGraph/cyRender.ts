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
}
