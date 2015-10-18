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

var CompletedCircle = React.createClass({
  render: function() {
    var val = this.props.value;
    var percent = Math.floor(100 * val) + '%';
    var rad = 85;
    var startAngle = 0;
    var startX = 90 + Math.cos(startAngle) * rad;
    var startY = 90 + Math.sin(startAngle) * rad;
    var endAngle = (Math.PI * 2) * Math.min(val, .999);
    var endX = 90 + Math.cos(-endAngle) * rad;
    var endY = 90 + Math.sin(-endAngle) * rad;
    var largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    var path = 'M ' + endX + ' ' + endY + ' A ' + rad + ' ' + rad + ' 0 ' + largeArc + ' 1 ' + startX + ' ' + startY;

    return (
      <figure className='CompletedCircle' onClick={ this.props.onClick }>
        <p className='CompletedCircle-question'>?</p>
        <p className='CompletedCircle-label'>completed</p>
        <p className='CompletedCircle-value'>{ percent }</p>
        <svg className='CompletedCircle-svg' width="180px" height="180px" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d={ path } stroke="#909" strokeWidth="6" fillOpacity="0" />
        </svg>
      </figure>
    );
  }
})

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

  renderOptions: function(options, completed) {
    return (
      <section className='Answers'>
        <p>Tap corners to select answer</p>
        <div className='Options'>
          <a className='Answer-nw' onClick={ this.onAnswerClick(0) } >{ options[0] }</a>
          <a className='Answer-ne' onClick={ this.onAnswerClick(1) } >{ options[1] }</a>
          <a className='Answer-sw' onClick={ this.onAnswerClick(2) } >{ options[2] }</a>
          <a className='Answer-se' onClick={ this.onAnswerClick(3) } >{ options[3] }</a>
          <CompletedCircle value={ completed } />
        </div>
      </section>
    );
  },

  renderCompleted: function(completed) {
    return (
      <section className='Answers'>
        <div className='Options'>
          <a className='Answer-nw' />
          <a className='Answer-ne' />
          <a className='Answer-sw' />
          <a className='Answer-se' />
          <CompletedCircle value={ completed } onClick={ this.props.onCenter }/>
        </div>
      </section>
    );
  },

  render: function() {
    if (!this.props.data && this.props.completed) {
      return this.renderCompleted(this.props.completed);
    }
    if (!this.state.prompted) {
      return this.renderPrompt(this.props.data.prompt);
    }
    return this.renderOptions(this.props.data.options, this.props.completed);
  }
});

var Recommendation = React.createClass({
  getRecommendation: function(answers) {
    // TODO: here is where you calculate what to recommend based on the answers provided
    return {
      image: undefined,
      category: 'Career Category',
      tagline: 'Tagline',
      description: [
        'A graphic designer is responsible for creating design solutions that have a high visual impact.',
        'The role involves listening to clients and understanding their needs.'
      ].join('')
    };
  },

  render: function() {
    var rec = this.getRecommendation(this.props.answers);
    return (
      <section className='Recommendation'>
        <img src={ rec.image } />
        <h1>{ rec.category }</h1>
        <h2>{ rec.tagline }</h2>
        <p>{ rec.description }</p>
      </section>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      hasBeenWelcomed: false,
      hasCompleted: false,
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
        },{
          prompt: 'How do you currently research career opportunities that relate to your interests?',
          options: [
            'Online personal network',
            'Public job board',
            'Internet search',
            "I don't know where to look"
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

  getCompleted: function() {
    var answers = this.state.answers.length;
    var questions = this.state.remainingQuestions.length;
    return answers / (answers + questions);
  },

  complete: function() {
    this.setState({
      hasCompleted: true
    });
  },

  render: function() {
    var screen;
    if (!this.state.hasBeenWelcomed) {
      screen = <Welcome onWelcomed={ this.onWelcomed } />;
    }
    else if (this.getQuestion()) {
      screen = <Question data={ this.getQuestion() } onAnswer={ this.onAnswer } completed={ this.getCompleted() } />
    }
    else if (!this.state.hasCompleted) {
      screen = <Question completed={ 1 } onCenter={ this.complete }/>
    }
    else {
      screen = <Recommendation answers={ this.state.answers } />
    }

    return (
      <div className='wrap'>
        { screen }
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('container'));
