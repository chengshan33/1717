/*!
 * ki.js - jQuery-like API super-tiny JavaScript library
 * Copyright (c) 2014 Denis Ciccale (@tdecs)
 * Released under MIT license
 */
!function (b, c, d, e) {

  /*
   * init function (internal use)
   * a = selector, dom element or function
   */
  function i(a) {
    c.push.apply(this, a && a.nodeType ? [a] : '' + a === a ? b.querySelectorAll(a) : e)
  }

  /*
   * $dtk main function
   * a = css selector, dom object, or function
   * http://www.dustindiaz.com/smallest-domready-ever
   * returns instance or executes function on ready
   */
  $dtk = function (a) {
    return /^f/.test(typeof a) ? /c/.test(b.readyState) ? a() : $dtk(b).on('DOMContentLoaded', a) : new i(a)
  }

  // set ki prototype
  $dtk[d] = i[d] = $dtk.fn = i.fn = {

    // default length
    length: 0,

    /*
     * on method
     * a = string event type i.e 'click'
     * b = function
     * return this
     */
    on: function (a, b) {
      return this.each(function (c) {
        c.addEventListener(a, b)
      })
    },

    /*
     * off method
     * a = string event type i.e 'click'
     * b = function
     * return this
     */
    off: function (a, b) {
      return this.each(function (c) {
        c.removeEventListener(a, b)
      })
    },

    /*
     * each method
     * use native forEach to iterate collection
     * a = the function to call on each iteration
     * b = the this value for that function
     */
    each: function (a, b) {
      c.forEach.call(this, a, b);
      return this;
    },

    // for some reason is needed to get an array-like
    // representation instead of an object
    splice: c.splice
  }
}(document, [], 'prototype');


/*!
 * ki.extend.js
 * extend ki.js with jQuery style prototypes
 * @author James Doyle (james2doyle) , extend by evan zhang
 * @license MIT
 * Resource for prototypes
 * http://youmightnotneedjquery.com/
 */

(function() {

var slice = Array.prototype.slice;
function isArray(arr) { return Object.prototype.toString.call(arr) === '[object Array]';};
function isFunction(value) { return type(value) == "function";};
function isWindow(obj)     { return obj != null && obj == obj.window; };
function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE; };
function isObject(obj)     { return type(obj) == "object"; };
function isPlainObject(obj) {
  return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
};

function extend(target, source, deep) {
  for (key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key]))
        target[key] = {}
      if (isArray(source[key]) && !isArray(target[key]))
        target[key] = []
      extend(target[key], source[key], deep)
    }
    else if (source[key] !== undefined) target[key] = source[key]
}

$dtk.each = function(arr, callback) {
  var i = 0, l = arr.length;
  for(; i < l; ++i) {
    callback.call(arr[i], i, arr[i]);
  }
  return this;
};
// map some classlist functions to the jQuery counterpart
var props = ['addClass', 'removeClass', 'toggleClass'],
maps = ['add', 'remove', 'toggle'];

props.forEach(function(prop, index) {
  $dtk.prototype[prop] = function(a) {
    return this.each(function(b) {
      b.classList[maps[index]](a);
    });
  };
});


$dtk.extend = $dtk.prototype.extend = function(target){
  var deep, args = slice.call(arguments, 1);
  if (typeof target == 'boolean') {
    deep = target;
    target = args.shift();
  }
  args.forEach(function(arg){ extend(target, arg, deep) });
  return target;
};

$dtk.prototype.hasClass = function(a) {
  return this[0].classList.contains(a);
};

$dtk.prototype.append = function(a) {
  return this.each(function(b) {
    b.appendChild(a[0]);
  });
};

$dtk.prototype.prepend = function(a) {
  return this.each(function(b) {
    b.insertBefore(a[0], b.firstChild);
  });
};

$dtk.prototype.hide = function() {
  return this.each(function(b) {
    b.style.display = 'none';
  });
};

$dtk.prototype.show = function() {
  return this.each(function(b) {
    b.style.display = '';
  });
};

$dtk.prototype.attr = function(a, b) {
  return b === []._ ? this[0].getAttribute(a) : this.each(function(c) {
    c.setAttribute(a, b);
  });
};

$dtk.prototype.removeAttr = function(a) {
  return this.each(function(b) {
    b.removeAttribute(a);
  });
};

$dtk.prototype.hasAttr = function(a) {
  return this[0].hasAttribute(a);
};

$dtk.prototype.before = function(a) {
  return this.each(function(b) {
    b.insertAdjacentHTML('beforebegin', a);
  });
};

$dtk.prototype.after = function(a) {
  return this.each(function(b) {
    b.insertAdjacentHTML('afterend', a);
  });
};

$dtk.prototype.closest = function(selector, context){
  var node = this[0], collection = false;
  if (typeof selector == 'object'){
     collection = $dtk(selector);
   };
  while (node && !(collection ? collection.indexOf(node) >= 0 : this.matches(node, selector))){
    node = node !== context && !isDocument(node) && node.parentNode
  }
  return $dtk(node)
};



$dtk.prototype.css = function(a, b) {
  if (typeof(a) === 'object') {
    for(var prop in a) {
      this.each(function(c) {
        c.style[prop] = a[prop];
      });
    }
    return this;
  } else {
    return b === []._ ? this[0].style[a] : this.each(function(c) {
      c.style[a] = b;
    });
  }
};

$dtk.prototype.eq = function(a) {
  return $dtk(this[a]);
};

$dtk.prototype.first = function() {
  return $dtk(this[0]);
};

$dtk.prototype.last = function() {
  return $dtk(this[this.length - 1]);
};

$dtk.prototype.get = function(a) {
  return $dtk(this[a]);
};

$dtk.prototype.text = function(a) {
  return a === []._ ? this[0].textContent : this.each(function(b) {
    b.textContent = a;
  });
};

$dtk.prototype.html = function(a) {
  return a === []._ ? this[0].innerHTML : this.each(function(b) {
    b.innerHTML = a;
  });
};

$dtk.prototype.parent = function() {
  return (this.length < 2) ? $dtk(this[0].parentNode): [];
};

$dtk.prototype.remove = function() {
  return this.each(function(b) {
    b.parentNode.removeChild(b);
  });
};

$dtk.prototype.size = function() {
  return this.length;
};

$dtk.trim = function(a) {
  return a.replace(/^\s+|\s+$/g, '');
};

$dtk.prototype.trigger = function(a) {
  if (document.createEvent) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(a, true, false);
    this.each(function(b) {
      b.dispatchEvent(event);
    });
  } else {
    this.each(function(b) {
      b.fireEvent('on' + a);
    });
  }
};

$dtk.prototype.is = function(a) {
  var m = (this[0].matches || this[0].matchesSelector || this[0].msMatchesSelector || this[0].mozMatchesSelector || this[0].webkitMatchesSelector || this[0].oMatchesSelector);
  if (m) {
    return m.call(this[0], a);
  } else {
    var n = this[0].parentNode.querySelectorAll(a);
    for (var i = n.length; i--;) {
      if (n[i] === this[0]) {
        return true;
      }
    }
    return false;
  }
};

$dtk.prototype.matches = function(element, selector) {
  var m = (element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.webkitMatchesSelector || element.oMatchesSelector);
  if (m) {
    return m.call(element, selector);
  } else {
    if(!isDocument(element)){
      var n = element.parentNode.querySelectorAll(selector);
      for (var i = n.length; i--;) {
        if (n[i] === this[0]) {
          return true;
        }
      }
    }

    return false;
  }
};

"filter map".split(" ").forEach(function(m) {
  $dtk[m] = function(a, b) {
    return a[m](b);
  };
});

$dtk.stop = function(e) {
  if (!e.preventDefault) {
    e.returnValue = false;
  } else {
    e.preventDefault();
  }
};

$dtk.param = function(obj, prefix) {
  var str = [];
  for(var p in obj) {
    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
    str.push(typeof v == "object" ? $dtk.param(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
  }
  return str.join("&");
};

// var p = new $dtk.Deferred();
// p.resolve(n);
// return p.promise();

$dtk.ajax = function(a, b, c) {
  var xhr = new XMLHttpRequest();
  var p = new $dtk.Deferred();
  // 1 == post, 0 == get
  var type = (typeof(b) === 'object') ? 1: 0;
  var gp = ['GET', 'POST'];
  xhr.open(gp[type], a, true);
  var cb = (!type) ? b: c;
  if (typeof(c) === 'undefined' && typeof(b) !== 'function') {
    cb = function(){};
  }
  xhr.onerror = function() {
    p.reject(this);
    cb(this, true);
  };
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400){
        p.resolve(this.response);
        cb(this.response, true);
      } else {
        p.reject(this);
        cb(this, true);
      }
    }
  };
  if (type) {
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send($dtk.param(b));
  } else {
    xhr.send();
  }
  xhr = null;
  return p.promise();
};

/**
 * Deferred and When for ki.js by James Doyle (james2doyle)
 * ---
 * ki.js homepage https://github.com/dciccale/ki.js
 * Almost a straigh copy from
 * https://github.com/warpdesign/deferred-js by Nicolas Ramz
 */
(function(ki) {


  function foreach(arr, handler) {
    if (isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        handler(arr[i]);
      }
    } else
      handler(arr);
  }

  function D(fn) {
    var status = 'pending',
      doneFuncs = [],
      failFuncs = [],
      progressFuncs = [],
      resultArgs = [],

      promise = {
        done: function() {
          for (var i = 0; i < arguments.length; i++) {
            // skip any undefined or null arguments
            if (!arguments[i]) {
              continue;
            }

            if (isArray(arguments[i])) {
              var arr = arguments[i];
              for (var j = 0; j < arr.length; j++) {
                // immediately call the function if the deferred has been resolved
                if (status === 'resolved') {
                  arr[j].apply(this, resultArgs);
                }

                doneFuncs.push(arr[j]);
              }
            } else {
              // immediately call the function if the deferred has been resolved
              if (status === 'resolved') {
                arguments[i].apply(this, resultArgs);
              }

              doneFuncs.push(arguments[i]);
            }
          }

          return this;
        },

        fail: function() {
          for (var i = 0; i < arguments.length; i++) {
            // skip any undefined or null arguments
            if (!arguments[i]) {
              continue;
            }

            if (isArray(arguments[i])) {
              var arr = arguments[i];
              for (var j = 0; j < arr.length; j++) {
                // immediately call the function if the deferred has been resolved
                if (status === 'rejected') {
                  arr[j].apply(this, resultArgs);
                }

                failFuncs.push(arr[j]);
              }
            } else {
              // immediately call the function if the deferred has been resolved
              if (status === 'rejected') {
                arguments[i].apply(this, resultArgs);
              }

              failFuncs.push(arguments[i]);
            }
          }

          return this;
        },

        always: function() {
          return this.done.apply(this, arguments).fail.apply(this, arguments);
        },

        progress: function() {
          for (var i = 0; i < arguments.length; i++) {
            // skip any undefined or null arguments
            if (!arguments[i]) {
              continue;
            }

            if (isArray(arguments[i])) {
              var arr = arguments[i];
              for (var j = 0; j < arr.length; j++) {
                // immediately call the function if the deferred has been resolved
                if (status === 'pending') {
                  progressFuncs.push(arr[j]);
                }
              }
            } else {
              // immediately call the function if the deferred has been resolved
              if (status === 'pending') {
                progressFuncs.push(arguments[i]);
              }
            }
          }

          return this;
        },

        then: function() {
          // fail callbacks
          if (arguments.length > 1 && arguments[1]) {
            this.fail(arguments[1]);
          }

          // done callbacks
          if (arguments.length > 0 && arguments[0]) {
            this.done(arguments[0]);
          }

          // notify callbacks
          if (arguments.length > 2 && arguments[2]) {
            this.progress(arguments[2]);
          }
        },

        promise: function(obj) {
          if (typeof(obj) === 'undefined') {
            return promise;
          } else {
            for (var i in promise) {
              obj[i] = promise[i];
            }
            return obj;
          }
        },

        state: function() {
          return status;
        },

        debug: function() {
          console.log('[debug]', doneFuncs, failFuncs, status);
        },

        isRejected: function() {
          return status === 'rejected';
        },

        isResolved: function() {
          return status === 'resolved';
        },

        pipe: function(done, fail, progress) {
          return D(function(def) {
            foreach(done, function(func) {
              // filter function
              if (typeof func === 'function') {
                deferred.done(function() {
                  var returnval = func.apply(this, arguments);
                  // if a new deferred/promise is returned, its state is passed to the current deferred/promise
                  if (returnval && typeof returnval === 'function') {
                    returnval.promise().then(def.resolve, def.reject, def.notify);
                  } else { // if new return val is passed, it is passed to the piped done
                    def.resolve(returnval);
                  }
                });
              } else {
                deferred.done(def.resolve);
              }
            });

            foreach(fail, function(func) {
              if (typeof func === 'function') {
                deferred.fail(function() {
                  var returnval = func.apply(this, arguments);

                  if (returnval && typeof returnval === 'function') {
                    returnval.promise().then(def.resolve, def.reject, def.notify);
                  } else {
                    def.reject(returnval);
                  }
                });
              } else {
                deferred.fail(def.reject);
              }
            });
          }).promise();
        }
      },

      deferred = {
        resolveWith: function(context) {
          if (status === 'pending') {
            status = 'resolved';
            var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
            for (var i = 0; i < doneFuncs.length; i++) {
              doneFuncs[i].apply(context, args);
            }
          }
          return this;
        },

        rejectWith: function(context) {
          if (status === 'pending') {
            status = 'rejected';
            var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
            for (var i = 0; i < failFuncs.length; i++) {
              failFuncs[i].apply(context, args);
            }
          }
          return this;
        },

        notifyWith: function(context) {
          if (status === 'pending') {
            var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
            for (var i = 0; i < progressFuncs.length; i++) {
              progressFuncs[i].apply(context, args);
            }
          }
          return this;
        },

        resolve: function() {
          return this.resolveWith(this, arguments);
        },

        reject: function() {
          return this.rejectWith(this, arguments);
        },

        notify: function() {
          return this.notifyWith(this, arguments);
        }
      }

    var obj = promise.promise(deferred);

    if (fn) {
      fn.apply(obj, [obj]);
    }

    return obj;
  }

  var when = function() {
    if (arguments.length < 2) {
      var obj = arguments.length ? arguments[0] : undefined;
      if (obj && (typeof obj.isResolved === 'function' && typeof obj.isRejected === 'function')) {
        return obj.promise();
      } else {
        return D().resolve(obj).promise();
      }
    } else {
      return (function(args) {
        var df = D(),
          size = args.length,
          done = 0,
          rp = new Array(size); // resolve params: params of each resolve, we need to track down them to be able to pass them in the correct order if the master needs to be resolved

        for (var i = 0; i < args.length; i++) {
          (function(j) {
            var obj = null;

            if (args[j].done) {
              args[j].done(function() {
                rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                if (++done == size) {
                  df.resolve.apply(df, rp);
                }
              })
                .fail(function() {
                  df.reject(arguments);
                });
            } else {
              obj = args[j];
              args[j] = new Deferred();

              args[j].done(function() {
                rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                if (++done == size) {
                  df.resolve.apply(df, rp);
                }
              })
                .fail(function() {
                  df.reject(arguments);
                }).resolve(obj);
            }
          })(i);
        }
        return df.promise();
      })(arguments);
    }
  };
  /**
   * bind these new functions to ki
   */
  ki.Deferred = D;
  ki.when = D.when = when;
})($dtk);
})();
