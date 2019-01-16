'use strict';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var crypt = createCommonjsModule(function (module) {
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();
});

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

var charenc_1 = charenc;

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
var isBuffer_1 = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
};

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

var md5 = createCommonjsModule(function (module) {
(function(){
  var crypt$$1 = crypt,
      utf8 = charenc_1.utf8,
      isBuffer = isBuffer_1,
      bin = charenc_1.bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt$$1.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt$$1.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt$$1.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt$$1.bytesToHex(digestbytes);
  };

})();
});

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

var _baseRange = baseRange;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_1(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite;

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && _isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toFinite_1(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite_1(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : toFinite_1(step);
    return _baseRange(start, end, step, fromRight);
  };
}

var _createRange = createRange;

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = _createRange();

var range_1 = range;

/**
 * The base implementation of methods like `_.findKey` and `_.findLastKey`,
 * without support for iteratee shorthands, which iterates over `collection`
 * using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFindKey(collection, predicate, eachFunc) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = key;
      return false;
    }
  });
  return result;
}

var _baseFindKey = baseFindKey;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$1.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1$1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1$1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$2.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$6 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$4).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map$1 = _getNative(_root, 'Map');

var _Map = Map$1;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Built-in value references. */
var Uint8Array$1 = _root.Uint8Array;

var _Uint8Array = Uint8Array$1;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$1:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$1:
      var convert = _mapToArray;

    case setTag$1:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView$1 = _getNative(_root, 'DataView');

var _DataView = DataView$1;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1$1(object)) {
    if (!isBuffer_1$1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * This method is like `_.find` except that it returns the key of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Object
 * @param {Object} object The object to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {string|undefined} Returns the key of the matched element,
 *  else `undefined`.
 * @example
 *
 * var users = {
 *   'barney':  { 'age': 36, 'active': true },
 *   'fred':    { 'age': 40, 'active': false },
 *   'pebbles': { 'age': 1,  'active': true }
 * };
 *
 * _.findKey(users, function(o) { return o.age < 40; });
 * // => 'barney' (iteration order is not guaranteed)
 *
 * // The `_.matches` iteratee shorthand.
 * _.findKey(users, { 'age': 1, 'active': true });
 * // => 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findKey(users, ['active', false]);
 * // => 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.findKey(users, 'active');
 * // => 'barney'
 */
function findKey(object, predicate) {
  return _baseFindKey(object, _baseIteratee(predicate, 3), _baseForOwn);
}

var findKey_1 = findKey;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

var _baseSlice = baseSlice;

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : _baseSlice(array, start, end);
}

var _castSlice = castSlice;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

var _hasUnicode = hasUnicode;

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

var _asciiToArray = asciiToArray;

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']',
    rsCombo = '[' + rsComboRange$1 + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange$1 + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange$1 + ']?',
    rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

var _unicodeToArray = unicodeToArray;

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return _hasUnicode(string)
    ? _unicodeToArray(string)
    : _asciiToArray(string);
}

var _stringToArray = stringToArray;

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString_1(string);

    var strSymbols = _hasUnicode(string)
      ? _stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? _castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

var _createCaseFirst = createCaseFirst;

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = _createCaseFirst('toUpperCase');

var upperFirst_1 = upperFirst;

var RPC = {
  set updateHost(serverDomain) {
    this.HOST = "http://".concat(serverDomain);
  },

  HOST: '',
  // #911 Changing from https to http for failling to dowload the app with the link generated in Build App
  VERSION: 7,
  FLAG: 0,
  PERMUTATION_ID: '7AE84014EED0488F78262D5749511FEF',
  // from request
  TYPE: {
    STRING: 'string',
    ARRAY: 'array',
    USER_PROJECT: 'userProject',
    USER_CONFIG: 'userConfig',
    SPLASH_CONFIG: 'splashConfig',
    USER: 'user'
  }
}; // Policy Name comes from /build/war/WEB-INF/deploy/ode/rpcPolicyManifest/manifest.txt

var Services = {
  project: {
    base: '/ode',
    url: '/projects',
    policyName: '7F6F811841FB3811235257087F428B2E',
    serviceFile: 'com.google.appinventor.shared.rpc.project.ProjectService'
  },
  userinfo: {
    base: '/ode',
    url: '/userinfo',
    policyName: 'EC4DFDD74084038EAFEE6A4690210EBA',
    serviceFile: 'com.google.appinventor.shared.rpc.user.UserInfoService'
  },
  component: {
    base: '/ode',
    url: '/components',
    policyName: '8BFF2A4E0FB0DA76103F79F8597CCA7B',
    serviceFile: 'com.google.appinventor.shared.rpc.component.ComponentService'
  }
}; // ODE Policy Name comes from /build/war/ode/*.gwt.rpc

var Types = {
  int: 'I',
  long: 'J',
  boolean: 'Z',
  string: 'java.lang.String/2004016611',
  list: 'java.util.List',
  map: 'java.util.TreeMap/1493889780',
  array: 'java.util.ArrayList/4159755760',
  userProject: 'com.google.appinventor.shared.rpc.project.UserProject/4051224674',
  config: 'com.google.appinventor.shared.rpc.user.Config/3292205648',
  splashConfig: 'com.google.appinventor.shared.rpc.user.SplashConfig/917897862',
  user: 'com.google.appinventor.shared.rpc.user.User/3130036066',
  youngAndroidAssetNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidAssetNode/3698939010',
  youngAndroidAssetsFolder: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidAssetsFolder/3524809606',
  youngAndroidBlocksNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidBlocksNode/1973959899',
  youngAndroidComponentsFolder: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidComponentsFolder/4058810426',
  youngAndroidComponentNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidComponentNode/327788452',
  youngAndroidFormNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidFormNode/3242031682',
  youngAndroidPackageNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidPackageNode/404162700',
  youngAndroidProjectNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidProjectNode/3999559536',
  youngAndroidSourceFolderNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidSourceFolderNode/1539202537',
  youngAndroidYailNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidYailNode/3020652743',
  checksumedLoadFile: 'com.google.appinventor.shared.rpc.project.ChecksumedLoadFile/4017192298',
  newProjectParameters: 'com.google.appinventor.shared.rpc.project.youngandroid.NewYoungAndroidProjectParameters/3790764037',
  fileDescriptorWithContent: 'com.google.appinventor.shared.rpc.project.FileDescriptorWithContent/2971559239',
  rpcResult: 'com.google.appinventor.shared.rpc.RpcResult/2898401967',
  componentImportResponse: 'com.google.appinventor.shared.rpc.component.ComponentImportResponse/707947127'
};

function getString(strArr, dataArr) {
  var v = parseInt(dataArr.pop(), 10);
  return v <= 0 ? null : strArr[v - 1];
}
function parseData(_x, _x2) {
  return _parseData.apply(this, arguments);
}

function _parseData() {
  _parseData = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(strData, json) {
    var str, numOfItems, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, n, key, importClass, model, Model, defaultExport;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            str = getString(strData, json);
            _context.t0 = str;
            _context.next = _context.t0 === Types.array ? 4 : _context.t0 === Types.string ? 38 : 39;
            break;

          case 4:
            numOfItems = parseInt(json.pop(), 10);

            if (!(numOfItems === 0)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", []);

          case 7:
            result = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 11;
            _iterator = range_1(numOfItems)[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 23;
              break;
            }

            n = _step.value;
            _context.t1 = result;
            _context.next = 18;
            return parseData(strData, json);

          case 18:
            _context.t2 = _context.sent;

            _context.t1.push.call(_context.t1, _context.t2);

          case 20:
            _iteratorNormalCompletion = true;
            _context.next = 13;
            break;

          case 23:
            _context.next = 29;
            break;

          case 25:
            _context.prev = 25;
            _context.t3 = _context["catch"](11);
            _didIteratorError = true;
            _iteratorError = _context.t3;

          case 29:
            _context.prev = 29;
            _context.prev = 30;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 32:
            _context.prev = 32;

            if (!_didIteratorError) {
              _context.next = 35;
              break;
            }

            throw _iteratorError;

          case 35:
            return _context.finish(32);

          case 36:
            return _context.finish(29);

          case 37:
            return _context.abrupt("return", result);

          case 38:
            return _context.abrupt("return", getString(strData, json));

          case 39:
            key = findKey_1(Types, function (type) {
              return type === str;
            });

            if (key) {
              _context.next = 42;
              break;
            }

            return _context.abrupt("return", str);

          case 42:
            importClass = upperFirst_1(key);
            _context.next = 45;
            return Promise.resolve(require("appinventor-adapter"));

          case 45:
            model = _context.sent;
            Model = model[importClass];
            defaultExport = Model.default;

            if (!defaultExport) {
              _context.next = 50;
              break;
            }

            return _context.abrupt("return", new defaultExport(strData, json));

          case 50:
            return _context.abrupt("return", new Model(strData, json));

          case 51:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[11, 25, 29, 37], [30,, 32, 36]]);
  }));
  return _parseData.apply(this, arguments);
}

var ChecksumedLoadFile =
/*#__PURE__*/
function () {
  function ChecksumedLoadFile(strData, arr) {
    _classCallCheck(this, ChecksumedLoadFile);

    if (strData && arr) {
      this.checksum = getString(strData, arr);
      this.content = getString(strData, arr);
    }
  }

  _createClass(ChecksumedLoadFile, [{
    key: "getContent",
    value: function getContent() {
      var bytes = this.content.split('').map(function (x) {
        return x.charCodeAt(0);
      });
      var hexVal = md5(bytes);

      if (hexVal !== this.checksum) {
        throw new Error("Checksum doesn't match: ".concat(hexVal, " ").concat(this.checksum));
      }

      return this.content;
    }
  }]);

  return ChecksumedLoadFile;
}();
module.exports = exports["default"];

var FileDescriptorWithContent = function FileDescriptorWithContent(content, fileId, projectId) {
  _classCallCheck(this, FileDescriptorWithContent);

  this.content = content;
  this.fileId = fileId;
  this.projectId = projectId;
};
module.exports = exports["default"];

var NewProjectParameters = function NewProjectParameters(packageName, formName) {
  _classCallCheck(this, NewProjectParameters);

  this.formName = formName;
  this.packageName = packageName;
};
module.exports = exports["default"];

var RpcResult = function RpcResult(strData, arr) {
  var _this = this;

  _classCallCheck(this, RpcResult);

  _defineProperty(this, "succeeded", function () {
    return _this.result === RpcResult.SUCCESS;
  });

  _defineProperty(this, "failed", function () {
    return _this.result !== RpcResult.SUCCESS;
  });

  if (strData && arr) {
    this.error = getString(strData, arr);
    this.extra = getString(strData, arr);
    this.output = getString(strData, arr);
    this.result = arr.pop();
  }
};

_defineProperty(RpcResult, "SUCCESS", 0);
module.exports = exports["default"];

var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_='; // long to base64

var encode64 = function encode64(inputNum) {
  if (typeof inputNum !== 'number') {
    throw new Error("This is not a number: ".concat(inputNum));
  }

  var input = inputNum;
  var output = '';

  while (input >= 64) {
    var remainder = input % 64;
    input = Math.floor(input / 64);
    output = keyStr.charAt(remainder) + output;
  }

  output = keyStr.charAt(input) + output;
  return output;
}; // base64 to long

var decode64 = function decode64(input) {
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9$_=]/g;

  if (base64test.exec(input)) {
    throw new Error('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');
  }

  var i = input.length - 1;
  var num = 0;

  do {
    num += keyStr.indexOf(input[i]) * Math.pow(64, input.length - i - 1);
    i -= 1;
  } while (i >= 0);

  return num;
};

var UserProject = function UserProject(strData, arr) {
  var _this = this;

  _classCallCheck(this, UserProject);

  _defineProperty(this, "getBase64Id", function () {
    return encode64(_this.projectId);
  });

  if (strData && arr) {
    this.attributionId = decode64(arr.pop()); // "A" = null

    this.creationDate = decode64(arr.pop()); // encoded date

    this.galleryId = decode64(arr.pop()); // "A" = null

    this.modificationDate = decode64(arr.pop()); // encoded date

    this.projectId = decode64(arr.pop());
    this.projectName = getString(strData, arr);
    this.projectType = getString(strData, arr);
  }
};
module.exports = exports["default"];

var ProjectNode = function ProjectNode(parent) {
  _classCallCheck(this, ProjectNode);

  this.children = [];
  this.fileId = '';
  this.name = '';
  this.parent = parent;
};
module.exports = exports["default"];

var YoungAndroidAssetNode =
/*#__PURE__*/
function (_ProjectNode) {
  _inherits(YoungAndroidAssetNode, _ProjectNode);

  function YoungAndroidAssetNode() {
    _classCallCheck(this, YoungAndroidAssetNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(YoungAndroidAssetNode).apply(this, arguments));
  }

  return YoungAndroidAssetNode;
}(ProjectNode);
module.exports = exports["default"];

var YoungAndroidBlocksNode =
/*#__PURE__*/
function (_ProjectNode) {
  _inherits(YoungAndroidBlocksNode, _ProjectNode);

  function YoungAndroidBlocksNode() {
    _classCallCheck(this, YoungAndroidBlocksNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(YoungAndroidBlocksNode).apply(this, arguments));
  }

  return YoungAndroidBlocksNode;
}(ProjectNode);
module.exports = exports["default"];

var YoungAndroidComponentNode =
/*#__PURE__*/
function (_ProjectNode) {
  _inherits(YoungAndroidComponentNode, _ProjectNode);

  function YoungAndroidComponentNode() {
    _classCallCheck(this, YoungAndroidComponentNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(YoungAndroidComponentNode).apply(this, arguments));
  }

  return YoungAndroidComponentNode;
}(ProjectNode);
module.exports = exports["default"];

var YoungAndroidFormNode =
/*#__PURE__*/
function (_ProjectNode) {
  _inherits(YoungAndroidFormNode, _ProjectNode);

  function YoungAndroidFormNode() {
    _classCallCheck(this, YoungAndroidFormNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(YoungAndroidFormNode).apply(this, arguments));
  }

  return YoungAndroidFormNode;
}(ProjectNode);
module.exports = exports["default"];

(function(self) {

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    };

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue+','+value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) { items.push(name); });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) { items.push(value); });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) { items.push([name, value]); });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (typeof input === 'string') {
      this.url = input;
    } else {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split('\r\n').forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : window);

var reducer = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.routerReducer = routerReducer;
/**
 * This action type will be dispatched when your history
 * receives a location change.
 */
var LOCATION_CHANGE = exports.LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

var initialState = {
  locationBeforeTransitions: null
};

/**
 * This reducer will update the state with the most recent location history
 * has transitioned to. This may not be in sync with the router, particularly
 * if you have asynchronously-loaded routes, so reading from and relying on
 * this state is discouraged.
 */
function routerReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      type = _ref.type,
      payload = _ref.payload;

  if (type === LOCATION_CHANGE) {
    return _extends({}, state, { locationBeforeTransitions: payload });
  }

  return state;
}
});

unwrapExports(reducer);
var reducer_1 = reducer.routerReducer;
var reducer_2 = reducer.LOCATION_CHANGE;

var actions = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */
var CALL_HISTORY_METHOD = exports.CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';

function updateLocation(method) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return {
      type: CALL_HISTORY_METHOD,
      payload: { method: method, args: args }
    };
  };
}

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
var push = exports.push = updateLocation('push');
var replace = exports.replace = updateLocation('replace');
var go = exports.go = updateLocation('go');
var goBack = exports.goBack = updateLocation('goBack');
var goForward = exports.goForward = updateLocation('goForward');

var routerActions = exports.routerActions = { push: push, replace: replace, go: go, goBack: goBack, goForward: goForward };
});

unwrapExports(actions);
var actions_1 = actions.CALL_HISTORY_METHOD;
var actions_2 = actions.push;
var actions_3 = actions.replace;
var actions_4 = actions.go;
var actions_5 = actions.goBack;
var actions_6 = actions.goForward;
var actions_7 = actions.routerActions;

var sync = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = syncHistoryWithStore;



var defaultSelectLocationState = function defaultSelectLocationState(state) {
  return state.routing;
};

/**
 * This function synchronizes your history state with the Redux store.
 * Location changes flow from history to the store. An enhanced history is
 * returned with a listen method that responds to store updates for location.
 *
 * When this history is provided to the router, this means the location data
 * will flow like this:
 * history.push -> store.dispatch -> enhancedHistory.listen -> router
 * This ensures that when the store state changes due to a replay or other
 * event, the router will be updated appropriately and can transition to the
 * correct router state.
 */
function syncHistoryWithStore(history, store) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$selectLocationSt = _ref.selectLocationState,
      selectLocationState = _ref$selectLocationSt === undefined ? defaultSelectLocationState : _ref$selectLocationSt,
      _ref$adjustUrlOnRepla = _ref.adjustUrlOnReplay,
      adjustUrlOnReplay = _ref$adjustUrlOnRepla === undefined ? true : _ref$adjustUrlOnRepla;

  // Ensure that the reducer is mounted on the store and functioning properly.
  if (typeof selectLocationState(store.getState()) === 'undefined') {
    throw new Error('Expected the routing state to be available either as `state.routing` ' + 'or as the custom expression you can specify as `selectLocationState` ' + 'in the `syncHistoryWithStore()` options. ' + 'Ensure you have added the `routerReducer` to your store\'s ' + 'reducers via `combineReducers` or whatever method you use to isolate ' + 'your reducers.');
  }

  var initialLocation = void 0;
  var isTimeTraveling = void 0;
  var unsubscribeFromStore = void 0;
  var unsubscribeFromHistory = void 0;
  var currentLocation = void 0;

  // What does the store say about current location?
  var getLocationInStore = function getLocationInStore(useInitialIfEmpty) {
    var locationState = selectLocationState(store.getState());
    return locationState.locationBeforeTransitions || (useInitialIfEmpty ? initialLocation : undefined);
  };

  // Init initialLocation with potential location in store
  initialLocation = getLocationInStore();

  // If the store is replayed, update the URL in the browser to match.
  if (adjustUrlOnReplay) {
    var handleStoreChange = function handleStoreChange() {
      var locationInStore = getLocationInStore(true);
      if (currentLocation === locationInStore || initialLocation === locationInStore) {
        return;
      }

      // Update address bar to reflect store state
      isTimeTraveling = true;
      currentLocation = locationInStore;
      history.transitionTo(_extends({}, locationInStore, {
        action: 'PUSH'
      }));
      isTimeTraveling = false;
    };

    unsubscribeFromStore = store.subscribe(handleStoreChange);
    handleStoreChange();
  }

  // Whenever location changes, dispatch an action to get it in the store
  var handleLocationChange = function handleLocationChange(location) {
    // ... unless we just caused that location change
    if (isTimeTraveling) {
      return;
    }

    // Remember where we are
    currentLocation = location;

    // Are we being called for the first time?
    if (!initialLocation) {
      // Remember as a fallback in case state is reset
      initialLocation = location;

      // Respect persisted location, if any
      if (getLocationInStore()) {
        return;
      }
    }

    // Tell the store to update by dispatching an action
    store.dispatch({
      type: reducer.LOCATION_CHANGE,
      payload: location
    });
  };
  unsubscribeFromHistory = history.listen(handleLocationChange);

  // History 3.x doesn't call listen synchronously, so fire the initial location change ourselves
  if (history.getCurrentLocation) {
    handleLocationChange(history.getCurrentLocation());
  }

  // The enhanced history uses store as source of truth
  return _extends({}, history, {
    // The listeners are subscribed to the store instead of history
    listen: function listen(listener) {
      // Copy of last location.
      var lastPublishedLocation = getLocationInStore(true);

      // Keep track of whether we unsubscribed, as Redux store
      // only applies changes in subscriptions on next dispatch
      var unsubscribed = false;
      var unsubscribeFromStore = store.subscribe(function () {
        var currentLocation = getLocationInStore(true);
        if (currentLocation === lastPublishedLocation) {
          return;
        }
        lastPublishedLocation = currentLocation;
        if (!unsubscribed) {
          listener(lastPublishedLocation);
        }
      });

      // History 2.x listeners expect a synchronous call. Make the first call to the
      // listener after subscribing to the store, in case the listener causes a
      // location change (e.g. when it redirects)
      if (!history.getCurrentLocation) {
        listener(lastPublishedLocation);
      }

      // Let user unsubscribe later
      return function () {
        unsubscribed = true;
        unsubscribeFromStore();
      };
    },


    // It also provides a way to destroy internal listeners
    unsubscribe: function unsubscribe() {
      if (adjustUrlOnReplay) {
        unsubscribeFromStore();
      }
      unsubscribeFromHistory();
    }
  });
}
});

unwrapExports(sync);

var middleware = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = routerMiddleware;



function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
function routerMiddleware(history) {
  return function () {
    return function (next) {
      return function (action) {
        if (action.type !== actions.CALL_HISTORY_METHOD) {
          return next(action);
        }

        var _action$payload = action.payload,
            method = _action$payload.method,
            args = _action$payload.args;

        history[method].apply(history, _toConsumableArray(args));
      };
    };
  };
}
});

unwrapExports(middleware);

var lib = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routerMiddleware = exports.routerActions = exports.goForward = exports.goBack = exports.go = exports.replace = exports.push = exports.CALL_HISTORY_METHOD = exports.routerReducer = exports.LOCATION_CHANGE = exports.syncHistoryWithStore = undefined;



Object.defineProperty(exports, 'LOCATION_CHANGE', {
  enumerable: true,
  get: function get() {
    return reducer.LOCATION_CHANGE;
  }
});
Object.defineProperty(exports, 'routerReducer', {
  enumerable: true,
  get: function get() {
    return reducer.routerReducer;
  }
});



Object.defineProperty(exports, 'CALL_HISTORY_METHOD', {
  enumerable: true,
  get: function get() {
    return actions.CALL_HISTORY_METHOD;
  }
});
Object.defineProperty(exports, 'push', {
  enumerable: true,
  get: function get() {
    return actions.push;
  }
});
Object.defineProperty(exports, 'replace', {
  enumerable: true,
  get: function get() {
    return actions.replace;
  }
});
Object.defineProperty(exports, 'go', {
  enumerable: true,
  get: function get() {
    return actions.go;
  }
});
Object.defineProperty(exports, 'goBack', {
  enumerable: true,
  get: function get() {
    return actions.goBack;
  }
});
Object.defineProperty(exports, 'goForward', {
  enumerable: true,
  get: function get() {
    return actions.goForward;
  }
});
Object.defineProperty(exports, 'routerActions', {
  enumerable: true,
  get: function get() {
    return actions.routerActions;
  }
});



var _sync2 = _interopRequireDefault(sync);



var _middleware2 = _interopRequireDefault(middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports.syncHistoryWithStore = _sync2['default'];
exports.routerMiddleware = _middleware2['default'];
});

unwrapExports(lib);
var lib_1 = lib.routerMiddleware;
var lib_2 = lib.routerActions;
var lib_3 = lib.goForward;
var lib_4 = lib.goBack;
var lib_5 = lib.go;
var lib_6 = lib.replace;
var lib_7 = lib.push;
var lib_8 = lib.CALL_HISTORY_METHOD;
var lib_9 = lib.routerReducer;
var lib_10 = lib.LOCATION_CHANGE;
var lib_11 = lib.syncHistoryWithStore;

/** `Object#toString` result references. */
var numberTag$2 = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike_1(value) && _baseGetTag(value) == numberTag$2);
}

var isNumber_1 = isNumber;

function requestSerialize(service, rpcName) {
  var serviceData = Services[service]; // 7|0|

  var content = [RPC.VERSION, RPC.FLAG]; // request data

  var strData = [];
  var arrData = [];

  var insertStr = function insertStr(str) {
    var i = strData.indexOf(str);

    if (i === -1) {
      strData.push(str);
      arrData.push(strData.length);
    } else {
      arrData.push(i + 1);
    }
  };

  insertStr("".concat(RPC.HOST).concat(serviceData.base, "/")); // Servlet URL

  insertStr(serviceData.policyName); // Strong Name

  insertStr(serviceData.serviceFile); // Service Class

  insertStr(rpcName); // Service Method
  // number of params

  for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    params[_key - 2] = arguments[_key];
  }

  arrData.push(params.length);

  var pushType = function pushType(param) {
    if (typeof param === 'string') {
      insertStr(Types.string);
    } else if (typeof param === 'number') {
      insertStr(Math.abs(param) > 2147483647 ? Types.long : Types.int);
    } else if (typeof param === 'boolean') {
      insertStr(Types.boolean);
    } else if (isArray_1(param)) {
      insertStr(Types.list);
    } else if (param instanceof NewProjectParameters) {
      insertStr('com.google.appinventor.shared.rpc.project.NewProjectParameters');
    }
  };

  var pushValue = function pushValue(param) {
    if (typeof param === 'string') {
      insertStr(param.replace(/\|/g, '\\!'));
    } else if (typeof param === 'number') {
      arrData.push(Math.abs(param) > 2147483647 ? encode64(param) : param);
    } else if (typeof param === 'boolean') {
      arrData.push(param ? '1' : '0');
    } else if (isArray_1(param)) {
      insertStr(Types.array);
      arrData.push(param.length);
      param.forEach(function (data) {
        pushType(data);
        pushValue(data);
      });
    } else if (param instanceof NewProjectParameters) {
      insertStr(Types.newProjectParameters);
      insertStr(param.formName);
      insertStr(param.packageName);
    } else if (param instanceof FileDescriptorWithContent) {
      insertStr(Types.fileDescriptorWithContent);
      pushValue(param.content.replace(/\\/g, '\\\\'));
      pushValue(param.fileId);
      pushValue(param.projectId);
    }
  };

  if (params.length > 0) {
    params.forEach(function (param) {
      pushType(param);
    });
    params.forEach(function (param) {
      pushValue(param);
    });
  }

  content.push.apply(content, [strData.length].concat(strData, arrData));
  return "".concat(content.join('|'), "|");
}
function responseDeserialize(_x) {
  return _responseDeserialize.apply(this, arguments);
}

function _responseDeserialize() {
  _responseDeserialize = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(text) {
    var json, version, flag, strData, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (text.match('//OK')) {
              _context.next = 2;
              break;
            }

            throw new Error("RPC Response Error: ".concat(text));

          case 2:
            console.log(text.substr(4).replace(/"\+"/g, ''));
            json = JSON.parse(text.substr(4).replace(/"\+"/g, ''));
            version = json.pop();

            if (!(version !== RPC.VERSION)) {
              _context.next = 7;
              break;
            }

            throw new Error("RPC Version Not Match: ".concat(version));

          case 7:
            flag = json.pop();

            if (!(flag !== RPC.FLAG)) {
              _context.next = 10;
              break;
            }

            throw new Error("RPC Flag Not Match: ".concat(version));

          case 10:
            strData = json.pop();

            if (!(strData.length === 0 && json.length === 1)) {
              _context.next = 15;
              break;
            }

            if (!(isNumber_1(json[0]) && (json[0] === 0 || json[0] === 1))) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", json[0] === 1);

          case 14:
            return _context.abrupt("return", json[0]);

          case 15:
            _context.next = 17;
            return parseData(strData, json);

          case 17:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _responseDeserialize.apply(this, arguments);
}

var headerBase = {
  credentials: 'include',
  mode: 'cors'
};
/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status === 403) {
    // handle confirmTOS
    lib_7('/confirmTOS');
  } else if (response.status === 412) {
    // handle session timeout problem
    lib_7('/');
  }

  throw response;
}

function bodyText(response) {
  return Promise.resolve(response.text());
}

function fileUpload(url, name, file) {
  var formData = new FormData();
  formData.append(name, file);
  var requestURL = "".concat(RPC.HOST).concat(url);
  var options = Object.assign({
    method: 'POST',
    headers: {
      Accept: '*/*'
    },
    body: formData
  }, headerBase);
  return fetch(requestURL, options).then(checkStatus).then(bodyText);
}
function fileDownload(url) {
  var requestURL = "".concat(RPC.HOST).concat(url);

  try {
    window.location.assign(requestURL);
  } catch (err) {
    console.log('caught error of download', err, err.status);
  }
}
function post(url, body) {
  var requestURL = "".concat(RPC.HOST).concat(url);
  var options = Object.assign({
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  }, headerBase);
  return fetch(requestURL, options).then(checkStatus).then(bodyText);
}
function get$1(url) {
  var requestURL = "".concat(RPC.HOST).concat(url);
  var options = Object.assign({
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, headerBase);
  return fetch(requestURL, options).then(checkStatus).then(bodyText);
}
function rpc(service, rpcName) {
  var requestURL = "".concat(RPC.HOST).concat(Services[service].base).concat(Services[service].url);

  for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    params[_key - 2] = arguments[_key];
  }

  var body = requestSerialize.apply(void 0, [service, rpcName].concat(params));
  var options = Object.assign({
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'text/x-gwt-rpc; charset=UTF-8',
      'X-GWT-Module-Base': "".concat(RPC.HOST).concat(Services[service].base, "/"),
      'X-GWT-Permutation': RPC.PERMUTATION_ID
    },
    body: body
  }, headerBase); // options.headers['Content-Type'] = 'text/x-gwt-rpc; charset=UTF-8';

  return fetch(requestURL, options).then(checkStatus).then(bodyText).then(responseDeserialize);
}
function syncRpc(service, rpcName) {
  var request = new XMLHttpRequest();
  var requestURL = "".concat(RPC.HOST).concat(Services[service].base).concat(Services[service].url);

  for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    params[_key2 - 2] = arguments[_key2];
  }

  var body = requestSerialize.apply(void 0, [service, rpcName].concat(params));
  request.open('POST', requestURL, false);
  request.setRequestHeader('Accept', '*/*');
  request.setRequestHeader('Content-Type', 'text/x-gwt-rpc; charset=UTF-8');
  request.setRequestHeader('X-GWT-Module-Base', "".concat(RPC.HOST).concat(Services[service].base, "/"));
  request.setRequestHeader('X-GWT-Permutation', RPC.PERMUTATION_ID);
  request.withCredentials = true;
  request.send(body);
  return responseDeserialize(request.responseText);
}

var sessionTime = new Date().getTime();
/*
 * URIs for upload requests are structured as follows:
 *    /<baseurl>/upload/project/<projectname>}
 *    /<baseurl>/upload/file/<projectId>/<filePath>
 *    /<baseurl>/upload/userfile/<filePath>
 */

var uploadFile = function uploadFile(projectId, filePath, file) {
  var name = 'uploadFile';
  var url = "/ode/upload/file/".concat(projectId, "/").concat(filePath, "/").concat(file.name);
  sessionTime = new Date().getTime();
  return fileUpload(url, name, file);
};
var uploadComponent = function uploadComponent(file) {
  var name = 'uploadComponentArchive';
  var url = "/ode/upload/component/".concat(file.name);
  return fileUpload(url, name, file);
};
var uploadProject = function uploadProject(file) {
  var name = 'uploadProjectArchive';
  var url = "/ode/upload/project/".concat(file.name.substring(0, file.name.lastIndexOf('.')));
  return fileUpload(url, name, file);
};
var uploadUserFile = function uploadUserFile(file) {
  var name = 'uploadUserFile';
  var url = '/ode/upload/userfile/android.keystore';
  return fileUpload(url, name, file);
};
var getDownloadAssetsUrl = function getDownloadAssetsUrl(projectId, fileId) {
  return "/ode/download/file/".concat(projectId, "/assets/").concat(fileId, "?t=").concat(sessionTime);
};
var getDownloadExtensionsUrl = function getDownloadExtensionsUrl(projectId, packageName, iconName) {
  return "/ode/download/file/".concat(projectId, "/assets/external_comps/").concat(packageName, "/").concat(iconName, "?t=").concat(sessionTime);
};
var getDownloadFileUrl = function getDownloadFileUrl(projectId, fileId) {
  var timeStamp = new Date().getTime();
  return "/ode/download/file/".concat(projectId, "/").concat(fileId, "?t=").concat(timeStamp);
};
var downloadFile = function downloadFile(projectId, fileId) {
  return fileDownload(getDownloadFileUrl(projectId, fileId));
};
var downloadKeystore = function downloadKeystore() {
  return fileDownload('/ode/download/userfile/android.keystore');
};
var downloadProjectOutput = function downloadProjectOutput(projectId, target) {
  var url = "/ode/download/project-output/".concat(projectId, "/").concat(target);
  return fileDownload(url);
};
var downloadProject = function downloadProject(projectId) {
  var url = "/ode/download/project-source/".concat(projectId);
  return fileDownload(url);
};

/**
 * Returns a list of project infos.
 * @return list of project infos found by the back-end
 */

var getProjectInfos = function getProjectInfos() {
  return rpc('project', 'getProjectInfos');
};
/**
 * Reads the template data from a JSON File
 * @param pathToTemplatesDir pathname of the templates directory which may contain
 *  0 or more template instances, each of which consists of a JSON file describing
 *  the template, plus a zip file and image files.
 *
 * @return a {@link String} or the template data
 */

var retrieveTemplateData = function retrieveTemplateData() {
  return rpc('project', 'retrieveTemplateData', 'templates/');
};
/**
 * Returns a string with the project settings.
 * @param projectId  project ID
 *
 * @return  settings
 */

var loadProjectSettings = function loadProjectSettings(projectId) {
  return rpc('project', 'loadProjectSettings', projectId);
};
/**
 * Stores a string with the project settings.
 * @param sessionId current session id
 * @param projectId  project ID
 * @param settings  project settings
 */

var storeProjectSettings = function storeProjectSettings(sessionId, projectId, settings) {
  return rpc('project', 'storeProjectSettings', sessionId, projectId, settings);
};
/**
 * Returns the root node for the given project.
 * @param projectId  project ID as received by
 *                   {@link #getProjects()}
 *
 * @return  root node of project
 */

var getProject = function getProject(projectId) {
  return rpc('project', 'getProject', projectId);
};
/**
 * Loads the file information associated with a node in the project tree. The
 * actual return value depends on the file kind. Source (text) files should
 * typically return their contents. Image files will be more likely to return
 * the URL that the browser can find them at.
 *
 * This version returns a ChecksumedLoadFile which includes the file content
 * and a checksum (MD5) of the content to detect silent network corruption
 *
 * @param projectId  project ID
 * @param fileId  project node whose source should be loaded
 *
 * @return  checksummed file object
 */

var load2 = function load2(projectId, fileId) {
  return rpc('project', 'load2', projectId, fileId);
};
/**
 * Loads the file information associated with a node in the project tree. The
 * actual return value is the raw file contents encoded as base64.
 *
 * @param projectId  project ID
 * @param fileId  project node whose source should be loaded
 *
 * @return  raw file content as base 64
 */

var loadraw2 = function loadraw2(projectId, fileId) {
  return rpc('project', 'loadraw2', projectId, fileId);
};
/**
 * Deletes a file in the given project.
 * @param sessionId current session id
 * @param projectId  project ID
 * @param fileId  ID of file to delete
 * @return modification date for project
 */

var deleteFile = function deleteFile(sessionId, projectId, fileId) {
  return rpc('project', 'deleteFile', sessionId, projectId, fileId);
};
/**
 * Deletes all files and folders that are contained inside the given directory. The given directory itself is deleted.
 * @param sessionId session id
 * @param projectId project ID
 * @param directory path of the directory
 * @return modification date for project
 */

var deleteFolder = function deleteFolder(sessionId, projectId, directory) {
  return rpc('project', 'deleteFolder', sessionId, projectId, directory);
};
/**
 * Saves the content of the file associated with a node in the project tree.
 * This version can throw a BlocksTruncatedException if an attempt is made to
 * save a trivial blocks file.
 *
 * @param sessionId current session id
 * @param projectId  project ID
 * @param fileId  project node whose source should be saved
 * @param force TODO: what's that!?
 * @param content  content to be saved
 * @return modification date for project
 *
 * @see #load(long, String)
 */

var save2 = function save2(sessionId, projectId, fileId, force, content, isSync) {
  if (isSync) {
    return syncRpc('project', 'save2', sessionId, projectId, fileId, force, content);
  }

  return rpc('project', 'save2', sessionId, projectId, fileId, force, content);
};
/**
 * Deletes a project.
 *
 * @param userId the user id
 * @param projectId  project ID as received by
 */

var deleteProject = function deleteProject(projectId) {
  return rpc('project', 'deleteProject', projectId);
};
/**
 * Adds a file to the given project.
 *
 * @param projectId  project ID
 * @param fileId  ID of file to delete
 * @return modification date for project
 */

var addFile = function addFile(projectId, fileId) {
  return rpc('project', 'addFile', projectId, fileId);
};
/**
 * Creates a new project.
 * @param projectType type of new project
 * @param projectName name of new project
 * @param params optional parameters (project type dependent)
 *
 * @return a {@link UserProject} for new project
 */

var newProject = function newProject(projectType, projectName, params) {
  return rpc('project', 'newProject', projectType, projectName, params);
};
/**
 * Copies a project with a new name.
 *
 * @param userId the user id
 * @param oldProjectId  old project ID
 * @param newName new project name
 */

var copyProject = function copyProject(oldProjectId, newName) {
  return rpc('project', 'copyProject', oldProjectId, newName);
};
/**
 * Saves the contents of multiple files.
 *
 * @param sessionId session id
 * @param filesAndContent  list containing file descriptors and their
 *                         associated content
 * @return modification date for last modified project of list
 */

var save = function save(sessionId, filesAndContent) {
  return rpc('project', 'save', sessionId, filesAndContent);
};
/**
 * Invokes a build command for the project on the back-end.
 *
 * @param projectId  project ID
 * @param nonce used to access the built project -- random string
 * @param target  build target (optional, implementation dependent)
 * @param secondBuildserver whether to use the second buildserver
 *
 * @return  results of invoking the build command
 */

var build = function build(projectId, nonce, target, secondBuildServer) {
  return rpc('project', 'build', projectId, nonce, target, secondBuildServer);
};
/**
 * Gets the result of a build command for the project from the back-end.
 *
 * @param projectId  project ID
 * @param target  build target (optional, implementation dependent)
 *
 * @return  results of build. The following values may be in RpcResult.result:
 *            0: Build is done and was successful
 *            1: Build is done and was unsuccessful
 *           -1: Build is not yet done.
 */

var getBuildResult = function getBuildResult(projectId, target) {
  return rpc('project', 'getBuildResult', projectId, target);
};
/**
 * Creates a new project from a zip file that is stored on the server.
 * @param projectName name of new project
 * @param pathToZip path to the zip files
 *
 * @return a {@link UserProject} for new project
 */

var newProjectFromTemplate = function newProjectFromTemplate(projectName, pathToZip) {
  return rpc('project', 'newProjectFromTemplate', projectName, pathToZip);
};

// res.status === 302
// });

var acceptTOS = function acceptTOS() {
  return post('/ode/accept_tos');
};

/**
 * Import the component to the project in the server and
 * return a list of ProjectNode that can be added to the client
 *
 * @param fileOrUrl the url of the component file or filename of temp file
 * @param projectId id of the project to which the component will be added
 * @param folderPath folder to which the component will be stored
 * @return a list of ProjectNode created from the component
 */

var importComponentToProject = function importComponentToProject(fileOrUrl, projectId, folderPath) {
  return rpc('component', 'importComponentToProject', fileOrUrl, projectId, folderPath);
}; // /**
//  * Rename the short name of an imported component
//  *
//  * @param fullyQualifiedName the fully qualified name of the component
//  * @param newName new short name
//  * @param projectId id of the project where the component was imported
//  */
// export const renameImportedComponent = (fullyQualifiedName, newName, projectId) => rpc('component', 'renameImportedComponent', fullyQualifiedName, newName, projectId);
//
// /**
//  * Delete the files of an imported component
//  *
//  * @param fullyQualifiedName the fully qualified name of the component
//  * @param projectId id of the project where the component was imported
//  */
// export const deleteImportedComponent = (fullyQualifiedName, projectId) => rpc('component', 'deleteImportedComponent', fullyQualifiedName, projectId);

/**
 * @params String - session id
 * @returns SystemConfig - including user information record
 */

var getSystemConfig = function getSystemConfig(sessionId) {
  return rpc('userinfo', 'getSystemConfig', sessionId);
};
/**
 * Retrieve's the stored Backpack
 *
 * @return the backpack as an xml string
 */


var getUserBackpack = function getUserBackpack() {
  return rpc('userinfo', 'getUserBackpack');
};
/**
 * Retrieves the user's settings.
 *
 * @return  user's settings
 */


var loadUserSettings = function loadUserSettings() {
  return rpc('userinfo', 'loadUserSettings');
};
/**
 * Store the user's backpack
 * @param backpack string containing the backpack xml
 */


var storeUserBackpack = function storeUserBackpack(backpack) {
  return rpc('userinfo', 'storeUserBackpack', backpack);
};
/**
 * Stores the user's settings.
 * @param settings  user's settings
 */


var storeUserSettings = function storeUserSettings(userSettings) {
  return rpc('userinfo', 'storeUserSettings', userSettings);
};

var hasUserFile = function hasUserFile(fileName) {
  return rpc('userinfo', 'hasUserFile', fileName);
};

var deleteUserFile = function deleteUserFile(fileName) {
  return rpc('userinfo', 'deleteUserFile', fileName);
};

var UserInfo = {
  getSystemConfig: getSystemConfig,
  getUserBackpack: getUserBackpack,
  loadUserSettings: loadUserSettings,
  storeUserBackpack: storeUserBackpack,
  storeUserSettings: storeUserSettings,
  hasUserFile: hasUserFile,
  deleteUserFile: deleteUserFile
};
module.exports = exports["default"];

var DEFAULT_LOCALE = 'zh-Hans';

var loginOAuth = function loginOAuth(googleTokenId) {
  return post('/login/googleOAuth2', "tokenId=".concat(googleTokenId));
};
var login = function login(email, password) {
  var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_LOCALE;
  return post('/login', "email=".concat(email, "&password=").concat(password, "&locale=").concat(locale));
};
var logout = function logout() {
  return get$1('/ode/_logout?return=json');
}; // export const isLogged = () => !!document.cookie.match(/.*AppInventor=.*/);

var componentTypeJson = [{ "type": "com.google.appinventor.components.runtime.AccelerometerSensor",
  "name": "AccelerometerSensor",
  "external": "false",
  "version": "4",
  "dateBuilt": "2019-01-14T15:58:23+0800",
  "categoryString": "SENSORS",
  "helpString": "Non-visible component that can detect shaking and measure acceleration approximately in three dimensions using SI units (m\/s<sup>2<\/sup>).  The components are: <ul>\n<li> <strong>xAccel<\/strong>: 0 when the phone is at rest on a flat      surface, positive when the phone is tilted to the right (i.e.,      its left side is raised), and negative when the phone is tilted      to the left (i.e., its right size is raised).<\/li>\n <li> <strong>yAccel<\/strong>: 0 when the phone is at rest on a flat      surface, positive when its bottom is raised, and negative when      its top is raised. <\/li>\n <li> <strong>zAccel<\/strong>: Equal to -9.8 (earth's gravity in meters per      second per second when the device is at rest parallel to the ground      with the display facing up,      0 when perpendicular to the ground, and +9.8 when facing down.       The value can also be affected by accelerating it with or against      gravity. <\/li><\/ul>",
  "helpUrl": "",
  "showOnPalette": "true",
  "nonVisible": "true",
  "iconName": "images/accelerometersensor.png",
  "androidMinSdk": 7,
  "properties": [{ "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
    { "name": "LegacyMode", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
    { "name": "MinimumInterval", "editorType": "non_negative_integer", "defaultValue": "400", "editorArgs": []},
    { "name": "Sensitivity", "editorType": "accelerometer_sensitivity", "defaultValue": "2", "editorArgs": []}],
  "blockProperties": [{ "name": "Available", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
    { "name": "Enabled", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
    { "name": "LegacyMode", "description": "Prior to the release that added this property the AccelerometerSensor component passed through sensor values directly as received from the Android system. However these values do not compensate for tablets that default to Landscape mode, requiring the MIT App Inventor programmer to compensate. However compensating would result in incorrect results in Portrait mode devices such as phones. We now detect Landscape mode tablets and perform the compensation. However if your project is already compensating for the change, you will now get incorrect results. Although our preferred solution is for you to update your project, you can also just set this property to \u201ctrue\u201d and our compensation code will be deactivated. Note: We recommend that you update your project as we may remove this property in a future release.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
    { "name": "MinimumInterval", "description": "The minimum interval, in milliseconds, between phone shakes", "type": "number", "rw": "read-write", "deprecated": "false"},
    { "name": "Sensitivity", "description": "A number that encodes how sensitive the accelerometer is. The choices are: 1 = weak, 2 = moderate,  3 = strong.", "type": "number", "rw": "read-write", "deprecated": "false"},
    { "name": "XAccel", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
    { "name": "YAccel", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
    { "name": "ZAccel", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"}],
  "events": [{ "name": "AccelerationChanged", "description": "Indicates the acceleration changed in the X, Y, and\/or Z dimensions.", "deprecated": "false", "params": [{ "name": "xAccel", "type": "number"},{ "name": "yAccel", "type": "number"},{ "name": "zAccel", "type": "number"}]}
  ,
    { "name": "Shaking", "description": "Indicates the device started being shaken or continues to be shaken.", "deprecated": "false", "params": []}
  ],
  "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.ActivityStarter",
    "name": "ActivityStarter",
    "external": "false",
    "version": "6",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "CONNECTIVITY",
    "helpString": "A component that can launch an activity using the <code>StartActivity<\/code> method.<p>Activities that can be launched include: <ul> \n<li> starting other App Inventor for Android apps <\/li> \n<li> starting the camera application <\/li> \n<li> performing web search <\/li> \n<li> opening a browser to a specified web page<\/li> \n<li> opening the map application to a specified location<\/li><\/ul> \nYou can also launch activities that return text data.  See the documentation on using the Activity Starter for examples.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/activityStarter.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "Action", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ActivityClass", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ActivityPackage", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "DataType", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "DataUri", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ExtraKey", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ExtraValue", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ResultName", "editorType": "string", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "Action", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ActivityClass", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ActivityPackage", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "DataType", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "DataUri", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ExtraKey", "description": "Returns the extra key that will be passed to the activity.\nDEPRECATED: New code should use Extras property instead.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ExtraValue", "description": "Returns the extra value that will be passed to the activity.\nDEPRECATED: New code should use Extras property instead.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Extras", "description": "", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "Result", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "ResultName", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ResultType", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "ResultUri", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "ActivityCanceled", "description": "Event raised if this ActivityStarter returns because the activity was canceled.", "deprecated": "false", "params": []}
    ,
      { "name": "ActivityError", "description": "The ActivityError event is no longer used. Please use the Screen.ErrorOccurred event instead.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ,
      { "name": "AfterActivity", "description": "Event raised after this ActivityStarter returns.", "deprecated": "false", "params": [{ "name": "result", "type": "text"}]}
    ],
    "methods": [{ "name": "ResolveActivity", "description": "Returns the name of the activity that corresponds to this ActivityStarter, or an empty string if no corresponding activity can be found.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "StartActivity", "description": "Start the activity corresponding to this ActivityStarter.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Ball",
    "name": "Ball",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "ANIMATION",
    "helpString": "<p>A round 'sprite' that can be placed on a <code>Canvas<\/code>, where it can react to touches and drags, interact with other sprites (<code>ImageSprite<\/code>s and other <code>Ball<\/code>s) and the edge of the Canvas, and move according to its property values.<\/p><p>For example, to have a <code>Ball<\/code> move 4 pixels toward the top of a <code>Canvas<\/code> every 500 milliseconds (half second), you would set the <code>Speed<\/code> property to 4 [pixels], the <code>Interval<\/code> property to 500 [milliseconds], the <code>Heading<\/code> property to 90 [degrees], and the <code>Enabled<\/code> property to <code>True<\/code>.  These and its other properties can be changed at any time.<\/p><p>The difference between a Ball and an <code>ImageSprite<\/code> is that the latter can get its appearance from an image file, while a Ball's appearance can only be changed by varying its <code>PaintColor<\/code> and <code>Radius<\/code> properties.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Heading", "editorType": "float", "defaultValue": "0", "editorArgs": []},
      { "name": "Interval", "editorType": "non_negative_integer", "defaultValue": "100", "editorArgs": []},
      { "name": "PaintColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "Radius", "editorType": "non_negative_integer", "defaultValue": "5", "editorArgs": []},
      { "name": "Speed", "editorType": "float", "defaultValue": "0.0", "editorArgs": []},
      { "name": "Visible", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "X", "editorType": "float", "defaultValue": "0.0", "editorArgs": []},
      { "name": "Y", "editorType": "float", "defaultValue": "0.0", "editorArgs": []},
      { "name": "Z", "editorType": "float", "defaultValue": "1.0", "editorArgs": []}],
    "blockProperties": [{ "name": "Enabled", "description": "Controls whether the sprite moves when its speed is non-zero.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Heading", "description": "Returns the sprite's heading in degrees above the positive x-axis.  Zero degrees is toward the right of the screen; 90 degrees is toward the top of the screen.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Interval", "description": "The interval in milliseconds at which the sprite's position is updated.  For example, if the interval is 50 and the speed is 10, then the sprite will move 10 pixels every 50 milliseconds.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "PaintColor", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Radius", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Speed", "description": "he speed at which the sprite moves.  The sprite moves this many pixels every interval.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "True if the sprite is visible.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "X", "description": "The horizontal coordinate of the left edge of the sprite, increasing as the sprite moves to the right.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Y", "description": "The vertical coordinate of the top of the sprite, increasing as the sprite moves down.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Z", "description": "How the sprite should be layered relative to other sprits, with higher-numbered layers in front of lower-numbered layers.", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "CollidedWith", "description": "Handler for CollidedWith events, called when two sprites collide.\n Note that checking for collisions with a rotated ImageSprite currently\n checks against the sprite's unrotated position.  Therefore, collision\n checking will be inaccurate for tall narrow or short wide sprites that are\n rotated.", "deprecated": "false", "params": [{ "name": "other", "type": "component"}]}
    ,
      { "name": "Dragged", "description": "Handler for Dragged events.  On all calls, the starting coordinates\n are where the screen was first touched, and the \"current\" coordinates\n describe the endpoint of the current line segment.  On the first call\n within a given drag, the \"previous\" coordinates are the same as the\n starting coordinates; subsequently, they are the \"current\" coordinates\n from the prior call.  Note that the Sprite won't actually move\n anywhere in response to the Dragged event unless MoveTo is\n specifically called.", "deprecated": "false", "params": [{ "name": "startX", "type": "number"},{ "name": "startY", "type": "number"},{ "name": "prevX", "type": "number"},{ "name": "prevY", "type": "number"},{ "name": "currentX", "type": "number"},{ "name": "currentY", "type": "number"}]}
    ,
      { "name": "EdgeReached", "description": "Event handler called when the sprite reaches an edge of the screen. If Bounce is then called with that edge, the sprite will appear to bounce off of the edge it reached.  Edge here is represented as an integer that indicates one of eight directions north(1), northeast(2), east(3), southeast(4), south (-1), southwest(-2), west(-3), and northwest(-4).", "deprecated": "false", "params": [{ "name": "edge", "type": "number"}]}
    ,
      { "name": "Flung", "description": "When a fling gesture (quick swipe) is made on the sprite: provides\n the (x,y) position of the start of the fling, relative to the upper\n left of the canvas. Also provides the speed (pixels per millisecond) and heading\n (0-360 degrees) of the fling, as well as the x velocity and y velocity\n components of the fling's vector.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "speed", "type": "number"},{ "name": "heading", "type": "number"},{ "name": "xvel", "type": "number"},{ "name": "yvel", "type": "number"}]}
    ,
      { "name": "NoLongerCollidingWith", "description": "Event indicating that a pair of sprites are no longer colliding.", "deprecated": "false", "params": [{ "name": "other", "type": "component"}]}
    ,
      { "name": "TouchDown", "description": "When the user begins touching the sprite (places finger on sprite and\n leaves it there): provides the (x,y) position of the touch, relative\n to the upper left of the canvas", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]}
    ,
      { "name": "TouchUp", "description": "When the user stops touching the sprite (lifts finger after a\n TouchDown event): provides the (x,y) position of the touch, relative\n to the upper left of the canvas", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]}
    ,
      { "name": "Touched", "description": "When the user touches the sprite and then immediately lifts finger: provides\n the (x,y) position of the touch, relative to the upper left of the canvas", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]}
    ],
    "methods": [{ "name": "Bounce", "description": "Makes this sprite bounce, as if off a wall.  For normal bouncing, the edge argument should be the one returned by EdgeReached.", "deprecated": "false", "params": [{ "name": "edge", "type": "number"}]},
      { "name": "CollidingWith", "description": "Indicates whether a collision has been registered between this sprite\n and the passed sprite.", "deprecated": "false", "params": [{ "name": "other", "type": "component"}], "returnType": "boolean"},
      { "name": "MoveIntoBounds", "description": "Moves the sprite back in bounds if part of it extends out of bounds,\n having no effect otherwise. If the sprite is too wide to fit on the\n canvas, this aligns the left side of the sprite with the left side of the\n canvas. If the sprite is too tall to fit on the canvas, this aligns the\n top side of the sprite with the top side of the canvas.", "deprecated": "false", "params": []},
      { "name": "MoveTo", "description": "Moves the sprite so that its left top corner is at the specfied x and y coordinates.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]},
      { "name": "PointInDirection", "description": "Turns the sprite to point towards the point with coordinates as (x, y).", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]},
      { "name": "PointTowards", "description": "Turns the sprite to point towards a designated target sprite. The new heading will be parallel to the line joining the centerpoints of the two sprites.", "deprecated": "false", "params": [{ "name": "target", "type": "component"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.BarcodeScanner",
    "name": "BarcodeScanner",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SENSORS",
    "helpString": "Component for using the Barcode Scanner to read a barcode",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/barcodeScanner.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "UseExternalScanner", "editorType": "boolean", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Result", "description": "Text result of the previous scan.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "UseExternalScanner", "description": "If true App Inventor will look for and use an external scanning program such as \"Bar Code Scanner.\"", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AfterScan", "description": "Indicates that the scanner has read a (text) result and provides the result", "deprecated": "false", "params": [{ "name": "result", "type": "text"}]}
    ],
    "methods": [{ "name": "DoScan", "description": "Begins a barcode scan, using the camera. When the scan is complete, the AfterScan event will be raised.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.BluetoothClient",
    "name": "BluetoothClient",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "CONNECTIVITY",
    "helpString": "Bluetooth client component",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/bluetooth.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "CharacterEncoding", "editorType": "string", "defaultValue": "UTF-8", "editorArgs": []},
      { "name": "DelimiterByte", "editorType": "non_negative_integer", "defaultValue": "0", "editorArgs": []},
      { "name": "HighByteFirst", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Secure", "editorType": "boolean", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "AddressesAndNames", "description": "The addresses and names of paired Bluetooth devices", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Available", "description": "Whether Bluetooth is available on the device", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "CharacterEncoding", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "DelimiterByte", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Enabled", "description": "Whether Bluetooth is enabled", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "HighByteFirst", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "IsConnected", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "Secure", "description": "Whether to invoke SSP (Simple Secure Pairing), which is supported on devices with Bluetooth v2.1 or higher. When working with embedded Bluetooth devices, this property may need to be set to False. For Android 2.0-2.2, this property setting will be ignored.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "BluetoothError", "description": "The BluetoothError event is no longer used. Please use the Screen.ErrorOccurred event instead.", "deprecated": "false", "params": [{ "name": "functionName", "type": "text"},{ "name": "message", "type": "text"}]}
    ],
    "methods": [{ "name": "BytesAvailableToReceive", "description": "Returns an estimate of the number of bytes that can be received without blocking", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "Connect", "description": "Connect to the Bluetooth device with the specified address and the Serial Port Profile (SPP). Returns true if the connection was successful.", "deprecated": "false", "params": [{ "name": "address", "type": "text"}], "returnType": "boolean"},
      { "name": "ConnectWithUUID", "description": "Connect to the Bluetooth device with the specified address and UUID. Returns true if the connection was successful.", "deprecated": "false", "params": [{ "name": "address", "type": "text"},{ "name": "uuid", "type": "text"}], "returnType": "boolean"},
      { "name": "Disconnect", "description": "Disconnect from the connected Bluetooth device.", "deprecated": "false", "params": []},
      { "name": "IsDevicePaired", "description": "Checks whether the Bluetooth device with the specified address is paired.", "deprecated": "false", "params": [{ "name": "address", "type": "text"}], "returnType": "boolean"},
      { "name": "ReceiveSigned1ByteNumber", "description": "Receive a signed 1-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveSigned2ByteNumber", "description": "Receive a signed 2-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveSigned4ByteNumber", "description": "Receive a signed 4-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveSignedBytes", "description": "Receive multiple signed byte values from the connected Bluetooth device. If numberOfBytes is less than 0, read until a delimiter byte value is received.", "deprecated": "false", "params": [{ "name": "numberOfBytes", "type": "number"}], "returnType": "list"},
      { "name": "ReceiveText", "description": "Receive text from the connected Bluetooth device. If numberOfBytes is less than 0, read until a delimiter byte value is received.", "deprecated": "false", "params": [{ "name": "numberOfBytes", "type": "number"}], "returnType": "text"},
      { "name": "ReceiveUnsigned1ByteNumber", "description": "Receive an unsigned 1-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveUnsigned2ByteNumber", "description": "Receive a unsigned 2-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveUnsigned4ByteNumber", "description": "Receive a unsigned 4-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveUnsignedBytes", "description": "Receive multiple unsigned byte values from the connected Bluetooth device. If numberOfBytes is less than 0, read until a delimiter byte value is received.", "deprecated": "false", "params": [{ "name": "numberOfBytes", "type": "number"}], "returnType": "list"},
      { "name": "Send1ByteNumber", "description": "Send a 1-byte number to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "number", "type": "text"}]},
      { "name": "Send2ByteNumber", "description": "Send a 2-byte number to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "number", "type": "text"}]},
      { "name": "Send4ByteNumber", "description": "Send a 4-byte number to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "number", "type": "text"}]},
      { "name": "SendBytes", "description": "Send a list of byte values to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "list", "type": "list"}]},
      { "name": "SendText", "description": "Send text to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "text", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.BluetoothServer",
    "name": "BluetoothServer",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "CONNECTIVITY",
    "helpString": "Bluetooth server component",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/bluetooth.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "CharacterEncoding", "editorType": "string", "defaultValue": "UTF-8", "editorArgs": []},
      { "name": "DelimiterByte", "editorType": "non_negative_integer", "defaultValue": "0", "editorArgs": []},
      { "name": "HighByteFirst", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Secure", "editorType": "boolean", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Available", "description": "Whether Bluetooth is available on the device", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "CharacterEncoding", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "DelimiterByte", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Enabled", "description": "Whether Bluetooth is enabled", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "HighByteFirst", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "IsAccepting", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "IsConnected", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "Secure", "description": "Whether to invoke SSP (Simple Secure Pairing), which is supported on devices with Bluetooth v2.1 or higher. When working with embedded Bluetooth devices, this property may need to be set to False. For Android 2.0-2.2, this property setting will be ignored.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "BluetoothError", "description": "The BluetoothError event is no longer used. Please use the Screen.ErrorOccurred event instead.", "deprecated": "false", "params": [{ "name": "functionName", "type": "text"},{ "name": "message", "type": "text"}]}
    ,
      { "name": "ConnectionAccepted", "description": "Indicates that a bluetooth connection has been accepted.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "AcceptConnection", "description": "Accept an incoming connection with the Serial Port Profile (SPP).", "deprecated": "false", "params": [{ "name": "serviceName", "type": "text"}]},
      { "name": "AcceptConnectionWithUUID", "description": "Accept an incoming connection with a specific UUID.", "deprecated": "false", "params": [{ "name": "serviceName", "type": "text"},{ "name": "uuid", "type": "text"}]},
      { "name": "BytesAvailableToReceive", "description": "Returns an estimate of the number of bytes that can be received without blocking", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "Disconnect", "description": "Disconnect from the connected Bluetooth device.", "deprecated": "false", "params": []},
      { "name": "ReceiveSigned1ByteNumber", "description": "Receive a signed 1-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveSigned2ByteNumber", "description": "Receive a signed 2-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveSigned4ByteNumber", "description": "Receive a signed 4-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveSignedBytes", "description": "Receive multiple signed byte values from the connected Bluetooth device. If numberOfBytes is less than 0, read until a delimiter byte value is received.", "deprecated": "false", "params": [{ "name": "numberOfBytes", "type": "number"}], "returnType": "list"},
      { "name": "ReceiveText", "description": "Receive text from the connected Bluetooth device. If numberOfBytes is less than 0, read until a delimiter byte value is received.", "deprecated": "false", "params": [{ "name": "numberOfBytes", "type": "number"}], "returnType": "text"},
      { "name": "ReceiveUnsigned1ByteNumber", "description": "Receive an unsigned 1-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveUnsigned2ByteNumber", "description": "Receive a unsigned 2-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveUnsigned4ByteNumber", "description": "Receive a unsigned 4-byte number from the connected Bluetooth device.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ReceiveUnsignedBytes", "description": "Receive multiple unsigned byte values from the connected Bluetooth device. If numberOfBytes is less than 0, read until a delimiter byte value is received.", "deprecated": "false", "params": [{ "name": "numberOfBytes", "type": "number"}], "returnType": "list"},
      { "name": "Send1ByteNumber", "description": "Send a 1-byte number to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "number", "type": "text"}]},
      { "name": "Send2ByteNumber", "description": "Send a 2-byte number to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "number", "type": "text"}]},
      { "name": "Send4ByteNumber", "description": "Send a 4-byte number to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "number", "type": "text"}]},
      { "name": "SendBytes", "description": "Send a list of byte values to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "list", "type": "list"}]},
      { "name": "SendText", "description": "Send text to the connected Bluetooth device.", "deprecated": "false", "params": [{ "name": "text", "type": "text"}]},
      { "name": "StopAccepting", "description": "Stop accepting an incoming connection.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Button",
    "name": "Button",
    "external": "false",
    "version": "6",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "Button with the ability to detect clicks.  Many aspects of its appearance can be changed, as well as whether it is clickable (<code>Enabled<\/code>), can be changed in the Designer or in the Blocks Editor.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Shape", "editorType": "button_shape", "defaultValue": "0", "editorArgs": []},
      { "name": "ShowFeedback", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "Returns the button's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Enabled", "description": "If set, user can tap check box to cause action.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "If set, button text is displayed in bold.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontItalic", "description": "If set, button text is displayed in italics.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontSize", "description": "Point size for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "Font family for button text.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Image to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Shape", "description": "Specifies the button's shape (default, rounded, rectangular, oval). The shape will not be visible if an Image is being displayed.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ShowFeedback", "description": "Specifies if a visual feedback should be shown  for a button that as an image as background.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Text", "description": "Text to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Left, center, or right.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "Color for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "Click", "description": "User tapped and released the button.", "deprecated": "false", "params": []}
    ,
      { "name": "GotFocus", "description": "Indicates the cursor moved over the button so it is now possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "LongClick", "description": "User held the button down.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Indicates the cursor moved away from the button so it is now no longer possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchDown", "description": "Indicates that the button was pressed down.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchUp", "description": "Indicates that a button has been released.", "deprecated": "false", "params": []}
    ],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.Camcorder",
    "name": "Camcorder",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "A component to record a video using the device's camcorder.After the video is recorded, the name of the file on the phone containing the clip is available as an argument to the AfterRecording event. The file name can be used, for example, to set the source property of a VideoPlayer component.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/camcorder.png",
    "androidMinSdk": 7,
    "properties": [],
    "blockProperties": [],
    "events": [{ "name": "AfterRecording", "description": "Indicates that a video was recorded with the camera and provides the path to\n the stored picture.", "deprecated": "false", "params": [{ "name": "clip", "type": "text"}]}
    ],
    "methods": [{ "name": "RecordVideo", "description": "Records a video, then raises the AfterRecoding event.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Camera",
    "name": "Camera",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "A component to take a picture using the device's camera. After the picture is taken, the name of the file on the phone containing the picture is available as an argument to the AfterPicture event. The file name can be used, for example, to set the Picture property of an Image component.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/camera.png",
    "androidMinSdk": 7,
    "properties": [],
    "blockProperties": [{ "name": "UseFront", "description": "Specifies whether the front-facing camera should be used (when available). If the device does not have a front-facing camera, this option will be ignored and the camera will open normally.", "type": "boolean", "rw": "read-write", "deprecated": "true"}],
    "events": [{ "name": "AfterPicture", "description": "Indicates that a photo was taken with the camera and provides the path to\n the stored picture.", "deprecated": "false", "params": [{ "name": "image", "type": "text"}]}
    ],
    "methods": [{ "name": "TakePicture", "description": "Takes a picture, then raises the AfterPicture event.\n If useFront is true, adds an extra to the intent that requests the front-facing camera.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Canvas",
    "name": "Canvas",
    "external": "false",
    "version": "10",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "ANIMATION",
    "helpString": "<p>A two-dimensional touch-sensitive rectangular panel on which drawing can be done and sprites can be moved.<\/p> <p>The <code>BackgroundColor<\/code>, <code>PaintColor<\/code>, <code>BackgroundImage<\/code>, <code>Width<\/code>, and <code>Height<\/code> of the Canvas can be set in either the Designer or in the Blocks Editor.  The <code>Width<\/code> and <code>Height<\/code> are measured in pixels and must be positive.<\/p><p>Any location on the Canvas can be specified as a pair of (X, Y) values, where <ul> <li>X is the number of pixels away from the left edge of the Canvas<\/li><li>Y is the number of pixels away from the top edge of the Canvas<\/li><\/ul>.<\/p> <p>There are events to tell when and where a Canvas has been touched or a <code>Sprite<\/code> (<code>ImageSprite<\/code> or <code>Ball<\/code>) has been dragged.  There are also methods for drawing points, lines, and circles.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&HFFFFFFFF", "editorArgs": []},
      { "name": "BackgroundImage", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "LineWidth", "editorType": "non_negative_float", "defaultValue": "2.0", "editorArgs": []},
      { "name": "PaintColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "The color of the canvas background.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "BackgroundImage", "description": "The name of a file containing the background image for the canvas", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "FontSize", "description": "The font size of text drawn on the canvas.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "LineWidth", "description": "The width of lines drawn on the canvas.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "PaintColor", "description": "The color in which lines are drawn", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Determines the alignment of the text drawn by DrawText() or DrawAngle() with respect to the point specified by that command: point at the left of the text, point at the center of the text, or point at the right of the text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "Dragged", "description": "When the user does a drag from one point (prevX, prevY) to\n another (x, y).  The pair (startX, startY) indicates where the\n user first touched the screen, and \"draggedAnySprite\" indicates whether a\n sprite is being dragged.", "deprecated": "false", "params": [{ "name": "startX", "type": "number"},{ "name": "startY", "type": "number"},{ "name": "prevX", "type": "number"},{ "name": "prevY", "type": "number"},{ "name": "currentX", "type": "number"},{ "name": "currentY", "type": "number"},{ "name": "draggedAnySprite", "type": "boolean"}]}
    ,
      { "name": "Flung", "description": "When a fling gesture (quick swipe) is made on the canvas: provides\n the (x,y) position of the start of the fling, relative to the upper\n left of the canvas. Also provides the speed (pixels per millisecond) and heading\n (0-360 degrees) of the fling, as well as the x velocity and y velocity\n components of the fling's vector. The value \"flungSprite\" is true if a sprite\n was located near the the starting point of the fling gesture.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "speed", "type": "number"},{ "name": "heading", "type": "number"},{ "name": "xvel", "type": "number"},{ "name": "yvel", "type": "number"},{ "name": "flungSprite", "type": "boolean"}]}
    ,
      { "name": "TouchDown", "description": "When the user begins touching the canvas (places finger on canvas and\n leaves it there): provides the (x,y) position of the touch, relative\n to the upper left of the canvas", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]}
    ,
      { "name": "TouchUp", "description": "When the user stops touching the canvas (lifts finger after a\n TouchDown event): provides the (x,y) position of the touch, relative\n to the upper left of the canvas", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]}
    ,
      { "name": "Touched", "description": "When the user touches the canvas and then immediately lifts finger: provides\n the (x,y) position of the touch, relative to the upper left of the canvas.  TouchedAnySprite\n is true if the same touch also touched a sprite, and false otherwise.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "touchedAnySprite", "type": "boolean"}]}
    ],
    "methods": [{ "name": "Clear", "description": "Clears anything drawn on this Canvas but not any background color or image.", "deprecated": "false", "params": []},
      { "name": "DrawCircle", "description": "Draws a circle (filled in) with the given radius centered at the given coordinates on the canvas", "deprecated": "false", "params": [{ "name": "centerX", "type": "number"},{ "name": "centerY", "type": "number"},{ "name": "radius", "type": "number"},{ "name": "fill", "type": "boolean"}]},
      { "name": "DrawLine", "description": "Draws a line between the given coordinates on the canvas.", "deprecated": "false", "params": [{ "name": "x1", "type": "number"},{ "name": "y1", "type": "number"},{ "name": "x2", "type": "number"},{ "name": "y2", "type": "number"}]},
      { "name": "DrawPoint", "description": "Draws a point at the given coordinates on the canvas.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]},
      { "name": "DrawText", "description": "Draws the specified text relative to the specified coordinates using the values of the FontSize and TextAlignment properties.", "deprecated": "false", "params": [{ "name": "text", "type": "text"},{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]},
      { "name": "DrawTextAtAngle", "description": "Draws the specified text starting at the specified coordinates at the specified angle using the values of the FontSize and TextAlignment properties.", "deprecated": "false", "params": [{ "name": "text", "type": "text"},{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "angle", "type": "number"}]},
      { "name": "GetBackgroundPixelColor", "description": "Gets the color of the specified point. This includes the background and any drawn points, lines, or circles but not sprites.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}], "returnType": "number"},
      { "name": "GetPixelColor", "description": "Gets the color of the specified point.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}], "returnType": "number"},
      { "name": "Save", "description": "Saves a picture of this Canvas to the device's external storage. If an error occurs, the Screen's ErrorOccurred event will be called.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "SaveAs", "description": "Saves a picture of this Canvas to the device's external storage in the file named fileName. fileName must end with one of .jpg, .jpeg, or .png, which determines the file type.", "deprecated": "false", "params": [{ "name": "fileName", "type": "text"}], "returnType": "text"},
      { "name": "SetBackgroundPixelColor", "description": "Sets the color of the specified point. This differs from DrawPoint by having an argument for color.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "color", "type": "number"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.CheckBox",
    "name": "CheckBox",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "Checkbox that raises an event when the user clicks on it. There are many properties affecting its appearance that can be set in the Designer or Blocks Editor.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00FFFFFF", "editorArgs": []},
      { "name": "Checked", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Checked", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Enabled", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontItalic", "description": "", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontSize", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Text", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextColor", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "Changed", "description": "Default Changed event handler.", "deprecated": "false", "params": []}
    ,
      { "name": "GotFocus", "description": "Default GotFocus event handler.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Default LostFocus event handler.", "deprecated": "false", "params": []}
    ],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.Circle",
    "name": "Circle",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MAPS",
    "helpString": "Circle",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Description", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Draggable", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "EnableInfobox", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FillColor", "editorType": "color", "defaultValue": "&HFFFF0000", "editorArgs": []},
      { "name": "Latitude", "editorType": "latitude", "defaultValue": "0", "editorArgs": []},
      { "name": "Longitude", "editorType": "longitude", "defaultValue": "0", "editorArgs": []},
      { "name": "Radius", "editorType": "non_negative_float", "defaultValue": "0", "editorArgs": []},
      { "name": "StrokeColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "StrokeWidth", "editorType": "integer", "defaultValue": "1", "editorArgs": []},
      { "name": "Title", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Description", "description": "The description displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Draggable", "description": "The Draggable property is used to set whether or not the user can drag the Marker by long-pressing and then dragging the marker to a new location.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "EnableInfobox", "description": "Enable or disable the infobox window display when the user taps the feature.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FillColor", "description": "The paint color used to fill in the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Latitude", "description": "The latitude of the center of the circle.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Longitude", "description": "The longitude of the center of the circle.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Radius", "description": "The radius of the circle in meters.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "StrokeColor", "description": "The paint color used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "StrokeWidth", "description": "The width of the stroke used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Title", "description": "The title displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Type", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "Click", "description": "The user clicked on the feature.", "deprecated": "false", "params": []}
    ,
      { "name": "Drag", "description": "The user dragged the map feature.", "deprecated": "false", "params": []}
    ,
      { "name": "LongClick", "description": "The user long-pressed on the feature. This event will only trigger if Draggable is false.", "deprecated": "false", "params": []}
    ,
      { "name": "StartDrag", "description": "The user started a drag operation.", "deprecated": "false", "params": []}
    ,
      { "name": "StopDrag", "description": "The user stopped a drag operation.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "DistanceToFeature", "description": "Compute the distance, in meters, between two map features.", "deprecated": "false", "params": [{ "name": "mapFeature", "type": "component"},{ "name": "centroids", "type": "boolean"}], "returnType": "number"},
      { "name": "DistanceToPoint", "description": "Compute the distance, in meters, between a map feature and a latitude, longitude point.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"},{ "name": "centroid", "type": "boolean"}], "returnType": "number"},
      { "name": "HideInfobox", "description": "Hide the infobox if it is shown. If the infobox is not visible this function has no effect.", "deprecated": "false", "params": []},
      { "name": "SetLocation", "description": "Set the center of the Circle.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}]},
      { "name": "ShowInfobox", "description": "Show the infobox for the feature. This will show the infobox even if", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Clock",
    "name": "Clock",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SENSORS",
    "helpString": "<p>Non-visible component that provides the instant in time using the internal clock on the phone. It can fire a timer at regularly set intervals and perform time calculations, manipulations, and conversions.<\/p> <p>Methods to convert an instant to text are also available. Acceptable patterns are empty string, MM\/DD\/YYYY HH:mm:ss a, or MMM d, yyyyHH:mm. The empty string will provide the default format, which is \"MMM d, yyyy HH:mm:ss a\" for FormatDateTime \"MMM d, yyyy\" for FormatDate. To see all possible format, please see <a href=\"https:\/\/docs.oracle.com\/javase\/7\/docs\/api\/java\/text\/SimpleDateFormat.html\" _target=\"_blank\">here<\/a>. <\/p> ",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/clock.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "TimerAlwaysFires", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "TimerEnabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "TimerInterval", "editorType": "non_negative_integer", "defaultValue": "1000", "editorArgs": []}],
    "blockProperties": [{ "name": "TimerAlwaysFires", "description": "Will fire even when application is not showing on the screen if true", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "TimerEnabled", "description": "Fires timer if true", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "TimerInterval", "description": "Interval between timer events in ms", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "Timer", "description": "Timer has gone off.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "AddDays", "description": "An instant in time some days after the argument", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "quantity", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "AddDuration", "description": "An instant in time some duration after the argument", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "quantity", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "AddHours", "description": "An instant in time some hours after the argument", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "quantity", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "AddMinutes", "description": "An instant in time some minutes after the argument", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "quantity", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "AddMonths", "description": "An instant in time some months after the argument", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "quantity", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "AddSeconds", "description": "An instant in time some seconds after the argument", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "quantity", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "AddWeeks", "description": "An instant in time some weeks after the argument", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "quantity", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "AddYears", "description": "An instant in time some years after the argument", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "quantity", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "DayOfMonth", "description": "The day of the month", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "number"},
      { "name": "Duration", "description": "Milliseconds elapsed between instants", "deprecated": "false", "params": [{ "name": "start", "type": "InstantInTime"},{ "name": "end", "type": "InstantInTime"}], "returnType": "number"},
      { "name": "DurationToDays", "description": "convert duration to days", "deprecated": "false", "params": [{ "name": "duration", "type": "number"}], "returnType": "number"},
      { "name": "DurationToHours", "description": "convert duration to hours", "deprecated": "false", "params": [{ "name": "duration", "type": "number"}], "returnType": "number"},
      { "name": "DurationToMinutes", "description": "convert duration to minutes", "deprecated": "false", "params": [{ "name": "duration", "type": "number"}], "returnType": "number"},
      { "name": "DurationToSeconds", "description": "convert duration to seconds", "deprecated": "false", "params": [{ "name": "duration", "type": "number"}], "returnType": "number"},
      { "name": "DurationToWeeks", "description": "convert duration to weeks", "deprecated": "false", "params": [{ "name": "duration", "type": "number"}], "returnType": "number"},
      { "name": "FormatDate", "description": "Text representing the date of an instant in the specified pattern", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "pattern", "type": "text"}], "returnType": "text"},
      { "name": "FormatDateTime", "description": "Text representing the date and time of an instant in the specified pattern", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"},{ "name": "pattern", "type": "text"}], "returnType": "text"},
      { "name": "FormatTime", "description": "Text representing the time of an instant", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "text"},
      { "name": "GetMillis", "description": "The instant in time measured as milliseconds since 1970.", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "number"},
      { "name": "Hour", "description": "The hour of the day", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "number"},
      { "name": "MakeInstant", "description": "An instant in time specified by MM\/dd\/YYYY hh:mm:ss or MM\/dd\/YYYY or hh:mm", "deprecated": "false", "params": [{ "name": "from", "type": "text"}], "returnType": "InstantInTime"},
      { "name": "MakeInstantFromMillis", "description": "An instant in time specified by the milliseconds since 1970.", "deprecated": "false", "params": [{ "name": "millis", "type": "number"}], "returnType": "InstantInTime"},
      { "name": "Minute", "description": "The minute of the hour", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "number"},
      { "name": "Month", "description": "The month of the year represented as a number from 1 to 12)", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "number"},
      { "name": "MonthName", "description": "The name of the month", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "text"},
      { "name": "Now", "description": "The current instant in time read from phone's clock", "deprecated": "false", "params": [], "returnType": "InstantInTime"},
      { "name": "Second", "description": "The second of the minute", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "number"},
      { "name": "SystemTime", "description": "The phone's internal time", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "Weekday", "description": "The day of the week represented as a number from 1 (Sunday) to 7 (Saturday)", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "number"},
      { "name": "WeekdayName", "description": "The name of the day of the week", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "text"},
      { "name": "Year", "description": "The year", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}], "returnType": "number"}]}
,
  { "type": "com.google.appinventor.components.runtime.CloudDB",
    "name": "CloudDB",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "EXPERIMENTAL",
    "helpString": "Non-visible component that communicates with CloudDB server to store and retrieve information.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/cloudDB.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "DefaultRedisServer", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ProjectID", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "RedisPort", "editorType": "integer", "defaultValue": "6381", "editorArgs": []},
      { "name": "RedisServer", "editorType": "string", "defaultValue": "DEFAULT", "editorArgs": []},
      { "name": "Token", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "UseSSL", "editorType": "boolean", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "DefaultRedisServer", "description": "The Default Redis Server to use.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "ProjectID", "description": "Gets the ProjectID for this CloudDB project.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "RedisPort", "description": "The Redis Server port to use. Defaults to 6381", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "RedisServer", "description": "The Redis Server to use to store data. A setting of \"DEFAULT\" means that the MIT server will be used.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Token", "description": "This field contains the authentication token used to login to the backed Redis server. For the \"DEFAULT\" server, do not edit this value, the system will fill it in for you. A system administrator may also provide a special value to you which can be used to share data between multiple projects from multiple people. If using your own Redis server, set a password in the server's config and enter it here.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "UseSSL", "description": "Set to true to use SSL to talk to CloudDB\/Redis server. This should be set to True for the \"DEFAULT\" server.", "type": "boolean", "rw": "invisible", "deprecated": "false"}],
    "events": [{ "name": "CloudDBError", "description": "Indicates that an error occurred while communicating with the CloudDB Redis server.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ,
      { "name": "DataChanged", "description": "Indicates that the data in the CloudDB project has changed.\n Launches an event with the tag and value that have been updated.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "value", "type": "any"}]}
    ,
      { "name": "FirstRemoved", "description": "Event triggered by the \"RemoveFirstFromList\" function. The argument \"value\" is the object that was the first in the list, and which is now removed.", "deprecated": "false", "params": [{ "name": "value", "type": "any"}]}
    ,
      { "name": "GotValue", "description": "Indicates that a GetValue request has succeeded.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "value", "type": "any"}]}
    ,
      { "name": "TagList", "description": "Event triggered when we have received the list of known tags. Used with the \"GetTagList\" Function.", "deprecated": "false", "params": [{ "name": "value", "type": "list"}]}
    ],
    "methods": [{ "name": "AppendValueToList", "description": "Append a value to the end of a list atomically. If two devices use this function simultaneously, both will be appended and no data lost.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "itemToAdd", "type": "any"}]},
      { "name": "ClearTag", "description": "Remove the tag from CloudDB", "deprecated": "false", "params": [{ "name": "tag", "type": "text"}]},
      { "name": "CloudConnected", "description": "returns True if we are on the network and will likely be able to connect to the CloudDB server.", "deprecated": "false", "params": [], "returnType": "boolean"},
      { "name": "GetTagList", "description": "Get the list of tags for this application. When complete a \"TagList\" event will be triggered with the list of known tags.", "deprecated": "false", "params": []},
      { "name": "GetValue", "description": "Get the Value for a tag, doesn't return the value but will cause a GotValue event to fire when the value is looked up.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "valueIfTagNotThere", "type": "any"}]},
      { "name": "RemoveFirstFromList", "description": "Return the first element of a list and atomically remove it. If two devices use this function simultaneously, one will get the first element and the the other will get the second element, or an error if there is no available element. When the element is available, the \"FirstRemoved\" event will be triggered.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"}]},
      { "name": "StoreValue", "description": "Store a value at a tag.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "valueToStore", "type": "any"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.ContactPicker",
    "name": "ContactPicker",
    "external": "false",
    "version": "6",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SOCIAL",
    "helpString": "A button that, when clicked on, displays a list of the contacts to choose among. After the user has made a selection, the following properties will be set to information about the chosen contact: <ul>\n<li> <code>ContactName<\/code>: the contact's name <\/li>\n <li> <code>EmailAddress<\/code>: the contact's primary email address <\/li>\n <li> <code>ContactUri<\/code>: the contact's URI on the device <\/li>\n<li> <code>EmailAddressList<\/code>: a list of the contact's email addresses <\/li>\n <li> <code>PhoneNumber<\/code>: the contact's primary phone number (on Later Android Verisons)<\/li>\n <li> <code>PhoneNumberList<\/code>: a list of the contact's phone numbers (on Later Android Versions)<\/li>\n <li> <code>Picture<\/code>: the name of the file containing the contact's image, which can be used as a <code>Picture<\/code> property value for the <code>Image<\/code> or <code>ImageSprite<\/code> component.<\/li><\/ul>\n<\/p><p>Other properties affect the appearance of the button (<code>TextAlignment<\/code>, <code>BackgroundColor<\/code>, etc.) and whether it can be clicked on (<code>Enabled<\/code>).\n<\/p><p>The ContactPicker component might not work on all phones. For example, on Android systems before system 3.0, it cannot pick phone numbers, and the list of email addresses will contain only one email.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Shape", "editorType": "button_shape", "defaultValue": "0", "editorArgs": []},
      { "name": "ShowFeedback", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "Returns the button's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ContactName", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "ContactUri", "description": "URI that specifies the location of the contact on the device.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "EmailAddress", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "EmailAddressList", "description": "", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Enabled", "description": "If set, user can tap check box to cause action.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "If set, button text is displayed in bold.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontItalic", "description": "If set, button text is displayed in italics.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontSize", "description": "Point size for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "Font family for button text.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Image to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "PhoneNumber", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "PhoneNumberList", "description": "", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Picture", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Shape", "description": "Specifies the button's shape (default, rounded, rectangular, oval). The shape will not be visible if an Image is being displayed.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ShowFeedback", "description": "Specifies if a visual feedback should be shown  for a button that as an image as background.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Text", "description": "Text to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Left, center, or right.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "Color for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "AfterPicking", "description": "Event to be raised after the picker activity returns its\n result and the properties have been filled in.", "deprecated": "false", "params": []}
    ,
      { "name": "BeforePicking", "description": "Event to raise when the button of the component is clicked or the list is shown\n using the Open block.  This event occurs before the list of items is displayed, and \n can be used to prepare the list before it is shown.", "deprecated": "false", "params": []}
    ,
      { "name": "GotFocus", "description": "Indicates the cursor moved over the button so it is now possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Indicates the cursor moved away from the button so it is now no longer possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchDown", "description": "Indicates that the button was pressed down.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchUp", "description": "Indicates that a button has been released.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "Open", "description": "Opens the picker, as though the user clicked on it.", "deprecated": "false", "params": []},
      { "name": "ViewContact", "description": "view a contact via its URI", "deprecated": "false", "params": [{ "name": "uri", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.DatePicker",
    "name": "DatePicker",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "<p>A button that, when clicked on, launches a popup dialog to allow the user to select a date.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Shape", "editorType": "button_shape", "defaultValue": "0", "editorArgs": []},
      { "name": "ShowFeedback", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "Returns the button's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Day", "description": "the Day of the month that was last picked using the DatePicker.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Enabled", "description": "If set, user can tap check box to cause action.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "If set, button text is displayed in bold.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontItalic", "description": "If set, button text is displayed in italics.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontSize", "description": "Point size for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "Font family for button text.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Image to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Instant", "description": "the instant of the date that was last picked using the DatePicker.", "type": "InstantInTime", "rw": "read-only", "deprecated": "false"},
      { "name": "Month", "description": "the number of the Month that was last picked using the DatePicker. Note that months start in 1 = January, 12 = December.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "MonthInText", "description": "Returns the name of the Month that was last picked using the DatePicker, in textual format.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Shape", "description": "Specifies the button's shape (default, rounded, rectangular, oval). The shape will not be visible if an Image is being displayed.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ShowFeedback", "description": "Specifies if a visual feedback should be shown  for a button that as an image as background.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Text", "description": "Text to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Left, center, or right.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "Color for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Year", "description": "the Year that was last picked using the DatePicker", "type": "number", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "AfterDateSet", "description": "Event that runs after the user chooses a Date in the dialog", "deprecated": "false", "params": []}
    ,
      { "name": "GotFocus", "description": "Indicates the cursor moved over the button so it is now possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Indicates the cursor moved away from the button so it is now no longer possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchDown", "description": "Indicates that the button was pressed down.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchUp", "description": "Indicates that a button has been released.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "LaunchPicker", "description": "Launches the DatePicker popup.", "deprecated": "false", "params": []},
      { "name": "SetDateToDisplay", "description": "Allows the user to set the date to be displayed when the date picker opens.\nValid values for the month field are 1-12 and 1-31 for the day field.", "deprecated": "false", "params": [{ "name": "year", "type": "number"},{ "name": "month", "type": "number"},{ "name": "day", "type": "number"}]},
      { "name": "SetDateToDisplayFromInstant", "description": "Allows the user to set the date from the instant to be displayed when the date picker opens.", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.EmailPicker",
    "name": "EmailPicker",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SOCIAL",
    "helpString": "An EmailPicker is a kind of text box.  If the user begins entering the name or email address of a contact, the phone will show a dropdown menu of choices that complete the entry.  If there are many contacts, the dropdown can take several seconds to appear, and can show intermediate results while the matches are being computed. <p>The initial contents of the text box and the contents< after user entry is in the <code>Text<\/code> property.  If the <code>Text<\/code> property is initially empty, the contents of the <code>Hint<\/code> property will be faintly shown in the text box as a hint to the user.<\/p>\n <p>Other properties affect the appearance of the text box (<code>TextAlignment<\/code>, <code>BackgroundColor<\/code>, etc.) and whether it can be used (<code>Enabled<\/code>).<\/p>\n<p>Text boxes like this are usually used with <code>Button<\/code> components, with the user clicking on the button when text entry is complete.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Hint", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "0", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "The background color of the input box.  You can choose a color by name in the Designer or in the Blocks Editor.  The default background color is 'default' (shaded 3-D look).", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Enabled", "description": "Whether the user can enter text into this input box.  By default, this is true.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "Whether the font for the text should be bold.  By default, it is not.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontItalic", "description": "Whether the text should appear in italics.  By default, it does not.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontSize", "description": "The font size for the text.  By default, it is 14.0 points.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "The font for the text.  The value can be changed in the Designer.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Hint", "description": "Text that should appear faintly in the input box to provide a hint as to what the user should enter.  This can only be seen if the <code>Text<\/code> property is empty.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Text", "description": "The text in the input box, which can be set by the programmer in the Designer or Blocks Editor, or it can be entered by the user (unless the <code>Enabled<\/code> property is false).", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Whether the text should be left justified, centered, or right justified.  By default, text is left justified.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "The color for the text.  You can choose a color by name in the Designer or in the Blocks Editor.  The default text color is black.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "GotFocus", "description": "Event raised when this component is selected for input, such as by\n the user touching it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Event raised when this component is no longer selected for input, such\n as if the user touches a different text box.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "RequestFocus", "description": "Sets the textbox active.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Ev3ColorSensor",
    "name": "Ev3ColorSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a color sensor on a LEGO MINDSTORMS EV3 robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsEv3.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "AboveRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BelowRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "BottomOfRange", "editorType": "non_negative_integer", "defaultValue": "30", "editorArgs": []},
      { "name": "ColorChangedEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Mode", "editorType": "lego_ev3_color_sensor_mode", "defaultValue": "reflected", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_ev3_sensor_port", "defaultValue": "1", "editorArgs": []},
      { "name": "TopOfRange", "editorType": "non_negative_integer", "defaultValue": "60", "editorArgs": []},
      { "name": "WithinRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "AboveRangeEventEnabled", "description": "Whether the AboveRange event should fire when the light level goes above the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BelowRangeEventEnabled", "description": "Whether the BelowRange event should fire when the light level goes below the BottomOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "read-write", "deprecated": "false"},
      { "name": "BottomOfRange", "description": "The bottom of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "ColorChangedEventEnabled", "description": "Whether the ColorChanged event should fire when the Mode property is set to \"color\" and the detected color changes.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Mode", "description": "Get the current sensor mode.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "TopOfRange", "description": "The top of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WithinRangeEventEnabled", "description": "Whether the WithinRange event should fire when the light level goes between the BottomOfRange and the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AboveRange", "description": "Light level has gone above the range.", "deprecated": "false", "params": []}
    ,
      { "name": "BelowRange", "description": "Light level has gone below the range.", "deprecated": "false", "params": []}
    ,
      { "name": "ColorChanged", "description": "Called when the detected color has changed. The ColorChanged event will occur if the Mode property is set to \"color\" and the ColorChangedEventEnabled property is set to True.", "deprecated": "false", "params": [{ "name": "colorCode", "type": "number"},{ "name": "colorName", "type": "text"}]}
    ,
      { "name": "WithinRange", "description": "Light level has gone within the range.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "GetColorCode", "description": "It returns the color code from 0 to 7 corresponding to no color, black, blue, green, yellow, red, white and brown.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "GetColorName", "description": "Return the color name in one of \"No Color\", \"Black\", \"Blue\", \"Green\", \"Yellow\", \"Red\", \"White\", \"Brown\".", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetLightLevel", "description": "It returns the light level in percentage, or -1 when the light level cannot be read.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "SetAmbientMode", "description": "Make the sensor read the light level without reflected light.", "deprecated": "false", "params": []},
      { "name": "SetColorMode", "description": "Enter the color detection mode.", "deprecated": "false", "params": []},
      { "name": "SetReflectedMode", "description": "Make the sensor read the light level with reflected light.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Ev3Commands",
    "name": "Ev3Commands",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a low-level interface to a LEGO MINDSTORMS EV3 robot, with functions to send system or direct commands to EV3 robots.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsEv3.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "read-write", "deprecated": "false"}],
    "events": [],
    "methods": [{ "name": "GetBatteryCurrent", "description": "Get the battery current.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "GetBatteryVoltage", "description": "Get the battery voltage.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "GetFirmwareBuild", "description": "Get the firmware build on EV3.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetFirmwareVersion", "description": "Get the firmware version on EV3.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetHardwareVersion", "description": "Get the hardware version of EV3.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetOSBuild", "description": "Get the OS build on EV3.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetOSVersion", "description": "Get the OS version on EV3.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "KeepAlive", "description": "Keep the EV3 brick from shutdown for a period of time.", "deprecated": "false", "params": [{ "name": "minutes", "type": "number"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Ev3GyroSensor",
    "name": "Ev3GyroSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a gyro sensor on a LEGO MINDSTORMS EV3 robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsEv3.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "Mode", "editorType": "lego_ev3_gyro_sensor_mode", "defaultValue": "angle", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_ev3_sensor_port", "defaultValue": "1", "editorArgs": []},
      { "name": "SensorValueChangedEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "read-write", "deprecated": "false"},
      { "name": "Mode", "description": "The sensor mode can be a text constant of either \"rate\" or \"angle\", which correspond to SetAngleMode or SetRateMode respectively.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "SensorValueChangedEventEnabled", "description": "Whether the SensorValueChanged event should fire when the sensor value changed.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "SensorValueChanged", "description": "Called then the sensor value changed.", "deprecated": "false", "params": [{ "name": "sensorValue", "type": "number"}]}
    ],
    "methods": [{ "name": "GetSensorValue", "description": "Returns the current angle or rotation speed based on current mode, or -1 if the value cannot be read from sensor.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "SetAngleMode", "description": "Measures the orientation of the sensor.", "deprecated": "false", "params": []},
      { "name": "SetRateMode", "description": "Measures the angular velocity of the sensor.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Ev3Motors",
    "name": "Ev3Motors",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides both high- and low-level interfaces to a LEGO MINDSTORMS EV3 robot, with functions that can control the motors.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsEv3.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "EnableSpeedRegulation", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "MotorPorts", "editorType": "string", "defaultValue": "ABC", "editorArgs": []},
      { "name": "ReverseDirection", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "StopBeforeDisconnect", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "TachoCountChangedEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "WheelDiameter", "editorType": "float", "defaultValue": "4.32", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "read-write", "deprecated": "false"},
      { "name": "EnableSpeedRegulation", "description": "The robot adjusts the power to maintain the speed if speed regulation is enabled.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "MotorPorts", "description": "The motor ports that the motors are connected to. The ports are specified by a sequence of port letters.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "ReverseDirection", "description": "It specifies if the direction of the motors is reversed.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "StopBeforeDisconnect", "description": "Whether to stop the motor before disconnecting.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "TachoCountChangedEventEnabled", "description": "Whether the TachoCountChanged event should fire when the angle is changed.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "WheelDiameter", "description": "The diameter of the wheels attached on the motors in centimeters.", "type": "number", "rw": "invisible", "deprecated": "false"}],
    "events": [{ "name": "TachoCountChanged", "description": "Called when the tacho count has changed.", "deprecated": "false", "params": [{ "name": "tachoCount", "type": "number"}]}
    ],
    "methods": [{ "name": "GetTachoCount", "description": "Get the current tacho count.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ResetTachoCount", "description": "Set the current tacho count to zero.", "deprecated": "false", "params": []},
      { "name": "RotateInDistance", "description": "Rotate the motors in a distance.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "distance", "type": "number"},{ "name": "useBrake", "type": "boolean"}]},
      { "name": "RotateInDuration", "description": "Rotate the motors in a period of time.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "milliseconds", "type": "number"},{ "name": "useBrake", "type": "boolean"}]},
      { "name": "RotateInTachoCounts", "description": "Rotate the motors in a number of tacho counts.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "tachoCounts", "type": "number"},{ "name": "useBrake", "type": "boolean"}]},
      { "name": "RotateIndefinitely", "description": "Start to rotate the motors.", "deprecated": "false", "params": [{ "name": "power", "type": "number"}]},
      { "name": "RotateSyncInDistance", "description": "Rotate the motors at the same speed for a distance in cm.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "distance", "type": "number"},{ "name": "turnRatio", "type": "number"},{ "name": "useBrake", "type": "boolean"}]},
      { "name": "RotateSyncInDuration", "description": "Rotate the motors at the same speed in a period of time.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "milliseconds", "type": "number"},{ "name": "turnRatio", "type": "number"},{ "name": "useBrake", "type": "boolean"}]},
      { "name": "RotateSyncInTachoCounts", "description": "Rotate the motors at the same speed in a number of tacho counts.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "tachoCounts", "type": "number"},{ "name": "turnRatio", "type": "number"},{ "name": "useBrake", "type": "boolean"}]},
      { "name": "RotateSyncIndefinitely", "description": "Start to rotate the motors at the same speed.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "turnRatio", "type": "number"}]},
      { "name": "Stop", "description": "Stop the motors of the robot.", "deprecated": "false", "params": [{ "name": "useBrake", "type": "boolean"}]},
      { "name": "ToggleDirection", "description": "Toggle the direction of motors.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Ev3Sound",
    "name": "Ev3Sound",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to sound functionalities on LEGO MINDSTORMS EV3 robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsEv3.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "read-write", "deprecated": "false"}],
    "events": [],
    "methods": [{ "name": "PlayTone", "description": "Make the robot play a tone.", "deprecated": "false", "params": [{ "name": "volume", "type": "number"},{ "name": "frequency", "type": "number"},{ "name": "milliseconds", "type": "number"}]},
      { "name": "StopSound", "description": "Stop any sound on the robot.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Ev3TouchSensor",
    "name": "Ev3TouchSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a touch sensor on a LEGO MINDSTORMS EV3 robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsEv3.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "PressedEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "ReleasedEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_ev3_sensor_port", "defaultValue": "1", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "read-write", "deprecated": "false"},
      { "name": "PressedEventEnabled", "description": "Whether the Released event should fire when the touch sensor is pressed.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ReleasedEventEnabled", "description": "Whether the Released event should fire when the touch sensor is released.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"}],
    "events": [{ "name": "Pressed", "description": "Called when the touch sensor is pressed.", "deprecated": "false", "params": []}
    ,
      { "name": "Released", "description": "Called when the touch sensor is pressed.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "IsPressed", "description": "Returns true if the touch sensor is pressed.", "deprecated": "false", "params": [], "returnType": "boolean"}]}
,
  { "type": "com.google.appinventor.components.runtime.Ev3UI",
    "name": "Ev3UI",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a LEGO MINDSTORMS EV3 robot, with functions to draw graphs on EV3 screen.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsEv3.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "read-write", "deprecated": "false"}],
    "events": [],
    "methods": [{ "name": "DrawCircle", "description": "Draw a circle on the screen.", "deprecated": "false", "params": [{ "name": "color", "type": "number"},{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "radius", "type": "number"},{ "name": "fill", "type": "boolean"}]},
      { "name": "DrawIcon", "description": "Draw a built-in icon on screen.", "deprecated": "false", "params": [{ "name": "color", "type": "number"},{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "type", "type": "number"},{ "name": "no", "type": "number"}]},
      { "name": "DrawLine", "description": "Draw a line on the screen.", "deprecated": "false", "params": [{ "name": "color", "type": "number"},{ "name": "x1", "type": "number"},{ "name": "y1", "type": "number"},{ "name": "x2", "type": "number"},{ "name": "y2", "type": "number"}]},
      { "name": "DrawPoint", "description": "Draw a point on the screen.", "deprecated": "false", "params": [{ "name": "color", "type": "number"},{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]},
      { "name": "DrawRect", "description": "Draw a rectangle on the screen.", "deprecated": "false", "params": [{ "name": "color", "type": "number"},{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "width", "type": "number"},{ "name": "height", "type": "number"},{ "name": "fill", "type": "boolean"}]},
      { "name": "FillScreen", "description": "Fill the screen with a color.", "deprecated": "false", "params": [{ "name": "color", "type": "number"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Ev3UltrasonicSensor",
    "name": "Ev3UltrasonicSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to an ultrasonic sensor on a LEGO MINDSTORMS EV3 robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsEv3.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "AboveRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BelowRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "BottomOfRange", "editorType": "non_negative_integer", "defaultValue": "30", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_ev3_sensor_port", "defaultValue": "1", "editorArgs": []},
      { "name": "TopOfRange", "editorType": "non_negative_integer", "defaultValue": "90", "editorArgs": []},
      { "name": "Unit", "editorType": "lego_ev3_ultrasonic_sensor_mode", "defaultValue": "cm", "editorArgs": []},
      { "name": "WithinRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "AboveRangeEventEnabled", "description": "Whether the AboveRange event should fire when the distance goes above the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BelowRangeEventEnabled", "description": "Whether the BelowRange event should fire when the distance goes below the BottomOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "read-write", "deprecated": "false"},
      { "name": "BottomOfRange", "description": "The bottom of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "TopOfRange", "description": "The top of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Unit", "description": "The distance unit, which can be either \"cm\" or \"inch\".", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "WithinRangeEventEnabled", "description": "Whether the WithinRange event should fire when the distance goes between the BottomOfRange and the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AboveRange", "description": "Called when the detected distance has gone above the range.", "deprecated": "false", "params": []}
    ,
      { "name": "BelowRange", "description": "Called when the detected distance has gone below the range.", "deprecated": "false", "params": []}
    ,
      { "name": "WithinRange", "description": "Called when the detected distance has gone within the range.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "GetDistance", "description": "Returns the current distance in centimeters as a value between 0 and 254, or -1 if the distance can not be read.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "SetCmUnit", "description": "Measure the distance in centimeters.", "deprecated": "false", "params": []},
      { "name": "SetInchUnit", "description": "Measure the distance in inches.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.FeatureCollection",
    "name": "FeatureCollection",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MAPS",
    "helpString": "A FeatureColletion contains one or more map features as a group. Any events fired on a feature in the collection will also trigger the corresponding event on the collection object. FeatureCollections can be loaded from external resources as a means of populating a Map with content.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "FeaturesFromGeoJSON", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Source", "editorType": "geojson_type", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Features", "description": "The list of features placed on this map. This list also includes any features created by calls to FeatureFromDescription", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "FeaturesFromGeoJSON", "description": "Loads a collection of features from the given string. If the string is not valid GeoJSON, the ErrorLoadingFeatureCollection error will be run with url = <string>.", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Source", "description": "Gets or sets the source URL used to populate the feature collection. If the feature collection was not loaded from a URL, this will be the empty string.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "FeatureClick", "description": "The user clicked on a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "FeatureDrag", "description": "The user dragged a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "FeatureLongClick", "description": "The user long-pressed on a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "FeatureStartDrag", "description": "The user started dragging a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "FeatureStopDrag", "description": "The user stopped dragging a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "GotFeatures", "description": "A GeoJSON document was successfully read from url. The features specified in the document are provided as a list in features.", "deprecated": "false", "params": [{ "name": "url", "type": "text"},{ "name": "features", "type": "list"}]}
    ,
      { "name": "LoadError", "description": "An error was encountered while processing a GeoJSON document at the given url. The responseCode parameter will contain an HTTP status code and the errorMessage parameter will contain a detailed error message.", "deprecated": "false", "params": [{ "name": "url", "type": "text"},{ "name": "responseCode", "type": "number"},{ "name": "errorMessage", "type": "text"}]}
    ],
    "methods": [{ "name": "FeatureFromDescription", "description": "Convert a feature description into an App Inventor map feature. Currently the only\n supported conversion is from a GeoJSON point to Marker component. If the feature has\n properties, they will be mapped into App Inventor properties using the following mapping:\n\n description becomes Description;\n draggable becomes Draggable;\n infobox becomes EnableInfobox;\n fill becomes FillColor;\n image becomes ImageAsset;\n stroke becomes StrokeColor;\n stroke-width becomes StrokeWidth;\n title becomes Title;\n visible becomes Visible", "deprecated": "false", "params": [{ "name": "description", "type": "list"}], "returnType": "any"},
      { "name": "LoadFromURL", "description": "<p>Load a feature collection in <a href=\"https:\/\/en.wikipedia.org\/wiki\/GeoJSON\">GeoJSON<\/a> format from the given url. On success, the event GotFeatures will be raised with the given url and a list of the features parsed from the GeoJSON as a list of (key, value) pairs. On failure, the LoadError event will be raised with any applicable HTTP response code and error message.<\/p>", "deprecated": "false", "params": [{ "name": "url", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.File",
    "name": "File",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "STORAGE",
    "helpString": "Non-visible component for storing and retrieving files. Use this component to write or read files on your device. The default behaviour is to write files to the private data directory associated with your App. The Companion is special cased to write files to \/sdcard\/AppInventor\/data to facilitate debugging. If the file path starts with a slash (\/), then the file is created relative to \/sdcard. For example writing a file to \/myFile.txt will write the file in \/sdcard\/myFile.txt.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/file.png",
    "androidMinSdk": 7,
    "properties": [],
    "blockProperties": [],
    "events": [{ "name": "AfterFileSaved", "description": "Event indicating that the contents of the file have been written.", "deprecated": "false", "params": [{ "name": "fileName", "type": "text"}]}
    ,
      { "name": "GotText", "description": "Event indicating that the contents from the file have been read.", "deprecated": "false", "params": [{ "name": "text", "type": "text"}]}
    ],
    "methods": [{ "name": "AppendToFile", "description": "Appends text to the end of a file storage, creating the file if it does not exist. See the help text under SaveFile for information about where files are written.", "deprecated": "false", "params": [{ "name": "text", "type": "text"},{ "name": "fileName", "type": "text"}]},
      { "name": "Delete", "description": "Deletes a file from storage. Prefix the filename with \/ to delete a specific file in the SD card, for instance \/myFile.txt. will delete the file \/sdcard\/myFile.txt. If the file does not begin with a \/, then the file located in the programs private storage will be deleted. Starting the file with \/\/ is an error because assets files cannot be deleted.", "deprecated": "false", "params": [{ "name": "fileName", "type": "text"}]},
      { "name": "ReadFrom", "description": "Reads text from a file in storage. Prefix the filename with \/ to read from a specific file on the SD card. for instance \/myFile.txt will read the file \/sdcard\/myFile.txt. To read assets packaged with an application (also works for the Companion) start the filename with \/\/ (two slashes). If a filename does not start with a slash, it will be read from the applications private storage (for packaged apps) and from \/sdcard\/AppInventor\/data for the Companion.", "deprecated": "false", "params": [{ "name": "fileName", "type": "text"}]},
      { "name": "SaveFile", "description": "Saves text to a file. If the filename begins with a slash (\/) the file is written to the sdcard. For example writing to \/myFile.txt will write the file to \/sdcard\/myFile.txt. If the filename does not start with a slash, it will be written in the programs private data directory where it will not be accessible to other programs on the phone. There is a special exception for the AI Companion where these files are written to \/sdcard\/AppInventor\/data to facilitate debugging. Note that this block will overwrite a file if it already exists.\n\nIf you want to add content to a file use the append block.", "deprecated": "false", "params": [{ "name": "text", "type": "text"},{ "name": "fileName", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.FirebaseDB",
    "name": "FirebaseDB",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "EXPERIMENTAL",
    "helpString": "Non-visible component that communicates with a Firebase to store and retrieve information.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/firebaseDB.png",
    "androidMinSdk": 10,
    "properties": [{ "name": "DefaultURL", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "DeveloperBucket", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "FirebaseToken", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "FirebaseURL", "editorType": "FirbaseURL", "defaultValue": "DEFAULT", "editorArgs": []},
      { "name": "Persist", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "ProjectBucket", "editorType": "string", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "DefaultURL", "description": "", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "DeveloperBucket", "description": "", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "FirebaseToken", "description": "", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "FirebaseURL", "description": "Gets the URL for this FirebaseDB.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "Persist", "description": "If true, variables will retain their values when off-line and the App exits. Values will be uploaded to Firebase the next time the App is run while connected to the network. This is useful for applications which will gather data while not connected to the network. Note: AppendValue and RemoveFirst will not work correctly when off-line, they require a network connection.<br\/><br\/> <i>Note<\/i>: If you set Persist on any Firebase component, on any screen, it makes all Firebase components on all screens persistent. This is a limitation of the low level Firebase library. Also be aware that if you want to set persist to true, you should do so before connecting the Companion for incremental development.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "ProjectBucket", "description": "Gets the ProjectBucket for this FirebaseDB.", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "DataChanged", "description": "Indicates that the data in the Firebase has changed.\n Launches an event with the tag and value that have been updated.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "value", "type": "any"}]}
    ,
      { "name": "FirebaseError", "description": "Indicates that the communication with the Firebase signaled an error.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ,
      { "name": "FirstRemoved", "description": "Event triggered by the \"RemoveFirst\" function. The argument \"value\" is the object that was the first in the list, and which is now removed.", "deprecated": "false", "params": [{ "name": "value", "type": "any"}]}
    ,
      { "name": "GotValue", "description": "Indicates that a GetValue request has succeeded.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "value", "type": "any"}]}
    ,
      { "name": "TagList", "description": "Event triggered when we have received the list of known tags. Used with the \"GetTagList\" Function.", "deprecated": "false", "params": [{ "name": "value", "type": "list"}]}
    ],
    "methods": [{ "name": "AppendValue", "description": "Append a value to the end of a list atomically. If two devices use this function simultaneously, both will be appended and no data lost.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "valueToAdd", "type": "any"}]},
      { "name": "ClearTag", "description": "Remove the tag from Firebase", "deprecated": "false", "params": [{ "name": "tag", "type": "text"}]},
      { "name": "GetTagList", "description": "Get the list of tags for this application. When complete a \"TagList\" event will be triggered with the list of known tags.", "deprecated": "false", "params": []},
      { "name": "GetValue", "description": "GetValue asks Firebase to get the value stored under the given tag.\n It will pass valueIfTagNotThere to GotValue if there is no value stored\n under the tag.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "valueIfTagNotThere", "type": "any"}]},
      { "name": "RemoveFirst", "description": "Return the first element of a list and atomically remove it. If two devices use this function simultaneously, one will get the first element and the the other will get the second element, or an error if there is no available element. When the element is available, the \"FirstRemoved\" event will be triggered.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"}]},
      { "name": "StoreValue", "description": "Asks Firebase to store the given value under the given tag.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "valueToStore", "type": "any"}]},
      { "name": "Unauthenticate", "description": "If you are having difficulty with the Companion and you are switching between different Firebase accounts, you may need to use this function to clear internal Firebase caches. You can just use the \"Do It\" function on this block in the blocks editor. Note: You should not normally need to use this block as part of an application.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Form",
    "name": "Form",
    "external": "false",
    "version": "24",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LAYOUT",
    "helpString": "Top-level component containing all other components in the program",
    "helpUrl": "",
    "showOnPalette": "false",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "AboutScreen", "editorType": "textArea", "defaultValue": "", "editorArgs": []},
      { "name": "AccentColor", "editorType": "color", "defaultValue": "&HFFFF4081", "editorArgs": []},
      { "name": "ActionBar", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "AlignHorizontal", "editorType": "horizontal_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "AlignVertical", "editorType": "vertical_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "AppName", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "BackgroundColor", "editorType": "color", "defaultValue": "&HFFFFFFFF", "editorArgs": []},
      { "name": "BackgroundImage", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "CloseScreenAnimation", "editorType": "screen_animation", "defaultValue": "default", "editorArgs": []},
      { "name": "Icon", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "OpenScreenAnimation", "editorType": "screen_animation", "defaultValue": "default", "editorArgs": []},
      { "name": "PrimaryColor", "editorType": "color", "defaultValue": "&HFF3F51B5", "editorArgs": []},
      { "name": "PrimaryColorDark", "editorType": "color", "defaultValue": "&HFF303F9F", "editorArgs": []},
      { "name": "ScreenOrientation", "editorType": "screen_orientation", "defaultValue": "unspecified", "editorArgs": []},
      { "name": "Scrollable", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "ShowListsAsJson", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "ShowStatusBar", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Sizing", "editorType": "sizing", "defaultValue": "Fixed", "editorArgs": []},
      { "name": "Theme", "editorType": "theme", "defaultValue": "Classic", "editorArgs": []},
      { "name": "Title", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TitleVisible", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "TutorialURL", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "VersionCode", "editorType": "non_negative_integer", "defaultValue": "1", "editorArgs": []},
      { "name": "VersionName", "editorType": "string", "defaultValue": "1.0", "editorArgs": []}],
    "blockProperties": [{ "name": "AboutScreen", "description": "Information about the screen.  It appears when \"About this Application\" is selected from the system menu. Use it to inform people about your app.  In multiple screen apps, each screen has its own AboutScreen info.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "AccentColor", "description": "This is the accent color used for highlights and other user interface accents.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ActionBar", "description": "", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "AlignHorizontal", "description": "A number that encodes how contents of the screen are aligned  horizontally. The choices are: 1 = left aligned, 2 = horizontally centered,  3 = right aligned.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "AlignVertical", "description": "A number that encodes how the contents of the arrangement are aligned vertically. The choices are: 1 = aligned at the top, 2 = vertically centered, 3 = aligned at the bottom. Vertical alignment has no effect if the screen is scrollable.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "AppName", "description": "This is the display name of the installed application in the phone.If the AppName is blank, it will be set to the name of the project when the project is built.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "BackgroundColor", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "BackgroundImage", "description": "The screen background image.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "CloseScreenAnimation", "description": "The animation for closing current screen and returning  to the previous screen. Valid options are default, fade, zoom, slidehorizontal, slidevertical, and none", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Height", "description": "Screen height (y-size).", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Icon", "description": "", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "OpenScreenAnimation", "description": "The animation for switching to another screen. Valid options are default, fade, zoom, slidehorizontal, slidevertical, and none", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "PrimaryColor", "description": "This is the primary color used for Material UI elements, such as the ActionBar.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "PrimaryColorDark", "description": "This is the primary color used for darker elements in Material UI.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ScreenOrientation", "description": "The requested screen orientation, specified as a text value.  Commonly used values are landscape, portrait, sensor, user and unspecified.  See the Android developer documentation for ActivityInfo.Screen_Orientation for the complete list of possible settings.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Scrollable", "description": "When checked, there will be a vertical scrollbar on the screen, and the height of the application can exceed the physical height of the device. When unchecked, the application height is constrained to the height of the device.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowListsAsJson", "description": "If false, lists will be converted to strings using Lisp notation, i.e., as symbols separated by spaces, e.g., (a 1 b2 (c d). If true, lists will appear as in Json or Python, e.g.  [\"a\", 1, \"b\", 2, [\"c\", \"d\"]].  This property appears only in Screen 1, and the value for Screen 1 determines the behavior for all screens. The property defaults to \"false\" meaning that the App Inventor programmer must explicitly set it to \"true\" if JSON\/Python syntax is desired. At some point in the future we will alter the system so that new projects are created with this property set to \"true\" by default. Existing projects will not be impacted. The App Inventor programmer can also set it back to \"false\" in newer projects if desired. ", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "ShowStatusBar", "description": "The status bar is the topmost bar on the screen. This property reports whether the status bar is visible.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Sizing", "description": "If set to fixed,  screen layouts will be created for a single fixed-size screen and autoscaled. If set to responsive, screen layouts will use the actual resolution of the device.  See the documentation on responsive design in App Inventor for more information. This property appears on Screen1 only and controls the sizing for all screens in the app.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "Theme", "description": "Sets the theme used by the application.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "Title", "description": "The caption for the form, which apears in the title bar", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TitleVisible", "description": "The title bar is the top gray bar on the screen. This property reports whether the title bar is visible.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "TutorialURL", "description": "A URL to use to populate the Tutorial Sidebar while editing a project. Used as a teaching aid.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "VersionCode", "description": "An integer value which must be incremented each time a new Android Application Package File (APK) is created for the Google Play Store.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "VersionName", "description": "A string which can be changed to allow Google Play Store users to distinguish between different versions of the App.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "Width", "description": "Screen width (x-size).", "type": "number", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "BackPressed", "description": "Device back button pressed.", "deprecated": "false", "params": []}
    ,
      { "name": "ErrorOccurred", "description": "Event raised when an error occurs. Only some errors will raise this condition.  For those errors, the system will show a notification by default.  You can use this event handler to prescribe an error behavior different than the default.", "deprecated": "false", "params": [{ "name": "component", "type": "component"},{ "name": "functionName", "type": "text"},{ "name": "errorNumber", "type": "number"},{ "name": "message", "type": "text"}]}
    ,
      { "name": "Initialize", "description": "Screen starting", "deprecated": "false", "params": []}
    ,
      { "name": "OtherScreenClosed", "description": "Event raised when another screen has closed and control has returned to this screen.", "deprecated": "false", "params": [{ "name": "otherScreenName", "type": "text"},{ "name": "result", "type": "any"}]}
    ,
      { "name": "PermissionDenied", "description": "Event to handle when the app user has denied a needed permission.", "deprecated": "false", "params": [{ "name": "component", "type": "component"},{ "name": "functionName", "type": "text"},{ "name": "permissionName", "type": "text"}]}
    ,
      { "name": "PermissionGranted", "description": "Event to handle when the app user has granted a needed permission. This event is only run when permission is\n granted in response to the AskForPermission method.", "deprecated": "false", "params": [{ "name": "permissionName", "type": "text"}]}
    ,
      { "name": "ScreenOrientationChanged", "description": "Screen orientation changed", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "AskForPermission", "description": "Ask the user to grant access to a dangerous permission.", "deprecated": "false", "params": [{ "name": "permissionName", "type": "text"}]},
      { "name": "HideKeyboard", "description": "Hide the onscreen soft keyboard.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.FusiontablesControl",
    "name": "FusiontablesControl",
    "external": "false",
    "version": "4",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "STORAGE",
    "helpString": "<p>A non-visible component that communicates with Google Fusion Tables. Fusion Tables let you store, share, query and visualize data tables; this component lets you query, create, and modify these tables.<\/p> <p>This component uses the <a href=\"https:\/\/developers.google.com\/fusiontables\/docs\/v2\/getting_started\" target=\"_blank\">Fusion Tables API V2.0<\/a>. <p>Applications using Fusion Tables must authentication to Google's servers. There are two ways this can be done. The first way uses an API Key which you the developer obtain (see below). With this approach end-users must also login to access a Fusion Table. The second approach is to use a Service Account. With this approach you create credentials and a special \"Service Account Email Address\" which you obtain from the <a href=\"https:\/\/code.google.com\/apis\/console\/\" target=\"_blank\">Google APIs Console<\/a>. You then tell the Fusion Table Control the name of the Service Account Email address and upload the secret key as an asset to your application and set the KeyFile property to point at this file. Finally you check the \"UseServiceAuthentication\" checkbox in the designer. When using a Service Account, end-users do not need to login to use Fusion Tables, your service account authenticates all access.<\/p> <p>To get an API key, follow these instructions.<\/p> <ol><li>Go to your <a href=\"https:\/\/code.google.com\/apis\/console\/\" target=\"_blank\">Google APIs Console<\/a> and login if necessary.<\/li><li>Select the <i>Services<\/i> item from the menu on the left.<\/li><li>Choose the <i>Fusiontables<\/i> service from the list provided and turn it on.<\/li><li>Go back to the main menu and select the <i>API Access<\/i> item. <\/li><\/ol><p>Your API Key will be near the bottom of that pane in the section called \"Simple API Access\".You will have to provide that key as the value for the <i>ApiKey<\/i> property in your Fusiontables app.<\/p><p>Once you have an API key, set the value of the <i>Query<\/i> property to a valid Fusiontables SQL query and call <i>SendQuery<\/i> to execute the query.  App Inventor will send the query to the Fusion Tables server and the <i>GotResult<\/i> block will fire when a result is returned from the server.Query results will be returned in CSV format, and can be converted to list format using the \"list from csv table\" or \"list from csv row\" blocks.<\/p><p>Note that you do not need to worry about UTF-encoding the query. But you do need to make sure the query follows the syntax described in <a href=\"https:\/\/developers.google.com\/fusiontables\/docs\/v2\/getting_started\" target=\"_blank\">the reference manual<\/a>, which means that things like capitalization for names of columns matters, and that single quotes must be used around column names if there are spaces in them.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/fusiontables.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "ApiKey", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "KeyFile", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "LoadingDialogMessage", "editorType": "string", "defaultValue": "Please wait loading...", "editorArgs": []},
      { "name": "Query", "editorType": "string", "defaultValue": "show tables", "editorArgs": []},
      { "name": "ServiceAccountEmail", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ShowLoadingDialog", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "UseServiceAuthentication", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "ApiKey", "description": "Your Google API Key. For help, click on the questionmark (?) next to the FusiontablesControl component in the Palette. ", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "KeyFile", "description": "Specifies the path of the private key file.  This key file is used to get access to the FusionTables API.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "LoadingDialogMessage", "description": "Set the loading message for the dialog.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Query", "description": "The query to send to the Fusion Tables API. <p>For legal query formats and examples, see the <a href=\"https:\/\/developers.google.com\/fusiontables\/docs\/v2\/getting_started\" target=\"_blank\">Fusion Tables API v2.0 reference manual<\/a>.<\/p> <p>Note that you do not need to worry about UTF-encoding the query. But you do need to make sure it follows the syntax described in the reference manual, which means that things like capitalization for names of columns matters, and that single quotes need to be used around column names if there are spaces in them.<\/p> ", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ServiceAccountEmail", "description": "The Service Account Email Address when service account authentication is in use.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowLoadingDialog", "description": "Whether or not to show the loading dialog", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "UseServiceAuthentication", "description": "Indicates whether a service account should be used for authentication", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "GotResult", "description": "Indicates that the Fusion Tables query has finished processing, with a result.  The result of the query will generally be returned in CSV format, and can be converted to list format using the \"list from csv table\" or \"list from csv row\" blocks.", "deprecated": "false", "params": [{ "name": "result", "type": "text"}]}
    ],
    "methods": [{ "name": "DoQuery", "description": "DEPRECATED. This block is deprecated as of the end of 2012.  Use SendQuery.", "deprecated": "true", "params": []},
      { "name": "ForgetLogin", "description": "Forget end-users login credentials. Has no effect on service authentication", "deprecated": "false", "params": []},
      { "name": "GetRows", "description": "Gets all the rows from a specified fusion table. The tableId field is the id of therequired fusion table. The columns field is a comma-separeted list of the columns to retrieve.", "deprecated": "false", "params": [{ "name": "tableId", "type": "text"},{ "name": "columns", "type": "text"}]},
      { "name": "GetRowsWithConditions", "description": "Gets all the rows from a fusion table that meet certain conditions. The tableId field isthe id of the required fusion table. The columns field is a comma-separeted list of the columns toretrieve. The conditions field specifies what rows to retrieve from the table, for example the rows in whicha particular column value is not null.", "deprecated": "false", "params": [{ "name": "tableId", "type": "text"},{ "name": "columns", "type": "text"},{ "name": "conditions", "type": "text"}]},
      { "name": "InsertRow", "description": "Inserts a row into the specified fusion table. The tableId field is the id of thefusion table. The columns is a comma-separated list of the columns to insert values into. The values field specifies what values to insert into each column.", "deprecated": "false", "params": [{ "name": "tableId", "type": "text"},{ "name": "columns", "type": "text"},{ "name": "values", "type": "text"}]},
      { "name": "SendQuery", "description": "Send the query to the Fusiontables server.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.GameClient",
    "name": "GameClient",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "INTERNAL",
    "helpString": "Provides a way for applications to communicate with online game servers",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/gameClient.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "GameId", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ServiceURL", "editorType": "string", "defaultValue": "http://appinvgameserver.appspot.com", "editorArgs": []}],
    "blockProperties": [{ "name": "GameId", "description": "The game name for this application. The same game ID can have one or more game instances.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "InstanceId", "description": "The game instance id.  Taken together,the game ID and the instance ID uniquely identify the game.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "InvitedInstances", "description": "The set of game instances to which this player has been invited but has not yet joined.  To ensure current values are returned, first invoke GetInstanceLists.", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "JoinedInstances", "description": "The set of game instances in which this player is participating.  To ensure current values are returned, first invoke GetInstanceLists.", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Leader", "description": "The game's leader. At any time, each game instance has only one leader, but the leader may change with time.  Initially, the leader is the game instance creator. Application writers determine special properties of the leader. The leader value is updated each time a successful communication is made with the server.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Players", "description": "The current set of players for this game instance. Each player is designated by an email address, which is a string. The list of players is updated each time a successful communication is made with the game server.", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "PublicInstances", "description": "The set of game instances that have been marked public. To ensure current values are returned, first invoke {@link #GetInstanceLists}. ", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "ServiceURL", "description": "", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "ServiceUrl", "description": "The URL of the game server.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "UserEmailAddress", "description": "The email address that is being used as the player id for this game client.   At present, users must set this manually in oder to join a game.  But this property will change in the future so that is set automatically, and users will not be able to change it.", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "FunctionCompleted", "description": "Indicates that a function call completed.", "deprecated": "false", "params": [{ "name": "functionName", "type": "text"}]}
    ,
      { "name": "GotMessage", "description": "Indicates that a new message has been received.", "deprecated": "false", "params": [{ "name": "type", "type": "text"},{ "name": "sender", "type": "text"},{ "name": "contents", "type": "list"}]}
    ,
      { "name": "Info", "description": "Indicates that something has occurred which the player should know about.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ,
      { "name": "InstanceIdChanged", "description": "Indicates that the InstanceId property has changed as a result of calling MakeNewInstance or SetInstance.", "deprecated": "false", "params": [{ "name": "instanceId", "type": "text"}]}
    ,
      { "name": "Invited", "description": "Indicates that a user has been invited to this game instance.", "deprecated": "false", "params": [{ "name": "instanceId", "type": "text"}]}
    ,
      { "name": "NewInstanceMade", "description": "Indicates that a new instance was successfully created after calling MakeNewInstance.", "deprecated": "false", "params": [{ "name": "instanceId", "type": "text"}]}
    ,
      { "name": "NewLeader", "description": "Indicates that this game has a new leader as specified through SetLeader", "deprecated": "false", "params": [{ "name": "playerId", "type": "text"}]}
    ,
      { "name": "PlayerJoined", "description": "Indicates that a new player has joined this game instance.", "deprecated": "false", "params": [{ "name": "playerId", "type": "text"}]}
    ,
      { "name": "PlayerLeft", "description": "Indicates that a player has left this game instance.", "deprecated": "false", "params": [{ "name": "playerId", "type": "text"}]}
    ,
      { "name": "ServerCommandFailure", "description": "Indicates that a server command failed.", "deprecated": "false", "params": [{ "name": "command", "type": "text"},{ "name": "arguments", "type": "list"}]}
    ,
      { "name": "ServerCommandSuccess", "description": "Indicates that a server command returned successfully.", "deprecated": "false", "params": [{ "name": "command", "type": "text"},{ "name": "response", "type": "list"}]}
    ,
      { "name": "UserEmailAddressSet", "description": "Indicates that the user email address has been set.", "deprecated": "false", "params": [{ "name": "emailAddress", "type": "text"}]}
    ,
      { "name": "WebServiceError", "description": "Indicates that an error occurred while communicating with the web server.", "deprecated": "false", "params": [{ "name": "functionName", "type": "text"},{ "name": "message", "type": "text"}]}
    ],
    "methods": [{ "name": "GetInstanceLists", "description": "Updates the InstancesJoined and InstancesInvited lists. This procedure can be called before setting the InstanceId.", "deprecated": "false", "params": []},
      { "name": "GetMessages", "description": "Retrieves messages of the specified type.", "deprecated": "false", "params": [{ "name": "type", "type": "text"},{ "name": "count", "type": "number"}]},
      { "name": "Invite", "description": "Invites a player to this game instance.", "deprecated": "false", "params": [{ "name": "playerEmail", "type": "text"}]},
      { "name": "LeaveInstance", "description": "Leaves the current instance.", "deprecated": "false", "params": []},
      { "name": "MakeNewInstance", "description": "Asks the server to create a new instance of this game.", "deprecated": "false", "params": [{ "name": "instanceId", "type": "text"},{ "name": "makePublic", "type": "boolean"}]},
      { "name": "SendMessage", "description": "Sends a keyed message to all recipients in the recipients list. The message will consist of the contents list.", "deprecated": "false", "params": [{ "name": "type", "type": "text"},{ "name": "recipients", "type": "list"},{ "name": "contents", "type": "list"}]},
      { "name": "ServerCommand", "description": "Sends the specified command to the game server.", "deprecated": "false", "params": [{ "name": "command", "type": "text"},{ "name": "arguments", "type": "list"}]},
      { "name": "SetInstance", "description": "Sets InstanceId and joins the specified instance.", "deprecated": "false", "params": [{ "name": "instanceId", "type": "text"}]},
      { "name": "SetLeader", "description": "Tells the server to set the leader to playerId. Only the current leader may successfully set a new leader.", "deprecated": "false", "params": [{ "name": "playerEmail", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.GyroscopeSensor",
    "name": "GyroscopeSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SENSORS",
    "helpString": "<p>Non-visible component that can measure angular velocity in three dimensions in units of degrees per second.<\/p><p>In order to function, the component must have its <code>Enabled<\/code> property set to True, and the device must have a gyroscope sensor.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/gyroscopesensor.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Available", "description": "Indicates whether a gyroscope sensor is available.", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "Enabled", "description": "If enabled, then sensor events will be generated and XAngularVelocity, YAngularVelocity, and ZAngularVelocity properties will have meaningful values.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "XAngularVelocity", "description": "The angular velocity around the X axis, in degrees per second.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "YAngularVelocity", "description": "The angular velocity around the Y axis, in degrees per second.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "ZAngularVelocity", "description": "The angular velocity around the Z axis, in degrees per second.", "type": "number", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "GyroscopeChanged", "description": "Indicates that the gyroscope sensor data has changed. The timestamp parameter is the time in nanoseconds at which the event occurred.", "deprecated": "false", "params": [{ "name": "xAngularVelocity", "type": "number"},{ "name": "yAngularVelocity", "type": "number"},{ "name": "zAngularVelocity", "type": "number"},{ "name": "timestamp", "type": "number"}]}
    ],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.HorizontalArrangement",
    "name": "HorizontalArrangement",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LAYOUT",
    "helpString": "<p>A formatting element in which to place components that should be displayed from left to right.  If you wish to have components displayed one over another, use <code>VerticalArrangement<\/code> instead.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "AlignHorizontal", "editorType": "horizontal_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "AlignVertical", "editorType": "vertical_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "AlignHorizontal", "description": "A number that encodes how contents of the arrangement are aligned  horizontally. The choices are: 1 = left aligned, 2 = right aligned,  3 = horizontally centered.  Alignment has no effect if the arrangement's width is automatic.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "AlignVertical", "description": "A number that encodes how the contents of the arrangement are aligned  vertically. The choices are: 1 = aligned at the top, 2 = vertically centered, 3 = aligned at the bottom.  Alignment has no effect if the arrangement's height is automatic.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "BackgroundColor", "description": "Returns the component's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Specifies the path of the component's image.  If there is both an Image and a BackgroundColor, only the Image will be visible.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.HorizontalScrollArrangement",
    "name": "HorizontalScrollArrangement",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LAYOUT",
    "helpString": "<p>A formatting element in which to place components that should be displayed from left to right.  If you wish to have components displayed one over another, use <code>VerticalArrangement<\/code> instead.<\/p><p>This version is scrollable.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "AlignHorizontal", "editorType": "horizontal_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "AlignVertical", "editorType": "vertical_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "AlignHorizontal", "description": "A number that encodes how contents of the arrangement are aligned  horizontally. The choices are: 1 = left aligned, 2 = right aligned,  3 = horizontally centered.  Alignment has no effect if the arrangement's width is automatic.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "AlignVertical", "description": "A number that encodes how the contents of the arrangement are aligned  vertically. The choices are: 1 = aligned at the top, 2 = vertically centered, 3 = aligned at the bottom.  Alignment has no effect if the arrangement's height is automatic.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "BackgroundColor", "description": "Returns the component's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Specifies the path of the component's image.  If there is both an Image and a BackgroundColor, only the Image will be visible.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.Image",
    "name": "Image",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "Component for displaying images.  The picture to display, and other aspects of the Image's appearance, can be specified in the Designer or in the Blocks Editor.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Picture", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "RotationAngle", "editorType": "float", "defaultValue": "0.0", "editorArgs": []},
      { "name": "ScalePictureToFit", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Animation", "description": "This is a limited form of animation that can attach a small number of motion types to images.  The allowable motions are ScrollRightSlow, ScrollRight, ScrollRightFast, ScrollLeftSlow, ScrollLeft, ScrollLeftFast, and Stop", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Picture", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "RotationAngle", "description": "The angle at which the image picture appears rotated. This rotation does not appear on the designer screen, only on the device.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ScalePictureToFit", "description": "Specifies whether the image should be resized to match the size of the ImageView.", "type": "boolean", "rw": "write-only", "deprecated": "false"},
      { "name": "Scaling", "description": "This property determines how the picture scales according to the Height or Width of the Image. Scale proportionally (0) preserves the picture aspect ratio. Scale to fit (1) matches the Image area, even if the aspect ratio changes.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.ImagePicker",
    "name": "ImagePicker",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "A special-purpose button. When the user taps an image picker, the device's image gallery appears, and the user can choose an image. After an image is picked, it is saved, and the <code>Selected<\/code> property will be the name of the file where the image is stored. In order to not fill up storage, a maximum of 10 images will be stored.  Picking more images will delete previous images, in order from oldest to newest.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Shape", "editorType": "button_shape", "defaultValue": "0", "editorArgs": []},
      { "name": "ShowFeedback", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "Returns the button's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Enabled", "description": "If set, user can tap check box to cause action.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "If set, button text is displayed in bold.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontItalic", "description": "If set, button text is displayed in italics.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontSize", "description": "Point size for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "Font family for button text.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Image to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Selection", "description": "Path to the file containing the image that was selected.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Shape", "description": "Specifies the button's shape (default, rounded, rectangular, oval). The shape will not be visible if an Image is being displayed.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ShowFeedback", "description": "Specifies if a visual feedback should be shown  for a button that as an image as background.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Text", "description": "Text to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Left, center, or right.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "Color for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "AfterPicking", "description": "Event to be raised after the picker activity returns its\n result and the properties have been filled in.", "deprecated": "false", "params": []}
    ,
      { "name": "BeforePicking", "description": "Event to raise when the button of the component is clicked or the list is shown\n using the Open block.  This event occurs before the list of items is displayed, and \n can be used to prepare the list before it is shown.", "deprecated": "false", "params": []}
    ,
      { "name": "GotFocus", "description": "Indicates the cursor moved over the button so it is now possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Indicates the cursor moved away from the button so it is now no longer possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchDown", "description": "Indicates that the button was pressed down.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchUp", "description": "Indicates that a button has been released.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "Open", "description": "Opens the picker, as though the user clicked on it.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.ImageSprite",
    "name": "ImageSprite",
    "external": "false",
    "version": "6",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "ANIMATION",
    "helpString": "<p>A 'sprite' that can be placed on a <code>Canvas<\/code>, where it can react to touches and drags, interact with other sprites (<code>Ball<\/code>s and other <code>ImageSprite<\/code>s) and the edge of the Canvas, and move according to its property values.  Its appearance is that of the image specified in its <code>Picture<\/code> property (unless its <code>Visible<\/code> property is <code>False<\/code>.<\/p> <p>To have an <code>ImageSprite<\/code> move 10 pixels to the left every 1000 milliseconds (one second), for example, you would set the <code>Speed<\/code> property to 10 [pixels], the <code>Interval<\/code> property to 1000 [milliseconds], the <code>Heading<\/code> property to 180 [degrees], and the <code>Enabled<\/code> property to <code>True<\/code>.  A sprite whose <code>Rotates<\/code> property is <code>True<\/code> will rotate its image as the sprite's <code>Heading<\/code> changes.  Checking for collisions with a rotated sprite currently checks the sprite's unrotated position so that collision checking will be inaccurate for tall narrow or short wide sprites that are rotated.  Any of the sprite properties can be changed at any time under program control.<\/p> ",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Heading", "editorType": "float", "defaultValue": "0", "editorArgs": []},
      { "name": "Interval", "editorType": "non_negative_integer", "defaultValue": "100", "editorArgs": []},
      { "name": "Picture", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Rotates", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Speed", "editorType": "float", "defaultValue": "0.0", "editorArgs": []},
      { "name": "Visible", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "X", "editorType": "float", "defaultValue": "0.0", "editorArgs": []},
      { "name": "Y", "editorType": "float", "defaultValue": "0.0", "editorArgs": []},
      { "name": "Z", "editorType": "float", "defaultValue": "1.0", "editorArgs": []}],
    "blockProperties": [{ "name": "Enabled", "description": "Controls whether the sprite moves when its speed is non-zero.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Heading", "description": "Returns the sprite's heading in degrees above the positive x-axis.  Zero degrees is toward the right of the screen; 90 degrees is toward the top of the screen.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Interval", "description": "The interval in milliseconds at which the sprite's position is updated.  For example, if the interval is 50 and the speed is 10, then the sprite will move 10 pixels every 50 milliseconds.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Picture", "description": "The picture that determines the sprite's appearence", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Rotates", "description": "If true, the sprite image rotates to match the sprite's heading. If false, the sprite image does not rotate when the sprite changes heading. The sprite rotates around its centerpoint.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Speed", "description": "he speed at which the sprite moves.  The sprite moves this many pixels every interval.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "True if the sprite is visible.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "X", "description": "The horizontal coordinate of the left edge of the sprite, increasing as the sprite moves to the right.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Y", "description": "The vertical coordinate of the top of the sprite, increasing as the sprite moves down.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Z", "description": "How the sprite should be layered relative to other sprits, with higher-numbered layers in front of lower-numbered layers.", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "CollidedWith", "description": "Handler for CollidedWith events, called when two sprites collide.\n Note that checking for collisions with a rotated ImageSprite currently\n checks against the sprite's unrotated position.  Therefore, collision\n checking will be inaccurate for tall narrow or short wide sprites that are\n rotated.", "deprecated": "false", "params": [{ "name": "other", "type": "component"}]}
    ,
      { "name": "Dragged", "description": "Handler for Dragged events.  On all calls, the starting coordinates\n are where the screen was first touched, and the \"current\" coordinates\n describe the endpoint of the current line segment.  On the first call\n within a given drag, the \"previous\" coordinates are the same as the\n starting coordinates; subsequently, they are the \"current\" coordinates\n from the prior call.  Note that the Sprite won't actually move\n anywhere in response to the Dragged event unless MoveTo is\n specifically called.", "deprecated": "false", "params": [{ "name": "startX", "type": "number"},{ "name": "startY", "type": "number"},{ "name": "prevX", "type": "number"},{ "name": "prevY", "type": "number"},{ "name": "currentX", "type": "number"},{ "name": "currentY", "type": "number"}]}
    ,
      { "name": "EdgeReached", "description": "Event handler called when the sprite reaches an edge of the screen. If Bounce is then called with that edge, the sprite will appear to bounce off of the edge it reached.  Edge here is represented as an integer that indicates one of eight directions north(1), northeast(2), east(3), southeast(4), south (-1), southwest(-2), west(-3), and northwest(-4).", "deprecated": "false", "params": [{ "name": "edge", "type": "number"}]}
    ,
      { "name": "Flung", "description": "When a fling gesture (quick swipe) is made on the sprite: provides\n the (x,y) position of the start of the fling, relative to the upper\n left of the canvas. Also provides the speed (pixels per millisecond) and heading\n (0-360 degrees) of the fling, as well as the x velocity and y velocity\n components of the fling's vector.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"},{ "name": "speed", "type": "number"},{ "name": "heading", "type": "number"},{ "name": "xvel", "type": "number"},{ "name": "yvel", "type": "number"}]}
    ,
      { "name": "NoLongerCollidingWith", "description": "Event indicating that a pair of sprites are no longer colliding.", "deprecated": "false", "params": [{ "name": "other", "type": "component"}]}
    ,
      { "name": "TouchDown", "description": "When the user begins touching the sprite (places finger on sprite and\n leaves it there): provides the (x,y) position of the touch, relative\n to the upper left of the canvas", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]}
    ,
      { "name": "TouchUp", "description": "When the user stops touching the sprite (lifts finger after a\n TouchDown event): provides the (x,y) position of the touch, relative\n to the upper left of the canvas", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]}
    ,
      { "name": "Touched", "description": "When the user touches the sprite and then immediately lifts finger: provides\n the (x,y) position of the touch, relative to the upper left of the canvas", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]}
    ],
    "methods": [{ "name": "Bounce", "description": "Makes this sprite bounce, as if off a wall.  For normal bouncing, the edge argument should be the one returned by EdgeReached.", "deprecated": "false", "params": [{ "name": "edge", "type": "number"}]},
      { "name": "CollidingWith", "description": "Indicates whether a collision has been registered between this sprite\n and the passed sprite.", "deprecated": "false", "params": [{ "name": "other", "type": "component"}], "returnType": "boolean"},
      { "name": "MoveIntoBounds", "description": "Moves the sprite back in bounds if part of it extends out of bounds,\n having no effect otherwise. If the sprite is too wide to fit on the\n canvas, this aligns the left side of the sprite with the left side of the\n canvas. If the sprite is too tall to fit on the canvas, this aligns the\n top side of the sprite with the top side of the canvas.", "deprecated": "false", "params": []},
      { "name": "MoveTo", "description": "Moves the sprite so that its left top corner is at the specfied x and y coordinates.", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]},
      { "name": "PointInDirection", "description": "Turns the sprite to point towards the point with coordinates as (x, y).", "deprecated": "false", "params": [{ "name": "x", "type": "number"},{ "name": "y", "type": "number"}]},
      { "name": "PointTowards", "description": "Turns the sprite to point towards a designated target sprite. The new heading will be parallel to the line joining the centerpoints of the two sprites.", "deprecated": "false", "params": [{ "name": "target", "type": "component"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Label",
    "name": "Label",
    "external": "false",
    "version": "4",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "A Label displays a piece of text, which is specified through the <code>Text<\/code> property.  Other properties, all of which can be set in the Designer or Blocks Editor, control the appearance and placement of the text.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00FFFFFF", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "HTMLFormat", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "HasMargins", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "0", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "FontBold", "description": "", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontItalic", "description": "", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontSize", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "HTMLFormat", "description": "If true, then this label will show html text else it will show plain text. Note: Not all HTML is supported.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "HasMargins", "description": "Reports whether or not the label appears with margins.  All four margins (left, right, top, bottom) are the same.  This property has no effect in the designer, where labels are always shown with margins.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Text", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.LineString",
    "name": "LineString",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MAPS",
    "helpString": "LineString",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Description", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Draggable", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "EnableInfobox", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "PointsFromString", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "StrokeColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "StrokeWidth", "editorType": "text", "defaultValue": "3", "editorArgs": []},
      { "name": "Title", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Description", "description": "The description displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Draggable", "description": "The Draggable property is used to set whether or not the user can drag the Marker by long-pressing and then dragging the marker to a new location.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "EnableInfobox", "description": "Enable or disable the infobox window display when the user taps the feature.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Points", "description": "A list of latitude and longitude pairs that represent the line segments of the polyline.", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "PointsFromString", "description": "", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "StrokeColor", "description": "The paint color used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "StrokeWidth", "description": "The width of the stroke used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Title", "description": "The title displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Type", "description": "The type of the map feature.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "Click", "description": "The user clicked on the feature.", "deprecated": "false", "params": []}
    ,
      { "name": "Drag", "description": "The user dragged the map feature.", "deprecated": "false", "params": []}
    ,
      { "name": "LongClick", "description": "The user long-pressed on the feature. This event will only trigger if Draggable is false.", "deprecated": "false", "params": []}
    ,
      { "name": "StartDrag", "description": "The user started a drag operation.", "deprecated": "false", "params": []}
    ,
      { "name": "StopDrag", "description": "The user stopped a drag operation.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "DistanceToFeature", "description": "Compute the distance, in meters, between two map features.", "deprecated": "false", "params": [{ "name": "mapFeature", "type": "component"},{ "name": "centroids", "type": "boolean"}], "returnType": "number"},
      { "name": "DistanceToPoint", "description": "Compute the distance, in meters, between a map feature and a latitude, longitude point.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"},{ "name": "centroid", "type": "boolean"}], "returnType": "number"},
      { "name": "HideInfobox", "description": "Hide the infobox if it is shown. If the infobox is not visible this function has no effect.", "deprecated": "false", "params": []},
      { "name": "ShowInfobox", "description": "Show the infobox for the feature. This will show the infobox even if", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.ListPicker",
    "name": "ListPicker",
    "external": "false",
    "version": "9",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "<p>A button that, when clicked on, displays a list of texts for the user to choose among. The texts can be specified through the Designer or Blocks Editor by setting the <code>ElementsFromString<\/code> property to their string-separated concatenation (for example, <em>choice 1, choice 2, choice 3<\/em>) or by setting the <code>Elements<\/code> property to a List in the Blocks editor.<\/p><p>Setting property ShowFilterBar to true, will make the list searchable.  Other properties affect the appearance of the button (<code>TextAlignment<\/code>, <code>BackgroundColor<\/code>, etc.) and whether it can be clicked on (<code>Enabled<\/code>).<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "ElementsFromString", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "ItemBackgroundColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "ItemTextColor", "editorType": "color", "defaultValue": "&HFFFFFFFF", "editorArgs": []},
      { "name": "Selection", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Shape", "editorType": "button_shape", "defaultValue": "0", "editorArgs": []},
      { "name": "ShowFeedback", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "ShowFilterBar", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Title", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "Returns the button's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Elements", "description": "", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "ElementsFromString", "description": "", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "Enabled", "description": "If set, user can tap check box to cause action.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "If set, button text is displayed in bold.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontItalic", "description": "If set, button text is displayed in italics.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontSize", "description": "Point size for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "Font family for button text.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Image to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ItemBackgroundColor", "description": "The background color of the ListPicker items.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "ItemTextColor", "description": "The text color of the ListPicker items.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Selection", "description": "The selected item.  When directly changed by the programmer, the SelectionIndex property is also changed to the first item in the ListPicker with the given value.  If the value does not appear, SelectionIndex will be set to 0.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "SelectionIndex", "description": "The index of the currently selected item, starting at 1.  If no item is selected, the value will be 0.  If an attempt is made to set this to a number less than 1 or greater than the number of items in the ListPicker, SelectionIndex will be set to 0, and Selection will be set to the empty text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Shape", "description": "Specifies the button's shape (default, rounded, rectangular, oval). The shape will not be visible if an Image is being displayed.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ShowFeedback", "description": "Specifies if a visual feedback should be shown  for a button that as an image as background.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowFilterBar", "description": "Returns current state of ShowFilterBar indicating if Search Filter Bar will be displayed on ListPicker or not", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Text", "description": "Text to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Left, center, or right.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "Color for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Title", "description": "Optional title displayed at the top of the list of choices.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "AfterPicking", "description": "Event to be raised after the picker activity returns its\n result and the properties have been filled in.", "deprecated": "false", "params": []}
    ,
      { "name": "BeforePicking", "description": "Event to raise when the button of the component is clicked or the list is shown\n using the Open block.  This event occurs before the list of items is displayed, and \n can be used to prepare the list before it is shown.", "deprecated": "false", "params": []}
    ,
      { "name": "GotFocus", "description": "Indicates the cursor moved over the button so it is now possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Indicates the cursor moved away from the button so it is now no longer possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchDown", "description": "Indicates that the button was pressed down.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchUp", "description": "Indicates that a button has been released.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "Open", "description": "Opens the picker, as though the user clicked on it.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.ListView",
    "name": "ListView",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "<p>This is a visible component that displays a list of text elements. <br> The list can be set using the ElementsFromString property or using the Elements block in the blocks editor. <\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "images/listView.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "ElementsFromString", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Selection", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "SelectionColor", "editorType": "color", "defaultValue": "&HFFCCCCCC", "editorArgs": []},
      { "name": "ShowFilterBar", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&HFFFFFFFF", "editorArgs": []},
      { "name": "TextSize", "editorType": "non_negative_integer", "defaultValue": "22", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "The color of the listview background.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Elements", "description": "List of text elements to show in the ListView.  This willsignal an error if the elements are not text strings.", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "ElementsFromString", "description": "The TextView elements specified as a string with the items separated by commas such as: Cheese,Fruit,Bacon,Radish. Each word before the comma will be an element in the list.", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "Height", "description": "Determines the height of the list on the view.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Selection", "description": "Returns the text last selected in the ListView.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "SelectionColor", "description": "The color of the item when it is selected.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "SelectionIndex", "description": "The index of the currently selected item, starting at 1.  If no item is selected, the value will be 0.  If an attempt is made to set this to a number less than 1 or greater than the number of items in the ListView, SelectionIndex will be set to 0, and Selection will be set to the empty text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowFilterBar", "description": "Sets visibility of ShowFilterBar. True will show the bar, False will hide it.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "TextColor", "description": "The text color of the listview items.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "TextSize", "description": "The text size of the listview items.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "Determines the width of the list on the view.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "AfterPicking", "description": "Simple event to be raised after the an element has been chosen in the list. The selected element is available in the Selection property.", "deprecated": "false", "params": []}
    ],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.LocationSensor",
    "name": "LocationSensor",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SENSORS",
    "helpString": "Non-visible component providing location information, including longitude, latitude, altitude (if supported by the device), speed (if supported by the device), and address.  This can also perform \"geocoding\", converting a given address (not necessarily the current one) to a latitude (with the <code>LatitudeFromAddress<\/code> method) and a longitude (with the <code>LongitudeFromAddress<\/code> method).<\/p>\n<p>In order to function, the component must have its <code>Enabled<\/code> property set to True, and the device must have location sensing enabled through wireless networks or GPS satellites (if outdoors).<\/p>\nLocation information might not be immediately available when an app starts.  You'll have to wait a short time for a location provider to be found and used, or wait for the OnLocationChanged event",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/locationSensor.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "DistanceInterval", "editorType": "sensor_dist_interval", "defaultValue": "5", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "TimeInterval", "editorType": "sensor_time_interval", "defaultValue": "60000", "editorArgs": []}],
    "blockProperties": [{ "name": "Accuracy", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Altitude", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "AvailableProviders", "description": "", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "CurrentAddress", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "DistanceInterval", "description": "Determines the minimum distance interval, in meters, that the sensor will try to use for sending out location updates. For example, if this is set to 5, then the sensor will fire a LocationChanged event only after 5 meters have been traversed. However, the sensor does not guarantee that an update will be received at exactly the distance interval. It may take more than 5 meters to fire an event, for instance.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Enabled", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "HasAccuracy", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "HasAltitude", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "HasLongitudeLatitude", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "Latitude", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Longitude", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "ProviderLocked", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ProviderName", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TimeInterval", "description": "Determines the minimum time interval, in milliseconds, that the sensor will try to use for sending out location updates. However, location updates will only be received when the location of the phone actually changes, and use of the specified time interval is not guaranteed. For example, if 1000 is used as the time interval, location updates will never be fired sooner than 1000ms, but they may be fired anytime after.", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "LocationChanged", "description": "Indicates that a new location has been detected.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"},{ "name": "altitude", "type": "number"},{ "name": "speed", "type": "number"}]}
    ,
      { "name": "StatusChanged", "description": "Indicates that the status of the location provider service has changed, such as when a\n provider is lost or a new provider starts being used.", "deprecated": "false", "params": [{ "name": "provider", "type": "text"},{ "name": "status", "type": "text"}]}
    ],
    "methods": [{ "name": "LatitudeFromAddress", "description": "Derives latitude of given address", "deprecated": "false", "params": [{ "name": "locationName", "type": "text"}], "returnType": "number"},
      { "name": "LongitudeFromAddress", "description": "Derives longitude of given address", "deprecated": "false", "params": [{ "name": "locationName", "type": "text"}], "returnType": "number"}]}
,
  { "type": "com.google.appinventor.components.runtime.Map",
    "name": "Map",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MAPS",
    "helpString": "<p>A two-dimensional container that renders map tiles in the background and allows for multiple Marker elements to identify points on the map. Map tiles are supplied by OpenStreetMap contributors and the United States Geological Survey.<\/p><p>The Map component provides three utilities for manipulating its boundaries within App Inventor. First, a locking mechanism is provided to allow the map to be moved relative to other components on the Screen. Second, when unlocked, the user can pan the Map to any location. At this new location, the &quot;Set Initial Boundary&quot; button can be pressed to save the current Map coordinates to its properties. Lastly, if the Map is moved to a different location, for example to add Markers off-screen, then the &quot;Reset Map to Initial Bounds&quot; button can be used to re-center the Map at the starting location.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 8,
    "properties": [{ "name": "CenterFromString", "editorType": "geographic_point", "defaultValue": "42.359144, -71.093612", "editorArgs": []},
      { "name": "EnablePan", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "EnableRotation", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "EnableZoom", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "LocationSensor", "editorType": "component:com.google.appinventor.components.runtime.LocationSensor", "defaultValue": "", "editorArgs": []},
      { "name": "MapType", "editorType": "map_type", "defaultValue": "1", "editorArgs": []},
      { "name": "Rotation", "editorType": "float", "defaultValue": "0.0", "editorArgs": []},
      { "name": "ScaleUnits", "editorType": "map_unit_system", "defaultValue": "1", "editorArgs": []},
      { "name": "ShowCompass", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "ShowScale", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "ShowUser", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "ShowZoom", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []},
      { "name": "ZoomLevel", "editorType": "map_zoom", "defaultValue": "13", "editorArgs": []}],
    "blockProperties": [{ "name": "BoundingBox", "description": "Bounding box for the map stored as [[North, West], [South, East]].", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "CenterFromString", "description": "<p>Set the initial center coordinate of the map. The value is specified as a comma-separated pair of decimal latitude and longitude coordinates, for example, <code>42.359144, -71.093612<\/code>.<\/p><p>In blocks code, it is recommended for performance reasons to use SetCenter with numerical latitude and longitude rather than convert to the string representation for use with this property.<\/p>", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "EnablePan", "description": "Enable two-finger panning of the Map", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "EnableRotation", "description": "If set to true, the user can use multitouch gestures to rotate the map around its current center.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "EnableZoom", "description": "If this property is set to true, multitouch zoom gestures are allowed on the map. Otherwise, the map zoom cannot be changed by the user except via the zoom control buttons.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Features", "description": "The list of features placed on this map. This list also includes any features created by calls to FeatureFromDescription", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Latitude", "description": "The latitude of the center of the map.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "LocationSensor", "description": "Uses the provided LocationSensor for user location data rather than the built-in location provider.", "type": "component", "rw": "write-only", "deprecated": "false"},
      { "name": "Longitude", "description": "The longitude of the center of the map.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "MapType", "description": "The type of tile layer to use as the base of the map. Valid values are: 1 (Roads), 2 (Aerial), 3 (Terrain)", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Rotation", "description": "Sets or gets the rotation of the map in decimal degrees if any", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ScaleUnits", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowCompass", "description": "Show a compass icon rotated based on user orientation.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowScale", "description": "Shows a scale reference on the map.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowUser", "description": "Show the user's location on the map.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowZoom", "description": "Show zoom buttons on the map.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "UserLatitude", "description": "Returns the user's latitude if ShowUser is enabled.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "UserLongitude", "description": "Returns the user's longitude if ShowUser is enabled.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "ZoomLevel", "description": "The zoom level of the map. Valid values of ZoomLevel are dependent on the tile provider and the latitude and longitude of the map. For example, zoom levels are more constrained over oceans than dense city centers to conserve space for storing tiles, so valid values may be 1-7 over ocean and 1-18 over cities. Tile providers may send warning or error tiles if the zoom level is too great for the server to support.", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "BoundsChange", "description": "User has changed the map bounds by panning or zooming the map.", "deprecated": "false", "params": []}
    ,
      { "name": "DoubleTapAtPoint", "description": "The user double-tapped at a point on the map. This event will be followed by a ZoomChanged event if zooming gestures are enabled and the map is not at the highest possible zoom level.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}]}
    ,
      { "name": "FeatureClick", "description": "The user clicked on a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "FeatureDrag", "description": "The user dragged a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "FeatureLongClick", "description": "The user long-pressed on a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "FeatureStartDrag", "description": "The user started dragging a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "FeatureStopDrag", "description": "The user stopped dragging a map feature.", "deprecated": "false", "params": [{ "name": "feature", "type": "component"}]}
    ,
      { "name": "GotFeatures", "description": "A GeoJSON document was successfully read from url. The features specified in the document are provided as a list in features.", "deprecated": "false", "params": [{ "name": "url", "type": "text"},{ "name": "features", "type": "list"}]}
    ,
      { "name": "InvalidPoint", "description": "An invalid coordinate was supplied during a maps operation. The message parameter will have more details about the issue.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ,
      { "name": "LoadError", "description": "An error was encountered while processing a GeoJSON document at the given url. The responseCode parameter will contain an HTTP status code and the errorMessage parameter will contain a detailed error message.", "deprecated": "false", "params": [{ "name": "url", "type": "text"},{ "name": "responseCode", "type": "number"},{ "name": "errorMessage", "type": "text"}]}
    ,
      { "name": "LongPressAtPoint", "description": "The user long-pressed at a point on the map.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}]}
    ,
      { "name": "Ready", "description": "Map has been initialized and is ready for user interaction.", "deprecated": "false", "params": []}
    ,
      { "name": "TapAtPoint", "description": "The user tapped at a point on the map.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}]}
    ,
      { "name": "ZoomChange", "description": "User has changed the zoom level of the map.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "CreateMarker", "description": "Create a new marker with default properties at the specified latitude and longitude.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}], "returnType": "component"},
      { "name": "FeatureFromDescription", "description": "Convert a feature description into an App Inventor map feature. Currently the only\n supported conversion is from a GeoJSON point to Marker component. If the feature has\n properties, they will be mapped into App Inventor properties using the following mapping:\n\n description becomes Description;\n draggable becomes Draggable;\n infobox becomes EnableInfobox;\n fill becomes FillColor;\n image becomes ImageAsset;\n stroke becomes StrokeColor;\n stroke-width becomes StrokeWidth;\n title becomes Title;\n visible becomes Visible", "deprecated": "false", "params": [{ "name": "description", "type": "list"}], "returnType": "any"},
      { "name": "LoadFromURL", "description": "<p>Load a feature collection in <a href=\"https:\/\/en.wikipedia.org\/wiki\/GeoJSON\">GeoJSON<\/a> format from the given url. On success, the event GotFeatures will be raised with the given url and a list of the features parsed from the GeoJSON as a list of (key, value) pairs. On failure, the LoadError event will be raised with any applicable HTTP response code and error message.<\/p>", "deprecated": "false", "params": [{ "name": "url", "type": "text"}]},
      { "name": "PanTo", "description": "Pan the map center to the given latitude and longitude and adjust the zoom level to the specified zoom.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"},{ "name": "zoom", "type": "number"}]},
      { "name": "Save", "description": "Save the contents of the Map to the specified path.", "deprecated": "false", "params": [{ "name": "path", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Marker",
    "name": "Marker",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MAPS",
    "helpString": "<p>An icon positioned at a point to indicate information on a map. Markers can be used to provide an info window, custom fill and stroke colors, and custom images to convey information to the user.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "AnchorHorizontal", "editorType": "horizontal_alignment", "defaultValue": "3", "editorArgs": []},
      { "name": "AnchorVertical", "editorType": "vertical_alignment", "defaultValue": "3", "editorArgs": []},
      { "name": "Description", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Draggable", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "EnableInfobox", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FillColor", "editorType": "color", "defaultValue": "&HFFFF0000", "editorArgs": []},
      { "name": "ImageAsset", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Latitude", "editorType": "latitude", "defaultValue": "0", "editorArgs": []},
      { "name": "Longitude", "editorType": "longitude", "defaultValue": "0", "editorArgs": []},
      { "name": "StrokeColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "StrokeWidth", "editorType": "integer", "defaultValue": "1", "editorArgs": []},
      { "name": "Title", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "AnchorHorizontal", "description": "The horizontal alignment property controls where the Marker's anchor is located relative to its width.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "AnchorVertical", "description": "The vertical alignment property controls where the Marker's anchor is located relative to its height.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Description", "description": "The description displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Draggable", "description": "The Draggable property is used to set whether or not the user can drag the Marker by long-pressing and then dragging the marker to a new location.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "EnableInfobox", "description": "Enable or disable the infobox window display when the user taps the feature.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FillColor", "description": "The paint color used to fill in the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "ImageAsset", "description": "The ImageAsset property is used to provide an alternative image for the Marker.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Latitude", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Longitude", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "ShowShadow", "description": "Gets whether or not the shadow of the Marker is shown.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "StrokeColor", "description": "The paint color used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "StrokeWidth", "description": "The width of the stroke used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Title", "description": "The title displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Type", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "Click", "description": "The user clicked on the feature.", "deprecated": "false", "params": []}
    ,
      { "name": "Drag", "description": "The user dragged the map feature.", "deprecated": "false", "params": []}
    ,
      { "name": "LongClick", "description": "The user long-pressed on the feature. This event will only trigger if Draggable is false.", "deprecated": "false", "params": []}
    ,
      { "name": "StartDrag", "description": "The user started a drag operation.", "deprecated": "false", "params": []}
    ,
      { "name": "StopDrag", "description": "The user stopped a drag operation.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "BearingToFeature", "description": "Returns the bearing from the Marker to the given map feature, in degrees from due north. If the centroids parameter is true, the bearing will be to the center of the map feature. Otherwise, the bearing will be computed to the point in the feature nearest the Marker.", "deprecated": "false", "params": [{ "name": "mapFeature", "type": "component"},{ "name": "centroids", "type": "boolean"}], "returnType": "number"},
      { "name": "BearingToPoint", "description": "Returns the bearing from the Marker to the given latitude and longitude, in degrees from due north.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}], "returnType": "number"},
      { "name": "DistanceToFeature", "description": "Compute the distance, in meters, between two map features.", "deprecated": "false", "params": [{ "name": "mapFeature", "type": "component"},{ "name": "centroids", "type": "boolean"}], "returnType": "number"},
      { "name": "DistanceToPoint", "description": "Compute the distance, in meters, between a map feature and a latitude, longitude point.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}], "returnType": "number"},
      { "name": "HideInfobox", "description": "Hide the infobox if it is shown. If the infobox is not visible this function has no effect.", "deprecated": "false", "params": []},
      { "name": "SetLocation", "description": "Set the location of the marker.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}]},
      { "name": "ShowInfobox", "description": "Show the infobox for the feature. This will show the infobox even if", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.MediaStore",
    "name": "MediaStore",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "INTERNAL",
    "helpString": "Non-visible component that communicates with a Web service and stores media files.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/mediastore.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "ServiceURL", "editorType": "string", "defaultValue": "http://ai-mediaservice.appspot.com", "editorArgs": []}],
    "blockProperties": [{ "name": "ServiceURL", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "MediaStored", "description": "Indicates that a MediaStored server request has succeeded.", "deprecated": "false", "params": [{ "name": "url", "type": "text"}]}
    ,
      { "name": "WebServiceError", "description": "Indicates that the communication with the Web service signaled an error", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ],
    "methods": [{ "name": "PostMedia", "description": "Asks the Web service to store the given media file.", "deprecated": "false", "params": [{ "name": "mediafile", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.NearField",
    "name": "NearField",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SENSORS",
    "helpString": "<p>Non-visible component to provide NFC capabilities.  For now this component supports the reading and writing of text tags only (if supported by the device)<\/p><p>In order to read and write text tags, the component must have its <code>ReadMode<\/code> property set to True or False respectively.<\/p><p><strong>Note:<\/strong> This component will only work on Screen1 of any App Inventor app.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/nearfield.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "ReadMode", "editorType": "boolean", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "LastMessage", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "ReadMode", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "TextToWrite", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "WriteType", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "TagRead", "description": "Indicates that a new tag has been detected.\n Currently this is only a plain text tag, as specified in the\n manifest.  See Compiler.java.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ,
      { "name": "TagWritten", "description": "Event for TagWritten", "deprecated": "false", "params": []}
    ],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.Notifier",
    "name": "Notifier",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "The Notifier component displays alert dialogs, messages, and temporary alerts, and creates Android log entries through the following methods: <ul><li> ShowMessageDialog: displays a message which the user must dismiss by pressing a button.<\/li><li> ShowChooseDialog: displays a message two buttons to let the user choose one of two responses, for example, yes or no, after which the AfterChoosing event is raised.<\/li><li> ShowTextDialog: lets the user enter text in response to the message, after which the AfterTextInput event is raised. <li> ShowAlert: displays a temporary  alert that goes away by itself after a short time.<\/li><li> ShowProgressDialog: displays an alert with a loading spinner that cannot be dismissed by the user. It can only be dismissed by using the DismissProgressDialog block.<\/li><li> DismissProgressDialog: Dismisses the progress dialog displayed by ShowProgressDialog.<\/li><li> LogError: logs an error message to the Android log. <\/li><li> LogInfo: logs an info message to the Android log.<\/li><li> LogWarning: logs a warning message to the Android log.<\/li><li>The messages in the dialogs (but not the alert) can be formatted using the following HTML tags:&lt;b&gt;, &lt;big&gt;, &lt;blockquote&gt;, &lt;br&gt;, &lt;cite&gt;, &lt;dfn&gt;, &lt;div&gt;, &lt;em&gt;, &lt;small&gt;, &lt;strong&gt;, &lt;sub&gt;, &lt;sup&gt;, &lt;tt&gt;. &lt;u&gt;<\/li><li>You can also use the font tag to specify color, for example, &lt;font color=\"blue\"&gt;.  Some of the available color names are aqua, black, blue, fuchsia, green, grey, lime, maroon, navy, olive, purple, red, silver, teal, white, and yellow<\/li><\/ul>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/notifier.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&HFF444444", "editorArgs": []},
      { "name": "NotifierLength", "editorType": "toast_length", "defaultValue": "1", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&HFFFFFFFF", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "Specifies the background color for alerts (not dialogs).", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "NotifierLength", "description": "specifies the length of time that the alert is shown -- either \"short\" or \"long\".", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "Specifies the text color for alerts (not dialogs).", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AfterChoosing", "description": "Event after the user has made a selection for ShowChooseDialog.", "deprecated": "false", "params": [{ "name": "choice", "type": "text"}]}
    ,
      { "name": "AfterTextInput", "description": "Event raised after the user has responded to ShowTextDialog.", "deprecated": "false", "params": [{ "name": "response", "type": "text"}]}
    ,
      { "name": "ChoosingCanceled", "description": "Event raised when the user canceled ShowChooseDialog.", "deprecated": "false", "params": []}
    ,
      { "name": "TextInputCanceled", "description": "Event raised when the user canceled ShowTextDialog.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "DismissProgressDialog", "description": "Dismiss a previously displayed ProgressDialog box", "deprecated": "false", "params": []},
      { "name": "LogError", "description": "Writes an error message to the Android system log. See the Google Android documentation for how to access the log.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]},
      { "name": "LogInfo", "description": "Writes an information message to the Android log.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]},
      { "name": "LogWarning", "description": "Writes a warning message to the Android log. See the Google Android documentation for how to access the log.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]},
      { "name": "ShowAlert", "description": "Display a temporary notification", "deprecated": "false", "params": [{ "name": "notice", "type": "text"}]},
      { "name": "ShowChooseDialog", "description": "Shows a dialog box with two buttons, from which the user can choose.  If cancelable is true there will be an additional CANCEL button. Pressing a button will raise the AfterChoosing event.  The \"choice\" parameter to AfterChoosing will be the text on the button that was pressed, or \"Cancel\" if the  CANCEL button was pressed.", "deprecated": "false", "params": [{ "name": "message", "type": "text"},{ "name": "title", "type": "text"},{ "name": "button1Text", "type": "text"},{ "name": "button2Text", "type": "text"},{ "name": "cancelable", "type": "boolean"}]},
      { "name": "ShowMessageDialog", "description": "Display an alert dialog with a single button that dismisses the alert.", "deprecated": "false", "params": [{ "name": "message", "type": "text"},{ "name": "title", "type": "text"},{ "name": "buttonText", "type": "text"}]},
      { "name": "ShowProgressDialog", "description": "Shows a dialog box with an optional title and message (use empty strings if they are not wanted). This dialog box contains a spinning artifact to indicate that the program is working. It cannot be canceled by the user but must be dismissed by the App Inventor Program by using the DismissProgressDialog block.", "deprecated": "false", "params": [{ "name": "message", "type": "text"},{ "name": "title", "type": "text"}]},
      { "name": "ShowTextDialog", "description": "Shows a dialog box where the user can enter text, after which the AfterTextInput event will be raised.  If cancelable is true there will be an additional CANCEL button. Entering text will raise the AfterTextInput event.  The \"response\" parameter to AfterTextInput will be the text that was entered, or \"Cancel\" if the CANCEL button was pressed.", "deprecated": "false", "params": [{ "name": "message", "type": "text"},{ "name": "title", "type": "text"},{ "name": "cancelable", "type": "boolean"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.NxtColorSensor",
    "name": "NxtColorSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a color sensor on a LEGO MINDSTORMS NXT robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsNxt.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "AboveRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BelowRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "BottomOfRange", "editorType": "non_negative_integer", "defaultValue": "256", "editorArgs": []},
      { "name": "ColorChangedEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "DetectColor", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "GenerateColor", "editorType": "lego_nxt_generated_color", "defaultValue": "&H00FFFFFF", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_nxt_sensor_port", "defaultValue": "3", "editorArgs": []},
      { "name": "TopOfRange", "editorType": "non_negative_integer", "defaultValue": "767", "editorArgs": []},
      { "name": "WithinRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "AboveRangeEventEnabled", "description": "Whether the AboveRange event should fire when the DetectColor property is set to False and the light level goes above the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BelowRangeEventEnabled", "description": "Whether the BelowRange event should fire when the DetectColor property is set to False and the light level goes below the BottomOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "invisible", "deprecated": "false"},
      { "name": "BottomOfRange", "description": "The bottom of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "ColorChangedEventEnabled", "description": "Whether the ColorChanged event should fire when the DetectColor property is set to True and the detected color changes.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "DetectColor", "description": "Whether the sensor should detect color or light. True indicates that the sensor should detect color; False indicates that the sensor should detect light. If the DetectColor property is set to True, the BelowRange, WithinRange, and AboveRange events will not occur and the sensor will not generate color. If the DetectColor property is set to False, the ColorChanged event will not occur.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "GenerateColor", "description": "The color that should generated by the sensor. Only None, Red, Green, or Blue are valid values. The sensor will not generate color when the DetectColor property is set to True.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "TopOfRange", "description": "The top of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WithinRangeEventEnabled", "description": "Whether the WithinRange event should fire when the DetectColor property is set to False and the light level goes between the BottomOfRange and the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AboveRange", "description": "Light level has gone above the range. The AboveRange event will not occur if the DetectColor property is set to True or if the AboveRangeEventEnabled property is set to False.", "deprecated": "false", "params": []}
    ,
      { "name": "BelowRange", "description": "Light level has gone below the range. The BelowRange event will not occur if the DetectColor property is set to True or if the BelowRangeEventEnabled property is set to False.", "deprecated": "false", "params": []}
    ,
      { "name": "ColorChanged", "description": "Detected color has changed. The ColorChanged event will not occur if the DetectColor property is set to False or if the ColorChangedEventEnabled property is set to False.", "deprecated": "false", "params": [{ "name": "color", "type": "number"}]}
    ,
      { "name": "WithinRange", "description": "Light level has gone within the range. The WithinRange event will not occur if the DetectColor property is set to True or if the WithinRangeEventEnabled property is set to False.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "GetColor", "description": "Returns the current detected color, or the color None if the color can not be read or if the DetectColor property is set to False.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "GetLightLevel", "description": "Returns the current light level as a value between 0 and 1023, or -1 if the light level can not be read or if the DetectColor property is set to True.", "deprecated": "false", "params": [], "returnType": "number"}]}
,
  { "type": "com.google.appinventor.components.runtime.NxtDirectCommands",
    "name": "NxtDirectCommands",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a low-level interface to a LEGO MINDSTORMS NXT robot, with functions to send NXT Direct Commands.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsNxt.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "invisible", "deprecated": "false"}],
    "events": [],
    "methods": [{ "name": "DeleteFile", "description": "Delete a file on the robot.", "deprecated": "false", "params": [{ "name": "fileName", "type": "text"}]},
      { "name": "DownloadFile", "description": "Download a file to the robot.", "deprecated": "false", "params": [{ "name": "source", "type": "text"},{ "name": "destination", "type": "text"}]},
      { "name": "GetBatteryLevel", "description": "Get the battery level for the robot. Returns the voltage in millivolts.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "GetBrickName", "description": "Get the brick name of the robot.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetCurrentProgramName", "description": "Get the name of currently running program on the robot.", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetFirmwareVersion", "description": "Get the firmware and protocol version numbers for the robot as a list where the first element is the firmware version number and the second element is the protocol version number.", "deprecated": "false", "params": [], "returnType": "list"},
      { "name": "GetInputValues", "description": "Reads the values of an input sensor on the robot. Assumes sensor type has been configured via SetInputMode.", "deprecated": "false", "params": [{ "name": "sensorPortLetter", "type": "text"}], "returnType": "list"},
      { "name": "GetOutputState", "description": "Reads the output state of a motor on the robot.", "deprecated": "false", "params": [{ "name": "motorPortLetter", "type": "text"}], "returnType": "list"},
      { "name": "KeepAlive", "description": "Keep Alive. Returns the current sleep time limit in milliseconds.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "ListFiles", "description": "Returns a list containing the names of matching files found on the robot.", "deprecated": "false", "params": [{ "name": "wildcard", "type": "text"}], "returnType": "list"},
      { "name": "LsGetStatus", "description": "Returns the count of available bytes to read.", "deprecated": "false", "params": [{ "name": "sensorPortLetter", "type": "text"}], "returnType": "number"},
      { "name": "LsRead", "description": "Reads unsigned low speed data from an input sensor on the robot. Assumes sensor type has been configured via SetInputMode.", "deprecated": "false", "params": [{ "name": "sensorPortLetter", "type": "text"}], "returnType": "list"},
      { "name": "LsWrite", "description": "Writes low speed data to an input sensor on the robot. Assumes sensor type has been configured via SetInputMode.", "deprecated": "false", "params": [{ "name": "sensorPortLetter", "type": "text"},{ "name": "list", "type": "list"},{ "name": "rxDataLength", "type": "number"}]},
      { "name": "MessageRead", "description": "Read a message from a mailbox (1-10) on the robot.", "deprecated": "false", "params": [{ "name": "mailbox", "type": "number"}], "returnType": "text"},
      { "name": "MessageWrite", "description": "Write a message to a mailbox (1-10) on the robot.", "deprecated": "false", "params": [{ "name": "mailbox", "type": "number"},{ "name": "message", "type": "text"}]},
      { "name": "PlaySoundFile", "description": "Play a sound file on the robot.", "deprecated": "false", "params": [{ "name": "fileName", "type": "text"}]},
      { "name": "PlayTone", "description": "Make the robot play a tone.", "deprecated": "false", "params": [{ "name": "frequencyHz", "type": "number"},{ "name": "durationMs", "type": "number"}]},
      { "name": "ResetInputScaledValue", "description": "Reset the scaled value of an input sensor on the robot.", "deprecated": "false", "params": [{ "name": "sensorPortLetter", "type": "text"}]},
      { "name": "ResetMotorPosition", "description": "Reset motor position.", "deprecated": "false", "params": [{ "name": "motorPortLetter", "type": "text"},{ "name": "relative", "type": "boolean"}]},
      { "name": "SetBrickName", "description": "Set the brick name of the robot.", "deprecated": "false", "params": [{ "name": "name", "type": "text"}]},
      { "name": "SetInputMode", "description": "Configure an input sensor on the robot.", "deprecated": "false", "params": [{ "name": "sensorPortLetter", "type": "text"},{ "name": "sensorType", "type": "number"},{ "name": "sensorMode", "type": "number"}]},
      { "name": "SetOutputState", "description": "Sets the output state of a motor on the robot.", "deprecated": "false", "params": [{ "name": "motorPortLetter", "type": "text"},{ "name": "power", "type": "number"},{ "name": "mode", "type": "number"},{ "name": "regulationMode", "type": "number"},{ "name": "turnRatio", "type": "number"},{ "name": "runState", "type": "number"},{ "name": "tachoLimit", "type": "number"}]},
      { "name": "StartProgram", "description": "Start execution of a previously downloaded program on the robot.", "deprecated": "false", "params": [{ "name": "programName", "type": "text"}]},
      { "name": "StopProgram", "description": "Stop execution of the currently running program on the robot.", "deprecated": "false", "params": []},
      { "name": "StopSoundPlayback", "description": "Stop sound playback.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.NxtDrive",
    "name": "NxtDrive",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a LEGO MINDSTORMS NXT robot, with functions that can move and turn the robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsNxt.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "DriveMotors", "editorType": "string", "defaultValue": "CB", "editorArgs": []},
      { "name": "StopBeforeDisconnect", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "WheelDiameter", "editorType": "float", "defaultValue": "4.32", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "invisible", "deprecated": "false"},
      { "name": "DriveMotors", "description": "The motor ports that are used for driving: the left wheel's motor port followed by the right wheel's motor port.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "StopBeforeDisconnect", "description": "Whether to stop the drive motors before disconnecting.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "WheelDiameter", "description": "The diameter of the wheels used for driving.", "type": "number", "rw": "invisible", "deprecated": "false"}],
    "events": [],
    "methods": [{ "name": "MoveBackward", "description": "Move the robot backward the given distance, with the specified percentage of maximum power, by powering both drive motors backward.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "distance", "type": "number"}]},
      { "name": "MoveBackwardIndefinitely", "description": "Move the robot backward indefinitely, with the specified percentage of maximum power, by powering both drive motors backward.", "deprecated": "false", "params": [{ "name": "power", "type": "number"}]},
      { "name": "MoveForward", "description": "Move the robot forward the given distance, with the specified percentage of maximum power, by powering both drive motors forward.", "deprecated": "false", "params": [{ "name": "power", "type": "number"},{ "name": "distance", "type": "number"}]},
      { "name": "MoveForwardIndefinitely", "description": "Move the robot forward indefinitely, with the specified percentage of maximum power, by powering both drive motors forward.", "deprecated": "false", "params": [{ "name": "power", "type": "number"}]},
      { "name": "Stop", "description": "Stop the drive motors of the robot.", "deprecated": "false", "params": []},
      { "name": "TurnClockwiseIndefinitely", "description": "Turn the robot clockwise indefinitely, with the specified percentage of maximum power, by powering the left drive motor forward and the right drive motor backward.", "deprecated": "false", "params": [{ "name": "power", "type": "number"}]},
      { "name": "TurnCounterClockwiseIndefinitely", "description": "Turn the robot counterclockwise indefinitely, with the specified percentage of maximum power, by powering the right drive motor forward and the left drive motor backward.", "deprecated": "false", "params": [{ "name": "power", "type": "number"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.NxtLightSensor",
    "name": "NxtLightSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a light sensor on a LEGO MINDSTORMS NXT robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsNxt.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "AboveRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BelowRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "BottomOfRange", "editorType": "non_negative_integer", "defaultValue": "256", "editorArgs": []},
      { "name": "GenerateLight", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_nxt_sensor_port", "defaultValue": "3", "editorArgs": []},
      { "name": "TopOfRange", "editorType": "non_negative_integer", "defaultValue": "767", "editorArgs": []},
      { "name": "WithinRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "AboveRangeEventEnabled", "description": "Whether the AboveRange event should fire when the light level goes above the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BelowRangeEventEnabled", "description": "Whether the BelowRange event should fire when the light level goes below the BottomOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "invisible", "deprecated": "false"},
      { "name": "BottomOfRange", "description": "The bottom of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "GenerateLight", "description": "Whether the light sensor should generate light.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "TopOfRange", "description": "The top of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WithinRangeEventEnabled", "description": "Whether the WithinRange event should fire when the light level goes between the BottomOfRange and the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AboveRange", "description": "Light level has gone above the range.", "deprecated": "false", "params": []}
    ,
      { "name": "BelowRange", "description": "Light level has gone below the range.", "deprecated": "false", "params": []}
    ,
      { "name": "WithinRange", "description": "Light level has gone within the range.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "GetLightLevel", "description": "Returns the current light level as a value between 0 and 1023, or -1 if the light level can not be read.", "deprecated": "false", "params": [], "returnType": "number"}]}
,
  { "type": "com.google.appinventor.components.runtime.NxtSoundSensor",
    "name": "NxtSoundSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a sound sensor on a LEGO MINDSTORMS NXT robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsNxt.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "AboveRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BelowRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "BottomOfRange", "editorType": "non_negative_integer", "defaultValue": "256", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_nxt_sensor_port", "defaultValue": "2", "editorArgs": []},
      { "name": "TopOfRange", "editorType": "non_negative_integer", "defaultValue": "767", "editorArgs": []},
      { "name": "WithinRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "AboveRangeEventEnabled", "description": "Whether the AboveRange event should fire when the sound level goes above the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BelowRangeEventEnabled", "description": "Whether the BelowRange event should fire when the sound level goes below the BottomOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "invisible", "deprecated": "false"},
      { "name": "BottomOfRange", "description": "The bottom of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "TopOfRange", "description": "The top of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WithinRangeEventEnabled", "description": "Whether the WithinRange event should fire when the sound level goes between the BottomOfRange and the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AboveRange", "description": "Sound level has gone above the range.", "deprecated": "false", "params": []}
    ,
      { "name": "BelowRange", "description": "Sound level has gone below the range.", "deprecated": "false", "params": []}
    ,
      { "name": "WithinRange", "description": "Sound level has gone within the range.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "GetSoundLevel", "description": "Returns the current sound level as a value between 0 and 1023, or -1 if the sound level can not be read.", "deprecated": "false", "params": [], "returnType": "number"}]}
,
  { "type": "com.google.appinventor.components.runtime.NxtTouchSensor",
    "name": "NxtTouchSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to a touch sensor on a LEGO MINDSTORMS NXT robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsNxt.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "PressedEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "ReleasedEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_nxt_sensor_port", "defaultValue": "1", "editorArgs": []}],
    "blockProperties": [{ "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "invisible", "deprecated": "false"},
      { "name": "PressedEventEnabled", "description": "Whether the Pressed event should fire when the touch sensor is pressed.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ReleasedEventEnabled", "description": "Whether the Released event should fire when the touch sensor is released.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"}],
    "events": [{ "name": "Pressed", "description": "Touch sensor has been pressed.", "deprecated": "false", "params": []}
    ,
      { "name": "Released", "description": "Touch sensor has been released.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "IsPressed", "description": "Returns true if the touch sensor is pressed.", "deprecated": "false", "params": [], "returnType": "boolean"}]}
,
  { "type": "com.google.appinventor.components.runtime.NxtUltrasonicSensor",
    "name": "NxtUltrasonicSensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LEGOMINDSTORMS",
    "helpString": "A component that provides a high-level interface to an ultrasonic sensor on a LEGO MINDSTORMS NXT robot.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/legoMindstormsNxt.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "AboveRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BelowRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "BluetoothClient", "editorType": "BluetoothClient", "defaultValue": "", "editorArgs": []},
      { "name": "BottomOfRange", "editorType": "non_negative_integer", "defaultValue": "30", "editorArgs": []},
      { "name": "SensorPort", "editorType": "lego_nxt_sensor_port", "defaultValue": "4", "editorArgs": []},
      { "name": "TopOfRange", "editorType": "non_negative_integer", "defaultValue": "90", "editorArgs": []},
      { "name": "WithinRangeEventEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "AboveRangeEventEnabled", "description": "Whether the AboveRange event should fire when the distance goes above the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BelowRangeEventEnabled", "description": "Whether the BelowRange event should fire when the distance goes below the BottomOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "BluetoothClient", "description": "The BluetoothClient component that should be used for communication.", "type": "component", "rw": "invisible", "deprecated": "false"},
      { "name": "BottomOfRange", "description": "The bottom of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "SensorPort", "description": "The sensor port that the sensor is connected to.", "type": "text", "rw": "invisible", "deprecated": "false"},
      { "name": "TopOfRange", "description": "The top of the range used for the BelowRange, WithinRange, and AboveRange events.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WithinRangeEventEnabled", "description": "Whether the WithinRange event should fire when the distance goes between the BottomOfRange and the TopOfRange.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AboveRange", "description": "Distance has gone above the range.", "deprecated": "false", "params": []}
    ,
      { "name": "BelowRange", "description": "Distance has gone below the range.", "deprecated": "false", "params": []}
    ,
      { "name": "WithinRange", "description": "Distance has gone within the range.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "GetDistance", "description": "Returns the current distance in centimeters as a value between 0 and 254, or -1 if the distance can not be read.", "deprecated": "false", "params": [], "returnType": "number"}]}
,
  { "type": "com.google.appinventor.components.runtime.OrientationSensor",
    "name": "OrientationSensor",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SENSORS",
    "helpString": "<p>Non-visible component providing information about the device's physical orientation in three dimensions: <ul> <li> <strong>Roll<\/strong>: 0 degrees when the device is level, increases to      90 degrees as the device is tilted up on its left side, and      decreases to -90 degrees when the device is tilted up on its right side.      <\/li> <li> <strong>Pitch<\/strong>: 0 degrees when the device is level, up to      90 degrees as the device is tilted so its top is pointing down,      up to 180 degrees as it gets turned over.  Similarly, as the device      is tilted so its bottom points down, pitch decreases to -90      degrees, then further decreases to -180 degrees as it gets turned all the way      over.<\/li> <li> <strong>Azimuth<\/strong>: 0 degrees when the top of the device is      pointing north, 90 degrees when it is pointing east, 180 degrees      when it is pointing south, 270 degrees when it is pointing west,      etc.<\/li><\/ul>     These measurements assume that the device itself is not moving.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/orientationsensor.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Angle", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Available", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "Azimuth", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Enabled", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Magnitude", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Pitch", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Roll", "description": "", "type": "number", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "OrientationChanged", "description": "Default OrientationChanged event handler.\n\n <p>This event is signalled when the device's orientation has changed.  It\n reports the new values of azimuth, pich, and roll, and it also sets the Azimuth, Pitch,\n and roll properties.<\/p>\n <p>Azimuth is the compass heading in degrees, pitch indicates how the device\n is tilted from top to bottom, and roll indicates how much the device is tilted from\n side to side.<\/p>", "deprecated": "false", "params": [{ "name": "azimuth", "type": "number"},{ "name": "pitch", "type": "number"},{ "name": "roll", "type": "number"}]}
    ],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.PasswordTextBox",
    "name": "PasswordTextBox",
    "external": "false",
    "version": "4",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "<p>A box for entering passwords.  This is the same as the ordinary <code>TextBox<\/code> component except this does not display the characters typed by the user.<\/p><p>The value of the text in the box can be found or set through the <code>Text<\/code> property. If blank, the <code>Hint<\/code> property, which appears as faint text in the box, can provide the user with guidance as to what to type.<\/p> <p>Text boxes are usually used with the <code>Button<\/code> component, with the user clicking on the button when text entry is complete.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Hint", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "0", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "The background color of the input box.  You can choose a color by name in the Designer or in the Blocks Editor.  The default background color is 'default' (shaded 3-D look).", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Enabled", "description": "Whether the user can enter text into this input box.  By default, this is true.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "Whether the font for the text should be bold.  By default, it is not.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontItalic", "description": "Whether the text should appear in italics.  By default, it does not.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontSize", "description": "The font size for the text.  By default, it is 14.0 points.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "The font for the text.  The value can be changed in the Designer.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Hint", "description": "Text that should appear faintly in the input box to provide a hint as to what the user should enter.  This can only be seen if the <code>Text<\/code> property is empty.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "PasswordVisible", "description": "Visibility of password.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Text", "description": "The text in the input box, which can be set by the programmer in the Designer or Blocks Editor, or it can be entered by the user (unless the <code>Enabled<\/code> property is false).", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Whether the text should be left justified, centered, or right justified.  By default, text is left justified.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "The color for the text.  You can choose a color by name in the Designer or in the Blocks Editor.  The default text color is black.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "GotFocus", "description": "Event raised when this component is selected for input, such as by\n the user touching it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Event raised when this component is no longer selected for input, such\n as if the user touches a different text box.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "RequestFocus", "description": "Sets the textbox active.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Pedometer",
    "name": "Pedometer",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SENSORS",
    "helpString": "A Component that acts like a Pedometer. It senses motion via the Accerleromter and attempts to determine if a step has been taken. Using a configurable stride length, it can estimate the distance traveled as well. ",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/pedometer.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "StopDetectionTimeout", "editorType": "non_negative_integer", "defaultValue": "2000", "editorArgs": []},
      { "name": "StrideLength", "editorType": "non_negative_float", "defaultValue": "0.73", "editorArgs": []}],
    "blockProperties": [{ "name": "CalibrateStrideLength", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "true"},
      { "name": "Distance", "description": "The approximate distance traveled in meters.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "ElapsedTime", "description": "Time elapsed in milliseconds since the pedometer was started.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Moving", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "true"},
      { "name": "SimpleSteps", "description": "The number of simple steps taken since the pedometer has started.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "StopDetectionTimeout", "description": "The duration in milliseconds of idleness (no steps detected) after which to go into a \"stopped\" state", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "StrideLength", "description": "Set the average stride length in meters.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "UseGPS", "description": "", "type": "boolean", "rw": "write-only", "deprecated": "true"},
      { "name": "WalkSteps", "description": "the number of walk steps taken since the pedometer has started.", "type": "number", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "CalibrationFailed", "description": "Event for CalibrationFailed", "deprecated": "true", "params": []}
    ,
      { "name": "GPSAvailable", "description": "Event for GPSAvailable", "deprecated": "true", "params": []}
    ,
      { "name": "GPSLost", "description": "Event for GPSLost", "deprecated": "true", "params": []}
    ,
      { "name": "SimpleStep", "description": "This event is run when a raw step is detected", "deprecated": "false", "params": [{ "name": "simpleSteps", "type": "number"},{ "name": "distance", "type": "number"}]}
    ,
      { "name": "StartedMoving", "description": "Event for StartedMoving", "deprecated": "true", "params": []}
    ,
      { "name": "StoppedMoving", "description": "Event for StoppedMoving", "deprecated": "true", "params": []}
    ,
      { "name": "WalkStep", "description": "This event is run when a walking step is detected. A walking step is a step that appears to be involved in forward motion.", "deprecated": "false", "params": [{ "name": "walkSteps", "type": "number"},{ "name": "distance", "type": "number"}]}
    ],
    "methods": [{ "name": "Pause", "description": "Pause counting of steps and distance.", "deprecated": "false", "params": []},
      { "name": "Reset", "description": "Resets the step counter, distance measure and time running.", "deprecated": "false", "params": []},
      { "name": "Resume", "description": "Resumes counting, synonym of Start.", "deprecated": "false", "params": []},
      { "name": "Save", "description": "Saves the pedometer state to the phone. Permits permits accumulation of steps and distance between invocations of an App that uses the pedometer. Different Apps will have their own saved state.", "deprecated": "false", "params": []},
      { "name": "Start", "description": "Start counting steps", "deprecated": "false", "params": []},
      { "name": "Stop", "description": "Stop counting steps", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.PhoneCall",
    "name": "PhoneCall",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SOCIAL",
    "helpString": "<p>A non-visible component that makes a phone call to the number specified in the <code>PhoneNumber<\/code> property, which can be set either in the Designer or Blocks Editor. The component has a <code>MakePhoneCall<\/code> method, enabling the program to launch a phone call.<\/p><p>Often, this component is used with the <code>ContactPicker<\/code> component, which lets the user select a contact from the ones stored on the phone and sets the <code>PhoneNumber<\/code> property to the contact's phone number.<\/p><p>To directly specify the phone number (e.g., 650-555-1212), set the <code>PhoneNumber<\/code> property to a Text with the specified digits (e.g., \"6505551212\").  Dashes, dots, and parentheses may be included (e.g., \"(650)-555-1212\") but will be ignored; spaces may not be included.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/phoneCall.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "PhoneNumber", "editorType": "string", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "PhoneNumber", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "IncomingCallAnswered", "description": "Event indicating that an incoming phone call is answered. phoneNumber is the incoming call phone number.", "deprecated": "false", "params": [{ "name": "phoneNumber", "type": "text"}]}
    ,
      { "name": "PhoneCallEnded", "description": "Event indicating that a phone call has ended. If status is 1, incoming call is missed or rejected; if status is 2, incoming call is answered before hanging up; if status is 3, outgoing call is hung up. phoneNumber is the ended call phone number.", "deprecated": "false", "params": [{ "name": "status", "type": "number"},{ "name": "phoneNumber", "type": "text"}]}
    ,
      { "name": "PhoneCallStarted", "description": "Event indicating that a phonecall has started. If status is 1, incoming call is ringing; if status is 2, outgoing call is dialled. phoneNumber is the incoming\/outgoing phone number.", "deprecated": "false", "params": [{ "name": "status", "type": "number"},{ "name": "phoneNumber", "type": "text"}]}
    ],
    "methods": [{ "name": "MakePhoneCall", "description": "Makes a phone call using the number in the PhoneNumber property.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.PhoneNumberPicker",
    "name": "PhoneNumberPicker",
    "external": "false",
    "version": "4",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SOCIAL",
    "helpString": "A button that, when clicked on, displays a list of the contacts' phone numbers to choose among. After the user has made a selection, the following properties will be set to information about the chosen contact: <ul>\n<li> <code>ContactName<\/code>: the contact's name <\/li>\n <li> <code>PhoneNumber<\/code>: the contact's phone number <\/li>\n <li> <code>EmailAddress<\/code>: the contact's email address <\/li> <li> <code>Picture<\/code>: the name of the file containing the contact's image, which can be used as a <code>Picture<\/code> property value for the <code>Image<\/code> or <code>ImageSprite<\/code> component.<\/li><\/ul>\n<\/p><p>Other properties affect the appearance of the button (<code>TextAlignment<\/code>, <code>BackgroundColor<\/code>, etc.) and whether it can be clicked on (<code>Enabled<\/code>).<\/p>\n<p>The PhoneNumberPicker component may not work on all Android devices. For example, on Android systems before system 3.0, the returned lists of phone numbers and email addresses will be empty.\n",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Shape", "editorType": "button_shape", "defaultValue": "0", "editorArgs": []},
      { "name": "ShowFeedback", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "Returns the button's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ContactName", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "ContactUri", "description": "URI that specifies the location of the contact on the device.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "EmailAddress", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "EmailAddressList", "description": "", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Enabled", "description": "If set, user can tap check box to cause action.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "If set, button text is displayed in bold.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontItalic", "description": "If set, button text is displayed in italics.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontSize", "description": "Point size for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "Font family for button text.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Image to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "PhoneNumber", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "PhoneNumberList", "description": "", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Picture", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Shape", "description": "Specifies the button's shape (default, rounded, rectangular, oval). The shape will not be visible if an Image is being displayed.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ShowFeedback", "description": "Specifies if a visual feedback should be shown  for a button that as an image as background.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Text", "description": "Text to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Left, center, or right.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "Color for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "AfterPicking", "description": "Event to be raised after the picker activity returns its\n result and the properties have been filled in.", "deprecated": "false", "params": []}
    ,
      { "name": "BeforePicking", "description": "Event to raise when the button of the component is clicked or the list is shown\n using the Open block.  This event occurs before the list of items is displayed, and \n can be used to prepare the list before it is shown.", "deprecated": "false", "params": []}
    ,
      { "name": "GotFocus", "description": "Indicates the cursor moved over the button so it is now possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Indicates the cursor moved away from the button so it is now no longer possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchDown", "description": "Indicates that the button was pressed down.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchUp", "description": "Indicates that a button has been released.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "Open", "description": "Opens the picker, as though the user clicked on it.", "deprecated": "false", "params": []},
      { "name": "ViewContact", "description": "view a contact via its URI", "deprecated": "false", "params": [{ "name": "uri", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.PhoneStatus",
    "name": "PhoneStatus",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "INTERNAL",
    "helpString": "Component that returns information about the phone.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/phoneip.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "WebRTC", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "WebRTC", "description": "If True we are using WebRTC to talk to the server.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "OnSettings", "description": "This event is fired when the \"settings\" menu item is selected (only available in the\n Companion App, defined in ReplForm.java).", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "GetInstaller", "description": "Return the app that installed us", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetVersionName", "description": "Return the our VersionName property", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "GetWifiIpAddress", "description": "Returns the IP address of the phone in the form of a String", "deprecated": "false", "params": [], "returnType": "text"},
      { "name": "SdkLevel", "description": "Get the current Android SDK Level", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "doFault", "description": "Causes an Exception, used to debug exception processing.", "deprecated": "false", "params": []},
      { "name": "installURL", "description": "Downloads the URL and installs it as an Android Package", "deprecated": "false", "params": [{ "name": "url", "type": "text"}]},
      { "name": "isConnected", "description": "Returns TRUE if the phone is on Wifi, FALSE otherwise", "deprecated": "false", "params": [], "returnType": "boolean"},
      { "name": "isDirect", "description": "Returns true if we are running in the emulator or USB Connection", "deprecated": "false", "params": [], "returnType": "boolean"},
      { "name": "setAssetsLoaded", "description": "Declare that we have loaded our initial assets and other assets should come from the sdcard", "deprecated": "false", "params": []},
      { "name": "setHmacSeedReturnCode", "description": "Establish the secret seed for HOTP generation. Return the SHA1 of the provided seed, this will be used to contact the rendezvous server. Note: This code also starts the connection negotiation process if we are using WebRTC. This is a bit of a kludge...", "deprecated": "false", "params": [{ "name": "seed", "type": "text"},{ "name": "rendezvousServer", "type": "text"}], "returnType": "text"},
      { "name": "shutdown", "description": "Really Exit the Application", "deprecated": "false", "params": []},
      { "name": "startHTTPD", "description": "Start the internal AppInvHTTPD to listen for incoming forms. FOR REPL USE ONLY!", "deprecated": "false", "params": [{ "name": "secure", "type": "boolean"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Player",
    "name": "Player",
    "external": "false",
    "version": "6",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "Multimedia component that plays audio and controls phone vibration.  The name of a multimedia field is specified in the <code>Source<\/code> property, which can be set in the Designer or in the Blocks Editor.  The length of time for a vibration is specified in the Blocks Editor in milliseconds (thousandths of a second).\n<p>For supported audio formats, see <a href=\"http:\/\/developer.android.com\/guide\/appendix\/media-formats.html\" target=\"_blank\">Android Supported Media Formats<\/a>.<\/p>\n<p>This component is best for long sound files, such as songs, while the <code>Sound<\/code> component is more efficient for short files, such as sound effects.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/player.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "Loop", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "PlayOnlyInForeground", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Source", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Volume", "editorType": "non_negative_float", "defaultValue": "50", "editorArgs": []}],
    "blockProperties": [{ "name": "IsPlaying", "description": "Reports whether the media is playing", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "Loop", "description": "If true, the player will loop when it plays. Setting Loop while the player is playing will affect the current playing.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "PlayOnlyInForeground", "description": "If true, the player will pause playing when leaving the current screen; if false (default option), the player continues playing whenever the current screen is displaying or not.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Source", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Volume", "description": "Sets the volume to a number between 0 and 100", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "Completed", "description": "Indicates that the media has reached the end", "deprecated": "false", "params": []}
    ,
      { "name": "OtherPlayerStarted", "description": "This event is signaled when another player has started (and the current player is playing or paused, but not stopped).", "deprecated": "false", "params": []}
    ,
      { "name": "PlayerError", "description": "The PlayerError event is no longer used. Please use the Screen.ErrorOccurred event instead.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ],
    "methods": [{ "name": "Pause", "description": "Suspends playing the media if it is playing.", "deprecated": "false", "params": []},
      { "name": "Start", "description": "Plays the media.  If it was previously paused, the playing is resumed.\n If it was previously stopped, it starts from the beginning.", "deprecated": "false", "params": []},
      { "name": "Stop", "description": "Stops playing the media and seeks to the beginning of the song.", "deprecated": "false", "params": []},
      { "name": "Vibrate", "description": "Vibrates for specified number of milliseconds.", "deprecated": "false", "params": [{ "name": "milliseconds", "type": "number"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Polygon",
    "name": "Polygon",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MAPS",
    "helpString": "Polygon",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Description", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Draggable", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "EnableInfobox", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FillColor", "editorType": "color", "defaultValue": "&HFFFF0000", "editorArgs": []},
      { "name": "HolePointsFromString", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "PointsFromString", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "StrokeColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "StrokeWidth", "editorType": "integer", "defaultValue": "1", "editorArgs": []},
      { "name": "Title", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Description", "description": "The description displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Draggable", "description": "The Draggable property is used to set whether or not the user can drag the Marker by long-pressing and then dragging the marker to a new location.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "EnableInfobox", "description": "Enable or disable the infobox window display when the user taps the feature.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FillColor", "description": "The paint color used to fill in the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HolePoints", "description": "", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "HolePointsFromString", "description": "Constructs holes in a polygon from a given list of coordinates per hole.", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "Points", "description": "Gets or sets the sequence of points used to draw the polygon.", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "PointsFromString", "description": "Constructs a polygon from the given list of coordinates.", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "StrokeColor", "description": "The paint color used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "StrokeWidth", "description": "The width of the stroke used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Title", "description": "The title displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Type", "description": "The type of the feature. For polygons, this returns the text \"Polygon\".", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "Click", "description": "The user clicked on the feature.", "deprecated": "false", "params": []}
    ,
      { "name": "Drag", "description": "The user dragged the map feature.", "deprecated": "false", "params": []}
    ,
      { "name": "LongClick", "description": "The user long-pressed on the feature. This event will only trigger if Draggable is false.", "deprecated": "false", "params": []}
    ,
      { "name": "StartDrag", "description": "The user started a drag operation.", "deprecated": "false", "params": []}
    ,
      { "name": "StopDrag", "description": "The user stopped a drag operation.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "Centroid", "description": "Returns the centroid of the Polygon as a (latitude, longitude) pair.", "deprecated": "false", "params": [], "returnType": "list"},
      { "name": "DistanceToFeature", "description": "Compute the distance, in meters, between two map features.", "deprecated": "false", "params": [{ "name": "mapFeature", "type": "component"},{ "name": "centroids", "type": "boolean"}], "returnType": "number"},
      { "name": "DistanceToPoint", "description": "Compute the distance, in meters, between a map feature and a latitude, longitude point.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"},{ "name": "centroid", "type": "boolean"}], "returnType": "number"},
      { "name": "HideInfobox", "description": "Hide the infobox if it is shown. If the infobox is not visible this function has no effect.", "deprecated": "false", "params": []},
      { "name": "ShowInfobox", "description": "Show the infobox for the feature. This will show the infobox even if", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.ProximitySensor",
    "name": "ProximitySensor",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SENSORS",
    "helpString": "<p>Non-visible component that can measures the proximity of an object in cm relative to the view screen of a device. This sensor is typically used to determine whether a handset is being held up to a persons ear; i.e. lets you determine how far away an object is from a device. Many devices return the absolute distance, in cm, but some return only near and far values. In this case, the sensor usually reports its maximum range value in the far state and a lesser value in the near state.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/proximitysensor.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "KeepRunningWhenOnPause", "editorType": "boolean", "defaultValue": "False", "editorArgs": []}],
    "blockProperties": [{ "name": "Available", "description": "Reports whether or not the device has a proximity sensor", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "Distance", "description": "Returns the distance from the object to the device", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Enabled", "description": "If enabled, then device will listen for changes in proximity", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "KeepRunningWhenOnPause", "description": "If set to true, it will keep sensing for proximity changes even when the app is not visible", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "MaximumRange", "description": "Reports the Maximum Range of the device's ProximitySensor", "type": "number", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "ProximityChanged", "description": "Triggered when distance (in cm) of the object to the device changes.", "deprecated": "false", "params": [{ "name": "distance", "type": "number"}]}
    ],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.Rectangle",
    "name": "Rectangle",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MAPS",
    "helpString": "Rectangle",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Description", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Draggable", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "EastLongitude", "editorType": "float", "defaultValue": "0", "editorArgs": []},
      { "name": "EnableInfobox", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FillColor", "editorType": "color", "defaultValue": "&HFFFF0000", "editorArgs": []},
      { "name": "NorthLatitude", "editorType": "float", "defaultValue": "0", "editorArgs": []},
      { "name": "SouthLatitude", "editorType": "float", "defaultValue": "0", "editorArgs": []},
      { "name": "StrokeColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "StrokeWidth", "editorType": "integer", "defaultValue": "1", "editorArgs": []},
      { "name": "Title", "editorType": "text", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []},
      { "name": "WestLongitude", "editorType": "float", "defaultValue": "0", "editorArgs": []}],
    "blockProperties": [{ "name": "Description", "description": "The description displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Draggable", "description": "The Draggable property is used to set whether or not the user can drag the Marker by long-pressing and then dragging the marker to a new location.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "EastLongitude", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "EnableInfobox", "description": "Enable or disable the infobox window display when the user taps the feature.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FillColor", "description": "The paint color used to fill in the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "NorthLatitude", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "SouthLatitude", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "StrokeColor", "description": "The paint color used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "StrokeWidth", "description": "The width of the stroke used to outline the map feature.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Title", "description": "The title displayed in the info window that appears when the user clicks on the map feature.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Type", "description": "The type of the feature. For rectangles, this returns the text \"Rectangle\".", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "WestLongitude", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "Click", "description": "The user clicked on the feature.", "deprecated": "false", "params": []}
    ,
      { "name": "Drag", "description": "The user dragged the map feature.", "deprecated": "false", "params": []}
    ,
      { "name": "LongClick", "description": "The user long-pressed on the feature. This event will only trigger if Draggable is false.", "deprecated": "false", "params": []}
    ,
      { "name": "StartDrag", "description": "The user started a drag operation.", "deprecated": "false", "params": []}
    ,
      { "name": "StopDrag", "description": "The user stopped a drag operation.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "Bounds", "description": "Returns the bounding box of the Rectangle in the format ((North West) (South East)).", "deprecated": "false", "params": [], "returnType": "list"},
      { "name": "Center", "description": "Returns the center of the Rectangle as a list of the form (Latitude Longitude).", "deprecated": "false", "params": [], "returnType": "list"},
      { "name": "DistanceToFeature", "description": "Compute the distance, in meters, between two map features.", "deprecated": "false", "params": [{ "name": "mapFeature", "type": "component"},{ "name": "centroids", "type": "boolean"}], "returnType": "number"},
      { "name": "DistanceToPoint", "description": "Compute the distance, in meters, between a map feature and a latitude, longitude point.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"},{ "name": "centroid", "type": "boolean"}], "returnType": "number"},
      { "name": "HideInfobox", "description": "Hide the infobox if it is shown. If the infobox is not visible this function has no effect.", "deprecated": "false", "params": []},
      { "name": "SetCenter", "description": "Moves the Rectangle so that it is centered on the given latitude and longitude while attempting to maintain the width and height of the Rectangle as measured from the center to the edges.", "deprecated": "false", "params": [{ "name": "latitude", "type": "number"},{ "name": "longitude", "type": "number"}]},
      { "name": "ShowInfobox", "description": "Show the infobox for the feature. This will show the infobox even if", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Sharing",
    "name": "Sharing",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SOCIAL",
    "helpString": "Sharing is a non-visible component that enables sharing files and\/or messages between your app and other apps installed on a device. The component will display a list of the installed apps that can handle the information provided, and will allow the user to choose one to share the content with, for instance a mail app, a social network app, a texting app, and so on.<br>The file path can be taken directly from other components such as the Camera or the ImagePicker, but can also be specified directly to read from storage. Be aware that different devices treat storage differently, so a few things to try if, for instance, you have a file called arrow.gif in the folder <code>Appinventor\/assets<\/code>, would be: <ul><li><code>\"file:\/\/\/sdcard\/Appinventor\/assets\/arrow.gif\"<\/code><\/li> or <li><code>\"\/storage\/Appinventor\/assets\/arrow.gif\"<\/code><\/li><\/ul>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/sharing.png",
    "androidMinSdk": 7,
    "properties": [],
    "blockProperties": [],
    "events": [],
    "methods": [{ "name": "ShareFile", "description": "Shares a file through any capable application installed on the phone by displaying a list of the available apps and allowing the user to choose one from the list. The selected app will open with the file inserted on it.", "deprecated": "false", "params": [{ "name": "file", "type": "text"}]},
      { "name": "ShareFileWithMessage", "description": "Shares both a file and a message through any capable application installed on the phone by displaying a list of available apps and allowing the user to  choose one from the list. The selected app will open with the file and message inserted on it.", "deprecated": "false", "params": [{ "name": "file", "type": "text"},{ "name": "message", "type": "text"}]},
      { "name": "ShareMessage", "description": "Shares a message through any capable application installed on the phone by displaying a list of the available apps and allowing the user to choose one from the list. The selected app will open with the message inserted on it.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Slider",
    "name": "Slider",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "A Slider is a progress bar that adds a draggable thumb. You can touch the thumb and drag left or right to set the slider thumb position. As the Slider thumb is dragged, it will trigger the PositionChanged event, reporting the position of the Slider thumb. The reported position of the Slider thumb can be used to dynamically update another component attribute, such as the font size of a TextBox or the radius of a Ball.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "ColorLeft", "editorType": "color", "defaultValue": "&HFFFFC800", "editorArgs": []},
      { "name": "ColorRight", "editorType": "color", "defaultValue": "&HFF888888", "editorArgs": []},
      { "name": "MaxValue", "editorType": "float", "defaultValue": "50.0", "editorArgs": []},
      { "name": "MinValue", "editorType": "float", "defaultValue": "10.0", "editorArgs": []},
      { "name": "ThumbEnabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "ThumbPosition", "editorType": "float", "defaultValue": "30.0", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "ColorLeft", "description": "The color of slider to the left of the thumb.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "ColorRight", "description": "The color of slider to the left of the thumb.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "MaxValue", "description": "Sets the maximum value of slider.  Changing the maximum value also resets Thumbposition to be halfway between the minimum and the (new) maximum. If the new maximum is less than the current minimum, then minimum and maximum will both be set to this value.  Setting MaxValue resets the thumb position to halfway between MinValue and MaxValue and signals the PositionChanged event.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "MinValue", "description": "Sets the minimum value of slider.  Changing the minimum value also resets Thumbposition to be halfway between the (new) minimum and the maximum. If the new minimum is greater than the current maximum, then minimum and maximum will both be set to this value.  Setting MinValue resets the thumb position to halfway between MinValue and MaxValue and signals the PositionChanged event.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ThumbEnabled", "description": "Sets whether or not to display the slider thumb.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "ThumbPosition", "description": "Sets the position of the slider thumb. If this value is greater than MaxValue, then it will be set to same value as MaxValue. If this value is less than MinValue, then it will be set to same value as MinValue.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "PositionChanged", "description": "Indicates that position of the slider thumb has changed.", "deprecated": "false", "params": [{ "name": "thumbPosition", "type": "number"}]}
    ],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.Sound",
    "name": "Sound",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "<p>A multimedia component that plays sound files and optionally vibrates for the number of milliseconds (thousandths of a second) specified in the Blocks Editor.  The name of the sound file to play can be specified either in the Designer or in the Blocks Editor.<\/p> <p>For supported sound file formats, see <a href=\"http:\/\/developer.android.com\/guide\/appendix\/media-formats.html\" target=\"_blank\">Android Supported Media Formats<\/a>.<\/p><p>This <code>Sound<\/code> component is best for short sound files, such as sound effects, while the <code>Player<\/code> component is more efficient for longer sounds, such as songs.<\/p><p>You might get an error if you attempt to play a sound immeditely after setting the source.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/soundEffect.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "MinimumInterval", "editorType": "non_negative_integer", "defaultValue": "500", "editorArgs": []},
      { "name": "Source", "editorType": "asset", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "MinimumInterval", "description": "The minimum interval, in milliseconds, between sounds.  If you play a sound, all further Play() calls will be ignored until the interval has elapsed.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Source", "description": "The name of the sound file.  Only certain formats are supported.  See http:\/\/developer.android.com\/guide\/appendix\/media-formats.html.", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "SoundError", "description": "The SoundError event is no longer used. Please use the Screen.ErrorOccurred event instead.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ],
    "methods": [{ "name": "Pause", "description": "Pauses playing the sound if it is being played.", "deprecated": "false", "params": []},
      { "name": "Play", "description": "Plays the sound specified by the Source property.", "deprecated": "false", "params": []},
      { "name": "Resume", "description": "Resumes playing the sound after a pause.", "deprecated": "false", "params": []},
      { "name": "Stop", "description": "Stops playing the sound if it is being played.", "deprecated": "false", "params": []},
      { "name": "Vibrate", "description": "Vibrates for the specified number of milliseconds.", "deprecated": "false", "params": [{ "name": "millisecs", "type": "number"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.SoundRecorder",
    "name": "SoundRecorder",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "<p>Multimedia component that records audio.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/soundRecorder.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "SavedRecording", "editorType": "string", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "SavedRecording", "description": "Specifies the path to the file where the recording should be stored. If this proprety is the empty string, then starting a recording will create a file in an appropriate location.  If the property is not the empty string, it should specify a complete path to a file in an existing directory, including a file name with the extension .3gp.", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AfterSoundRecorded", "description": "Provides the location of the newly created sound.", "deprecated": "false", "params": [{ "name": "sound", "type": "text"}]}
    ,
      { "name": "StartedRecording", "description": "Indicates that the recorder has started, and can be stopped.", "deprecated": "false", "params": []}
    ,
      { "name": "StoppedRecording", "description": "Indicates that the recorder has stopped, and can be started again.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "Start", "description": "Starts recording.", "deprecated": "false", "params": []},
      { "name": "Stop", "description": "Stops recording.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.SpeechRecognizer",
    "name": "SpeechRecognizer",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "Component for using Voice Recognition to convert from speech to text",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/speechRecognizer.png",
    "androidMinSdk": 7,
    "properties": [],
    "blockProperties": [{ "name": "Result", "description": "", "type": "text", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "AfterGettingText", "description": "Simple event to raise after the VoiceReco activity has returned", "deprecated": "false", "params": [{ "name": "result", "type": "text"}]}
    ,
      { "name": "BeforeGettingText", "description": "Simple event to raise when VoiceReco is invoked but before the VoiceReco\n activity is started.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "GetText", "description": "Solicits speech input from the user.  After the speech is converted to\n text, the AfterGettingText event will be raised.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Spinner",
    "name": "Spinner",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "<p>A spinner component that displays a pop-up with a list of elements. These elements can be set in the Designer or Blocks Editor by setting the<code>ElementsFromString<\/code> property to a string-separated concatenation (for example, <em>choice 1, choice 2, choice 3<\/em>) or by setting the <code>Elements<\/code> property to a List in the Blocks editor. Spinners are created with the first item already selected. So selecting  it does not generate an After Picking event. Consequently it's useful to make the  first Spinner item be a non-choice like \"Select from below...\". <\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "images/spinner.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "ElementsFromString", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Prompt", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Selection", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Elements", "description": "returns a list of text elements to be picked from.", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "ElementsFromString", "description": "sets the Spinner list to the elements passed in the comma-separated string", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Prompt", "description": "Text with the current title for the Spinner window", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Selection", "description": "Returns the current selected item in the spinner ", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "SelectionIndex", "description": "The index of the currently selected item, starting at 1. If no item is selected, the value will be 0.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "AfterSelecting", "description": "Event called after the user selects an item from the dropdown list.", "deprecated": "false", "params": [{ "name": "selection", "type": "text"}]}
    ],
    "methods": [{ "name": "DisplayDropdown", "description": "displays the dropdown list for selection, same action as when the user clicks on the spinner.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.TableArrangement",
    "name": "TableArrangement",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LAYOUT",
    "helpString": "<p>A formatting element in which to place components that should be displayed in tabular form.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Columns", "editorType": "non_negative_integer", "defaultValue": "2", "editorArgs": []},
      { "name": "Rows", "editorType": "non_negative_integer", "defaultValue": "2", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Columns", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Rows", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.TextBox",
    "name": "TextBox",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "<p>A box for the user to enter text.  The initial or user-entered text value is in the <code>Text<\/code> property.  If blank, the <code>Hint<\/code> property, which appears as faint text in the box, can provide the user with guidance as to what to type.<\/p><p>The <code>MultiLine<\/code> property determines if the text can havemore than one line.  For a single line text box, the keyboard will closeautomatically when the user presses the Done key.  To close the keyboard for multiline text boxes, the app should use  the HideKeyboard method or  rely on the user to press the Back key.<\/p><p>The <code> NumbersOnly<\/code> property restricts the keyboard to acceptnumeric input only.<\/p><p>Other properties affect the appearance of the text box (<code>TextAlignment<\/code>, <code>BackgroundColor<\/code>, etc.) and whether it can be used (<code>Enabled<\/code>).<\/p><p>Text boxes are usually used with the <code>Button<\/code> component, with the user clicking on the button when text entry is complete.<\/p><p>If the text entered by the user should not be displayed, use <code>PasswordTextBox<\/code> instead.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Hint", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "MultiLine", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "NumbersOnly", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "0", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&HFF000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "The background color of the input box.  You can choose a color by name in the Designer or in the Blocks Editor.  The default background color is 'default' (shaded 3-D look).", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Enabled", "description": "Whether the user can enter text into this input box.  By default, this is true.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "Whether the font for the text should be bold.  By default, it is not.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontItalic", "description": "Whether the text should appear in italics.  By default, it does not.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "FontSize", "description": "The font size for the text.  By default, it is 14.0 points.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "The font for the text.  The value can be changed in the Designer.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Hint", "description": "Text that should appear faintly in the input box to provide a hint as to what the user should enter.  This can only be seen if the <code>Text<\/code> property is empty.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "MultiLine", "description": "If true, then this text box accepts multiple lines of input, which are entered using the return key.  For single line text boxes there is a Done key instead of a return key, and pressing Done hides the keyboard.  The app should call the HideKeyboard method to hide the keyboard for a mutiline text box.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "NumbersOnly", "description": "If true, then this text box accepts only numbers as keyboard input.  Numbers can include a decimal point and an optional leading minus sign.  This applies to keyboard input only.  Even if NumbersOnly is true, you can use [set Text to] to enter any text at all.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Text", "description": "The text in the input box, which can be set by the programmer in the Designer or Blocks Editor, or it can be entered by the user (unless the <code>Enabled<\/code> property is false).", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Whether the text should be left justified, centered, or right justified.  By default, text is left justified.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "The color for the text.  You can choose a color by name in the Designer or in the Blocks Editor.  The default text color is black.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "GotFocus", "description": "Event raised when this component is selected for input, such as by\n the user touching it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Event raised when this component is no longer selected for input, such\n as if the user touches a different text box.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "HideKeyboard", "description": "Hide the keyboard.  Only multiline text boxes need this. Single line text boxes close the keyboard when the users presses the Done key.", "deprecated": "false", "params": []},
      { "name": "RequestFocus", "description": "Sets the textbox active.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.TextToSpeech",
    "name": "TextToSpeech",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "The TestToSpeech component speaks a given text aloud.  You can set the pitch and the rate of speech. <p>You can also set a language by supplying a language code.  This changes the pronounciation of words, not the actual language spoken.  For example, setting the language to French and speaking English text will sound like someone speaking English (en) with a French accent.<\/p> <p>You can also specify a country by supplying a country code. This can affect the pronounciation.  For example, British English (GBR) will sound different from US English (USA).  Not every country code will affect every language.<\/p> <p>The languages and countries available depend on the particular device, and can be listed with the AvailableLanguages and AvailableCountries properties.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/textToSpeech.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "Country", "editorType": "countries", "defaultValue": "", "editorArgs": []},
      { "name": "Language", "editorType": "languages", "defaultValue": "", "editorArgs": []},
      { "name": "Pitch", "editorType": "float", "defaultValue": "1.0", "editorArgs": []},
      { "name": "SpeechRate", "editorType": "float", "defaultValue": "1.0", "editorArgs": []}],
    "blockProperties": [{ "name": "AvailableCountries", "description": "List of the country codes available on this device for use with TextToSpeech.  Check the Android developer documentation under supported languages to find the meanings of these abbreviations.", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "AvailableLanguages", "description": "List of the languages available on this device for use with TextToSpeech.  Check the Android developer documentation under supported languages to find the meanings of these abbreviations.", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Country", "description": "Country code to use for speech generation.  This can affect the pronounciation.  For example, British English (GBR) will sound different from US English (USA).  Not every country code will affect every language.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Language", "description": "Sets the language for TextToSpeech. This changes the way that words are pronounced, not the actual language that is spoken.  For example setting the language to and speaking English text with sound like someone speaking English with a Frernch accent.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Pitch", "description": "Sets the Pitch for TextToSpeech The values should be between 0 and 2 where lower values lower the tone of synthesized voice and greater values raise it.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Result", "description": "", "type": "boolean", "rw": "read-only", "deprecated": "false"},
      { "name": "SpeechRate", "description": "Sets the SpeechRate for TextToSpeech. The values should be between 0 and 2 where lower values slow down the pitch and greater values accelerate it.", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "AfterSpeaking", "description": "Event to raise after the message is spoken.", "deprecated": "false", "params": [{ "name": "result", "type": "boolean"}]}
    ,
      { "name": "BeforeSpeaking", "description": "Event to raise when Speak is invoked, before the message is spoken.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "Speak", "description": "Speaks the given message.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Texting",
    "name": "Texting",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SOCIAL",
    "helpString": "<p>A component that will, when the <code>SendMessage<\/code> method is called, send the text message specified in the <code>Message<\/code> property to the phone number specified in the <code>PhoneNumber<\/code> property.<\/p> <p>If the <code>ReceivingEnabled<\/code> property is set to 1 messages will <b>not<\/b> be received. If <code>ReceivingEnabled<\/code> is set to 2 messages will be received only when the application is running. Finally if <code>ReceivingEnabled<\/code> is set to 3, messages will be received when the application is running <b>and<\/b> when the application is not running they will be queued and a notification displayed to the user.<\/p> <p>When a message arrives, the <code>MessageReceived<\/code> event is raised and provides the sending number and message.<\/p> <p> An app that includes this component will receive messages even when it is in the background (i.e. when it's not visible on the screen) and, moreso, even if the app is not running, so long as it's installed on the phone. If the phone receives a text message when the app is not in the foreground, the phone will show a notification in the notification bar.  Selecting the notification will bring up the app.  As an app developer, you'll probably want to give your users the ability to control ReceivingEnabled so that they can make the phone ignore text messages.<\/p> <p>If the GoogleVoiceEnabled property is true, messages can be sent over Wifi using Google Voice. This option requires that the user have a Google Voice account and that the mobile Voice app is installed on the phone. The Google Voice option works only on phones that support Android 2.0 (Eclair) or higher.<\/p> <p>To specify the phone number (e.g., 650-555-1212), set the <code>PhoneNumber<\/code> property to a Text string with the specified digits (e.g., 6505551212).  Dashes, dots, and parentheses may be included (e.g., (650)-555-1212) but will be ignored; spaces may not be included.<\/p> <p>Another way for an app to specify a phone number would be to include a <code>PhoneNumberPicker<\/code> component, which lets the users select a phone numbers from the ones stored in the the phone's contacts.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/texting.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "GoogleVoiceEnabled", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Message", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "PhoneNumber", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ReceivingEnabled", "editorType": "text_receiving", "defaultValue": "2", "editorArgs": []}],
    "blockProperties": [{ "name": "GoogleVoiceEnabled", "description": "If true, then SendMessage will attempt to send messages over Wifi using Google Voice.  This requires that the Google Voice app must be installed and set up on the phone or tablet, with a Google Voice account.  If GoogleVoiceEnabled is false, the device must have phone and texting service in order to send or receive messages with this component.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Message", "description": "The message that will be sent when the SendMessage method is called.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "PhoneNumber", "description": "The number that the message will be sent to when the SendMessage method is called. The number is a text string with the specified digits (e.g., 6505551212).  Dashes, dots, and parentheses may be included (e.g., (650)-555-1212) but will be ignored; spaces should not be included.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ReceivingEnabled", "description": "If set to 1 (OFF) no messages will be received.  If set to 2 (FOREGROUND) or3 (ALWAYS) the component will respond to messages if it is running. If the app is not running then the message will be discarded if set to 2 (FOREGROUND). If set to 3 (ALWAYS) and the app is not running the phone will show a notification.  Selecting the notification will bring up the app and signal the MessageReceived event.  Messages received when the app is dormant will be queued, and so several MessageReceived events might appear when the app awakens.  As an app developer, it would be a good idea to give your users control over this property, so they can make their phones ignore text messages when your app is installed.", "type": "number", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "MessageReceived", "description": "Event that's raised when a text message is received by the phone.", "deprecated": "false", "params": [{ "name": "number", "type": "text"},{ "name": "messageText", "type": "text"}]}
    ],
    "methods": [{ "name": "SendMessage", "description": "Send a text message", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.TimePicker",
    "name": "TimePicker",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "<p>A button that, when clicked on, launches  a popup dialog to allow the user to select a time.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Enabled", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "FontBold", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontItalic", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0", "editorArgs": []},
      { "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Shape", "editorType": "button_shape", "defaultValue": "0", "editorArgs": []},
      { "name": "ShowFeedback", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "Text", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1", "editorArgs": []},
      { "name": "TextColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "BackgroundColor", "description": "Returns the button's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Enabled", "description": "If set, user can tap check box to cause action.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontBold", "description": "If set, button text is displayed in bold.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontItalic", "description": "If set, button text is displayed in italics.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "FontSize", "description": "Point size for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "FontTypeface", "description": "Font family for button text.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Hour", "description": "The hour of the last time set using the time picker. The hour is in a 24 hour format. If the last time set was 11:53 pm, this property will return 23.", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Image", "description": "Image to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Instant", "description": "The instant of the last time set using the time picker", "type": "InstantInTime", "rw": "read-only", "deprecated": "false"},
      { "name": "Minute", "description": "The minute of the last time set using the time picker", "type": "number", "rw": "read-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Shape", "description": "Specifies the button's shape (default, rounded, rectangular, oval). The shape will not be visible if an Image is being displayed.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "ShowFeedback", "description": "Specifies if a visual feedback should be shown  for a button that as an image as background.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Text", "description": "Text to display on button.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "TextAlignment", "description": "Left, center, or right.", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "TextColor", "description": "Color for button text.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "AfterTimeSet", "description": "This event is run when a user has set the time in the popup dialog.", "deprecated": "false", "params": []}
    ,
      { "name": "GotFocus", "description": "Indicates the cursor moved over the button so it is now possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "LostFocus", "description": "Indicates the cursor moved away from the button so it is now no longer possible to click it.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchDown", "description": "Indicates that the button was pressed down.", "deprecated": "false", "params": []}
    ,
      { "name": "TouchUp", "description": "Indicates that a button has been released.", "deprecated": "false", "params": []}
    ],
    "methods": [{ "name": "LaunchPicker", "description": "Launches the TimePicker popup.", "deprecated": "false", "params": []},
      { "name": "SetTimeToDisplay", "description": "Set the time to be shown in the Time Picker popup. Current time is shown by default.", "deprecated": "false", "params": [{ "name": "hour", "type": "number"},{ "name": "minute", "type": "number"}]},
      { "name": "SetTimeToDisplayFromInstant", "description": "Set the time from the instant to be shown in the Time Picker popup. Current time is shown by default.", "deprecated": "false", "params": [{ "name": "instant", "type": "InstantInTime"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.TinyDB",
    "name": "TinyDB",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "STORAGE",
    "helpString": "TinyDB is a non-visible component that stores data for an app. <p> Apps created with App Inventor are initialized each time they run: If an app sets the value of a variable and the user then quits the app, the value of that variable will not be remembered the next time the app is run. In contrast, TinyDB is a <em> persistent <\/em> data store for the app, that is, the data stored there will be available each time the app is run. An example might be a game that saves the high score and retrieves it each time the game is played. <\/<p> <p> Data items are strings stored under <em>tags<\/em> . To store a data item, you specify the tag it should be stored under.  Subsequently, you can retrieve the data that was stored under a given tag. <\/p><p> There is only one data store per app. Even if you have multiple TinyDB components, they will use the same data store. To get the effect of separate stores, use different keys. Also each app has its own data store. You cannot use TinyDB to pass data between two different apps on the phone, although you <em>can<\/em> use TinyDb to shares data between the different screens of a multi-screen app. <\/p> <p>When you are developing apps using the AI Companion, all the apps using that companion will share the same TinyDb.  That sharing will disappear once the apps are packaged.  But, during development, you should be careful to clear the TinyDb each time you start working on a new app.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/tinyDB.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "Namespace", "editorType": "string", "defaultValue": "TinyDB1", "editorArgs": []}],
    "blockProperties": [{ "name": "Namespace", "description": "Namespace for storing data.", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [],
    "methods": [{ "name": "ClearAll", "description": "Clear the entire data store", "deprecated": "false", "params": []},
      { "name": "ClearTag", "description": "Clear the entry with the given tag", "deprecated": "false", "params": [{ "name": "tag", "type": "text"}]},
      { "name": "GetTags", "description": "Return a list of all the tags in the data store", "deprecated": "false", "params": [], "returnType": "any"},
      { "name": "GetValue", "description": "Retrieve the value stored under the given tag.  If there's no such tag, then return valueIfTagNotThere.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "valueIfTagNotThere", "type": "any"}], "returnType": "any"},
      { "name": "StoreValue", "description": "Store the given value under the given tag.  The storage persists on the\n phone when the app is restarted.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "valueToStore", "type": "any"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.TinyWebDB",
    "name": "TinyWebDB",
    "external": "false",
    "version": "2",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "STORAGE",
    "helpString": "Non-visible component that communicates with a Web service to store and retrieve information.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/tinyWebDB.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "ServiceURL", "editorType": "string", "defaultValue": "http://tinywebdb.appinventor.mit.edu", "editorArgs": []}],
    "blockProperties": [{ "name": "ServiceURL", "description": "", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "GotValue", "description": "Indicates that a GetValue server request has succeeded.", "deprecated": "false", "params": [{ "name": "tagFromWebDB", "type": "text"},{ "name": "valueFromWebDB", "type": "any"}]}
    ,
      { "name": "ValueStored", "description": "Event indicating that a StoreValue server request has succeeded.", "deprecated": "false", "params": []}
    ,
      { "name": "WebServiceError", "description": "Indicates that the communication with the Web service signaled an error", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ],
    "methods": [{ "name": "GetValue", "description": "GetValue asks the Web service to get the value stored under the given tag.\n It is up to the Web service what to return if there is no value stored\n under the tag.  This component just accepts whatever is returned.", "deprecated": "false", "params": [{ "name": "tag", "type": "text"}]},
      { "name": "StoreValue", "description": "Asks the Web service to store the given value under the given tag", "deprecated": "false", "params": [{ "name": "tag", "type": "text"},{ "name": "valueToStore", "type": "any"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.Twitter",
    "name": "Twitter",
    "external": "false",
    "version": "4",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "SOCIAL",
    "helpString": "A non-visible component that enables communication with <a href=\"http:\/\/www.twitter.com\" target=\"_blank\">Twitter<\/a>. Once a user has logged into their Twitter account (and the authorization has been confirmed successful by the <code>IsAuthorized<\/code> event), many more operations are available:<ul><li> Searching Twitter for tweets or labels (<code>SearchTwitter<\/code>)<\/li>\n<li> Sending a Tweet (<code>Tweet<\/code>)     <\/li>\n<li> Sending a Tweet with an Image (<code>TweetWithImage<\/code>)     <\/li>\n<li> Directing a message to a specific user      (<code>DirectMessage<\/code>)<\/li>\n <li> Receiving the most recent messages directed to the logged-in user      (<code>RequestDirectMessages<\/code>)<\/li>\n <li> Following a specific user (<code>Follow<\/code>)<\/li>\n<li> Ceasing to follow a specific user (<code>StopFollowing<\/code>)<\/li>\n<li> Getting a list of users following the logged-in user      (<code>RequestFollowers<\/code>)<\/li>\n <li> Getting the most recent messages of users followed by the      logged-in user (<code>RequestFriendTimeline<\/code>)<\/li>\n <li> Getting the most recent mentions of the logged-in user      (<code>RequestMentions<\/code>)<\/li><\/ul><\/p>\n <p>You must obtain a Consumer Key and Consumer Secret for Twitter authorization  specific to your app from http:\/\/twitter.com\/oauth_clients\/new",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/twitter.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "ConsumerKey", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "ConsumerSecret", "editorType": "string", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "ConsumerKey", "description": "The the consumer key to be used when authorizing with Twitter via OAuth.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "ConsumerSecret", "description": "The consumer secret to be used when authorizing with Twitter via OAuth", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "DirectMessages", "description": "This property contains a list of the most recent messages mentioning the logged-in user.  Initially, the list is empty.  To set it, the program must: <ol> <li> Call the <code>Authorize<\/code> method.<\/li> <li> Wait for the <code>Authorized<\/code> event.<\/li> <li> Call the <code>RequestDirectMessages<\/code> method.<\/li> <li> Wait for the <code>DirectMessagesReceived<\/code> event.<\/li><\/ol>\nThe value of this property will then be set to the list of direct messages retrieved (and maintain that value until any subsequent call to <code>RequestDirectMessages<\/code>).", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Followers", "description": "This property contains a list of the followers of the logged-in user.  Initially, the list is empty.  To set it, the program must: <ol> <li> Call the <code>Authorize<\/code> method.<\/li> <li> Wait for the <code>IsAuthorized<\/code> event.<\/li> <li> Call the <code>RequestFollowers<\/code> method.<\/li> <li> Wait for the <code>FollowersReceived<\/code> event.<\/li><\/ol>\nThe value of this property will then be set to the list of followers (and maintain its value until any subsequent call to <code>RequestFollowers<\/code>).", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "FriendTimeline", "description": "This property contains the 20 most recent messages of users being followed.  Initially, the list is empty.  To set it, the program must: <ol> <li> Call the <code>Authorize<\/code> method.<\/li> <li> Wait for the <code>IsAuthorized<\/code> event.<\/li> <li> Specify users to follow with one or more calls to the <code>Follow<\/code> method.<\/li> <li> Call the <code>RequestFriendTimeline<\/code> method.<\/li> <li> Wait for the <code>FriendTimelineReceived<\/code> event.<\/li> <\/ol>\nThe value of this property will then be set to the list of messages (and maintain its value until any subsequent call to <code>RequestFriendTimeline<\/code>.", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "Mentions", "description": "This property contains a list of mentions of the logged-in user.  Initially, the list is empty.  To set it, the program must: <ol> <li> Call the <code>Authorize<\/code> method.<\/li> <li> Wait for the <code>IsAuthorized<\/code> event.<\/li> <li> Call the <code>RequestMentions<\/code> method.<\/li> <li> Wait for the <code>MentionsReceived<\/code> event.<\/li><\/ol>\nThe value of this property will then be set to the list of mentions (and will maintain its value until any subsequent calls to <code>RequestMentions<\/code>).", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "SearchResults", "description": "This property, which is initially empty, is set to a list of search results after the program: <ol><li>Calls the <code>SearchTwitter<\/code> method.<\/li> <li>Waits for the <code>SearchSuccessful<\/code> event.<\/li><\/ol>\nThe value of the property will then be the same as the parameter to <code>SearchSuccessful<\/code>.  Note that it is not necessary to call the <code>Authorize<\/code> method before calling <code>SearchTwitter<\/code>.", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "TwitPic_API_Key", "description": "The API Key for image uploading, provided by TwitPic.", "type": "text", "rw": "read-write", "deprecated": "true"},
      { "name": "Username", "description": "The user name of the authorized user. Empty if there is no authorized user.", "type": "text", "rw": "read-only", "deprecated": "false"}],
    "events": [{ "name": "DirectMessagesReceived", "description": "This event is raised when the recent messages requested through <code>RequestDirectMessages<\/code> have been retrieved. A list of the messages can then be found in the <code>messages<\/code> parameter or the <code>Messages<\/code> property.", "deprecated": "false", "params": [{ "name": "messages", "type": "list"}]}
    ,
      { "name": "FollowersReceived", "description": "This event is raised when all of the followers of the logged-in user requested through <code>RequestFollowers<\/code> have been retrieved. A list of the followers can then be found in the <code>followers<\/code> parameter or the <code>Followers<\/code> property.", "deprecated": "false", "params": [{ "name": "followers2", "type": "list"}]}
    ,
      { "name": "FriendTimelineReceived", "description": "This event is raised when the messages requested through <code>RequestFriendTimeline<\/code> have been retrieved. The <code>timeline<\/code> parameter and the <code>Timeline<\/code> property will contain a list of lists, where each sub-list contains a status update of the form (username message)", "deprecated": "false", "params": [{ "name": "timeline", "type": "list"}]}
    ,
      { "name": "IsAuthorized", "description": "This event is raised after the program calls <code>Authorize<\/code> if the authorization was successful.  It is also called after a call to <code>CheckAuthorized<\/code> if we already have a valid access token. After this event has been raised, any other method for this component can be called.", "deprecated": "false", "params": []}
    ,
      { "name": "MentionsReceived", "description": "This event is raised when the mentions of the logged-in user requested through <code>RequestMentions<\/code> have been retrieved.  A list of the mentions can then be found in the <code>mentions<\/code> parameter or the <code>Mentions<\/code> property.", "deprecated": "false", "params": [{ "name": "mentions", "type": "list"}]}
    ,
      { "name": "SearchSuccessful", "description": "This event is raised when the results of the search requested through <code>SearchSuccessful<\/code> have been retrieved. A list of the results can then be found in the <code>results<\/code> parameter or the <code>Results<\/code> property.", "deprecated": "false", "params": [{ "name": "searchResults", "type": "list"}]}
    ],
    "methods": [{ "name": "Authorize", "description": "Redirects user to login to Twitter via the Web browser using the OAuth protocol if we don't already have authorization.", "deprecated": "false", "params": []},
      { "name": "CheckAuthorized", "description": "Checks whether we already have access, and if so, causes IsAuthorized event handler to be called.", "deprecated": "false", "params": []},
      { "name": "DeAuthorize", "description": "Removes Twitter authorization from this running app instance", "deprecated": "false", "params": []},
      { "name": "DirectMessage", "description": "This sends a direct (private) message to the specified user.  The message will be trimmed if it exceeds 160characters. <p><u>Requirements<\/u>: This should only be called after the <code>IsAuthorized<\/code> event has been raised, indicating that the user has successfully logged in to Twitter.<\/p>", "deprecated": "false", "params": [{ "name": "user", "type": "text"},{ "name": "message", "type": "text"}]},
      { "name": "Follow", "description": "Starts following a user.", "deprecated": "false", "params": [{ "name": "user", "type": "text"}]},
      { "name": "Login", "description": "Twitter's API no longer supports login via username and password. Use the Authorize call instead.", "deprecated": "false", "params": [{ "name": "username", "type": "text"},{ "name": "password", "type": "text"}]},
      { "name": "RequestDirectMessages", "description": "Requests the 20 most recent direct messages sent to the logged-in user.  When the messages have been retrieved, the system will raise the <code>DirectMessagesReceived<\/code> event and set the <code>DirectMessages<\/code> property to the list of messages.<p><u>Requirements<\/u>: This should only be called after the <code>IsAuthorized<\/code> event has been raised, indicating that the user has successfully logged in to Twitter.<\/p>", "deprecated": "false", "params": []},
      { "name": "RequestFollowers", "description": "Gets who is following you.", "deprecated": "false", "params": []},
      { "name": "RequestFriendTimeline", "description": "Gets the most recent 20 messages in the user's timeline.", "deprecated": "false", "params": []},
      { "name": "RequestMentions", "description": "Requests the 20 most recent mentions of the logged-in user.  When the mentions have been retrieved, the system will raise the <code>MentionsReceived<\/code> event and set the <code>Mentions<\/code> property to the list of mentions.<p><u>Requirements<\/u>: This should only be called after the <code>IsAuthorized<\/code> event has been raised, indicating that the user has successfully logged in to Twitter.<\/p>", "deprecated": "false", "params": []},
      { "name": "SearchTwitter", "description": "This searches Twitter for the given String query.<p><u>Requirements<\/u>: This should only be called after the <code>IsAuthorized<\/code> event has been raised, indicating that the user has successfully logged in to Twitter.<\/p>", "deprecated": "false", "params": [{ "name": "query", "type": "text"}]},
      { "name": "StopFollowing", "description": "Stops following a user.", "deprecated": "false", "params": [{ "name": "user", "type": "text"}]},
      { "name": "Tweet", "description": "This sends a tweet as the logged-in user with the specified Text, which will be trimmed if it exceeds 160 characters. <p><u>Requirements<\/u>: This should only be called after the <code>IsAuthorized<\/code> event has been raised, indicating that the user has successfully logged in to Twitter.<\/p>", "deprecated": "false", "params": [{ "name": "status", "type": "text"}]},
      { "name": "TweetWithImage", "description": "This sends a tweet as the logged-in user with the specified Text and a path to the image to be uploaded, which will be trimmed if it exceeds 160 characters. If an image is not found or invalid, only the text will be tweeted.<p><u>Requirements<\/u>: This should only be called after the <code>IsAuthorized<\/code> event has been raised, indicating that the user has successfully logged in to Twitter.<\/p>", "deprecated": "false", "params": [{ "name": "status", "type": "text"},{ "name": "imagePath", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.VerticalArrangement",
    "name": "VerticalArrangement",
    "external": "false",
    "version": "3",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LAYOUT",
    "helpString": "<p>A formatting element in which to place components that should be displayed one below another.  (The first child component is stored on top, the second beneath it, etc.)  If you wish to have components displayed next to one another, use <code>HorizontalArrangement<\/code> instead.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "AlignHorizontal", "editorType": "horizontal_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "AlignVertical", "editorType": "vertical_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "AlignHorizontal", "description": "A number that encodes how contents of the arrangement are aligned  horizontally. The choices are: 1 = left aligned, 2 = right aligned,  3 = horizontally centered.  Alignment has no effect if the arrangement's width is automatic.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "AlignVertical", "description": "A number that encodes how the contents of the arrangement are aligned  vertically. The choices are: 1 = aligned at the top, 2 = vertically centered, 3 = aligned at the bottom.  Alignment has no effect if the arrangement's height is automatic.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "BackgroundColor", "description": "Returns the component's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Specifies the path of the component's image.  If there is both an Image and a BackgroundColor, only the Image will be visible.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.VerticalScrollArrangement",
    "name": "VerticalScrollArrangement",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "LAYOUT",
    "helpString": "<p>A formatting element in which to place components that should be displayed one below another.  (The first child component is stored on top, the second beneath it, etc.)  If you wish to have components displayed next to one another, use <code>HorizontalArrangement<\/code> instead.<\/p><p> This version is scrollable",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "AlignHorizontal", "editorType": "horizontal_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "AlignVertical", "editorType": "vertical_alignment", "defaultValue": "1", "editorArgs": []},
      { "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000", "editorArgs": []},
      { "name": "Image", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "AlignHorizontal", "description": "A number that encodes how contents of the arrangement are aligned  horizontally. The choices are: 1 = left aligned, 2 = right aligned,  3 = horizontally centered.  Alignment has no effect if the arrangement's width is automatic.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "AlignVertical", "description": "A number that encodes how the contents of the arrangement are aligned  vertically. The choices are: 1 = aligned at the top, 2 = vertically centered, 3 = aligned at the bottom.  Alignment has no effect if the arrangement's height is automatic.", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "BackgroundColor", "description": "Returns the component's background color", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Image", "description": "Specifies the path of the component's image.  If there is both an Image and a BackgroundColor, only the Image will be visible.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [],
    "methods": []}
,
  { "type": "com.google.appinventor.components.runtime.VideoPlayer",
    "name": "VideoPlayer",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "A multimedia component capable of playing videos. When the application is run, the VideoPlayer will be displayed as a rectangle on-screen.  If the user touches the rectangle, controls will appear to play\/pause, skip ahead, and skip backward within the video.  The application can also control behavior by calling the <code>Start<\/code>, <code>Pause<\/code>, and <code>SeekTo<\/code> methods.  <p>Video files should be in 3GPP (.3gp) or MPEG-4 (.mp4) formats.  For more details about legal formats, see <a href=\"http:\/\/developer.android.com\/guide\/appendix\/media-formats.html\" target=\"_blank\">Android Supported Media Formats<\/a>.<\/p><p>App Inventor for Android only permits video files under 1 MB and limits the total size of an application to 5 MB, not all of which is available for media (video, audio, and sound) files.  If your media files are too large, you may get errors when packaging or installing your application, in which case you should reduce the number of media files or their sizes.  Most video editing software, such as Windows Movie Maker and Apple iMovie, can help you decrease the size of videos by shortening them or re-encoding the video into a more compact format.<\/p><p>You can also set the media source to a URL that points to a streaming video, but the URL must point to the video file itself, not to a program that plays the video.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "Source", "editorType": "asset", "defaultValue": "", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []},
      { "name": "Volume", "editorType": "non_negative_float", "defaultValue": "50", "editorArgs": []}],
    "blockProperties": [{ "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "FullScreen", "description": "", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "Source", "description": "The \"path\" to the video.  Usually, this will be the name of the video file, which should be added in the Designer.", "type": "text", "rw": "write-only", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Volume", "description": "Sets the volume to a number between 0 and 100. Values less than 0 will be treated as 0, and values greater than 100 will be treated as 100.", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "Completed", "description": "Indicates that the video has reached the end", "deprecated": "false", "params": []}
    ,
      { "name": "VideoPlayerError", "description": "The VideoPlayerError event is no longer used. Please use the Screen.ErrorOccurred event instead.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ],
    "methods": [{ "name": "GetDuration", "description": "Returns duration of the video in milliseconds.", "deprecated": "false", "params": [], "returnType": "number"},
      { "name": "Pause", "description": "Pauses playback of the video.  Playback can be resumed at the same location by calling the <code>Start<\/code> method.", "deprecated": "false", "params": []},
      { "name": "SeekTo", "description": "Seeks to the requested time (specified in milliseconds) in the video. If the video is paused, the frame shown will not be updated by the seek. The player can jump only to key frames in the video, so seeking to times that differ by short intervals may not actually move to different frames.", "deprecated": "false", "params": [{ "name": "ms", "type": "number"}]},
      { "name": "Start", "description": "Starts playback of the video.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Voting",
    "name": "Voting",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "INTERNAL",
    "helpString": "<p>The Voting component enables users to vote on a question by communicating with a Web service to retrieve a ballot and later sending back users' votes.<\/p>",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/voting.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "ServiceURL", "editorType": "string", "defaultValue": "http://androvote.appspot.com", "editorArgs": []}],
    "blockProperties": [{ "name": "BallotOptions", "description": "The list of ballot options.", "type": "list", "rw": "read-only", "deprecated": "false"},
      { "name": "BallotQuestion", "description": "The question to be voted on.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "ServiceURL", "description": "The URL of the Voting service", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "UserChoice", "description": "The ballot choice to send to the server, which must be set before <code>SendBallot<\/code> is called.  This must be one of <code>BallotOptions<\/code>.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "UserEmailAddress", "description": "The email address associated with this device. This property has been deprecated and always returns the empty text value.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "UserId", "description": "A text identifying the voter that is sent to the Voting server along with the vote.  This must be set before <code>SendBallot<\/code> is called.", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "GotBallot", "description": "Event indicating that a ballot was retrieved from the Web service and that the properties <code>BallotQuestion<\/code> and <code>BallotOptions<\/code> have been set.  This is always preceded by a call to the method <code>RequestBallot<\/code>.", "deprecated": "false", "params": []}
    ,
      { "name": "GotBallotConfirmation", "description": "Event confirming that the Voting service received the ballot.", "deprecated": "false", "params": []}
    ,
      { "name": "NoOpenPoll", "description": "Event indicating that the service has no open poll.", "deprecated": "false", "params": []}
    ,
      { "name": "WebServiceError", "description": "Event indicating that the communication with the Web service resulted in\n an error.", "deprecated": "false", "params": [{ "name": "message", "type": "text"}]}
    ],
    "methods": [{ "name": "RequestBallot", "description": "Send a request for a ballot to the Web service specified by the property <code>ServiceURL<\/code>.  When the completes, one of the following events will be raised: <code>GotBallot<\/code>, <code>NoOpenPoll<\/code>, or <code>WebServiceError<\/code>.", "deprecated": "false", "params": []},
      { "name": "SendBallot", "description": "Send a completed ballot to the Web service.  This should not be called until the properties <code>UserId<\/code> and <code>UserChoice<\/code> have been set by the application.", "deprecated": "false", "params": []}]}
,
  { "type": "com.google.appinventor.components.runtime.Web",
    "name": "Web",
    "external": "false",
    "version": "5",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "CONNECTIVITY",
    "helpString": "Non-visible component that provides functions for HTTP GET, POST, PUT, and DELETE requests.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/web.png",
    "androidMinSdk": 7,
    "properties": [{ "name": "AllowCookies", "editorType": "boolean", "defaultValue": "false", "editorArgs": []},
      { "name": "ResponseFileName", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "SaveResponse", "editorType": "boolean", "defaultValue": "false", "editorArgs": []},
      { "name": "Url", "editorType": "string", "defaultValue": "", "editorArgs": []}],
    "blockProperties": [{ "name": "AllowCookies", "description": "Whether the cookies from a response should be saved and used in subsequent requests. Cookies are only supported on Android version 2.3 or greater.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "RequestHeaders", "description": "The request headers, as a list of two-element sublists. The first element of each sublist represents the request header field name. The second element of each sublist represents the request header field values, either a single value or a list containing multiple values.", "type": "list", "rw": "read-write", "deprecated": "false"},
      { "name": "ResponseFileName", "description": "The name of the file where the response should be saved. If SaveResponse is true and ResponseFileName is empty, then a new file name will be generated.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "SaveResponse", "description": "Whether the response should be saved in a file.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Url", "description": "The URL for the web request.", "type": "text", "rw": "read-write", "deprecated": "false"}],
    "events": [{ "name": "GotFile", "description": "Event indicating that a request has finished.", "deprecated": "false", "params": [{ "name": "url", "type": "text"},{ "name": "responseCode", "type": "number"},{ "name": "responseType", "type": "text"},{ "name": "fileName", "type": "text"}]}
    ,
      { "name": "GotText", "description": "Event indicating that a request has finished.", "deprecated": "false", "params": [{ "name": "url", "type": "text"},{ "name": "responseCode", "type": "number"},{ "name": "responseType", "type": "text"},{ "name": "responseContent", "type": "text"}]}
    ],
    "methods": [{ "name": "BuildRequestData", "description": "Converts a list of two-element sublists, representing name and value pairs, to a\n string formatted as application\/x-www-form-urlencoded media type, suitable to pass to\n PostText.", "deprecated": "false", "params": [{ "name": "list", "type": "list"}], "returnType": "text"},
      { "name": "ClearCookies", "description": "Clears all cookies for this Web component.", "deprecated": "false", "params": []},
      { "name": "Delete", "description": "Performs an HTTP DELETE request using the Url property and retrieves the\n response.<br>\n If the SaveResponse property is true, the response will be saved in a file\n and the GotFile event will be triggered. The ResponseFileName property\n can be used to specify the name of the file.<br>\n If the SaveResponse property is false, the GotText event will be\n triggered.", "deprecated": "false", "params": []},
      { "name": "Get", "description": "Performs an HTTP GET request using the Url property and retrieves the\n response.<br>\n If the SaveResponse property is true, the response will be saved in a file\n and the GotFile event will be triggered. The ResponseFileName property\n can be used to specify the name of the file.<br>\n If the SaveResponse property is false, the GotText event will be\n triggered.", "deprecated": "false", "params": []},
      { "name": "HtmlTextDecode", "description": "Decodes the given HTML text value. HTML character entities such as &amp;amp;, &amp;lt;, &amp;gt;, &amp;apos;, and &amp;quot; are changed to &amp;, &lt;, &gt;, &#39;, and &quot;. Entities such as &amp;#xhhhh, and &amp;#nnnn are changed to the appropriate characters.", "deprecated": "false", "params": [{ "name": "htmlText", "type": "text"}], "returnType": "text"},
      { "name": "JsonTextDecode", "description": "Decodes the given JSON encoded value to produce a corresponding AppInventor value.\n A JSON list [x, y, z] decodes to a list (x y z),  A JSON object with name A and value B,\n (denoted as A:B enclosed in curly braces) decodes to a list\n ((A B)), that is, a list containing the two-element list (A B).", "deprecated": "false", "params": [{ "name": "jsonText", "type": "text"}], "returnType": "any"},
      { "name": "PostFile", "description": "Performs an HTTP POST request using the Url property and data from the specified file.<br>If the SaveResponse property is true, the response will be saved in a file and the GotFile event will be triggered. The ResponseFileName property can be used to specify the name of the file.<br>If the SaveResponse property is false, the GotText event will be triggered.", "deprecated": "false", "params": [{ "name": "path", "type": "text"}]},
      { "name": "PostText", "description": "Performs an HTTP POST request using the Url property and the specified text.<br>The characters of the text are encoded using UTF-8 encoding.<br>If the SaveResponse property is true, the response will be saved in a file and the GotFile event will be triggered. The responseFileName property can be used to specify the name of the file.<br>If the SaveResponse property is false, the GotText event will be triggered.", "deprecated": "false", "params": [{ "name": "text", "type": "text"}]},
      { "name": "PostTextWithEncoding", "description": "Performs an HTTP POST request using the Url property and the specified text.<br>The characters of the text are encoded using the given encoding.<br>If the SaveResponse property is true, the response will be saved in a file and the GotFile event will be triggered. The ResponseFileName property can be used to specify the name of the file.<br>If the SaveResponse property is false, the GotText event will be triggered.", "deprecated": "false", "params": [{ "name": "text", "type": "text"},{ "name": "encoding", "type": "text"}]},
      { "name": "PutFile", "description": "Performs an HTTP PUT request using the Url property and data from the specified file.<br>If the SaveResponse property is true, the response will be saved in a file and the GotFile event will be triggered. The ResponseFileName property can be used to specify the name of the file.<br>If the SaveResponse property is false, the GotText event will be triggered.", "deprecated": "false", "params": [{ "name": "path", "type": "text"}]},
      { "name": "PutText", "description": "Performs an HTTP PUT request using the Url property and the specified text.<br>The characters of the text are encoded using UTF-8 encoding.<br>If the SaveResponse property is true, the response will be saved in a file and the GotFile event will be triggered. The responseFileName property can be used to specify the name of the file.<br>If the SaveResponse property is false, the GotText event will be triggered.", "deprecated": "false", "params": [{ "name": "text", "type": "text"}]},
      { "name": "PutTextWithEncoding", "description": "Performs an HTTP PUT request using the Url property and the specified text.<br>The characters of the text are encoded using the given encoding.<br>If the SaveResponse property is true, the response will be saved in a file and the GotFile event will be triggered. The ResponseFileName property can be used to specify the name of the file.<br>If the SaveResponse property is false, the GotText event will be triggered.", "deprecated": "false", "params": [{ "name": "text", "type": "text"},{ "name": "encoding", "type": "text"}]},
      { "name": "UriDecode", "description": "Decodes the encoded text value.", "deprecated": "false", "params": [{ "name": "text", "type": "text"}], "returnType": "text"},
      { "name": "UriEncode", "description": "Encodes the given text value so that it can be used in a URL.", "deprecated": "false", "params": [{ "name": "text", "type": "text"}], "returnType": "text"},
      { "name": "XMLTextDecode", "description": "Decodes the given XML string to produce a list structure.  See the App Inventor documentation on \"Other topics, notes, and details\" for information.", "deprecated": "false", "params": [{ "name": "XmlText", "type": "text"}], "returnType": "any"}]}
,
  { "type": "com.google.appinventor.components.runtime.WebViewer",
    "name": "WebViewer",
    "external": "false",
    "version": "7",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "USERINTERFACE",
    "helpString": "Component for viewing Web pages.  The Home URL can be specified in the Designer or in the Blocks Editor.  The view can be set to follow links when they are tapped, and users can fill in Web forms. Warning: This is not a full browser.  For example, pressing the phone's hardware Back key will exit the app, rather than move back in the browser history.<p \/>You can use the WebViewer.WebViewString property to communicate between your app and Javascript code running in the Webviewer page. In the app, you get and set WebViewString.  In the WebViewer, you include Javascript that references the window.AppInventor object, using the methoods <\/em getWebViewString()<\/em> and <em>setWebViewString(text)<\/em>.  <p \/>For example, if the WebViewer opens to a page that contains the Javascript command <br \/> <em>document.write(\"The answer is\" + window.AppInventor.getWebViewString());<\/em> <br \/>and if you set WebView.WebVewString to \"hello\", then the web page will show <\/br ><em>The answer is hello<\/em>.  <br \/>And if the Web page contains Javascript that executes the command <br \/><em>window.AppInventor.setWebViewString(\"hello from Javascript\")<\/em>, <br \/>then the value of the WebViewString property will be <br \/><em>hello from Javascript<\/em>. ",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "false",
    "iconName": "",
    "androidMinSdk": 7,
    "properties": [{ "name": "FollowLinks", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "HomeUrl", "editorType": "string", "defaultValue": "", "editorArgs": []},
      { "name": "IgnoreSslErrors", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "PromptforPermission", "editorType": "boolean", "defaultValue": "True", "editorArgs": []},
      { "name": "UsesLocation", "editorType": "boolean", "defaultValue": "False", "editorArgs": []},
      { "name": "Visible", "editorType": "visibility", "defaultValue": "True", "editorArgs": []}],
    "blockProperties": [{ "name": "Column", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "CurrentPageTitle", "description": "Title of the page currently viewed", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "CurrentUrl", "description": "URL of the page currently viewed.   This could be different from the Home URL if new pages were visited by following links.", "type": "text", "rw": "read-only", "deprecated": "false"},
      { "name": "FollowLinks", "description": "Determines whether to follow links when they are tapped in the WebViewer.  If you follow links, you can use GoBack and GoForward to navigate the browser history. ", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Height", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "HeightPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"},
      { "name": "HomeUrl", "description": "URL of the page the WebViewer should initially open to.  Setting this will load the page.", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "IgnoreSslErrors", "description": "Determine whether or not to ignore SSL errors. Set to true to ignore errors. Use this to accept self signed certificates from websites.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "PromptforPermission", "description": "If True, then prompt the user of the WebView to give permission to access the geolocation API. If False, then assume permission is granted.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "Row", "description": "", "type": "number", "rw": "invisible", "deprecated": "false"},
      { "name": "UsesLocation", "description": "Whether or not to give the application permission to use the Javascript geolocation API. This property is available only in the designer.", "type": "boolean", "rw": "invisible", "deprecated": "false"},
      { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write", "deprecated": "false"},
      { "name": "WebViewString", "description": "Gets the WebView's String, which is viewable through Javascript in the WebView as the window.AppInventor object", "type": "text", "rw": "read-write", "deprecated": "false"},
      { "name": "Width", "description": "", "type": "number", "rw": "read-write", "deprecated": "false"},
      { "name": "WidthPercent", "description": "", "type": "number", "rw": "write-only", "deprecated": "false"}],
    "events": [{ "name": "WebViewStringChange", "description": "When the JavaScript calls AppInventor.setWebViewString this event is run.", "deprecated": "false", "params": [{ "name": "value", "type": "text"}]}
    ],
    "methods": [{ "name": "CanGoBack", "description": "Returns true if the WebViewer can go back in the history list.", "deprecated": "false", "params": [], "returnType": "boolean"},
      { "name": "CanGoForward", "description": "Returns true if the WebViewer can go forward in the history list.", "deprecated": "false", "params": [], "returnType": "boolean"},
      { "name": "ClearCaches", "description": "Clear WebView caches.", "deprecated": "false", "params": []},
      { "name": "ClearLocations", "description": "Clear stored location permissions.", "deprecated": "false", "params": []},
      { "name": "GoBack", "description": "Go back to the previous page in the history list.  Does nothing if there is no previous page.", "deprecated": "false", "params": []},
      { "name": "GoForward", "description": "Go forward to the next page in the history list.   Does nothing if there is no next page.", "deprecated": "false", "params": []},
      { "name": "GoHome", "description": "Loads the home URL page.  This happens automatically when the home URL is changed.", "deprecated": "false", "params": []},
      { "name": "GoToUrl", "description": "Load the page at the given URL.", "deprecated": "false", "params": [{ "name": "url", "type": "text"}]}]}
,
  { "type": "com.google.appinventor.components.runtime.YandexTranslate",
    "name": "YandexTranslate",
    "external": "false",
    "version": "1",
    "dateBuilt": "2019-01-14T15:58:23+0800",
    "categoryString": "MEDIA",
    "helpString": "Use this component to translate words and sentences between different languages. This component needs Internet access, as it will request translations to the Yandex.Translate service. Specify the source and target language in the form source-target using two letter language codes. So\"en-es\" will translate from English to Spanish while \"es-ru\" will translate from Spanish to Russian. If you leave out the source language, the service will attempt to detect the source language. So providing just \"es\" will attempt to detect the source language and translate it to Spanish.<p \/> This component is powered by the Yandex translation service.  See http:\/\/api.yandex.com\/translate\/ for more information, including the list of available languages and the meanings of the language codes and status codes. <p \/>Note: Translation happens asynchronously in the background. When the translation is complete, the \"GotTranslation\" event is triggered.",
    "helpUrl": "",
    "showOnPalette": "true",
    "nonVisible": "true",
    "iconName": "images/yandex.png",
    "androidMinSdk": 7,
    "properties": [],
    "blockProperties": [],
    "events": [{ "name": "GotTranslation", "description": "Event triggered when the Yandex.Translate service returns the translated text. This event also provides a response code for error handling. If the responseCode is not 200, then something went wrong with the call, and the translation will not be available.", "deprecated": "false", "params": [{ "name": "responseCode", "type": "text"},{ "name": "translation", "type": "text"}]}
    ],
    "methods": [{ "name": "RequestTranslation", "description": "By providing a target language to translate to (for instance, 'es' for Spanish, 'en' for English, or 'ru' for Russian), and a word or sentence to translate, this method will request a translation to the Yandex.Translate service.\nOnce the text is translated by the external service, the event GotTranslation will be executed.\nNote: Yandex.Translate will attempt to detect the source language. You can also specify prepending it to the language translation. I.e., es-ru will specify Spanish to Russian translation.", "deprecated": "false", "params": [{ "name": "languageToTranslateTo", "type": "text"},{ "name": "textToTranslate", "type": "text"}]}]}
]
;

var index$1 = {
  acceptTOS: acceptTOS,
  importComponentToProject: importComponentToProject,
  ChecksumedLoadFile: ChecksumedLoadFile,
  componentTypeJson: componentTypeJson,
  encode64: encode64,
  FileDescriptorWithContent: FileDescriptorWithContent,
  login: login,
  loginOAuth: loginOAuth,
  logout: logout,
  NewProjectParameters: NewProjectParameters,
  RPC: RPC,
  RpcResult: RpcResult,
  uploadFile: uploadFile,
  uploadComponent: uploadComponent,
  uploadProject: uploadProject,
  uploadUserFile: uploadUserFile,
  getDownloadAssetsUrl: getDownloadAssetsUrl,
  getDownloadExtensionsUrl: getDownloadExtensionsUrl,
  downloadFile: downloadFile,
  downloadKeystore: downloadKeystore,
  downloadProjectOutput: downloadProjectOutput,
  downloadProject: downloadProject,
  getProjectInfos: getProjectInfos,
  retrieveTemplateData: retrieveTemplateData,
  loadProjectSettings: loadProjectSettings,
  storeProjectSettings: storeProjectSettings,
  getProject: getProject,
  load2: load2,
  loadraw2: loadraw2,
  deleteFile: deleteFile,
  deleteFolder: deleteFolder,
  save2: save2,
  deleteProject: deleteProject,
  addFile: addFile,
  newProject: newProject,
  copyProject: copyProject,
  save: save,
  build: build,
  getBuildResult: getBuildResult,
  newProjectFromTemplate: newProjectFromTemplate,
  UserProject: UserProject,
  UserInfo: UserInfo,
  YoungAndroidAssetNode: YoungAndroidAssetNode,
  YoungAndroidBlocksNode: YoungAndroidBlocksNode,
  YoungAndroidComponentNode: YoungAndroidComponentNode,
  YoungAndroidFormNode: YoungAndroidFormNode
};
module.exports = exports["default"];

module.exports = index$1;
//# sourceMappingURL=appinventor-adapter.cjs.js.map
