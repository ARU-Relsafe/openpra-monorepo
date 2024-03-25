import {
  EventSequenceGraph,
  EventTreeGraph,
  FaultTreeGraph,
} from "shared-types/src/lib/types/reactflowGraph/Graph";
import { GraphNode } from "shared-types/src/lib/types/reactflowGraph/GraphNode";
import { GraphEdge } from "shared-types/src/lib/types/reactflowGraph/GraphEdge";
import {
  Edge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  Node,
} from "reactflow";
import _ from "lodash";
import { GraphApiManager } from "shared-types/src/lib/api/GraphApiManager";
import { Toast } from "@elastic/eui/src/components/toast/global_toast_list";
import { EuiToastProps } from "@elastic/eui/src/components/toast/toast";
import {
  EventSequenceNodeProps,
  EventSequenceNodeTypes,
} from "../app/components/treeNodes/eventSequenceNodes/eventSequenceNodeType";
import { EventSequenceEdgeProps } from "../app/components/treeEdges/eventSequenceEdges/eventSequenceEdgeType";
import { BASIC_EVENT, WORKFLOW } from "./constants";

/**
 * Function to generate a new & random UUID
 */
export const GenerateUUID = (): string =>
  new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

/**
 * Event Sequence state to store the event sequence id and list of nodes & edges
 */
export type EventSequenceStateType = {
  eventSequenceId: string;
} & BaseGraphState;

/**
 * Fault Tree state to store the fault tree id and list of nodes & edges
 */
export type FaultTreeStateType = {
  faultTreeId: string;
} & BaseGraphState;

/**
 * Event Tree state to store the event tree id and list of nodes & edges
 */
export type EventTreeStateType = {
  eventTreeId: string;
} & BaseGraphState;

/**
 * Base Graph state to store the list of nodes & edges
 */
export type BaseGraphState = {
  nodes: Node[];
  edges: Edge[];
};

export type OnUpdateGraphState = {
  updateState?: boolean;
} & BaseGraphState;

/**
 * Generate the event sequence state with the provided list of nodes and edges, for a particular event sequence id
 * @param eventSequenceId - event sequence id
 * @param nodes - list of nodes
 * @param edges - list of edges
 */
export const EventSequenceState = ({
  eventSequenceId,
  nodes,
  edges,
}: EventSequenceStateType): EventSequenceGraph => ({
  eventSequenceId: eventSequenceId,
  nodes: getNodes<EventSequenceNodeProps>(nodes),
  edges: getEdges<EventSequenceEdgeProps>(edges),
});

/**
 * Generate the fault tree state with the provided list of nodes and edges, for a particular fault tree id
 * @param faultTreeId - fault tree id
 * @param nodes - list of nodes
 * @param edges - list of edges
 */
export const FaultTreeState = ({
  faultTreeId,
  nodes,
  edges,
}: FaultTreeStateType): FaultTreeGraph => ({
  faultTreeId: faultTreeId,
  nodes: getNodes<object>(nodes),
  edges: getEdges<object>(edges),
});

/**
 * Generate the fault tree state with the provided list of nodes and edges, for a particular fault tree id
 * @param faultTreeId - fault tree id
 * @param nodes - list of nodes
 * @param edges - list of edges
 */
export const EventTreeState = ({
  eventTreeId,
  nodes,
  edges,
}: EventTreeStateType): EventTreeGraph => ({
  eventTreeId: eventTreeId,
  nodes: getNodes(nodes),
  edges: getEdges(edges),
});

/**
 * Map Node[] to GraphNode[]
 * @param nodes - List of Nodes
 * @returns List of GraphNodes
 */
function getNodes<T>(nodes: Node[]): GraphNode<T>[] {
  return nodes.map(
    (node: Node<T>) =>
      ({
        id: node.id,
        data: node.data,
        position: node.position,
        type: node.type,
      }) as GraphNode<T>,
  );
}

/**
 * Map Edge[] to GraphEdge[]
 * @param edges - List of Edges
 * @returns List of GraphEdges
 */
function getEdges<T>(edges: Edge[]): GraphEdge<T>[] {
  return edges.map(
    (edge: Edge<T>) =>
      ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        data: edge.data,
        animated: edge.animated,
      }) as GraphEdge<T>,
  );
}

/**
 * Generates a new empty Basic Event node for Fault Trees.
 * @returns New empty Basic Event node.
 */
export const getBasicEventNode = (): Node => ({
  id: GenerateUUID(),
  data: {},
  position: { x: 0, y: 0 },
  type: BASIC_EVENT,
});

/**
 * Generates a new workflow edge.
 * @returns a new workflow edge.
 */
export const getWorkflowEdge = (
  parentNodeId: string,
  childNodeId: string,
  label = "",
): Edge => ({
  id: `${parentNodeId}=>${childNodeId}`,
  source: parentNodeId,
  target: childNodeId,
  type: WORKFLOW,
});

/**
 * Determine whether a node can be deleted, based on its type
 * @param nodeType - type of node
 * @returns boolean flag determining whether node can be deleted
 */
export function IsNodeDeletable(nodeType?: string): boolean {
  switch (nodeType) {
    case "initiating":
    case "end":
    case "transfer":
    case "undeveloped":
      return false;
    case "functional":
    case "description":
    case "intermediate":
      return true;
    default:
      return false;
  }
}

/**
 * Gets the whole subgraph originating from a given node
 * The originating node is not included, but the edge(s) from the originating node is included
 * All further nodes and edges are included as well
 * @param node - originating node
 * @param currentNodes - list of current nodes
 * @param currentEdges - list of current edges
 * @returns a list of nodes and edges present in the subgraph
 */
export function GetSubgraph(
  node: Node,
  currentNodes: Node[],
  currentEdges: Edge[],
): BaseGraphState {
  let childNodes: Node[] = [];
  let childEdges: Edge[] = [];

  // get out-goers of the current node
  const children = getOutgoers(node, currentNodes, currentEdges);
  childNodes.push(...children);

  // get connected edges from the current node to children nodes
  const childrenEdges = getConnectedEdges(
    [node, ...children],
    currentEdges,
  ).filter((edge) => !(edge.target === node.id));
  childEdges.push(...childrenEdges);

  // for each child, find children recursively
  children.forEach((child) => {
    const { nodes, edges } = GetSubgraph(child, currentNodes, currentEdges);
    childNodes.push(...nodes);
    childEdges.push(...edges);
  });

  // make sure nodes and edges are unique
  childNodes = _.uniqBy(childNodes, "id");
  childEdges = _.uniqBy(childEdges, "id");

  return {
    nodes: childNodes,
    edges: childEdges,
  } as BaseGraphState;
}

/**
 * Given a node, returns its parent node
 * @param node - child node
 * @param currentNodes - list of current nodes
 * @param currentEdges - list of current edges
 * @returns parent node
 * @throws Error - if single parent for the node is not found, in such case, the node is invalid
 */
export function GetParentNode(
  node: Node,
  currentNodes: Node[],
  currentEdges: Edge[],
): Node {
  const incomingNodes = getIncomers(node, currentNodes, currentEdges);
  if (incomingNodes.length !== 1) {
    throw Error("Invalid node");
  }
  return incomingNodes[0];
}

/**
 * Given a node, returns its incoming edge
 * @param node - given node
 * @param connectedEdges - list of connected edges
 * @returns incoming edge
 * @throws Error - if no incoming edge found
 */
export function GetIncomingEdge(
  node: Node,
  connectedEdges: Edge[],
): Edge<EventSequenceEdgeProps> {
  const incomingEdge: Edge | undefined = connectedEdges.find(
    (edge) => edge.target === node.id,
  );
  if (incomingEdge === undefined) {
    throw Error("No incoming edge found");
  }
  return incomingEdge;
}

/**
 * Build an edge between an originating node and a destination node
 * @param fromNode - originating node
 * @param toNode - destination node
 * @param edgeType - type of edge
 * @param data - edge properties like label, etc
 * @returns the connecting edge
 */
export function BuildAnEdge(
  fromNode: Node,
  toNode: Node,
  edgeType: string | undefined,
  data: EventSequenceEdgeProps | undefined,
): Edge<EventSequenceEdgeProps> {
  return {
    id: `${fromNode.id}->${toNode.id}`,
    source: fromNode.id,
    target: toNode.id,
    type: edgeType,
    data: data,
  };
}

/**
 * Stores current state of the event sequence diagram
 * @param eventSequenceId - Event Sequence ID
 * @param nodes - list of current nodes
 * @param edges - list of current edges
 */
export function StoreEventSequenceDiagramCurrentState(
  eventSequenceId: string,
  nodes: Node[],
  edges: Edge[],
): void {
  const eventSequenceCurrentState: EventSequenceGraph = EventSequenceState({
    eventSequenceId: eventSequenceId,
    nodes: nodes,
    edges: edges,
  });

  void GraphApiManager.storeEventSequence(eventSequenceCurrentState).then(
    (r: EventSequenceGraph) => r,
  );
}

/**
 * Delete an event sequence node, check necessary validations before deleting the node
 * @param selectedNode - selected node to be deleted
 * @param currentNodes - list of current nodes
 * @param currentEdges - list of current edges
 * @returns List of nodes and edges which need to be updated,
 * along with a flag 'updateState' (if true, make API call as well).
 * The function returns undefined if the selected node cannot be deleted
 * @throws Error - if incoming or outgoing edge is not found for the node
 */
export function DeleteEventSequenceNode(
  selectedNode: Node<EventSequenceNodeProps, EventSequenceNodeTypes>,
  currentNodes: Node[],
  currentEdges: Edge[],
): OnUpdateGraphState | undefined {
  // if the selected node is already in an intermediate delete state, it cannot be deleted
  if (
    selectedNode.data.isDeleted === true ||
    selectedNode.data.tentative === true
  )
    return;

  const parentNode: Node = GetParentNode(
    selectedNode,
    currentNodes,
    currentEdges,
  );
  const connectedEdges: Edge[] = getConnectedEdges(
    [selectedNode],
    currentEdges,
  );

  // handle the functional node deletion in a different way, as the user needs to select which child will be retained
  // introduce an intermediate state of deletion by marking the whole subgraph as 'tentative'
  // and additionally mark the functional node to be deleted as 'isDeleted'
  if (selectedNode.type === "functional") {
    return GenerateTentativeState(
      "delete",
      selectedNode,
      currentNodes,
      currentEdges,
    );
  }

  // for description / intermediate node, delete the node and connect the parent node directly to its child node
  if (
    selectedNode.type === "description" ||
    selectedNode.type === "intermediate"
  ) {
    const incomingEdge: Edge<EventSequenceEdgeProps> = GetIncomingEdge(
      selectedNode,
      connectedEdges,
    );
    const outgoingEdges: Node[] = getOutgoers(
      selectedNode,
      currentNodes,
      currentEdges,
    );
    if (outgoingEdges.length < 1) {
      throw Error("Outgoing edge(s) not found");
    }

    const newEdge: Edge<EventSequenceEdgeProps> = BuildAnEdge(
      parentNode,
      outgoingEdges[0],
      incomingEdge.type,
      incomingEdge.data,
    );
    const newNodes: Node[] = currentNodes.filter(
      (n: Node) => !(n.id === selectedNode.id),
    );

    const newEdges: Edge[] = currentEdges
      .filter((edge) => !connectedEdges.some((e) => e.id === edge.id))
      .concat([newEdge]);

    return {
      nodes: newNodes,
      edges: newEdges,
      updateState: true,
    } as OnUpdateGraphState;
  }

  // for other types of nodes, simply return as they cannot be deleted
  return;
}

/**
 * Generate the tentative state when a functional node is either updated or deleted
 * @param mode - 'update' or 'delete'
 * @param selectedNode - selected functional node which has been updated or deleted
 * @param currentNodes - list of current nodes
 * @param currentEdges - list of current edges
 */
function GenerateTentativeState(
  mode: "update" | "delete",
  selectedNode: Node<EventSequenceNodeProps>,
  currentNodes: Node<EventSequenceNodeProps>[],
  currentEdges: Edge<EventSequenceEdgeProps>[],
): OnUpdateGraphState {
  const isUpdated = mode === "update";
  const isDeleted = mode === "delete";
  const { nodes, edges } = GetSubgraph(
    selectedNode,
    currentNodes,
    currentEdges,
  );
  const newNodes = currentNodes.map(
    (
      mappedNode: Node<EventSequenceNodeProps>,
    ): Node<EventSequenceNodeProps> => {
      if (nodes.find((childNode) => childNode.id === mappedNode.id)) {
        return {
          ...mappedNode,
          data: { tentative: true, label: mappedNode.data.label },
        };
      }
      if (mappedNode.id === selectedNode.id) {
        return {
          ...mappedNode,
          data: {
            ...mappedNode.data,
            tentative: true,
            isUpdated: isUpdated,
            isDeleted: isDeleted,
          },
        };
      }
      return mappedNode;
    },
  );
  const newEdges: Edge[] = currentEdges.map(
    (edge: Edge<EventSequenceEdgeProps>) => {
      if (edges.find((outgoingEdge) => outgoingEdge.id === edge.id)) {
        return { ...edge, data: { ...edge.data, tentative: true } };
      }
      return edge;
    },
  );
  return {
    nodes: newNodes,
    edges: newEdges,
    updateState: false,
  } as OnUpdateGraphState;
}

/**
 * Generate a new End State Node
 * @returns node object of newly generate End State node
 */
function GetEndStateNode(): Node<
  EventSequenceNodeProps,
  EventSequenceNodeTypes
> {
  return {
    id: GenerateUUID(),
    data: {
      label: "End State",
    },
    position: { x: 0, y: 0 },
    type: "end",
  };
}

/**
 * Generate a new End State edge
 * @returns edge object of newly generate edge
 */
function GetEndStateEdge(
  parentNodeId: string,
  childNodeId: string,
  label = "",
  order: number | undefined = undefined,
): Edge<EventSequenceEdgeProps> {
  const edge: Edge<EventSequenceEdgeProps> = {
    id: `${parentNodeId}->${childNodeId}`,
    source: parentNodeId,
    target: childNodeId,
    type: "normal",
  };
  if (label !== "") {
    edge.type = "functional";
    edge.data = { label: label, order: order };
  }
  return edge;
}

/**
 * Update an event sequence node, check necessary validations before updating the node
 * @param selectedNode - selected node to be updated
 * @param currentNodes - list of current nodes
 * @param currentEdges - list of current edges
 * @returns List of nodes and edges which need to be updated,
 * along with a flag 'updateState' (if true, make API call as well).
 * The function returns undefined if the selected node cannot be updated
 */
export function UpdateEventSequenceNode(
  selectedNode: Node<EventSequenceNodeProps, EventSequenceNodeTypes>,
  currentNodes: Node[],
  currentEdges: Edge[],
): OnUpdateGraphState | undefined {
  const childNodes = getOutgoers(selectedNode, currentNodes, currentEdges);
  const nodesToAdd: Node[] = [];
  const edgesToAdd: Edge[] = [];
  const nodesToRemove: Node[] = [];
  const edgesToRemove: Edge[] = [];

  if (selectedNode.type === "functional") {
    if (childNodes.length === 0) {
      // if no nodes present, add two end state nodes
      const child1 = GetEndStateNode();
      const child2 = GetEndStateNode();
      const edge1 = GetEndStateEdge(selectedNode.id, child1.id, "Yes", 1);
      const edge2 = GetEndStateEdge(selectedNode.id, child2.id, "No", 2);
      nodesToAdd.push(child1, child2);
      edgesToAdd.push(edge1, edge2);
    } else if (childNodes.length === 1) {
      // if 1 node present, update the existing node's label and add an end state node
      const existingEdge: Edge | undefined = currentEdges.find(
        (edge) => edge.source === selectedNode.id,
      );
      if (existingEdge) {
        edgesToRemove.push(existingEdge);
        edgesToAdd.push({
          id: existingEdge.id,
          source: existingEdge.source,
          target: existingEdge.target,
          type: "functional",
          data: { label: "Yes", order: 1 },
        });
      }
      const child2 = GetEndStateNode();
      const edge2 = GetEndStateEdge(selectedNode.id, child2.id, "No", 2);
      nodesToAdd.push(child2);
      edgesToAdd.push(edge2);
    } else if (childNodes.length === 2) {
      // update the edge labels of existing connections
      const existingEdges = currentEdges.filter(
        (edge) => edge.source === selectedNode.id,
      );
      edgesToRemove.push(...existingEdges);
      edgesToAdd.push(
        {
          id: existingEdges[0].id,
          source: existingEdges[0].source,
          target: existingEdges[0].target,
          type: "functional",
          data: { label: "Yes", order: 1 },
        },
        {
          id: existingEdges[1].id,
          source: existingEdges[1].source,
          target: existingEdges[1].target,
          type: "functional",
          data: { label: "No", order: 2 },
        },
      );
    }
  } else if (
    selectedNode.type === "description" ||
    selectedNode.type === "intermediate"
  ) {
    if (childNodes.length === 0) {
      // if no child nodes present, add an end state node
      const child = GetEndStateNode();
      const edge = GetEndStateEdge(selectedNode.id, child.id);
      nodesToAdd.push(child);
      edgesToAdd.push(edge);
    } else if (childNodes.length === 2) {
      // for a functional node, change the state of the subgraph to tentative so that
      // the user can select one of the child nodes to finalize the state
      return GenerateTentativeState(
        "update",
        selectedNode,
        currentNodes,
        currentEdges,
      );
    }
  } else if (
    selectedNode.type === "transfer" ||
    selectedNode.type === "end" ||
    selectedNode.type === "undeveloped"
  ) {
    // remove all child nodes present
    const { nodes, edges } = GetSubgraph(
      selectedNode,
      currentNodes,
      currentEdges,
    );
    nodesToRemove.push(...nodes);
    edgesToRemove.push(
      ...edges.filter((edge) => !(edge.target === selectedNode.id)),
    );
  }

  const updatedNodes: Node[] = currentNodes
    .filter((node) => !nodesToRemove.some((n) => n.id === node.id))
    .concat(nodesToAdd);

  const updatedEdges: Edge[] = currentEdges
    .filter((edge) => !edgesToRemove.some((e) => e.id === edge.id))
    .concat(edgesToAdd);

  return {
    nodes: updatedNodes,
    edges: updatedEdges,
    updateState: true,
  } as OnUpdateGraphState;
}

/**
 * Check if the provided nodes are siblings, check that they have a common parent node
 * @param node1 - Node 1
 * @param node2 - Node 2
 * @param nodes - List of current nodes
 * @param edges - List of current edges
 * @returns boolean - True if common parent found
 */
export function AreSiblings(
  node1: Node,
  node2: Node,
  nodes: Node[],
  edges: Edge[],
): boolean {
  const parentOfNode1: Node = GetParentNode(node1, nodes, edges);
  const parentOfNode2: Node = GetParentNode(node2, nodes, edges);

  return parentOfNode1.id === parentOfNode2.id;
}

/**
 * Get default node label, based on its type
 * @param nodeType - type of node
 * @returns string - Default node label
 */
export function GetDefaultLabelOfNode(
  nodeType: EventSequenceNodeTypes,
): string {
  switch (nodeType) {
    case "initiating":
      return "Initiating Event";
    case "end":
      return "End State";
    case "transfer":
      return "Transfer State";
    case "undeveloped":
      return "Undeveloped";
    case "functional":
      return "Functional";
    case "description":
      return "Description";
    case "intermediate":
      return "Intermediate";
    default:
      return "Invalid Node";
  }
}

/**
 * Update a label of the event sequence diagram
 * @param id - ID of either node or edge
 * @param label - New label
 * @param type - 'node' or 'edge' label
 */
export function UpdateEventSequenceLabel(
  id: string,
  label: string,
  type: string,
): void {
  void GraphApiManager.updateESLabel(id, label, type).then((r: boolean) => r);
}

/**
 * Check if the current graph state is tentative
 * (i.e. if the user has tried to delete or update a functional node
 * and has not finalized the process by selecting a child node)
 * @param nodes - current list of nodes
 * @param edges - current list of edges
 * @returns boolean
 */
export function IsCurrentStateTentative(nodes: Node[], edges: Edge[]): boolean {
  return !(
    nodes.findIndex(
      (n: Node<EventSequenceNodeProps>) => n.data.tentative === true,
    ) === -1 &&
    edges.findIndex(
      (e: Edge<EventSequenceEdgeProps>) => e.data?.tentative === true,
    ) === -1
  );
}

/**
 * Create a toast with the given type and message
 * @param type - type of toast (primary / warning / danger / success)
 * @param message - toast message text
 */
export function GetESToast(
  type: EuiToastProps["color"],
  message: string,
): Toast {
  return {
    id: GenerateUUID(),
    color: type,
    text: message,
  } as Toast;
}
