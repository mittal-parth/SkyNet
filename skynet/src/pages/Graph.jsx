import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import DiamondNodeComponent from '../components/DiamondNode';
import CenterNodeComponent from '../components/CenterNode';

import "reactflow/dist/style.css";

const nodeTypes = {
  diamondNode: DiamondNodeComponent,
  centerNode: CenterNodeComponent,
};

const initialNodes = [
  { id: '1', type: 'diamondNode', position: { x: 0, y: 0 } },
  { id: '2', type: 'centerNode', position: { x: 0, y: 0 } },
  { id: '3', type: 'diamondNode', position: { x: 0, y: 0 } },
];

// Calculate the center coordinates of the screen
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// Calculate the horizontal spacing
const sectionWidth = window.innerWidth / 3;
const horizontalSpacing = sectionWidth / 2; // Center of each section

// Adjust the positions of the nodes to be centered vertically
// and equally spaced horizontally
initialNodes.forEach((node, index) => {
  node.position.x = index * sectionWidth + horizontalSpacing;
  node.position.y = center.y;
});


const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

const defaultEdgeOptions = {
  animated: true,
  type: "bezier",
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "98vw", height: "93vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={defaultEdgeOptions}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        {/* <Panel position="bottom-center">
          Job is being initialised and peers notified!
        </Panel> */}
        <Background color="#ccc" variant="dots" />
      </ReactFlow>
    </div>
  );
}
