import React, { Component } from 'react';
import { Sidebar, Rail, Menu, Icon, Input, Grid, Label } from 'semantic-ui-react';
import Help from './Help';
import SelectedNode from './SelectedNode';
import Search from './Search';
import FileDialog from './FileDialog';
import NetworkNavigator from './NetworkNavigator';
import Tree from './Tree';


export default class TwoColumnLayout extends Component {
    state = {
        sidebarVisible: false,
        loadingComplete: false,
        filename: '',
        network: null,
        selectedNode: null,
        searchFunction: () => [],
    }

    toggleSidebar = () => this.setState({ sidebarVisible: !this.state.sidebarVisible });
    setSelectedNode = selectedNode => this.setState({ selectedNode });
    setSearchFunction = searchFunction => this.setState({ searchFunction });
    onFileLoaded = ({ network, filename }) => this.setState({
        network,
        filename,
        sidebarVisible: true,
        loadingComplete: true,
    });

    render() {
        const mainContent = this.state.loadingComplete
            ? <div>
                <Rail attached internal position='right'>
                    <Label as='a'
                        attached='top right'
                        icon='sidebar'
                        content='Show sidebar'
                        onClick={this.toggleSidebar} />
                </Rail>
                <NetworkNavigator
                    network={this.state.network}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    searchFunction={this.setSearchFunction}
                    selectedNode={this.setSelectedNode} />
            </div>
            : <FileDialog onFileLoaded={this.onFileLoaded} />

        return (
            <Sidebar.Pushable>
                <Sidebar
                    style={{ overflow: 'scroll!important' }}
                    as={Menu}
                    animation='overlay'
                    width='wide'
                    direction='right'
                    visible={this.state.sidebarVisible}
                    vertical>
                    <Menu.Item onClick={this.toggleSidebar} icon='close' content='Close' />
                    <Menu.Item>
                        <Input readOnly label='Filename' value={this.state.filename} />
                    </Menu.Item>
                    <Menu.Item>
                        <Search searchFunction={this.state.searchFunction} maxResults={15} />
                    </Menu.Item>
                    <SelectedNode node={this.state.selectedNode} directed={this.state.network ? this.state.network.directed : false} />
                    {this.state.network != null &&
                        <Tree network={this.state.network} />
                    }
                    <Help trigger={<Menu.Item><Icon name='help' />Help</Menu.Item>} />
                    <Menu.Item as={'a'} href='https://github.com/mapequation/map-visualize'>
                        <Icon name='github' />Source code
                    </Menu.Item>
                </Sidebar>
                <Sidebar.Pusher as={Grid} padded>
                    <Grid.Column align='center' style={{ height: '100%', paddingTop: 0, paddingLeft: 0 }}>
                        {mainContent}
                    </Grid.Column>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}
