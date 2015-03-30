var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.Assets = $hxClasses["co.doubleduck.Assets"] = function() {
};
co.doubleduck.Assets.__name__ = ["co","doubleduck","Assets"];
co.doubleduck.Assets.loader = function() {
	if(co.doubleduck.Assets._loader == null) {
		co.doubleduck.Assets._loader = new createjs.PreloadJS();
		co.doubleduck.Assets._loader.initialize(true);
		co.doubleduck.Assets._loader.onFileLoad = co.doubleduck.Assets.handleFileLoaded;
		co.doubleduck.Assets._loader.onFileError = co.doubleduck.Assets.handleLoadError;
		co.doubleduck.Assets._loader.setMaxConnections(10);
	}
	return co.doubleduck.Assets._loader;
}
co.doubleduck.Assets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.Assets.loader().loadFile(uri);
	co.doubleduck.Assets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.Assets.loadAll = function() {
	var manifest = new Array();
	var sounds = new Array();
	sounds[sounds.length] = "sound/shakeIt_music1";
	sounds[sounds.length] = "sound/click1";
	sounds[sounds.length] = "sound/liquid1";
	sounds[sounds.length] = "sound/fruit1";
	sounds[sounds.length] = "sound/fruit2";
	sounds[sounds.length] = "sound/fruit3";
	sounds[sounds.length] = "sound/cash";
	sounds[sounds.length] = "sound/blender";
	sounds[sounds.length] = "sound/score";
	sounds[sounds.length] = "sound/Star1";
	sounds[sounds.length] = "sound/Star2";
	sounds[sounds.length] = "sound/Star3";
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var mySound = _g1++;
			co.doubleduck.SoundManager.initSound(sounds[mySound]);
		}
	}
	manifest[manifest.length] = "images/orientation_error.png";
	manifest[manifest.length] = "images/menu/background.png";
	manifest[manifest.length] = "images/menu/btn_arrow.png";
	manifest[manifest.length] = "images/menu/btn_help.png";
	manifest[manifest.length] = "images/menu/btn_close.png";
	manifest[manifest.length] = "images/menu/help.png";
	manifest[manifest.length] = "images/menu/thumb_icon.png";
	manifest[manifest.length] = "images/menu/thumb_locked.png";
	manifest[manifest.length] = "images/menu/Splash.jpg";
	manifest[manifest.length] = "images/menu/tap2play.png";
	manifest[manifest.length] = "images/menu/star_empty.png";
	manifest[manifest.length] = "images/menu/star_full.png";
	manifest[manifest.length] = "images/menu/audio_btn.png";
	manifest[manifest.length] = "images/menu/published_by_everything_me.png";
	manifest[manifest.length] = "images/end/base.png";
	manifest[manifest.length] = "images/end/btn_menu.png";
	manifest[manifest.length] = "images/end/btn_next.png";
	manifest[manifest.length] = "images/end/btn_replay.png";
	manifest[manifest.length] = "images/end/star_empty.png";
	manifest[manifest.length] = "images/end/star_full.png";
	manifest[manifest.length] = "images/end/fail.png";
	manifest[manifest.length] = "images/font/$.png";
	manifest[manifest.length] = "images/font/,.png";
	manifest[manifest.length] = "images/font/+.png";
	manifest[manifest.length] = "images/font/,.png";
	manifest[manifest.length] = "images/font/0.png";
	manifest[manifest.length] = "images/font/1.png";
	manifest[manifest.length] = "images/font/2.png";
	manifest[manifest.length] = "images/font/3.png";
	manifest[manifest.length] = "images/font/4.png";
	manifest[manifest.length] = "images/font/5.png";
	manifest[manifest.length] = "images/font/6.png";
	manifest[manifest.length] = "images/font/7.png";
	manifest[manifest.length] = "images/font/8.png";
	manifest[manifest.length] = "images/font/9.png";
	manifest[manifest.length] = "images/booth/background.png";
	manifest[manifest.length] = "images/booth/booth.png";
	manifest[manifest.length] = "images/booth/blender.png";
	manifest[manifest.length] = "images/booth/trashcan.png";
	manifest[manifest.length] = "images/booth/container.png";
	manifest[manifest.length] = "images/booth/glass.png";
	manifest[manifest.length] = "images/booth/glass-fill.png";
	manifest[manifest.length] = "images/booth/blender_twirl.png";
	manifest[manifest.length] = "images/hud/pause.png";
	manifest[manifest.length] = "images/hud/paused.png";
	manifest[manifest.length] = "images/hud/score_box.png";
	manifest[manifest.length] = "images/hud/score_bar.png";
	manifest[manifest.length] = "images/hud/score_fill.png";
	manifest[manifest.length] = "images/hud/star.png";
	manifest[manifest.length] = "images/hud/btn_resume.png";
	manifest[manifest.length] = "images/customers/littlegirl.png";
	manifest[manifest.length] = "images/customers/businessman.png";
	manifest[manifest.length] = "images/customers/surferdude.png";
	manifest[manifest.length] = "images/customers/bubble-2.png";
	manifest[manifest.length] = "images/customers/bubble-3.png";
	manifest[manifest.length] = "images/customers/bubble-4.png";
	manifest[manifest.length] = "images/customers/bubble-5.png";
	manifest[manifest.length] = "images/customers/dude.png";
	manifest[manifest.length] = "images/customers/jessica.png";
	manifest[manifest.length] = "images/customers/merry.png";
	manifest[manifest.length] = "images/customers/captain.png";
	manifest[manifest.length] = "images/fruits/apple_big.png";
	manifest[manifest.length] = "images/fruits/apple_small.png";
	manifest[manifest.length] = "images/fruits/banana_big.png";
	manifest[manifest.length] = "images/fruits/banana_small.png";
	manifest[manifest.length] = "images/fruits/coconut_big.png";
	manifest[manifest.length] = "images/fruits/coconut_small.png";
	manifest[manifest.length] = "images/fruits/kiwi_big.png";
	manifest[manifest.length] = "images/fruits/kiwi_small.png";
	manifest[manifest.length] = "images/fruits/grapes_big.png";
	manifest[manifest.length] = "images/fruits/grapes_small.png";
	manifest[manifest.length] = "images/fruits/watermelon_big.png";
	manifest[manifest.length] = "images/fruits/watermelon_small.png";
	manifest[manifest.length] = "images/liquids/water_big.png";
	manifest[manifest.length] = "images/liquids/milk_big.png";
	manifest[manifest.length] = "images/liquids/juice_big.png";
	manifest[manifest.length] = "images/liquids/water_small.png";
	manifest[manifest.length] = "images/liquids/milk_small.png";
	manifest[manifest.length] = "images/liquids/juice_small.png";
	manifest[manifest.length] = "images/liquids/milk_blender_back.png";
	manifest[manifest.length] = "images/liquids/milk_blender_front.png";
	manifest[manifest.length] = "images/liquids/juice_blender_back.png";
	manifest[manifest.length] = "images/liquids/juice_blender_front.png";
	manifest[manifest.length] = "images/liquids/water_blender_back.png";
	manifest[manifest.length] = "images/liquids/water_blender_front.png";
	if(manifest.length == 0) {
		if(co.doubleduck.Assets.onLoadAll != null) co.doubleduck.Assets.onLoadAll();
	}
	co.doubleduck.Assets.loader().onProgress = co.doubleduck.Assets.handleProgress;
	co.doubleduck.Assets.loader().loadManifest(manifest);
	co.doubleduck.Assets.loader().load();
}
co.doubleduck.Assets.audioLoaded = function(event) {
	co.doubleduck.Assets._cacheData[event.target.src] = event.target;
}
co.doubleduck.Assets.handleProgress = function(event) {
	co.doubleduck.Assets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.Assets.loader().onProgress = null;
		co.doubleduck.Assets.onLoadAll();
	}
}
co.doubleduck.Assets.handleLoadError = function(event) {
}
co.doubleduck.Assets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.Assets._cacheData[event.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.Assets._loadCallbacks,event.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.Assets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.Assets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.Assets.loader().getResult(uri) != null) {
			cache = co.doubleduck.Assets.loader().getResult(uri).result;
			co.doubleduck.Assets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.Assets.getRawImage = function(uri) {
	var cache = co.doubleduck.Assets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.Assets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		null;
	}
	return cache;
}
co.doubleduck.Assets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.Assets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.Assets.prototype = {
	__class__: co.doubleduck.Assets
}
co.doubleduck.Button = $hxClasses["co.doubleduck.Button"] = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickSound == null) clickSound = "sound/click1";
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	createjs.Container.call(this);
	this._clickSound = clickSound;
	this._bitmap = bmp;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	this.image = this._bitmap.image;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = ["co","doubleduck","Button"];
co.doubleduck.Button.__super__ = createjs.Container;
co.doubleduck.Button.prototype = $extend(createjs.Container.prototype,{
	handleEndPress: function() {
		co.doubleduck.Utils.tintBitmap(this._bitmap,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.Game.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function() {
		if(this.onToggle == null) return;
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function() {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				co.doubleduck.Utils.tintBitmap(this._bitmap,0.55,0.55,0.55,1);
				var tween = createjs.Tween.get(this._bitmap);
				tween.ignoreGlobalPause = true;
				tween.wait(200).call($bind(this,this.handleEndPress));
				if(createjs.Ticker.getPaused()) co.doubleduck.Game.getStage().update();
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,addLabel: function(label) {
		var txt = co.doubleduck.FontHelper.getNumber(Std.parseInt(label));
		var width = 0;
		var height = 0;
		if(label.length == 1) {
			var digit = txt;
			width = digit.image.width * co.doubleduck.Game.getScale();
			height = digit.image.height * co.doubleduck.Game.getScale();
		} else {
			var num = txt;
			var _g1 = 0, _g = num.children.length;
			while(_g1 < _g) {
				var currDigit = _g1++;
				var digit = num.getChildAt(currDigit);
				width += digit.image.width * co.doubleduck.Game.getScale();
				height = digit.image.height * co.doubleduck.Game.getScale();
			}
		}
		txt.regX = width / 2;
		txt.regY = height / 2;
		txt.scaleX = txt.scaleY = co.doubleduck.Game.getScale();
		txt.x = this._bitmap.image.width / 2;
		txt.y = this._bitmap.image.height * 0.45 * co.doubleduck.Game.getScale();
		this.addChild(txt);
	}
	,_clickSound: null
	,_juiceTween: null
	,_clickType: null
	,_pauseAffected: null
	,_states: null
	,_bitmap: null
	,onToggle: null
	,image: null
	,__class__: co.doubleduck.Button
});
co.doubleduck.Customer = $hxClasses["co.doubleduck.Customer"] = function(id,waitFactor,bitmapLoc,frameWidth,frameHeight,arrivingFrame,leavingAngryFrame,leavingSatisfiedFrame,idleFrame,pissedFrame1,pissedFrame2,pissedFrame3,tip) {
	this._serviceable = false;
	this._customerID = id;
	this._waitFactor = waitFactor;
	var initObject = { };
	initObject.images = [co.doubleduck.Assets.getRawImage(bitmapLoc)];
	initObject.frames = { width : frameWidth, height : frameHeight, regX : frameWidth / 2, regY : frameHeight * co.doubleduck.Customer.CUSTOMER_VIEW_LINE};
	initObject.animations = { };
	initObject.animations.idle = { frames : idleFrame, frequency : 20, next : false};
	initObject.animations.arriving = { frames : arrivingFrame, frequency : 20, next : false};
	initObject.animations.satisfied = { frames : leavingSatisfiedFrame, frequency : 20};
	initObject.animations.angry = { frames : leavingAngryFrame, frequency : 20};
	initObject.animations.pissed1 = { frames : pissedFrame1, frequency : 20};
	initObject.animations.pissed2 = { frames : pissedFrame2, frequency : 50, next : false};
	initObject.animations.pissed3 = { frames : pissedFrame3, frequency : 50, next : false};
	var spriteSheet = new createjs.SpriteSheet(initObject);
	this._sprite = new createjs.BitmapAnimation(spriteSheet);
	this._tip = tip;
	createjs.Container.call(this);
	this.addChild(this._sprite);
	this._myGlass = null;
	this.scaleX = this.scaleY = co.doubleduck.Game.getScale();
	this.mouseEnabled = false;
	this._creationTime = createjs.Ticker.getTime(true);
};
co.doubleduck.Customer.__name__ = ["co","doubleduck","Customer"];
co.doubleduck.Customer.createCustomer = function(name) {
	var customer = co.doubleduck.DataLoader.getCustomer(name);
	return new co.doubleduck.Customer(customer.id,customer.waitFactor,customer.spritesheet,customer.frameWidth,customer.frameHeight,customer.idleFrame,customer.angryFrame,customer.satisfiedFrame,customer.arrivingFrame,customer.pissedOff1,customer.pissedOff2,customer.pissedOff3,customer.tip);
}
co.doubleduck.Customer.__super__ = createjs.Container;
co.doubleduck.Customer.prototype = $extend(createjs.Container.prototype,{
	recieveGlass: function(activeGlass) {
		this._myGlass = activeGlass;
		this._myGlass.y = this.getWidth() / 3;
		this._myGlass.visible = false;
		this._myGlass.scaleX = this._myGlass.scaleY = 0.8;
		this.addChild(this._myGlass);
	}
	,getHeight: function() {
		return this._sprite.spriteSheet._frameHeight;
	}
	,getWidth: function() {
		return this._sprite.spriteSheet._frameWidth;
	}
	,getCreationTime: function() {
		return this._creationTime;
	}
	,getTip: function() {
		var passedSinceOrder = (createjs.Ticker.getTime(true) - this._orderTime) / this._maxWaitTime;
		return Math.floor(this._tip * (1 - passedSinceOrder));
	}
	,acceptRecipe: function(fruits,liquid) {
		var liquidEqual = liquid == this._requestLiquid;
		if(!liquidEqual) return false;
		var dummyRequest = this._requestedFruits.slice();
		var dummyRecipe = fruits.slice();
		var foundMissingFruit = false;
		while(dummyRequest.length > 0 && !foundMissingFruit) {
			var foundCurrFruit = false;
			var _g1 = 0, _g = fruits.length;
			while(_g1 < _g) {
				var currBlendedFruit = _g1++;
				if(dummyRequest[0].getType() == dummyRecipe[currBlendedFruit].getType()) {
					foundCurrFruit = true;
					dummyRequest.splice(0,1);
					dummyRecipe.splice(currBlendedFruit,1);
					break;
				}
			}
			if(!foundCurrFruit) foundMissingFruit = true;
		}
		return !foundMissingFruit && dummyRecipe.length == 0;
	}
	,isServiceable: function() {
		return this._serviceable;
	}
	,arrived: function() {
		this._sprite.gotoAndPlay("idle");
		this.onArrive(this);
	}
	,destroy: function() {
		this.onDestroy(this);
	}
	,leave: function(direction,angry) {
		if(angry == null) angry = false;
		if(angry) this._sprite.gotoAndPlay("angry"); else this._sprite.gotoAndPlay("satisfied");
		var myParent = this.parent;
		if(myParent != null) {
			myParent.removeChild(this);
			myParent.addChildAt(this,0);
		}
		var destinationX = 0;
		var time = 1000;
		var glassDiffX = 0;
		if(direction == co.doubleduck.Customer.DIRECTION_LEFT) {
			this._sprite.scaleX = Math.abs(this._sprite.scaleX);
			glassDiffX = -1 * this.getWidth() / 3;
			destinationX = 0 - this.getWidth() / 2 * co.doubleduck.Game.getScale();
		} else if(direction == co.doubleduck.Customer.DIRECTION_RIGHT) {
			this._sprite.scaleX = -1 * Math.abs(this._sprite.scaleX);
			destinationX = co.doubleduck.Game.getViewport().width + this.getWidth() / 2 * co.doubleduck.Game.getScale();
			glassDiffX = this.getWidth() / 3;
		}
		this.mouseEnabled = false;
		this._serviceable = false;
		var travelPx = Math.abs(destinationX - this.x);
		var travelScreenPercent = travelPx / co.doubleduck.Game.getViewport().width;
		if(angry) time = travelScreenPercent / co.doubleduck.Customer.LEAVE_SPEED_ANGRY * 1000; else time = travelScreenPercent / co.doubleduck.Customer.LEAVE_SPEED_SATISFIED * 1000;
		if(this._myGlass != null) {
			this._myGlass.visible = true;
			this._myGlass.x = glassDiffX;
			if(glassDiffX > 0) this._myGlass.scaleX *= -1;
		}
		createjs.Tween.get(this._requestBubble).to({ alpha : 0},100);
		var _g1 = 0, _g = this._requestedIngredientsIcons.length;
		while(_g1 < _g) {
			var currIcon = _g1++;
			this._requestedIngredientsIcons[currIcon].visible = false;
		}
		createjs.Tween.get(this).to({ x : destinationX},time).call($bind(this,this.destroy));
		this.onLeave(this);
	}
	,arrive: function(destinationX) {
		var startX = 0;
		if(Math.random() > 0.5) startX = 0 - this.getWidth() / 2 * co.doubleduck.Game.getScale(); else startX = co.doubleduck.Game.getViewport().width + this.getWidth() / 2 * co.doubleduck.Game.getScale();
		if(destinationX > startX) this._sprite.scaleX = -1 * Math.abs(this._sprite.scaleX); else this._sprite.scaleX = Math.abs(this._sprite.scaleX);
		this.x = startX;
		this._sprite.gotoAndPlay("arriving");
		var travelPx = Math.abs(destinationX - startX);
		var travelScreenPercent = travelPx / co.doubleduck.Game.getViewport().width;
		var time = travelScreenPercent / co.doubleduck.Customer.ARRIVE_SPEED * 1000;
		createjs.Tween.get(this).to({ x : destinationX},time).call($bind(this,this.arrived));
	}
	,orderGiven: function() {
		this._orderTime = createjs.Ticker.getTime(true);
		this.mouseEnabled = true;
		this._serviceable = true;
		this.updateMood();
	}
	,makeOrder: function(availableFruits,availableLiquids,maxWaitTimeSecs,maxRecipeSize) {
		this._maxWaitTime = maxWaitTimeSecs * 1000 * this._waitFactor;
		var numFruitsInRecipe = Math.floor(Math.random() * maxRecipeSize) + 1;
		var cloudSize = numFruitsInRecipe + 1;
		this._requestBubble = co.doubleduck.Assets.getImage("images/customers/bubble-" + cloudSize + ".png");
		this._requestLiquid = availableLiquids[Math.floor(Math.random() * availableLiquids.length)];
		this._requestBubble.regX = this._requestBubble.image.width / 2;
		this._requestBubble.regY = this._requestBubble.image.height;
		this._requestBubble.x = 0;
		this._requestBubble.y = -this.getHeight() * co.doubleduck.Customer.CUSTOMER_VIEW_LINE * 0.88;
		this.addChild(this._requestBubble);
		var bublePos = 0;
		var oneRowPos = 0.55;
		var twoRowPosTop = 0.75;
		var twoRowPosBottom = 0.31;
		this._requestedFruits = new Array();
		var totalIconWidth = 0;
		this._requestedIngredientsIcons = new Array();
		var _g = 0;
		while(_g < numFruitsInRecipe) {
			var currFruit = _g++;
			this._requestedFruits[currFruit] = availableFruits[Math.floor(Math.random() * availableFruits.length)];
			var fruitIcon = co.doubleduck.Assets.getImage(this._requestedFruits[currFruit].getIconUri());
			fruitIcon.regX = fruitIcon.image.width / 2;
			fruitIcon.regY = fruitIcon.image.height / 2;
			if(cloudSize < 4 || cloudSize == 4 && bublePos < 2 || cloudSize > 4 && bublePos < 3) {
				if(cloudSize < 4) fruitIcon.y = this._requestBubble.y - this._requestBubble.image.height * oneRowPos; else fruitIcon.y = this._requestBubble.y - this._requestBubble.image.height * twoRowPosBottom;
			} else fruitIcon.y = this._requestBubble.y - this._requestBubble.image.height * twoRowPosTop;
			this._requestedIngredientsIcons[currFruit] = fruitIcon;
			totalIconWidth += fruitIcon.image.width + 10;
			bublePos++;
			this.addChild(fruitIcon);
		}
		var liquidIcon = co.doubleduck.Assets.getImage(co.doubleduck.DataLoader.getLiquidById(this._requestLiquid.getType()).smallIcon);
		liquidIcon.regX = liquidIcon.image.width / 2;
		liquidIcon.regY = liquidIcon.image.height / 2;
		if(cloudSize < 4 || cloudSize == 4 && bublePos < 2 || cloudSize > 4 && bublePos < 3) {
			if(cloudSize < 4) liquidIcon.y = this._requestBubble.y - this._requestBubble.image.height * oneRowPos; else liquidIcon.y = this._requestBubble.y - this._requestBubble.image.height * twoRowPosBottom;
		} else liquidIcon.y = this._requestBubble.y - this._requestBubble.image.height * twoRowPosTop;
		liquidIcon.x = this._requestBubble.x;
		totalIconWidth += liquidIcon.image.width + 10;
		this.addChild(liquidIcon);
		this._requestedIngredientsIcons[this._requestedIngredientsIcons.length] = liquidIcon;
		var spacing = this._requestedIngredientsIcons[0].image.width * 1.15;
		var reqWidth;
		if(this._requestedIngredientsIcons.length > 3) reqWidth = (this._requestedIngredientsIcons.length - 3) * spacing; else reqWidth = (this._requestedIngredientsIcons.length - 1) * spacing;
		var startPos = reqWidth * -0.5 + this._requestBubble.x;
		var _g1 = 0, _g = this._requestedIngredientsIcons.length;
		while(_g1 < _g) {
			var i = _g1++;
			var posCol = i;
			if(cloudSize == 4 && posCol >= 2) posCol -= 2;
			if(cloudSize == 5 && posCol >= 3) posCol -= 2;
			this._requestedIngredientsIcons[i].x = startPos + posCol * spacing;
		}
		createjs.Tween.get(this._requestBubble).to({ alpha : 1},1000).call($bind(this,this.orderGiven));
	}
	,updateMood: function() {
		if(!this._serviceable) return;
		var now = createjs.Ticker.getTime(true);
		var passedSinceOrder = now - this._orderTime;
		if(passedSinceOrder > this._maxWaitTime) this.leave(Math.floor(Math.random() * 2),true); else if(passedSinceOrder > this._maxWaitTime * co.doubleduck.Customer.PISSED_3) {
			if(this._sprite.currentAnimation != "pissed3") this._sprite.gotoAndPlay("pissed3");
		} else if(passedSinceOrder > this._maxWaitTime * co.doubleduck.Customer.PISSED_2) {
			if(this._sprite.currentAnimation != "pissed2") this._sprite.gotoAndPlay("pissed2");
		} else if(passedSinceOrder > this._maxWaitTime * co.doubleduck.Customer.PISSED_1) {
			if(this._sprite.currentAnimation != "pissed1") this._sprite.gotoAndPlay("pissed1");
		}
		co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.updateMood));
	}
	,onDestroy: null
	,onLeave: null
	,onArrive: null
	,_myGlass: null
	,_tip: null
	,_creationTime: null
	,_maxWaitTime: null
	,_orderTime: null
	,_requestedIngredientsIcons: null
	,_requestLiquid: null
	,_requestedFruits: null
	,_requestBubble: null
	,_serviceable: null
	,_waitFactor: null
	,_customerID: null
	,_sprite: null
	,__class__: co.doubleduck.Customer
});
co.doubleduck.DataLoader = $hxClasses["co.doubleduck.DataLoader"] = function() {
};
co.doubleduck.DataLoader.__name__ = ["co","doubleduck","DataLoader"];
co.doubleduck.DataLoader.getLevel = function(id) {
	var result = null;
	var levelDB = new LevelDB();
	var allLevels = levelDB.getAllLevels();
	var _g1 = 0, _g = allLevels.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allLevels[i].id == id) {
			result = allLevels[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getFruitById = function(type) {
	var result = null;
	var productDB = new ProductDB();
	var allFruits = productDB.getAllFruits();
	var _g1 = 0, _g = allFruits.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allFruits[i].id == type) {
			result = allFruits[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getFruitByName = function(name) {
	var result = null;
	var productDB = new ProductDB();
	var allFruits = productDB.getAllFruits();
	var _g1 = 0, _g = allFruits.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allFruits[i].name == name) {
			result = allFruits[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getLiquidById = function(type) {
	var result = null;
	var productDB = new ProductDB();
	var allFruits = productDB.getAllLiquids();
	var _g1 = 0, _g = allFruits.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allFruits[i].id == type) {
			result = allFruits[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getLiquidByName = function(name) {
	var result = null;
	var productDB = new ProductDB();
	var allFruits = productDB.getAllLiquids();
	var _g1 = 0, _g = allFruits.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allFruits[i].name == name) {
			result = allFruits[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getCustomer = function(id) {
	var result = null;
	var cdb = new CustomerDB();
	var allCustomers = cdb.getAllCustomers();
	var _g1 = 0, _g = allCustomers.length;
	while(_g1 < _g) {
		var currCustomer = _g1++;
		if(allCustomers[currCustomer].id == id) {
			result = allCustomers[currCustomer];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.prototype = {
	__class__: co.doubleduck.DataLoader
}
co.doubleduck.FontHelper = $hxClasses["co.doubleduck.FontHelper"] = function() {
};
co.doubleduck.FontHelper.__name__ = ["co","doubleduck","FontHelper"];
co.doubleduck.FontHelper._lastComma = null;
co.doubleduck.FontHelper.tintGreen = function(src) {
	co.doubleduck.Utils.tintBitmap(src,0,1,0,1);
}
co.doubleduck.FontHelper.getPlus = function() {
	return co.doubleduck.Assets.getImage("images/font/+.png");
}
co.doubleduck.FontHelper.getComma = function() {
	return co.doubleduck.Assets.getImage("images/font/,.png");
}
co.doubleduck.FontHelper.getDollar = function() {
	return co.doubleduck.Assets.getImage("images/font/$.png");
}
co.doubleduck.FontHelper.getMinus = function(tint) {
	if(tint == null) tint = false;
	var minus = co.doubleduck.Assets.getImage("images/font/-.png");
	if(tint) co.doubleduck.FontHelper.tintGreen(minus);
	return minus;
}
co.doubleduck.FontHelper.getDigit = function(digit,greenTint) {
	if(greenTint == null) greenTint = false;
	var digit1 = co.doubleduck.Assets.getImage("images/font/" + digit + ".png");
	if(greenTint) co.doubleduck.FontHelper.tintGreen(digit1);
	return digit1;
}
co.doubleduck.FontHelper.getNumber = function(num,scale,greenTint,forceContainer) {
	if(forceContainer == null) forceContainer = false;
	if(greenTint == null) greenTint = false;
	if(scale == null) scale = 1;
	if(num >= 0 && num < 10) {
		var result = new createjs.Container();
		var bmp = co.doubleduck.FontHelper.getDigit(num);
		bmp.scaleX = bmp.scaleY = scale;
		if(greenTint) co.doubleduck.FontHelper.tintGreen(bmp);
		result.addChild(bmp);
		if(forceContainer) return result; else return bmp;
	} else {
		var result = new createjs.Container();
		var addMinus = num < 0;
		var minus = null;
		if(num < 0) {
			minus = co.doubleduck.FontHelper.getMinus();
			result.addChild(minus);
			minus.scaleX = minus.scaleY = scale;
			num = Math.abs(num) | 0;
		}
		var numString = "" + num;
		var digits = new Array();
		digits[digits.length] = co.doubleduck.FontHelper.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)),greenTint);
		digits[0].scaleX = digits[0].scaleY = scale;
		if(minus != null) digits[0].x = minus.image.width;
		result.addChild(digits[0]);
		if(numString.length == 4 || numString.length == 7) {
			co.doubleduck.FontHelper._lastComma = co.doubleduck.FontHelper.getComma();
			co.doubleduck.FontHelper._lastComma.scaleX = co.doubleduck.FontHelper._lastComma.scaleY = scale;
			co.doubleduck.FontHelper._lastComma.x = digits[0].x + digits[0].image.width;
			result.addChild(co.doubleduck.FontHelper._lastComma);
		}
		var _g1 = 1, _g = numString.length;
		while(_g1 < _g) {
			var i = _g1++;
			var index = digits.length;
			digits[index] = co.doubleduck.FontHelper.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)),greenTint);
			if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = co.doubleduck.FontHelper._lastComma.x + co.doubleduck.FontHelper._lastComma.image.width; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width;
			digits[index].scaleX = digits[index].scaleY = scale;
			result.addChild(digits[index]);
			if(numString.length - i == 4 || numString.length - i == 7) {
				co.doubleduck.FontHelper._lastComma.scaleX = co.doubleduck.FontHelper._lastComma.scaleY = scale;
				co.doubleduck.FontHelper._lastComma = co.doubleduck.FontHelper.getComma();
				if(greenTint) co.doubleduck.FontHelper.tintGreen(co.doubleduck.FontHelper._lastComma);
				co.doubleduck.FontHelper._lastComma.x = digits[index].x + digits[index].image.width;
				result.addChild(co.doubleduck.FontHelper._lastComma);
			}
		}
		return result;
	}
}
co.doubleduck.FontHelper.prototype = {
	__class__: co.doubleduck.FontHelper
}
co.doubleduck.Fruit = $hxClasses["co.doubleduck.Fruit"] = function(id,name,graphic,icon) {
	this._fruitType = id;
	this._name = name;
	this.name = name;
	this._icon = icon;
	co.doubleduck.Button.call(this,co.doubleduck.Assets.getImage(graphic));
	this.setNoSound();
};
co.doubleduck.Fruit.__name__ = ["co","doubleduck","Fruit"];
co.doubleduck.Fruit.createFruit = function(id) {
	var graphic = co.doubleduck.DataLoader.getFruitById(id).bigIcon;
	var name = co.doubleduck.DataLoader.getFruitById(id).name;
	var icon = co.doubleduck.DataLoader.getFruitById(id).smallIcon;
	return new co.doubleduck.Fruit(id,name,graphic,icon);
}
co.doubleduck.Fruit.__super__ = co.doubleduck.Button;
co.doubleduck.Fruit.prototype = $extend(co.doubleduck.Button.prototype,{
	getIconUri: function() {
		return this._icon;
	}
	,getName: function() {
		return this._name;
	}
	,getType: function() {
		return this._fruitType;
	}
	,_icon: null
	,_name: null
	,_fruitType: null
	,__class__: co.doubleduck.Fruit
});
co.doubleduck.Game = $hxClasses["co.doubleduck.Game"] = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	if(co.doubleduck.Game.DEBUG) co.doubleduck.Persistence.clearAll();
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		js.Lib.alert("This phone's version is not supported. please update your phone's software.");
		return;
	}
	co.doubleduck.Persistence.initGameData();
	co.doubleduck.Game._stage = stage;
	co.doubleduck.Game._stage.mouseEnabled = false;
	co.doubleduck.Game._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.Game.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	if(co.doubleduck.Game.HD) {
		co.doubleduck.Game.MAX_HEIGHT = 1281;
		co.doubleduck.Game.MAX_WIDTH = 853;
	}
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(viewporter.isLandscape()) co.doubleduck.Assets.loadAndCall("images/orientation_error.png",$bind(this,this.waitForPortrait)); else co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.loadBarFill));
	} else co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.loadBarFill));
	document.addEventListener('mozvisibilitychange', this.exitFocus);
};
co.doubleduck.Game.__name__ = ["co","doubleduck","Game"];
co.doubleduck.Game._stage = null;
co.doubleduck.Game.hammer = null;
co.doubleduck.Game.getViewport = function() {
	return co.doubleduck.Game._viewport;
}
co.doubleduck.Game.getScale = function() {
	return co.doubleduck.Game._scale;
}
co.doubleduck.Game.getStage = function() {
	return co.doubleduck.Game._stage;
}
co.doubleduck.Game.setScale = function() {
	var regScale = co.doubleduck.Game._viewport.height / co.doubleduck.Game.MAX_HEIGHT;
	if(co.doubleduck.Game._viewport.width >= co.doubleduck.Game._viewport.height) co.doubleduck.Game._scale = regScale; else if(co.doubleduck.Game.MAX_WIDTH * regScale < co.doubleduck.Game._viewport.width) co.doubleduck.Game._scale = co.doubleduck.Game._viewport.width / co.doubleduck.Game.MAX_WIDTH; else co.doubleduck.Game._scale = regScale;
}
co.doubleduck.Game.prototype = {
	handleViewportChanged: function() {
		if(viewporter.isLandscape()) {
			if(this._orientError == null) {
				this._orientError = co.doubleduck.Assets.getImage("images/orientation_error.png");
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.Game._viewport.height / 2;
				this._orientError.y = co.doubleduck.Game._viewport.width / 2;
				co.doubleduck.Game._stage.addChildAt(this._orientError,co.doubleduck.Game._stage.getNumChildren());
				co.doubleduck.Game._stage.update();
				this._session.pause();
			}
		} else if(this._orientError != null) {
			co.doubleduck.Game._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.Game._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.loadBarFill));
			}
		}
	}
	,handleResize: function(e) {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.Game._stage.canvas.width = screenW;
		co.doubleduck.Game._stage.canvas.height = screenH;
		if(!viewporter.isLandscape()) {
			if(isFirefox) {
				screenH = Math.floor(co.doubleduck.Main.getFFHeight());
				var ffEstimate = Math.ceil((js.Lib.window.screen.height - 110) * (screenW / js.Lib.window.screen.width));
				if(!isAndroid) ffEstimate = Math.ceil((js.Lib.window.screen.height - 30) * (screenW / js.Lib.window.screen.width));
				if(ffEstimate < screenH) screenH = Math.floor(ffEstimate);
			}
			if(!(viewporter.ACTIVE && screenH < screenW)) {
				co.doubleduck.Game._viewport.width = screenW;
				co.doubleduck.Game._viewport.height = screenH;
				co.doubleduck.Game.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.Game._stage.update();
	}
	,handleBackToMenu: function() {
		var lastLevel = this._session.getLevel();
		this._session.destroy();
		co.doubleduck.Game._stage.removeChild(this._session);
		this._session = null;
		this._menu = new co.doubleduck.Menu(lastLevel);
		co.doubleduck.Game._stage.addChildAt(this._menu,0);
		this._menu.onStart = $bind(this,this.handleStart);
	}
	,handleNextLevel: function() {
	  var self = this;
	  
	  function nextLevel() {
	    var playedLevel = self._session.getLevel();
      self._session.destroy();
      co.doubleduck.Game._stage.removeChild(self._session);
      self._session = null;
      self.startSession(++playedLevel);
	  }
	  
    if (window.InAppOffer) {
      new window.InAppOffer({
        "onRemove": nextLevel
      });
    } else {
      nextLevel();
    }
	}
	,handleRestart: function() {
		var playedLevel = this._session.getLevel();
		this._session.destroy();
		co.doubleduck.Game._stage.removeChild(this._session);
		this._session = null;
		this.startSession(playedLevel);
	}
	,handleSessionEnd: function() {
		var level = this._session.getLevel();
		var currLevelScore = co.doubleduck.Persistence.getLevelScore(level);
		var sessionScore = this._session.getScore();
		if(sessionScore > currLevelScore) co.doubleduck.Persistence.setLevelScore(this._session.getLevel(),sessionScore);
		var levelsData = co.doubleduck.DataLoader.getLevel(level);
		if(sessionScore >= (levelsData.stars[0] | 0)) {
			if(co.doubleduck.Persistence.getUnlockedLevel() == level) co.doubleduck.Persistence.setUnlockedLevel(++level);
		}
	}
	,handleStart: function() {
		co.doubleduck.Game._stage.removeChild(this._menu);
		this.startSession(this._menu.getChosenLevel());
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function(levelId) {
		this._session = new co.doubleduck.Session(levelId);
		this._session.setOnRestart($bind(this,this.handleRestart));
		this._session.onNextLevel = $bind(this,this.handleNextLevel);
		this._session.setOnBackToMenu($bind(this,this.handleBackToMenu));
		this._session.onSessionEnd = $bind(this,this.handleSessionEnd);
		co.doubleduck.Game._stage.addChild(this._session);
	}
	,tapToPlayTextAlpha: function() {
		if(this._tapToPlayText == null) return;
		if(this._tapToPlayText.alpha == 0) createjs.Tween.get(this._tapToPlayText).to({ alpha : 1},750).call($bind(this,this.tapToPlayTextAlpha)); else if(this._tapToPlayText.alpha == 1) createjs.Tween.get(this._tapToPlayText).to({ alpha : 0},1500).call($bind(this,this.tapToPlayTextAlpha));
	}
	,removeSplash: function() {
		co.doubleduck.Game._stage.removeChild(this._splashScreen);
		this._splashScreen = null;
	}
	,showMenu: function() {
		if(co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) {
			var nonUserInitedSounds = new Array();
			nonUserInitedSounds.push("sound/Star1");
			nonUserInitedSounds.push("sound/Star2");
			nonUserInitedSounds.push("sound/Star3");
			var _g1 = 0, _g = nonUserInitedSounds.length;
			while(_g1 < _g) {
				var currSound = _g1++;
				var sfx = co.doubleduck.SoundManager.playEffect(nonUserInitedSounds[currSound]);
				sfx.stop();
			}
		}
		this._splashScreen.onClick = null;
		co.doubleduck.Game._stage.removeChild(this._tapToPlayText);
		this._tapToPlayText = null;
		createjs.Tween.get(this._splashScreen).to({ scaleX : this._splashScreen.scaleX * 3, scaleY : this._splashScreen.scaleY * 3, alpha : 0},500).call($bind(this,this.removeSplash));
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.Game._stage.addChildAt(this._menu,0);
		this._menu.onStart = $bind(this,this.handleStart);
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.Game._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this._splashScreen = co.doubleduck.Assets.getImage("images/menu/Splash.jpg",true);
		this._splashScreen.scaleX = this._splashScreen.scaleY = co.doubleduck.Game.getScale();
		this._splashScreen.regX = this._splashScreen.image.width / 2;
		this._splashScreen.regY = this._splashScreen.image.height / 2;
		this._splashScreen.x = co.doubleduck.Game.getViewport().width / 2;
		this._splashScreen.y = co.doubleduck.Game.getViewport().height / 2;
		co.doubleduck.Game._stage.addChildAt(this._splashScreen,0);
		this._tapToPlayText = co.doubleduck.Assets.getImage("images/menu/tap2play.png");
		this._tapToPlayText.regX = this._tapToPlayText.image.width / 2;
		this._tapToPlayText.x = co.doubleduck.Game.getViewport().width / 2;
		this._tapToPlayText.y = this._splashScreen.y - this._splashScreen.image.height * co.doubleduck.Game.getScale() / 2;
		this._tapToPlayText.y += this._splashScreen.image.height * co.doubleduck.Game.getScale() * 0.31;
		this._tapToPlayText.scaleX = this._tapToPlayText.scaleY = co.doubleduck.Game.getScale();
		this._tapToPlayText.alpha = 0;
		this.tapToPlayTextAlpha();
		co.doubleduck.Game._stage.addChildAt(this._tapToPlayText,1);
		this._splashScreen.onClick = $bind(this,this.showMenu);
		this._evme = co.doubleduck.Assets.getImage("images/menu/published_by_everything_me.png");
		this._evme.scaleX = this._evme.scaleY = co.doubleduck.Game.getScale();
		this._evme.regX = this._evme.image.width;
		this._evme.regY = this._evme.image.height * 0.90;
		this._evme.x = co.doubleduck.Game.getViewport().width;
		this._evme.y = co.doubleduck.Game.getViewport().height;
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.Game._stage.removeChild(this._loadingBar);
		co.doubleduck.Game._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.Assets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.Assets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else js.Lib.document.body.bgColor = "#D94D00";
		this._splash = co.doubleduck.Assets.getImage("images/splash_logo.png");
		this._splash.regX = this._splash.image.width / 2;
		this._splash.regY = this._splash.image.height / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		this._splash.y = 200;
		co.doubleduck.Game._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.Assets.getImage("images/loading_stroke.png");
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.Game._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.Assets.getImage("images/loading_fill.png");
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.Game._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 110;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.Game._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.Game._stage.canvas.height = js.Lib.window.innerHeight;
		co.doubleduck.Assets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
	}
	,waitForPortrait: function() {
		this._waitingToStart = true;
		this._orientError = co.doubleduck.Assets.getImage("images/orientation_error.png");
		this._orientError.regX = this._orientError.image.width / 2;
		this._orientError.regY = this._orientError.image.height / 2;
		this._orientError.x = js.Lib.window.innerWidth / 2;
		this._orientError.y = js.Lib.window.innerHeight / 2;
		co.doubleduck.Game._stage.addChildAt(this._orientError,co.doubleduck.Game._stage.getNumChildren());
	}
	,loadBarStroke: function() {
		co.doubleduck.Assets.loadAndCall("images/loading_stroke.png",$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.Assets.loadAndCall("images/loading_fill.png",$bind(this,this.loadBarStroke));
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute();
	}
	,_evme: null
	,_loadingStroke: null
	,_loadingBar: null
	,_tapToPlayText: null
	,_splashScreen: null
	,_waitingToStart: null
	,_orientError: null
	,_session: null
	,_menu: null
	,_splash: null
	,__class__: co.doubleduck.Game
}
co.doubleduck.Glass = $hxClasses["co.doubleduck.Glass"] = function() {
	createjs.Container.call(this);
	this._glass = co.doubleduck.Assets.getImage("images/booth/glass.png");
	this._glassFill = co.doubleduck.Assets.getImage("images/booth/glass-fill.png");
	this.setGlassMask(0);
	this.addChild(this._glass);
	this.addChild(this._glassFill);
	this._currMask = 0;
	this.scaleX = this.scaleY = co.doubleduck.Game.getScale();
	this.regY = this._glass.image.height;
	this.regX = this._glass.image.width / 2;
	this.x = co.doubleduck.Game.getViewport().width + this._glass.image.width / 2 * co.doubleduck.Game.getScale();
	this.enter();
	this._isClearing = false;
};
co.doubleduck.Glass.__name__ = ["co","doubleduck","Glass"];
co.doubleduck.Glass.__super__ = createjs.Container;
co.doubleduck.Glass.prototype = $extend(createjs.Container.prototype,{
	clear: function() {
		this.setGlassMask(0);
		this._isClearing = false;
	}
	,isClear: function() {
		return this._currMask == 0;
	}
	,setGlassMask: function(progression) {
		var barMask = new createjs.Shape();
		barMask.graphics.beginFill("#00000000");
		var height = this._glassFill.image.height;
		barMask.graphics.drawRect(this._glassFill.x,this._glassFill.y + (1 - progression) * height,this._glassFill.image.width,height * progression);
		barMask.graphics.endFill();
		this._glassFill.mask = barMask;
		this._currMask = progression;
	}
	,fillUp: function() {
		if(this._currMask >= 1) {
			this._currMask = 1;
			return;
		}
		this._currMask += 0.05;
		this.setGlassMask(this._currMask);
		co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.fillUp));
	}
	,enter: function() {
		createjs.Tween.get(this).to({ x : co.doubleduck.Game.getViewport().width * 0.65},500,createjs.Ease.sineOut);
	}
	,_isClearing: null
	,_currMask: null
	,_glassFill: null
	,_glass: null
	,__class__: co.doubleduck.Glass
});
co.doubleduck.HUD = $hxClasses["co.doubleduck.HUD"] = function(starsScore) {
	this._prevScore = 0;
	this.onMenuClick = null;
	this.onRestart = null;
	this.onPauseClick = null;
	createjs.Container.call(this);
	this._pauseBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/hud/pause.png"));
	this._pauseBtn.regX = this._pauseBtn.image.width;
	this._pauseBtn.regY = this._pauseBtn.image.height / 2;
	this._pauseBtn.scaleX = this._pauseBtn.scaleY = co.doubleduck.Game.getScale();
	this._pauseBtn.x = co.doubleduck.Game.getViewport().width - 10 * co.doubleduck.Game.getScale();
	this._pauseBtn.y = co.doubleduck.Game.getViewport().y + 25 * co.doubleduck.Game.getScale();
	this._pauseBtn.onClick = $bind(this,this.handlePauseClick);
	createjs.Ticker.addListener(this,false);
	this.addChild(this._pauseBtn);
	this._scoreBox = co.doubleduck.Assets.getImage("images/hud/score_box.png");
	this._scoreBox.scaleX = this._scoreBox.scaleY = co.doubleduck.Game.getScale();
	this._scoreBox.x = co.doubleduck.Game.getViewport().x + 5 * co.doubleduck.Game.getScale();
	this._scoreBox.y = co.doubleduck.Game.getViewport().y + 5 * co.doubleduck.Game.getScale();
	this._scoreBar = co.doubleduck.Assets.getImage("images/hud/score_bar.png");
	this._scoreBar.scaleX = this._scoreBar.scaleY = co.doubleduck.Game.getScale();
	this._scoreBar.regY = this._scoreBar.image.height / 2;
	this._scoreBar.y = this._scoreBox.y + this._scoreBox.image.height / 2 * co.doubleduck.Game.getScale();
	this._scoreBar.x = this._scoreBox.x + this._scoreBox.image.width * co.doubleduck.Game.getScale();
	this._scoreFill = co.doubleduck.Assets.getImage("images/hud/score_fill.png");
	this._scoreFill.scaleX = this._scoreFill.scaleY = this._scoreBar.scaleX;
	this._scoreFill.regX = this._scoreBar.regX;
	this._scoreFill.regY = this._scoreBar.regY;
	this._scoreFill.x = this._scoreBar.x;
	this._scoreFill.y = this._scoreBar.y;
	this._scoreBarMask = new createjs.Shape();
	this._scoreFill.mask = this._scoreBarMask;
	this._starsScore = starsScore;
	var barWidth = this._scoreBar.image.width * co.doubleduck.Game.getScale();
	var img = co.doubleduck.Assets.getRawImage("images/hud/star.png");
	var initObject = { };
	initObject.images = [img];
	initObject.frames = { width : img.width / 2, height : img.height, regX : img.width / 4, regY : img.height * 0.6};
	initObject.animations = { };
	initObject.animations.dark = { frames : 0, frequency : 20, next : false};
	initObject.animations.light = { frames : 1, frequency : 20, next : false};
	var starSpritesheet = new createjs.SpriteSheet(initObject);
	this._stars = new Array();
	var _g1 = 0, _g = this._starsScore.length;
	while(_g1 < _g) {
		var i = _g1++;
		this._stars[i] = new createjs.BitmapAnimation(starSpritesheet);
		this._stars[i].gotoAndStop("dark");
		this._stars[i].y = this._scoreBar.y;
		this._stars[i].x = this._scoreBar.x + barWidth * (this._starsScore[i] / this._starsScore[this._starsScore.length - 1]);
		this._stars[i].scaleX = this._stars[i].scaleY = co.doubleduck.Game.getScale();
	}
	this.addChild(this._scoreBar);
	this.addChild(this._scoreFill);
	this.addChild(this._scoreBox);
	var _g1 = 0, _g = this._stars.length;
	while(_g1 < _g) {
		var i = _g1++;
		this.addChild(this._stars[i]);
	}
	this._pauseScreenBG = new createjs.Shape();
	this._pauseScreenBG.graphics.beginFill("#000000");
	this._pauseScreenBG.graphics.drawRect(0,0,co.doubleduck.Game.getViewport().width,co.doubleduck.Game.getViewport().height);
	this._pauseScreenBG.graphics.endFill();
	this._pauseScreenBG.alpha = 0.5;
	this._pauseScreenBG.visible = false;
	this._pauseBtnScreenTitle = co.doubleduck.Assets.getImage("images/hud/paused.png");
	this._pauseBtnScreenTitle.regX = this._pauseBtnScreenTitle.image.width / 2;
	this._pauseBtnScreenTitle.regY = this._pauseBtnScreenTitle.image.height / 2;
	this._pauseBtnScreenTitle.scaleX = this._pauseBtnScreenTitle.scaleY = co.doubleduck.Game.getScale();
	this._pauseBtnScreenTitle.x = co.doubleduck.Game.getViewport().width / 2;
	this._pauseBtnScreenTitle.y = co.doubleduck.Game.getViewport().height * 0.4;
	this._pauseScreenBtnRestart = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/end/btn_replay.png"),false);
	this._pauseScreenBtnRestart.regX = this._pauseScreenBtnRestart.image.width / 2;
	this._pauseScreenBtnRestart.regY = this._pauseScreenBtnRestart.image.height / 2;
	this._pauseScreenBtnRestart.scaleX = this._pauseScreenBtnRestart.scaleY = co.doubleduck.Game.getScale();
	this._pauseScreenBtnRestart.x = co.doubleduck.Game.getViewport().width / 2;
	this._pauseScreenBtnRestart.y = co.doubleduck.Game.getViewport().height * 0.55;
	this._pauseScreenBtnRestart.onClick = $bind(this,this.handleRestartClick);
	this._pauseScreenBtnResume = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/hud/btn_resume.png"),false);
	this._pauseScreenBtnResume.regX = this._pauseScreenBtnResume.image.width / 2;
	this._pauseScreenBtnResume.regY = this._pauseScreenBtnResume.image.height / 2;
	this._pauseScreenBtnResume.scaleX = this._pauseScreenBtnResume.scaleY = co.doubleduck.Game.getScale();
	this._pauseScreenBtnResume.onClick = $bind(this,this.handlePauseClick);
	this._pauseScreenBtnResume.y = this._pauseScreenBtnRestart.y;
	this._pauseScreenBtnResume.x = this._pauseScreenBtnRestart.x + this._pauseScreenBtnRestart.image.width * co.doubleduck.Game.getScale() + 15 * co.doubleduck.Game.getScale();
	this._pauseScreenBtnMenu = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/end/btn_menu.png"),false);
	this._pauseScreenBtnMenu.regX = this._pauseScreenBtnMenu.image.width / 2;
	this._pauseScreenBtnMenu.regY = this._pauseScreenBtnMenu.image.height / 2;
	this._pauseScreenBtnMenu.scaleX = this._pauseScreenBtnMenu.scaleY = co.doubleduck.Game.getScale();
	this._pauseScreenBtnMenu.y = this._pauseScreenBtnRestart.y;
	this._pauseScreenBtnMenu.x = this._pauseScreenBtnRestart.x - this._pauseScreenBtnRestart.image.width * co.doubleduck.Game.getScale() - 15 * co.doubleduck.Game.getScale();
	this._pauseScreenBtnMenu.onClick = $bind(this,this.handleMenuClick);
	if(co.doubleduck.Game.DEBUG) {
		this._fps = new createjs.Text("0","Arial 22px","#FF0000");
		this.addChild(this._fps);
		this._fps.x = co.doubleduck.Game.getViewport().width - 100;
		this._fps.y = 250;
		createjs.Ticker.addListener(this);
	}
};
co.doubleduck.HUD.__name__ = ["co","doubleduck","HUD"];
co.doubleduck.HUD.__super__ = createjs.Container;
co.doubleduck.HUD.prototype = $extend(createjs.Container.prototype,{
	showDecreaseSecond: function() {
		var second = co.doubleduck.FontHelper.getNumber(-1);
		second.scaleX = second.scaleY = co.doubleduck.Game.getScale();
		second.regX = 0;
		second.x = this._remainingSecs.x;
		second.y = this._remainingSecs.y + co.doubleduck.Game.getViewport().height * 0.05;
		this.addChild(second);
		createjs.Tween.get(second).to({ alpha : 0, y : second.y + co.doubleduck.Game.getViewport().height * (0.05 + Math.random() * 0.01)},1000);
	}
	,setPauseOverlay: function(flag) {
		this._pauseScreenBG.visible = flag;
		if(flag) {
			this.removeChild(this._pauseBtn);
			this.addChild(this._pauseScreenBG);
			this.addChild(this._pauseBtn);
			this.addChild(this._pauseBtnScreenTitle);
			this.addChild(this._pauseScreenBtnRestart);
			this.addChild(this._pauseScreenBtnResume);
			this.addChild(this._pauseScreenBtnMenu);
			this._pauseBtn.visible = false;
		} else {
			this.removeChild(this._pauseScreenBG);
			this.removeChild(this._pauseBtnScreenTitle);
			this.removeChild(this._pauseScreenBtnRestart);
			this.removeChild(this._pauseScreenBtnResume);
			this.removeChild(this._pauseScreenBtnMenu);
			this._pauseBtn.visible = true;
		}
		co.doubleduck.Game.getStage().update();
	}
	,removePopup: function(money) {
		this.removeChild(money);
	}
	,popupScore: function(amount,posX,posY) {
		var money = co.doubleduck.FontHelper.getNumber(amount,1,true);
		var firstDigit = money.getChildAt(0);
		var dollar = co.doubleduck.FontHelper.getDollar();
		co.doubleduck.Utils.tintBitmap(dollar,0,1,0,1);
		dollar.x = firstDigit.x - firstDigit.image.width;
		money.addChildAt(dollar,0);
		money.scaleX = money.scaleY = co.doubleduck.Game.getScale() / 2;
		this.addChild(money);
		money.x = posX;
		money.y = posY;
		var deltaY = -35 * co.doubleduck.Game.getScale();
		var deltaX = -25 * co.doubleduck.Game.getScale() + Std.random(3) * 25 * co.doubleduck.Game.getScale();
		createjs.Tween.get(money).to({ y : posY + deltaY, x : posX + deltaX},700,createjs.Ease.sineOut).call($bind(this,this.removePopup),[money]);
	}
	,timeScaleDown: function() {
		createjs.Tween.get(this._remainingSecs).to({ scaleX : this._remainingSecs.scaleX, scaleY : this._remainingSecs.scaleY},450);
	}
	,timeScaleUp: function() {
		createjs.Tween.get(this._remainingSecs).to({ scaleX : this._remainingSecs.scaleX * 1.5, scaleY : this._remainingSecs.scaleY * 1.5},450).call($bind(this,this.timeScaleDown));
	}
	,setRemainingSecs: function(secs) {
		if(this._remainingSecs != null) this.removeChild(this._remainingSecs);
		if(secs > 3) {
			this._remainingSecs = co.doubleduck.FontHelper.getNumber(secs);
			this._remainingSecs.scaleX = this._remainingSecs.scaleY = co.doubleduck.Game.getScale() / 2;
		} else {
			this._remainingSecs = co.doubleduck.FontHelper.getNumber(secs);
			this._remainingSecs.scaleX = this._remainingSecs.scaleY = co.doubleduck.Game.getScale() / 2;
		}
		var width = 0;
		var height = 0;
		if(secs > 9) {
			var contain = this._remainingSecs;
			var digit1 = contain.getChildAt(0);
			var digit2 = contain.getChildAt(1);
			width += digit1.image.width * co.doubleduck.Game.getScale();
			width += digit2.image.width * co.doubleduck.Game.getScale();
			height = digit1.image.height;
		} else {
			var digit = this._remainingSecs;
			height = digit.image.height;
			width += digit.image.width * co.doubleduck.Game.getScale();
		}
		this._remainingSecs.regY = height / 2;
		this._remainingSecs.y = this._pauseBtn.y;
		this._remainingSecs.regX = width;
		this._remainingSecs.x = this._pauseBtn.x - this._pauseBtn.image.width * 1.5 * co.doubleduck.Game.getScale();
		this.addChild(this._remainingSecs);
	}
	,tick: function() {
		if(co.doubleduck.Game.DEBUG) this._fps.text = "" + createjs.Ticker.getMeasuredFPS();
	}
	,setScore: function(score) {
		var prevPercent = co.doubleduck.Utils.map(this._prevScore,0,this._starsScore[2]);
		var percent = co.doubleduck.Utils.map(score,0,this._starsScore[2]);
		if(this._scoreText != null) this.removeChild(this._scoreText);
		var width = 0;
		var height = 0;
		this._scoreText = co.doubleduck.FontHelper.getNumber(score);
		if(score < 10) {
			var digit = this._scoreText;
			width = digit.image.width * co.doubleduck.Game.getScale();
			height = digit.image.height;
		} else {
			var cont = this._scoreText;
			var _g1 = 0, _g = cont.children.length;
			while(_g1 < _g) {
				var currDigit = _g1++;
				var digit = cont.getChildAt(currDigit);
				width += digit.image.width * co.doubleduck.Game.getScale();
				height = digit.image.height;
			}
		}
		this._scoreText.regX = width / 2;
		this._scoreText.regY = height / 2;
		this._scoreText.scaleX = this._scoreText.scaleY = co.doubleduck.Game.getScale() / 2;
		this._scoreText.x = this._scoreBox.x + this._scoreBox.image.width / 2 * co.doubleduck.Game.getScale();
		this._scoreText.y = this._scoreBox.y + this._scoreBox.image.height * co.doubleduck.Game.getScale() * 0.5;
		this.addChild(this._scoreText);
		this._scoreBarMask.graphics.clear();
		this._scoreBarMask.x = 0;
		this._scoreBarMask.graphics.beginFill("#00000000");
		var fillWidth = this._scoreFill.image.width * co.doubleduck.Game.getScale();
		var fillHeight = this._scoreFill.image.height * co.doubleduck.Game.getScale();
		var deltaWidth = fillWidth * (percent - prevPercent);
		this._scoreBarMask.graphics.drawRect(this._scoreFill.x - deltaWidth,this._scoreFill.y - fillHeight / 2,fillWidth * percent,fillHeight);
		this._scoreBarMask.graphics.endFill();
		this._scoreFill.mask = this._scoreBarMask;
		createjs.Tween.get(this._scoreBarMask).to({ x : this._scoreBarMask.x + deltaWidth},350);
		this._prevScore = score;
		var _g1 = 0, _g = this._starsScore.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(score >= this._starsScore[i]) {
				if(this._stars[i].currentAnimation == "dark") {
					this._stars[i].gotoAndStop("light");
					var currScale = this._stars[i].scaleX;
					var targetScale = currScale * 1.5;
					createjs.Tween.get(this._stars[i]).to({ scaleX : targetScale, scaleY : targetScale},80).to({ scaleX : currScale, scaleY : currScale},140);
				}
			}
		}
	}
	,handlePauseClick: function() {
		if(this.onPauseClick != null) this.onPauseClick();
	}
	,handleRestartClick: function() {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart();
		}
	}
	,handleMenuClick: function() {
		if(this.onMenuClick != null) {
			createjs.Ticker.setPaused(false);
			this.onMenuClick();
		}
	}
	,_pauseScreenBtnResume: null
	,_pauseScreenBtnRestart: null
	,_pauseScreenBtnMenu: null
	,_pauseBtnScreenTitle: null
	,_pauseScreenBG: null
	,_pauseBtn: null
	,_remainingSecs: null
	,_stars: null
	,_starsScore: null
	,_scoreBarMask: null
	,_scoreFill: null
	,_scoreBar: null
	,_scoreText: null
	,_scoreBox: null
	,_prevScore: null
	,_fps: null
	,onMenuClick: null
	,onRestart: null
	,onPauseClick: null
	,__class__: co.doubleduck.HUD
});
co.doubleduck.LevelEndScreen = $hxClasses["co.doubleduck.LevelEndScreen"] = function(level,score) {
	this._destroyed = false;
	this.onNextClick = null;
	this.onMenuClick = null;
	this.onRestartClick = null;
	this._scoreContainer = null;
	this._splashHeight = 400;
	this._splashWidth = 350;
	createjs.Container.call(this);
	this._score = score;
	this._level = level;
	var alphaLayer = new createjs.Shape();
	alphaLayer.graphics.beginFill("#000000");
	alphaLayer.graphics.drawRect(0,0,co.doubleduck.Game.MAX_WIDTH,co.doubleduck.Game.MAX_HEIGHT);
	alphaLayer.graphics.endFill();
	alphaLayer.alpha = 0.5;
	this.addChild(alphaLayer);
	this._splashGraphic = new createjs.Container();
	this.addChild(this._splashGraphic);
	var base = co.doubleduck.Assets.getImage("images/end/base.png");
	base.regY = base.image.height / 2;
	base.y = co.doubleduck.Game.MAX_HEIGHT * 0.5;
	this._splashGraphic.addChild(base);
	var levelsData = co.doubleduck.DataLoader.getLevel(level);
	var failed = score < (levelsData.stars[0] | 0);
	if(failed) {
		var failedImage = co.doubleduck.Assets.getImage("images/end/fail.png");
		failedImage.regX = failedImage.image.width / 2;
		failedImage.regX = failedImage.image.height / 2;
		failedImage.x = co.doubleduck.Game.MAX_WIDTH / 2;
		failedImage.y = co.doubleduck.Game.MAX_HEIGHT * 0.38;
		this._splashGraphic.addChild(failedImage);
	} else {
		this._stars = new Array();
		var cols = new Array();
		cols = [-1,0,1];
		var _g = 0;
		while(_g < 3) {
			var currStar = _g++;
			var newStar = null;
			newStar = co.doubleduck.Assets.getImage("images/end/star_empty.png");
			newStar.regX = newStar.image.width / 2;
			newStar.regY = newStar.image.height / 2;
			newStar.y = co.doubleduck.Game.MAX_HEIGHT * 0.41;
			newStar.x = co.doubleduck.Game.MAX_WIDTH / 2 + cols[currStar] * newStar.image.width;
			this._splashGraphic.addChild(newStar);
			this._stars[currStar] = newStar;
		}
	}
	var nextLevel = level + 1;
	var nextLevelData = co.doubleduck.DataLoader.getLevel(nextLevel);
	var nextLevelAvailable = co.doubleduck.Persistence.getUnlockedLevel() > level && nextLevelData != null;
	this._restartBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/end/btn_replay.png"));
	this._restartBtn.regX = this._restartBtn.image.width / 2;
	this._restartBtn.regY = this._restartBtn.image.height / 2;
	if(nextLevelAvailable) this._restartBtn.x = co.doubleduck.Game.MAX_WIDTH / 2; else this._restartBtn.x = co.doubleduck.Game.MAX_WIDTH * 0.64;
	this._restartBtn.y = co.doubleduck.Game.MAX_HEIGHT * 0.75;
	this._splashGraphic.addChild(this._restartBtn);
	this._menuBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/end/btn_menu.png"));
	this._menuBtn.regX = this._menuBtn.image.width / 2;
	this._menuBtn.regY = this._menuBtn.image.height / 2;
	if(nextLevelAvailable) this._menuBtn.x = this._restartBtn.x - this._restartBtn.image.width - 15; else this._menuBtn.x = co.doubleduck.Game.MAX_WIDTH * 0.36;
	this._menuBtn.y = co.doubleduck.Game.MAX_HEIGHT * 0.75;
	this._splashGraphic.addChild(this._menuBtn);
	this._nextBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/end/btn_next.png"));
	this._nextBtn.regX = this._nextBtn.image.width / 2;
	this._nextBtn.regY = this._nextBtn.image.height / 2;
	this._nextBtn.x = this._restartBtn.x + this._restartBtn.image.width + 15;
	this._nextBtn.y = co.doubleduck.Game.MAX_HEIGHT * 0.75;
	if(nextLevelAvailable) this._splashGraphic.addChild(this._nextBtn);
	this._splashGraphic.y += co.doubleduck.Game.MAX_HEIGHT;
	this.scaleX = this.scaleY = co.doubleduck.Game.getScale();
	this.regX = base.image.width / 2;
	this.regY = base.image.height / 2;
	this.x = co.doubleduck.Game.getViewport().width / 2;
	this.y = co.doubleduck.Game.getViewport().height / 2;
	createjs.Tween.get(this._splashGraphic).to({ y : 0},1000,createjs.Ease.elasticOut).call($bind(this,this.splashEntered));
};
co.doubleduck.LevelEndScreen.__name__ = ["co","doubleduck","LevelEndScreen"];
co.doubleduck.LevelEndScreen.__super__ = createjs.Container;
co.doubleduck.LevelEndScreen.prototype = $extend(createjs.Container.prototype,{
	updateScore: function() {
		var now = createjs.Ticker.getTime(false);
		var interval = 500;
		if(this._score > 20) interval = 1200;
		var dTime = now - this._scoreStartTime;
		var relativeScore = this._score * (dTime / interval) | 0;
		if(relativeScore >= this._score) relativeScore = this._score;
		this.setScore(relativeScore);
		if(relativeScore < this._score) createjs.Tween.get(this).wait(10).call($bind(this,this.updateScore));
	}
	,doScore: function() {
		this._scoreStartTime = createjs.Ticker.getTime(false);
		this.updateScore();
	}
	,handleNextClick: function() {
		this.destroy();
		this.onNextClick();
	}
	,handleRestartClick: function() {
		this.destroy();
		this.onRestartClick();
	}
	,handleMenuClick: function() {
		this.destroy();
		this.onMenuClick();
	}
	,splashEntered: function() {
		if(this._stars != null) {
			this.doScore();
			this.starTween(0);
		}
		if(this.onMenuClick != null) this._menuBtn.onClick = $bind(this,this.handleMenuClick);
		if(this.onRestartClick != null) this._restartBtn.onClick = $bind(this,this.handleRestartClick);
		if(this.onNextClick != null) this._nextBtn.onClick = $bind(this,this.handleNextClick);
	}
	,starTween: function(num) {
		if(num > 2) return;
		var levelsData = co.doubleduck.DataLoader.getLevel(this._level);
		if(this._score >= (levelsData.stars[num] | 0)) {
			var starSound = "sound/Star" + (num + 1 | 0);
			if(!this._destroyed) this._playingSound = co.doubleduck.SoundManager.playEffect(starSound);
			var old = this._stars[num];
			this._stars[num] = co.doubleduck.Assets.getImage("images/end/star_full.png");
			this._stars[num].regX = old.regX;
			this._stars[num].regY = old.regY;
			this._stars[num].y = old.y;
			this._stars[num].x = old.x;
			this._splashGraphic.addChild(this._stars[num]);
			this._splashGraphic.removeChild(old);
			var currScale = this._stars[num].scaleX;
			var targetScale = currScale * 1.5;
			createjs.Tween.get(this._stars[num]).wait(50).to({ scaleX : targetScale, scaleY : targetScale},80).to({ scaleX : currScale, scaleY : currScale},140).wait(200).call($bind(this,this.starTween),[num + 1]);
		}
	}
	,destroy: function() {
		this._destroyed = true;
	}
	,setScore: function(score) {
		if(this._scoreContainer != null) this._splashGraphic.removeChild(this._scoreContainer);
		this._scoreContainer = co.doubleduck.FontHelper.getNumber(score,1,false,true);
		var dollar = co.doubleduck.FontHelper.getDollar();
		this._scoreContainer.addChildAt(dollar,0);
		var totalWidth = dollar.image.width;
		var _g1 = 1, _g = this._scoreContainer.children.length;
		while(_g1 < _g) {
			var currDigit = _g1++;
			var digit = this._scoreContainer.getChildAt(currDigit);
			digit.x += dollar.image.width;
			totalWidth += digit.image.width;
		}
		this._scoreContainer.scaleX = this._scoreContainer.scaleY = 0.8;
		this._scoreContainer.regX = totalWidth / 2;
		this._scoreContainer.x = co.doubleduck.Game.MAX_WIDTH * 0.5;
		this._scoreContainer.y = co.doubleduck.Game.MAX_HEIGHT * 0.51;
		this._splashGraphic.addChild(this._scoreContainer);
	}
	,_playingSound: null
	,_destroyed: null
	,onNextClick: null
	,onMenuClick: null
	,onRestartClick: null
	,_scoreContainer: null
	,_scoreStartTime: null
	,_level: null
	,_score: null
	,_stars: null
	,_splashHeight: null
	,_splashWidth: null
	,_nextBtn: null
	,_menuBtn: null
	,_restartBtn: null
	,_splashGraphic: null
	,__class__: co.doubleduck.LevelEndScreen
});
co.doubleduck.Liquid = $hxClasses["co.doubleduck.Liquid"] = function(id,name,graphic,icon,fillBack,fillFront) {
	this._liquidType = id;
	this._name = name;
	this._iconUri = icon;
	this._fillFront = fillFront;
	this._fillBack = fillBack;
	co.doubleduck.Button.call(this,co.doubleduck.Assets.getImage(graphic));
	this.setNoSound();
};
co.doubleduck.Liquid.__name__ = ["co","doubleduck","Liquid"];
co.doubleduck.Liquid.createLiquid = function(id) {
	var liquid = co.doubleduck.DataLoader.getLiquidById(id);
	return new co.doubleduck.Liquid(id,liquid.name,liquid.bigIcon,liquid.smallIcon,liquid.fillBack,liquid.fillFront);
}
co.doubleduck.Liquid.__super__ = co.doubleduck.Button;
co.doubleduck.Liquid.prototype = $extend(co.doubleduck.Button.prototype,{
	getFillBack: function() {
		return this._fillBack;
	}
	,getFillFront: function() {
		return this._fillFront;
	}
	,getIconUri: function() {
		return this._iconUri;
	}
	,getName: function() {
		return this._name;
	}
	,getType: function() {
		return this._liquidType;
	}
	,_fillFront: null
	,_fillBack: null
	,_iconUri: null
	,_name: null
	,_liquidType: null
	,__class__: co.doubleduck.Liquid
});
co.doubleduck.Main = $hxClasses["co.doubleduck.Main"] = function() { }
co.doubleduck.Main.__name__ = ["co","doubleduck","Main"];
co.doubleduck.Main._stage = null;
co.doubleduck.Main._game = null;
co.doubleduck.Main._ffHeight = null;
co.doubleduck.Main.main = function() {
	co.doubleduck.Main.testFFHeight();
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Main.testFFHeight = function() {
	var isApplicable = /Firefox/.test(navigator.userAgent);
	if(isApplicable && viewporter.ACTIVE) co.doubleduck.Main._ffHeight = js.Lib.window.innerHeight;
}
co.doubleduck.Main.getFFHeight = function() {
	return co.doubleduck.Main._ffHeight;
}
co.doubleduck.Menu = $hxClasses["co.doubleduck.Menu"] = function(targetLevel) {
	if(targetLevel == null) targetLevel = 1;
	this._isSweeping = false;
	this._mostUnlocked = 0;
	this._enabledPack = -1;
	this.SCROLL_EASE = 0.01;
	this.LEVELS_PER_PACK = 4;
	this.PACK_ROW_POS = 0.5;
	createjs.Container.call(this);
	this.POS_IN_PACK = new Array();
	var buttonSpacing = 0.185;
	this.POS_IN_PACK[this.POS_IN_PACK.length] = { pos : [-buttonSpacing,-buttonSpacing]};
	this.POS_IN_PACK[this.POS_IN_PACK.length] = { pos : [buttonSpacing,-buttonSpacing]};
	this.POS_IN_PACK[this.POS_IN_PACK.length] = { pos : [-buttonSpacing,buttonSpacing]};
	this.POS_IN_PACK[this.POS_IN_PACK.length] = { pos : [buttonSpacing,buttonSpacing]};
	this._levelsArray = new Array();
	this._levelsData = new LevelDB().getAllLevels();
	this.PACK_COUNT = Math.ceil(this._levelsData.length / this.LEVELS_PER_PACK);
	this._background = co.doubleduck.Assets.getImage("images/menu/background.png");
	this._background.scaleX = this._background.scaleY = co.doubleduck.Game.getScale();
	this._background.regX = this._background.image.width / 2;
	this._background.regY = this._background.image.height / 2;
	this._background.x = co.doubleduck.Game.getViewport().width / 2;
	this._background.y = co.doubleduck.Game.getViewport().height / 2;
	this.addChildAt(this._background,0);
	this._selectRight = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/btn_arrow.png"));
	this._selectRight.scaleX = this._selectRight.scaleY = co.doubleduck.Game.getScale();
	this._selectRight.regX = this._selectRight.image.width;
	this._selectRight.regY = this._selectRight.image.height / 2;
	this._selectRight.setNoSound();
	this._selectLeft = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/btn_arrow.png"));
	this._selectLeft.scaleX = this._selectLeft.scaleY = co.doubleduck.Game.getScale();
	this._selectLeft.scaleX *= -1;
	this._selectLeft.regX = this._selectLeft.image.width;
	this._selectLeft.regY = this._selectLeft.image.height / 2;
	this._selectLeft.setNoSound();
	this._selectRight.x = co.doubleduck.Game.getViewport().width - 5;
	this._selectRight.y = co.doubleduck.Game.getViewport().height * this.PACK_ROW_POS;
	this._selectLeft.x = 5;
	this._selectLeft.y = this._selectRight.y;
	this._selectRight.onClick = $bind(this,this.handleNextPack);
	this._selectLeft.onClick = $bind(this,this.handlePrevPack);
	this._levelsLayer = new createjs.Container();
	this._levelsLayer.x = co.doubleduck.Game.getViewport().width * 0.5;
	this._levelsLayer.y = co.doubleduck.Game.getViewport().height * this.PACK_ROW_POS;
	this.addChild(this._levelsLayer);
	this.addChild(this._selectRight);
	this.addChild(this._selectLeft);
	co.doubleduck.Game.hammer.onswipe = $bind(this,this.handleSwipe);
	var _g1 = 0, _g = this.PACK_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		this.loadLevelPack(i);
	}
	this.targetPack(Math.floor((targetLevel - 1) / this.LEVELS_PER_PACK),true);
	this._helpBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/btn_help.png"));
	this._helpBtn.regX = this._helpBtn.image.width;
	this._helpBtn.regY = this._helpBtn.image.height;
	this._helpBtn.scaleX = this._helpBtn.scaleY = co.doubleduck.Game.getScale();
	this._helpBtn.x = co.doubleduck.Game.getViewport().width * 0.95;
	this._helpBtn.y = co.doubleduck.Game.getViewport().height * 0.94;
	this._helpBtn.onClick = $bind(this,this.showHelp);
	this.addChild(this._helpBtn);
	this._helpScreenShown = false;
	if(co.doubleduck.SoundManager.available) {
		this._muteButton = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/audio_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
		this._muteButton.scaleX = this._muteButton.scaleY = co.doubleduck.Game.getScale();
		this._muteButton.setToggle(co.doubleduck.SoundManager.isMuted());
		this._muteButton.onToggle = co.doubleduck.SoundManager.toggleMute;
		this._muteButton.y = this._helpBtn.y - this._helpBtn.image.height / 2 * co.doubleduck.Game.getScale();
		this._muteButton.x = (this._muteButton.image.width / 4 + 20) * co.doubleduck.Game.getScale();
		this.addChild(this._muteButton);
	}
	this._helpScreen = co.doubleduck.Assets.getImage("images/menu/help.png");
	this._helpScreen.regX = this._helpScreen.image.width / 2;
	this._helpScreen.regY = this._helpScreen.image.height / 2;
	this._helpScreen.scaleX = this._helpScreen.scaleY = co.doubleduck.Game.getScale();
	this._helpScreen.x = co.doubleduck.Game.getViewport().width / 2;
	this._helpScreen.y = co.doubleduck.Game.getViewport().height / 2;
	this._helpScreen.visible = false;
	this.addChild(this._helpScreen);
	this._closeHelpBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/btn_close.png"));
	this._closeHelpBtn.regX = this._closeHelpBtn.image.width / 2;
	this._closeHelpBtn.regY = this._closeHelpBtn.image.height / 2;
	this._closeHelpBtn.scaleX = this._closeHelpBtn.scaleY = co.doubleduck.Game.getScale();
	this._closeHelpBtn.x = this._helpScreen.x - this._helpScreen.regX * co.doubleduck.Game.getScale();
	this._closeHelpBtn.x += this._helpScreen.image.width * co.doubleduck.Game.getScale() * 0.75;
	this._closeHelpBtn.y = this._helpScreen.y - this._helpScreen.regY * co.doubleduck.Game.getScale();
	this._closeHelpBtn.y += this._helpScreen.image.height * co.doubleduck.Game.getScale() * 0.8;
	this._closeHelpBtn.onClick = $bind(this,this.closeHelp);
	this._closeHelpBtn.visible = false;
	this.addChild(this._closeHelpBtn);
	this._bgMusic = co.doubleduck.SoundManager.playMusic("sound/shakeIt_music1");
	if(co.doubleduck.Persistence.getUnlockedLevel() == 1) this.showHelp(false);
};
co.doubleduck.Menu.__name__ = ["co","doubleduck","Menu"];
co.doubleduck.Menu.__super__ = createjs.Container;
co.doubleduck.Menu.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this._bgMusic.stop();
		this.onStart = null;
		co.doubleduck.Game.hammer.onswipe = null;
		if(this._isSweeping) createjs.Ticker.removeListener(this);
	}
	,getChosenLevel: function() {
		return this._chosenLevel;
	}
	,handleLevelClick: function(event) {
		if(this._helpScreen.visible) return;
		this._chosenLevel = Std.parseInt(event.target.name);
		this.onStart();
	}
	,tick: function(elapsed) {
		if(this._levelsLayer.x == this._targetPos) {
			createjs.Ticker.removeListener(this);
			this._isSweeping = false;
			return;
		}
		this._levelsLayer.x += (this._targetPos - this._levelsLayer.x) * this.SCROLL_EASE * elapsed;
		var posx = (this.getPackCenterPos(this._chosenPack) + this._levelsLayer.x) / co.doubleduck.Game.getViewport().width;
		if(posx > 0.49 && posx < 0.51) this.togglePackEnabled(this._chosenPack,true);
	}
	,targetPack: function(id,force) {
		if(force == null) force = false;
		this._chosenPack = id;
		this._targetPos = co.doubleduck.Game.getViewport().width / 2 - this.getPackCenterPos(id);
		if(id == 0) this._selectLeft.visible = false; else this._selectLeft.visible = true;
		if(id == this.PACK_COUNT - 1) this._selectRight.visible = false; else this._selectRight.visible = true;
		if(force) {
			this._isSweeping = false;
			this._levelsLayer.x = this._targetPos;
			this.togglePackEnabled(id,true);
		} else {
			this._isSweeping = true;
			createjs.Ticker.addListener(this);
		}
	}
	,getPackCenterPos: function(id) {
		return this._background.image.width * co.doubleduck.Game.getScale() * id;
	}
	,handlePrevPack: function() {
		if(this._helpScreen.visible) return;
		if(this._chosenPack > 0) {
			this.togglePackEnabled(this._chosenPack,false);
			this.targetPack(this._chosenPack - 1);
			co.doubleduck.SoundManager.playEffect("sound/level_switch");
		}
	}
	,handleNextPack: function() {
		if(this._helpScreen.visible) return;
		if(this._chosenPack < this.PACK_COUNT - 1) {
			this.togglePackEnabled(this._chosenPack,false);
			this.targetPack(this._chosenPack + 1);
			co.doubleduck.SoundManager.playEffect("sound/level_switch");
		}
	}
	,handleSwipe: function(event) {
		if(event.direction == "left") this.handleNextPack(); else if(event.direction == "right") this.handlePrevPack();
	}
	,togglePackEnabled: function(packID,flag) {
		if(flag) {
			if(this._enabledPack != -1) return; else this._enabledPack = packID;
		} else if(this._enabledPack != packID) return; else this._enabledPack = -1;
		var fromIndex = packID * this.LEVELS_PER_PACK;
		var toIndex = fromIndex + this.LEVELS_PER_PACK;
		var _g = fromIndex;
		while(_g < toIndex) {
			var i = _g++;
			var unlockedLevel = co.doubleduck.Persistence.getUnlockedLevel();
			var currLevelNum = Std.parseInt(this._levelsArray[i].name);
			if(flag && currLevelNum <= unlockedLevel) this._levelsArray[i].onClick = $bind(this,this.handleLevelClick); else this._levelsArray[i].onClick = null;
		}
	}
	,loadLevelPack: function(packID) {
		if(packID < 0 || packID > 99 || packID >= this.PACK_COUNT) return;
		var currUnlocked = co.doubleduck.Persistence.getUnlockedLevel();
		var _g1 = 0, _g = this.LEVELS_PER_PACK;
		while(_g1 < _g) {
			var i = _g1++;
			if(packID * this.LEVELS_PER_PACK + i >= this._levelsData.length) break;
			var lvlPos = this.LEVELS_PER_PACK * packID + i + 1;
			var newLevel = null;
			var unlockedLevel = lvlPos <= currUnlocked;
			if(unlockedLevel) newLevel = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/thumb_icon.png")); else newLevel = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/thumb_locked.png"));
			newLevel.regX = newLevel.image.width / 2;
			newLevel.regY = newLevel.image.height / 2;
			newLevel.scaleX = newLevel.scaleY = co.doubleduck.Game.getScale();
			newLevel.x = this.POS_IN_PACK[i].pos[0] * co.doubleduck.Game.getViewport().width + this.getPackCenterPos(packID);
			if(co.doubleduck.Game.getViewport().width < co.doubleduck.Game.getViewport().height) newLevel.y = this.POS_IN_PACK[i].pos[1] * this._background.image.width * co.doubleduck.Game.getScale(); else newLevel.y = this.POS_IN_PACK[i].pos[1] * co.doubleduck.Game.getViewport().height;
			newLevel.name = "" + lvlPos;
			if(unlockedLevel) {
				newLevel.addLabel(newLevel.name);
				var levelScore = co.doubleduck.Persistence.getLevelScore(lvlPos);
				var _g2 = 0;
				while(_g2 < 3) {
					var j = _g2++;
					var newStar;
					if(levelScore >= this._levelsData[lvlPos - 1].stars[j]) newStar = co.doubleduck.Assets.getImage("images/menu/star_full.png"); else newStar = co.doubleduck.Assets.getImage("images/menu/star_empty.png");
					newStar.regX = newStar.image.width / 2;
					newStar.regY = newStar.image.height / 2;
					newStar.y = newLevel.image.height * 0.81;
					newStar.x = newLevel.image.width * 0.15;
					newStar.x += j * (newLevel.image.width * 0.35);
					newLevel.addChild(newStar);
				}
			}
			this._levelsLayer.addChild(newLevel);
			this._levelsArray[lvlPos - 1] = newLevel;
		}
	}
	,removeHelpScreen: function() {
		if(this._helpScreenShown) return;
		this._closeHelpBtn.visible = false;
		this._helpScreen.visible = false;
	}
	,closeHelp: function() {
		this._closeHelpBtn.onClick = null;
		this._helpScreenShown = false;
		this._helpBtn.onClick = $bind(this,this.showHelp);
		createjs.Tween.get(this._closeHelpBtn).to({ alpha : 0},500);
		createjs.Tween.get(this._helpScreen).to({ alpha : 0},600).call($bind(this,this.removeHelpScreen));
	}
	,showHelpCloseButton: function() {
		this._closeHelpBtn.alpha = 0;
		this._closeHelpBtn.onClick = $bind(this,this.closeHelp);
		createjs.Tween.get(this._closeHelpBtn).to({ alpha : 1},500);
	}
	,showHelp: function(fade) {
		if(fade == null) fade = true;
		this._helpScreenShown = true;
		this._helpBtn.onClick = null;
		if(fade) {
			this._helpScreen.alpha = 0;
			this._closeHelpBtn.alpha = 0;
			createjs.Tween.get(this._helpScreen).to({ alpha : 1},500).call($bind(this,this.showHelpCloseButton));
		} else {
			this._closeHelpBtn.alpha = 0;
			this._helpScreen.alpha = 1;
			createjs.Tween.get(this._closeHelpBtn).wait(1500).call($bind(this,this.showHelpCloseButton));
		}
		this._helpScreen.visible = true;
		this._closeHelpBtn.visible = true;
	}
	,_muteButton: null
	,_bgMusic: null
	,_closeHelpBtn: null
	,_helpScreen: null
	,_helpBtn: null
	,_helpScreenShown: null
	,_levelsLayer: null
	,_targetPos: null
	,_isSweeping: null
	,_stars: null
	,_mostUnlocked: null
	,_levelsData: null
	,_highscore: null
	,_knocksRemaining: null
	,_totalKnocks: null
	,_playButton: null
	,_selectLeft: null
	,_selectRight: null
	,_chosenLevel: null
	,_chosenPack: null
	,_enabledPack: null
	,_levelsArray: null
	,_background: null
	,POS_IN_PACK: null
	,PACK_COUNT: null
	,SCROLL_EASE: null
	,LEVELS_PER_PACK: null
	,PACK_ROW_POS: null
	,onStart: null
	,__class__: co.doubleduck.Menu
});
co.doubleduck.Persistence = $hxClasses["co.doubleduck.Persistence"] = function() {
};
co.doubleduck.Persistence.__name__ = ["co","doubleduck","Persistence"];
co.doubleduck.Persistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.Persistence.getValue = function(key) {
	if(!co.doubleduck.Persistence.available) return "0";
	var val = localStorage[co.doubleduck.Persistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.Persistence.setValue = function(key,value) {
	if(!co.doubleduck.Persistence.available) return;
	localStorage[co.doubleduck.Persistence.GAME_PREFIX + key] = value;
}
co.doubleduck.Persistence.clearAll = function() {
	if(!co.doubleduck.Persistence.available) return;
	localStorage.clear();
}
co.doubleduck.Persistence.setLevelScore = function(level,score) {
	co.doubleduck.Persistence.setValue("level_" + level + "_score","" + score);
}
co.doubleduck.Persistence.getLevelScore = function(level) {
	return Std.parseInt(co.doubleduck.Persistence.getValue("level_" + level + "_score"));
}
co.doubleduck.Persistence.setUnlockedLevel = function(level) {
	co.doubleduck.Persistence.setValue("unlocked_level","" + level);
}
co.doubleduck.Persistence.getUnlockedLevel = function() {
	var result = Std.parseInt(co.doubleduck.Persistence.getValue("unlocked_level"));
	if(result < 1) result = 1;
	return result;
}
co.doubleduck.Persistence.initGameData = function() {
	if(!co.doubleduck.Persistence.available) return;
	co.doubleduck.Persistence.initVar("unlocked_level");
	var levelDB = new LevelDB();
	var allLleves = levelDB.getAllLevels();
	var _g1 = 0, _g = allLleves.length;
	while(_g1 < _g) {
		var currLevel = _g1++;
		var level = allLleves[currLevel].id;
		co.doubleduck.Persistence.initVar("level_" + level + "_score");
	}
}
co.doubleduck.Persistence.printGameData = function() {
	var levelDB = new LevelDB();
	var allLleves = levelDB.getAllLevels();
	var _g1 = 0, _g = allLleves.length;
	while(_g1 < _g) {
		var currLevel = _g1++;
		var level = allLleves[currLevel].id;
		null;
	}
}
co.doubleduck.Persistence.initVar = function(initedVar) {
	var value = co.doubleduck.Persistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.Persistence.setValue(initedVar,"0");
	} catch( e ) {
		co.doubleduck.Persistence.available = false;
	}
}
co.doubleduck.Persistence.prototype = {
	__class__: co.doubleduck.Persistence
}
co.doubleduck.Session = $hxClasses["co.doubleduck.Session"] = function(levelId) {
	this._isBlending = false;
	this._sessionEnded = false;
	this._isPaused = false;
	createjs.Container.call(this);
	co.doubleduck.Session.FRUIT_BLENDER_POS = [[-0.12,-0.4],[0.15,-0.5],[-0.22,-0.6],[0.18,-0.67]];
	this._customerSlots = [null,null,null];
	this._levelData = co.doubleduck.DataLoader.getLevel(levelId);
	this._starsScore = this._levelData.stars;
	this.constructLevel();
	this._lastBlenderClick = 0;
	this._currentRecipe = new Array();
	this._blendedRecipe = new Array();
	this._fruitBlenderSlots = [null,null,null,null,null,null];
	this._currentLiquid = null;
	this._blendedLiquid = null;
	this._numActiveCustomers = 0;
	this._remainingTime = this._levelData.duration;
	this._money = 0;
	this.levelTimer();
	this.spawnTimer();
};
co.doubleduck.Session.__name__ = ["co","doubleduck","Session"];
co.doubleduck.Session.FRUIT_BLENDER_POS = null;
co.doubleduck.Session.__super__ = createjs.Container;
co.doubleduck.Session.prototype = $extend(createjs.Container.prototype,{
	setOnRestart: function(cb) {
		this.onRestart = cb;
		this._hud.onRestart = cb;
	}
	,setOnBackToMenu: function(cb) {
		this.onBackToMenu = cb;
		this._hud.onMenuClick = cb;
	}
	,getScore: function() {
		return this._money;
	}
	,getLevel: function() {
		return this._levelData.id;
	}
	,destroy: function() {
		this._sessionEnded = true;
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
		var _g1 = 0, _g = this._customerSlots.length;
		while(_g1 < _g) {
			var currCustomer = _g1++;
			if(this._customerSlots[currCustomer] != null) this._customerSlots[currCustomer].destroy();
		}
	}
	,timesUp: function() {
		this._sessionEnded = true;
		if(this.onSessionEnd != null) this.onSessionEnd();
		this._blender.onClick = null;
		var _g1 = 0, _g = this._fruitsOnBooth.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._fruitsOnBooth[i].onClick = null;
		}
		var _g1 = 0, _g = this._liquidsOnBooth.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._liquidsOnBooth[i].onClick = null;
		}
		var endScreen = new co.doubleduck.LevelEndScreen(this._levelData.id | 0,this._money);
		endScreen.onMenuClick = this.onBackToMenu;
		endScreen.onRestartClick = this.onRestart;
		endScreen.onNextClick = this.onNextLevel;
		this.addChild(endScreen);
	}
	,levelTimer: function() {
		if(this._sessionEnded) return;
		this._hud.setRemainingSecs(this._remainingTime);
		if(this._remainingTime == 0) {
			this.timesUp();
			return;
		} else {
			this._remainingTime--;
			co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.levelTimer));
		}
	}
	,resume: function() {
		if(this._isPaused) {
			this._isPaused = false;
			createjs.Ticker.setPaused(false);
			this._pauseDuration = createjs.Ticker.getTime(false) - this._pauseDuration;
			this._hud.setPauseOverlay(false);
		}
	}
	,pause: function() {
		if(this._sessionEnded) return;
		if(!this._isPaused) {
			this._isPaused = true;
			createjs.Ticker.setPaused(true);
			this._pauseDuration = createjs.Ticker.getTime(false);
			this._hud.setPauseOverlay(true);
		}
	}
	,handlePauseClick: function() {
		if(this._isPaused) this.resume(); else this.pause();
	}
	,getIsPaused: function() {
		return this._isPaused;
	}
	,clickFruit: function(event) {
		if(this._isPaused || this._isBlending || this._currentRecipe.length == co.doubleduck.Session.MAX_RECIPE_SIZE || this._sessionEnded) return;
		var fruitNum = Std.random(3) + 1;
		var fruitSound = "sound/fruit" + fruitNum;
		co.doubleduck.SoundManager.playEffect(fruitSound);
		var clickedFruit = event.target;
		var fruitIcon = co.doubleduck.Assets.getImage(clickedFruit.getIconUri());
		fruitIcon.regX = fruitIcon.image.width / 2;
		fruitIcon.regY = fruitIcon.image.height;
		fruitIcon.scaleX = fruitIcon.scaleY = co.doubleduck.Game.getScale();
		this._blendedFruitsLayer.addChild(fruitIcon);
		this._currentRecipe[this._currentRecipe.length] = clickedFruit;
		var pos = new Array();
		pos[0] = co.doubleduck.Session.FRUIT_BLENDER_POS[this._currentRecipe.length - 1][0] * this._blender.image.width * co.doubleduck.Game.getScale();
		pos[1] = co.doubleduck.Session.FRUIT_BLENDER_POS[this._currentRecipe.length - 1][1] * this._blender.image.height * co.doubleduck.Game.getScale();
		fruitIcon.x = pos[0];
		fruitIcon.y = pos[1];
		this._fruitBlenderSlots[this._currentRecipe.length] = fruitIcon;
	}
	,clickLiquid: function(event) {
		var clickedLiquid = event.target;
		if(this._currentLiquid != null || this._isBlending || this._sessionEnded || this._isPaused) return;
		this._currentLiquid = clickedLiquid;
		co.doubleduck.SoundManager.playEffect("sound/liquid1");
		this._blenderLiquidBack = co.doubleduck.Assets.getImage(clickedLiquid.getFillBack());
		this._blenderLiquidBack.regX = this._blender.regX;
		this._blenderLiquidBack.regY = this._blender.regY;
		this._blenderLiquidBack.scaleX = this._blenderLiquidBack.scaleY = co.doubleduck.Game.getScale();
		this._blenderLiquidBack.x = this._blender.x;
		this._blenderLiquidBack.y = this._blender.y;
		this._blenderLiquidBack.alpha = 0.75;
		var addAt = Math.floor(this.getChildIndex(this._blendedFruitsLayer));
		this.addChildAt(this._blenderLiquidBack,addAt);
		this._blenderLiquidFront = co.doubleduck.Assets.getImage(clickedLiquid.getFillFront());
		this._blenderLiquidFront.regX = this._blender.regX;
		this._blenderLiquidFront.regY = this._blender.regY;
		this._blenderLiquidFront.scaleX = this._blenderLiquidFront.scaleY = co.doubleduck.Game.getScale();
		this._blenderLiquidFront.x = this._blender.x;
		this._blenderLiquidFront.y = this._blender.y;
		this._blenderLiquidFront.alpha = 0.45;
		var addAt1 = Math.floor(this.getChildIndex(this._blendedFruitsLayer)) + 1;
		this.addChildAt(this._blenderLiquidFront,addAt1);
	}
	,setBlendedRecipe: function() {
		this._blendedLiquid = this._currentLiquid;
		this._blendedRecipe = this._currentRecipe.slice();
	}
	,clearBlender: function() {
		var _g1 = 0, _g = this._fruitBlenderSlots.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._fruitBlenderSlots[i] != null) this._blendedFruitsLayer.removeChild(this._fruitBlenderSlots[i]);
		}
		if(this._blenderLiquidBack != null) {
			this.removeChild(this._blenderLiquidBack);
			this._blenderLiquidBack = null;
		}
		if(this._blenderLiquidFront != null) {
			this.removeChild(this._blenderLiquidFront);
			this._blenderLiquidFront = null;
		}
		this._fruitBlenderSlots.splice(0,this._fruitBlenderSlots.length);
	}
	,endBlendClear: function() {
		if(this._blendDoneFrame != null) {
			this.removeChild(this._blendDoneFrame);
			this._blendDoneFrame = null;
		}
	}
	,finishBlend: function() {
		if(!this._isBlending) return;
		this.setBlendedRecipe();
		this.clearActiveRecipe();
		this._isBlending = false;
		this._blendAnim.gotoAndStop("done");
		this._blendAnim.visible = false;
		if(this._activeGlass != null) this._activeGlass.fillUp();
		this._blendDoneFrame = new createjs.Bitmap(createjs.SpriteSheetUtils.extractFrame(this._blendAnim.spriteSheet,this._blendAnim.currentFrame));
		this._blendDoneFrame.scaleX = this._blendDoneFrame.scaleY = co.doubleduck.Game.getScale();
		this._blendDoneFrame.regX = 0;
		this._blendDoneFrame.regY = 0;
		this._blendDoneFrame.x = this._blendAnim.x - this._blendDoneFrame.image.width * co.doubleduck.Game.getScale();
		this._blendDoneFrame.y = this._blendAnim.y;
		this.addChildAt(this._blendDoneFrame,this.getChildIndex(this._blendAnim));
		var maskWidth = this._blendDoneFrame.image.width * co.doubleduck.Game.getScale();
		var maskHeight = this._blendDoneFrame.image.height * co.doubleduck.Game.getScale();
		this._blenderMask = new createjs.Shape();
		this._blenderMask.graphics.beginFill("#000000");
		this._blenderMask.graphics.drawRect(this._blendDoneFrame.x,this._blendDoneFrame.y,maskWidth,maskHeight);
		this._blenderMask.graphics.endFill();
		this._blendDoneFrame.mask = this._blenderMask;
		createjs.Tween.get(this._blenderMask).to({ y : maskHeight},300).call($bind(this,this.endBlendClear));
	}
	,stopBlend: function() {
		this._isBlending = false;
		this._blendAnim.gotoAndStop("done");
		this._blendAnim.visible = false;
	}
	,startBlend: function() {
		if(this._activeGlass != null) this._activeGlass.clear();
		this._isBlending = true;
		this.clearBlender();
		this.clearOrder();
		this._blendAnim.visible = true;
		this._blendAnim.gotoAndPlay("blending");
		co.doubleduck.SoundManager.playEffect("sound/blender");
		co.doubleduck.Utils.waitAndCall(this,co.doubleduck.Session.BLEND_TIME,$bind(this,this.finishBlend));
	}
	,customerLeft: function(customer) {
		this._numActiveCustomers -= 1;
		var _g1 = 0, _g = this._customerSlots.length;
		while(_g1 < _g) {
			var currSlot = _g1++;
			if(this._customerSlots[currSlot] == customer) {
				this._customerSlots[currSlot] = null;
				break;
			}
		}
		if(this._activeGlass == null && this._numActiveCustomers > 0) this.createGlass();
	}
	,customerDestroyed: function(customer) {
		this._customerLayer.removeChild(customer);
	}
	,spawnTimer: function() {
		if(this._sessionEnded) return;
		if(this._numActiveCustomers < (this._levelData.maxCustomersAtOnce | 0)) this.spawnCustomer();
		var interval = this._levelData.timeBetweenCustomers * 1000 | 0;
		co.doubleduck.Utils.waitAndCall(this,interval,$bind(this,this.spawnTimer));
	}
	,positionBySlot: function(slotNum) {
		var result = 0;
		if(slotNum == 0) result = co.doubleduck.Game.getViewport().width / 6; else if(slotNum == 1) result = co.doubleduck.Game.getViewport().width / 2; else if(slotNum == 2) result = co.doubleduck.Game.getViewport().width * 5 / 6;
		return result;
	}
	,getVacantSlot: function() {
		var result = -1;
		if(this._customerSlots[1] == null) result = 1; else if(Math.random() > 0.5) {
			if(this._customerSlots[0] == null) result = 0; else if(this._customerSlots[2] == null) result = 2;
		} else if(this._customerSlots[2] == null) result = 2; else if(this._customerSlots[0] == null) result = 0;
		return result;
	}
	,spawnCustomer: function() {
		var customersData = new CustomerDB().getAllCustomers();
		var custID = customersData.length;
		custID = Std.random(custID);
		var customer = co.doubleduck.Customer.createCustomer(customersData[custID].id);
		var vacantSlot = this.getVacantSlot();
		this._customerSlots[vacantSlot] = customer;
		customer.y = this._booth.y - this._booth.image.height * co.doubleduck.Game.getScale();
		customer.onArrive = $bind(this,this.customerArrived);
		customer.onClick = $bind(this,this.customerClicked);
		customer.onLeave = $bind(this,this.customerLeft);
		customer.onDestroy = $bind(this,this.customerDestroyed);
		this._customerLayer.addChildAt(customer,0);
		this._numActiveCustomers += 1;
		customer.arrive(this.positionBySlot(vacantSlot));
	}
	,clickBlender: function() {
		if(this._sessionEnded || this._isPaused) return;
		var now = createjs.Ticker.getTime(true);
		if(this._currentRecipe.length > 0 && this._currentLiquid != null && !this._isBlending && now - this._lastBlenderClick > co.doubleduck.Session.MIN_CLICK_INTERVAL) {
			this._lastBlenderClick = now;
			this.startBlend();
		}
	}
	,clearActiveRecipe: function() {
		this._currentLiquid = null;
		this._currentRecipe.splice(0,this._currentRecipe.length);
	}
	,clearOrder: function() {
		this._blendedLiquid = null;
		this._blendedRecipe.splice(0,this._blendedRecipe.length);
	}
	,customerClicked: function(event) {
		if(this._sessionEnded || this._isPaused) return;
		var clickedCustomer = event.target;
		if(clickedCustomer.acceptRecipe(this._blendedRecipe,this._blendedLiquid)) {
			co.doubleduck.SoundManager.playEffect("sound/cash",0.1);
			var moneyGot = this._blendedRecipe.length * 10;
			moneyGot += clickedCustomer.getTip();
			this._hud.popupScore(moneyGot,clickedCustomer.x,clickedCustomer.y - clickedCustomer.getHeight());
			this._money += moneyGot;
			this._hud.setScore(this._money);
			this.clearOrder();
			this._glassLayer.removeChild(this._activeGlass);
			clickedCustomer.recieveGlass(this._activeGlass);
			this._activeGlass = null;
			clickedCustomer.leave(Math.floor(Math.random() * 2));
		}
	}
	,createGlass: function() {
		this._activeGlass = new co.doubleduck.Glass();
		this._activeGlass.y = this._booth.y - this._booth.image.height * 0.95 * co.doubleduck.Game.getScale();
		this._glassLayer.addChild(this._activeGlass);
		if(this._blendedRecipe.length > 0) this._activeGlass.fillUp();
	}
	,customerArrived: function(customer) {
		customer.makeOrder(this._fruitsOnBooth,this._liquidsOnBooth,this._levelData.customerWait,this._levelData.maxRecipeSize);
		if(this._activeGlass == null) this.createGlass();
	}
	,clickedTrash: function() {
		if(this._sessionEnded || this._isPaused) return;
		this.clearBlender();
		this.clearActiveRecipe();
		this.clearOrder();
		this.stopBlend();
		if(this._activeGlass != null) this._activeGlass.clear();
	}
	,constructLevel: function() {
		this._background = co.doubleduck.Assets.getImage("images/booth/background.png");
		this._background.regX = this._background.image.width / 2;
		this._background.regY = this._background.image.height / 2;
		this._background.scaleX = this._background.scaleY = co.doubleduck.Game.getScale();
		this._background.x = co.doubleduck.Game.getViewport().width / 2;
		this._background.y = co.doubleduck.Game.getViewport().height / 2;
		this.addChild(this._background);
		this._customerLayer = new createjs.Container();
		this.addChild(this._customerLayer);
		this._booth = co.doubleduck.Assets.getImage("images/booth/booth.png");
		this._booth.scaleX = this._booth.scaleY = co.doubleduck.Game.getScale();
		this._booth.regX = this._booth.image.width / 2;
		this._booth.regY = this._booth.image.height;
		this._booth.x = this._background.x;
		this._booth.y = this._background.y + this._background.image.height / 2 * co.doubleduck.Game.getScale();
		this.addChild(this._booth);
		this._glassLayer = new createjs.Container();
		this.addChild(this._glassLayer);
		this._blender = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/booth/blender.png"));
		this._blender.setNoSound();
		this._blender.regX = this._blender.image.width;
		this._blender.regY = 0;
		this._blender.scaleX = this._blender.scaleY = co.doubleduck.Game.getScale();
		this._blender.onClick = $bind(this,this.clickBlender);
		this._blender.y = this._booth.y - (this._booth.image.height + 20) * co.doubleduck.Game.getScale();
		this._blender.x = this._booth.x + this._booth.image.width * co.doubleduck.Game.getScale() / 2;
		this.addChild(this._blender);
		this._blendedFruitsLayer = new createjs.Container();
		this._blendedFruitsLayer.x = this._blender.x - this._blender.image.width * co.doubleduck.Game.getScale() * 0.5;
		this._blendedFruitsLayer.y = this._blender.y + this._blender.image.height * co.doubleduck.Game.getScale();
		this.addChild(this._blendedFruitsLayer);
		var initObject = { };
		var blendFrames = 3;
		var blendImg = co.doubleduck.Assets.getRawImage("images/booth/blender_twirl.png");
		initObject.images = [blendImg];
		initObject.frames = { width : blendImg.width / blendFrames, height : blendImg.height, regX : blendImg.width / blendFrames, regY : 0};
		initObject.animations = { };
		initObject.animations.blending = { frames : [0,1], frequency : 3};
		initObject.animations.done = { frames : blendFrames - 1, frequency : 20, next : false};
		this._blendAnim = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._blendAnim.scaleX = this._blendAnim.scaleY = co.doubleduck.Game.getScale();
		this._blendAnim.x = this._blender.x;
		this._blendAnim.y = this._blender.y;
		this._blendAnim.gotoAndStop("done");
		this._blendAnim.visible = false;
		this.addChild(this._blendAnim);
		var materialSpace = (this._booth.image.width - this._blender.image.width) * co.doubleduck.Game.getScale() / 3;
		var cols = new Array();
		var leftStart = this._booth.x - this._booth.image.width * co.doubleduck.Game.getScale() * 0.5;
		cols[0] = materialSpace / 2;
		cols[1] = cols[0] + materialSpace;
		cols[2] = cols[1] + materialSpace;
		this._liquidsOnBooth = new Array();
		var _g1 = 0, _g = this._levelData.liquids.length;
		while(_g1 < _g) {
			var currLiquidId = _g1++;
			var newLiquid = co.doubleduck.Liquid.createLiquid(co.doubleduck.DataLoader.getLiquidByName(this._levelData.liquids[currLiquidId]).id);
			newLiquid.regX = newLiquid.image.width / 2;
			newLiquid.regY = 0;
			newLiquid.scaleX = newLiquid.scaleY = co.doubleduck.Game.getScale();
			newLiquid.onClick = $bind(this,this.clickLiquid);
			this._liquidsOnBooth[this._liquidsOnBooth.length] = newLiquid;
			newLiquid.y = this._blender.y + 5 * co.doubleduck.Game.getScale();
			newLiquid.x = leftStart + cols[currLiquidId];
			this.addChild(newLiquid);
		}
		this._fruitsOnBooth = new Array();
		var fruitsTop = this._liquidsOnBooth[0].y + this._liquidsOnBooth[0].image.height * co.doubleduck.Game.getScale();
		var _g1 = 0, _g = this._levelData.fruits.length;
		while(_g1 < _g) {
			var currFruitId = _g1++;
			var newFruit = co.doubleduck.Fruit.createFruit(co.doubleduck.DataLoader.getFruitByName(this._levelData.fruits[currFruitId]).id);
			newFruit.regY = newFruit.image.height;
			newFruit.regX = newFruit.image.width / 2;
			newFruit.scaleX = newFruit.scaleY = co.doubleduck.Game.getScale();
			newFruit.onClick = $bind(this,this.clickFruit);
			this._fruitsOnBooth[this._fruitsOnBooth.length] = newFruit;
			this.addChild(newFruit);
			newFruit.x = leftStart + cols[currFruitId % 3];
			newFruit.y = fruitsTop;
			newFruit.y += (Math.floor(currFruitId / 3) + 1) * (this._fruitsOnBooth[0].image.height * co.doubleduck.Game.getScale());
		}
		var _g1 = this._levelData.fruits.length, _g = co.doubleduck.Session.MAX_CONTAINERS;
		while(_g1 < _g) {
			var currContainer = _g1++;
			var newContainer = co.doubleduck.Assets.getImage("images/booth/container.png");
			newContainer.regY = newContainer.image.height;
			newContainer.regX = newContainer.image.width / 2;
			newContainer.scaleX = newContainer.scaleY = co.doubleduck.Game.getScale();
			this.addChild(newContainer);
			newContainer.x = leftStart + cols[currContainer % 3];
			newContainer.y = fruitsTop;
			newContainer.y += (Math.floor(currContainer / 3) + 1) * (this._fruitsOnBooth[0].image.height * co.doubleduck.Game.getScale());
		}
		this._trashcan = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/booth/trashcan.png"));
		this._trashcan.setNoSound();
		this._trashcan.regX = this._trashcan.image.width;
		this._trashcan.regY = 0;
		this._trashcan.scaleX = this._trashcan.scaleY = co.doubleduck.Game.getScale();
		this._trashcan.x = co.doubleduck.Game.getViewport().width;
		this._trashcan.y = this._blender.y + (this._blender.image.height + 8) * co.doubleduck.Game.getScale();
		this._trashcan.onClick = $bind(this,this.clickedTrash);
		this.addChild(this._trashcan);
		this._hud = new co.doubleduck.HUD(this._starsScore);
		this._hud.setScore(0);
		this._hud.onPauseClick = $bind(this,this.handlePauseClick);
		this.addChild(this._hud);
		this._activeGlass = null;
	}
	,_hud: null
	,_starsScore: null
	,_remainingTime: null
	,_customerSlots: null
	,_numActiveCustomers: null
	,_lastBlenderClick: null
	,_isBlending: null
	,_sessionEnded: null
	,_pauseDuration: null
	,_isPaused: null
	,_blenderMask: null
	,_blendDoneFrame: null
	,_blendAnim: null
	,_blenderLiquidFront: null
	,_blenderLiquidBack: null
	,_activeGlass: null
	,_glassLayer: null
	,_customerLayer: null
	,_blendedFruitsLayer: null
	,_fruitBlenderSlots: null
	,_blender: null
	,_levelData: null
	,_blendedRecipe: null
	,_blendedLiquid: null
	,_currentLiquid: null
	,_currentRecipe: null
	,_liquidsOnBooth: null
	,_fruitsOnBooth: null
	,_trashcan: null
	,_booth: null
	,_background: null
	,_money: null
	,onNextLevel: null
	,onBackToMenu: null
	,onSessionEnd: null
	,onRestart: null
	,__class__: co.doubleduck.Session
});
co.doubleduck.SoundType = $hxClasses["co.doubleduck.SoundType"] = { __ename__ : ["co","doubleduck","SoundType"], __constructs__ : ["WEB_AUDIO","AUDIO_FX","AUDIO_NO_OVERLAP","NONE"] }
co.doubleduck.SoundType.WEB_AUDIO = ["WEB_AUDIO",0];
co.doubleduck.SoundType.WEB_AUDIO.toString = $estr;
co.doubleduck.SoundType.WEB_AUDIO.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_FX = ["AUDIO_FX",1];
co.doubleduck.SoundType.AUDIO_FX.toString = $estr;
co.doubleduck.SoundType.AUDIO_FX.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP = ["AUDIO_NO_OVERLAP",2];
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.toString = $estr;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.NONE = ["NONE",3];
co.doubleduck.SoundType.NONE.toString = $estr;
co.doubleduck.SoundType.NONE.__enum__ = co.doubleduck.SoundType;
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = $hxClasses["co.doubleduck.audio.AudioAPI"] = function() { }
co.doubleduck.audio.AudioAPI.__name__ = ["co","doubleduck","audio","AudioAPI"];
co.doubleduck.audio.AudioAPI.prototype = {
	setVolume: null
	,pause: null
	,stop: null
	,playMusic: null
	,playEffect: null
	,init: null
	,__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.WebAudioAPI = $hxClasses["co.doubleduck.audio.WebAudioAPI"] = function(src) {
	this._src = src;
	this.loadAudioFile(this._src);
};
co.doubleduck.audio.WebAudioAPI.__name__ = ["co","doubleduck","audio","WebAudioAPI"];
co.doubleduck.audio.WebAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.WebAudioAPI.context = null;
co.doubleduck.audio.WebAudioAPI.webAudioInit = function() {
	co.doubleduck.audio.WebAudioAPI.context = new webkitAudioContext();
}
co.doubleduck.audio.WebAudioAPI.saveBuffer = function(buffer,name) {
	co.doubleduck.audio.WebAudioAPI._buffers[name] = buffer;
}
co.doubleduck.audio.WebAudioAPI.decodeError = function() {
	null;
}
co.doubleduck.audio.WebAudioAPI.prototype = {
	setVolume: function(volume) {
		if(this._gainNode != null) this._gainNode.gain.value = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._source != null) this._source.noteOff(0);
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playBuffer: function(name,loop) {
		if(loop == null) loop = false;
		if(this._gainNode == null) {
			this._gainNode = co.doubleduck.audio.WebAudioAPI.context.createGainNode();
			this._gainNode.connect(co.doubleduck.audio.WebAudioAPI.context.destination);
		}
		this._buffer = Reflect.getProperty(co.doubleduck.audio.WebAudioAPI._buffers,this._src);
		if(this._buffer == null) return;
		this._source = co.doubleduck.audio.WebAudioAPI.context.createBufferSource();
		this._source.buffer = this._buffer;
		this._source.loop = loop;
		this._source.connect(this._gainNode);
		this._source.noteOn(0);
	}
	,loadAudioFile: function(src) {
		var request = new XMLHttpRequest();
		request.open("get",src,true);
		request.responseType = "arraybuffer";
		request.onload = function() { co.doubleduck.audio.WebAudioAPI.context.decodeAudioData(request.response, function(decodedBuffer) { buffer = decodedBuffer; co.doubleduck.audio.WebAudioAPI.saveBuffer(buffer,src); }, co.doubleduck.audio.WebAudioAPI.decodeError) }
		request.send();
	}
	,init: function() {
	}
	,_source: null
	,_gainNode: null
	,_buffer: null
	,_src: null
	,__class__: co.doubleduck.audio.WebAudioAPI
}
co.doubleduck.SoundManager = $hxClasses["co.doubleduck.SoundManager"] = function() {
};
co.doubleduck.SoundManager.__name__ = ["co","doubleduck","SoundManager"];
co.doubleduck.SoundManager.engineType = null;
co.doubleduck.SoundManager.EXTENSION = null;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.Persistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.Persistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Mobile/.test(navigator.userAgent);
	var isAndroid = /Android/.test(navigator.userAgent);
	var isAndroid4 = /Android 4/.test(navigator.userAgent);
	var isSafari = /Safari/.test(navigator.userAgent);
	var agent = navigator.userAgent;
	var reg = new EReg("iPhone OS 6","");
	var isIOS6 = reg.match(agent) && isSafari && isMobile;
	var isIpad = /iPad/.test(navigator.userAgent);
	isIpad = isIpad && /OS 6/.test(navigator.userAgent);
	isIOS6 = isIOS6 || isIpad;
	if(isFirefox) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_FX;
		co.doubleduck.SoundManager.EXTENSION = ".ogg";
		return true;
	}
	if(isChrome && (!isAndroid && !isMobile)) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	if(isIOS6) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	} else if(isAndroid4 && !isChrome) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_NO_OVERLAP;
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.NONE;
	return false;
}
co.doubleduck.SoundManager.mute = function() {
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
}
co.doubleduck.SoundManager.unmute = function() {
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(1);
	}
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
	co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.isMuted = function() {
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	src += co.doubleduck.SoundManager.EXTENSION;
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		switch( (co.doubleduck.SoundManager.engineType)[1] ) {
		case 1:
			audio = new co.doubleduck.audio.AudioFX(src);
			break;
		case 0:
			audio = new co.doubleduck.audio.WebAudioAPI(src);
			break;
		case 2:
			audio = new co.doubleduck.audio.NonOverlappingAudio(src);
			break;
		case 3:
			return new co.doubleduck.audio.DummyAudioAPI();
		}
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume,optional) {
	if(optional == null) optional = false;
	if(volume == null) volume = 1;
	if(optional && co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.initSound = function(src) {
	co.doubleduck.SoundManager.getAudioInstance(src);
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.Utils = $hxClasses["co.doubleduck.Utils"] = function() {
};
co.doubleduck.Utils.__name__ = ["co","doubleduck","Utils"];
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.prototype = {
	__class__: co.doubleduck.Utils
}
co.doubleduck.audio.AudioFX = $hxClasses["co.doubleduck.audio.AudioFX"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = ["co","doubleduck","audio","AudioFX"];
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX._currentlyPlaying = null;
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		this._jsAudio = AudioFX(pathNoExtension, { loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = $hxClasses["co.doubleduck.audio.DummyAudioAPI"] = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = ["co","doubleduck","audio","DummyAudioAPI"];
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.NonOverlappingAudio = $hxClasses["co.doubleduck.audio.NonOverlappingAudio"] = function(src) {
	this._src = src;
	this.load();
	this._isMusic = false;
};
co.doubleduck.audio.NonOverlappingAudio.__name__ = ["co","doubleduck","audio","NonOverlappingAudio"];
co.doubleduck.audio.NonOverlappingAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = null;
co.doubleduck.audio.NonOverlappingAudio.prototype = {
	getSrc: function() {
		return this._src;
	}
	,audio: function() {
		return this._audio;
	}
	,setVolume: function(volume) {
		if(this._audio != null) this._audio.volume = volume;
	}
	,pause: function() {
		if(this._audio != null) this._audio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._isMusic) co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
		if(this._audio != null) {
			this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
			this._audio.currentTime = 0;
			this._audio.pause();
		}
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._isMusic = true;
		co.doubleduck.audio.NonOverlappingAudio._musicPlaying = true;
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
	}
	,handleEnded: function() {
		this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
		this._audio.currentTime = 0;
	}
	,handleTimeUpdate: function() {
		if(this._audio.currentTime >= this._audio.duration - 0.3) this.stop();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._musicPlaying) return;
		if(overrideOtherEffects && co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
		co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = this;
	}
	,handleError: function() {
	}
	,handleCanPlay: function() {
	}
	,load: function() {
		this._audio = new Audio();
		this._audio.src = this._src;
		this._audio.initialTime = 0;
		this._audio.addEventListener("canplaythrough",$bind(this,this.handleCanPlay));
		this._audio.addEventListener("onerror",$bind(this,this.handleError));
	}
	,init: function() {
	}
	,_isMusic: null
	,_audio: null
	,_src: null
	,__class__: co.doubleduck.audio.NonOverlappingAudio
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.unit) haxe.unit = {}
haxe.unit.TestCase = $hxClasses["haxe.unit.TestCase"] = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.__interfaces__ = [haxe.Public];
haxe.unit.TestCase.prototype = {
	assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,tearDown: function() {
	}
	,setup: function() {
	}
	,currentTest: null
	,__class__: haxe.unit.TestCase
}
haxe.unit.TestResult = $hxClasses["haxe.unit.TestResult"] = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += Std.string("* ");
				buf.b += Std.string(test.classname);
				buf.b += Std.string("::");
				buf.b += Std.string(test.method);
				buf.b += Std.string("()");
				buf.b += Std.string("\n");
				buf.b += Std.string("ERR: ");
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += Std.string(":");
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += Std.string("(");
					buf.b += Std.string(test.posInfos.className);
					buf.b += Std.string(".");
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += Std.string(") - ");
				}
				buf.b += Std.string(test.error);
				buf.b += Std.string("\n");
				if(test.backtrace != null) {
					buf.b += Std.string(test.backtrace);
					buf.b += Std.string("\n");
				}
				buf.b += Std.string("\n");
				failures++;
			}
		}
		buf.b += Std.string("\n");
		if(failures == 0) buf.b += Std.string("OK "); else buf.b += Std.string("FAILED ");
		buf.b += Std.string(this.m_tests.length);
		buf.b += Std.string(" tests, ");
		buf.b += Std.string(failures);
		buf.b += Std.string(" failed, ");
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += Std.string(" success");
		buf.b += Std.string("\n");
		return buf.b;
	}
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,success: null
	,m_tests: null
	,__class__: haxe.unit.TestResult
}
haxe.unit.TestRunner = $hxClasses["haxe.unit.TestRunner"] = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = StringTools.htmlEscape(js.Boot.__string_rec(v,"")).split("\n").join("<br/>");
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("haxe:trace element not found"); else d.innerHTML += msg;
}
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
}
haxe.unit.TestRunner.prototype = {
	runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					field.apply(t,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					} else {
					var e = $e0;
					haxe.unit.TestRunner.print("E");
					if(e.message != null) t.currentTest.error = "exception thrown : " + Std.string(e) + " [" + Std.string(e.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e);
					t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,add: function(c) {
		this.cases.add(c);
	}
	,cases: null
	,result: null
	,__class__: haxe.unit.TestRunner
}
haxe.unit.TestStatus = $hxClasses["haxe.unit.TestStatus"] = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	backtrace: null
	,posInfos: null
	,classname: null
	,method: null
	,error: null
	,success: null
	,done: null
	,__class__: haxe.unit.TestStatus
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.Assets.onLoadAll = null;
co.doubleduck.Assets._loader = null;
co.doubleduck.Assets._cacheData = { };
co.doubleduck.Assets._loadCallbacks = { };
co.doubleduck.Assets.loaded = 0;
co.doubleduck.Assets._useLocalStorage = false;
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.Customer.DIRECTION_LEFT = 0;
co.doubleduck.Customer.DIRECTION_RIGHT = 1;
co.doubleduck.Customer.CUSTOMER_VIEW_LINE = 0.8;
co.doubleduck.Customer.PISSED_1 = 0.4;
co.doubleduck.Customer.PISSED_2 = 0.6;
co.doubleduck.Customer.PISSED_3 = 0.8;
co.doubleduck.Customer.ARRIVE_SPEED = 0.5;
co.doubleduck.Customer.LEAVE_SPEED_SATISFIED = 0.3;
co.doubleduck.Customer.LEAVE_SPEED_ANGRY = 0.7;
co.doubleduck.Fruit.FRUIT_BANANA = 1;
co.doubleduck.Fruit.FRUIT_KIWI = 2;
co.doubleduck.Fruit.FRUIT_APPLE = 3;
co.doubleduck.Fruit.FRUIT_MANGO = 4;
co.doubleduck.Fruit.FRUIT_WATERMELON = 5;
co.doubleduck.Fruit.FRUIT_COCONUT = 6;
co.doubleduck.Game._viewport = null;
co.doubleduck.Game._scale = 1;
co.doubleduck.Game.MAX_HEIGHT = 641;
co.doubleduck.Game.MAX_WIDTH = 427;
co.doubleduck.Game.DEBUG = false;
co.doubleduck.Game.HD = false;
co.doubleduck.Liquid.LIQUID_MILK = 1;
co.doubleduck.Liquid.LIQUID_JUICE = 2;
co.doubleduck.Liquid.LIQUID_WATER = 3;
co.doubleduck.Persistence.GAME_PREFIX = "SHI";
co.doubleduck.Persistence.available = co.doubleduck.Persistence.localStorageSupported();
co.doubleduck.Session.BLEND_TIME = 200;
co.doubleduck.Session.MAX_RECIPE_SIZE = 4;
co.doubleduck.Session.MAX_CONTAINERS = 6;
co.doubleduck.Session.MIN_CLICK_INTERVAL = 200;
co.doubleduck.audio.WebAudioAPI._buffers = { };
co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
js.Lib.onerror = null;
co.doubleduck.Main.main();
