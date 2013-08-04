/** @jsx React.DOM */
require(['react', 'jsx!views/card'], function (React, Card) {
  React.renderComponent(
    <div>
      <Card name="One Colonist"/>
    </div>,
    document.getElementById("example"));
});
