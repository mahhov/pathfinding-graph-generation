var _ = require('underscore');

function main() {
  graph = [];
  nodeStart = addNode('nodeStart', 0);
  nodeA = addNode('nodeA', 9);
  nodeB = addNode('nodeB', 10);
  nodeEnd = addNode('nodeEnd', 0);

  connect(nodeStart, nodeA, 1);
  connect(nodeStart, nodeB, 4);
  connect(nodeA, nodeB, 1);
  connect(nodeB, nodeEnd, 50);

  path = aStar(graph, nodeStart, nodeEnd);

  console.log(path);
}

function addNode(name, h) {
  node = {name: name, h: h, connected: []};
  graph.push(node);
  return node
}

function connect(nodeA, nodeB, distance) {
  nodeA.connected.push({neighbor: nodeB, distance: distance});
  nodeB.connected.push({neighbor: nodeA, distance: distance});
}

function aStar(graph, start, goal) {
  _.each(graph, node => {
    node.g = Infinity;
    node.f = Infinity;
    node.open = false;
    node.closed = false;
  });

  start.g = 0;
  start.f = start.h;
  start.open = true;
  openCount = 1

  while (openCount > 0) {
    current = null;
    _.each(graph, (node) => {
      if (node.open && (!current || node.f < current.f))
      current = node;
    });

    if (current === goal)
      return reconstructPath(current);

    openCount--;
    current.open = false;
    current.closed = true;

    _.each(current.connected, connection => {
      if (connection.neighbor.closed)
        return;

      if (!connection.neighbor.open) {
        openCount++;
        connection.neighbor.open = true;
      }

      g = current.g + connection.distance;
      if (g >= connection.neighbor.g)
        return;

      connection.neighbor.cameFrom = current;
      connection.neighbor.g = g;
      connection.neighbor.f = g + connection.neighbor.h;
    });

  }

  return null;
}

function reconstructPath(current) {
  totalPath = [current.name];
  while (current.cameFrom) {
    current = current.cameFrom;
    totalPath.push(current.name);
  }
  return totalPath;
}

main();
