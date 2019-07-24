(function (window) {
    //useragent
    var userAgent = (function () {
        var ua = window.navigator.userAgent;
        var isPC = true;
        var version = navigator.userAgent.match(/(?:MSIE|chrome)[\s\d\.\/]*/i);
        if (/Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/gi.test(ua)) {
            isPC = false;
        }
        return {
            ua: ua,
            isPC: isPC,
            browser: version ? version[0] : '',
            isAndroid: ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
            isiOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            isWinXin: ua.indexOf('MicroMessenger') > -1,
            os: navigator.platform
        }
    })();


    var XHR = window.XMLHttpRequest ? function () {
        return new window.XMLHttpRequest()
    } : function () {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (e) {}
    };

    //type
    var Type = (function () {
        var toString = Object.prototype.toString;
        return {
            isString: function (val) {
                return toString.call(val) === "[object String]"
            },
            isArray: function (val) {
                return toString.call(val) === "[object Array]"
            },
            isFunction: function (val) {
                return toString.call(val) === "[object Function]"
            },
            isPlainObject: function (val) {
                return val && toString.call(val) === "[object Object]" && !val.nodeType && !val.setInterval
            },
            isEmptyObject: function (val) {
                for (var c in val) return !1;
                return !0
            }
        }
    })();

    //cookie
    var Cookie = {
        set: function (name, val, expire, domain, path, secure) {
            expire || (expire = 1000);
            path || (path = "/");
            expire *= 864E5;
            var k = new Date((new Date).getTime() + expire);
            var cookie = "";
            cookie += (name + "=" + encodeURIComponent(val));
            cookie += (expire ? ";expires=" + k.toGMTString() : "");
            cookie += (path ? ";path=" + path : "");
            cookie += (domain ? ";domain=" + domain : "");
            cookie += (secure ? ";secure" : "");

            document.cookie = cookie;
        },
        get: function (name) {
            for (var cookies = document.cookie.split("; "), a = 0; a < cookies.length; a++) {
                var keyval = cookies[a].split("=");
                if (name == keyval[0]) try {
                    return decodeURIComponent(keyval[1])
                }
                catch (e) {
                    return null
                }
            }
            return null
        },
        del: function (name, domain, path) {
            var cookie = name + "=1";
            cookie += (path ? "; path=" + path : "; path=/");
            cookie += (domain ? "; domain=" + domain : "");
            cookie += ";expires=Fri, 02-Jan-1970 00:00:00 GMT";
            document.cookie = cookie;
        },
        getDomain: function () {
            return "." + location.host.split(".").slice(-2).join(".")
        }
    };



    function extend(ori, ext, isrewrite) {
        if (!ext || !ori) return ori;
        isrewrite === undefined && (isrewrite = !0);
        for (var key in ext)
            if (isrewrite || !(key in ori)) ori[key] = ext[key];
        return ori
    }


    function uuidv4(options, buf, offset) {
      	var rng;
        var global = window;
        var crypto = global.crypto || global.msCrypto; // for IE 11
        if (crypto && crypto.getRandomValues) {
          // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
          var rnds8 = new Uint8Array(16);
          rng = function whatwgRNG() {
            crypto.getRandomValues(rnds8);
            return rnds8;
          };
        }

        if (!rng) {
          // Math.random()-based (RNG)
          //
          // If all else fails, use Math.random().  It's fast, but is of unspecified
          // quality.
          var  rnds = new Array(16);
          rng = function() {
            for (var i = 0, r; i < 16; i++) {
              if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
              rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
            }

            return rnds;
          };
        }

        var byteToHex = [];
        for (var i = 0; i < 256; ++i) {
          byteToHex[i] = (i + 0x100).toString(16).substr(1);
        }

        var byteToHex = [];
        for (var i = 0; i < 256; ++i) {
          byteToHex[i] = (i + 0x100).toString(16).substr(1);
        }

        function bytesToUuid(buf, offset) {
          var i = offset || 0;
          var bth = byteToHex;
          return  bth[buf[i++]] + bth[buf[i++]] +
                  bth[buf[i++]] + bth[buf[i++]] + '-' +
                  bth[buf[i++]] + bth[buf[i++]] + '-' +
                  bth[buf[i++]] + bth[buf[i++]] + '-' +
                  bth[buf[i++]] + bth[buf[i++]] + '-' +
                  bth[buf[i++]] + bth[buf[i++]] +
                  bth[buf[i++]] + bth[buf[i++]] +
                  bth[buf[i++]] + bth[buf[i++]];
        }

        if (typeof(options) == 'string') {
          buf = options == 'binary' ? new Array(16) : null;
          options = null;
        }
        options = options || {};

        var rnds = options.random || (options.rng || rng)();

        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;

        // Copy bytes to buffer, if provided
        if (buf) {
          for (var ii = 0; ii < 16; ++ii) {
            buf[i + ii] = rnds[ii];
          }
        }

        return buf || bytesToUuid(rnds);
    }

    function prototype(ori, ext) {
        if (!ext || !ori) return ori;
        var d = ext.prototype,
            j = function (d) {
                function b() {}
                b.prototype = d;
                return new b
            }(d);

        j.constructor = ori;
        extend(ori.prototype, j);
        ori.superclass = d;
        return ori
    }


    function each(obj, fun, context) {
        var length = obj.length,
            isPlainObjectOrFun = length === undefined || Type.isFunction(obj);

        context = context || window;
        if (isPlainObjectOrFun) {
            for (var g in obj) {
                if (fun.call(context, obj[g], g, obj) === !1) break;
            }
        }
        else {
            for (var index = 0; index < length; index++) {
                if (fun.call(context, obj[index], index, obj) === !1) break;
            }
        }
        return obj
    }

    function parseURL(url) {
        var arr = /^(?:((?:http|https|ftp|news):)\/\/)?([^\/:]*)(?:\:(\d+))?([^\?]*)(\?[^?#]+)?(#.+)?/i.exec(url);

        var _search = arr[5];
        var _query, _queryObj = null;

        if (_search) {
            _query = _search.slice(1).split("&");
            each(_query, function (keyval, index) {
                keyval = keyval.split("=");
                _queryObj = _queryObj || {};
                _queryObj[keyval[0]] = keyval[1];
            })
        }
        return {
            hash: arr[6] || '',
            pathname: arr[4],
            protocol: arr[1],
            hostname: arr[2],
            search: arr[5],
            port: arr[3],
            query: _queryObj
        }
    }

    //数据存储&事件bind
    function Data() {}

    Data.prototype = {
        cache: {},
        execCache: {},
        get: function (key) {
            return key && Type.isString(key) ? this.cache[key] : this.cache;
        },
        on: function (key, value, callback) {
            if (!callback) {
                if (Type.isFunction(value)) {
                    callback = value;
                    value = null;
                }
            }
            var execCache = this.execCache[key];
            if (execCache && execCache.length) {
                for (var i = 0; i < execCache.length; i++) {
                    var item = execCache[i];
                    item && callback && callback.call(this, extend(value || {}, item.val));
                    execCache.splice(i, 1);
                }
            }
            if (Type.isString(key)) {
                this.cache[key] = this.cache[key] || [];
                this.cache[key].push({
                    val: value,
                    fun: callback
                });
            }
            return this;
        },
        off: function (key) {
            if (!key) {
                this.cache = {};
            }
            else if (Type.isString(key)) {
                delete this.cache[key];
            }
            return this;
        },
        exec: function (key, value) {
            var data = this.get(key),
                item;

            if (!data || !data.length) {
                this.execCache[key] = this.execCache[key] || [];
                this.execCache[key].push({
                    val: value
                })
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    item = data[i];
                    item && item.fun && item.fun.call(this, value ? extend(item.val || {}, value) : item.val);
                    //data.splice(i, 1);
                }
            }

            return this;
        },
        constructor: Data
    }

    //本地存储s
    function Storage() {}

    Storage.prototype.getItem = function (key) {
        return JSON.parse(localStorage.getItem(key))
    }

    Storage.prototype.setItem = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    }


    //参数
    function Parameters() {}

    Parameters.prototype = {
        creatId: function () {
            var a1 = parseInt(Math.random() * 10E15) + '';
            var a2 = parseInt(Math.random() * 10E15) + '';
            return a1 + a2;
        },

      	getCookieId:function(){
      		var cookieId =  Cookie.get('ymt_cookieid') + '';
      		if (!cookieId || (cookieId && !cookieId.match(/^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i))){
      			cookieId = uuidv4().toUpperCase();
      			Cookie.set('ymt_cookieid', cookieId, null, '.ymatou.com')
      		}
      		return cookieId;
      	},

        getHashCode: function (str, isCase) {
            if (!isCase) {
                str = str.toLowerCase();
            }
            // 1315423911=b'1001110011001111100011010100111'
            var hash = 1315423911,
                i, ch;
            for (i = str.length - 1; i >= 0; i--) {
                ch = str.charCodeAt(i);
                hash ^= ((hash << 5) + ch + (hash >> 2));
            }
            return (hash & 0x7FFFFFFF);
        },
        getParams: function (Params) {

            return this.toParameter(this.getObjectParams(Params));
        },

        reSetPageViewId: function () {
            this.pageViewId = this.creatId();
        },

        getObjectParams: function (Params) {
            var cookieid = appversion = imei = idfa = null;
            var reffer = window.document.referrer;
            var url = window.location.href.toLowerCase();
            var URL = parseURL(url);
            var query = URL.query;
            var source = query && query._ac || '';
            var appname = query && query.appname;
            var isMiniApp = (window && window.__wxjs_environment === 'miniprogram') || (query && query.isMiniApp)
            var appid = null;

            if (userAgent.isAndroid) {
                cookieid = query && query.devicetoken || '';
                cookieid = (cookieid == 'nil' || cookieid == null || cookieid == 'null') ? '' : cookieid;
                appversion = query && query.currentversion || '';
                // imei = query && query.imei || '';
            }
            else if (userAgent.isiOS) {
                cookieid = query && query.deviceid || '';
                cookieid = (cookieid == 'nil' || cookieid == null || cookieid == 'null') ? '' : cookieid;
                appversion = query && query.versioninfo || '';
                // idfa = query && query.idfa || '';
            }

            if (appname) {
                if (appname.toLowerCase() == 'buyer') {
                    appid = 1;
                    if (userAgent.isWinXin) appid = 5;
                }
                if (appname.toLowerCase() == 'seller') {
                    appid = 2;
                    if (userAgent.isWinXin) appid = 6;
                }
            }

            if (isMiniApp) {
                appid = 10
            }

            function getMetaObject() {
                var meta = document.getElementsByName('x-pageView-id');
                if (meta.length) {
                    return {
                        pageviewid: meta[0].content
                    };
                }
                return null;
            }

            var defaultParames = {
                cookieid: this.getCookieId(),
                osid: userAgent.isPC ? 4 : userAgent.isAndroid ? 2 : userAgent.isiOS ? 1 : '', //操作平台 pc:1 and:2 ios:3
                appid: appid, //具体某个app的标识，pc端不需要. 1:神器买家app, 2:神器买手app, 5:神器买家weixin, 6:神器买手weixin
                appversion: appversion, //app版本号
                pageviewid: this.pageViewId, //唯一请求标识
                pagetype: '', //页面类型，每个操作页面都有pagetype，具体值请参考页面类型表
                module_name: '', //请求所在模块的名称
                sub_module_name: '', //请求所在子模块的名称
                module_page: '', //模块列表的分页号
                module_index: '', //所在具体模块中的位置(滑动事件是滑动开始位置)
                longitude: '', //经度，float型(pc端可以后端获取)
                latitude: '', //纬度，float型(pc端可以后端获取)
                wifiid: '', //wifi热点id
                cellid: '', //基站id
                userid: query && query.userid || '', //登录用户id
                useragent: encodeURI(userAgent.ua), //同一平台不同入口
                os: userAgent.os, //操作平台版本
                refferpvid: Cookie.get('refferpvid'), //上一级url的唯一请求标识
                reffer: reffer, //上一级url
                source: source, //url来源
                schema: '', //app端的schema地址，pc端不需要
                url: url, //请求的url地址
                keyword: '', //搜索关键字
                area: '', //只在首页有这个参数，取值范围(all,am,eu,as,au)
                module_end: '', //滑动事件模块的结束模块
                module_end_index: '', //页面滚动时的结束模块位置
                imei: imei, //Android 客户端设备唯一标识
                mac: '', //mac地址
                idfa: idfa, //IOS 客户端设备唯一标识
                action_param: '', //用于扩展参数，value是多参数的， 结合蓝色字段使用，格式：ap=A:xx,B:yy 只有一个值就是ap=A:xx,  比如 ap=tgt:show
                target: '', //用来说明action的目标行为，这个参数用在action_param参数的值上，不能独立使用
                keyword: query && query.k || '', //搜索关键字
                area: '', //只在首页有这个参数，取值范围(all,am,eu,as,au)
                mode: 'normal', //用来区分是测试的还是正式环境，取值为{test,normal}，默认为mode=normal
                origin: 'front', //区分服务端采集数据还是前端采集数据，取值为{server,front}
                action_type: Params && Params.action_type || 'none', //事件类型
		time:(new Date()).getTime()
            };

            var geolocation = navigator.geolocation;

            if (geolocation) {
                try {
                    geol.getCurrentPosition(function (position) {
                        defaultParames.longitude = position.coords.longitude;
                        defaultParames.latitude = position.coords.latitude;
                    })
                }
                catch (e) {}
            }

            Params = Params || {};

            var metaObject = getMetaObject();

            if (metaObject) {
                extend(defaultParames, metaObject);
                this.pageViewId = metaObject.pageviewid;
            }
            else {
                this.pageViewId = this.pageViewId || this.creatId();
            }

            return extend(defaultParames, Params);
        },

        toParameter: function (obj, sp) {
            var i, str = [];

            function build(a, b) {
                b = typeof b === "function" ? b() : b == null || b == undefined ? "" : b;
                if (typeof b === "object") {
                    each(b, function (m, n) {
                        build(a + "[" + n + "]", m);
                    })
                    return;
                }
                str.push(encodeURIComponent(a) + "=" + encodeURIComponent(b));
            }
            if (Type.isArray(obj) || Type.isPlainObject(obj)) {
                each(obj, function (a, b) {
                    build(b, a);
                });
            }
            return ('?' + str.join(sp || "&")).replace(/%20/g, "+");
        }
    }

    Parameters.prototype.constructor = Parameters;

    function EventHandle() {

    }

    EventHandle.prototype = {
        bind: function (targetSelect, eventType, callback) {
            document.documentElement.addEventListener
        },
        unbind: function (targetSelect, eventType) {

        },
        trigger: function (targetSelect, eventType) {

        }
    }

    function ExposurePointer() {
        var isTouch = 'ontouchend' in document;
        if (isTouch) {
            this.touchInit();
        }
    }

    ExposurePointer.prototype.touchInit = function () {

    }


    //埋点主类
    function Detection(config) {
        if (!(this instanceof Detection)) return new Detection(extend(config || {}, __CONFIG));
        this.config = config;
        this.scrollInterval = config.scrollInterval;
        this.params = config.params || {};
        this.pageViewId = this.creatId();
    }

    Detection.prototype = {
        /*
            {
                module_name:'',
                sub_module_name:'',
                module_index:''
            }
        */
        extend: extend,
        parseUrl: function (url) {
            url = url === null || url === undefined ? hui.window.location.href : String(url);
            var pair,
                query = {},
                loc = '',
                args = '',
                list,
                v,
                str = url.split('#'),
                href;

            if (~url.indexOf('?')) {
                // Parse ?aa=xxx
                pair = str[0].match(/^([^\?]*)(\?(.*))?$/);
                if (pair) {
                    //loc = pair[1];
                    args = (pair.length == 4 ? pair[3] : '') || '';
                }
                list = args ? args.split('&') : [];
                for (var i = 0, len = list.length; i < len; i++) {
                    v = list[i].split('=');
                    v.push('');
                    query[v[0]] = v[1];
                }
            }
            return query;
        },

        //发送打点请求方法
        send: function (param) {
            var config = this.config,
                me = this;
            var args = this.getObjectParams(this.extend(this.extend({}, this.params), param));
            args.is_html = 1;

            var urlObj = me.parseUrl(window.location.search);
            if (urlObj.pageviewid) args.pageviewid = urlObj.pageviewid;
            if (urlObj.refferpvid) args.refferpvid = urlObj.refferpvid;
            if (urlObj.refpagetype) args.refpagetype = urlObj.refpagetype;
            if (urlObj.pagetype) args.pagetype = urlObj.pagetype;
            if (urlObj.tab_id) args.tab_id = urlObj.tab_id;

            var data = this.toParameter(args);

            data += '&random=' + Math.random();
            // var xhr = XHR();
            // xhr.ret = {};

            // xhr.onreadystatechange = function () {
            //  var s, currentTime = new Date(),
            //      xml;
            //  if (xhr.readyState == 4) {
            //      s = xhr.status;
            //      if (s >= 200 && s < 300 || s === 304) {
            //          // xml = http.responseXML;

            //          // if (xml && xml.documentElement) {
            //          //  xhr.ret.responseXML = xml;
            //          // }
            //          // xhr.ret.responseText = http.responseText;
            //      }
            //  }
            //  else {
            //      if (xhr.status == 404 || (config.timeout && Math.floor((currentTime - time) / 1000) > config.timeout)) {
            //          xhr.abort();
            //      }
            //  }
            // }
            // 判断是否支持sendYLog协议，注：只有大于appVersion/2.6.3之的APP版本才支持
            // 买家版app user-agent格式：Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13E238 User-Agent/ saohuoApp appVersion/3.0.1 DeviceId=F733D756-A05B-438E-87EF-5C85523FECE7 Channel=appStore
            // 买手版app user-agent格式：02ios====8.1.2=1C720B2A-B0B3-4687-9B6F-69B7BD02A279============================3.0.0=appStore========
            var appType = window.navigator.userAgent.toLowerCase().indexOf('saohuoapp') > -1 ? 'maijiaApp' : 'maishouApp';
            args._dc_version = '1.4.0';
            if (appType === 'maijiaApp') {
                var sn = window.navigator.userAgent.match(/appVersion\/[0-9]\.[0-9]\.[0-9]/);
                sn = sn && sn.length ? sn[0] : 0;
                if (!userAgent.isPC && sn > 'appVersion/2.6.5') {
                    args.cookieid = '';
                    args.deviceid = '';
                    args.devicetoken = '';
                    args.appid = '';
                    args.idfa = '';
                    args.imei = '';
                    try {
                        delete args.cookieid;
                        delete args.deviceid;
                        delete args.devicetoken;
                        delete args.appid;
                        delete args.idfa;
                        delete args.imei;
                    }
                    catch (e) {}
                    window.setTimeout(function () {
                        var tt = {};
                        for (var i in args) {
                            if (args[i] !== '')
                                tt[i] = window.encodeURIComponent(args[i]);
                        }
                        var str;
                        if (userAgent.isAndroid) {
                            if (window.YmtApi && YmtApi.sendYLog) {
                                var m = {"data": JSON.stringify(tt)};
                                // alert(m);
                                return YmtApi.sendYLog(m);
                            }
                            str = '/forBuyerApp/sendYLog?Data=' + JSON.stringify(tt); // + window.encodeURIComponent(data.replace(/^\?/, ''));
                            window.location.href = str;
                        }
                        else {
                            if (sn > 'appVersion/3.1.1') {
                                var m = {"data": JSON.stringify(tt)};
                                // alert(m);
                                return YmtApi.sendYLog(m);
                            }

                            str = '/forBuyerApp/sendYLog?Data=' + window.encodeURIComponent(JSON.stringify(tt)); // + window.encodeURIComponent(data.replace(/^\?/, ''));
                            window.location.href = str;
                        }
                    }, 300);
                }
                else {
                    this.createImg(config.host + config.path + data);
                }
            } else {
                this.createImg(config.host + config.path + data);
            }
            return this;
        },

        fillCommon: function (param) {
            this.extend(this.params, param || {});
        },

        //发送图片请求
        createImg: function (src) {
            var img = new Image();
            img.id = Math.random();
            img.src = src;
            img.style.display = 'none';
            (document.body || document.documentElement).appendChild(img);

            window.setTimeout(Function('document.getElementById("' + img.id + '").src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";'), 4000);
            img = null;
        },


        getSpmObj: function (node) {

            var $ = window.$dtk || window.$ || window.jQuery || window.Zepto;

            function queryModuleAttr(node, name) {
                var _name;
                if (node.size() > 0) {
                    _name = node.attr(name);
                    if (_name) {
                        return _name;
                    }
                    else {
                        return queryModuleAttr(node.closest('[' + name + ']').eq(0), name)
                    }
                }
                else {
                    return null;
                }
            }

            node = $(node).eq(0);

            return {
                module_name: queryModuleAttr(node, 'module_name'),
                sub_module_name: queryModuleAttr(node, 'sub_module_name'),
                module_index: queryModuleAttr(node, 'module_index'),
                action_param: queryModuleAttr(node, 'action_param')
            };
        },

        bind: function (select, eventType, param) {
            var $ = window.$dtk || window.$ || window.jQuery || window.Zepto;
            var me = this;
            $(document.body).delegate(select, eventType, function () {
                var obj = me.extend(me.getSpmObj(this) || {}, param || {});
                me.send(obj);
            })
        }
    }

    var __CONFIG = {
        host: 'http://ymtlog.ymatou.com',
        method: 'post',
        path: '/lc/serverlog',
        scrollInterval: 2E3,
        timeout: 0
    };

    Detection.prototype.constructor = Detection;

    //继承parameters
    prototype(Detection, Parameters);
    prototype(Detection, Data);
    prototype(Detection, Storage);

    var _name_ = window['YmatouAnalyticsobject'] || '_dc_';

    var _dc_ = window[_name_] || {};

    var list = _dc_.q;

    var D = Detection();

    window[_name_] = function () {
        var fun = arguments[0];
        return D[fun] && D[fun].apply(D, Array.prototype.slice.call(arguments, 1));
    }

    window[_name_]("exec", "ready");

    if (list && list.length) {
        each(list, function (vals, n) {
            var fun = vals[0];
            D[fun] && D[fun].apply(D, Array.prototype.slice.call(vals, 1));
        });
    }

    var urlObj = D.parseUrl(window.location.search);
    if ((urlObj.utm_src || urlObj.utm_source) && (!window.YmtApi || !window.YmtApi.isSaohuoApp)) {
        var args = D.getObjectParams(D.extend(D.extend({}, D.params), urlObj));

        var str = 'http://app.ymatou.com/api/spread/dlclick';
        str = str + '?source=' + (urlObj.utm_src || urlObj.utm_source);
        str = str + '&did=' + (args.idfa || args.imei || '');
        str = str + '&clienttype=3';
        str = str + '&deviceid=' + (args.deviceid || args.cookieid || '');
        str = str + '&appversion=' + args.appversion;
        str = str + '&apptype=' + ((/\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua)) ? 'ios' : (/Android|Linux/i.test(ua)) ? 'android' : '');
        str = str + '&clicktime=' + String(new Date().getTime()).substr(0, 10);
        // str = str + '&devicetype=iphone,GT-9300';
        str = str + '&os=' + args.os;
        // str = str + '&wifimac=48:46:fb:f9:a3:10';
        str = str + '&adurl=' + window.encodeURIComponent(window.location.href);

        D.createImg(str);
    }

    // ymt biz push
    var biz_type = urlObj.biz_type;
    var biz_oid = urlObj.biz_oid;

    if (biz_type) {
        D.send && D.send({'action_type': 'deeplink_open', 'action_param': 'html', 'push_type': biz_type , 'push_id' : biz_oid});
    }


    //继承module
    //prototype(Detection, Modules);

    //haiyang
    window.hui && hui.define && hui.define('ext_gtm', [], function () {});

})(window)
