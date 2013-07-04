
Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<h2>Welcome to Commerce!</h2>\n<p>Login with Google Plus to get started.</p>\n");
  
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

Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, stack2, hashTypes, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("Commerce!");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("Start New Game");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("List Games");
  }

  data.buffer.push("<div class=\"navbar\">\n	<div class=\"navbar-inner\">\n		<span class=\"brand\">");
  hashTypes = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "linkTo", "index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</span>\n		<ul class=\"nav\">\n			<li>");
  hashTypes = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "new", options) : helperMissing.call(depth0, "linkTo", "new", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n			<li>");
  hashTypes = {};
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "game_list", options) : helperMissing.call(depth0, "linkTo", "game_list", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n		</ul>\n	</div>\n	<span id=\"signinButton\">\n		<span\n		class=\"g-signin\"\n		data-callback=\"signinCallback\"\n		data-clientid=\"680890813233.apps.googleusercontent.com\"\n		data-cookiepolicy=\"single_host_origin\"\n		data-requestvisibleactions=\"http://schemas.google.com/AddActivity\"\n		data-scope=\"https://www.googleapis.com/auth/plus.login\">\n		</span>\n	</span>\n</div>		\n\n");
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
  
  var buffer = '', hashTypes;
  data.buffer.push("\n	");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("hand")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n	<div ");
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': (":hex hasColony")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n		");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "currentPopulation", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" / ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "populationLimit", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n	</div>\n	");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n	");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("discards")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n<section class=\"action-phase\">\n	It is your turn. Double click a card to play it.\n	Or <button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "skip", "action", {hash:{},contexts:[depth0,depth0],types:["ID","STRING"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Skip Actions</button>.\n</section>\n");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n<section class=\"buy-phase\">\n	Double click a card to buy it, or <button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "skip", "buy", {hash:{},contexts:[depth0,depth0],types:["ID","STRING"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Skip Buys</button>.\n	<h2>Bank</h2>\n	<section class=\"bank\">\n	");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "stack", "in", "bank", {hash:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</section>\n</section>\n");
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = '', stack1, hashTypes;
  data.buffer.push("\n		<section class=stack>\n			");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "stack", {hash:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		</section>\n	");
  return buffer;
  }
function program11(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n			");
  hashTypes = {'content': "ID",'cardSource': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.CardView", {hash:{
    'content': (""),
    'cardSource': ("bank")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n			");
  return buffer;
  }

  data.buffer.push("<header>\n	<h2><img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("content.currentTurn.playerPhoto")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n		");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.currentTurn.playerName", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h2>\n<div># Actions: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.currentTurn.actions", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n<div># Buys: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.currentTurn.buys", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n</header>\n\n<h2>Hand</h2>\n<section class=\"hand\">\n");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.hand", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</section>\n\n<h2>Hexes</h2>\n<section class=\"hexes\">\n	");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.hexes", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n</section>\n\n<h2>Deck Count: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "content.deckCount", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h2>\n\n<h2>Discards</h2>\n<section class=\"discards\">\n");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "content.discards", {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</section>\n\n");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "isActionPhase", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  hashTypes = {};
  stack1 = helpers['if'].call(depth0, "isBuyPhase", {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
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
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<header>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</header>\n<img ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("relImageUrl")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n<p>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "description", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n<p>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "cost", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" gold</p>\n");
  return buffer;
  
});


