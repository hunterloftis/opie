var Welcome = React.createClass({
  render: function() {
    return (
      <section className='Welcome'>
        <header>
          <img className='Logo' />
        </header>
        <h1>Pathseer</h1>
        <p>
          Explore career paths that suit your interests using our <strong>interactive quiz</strong>.
          Use your results to connect with professional mentors and begin planning for your future!
        </p>
        <a className='Button' onClick={ this.props.onWelcomed }>Get Started!</a>
      </section>
    );
  }
});

var Question = React.createClass({
  getInitialState: function() {
    return {
      prompted: false,
      selectedAnswer: undefined
    };
  },

  onPromptClick: function() {
    this.setState({ prompted: true });
  },

  onAnswerClick: function(choice) {
    return function() {
      this.props.onAnswer(choice);
      this.setState({ prompted: false });
    }.bind(this);
  },

  renderPrompt: function(prompt) {
    return (
      <section className='Question' onClick={ this.onPromptClick }>
        <p className='Question-prompt'>{ prompt }</p>
        <p className='Question-hint'>Tap card to select answer</p>
      </section>
    );
  },

  renderOptions: function(options) {
    return (
      <section className='Answers'>
        <p>Tap corners to select answer</p>
        <div className='Options'>
          <a className='Answer-nw' onClick={ this.onAnswerClick(0) } >{ options[0] }</a>
          <a className='Answer-ne' onClick={ this.onAnswerClick(1) } >{ options[1] }</a>
          <a className='Answer-sw' onClick={ this.onAnswerClick(2) } >{ options[2] }</a>
          <a className='Answer-se' onClick={ this.onAnswerClick(3) } >{ options[3] }</a>
        </div>
      </section>
    );
  },

  render: function() {
    if (!this.state.prompted) return this.renderPrompt(this.props.data.prompt);
    else return this.renderOptions(this.props.data.options);
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      hasBeenWelcomed: false,
      answers: [],
      remainingQuestions: [
        {
          prompt: 'Given your current background, what path would you choose for higher education?',
          options: [
            'Traditional (2 or 4 year college)',
            'Trade school; community college',
            'Self-teach',
            'Undecided or none'
          ]
        },{
          prompt: 'Which of the following work environments appeals to you most?',
          options: [
            'Traveling to different locations',
            'Collaborative, open office architecture',
            'Private work-area with fewer interactions',
            'Outdoor (no office)'
          ]
        }
      ]
    };
  },

  onWelcomed: function() {
    this.setState({ hasBeenWelcomed: true });
  },

  onAnswer: function(choice) {
    var question = this.getQuestion();
    var newAnswer = {
      prompt: question.prompt,
      answer: question.options[choice]
    };
    this.setState({
      answers: this.state.answers.concat([ newAnswer ]),
      remainingQuestions: this.state.remainingQuestions.slice(1)
    });
  },

  getQuestion: function() {
    return this.state.remainingQuestions[0];
  },

  render: function() {
    var screen;
    if (!this.state.hasBeenWelcomed) {
      screen = <Welcome onWelcomed={ this.onWelcomed } />;
    }
    else if (this.getQuestion()) {
      screen = <Question data={ this.getQuestion() } onAnswer={ this.onAnswer } />
    }

    return (
      <div className='wrap'>
        { screen }
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('container'));
