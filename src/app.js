import * as d3 from 'd3';
import dat from 'dat.gui';
import render from 'render';
import { parseFile, parseFTree, createTree } from 'parser';
import lumpNodes from 'transform';


function renderTree(tree) {
    console.log(tree);

    const lumping = {
        lumpFactor: 0.3,
    };

    const path = {
        path: 'root',
    };

    const renderParams = {
        renderLump: false,
        linkDistance: 100,
        charge: 1000,
    };

    const renderBranch = () => {
        d3.select('svg').selectAll('*').remove();
        const branch = tree.getNode(path.path).clone();
        lumpNodes(branch, lumping.lumpFactor);
        render(branch, renderParams);
    };

    const gui = new dat.GUI();
    gui.add(lumping, 'lumpFactor', 0, 1).step(0.05).onFinishChange(renderBranch);
    gui.add(renderParams, 'renderLump').onChange(renderBranch);
    gui.add(renderParams, 'linkDistance', 50, 500).step(25).onFinishChange(renderBranch);
    gui.add(renderParams, 'charge', 0, 2000).step(100).onFinishChange(renderBranch);
    gui.add(path, 'path').onFinishChange(renderBranch);

    renderBranch();
}

fetch('data/stockholm.ftree')
    .then(res => res.text())
    .then(parseFile)
    .then(d => parseFTree(d.data))
    .then(d => createTree(d.data.tree, d.data.links))
    .then(renderTree)
    .catch(err => console.error(err));
