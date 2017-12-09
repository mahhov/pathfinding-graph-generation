# Interactive Pathfinding Using Runtime Generated Graph

## Description

see title.

## Technical description

The demo's purpose is to showcase how to use A* pathfinding when the moving-agents are not constrained to move rook-like (horizontal/vertical only). If we were to go with the simplest solution, i.e. creating a graph with all moveable map locations as nodes, and all nodes with direct line of sight of each other as connecting edges, then we would have much worse performance. Instead, we filter the graph nodes, only adding those nodes that are "important," e.g. could possible be a "turning point" in any path found. These "important" nodes are the cyan colored squares in the demo, and, as you can see, they are much much sparse than the collection of all the map's moveable locations. With the map sizes of the demo (50 x 50), the maps have 2500 total spaces, of which ~400-600 are moveable; while the generated graph only has ~30-80 nodes. I.e., we're filtering out ~88-92% of all possible nodes, which results in an even more drastically reduced number of edges our generated graph will have.

## Interactive Demo

https://path-finding-graph-generation.herokuapp.com

## Demos

![demo gif 1](../master/gifys/basic.gif)

![demo gif 2](../master/gifys/basic2.gif)

![demo gif 3](../master/gifys/spiral.gif)

![demo gif 4](../master/gifys/random.gif)

![demo gif 4](../master/gifys/house.gif)
