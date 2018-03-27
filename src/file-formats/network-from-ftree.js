/**
 * @file This file deals with creating a Network from FTree data.
 * The FTree data is typically generated from the function parseFTree.
 *
 * @see parseFTree
 * @see Network
 *
 * @author Anton Eriksson
 */

import * as Network from '../network';
import TreePath from 'treepath';
import { byFlow } from 'filter';


/**
 * Construct a network from ftree data
 *
 * @param {Object} ftree
 * @return {Network} the constructed network
 */
export default function networkFromFTree(ftree) {
    const root = Network.createNetwork('root');
    root.directed = ftree.meta.directed;
    const { tree, links } = ftree.data;

    // Create the tree structure
    links.forEach((node) => {
        if (node.path === 'root') {
            root.links = node.links;
        } else {
            const childNode = TreePath.toArray(node.path)
            .reduce((pathNode, childId) => {
                let child = Network.getNode(pathNode, childId);
                if (!child) {
                    child = Network.createNetwork(childId);
                    child.parent = pathNode;
                    child.path = TreePath.join(pathNode.path, child.id)
                    Network.addNode(pathNode, child);
                }
                return child;
            }, root);

            if (node.name) {
                childNode.name = node.name;
            }
            childNode.exitFlow = node.exitFlow;
            childNode.links = node.links;
        }
    });

    // Add the actual nodes
    tree.forEach((node) => {
        const path = TreePath.toArray(node.path);
        const childNode = Network.createNode(path.pop(), node.name, node.flow, node.node);

        const parent = path
            .reduce((pathNode, childId) => {
                pathNode.flow += node.flow;
                pathNode.largest.push(childNode);
                pathNode.largest.sort(byFlow);
                if (pathNode.largest.length > 4) {
                    pathNode.largest.pop();
                }
                return Network.getNode(pathNode, childId);
            }, root);

        parent.flow += node.flow;
        parent.largest.push(childNode);
        parent.largest.sort(byFlow);
        if (parent.largest.length > 4) {
            parent.largest.pop();
        }
        childNode.parent = parent;
        childNode.path = TreePath.join(parent.path, childNode.id)
        Network.addNode(parent, childNode);
    });

    Network.connectLinks(root);

    return root;
}
