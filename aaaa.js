if (self.CavalryLogger) {
    CavalryLogger.start_js_script(document.currentScript);
}
/*FB_PKG_DELIM*/

__d("MAjaxifyFormTypes", [], (function(a, b, c, d, e, f) {
    e.exports = {
        PAGELOAD: "pageload",
        NOCACHE: "nocache",
        CACHE: "cache"
    }
}
), null);
__d("MAjaxify", ["CSS", "DOM", "ErrorUtils", "LoadingIndicator", "MAjaxifyFormTypes", "MHistory", "MLegacyDataStore", "MPageCache", "MPageControllerPath", "MRequest", "MRequestTypes", "Stratcom", "URI"], (function(a, b, c, d, e, f) {
    var g, h, i = {
        postprocess: function(a) {
            b("MPageCache").addCachedIUIResponse(b("MPageControllerPath").getRequestPath(), a.response)
        }
    };
    function j(a, b) {
        return (" " + a.className + " ").indexOf(" " + b + " ") > -1
    }
    function k(a, b) {
        while (a && !j(a, b))
            a = a.parentNode;
        return a
    }
    function l(a, c, d, e, f) {
        e = e || "async_elem";
        a && (a.preventDefault(),
        a.stopPropagation());
        if (c) {
            var g = k(c, e) || c
              , h = e + "_saving";
            if (j(g, h))
                return !1;
            b("CSS").conditionClass(g, e + "_preprocess", !0);
            a = function(a) {
                b("CSS").conditionClass(g, e, !a),
                b("CSS").conditionClass(g, h, a),
                b("Stratcom").invoke(a ? "m:ajax:saving:start" : "m:ajax:saving:complete", null, g)
            }
            ;
            d.listen("start", a.bind(null, !0));
            d.listen("finally", a.bind(null, !1))
        }
        d.setType(b("MRequestTypes").INDEPENDENT);
        for (var c = 0, a = f.length; c < a; c++) {
            var i = f[c];
            for (var l in i)
                d.listen(l, i[l])
        }
        d.send();
        return !1
    }
    var m = ["input", "textarea", "select", "button", "object"];
    function n(a, c) {
        for (var d = 0; d < m.length; d++) {
            var e = b("DOM").scry(a, m[d]);
            for (var f = 0; f < e.length; f++) {
                var g = b("MLegacyDataStore").get(e[f]);
                c ? (g.wasDisabled = e[f].disabled,
                e[f].disabled = !0) : e[f].disabled = g.wasDisabled
            }
        }
    }
    function o(a, c, d) {
        this.start = function() {
            if (d)
                return;
            n(a, !0)
        }
        ,
        this.process = function(b) {
            if (d)
                return;
            n(a, !1);
            a.reset();
            if (document.createEvent && a.dispatchEvent) {
                b = document.createEvent("HTMLEvents");
                b.initEvent("reset", !0, !0);
                a.dispatchEvent(b)
            }
        }
        ,
        this.error = this.fail = function(d) {
            n(a, !1),
            c == b("MAjaxifyFormTypes").PAGELOAD && b("LoadingIndicator").hide()
        }
        ,
        this.postprocess = function(a) {
            c == b("MAjaxifyFormTypes").PAGELOAD && b("LoadingIndicator").hide(),
            c == b("MAjaxifyFormTypes").CACHE && i.postprocess(a),
            b("Stratcom").invoke("m:ajax:complete")
        }
    }
    var p = null;
    document.addEventListener("click", function(a) {
        a = a.target;
        (a.tagName === "INPUT" || a.tagName === "BUTTON") && a.type == "submit" && (p = a)
    }, !0);
    function q(a, b, c, d, e) {
        return l(a, b, c, d, e ? [i].concat(e) : [i])
    }
    function a(a, c, d, e) {
        return !c || (a.which || a.button) >= 2 ? !0 : q(a, a.target, new (b("MRequest"))(c), d, e)
    }
    function c(a, c, d, e, f, i, j, k, m) {
        m === void 0 && (m = !1);
        return (g || (g = b("ErrorUtils"))).guard(function() {
            if (!c || !c.hasAttribute("action") || c.getAttribute("action") === "")
                return !0;
            var g = b("DOM").convertFormToDictionary(c);
            p && (g[p.name] = p.value,
            p = null);
            var k = new (b("MRequest"))(c.getAttribute("action"));
            k.processResponseAfterPageTransitions = m;
            k.addData(g);
            k.setMethod(c.method || "POST");
            var n = null;
            if (e === b("MAjaxifyFormTypes").PAGELOAD) {
                if (c.method.toUpperCase() === "GET") {
                    g = new (h || (h = b("URI")))(c.getAttribute("action")).qualify().addQueryData(g);
                    b("MHistory").pushState(g)
                }
                b("LoadingIndicator").show()
            } else
                n = i ? null : f || c;
            j || (j = []);
            j.push(new o(c,e,i));
            b("Stratcom").invoke("MAjaxify.form.ajax.start", "", k);
            console.log(a, n, k, d, j)
            console.log(l.toString())
            return l(a, n, k, d, j)
        }, "MAjaxify.form")()
    }
    f.ajaxify = q;
    f.form = c;
    f.link = a
}
), null);
__d("legacy:m-ajaxify-js", ["MAjaxify"], (function(a, b, c, d, e, f) {
    a.MAjaxify = b("MAjaxify")
}
), 3);
__d("MLogoutClearCache", ["MCache", "Stratcom"], (function(a, b, c, d, e, f, g) {
    c("Stratcom").listen("click", "logout", d("MCache").clear)
}
), 34);
__d("TypeaheadNormalizer", [], (function(a, b, c, d, e, f) {
    a = {
        normalize: function(a) {
            return ("" + a).toLocaleLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/ +/g, " ").replace(/^\s*|\s*$/g, "")
        }
    };
    e.exports = a
}
), null);
__d("TypeaheadSource", ["DOM", "TypeaheadNormalizer", "createDeprecatedProperties", "err", "eventsMixinDeprecated"], (function(a, b, c, d, e, f) {
    a = function() {
        "use strict";
        function a(a) {
            a = a || {},
            this.disableLongerQueryCacheHit = a.disableLongerQueryCacheHit,
            this._raw = {},
            this._lookup = {},
            this._firstSeenOnValue = {},
            this.setNormalizer(b("TypeaheadNormalizer").normalize),
            this._excludeIDs = {}
        }
        var c = a.prototype;
        c.bindToTypeahead = function(a) {
            this._changeListener = a.listen("change", this.didChange.bind(this)),
            this._startListener = a.listen("start", this.didStart.bind(this)),
            this._clearListener = a.listen("clear", this.didClear.bind(this))
        }
        ;
        c.unbindFromTypeahead = function() {
            this._changeListener.remove(),
            this._startListener.remove(),
            this._clearListener.remove(),
            this._clearListener = null
        }
        ;
        c.didChange = function(a) {
            return
        }
        ;
        c.didStart = function() {
            return
        }
        ;
        c.didClear = function() {
            return
        }
        ;
        c.clearCache = function() {
            this._raw = {},
            this._lookup = {}
        }
        ;
        c.addExcludeID = function(a) {
            a && (this._excludeIDs[a] = !0)
        }
        ;
        c.removeExcludeID = function(a) {
            a && delete this._excludeIDs[a]
        }
        ;
        c.addResult = function(a, c) {
            a = (this.getTransformer() || this._defaultTransformer)(a);
            if (a.id in this._raw)
                return;
            this._raw[a.id] = a;
            this._firstSeenOnValue[a.id] = this._firstSeenOnValue[a.id] || c;
            c = this.tokenize(a.tokenizable || a.name);
            for (var d = 0; d < c.length; ++d) {
                this._lookup[c[d]] = this._lookup[c[d]] || [];
                if (Object.prototype.toString.call(this._lookup[c[d]]) !== "[object Array]")
                    throw b("err")("Lookup entry was not an array. key: %s. value: %s", c[d], this._lookup[c[d]]);
                this._lookup[c[d]].push(a.id)
            }
        }
        ;
        c.waitForResults = function() {
            this.invoke("waiting");
            return this
        }
        ;
        c.getResult = function(a) {
            return this._raw[a]
        }
        ;
        c.emptyResults = function() {
            return []
        }
        ;
        c.getMatchedResults = function(a) {
            var b = [];
            if (a === "")
                b = this.emptyResults();
            else {
                var c = a
                  , d = {}
                  , e = {}
                  , f = {}
                  , g = {}
                  , h = this.getQueryExtractor();
                h && (a = h(a));
                h = this.tokenize(a);
                var i = h[h.length - 1];
                h.sort(function(a, b) {
                    return b.length - a.length
                });
                for (var j = 0; j < h.length; ++j) {
                    if (h[j]in g) {
                        h.splice(j--, 1);
                        continue
                    }
                    g[h[j]] = !0;
                    var k = h[j];
                    for (var l in this._lookup) {
                        var m = this.checkFragmentMatches(l, k, c, i);
                        if (m) {
                            if (!(l in f))
                                f[l] = !0;
                            else
                                continue;
                            m = this._lookup[l];
                            for (var n = 0; n < m.length; ++n) {
                                var o = m[n];
                                e[o] || (e[o] = {});
                                k in e[o] || (e[o][k] = !0,
                                d[o] = (d[o] || 0) + 1)
                            }
                        }
                    }
                }
                for (var o in d)
                    d[o] == h.length && !this._excludeIDs[o] && (!this.disableLongerQueryCacheHit || !this._firstSeenOnValue[o] || this._firstSeenOnValue[o].length <= a.length) && b.push(o)
            }
            this.sortHits(a, b);
            return this.renderNodes(a, b)
        }
        ;
        c.checkFragmentMatches = function(a, b, c, d) {
            return a.substr(0, b.length) === b
        }
        ;
        c.matchResults = function(a) {
            a = this.getMatchedResults(a);
            this.invoke("resultsready", a);
            this.invoke("complete")
        }
        ;
        c.sortHits = function(a, b) {
            var c = [], d;
            for (d = 0; d < b.length; d++)
                c.push(this._raw[b[d]]);
            var e = function(a, b) {
                a = a.sort || a.name;
                b = b.sort || b.name;
                return a.localeCompare(b)
            }
              , f = this.getSortHandler() || function(a, b, c) {
                b.sort(c)
            }
            ;
            f.call(this, a, c, e);
            b.splice(0, b.length);
            for (d = 0; d < c.length; d++)
                b.push(c[d].id)
        }
        ;
        c.renderNodes = function(a, b) {
            a = Math.min(this.getMaximumResultCount(), b.length);
            var c = [];
            for (var d = 0; d < a; d++)
                if (b[d]in this._raw) {
                    var e = this._raw[b[d]];
                    this.clientRendered || (e = this.createNode(e));
                    c.push(e)
                }
            return c
        }
        ;
        c.createNode = function(a) {
            return b("DOM").create("a", {
                sigil: "typeahead-result",
                href: a.uri,
                name: a.name,
                rel: a.id,
                className: "jx-result"
            }, a.display)
        }
        ;
        c.normalize = function(a) {
            return this.getNormalizer()(a)
        }
        ;
        c.tokenize = function(a) {
            a = this.normalize(a);
            return !a.length ? [] : a.split(/\s/g)
        }
        ;
        c._defaultTransformer = function(a) {
            return {
                name: a[0],
                display: a[0],
                uri: a[1],
                id: a[2]
            }
        }
        ;
        return a
    }();
    b("eventsMixinDeprecated")(a, ["waiting", "resultsready", "complete", "after_complete", "initial_render", "initial_results_ready", "req_dispatch", "req_sent", "req_recv", "unlock_render"]);
    b("createDeprecatedProperties")(a, {
        normalizer: null,
        queryExtractor: null,
        transformer: null,
        maximumResultCount: 5,
        sortHandler: null
    });
    Object.assign(a.prototype, {
        _raw: null,
        _lookup: null,
        _firstOnValue: null,
        _excludeIDs: null,
        _changeListener: null,
        _startListener: null,
        _clearListener: null,
        clientRendered: !1
    });
    e.exports = a
}
), null);
__d("InitMAjaxify", ["MAjaxify", "MLegacyDataStore", "MLinkHack", "MRequest", "Stratcom"], (function(a, b, c, d, e, f) {
    var g = {};
    function h(a) {
        g[a] = g[a] || new RegExp("(^|\\s+)" + a + "(\\s+|$)");
        return g[a]
    }
    function a(a, b) {
        a = a.className || "";
        return a.match(h(b))
    }
    b("Stratcom").listen("click", "ajaxify", function(a) {
        a.prevent();
        var c = a.getNode("ajaxify")
          , d = c.getAttribute("data-ajaxify-class")
          , e = c.getAttribute("data-confirm-text");
        if (e && !confirm(e))
            return;
        var f = b("MLegacyDataStore").get(c);
        if (f.loading)
            return;
        f.loading = !0;
        e = function() {
            f && (f.loading = f.request = null),
            f = null
        }
        ;
        var g = function() {
            b("Stratcom").invoke("m:ajax:complete")
        };
        e = {
            "finally": e,
            postprocess: g
        };
        g = b("MLinkHack").remove(c);
        var h = c.getAttribute("data-ajaxify-href") || c.getAttribute("href");
        if (c.getAttribute("data-method") === "post") {
            var i = new (b("MRequest"))(h);
            i.setAutoRetry(!0);
            f.request = i;
            b("MAjaxify").ajaxify(a.getRawEvent(), c, i, d, null)
        } else
            b("MAjaxify").link(a.getRawEvent(), h, d, e);
        g && b("MLinkHack").add(c)
    })
}
), null);
__d("MModalDialogLink", ["MLegacyDataStore", "MModalDialog", "MPageController", "Stratcom"], (function(a, b, c, d, e, f) {
    var g = "dialog-link";
    b("Stratcom").listen("click", g, function(a) {
        a.prevent();
        var c = a.getNode(g);
        switch (c.getAttribute("rel")) {
        case "dialog":
            b("MModalDialog").open(b("MLegacyDataStore").get(a.getNode(g)).dialogURI, function(a) {
                a && (a.redirectURI ? b("MPageController").forceLoad(a.redirectURI) : a.refresh && b("MPageController").reload())
            }, c.getAttribute("data-loading-title"));
            break;
        case "dialog-load":
            b("MModalDialog").load(b("MLegacyDataStore").get(a.getNode(g)).dialogURI, {
                dontPushState: !1,
                hideNavBar: !1
            }, c.getAttribute("data-loading-title"));
            break;
        case "dialog-close":
            b("MModalDialog").close({
                redirectURI: b("MLegacyDataStore").get(a.getNode(g)).dialogURI,
                goBack: !0
            });
            break;
        case "dialog-close-and-navigate":
            b("MModalDialog").close({
                redirectURI: b("MLegacyDataStore").get(a.getNode(g)).dialogURI,
                goBack: !1
            });
            break;
        case "dialog-close-and-refresh":
            b("MModalDialog").close({
                refresh: !0,
                goBack: !0
            });
            break
        }
    })
}
), null);
__d("XThisControllerNoLongerExistsController", ["XController"], (function(a, b, c, d, e, f) {
    e.exports = b("XController").create("/dcb/tcnle/", {
        t: {
            type: "String"
        }
    })
}
), null);
__d("findTag", ["$", "fb-error-lite"], (function(a, b, c, d, e, f, g) {
    a = function(a, b) {
        var d = c("$")(a);
        if (!b) {
            if (d instanceof HTMLElement)
                return d;
            var e = c("fb-error-lite").err('Element with ID "%s" is not an HTMLElement', a);
            e.taalOpcodes = [c("fb-error-lite").TAALOpcode.PREVIOUS_FILE];
            throw e
        }
        e = d.tagName.toLowerCase();
        if (e !== b) {
            a = c("fb-error-lite").err('Expected $("%s") to be of type "%s" but got "%s" instead.', a, b, e);
            a.taalOpcodes = a.taalOpcodes || [];
            a.taalOpcodes = [c("fb-error-lite").TAALOpcode.PREVIOUS_FILE];
            throw a
        }
        return d
    }
    ;
    b = a;
    g["default"] = b
}
), 98);
__d("ThisControllerNoLongerExists", ["XControllerURIBuilder", "XThisControllerNoLongerExistsController"], (function(a, b, c, d, e, f, g) {
    "use strict";
    var h = function(b) {
        babelHelpers.inheritsLoose(a, b);
        function a(a) {
            var c;
            c = b.call(this, "/dcb/tcnle/", {}) || this;
            c.$XControllerURIBuilderNoOpDead1 = a;
            return c
        }
        var d = a.prototype;
        d.__validateRequiredParamsExistence = function() {}
        ;
        d.__assertParamExists = function(a) {}
        ;
        d.__setParam = function(a, b, c) {
            return this
        }
        ;
        d.__setParamInt = function(a, b) {}
        ;
        d.getRequest_LEGACY_UNTYPED = function(a) {
            return a.setURI(this.getURI())
        }
        ;
        d.getURI = function() {
            return c("XThisControllerNoLongerExistsController").getURIBuilder().setString("t", this.$XControllerURIBuilderNoOpDead1).getURI()
        }
        ;
        d.getLookasideURI = function() {
            return this.getURI()
        }
        ;
        return a
    }(c("XControllerURIBuilder"));
    function a(a) {
        return c("XThisControllerNoLongerExistsController").getURIBuilder().setString("t", a).getURI()
    }
    function b(a) {
        return new h(a)
    }
    g.__DEADURI__ = a;
    g.__DEADBUILDER__ = b
}
), 98);
