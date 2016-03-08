(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! VelocityJS.org (1.2.3). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/*************************
   Velocity jQuery Shim
*************************/

/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/* This file contains the jQuery functions that Velocity relies on, thereby removing Velocity's dependency on a full copy of jQuery, and allowing it to work in any environment. */
/* These shimmed functions are only used if jQuery isn't present. If both this shim and jQuery are loaded, Velocity defaults to jQuery proper. */
/* Browser support: Using this shim instead of jQuery proper removes support for IE8. */

;(function (window) {
    /***************
         Setup
    ***************/

    /* If jQuery is already loaded, there's no point in loading this shim. */
    if (window.jQuery) {
        return;
    }

    /* jQuery base. */
    var $ = function (selector, context) {
        return new $.fn.init(selector, context);
    };

    /********************
       Private Methods
    ********************/

    /* jQuery */
    $.isWindow = function (obj) {
        /* jshint eqeqeq: false */
        return obj != null && obj == obj.window;
    };

    /* jQuery */
    $.type = function (obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    };

    /* jQuery */
    $.isArray = Array.isArray || function (obj) {
        return $.type(obj) === "array";
    };

    /* jQuery */
    function isArraylike (obj) {
        var length = obj.length,
            type = $.type(obj);

        if (type === "function" || $.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    /***************
       $ Methods
    ***************/

    /* jQuery: Support removed for IE<9. */
    $.isPlainObject = function (obj) {
        var key;

        if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    };

    /* jQuery */
    $.each = function(obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    /* Custom */
    $.data = function (node, key, value) {
        /* $.getData() */
        if (value === undefined) {
            var id = node[$.expando],
                store = id && cache[id];

            if (key === undefined) {
                return store;
            } else if (store) {
                if (key in store) {
                    return store[key];
                }
            }
        /* $.setData() */
        } else if (key !== undefined) {
            var id = node[$.expando] || (node[$.expando] = ++$.uuid);

            cache[id] = cache[id] || {};
            cache[id][key] = value;

            return value;
        }
    };

    /* Custom */
    $.removeData = function (node, keys) {
        var id = node[$.expando],
            store = id && cache[id];

        if (store) {
            $.each(keys, function(_, key) {
                delete store[key];
            });
        }
    };

    /* jQuery */
    $.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && $.type(target) !== "function") {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    /* jQuery 1.4.3 */
    $.queue = function (elem, type, data) {
        function $makeArray (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    /* $.merge */
                    (function(first, second) {
                        var len = +second.length,
                            j = 0,
                            i = first.length;

                        while (j < len) {
                            first[i++] = second[j++];
                        }

                        if (len !== len) {
                            while (second[j] !== undefined) {
                                first[i++] = second[j++];
                            }
                        }

                        first.length = i;

                        return first;
                    })(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    [].push.call(ret, arr);
                }
            }

            return ret;
        }

        if (!elem) {
            return;
        }

        type = (type || "fx") + "queue";

        var q = $.data(elem, type);

        if (!data) {
            return q || [];
        }

        if (!q || $.isArray(data)) {
            q = $.data(elem, type, $makeArray(data));
        } else {
            q.push(data);
        }

        return q;
    };

    /* jQuery 1.4.3 */
    $.dequeue = function (elems, type) {
        /* Custom: Embed element iteration. */
        $.each(elems.nodeType ? [ elems ] : elems, function(i, elem) {
            type = type || "fx";

            var queue = $.queue(elem, type),
                fn = queue.shift();

            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function() {
                    $.dequeue(elem, type);
                });
            }
        });
    };

    /******************
       $.fn Methods
    ******************/

    /* jQuery */
    $.fn = $.prototype = {
        init: function (selector) {
            /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
            if (selector.nodeType) {
                this[0] = selector;

                return this;
            } else {
                throw new Error("Not a DOM node.");
            }
        },

        offset: function () {
            /* jQuery altered code: Dropped disconnected DOM node checking. */
            var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : { top: 0, left: 0 };

            return {
                top: box.top + (window.pageYOffset || document.scrollTop  || 0)  - (document.clientTop  || 0),
                left: box.left + (window.pageXOffset || document.scrollLeft  || 0) - (document.clientLeft || 0)
            };
        },

        position: function () {
            /* jQuery */
            function offsetParent() {
                var offsetParent = this.offsetParent || document;

                while (offsetParent && (!offsetParent.nodeType.toLowerCase === "html" && offsetParent.style.position === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || document;
            }

            /* Zepto */
            var elem = this[0],
                offsetParent = offsetParent.apply(elem),
                offset = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0 } : $(offsetParent).offset()

            offset.top -= parseFloat(elem.style.marginTop) || 0;
            offset.left -= parseFloat(elem.style.marginLeft) || 0;

            if (offsetParent.style) {
                parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0
                parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0
            }

            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
    };

    /**********************
       Private Variables
    **********************/

    /* For $.data() */
    var cache = {};
    $.expando = "velocity" + (new Date().getTime());
    $.uuid = 0;

    /* For $.queue() */
    var class2type = {},
        hasOwn = class2type.hasOwnProperty,
        toString = class2type.toString;

    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }

    /* Makes $(node) possible, without having to call init. */
    $.fn.init.prototype = $.fn;

    /* Globalize Velocity onto the window, and assign its Utilities property. */
    window.Velocity = { Utilities: $ };
})(window);

/******************
    Velocity.js
******************/

;(function (factory) {
    /* CommonJS module. */
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    /* Browser globals. */
    } else {
        factory();
    }
}(function() {
return function (global, window, document, undefined) {

    /***************
        Summary
    ***************/

    /*
    - CSS: CSS stack that works independently from the rest of Velocity.
    - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
      - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
      - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
                  Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
      - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
    - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
    - completeCall(): Handles the cleanup process for each Velocity call.
    */

    /*********************
       Helper Functions
    *********************/

    /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
    var IE = (function() {
        if (document.documentMode) {
            return document.documentMode;
        } else {
            for (var i = 7; i > 4; i--) {
                var div = document.createElement("div");

                div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                if (div.getElementsByTagName("span").length) {
                    div = null;

                    return i;
                }
            }
        }

        return undefined;
    })();

    /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
    var rAFShim = (function() {
        var timeLast = 0;

        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            var timeCurrent = (new Date()).getTime(),
                timeDelta;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
            timeLast = timeCurrent + timeDelta;

            return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
        };
    })();

    /* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray (array) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];

        while (++index < length) {
            var value = array[index];

            if (value) {
                result.push(value);
            }
        }

        return result;
    }

    function sanitizeElements (elements) {
        /* Unwrap jQuery/Zepto objects. */
        if (Type.isWrapped(elements)) {
            elements = [].slice.call(elements);
        /* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
        } else if (Type.isNode(elements)) {
            elements = [ elements ];
        }

        return elements;
    }

    var Type = {
        isString: function (variable) {
            return (typeof variable === "string");
        },
        isArray: Array.isArray || function (variable) {
            return Object.prototype.toString.call(variable) === "[object Array]";
        },
        isFunction: function (variable) {
            return Object.prototype.toString.call(variable) === "[object Function]";
        },
        isNode: function (variable) {
            return variable && variable.nodeType;
        },
        /* Copyright Martin Bohm. MIT License: https://gist.github.com/Tomalak/818a78a226a0738eaade */
        isNodeList: function (variable) {
            return typeof variable === "object" &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(variable)) &&
                variable.length !== undefined &&
                (variable.length === 0 || (typeof variable[0] === "object" && variable[0].nodeType > 0));
        },
        /* Determine if variable is a wrapped jQuery or Zepto element. */
        isWrapped: function (variable) {
            return variable && (variable.jquery || (window.Zepto && window.Zepto.zepto.isZ(variable)));
        },
        isSVG: function (variable) {
            return window.SVGElement && (variable instanceof window.SVGElement);
        },
        isEmptyObject: function (variable) {
            for (var name in variable) {
                return false;
            }

            return true;
        }
    };

    /*****************
       Dependencies
    *****************/

    var $,
        isJQuery = false;

    if (global.fn && global.fn.jquery) {
        $ = global;
        isJQuery = true;
    } else {
        $ = window.Velocity.Utilities;
    }

    if (IE <= 8 && !isJQuery) {
        throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
    } else if (IE <= 7) {
        /* Revert to jQuery's $.animate(), and lose Velocity's extra features. */
        jQuery.fn.velocity = jQuery.fn.animate;

        /* Now that $.fn.velocity is aliased, abort this Velocity declaration. */
        return;
    }

    /*****************
        Constants
    *****************/

    var DURATION_DEFAULT = 400,
        EASING_DEFAULT = "swing";

    /*************
        State
    *************/

    var Velocity = {
        /* Container for page-wide Velocity state data. */
        State: {
            /* Detect mobile devices to determine if mobileHA should be turned on. */
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
            isAndroid: /Android/i.test(navigator.userAgent),
            isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
            isChrome: window.chrome,
            isFirefox: /Firefox/i.test(navigator.userAgent),
            /* Create a cached element for re-use when checking for CSS property prefixes. */
            prefixElement: document.createElement("div"),
            /* Cache every prefix match to avoid repeating lookups. */
            prefixMatches: {},
            /* Cache the anchor used for animating window scrolling. */
            scrollAnchor: null,
            /* Cache the browser-specific property names associated with the scroll anchor. */
            scrollPropertyLeft: null,
            scrollPropertyTop: null,
            /* Keep track of whether our RAF tick is running. */
            isTicking: false,
            /* Container for every in-progress call to Velocity. */
            calls: []
        },
        /* Velocity's custom CSS stack. Made global for unit testing. */
        CSS: { /* Defined below. */ },
        /* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
        Utilities: $,
        /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
        Redirects: { /* Manually registered by the user. */ },
        Easings: { /* Defined below. */ },
        /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
        Promise: window.Promise,
        /* Velocity option defaults, which can be overriden by the user. */
        defaults: {
            queue: "",
            duration: DURATION_DEFAULT,
            easing: EASING_DEFAULT,
            begin: undefined,
            complete: undefined,
            progress: undefined,
            display: undefined,
            visibility: undefined,
            loop: false,
            delay: false,
            mobileHA: true,
            /* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
            _cacheValues: true
        },
        /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
        init: function (element) {
            $.data(element, "velocity", {
                /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
                isSVG: Type.isSVG(element),
                /* Keep track of whether the element is currently being animated by Velocity.
                   This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
                isAnimating: false,
                /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                computedStyle: null,
                /* Tween data is cached for each animation on the element so that data can be passed across calls --
                   in particular, end values are used as subsequent start values in consecutive Velocity calls. */
                tweensContainer: null,
                /* The full root property values of each CSS hook being animated on this element are cached so that:
                   1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
                   2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
                rootPropertyValueCache: {},
                /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
                transformCache: {}
            });
        },
        /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
        hook: null, /* Defined below. */
        /* Velocity-wide animation time remapping for testing purposes. */
        mock: false,
        version: { major: 1, minor: 2, patch: 2 },
        /* Set to 1 or 2 (most verbose) to output debug info to console. */
        debug: false
    };

    /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
    if (window.pageYOffset !== undefined) {
        Velocity.State.scrollAnchor = window;
        Velocity.State.scrollPropertyLeft = "pageXOffset";
        Velocity.State.scrollPropertyTop = "pageYOffset";
    } else {
        Velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
        Velocity.State.scrollPropertyLeft = "scrollLeft";
        Velocity.State.scrollPropertyTop = "scrollTop";
    }

    /* Shorthand alias for jQuery's $.data() utility. */
    function Data (element) {
        /* Hardcode a reference to the plugin name. */
        var response = $.data(element, "velocity");

        /* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
        return response === null ? undefined : response;
    };

    /**************
        Easing
    **************/

    /* Step easing generator. */
    function generateStep (steps) {
        return function (p) {
            return Math.round(p * steps) * (1 / steps);
        };
    }

    /* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    function generateBezier (mX1, mY1, mX2, mY2) {
        var NEWTON_ITERATIONS = 4,
            NEWTON_MIN_SLOPE = 0.001,
            SUBDIVISION_PRECISION = 0.0000001,
            SUBDIVISION_MAX_ITERATIONS = 10,
            kSplineTableSize = 11,
            kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
            float32ArraySupported = "Float32Array" in window;

        /* Must contain four arguments. */
        if (arguments.length !== 4) {
            return false;
        }

        /* Arguments must be numbers. */
        for (var i = 0; i < 4; ++i) {
            if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                return false;
            }
        }

        /* X values must be in the [0, 1] range. */
        mX1 = Math.min(mX1, 1);
        mX2 = Math.min(mX2, 1);
        mX1 = Math.max(mX1, 0);
        mX2 = Math.max(mX2, 0);

        var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

        function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C (aA1)      { return 3.0 * aA1; }

        function calcBezier (aT, aA1, aA2) {
            return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
        }

        function getSlope (aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function newtonRaphsonIterate (aX, aGuessT) {
            for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                var currentSlope = getSlope(aGuessT, mX1, mX2);

                if (currentSlope === 0.0) return aGuessT;

                var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }

            return aGuessT;
        }

        function calcSampleValues () {
            for (var i = 0; i < kSplineTableSize; ++i) {
                mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }

        function binarySubdivide (aX, aA, aB) {
            var currentX, currentT, i = 0;

            do {
                currentT = aA + (aB - aA) / 2.0;
                currentX = calcBezier(currentT, mX1, mX2) - aX;
                if (currentX > 0.0) {
                  aB = currentT;
                } else {
                  aA = currentT;
                }
            } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

            return currentT;
        }

        function getTForX (aX) {
            var intervalStart = 0.0,
                currentSample = 1,
                lastSample = kSplineTableSize - 1;

            for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }

            --currentSample;

            var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]),
                guessForT = intervalStart + dist * kSampleStepSize,
                initialSlope = getSlope(guessForT, mX1, mX2);

            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT);
            } else if (initialSlope == 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
            }
        }

        var _precomputed = false;

        function precompute() {
            _precomputed = true;
            if (mX1 != mY1 || mX2 != mY2) calcSampleValues();
        }

        var f = function (aX) {
            if (!_precomputed) precompute();
            if (mX1 === mY1 && mX2 === mY2) return aX;
            if (aX === 0) return 0;
            if (aX === 1) return 1;

            return calcBezier(getTForX(aX), mY1, mY2);
        };

        f.getControlPoints = function() { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };

        var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
        f.toString = function () { return str; };

        return f;
    }

    /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
       then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
    var generateSpringRK4 = (function () {
        function springAccelerationForState (state) {
            return (-state.tension * state.x) - (state.friction * state.v);
        }

        function springEvaluateStateWithDerivative (initialState, dt, derivative) {
            var state = {
                x: initialState.x + derivative.dx * dt,
                v: initialState.v + derivative.dv * dt,
                tension: initialState.tension,
                friction: initialState.friction
            };

            return { dx: state.v, dv: springAccelerationForState(state) };
        }

        function springIntegrateState (state, dt) {
            var a = {
                    dx: state.v,
                    dv: springAccelerationForState(state)
                },
                b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
                c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
                d = springEvaluateStateWithDerivative(state, dt, c),
                dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
                dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

            state.x = state.x + dxdt * dt;
            state.v = state.v + dvdt * dt;

            return state;
        }

        return function springRK4Factory (tension, friction, duration) {

            var initState = {
                    x: -1,
                    v: 0,
                    tension: null,
                    friction: null
                },
                path = [0],
                time_lapsed = 0,
                tolerance = 1 / 10000,
                DT = 16 / 1000,
                have_duration, dt, last_state;

            tension = parseFloat(tension) || 500;
            friction = parseFloat(friction) || 20;
            duration = duration || null;

            initState.tension = tension;
            initState.friction = friction;

            have_duration = duration !== null;

            /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
            if (have_duration) {
                /* Run the simulation without a duration. */
                time_lapsed = springRK4Factory(tension, friction);
                /* Compute the adjusted time delta. */
                dt = time_lapsed / duration * DT;
            } else {
                dt = DT;
            }

            while (true) {
                /* Next/step function .*/
                last_state = springIntegrateState(last_state || initState, dt);
                /* Store the position. */
                path.push(1 + last_state.x);
                time_lapsed += 16;
                /* If the change threshold is reached, break. */
                if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                    break;
                }
            }

            /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
               computed path and returns a snapshot of the position according to a given percentComplete. */
            return !have_duration ? time_lapsed : function(percentComplete) { return path[ (percentComplete * (path.length - 1)) | 0 ]; };
        };
    }());

    /* jQuery easings. */
    Velocity.Easings = {
        linear: function(p) { return p; },
        swing: function(p) { return 0.5 - Math.cos( p * Math.PI ) / 2 },
        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
        spring: function(p) { return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6)); }
    };

    /* CSS3 and Robert Penner easings. */
    $.each(
        [
            [ "ease", [ 0.25, 0.1, 0.25, 1.0 ] ],
            [ "ease-in", [ 0.42, 0.0, 1.00, 1.0 ] ],
            [ "ease-out", [ 0.00, 0.0, 0.58, 1.0 ] ],
            [ "ease-in-out", [ 0.42, 0.0, 0.58, 1.0 ] ],
            [ "easeInSine", [ 0.47, 0, 0.745, 0.715 ] ],
            [ "easeOutSine", [ 0.39, 0.575, 0.565, 1 ] ],
            [ "easeInOutSine", [ 0.445, 0.05, 0.55, 0.95 ] ],
            [ "easeInQuad", [ 0.55, 0.085, 0.68, 0.53 ] ],
            [ "easeOutQuad", [ 0.25, 0.46, 0.45, 0.94 ] ],
            [ "easeInOutQuad", [ 0.455, 0.03, 0.515, 0.955 ] ],
            [ "easeInCubic", [ 0.55, 0.055, 0.675, 0.19 ] ],
            [ "easeOutCubic", [ 0.215, 0.61, 0.355, 1 ] ],
            [ "easeInOutCubic", [ 0.645, 0.045, 0.355, 1 ] ],
            [ "easeInQuart", [ 0.895, 0.03, 0.685, 0.22 ] ],
            [ "easeOutQuart", [ 0.165, 0.84, 0.44, 1 ] ],
            [ "easeInOutQuart", [ 0.77, 0, 0.175, 1 ] ],
            [ "easeInQuint", [ 0.755, 0.05, 0.855, 0.06 ] ],
            [ "easeOutQuint", [ 0.23, 1, 0.32, 1 ] ],
            [ "easeInOutQuint", [ 0.86, 0, 0.07, 1 ] ],
            [ "easeInExpo", [ 0.95, 0.05, 0.795, 0.035 ] ],
            [ "easeOutExpo", [ 0.19, 1, 0.22, 1 ] ],
            [ "easeInOutExpo", [ 1, 0, 0, 1 ] ],
            [ "easeInCirc", [ 0.6, 0.04, 0.98, 0.335 ] ],
            [ "easeOutCirc", [ 0.075, 0.82, 0.165, 1 ] ],
            [ "easeInOutCirc", [ 0.785, 0.135, 0.15, 0.86 ] ]
        ], function(i, easingArray) {
            Velocity.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
        });

    /* Determine the appropriate easing type given an easing input. */
    function getEasing(value, duration) {
        var easing = value;

        /* The easing option can either be a string that references a pre-registered easing,
           or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
        if (Type.isString(value)) {
            /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
            if (!Velocity.Easings[value]) {
                easing = false;
            }
        } else if (Type.isArray(value) && value.length === 1) {
            easing = generateStep.apply(null, value);
        } else if (Type.isArray(value) && value.length === 2) {
            /* springRK4 must be passed the animation's duration. */
            /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
               function generated with default tension and friction values. */
            easing = generateSpringRK4.apply(null, value.concat([ duration ]));
        } else if (Type.isArray(value) && value.length === 4) {
            /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
            easing = generateBezier.apply(null, value);
        } else {
            easing = false;
        }

        /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
           if the Velocity-wide default has been incorrectly modified. */
        if (easing === false) {
            if (Velocity.Easings[Velocity.defaults.easing]) {
                easing = Velocity.defaults.easing;
            } else {
                easing = EASING_DEFAULT;
            }
        }

        return easing;
    }

    /*****************
        CSS Stack
    *****************/

    /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
       It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
    /* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
    var CSS = Velocity.CSS = {

        /*************
            RegEx
        *************/

        RegEx: {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
        },

        /************
            Lists
        ************/

        Lists: {
            colors: [ "fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor" ],
            transformsBase: [ "translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ" ],
            transforms3D: [ "transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY" ]
        },

        /************
            Hooks
        ************/

        /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
           (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
        /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
           tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
        Hooks: {
            /********************
                Registration
            ********************/

            /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
            /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
            templates: {
                "textShadow": [ "Color X Y Blur", "black 0px 0px 0px" ],
                "boxShadow": [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                "clip": [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                "backgroundPosition": [ "X Y", "0% 0%" ],
                "transformOrigin": [ "X Y Z", "50% 50% 0px" ],
                "perspectiveOrigin": [ "X Y", "50% 50%" ]
            },

            /* A "registered" hook is one that has been converted from its template form into a live,
               tweenable property. It contains data to associate it with its root property. */
            registered: {
                /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
                   which consists of the subproperty's name, the associated root property's name,
                   and the subproperty's position in the root's value. */
            },
            /* Convert the templates into individual hooks then append them to the registered object above. */
            register: function () {
                /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
                   currently set to "transparent" default to their respective template below when color-animated,
                   and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
                   which is almost always set closer to black than white. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    var rgbComponents = (CSS.Lists.colors[i] === "color") ? "0 0 0 1" : "255 255 255 1";
                    CSS.Hooks.templates[CSS.Lists.colors[i]] = [ "Red Green Blue Alpha", rgbComponents ];
                }

                var rootProperty,
                    hookTemplate,
                    hookNames;

                /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
                   Thus, we re-arrange the templates accordingly. */
                if (IE) {
                    for (rootProperty in CSS.Hooks.templates) {
                        hookTemplate = CSS.Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");

                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

                        if (hookNames[0] === "Color") {
                            /* Reposition both the hook's name and its default value to the end of their respective strings. */
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());

                            /* Replace the existing template for the hook's root property. */
                            CSS.Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                }

                /* Hook registration. */
                for (rootProperty in CSS.Hooks.templates) {
                    hookTemplate = CSS.Hooks.templates[rootProperty];
                    hookNames = hookTemplate[0].split(" ");

                    for (var i in hookNames) {
                        var fullHookName = rootProperty + hookNames[i],
                            hookPosition = i;

                        /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
                           and the hook's position in its template's default value string. */
                        CSS.Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            },

            /*****************************
               Injection and Extraction
            *****************************/

            /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
            /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
            getRoot: function (property) {
                var hookData = CSS.Hooks.registered[property];

                if (hookData) {
                    return hookData[0];
                } else {
                    /* If there was no hook match, return the property name untouched. */
                    return property;
                }
            },
            /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
               the targeted hook can be injected or extracted at its standard position. */
            cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
                /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                    rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                }

                /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
                   default to the root's default value as defined in CSS.Hooks.templates. */
                /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
                   zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                }

                return rootPropertyValue;
            },
            /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
            extractValue: function (fullHookName, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1];

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            },
            /* Inject the hook's value into its root property's value. This is used to piece back together the root property
               once Velocity has updated one of its individually hooked values through tweening. */
            injectValue: function (fullHookName, hookValue, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1],
                        rootPropertyValueParts,
                        rootPropertyValueUpdated;

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                       then reconstruct the rootPropertyValue string. */
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                    return rootPropertyValueUpdated;
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            }
        },

        /*******************
           Normalizations
        *******************/

        /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
           and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
        Normalizations: {
            /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
               the targeted element (which may need to be queried), and the targeted property value. */
            registered: {
                clip: function (type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return "clip";
                        /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                        case "extract":
                            var extracted;

                            /* If Velocity also extracted this value, skip extraction. */
                            if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                extracted = propertyValue;
                            } else {
                                /* Remove the "rect()" wrapper. */
                                extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                                /* Strip off commas. */
                                extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                            }

                            return extracted;
                        /* Clip needs to be re-wrapped during injection. */
                        case "inject":
                            return "rect(" + propertyValue + ")";
                    }
                },

                blur: function(type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return Velocity.State.isFirefox ? "filter" : "-webkit-filter";
                        case "extract":
                            var extracted = parseFloat(propertyValue);

                            /* If extracted is NaN, meaning the value isn't already extracted. */
                            if (!(extracted || extracted === 0)) {
                                var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                                /* If the filter string had a blur component, return just the blur value and unit type. */
                                if (blurComponent) {
                                    extracted = blurComponent[1];
                                /* If the component doesn't exist, default blur to 0. */
                                } else {
                                    extracted = 0;
                                }
                            }

                            return extracted;
                        /* Blur needs to be re-wrapped during injection. */
                        case "inject":
                            /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                            if (!parseFloat(propertyValue)) {
                                return "none";
                            } else {
                                return "blur(" + propertyValue + ")";
                            }
                    }
                },

                /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
                opacity: function (type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                            case "name":
                                return "filter";
                            case "extract":
                                /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
                                   Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                                var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                                if (extracted) {
                                    /* Convert to decimal value. */
                                    propertyValue = extracted[1] / 100;
                                } else {
                                    /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                                    propertyValue = 1;
                                }

                                return propertyValue;
                            case "inject":
                                /* Opacified elements are required to have their zoom property set to a non-zero value. */
                                element.style.zoom = 1;

                                /* Setting the filter property on elements with certain font property combinations can result in a
                                   highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
                                   value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                                if (parseFloat(propertyValue) >= 1) {
                                    return "";
                                } else {
                                  /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                  return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                                }
                        }
                    /* With all other browsers, normalization is not required; return the same values that were passed in. */
                    } else {
                        switch (type) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return propertyValue;
                            case "inject":
                                return propertyValue;
                        }
                    }
                }
            },

            /*****************************
                Batched Registrations
            *****************************/

            /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
            register: function () {

                /*****************
                    Transforms
                *****************/

                /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
                   so that they can be referenced in a properties map by their individual names. */
                /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
                   setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
                   Transform setting is batched in this way to improve performance: the transform style only needs to be updated
                   once when multiple transform subproperties are being animated simultaneously. */
                /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
                   transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
                   from being normalized for these browsers so that tweening skips these properties altogether
                   (since it will ignore them as being unsupported by the browser.) */
                if (!(IE <= 9) && !Velocity.State.isGingerbread) {
                    /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
                    share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
                    CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                }

                for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
                    paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                    (function() {
                        var transformName = CSS.Lists.transformsBase[i];

                        CSS.Normalizations.registered[transformName] = function (type, element, propertyValue) {
                            switch (type) {
                                /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                                case "name":
                                    return "transform";
                                /* Transform values are cached onto a per-element transformCache object. */
                                case "extract":
                                    /* If this transform has yet to be assigned a value, return its null value. */
                                    if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                        /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                                        return /^scale/i.test(transformName) ? 1 : 0;
                                    /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
                                       Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                                    } else {
                                        return Data(element).transformCache[transformName].replace(/[()]/g, "");
                                    }
                                case "inject":
                                    var invalid = false;

                                    /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
                                       Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                                    /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                                    switch (transformName.substr(0, transformName.length - 1)) {
                                        /* Whitelist unit types for each transform. */
                                        case "translate":
                                            invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                                            break;
                                        /* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                                        case "scal":
                                        case "scale":
                                            /* Chrome on Android has a bug in which scaled elements blur if their initial scale
                                               value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
                                               and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
                                            if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
                                                propertyValue = 1;
                                            }

                                            invalid = !/(\d)$/i.test(propertyValue);
                                            break;
                                        case "skew":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                        case "rotate":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                    }

                                    if (!invalid) {
                                        /* As per the CSS spec, wrap the value in parentheses. */
                                        Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                                    }

                                    /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                                    return Data(element).transformCache[transformName];
                            }
                        };
                    })();
                }

                /*************
                    Colors
                *************/

                /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
                   Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
                       (Otherwise, all functions would take the final for loop's colorName.) */
                    (function () {
                        var colorName = CSS.Lists.colors[i];

                        /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
                        CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return colorName;
                                /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                                case "extract":
                                    var extracted;

                                    /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                        extracted = propertyValue;
                                    } else {
                                        var converted,
                                            colorNames = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };

                                        /* Convert color names to rgb. */
                                        if (/^[A-z]+$/i.test(propertyValue)) {
                                            if (colorNames[propertyValue] !== undefined) {
                                                converted = colorNames[propertyValue]
                                            } else {
                                                /* If an unmatched color name is provided, default to black. */
                                                converted = colorNames.black;
                                            }
                                        /* Convert hex values to rgb. */
                                        } else if (CSS.RegEx.isHex.test(propertyValue)) {
                                            converted = "rgb(" + CSS.Values.hexToRgb(propertyValue).join(" ") + ")";
                                        /* If the provided color doesn't match any of the accepted color formats, default to black. */
                                        } else if (!(/^rgba?\(/i.test(propertyValue))) {
                                            converted = colorNames.black;
                                        }

                                        /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
                                           repeated spaces (in case the value included spaces to begin with). */
                                        extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                                    }

                                    /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    if (!(IE <= 8) && extracted.split(" ").length === 3) {
                                        extracted += " 1";
                                    }

                                    return extracted;
                                case "inject":
                                    /* If this is IE<=8 and an alpha component exists, strip it off. */
                                    if (IE <= 8) {
                                        if (propertyValue.split(" ").length === 4) {
                                            propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                                        }
                                    /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    } else if (propertyValue.split(" ").length === 3) {
                                        propertyValue += " 1";
                                    }

                                    /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
                                       on all values but the fourth (R, G, and B only accept whole numbers). */
                                    return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                            }
                        };
                    })();
                }
            }
        },

        /************************
           CSS Property Names
        ************************/

        Names: {
            /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
               Camelcasing is used to normalize property names between and across calls. */
            camelCase: function (property) {
                return property.replace(/-(\w)/g, function (match, subMatch) {
                    return subMatch.toUpperCase();
                });
            },

            /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
            SVGAttribute: function (property) {
                var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

                /* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
                if (IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) {
                    SVGAttributes += "|transform";
                }

                return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
            },

            /* Determine whether a property should be set with a vendor prefix. */
            /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
               If the property is not at all supported by the browser, return a false flag. */
            prefixCheck: function (property) {
                /* If this property has already been checked, return the cached value. */
                if (Velocity.State.prefixMatches[property]) {
                    return [ Velocity.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];

                    for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                        var propertyPrefixed;

                        if (i === 0) {
                            propertyPrefixed = property;
                        } else {
                            /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                            propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) { return match.toUpperCase(); });
                        }

                        /* Check if the browser supports this property as prefixed. */
                        if (Type.isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
                            /* Cache the match. */
                            Velocity.State.prefixMatches[property] = propertyPrefixed;

                            return [ propertyPrefixed, true ];
                        }
                    }

                    /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                    return [ property, false ];
                }
            }
        },

        /************************
           CSS Property Values
        ************************/

        Values: {
            /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
            hexToRgb: function (hex) {
                var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                    longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                    rgbParts;

                hex = hex.replace(shortformRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                rgbParts = longformRegex.exec(hex);

                return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
            },

            isCSSNullValue: function (value) {
                /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
                   Thus, we check for both falsiness and these special strings. */
                /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
                   templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
                /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
            },

            /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
            getUnitType: function (property) {
                if (/^(rotate|skew)/i.test(property)) {
                    return "deg";
                } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                    /* The above properties are unitless. */
                    return "";
                } else {
                    /* Default to px for all other properties. */
                    return "px";
                }
            },

            /* HTML elements default to an associated display type when they're not set to display:none. */
            /* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
            getDisplayType: function (element) {
                var tagName = element && element.tagName.toString().toLowerCase();

                if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
                    return "inline";
                } else if (/^(li)$/i.test(tagName)) {
                    return "list-item";
                } else if (/^(tr)$/i.test(tagName)) {
                    return "table-row";
                } else if (/^(table)$/i.test(tagName)) {
                    return "table";
                } else if (/^(tbody)$/i.test(tagName)) {
                    return "table-row-group";
                /* Default to "block" when no match is found. */
                } else {
                    return "block";
                }
            },

            /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
            addClass: function (element, className) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    element.className += (element.className.length ? " " : "") + className;
                }
            },

            removeClass: function (element, className) {
                if (element.classList) {
                    element.classList.remove(className);
                } else {
                    element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                }
            }
        },

        /****************************
           Style Getting & Setting
        ****************************/

        /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        getPropertyValue: function (element, property, rootPropertyValue, forceStyleLookup) {
            /* Get an element's computed property value. */
            /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
               style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
               *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
            function computePropertyValue (element, property) {
                /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
                   element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
                   offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
                   We subtract border and padding to get the sum of interior + scrollbar. */
                var computedValue = 0;

                /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
                   of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
                   codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
                   Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
                if (IE <= 8) {
                    computedValue = $.css(element, property); /* GET */
                /* All other browsers support getComputedStyle. The returned live object reference is cached onto its
                   associated element so that it does not need to be refetched upon every GET. */
                } else {
                    /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
                       toggle display to the element type's default value. */
                    var toggleDisplay = false;

                    if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
                        toggleDisplay = true;
                        CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
                    }

                    function revertDisplay () {
                        if (toggleDisplay) {
                            CSS.setPropertyValue(element, "display", "none");
                        }
                    }

                    if (!forceStyleLookup) {
                        if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                            revertDisplay();

                            return contentBoxHeight;
                        } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                            revertDisplay();

                            return contentBoxWidth;
                        }
                    }

                    var computedStyle;

                    /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
                       of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                    if (Data(element) === undefined) {
                        computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If the computedStyle object has yet to be cached, do so now. */
                    } else if (!Data(element).computedStyle) {
                        computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If computedStyle is cached, use it. */
                    } else {
                        computedStyle = Data(element).computedStyle;
                    }

                    /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
                       Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
                       So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
                    if (property === "borderColor") {
                        property = "borderTopColor";
                    }

                    /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
                       instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                    if (IE === 9 && property === "filter") {
                        computedValue = computedStyle.getPropertyValue(property); /* GET */
                    } else {
                        computedValue = computedStyle[property];
                    }

                    /* Fall back to the property's style value (if defined) when computedValue returns nothing,
                       which can happen when the element hasn't been painted. */
                    if (computedValue === "" || computedValue === null) {
                        computedValue = element.style[property];
                    }

                    revertDisplay();
                }

                /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
                   defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
                   effect as being set to 0, so no conversion is necessary.) */
                /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
                   property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
                   to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
                if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                    var position = computePropertyValue(element, "position"); /* GET */

                    /* For absolute positioning, jQuery's $.position() only returns values for top and left;
                       right and bottom will have their "auto" value reverted to 0. */
                    /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
                       Not a big deal since we're currently in a GET batch anyway. */
                    if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
                        /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                        computedValue = $(element).position()[property] + "px"; /* GET */
                    }
                }

                return computedValue;
            }

            var propertyValue;

            /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
               extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
            if (CSS.Hooks.registered[property]) {
                var hook = property,
                    hookRoot = CSS.Hooks.getRoot(hook);

                /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
                   query the DOM for the root property's value. */
                if (rootPropertyValue === undefined) {
                    /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                    rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
                }

                /* If this root has a normalization registered, peform the associated normalization extraction. */
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }

                /* Extract the hook's value. */
                propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

            /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
               normalize the property's name and value, and handle the special case of transforms. */
            /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
               numerical and therefore do not require normalization extraction. */
            } else if (CSS.Normalizations.registered[property]) {
                var normalizedPropertyName,
                    normalizedPropertyValue;

                normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

                /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
                   At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                   This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
                   thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                if (normalizedPropertyName !== "transform") {
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                    /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }

                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }

            /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
            if (!/^[\d-]/.test(propertyValue)) {
                /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
                   their HTML attribute values instead of their CSS style values. */
                if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                    /* Since the height/width attribute values must be set manually, they don't reflect computed values.
                       Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
                    if (/^(height|width)$/i.test(property)) {
                        /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
                        try {
                            propertyValue = element.getBBox()[property];
                        } catch (error) {
                            propertyValue = 0;
                        }
                    /* Otherwise, access the attribute value directly. */
                    } else {
                        propertyValue = element.getAttribute(property);
                    }
                } else {
                    propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
                }
            }

            /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
               convert CSS null-values to an integer of value 0. */
            if (CSS.Values.isCSSNullValue(propertyValue)) {
                propertyValue = 0;
            }

            if (Velocity.debug >= 2) console.log("Get " + property + ": " + propertyValue);

            return propertyValue;
        },

        /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollData) {
            var propertyName = property;

            /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
            if (property === "scroll") {
                /* If a container option is present, scroll the container instead of the browser window. */
                if (scrollData.container) {
                    scrollData.container["scroll" + scrollData.direction] = propertyValue;
                /* Otherwise, Velocity defaults to scrolling the browser window. */
                } else {
                    if (scrollData.direction === "Left") {
                        window.scrollTo(propertyValue, scrollData.alternateValue);
                    } else {
                        window.scrollTo(scrollData.alternateValue, propertyValue);
                    }
                }
            } else {
                /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
                   Thus, for now, we merely cache transforms being SET. */
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    /* Perform a normalization injection. */
                    /* Note: The normalization logic handles the transformCache updating. */
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);

                    propertyName = "transform";
                    propertyValue = Data(element).transformCache[property];
                } else {
                    /* Inject hooks. */
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property,
                            hookRoot = CSS.Hooks.getRoot(property);

                        /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }

                    /* Normalize names and values. */
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }

                    /* Assign the appropriate vendor prefix before performing an official style update. */
                    propertyName = CSS.Names.prefixCheck(property)[0];

                    /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
                       Try/catch is avoided for other browsers since it incurs a performance overhead. */
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                        } catch (error) { if (Velocity.debug) console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]"); }
                    /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
                    /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
                    } else if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                        /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                        /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                        element.setAttribute(property, propertyValue);
                    } else {
                        element.style[propertyName] = propertyValue;
                    }

                    if (Velocity.debug >= 2) console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                }
            }

            /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
            return [ propertyName, propertyValue ];
        },

        /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
        /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
        flushTransformCache: function(element) {
            var transformString = "";

            /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
               (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
            if ((IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) && Data(element).isSVG) {
                /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
                   Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
                function getTransformFloat (transformProperty) {
                    return parseFloat(CSS.getPropertyValue(element, transformProperty));
                }

                /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
                   we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
                var SVGTransforms = {
                    translate: [ getTransformFloat("translateX"), getTransformFloat("translateY") ],
                    skewX: [ getTransformFloat("skewX") ], skewY: [ getTransformFloat("skewY") ],
                    /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
                       (this behavior mimics the result of animating all these properties at once on HTML elements). */
                    scale: getTransformFloat("scale") !== 1 ? [ getTransformFloat("scale"), getTransformFloat("scale") ] : [ getTransformFloat("scaleX"), getTransformFloat("scaleY") ],
                    /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
                       defining the rotation's origin point. We ignore the origin values (default them to 0). */
                    rotate: [ getTransformFloat("rotateZ"), 0, 0 ]
                };

                /* Iterate through the transform properties in the user-defined property map order.
                   (This mimics the behavior of non-SVG transform animation.) */
                $.each(Data(element).transformCache, function(transformName) {
                    /* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
                       properties so that they match up with SVG's accepted transform properties. */
                    if (/^translate/i.test(transformName)) {
                        transformName = "translate";
                    } else if (/^scale/i.test(transformName)) {
                        transformName = "scale";
                    } else if (/^rotate/i.test(transformName)) {
                        transformName = "rotate";
                    }

                    /* Check that we haven't yet deleted the property from the SVGTransforms container. */
                    if (SVGTransforms[transformName]) {
                        /* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
                        transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

                        /* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
                           re-insert the same master property if we encounter another one of its axis-specific properties. */
                        delete SVGTransforms[transformName];
                    }
                });
            } else {
                var transformValue,
                    perspective;

                /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
                $.each(Data(element).transformCache, function(transformName) {
                    transformValue = Data(element).transformCache[transformName];

                    /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
                    if (transformName === "transformPerspective") {
                        perspective = transformValue;
                        return true;
                    }

                    /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
                    if (IE === 9 && transformName === "rotateZ") {
                        transformName = "rotate";
                    }

                    transformString += transformName + transformValue + " ";
                });

                /* If present, set the perspective subproperty first. */
                if (perspective) {
                    transformString = "perspective" + perspective + " " + transformString;
                }
            }

            CSS.setPropertyValue(element, "transform", transformString);
        }
    };

    /* Register hooks and normalizations. */
    CSS.Hooks.register();
    CSS.Normalizations.register();

    /* Allow hook setting in the same fashion as jQuery's $.css(). */
    Velocity.hook = function (elements, arg2, arg3) {
        var value = undefined;

        elements = sanitizeElements(elements);

        $.each(elements, function(i, element) {
            /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /* Get property value. If an element set was passed in, only return the value for the first element. */
            if (arg3 === undefined) {
                if (value === undefined) {
                    value = Velocity.CSS.getPropertyValue(element, arg2);
                }
            /* Set property value. */
            } else {
                /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
                var adjustedSet = Velocity.CSS.setPropertyValue(element, arg2, arg3);

                /* Transform properties don't automatically set. They have to be flushed to the DOM. */
                if (adjustedSet[0] === "transform") {
                    Velocity.CSS.flushTransformCache(element);
                }

                value = adjustedSet;
            }
        });

        return value;
    };

    /*****************
        Animation
    *****************/

    var animate = function() {

        /******************
            Call Chain
        ******************/

        /* Logic for determining what to return to the call stack when exiting out of Velocity. */
        function getChain () {
            /* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
               default to null instead of returning the targeted elements so that utility function's return value is standardized. */
            if (isUtility) {
                return promiseData.promise || null;
            /* Otherwise, if we're using $.fn, return the jQuery-/Zepto-wrapped element set. */
            } else {
                return elementsWrapped;
            }
        }

        /*************************
           Arguments Assignment
        *************************/

        /* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
           objects are defined on a container object that's passed in as Velocity's sole argument. */
        /* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
        var syntacticSugar = (arguments[0] && (arguments[0].p || (($.isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || Type.isString(arguments[0].properties)))),
            /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
            isUtility,
            /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
               passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
            elementsWrapped,
            argumentIndex;

        var elements,
            propertiesMap,
            options;

        /* Detect jQuery/Zepto elements being animated via the $.fn method. */
        if (Type.isWrapped(this)) {
            isUtility = false;

            argumentIndex = 0;
            elements = this;
            elementsWrapped = this;
        /* Otherwise, raw elements are being animated via the utility function. */
        } else {
            isUtility = true;

            argumentIndex = 1;
            elements = syntacticSugar ? (arguments[0].elements || arguments[0].e) : arguments[0];
        }

        elements = sanitizeElements(elements);

        if (!elements) {
            return;
        }

        if (syntacticSugar) {
            propertiesMap = arguments[0].properties || arguments[0].p;
            options = arguments[0].options || arguments[0].o;
        } else {
            propertiesMap = arguments[argumentIndex];
            options = arguments[argumentIndex + 1];
        }

        /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
           single raw DOM element is passed in (which doesn't contain a length property). */
        var elementsLength = elements.length,
            elementsIndex = 0;

        /***************************
            Argument Overloading
        ***************************/

        /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
           Overloading is detected by checking for the absence of an object being passed into options. */
        /* Note: The stop and finish actions do not accept animation options, and are therefore excluded from this check. */
        if (!/^(stop|finish|finishAll)$/i.test(propertiesMap) && !$.isPlainObject(options)) {
            /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
            var startingArgumentPosition = argumentIndex + 1;

            options = {};

            /* Iterate through all options arguments */
            for (var i = startingArgumentPosition; i < arguments.length; i++) {
                /* Treat a number as a duration. Parse it out. */
                /* Note: The following RegEx will return true if passed an array with a number as its first item.
                   Thus, arrays are skipped from this check. */
                if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                    options.duration = arguments[i];
                /* Treat strings and arrays as easings. */
                } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
                    options.easing = arguments[i];
                /* Treat a function as a complete callback. */
                } else if (Type.isFunction(arguments[i])) {
                    options.complete = arguments[i];
                }
            }
        }

        /***************
            Promises
        ***************/

        var promiseData = {
                promise: null,
                resolver: null,
                rejecter: null
            };

        /* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
           promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
           method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
           call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
        /* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
           triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
           grouped together for the purposes of resolving and rejecting a promise. */
        if (isUtility && Velocity.Promise) {
            promiseData.promise = new Velocity.Promise(function (resolve, reject) {
                promiseData.resolver = resolve;
                promiseData.rejecter = reject;
            });
        }

        /*********************
           Action Detection
        *********************/

        /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
           or they can be started, stopped, or reversed. If a literal or referenced properties map is passed in as Velocity's
           first argument, the associated action is "start". Alternatively, "scroll", "reverse", or "stop" can be passed in instead of a properties map. */
        var action;

        switch (propertiesMap) {
            case "scroll":
                action = "scroll";
                break;

            case "reverse":
                action = "reverse";
                break;

            case "finish":
            case "finishAll":
            case "stop":
                /*******************
                    Action: Stop
                *******************/

                /* Clear the currently-active delay on each targeted element. */
                $.each(elements, function(i, element) {
                    if (Data(element) && Data(element).delayTimer) {
                        /* Stop the timer from triggering its cached next() function. */
                        clearTimeout(Data(element).delayTimer.setTimeout);

                        /* Manually call the next() function so that the subsequent queue items can progress. */
                        if (Data(element).delayTimer.next) {
                            Data(element).delayTimer.next();
                        }

                        delete Data(element).delayTimer;
                    }

                    /* If we want to finish everything in the queue, we have to iterate through it
                       and call each function. This will make them active calls below, which will
                       cause them to be applied via the duration setting. */
                    if (propertiesMap === "finishAll" && (options === true || Type.isString(options))) {
                        /* Iterate through the items in the element's queue. */
                        $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                            /* The queue array can contain an "inprogress" string, which we skip. */
                            if (Type.isFunction(item)) {
                                item();
                            }
                        });

                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                        $.queue(element, Type.isString(options) ? options : "", []);
                    }
                });

                var callsToStop = [];

                /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
                   been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
                   is stopped, the next item in its animation queue is immediately triggered. */
                /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
                   or a custom queue string can be passed in. */
                /* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
                   regardless of the element's current queue state. */

                /* Iterate through every active call. */
                $.each(Velocity.State.calls, function(i, activeCall) {
                    /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                    if (activeCall) {
                        /* Iterate through the active call's targeted elements. */
                        $.each(activeCall[1], function(k, activeElement) {
                            /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
                               clear calls associated with the relevant queue. */
                            /* Call stopping logic works as follows:
                               - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
                               - options === undefined --> stop current queue:"" call and all queue:false calls.
                               - options === false --> stop only queue:false calls.
                               - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
                            var queueName = (options === undefined) ? "" : options;

                            if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                                return true;
                            }

                            /* Iterate through the calls targeted by the stop command. */
                            $.each(elements, function(l, element) {
                                /* Check that this call was applied to the target element. */
                                if (element === activeElement) {
                                    /* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
                                       due to the queue-clearing above. */
                                    if (options === true || Type.isString(options)) {
                                        /* Iterate through the items in the element's queue. */
                                        $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                                            /* The queue array can contain an "inprogress" string, which we skip. */
                                            if (Type.isFunction(item)) {
                                                /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                                                   (Specifically, the queue will resolve the call's associated promise then abort.)  */
                                                item(null, true);
                                            }
                                        });

                                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                                        $.queue(element, Type.isString(options) ? options : "", []);
                                    }

                                    if (propertiesMap === "stop") {
                                        /* Since "reverse" uses cached start values (the previous call's endValues), these values must be
                                           changed to reflect the final value that the elements were actually tweened to. */
                                        /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                                           object. Also, queue:false animations can't be reversed. */
                                        if (Data(element) && Data(element).tweensContainer && queueName !== false) {
                                            $.each(Data(element).tweensContainer, function(m, activeTween) {
                                                activeTween.endValue = activeTween.currentValue;
                                            });
                                        }

                                        callsToStop.push(i);
                                    } else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
                                        /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
                                        they finish upon the next rAf tick then proceed with normal call completion logic. */
                                        activeCall[2].duration = 1;
                                    }
                                }
                            });
                        });
                    }
                });

                /* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
                   that the complete callback and display:none setting should be skipped since we're completing prematurely. */
                if (propertiesMap === "stop") {
                    $.each(callsToStop, function(i, j) {
                        completeCall(j, true);
                    });

                    if (promiseData.promise) {
                        /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
                        promiseData.resolver(elements);
                    }
                }

                /* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
                return getChain();

            default:
                /* Treat a non-empty plain object as a literal properties map. */
                if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
                    action = "start";

                /****************
                    Redirects
                ****************/

                /* Check if a string matches a registered redirect (see Redirects above). */
                } else if (Type.isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
                    var opts = $.extend({}, options),
                        durationOriginal = opts.duration,
                        delayOriginal = opts.delay || 0;

                    /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
                    if (opts.backwards === true) {
                        elements = $.extend(true, [], elements).reverse();
                    }

                    /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
                    $.each(elements, function(elementIndex, element) {
                        /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                        if (parseFloat(opts.stagger)) {
                            opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
                        } else if (Type.isFunction(opts.stagger)) {
                            opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                        }

                        /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                           the duration of each element's animation, using floors to prevent producing very short durations. */
                        if (opts.drag) {
                            /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                            opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                            /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                               B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                               The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                            opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex/elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                        }

                        /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                           reduce the opts checking logic required inside the redirect. */
                        Velocity.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
                    });

                    /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
                       (The performance overhead up to this point is virtually non-existant.) */
                    /* Note: The jQuery call chain is kept intact by returning the complete element set. */
                    return getChain();
                } else {
                    var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

                    if (promiseData.promise) {
                        promiseData.rejecter(new Error(abortError));
                    } else {
                        console.log(abortError);
                    }

                    return getChain();
                }
        }

        /**************************
            Call-Wide Variables
        **************************/

        /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
           being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
           avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
           conversion metrics across Velocity animations that are not immediately consecutively chained. */
        var callUnitConversionData = {
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                remToPx: null,
                vwToPx: null,
                vhToPx: null
            };

        /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
           Velocity.State.calls array that is processed during animation ticking. */
        var call = [];

        /************************
           Element Processing
        ************************/

        /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
           1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
           2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
           3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
        */

        function processElement () {

            /*************************
               Part I: Pre-Queueing
            *************************/

            /***************************
               Element-Wide Variables
            ***************************/

            var element = this,
                /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
                opts = $.extend({}, Velocity.defaults, options),
                /* A container for the processed data associated with each property in the propertyMap.
                   (Each property in the map produces its own "tween".) */
                tweensContainer = {},
                elementUnitConversionData;

            /******************
               Element Init
            ******************/

            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /******************
               Option: Delay
            ******************/

            /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
            /* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
               (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
            if (parseFloat(opts.delay) && opts.queue !== false) {
                $.queue(element, opts.queue, function(next) {
                    /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
                       The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command. */
                    Data(element).delayTimer = {
                        setTimeout: setTimeout(next, parseFloat(opts.delay)),
                        next: next
                    };
                });
            }

            /*********************
               Option: Duration
            *********************/

            /* Support for jQuery's named durations. */
            switch (opts.duration.toString().toLowerCase()) {
                case "fast":
                    opts.duration = 200;
                    break;

                case "normal":
                    opts.duration = DURATION_DEFAULT;
                    break;

                case "slow":
                    opts.duration = 600;
                    break;

                default:
                    /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
                    opts.duration = parseFloat(opts.duration) || 1;
            }

            /************************
               Global Option: Mock
            ************************/

            if (Velocity.mock !== false) {
                /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
                   Alternatively, a multiplier can be passed in to time remap all delays and durations. */
                if (Velocity.mock === true) {
                    opts.duration = opts.delay = 1;
                } else {
                    opts.duration *= parseFloat(Velocity.mock) || 1;
                    opts.delay *= parseFloat(Velocity.mock) || 1;
                }
            }

            /*******************
               Option: Easing
            *******************/

            opts.easing = getEasing(opts.easing, opts.duration);

            /**********************
               Option: Callbacks
            **********************/

            /* Callbacks must functions. Otherwise, default to null. */
            if (opts.begin && !Type.isFunction(opts.begin)) {
                opts.begin = null;
            }

            if (opts.progress && !Type.isFunction(opts.progress)) {
                opts.progress = null;
            }

            if (opts.complete && !Type.isFunction(opts.complete)) {
                opts.complete = null;
            }

            /*********************************
               Option: Display & Visibility
            *********************************/

            /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
            /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
            if (opts.display !== undefined && opts.display !== null) {
                opts.display = opts.display.toString().toLowerCase();

                /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
                if (opts.display === "auto") {
                    opts.display = Velocity.CSS.Values.getDisplayType(element);
                }
            }

            if (opts.visibility !== undefined && opts.visibility !== null) {
                opts.visibility = opts.visibility.toString().toLowerCase();
            }

            /**********************
               Option: mobileHA
            **********************/

            /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
               on animating elements. HA is removed from the element at the completion of its animation. */
            /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
            /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
            opts.mobileHA = (opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread);

            /***********************
               Part II: Queueing
            ***********************/

            /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
               In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
            /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
               the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
            function buildQueue (next) {

                /*******************
                   Option: Begin
                *******************/

                /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
                if (opts.begin && elementsIndex === 0) {
                    /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                    try {
                        opts.begin.call(elements, elements);
                    } catch (error) {
                        setTimeout(function() { throw error; }, 1);
                    }
                }

                /*****************************************
                   Tween Data Construction (for Scroll)
                *****************************************/

                /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
                if (action === "scroll") {
                    /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
                    var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
                        scrollOffset = parseFloat(opts.offset) || 0,
                        scrollPositionCurrent,
                        scrollPositionCurrentAlternate,
                        scrollPositionEnd;

                    /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
                       as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
                    if (opts.container) {
                        /* Ensure that either a jQuery object or a raw DOM element was passed in. */
                        if (Type.isWrapped(opts.container) || Type.isNode(opts.container)) {
                            /* Extract the raw DOM element from the jQuery wrapper. */
                            opts.container = opts.container[0] || opts.container;
                            /* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
                               (due to the user's natural interaction with the page). */
                            scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

                            /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
                               -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
                               the scroll container's current scroll position. */
                            scrollPositionEnd = (scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
                        /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
                        } else {
                            opts.container = null;
                        }
                    } else {
                        /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
                           the appropriate cached property names (which differ based on browser type). */
                        scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
                        /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
                        scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

                        /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
                           and therefore end values do not need to be compounded onto current values. */
                        scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
                    }

                    /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
                    tweensContainer = {
                        scroll: {
                            rootPropertyValue: false,
                            startValue: scrollPositionCurrent,
                            currentValue: scrollPositionCurrent,
                            endValue: scrollPositionEnd,
                            unitType: "",
                            easing: opts.easing,
                            scrollData: {
                                container: opts.container,
                                direction: scrollDirection,
                                alternateValue: scrollPositionCurrentAlternate
                            }
                        },
                        element: element
                    };

                    if (Velocity.debug) console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);

                /******************************************
                   Tween Data Construction (for Reverse)
                ******************************************/

                /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
                   that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
                   the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
                /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
                /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
                   there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
                   as reverting to the element's values as they were prior to the previous *Velocity* call. */
                } else if (action === "reverse") {
                    /* Abort if there is no prior animation data to reverse to. */
                    if (!Data(element).tweensContainer) {
                        /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
                        $.dequeue(element, opts.queue);

                        return;
                    } else {
                        /*********************
                           Options Parsing
                        *********************/

                        /* If the element was hidden via the display option in the previous call,
                           revert display to "auto" prior to reversal so that the element is visible again. */
                        if (Data(element).opts.display === "none") {
                            Data(element).opts.display = "auto";
                        }

                        if (Data(element).opts.visibility === "hidden") {
                            Data(element).opts.visibility = "visible";
                        }

                        /* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
                           Further, remove the previous call's callback options; typically, users do not want these to be refired. */
                        Data(element).opts.loop = false;
                        Data(element).opts.begin = null;
                        Data(element).opts.complete = null;

                        /* Since we're extending an opts object that has already been extended with the defaults options object,
                           we remove non-explicitly-defined properties that are auto-assigned values. */
                        if (!options.easing) {
                            delete opts.easing;
                        }

                        if (!options.duration) {
                            delete opts.duration;
                        }

                        /* The opts object used for reversal is an extension of the options object optionally passed into this
                           reverse call plus the options used in the previous Velocity call. */
                        opts = $.extend({}, Data(element).opts, opts);

                        /*************************************
                           Tweens Container Reconstruction
                        *************************************/

                        /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
                        var lastTweensContainer = $.extend(true, {}, Data(element).tweensContainer);

                        /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
                        for (var lastTween in lastTweensContainer) {
                            /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                            if (lastTween !== "element") {
                                var lastStartValue = lastTweensContainer[lastTween].startValue;

                                lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                                lastTweensContainer[lastTween].endValue = lastStartValue;

                                /* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
                                   Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
                                   The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                                if (!Type.isEmptyObject(options)) {
                                    lastTweensContainer[lastTween].easing = opts.easing;
                                }

                                if (Velocity.debug) console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
                            }
                        }

                        tweensContainer = lastTweensContainer;
                    }

                /*****************************************
                   Tween Data Construction (for Start)
                *****************************************/

                } else if (action === "start") {

                    /*************************
                        Value Transferring
                    *************************/

                    /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
                       while the element was in the process of being animated by Velocity, then this current call is safe to use
                       the end values from the prior call as its start values. Velocity attempts to perform this value transfer
                       process whenever possible in order to avoid requerying the DOM. */
                    /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
                       then the DOM is queried for the element's current values as a last resort. */
                    /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */
                    var lastTweensContainer;

                    /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
                       to transfer over end values to use as start values. If it's set to true and there is a previous
                       Velocity call to pull values from, do so. */
                    if (Data(element).tweensContainer && Data(element).isAnimating === true) {
                        lastTweensContainer = Data(element).tweensContainer;
                    }

                    /***************************
                       Tween Data Calculation
                    ***************************/

                    /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
                    /* Property map values can either take the form of 1) a single value representing the end value,
                       or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
                       The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
                       the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
                    function parsePropertyValue (valueData, skipResolvingEasing) {
                        var endValue = undefined,
                            easing = undefined,
                            startValue = undefined;

                        /* Handle the array format, which can be structured as one of three potential overloads:
                           A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
                        if (Type.isArray(valueData)) {
                            /* endValue is always the first item in the array. Don't bother validating endValue's value now
                               since the ensuing property cycling logic does that. */
                            endValue = valueData[0];

                            /* Two-item array format: If the second item is a number, function, or hex string, treat it as a
                               start value since easings can only be non-hex strings or arrays. */
                            if ((!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                                startValue = valueData[1];
                            /* Two or three-item array: If the second item is a non-hex string or an array, treat it as an easing. */
                            } else if ((Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1])) || Type.isArray(valueData[1])) {
                                easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                                /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                                if (valueData[2] !== undefined) {
                                    startValue = valueData[2];
                                }
                            }
                        /* Handle the single-value format. */
                        } else {
                            endValue = valueData;
                        }

                        /* Default to the call's easing if a per-property easing type was not defined. */
                        if (!skipResolvingEasing) {
                            easing = easing || opts.easing;
                        }

                        /* If functions were passed in as values, pass the function the current element as its context,
                           plus the element's index and the element set's size as arguments. Then, assign the returned value. */
                        if (Type.isFunction(endValue)) {
                            endValue = endValue.call(element, elementsIndex, elementsLength);
                        }

                        if (Type.isFunction(startValue)) {
                            startValue = startValue.call(element, elementsIndex, elementsLength);
                        }

                        /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
                        return [ endValue || 0, easing, startValue ];
                    }

                    /* Cycle through each property in the map, looking for shorthand color properties (e.g. "color" as opposed to "colorRed"). Inject the corresponding
                       colorRed, colorGreen, and colorBlue RGB component tweens into the propertiesMap (which Velocity understands) and remove the shorthand property. */
                    $.each(propertiesMap, function(property, value) {
                        /* Find shorthand color properties that have been passed a hex string. */
                        if (RegExp("^" + CSS.Lists.colors.join("$|^") + "$").test(property)) {
                            /* Parse the value data for each shorthand. */
                            var valueData = parsePropertyValue(value, true),
                                endValue = valueData[0],
                                easing = valueData[1],
                                startValue = valueData[2];

                            if (CSS.RegEx.isHex.test(endValue)) {
                                /* Convert the hex strings into their RGB component arrays. */
                                var colorComponents = [ "Red", "Green", "Blue" ],
                                    endValueRGB = CSS.Values.hexToRgb(endValue),
                                    startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

                                /* Inject the RGB component tweens into propertiesMap. */
                                for (var i = 0; i < colorComponents.length; i++) {
                                    var dataArray = [ endValueRGB[i] ];

                                    if (easing) {
                                        dataArray.push(easing);
                                    }

                                    if (startValueRGB !== undefined) {
                                        dataArray.push(startValueRGB[i]);
                                    }

                                    propertiesMap[property + colorComponents[i]] = dataArray;
                                }

                                /* Remove the intermediary shorthand property entry now that we've processed it. */
                                delete propertiesMap[property];
                            }
                        }
                    });

                    /* Create a tween out of each property, and append its associated data to tweensContainer. */
                    for (var property in propertiesMap) {

                        /**************************
                           Start Value Sourcing
                        **************************/

                        /* Parse out endValue, easing, and startValue from the property's data. */
                        var valueData = parsePropertyValue(propertiesMap[property]),
                            endValue = valueData[0],
                            easing = valueData[1],
                            startValue = valueData[2];

                        /* Now that the original property name's format has been used for the parsePropertyValue() lookup above,
                           we force the property to its camelCase styling to normalize it for manipulation. */
                        property = CSS.Names.camelCase(property);

                        /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                        var rootProperty = CSS.Hooks.getRoot(property),
                            rootPropertyValue = false;

                        /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
                           inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
                           Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
                        /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
                           there is no way to check for their explicit browser support, and so we skip skip this check for them. */
                        if (!Data(element).isSVG && rootProperty !== "tween" && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                            if (Velocity.debug) console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");

                            continue;
                        }

                        /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
                           animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
                           a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                        if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                            startValue = 0;
                        }

                        /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
                           for all of the current call's properties that were *also* animated in the previous call. */
                        /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                        if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                            if (startValue === undefined) {
                                startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                            }

                            /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
                               instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
                               attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                            rootPropertyValue = Data(element).rootPropertyValueCache[rootProperty];
                        /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
                        } else {
                            /* Handle hooked properties. */
                            if (CSS.Hooks.registered[property]) {
                               if (startValue === undefined) {
                                    rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                                    /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                                       getPropertyValue() will extract the hook from rootPropertyValue. */
                                    startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                                /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
                                   just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
                                   root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
                                   to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                                } else {
                                    /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                                }
                            /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                            } else if (startValue === undefined) {
                                startValue = CSS.getPropertyValue(element, property); /* GET */
                            }
                        }

                        /**************************
                           Value Data Extraction
                        **************************/

                        var separatedValue,
                            endValueUnitType,
                            startValueUnitType,
                            operator = false;

                        /* Separates a property value into its numeric value and its unit type. */
                        function separateValue (property, value) {
                            var unitType,
                                numericValue;

                            numericValue = (value || "0")
                                .toString()
                                .toLowerCase()
                                /* Match the unit type at the end of the value. */
                                .replace(/[%A-z]+$/, function(match) {
                                    /* Grab the unit type. */
                                    unitType = match;

                                    /* Strip the unit type off of value. */
                                    return "";
                                });

                            /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                            if (!unitType) {
                                unitType = CSS.Values.getUnitType(property);
                            }

                            return [ numericValue, unitType ];
                        }

                        /* Separate startValue. */
                        separatedValue = separateValue(property, startValue);
                        startValue = separatedValue[0];
                        startValueUnitType = separatedValue[1];

                        /* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
                        separatedValue = separateValue(property, endValue);
                        endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
                            operator = subMatch;

                            /* Strip the operator off of the value. */
                            return "";
                        });
                        endValueUnitType = separatedValue[1];

                        /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
                        startValue = parseFloat(startValue) || 0;
                        endValue = parseFloat(endValue) || 0;

                        /***************************************
                           Property-Specific Value Conversion
                        ***************************************/

                        /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                        if (endValueUnitType === "%") {
                            /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
                               which is identical to the em unit's behavior, so we piggyback off of that. */
                            if (/^(fontSize|lineHeight)$/.test(property)) {
                                /* Convert % into an em decimal value. */
                                endValue = endValue / 100;
                                endValueUnitType = "em";
                            /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
                            } else if (/^scale/.test(property)) {
                                endValue = endValue / 100;
                                endValueUnitType = "";
                            /* For RGB components, take the defined percentage of 255 and strip off the unit type. */
                            } else if (/(Red|Green|Blue)$/i.test(property)) {
                                endValue = (endValue / 100) * 255;
                                endValueUnitType = "";
                            }
                        }

                        /***************************
                           Unit Ratio Calculation
                        ***************************/

                        /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
                           %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
                           for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
                           from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
                           1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
                           2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
                        /* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
                           setting values with the target unit type then comparing the returned pixel value. */
                        /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
                           of batching the SETs and GETs together upfront outweights the potential overhead
                           of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
                        /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
                        function calculateUnitRatios () {

                            /************************
                                Same Ratio Checks
                            ************************/

                            /* The properties below are used to determine whether the element differs sufficiently from this call's
                               previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
                               of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
                               this is done to minimize DOM querying. */
                            var sameRatioIndicators = {
                                    myParent: element.parentNode || document.body, /* GET */
                                    position: CSS.getPropertyValue(element, "position"), /* GET */
                                    fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                                },
                                /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                                samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
                                /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                                sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

                            /* Store these ratio indicators call-wide for the next element to compare against. */
                            callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                            callUnitConversionData.lastPosition = sameRatioIndicators.position;
                            callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

                            /***************************
                               Element-Specific Units
                            ***************************/

                            /* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
                               of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                            var measurement = 100,
                                unitRatios = {};

                            if (!sameEmRatio || !samePercentRatio) {
                                var dummy = Data(element).isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

                                Velocity.init(dummy);
                                sameRatioIndicators.myParent.appendChild(dummy);

                                /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
                                   Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                                /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                                $.each([ "overflow", "overflowX", "overflowY" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, "hidden");
                                });
                                Velocity.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                                Velocity.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                                Velocity.CSS.setPropertyValue(dummy, "boxSizing", "content-box");

                                /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                                $.each([ "minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, measurement + "%");
                                });
                                /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                                Velocity.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

                                /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

                                sameRatioIndicators.myParent.removeChild(dummy);
                            } else {
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                            }

                            /***************************
                               Element-Agnostic Units
                            ***************************/

                            /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
                               once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
                               that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
                               so we calculate it now. */
                            if (callUnitConversionData.remToPx === null) {
                                /* Default to browsers' default fontSize of 16px in the case of 0. */
                                callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                            }

                            /* Similarly, viewport units are %-relative to the window's inner dimensions. */
                            if (callUnitConversionData.vwToPx === null) {
                                callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
                                callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
                            }

                            unitRatios.remToPx = callUnitConversionData.remToPx;
                            unitRatios.vwToPx = callUnitConversionData.vwToPx;
                            unitRatios.vhToPx = callUnitConversionData.vhToPx;

                            if (Velocity.debug >= 1) console.log("Unit ratios: " + JSON.stringify(unitRatios), element);

                            return unitRatios;
                        }

                        /********************
                           Unit Conversion
                        ********************/

                        /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                        if (/[\/*]/.test(operator)) {
                            endValueUnitType = startValueUnitType;
                        /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
                           is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
                           on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                           would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                        /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
                        } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
                            /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                            /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
                               match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
                               which remains past the point of the animation's completion. */
                            if (endValue === 0) {
                                endValueUnitType = startValueUnitType;
                            } else {
                                /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
                                   If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                                elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

                                /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                                /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                                var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";

                                /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
                                   1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                                switch (startValueUnitType) {
                                    case "%":
                                        /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                                           Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                                           to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                                        startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* px acts as our midpoint in the unit conversion process; do nothing. */
                                        break;

                                    default:
                                        startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                                }

                                /* Invert the px ratios to convert into to the target unit. */
                                switch (endValueUnitType) {
                                    case "%":
                                        startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* startValue is already in px, do nothing; we're done. */
                                        break;

                                    default:
                                        startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                                }
                            }
                        }

                        /*********************
                           Relative Values
                        *********************/

                        /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                        /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
                           to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
                           50 points is added on top of the current % value. */
                        switch (operator) {
                            case "+":
                                endValue = startValue + endValue;
                                break;

                            case "-":
                                endValue = startValue - endValue;
                                break;

                            case "*":
                                endValue = startValue * endValue;
                                break;

                            case "/":
                                endValue = startValue / endValue;
                                break;
                        }

                        /**************************
                           tweensContainer Push
                        **************************/

                        /* Construct the per-property tween object, and push it to the element's tweensContainer. */
                        tweensContainer[property] = {
                            rootPropertyValue: rootPropertyValue,
                            startValue: startValue,
                            currentValue: startValue,
                            endValue: endValue,
                            unitType: endValueUnitType,
                            easing: easing
                        };

                        if (Velocity.debug) console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                    }

                    /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                    tweensContainer.element = element;
                }

                /*****************
                    Call Push
                *****************/

                /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
                   being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
                if (tweensContainer.element) {
                    /* Apply the "velocity-animating" indicator class. */
                    CSS.Values.addClass(element, "velocity-animating");

                    /* The call array houses the tweensContainers for each element being animated in the current call. */
                    call.push(tweensContainer);

                    /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
                    if (opts.queue === "") {
                        Data(element).tweensContainer = tweensContainer;
                        Data(element).opts = opts;
                    }

                    /* Switch on the element's animating flag. */
                    Data(element).isAnimating = true;

                    /* Once the final element in this call's element set has been processed, push the call array onto
                       Velocity.State.calls for the animation tick to immediately begin processing. */
                    if (elementsIndex === elementsLength - 1) {
                        /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
                           Anything on this call container is subjected to tick() processing. */
                        Velocity.State.calls.push([ call, elements, opts, null, promiseData.resolver ]);

                        /* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
                        if (Velocity.State.isTicking === false) {
                            Velocity.State.isTicking = true;

                            /* Start the tick loop. */
                            tick();
                        }
                    } else {
                        elementsIndex++;
                    }
                }
            }

            /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
            if (opts.queue === false) {
                /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
                   we manually inject the delay property here with an explicit setTimeout. */
                if (opts.delay) {
                    setTimeout(buildQueue, opts.delay);
                } else {
                    buildQueue();
                }
            /* Otherwise, the call undergoes element queueing as normal. */
            /* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
            } else {
                $.queue(element, opts.queue, function(next, clearQueue) {
                    /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
                       so it's fine if this is repeatedly triggered for each element in the associated call.) */
                    if (clearQueue === true) {
                        if (promiseData.promise) {
                            promiseData.resolver(elements);
                        }

                        /* Do not continue with animation queueing. */
                        return true;
                    }

                    /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
                       See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    buildQueue(next);
                });
            }

            /*********************
                Auto-Dequeuing
            *********************/

            /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
               must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
               for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
               queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
               first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
            /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
               each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
            /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
               Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
            if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
                $.dequeue(element);
            }
        }

        /**************************
           Element Set Iteration
        **************************/

        /* If the "nodeType" property exists on the elements variable, we're animating a single element.
           Place it in an array so that $.each() can iterate over it. */
        $.each(elements, function(i, element) {
            /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
            if (Type.isNode(element)) {
                processElement.call(element);
            }
        });

        /******************
           Option: Loop
        ******************/

        /* The loop option accepts an integer indicating how many times the element should loop between the values in the
           current call's properties map and the element's property values prior to this call. */
        /* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
           to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
           which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
        var opts = $.extend({}, Velocity.defaults, options),
            reverseCallsCount;

        opts.loop = parseInt(opts.loop);
        reverseCallsCount = (opts.loop * 2) - 1;

        if (opts.loop) {
            /* Double the loop count to convert it into its appropriate number of "reverse" calls.
               Subtract 1 from the resulting value since the current call is included in the total alternation count. */
            for (var x = 0; x < reverseCallsCount; x++) {
                /* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
                   isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
                   call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
                var reverseOptions = {
                    delay: opts.delay,
                    progress: opts.progress
                };

                /* If a complete callback was passed into this call, transfer it to the loop redirect's final "reverse" call
                   so that it's triggered when the entire redirect is complete (and not when the very first animation is complete). */
                if (x === reverseCallsCount - 1) {
                    reverseOptions.display = opts.display;
                    reverseOptions.visibility = opts.visibility;
                    reverseOptions.complete = opts.complete;
                }

                animate(elements, "reverse", reverseOptions);
            }
        }

        /***************
            Chaining
        ***************/

        /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
        return getChain();
    };

    /* Turn Velocity into the animation function, extended with the pre-existing Velocity object. */
    Velocity = $.extend(animate, Velocity);
    /* For legacy support, also expose the literal animate method. */
    Velocity.animate = animate;

    /**************
        Timing
    **************/

    /* Ticker function. */
    var ticker = window.requestAnimationFrame || rAFShim;

    /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
       To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
       devices to avoid wasting battery power on inactive tabs. */
    /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
    if (!Velocity.State.isMobile && document.hidden !== undefined) {
        document.addEventListener("visibilitychange", function() {
            /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
            if (document.hidden) {
                ticker = function(callback) {
                    /* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
                    return setTimeout(function() { callback(true) }, 16);
                };

                /* The rAF loop has been paused by the browser, so we manually restart the tick. */
                tick();
            } else {
                ticker = window.requestAnimationFrame || rAFShim;
            }
        });
    }

    /************
        Tick
    ************/

    /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick (timestamp) {
        /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
           We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
           the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
           calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
           the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
           by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
        if (timestamp) {
            /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is
               under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
            var timeCurrent = (new Date).getTime();

            /********************
               Call Iteration
            ********************/

            var callsLength = Velocity.State.calls.length;

            /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
               when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
               has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Velocity.State.calls. */
            if (callsLength > 10000) {
                Velocity.State.calls = compactSparseArray(Velocity.State.calls);
            }

            /* Iterate through each active call. */
            for (var i = 0; i < callsLength; i++) {
                /* When a Velocity call is completed, its Velocity.State.calls entry is set to false. Continue on to the next call. */
                if (!Velocity.State.calls[i]) {
                    continue;
                }

                /************************
                   Call-Wide Variables
                ************************/

                var callContainer = Velocity.State.calls[i],
                    call = callContainer[0],
                    opts = callContainer[2],
                    timeStart = callContainer[3],
                    firstTick = !!timeStart,
                    tweenDummyValue = null;

                /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
                   We assign timeStart now so that its value is as close to the real animation start time as possible.
                   (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
                   between that time and now would cause the first few frames of the tween to be skipped since
                   percentComplete is calculated relative to timeStart.) */
                /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
                   first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
                   same style value as the element's current value. */
                if (!timeStart) {
                    timeStart = Velocity.State.calls[i][3] = timeCurrent - 16;
                }

                /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
                   (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                   Accordingly, we ensure that percentComplete does not exceed 1. */
                var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);

                /**********************
                   Element Iteration
                **********************/

                /* For every call, iterate through each of the elements in its set. */
                for (var j = 0, callLength = call.length; j < callLength; j++) {
                    var tweensContainer = call[j],
                        element = tweensContainer.element;

                    /* Check to see if this element has been deleted midway through the animation by checking for the
                       continued existence of its data cache. If it's gone, skip animating this element. */
                    if (!Data(element)) {
                        continue;
                    }

                    var transformPropertyExists = false;

                    /**********************************
                       Display & Visibility Toggling
                    **********************************/

                    /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                       (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
                    if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                        if (opts.display === "flex") {
                            var flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];

                            $.each(flexValues, function(i, flexValue) {
                                CSS.setPropertyValue(element, "display", flexValue);
                            });
                        }

                        CSS.setPropertyValue(element, "display", opts.display);
                    }

                    /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
                    if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                        CSS.setPropertyValue(element, "visibility", opts.visibility);
                    }

                    /************************
                       Property Iteration
                    ************************/

                    /* For every element, iterate through each property. */
                    for (var property in tweensContainer) {
                        /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                        if (property !== "element") {
                            var tween = tweensContainer[property],
                                currentValue,
                                /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                                   on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
                                easing = Type.isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

                            /******************************
                               Current Value Calculation
                            ******************************/

                            /* If this is the last tick pass (if we've reached 100% completion for this tween),
                               ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                            if (percentComplete === 1) {
                                currentValue = tween.endValue;
                            /* Otherwise, calculate currentValue based on the current delta from startValue. */
                            } else {
                                var tweenDelta = tween.endValue - tween.startValue;
                                currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

                                /* If no value change is occurring, don't proceed with DOM updating. */
                                if (!firstTick && (currentValue === tween.currentValue)) {
                                    continue;
                                }
                            }

                            tween.currentValue = currentValue;

                            /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
                               it can be passed into the progress callback. */
                            if (property === "tween") {
                                tweenDummyValue = currentValue;
                            } else {
                                /******************
                                   Hooks: Part I
                                ******************/

                                /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                                   for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                                   rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                                   updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                                   subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                                if (CSS.Hooks.registered[property]) {
                                    var hookRoot = CSS.Hooks.getRoot(property),
                                        rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                                    if (rootPropertyValueCache) {
                                        tween.rootPropertyValue = rootPropertyValueCache;
                                    }
                                }

                                /*****************
                                    DOM Update
                                *****************/

                                /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                                /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                                var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                                                           property,
                                                                           tween.currentValue + (parseFloat(currentValue) === 0 ? "" : tween.unitType),
                                                                           tween.rootPropertyValue,
                                                                           tween.scrollData);

                                /*******************
                                   Hooks: Part II
                                *******************/

                                /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                                if (CSS.Hooks.registered[property]) {
                                    /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                                    if (CSS.Normalizations.registered[hookRoot]) {
                                        Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                                    } else {
                                        Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                                    }
                                }

                                /***************
                                   Transforms
                                ***************/

                                /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                                if (adjustedSetData[0] === "transform") {
                                    transformPropertyExists = true;
                                }

                            }
                        }
                    }

                    /****************
                        mobileHA
                    ****************/

                    /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                       It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                    if (opts.mobileHA) {
                        /* Don't set the null transform hack if we've already done so. */
                        if (Data(element).transformCache.translate3d === undefined) {
                            /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                            Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                            transformPropertyExists = true;
                        }
                    }

                    if (transformPropertyExists) {
                        CSS.flushTransformCache(element);
                    }
                }

                /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
                   Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
                if (opts.display !== undefined && opts.display !== "none") {
                    Velocity.State.calls[i][2].display = false;
                }
                if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                    Velocity.State.calls[i][2].visibility = false;
                }

                /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
                if (opts.progress) {
                    opts.progress.call(callContainer[1],
                                       callContainer[1],
                                       percentComplete,
                                       Math.max(0, (timeStart + opts.duration) - timeCurrent),
                                       timeStart,
                                       tweenDummyValue);
                }

                /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                if (percentComplete === 1) {
                    completeCall(i);
                }
            }
        }

        /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
        if (Velocity.State.isTicking) {
            ticker(tick);
        }
    }

    /**********************
        Call Completion
    **********************/

    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall (callIndex, isStopped) {
        /* Ensure the call exists. */
        if (!Velocity.State.calls[callIndex]) {
            return false;
        }

        /* Pull the metadata from the call. */
        var call = Velocity.State.calls[callIndex][0],
            elements = Velocity.State.calls[callIndex][1],
            opts = Velocity.State.calls[callIndex][2],
            resolver = Velocity.State.calls[callIndex][4];

        var remainingCallsExist = false;

        /*************************
           Element Finalization
        *************************/

        for (var i = 0, callLength = call.length; i < callLength; i++) {
            var element = call[i].element;

            /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
            /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
            /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
            if (!isStopped && !opts.loop) {
                if (opts.display === "none") {
                    CSS.setPropertyValue(element, "display", opts.display);
                }

                if (opts.visibility === "hidden") {
                    CSS.setPropertyValue(element, "visibility", opts.visibility);
                }
            }

            /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
               a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
               an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
               we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
               is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
            if (opts.loop !== true && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
                /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                if (Data(element)) {
                    Data(element).isAnimating = false;
                    /* Clear the element's rootPropertyValueCache, which will become stale. */
                    Data(element).rootPropertyValueCache = {};

                    var transformHAPropertyExists = false;
                    /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
                    $.each(CSS.Lists.transforms3D, function(i, transformName) {
                        var defaultValue = /^scale/.test(transformName) ? 1 : 0,
                            currentValue = Data(element).transformCache[transformName];

                        if (Data(element).transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                            transformHAPropertyExists = true;

                            delete Data(element).transformCache[transformName];
                        }
                    });

                    /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
                    if (opts.mobileHA) {
                        transformHAPropertyExists = true;
                        delete Data(element).transformCache.translate3d;
                    }

                    /* Flush the subproperty removals to the DOM. */
                    if (transformHAPropertyExists) {
                        CSS.flushTransformCache(element);
                    }

                    /* Remove the "velocity-animating" indicator class. */
                    CSS.Values.removeClass(element, "velocity-animating");
                }
            }

            /*********************
               Option: Complete
            *********************/

            /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
            /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
            if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
                /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                try {
                    opts.complete.call(elements, elements);
                } catch (error) {
                    setTimeout(function() { throw error; }, 1);
                }
            }

            /**********************
               Promise Resolving
            **********************/

            /* Note: Infinite loops don't return promises. */
            if (resolver && opts.loop !== true) {
                resolver(elements);
            }

            /****************************
               Option: Loop (Infinite)
            ****************************/

            if (Data(element) && opts.loop === true && !isStopped) {
                /* If a rotateX/Y/Z property is being animated to 360 deg with loop:true, swap tween start/end values to enable
                   continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
                $.each(Data(element).tweensContainer, function(propertyName, tweenContainer) {
                    if (/^rotate/.test(propertyName) && parseFloat(tweenContainer.endValue) === 360) {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 360;
                    }

                    if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 100;
                    }
                });

                Velocity(element, "reverse", { loop: true, delay: opts.delay });
            }

            /***************
               Dequeueing
            ***************/

            /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
               which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
               $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
            if (opts.queue !== false) {
                $.dequeue(element, opts.queue);
            }
        }

        /************************
           Calls Array Cleanup
        ************************/

        /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
          (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
        Velocity.State.calls[callIndex] = false;

        /* Iterate through the calls array to determine if this was the final in-progress animation.
           If so, set a flag to end ticking and clear the calls array. */
        for (var j = 0, callsLength = Velocity.State.calls.length; j < callsLength; j++) {
            if (Velocity.State.calls[j] !== false) {
                remainingCallsExist = true;

                break;
            }
        }

        if (remainingCallsExist === false) {
            /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
            Velocity.State.isTicking = false;

            /* Clear the calls array so that its length is reset. */
            delete Velocity.State.calls;
            Velocity.State.calls = [];
        }
    }

    /******************
        Frameworks
    ******************/

    /* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
       If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
       also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
       accessible beyond just a per-element scope. This master object contains an .animate() method, which is later assigned to $.fn
       (if jQuery or Zepto are present). Accordingly, Velocity can both act on wrapped DOM elements and stand alone for targeting raw DOM elements. */
    global.Velocity = Velocity;

    if (global !== window) {
        /* Assign the element function to Velocity's core animate() method. */
        global.fn.velocity = animate;
        /* Assign the object function's defaults to Velocity's global defaults object. */
        global.fn.velocity.defaults = Velocity.defaults;
    }

    /***********************
       Packaged Redirects
    ***********************/

    /* slideUp, slideDown */
    $.each([ "Down", "Up" ], function(i, direction) {
        Velocity.Redirects["slide" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                begin = opts.begin,
                complete = opts.complete,
                computedValues = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" },
                inlineValues = {};

            if (opts.display === undefined) {
                /* Show the element before slideDown begins and hide the element after slideUp completes. */
                /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
                opts.display = (direction === "Down" ? (Velocity.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
            }

            opts.begin = function() {
                /* If the user passed in a begin callback, fire it now. */
                begin && begin.call(elements, elements);

                /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
                for (var property in computedValues) {
                    inlineValues[property] = element.style[property];

                    /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
                       use forcefeeding to start from computed values and animate down to 0. */
                    var propertyValue = Velocity.CSS.getPropertyValue(element, property);
                    computedValues[property] = (direction === "Down") ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }

                /* Force vertical overflow content to clip so that sliding works as expected. */
                inlineValues.overflow = element.style.overflow;
                element.style.overflow = "hidden";
            }

            opts.complete = function() {
                /* Reset element to its pre-slide inline values once its slide animation is complete. */
                for (var property in inlineValues) {
                    element.style[property] = inlineValues[property];
                }

                /* If the user passed in a complete callback, fire it now. */
                complete && complete.call(elements, elements);
                promiseData && promiseData.resolver(elements);
            };

            Velocity(element, computedValues, opts);
        };
    });

    /* fadeIn, fadeOut */
    $.each([ "In", "Out" ], function(i, direction) {
        Velocity.Redirects["fade" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                propertiesMap = { opacity: (direction === "In") ? 1 : 0 },
                originalComplete = opts.complete;

            /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
               callbacks by firing them only when the final element has been reached. */
            if (elementsIndex !== elementsSize - 1) {
                opts.complete = opts.begin = null;
            } else {
                opts.complete = function() {
                    if (originalComplete) {
                        originalComplete.call(elements, elements);
                    }

                    promiseData && promiseData.resolver(elements);
                }
            }

            /* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
            /* Note: We allow users to pass in "null" to skip display setting altogether. */
            if (opts.display === undefined) {
                opts.display = (direction === "In" ? "auto" : "none");
            }

            Velocity(this, propertiesMap, opts);
        };
    });

    return Velocity;
}((window.jQuery || window.Zepto || window), window, document);
}));

/******************
   Known Issues
******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
},{}],2:[function(require,module,exports){
'use strict';

module.exports = function about() {};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function contact() {};

},{}],4:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var addClass = require('./helpers/add-class');
var removeClass = require('./helpers/remove-class');
var velocity = require('velocity-animate');
var style = require('./style');

function pageController(args) {
  var navlink = args.navlink;
  var controllers = args.controllers;

  // change url path name
  var page = navlink === 'home' ? '/' : navlink + '.html';

  if (history.pushState) {
    history.pushState(null, null, page);
  } else {
    location.hash = '' + navlink;
  }

  // execute page script
  controllers[navlink]();
}

function parallaxBackgroundSize(navlink) {
  var parallax = [].concat(_toConsumableArray($('#ov-' + navlink + '-main [data-uk-parallax]')));

  parallax.forEach(function (p) {
    var dataset = JSON.parse(p.dataset.ukParallax);

    if (!isNaN(dataset['bg'])) {

      var _dataset = JSON.parse(p.dataset.ukParallax);
      var diff = parseInt(_dataset['bg']) * -1;
      var w = p.offsetWidth;
      var h = p.offsetHeight;
      var ratio = h / w;
      var width = w + diff * ratio;
      var height = h + diff;

      p.style.backgroundSize = width + 'px ' + height + 'px';
    }
  });
}

function onNavItemClick(controllers) {
  $('.ov-nav-list>li').click(function (event) {
    event.preventDefault();
    var currentTarget = event.currentTarget;
    var navlink = currentTarget.dataset.navlink;
    var body = $('body');
    var backgroundDuration = 280;

    // set active link
    $('.ov-nav-list>li').each(function () {
      removeClass(this, 'uk-active');
    });

    addClass(currentTarget, 'uk-active');

    // scroll to top
    body.scrollTop('0');

    // remove old background
    $('.ov-background').remove();

    // add new background
    body.prepend('<div class="ov-background ov-' + navlink + '" data-pagebg=\'' + navlink + '\'></div>');

    // animate background
    $('.ov-background.ov-' + navlink).css({
      height: 0,
      left: event.pageX,
      opacity: 0.5,
      width: 0
    }).velocity({
      height: ['100vh', [1, 0.1, 0.4, 0.93]],
      left: 0,
      width: '100%',
      opacity: 1
    }, backgroundDuration);

    // load controller
    pageController({
      navlink: navlink,
      controllers: controllers
    });

    // add page class to body
    var oldPage = body[0].className;

    body.removeClass().addClass('ov-' + navlink);

    setTimeout(function () {
      $('#ov-' + navlink + '-main').velocity({ opacity: 1 });
    }, backgroundDuration);

    // change page backound color
    setTimeout(function () {
      $('html').css({ backgroundColor: style[navlink].backgroundColor });
    }, 800);

    // Set parallax background images sizes
    parallaxBackgroundSize(navlink);
  });
}

function onNavScroll() {
  $(window).scroll(function () {
    var BodyScrollFromTop = $('body').scrollTop();
    var navbar = $('.ov-navbar');

    if (BodyScrollFromTop < 50) {
      navbar.css({ background: 'rgba(33, 33, 33, 0.5)' });
    } else {
      navbar.css({ background: 'rgba(33, 33, 33, 0.8)' });
    }
  });
}

module.exports = function common(controllers, page) {
  parallaxBackgroundSize(page);
  $('.ov-nav-list>li.' + page).addClass('uk-active');

  onNavItemClick(controllers);
  onNavScroll();

  // stop landing from being resized on mobile due to vieport resizing;
  var viewport = $(window).height();
  $('ov-landing').css({ height: viewport });
};

},{"./helpers/add-class":6,"./helpers/remove-class":7,"./style":10,"velocity-animate":1}],5:[function(require,module,exports){
'use strict';

module.exports = function contact() {};

},{}],6:[function(require,module,exports){
'use strict';
'us strict';

module.exports = function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ' ' + className;
  }

  return element;
};

},{}],7:[function(require,module,exports){
'use strict';

module.exports = function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  return element;
};

},{}],8:[function(require,module,exports){
'use strict';

function headlineText() {
  var maxfontsize = window.innerHeight < 280 ? 50 : 100;

  $('#ov-landing-headline').bigtext({
    maxfontsize: maxfontsize
  });
};

module.exports = function home() {
  headlineText();
  $('.ov-landing').css('height', $(window).height());
};

},{}],9:[function(require,module,exports){
'use strict';

// uikit modules

require('../../vendor/uikit/js/uikit');
require('../../vendor/uikit/js/components/parallax');

/*
* My scripts
 */
var common = require('./common');
var home = require('./home');
var about = require('./about');
var work = require('./work');
var contact = require('./contact');
var blog = require('./blog');

$(document).ready(function () {

  var path = window.location.pathname;
  var page = path === '/' ? 'home' : path.match(/\w+/g)[0];

  // set up initial events
  var controllers = {
    home: home,
    about: about,
    work: work,
    contact: contact,
    blog: blog
  };

  common(controllers, page);

  // set initail page
  $('#ov-' + page + '-main').css({ opacity: 1 });

  switch (path) {
    case '/':
      home();
      break;
    case '/about.html':
      about();
      break;
    case '/work.html':
      work();
      break;
    case '/contact.html':
      contact();
      break;
    case '/blog.html':
      contact();
    default:
      home();
  }
});

},{"../../vendor/uikit/js/components/parallax":12,"../../vendor/uikit/js/uikit":13,"./about":2,"./blog":3,"./common":4,"./contact":5,"./home":8,"./work":11}],10:[function(require,module,exports){
'use strict';

module.exports = {
  home: {
    backgroundColor: '#0288D1'
  },

  about: {
    backgroundColor: '#388E3C'
  },

  work: {
    backgroundColor: '#673AB7'
  },

  contact: {
    backgroundColor: '#D32F2F'
  },

  blog: {
    backgroundColor: '#E5E5E5'
  }
};

},{}],11:[function(require,module,exports){
'use strict';

function portfolioItemsScroll(items) {
  $(window).scroll(function () {
    var BodyScrollFromTop = $('body, html, document').scrollTop() != 0 ? $('body, html, document').scrollTop() : $('body').scrollTop();
    var viewportHeight = $(window).height();
    var itemHeightDesktop = 290;

    items.each(function (i) {
      var offsetUp = 0;
      var offsetDown = 0;

      if (itemHeightDesktop !== this.offsetHeight) {
        offsetUp = 100;
        offsetDown = -100;
      }

      var scrollUptrigger = BodyScrollFromTop + viewportHeight / 2 + offsetUp;
      var scrollDowntrigger = BodyScrollFromTop + offsetDown;

      if (scrollUptrigger <= this.offsetTop || scrollDowntrigger >= this.offsetTop) {
        $(this).removeClass('ov-portfolio-item-inView');
        $(this).find('.ov-portfolio-item-overlay').css({ opacity: 0.4 });
      } else {
        $(this).addClass('ov-portfolio-item-inView');
        $(this).find('.ov-portfolio-item-overlay').css({ opacity: 0 });
      }
    });
  });
}

function headlineTextResize() {
  var maxfontsize = window.innerHeight < 280 ? 50 : 80;

  $('#ov-headlineText').bigtext({
    maxfontsize: maxfontsize
  });
}

module.exports = function work() {
  var portfolioItems = $('.ov-portfolio-item');
  var firstItem = portfolioItems[0];

  headlineTextResize();

  $(firstItem).find('.ov-portfolio-item-overlay').css({ opacity: 0 });
  $(firstItem).addClass('ov-portfolio-item-inView');
  portfolioItemsScroll(portfolioItems);
};

},{}],12:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.24.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-parallax", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var parallaxes = [],
        supports3d = false,
        scrolltop = 0,
        wh = window.innerHeight,
        checkParallaxes = function checkParallaxes() {

        scrolltop = UI.$win.scrollTop();

        window.requestAnimationFrame(function () {
            for (var i = 0; i < parallaxes.length; i++) {
                parallaxes[i].process();
            }
        });
    };

    UI.component('parallax', {

        defaults: {
            velocity: 0.5,
            target: false,
            viewport: false,
            media: false
        },

        boot: function boot() {

            supports3d = function () {

                var el = document.createElement('div'),
                    has3d,
                    transforms = {
                    'WebkitTransform': '-webkit-transform',
                    'MSTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'Transform': 'transform'
                };

                // Add it to the body to get the computed style.
                document.body.insertBefore(el, null);

                for (var t in transforms) {
                    if (el.style[t] !== undefined) {
                        el.style[t] = "translate3d(1px,1px,1px)";
                        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                    }
                }

                document.body.removeChild(el);

                return has3d !== undefined && has3d.length > 0 && has3d !== "none";
            }();

            // listen to scroll and resize
            UI.$doc.on("scrolling.uk.document", checkParallaxes);
            UI.$win.on("load resize orientationchange", UI.Utils.debounce(function () {
                wh = window.innerHeight;
                checkParallaxes();
            }, 50));

            // init code
            UI.ready(function (context) {

                UI.$('[data-uk-parallax]', context).each(function () {

                    var parallax = UI.$(this);

                    if (!parallax.data("parallax")) {
                        UI.parallax(parallax, UI.Utils.options(parallax.attr("data-uk-parallax")));
                    }
                });
            });
        },

        init: function init() {

            this.base = this.options.target ? UI.$(this.options.target) : this.element;
            this.props = {};
            this.velocity = this.options.velocity || 1;

            var reserved = ['target', 'velocity', 'viewport', 'plugins', 'media'];

            Object.keys(this.options).forEach(function (prop) {

                if (reserved.indexOf(prop) !== -1) {
                    return;
                }

                var start,
                    end,
                    dir,
                    diff,
                    startend = String(this.options[prop]).split(',');

                if (prop.match(/color/i)) {
                    start = startend[1] ? startend[0] : this._getStartValue(prop), end = startend[1] ? startend[1] : startend[0];

                    if (!start) {
                        start = 'rgba(255,255,255,0)';
                    }
                } else {
                    start = parseFloat(startend[1] ? startend[0] : this._getStartValue(prop)), end = parseFloat(startend[1] ? startend[1] : startend[0]);
                    diff = start < end ? end - start : start - end;
                    dir = start < end ? 1 : -1;
                }

                this.props[prop] = { 'start': start, 'end': end, 'dir': dir, 'diff': diff };
            }.bind(this));

            parallaxes.push(this);
        },

        process: function process() {

            if (this.options.media) {

                switch (_typeof(this.options.media)) {
                    case 'number':
                        if (window.innerWidth < this.options.media) {
                            return false;
                        }
                        break;
                    case 'string':
                        if (window.matchMedia && !window.matchMedia(this.options.media).matches) {
                            return false;
                        }
                        break;
                }
            }

            var percent = this.percentageInViewport();

            if (this.options.viewport !== false) {
                percent = this.options.viewport === 0 ? 1 : percent / this.options.viewport;
            }

            this.update(percent);
        },

        percentageInViewport: function percentageInViewport() {

            var top = this.base.offset().top,
                height = this.base.outerHeight(),
                distance,
                percentage,
                percent;

            if (top > scrolltop + wh) {
                percent = 0;
            } else if (top + height < scrolltop) {
                percent = 1;
            } else {

                if (top + height < wh) {

                    percent = (scrolltop < wh ? scrolltop : scrolltop - wh) / (top + height);
                } else {

                    distance = scrolltop + wh - top;
                    percentage = Math.round(distance / ((wh + height) / 100));
                    percent = percentage / 100;
                }
            }

            return percent;
        },

        update: function update(percent) {

            var $this = this,
                css = { 'transform': '' },
                compercent = percent * (1 - (this.velocity - this.velocity * percent)),
                opts,
                val;

            if (compercent < 0) compercent = 0;
            if (compercent > 1) compercent = 1;

            if (this._percent !== undefined && this._percent == compercent) {
                return;
            }

            Object.keys(this.props).forEach(function (prop) {

                opts = this.props[prop];

                if (percent === 0) {
                    val = opts.start;
                } else if (percent === 1) {
                    val = opts.end;
                } else if (opts.diff !== undefined) {
                    val = opts.start + opts.diff * compercent * opts.dir;
                }

                if ((prop == 'bg' || prop == 'bgp') && !this._bgcover) {
                    this._bgcover = initBgImageParallax(this, prop, opts);
                }

                switch (prop) {

                    // transforms
                    case "x":
                        css.transform += supports3d ? ' translate3d(' + val + 'px, 0, 0)' : ' translateX(' + val + 'px)';
                        break;
                    case "xp":
                        css.transform += supports3d ? ' translate3d(' + val + '%, 0, 0)' : ' translateX(' + val + '%)';
                        break;
                    case "y":
                        css.transform += supports3d ? ' translate3d(0, ' + val + 'px, 0)' : ' translateY(' + val + 'px)';
                        break;
                    case "yp":
                        css.transform += supports3d ? ' translate3d(0, ' + val + '%, 0)' : ' translateY(' + val + '%)';
                        break;
                    case "rotate":
                        css.transform += ' rotate(' + val + 'deg)';
                        break;
                    case "scale":
                        css.transform += ' scale(' + val + ')';
                        break;

                    // bg image
                    case "bg":

                        // don't move if image height is too small
                        // if ($this.element.data('bgsize') && ($this.element.data('bgsize').h + val - window.innerHeight) < 0) {
                        //     break;
                        // }

                        css['background-position'] = '50% ' + val + 'px';
                        break;
                    case "bgp":
                        css['background-position'] = '50% ' + val + '%';
                        break;

                    // color
                    case "color":
                    case "background-color":
                    case "border-color":
                        css[prop] = calcColor(opts.start, opts.end, compercent);
                        break;

                    default:
                        css[prop] = val;
                        break;
                }
            }.bind(this));

            this.element.css(css);

            this._percent = compercent;
        },

        _getStartValue: function _getStartValue(prop) {

            var value = 0;

            switch (prop) {
                case 'scale':
                    value = 1;
                    break;
                default:
                    value = this.element.css(prop);
            }

            return value || 0;
        }

    });

    // helper

    function initBgImageParallax(obj, prop, opts) {

        var img = new Image(),
            url,
            element,
            size,
            check,
            ratio,
            width,
            height;

        element = obj.element.css({ 'background-size': 'cover', 'background-repeat': 'no-repeat' });
        url = element.css('background-image').replace(/^url\(/g, '').replace(/\)$/g, '').replace(/("|')/g, '');
        check = function check() {

            var w = element.width(),
                h = element.height(),
                extra = prop == 'bg' ? opts.diff : opts.diff / 100 * h;

            h += extra;
            w += Math.ceil(extra * ratio);

            if (w - extra > size.w && h < size.h) {
                return obj.element.css({ 'background-size': '' });
            }

            // if element height < parent height (gap underneath)
            if (w / ratio < h) {

                width = Math.ceil(h * ratio);
                height = h;

                if (h > window.innerHeight) {
                    width = width * 1.2;
                    height = height * 1.2;
                }

                // element width < parent width (gap to right)
            } else {

                    width = w;
                    height = Math.ceil(w / ratio);
                }

            element.css({ 'background-size': width + 'px ' + height + 'px' }).data('bgsize', { w: width, h: height });
        };

        img.onerror = function () {
            // image url doesn't exist
        };

        img.onload = function () {
            size = { w: img.width, h: img.height };
            ratio = img.width / img.height;

            UI.$win.on("load resize orientationchange", UI.Utils.debounce(function () {
                check();
            }, 50));

            check();
        };

        img.src = url;

        return true;
    }

    // Some named colors to work with, added by Bradley Ayers
    // From Interface by Stefan Petre
    // http://interface.eyecon.ro/
    var colors = {
        'black': [0, 0, 0, 1],
        'blue': [0, 0, 255, 1],
        'brown': [165, 42, 42, 1],
        'cyan': [0, 255, 255, 1],
        'fuchsia': [255, 0, 255, 1],
        'gold': [255, 215, 0, 1],
        'green': [0, 128, 0, 1],
        'indigo': [75, 0, 130, 1],
        'khaki': [240, 230, 140, 1],
        'lime': [0, 255, 0, 1],
        'magenta': [255, 0, 255, 1],
        'maroon': [128, 0, 0, 1],
        'navy': [0, 0, 128, 1],
        'olive': [128, 128, 0, 1],
        'orange': [255, 165, 0, 1],
        'pink': [255, 192, 203, 1],
        'purple': [128, 0, 128, 1],
        'violet': [128, 0, 128, 1],
        'red': [255, 0, 0, 1],
        'silver': [192, 192, 192, 1],
        'white': [255, 255, 255, 1],
        'yellow': [255, 255, 0, 1],
        'transparent': [255, 255, 255, 0]
    };

    function calcColor(start, end, pos) {

        start = parseColor(start);
        end = parseColor(end);
        pos = pos || 0;

        return calculateColor(start, end, pos);
    }

    /**!
     * @preserve Color animation 1.6.0
     * http://www.bitstorm.org/jquery/color-animation/
     * Copyright 2011, 2013 Edwin Martin <edwin@bitstorm.org>
     * Released under the MIT and GPL licenses.
     */

    // Calculate an in-between color. Returns "#aabbcc"-like string.
    function calculateColor(begin, end, pos) {
        var color = 'rgba(' + parseInt(begin[0] + pos * (end[0] - begin[0]), 10) + ',' + parseInt(begin[1] + pos * (end[1] - begin[1]), 10) + ',' + parseInt(begin[2] + pos * (end[2] - begin[2]), 10) + ',' + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);

        color += ')';
        return color;
    }

    // Parse an CSS-syntax color. Outputs an array [r, g, b]
    function parseColor(color) {

        var match, quadruplet;

        // Match #aabbcc
        if (match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(color)) {
            quadruplet = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];

            // Match #abc
        } else if (match = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(color)) {
                quadruplet = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];

                // Match rgb(n, n, n)
            } else if (match = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
                    quadruplet = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 1];
                } else if (match = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(color)) {
                    quadruplet = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), parseFloat(match[4])];

                    // No browser returns rgb(n%, n%, n%), so little reason to support this format.
                } else {
                        quadruplet = colors[color] || [255, 255, 255, 0];
                    }
        return quadruplet;
    }

    return UI.parallax;
});

},{}],13:[function(require,module,exports){
"use strict";var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;}; /*! UIkit 2.24.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */(function(core){if(typeof define=="function"&&define.amd){ // AMD
define("uikit",function(){var uikit=window.UIkit||core(window,window.jQuery,window.document);uikit.load=function(res,req,onload,config){var resources=res.split(','),load=[],i,base=(config.config&&config.config.uikit&&config.config.uikit.base?config.config.uikit.base:"").replace(/\/+$/g,"");if(!base){throw new Error("Please define base path to UIkit in the requirejs config.");}for(i=0;i<resources.length;i+=1){var resource=resources[i].replace(/\./g,'/');load.push(base+'/components/'+resource);}req(load,function(){onload(uikit);});};return uikit;});}if(!window.jQuery){throw new Error("UIkit requires jQuery");}if(window&&window.jQuery){core(window,window.jQuery,window.document);}})(function(global,$,doc){"use strict";var UI={},_UI=global.UIkit?Object.create(global.UIkit):undefined;UI.version='2.24.3';UI.noConflict=function(){ // restore UIkit version
if(_UI){global.UIkit=_UI;$.UIkit=_UI;$.fn.uk=_UI.fn;}return UI;};UI.prefix=function(str){return str;}; // cache jQuery
UI.$=$;UI.$doc=UI.$(document);UI.$win=UI.$(window);UI.$html=UI.$('html');UI.support={};UI.support.transition=function(){var transitionEnd=function(){var element=doc.body||doc.documentElement,transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'},name;for(name in transEndEventNames){if(element.style[name]!==undefined)return transEndEventNames[name];}}();return transitionEnd&&{end:transitionEnd};}();UI.support.animation=function(){var animationEnd=function(){var element=doc.body||doc.documentElement,animEndEventNames={WebkitAnimation:'webkitAnimationEnd',MozAnimation:'animationend',OAnimation:'oAnimationEnd oanimationend',animation:'animationend'},name;for(name in animEndEventNames){if(element.style[name]!==undefined)return animEndEventNames[name];}}();return animationEnd&&{end:animationEnd};}(); // requestAnimationFrame polyfill
//https://github.com/darius/requestAnimationFrame
(function(){Date.now=Date.now||function(){return new Date().getTime();};var vendors=['webkit','moz'];for(var i=0;i<vendors.length&&!window.requestAnimationFrame;++i){var vp=vendors[i];window.requestAnimationFrame=window[vp+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vp+'CancelAnimationFrame']||window[vp+'CancelRequestAnimationFrame'];}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
||!window.requestAnimationFrame||!window.cancelAnimationFrame){var lastTime=0;window.requestAnimationFrame=function(callback){var now=Date.now();var nextTime=Math.max(lastTime+16,now);return setTimeout(function(){callback(lastTime=nextTime);},nextTime-now);};window.cancelAnimationFrame=clearTimeout;}})();UI.support.touch='ontouchstart' in document||global.DocumentTouch&&document instanceof global.DocumentTouch||global.navigator.msPointerEnabled&&global.navigator.msMaxTouchPoints>0|| //IE 10
global.navigator.pointerEnabled&&global.navigator.maxTouchPoints>0|| //IE >=11
false;UI.support.mutationobserver=global.MutationObserver||global.WebKitMutationObserver||null;UI.Utils={};UI.Utils.isFullscreen=function(){return document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement||document.fullscreenElement||false;};UI.Utils.str2json=function(str,notevil){try{if(notevil){return JSON.parse(str // wrap keys without quote with valid double quote
.replace(/([\$\w]+)\s*:/g,function(_,$1){return '"'+$1+'":';}) // replacing single quote wrapped ones to double quote
.replace(/'([^']+)'/g,function(_,$1){return '"'+$1+'"';}));}else {return new Function("","var json = "+str+"; return JSON.parse(JSON.stringify(json));")();}}catch(e){return false;}};UI.Utils.debounce=function(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;var later=function later(){timeout=null;if(!immediate)func.apply(context,args);};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow)func.apply(context,args);};};UI.Utils.removeCssRules=function(selectorRegEx){var idx,idxs,stylesheet,_i,_j,_k,_len,_len1,_len2,_ref;if(!selectorRegEx)return;setTimeout(function(){try{_ref=document.styleSheets;for(_i=0,_len=_ref.length;_i<_len;_i++){stylesheet=_ref[_i];idxs=[];stylesheet.cssRules=stylesheet.cssRules;for(idx=_j=0,_len1=stylesheet.cssRules.length;_j<_len1;idx=++_j){if(stylesheet.cssRules[idx].type===CSSRule.STYLE_RULE&&selectorRegEx.test(stylesheet.cssRules[idx].selectorText)){idxs.unshift(idx);}}for(_k=0,_len2=idxs.length;_k<_len2;_k++){stylesheet.deleteRule(idxs[_k]);}}}catch(_error){}},0);};UI.Utils.isInView=function(element,options){var $element=$(element);if(!$element.is(':visible')){return false;}var window_left=UI.$win.scrollLeft(),window_top=UI.$win.scrollTop(),offset=$element.offset(),left=offset.left,top=offset.top;options=$.extend({topoffset:0,leftoffset:0},options);if(top+$element.height()>=window_top&&top-options.topoffset<=window_top+UI.$win.height()&&left+$element.width()>=window_left&&left-options.leftoffset<=window_left+UI.$win.width()){return true;}else {return false;}};UI.Utils.checkDisplay=function(context,initanimation){var elements=UI.$('[data-uk-margin], [data-uk-grid-match], [data-uk-grid-margin], [data-uk-check-display]',context||document),animated;if(context&&!elements.length){elements=$(context);}elements.trigger('display.uk.check'); // fix firefox / IE animations
if(initanimation){if(typeof initanimation!='string'){initanimation='[class*="uk-animation-"]';}elements.find(initanimation).each(function(){var ele=UI.$(this),cls=ele.attr('class'),anim=cls.match(/uk\-animation\-(.+)/);ele.removeClass(anim[0]).width();ele.addClass(anim[0]);});}return elements;};UI.Utils.options=function(string){if($.type(string)!='string')return string;if(string.indexOf(':')!=-1&&string.trim().substr(-1)!='}'){string='{'+string+'}';}var start=string?string.indexOf("{"):-1,options={};if(start!=-1){try{options=UI.Utils.str2json(string.substr(start));}catch(e){}}return options;};UI.Utils.animate=function(element,cls){var d=$.Deferred();element=UI.$(element);cls=cls;element.css('display','none').addClass(cls).one(UI.support.animation.end,function(){element.removeClass(cls);d.resolve();}).width();element.css('display','');return d.promise();};UI.Utils.uid=function(prefix){return (prefix||'id')+new Date().getTime()+"RAND"+Math.ceil(Math.random()*100000);};UI.Utils.template=function(str,data){var tokens=str.replace(/\n/g,'\\n').replace(/\{\{\{\s*(.+?)\s*\}\}\}/g,"{{!$1}}").split(/(\{\{\s*(.+?)\s*\}\})/g),i=0,toc,cmd,prop,val,fn,output=[],openblocks=0;while(i<tokens.length){toc=tokens[i];if(toc.match(/\{\{\s*(.+?)\s*\}\}/)){i=i+1;toc=tokens[i];cmd=toc[0];prop=toc.substring(toc.match(/^(\^|\#|\!|\~|\:)/)?1:0);switch(cmd){case '~':output.push("for(var $i=0;$i<"+prop+".length;$i++) { var $item = "+prop+"[$i];");openblocks++;break;case ':':output.push("for(var $key in "+prop+") { var $val = "+prop+"[$key];");openblocks++;break;case '#':output.push("if("+prop+") {");openblocks++;break;case '^':output.push("if(!"+prop+") {");openblocks++;break;case '/':output.push("}");openblocks--;break;case '!':output.push("__ret.push("+prop+");");break;default:output.push("__ret.push(escape("+prop+"));");break;}}else {output.push("__ret.push('"+toc.replace(/\'/g,"\\'")+"');");}i=i+1;}fn=new Function('$data',['var __ret = [];','try {','with($data){',!openblocks?output.join(''):'__ret = ["Not all blocks are closed correctly."]','};','}catch(e){__ret = [e.message];}','return __ret.join("").replace(/\\n\\n/g, "\\n");',"function escape(html) { return String(html).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}"].join("\n"));return data?fn(data):fn;};UI.Utils.events={};UI.Utils.events.click=UI.support.touch?'tap':'click';global.UIkit=UI; // deprecated
UI.fn=function(command,options){var args=arguments,cmd=command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i),component=cmd[1],method=cmd[2];if(!UI[component]){$.error("UIkit component ["+component+"] does not exist.");return this;}return this.each(function(){var $this=$(this),data=$this.data(component);if(!data)$this.data(component,data=UI[component](this,method?undefined:options));if(method)data[method].apply(data,Array.prototype.slice.call(args,1));});};$.UIkit=UI;$.fn.uk=UI.fn;UI.langdirection=UI.$html.attr("dir")=="rtl"?"right":"left";UI.components={};UI.component=function(name,def){var fn=function fn(element,options){var $this=this;this.UIkit=UI;this.element=element?UI.$(element):null;this.options=$.extend(true,{},this.defaults,options);this.plugins={};if(this.element){this.element.data(name,this);}this.init();(this.options.plugins.length?this.options.plugins:Object.keys(fn.plugins)).forEach(function(plugin){if(fn.plugins[plugin].init){fn.plugins[plugin].init($this);$this.plugins[plugin]=true;}});this.trigger('init.uk.component',[name,this]);return this;};fn.plugins={};$.extend(true,fn.prototype,{defaults:{plugins:[]},boot:function boot(){},init:function init(){},on:function on(a1,a2,a3){return UI.$(this.element||this).on(a1,a2,a3);},one:function one(a1,a2,a3){return UI.$(this.element||this).one(a1,a2,a3);},off:function off(evt){return UI.$(this.element||this).off(evt);},trigger:function trigger(evt,params){return UI.$(this.element||this).trigger(evt,params);},find:function find(selector){return UI.$(this.element?this.element:[]).find(selector);},proxy:function proxy(obj,methods){var $this=this;methods.split(' ').forEach(function(method){if(!$this[method])$this[method]=function(){return obj[method].apply(obj,arguments);};});},mixin:function mixin(obj,methods){var $this=this;methods.split(' ').forEach(function(method){if(!$this[method])$this[method]=obj[method].bind($this);});},option:function option(){if(arguments.length==1){return this.options[arguments[0]]||undefined;}else if(arguments.length==2){this.options[arguments[0]]=arguments[1];}}},def);this.components[name]=fn;this[name]=function(){var element,options;if(arguments.length){switch(arguments.length){case 1:if(typeof arguments[0]==="string"||arguments[0].nodeType||arguments[0] instanceof jQuery){element=$(arguments[0]);}else {options=arguments[0];}break;case 2:element=$(arguments[0]);options=arguments[1];break;}}if(element&&element.data(name)){return element.data(name);}return new UI.components[name](element,options);};if(UI.domready){UI.component.boot(name);}return fn;};UI.plugin=function(component,name,def){this.components[component].plugins[name]=def;};UI.component.boot=function(name){if(UI.components[name].prototype&&UI.components[name].prototype.boot&&!UI.components[name].booted){UI.components[name].prototype.boot.apply(UI,[]);UI.components[name].booted=true;}};UI.component.bootComponents=function(){for(var component in UI.components){UI.component.boot(component);}}; // DOM mutation save ready helper function
UI.domObservers=[];UI.domready=false;UI.ready=function(fn){UI.domObservers.push(fn);if(UI.domready){fn(document);}};UI.on=function(a1,a2,a3){if(a1&&a1.indexOf('ready.uk.dom')>-1&&UI.domready){a2.apply(UI.$doc);}return UI.$doc.on(a1,a2,a3);};UI.one=function(a1,a2,a3){if(a1&&a1.indexOf('ready.uk.dom')>-1&&UI.domready){a2.apply(UI.$doc);return UI.$doc;}return UI.$doc.one(a1,a2,a3);};UI.trigger=function(evt,params){return UI.$doc.trigger(evt,params);};UI.domObserve=function(selector,fn){if(!UI.support.mutationobserver)return;fn=fn||function(){};UI.$(selector).each(function(){var element=this,$element=UI.$(element);if($element.data('observer')){return;}try{var observer=new UI.support.mutationobserver(UI.Utils.debounce(function(mutations){fn.apply(element,[]);$element.trigger('changed.uk.dom');},50)); // pass in the target node, as well as the observer options
observer.observe(element,{childList:true,subtree:true});$element.data('observer',observer);}catch(e){}});};UI.init=function(root){root=root||document;UI.domObservers.forEach(function(fn){fn(root);});};UI.on('domready.uk.dom',function(){UI.init();if(UI.domready)UI.Utils.checkDisplay();});document.addEventListener('DOMContentLoaded',function(){var domReady=function domReady(){UI.$body=UI.$('body');UI.ready(function(context){UI.domObserve('[data-uk-observe]');});UI.on('changed.uk.dom',function(e){UI.init(e.target);UI.Utils.checkDisplay(e.target);});UI.trigger('beforeready.uk.dom');UI.component.bootComponents(); // custom scroll observer
requestAnimationFrame(function(){var memory={x:window.pageXOffset,y:window.pageYOffset},dir;var fn=function fn(){if(memory.x!=window.pageXOffset||memory.y!=window.pageYOffset){dir={x:0,y:0};if(window.pageXOffset!=memory.x)dir.x=window.pageXOffset>memory.x?1:-1;if(window.pageYOffset!=memory.y)dir.y=window.pageYOffset>memory.y?1:-1;memory={"dir":dir,"x":window.pageXOffset,"y":window.pageYOffset};UI.$doc.trigger('scrolling.uk.document',[memory]);}requestAnimationFrame(fn);};if(UI.support.touch){UI.$html.on('touchmove touchend MSPointerMove MSPointerUp pointermove pointerup',fn);}if(memory.x||memory.y)fn();return fn;}()); // run component init functions on dom
UI.trigger('domready.uk.dom');if(UI.support.touch){ // remove css hover rules for touch devices
// UI.Utils.removeCssRules(/\.uk-(?!navbar).*:hover/);
// viewport unit fix for uk-height-viewport - should be fixed in iOS 8
if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)){UI.$win.on('load orientationchange resize',UI.Utils.debounce(function(){var fn=function fn(){$('.uk-height-viewport').css('height',window.innerHeight);return fn;};return fn();}(),100));}}UI.trigger('afterready.uk.dom'); // mark that domready is left behind
UI.domready=true;};if(document.readyState=='complete'||document.readyState=='interactive'){setTimeout(domReady);}return domReady;}()); // add touch identifier class
UI.$html.addClass(UI.support.touch?"uk-touch":"uk-notouch"); // add uk-hover class on tap to support overlays on touch devices
if(UI.support.touch){var hoverset=false,exclude,hovercls='uk-hover',selector='.uk-overlay, .uk-overlay-hover, .uk-overlay-toggle, .uk-animation-hover, .uk-has-hover';UI.$html.on('mouseenter touchstart MSPointerDown pointerdown',selector,function(){if(hoverset)$('.'+hovercls).removeClass(hovercls);hoverset=$(this).addClass(hovercls);}).on('mouseleave touchend MSPointerUp pointerup',function(e){exclude=$(e.target).parents(selector);if(hoverset){hoverset.not(exclude).removeClass(hovercls);}});}return UI;}); //  Based on Zeptos touch.js
//  https://raw.github.com/madrobby/zepto/master/src/touch.js
//  Zepto.js may be freely distributed under the MIT license.
;(function($){if($.fn.swipeLeft){return;}var touch={},touchTimeout,tapTimeout,swipeTimeout,longTapTimeout,longTapDelay=750,gesture;function swipeDirection(x1,x2,y1,y2){return Math.abs(x1-x2)>=Math.abs(y1-y2)?x1-x2>0?'Left':'Right':y1-y2>0?'Up':'Down';}function longTap(){longTapTimeout=null;if(touch.last){if(touch.el!==undefined)touch.el.trigger('longTap');touch={};}}function cancelLongTap(){if(longTapTimeout)clearTimeout(longTapTimeout);longTapTimeout=null;}function cancelAll(){if(touchTimeout)clearTimeout(touchTimeout);if(tapTimeout)clearTimeout(tapTimeout);if(swipeTimeout)clearTimeout(swipeTimeout);if(longTapTimeout)clearTimeout(longTapTimeout);touchTimeout=tapTimeout=swipeTimeout=longTapTimeout=null;touch={};}function isPrimaryTouch(event){return event.pointerType==event.MSPOINTER_TYPE_TOUCH&&event.isPrimary;}$(function(){var now,delta,deltaX=0,deltaY=0,firstTouch;if('MSGesture' in window){gesture=new MSGesture();gesture.target=document.body;}$(document).on('MSGestureEnd gestureend',function(e){var swipeDirectionFromVelocity=e.originalEvent.velocityX>1?'Right':e.originalEvent.velocityX<-1?'Left':e.originalEvent.velocityY>1?'Down':e.originalEvent.velocityY<-1?'Up':null;if(swipeDirectionFromVelocity&&touch.el!==undefined){touch.el.trigger('swipe');touch.el.trigger('swipe'+swipeDirectionFromVelocity);}}) // MSPointerDown: for IE10
// pointerdown: for IE11
.on('touchstart MSPointerDown pointerdown',function(e){if(e.type=='MSPointerDown'&&!isPrimaryTouch(e.originalEvent))return;firstTouch=e.type=='MSPointerDown'||e.type=='pointerdown'?e:e.originalEvent.touches[0];now=Date.now();delta=now-(touch.last||now);touch.el=$('tagName' in firstTouch.target?firstTouch.target:firstTouch.target.parentNode);if(touchTimeout)clearTimeout(touchTimeout);touch.x1=firstTouch.pageX;touch.y1=firstTouch.pageY;if(delta>0&&delta<=250)touch.isDoubleTap=true;touch.last=now;longTapTimeout=setTimeout(longTap,longTapDelay); // adds the current touch contact for IE gesture recognition
if(gesture&&(e.type=='MSPointerDown'||e.type=='pointerdown'||e.type=='touchstart')){gesture.addPointer(e.originalEvent.pointerId);}}) // MSPointerMove: for IE10
// pointermove: for IE11
.on('touchmove MSPointerMove pointermove',function(e){if(e.type=='MSPointerMove'&&!isPrimaryTouch(e.originalEvent))return;firstTouch=e.type=='MSPointerMove'||e.type=='pointermove'?e:e.originalEvent.touches[0];cancelLongTap();touch.x2=firstTouch.pageX;touch.y2=firstTouch.pageY;deltaX+=Math.abs(touch.x1-touch.x2);deltaY+=Math.abs(touch.y1-touch.y2);}) // MSPointerUp: for IE10
// pointerup: for IE11
.on('touchend MSPointerUp pointerup',function(e){if(e.type=='MSPointerUp'&&!isPrimaryTouch(e.originalEvent))return;cancelLongTap(); // swipe
if(touch.x2&&Math.abs(touch.x1-touch.x2)>30||touch.y2&&Math.abs(touch.y1-touch.y2)>30){swipeTimeout=setTimeout(function(){if(touch.el!==undefined){touch.el.trigger('swipe');touch.el.trigger('swipe'+swipeDirection(touch.x1,touch.x2,touch.y1,touch.y2));}touch={};},0); // normal tap
}else if('last' in touch){ // don't fire tap when delta position changed by more than 30 pixels,
// for instance when moving to a point and back to origin
if(isNaN(deltaX)||deltaX<30&&deltaY<30){ // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
// ('tap' fires before 'scroll')
tapTimeout=setTimeout(function(){ // trigger universal 'tap' with the option to cancelTouch()
// (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
var event=$.Event('tap');event.cancelTouch=cancelAll;if(touch.el!==undefined)touch.el.trigger(event); // trigger double tap immediately
if(touch.isDoubleTap){if(touch.el!==undefined)touch.el.trigger('doubleTap');touch={};} // trigger single tap after 250ms of inactivity
else {touchTimeout=setTimeout(function(){touchTimeout=null;if(touch.el!==undefined)touch.el.trigger('singleTap');touch={};},250);}},0);}else {touch={};}deltaX=deltaY=0;}}) // when the browser window loses focus,
// for example when a modal dialog is shown,
// cancel all ongoing events
.on('touchcancel MSPointerCancel',cancelAll); // scrolling the window indicates intention of the user
// to scroll, not tap or swipe, so cancel all ongoing events
$(window).on('scroll',cancelAll);});['swipe','swipeLeft','swipeRight','swipeUp','swipeDown','doubleTap','tap','singleTap','longTap'].forEach(function(eventName){$.fn[eventName]=function(callback){return $(this).on(eventName,callback);};});})(jQuery);(function(UI){"use strict";var stacks=[];UI.component('stackMargin',{defaults:{cls:'uk-margin-small-top',rowfirst:false},boot:function boot(){ // init code
UI.ready(function(context){UI.$("[data-uk-margin]",context).each(function(){var ele=UI.$(this),obj;if(!ele.data("stackMargin")){obj=UI.stackMargin(ele,UI.Utils.options(ele.attr("data-uk-margin")));}});});},init:function init(){var $this=this;this.columns=[];UI.$win.on('resize orientationchange',function(){var fn=function fn(){$this.process();};UI.$(function(){fn();UI.$win.on("load",fn);});return UI.Utils.debounce(fn,20);}());UI.$html.on("changed.uk.dom",function(e){$this.process();});this.on("display.uk.check",function(e){if(this.element.is(":visible"))this.process();}.bind(this));stacks.push(this);},process:function process(){var $this=this;this.columns=this.element.children();UI.Utils.stackMargin(this.columns,this.options);if(!this.options.rowfirst){return this;} // Mark first column elements
var pos_cache=this.columns.removeClass(this.options.rowfirst).filter(':visible').first().position();if(pos_cache){this.columns.each(function(){UI.$(this)[UI.$(this).position().left==pos_cache.left?'addClass':'removeClass']($this.options.rowfirst);});}return this;},revert:function revert(){this.columns.removeClass(this.options.cls);return this;}}); // responsive element e.g. iframes
(function(){var elements=[],check=function check(ele){if(!ele.is(':visible'))return;var width=ele.parent().width(),iwidth=ele.data('width'),ratio=width/iwidth,height=Math.floor(ratio*ele.data('height'));ele.css({'height':width<iwidth?height:ele.data('height')});};UI.component('responsiveElement',{defaults:{},boot:function boot(){ // init code
UI.ready(function(context){UI.$("iframe.uk-responsive-width, [data-uk-responsive]",context).each(function(){var ele=UI.$(this),obj;if(!ele.data("responsiveIframe")){obj=UI.responsiveElement(ele,{});}});});},init:function init(){var ele=this.element;if(ele.attr('width')&&ele.attr('height')){ele.data({'width':ele.attr('width'),'height':ele.attr('height')}).on('display.uk.check',function(){check(ele);});check(ele);elements.push(ele);}}});UI.$win.on('resize load',UI.Utils.debounce(function(){elements.forEach(function(ele){check(ele);});},15));})(); // helper
UI.Utils.stackMargin=function(elements,options){options=UI.$.extend({'cls':'uk-margin-small-top'},options);options.cls=options.cls;elements=UI.$(elements).removeClass(options.cls);var skip=false,firstvisible=elements.filter(":visible:first"),offset=firstvisible.length?firstvisible.position().top+firstvisible.outerHeight()-1:false; // (-1): weird firefox bug when parent container is display:flex
if(offset===false||elements.length==1)return;elements.each(function(){var column=UI.$(this);if(column.is(":visible")){if(skip){column.addClass(options.cls);}else {if(column.position().top>=offset){skip=column.addClass(options.cls);}}}});};UI.Utils.matchHeights=function(elements,options){elements=UI.$(elements).css('min-height','');options=UI.$.extend({row:true},options);var matchHeights=function matchHeights(group){if(group.length<2)return;var max=0;group.each(function(){max=Math.max(max,UI.$(this).outerHeight());}).each(function(){var element=UI.$(this),height=max-(element.css('box-sizing')=='border-box'?0:element.outerHeight()-element.height());element.css('min-height',height+'px');});};if(options.row){elements.first().width(); // force redraw
setTimeout(function(){var lastoffset=false,group=[];elements.each(function(){var ele=UI.$(this),offset=ele.offset().top;if(offset!=lastoffset&&group.length){matchHeights(UI.$(group));group=[];offset=ele.offset().top;}group.push(ele);lastoffset=offset;});if(group.length){matchHeights(UI.$(group));}},0);}else {matchHeights(elements);}};(function(cacheSvgs){UI.Utils.inlineSvg=function(selector,root){var images=UI.$(selector||'img[src$=".svg"]',root||document).each(function(){var img=UI.$(this),src=img.attr('src');if(!cacheSvgs[src]){var d=UI.$.Deferred();UI.$.get(src,{nc:Math.random()},function(data){d.resolve(UI.$(data).find('svg'));});cacheSvgs[src]=d.promise();}cacheSvgs[src].then(function(svg){var $svg=UI.$(svg).clone();if(img.attr('id'))$svg.attr('id',img.attr('id'));if(img.attr('class'))$svg.attr('class',img.attr('class'));if(img.attr('style'))$svg.attr('style',img.attr('style'));if(img.attr('width')){$svg.attr('width',img.attr('width'));if(!img.attr('height'))$svg.removeAttr('height');}if(img.attr('height')){$svg.attr('height',img.attr('height'));if(!img.attr('width'))$svg.removeAttr('width');}img.replaceWith($svg);});});}; // init code
UI.ready(function(context){UI.Utils.inlineSvg('[data-uk-svg]',context);});})({});})(UIkit);(function(UI){"use strict";UI.component('smoothScroll',{boot:function boot(){ // init code
UI.$html.on("click.smooth-scroll.uikit","[data-uk-smooth-scroll]",function(e){var ele=UI.$(this);if(!ele.data("smoothScroll")){var obj=UI.smoothScroll(ele,UI.Utils.options(ele.attr("data-uk-smooth-scroll")));ele.trigger("click");}return false;});},init:function init(){var $this=this;this.on("click",function(e){e.preventDefault();scrollToElement(UI.$(this.hash).length?UI.$(this.hash):UI.$("body"),$this.options);});}});function scrollToElement(ele,options){options=UI.$.extend({duration:1000,transition:'easeOutExpo',offset:0,complete:function complete(){}},options); // get / set parameters
var target=ele.offset().top-options.offset,docheight=UI.$doc.height(),winheight=window.innerHeight;if(target+winheight>docheight){target=docheight-winheight;} // animate to target, fire callback when done
UI.$("html,body").stop().animate({scrollTop:target},options.duration,options.transition).promise().done(options.complete);}UI.Utils.scrollToElement=scrollToElement;if(!UI.$.easing.easeOutExpo){UI.$.easing.easeOutExpo=function(x,t,b,c,d){return t==d?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;};}})(UIkit);(function(UI){"use strict";var $win=UI.$win,$doc=UI.$doc,scrollspies=[],checkScrollSpy=function checkScrollSpy(){for(var i=0;i<scrollspies.length;i++){window.requestAnimationFrame.apply(window,[scrollspies[i].check]);}};UI.component('scrollspy',{defaults:{"target":false,"cls":"uk-scrollspy-inview","initcls":"uk-scrollspy-init-inview","topoffset":0,"leftoffset":0,"repeat":false,"delay":0},boot:function boot(){ // listen to scroll and resize
$doc.on("scrolling.uk.document",checkScrollSpy);$win.on("load resize orientationchange",UI.Utils.debounce(checkScrollSpy,50)); // init code
UI.ready(function(context){UI.$("[data-uk-scrollspy]",context).each(function(){var element=UI.$(this);if(!element.data("scrollspy")){var obj=UI.scrollspy(element,UI.Utils.options(element.attr("data-uk-scrollspy")));}});});},init:function init(){var $this=this,inviewstate,initinview,togglecls=this.options.cls.split(/,/),fn=function fn(){var elements=$this.options.target?$this.element.find($this.options.target):$this.element,delayIdx=elements.length===1?1:0,toggleclsIdx=0;elements.each(function(idx){var element=UI.$(this),inviewstate=element.data('inviewstate'),inview=UI.Utils.isInView(element,$this.options),toggle=element.data('ukScrollspyCls')||togglecls[toggleclsIdx].trim();if(inview&&!inviewstate&&!element.data('scrollspy-idle')){if(!initinview){element.addClass($this.options.initcls);$this.offset=element.offset();initinview=true;element.trigger("init.uk.scrollspy");}element.data('scrollspy-idle',setTimeout(function(){element.addClass("uk-scrollspy-inview").toggleClass(toggle).width();element.trigger("inview.uk.scrollspy");element.data('scrollspy-idle',false);element.data('inviewstate',true);},$this.options.delay*delayIdx));delayIdx++;}if(!inview&&inviewstate&&$this.options.repeat){if(element.data('scrollspy-idle')){clearTimeout(element.data('scrollspy-idle'));}element.removeClass("uk-scrollspy-inview").toggleClass(toggle);element.data('inviewstate',false);element.trigger("outview.uk.scrollspy");}toggleclsIdx=togglecls[toggleclsIdx+1]?toggleclsIdx+1:0;});};fn();this.check=fn;scrollspies.push(this);}});var scrollspynavs=[],checkScrollSpyNavs=function checkScrollSpyNavs(){for(var i=0;i<scrollspynavs.length;i++){window.requestAnimationFrame.apply(window,[scrollspynavs[i].check]);}};UI.component('scrollspynav',{defaults:{"cls":'uk-active',"closest":false,"topoffset":0,"leftoffset":0,"smoothscroll":false},boot:function boot(){ // listen to scroll and resize
$doc.on("scrolling.uk.document",checkScrollSpyNavs);$win.on("resize orientationchange",UI.Utils.debounce(checkScrollSpyNavs,50)); // init code
UI.ready(function(context){UI.$("[data-uk-scrollspy-nav]",context).each(function(){var element=UI.$(this);if(!element.data("scrollspynav")){var obj=UI.scrollspynav(element,UI.Utils.options(element.attr("data-uk-scrollspy-nav")));}});});},init:function init(){var ids=[],links=this.find("a[href^='#']").each(function(){if(this.getAttribute("href").trim()!=='#')ids.push(this.getAttribute("href"));}),targets=UI.$(ids.join(",")),clsActive=this.options.cls,clsClosest=this.options.closest||this.options.closest;var $this=this,inviews,fn=function fn(){inviews=[];for(var i=0;i<targets.length;i++){if(UI.Utils.isInView(targets.eq(i),$this.options)){inviews.push(targets.eq(i));}}if(inviews.length){var navitems,scrollTop=$win.scrollTop(),target=function(){for(var i=0;i<inviews.length;i++){if(inviews[i].offset().top>=scrollTop){return inviews[i];}}}();if(!target)return;if($this.options.closest){links.blur().closest(clsClosest).removeClass(clsActive);navitems=links.filter("a[href='#"+target.attr("id")+"']").closest(clsClosest).addClass(clsActive);}else {navitems=links.removeClass(clsActive).filter("a[href='#"+target.attr("id")+"']").addClass(clsActive);}$this.element.trigger("inview.uk.scrollspynav",[target,navitems]);}};if(this.options.smoothscroll&&UI.smoothScroll){links.each(function(){UI.smoothScroll(this,$this.options.smoothscroll);});}fn();this.element.data("scrollspynav",this);this.check=fn;scrollspynavs.push(this);}});})(UIkit);(function(UI){"use strict";var toggles=[];UI.component('toggle',{defaults:{target:false,cls:'uk-hidden',animation:false,duration:200},boot:function boot(){ // init code
UI.ready(function(context){UI.$("[data-uk-toggle]",context).each(function(){var ele=UI.$(this);if(!ele.data("toggle")){var obj=UI.toggle(ele,UI.Utils.options(ele.attr("data-uk-toggle")));}});setTimeout(function(){toggles.forEach(function(toggle){toggle.getToggles();});},0);});},init:function init(){var $this=this;this.aria=this.options.cls.indexOf('uk-hidden')!==-1;this.getToggles();this.on("click",function(e){if($this.element.is('a[href="#"]'))e.preventDefault();$this.toggle();});toggles.push(this);},toggle:function toggle(){if(!this.totoggle.length)return;if(this.options.animation&&UI.support.animation){var $this=this,animations=this.options.animation.split(',');if(animations.length==1){animations[1]=animations[0];}animations[0]=animations[0].trim();animations[1]=animations[1].trim();this.totoggle.css('animation-duration',this.options.duration+'ms');this.totoggle.each(function(){var ele=UI.$(this);if(ele.hasClass($this.options.cls)){ele.toggleClass($this.options.cls);UI.Utils.animate(ele,animations[0]).then(function(){ele.css('animation-duration','');UI.Utils.checkDisplay(ele);});}else {UI.Utils.animate(this,animations[1]+' uk-animation-reverse').then(function(){ele.toggleClass($this.options.cls).css('animation-duration','');UI.Utils.checkDisplay(ele);});}});}else {this.totoggle.toggleClass(this.options.cls);UI.Utils.checkDisplay(this.totoggle);}this.updateAria();},getToggles:function getToggles(){this.totoggle=this.options.target?UI.$(this.options.target):[];this.updateAria();},updateAria:function updateAria(){if(this.aria&&this.totoggle.length){this.totoggle.each(function(){UI.$(this).attr('aria-hidden',UI.$(this).hasClass('uk-hidden'));});}}});})(UIkit);(function(UI){"use strict";UI.component('alert',{defaults:{"fade":true,"duration":200,"trigger":".uk-alert-close"},boot:function boot(){ // init code
UI.$html.on("click.alert.uikit","[data-uk-alert]",function(e){var ele=UI.$(this);if(!ele.data("alert")){var alert=UI.alert(ele,UI.Utils.options(ele.attr("data-uk-alert")));if(UI.$(e.target).is(alert.options.trigger)){e.preventDefault();alert.close();}}});},init:function init(){var $this=this;this.on("click",this.options.trigger,function(e){e.preventDefault();$this.close();});},close:function close(){var element=this.trigger("close.uk.alert"),removeElement=function(){this.trigger("closed.uk.alert").remove();}.bind(this);if(this.options.fade){element.css("overflow","hidden").css("max-height",element.height()).animate({"height":0,"opacity":0,"padding-top":0,"padding-bottom":0,"margin-top":0,"margin-bottom":0},this.options.duration,removeElement);}else {removeElement();}}});})(UIkit);(function(UI){"use strict";UI.component('buttonRadio',{defaults:{"activeClass":'uk-active',"target":".uk-button"},boot:function boot(){ // init code
UI.$html.on("click.buttonradio.uikit","[data-uk-button-radio]",function(e){var ele=UI.$(this);if(!ele.data("buttonRadio")){var obj=UI.buttonRadio(ele,UI.Utils.options(ele.attr("data-uk-button-radio"))),target=UI.$(e.target);if(target.is(obj.options.target)){target.trigger("click");}}});},init:function init(){var $this=this; // Init ARIA
this.find($this.options.target).attr('aria-checked','false').filter('.'+$this.options.activeClass).attr('aria-checked','true');this.on("click",this.options.target,function(e){var ele=UI.$(this);if(ele.is('a[href="#"]'))e.preventDefault();$this.find($this.options.target).not(ele).removeClass($this.options.activeClass).blur();ele.addClass($this.options.activeClass); // Update ARIA
$this.find($this.options.target).not(ele).attr('aria-checked','false');ele.attr('aria-checked','true');$this.trigger("change.uk.button",[ele]);});},getSelected:function getSelected(){return this.find('.'+this.options.activeClass);}});UI.component('buttonCheckbox',{defaults:{"activeClass":'uk-active',"target":".uk-button"},boot:function boot(){UI.$html.on("click.buttoncheckbox.uikit","[data-uk-button-checkbox]",function(e){var ele=UI.$(this);if(!ele.data("buttonCheckbox")){var obj=UI.buttonCheckbox(ele,UI.Utils.options(ele.attr("data-uk-button-checkbox"))),target=UI.$(e.target);if(target.is(obj.options.target)){target.trigger("click");}}});},init:function init(){var $this=this; // Init ARIA
this.find($this.options.target).attr('aria-checked','false').filter('.'+$this.options.activeClass).attr('aria-checked','true');this.on("click",this.options.target,function(e){var ele=UI.$(this);if(ele.is('a[href="#"]'))e.preventDefault();ele.toggleClass($this.options.activeClass).blur(); // Update ARIA
ele.attr('aria-checked',ele.hasClass($this.options.activeClass));$this.trigger("change.uk.button",[ele]);});},getSelected:function getSelected(){return this.find('.'+this.options.activeClass);}});UI.component('button',{defaults:{},boot:function boot(){UI.$html.on("click.button.uikit","[data-uk-button]",function(e){var ele=UI.$(this);if(!ele.data("button")){var obj=UI.button(ele,UI.Utils.options(ele.attr("data-uk-button")));ele.trigger("click");}});},init:function init(){var $this=this; // Init ARIA
this.element.attr('aria-pressed',this.element.hasClass("uk-active"));this.on("click",function(e){if($this.element.is('a[href="#"]'))e.preventDefault();$this.toggle();$this.trigger("change.uk.button",[$this.element.blur().hasClass("uk-active")]);});},toggle:function toggle(){this.element.toggleClass("uk-active"); // Update ARIA
this.element.attr('aria-pressed',this.element.hasClass("uk-active"));}});})(UIkit);(function(UI){"use strict";var active=false,hoverIdle,flips={'x':{"bottom-left":'bottom-right',"bottom-right":'bottom-left',"bottom-center":'bottom-right',"top-left":'top-right',"top-right":'top-left',"top-center":'top-right',"left-top":'right',"left-bottom":'right-bottom',"left-center":'right-center',"right-top":'left',"right-bottom":'left-bottom',"right-center":'left-center'},'y':{"bottom-left":'top-left',"bottom-right":'top-right',"bottom-center":'top-center',"top-left":'bottom-left',"top-right":'bottom-right',"top-center":'bottom-center',"left-top":'top-left',"left-bottom":'left-bottom',"left-center":'top-left',"right-top":'top-left',"right-bottom":'bottom-left',"right-center":'top-left'},'xy':{}};UI.component('dropdown',{defaults:{'mode':'hover','pos':'bottom-left','offset':0,'remaintime':800,'justify':false,'boundary':UI.$win,'delay':0,'dropdownSelector':'.uk-dropdown,.uk-dropdown-blank','hoverDelayIdle':250,'preventflip':false},remainIdle:false,boot:function boot(){var triggerevent=UI.support.touch?"click":"mouseenter"; // init code
UI.$html.on(triggerevent+".dropdown.uikit","[data-uk-dropdown]",function(e){var ele=UI.$(this);if(!ele.data("dropdown")){var dropdown=UI.dropdown(ele,UI.Utils.options(ele.attr("data-uk-dropdown")));if(triggerevent=="click"||triggerevent=="mouseenter"&&dropdown.options.mode=="hover"){dropdown.element.trigger(triggerevent);}if(dropdown.element.find(dropdown.options.dropdownSelector).length){e.preventDefault();}}});},init:function init(){var $this=this;this.dropdown=this.find(this.options.dropdownSelector);this.offsetParent=this.dropdown.parents().filter(function(){return UI.$.inArray(UI.$(this).css('position'),['relative','fixed','absolute'])!==-1;}).slice(0,1);this.centered=this.dropdown.hasClass('uk-dropdown-center');this.justified=this.options.justify?UI.$(this.options.justify):false;this.boundary=UI.$(this.options.boundary);if(!this.boundary.length){this.boundary=UI.$win;} // legacy DEPRECATED!
if(this.dropdown.hasClass('uk-dropdown-up')){this.options.pos='top-left';}if(this.dropdown.hasClass('uk-dropdown-flip')){this.options.pos=this.options.pos.replace('left','right');}if(this.dropdown.hasClass('uk-dropdown-center')){this.options.pos=this.options.pos.replace(/(left|right)/,'center');} //-- end legacy
// Init ARIA
this.element.attr('aria-haspopup','true');this.element.attr('aria-expanded',this.element.hasClass("uk-open"));if(this.options.mode=="click"||UI.support.touch){this.on("click.uikit.dropdown",function(e){var $target=UI.$(e.target);if(!$target.parents($this.options.dropdownSelector).length){if($target.is("a[href='#']")||$target.parent().is("a[href='#']")||$this.dropdown.length&&!$this.dropdown.is(":visible")){e.preventDefault();}$target.blur();}if(!$this.element.hasClass('uk-open')){$this.show();}else {if(!$this.dropdown.find(e.target).length||$target.is(".uk-dropdown-close")||$target.parents(".uk-dropdown-close").length){$this.hide();}}});}else {this.on("mouseenter",function(e){$this.trigger('pointerenter.uk.dropdown',[$this]);if($this.remainIdle){clearTimeout($this.remainIdle);}if(hoverIdle){clearTimeout(hoverIdle);}if(active&&active==$this){return;} // pseudo manuAim
if(active&&active!=$this){hoverIdle=setTimeout(function(){hoverIdle=setTimeout($this.show.bind($this),$this.options.delay);},$this.options.hoverDelayIdle);}else {hoverIdle=setTimeout($this.show.bind($this),$this.options.delay);}}).on("mouseleave",function(){if(hoverIdle){clearTimeout(hoverIdle);}$this.remainIdle=setTimeout(function(){if(active&&active==$this)$this.hide();},$this.options.remaintime);$this.trigger('pointerleave.uk.dropdown',[$this]);}).on("click",function(e){var $target=UI.$(e.target);if($this.remainIdle){clearTimeout($this.remainIdle);}if(active&&active==$this){if(!$this.dropdown.find(e.target).length||$target.is(".uk-dropdown-close")||$target.parents(".uk-dropdown-close").length){$this.hide();}return;}if($target.is("a[href='#']")||$target.parent().is("a[href='#']")){e.preventDefault();}$this.show();});}},show:function show(){UI.$html.off("click.outer.dropdown");if(active&&active!=this){active.hide(true);}if(hoverIdle){clearTimeout(hoverIdle);}this.trigger('beforeshow.uk.dropdown',[this]);this.checkDimensions();this.element.addClass('uk-open'); // Update ARIA
this.element.attr('aria-expanded','true');this.trigger('show.uk.dropdown',[this]);UI.Utils.checkDisplay(this.dropdown,true);active=this;this.registerOuterClick();},hide:function hide(force){this.trigger('beforehide.uk.dropdown',[this,force]);this.element.removeClass('uk-open');if(this.remainIdle){clearTimeout(this.remainIdle);}this.remainIdle=false; // Update ARIA
this.element.attr('aria-expanded','false');this.trigger('hide.uk.dropdown',[this,force]);if(active==this)active=false;},registerOuterClick:function registerOuterClick(){var $this=this;UI.$html.off("click.outer.dropdown");setTimeout(function(){UI.$html.on("click.outer.dropdown",function(e){if(hoverIdle){clearTimeout(hoverIdle);}var $target=UI.$(e.target);if(active==$this&&!$this.element.find(e.target).length){$this.hide(true);UI.$html.off("click.outer.dropdown");}});},10);},checkDimensions:function checkDimensions(){if(!this.dropdown.length)return; // reset
this.dropdown.removeClass('uk-dropdown-top uk-dropdown-bottom uk-dropdown-left uk-dropdown-right uk-dropdown-stack').css({'top-left':'','left':'','margin-left':'','margin-right':''});if(this.justified&&this.justified.length){this.dropdown.css("min-width","");}var $this=this,pos=UI.$.extend({},this.offsetParent.offset(),{width:this.offsetParent[0].offsetWidth,height:this.offsetParent[0].offsetHeight}),posoffset=this.options.offset,dropdown=this.dropdown,offset=dropdown.show().offset()||{left:0,top:0},width=dropdown.outerWidth(),height=dropdown.outerHeight(),boundarywidth=this.boundary.width(),boundaryoffset=this.boundary[0]!==window&&this.boundary.offset()?this.boundary.offset():{top:0,left:0},dpos=this.options.pos;var variants={"bottom-left":{top:0+pos.height+posoffset,left:0},"bottom-right":{top:0+pos.height+posoffset,left:0+pos.width-width},"bottom-center":{top:0+pos.height+posoffset,left:0+pos.width/2-width/2},"top-left":{top:0-height-posoffset,left:0},"top-right":{top:0-height-posoffset,left:0+pos.width-width},"top-center":{top:0-height-posoffset,left:0+pos.width/2-width/2},"left-top":{top:0,left:0-width-posoffset},"left-bottom":{top:0+pos.height-height,left:0-width-posoffset},"left-center":{top:0+pos.height/2-height/2,left:0-width-posoffset},"right-top":{top:0,left:0+pos.width+posoffset},"right-bottom":{top:0+pos.height-height,left:0+pos.width+posoffset},"right-center":{top:0+pos.height/2-height/2,left:0+pos.width+posoffset}},css={},pp;pp=dpos.split('-');css=variants[dpos]?variants[dpos]:variants['bottom-left']; // justify dropdown
if(this.justified&&this.justified.length){justify(dropdown.css({left:0}),this.justified,boundarywidth);}else {if(this.options.preventflip!==true){var fdpos;switch(this.checkBoundary(pos.left+css.left,pos.top+css.top,width,height,boundarywidth)){case "x":if(this.options.preventflip!=='x')fdpos=flips['x'][dpos]||'right-top';break;case "y":if(this.options.preventflip!=='y')fdpos=flips['y'][dpos]||'top-left';break;case "xy":if(!this.options.preventflip)fdpos=flips['xy'][dpos]||'right-bottom';break;}if(fdpos){pp=fdpos.split('-');css=variants[fdpos]?variants[fdpos]:variants['bottom-left']; // check flipped
if(this.checkBoundary(pos.left+css.left,pos.top+css.top,width,height,boundarywidth)){pp=dpos.split('-');css=variants[dpos]?variants[dpos]:variants['bottom-left'];}}}}if(width>boundarywidth){dropdown.addClass("uk-dropdown-stack");this.trigger('stack.uk.dropdown',[this]);}dropdown.css(css).css("display","").addClass('uk-dropdown-'+pp[0]);},checkBoundary:function checkBoundary(left,top,width,height,boundarywidth){var axis="";if(left<0||left-UI.$win.scrollLeft()+width>boundarywidth){axis+="x";}if(top-UI.$win.scrollTop()<0||top-UI.$win.scrollTop()+height>window.innerHeight){axis+="y";}return axis;}});UI.component('dropdownOverlay',{defaults:{'justify':false,'cls':'','duration':200},boot:function boot(){ // init code
UI.ready(function(context){UI.$("[data-uk-dropdown-overlay]",context).each(function(){var ele=UI.$(this);if(!ele.data("dropdownOverlay")){UI.dropdownOverlay(ele,UI.Utils.options(ele.attr("data-uk-dropdown-overlay")));}});});},init:function init(){var $this=this;this.justified=this.options.justify?UI.$(this.options.justify):false;this.overlay=this.element.find('uk-dropdown-overlay');if(!this.overlay.length){this.overlay=UI.$('<div class="uk-dropdown-overlay"></div>').appendTo(this.element);}this.overlay.addClass(this.options.cls);this.on({'beforeshow.uk.dropdown':function beforeshowUkDropdown(e,dropdown){$this.dropdown=dropdown;if($this.justified&&$this.justified.length){justify($this.overlay.css({'display':'block','margin-left':'','margin-right':''}),$this.justified,$this.justified.outerWidth());}},'show.uk.dropdown':function showUkDropdown(e,dropdown){var h=$this.dropdown.dropdown.outerHeight(true);$this.dropdown.element.removeClass('uk-open');$this.overlay.stop().css('display','block').animate({height:h},$this.options.duration,function(){$this.dropdown.dropdown.css('visibility','');$this.dropdown.element.addClass('uk-open');UI.Utils.checkDisplay($this.dropdown.dropdown,true);});$this.pointerleave=false;},'hide.uk.dropdown':function hideUkDropdown(){$this.overlay.stop().animate({height:0},$this.options.duration);},'pointerenter.uk.dropdown':function pointerenterUkDropdown(e,dropdown){clearTimeout($this.remainIdle);},'pointerleave.uk.dropdown':function pointerleaveUkDropdown(e,dropdown){$this.pointerleave=true;}});this.overlay.on({'mouseenter':function mouseenter(){if($this.remainIdle){clearTimeout($this.dropdown.remainIdle);clearTimeout($this.remainIdle);}},'mouseleave':function mouseleave(){if($this.pointerleave&&active){$this.remainIdle=setTimeout(function(){if(active)active.hide();},active.options.remaintime);}}});}});function justify(ele,justifyTo,boundarywidth,offset){ele=UI.$(ele);justifyTo=UI.$(justifyTo);boundarywidth=boundarywidth||window.innerWidth;offset=offset||ele.offset();if(justifyTo.length){var jwidth=justifyTo.outerWidth();ele.css("min-width",jwidth);if(UI.langdirection=='right'){var right1=boundarywidth-(justifyTo.offset().left+jwidth),right2=boundarywidth-(ele.offset().left+ele.outerWidth());ele.css("margin-right",right1-right2);}else {ele.css("margin-left",justifyTo.offset().left-offset.left);}}}})(UIkit);(function(UI){"use strict";var grids=[];UI.component('gridMatchHeight',{defaults:{"target":false,"row":true,"ignorestacked":false},boot:function boot(){ // init code
UI.ready(function(context){UI.$("[data-uk-grid-match]",context).each(function(){var grid=UI.$(this),obj;if(!grid.data("gridMatchHeight")){obj=UI.gridMatchHeight(grid,UI.Utils.options(grid.attr("data-uk-grid-match")));}});});},init:function init(){var $this=this;this.columns=this.element.children();this.elements=this.options.target?this.find(this.options.target):this.columns;if(!this.columns.length)return;UI.$win.on('load resize orientationchange',function(){var fn=function fn(){$this.match();};UI.$(function(){fn();});return UI.Utils.debounce(fn,50);}());UI.$html.on("changed.uk.dom",function(e){$this.columns=$this.element.children();$this.elements=$this.options.target?$this.find($this.options.target):$this.columns;$this.match();});this.on("display.uk.check",function(e){if(this.element.is(":visible"))this.match();}.bind(this));grids.push(this);},match:function match(){var firstvisible=this.columns.filter(":visible:first");if(!firstvisible.length)return;var stacked=Math.ceil(100*parseFloat(firstvisible.css('width'))/parseFloat(firstvisible.parent().css('width')))>=100;if(stacked&&!this.options.ignorestacked){this.revert();}else {UI.Utils.matchHeights(this.elements,this.options);}return this;},revert:function revert(){this.elements.css('min-height','');return this;}});UI.component('gridMargin',{defaults:{cls:'uk-grid-margin',rowfirst:'uk-row-first'},boot:function boot(){ // init code
UI.ready(function(context){UI.$("[data-uk-grid-margin]",context).each(function(){var grid=UI.$(this),obj;if(!grid.data("gridMargin")){obj=UI.gridMargin(grid,UI.Utils.options(grid.attr("data-uk-grid-margin")));}});});},init:function init(){var stackMargin=UI.stackMargin(this.element,this.options);}});})(UIkit);(function(UI){"use strict";var active=false,activeCount=0,$html=UI.$html,body;UI.component('modal',{defaults:{keyboard:true,bgclose:true,minScrollHeight:150,center:false,modal:true},scrollable:false,transition:false,hasTransitioned:true,init:function init(){if(!body)body=UI.$('body');if(!this.element.length)return;var $this=this;this.paddingdir="padding-"+(UI.langdirection=='left'?"right":"left");this.dialog=this.find(".uk-modal-dialog");this.active=false; // Update ARIA
this.element.attr('aria-hidden',this.element.hasClass("uk-open"));this.on("click",".uk-modal-close",function(e){e.preventDefault();$this.hide();}).on("click",function(e){var target=UI.$(e.target);if(target[0]==$this.element[0]&&$this.options.bgclose){$this.hide();}});},toggle:function toggle(){return this[this.isActive()?"hide":"show"]();},show:function show(){if(!this.element.length)return;var $this=this;if(this.isActive())return;if(this.options.modal&&active){active.hide(true);}this.element.removeClass("uk-open").show();this.resize();if(this.options.modal){active=this;}this.active=true;activeCount++;if(UI.support.transition){this.hasTransitioned=false;this.element.one(UI.support.transition.end,function(){$this.hasTransitioned=true;}).addClass("uk-open");}else {this.element.addClass("uk-open");}$html.addClass("uk-modal-page").height(); // force browser engine redraw
// Update ARIA
this.element.attr('aria-hidden','false');this.element.trigger("show.uk.modal");UI.Utils.checkDisplay(this.dialog,true);return this;},hide:function hide(force){if(!force&&UI.support.transition&&this.hasTransitioned){var $this=this;this.one(UI.support.transition.end,function(){$this._hide();}).removeClass("uk-open");}else {this._hide();}return this;},resize:function resize(){var bodywidth=body.width();this.scrollbarwidth=window.innerWidth-bodywidth;body.css(this.paddingdir,this.scrollbarwidth);this.element.css('overflow-y',this.scrollbarwidth?'scroll':'auto');if(!this.updateScrollable()&&this.options.center){var dh=this.dialog.outerHeight(),pad=parseInt(this.dialog.css('margin-top'),10)+parseInt(this.dialog.css('margin-bottom'),10);if(dh+pad<window.innerHeight){this.dialog.css({'top':window.innerHeight/2-dh/2-pad});}else {this.dialog.css({'top':''});}}},updateScrollable:function updateScrollable(){ // has scrollable?
var scrollable=this.dialog.find('.uk-overflow-container:visible:first');if(scrollable.length){scrollable.css('height',0);var offset=Math.abs(parseInt(this.dialog.css('margin-top'),10)),dh=this.dialog.outerHeight(),wh=window.innerHeight,h=wh-2*(offset<20?20:offset)-dh;scrollable.css({'max-height':h<this.options.minScrollHeight?'':h,'height':''});return true;}return false;},_hide:function _hide(){this.active=false;if(activeCount>0)activeCount--;else activeCount=0;this.element.hide().removeClass('uk-open'); // Update ARIA
this.element.attr('aria-hidden','true');if(!activeCount){$html.removeClass('uk-modal-page');body.css(this.paddingdir,"");}if(active===this)active=false;this.trigger('hide.uk.modal');},isActive:function isActive(){return this.active;}});UI.component('modalTrigger',{boot:function boot(){ // init code
UI.$html.on("click.modal.uikit","[data-uk-modal]",function(e){var ele=UI.$(this);if(ele.is("a")){e.preventDefault();}if(!ele.data("modalTrigger")){var modal=UI.modalTrigger(ele,UI.Utils.options(ele.attr("data-uk-modal")));modal.show();}}); // close modal on esc button
UI.$html.on('keydown.modal.uikit',function(e){if(active&&e.keyCode===27&&active.options.keyboard){ // ESC
e.preventDefault();active.hide();}});UI.$win.on("resize orientationchange",UI.Utils.debounce(function(){if(active)active.resize();},150));},init:function init(){var $this=this;this.options=UI.$.extend({"target":$this.element.is("a")?$this.element.attr("href"):false},this.options);this.modal=UI.modal(this.options.target,this.options);this.on("click",function(e){e.preventDefault();$this.show();}); //methods
this.proxy(this.modal,"show hide isActive");}});UI.modal.dialog=function(content,options){var modal=UI.modal(UI.$(UI.modal.dialog.template).appendTo("body"),options);modal.on("hide.uk.modal",function(){if(modal.persist){modal.persist.appendTo(modal.persist.data("modalPersistParent"));modal.persist=false;}modal.element.remove();});setContent(content,modal);return modal;};UI.modal.dialog.template='<div class="uk-modal"><div class="uk-modal-dialog" style="min-height:0;"></div></div>';UI.modal.alert=function(content,options){options=UI.$.extend(true,{bgclose:false,keyboard:false,modal:false,labels:UI.modal.labels},options);var modal=UI.modal.dialog(['<div class="uk-margin uk-modal-content">'+String(content)+'</div>','<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-button-primary uk-modal-close">'+options.labels.Ok+'</button></div>'].join(""),options);modal.on('show.uk.modal',function(){setTimeout(function(){modal.element.find('button:first').focus();},50);});return modal.show();};UI.modal.confirm=function(content,onconfirm,oncancel){var options=arguments.length>1&&arguments[arguments.length-1]?arguments[arguments.length-1]:{};onconfirm=UI.$.isFunction(onconfirm)?onconfirm:function(){};oncancel=UI.$.isFunction(oncancel)?oncancel:function(){};options=UI.$.extend(true,{bgclose:false,keyboard:false,modal:false,labels:UI.modal.labels},UI.$.isFunction(options)?{}:options);var modal=UI.modal.dialog(['<div class="uk-margin uk-modal-content">'+String(content)+'</div>','<div class="uk-modal-footer uk-text-right"><button class="uk-button js-modal-confirm-cancel">'+options.labels.Cancel+'</button> <button class="uk-button uk-button-primary js-modal-confirm">'+options.labels.Ok+'</button></div>'].join(""),options);modal.element.find(".js-modal-confirm, .js-modal-confirm-cancel").on("click",function(){UI.$(this).is('.js-modal-confirm')?onconfirm():oncancel();modal.hide();});modal.on('show.uk.modal',function(){setTimeout(function(){modal.element.find('.js-modal-confirm').focus();},50);});return modal.show();};UI.modal.prompt=function(text,value,onsubmit,options){onsubmit=UI.$.isFunction(onsubmit)?onsubmit:function(value){};options=UI.$.extend(true,{bgclose:false,keyboard:false,modal:false,labels:UI.modal.labels},options);var modal=UI.modal.dialog([text?'<div class="uk-modal-content uk-form">'+String(text)+'</div>':'','<div class="uk-margin-small-top uk-modal-content uk-form"><p><input type="text" class="uk-width-1-1"></p></div>','<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-modal-close">'+options.labels.Cancel+'</button> <button class="uk-button uk-button-primary js-modal-ok">'+options.labels.Ok+'</button></div>'].join(""),options),input=modal.element.find("input[type='text']").val(value||'').on('keyup',function(e){if(e.keyCode==13){modal.element.find(".js-modal-ok").trigger('click');}});modal.element.find(".js-modal-ok").on("click",function(){if(onsubmit(input.val())!==false){modal.hide();}});modal.on('show.uk.modal',function(){setTimeout(function(){input.focus();},50);});return modal.show();};UI.modal.blockUI=function(content,options){var modal=UI.modal.dialog(['<div class="uk-margin uk-modal-content">'+String(content||'<div class="uk-text-center">...</div>')+'</div>'].join(""),UI.$.extend({bgclose:false,keyboard:false,modal:false},options));modal.content=modal.element.find('.uk-modal-content:first');return modal.show();};UI.modal.labels={'Ok':'Ok','Cancel':'Cancel'}; // helper functions
function setContent(content,modal){if(!modal)return;if((typeof content==="undefined"?"undefined":_typeof(content))==='object'){ // convert DOM object to a jQuery object
content=content instanceof jQuery?content:UI.$(content);if(content.parent().length){modal.persist=content;modal.persist.data("modalPersistParent",content.parent());}}else if(typeof content==='string'||typeof content==='number'){ // just insert the data as innerHTML
content=UI.$('<div></div>').html(content);}else { // unsupported data type!
content=UI.$('<div></div>').html('UIkit.modal Error: Unsupported data type: '+(typeof content==="undefined"?"undefined":_typeof(content)));}content.appendTo(modal.element.find('.uk-modal-dialog'));return modal;}})(UIkit);(function(UI){"use strict";UI.component('nav',{defaults:{"toggle":">li.uk-parent > a[href='#']","lists":">li.uk-parent > ul","multiple":false},boot:function boot(){ // init code
UI.ready(function(context){UI.$("[data-uk-nav]",context).each(function(){var nav=UI.$(this);if(!nav.data("nav")){var obj=UI.nav(nav,UI.Utils.options(nav.attr("data-uk-nav")));}});});},init:function init(){var $this=this;this.on("click.uikit.nav",this.options.toggle,function(e){e.preventDefault();var ele=UI.$(this);$this.open(ele.parent()[0]==$this.element[0]?ele:ele.parent("li"));});this.find(this.options.lists).each(function(){var $ele=UI.$(this),parent=$ele.parent(),active=parent.hasClass("uk-active");$ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');parent.data("list-container",$ele.parent()[active?'removeClass':'addClass']('uk-hidden')); // Init ARIA
parent.attr('aria-expanded',parent.hasClass("uk-open"));if(active)$this.open(parent,true);});},open:function open(li,noanimation){var $this=this,element=this.element,$li=UI.$(li),$container=$li.data('list-container');if(!this.options.multiple){element.children('.uk-open').not(li).each(function(){var ele=UI.$(this);if(ele.data('list-container')){ele.data('list-container').stop().animate({height:0},function(){UI.$(this).parent().removeClass('uk-open').end().addClass('uk-hidden');});}});}$li.toggleClass('uk-open'); // Update ARIA
$li.attr('aria-expanded',$li.hasClass('uk-open'));if($container){if($li.hasClass('uk-open')){$container.removeClass('uk-hidden');}if(noanimation){$container.stop().height($li.hasClass('uk-open')?'auto':0);if(!$li.hasClass('uk-open')){$container.addClass('uk-hidden');}this.trigger('display.uk.check');}else {$container.stop().animate({height:$li.hasClass('uk-open')?getHeight($container.find('ul:first')):0},function(){if(!$li.hasClass('uk-open')){$container.addClass('uk-hidden');}else {$container.css('height','');}$this.trigger('display.uk.check');});}}}}); // helper
function getHeight(ele){var $ele=UI.$(ele),height="auto";if($ele.is(":visible")){height=$ele.outerHeight();}else {var tmp={position:$ele.css("position"),visibility:$ele.css("visibility"),display:$ele.css("display")};height=$ele.css({position:'absolute',visibility:'hidden',display:'block'}).outerHeight();$ele.css(tmp); // reset element
}return height;}})(UIkit);(function(UI){"use strict";var scrollpos={x:window.scrollX,y:window.scrollY},$win=UI.$win,$doc=UI.$doc,$html=UI.$html,Offcanvas={show:function show(element){element=UI.$(element);if(!element.length)return;var $body=UI.$('body'),bar=element.find(".uk-offcanvas-bar:first"),rtl=UI.langdirection=="right",flip=bar.hasClass("uk-offcanvas-bar-flip")?-1:1,dir=flip*(rtl?-1:1),scrollbarwidth=window.innerWidth-$body.width();scrollpos={x:window.pageXOffset,y:window.pageYOffset};element.addClass("uk-active");$body.css({"width":window.innerWidth-scrollbarwidth,"height":window.innerHeight}).addClass("uk-offcanvas-page");$body.css(rtl?"margin-right":"margin-left",(rtl?-1:1)*(bar.outerWidth()*dir)).width(); // .width() - force redraw
$html.css('margin-top',scrollpos.y*-1);bar.addClass("uk-offcanvas-bar-show");this._initElement(element);bar.trigger('show.uk.offcanvas',[element,bar]); // Update ARIA
element.attr('aria-hidden','false');},hide:function hide(force){var $body=UI.$('body'),panel=UI.$(".uk-offcanvas.uk-active"),rtl=UI.langdirection=="right",bar=panel.find(".uk-offcanvas-bar:first"),finalize=function finalize(){$body.removeClass("uk-offcanvas-page").css({"width":"","height":"","margin-left":"","margin-right":""});panel.removeClass("uk-active");bar.removeClass("uk-offcanvas-bar-show");$html.css('margin-top','');window.scrollTo(scrollpos.x,scrollpos.y);bar.trigger('hide.uk.offcanvas',[panel,bar]); // Update ARIA
panel.attr('aria-hidden','true');};if(!panel.length)return;if(UI.support.transition&&!force){$body.one(UI.support.transition.end,function(){finalize();}).css(rtl?"margin-right":"margin-left","");setTimeout(function(){bar.removeClass("uk-offcanvas-bar-show");},0);}else {finalize();}},_initElement:function _initElement(element){if(element.data("OffcanvasInit"))return;element.on("click.uk.offcanvas swipeRight.uk.offcanvas swipeLeft.uk.offcanvas",function(e){var target=UI.$(e.target);if(!e.type.match(/swipe/)){if(!target.hasClass("uk-offcanvas-close")){if(target.hasClass("uk-offcanvas-bar"))return;if(target.parents(".uk-offcanvas-bar:first").length)return;}}e.stopImmediatePropagation();Offcanvas.hide();});element.on("click","a[href*='#']",function(e){var link=UI.$(this),href=link.attr("href");if(href=="#"){return;}UI.$doc.one('hide.uk.offcanvas',function(){var target;try{target=UI.$(link[0].hash);}catch(e){target='';}if(!target.length){target=UI.$('[name="'+link[0].hash.replace('#','')+'"]');}if(target.length&&UI.Utils.scrollToElement){UI.Utils.scrollToElement(target,UI.Utils.options(link.attr('data-uk-smooth-scroll')||'{}'));}else {window.location.href=href;}});Offcanvas.hide();});element.data("OffcanvasInit",true);}};UI.component('offcanvasTrigger',{boot:function boot(){ // init code
$html.on("click.offcanvas.uikit","[data-uk-offcanvas]",function(e){e.preventDefault();var ele=UI.$(this);if(!ele.data("offcanvasTrigger")){var obj=UI.offcanvasTrigger(ele,UI.Utils.options(ele.attr("data-uk-offcanvas")));ele.trigger("click");}});$html.on('keydown.uk.offcanvas',function(e){if(e.keyCode===27){ // ESC
Offcanvas.hide();}});},init:function init(){var $this=this;this.options=UI.$.extend({"target":$this.element.is("a")?$this.element.attr("href"):false},this.options);this.on("click",function(e){e.preventDefault();Offcanvas.show($this.options.target);});}});UI.offcanvas=Offcanvas;})(UIkit);(function(UI){"use strict";var Animations;UI.component('switcher',{defaults:{connect:false,toggle:">*",active:0,animation:false,duration:200,swiping:true},animating:false,boot:function boot(){ // init code
UI.ready(function(context){UI.$("[data-uk-switcher]",context).each(function(){var switcher=UI.$(this);if(!switcher.data("switcher")){var obj=UI.switcher(switcher,UI.Utils.options(switcher.attr("data-uk-switcher")));}});});},init:function init(){var $this=this;this.on("click.uikit.switcher",this.options.toggle,function(e){e.preventDefault();$this.show(this);});if(this.options.connect){this.connect=UI.$(this.options.connect);this.connect.find(".uk-active").removeClass(".uk-active"); // delegate switch commands within container content
if(this.connect.length){ // Init ARIA for connect
this.connect.children().attr('aria-hidden','true');this.connect.on("click",'[data-uk-switcher-item]',function(e){e.preventDefault();var item=UI.$(this).attr('data-uk-switcher-item');if($this.index==item)return;switch(item){case 'next':case 'previous':$this.show($this.index+(item=='next'?1:-1));break;default:$this.show(parseInt(item,10));}});if(this.options.swiping){this.connect.on('swipeRight swipeLeft',function(e){e.preventDefault();if(!window.getSelection().toString()){$this.show($this.index+(e.type=='swipeLeft'?1:-1));}});}}var toggles=this.find(this.options.toggle),active=toggles.filter(".uk-active");if(active.length){this.show(active,false);}else {if(this.options.active===false)return;active=toggles.eq(this.options.active);this.show(active.length?active:toggles.eq(0),false);} // Init ARIA for toggles
toggles.not(active).attr('aria-expanded','false');active.attr('aria-expanded','true');this.on('changed.uk.dom',function(){$this.connect=UI.$($this.options.connect);});}},show:function show(tab,animate){if(this.animating){return;}if(isNaN(tab)){tab=UI.$(tab);}else {var toggles=this.find(this.options.toggle);tab=tab<0?toggles.length-1:tab;tab=toggles.eq(toggles[tab]?tab:0);}var $this=this,toggles=this.find(this.options.toggle),active=UI.$(tab),animation=Animations[this.options.animation]||function(current,next){if(!$this.options.animation){return Animations.none.apply($this);}var anim=$this.options.animation.split(',');if(anim.length==1){anim[1]=anim[0];}anim[0]=anim[0].trim();anim[1]=anim[1].trim();return coreAnimation.apply($this,[anim,current,next]);};if(animate===false||!UI.support.animation){animation=Animations.none;}if(active.hasClass("uk-disabled"))return; // Update ARIA for Toggles
toggles.attr('aria-expanded','false');active.attr('aria-expanded','true');toggles.filter(".uk-active").removeClass("uk-active");active.addClass("uk-active");if(this.options.connect&&this.connect.length){this.index=this.find(this.options.toggle).index(active);if(this.index==-1){this.index=0;}this.connect.each(function(){var container=UI.$(this),children=UI.$(container.children()),current=UI.$(children.filter('.uk-active')),next=UI.$(children.eq($this.index));$this.animating=true;animation.apply($this,[current,next]).then(function(){current.removeClass("uk-active");next.addClass("uk-active"); // Update ARIA for connect
current.attr('aria-hidden','true');next.attr('aria-hidden','false');UI.Utils.checkDisplay(next,true);$this.animating=false;});});}this.trigger("show.uk.switcher",[active]);}});Animations={'none':function none(){var d=UI.$.Deferred();d.resolve();return d.promise();},'fade':function fade(current,next){return coreAnimation.apply(this,['uk-animation-fade',current,next]);},'slide-bottom':function slideBottom(current,next){return coreAnimation.apply(this,['uk-animation-slide-bottom',current,next]);},'slide-top':function slideTop(current,next){return coreAnimation.apply(this,['uk-animation-slide-top',current,next]);},'slide-vertical':function slideVertical(current,next,dir){var anim=['uk-animation-slide-top','uk-animation-slide-bottom'];if(current&&current.index()>next.index()){anim.reverse();}return coreAnimation.apply(this,[anim,current,next]);},'slide-left':function slideLeft(current,next){return coreAnimation.apply(this,['uk-animation-slide-left',current,next]);},'slide-right':function slideRight(current,next){return coreAnimation.apply(this,['uk-animation-slide-right',current,next]);},'slide-horizontal':function slideHorizontal(current,next,dir){var anim=['uk-animation-slide-right','uk-animation-slide-left'];if(current&&current.index()>next.index()){anim.reverse();}return coreAnimation.apply(this,[anim,current,next]);},'scale':function scale(current,next){return coreAnimation.apply(this,['uk-animation-scale-up',current,next]);}};UI.switcher.animations=Animations; // helpers
function coreAnimation(cls,current,next){var d=UI.$.Deferred(),clsIn=cls,clsOut=cls,release;if(next[0]===current[0]){d.resolve();return d.promise();}if((typeof cls==="undefined"?"undefined":_typeof(cls))=='object'){clsIn=cls[0];clsOut=cls[1]||cls[0];}UI.$body.css('overflow-x','hidden'); // fix scroll jumping in iOS
release=function release(){if(current)current.hide().removeClass('uk-active '+clsOut+' uk-animation-reverse');next.addClass(clsIn).one(UI.support.animation.end,function(){next.removeClass(''+clsIn+'').css({opacity:'',display:''});d.resolve();UI.$body.css('overflow-x','');if(current)current.css({opacity:'',display:''});}.bind(this)).show();};next.css('animation-duration',this.options.duration+'ms');if(current&&current.length){current.css('animation-duration',this.options.duration+'ms');current.css('display','none').addClass(clsOut+' uk-animation-reverse').one(UI.support.animation.end,function(){release();}.bind(this)).css('display','');}else {next.addClass('uk-active');release();}return d.promise();}})(UIkit);(function(UI){"use strict";UI.component('tab',{defaults:{'target':'>li:not(.uk-tab-responsive, .uk-disabled)','connect':false,'active':0,'animation':false,'duration':200,'swiping':true},boot:function boot(){ // init code
UI.ready(function(context){UI.$("[data-uk-tab]",context).each(function(){var tab=UI.$(this);if(!tab.data("tab")){var obj=UI.tab(tab,UI.Utils.options(tab.attr("data-uk-tab")));}});});},init:function init(){var $this=this;this.current=false;this.on("click.uikit.tab",this.options.target,function(e){e.preventDefault();if($this.switcher&&$this.switcher.animating){return;}var current=$this.find($this.options.target).not(this);current.removeClass("uk-active").blur();$this.trigger("change.uk.tab",[UI.$(this).addClass("uk-active"),$this.current]);$this.current=UI.$(this); // Update ARIA
if(!$this.options.connect){current.attr('aria-expanded','false');UI.$(this).attr('aria-expanded','true');}});if(this.options.connect){this.connect=UI.$(this.options.connect);} // init responsive tab
this.responsivetab=UI.$('<li class="uk-tab-responsive uk-active"><a></a></li>').append('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>');this.responsivetab.dropdown=this.responsivetab.find('.uk-dropdown');this.responsivetab.lst=this.responsivetab.dropdown.find('ul');this.responsivetab.caption=this.responsivetab.find('a:first');if(this.element.hasClass("uk-tab-bottom"))this.responsivetab.dropdown.addClass("uk-dropdown-up"); // handle click
this.responsivetab.lst.on('click.uikit.tab','a',function(e){e.preventDefault();e.stopPropagation();var link=UI.$(this);$this.element.children('li:not(.uk-tab-responsive)').eq(link.data('index')).trigger('click');});this.on('show.uk.switcher change.uk.tab',function(e,tab){$this.responsivetab.caption.html(tab.text());});this.element.append(this.responsivetab); // init UIkit components
if(this.options.connect){this.switcher=UI.switcher(this.element,{'toggle':'>li:not(.uk-tab-responsive)','connect':this.options.connect,'active':this.options.active,'animation':this.options.animation,'duration':this.options.duration,'swiping':this.options.swiping});}UI.dropdown(this.responsivetab,{"mode":"click"}); // init
$this.trigger("change.uk.tab",[this.element.find(this.options.target).not('.uk-tab-responsive').filter('.uk-active')]);this.check();UI.$win.on('resize orientationchange',UI.Utils.debounce(function(){if($this.element.is(":visible"))$this.check();},100));this.on('display.uk.check',function(){if($this.element.is(":visible"))$this.check();});},check:function check(){var children=this.element.children('li:not(.uk-tab-responsive)').removeClass('uk-hidden');if(!children.length){this.responsivetab.addClass('uk-hidden');return;}var top=children.eq(0).offset().top+Math.ceil(children.eq(0).height()/2),doresponsive=false,item,link,clone;this.responsivetab.lst.empty();children.each(function(){if(UI.$(this).offset().top>top){doresponsive=true;}});if(doresponsive){for(var i=0;i<children.length;i++){item=UI.$(children.eq(i));link=item.find('a');if(item.css('float')!='none'&&!item.attr('uk-dropdown')){if(!item.hasClass('uk-disabled')){clone=item[0].outerHTML.replace('<a ','<a data-index="'+i+'" ');this.responsivetab.lst.append(clone);}item.addClass('uk-hidden');}}}this.responsivetab[this.responsivetab.lst.children('li').length?'removeClass':'addClass']('uk-hidden');}});})(UIkit);(function(UI){"use strict";UI.component('cover',{defaults:{automute:true},boot:function boot(){ // auto init
UI.ready(function(context){UI.$("[data-uk-cover]",context).each(function(){var ele=UI.$(this);if(!ele.data("cover")){var plugin=UI.cover(ele,UI.Utils.options(ele.attr("data-uk-cover")));}});});},init:function init(){this.parent=this.element.parent();UI.$win.on('load resize orientationchange',UI.Utils.debounce(function(){this.check();}.bind(this),100));this.on("display.uk.check",function(e){if(this.element.is(":visible"))this.check();}.bind(this));this.check();if(this.element.is('iframe')&&this.options.automute){var src=this.element.attr('src');this.element.attr('src','').on('load',function(){this.contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}','*');}).attr('src',[src,src.indexOf('?')>-1?'&':'?','enablejsapi=1&api=1'].join(''));}},check:function check(){this.element.css({'width':'','height':''});this.dimension={w:this.element.width(),h:this.element.height()};if(this.element.attr('width')&&!isNaN(this.element.attr('width'))){this.dimension.w=this.element.attr('width');}if(this.element.attr('height')&&!isNaN(this.element.attr('height'))){this.dimension.h=this.element.attr('height');}this.ratio=this.dimension.w/this.dimension.h;var w=this.parent.width(),h=this.parent.height(),width,height; // if element height < parent height (gap underneath)
if(w/this.ratio<h){width=Math.ceil(h*this.ratio);height=h; // element width < parent width (gap to right)
}else {width=w;height=Math.ceil(w/this.ratio);}this.element.css({'width':width,'height':height});}});})(UIkit);

},{}]},{},[9]);
