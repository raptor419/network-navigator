/**
 * @file This file dictates the appearance of the rendered network.
 *
 * @author Anton Eriksson
 */

import {
    scaleSqrt,
    interpolateGreens,
    interpolateBlues,
} from 'd3';


/**
 * Factory function to create style functions.
 *
 * @example
 *  const style = makeRenderStyle(maxNodeFlow, maxLinkFlow);
 *  const circle = svg.append('circle')
 *      .attr('r', style.nodeRadius)
 *      .style('fill', style.nodeFillColor)
 *      .style('stroke', style.nodeBorderColor)
 *      .style('stroke-width', style.nodeBorderWidth);
 *
 * @param {number} maxNodeFlow the max flow for nodes
 * @param {number} maxLinkFlow the max flow for links
 * @return {Object} an object with render style accessors
 */
export default function makeRenderStyle(maxNodeFlow, maxLinkFlow) {
    const nodeFill = [interpolateGreens(2/9), interpolateGreens(3/9)];
    const nodeBorder = [interpolateGreens(3/9), interpolateGreens(6/9)];
    const linkFill = [interpolateBlues(2/9), interpolateBlues(6/9)];

    const nodeFillColor = scaleSqrt().domain([0, maxNodeFlow]).range(nodeFill);
    const nodeBorderColor = scaleSqrt().domain([0, maxNodeFlow]).range(nodeBorder);
    const nodeRadius = scaleSqrt().domain([0, maxNodeFlow]).range([5, 70]);
    const nodeBorderWidth = scaleSqrt().domain([0, maxNodeFlow]).range([1, 10]);

    const linkFillColor = scaleSqrt().domain([0, maxLinkFlow]).range(linkFill);
    const linkWidth = scaleSqrt().domain([0, maxLinkFlow]).range([0, 8]);

    const searchMarkRadius = scaleSqrt().domain([0, 10]).range([0, 10]).clamp(true);

    return {
        nodeRadius: node => nodeRadius(node.flow),
        nodeFillColor: node => nodeFillColor(node.flow),
        nodeBorderColor: node => nodeBorderColor(node.exitFlow),
        nodeBorderWidth: node => nodeBorderWidth(node.exitFlow),
        linkFillColor: link => linkFillColor(link.flow),
        linkWidth: link => linkWidth(link.flow),
        searchMarkRadius: node => node.visible ? 0 : searchMarkRadius(node.searchHits || 0),
    };
}
