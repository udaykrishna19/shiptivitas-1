import React, { Component, useRef, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import HomeTab from './HomeTab';
import Navigation from './Navigation';
import Board from './Board';
import Dragula from 'react-dragula';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      tasks: [
        // Add your tasks here
        { id: 'task-1', content: 'Task 1', lane: 'backlog' },
        // ...
      ],
      lanes: [
        { id: 'backlog', title: 'Backlog', color: 'grey' },
        { id: 'in-progress', title: 'In Progress', color: 'blue' },
        { id: 'complete', title: 'Complete', color: 'green' },
      ],
    };
    this.laneRefs = React.createRef({});
  }

  componentDidMount() {
    this.drake = Dragula(Object.values(this.laneRefs.current));

    this.drake.on('drop', (el, target, source, sibling) => {
      const taskId = el.getAttribute('data-id');
      const targetLaneId = target.getAttribute('data-id');
      const sourceLaneId = source.getAttribute('data-id');

      this.setState({
        tasks: this.state.tasks.map(task => (
          task.id === taskId ? { ...task, lane: targetLaneId } : task
        )),
      });

      this.drake.cancel(true);
    });
  }

  componentWillUnmount() {
    this.drake.destroy();
  }

  renderShippingRequests() {
    return (
      <div className="App">
        {this.state.lanes.map(lane => (
          <div
            key={lane.id}
            data-id={lane.id}
            ref={ref => this.laneRefs.current[lane.id] = ref}
            className={`Swimlane-column ${lane.id}`}
            style={{ backgroundColor: lane.color }}
          >
            <h2>{lane.title}</h2>
            {this.state.tasks.filter(task => task.lane === lane.id).map(task => (
              <div
                key={task.id}
                data-id={task.id}
                className="task"
              >
                {task.content}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  renderNavigation() {
    return (<Navigation
      onClick={(tabName) => this.changeTab(tabName)}
      selectedTab={this.state.selectedTab}
      />);
  }

  renderTabContent() {
    switch(this.state.selectedTab) {
      case 'home':
      default:
        return HomeTab();
      case 'shipping-requests':
        return this.renderShippingRequests();
    }
  }

  render() {
    return (
      <div className="App">
        {this.renderNavigation()}

        <div className="App-body">
          {this.renderTabContent()}
        </div>
      </div>
    );
  }

  changeTab(tabName) {
    this.setState({
      selectedTab: tabName,
    });
  }
}

export default App;
