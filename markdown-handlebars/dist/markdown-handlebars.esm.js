var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var handlebars = {exports: {}};

/**!

 @license
 handlebars v4.7.8

Copyright (C) 2011-2019 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

(function (module, exports) {
	(function webpackUniversalModuleDefinition(root, factory) {
		module.exports = factory();
	})(commonjsGlobal, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _handlebarsRuntime = __webpack_require__(2);

		var _handlebarsRuntime2 = _interopRequireDefault(_handlebarsRuntime);

		// Compiler imports

		var _handlebarsCompilerAst = __webpack_require__(84);

		var _handlebarsCompilerAst2 = _interopRequireDefault(_handlebarsCompilerAst);

		var _handlebarsCompilerBase = __webpack_require__(85);

		var _handlebarsCompilerCompiler = __webpack_require__(90);

		var _handlebarsCompilerJavascriptCompiler = __webpack_require__(91);

		var _handlebarsCompilerJavascriptCompiler2 = _interopRequireDefault(_handlebarsCompilerJavascriptCompiler);

		var _handlebarsCompilerVisitor = __webpack_require__(88);

		var _handlebarsCompilerVisitor2 = _interopRequireDefault(_handlebarsCompilerVisitor);

		var _handlebarsNoConflict = __webpack_require__(83);

		var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

		var _create = _handlebarsRuntime2['default'].create;
		function create() {
		  var hb = _create();

		  hb.compile = function (input, options) {
		    return _handlebarsCompilerCompiler.compile(input, options, hb);
		  };
		  hb.precompile = function (input, options) {
		    return _handlebarsCompilerCompiler.precompile(input, options, hb);
		  };

		  hb.AST = _handlebarsCompilerAst2['default'];
		  hb.Compiler = _handlebarsCompilerCompiler.Compiler;
		  hb.JavaScriptCompiler = _handlebarsCompilerJavascriptCompiler2['default'];
		  hb.Parser = _handlebarsCompilerBase.parser;
		  hb.parse = _handlebarsCompilerBase.parse;
		  hb.parseWithoutProcessing = _handlebarsCompilerBase.parseWithoutProcessing;

		  return hb;
		}

		var inst = create();
		inst.create = create;

		_handlebarsNoConflict2['default'](inst);

		inst.Visitor = _handlebarsCompilerVisitor2['default'];

		inst['default'] = inst;

		exports['default'] = inst;
		module.exports = exports['default'];

	/***/ }),
	/* 1 */
	/***/ (function(module, exports) {

		exports["default"] = function (obj) {
		  return obj && obj.__esModule ? obj : {
		    "default": obj
		  };
		};

		exports.__esModule = true;

	/***/ }),
	/* 2 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireWildcard = __webpack_require__(3)['default'];

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _handlebarsBase = __webpack_require__(4);

		var base = _interopRequireWildcard(_handlebarsBase);

		// Each of these augment the Handlebars object. No need to setup here.
		// (This is done to easily share code between commonjs and browse envs)

		var _handlebarsSafeString = __webpack_require__(77);

		var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

		var _handlebarsException = __webpack_require__(6);

		var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

		var _handlebarsUtils = __webpack_require__(5);

		var Utils = _interopRequireWildcard(_handlebarsUtils);

		var _handlebarsRuntime = __webpack_require__(78);

		var runtime = _interopRequireWildcard(_handlebarsRuntime);

		var _handlebarsNoConflict = __webpack_require__(83);

		var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

		// For compatibility and usage outside of module systems, make the Handlebars object a namespace
		function create() {
		  var hb = new base.HandlebarsEnvironment();

		  Utils.extend(hb, base);
		  hb.SafeString = _handlebarsSafeString2['default'];
		  hb.Exception = _handlebarsException2['default'];
		  hb.Utils = Utils;
		  hb.escapeExpression = Utils.escapeExpression;

		  hb.VM = runtime;
		  hb.template = function (spec) {
		    return runtime.template(spec, hb);
		  };

		  return hb;
		}

		var inst = create();
		inst.create = create;

		_handlebarsNoConflict2['default'](inst);

		inst['default'] = inst;

		exports['default'] = inst;
		module.exports = exports['default'];

	/***/ }),
	/* 3 */
	/***/ (function(module, exports) {

		exports["default"] = function (obj) {
		  if (obj && obj.__esModule) {
		    return obj;
		  } else {
		    var newObj = {};

		    if (obj != null) {
		      for (var key in obj) {
		        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
		      }
		    }

		    newObj["default"] = obj;
		    return newObj;
		  }
		};

		exports.__esModule = true;

	/***/ }),
	/* 4 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;
		exports.HandlebarsEnvironment = HandlebarsEnvironment;

		var _utils = __webpack_require__(5);

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		var _helpers = __webpack_require__(10);

		var _decorators = __webpack_require__(70);

		var _logger = __webpack_require__(72);

		var _logger2 = _interopRequireDefault(_logger);

		var _internalProtoAccess = __webpack_require__(73);

		var VERSION = '4.7.8';
		exports.VERSION = VERSION;
		var COMPILER_REVISION = 8;
		exports.COMPILER_REVISION = COMPILER_REVISION;
		var LAST_COMPATIBLE_COMPILER_REVISION = 7;

		exports.LAST_COMPATIBLE_COMPILER_REVISION = LAST_COMPATIBLE_COMPILER_REVISION;
		var REVISION_CHANGES = {
		  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
		  2: '== 1.0.0-rc.3',
		  3: '== 1.0.0-rc.4',
		  4: '== 1.x.x',
		  5: '== 2.0.0-alpha.x',
		  6: '>= 2.0.0-beta.1',
		  7: '>= 4.0.0 <4.3.0',
		  8: '>= 4.3.0'
		};

		exports.REVISION_CHANGES = REVISION_CHANGES;
		var objectType = '[object Object]';

		function HandlebarsEnvironment(helpers, partials, decorators) {
		  this.helpers = helpers || {};
		  this.partials = partials || {};
		  this.decorators = decorators || {};

		  _helpers.registerDefaultHelpers(this);
		  _decorators.registerDefaultDecorators(this);
		}

		HandlebarsEnvironment.prototype = {
		  constructor: HandlebarsEnvironment,

		  logger: _logger2['default'],
		  log: _logger2['default'].log,

		  registerHelper: function registerHelper(name, fn) {
		    if (_utils.toString.call(name) === objectType) {
		      if (fn) {
		        throw new _exception2['default']('Arg not supported with multiple helpers');
		      }
		      _utils.extend(this.helpers, name);
		    } else {
		      this.helpers[name] = fn;
		    }
		  },
		  unregisterHelper: function unregisterHelper(name) {
		    delete this.helpers[name];
		  },

		  registerPartial: function registerPartial(name, partial) {
		    if (_utils.toString.call(name) === objectType) {
		      _utils.extend(this.partials, name);
		    } else {
		      if (typeof partial === 'undefined') {
		        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
		      }
		      this.partials[name] = partial;
		    }
		  },
		  unregisterPartial: function unregisterPartial(name) {
		    delete this.partials[name];
		  },

		  registerDecorator: function registerDecorator(name, fn) {
		    if (_utils.toString.call(name) === objectType) {
		      if (fn) {
		        throw new _exception2['default']('Arg not supported with multiple decorators');
		      }
		      _utils.extend(this.decorators, name);
		    } else {
		      this.decorators[name] = fn;
		    }
		  },
		  unregisterDecorator: function unregisterDecorator(name) {
		    delete this.decorators[name];
		  },
		  /**
		   * Reset the memory of illegal property accesses that have already been logged.
		   * @deprecated should only be used in handlebars test-cases
		   */
		  resetLoggedPropertyAccesses: function resetLoggedPropertyAccesses() {
		    _internalProtoAccess.resetLoggedProperties();
		  }
		};

		var log = _logger2['default'].log;

		exports.log = log;
		exports.createFrame = _utils.createFrame;
		exports.logger = _logger2['default'];

	/***/ }),
	/* 5 */
	/***/ (function(module, exports) {

		exports.__esModule = true;
		exports.extend = extend;
		exports.indexOf = indexOf;
		exports.escapeExpression = escapeExpression;
		exports.isEmpty = isEmpty;
		exports.createFrame = createFrame;
		exports.blockParams = blockParams;
		exports.appendContextPath = appendContextPath;
		var escape = {
		  '&': '&amp;',
		  '<': '&lt;',
		  '>': '&gt;',
		  '"': '&quot;',
		  "'": '&#x27;',
		  '`': '&#x60;',
		  '=': '&#x3D;'
		};

		var badChars = /[&<>"'`=]/g,
		    possible = /[&<>"'`=]/;

		function escapeChar(chr) {
		  return escape[chr];
		}

		function extend(obj /* , ...source */) {
		  for (var i = 1; i < arguments.length; i++) {
		    for (var key in arguments[i]) {
		      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
		        obj[key] = arguments[i][key];
		      }
		    }
		  }

		  return obj;
		}

		var toString = Object.prototype.toString;

		exports.toString = toString;
		// Sourced from lodash
		// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
		/* eslint-disable func-style */
		var isFunction = function isFunction(value) {
		  return typeof value === 'function';
		};
		// fallback for older versions of Chrome and Safari
		/* istanbul ignore next */
		if (isFunction(/x/)) {
		  exports.isFunction = isFunction = function (value) {
		    return typeof value === 'function' && toString.call(value) === '[object Function]';
		  };
		}
		exports.isFunction = isFunction;

		/* eslint-enable func-style */

		/* istanbul ignore next */
		var isArray = Array.isArray || function (value) {
		  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
		};

		exports.isArray = isArray;
		// Older IE versions do not directly support indexOf so we must implement our own, sadly.

		function indexOf(array, value) {
		  for (var i = 0, len = array.length; i < len; i++) {
		    if (array[i] === value) {
		      return i;
		    }
		  }
		  return -1;
		}

		function escapeExpression(string) {
		  if (typeof string !== 'string') {
		    // don't escape SafeStrings, since they're already safe
		    if (string && string.toHTML) {
		      return string.toHTML();
		    } else if (string == null) {
		      return '';
		    } else if (!string) {
		      return string + '';
		    }

		    // Force a string conversion as this will be done by the append regardless and
		    // the regex test will do this transparently behind the scenes, causing issues if
		    // an object's to string has escaped characters in it.
		    string = '' + string;
		  }

		  if (!possible.test(string)) {
		    return string;
		  }
		  return string.replace(badChars, escapeChar);
		}

		function isEmpty(value) {
		  if (!value && value !== 0) {
		    return true;
		  } else if (isArray(value) && value.length === 0) {
		    return true;
		  } else {
		    return false;
		  }
		}

		function createFrame(object) {
		  var frame = extend({}, object);
		  frame._parent = object;
		  return frame;
		}

		function blockParams(params, ids) {
		  params.path = ids;
		  return params;
		}

		function appendContextPath(contextPath, id) {
		  return (contextPath ? contextPath + '.' : '') + id;
		}

	/***/ }),
	/* 6 */
	/***/ (function(module, exports, __webpack_require__) {

		var _Object$defineProperty = __webpack_require__(7)['default'];

		exports.__esModule = true;
		var errorProps = ['description', 'fileName', 'lineNumber', 'endLineNumber', 'message', 'name', 'number', 'stack'];

		function Exception(message, node) {
		  var loc = node && node.loc,
		      line = undefined,
		      endLineNumber = undefined,
		      column = undefined,
		      endColumn = undefined;

		  if (loc) {
		    line = loc.start.line;
		    endLineNumber = loc.end.line;
		    column = loc.start.column;
		    endColumn = loc.end.column;

		    message += ' - ' + line + ':' + column;
		  }

		  var tmp = Error.prototype.constructor.call(this, message);

		  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
		  for (var idx = 0; idx < errorProps.length; idx++) {
		    this[errorProps[idx]] = tmp[errorProps[idx]];
		  }

		  /* istanbul ignore else */
		  if (Error.captureStackTrace) {
		    Error.captureStackTrace(this, Exception);
		  }

		  try {
		    if (loc) {
		      this.lineNumber = line;
		      this.endLineNumber = endLineNumber;

		      // Work around issue under safari where we can't directly set the column value
		      /* istanbul ignore next */
		      if (_Object$defineProperty) {
		        Object.defineProperty(this, 'column', {
		          value: column,
		          enumerable: true
		        });
		        Object.defineProperty(this, 'endColumn', {
		          value: endColumn,
		          enumerable: true
		        });
		      } else {
		        this.column = column;
		        this.endColumn = endColumn;
		      }
		    }
		  } catch (nop) {
		    /* Ignore if the browser is very particular */
		  }
		}

		Exception.prototype = new Error();

		exports['default'] = Exception;
		module.exports = exports['default'];

	/***/ }),
	/* 7 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = { "default": __webpack_require__(8), __esModule: true };

	/***/ }),
	/* 8 */
	/***/ (function(module, exports, __webpack_require__) {

		var $ = __webpack_require__(9);
		module.exports = function defineProperty(it, key, desc){
		  return $.setDesc(it, key, desc);
		};

	/***/ }),
	/* 9 */
	/***/ (function(module, exports) {

		var $Object = Object;
		module.exports = {
		  create:     $Object.create,
		  getProto:   $Object.getPrototypeOf,
		  isEnum:     {}.propertyIsEnumerable,
		  getDesc:    $Object.getOwnPropertyDescriptor,
		  setDesc:    $Object.defineProperty,
		  setDescs:   $Object.defineProperties,
		  getKeys:    $Object.keys,
		  getNames:   $Object.getOwnPropertyNames,
		  getSymbols: $Object.getOwnPropertySymbols,
		  each:       [].forEach
		};

	/***/ }),
	/* 10 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;
		exports.registerDefaultHelpers = registerDefaultHelpers;
		exports.moveHelperToHooks = moveHelperToHooks;

		var _helpersBlockHelperMissing = __webpack_require__(11);

		var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

		var _helpersEach = __webpack_require__(12);

		var _helpersEach2 = _interopRequireDefault(_helpersEach);

		var _helpersHelperMissing = __webpack_require__(65);

		var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

		var _helpersIf = __webpack_require__(66);

		var _helpersIf2 = _interopRequireDefault(_helpersIf);

		var _helpersLog = __webpack_require__(67);

		var _helpersLog2 = _interopRequireDefault(_helpersLog);

		var _helpersLookup = __webpack_require__(68);

		var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

		var _helpersWith = __webpack_require__(69);

		var _helpersWith2 = _interopRequireDefault(_helpersWith);

		function registerDefaultHelpers(instance) {
		  _helpersBlockHelperMissing2['default'](instance);
		  _helpersEach2['default'](instance);
		  _helpersHelperMissing2['default'](instance);
		  _helpersIf2['default'](instance);
		  _helpersLog2['default'](instance);
		  _helpersLookup2['default'](instance);
		  _helpersWith2['default'](instance);
		}

		function moveHelperToHooks(instance, helperName, keepHelper) {
		  if (instance.helpers[helperName]) {
		    instance.hooks[helperName] = instance.helpers[helperName];
		    if (!keepHelper) {
		      delete instance.helpers[helperName];
		    }
		  }
		}

	/***/ }),
	/* 11 */
	/***/ (function(module, exports, __webpack_require__) {

		exports.__esModule = true;

		var _utils = __webpack_require__(5);

		exports['default'] = function (instance) {
		  instance.registerHelper('blockHelperMissing', function (context, options) {
		    var inverse = options.inverse,
		        fn = options.fn;

		    if (context === true) {
		      return fn(this);
		    } else if (context === false || context == null) {
		      return inverse(this);
		    } else if (_utils.isArray(context)) {
		      if (context.length > 0) {
		        if (options.ids) {
		          options.ids = [options.name];
		        }

		        return instance.helpers.each(context, options);
		      } else {
		        return inverse(this);
		      }
		    } else {
		      if (options.data && options.ids) {
		        var data = _utils.createFrame(options.data);
		        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
		        options = { data: data };
		      }

		      return fn(context, options);
		    }
		  });
		};

		module.exports = exports['default'];

	/***/ }),
	/* 12 */
	/***/ (function(module, exports, __webpack_require__) {

		var _Symbol = __webpack_require__(13)['default'];

		var _Symbol$iterator = __webpack_require__(43)['default'];

		var _getIterator = __webpack_require__(55)['default'];

		var _Object$keys = __webpack_require__(60)['default'];

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _utils = __webpack_require__(5);

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		exports['default'] = function (instance) {
		  instance.registerHelper('each', function (context, options) {
		    if (!options) {
		      throw new _exception2['default']('Must pass iterator to #each');
		    }

		    var fn = options.fn,
		        inverse = options.inverse,
		        i = 0,
		        ret = '',
		        data = undefined,
		        contextPath = undefined;

		    if (options.data && options.ids) {
		      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
		    }

		    if (_utils.isFunction(context)) {
		      context = context.call(this);
		    }

		    if (options.data) {
		      data = _utils.createFrame(options.data);
		    }

		    function execIteration(field, index, last) {
		      if (data) {
		        data.key = field;
		        data.index = index;
		        data.first = index === 0;
		        data.last = !!last;

		        if (contextPath) {
		          data.contextPath = contextPath + field;
		        }
		      }

		      ret = ret + fn(context[field], {
		        data: data,
		        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
		      });
		    }

		    if (context && typeof context === 'object') {
		      if (_utils.isArray(context)) {
		        for (var j = context.length; i < j; i++) {
		          if (i in context) {
		            execIteration(i, i, i === context.length - 1);
		          }
		        }
		      } else if (typeof _Symbol === 'function' && context[_Symbol$iterator]) {
		        var newContext = [];
		        var iterator = _getIterator(context);
		        for (var it = iterator.next(); !it.done; it = iterator.next()) {
		          newContext.push(it.value);
		        }
		        context = newContext;
		        for (var j = context.length; i < j; i++) {
		          execIteration(i, i, i === context.length - 1);
		        }
		      } else {
		        (function () {
		          var priorKey = undefined;

		          _Object$keys(context).forEach(function (key) {
		            // We're running the iterations one step out of sync so we can detect
		            // the last iteration without have to scan the object twice and create
		            // an itermediate keys array.
		            if (priorKey !== undefined) {
		              execIteration(priorKey, i - 1);
		            }
		            priorKey = key;
		            i++;
		          });
		          if (priorKey !== undefined) {
		            execIteration(priorKey, i - 1, true);
		          }
		        })();
		      }
		    }

		    if (i === 0) {
		      ret = inverse(this);
		    }

		    return ret;
		  });
		};

		module.exports = exports['default'];

	/***/ }),
	/* 13 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = { "default": __webpack_require__(14), __esModule: true };

	/***/ }),
	/* 14 */
	/***/ (function(module, exports, __webpack_require__) {

		__webpack_require__(15);
		__webpack_require__(42);
		module.exports = __webpack_require__(21).Symbol;

	/***/ }),
	/* 15 */
	/***/ (function(module, exports, __webpack_require__) {
		// ECMAScript 6 symbols shim
		var $              = __webpack_require__(9)
		  , global         = __webpack_require__(16)
		  , has            = __webpack_require__(17)
		  , DESCRIPTORS    = __webpack_require__(18)
		  , $export        = __webpack_require__(20)
		  , redefine       = __webpack_require__(24)
		  , $fails         = __webpack_require__(19)
		  , shared         = __webpack_require__(27)
		  , setToStringTag = __webpack_require__(28)
		  , uid            = __webpack_require__(30)
		  , wks            = __webpack_require__(29)
		  , keyOf          = __webpack_require__(31)
		  , $names         = __webpack_require__(36)
		  , enumKeys       = __webpack_require__(37)
		  , isArray        = __webpack_require__(38)
		  , anObject       = __webpack_require__(39)
		  , toIObject      = __webpack_require__(32)
		  , createDesc     = __webpack_require__(26)
		  , getDesc        = $.getDesc
		  , setDesc        = $.setDesc
		  , _create        = $.create
		  , getNames       = $names.get
		  , $Symbol        = global.Symbol
		  , $JSON          = global.JSON
		  , _stringify     = $JSON && $JSON.stringify
		  , setter         = false
		  , HIDDEN         = wks('_hidden')
		  , isEnum         = $.isEnum
		  , SymbolRegistry = shared('symbol-registry')
		  , AllSymbols     = shared('symbols')
		  , useNative      = typeof $Symbol == 'function'
		  , ObjectProto    = Object.prototype;

		// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
		var setSymbolDesc = DESCRIPTORS && $fails(function(){
		  return _create(setDesc({}, 'a', {
		    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
		  })).a != 7;
		}) ? function(it, key, D){
		  var protoDesc = getDesc(ObjectProto, key);
		  if(protoDesc)delete ObjectProto[key];
		  setDesc(it, key, D);
		  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
		} : setDesc;

		var wrap = function(tag){
		  var sym = AllSymbols[tag] = _create($Symbol.prototype);
		  sym._k = tag;
		  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
		    configurable: true,
		    set: function(value){
		      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
		      setSymbolDesc(this, tag, createDesc(1, value));
		    }
		  });
		  return sym;
		};

		var isSymbol = function(it){
		  return typeof it == 'symbol';
		};

		var $defineProperty = function defineProperty(it, key, D){
		  if(D && has(AllSymbols, key)){
		    if(!D.enumerable){
		      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
		      it[HIDDEN][key] = true;
		    } else {
		      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
		      D = _create(D, {enumerable: createDesc(0, false)});
		    } return setSymbolDesc(it, key, D);
		  } return setDesc(it, key, D);
		};
		var $defineProperties = function defineProperties(it, P){
		  anObject(it);
		  var keys = enumKeys(P = toIObject(P))
		    , i    = 0
		    , l = keys.length
		    , key;
		  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
		  return it;
		};
		var $create = function create(it, P){
		  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
		};
		var $propertyIsEnumerable = function propertyIsEnumerable(key){
		  var E = isEnum.call(this, key);
		  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
		    ? E : true;
		};
		var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
		  var D = getDesc(it = toIObject(it), key);
		  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
		  return D;
		};
		var $getOwnPropertyNames = function getOwnPropertyNames(it){
		  var names  = getNames(toIObject(it))
		    , result = []
		    , i      = 0
		    , key;
		  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
		  return result;
		};
		var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
		  var names  = getNames(toIObject(it))
		    , result = []
		    , i      = 0
		    , key;
		  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
		  return result;
		};
		var $stringify = function stringify(it){
		  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
		  var args = [it]
		    , i    = 1
		    , $$   = arguments
		    , replacer, $replacer;
		  while($$.length > i)args.push($$[i++]);
		  replacer = args[1];
		  if(typeof replacer == 'function')$replacer = replacer;
		  if($replacer || !isArray(replacer))replacer = function(key, value){
		    if($replacer)value = $replacer.call(this, key, value);
		    if(!isSymbol(value))return value;
		  };
		  args[1] = replacer;
		  return _stringify.apply($JSON, args);
		};
		var buggyJSON = $fails(function(){
		  var S = $Symbol();
		  // MS Edge converts symbol values to JSON as {}
		  // WebKit converts symbol values to JSON as null
		  // V8 throws on boxed symbols
		  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
		});

		// 19.4.1.1 Symbol([description])
		if(!useNative){
		  $Symbol = function Symbol(){
		    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
		    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
		  };
		  redefine($Symbol.prototype, 'toString', function toString(){
		    return this._k;
		  });

		  isSymbol = function(it){
		    return it instanceof $Symbol;
		  };

		  $.create     = $create;
		  $.isEnum     = $propertyIsEnumerable;
		  $.getDesc    = $getOwnPropertyDescriptor;
		  $.setDesc    = $defineProperty;
		  $.setDescs   = $defineProperties;
		  $.getNames   = $names.get = $getOwnPropertyNames;
		  $.getSymbols = $getOwnPropertySymbols;

		  if(DESCRIPTORS && !__webpack_require__(41)){
		    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
		  }
		}

		var symbolStatics = {
		  // 19.4.2.1 Symbol.for(key)
		  'for': function(key){
		    return has(SymbolRegistry, key += '')
		      ? SymbolRegistry[key]
		      : SymbolRegistry[key] = $Symbol(key);
		  },
		  // 19.4.2.5 Symbol.keyFor(sym)
		  keyFor: function keyFor(key){
		    return keyOf(SymbolRegistry, key);
		  },
		  useSetter: function(){ setter = true; },
		  useSimple: function(){ setter = false; }
		};
		// 19.4.2.2 Symbol.hasInstance
		// 19.4.2.3 Symbol.isConcatSpreadable
		// 19.4.2.4 Symbol.iterator
		// 19.4.2.6 Symbol.match
		// 19.4.2.8 Symbol.replace
		// 19.4.2.9 Symbol.search
		// 19.4.2.10 Symbol.species
		// 19.4.2.11 Symbol.split
		// 19.4.2.12 Symbol.toPrimitive
		// 19.4.2.13 Symbol.toStringTag
		// 19.4.2.14 Symbol.unscopables
		$.each.call((
		  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
		  'species,split,toPrimitive,toStringTag,unscopables'
		).split(','), function(it){
		  var sym = wks(it);
		  symbolStatics[it] = useNative ? sym : wrap(sym);
		});

		setter = true;

		$export($export.G + $export.W, {Symbol: $Symbol});

		$export($export.S, 'Symbol', symbolStatics);

		$export($export.S + $export.F * !useNative, 'Object', {
		  // 19.1.2.2 Object.create(O [, Properties])
		  create: $create,
		  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
		  defineProperty: $defineProperty,
		  // 19.1.2.3 Object.defineProperties(O, Properties)
		  defineProperties: $defineProperties,
		  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
		  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
		  // 19.1.2.7 Object.getOwnPropertyNames(O)
		  getOwnPropertyNames: $getOwnPropertyNames,
		  // 19.1.2.8 Object.getOwnPropertySymbols(O)
		  getOwnPropertySymbols: $getOwnPropertySymbols
		});

		// 24.3.2 JSON.stringify(value [, replacer [, space]])
		$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

		// 19.4.3.5 Symbol.prototype[@@toStringTag]
		setToStringTag($Symbol, 'Symbol');
		// 20.2.1.9 Math[@@toStringTag]
		setToStringTag(Math, 'Math', true);
		// 24.3.3 JSON[@@toStringTag]
		setToStringTag(global.JSON, 'JSON', true);

	/***/ }),
	/* 16 */
	/***/ (function(module, exports) {

		// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
		var global = module.exports = typeof window != 'undefined' && window.Math == Math
		  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
		if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

	/***/ }),
	/* 17 */
	/***/ (function(module, exports) {

		var hasOwnProperty = {}.hasOwnProperty;
		module.exports = function(it, key){
		  return hasOwnProperty.call(it, key);
		};

	/***/ }),
	/* 18 */
	/***/ (function(module, exports, __webpack_require__) {

		// Thank's IE8 for his funny defineProperty
		module.exports = !__webpack_require__(19)(function(){
		  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
		});

	/***/ }),
	/* 19 */
	/***/ (function(module, exports) {

		module.exports = function(exec){
		  try {
		    return !!exec();
		  } catch(e){
		    return true;
		  }
		};

	/***/ }),
	/* 20 */
	/***/ (function(module, exports, __webpack_require__) {

		var global    = __webpack_require__(16)
		  , core      = __webpack_require__(21)
		  , ctx       = __webpack_require__(22)
		  , PROTOTYPE = 'prototype';

		var $export = function(type, name, source){
		  var IS_FORCED = type & $export.F
		    , IS_GLOBAL = type & $export.G
		    , IS_STATIC = type & $export.S
		    , IS_PROTO  = type & $export.P
		    , IS_BIND   = type & $export.B
		    , IS_WRAP   = type & $export.W
		    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
		    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
		    , key, own, out;
		  if(IS_GLOBAL)source = name;
		  for(key in source){
		    // contains in native
		    own = !IS_FORCED && target && key in target;
		    if(own && key in exports)continue;
		    // export native or passed
		    out = own ? target[key] : source[key];
		    // prevent global pollution for namespaces
		    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
		    // bind timers to global for call from export context
		    : IS_BIND && own ? ctx(out, global)
		    // wrap global constructors for prevent change them in library
		    : IS_WRAP && target[key] == out ? (function(C){
		      var F = function(param){
		        return this instanceof C ? new C(param) : C(param);
		      };
		      F[PROTOTYPE] = C[PROTOTYPE];
		      return F;
		    // make static versions for prototype methods
		    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
		    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
		  }
		};
		// type bitmap
		$export.F = 1;  // forced
		$export.G = 2;  // global
		$export.S = 4;  // static
		$export.P = 8;  // proto
		$export.B = 16; // bind
		$export.W = 32; // wrap
		module.exports = $export;

	/***/ }),
	/* 21 */
	/***/ (function(module, exports) {

		var core = module.exports = {version: '1.2.6'};
		if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

	/***/ }),
	/* 22 */
	/***/ (function(module, exports, __webpack_require__) {

		// optional / simple context binding
		var aFunction = __webpack_require__(23);
		module.exports = function(fn, that, length){
		  aFunction(fn);
		  if(that === undefined)return fn;
		  switch(length){
		    case 1: return function(a){
		      return fn.call(that, a);
		    };
		    case 2: return function(a, b){
		      return fn.call(that, a, b);
		    };
		    case 3: return function(a, b, c){
		      return fn.call(that, a, b, c);
		    };
		  }
		  return function(/* ...args */){
		    return fn.apply(that, arguments);
		  };
		};

	/***/ }),
	/* 23 */
	/***/ (function(module, exports) {

		module.exports = function(it){
		  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
		  return it;
		};

	/***/ }),
	/* 24 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = __webpack_require__(25);

	/***/ }),
	/* 25 */
	/***/ (function(module, exports, __webpack_require__) {

		var $          = __webpack_require__(9)
		  , createDesc = __webpack_require__(26);
		module.exports = __webpack_require__(18) ? function(object, key, value){
		  return $.setDesc(object, key, createDesc(1, value));
		} : function(object, key, value){
		  object[key] = value;
		  return object;
		};

	/***/ }),
	/* 26 */
	/***/ (function(module, exports) {

		module.exports = function(bitmap, value){
		  return {
		    enumerable  : !(bitmap & 1),
		    configurable: !(bitmap & 2),
		    writable    : !(bitmap & 4),
		    value       : value
		  };
		};

	/***/ }),
	/* 27 */
	/***/ (function(module, exports, __webpack_require__) {

		var global = __webpack_require__(16)
		  , SHARED = '__core-js_shared__'
		  , store  = global[SHARED] || (global[SHARED] = {});
		module.exports = function(key){
		  return store[key] || (store[key] = {});
		};

	/***/ }),
	/* 28 */
	/***/ (function(module, exports, __webpack_require__) {

		var def = __webpack_require__(9).setDesc
		  , has = __webpack_require__(17)
		  , TAG = __webpack_require__(29)('toStringTag');

		module.exports = function(it, tag, stat){
		  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
		};

	/***/ }),
	/* 29 */
	/***/ (function(module, exports, __webpack_require__) {

		var store  = __webpack_require__(27)('wks')
		  , uid    = __webpack_require__(30)
		  , Symbol = __webpack_require__(16).Symbol;
		module.exports = function(name){
		  return store[name] || (store[name] =
		    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
		};

	/***/ }),
	/* 30 */
	/***/ (function(module, exports) {

		var id = 0
		  , px = Math.random();
		module.exports = function(key){
		  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
		};

	/***/ }),
	/* 31 */
	/***/ (function(module, exports, __webpack_require__) {

		var $         = __webpack_require__(9)
		  , toIObject = __webpack_require__(32);
		module.exports = function(object, el){
		  var O      = toIObject(object)
		    , keys   = $.getKeys(O)
		    , length = keys.length
		    , index  = 0
		    , key;
		  while(length > index)if(O[key = keys[index++]] === el)return key;
		};

	/***/ }),
	/* 32 */
	/***/ (function(module, exports, __webpack_require__) {

		// to indexed object, toObject with fallback for non-array-like ES3 strings
		var IObject = __webpack_require__(33)
		  , defined = __webpack_require__(35);
		module.exports = function(it){
		  return IObject(defined(it));
		};

	/***/ }),
	/* 33 */
	/***/ (function(module, exports, __webpack_require__) {

		// fallback for non-array-like ES3 and non-enumerable old V8 strings
		var cof = __webpack_require__(34);
		module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
		  return cof(it) == 'String' ? it.split('') : Object(it);
		};

	/***/ }),
	/* 34 */
	/***/ (function(module, exports) {

		var toString = {}.toString;

		module.exports = function(it){
		  return toString.call(it).slice(8, -1);
		};

	/***/ }),
	/* 35 */
	/***/ (function(module, exports) {

		// 7.2.1 RequireObjectCoercible(argument)
		module.exports = function(it){
		  if(it == undefined)throw TypeError("Can't call method on  " + it);
		  return it;
		};

	/***/ }),
	/* 36 */
	/***/ (function(module, exports, __webpack_require__) {

		// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
		var toIObject = __webpack_require__(32)
		  , getNames  = __webpack_require__(9).getNames
		  , toString  = {}.toString;

		var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
		  ? Object.getOwnPropertyNames(window) : [];

		var getWindowNames = function(it){
		  try {
		    return getNames(it);
		  } catch(e){
		    return windowNames.slice();
		  }
		};

		module.exports.get = function getOwnPropertyNames(it){
		  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
		  return getNames(toIObject(it));
		};

	/***/ }),
	/* 37 */
	/***/ (function(module, exports, __webpack_require__) {

		// all enumerable object keys, includes symbols
		var $ = __webpack_require__(9);
		module.exports = function(it){
		  var keys       = $.getKeys(it)
		    , getSymbols = $.getSymbols;
		  if(getSymbols){
		    var symbols = getSymbols(it)
		      , isEnum  = $.isEnum
		      , i       = 0
		      , key;
		    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
		  }
		  return keys;
		};

	/***/ }),
	/* 38 */
	/***/ (function(module, exports, __webpack_require__) {

		// 7.2.2 IsArray(argument)
		var cof = __webpack_require__(34);
		module.exports = Array.isArray || function(arg){
		  return cof(arg) == 'Array';
		};

	/***/ }),
	/* 39 */
	/***/ (function(module, exports, __webpack_require__) {

		var isObject = __webpack_require__(40);
		module.exports = function(it){
		  if(!isObject(it))throw TypeError(it + ' is not an object!');
		  return it;
		};

	/***/ }),
	/* 40 */
	/***/ (function(module, exports) {

		module.exports = function(it){
		  return typeof it === 'object' ? it !== null : typeof it === 'function';
		};

	/***/ }),
	/* 41 */
	/***/ (function(module, exports) {

		module.exports = true;

	/***/ }),
	/* 42 */
	/***/ (function(module, exports) {

		

	/***/ }),
	/* 43 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = { "default": __webpack_require__(44), __esModule: true };

	/***/ }),
	/* 44 */
	/***/ (function(module, exports, __webpack_require__) {

		__webpack_require__(45);
		__webpack_require__(51);
		module.exports = __webpack_require__(29)('iterator');

	/***/ }),
	/* 45 */
	/***/ (function(module, exports, __webpack_require__) {
		var $at  = __webpack_require__(46)(true);

		// 21.1.3.27 String.prototype[@@iterator]()
		__webpack_require__(48)(String, 'String', function(iterated){
		  this._t = String(iterated); // target
		  this._i = 0;                // next index
		// 21.1.5.2.1 %StringIteratorPrototype%.next()
		}, function(){
		  var O     = this._t
		    , index = this._i
		    , point;
		  if(index >= O.length)return {value: undefined, done: true};
		  point = $at(O, index);
		  this._i += point.length;
		  return {value: point, done: false};
		});

	/***/ }),
	/* 46 */
	/***/ (function(module, exports, __webpack_require__) {

		var toInteger = __webpack_require__(47)
		  , defined   = __webpack_require__(35);
		// true  -> String#at
		// false -> String#codePointAt
		module.exports = function(TO_STRING){
		  return function(that, pos){
		    var s = String(defined(that))
		      , i = toInteger(pos)
		      , l = s.length
		      , a, b;
		    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
		    a = s.charCodeAt(i);
		    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
		      ? TO_STRING ? s.charAt(i) : a
		      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
		  };
		};

	/***/ }),
	/* 47 */
	/***/ (function(module, exports) {

		// 7.1.4 ToInteger
		var ceil  = Math.ceil
		  , floor = Math.floor;
		module.exports = function(it){
		  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
		};

	/***/ }),
	/* 48 */
	/***/ (function(module, exports, __webpack_require__) {
		var LIBRARY        = __webpack_require__(41)
		  , $export        = __webpack_require__(20)
		  , redefine       = __webpack_require__(24)
		  , hide           = __webpack_require__(25)
		  , has            = __webpack_require__(17)
		  , Iterators      = __webpack_require__(49)
		  , $iterCreate    = __webpack_require__(50)
		  , setToStringTag = __webpack_require__(28)
		  , getProto       = __webpack_require__(9).getProto
		  , ITERATOR       = __webpack_require__(29)('iterator')
		  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
		  , FF_ITERATOR    = '@@iterator'
		  , KEYS           = 'keys'
		  , VALUES         = 'values';

		var returnThis = function(){ return this; };

		module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
		  $iterCreate(Constructor, NAME, next);
		  var getMethod = function(kind){
		    if(!BUGGY && kind in proto)return proto[kind];
		    switch(kind){
		      case KEYS: return function keys(){ return new Constructor(this, kind); };
		      case VALUES: return function values(){ return new Constructor(this, kind); };
		    } return function entries(){ return new Constructor(this, kind); };
		  };
		  var TAG        = NAME + ' Iterator'
		    , DEF_VALUES = DEFAULT == VALUES
		    , VALUES_BUG = false
		    , proto      = Base.prototype
		    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
		    , $default   = $native || getMethod(DEFAULT)
		    , methods, key;
		  // Fix native
		  if($native){
		    var IteratorPrototype = getProto($default.call(new Base));
		    // Set @@toStringTag to native iterators
		    setToStringTag(IteratorPrototype, TAG, true);
		    // FF fix
		    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
		    // fix Array#{values, @@iterator}.name in V8 / FF
		    if(DEF_VALUES && $native.name !== VALUES){
		      VALUES_BUG = true;
		      $default = function values(){ return $native.call(this); };
		    }
		  }
		  // Define iterator
		  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
		    hide(proto, ITERATOR, $default);
		  }
		  // Plug for library
		  Iterators[NAME] = $default;
		  Iterators[TAG]  = returnThis;
		  if(DEFAULT){
		    methods = {
		      values:  DEF_VALUES  ? $default : getMethod(VALUES),
		      keys:    IS_SET      ? $default : getMethod(KEYS),
		      entries: !DEF_VALUES ? $default : getMethod('entries')
		    };
		    if(FORCED)for(key in methods){
		      if(!(key in proto))redefine(proto, key, methods[key]);
		    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
		  }
		  return methods;
		};

	/***/ }),
	/* 49 */
	/***/ (function(module, exports) {

		module.exports = {};

	/***/ }),
	/* 50 */
	/***/ (function(module, exports, __webpack_require__) {
		var $              = __webpack_require__(9)
		  , descriptor     = __webpack_require__(26)
		  , setToStringTag = __webpack_require__(28)
		  , IteratorPrototype = {};

		// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
		__webpack_require__(25)(IteratorPrototype, __webpack_require__(29)('iterator'), function(){ return this; });

		module.exports = function(Constructor, NAME, next){
		  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
		  setToStringTag(Constructor, NAME + ' Iterator');
		};

	/***/ }),
	/* 51 */
	/***/ (function(module, exports, __webpack_require__) {

		__webpack_require__(52);
		var Iterators = __webpack_require__(49);
		Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

	/***/ }),
	/* 52 */
	/***/ (function(module, exports, __webpack_require__) {
		var addToUnscopables = __webpack_require__(53)
		  , step             = __webpack_require__(54)
		  , Iterators        = __webpack_require__(49)
		  , toIObject        = __webpack_require__(32);

		// 22.1.3.4 Array.prototype.entries()
		// 22.1.3.13 Array.prototype.keys()
		// 22.1.3.29 Array.prototype.values()
		// 22.1.3.30 Array.prototype[@@iterator]()
		module.exports = __webpack_require__(48)(Array, 'Array', function(iterated, kind){
		  this._t = toIObject(iterated); // target
		  this._i = 0;                   // next index
		  this._k = kind;                // kind
		// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
		}, function(){
		  var O     = this._t
		    , kind  = this._k
		    , index = this._i++;
		  if(!O || index >= O.length){
		    this._t = undefined;
		    return step(1);
		  }
		  if(kind == 'keys'  )return step(0, index);
		  if(kind == 'values')return step(0, O[index]);
		  return step(0, [index, O[index]]);
		}, 'values');

		// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
		Iterators.Arguments = Iterators.Array;

		addToUnscopables('keys');
		addToUnscopables('values');
		addToUnscopables('entries');

	/***/ }),
	/* 53 */
	/***/ (function(module, exports) {

		module.exports = function(){ /* empty */ };

	/***/ }),
	/* 54 */
	/***/ (function(module, exports) {

		module.exports = function(done, value){
		  return {value: value, done: !!done};
		};

	/***/ }),
	/* 55 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = { "default": __webpack_require__(56), __esModule: true };

	/***/ }),
	/* 56 */
	/***/ (function(module, exports, __webpack_require__) {

		__webpack_require__(51);
		__webpack_require__(45);
		module.exports = __webpack_require__(57);

	/***/ }),
	/* 57 */
	/***/ (function(module, exports, __webpack_require__) {

		var anObject = __webpack_require__(39)
		  , get      = __webpack_require__(58);
		module.exports = __webpack_require__(21).getIterator = function(it){
		  var iterFn = get(it);
		  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
		  return anObject(iterFn.call(it));
		};

	/***/ }),
	/* 58 */
	/***/ (function(module, exports, __webpack_require__) {

		var classof   = __webpack_require__(59)
		  , ITERATOR  = __webpack_require__(29)('iterator')
		  , Iterators = __webpack_require__(49);
		module.exports = __webpack_require__(21).getIteratorMethod = function(it){
		  if(it != undefined)return it[ITERATOR]
		    || it['@@iterator']
		    || Iterators[classof(it)];
		};

	/***/ }),
	/* 59 */
	/***/ (function(module, exports, __webpack_require__) {

		// getting tag from 19.1.3.6 Object.prototype.toString()
		var cof = __webpack_require__(34)
		  , TAG = __webpack_require__(29)('toStringTag')
		  // ES3 wrong here
		  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

		module.exports = function(it){
		  var O, T, B;
		  return it === undefined ? 'Undefined' : it === null ? 'Null'
		    // @@toStringTag case
		    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
		    // builtinTag case
		    : ARG ? cof(O)
		    // ES3 arguments fallback
		    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
		};

	/***/ }),
	/* 60 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = { "default": __webpack_require__(61), __esModule: true };

	/***/ }),
	/* 61 */
	/***/ (function(module, exports, __webpack_require__) {

		__webpack_require__(62);
		module.exports = __webpack_require__(21).Object.keys;

	/***/ }),
	/* 62 */
	/***/ (function(module, exports, __webpack_require__) {

		// 19.1.2.14 Object.keys(O)
		var toObject = __webpack_require__(63);

		__webpack_require__(64)('keys', function($keys){
		  return function keys(it){
		    return $keys(toObject(it));
		  };
		});

	/***/ }),
	/* 63 */
	/***/ (function(module, exports, __webpack_require__) {

		// 7.1.13 ToObject(argument)
		var defined = __webpack_require__(35);
		module.exports = function(it){
		  return Object(defined(it));
		};

	/***/ }),
	/* 64 */
	/***/ (function(module, exports, __webpack_require__) {

		// most Object methods by ES6 should accept primitives
		var $export = __webpack_require__(20)
		  , core    = __webpack_require__(21)
		  , fails   = __webpack_require__(19);
		module.exports = function(KEY, exec){
		  var fn  = (core.Object || {})[KEY] || Object[KEY]
		    , exp = {};
		  exp[KEY] = exec(fn);
		  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
		};

	/***/ }),
	/* 65 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		exports['default'] = function (instance) {
		  instance.registerHelper('helperMissing', function () /* [args, ]options */{
		    if (arguments.length === 1) {
		      // A missing field in a {{foo}} construct.
		      return undefined;
		    } else {
		      // Someone is actually trying to call something, blow up.
		      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
		    }
		  });
		};

		module.exports = exports['default'];

	/***/ }),
	/* 66 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _utils = __webpack_require__(5);

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		exports['default'] = function (instance) {
		  instance.registerHelper('if', function (conditional, options) {
		    if (arguments.length != 2) {
		      throw new _exception2['default']('#if requires exactly one argument');
		    }
		    if (_utils.isFunction(conditional)) {
		      conditional = conditional.call(this);
		    }

		    // Default behavior is to render the positive path if the value is truthy and not empty.
		    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
		    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
		    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
		      return options.inverse(this);
		    } else {
		      return options.fn(this);
		    }
		  });

		  instance.registerHelper('unless', function (conditional, options) {
		    if (arguments.length != 2) {
		      throw new _exception2['default']('#unless requires exactly one argument');
		    }
		    return instance.helpers['if'].call(this, conditional, {
		      fn: options.inverse,
		      inverse: options.fn,
		      hash: options.hash
		    });
		  });
		};

		module.exports = exports['default'];

	/***/ }),
	/* 67 */
	/***/ (function(module, exports) {

		exports.__esModule = true;

		exports['default'] = function (instance) {
		  instance.registerHelper('log', function () /* message, options */{
		    var args = [undefined],
		        options = arguments[arguments.length - 1];
		    for (var i = 0; i < arguments.length - 1; i++) {
		      args.push(arguments[i]);
		    }

		    var level = 1;
		    if (options.hash.level != null) {
		      level = options.hash.level;
		    } else if (options.data && options.data.level != null) {
		      level = options.data.level;
		    }
		    args[0] = level;

		    instance.log.apply(instance, args);
		  });
		};

		module.exports = exports['default'];

	/***/ }),
	/* 68 */
	/***/ (function(module, exports) {

		exports.__esModule = true;

		exports['default'] = function (instance) {
		  instance.registerHelper('lookup', function (obj, field, options) {
		    if (!obj) {
		      // Note for 5.0: Change to "obj == null" in 5.0
		      return obj;
		    }
		    return options.lookupProperty(obj, field);
		  });
		};

		module.exports = exports['default'];

	/***/ }),
	/* 69 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _utils = __webpack_require__(5);

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		exports['default'] = function (instance) {
		  instance.registerHelper('with', function (context, options) {
		    if (arguments.length != 2) {
		      throw new _exception2['default']('#with requires exactly one argument');
		    }
		    if (_utils.isFunction(context)) {
		      context = context.call(this);
		    }

		    var fn = options.fn;

		    if (!_utils.isEmpty(context)) {
		      var data = options.data;
		      if (options.data && options.ids) {
		        data = _utils.createFrame(options.data);
		        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
		      }

		      return fn(context, {
		        data: data,
		        blockParams: _utils.blockParams([context], [data && data.contextPath])
		      });
		    } else {
		      return options.inverse(this);
		    }
		  });
		};

		module.exports = exports['default'];

	/***/ }),
	/* 70 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;
		exports.registerDefaultDecorators = registerDefaultDecorators;

		var _decoratorsInline = __webpack_require__(71);

		var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

		function registerDefaultDecorators(instance) {
		  _decoratorsInline2['default'](instance);
		}

	/***/ }),
	/* 71 */
	/***/ (function(module, exports, __webpack_require__) {

		exports.__esModule = true;

		var _utils = __webpack_require__(5);

		exports['default'] = function (instance) {
		  instance.registerDecorator('inline', function (fn, props, container, options) {
		    var ret = fn;
		    if (!props.partials) {
		      props.partials = {};
		      ret = function (context, options) {
		        // Create a new partials stack frame prior to exec.
		        var original = container.partials;
		        container.partials = _utils.extend({}, original, props.partials);
		        var ret = fn(context, options);
		        container.partials = original;
		        return ret;
		      };
		    }

		    props.partials[options.args[0]] = options.fn;

		    return ret;
		  });
		};

		module.exports = exports['default'];

	/***/ }),
	/* 72 */
	/***/ (function(module, exports, __webpack_require__) {

		exports.__esModule = true;

		var _utils = __webpack_require__(5);

		var logger = {
		  methodMap: ['debug', 'info', 'warn', 'error'],
		  level: 'info',

		  // Maps a given level value to the `methodMap` indexes above.
		  lookupLevel: function lookupLevel(level) {
		    if (typeof level === 'string') {
		      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
		      if (levelMap >= 0) {
		        level = levelMap;
		      } else {
		        level = parseInt(level, 10);
		      }
		    }

		    return level;
		  },

		  // Can be overridden in the host environment
		  log: function log(level) {
		    level = logger.lookupLevel(level);

		    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
		      var method = logger.methodMap[level];
		      // eslint-disable-next-line no-console
		      if (!console[method]) {
		        method = 'log';
		      }

		      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		        message[_key - 1] = arguments[_key];
		      }

		      console[method].apply(console, message); // eslint-disable-line no-console
		    }
		  }
		};

		exports['default'] = logger;
		module.exports = exports['default'];

	/***/ }),
	/* 73 */
	/***/ (function(module, exports, __webpack_require__) {

		var _Object$create = __webpack_require__(74)['default'];

		var _Object$keys = __webpack_require__(60)['default'];

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;
		exports.createProtoAccessControl = createProtoAccessControl;
		exports.resultIsAllowed = resultIsAllowed;
		exports.resetLoggedProperties = resetLoggedProperties;

		var _createNewLookupObject = __webpack_require__(76);

		var _logger = __webpack_require__(72);

		var _logger2 = _interopRequireDefault(_logger);

		var loggedProperties = _Object$create(null);

		function createProtoAccessControl(runtimeOptions) {
		  var defaultMethodWhiteList = _Object$create(null);
		  defaultMethodWhiteList['constructor'] = false;
		  defaultMethodWhiteList['__defineGetter__'] = false;
		  defaultMethodWhiteList['__defineSetter__'] = false;
		  defaultMethodWhiteList['__lookupGetter__'] = false;

		  var defaultPropertyWhiteList = _Object$create(null);
		  // eslint-disable-next-line no-proto
		  defaultPropertyWhiteList['__proto__'] = false;

		  return {
		    properties: {
		      whitelist: _createNewLookupObject.createNewLookupObject(defaultPropertyWhiteList, runtimeOptions.allowedProtoProperties),
		      defaultValue: runtimeOptions.allowProtoPropertiesByDefault
		    },
		    methods: {
		      whitelist: _createNewLookupObject.createNewLookupObject(defaultMethodWhiteList, runtimeOptions.allowedProtoMethods),
		      defaultValue: runtimeOptions.allowProtoMethodsByDefault
		    }
		  };
		}

		function resultIsAllowed(result, protoAccessControl, propertyName) {
		  if (typeof result === 'function') {
		    return checkWhiteList(protoAccessControl.methods, propertyName);
		  } else {
		    return checkWhiteList(protoAccessControl.properties, propertyName);
		  }
		}

		function checkWhiteList(protoAccessControlForType, propertyName) {
		  if (protoAccessControlForType.whitelist[propertyName] !== undefined) {
		    return protoAccessControlForType.whitelist[propertyName] === true;
		  }
		  if (protoAccessControlForType.defaultValue !== undefined) {
		    return protoAccessControlForType.defaultValue;
		  }
		  logUnexpecedPropertyAccessOnce(propertyName);
		  return false;
		}

		function logUnexpecedPropertyAccessOnce(propertyName) {
		  if (loggedProperties[propertyName] !== true) {
		    loggedProperties[propertyName] = true;
		    _logger2['default'].log('error', 'Handlebars: Access has been denied to resolve the property "' + propertyName + '" because it is not an "own property" of its parent.\n' + 'You can add a runtime option to disable the check or this warning:\n' + 'See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details');
		  }
		}

		function resetLoggedProperties() {
		  _Object$keys(loggedProperties).forEach(function (propertyName) {
		    delete loggedProperties[propertyName];
		  });
		}

	/***/ }),
	/* 74 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = { "default": __webpack_require__(75), __esModule: true };

	/***/ }),
	/* 75 */
	/***/ (function(module, exports, __webpack_require__) {

		var $ = __webpack_require__(9);
		module.exports = function create(P, D){
		  return $.create(P, D);
		};

	/***/ }),
	/* 76 */
	/***/ (function(module, exports, __webpack_require__) {

		var _Object$create = __webpack_require__(74)['default'];

		exports.__esModule = true;
		exports.createNewLookupObject = createNewLookupObject;

		var _utils = __webpack_require__(5);

		/**
		 * Create a new object with "null"-prototype to avoid truthy results on prototype properties.
		 * The resulting object can be used with "object[property]" to check if a property exists
		 * @param {...object} sources a varargs parameter of source objects that will be merged
		 * @returns {object}
		 */

		function createNewLookupObject() {
		  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
		    sources[_key] = arguments[_key];
		  }

		  return _utils.extend.apply(undefined, [_Object$create(null)].concat(sources));
		}

	/***/ }),
	/* 77 */
	/***/ (function(module, exports) {

		exports.__esModule = true;
		function SafeString(string) {
		  this.string = string;
		}

		SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
		  return '' + this.string;
		};

		exports['default'] = SafeString;
		module.exports = exports['default'];

	/***/ }),
	/* 78 */
	/***/ (function(module, exports, __webpack_require__) {

		var _Object$seal = __webpack_require__(79)['default'];

		var _Object$keys = __webpack_require__(60)['default'];

		var _interopRequireWildcard = __webpack_require__(3)['default'];

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;
		exports.checkRevision = checkRevision;
		exports.template = template;
		exports.wrapProgram = wrapProgram;
		exports.resolvePartial = resolvePartial;
		exports.invokePartial = invokePartial;
		exports.noop = noop;

		var _utils = __webpack_require__(5);

		var Utils = _interopRequireWildcard(_utils);

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		var _base = __webpack_require__(4);

		var _helpers = __webpack_require__(10);

		var _internalWrapHelper = __webpack_require__(82);

		var _internalProtoAccess = __webpack_require__(73);

		function checkRevision(compilerInfo) {
		  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
		      currentRevision = _base.COMPILER_REVISION;

		  if (compilerRevision >= _base.LAST_COMPATIBLE_COMPILER_REVISION && compilerRevision <= _base.COMPILER_REVISION) {
		    return;
		  }

		  if (compilerRevision < _base.LAST_COMPATIBLE_COMPILER_REVISION) {
		    var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
		        compilerVersions = _base.REVISION_CHANGES[compilerRevision];
		    throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
		  } else {
		    // Use the embedded version info since the runtime doesn't know about this revision yet
		    throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
		  }
		}

		function template(templateSpec, env) {
		  /* istanbul ignore next */
		  if (!env) {
		    throw new _exception2['default']('No environment passed to template');
		  }
		  if (!templateSpec || !templateSpec.main) {
		    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
		  }

		  templateSpec.main.decorator = templateSpec.main_d;

		  // Note: Using env.VM references rather than local var references throughout this section to allow
		  // for external users to override these as pseudo-supported APIs.
		  env.VM.checkRevision(templateSpec.compiler);

		  // backwards compatibility for precompiled templates with compiler-version 7 (<4.3.0)
		  var templateWasPrecompiledWithCompilerV7 = templateSpec.compiler && templateSpec.compiler[0] === 7;

		  function invokePartialWrapper(partial, context, options) {
		    if (options.hash) {
		      context = Utils.extend({}, context, options.hash);
		      if (options.ids) {
		        options.ids[0] = true;
		      }
		    }
		    partial = env.VM.resolvePartial.call(this, partial, context, options);

		    var extendedOptions = Utils.extend({}, options, {
		      hooks: this.hooks,
		      protoAccessControl: this.protoAccessControl
		    });

		    var result = env.VM.invokePartial.call(this, partial, context, extendedOptions);

		    if (result == null && env.compile) {
		      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
		      result = options.partials[options.name](context, extendedOptions);
		    }
		    if (result != null) {
		      if (options.indent) {
		        var lines = result.split('\n');
		        for (var i = 0, l = lines.length; i < l; i++) {
		          if (!lines[i] && i + 1 === l) {
		            break;
		          }

		          lines[i] = options.indent + lines[i];
		        }
		        result = lines.join('\n');
		      }
		      return result;
		    } else {
		      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
		    }
		  }

		  // Just add water
		  var container = {
		    strict: function strict(obj, name, loc) {
		      if (!obj || !(name in obj)) {
		        throw new _exception2['default']('"' + name + '" not defined in ' + obj, {
		          loc: loc
		        });
		      }
		      return container.lookupProperty(obj, name);
		    },
		    lookupProperty: function lookupProperty(parent, propertyName) {
		      var result = parent[propertyName];
		      if (result == null) {
		        return result;
		      }
		      if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
		        return result;
		      }

		      if (_internalProtoAccess.resultIsAllowed(result, container.protoAccessControl, propertyName)) {
		        return result;
		      }
		      return undefined;
		    },
		    lookup: function lookup(depths, name) {
		      var len = depths.length;
		      for (var i = 0; i < len; i++) {
		        var result = depths[i] && container.lookupProperty(depths[i], name);
		        if (result != null) {
		          return depths[i][name];
		        }
		      }
		    },
		    lambda: function lambda(current, context) {
		      return typeof current === 'function' ? current.call(context) : current;
		    },

		    escapeExpression: Utils.escapeExpression,
		    invokePartial: invokePartialWrapper,

		    fn: function fn(i) {
		      var ret = templateSpec[i];
		      ret.decorator = templateSpec[i + '_d'];
		      return ret;
		    },

		    programs: [],
		    program: function program(i, data, declaredBlockParams, blockParams, depths) {
		      var programWrapper = this.programs[i],
		          fn = this.fn(i);
		      if (data || depths || blockParams || declaredBlockParams) {
		        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
		      } else if (!programWrapper) {
		        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
		      }
		      return programWrapper;
		    },

		    data: function data(value, depth) {
		      while (value && depth--) {
		        value = value._parent;
		      }
		      return value;
		    },
		    mergeIfNeeded: function mergeIfNeeded(param, common) {
		      var obj = param || common;

		      if (param && common && param !== common) {
		        obj = Utils.extend({}, common, param);
		      }

		      return obj;
		    },
		    // An empty object to use as replacement for null-contexts
		    nullContext: _Object$seal({}),

		    noop: env.VM.noop,
		    compilerInfo: templateSpec.compiler
		  };

		  function ret(context) {
		    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		    var data = options.data;

		    ret._setup(options);
		    if (!options.partial && templateSpec.useData) {
		      data = initData(context, data);
		    }
		    var depths = undefined,
		        blockParams = templateSpec.useBlockParams ? [] : undefined;
		    if (templateSpec.useDepths) {
		      if (options.depths) {
		        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
		      } else {
		        depths = [context];
		      }
		    }

		    function main(context /*, options*/) {
		      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
		    }

		    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
		    return main(context, options);
		  }

		  ret.isTop = true;

		  ret._setup = function (options) {
		    if (!options.partial) {
		      var mergedHelpers = Utils.extend({}, env.helpers, options.helpers);
		      wrapHelpersToPassLookupProperty(mergedHelpers, container);
		      container.helpers = mergedHelpers;

		      if (templateSpec.usePartial) {
		        // Use mergeIfNeeded here to prevent compiling global partials multiple times
		        container.partials = container.mergeIfNeeded(options.partials, env.partials);
		      }
		      if (templateSpec.usePartial || templateSpec.useDecorators) {
		        container.decorators = Utils.extend({}, env.decorators, options.decorators);
		      }

		      container.hooks = {};
		      container.protoAccessControl = _internalProtoAccess.createProtoAccessControl(options);

		      var keepHelperInHelpers = options.allowCallsToHelperMissing || templateWasPrecompiledWithCompilerV7;
		      _helpers.moveHelperToHooks(container, 'helperMissing', keepHelperInHelpers);
		      _helpers.moveHelperToHooks(container, 'blockHelperMissing', keepHelperInHelpers);
		    } else {
		      container.protoAccessControl = options.protoAccessControl; // internal option
		      container.helpers = options.helpers;
		      container.partials = options.partials;
		      container.decorators = options.decorators;
		      container.hooks = options.hooks;
		    }
		  };

		  ret._child = function (i, data, blockParams, depths) {
		    if (templateSpec.useBlockParams && !blockParams) {
		      throw new _exception2['default']('must pass block params');
		    }
		    if (templateSpec.useDepths && !depths) {
		      throw new _exception2['default']('must pass parent depths');
		    }

		    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
		  };
		  return ret;
		}

		function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
		  function prog(context) {
		    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		    var currentDepths = depths;
		    if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
		      currentDepths = [context].concat(depths);
		    }

		    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
		  }

		  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

		  prog.program = i;
		  prog.depth = depths ? depths.length : 0;
		  prog.blockParams = declaredBlockParams || 0;
		  return prog;
		}

		/**
		 * This is currently part of the official API, therefore implementation details should not be changed.
		 */

		function resolvePartial(partial, context, options) {
		  if (!partial) {
		    if (options.name === '@partial-block') {
		      partial = options.data['partial-block'];
		    } else {
		      partial = options.partials[options.name];
		    }
		  } else if (!partial.call && !options.name) {
		    // This is a dynamic partial that returned a string
		    options.name = partial;
		    partial = options.partials[partial];
		  }
		  return partial;
		}

		function invokePartial(partial, context, options) {
		  // Use the current closure context to save the partial-block if this partial
		  var currentPartialBlock = options.data && options.data['partial-block'];
		  options.partial = true;
		  if (options.ids) {
		    options.data.contextPath = options.ids[0] || options.data.contextPath;
		  }

		  var partialBlock = undefined;
		  if (options.fn && options.fn !== noop) {
		    (function () {
		      options.data = _base.createFrame(options.data);
		      // Wrapper function to get access to currentPartialBlock from the closure
		      var fn = options.fn;
		      partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
		        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		        // Restore the partial-block from the closure for the execution of the block
		        // i.e. the part inside the block of the partial call.
		        options.data = _base.createFrame(options.data);
		        options.data['partial-block'] = currentPartialBlock;
		        return fn(context, options);
		      };
		      if (fn.partials) {
		        options.partials = Utils.extend({}, options.partials, fn.partials);
		      }
		    })();
		  }

		  if (partial === undefined && partialBlock) {
		    partial = partialBlock;
		  }

		  if (partial === undefined) {
		    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
		  } else if (partial instanceof Function) {
		    return partial(context, options);
		  }
		}

		function noop() {
		  return '';
		}

		function initData(context, data) {
		  if (!data || !('root' in data)) {
		    data = data ? _base.createFrame(data) : {};
		    data.root = context;
		  }
		  return data;
		}

		function executeDecorators(fn, prog, container, depths, data, blockParams) {
		  if (fn.decorator) {
		    var props = {};
		    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
		    Utils.extend(prog, props);
		  }
		  return prog;
		}

		function wrapHelpersToPassLookupProperty(mergedHelpers, container) {
		  _Object$keys(mergedHelpers).forEach(function (helperName) {
		    var helper = mergedHelpers[helperName];
		    mergedHelpers[helperName] = passLookupPropertyOption(helper, container);
		  });
		}

		function passLookupPropertyOption(helper, container) {
		  var lookupProperty = container.lookupProperty;
		  return _internalWrapHelper.wrapHelper(helper, function (options) {
		    return Utils.extend({ lookupProperty: lookupProperty }, options);
		  });
		}

	/***/ }),
	/* 79 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = { "default": __webpack_require__(80), __esModule: true };

	/***/ }),
	/* 80 */
	/***/ (function(module, exports, __webpack_require__) {

		__webpack_require__(81);
		module.exports = __webpack_require__(21).Object.seal;

	/***/ }),
	/* 81 */
	/***/ (function(module, exports, __webpack_require__) {

		// 19.1.2.17 Object.seal(O)
		var isObject = __webpack_require__(40);

		__webpack_require__(64)('seal', function($seal){
		  return function seal(it){
		    return $seal && isObject(it) ? $seal(it) : it;
		  };
		});

	/***/ }),
	/* 82 */
	/***/ (function(module, exports) {

		exports.__esModule = true;
		exports.wrapHelper = wrapHelper;

		function wrapHelper(helper, transformOptionsFn) {
		  if (typeof helper !== 'function') {
		    // This should not happen, but apparently it does in https://github.com/wycats/handlebars.js/issues/1639
		    // We try to make the wrapper least-invasive by not wrapping it, if the helper is not a function.
		    return helper;
		  }
		  var wrapper = function wrapper() /* dynamic arguments */{
		    var options = arguments[arguments.length - 1];
		    arguments[arguments.length - 1] = transformOptionsFn(options);
		    return helper.apply(this, arguments);
		  };
		  return wrapper;
		}

	/***/ }),
	/* 83 */
	/***/ (function(module, exports) {

		exports.__esModule = true;

		exports['default'] = function (Handlebars) {
		  /* istanbul ignore next */
		  // https://mathiasbynens.be/notes/globalthis
		  (function () {
		    if (typeof globalThis === 'object') return;
		    Object.prototype.__defineGetter__('__magic__', function () {
		      return this;
		    });
		    __magic__.globalThis = __magic__; // eslint-disable-line no-undef
		    delete Object.prototype.__magic__;
		  })();

		  var $Handlebars = globalThis.Handlebars;

		  /* istanbul ignore next */
		  Handlebars.noConflict = function () {
		    if (globalThis.Handlebars === Handlebars) {
		      globalThis.Handlebars = $Handlebars;
		    }
		    return Handlebars;
		  };
		};

		module.exports = exports['default'];

	/***/ }),
	/* 84 */
	/***/ (function(module, exports) {

		exports.__esModule = true;
		var AST = {
		  // Public API used to evaluate derived attributes regarding AST nodes
		  helpers: {
		    // a mustache is definitely a helper if:
		    // * it is an eligible helper, and
		    // * it has at least one parameter or hash segment
		    helperExpression: function helperExpression(node) {
		      return node.type === 'SubExpression' || (node.type === 'MustacheStatement' || node.type === 'BlockStatement') && !!(node.params && node.params.length || node.hash);
		    },

		    scopedId: function scopedId(path) {
		      return (/^\.|this\b/.test(path.original)
		      );
		    },

		    // an ID is simple if it only has one part, and that part is not
		    // `..` or `this`.
		    simpleId: function simpleId(path) {
		      return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
		    }
		  }
		};

		// Must be exported as an object rather than the root of the module as the jison lexer
		// must modify the object to operate properly.
		exports['default'] = AST;
		module.exports = exports['default'];

	/***/ }),
	/* 85 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		var _interopRequireWildcard = __webpack_require__(3)['default'];

		exports.__esModule = true;
		exports.parseWithoutProcessing = parseWithoutProcessing;
		exports.parse = parse;

		var _parser = __webpack_require__(86);

		var _parser2 = _interopRequireDefault(_parser);

		var _whitespaceControl = __webpack_require__(87);

		var _whitespaceControl2 = _interopRequireDefault(_whitespaceControl);

		var _helpers = __webpack_require__(89);

		var Helpers = _interopRequireWildcard(_helpers);

		var _utils = __webpack_require__(5);

		exports.parser = _parser2['default'];

		var yy = {};
		_utils.extend(yy, Helpers);

		function parseWithoutProcessing(input, options) {
		  // Just return if an already-compiled AST was passed in.
		  if (input.type === 'Program') {
		    return input;
		  }

		  _parser2['default'].yy = yy;

		  // Altering the shared object here, but this is ok as parser is a sync operation
		  yy.locInfo = function (locInfo) {
		    return new yy.SourceLocation(options && options.srcName, locInfo);
		  };

		  var ast = _parser2['default'].parse(input);

		  return ast;
		}

		function parse(input, options) {
		  var ast = parseWithoutProcessing(input, options);
		  var strip = new _whitespaceControl2['default'](options);

		  return strip.accept(ast);
		}

	/***/ }),
	/* 86 */
	/***/ (function(module, exports) {

		exports.__esModule = true;
		var handlebars = (function () {
		    var parser = { trace: function trace() {},
		        yy: {},
		        symbols_: { "error": 2, "root": 3, "program": 4, "EOF": 5, "program_repetition0": 6, "statement": 7, "mustache": 8, "block": 9, "rawBlock": 10, "partial": 11, "partialBlock": 12, "content": 13, "COMMENT": 14, "CONTENT": 15, "openRawBlock": 16, "rawBlock_repetition0": 17, "END_RAW_BLOCK": 18, "OPEN_RAW_BLOCK": 19, "helperName": 20, "openRawBlock_repetition0": 21, "openRawBlock_option0": 22, "CLOSE_RAW_BLOCK": 23, "openBlock": 24, "block_option0": 25, "closeBlock": 26, "openInverse": 27, "block_option1": 28, "OPEN_BLOCK": 29, "openBlock_repetition0": 30, "openBlock_option0": 31, "openBlock_option1": 32, "CLOSE": 33, "OPEN_INVERSE": 34, "openInverse_repetition0": 35, "openInverse_option0": 36, "openInverse_option1": 37, "openInverseChain": 38, "OPEN_INVERSE_CHAIN": 39, "openInverseChain_repetition0": 40, "openInverseChain_option0": 41, "openInverseChain_option1": 42, "inverseAndProgram": 43, "INVERSE": 44, "inverseChain": 45, "inverseChain_option0": 46, "OPEN_ENDBLOCK": 47, "OPEN": 48, "mustache_repetition0": 49, "mustache_option0": 50, "OPEN_UNESCAPED": 51, "mustache_repetition1": 52, "mustache_option1": 53, "CLOSE_UNESCAPED": 54, "OPEN_PARTIAL": 55, "partialName": 56, "partial_repetition0": 57, "partial_option0": 58, "openPartialBlock": 59, "OPEN_PARTIAL_BLOCK": 60, "openPartialBlock_repetition0": 61, "openPartialBlock_option0": 62, "param": 63, "sexpr": 64, "OPEN_SEXPR": 65, "sexpr_repetition0": 66, "sexpr_option0": 67, "CLOSE_SEXPR": 68, "hash": 69, "hash_repetition_plus0": 70, "hashSegment": 71, "ID": 72, "EQUALS": 73, "blockParams": 74, "OPEN_BLOCK_PARAMS": 75, "blockParams_repetition_plus0": 76, "CLOSE_BLOCK_PARAMS": 77, "path": 78, "dataName": 79, "STRING": 80, "NUMBER": 81, "BOOLEAN": 82, "UNDEFINED": 83, "NULL": 84, "DATA": 85, "pathSegments": 86, "SEP": 87, "$accept": 0, "$end": 1 },
		        terminals_: { 2: "error", 5: "EOF", 14: "COMMENT", 15: "CONTENT", 18: "END_RAW_BLOCK", 19: "OPEN_RAW_BLOCK", 23: "CLOSE_RAW_BLOCK", 29: "OPEN_BLOCK", 33: "CLOSE", 34: "OPEN_INVERSE", 39: "OPEN_INVERSE_CHAIN", 44: "INVERSE", 47: "OPEN_ENDBLOCK", 48: "OPEN", 51: "OPEN_UNESCAPED", 54: "CLOSE_UNESCAPED", 55: "OPEN_PARTIAL", 60: "OPEN_PARTIAL_BLOCK", 65: "OPEN_SEXPR", 68: "CLOSE_SEXPR", 72: "ID", 73: "EQUALS", 75: "OPEN_BLOCK_PARAMS", 77: "CLOSE_BLOCK_PARAMS", 80: "STRING", 81: "NUMBER", 82: "BOOLEAN", 83: "UNDEFINED", 84: "NULL", 85: "DATA", 87: "SEP" },
		        productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [63, 1], [63, 1], [64, 5], [69, 1], [71, 3], [74, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [56, 1], [56, 1], [79, 2], [78, 1], [86, 3], [86, 1], [6, 0], [6, 2], [17, 0], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [49, 0], [49, 2], [50, 0], [50, 1], [52, 0], [52, 2], [53, 0], [53, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [66, 0], [66, 2], [67, 0], [67, 1], [70, 1], [70, 2], [76, 1], [76, 2]],
		        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {

		            var $0 = $$.length - 1;
		            switch (yystate) {
		                case 1:
		                    return $$[$0 - 1];
		                case 2:
		                    this.$ = yy.prepareProgram($$[$0]);
		                    break;
		                case 3:
		                    this.$ = $$[$0];
		                    break;
		                case 4:
		                    this.$ = $$[$0];
		                    break;
		                case 5:
		                    this.$ = $$[$0];
		                    break;
		                case 6:
		                    this.$ = $$[$0];
		                    break;
		                case 7:
		                    this.$ = $$[$0];
		                    break;
		                case 8:
		                    this.$ = $$[$0];
		                    break;
		                case 9:
		                    this.$ = {
		                        type: 'CommentStatement',
		                        value: yy.stripComment($$[$0]),
		                        strip: yy.stripFlags($$[$0], $$[$0]),
		                        loc: yy.locInfo(this._$)
		                    };

		                    break;
		                case 10:
		                    this.$ = {
		                        type: 'ContentStatement',
		                        original: $$[$0],
		                        value: $$[$0],
		                        loc: yy.locInfo(this._$)
		                    };

		                    break;
		                case 11:
		                    this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
		                    break;
		                case 12:
		                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
		                    break;
		                case 13:
		                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
		                    break;
		                case 14:
		                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
		                    break;
		                case 15:
		                    this.$ = { open: $$[$0 - 5], path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
		                    break;
		                case 16:
		                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
		                    break;
		                case 17:
		                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
		                    break;
		                case 18:
		                    this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
		                    break;
		                case 19:
		                    var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
		                        program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
		                    program.chained = true;

		                    this.$ = { strip: $$[$0 - 2].strip, program: program, chain: true };

		                    break;
		                case 20:
		                    this.$ = $$[$0];
		                    break;
		                case 21:
		                    this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
		                    break;
		                case 22:
		                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
		                    break;
		                case 23:
		                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
		                    break;
		                case 24:
		                    this.$ = {
		                        type: 'PartialStatement',
		                        name: $$[$0 - 3],
		                        params: $$[$0 - 2],
		                        hash: $$[$0 - 1],
		                        indent: '',
		                        strip: yy.stripFlags($$[$0 - 4], $$[$0]),
		                        loc: yy.locInfo(this._$)
		                    };

		                    break;
		                case 25:
		                    this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
		                    break;
		                case 26:
		                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 4], $$[$0]) };
		                    break;
		                case 27:
		                    this.$ = $$[$0];
		                    break;
		                case 28:
		                    this.$ = $$[$0];
		                    break;
		                case 29:
		                    this.$ = {
		                        type: 'SubExpression',
		                        path: $$[$0 - 3],
		                        params: $$[$0 - 2],
		                        hash: $$[$0 - 1],
		                        loc: yy.locInfo(this._$)
		                    };

		                    break;
		                case 30:
		                    this.$ = { type: 'Hash', pairs: $$[$0], loc: yy.locInfo(this._$) };
		                    break;
		                case 31:
		                    this.$ = { type: 'HashPair', key: yy.id($$[$0 - 2]), value: $$[$0], loc: yy.locInfo(this._$) };
		                    break;
		                case 32:
		                    this.$ = yy.id($$[$0 - 1]);
		                    break;
		                case 33:
		                    this.$ = $$[$0];
		                    break;
		                case 34:
		                    this.$ = $$[$0];
		                    break;
		                case 35:
		                    this.$ = { type: 'StringLiteral', value: $$[$0], original: $$[$0], loc: yy.locInfo(this._$) };
		                    break;
		                case 36:
		                    this.$ = { type: 'NumberLiteral', value: Number($$[$0]), original: Number($$[$0]), loc: yy.locInfo(this._$) };
		                    break;
		                case 37:
		                    this.$ = { type: 'BooleanLiteral', value: $$[$0] === 'true', original: $$[$0] === 'true', loc: yy.locInfo(this._$) };
		                    break;
		                case 38:
		                    this.$ = { type: 'UndefinedLiteral', original: undefined, value: undefined, loc: yy.locInfo(this._$) };
		                    break;
		                case 39:
		                    this.$ = { type: 'NullLiteral', original: null, value: null, loc: yy.locInfo(this._$) };
		                    break;
		                case 40:
		                    this.$ = $$[$0];
		                    break;
		                case 41:
		                    this.$ = $$[$0];
		                    break;
		                case 42:
		                    this.$ = yy.preparePath(true, $$[$0], this._$);
		                    break;
		                case 43:
		                    this.$ = yy.preparePath(false, $$[$0], this._$);
		                    break;
		                case 44:
		                    $$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });this.$ = $$[$0 - 2];
		                    break;
		                case 45:
		                    this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
		                    break;
		                case 46:
		                    this.$ = [];
		                    break;
		                case 47:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 48:
		                    this.$ = [];
		                    break;
		                case 49:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 50:
		                    this.$ = [];
		                    break;
		                case 51:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 58:
		                    this.$ = [];
		                    break;
		                case 59:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 64:
		                    this.$ = [];
		                    break;
		                case 65:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 70:
		                    this.$ = [];
		                    break;
		                case 71:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 78:
		                    this.$ = [];
		                    break;
		                case 79:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 82:
		                    this.$ = [];
		                    break;
		                case 83:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 86:
		                    this.$ = [];
		                    break;
		                case 87:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 90:
		                    this.$ = [];
		                    break;
		                case 91:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 94:
		                    this.$ = [];
		                    break;
		                case 95:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 98:
		                    this.$ = [$$[$0]];
		                    break;
		                case 99:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		                case 100:
		                    this.$ = [$$[$0]];
		                    break;
		                case 101:
		                    $$[$0 - 1].push($$[$0]);
		                    break;
		            }
		        },
		        table: [{ 3: 1, 4: 2, 5: [2, 46], 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: [1, 12], 15: [1, 20], 16: 17, 19: [1, 23], 24: 15, 27: 16, 29: [1, 21], 34: [1, 22], 39: [2, 2], 44: [2, 2], 47: [2, 2], 48: [1, 13], 51: [1, 14], 55: [1, 18], 59: 19, 60: [1, 24] }, { 1: [2, 1] }, { 5: [2, 47], 14: [2, 47], 15: [2, 47], 19: [2, 47], 29: [2, 47], 34: [2, 47], 39: [2, 47], 44: [2, 47], 47: [2, 47], 48: [2, 47], 51: [2, 47], 55: [2, 47], 60: [2, 47] }, { 5: [2, 3], 14: [2, 3], 15: [2, 3], 19: [2, 3], 29: [2, 3], 34: [2, 3], 39: [2, 3], 44: [2, 3], 47: [2, 3], 48: [2, 3], 51: [2, 3], 55: [2, 3], 60: [2, 3] }, { 5: [2, 4], 14: [2, 4], 15: [2, 4], 19: [2, 4], 29: [2, 4], 34: [2, 4], 39: [2, 4], 44: [2, 4], 47: [2, 4], 48: [2, 4], 51: [2, 4], 55: [2, 4], 60: [2, 4] }, { 5: [2, 5], 14: [2, 5], 15: [2, 5], 19: [2, 5], 29: [2, 5], 34: [2, 5], 39: [2, 5], 44: [2, 5], 47: [2, 5], 48: [2, 5], 51: [2, 5], 55: [2, 5], 60: [2, 5] }, { 5: [2, 6], 14: [2, 6], 15: [2, 6], 19: [2, 6], 29: [2, 6], 34: [2, 6], 39: [2, 6], 44: [2, 6], 47: [2, 6], 48: [2, 6], 51: [2, 6], 55: [2, 6], 60: [2, 6] }, { 5: [2, 7], 14: [2, 7], 15: [2, 7], 19: [2, 7], 29: [2, 7], 34: [2, 7], 39: [2, 7], 44: [2, 7], 47: [2, 7], 48: [2, 7], 51: [2, 7], 55: [2, 7], 60: [2, 7] }, { 5: [2, 8], 14: [2, 8], 15: [2, 8], 19: [2, 8], 29: [2, 8], 34: [2, 8], 39: [2, 8], 44: [2, 8], 47: [2, 8], 48: [2, 8], 51: [2, 8], 55: [2, 8], 60: [2, 8] }, { 5: [2, 9], 14: [2, 9], 15: [2, 9], 19: [2, 9], 29: [2, 9], 34: [2, 9], 39: [2, 9], 44: [2, 9], 47: [2, 9], 48: [2, 9], 51: [2, 9], 55: [2, 9], 60: [2, 9] }, { 20: 25, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 36, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 37, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 4: 38, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 15: [2, 48], 17: 39, 18: [2, 48] }, { 20: 41, 56: 40, 64: 42, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 44, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 5: [2, 10], 14: [2, 10], 15: [2, 10], 18: [2, 10], 19: [2, 10], 29: [2, 10], 34: [2, 10], 39: [2, 10], 44: [2, 10], 47: [2, 10], 48: [2, 10], 51: [2, 10], 55: [2, 10], 60: [2, 10] }, { 20: 45, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 46, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 47, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 41, 56: 48, 64: 42, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [2, 78], 49: 49, 65: [2, 78], 72: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78] }, { 23: [2, 33], 33: [2, 33], 54: [2, 33], 65: [2, 33], 68: [2, 33], 72: [2, 33], 75: [2, 33], 80: [2, 33], 81: [2, 33], 82: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33] }, { 23: [2, 34], 33: [2, 34], 54: [2, 34], 65: [2, 34], 68: [2, 34], 72: [2, 34], 75: [2, 34], 80: [2, 34], 81: [2, 34], 82: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34] }, { 23: [2, 35], 33: [2, 35], 54: [2, 35], 65: [2, 35], 68: [2, 35], 72: [2, 35], 75: [2, 35], 80: [2, 35], 81: [2, 35], 82: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35] }, { 23: [2, 36], 33: [2, 36], 54: [2, 36], 65: [2, 36], 68: [2, 36], 72: [2, 36], 75: [2, 36], 80: [2, 36], 81: [2, 36], 82: [2, 36], 83: [2, 36], 84: [2, 36], 85: [2, 36] }, { 23: [2, 37], 33: [2, 37], 54: [2, 37], 65: [2, 37], 68: [2, 37], 72: [2, 37], 75: [2, 37], 80: [2, 37], 81: [2, 37], 82: [2, 37], 83: [2, 37], 84: [2, 37], 85: [2, 37] }, { 23: [2, 38], 33: [2, 38], 54: [2, 38], 65: [2, 38], 68: [2, 38], 72: [2, 38], 75: [2, 38], 80: [2, 38], 81: [2, 38], 82: [2, 38], 83: [2, 38], 84: [2, 38], 85: [2, 38] }, { 23: [2, 39], 33: [2, 39], 54: [2, 39], 65: [2, 39], 68: [2, 39], 72: [2, 39], 75: [2, 39], 80: [2, 39], 81: [2, 39], 82: [2, 39], 83: [2, 39], 84: [2, 39], 85: [2, 39] }, { 23: [2, 43], 33: [2, 43], 54: [2, 43], 65: [2, 43], 68: [2, 43], 72: [2, 43], 75: [2, 43], 80: [2, 43], 81: [2, 43], 82: [2, 43], 83: [2, 43], 84: [2, 43], 85: [2, 43], 87: [1, 50] }, { 72: [1, 35], 86: 51 }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 52: 52, 54: [2, 82], 65: [2, 82], 72: [2, 82], 80: [2, 82], 81: [2, 82], 82: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82] }, { 25: 53, 38: 55, 39: [1, 57], 43: 56, 44: [1, 58], 45: 54, 47: [2, 54] }, { 28: 59, 43: 60, 44: [1, 58], 47: [2, 56] }, { 13: 62, 15: [1, 20], 18: [1, 61] }, { 33: [2, 86], 57: 63, 65: [2, 86], 72: [2, 86], 80: [2, 86], 81: [2, 86], 82: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86] }, { 33: [2, 40], 65: [2, 40], 72: [2, 40], 80: [2, 40], 81: [2, 40], 82: [2, 40], 83: [2, 40], 84: [2, 40], 85: [2, 40] }, { 33: [2, 41], 65: [2, 41], 72: [2, 41], 80: [2, 41], 81: [2, 41], 82: [2, 41], 83: [2, 41], 84: [2, 41], 85: [2, 41] }, { 20: 64, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 65, 47: [1, 66] }, { 30: 67, 33: [2, 58], 65: [2, 58], 72: [2, 58], 75: [2, 58], 80: [2, 58], 81: [2, 58], 82: [2, 58], 83: [2, 58], 84: [2, 58], 85: [2, 58] }, { 33: [2, 64], 35: 68, 65: [2, 64], 72: [2, 64], 75: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 83: [2, 64], 84: [2, 64], 85: [2, 64] }, { 21: 69, 23: [2, 50], 65: [2, 50], 72: [2, 50], 80: [2, 50], 81: [2, 50], 82: [2, 50], 83: [2, 50], 84: [2, 50], 85: [2, 50] }, { 33: [2, 90], 61: 70, 65: [2, 90], 72: [2, 90], 80: [2, 90], 81: [2, 90], 82: [2, 90], 83: [2, 90], 84: [2, 90], 85: [2, 90] }, { 20: 74, 33: [2, 80], 50: 71, 63: 72, 64: 75, 65: [1, 43], 69: 73, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 72: [1, 79] }, { 23: [2, 42], 33: [2, 42], 54: [2, 42], 65: [2, 42], 68: [2, 42], 72: [2, 42], 75: [2, 42], 80: [2, 42], 81: [2, 42], 82: [2, 42], 83: [2, 42], 84: [2, 42], 85: [2, 42], 87: [1, 50] }, { 20: 74, 53: 80, 54: [2, 84], 63: 81, 64: 75, 65: [1, 43], 69: 82, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 83, 47: [1, 66] }, { 47: [2, 55] }, { 4: 84, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 47: [2, 20] }, { 20: 85, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 86, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 26: 87, 47: [1, 66] }, { 47: [2, 57] }, { 5: [2, 11], 14: [2, 11], 15: [2, 11], 19: [2, 11], 29: [2, 11], 34: [2, 11], 39: [2, 11], 44: [2, 11], 47: [2, 11], 48: [2, 11], 51: [2, 11], 55: [2, 11], 60: [2, 11] }, { 15: [2, 49], 18: [2, 49] }, { 20: 74, 33: [2, 88], 58: 88, 63: 89, 64: 75, 65: [1, 43], 69: 90, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 65: [2, 94], 66: 91, 68: [2, 94], 72: [2, 94], 80: [2, 94], 81: [2, 94], 82: [2, 94], 83: [2, 94], 84: [2, 94], 85: [2, 94] }, { 5: [2, 25], 14: [2, 25], 15: [2, 25], 19: [2, 25], 29: [2, 25], 34: [2, 25], 39: [2, 25], 44: [2, 25], 47: [2, 25], 48: [2, 25], 51: [2, 25], 55: [2, 25], 60: [2, 25] }, { 20: 92, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 31: 93, 33: [2, 60], 63: 94, 64: 75, 65: [1, 43], 69: 95, 70: 76, 71: 77, 72: [1, 78], 75: [2, 60], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 33: [2, 66], 36: 96, 63: 97, 64: 75, 65: [1, 43], 69: 98, 70: 76, 71: 77, 72: [1, 78], 75: [2, 66], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 22: 99, 23: [2, 52], 63: 100, 64: 75, 65: [1, 43], 69: 101, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 33: [2, 92], 62: 102, 63: 103, 64: 75, 65: [1, 43], 69: 104, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 105] }, { 33: [2, 79], 65: [2, 79], 72: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79] }, { 33: [2, 81] }, { 23: [2, 27], 33: [2, 27], 54: [2, 27], 65: [2, 27], 68: [2, 27], 72: [2, 27], 75: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27] }, { 23: [2, 28], 33: [2, 28], 54: [2, 28], 65: [2, 28], 68: [2, 28], 72: [2, 28], 75: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28] }, { 23: [2, 30], 33: [2, 30], 54: [2, 30], 68: [2, 30], 71: 106, 72: [1, 107], 75: [2, 30] }, { 23: [2, 98], 33: [2, 98], 54: [2, 98], 68: [2, 98], 72: [2, 98], 75: [2, 98] }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 73: [1, 108], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 23: [2, 44], 33: [2, 44], 54: [2, 44], 65: [2, 44], 68: [2, 44], 72: [2, 44], 75: [2, 44], 80: [2, 44], 81: [2, 44], 82: [2, 44], 83: [2, 44], 84: [2, 44], 85: [2, 44], 87: [2, 44] }, { 54: [1, 109] }, { 54: [2, 83], 65: [2, 83], 72: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83] }, { 54: [2, 85] }, { 5: [2, 13], 14: [2, 13], 15: [2, 13], 19: [2, 13], 29: [2, 13], 34: [2, 13], 39: [2, 13], 44: [2, 13], 47: [2, 13], 48: [2, 13], 51: [2, 13], 55: [2, 13], 60: [2, 13] }, { 38: 55, 39: [1, 57], 43: 56, 44: [1, 58], 45: 111, 46: 110, 47: [2, 76] }, { 33: [2, 70], 40: 112, 65: [2, 70], 72: [2, 70], 75: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70] }, { 47: [2, 18] }, { 5: [2, 14], 14: [2, 14], 15: [2, 14], 19: [2, 14], 29: [2, 14], 34: [2, 14], 39: [2, 14], 44: [2, 14], 47: [2, 14], 48: [2, 14], 51: [2, 14], 55: [2, 14], 60: [2, 14] }, { 33: [1, 113] }, { 33: [2, 87], 65: [2, 87], 72: [2, 87], 80: [2, 87], 81: [2, 87], 82: [2, 87], 83: [2, 87], 84: [2, 87], 85: [2, 87] }, { 33: [2, 89] }, { 20: 74, 63: 115, 64: 75, 65: [1, 43], 67: 114, 68: [2, 96], 69: 116, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 117] }, { 32: 118, 33: [2, 62], 74: 119, 75: [1, 120] }, { 33: [2, 59], 65: [2, 59], 72: [2, 59], 75: [2, 59], 80: [2, 59], 81: [2, 59], 82: [2, 59], 83: [2, 59], 84: [2, 59], 85: [2, 59] }, { 33: [2, 61], 75: [2, 61] }, { 33: [2, 68], 37: 121, 74: 122, 75: [1, 120] }, { 33: [2, 65], 65: [2, 65], 72: [2, 65], 75: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 83: [2, 65], 84: [2, 65], 85: [2, 65] }, { 33: [2, 67], 75: [2, 67] }, { 23: [1, 123] }, { 23: [2, 51], 65: [2, 51], 72: [2, 51], 80: [2, 51], 81: [2, 51], 82: [2, 51], 83: [2, 51], 84: [2, 51], 85: [2, 51] }, { 23: [2, 53] }, { 33: [1, 124] }, { 33: [2, 91], 65: [2, 91], 72: [2, 91], 80: [2, 91], 81: [2, 91], 82: [2, 91], 83: [2, 91], 84: [2, 91], 85: [2, 91] }, { 33: [2, 93] }, { 5: [2, 22], 14: [2, 22], 15: [2, 22], 19: [2, 22], 29: [2, 22], 34: [2, 22], 39: [2, 22], 44: [2, 22], 47: [2, 22], 48: [2, 22], 51: [2, 22], 55: [2, 22], 60: [2, 22] }, { 23: [2, 99], 33: [2, 99], 54: [2, 99], 68: [2, 99], 72: [2, 99], 75: [2, 99] }, { 73: [1, 108] }, { 20: 74, 63: 125, 64: 75, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 23], 14: [2, 23], 15: [2, 23], 19: [2, 23], 29: [2, 23], 34: [2, 23], 39: [2, 23], 44: [2, 23], 47: [2, 23], 48: [2, 23], 51: [2, 23], 55: [2, 23], 60: [2, 23] }, { 47: [2, 19] }, { 47: [2, 77] }, { 20: 74, 33: [2, 72], 41: 126, 63: 127, 64: 75, 65: [1, 43], 69: 128, 70: 76, 71: 77, 72: [1, 78], 75: [2, 72], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 24], 14: [2, 24], 15: [2, 24], 19: [2, 24], 29: [2, 24], 34: [2, 24], 39: [2, 24], 44: [2, 24], 47: [2, 24], 48: [2, 24], 51: [2, 24], 55: [2, 24], 60: [2, 24] }, { 68: [1, 129] }, { 65: [2, 95], 68: [2, 95], 72: [2, 95], 80: [2, 95], 81: [2, 95], 82: [2, 95], 83: [2, 95], 84: [2, 95], 85: [2, 95] }, { 68: [2, 97] }, { 5: [2, 21], 14: [2, 21], 15: [2, 21], 19: [2, 21], 29: [2, 21], 34: [2, 21], 39: [2, 21], 44: [2, 21], 47: [2, 21], 48: [2, 21], 51: [2, 21], 55: [2, 21], 60: [2, 21] }, { 33: [1, 130] }, { 33: [2, 63] }, { 72: [1, 132], 76: 131 }, { 33: [1, 133] }, { 33: [2, 69] }, { 15: [2, 12], 18: [2, 12] }, { 14: [2, 26], 15: [2, 26], 19: [2, 26], 29: [2, 26], 34: [2, 26], 47: [2, 26], 48: [2, 26], 51: [2, 26], 55: [2, 26], 60: [2, 26] }, { 23: [2, 31], 33: [2, 31], 54: [2, 31], 68: [2, 31], 72: [2, 31], 75: [2, 31] }, { 33: [2, 74], 42: 134, 74: 135, 75: [1, 120] }, { 33: [2, 71], 65: [2, 71], 72: [2, 71], 75: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71] }, { 33: [2, 73], 75: [2, 73] }, { 23: [2, 29], 33: [2, 29], 54: [2, 29], 65: [2, 29], 68: [2, 29], 72: [2, 29], 75: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29] }, { 14: [2, 15], 15: [2, 15], 19: [2, 15], 29: [2, 15], 34: [2, 15], 39: [2, 15], 44: [2, 15], 47: [2, 15], 48: [2, 15], 51: [2, 15], 55: [2, 15], 60: [2, 15] }, { 72: [1, 137], 77: [1, 136] }, { 72: [2, 100], 77: [2, 100] }, { 14: [2, 16], 15: [2, 16], 19: [2, 16], 29: [2, 16], 34: [2, 16], 44: [2, 16], 47: [2, 16], 48: [2, 16], 51: [2, 16], 55: [2, 16], 60: [2, 16] }, { 33: [1, 138] }, { 33: [2, 75] }, { 33: [2, 32] }, { 72: [2, 101], 77: [2, 101] }, { 14: [2, 17], 15: [2, 17], 19: [2, 17], 29: [2, 17], 34: [2, 17], 39: [2, 17], 44: [2, 17], 47: [2, 17], 48: [2, 17], 51: [2, 17], 55: [2, 17], 60: [2, 17] }],
		        defaultActions: { 4: [2, 1], 54: [2, 55], 56: [2, 20], 60: [2, 57], 73: [2, 81], 82: [2, 85], 86: [2, 18], 90: [2, 89], 101: [2, 53], 104: [2, 93], 110: [2, 19], 111: [2, 77], 116: [2, 97], 119: [2, 63], 122: [2, 69], 135: [2, 75], 136: [2, 32] },
		        parseError: function parseError(str, hash) {
		            throw new Error(str);
		        },
		        parse: function parse(input) {
		            var self = this,
		                stack = [0],
		                vstack = [null],
		                lstack = [],
		                table = this.table,
		                yytext = "",
		                yylineno = 0,
		                yyleng = 0;
		            this.lexer.setInput(input);
		            this.lexer.yy = this.yy;
		            this.yy.lexer = this.lexer;
		            this.yy.parser = this;
		            if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
		            var yyloc = this.lexer.yylloc;
		            lstack.push(yyloc);
		            var ranges = this.lexer.options && this.lexer.options.ranges;
		            if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
		            function lex() {
		                var token;
		                token = self.lexer.lex() || 1;
		                if (typeof token !== "number") {
		                    token = self.symbols_[token] || token;
		                }
		                return token;
		            }
		            var symbol,
		                state,
		                action,
		                r,
		                yyval = {},
		                p,
		                len,
		                newState,
		                expected;
		            while (true) {
		                state = stack[stack.length - 1];
		                if (this.defaultActions[state]) {
		                    action = this.defaultActions[state];
		                } else {
		                    if (symbol === null || typeof symbol == "undefined") {
		                        symbol = lex();
		                    }
		                    action = table[state] && table[state][symbol];
		                }
		                if (typeof action === "undefined" || !action.length || !action[0]) {
		                    var errStr = "";
		                    {
		                        expected = [];
		                        for (p in table[state]) if (this.terminals_[p] && p > 2) {
		                            expected.push("'" + this.terminals_[p] + "'");
		                        }
		                        if (this.lexer.showPosition) {
		                            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
		                        } else {
		                            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
		                        }
		                        this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
		                    }
		                }
		                if (action[0] instanceof Array && action.length > 1) {
		                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
		                }
		                switch (action[0]) {
		                    case 1:
		                        stack.push(symbol);
		                        vstack.push(this.lexer.yytext);
		                        lstack.push(this.lexer.yylloc);
		                        stack.push(action[1]);
		                        symbol = null;
		                        {
		                            yyleng = this.lexer.yyleng;
		                            yytext = this.lexer.yytext;
		                            yylineno = this.lexer.yylineno;
		                            yyloc = this.lexer.yylloc;
		                        }
		                        break;
		                    case 2:
		                        len = this.productions_[action[1]][1];
		                        yyval.$ = vstack[vstack.length - len];
		                        yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
		                        if (ranges) {
		                            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
		                        }
		                        r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
		                        if (typeof r !== "undefined") {
		                            return r;
		                        }
		                        if (len) {
		                            stack = stack.slice(0, -1 * len * 2);
		                            vstack = vstack.slice(0, -1 * len);
		                            lstack = lstack.slice(0, -1 * len);
		                        }
		                        stack.push(this.productions_[action[1]][0]);
		                        vstack.push(yyval.$);
		                        lstack.push(yyval._$);
		                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
		                        stack.push(newState);
		                        break;
		                    case 3:
		                        return true;
		                }
		            }
		            return true;
		        }
		    };
		    /* Jison generated lexer */
		    var lexer = (function () {
		        var lexer = { EOF: 1,
		            parseError: function parseError(str, hash) {
		                if (this.yy.parser) {
		                    this.yy.parser.parseError(str, hash);
		                } else {
		                    throw new Error(str);
		                }
		            },
		            setInput: function setInput(input) {
		                this._input = input;
		                this._more = this._less = this.done = false;
		                this.yylineno = this.yyleng = 0;
		                this.yytext = this.matched = this.match = '';
		                this.conditionStack = ['INITIAL'];
		                this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
		                if (this.options.ranges) this.yylloc.range = [0, 0];
		                this.offset = 0;
		                return this;
		            },
		            input: function input() {
		                var ch = this._input[0];
		                this.yytext += ch;
		                this.yyleng++;
		                this.offset++;
		                this.match += ch;
		                this.matched += ch;
		                var lines = ch.match(/(?:\r\n?|\n).*/g);
		                if (lines) {
		                    this.yylineno++;
		                    this.yylloc.last_line++;
		                } else {
		                    this.yylloc.last_column++;
		                }
		                if (this.options.ranges) this.yylloc.range[1]++;

		                this._input = this._input.slice(1);
		                return ch;
		            },
		            unput: function unput(ch) {
		                var len = ch.length;
		                var lines = ch.split(/(?:\r\n?|\n)/g);

		                this._input = ch + this._input;
		                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
		                //this.yyleng -= len;
		                this.offset -= len;
		                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
		                this.match = this.match.substr(0, this.match.length - 1);
		                this.matched = this.matched.substr(0, this.matched.length - 1);

		                if (lines.length - 1) this.yylineno -= lines.length - 1;
		                var r = this.yylloc.range;

		                this.yylloc = { first_line: this.yylloc.first_line,
		                    last_line: this.yylineno + 1,
		                    first_column: this.yylloc.first_column,
		                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
		                };

		                if (this.options.ranges) {
		                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
		                }
		                return this;
		            },
		            more: function more() {
		                this._more = true;
		                return this;
		            },
		            less: function less(n) {
		                this.unput(this.match.slice(n));
		            },
		            pastInput: function pastInput() {
		                var past = this.matched.substr(0, this.matched.length - this.match.length);
		                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
		            },
		            upcomingInput: function upcomingInput() {
		                var next = this.match;
		                if (next.length < 20) {
		                    next += this._input.substr(0, 20 - next.length);
		                }
		                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
		            },
		            showPosition: function showPosition() {
		                var pre = this.pastInput();
		                var c = new Array(pre.length + 1).join("-");
		                return pre + this.upcomingInput() + "\n" + c + "^";
		            },
		            next: function next() {
		                if (this.done) {
		                    return this.EOF;
		                }
		                if (!this._input) this.done = true;

		                var token, match, tempMatch, index, lines;
		                if (!this._more) {
		                    this.yytext = '';
		                    this.match = '';
		                }
		                var rules = this._currentRules();
		                for (var i = 0; i < rules.length; i++) {
		                    tempMatch = this._input.match(this.rules[rules[i]]);
		                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
		                        match = tempMatch;
		                        index = i;
		                        if (!this.options.flex) break;
		                    }
		                }
		                if (match) {
		                    lines = match[0].match(/(?:\r\n?|\n).*/g);
		                    if (lines) this.yylineno += lines.length;
		                    this.yylloc = { first_line: this.yylloc.last_line,
		                        last_line: this.yylineno + 1,
		                        first_column: this.yylloc.last_column,
		                        last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
		                    this.yytext += match[0];
		                    this.match += match[0];
		                    this.matches = match;
		                    this.yyleng = this.yytext.length;
		                    if (this.options.ranges) {
		                        this.yylloc.range = [this.offset, this.offset += this.yyleng];
		                    }
		                    this._more = false;
		                    this._input = this._input.slice(match[0].length);
		                    this.matched += match[0];
		                    token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
		                    if (this.done && this._input) this.done = false;
		                    if (token) return token;else return;
		                }
		                if (this._input === "") {
		                    return this.EOF;
		                } else {
		                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), { text: "", token: null, line: this.yylineno });
		                }
		            },
		            lex: function lex() {
		                var r = this.next();
		                if (typeof r !== 'undefined') {
		                    return r;
		                } else {
		                    return this.lex();
		                }
		            },
		            begin: function begin(condition) {
		                this.conditionStack.push(condition);
		            },
		            popState: function popState() {
		                return this.conditionStack.pop();
		            },
		            _currentRules: function _currentRules() {
		                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
		            },
		            topState: function topState() {
		                return this.conditionStack[this.conditionStack.length - 2];
		            },
		            pushState: function begin(condition) {
		                this.begin(condition);
		            } };
		        lexer.options = {};
		        lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

		            function strip(start, end) {
		                return yy_.yytext = yy_.yytext.substring(start, yy_.yyleng - end + start);
		            }
		            switch ($avoiding_name_collisions) {
		                case 0:
		                    if (yy_.yytext.slice(-2) === "\\\\") {
		                        strip(0, 1);
		                        this.begin("mu");
		                    } else if (yy_.yytext.slice(-1) === "\\") {
		                        strip(0, 1);
		                        this.begin("emu");
		                    } else {
		                        this.begin("mu");
		                    }
		                    if (yy_.yytext) return 15;

		                    break;
		                case 1:
		                    return 15;
		                case 2:
		                    this.popState();
		                    return 15;
		                case 3:
		                    this.begin('raw');return 15;
		                case 4:
		                    this.popState();
		                    // Should be using `this.topState()` below, but it currently
		                    // returns the second top instead of the first top. Opened an
		                    // issue about it at https://github.com/zaach/jison/issues/291
		                    if (this.conditionStack[this.conditionStack.length - 1] === 'raw') {
		                        return 15;
		                    } else {
		                        strip(5, 9);
		                        return 'END_RAW_BLOCK';
		                    }
		                case 5:
		                    return 15;
		                case 6:
		                    this.popState();
		                    return 14;
		                case 7:
		                    return 65;
		                case 8:
		                    return 68;
		                case 9:
		                    return 19;
		                case 10:
		                    this.popState();
		                    this.begin('raw');
		                    return 23;
		                case 11:
		                    return 55;
		                case 12:
		                    return 60;
		                case 13:
		                    return 29;
		                case 14:
		                    return 47;
		                case 15:
		                    this.popState();return 44;
		                case 16:
		                    this.popState();return 44;
		                case 17:
		                    return 34;
		                case 18:
		                    return 39;
		                case 19:
		                    return 51;
		                case 20:
		                    return 48;
		                case 21:
		                    this.unput(yy_.yytext);
		                    this.popState();
		                    this.begin('com');

		                    break;
		                case 22:
		                    this.popState();
		                    return 14;
		                case 23:
		                    return 48;
		                case 24:
		                    return 73;
		                case 25:
		                    return 72;
		                case 26:
		                    return 72;
		                case 27:
		                    return 87;
		                case 28:
		                    // ignore whitespace
		                    break;
		                case 29:
		                    this.popState();return 54;
		                case 30:
		                    this.popState();return 33;
		                case 31:
		                    yy_.yytext = strip(1, 2).replace(/\\"/g, '"');return 80;
		                case 32:
		                    yy_.yytext = strip(1, 2).replace(/\\'/g, "'");return 80;
		                case 33:
		                    return 85;
		                case 34:
		                    return 82;
		                case 35:
		                    return 82;
		                case 36:
		                    return 83;
		                case 37:
		                    return 84;
		                case 38:
		                    return 81;
		                case 39:
		                    return 75;
		                case 40:
		                    return 77;
		                case 41:
		                    return 72;
		                case 42:
		                    yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');return 72;
		                case 43:
		                    return 'INVALID';
		                case 44:
		                    return 5;
		            }
		        };
		        lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]+?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/];
		        lexer.conditions = { "mu": { "rules": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], "inclusive": false }, "emu": { "rules": [2], "inclusive": false }, "com": { "rules": [6], "inclusive": false }, "raw": { "rules": [3, 4, 5], "inclusive": false }, "INITIAL": { "rules": [0, 1, 44], "inclusive": true } };
		        return lexer;
		    })();
		    parser.lexer = lexer;
		    function Parser() {
		        this.yy = {};
		    }Parser.prototype = parser;parser.Parser = Parser;
		    return new Parser();
		})();exports["default"] = handlebars;
		module.exports = exports["default"];

	/***/ }),
	/* 87 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _visitor = __webpack_require__(88);

		var _visitor2 = _interopRequireDefault(_visitor);

		function WhitespaceControl() {
		  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		  this.options = options;
		}
		WhitespaceControl.prototype = new _visitor2['default']();

		WhitespaceControl.prototype.Program = function (program) {
		  var doStandalone = !this.options.ignoreStandalone;

		  var isRoot = !this.isRootSeen;
		  this.isRootSeen = true;

		  var body = program.body;
		  for (var i = 0, l = body.length; i < l; i++) {
		    var current = body[i],
		        strip = this.accept(current);

		    if (!strip) {
		      continue;
		    }

		    var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
		        _isNextWhitespace = isNextWhitespace(body, i, isRoot),
		        openStandalone = strip.openStandalone && _isPrevWhitespace,
		        closeStandalone = strip.closeStandalone && _isNextWhitespace,
		        inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

		    if (strip.close) {
		      omitRight(body, i, true);
		    }
		    if (strip.open) {
		      omitLeft(body, i, true);
		    }

		    if (doStandalone && inlineStandalone) {
		      omitRight(body, i);

		      if (omitLeft(body, i)) {
		        // If we are on a standalone node, save the indent info for partials
		        if (current.type === 'PartialStatement') {
		          // Pull out the whitespace from the final line
		          current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
		        }
		      }
		    }
		    if (doStandalone && openStandalone) {
		      omitRight((current.program || current.inverse).body);

		      // Strip out the previous content node if it's whitespace only
		      omitLeft(body, i);
		    }
		    if (doStandalone && closeStandalone) {
		      // Always strip the next node
		      omitRight(body, i);

		      omitLeft((current.inverse || current.program).body);
		    }
		  }

		  return program;
		};

		WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function (block) {
		  this.accept(block.program);
		  this.accept(block.inverse);

		  // Find the inverse program that is involed with whitespace stripping.
		  var program = block.program || block.inverse,
		      inverse = block.program && block.inverse,
		      firstInverse = inverse,
		      lastInverse = inverse;

		  if (inverse && inverse.chained) {
		    firstInverse = inverse.body[0].program;

		    // Walk the inverse chain to find the last inverse that is actually in the chain.
		    while (lastInverse.chained) {
		      lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
		    }
		  }

		  var strip = {
		    open: block.openStrip.open,
		    close: block.closeStrip.close,

		    // Determine the standalone candiacy. Basically flag our content as being possibly standalone
		    // so our parent can determine if we actually are standalone
		    openStandalone: isNextWhitespace(program.body),
		    closeStandalone: isPrevWhitespace((firstInverse || program).body)
		  };

		  if (block.openStrip.close) {
		    omitRight(program.body, null, true);
		  }

		  if (inverse) {
		    var inverseStrip = block.inverseStrip;

		    if (inverseStrip.open) {
		      omitLeft(program.body, null, true);
		    }

		    if (inverseStrip.close) {
		      omitRight(firstInverse.body, null, true);
		    }
		    if (block.closeStrip.open) {
		      omitLeft(lastInverse.body, null, true);
		    }

		    // Find standalone else statments
		    if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
		      omitLeft(program.body);
		      omitRight(firstInverse.body);
		    }
		  } else if (block.closeStrip.open) {
		    omitLeft(program.body, null, true);
		  }

		  return strip;
		};

		WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function (mustache) {
		  return mustache.strip;
		};

		WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
		  /* istanbul ignore next */
		  var strip = node.strip || {};
		  return {
		    inlineStandalone: true,
		    open: strip.open,
		    close: strip.close
		  };
		};

		function isPrevWhitespace(body, i, isRoot) {
		  if (i === undefined) {
		    i = body.length;
		  }

		  // Nodes that end with newlines are considered whitespace (but are special
		  // cased for strip operations)
		  var prev = body[i - 1],
		      sibling = body[i - 2];
		  if (!prev) {
		    return isRoot;
		  }

		  if (prev.type === 'ContentStatement') {
		    return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
		  }
		}
		function isNextWhitespace(body, i, isRoot) {
		  if (i === undefined) {
		    i = -1;
		  }

		  var next = body[i + 1],
		      sibling = body[i + 2];
		  if (!next) {
		    return isRoot;
		  }

		  if (next.type === 'ContentStatement') {
		    return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
		  }
		}

		// Marks the node to the right of the position as omitted.
		// I.e. {{foo}}' ' will mark the ' ' node as omitted.
		//
		// If i is undefined, then the first child will be marked as such.
		//
		// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
		// content is met.
		function omitRight(body, i, multiple) {
		  var current = body[i == null ? 0 : i + 1];
		  if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
		    return;
		  }

		  var original = current.value;
		  current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
		  current.rightStripped = current.value !== original;
		}

		// Marks the node to the left of the position as omitted.
		// I.e. ' '{{foo}} will mark the ' ' node as omitted.
		//
		// If i is undefined then the last child will be marked as such.
		//
		// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
		// content is met.
		function omitLeft(body, i, multiple) {
		  var current = body[i == null ? body.length - 1 : i - 1];
		  if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
		    return;
		  }

		  // We omit the last node if it's whitespace only and not preceded by a non-content node.
		  var original = current.value;
		  current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
		  current.leftStripped = current.value !== original;
		  return current.leftStripped;
		}

		exports['default'] = WhitespaceControl;
		module.exports = exports['default'];

	/***/ }),
	/* 88 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		function Visitor() {
		  this.parents = [];
		}

		Visitor.prototype = {
		  constructor: Visitor,
		  mutating: false,

		  // Visits a given value. If mutating, will replace the value if necessary.
		  acceptKey: function acceptKey(node, name) {
		    var value = this.accept(node[name]);
		    if (this.mutating) {
		      // Hacky sanity check: This may have a few false positives for type for the helper
		      // methods but will generally do the right thing without a lot of overhead.
		      if (value && !Visitor.prototype[value.type]) {
		        throw new _exception2['default']('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
		      }
		      node[name] = value;
		    }
		  },

		  // Performs an accept operation with added sanity check to ensure
		  // required keys are not removed.
		  acceptRequired: function acceptRequired(node, name) {
		    this.acceptKey(node, name);

		    if (!node[name]) {
		      throw new _exception2['default'](node.type + ' requires ' + name);
		    }
		  },

		  // Traverses a given array. If mutating, empty respnses will be removed
		  // for child elements.
		  acceptArray: function acceptArray(array) {
		    for (var i = 0, l = array.length; i < l; i++) {
		      this.acceptKey(array, i);

		      if (!array[i]) {
		        array.splice(i, 1);
		        i--;
		        l--;
		      }
		    }
		  },

		  accept: function accept(object) {
		    if (!object) {
		      return;
		    }

		    /* istanbul ignore next: Sanity code */
		    if (!this[object.type]) {
		      throw new _exception2['default']('Unknown type: ' + object.type, object);
		    }

		    if (this.current) {
		      this.parents.unshift(this.current);
		    }
		    this.current = object;

		    var ret = this[object.type](object);

		    this.current = this.parents.shift();

		    if (!this.mutating || ret) {
		      return ret;
		    } else if (ret !== false) {
		      return object;
		    }
		  },

		  Program: function Program(program) {
		    this.acceptArray(program.body);
		  },

		  MustacheStatement: visitSubExpression,
		  Decorator: visitSubExpression,

		  BlockStatement: visitBlock,
		  DecoratorBlock: visitBlock,

		  PartialStatement: visitPartial,
		  PartialBlockStatement: function PartialBlockStatement(partial) {
		    visitPartial.call(this, partial);

		    this.acceptKey(partial, 'program');
		  },

		  ContentStatement: function ContentStatement() /* content */{},
		  CommentStatement: function CommentStatement() /* comment */{},

		  SubExpression: visitSubExpression,

		  PathExpression: function PathExpression() /* path */{},

		  StringLiteral: function StringLiteral() /* string */{},
		  NumberLiteral: function NumberLiteral() /* number */{},
		  BooleanLiteral: function BooleanLiteral() /* bool */{},
		  UndefinedLiteral: function UndefinedLiteral() /* literal */{},
		  NullLiteral: function NullLiteral() /* literal */{},

		  Hash: function Hash(hash) {
		    this.acceptArray(hash.pairs);
		  },
		  HashPair: function HashPair(pair) {
		    this.acceptRequired(pair, 'value');
		  }
		};

		function visitSubExpression(mustache) {
		  this.acceptRequired(mustache, 'path');
		  this.acceptArray(mustache.params);
		  this.acceptKey(mustache, 'hash');
		}
		function visitBlock(block) {
		  visitSubExpression.call(this, block);

		  this.acceptKey(block, 'program');
		  this.acceptKey(block, 'inverse');
		}
		function visitPartial(partial) {
		  this.acceptRequired(partial, 'name');
		  this.acceptArray(partial.params);
		  this.acceptKey(partial, 'hash');
		}

		exports['default'] = Visitor;
		module.exports = exports['default'];

	/***/ }),
	/* 89 */
	/***/ (function(module, exports, __webpack_require__) {

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;
		exports.SourceLocation = SourceLocation;
		exports.id = id;
		exports.stripFlags = stripFlags;
		exports.stripComment = stripComment;
		exports.preparePath = preparePath;
		exports.prepareMustache = prepareMustache;
		exports.prepareRawBlock = prepareRawBlock;
		exports.prepareBlock = prepareBlock;
		exports.prepareProgram = prepareProgram;
		exports.preparePartialBlock = preparePartialBlock;

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		function validateClose(open, close) {
		  close = close.path ? close.path.original : close;

		  if (open.path.original !== close) {
		    var errorNode = { loc: open.path.loc };

		    throw new _exception2['default'](open.path.original + " doesn't match " + close, errorNode);
		  }
		}

		function SourceLocation(source, locInfo) {
		  this.source = source;
		  this.start = {
		    line: locInfo.first_line,
		    column: locInfo.first_column
		  };
		  this.end = {
		    line: locInfo.last_line,
		    column: locInfo.last_column
		  };
		}

		function id(token) {
		  if (/^\[.*\]$/.test(token)) {
		    return token.substring(1, token.length - 1);
		  } else {
		    return token;
		  }
		}

		function stripFlags(open, close) {
		  return {
		    open: open.charAt(2) === '~',
		    close: close.charAt(close.length - 3) === '~'
		  };
		}

		function stripComment(comment) {
		  return comment.replace(/^\{\{~?!-?-?/, '').replace(/-?-?~?\}\}$/, '');
		}

		function preparePath(data, parts, loc) {
		  loc = this.locInfo(loc);

		  var original = data ? '@' : '',
		      dig = [],
		      depth = 0;

		  for (var i = 0, l = parts.length; i < l; i++) {
		    var part = parts[i].part,

		    // If we have [] syntax then we do not treat path references as operators,
		    // i.e. foo.[this] resolves to approximately context.foo['this']
		    isLiteral = parts[i].original !== part;
		    original += (parts[i].separator || '') + part;

		    if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
		      if (dig.length > 0) {
		        throw new _exception2['default']('Invalid path: ' + original, { loc: loc });
		      } else if (part === '..') {
		        depth++;
		      }
		    } else {
		      dig.push(part);
		    }
		  }

		  return {
		    type: 'PathExpression',
		    data: data,
		    depth: depth,
		    parts: dig,
		    original: original,
		    loc: loc
		  };
		}

		function prepareMustache(path, params, hash, open, strip, locInfo) {
		  // Must use charAt to support IE pre-10
		  var escapeFlag = open.charAt(3) || open.charAt(2),
		      escaped = escapeFlag !== '{' && escapeFlag !== '&';

		  var decorator = /\*/.test(open);
		  return {
		    type: decorator ? 'Decorator' : 'MustacheStatement',
		    path: path,
		    params: params,
		    hash: hash,
		    escaped: escaped,
		    strip: strip,
		    loc: this.locInfo(locInfo)
		  };
		}

		function prepareRawBlock(openRawBlock, contents, close, locInfo) {
		  validateClose(openRawBlock, close);

		  locInfo = this.locInfo(locInfo);
		  var program = {
		    type: 'Program',
		    body: contents,
		    strip: {},
		    loc: locInfo
		  };

		  return {
		    type: 'BlockStatement',
		    path: openRawBlock.path,
		    params: openRawBlock.params,
		    hash: openRawBlock.hash,
		    program: program,
		    openStrip: {},
		    inverseStrip: {},
		    closeStrip: {},
		    loc: locInfo
		  };
		}

		function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
		  if (close && close.path) {
		    validateClose(openBlock, close);
		  }

		  var decorator = /\*/.test(openBlock.open);

		  program.blockParams = openBlock.blockParams;

		  var inverse = undefined,
		      inverseStrip = undefined;

		  if (inverseAndProgram) {
		    if (decorator) {
		      throw new _exception2['default']('Unexpected inverse block on decorator', inverseAndProgram);
		    }

		    if (inverseAndProgram.chain) {
		      inverseAndProgram.program.body[0].closeStrip = close.strip;
		    }

		    inverseStrip = inverseAndProgram.strip;
		    inverse = inverseAndProgram.program;
		  }

		  if (inverted) {
		    inverted = inverse;
		    inverse = program;
		    program = inverted;
		  }

		  return {
		    type: decorator ? 'DecoratorBlock' : 'BlockStatement',
		    path: openBlock.path,
		    params: openBlock.params,
		    hash: openBlock.hash,
		    program: program,
		    inverse: inverse,
		    openStrip: openBlock.strip,
		    inverseStrip: inverseStrip,
		    closeStrip: close && close.strip,
		    loc: this.locInfo(locInfo)
		  };
		}

		function prepareProgram(statements, loc) {
		  if (!loc && statements.length) {
		    var firstLoc = statements[0].loc,
		        lastLoc = statements[statements.length - 1].loc;

		    /* istanbul ignore else */
		    if (firstLoc && lastLoc) {
		      loc = {
		        source: firstLoc.source,
		        start: {
		          line: firstLoc.start.line,
		          column: firstLoc.start.column
		        },
		        end: {
		          line: lastLoc.end.line,
		          column: lastLoc.end.column
		        }
		      };
		    }
		  }

		  return {
		    type: 'Program',
		    body: statements,
		    strip: {},
		    loc: loc
		  };
		}

		function preparePartialBlock(open, program, close, locInfo) {
		  validateClose(open, close);

		  return {
		    type: 'PartialBlockStatement',
		    name: open.path,
		    params: open.params,
		    hash: open.hash,
		    program: program,
		    openStrip: open.strip,
		    closeStrip: close && close.strip,
		    loc: this.locInfo(locInfo)
		  };
		}

	/***/ }),
	/* 90 */
	/***/ (function(module, exports, __webpack_require__) {

		var _Object$create = __webpack_require__(74)['default'];

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;
		exports.Compiler = Compiler;
		exports.precompile = precompile;
		exports.compile = compile;

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		var _utils = __webpack_require__(5);

		var _ast = __webpack_require__(84);

		var _ast2 = _interopRequireDefault(_ast);

		var slice = [].slice;

		function Compiler() {}

		// the foundHelper register will disambiguate helper lookup from finding a
		// function in a context. This is necessary for mustache compatibility, which
		// requires that context functions in blocks are evaluated by blockHelperMissing,
		// and then proceed as if the resulting value was provided to blockHelperMissing.

		Compiler.prototype = {
		  compiler: Compiler,

		  equals: function equals(other) {
		    var len = this.opcodes.length;
		    if (other.opcodes.length !== len) {
		      return false;
		    }

		    for (var i = 0; i < len; i++) {
		      var opcode = this.opcodes[i],
		          otherOpcode = other.opcodes[i];
		      if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
		        return false;
		      }
		    }

		    // We know that length is the same between the two arrays because they are directly tied
		    // to the opcode behavior above.
		    len = this.children.length;
		    for (var i = 0; i < len; i++) {
		      if (!this.children[i].equals(other.children[i])) {
		        return false;
		      }
		    }

		    return true;
		  },

		  guid: 0,

		  compile: function compile(program, options) {
		    this.sourceNode = [];
		    this.opcodes = [];
		    this.children = [];
		    this.options = options;
		    this.stringParams = options.stringParams;
		    this.trackIds = options.trackIds;

		    options.blockParams = options.blockParams || [];

		    options.knownHelpers = _utils.extend(_Object$create(null), {
		      helperMissing: true,
		      blockHelperMissing: true,
		      each: true,
		      'if': true,
		      unless: true,
		      'with': true,
		      log: true,
		      lookup: true
		    }, options.knownHelpers);

		    return this.accept(program);
		  },

		  compileProgram: function compileProgram(program) {
		    var childCompiler = new this.compiler(),
		        // eslint-disable-line new-cap
		    result = childCompiler.compile(program, this.options),
		        guid = this.guid++;

		    this.usePartial = this.usePartial || result.usePartial;

		    this.children[guid] = result;
		    this.useDepths = this.useDepths || result.useDepths;

		    return guid;
		  },

		  accept: function accept(node) {
		    /* istanbul ignore next: Sanity code */
		    if (!this[node.type]) {
		      throw new _exception2['default']('Unknown type: ' + node.type, node);
		    }

		    this.sourceNode.unshift(node);
		    var ret = this[node.type](node);
		    this.sourceNode.shift();
		    return ret;
		  },

		  Program: function Program(program) {
		    this.options.blockParams.unshift(program.blockParams);

		    var body = program.body,
		        bodyLength = body.length;
		    for (var i = 0; i < bodyLength; i++) {
		      this.accept(body[i]);
		    }

		    this.options.blockParams.shift();

		    this.isSimple = bodyLength === 1;
		    this.blockParams = program.blockParams ? program.blockParams.length : 0;

		    return this;
		  },

		  BlockStatement: function BlockStatement(block) {
		    transformLiteralToPath(block);

		    var program = block.program,
		        inverse = block.inverse;

		    program = program && this.compileProgram(program);
		    inverse = inverse && this.compileProgram(inverse);

		    var type = this.classifySexpr(block);

		    if (type === 'helper') {
		      this.helperSexpr(block, program, inverse);
		    } else if (type === 'simple') {
		      this.simpleSexpr(block);

		      // now that the simple mustache is resolved, we need to
		      // evaluate it by executing `blockHelperMissing`
		      this.opcode('pushProgram', program);
		      this.opcode('pushProgram', inverse);
		      this.opcode('emptyHash');
		      this.opcode('blockValue', block.path.original);
		    } else {
		      this.ambiguousSexpr(block, program, inverse);

		      // now that the simple mustache is resolved, we need to
		      // evaluate it by executing `blockHelperMissing`
		      this.opcode('pushProgram', program);
		      this.opcode('pushProgram', inverse);
		      this.opcode('emptyHash');
		      this.opcode('ambiguousBlockValue');
		    }

		    this.opcode('append');
		  },

		  DecoratorBlock: function DecoratorBlock(decorator) {
		    var program = decorator.program && this.compileProgram(decorator.program);
		    var params = this.setupFullMustacheParams(decorator, program, undefined),
		        path = decorator.path;

		    this.useDecorators = true;
		    this.opcode('registerDecorator', params.length, path.original);
		  },

		  PartialStatement: function PartialStatement(partial) {
		    this.usePartial = true;

		    var program = partial.program;
		    if (program) {
		      program = this.compileProgram(partial.program);
		    }

		    var params = partial.params;
		    if (params.length > 1) {
		      throw new _exception2['default']('Unsupported number of partial arguments: ' + params.length, partial);
		    } else if (!params.length) {
		      if (this.options.explicitPartialContext) {
		        this.opcode('pushLiteral', 'undefined');
		      } else {
		        params.push({ type: 'PathExpression', parts: [], depth: 0 });
		      }
		    }

		    var partialName = partial.name.original,
		        isDynamic = partial.name.type === 'SubExpression';
		    if (isDynamic) {
		      this.accept(partial.name);
		    }

		    this.setupFullMustacheParams(partial, program, undefined, true);

		    var indent = partial.indent || '';
		    if (this.options.preventIndent && indent) {
		      this.opcode('appendContent', indent);
		      indent = '';
		    }

		    this.opcode('invokePartial', isDynamic, partialName, indent);
		    this.opcode('append');
		  },
		  PartialBlockStatement: function PartialBlockStatement(partialBlock) {
		    this.PartialStatement(partialBlock);
		  },

		  MustacheStatement: function MustacheStatement(mustache) {
		    this.SubExpression(mustache);

		    if (mustache.escaped && !this.options.noEscape) {
		      this.opcode('appendEscaped');
		    } else {
		      this.opcode('append');
		    }
		  },
		  Decorator: function Decorator(decorator) {
		    this.DecoratorBlock(decorator);
		  },

		  ContentStatement: function ContentStatement(content) {
		    if (content.value) {
		      this.opcode('appendContent', content.value);
		    }
		  },

		  CommentStatement: function CommentStatement() {},

		  SubExpression: function SubExpression(sexpr) {
		    transformLiteralToPath(sexpr);
		    var type = this.classifySexpr(sexpr);

		    if (type === 'simple') {
		      this.simpleSexpr(sexpr);
		    } else if (type === 'helper') {
		      this.helperSexpr(sexpr);
		    } else {
		      this.ambiguousSexpr(sexpr);
		    }
		  },
		  ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
		    var path = sexpr.path,
		        name = path.parts[0],
		        isBlock = program != null || inverse != null;

		    this.opcode('getContext', path.depth);

		    this.opcode('pushProgram', program);
		    this.opcode('pushProgram', inverse);

		    path.strict = true;
		    this.accept(path);

		    this.opcode('invokeAmbiguous', name, isBlock);
		  },

		  simpleSexpr: function simpleSexpr(sexpr) {
		    var path = sexpr.path;
		    path.strict = true;
		    this.accept(path);
		    this.opcode('resolvePossibleLambda');
		  },

		  helperSexpr: function helperSexpr(sexpr, program, inverse) {
		    var params = this.setupFullMustacheParams(sexpr, program, inverse),
		        path = sexpr.path,
		        name = path.parts[0];

		    if (this.options.knownHelpers[name]) {
		      this.opcode('invokeKnownHelper', params.length, name);
		    } else if (this.options.knownHelpersOnly) {
		      throw new _exception2['default']('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
		    } else {
		      path.strict = true;
		      path.falsy = true;

		      this.accept(path);
		      this.opcode('invokeHelper', params.length, path.original, _ast2['default'].helpers.simpleId(path));
		    }
		  },

		  PathExpression: function PathExpression(path) {
		    this.addDepth(path.depth);
		    this.opcode('getContext', path.depth);

		    var name = path.parts[0],
		        scoped = _ast2['default'].helpers.scopedId(path),
		        blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

		    if (blockParamId) {
		      this.opcode('lookupBlockParam', blockParamId, path.parts);
		    } else if (!name) {
		      // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
		      this.opcode('pushContext');
		    } else if (path.data) {
		      this.options.data = true;
		      this.opcode('lookupData', path.depth, path.parts, path.strict);
		    } else {
		      this.opcode('lookupOnContext', path.parts, path.falsy, path.strict, scoped);
		    }
		  },

		  StringLiteral: function StringLiteral(string) {
		    this.opcode('pushString', string.value);
		  },

		  NumberLiteral: function NumberLiteral(number) {
		    this.opcode('pushLiteral', number.value);
		  },

		  BooleanLiteral: function BooleanLiteral(bool) {
		    this.opcode('pushLiteral', bool.value);
		  },

		  UndefinedLiteral: function UndefinedLiteral() {
		    this.opcode('pushLiteral', 'undefined');
		  },

		  NullLiteral: function NullLiteral() {
		    this.opcode('pushLiteral', 'null');
		  },

		  Hash: function Hash(hash) {
		    var pairs = hash.pairs,
		        i = 0,
		        l = pairs.length;

		    this.opcode('pushHash');

		    for (; i < l; i++) {
		      this.pushParam(pairs[i].value);
		    }
		    while (i--) {
		      this.opcode('assignToHash', pairs[i].key);
		    }
		    this.opcode('popHash');
		  },

		  // HELPERS
		  opcode: function opcode(name) {
		    this.opcodes.push({
		      opcode: name,
		      args: slice.call(arguments, 1),
		      loc: this.sourceNode[0].loc
		    });
		  },

		  addDepth: function addDepth(depth) {
		    if (!depth) {
		      return;
		    }

		    this.useDepths = true;
		  },

		  classifySexpr: function classifySexpr(sexpr) {
		    var isSimple = _ast2['default'].helpers.simpleId(sexpr.path);

		    var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);

		    // a mustache is an eligible helper if:
		    // * its id is simple (a single part, not `this` or `..`)
		    var isHelper = !isBlockParam && _ast2['default'].helpers.helperExpression(sexpr);

		    // if a mustache is an eligible helper but not a definite
		    // helper, it is ambiguous, and will be resolved in a later
		    // pass or at runtime.
		    var isEligible = !isBlockParam && (isHelper || isSimple);

		    // if ambiguous, we can possibly resolve the ambiguity now
		    // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
		    if (isEligible && !isHelper) {
		      var _name = sexpr.path.parts[0],
		          options = this.options;
		      if (options.knownHelpers[_name]) {
		        isHelper = true;
		      } else if (options.knownHelpersOnly) {
		        isEligible = false;
		      }
		    }

		    if (isHelper) {
		      return 'helper';
		    } else if (isEligible) {
		      return 'ambiguous';
		    } else {
		      return 'simple';
		    }
		  },

		  pushParams: function pushParams(params) {
		    for (var i = 0, l = params.length; i < l; i++) {
		      this.pushParam(params[i]);
		    }
		  },

		  pushParam: function pushParam(val) {
		    var value = val.value != null ? val.value : val.original || '';

		    if (this.stringParams) {
		      if (value.replace) {
		        value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
		      }

		      if (val.depth) {
		        this.addDepth(val.depth);
		      }
		      this.opcode('getContext', val.depth || 0);
		      this.opcode('pushStringParam', value, val.type);

		      if (val.type === 'SubExpression') {
		        // SubExpressions get evaluated and passed in
		        // in string params mode.
		        this.accept(val);
		      }
		    } else {
		      if (this.trackIds) {
		        var blockParamIndex = undefined;
		        if (val.parts && !_ast2['default'].helpers.scopedId(val) && !val.depth) {
		          blockParamIndex = this.blockParamIndex(val.parts[0]);
		        }
		        if (blockParamIndex) {
		          var blockParamChild = val.parts.slice(1).join('.');
		          this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
		        } else {
		          value = val.original || value;
		          if (value.replace) {
		            value = value.replace(/^this(?:\.|$)/, '').replace(/^\.\//, '').replace(/^\.$/, '');
		          }

		          this.opcode('pushId', val.type, value);
		        }
		      }
		      this.accept(val);
		    }
		  },

		  setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
		    var params = sexpr.params;
		    this.pushParams(params);

		    this.opcode('pushProgram', program);
		    this.opcode('pushProgram', inverse);

		    if (sexpr.hash) {
		      this.accept(sexpr.hash);
		    } else {
		      this.opcode('emptyHash', omitEmpty);
		    }

		    return params;
		  },

		  blockParamIndex: function blockParamIndex(name) {
		    for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
		      var blockParams = this.options.blockParams[depth],
		          param = blockParams && _utils.indexOf(blockParams, name);
		      if (blockParams && param >= 0) {
		        return [depth, param];
		      }
		    }
		  }
		};

		function precompile(input, options, env) {
		  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
		    throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
		  }

		  options = options || {};
		  if (!('data' in options)) {
		    options.data = true;
		  }
		  if (options.compat) {
		    options.useDepths = true;
		  }

		  var ast = env.parse(input, options),
		      environment = new env.Compiler().compile(ast, options);
		  return new env.JavaScriptCompiler().compile(environment, options);
		}

		function compile(input, options, env) {
		  if (options === undefined) options = {};

		  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
		    throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
		  }

		  options = _utils.extend({}, options);
		  if (!('data' in options)) {
		    options.data = true;
		  }
		  if (options.compat) {
		    options.useDepths = true;
		  }

		  var compiled = undefined;

		  function compileInput() {
		    var ast = env.parse(input, options),
		        environment = new env.Compiler().compile(ast, options),
		        templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
		    return env.template(templateSpec);
		  }

		  // Template is only compiled on first use and cached after that point.
		  function ret(context, execOptions) {
		    if (!compiled) {
		      compiled = compileInput();
		    }
		    return compiled.call(this, context, execOptions);
		  }
		  ret._setup = function (setupOptions) {
		    if (!compiled) {
		      compiled = compileInput();
		    }
		    return compiled._setup(setupOptions);
		  };
		  ret._child = function (i, data, blockParams, depths) {
		    if (!compiled) {
		      compiled = compileInput();
		    }
		    return compiled._child(i, data, blockParams, depths);
		  };
		  return ret;
		}

		function argEquals(a, b) {
		  if (a === b) {
		    return true;
		  }

		  if (_utils.isArray(a) && _utils.isArray(b) && a.length === b.length) {
		    for (var i = 0; i < a.length; i++) {
		      if (!argEquals(a[i], b[i])) {
		        return false;
		      }
		    }
		    return true;
		  }
		}

		function transformLiteralToPath(sexpr) {
		  if (!sexpr.path.parts) {
		    var literal = sexpr.path;
		    // Casting to string here to make false and 0 literal values play nicely with the rest
		    // of the system.
		    sexpr.path = {
		      type: 'PathExpression',
		      data: false,
		      depth: 0,
		      parts: [literal.original + ''],
		      original: literal.original + '',
		      loc: literal.loc
		    };
		  }
		}

	/***/ }),
	/* 91 */
	/***/ (function(module, exports, __webpack_require__) {

		var _Object$keys = __webpack_require__(60)['default'];

		var _interopRequireDefault = __webpack_require__(1)['default'];

		exports.__esModule = true;

		var _base = __webpack_require__(4);

		var _exception = __webpack_require__(6);

		var _exception2 = _interopRequireDefault(_exception);

		var _utils = __webpack_require__(5);

		var _codeGen = __webpack_require__(92);

		var _codeGen2 = _interopRequireDefault(_codeGen);

		function Literal(value) {
		  this.value = value;
		}

		function JavaScriptCompiler() {}

		JavaScriptCompiler.prototype = {
		  // PUBLIC API: You can override these methods in a subclass to provide
		  // alternative compiled forms for name lookup and buffering semantics
		  nameLookup: function nameLookup(parent, name /*,  type */) {
		    return this.internalNameLookup(parent, name);
		  },
		  depthedLookup: function depthedLookup(name) {
		    return [this.aliasable('container.lookup'), '(depths, ', JSON.stringify(name), ')'];
		  },

		  compilerInfo: function compilerInfo() {
		    var revision = _base.COMPILER_REVISION,
		        versions = _base.REVISION_CHANGES[revision];
		    return [revision, versions];
		  },

		  appendToBuffer: function appendToBuffer(source, location, explicit) {
		    // Force a source as this simplifies the merge logic.
		    if (!_utils.isArray(source)) {
		      source = [source];
		    }
		    source = this.source.wrap(source, location);

		    if (this.environment.isSimple) {
		      return ['return ', source, ';'];
		    } else if (explicit) {
		      // This is a case where the buffer operation occurs as a child of another
		      // construct, generally braces. We have to explicitly output these buffer
		      // operations to ensure that the emitted code goes in the correct location.
		      return ['buffer += ', source, ';'];
		    } else {
		      source.appendToBuffer = true;
		      return source;
		    }
		  },

		  initializeBuffer: function initializeBuffer() {
		    return this.quotedString('');
		  },
		  // END PUBLIC API
		  internalNameLookup: function internalNameLookup(parent, name) {
		    this.lookupPropertyFunctionIsUsed = true;
		    return ['lookupProperty(', parent, ',', JSON.stringify(name), ')'];
		  },

		  lookupPropertyFunctionIsUsed: false,

		  compile: function compile(environment, options, context, asObject) {
		    this.environment = environment;
		    this.options = options;
		    this.stringParams = this.options.stringParams;
		    this.trackIds = this.options.trackIds;
		    this.precompile = !asObject;

		    this.name = this.environment.name;
		    this.isChild = !!context;
		    this.context = context || {
		      decorators: [],
		      programs: [],
		      environments: []
		    };

		    this.preamble();

		    this.stackSlot = 0;
		    this.stackVars = [];
		    this.aliases = {};
		    this.registers = { list: [] };
		    this.hashes = [];
		    this.compileStack = [];
		    this.inlineStack = [];
		    this.blockParams = [];

		    this.compileChildren(environment, options);

		    this.useDepths = this.useDepths || environment.useDepths || environment.useDecorators || this.options.compat;
		    this.useBlockParams = this.useBlockParams || environment.useBlockParams;

		    var opcodes = environment.opcodes,
		        opcode = undefined,
		        firstLoc = undefined,
		        i = undefined,
		        l = undefined;

		    for (i = 0, l = opcodes.length; i < l; i++) {
		      opcode = opcodes[i];

		      this.source.currentLocation = opcode.loc;
		      firstLoc = firstLoc || opcode.loc;
		      this[opcode.opcode].apply(this, opcode.args);
		    }

		    // Flush any trailing content that might be pending.
		    this.source.currentLocation = firstLoc;
		    this.pushSource('');

		    /* istanbul ignore next */
		    if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
		      throw new _exception2['default']('Compile completed with content left on stack');
		    }

		    if (!this.decorators.isEmpty()) {
		      this.useDecorators = true;

		      this.decorators.prepend(['var decorators = container.decorators, ', this.lookupPropertyFunctionVarDeclaration(), ';\n']);
		      this.decorators.push('return fn;');

		      if (asObject) {
		        this.decorators = Function.apply(this, ['fn', 'props', 'container', 'depth0', 'data', 'blockParams', 'depths', this.decorators.merge()]);
		      } else {
		        this.decorators.prepend('function(fn, props, container, depth0, data, blockParams, depths) {\n');
		        this.decorators.push('}\n');
		        this.decorators = this.decorators.merge();
		      }
		    } else {
		      this.decorators = undefined;
		    }

		    var fn = this.createFunctionContext(asObject);
		    if (!this.isChild) {
		      var ret = {
		        compiler: this.compilerInfo(),
		        main: fn
		      };

		      if (this.decorators) {
		        ret.main_d = this.decorators; // eslint-disable-line camelcase
		        ret.useDecorators = true;
		      }

		      var _context = this.context;
		      var programs = _context.programs;
		      var decorators = _context.decorators;

		      for (i = 0, l = programs.length; i < l; i++) {
		        if (programs[i]) {
		          ret[i] = programs[i];
		          if (decorators[i]) {
		            ret[i + '_d'] = decorators[i];
		            ret.useDecorators = true;
		          }
		        }
		      }

		      if (this.environment.usePartial) {
		        ret.usePartial = true;
		      }
		      if (this.options.data) {
		        ret.useData = true;
		      }
		      if (this.useDepths) {
		        ret.useDepths = true;
		      }
		      if (this.useBlockParams) {
		        ret.useBlockParams = true;
		      }
		      if (this.options.compat) {
		        ret.compat = true;
		      }

		      if (!asObject) {
		        ret.compiler = JSON.stringify(ret.compiler);

		        this.source.currentLocation = { start: { line: 1, column: 0 } };
		        ret = this.objectLiteral(ret);

		        if (options.srcName) {
		          ret = ret.toStringWithSourceMap({ file: options.destName });
		          ret.map = ret.map && ret.map.toString();
		        } else {
		          ret = ret.toString();
		        }
		      } else {
		        ret.compilerOptions = this.options;
		      }

		      return ret;
		    } else {
		      return fn;
		    }
		  },

		  preamble: function preamble() {
		    // track the last context pushed into place to allow skipping the
		    // getContext opcode when it would be a noop
		    this.lastContext = 0;
		    this.source = new _codeGen2['default'](this.options.srcName);
		    this.decorators = new _codeGen2['default'](this.options.srcName);
		  },

		  createFunctionContext: function createFunctionContext(asObject) {
		    // istanbul ignore next

		    var _this = this;

		    var varDeclarations = '';

		    var locals = this.stackVars.concat(this.registers.list);
		    if (locals.length > 0) {
		      varDeclarations += ', ' + locals.join(', ');
		    }

		    // Generate minimizer alias mappings
		    //
		    // When using true SourceNodes, this will update all references to the given alias
		    // as the source nodes are reused in situ. For the non-source node compilation mode,
		    // aliases will not be used, but this case is already being run on the client and
		    // we aren't concern about minimizing the template size.
		    var aliasCount = 0;
		    _Object$keys(this.aliases).forEach(function (alias) {
		      var node = _this.aliases[alias];
		      if (node.children && node.referenceCount > 1) {
		        varDeclarations += ', alias' + ++aliasCount + '=' + alias;
		        node.children[0] = 'alias' + aliasCount;
		      }
		    });

		    if (this.lookupPropertyFunctionIsUsed) {
		      varDeclarations += ', ' + this.lookupPropertyFunctionVarDeclaration();
		    }

		    var params = ['container', 'depth0', 'helpers', 'partials', 'data'];

		    if (this.useBlockParams || this.useDepths) {
		      params.push('blockParams');
		    }
		    if (this.useDepths) {
		      params.push('depths');
		    }

		    // Perform a second pass over the output to merge content when possible
		    var source = this.mergeSource(varDeclarations);

		    if (asObject) {
		      params.push(source);

		      return Function.apply(this, params);
		    } else {
		      return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
		    }
		  },
		  mergeSource: function mergeSource(varDeclarations) {
		    var isSimple = this.environment.isSimple,
		        appendOnly = !this.forceBuffer,
		        appendFirst = undefined,
		        sourceSeen = undefined,
		        bufferStart = undefined,
		        bufferEnd = undefined;
		    this.source.each(function (line) {
		      if (line.appendToBuffer) {
		        if (bufferStart) {
		          line.prepend('  + ');
		        } else {
		          bufferStart = line;
		        }
		        bufferEnd = line;
		      } else {
		        if (bufferStart) {
		          if (!sourceSeen) {
		            appendFirst = true;
		          } else {
		            bufferStart.prepend('buffer += ');
		          }
		          bufferEnd.add(';');
		          bufferStart = bufferEnd = undefined;
		        }

		        sourceSeen = true;
		        if (!isSimple) {
		          appendOnly = false;
		        }
		      }
		    });

		    if (appendOnly) {
		      if (bufferStart) {
		        bufferStart.prepend('return ');
		        bufferEnd.add(';');
		      } else if (!sourceSeen) {
		        this.source.push('return "";');
		      }
		    } else {
		      varDeclarations += ', buffer = ' + (appendFirst ? '' : this.initializeBuffer());

		      if (bufferStart) {
		        bufferStart.prepend('return buffer + ');
		        bufferEnd.add(';');
		      } else {
		        this.source.push('return buffer;');
		      }
		    }

		    if (varDeclarations) {
		      this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
		    }

		    return this.source.merge();
		  },

		  lookupPropertyFunctionVarDeclaration: function lookupPropertyFunctionVarDeclaration() {
		    return '\n      lookupProperty = container.lookupProperty || function(parent, propertyName) {\n        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {\n          return parent[propertyName];\n        }\n        return undefined\n    }\n    '.trim();
		  },

		  // [blockValue]
		  //
		  // On stack, before: hash, inverse, program, value
		  // On stack, after: return value of blockHelperMissing
		  //
		  // The purpose of this opcode is to take a block of the form
		  // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
		  // replace it on the stack with the result of properly
		  // invoking blockHelperMissing.
		  blockValue: function blockValue(name) {
		    var blockHelperMissing = this.aliasable('container.hooks.blockHelperMissing'),
		        params = [this.contextName(0)];
		    this.setupHelperArgs(name, 0, params);

		    var blockName = this.popStack();
		    params.splice(1, 0, blockName);

		    this.push(this.source.functionCall(blockHelperMissing, 'call', params));
		  },

		  // [ambiguousBlockValue]
		  //
		  // On stack, before: hash, inverse, program, value
		  // Compiler value, before: lastHelper=value of last found helper, if any
		  // On stack, after, if no lastHelper: same as [blockValue]
		  // On stack, after, if lastHelper: value
		  ambiguousBlockValue: function ambiguousBlockValue() {
		    // We're being a bit cheeky and reusing the options value from the prior exec
		    var blockHelperMissing = this.aliasable('container.hooks.blockHelperMissing'),
		        params = [this.contextName(0)];
		    this.setupHelperArgs('', 0, params, true);

		    this.flushInline();

		    var current = this.topStack();
		    params.splice(1, 0, current);

		    this.pushSource(['if (!', this.lastHelper, ') { ', current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params), '}']);
		  },

		  // [appendContent]
		  //
		  // On stack, before: ...
		  // On stack, after: ...
		  //
		  // Appends the string value of `content` to the current buffer
		  appendContent: function appendContent(content) {
		    if (this.pendingContent) {
		      content = this.pendingContent + content;
		    } else {
		      this.pendingLocation = this.source.currentLocation;
		    }

		    this.pendingContent = content;
		  },

		  // [append]
		  //
		  // On stack, before: value, ...
		  // On stack, after: ...
		  //
		  // Coerces `value` to a String and appends it to the current buffer.
		  //
		  // If `value` is truthy, or 0, it is coerced into a string and appended
		  // Otherwise, the empty string is appended
		  append: function append() {
		    if (this.isInline()) {
		      this.replaceStack(function (current) {
		        return [' != null ? ', current, ' : ""'];
		      });

		      this.pushSource(this.appendToBuffer(this.popStack()));
		    } else {
		      var local = this.popStack();
		      this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
		      if (this.environment.isSimple) {
		        this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
		      }
		    }
		  },

		  // [appendEscaped]
		  //
		  // On stack, before: value, ...
		  // On stack, after: ...
		  //
		  // Escape `value` and append it to the buffer
		  appendEscaped: function appendEscaped() {
		    this.pushSource(this.appendToBuffer([this.aliasable('container.escapeExpression'), '(', this.popStack(), ')']));
		  },

		  // [getContext]
		  //
		  // On stack, before: ...
		  // On stack, after: ...
		  // Compiler value, after: lastContext=depth
		  //
		  // Set the value of the `lastContext` compiler value to the depth
		  getContext: function getContext(depth) {
		    this.lastContext = depth;
		  },

		  // [pushContext]
		  //
		  // On stack, before: ...
		  // On stack, after: currentContext, ...
		  //
		  // Pushes the value of the current context onto the stack.
		  pushContext: function pushContext() {
		    this.pushStackLiteral(this.contextName(this.lastContext));
		  },

		  // [lookupOnContext]
		  //
		  // On stack, before: ...
		  // On stack, after: currentContext[name], ...
		  //
		  // Looks up the value of `name` on the current context and pushes
		  // it onto the stack.
		  lookupOnContext: function lookupOnContext(parts, falsy, strict, scoped) {
		    var i = 0;

		    if (!scoped && this.options.compat && !this.lastContext) {
		      // The depthed query is expected to handle the undefined logic for the root level that
		      // is implemented below, so we evaluate that directly in compat mode
		      this.push(this.depthedLookup(parts[i++]));
		    } else {
		      this.pushContext();
		    }

		    this.resolvePath('context', parts, i, falsy, strict);
		  },

		  // [lookupBlockParam]
		  //
		  // On stack, before: ...
		  // On stack, after: blockParam[name], ...
		  //
		  // Looks up the value of `parts` on the given block param and pushes
		  // it onto the stack.
		  lookupBlockParam: function lookupBlockParam(blockParamId, parts) {
		    this.useBlockParams = true;

		    this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
		    this.resolvePath('context', parts, 1);
		  },

		  // [lookupData]
		  //
		  // On stack, before: ...
		  // On stack, after: data, ...
		  //
		  // Push the data lookup operator
		  lookupData: function lookupData(depth, parts, strict) {
		    if (!depth) {
		      this.pushStackLiteral('data');
		    } else {
		      this.pushStackLiteral('container.data(data, ' + depth + ')');
		    }

		    this.resolvePath('data', parts, 0, true, strict);
		  },

		  resolvePath: function resolvePath(type, parts, i, falsy, strict) {
		    // istanbul ignore next

		    var _this2 = this;

		    if (this.options.strict || this.options.assumeObjects) {
		      this.push(strictLookup(this.options.strict && strict, this, parts, i, type));
		      return;
		    }

		    var len = parts.length;
		    for (; i < len; i++) {
		      /* eslint-disable no-loop-func */
		      this.replaceStack(function (current) {
		        var lookup = _this2.nameLookup(current, parts[i], type);
		        // We want to ensure that zero and false are handled properly if the context (falsy flag)
		        // needs to have the special handling for these values.
		        if (!falsy) {
		          return [' != null ? ', lookup, ' : ', current];
		        } else {
		          // Otherwise we can use generic falsy handling
		          return [' && ', lookup];
		        }
		      });
		      /* eslint-enable no-loop-func */
		    }
		  },

		  // [resolvePossibleLambda]
		  //
		  // On stack, before: value, ...
		  // On stack, after: resolved value, ...
		  //
		  // If the `value` is a lambda, replace it on the stack by
		  // the return value of the lambda
		  resolvePossibleLambda: function resolvePossibleLambda() {
		    this.push([this.aliasable('container.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
		  },

		  // [pushStringParam]
		  //
		  // On stack, before: ...
		  // On stack, after: string, currentContext, ...
		  //
		  // This opcode is designed for use in string mode, which
		  // provides the string value of a parameter along with its
		  // depth rather than resolving it immediately.
		  pushStringParam: function pushStringParam(string, type) {
		    this.pushContext();
		    this.pushString(type);

		    // If it's a subexpression, the string result
		    // will be pushed after this opcode.
		    if (type !== 'SubExpression') {
		      if (typeof string === 'string') {
		        this.pushString(string);
		      } else {
		        this.pushStackLiteral(string);
		      }
		    }
		  },

		  emptyHash: function emptyHash(omitEmpty) {
		    if (this.trackIds) {
		      this.push('{}'); // hashIds
		    }
		    if (this.stringParams) {
		      this.push('{}'); // hashContexts
		      this.push('{}'); // hashTypes
		    }
		    this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
		  },
		  pushHash: function pushHash() {
		    if (this.hash) {
		      this.hashes.push(this.hash);
		    }
		    this.hash = { values: {}, types: [], contexts: [], ids: [] };
		  },
		  popHash: function popHash() {
		    var hash = this.hash;
		    this.hash = this.hashes.pop();

		    if (this.trackIds) {
		      this.push(this.objectLiteral(hash.ids));
		    }
		    if (this.stringParams) {
		      this.push(this.objectLiteral(hash.contexts));
		      this.push(this.objectLiteral(hash.types));
		    }

		    this.push(this.objectLiteral(hash.values));
		  },

		  // [pushString]
		  //
		  // On stack, before: ...
		  // On stack, after: quotedString(string), ...
		  //
		  // Push a quoted version of `string` onto the stack
		  pushString: function pushString(string) {
		    this.pushStackLiteral(this.quotedString(string));
		  },

		  // [pushLiteral]
		  //
		  // On stack, before: ...
		  // On stack, after: value, ...
		  //
		  // Pushes a value onto the stack. This operation prevents
		  // the compiler from creating a temporary variable to hold
		  // it.
		  pushLiteral: function pushLiteral(value) {
		    this.pushStackLiteral(value);
		  },

		  // [pushProgram]
		  //
		  // On stack, before: ...
		  // On stack, after: program(guid), ...
		  //
		  // Push a program expression onto the stack. This takes
		  // a compile-time guid and converts it into a runtime-accessible
		  // expression.
		  pushProgram: function pushProgram(guid) {
		    if (guid != null) {
		      this.pushStackLiteral(this.programExpression(guid));
		    } else {
		      this.pushStackLiteral(null);
		    }
		  },

		  // [registerDecorator]
		  //
		  // On stack, before: hash, program, params..., ...
		  // On stack, after: ...
		  //
		  // Pops off the decorator's parameters, invokes the decorator,
		  // and inserts the decorator into the decorators list.
		  registerDecorator: function registerDecorator(paramSize, name) {
		    var foundDecorator = this.nameLookup('decorators', name, 'decorator'),
		        options = this.setupHelperArgs(name, paramSize);

		    this.decorators.push(['fn = ', this.decorators.functionCall(foundDecorator, '', ['fn', 'props', 'container', options]), ' || fn;']);
		  },

		  // [invokeHelper]
		  //
		  // On stack, before: hash, inverse, program, params..., ...
		  // On stack, after: result of helper invocation
		  //
		  // Pops off the helper's parameters, invokes the helper,
		  // and pushes the helper's return value onto the stack.
		  //
		  // If the helper is not found, `helperMissing` is called.
		  invokeHelper: function invokeHelper(paramSize, name, isSimple) {
		    var nonHelper = this.popStack(),
		        helper = this.setupHelper(paramSize, name);

		    var possibleFunctionCalls = [];

		    if (isSimple) {
		      // direct call to helper
		      possibleFunctionCalls.push(helper.name);
		    }
		    // call a function from the input object
		    possibleFunctionCalls.push(nonHelper);
		    if (!this.options.strict) {
		      possibleFunctionCalls.push(this.aliasable('container.hooks.helperMissing'));
		    }

		    var functionLookupCode = ['(', this.itemsSeparatedBy(possibleFunctionCalls, '||'), ')'];
		    var functionCall = this.source.functionCall(functionLookupCode, 'call', helper.callParams);
		    this.push(functionCall);
		  },

		  itemsSeparatedBy: function itemsSeparatedBy(items, separator) {
		    var result = [];
		    result.push(items[0]);
		    for (var i = 1; i < items.length; i++) {
		      result.push(separator, items[i]);
		    }
		    return result;
		  },
		  // [invokeKnownHelper]
		  //
		  // On stack, before: hash, inverse, program, params..., ...
		  // On stack, after: result of helper invocation
		  //
		  // This operation is used when the helper is known to exist,
		  // so a `helperMissing` fallback is not required.
		  invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
		    var helper = this.setupHelper(paramSize, name);
		    this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
		  },

		  // [invokeAmbiguous]
		  //
		  // On stack, before: hash, inverse, program, params..., ...
		  // On stack, after: result of disambiguation
		  //
		  // This operation is used when an expression like `{{foo}}`
		  // is provided, but we don't know at compile-time whether it
		  // is a helper or a path.
		  //
		  // This operation emits more code than the other options,
		  // and can be avoided by passing the `knownHelpers` and
		  // `knownHelpersOnly` flags at compile-time.
		  invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
		    this.useRegister('helper');

		    var nonHelper = this.popStack();

		    this.emptyHash();
		    var helper = this.setupHelper(0, name, helperCall);

		    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

		    var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];
		    if (!this.options.strict) {
		      lookup[0] = '(helper = ';
		      lookup.push(' != null ? helper : ', this.aliasable('container.hooks.helperMissing'));
		    }

		    this.push(['(', lookup, helper.paramsInit ? ['),(', helper.paramsInit] : [], '),', '(typeof helper === ', this.aliasable('"function"'), ' ? ', this.source.functionCall('helper', 'call', helper.callParams), ' : helper))']);
		  },

		  // [invokePartial]
		  //
		  // On stack, before: context, ...
		  // On stack after: result of partial invocation
		  //
		  // This operation pops off a context, invokes a partial with that context,
		  // and pushes the result of the invocation back.
		  invokePartial: function invokePartial(isDynamic, name, indent) {
		    var params = [],
		        options = this.setupParams(name, 1, params);

		    if (isDynamic) {
		      name = this.popStack();
		      delete options.name;
		    }

		    if (indent) {
		      options.indent = JSON.stringify(indent);
		    }
		    options.helpers = 'helpers';
		    options.partials = 'partials';
		    options.decorators = 'container.decorators';

		    if (!isDynamic) {
		      params.unshift(this.nameLookup('partials', name, 'partial'));
		    } else {
		      params.unshift(name);
		    }

		    if (this.options.compat) {
		      options.depths = 'depths';
		    }
		    options = this.objectLiteral(options);
		    params.push(options);

		    this.push(this.source.functionCall('container.invokePartial', '', params));
		  },

		  // [assignToHash]
		  //
		  // On stack, before: value, ..., hash, ...
		  // On stack, after: ..., hash, ...
		  //
		  // Pops a value off the stack and assigns it to the current hash
		  assignToHash: function assignToHash(key) {
		    var value = this.popStack(),
		        context = undefined,
		        type = undefined,
		        id = undefined;

		    if (this.trackIds) {
		      id = this.popStack();
		    }
		    if (this.stringParams) {
		      type = this.popStack();
		      context = this.popStack();
		    }

		    var hash = this.hash;
		    if (context) {
		      hash.contexts[key] = context;
		    }
		    if (type) {
		      hash.types[key] = type;
		    }
		    if (id) {
		      hash.ids[key] = id;
		    }
		    hash.values[key] = value;
		  },

		  pushId: function pushId(type, name, child) {
		    if (type === 'BlockParam') {
		      this.pushStackLiteral('blockParams[' + name[0] + '].path[' + name[1] + ']' + (child ? ' + ' + JSON.stringify('.' + child) : ''));
		    } else if (type === 'PathExpression') {
		      this.pushString(name);
		    } else if (type === 'SubExpression') {
		      this.pushStackLiteral('true');
		    } else {
		      this.pushStackLiteral('null');
		    }
		  },

		  // HELPERS

		  compiler: JavaScriptCompiler,

		  compileChildren: function compileChildren(environment, options) {
		    var children = environment.children,
		        child = undefined,
		        compiler = undefined;

		    for (var i = 0, l = children.length; i < l; i++) {
		      child = children[i];
		      compiler = new this.compiler(); // eslint-disable-line new-cap

		      var existing = this.matchExistingProgram(child);

		      if (existing == null) {
		        this.context.programs.push(''); // Placeholder to prevent name conflicts for nested children
		        var index = this.context.programs.length;
		        child.index = index;
		        child.name = 'program' + index;
		        this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
		        this.context.decorators[index] = compiler.decorators;
		        this.context.environments[index] = child;

		        this.useDepths = this.useDepths || compiler.useDepths;
		        this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
		        child.useDepths = this.useDepths;
		        child.useBlockParams = this.useBlockParams;
		      } else {
		        child.index = existing.index;
		        child.name = 'program' + existing.index;

		        this.useDepths = this.useDepths || existing.useDepths;
		        this.useBlockParams = this.useBlockParams || existing.useBlockParams;
		      }
		    }
		  },
		  matchExistingProgram: function matchExistingProgram(child) {
		    for (var i = 0, len = this.context.environments.length; i < len; i++) {
		      var environment = this.context.environments[i];
		      if (environment && environment.equals(child)) {
		        return environment;
		      }
		    }
		  },

		  programExpression: function programExpression(guid) {
		    var child = this.environment.children[guid],
		        programParams = [child.index, 'data', child.blockParams];

		    if (this.useBlockParams || this.useDepths) {
		      programParams.push('blockParams');
		    }
		    if (this.useDepths) {
		      programParams.push('depths');
		    }

		    return 'container.program(' + programParams.join(', ') + ')';
		  },

		  useRegister: function useRegister(name) {
		    if (!this.registers[name]) {
		      this.registers[name] = true;
		      this.registers.list.push(name);
		    }
		  },

		  push: function push(expr) {
		    if (!(expr instanceof Literal)) {
		      expr = this.source.wrap(expr);
		    }

		    this.inlineStack.push(expr);
		    return expr;
		  },

		  pushStackLiteral: function pushStackLiteral(item) {
		    this.push(new Literal(item));
		  },

		  pushSource: function pushSource(source) {
		    if (this.pendingContent) {
		      this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
		      this.pendingContent = undefined;
		    }

		    if (source) {
		      this.source.push(source);
		    }
		  },

		  replaceStack: function replaceStack(callback) {
		    var prefix = ['('],
		        stack = undefined,
		        createdStack = undefined,
		        usedLiteral = undefined;

		    /* istanbul ignore next */
		    if (!this.isInline()) {
		      throw new _exception2['default']('replaceStack on non-inline');
		    }

		    // We want to merge the inline statement into the replacement statement via ','
		    var top = this.popStack(true);

		    if (top instanceof Literal) {
		      // Literals do not need to be inlined
		      stack = [top.value];
		      prefix = ['(', stack];
		      usedLiteral = true;
		    } else {
		      // Get or create the current stack name for use by the inline
		      createdStack = true;
		      var _name = this.incrStack();

		      prefix = ['((', this.push(_name), ' = ', top, ')'];
		      stack = this.topStack();
		    }

		    var item = callback.call(this, stack);

		    if (!usedLiteral) {
		      this.popStack();
		    }
		    if (createdStack) {
		      this.stackSlot--;
		    }
		    this.push(prefix.concat(item, ')'));
		  },

		  incrStack: function incrStack() {
		    this.stackSlot++;
		    if (this.stackSlot > this.stackVars.length) {
		      this.stackVars.push('stack' + this.stackSlot);
		    }
		    return this.topStackName();
		  },
		  topStackName: function topStackName() {
		    return 'stack' + this.stackSlot;
		  },
		  flushInline: function flushInline() {
		    var inlineStack = this.inlineStack;
		    this.inlineStack = [];
		    for (var i = 0, len = inlineStack.length; i < len; i++) {
		      var entry = inlineStack[i];
		      /* istanbul ignore if */
		      if (entry instanceof Literal) {
		        this.compileStack.push(entry);
		      } else {
		        var stack = this.incrStack();
		        this.pushSource([stack, ' = ', entry, ';']);
		        this.compileStack.push(stack);
		      }
		    }
		  },
		  isInline: function isInline() {
		    return this.inlineStack.length;
		  },

		  popStack: function popStack(wrapped) {
		    var inline = this.isInline(),
		        item = (inline ? this.inlineStack : this.compileStack).pop();

		    if (!wrapped && item instanceof Literal) {
		      return item.value;
		    } else {
		      if (!inline) {
		        /* istanbul ignore next */
		        if (!this.stackSlot) {
		          throw new _exception2['default']('Invalid stack pop');
		        }
		        this.stackSlot--;
		      }
		      return item;
		    }
		  },

		  topStack: function topStack() {
		    var stack = this.isInline() ? this.inlineStack : this.compileStack,
		        item = stack[stack.length - 1];

		    /* istanbul ignore if */
		    if (item instanceof Literal) {
		      return item.value;
		    } else {
		      return item;
		    }
		  },

		  contextName: function contextName(context) {
		    if (this.useDepths && context) {
		      return 'depths[' + context + ']';
		    } else {
		      return 'depth' + context;
		    }
		  },

		  quotedString: function quotedString(str) {
		    return this.source.quotedString(str);
		  },

		  objectLiteral: function objectLiteral(obj) {
		    return this.source.objectLiteral(obj);
		  },

		  aliasable: function aliasable(name) {
		    var ret = this.aliases[name];
		    if (ret) {
		      ret.referenceCount++;
		      return ret;
		    }

		    ret = this.aliases[name] = this.source.wrap(name);
		    ret.aliasable = true;
		    ret.referenceCount = 1;

		    return ret;
		  },

		  setupHelper: function setupHelper(paramSize, name, blockHelper) {
		    var params = [],
		        paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
		    var foundHelper = this.nameLookup('helpers', name, 'helper'),
		        callContext = this.aliasable(this.contextName(0) + ' != null ? ' + this.contextName(0) + ' : (container.nullContext || {})');

		    return {
		      params: params,
		      paramsInit: paramsInit,
		      name: foundHelper,
		      callParams: [callContext].concat(params)
		    };
		  },

		  setupParams: function setupParams(helper, paramSize, params) {
		    var options = {},
		        contexts = [],
		        types = [],
		        ids = [],
		        objectArgs = !params,
		        param = undefined;

		    if (objectArgs) {
		      params = [];
		    }

		    options.name = this.quotedString(helper);
		    options.hash = this.popStack();

		    if (this.trackIds) {
		      options.hashIds = this.popStack();
		    }
		    if (this.stringParams) {
		      options.hashTypes = this.popStack();
		      options.hashContexts = this.popStack();
		    }

		    var inverse = this.popStack(),
		        program = this.popStack();

		    // Avoid setting fn and inverse if neither are set. This allows
		    // helpers to do a check for `if (options.fn)`
		    if (program || inverse) {
		      options.fn = program || 'container.noop';
		      options.inverse = inverse || 'container.noop';
		    }

		    // The parameters go on to the stack in order (making sure that they are evaluated in order)
		    // so we need to pop them off the stack in reverse order
		    var i = paramSize;
		    while (i--) {
		      param = this.popStack();
		      params[i] = param;

		      if (this.trackIds) {
		        ids[i] = this.popStack();
		      }
		      if (this.stringParams) {
		        types[i] = this.popStack();
		        contexts[i] = this.popStack();
		      }
		    }

		    if (objectArgs) {
		      options.args = this.source.generateArray(params);
		    }

		    if (this.trackIds) {
		      options.ids = this.source.generateArray(ids);
		    }
		    if (this.stringParams) {
		      options.types = this.source.generateArray(types);
		      options.contexts = this.source.generateArray(contexts);
		    }

		    if (this.options.data) {
		      options.data = 'data';
		    }
		    if (this.useBlockParams) {
		      options.blockParams = 'blockParams';
		    }
		    return options;
		  },

		  setupHelperArgs: function setupHelperArgs(helper, paramSize, params, useRegister) {
		    var options = this.setupParams(helper, paramSize, params);
		    options.loc = JSON.stringify(this.source.currentLocation);
		    options = this.objectLiteral(options);
		    if (useRegister) {
		      this.useRegister('options');
		      params.push('options');
		      return ['options=', options];
		    } else if (params) {
		      params.push(options);
		      return '';
		    } else {
		      return options;
		    }
		  }
		};

		(function () {
		  var reservedWords = ('break else new var' + ' case finally return void' + ' catch for switch while' + ' continue function this with' + ' default if throw' + ' delete in try' + ' do instanceof typeof' + ' abstract enum int short' + ' boolean export interface static' + ' byte extends long super' + ' char final native synchronized' + ' class float package throws' + ' const goto private transient' + ' debugger implements protected volatile' + ' double import public let yield await' + ' null true false').split(' ');

		  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

		  for (var i = 0, l = reservedWords.length; i < l; i++) {
		    compilerWords[reservedWords[i]] = true;
		  }
		})();

		/**
		 * @deprecated May be removed in the next major version
		 */
		JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
		  return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
		};

		function strictLookup(requireTerminal, compiler, parts, i, type) {
		  var stack = compiler.popStack(),
		      len = parts.length;
		  if (requireTerminal) {
		    len--;
		  }

		  for (; i < len; i++) {
		    stack = compiler.nameLookup(stack, parts[i], type);
		  }

		  if (requireTerminal) {
		    return [compiler.aliasable('container.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ', ', JSON.stringify(compiler.source.currentLocation), ' )'];
		  } else {
		    return stack;
		  }
		}

		exports['default'] = JavaScriptCompiler;
		module.exports = exports['default'];

	/***/ }),
	/* 92 */
	/***/ (function(module, exports, __webpack_require__) {

		var _Object$keys = __webpack_require__(60)['default'];

		exports.__esModule = true;

		var _utils = __webpack_require__(5);

		var SourceNode = undefined;

		try {
		  /* istanbul ignore next */
		  var SourceMap; if (false) ;
		} catch (err) {}
		/* NOP */

		/* istanbul ignore if: tested but not covered in istanbul due to dist build  */
		if (!SourceNode) {
		  SourceNode = function (line, column, srcFile, chunks) {
		    this.src = '';
		    if (chunks) {
		      this.add(chunks);
		    }
		  };
		  /* istanbul ignore next */
		  SourceNode.prototype = {
		    add: function add(chunks) {
		      if (_utils.isArray(chunks)) {
		        chunks = chunks.join('');
		      }
		      this.src += chunks;
		    },
		    prepend: function prepend(chunks) {
		      if (_utils.isArray(chunks)) {
		        chunks = chunks.join('');
		      }
		      this.src = chunks + this.src;
		    },
		    toStringWithSourceMap: function toStringWithSourceMap() {
		      return { code: this.toString() };
		    },
		    toString: function toString() {
		      return this.src;
		    }
		  };
		}

		function castChunk(chunk, codeGen, loc) {
		  if (_utils.isArray(chunk)) {
		    var ret = [];

		    for (var i = 0, len = chunk.length; i < len; i++) {
		      ret.push(codeGen.wrap(chunk[i], loc));
		    }
		    return ret;
		  } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
		    // Handle primitives that the SourceNode will throw up on
		    return chunk + '';
		  }
		  return chunk;
		}

		function CodeGen(srcFile) {
		  this.srcFile = srcFile;
		  this.source = [];
		}

		CodeGen.prototype = {
		  isEmpty: function isEmpty() {
		    return !this.source.length;
		  },
		  prepend: function prepend(source, loc) {
		    this.source.unshift(this.wrap(source, loc));
		  },
		  push: function push(source, loc) {
		    this.source.push(this.wrap(source, loc));
		  },

		  merge: function merge() {
		    var source = this.empty();
		    this.each(function (line) {
		      source.add(['  ', line, '\n']);
		    });
		    return source;
		  },

		  each: function each(iter) {
		    for (var i = 0, len = this.source.length; i < len; i++) {
		      iter(this.source[i]);
		    }
		  },

		  empty: function empty() {
		    var loc = this.currentLocation || { start: {} };
		    return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
		  },
		  wrap: function wrap(chunk) {
		    var loc = arguments.length <= 1 || arguments[1] === undefined ? this.currentLocation || { start: {} } : arguments[1];

		    if (chunk instanceof SourceNode) {
		      return chunk;
		    }

		    chunk = castChunk(chunk, this, loc);

		    return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
		  },

		  functionCall: function functionCall(fn, type, params) {
		    params = this.generateList(params);
		    return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
		  },

		  quotedString: function quotedString(str) {
		    return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
		    .replace(/\u2029/g, '\\u2029') + '"';
		  },

		  objectLiteral: function objectLiteral(obj) {
		    // istanbul ignore next

		    var _this = this;

		    var pairs = [];

		    _Object$keys(obj).forEach(function (key) {
		      var value = castChunk(obj[key], _this);
		      if (value !== 'undefined') {
		        pairs.push([_this.quotedString(key), ':', value]);
		      }
		    });

		    var ret = this.generateList(pairs);
		    ret.prepend('{');
		    ret.add('}');
		    return ret;
		  },

		  generateList: function generateList(entries) {
		    var ret = this.empty();

		    for (var i = 0, len = entries.length; i < len; i++) {
		      if (i) {
		        ret.add(',');
		      }

		      ret.add(castChunk(entries[i], this));
		    }

		    return ret;
		  },

		  generateArray: function generateArray(entries) {
		    var ret = this.generateList(entries);
		    ret.prepend('[');
		    ret.add(']');

		    return ret;
		  }
		};

		exports['default'] = CodeGen;
		module.exports = exports['default'];

	/***/ })
	/******/ ])
	});
} (handlebars));

var handlebarsExports = handlebars.exports;
var Handlebars = /*@__PURE__*/getDefaultExportFromCjs(handlebarsExports);

/**
 * Generates a simple hash value for a string.
 *
 * @param str The input string.
 * @returns A hash value as a string.
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
}

/**
 * Returns 'true' if all arguments are truthy, otherwise returns an empty string.
 * @param args The arguments to check.
 * @returns 'true' if all arguments are truthy, otherwise returns an empty string.
 */
function all(...args) {
    // Remove the last argument (handlebars object)
    args.pop();
    // Check if all arguments are truthy
    return (args.length && args.every(Boolean)) ? 'true' : '';
}

function anyToString(value) {
    if (value === null || value === undefined) {
        return '';
    }
    else if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        }
        catch (e) { }
    }
    return String(value);
}

/**
 * Determines if any of the provided arguments have a length greater than zero.
 * @param args The arguments to evaluate.
 * @returns True if any argument has a length greater than zero, false otherwise.
 */
function any(...args) {
    return args.some((arg) => anyToString(arg).length > 0);
}

/**
 * A function that takes in multiple arguments and returns the first non-empty string value.
 * @param args - The array of arguments to check for non-empty string values.
 * @returns The first non-empty string value found in the arguments array.
 */
function coalesce(...values) {
    console.log('coalesce INPUT VALUES', values);
    const filteredValues = values
        .filter((v, i) => v && anyToString(v).length && i < values.length - 1);
    return filteredValues[0] ? anyToString(filteredValues[0]) : '';
}

/**
 * A Handlebars helper function that wraps the passed content with a <span> element
 * styled with a given color.
 * @param color The color to apply to the <span> element.
 * @param options The Handlebars helper options object.
 * @returns A string containing the HTML for the wrapped content.
 */
function color(color, options) {
    // Create a new <span> element and set its color style property
    const span = document.createElement('span');
    span.style.color = color;
    // Render the content using Handlebars and set it as the inner HTML of the <span> element
    span.innerHTML = options.fn ? options.fn(this) : '';
    // Return the outer HTML of the <span> element
    return span.outerHTML;
}

var dayjs_min = {exports: {}};

(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return "["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,u=e.clone().add(r+(s?-1:1),c);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:c,y:h,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p="$isDayjsObject",S=function(t){return t instanceof _||!(!t||!t[p])},w=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(g=i),i||!r&&g},O=function(t,e){if(S(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},b=v;b.l=w,b.i=S,b.w=function(t,e){return O(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=w(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[p]=!0;}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return b},m.isValid=function(){return !(this.$d.toString()===l)},m.isSame=function(t,e){var n=O(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return O(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<O(t)},m.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!b.u(e)||e,f=b.p(t),l=function(t,e){var i=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=b.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[a]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[u]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===h){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[b.p(t)]()},m.add=function(r,f){var d,l=this;r=Number(r);var $=b.p(f),y=function(t){var e=O(l);return b.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return b.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=b.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},d=function(t){return b.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(y,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return b.s(e.$y,4,"0");case"M":return a+1;case"MM":return b.s(a+1,2,"0");case"MMM":return h(n.monthsShort,a,c,3);case"MMMM":return h(c,a);case"D":return e.$D;case"DD":return b.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return h(n.weekdaysMin,e.$W,o,2);case"ddd":return h(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(s);case"HH":return b.s(s,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(s,u,!0);case"A":return $(s,u,!1);case"m":return String(u);case"mm":return b.s(u,2,"0");case"s":return String(e.$s);case"ss":return b.s(e.$s,2,"0");case"SSS":return b.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=this,M=b.p(d),m=O(r),v=(m.utcOffset()-this.utcOffset())*e,g=this-m,D=function(){return b.m(y,m)};switch(M){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(g-v)/6048e5;break;case a:$=(g-v)/864e5;break;case u:$=g/n;break;case s:$=g/e;break;case i:$=g/t;break;default:$=g;}return l?$:b.a($)},m.daysInMonth=function(){return this.endOf(c).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=w(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return b.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),k=_.prototype;return O.prototype=k,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",c],["$y",h],["$D",d]].forEach((function(t){k[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),O.extend=function(t,e){return t.$i||(t(e,_,O),t.$i=!0),O},O.locale=w,O.isDayjs=S,O.unix=function(t){return O(1e3*t)},O.en=D[g],O.Ls=D,O.p={},O})); 
} (dayjs_min));

var dayjs_minExports = dayjs_min.exports;
var dayjs = /*@__PURE__*/getDefaultExportFromCjs(dayjs_minExports);

var timezone$1 = {exports: {}};

(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t={year:0,month:1,day:2,hour:3,minute:4,second:5},e={};return function(n,i,o){var r,a=function(t,n,i){void 0===i&&(i={});var o=new Date(t),r=function(t,n){void 0===n&&(n={});var i=n.timeZoneName||"short",o=t+"|"+i,r=e[o];return r||(r=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",timeZoneName:i}),e[o]=r),r}(n,i);return r.formatToParts(o)},u=function(e,n){for(var i=a(e,n),r=[],u=0;u<i.length;u+=1){var f=i[u],s=f.type,m=f.value,c=t[s];c>=0&&(r[c]=parseInt(m,10));}var d=r[3],l=24===d?0:d,h=r[0]+"-"+r[1]+"-"+r[2]+" "+l+":"+r[4]+":"+r[5]+":000",v=+e;return (o.utc(h).valueOf()-(v-=v%1e3))/6e4},f=i.prototype;f.tz=function(t,e){void 0===t&&(t=r);var n=this.utcOffset(),i=this.toDate(),a=i.toLocaleString("en-US",{timeZone:t}),u=Math.round((i-new Date(a))/1e3/60),f=o(a,{locale:this.$L}).$set("millisecond",this.$ms).utcOffset(15*-Math.round(i.getTimezoneOffset()/15)-u,!0);if(e){var s=f.utcOffset();f=f.add(n-s,"minute");}return f.$x.$timezone=t,f},f.offsetName=function(t){var e=this.$x.$timezone||o.tz.guess(),n=a(this.valueOf(),e,{timeZoneName:t}).find((function(t){return "timezonename"===t.type.toLowerCase()}));return n&&n.value};var s=f.startOf;f.startOf=function(t,e){if(!this.$x||!this.$x.$timezone)return s.call(this,t,e);var n=o(this.format("YYYY-MM-DD HH:mm:ss:SSS"),{locale:this.$L});return s.call(n,t,e).tz(this.$x.$timezone,!0)},o.tz=function(t,e,n){var i=n&&e,a=n||e||r,f=u(+o(),a);if("string"!=typeof t)return o(t).tz(a);var s=function(t,e,n){var i=t-60*e*1e3,o=u(i,n);if(e===o)return [i,e];var r=u(i-=60*(o-e)*1e3,n);return o===r?[i,o]:[t-60*Math.min(o,r)*1e3,Math.max(o,r)]}(o.utc(t,i).valueOf(),f,a),m=s[0],c=s[1],d=o(m).utcOffset(c);return d.$x.$timezone=a,d},o.tz.guess=function(){return Intl.DateTimeFormat().resolvedOptions().timeZone},o.tz.setDefault=function(t){r=t;};}})); 
} (timezone$1));

var timezoneExports = timezone$1.exports;
var timezone = /*@__PURE__*/getDefaultExportFromCjs(timezoneExports);

var utc$1 = {exports: {}};

(function (module, exports) {
	!function(t,i){module.exports=i();}(commonjsGlobal,(function(){var t="minute",i=/[+-]\d\d(?::?\d\d)?/g,e=/([+-]|\d\d)/g;return function(s,f,n){var u=f.prototype;n.utc=function(t){var i={date:t,utc:!0,args:arguments};return new f(i)},u.utc=function(i){var e=n(this.toDate(),{locale:this.$L,utc:!0});return i?e.add(this.utcOffset(),t):e},u.local=function(){return n(this.toDate(),{locale:this.$L,utc:!1})};var o=u.parse;u.parse=function(t){t.utc&&(this.$u=!0),this.$utils().u(t.$offset)||(this.$offset=t.$offset),o.call(this,t);};var r=u.init;u.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds();}else r.call(this);};var a=u.utcOffset;u.utcOffset=function(s,f){var n=this.$utils().u;if(n(s))return this.$u?0:n(this.$offset)?a.call(this):this.$offset;if("string"==typeof s&&(s=function(t){void 0===t&&(t="");var s=t.match(i);if(!s)return null;var f=(""+s[0]).match(e)||["-",0,0],n=f[0],u=60*+f[1]+ +f[2];return 0===u?0:"+"===n?u:-u}(s),null===s))return this;var u=Math.abs(s)<=16?60*s:s,o=this;if(f)return o.$offset=u,o.$u=0===s,o;if(0!==s){var r=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(o=this.local().add(u+r,t)).$offset=u,o.$x.$localOffset=r;}else o=this.utc();return o};var h=u.format;u.format=function(t){var i=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return h.call(this,i)},u.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*t},u.isUTC=function(){return !!this.$u},u.toISOString=function(){return this.toDate().toISOString()},u.toString=function(){return this.toDate().toUTCString()};var l=u.toDate;u.toDate=function(t){return "s"===t&&this.$offset?n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():l.call(this)};var c=u.diff;u.diff=function(t,i,e){if(t&&this.$u===t.$u)return c.call(this,t,i,e);var s=this.local(),f=n(t).local();return c.call(s,f,i,e)};}})); 
} (utc$1));

var utcExports = utc$1.exports;
var utc = /*@__PURE__*/getDefaultExportFromCjs(utcExports);

var relativeTime$1 = {exports: {}};

(function (module, exports) {
	!function(r,e){module.exports=e();}(commonjsGlobal,(function(){return function(r,e,t){r=r||{};var n=e.prototype,o={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function i(r,e,t,o){return n.fromToBase(r,e,t,o)}t.en.relativeTime=o,n.fromToBase=function(e,n,i,d,u){for(var f,a,s,l=i.$locale().relativeTime||o,h=r.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],m=h.length,c=0;c<m;c+=1){var y=h[c];y.d&&(f=d?t(e).diff(i,y.d,!0):i.diff(e,y.d,!0));var p=(r.rounding||Math.round)(Math.abs(f));if(s=f>0,p<=y.r||!y.r){p<=1&&c>0&&(y=h[c-1]);var v=l[y.l];u&&(p=u(""+p)),a="string"==typeof v?v.replace("%d",p):v(p,n,y.l,s);break}}if(n)return a;var M=s?l.future:l.past;return "function"==typeof M?M(a):M.replace("%s",a)},n.to=function(r,e){return i(r,e,this,!0)},n.from=function(r,e){return i(r,e,this)};var d=function(r){return r.$u?t.utc():t()};n.toNow=function(r){return this.to(d(this),r)},n.fromNow=function(r){return this.from(d(this),r)};}})); 
} (relativeTime$1));

var relativeTimeExports = relativeTime$1.exports;
var relativeTime = /*@__PURE__*/getDefaultExportFromCjs(relativeTimeExports);

/**
 * Parses a datetime string and returns a Day.js object with the specified timezone.
 * @param datetime - The datetime string to parse.
 * @param tz - The timezone to convert the datetime string to (default: America/New_York).
 * @returns A Day.js object representing the parsed datetime string in the specified timezone.
 */
const parseDate = (datetime, tz = 'America/New_York') => {
    // Configure dayjs to use UTC and timezone plugins
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(relativeTime);
    // Parse the datetime string and convert it to the specified timezone
    const parsedDate = dayjs(datetime);
    const parsedDateTz = parsedDate.tz(tz, true);
    return parsedDateTz;
};

/**
 * Formats a datetime string in a specific timezone and format.
 *
 * @param datetime The datetime string to format.
 * @param format The format string to use.
 * @param tz The timezone string to use. Defaults to 'America/New_York'.
 * @returns The formatted datetime string.
 */
function datetime(datetime, format, tz) {
    if (!datetime || anyToString(datetime).length === 0)
        return '';
    // Get the user's timezone
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Parse The Date and Use the default timezone if a timezone is not specified
    const parsedDate = parseDate(datetime, typeof tz === 'string' ? tz : undefined);
    // Format the date string in the user's timezone using the specified format
    return parsedDate.tz(userTz).format(format);
}

/**
 * Handlebars helper function to extract data from a maplibre feature and use it in a provided template.
 *
 * @remarks
 * This helper function is designed to integrate Maplibre data with Handlebars templating.
 * The feature data is passed in the options object under the key `feature`.
 *
 * @example
 * ```hbs
 * {{feature "{{source}}" }}
 * ```
 *
 * @param handlebarsExpression - A string representing the Handlebars expression
 * @param options - The options object automatically provided by Handlebars when invoking a helper.
 * @returns The rendered template string after applying the Maplibre feature data.
 */
function feature(handlebarsExpression, options) {
    var _a;
    const featureData = (((_a = options.data) === null || _a === void 0 ? void 0 : _a.feature) || {});
    return Handlebars.compile(handlebarsExpression)(featureData);
}

function toKeyValueArray(obj) {
    if (Array.isArray(obj)) {
        // Array
        return obj.map((value, index) => [index, value]);
    }
    else if (obj instanceof Set) {
        // Set
        return Array.from(obj, (value) => [value, value]);
    }
    else if (obj instanceof Map) {
        // Map
        return Array.from(obj.entries());
    }
    else if (typeof obj === 'object' && obj !== null) {
        // Plain object
        return Object.entries(obj);
    }
    else {
        return undefined;
    }
}

/**
 * Registers the 'each' helper function for the given Handlebars instance.
 * @param this The Handlebars this instance.
 * @param ctx The context object or value to iterate over.
 * @param options The Handlebars helper options, including the main template function and the inverse function.
 * @returns A string containing the result of applying the template function to the context object or value.
 */
function each (ctx, options) {
    if (!options) {
        throw new handlebarsExports.Exception("Must pass iterator to #each");
    }
    const { fn, inverse, data } = options;
    let returnValues = [];
    // If a function is passed in, run that function
    if (typeof ctx === 'function') {
        ctx = typeof ctx === "function" ? ctx.call(this) : ctx;
    }
    else if (typeof ctx === 'string') {
        // If a string comes in, it might be a JSON object, so check
        try {
            ctx = JSON.parse(ctx);
        }
        finally { }
    }
    // Add a _parent to the data
    const dataWithParent = { ...data, _parent: data };
    if (ctx !== undefined && ctx !== null) {
        if (typeof ctx === 'object') {
            const ctxArray = toKeyValueArray(ctx);
            if (ctxArray) {
                returnValues = ctxArray.map(([key, value], index, array) => {
                    const augmentedData = {
                        ...{
                            key,
                            index,
                            value,
                            first: index === 0,
                            last: index === array.length - 1,
                        },
                        ...(dataWithParent || {})
                    };
                    return fn(value, {
                        data: augmentedData,
                        blockParams: [value, key],
                    });
                });
            }
        }
        else {
            // It's not iterable, so just return it as a string
            returnValues = [(anyToString(ctx))];
        }
    }
    return returnValues.length ? returnValues.join('') : inverse(this);
}

/**
 * Builds a JSON object from the input arguments and returns its string representation.
 *
 * @param {HelperOptions} options - The handlebars options object, which contains the hash.
 * @returns { [key: string]: unknown }  A JSON object built from the input arguments.
 */
function hash(options) {
    // Grab the hash from options
    return Object.entries(options.hash || {})
        .reverse() // For some reason handlebars reverses the order
        .reduce((a, [k, v]) => ({ ...a, ...{ [k]: v } }), {});
}

const safeTags = [
    'a', 'abbr', 'acronym', 'address', 'article', 'aside', 'b', 'bdi', 'bdo', 'big',
    'blockquote', 'br', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data',
    'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em',
    'fieldset', 'figcaption', 'figure', 'font', 'footer', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'header', 'hr', 'i', 'img', 'ins', 'kbd', 'legend', 'li', 'main', 'mark',
    'menu', 'menuitem', 'meter', 'nav', 'ol', 'optgroup', 'option', 'output', 'p', 'pre',
    'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'span',
    'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'time', 'tr', 'tt', 'u', 'ul', 'var', 'wbr'
];
/**
 * A Handlebars helper that creates an HTML element with the specified tag name and attributes,
 * sets its inner HTML to the content rendered by the helper, and returns the outer HTML of the element.
 * @param this - The context object passed to the Handlebars helper.
 * @param type - The tag name of the element to create (e.g. "div", "span", etc.).
 * @param options - The options object passed to the Handlebars helper, which contains the content to render.
 * @returns The outer HTML of the created element, including its tag name, attributes, and inner HTML content.
 */
function htmlElement(type, options) {
    // Default to span if no tag name is provided
    if (typeof type !== 'string' && options === undefined) {
        options = type;
        type = 'span';
    }
    if (safeTags.indexOf(type) === -1) {
        throw new handlebarsExports.Exception(`htmlElement Error, type ${type} is not allowed.`);
    }
    // Create a new element with the specified tag name
    const el = document.createElement(type);
    // Set any attributes specified in the options hash on the element
    Object.entries((options.hash || {})).forEach(entry => {
        el.setAttribute(...entry);
    });
    // Render the content using Handlebars and set it as the inner HTML of the element
    el.innerHTML = options.fn ? options.fn(this) : '';
    // Return the outer HTML of the element
    return new handlebarsExports.SafeString(el.outerHTML).toString();
}

const handleArgs = (iconName, ...args) => {
    const isOptions = (arg) => typeof arg === 'object' && 'data' in arg;
    let altText, options;
    args.forEach(arg => {
        if (isOptions(arg)) {
            options = arg;
        }
        else if (typeof arg === 'string') {
            altText = arg;
        }
    });
    return { altText: (altText || iconName), options: options }; // The '!' asserts that options will be defined.
};
/**
 * Returns the HTML string for an icon image.
 * @param iconName The name of the icon image.
 * @param altText Optional alternate text for the image.
 * @param size Optional size of the image in pixels.
 * @returns The HTML string for the icon image.
 */
function icon(iconName, ...args) {
    const { altText, options } = handleArgs(iconName, ...args);
    const map = options.data.map;
    // Look for the image in the style
    const styleImage = map.style.getImage(iconName);
    const { data } = styleImage || {};
    if (data) {
        const imageData = new ImageData(Uint8ClampedArray.from(data.data), data.width, data.height);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx === null || ctx === void 0 ? void 0 : ctx.putImageData(imageData, 0, 0);
        const image = new Image();
        image.src = canvas.toDataURL();
        image.classList.add('maplibre-icon');
        image.title = image.alt = altText.toString();
        // Resize for retina
        const screenPixelDensity = window.devicePixelRatio || 1;
        image.style.width = `${canvas.width / screenPixelDensity}px`;
        image.style.height = `${canvas.height / screenPixelDensity}px`;
        return image.outerHTML;
    }
    // Return an empty string if the image data is not found
    return '';
}

const operators$2 = {
    '!=': (v1, v2) => v1 != v2,
    '!==': (v1, v2) => v1 !== v2,
    '==': (v1, v2) => v1 == v2,
    '===': (v1, v2) => v1 === v2,
    '<': (v1, v2) => v1 < v2,
    '<=': (v1, v2) => v1 <= v2,
    '>': (v1, v2) => v1 > v2,
    '>=': (v1, v2) => v1 >= v2,
    '&&': (v1, v2) => v1 && v2,
    '||': (v1, v2) => v1 || v2
};
function ifCompare(v1, operator, v2) {
    const operation = operators$2[operator];
    return operation ? (operation(v1, v2) ? 'true' : '') : '';
}

function anyToNumber(value, defaultNumber = 0) {
    let returnNumber = NaN;
    if (value != undefined && typeof value !== 'object') {
        returnNumber = Number(value);
    }
    return isNaN(returnNumber) ? defaultNumber : returnNumber;
}

const operators$1 = {
    '!=': (v1, v2) => v1 != v2,
    '!==': (v1, v2) => v1 !== v2,
    '==': (v1, v2) => v1 == v2,
    '===': (v1, v2) => v1 === v2,
    '<': (v1, v2) => anyToNumber(v1) < anyToNumber(v2),
    '<=': (v1, v2) => anyToNumber(v1) <= anyToNumber(v2),
    '>': (v1, v2) => anyToNumber(v1) > anyToNumber(v2),
    '>=': (v1, v2) => anyToNumber(v1) >= anyToNumber(v2),
    '&&': (v1, v2) => v1 && v2,
    '||': (v1, v2) => v1 || v2,
    '!!': (v1, v2) => !!v1 !== !!v2
};
function ifCond(v1, operator, v2, options) {
    // Check if the second parameter is an object (it should be options)
    if (typeof operator === 'object' && operator !== null) {
        options = operator;
        operator = '!!';
        v2 = undefined;
    }
    const operation = operators$1[operator];
    const inverse = options.inverse ? options.inverse : () => '';
    return operation ? (operation(v1, v2) ? options.fn(this) : inverse(this)) : inverse(this);
}

/**
 * A Handlebars helper function that acts as a ternary operator.
 * @param values The array of values: condition, trueValue, and falseValue (optional).
 * @returns The trueValue if the condition is true, or the falseValue if it's false.
 */
function is(...values) {
    values.pop();
    let [condition, trueValue, falseValue] = values;
    if (values.length === 2) {
        // No falseValue
        falseValue = '';
    }
    else if (values.length === 1) {
        // No trueValue and falseValue
        trueValue = '';
        falseValue = '';
    }
    else if (values.length === 0) {
        // Only options provided
        return '';
    }
    return condition ? trueValue : falseValue;
}

/**
 * A Handlebars helper function to join strings with a provided separator.
 *
 * @param {string} separator - The separator to use between string elements during the join operation.
 * @param {...Array<string | undefined | null>} values - The string values to join.
 * @returns {string} - The resulting string after joining the input values with the provided separator.
 */
function join(separator, ...values) {
    values.pop(); // Remove the options Object
    // If there's only one argument and it's an array, use its values instead
    if (values.length === 1 && Array.isArray(values[0])) {
        values = values[0];
    }
    // Filter out empty strings and undefined/null values, and convert everything else to string
    const filteredValues = values.map(anyToString).filter(v => v.length);
    // Join the filtered values with the provided separator
    return filteredValues.join(separator);
}

/**
 * Helper function to extract and convert JSON values from an object using Handlebars expressions.
 * @param exp The expression to extract the JSON values.
 * @returns The converted JSON values.
 */
function json(exp) {
    const regex = /^(\{.*\}|\[.*\])$/;
    let jsonValue = {};
    let subexps = [];
    if (regex.test(exp)) {
        // JSON obj passed in
        try {
            jsonValue = JSON.parse(exp);
        }
        finally { }
    }
    else {
        const [root, ...rest] = exp.split('.');
        subexps = rest;
        // Parse the JSON value from the root path of the expression
        try {
            jsonValue = JSON.parse(this[root] || '{}');
        }
        finally { }
    }
    if (subexps.length) {
        // Extract the remaining Handlebars expressions and convert them to their corresponding JSON values
        const handlebarsExpression = '{{' + subexps.join('.') + '}}';
        return Handlebars.compile(handlebarsExpression)(jsonValue);
    }
    else {
        return jsonValue;
    }
}

/**
 * Converts any input value into an array.
 * If the input is an object or a JSON string, it will be converted into a key-value array.
 * If the input is a non-object, non-array value, it will be returned as an array with a single element.
 *
 * @param {any} value - The input value to convert.
 * @throws {Error} If a JSON string is malformed and can't be parsed.
 * @returns {Array<key: string | number, value: any>} An array representing the key (or index) and value
 */
function anyToArray(value) {
    // Get the value as a string
    const strValue = anyToString(value);
    // If it's empty, return a blank array
    if (strValue.length === 0)
        return [];
    // Check if the value is a JSON string
    const isJson = /^(\{.*\}|\[.*\])$/.test(strValue);
    // Initialize the return array
    const returnArray = [];
    try {
        // If the value is JSON or an object
        if (isJson) {
            // Attempt to parse it
            const json = JSON.parse(strValue);
            // Convert the JSON object into a key-value array
            const keyValueArray = toKeyValueArray(json) || [];
            // Push each key-value pair to the return array
            keyValueArray.map(([k, v]) => returnArray.push({ key: k, value: v }));
        }
        else {
            // If the value is not an object, push it to the return array
            returnArray.push({ key: 0, value: value });
        }
    }
    catch (e) {
        // If JSON parsing fails, throw the error
        throw e;
    }
    // Return the final array
    return returnArray;
}

/**
 * A Handlebars helper function that maps JSON data to a template.
 * The function first transforms any input data into an array, and then applies
 * the provided Handlebars template to each item in the array.
 *
 * @param {any} input - The input data to map. If this is not an array, the function will transform it into one.
 * @param {string} template - A Handlebars template string. This will be applied to each item in the array.
 * @param {HelperOptions} options - The Handlebars helper options.
 * @returns {string} A string containing the rendered template.
 */
function jsonMap(input, template, options) {
    var _a, _b;
    // Some fallbacks to deal with handlebars weirdness
    input = template === undefined && options === undefined ? [] : input;
    options = options || template || input;
    template = typeof template === 'string' ? template : '';
    // Transform the input into an array
    const array = anyToArray(input);
    const delimiter = (_b = (_a = options === null || options === void 0 ? void 0 : options.hash) === null || _a === void 0 ? void 0 : _a.delimiter) !== null && _b !== void 0 ? _b : '\n';
    // Map each item in the array to the template
    const result = array
        .map((item, index) => {
        var _a;
        // Create an augmented data object, adding some additional properties
        const augmentedData = {
            key: item === null || item === void 0 ? void 0 : item.key,
            index,
            value: (_a = item === null || item === void 0 ? void 0 : item.value) !== null && _a !== void 0 ? _a : item,
            first: index === 0,
            last: index === array.length - 1
        };
        // Compile the template and apply it to the augmented data
        return Handlebars.compile(template.replace(/\[\[/gm, '{{').replace(/\]\]/gm, '}}'))(augmentedData);
    })
        .join(delimiter); // Join all rendered strings into a single string with newline separators
    //console.log('DELIMITER (', delimiter, ')', options);
    // Return the result as a Handlebars SafeString
    return new Handlebars.SafeString(result).toString();
}

/**
 * Helper function to create a link element.
 * @param url The URL to link to.
 * @param text The text to display for the link.
 * @returns The HTML string for the link element.
 * */
function link(url, text) {
    // Create a link element with the provided URL and text.
    const a = document.createElement('a');
    a.href = anyToString(url);
    a.target = '_blank';
    a.innerHTML = anyToString(text);
    // Return the HTML string for the link element.
    return a.outerHTML;
}

const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => a % b,
    '&': (a, b) => a & b,
    '|': (a, b) => a | b,
    '^': (a, b) => Math.pow(a, b),
    '<<': (a, b) => a << b,
    '>>': (a, b) => a >> b
};
/**
 * Provides access to the Math class functions.
 * @param fnName The name of the Math class function to call.
 * @param num The number to pass as the argument to the Math function.
 * @returns The result of calling the specified Math function with the given number.
 * @throws {Exception} If an invalid Math function name is provided.
 */
function math(fnName, ...values) {
    // Get the specified Math function by name
    fnName = anyToString(fnName);
    values.pop(); // Remove the Handlebars Object
    values = values.flatMap((item) => Array.isArray(item) ? item : [item]);
    const mathFn = Math[fnName.toLowerCase()] ||
        Math[fnName.toUpperCase()] ||
        operators[fnName];
    if (typeof mathFn === 'function') {
        return mathFn(...values);
    }
    else if (typeof mathFn === 'number') {
        return mathFn;
    }
    else {
        throw new handlebarsExports.Exception(`Invalid Math function name: ${fnName ? fnName : 'undefined'}`);
    }
}

/**
 * Searches a string for a regular expression match and returns the result.
 * @param str - The string to search for a match.
 * @param exp - The regular expression to search for.
 * @returns An array of matched substrings, or null if no match was found.
 * @throws An error if the regular expression is invalid.
 */
function regexpMatch(str, exp) {
    // Extract the pattern and flags from the regular expression
    const [, pattern, flags] = exp.match(/^\/(.+)\/(\w*)$/) || [];
    // Throw an exception if the pattern is empty or if the regular expression is invalid
    if (!pattern) {
        throw new handlebarsExports.Exception(`Invalid regular expression: ${exp}`);
    }
    // Create a new regular expression object with the extracted pattern and flags
    const regexp = new RegExp(pattern, flags);
    // Search the input string for a match with the regular expression
    return str.match(regexp);
}

/**
 * Replaces all occurrences of a regular expression in a string with a specified replacement.
 * @param str - The string to search for matches.
 * @param exp - The regular expression to search for.
 * @param replacement - The replacement string to use.
 * @returns The input string with all matches of the regular expression replaced with the replacement string.
 * @throws An error if the regular expression is invalid.
 */
function regexpReplace(str, exp, replacement) {
    // Ensure that the replacement value is a string
    replacement = typeof replacement === 'string' ? replacement : '';
    // Extract the pattern and flags from the regular expression
    const [, pattern, flags] = exp.match(/^\/(.+)\/(\w*)$/) || [];
    // Throw an error if the pattern is empty or if the regular expression is invalid
    if (!pattern) {
        throw new handlebarsExports.Exception(`Invalid regular expression: ${exp}`);
    }
    // Create a new regular expression object with the extracted pattern and flags
    const regexp = new RegExp(pattern, flags);
    // Replace all matches of the regular expression in the input string with the replacement value
    return str.replace(regexp, replacement);
}

/**
 * A Handlebars helper that sets the specified properties on the current context object.
 * @param this - The current context object.
 * @param options - The options object passed to the Handlebars helper, which contains the properties to set.
 */
function set (options) {
    // Set the properties in the options hash on the current context object
    Object.entries(options.hash).forEach(([k, v]) => {
        this[k] = v;
    });
}

/**
 * Split a string into an array based on a delimiter.
 *
 * @param str - The string to be split.
 * @param options - The handlebars options object, which contains the hash.
 * @returns {string[]} - The resulting array after splitting the string.
 */
function split(str, options) {
    var _a;
    str = anyToString(str);
    const delimiter = (_a = options.hash.delimiter) !== null && _a !== void 0 ? _a : ",";
    const split = str.split(delimiter);
    return split.filter(v => v.length).length ? split : '';
}

/**
 * Generates a nested HTML list (ul or ol) from a JSON string or object.
 *
 * @param input - The JSON string or object to convert to a list.
 * @param options - The Handlebars options object. If options.hash.ul is true, all lists will be unordered.
 * @returns {HTMLElement | undefined} - The root element of the generated HTML list, or undefined if the input is null, undefined, or an empty string.
 */
function jsonAsList(input, options) {
    // Return undefined if the input is null, undefined, or an empty string.
    if (input === null || input === undefined || input === '') {
        return undefined;
    }
    // If the input is not already an object, attempt to parse it as JSON.
    let obj = typeof input === 'object' ? input : {};
    try {
        if (typeof input !== 'object') {
            obj = JSON.parse(input);
        }
    }
    catch (e) {
        obj = {};
    }
    // Create a new ordered list (ol) if the input is an array and options.hash.ul isn't true; otherwise create an unordered list (ul).
    const list = document.createElement(Array.isArray(obj) && !options.hash.ul ? 'ol' : 'ul');
    // Iterate over the key-value pairs of the input object.
    Object.entries(obj).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
            return undefined;
        }
        const li = document.createElement('li');
        // Don't include the key in the list item if the input object is an array, since arrays are inherently ordered.
        const keyString = Array.isArray(obj) ? '' : `${key}: `;
        // If the value is a non-null object, recursively generate a nested list for it.
        if (typeof value === 'object') {
            li.innerHTML = keyString;
            let item = jsonAsList(value, options);
            if (item)
                li.appendChild(item);
        }
        else {
            // If the value is not an object, include it directly in the list item.
            li.innerHTML = `${keyString}${value}`;
        }
        // Add the list item to the list.
        list.appendChild(li);
    });
    return list.children.length > 0 ? list : undefined;
}

/**
 * This function creates a table row for a given key-value pair.
 * It checks if the value is a JSON and converts it to a list if it is.
 *
 * @param key - The key to use as the label of the table cell.
 * @param value - The value to be displayed in the table cell.
 * @param options - The Handlebars helper options, which are passed to jsonAsList function.
 * @returns A string representing an HTML table row or undefined if valueAsString is falsy.
 */
function createRow(key, value, options) {
    const isJson = /^(\{.*\}|\[.*\])$/.test(value);
    let valueAsString = anyToString(value);
    if (isJson) {
        let element = jsonAsList(value, options);
        if (element)
            valueAsString = element.outerHTML;
    }
    return valueAsString ? `<tr><td style="font-weight: 700;">${key}</td><td>${valueAsString}</td></tr>` : undefined;
}
/**
 * This function takes an object or a string that can be parsed into an object,
 * and generates an HTML table with each key-value pair represented as a row in the table.
 *
 * @param rows - The input string or object that will be turned into an HTML table.
 * @param options - The Handlebars helper options.
 * @returns A string representing an HTML table.
 */
function table(rows, options) {
    var _a, _b;
    if (!options) {
        options = rows;
        rows = ((_b = (_a = options.data) === null || _a === void 0 ? void 0 : _a.feature) === null || _b === void 0 ? void 0 : _b.properties) || {};
    }
    const rowJson = typeof rows === 'object' ? rows : JSON.parse(rows.toString());
    const tableRows = [];
    for (let [key, value] of Object.entries(rowJson)) {
        const row = createRow(key, anyToString(value), options);
        if (anyToString(row).length > 0) {
            tableRows.push(row);
        }
    }
    return `<table>${tableRows.join('\n')}</table>`;
}

/**
 * Parses a date string or object using the specified time zone, or the user's time zone if none is provided.
 * @param tz1 - The time zone to use for parsing the date string or object.
 * @param datetime2 - The date string or object to parse.
 * @param tz2 - Optional. The time zone to use for parsing datetime2, if it is a string.
 * @returns A Day.js object representing the parsed date and time.
 */
function parseTime2(tz1, datetime2, tz2) {
    let parsedTime;
    if (datetime2 !== undefined && typeof datetime2 !== 'object') {
        // If datetime2 is a string, parse it using tz2 or tz1 if tz2 is not provided
        if (typeof tz2 !== 'string')
            tz2 = tz1;
        parsedTime = parseDate(datetime2, tz2);
    }
    else {
        // If datetime2 is not a string or is undefined, use the user's time zone
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        parsedTime = parseDate(new Date().toISOString(), userTz);
    }
    return parsedTime;
}
/**
 * Calculates the time difference between two dates in the specified time zones.
 * @param datetime1 - The first date and time, in ISO format or as a Date object.
 * @param tz1 - The time zone of datetime1.
 * @param datetime2 - The second date and time, in ISO format or as a Date object.
 * @param tz2 - The time zone of datetime2.
 * @returns A string representing the time difference between datetime1 and datetime2, in human-readable format.
 */
function timediffStr(datetime1, tz1, datetime2, tz2) {
    // Use America/New_York as the default time zone if none is provided for tz1
    if (typeof tz1 !== 'string')
        tz1 = 'America/New_York';
    // Parse datetime1 using tz1
    const parsedTime = parseDate(datetime1, tz1);
    // Parse datetime2 using tz2 or tz1 if tz2 is not provided
    const parsedTime2 = parseTime2(tz1, datetime2, tz2);
    // Calculate the time difference between the two dates
    if (parsedTime.isAfter(parsedTime2)) {
        return parsedTime2.to(parsedTime);
    }
    else {
        return parsedTime.from(parsedTime2);
    }
}

/**
 * Calculates the time difference between two dates in the specified time zones, in seconds.
 * @param datetime1 - The first date and time, in ISO format or as a Date object.
 * @param tz1 - The time zone of datetime1.
 * @param datetime2 - The second date and time, in ISO format or as a Date object.
 * @param tz2 - The time zone of datetime2.
 * @returns The time difference between datetime1 and datetime2, in seconds.
 */
function timediff(datetime1, tz1, datetime2, tz2) {
    // Use America/New_York as the default time zone if none is provided for tz1
    if (typeof tz1 !== 'string')
        tz1 = 'America/New_York';
    // Parse datetime1 using tz1
    const parsedTime1 = parseDate(datetime1, tz1);
    // Parse datetime2 using tz2 or tz1 if tz2 is not provided
    const parsedTime2 = parseTime2(tz1, datetime2, tz2);
    // Calculate the time difference between the two dates in seconds
    return parsedTime1.diff(parsedTime2, 'seconds');
}

/**
 * Converts a string to an integer.
 * @param str - The string to convert to an integer.
 * @returns The integer value of the string.
 */
function convertToInt(str) {
    return parseInt(str, 10);
}

/**
 * Converts a string to lower case.
 * @param str - The string to convert to lower case.
 * @returns The lower case string.
 */
function toLowerCase(str) {
    return anyToString(str).toLowerCase();
}

/**
 * Converts an value to a string.
 * @param value - The value to convert to a string.
 * @returns The integer value of the string.
 */
function convertToString(value, options) {
    return options && anyToString(value);
}

/**
 * Convert a string to title case, with exceptions for certain words.
 * @param str The string to convert.
 * @returns The converted string.
 */
const defaultExceptions = [
    'a',
    'an',
    'and',
    'at',
    'but',
    'by',
    'for',
    'in',
    'nor',
    'of',
    'on',
    'or',
    'so',
    'the',
    'to',
    'up',
    'yet',
];
function toTitleCase$1(str, exceptions = defaultExceptions) {
    str = anyToString(str);
    const words = str.toLowerCase().split(' ');
    const result = [];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (i === 0 || !exceptions.includes(word)) {
            result.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
        else {
            result.push(word);
        }
    }
    return result.join(' ');
}

/**
 * Converts a string to Title case.
 * @param str - The string to convert to Title case.
 * @returns The Title case string.
 */
function toTitleCase(str) {
    return toTitleCase$1(str);
}

/**
 * Converts a string to uppercase.
 * @param str The string to convert.
 * @returns The string in uppercase.
 */
function toUpperCase(str) {
    return anyToString(str).toUpperCase();
}

/**
 * Converts a partial CSSStyleDeclaration object to a CSS string.
 * @param styleDec - The CSSStyleDeclaration object to convert.
 * @returns The CSS string representation of the style declaration.
 */
function getStyleStr(styleDec) {
    // Convert the style declaration object to an array of key-value pairs
    return Object.entries(styleDec)
        // Map each key-value pair to a string in the format "property:value"
        .map(([k, v]) => `${camelToKebab(k)}:${v}`)
        // Join the strings together with semicolons to form the final CSS string
        .join(';');
}
const camelToKebab = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Truncates a string to a certain length, and adds an ellipsis or a given final character if truncated.
 * @param str The string to truncate.
 * @param length The maximum length of the truncated string.
 * @param finalCharacter Optional. The final character to add if truncated.
 * @param options Optional. Additional options for the Handlebars helper.
 * @returns The truncated string with the specified options and formatting.
 */
function truncateString(str, length, finalCharacter, options) {
    // Check if finalCharacter is missing and options is the final parameter
    if (typeof finalCharacter === 'object') {
        options = finalCharacter;
        finalCharacter = undefined;
    }
    // Determine the length of the string based on the parameter type
    if (!isNaN(anyToNumber(length, NaN))) {
        length = `${anyToNumber(length)}px`;
    }
    const spanStyle = getStyleStr({
        display: 'inline-block',
        maxWidth: length,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        verticalAlign: 'middle',
        textOverflow: finalCharacter ? `"${finalCharacter}"` : 'ellipsis'
    });
    // Create a new <span> element with specified styling
    return htmlElement.call(this, 'span', {
        ...options,
        hash: { 'style': spanStyle },
        fn: () => handlebarsExports.escapeExpression(str)
    });
}

var customHelpers = {
    all,
    any,
    coalesce,
    color,
    datetime,
    feature,
    each,
    hash,
    htmlElement,
    icon,
    ifCompare,
    ifCond,
    is,
    join,
    json,
    jsonMap,
    link,
    math,
    regexpMatch,
    regexpReplace,
    set,
    split,
    table,
    timediff,
    timediffStr,
    toInt: convertToInt,
    toLowerCase,
    toString: convertToString,
    toTitleCase,
    toUpperCase,
    truncate: truncateString
};

/**
 * Find all tags with the specified tagName in the given template.
 * @param template - A Handlebars template string.
 * @param tagName - The name of the tag to find.
 * @returns An array of Tag objects with content, startColumn, endColumn, and innerContent properties.
 */
function findTags(template, tagNames, suppressErrors = false) {
    // Convert string to an array with that string as the only element,
    // or filter out undefined values from the array if the input is already an array.
    // This ensures that the tagNames variable is always an array and never undefined.
    tagNames = typeof tagNames === 'string'
        ? [tagNames]
        : tagNames.filter(v => v !== undefined);
    const tagRegexp = new RegExp(`{{\\s*(?:([#\\/])\\s*)?(${tagNames.join('|')})(?:\\s+[^{]*?)?\\s*}}`, 'g');
    const line = template.replace(/\n/g, '');
    const stack = [];
    const results = [];
    let match;
    while ((match = tagRegexp.exec(line)) !== null) {
        if (match[1] === '#') {
            // This is a start tag
            stack.push({ match, startColumn: (match.index || 0) + 1 });
        }
        else if (match[1] === '/') {
            // This is an end tag
            if (stack.length === 0) {
                // This is an end tag
                if (stack.length === 0) {
                    if (suppressErrors) {
                        return [];
                    }
                    else {
                        throw new Error(`Mismatched start and end {{${tagNames.join(', ')}}} tags`);
                    }
                }
            }
            const startInfo = stack.pop();
            const endColumn = ((match.index || 0) + match[0].length);
            const innerContent = line.slice((startInfo.startColumn + startInfo.match[0].length - 1), (match.index || 0));
            const content = line.slice(startInfo.startColumn - 1, endColumn);
            results.push({ content, startColumn: startInfo.startColumn, endColumn, innerContent });
        }
        else {
            // It's a standalone tag
            const startColumn = (match.index || 0) + 1;
            const endColumn = ((match.index || 0) + match[0].length);
            const content = line.slice(startColumn - 1, endColumn);
            const innerContent = '';
            results.push({ content, startColumn, endColumn, innerContent });
        }
    }
    return results;
}

class LintHelper {
    constructor(hbs) {
        this.hbs = hbs;
    }
    /**
     * Parse an error message and extract the error type, line, and column information.
     * @param message - The error message to parse.
     * @param template - The template string where the error occurred.
     * @returns An object containing the error type, line, and column information.
     */
    parseErrorMessage(message, template) {
        // Define error types and their corresponding regular expressions and position extractors
        let pos = {};
        // Define error types and their corresponding regular expressions and position extractors
        const errorTypes = {
            parse: {
                regexp: /^Parse error on line (\d+):\n?(.+?)?$/s,
                getPosition: (match) => ({ line: (Number(match[1]) || 1), origError: match[2] }),
            },
            'mismatched helper': {
                regexp: /^(.+?) doesn't match (.+?) - (\d+):(\d+)$/,
                getPosition: (match) => {
                    const [, tag1, tag2, reportedLine, reportedCol] = match;
                    const tags = findTags(template, [tag1, tag2], true);
                    const idx = this.findFailingExp(tags);
                    const defaultPosition = {
                        column: Number(reportedCol),
                        helperName: match[1],
                        line: Number(reportedLine),
                        origError: `${tag1} doesn't match ${tag2} - ${reportedLine}:${reportedCol}`,
                    };
                    if (idx !== undefined) {
                        // Default to the first one found
                        const start = this.columnToLineCol(template, tags[idx].startColumn);
                        const end = this.columnToLineCol(template, tags[idx].endColumn);
                        return {
                            ...defaultPosition,
                            line: start.line,
                            column: start.column,
                            endLine: end.line,
                            endColumn: end.column,
                        };
                    }
                    else {
                        return defaultPosition;
                    }
                }
            },
            'unknown helper': {
                regexp: /^Missing helper: "(.+?)"$/,
                getPosition: (match) => {
                    const helperName = match[1];
                    const tags = findTags(template, helperName, true);
                    if (tags.length) {
                        const start = this.columnToLineCol(template, tags[0].startColumn);
                        const end = this.columnToLineCol(template, tags[0].endColumn);
                        return {
                            line: start.line,
                            column: start.column,
                            endLine: end.line,
                            endColumn: end.column,
                            origError: `Helper command ${helperName} does not exist`,
                            helperName: match[1]
                        };
                    }
                    else {
                        return {
                            origError: `Helper command ${helperName} does not exist`,
                            helperName: match[1]
                        };
                    }
                },
            },
            helper: {
                regexp: /^Error with helper (.+?) from line (\d+) col (\d+) to line (\d+) col (\d+):\n(.+?)\n/,
                getPosition: (match) => ({
                    column: Number(match[3]),
                    endColumn: Number(match[5]),
                    endLine: Number(match[4]),
                    helperName: match[1],
                    line: Number(match[2]),
                    origError: match[6],
                }),
            },
            iterator: {
                regexp: /^Must pass iterator to (.+)/,
                getPosition: (match) => {
                    // Try to find that iterator in the string
                    const iterators = findTags(template, match[1].replace(/^#/, ''), true);
                    const idx = this.findFailingExp(iterators);
                    if (idx !== undefined) {
                        // Default to the first one found
                        const start = this.columnToLineCol(template, iterators[idx].startColumn);
                        const end = this.columnToLineCol(template, iterators[idx].endColumn);
                        return {
                            line: start.line,
                            column: start.column,
                            endLine: end.line,
                            endColumn: end.column,
                            origError: match[6],
                            helperName: match[1]
                        };
                    }
                    else {
                        return {
                            origError: `Must pass iterator to ${match[1]}`,
                            helperName: match[1]
                        };
                    }
                },
            }
        };
        const lines = template.replace(/\\/g, ' ').split('\n');
        const maxExtent = {
            column: 1,
            endColumn: Infinity,
            endLine: lines.length,
            errMsg: message,
            line: 1,
            type: 'unknown',
            origError: message,
            helperName: 'unknown'
        };
        // Find the error type and position in the message
        for (const [type, { regexp, getPosition }] of Object.entries(errorTypes)) {
            const match = message.match(regexp);
            if (match) {
                pos = { type, ...getPosition(match) };
                break;
            }
        }
        // Ensure position values are within valid bounds
        const finalPosition = {
            column: Math.max(maxExtent.column, pos.column || -Infinity),
            endColumn: Math.min(maxExtent.endColumn, pos.endColumn || Infinity),
            endLine: Math.min(maxExtent.endLine, pos.endLine || Infinity),
            errMsg: pos.origError || maxExtent.origError,
            line: Math.max(maxExtent.line, pos.line || -Infinity),
            type: pos.type || maxExtent.type,
            helperName: pos.helperName
        };
        finalPosition.column = Math.min(finalPosition.column, lines[finalPosition.line - 1].length);
        finalPosition.endColumn = Math.min(finalPosition.endColumn, lines[finalPosition.endLine - 1].length);
        return {
            message: `${finalPosition.type} error from line ${finalPosition.line} column ${finalPosition.column} to line ${finalPosition.endLine} column ${finalPosition.endColumn}:${finalPosition.errMsg ? `\n${finalPosition.errMsg}` : ''}`,
            ...finalPosition,
        };
    }
    /**
     * Find the failing expression index in the given array of expressions.
     * @param expressions - An array of expressions with content, startColumn, endColumn, and innerContent properties.
     * @returns The index of the failing expression or undefined if no failing expression is found.
     */
    findFailingExp(expressions) {
        for (let i = 0; i < expressions.length; i++) {
            const template = expressions[i].content.replace(expressions[i].innerContent, '');
            try {
                this.hbs.applyHandlebarsTemplate(template, {}, this.hbs.options.handlebarsRuntimeOptions, true);
            }
            catch (e) {
                return i;
            }
        }
        return undefined;
    }
    /**
     * Converts a character position to a line and column number in a template string.
     * @param template The template string.
     * @param column The position of the character.
     * @returns An object containing the line and column numbers.
     * @throws An error if the character index is out of bounds.
     */
    columnToLineCol(template, pos) {
        const lines = template.replace(/\\/g, '').split('\n');
        let currentPos = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (pos > currentPos && pos <= (currentPos + line.length)) {
                return { line: i + 1, column: pos - currentPos };
            }
            currentPos += line.length;
        }
        throw new Error('Character index is out of bounds');
    }
    /**
     * Converts an error into a Handlebars exception.
     * @param e - The error to convert to a Handlebars exception.
     * @returns The resulting Handlebars exception.
     */
    toException(e) {
        let exceptionError = new handlebarsExports.Exception('');
        if (typeof e === 'string') {
            // If the input is a string, set its message as the message of the exception
            exceptionError.message = e;
        }
        else if (e instanceof Error) {
            // If the input is an Error, set its message, name, and stack as those of the exception
            exceptionError.message = e.message;
            exceptionError.name = e.name;
            exceptionError.stack = e.stack;
        }
        else {
            // Otherwise, assume it is already a Handlebars exception
            exceptionError = e;
        }
        return exceptionError;
    }
}

/**
 * Map of named character references.
 *
 * @type {Record<string, string>}
 */
const characterEntities = {
  AElig: 'Æ',
  AMP: '&',
  Aacute: 'Á',
  Abreve: 'Ă',
  Acirc: 'Â',
  Acy: 'А',
  Afr: '𝔄',
  Agrave: 'À',
  Alpha: 'Α',
  Amacr: 'Ā',
  And: '⩓',
  Aogon: 'Ą',
  Aopf: '𝔸',
  ApplyFunction: '⁡',
  Aring: 'Å',
  Ascr: '𝒜',
  Assign: '≔',
  Atilde: 'Ã',
  Auml: 'Ä',
  Backslash: '∖',
  Barv: '⫧',
  Barwed: '⌆',
  Bcy: 'Б',
  Because: '∵',
  Bernoullis: 'ℬ',
  Beta: 'Β',
  Bfr: '𝔅',
  Bopf: '𝔹',
  Breve: '˘',
  Bscr: 'ℬ',
  Bumpeq: '≎',
  CHcy: 'Ч',
  COPY: '©',
  Cacute: 'Ć',
  Cap: '⋒',
  CapitalDifferentialD: 'ⅅ',
  Cayleys: 'ℭ',
  Ccaron: 'Č',
  Ccedil: 'Ç',
  Ccirc: 'Ĉ',
  Cconint: '∰',
  Cdot: 'Ċ',
  Cedilla: '¸',
  CenterDot: '·',
  Cfr: 'ℭ',
  Chi: 'Χ',
  CircleDot: '⊙',
  CircleMinus: '⊖',
  CirclePlus: '⊕',
  CircleTimes: '⊗',
  ClockwiseContourIntegral: '∲',
  CloseCurlyDoubleQuote: '”',
  CloseCurlyQuote: '’',
  Colon: '∷',
  Colone: '⩴',
  Congruent: '≡',
  Conint: '∯',
  ContourIntegral: '∮',
  Copf: 'ℂ',
  Coproduct: '∐',
  CounterClockwiseContourIntegral: '∳',
  Cross: '⨯',
  Cscr: '𝒞',
  Cup: '⋓',
  CupCap: '≍',
  DD: 'ⅅ',
  DDotrahd: '⤑',
  DJcy: 'Ђ',
  DScy: 'Ѕ',
  DZcy: 'Џ',
  Dagger: '‡',
  Darr: '↡',
  Dashv: '⫤',
  Dcaron: 'Ď',
  Dcy: 'Д',
  Del: '∇',
  Delta: 'Δ',
  Dfr: '𝔇',
  DiacriticalAcute: '´',
  DiacriticalDot: '˙',
  DiacriticalDoubleAcute: '˝',
  DiacriticalGrave: '`',
  DiacriticalTilde: '˜',
  Diamond: '⋄',
  DifferentialD: 'ⅆ',
  Dopf: '𝔻',
  Dot: '¨',
  DotDot: '⃜',
  DotEqual: '≐',
  DoubleContourIntegral: '∯',
  DoubleDot: '¨',
  DoubleDownArrow: '⇓',
  DoubleLeftArrow: '⇐',
  DoubleLeftRightArrow: '⇔',
  DoubleLeftTee: '⫤',
  DoubleLongLeftArrow: '⟸',
  DoubleLongLeftRightArrow: '⟺',
  DoubleLongRightArrow: '⟹',
  DoubleRightArrow: '⇒',
  DoubleRightTee: '⊨',
  DoubleUpArrow: '⇑',
  DoubleUpDownArrow: '⇕',
  DoubleVerticalBar: '∥',
  DownArrow: '↓',
  DownArrowBar: '⤓',
  DownArrowUpArrow: '⇵',
  DownBreve: '̑',
  DownLeftRightVector: '⥐',
  DownLeftTeeVector: '⥞',
  DownLeftVector: '↽',
  DownLeftVectorBar: '⥖',
  DownRightTeeVector: '⥟',
  DownRightVector: '⇁',
  DownRightVectorBar: '⥗',
  DownTee: '⊤',
  DownTeeArrow: '↧',
  Downarrow: '⇓',
  Dscr: '𝒟',
  Dstrok: 'Đ',
  ENG: 'Ŋ',
  ETH: 'Ð',
  Eacute: 'É',
  Ecaron: 'Ě',
  Ecirc: 'Ê',
  Ecy: 'Э',
  Edot: 'Ė',
  Efr: '𝔈',
  Egrave: 'È',
  Element: '∈',
  Emacr: 'Ē',
  EmptySmallSquare: '◻',
  EmptyVerySmallSquare: '▫',
  Eogon: 'Ę',
  Eopf: '𝔼',
  Epsilon: 'Ε',
  Equal: '⩵',
  EqualTilde: '≂',
  Equilibrium: '⇌',
  Escr: 'ℰ',
  Esim: '⩳',
  Eta: 'Η',
  Euml: 'Ë',
  Exists: '∃',
  ExponentialE: 'ⅇ',
  Fcy: 'Ф',
  Ffr: '𝔉',
  FilledSmallSquare: '◼',
  FilledVerySmallSquare: '▪',
  Fopf: '𝔽',
  ForAll: '∀',
  Fouriertrf: 'ℱ',
  Fscr: 'ℱ',
  GJcy: 'Ѓ',
  GT: '>',
  Gamma: 'Γ',
  Gammad: 'Ϝ',
  Gbreve: 'Ğ',
  Gcedil: 'Ģ',
  Gcirc: 'Ĝ',
  Gcy: 'Г',
  Gdot: 'Ġ',
  Gfr: '𝔊',
  Gg: '⋙',
  Gopf: '𝔾',
  GreaterEqual: '≥',
  GreaterEqualLess: '⋛',
  GreaterFullEqual: '≧',
  GreaterGreater: '⪢',
  GreaterLess: '≷',
  GreaterSlantEqual: '⩾',
  GreaterTilde: '≳',
  Gscr: '𝒢',
  Gt: '≫',
  HARDcy: 'Ъ',
  Hacek: 'ˇ',
  Hat: '^',
  Hcirc: 'Ĥ',
  Hfr: 'ℌ',
  HilbertSpace: 'ℋ',
  Hopf: 'ℍ',
  HorizontalLine: '─',
  Hscr: 'ℋ',
  Hstrok: 'Ħ',
  HumpDownHump: '≎',
  HumpEqual: '≏',
  IEcy: 'Е',
  IJlig: 'Ĳ',
  IOcy: 'Ё',
  Iacute: 'Í',
  Icirc: 'Î',
  Icy: 'И',
  Idot: 'İ',
  Ifr: 'ℑ',
  Igrave: 'Ì',
  Im: 'ℑ',
  Imacr: 'Ī',
  ImaginaryI: 'ⅈ',
  Implies: '⇒',
  Int: '∬',
  Integral: '∫',
  Intersection: '⋂',
  InvisibleComma: '⁣',
  InvisibleTimes: '⁢',
  Iogon: 'Į',
  Iopf: '𝕀',
  Iota: 'Ι',
  Iscr: 'ℐ',
  Itilde: 'Ĩ',
  Iukcy: 'І',
  Iuml: 'Ï',
  Jcirc: 'Ĵ',
  Jcy: 'Й',
  Jfr: '𝔍',
  Jopf: '𝕁',
  Jscr: '𝒥',
  Jsercy: 'Ј',
  Jukcy: 'Є',
  KHcy: 'Х',
  KJcy: 'Ќ',
  Kappa: 'Κ',
  Kcedil: 'Ķ',
  Kcy: 'К',
  Kfr: '𝔎',
  Kopf: '𝕂',
  Kscr: '𝒦',
  LJcy: 'Љ',
  LT: '<',
  Lacute: 'Ĺ',
  Lambda: 'Λ',
  Lang: '⟪',
  Laplacetrf: 'ℒ',
  Larr: '↞',
  Lcaron: 'Ľ',
  Lcedil: 'Ļ',
  Lcy: 'Л',
  LeftAngleBracket: '⟨',
  LeftArrow: '←',
  LeftArrowBar: '⇤',
  LeftArrowRightArrow: '⇆',
  LeftCeiling: '⌈',
  LeftDoubleBracket: '⟦',
  LeftDownTeeVector: '⥡',
  LeftDownVector: '⇃',
  LeftDownVectorBar: '⥙',
  LeftFloor: '⌊',
  LeftRightArrow: '↔',
  LeftRightVector: '⥎',
  LeftTee: '⊣',
  LeftTeeArrow: '↤',
  LeftTeeVector: '⥚',
  LeftTriangle: '⊲',
  LeftTriangleBar: '⧏',
  LeftTriangleEqual: '⊴',
  LeftUpDownVector: '⥑',
  LeftUpTeeVector: '⥠',
  LeftUpVector: '↿',
  LeftUpVectorBar: '⥘',
  LeftVector: '↼',
  LeftVectorBar: '⥒',
  Leftarrow: '⇐',
  Leftrightarrow: '⇔',
  LessEqualGreater: '⋚',
  LessFullEqual: '≦',
  LessGreater: '≶',
  LessLess: '⪡',
  LessSlantEqual: '⩽',
  LessTilde: '≲',
  Lfr: '𝔏',
  Ll: '⋘',
  Lleftarrow: '⇚',
  Lmidot: 'Ŀ',
  LongLeftArrow: '⟵',
  LongLeftRightArrow: '⟷',
  LongRightArrow: '⟶',
  Longleftarrow: '⟸',
  Longleftrightarrow: '⟺',
  Longrightarrow: '⟹',
  Lopf: '𝕃',
  LowerLeftArrow: '↙',
  LowerRightArrow: '↘',
  Lscr: 'ℒ',
  Lsh: '↰',
  Lstrok: 'Ł',
  Lt: '≪',
  Map: '⤅',
  Mcy: 'М',
  MediumSpace: ' ',
  Mellintrf: 'ℳ',
  Mfr: '𝔐',
  MinusPlus: '∓',
  Mopf: '𝕄',
  Mscr: 'ℳ',
  Mu: 'Μ',
  NJcy: 'Њ',
  Nacute: 'Ń',
  Ncaron: 'Ň',
  Ncedil: 'Ņ',
  Ncy: 'Н',
  NegativeMediumSpace: '​',
  NegativeThickSpace: '​',
  NegativeThinSpace: '​',
  NegativeVeryThinSpace: '​',
  NestedGreaterGreater: '≫',
  NestedLessLess: '≪',
  NewLine: '\n',
  Nfr: '𝔑',
  NoBreak: '⁠',
  NonBreakingSpace: ' ',
  Nopf: 'ℕ',
  Not: '⫬',
  NotCongruent: '≢',
  NotCupCap: '≭',
  NotDoubleVerticalBar: '∦',
  NotElement: '∉',
  NotEqual: '≠',
  NotEqualTilde: '≂̸',
  NotExists: '∄',
  NotGreater: '≯',
  NotGreaterEqual: '≱',
  NotGreaterFullEqual: '≧̸',
  NotGreaterGreater: '≫̸',
  NotGreaterLess: '≹',
  NotGreaterSlantEqual: '⩾̸',
  NotGreaterTilde: '≵',
  NotHumpDownHump: '≎̸',
  NotHumpEqual: '≏̸',
  NotLeftTriangle: '⋪',
  NotLeftTriangleBar: '⧏̸',
  NotLeftTriangleEqual: '⋬',
  NotLess: '≮',
  NotLessEqual: '≰',
  NotLessGreater: '≸',
  NotLessLess: '≪̸',
  NotLessSlantEqual: '⩽̸',
  NotLessTilde: '≴',
  NotNestedGreaterGreater: '⪢̸',
  NotNestedLessLess: '⪡̸',
  NotPrecedes: '⊀',
  NotPrecedesEqual: '⪯̸',
  NotPrecedesSlantEqual: '⋠',
  NotReverseElement: '∌',
  NotRightTriangle: '⋫',
  NotRightTriangleBar: '⧐̸',
  NotRightTriangleEqual: '⋭',
  NotSquareSubset: '⊏̸',
  NotSquareSubsetEqual: '⋢',
  NotSquareSuperset: '⊐̸',
  NotSquareSupersetEqual: '⋣',
  NotSubset: '⊂⃒',
  NotSubsetEqual: '⊈',
  NotSucceeds: '⊁',
  NotSucceedsEqual: '⪰̸',
  NotSucceedsSlantEqual: '⋡',
  NotSucceedsTilde: '≿̸',
  NotSuperset: '⊃⃒',
  NotSupersetEqual: '⊉',
  NotTilde: '≁',
  NotTildeEqual: '≄',
  NotTildeFullEqual: '≇',
  NotTildeTilde: '≉',
  NotVerticalBar: '∤',
  Nscr: '𝒩',
  Ntilde: 'Ñ',
  Nu: 'Ν',
  OElig: 'Œ',
  Oacute: 'Ó',
  Ocirc: 'Ô',
  Ocy: 'О',
  Odblac: 'Ő',
  Ofr: '𝔒',
  Ograve: 'Ò',
  Omacr: 'Ō',
  Omega: 'Ω',
  Omicron: 'Ο',
  Oopf: '𝕆',
  OpenCurlyDoubleQuote: '“',
  OpenCurlyQuote: '‘',
  Or: '⩔',
  Oscr: '𝒪',
  Oslash: 'Ø',
  Otilde: 'Õ',
  Otimes: '⨷',
  Ouml: 'Ö',
  OverBar: '‾',
  OverBrace: '⏞',
  OverBracket: '⎴',
  OverParenthesis: '⏜',
  PartialD: '∂',
  Pcy: 'П',
  Pfr: '𝔓',
  Phi: 'Φ',
  Pi: 'Π',
  PlusMinus: '±',
  Poincareplane: 'ℌ',
  Popf: 'ℙ',
  Pr: '⪻',
  Precedes: '≺',
  PrecedesEqual: '⪯',
  PrecedesSlantEqual: '≼',
  PrecedesTilde: '≾',
  Prime: '″',
  Product: '∏',
  Proportion: '∷',
  Proportional: '∝',
  Pscr: '𝒫',
  Psi: 'Ψ',
  QUOT: '"',
  Qfr: '𝔔',
  Qopf: 'ℚ',
  Qscr: '𝒬',
  RBarr: '⤐',
  REG: '®',
  Racute: 'Ŕ',
  Rang: '⟫',
  Rarr: '↠',
  Rarrtl: '⤖',
  Rcaron: 'Ř',
  Rcedil: 'Ŗ',
  Rcy: 'Р',
  Re: 'ℜ',
  ReverseElement: '∋',
  ReverseEquilibrium: '⇋',
  ReverseUpEquilibrium: '⥯',
  Rfr: 'ℜ',
  Rho: 'Ρ',
  RightAngleBracket: '⟩',
  RightArrow: '→',
  RightArrowBar: '⇥',
  RightArrowLeftArrow: '⇄',
  RightCeiling: '⌉',
  RightDoubleBracket: '⟧',
  RightDownTeeVector: '⥝',
  RightDownVector: '⇂',
  RightDownVectorBar: '⥕',
  RightFloor: '⌋',
  RightTee: '⊢',
  RightTeeArrow: '↦',
  RightTeeVector: '⥛',
  RightTriangle: '⊳',
  RightTriangleBar: '⧐',
  RightTriangleEqual: '⊵',
  RightUpDownVector: '⥏',
  RightUpTeeVector: '⥜',
  RightUpVector: '↾',
  RightUpVectorBar: '⥔',
  RightVector: '⇀',
  RightVectorBar: '⥓',
  Rightarrow: '⇒',
  Ropf: 'ℝ',
  RoundImplies: '⥰',
  Rrightarrow: '⇛',
  Rscr: 'ℛ',
  Rsh: '↱',
  RuleDelayed: '⧴',
  SHCHcy: 'Щ',
  SHcy: 'Ш',
  SOFTcy: 'Ь',
  Sacute: 'Ś',
  Sc: '⪼',
  Scaron: 'Š',
  Scedil: 'Ş',
  Scirc: 'Ŝ',
  Scy: 'С',
  Sfr: '𝔖',
  ShortDownArrow: '↓',
  ShortLeftArrow: '←',
  ShortRightArrow: '→',
  ShortUpArrow: '↑',
  Sigma: 'Σ',
  SmallCircle: '∘',
  Sopf: '𝕊',
  Sqrt: '√',
  Square: '□',
  SquareIntersection: '⊓',
  SquareSubset: '⊏',
  SquareSubsetEqual: '⊑',
  SquareSuperset: '⊐',
  SquareSupersetEqual: '⊒',
  SquareUnion: '⊔',
  Sscr: '𝒮',
  Star: '⋆',
  Sub: '⋐',
  Subset: '⋐',
  SubsetEqual: '⊆',
  Succeeds: '≻',
  SucceedsEqual: '⪰',
  SucceedsSlantEqual: '≽',
  SucceedsTilde: '≿',
  SuchThat: '∋',
  Sum: '∑',
  Sup: '⋑',
  Superset: '⊃',
  SupersetEqual: '⊇',
  Supset: '⋑',
  THORN: 'Þ',
  TRADE: '™',
  TSHcy: 'Ћ',
  TScy: 'Ц',
  Tab: '\t',
  Tau: 'Τ',
  Tcaron: 'Ť',
  Tcedil: 'Ţ',
  Tcy: 'Т',
  Tfr: '𝔗',
  Therefore: '∴',
  Theta: 'Θ',
  ThickSpace: '  ',
  ThinSpace: ' ',
  Tilde: '∼',
  TildeEqual: '≃',
  TildeFullEqual: '≅',
  TildeTilde: '≈',
  Topf: '𝕋',
  TripleDot: '⃛',
  Tscr: '𝒯',
  Tstrok: 'Ŧ',
  Uacute: 'Ú',
  Uarr: '↟',
  Uarrocir: '⥉',
  Ubrcy: 'Ў',
  Ubreve: 'Ŭ',
  Ucirc: 'Û',
  Ucy: 'У',
  Udblac: 'Ű',
  Ufr: '𝔘',
  Ugrave: 'Ù',
  Umacr: 'Ū',
  UnderBar: '_',
  UnderBrace: '⏟',
  UnderBracket: '⎵',
  UnderParenthesis: '⏝',
  Union: '⋃',
  UnionPlus: '⊎',
  Uogon: 'Ų',
  Uopf: '𝕌',
  UpArrow: '↑',
  UpArrowBar: '⤒',
  UpArrowDownArrow: '⇅',
  UpDownArrow: '↕',
  UpEquilibrium: '⥮',
  UpTee: '⊥',
  UpTeeArrow: '↥',
  Uparrow: '⇑',
  Updownarrow: '⇕',
  UpperLeftArrow: '↖',
  UpperRightArrow: '↗',
  Upsi: 'ϒ',
  Upsilon: 'Υ',
  Uring: 'Ů',
  Uscr: '𝒰',
  Utilde: 'Ũ',
  Uuml: 'Ü',
  VDash: '⊫',
  Vbar: '⫫',
  Vcy: 'В',
  Vdash: '⊩',
  Vdashl: '⫦',
  Vee: '⋁',
  Verbar: '‖',
  Vert: '‖',
  VerticalBar: '∣',
  VerticalLine: '|',
  VerticalSeparator: '❘',
  VerticalTilde: '≀',
  VeryThinSpace: ' ',
  Vfr: '𝔙',
  Vopf: '𝕍',
  Vscr: '𝒱',
  Vvdash: '⊪',
  Wcirc: 'Ŵ',
  Wedge: '⋀',
  Wfr: '𝔚',
  Wopf: '𝕎',
  Wscr: '𝒲',
  Xfr: '𝔛',
  Xi: 'Ξ',
  Xopf: '𝕏',
  Xscr: '𝒳',
  YAcy: 'Я',
  YIcy: 'Ї',
  YUcy: 'Ю',
  Yacute: 'Ý',
  Ycirc: 'Ŷ',
  Ycy: 'Ы',
  Yfr: '𝔜',
  Yopf: '𝕐',
  Yscr: '𝒴',
  Yuml: 'Ÿ',
  ZHcy: 'Ж',
  Zacute: 'Ź',
  Zcaron: 'Ž',
  Zcy: 'З',
  Zdot: 'Ż',
  ZeroWidthSpace: '​',
  Zeta: 'Ζ',
  Zfr: 'ℨ',
  Zopf: 'ℤ',
  Zscr: '𝒵',
  aacute: 'á',
  abreve: 'ă',
  ac: '∾',
  acE: '∾̳',
  acd: '∿',
  acirc: 'â',
  acute: '´',
  acy: 'а',
  aelig: 'æ',
  af: '⁡',
  afr: '𝔞',
  agrave: 'à',
  alefsym: 'ℵ',
  aleph: 'ℵ',
  alpha: 'α',
  amacr: 'ā',
  amalg: '⨿',
  amp: '&',
  and: '∧',
  andand: '⩕',
  andd: '⩜',
  andslope: '⩘',
  andv: '⩚',
  ang: '∠',
  ange: '⦤',
  angle: '∠',
  angmsd: '∡',
  angmsdaa: '⦨',
  angmsdab: '⦩',
  angmsdac: '⦪',
  angmsdad: '⦫',
  angmsdae: '⦬',
  angmsdaf: '⦭',
  angmsdag: '⦮',
  angmsdah: '⦯',
  angrt: '∟',
  angrtvb: '⊾',
  angrtvbd: '⦝',
  angsph: '∢',
  angst: 'Å',
  angzarr: '⍼',
  aogon: 'ą',
  aopf: '𝕒',
  ap: '≈',
  apE: '⩰',
  apacir: '⩯',
  ape: '≊',
  apid: '≋',
  apos: "'",
  approx: '≈',
  approxeq: '≊',
  aring: 'å',
  ascr: '𝒶',
  ast: '*',
  asymp: '≈',
  asympeq: '≍',
  atilde: 'ã',
  auml: 'ä',
  awconint: '∳',
  awint: '⨑',
  bNot: '⫭',
  backcong: '≌',
  backepsilon: '϶',
  backprime: '‵',
  backsim: '∽',
  backsimeq: '⋍',
  barvee: '⊽',
  barwed: '⌅',
  barwedge: '⌅',
  bbrk: '⎵',
  bbrktbrk: '⎶',
  bcong: '≌',
  bcy: 'б',
  bdquo: '„',
  becaus: '∵',
  because: '∵',
  bemptyv: '⦰',
  bepsi: '϶',
  bernou: 'ℬ',
  beta: 'β',
  beth: 'ℶ',
  between: '≬',
  bfr: '𝔟',
  bigcap: '⋂',
  bigcirc: '◯',
  bigcup: '⋃',
  bigodot: '⨀',
  bigoplus: '⨁',
  bigotimes: '⨂',
  bigsqcup: '⨆',
  bigstar: '★',
  bigtriangledown: '▽',
  bigtriangleup: '△',
  biguplus: '⨄',
  bigvee: '⋁',
  bigwedge: '⋀',
  bkarow: '⤍',
  blacklozenge: '⧫',
  blacksquare: '▪',
  blacktriangle: '▴',
  blacktriangledown: '▾',
  blacktriangleleft: '◂',
  blacktriangleright: '▸',
  blank: '␣',
  blk12: '▒',
  blk14: '░',
  blk34: '▓',
  block: '█',
  bne: '=⃥',
  bnequiv: '≡⃥',
  bnot: '⌐',
  bopf: '𝕓',
  bot: '⊥',
  bottom: '⊥',
  bowtie: '⋈',
  boxDL: '╗',
  boxDR: '╔',
  boxDl: '╖',
  boxDr: '╓',
  boxH: '═',
  boxHD: '╦',
  boxHU: '╩',
  boxHd: '╤',
  boxHu: '╧',
  boxUL: '╝',
  boxUR: '╚',
  boxUl: '╜',
  boxUr: '╙',
  boxV: '║',
  boxVH: '╬',
  boxVL: '╣',
  boxVR: '╠',
  boxVh: '╫',
  boxVl: '╢',
  boxVr: '╟',
  boxbox: '⧉',
  boxdL: '╕',
  boxdR: '╒',
  boxdl: '┐',
  boxdr: '┌',
  boxh: '─',
  boxhD: '╥',
  boxhU: '╨',
  boxhd: '┬',
  boxhu: '┴',
  boxminus: '⊟',
  boxplus: '⊞',
  boxtimes: '⊠',
  boxuL: '╛',
  boxuR: '╘',
  boxul: '┘',
  boxur: '└',
  boxv: '│',
  boxvH: '╪',
  boxvL: '╡',
  boxvR: '╞',
  boxvh: '┼',
  boxvl: '┤',
  boxvr: '├',
  bprime: '‵',
  breve: '˘',
  brvbar: '¦',
  bscr: '𝒷',
  bsemi: '⁏',
  bsim: '∽',
  bsime: '⋍',
  bsol: '\\',
  bsolb: '⧅',
  bsolhsub: '⟈',
  bull: '•',
  bullet: '•',
  bump: '≎',
  bumpE: '⪮',
  bumpe: '≏',
  bumpeq: '≏',
  cacute: 'ć',
  cap: '∩',
  capand: '⩄',
  capbrcup: '⩉',
  capcap: '⩋',
  capcup: '⩇',
  capdot: '⩀',
  caps: '∩︀',
  caret: '⁁',
  caron: 'ˇ',
  ccaps: '⩍',
  ccaron: 'č',
  ccedil: 'ç',
  ccirc: 'ĉ',
  ccups: '⩌',
  ccupssm: '⩐',
  cdot: 'ċ',
  cedil: '¸',
  cemptyv: '⦲',
  cent: '¢',
  centerdot: '·',
  cfr: '𝔠',
  chcy: 'ч',
  check: '✓',
  checkmark: '✓',
  chi: 'χ',
  cir: '○',
  cirE: '⧃',
  circ: 'ˆ',
  circeq: '≗',
  circlearrowleft: '↺',
  circlearrowright: '↻',
  circledR: '®',
  circledS: 'Ⓢ',
  circledast: '⊛',
  circledcirc: '⊚',
  circleddash: '⊝',
  cire: '≗',
  cirfnint: '⨐',
  cirmid: '⫯',
  cirscir: '⧂',
  clubs: '♣',
  clubsuit: '♣',
  colon: ':',
  colone: '≔',
  coloneq: '≔',
  comma: ',',
  commat: '@',
  comp: '∁',
  compfn: '∘',
  complement: '∁',
  complexes: 'ℂ',
  cong: '≅',
  congdot: '⩭',
  conint: '∮',
  copf: '𝕔',
  coprod: '∐',
  copy: '©',
  copysr: '℗',
  crarr: '↵',
  cross: '✗',
  cscr: '𝒸',
  csub: '⫏',
  csube: '⫑',
  csup: '⫐',
  csupe: '⫒',
  ctdot: '⋯',
  cudarrl: '⤸',
  cudarrr: '⤵',
  cuepr: '⋞',
  cuesc: '⋟',
  cularr: '↶',
  cularrp: '⤽',
  cup: '∪',
  cupbrcap: '⩈',
  cupcap: '⩆',
  cupcup: '⩊',
  cupdot: '⊍',
  cupor: '⩅',
  cups: '∪︀',
  curarr: '↷',
  curarrm: '⤼',
  curlyeqprec: '⋞',
  curlyeqsucc: '⋟',
  curlyvee: '⋎',
  curlywedge: '⋏',
  curren: '¤',
  curvearrowleft: '↶',
  curvearrowright: '↷',
  cuvee: '⋎',
  cuwed: '⋏',
  cwconint: '∲',
  cwint: '∱',
  cylcty: '⌭',
  dArr: '⇓',
  dHar: '⥥',
  dagger: '†',
  daleth: 'ℸ',
  darr: '↓',
  dash: '‐',
  dashv: '⊣',
  dbkarow: '⤏',
  dblac: '˝',
  dcaron: 'ď',
  dcy: 'д',
  dd: 'ⅆ',
  ddagger: '‡',
  ddarr: '⇊',
  ddotseq: '⩷',
  deg: '°',
  delta: 'δ',
  demptyv: '⦱',
  dfisht: '⥿',
  dfr: '𝔡',
  dharl: '⇃',
  dharr: '⇂',
  diam: '⋄',
  diamond: '⋄',
  diamondsuit: '♦',
  diams: '♦',
  die: '¨',
  digamma: 'ϝ',
  disin: '⋲',
  div: '÷',
  divide: '÷',
  divideontimes: '⋇',
  divonx: '⋇',
  djcy: 'ђ',
  dlcorn: '⌞',
  dlcrop: '⌍',
  dollar: '$',
  dopf: '𝕕',
  dot: '˙',
  doteq: '≐',
  doteqdot: '≑',
  dotminus: '∸',
  dotplus: '∔',
  dotsquare: '⊡',
  doublebarwedge: '⌆',
  downarrow: '↓',
  downdownarrows: '⇊',
  downharpoonleft: '⇃',
  downharpoonright: '⇂',
  drbkarow: '⤐',
  drcorn: '⌟',
  drcrop: '⌌',
  dscr: '𝒹',
  dscy: 'ѕ',
  dsol: '⧶',
  dstrok: 'đ',
  dtdot: '⋱',
  dtri: '▿',
  dtrif: '▾',
  duarr: '⇵',
  duhar: '⥯',
  dwangle: '⦦',
  dzcy: 'џ',
  dzigrarr: '⟿',
  eDDot: '⩷',
  eDot: '≑',
  eacute: 'é',
  easter: '⩮',
  ecaron: 'ě',
  ecir: '≖',
  ecirc: 'ê',
  ecolon: '≕',
  ecy: 'э',
  edot: 'ė',
  ee: 'ⅇ',
  efDot: '≒',
  efr: '𝔢',
  eg: '⪚',
  egrave: 'è',
  egs: '⪖',
  egsdot: '⪘',
  el: '⪙',
  elinters: '⏧',
  ell: 'ℓ',
  els: '⪕',
  elsdot: '⪗',
  emacr: 'ē',
  empty: '∅',
  emptyset: '∅',
  emptyv: '∅',
  emsp13: ' ',
  emsp14: ' ',
  emsp: ' ',
  eng: 'ŋ',
  ensp: ' ',
  eogon: 'ę',
  eopf: '𝕖',
  epar: '⋕',
  eparsl: '⧣',
  eplus: '⩱',
  epsi: 'ε',
  epsilon: 'ε',
  epsiv: 'ϵ',
  eqcirc: '≖',
  eqcolon: '≕',
  eqsim: '≂',
  eqslantgtr: '⪖',
  eqslantless: '⪕',
  equals: '=',
  equest: '≟',
  equiv: '≡',
  equivDD: '⩸',
  eqvparsl: '⧥',
  erDot: '≓',
  erarr: '⥱',
  escr: 'ℯ',
  esdot: '≐',
  esim: '≂',
  eta: 'η',
  eth: 'ð',
  euml: 'ë',
  euro: '€',
  excl: '!',
  exist: '∃',
  expectation: 'ℰ',
  exponentiale: 'ⅇ',
  fallingdotseq: '≒',
  fcy: 'ф',
  female: '♀',
  ffilig: 'ﬃ',
  fflig: 'ﬀ',
  ffllig: 'ﬄ',
  ffr: '𝔣',
  filig: 'ﬁ',
  fjlig: 'fj',
  flat: '♭',
  fllig: 'ﬂ',
  fltns: '▱',
  fnof: 'ƒ',
  fopf: '𝕗',
  forall: '∀',
  fork: '⋔',
  forkv: '⫙',
  fpartint: '⨍',
  frac12: '½',
  frac13: '⅓',
  frac14: '¼',
  frac15: '⅕',
  frac16: '⅙',
  frac18: '⅛',
  frac23: '⅔',
  frac25: '⅖',
  frac34: '¾',
  frac35: '⅗',
  frac38: '⅜',
  frac45: '⅘',
  frac56: '⅚',
  frac58: '⅝',
  frac78: '⅞',
  frasl: '⁄',
  frown: '⌢',
  fscr: '𝒻',
  gE: '≧',
  gEl: '⪌',
  gacute: 'ǵ',
  gamma: 'γ',
  gammad: 'ϝ',
  gap: '⪆',
  gbreve: 'ğ',
  gcirc: 'ĝ',
  gcy: 'г',
  gdot: 'ġ',
  ge: '≥',
  gel: '⋛',
  geq: '≥',
  geqq: '≧',
  geqslant: '⩾',
  ges: '⩾',
  gescc: '⪩',
  gesdot: '⪀',
  gesdoto: '⪂',
  gesdotol: '⪄',
  gesl: '⋛︀',
  gesles: '⪔',
  gfr: '𝔤',
  gg: '≫',
  ggg: '⋙',
  gimel: 'ℷ',
  gjcy: 'ѓ',
  gl: '≷',
  glE: '⪒',
  gla: '⪥',
  glj: '⪤',
  gnE: '≩',
  gnap: '⪊',
  gnapprox: '⪊',
  gne: '⪈',
  gneq: '⪈',
  gneqq: '≩',
  gnsim: '⋧',
  gopf: '𝕘',
  grave: '`',
  gscr: 'ℊ',
  gsim: '≳',
  gsime: '⪎',
  gsiml: '⪐',
  gt: '>',
  gtcc: '⪧',
  gtcir: '⩺',
  gtdot: '⋗',
  gtlPar: '⦕',
  gtquest: '⩼',
  gtrapprox: '⪆',
  gtrarr: '⥸',
  gtrdot: '⋗',
  gtreqless: '⋛',
  gtreqqless: '⪌',
  gtrless: '≷',
  gtrsim: '≳',
  gvertneqq: '≩︀',
  gvnE: '≩︀',
  hArr: '⇔',
  hairsp: ' ',
  half: '½',
  hamilt: 'ℋ',
  hardcy: 'ъ',
  harr: '↔',
  harrcir: '⥈',
  harrw: '↭',
  hbar: 'ℏ',
  hcirc: 'ĥ',
  hearts: '♥',
  heartsuit: '♥',
  hellip: '…',
  hercon: '⊹',
  hfr: '𝔥',
  hksearow: '⤥',
  hkswarow: '⤦',
  hoarr: '⇿',
  homtht: '∻',
  hookleftarrow: '↩',
  hookrightarrow: '↪',
  hopf: '𝕙',
  horbar: '―',
  hscr: '𝒽',
  hslash: 'ℏ',
  hstrok: 'ħ',
  hybull: '⁃',
  hyphen: '‐',
  iacute: 'í',
  ic: '⁣',
  icirc: 'î',
  icy: 'и',
  iecy: 'е',
  iexcl: '¡',
  iff: '⇔',
  ifr: '𝔦',
  igrave: 'ì',
  ii: 'ⅈ',
  iiiint: '⨌',
  iiint: '∭',
  iinfin: '⧜',
  iiota: '℩',
  ijlig: 'ĳ',
  imacr: 'ī',
  image: 'ℑ',
  imagline: 'ℐ',
  imagpart: 'ℑ',
  imath: 'ı',
  imof: '⊷',
  imped: 'Ƶ',
  in: '∈',
  incare: '℅',
  infin: '∞',
  infintie: '⧝',
  inodot: 'ı',
  int: '∫',
  intcal: '⊺',
  integers: 'ℤ',
  intercal: '⊺',
  intlarhk: '⨗',
  intprod: '⨼',
  iocy: 'ё',
  iogon: 'į',
  iopf: '𝕚',
  iota: 'ι',
  iprod: '⨼',
  iquest: '¿',
  iscr: '𝒾',
  isin: '∈',
  isinE: '⋹',
  isindot: '⋵',
  isins: '⋴',
  isinsv: '⋳',
  isinv: '∈',
  it: '⁢',
  itilde: 'ĩ',
  iukcy: 'і',
  iuml: 'ï',
  jcirc: 'ĵ',
  jcy: 'й',
  jfr: '𝔧',
  jmath: 'ȷ',
  jopf: '𝕛',
  jscr: '𝒿',
  jsercy: 'ј',
  jukcy: 'є',
  kappa: 'κ',
  kappav: 'ϰ',
  kcedil: 'ķ',
  kcy: 'к',
  kfr: '𝔨',
  kgreen: 'ĸ',
  khcy: 'х',
  kjcy: 'ќ',
  kopf: '𝕜',
  kscr: '𝓀',
  lAarr: '⇚',
  lArr: '⇐',
  lAtail: '⤛',
  lBarr: '⤎',
  lE: '≦',
  lEg: '⪋',
  lHar: '⥢',
  lacute: 'ĺ',
  laemptyv: '⦴',
  lagran: 'ℒ',
  lambda: 'λ',
  lang: '⟨',
  langd: '⦑',
  langle: '⟨',
  lap: '⪅',
  laquo: '«',
  larr: '←',
  larrb: '⇤',
  larrbfs: '⤟',
  larrfs: '⤝',
  larrhk: '↩',
  larrlp: '↫',
  larrpl: '⤹',
  larrsim: '⥳',
  larrtl: '↢',
  lat: '⪫',
  latail: '⤙',
  late: '⪭',
  lates: '⪭︀',
  lbarr: '⤌',
  lbbrk: '❲',
  lbrace: '{',
  lbrack: '[',
  lbrke: '⦋',
  lbrksld: '⦏',
  lbrkslu: '⦍',
  lcaron: 'ľ',
  lcedil: 'ļ',
  lceil: '⌈',
  lcub: '{',
  lcy: 'л',
  ldca: '⤶',
  ldquo: '“',
  ldquor: '„',
  ldrdhar: '⥧',
  ldrushar: '⥋',
  ldsh: '↲',
  le: '≤',
  leftarrow: '←',
  leftarrowtail: '↢',
  leftharpoondown: '↽',
  leftharpoonup: '↼',
  leftleftarrows: '⇇',
  leftrightarrow: '↔',
  leftrightarrows: '⇆',
  leftrightharpoons: '⇋',
  leftrightsquigarrow: '↭',
  leftthreetimes: '⋋',
  leg: '⋚',
  leq: '≤',
  leqq: '≦',
  leqslant: '⩽',
  les: '⩽',
  lescc: '⪨',
  lesdot: '⩿',
  lesdoto: '⪁',
  lesdotor: '⪃',
  lesg: '⋚︀',
  lesges: '⪓',
  lessapprox: '⪅',
  lessdot: '⋖',
  lesseqgtr: '⋚',
  lesseqqgtr: '⪋',
  lessgtr: '≶',
  lesssim: '≲',
  lfisht: '⥼',
  lfloor: '⌊',
  lfr: '𝔩',
  lg: '≶',
  lgE: '⪑',
  lhard: '↽',
  lharu: '↼',
  lharul: '⥪',
  lhblk: '▄',
  ljcy: 'љ',
  ll: '≪',
  llarr: '⇇',
  llcorner: '⌞',
  llhard: '⥫',
  lltri: '◺',
  lmidot: 'ŀ',
  lmoust: '⎰',
  lmoustache: '⎰',
  lnE: '≨',
  lnap: '⪉',
  lnapprox: '⪉',
  lne: '⪇',
  lneq: '⪇',
  lneqq: '≨',
  lnsim: '⋦',
  loang: '⟬',
  loarr: '⇽',
  lobrk: '⟦',
  longleftarrow: '⟵',
  longleftrightarrow: '⟷',
  longmapsto: '⟼',
  longrightarrow: '⟶',
  looparrowleft: '↫',
  looparrowright: '↬',
  lopar: '⦅',
  lopf: '𝕝',
  loplus: '⨭',
  lotimes: '⨴',
  lowast: '∗',
  lowbar: '_',
  loz: '◊',
  lozenge: '◊',
  lozf: '⧫',
  lpar: '(',
  lparlt: '⦓',
  lrarr: '⇆',
  lrcorner: '⌟',
  lrhar: '⇋',
  lrhard: '⥭',
  lrm: '‎',
  lrtri: '⊿',
  lsaquo: '‹',
  lscr: '𝓁',
  lsh: '↰',
  lsim: '≲',
  lsime: '⪍',
  lsimg: '⪏',
  lsqb: '[',
  lsquo: '‘',
  lsquor: '‚',
  lstrok: 'ł',
  lt: '<',
  ltcc: '⪦',
  ltcir: '⩹',
  ltdot: '⋖',
  lthree: '⋋',
  ltimes: '⋉',
  ltlarr: '⥶',
  ltquest: '⩻',
  ltrPar: '⦖',
  ltri: '◃',
  ltrie: '⊴',
  ltrif: '◂',
  lurdshar: '⥊',
  luruhar: '⥦',
  lvertneqq: '≨︀',
  lvnE: '≨︀',
  mDDot: '∺',
  macr: '¯',
  male: '♂',
  malt: '✠',
  maltese: '✠',
  map: '↦',
  mapsto: '↦',
  mapstodown: '↧',
  mapstoleft: '↤',
  mapstoup: '↥',
  marker: '▮',
  mcomma: '⨩',
  mcy: 'м',
  mdash: '—',
  measuredangle: '∡',
  mfr: '𝔪',
  mho: '℧',
  micro: 'µ',
  mid: '∣',
  midast: '*',
  midcir: '⫰',
  middot: '·',
  minus: '−',
  minusb: '⊟',
  minusd: '∸',
  minusdu: '⨪',
  mlcp: '⫛',
  mldr: '…',
  mnplus: '∓',
  models: '⊧',
  mopf: '𝕞',
  mp: '∓',
  mscr: '𝓂',
  mstpos: '∾',
  mu: 'μ',
  multimap: '⊸',
  mumap: '⊸',
  nGg: '⋙̸',
  nGt: '≫⃒',
  nGtv: '≫̸',
  nLeftarrow: '⇍',
  nLeftrightarrow: '⇎',
  nLl: '⋘̸',
  nLt: '≪⃒',
  nLtv: '≪̸',
  nRightarrow: '⇏',
  nVDash: '⊯',
  nVdash: '⊮',
  nabla: '∇',
  nacute: 'ń',
  nang: '∠⃒',
  nap: '≉',
  napE: '⩰̸',
  napid: '≋̸',
  napos: 'ŉ',
  napprox: '≉',
  natur: '♮',
  natural: '♮',
  naturals: 'ℕ',
  nbsp: ' ',
  nbump: '≎̸',
  nbumpe: '≏̸',
  ncap: '⩃',
  ncaron: 'ň',
  ncedil: 'ņ',
  ncong: '≇',
  ncongdot: '⩭̸',
  ncup: '⩂',
  ncy: 'н',
  ndash: '–',
  ne: '≠',
  neArr: '⇗',
  nearhk: '⤤',
  nearr: '↗',
  nearrow: '↗',
  nedot: '≐̸',
  nequiv: '≢',
  nesear: '⤨',
  nesim: '≂̸',
  nexist: '∄',
  nexists: '∄',
  nfr: '𝔫',
  ngE: '≧̸',
  nge: '≱',
  ngeq: '≱',
  ngeqq: '≧̸',
  ngeqslant: '⩾̸',
  nges: '⩾̸',
  ngsim: '≵',
  ngt: '≯',
  ngtr: '≯',
  nhArr: '⇎',
  nharr: '↮',
  nhpar: '⫲',
  ni: '∋',
  nis: '⋼',
  nisd: '⋺',
  niv: '∋',
  njcy: 'њ',
  nlArr: '⇍',
  nlE: '≦̸',
  nlarr: '↚',
  nldr: '‥',
  nle: '≰',
  nleftarrow: '↚',
  nleftrightarrow: '↮',
  nleq: '≰',
  nleqq: '≦̸',
  nleqslant: '⩽̸',
  nles: '⩽̸',
  nless: '≮',
  nlsim: '≴',
  nlt: '≮',
  nltri: '⋪',
  nltrie: '⋬',
  nmid: '∤',
  nopf: '𝕟',
  not: '¬',
  notin: '∉',
  notinE: '⋹̸',
  notindot: '⋵̸',
  notinva: '∉',
  notinvb: '⋷',
  notinvc: '⋶',
  notni: '∌',
  notniva: '∌',
  notnivb: '⋾',
  notnivc: '⋽',
  npar: '∦',
  nparallel: '∦',
  nparsl: '⫽⃥',
  npart: '∂̸',
  npolint: '⨔',
  npr: '⊀',
  nprcue: '⋠',
  npre: '⪯̸',
  nprec: '⊀',
  npreceq: '⪯̸',
  nrArr: '⇏',
  nrarr: '↛',
  nrarrc: '⤳̸',
  nrarrw: '↝̸',
  nrightarrow: '↛',
  nrtri: '⋫',
  nrtrie: '⋭',
  nsc: '⊁',
  nsccue: '⋡',
  nsce: '⪰̸',
  nscr: '𝓃',
  nshortmid: '∤',
  nshortparallel: '∦',
  nsim: '≁',
  nsime: '≄',
  nsimeq: '≄',
  nsmid: '∤',
  nspar: '∦',
  nsqsube: '⋢',
  nsqsupe: '⋣',
  nsub: '⊄',
  nsubE: '⫅̸',
  nsube: '⊈',
  nsubset: '⊂⃒',
  nsubseteq: '⊈',
  nsubseteqq: '⫅̸',
  nsucc: '⊁',
  nsucceq: '⪰̸',
  nsup: '⊅',
  nsupE: '⫆̸',
  nsupe: '⊉',
  nsupset: '⊃⃒',
  nsupseteq: '⊉',
  nsupseteqq: '⫆̸',
  ntgl: '≹',
  ntilde: 'ñ',
  ntlg: '≸',
  ntriangleleft: '⋪',
  ntrianglelefteq: '⋬',
  ntriangleright: '⋫',
  ntrianglerighteq: '⋭',
  nu: 'ν',
  num: '#',
  numero: '№',
  numsp: ' ',
  nvDash: '⊭',
  nvHarr: '⤄',
  nvap: '≍⃒',
  nvdash: '⊬',
  nvge: '≥⃒',
  nvgt: '>⃒',
  nvinfin: '⧞',
  nvlArr: '⤂',
  nvle: '≤⃒',
  nvlt: '<⃒',
  nvltrie: '⊴⃒',
  nvrArr: '⤃',
  nvrtrie: '⊵⃒',
  nvsim: '∼⃒',
  nwArr: '⇖',
  nwarhk: '⤣',
  nwarr: '↖',
  nwarrow: '↖',
  nwnear: '⤧',
  oS: 'Ⓢ',
  oacute: 'ó',
  oast: '⊛',
  ocir: '⊚',
  ocirc: 'ô',
  ocy: 'о',
  odash: '⊝',
  odblac: 'ő',
  odiv: '⨸',
  odot: '⊙',
  odsold: '⦼',
  oelig: 'œ',
  ofcir: '⦿',
  ofr: '𝔬',
  ogon: '˛',
  ograve: 'ò',
  ogt: '⧁',
  ohbar: '⦵',
  ohm: 'Ω',
  oint: '∮',
  olarr: '↺',
  olcir: '⦾',
  olcross: '⦻',
  oline: '‾',
  olt: '⧀',
  omacr: 'ō',
  omega: 'ω',
  omicron: 'ο',
  omid: '⦶',
  ominus: '⊖',
  oopf: '𝕠',
  opar: '⦷',
  operp: '⦹',
  oplus: '⊕',
  or: '∨',
  orarr: '↻',
  ord: '⩝',
  order: 'ℴ',
  orderof: 'ℴ',
  ordf: 'ª',
  ordm: 'º',
  origof: '⊶',
  oror: '⩖',
  orslope: '⩗',
  orv: '⩛',
  oscr: 'ℴ',
  oslash: 'ø',
  osol: '⊘',
  otilde: 'õ',
  otimes: '⊗',
  otimesas: '⨶',
  ouml: 'ö',
  ovbar: '⌽',
  par: '∥',
  para: '¶',
  parallel: '∥',
  parsim: '⫳',
  parsl: '⫽',
  part: '∂',
  pcy: 'п',
  percnt: '%',
  period: '.',
  permil: '‰',
  perp: '⊥',
  pertenk: '‱',
  pfr: '𝔭',
  phi: 'φ',
  phiv: 'ϕ',
  phmmat: 'ℳ',
  phone: '☎',
  pi: 'π',
  pitchfork: '⋔',
  piv: 'ϖ',
  planck: 'ℏ',
  planckh: 'ℎ',
  plankv: 'ℏ',
  plus: '+',
  plusacir: '⨣',
  plusb: '⊞',
  pluscir: '⨢',
  plusdo: '∔',
  plusdu: '⨥',
  pluse: '⩲',
  plusmn: '±',
  plussim: '⨦',
  plustwo: '⨧',
  pm: '±',
  pointint: '⨕',
  popf: '𝕡',
  pound: '£',
  pr: '≺',
  prE: '⪳',
  prap: '⪷',
  prcue: '≼',
  pre: '⪯',
  prec: '≺',
  precapprox: '⪷',
  preccurlyeq: '≼',
  preceq: '⪯',
  precnapprox: '⪹',
  precneqq: '⪵',
  precnsim: '⋨',
  precsim: '≾',
  prime: '′',
  primes: 'ℙ',
  prnE: '⪵',
  prnap: '⪹',
  prnsim: '⋨',
  prod: '∏',
  profalar: '⌮',
  profline: '⌒',
  profsurf: '⌓',
  prop: '∝',
  propto: '∝',
  prsim: '≾',
  prurel: '⊰',
  pscr: '𝓅',
  psi: 'ψ',
  puncsp: ' ',
  qfr: '𝔮',
  qint: '⨌',
  qopf: '𝕢',
  qprime: '⁗',
  qscr: '𝓆',
  quaternions: 'ℍ',
  quatint: '⨖',
  quest: '?',
  questeq: '≟',
  quot: '"',
  rAarr: '⇛',
  rArr: '⇒',
  rAtail: '⤜',
  rBarr: '⤏',
  rHar: '⥤',
  race: '∽̱',
  racute: 'ŕ',
  radic: '√',
  raemptyv: '⦳',
  rang: '⟩',
  rangd: '⦒',
  range: '⦥',
  rangle: '⟩',
  raquo: '»',
  rarr: '→',
  rarrap: '⥵',
  rarrb: '⇥',
  rarrbfs: '⤠',
  rarrc: '⤳',
  rarrfs: '⤞',
  rarrhk: '↪',
  rarrlp: '↬',
  rarrpl: '⥅',
  rarrsim: '⥴',
  rarrtl: '↣',
  rarrw: '↝',
  ratail: '⤚',
  ratio: '∶',
  rationals: 'ℚ',
  rbarr: '⤍',
  rbbrk: '❳',
  rbrace: '}',
  rbrack: ']',
  rbrke: '⦌',
  rbrksld: '⦎',
  rbrkslu: '⦐',
  rcaron: 'ř',
  rcedil: 'ŗ',
  rceil: '⌉',
  rcub: '}',
  rcy: 'р',
  rdca: '⤷',
  rdldhar: '⥩',
  rdquo: '”',
  rdquor: '”',
  rdsh: '↳',
  real: 'ℜ',
  realine: 'ℛ',
  realpart: 'ℜ',
  reals: 'ℝ',
  rect: '▭',
  reg: '®',
  rfisht: '⥽',
  rfloor: '⌋',
  rfr: '𝔯',
  rhard: '⇁',
  rharu: '⇀',
  rharul: '⥬',
  rho: 'ρ',
  rhov: 'ϱ',
  rightarrow: '→',
  rightarrowtail: '↣',
  rightharpoondown: '⇁',
  rightharpoonup: '⇀',
  rightleftarrows: '⇄',
  rightleftharpoons: '⇌',
  rightrightarrows: '⇉',
  rightsquigarrow: '↝',
  rightthreetimes: '⋌',
  ring: '˚',
  risingdotseq: '≓',
  rlarr: '⇄',
  rlhar: '⇌',
  rlm: '‏',
  rmoust: '⎱',
  rmoustache: '⎱',
  rnmid: '⫮',
  roang: '⟭',
  roarr: '⇾',
  robrk: '⟧',
  ropar: '⦆',
  ropf: '𝕣',
  roplus: '⨮',
  rotimes: '⨵',
  rpar: ')',
  rpargt: '⦔',
  rppolint: '⨒',
  rrarr: '⇉',
  rsaquo: '›',
  rscr: '𝓇',
  rsh: '↱',
  rsqb: ']',
  rsquo: '’',
  rsquor: '’',
  rthree: '⋌',
  rtimes: '⋊',
  rtri: '▹',
  rtrie: '⊵',
  rtrif: '▸',
  rtriltri: '⧎',
  ruluhar: '⥨',
  rx: '℞',
  sacute: 'ś',
  sbquo: '‚',
  sc: '≻',
  scE: '⪴',
  scap: '⪸',
  scaron: 'š',
  sccue: '≽',
  sce: '⪰',
  scedil: 'ş',
  scirc: 'ŝ',
  scnE: '⪶',
  scnap: '⪺',
  scnsim: '⋩',
  scpolint: '⨓',
  scsim: '≿',
  scy: 'с',
  sdot: '⋅',
  sdotb: '⊡',
  sdote: '⩦',
  seArr: '⇘',
  searhk: '⤥',
  searr: '↘',
  searrow: '↘',
  sect: '§',
  semi: ';',
  seswar: '⤩',
  setminus: '∖',
  setmn: '∖',
  sext: '✶',
  sfr: '𝔰',
  sfrown: '⌢',
  sharp: '♯',
  shchcy: 'щ',
  shcy: 'ш',
  shortmid: '∣',
  shortparallel: '∥',
  shy: '­',
  sigma: 'σ',
  sigmaf: 'ς',
  sigmav: 'ς',
  sim: '∼',
  simdot: '⩪',
  sime: '≃',
  simeq: '≃',
  simg: '⪞',
  simgE: '⪠',
  siml: '⪝',
  simlE: '⪟',
  simne: '≆',
  simplus: '⨤',
  simrarr: '⥲',
  slarr: '←',
  smallsetminus: '∖',
  smashp: '⨳',
  smeparsl: '⧤',
  smid: '∣',
  smile: '⌣',
  smt: '⪪',
  smte: '⪬',
  smtes: '⪬︀',
  softcy: 'ь',
  sol: '/',
  solb: '⧄',
  solbar: '⌿',
  sopf: '𝕤',
  spades: '♠',
  spadesuit: '♠',
  spar: '∥',
  sqcap: '⊓',
  sqcaps: '⊓︀',
  sqcup: '⊔',
  sqcups: '⊔︀',
  sqsub: '⊏',
  sqsube: '⊑',
  sqsubset: '⊏',
  sqsubseteq: '⊑',
  sqsup: '⊐',
  sqsupe: '⊒',
  sqsupset: '⊐',
  sqsupseteq: '⊒',
  squ: '□',
  square: '□',
  squarf: '▪',
  squf: '▪',
  srarr: '→',
  sscr: '𝓈',
  ssetmn: '∖',
  ssmile: '⌣',
  sstarf: '⋆',
  star: '☆',
  starf: '★',
  straightepsilon: 'ϵ',
  straightphi: 'ϕ',
  strns: '¯',
  sub: '⊂',
  subE: '⫅',
  subdot: '⪽',
  sube: '⊆',
  subedot: '⫃',
  submult: '⫁',
  subnE: '⫋',
  subne: '⊊',
  subplus: '⪿',
  subrarr: '⥹',
  subset: '⊂',
  subseteq: '⊆',
  subseteqq: '⫅',
  subsetneq: '⊊',
  subsetneqq: '⫋',
  subsim: '⫇',
  subsub: '⫕',
  subsup: '⫓',
  succ: '≻',
  succapprox: '⪸',
  succcurlyeq: '≽',
  succeq: '⪰',
  succnapprox: '⪺',
  succneqq: '⪶',
  succnsim: '⋩',
  succsim: '≿',
  sum: '∑',
  sung: '♪',
  sup1: '¹',
  sup2: '²',
  sup3: '³',
  sup: '⊃',
  supE: '⫆',
  supdot: '⪾',
  supdsub: '⫘',
  supe: '⊇',
  supedot: '⫄',
  suphsol: '⟉',
  suphsub: '⫗',
  suplarr: '⥻',
  supmult: '⫂',
  supnE: '⫌',
  supne: '⊋',
  supplus: '⫀',
  supset: '⊃',
  supseteq: '⊇',
  supseteqq: '⫆',
  supsetneq: '⊋',
  supsetneqq: '⫌',
  supsim: '⫈',
  supsub: '⫔',
  supsup: '⫖',
  swArr: '⇙',
  swarhk: '⤦',
  swarr: '↙',
  swarrow: '↙',
  swnwar: '⤪',
  szlig: 'ß',
  target: '⌖',
  tau: 'τ',
  tbrk: '⎴',
  tcaron: 'ť',
  tcedil: 'ţ',
  tcy: 'т',
  tdot: '⃛',
  telrec: '⌕',
  tfr: '𝔱',
  there4: '∴',
  therefore: '∴',
  theta: 'θ',
  thetasym: 'ϑ',
  thetav: 'ϑ',
  thickapprox: '≈',
  thicksim: '∼',
  thinsp: ' ',
  thkap: '≈',
  thksim: '∼',
  thorn: 'þ',
  tilde: '˜',
  times: '×',
  timesb: '⊠',
  timesbar: '⨱',
  timesd: '⨰',
  tint: '∭',
  toea: '⤨',
  top: '⊤',
  topbot: '⌶',
  topcir: '⫱',
  topf: '𝕥',
  topfork: '⫚',
  tosa: '⤩',
  tprime: '‴',
  trade: '™',
  triangle: '▵',
  triangledown: '▿',
  triangleleft: '◃',
  trianglelefteq: '⊴',
  triangleq: '≜',
  triangleright: '▹',
  trianglerighteq: '⊵',
  tridot: '◬',
  trie: '≜',
  triminus: '⨺',
  triplus: '⨹',
  trisb: '⧍',
  tritime: '⨻',
  trpezium: '⏢',
  tscr: '𝓉',
  tscy: 'ц',
  tshcy: 'ћ',
  tstrok: 'ŧ',
  twixt: '≬',
  twoheadleftarrow: '↞',
  twoheadrightarrow: '↠',
  uArr: '⇑',
  uHar: '⥣',
  uacute: 'ú',
  uarr: '↑',
  ubrcy: 'ў',
  ubreve: 'ŭ',
  ucirc: 'û',
  ucy: 'у',
  udarr: '⇅',
  udblac: 'ű',
  udhar: '⥮',
  ufisht: '⥾',
  ufr: '𝔲',
  ugrave: 'ù',
  uharl: '↿',
  uharr: '↾',
  uhblk: '▀',
  ulcorn: '⌜',
  ulcorner: '⌜',
  ulcrop: '⌏',
  ultri: '◸',
  umacr: 'ū',
  uml: '¨',
  uogon: 'ų',
  uopf: '𝕦',
  uparrow: '↑',
  updownarrow: '↕',
  upharpoonleft: '↿',
  upharpoonright: '↾',
  uplus: '⊎',
  upsi: 'υ',
  upsih: 'ϒ',
  upsilon: 'υ',
  upuparrows: '⇈',
  urcorn: '⌝',
  urcorner: '⌝',
  urcrop: '⌎',
  uring: 'ů',
  urtri: '◹',
  uscr: '𝓊',
  utdot: '⋰',
  utilde: 'ũ',
  utri: '▵',
  utrif: '▴',
  uuarr: '⇈',
  uuml: 'ü',
  uwangle: '⦧',
  vArr: '⇕',
  vBar: '⫨',
  vBarv: '⫩',
  vDash: '⊨',
  vangrt: '⦜',
  varepsilon: 'ϵ',
  varkappa: 'ϰ',
  varnothing: '∅',
  varphi: 'ϕ',
  varpi: 'ϖ',
  varpropto: '∝',
  varr: '↕',
  varrho: 'ϱ',
  varsigma: 'ς',
  varsubsetneq: '⊊︀',
  varsubsetneqq: '⫋︀',
  varsupsetneq: '⊋︀',
  varsupsetneqq: '⫌︀',
  vartheta: 'ϑ',
  vartriangleleft: '⊲',
  vartriangleright: '⊳',
  vcy: 'в',
  vdash: '⊢',
  vee: '∨',
  veebar: '⊻',
  veeeq: '≚',
  vellip: '⋮',
  verbar: '|',
  vert: '|',
  vfr: '𝔳',
  vltri: '⊲',
  vnsub: '⊂⃒',
  vnsup: '⊃⃒',
  vopf: '𝕧',
  vprop: '∝',
  vrtri: '⊳',
  vscr: '𝓋',
  vsubnE: '⫋︀',
  vsubne: '⊊︀',
  vsupnE: '⫌︀',
  vsupne: '⊋︀',
  vzigzag: '⦚',
  wcirc: 'ŵ',
  wedbar: '⩟',
  wedge: '∧',
  wedgeq: '≙',
  weierp: '℘',
  wfr: '𝔴',
  wopf: '𝕨',
  wp: '℘',
  wr: '≀',
  wreath: '≀',
  wscr: '𝓌',
  xcap: '⋂',
  xcirc: '◯',
  xcup: '⋃',
  xdtri: '▽',
  xfr: '𝔵',
  xhArr: '⟺',
  xharr: '⟷',
  xi: 'ξ',
  xlArr: '⟸',
  xlarr: '⟵',
  xmap: '⟼',
  xnis: '⋻',
  xodot: '⨀',
  xopf: '𝕩',
  xoplus: '⨁',
  xotime: '⨂',
  xrArr: '⟹',
  xrarr: '⟶',
  xscr: '𝓍',
  xsqcup: '⨆',
  xuplus: '⨄',
  xutri: '△',
  xvee: '⋁',
  xwedge: '⋀',
  yacute: 'ý',
  yacy: 'я',
  ycirc: 'ŷ',
  ycy: 'ы',
  yen: '¥',
  yfr: '𝔶',
  yicy: 'ї',
  yopf: '𝕪',
  yscr: '𝓎',
  yucy: 'ю',
  yuml: 'ÿ',
  zacute: 'ź',
  zcaron: 'ž',
  zcy: 'з',
  zdot: 'ż',
  zeetrf: 'ℨ',
  zeta: 'ζ',
  zfr: '𝔷',
  zhcy: 'ж',
  zigrarr: '⇝',
  zopf: '𝕫',
  zscr: '𝓏',
  zwj: '‍',
  zwnj: '‌'
};

const own$1 = {}.hasOwnProperty;

/**
 * Decode a single character reference (without the `&` or `;`).
 * You probably only need this when you’re building parsers yourself that follow
 * different rules compared to HTML.
 * This is optimized to be tiny in browsers.
 *
 * @param {string} value
 *   `notin` (named), `#123` (deci), `#x123` (hexa).
 * @returns {string|false}
 *   Decoded reference.
 */
function decodeNamedCharacterReference(value) {
  return own$1.call(characterEntities, value) ? characterEntities[value] : false
}

/**
 * Like `Array#splice`, but smarter for giant arrays.
 *
 * `Array#splice` takes all items to be inserted as individual argument which
 * causes a stack overflow in V8 when trying to insert 100k items for instance.
 *
 * Otherwise, this does not return the removed items, and takes `items` as an
 * array instead of rest parameters.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {number} start
 *   Index to remove/insert at (can be negative).
 * @param {number} remove
 *   Number of items to remove.
 * @param {Array<T>} items
 *   Items to inject into `list`.
 * @returns {undefined}
 *   Nothing.
 */
function splice(list, start, remove, items) {
  const end = list.length;
  let chunkStart = 0;
  /** @type {Array<unknown>} */
  let parameters;

  // Make start between zero and `end` (included).
  if (start < 0) {
    start = -start > end ? 0 : end + start;
  } else {
    start = start > end ? end : start;
  }
  remove = remove > 0 ? remove : 0;

  // No need to chunk the items if there’s only a couple (10k) items.
  if (items.length < 10000) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    // @ts-expect-error Hush, it’s fine.
    list.splice(...parameters);
  } else {
    // Delete `remove` items starting from `start`
    if (remove) list.splice(start, remove);

    // Insert the items in chunks to not cause stack overflows.
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 10000);
      parameters.unshift(start, 0);
      // @ts-expect-error Hush, it’s fine.
      list.splice(...parameters);
      chunkStart += 10000;
      start += 10000;
    }
  }
}

/**
 * Append `items` (an array) at the end of `list` (another array).
 * When `list` was empty, returns `items` instead.
 *
 * This prevents a potentially expensive operation when `list` is empty,
 * and adds items in batches to prevent V8 from hanging.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {Array<T>} items
 *   Items to add to `list`.
 * @returns {Array<T>}
 *   Either `list` or `items`.
 */
function push(list, items) {
  if (list.length > 0) {
    splice(list, list.length, 0, items);
    return list
  }
  return items
}

/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Handles} Handles
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').NormalizedExtension} NormalizedExtension
 */


const hasOwnProperty$1 = {}.hasOwnProperty;

/**
 * Combine multiple syntax extensions into one.
 *
 * @param {Array<Extension>} extensions
 *   List of syntax extensions.
 * @returns {NormalizedExtension}
 *   A single combined extension.
 */
function combineExtensions(extensions) {
  /** @type {NormalizedExtension} */
  const all = {};
  let index = -1;

  while (++index < extensions.length) {
    syntaxExtension(all, extensions[index]);
  }

  return all
}

/**
 * Merge `extension` into `all`.
 *
 * @param {NormalizedExtension} all
 *   Extension to merge into.
 * @param {Extension} extension
 *   Extension to merge.
 * @returns {undefined}
 */
function syntaxExtension(all, extension) {
  /** @type {keyof Extension} */
  let hook;

  for (hook in extension) {
    const maybe = hasOwnProperty$1.call(all, hook) ? all[hook] : undefined;
    /** @type {Record<string, unknown>} */
    const left = maybe || (all[hook] = {});
    /** @type {Record<string, unknown> | undefined} */
    const right = extension[hook];
    /** @type {string} */
    let code;

    if (right) {
      for (code in right) {
        if (!hasOwnProperty$1.call(left, code)) left[code] = [];
        const value = right[code];
        constructs(
          // @ts-expect-error Looks like a list.
          left[code],
          Array.isArray(value) ? value : value ? [value] : []
        );
      }
    }
  }
}

/**
 * Merge `list` into `existing` (both lists of constructs).
 * Mutates `existing`.
 *
 * @param {Array<unknown>} existing
 * @param {Array<unknown>} list
 * @returns {undefined}
 */
function constructs(existing, list) {
  let index = -1;
  /** @type {Array<unknown>} */
  const before = [];

  while (++index < list.length) {
(list[index].add === 'after' ? existing : before).push(list[index]);
  }

  splice(existing, 0, 0, before);
}

/**
 * Combine multiple HTML extensions into one.
 *
 * @param {Array<HtmlExtension>} htmlExtensions
 *   List of HTML extensions.
 * @returns {HtmlExtension}
 *   A single combined HTML extension.
 */
function combineHtmlExtensions(htmlExtensions) {
  /** @type {HtmlExtension} */
  const handlers = {};
  let index = -1;

  while (++index < htmlExtensions.length) {
    htmlExtension(handlers, htmlExtensions[index]);
  }

  return handlers
}

/**
 * Merge `extension` into `all`.
 *
 * @param {HtmlExtension} all
 *   Extension to merge into.
 * @param {HtmlExtension} extension
 *   Extension to merge.
 * @returns {undefined}
 */
function htmlExtension(all, extension) {
  /** @type {keyof HtmlExtension} */
  let hook;

  for (hook in extension) {
    const maybe = hasOwnProperty$1.call(all, hook) ? all[hook] : undefined;
    const left = maybe || (all[hook] = {});
    const right = extension[hook];
    /** @type {keyof Handles} */
    let type;

    if (right) {
      for (type in right) {
        // @ts-expect-error assume document vs regular handler are managed correctly.
        left[type] = right[type];
      }
    }
  }
}

/**
 * Turn the number (in string form as either hexa- or plain decimal) coming from
 * a numeric character reference into a character.
 *
 * Sort of like `String.fromCharCode(Number.parseInt(value, base))`, but makes
 * non-characters and control characters safe.
 *
 * @param {string} value
 *   Value to decode.
 * @param {number} base
 *   Numeric base.
 * @returns {string}
 *   Character.
 */
function decodeNumericCharacterReference(value, base) {
  const code = Number.parseInt(value, base);
  if (
    // C0 except for HT, LF, FF, CR, space.
    code < 9 ||
    code === 11 ||
    (code > 13 && code < 32) ||
    // Control character (DEL) of C0, and C1 controls.
    (code > 126 && code < 160) ||
    // Lone high surrogates and low surrogates.
    (code > 55_295 && code < 57_344) ||
    // Noncharacters.
    (code > 64_975 && code < 65_008) /* eslint-disable no-bitwise */ ||
    (code & 65_535) === 65_535 ||
    (code & 65_535) === 65_534 /* eslint-enable no-bitwise */ ||
    // Out of range
    code > 1_114_111
  ) {
    return '\uFFFD'
  }
  return String.fromCharCode(code)
}

const characterReferences = {'"': 'quot', '&': 'amp', '<': 'lt', '>': 'gt'};

/**
 * Encode only the dangerous HTML characters.
 *
 * This ensures that certain characters which have special meaning in HTML are
 * dealt with.
 * Technically, we can skip `>` and `"` in many cases, but CM includes them.
 *
 * @param {string} value
 *   Value to encode.
 * @returns {string}
 *   Encoded value.
 */
function encode(value) {
  return value.replace(/["&<>]/g, replace)

  /**
   * @param {string} value
   * @returns {string}
   */
  function replace(value) {
    // @ts-expect-error Hush, it’s fine.
    return '&' + characterReferences[value] + ';'
  }
}

/**
 * Normalize an identifier (as found in references, definitions).
 *
 * Collapses markdown whitespace, trim, and then lower- and uppercase.
 *
 * Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
 * lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
 * uppercase character (U+0398 (`Θ`)).
 * So, to get a canonical form, we perform both lower- and uppercase.
 *
 * Using uppercase last makes sure keys will never interact with default
 * prototypal values (such as `constructor`): nothing in the prototype of
 * `Object` is uppercase.
 *
 * @param {string} value
 *   Identifier to normalize.
 * @returns {string}
 *   Normalized identifier.
 */
function normalizeIdentifier(value) {
  return (
    value
      // Collapse markdown whitespace.
      .replace(/[\t\n\r ]+/g, ' ')
      // Trim.
      .replace(/^ | $/g, '')
      // Some characters are considered “uppercase”, but if their lowercase
      // counterpart is uppercased will result in a different uppercase
      // character.
      // Hence, to get that form, we perform both lower- and uppercase.
      // Upper case makes sure keys will not interact with default prototypal
      // methods: no method is uppercase.
      .toLowerCase()
      .toUpperCase()
  )
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 */

const unicodePunctuationInternal = regexCheck(/\p{P}/u);

/**
 * Check whether the character code represents an ASCII alpha (`a` through `z`,
 * case insensitive).
 *
 * An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
 *
 * An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
 * to U+005A (`Z`).
 *
 * An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
 * to U+007A (`z`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAlpha = regexCheck(/[A-Za-z]/);

/**
 * Check whether the character code represents an ASCII alphanumeric (`a`
 * through `z`, case insensitive, or `0` through `9`).
 *
 * An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
 * (see `asciiAlpha`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);

/**
 * Check whether the character code represents an ASCII atext.
 *
 * atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
 * the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
 * U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
 * SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
 * CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
 * (`{`) to U+007E TILDE (`~`).
 *
 * See:
 * **\[RFC5322]**:
 * [Internet Message Format](https://tools.ietf.org/html/rfc5322).
 * P. Resnick.
 * IETF.
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);

/**
 * Check whether a character code is an ASCII control character.
 *
 * An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
 * to U+001F (US), or U+007F (DEL).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code !== null && (code < 32 || code === 127)
  )
}

/**
 * Check whether the character code represents an ASCII digit (`0` through `9`).
 *
 * An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
 * U+0039 (`9`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiDigit = regexCheck(/\d/);

/**
 * Check whether the character code represents an ASCII hex digit (`a` through
 * `f`, case insensitive, or `0` through `9`).
 *
 * An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
 * digit, or an ASCII lower hex digit.
 *
 * An **ASCII upper hex digit** is a character in the inclusive range U+0041
 * (`A`) to U+0046 (`F`).
 *
 * An **ASCII lower hex digit** is a character in the inclusive range U+0061
 * (`a`) to U+0066 (`f`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);

/**
 * Check whether the character code represents ASCII punctuation.
 *
 * An **ASCII punctuation** is a character in the inclusive ranges U+0021
 * EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
 * SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
 * (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);

/**
 * Check whether a character code is a markdown line ending.
 *
 * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
 * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
 *
 * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
 * RETURN (CR) are replaced by these virtual characters depending on whether
 * they occurred together.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEnding(code) {
  return code !== null && code < -2
}

/**
 * Check whether a character code is a markdown line ending (see
 * `markdownLineEnding`) or markdown space (see `markdownSpace`).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEndingOrSpace(code) {
  return code !== null && (code < 0 || code === 32)
}

/**
 * Check whether a character code is a markdown space.
 *
 * A **markdown space** is the concrete character U+0020 SPACE (SP) and the
 * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
 *
 * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
 * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
 * SPACE (VS) characters, depending on the column at which the tab occurred.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownSpace(code) {
  return code === -2 || code === -1 || code === 32
}

// Size note: removing ASCII from the regex and using `asciiPunctuation` here
// In fact adds to the bundle size.
/**
 * Check whether the character code represents Unicode punctuation.
 *
 * A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
 * Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
 * (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
 * (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
 * punctuation (see `asciiPunctuation`).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function unicodePunctuation(code) {
  return asciiPunctuation(code) || unicodePunctuationInternal(code)
}

/**
 * Check whether the character code represents Unicode whitespace.
 *
 * Note that this does handle micromark specific markdown whitespace characters.
 * See `markdownLineEndingOrSpace` to check that.
 *
 * A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
 * Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
 * U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const unicodeWhitespace = regexCheck(/\s/);

/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 * @returns {(code: Code) => boolean}
 */
function regexCheck(regex) {
  return check

  /**
   * Check whether a code matches the bound regex.
   *
   * @param {Code} code
   *   Character code.
   * @returns {boolean}
   *   Whether the character code matches the bound regex.
   */
  function check(code) {
    return code !== null && code > -1 && regex.test(String.fromCharCode(code))
  }
}

/**
 * Make a value safe for injection as a URL.
 *
 * This encodes unsafe characters with percent-encoding and skips already
 * encoded sequences (see `normalizeUri`).
 * Further unsafe characters are encoded as character references (see
 * `micromark-util-encode`).
 *
 * A regex of allowed protocols can be given, in which case the URL is
 * sanitized.
 * For example, `/^(https?|ircs?|mailto|xmpp)$/i` can be used for `a[href]`, or
 * `/^https?$/i` for `img[src]` (this is what `github.com` allows).
 * If the URL includes an unknown protocol (one not matched by `protocol`, such
 * as a dangerous example, `javascript:`), the value is ignored.
 *
 * @param {string | null | undefined} url
 *   URI to sanitize.
 * @param {RegExp | null | undefined} [protocol]
 *   Allowed protocols.
 * @returns {string}
 *   Sanitized URI.
 */
function sanitizeUri(url, protocol) {
  const value = encode(normalizeUri(url || ''));
  if (!protocol) {
    return value
  }
  const colon = value.indexOf(':');
  const questionMark = value.indexOf('?');
  const numberSign = value.indexOf('#');
  const slash = value.indexOf('/');
  if (
    // If there is no protocol, it’s relative.
    colon < 0 ||
    // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    (slash > -1 && colon > slash) ||
    (questionMark > -1 && colon > questionMark) ||
    (numberSign > -1 && colon > numberSign) ||
    // It is a protocol, it should be allowed.
    protocol.test(value.slice(0, colon))
  ) {
    return value
  }
  return ''
}

/**
 * Normalize a URL.
 *
 * Encode unsafe characters with percent-encoding, skipping already encoded
 * sequences.
 *
 * @param {string} value
 *   URI to normalize.
 * @returns {string}
 *   Normalized URI.
 */
function normalizeUri(value) {
  /** @type {Array<string>} */
  const result = [];
  let index = -1;
  let start = 0;
  let skip = 0;
  while (++index < value.length) {
    const code = value.charCodeAt(index);
    /** @type {string} */
    let replace = '';

    // A correct percent encoded value.
    if (
      code === 37 &&
      asciiAlphanumeric(value.charCodeAt(index + 1)) &&
      asciiAlphanumeric(value.charCodeAt(index + 2))
    ) {
      skip = 2;
    }
    // ASCII.
    else if (code < 128) {
      if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) {
        replace = String.fromCharCode(code);
      }
    }
    // Astral.
    else if (code > 55_295 && code < 57_344) {
      const next = value.charCodeAt(index + 1);

      // A correct surrogate pair.
      if (code < 56_320 && next > 56_319 && next < 57_344) {
        replace = String.fromCharCode(code, next);
        skip = 1;
      }
      // Lone surrogate.
      else {
        replace = '\uFFFD';
      }
    }
    // Unicode.
    else {
      replace = String.fromCharCode(code);
    }
    if (replace) {
      result.push(value.slice(start, index), encodeURIComponent(replace));
      start = index + skip + 1;
      replace = '';
    }
    if (skip) {
      index += skip;
      skip = 0;
    }
  }
  return result.join('') + value.slice(start)
}

/**
 * While micromark is a lexer/tokenizer, the common case of going from markdown
 * to html is currently built in as this module, even though the parts can be
 * used separately to build ASTs, CSTs, or many other output formats.
 *
 * Having an HTML compiler built in is useful because it allows us to check for
 * compliancy to CommonMark, the de facto norm of markdown, specified in roughly
 * 600 input/output cases.
 *
 * This module has an interface that accepts lists of events instead of the
 * whole at once, however, because markdown can’t be truly streaming, we buffer
 * events before processing and outputting the final result.
 */

const hasOwnProperty = {}.hasOwnProperty;

/**
 * These two are allowlists of safe protocols for full URLs in respectively the
 * `href` (on `<a>`) and `src` (on `<img>`) attributes.
 * They are based on what is allowed on GitHub,
 * <https://github.com/syntax-tree/hast-util-sanitize/blob/9275b21/lib/github.json#L31>
 */
const protocolHref = /^(https?|ircs?|mailto|xmpp)$/i;
const protocolSrc = /^https?$/i;

/**
 * @param {CompileOptions | null | undefined} [options]
 * @returns {Compile}
 */
function compile(options) {
  const settings = options || {};

  /**
   * Tags is needed because according to markdown, links and emphasis and
   * whatnot can exist in images, however, as HTML doesn’t allow content in
   * images, the tags are ignored in the `alt` attribute, but the content
   * remains.
   *
   * @type {boolean | undefined}
   */
  let tags = true;

  /**
   * An object to track identifiers to media (URLs and titles) defined with
   * definitions.
   *
   * @type {Record<string, Definition>}
   */
  const definitions = {};

  /**
   * A lot of the handlers need to capture some of the output data, modify it
   * somehow, and then deal with it.
   * We do that by tracking a stack of buffers, that can be opened (with
   * `buffer`) and closed (with `resume`) to access them.
   *
   * @type {Array<Array<string>>}
   */
  const buffers = [[]];

  /**
   * As we can have links in images and the other way around, where the deepest
   * ones are closed first, we need to track which one we’re in.
   *
   * @type {Array<Media>}
   */
  const mediaStack = [];

  /**
   * Same as `mediaStack` for tightness, which is specific to lists.
   * We need to track if we’re currently in a tight or loose container.
   *
   * @type {Array<boolean>}
   */
  const tightStack = [];

  /** @type {HtmlExtension} */
  const defaultHandlers = {
    enter: {
      blockQuote: onenterblockquote,
      codeFenced: onentercodefenced,
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: onentercodeindented,
      codeText: onentercodetext,
      content: onentercontent,
      definition: onenterdefinition,
      definitionDestinationString: onenterdefinitiondestinationstring,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: onenteremphasis,
      htmlFlow: onenterhtmlflow,
      htmlText: onenterhtml,
      image: onenterimage,
      label: buffer,
      link: onenterlink,
      listItemMarker: onenterlistitemmarker,
      listItemValue: onenterlistitemvalue,
      listOrdered: onenterlistordered,
      listUnordered: onenterlistunordered,
      paragraph: onenterparagraph,
      reference: buffer,
      resource: onenterresource,
      resourceDestinationString: onenterresourcedestinationstring,
      resourceTitleString: buffer,
      setextHeading: onentersetextheading,
      strong: onenterstrong
    },
    exit: {
      atxHeading: onexitatxheading,
      atxHeadingSequence: onexitatxheadingsequence,
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: onexitblockquote,
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      codeFenced: onexitflowcode,
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onresumedrop,
      codeFlowValue: onexitcodeflowvalue,
      codeIndented: onexitflowcode,
      codeText: onexitcodetext,
      codeTextData: onexitdata,
      data: onexitdata,
      definition: onexitdefinition,
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: onexitemphasis,
      hardBreakEscape: onexithardbreak,
      hardBreakTrailing: onexithardbreak,
      htmlFlow: onexithtml,
      htmlFlowData: onexitdata,
      htmlText: onexithtml,
      htmlTextData: onexitdata,
      image: onexitmedia,
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: onexitmedia,
      listOrdered: onexitlistordered,
      listUnordered: onexitlistunordered,
      paragraph: onexitparagraph,
      reference: onresumedrop,
      referenceString: onexitreferencestring,
      resource: onresumedrop,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      setextHeading: onexitsetextheading,
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: onexitstrong,
      thematicBreak: onexitthematicbreak
    }
  };

  /**
   * Combine the HTML extensions with the default handlers.
   * An HTML extension is an object whose fields are either `enter` or `exit`
   * (reflecting whether a token is entered or exited).
   * The values at such objects are names of tokens mapping to handlers.
   * Handlers are called, respectively when a token is opener or closed, with
   * that token, and a context as `this`.
   */
  const handlers =
    /** @type {NormalizedHtmlExtension} */
    combineHtmlExtensions(
      [defaultHandlers].concat(settings.htmlExtensions || [])
    );

  /**
   * Handlers do often need to keep track of some state.
   * That state is provided here as a key-value store (an object).
   *
   * @type {CompileData}
   */
  const data = {
    tightStack,
    definitions
  };

  /**
   * The context for handlers references a couple of useful functions.
   * In handlers from extensions, those can be accessed at `this`.
   * For the handlers here, they can be accessed directly.
   *
   * @type {Omit<CompileContext, 'sliceSerialize'>}
   */
  const context = {
    lineEndingIfNeeded,
    options: settings,
    encode: encode$1,
    raw,
    tag,
    buffer,
    resume,
    setData,
    getData
  };

  /**
   * Generally, micromark copies line endings (`'\r'`, `'\n'`, `'\r\n'`) in the
   * markdown document over to the compiled HTML.
   * In some cases, such as `> a`, CommonMark requires that extra line endings
   * are added: `<blockquote>\n<p>a</p>\n</blockquote>`.
   * This variable hold the default line ending when given (or `undefined`),
   * and in the latter case will be updated to the first found line ending if
   * there is one.
   */
  let lineEndingStyle = settings.defaultLineEnding;

  // Return the function that handles a slice of events.
  return compile

  /**
   * Deal w/ a slice of events.
   * Return either the empty string if there’s nothing of note to return, or the
   * result when done.
   *
   * @param {Array<Event>} events
   * @returns {string}
   */
  function compile(events) {
    let index = -1;
    let start = 0;
    /** @type {Array<number>} */
    const listStack = [];
    // As definitions can come after references, we need to figure out the media
    // (urls and titles) defined by them before handling the references.
    // So, we do sort of what HTML does: put metadata at the start (in head), and
    // then put content after (`body`).
    /** @type {Array<Event>} */
    let head = [];
    /** @type {Array<Event>} */
    let body = [];
    while (++index < events.length) {
      // Figure out the line ending style used in the document.
      if (
        !lineEndingStyle &&
        (events[index][1].type === 'lineEnding' ||
          events[index][1].type === 'lineEndingBlank')
      ) {
        // @ts-expect-error Hush, it’s a line ending.
        lineEndingStyle = events[index][2].sliceSerialize(events[index][1]);
      }

      // Preprocess lists to infer whether the list is loose or not.
      if (
        events[index][1].type === 'listOrdered' ||
        events[index][1].type === 'listUnordered'
      ) {
        if (events[index][0] === 'enter') {
          listStack.push(index);
        } else {
          prepareList(events.slice(listStack.pop(), index));
        }
      }

      // Move definitions to the front.
      if (events[index][1].type === 'definition') {
        if (events[index][0] === 'enter') {
          body = push(body, events.slice(start, index));
          start = index;
        } else {
          head = push(head, events.slice(start, index + 1));
          start = index + 1;
        }
      }
    }
    head = push(head, body);
    head = push(head, events.slice(start));
    index = -1;
    const result = head;

    // Handle the start of the document, if defined.
    if (handlers.enter.null) {
      handlers.enter.null.call(context);
    }

    // Handle all events.
    while (++index < events.length) {
      const handles = handlers[result[index][0]];
      const kind = result[index][1].type;
      const handle = handles[kind];
      if (hasOwnProperty.call(handles, kind) && handle) {
        handle.call(
          Object.assign(
            {
              sliceSerialize: result[index][2].sliceSerialize
            },
            context
          ),
          result[index][1]
        );
      }
    }

    // Handle the end of the document, if defined.
    if (handlers.exit.null) {
      handlers.exit.null.call(context);
    }
    return buffers[0].join('')
  }

  /**
   * Figure out whether lists are loose or not.
   *
   * @param {Array<Event>} slice
   * @returns {undefined}
   */
  function prepareList(slice) {
    const length = slice.length;
    let index = 0; // Skip open.
    let containerBalance = 0;
    let loose = false;
    /** @type {boolean | undefined} */
    let atMarker;
    while (++index < length) {
      const event = slice[index];
      if (event[1]._container) {
        atMarker = undefined;
        if (event[0] === 'enter') {
          containerBalance++;
        } else {
          containerBalance--;
        }
      } else
        switch (event[1].type) {
          case 'listItemPrefix': {
            if (event[0] === 'exit') {
              atMarker = true;
            }
            break
          }
          case 'linePrefix': {
            // Ignore

            break
          }
          case 'lineEndingBlank': {
            if (event[0] === 'enter' && !containerBalance) {
              if (atMarker) {
                atMarker = undefined;
              } else {
                loose = true;
              }
            }
            break
          }
          default: {
            atMarker = undefined;
          }
        }
    }
    slice[0][1]._loose = loose;
  }

  /**
   * @type {CompileContext['setData']}
   */
  function setData(key, value) {
    // @ts-expect-error: assume `value` is omitted (`undefined` is passed) only
    // if allowed.
    data[key] = value;
  }

  /**
   * @type {CompileContext['getData']}
   */
  function getData(key) {
    return data[key]
  }

  /** @type {CompileContext['buffer']} */
  function buffer() {
    buffers.push([]);
  }

  /** @type {CompileContext['resume']} */
  function resume() {
    const buf = buffers.pop();
    return buf.join('')
  }

  /** @type {CompileContext['tag']} */
  function tag(value) {
    if (!tags) return
    setData('lastWasTag', true);
    buffers[buffers.length - 1].push(value);
  }

  /** @type {CompileContext['raw']} */
  function raw(value) {
    setData('lastWasTag');
    buffers[buffers.length - 1].push(value);
  }

  /**
   * Output an extra line ending.
   *
   * @returns {undefined}
   */
  function lineEnding() {
    raw(lineEndingStyle || '\n');
  }

  /** @type {CompileContext['lineEndingIfNeeded']} */
  function lineEndingIfNeeded() {
    const buffer = buffers[buffers.length - 1];
    const slice = buffer[buffer.length - 1];
    const previous = slice ? slice.charCodeAt(slice.length - 1) : null;
    if (previous === 10 || previous === 13 || previous === null) {
      return
    }
    lineEnding();
  }

  /** @type {CompileContext['encode']} */
  function encode$1(value) {
    return getData('ignoreEncode') ? value : encode(value)
  }

  //
  // Handlers.
  //

  /**
   * @returns {undefined}
   */
  function onresumedrop() {
    resume();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistordered(token) {
    tightStack.push(!token._loose);
    lineEndingIfNeeded();
    tag('<ol');
    setData('expectFirstItem', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistunordered(token) {
    tightStack.push(!token._loose);
    lineEndingIfNeeded();
    tag('<ul');
    setData('expectFirstItem', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistitemvalue(token) {
    if (getData('expectFirstItem')) {
      const value = Number.parseInt(this.sliceSerialize(token), 10);
      if (value !== 1) {
        tag(' start="' + encode$1(String(value)) + '"');
      }
    }
  }

  /**
   * @returns {undefined}
   */
  function onenterlistitemmarker() {
    if (getData('expectFirstItem')) {
      tag('>');
    } else {
      onexitlistitem();
    }
    lineEndingIfNeeded();
    tag('<li>');
    setData('expectFirstItem');
    // “Hack” to prevent a line ending from showing up if the item is empty.
    setData('lastWasTag');
  }

  /**
   * @returns {undefined}
   */
  function onexitlistordered() {
    onexitlistitem();
    tightStack.pop();
    lineEnding();
    tag('</ol>');
  }

  /**
   * @returns {undefined}
   */
  function onexitlistunordered() {
    onexitlistitem();
    tightStack.pop();
    lineEnding();
    tag('</ul>');
  }

  /**
   * @returns {undefined}
   */
  function onexitlistitem() {
    if (getData('lastWasTag') && !getData('slurpAllLineEndings')) {
      lineEndingIfNeeded();
    }
    tag('</li>');
    setData('slurpAllLineEndings');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterblockquote() {
    tightStack.push(false);
    lineEndingIfNeeded();
    tag('<blockquote>');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitblockquote() {
    tightStack.pop();
    lineEndingIfNeeded();
    tag('</blockquote>');
    setData('slurpAllLineEndings');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterparagraph() {
    if (!tightStack[tightStack.length - 1]) {
      lineEndingIfNeeded();
      tag('<p>');
    }
    setData('slurpAllLineEndings');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitparagraph() {
    if (tightStack[tightStack.length - 1]) {
      setData('slurpAllLineEndings', true);
    } else {
      tag('</p>');
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onentercodefenced() {
    lineEndingIfNeeded();
    tag('<pre><code');
    setData('fencesCount', 0);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfenceinfo() {
    const value = resume();
    tag(' class="language-' + value + '"');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfence() {
    const count = getData('fencesCount') || 0;
    if (!count) {
      tag('>');
      setData('slurpOneLineEnding', true);
    }
    setData('fencesCount', count + 1);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onentercodeindented() {
    lineEndingIfNeeded();
    tag('<pre><code>');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitflowcode() {
    const count = getData('fencesCount');

    // One special case is if we are inside a container, and the fenced code was
    // not closed (meaning it runs to the end).
    // In that case, the following line ending, is considered *outside* the
    // fenced code and block quote by micromark, but CM wants to treat that
    // ending as part of the code.
    if (
      count !== undefined &&
      count < 2 &&
      data.tightStack.length > 0 &&
      !getData('lastWasTag')
    ) {
      lineEnding();
    }

    // But in most cases, it’s simpler: when we’ve seen some data, emit an extra
    // line ending when needed.
    if (getData('flowCodeSeenData')) {
      lineEndingIfNeeded();
    }
    tag('</code></pre>');
    if (count !== undefined && count < 2) lineEndingIfNeeded();
    setData('flowCodeSeenData');
    setData('fencesCount');
    setData('slurpOneLineEnding');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterimage() {
    mediaStack.push({
      image: true
    });
    tags = undefined; // Disallow tags.
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlink() {
    mediaStack.push({});
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitlabeltext(token) {
    mediaStack[mediaStack.length - 1].labelId = this.sliceSerialize(token);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitlabel() {
    mediaStack[mediaStack.length - 1].label = resume();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitreferencestring(token) {
    mediaStack[mediaStack.length - 1].referenceId = this.sliceSerialize(token);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterresource() {
    buffer(); // We can have line endings in the resource, ignore them.
    mediaStack[mediaStack.length - 1].destination = '';
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterresourcedestinationstring() {
    buffer();
    // Ignore encoding the result, as we’ll first percent encode the url and
    // encode manually after.
    setData('ignoreEncode', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitresourcedestinationstring() {
    mediaStack[mediaStack.length - 1].destination = resume();
    setData('ignoreEncode');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitresourcetitlestring() {
    mediaStack[mediaStack.length - 1].title = resume();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitmedia() {
    let index = mediaStack.length - 1; // Skip current.
    const media = mediaStack[index];
    const id = media.referenceId || media.labelId;
    const context =
      media.destination === undefined
        ? definitions[normalizeIdentifier(id)]
        : media;
    tags = true;
    while (index--) {
      if (mediaStack[index].image) {
        tags = undefined;
        break
      }
    }
    if (media.image) {
      tag(
        '<img src="' +
          sanitizeUri(
            context.destination,
            settings.allowDangerousProtocol ? undefined : protocolSrc
          ) +
          '" alt="'
      );
      raw(media.label);
      tag('"');
    } else {
      tag(
        '<a href="' +
          sanitizeUri(
            context.destination,
            settings.allowDangerousProtocol ? undefined : protocolHref
          ) +
          '"'
      );
    }
    tag(context.title ? ' title="' + context.title + '"' : '');
    if (media.image) {
      tag(' />');
    } else {
      tag('>');
      raw(media.label);
      tag('</a>');
    }
    mediaStack.pop();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterdefinition() {
    buffer();
    mediaStack.push({});
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitionlabelstring(token) {
    // Discard label, use the source content instead.
    resume();
    mediaStack[mediaStack.length - 1].labelId = this.sliceSerialize(token);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterdefinitiondestinationstring() {
    buffer();
    setData('ignoreEncode', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiondestinationstring() {
    mediaStack[mediaStack.length - 1].destination = resume();
    setData('ignoreEncode');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiontitlestring() {
    mediaStack[mediaStack.length - 1].title = resume();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinition() {
    const media = mediaStack[mediaStack.length - 1];
    const id = normalizeIdentifier(media.labelId);
    resume();
    if (!hasOwnProperty.call(definitions, id)) {
      definitions[id] = mediaStack[mediaStack.length - 1];
    }
    mediaStack.pop();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onentercontent() {
    setData('slurpAllLineEndings', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitatxheadingsequence(token) {
    // Exit for further sequences.
    if (getData('headingRank')) return
    setData('headingRank', this.sliceSerialize(token).length);
    lineEndingIfNeeded();
    tag('<h' + getData('headingRank') + '>');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onentersetextheading() {
    buffer();
    setData('slurpAllLineEndings');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadingtext() {
    setData('slurpAllLineEndings', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitatxheading() {
    tag('</h' + getData('headingRank') + '>');
    setData('headingRank');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadinglinesequence(token) {
    setData(
      'headingRank',
      this.sliceSerialize(token).charCodeAt(0) === 61 ? 1 : 2
    );
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheading() {
    const value = resume();
    lineEndingIfNeeded();
    tag('<h' + getData('headingRank') + '>');
    raw(value);
    tag('</h' + getData('headingRank') + '>');
    setData('slurpAllLineEndings');
    setData('headingRank');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdata(token) {
    raw(encode$1(this.sliceSerialize(token)));
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitlineending(token) {
    if (getData('slurpAllLineEndings')) {
      return
    }
    if (getData('slurpOneLineEnding')) {
      setData('slurpOneLineEnding');
      return
    }
    if (getData('inCodeText')) {
      raw(' ');
      return
    }
    raw(encode$1(this.sliceSerialize(token)));
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodeflowvalue(token) {
    raw(encode$1(this.sliceSerialize(token)));
    setData('flowCodeSeenData', true);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexithardbreak() {
    tag('<br />');
  }

  /**
   * @returns {undefined}
   */
  function onenterhtmlflow() {
    lineEndingIfNeeded();
    onenterhtml();
  }

  /**
   * @returns {undefined}
   */
  function onexithtml() {
    setData('ignoreEncode');
  }

  /**
   * @returns {undefined}
   */
  function onenterhtml() {
    if (settings.allowDangerousHtml) {
      setData('ignoreEncode', true);
    }
  }

  /**
   * @returns {undefined}
   */
  function onenteremphasis() {
    tag('<em>');
  }

  /**
   * @returns {undefined}
   */
  function onenterstrong() {
    tag('<strong>');
  }

  /**
   * @returns {undefined}
   */
  function onentercodetext() {
    setData('inCodeText', true);
    tag('<code>');
  }

  /**
   * @returns {undefined}
   */
  function onexitcodetext() {
    setData('inCodeText');
    tag('</code>');
  }

  /**
   * @returns {undefined}
   */
  function onexitemphasis() {
    tag('</em>');
  }

  /**
   * @returns {undefined}
   */
  function onexitstrong() {
    tag('</strong>');
  }

  /**
   * @returns {undefined}
   */
  function onexitthematicbreak() {
    lineEndingIfNeeded();
    tag('<hr />');
  }

  /**
   * @this {CompileContext}
   * @param {Token} token
   * @returns {undefined}
   */
  function onexitcharacterreferencemarker(token) {
    setData('characterReferenceType', token.type);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreferencevalue(token) {
    let value = this.sliceSerialize(token);

    // @ts-expect-error `decodeNamedCharacterReference` can return false for
    // invalid named character references, but everything we’ve tokenized is
    // valid.
    value = getData('characterReferenceType')
      ? decodeNumericCharacterReference(
          value,
          getData('characterReferenceType') ===
            'characterReferenceMarkerNumeric'
            ? 10
            : 16
        )
      : decodeNamedCharacterReference(value);
    raw(encode$1(value));
    setData('characterReferenceType');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkprotocol(token) {
    const uri = this.sliceSerialize(token);
    tag(
      '<a href="' +
        sanitizeUri(
          uri,
          settings.allowDangerousProtocol ? undefined : protocolHref
        ) +
        '">'
    );
    raw(encode$1(uri));
    tag('</a>');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkemail(token) {
    const uri = this.sliceSerialize(token);
    tag('<a href="' + sanitizeUri('mailto:' + uri) + '">');
    raw(encode$1(uri));
    tag('</a>');
  }
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */


// To do: implement `spaceOrTab`, `spaceOrTabMinMax`, `spaceOrTabWithOptions`.

/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   spaces in markdown are often optional, in which case this factory can be
 *     used and `ok` will be switched to whether spaces were found or not
 * *   one line ending or space can be detected with `markdownSpace(code)` right
 *     before using `factorySpace`
 *
 * ###### Examples
 *
 * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
 * single space.
 *
 * ```markdown
 * ␉
 * ␠␠␠␠
 * ␉␠
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {TokenType} type
 *   Type (`' \t'`).
 * @param {number | undefined} [max=Infinity]
 *   Max (exclusive).
 * @returns {State}
 *   Start state.
 */
function factorySpace(effects, ok, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;
  return start

  /** @type {State} */
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type);
      return prefix(code)
    }
    return ok(code)
  }

  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code);
      return prefix
    }
    effects.exit(type);
    return ok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/** @type {InitialConstruct} */
const content$1 = {
  tokenize: initializeContent
};

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeContent(effects) {
  const contentStart = effects.attempt(
    this.parser.constructs.contentInitial,
    afterContentStartConstruct,
    paragraphInitial
  );
  /** @type {Token} */
  let previous;
  return contentStart

  /** @type {State} */
  function afterContentStartConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return
    }
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return factorySpace(effects, contentStart, 'linePrefix')
  }

  /** @type {State} */
  function paragraphInitial(code) {
    effects.enter('paragraph');
    return lineStart(code)
  }

  /** @type {State} */
  function lineStart(code) {
    const token = effects.enter('chunkText', {
      contentType: 'text',
      previous
    });
    if (previous) {
      previous.next = token;
    }
    previous = token;
    return data(code)
  }

  /** @type {State} */
  function data(code) {
    if (code === null) {
      effects.exit('chunkText');
      effects.exit('paragraph');
      effects.consume(code);
      return
    }
    if (markdownLineEnding(code)) {
      effects.consume(code);
      effects.exit('chunkText');
      return lineStart
    }

    // Data.
    effects.consume(code);
    return data
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ContainerState} ContainerState
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {InitialConstruct} */
const document$2 = {
  tokenize: initializeDocument
};

/** @type {Construct} */
const containerConstruct = {
  tokenize: tokenizeContainer
};

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeDocument(effects) {
  const self = this;
  /** @type {Array<StackItem>} */
  const stack = [];
  let continued = 0;
  /** @type {TokenizeContext | undefined} */
  let childFlow;
  /** @type {Token | undefined} */
  let childToken;
  /** @type {number} */
  let lineStartOffset;
  return start

  /** @type {State} */
  function start(code) {
    // First we iterate through the open blocks, starting with the root
    // document, and descending through last children down to the last open
    // block.
    // Each block imposes a condition that the line must satisfy if the block is
    // to remain open.
    // For example, a block quote requires a `>` character.
    // A paragraph requires a non-blank line.
    // In this phase we may match all or just some of the open blocks.
    // But we cannot close unmatched blocks yet, because we may have a lazy
    // continuation line.
    if (continued < stack.length) {
      const item = stack[continued];
      self.containerState = item[1];
      return effects.attempt(
        item[0].continuation,
        documentContinue,
        checkNewContainers
      )(code)
    }

    // Done.
    return checkNewContainers(code)
  }

  /** @type {State} */
  function documentContinue(code) {
    continued++;

    // Note: this field is called `_closeFlow` but it also closes containers.
    // Perhaps a good idea to rename it but it’s already used in the wild by
    // extensions.
    if (self.containerState._closeFlow) {
      self.containerState._closeFlow = undefined;
      if (childFlow) {
        closeFlow();
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when dealing with lazy lines in `writeToChild`.
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      /** @type {Point | undefined} */
      let point;

      // Find the flow chunk.
      while (indexBeforeFlow--) {
        if (
          self.events[indexBeforeFlow][0] === 'exit' &&
          self.events[indexBeforeFlow][1].type === 'chunkFlow'
        ) {
          point = self.events[indexBeforeFlow][1].end;
          break
        }
      }
      exitContainers(continued);

      // Fix positions.
      let index = indexBeforeExits;
      while (index < self.events.length) {
        self.events[index][1].end = Object.assign({}, point);
        index++;
      }

      // Inject the exits earlier (they’re still also at the end).
      splice(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      );

      // Discard the duplicate exits.
      self.events.length = index;
      return checkNewContainers(code)
    }
    return start(code)
  }

  /** @type {State} */
  function checkNewContainers(code) {
    // Next, after consuming the continuation markers for existing blocks, we
    // look for new block starts (e.g. `>` for a block quote).
    // If we encounter a new block start, we close any blocks unmatched in
    // step 1 before creating the new block as a child of the last matched
    // block.
    if (continued === stack.length) {
      // No need to `check` whether there’s a container, of `exitContainers`
      // would be moot.
      // We can instead immediately `attempt` to parse one.
      if (!childFlow) {
        return documentContinued(code)
      }

      // If we have concrete content, such as block HTML or fenced code,
      // we can’t have containers “pierce” into them, so we can immediately
      // start.
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code)
      }

      // If we do have flow, it could still be a blank line,
      // but we’d be interrupting it w/ a new container if there’s a current
      // construct.
      // To do: next major: remove `_gfmTableDynamicInterruptHack` (no longer
      // needed in micromark-extension-gfm-table@1.0.6).
      self.interrupt = Boolean(
        childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack
      );
    }

    // Check if there is a new container.
    self.containerState = {};
    return effects.check(
      containerConstruct,
      thereIsANewContainer,
      thereIsNoNewContainer
    )(code)
  }

  /** @type {State} */
  function thereIsANewContainer(code) {
    if (childFlow) closeFlow();
    exitContainers(continued);
    return documentContinued(code)
  }

  /** @type {State} */
  function thereIsNoNewContainer(code) {
    self.parser.lazy[self.now().line] = continued !== stack.length;
    lineStartOffset = self.now().offset;
    return flowStart(code)
  }

  /** @type {State} */
  function documentContinued(code) {
    // Try new containers.
    self.containerState = {};
    return effects.attempt(
      containerConstruct,
      containerContinue,
      flowStart
    )(code)
  }

  /** @type {State} */
  function containerContinue(code) {
    continued++;
    stack.push([self.currentConstruct, self.containerState]);
    // Try another.
    return documentContinued(code)
  }

  /** @type {State} */
  function flowStart(code) {
    if (code === null) {
      if (childFlow) closeFlow();
      exitContainers(0);
      effects.consume(code);
      return
    }
    childFlow = childFlow || self.parser.flow(self.now());
    effects.enter('chunkFlow', {
      contentType: 'flow',
      previous: childToken,
      _tokenizer: childFlow
    });
    return flowContinue(code)
  }

  /** @type {State} */
  function flowContinue(code) {
    if (code === null) {
      writeToChild(effects.exit('chunkFlow'), true);
      exitContainers(0);
      effects.consume(code);
      return
    }
    if (markdownLineEnding(code)) {
      effects.consume(code);
      writeToChild(effects.exit('chunkFlow'));
      // Get ready for the next line.
      continued = 0;
      self.interrupt = undefined;
      return start
    }
    effects.consume(code);
    return flowContinue
  }

  /**
   * @param {Token} token
   * @param {boolean | undefined} [eof]
   * @returns {undefined}
   */
  function writeToChild(token, eof) {
    const stream = self.sliceStream(token);
    if (eof) stream.push(null);
    token.previous = childToken;
    if (childToken) childToken.next = token;
    childToken = token;
    childFlow.defineSkip(token.start);
    childFlow.write(stream);

    // Alright, so we just added a lazy line:
    //
    // ```markdown
    // > a
    // b.
    //
    // Or:
    //
    // > ~~~c
    // d
    //
    // Or:
    //
    // > | e |
    // f
    // ```
    //
    // The construct in the second example (fenced code) does not accept lazy
    // lines, so it marked itself as done at the end of its first line, and
    // then the content construct parses `d`.
    // Most constructs in markdown match on the first line: if the first line
    // forms a construct, a non-lazy line can’t “unmake” it.
    //
    // The construct in the third example is potentially a GFM table, and
    // those are *weird*.
    // It *could* be a table, from the first line, if the following line
    // matches a condition.
    // In this case, that second line is lazy, which “unmakes” the first line
    // and turns the whole into one content block.
    //
    // We’ve now parsed the non-lazy and the lazy line, and can figure out
    // whether the lazy line started a new flow block.
    // If it did, we exit the current containers between the two flow blocks.
    if (self.parser.lazy[token.start.line]) {
      let index = childFlow.events.length;
      while (index--) {
        if (
          // The token starts before the line ending…
          childFlow.events[index][1].start.offset < lineStartOffset &&
          // …and either is not ended yet…
          (!childFlow.events[index][1].end ||
            // …or ends after it.
            childFlow.events[index][1].end.offset > lineStartOffset)
        ) {
          // Exit: there’s still something open, which means it’s a lazy line
          // part of something.
          return
        }
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when closing flow in `documentContinue`.
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      /** @type {boolean | undefined} */
      let seen;
      /** @type {Point | undefined} */
      let point;

      // Find the previous chunk (the one before the lazy line).
      while (indexBeforeFlow--) {
        if (
          self.events[indexBeforeFlow][0] === 'exit' &&
          self.events[indexBeforeFlow][1].type === 'chunkFlow'
        ) {
          if (seen) {
            point = self.events[indexBeforeFlow][1].end;
            break
          }
          seen = true;
        }
      }
      exitContainers(continued);

      // Fix positions.
      index = indexBeforeExits;
      while (index < self.events.length) {
        self.events[index][1].end = Object.assign({}, point);
        index++;
      }

      // Inject the exits earlier (they’re still also at the end).
      splice(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      );

      // Discard the duplicate exits.
      self.events.length = index;
    }
  }

  /**
   * @param {number} size
   * @returns {undefined}
   */
  function exitContainers(size) {
    let index = stack.length;

    // Exit open containers.
    while (index-- > size) {
      const entry = stack[index];
      self.containerState = entry[1];
      entry[0].exit.call(self, effects);
    }
    stack.length = size;
  }
  function closeFlow() {
    childFlow.write([null]);
    childToken = undefined;
    childFlow = undefined;
    self.containerState._closeFlow = undefined;
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContainer(effects, ok, nok) {
  // Always populated by defaults.

  return factorySpace(
    effects,
    effects.attempt(this.parser.constructs.document, ok, nok),
    'linePrefix',
    this.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4
  )
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 */

/**
 * Classify whether a code represents whitespace, punctuation, or something
 * else.
 *
 * Used for attention (emphasis, strong), whose sequences can open or close
 * based on the class of surrounding characters.
 *
 * > 👉 **Note**: eof (`null`) is seen as whitespace.
 *
 * @param {Code} code
 *   Code.
 * @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
 *   Group.
 */
function classifyCharacter(code) {
  if (
    code === null ||
    markdownLineEndingOrSpace(code) ||
    unicodeWhitespace(code)
  ) {
    return 1
  }
  if (unicodePunctuation(code)) {
    return 2
  }
}

/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/**
 * Call all `resolveAll`s.
 *
 * @param {Array<{resolveAll?: Resolver | undefined}>} constructs
 *   List of constructs, optionally with `resolveAll`s.
 * @param {Array<Event>} events
 *   List of events.
 * @param {TokenizeContext} context
 *   Context used by `tokenize`.
 * @returns {Array<Event>}
 *   Changed events.
 */
function resolveAll(constructs, events, context) {
  /** @type {Array<Resolver>} */
  const called = [];
  let index = -1;

  while (++index < constructs.length) {
    const resolve = constructs[index].resolveAll;

    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context);
      called.push(resolve);
    }
  }

  return events
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const attention = {
  name: 'attention',
  tokenize: tokenizeAttention,
  resolveAll: resolveAllAttention
};

/**
 * Take all events and resolve attention to emphasis or strong.
 *
 * @type {Resolver}
 */
// eslint-disable-next-line complexity
function resolveAllAttention(events, context) {
  let index = -1;
  /** @type {number} */
  let open;
  /** @type {Token} */
  let group;
  /** @type {Token} */
  let text;
  /** @type {Token} */
  let openingSequence;
  /** @type {Token} */
  let closingSequence;
  /** @type {number} */
  let use;
  /** @type {Array<Event>} */
  let nextEvents;
  /** @type {number} */
  let offset;

  // Walk through all events.
  //
  // Note: performance of this is fine on an mb of normal markdown, but it’s
  // a bottleneck for malicious stuff.
  while (++index < events.length) {
    // Find a token that can close.
    if (
      events[index][0] === 'enter' &&
      events[index][1].type === 'attentionSequence' &&
      events[index][1]._close
    ) {
      open = index;

      // Now walk back to find an opener.
      while (open--) {
        // Find a token that can open the closer.
        if (
          events[open][0] === 'exit' &&
          events[open][1].type === 'attentionSequence' &&
          events[open][1]._open &&
          // If the markers are the same:
          context.sliceSerialize(events[open][1]).charCodeAt(0) ===
            context.sliceSerialize(events[index][1]).charCodeAt(0)
        ) {
          // If the opening can close or the closing can open,
          // and the close size *is not* a multiple of three,
          // but the sum of the opening and closing size *is* multiple of three,
          // then don’t match.
          if (
            (events[open][1]._close || events[index][1]._open) &&
            (events[index][1].end.offset - events[index][1].start.offset) % 3 &&
            !(
              (events[open][1].end.offset -
                events[open][1].start.offset +
                events[index][1].end.offset -
                events[index][1].start.offset) %
              3
            )
          ) {
            continue
          }

          // Number of markers to use from the sequence.
          use =
            events[open][1].end.offset - events[open][1].start.offset > 1 &&
            events[index][1].end.offset - events[index][1].start.offset > 1
              ? 2
              : 1;
          const start = Object.assign({}, events[open][1].end);
          const end = Object.assign({}, events[index][1].start);
          movePoint(start, -use);
          movePoint(end, use);
          openingSequence = {
            type: use > 1 ? 'strongSequence' : 'emphasisSequence',
            start,
            end: Object.assign({}, events[open][1].end)
          };
          closingSequence = {
            type: use > 1 ? 'strongSequence' : 'emphasisSequence',
            start: Object.assign({}, events[index][1].start),
            end
          };
          text = {
            type: use > 1 ? 'strongText' : 'emphasisText',
            start: Object.assign({}, events[open][1].end),
            end: Object.assign({}, events[index][1].start)
          };
          group = {
            type: use > 1 ? 'strong' : 'emphasis',
            start: Object.assign({}, openingSequence.start),
            end: Object.assign({}, closingSequence.end)
          };
          events[open][1].end = Object.assign({}, openingSequence.start);
          events[index][1].start = Object.assign({}, closingSequence.end);
          nextEvents = [];

          // If there are more markers in the opening, add them before.
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = push(nextEvents, [
              ['enter', events[open][1], context],
              ['exit', events[open][1], context]
            ]);
          }

          // Opening.
          nextEvents = push(nextEvents, [
            ['enter', group, context],
            ['enter', openingSequence, context],
            ['exit', openingSequence, context],
            ['enter', text, context]
          ]);

          // Always populated by defaults.

          // Between.
          nextEvents = push(
            nextEvents,
            resolveAll(
              context.parser.constructs.insideSpan.null,
              events.slice(open + 1, index),
              context
            )
          );

          // Closing.
          nextEvents = push(nextEvents, [
            ['exit', text, context],
            ['enter', closingSequence, context],
            ['exit', closingSequence, context],
            ['exit', group, context]
          ]);

          // If there are more markers in the closing, add them after.
          if (events[index][1].end.offset - events[index][1].start.offset) {
            offset = 2;
            nextEvents = push(nextEvents, [
              ['enter', events[index][1], context],
              ['exit', events[index][1], context]
            ]);
          } else {
            offset = 0;
          }
          splice(events, open - 1, index - open + 3, nextEvents);
          index = open + nextEvents.length - offset - 2;
          break
        }
      }
    }
  }

  // Remove remaining sequences.
  index = -1;
  while (++index < events.length) {
    if (events[index][1].type === 'attentionSequence') {
      events[index][1].type = 'data';
    }
  }
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeAttention(effects, ok) {
  const attentionMarkers = this.parser.constructs.attentionMarkers.null;
  const previous = this.previous;
  const before = classifyCharacter(previous);

  /** @type {NonNullable<Code>} */
  let marker;
  return start

  /**
   * Before a sequence.
   *
   * ```markdown
   * > | **
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    marker = code;
    effects.enter('attentionSequence');
    return inside(code)
  }

  /**
   * In a sequence.
   *
   * ```markdown
   * > | **
   *     ^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside
    }
    const token = effects.exit('attentionSequence');

    // To do: next major: move this to resolver, just like `markdown-rs`.
    const after = classifyCharacter(code);

    // Always populated by defaults.

    const open =
      !after || (after === 2 && before) || attentionMarkers.includes(code);
    const close =
      !before || (before === 2 && after) || attentionMarkers.includes(previous);
    token._open = Boolean(marker === 42 ? open : open && (before || !close));
    token._close = Boolean(marker === 42 ? close : close && (after || !open));
    return ok(code)
  }
}

/**
 * Move a point a bit.
 *
 * Note: `move` only works inside lines! It’s not possible to move past other
 * chunks (replacement characters, tabs, or line endings).
 *
 * @param {Point} point
 * @param {number} offset
 * @returns {undefined}
 */
function movePoint(point, offset) {
  point.column += offset;
  point.offset += offset;
  point._bufferIndex += offset;
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const autolink = {
  name: 'autolink',
  tokenize: tokenizeAutolink
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeAutolink(effects, ok, nok) {
  let size = 0;
  return start

  /**
   * Start of an autolink.
   *
   * ```markdown
   * > | a<https://example.com>b
   *      ^
   * > | a<user@example.com>b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('autolink');
    effects.enter('autolinkMarker');
    effects.consume(code);
    effects.exit('autolinkMarker');
    effects.enter('autolinkProtocol');
    return open
  }

  /**
   * After `<`, at protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *       ^
   * > | a<user@example.com>b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      return schemeOrEmailAtext
    }
    return emailAtext(code)
  }

  /**
   * At second byte of protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeOrEmailAtext(code) {
    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) {
      // Count the previous alphabetical from `open` too.
      size = 1;
      return schemeInsideOrEmailAtext(code)
    }
    return emailAtext(code)
  }

  /**
   * In ambiguous protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeInsideOrEmailAtext(code) {
    if (code === 58) {
      effects.consume(code);
      size = 0;
      return urlInside
    }

    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (
      (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) &&
      size++ < 32
    ) {
      effects.consume(code);
      return schemeInsideOrEmailAtext
    }
    size = 0;
    return emailAtext(code)
  }

  /**
   * After protocol, in URL.
   *
   * ```markdown
   * > | a<https://example.com>b
   *             ^
   * ```
   *
   * @type {State}
   */
  function urlInside(code) {
    if (code === 62) {
      effects.exit('autolinkProtocol');
      effects.enter('autolinkMarker');
      effects.consume(code);
      effects.exit('autolinkMarker');
      effects.exit('autolink');
      return ok
    }

    // ASCII control, space, or `<`.
    if (code === null || code === 32 || code === 60 || asciiControl(code)) {
      return nok(code)
    }
    effects.consume(code);
    return urlInside
  }

  /**
   * In email atext.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *              ^
   * ```
   *
   * @type {State}
   */
  function emailAtext(code) {
    if (code === 64) {
      effects.consume(code);
      return emailAtSignOrDot
    }
    if (asciiAtext(code)) {
      effects.consume(code);
      return emailAtext
    }
    return nok(code)
  }

  /**
   * In label, after at-sign or dot.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                 ^       ^
   * ```
   *
   * @type {State}
   */
  function emailAtSignOrDot(code) {
    return asciiAlphanumeric(code) ? emailLabel(code) : nok(code)
  }

  /**
   * In label, where `.` and `>` are allowed.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                   ^
   * ```
   *
   * @type {State}
   */
  function emailLabel(code) {
    if (code === 46) {
      effects.consume(code);
      size = 0;
      return emailAtSignOrDot
    }
    if (code === 62) {
      // Exit, then change the token type.
      effects.exit('autolinkProtocol').type = 'autolinkEmail';
      effects.enter('autolinkMarker');
      effects.consume(code);
      effects.exit('autolinkMarker');
      effects.exit('autolink');
      return ok
    }
    return emailValue(code)
  }

  /**
   * In label, where `.` and `>` are *not* allowed.
   *
   * Though, this is also used in `emailLabel` to parse other values.
   *
   * ```markdown
   * > | a<user.name@ex-ample.com>b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function emailValue(code) {
    // ASCII alphanumeric or `-`.
    if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
      const next = code === 45 ? emailValue : emailLabel;
      effects.consume(code);
      return next
    }
    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const blankLine = {
  tokenize: tokenizeBlankLine,
  partial: true
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlankLine(effects, ok, nok) {
  return start

  /**
   * Start of blank line.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *     ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    return markdownSpace(code)
      ? factorySpace(effects, after, 'linePrefix')(code)
      : after(code)
  }

  /**
   * At eof/eol, after optional whitespace.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *       ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const blockQuote = {
  name: 'blockQuote',
  tokenize: tokenizeBlockQuoteStart,
  continuation: {
    tokenize: tokenizeBlockQuoteContinuation
  },
  exit
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteStart(effects, ok, nok) {
  const self = this;
  return start

  /**
   * Start of block quote.
   *
   * ```markdown
   * > | > a
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 62) {
      const state = self.containerState;
      if (!state.open) {
        effects.enter('blockQuote', {
          _container: true
        });
        state.open = true;
      }
      effects.enter('blockQuotePrefix');
      effects.enter('blockQuoteMarker');
      effects.consume(code);
      effects.exit('blockQuoteMarker');
      return after
    }
    return nok(code)
  }

  /**
   * After `>`, before optional whitespace.
   *
   * ```markdown
   * > | > a
   *      ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (markdownSpace(code)) {
      effects.enter('blockQuotePrefixWhitespace');
      effects.consume(code);
      effects.exit('blockQuotePrefixWhitespace');
      effects.exit('blockQuotePrefix');
      return ok
    }
    effects.exit('blockQuotePrefix');
    return ok(code)
  }
}

/**
 * Start of block quote continuation.
 *
 * ```markdown
 *   | > a
 * > | > b
 *     ^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteContinuation(effects, ok, nok) {
  const self = this;
  return contStart

  /**
   * Start of block quote continuation.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contStart(code) {
    if (markdownSpace(code)) {
      // Always populated by defaults.

      return factorySpace(
        effects,
        contBefore,
        'linePrefix',
        self.parser.constructs.disable.null.includes('codeIndented')
          ? undefined
          : 4
      )(code)
    }
    return contBefore(code)
  }

  /**
   * At `>`, after optional whitespace.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contBefore(code) {
    return effects.attempt(blockQuote, ok, nok)(code)
  }
}

/** @type {Exiter} */
function exit(effects) {
  effects.exit('blockQuote');
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const characterEscape = {
  name: 'characterEscape',
  tokenize: tokenizeCharacterEscape
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCharacterEscape(effects, ok, nok) {
  return start

  /**
   * Start of character escape.
   *
   * ```markdown
   * > | a\*b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('characterEscape');
    effects.enter('escapeMarker');
    effects.consume(code);
    effects.exit('escapeMarker');
    return inside
  }

  /**
   * After `\`, at punctuation.
   *
   * ```markdown
   * > | a\*b
   *       ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    // ASCII punctuation.
    if (asciiPunctuation(code)) {
      effects.enter('characterEscapeValue');
      effects.consume(code);
      effects.exit('characterEscapeValue');
      effects.exit('characterEscape');
      return ok
    }
    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const characterReference = {
  name: 'characterReference',
  tokenize: tokenizeCharacterReference
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCharacterReference(effects, ok, nok) {
  const self = this;
  let size = 0;
  /** @type {number} */
  let max;
  /** @type {(code: Code) => boolean} */
  let test;
  return start

  /**
   * Start of character reference.
   *
   * ```markdown
   * > | a&amp;b
   *      ^
   * > | a&#123;b
   *      ^
   * > | a&#x9;b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('characterReference');
    effects.enter('characterReferenceMarker');
    effects.consume(code);
    effects.exit('characterReferenceMarker');
    return open
  }

  /**
   * After `&`, at `#` for numeric references or alphanumeric for named
   * references.
   *
   * ```markdown
   * > | a&amp;b
   *       ^
   * > | a&#123;b
   *       ^
   * > | a&#x9;b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 35) {
      effects.enter('characterReferenceMarkerNumeric');
      effects.consume(code);
      effects.exit('characterReferenceMarkerNumeric');
      return numeric
    }
    effects.enter('characterReferenceValue');
    max = 31;
    test = asciiAlphanumeric;
    return value(code)
  }

  /**
   * After `#`, at `x` for hexadecimals or digit for decimals.
   *
   * ```markdown
   * > | a&#123;b
   *        ^
   * > | a&#x9;b
   *        ^
   * ```
   *
   * @type {State}
   */
  function numeric(code) {
    if (code === 88 || code === 120) {
      effects.enter('characterReferenceMarkerHexadecimal');
      effects.consume(code);
      effects.exit('characterReferenceMarkerHexadecimal');
      effects.enter('characterReferenceValue');
      max = 6;
      test = asciiHexDigit;
      return value
    }
    effects.enter('characterReferenceValue');
    max = 7;
    test = asciiDigit;
    return value(code)
  }

  /**
   * After markers (`&#x`, `&#`, or `&`), in value, before `;`.
   *
   * The character reference kind defines what and how many characters are
   * allowed.
   *
   * ```markdown
   * > | a&amp;b
   *       ^^^
   * > | a&#123;b
   *        ^^^
   * > | a&#x9;b
   *         ^
   * ```
   *
   * @type {State}
   */
  function value(code) {
    if (code === 59 && size) {
      const token = effects.exit('characterReferenceValue');
      if (
        test === asciiAlphanumeric &&
        !decodeNamedCharacterReference(self.sliceSerialize(token))
      ) {
        return nok(code)
      }

      // To do: `markdown-rs` uses a different name:
      // `CharacterReferenceMarkerSemi`.
      effects.enter('characterReferenceMarker');
      effects.consume(code);
      effects.exit('characterReferenceMarker');
      effects.exit('characterReference');
      return ok
    }
    if (test(code) && size++ < max) {
      effects.consume(code);
      return value
    }
    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const nonLazyContinuation = {
  tokenize: tokenizeNonLazyContinuation,
  partial: true
};

/** @type {Construct} */
const codeFenced = {
  name: 'codeFenced',
  tokenize: tokenizeCodeFenced,
  concrete: true
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeFenced(effects, ok, nok) {
  const self = this;
  /** @type {Construct} */
  const closeStart = {
    tokenize: tokenizeCloseStart,
    partial: true
  };
  let initialPrefix = 0;
  let sizeOpen = 0;
  /** @type {NonNullable<Code>} */
  let marker;
  return start

  /**
   * Start of code.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse whitespace like `markdown-rs`.
    return beforeSequenceOpen(code)
  }

  /**
   * In opening fence, after prefix, at sequence.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeSequenceOpen(code) {
    const tail = self.events[self.events.length - 1];
    initialPrefix =
      tail && tail[1].type === 'linePrefix'
        ? tail[2].sliceSerialize(tail[1], true).length
        : 0;
    marker = code;
    effects.enter('codeFenced');
    effects.enter('codeFencedFence');
    effects.enter('codeFencedFenceSequence');
    return sequenceOpen(code)
  }

  /**
   * In opening fence sequence.
   *
   * ```markdown
   * > | ~~~js
   *      ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === marker) {
      sizeOpen++;
      effects.consume(code);
      return sequenceOpen
    }
    if (sizeOpen < 3) {
      return nok(code)
    }
    effects.exit('codeFencedFenceSequence');
    return markdownSpace(code)
      ? factorySpace(effects, infoBefore, 'whitespace')(code)
      : infoBefore(code)
  }

  /**
   * In opening fence, after the sequence (and optional whitespace), before info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function infoBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('codeFencedFence');
      return self.interrupt
        ? ok(code)
        : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
    }
    effects.enter('codeFencedFenceInfo');
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return info(code)
  }

  /**
   * In info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function info(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('chunkString');
      effects.exit('codeFencedFenceInfo');
      return infoBefore(code)
    }
    if (markdownSpace(code)) {
      effects.exit('chunkString');
      effects.exit('codeFencedFenceInfo');
      return factorySpace(effects, metaBefore, 'whitespace')(code)
    }
    if (code === 96 && code === marker) {
      return nok(code)
    }
    effects.consume(code);
    return info
  }

  /**
   * In opening fence, after info and whitespace, before meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function metaBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      return infoBefore(code)
    }
    effects.enter('codeFencedFenceMeta');
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return meta(code)
  }

  /**
   * In meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function meta(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('chunkString');
      effects.exit('codeFencedFenceMeta');
      return infoBefore(code)
    }
    if (code === 96 && code === marker) {
      return nok(code)
    }
    effects.consume(code);
    return meta
  }

  /**
   * At eol/eof in code, before a non-lazy closing fence or content.
   *
   * ```markdown
   * > | ~~~js
   *          ^
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function atNonLazyBreak(code) {
    return effects.attempt(closeStart, after, contentBefore)(code)
  }

  /**
   * Before code content, not a closing fence, at eol.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentBefore(code) {
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return contentStart
  }

  /**
   * Before code content, not a closing fence.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentStart(code) {
    return initialPrefix > 0 && markdownSpace(code)
      ? factorySpace(
          effects,
          beforeContentChunk,
          'linePrefix',
          initialPrefix + 1
        )(code)
      : beforeContentChunk(code)
  }

  /**
   * Before code content, after optional prefix.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeContentChunk(code) {
    if (code === null || markdownLineEnding(code)) {
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
    }
    effects.enter('codeFlowValue');
    return contentChunk(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^^^^^^^^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentChunk(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('codeFlowValue');
      return beforeContentChunk(code)
    }
    effects.consume(code);
    return contentChunk
  }

  /**
   * After code.
   *
   * ```markdown
   *   | ~~~js
   *   | alert(1)
   * > | ~~~
   *        ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    effects.exit('codeFenced');
    return ok(code)
  }

  /**
   * @this {TokenizeContext}
   * @type {Tokenizer}
   */
  function tokenizeCloseStart(effects, ok, nok) {
    let size = 0;
    return startBefore

    /**
     *
     *
     * @type {State}
     */
    function startBefore(code) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return start
    }

    /**
     * Before closing fence, at optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function start(code) {
      // Always populated by defaults.

      // To do: `enter` here or in next state?
      effects.enter('codeFencedFence');
      return markdownSpace(code)
        ? factorySpace(
            effects,
            beforeSequenceClose,
            'linePrefix',
            self.parser.constructs.disable.null.includes('codeIndented')
              ? undefined
              : 4
          )(code)
        : beforeSequenceClose(code)
    }

    /**
     * In closing fence, after optional whitespace, at sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function beforeSequenceClose(code) {
      if (code === marker) {
        effects.enter('codeFencedFenceSequence');
        return sequenceClose(code)
      }
      return nok(code)
    }

    /**
     * In closing fence sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function sequenceClose(code) {
      if (code === marker) {
        size++;
        effects.consume(code);
        return sequenceClose
      }
      if (size >= sizeOpen) {
        effects.exit('codeFencedFenceSequence');
        return markdownSpace(code)
          ? factorySpace(effects, sequenceCloseAfter, 'whitespace')(code)
          : sequenceCloseAfter(code)
      }
      return nok(code)
    }

    /**
     * After closing fence sequence, after optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *        ^
     * ```
     *
     * @type {State}
     */
    function sequenceCloseAfter(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit('codeFencedFence');
        return ok(code)
      }
      return nok(code)
    }
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuation(effects, ok, nok) {
  const self = this;
  return start

  /**
   *
   *
   * @type {State}
   */
  function start(code) {
    if (code === null) {
      return nok(code)
    }
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return lineStart
  }

  /**
   *
   *
   * @type {State}
   */
  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const codeIndented = {
  name: 'codeIndented',
  tokenize: tokenizeCodeIndented
};

/** @type {Construct} */
const furtherStart = {
  tokenize: tokenizeFurtherStart,
  partial: true
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeIndented(effects, ok, nok) {
  const self = this;
  return start

  /**
   * Start of code (indented).
   *
   * > **Parsing note**: it is not needed to check if this first line is a
   * > filled line (that it has a non-whitespace character), because blank lines
   * > are parsed already, so we never run into that.
   *
   * ```markdown
   * > |     aaa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: manually check if interrupting like `markdown-rs`.

    effects.enter('codeIndented');
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1)(code)
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === 'linePrefix' &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
      ? atBreak(code)
      : nok(code)
  }

  /**
   * At a break.
   *
   * ```markdown
   * > |     aaa
   *         ^  ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === null) {
      return after(code)
    }
    if (markdownLineEnding(code)) {
      return effects.attempt(furtherStart, atBreak, after)(code)
    }
    effects.enter('codeFlowValue');
    return inside(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   * > |     aaa
   *         ^^^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('codeFlowValue');
      return atBreak(code)
    }
    effects.consume(code);
    return inside
  }

  /** @type {State} */
  function after(code) {
    effects.exit('codeIndented');
    // To do: allow interrupting like `markdown-rs`.
    // Feel free to interrupt.
    // tokenizer.interrupt = false
    return ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeFurtherStart(effects, ok, nok) {
  const self = this;
  return furtherStart

  /**
   * At eol, trying to parse another indent.
   *
   * ```markdown
   * > |     aaa
   *            ^
   *   |     bbb
   * ```
   *
   * @type {State}
   */
  function furtherStart(code) {
    // To do: improve `lazy` / `pierce` handling.
    // If this is a lazy line, it can’t be code.
    if (self.parser.lazy[self.now().line]) {
      return nok(code)
    }
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return furtherStart
    }

    // To do: the code here in `micromark-js` is a bit different from
    // `markdown-rs` because there it can attempt spaces.
    // We can’t yet.
    //
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1)(code)
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === 'linePrefix' &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
      ? ok(code)
      : markdownLineEnding(code)
      ? furtherStart(code)
      : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Previous} Previous
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const codeText = {
  name: 'codeText',
  tokenize: tokenizeCodeText,
  resolve: resolveCodeText,
  previous
};

// To do: next major: don’t resolve, like `markdown-rs`.
/** @type {Resolver} */
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  /** @type {number} */
  let index;
  /** @type {number | undefined} */
  let enter;

  // If we start and end with an EOL or a space.
  if (
    (events[headEnterIndex][1].type === 'lineEnding' ||
      events[headEnterIndex][1].type === 'space') &&
    (events[tailExitIndex][1].type === 'lineEnding' ||
      events[tailExitIndex][1].type === 'space')
  ) {
    index = headEnterIndex;

    // And we have data.
    while (++index < tailExitIndex) {
      if (events[index][1].type === 'codeTextData') {
        // Then we have padding.
        events[headEnterIndex][1].type = 'codeTextPadding';
        events[tailExitIndex][1].type = 'codeTextPadding';
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break
      }
    }
  }

  // Merge adjacent spaces and data.
  index = headEnterIndex - 1;
  tailExitIndex++;
  while (++index <= tailExitIndex) {
    if (enter === undefined) {
      if (index !== tailExitIndex && events[index][1].type !== 'lineEnding') {
        enter = index;
      }
    } else if (
      index === tailExitIndex ||
      events[index][1].type === 'lineEnding'
    ) {
      events[enter][1].type = 'codeTextData';
      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end;
        events.splice(enter + 2, index - enter - 2);
        tailExitIndex -= index - enter - 2;
        index = enter + 2;
      }
      enter = undefined;
    }
  }
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Previous}
 */
function previous(code) {
  // If there is a previous code, there will always be a tail.
  return (
    code !== 96 ||
    this.events[this.events.length - 1][1].type === 'characterEscape'
  )
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeText(effects, ok, nok) {
  let sizeOpen = 0;
  /** @type {number} */
  let size;
  /** @type {Token} */
  let token;
  return start

  /**
   * Start of code (text).
   *
   * ```markdown
   * > | `a`
   *     ^
   * > | \`a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('codeText');
    effects.enter('codeTextSequence');
    return sequenceOpen(code)
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | `a`
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 96) {
      effects.consume(code);
      sizeOpen++;
      return sequenceOpen
    }
    effects.exit('codeTextSequence');
    return between(code)
  }

  /**
   * Between something and something else.
   *
   * ```markdown
   * > | `a`
   *      ^^
   * ```
   *
   * @type {State}
   */
  function between(code) {
    // EOF.
    if (code === null) {
      return nok(code)
    }

    // To do: next major: don’t do spaces in resolve, but when compiling,
    // like `markdown-rs`.
    // Tabs don’t work, and virtual spaces don’t make sense.
    if (code === 32) {
      effects.enter('space');
      effects.consume(code);
      effects.exit('space');
      return between
    }

    // Closing fence? Could also be data.
    if (code === 96) {
      token = effects.enter('codeTextSequence');
      size = 0;
      return sequenceClose(code)
    }
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return between
    }

    // Data.
    effects.enter('codeTextData');
    return data(code)
  }

  /**
   * In data.
   *
   * ```markdown
   * > | `a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (
      code === null ||
      code === 32 ||
      code === 96 ||
      markdownLineEnding(code)
    ) {
      effects.exit('codeTextData');
      return between(code)
    }
    effects.consume(code);
    return data
  }

  /**
   * In closing sequence.
   *
   * ```markdown
   * > | `a`
   *       ^
   * ```
   *
   * @type {State}
   */
  function sequenceClose(code) {
    // More.
    if (code === 96) {
      effects.consume(code);
      size++;
      return sequenceClose
    }

    // Done!
    if (size === sizeOpen) {
      effects.exit('codeTextSequence');
      effects.exit('codeText');
      return ok(code)
    }

    // More or less accents: mark as data.
    token.type = 'codeTextData';
    return data(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Token} Token
 */

/**
 * Tokenize subcontent.
 *
 * @param {Array<Event>} events
 *   List of events.
 * @returns {boolean}
 *   Whether subtokens were found.
 */ // eslint-disable-next-line complexity
function subtokenize(events) {
  /** @type {Record<string, number>} */
  const jumps = {};
  let index = -1;
  /** @type {Event} */
  let event;
  /** @type {number | undefined} */
  let lineIndex;
  /** @type {number} */
  let otherIndex;
  /** @type {Event} */
  let otherEvent;
  /** @type {Array<Event>} */
  let parameters;
  /** @type {Array<Event>} */
  let subevents;
  /** @type {boolean | undefined} */
  let more;
  while (++index < events.length) {
    while (index in jumps) {
      index = jumps[index];
    }
    event = events[index];

    // Add a hook for the GFM tasklist extension, which needs to know if text
    // is in the first content of a list item.
    if (
      index &&
      event[1].type === 'chunkFlow' &&
      events[index - 1][1].type === 'listItemPrefix'
    ) {
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;
      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === 'lineEndingBlank'
      ) {
        otherIndex += 2;
      }
      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === 'content'
      ) {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === 'content') {
            break
          }
          if (subevents[otherIndex][1].type === 'chunkText') {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
      }
    }

    // Enter.
    if (event[0] === 'enter') {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index));
        index = jumps[index];
        more = true;
      }
    }
    // Exit.
    else if (event[1]._container) {
      otherIndex = index;
      lineIndex = undefined;
      while (otherIndex--) {
        otherEvent = events[otherIndex];
        if (
          otherEvent[1].type === 'lineEnding' ||
          otherEvent[1].type === 'lineEndingBlank'
        ) {
          if (otherEvent[0] === 'enter') {
            if (lineIndex) {
              events[lineIndex][1].type = 'lineEndingBlank';
            }
            otherEvent[1].type = 'lineEnding';
            lineIndex = otherIndex;
          }
        } else {
          break
        }
      }
      if (lineIndex) {
        // Fix position.
        event[1].end = Object.assign({}, events[lineIndex][1].start);

        // Switch container exit w/ line endings.
        parameters = events.slice(lineIndex, index);
        parameters.unshift(event);
        splice(events, lineIndex, index - lineIndex + 1, parameters);
      }
    }
  }
  return !more
}

/**
 * Tokenize embedded tokens.
 *
 * @param {Array<Event>} events
 * @param {number} eventIndex
 * @returns {Record<string, number>}
 */
function subcontent(events, eventIndex) {
  const token = events[eventIndex][1];
  const context = events[eventIndex][2];
  let startPosition = eventIndex - 1;
  /** @type {Array<number>} */
  const startPositions = [];
  const tokenizer =
    token._tokenizer || context.parser[token.contentType](token.start);
  const childEvents = tokenizer.events;
  /** @type {Array<[number, number]>} */
  const jumps = [];
  /** @type {Record<string, number>} */
  const gaps = {};
  /** @type {Array<Chunk>} */
  let stream;
  /** @type {Token | undefined} */
  let previous;
  let index = -1;
  /** @type {Token | undefined} */
  let current = token;
  let adjust = 0;
  let start = 0;
  const breaks = [start];

  // Loop forward through the linked tokens to pass them in order to the
  // subtokenizer.
  while (current) {
    // Find the position of the event for this token.
    while (events[++startPosition][1] !== current) {
      // Empty.
    }
    startPositions.push(startPosition);
    if (!current._tokenizer) {
      stream = context.sliceStream(current);
      if (!current.next) {
        stream.push(null);
      }
      if (previous) {
        tokenizer.defineSkip(current.start);
      }
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true;
      }
      tokenizer.write(stream);
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = undefined;
      }
    }

    // Unravel the next token.
    previous = current;
    current = current.next;
  }

  // Now, loop back through all events (and linked tokens), to figure out which
  // parts belong where.
  current = token;
  while (++index < childEvents.length) {
    if (
      // Find a void token that includes a break.
      childEvents[index][0] === 'exit' &&
      childEvents[index - 1][0] === 'enter' &&
      childEvents[index][1].type === childEvents[index - 1][1].type &&
      childEvents[index][1].start.line !== childEvents[index][1].end.line
    ) {
      start = index + 1;
      breaks.push(start);
      // Help GC.
      current._tokenizer = undefined;
      current.previous = undefined;
      current = current.next;
    }
  }

  // Help GC.
  tokenizer.events = [];

  // If there’s one more token (which is the cases for lines that end in an
  // EOF), that’s perfect: the last point we found starts it.
  // If there isn’t then make sure any remaining content is added to it.
  if (current) {
    // Help GC.
    current._tokenizer = undefined;
    current.previous = undefined;
  } else {
    breaks.pop();
  }

  // Now splice the events from the subtokenizer into the current events,
  // moving back to front so that splice indices aren’t affected.
  index = breaks.length;
  while (index--) {
    const slice = childEvents.slice(breaks[index], breaks[index + 1]);
    const start = startPositions.pop();
    jumps.unshift([start, start + slice.length - 1]);
    splice(events, start, 2, slice);
  }
  index = -1;
  while (++index < jumps.length) {
    gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
    adjust += jumps[index][1] - jumps[index][0] - 1;
  }
  return gaps
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/**
 * No name because it must not be turned off.
 * @type {Construct}
 */
const content = {
  tokenize: tokenizeContent,
  resolve: resolveContent
};

/** @type {Construct} */
const continuationConstruct = {
  tokenize: tokenizeContinuation,
  partial: true
};

/**
 * Content is transparent: it’s parsed right now. That way, definitions are also
 * parsed right now: before text in paragraphs (specifically, media) are parsed.
 *
 * @type {Resolver}
 */
function resolveContent(events) {
  subtokenize(events);
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContent(effects, ok) {
  /** @type {Token | undefined} */
  let previous;
  return chunkStart

  /**
   * Before a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^
   * ```
   *
   * @type {State}
   */
  function chunkStart(code) {
    effects.enter('content');
    previous = effects.enter('chunkContent', {
      contentType: 'content'
    });
    return chunkInside(code)
  }

  /**
   * In a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^^^
   * ```
   *
   * @type {State}
   */
  function chunkInside(code) {
    if (code === null) {
      return contentEnd(code)
    }

    // To do: in `markdown-rs`, each line is parsed on its own, and everything
    // is stitched together resolving.
    if (markdownLineEnding(code)) {
      return effects.check(
        continuationConstruct,
        contentContinue,
        contentEnd
      )(code)
    }

    // Data.
    effects.consume(code);
    return chunkInside
  }

  /**
   *
   *
   * @type {State}
   */
  function contentEnd(code) {
    effects.exit('chunkContent');
    effects.exit('content');
    return ok(code)
  }

  /**
   *
   *
   * @type {State}
   */
  function contentContinue(code) {
    effects.consume(code);
    effects.exit('chunkContent');
    previous.next = effects.enter('chunkContent', {
      contentType: 'content',
      previous
    });
    previous = previous.next;
    return chunkInside
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContinuation(effects, ok, nok) {
  const self = this;
  return startLookahead

  /**
   *
   *
   * @type {State}
   */
  function startLookahead(code) {
    effects.exit('chunkContent');
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return factorySpace(effects, prefixed, 'linePrefix')
  }

  /**
   *
   *
   * @type {State}
   */
  function prefixed(code) {
    if (code === null || markdownLineEnding(code)) {
      return nok(code)
    }

    // Always populated by defaults.

    const tail = self.events[self.events.length - 1];
    if (
      !self.parser.constructs.disable.null.includes('codeIndented') &&
      tail &&
      tail[1].type === 'linePrefix' &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
    ) {
      return ok(code)
    }
    return effects.interrupt(self.parser.constructs.flow, nok, ok)(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */

/**
 * Parse destinations.
 *
 * ###### Examples
 *
 * ```markdown
 * <a>
 * <a\>b>
 * <a b>
 * <a)>
 * a
 * a\)b
 * a(b)c
 * a(b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type for whole (`<a>` or `b`).
 * @param {TokenType} literalType
 *   Type when enclosed (`<a>`).
 * @param {TokenType} literalMarkerType
 *   Type for enclosing (`<` and `>`).
 * @param {TokenType} rawType
 *   Type when not enclosed (`b`).
 * @param {TokenType} stringType
 *   Type for the value (`a` or `b`).
 * @param {number | undefined} [max=Infinity]
 *   Depth of nested parens (inclusive).
 * @returns {State}
 *   Start state.
 */ // eslint-disable-next-line max-params
function factoryDestination(
  effects,
  ok,
  nok,
  type,
  literalType,
  literalMarkerType,
  rawType,
  stringType,
  max
) {
  const limit = max || Number.POSITIVE_INFINITY;
  let balance = 0;
  return start

  /**
   * Start of destination.
   *
   * ```markdown
   * > | <aa>
   *     ^
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 60) {
      effects.enter(type);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      return enclosedBefore
    }

    // ASCII control, space, closing paren.
    if (code === null || code === 32 || code === 41 || asciiControl(code)) {
      return nok(code)
    }
    effects.enter(type);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return raw(code)
  }

  /**
   * After `<`, at an enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosedBefore(code) {
    if (code === 62) {
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type);
      return ok
    }
    effects.enter(stringType);
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return enclosed(code)
  }

  /**
   * In enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosed(code) {
    if (code === 62) {
      effects.exit('chunkString');
      effects.exit(stringType);
      return enclosedBefore(code)
    }
    if (code === null || code === 60 || markdownLineEnding(code)) {
      return nok(code)
    }
    effects.consume(code);
    return code === 92 ? enclosedEscape : enclosed
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | <a\*a>
   *        ^
   * ```
   *
   * @type {State}
   */
  function enclosedEscape(code) {
    if (code === 60 || code === 62 || code === 92) {
      effects.consume(code);
      return enclosed
    }
    return enclosed(code)
  }

  /**
   * In raw destination.
   *
   * ```markdown
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function raw(code) {
    if (
      !balance &&
      (code === null || code === 41 || markdownLineEndingOrSpace(code))
    ) {
      effects.exit('chunkString');
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type);
      return ok(code)
    }
    if (balance < limit && code === 40) {
      effects.consume(code);
      balance++;
      return raw
    }
    if (code === 41) {
      effects.consume(code);
      balance--;
      return raw
    }

    // ASCII control (but *not* `\0`) and space and `(`.
    // Note: in `markdown-rs`, `\0` exists in codes, in `micromark-js` it
    // doesn’t.
    if (code === null || code === 32 || code === 40 || asciiControl(code)) {
      return nok(code)
    }
    effects.consume(code);
    return code === 92 ? rawEscape : raw
  }

  /**
   * After `\`, at special character.
   *
   * ```markdown
   * > | a\*a
   *       ^
   * ```
   *
   * @type {State}
   */
  function rawEscape(code) {
    if (code === 40 || code === 41 || code === 92) {
      effects.consume(code);
      return raw
    }
    return raw(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */

/**
 * Parse labels.
 *
 * > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
 *
 * ###### Examples
 *
 * ```markdown
 * [a]
 * [a
 * b]
 * [a\]b]
 * ```
 *
 * @this {TokenizeContext}
 *   Tokenize context.
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole label (`[a]`).
 * @param {TokenType} markerType
 *   Type for the markers (`[` and `]`).
 * @param {TokenType} stringType
 *   Type for the identifier (`a`).
 * @returns {State}
 *   Start state.
 */ // eslint-disable-next-line max-params
function factoryLabel(effects, ok, nok, type, markerType, stringType) {
  const self = this;
  let size = 0;
  /** @type {boolean} */
  let seen;
  return start

  /**
   * Start of label.
   *
   * ```markdown
   * > | [a]
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak
  }

  /**
   * In label, at something, before something else.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (
      size > 999 ||
      code === null ||
      code === 91 ||
      (code === 93 && !seen) ||
      // To do: remove in the future once we’ve switched from
      // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
      // which doesn’t need this.
      // Hidden footnotes hook.
      /* c8 ignore next 3 */
      (code === 94 &&
        !size &&
        '_hiddenFootnoteSupport' in self.parser.constructs)
    ) {
      return nok(code)
    }
    if (code === 93) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok
    }

    // To do: indent? Link chunks and EOLs together?
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return atBreak
    }
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return labelInside(code)
  }

  /**
   * In label, in text.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function labelInside(code) {
    if (
      code === null ||
      code === 91 ||
      code === 93 ||
      markdownLineEnding(code) ||
      size++ > 999
    ) {
      effects.exit('chunkString');
      return atBreak(code)
    }
    effects.consume(code);
    if (!seen) seen = !markdownSpace(code);
    return code === 92 ? labelEscape : labelInside
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | [a\*a]
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code);
      size++;
      return labelInside
    }
    return labelInside(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */

/**
 * Parse titles.
 *
 * ###### Examples
 *
 * ```markdown
 * "a"
 * 'b'
 * (c)
 * "a
 * b"
 * 'a
 *     b'
 * (a\)b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole title (`"a"`, `'b'`, `(c)`).
 * @param {TokenType} markerType
 *   Type for the markers (`"`, `'`, `(`, and `)`).
 * @param {TokenType} stringType
 *   Type for the value (`a`).
 * @returns {State}
 *   Start state.
 */ // eslint-disable-next-line max-params
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
  /** @type {NonNullable<Code>} */
  let marker;
  return start

  /**
   * Start of title.
   *
   * ```markdown
   * > | "a"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 34 || code === 39 || code === 40) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      marker = code === 40 ? 41 : code;
      return begin
    }
    return nok(code)
  }

  /**
   * After opening marker.
   *
   * This is also used at the closing marker.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function begin(code) {
    if (code === marker) {
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok
    }
    effects.enter(stringType);
    return atBreak(code)
  }

  /**
   * At something, before something else.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.exit(stringType);
      return begin(marker)
    }
    if (code === null) {
      return nok(code)
    }

    // Note: blank lines can’t exist in content.
    if (markdownLineEnding(code)) {
      // To do: use `space_or_tab_eol_with_options`, connect.
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return factorySpace(effects, atBreak, 'linePrefix')
    }
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return inside(code)
  }

  /**
   *
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker || code === null || markdownLineEnding(code)) {
      effects.exit('chunkString');
      return atBreak(code)
    }
    effects.consume(code);
    return code === 92 ? escape : inside
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | "a\*b"
   *      ^
   * ```
   *
   * @type {State}
   */
  function escape(code) {
    if (code === marker || code === 92) {
      effects.consume(code);
      return inside
    }
    return inside(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 */

/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   line endings or spaces in markdown are often optional, in which case this
 *     factory can be used and `ok` will be switched to whether spaces were found
 *     or not
 * *   one line ending or space can be detected with
 *     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @returns {State}
 *   Start state.
 */
function factoryWhitespace(effects, ok) {
  /** @type {boolean} */
  let seen;
  return start

  /** @type {State} */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      seen = true;
      return start
    }
    if (markdownSpace(code)) {
      return factorySpace(
        effects,
        start,
        seen ? 'linePrefix' : 'lineSuffix'
      )(code)
    }
    return ok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const definition = {
  name: 'definition',
  tokenize: tokenizeDefinition
};

/** @type {Construct} */
const titleBefore = {
  tokenize: tokenizeTitleBefore,
  partial: true
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeDefinition(effects, ok, nok) {
  const self = this;
  /** @type {string} */
  let identifier;
  return start

  /**
   * At start of a definition.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // Do not interrupt paragraphs (but do follow definitions).
    // To do: do `interrupt` the way `markdown-rs` does.
    // To do: parse whitespace the way `markdown-rs` does.
    effects.enter('definition');
    return before(code)
  }

  /**
   * After optional whitespace, at `[`.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    // To do: parse whitespace the way `markdown-rs` does.

    return factoryLabel.call(
      self,
      effects,
      labelAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      'definitionLabel',
      'definitionLabelMarker',
      'definitionLabelString'
    )(code)
  }

  /**
   * After label.
   *
   * ```markdown
   * > | [a]: b "c"
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelAfter(code) {
    identifier = normalizeIdentifier(
      self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
    );
    if (code === 58) {
      effects.enter('definitionMarker');
      effects.consume(code);
      effects.exit('definitionMarker');
      return markerAfter
    }
    return nok(code)
  }

  /**
   * After marker.
   *
   * ```markdown
   * > | [a]: b "c"
   *         ^
   * ```
   *
   * @type {State}
   */
  function markerAfter(code) {
    // Note: whitespace is optional.
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, destinationBefore)(code)
      : destinationBefore(code)
  }

  /**
   * Before destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *          ^
   * ```
   *
   * @type {State}
   */
  function destinationBefore(code) {
    return factoryDestination(
      effects,
      destinationAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      'definitionDestination',
      'definitionDestinationLiteral',
      'definitionDestinationLiteralMarker',
      'definitionDestinationRaw',
      'definitionDestinationString'
    )(code)
  }

  /**
   * After destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function destinationAfter(code) {
    return effects.attempt(titleBefore, after, after)(code)
  }

  /**
   * After definition.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return markdownSpace(code)
      ? factorySpace(effects, afterWhitespace, 'whitespace')(code)
      : afterWhitespace(code)
  }

  /**
   * After definition, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function afterWhitespace(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('definition');

      // Note: we don’t care about uniqueness.
      // It’s likely that that doesn’t happen very frequently.
      // It is more likely that it wastes precious time.
      self.parser.defined.push(identifier);

      // To do: `markdown-rs` interrupt.
      // // You’d be interrupting.
      // tokenizer.interrupt = true
      return ok(code)
    }
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeTitleBefore(effects, ok, nok) {
  return titleBefore

  /**
   * After destination, at whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function titleBefore(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, beforeMarker)(code)
      : nok(code)
  }

  /**
   * At title.
   *
   * ```markdown
   *   | [a]: b
   * > | "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function beforeMarker(code) {
    return factoryTitle(
      effects,
      titleAfter,
      nok,
      'definitionTitle',
      'definitionTitleMarker',
      'definitionTitleString'
    )(code)
  }

  /**
   * After title.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfter(code) {
    return markdownSpace(code)
      ? factorySpace(effects, titleAfterOptionalWhitespace, 'whitespace')(code)
      : titleAfterOptionalWhitespace(code)
  }

  /**
   * After title, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfterOptionalWhitespace(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const hardBreakEscape = {
  name: 'hardBreakEscape',
  tokenize: tokenizeHardBreakEscape
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHardBreakEscape(effects, ok, nok) {
  return start

  /**
   * Start of a hard break (escape).
   *
   * ```markdown
   * > | a\
   *      ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('hardBreakEscape');
    effects.consume(code);
    return after
  }

  /**
   * After `\`, at eol.
   *
   * ```markdown
   * > | a\
   *       ^
   *   | b
   * ```
   *
   *  @type {State}
   */
  function after(code) {
    if (markdownLineEnding(code)) {
      effects.exit('hardBreakEscape');
      return ok(code)
    }
    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const headingAtx = {
  name: 'headingAtx',
  tokenize: tokenizeHeadingAtx,
  resolve: resolveHeadingAtx
};

/** @type {Resolver} */
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2;
  let contentStart = 3;
  /** @type {Token} */
  let content;
  /** @type {Token} */
  let text;

  // Prefix whitespace, part of the opening.
  if (events[contentStart][1].type === 'whitespace') {
    contentStart += 2;
  }

  // Suffix whitespace, part of the closing.
  if (
    contentEnd - 2 > contentStart &&
    events[contentEnd][1].type === 'whitespace'
  ) {
    contentEnd -= 2;
  }
  if (
    events[contentEnd][1].type === 'atxHeadingSequence' &&
    (contentStart === contentEnd - 1 ||
      (contentEnd - 4 > contentStart &&
        events[contentEnd - 2][1].type === 'whitespace'))
  ) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  }
  if (contentEnd > contentStart) {
    content = {
      type: 'atxHeadingText',
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    };
    text = {
      type: 'chunkText',
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: 'text'
    };
    splice(events, contentStart, contentEnd - contentStart + 1, [
      ['enter', content, context],
      ['enter', text, context],
      ['exit', text, context],
      ['exit', content, context]
    ]);
  }
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHeadingAtx(effects, ok, nok) {
  let size = 0;
  return start

  /**
   * Start of a heading (atx).
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    effects.enter('atxHeading');
    return before(code)
  }

  /**
   * After optional whitespace, at `#`.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter('atxHeadingSequence');
    return sequenceOpen(code)
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 35 && size++ < 6) {
      effects.consume(code);
      return sequenceOpen
    }

    // Always at least one `#`.
    if (code === null || markdownLineEndingOrSpace(code)) {
      effects.exit('atxHeadingSequence');
      return atBreak(code)
    }
    return nok(code)
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ## aa
   *       ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === 35) {
      effects.enter('atxHeadingSequence');
      return sequenceFurther(code)
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit('atxHeading');
      // To do: interrupt like `markdown-rs`.
      // // Feel free to interrupt.
      // tokenizer.interrupt = false
      return ok(code)
    }
    if (markdownSpace(code)) {
      return factorySpace(effects, atBreak, 'whitespace')(code)
    }

    // To do: generate `data` tokens, add the `text` token later.
    // Needs edit map, see: `markdown.rs`.
    effects.enter('atxHeadingText');
    return data(code)
  }

  /**
   * In further sequence (after whitespace).
   *
   * Could be normal “visible” hashes in the heading or a final sequence.
   *
   * ```markdown
   * > | ## aa ##
   *           ^
   * ```
   *
   * @type {State}
   */
  function sequenceFurther(code) {
    if (code === 35) {
      effects.consume(code);
      return sequenceFurther
    }
    effects.exit('atxHeadingSequence');
    return atBreak(code)
  }

  /**
   * In text.
   *
   * ```markdown
   * > | ## aa
   *        ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
      effects.exit('atxHeadingText');
      return atBreak(code)
    }
    effects.consume(code);
    return data
  }
}

/**
 * List of lowercase HTML “block” tag names.
 *
 * The list, when parsing HTML (flow), results in more relaxed rules (condition
 * 6).
 * Because they are known blocks, the HTML-like syntax doesn’t have to be
 * strictly parsed.
 * For tag names not in this list, a more strict algorithm (condition 7) is used
 * to detect whether the HTML-like syntax is seen as HTML (flow) or not.
 *
 * This is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `search` was added in `CommonMark@0.31`.
 */
const htmlBlockNames = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'search',
  'section',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
];

/**
 * List of lowercase HTML “raw” tag names.
 *
 * The list, when parsing HTML (flow), results in HTML that can include lines
 * without exiting, until a closing tag also in this list is found (condition
 * 1).
 *
 * This module is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
 */
const htmlRawNames = ['pre', 'script', 'style', 'textarea'];

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const htmlFlow = {
  name: 'htmlFlow',
  tokenize: tokenizeHtmlFlow,
  resolveTo: resolveToHtmlFlow,
  concrete: true
};

/** @type {Construct} */
const blankLineBefore = {
  tokenize: tokenizeBlankLineBefore,
  partial: true
};
const nonLazyContinuationStart = {
  tokenize: tokenizeNonLazyContinuationStart,
  partial: true
};

/** @type {Resolver} */
function resolveToHtmlFlow(events) {
  let index = events.length;
  while (index--) {
    if (events[index][0] === 'enter' && events[index][1].type === 'htmlFlow') {
      break
    }
  }
  if (index > 1 && events[index - 2][1].type === 'linePrefix') {
    // Add the prefix start to the HTML token.
    events[index][1].start = events[index - 2][1].start;
    // Add the prefix start to the HTML line token.
    events[index + 1][1].start = events[index - 2][1].start;
    // Remove the line prefix.
    events.splice(index - 2, 2);
  }
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHtmlFlow(effects, ok, nok) {
  const self = this;
  /** @type {number} */
  let marker;
  /** @type {boolean} */
  let closingTag;
  /** @type {string} */
  let buffer;
  /** @type {number} */
  let index;
  /** @type {Code} */
  let markerB;
  return start

  /**
   * Start of HTML (flow).
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    return before(code)
  }

  /**
   * At `<`, after optional whitespace.
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter('htmlFlow');
    effects.enter('htmlFlowData');
    effects.consume(code);
    return open
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | <x />
   *      ^
   * > | <!doctype>
   *      ^
   * > | <!--xxx-->
   *      ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 33) {
      effects.consume(code);
      return declarationOpen
    }
    if (code === 47) {
      effects.consume(code);
      closingTag = true;
      return tagCloseStart
    }
    if (code === 63) {
      effects.consume(code);
      marker = 3;
      // To do:
      // tokenizer.concrete = true
      // To do: use `markdown-rs` style interrupt.
      // While we’re in an instruction instead of a declaration, we’re on a `?`
      // right now, so we do need to search for `>`, similar to declarations.
      return self.interrupt ? ok : continuationDeclarationInside
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      // @ts-expect-error: not null.
      buffer = String.fromCharCode(code);
      return tagName
    }
    return nok(code)
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | <!doctype>
   *       ^
   * > | <!--xxx-->
   *       ^
   * > | <![CDATA[>&<]]>
   *       ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code);
      marker = 2;
      return commentOpenInside
    }
    if (code === 91) {
      effects.consume(code);
      marker = 5;
      index = 0;
      return cdataOpenInside
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      marker = 4;
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuationDeclarationInside
    }
    return nok(code)
  }

  /**
   * After `<!-`, inside a comment, at another `-`.
   *
   * ```markdown
   * > | <!--xxx-->
   *        ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code);
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuationDeclarationInside
    }
    return nok(code)
  }

  /**
   * After `<![`, inside CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *        ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = 'CDATA[';
    if (code === value.charCodeAt(index++)) {
      effects.consume(code);
      if (index === value.length) {
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok : continuation
      }
      return cdataOpenInside
    }
    return nok(code)
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | </x>
   *       ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      // @ts-expect-error: not null.
      buffer = String.fromCharCode(code);
      return tagName
    }
    return nok(code)
  }

  /**
   * In tag name.
   *
   * ```markdown
   * > | <ab>
   *      ^^
   * > | </ab>
   *       ^^
   * ```
   *
   * @type {State}
   */
  function tagName(code) {
    if (
      code === null ||
      code === 47 ||
      code === 62 ||
      markdownLineEndingOrSpace(code)
    ) {
      const slash = code === 47;
      const name = buffer.toLowerCase();
      if (!slash && !closingTag && htmlRawNames.includes(name)) {
        marker = 1;
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok(code) : continuation(code)
      }
      if (htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = 6;
        if (slash) {
          effects.consume(code);
          return basicSelfClosing
        }

        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok(code) : continuation(code)
      }
      marker = 7;
      // Do not support complete HTML when interrupting.
      return self.interrupt && !self.parser.lazy[self.now().line]
        ? nok(code)
        : closingTag
        ? completeClosingTagAfter(code)
        : completeAttributeNameBefore(code)
    }

    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      buffer += String.fromCharCode(code);
      return tagName
    }
    return nok(code)
  }

  /**
   * After closing slash of a basic tag name.
   *
   * ```markdown
   * > | <div/>
   *          ^
   * ```
   *
   * @type {State}
   */
  function basicSelfClosing(code) {
    if (code === 62) {
      effects.consume(code);
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuation
    }
    return nok(code)
  }

  /**
   * After closing slash of a complete tag name.
   *
   * ```markdown
   * > | <x/>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeClosingTagAfter(code) {
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeClosingTagAfter
    }
    return completeEnd(code)
  }

  /**
   * At an attribute name.
   *
   * At first, this state is used after a complete tag name, after whitespace,
   * where it expects optional attributes or the end of the tag.
   * It is also reused after attributes, when expecting more optional
   * attributes.
   *
   * ```markdown
   * > | <a />
   *        ^
   * > | <a :b>
   *        ^
   * > | <a _b>
   *        ^
   * > | <a b>
   *        ^
   * > | <a >
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameBefore(code) {
    if (code === 47) {
      effects.consume(code);
      return completeEnd
    }

    // ASCII alphanumerical and `:` and `_`.
    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code);
      return completeAttributeName
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameBefore
    }
    return completeEnd(code)
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | <a :b>
   *         ^
   * > | <a _b>
   *         ^
   * > | <a b>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeName(code) {
    // ASCII alphanumerical and `-`, `.`, `:`, and `_`.
    if (
      code === 45 ||
      code === 46 ||
      code === 58 ||
      code === 95 ||
      asciiAlphanumeric(code)
    ) {
      effects.consume(code);
      return completeAttributeName
    }
    return completeAttributeNameAfter(code)
  }

  /**
   * After attribute name, at an optional initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | <a b>
   *         ^
   * > | <a b=c>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code);
      return completeAttributeValueBefore
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameAfter
    }
    return completeAttributeNameBefore(code)
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * > | <a b="c">
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueBefore(code) {
    if (
      code === null ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96
    ) {
      return nok(code)
    }
    if (code === 34 || code === 39) {
      effects.consume(code);
      markerB = code;
      return completeAttributeValueQuoted
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeValueBefore
    }
    return completeAttributeValueUnquoted(code)
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | <a b="c">
   *           ^
   * > | <a b='c'>
   *           ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuoted(code) {
    if (code === markerB) {
      effects.consume(code);
      markerB = null;
      return completeAttributeValueQuotedAfter
    }
    if (code === null || markdownLineEnding(code)) {
      return nok(code)
    }
    effects.consume(code);
    return completeAttributeValueQuoted
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueUnquoted(code) {
    if (
      code === null ||
      code === 34 ||
      code === 39 ||
      code === 47 ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96 ||
      markdownLineEndingOrSpace(code)
    ) {
      return completeAttributeNameAfter(code)
    }
    effects.consume(code);
    return completeAttributeValueUnquoted
  }

  /**
   * After double or single quoted attribute value, before whitespace or the
   * end of the tag.
   *
   * ```markdown
   * > | <a b="c">
   *            ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownSpace(code)) {
      return completeAttributeNameBefore(code)
    }
    return nok(code)
  }

  /**
   * In certain circumstances of a complete tag where only an `>` is allowed.
   *
   * ```markdown
   * > | <a b="c">
   *             ^
   * ```
   *
   * @type {State}
   */
  function completeEnd(code) {
    if (code === 62) {
      effects.consume(code);
      return completeAfter
    }
    return nok(code)
  }

  /**
   * After `>` in a complete tag.
   *
   * ```markdown
   * > | <x>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAfter(code) {
    if (code === null || markdownLineEnding(code)) {
      // // Do not form containers.
      // tokenizer.concrete = true
      return continuation(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAfter
    }
    return nok(code)
  }

  /**
   * In continuation of any HTML kind.
   *
   * ```markdown
   * > | <!--xxx-->
   *          ^
   * ```
   *
   * @type {State}
   */
  function continuation(code) {
    if (code === 45 && marker === 2) {
      effects.consume(code);
      return continuationCommentInside
    }
    if (code === 60 && marker === 1) {
      effects.consume(code);
      return continuationRawTagOpen
    }
    if (code === 62 && marker === 4) {
      effects.consume(code);
      return continuationClose
    }
    if (code === 63 && marker === 3) {
      effects.consume(code);
      return continuationDeclarationInside
    }
    if (code === 93 && marker === 5) {
      effects.consume(code);
      return continuationCdataInside
    }
    if (markdownLineEnding(code) && (marker === 6 || marker === 7)) {
      effects.exit('htmlFlowData');
      return effects.check(
        blankLineBefore,
        continuationAfter,
        continuationStart
      )(code)
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit('htmlFlowData');
      return continuationStart(code)
    }
    effects.consume(code);
    return continuation
  }

  /**
   * In continuation, at eol.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStart(code) {
    return effects.check(
      nonLazyContinuationStart,
      continuationStartNonLazy,
      continuationAfter
    )(code)
  }

  /**
   * In continuation, at eol, before non-lazy content.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStartNonLazy(code) {
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return continuationBefore
  }

  /**
   * In continuation, before non-lazy content.
   *
   * ```markdown
   *   | <x>
   * > | asd
   *     ^
   * ```
   *
   * @type {State}
   */
  function continuationBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      return continuationStart(code)
    }
    effects.enter('htmlFlowData');
    return continuation(code)
  }

  /**
   * In comment continuation, after one `-`, expecting another.
   *
   * ```markdown
   * > | <!--xxx-->
   *             ^
   * ```
   *
   * @type {State}
   */
  function continuationCommentInside(code) {
    if (code === 45) {
      effects.consume(code);
      return continuationDeclarationInside
    }
    return continuation(code)
  }

  /**
   * In raw continuation, after `<`, at `/`.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                            ^
   * ```
   *
   * @type {State}
   */
  function continuationRawTagOpen(code) {
    if (code === 47) {
      effects.consume(code);
      buffer = '';
      return continuationRawEndTag
    }
    return continuation(code)
  }

  /**
   * In raw continuation, after `</`, in a raw tag name.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                             ^^^^^^
   * ```
   *
   * @type {State}
   */
  function continuationRawEndTag(code) {
    if (code === 62) {
      const name = buffer.toLowerCase();
      if (htmlRawNames.includes(name)) {
        effects.consume(code);
        return continuationClose
      }
      return continuation(code)
    }
    if (asciiAlpha(code) && buffer.length < 8) {
      effects.consume(code);
      // @ts-expect-error: not null.
      buffer += String.fromCharCode(code);
      return continuationRawEndTag
    }
    return continuation(code)
  }

  /**
   * In cdata continuation, after `]`, expecting `]>`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *                  ^
   * ```
   *
   * @type {State}
   */
  function continuationCdataInside(code) {
    if (code === 93) {
      effects.consume(code);
      return continuationDeclarationInside
    }
    return continuation(code)
  }

  /**
   * In declaration or instruction continuation, at `>`.
   *
   * ```markdown
   * > | <!-->
   *         ^
   * > | <?>
   *       ^
   * > | <!q>
   *        ^
   * > | <!--ab-->
   *             ^
   * > | <![CDATA[>&<]]>
   *                   ^
   * ```
   *
   * @type {State}
   */
  function continuationDeclarationInside(code) {
    if (code === 62) {
      effects.consume(code);
      return continuationClose
    }

    // More dashes.
    if (code === 45 && marker === 2) {
      effects.consume(code);
      return continuationDeclarationInside
    }
    return continuation(code)
  }

  /**
   * In closed continuation: everything we get until the eol/eof is part of it.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationClose(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('htmlFlowData');
      return continuationAfter(code)
    }
    effects.consume(code);
    return continuationClose
  }

  /**
   * Done.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationAfter(code) {
    effects.exit('htmlFlow');
    // // Feel free to interrupt.
    // tokenizer.interrupt = false
    // // No longer concrete.
    // tokenizer.concrete = false
    return ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuationStart(effects, ok, nok) {
  const self = this;
  return start

  /**
   * At eol, before continuation.
   *
   * ```markdown
   * > | * ```js
   *            ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return after
    }
    return nok(code)
  }

  /**
   * A continuation.
   *
   * ```markdown
   *   | * ```js
   * > | b
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlankLineBefore(effects, ok, nok) {
  return start

  /**
   * Before eol, expecting blank line.
   *
   * ```markdown
   * > | <div>
   *          ^
   *   |
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return effects.attempt(blankLine, ok, nok)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const htmlText = {
  name: 'htmlText',
  tokenize: tokenizeHtmlText
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHtmlText(effects, ok, nok) {
  const self = this;
  /** @type {NonNullable<Code> | undefined} */
  let marker;
  /** @type {number} */
  let index;
  /** @type {State} */
  let returnState;
  return start

  /**
   * Start of HTML (text).
   *
   * ```markdown
   * > | a <b> c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('htmlText');
    effects.enter('htmlTextData');
    effects.consume(code);
    return open
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | a <b> c
   *        ^
   * > | a <!doctype> c
   *        ^
   * > | a <!--b--> c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 33) {
      effects.consume(code);
      return declarationOpen
    }
    if (code === 47) {
      effects.consume(code);
      return tagCloseStart
    }
    if (code === 63) {
      effects.consume(code);
      return instruction
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagOpen
    }
    return nok(code)
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | a <!doctype> c
   *         ^
   * > | a <!--b--> c
   *         ^
   * > | a <![CDATA[>&<]]> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code);
      return commentOpenInside
    }
    if (code === 91) {
      effects.consume(code);
      index = 0;
      return cdataOpenInside
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      return declaration
    }
    return nok(code)
  }

  /**
   * In a comment, after `<!-`, at another `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code);
      return commentEnd
    }
    return nok(code)
  }

  /**
   * In comment.
   *
   * ```markdown
   * > | a <!--b--> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function comment(code) {
    if (code === null) {
      return nok(code)
    }
    if (code === 45) {
      effects.consume(code);
      return commentClose
    }
    if (markdownLineEnding(code)) {
      returnState = comment;
      return lineEndingBefore(code)
    }
    effects.consume(code);
    return comment
  }

  /**
   * In comment, after `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *             ^
   * ```
   *
   * @type {State}
   */
  function commentClose(code) {
    if (code === 45) {
      effects.consume(code);
      return commentEnd
    }
    return comment(code)
  }

  /**
   * In comment, after `--`.
   *
   * ```markdown
   * > | a <!--b--> c
   *              ^
   * ```
   *
   * @type {State}
   */
  function commentEnd(code) {
    return code === 62
      ? end(code)
      : code === 45
      ? commentClose(code)
      : comment(code)
  }

  /**
   * After `<![`, in CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *          ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = 'CDATA[';
    if (code === value.charCodeAt(index++)) {
      effects.consume(code);
      return index === value.length ? cdata : cdataOpenInside
    }
    return nok(code)
  }

  /**
   * In CDATA.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                ^^^
   * ```
   *
   * @type {State}
   */
  function cdata(code) {
    if (code === null) {
      return nok(code)
    }
    if (code === 93) {
      effects.consume(code);
      return cdataClose
    }
    if (markdownLineEnding(code)) {
      returnState = cdata;
      return lineEndingBefore(code)
    }
    effects.consume(code);
    return cdata
  }

  /**
   * In CDATA, after `]`, at another `]`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function cdataClose(code) {
    if (code === 93) {
      effects.consume(code);
      return cdataEnd
    }
    return cdata(code)
  }

  /**
   * In CDATA, after `]]`, at `>`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                     ^
   * ```
   *
   * @type {State}
   */
  function cdataEnd(code) {
    if (code === 62) {
      return end(code)
    }
    if (code === 93) {
      effects.consume(code);
      return cdataEnd
    }
    return cdata(code)
  }

  /**
   * In declaration.
   *
   * ```markdown
   * > | a <!b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function declaration(code) {
    if (code === null || code === 62) {
      return end(code)
    }
    if (markdownLineEnding(code)) {
      returnState = declaration;
      return lineEndingBefore(code)
    }
    effects.consume(code);
    return declaration
  }

  /**
   * In instruction.
   *
   * ```markdown
   * > | a <?b?> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function instruction(code) {
    if (code === null) {
      return nok(code)
    }
    if (code === 63) {
      effects.consume(code);
      return instructionClose
    }
    if (markdownLineEnding(code)) {
      returnState = instruction;
      return lineEndingBefore(code)
    }
    effects.consume(code);
    return instruction
  }

  /**
   * In instruction, after `?`, at `>`.
   *
   * ```markdown
   * > | a <?b?> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function instructionClose(code) {
    return code === 62 ? end(code) : instruction(code)
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | a </b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagClose
    }
    return nok(code)
  }

  /**
   * After `</x`, in a tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagClose(code) {
    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagClose
    }
    return tagCloseBetween(code)
  }

  /**
   * In closing tag, after tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagCloseBetween(code) {
    if (markdownLineEnding(code)) {
      returnState = tagCloseBetween;
      return lineEndingBefore(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagCloseBetween
    }
    return end(code)
  }

  /**
   * After `<x`, in opening tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpen(code) {
    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpen
    }
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }
    return nok(code)
  }

  /**
   * In opening tag, after tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpenBetween(code) {
    if (code === 47) {
      effects.consume(code);
      return end
    }

    // ASCII alphabetical and `:` and `_`.
    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code);
      return tagOpenAttributeName
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenBetween;
      return lineEndingBefore(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenBetween
    }
    return end(code)
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | a <b c> d
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeName(code) {
    // ASCII alphabetical and `-`, `.`, `:`, and `_`.
    if (
      code === 45 ||
      code === 46 ||
      code === 58 ||
      code === 95 ||
      asciiAlphanumeric(code)
    ) {
      effects.consume(code);
      return tagOpenAttributeName
    }
    return tagOpenAttributeNameAfter(code)
  }

  /**
   * After attribute name, before initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | a <b c> d
   *           ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code);
      return tagOpenAttributeValueBefore
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeNameAfter;
      return lineEndingBefore(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeNameAfter
    }
    return tagOpenBetween(code)
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueBefore(code) {
    if (
      code === null ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96
    ) {
      return nok(code)
    }
    if (code === 34 || code === 39) {
      effects.consume(code);
      marker = code;
      return tagOpenAttributeValueQuoted
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueBefore;
      return lineEndingBefore(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeValueBefore
    }
    effects.consume(code);
    return tagOpenAttributeValueUnquoted
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | a <b c="d"> e
   *             ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code);
      marker = undefined;
      return tagOpenAttributeValueQuotedAfter
    }
    if (code === null) {
      return nok(code)
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueQuoted;
      return lineEndingBefore(code)
    }
    effects.consume(code);
    return tagOpenAttributeValueQuoted
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueUnquoted(code) {
    if (
      code === null ||
      code === 34 ||
      code === 39 ||
      code === 60 ||
      code === 61 ||
      code === 96
    ) {
      return nok(code)
    }
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }
    effects.consume(code);
    return tagOpenAttributeValueUnquoted
  }

  /**
   * After double or single quoted attribute value, before whitespace or the end
   * of the tag.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }
    return nok(code)
  }

  /**
   * In certain circumstances of a tag where only an `>` is allowed.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function end(code) {
    if (code === 62) {
      effects.consume(code);
      effects.exit('htmlTextData');
      effects.exit('htmlText');
      return ok
    }
    return nok(code)
  }

  /**
   * At eol.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   * > | a <!--a
   *            ^
   *   | b-->
   * ```
   *
   * @type {State}
   */
  function lineEndingBefore(code) {
    effects.exit('htmlTextData');
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return lineEndingAfter
  }

  /**
   * After eol, at optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfter(code) {
    // Always populated by defaults.

    return markdownSpace(code)
      ? factorySpace(
          effects,
          lineEndingAfterPrefix,
          'linePrefix',
          self.parser.constructs.disable.null.includes('codeIndented')
            ? undefined
            : 4
        )(code)
      : lineEndingAfterPrefix(code)
  }

  /**
   * After eol, after optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfterPrefix(code) {
    effects.enter('htmlTextData');
    return returnState(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const labelEnd = {
  name: 'labelEnd',
  tokenize: tokenizeLabelEnd,
  resolveTo: resolveToLabelEnd,
  resolveAll: resolveAllLabelEnd
};

/** @type {Construct} */
const resourceConstruct = {
  tokenize: tokenizeResource
};
/** @type {Construct} */
const referenceFullConstruct = {
  tokenize: tokenizeReferenceFull
};
/** @type {Construct} */
const referenceCollapsedConstruct = {
  tokenize: tokenizeReferenceCollapsed
};

/** @type {Resolver} */
function resolveAllLabelEnd(events) {
  let index = -1;
  while (++index < events.length) {
    const token = events[index][1];
    if (
      token.type === 'labelImage' ||
      token.type === 'labelLink' ||
      token.type === 'labelEnd'
    ) {
      // Remove the marker.
      events.splice(index + 1, token.type === 'labelImage' ? 4 : 2);
      token.type = 'data';
      index++;
    }
  }
  return events
}

/** @type {Resolver} */
function resolveToLabelEnd(events, context) {
  let index = events.length;
  let offset = 0;
  /** @type {Token} */
  let token;
  /** @type {number | undefined} */
  let open;
  /** @type {number | undefined} */
  let close;
  /** @type {Array<Event>} */
  let media;

  // Find an opening.
  while (index--) {
    token = events[index][1];
    if (open) {
      // If we see another link, or inactive link label, we’ve been here before.
      if (
        token.type === 'link' ||
        (token.type === 'labelLink' && token._inactive)
      ) {
        break
      }

      // Mark other link openings as inactive, as we can’t have links in
      // links.
      if (events[index][0] === 'enter' && token.type === 'labelLink') {
        token._inactive = true;
      }
    } else if (close) {
      if (
        events[index][0] === 'enter' &&
        (token.type === 'labelImage' || token.type === 'labelLink') &&
        !token._balanced
      ) {
        open = index;
        if (token.type !== 'labelLink') {
          offset = 2;
          break
        }
      }
    } else if (token.type === 'labelEnd') {
      close = index;
    }
  }
  const group = {
    type: events[open][1].type === 'labelLink' ? 'link' : 'image',
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };
  const label = {
    type: 'label',
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[close][1].end)
  };
  const text = {
    type: 'labelText',
    start: Object.assign({}, events[open + offset + 2][1].end),
    end: Object.assign({}, events[close - 2][1].start)
  };
  media = [
    ['enter', group, context],
    ['enter', label, context]
  ];

  // Opening marker.
  media = push(media, events.slice(open + 1, open + offset + 3));

  // Text open.
  media = push(media, [['enter', text, context]]);

  // Always populated by defaults.

  // Between.
  media = push(
    media,
    resolveAll(
      context.parser.constructs.insideSpan.null,
      events.slice(open + offset + 4, close - 3),
      context
    )
  );

  // Text close, marker close, label close.
  media = push(media, [
    ['exit', text, context],
    events[close - 2],
    events[close - 1],
    ['exit', label, context]
  ]);

  // Reference, resource, or so.
  media = push(media, events.slice(close + 1));

  // Media close.
  media = push(media, [['exit', group, context]]);
  splice(events, open, events.length, media);
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelEnd(effects, ok, nok) {
  const self = this;
  let index = self.events.length;
  /** @type {Token} */
  let labelStart;
  /** @type {boolean} */
  let defined;

  // Find an opening.
  while (index--) {
    if (
      (self.events[index][1].type === 'labelImage' ||
        self.events[index][1].type === 'labelLink') &&
      !self.events[index][1]._balanced
    ) {
      labelStart = self.events[index][1];
      break
    }
  }
  return start

  /**
   * Start of label end.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // If there is not an okay opening.
    if (!labelStart) {
      return nok(code)
    }

    // If the corresponding label (link) start is marked as inactive,
    // it means we’d be wrapping a link, like this:
    //
    // ```markdown
    // > | a [b [c](d) e](f) g.
    //                  ^
    // ```
    //
    // We can’t have that, so it’s just balanced brackets.
    if (labelStart._inactive) {
      return labelEndNok(code)
    }
    defined = self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize({
          start: labelStart.end,
          end: self.now()
        })
      )
    );
    effects.enter('labelEnd');
    effects.enter('labelMarker');
    effects.consume(code);
    effects.exit('labelMarker');
    effects.exit('labelEnd');
    return after
  }

  /**
   * After `]`.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // Note: `markdown-rs` also parses GFM footnotes here, which for us is in
    // an extension.

    // Resource (`[asd](fgh)`)?
    if (code === 40) {
      return effects.attempt(
        resourceConstruct,
        labelEndOk,
        defined ? labelEndOk : labelEndNok
      )(code)
    }

    // Full (`[asd][fgh]`) or collapsed (`[asd][]`) reference?
    if (code === 91) {
      return effects.attempt(
        referenceFullConstruct,
        labelEndOk,
        defined ? referenceNotFull : labelEndNok
      )(code)
    }

    // Shortcut (`[asd]`) reference?
    return defined ? labelEndOk(code) : labelEndNok(code)
  }

  /**
   * After `]`, at `[`, but not at a full reference.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] b
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceNotFull(code) {
    return effects.attempt(
      referenceCollapsedConstruct,
      labelEndOk,
      labelEndNok
    )(code)
  }

  /**
   * Done, we found something.
   *
   * ```markdown
   * > | [a](b) c
   *           ^
   * > | [a][b] c
   *           ^
   * > | [a][] b
   *          ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndOk(code) {
    // Note: `markdown-rs` does a bunch of stuff here.
    return ok(code)
  }

  /**
   * Done, it’s nothing.
   *
   * There was an okay opening, but we didn’t match anything.
   *
   * ```markdown
   * > | [a](b c
   *        ^
   * > | [a][b c
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndNok(code) {
    labelStart._balanced = true;
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeResource(effects, ok, nok) {
  return resourceStart

  /**
   * At a resource.
   *
   * ```markdown
   * > | [a](b) c
   *        ^
   * ```
   *
   * @type {State}
   */
  function resourceStart(code) {
    effects.enter('resource');
    effects.enter('resourceMarker');
    effects.consume(code);
    effects.exit('resourceMarker');
    return resourceBefore
  }

  /**
   * In resource, after `(`, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceBefore(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceOpen)(code)
      : resourceOpen(code)
  }

  /**
   * In resource, after optional whitespace, at `)` or a destination.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceOpen(code) {
    if (code === 41) {
      return resourceEnd(code)
    }
    return factoryDestination(
      effects,
      resourceDestinationAfter,
      resourceDestinationMissing,
      'resourceDestination',
      'resourceDestinationLiteral',
      'resourceDestinationLiteralMarker',
      'resourceDestinationRaw',
      'resourceDestinationString',
      32
    )(code)
  }

  /**
   * In resource, after destination, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceBetween)(code)
      : resourceEnd(code)
  }

  /**
   * At invalid destination.
   *
   * ```markdown
   * > | [a](<<) b
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationMissing(code) {
    return nok(code)
  }

  /**
   * In resource, after destination and whitespace, at `(` or title.
   *
   * ```markdown
   * > | [a](b ) c
   *           ^
   * ```
   *
   * @type {State}
   */
  function resourceBetween(code) {
    if (code === 34 || code === 39 || code === 40) {
      return factoryTitle(
        effects,
        resourceTitleAfter,
        nok,
        'resourceTitle',
        'resourceTitleMarker',
        'resourceTitleString'
      )(code)
    }
    return resourceEnd(code)
  }

  /**
   * In resource, after title, at optional whitespace.
   *
   * ```markdown
   * > | [a](b "c") d
   *              ^
   * ```
   *
   * @type {State}
   */
  function resourceTitleAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceEnd)(code)
      : resourceEnd(code)
  }

  /**
   * In resource, at `)`.
   *
   * ```markdown
   * > | [a](b) d
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceEnd(code) {
    if (code === 41) {
      effects.enter('resourceMarker');
      effects.consume(code);
      effects.exit('resourceMarker');
      effects.exit('resource');
      return ok
    }
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeReferenceFull(effects, ok, nok) {
  const self = this;
  return referenceFull

  /**
   * In a reference (full), at the `[`.
   *
   * ```markdown
   * > | [a][b] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFull(code) {
    return factoryLabel.call(
      self,
      effects,
      referenceFullAfter,
      referenceFullMissing,
      'reference',
      'referenceMarker',
      'referenceString'
    )(code)
  }

  /**
   * In a reference (full), after `]`.
   *
   * ```markdown
   * > | [a][b] d
   *          ^
   * ```
   *
   * @type {State}
   */
  function referenceFullAfter(code) {
    return self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
      )
    )
      ? ok(code)
      : nok(code)
  }

  /**
   * In reference (full) that was missing.
   *
   * ```markdown
   * > | [a][b d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFullMissing(code) {
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeReferenceCollapsed(effects, ok, nok) {
  return referenceCollapsedStart

  /**
   * In reference (collapsed), at `[`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceCollapsedStart(code) {
    // We only attempt a collapsed label if there’s a `[`.

    effects.enter('reference');
    effects.enter('referenceMarker');
    effects.consume(code);
    effects.exit('referenceMarker');
    return referenceCollapsedOpen
  }

  /**
   * In reference (collapsed), at `]`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *         ^
   * ```
   *
   *  @type {State}
   */
  function referenceCollapsedOpen(code) {
    if (code === 93) {
      effects.enter('referenceMarker');
      effects.consume(code);
      effects.exit('referenceMarker');
      effects.exit('reference');
      return ok
    }
    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const labelStartImage = {
  name: 'labelStartImage',
  tokenize: tokenizeLabelStartImage,
  resolveAll: labelEnd.resolveAll
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelStartImage(effects, ok, nok) {
  const self = this;
  return start

  /**
   * Start of label (image) start.
   *
   * ```markdown
   * > | a ![b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('labelImage');
    effects.enter('labelImageMarker');
    effects.consume(code);
    effects.exit('labelImageMarker');
    return open
  }

  /**
   * After `!`, at `[`.
   *
   * ```markdown
   * > | a ![b] c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 91) {
      effects.enter('labelMarker');
      effects.consume(code);
      effects.exit('labelMarker');
      effects.exit('labelImage');
      return after
    }
    return nok(code)
  }

  /**
   * After `![`.
   *
   * ```markdown
   * > | a ![b] c
   *         ^
   * ```
   *
   * This is needed in because, when GFM footnotes are enabled, images never
   * form when started with a `^`.
   * Instead, links form:
   *
   * ```markdown
   * ![^a](b)
   *
   * ![^a][b]
   *
   * [b]: c
   * ```
   *
   * ```html
   * <p>!<a href=\"b\">^a</a></p>
   * <p>!<a href=\"c\">^a</a></p>
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // To do: use a new field to do this, this is still needed for
    // `micromark-extension-gfm-footnote`, but the `label-start-link`
    // behavior isn’t.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === 94 && '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const labelStartLink = {
  name: 'labelStartLink',
  tokenize: tokenizeLabelStartLink,
  resolveAll: labelEnd.resolveAll
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelStartLink(effects, ok, nok) {
  const self = this;
  return start

  /**
   * Start of label (link) start.
   *
   * ```markdown
   * > | a [b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('labelLink');
    effects.enter('labelMarker');
    effects.consume(code);
    effects.exit('labelMarker');
    effects.exit('labelLink');
    return after
  }

  /** @type {State} */
  function after(code) {
    // To do: this isn’t needed in `micromark-extension-gfm-footnote`,
    // remove.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === 94 && '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const lineEnding = {
  name: 'lineEnding',
  tokenize: tokenizeLineEnding
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLineEnding(effects, ok) {
  return start

  /** @type {State} */
  function start(code) {
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return factorySpace(effects, ok, 'linePrefix')
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const thematicBreak = {
  name: 'thematicBreak',
  tokenize: tokenizeThematicBreak
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeThematicBreak(effects, ok, nok) {
  let size = 0;
  /** @type {NonNullable<Code>} */
  let marker;
  return start

  /**
   * Start of thematic break.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('thematicBreak');
    // To do: parse indent like `markdown-rs`.
    return before(code)
  }

  /**
   * After optional whitespace, at marker.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    marker = code;
    return atBreak(code)
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.enter('thematicBreakSequence');
      return sequence(code)
    }
    if (size >= 3 && (code === null || markdownLineEnding(code))) {
      effects.exit('thematicBreak');
      return ok(code)
    }
    return nok(code)
  }

  /**
   * In sequence.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequence(code) {
    if (code === marker) {
      effects.consume(code);
      size++;
      return sequence
    }
    effects.exit('thematicBreakSequence');
    return markdownSpace(code)
      ? factorySpace(effects, atBreak, 'whitespace')(code)
      : atBreak(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ContainerState} ContainerState
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const list = {
  name: 'list',
  tokenize: tokenizeListStart,
  continuation: {
    tokenize: tokenizeListContinuation
  },
  exit: tokenizeListEnd
};

/** @type {Construct} */
const listItemPrefixWhitespaceConstruct = {
  tokenize: tokenizeListItemPrefixWhitespace,
  partial: true
};

/** @type {Construct} */
const indentConstruct = {
  tokenize: tokenizeIndent$1,
  partial: true
};

// To do: `markdown-rs` parses list items on their own and later stitches them
// together.

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListStart(effects, ok, nok) {
  const self = this;
  const tail = self.events[self.events.length - 1];
  let initialSize =
    tail && tail[1].type === 'linePrefix'
      ? tail[2].sliceSerialize(tail[1], true).length
      : 0;
  let size = 0;
  return start

  /** @type {State} */
  function start(code) {
    const kind =
      self.containerState.type ||
      (code === 42 || code === 43 || code === 45
        ? 'listUnordered'
        : 'listOrdered');
    if (
      kind === 'listUnordered'
        ? !self.containerState.marker || code === self.containerState.marker
        : asciiDigit(code)
    ) {
      if (!self.containerState.type) {
        self.containerState.type = kind;
        effects.enter(kind, {
          _container: true
        });
      }
      if (kind === 'listUnordered') {
        effects.enter('listItemPrefix');
        return code === 42 || code === 45
          ? effects.check(thematicBreak, nok, atMarker)(code)
          : atMarker(code)
      }
      if (!self.interrupt || code === 49) {
        effects.enter('listItemPrefix');
        effects.enter('listItemValue');
        return inside(code)
      }
    }
    return nok(code)
  }

  /** @type {State} */
  function inside(code) {
    if (asciiDigit(code) && ++size < 10) {
      effects.consume(code);
      return inside
    }
    if (
      (!self.interrupt || size < 2) &&
      (self.containerState.marker
        ? code === self.containerState.marker
        : code === 41 || code === 46)
    ) {
      effects.exit('listItemValue');
      return atMarker(code)
    }
    return nok(code)
  }

  /**
   * @type {State}
   **/
  function atMarker(code) {
    effects.enter('listItemMarker');
    effects.consume(code);
    effects.exit('listItemMarker');
    self.containerState.marker = self.containerState.marker || code;
    return effects.check(
      blankLine,
      // Can’t be empty when interrupting.
      self.interrupt ? nok : onBlank,
      effects.attempt(
        listItemPrefixWhitespaceConstruct,
        endOfPrefix,
        otherPrefix
      )
    )
  }

  /** @type {State} */
  function onBlank(code) {
    self.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code)
  }

  /** @type {State} */
  function otherPrefix(code) {
    if (markdownSpace(code)) {
      effects.enter('listItemPrefixWhitespace');
      effects.consume(code);
      effects.exit('listItemPrefixWhitespace');
      return endOfPrefix
    }
    return nok(code)
  }

  /** @type {State} */
  function endOfPrefix(code) {
    self.containerState.size =
      initialSize +
      self.sliceSerialize(effects.exit('listItemPrefix'), true).length;
    return ok(code)
  }
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListContinuation(effects, ok, nok) {
  const self = this;
  self.containerState._closeFlow = undefined;
  return effects.check(blankLine, onBlank, notBlank)

  /** @type {State} */
  function onBlank(code) {
    self.containerState.furtherBlankLines =
      self.containerState.furtherBlankLines ||
      self.containerState.initialBlankLine;

    // We have a blank line.
    // Still, try to consume at most the items size.
    return factorySpace(
      effects,
      ok,
      'listItemIndent',
      self.containerState.size + 1
    )(code)
  }

  /** @type {State} */
  function notBlank(code) {
    if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
      self.containerState.furtherBlankLines = undefined;
      self.containerState.initialBlankLine = undefined;
      return notInCurrentItem(code)
    }
    self.containerState.furtherBlankLines = undefined;
    self.containerState.initialBlankLine = undefined;
    return effects.attempt(indentConstruct, ok, notInCurrentItem)(code)
  }

  /** @type {State} */
  function notInCurrentItem(code) {
    // While we do continue, we signal that the flow should be closed.
    self.containerState._closeFlow = true;
    // As we’re closing flow, we’re no longer interrupting.
    self.interrupt = undefined;
    // Always populated by defaults.

    return factorySpace(
      effects,
      effects.attempt(list, ok, nok),
      'linePrefix',
      self.parser.constructs.disable.null.includes('codeIndented')
        ? undefined
        : 4
    )(code)
  }
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeIndent$1(effects, ok, nok) {
  const self = this;
  return factorySpace(
    effects,
    afterPrefix,
    'listItemIndent',
    self.containerState.size + 1
  )

  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === 'listItemIndent' &&
      tail[2].sliceSerialize(tail[1], true).length === self.containerState.size
      ? ok(code)
      : nok(code)
  }
}

/**
 * @type {Exiter}
 * @this {TokenizeContext}
 */
function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type);
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
  const self = this;

  // Always populated by defaults.

  return factorySpace(
    effects,
    afterPrefix,
    'listItemPrefixWhitespace',
    self.parser.constructs.disable.null.includes('codeIndented')
      ? undefined
      : 4 + 1
  )

  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return !markdownSpace(code) &&
      tail &&
      tail[1].type === 'listItemPrefixWhitespace'
      ? ok(code)
      : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/** @type {Construct} */
const setextUnderline = {
  name: 'setextUnderline',
  tokenize: tokenizeSetextUnderline,
  resolveTo: resolveToSetextUnderline
};

/** @type {Resolver} */
function resolveToSetextUnderline(events, context) {
  // To do: resolve like `markdown-rs`.
  let index = events.length;
  /** @type {number | undefined} */
  let content;
  /** @type {number | undefined} */
  let text;
  /** @type {number | undefined} */
  let definition;

  // Find the opening of the content.
  // It’ll always exist: we don’t tokenize if it isn’t there.
  while (index--) {
    if (events[index][0] === 'enter') {
      if (events[index][1].type === 'content') {
        content = index;
        break
      }
      if (events[index][1].type === 'paragraph') {
        text = index;
      }
    }
    // Exit
    else {
      if (events[index][1].type === 'content') {
        // Remove the content end (if needed we’ll add it later)
        events.splice(index, 1);
      }
      if (!definition && events[index][1].type === 'definition') {
        definition = index;
      }
    }
  }
  const heading = {
    type: 'setextHeading',
    start: Object.assign({}, events[text][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };

  // Change the paragraph to setext heading text.
  events[text][1].type = 'setextHeadingText';

  // If we have definitions in the content, we’ll keep on having content,
  // but we need move it.
  if (definition) {
    events.splice(text, 0, ['enter', heading, context]);
    events.splice(definition + 1, 0, ['exit', events[content][1], context]);
    events[content][1].end = Object.assign({}, events[definition][1].end);
  } else {
    events[content][1] = heading;
  }

  // Add the heading exit at the end.
  events.push(['exit', heading, context]);
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeSetextUnderline(effects, ok, nok) {
  const self = this;
  /** @type {NonNullable<Code>} */
  let marker;
  return start

  /**
   * At start of heading (setext) underline.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    let index = self.events.length;
    /** @type {boolean | undefined} */
    let paragraph;
    // Find an opening.
    while (index--) {
      // Skip enter/exit of line ending, line prefix, and content.
      // We can now either have a definition or a paragraph.
      if (
        self.events[index][1].type !== 'lineEnding' &&
        self.events[index][1].type !== 'linePrefix' &&
        self.events[index][1].type !== 'content'
      ) {
        paragraph = self.events[index][1].type === 'paragraph';
        break
      }
    }

    // To do: handle lazy/pierce like `markdown-rs`.
    // To do: parse indent like `markdown-rs`.
    if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
      effects.enter('setextHeadingLine');
      marker = code;
      return before(code)
    }
    return nok(code)
  }

  /**
   * After optional whitespace, at `-` or `=`.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter('setextHeadingLineSequence');
    return inside(code)
  }

  /**
   * In sequence.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside
    }
    effects.exit('setextHeadingLineSequence');
    return markdownSpace(code)
      ? factorySpace(effects, after, 'lineSuffix')(code)
      : after(code)
  }

  /**
   * After sequence, after optional whitespace.
   *
   * ```markdown
   *   | aa
   * > | ==
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('setextHeadingLine');
      return ok(code)
    }
    return nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/** @type {InitialConstruct} */
const flow$1 = {
  tokenize: initializeFlow
};

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeFlow(effects) {
  const self = this;
  const initial = effects.attempt(
    // Try to parse a blank line.
    blankLine,
    atBlankEnding,
    // Try to parse initial flow (essentially, only code).
    effects.attempt(
      this.parser.constructs.flowInitial,
      afterConstruct,
      factorySpace(
        effects,
        effects.attempt(
          this.parser.constructs.flow,
          afterConstruct,
          effects.attempt(content, afterConstruct)
        ),
        'linePrefix'
      )
    )
  );
  return initial

  /** @type {State} */
  function atBlankEnding(code) {
    if (code === null) {
      effects.consume(code);
      return
    }
    effects.enter('lineEndingBlank');
    effects.consume(code);
    effects.exit('lineEndingBlank');
    self.currentConstruct = undefined;
    return initial
  }

  /** @type {State} */
  function afterConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return
    }
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    self.currentConstruct = undefined;
    return initial
  }
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

const resolver = {
  resolveAll: createResolver()
};
const string$1 = initializeFactory('string');
const text$2 = initializeFactory('text');

/**
 * @param {'string' | 'text'} field
 * @returns {InitialConstruct}
 */
function initializeFactory(field) {
  return {
    tokenize: initializeText,
    resolveAll: createResolver(
      field === 'text' ? resolveAllLineSuffixes : undefined
    )
  }

  /**
   * @this {TokenizeContext}
   * @type {Initializer}
   */
  function initializeText(effects) {
    const self = this;
    const constructs = this.parser.constructs[field];
    const text = effects.attempt(constructs, start, notText);
    return start

    /** @type {State} */
    function start(code) {
      return atBreak(code) ? text(code) : notText(code)
    }

    /** @type {State} */
    function notText(code) {
      if (code === null) {
        effects.consume(code);
        return
      }
      effects.enter('data');
      effects.consume(code);
      return data
    }

    /** @type {State} */
    function data(code) {
      if (atBreak(code)) {
        effects.exit('data');
        return text(code)
      }

      // Data.
      effects.consume(code);
      return data
    }

    /**
     * @param {Code} code
     * @returns {boolean}
     */
    function atBreak(code) {
      if (code === null) {
        return true
      }
      const list = constructs[code];
      let index = -1;
      if (list) {
        // Always populated by defaults.

        while (++index < list.length) {
          const item = list[index];
          if (!item.previous || item.previous.call(self, self.previous)) {
            return true
          }
        }
      }
      return false
    }
  }
}

/**
 * @param {Resolver | undefined} [extraResolver]
 * @returns {Resolver}
 */
function createResolver(extraResolver) {
  return resolveAllText

  /** @type {Resolver} */
  function resolveAllText(events, context) {
    let index = -1;
    /** @type {number | undefined} */
    let enter;

    // A rather boring computation (to merge adjacent `data` events) which
    // improves mm performance by 29%.
    while (++index <= events.length) {
      if (enter === undefined) {
        if (events[index] && events[index][1].type === 'data') {
          enter = index;
          index++;
        }
      } else if (!events[index] || events[index][1].type !== 'data') {
        // Don’t do anything if there is one data token.
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end;
          events.splice(enter + 2, index - enter - 2);
          index = enter + 2;
        }
        enter = undefined;
      }
    }
    return extraResolver ? extraResolver(events, context) : events
  }
}

/**
 * A rather ugly set of instructions which again looks at chunks in the input
 * stream.
 * The reason to do this here is that it is *much* faster to parse in reverse.
 * And that we can’t hook into `null` to split the line suffix before an EOF.
 * To do: figure out if we can make this into a clean utility, or even in core.
 * As it will be useful for GFMs literal autolink extension (and maybe even
 * tables?)
 *
 * @type {Resolver}
 */
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0; // Skip first.

  while (++eventIndex <= events.length) {
    if (
      (eventIndex === events.length ||
        events[eventIndex][1].type === 'lineEnding') &&
      events[eventIndex - 1][1].type === 'data'
    ) {
      const data = events[eventIndex - 1][1];
      const chunks = context.sliceStream(data);
      let index = chunks.length;
      let bufferIndex = -1;
      let size = 0;
      /** @type {boolean | undefined} */
      let tabs;
      while (index--) {
        const chunk = chunks[index];
        if (typeof chunk === 'string') {
          bufferIndex = chunk.length;
          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++;
            bufferIndex--;
          }
          if (bufferIndex) break
          bufferIndex = -1;
        }
        // Number
        else if (chunk === -2) {
          tabs = true;
          size++;
        } else if (chunk === -1) ; else {
          // Replacement character, exit.
          index++;
          break
        }
      }
      if (size) {
        const token = {
          type:
            eventIndex === events.length || tabs || size < 2
              ? 'lineSuffix'
              : 'hardBreakTrailing',
          start: {
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size,
            _index: data.start._index + index,
            _bufferIndex: index
              ? bufferIndex
              : data.start._bufferIndex + bufferIndex
          },
          end: Object.assign({}, data.end)
        };
        data.end = Object.assign({}, token.start);
        if (data.start.offset === data.end.offset) {
          Object.assign(data, token);
        } else {
          events.splice(
            eventIndex,
            0,
            ['enter', token, context],
            ['exit', token, context]
          );
          eventIndex += 2;
        }
      }
      eventIndex++;
    }
  }
  return events
}

/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ConstructRecord} ConstructRecord
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').ParseContext} ParseContext
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenType} TokenType
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/**
 * Create a tokenizer.
 * Tokenizers deal with one type of data (e.g., containers, flow, text).
 * The parser is the object dealing with it all.
 * `initialize` works like other constructs, except that only its `tokenize`
 * function is used, in which case it doesn’t receive an `ok` or `nok`.
 * `from` can be given to set the point before the first character, although
 * when further lines are indented, they must be set with `defineSkip`.
 *
 * @param {ParseContext} parser
 * @param {InitialConstruct} initialize
 * @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
 * @returns {TokenizeContext}
 */
function createTokenizer(parser, initialize, from) {
  /** @type {Point} */
  let point = Object.assign(
    from
      ? Object.assign({}, from)
      : {
          line: 1,
          column: 1,
          offset: 0
        },
    {
      _index: 0,
      _bufferIndex: -1
    }
  );
  /** @type {Record<string, number>} */
  const columnStart = {};
  /** @type {Array<Construct>} */
  const resolveAllConstructs = [];
  /** @type {Array<Chunk>} */
  let chunks = [];
  /** @type {Array<Token>} */
  let stack = [];

  /**
   * Tools used for tokenizing.
   *
   * @type {Effects}
   */
  const effects = {
    consume,
    enter,
    exit,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    })
  };

  /**
   * State and tools for resolving and serializing.
   *
   * @type {TokenizeContext}
   */
  const context = {
    previous: null,
    code: null,
    containerState: {},
    events: [],
    parser,
    sliceStream,
    sliceSerialize,
    now,
    defineSkip,
    write
  };

  /**
   * The state function.
   *
   * @type {State | undefined}
   */
  let state = initialize.tokenize.call(context, effects);
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  return context

  /** @type {TokenizeContext['write']} */
  function write(slice) {
    chunks = push(chunks, slice);
    main();

    // Exit if we’re not done, resolve might change stuff.
    if (chunks[chunks.length - 1] !== null) {
      return []
    }
    addResult(initialize, 0);

    // Otherwise, resolve, and exit.
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events
  }

  //
  // Tools.
  //

  /** @type {TokenizeContext['sliceSerialize']} */
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs)
  }

  /** @type {TokenizeContext['sliceStream']} */
  function sliceStream(token) {
    return sliceChunks(chunks, token)
  }

  /** @type {TokenizeContext['now']} */
  function now() {
    // This is a hot path, so we clone manually instead of `Object.assign({}, point)`
    const {line, column, offset, _index, _bufferIndex} = point;
    return {
      line,
      column,
      offset,
      _index,
      _bufferIndex
    }
  }

  /** @type {TokenizeContext['defineSkip']} */
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }

  //
  // State management.
  //

  /**
   * Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
   * `consume`).
   * Here is where we walk through the chunks, which either include strings of
   * several characters, or numerical character codes.
   * The reason to do this in a loop instead of a call is so the stack can
   * drain.
   *
   * @returns {undefined}
   */
  function main() {
    /** @type {number} */
    let chunkIndex;
    while (point._index < chunks.length) {
      const chunk = chunks[point._index];

      // If we’re in a buffer chunk, loop through it.
      if (typeof chunk === 'string') {
        chunkIndex = point._index;
        if (point._bufferIndex < 0) {
          point._bufferIndex = 0;
        }
        while (
          point._index === chunkIndex &&
          point._bufferIndex < chunk.length
        ) {
          go(chunk.charCodeAt(point._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }

  /**
   * Deal with one code.
   *
   * @param {Code} code
   * @returns {undefined}
   */
  function go(code) {
    state = state(code);
  }

  /** @type {Effects['consume']} */
  function consume(code) {
    if (markdownLineEnding(code)) {
      point.line++;
      point.column = 1;
      point.offset += code === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code !== -1) {
      point.column++;
      point.offset++;
    }

    // Not in a string chunk.
    if (point._bufferIndex < 0) {
      point._index++;
    } else {
      point._bufferIndex++;

      // At end of string chunk.
      // @ts-expect-error Points w/ non-negative `_bufferIndex` reference
      // strings.
      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1;
        point._index++;
      }
    }

    // Expose the previous character.
    context.previous = code;
  }

  /** @type {Effects['enter']} */
  function enter(type, fields) {
    /** @type {Token} */
    // @ts-expect-error Patch instead of assign required fields to help GC.
    const token = fields || {};
    token.type = type;
    token.start = now();
    context.events.push(['enter', token, context]);
    stack.push(token);
    return token
  }

  /** @type {Effects['exit']} */
  function exit(type) {
    const token = stack.pop();
    token.end = now();
    context.events.push(['exit', token, context]);
    return token
  }

  /**
   * Use results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }

  /**
   * Discard results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulcheck(_, info) {
    info.restore();
  }

  /**
   * Factory to attempt/check/interrupt.
   *
   * @param {ReturnHandle} onreturn
   * @param {{interrupt?: boolean | undefined} | undefined} [fields]
   */
  function constructFactory(onreturn, fields) {
    return hook

    /**
     * Handle either an object mapping codes to constructs, a list of
     * constructs, or a single construct.
     *
     * @param {Array<Construct> | Construct | ConstructRecord} constructs
     * @param {State} returnState
     * @param {State | undefined} [bogusState]
     * @returns {State}
     */
    function hook(constructs, returnState, bogusState) {
      /** @type {Array<Construct>} */
      let listOfConstructs;
      /** @type {number} */
      let constructIndex;
      /** @type {Construct} */
      let currentConstruct;
      /** @type {Info} */
      let info;
      return Array.isArray(constructs) /* c8 ignore next 1 */
        ? handleListOfConstructs(constructs)
        : 'tokenize' in constructs
        ? // @ts-expect-error Looks like a construct.
          handleListOfConstructs([constructs])
        : handleMapOfConstructs(constructs)

      /**
       * Handle a list of construct.
       *
       * @param {ConstructRecord} map
       * @returns {State}
       */
      function handleMapOfConstructs(map) {
        return start

        /** @type {State} */
        function start(code) {
          const def = code !== null && map[code];
          const all = code !== null && map.null;
          const list = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...(Array.isArray(def) ? def : def ? [def] : []),
            ...(Array.isArray(all) ? all : all ? [all] : [])
          ];
          return handleListOfConstructs(list)(code)
        }
      }

      /**
       * Handle a list of construct.
       *
       * @param {Array<Construct>} list
       * @returns {State}
       */
      function handleListOfConstructs(list) {
        listOfConstructs = list;
        constructIndex = 0;
        if (list.length === 0) {
          return bogusState
        }
        return handleConstruct(list[constructIndex])
      }

      /**
       * Handle a single construct.
       *
       * @param {Construct} construct
       * @returns {State}
       */
      function handleConstruct(construct) {
        return start

        /** @type {State} */
        function start(code) {
          // To do: not needed to store if there is no bogus state, probably?
          // Currently doesn’t work because `inspect` in document does a check
          // w/o a bogus, which doesn’t make sense. But it does seem to help perf
          // by not storing.
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }

          // Always populated by defaults.

          if (
            construct.name &&
            context.parser.constructs.disable.null.includes(construct.name)
          ) {
            return nok()
          }
          return construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok,
            nok
          )(code)
        }
      }

      /** @type {State} */
      function ok(code) {
        onreturn(currentConstruct, info);
        return returnState
      }

      /** @type {State} */
      function nok(code) {
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex])
        }
        return bogusState
      }
    }
  }

  /**
   * @param {Construct} construct
   * @param {number} from
   * @returns {undefined}
   */
  function addResult(construct, from) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      splice(
        context.events,
        from,
        context.events.length - from,
        construct.resolve(context.events.slice(from), context)
      );
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
  }

  /**
   * Store state.
   *
   * @returns {Info}
   */
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return {
      restore,
      from: startEventsIndex
    }

    /**
     * Restore state.
     *
     * @returns {undefined}
     */
    function restore() {
      point = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }

  /**
   * Move the current point a bit forward in the line when it’s on a column
   * skip.
   *
   * @returns {undefined}
   */
  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line];
      point.offset += columnStart[point.line] - 1;
    }
  }
}

/**
 * Get the chunks from a slice of chunks in the range of a token.
 *
 * @param {Array<Chunk>} chunks
 * @param {Pick<Token, 'end' | 'start'>} token
 * @returns {Array<Chunk>}
 */
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  /** @type {Array<Chunk>} */
  let view;
  if (startIndex === endIndex) {
    // @ts-expect-error `_bufferIndex` is used on string chunks.
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      const head = view[0];
      if (typeof head === 'string') {
        view[0] = head.slice(startBufferIndex);
      } else {
        view.shift();
      }
    }
    if (endBufferIndex > 0) {
      // @ts-expect-error `_bufferIndex` is used on string chunks.
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view
}

/**
 * Get the string value of a slice of chunks.
 *
 * @param {Array<Chunk>} chunks
 * @param {boolean | undefined} [expandTabs=false]
 * @returns {string}
 */
function serializeChunks(chunks, expandTabs) {
  let index = -1;
  /** @type {Array<string>} */
  const result = [];
  /** @type {boolean | undefined} */
  let atTab;
  while (++index < chunks.length) {
    const chunk = chunks[index];
    /** @type {string} */
    let value;
    if (typeof chunk === 'string') {
      value = chunk;
    } else
      switch (chunk) {
        case -5: {
          value = '\r';
          break
        }
        case -4: {
          value = '\n';
          break
        }
        case -3: {
          value = '\r' + '\n';
          break
        }
        case -2: {
          value = expandTabs ? ' ' : '\t';
          break
        }
        case -1: {
          if (!expandTabs && atTab) continue
          value = ' ';
          break
        }
        default: {
          // Currently only replacement character.
          value = String.fromCharCode(chunk);
        }
      }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join('')
}

/**
 * @typedef {import('micromark-util-types').Extension} Extension
 */


/** @satisfies {Extension['document']} */
const document$1 = {
  [42]: list,
  [43]: list,
  [45]: list,
  [48]: list,
  [49]: list,
  [50]: list,
  [51]: list,
  [52]: list,
  [53]: list,
  [54]: list,
  [55]: list,
  [56]: list,
  [57]: list,
  [62]: blockQuote
};

/** @satisfies {Extension['contentInitial']} */
const contentInitial = {
  [91]: definition
};

/** @satisfies {Extension['flowInitial']} */
const flowInitial = {
  [-2]: codeIndented,
  [-1]: codeIndented,
  [32]: codeIndented
};

/** @satisfies {Extension['flow']} */
const flow = {
  [35]: headingAtx,
  [42]: thematicBreak,
  [45]: [setextUnderline, thematicBreak],
  [60]: htmlFlow,
  [61]: setextUnderline,
  [95]: thematicBreak,
  [96]: codeFenced,
  [126]: codeFenced
};

/** @satisfies {Extension['string']} */
const string = {
  [38]: characterReference,
  [92]: characterEscape
};

/** @satisfies {Extension['text']} */
const text$1 = {
  [-5]: lineEnding,
  [-4]: lineEnding,
  [-3]: lineEnding,
  [33]: labelStartImage,
  [38]: characterReference,
  [42]: attention,
  [60]: [autolink, htmlText],
  [91]: labelStartLink,
  [92]: [hardBreakEscape, characterEscape],
  [93]: labelEnd,
  [95]: attention,
  [96]: codeText
};

/** @satisfies {Extension['insideSpan']} */
const insideSpan = {
  null: [attention, resolver]
};

/** @satisfies {Extension['attentionMarkers']} */
const attentionMarkers = {
  null: [42, 95]
};

/** @satisfies {Extension['disable']} */
const disable = {
  null: []
};

var defaultConstructs = /*#__PURE__*/Object.freeze({
	__proto__: null,
	attentionMarkers: attentionMarkers,
	contentInitial: contentInitial,
	disable: disable,
	document: document$1,
	flow: flow,
	flowInitial: flowInitial,
	insideSpan: insideSpan,
	string: string,
	text: text$1
});

/**
 * @typedef {import('micromark-util-types').Create} Create
 * @typedef {import('micromark-util-types').FullNormalizedExtension} FullNormalizedExtension
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').ParseContext} ParseContext
 * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
 */


/**
 * @param {ParseOptions | null | undefined} [options]
 * @returns {ParseContext}
 */
function parse(options) {
  const settings = options || {};
  const constructs =
    /** @type {FullNormalizedExtension} */
    combineExtensions([defaultConstructs, ...(settings.extensions || [])]);

  /** @type {ParseContext} */
  const parser = {
    defined: [],
    lazy: {},
    constructs,
    content: create(content$1),
    document: create(document$2),
    flow: create(flow$1),
    string: create(string$1),
    text: create(text$2)
  };
  return parser

  /**
   * @param {InitialConstruct} initial
   */
  function create(initial) {
    return creator
    /** @type {Create} */
    function creator(from) {
      return createTokenizer(parser, initial, from)
    }
  }
}

/**
 * @typedef {import('micromark-util-types').Event} Event
 */


/**
 * @param {Array<Event>} events
 * @returns {Array<Event>}
 */
function postprocess(events) {
  while (!subtokenize(events)) {
    // Empty
  }
  return events
}

/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Value} Value
 */

/**
 * @callback Preprocessor
 * @param {Value} value
 * @param {Encoding | null | undefined} [encoding]
 * @param {boolean | null | undefined} [end=false]
 * @returns {Array<Chunk>}
 */

const search = /[\0\t\n\r]/g;

/**
 * @returns {Preprocessor}
 */
function preprocess() {
  let column = 1;
  let buffer = '';
  /** @type {boolean | undefined} */
  let start = true;
  /** @type {boolean | undefined} */
  let atCarriageReturn;
  return preprocessor

  /** @type {Preprocessor} */
  // eslint-disable-next-line complexity
  function preprocessor(value, encoding, end) {
    /** @type {Array<Chunk>} */
    const chunks = [];
    /** @type {RegExpMatchArray | null} */
    let match;
    /** @type {number} */
    let next;
    /** @type {number} */
    let startPosition;
    /** @type {number} */
    let endPosition;
    /** @type {Code} */
    let code;
    value =
      buffer +
      (typeof value === 'string'
        ? value.toString()
        : new TextDecoder(encoding || undefined).decode(value));
    startPosition = 0;
    buffer = '';
    if (start) {
      // To do: `markdown-rs` actually parses BOMs (byte order mark).
      if (value.charCodeAt(0) === 65279) {
        startPosition++;
      }
      start = undefined;
    }
    while (startPosition < value.length) {
      search.lastIndex = startPosition;
      match = search.exec(value);
      endPosition =
        match && match.index !== undefined ? match.index : value.length;
      code = value.charCodeAt(endPosition);
      if (!match) {
        buffer = value.slice(startPosition);
        break
      }
      if (code === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3);
        atCarriageReturn = undefined;
      } else {
        if (atCarriageReturn) {
          chunks.push(-5);
          atCarriageReturn = undefined;
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }
        switch (code) {
          case 0: {
            chunks.push(65533);
            column++;
            break
          }
          case 9: {
            next = Math.ceil(column / 4) * 4;
            chunks.push(-2);
            while (column++ < next) chunks.push(-1);
            break
          }
          case 10: {
            chunks.push(-4);
            column = 1;
            break
          }
          default: {
            atCarriageReturn = true;
            column = 1;
          }
        }
      }
      startPosition = endPosition + 1;
    }
    if (end) {
      if (atCarriageReturn) chunks.push(-5);
      if (buffer) chunks.push(buffer);
      chunks.push(null);
    }
    return chunks
  }
}

/**
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Options} Options
 * @typedef {import('micromark-util-types').Value} Value
 */


/**
 * Compile markdown to HTML.
 *
 * > Note: which encodings are supported depends on the engine.
 * > For info on Node.js, see:
 * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
 *
 * @overload
 * @param {Value} value
 *   Markdown to parse (`string` or `Uint8Array`).
 * @param {Encoding | null | undefined} encoding
 *   Character encoding to understand `value` as when it’s a `Uint8Array`
 *   (`string`, default: `'utf8'`).
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Compiled HTML.
 *
 * @overload
 * @param {Value} value
 *   Markdown to parse (`string` or `Uint8Array`).
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Compiled HTML.
 *
 * @param {Value} value
 *   Markdown to parse (`string` or `Uint8Array`).
 * @param {Encoding | Options | null | undefined} [encoding]
 *   Character encoding to understand `value` as when it’s a `Uint8Array`
 *   (`string`, default: `'utf8'`).
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Compiled HTML.
 */
function micromark(value, encoding, options) {
  if (typeof encoding !== 'string') {
    options = encoding;
    encoding = undefined;
  }
  return compile(options)(
    postprocess(
      parse(options).document().write(preprocess()(value, encoding, true))
    )
  )
}

/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').ConstructRecord} ConstructRecord
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Previous} Previous
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

const wwwPrefix = {
  tokenize: tokenizeWwwPrefix,
  partial: true
};
const domain = {
  tokenize: tokenizeDomain,
  partial: true
};
const path = {
  tokenize: tokenizePath,
  partial: true
};
const trail = {
  tokenize: tokenizeTrail,
  partial: true
};
const emailDomainDotTrail = {
  tokenize: tokenizeEmailDomainDotTrail,
  partial: true
};
const wwwAutolink = {
  tokenize: tokenizeWwwAutolink,
  previous: previousWww
};
const protocolAutolink = {
  tokenize: tokenizeProtocolAutolink,
  previous: previousProtocol
};
const emailAutolink = {
  tokenize: tokenizeEmailAutolink,
  previous: previousEmail
};

/** @type {ConstructRecord} */
const text = {};

/**
 * Create an extension for `micromark` to support GitHub autolink literal
 * syntax.
 *
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions` to enable GFM
 *   autolink literal syntax.
 */
function gfmAutolinkLiteral() {
  return {
    text
  }
}

/** @type {Code} */
let code = 48;

// Add alphanumerics.
while (code < 123) {
  text[code] = emailAutolink;
  code++;
  if (code === 58) code = 65;
  else if (code === 91) code = 97;
}
text[43] = emailAutolink;
text[45] = emailAutolink;
text[46] = emailAutolink;
text[95] = emailAutolink;
text[72] = [emailAutolink, protocolAutolink];
text[104] = [emailAutolink, protocolAutolink];
text[87] = [emailAutolink, wwwAutolink];
text[119] = [emailAutolink, wwwAutolink];

// To do: perform email autolink literals on events, afterwards.
// That’s where `markdown-rs` and `cmark-gfm` perform it.
// It should look for `@`, then for atext backwards, and then for a label
// forwards.
// To do: `mailto:`, `xmpp:` protocol as prefix.

/**
 * Email autolink literal.
 *
 * ```markdown
 * > | a contact@example.org b
 *       ^^^^^^^^^^^^^^^^^^^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeEmailAutolink(effects, ok, nok) {
  const self = this;
  /** @type {boolean | undefined} */
  let dot;
  /** @type {boolean} */
  let data;
  return start

  /**
   * Start of email autolink literal.
   *
   * ```markdown
   * > | a contact@example.org b
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (
      !gfmAtext(code) ||
      !previousEmail.call(self, self.previous) ||
      previousUnbalanced(self.events)
    ) {
      return nok(code)
    }
    effects.enter('literalAutolink');
    effects.enter('literalAutolinkEmail');
    return atext(code)
  }

  /**
   * In email atext.
   *
   * ```markdown
   * > | a contact@example.org b
   *       ^
   * ```
   *
   * @type {State}
   */
  function atext(code) {
    if (gfmAtext(code)) {
      effects.consume(code);
      return atext
    }
    if (code === 64) {
      effects.consume(code);
      return emailDomain
    }
    return nok(code)
  }

  /**
   * In email domain.
   *
   * The reference code is a bit overly complex as it handles the `@`, of which
   * there may be just one.
   * Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L318>
   *
   * ```markdown
   * > | a contact@example.org b
   *               ^
   * ```
   *
   * @type {State}
   */
  function emailDomain(code) {
    // Dot followed by alphanumerical (not `-` or `_`).
    if (code === 46) {
      return effects.check(
        emailDomainDotTrail,
        emailDomainAfter,
        emailDomainDot
      )(code)
    }

    // Alphanumerical, `-`, and `_`.
    if (code === 45 || code === 95 || asciiAlphanumeric(code)) {
      data = true;
      effects.consume(code);
      return emailDomain
    }

    // To do: `/` if xmpp.

    // Note: normally we’d truncate trailing punctuation from the link.
    // However, email autolink literals cannot contain any of those markers,
    // except for `.`, but that can only occur if it isn’t trailing.
    // So we can ignore truncating!
    return emailDomainAfter(code)
  }

  /**
   * In email domain, on dot that is not a trail.
   *
   * ```markdown
   * > | a contact@example.org b
   *                      ^
   * ```
   *
   * @type {State}
   */
  function emailDomainDot(code) {
    effects.consume(code);
    dot = true;
    return emailDomain
  }

  /**
   * After email domain.
   *
   * ```markdown
   * > | a contact@example.org b
   *                          ^
   * ```
   *
   * @type {State}
   */
  function emailDomainAfter(code) {
    // Domain must not be empty, must include a dot, and must end in alphabetical.
    // Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L332>.
    if (data && dot && asciiAlpha(self.previous)) {
      effects.exit('literalAutolinkEmail');
      effects.exit('literalAutolink');
      return ok(code)
    }
    return nok(code)
  }
}

/**
 * `www` autolink literal.
 *
 * ```markdown
 * > | a www.example.org b
 *       ^^^^^^^^^^^^^^^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeWwwAutolink(effects, ok, nok) {
  const self = this;
  return wwwStart

  /**
   * Start of www autolink literal.
   *
   * ```markdown
   * > | www.example.com/a?b#c
   *     ^
   * ```
   *
   * @type {State}
   */
  function wwwStart(code) {
    if (
      (code !== 87 && code !== 119) ||
      !previousWww.call(self, self.previous) ||
      previousUnbalanced(self.events)
    ) {
      return nok(code)
    }
    effects.enter('literalAutolink');
    effects.enter('literalAutolinkWww');
    // Note: we *check*, so we can discard the `www.` we parsed.
    // If it worked, we consider it as a part of the domain.
    return effects.check(
      wwwPrefix,
      effects.attempt(domain, effects.attempt(path, wwwAfter), nok),
      nok
    )(code)
  }

  /**
   * After a www autolink literal.
   *
   * ```markdown
   * > | www.example.com/a?b#c
   *                          ^
   * ```
   *
   * @type {State}
   */
  function wwwAfter(code) {
    effects.exit('literalAutolinkWww');
    effects.exit('literalAutolink');
    return ok(code)
  }
}

/**
 * Protocol autolink literal.
 *
 * ```markdown
 * > | a https://example.org b
 *       ^^^^^^^^^^^^^^^^^^^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeProtocolAutolink(effects, ok, nok) {
  const self = this;
  let buffer = '';
  let seen = false;
  return protocolStart

  /**
   * Start of protocol autolink literal.
   *
   * ```markdown
   * > | https://example.com/a?b#c
   *     ^
   * ```
   *
   * @type {State}
   */
  function protocolStart(code) {
    if (
      (code === 72 || code === 104) &&
      previousProtocol.call(self, self.previous) &&
      !previousUnbalanced(self.events)
    ) {
      effects.enter('literalAutolink');
      effects.enter('literalAutolinkHttp');
      buffer += String.fromCodePoint(code);
      effects.consume(code);
      return protocolPrefixInside
    }
    return nok(code)
  }

  /**
   * In protocol.
   *
   * ```markdown
   * > | https://example.com/a?b#c
   *     ^^^^^
   * ```
   *
   * @type {State}
   */
  function protocolPrefixInside(code) {
    // `5` is size of `https`
    if (asciiAlpha(code) && buffer.length < 5) {
      // @ts-expect-error: definitely number.
      buffer += String.fromCodePoint(code);
      effects.consume(code);
      return protocolPrefixInside
    }
    if (code === 58) {
      const protocol = buffer.toLowerCase();
      if (protocol === 'http' || protocol === 'https') {
        effects.consume(code);
        return protocolSlashesInside
      }
    }
    return nok(code)
  }

  /**
   * In slashes.
   *
   * ```markdown
   * > | https://example.com/a?b#c
   *           ^^
   * ```
   *
   * @type {State}
   */
  function protocolSlashesInside(code) {
    if (code === 47) {
      effects.consume(code);
      if (seen) {
        return afterProtocol
      }
      seen = true;
      return protocolSlashesInside
    }
    return nok(code)
  }

  /**
   * After protocol, before domain.
   *
   * ```markdown
   * > | https://example.com/a?b#c
   *             ^
   * ```
   *
   * @type {State}
   */
  function afterProtocol(code) {
    // To do: this is different from `markdown-rs`:
    // https://github.com/wooorm/markdown-rs/blob/b3a921c761309ae00a51fe348d8a43adbc54b518/src/construct/gfm_autolink_literal.rs#L172-L182
    return code === null ||
      asciiControl(code) ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code) ||
      unicodePunctuation(code)
      ? nok(code)
      : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code)
  }

  /**
   * After a protocol autolink literal.
   *
   * ```markdown
   * > | https://example.com/a?b#c
   *                              ^
   * ```
   *
   * @type {State}
   */
  function protocolAfter(code) {
    effects.exit('literalAutolinkHttp');
    effects.exit('literalAutolink');
    return ok(code)
  }
}

/**
 * `www` prefix.
 *
 * ```markdown
 * > | a www.example.org b
 *       ^^^^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeWwwPrefix(effects, ok, nok) {
  let size = 0;
  return wwwPrefixInside

  /**
   * In www prefix.
   *
   * ```markdown
   * > | www.example.com
   *     ^^^^
   * ```
   *
   * @type {State}
   */
  function wwwPrefixInside(code) {
    if ((code === 87 || code === 119) && size < 3) {
      size++;
      effects.consume(code);
      return wwwPrefixInside
    }
    if (code === 46 && size === 3) {
      effects.consume(code);
      return wwwPrefixAfter
    }
    return nok(code)
  }

  /**
   * After www prefix.
   *
   * ```markdown
   * > | www.example.com
   *         ^
   * ```
   *
   * @type {State}
   */
  function wwwPrefixAfter(code) {
    // If there is *anything*, we can link.
    return code === null ? nok(code) : ok(code)
  }
}

/**
 * Domain.
 *
 * ```markdown
 * > | a https://example.org b
 *               ^^^^^^^^^^^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeDomain(effects, ok, nok) {
  /** @type {boolean | undefined} */
  let underscoreInLastSegment;
  /** @type {boolean | undefined} */
  let underscoreInLastLastSegment;
  /** @type {boolean | undefined} */
  let seen;
  return domainInside

  /**
   * In domain.
   *
   * ```markdown
   * > | https://example.com/a
   *             ^^^^^^^^^^^
   * ```
   *
   * @type {State}
   */
  function domainInside(code) {
    // Check whether this marker, which is a trailing punctuation
    // marker, optionally followed by more trailing markers, and then
    // followed by an end.
    if (code === 46 || code === 95) {
      return effects.check(trail, domainAfter, domainAtPunctuation)(code)
    }

    // GH documents that only alphanumerics (other than `-`, `.`, and `_`) can
    // occur, which sounds like ASCII only, but they also support `www.點看.com`,
    // so that’s Unicode.
    // Instead of some new production for Unicode alphanumerics, markdown
    // already has that for Unicode punctuation and whitespace, so use those.
    // Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L12>.
    if (
      code === null ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code) ||
      (code !== 45 && unicodePunctuation(code))
    ) {
      return domainAfter(code)
    }
    seen = true;
    effects.consume(code);
    return domainInside
  }

  /**
   * In domain, at potential trailing punctuation, that was not trailing.
   *
   * ```markdown
   * > | https://example.com
   *                    ^
   * ```
   *
   * @type {State}
   */
  function domainAtPunctuation(code) {
    // There is an underscore in the last segment of the domain
    if (code === 95) {
      underscoreInLastSegment = true;
    }
    // Otherwise, it’s a `.`: save the last segment underscore in the
    // penultimate segment slot.
    else {
      underscoreInLastLastSegment = underscoreInLastSegment;
      underscoreInLastSegment = undefined;
    }
    effects.consume(code);
    return domainInside
  }

  /**
   * After domain.
   *
   * ```markdown
   * > | https://example.com/a
   *                        ^
   * ```
   *
   * @type {State} */
  function domainAfter(code) {
    // Note: that’s GH says a dot is needed, but it’s not true:
    // <https://github.com/github/cmark-gfm/issues/279>
    if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) {
      return nok(code)
    }
    return ok(code)
  }
}

/**
 * Path.
 *
 * ```markdown
 * > | a https://example.org/stuff b
 *                          ^^^^^^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizePath(effects, ok) {
  let sizeOpen = 0;
  let sizeClose = 0;
  return pathInside

  /**
   * In path.
   *
   * ```markdown
   * > | https://example.com/a
   *                        ^^
   * ```
   *
   * @type {State}
   */
  function pathInside(code) {
    if (code === 40) {
      sizeOpen++;
      effects.consume(code);
      return pathInside
    }

    // To do: `markdown-rs` also needs this.
    // If this is a paren, and there are less closings than openings,
    // we don’t check for a trail.
    if (code === 41 && sizeClose < sizeOpen) {
      return pathAtPunctuation(code)
    }

    // Check whether this trailing punctuation marker is optionally
    // followed by more trailing markers, and then followed
    // by an end.
    if (
      code === 33 ||
      code === 34 ||
      code === 38 ||
      code === 39 ||
      code === 41 ||
      code === 42 ||
      code === 44 ||
      code === 46 ||
      code === 58 ||
      code === 59 ||
      code === 60 ||
      code === 63 ||
      code === 93 ||
      code === 95 ||
      code === 126
    ) {
      return effects.check(trail, ok, pathAtPunctuation)(code)
    }
    if (
      code === null ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code)
    ) {
      return ok(code)
    }
    effects.consume(code);
    return pathInside
  }

  /**
   * In path, at potential trailing punctuation, that was not trailing.
   *
   * ```markdown
   * > | https://example.com/a"b
   *                          ^
   * ```
   *
   * @type {State}
   */
  function pathAtPunctuation(code) {
    // Count closing parens.
    if (code === 41) {
      sizeClose++;
    }
    effects.consume(code);
    return pathInside
  }
}

/**
 * Trail.
 *
 * This calls `ok` if this *is* the trail, followed by an end, which means
 * the entire trail is not part of the link.
 * It calls `nok` if this *is* part of the link.
 *
 * ```markdown
 * > | https://example.com").
 *                        ^^^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeTrail(effects, ok, nok) {
  return trail

  /**
   * In trail of domain or path.
   *
   * ```markdown
   * > | https://example.com").
   *                        ^
   * ```
   *
   * @type {State}
   */
  function trail(code) {
    // Regular trailing punctuation.
    if (
      code === 33 ||
      code === 34 ||
      code === 39 ||
      code === 41 ||
      code === 42 ||
      code === 44 ||
      code === 46 ||
      code === 58 ||
      code === 59 ||
      code === 63 ||
      code === 95 ||
      code === 126
    ) {
      effects.consume(code);
      return trail
    }

    // `&` followed by one or more alphabeticals and then a `;`, is
    // as a whole considered as trailing punctuation.
    // In all other cases, it is considered as continuation of the URL.
    if (code === 38) {
      effects.consume(code);
      return trailCharRefStart
    }

    // Needed because we allow literals after `[`, as we fix:
    // <https://github.com/github/cmark-gfm/issues/278>.
    // Check that it is not followed by `(` or `[`.
    if (code === 93) {
      effects.consume(code);
      return trailBracketAfter
    }
    if (
      // `<` is an end.
      code === 60 ||
      // So is whitespace.
      code === null ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code)
    ) {
      return ok(code)
    }
    return nok(code)
  }

  /**
   * In trail, after `]`.
   *
   * > 👉 **Note**: this deviates from `cmark-gfm` to fix a bug.
   * > See end of <https://github.com/github/cmark-gfm/issues/278> for more.
   *
   * ```markdown
   * > | https://example.com](
   *                         ^
   * ```
   *
   * @type {State}
   */
  function trailBracketAfter(code) {
    // Whitespace or something that could start a resource or reference is the end.
    // Switch back to trail otherwise.
    if (
      code === null ||
      code === 40 ||
      code === 91 ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code)
    ) {
      return ok(code)
    }
    return trail(code)
  }

  /**
   * In character-reference like trail, after `&`.
   *
   * ```markdown
   * > | https://example.com&amp;).
   *                         ^
   * ```
   *
   * @type {State}
   */
  function trailCharRefStart(code) {
    // When non-alpha, it’s not a trail.
    return asciiAlpha(code) ? trailCharRefInside(code) : nok(code)
  }

  /**
   * In character-reference like trail.
   *
   * ```markdown
   * > | https://example.com&amp;).
   *                         ^
   * ```
   *
   * @type {State}
   */
  function trailCharRefInside(code) {
    // Switch back to trail if this is well-formed.
    if (code === 59) {
      effects.consume(code);
      return trail
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      return trailCharRefInside
    }

    // It’s not a trail.
    return nok(code)
  }
}

/**
 * Dot in email domain trail.
 *
 * This calls `ok` if this *is* the trail, followed by an end, which means
 * the trail is not part of the link.
 * It calls `nok` if this *is* part of the link.
 *
 * ```markdown
 * > | contact@example.org.
 *                        ^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeEmailDomainDotTrail(effects, ok, nok) {
  return start

  /**
   * Dot.
   *
   * ```markdown
   * > | contact@example.org.
   *                    ^   ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // Must be dot.
    effects.consume(code);
    return after
  }

  /**
   * After dot.
   *
   * ```markdown
   * > | contact@example.org.
   *                     ^   ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // Not a trail if alphanumeric.
    return asciiAlphanumeric(code) ? nok(code) : ok(code)
  }
}

/**
 * See:
 * <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L156>.
 *
 * @type {Previous}
 */
function previousWww(code) {
  return (
    code === null ||
    code === 40 ||
    code === 42 ||
    code === 95 ||
    code === 91 ||
    code === 93 ||
    code === 126 ||
    markdownLineEndingOrSpace(code)
  )
}

/**
 * See:
 * <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L214>.
 *
 * @type {Previous}
 */
function previousProtocol(code) {
  return !asciiAlpha(code)
}

/**
 * @this {TokenizeContext}
 * @type {Previous}
 */
function previousEmail(code) {
  // Do not allow a slash “inside” atext.
  // The reference code is a bit weird, but that’s what it results in.
  // Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L307>.
  // Other than slash, every preceding character is allowed.
  return !(code === 47 || gfmAtext(code))
}

/**
 * @param {Code} code
 * @returns {boolean}
 */
function gfmAtext(code) {
  return (
    code === 43 ||
    code === 45 ||
    code === 46 ||
    code === 95 ||
    asciiAlphanumeric(code)
  )
}

/**
 * @param {Array<Event>} events
 * @returns {boolean}
 */
function previousUnbalanced(events) {
  let index = events.length;
  let result = false;
  while (index--) {
    const token = events[index][1];
    if (
      (token.type === 'labelLink' || token.type === 'labelImage') &&
      !token._balanced
    ) {
      result = true;
      break
    }

    // If we’ve seen this token, and it was marked as not having any unbalanced
    // bracket before it, we can exit.
    if (token._gfmAutolinkLiteralWalkedInto) {
      result = false;
      break
    }
  }
  if (events.length > 0 && !result) {
    // Mark the last token as “walked into” w/o finding
    // anything.
    events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
  }
  return result
}

/**
 * @typedef {import('micromark-util-types').CompileContext} CompileContext
 * @typedef {import('micromark-util-types').Handle} Handle
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').Token} Token
 */


/**
 * Create an HTML extension for `micromark` to support GitHub autolink literal
 * when serializing to HTML.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support GitHub autolink literal when serializing to HTML.
 */
function gfmAutolinkLiteralHtml() {
  return {
    exit: {
      literalAutolinkEmail,
      literalAutolinkHttp,
      literalAutolinkWww
    }
  }
}

/**
 * @this {CompileContext}
 * @type {Handle}
 */
function literalAutolinkWww(token) {
  anchorFromToken.call(this, token, 'http://');
}

/**
 * @this {CompileContext}
 * @type {Handle}
 */
function literalAutolinkEmail(token) {
  anchorFromToken.call(this, token, 'mailto:');
}

/**
 * @this {CompileContext}
 * @type {Handle}
 */
function literalAutolinkHttp(token) {
  anchorFromToken.call(this, token);
}

/**
 * @this CompileContext
 * @param {Token} token
 * @param {string | null | undefined} [protocol]
 * @returns {undefined}
 */
function anchorFromToken(token, protocol) {
  const url = this.sliceSerialize(token);
  this.tag('<a href="' + sanitizeUri((protocol || '') + url) + '">');
  this.raw(this.encode(url));
  this.tag('</a>');
}

/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

const indent = {
  tokenize: tokenizeIndent,
  partial: true
};

// To do: micromark should support a `_hiddenGfmFootnoteSupport`, which only
// affects label start (image).
// That will let us drop `tokenizePotentialGfmFootnote*`.
// It currently has a `_hiddenFootnoteSupport`, which affects that and more.
// That can be removed when `micromark-extension-footnote` is archived.

/**
 * Create an extension for `micromark` to enable GFM footnote syntax.
 *
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions` to
 *   enable GFM footnote syntax.
 */
function gfmFootnote() {
  /** @type {Extension} */
  return {
    document: {
      [91]: {
        tokenize: tokenizeDefinitionStart,
        continuation: {
          tokenize: tokenizeDefinitionContinuation
        },
        exit: gfmFootnoteDefinitionEnd
      }
    },
    text: {
      [91]: {
        tokenize: tokenizeGfmFootnoteCall
      },
      [93]: {
        add: 'after',
        tokenize: tokenizePotentialGfmFootnoteCall,
        resolveTo: resolveToPotentialGfmFootnoteCall
      }
    }
  }
}

// To do: remove after micromark update.
/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizePotentialGfmFootnoteCall(effects, ok, nok) {
  const self = this;
  let index = self.events.length;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  /** @type {Token} */
  let labelStart;

  // Find an opening.
  while (index--) {
    const token = self.events[index][1];
    if (token.type === 'labelImage') {
      labelStart = token;
      break
    }

    // Exit if we’ve walked far enough.
    if (
      token.type === 'gfmFootnoteCall' ||
      token.type === 'labelLink' ||
      token.type === 'label' ||
      token.type === 'image' ||
      token.type === 'link'
    ) {
      break
    }
  }
  return start

  /**
   * @type {State}
   */
  function start(code) {
    if (!labelStart || !labelStart._balanced) {
      return nok(code)
    }
    const id = normalizeIdentifier(
      self.sliceSerialize({
        start: labelStart.end,
        end: self.now()
      })
    );
    if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) {
      return nok(code)
    }
    effects.enter('gfmFootnoteCallLabelMarker');
    effects.consume(code);
    effects.exit('gfmFootnoteCallLabelMarker');
    return ok(code)
  }
}

// To do: remove after micromark update.
/** @type {Resolver} */
function resolveToPotentialGfmFootnoteCall(events, context) {
  let index = events.length;

  // Find an opening.
  while (index--) {
    if (
      events[index][1].type === 'labelImage' &&
      events[index][0] === 'enter'
    ) {
      events[index][1];
      break
    }
  }
  // Change the `labelImageMarker` to a `data`.
  events[index + 1][1].type = 'data';
  events[index + 3][1].type = 'gfmFootnoteCallLabelMarker';

  // The whole (without `!`):
  /** @type {Token} */
  const call = {
    type: 'gfmFootnoteCall',
    start: Object.assign({}, events[index + 3][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };
  // The `^` marker
  /** @type {Token} */
  const marker = {
    type: 'gfmFootnoteCallMarker',
    start: Object.assign({}, events[index + 3][1].end),
    end: Object.assign({}, events[index + 3][1].end)
  };
  // Increment the end 1 character.
  marker.end.column++;
  marker.end.offset++;
  marker.end._bufferIndex++;
  /** @type {Token} */
  const string = {
    type: 'gfmFootnoteCallString',
    start: Object.assign({}, marker.end),
    end: Object.assign({}, events[events.length - 1][1].start)
  };
  /** @type {Token} */
  const chunk = {
    type: 'chunkString',
    contentType: 'string',
    start: Object.assign({}, string.start),
    end: Object.assign({}, string.end)
  };

  /** @type {Array<Event>} */
  const replacement = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    events[index + 1],
    events[index + 2],
    ['enter', call, context],
    // The `[`
    events[index + 3],
    events[index + 4],
    // The `^`.
    ['enter', marker, context],
    ['exit', marker, context],
    // Everything in between.
    ['enter', string, context],
    ['enter', chunk, context],
    ['exit', chunk, context],
    ['exit', string, context],
    // The ending (`]`, properly parsed and labelled).
    events[events.length - 2],
    events[events.length - 1],
    ['exit', call, context]
  ];
  events.splice(index, events.length - index + 1, ...replacement);
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeGfmFootnoteCall(effects, ok, nok) {
  const self = this;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  let size = 0;
  /** @type {boolean} */
  let data;

  // Note: the implementation of `markdown-rs` is different, because it houses
  // core *and* extensions in one project.
  // Therefore, it can include footnote logic inside `label-end`.
  // We can’t do that, but luckily, we can parse footnotes in a simpler way than
  // needed for labels.
  return start

  /**
   * Start of footnote label.
   *
   * ```markdown
   * > | a [^b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('gfmFootnoteCall');
    effects.enter('gfmFootnoteCallLabelMarker');
    effects.consume(code);
    effects.exit('gfmFootnoteCallLabelMarker');
    return callStart
  }

  /**
   * After `[`, at `^`.
   *
   * ```markdown
   * > | a [^b] c
   *        ^
   * ```
   *
   * @type {State}
   */
  function callStart(code) {
    if (code !== 94) return nok(code)
    effects.enter('gfmFootnoteCallMarker');
    effects.consume(code);
    effects.exit('gfmFootnoteCallMarker');
    effects.enter('gfmFootnoteCallString');
    effects.enter('chunkString').contentType = 'string';
    return callData
  }

  /**
   * In label.
   *
   * ```markdown
   * > | a [^b] c
   *         ^
   * ```
   *
   * @type {State}
   */
  function callData(code) {
    if (
      // Too long.
      size > 999 ||
      // Closing brace with nothing.
      (code === 93 && !data) ||
      // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      code === null ||
      code === 91 ||
      markdownLineEndingOrSpace(code)
    ) {
      return nok(code)
    }
    if (code === 93) {
      effects.exit('chunkString');
      const token = effects.exit('gfmFootnoteCallString');
      if (!defined.includes(normalizeIdentifier(self.sliceSerialize(token)))) {
        return nok(code)
      }
      effects.enter('gfmFootnoteCallLabelMarker');
      effects.consume(code);
      effects.exit('gfmFootnoteCallLabelMarker');
      effects.exit('gfmFootnoteCall');
      return ok
    }
    if (!markdownLineEndingOrSpace(code)) {
      data = true;
    }
    size++;
    effects.consume(code);
    return code === 92 ? callEscape : callData
  }

  /**
   * On character after escape.
   *
   * ```markdown
   * > | a [^b\c] d
   *           ^
   * ```
   *
   * @type {State}
   */
  function callEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code);
      size++;
      return callData
    }
    return callData(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeDefinitionStart(effects, ok, nok) {
  const self = this;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  /** @type {string} */
  let identifier;
  let size = 0;
  /** @type {boolean | undefined} */
  let data;
  return start

  /**
   * Start of GFM footnote definition.
   *
   * ```markdown
   * > | [^a]: b
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('gfmFootnoteDefinition')._container = true;
    effects.enter('gfmFootnoteDefinitionLabel');
    effects.enter('gfmFootnoteDefinitionLabelMarker');
    effects.consume(code);
    effects.exit('gfmFootnoteDefinitionLabelMarker');
    return labelAtMarker
  }

  /**
   * In label, at caret.
   *
   * ```markdown
   * > | [^a]: b
   *      ^
   * ```
   *
   * @type {State}
   */
  function labelAtMarker(code) {
    if (code === 94) {
      effects.enter('gfmFootnoteDefinitionMarker');
      effects.consume(code);
      effects.exit('gfmFootnoteDefinitionMarker');
      effects.enter('gfmFootnoteDefinitionLabelString');
      effects.enter('chunkString').contentType = 'string';
      return labelInside
    }
    return nok(code)
  }

  /**
   * In label.
   *
   * > 👉 **Note**: `cmark-gfm` prevents whitespace from occurring in footnote
   * > definition labels.
   *
   * ```markdown
   * > | [^a]: b
   *       ^
   * ```
   *
   * @type {State}
   */
  function labelInside(code) {
    if (
      // Too long.
      size > 999 ||
      // Closing brace with nothing.
      (code === 93 && !data) ||
      // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      code === null ||
      code === 91 ||
      markdownLineEndingOrSpace(code)
    ) {
      return nok(code)
    }
    if (code === 93) {
      effects.exit('chunkString');
      const token = effects.exit('gfmFootnoteDefinitionLabelString');
      identifier = normalizeIdentifier(self.sliceSerialize(token));
      effects.enter('gfmFootnoteDefinitionLabelMarker');
      effects.consume(code);
      effects.exit('gfmFootnoteDefinitionLabelMarker');
      effects.exit('gfmFootnoteDefinitionLabel');
      return labelAfter
    }
    if (!markdownLineEndingOrSpace(code)) {
      data = true;
    }
    size++;
    effects.consume(code);
    return code === 92 ? labelEscape : labelInside
  }

  /**
   * After `\`, at a special character.
   *
   * > 👉 **Note**: `cmark-gfm` currently does not support escaped brackets:
   * > <https://github.com/github/cmark-gfm/issues/240>
   *
   * ```markdown
   * > | [^a\*b]: c
   *         ^
   * ```
   *
   * @type {State}
   */
  function labelEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code);
      size++;
      return labelInside
    }
    return labelInside(code)
  }

  /**
   * After definition label.
   *
   * ```markdown
   * > | [^a]: b
   *         ^
   * ```
   *
   * @type {State}
   */
  function labelAfter(code) {
    if (code === 58) {
      effects.enter('definitionMarker');
      effects.consume(code);
      effects.exit('definitionMarker');
      if (!defined.includes(identifier)) {
        defined.push(identifier);
      }

      // Any whitespace after the marker is eaten, forming indented code
      // is not possible.
      // No space is also fine, just like a block quote marker.
      return factorySpace(
        effects,
        whitespaceAfter,
        'gfmFootnoteDefinitionWhitespace'
      )
    }
    return nok(code)
  }

  /**
   * After definition prefix.
   *
   * ```markdown
   * > | [^a]: b
   *           ^
   * ```
   *
   * @type {State}
   */
  function whitespaceAfter(code) {
    // `markdown-rs` has a wrapping token for the prefix that is closed here.
    return ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeDefinitionContinuation(effects, ok, nok) {
  /// Start of footnote definition continuation.
  ///
  /// ```markdown
  ///   | [^a]: b
  /// > |     c
  ///     ^
  /// ```
  //
  // Either a blank line, which is okay, or an indented thing.
  return effects.check(blankLine, ok, effects.attempt(indent, ok, nok))
}

/** @type {Exiter} */
function gfmFootnoteDefinitionEnd(effects) {
  effects.exit('gfmFootnoteDefinition');
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeIndent(effects, ok, nok) {
  const self = this;
  return factorySpace(
    effects,
    afterPrefix,
    'gfmFootnoteDefinitionIndent',
    4 + 1
  )

  /**
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === 'gfmFootnoteDefinitionIndent' &&
      tail[2].sliceSerialize(tail[1], true).length === 4
      ? ok(code)
      : nok(code)
  }
}

/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 */

const own = {}.hasOwnProperty;

/** @type {Options} */
const emptyOptions = {};

/**
 * Generate the default label that GitHub uses on backreferences.
 *
 * @param {number} referenceIndex
 *   Index of the definition in the order that they are first referenced,
 *   0-indexed.
 * @param {number} rereferenceIndex
 *   Index of calls to the same definition, 0-indexed.
 * @returns {string}
 *   Default label.
 */
function defaultBackLabel(referenceIndex, rereferenceIndex) {
  return (
    'Back to reference ' +
    (referenceIndex + 1) +
    (rereferenceIndex > 1 ? '-' + rereferenceIndex : '')
  )
}

/**
 * Create an extension for `micromark` to support GFM footnotes when
 * serializing to HTML.
 *
 * @param {Options | null | undefined} [options={}]
 *   Configuration (optional).
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support GFM footnotes when serializing to HTML.
 */
function gfmFootnoteHtml(options) {
  const config = options || emptyOptions;
  const label = config.label || 'Footnotes';
  const labelTagName = config.labelTagName || 'h2';
  const labelAttributes =
    config.labelAttributes === null || config.labelAttributes === undefined
      ? 'class="sr-only"'
      : config.labelAttributes;
  const backLabel = config.backLabel || defaultBackLabel;
  const clobberPrefix =
    config.clobberPrefix === null || config.clobberPrefix === undefined
      ? 'user-content-'
      : config.clobberPrefix;
  return {
    enter: {
      gfmFootnoteDefinition() {
        const stack = this.getData('tightStack');
        stack.push(false);
      },
      gfmFootnoteDefinitionLabelString() {
        this.buffer();
      },
      gfmFootnoteCallString() {
        this.buffer();
      }
    },
    exit: {
      gfmFootnoteDefinition() {
        let definitions = this.getData('gfmFootnoteDefinitions');
        const footnoteStack = this.getData('gfmFootnoteDefinitionStack');
        const tightStack = this.getData('tightStack');
        const current = footnoteStack.pop();
        const value = this.resume();
        if (!definitions) {
          this.setData('gfmFootnoteDefinitions', (definitions = {}));
        }
        if (!own.call(definitions, current)) definitions[current] = value;
        tightStack.pop();
        this.setData('slurpOneLineEnding', true);
        // “Hack” to prevent a line ending from showing up if we’re in a definition in
        // an empty list item.
        this.setData('lastWasTag');
      },
      gfmFootnoteDefinitionLabelString(token) {
        let footnoteStack = this.getData('gfmFootnoteDefinitionStack');
        if (!footnoteStack) {
          this.setData('gfmFootnoteDefinitionStack', (footnoteStack = []));
        }
        footnoteStack.push(normalizeIdentifier(this.sliceSerialize(token)));
        this.resume(); // Drop the label.
        this.buffer(); // Get ready for a value.
      },

      gfmFootnoteCallString(token) {
        let calls = this.getData('gfmFootnoteCallOrder');
        let counts = this.getData('gfmFootnoteCallCounts');
        const id = normalizeIdentifier(this.sliceSerialize(token));
        /** @type {number} */
        let counter;
        this.resume();
        if (!calls) this.setData('gfmFootnoteCallOrder', (calls = []));
        if (!counts) this.setData('gfmFootnoteCallCounts', (counts = {}));
        const index = calls.indexOf(id);
        const safeId = sanitizeUri(id.toLowerCase());
        if (index === -1) {
          calls.push(id);
          counts[id] = 1;
          counter = calls.length;
        } else {
          counts[id]++;
          counter = index + 1;
        }
        const reuseCounter = counts[id];
        this.tag(
          '<sup><a href="#' +
            clobberPrefix +
            'fn-' +
            safeId +
            '" id="' +
            clobberPrefix +
            'fnref-' +
            safeId +
            (reuseCounter > 1 ? '-' + reuseCounter : '') +
            '" data-footnote-ref="" aria-describedby="footnote-label">' +
            String(counter) +
            '</a></sup>'
        );
      },
      null() {
        const calls = this.getData('gfmFootnoteCallOrder') || [];
        const counts = this.getData('gfmFootnoteCallCounts') || {};
        const definitions = this.getData('gfmFootnoteDefinitions') || {};
        let index = -1;
        if (calls.length > 0) {
          this.lineEndingIfNeeded();
          this.tag(
            '<section data-footnotes="" class="footnotes"><' +
              labelTagName +
              ' id="footnote-label"' +
              (labelAttributes ? ' ' + labelAttributes : '') +
              '>'
          );
          this.raw(this.encode(label));
          this.tag('</' + labelTagName + '>');
          this.lineEndingIfNeeded();
          this.tag('<ol>');
        }
        while (++index < calls.length) {
          // Called definitions are always defined.
          const id = calls[index];
          const safeId = sanitizeUri(id.toLowerCase());
          let referenceIndex = 0;
          /** @type {Array<string>} */
          const references = [];
          while (++referenceIndex <= counts[id]) {
            references.push(
              '<a href="#' +
                clobberPrefix +
                'fnref-' +
                safeId +
                (referenceIndex > 1 ? '-' + referenceIndex : '') +
                '" data-footnote-backref="" aria-label="' +
                this.encode(
                  typeof backLabel === 'string'
                    ? backLabel
                    : backLabel(index, referenceIndex)
                ) +
                '" class="data-footnote-backref">↩' +
                (referenceIndex > 1
                  ? '<sup>' + referenceIndex + '</sup>'
                  : '') +
                '</a>'
            );
          }
          const reference = references.join(' ');
          let injected = false;
          this.lineEndingIfNeeded();
          this.tag('<li id="' + clobberPrefix + 'fn-' + safeId + '">');
          this.lineEndingIfNeeded();
          this.tag(
            definitions[id].replace(/<\/p>(?:\r?\n|\r)?$/, function ($0) {
              injected = true;
              return ' ' + reference + $0
            })
          );
          if (!injected) {
            this.lineEndingIfNeeded();
            this.tag(reference);
          }
          this.lineEndingIfNeeded();
          this.tag('</li>');
        }
        if (calls.length > 0) {
          this.lineEndingIfNeeded();
          this.tag('</ol>');
          this.lineEndingIfNeeded();
          this.tag('</section>');
        }
      }
    }
  }
}

/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 */

/**
 * Create an HTML extension for `micromark` to support GFM strikethrough when
 * serializing to HTML.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions`, to
 *   support GFM strikethrough when serializing to HTML.
 */
function gfmStrikethroughHtml() {
  return {
    enter: {
      strikethrough() {
        this.tag('<del>');
      }
    },
    exit: {
      strikethrough() {
        this.tag('</del>');
      }
    }
  }
}

/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [singleTilde=true]
 *   Whether to support strikethrough with a single tilde (default: `true`).
 *
 *   Single tildes work on github.com, but are technically prohibited by the
 *   GFM spec.
 */

/**
 * Create an extension for `micromark` to enable GFM strikethrough syntax.
 *
 * @param {Options | null | undefined} [options={}]
 *   Configuration.
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions`, to
 *   enable GFM strikethrough syntax.
 */
function gfmStrikethrough(options) {
  const options_ = options || {};
  let single = options_.singleTilde;
  const tokenizer = {
    tokenize: tokenizeStrikethrough,
    resolveAll: resolveAllStrikethrough
  };
  if (single === null || single === undefined) {
    single = true;
  }
  return {
    text: {
      [126]: tokenizer
    },
    insideSpan: {
      null: [tokenizer]
    },
    attentionMarkers: {
      null: [126]
    }
  }

  /**
   * Take events and resolve strikethrough.
   *
   * @type {Resolver}
   */
  function resolveAllStrikethrough(events, context) {
    let index = -1;

    // Walk through all events.
    while (++index < events.length) {
      // Find a token that can close.
      if (
        events[index][0] === 'enter' &&
        events[index][1].type === 'strikethroughSequenceTemporary' &&
        events[index][1]._close
      ) {
        let open = index;

        // Now walk back to find an opener.
        while (open--) {
          // Find a token that can open the closer.
          if (
            events[open][0] === 'exit' &&
            events[open][1].type === 'strikethroughSequenceTemporary' &&
            events[open][1]._open &&
            // If the sizes are the same:
            events[index][1].end.offset - events[index][1].start.offset ===
              events[open][1].end.offset - events[open][1].start.offset
          ) {
            events[index][1].type = 'strikethroughSequence';
            events[open][1].type = 'strikethroughSequence';

            /** @type {Token} */
            const strikethrough = {
              type: 'strikethrough',
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index][1].end)
            };

            /** @type {Token} */
            const text = {
              type: 'strikethroughText',
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index][1].start)
            };

            // Opening.
            /** @type {Array<Event>} */
            const nextEvents = [
              ['enter', strikethrough, context],
              ['enter', events[open][1], context],
              ['exit', events[open][1], context],
              ['enter', text, context]
            ];
            const insideSpan = context.parser.constructs.insideSpan.null;
            if (insideSpan) {
              // Between.
              splice(
                nextEvents,
                nextEvents.length,
                0,
                resolveAll(insideSpan, events.slice(open + 1, index), context)
              );
            }

            // Closing.
            splice(nextEvents, nextEvents.length, 0, [
              ['exit', text, context],
              ['enter', events[index][1], context],
              ['exit', events[index][1], context],
              ['exit', strikethrough, context]
            ]);
            splice(events, open - 1, index - open + 3, nextEvents);
            index = open + nextEvents.length - 2;
            break
          }
        }
      }
    }
    index = -1;
    while (++index < events.length) {
      if (events[index][1].type === 'strikethroughSequenceTemporary') {
        events[index][1].type = 'data';
      }
    }
    return events
  }

  /**
   * @this {TokenizeContext}
   * @type {Tokenizer}
   */
  function tokenizeStrikethrough(effects, ok, nok) {
    const previous = this.previous;
    const events = this.events;
    let size = 0;
    return start

    /** @type {State} */
    function start(code) {
      if (
        previous === 126 &&
        events[events.length - 1][1].type !== 'characterEscape'
      ) {
        return nok(code)
      }
      effects.enter('strikethroughSequenceTemporary');
      return more(code)
    }

    /** @type {State} */
    function more(code) {
      const before = classifyCharacter(previous);
      if (code === 126) {
        // If this is the third marker, exit.
        if (size > 1) return nok(code)
        effects.consume(code);
        size++;
        return more
      }
      if (size < 2 && !single) return nok(code)
      const token = effects.exit('strikethroughSequenceTemporary');
      const after = classifyCharacter(code);
      token._open = !after || (after === 2 && Boolean(before));
      token._close = !before || (before === 2 && Boolean(after));
      return ok(code)
    }
  }
}

/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 */

/**
 * @typedef {import('./infer.js').Align} Align
 */

const alignment = {
  none: '',
  left: ' align="left"',
  right: ' align="right"',
  center: ' align="center"'
};

// To do: micromark@5: use `infer` here, when all events are exposed.

/**
 * Create an HTML extension for `micromark` to support GitHub tables when
 * serializing to HTML.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support GitHub tables when serializing to HTML.
 */
function gfmTableHtml() {
  return {
    enter: {
      table(token) {
        const tableAlign = token._align;
        this.lineEndingIfNeeded();
        this.tag('<table>');
        this.setData('tableAlign', tableAlign);
      },
      tableBody() {
        this.tag('<tbody>');
      },
      tableData() {
        const tableAlign = this.getData('tableAlign');
        const tableColumn = this.getData('tableColumn');
        const align = alignment[tableAlign[tableColumn]];
        if (align === undefined) {
          // Capture results to ignore them.
          this.buffer();
        } else {
          this.lineEndingIfNeeded();
          this.tag('<td' + align + '>');
        }
      },
      tableHead() {
        this.lineEndingIfNeeded();
        this.tag('<thead>');
      },
      tableHeader() {
        const tableAlign = this.getData('tableAlign');
        const tableColumn = this.getData('tableColumn');
        const align = alignment[tableAlign[tableColumn]];
        this.lineEndingIfNeeded();
        this.tag('<th' + align + '>');
      },
      tableRow() {
        this.setData('tableColumn', 0);
        this.lineEndingIfNeeded();
        this.tag('<tr>');
      }
    },
    exit: {
      // Overwrite the default code text data handler to unescape escaped pipes when
      // they are in tables.
      codeTextData(token) {
        let value = this.sliceSerialize(token);
        if (this.getData('tableAlign')) {
          value = value.replace(/\\([\\|])/g, replace);
        }
        this.raw(this.encode(value));
      },
      table() {
        this.setData('tableAlign');
        // Note: we don’t set `slurpAllLineEndings` anymore, in delimiter rows,
        // but we do need to reset it to match a funky newline GH generates for
        // list items combined with tables.
        this.setData('slurpAllLineEndings');
        this.lineEndingIfNeeded();
        this.tag('</table>');
      },
      tableBody() {
        this.lineEndingIfNeeded();
        this.tag('</tbody>');
      },
      tableData() {
        const tableAlign = this.getData('tableAlign');
        const tableColumn = this.getData('tableColumn');
        if (tableColumn in tableAlign) {
          this.tag('</td>');
          this.setData('tableColumn', tableColumn + 1);
        } else {
          // Stop capturing.
          this.resume();
        }
      },
      tableHead() {
        this.lineEndingIfNeeded();
        this.tag('</thead>');
      },
      tableHeader() {
        const tableColumn = this.getData('tableColumn');
        this.tag('</th>');
        this.setData('tableColumn', tableColumn + 1);
      },
      tableRow() {
        const tableAlign = this.getData('tableAlign');
        let tableColumn = this.getData('tableColumn');
        while (tableColumn < tableAlign.length) {
          this.lineEndingIfNeeded();
          this.tag('<td' + alignment[tableAlign[tableColumn]] + '></td>');
          tableColumn++;
        }
        this.setData('tableColumn', tableColumn);
        this.lineEndingIfNeeded();
        this.tag('</tr>');
      }
    }
  }
}

/**
 * @param {string} $0
 * @param {string} $1
 * @returns {string}
 */
function replace($0, $1) {
  // Pipes work, backslashes don’t (but can’t escape pipes).
  return $1 === '|' ? $1 : $0
}

/**
 * @typedef {import('micromark-util-types').Event} Event
 */

// Port of `edit_map.rs` from `markdown-rs`.
// This should move to `markdown-js` later.

// Deal with several changes in events, batching them together.
//
// Preferably, changes should be kept to a minimum.
// Sometimes, it’s needed to change the list of events, because parsing can be
// messy, and it helps to expose a cleaner interface of events to the compiler
// and other users.
// It can also help to merge many adjacent similar events.
// And, in other cases, it’s needed to parse subcontent: pass some events
// through another tokenizer and inject the result.

/**
 * @typedef {[number, number, Array<Event>]} Change
 * @typedef {[number, number, number]} Jump
 */

/**
 * Tracks a bunch of edits.
 */
class EditMap {
  /**
   * Create a new edit map.
   */
  constructor() {
    /**
     * Record of changes.
     *
     * @type {Array<Change>}
     */
    this.map = [];
  }

  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   * @param {number} remove
   * @param {Array<Event>} add
   * @returns {undefined}
   */
  add(index, remove, add) {
    addImpl(this, index, remove, add);
  }

  // To do: add this when moving to `micromark`.
  // /**
  //  * Create an edit: but insert `add` before existing additions.
  //  *
  //  * @param {number} index
  //  * @param {number} remove
  //  * @param {Array<Event>} add
  //  * @returns {undefined}
  //  */
  // addBefore(index, remove, add) {
  //   addImpl(this, index, remove, add, true)
  // }

  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   * @returns {undefined}
   */
  consume(events) {
    this.map.sort(function (a, b) {
      return a[0] - b[0]
    });

    /* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
    if (this.map.length === 0) {
      return
    }

    // To do: if links are added in events, like they are in `markdown-rs`,
    // this is needed.
    // // Calculate jumps: where items in the current list move to.
    // /** @type {Array<Jump>} */
    // const jumps = []
    // let index = 0
    // let addAcc = 0
    // let removeAcc = 0
    // while (index < this.map.length) {
    //   const [at, remove, add] = this.map[index]
    //   removeAcc += remove
    //   addAcc += add.length
    //   jumps.push([at, removeAcc, addAcc])
    //   index += 1
    // }
    //
    // . shiftLinks(events, jumps)

    let index = this.map.length;
    /** @type {Array<Array<Event>>} */
    const vecs = [];
    while (index > 0) {
      index -= 1;
      vecs.push(
        events.slice(this.map[index][0] + this.map[index][1]),
        this.map[index][2]
      );

      // Truncate rest.
      events.length = this.map[index][0];
    }
    vecs.push([...events]);
    events.length = 0;
    let slice = vecs.pop();
    while (slice) {
      events.push(...slice);
      slice = vecs.pop();
    }

    // Truncate everything.
    this.map.length = 0;
  }
}

/**
 * Create an edit.
 *
 * @param {EditMap} editMap
 * @param {number} at
 * @param {number} remove
 * @param {Array<Event>} add
 * @returns {undefined}
 */
function addImpl(editMap, at, remove, add) {
  let index = 0;

  /* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
  if (remove === 0 && add.length === 0) {
    return
  }
  while (index < editMap.map.length) {
    if (editMap.map[index][0] === at) {
      editMap.map[index][1] += remove;

      // To do: before not used by tables, use when moving to micromark.
      // if (before) {
      //   add.push(...editMap.map[index][2])
      //   editMap.map[index][2] = add
      // } else {
      editMap.map[index][2].push(...add);
      // }

      return
    }
    index += 1;
  }
  editMap.map.push([at, remove, add]);
}

// /**
//  * Shift `previous` and `next` links according to `jumps`.
//  *
//  * This fixes links in case there are events removed or added between them.
//  *
//  * @param {Array<Event>} events
//  * @param {Array<Jump>} jumps
//  */
// function shiftLinks(events, jumps) {
//   let jumpIndex = 0
//   let index = 0
//   let add = 0
//   let rm = 0

//   while (index < events.length) {
//     const rmCurr = rm

//     while (jumpIndex < jumps.length && jumps[jumpIndex][0] <= index) {
//       add = jumps[jumpIndex][2]
//       rm = jumps[jumpIndex][1]
//       jumpIndex += 1
//     }

//     // Ignore items that will be removed.
//     if (rm > rmCurr) {
//       index += rm - rmCurr
//     } else {
//       // ?
//       // if let Some(link) = &events[index].link {
//       //     if let Some(next) = link.next {
//       //         events[next].link.as_mut().unwrap().previous = Some(index + add - rm);
//       //         while jumpIndex < jumps.len() && jumps[jumpIndex].0 <= next {
//       //             add = jumps[jumpIndex].2;
//       //             rm = jumps[jumpIndex].1;
//       //             jumpIndex += 1;
//       //         }
//       //         events[index].link.as_mut().unwrap().next = Some(next + add - rm);
//       //         index = next;
//       //         continue;
//       //     }
//       // }
//       index += 1
//     }
//   }
// }

/**
 * @typedef {import('micromark-util-types').Event} Event
 */

/**
 * @typedef {'center' | 'left' | 'none' | 'right'} Align
 */

/**
 * Figure out the alignment of a GFM table.
 *
 * @param {Readonly<Array<Event>>} events
 *   List of events.
 * @param {number} index
 *   Table enter event.
 * @returns {Array<Align>}
 *   List of aligns.
 */
function gfmTableAlign(events, index) {
  let inDelimiterRow = false;
  /** @type {Array<Align>} */
  const align = [];
  while (index < events.length) {
    const event = events[index];
    if (inDelimiterRow) {
      if (event[0] === 'enter') {
        // Start of alignment value: set a new column.
        // To do: `markdown-rs` uses `tableDelimiterCellValue`.
        if (event[1].type === 'tableContent') {
          align.push(
            events[index + 1][1].type === 'tableDelimiterMarker'
              ? 'left'
              : 'none'
          );
        }
      }
      // Exits:
      // End of alignment value: change the column.
      // To do: `markdown-rs` uses `tableDelimiterCellValue`.
      else if (event[1].type === 'tableContent') {
        if (events[index - 1][1].type === 'tableDelimiterMarker') {
          const alignIndex = align.length - 1;
          align[alignIndex] = align[alignIndex] === 'left' ? 'center' : 'right';
        }
      }
      // Done!
      else if (event[1].type === 'tableDelimiterRow') {
        break
      }
    } else if (event[0] === 'enter' && event[1].type === 'tableDelimiterRow') {
      inDelimiterRow = true;
    }
    index += 1;
  }
  return align
}

/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/**
 * Create an HTML extension for `micromark` to support GitHub tables syntax.
 *
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions` to enable GFM
 *   table syntax.
 */
function gfmTable() {
  return {
    flow: {
      null: {
        tokenize: tokenizeTable,
        resolveAll: resolveTable
      }
    }
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeTable(effects, ok, nok) {
  const self = this;
  let size = 0;
  let sizeB = 0;
  /** @type {boolean | undefined} */
  let seen;
  return start

  /**
   * Start of a GFM table.
   *
   * If there is a valid table row or table head before, then we try to parse
   * another row.
   * Otherwise, we try to parse a head.
   *
   * ```markdown
   * > | | a |
   *     ^
   *   | | - |
   * > | | b |
   *     ^
   * ```
   * @type {State}
   */
  function start(code) {
    let index = self.events.length - 1;
    while (index > -1) {
      const type = self.events[index][1].type;
      if (
        type === 'lineEnding' ||
        // Note: markdown-rs uses `whitespace` instead of `linePrefix`
        type === 'linePrefix'
      )
        index--;
      else break
    }
    const tail = index > -1 ? self.events[index][1].type : null;
    const next =
      tail === 'tableHead' || tail === 'tableRow' ? bodyRowStart : headRowBefore;

    // Don’t allow lazy body rows.
    if (next === bodyRowStart && self.parser.lazy[self.now().line]) {
      return nok(code)
    }
    return next(code)
  }

  /**
   * Before table head row.
   *
   * ```markdown
   * > | | a |
   *     ^
   *   | | - |
   *   | | b |
   * ```
   *
   * @type {State}
   */
  function headRowBefore(code) {
    effects.enter('tableHead');
    effects.enter('tableRow');
    return headRowStart(code)
  }

  /**
   * Before table head row, after whitespace.
   *
   * ```markdown
   * > | | a |
   *     ^
   *   | | - |
   *   | | b |
   * ```
   *
   * @type {State}
   */
  function headRowStart(code) {
    if (code === 124) {
      return headRowBreak(code)
    }

    // To do: micromark-js should let us parse our own whitespace in extensions,
    // like `markdown-rs`:
    //
    // ```js
    // // 4+ spaces.
    // if (markdownSpace(code)) {
    //   return nok(code)
    // }
    // ```

    seen = true;
    // Count the first character, that isn’t a pipe, double.
    sizeB += 1;
    return headRowBreak(code)
  }

  /**
   * At break in table head row.
   *
   * ```markdown
   * > | | a |
   *     ^
   *       ^
   *         ^
   *   | | - |
   *   | | b |
   * ```
   *
   * @type {State}
   */
  function headRowBreak(code) {
    if (code === null) {
      // Note: in `markdown-rs`, we need to reset, in `micromark-js` we don‘t.
      return nok(code)
    }
    if (markdownLineEnding(code)) {
      // If anything other than one pipe (ignoring whitespace) was used, it’s fine.
      if (sizeB > 1) {
        sizeB = 0;
        // To do: check if this works.
        // Feel free to interrupt:
        self.interrupt = true;
        effects.exit('tableRow');
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return headDelimiterStart
      }

      // Note: in `markdown-rs`, we need to reset, in `micromark-js` we don‘t.
      return nok(code)
    }
    if (markdownSpace(code)) {
      // To do: check if this is fine.
      // effects.attempt(State::Next(StateName::GfmTableHeadRowBreak), State::Nok)
      // State::Retry(space_or_tab(tokenizer))
      return factorySpace(effects, headRowBreak, 'whitespace')(code)
    }
    sizeB += 1;
    if (seen) {
      seen = false;
      // Header cell count.
      size += 1;
    }
    if (code === 124) {
      effects.enter('tableCellDivider');
      effects.consume(code);
      effects.exit('tableCellDivider');
      // Whether a delimiter was seen.
      seen = true;
      return headRowBreak
    }

    // Anything else is cell data.
    effects.enter('data');
    return headRowData(code)
  }

  /**
   * In table head row data.
   *
   * ```markdown
   * > | | a |
   *       ^
   *   | | - |
   *   | | b |
   * ```
   *
   * @type {State}
   */
  function headRowData(code) {
    if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
      effects.exit('data');
      return headRowBreak(code)
    }
    effects.consume(code);
    return code === 92 ? headRowEscape : headRowData
  }

  /**
   * In table head row escape.
   *
   * ```markdown
   * > | | a\-b |
   *         ^
   *   | | ---- |
   *   | | c    |
   * ```
   *
   * @type {State}
   */
  function headRowEscape(code) {
    if (code === 92 || code === 124) {
      effects.consume(code);
      return headRowData
    }
    return headRowData(code)
  }

  /**
   * Before delimiter row.
   *
   * ```markdown
   *   | | a |
   * > | | - |
   *     ^
   *   | | b |
   * ```
   *
   * @type {State}
   */
  function headDelimiterStart(code) {
    // Reset `interrupt`.
    self.interrupt = false;

    // Note: in `markdown-rs`, we need to handle piercing here too.
    if (self.parser.lazy[self.now().line]) {
      return nok(code)
    }
    effects.enter('tableDelimiterRow');
    // Track if we’ve seen a `:` or `|`.
    seen = false;
    if (markdownSpace(code)) {
      return factorySpace(
        effects,
        headDelimiterBefore,
        'linePrefix',
        self.parser.constructs.disable.null.includes('codeIndented')
          ? undefined
          : 4
      )(code)
    }
    return headDelimiterBefore(code)
  }

  /**
   * Before delimiter row, after optional whitespace.
   *
   * Reused when a `|` is found later, to parse another cell.
   *
   * ```markdown
   *   | | a |
   * > | | - |
   *     ^
   *   | | b |
   * ```
   *
   * @type {State}
   */
  function headDelimiterBefore(code) {
    if (code === 45 || code === 58) {
      return headDelimiterValueBefore(code)
    }
    if (code === 124) {
      seen = true;
      // If we start with a pipe, we open a cell marker.
      effects.enter('tableCellDivider');
      effects.consume(code);
      effects.exit('tableCellDivider');
      return headDelimiterCellBefore
    }

    // More whitespace / empty row not allowed at start.
    return headDelimiterNok(code)
  }

  /**
   * After `|`, before delimiter cell.
   *
   * ```markdown
   *   | | a |
   * > | | - |
   *      ^
   * ```
   *
   * @type {State}
   */
  function headDelimiterCellBefore(code) {
    if (markdownSpace(code)) {
      return factorySpace(effects, headDelimiterValueBefore, 'whitespace')(code)
    }
    return headDelimiterValueBefore(code)
  }

  /**
   * Before delimiter cell value.
   *
   * ```markdown
   *   | | a |
   * > | | - |
   *       ^
   * ```
   *
   * @type {State}
   */
  function headDelimiterValueBefore(code) {
    // Align: left.
    if (code === 58) {
      sizeB += 1;
      seen = true;
      effects.enter('tableDelimiterMarker');
      effects.consume(code);
      effects.exit('tableDelimiterMarker');
      return headDelimiterLeftAlignmentAfter
    }

    // Align: none.
    if (code === 45) {
      sizeB += 1;
      // To do: seems weird that this *isn’t* left aligned, but that state is used?
      return headDelimiterLeftAlignmentAfter(code)
    }
    if (code === null || markdownLineEnding(code)) {
      return headDelimiterCellAfter(code)
    }
    return headDelimiterNok(code)
  }

  /**
   * After delimiter cell left alignment marker.
   *
   * ```markdown
   *   | | a  |
   * > | | :- |
   *        ^
   * ```
   *
   * @type {State}
   */
  function headDelimiterLeftAlignmentAfter(code) {
    if (code === 45) {
      effects.enter('tableDelimiterFiller');
      return headDelimiterFiller(code)
    }

    // Anything else is not ok after the left-align colon.
    return headDelimiterNok(code)
  }

  /**
   * In delimiter cell filler.
   *
   * ```markdown
   *   | | a |
   * > | | - |
   *       ^
   * ```
   *
   * @type {State}
   */
  function headDelimiterFiller(code) {
    if (code === 45) {
      effects.consume(code);
      return headDelimiterFiller
    }

    // Align is `center` if it was `left`, `right` otherwise.
    if (code === 58) {
      seen = true;
      effects.exit('tableDelimiterFiller');
      effects.enter('tableDelimiterMarker');
      effects.consume(code);
      effects.exit('tableDelimiterMarker');
      return headDelimiterRightAlignmentAfter
    }
    effects.exit('tableDelimiterFiller');
    return headDelimiterRightAlignmentAfter(code)
  }

  /**
   * After delimiter cell right alignment marker.
   *
   * ```markdown
   *   | |  a |
   * > | | -: |
   *         ^
   * ```
   *
   * @type {State}
   */
  function headDelimiterRightAlignmentAfter(code) {
    if (markdownSpace(code)) {
      return factorySpace(effects, headDelimiterCellAfter, 'whitespace')(code)
    }
    return headDelimiterCellAfter(code)
  }

  /**
   * After delimiter cell.
   *
   * ```markdown
   *   | |  a |
   * > | | -: |
   *          ^
   * ```
   *
   * @type {State}
   */
  function headDelimiterCellAfter(code) {
    if (code === 124) {
      return headDelimiterBefore(code)
    }
    if (code === null || markdownLineEnding(code)) {
      // Exit when:
      // * there was no `:` or `|` at all (it’s a thematic break or setext
      //   underline instead)
      // * the header cell count is not the delimiter cell count
      if (!seen || size !== sizeB) {
        return headDelimiterNok(code)
      }

      // Note: in markdown-rs`, a reset is needed here.
      effects.exit('tableDelimiterRow');
      effects.exit('tableHead');
      // To do: in `markdown-rs`, resolvers need to be registered manually.
      // effects.register_resolver(ResolveName::GfmTable)
      return ok(code)
    }
    return headDelimiterNok(code)
  }

  /**
   * In delimiter row, at a disallowed byte.
   *
   * ```markdown
   *   | | a |
   * > | | x |
   *       ^
   * ```
   *
   * @type {State}
   */
  function headDelimiterNok(code) {
    // Note: in `markdown-rs`, we need to reset, in `micromark-js` we don‘t.
    return nok(code)
  }

  /**
   * Before table body row.
   *
   * ```markdown
   *   | | a |
   *   | | - |
   * > | | b |
   *     ^
   * ```
   *
   * @type {State}
   */
  function bodyRowStart(code) {
    // Note: in `markdown-rs` we need to manually take care of a prefix,
    // but in `micromark-js` that is done for us, so if we’re here, we’re
    // never at whitespace.
    effects.enter('tableRow');
    return bodyRowBreak(code)
  }

  /**
   * At break in table body row.
   *
   * ```markdown
   *   | | a |
   *   | | - |
   * > | | b |
   *     ^
   *       ^
   *         ^
   * ```
   *
   * @type {State}
   */
  function bodyRowBreak(code) {
    if (code === 124) {
      effects.enter('tableCellDivider');
      effects.consume(code);
      effects.exit('tableCellDivider');
      return bodyRowBreak
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit('tableRow');
      return ok(code)
    }
    if (markdownSpace(code)) {
      return factorySpace(effects, bodyRowBreak, 'whitespace')(code)
    }

    // Anything else is cell content.
    effects.enter('data');
    return bodyRowData(code)
  }

  /**
   * In table body row data.
   *
   * ```markdown
   *   | | a |
   *   | | - |
   * > | | b |
   *       ^
   * ```
   *
   * @type {State}
   */
  function bodyRowData(code) {
    if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
      effects.exit('data');
      return bodyRowBreak(code)
    }
    effects.consume(code);
    return code === 92 ? bodyRowEscape : bodyRowData
  }

  /**
   * In table body row escape.
   *
   * ```markdown
   *   | | a    |
   *   | | ---- |
   * > | | b\-c |
   *         ^
   * ```
   *
   * @type {State}
   */
  function bodyRowEscape(code) {
    if (code === 92 || code === 124) {
      effects.consume(code);
      return bodyRowData
    }
    return bodyRowData(code)
  }
}

/** @type {Resolver} */

function resolveTable(events, context) {
  let index = -1;
  let inFirstCellAwaitingPipe = true;
  /** @type {RowKind} */
  let rowKind = 0;
  /** @type {Range} */
  let lastCell = [0, 0, 0, 0];
  /** @type {Range} */
  let cell = [0, 0, 0, 0];
  let afterHeadAwaitingFirstBodyRow = false;
  let lastTableEnd = 0;
  /** @type {Token | undefined} */
  let currentTable;
  /** @type {Token | undefined} */
  let currentBody;
  /** @type {Token | undefined} */
  let currentCell;
  const map = new EditMap();
  while (++index < events.length) {
    const event = events[index];
    const token = event[1];
    if (event[0] === 'enter') {
      // Start of head.
      if (token.type === 'tableHead') {
        afterHeadAwaitingFirstBodyRow = false;

        // Inject previous (body end and) table end.
        if (lastTableEnd !== 0) {
          flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
          currentBody = undefined;
          lastTableEnd = 0;
        }

        // Inject table start.
        currentTable = {
          type: 'table',
          start: Object.assign({}, token.start),
          // Note: correct end is set later.
          end: Object.assign({}, token.end)
        };
        map.add(index, 0, [['enter', currentTable, context]]);
      } else if (
        token.type === 'tableRow' ||
        token.type === 'tableDelimiterRow'
      ) {
        inFirstCellAwaitingPipe = true;
        currentCell = undefined;
        lastCell = [0, 0, 0, 0];
        cell = [0, index + 1, 0, 0];

        // Inject table body start.
        if (afterHeadAwaitingFirstBodyRow) {
          afterHeadAwaitingFirstBodyRow = false;
          currentBody = {
            type: 'tableBody',
            start: Object.assign({}, token.start),
            // Note: correct end is set later.
            end: Object.assign({}, token.end)
          };
          map.add(index, 0, [['enter', currentBody, context]]);
        }
        rowKind = token.type === 'tableDelimiterRow' ? 2 : currentBody ? 3 : 1;
      }
      // Cell data.
      else if (
        rowKind &&
        (token.type === 'data' ||
          token.type === 'tableDelimiterMarker' ||
          token.type === 'tableDelimiterFiller')
      ) {
        inFirstCellAwaitingPipe = false;

        // First value in cell.
        if (cell[2] === 0) {
          if (lastCell[1] !== 0) {
            cell[0] = cell[1];
            currentCell = flushCell(
              map,
              context,
              lastCell,
              rowKind,
              undefined,
              currentCell
            );
            lastCell = [0, 0, 0, 0];
          }
          cell[2] = index;
        }
      } else if (token.type === 'tableCellDivider') {
        if (inFirstCellAwaitingPipe) {
          inFirstCellAwaitingPipe = false;
        } else {
          if (lastCell[1] !== 0) {
            cell[0] = cell[1];
            currentCell = flushCell(
              map,
              context,
              lastCell,
              rowKind,
              undefined,
              currentCell
            );
          }
          lastCell = cell;
          cell = [lastCell[1], index, 0, 0];
        }
      }
    }
    // Exit events.
    else if (token.type === 'tableHead') {
      afterHeadAwaitingFirstBodyRow = true;
      lastTableEnd = index;
    } else if (
      token.type === 'tableRow' ||
      token.type === 'tableDelimiterRow'
    ) {
      lastTableEnd = index;
      if (lastCell[1] !== 0) {
        cell[0] = cell[1];
        currentCell = flushCell(
          map,
          context,
          lastCell,
          rowKind,
          index,
          currentCell
        );
      } else if (cell[1] !== 0) {
        currentCell = flushCell(map, context, cell, rowKind, index, currentCell);
      }
      rowKind = 0;
    } else if (
      rowKind &&
      (token.type === 'data' ||
        token.type === 'tableDelimiterMarker' ||
        token.type === 'tableDelimiterFiller')
    ) {
      cell[3] = index;
    }
  }
  if (lastTableEnd !== 0) {
    flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
  }
  map.consume(context.events);

  // To do: move this into `html`, when events are exposed there.
  // That’s what `markdown-rs` does.
  // That needs updates to `mdast-util-gfm-table`.
  index = -1;
  while (++index < context.events.length) {
    const event = context.events[index];
    if (event[0] === 'enter' && event[1].type === 'table') {
      event[1]._align = gfmTableAlign(context.events, index);
    }
  }
  return events
}

/**
 * Generate a cell.
 *
 * @param {EditMap} map
 * @param {Readonly<TokenizeContext>} context
 * @param {Readonly<Range>} range
 * @param {RowKind} rowKind
 * @param {number | undefined} rowEnd
 * @param {Token | undefined} previousCell
 * @returns {Token | undefined}
 */
// eslint-disable-next-line max-params
function flushCell(map, context, range, rowKind, rowEnd, previousCell) {
  // `markdown-rs` uses:
  // rowKind === 2 ? 'tableDelimiterCell' : 'tableCell'
  const groupName =
    rowKind === 1
      ? 'tableHeader'
      : rowKind === 2
      ? 'tableDelimiter'
      : 'tableData';
  // `markdown-rs` uses:
  // rowKind === 2 ? 'tableDelimiterCellValue' : 'tableCellText'
  const valueName = 'tableContent';

  // Insert an exit for the previous cell, if there is one.
  //
  // ```markdown
  // > | | aa | bb | cc |
  //          ^-- exit
  //           ^^^^-- this cell
  // ```
  if (range[0] !== 0) {
    previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
    map.add(range[0], 0, [['exit', previousCell, context]]);
  }

  // Insert enter of this cell.
  //
  // ```markdown
  // > | | aa | bb | cc |
  //           ^-- enter
  //           ^^^^-- this cell
  // ```
  const now = getPoint(context.events, range[1]);
  previousCell = {
    type: groupName,
    start: Object.assign({}, now),
    // Note: correct end is set later.
    end: Object.assign({}, now)
  };
  map.add(range[1], 0, [['enter', previousCell, context]]);

  // Insert text start at first data start and end at last data end, and
  // remove events between.
  //
  // ```markdown
  // > | | aa | bb | cc |
  //            ^-- enter
  //             ^-- exit
  //           ^^^^-- this cell
  // ```
  if (range[2] !== 0) {
    const relatedStart = getPoint(context.events, range[2]);
    const relatedEnd = getPoint(context.events, range[3]);
    /** @type {Token} */
    const valueToken = {
      type: valueName,
      start: Object.assign({}, relatedStart),
      end: Object.assign({}, relatedEnd)
    };
    map.add(range[2], 0, [['enter', valueToken, context]]);
    if (rowKind !== 2) {
      // Fix positional info on remaining events
      const start = context.events[range[2]];
      const end = context.events[range[3]];
      start[1].end = Object.assign({}, end[1].end);
      start[1].type = 'chunkText';
      start[1].contentType = 'text';

      // Remove if needed.
      if (range[3] > range[2] + 1) {
        const a = range[2] + 1;
        const b = range[3] - range[2] - 1;
        map.add(a, b, []);
      }
    }
    map.add(range[3] + 1, 0, [['exit', valueToken, context]]);
  }

  // Insert an exit for the last cell, if at the row end.
  //
  // ```markdown
  // > | | aa | bb | cc |
  //                    ^-- exit
  //               ^^^^^^-- this cell (the last one contains two “between” parts)
  // ```
  if (rowEnd !== undefined) {
    previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
    map.add(rowEnd, 0, [['exit', previousCell, context]]);
    previousCell = undefined;
  }
  return previousCell
}

/**
 * Generate table end (and table body end).
 *
 * @param {Readonly<EditMap>} map
 * @param {Readonly<TokenizeContext>} context
 * @param {number} index
 * @param {Token} table
 * @param {Token | undefined} tableBody
 */
// eslint-disable-next-line max-params
function flushTableEnd(map, context, index, table, tableBody) {
  /** @type {Array<Event>} */
  const exits = [];
  const related = getPoint(context.events, index);
  if (tableBody) {
    tableBody.end = Object.assign({}, related);
    exits.push(['exit', tableBody, context]);
  }
  table.end = Object.assign({}, related);
  exits.push(['exit', table, context]);
  map.add(index + 1, 0, exits);
}

/**
 * @param {Readonly<Array<Event>>} events
 * @param {number} index
 * @returns {Readonly<Point>}
 */
function getPoint(events, index) {
  const event = events[index];
  const side = event[0] === 'enter' ? 'start' : 'end';
  return event[1][side]
}

/**
 * @typedef {import('micromark-util-types').CompileContext} CompileContext
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').Token} Token
 */

// An opening or closing tag start, followed by a case-insensitive specific tag name,
// followed by HTML whitespace, a greater than, or a slash.
const reFlow =
  /<(\/?)(iframe|noembed|noframes|plaintext|script|style|title|textarea|xmp)(?=[\t\n\f\r />])/gi;

// As HTML (text) parses tags separately (and very strictly), we don’t need to be
// global.
const reText = new RegExp('^' + reFlow.source, 'i');

/**
 * Create an HTML extension for `micromark` to support GitHubs weird and
 * useless tagfilter when serializing to HTML.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to support
 *   GitHubs weird and useless tagfilter when serializing to HTML.
 */
function gfmTagfilterHtml() {
  return {
    exit: {
      htmlFlowData(token) {
        exitHtmlData.call(this, token, reFlow);
      },
      htmlTextData(token) {
        exitHtmlData.call(this, token, reText);
      }
    }
  }
}

/**
 * @this {CompileContext}
 * @param {Token} token
 * @param {RegExp} filter
 * @returns {undefined}
 */
function exitHtmlData(token, filter) {
  let value = this.sliceSerialize(token);

  if (this.options.allowDangerousHtml) {
    value = value.replace(filter, '&lt;$1$2');
  }

  this.raw(this.encode(value));
}

/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 */

/**
 * Create an HTML extension for `micromark` to support GFM task list items when
 * serializing to HTML.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support GFM task list items when serializing to HTML.
 */
function gfmTaskListItemHtml() {
  return {
    enter: {
      taskListCheck() {
        this.tag('<input type="checkbox" disabled="" ');
      }
    },
    exit: {
      taskListCheck() {
        this.tag('/>');
      },
      taskListCheckValueChecked() {
        this.tag('checked="" ');
      }
    }
  }
}

/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

const tasklistCheck = {
  tokenize: tokenizeTasklistCheck
};

/**
 * Create an HTML extension for `micromark` to support GFM task list items
 * syntax.
 *
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support GFM task list items when serializing to HTML.
 */
function gfmTaskListItem() {
  return {
    text: {
      [91]: tasklistCheck
    }
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeTasklistCheck(effects, ok, nok) {
  const self = this;
  return open

  /**
   * At start of task list item check.
   *
   * ```markdown
   * > | * [x] y.
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (
      // Exit if there’s stuff before.
      self.previous !== null ||
      // Exit if not in the first content that is the first child of a list
      // item.
      !self._gfmTasklistFirstContentOfListItem
    ) {
      return nok(code)
    }
    effects.enter('taskListCheck');
    effects.enter('taskListCheckMarker');
    effects.consume(code);
    effects.exit('taskListCheckMarker');
    return inside
  }

  /**
   * In task list item check.
   *
   * ```markdown
   * > | * [x] y.
   *        ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    // Currently we match how GH works in files.
    // To match how GH works in comments, use `markdownSpace` (`[\t ]`) instead
    // of `markdownLineEndingOrSpace` (`[\t\n\r ]`).
    if (markdownLineEndingOrSpace(code)) {
      effects.enter('taskListCheckValueUnchecked');
      effects.consume(code);
      effects.exit('taskListCheckValueUnchecked');
      return close
    }
    if (code === 88 || code === 120) {
      effects.enter('taskListCheckValueChecked');
      effects.consume(code);
      effects.exit('taskListCheckValueChecked');
      return close
    }
    return nok(code)
  }

  /**
   * At close of task list item check.
   *
   * ```markdown
   * > | * [x] y.
   *         ^
   * ```
   *
   * @type {State}
   */
  function close(code) {
    if (code === 93) {
      effects.enter('taskListCheckMarker');
      effects.consume(code);
      effects.exit('taskListCheckMarker');
      effects.exit('taskListCheck');
      return after
    }
    return nok(code)
  }

  /**
   * @type {State}
   */
  function after(code) {
    // EOL in paragraph means there must be something else after it.
    if (markdownLineEnding(code)) {
      return ok(code)
    }

    // Space or tab?
    // Check what comes after.
    if (markdownSpace(code)) {
      return effects.check(
        {
          tokenize: spaceThenNonSpace
        },
        ok,
        nok
      )(code)
    }

    // EOF, or non-whitespace, both wrong.
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function spaceThenNonSpace(effects, ok, nok) {
  return factorySpace(effects, after, 'whitespace')

  /**
   * After whitespace, after task list item check.
   *
   * ```markdown
   * > | * [x] y.
   *           ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // EOF means there was nothing, so bad.
    // EOL means there’s content after it, so good.
    // Impossible to have more spaces.
    // Anything else is good.
    return code === null ? nok(code) : ok(code)
  }
}

/**
 * @typedef {import('micromark-extension-gfm-footnote').HtmlOptions} HtmlOptions
 * @typedef {import('micromark-extension-gfm-strikethrough').Options} Options
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 */


/**
 * Create an extension for `micromark` to enable GFM syntax.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 *
 *   Passed to `micromark-extens-gfm-strikethrough`.
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions` to enable GFM
 *   syntax.
 */
function gfm(options) {
  return combineExtensions([
    gfmAutolinkLiteral(),
    gfmFootnote(),
    gfmStrikethrough(options),
    gfmTable(),
    gfmTaskListItem()
  ])
}

/**
 * Create an extension for `micromark` to support GFM when serializing to HTML.
 *
 * @param {HtmlOptions | null | undefined} [options]
 *   Configuration (optional).
 *
 *   Passed to `micromark-extens-gfm-footnote`.
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support GFM when serializing to HTML.
 */
function gfmHtml(options) {
  return combineHtmlExtensions([
    gfmAutolinkLiteralHtml(),
    gfmFootnoteHtml(options),
    gfmStrikethroughHtml(),
    gfmTableHtml(),
    gfmTagfilterHtml(),
    gfmTaskListItemHtml()
  ])
}

class MarkdownHandlebars {
    constructor(options = {}) {
        //Store the template in the class so we don't need to generate it each time
        this.templates = new Map();
        this.options = { ...MarkdownHandlebars.defaultOptions, ...options };
        if (options.template) {
            this._generateTemplateDelegate(options.template, options.handlebarsOptions);
        }
        this.lintHelper = new LintHelper(this);
        // Shim needed for handbars? maybe?
        window.hb = Handlebars;
        //Register all the handlebars helpers
        Object.entries(this.options.handlebarsHelpers).forEach(([name, helper]) => {
            Handlebars.registerHelper(name, this._helperWrapper(helper)); // TODO helper wrapper
        });
    }
    _helperWrapper(helper) {
        const ctx = this;
        return function (...args) {
            try {
                return helper.call(this, ...args);
            }
            catch (e) {
                const options = args[args.length - 1];
                const exc = new handlebarsExports.Exception(`Error with helper ${options.name} from line ${options.loc.start.line} col ${Math.max(options.loc.start.column, 1)} to line ${options.loc.end.line} col ${options.loc.end.column}:\n${e.message}\n`);
                exc.stack = e.stack;
                exc.name = 'Helper Error';
                //console.log('HH', this, args, ctx)
                if (ctx.currentError !== ctx.currentParse) {
                    ctx.currentError = ctx.currentParse;
                    ctx.reportError(0, exc, ctx.currentTemplate || '', -1, false);
                }
            }
        };
    }
    /**
     * Evaluates an expression as HTML and returns a div element containing the rendered HTML.
     *
     * @param expression The string or array of strings to evaluate.
     * @param properties An object containing properties that can be used in handlebars.
     * @param featureState The feature state from the map.
     * @param map The Maplibre map.
     * @returns A div element containing the rendered HTML.
     */
    templater(expression, feature, map) {
        var _a, _b;
        // Create a div to hold the rendered HTML
        const div = document.createElement('div');
        this.currentParse = simpleHash(JSON.stringify(expression) + JSON.stringify(feature));
        // Set the HTML content of the div element and return it.
        expression = Array.isArray(expression) ? expression.join('\n') : expression;
        this.currentTemplate = expression;
        const runtimeVariables = {
            map,
            feature,
            geometry: feature.geometry,
            lat: (_a = feature.clickPoint) === null || _a === void 0 ? void 0 : _a.lat,
            lng: (_b = feature.clickPoint) === null || _b === void 0 ? void 0 : _b.lng
        };
        const runtimeOptions = this.options.handlebarsRuntimeOptions;
        runtimeOptions.data = {
            ...(runtimeOptions.data || {}),
            ...runtimeVariables
        };
        const html = this.convertMarkdown(this.applyHandlebarsTemplate(this.escapeExceptHandlebars(expression), (feature.properties || {}), runtimeOptions));
        div.innerHTML = html;
        return div;
    }
    ;
    _templateHash(template, options) {
        return simpleHash([template, JSON.stringify(options)].join('\n'));
    }
    _generateTemplateDelegate(template, options = this.options.handlebarsOptions) {
        // Check if this has already been generated
        let delegate = this.templates.get(this._templateHash(template, options || {}));
        if (!delegate) {
            delegate = Handlebars.compile(template, options);
            this.templates.set(this._templateHash(template, options || {}), delegate);
        }
        return delegate;
    }
    applyHandlebarsTemplate(template, properties, runtimeOptions = this.options.handlebarsRuntimeOptions, throwError = false) {
        let returnValue = '';
        let lastErrorLine = -1; // Track the last error line to avoid duplicate error reporting
        let cleanedTemplate = template;
        const templateLines = template.split("\n").length;
        // Loop through the template, attempting to render it. If it fails, remove the problematic line and try again.
        for (let i = 0; i < templateLines; i++) {
            // Generate the Handlebars template delegate
            const delegate = this._generateTemplateDelegate(cleanedTemplate, this.options.handlebarsOptions);
            try {
                // Attempt to render the template
                returnValue = delegate(properties, runtimeOptions);
                // If successful, break the loop
                break;
            }
            catch (e) {
                const nextError = this.reportError(i, e, cleanedTemplate, lastErrorLine, throwError);
                // If the error is on the first line, give up
                if (lastErrorLine === nextError.errorLocation.line && nextError.errorStartLine === 1) {
                    break;
                }
                lastErrorLine = nextError.errorStartLine;
            }
        }
        //console.log('returnValue', returnValue);
        return returnValue;
    }
    reportError(i, e, cleanedTemplate, lastErrorLine, throwError) {
        // Convert the error into an exception
        const exception = this.lintHelper.toException(e);
        if (throwError)
            throw exception;
        const errorLocation = this.lintHelper.parseErrorMessage(exception.message, cleanedTemplate);
        const errorStartLine = errorLocation.line || 1; // Unknown error, start on line 1
        exception.message = errorLocation.message;
        // Report the first error using the errorHandler
        if (i === 0) {
            this.options.errorHandler(exception);
        }
        // Remove the problematic line from the template
        cleanedTemplate = cleanedTemplate
            .split('\n')
            .map((s, i) => i === errorStartLine - 1 ? '' : s)
            .join('\n');
        // If the error is on the same line as before, clear the line before it
        if (lastErrorLine === errorLocation.line) {
            cleanedTemplate = cleanedTemplate
                .split('\n')
                .filter((_, i) => i !== Math.max(errorStartLine - 1, 0))
                .join('\n');
        }
        return {
            cleanedTemplate,
            errorLocation,
            lastErrorLine,
            errorStartLine
        };
    }
    escapeExceptHandlebars(template) {
        const parts = template.split(/({{[\s\S]*?}})/);
        return parts
            .map(part => {
            if (part.startsWith('{{') && part.endsWith('}}')) {
                return part; // leave handlebars expression as is
            }
            else {
                return handlebarsExports.escapeExpression(part); // escape non-handlebars text
            }
        })
            .join('');
    }
    convertMarkdown(markdownText) {
        return micromark(markdownText, this.options.markdownOptions);
    }
    ;
}
MarkdownHandlebars.defaultOptions = {
    errorHandler: (exp) => { console.error(exp); },
    template: '',
    handlebarsOptions: {
        noEscape: true,
    },
    handlebarsHelpers: customHelpers,
    handlebarsRuntimeOptions: {},
    markdownOptions: {
        allowDangerousHtml: true,
        extensions: [gfm()],
        htmlExtensions: [gfmHtml()],
    }
};

export { MarkdownHandlebars as default };
