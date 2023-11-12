import React, { Component } from 'react';

class GraphComputationComponent extends Component {
  constructor(props) {
    super(props);
    
    const { initialNodes } = props;
    const graph = new Map();

    if (initialNodes) {
      for (const obj of initialNodes)
      {
        const { id } = obj;
        graph.set(id, []);
      }
    }
    this.state = {
      graph,
    };
  }
  
  addEdge = (node1Id, node2Id, weight) => {
    const { graph } = this.state;
    
    if (!graph.has(node1Id)) {
      console.log(node1Id);
      throw new Error("Node1 not found in the graph.");
    }
    if (!graph.has(node2Id)) {
      console.log(node2Id);
      throw new Error("Node2 not found in the graph.");
    }

    // Add an edge from node1 to node2 with the given weight
    graph.get(node1Id).push({ id: node2Id, weight });
    // graph.get(node2Id).push({ id: node1Id, weight });
    this.setState({ graph });
  }

  removeEdge = (node1Id, node2Id) => {
    const { graph } = this.state;
    
    if (!graph.has(node1Id) || !graph.has(node2Id)) {
      throw new Error("Node not found in the graph.");
    }

    // Remove the edge from node1 to node2
    graph.set(
      node1Id,
      graph.get(node1Id).filter((edge) => edge.id !== node2Id)
    );

    // If the graph is undirected, you should remove the edge from node2 to node1 as well.
    // graph.set(
    //   node2Id,
    //   graph.get(node2Id).filter((edge) => edge.id !== node1Id)
    // );

    this.setState({ graph });
  }

  getNeighbors = (nodeId) => {
    const { graph } = this.state;
    if (graph.has(nodeId)) {
      return graph.get(nodeId);
    }
    return [];
  }

  render() {
    return (
      <div>
        <button>Perform Computations</button>
      </div>
    );
  }
}

export default GraphComputationComponent;
