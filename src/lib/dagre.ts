import dagre from 'dagre';
import type { WorkflowNode, WorkflowEdge } from '@types-app/nodes';

const NODE_WIDTH  = 200;
const NODE_HEIGHT = 80;

/**
 * Runs the Dagre layout algorithm on the given nodes and edges.
 * Returns new nodes with updated positions — does NOT mutate in place.
 */
export function applyDagreLayout(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  direction: 'TB' | 'LR' = 'TB'
): WorkflowNode[] {
  const g = new dagre.graphlib.Graph();

  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir:  direction,
    nodesep:  60,
    ranksep:  80,
    marginx:  40,
    marginy:  40,
  });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const positioned = g.node(node.id);
    return {
      ...node,
      position: {
        x: positioned.x - NODE_WIDTH  / 2,
        y: positioned.y - NODE_HEIGHT / 2,
      },
    };
  });
}
