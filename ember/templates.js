
Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, stack2, hashTypes, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("Start New Game");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("List Games");
  }

  data.buffer.push("<h2>Welcome to Commerce!</h2>\n<ul class=\"nav\">\n  <li>");
  hashTypes = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "new", options) : helperMissing.call(depth0, "linkTo", "new", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n  <li>");
  hashTypes = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "game_list", options) : helperMissing.call(depth0, "linkTo", "game_list", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n</ul>\n");
  return buffer;
  
});

Ember.TEMPLATES['friend_thumb'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<img 	");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': ("isCurrent")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n			");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("imageUrl")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(" \n			");
  hashTypes = {'title': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'title': ("displayName")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(" />\n");
  return buffer;
  
});

Ember.TEMPLATES['hex'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "currentPopulation", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" / ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "populationLimit", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"navbar\">\n	<span id=\"signinButton\">\n		<span\n		class=\"g-signin\"\n		data-callback=\"signinCallback\"\n		data-clientid=\"680890813233.apps.googleusercontent.com\"\n		data-cookiepolicy=\"single_host_origin\"\n		data-requestvisibleactions=\"http://schemas.google.com/AddActivity\"\n		data-scope=\"https://www.googleapis.com/auth/plus.login\">\n		</span>\n	</span>\n</div>		\n\n");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['game_list'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, options;
  data.buffer.push("\n	<li>\n		");
  hashTypes = {'itemViewClass': "STRING"};
  data.buffer.push(escapeExpression(helpers.each.call(depth0, "game.players", {hash:{
    'itemViewClass': ("App.FriendThumbView")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n		");
  hashTypes = {};
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["ID","ID"],hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "game", "game", options) : helperMissing.call(depth0, "linkTo", "game", "game", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n	</li>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("Open");
  }

  data.buffer.push("<h2>My Games</h2>\n<ul class=\"game-list\">\n");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "game", "in", "games", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</ul>\n");
  return buffer;
  
});

Ember.TEMPLATES['game'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n  <section ");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': (":currentTurn content.currentTurn.playerColor")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n    <h2>\n      <img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("content.currentTurn.playerPhoto")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n      ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.currentTurn.playerName", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      <div>Actions: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.currentTurn.actions", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n      <div>Buys: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.currentTurn.buys", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n    </h2>\n  </section>\n\n  <section class=\"main-layout\">\n    <section ");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': (":me content.color")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n      <h2><img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("content.photo")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n        ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.name", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      <h2>Gold: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.gold", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h2>\n\n      ");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "isActionPhase", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n      ");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "isBuyPhase", {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n      <section class=\"hand\">\n      ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.hand", {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </section>\n      <h2>Deck Count: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.deckCount", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h2>\n      <section class=\"discards\">\n      ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.discards", {hash:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </section>\n\n      <section class=\"hexes\">\n      ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.hexes", {hash:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("  \n      </section>\n\n      <h2>Trade Cards</h2>\n      <section class=\"trade-cards\">\n        ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.tradeCards", {hash:{},inverse:self.noop,fn:self.program(14, program14, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "hasCardsToRedeem", {hash:{},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </section>\n\n      <section class=\"technology-cards\">\n        ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.technologyCards", {hash:{},inverse:self.noop,fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </section>\n\n    </section>\n    <section class=\"others\">\n      ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.otherPlayers", {hash:{},inverse:self.noop,fn:self.program(20, program20, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </section>\n\n    <section class=\"log\">\n      ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.log", {hash:{},inverse:self.noop,fn:self.program(27, program27, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </section>\n  </section> <!-- end main-layout -->\n\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n      <section class=\"action-phase\">\n        It is your turn. Click a card to play it.\n        Or <button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "skip", "action", {hash:{},contexts:[depth0,depth0],types:["ID","STRING"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Skip Actions</button>.\n      </section>\n      ");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n      <section class=\"buy-phase\">\n        Click a card to buy it, or <button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "skip", "buy", {hash:{},contexts:[depth0,depth0],types:["ID","STRING"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Skip Buys</button>.\n        <h2>Bank</h2>\n        <h3>Nation Cards</h3>\n        <section class=\"bank\">\n        ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "stack", "in", "nationBank", {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </section>\n        \n        <h3>Technology Cards</h3>\n        <section class=\"bank\">\n        ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "stack", "in", "techBank", {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </section>\n      </section>\n      ");
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n          <section class=stack>\n            ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "stack", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n          </section>\n        ");
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n            ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("bank")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            ");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n        ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("hand")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      ");
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n        ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("discards")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      ");
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n        ");
  hashTypes = {'content': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HexView", {hash:{
    'content': ("")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      ");
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n          ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("tradeCards")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        ");
  return buffer;
  }

function program16(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n        <button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "redeem", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Redeem Trade Cards</button>\n        ");
  return buffer;
  }

function program18(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n          ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("technologyCards")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        ");
  return buffer;
  }

function program20(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push(" \n        <section ");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': (":other color")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n          <h2><img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("photo")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push("> ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h2>\n          Hand Size: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "handSize", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          Deck Size: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "deckSize", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          <section class=\"discards\">\n          ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "discards", {hash:{},inverse:self.noop,fn:self.program(21, program21, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n          </section>\n          <section class=\"hexes\">\n          ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "hexes", {hash:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("  \n          </section>\n          <section class=\"technology-cards\">\n          ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "technologyCards", {hash:{},inverse:self.noop,fn:self.program(25, program25, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n          </section>\n        </section>\n      ");
  return buffer;
  }
function program21(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n            ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("other-discards")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          ");
  return buffer;
  }

function program23(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n            ");
  hashTypes = {'content': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.HexView", {hash:{
    'content': ("")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          ");
  return buffer;
  }

function program25(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n            ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("other-technologyCards")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          ");
  return buffer;
  }

function program27(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n        <div class=log-entry>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "message", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>      \n      ");
  return buffer;
  }

function program29(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n  <!-- Ths is the trading phase. -->\n  <button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneTrading", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Done Trading</button>\n  <h2>Trading Phase - Your Trade Cards</h2>\n  <section class=\"trade-cards\">\n    ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.tradeCards", {hash:{},inverse:self.noop,fn:self.program(30, program30, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    ");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "readyToListOffer", {hash:{},inverse:self.noop,fn:self.program(32, program32, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </section>\n\n  <h2>Offers</h2>\n  <section class=\"offers\">\n    <canvas id=\"offerCanvas\">\n      \n    </canvas>\n    <ul class=\"my\">\n    ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.myOffers", {hash:{},inverse:self.noop,fn:self.program(34, program34, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </ul>\n    <ul class=\"other\">\n    ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.otherOffers", {hash:{},inverse:self.noop,fn:self.program(36, program36, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </ul>\n  </section>\n\n  <h2>Technology Cards</h2>\n  <section class=\"technology-cards\">\n    ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.technologyCards", {hash:{},inverse:self.noop,fn:self.program(38, program38, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </section>\n\n");
  return buffer;
  }
function program30(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n      ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("tradeCards")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    ");
  return buffer;
  }

function program32(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n    <button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "listOffer", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">List Trade Offer</button>\n    <button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelOffer", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Cancel Offer</button>\n    ");
  return buffer;
  }

function program34(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n      ");
  hashTypes = {'content': "ID",'source': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.OfferView", {hash:{
    'content': (""),
    'source': ("my")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    ");
  return buffer;
  }

function program36(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n      ");
  hashTypes = {'content': "ID",'source': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.OfferView", {hash:{
    'content': (""),
    'source': ("other")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    ");
  return buffer;
  }

function program38(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n      ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("technologyCards")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    ");
  return buffer;
  }

  data.buffer.push("<section class=notification-bar style=display:none>\n  ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "notification", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</section>\n");
  hashTypes = {};
  stack1 = helpers.unless.call(depth0, "isTrading", {hash:{},inverse:self.program(29, program29, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['new'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n		<li>\n				<img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("image.url")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "displayName", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n				<button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "uninvite", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Uninvite</button>\n		</li>\n		");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n		<li>\n				<img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("image.url")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "displayName", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n				<button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "invite", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Invite</button>\n		</li>\n		");
  return buffer;
  }

  data.buffer.push("<h2>Start a new game</h2>\n<button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "startGame", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Start!</button>\n<section class=\"players\">\n  <h3>Players</h3>\n	<ul>\n	");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "players", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</ul>\n</section>\n<section class=invitees>\n	<h3>Invite up to 3 friends to play with:</h3>\n	<ul>\n		");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "friends", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</ul>\n</section>\n");
  return buffer;
  
});

Ember.TEMPLATES['card'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n  <section class=\"set set1\">\n  ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "view.setValues1", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </section>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("<span class=set-value>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n  <p>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "description", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n");
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n  <p>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "cost", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" gold</p>\n");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n  <p>\n  ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "requires", {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </p>\n");
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n    ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" \n  ");
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n  <section class=\"set set3\">\n  ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "view.setValues3", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </section>\n");
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n  <section class=\"set set2\">\n  ");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "view.setValues2", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </section>\n");
  return buffer;
  }

  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "view.setValues1", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n<header>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</header>\n<img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("relImageUrl")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "description", {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "cost", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "requires", {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "view.setValues3", {hash:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "view.setValues2", {hash:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['offer'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n  ");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("offer")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  }

  data.buffer.push("<img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("playerPhoto")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(" ");
  hashTypes = {'title': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'title': ("playerName")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "id", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "cards", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});


