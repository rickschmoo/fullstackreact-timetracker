const TimersDashboard = React.createClass({
  getInitialState: function () {
    return {
      timers: [
        {
          title: 'Practice squat',
          project: 'Gym Chores',
          id: uuid.v4(),
          elapsed: 5456099,
          runningSince: Date.now(),
        },
        {
          title: 'Bake squash',
          project: 'Kitchen Chores',
          id: uuid.v4(),
          elapsed: 1273998,
          runningSince: null,
        },
      ],
    };
  },

  handleEditFormSubmit: function (attrs) {
    this.updateTimer(attrs);
  },

  handleCreateFormSubmit: function (timer) {
    this.createTimer(timer);
  },

  handleTimerDelete: function (timer) {
    this.deleteTimer(timer);
  },

  updateTimer: function (attrs) {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project,
          });
        } else {
          return timer;
        }
      }),
    });
  },

  deleteTimer: function (attrs) {
    console.log(JSON.parse(JSON.stringify(attrs)));
    console.log('Deleting timer');
    for (var i=0; i < this.state.timers.length; i++) {
      console.log('Testing ' + this.state.timers[i].id);
      if (this.state.timers[i].id === attrs.id) {
        console.log('... at index ' + i);
        this.state.timers.splice(i, 1);
      }
    }
    this.setState({
      timers: this.state.timers
    });
  },

  // Note Single Responsibility Principle
  createTimer: function (timer) {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t),
    });
  },

  render: function () {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onTimerDelete={this.handleTimerDelete}
          />
          <ToggleableTimerForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    );
  },
});

const EditableTimerList = React.createClass({
  render: function () {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onTimerDelete={this.props.onTimerDelete}
      />
    ));
    return (
      <div id='timers'>
        {timers}
      </div>
    );
  },
});


const EditableTimer = React.createClass({

  getInitialState: function () {
    return {
      editFormOpen: false,
    };
  },

  handleEditClick: function () {
    this.openForm();
  },

  handleFormClose: function () {
    this.closeForm();
  },

  handleTrashClick: function (timer) {
    this.props.onTimerDelete(timer);
  },

  handleSubmit: function (timer) {
    this.props.onFormSubmit(timer);
    this.closeForm();
  },

  closeForm: function () {
    this.setState({ editFormOpen: false });
  },

  openForm: function () {
    this.setState({ editFormOpen: true });
  },

  render: function () {
    if (this.state.editFormOpen) {
      return (
        <TimerForm
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <Timer
          title={this.props.title}
          id={this.props.id}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
          onEditClick={this.handleEditClick}
          onTrashClick={this.handleTrashClick}
        />
      );
    }
  },
});

const TimerForm = React.createClass({

  handleSubmit: function () {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.refs.title.value,
      project: this.refs.project.value,
    });
  },

  render: function () {
    const submitText = this.props.id ? 'Update' : 'Create';
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              <input type='text' ref='title' defaultValue={this.props.title} />
            </div>
            <div className='field'>
              <label>Project</label>
              <input type='text' ref='project' defaultValue={this.props.project} />
            </div>
            <div className='ui two bottom attached buttons'>
              <button className='ui basic blue button' onClick={this.handleSubmit}>
                {submitText}
              </button>
              <button className='ui basic red button'onClick={this.props.onFormClose} >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const ToggleableTimerForm = React.createClass({

  getInitialState: function () {
    return {
      isOpen: false,
    };
  },

  handleFormOpen: function () {
    this.setState({ isOpen: true });
  },

  handleFormClose: function () {
    this.setState({ isOpen: false });
  },

  handleFormSubmit: function (timer) {
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  },

  render: function () {
    if (this.state.isOpen) {
      return (
        <TimerForm
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button
            className='ui basic button icon'
            onClick={this.handleFormOpen}>
            <i className='plus icon'></i>
          </button>
        </div>
      );
    }
  },
});

const Timer = React.createClass({

  onTrashClick: function () {
    this.props.onTrashClick({
      id: this.props.id,
    });
  },

  render: function () {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed);
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='header'>
            {this.props.title}

          </div>
          <div className='meta x-small'>
            <div>
              {this.props.project} 
            </div>
            <div>
              {this.props.id}
            </div>
          </div>
          <div className='center aligned description'>
            <h2>
              {elapsedString}
            </h2>
            
          </div>
          <div className='extra content'>
            <span
              className='right floated edit icon'
              onClick={this.props.onEditClick}
            >
              <i className='edit icon'></i>
            </span>
            <span className='right floated trash icon' onClick={this.onTrashClick}>
              <i className='trash icon'></i>
            </span>
          </div>
        </div>
        <div className='ui bottom attached blue basic button'>
          Start
        </div>
      </div>
    );
  },
});

ReactDOM.render(
  <TimersDashboard />,
  document.getElementById('content')
);
