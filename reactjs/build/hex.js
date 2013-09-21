/** @jsx React.DOM */
define(['react', 'game', 'jsx/card', 'pubsub'], 
    function(React, gameServer, Card, Events) {
  var Hex = React.createClass({displayName: 'Hex',
    getInitialState: function () {
      return this.props.data;
    },

    click: function(evt) {
      console.log('click', this, evt);
      Events.publish ('/hex/selected', [this.state.id], this);
    },

    render: function() {
      this.state = this.props.data;
      return (
        React.DOM.div( {className:"hex " + (this.state.hasColony ? "has-colony" : ""), onClick:this.click}, 
          this.state.currentPopulation, " / ", this.state.populationLimit
        )
      );
    }
  });

  return Hex;
});
