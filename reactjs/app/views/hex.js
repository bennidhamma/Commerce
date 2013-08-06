/** @jsx React.DOM */
define(['react', 'game', 'jsx/card', 'pubsub'], 
    function(React, gameServer, Card, Events) {
  var Hex = React.createClass({
    getInitialState: function () {
      return this.props.data;
    },

    click: function(evt) {
      console.log('click', this, evt);
    },

    render: function() {
      return (
        <div class={"hex " + (this.state.hasColony ? "has-colony" : "")} onClick={this.click}>
          {this.state.currentPopulation} / {this.state.populationLimit}
        </div>
      );
    }
  });

  return Hex;
});
