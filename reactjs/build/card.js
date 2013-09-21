/** @jsx React.DOM */
define(['react', 'game', 'pubsub'], function (React, gameServer, Events) {

  var cards = null;
  var waitingCards = [];

  function dasherize (str) {
    return str && str.toLowerCase().replace(/[ _&!.]/g, '-');
  }

  Events.subscribe('game', function(game) {
    gameServer.getCards(function(resp) {
      cards = {
        "unknown": {type: 'unknown'}
      };
      for (var i = 0; i < resp.length; i++) {
        var card = resp[i];
        cards[card.name] = card;
      }
      for (var i = 0; i < waitingCards.length; i++) {
        var card = waitingCards[i];
        try {
          card.state.info = cards[card.props.name];
          card.setState(card.state);
        }
        catch (e) {
          console.error(e.message);
        }
      }
      waitingCards = [];
      Events.publish('/cards/loaded', [cards]);
    });
  });

  var Card = React.createClass ({displayName: 'Card',
    getInitialState: function () {
      if (!cards) {
        waitingCards.push(this);
        return {};
      }
      return {info: cards[this.props.name]};
    },

    unfocus: function () {
      if (this.isMounted())
        this.setState({focused: false, dragY: undefined, startDragY: undefined});
    },

    focus: function(evt) {
      var publish = false;
      if (this.state.focused) {
        //this.setState({focused: false}); 
        //publish = true;
      } else {
        this.setState({focused: true}); 
        setTimeout(this.unfocus, 4000);
        // Publish click if this is a trade card, because that's probably the user's intent.
        publish = this.state.info.tradeValues;
      }
      if (publish)
        this.select(evt);
    },

    select: function(evt) {
      if (!this.props.selectable)
        return;
      var x = evt.touches[0].pageX;
      var y = evt.touches[0].pageY;
      if (this.state.startDragY) {
        if (this.state.startDragY - y > 50) {
          Events.publish('/card/selected', [this.props.name, this.props.cardSource, this.state.info, this]);
          this.setState({focused: false, dragging: false});
          return false;
        }
      } else {
        this.setState({dragging: true, startDragY: y})
      }
      this.setState({draggin: true, dragY: y})
      return false;
    },

    markAsPlayed: function() {
      this.setState({played: true});
    },

    renderSetValues: function (start, end) {
      var values = this.state.info.tradeValues;
      var set = [];
      for (var i = start; i < end && i < values.length; i++) {
        set.push(React.DOM.span( {key:'sv-' + i, className:"set-value"}, values[i]));
      }
      return set;
    },

    render: function () {
      var s = this.state.info;
      if (!s) {
        return React.DOM.div( {onClick:this.click, className:"card"});
      }
      var elems = [];
      var style = {};
      var classes = ["card", dasherize(s.type), dasherize(s.category), dasherize(s.name)];
      var length = 0;
      if (this.props.cssClass) {
        classes.push(this.props.cssClass);
      }
      if (this.props.selected)
        classes.push("selected");
      if (this.props.secret)
        classes.push("secret");
      if (this.state.startDragY) {
        style.top = this.state.dragY - this.state.startDragY + 'px';
      }
      if (this.state.played) {
        classes.push('played');
      }
      if (this.props.height) {
        style.borderBottom = 4 * this.props.height + 'px solid #333';
      }
      if (!this.props.faux) {
        classes.push('expandable');

        var requires = [];
        if (s.cost) {
          requires.push(s.cost + " gold");
          if (s.requires) {
            requires = requires.concat(s.requires);
            requires = requires.join(', ').replace(/\|/g, ' or ');
            length += requires.length;
          }
        }
        
        if (s.tradeValues)  {
          elems.push(React.DOM.section( {key:"s1", className:"set set1"}, this.renderSetValues(0, 4)));
          elems.push(React.DOM.h1(null, s.tradeValues[0]));
        }
        elems.push(React.DOM.header( {key:"h"}, s.name));
        if (s.imageUrl) {
          if (s.tradeValues) {
            style = {"backgroundImage":"url(/images/trade/" + s.imageUrl.replace(/ /g, '-') + ")"};
          } else {
            elems.push(React.DOM.img( {key:"i", src:"/images/card/" + s.imageUrl}))
          }
        }
        if (s.description)  {
          length += s.description.length;
          elems.push(React.DOM.section( {key:"d", className:"info"}, 
              React.DOM.p( {className:"description"}, s.description),
              React.DOM.div( {className:"purchase-info"}, 
                requires
              )
            ));
        }
        if (s.tradeValues && s.tradeValues.length > 8)
          elems.push(React.DOM.section( {key:"s2", className:"set set3"}, this.renderSetValues(8, 12)));
        if (s.tradeValues && s.tradeValues.length > 3)
          elems.push(React.DOM.section( {key:"s3", className:"set set2"}, this.renderSetValues(4, 8)));
        if (length > 100)
          classes.push("dense");
        else if (length < 40)
          classes.push("sparse");
      }
      return React.DOM.div( {onTouchStart:this.focus, onTouchEnd:this.unfocus, onClick:this.focus, onTouchMove:this.select, className:classes.join(' '), style:style}, 
        elems
      );
    },
  });

  return Card;
});
