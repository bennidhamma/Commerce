
Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<h2>Welcome to Commerce!</h2>\n<p>Login with Google Plus to get started.</p>\n<span id=\"signinButton\">\n	<span\n	class=\"g-signin\"\n	data-callback=\"signinCallback\"\n	data-clientid=\"680890813233.apps.googleusercontent.com\"\n	data-cookiepolicy=\"single_host_origin\"\n	data-requestvisibleactions=\"http://schemas.google.com/AddActivity\"\n	data-scope=\"https://www.googleapis.com/auth/plus.login\">\n	</span>\n</span>\n");
  
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
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "games", options) : helperMissing.call(depth0, "linkTo", "games", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n		</ul>\n	</div>\n</div>		\n\n");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['new'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n	<li><img src=");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "image", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("<button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "invite", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Invite</button></li>\n	");
  return buffer;
  }

  data.buffer.push("<h2>Start a new game</h2>\n<h3>Invite up to 3 friends to play with:</h3>\n<ul>\n	");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "friends", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</ul>\n<button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "start", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Start!</button>\n");
  return buffer;
  
});

