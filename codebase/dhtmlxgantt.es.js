/** @license

dhtmlxGantt v.9.0.13 Standard

This version of dhtmlxGantt is distributed under GPL 2.0 license and can be legally used in GPL projects.

To use dhtmlxGantt in non-GPL projects (and get Pro version of the product), please obtain Individual, Commercial, Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing or contact us at info@dhtmlx.com

(c) XB Software

*/
function V(t) {
  var e = 0, n = 0, i = 0, a = 0;
  if (t.getBoundingClientRect) {
    var r = t.getBoundingClientRect(), s = document.body, o = document.documentElement || document.body.parentNode || document.body, l = window.pageYOffset || o.scrollTop || s.scrollTop, c = window.pageXOffset || o.scrollLeft || s.scrollLeft, d = o.clientTop || s.clientTop || 0, u = o.clientLeft || s.clientLeft || 0;
    e = r.top + l - d, n = r.left + c - u, i = document.body.offsetWidth - r.right, a = document.body.offsetHeight - r.bottom;
  } else {
    for (; t; ) e += parseInt(t.offsetTop, 10), n += parseInt(t.offsetLeft, 10), t = t.offsetParent;
    i = document.body.offsetWidth - t.offsetWidth - n, a = document.body.offsetHeight - t.offsetHeight - e;
  }
  return { y: Math.round(e), x: Math.round(n), width: t.offsetWidth, height: t.offsetHeight, right: Math.round(i), bottom: Math.round(a) };
}
function Dn(t) {
  var e = !1, n = !1;
  if (window.getComputedStyle) {
    var i = window.getComputedStyle(t, null);
    e = i.display, n = i.visibility;
  } else t.currentStyle && (e = t.currentStyle.display, n = t.currentStyle.visibility);
  return e != "none" && n != "hidden";
}
function An(t) {
  return !isNaN(t.getAttribute("tabindex")) && 1 * t.getAttribute("tabindex") >= 0;
}
function In(t) {
  return !{ a: !0, area: !0 }[t.nodeName.loLowerCase()] || !!t.getAttribute("href");
}
function Mn(t) {
  return !{ input: !0, select: !0, textarea: !0, button: !0, object: !0 }[t.nodeName.toLowerCase()] || !t.hasAttribute("disabled");
}
function Lt(t) {
  for (var e = t.querySelectorAll(["a[href]", "area[href]", "input", "select", "textarea", "button", "iframe", "object", "embed", "[tabindex]", "[contenteditable]"].join(", ")), n = Array.prototype.slice.call(e, 0), i = 0; i < n.length; i++) n[i].$position = i;
  for (n.sort(function(r, s) {
    return r.tabIndex === 0 && s.tabIndex !== 0 ? 1 : r.tabIndex !== 0 && s.tabIndex === 0 ? -1 : r.tabIndex === s.tabIndex ? r.$position - s.$position : r.tabIndex < s.tabIndex ? -1 : 1;
  }), i = 0; i < n.length; i++) {
    var a = n[i];
    (An(a) || Mn(a) || In(a)) && Dn(a) || (n.splice(i, 1), i--);
  }
  return n;
}
function Xe() {
  var t = document.createElement("div");
  t.style.cssText = "visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;", document.body.appendChild(t);
  var e = t.offsetWidth - t.clientWidth;
  return document.body.removeChild(t), Math.max(e, 15);
}
function X(t) {
  if (!t) return "";
  var e = t.className || "";
  return e.baseVal && (e = e.baseVal), e.indexOf || (e = ""), _e(e);
}
function wt(t, e) {
  e && t.className.indexOf(e) === -1 && (t.className += " " + e);
}
function Gt(t, e) {
  e = e.split(" ");
  for (var n = 0; n < e.length; n++) {
    var i = new RegExp("\\s?\\b" + e[n] + "\\b(?![-_.])", "");
    t.className = t.className.replace(i, "");
  }
}
function we(t) {
  return typeof t == "string" ? document.getElementById(t) || document.querySelector(t) || document.body : t || document.body;
}
var Bt;
function Ze(t, e) {
  Bt || (Bt = document.createElement("div")), Bt.innerHTML = e;
  var n = Bt.firstChild;
  return t.appendChild(n), n;
}
function Qe(t) {
  t && t.parentNode && t.parentNode.removeChild(t);
}
function tn(t, e) {
  for (var n = t.childNodes, i = n.length, a = [], r = 0; r < i; r++) {
    var s = n[r];
    s.className && s.className.indexOf(e) !== -1 && a.push(s);
  }
  return a;
}
function yt(t) {
  var e;
  return t.tagName ? e = t : (e = (t = t || window.event).target || t.srcElement).shadowRoot && t.composedPath && (e = t.composedPath()[0]), e;
}
function nt(t, e) {
  if (e) {
    for (var n = yt(t); n; ) {
      if (n.getAttribute && n.getAttribute(e)) return n;
      n = n.parentNode;
    }
    return null;
  }
}
function _e(t) {
  return (String.prototype.trim || function() {
    return this.replace(/^\s+|\s+$/g, "");
  }).apply(t);
}
function pt(t, e, n) {
  var i = yt(t), a = "";
  for (n === void 0 && (n = !0); i; ) {
    if (a = X(i)) {
      var r = a.indexOf(e);
      if (r >= 0) {
        if (!n) return i;
        var s = r === 0 || !_e(a.charAt(r - 1)), o = r + e.length >= a.length || !_e(a.charAt(r + e.length));
        if (s && o) return i;
      }
    }
    i = i.parentNode;
  }
  return null;
}
function rt(t, e) {
  var s;
  const n = document.documentElement, i = V(e), { clientX: a, clientY: r } = ((s = t.touches) == null ? void 0 : s[0]) ?? t;
  return { x: a + n.scrollLeft - n.clientLeft - i.x + e.scrollLeft, y: r + n.scrollTop - n.clientTop - i.y + e.scrollTop };
}
function en(t, e) {
  const n = V(t), i = V(e);
  return { x: n.x - i.x, y: n.y - i.y };
}
function Y(t, e) {
  if (!t || !e) return !1;
  for (; t && t != e; ) t = t.parentNode;
  return t === e;
}
function dt(t, e) {
  if (t.closest) return t.closest(e);
  if (t.matches || t.msMatchesSelector || t.webkitMatchesSelector) {
    var n = t;
    if (!document.documentElement.contains(n)) return null;
    do {
      if ((n.matches || n.msMatchesSelector || n.webkitMatchesSelector).call(n, e)) return n;
      n = n.parentElement || n.parentNode;
    } while (n !== null && n.nodeType === 1);
    return null;
  }
  return console.error("Your browser is not supported"), null;
}
function nn(t) {
  for (; t; ) {
    if (t.offsetWidth > 0 && t.offsetHeight > 0) return t;
    t = t.parentElement;
  }
  return null;
}
function an() {
  return document.head.createShadowRoot || document.head.attachShadow;
}
function ge() {
  var t = document.activeElement;
  return t.shadowRoot && (t = t.shadowRoot.activeElement), t === document.body && document.getSelection && (t = document.getSelection().focusNode || document.body), t;
}
function vt(t) {
  if (!t || !an()) return document.body;
  for (; t.parentNode && (t = t.parentNode); ) if (t instanceof ShadowRoot) return t.host;
  return document.body;
}
const rn = Object.freeze(Object.defineProperty({ __proto__: null, addClassName: wt, closest: dt, getActiveElement: ge, getChildNodes: tn, getClassName: X, getClosestSizedElement: nn, getFocusableNodes: Lt, getNodePosition: V, getRelativeEventPosition: rt, getRelativeNodePosition: en, getRootNode: vt, getScrollSize: Xe, getTargetNode: yt, hasClass: function(t, e) {
  return "classList" in t ? t.classList.contains(e) : new RegExp("\\b" + e + "\\b").test(t.className);
}, hasShadowParent: function(t) {
  return !!vt(t);
}, insertNode: Ze, isChildOf: Y, isShadowDomSupported: an, locateAttribute: nt, locateClassName: pt, removeClassName: Gt, removeNode: Qe, toNode: we }, Symbol.toStringTag, { value: "Module" })), Z = typeof window < "u" ? window : global;
let Nn = class {
  constructor(t) {
    this._mouseDown = !1, this._touchStarts = !1, this._touchActive = !1, this._longTapTimer = !1, this._gantt = t, this._domEvents = t._createDomEventScope();
  }
  attach(t, e, n) {
    const i = this._gantt, a = t.getViewPort();
    this._originPosition = Z.getComputedStyle(a).display, this._restoreOriginPosition = () => {
      a.style.position = this._originPosition;
    }, this._originPosition === "static" && (a.style.position = "relative");
    const r = i.$services.getService("state");
    r.registerProvider("clickDrag", () => ({ autoscroll: !1 }));
    let s = null;
    const o = () => {
      s && (this._mouseDown = !0, t.setStart(i.copy(s)), t.setPosition(i.copy(s)), t.setEnd(i.copy(s)), s = null);
    };
    this._domEvents.attach(a, "mousedown", (p) => {
      u(p);
    });
    const l = vt(i.$root) || document.body;
    function c(p) {
      return p.changedTouches && p.changedTouches[0] || p;
    }
    this._domEvents.attach(l, "mouseup", (p) => {
      h(p);
    }), this._domEvents.attach(a, "mousemove", (p) => {
      _(p);
    }), this._domEvents.attach(a, "touchstart", (p) => {
      this._touchStarts = !0, this._longTapTimer = setTimeout(() => {
        this._touchStarts && (u(c(p)), this._touchStarts = !1, this._touchActive = !0);
      }, this._gantt.config.touch_drag);
    }), this._domEvents.attach(l, "touchend", (p) => {
      this._touchStarts = !1, this._touchActive = !1, clearTimeout(this._longTapTimer), h(c(p));
    }), this._domEvents.attach(a, "touchmove", (p) => {
      if (this._touchActive) {
        let y = d();
        if (y && i.utils.dom.closest(p.target, y)) return;
        _(c(p)), p.preventDefault();
      } else this._touchStarts = !1, clearTimeout(this._longTapTimer);
    });
    const d = () => {
      let p = ".gantt_task_line, .gantt_task_link";
      return n !== void 0 && (p = n instanceof Array ? n.join(", ") : n), p;
    }, u = (p) => {
      s = null;
      let y = d();
      y && i.utils.dom.closest(p.target, y) || (r.registerProvider("clickDrag", () => ({ autoscroll: this._mouseDown })), e && p[e] !== !0 || (s = this._getCoordinates(p, t)));
    }, h = (p) => {
      if (s = null, (!e || p[e] === !0) && this._mouseDown === !0) {
        this._mouseDown = !1;
        const y = this._getCoordinates(p, t);
        t.dragEnd(y);
      }
    }, _ = (p) => {
      if (e && p[e] !== !0) return;
      const y = this._gantt.ext.clickDrag, k = (this._gantt.config.drag_timeline || {}).useKey;
      if (y && k && !e && p[k]) return;
      let b = null;
      if (!this._mouseDown && s) return b = this._getCoordinates(p, t), void (Math.abs(s.relative.left - b.relative.left) > 5 && o());
      this._mouseDown === !0 && (b = this._getCoordinates(p, t), t.setEnd(b), t.render());
    };
  }
  detach() {
    const t = this._gantt;
    this._domEvents.detachAll(), this._restoreOriginPosition && this._restoreOriginPosition(), t.$services.getService("state").unregisterProvider("clickDrag");
  }
  destructor() {
    this.detach();
  }
  _getCoordinates(t, e) {
    const n = e.getViewPort(), i = n.getBoundingClientRect(), { clientX: a, clientY: r } = t;
    return { absolute: { left: a, top: r }, relative: { left: a - i.left + n.scrollLeft, top: r - i.top + n.scrollTop } };
  }
};
var sn = function() {
  this._silent_mode = !1, this.listeners = {};
};
sn.prototype = { _silentStart: function() {
  this._silent_mode = !0;
}, _silentEnd: function() {
  this._silent_mode = !1;
} };
function ot(t) {
  var e = new sn();
  t.attachEvent = function(n, i, a) {
    n = "ev_" + n.toLowerCase(), e.listeners[n] || (e.listeners[n] = function(s) {
      var o = {}, l = 0, c = function() {
        var d = !0;
        for (var u in o) {
          var h = o[u].apply(s, arguments);
          d = d && h;
        }
        return d;
      };
      return c.addEvent = function(d, u) {
        if (typeof d == "function") {
          var h;
          if (u && u.id ? h = u.id : (h = l, l++), u && u.once) {
            var _ = d;
            d = function() {
              _(), c.removeEvent(h);
            };
          }
          return o[h] = d, h;
        }
        return !1;
      }, c.removeEvent = function(d) {
        delete o[d];
      }, c.clear = function() {
        o = {};
      }, c;
    }(this)), a && a.thisObject && (i = i.bind(a.thisObject));
    var r = n + ":" + e.listeners[n].addEvent(i, a);
    return a && a.id && (r = a.id), r;
  }, t.attachAll = function(n) {
    this.attachEvent("listen_all", n);
  }, t.callEvent = function(n, i) {
    if (e._silent_mode) return !0;
    var a = "ev_" + n.toLowerCase(), r = e.listeners;
    return r.ev_listen_all && r.ev_listen_all.apply(this, [n].concat(i)), !r[a] || r[a].apply(this, i);
  }, t.checkEvent = function(n) {
    return !!e.listeners["ev_" + n.toLowerCase()];
  }, t.detachEvent = function(n) {
    if (n) {
      var i = e.listeners;
      for (var a in i) i[a].removeEvent(n);
      var r = n.split(":");
      if (i = e.listeners, r.length === 2) {
        var s = r[0], o = r[1];
        i[s] && i[s].removeEvent(o);
      }
    }
  }, t.detachAllEvents = function() {
    for (var n in e.listeners) e.listeners[n].clear();
  };
}
var Ce = { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2592e3, quarter: 7776e3, year: 31536e3 };
function Vt(t) {
  return Ce[t] || Ce.hour;
}
function kt(t, e) {
  if (t.forEach) t.forEach(e);
  else for (var n = t.slice(), i = 0; i < n.length; i++) e(n[i], i);
}
function Ln(t, e) {
  if (t.find) return t.find(e);
  for (var n = 0; n < t.length; n++) if (e(t[n], n)) return t[n];
}
function zt(t, e) {
  if (t.includes) return t.includes(e);
  for (var n = 0; n < t.length; n++) if (t[n] === e) return !0;
  return !1;
}
function fe(t) {
  return Array.isArray ? Array.isArray(t) : t && t.length !== void 0 && t.pop && t.push;
}
function Q(t) {
  return !(!t || typeof t != "object") && !!(t.getFullYear && t.getMonth && t.getDate);
}
function bt(t) {
  return Q(t) && !isNaN(t.getTime());
}
function De(t, e) {
  var n, i = function() {
    i.$cancelTimeout(), i.$pending = !0;
    var a = Array.prototype.slice.call(arguments);
    n = setTimeout(function() {
      t.apply(this, a), i.$pending = !1;
    }, e);
  };
  return i.$pending = !1, i.$cancelTimeout = function() {
    clearTimeout(n), i.$pending = !1;
  }, i.$execute = function() {
    var a = Array.prototype.slice.call(arguments);
    t.apply(this, a), i.$cancelTimeout();
  }, i;
}
function at(t, e) {
  return Ae(t) && !Ae(e) && (t = "0"), t;
}
function Ae(t) {
  return t === 0;
}
function At(t, e) {
  for (var n, i, a, r = 0, s = t.length - 1; r <= s; ) if (i = +t[n = Math.floor((r + s) / 2)], a = +t[n - 1], i < e) r = n + 1;
  else {
    if (!(i > e)) {
      for (; +t[n] == +t[n + 1]; ) n++;
      return n;
    }
    if (!isNaN(a) && a < e) return n - 1;
    s = n - 1;
  }
  return t.length - 1;
}
class Pn {
  constructor(e, n, i) {
    var a;
    this._el = document.createElement("div"), this.defaultRender = (r, s) => {
      this._el || (this._el = document.createElement("div"));
      const o = this._el, l = Math.min(r.relative.top, s.relative.top), c = Math.max(r.relative.top, s.relative.top), d = Math.min(r.relative.left, s.relative.left), u = Math.max(r.relative.left, s.relative.left);
      if (this._singleRow) {
        const h = this._getTaskPositionByTop(this._startPoint.relative.top);
        o.style.height = h.height + "px", o.style.top = h.top + "px";
      } else o.style.height = Math.abs(c - l) + "px", o.style.top = l + "px";
      return o.style.width = Math.abs(u - d) + "px", o.style.left = d + "px", o;
    }, this._gantt = n, this._view = i, this._viewPort = e.viewPort, this._el.classList.add(e.className), typeof e.callback == "function" && (this._callback = e.callback), this.render = () => {
      let r;
      r = e.render ? e.render(this._startPoint, this._endPoint) : this.defaultRender(this._startPoint, this._endPoint), r !== this._el && (this._el && this._el.parentNode && this._el.parentNode.removeChild(this._el), this._el = r), e.className !== "" && this._el.classList.add(e.className), this.draw();
    }, (a = this._viewPort).attachEvent && a.detachEvent || ot(this._viewPort), this._singleRow = e.singleRow, this._useRequestAnimationFrame = e.useRequestAnimationFrame;
  }
  draw() {
    if (this._useRequestAnimationFrame) return requestAnimationFrame(() => {
      this._viewPort.appendChild(this.getElement());
    });
    this._viewPort.appendChild(this.getElement());
  }
  clear() {
    if (this._useRequestAnimationFrame) return requestAnimationFrame(() => {
      this._el.parentNode && this._viewPort.removeChild(this._el);
    });
    this._el.parentNode && this._viewPort.removeChild(this._el);
  }
  getElement() {
    return this._el;
  }
  getViewPort() {
    return this._viewPort;
  }
  setStart(e) {
    const n = this._gantt;
    this._startPoint = e, this._startDate = n.dateFromPos(this._startPoint.relative.left), this._viewPort.callEvent("onBeforeDrag", [this._startPoint]);
  }
  setEnd(e) {
    const n = this._gantt;
    if (this._endPoint = e, this._singleRow) {
      const i = this._getTaskPositionByTop(this._startPoint.relative.top);
      this._endPoint.relative.top = i.top;
    }
    this._endDate = n.dateFromPos(this._endPoint.relative.left), this._startPoint.relative.left > this._endPoint.relative.left && (this._positionPoint = { relative: { left: this._endPoint.relative.left, top: this._positionPoint.relative.top }, absolute: { left: this._endPoint.absolute.left, top: this._positionPoint.absolute.top } }), this._startPoint.relative.top > this._endPoint.relative.top && (this._positionPoint = { relative: { left: this._positionPoint.relative.left, top: this._endPoint.relative.top }, absolute: { left: this._positionPoint.absolute.left, top: this._endPoint.absolute.top } }), this._viewPort.callEvent("onDrag", [this._startPoint, this._endPoint]);
  }
  setPosition(e) {
    this._positionPoint = e;
  }
  dragEnd(e) {
    const n = this._gantt;
    e.relative.left < 0 && (e.relative.left = 0), this._viewPort.callEvent("onBeforeDragEnd", [this._startPoint, e]), this.setEnd(e), this._endDate = this._endDate || n.getState().max_date, this._startDate.valueOf() > this._endDate.valueOf() && ([this._startDate, this._endDate] = [this._endDate, this._startDate]), this.clear();
    const i = n.getTaskByTime(this._startDate, this._endDate), a = this._getTasksByTop(this._startPoint.relative.top, this._endPoint.relative.top);
    this._viewPort.callEvent("onDragEnd", [this._startPoint, this._endPoint]), this._callback && this._callback(this._startPoint, this._endPoint, this._startDate, this._endDate, i, a);
  }
  getInBounds() {
    return this._singleRow;
  }
  _getTasksByTop(e, n) {
    const i = this._gantt;
    let a = e, r = n;
    e > n && (a = n, r = e);
    const s = this._getTaskPositionByTop(a).index, o = this._getTaskPositionByTop(r).index, l = [];
    for (let c = s; c <= o; c++)
      i.getTaskByIndex(c) && l.push(i.getTaskByIndex(c));
    return l;
  }
  _getTaskPositionByTop(e) {
    const n = this._gantt, i = this._view, a = i.getItemIndexByTopPosition(e), r = n.getTaskByIndex(a);
    if (r) {
      const s = i.getItemHeight(r.id);
      return { top: i.getItemTop(r.id) || 0, height: s || 0, index: a };
    }
    {
      const s = i.getTotalHeight();
      return { top: e > s ? s : 0, height: n.config.row_height, index: e > s ? n.getTaskCount() : 0 };
    }
  }
}
let te = !1;
class Yt {
  constructor(e) {
    this._mouseDown = !1, this._calculateDirectionVector = () => {
      if (this._trace.length >= 10) {
        const n = this._trace.slice(this._trace.length - 10), i = [];
        for (let r = 1; r < n.length; r++) i.push({ x: n[r].x - n[r - 1].x, y: n[r].y - n[r - 1].y });
        const a = { x: 0, y: 0 };
        return i.forEach((r) => {
          a.x += r.x, a.y += r.y;
        }), { magnitude: Math.sqrt(a.x * a.x + a.y * a.y), angleDegrees: 180 * Math.atan2(Math.abs(a.y), Math.abs(a.x)) / Math.PI };
      }
      return null;
    }, this._applyDndReadyStyles = () => {
      this._timeline.$task.classList.add("gantt_timeline_move_available");
    }, this._clearDndReadyStyles = () => {
      this._timeline.$task.classList.remove("gantt_timeline_move_available");
    }, this._getScrollPosition = (n) => {
      const i = this._gantt;
      return { x: i.$ui.getView(n.$config.scrollX).getScrollState().position, y: i.$ui.getView(n.$config.scrollY).getScrollState().position };
    }, this._countNewScrollPosition = (n) => {
      const i = this._calculateDirectionVector();
      let a = this._startPoint.x - n.x, r = this._startPoint.y - n.y;
      return i && (i.angleDegrees < 15 ? r = 0 : i.angleDegrees > 75 && (a = 0)), { x: this._scrollState.x + a, y: this._scrollState.y + r };
    }, this._setScrollPosition = (n, i) => {
      const a = this._gantt;
      requestAnimationFrame(() => {
        a.scrollLayoutCell(n.$id, i.x, i.y);
      });
    }, this._stopDrag = (n) => {
      const i = this._gantt;
      if (this._trace = [], i.$root.classList.remove("gantt_noselect"), this._originalReadonly !== void 0 && this._mouseDown && (i.config.readonly = this._originalReadonly, i.config.drag_timeline && i.config.drag_timeline.render && i.render()), this._originAutoscroll !== void 0 && (i.config.autoscroll = this._originAutoscroll), i.config.drag_timeline) {
        const { useKey: a } = i.config.drag_timeline;
        if (a && n[a] !== !0) return;
      }
      this._mouseDown = !1, te = !1;
    }, this._startDrag = (n) => {
      const i = this._gantt;
      this._originAutoscroll = i.config.autoscroll, i.config.autoscroll = !1, te = !0, i.$root.classList.add("gantt_noselect"), this._originalReadonly = i.config.readonly, i.config.readonly = !0, i.config.drag_timeline && i.config.drag_timeline.render && i.render(), this._trace = [], this._mouseDown = !0;
      const { x: a, y: r } = this._getScrollPosition(this._timeline);
      this._scrollState = { x: a, y: r }, this._startPoint = { x: n.clientX, y: n.clientY }, this._trace.push(this._startPoint);
    }, this._gantt = e, this._domEvents = e._createDomEventScope(), this._trace = [];
  }
  static create(e) {
    return new Yt(e);
  }
  static _isDragInProgress() {
    return te;
  }
  destructor() {
    this._domEvents.detachAll();
  }
  attach(e) {
    this._timeline = e;
    const n = this._gantt;
    this._domEvents.attach(e.$task, "mousedown", (i) => {
      if (!n.config.drag_timeline) return;
      const { useKey: a, ignore: r, enabled: s } = n.config.drag_timeline;
      if (s === !1) return;
      let o = ".gantt_task_line, .gantt_task_link";
      r !== void 0 && (o = r instanceof Array ? r.join(", ") : r), o && n.utils.dom.closest(i.target, o) || a && i[a] !== !0 || this._startDrag(i);
    }), this._domEvents.attach(document, "keydown", (i) => {
      if (!n.config.drag_timeline) return;
      const { useKey: a } = n.config.drag_timeline;
      a && i[a] === !0 && this._applyDndReadyStyles();
    }), this._domEvents.attach(document, "keyup", (i) => {
      if (!n.config.drag_timeline) return;
      const { useKey: a } = n.config.drag_timeline;
      a && i[a] === !1 && (this._clearDndReadyStyles(), this._stopDrag(i));
    }), this._domEvents.attach(document, "mouseup", (i) => {
      this._stopDrag(i);
    }), this._domEvents.attach(n.$root, "mouseup", (i) => {
      this._stopDrag(i);
    }), this._domEvents.attach(document, "mouseleave", (i) => {
      this._stopDrag(i);
    }), this._domEvents.attach(n.$root, "mouseleave", (i) => {
      this._stopDrag(i);
    }), this._domEvents.attach(n.$root, "mousemove", (i) => {
      if (!n.config.drag_timeline) return;
      const { useKey: a } = n.config.drag_timeline;
      if (a && i[a] !== !0) return;
      const r = this._gantt.ext.clickDrag, s = (this._gantt.config.click_drag || {}).useKey;
      if ((!r || !s || a || !i[s]) && this._mouseDown === !0) {
        this._trace.push({ x: i.clientX, y: i.clientY });
        const o = this._countNewScrollPosition({ x: i.clientX, y: i.clientY });
        this._setScrollPosition(e, o), this._scrollState = o, this._startPoint = { x: i.clientX, y: i.clientY };
      }
    });
  }
}
function Rn(t) {
  (function() {
    var e = [];
    function n() {
      return !!e.length;
    }
    function i(c) {
      setTimeout(function() {
        n() || t.$destroyed || t.focus();
      }, 1);
    }
    function a(c) {
      t.eventRemove(c, "keydown", s), t.event(c, "keydown", s), e.push(c);
    }
    function r() {
      var c = e.pop();
      c && t.eventRemove(c, "keydown", s), i();
    }
    function s(c) {
      var d = c.currentTarget;
      d == e[e.length - 1] && t.$keyboardNavigation.trapFocus(d, c);
    }
    function o() {
      a(t.getLightbox());
    }
    t.attachEvent("onLightbox", o), t.attachEvent("onAfterLightbox", r), t.attachEvent("onLightboxChange", function() {
      r(), o();
    }), t.attachEvent("onAfterQuickInfo", function() {
      i();
    }), t.attachEvent("onMessagePopup", function(c) {
      l = t.utils.dom.getActiveElement(), a(c);
    }), t.attachEvent("onAfterMessagePopup", function() {
      r(), setTimeout(function() {
        l && (l.focus(), l = null);
      }, 1);
    });
    var l = null;
    t.$keyboardNavigation.isModal = n;
  })();
}
class Hn {
  constructor(e) {
    this.show = (n, i) => {
      i === void 0 ? this._showForTask(n) : this._showAtCoordinates(n, i);
    }, this.hide = (n) => {
      const i = this._gantt, a = this._quickInfoBox;
      this._quickInfoBoxId = 0;
      const r = this._quickInfoTask;
      if (this._quickInfoTask = null, a && a.parentNode) {
        if (i.config.quick_info_detached) return i.callEvent("onAfterQuickInfo", [r]), a.parentNode.removeChild(a);
        a.className += " gantt_qi_hidden", a.style.right === "auto" ? a.style.left = "-350px" : a.style.right = "-350px", n && (a.style.left = a.style.right = "", a.parentNode.removeChild(a)), i.callEvent("onAfterQuickInfo", [r]);
      }
    }, this.getNode = () => this._quickInfoBox ? this._quickInfoBox : null, this.setContainer = (n) => {
      n && (this._container = typeof n == "string" ? document.getElementById(n) : n);
    }, this.setContent = (n) => {
      const i = this._gantt, a = { taskId: null, header: { title: "", date: "" }, content: "", buttons: i.config.quickinfo_buttons };
      n || (n = a), n.taskId || (n.taskId = a.taskId), n.header || (n.header = a.header), n.header.title || (n.header.title = a.header.title), n.header.date || (n.header.date = a.header.date), n.content || (n.content = a.content), n.buttons || (n.buttons = a.buttons);
      let r = this.getNode();
      r || (r = this._createQuickInfoElement()), n.taskId && (this._quickInfoBoxId = n.taskId);
      const s = r.querySelector(".gantt_cal_qi_title"), o = s.querySelector(".gantt_cal_qi_tcontent"), l = s.querySelector(".gantt_cal_qi_tdate"), c = r.querySelector(".gantt_cal_qi_content"), d = r.querySelector(".gantt_cal_qi_controls");
      i._waiAria.quickInfoHeader(r, [n.header.title, n.header.date].join(" ")), o.innerHTML = n.header.title, l.innerHTML = n.header.date, n.header.title || n.header.date ? s.style.display = "" : s.style.display = "none", c.innerHTML = n.content;
      const u = n.buttons;
      u.length ? d.style.display = "" : d.style.display = "none";
      let h = "";
      for (let _ = 0; _ < u.length; _++) {
        const p = i._waiAria.quickInfoButtonAttrString(i.locale.labels[u[_]]);
        h += `<div class="gantt_qi_big_icon ${u[_]} dhx_gantt_${u[_]}" title="${i.locale.labels[u[_]]}" ${p}>
            <div class='dhx_menu_icon dhx_gantt_icon ${u[_]} gantt_menu_icon dhx_gantt_${u[_]}'></div>
            <div>${i.locale.labels[u[_]]}</div>
         </div>`;
      }
      d.innerHTML = h, i.eventRemove(r, "click", this._qiButtonClickHandler), i.eventRemove(r, "keypress", this._qiKeyPressHandler), i.event(r, "click", this._qiButtonClickHandler), i.event(r, "keypress", this._qiKeyPressHandler);
    }, this._qiButtonClickHandler = (n) => {
      this._qi_button_click(n.target);
    }, this._qiKeyPressHandler = (n) => {
      const i = n.which;
      i !== 13 && i !== 32 || setTimeout(() => {
        this._qi_button_click(n.target);
      }, 1);
    }, this._gantt = e;
  }
  _showAtCoordinates(e, n) {
    this.hide(!0), this._quickInfoBoxId = 0, this._quickInfoTask = null, this._quickInfoBox || (this._createQuickInfoElement(), this.setContent()), this._appendAtCoordinates(e, n), this._gantt.callEvent("onQuickInfo", [null]);
  }
  _showForTask(e) {
    const n = this._gantt;
    if (e === this._quickInfoBoxId && n.utils.dom.isChildOf(this._quickInfoBox, document.body) || !n.config.show_quick_info) return;
    this.hide(!0);
    const i = this._getContainer(), a = this._get_event_counter_part(e, 6, i.xViewport, i.yViewport);
    a && (this._quickInfoBox = this._init_quick_info(e), this._quickInfoTask = e, this._quickInfoBox.className = this._prepare_quick_info_classname(e), this._fill_quick_data(e), this._show_quick_info(a, 6), n.callEvent("onQuickInfo", [e]));
  }
  _get_event_counter_part(e, n, i, a) {
    const r = this._gantt;
    let s = r.getTaskNode(e);
    if (!s && (s = r.getTaskRowNode(e), !s)) return null;
    let o = 0;
    const l = n + s.offsetTop + s.offsetHeight;
    let c = s;
    if (r.utils.dom.isChildOf(c, i)) for (; c && c !== i; ) o += c.offsetLeft, c = c.offsetParent;
    const d = r.getScrollState();
    return c ? { left: o, top: l, dx: o + s.offsetWidth / 2 - d.x > i.offsetWidth / 2 ? 1 : 0, dy: l + s.offsetHeight / 2 - d.y > a.offsetHeight / 2 ? 1 : 0, width: s.offsetWidth, height: s.offsetHeight } : null;
  }
  _createQuickInfoElement() {
    const e = this._gantt, n = document.createElement("div");
    n.className += "gantt_cal_quick_info", e._waiAria.quickInfoAttr(n);
    var i = `
		<div class="gantt_cal_qi_tcontrols">
			<a class="gantt_cal_qi_close_btn dhx_gantt_icon dhx_gantt_icon_close"></a>
		</div>
		<div class="gantt_cal_qi_title" ${e._waiAria.quickInfoHeaderAttrString()}>
				
				<div class="gantt_cal_qi_tcontent"></div>
				<div class="gantt_cal_qi_tdate"></div>
			</div>
			<div class="gantt_cal_qi_content"></div>`;
    if (i += '<div class="gantt_cal_qi_controls">', i += "</div>", n.innerHTML = i, e.config.quick_info_detached) {
      const a = this._getContainer();
      e.event(a.parent, "scroll", () => {
        this.hide();
      });
    }
    return this._quickInfoBox = n, n;
  }
  _init_quick_info(e) {
    const n = this._gantt, i = n.getTask(e);
    return typeof this._quickInfoReadonly == "boolean" && n.isReadonly(i) !== this._quickInfoReadonly && (this.hide(!0), this._quickInfoBox = null), this._quickInfoReadonly = n.isReadonly(i), this._quickInfoBox || (this._quickInfoBox = this._createQuickInfoElement()), this._quickInfoBox;
  }
  _prepare_quick_info_classname(e) {
    const n = this._gantt, i = n.getTask(e);
    let a = `gantt_cal_quick_info gantt_${n.getTaskType(i)}`;
    const r = n.templates.quick_info_class(i.start_date, i.end_date, i);
    return r && (a += " " + r), a;
  }
  _fill_quick_data(e) {
    const n = this._gantt, i = n.getTask(e);
    this._quickInfoBoxId = e;
    let a = [];
    if (this._quickInfoReadonly) {
      const r = n.config.quickinfo_buttons, s = { icon_delete: !0, icon_edit: !0 };
      for (let o = 0; o < r.length; o++) this._quickInfoReadonly && s[r[o]] || a.push(r[o]);
    } else a = n.config.quickinfo_buttons;
    this.setContent({ header: { title: n.templates.quick_info_title(i.start_date, i.end_date, i), date: n.templates.quick_info_date(i.start_date, i.end_date, i) }, content: n.templates.quick_info_content(i.start_date, i.end_date, i), buttons: a });
  }
  _appendAtCoordinates(e, n) {
    const i = this._quickInfoBox, a = this._getContainer();
    i.parentNode && i.parentNode.nodeName.toLowerCase() !== "#document-fragment" || a.parent.appendChild(i), i.style.left = e + "px", i.style.top = n + "px";
  }
  _show_quick_info(e, n) {
    const i = this._gantt, a = this._quickInfoBox;
    if (i.config.quick_info_detached) {
      const r = this._getContainer();
      a.parentNode && a.parentNode.nodeName.toLowerCase() !== "#document-fragment" || r.parent.appendChild(a);
      const s = a.offsetWidth, o = a.offsetHeight, l = i.getScrollState(), c = r.xViewport, d = r.yViewport, u = c.offsetWidth + l.x - s, h = e.top - l.y + o;
      let _ = e.top;
      h > d.offsetHeight / 2 && (_ = e.top - (o + e.height + 2 * n), _ < l.y && h <= d.offsetHeight && (_ = e.top)), _ < l.y && (_ = l.y);
      const p = Math.min(Math.max(l.x, e.left - e.dx * (s - e.width)), u), y = _;
      this._appendAtCoordinates(p, y);
    } else a.style.top = "20px", e.dx === 1 ? (a.style.right = "auto", a.style.left = "-300px", setTimeout(() => {
      a.style.left = "10px";
    }, 1)) : (a.style.left = "auto", a.style.right = "-300px", setTimeout(() => {
      a.style.right = "10px";
    }, 1)), a.className += " gantt_qi_" + (e.dx === 1 ? "left" : "right"), i.$root.appendChild(a);
  }
  _qi_button_click(e) {
    const n = this._gantt, i = this._quickInfoBox;
    if (!e || e === i) return;
    if (e.closest(".gantt_cal_qi_close_btn")) return void this.hide();
    const a = e.className;
    if (a.indexOf("_icon") !== -1) {
      const r = this._quickInfoBoxId;
      n.$click.buttons[a.split(" ")[1].replace("icon_", "")](r);
    } else this._qi_button_click(e.parentNode);
  }
  _getContainer() {
    const e = this._gantt;
    let n = this._container ? this._container : e.$task_data;
    return n && n.offsetHeight && n.offsetWidth ? { parent: n, xViewport: e.$task, yViewport: e.$task_data } : (n = this._container ? this._container : e.$grid_data, n && n.offsetHeight && n.offsetWidth ? { parent: n, xViewport: e.$grid, yViewport: e.$grid_data } : { parent: this._container ? this._container : e.$layout, xViewport: e.$layout, yViewport: e.$layout });
  }
}
var ee, On = {}.constructor.toString();
function q(t) {
  var e, n;
  if (t && typeof t == "object") switch (!0) {
    case Q(t):
      n = new Date(t);
      break;
    case fe(t):
      for (n = new Array(t.length), e = 0; e < t.length; e++) n[e] = q(t[e]);
      break;
    default:
      if (function(i) {
        return i.constructor.toString() !== On;
      }(t)) n = Object.create(t);
      else {
        if (function(i) {
          return i.$$typeof && i.$$typeof.toString().includes("react.");
        }(t)) return n = t;
        n = {};
      }
      for (e in t) Object.prototype.hasOwnProperty.apply(t, [e]) && (n[e] = q(t[e]));
  }
  return n || t;
}
function P(t, e, n) {
  for (var i in e) (t[i] === void 0 || n) && (t[i] = e[i]);
  return t;
}
function W(t) {
  return t !== void 0;
}
function st() {
  return ee || (ee = (/* @__PURE__ */ new Date()).valueOf()), ++ee;
}
function R(t, e) {
  return t.bind ? t.bind(e) : function() {
    return t.apply(e, arguments);
  };
}
function on(t, e, n, i) {
  t.addEventListener ? t.addEventListener(e, n, i !== void 0 && i) : t.attachEvent && t.attachEvent("on" + e, n);
}
function ln(t, e, n, i) {
  t.removeEventListener ? t.removeEventListener(e, n, i !== void 0 && i) : t.detachEvent && t.detachEvent("on" + e, n);
}
const Bn = Object.freeze(Object.defineProperty({ __proto__: null, bind: R, copy: q, defined: W, event: on, eventRemove: ln, mixin: P, uid: st }, Symbol.toStringTag, { value: "Module" }));
function Se(t, e) {
  t = t || on, e = e || ln;
  var n = [], i = { attach: function(a, r, s, o) {
    n.push({ element: a, event: r, callback: s, capture: o }), t(a, r, s, o);
  }, detach: function(a, r, s, o) {
    e(a, r, s, o);
    for (var l = 0; l < n.length; l++) {
      var c = n[l];
      c.element === a && c.event === r && c.callback === s && c.capture === o && (n.splice(l, 1), l--);
    }
  }, detachAll: function() {
    for (var a = n.slice(), r = 0; r < a.length; r++) {
      var s = a[r];
      i.detach(s.element, s.event, s.callback, s.capture), i.detach(s.element, s.event, s.callback, void 0), i.detach(s.element, s.event, s.callback, !1), i.detach(s.element, s.event, s.callback, !0);
    }
    n.splice(0, n.length);
  }, extend: function() {
    return Se(this.event, this.eventRemove);
  } };
  return i;
}
class zn {
  constructor(e) {
    this._gantt = e;
  }
  getNode() {
    const e = this._gantt;
    return this._tooltipNode || (this._tooltipNode = document.createElement("div"), this._tooltipNode.className = "gantt_tooltip", e._waiAria.tooltipAttr(this._tooltipNode)), this._tooltipNode;
  }
  setViewport(e) {
    return this._root = e, this;
  }
  show(e, n) {
    const i = this._gantt, a = document.body, r = this.getNode();
    if (Y(r, a) || (this.hide(), r.style.top = r.style.top || "0px", r.style.left = r.style.left || "0px", a.appendChild(r)), this._isLikeMouseEvent(e)) {
      const s = this._calculateTooltipPosition(e);
      n = s.top, e = s.left;
    }
    return r.style.top = n + "px", r.style.left = e + "px", i._waiAria.tooltipVisibleAttr(r), this;
  }
  hide() {
    const e = this._gantt, n = this.getNode();
    return n && n.parentNode && n.parentNode.removeChild(n), e._waiAria.tooltipHiddenAttr(n), this;
  }
  setContent(e) {
    return this.getNode().innerHTML = e, this;
  }
  _isLikeMouseEvent(e) {
    return !(!e || typeof e != "object") && "clientX" in e && "clientY" in e;
  }
  _getViewPort() {
    return this._root || document.body;
  }
  _calculateTooltipPosition(e) {
    const n = this._gantt, i = this._getViewPortSize(), a = this.getNode(), r = { top: 0, left: 0, width: a.offsetWidth, height: a.offsetHeight, bottom: 0, right: 0 }, s = n.config.tooltip_offset_x, o = n.config.tooltip_offset_y, l = document.body, c = rt(e, l), d = V(l);
    c.y += d.y, r.top = c.y, r.left = c.x, r.top += o, r.left += s, r.bottom = r.top + r.height, r.right = r.left + r.width;
    const u = window.scrollY + l.scrollTop;
    return r.top < i.top - u ? (r.top = i.top, r.bottom = r.top + r.height) : r.bottom > i.bottom && (r.bottom = i.bottom, r.top = r.bottom - r.height), r.left < i.left ? (r.left = i.left, r.right = i.left + r.width) : r.right > i.right && (r.right = i.right, r.left = r.right - r.width), c.x >= r.left && c.x <= r.right && (r.left = c.x - r.width - s, r.right = r.left + r.width), c.y >= r.top && c.y <= r.bottom && (r.top = c.y - r.height - o, r.bottom = r.top + r.height), r.left < 0 && (r.left = 0), r.right < 0 && (r.right = 0), r;
  }
  _getViewPortSize() {
    const e = this._gantt, n = this._getViewPort();
    let i, a = n, r = window.scrollY + document.body.scrollTop, s = window.scrollX + document.body.scrollLeft;
    return n === e.$task_data ? (a = e.$task, r = 0, s = 0, i = V(e.$task)) : i = V(a), { left: i.x + s, top: i.y + r, width: i.width, height: i.height, bottom: i.y + i.height + r, right: i.x + i.width + s };
  }
}
class Wn {
  constructor(e) {
    this._listeners = {}, this.tooltip = new zn(e), this._gantt = e, this._domEvents = Se(), this._initDelayedFunctions();
  }
  destructor() {
    this.tooltip.hide(), this._domEvents.detachAll();
  }
  hideTooltip() {
    this.delayHide();
  }
  attach(e) {
    let n = document.body;
    const i = this._gantt;
    e.global || (n = i.$root);
    let a = null;
    const r = (s) => {
      const o = yt(s), l = dt(o, e.selector);
      if (Y(o, this.tooltip.getNode())) return;
      const c = () => {
        a = l, e.onmouseenter(s, l);
      };
      a ? l && l === a ? e.onmousemove(s, l) : (e.onmouseleave(s, a), a = null, l && l !== a && c()) : l && c();
    };
    this.detach(e.selector), this._domEvents.attach(n, "mousemove", r), this._listeners[e.selector] = { node: n, handler: r };
  }
  detach(e) {
    const n = this._listeners[e];
    n && this._domEvents.detach(n.node, "mousemove", n.handler);
  }
  tooltipFor(e) {
    const n = (i) => {
      let a = i;
      return document.createEventObject && !document.createEvent && (a = document.createEventObject(i)), a;
    };
    this._initDelayedFunctions(), this.attach({ selector: e.selector, global: e.global, onmouseenter: (i, a) => {
      const r = e.html(i, a);
      r && this.delayShow(n(i), r);
    }, onmousemove: (i, a) => {
      const r = e.html(i, a);
      r ? this.delayShow(n(i), r) : (this.delayShow.$cancelTimeout(), this.delayHide());
    }, onmouseleave: () => {
      this.delayShow.$cancelTimeout(), this.delayHide();
    } });
  }
  _initDelayedFunctions() {
    const e = this._gantt;
    this.delayShow && this.delayShow.$cancelTimeout(), this.delayHide && this.delayHide.$cancelTimeout(), this.tooltip.hide(), this.delayShow = De((n, i) => {
      e.callEvent("onBeforeTooltip", [n]) === !1 ? this.tooltip.hide() : (this.tooltip.setContent(i), this.tooltip.show(n));
    }, e.config.tooltip_timeout || 1), this.delayHide = De(() => {
      this.delayShow.$cancelTimeout(), this.tooltip.hide();
    }, e.config.tooltip_hide_timeout || 1);
  }
}
const Ie = { onBeforeUndo: "onAfterUndo", onBeforeRedo: "onAfterRedo" }, Me = ["onTaskDragStart", "onAfterTaskUpdate", "onAfterParentExpand", "onAfterTaskDelete", "onBeforeBatchUpdate"];
class jn {
  constructor(e, n) {
    this._batchAction = null, this._batchMode = !1, this._ignore = !1, this._ignoreMoveEvents = !1, this._initialTasks = {}, this._initialLinks = {}, this._nestedTasks = {}, this._nestedLinks = {}, this._undo = e, this._gantt = n, this._attachEvents();
  }
  store(e, n, i = !1) {
    return n === this._gantt.config.undo_types.task ? this._storeTask(e, i) : n === this._gantt.config.undo_types.link && this._storeLink(e, i);
  }
  isMoveEventsIgnored() {
    return this._ignoreMoveEvents;
  }
  toggleIgnoreMoveEvents(e) {
    this._ignoreMoveEvents = e || !1;
  }
  startIgnore() {
    this._ignore = !0;
  }
  stopIgnore() {
    this._ignore = !1;
  }
  startBatchAction() {
    this._timeout || (this._timeout = setTimeout(() => {
      this.stopBatchAction(), this._timeout = null;
    }, 10)), this._ignore || this._batchMode || (this._batchMode = !0, this._batchAction = this._undo.action.create());
  }
  stopBatchAction() {
    if (this._ignore) return;
    const e = this._undo;
    this._batchAction && e.logAction(this._batchAction), this._batchMode = !1, this._batchAction = null;
  }
  onTaskAdded(e) {
    this._ignore || this._storeTaskCommand(e, this._undo.command.type.add);
  }
  onTaskUpdated(e) {
    this._ignore || this._storeTaskCommand(e, this._undo.command.type.update);
  }
  onTaskMoved(e) {
    this._ignore || (e.$local_index = this._gantt.getTaskIndex(e.id), this._storeEntityCommand(e, this.getInitialTask(e.id), this._undo.command.type.move, this._undo.command.entity.task));
  }
  onTaskDeleted(e) {
    if (!this._ignore) {
      if (this._storeTaskCommand(e, this._undo.command.type.remove), this._nestedTasks[e.id]) {
        const n = this._nestedTasks[e.id];
        for (let i = 0; i < n.length; i++) this._storeTaskCommand(n[i], this._undo.command.type.remove);
      }
      if (this._nestedLinks[e.id]) {
        const n = this._nestedLinks[e.id];
        for (let i = 0; i < n.length; i++) this._storeLinkCommand(n[i], this._undo.command.type.remove);
      }
    }
  }
  onLinkAdded(e) {
    this._ignore || this._storeLinkCommand(e, this._undo.command.type.add);
  }
  onLinkUpdated(e) {
    this._ignore || this._storeLinkCommand(e, this._undo.command.type.update);
  }
  onLinkDeleted(e) {
    this._ignore || this._storeLinkCommand(e, this._undo.command.type.remove);
  }
  setNestedTasks(e, n) {
    const i = this._gantt;
    let a = null;
    const r = [];
    let s = this._getLinks(i.getTask(e));
    for (let c = 0; c < n.length; c++) a = this.setInitialTask(n[c]), s = s.concat(this._getLinks(a)), r.push(a);
    const o = {};
    for (let c = 0; c < s.length; c++) o[s[c]] = !0;
    const l = [];
    for (const c in o) l.push(this.setInitialLink(c));
    this._nestedTasks[e] = r, this._nestedLinks[e] = l;
  }
  setInitialTask(e, n) {
    const i = this._gantt;
    if (n || !this._initialTasks[e] || !this._batchMode) {
      const a = i.copy(i.getTask(e));
      a.$index = i.getGlobalTaskIndex(e), a.$local_index = i.getTaskIndex(e), this.setInitialTaskObject(e, a);
    }
    return this._initialTasks[e];
  }
  getInitialTask(e) {
    return this._initialTasks[e];
  }
  clearInitialTasks() {
    this._initialTasks = {};
  }
  setInitialTaskObject(e, n) {
    this._initialTasks[e] = n;
  }
  setInitialLink(e, n) {
    return this._initialLinks[e] && this._batchMode || (this._initialLinks[e] = this._gantt.copy(this._gantt.getLink(e))), this._initialLinks[e];
  }
  getInitialLink(e) {
    return this._initialLinks[e];
  }
  clearInitialLinks() {
    this._initialLinks = {};
  }
  _attachEvents() {
    let e = null;
    const n = this._gantt, i = () => {
      e || (e = setTimeout(() => {
        e = null;
      }), this.clearInitialTasks(), n.eachTask((l) => {
        this.setInitialTask(l.id);
      }), this.clearInitialLinks(), n.getLinks().forEach((l) => {
        this.setInitialLink(l.id);
      }));
    }, a = (l) => n.copy(n.getTask(l));
    for (const l in Ie) n.attachEvent(l, () => (this.startIgnore(), !0)), n.attachEvent(Ie[l], () => (this.stopIgnore(), !0));
    for (let l = 0; l < Me.length; l++) n.attachEvent(Me[l], () => (this.startBatchAction(), !0));
    n.attachEvent("onParse", () => {
      this._undo.clearUndoStack(), this._undo.clearRedoStack(), i();
    }), n.attachEvent("onAfterTaskAdd", (l, c) => {
      this.setInitialTask(l, !0), this.onTaskAdded(c);
    }), n.attachEvent("onAfterTaskUpdate", (l, c) => {
      this.onTaskUpdated(c);
    }), n.attachEvent("onAfterParentExpand", (l, c) => {
      this.onTaskUpdated(c);
    }), n.attachEvent("onAfterTaskDelete", (l, c) => {
      this.onTaskDeleted(c);
    }), n.attachEvent("onAfterLinkAdd", (l, c) => {
      this.setInitialLink(l, !0), this.onLinkAdded(c);
    }), n.attachEvent("onAfterLinkUpdate", (l, c) => {
      this.onLinkUpdated(c);
    }), n.attachEvent("onAfterLinkDelete", (l, c) => {
      this.onLinkDeleted(c);
    }), n.attachEvent("onRowDragEnd", (l, c) => (this.onTaskMoved(a(l)), this.toggleIgnoreMoveEvents(), !0)), n.attachEvent("onBeforeTaskDelete", (l) => {
      this.store(l, n.config.undo_types.task);
      const c = [];
      return i(), n.eachTask((d) => {
        c.push(d.id);
      }, l), this.setNestedTasks(l, c), !0;
    });
    const r = n.getDatastore("task");
    r.attachEvent("onBeforeItemMove", (l, c, d) => (this.isMoveEventsIgnored() || i(), !0)), r.attachEvent("onAfterItemMove", (l, c, d) => (this.isMoveEventsIgnored() || this.onTaskMoved(a(l)), !0)), n.attachEvent("onRowDragStart", (l, c, d) => (this.toggleIgnoreMoveEvents(!0), i(), !0));
    let s = null, o = !1;
    if (n.attachEvent("onBeforeTaskDrag", (l) => {
      if (s = n.getState().drag_id, s === l) {
        const c = n.getTask(l);
        n.isSummaryTask(c) && n.config.drag_project && (o = !0);
      }
      if (n.plugins().multiselect) {
        const c = n.getSelectedTasks();
        c.length > 1 && c.forEach((d) => {
          this.store(d, n.config.undo_types.task, !0);
        });
      }
      return this.store(l, n.config.undo_types.task);
    }), n.attachEvent("onAfterTaskDrag", (l) => {
      (o || n.plugins().multiselect && n.getSelectedTasks().length > 1) && s === l && (o = !1, s = null, this.stopBatchAction()), this.store(l, n.config.undo_types.task, !0);
    }), n.attachEvent("onLightbox", (l) => this.store(l, n.config.undo_types.task)), n.attachEvent("onBeforeTaskAutoSchedule", (l) => (this.store(l.id, n.config.undo_types.task, !0), !0)), n.ext.inlineEditors) {
      let l = null, c = null;
      n.attachEvent("onGanttLayoutReady", () => {
        l && n.ext.inlineEditors.detachEvent(l), c && n.ext.inlineEditors.detachEvent(c), c = n.ext.inlineEditors.attachEvent("onEditStart", (d) => {
          this.store(d.id, n.config.undo_types.task);
        }), l = n.ext.inlineEditors.attachEvent("onBeforeEditStart", (d) => (this.stopBatchAction(), !0));
      });
    }
  }
  _storeCommand(e) {
    const n = this._undo;
    if (n.updateConfigs(), n.undoEnabled) if (this._batchMode) this._batchAction.commands.push(e);
    else {
      const i = n.action.create([e]);
      n.logAction(i);
    }
  }
  _storeEntityCommand(e, n, i, a) {
    const r = this._undo.command.create(e, n, i, a);
    this._storeCommand(r);
  }
  _storeTaskCommand(e, n) {
    this._gantt.isTaskExists(e.id) && (e.$local_index = this._gantt.getTaskIndex(e.id)), this._storeEntityCommand(e, this.getInitialTask(e.id), n, this._undo.command.entity.task);
  }
  _storeLinkCommand(e, n) {
    this._storeEntityCommand(e, this.getInitialLink(e.id), n, this._undo.command.entity.link);
  }
  _getLinks(e) {
    return e.$source.concat(e.$target);
  }
  _storeTask(e, n = !1) {
    const i = this._gantt;
    return this.setInitialTask(e, n), i.eachTask((a) => {
      this.setInitialTask(a.id);
    }, e), !0;
  }
  _storeLink(e, n = !1) {
    return this.setInitialLink(e, n), !0;
  }
}
class Fn {
  constructor(e) {
    this.maxSteps = 100, this.undoEnabled = !0, this.redoEnabled = !0, this.action = { create: (n) => ({ commands: n ? n.slice() : [] }), invert: (n) => {
      const i = this._gantt.copy(n), a = this.command;
      for (let r = 0; r < n.commands.length; r++) {
        const s = i.commands[r] = a.invert(i.commands[r]);
        s.type !== a.type.update && s.type !== a.type.move || ([s.value, s.oldValue] = [s.oldValue, s.value]);
      }
      return i;
    } }, this.command = { entity: null, type: null, create: (n, i, a, r) => {
      const s = this._gantt;
      return { entity: r, type: a, value: s.copy(n), oldValue: s.copy(i || n) };
    }, invert: (n) => {
      const i = this._gantt.copy(n);
      return i.type = this.command.inverseCommands(n.type), i;
    }, inverseCommands: (n) => {
      const i = this._gantt, a = this.command.type;
      switch (n) {
        case a.update:
          return a.update;
        case a.remove:
          return a.add;
        case a.add:
          return a.remove;
        case a.move:
          return a.move;
        default:
          return i.assert(!1, "Invalid command " + n), null;
      }
    } }, this._undoStack = [], this._redoStack = [], this._gantt = e;
  }
  getUndoStack() {
    return this._undoStack;
  }
  setUndoStack(e) {
    this._undoStack = e;
  }
  getRedoStack() {
    return this._redoStack;
  }
  setRedoStack(e) {
    this._redoStack = e;
  }
  clearUndoStack() {
    this._undoStack = [];
  }
  clearRedoStack() {
    this._redoStack = [];
  }
  updateConfigs() {
    const e = this._gantt;
    this.maxSteps = e.config.undo_steps || 100, this.command.entity = e.config.undo_types, this.command.type = e.config.undo_actions, this.undoEnabled = !!e.config.undo, this.redoEnabled = !!e.config.redo;
  }
  undo() {
    const e = this._gantt;
    if (this.updateConfigs(), !this.undoEnabled) return;
    const n = this._pop(this._undoStack);
    if (n && this._reorderCommands(n), e.callEvent("onBeforeUndo", [n]) !== !1 && n) return this._applyAction(this.action.invert(n)), this._push(this._redoStack, e.copy(n)), void e.callEvent("onAfterUndo", [n]);
    e.callEvent("onAfterUndo", [null]);
  }
  redo() {
    const e = this._gantt;
    if (this.updateConfigs(), !this.redoEnabled) return;
    const n = this._pop(this._redoStack);
    if (n && this._reorderCommands(n), e.callEvent("onBeforeRedo", [n]) !== !1 && n) return this._applyAction(n), this._push(this._undoStack, e.copy(n)), void e.callEvent("onAfterRedo", [n]);
    e.callEvent("onAfterRedo", [null]);
  }
  logAction(e) {
    this._push(this._undoStack, e), this._redoStack = [];
  }
  _push(e, n) {
    const i = this._gantt;
    if (!n.commands.length) return;
    const a = e === this._undoStack ? "onBeforeUndoStack" : "onBeforeRedoStack";
    if (i.callEvent(a, [n]) !== !1 && n.commands.length) {
      for (e.push(n); e.length > this.maxSteps; ) e.shift();
      return n;
    }
  }
  _pop(e) {
    return e.pop();
  }
  _reorderCommands(e) {
    const n = { any: 0, link: 1, task: 2 }, i = { move: 1, any: 0 };
    e.commands.sort(function(a, r) {
      if (a.entity === "task" && r.entity === "task") return a.type !== r.type ? (i[r.type] || 0) - (i[a.type] || 0) : a.type === "move" && a.oldValue && r.oldValue && r.oldValue.parent === a.oldValue.parent ? a.oldValue.$index - r.oldValue.$index : 0;
      {
        const s = n[a.entity] || n.any;
        return (n[r.entity] || n.any) - s;
      }
    });
  }
  _applyAction(e) {
    let n = null;
    const i = this.command.entity, a = this.command.type, r = this._gantt, s = {};
    s[i.task] = { add: "addTask", get: "getTask", update: "updateTask", remove: "deleteTask", move: "moveTask", isExists: "isTaskExists" }, s[i.link] = { add: "addLink", get: "getLink", update: "updateLink", remove: "deleteLink", isExists: "isLinkExists" }, r.batchUpdate(function() {
      for (let o = 0; o < e.commands.length; o++) {
        n = e.commands[o];
        const l = s[n.entity][n.type], c = s[n.entity].get, d = s[n.entity].isExists;
        if (n.type === a.add) r[l](n.oldValue, n.oldValue.parent, n.oldValue.$local_index);
        else if (n.type === a.remove) r[d](n.value.id) && r[l](n.value.id);
        else if (n.type === a.update) {
          const u = r[c](n.value.id);
          for (const h in n.value) {
            let _ = !(h.startsWith("$") || h.startsWith("_"));
            ["$open"].indexOf(h) > -1 && (_ = !0), _ && (u[h] = n.value[h]);
          }
          r[l](n.value.id);
        } else n.type === a.move && (r[l](n.value.id, n.value.$local_index, n.value.parent), r.callEvent("onRowDragEnd", [n.value.id]));
      }
    });
  }
}
const Vn = { click_drag: function(t) {
  t.ext || (t.ext = {});
  const e = { className: "gantt_click_drag_rect", useRequestAnimationFrame: !0, callback: void 0, singleRow: !1 };
  function n() {
    const i = { viewPort: t.$task_data, ...e };
    t.ext.clickDrag && t.ext.clickDrag.destructor(), t.ext.clickDrag = new Nn(t);
    const a = t.config.click_drag;
    i.render = a.render || e.render, i.className = a.className || e.className, i.callback = a.callback || e.callback, i.viewPort = a.viewPort || t.$task_data, i.useRequestAnimationFrame = a.useRequestAnimationFrame === void 0 ? e.useRequestAnimationFrame : a.useRequestAnimationFrame, i.singleRow = a.singleRow === void 0 ? e.singleRow : a.singleRow;
    const r = t.$ui.getView("timeline"), s = new Pn(i, t, r);
    t.ext.clickDrag.attach(s, a.useKey, a.ignore);
  }
  t.attachEvent("onGanttReady", () => {
    t.config.click_drag && n();
  }), t.attachEvent("onGanttLayoutReady", function() {
    t.$container && t.config.click_drag && t.attachEvent("onGanttRender", function() {
      n();
    }, { once: !0 });
  }), t.attachEvent("onDestroy", () => {
    t.ext.clickDrag && t.ext.clickDrag.destructor();
  });
}, drag_timeline: function(t) {
  t.ext || (t.ext = {}), t.ext.dragTimeline = { create: () => Yt.create(t), _isDragInProgress: () => Yt._isDragInProgress }, t.config.drag_timeline = { enabled: !0, render: !1 };
}, fullscreen: function(t) {
  function e() {
    const d = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    return !(!d || d !== document.body);
  }
  function n() {
    try {
      return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
    } catch (d) {
      console.error("Fullscreen is not available:", d);
    }
  }
  t.$services.getService("state").registerProvider("fullscreen", () => n() ? { fullscreen: e() } : void 0);
  let i = { overflow: null, padding: null, paddingTop: null, paddingRight: null, paddingBottom: null, paddingLeft: null };
  const a = { width: null, height: null, top: null, left: null, position: null, zIndex: null, modified: !1 };
  let r = null;
  function s(d, u) {
    u.width = d.width, u.height = d.height, u.top = d.top, u.left = d.left, u.position = d.position, u.zIndex = d.zIndex;
  }
  let o = !1;
  function l() {
    if (!t.$container) return;
    let d;
    e() ? o && (d = "onExpand", function() {
      const u = t.ext.fullscreen.getFullscreenElement(), h = document.body;
      s(u.style, a), i = { overflow: h.style.overflow, padding: h.style.padding ? h.style.padding : null, paddingTop: h.style.paddingTop ? h.style.paddingTop : null, paddingRight: h.style.paddingRight ? h.style.paddingRight : null, paddingBottom: h.style.paddingBottom ? h.style.paddingBottom : null, paddingLeft: h.style.paddingLeft ? h.style.paddingLeft : null }, h.style.padding && (h.style.padding = "0"), h.style.paddingTop && (h.style.paddingTop = "0"), h.style.paddingRight && (h.style.paddingRight = "0"), h.style.paddingBottom && (h.style.paddingBottom = "0"), h.style.paddingLeft && (h.style.paddingLeft = "0"), h.style.overflow = "hidden", u.style.width = "100vw", u.style.height = "100vh", u.style.top = "0px", u.style.left = "0px", u.style.position = "absolute", u.style.zIndex = 1, a.modified = !0, r = function(_) {
        let p = _.parentNode;
        const y = [];
        for (; p && p.style; ) y.push({ element: p, originalPositioning: p.style.position }), p.style.position = "static", p = p.parentNode;
        return y;
      }(u);
    }()) : o && (o = !1, d = "onCollapse", function() {
      const u = t.ext.fullscreen.getFullscreenElement(), h = document.body;
      a.modified && (i.padding && (h.style.padding = i.padding), i.paddingTop && (h.style.paddingTop = i.paddingTop), i.paddingRight && (h.style.paddingRight = i.paddingRight), i.paddingBottom && (h.style.paddingBottom = i.paddingBottom), i.paddingLeft && (h.style.paddingLeft = i.paddingLeft), h.style.overflow = i.overflow, i = { overflow: null, padding: null, paddingTop: null, paddingRight: null, paddingBottom: null, paddingLeft: null }, s(a, u.style), a.modified = !1), r.forEach((_) => {
        _.element.style.position = _.originalPositioning;
      }), r = null;
    }()), setTimeout(() => {
      t.render();
    }), setTimeout(() => {
      t.callEvent(d, [t.ext.fullscreen.getFullscreenElement()]);
    });
  }
  function c() {
    return !t.$container || !t.ext.fullscreen.getFullscreenElement() ? !0 : n() ? !1 : ((console.warning || console.log)("The `fullscreen` feature not being allowed, or full-screen mode not being supported"), !0);
  }
  t.ext.fullscreen = { expand() {
    if (c() || e() || !t.callEvent("onBeforeExpand", [this.getFullscreenElement()])) return;
    o = !0;
    const d = document.body, u = d.webkitRequestFullscreen ? [Element.ALLOW_KEYBOARD_INPUT] : [], h = d.msRequestFullscreen || d.mozRequestFullScreen || d.webkitRequestFullscreen || d.requestFullscreen;
    h && h.apply(d, u);
  }, collapse() {
    if (c() || !e() || !t.callEvent("onBeforeCollapse", [this.getFullscreenElement()])) return;
    const d = document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.exitFullscreen;
    d && d.apply(document);
  }, toggle() {
    c() || (e() ? this.collapse() : this.expand());
  }, getFullscreenElement: () => t.$root }, t.expand = function() {
    t.ext.fullscreen.expand();
  }, t.collapse = function() {
    t.ext.fullscreen.collapse();
  }, t.attachEvent("onGanttReady", function() {
    t.event(document, "webkitfullscreenchange", l), t.event(document, "mozfullscreenchange", l), t.event(document, "MSFullscreenChange", l), t.event(document, "fullscreenChange", l), t.event(document, "fullscreenchange", l);
  });
}, keyboard_navigation: function(t) {
  (function(e) {
    e.config.keyboard_navigation = !0, e.config.keyboard_navigation_cells = !1, e.$keyboardNavigation = {}, e._compose = function() {
      for (var n = Array.prototype.slice.call(arguments, 0), i = {}, a = 0; a < n.length; a++) {
        var r = n[a];
        for (var s in typeof r == "function" && (r = new r()), r) i[s] = r[s];
      }
      return i;
    }, function(n) {
      n.$keyboardNavigation.shortcuts = { createCommand: function() {
        return { modifiers: { shift: !1, alt: !1, ctrl: !1, meta: !1 }, keyCode: null };
      }, parse: function(i) {
        for (var a = [], r = this.getExpressions(this.trim(i)), s = 0; s < r.length; s++) {
          for (var o = this.getWords(r[s]), l = this.createCommand(), c = 0; c < o.length; c++) this.commandKeys[o[c]] ? l.modifiers[o[c]] = !0 : this.specialKeys[o[c]] ? l.keyCode = this.specialKeys[o[c]] : l.keyCode = o[c].charCodeAt(0);
          a.push(l);
        }
        return a;
      }, getCommandFromEvent: function(i) {
        var a = this.createCommand();
        a.modifiers.shift = !!i.shiftKey, a.modifiers.alt = !!i.altKey, a.modifiers.ctrl = !!i.ctrlKey, a.modifiers.meta = !!i.metaKey, a.keyCode = i.which || i.keyCode, a.keyCode >= 96 && a.keyCode <= 105 && (a.keyCode -= 48);
        var r = String.fromCharCode(a.keyCode);
        return r && (a.keyCode = r.toLowerCase().charCodeAt(0)), a;
      }, getHashFromEvent: function(i) {
        return this.getHash(this.getCommandFromEvent(i));
      }, getHash: function(i) {
        var a = [];
        for (var r in i.modifiers) i.modifiers[r] && a.push(r);
        return a.push(i.keyCode), a.join(this.junctionChar);
      }, getExpressions: function(i) {
        return i.split(this.junctionChar);
      }, getWords: function(i) {
        return i.split(this.combinationChar);
      }, trim: function(i) {
        return i.replace(/\s/g, "");
      }, junctionChar: ",", combinationChar: "+", commandKeys: { shift: 16, alt: 18, ctrl: 17, meta: !0 }, specialKeys: { backspace: 8, tab: 9, enter: 13, esc: 27, space: 32, up: 38, down: 40, left: 37, right: 39, home: 36, end: 35, pageup: 33, pagedown: 34, delete: 46, insert: 45, plus: 107, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123 } };
    }(e), function(n) {
      n.$keyboardNavigation.EventHandler = { _handlers: null, findHandler: function(i) {
        this._handlers || (this._handlers = {});
        var a = n.$keyboardNavigation.shortcuts.getHash(i);
        return this._handlers[a];
      }, doAction: function(i, a) {
        var r = this.findHandler(i);
        if (r) {
          if (n.$keyboardNavigation.facade.callEvent("onBeforeAction", [i, a]) === !1) return;
          r.call(this, a), a.preventDefault ? a.preventDefault() : a.returnValue = !1;
        }
      }, bind: function(i, a) {
        this._handlers || (this._handlers = {});
        for (var r = n.$keyboardNavigation.shortcuts, s = r.parse(i), o = 0; o < s.length; o++) this._handlers[r.getHash(s[o])] = a;
      }, unbind: function(i) {
        for (var a = n.$keyboardNavigation.shortcuts, r = a.parse(i), s = 0; s < r.length; s++) this._handlers[a.getHash(r[s])] && delete this._handlers[a.getHash(r[s])];
      }, bindAll: function(i) {
        for (var a in i) this.bind(a, i[a]);
      }, initKeys: function() {
        this._handlers || (this._handlers = {}), this.keys && this.bindAll(this.keys);
      } };
    }(e), function(n) {
      n.$keyboardNavigation.getFocusableNodes = Lt, n.$keyboardNavigation.trapFocus = function(i, a) {
        if (a.keyCode != 9) return !1;
        for (var r = n.$keyboardNavigation.getFocusableNodes(i), s = ge(), o = -1, l = 0; l < r.length; l++) if (r[l] == s) {
          o = l;
          break;
        }
        if (a.shiftKey) {
          if (o <= 0) {
            var c = r[r.length - 1];
            if (c) return c.focus(), a.preventDefault(), !0;
          }
        } else if (o >= r.length - 1) {
          var d = r[0];
          if (d) return d.focus(), a.preventDefault(), !0;
        }
        return !1;
      };
    }(e), function(n) {
      n.$keyboardNavigation.GanttNode = function() {
      }, n.$keyboardNavigation.GanttNode.prototype = n._compose(n.$keyboardNavigation.EventHandler, { focus: function() {
        n.focus();
      }, blur: function() {
      }, isEnabled: function() {
        return n.$container.hasAttribute("tabindex");
      }, scrollHorizontal: function(i) {
        var a = n.dateFromPos(n.getScrollState().x), r = n.getScale(), s = i < 0 ? -r.step : r.step;
        a = n.date.add(a, s, r.unit), n.scrollTo(n.posFromDate(a));
      }, scrollVertical: function(i) {
        var a = n.getScrollState().y, r = n.config.row_height;
        n.scrollTo(null, a + (i < 0 ? -1 : 1) * r);
      }, keys: { "alt+left": function(i) {
        this.scrollHorizontal(-1);
      }, "alt+right": function(i) {
        this.scrollHorizontal(1);
      }, "alt+up": function(i) {
        this.scrollVertical(-1);
      }, "alt+down": function(i) {
        this.scrollVertical(1);
      }, "ctrl+z": function() {
        n.undo && n.undo();
      }, "ctrl+r": function() {
        n.redo && n.redo();
      } } }), n.$keyboardNavigation.GanttNode.prototype.bindAll(n.$keyboardNavigation.GanttNode.prototype.keys);
    }(e), function(n) {
      n.$keyboardNavigation.KeyNavNode = function() {
      }, n.$keyboardNavigation.KeyNavNode.prototype = n._compose(n.$keyboardNavigation.EventHandler, { isValid: function() {
        return !0;
      }, fallback: function() {
        return null;
      }, moveTo: function(i) {
        n.$keyboardNavigation.dispatcher.setActiveNode(i);
      }, compareTo: function(i) {
        if (!i) return !1;
        for (var a in this) {
          if (!!this[a] != !!i[a]) return !1;
          var r = !(!this[a] || !this[a].toString), s = !(!i[a] || !i[a].toString);
          if (s != r) return !1;
          if (s && r) {
            if (i[a].toString() != this[a].toString()) return !1;
          } else if (i[a] != this[a]) return !1;
        }
        return !0;
      }, getNode: function() {
      }, focus: function() {
        var i = this.getNode();
        if (i) {
          var a = n.$keyboardNavigation.facade;
          a.callEvent("onBeforeFocus", [i]) !== !1 && i && (i.setAttribute("tabindex", "-1"), i.$eventAttached || (i.$eventAttached = !0, n.event(i, "focus", function(r) {
            return r.preventDefault(), !1;
          }, !1)), n.utils.dom.isChildOf(document.activeElement, i) && (i = document.activeElement), i.focus && i.focus(), a.callEvent("onFocus", [this.getNode()]));
        }
      }, blur: function() {
        var i = this.getNode();
        i && (n.$keyboardNavigation.facade.callEvent("onBlur", [i]), i.setAttribute("tabindex", "-1"));
      } });
    }(e), function(n) {
      n.$keyboardNavigation.HeaderCell = function(i) {
        this.index = i || 0;
      }, n.$keyboardNavigation.HeaderCell.prototype = n._compose(n.$keyboardNavigation.KeyNavNode, { _handlers: null, isValid: function() {
        return !(!n.config.show_grid && n.getVisibleTaskCount() || !n.getGridColumns()[this.index] && n.getVisibleTaskCount());
      }, fallback: function() {
        if (!n.config.show_grid) return n.getVisibleTaskCount() ? new n.$keyboardNavigation.TaskRow() : null;
        for (var i = n.getGridColumns(), a = this.index; a >= 0 && !i[a]; ) a--;
        return i[a] ? new n.$keyboardNavigation.HeaderCell(a) : null;
      }, fromDomElement: function(i) {
        var a = pt(i, "gantt_grid_head_cell");
        if (a) {
          for (var r = 0; a && a.previousSibling; ) a = a.previousSibling, r += 1;
          return new n.$keyboardNavigation.HeaderCell(r);
        }
        return null;
      }, getNode: function() {
        const i = n.$grid_scale;
        return i ? i.childNodes[this.index] : null;
      }, keys: { left: function() {
        this.index > 0 && this.moveTo(new n.$keyboardNavigation.HeaderCell(this.index - 1));
      }, right: function() {
        var i = n.getGridColumns();
        this.index < i.length - 1 && this.moveTo(new n.$keyboardNavigation.HeaderCell(this.index + 1));
      }, down: function() {
        var i, a = n.getChildren(n.config.root_id);
        n.isTaskExists(a[0]) && (i = a[0]), i && (n.config.keyboard_navigation_cells ? this.moveTo(new n.$keyboardNavigation.TaskCell(i, this.index)) : this.moveTo(new n.$keyboardNavigation.TaskRow(i)));
      }, end: function() {
        var i = n.getGridColumns();
        this.moveTo(new n.$keyboardNavigation.HeaderCell(i.length - 1));
      }, home: function() {
        this.moveTo(new n.$keyboardNavigation.HeaderCell(0));
      }, "enter, space": function() {
        ge().click();
      }, "ctrl+enter": function() {
        n.isReadonly(this) || n.createTask({}, this.taskId);
      } } }), n.$keyboardNavigation.HeaderCell.prototype.bindAll(n.$keyboardNavigation.HeaderCell.prototype.keys);
    }(e), function(n) {
      n.$keyboardNavigation.TaskRow = function(i) {
        if (!i) {
          var a = n.getChildren(n.config.root_id);
          a[0] && (i = a[0]);
        }
        this.taskId = i, n.isTaskExists(this.taskId) && (this.index = n.getTaskIndex(this.taskId), this.globalIndex = n.getGlobalTaskIndex(this.taskId), this.splitItem = !!n.getTask(this.taskId).$split_subtask, this.parentId = n.getParent(this.taskId));
      }, n.$keyboardNavigation.TaskRow.prototype = n._compose(n.$keyboardNavigation.KeyNavNode, { _handlers: null, isValid: function() {
        return n.isTaskExists(this.taskId) && n.getTaskIndex(this.taskId) > -1;
      }, fallback: function() {
        if (!n.getVisibleTaskCount()) {
          var i = new n.$keyboardNavigation.HeaderCell();
          return i.isValid() ? i : null;
        }
        if (this.splitItem) return new n.$keyboardNavigation.TaskRow(this.parentId);
        var a = -1;
        if (n.getTaskByIndex(this.globalIndex - 1)) a = this.globalIndex - 1;
        else if (n.getTaskByIndex(this.globalIndex + 1)) a = this.globalIndex + 1;
        else for (var r = this.globalIndex; r >= 0; ) {
          if (n.getTaskByIndex(r)) {
            a = r;
            break;
          }
          r--;
        }
        return a > -1 ? new n.$keyboardNavigation.TaskRow(n.getTaskByIndex(a).id) : void 0;
      }, fromDomElement: function(i) {
        if (n.config.keyboard_navigation_cells) return null;
        var a = n.locate(i);
        return n.isTaskExists(a) ? new n.$keyboardNavigation.TaskRow(a) : null;
      }, getNode: function() {
        if (n.isTaskExists(this.taskId) && n.isTaskVisible(this.taskId)) return n.config.show_grid ? n.$grid.querySelector(`.gantt_row[${n.config.task_attribute}="${String(this.taskId).replaceAll('"', '\\"')}"]`) : n.getTaskNode(this.taskId);
      }, focus: function(i) {
        if (!i) {
          const a = n.getTaskPosition(n.getTask(this.taskId)), r = n.getTaskHeight(this.taskId), s = n.getScrollState();
          let o, l;
          o = n.$task ? n.$task.offsetWidth : s.inner_width, l = n.$grid_data || n.$task_data ? (n.$grid_data || n.$task_data).offsetHeight : s.inner_height;
          const c = n.config.show_chart && n.$ui.getView("timeline");
          a.top < s.y || a.top + r > s.y + l ? n.scrollTo(null, a.top - 20) : n.config.scroll_on_click && c && (a.left > s.x + o ? n.scrollTo(a.left - n.config.task_scroll_offset) : a.left + a.width < s.x && n.scrollTo(a.left + a.width - n.config.task_scroll_offset));
        }
        n.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this, [i]), function() {
          var a = n.$ui.getView("grid");
          if (a && a.$grid_data) {
            var r = parseInt(a.$grid.scrollLeft), s = parseInt(a.$grid_data.scrollTop), o = a.$config.scrollX;
            if (o && a.$config.scrollable) {
              var l = n.$ui.getView(o);
              l && l.scrollTo(r, s);
            }
            var c = a.$config.scrollY;
            if (c) {
              var d = n.$ui.getView(c);
              d && d.scrollTo(r, s);
            }
          }
        }();
      }, keys: { pagedown: function() {
        n.getVisibleTaskCount() && this.moveTo(new n.$keyboardNavigation.TaskRow(n.getTaskByIndex(n.getVisibleTaskCount() - 1).id));
      }, pageup: function() {
        n.getVisibleTaskCount() && this.moveTo(new n.$keyboardNavigation.TaskRow(n.getTaskByIndex(0).id));
      }, up: function() {
        var i = null, a = n.getPrev(this.taskId);
        i = n.isTaskExists(a) ? new n.$keyboardNavigation.TaskRow(a) : new n.$keyboardNavigation.HeaderCell(), this.moveTo(i);
      }, down: function() {
        var i = n.getNext(this.taskId);
        n.isTaskExists(i) && this.moveTo(new n.$keyboardNavigation.TaskRow(i));
      }, "shift+down": function() {
        n.hasChild(this.taskId) && !n.getTask(this.taskId).$open && n.open(this.taskId);
      }, "shift+up": function() {
        n.hasChild(this.taskId) && n.getTask(this.taskId).$open && n.close(this.taskId);
      }, "shift+right": function() {
        if (!n.isReadonly(this)) {
          var i = n.getPrevSibling(this.taskId);
          n.isTaskExists(i) && !n.isChildOf(this.taskId, i) && (n.getTask(i).$open = !0, n.moveTask(this.taskId, -1, i) !== !1 && n.updateTask(this.taskId));
        }
      }, "shift+left": function() {
        if (!n.isReadonly(this)) {
          var i = n.getParent(this.taskId);
          n.isTaskExists(i) && n.moveTask(this.taskId, n.getTaskIndex(i) + 1, n.getParent(i)) !== !1 && n.updateTask(this.taskId);
        }
      }, space: function(i) {
        n.isSelectedTask(this.taskId) ? n.unselectTask(this.taskId) : n.selectTask(this.taskId);
      }, "ctrl+left": function(i) {
        n.close(this.taskId);
      }, "ctrl+right": function(i) {
        n.open(this.taskId);
      }, delete: function(i) {
        n.isReadonly(this) || n.$click.buttons.delete(this.taskId);
      }, enter: function() {
        n.isReadonly(this) || n.showLightbox(this.taskId);
      }, "ctrl+enter": function() {
        n.isReadonly(this) || n.createTask({}, this.taskId);
      } } }), n.$keyboardNavigation.TaskRow.prototype.bindAll(n.$keyboardNavigation.TaskRow.prototype.keys);
    }(e), function(n) {
      n.$keyboardNavigation.TaskCell = function(i, a) {
        if (!(i = at(i, n.config.root_id))) {
          var r = n.getChildren(n.config.root_id);
          r[0] && (i = r[0]);
        }
        this.taskId = i, this.columnIndex = a || 0, n.isTaskExists(this.taskId) && (this.index = n.getTaskIndex(this.taskId), this.globalIndex = n.getGlobalTaskIndex(this.taskId));
      }, n.$keyboardNavigation.TaskCell.prototype = n._compose(n.$keyboardNavigation.TaskRow, { _handlers: null, isValid: function() {
        return n.$keyboardNavigation.TaskRow.prototype.isValid.call(this) && !!n.getGridColumns()[this.columnIndex];
      }, fallback: function() {
        var i = n.$keyboardNavigation.TaskRow.prototype.fallback.call(this), a = i;
        if (i instanceof n.$keyboardNavigation.TaskRow) {
          for (var r = n.getGridColumns(), s = this.columnIndex; s >= 0 && !r[s]; ) s--;
          r[s] && (a = new n.$keyboardNavigation.TaskCell(i.taskId, s));
        }
        return a;
      }, fromDomElement: function(i) {
        if (!n.config.keyboard_navigation_cells) return null;
        var a = n.locate(i);
        if (n.isTaskExists(a)) {
          var r = 0, s = nt(i, "data-column-index");
          return s && (r = 1 * s.getAttribute("data-column-index")), new n.$keyboardNavigation.TaskCell(a, r);
        }
        return null;
      }, getNode: function() {
        if (n.isTaskExists(this.taskId) && (n.isTaskVisible(this.taskId) || n.config.show_tasks_outside_timescale)) {
          if (n.config.show_grid && n.$grid) {
            var i = n.$grid.querySelector(".gantt_row[" + n.config.task_attribute + "='" + this.taskId + "']");
            return i ? i.querySelector("[data-column-index='" + this.columnIndex + "']") : null;
          }
          return n.getTaskNode(this.taskId);
        }
      }, keys: { up: function() {
        var i = null, a = n.getPrev(this.taskId);
        i = n.isTaskExists(a) ? new n.$keyboardNavigation.TaskCell(a, this.columnIndex) : new n.$keyboardNavigation.HeaderCell(this.columnIndex), this.moveTo(i);
      }, down: function() {
        var i = n.getNext(this.taskId);
        n.isTaskExists(i) && this.moveTo(new n.$keyboardNavigation.TaskCell(i, this.columnIndex));
      }, left: function() {
        this.columnIndex > 0 && this.moveTo(new n.$keyboardNavigation.TaskCell(this.taskId, this.columnIndex - 1));
      }, right: function() {
        var i = n.getGridColumns();
        this.columnIndex < i.length - 1 && this.moveTo(new n.$keyboardNavigation.TaskCell(this.taskId, this.columnIndex + 1));
      }, end: function() {
        var i = n.getGridColumns();
        this.moveTo(new n.$keyboardNavigation.TaskCell(this.taskId, i.length - 1));
      }, home: function() {
        this.moveTo(new n.$keyboardNavigation.TaskCell(this.taskId, 0));
      }, pagedown: function() {
        n.getVisibleTaskCount() && this.moveTo(new n.$keyboardNavigation.TaskCell(n.getTaskByIndex(n.getVisibleTaskCount() - 1).id, this.columnIndex));
      }, pageup: function() {
        n.getVisibleTaskCount() && this.moveTo(new n.$keyboardNavigation.TaskCell(n.getTaskByIndex(0).id, this.columnIndex));
      } } }), n.$keyboardNavigation.TaskCell.prototype.bindAll(n.$keyboardNavigation.TaskRow.prototype.keys), n.$keyboardNavigation.TaskCell.prototype.bindAll(n.$keyboardNavigation.TaskCell.prototype.keys);
    }(e), Rn(e), function(n) {
      n.$keyboardNavigation.dispatcher = { isActive: !1, activeNode: null, globalNode: new n.$keyboardNavigation.GanttNode(), enable: function() {
        this.isActive = !0, this.setActiveNode(this.getActiveNode());
      }, disable: function() {
        this.isActive = !1;
      }, isEnabled: function() {
        return !!this.isActive;
      }, getDefaultNode: function() {
        var i;
        return (i = n.config.keyboard_navigation_cells ? new n.$keyboardNavigation.TaskCell() : new n.$keyboardNavigation.TaskRow()).isValid() || (i = i.fallback()), i;
      }, setDefaultNode: function() {
        this.setActiveNode(this.getDefaultNode());
      }, getActiveNode: function() {
        var i = this.activeNode;
        return i && !i.isValid() && (i = i.fallback()), i;
      }, fromDomElement: function(i) {
        for (var a = [n.$keyboardNavigation.TaskRow, n.$keyboardNavigation.TaskCell, n.$keyboardNavigation.HeaderCell], r = 0; r < a.length; r++) if (a[r].prototype.fromDomElement) {
          var s = a[r].prototype.fromDomElement(i);
          if (s) return s;
        }
        return null;
      }, focusGlobalNode: function() {
        this.blurNode(this.globalNode), this.focusNode(this.globalNode);
      }, setActiveNode: function(i) {
        var a = !0;
        this.activeNode && this.activeNode.compareTo(i) && (a = !1), this.isEnabled() && (a && this.blurNode(this.activeNode), this.activeNode = i, this.focusNode(this.activeNode, !a));
      }, focusNode: function(i, a) {
        i && i.focus && i.focus(a);
      }, blurNode: function(i) {
        i && i.blur && i.blur();
      }, keyDownHandler: function(i) {
        if (!n.$keyboardNavigation.isModal() && this.isEnabled() && !i.defaultPrevented) {
          var a = this.globalNode, r = n.$keyboardNavigation.shortcuts.getCommandFromEvent(i), s = this.getActiveNode();
          n.$keyboardNavigation.facade.callEvent("onKeyDown", [r, i]) !== !1 && (s ? s.findHandler(r) ? s.doAction(r, i) : a.findHandler(r) && a.doAction(r, i) : this.setDefaultNode());
        }
      }, _timeout: null, awaitsFocus: function() {
        return this._timeout !== null;
      }, delay: function(i, a) {
        clearTimeout(this._timeout), this._timeout = setTimeout(n.bind(function() {
          this._timeout = null, i();
        }, this), a || 1);
      }, clearDelay: function() {
        clearTimeout(this._timeout);
      } };
    }(e), function() {
      var n = e.$keyboardNavigation.dispatcher;
      n.isTaskFocused = function(k) {
        var b = n.activeNode;
        return (b instanceof e.$keyboardNavigation.TaskRow || b instanceof e.$keyboardNavigation.TaskCell) && b.taskId == k;
      };
      var i = function(k) {
        if (e.config.keyboard_navigation && (e.config.keyboard_navigation_cells || !s(k)) && !o(k) && !function(b) {
          return !!dt(b.target, ".gantt_cal_light");
        }(k)) return n.keyDownHandler(k);
      }, a = function(k) {
        if (n.$preventDefault) return k.preventDefault(), e.$container.blur(), !1;
        n.awaitsFocus() || n.focusGlobalNode();
      }, r = function() {
        if (!n.isEnabled()) return;
        const k = !Y(document.activeElement, e.$container) && document.activeElement.localName != "body";
        var b = n.getActiveNode();
        if (b && !k) {
          var g, m, f = b.getNode();
          f && f.parentNode && (g = f.parentNode.scrollTop, m = f.parentNode.scrollLeft), b.focus(!0), f && f.parentNode && (f.parentNode.scrollTop = g, f.parentNode.scrollLeft = m);
        }
      };
      function s(k) {
        return !!dt(k.target, ".gantt_grid_editor_placeholder");
      }
      function o(k) {
        return !!dt(k.target, ".no_keyboard_navigation");
      }
      function l(k) {
        if (!e.config.keyboard_navigation || !e.config.keyboard_navigation_cells && s(k)) return !0;
        if (!o(k)) {
          var b, g = n.fromDomElement(k);
          if (g && (n.activeNode instanceof e.$keyboardNavigation.TaskCell && Y(k.target, e.$task) && (g = new e.$keyboardNavigation.TaskCell(g.taskId, n.activeNode.columnIndex)), b = g, e.config.show_grid && e.$ui.getView("grid") && e.config.keyboard_navigation_cells)) {
            const m = k.target.classList.contains("gantt_row"), f = k.target.closest(".gantt_task_line"), v = e.utils.dom.getNodePosition(e.$grid).x, x = v + e.$grid.offsetWidth, $ = e.utils.dom.getNodePosition(document.activeElement).x;
            if (m || f && ($ < v || x < $)) {
              let w = e.$grid.scrollLeft;
              const S = w + e.$grid.offsetWidth;
              let T = 0;
              m && (w = e.utils.dom.getRelativeEventPosition(k, e.$grid).x);
              for (let E = 0; E < e.config.columns.length; E++) {
                const C = e.config.columns[E];
                if (!C.hide && (T += C.width, w < T)) {
                  S < T && (T -= C.width), b.columnIndex = E;
                  break;
                }
              }
            }
          }
          b ? n.isEnabled() ? n.delay(function() {
            n.setActiveNode(b);
          }) : n.activeNode = b : (n.$preventDefault = !0, setTimeout(function() {
            n.$preventDefault = !1;
          }, 300));
        }
      }
      e.attachEvent("onDataRender", function() {
        e.config.keyboard_navigation && r();
      }), e.attachEvent("onGanttRender", function() {
        e.$root && (e.eventRemove(e.$root, "keydown", i), e.eventRemove(e.$container, "focus", a), e.eventRemove(e.$container, "mousedown", l), e.config.keyboard_navigation ? (e.event(e.$root, "keydown", i), e.event(e.$container, "focus", a), e.event(e.$container, "mousedown", l), e.$container.setAttribute("tabindex", "0")) : e.$container.removeAttribute("tabindex"));
      });
      var c = e.attachEvent("onGanttReady", function() {
        if (e.detachEvent(c), e.$data.tasksStore.attachEvent("onStoreUpdated", function(b) {
          if (e.config.keyboard_navigation && n.isEnabled()) {
            const g = n.getActiveNode(), m = e.$ui.getView("grid");
            if (!m || !m.$grid_data) return;
            const f = m.getItemTop(b), v = m.$grid_data.scrollTop, x = v + m.$grid_data.getBoundingClientRect().height;
            g && g.taskId == b && v <= f && x >= f && r();
          }
        }), e._smart_render) {
          var k = e._smart_render._redrawTasks;
          e._smart_render._redrawTasks = function(b, g) {
            if (e.config.keyboard_navigation && n.isEnabled()) {
              var m = n.getActiveNode();
              if (m && m.taskId !== void 0) {
                for (var f = !1, v = 0; v < g.length; v++) if (g[v].id == m.taskId && g[v].start_date) {
                  f = !0;
                  break;
                }
                f || g.push(e.getTask(m.taskId));
              }
            }
            return k.apply(this, arguments);
          };
        }
      });
      let d = null, u = !1;
      e.attachEvent("onTaskCreated", function(k) {
        return d = k.id, !0;
      }), e.attachEvent("onAfterTaskAdd", function(k, b) {
        if (!e.config.keyboard_navigation) return !0;
        if (n.isEnabled()) {
          if (k == d && (u = !0, setTimeout(() => {
            u = !1, d = null;
          })), u && b.type == e.config.types.placeholder) return;
          var g = 0, m = n.activeNode;
          m instanceof e.$keyboardNavigation.TaskCell && (g = m.columnIndex);
          var f = e.config.keyboard_navigation_cells ? e.$keyboardNavigation.TaskCell : e.$keyboardNavigation.TaskRow;
          b.type == e.config.types.placeholder && e.config.placeholder_task.focusOnCreate === !1 || n.setActiveNode(new f(k, g));
        }
      }), e.attachEvent("onTaskIdChange", function(k, b) {
        if (!e.config.keyboard_navigation) return !0;
        var g = n.activeNode;
        return n.isTaskFocused(k) && (g.taskId = b), !0;
      });
      var h = setInterval(function() {
        e.config.keyboard_navigation && (n.isEnabled() || n.enable());
      }, 500);
      function _(k) {
        var b = { gantt: e.$keyboardNavigation.GanttNode, headerCell: e.$keyboardNavigation.HeaderCell, taskRow: e.$keyboardNavigation.TaskRow, taskCell: e.$keyboardNavigation.TaskCell };
        return b[k] || b.gantt;
      }
      function p(k) {
        for (var b = e.getGridColumns(), g = 0; g < b.length; g++) if (b[g].name == k) return g;
        return 0;
      }
      e.attachEvent("onDestroy", function() {
        clearInterval(h);
      });
      var y = {};
      ot(y), e.mixin(y, { addShortcut: function(k, b, g) {
        var m = _(g);
        m && m.prototype.bind(k, b);
      }, getShortcutHandler: function(k, b) {
        var g = e.$keyboardNavigation.shortcuts.parse(k);
        if (g.length) return y.getCommandHandler(g[0], b);
      }, getCommandHandler: function(k, b) {
        var g = _(b);
        if (g && k) return g.prototype.findHandler(k);
      }, removeShortcut: function(k, b) {
        var g = _(b);
        g && g.prototype.unbind(k);
      }, focus: function(k) {
        var b, g = k ? k.type : null, m = _(g);
        switch (g) {
          case "taskCell":
            b = new m(k.id, p(k.column));
            break;
          case "taskRow":
            b = new m(k.id);
            break;
          case "headerCell":
            b = new m(p(k.column));
        }
        n.delay(function() {
          b ? n.setActiveNode(b) : (n.enable(), n.getActiveNode() ? n.awaitsFocus() || n.enable() : n.setDefaultNode());
        });
      }, getActiveNode: function() {
        if (n.isEnabled()) {
          var k = n.getActiveNode(), b = (m = k) instanceof e.$keyboardNavigation.GanttNode ? "gantt" : m instanceof e.$keyboardNavigation.HeaderCell ? "headerCell" : m instanceof e.$keyboardNavigation.TaskRow ? "taskRow" : m instanceof e.$keyboardNavigation.TaskCell ? "taskCell" : null, g = e.getGridColumns();
          switch (b) {
            case "taskCell":
              return { type: "taskCell", id: k.taskId, column: g[k.columnIndex].name };
            case "taskRow":
              return { type: "taskRow", id: k.taskId };
            case "headerCell":
              return { type: "headerCell", column: g[k.index].name };
          }
        }
        var m;
        return null;
      } }), e.$keyboardNavigation.facade = y, e.ext.keyboardNavigation = y, e.focus = function() {
        y.focus();
      }, e.addShortcut = y.addShortcut, e.getShortcutHandler = y.getShortcutHandler, e.removeShortcut = y.removeShortcut;
    }();
  })(t);
}, quick_info: function(t) {
  t.ext || (t.ext = {}), t.ext.quickInfo = new Hn(t), t.config.quickinfo_buttons = ["icon_edit", "icon_delete"], t.config.quick_info_detached = !0, t.config.show_quick_info = !0, t.templates.quick_info_title = function(a, r, s) {
    return s.text.substr(0, 50);
  }, t.templates.quick_info_content = function(a, r, s) {
    return s.details || s.text;
  }, t.templates.quick_info_date = function(a, r, s) {
    return t.templates.task_time(a, r, s);
  }, t.templates.quick_info_class = function(a, r, s) {
    return "";
  }, t.attachEvent("onTaskClick", function(a, r) {
    const s = t.utils.dom.closest(r.target, ".gantt_add"), o = t.utils.dom.closest(r.target, ".gantt_close"), l = t.utils.dom.closest(r.target, ".gantt_open");
    return !s && !o && !l && setTimeout(function() {
      t.ext.quickInfo.show(a);
    }, 0), !0;
  });
  const e = ["onViewChange", "onLightbox", "onBeforeTaskDelete", "onBeforeDrag"], n = function() {
    return t.ext.quickInfo.hide(), !0;
  };
  for (let a = 0; a < e.length; a++) t.attachEvent(e[a], n);
  function i() {
    return t.ext.quickInfo.hide(), t.ext.quickInfo._quickInfoBox = null, !0;
  }
  t.attachEvent("onEmptyClick", function(a) {
    let r = !0;
    const s = document.querySelector(".gantt_cal_quick_info");
    s && t.utils.dom.isChildOf(a.target, s) && (r = !1), r && n();
  }), t.attachEvent("onGanttReady", i), t.attachEvent("onDestroy", i), t.event(window, "keydown", function(a) {
    a.keyCode === 27 && t.ext.quickInfo.hide();
  }), t.showQuickInfo = function() {
    t.ext.quickInfo.show.apply(t.ext.quickInfo, arguments);
  }, t.hideQuickInfo = function() {
    t.ext.quickInfo.hide.apply(t.ext.quickInfo, arguments);
  };
}, tooltip: function(t) {
  t.config.tooltip_timeout = 30, t.config.tooltip_offset_y = 20, t.config.tooltip_offset_x = 10, t.config.tooltip_hide_timeout = 30;
  const e = new Wn(t);
  t.ext.tooltips = e, t.attachEvent("onGanttReady", function() {
    t.$root && e.tooltipFor({ selector: "[" + t.config.task_attribute + "]:not(.gantt_task_row)", html: (n) => {
      if (t.config.touch && !t.config.touch_tooltip) return;
      const i = t.locate(n);
      if (t.isTaskExists(i)) {
        const a = t.getTask(i);
        return t.templates.tooltip_text(a.start_date, a.end_date, a);
      }
      return null;
    }, global: !1 });
  }), t.attachEvent("onDestroy", function() {
    e.destructor();
  }), t.attachEvent("onLightbox", function() {
    e.hideTooltip();
  }), t.attachEvent("onBeforeTooltip", function() {
    if (t.getState().link_source_id) return !1;
  }), t.attachEvent("onGanttScroll", function() {
    e.hideTooltip();
  });
}, undo: function(t) {
  const e = new Fn(t), n = new jn(e, t);
  function i(d, u) {
    return String(d) === String(u);
  }
  function a(d, u, h) {
    d && (i(d.id, u) && (d.id = h), i(d.parent, u) && (d.parent = h));
  }
  function r(d, u, h) {
    a(d.value, u, h), a(d.oldValue, u, h);
  }
  function s(d, u, h) {
    d && (i(d.source, u) && (d.source = h), i(d.target, u) && (d.target = h));
  }
  function o(d, u, h) {
    s(d.value, u, h), s(d.oldValue, u, h);
  }
  function l(d, u, h) {
    const _ = e;
    for (let p = 0; p < d.length; p++) {
      const y = d[p];
      for (let k = 0; k < y.commands.length; k++) y.commands[k].entity === _.command.entity.task ? r(y.commands[k], u, h) : y.commands[k].entity === _.command.entity.link && o(y.commands[k], u, h);
    }
  }
  function c(d, u, h) {
    const _ = e;
    for (let p = 0; p < d.length; p++) {
      const y = d[p];
      for (let k = 0; k < y.commands.length; k++) {
        const b = y.commands[k];
        b.entity === _.command.entity.link && (b.value && b.value.id === u && (b.value.id = h), b.oldValue && b.oldValue.id === u && (b.oldValue.id = h));
      }
    }
  }
  t.config.undo = !0, t.config.redo = !0, t.config.undo_types = { link: "link", task: "task" }, t.config.undo_actions = { update: "update", remove: "remove", add: "add", move: "move" }, t.ext || (t.ext = {}), t.ext.undo = { undo: () => e.undo(), redo: () => e.redo(), getUndoStack: () => e.getUndoStack(), setUndoStack: (d) => e.setUndoStack(d), getRedoStack: () => e.getRedoStack(), setRedoStack: (d) => e.setRedoStack(d), clearUndoStack: () => e.clearUndoStack(), clearRedoStack: () => e.clearRedoStack(), saveState: (d, u) => n.store(d, u, !0), getInitialState: (d, u) => u === t.config.undo_types.link ? n.getInitialLink(d) : n.getInitialTask(d) }, t.undo = t.ext.undo.undo, t.redo = t.ext.undo.redo, t.getUndoStack = t.ext.undo.getUndoStack, t.getRedoStack = t.ext.undo.getRedoStack, t.clearUndoStack = t.ext.undo.clearUndoStack, t.clearRedoStack = t.ext.undo.clearRedoStack, t.attachEvent("onTaskIdChange", (d, u) => {
    const h = e;
    l(h.getUndoStack(), d, u), l(h.getRedoStack(), d, u);
  }), t.attachEvent("onLinkIdChange", (d, u) => {
    const h = e;
    c(h.getUndoStack(), d, u), c(h.getRedoStack(), d, u);
  }), t.attachEvent("onGanttReady", () => {
    e.updateConfigs();
  });
}, marker: function(t) {
  function e(i) {
    if (!t.config.show_markers || !i.start_date) return !1;
    var a = t.getState();
    if (+i.start_date > +a.max_date || (!i.end_date || +i.end_date < +a.min_date) && +i.start_date < +a.min_date) return;
    var r = document.createElement("div");
    r.setAttribute("data-marker-id", i.id);
    var s = "gantt_marker";
    t.templates.marker_class && (s += " " + t.templates.marker_class(i)), i.css && (s += " " + i.css), t.templates.marker_class && (s += " " + t.templates.marker_class(i)), i.title && (r.title = i.title), r.className = s;
    var o = t.posFromDate(i.start_date);
    r.style.left = o + "px";
    let l = Math.max(t.getRowTop(t.getVisibleTaskCount()), 0) + "px";
    if (t.config.timeline_placeholder && t.$task_data && (l = t.$task_data.scrollHeight + "px"), r.style.height = l, i.end_date) {
      var c = t.posFromDate(i.end_date);
      r.style.width = Math.max(c - o, 0) + "px";
    }
    if (i.text) {
      let d = null;
      d = typeof i.text == "function" ? i.text(i) : i.text, d && (t.config.external_render && t.config.external_render.isElement(d) ? (r.innerHTML = "<div class='gantt_marker_content' ></div>", t.config.external_render.renderElement(d, r.querySelector(".gantt_marker_content"))) : r.innerHTML = "<div class='gantt_marker_content' >" + i.text + "</div>");
    }
    return r;
  }
  function n() {
    if (t.$task_data && t.$root.contains(t.$task_data)) {
      if (!t.$marker_area || !t.$task_data.contains(t.$marker_area)) {
        var i = document.createElement("div");
        i.className = "gantt_marker_area", t.$task_data.appendChild(i), t.$marker_area = i;
      }
    } else t.$marker_area = null;
  }
  t._markers || (t._markers = t.createDatastore({ name: "marker", initItem: function(i) {
    return i.id = i.id || t.uid(), i;
  } })), t.config.show_markers = !0, t.attachEvent("onBeforeGanttRender", function() {
    t.$marker_area || n();
  }), t.attachEvent("onDataRender", function() {
    t.$marker_area || (n(), t.renderMarkers());
  }), t.attachEvent("onGanttLayoutReady", function() {
    t.attachEvent("onBeforeGanttRender", function() {
      t.$marker_area && (t.$marker_area.innerHTML = ""), n(), t.$services.getService("layers").createDataRender({ name: "marker", defaultContainer: function() {
        return t.$marker_area;
      } }).addLayer(e);
    }, { once: !0 });
  }), t.getMarker = function(i) {
    return this._markers ? this._markers.getItem(i) : null;
  }, t.addMarker = function(i) {
    return this._markers.addItem(i);
  }, t.deleteMarker = function(i) {
    return !!this._markers.exists(i) && (this._markers.removeItem(i), !0);
  }, t.updateMarker = function(i) {
    this._markers.refresh(i);
  }, t._getMarkers = function() {
    return this._markers.getItems();
  }, t.renderMarkers = function() {
    this._markers.refresh();
  };
}, multiselect: function(t) {
  t.config.multiselect = !0, t.config.multiselect_one_level = !1, t._multiselect = { _selected: {}, _one_level: !1, _active: !0, _first_selected_when_shift: null, getDefaultSelected: function() {
    var e = this.getSelected();
    return e.length ? e[e.length - 1] : null;
  }, setFirstSelected: function(e) {
    this._first_selected_when_shift = e;
  }, getFirstSelected: function() {
    return this._first_selected_when_shift;
  }, isActive: function() {
    return this.updateState(), this._active;
  }, updateState: function() {
    this._one_level = t.config.multiselect_one_level;
    var e = this._active;
    this._active = t.config.select_task, this._active != e && this.reset();
  }, reset: function() {
    this._selected = {};
  }, setLastSelected: function(e) {
    t.$data.tasksStore.silent(function() {
      var n = t.$data.tasksStore;
      e ? n.select(e + "") : n.unselect(null);
    });
  }, getLastSelected: function() {
    var e = t.$data.tasksStore.getSelectedId();
    return e && t.isTaskExists(e) ? e : null;
  }, select: function(e, n) {
    return !!(e && t.callEvent("onBeforeTaskMultiSelect", [e, !0, n]) && t.callEvent("onBeforeTaskSelected", [e])) && (this._selected[e] = !0, this.setLastSelected(e), this.afterSelect(e), t.callEvent("onTaskMultiSelect", [e, !0, n]), t.callEvent("onTaskSelected", [e]), !0);
  }, toggle: function(e, n) {
    this._selected[e] ? this.unselect(e, n) : this.select(e, n);
  }, unselect: function(e, n) {
    e && t.callEvent("onBeforeTaskMultiSelect", [e, !1, n]) && (this._selected[e] = !1, this.getLastSelected() == e && this.setLastSelected(this.getDefaultSelected()), this.afterSelect(e), t.callEvent("onTaskMultiSelect", [e, !1, n]), t.callEvent("onTaskUnselected", [e]));
  }, isSelected: function(e) {
    return !(!t.isTaskExists(e) || !this._selected[e]);
  }, getSelected: function() {
    var e = [];
    for (var n in this._selected) this._selected[n] && t.isTaskExists(n) ? e.push(n) : this._selected[n] = !1;
    return e.sort(function(i, a) {
      return t.getGlobalTaskIndex(i) > t.getGlobalTaskIndex(a) ? 1 : -1;
    }), e;
  }, forSelected: function(e) {
    for (var n = this.getSelected(), i = 0; i < n.length; i++) e(n[i]);
  }, isSameLevel: function(e) {
    if (!this._one_level) return !0;
    var n = this.getLastSelected();
    return !n || !t.isTaskExists(n) || !t.isTaskExists(e) || t.calculateTaskLevel(t.getTask(n)) == t.calculateTaskLevel(t.getTask(e));
  }, afterSelect: function(e) {
    t.isTaskExists(e) && t._quickRefresh(function() {
      t.refreshTask(e);
    });
  }, doSelection: function(e) {
    if (!this.isActive() || t._is_icon_open_click(e)) return !1;
    var n = t.locate(e);
    if (!n || !t.callEvent("onBeforeMultiSelect", [e])) return !1;
    var i = this.getSelected(), a = this.getFirstSelected(), r = !1, s = this.getLastSelected(), o = t.config.multiselect, l = (function() {
      const d = t.ext.inlineEditors;
      if (d && d.getState) {
        const h = d.getState(), _ = d.locateCell(e.target);
        t.config.inline_editors_multiselect_open && _ && d.getEditorConfig(_.columnName) && (d.isVisible() && h.id == _.id && h.columnName == _.columnName || d.startEdit(_.id, _.columnName));
      }
      this.setFirstSelected(n), this.isSelected(n) || this.select(n, e), i = this.getSelected();
      for (var u = 0; u < i.length; u++) i[u] !== n && this.unselect(i[u], e);
    }).bind(this), c = (function() {
      if (s) {
        if (n) {
          var d = t.getGlobalTaskIndex(this.getFirstSelected()), u = t.getGlobalTaskIndex(n), h = t.getGlobalTaskIndex(s);
          d != -1 && h != -1 || (d = u, this.reset());
          for (var _ = s; t.getGlobalTaskIndex(_) !== d; ) this.unselect(_, e), _ = d > h ? t.getNext(_) : t.getPrev(_);
          for (_ = n; t.getGlobalTaskIndex(_) !== d; ) this.select(_, e) && !r && (r = !0, a = _), _ = d > u ? t.getNext(_) : t.getPrev(_);
        }
      } else s = n;
    }).bind(this);
    return o && (e.ctrlKey || e.metaKey) ? (this.isSelected(n) || this.setFirstSelected(n), n && this.toggle(n, e)) : o && e.shiftKey ? (t.isTaskExists(this.getFirstSelected()) && this.getFirstSelected() !== null || this.setFirstSelected(n), i.length ? c() : l()) : l(), this.isSelected(n) ? this.setLastSelected(n) : a ? n == s && this.setLastSelected(e.shiftKey ? a : this.getDefaultSelected()) : this.setLastSelected(null), this.getSelected().length || this.setLastSelected(null), this.getLastSelected() && this.isSelected(this.getFirstSelected()) || this.setFirstSelected(this.getLastSelected()), !0;
  } }, function() {
    var e = t.selectTask;
    t.selectTask = function(i) {
      if (!(i = at(i, this.config.root_id))) return !1;
      var a = t._multiselect, r = i;
      return a.isActive() ? (a.select(i, null) && a.setLastSelected(i), a.setFirstSelected(a.getLastSelected())) : r = e.call(this, i), r;
    };
    var n = t.unselectTask;
    t.unselectTask = function(i) {
      var a = t._multiselect, r = a.isActive();
      (i = i || a.getLastSelected()) && r && (a.unselect(i, null), i == a.getLastSelected() && a.setLastSelected(null), t.refreshTask(i), a.setFirstSelected(a.getLastSelected()));
      var s = i;
      return r || (s = n.call(this, i)), s;
    }, t.toggleTaskSelection = function(i) {
      var a = t._multiselect;
      i && a.isActive() && (a.toggle(i), a.setFirstSelected(a.getLastSelected()));
    }, t.getSelectedTasks = function() {
      var i = t._multiselect;
      return i.isActive(), i.getSelected();
    }, t.eachSelectedTask = function(i) {
      return this._multiselect.forSelected(i);
    }, t.isSelectedTask = function(i) {
      return this._multiselect.isSelected(i);
    }, t.getLastSelectedTask = function() {
      return this._multiselect.getLastSelected();
    }, t.attachEvent("onGanttReady", function() {
      var i = t.$data.tasksStore.isSelected;
      t.$data.tasksStore.isSelected = function(a) {
        return t._multiselect.isActive() ? t._multiselect.isSelected(a) : i.call(this, a);
      };
    });
  }(), t.attachEvent("onTaskIdChange", function(e, n) {
    var i = t._multiselect;
    if (!i.isActive()) return !0;
    t.isSelectedTask(e) && (i.unselect(e, null), i.select(n, null));
  }), t.attachEvent("onAfterTaskDelete", function(e, n) {
    var i = t._multiselect;
    if (!i.isActive()) return !0;
    i._selected[e] && (i._selected[e] = !1, i.setLastSelected(i.getDefaultSelected())), i.forSelected(function(a) {
      t.isTaskExists(a) || i.unselect(a, null);
    });
  }), t.attachEvent("onBeforeTaskMultiSelect", function(e, n, i) {
    const a = t._multiselect;
    if (n && a.isActive()) {
      let r = t.getSelectedId(), s = null;
      r && (s = t.getTask(r));
      let o = t.getTask(e), l = !1;
      if (s && s.$level != o.$level && (l = !0), t.config.multiselect_one_level && l && !i.ctrlKey && !i.shiftKey) return !0;
      if (a._one_level) return a.isSameLevel(e);
    }
    return !0;
  }), t.attachEvent("onTaskClick", function(e, n) {
    return t._multiselect.doSelection(n) && t.callEvent("onMultiSelect", [n]), !0;
  });
}, export_api: function(t) {
  return t.ext = t.ext || {}, t.ext.export_api = t.ext.export_api || { _apiUrl: "https://export.dhtmlx.com/gantt", _preparePDFConfigRaw(e, n) {
    let i = null;
    e.start && e.end && (i = { start_date: t.config.start_date, end_date: t.config.end_date }, t.config.start_date = t.date.str_to_date(t.config.date_format)(e.start), t.config.end_date = t.date.str_to_date(t.config.date_format)(e.end)), e = t.mixin(e, { name: "gantt." + n, data: t.ext.export_api._serializeHtml() }), i && (t.config.start_date = i.start_date, t.config.end_date = i.end_date);
  }, _prepareConfigPDF: (e, n) => (e = t.mixin(e || {}, { name: "gantt." + n, data: t.ext.export_api._serializeAll(), config: t.config }), t.ext.export_api._fixColumns(e.config.columns), e), _pdfExportRouter(e, n) {
    e && e.raw ? t.ext.export_api._preparePDFConfigRaw(e, n) : e = t.ext.export_api._prepareConfigPDF(e, n), e.version = t.version, t.ext.export_api._sendToExport(e, n);
  }, exportToPDF(e) {
    t.ext.export_api._pdfExportRouter(e, "pdf");
  }, exportToPNG(e) {
    t.ext.export_api._pdfExportRouter(e, "png");
  }, exportToICal(e) {
    e = t.mixin(e || {}, { name: "gantt.ical", data: t.ext.export_api._serializePlain().data, version: t.version }), t.ext.export_api._sendToExport(e, "ical");
  }, exportToExcel(e) {
    let n, i, a, r;
    e = e || {};
    const s = t.config.smart_rendering;
    if (e.visual === "base-colors" && (t.config.smart_rendering = !1), e.start || e.end) {
      a = t.getState(), i = [t.config.start_date, t.config.end_date], r = t.getScrollState();
      const o = t.date.str_to_date(t.config.date_format);
      n = t.eachTask, e.start && (t.config.start_date = o(e.start)), e.end && (t.config.end_date = o(e.end)), t.render(), t.config.smart_rendering = s, t.eachTask = t.ext.export_api._eachTaskTimed(t.config.start_date, t.config.end_date);
    } else e.visual === "base-colors" && (t.render(), t.config.smart_rendering = s);
    t._no_progress_colors = e.visual === "base-colors", (e = t.mixin(e, { name: "gantt.xlsx", title: "Tasks", data: t.ext.export_api._serializeTimeline(e).data, columns: t.ext.export_api._serializeGrid({ rawDates: !0 }), version: t.version })).visual && (e.scales = t.ext.export_api._serializeScales(e)), t.ext.export_api._sendToExport(e, "excel"), (e.start || e.end) && (t.config.start_date = a.min_date, t.config.end_date = a.max_date, t.eachTask = n, t.render(), t.scrollTo(r.x, r.y), t.config.start_date = i[0], t.config.end_date = i[1]);
  }, exportToJSON(e) {
    e = t.mixin(e || {}, { name: "gantt.json", data: t.ext.export_api._serializeAll(), config: t.config, columns: t.ext.export_api._serializeGrid(), worktime: t.ext.export_api._getWorktimeSettings(), version: t.version }), t.ext.export_api._sendToExport(e, "json");
  }, importFromExcel(e) {
    try {
      const n = e.data;
      if (n instanceof File) {
        const i = new FormData();
        i.append("file", n), e.data = i;
      }
    } catch {
    }
    t.ext.export_api._sendImportAjaxExcel(e);
  }, importFromMSProject(e) {
    const n = e.data;
    try {
      if (n instanceof File) {
        const i = new FormData();
        i.append("file", n), e.data = i;
      }
    } catch {
    }
    t.ext.export_api._sendImportAjaxMSP(e);
  }, importFromPrimaveraP6: (e) => (e.type = "primaveraP6-parse", t.importFromMSProject(e)), exportToMSProject(e) {
    (e = e || {}).skip_circular_links = e.skip_circular_links === void 0 || !!e.skip_circular_links;
    const n = t.templates.xml_format, i = t.templates.format_date, a = t.config.xml_date, r = t.config.date_format, s = "%d-%m-%Y %H:%i:%s";
    t.config.xml_date = s, t.config.date_format = s, t.templates.xml_format = t.date.date_to_str(s), t.templates.format_date = t.date.date_to_str(s);
    const o = t.ext.export_api._serializeAll();
    t.ext.export_api._customProjectProperties(o, e), t.ext.export_api._customTaskProperties(o, e), e.skip_circular_links && t.ext.export_api._clearRecLinks(o), e = t.ext.export_api._exportConfig(o, e), t.ext.export_api._sendToExport(e, e.type || "msproject"), t.config.xml_date = a, t.config.date_format = r, t.templates.xml_format = n, t.templates.format_date = i, t.config.$custom_data = null, t.config.custom = null;
  }, exportToPrimaveraP6: (e) => ((e = e || {}).type = "primaveraP6", t.exportToMSProject(e)), _fixColumns(e) {
    for (let n = 0; n < e.length; n++) e[n].label = e[n].label || t.locale.labels["column_" + e[n].name], typeof e[n].width == "string" && (e[n].width = 1 * e[n].width);
  }, _xdr(e, n, i) {
    t.ajax.post(e, n, i);
  }, _markColumns(e) {
    const n = e.config.columns;
    if (n) for (let i = 0; i < n.length; i++) n[i].template && (n[i].$template = !0);
  }, _sendImportAjaxExcel(e) {
    const n = e.server || t.ext.export_api._apiUrl, i = e.store || 0, a = e.data, r = e.callback;
    a.append("type", "excel-parse"), a.append("data", JSON.stringify({ sheet: e.sheet || 0 })), i && a.append("store", i);
    const s = new XMLHttpRequest();
    s.onreadystatechange = function(o) {
      s.readyState === 4 && s.status === 0 && r && r(null);
    }, s.onload = function() {
      let o = null;
      if (!(s.status > 400)) try {
        o = JSON.parse(s.responseText);
      } catch {
      }
      r && r(o);
    }, s.open("POST", n, !0), s.setRequestHeader("X-Requested-With", "XMLHttpRequest"), s.send(a);
  }, _ajaxToExport(e, n, i) {
    delete e.callback;
    const a = e.server || t.ext.export_api._apiUrl, r = "type=" + n + "&store=1&data=" + encodeURIComponent(JSON.stringify(e));
    t.ext.export_api._xdr(a, r, function(s) {
      const o = s.xmlDoc || s;
      let l = null;
      if (!(o.status > 400)) try {
        l = JSON.parse(o.responseText);
      } catch {
      }
      i(l);
    });
  }, _serializableGanttConfig(e) {
    const n = t.mixin({}, e);
    return n.columns && (n.columns = n.columns.map(function(i) {
      const a = t.mixin({}, i);
      return delete a.editor, a;
    })), delete n.editor_types, n;
  }, _sendToExport(e, n) {
    const i = t.date.date_to_str(t.config.date_format || t.config.xml_date);
    if (e.skin || (e.skin = t.skin), e.config && (e.config = t.copy(t.ext.export_api._serializableGanttConfig(e.config)), t.ext.export_api._markColumns(e, n), e.config.start_date && e.config.end_date && (e.config.start_date instanceof Date && (e.config.start_date = i(e.config.start_date)), e.config.end_date instanceof Date && (e.config.end_date = i(e.config.end_date)))), e.callback) return t.ext.export_api._ajaxToExport(e, n, e.callback);
    const a = t.ext.export_api._createHiddenForm();
    a.firstChild.action = e.server || t.ext.export_api._apiUrl, a.firstChild.childNodes[0].value = JSON.stringify(e), a.firstChild.childNodes[1].value = n, a.firstChild.submit();
  }, _createHiddenForm() {
    if (!t.ext.export_api._hidden_export_form) {
      const e = t.ext.export_api._hidden_export_form = document.createElement("div");
      e.style.display = "none", e.innerHTML = "<form method='POST' target='_blank'><textarea name='data' style='width:0px; height:0px;' readonly='true'></textarea><input type='hidden' name='type' value=''></form>", document.body.appendChild(e);
    }
    return t.ext.export_api._hidden_export_form;
  }, _copyObjectBase(e) {
    const n = { start_date: void 0, end_date: void 0, constraint_date: void 0, deadline: void 0 };
    for (const a in e) a.charAt(0) !== "$" && a !== "baselines" && (n[a] = e[a]);
    const i = t.templates.xml_format || t.templates.format_date;
    return n.start_date = i(n.start_date), n.end_date && (n.end_date = i(n.end_date)), n.constraint_date && (n.constraint_date = i(n.constraint_date)), n.deadline && (n.deadline = i(n.deadline)), n;
  }, _color_box: null, _color_hash: {}, _getStyles(e) {
    if (t.ext.export_api._color_box || (t.ext.export_api._color_box = document.createElement("DIV"), t.ext.export_api._color_box.style.cssText = "position:absolute; display:none;", document.body.appendChild(t.ext.export_api._color_box)), t.ext.export_api._color_hash[e]) return t.ext.export_api._color_hash[e];
    t.ext.export_api._color_box.className = e;
    const n = t.ext.export_api._getColor(t.ext.export_api._color_box, "color"), i = t.ext.export_api._getColor(t.ext.export_api._color_box, "backgroundColor");
    return t.ext.export_api._color_hash[e] = n + ";" + i;
  }, _getMinutesWorktimeSettings(e) {
    const n = [];
    return e.forEach(function(i) {
      n.push(i.startMinute), n.push(i.endMinute);
    }), n;
  }, _getWorktimeSettings() {
    const e = { hours: [0, 24], minutes: null, dates: { 0: !0, 1: !0, 2: !0, 3: !0, 4: !0, 5: !0, 6: !0 } };
    let n;
    if (t.config.work_time) {
      const i = t._working_time_helper;
      if (i && i.get_calendar) n = i.get_calendar();
      else if (i) n = { hours: i.hours, minutes: null, dates: i.dates };
      else if (t.config.worktimes && t.config.worktimes.global) {
        const a = t.config.worktimes.global;
        if (a.parsed) {
          n = { hours: null, minutes: t.ext.export_api._getMinutesWorktimeSettings(a.parsed.hours), dates: {} };
          for (const r in a.parsed.dates) Array.isArray(a.parsed.dates[r]) ? n.dates[r] = t.ext.export_api._getMinutesWorktimeSettings(a.parsed.dates[r]) : n.dates[r] = a.parsed.dates[r];
        } else n = { hours: a.hours, minutes: null, dates: a.dates };
      } else n = e;
    } else n = e;
    return n;
  }, _eachTaskTimed: (e, n) => function(i, a, r) {
    a = a || t.config.root_id, r = r || t;
    const s = t.getChildren(a);
    if (s) for (let o = 0; o < s.length; o++) {
      const l = t._pull[s[o]];
      (!e || l.end_date > e) && (!n || l.start_date < n) && i.call(r, l), t.hasChild(l.id) && t.eachTask(i, l.id, r);
    }
  }, _originalCopyObject: t.json._copyObject, _copyObjectPlain(e) {
    const n = t.templates.task_text(e.start_date, e.end_date, e), i = t.ext.export_api._copyObjectBase(e);
    return i.text = n || i.text, i;
  }, _getColor(e, n) {
    const i = e.currentStyle ? e.currentStyle[n] : getComputedStyle(e, null)[n], a = i.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (a && a.length === 4 ? ("0" + parseInt(a[1], 10).toString(16)).slice(-2) + ("0" + parseInt(a[2], 10).toString(16)).slice(-2) + ("0" + parseInt(a[3], 10).toString(16)).slice(-2) : i).replace("#", "");
  }, _copyObjectTable(e) {
    const n = t.date.date_to_str("%Y-%m-%dT%H:%i:%s.000Z"), i = t.ext.export_api._copyObjectColumns(e, t.ext.export_api._copyObjectPlain(e));
    i.start_date && (i.start_date = n(e.start_date)), i.end_date && (i.end_date = n(e.end_date));
    const a = t._day_index_by_date ? t._day_index_by_date : t.columnIndexByDate;
    i.$start = a.call(t, e.start_date), i.$end = a.call(t, e.end_date);
    let r = 0;
    const s = t.getScale().width;
    if (s.indexOf(0) > -1) {
      let l = 0;
      for (; l < i.$start; l++) s[l] || r++;
      for (i.$start -= r; l < i.$end; l++) s[l] || r++;
      i.$end -= r;
    }
    i.$level = e.$level, i.$type = e.$rendered_type;
    const o = t.templates;
    return i.$text = o.task_text(e.start, e.end_date, e), i.$left = o.leftside_text ? o.leftside_text(e.start, e.end_date, e) : "", i.$right = o.rightside_text ? o.rightside_text(e.start, e.end_date, e) : "", i;
  }, _copyObjectColors(e) {
    const n = t.ext.export_api._copyObjectTable(e), i = t.getTaskNode(e.id);
    if (i && i.firstChild) {
      let a = t.ext.export_api._getColor(t._no_progress_colors ? i : i.firstChild, "backgroundColor");
      a === "363636" && (a = t.ext.export_api._getColor(i, "backgroundColor")), n.$color = a;
    } else e.color && (n.$color = e.color);
    return n;
  }, _copyObjectColumns(e, n) {
    for (let i = 0; i < t.config.columns.length; i++) {
      const a = t.config.columns[i].template;
      if (a) {
        let r = a(e);
        r instanceof Date && (r = t.templates.date_grid(r, e)), n["_" + i] = r;
      }
    }
    return n;
  }, _copyObjectAll(e) {
    const n = t.ext.export_api._copyObjectBase(e), i = ["leftside_text", "rightside_text", "task_text", "progress_text", "task_class"];
    for (let a = 0; a < i.length; a++) {
      const r = t.templates[i[a]];
      r && (n["$" + a] = r(e.start_date, e.end_date, e));
    }
    return t.ext.export_api._copyObjectColumns(e, n), n.open = e.$open, n;
  }, _serializeHtml() {
    const e = t.config.smart_scales, n = t.config.smart_rendering;
    (e || n) && (t.config.smart_rendering = !1, t.config.smart_scales = !1, t.render());
    const i = t.$container.parentNode.innerHTML;
    return (e || n) && (t.config.smart_scales = e, t.config.smart_rendering = n, t.render()), i;
  }, _serializeAll() {
    t.json._copyObject = t.ext.export_api._copyObjectAll;
    const e = t.ext.export_api._exportSerialize();
    return t.json._copyObject = t.ext.export_api._originalCopyObject, e;
  }, _serializePlain() {
    const e = t.templates.xml_format, n = t.templates.format_date;
    t.templates.xml_format = t.date.date_to_str("%Y%m%dT%H%i%s", !0), t.templates.format_date = t.date.date_to_str("%Y%m%dT%H%i%s", !0), t.json._copyObject = t.ext.export_api._copyObjectPlain;
    const i = t.ext.export_api._exportSerialize();
    return t.templates.xml_format = e, t.templates.format_date = n, t.json._copyObject = t.ext.export_api._originalCopyObject, delete i.links, i;
  }, _getRaw() {
    if (t._scale_helpers) {
      const e = t._get_scales(), n = t.config.min_column_width, i = t._get_resize_options().x ? Math.max(t.config.autosize_min_width, 0) : t.config.$task.offsetWidth, a = t.config.config.scale_height - 1;
      return t._scale_helpers.prepareConfigs(e, n, i, a);
    }
    {
      const e = t.$ui.getView("timeline");
      if (e) {
        let n = e.$config.width;
        t.config.autosize !== "x" && t.config.autosize !== "xy" || (n = Math.max(t.config.autosize_min_width, 0));
        const i = t.getState(), a = e._getScales(), r = t.config.min_column_width, s = t.config.scale_height - 1, o = t.config.rtl;
        return e.$scaleHelper.prepareConfigs(a, r, n, s, i.min_date, i.max_date, o);
      }
    }
  }, _serializeTimeline(e) {
    t.json._copyObject = e.visual ? t.ext.export_api._copyObjectColors : t.ext.export_api._copyObjectTable;
    const n = t.ext.export_api._exportSerialize();
    if (t.json._copyObject = t.ext.export_api._originalCopyObject, delete n.links, e.cellColors) {
      const i = t.templates.timeline_cell_class || t.templates.task_cell_class;
      if (i) {
        const a = t.ext.export_api._getRaw();
        let r = a[0].trace_x;
        for (let s = 1; s < a.length; s++) a[s].trace_x.length > r.length && (r = a[s].trace_x);
        for (let s = 0; s < n.data.length; s++) {
          n.data[s].styles = [];
          const o = t.getTask(n.data[s].id);
          for (let l = 0; l < r.length; l++) {
            const c = i(o, r[l]);
            c && n.data[s].styles.push({ index: l, styles: t.ext.export_api._getStyles(c) });
          }
        }
      }
    }
    return n;
  }, _serializeScales(e) {
    const n = [], i = t.ext.export_api._getRaw();
    let a = 1 / 0, r = 0;
    for (let s = 0; s < i.length; s++) a = Math.min(a, i[s].col_width);
    for (let s = 0; s < i.length; s++) {
      let o = 0, l = 0;
      const c = [];
      n.push(c);
      const d = i[s];
      r = Math.max(r, d.trace_x.length);
      const u = d.format || d.template || (d.date ? t.date.date_to_str(d.date) : t.config.date_scale);
      for (let h = 0; h < d.trace_x.length; h++) {
        const _ = d.trace_x[h];
        l = o + Math.round(d.width[h] / a);
        const p = { text: u(_), start: o, end: l, styles: "" };
        if (e.cellColors) {
          const y = d.css || t.templates.scaleCell_class;
          if (y) {
            const k = y(_);
            k && (p.styles = t.ext.export_api._getStyles(k));
          }
        }
        c.push(p), o = l;
      }
    }
    return { width: r, height: n.length, data: n };
  }, _serializeGrid(e) {
    t.exportMode = !0;
    const n = [], i = t.config.columns;
    let a = 0;
    for (let r = 0; r < i.length; r++) i[r].name !== "add" && i[r].name !== "buttons" && (n[a] = { id: i[r].template ? "_" + r : i[r].name, header: i[r].label || t.locale.labels["column_" + i[r].name], width: i[r].width ? Math.floor(i[r].width / 4) : "", tree: i[r].tree || !1 }, i[r].name === "duration" && (n[a].type = "number"), i[r].name !== "start_date" && i[r].name !== "end_date" || (n[a].type = "date", e && e.rawDates && (n[a].id = i[r].name)), a++);
    return t.exportMode = !1, n;
  }, _exportSerialize() {
    t.exportMode = !0;
    const e = t.templates.xml_format, n = t.templates.format_date;
    t.templates.xml_format = t.templates.format_date = t.date.date_to_str(t.config.date_format || t.config.xml_date);
    const i = t.serialize();
    return t.templates.xml_format = e, t.templates.format_date = n, t.exportMode = !1, i;
  }, _setLevel(e) {
    for (let n = 0; n < e.length; n++) {
      e[n].parent == 0 && (e[n]._lvl = 1);
      for (let i = n + 1; i < e.length; i++) e[n].id == e[i].parent && (e[i]._lvl = e[n]._lvl + 1);
    }
  }, _clearLevel(e) {
    for (let n = 0; n < e.length; n++) delete e[n]._lvl;
  }, _clearRecLinks(e) {
    t.ext.export_api._setLevel(e.data);
    const n = {};
    for (let r = 0; r < e.data.length; r++) n[e.data[r].id] = e.data[r];
    const i = {};
    for (let r = 0; r < e.links.length; r++) {
      const s = e.links[r];
      t.isTaskExists(s.source) && t.isTaskExists(s.target) && n[s.source] && n[s.target] && (i[s.id] = s);
    }
    for (const r in i) t.ext.export_api._makeLinksSameLevel(i[r], n);
    const a = {};
    for (const r in n) t.ext.export_api._clearCircDependencies(n[r], i, n, {}, a, null);
    Object.keys(i) && t.ext.export_api._clearLinksSameLevel(i, n);
    for (let r = 0; r < e.links.length; r++) i[e.links[r].id] || (e.links.splice(r, 1), r--);
    t.ext.export_api._clearLevel(e.data);
  }, _clearCircDependencies(e, n, i, a, r, s) {
    const o = e.$_source;
    if (!o) return;
    a[e.id] && t.ext.export_api._onCircDependencyFind(s, n, a, r), a[e.id] = !0;
    const l = {};
    for (let c = 0; c < o.length; c++) {
      if (r[o[c]]) continue;
      const d = n[o[c]], u = i[d._target];
      l[u.id] && t.ext.export_api._onCircDependencyFind(d, n, a, r), l[u.id] = !0, t.ext.export_api._clearCircDependencies(u, n, i, a, r, d);
    }
    a[e.id] = !1;
  }, _onCircDependencyFind(e, n, i, a) {
    e && (t.callEvent("onExportCircularDependency", [e.id, e]) && delete n[e.id], delete i[e._source], delete i[e._target], a[e.id] = !0);
  }, _makeLinksSameLevel(e, n) {
    let i, a;
    const r = { target: n[e.target], source: n[e.source] };
    if (r.target._lvl != r.source._lvl) {
      r.target._lvl < r.source._lvl ? (i = "source", a = r.target._lvl) : (i = "target", a = r.source._lvl);
      do {
        const l = n[r[i].parent];
        if (!l) break;
        r[i] = l;
      } while (r[i]._lvl < a);
      let s = n[r.source.parent], o = n[r.target.parent];
      for (; s && o && s.id != o.id; ) r.source = s, r.target = o, s = n[r.source.parent], o = n[r.target.parent];
    }
    e._target = r.target.id, e._source = r.source.id, r.target.$_target || (r.target.$_target = []), r.target.$_target.push(e.id), r.source.$_source || (r.source.$_source = []), r.source.$_source.push(e.id);
  }, _clearLinksSameLevel(e, n) {
    for (const i in e) delete e[i]._target, delete e[i]._source;
    for (const i in n) delete n[i].$_source, delete n[i].$_target;
  }, _customProjectProperties(e, n) {
    if (n && n.project) {
      for (const i in n.project) t.config.$custom_data || (t.config.$custom_data = {}), t.config.$custom_data[i] = typeof n.project[i] == "function" ? n.project[i](t.config) : n.project[i];
      delete n.project;
    }
  }, _customTaskProperties(e, n) {
    n && n.tasks && (e.data.forEach(function(i) {
      for (const a in n.tasks) i.$custom_data || (i.$custom_data = {}), i.$custom_data[a] = typeof n.tasks[a] == "function" ? n.tasks[a](i, t.config) : n.tasks[a];
    }), delete n.tasks);
  }, _exportConfig(e, n) {
    const i = n.name || "gantt.xml";
    delete n.name, t.config.custom = n;
    const a = t.ext.export_api._getWorktimeSettings(), r = t.getSubtaskDates();
    if (r.start_date && r.end_date) {
      const l = t.templates.format_date || t.templates.xml_format;
      t.config.start_end = { start_date: l(r.start_date), end_date: l(r.end_date) };
    }
    const s = n.auto_scheduling !== void 0 && !!n.auto_scheduling, o = { callback: n.callback || null, config: t.config, data: e, manual: s, name: i, worktime: a };
    for (const l in n) o[l] = n[l];
    return o;
  }, _sendImportAjaxMSP(e) {
    const n = e.server || t.ext.export_api._apiUrl, i = e.store || 0, a = e.data, r = e.callback, s = { durationUnit: e.durationUnit || void 0, projectProperties: e.projectProperties || void 0, taskProperties: e.taskProperties || void 0 };
    a.append("type", e.type || "msproject-parse"), a.append("data", JSON.stringify(s)), i && a.append("store", i);
    const o = new XMLHttpRequest();
    o.onreadystatechange = function(l) {
      o.readyState === 4 && o.status === 0 && r && r(null);
    }, o.onload = function() {
      let l = null;
      if (!(o.status > 400)) try {
        l = JSON.parse(o.responseText);
      } catch {
      }
      r && r(l);
    }, o.open("POST", n, !0), o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.send(a);
  } }, t.exportToPDF = t.ext.export_api.exportToPDF, t.exportToPNG = t.ext.export_api.exportToPNG, t.exportToICal = t.ext.export_api.exportToICal, t.exportToExcel = t.ext.export_api.exportToExcel, t.exportToJSON = t.ext.export_api.exportToJSON, t.importFromExcel = t.ext.export_api.importFromExcel, t.importFromMSProject = t.ext.export_api.importFromMSProject, t.exportToMSProject = t.ext.export_api.exportToMSProject, t.importFromPrimaveraP6 = t.ext.export_api.importFromPrimaveraP6, t.exportToPrimaveraP6 = t.ext.export_api.exportToPrimaveraP6, t.ext.export_api;
} }, Un = { KEY_CODES: { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, SPACE: 32, ENTER: 13, DELETE: 46, ESC: 27, TAB: 9 } };
class qn {
  constructor(e) {
    this.addExtension = (n, i) => {
      this._extensions[n] = i;
    }, this.getExtension = (n) => this._extensions[n], this._extensions = {};
    for (const n in e) this._extensions[n] = e[n];
  }
}
var ut = typeof window < "u";
const mt = { isIE: ut && (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0), isOpera: ut && (navigator.userAgent.indexOf("Opera") >= 0 || navigator.userAgent.indexOf("OPR") >= 0), isChrome: ut && navigator.userAgent.indexOf("Chrome") >= 0, isSafari: ut && (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0), isFF: ut && navigator.userAgent.indexOf("Firefox") >= 0, isIPad: ut && navigator.userAgent.search(/iPad/gi) >= 0, isEdge: ut && navigator.userAgent.indexOf("Edge") != -1, isNode: !ut || typeof navigator > "u" || !1, isSalesforce: ut && (!!Z.Sfdc || !!Z.$A || Z.Aura) };
function Ne(t) {
  if (typeof t == "string" || typeof t == "number") return t;
  let e = "";
  for (const n in t) {
    let i = "";
    t.hasOwnProperty(n) && (i = typeof t[n] == "string" ? encodeURIComponent(t[n]) : typeof t[n] == "number" ? String(t[n]) : encodeURIComponent(JSON.stringify(t[n])), i = n + "=" + i, e.length && (i = "&" + i), e += i);
  }
  return e;
}
function xt(t, e) {
  var n = { method: t };
  if (e.length === 0) throw new Error("Arguments list of query is wrong.");
  if (e.length === 1) return typeof e[0] == "string" ? (n.url = e[0], n.async = !0) : (n.url = e[0].url, n.async = e[0].async || !0, n.callback = e[0].callback, n.headers = e[0].headers), e[0].data ? typeof e[0].data != "string" ? n.data = Ne(e[0].data) : n.data = e[0].data : n.data = "", n;
  switch (n.url = e[0], t) {
    case "GET":
    case "DELETE":
      n.callback = e[1], n.headers = e[2];
      break;
    case "POST":
    case "PUT":
      e[1] ? typeof e[1] != "string" ? n.data = Ne(e[1]) : n.data = e[1] : n.data = "", n.callback = e[2], n.headers = e[3];
  }
  return n;
}
const Le = { date_to_str: (t, e, n) => {
  t = t.replace(/%[a-zA-Z]/g, (a) => {
    switch (a) {
      case "%d":
        return `"+to_fixed(date.get${e ? "UTC" : ""}Date())+"`;
      case "%m":
        return `"+to_fixed((date.get${e ? "UTC" : ""}Month()+1))+"`;
      case "%j":
        return `"+date.get${e ? "UTC" : ""}Date()+"`;
      case "%n":
        return `"+(date.get${e ? "UTC" : ""}Month()+1)+"`;
      case "%y":
        return `"+to_fixed(date.get${e ? "UTC" : ""}FullYear()%100)+"`;
      case "%Y":
        return `"+date.get${e ? "UTC" : ""}FullYear()+"`;
      case "%D":
        return `"+locale.date.day_short[date.get${e ? "UTC" : ""}Day()]+"`;
      case "%l":
        return `"+locale.date.day_full[date.get${e ? "UTC" : ""}Day()]+"`;
      case "%M":
        return `"+locale.date.month_short[date.get${e ? "UTC" : ""}Month()]+"`;
      case "%F":
        return `"+locale.date.month_full[date.get${e ? "UTC" : ""}Month()]+"`;
      case "%h":
        return `"+to_fixed((date.get${e ? "UTC" : ""}Hours()+11)%12+1)+"`;
      case "%g":
        return `"+((date.get${e ? "UTC" : ""}Hours()+11)%12+1)+"`;
      case "%G":
        return `"+date.get${e ? "UTC" : ""}Hours()+"`;
      case "%H":
        return `"+to_fixed(date.get${e ? "UTC" : ""}Hours())+"`;
      case "%i":
        return `"+to_fixed(date.get${e ? "UTC" : ""}Minutes())+"`;
      case "%a":
        return `"+(date.get${e ? "UTC" : ""}Hours()>11?"pm":"am")+"`;
      case "%A":
        return `"+(date.get${e ? "UTC" : ""}Hours()>11?"PM":"AM")+"`;
      case "%s":
        return `"+to_fixed(date.get${e ? "UTC" : ""}Seconds())+"`;
      case "%W":
        return '"+to_fixed(getISOWeek(date))+"';
      case "%w":
        return '"+to_fixed(getWeek(date))+"';
      default:
        return a;
    }
  });
  const i = new Function("date", "to_fixed", "locale", "getISOWeek", "getWeek", `return "${t}";`);
  return (a) => i(a, n.date.to_fixed, n.locale, n.date.getISOWeek, n.date.getWeek);
}, str_to_date: (t, e, n) => {
  let i = "var temp=date.match(/[a-zA-Z]+|[0-9]+/g);";
  const a = t.match(/%[a-zA-Z]/g);
  for (let o = 0; o < a.length; o++) switch (a[o]) {
    case "%j":
    case "%d":
      i += `set[2]=temp[${o}]||1;`;
      break;
    case "%n":
    case "%m":
      i += `set[1]=(temp[${o}]||1)-1;`;
      break;
    case "%y":
      i += `set[0]=temp[${o}]*1+(temp[${o}]>50?1900:2000);`;
      break;
    case "%g":
    case "%G":
    case "%h":
    case "%H":
      i += `set[3]=temp[${o}]||0;`;
      break;
    case "%i":
      i += `set[4]=temp[${o}]||0;`;
      break;
    case "%Y":
      i += `set[0]=temp[${o}]||0;`;
      break;
    case "%a":
    case "%A":
      i += `set[3]=set[3]%12+((temp[${o}]||'').toLowerCase()=='am'?0:12);`;
      break;
    case "%s":
      i += `set[5]=temp[${o}]||0;`;
      break;
    case "%M":
      i += `set[1]=locale.date.month_short_hash[temp[${o}]]||0;`;
      break;
    case "%F":
      i += `set[1]=locale.date.month_full_hash[temp[${o}]]||0;`;
  }
  let r = "set[0],set[1],set[2],set[3],set[4],set[5]";
  e && (r = ` Date.UTC(${r})`);
  const s = new Function("date", "locale", `var set=[0,0,1,0,0,0]; ${i} return new Date(${r});`);
  return (o) => s(o, n.locale);
} }, Pe = { date_to_str: (t, e, n) => (i) => t.replace(/%[a-zA-Z]/g, (a) => {
  switch (a) {
    case "%d":
      return e ? n.date.to_fixed(i.getUTCDate()) : n.date.to_fixed(i.getDate());
    case "%m":
      return e ? n.date.to_fixed(i.getUTCMonth() + 1) : n.date.to_fixed(i.getMonth() + 1);
    case "%j":
      return e ? i.getUTCDate() : i.getDate();
    case "%n":
      return e ? i.getUTCMonth() + 1 : i.getMonth() + 1;
    case "%y":
      return e ? n.date.to_fixed(i.getUTCFullYear() % 100) : n.date.to_fixed(i.getFullYear() % 100);
    case "%Y":
      return e ? i.getUTCFullYear() : i.getFullYear();
    case "%D":
      return e ? n.locale.date.day_short[i.getUTCDay()] : n.locale.date.day_short[i.getDay()];
    case "%l":
      return e ? n.locale.date.day_full[i.getUTCDay()] : n.locale.date.day_full[i.getDay()];
    case "%M":
      return e ? n.locale.date.month_short[i.getUTCMonth()] : n.locale.date.month_short[i.getMonth()];
    case "%F":
      return e ? n.locale.date.month_full[i.getUTCMonth()] : n.locale.date.month_full[i.getMonth()];
    case "%h":
      return e ? n.date.to_fixed((i.getUTCHours() + 11) % 12 + 1) : n.date.to_fixed((i.getHours() + 11) % 12 + 1);
    case "%g":
      return e ? (i.getUTCHours() + 11) % 12 + 1 : (i.getHours() + 11) % 12 + 1;
    case "%G":
      return e ? i.getUTCHours() : i.getHours();
    case "%H":
      return e ? n.date.to_fixed(i.getUTCHours()) : n.date.to_fixed(i.getHours());
    case "%i":
      return e ? n.date.to_fixed(i.getUTCMinutes()) : n.date.to_fixed(i.getMinutes());
    case "%a":
      return e ? i.getUTCHours() > 11 ? "pm" : "am" : i.getHours() > 11 ? "pm" : "am";
    case "%A":
      return e ? i.getUTCHours() > 11 ? "PM" : "AM" : i.getHours() > 11 ? "PM" : "AM";
    case "%s":
      return e ? n.date.to_fixed(i.getUTCSeconds()) : n.date.to_fixed(i.getSeconds());
    case "%W":
      return e ? n.date.to_fixed(n.date.getUTCISOWeek(i)) : n.date.to_fixed(n.date.getISOWeek(i));
    default:
      return a;
  }
}), str_to_date: (t, e, n) => (i) => {
  const a = [0, 0, 1, 0, 0, 0], r = i.match(/[a-zA-Z]+|[0-9]+/g), s = t.match(/%[a-zA-Z]/g);
  for (let o = 0; o < s.length; o++) switch (s[o]) {
    case "%j":
    case "%d":
      a[2] = r[o] || 1;
      break;
    case "%n":
    case "%m":
      a[1] = (r[o] || 1) - 1;
      break;
    case "%y":
      a[0] = 1 * r[o] + (r[o] > 50 ? 1900 : 2e3);
      break;
    case "%g":
    case "%G":
    case "%h":
    case "%H":
      a[3] = r[o] || 0;
      break;
    case "%i":
      a[4] = r[o] || 0;
      break;
    case "%Y":
      a[0] = r[o] || 0;
      break;
    case "%a":
    case "%A":
      a[3] = a[3] % 12 + ((r[o] || "").toLowerCase() === "am" ? 0 : 12);
      break;
    case "%s":
      a[5] = r[o] || 0;
      break;
    case "%M":
      a[1] = n.locale.date.month_short_hash[r[o]] || 0;
      break;
    case "%F":
      a[1] = n.locale.date.month_full_hash[r[o]] || 0;
  }
  return e ? new Date(Date.UTC(a[0], a[1], a[2], a[3], a[4], a[5])) : new Date(a[0], a[1], a[2], a[3], a[4], a[5]);
} };
function Gn(t) {
  var e = null;
  function n() {
    var a = !1;
    return t.config.csp === "auto" ? (e === null && function() {
      try {
        new Function("canUseCsp = false;");
      } catch {
        e = !0;
      }
    }(), a = e) : a = t.config.csp, a;
  }
  var i = { init: function() {
    for (var a = t.locale, r = a.date.month_short, s = a.date.month_short_hash = {}, o = 0; o < r.length; o++) s[r[o]] = o;
    for (r = a.date.month_full, s = a.date.month_full_hash = {}, o = 0; o < r.length; o++) s[r[o]] = o;
  }, date_part: function(a) {
    var r = new Date(a);
    return a.setHours(0), this.hour_start(a), a.getHours() && (a.getDate() < r.getDate() || a.getMonth() < r.getMonth() || a.getFullYear() < r.getFullYear()) && a.setTime(a.getTime() + 36e5 * (24 - a.getHours())), a;
  }, time_part: function(a) {
    return (a.valueOf() / 1e3 - 60 * a.getTimezoneOffset()) % 86400;
  }, week_start: function(a) {
    var r = a.getDay();
    return t.config.start_on_monday && (r === 0 ? r = 6 : r--), this.date_part(this.add(a, -1 * r, "day"));
  }, month_start: function(a) {
    return a.setDate(1), this.date_part(a);
  }, quarter_start: function(a) {
    this.month_start(a);
    var r, s = a.getMonth();
    return r = s >= 9 ? 9 : s >= 6 ? 6 : s >= 3 ? 3 : 0, a.setMonth(r), a;
  }, year_start: function(a) {
    return a.setMonth(0), this.month_start(a);
  }, day_start: function(a) {
    return this.date_part(a);
  }, hour_start: function(a) {
    return a.getMinutes() && a.setMinutes(0), this.minute_start(a), a;
  }, minute_start: function(a) {
    return a.getSeconds() && a.setSeconds(0), a.getMilliseconds() && a.setMilliseconds(0), a;
  }, _add_days: function(a, r, s) {
    a.setDate(a.getDate() + r);
    var o = r >= 0, l = !s.getHours() && a.getHours(), c = a.getDate() <= s.getDate() || a.getMonth() < s.getMonth() || a.getFullYear() < s.getFullYear();
    return o && l && c && a.setTime(a.getTime() + 36e5 * (24 - a.getHours())), r > 1 && l && a.setHours(0), a;
  }, add: function(a, r, s) {
    var o = new Date(a.valueOf());
    switch (s) {
      case "day":
        o = this._add_days(o, r, a);
        break;
      case "week":
        o = this._add_days(o, 7 * r, a);
        break;
      case "month":
        o.setMonth(o.getMonth() + r);
        break;
      case "year":
        o.setYear(o.getFullYear() + r);
        break;
      case "hour":
        o.setTime(o.getTime() + 60 * r * 60 * 1e3);
        break;
      case "minute":
        o.setTime(o.getTime() + 60 * r * 1e3);
        break;
      default:
        return this["add_" + s](a, r, s);
    }
    return o;
  }, add_quarter: function(a, r) {
    return this.add(a, 3 * r, "month");
  }, to_fixed: function(a) {
    return a < 10 ? "0" + a : a;
  }, copy: function(a) {
    return new Date(a.valueOf());
  }, date_to_str: function(a, r) {
    var s = Le;
    return n() && (s = Pe), s.date_to_str(a, r, t);
  }, str_to_date: function(a, r) {
    var s = Le;
    return n() && (s = Pe), s.str_to_date(a, r, t);
  }, getISOWeek: function(a) {
    return t.date._getWeekNumber(a, !0);
  }, _getWeekNumber: function(a, r) {
    if (!a) return !1;
    var s = a.getDay();
    r && s === 0 && (s = 7);
    var o = new Date(a.valueOf());
    o.setDate(a.getDate() + (4 - s));
    var l = o.getFullYear(), c = Math.round((o.getTime() - new Date(l, 0, 1).getTime()) / 864e5);
    return 1 + Math.floor(c / 7);
  }, getWeek: function(a) {
    return t.date._getWeekNumber(a, t.config.start_on_monday);
  }, getUTCISOWeek: function(a) {
    return t.date.getISOWeek(a);
  }, convert_to_utc: function(a) {
    return new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds());
  }, parseDate: function(a, r) {
    return a && !a.getFullYear && (typeof r != "function" && (r = typeof r == "string" ? r === "parse_date" || r === "xml_date" ? t.defined(t.templates.xml_date) ? t.templates.xml_date : t.templates.parse_date : t.defined(t.templates[r]) ? t.templates[r] : t.date.str_to_date(r) : t.defined(t.templates.xml_date) ? t.templates.xml_date : t.templates.parse_date), a = a ? r(a) : null), a;
  } };
  return i;
}
class Yn {
  constructor(e) {
    const { url: n, token: i } = e;
    this._url = n, this._token = i, this._mode = 1, this._seed = 1, this._queue = [], this.data = {}, this.api = {}, this._events = {};
  }
  headers() {
    return { Accept: "application/json", "Content-Type": "application/json", "Remote-Token": this._token };
  }
  fetch(e, n) {
    const i = { credentials: "include", headers: this.headers() };
    return n && (i.method = "POST", i.body = n), fetch(e, i).then((a) => a.json());
  }
  load(e) {
    return e && (this._url = e), this.fetch(this._url).then((n) => this.parse(n));
  }
  parse(e) {
    const { key: n, websocket: i } = e;
    n && (this._token = e.key);
    for (const a in e.data) this.data[a] = e.data[a];
    for (const a in e.api) {
      const r = this.api[a] = {}, s = e.api[a];
      for (const o in s) r[o] = this._wrapper(a + "." + o);
    }
    return i && this.connect(), this;
  }
  connect() {
    const e = this._socket;
    e && (this._socket = null, e.onclose = function() {
    }, e.close()), this._mode = 2, this._socket = function(n, i, a, r) {
      let s = i;
      s[0] === "/" && (s = document.location.protocol + "//" + document.location.host + i), s = s.replace(/^http(s|):/, "ws$1:");
      const o = s.indexOf("?") != -1 ? "&" : "?";
      s = `${s}${o}token=${a}&ws=1`;
      const l = new WebSocket(s);
      return l.onclose = () => setTimeout(() => n.connect(), 2e3), l.onmessage = (c) => {
        const d = JSON.parse(c.data);
        switch (d.action) {
          case "result":
            n.result(d.body, []);
            break;
          case "event":
            n.fire(d.body.name, d.body.value);
            break;
          case "start":
            r();
            break;
          default:
            n.onError(d.data);
        }
      }, l;
    }(this, this._url, this._token, () => (this._mode = 3, this._send(), this._resubscribe(), this));
  }
  _wrapper(e) {
    return (function() {
      const n = [].slice.call(arguments);
      let i = null;
      const a = new Promise((r, s) => {
        i = { data: { id: this._uid(), name: e, args: n }, status: 1, resolve: r, reject: s }, this._queue.push(i);
      });
      return this.onCall(i, a), this._mode === 3 ? this._send(i) : setTimeout(() => this._send(), 1), a;
    }).bind(this);
  }
  _uid() {
    return (this._seed++).toString();
  }
  _send(e) {
    if (this._mode == 2) return void setTimeout(() => this._send(), 100);
    const n = e ? [e] : this._queue.filter((a) => a.status === 1);
    if (!n.length) return;
    const i = n.map((a) => (a.status = 2, a.data));
    this._mode !== 3 ? this.fetch(this._url, JSON.stringify(i)).catch((a) => this.onError(a)).then((a) => this.result(a, i)) : this._socket.send(JSON.stringify({ action: "call", body: i }));
  }
  result(e, n) {
    const i = {};
    if (e) for (let a = 0; a < e.length; a++) i[e[a].id] = e[a];
    else for (let a = 0; a < n.length; a++) i[n[a].id] = { id: n[a].id, error: "Network Error", data: null };
    for (let a = this._queue.length - 1; a >= 0; a--) {
      const r = this._queue[a], s = i[r.data.id];
      s && (this.onResponse(r, s), s.error ? r.reject(s.error) : r.resolve(s.data), this._queue.splice(a, 1));
    }
  }
  on(e, n) {
    const i = this._uid();
    let a = this._events[e];
    const r = !!a;
    return r || (a = this._events[e] = []), a.push({ id: i, handler: n }), r || this._mode != 3 || this._socket.send(JSON.stringify({ action: "subscribe", name: e })), { name: e, id: i };
  }
  _resubscribe() {
    if (this._mode == 3) for (const e in this._events) this._socket.send(JSON.stringify({ action: "subscribe", name: e }));
  }
  detach(e) {
    if (!e) {
      if (this._mode == 3) for (const r in this._events) this._socket.send(JSON.stringify({ action: "unsubscribe", key: r }));
      return void (this._events = {});
    }
    const { id: n, name: i } = e, a = this._events[i];
    if (a) {
      const r = a.filter((s) => s.id != n);
      r.length ? this._events[i] = r : (delete this._events[i], this._mode == 3 && this._socket.send(JSON.stringify({ action: "unsubscribe", name: i })));
    }
  }
  fire(e, n) {
    const i = this._events[e];
    if (i) for (let a = 0; a < i.length; a++) i[a].handler(n);
  }
  onError(e) {
    return null;
  }
  onCall(e, n) {
  }
  onResponse(e, n) {
  }
}
const Jn = function(t, e) {
  const n = new Yn({ url: t, token: e });
  n.fetch = function(i, a) {
    const r = { headers: this.headers() };
    return a && (r.method = "POST", r.body = a), fetch(i, r).then((s) => s.json());
  }, this._ready = n.load().then((i) => this._remote = i), this.ready = function() {
    return this._ready;
  }, this.on = function(i, a) {
    this.ready().then((r) => {
      if (typeof i == "string") r.on(i, a);
      else for (const s in i) r.on(s, i[s]);
    });
  };
};
function dn(t, e) {
  if (!e) return !0;
  if (t._on_timeout) return !1;
  var n = Math.ceil(1e3 / e);
  return n < 2 || (setTimeout(function() {
    delete t._on_timeout;
  }, n), t._on_timeout = !0), !0;
}
var Kn = function() {
  var t = {};
  return { getState: function(e) {
    if (t[e]) return t[e].method();
    var n = {};
    for (var i in t) t[i].internal || P(n, t[i].method(), !0);
    return n;
  }, registerProvider: function(e, n, i) {
    t[e] = { method: n, internal: i };
  }, unregisterProvider: function(e) {
    delete t[e];
  } };
};
const Xn = Promise;
var et = { $create: function(t) {
  return P(t || [], this);
}, $removeAt: function(t, e) {
  t >= 0 && this.splice(t, e || 1);
}, $remove: function(t) {
  this.$removeAt(this.$find(t));
}, $insertAt: function(t, e) {
  if (e || e === 0) {
    var n = this.splice(e, this.length - e);
    this[e] = t, this.push.apply(this, n);
  } else this.push(t);
}, $find: function(t) {
  for (var e = 0; e < this.length; e++) if (t == this[e]) return e;
  return -1;
}, $each: function(t, e) {
  for (var n = 0; n < this.length; n++) t.call(e || this, this[n]);
}, $map: function(t, e) {
  for (var n = 0; n < this.length; n++) this[n] = t.call(e || this, this[n]);
  return this;
}, $filter: function(t, e) {
  for (var n = 0; n < this.length; n++) t.call(e || this, this[n]) || (this.splice(n, 1), n--);
  return this;
} };
function Rt(t, e, n, i) {
  return (i = e ? e.config : i) && i.placeholder_task && n.exists(t) ? n.getItem(t).type === i.types.placeholder : !1;
}
var it = function(t) {
  return this.pull = {}, this.$initItem = t.initItem, this.visibleOrder = et.$create(), this.fullOrder = et.$create(), this._skip_refresh = !1, this._filterRule = null, this._searchVisibleOrder = {}, this._indexRangeCache = {}, this._getItemsCache = null, this.$config = t, ot(this), this._attachDataChange(function() {
    return this._indexRangeCache = {}, this._getItemsCache = null, !0;
  }), this;
};
it.prototype = { _attachDataChange: function(t) {
  this.attachEvent("onClearAll", t), this.attachEvent("onBeforeParse", t), this.attachEvent("onBeforeUpdate", t), this.attachEvent("onBeforeDelete", t), this.attachEvent("onBeforeAdd", t), this.attachEvent("onParse", t), this.attachEvent("onBeforeFilter", t);
}, _parseInner: function(t) {
  for (var e = null, n = [], i = 0, a = t.length; i < a; i++) e = t[i], this.$initItem && (this.$config.copyOnParse() && (e = q(e)), e = this.$initItem(e)), this.callEvent("onItemLoading", [e]) && (this.pull.hasOwnProperty(e.id) || this.fullOrder.push(e.id), n.push(e), this.pull[e.id] = e);
  return n;
}, parse: function(t) {
  this.isSilent() || this.callEvent("onBeforeParse", [t]);
  var e = this._parseInner(t);
  this.isSilent() || (this.refresh(), this.callEvent("onParse", [e]));
}, getItem: function(t) {
  return this.pull[t];
}, _updateOrder: function(t) {
  t.call(this.visibleOrder), t.call(this.fullOrder);
}, updateItem: function(t, e) {
  if (W(e) || (e = this.getItem(t)), !this.isSilent() && this.callEvent("onBeforeUpdate", [e.id, e]) === !1) return !1;
  P(this.pull[t], e, !0), this.isSilent() || (this.callEvent("onAfterUpdate", [e.id, e]), this.callEvent("onStoreUpdated", [e.id, e, "update"]));
}, _removeItemInner: function(t) {
  this._updateOrder(function() {
    this.$remove(t);
  }), delete this.pull[t];
}, removeItem: function(t) {
  var e = this.getItem(t);
  if (!this.isSilent() && this.callEvent("onBeforeDelete", [e.id, e]) === !1) return !1;
  this.callEvent("onAfterDeleteConfirmed", [e.id, e]), this._removeItemInner(t), this.isSilent() && this.callEvent("onAfterSilentDelete", [e.id, e]), this.isSilent() || (this.filter(), this.callEvent("onAfterDelete", [e.id, e]), this.callEvent("onStoreUpdated", [e.id, e, "delete"]));
}, _addItemInner: function(t, e) {
  if (this.exists(t.id)) this.silent(function() {
    this.updateItem(t.id, t);
  });
  else {
    var n = this.visibleOrder, i = n.length;
    (!W(e) || e < 0) && (e = i), e > i && (e = Math.min(n.length, e));
  }
  this.pull[t.id] = t, this._updateOrder(function() {
    this.$find(t.id) === -1 && this.$insertAt(t.id, e);
  }), this.filter();
}, isVisible: function(t) {
  return this.visibleOrder.$find(t) > -1;
}, getVisibleItems: function() {
  return this.getIndexRange();
}, addItem: function(t, e) {
  return W(t.id) || (t.id = st()), this.$initItem && (t = this.$initItem(t)), !(!this.isSilent() && this.callEvent("onBeforeAdd", [t.id, t]) === !1) && (this._addItemInner(t, e), this.isSilent() || (this.callEvent("onAfterAdd", [t.id, t]), this.callEvent("onStoreUpdated", [t.id, t, "add"])), t.id);
}, _changeIdInner: function(t, e) {
  this.pull[t] && (this.pull[e] = this.pull[t]);
  var n = this._searchVisibleOrder[t];
  this.pull[e].id = e, this._updateOrder(function() {
    this[this.$find(t)] = e;
  }), this._searchVisibleOrder[e] = n, delete this._searchVisibleOrder[t], delete this.pull[t];
}, changeId: function(t, e) {
  this._changeIdInner(t, e), this.callEvent("onIdChange", [t, e]);
}, exists: function(t) {
  return !!this.pull[t];
}, _moveInner: function(t, e) {
  var n = this.getIdByIndex(t);
  this._updateOrder(function() {
    this.$removeAt(t), this.$insertAt(n, Math.min(this.length, e));
  });
}, move: function(t, e) {
  var n = this.getIdByIndex(t), i = this.getItem(n);
  this._moveInner(t, e), this.isSilent() || this.callEvent("onStoreUpdated", [i.id, i, "move"]);
}, clearAll: function() {
  this.$destroyed || (this.silent(function() {
    this.unselect();
  }), this.pull = {}, this.visibleOrder = et.$create(), this.fullOrder = et.$create(), this.isSilent() || (this.callEvent("onClearAll", []), this.refresh()));
}, silent: function(t, e) {
  var n = !1;
  this.isSilent() && (n = !0), this._skip_refresh = !0, t.call(e || this), n || (this._skip_refresh = !1);
}, isSilent: function() {
  return !!this._skip_refresh;
}, arraysEqual: function(t, e) {
  if (t.length !== e.length) return !1;
  for (var n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1;
  return !0;
}, refresh: function(t, e) {
  var n, i;
  if (!this.$destroyed && !this.isSilent() && (t && (n = this.getItem(t)), i = t ? [t, n, "paint"] : [null, null, null], this.callEvent("onBeforeStoreUpdate", i) !== !1)) {
    var a = this._quick_refresh && !this._mark_recompute;
    if (this._mark_recompute = !1, t) {
      if (!e && !a) {
        var r = this.visibleOrder;
        this.filter(), this.arraysEqual(r, this.visibleOrder) || (t = void 0);
      }
    } else a || this.filter();
    i = t ? [t, n, "paint"] : [null, null, null], this.callEvent("onStoreUpdated", i);
  }
}, count: function() {
  return this.fullOrder.length;
}, countVisible: function() {
  return this.visibleOrder.length;
}, sort: function(t) {
}, serialize: function() {
}, eachItem: function(t) {
  for (var e = 0; e < this.fullOrder.length; e++) {
    var n = this.getItem(this.fullOrder[e]);
    t.call(this, n);
  }
}, find: function(t) {
  var e = [];
  return this.eachItem(function(n) {
    t(n) && e.push(n);
  }), e;
}, filter: function(t) {
  this.isSilent() || this.callEvent("onBeforeFilter", []), this.callEvent("onPreFilter", []);
  var e = et.$create(), n = [];
  this.eachItem(function(a) {
    this.callEvent("onFilterItem", [a.id, a]) && (Rt(a.id, null, this, this._ganttConfig) ? n.push(a.id) : e.push(a.id));
  });
  for (var i = 0; i < n.length; i++) e.push(n[i]);
  for (this.visibleOrder = e, this._searchVisibleOrder = {}, i = 0; i < this.visibleOrder.length; i++) this._searchVisibleOrder[this.visibleOrder[i]] = i;
  this.isSilent() || this.callEvent("onFilter", []);
}, getIndexRange: function(t, e) {
  var n = Math.min(e || 1 / 0, this.countVisible() - 1), i = t || 0, a = i + "-" + n;
  if (this._indexRangeCache[a]) return this._indexRangeCache[a].slice();
  for (var r = [], s = i; s <= n; s++) r.push(this.getItem(this.visibleOrder[s]));
  return this._indexRangeCache[a] = r.slice(), r;
}, getItems: function() {
  if (this._getItemsCache) return this._getItemsCache.slice();
  var t = [];
  for (var e in this.pull) t.push(this.pull[e]);
  return this._getItemsCache = t.slice(), t;
}, getIdByIndex: function(t) {
  return this.visibleOrder[t];
}, getIndexById: function(t) {
  var e = this._searchVisibleOrder[t];
  return e === void 0 && (e = -1), e;
}, _getNullIfUndefined: function(t) {
  return t === void 0 ? null : t;
}, getFirst: function() {
  return this._getNullIfUndefined(this.visibleOrder[0]);
}, getLast: function() {
  return this._getNullIfUndefined(this.visibleOrder[this.visibleOrder.length - 1]);
}, getNext: function(t) {
  return this._getNullIfUndefined(this.visibleOrder[this.getIndexById(t) + 1]);
}, getPrev: function(t) {
  return this._getNullIfUndefined(this.visibleOrder[this.getIndexById(t) - 1]);
}, destructor: function() {
  this.callEvent("onDestroy", []), this.detachAllEvents(), this.$destroyed = !0, this.pull = null, this.$initItem = null, this.visibleOrder = null, this.fullOrder = null, this._skip_refresh = null, this._filterRule = null, this._searchVisibleOrder = null, this._indexRangeCache = {};
} };
var cn = function(t) {
  var e;
  it.apply(this, [t]), this._branches = {}, this.pull = {}, this.$initItem = function(o) {
    var l = o;
    t.initItem && (l = t.initItem(l));
    var c = this.getItem(o.id);
    return c && !lt(c.parent, l.parent) && this.move(l.id, l.$index || -1, l.parent || this._ganttConfig.root_id), l;
  }, this.$parentProperty = t.parentProperty || "parent", typeof t.rootId != "function" ? this.$getRootId = (e = t.rootId || 0, function() {
    return e;
  }) : this.$getRootId = t.rootId, this.$openInitially = t.openInitially, this.visibleOrder = et.$create(), this.fullOrder = et.$create(), this._searchVisibleOrder = {}, this._indexRangeCache = {}, this._eachItemMainRangeCache = null, this._getItemsCache = null, this._skip_refresh = !1, this._ganttConfig = null, t.getConfig && (this._ganttConfig = t.getConfig());
  var n = {}, i = {}, a = {}, r = {}, s = !1;
  return this._attachDataChange(function() {
    return this._indexRangeCache = {}, this._eachItemMainRangeCache = null, this._getItemsCache = null, !0;
  }), this.attachEvent("onPreFilter", function() {
    this._indexRangeCache = {}, this._eachItemMainRangeCache = null, n = {}, i = {}, a = {}, r = {}, s = !1, this.eachItem(function(o) {
      var l = this.getParent(o.id);
      o.$open && a[l] !== !1 ? a[o.id] = !0 : a[o.id] = !1, this._isSplitItem(o) && (s = !0, n[o.id] = !0, i[o.id] = !0), s && i[l] && (i[o.id] = !0), a[l] || a[l] === void 0 ? r[o.id] = !0 : r[o.id] = !1;
    });
  }), this.attachEvent("onFilterItem", function(o, l) {
    var c = !1;
    this._ganttConfig && (c = this._ganttConfig.open_split_tasks);
    var d = r[l.id];
    return s && (d && i[l.id] && !n[l.id] && (d = !!c), i[l.id] && !n[l.id] && (l.$split_subtask = !0)), l.$expanded_branch = !!r[l.id], !!d;
  }), this.attachEvent("onFilter", function() {
    n = {}, i = {}, a = {}, r = {};
  }), this;
};
function lt(t, e) {
  return String(t) === String(e);
}
function F(t) {
  return mt.isNode || !t.$root;
}
cn.prototype = P({ _buildTree: function(t) {
  for (var e = null, n = this.$getRootId(), i = 0, a = t.length; i < a; i++) e = t[i], this.setParent(e, at(this.getParent(e), n) || n);
  for (i = 0, a = t.length; i < a; i++) e = t[i], this._add_branch(e), e.$level = this.calculateItemLevel(e), e.$local_index = this.getBranchIndex(e.id), W(e.$open) || (e.$open = W(e.open) ? e.open : this.$openInitially());
  this._updateOrder();
}, _isSplitItem: function(t) {
  return t.render == "split" && this.hasChild(t.id);
}, parse: function(t) {
  this._skip_refresh || this.callEvent("onBeforeParse", [t]);
  var e = this._parseInner(t);
  this._buildTree(e), this.filter(), this._skip_refresh || this.callEvent("onParse", [e]);
}, _addItemInner: function(t, e) {
  var n = this.getParent(t);
  W(n) || (n = this.$getRootId(), this.setParent(t, n));
  var i = this.getIndexById(n) + Math.min(Math.max(e, 0), this.visibleOrder.length);
  1 * i !== i && (i = void 0), it.prototype._addItemInner.call(this, t, i), this.setParent(t, n), t.hasOwnProperty("$rendered_parent") && this._move_branch(t, t.$rendered_parent), this._add_branch(t, e);
}, _changeIdInner: function(t, e) {
  var n = this.getChildren(t), i = this._searchVisibleOrder[t];
  it.prototype._changeIdInner.call(this, t, e);
  var a = this.getParent(e);
  this._replace_branch_child(a, t, e), this._branches[t] && (this._branches[e] = this._branches[t]);
  for (var r = 0; r < n.length; r++) {
    var s = this.getItem(n[r]);
    s[this.$parentProperty] = e, s.$rendered_parent = e;
  }
  this._searchVisibleOrder[e] = i, delete this._branches[t];
}, _traverseBranches: function(t, e) {
  W(e) || (e = this.$getRootId());
  var n = this._branches[e];
  if (n) for (var i = 0; i < n.length; i++) {
    var a = n[i];
    t.call(this, a), this._branches[a] && this._traverseBranches(t, a);
  }
}, _updateOrder: function(t) {
  this.fullOrder = et.$create(), this._traverseBranches(function(e) {
    this.fullOrder.push(e);
  }), t && it.prototype._updateOrder.call(this, t);
}, _removeItemInner: function(t) {
  var e = [];
  this.eachItem(function(i) {
    e.push(i);
  }, t), e.push(this.getItem(t));
  for (var n = 0; n < e.length; n++) this._move_branch(e[n], this.getParent(e[n]), null), it.prototype._removeItemInner.call(this, e[n].id), this._move_branch(e[n], this.getParent(e[n]), null);
}, move: function(t, e, n) {
  var i = arguments[3], a = (this._ganttConfig || {}).root_id || 0;
  if (i = at(i, a)) {
    if (i === t) return;
    n = this.getParent(i), e = this.getBranchIndex(i);
  }
  if (!lt(t, n)) {
    W(n) || (n = this.$getRootId());
    var r = this.getItem(t), s = this.getParent(r.id), o = this.getChildren(n);
    if (e == -1 && (e = o.length + 1), lt(s, n) && this.getBranchIndex(t) == e) return;
    if (this.callEvent("onBeforeItemMove", [t, n, e]) === !1) return !1;
    for (var l = [], c = 0; c < o.length; c++) Rt(o[c], null, this, this._ganttConfig) && (l.push(o[c]), o.splice(c, 1), c--);
    this._replace_branch_child(s, t);
    var d = (o = this.getChildren(n))[e];
    (d = at(d, a)) ? o = o.slice(0, e).concat([t]).concat(o.slice(e)) : o.push(t), l.length && (o = o.concat(l)), lt(r.$rendered_parent, s) || lt(s, n) || (r.$rendered_parent = s), this.setParent(r, n), this._branches[n] = o;
    var u = this.calculateItemLevel(r) - r.$level;
    r.$level += u, this.eachItem(function(h) {
      h.$level += u;
    }, r.id, this), this._moveInner(this.getIndexById(t), this.getIndexById(n) + e), this.callEvent("onAfterItemMove", [t, n, e]), this.refresh();
  }
}, getBranchIndex: function(t) {
  var e = this.getChildren(this.getParent(t));
  let n = e.indexOf(t + "");
  return n == -1 && (n = e.indexOf(+t)), n;
}, hasChild: function(t) {
  var e = this._branches[t];
  return e && e.length;
}, getChildren: function(t) {
  var e = this._branches[t];
  return e || et.$create();
}, isChildOf: function(t, e) {
  if (!this.exists(t)) return !1;
  if (e === this.$getRootId()) return !0;
  if (!this.hasChild(e)) return !1;
  var n = this.getItem(t), i = this.getParent(t);
  if (this.getItem(e).$level >= n.$level) return !1;
  for (; n && this.exists(i); ) {
    if ((n = this.getItem(i)) && lt(n.id, e)) return !0;
    i = this.getParent(n);
  }
  return !1;
}, getSiblings: function(t) {
  if (!this.exists(t)) return et.$create();
  var e = this.getParent(t);
  return this.getChildren(e);
}, getNextSibling: function(t) {
  for (var e = this.getSiblings(t), n = 0, i = e.length; n < i; n++) if (lt(e[n], t)) {
    var a = e[n + 1];
    return a === 0 && n > 0 && (a = "0"), a || null;
  }
  return null;
}, getPrevSibling: function(t) {
  for (var e = this.getSiblings(t), n = 0, i = e.length; n < i; n++) if (lt(e[n], t)) {
    var a = e[n - 1];
    return a === 0 && n > 0 && (a = "0"), a || null;
  }
  return null;
}, getParent: function(t) {
  var e = null;
  return (e = t.id !== void 0 ? t : this.getItem(t)) ? e[this.$parentProperty] : this.$getRootId();
}, clearAll: function() {
  this._branches = {}, it.prototype.clearAll.call(this);
}, calculateItemLevel: function(t) {
  var e = 0;
  return this.eachParent(function() {
    e++;
  }, t), e;
}, _setParentInner: function(t, e, n) {
  n || (t.hasOwnProperty("$rendered_parent") ? this._move_branch(t, t.$rendered_parent, e) : this._move_branch(t, t[this.$parentProperty], e));
}, setParent: function(t, e, n) {
  this._setParentInner(t, e, n), t[this.$parentProperty] = e;
}, _eachItemCached: function(t, e) {
  for (var n = 0, i = e.length; n < i; n++) t.call(this, e[n]);
}, _eachItemIterate: function(t, e, n) {
  var i = this.getChildren(e);
  for (i.length && (i = i.slice().reverse()); i.length; ) {
    var a = i.pop(), r = this.getItem(a);
    if (t.call(this, r), n && n.push(r), this.hasChild(r.id)) for (var s = this.getChildren(r.id), o = s.length - 1; o >= 0; o--) i.push(s[o]);
  }
}, eachItem: function(t, e) {
  var n = this.$getRootId();
  W(e) || (e = n);
  var i = at(e, n) || n, a = !1, r = !1, s = null;
  i === n && (this._eachItemMainRangeCache ? (a = !0, s = this._eachItemMainRangeCache) : (r = !0, s = this._eachItemMainRangeCache = [])), a ? this._eachItemCached(t, s) : this._eachItemIterate(t, i, r ? s : null);
}, eachParent: function(t, e) {
  for (var n = {}, i = e, a = this.getParent(i); this.exists(a); ) {
    if (n[a]) throw new Error("Invalid tasks tree. Cyclic reference has been detected on task " + a);
    n[a] = !0, i = this.getItem(a), t.call(this, i), a = this.getParent(i);
  }
}, _add_branch: function(t, e, n) {
  var i = n === void 0 ? this.getParent(t) : n;
  this.hasChild(i) || (this._branches[i] = et.$create());
  var a = this.getChildren(i);
  a.indexOf(t.id + "") > -1 || a.indexOf(+t.id) > -1 || (1 * e == e ? a.splice(e, 0, t.id) : a.push(t.id), t.$rendered_parent = i);
}, _move_branch: function(t, e, n) {
  this._eachItemMainRangeCache = null, this._replace_branch_child(e, t.id), this.exists(n) || lt(n, this.$getRootId()) ? this._add_branch(t, void 0, n) : delete this._branches[t.id], t.$level = this.calculateItemLevel(t), this.eachItem(function(i) {
    i.$level = this.calculateItemLevel(i);
  }, t.id);
}, _replace_branch_child: function(t, e, n) {
  var i = this.getChildren(t);
  if (i && t !== void 0) {
    var a = et.$create();
    let r = i.indexOf(e + "");
    r != -1 || isNaN(+e) || (r = i.indexOf(+e)), r > -1 && (n ? i.splice(r, 1, n) : i.splice(r, 1)), a = i, this._branches[t] = a;
  }
}, sort: function(t, e, n) {
  this.exists(n) || (n = this.$getRootId()), t || (t = "order");
  var i = typeof t == "string" ? function(l, c) {
    return l[t] == c[t] || Q(l[t]) && Q(c[t]) && l[t].valueOf() == c[t].valueOf() ? 0 : l[t] > c[t] ? 1 : -1;
  } : t;
  if (e) {
    var a = i;
    i = function(l, c) {
      return a(c, l);
    };
  }
  var r = this.getChildren(n);
  if (r) {
    for (var s = [], o = r.length - 1; o >= 0; o--) s[o] = this.getItem(r[o]);
    for (s.sort(i), o = 0; o < s.length; o++) r[o] = s[o].id, this.sort(t, e, r[o]);
  }
}, filter: function(t) {
  for (let e in this.pull) {
    const n = this.pull[e].$rendered_parent, i = this.getParent(this.pull[e]);
    lt(n, i) || this._move_branch(this.pull[e], n, i);
  }
  return it.prototype.filter.apply(this, arguments);
}, open: function(t) {
  this.exists(t) && (this.getItem(t).$open = !0, this._skipTaskRecalculation = !0, this.callEvent("onItemOpen", [t]));
}, close: function(t) {
  this.exists(t) && (this.getItem(t).$open = !1, this._skipTaskRecalculation = !0, this.callEvent("onItemClose", [t]));
}, destructor: function() {
  it.prototype.destructor.call(this), this._branches = null, this._indexRangeCache = {}, this._eachItemMainRangeCache = null;
} }, it.prototype);
const Zn = function(t, e) {
  const n = e.getDatastore(t), i = function(o, l) {
    const c = l.getLayers(), d = n.getItem(o);
    if (d && n.isVisible(o)) for (let u = 0; u < c.length; u++) c[u].render_item(d);
  }, a = function(o) {
    const l = o.getLayers();
    for (let _ = 0; _ < l.length; _++) l[_].clear();
    let c = null;
    const d = {};
    for (let _ = 0; _ < l.length; _++) {
      const p = l[_];
      let y;
      if (p.get_visible_range) {
        var u = p.get_visible_range(n);
        if (u.start !== void 0 && u.end !== void 0) {
          var h = u.start + " - " + u.end;
          d[h] ? y = d[h] : (y = n.getIndexRange(u.start, u.end), d[h] = y);
        } else {
          if (u.ids === void 0) throw new Error("Invalid range returned from 'getVisibleRange' of the layer");
          y = u.ids.map(function(k) {
            return n.getItem(k);
          });
        }
      } else c || (c = n.getVisibleItems()), y = c;
      p.prepare_data && p.prepare_data(y), l[_].render_items(y);
    }
  }, r = function(o) {
    if (o.update_items) {
      let c = [];
      if (o.get_visible_range) {
        var l = o.get_visible_range(n);
        if (l.start !== void 0 && l.end !== void 0 && (c = n.getIndexRange(l.start, l.end)), l.ids !== void 0) {
          let d = l.ids.map(function(u) {
            return n.getItem(u);
          });
          d.length > 0 && (d = d.filter((u) => u !== void 0), c = c.concat(d));
        }
        if ((l.start == null || l.end == null) && l.ids == null) throw new Error("Invalid range returned from 'getVisibleRange' of the layer");
      } else c = n.getVisibleItems();
      o.prepare_data && o.prepare_data(c, o), o.update_items(c);
    }
  };
  function s(o) {
    return !!o.$services.getService("state").getState("batchUpdate").batch_update;
  }
  n.attachEvent("onStoreUpdated", function(o, l, c) {
    if (F(e)) return !0;
    const d = e.$services.getService("layers").getDataRender(t);
    d && (d.onUpdateRequest = function(u) {
      r(u);
    });
  }), n.attachEvent("onStoreUpdated", function(o, l, c) {
    s(e) || (o && c != "move" && c != "delete" ? (n.callEvent("onBeforeRefreshItem", [l.id]), n.callEvent("onAfterRefreshItem", [l.id])) : (n.callEvent("onBeforeRefreshAll", []), n.callEvent("onAfterRefreshAll", [])));
  }), n.attachEvent("onAfterRefreshAll", function() {
    if (F(e)) return !0;
    const o = e.$services.getService("layers").getDataRender(t);
    o && !s(e) && a(o);
  }), n.attachEvent("onAfterRefreshItem", function(o) {
    if (F(e)) return !0;
    const l = e.$services.getService("layers").getDataRender(t);
    l && i(o, l);
  }), n.attachEvent("onItemOpen", function() {
    if (F(e) || n.isSilent()) return !0;
    e.render();
  }), n.attachEvent("onItemClose", function() {
    if (F(e) || n.isSilent()) return !0;
    e.render();
  }), n.attachEvent("onIdChange", function(o, l) {
    if (F(e)) return !0;
    if (n.callEvent("onBeforeIdChange", [o, l]), !s(e) && !n.isSilent()) {
      const c = e.$services.getService("layers").getDataRender(t);
      c ? (function(d, u, h) {
        for (let _ = 0; _ < d.length; _++) d[_].change_id(u, h);
      }(c.getLayers(), o, l, n.getItem(l)), i(l, c)) : e.render();
    }
  });
};
function ne() {
  for (var t = this.$services.getService("datastores"), e = [], n = 0; n < t.length; n++) {
    var i = this.getDatastore(t[n]);
    i.$destroyed || e.push(i);
  }
  return e;
}
const Qn = { create: function() {
  var t = P({}, { createDatastore: function(e) {
    var n = (e.type || "").toLowerCase() == "treedatastore" ? cn : it;
    if (e) {
      var i = this;
      e.openInitially = function() {
        return i.config.open_tree_initially;
      }, e.copyOnParse = function() {
        return i.config.deepcopy_on_parse;
      };
    }
    var a = new n(e);
    if (this.mixin(a, function(o) {
      var l = null, c = o._removeItemInner;
      function d(u) {
        l = null, this.callEvent("onAfterUnselect", [u]);
      }
      return o._removeItemInner = function(u) {
        return l == u && d.call(this, u), l && this.eachItem && this.eachItem(function(h) {
          h.id == l && d.call(this, h.id);
        }, u), c.apply(this, arguments);
      }, o.attachEvent("onIdChange", function(u, h) {
        o.getSelectedId() == u && o.silent(function() {
          o.unselect(u), o.select(h);
        });
      }), { select: function(u) {
        if (u) {
          if (l == u) return l;
          if (!this._skip_refresh && !this.callEvent("onBeforeSelect", [u])) return !1;
          this.unselect(), l = u, this._skip_refresh || (this.refresh(u), this.callEvent("onAfterSelect", [u]));
        }
        return l;
      }, getSelectedId: function() {
        return l;
      }, isSelected: function(u) {
        return u == l;
      }, unselect: function(u) {
        (u = u || l) && (l = null, this._skip_refresh || (this.refresh(u), d.call(this, u)));
      } };
    }(a)), e.name) {
      var r = "datastore:" + e.name;
      a.attachEvent("onDestroy", (function() {
        this.$services.dropService(r);
        for (var o = this.$services.getService("datastores"), l = 0; l < o.length; l++) if (o[l] === e.name) {
          o.splice(l, 1);
          break;
        }
      }).bind(this)), this.$services.dropService(r), this.$services.setService(r, function() {
        return a;
      });
      var s = this.$services.getService("datastores");
      s ? s.indexOf(e.name) < 0 && s.push(e.name) : (s = [], this.$services.setService("datastores", function() {
        return s;
      }), s.push(e.name)), Zn(e.name, this);
    }
    return a;
  }, getDatastore: function(e) {
    return this.$services.getService("datastore:" + e);
  }, _getDatastores: ne, refreshData: function() {
    var e;
    F(this) || (e = this.getScrollState()), this.callEvent("onBeforeDataRender", []);
    for (var n = ne.call(this), i = 0; i < n.length; i++) n[i].refresh();
    this.config.preserve_scroll && !F(this) && (e.x || e.y) && this.scrollTo(e.x, e.y), this.callEvent("onDataRender", []);
  }, isChildOf: function(e, n) {
    return this.$data.tasksStore.isChildOf(e, n);
  }, refreshTask: function(e, n) {
    var i = this.getTask(e), a = this;
    function r() {
      if (n === void 0 || n) {
        for (var o = 0; o < i.$source.length; o++) a.refreshLink(i.$source[o]);
        for (o = 0; o < i.$target.length; o++) a.refreshLink(i.$target[o]);
      }
    }
    if (i && this.isTaskVisible(e)) this.$data.tasksStore.refresh(e, !!this.getState("tasksDnd").drag_id || n === !1), r();
    else if (this.isTaskExists(e) && this.isTaskExists(this.getParent(e)) && !this._bulk_dnd) {
      this.refreshTask(this.getParent(e));
      var s = !1;
      this.eachParent(function(o) {
        (s || this.isSplitTask(o)) && (s = !0);
      }, e), s && r();
    }
  }, refreshLink: function(e) {
    this.$data.linksStore.refresh(e, !!this.getState("tasksDnd").drag_id);
  }, silent: function(e) {
    var n = this;
    n.$data.tasksStore.silent(function() {
      n.$data.linksStore.silent(function() {
        e();
      });
    });
  }, clearAll: function() {
    for (var e = ne.call(this), n = 0; n < e.length; n++) e[n].silent(function() {
      e[n].clearAll();
    });
    for (n = 0; n < e.length; n++) e[n].clearAll();
    this._update_flags(), this.userdata = {}, this.callEvent("onClear", []), this.render();
  }, _clear_data: function() {
    this.$data.tasksStore.clearAll(), this.$data.linksStore.clearAll(), this._update_flags(), this.userdata = {};
  }, selectTask: function(e) {
    var n = this.$data.tasksStore;
    if (!this.config.select_task) return !1;
    if (e = at(e, this.config.root_id)) {
      let i = this.getSelectedId();
      n._skipResourceRepaint = !0, n.select(e), n._skipResourceRepaint = !1, i && n.pull[i].$split_subtask && i != e && this.refreshTask(i), n.pull[e].$split_subtask && i != e && this.refreshTask(e);
    }
    return n.getSelectedId();
  }, unselectTask: function(e) {
    var n = this.$data.tasksStore;
    n.unselect(e), e && n.pull[e].$split_subtask && this.refreshTask(e);
  }, isSelectedTask: function(e) {
    return this.$data.tasksStore.isSelected(e);
  }, getSelectedId: function() {
    return this.$data.tasksStore.getSelectedId();
  } });
  return P(t, { getTask: function(e) {
    e = at(e, this.config.root_id), this.assert(e, "Invalid argument for gantt.getTask");
    var n = this.$data.tasksStore.getItem(e);
    return this.assert(n, "Task not found id=" + e), n;
  }, getTaskByTime: function(e, n) {
    var i = this.$data.tasksStore.getItems(), a = [];
    if (e || n) {
      e = +e || -1 / 0, n = +n || 1 / 0;
      for (var r = 0; r < i.length; r++) {
        var s = i[r];
        +s.start_date < n && +s.end_date > e && a.push(s);
      }
    } else a = i;
    return a;
  }, isTaskExists: function(e) {
    return !(!this.$data || !this.$data.tasksStore) && this.$data.tasksStore.exists(e);
  }, updateTask: function(e, n) {
    W(n) || (n = this.getTask(e)), this.$data.tasksStore.updateItem(e, n), this.isTaskExists(e) && this.refreshTask(e);
  }, addTask: function(e, n, i) {
    if (W(e.id) || (e.id = st()), this.isTaskExists(e.id) && this.getTask(e.id).$index != e.$index) return e.start_date && typeof e.start_date == "string" && (e.start_date = this.date.parseDate(e.start_date, "parse_date")), e.end_date && typeof e.end_date == "string" && (e.end_date = this.date.parseDate(e.end_date, "parse_date")), this.$data.tasksStore.updateItem(e.id, e);
    if (W(n) || (n = this.getParent(e) || 0), this.isTaskExists(n) || (n = this.config.root_id), this.setParent(e, n), this.getState().lightbox && this.isTaskExists(n)) {
      var a = this.getTask(n);
      this.callEvent("onAfterParentExpand", [n, a]);
    }
    return this.$data.tasksStore.addItem(e, i, n);
  }, deleteTask: function(e) {
    return e = at(e, this.config.root_id), this.$data.tasksStore.removeItem(e);
  }, getTaskCount: function() {
    return this.$data.tasksStore.count();
  }, getVisibleTaskCount: function() {
    return this.$data.tasksStore.countVisible();
  }, getTaskIndex: function(e) {
    return this.$data.tasksStore.getBranchIndex(e);
  }, getGlobalTaskIndex: function(e) {
    return e = at(e, this.config.root_id), this.assert(e, "Invalid argument"), this.$data.tasksStore.getIndexById(e);
  }, eachTask: function(e, n, i) {
    return this.$data.tasksStore.eachItem(R(e, i || this), n);
  }, eachParent: function(e, n, i) {
    return this.$data.tasksStore.eachParent(R(e, i || this), n);
  }, changeTaskId: function(e, n) {
    this.$data.tasksStore.changeId(e, n);
    var i = this.$data.tasksStore.getItem(n), a = [];
    i.$source && (a = a.concat(i.$source)), i.$target && (a = a.concat(i.$target));
    for (var r = 0; r < a.length; r++) {
      var s = this.getLink(a[r]);
      s.source == e && (s.source = n), s.target == e && (s.target = n);
    }
  }, calculateTaskLevel: function(e) {
    return this.$data.tasksStore.calculateItemLevel(e);
  }, getNext: function(e) {
    return this.$data.tasksStore.getNext(e);
  }, getPrev: function(e) {
    return this.$data.tasksStore.getPrev(e);
  }, getParent: function(e) {
    return this.$data.tasksStore.getParent(e);
  }, setParent: function(e, n, i) {
    return this.$data.tasksStore.setParent(e, n, i);
  }, getSiblings: function(e) {
    return this.$data.tasksStore.getSiblings(e).slice();
  }, getNextSibling: function(e) {
    return this.$data.tasksStore.getNextSibling(e);
  }, getPrevSibling: function(e) {
    return this.$data.tasksStore.getPrevSibling(e);
  }, getTaskByIndex: function(e) {
    var n = this.$data.tasksStore.getIdByIndex(e);
    return this.isTaskExists(n) ? this.getTask(n) : null;
  }, getChildren: function(e) {
    return this.hasChild(e) ? this.$data.tasksStore.getChildren(e).slice() : [];
  }, hasChild: function(e) {
    return this.$data.tasksStore.hasChild(e);
  }, open: function(e) {
    this.$data.tasksStore.open(e);
  }, close: function(e) {
    this.$data.tasksStore.close(e);
  }, moveTask: function(e, n, i) {
    return i = at(i, this.config.root_id), this.$data.tasksStore.move.apply(this.$data.tasksStore, arguments);
  }, sort: function(e, n, i, a) {
    var r = !a;
    this.$data.tasksStore.sort(e, n, i), this.callEvent("onAfterSort", [e, n, i]), r && this.render();
  } }), P(t, { getLinkCount: function() {
    return this.$data.linksStore.count();
  }, getLink: function(e) {
    return this.$data.linksStore.getItem(e);
  }, getLinks: function() {
    return this.$data.linksStore.getItems();
  }, isLinkExists: function(e) {
    return this.$data.linksStore.exists(e);
  }, addLink: function(e) {
    return this.$data.linksStore.addItem(e);
  }, updateLink: function(e, n) {
    W(n) || (n = this.getLink(e)), this.$data.linksStore.updateItem(e, n);
  }, deleteLink: function(e) {
    return this.$data.linksStore.removeItem(e);
  }, changeLinkId: function(e, n) {
    return this.$data.linksStore.changeId(e, n);
  } }), t;
} };
function pe(t) {
  var e = t.date, n = t.$services;
  return { getSum: function(i, a, r) {
    r === void 0 && (r = i.length - 1), a === void 0 && (a = 0);
    for (var s = 0, o = a; o <= r; o++) s += i[o];
    return s;
  }, setSumWidth: function(i, a, r, s) {
    var o = a.width;
    s === void 0 && (s = o.length - 1), r === void 0 && (r = 0);
    var l = s - r + 1;
    if (!(r > o.length - 1 || l <= 0 || s > o.length - 1)) {
      var c = i - this.getSum(o, r, s);
      this.adjustSize(c, o, r, s), this.adjustSize(-c, o, s + 1), a.full_width = this.getSum(o);
    }
  }, splitSize: function(i, a) {
    for (var r = [], s = 0; s < a; s++) r[s] = 0;
    return this.adjustSize(i, r), r;
  }, adjustSize: function(i, a, r, s) {
    r || (r = 0), s === void 0 && (s = a.length - 1);
    for (var o = s - r + 1, l = this.getSum(a, r, s), c = r; c <= s; c++) {
      var d = Math.floor(i * (l ? a[c] / l : 1 / o));
      l -= a[c], i -= d, o--, a[c] += d;
    }
    a[a.length - 1] += i;
  }, sortScales: function(i) {
    function a(s, o) {
      var l = new Date(1970, 0, 1);
      return e.add(l, o, s) - l;
    }
    i.sort(function(s, o) {
      return a(s.unit, s.step) < a(o.unit, o.step) ? 1 : a(s.unit, s.step) > a(o.unit, o.step) ? -1 : 0;
    });
    for (var r = 0; r < i.length; r++) i[r].index = r;
  }, _isLegacyMode: function(i) {
    var a = i || t.config;
    return a.scale_unit || a.date_scale || a.subscales;
  }, _prepareScaleObject: function(i) {
    var a = i.format;
    return a || (a = i.template || i.date || "%d %M"), typeof a == "string" && (a = t.date.date_to_str(a)), { unit: i.unit || "day", step: i.step || 1, format: a, css: i.css };
  }, primaryScale: function(i) {
    var a, r = n.getService("templateLoader"), s = this._isLegacyMode(i), o = i || t.config;
    if (s) r.initTemplate("date_scale", void 0, void 0, o, t.config.templates), a = { unit: t.config.scale_unit, step: t.config.step, template: t.templates.date_scale, date: t.config.date_scale, css: t.templates.scale_cell_class };
    else {
      var l = o.scales[0];
      a = { unit: l.unit, step: l.step, template: l.template, format: l.format, date: l.date, css: l.css || t.templates.scale_cell_class };
    }
    return this._prepareScaleObject(a);
  }, getSubScales: function(i) {
    var a, r = this._isLegacyMode(i), s = i || t.config;
    if (r) {
      let o = "https://docs.dhtmlx.com/gantt/migrating.html#:~:text=%3D%20false%3B-,Time%20scale%20settings,-Configuration%20of%20time";
      t.env.isFF && (o = "https://docs.dhtmlx.com/gantt/migrating.html#6162"), console.warn(`You are using the obsolete scale configuration.
It will stop working in the future versions.
Please migrate the configuration to the newer version:
${o}`), a = s.subscales || [];
    } else a = s.scales.slice(1);
    return a.map((function(o) {
      return this._prepareScaleObject(o);
    }).bind(this));
  }, prepareConfigs: function(i, a, r, s, o, l, c) {
    for (var d = this.splitSize(s, i.length), u = r, h = [], _ = i.length - 1; _ >= 0; _--) {
      var p = _ == i.length - 1, y = this.initScaleConfig(i[_], o, l);
      p && this.processIgnores(y), this.initColSizes(y, a, u, d[_]), this.limitVisibleRange(y), p && (u = y.full_width), h.unshift(y);
    }
    for (_ = 0; _ < h.length - 1; _++) this.alineScaleColumns(h[h.length - 1], h[_]);
    for (_ = 0; _ < h.length; _++) c && this.reverseScale(h[_]), this.setPosSettings(h[_]);
    return h;
  }, reverseScale: function(i) {
    i.width = i.width.reverse(), i.trace_x = i.trace_x.reverse();
    var a = i.trace_indexes;
    i.trace_indexes = {}, i.trace_index_transition = {}, i.rtl = !0;
    for (var r = 0; r < i.trace_x.length; r++) i.trace_indexes[i.trace_x[r].valueOf()] = r, i.trace_index_transition[a[i.trace_x[r].valueOf()]] = r;
    return i;
  }, setPosSettings: function(i) {
    for (var a = 0, r = i.trace_x.length; a < r; a++) i.left.push((i.width[a - 1] || 0) + (i.left[a - 1] || 0));
  }, _ignore_time_config: function(i, a) {
    if (t.config.skip_off_time) {
      for (var r = !0, s = i, o = 0; o < a.step; o++) o && (s = e.add(i, o, a.unit)), r = r && !this.isWorkTime(s, a.unit);
      return r;
    }
    return !1;
  }, processIgnores: function(i) {
    i.ignore_x = {}, i.display_count = i.count;
  }, initColSizes: function(i, a, r, s) {
    var o = r;
    i.height = s;
    var l = i.display_count === void 0 ? i.count : i.display_count;
    l || (l = 1), i.col_width = Math.floor(o / l), a && i.col_width < a && (i.col_width = a, o = i.col_width * l), i.width = [];
    for (var c = i.ignore_x || {}, d = 0; d < i.trace_x.length; d++) if (c[i.trace_x[d].valueOf()] || i.display_count == i.count) i.width[d] = 0;
    else {
      var u = 1;
      i.unit == "month" && (u = Math.round((e.add(i.trace_x[d], i.step, i.unit) - i.trace_x[d]) / 864e5)), i.width[d] = u;
    }
    this.adjustSize(o - this.getSum(i.width), i.width), i.full_width = this.getSum(i.width);
  }, initScaleConfig: function(i, a, r) {
    var s = P({ count: 0, col_width: 0, full_width: 0, height: 0, width: [], left: [], trace_x: [], trace_indexes: {}, min_date: new Date(a), max_date: new Date(r) }, i);
    return this.eachColumn(i.unit, i.step, a, r, function(o) {
      s.count++, s.trace_x.push(new Date(o)), s.trace_indexes[o.valueOf()] = s.trace_x.length - 1;
    }), s.trace_x_ascending = s.trace_x.slice(), s;
  }, iterateScales: function(i, a, r, s, o) {
    for (var l = a.trace_x, c = i.trace_x, d = r || 0, u = s || c.length - 1, h = 0, _ = 1; _ < l.length; _++) {
      var p = i.trace_indexes[+l[_]];
      p !== void 0 && p <= u && (o && o.apply(this, [h, _, d, p]), d = p, h = _);
    }
  }, alineScaleColumns: function(i, a, r, s) {
    this.iterateScales(i, a, r, s, function(o, l, c, d) {
      var u = this.getSum(i.width, c, d - 1);
      this.getSum(a.width, o, l - 1) != u && this.setSumWidth(u, a, o, l - 1);
    });
  }, eachColumn: function(i, a, r, s, o) {
    var l = new Date(r), c = new Date(s);
    e[i + "_start"] && (l = e[i + "_start"](l));
    var d = new Date(l);
    for (+d >= +c && (c = e.add(d, a, i)); +d < +c; ) {
      o.call(this, new Date(d));
      var u = d.getTimezoneOffset();
      d = e.add(d, a, i), d = t._correct_dst_change(d, u, a, i), e[i + "_start"] && (d = e[i + "_start"](d));
    }
  }, limitVisibleRange: function(i) {
    var a = i.trace_x, r = i.width.length - 1, s = 0;
    if (+a[0] < +i.min_date && r != 0) {
      var o = Math.floor(i.width[0] * ((a[1] - i.min_date) / (a[1] - a[0])));
      s += i.width[0] - o, i.width[0] = o, a[0] = new Date(i.min_date);
    }
    var l = a.length - 1, c = a[l], d = e.add(c, i.step, i.unit);
    if (+d > +i.max_date && l > 0 && (o = i.width[l] - Math.floor(i.width[l] * ((d - i.max_date) / (d - c))), s += i.width[l] - o, i.width[l] = o), s) {
      for (var u = this.getSum(i.width), h = 0, _ = 0; _ < i.width.length; _++) {
        var p = Math.floor(s * (i.width[_] / u));
        i.width[_] += p, h += p;
      }
      this.adjustSize(s - h, i.width);
    }
  } };
}
function ti(t) {
  var e = function(d) {
    var u = new pe(d).primaryScale(), h = u.unit, _ = u.step;
    if (d.config.scale_offset_minimal) {
      var p = new pe(d), y = [p.primaryScale()].concat(p.getSubScales());
      p.sortScales(y), h = y[y.length - 1].unit, _ = y[y.length - 1].step || 1;
    }
    return { unit: h, step: _ };
  }(t), n = e.unit, i = e.step, a = function(d, u) {
    var h = { start_date: null, end_date: null };
    if (u.config.start_date && u.config.end_date) {
      h.start_date = u.date[d + "_start"](new Date(u.config.start_date));
      var _ = new Date(u.config.end_date), p = u.date[d + "_start"](new Date(_));
      _ = +_ != +p ? u.date.add(p, 1, d) : p, h.end_date = _;
    }
    return h;
  }(n, t);
  if (!a.start_date || !a.end_date) {
    for (var r = !0, s = t.getTaskByTime(), o = 0; o < s.length; o++)
      if (s[o].type !== t.config.types.project) {
        r = !1;
        break;
      }
    if (s.length && r) {
      var l = s[0].start_date, c = t.date.add(l, 1, t.config.duration_unit);
      a = { start_date: new Date(l), end_date: new Date(c) };
    } else a = t.getSubtaskDates();
    a.start_date && a.end_date || (a = { start_date: /* @__PURE__ */ new Date(), end_date: /* @__PURE__ */ new Date() }), t.eachTask(function(d) {
      t.config.deadlines && d.deadline && ie(a, d.deadline, d.deadline), d.constraint_date && d.constraint_type && t.config.constraint_types && d.constraint_type !== t.config.constraint_types.ASAP && d.constraint_type !== t.config.constraint_types.ALAP && ie(a, d.constraint_date, d.constraint_date), t.config.baselines && d.baselines && d.baselines.forEach(function(u) {
        ie(a, u.start_date, u.end_date);
      });
    }), a.start_date = t.date[n + "_start"](a.start_date), a.start_date = t.calculateEndDate({ start_date: t.date[n + "_start"](a.start_date), duration: -1, unit: n, step: i }), a.end_date = t.date[n + "_start"](a.end_date), a.end_date = t.calculateEndDate({ start_date: a.end_date, duration: 2, unit: n, step: i });
  }
  t._min_date = a.start_date, t._max_date = a.end_date;
}
function ie(t, e, n) {
  e < t.start_date && (t.start_date = new Date(e)), n > t.end_date && (t.end_date = new Date(n));
}
function me(t) {
  ti(t), function(e) {
    if (e.config.fit_tasks) {
      var n = +e._min_date, i = +e._max_date;
      if (+e._min_date != n || +e._max_date != i) return e.render(), e.callEvent("onScaleAdjusted", []), !0;
    }
  }(t);
}
function Re(t, e, n) {
  for (var i = 0; i < e.length; i++) t.isLinkExists(e[i]) && (n[e[i]] = t.getLink(e[i]));
}
function He(t, e, n) {
  Re(t, e.$source, n), Re(t, e.$target, n);
}
const ve = { getSubtreeLinks: function(t, e) {
  var n = {};
  return t.isTaskExists(e) && He(t, t.getTask(e), n), t.eachTask(function(i) {
    He(t, i, n);
  }, e), n;
}, getSubtreeTasks: function(t, e) {
  var n = {};
  return t.eachTask(function(i) {
    n[i.id] = i;
  }, e), n;
} };
class ei {
  constructor(e, n) {
    this.$gantt = e, this.$dp = n, this._dataProcessorHandlers = [];
  }
  attach() {
    const e = this.$dp, n = this.$gantt, i = {}, a = (o) => this.clientSideDelete(o, e, n);
    this._dataProcessorHandlers.push(n.attachEvent("onAfterTaskAdd", function(o, l) {
      n.isTaskExists(o) && (e.setGanttMode("tasks"), e.setUpdated(o, !0, "inserted"));
    })), this._dataProcessorHandlers.push(n.attachEvent("onAfterTaskUpdate", function(o, l) {
      n.isTaskExists(o) && (e.setGanttMode("tasks"), e.setUpdated(o, !0), n._sendTaskOrder && n._sendTaskOrder(o, l));
    })), this._dataProcessorHandlers.push(n.attachEvent("onBeforeTaskDelete", function(o, l) {
      return n.config.cascade_delete && (i[o] = { tasks: ve.getSubtreeTasks(n, o), links: ve.getSubtreeLinks(n, o) }), !e.deleteAfterConfirmation || (e.setGanttMode("tasks"), e.setUpdated(o, !0, "deleted"), !1);
    })), this._dataProcessorHandlers.push(n.attachEvent("onAfterTaskDelete", function(o, l) {
      e.setGanttMode("tasks");
      const c = !a(o), d = n.config.cascade_delete && i[o];
      if (c || d) {
        if (d) {
          const u = e.updateMode;
          e.setUpdateMode("off");
          const h = i[o];
          for (const _ in h.tasks) a(_) || (e.storeItem(h.tasks[_]), e.setUpdated(_, !0, "deleted"));
          e.setGanttMode("links");
          for (const _ in h.links) a(_) || (e.storeItem(h.links[_]), e.setUpdated(_, !0, "deleted"));
          i[o] = null, u !== "off" && e.sendAllData(), e.setGanttMode("tasks"), e.setUpdateMode(u);
        }
        c && (e.storeItem(l), e.deleteAfterConfirmation || e.setUpdated(o, !0, "deleted")), e.updateMode === "off" || e._tSend || e.sendAllData();
      }
    })), this._dataProcessorHandlers.push(n.attachEvent("onAfterLinkUpdate", function(o, l) {
      n.isLinkExists(o) && (e.setGanttMode("links"), e.setUpdated(o, !0));
    })), this._dataProcessorHandlers.push(n.attachEvent("onAfterLinkAdd", function(o, l) {
      n.isLinkExists(o) && (e.setGanttMode("links"), e.setUpdated(o, !0, "inserted"));
    })), this._dataProcessorHandlers.push(n.attachEvent("onAfterLinkDelete", function(o, l) {
      e.setGanttMode("links"), !a(o) && (e.storeItem(l), e.setUpdated(o, !0, "deleted"));
    })), this._dataProcessorHandlers.push(n.attachEvent("onRowDragEnd", function(o, l) {
      n._sendTaskOrder(o, n.getTask(o));
    }));
    let r = null, s = null;
    this._dataProcessorHandlers.push(n.attachEvent("onTaskIdChange", function(o, l) {
      if (!e._waitMode) return;
      const c = n.getChildren(l);
      if (c.length) {
        r = r || {};
        for (let u = 0; u < c.length; u++) {
          const h = this.getTask(c[u]);
          r[h.id] = h;
        }
      }
      const d = function(u) {
        let h = [];
        return u.$source && (h = h.concat(u.$source)), u.$target && (h = h.concat(u.$target)), h;
      }(this.getTask(l));
      if (d.length) {
        s = s || {};
        for (let u = 0; u < d.length; u++) {
          const h = this.getLink(d[u]);
          s[h.id] = h;
        }
      }
    })), e.attachEvent("onAfterUpdateFinish", function() {
      (r || s) && (n.batchUpdate(function() {
        for (const o in r) n.updateTask(r[o].id);
        for (const o in s) n.updateLink(s[o].id);
        r = null, s = null;
      }), r ? n._dp.setGanttMode("tasks") : n._dp.setGanttMode("links"));
    }), e.attachEvent("onBeforeDataSending", function() {
      if (this._tMode === "CUSTOM") return !0;
      let o = this._serverProcessor;
      if (this._tMode === "REST-JSON" || this._tMode === "REST") {
        const l = this._ganttMode;
        o = o.substring(0, o.indexOf("?") > -1 ? o.indexOf("?") : o.length), this.serverProcessor = o + (o.slice(-1) === "/" ? "" : "/") + l;
      } else {
        const l = this._ganttMode + "s";
        this.serverProcessor = o + n.ajax.urlSeparator(o) + "gantt_mode=" + l;
      }
      return !0;
    }), e.attachEvent("insertCallback", function(o, l, c, d) {
      const u = o.data || n.xml._xmlNodeToJSON(o.firstChild), h = { add: n.addTask, isExist: n.isTaskExists };
      d === "links" && (h.add = n.addLink, h.isExist = n.isLinkExists), h.isExist.call(n, l) || (u.id = l, h.add.call(n, u));
    }), e.attachEvent("updateCallback", function(o, l) {
      const c = o.data || n.xml._xmlNodeToJSON(o.firstChild);
      if (!n.isTaskExists(l)) return;
      const d = n.getTask(l);
      for (const u in c) {
        let h = c[u];
        switch (u) {
          case "id":
            continue;
          case "start_date":
          case "end_date":
            h = n.defined(n.templates.xml_date) ? n.templates.xml_date(h) : n.templates.parse_date(h);
            break;
          case "duration":
            d.end_date = n.calculateEndDate({ start_date: d.start_date, duration: h, task: d });
        }
        d[u] = h;
      }
      n.updateTask(l), n.refreshData();
    }), e.attachEvent("deleteCallback", function(o, l, c, d) {
      const u = { delete: n.deleteTask, isExist: n.isTaskExists };
      d === "links" ? (u.delete = n.deleteLink, u.isExist = n.isLinkExists) : d === "assignment" && (u.delete = function(h) {
        n.$data.assignmentsStore.remove(h);
      }, u.isExist = function(h) {
        return n.$data.assignmentsStore.exists(h);
      }), u.isExist.call(n, l) && u.delete.call(n, l);
    }), this.handleResourceCRUD(e, n), this.handleResourceAssignmentCRUD(e, n), this.handleBaselineCRUD(e, n);
  }
  clientSideDelete(e, n, i) {
    const a = n.updatedRows.slice();
    let r = !1;
    i.getUserData(e, "!nativeeditor_status", n._ganttMode) === "true_deleted" && (r = !0, n.setUpdated(e, !1));
    for (let s = 0; s < a.length && !n._in_progress[e]; s++) a[s] === e && (i.getUserData(e, "!nativeeditor_status", n._ganttMode) === "inserted" && (r = !0), n.setUpdated(e, !1));
    return r;
  }
  handleResourceAssignmentCRUD(e, n) {
    if (!n.config.resources || n.config.resources.dataprocessor_assignments !== !0) return;
    const i = n.getDatastore(n.config.resource_assignment_store), a = {}, r = {};
    function s(o) {
      const l = o.id;
      i.exists(l) && (e.setGanttMode("assignment"), e.setUpdated(l, !0, "inserted")), delete r[l];
    }
    n.attachEvent("onBeforeTaskAdd", function(o, l) {
      return a[o] = !0, !0;
    }), n.attachEvent("onTaskIdChange", function(o, l) {
      delete a[o];
    }), i.attachEvent("onAfterAdd", (o, l) => {
      a[l.task_id] ? function(c) {
        r[c.id] = c, a[c.task_id] = !0;
      }(l) : s(l);
    }), i.attachEvent("onAfterUpdate", (o, l) => {
      i.exists(o) && (r[o] ? s(l) : (e.setGanttMode("assignment"), e.setUpdated(o, !0)));
    }), i.attachEvent("onAfterDelete", (o, l) => {
      e.setGanttMode("assignment"), !this.clientSideDelete(o, e, n) && (e.storeItem(l), e.setUpdated(o, !0, "deleted"));
    });
  }
  handleResourceCRUD(e, n) {
    if (!n.config.resources || n.config.resources.dataprocessor_resources !== !0) return;
    const i = n.getDatastore(n.config.resource_store);
    i.attachEvent("onAfterAdd", (a, r) => {
      (function(s) {
        const o = s.id;
        i.exists(o) && (e.setGanttMode("resource"), e.setUpdated(o, !0, "inserted"));
      })(r);
    }), i.attachEvent("onAfterUpdate", (a, r) => {
      i.exists(a) && (e.setGanttMode("resource"), e.setUpdated(a, !0));
    }), i.attachEvent("onAfterDelete", (a, r) => {
      e.setGanttMode("resource"), !this.clientSideDelete(a, e, n) && (e.storeItem(r), e.setUpdated(a, !0, "deleted"));
    });
  }
  handleBaselineCRUD(e, n) {
    if (!n.config.baselines || n.config.baselines.dataprocessor_baselines !== !0) return;
    const i = n.getDatastore(n.config.baselines.datastore);
    i.attachEvent("onAfterAdd", (a, r) => {
      (function(s) {
        const o = s.id;
        i.exists(o) && (e.setGanttMode("baseline"), e.setUpdated(o, !0, "inserted"));
      })(r);
    }), i.attachEvent("onAfterUpdate", (a, r) => {
      i.exists(a) && (e.setGanttMode("baseline"), e.setUpdated(a, !0));
    }), i.attachEvent("onAfterDelete", (a, r) => {
      e.setGanttMode("baseline"), !this.clientSideDelete(a, e, n) && (e.storeItem(r), e.setUpdated(a, !0, "deleted"));
    });
  }
  detach() {
    kt(this._dataProcessorHandlers, (e) => {
      this.$gantt.detachEvent(e);
    }), this._dataProcessorHandlers = [];
  }
}
const Xt = class Xt {
  constructor() {
    this.clear = () => {
      this._storage = {};
    }, this.storeItem = (e) => {
      this._storage[e.id] = q(e);
    }, this.getStoredItem = (e) => this._storage[e] || null, this._storage = {};
  }
};
Xt.create = () => new Xt();
let Jt = Xt, un = class {
  constructor(t) {
    this.serverProcessor = t, this.action_param = "!nativeeditor_status", this.updatedRows = [], this.autoUpdate = !0, this.updateMode = "cell", this._headers = null, this._payload = null, this._postDelim = "_", this._routerParametersFormat = "parameters", this._waitMode = 0, this._in_progress = {}, this._storage = Jt.create(), this._invalid = {}, this.messages = [], this.styles = { updated: "font-weight:bold;", inserted: "font-weight:bold;", deleted: "text-decoration : line-through;", invalid: "background-color:FFE0E0;", invalid_cell: "border-bottom:2px solid red;", error: "color:red;", clear: "font-weight:normal;text-decoration:none;" }, this.enableUTFencoding(!0), ot(this);
  }
  setTransactionMode(t, e) {
    typeof t == "object" ? (this._tMode = t.mode || this._tMode, W(t.headers) && (this._headers = t.headers), W(t.payload) && (this._payload = t.payload), this._tSend = !!e) : (this._tMode = t, this._tSend = e), this._tMode === "REST" && (this._tSend = !1), this._tMode === "JSON" || this._tMode === "REST-JSON" ? (this._tSend = !1, this._serializeAsJson = !0, this._headers = this._headers || {}, this._headers["Content-Type"] = "application/json") : this._headers && !this._headers["Content-Type"] && (this._headers["Content-Type"] = "application/x-www-form-urlencoded"), this._tMode === "CUSTOM" && (this._tSend = !1, this._router = t.router);
  }
  escape(t) {
    return this._utf ? encodeURIComponent(t) : escape(t);
  }
  enableUTFencoding(t) {
    this._utf = !!t;
  }
  getSyncState() {
    return !this.updatedRows.length;
  }
  setUpdateMode(t, e) {
    this.autoUpdate = t === "cell", this.updateMode = t, this.dnd = e;
  }
  ignore(t, e) {
    this._silent_mode = !0, t.call(e || Z), this._silent_mode = !1;
  }
  setUpdated(t, e, n) {
    if (this._silent_mode) return;
    const i = this.findRow(t);
    n = n || "updated";
    const a = this.$gantt.getUserData(t, this.action_param, this._ganttMode);
    a && n === "updated" && (n = a), e ? (this.set_invalid(t, !1), this.updatedRows[i] = t, this.$gantt.setUserData(t, this.action_param, n, this._ganttMode), this._in_progress[t] && (this._in_progress[t] = "wait")) : this.is_invalid(t) || (this.updatedRows.splice(i, 1), this.$gantt.setUserData(t, this.action_param, "", this._ganttMode)), this.markRow(t, e, n), e && this.autoUpdate && this.sendData(t);
  }
  markRow(t, e, n) {
    let i = "";
    const a = this.is_invalid(t);
    if (a && (i = this.styles[a], e = !0), this.callEvent("onRowMark", [t, e, n, a]) && (i = this.styles[e ? n : "clear"] + " " + i, this.$gantt[this._methods[0]](t, i), a && a.details)) {
      i += this.styles[a + "_cell"];
      for (let r = 0; r < a.details.length; r++) a.details[r] && this.$gantt[this._methods[1]](t, r, i);
    }
  }
  getActionByState(t) {
    return t === "inserted" ? "create" : t === "updated" ? "update" : t === "deleted" ? "delete" : "update";
  }
  getState(t) {
    return this.$gantt.getUserData(t, this.action_param, this._ganttMode);
  }
  is_invalid(t) {
    return this._invalid[t];
  }
  set_invalid(t, e, n) {
    n && (e = { value: e, details: n, toString: function() {
      return this.value.toString();
    } }), this._invalid[t] = e;
  }
  checkBeforeUpdate(t) {
    return !0;
  }
  sendData(t) {
    if (this.$gantt.editStop && this.$gantt.editStop(), t === void 0 || this._tSend) {
      const e = [];
      if (this.modes && ["task", "link", "assignment", "baseline"].forEach((n) => {
        this.modes[n] && this.modes[n].updatedRows.length && e.push(n);
      }), e.length) {
        for (let n = 0; n < e.length; n++) this.setGanttMode(e[n]), this.sendAllData();
        return;
      }
      return this.sendAllData();
    }
    return !this._in_progress[t] && (this.messages = [], !(!this.checkBeforeUpdate(t) && this.callEvent("onValidationError", [t, this.messages])) && void this._beforeSendData(this._getRowData(t), t));
  }
  serialize(t, e) {
    if (this._serializeAsJson) return this._serializeAsJSON(t);
    if (typeof t == "string") return t;
    if (e !== void 0) return this.serialize_one(t, "");
    {
      const n = [], i = [];
      for (const a in t) t.hasOwnProperty(a) && (n.push(this.serialize_one(t[a], a + this._postDelim)), i.push(a));
      return n.push("ids=" + this.escape(i.join(","))), this.$gantt.security_key && n.push("dhx_security=" + this.$gantt.security_key), n.join("&");
    }
  }
  serialize_one(t, e) {
    if (typeof t == "string") return t;
    const n = [];
    let i = "";
    for (const a in t) if (t.hasOwnProperty(a)) {
      if ((a === "id" || a == this.action_param) && this._tMode === "REST") continue;
      i = typeof t[a] == "string" || typeof t[a] == "number" ? String(t[a]) : JSON.stringify(t[a]), n.push(this.escape((e || "") + a) + "=" + this.escape(i));
    }
    return n.join("&");
  }
  sendAllData() {
    if (!this.updatedRows.length) return;
    this.messages = [];
    let t = !0;
    if (this._forEachUpdatedRow(function(e) {
      t = t && this.checkBeforeUpdate(e);
    }), !t && !this.callEvent("onValidationError", ["", this.messages])) return !1;
    this._tSend ? this._sendData(this._getAllData()) : this._forEachUpdatedRow(function(e) {
      if (!this._in_progress[e]) {
        if (this.is_invalid(e)) return;
        this._beforeSendData(this._getRowData(e), e);
      }
    });
  }
  findRow(t) {
    let e = 0;
    for (e = 0; e < this.updatedRows.length && t != this.updatedRows[e]; e++) ;
    return e;
  }
  defineAction(t, e) {
    this._uActions || (this._uActions = {}), this._uActions[t] = e;
  }
  afterUpdateCallback(t, e, n, i, a) {
    if (!this.$gantt) return;
    this.setGanttMode(a);
    const r = t, s = n !== "error" && n !== "invalid";
    if (s || this.set_invalid(t, n), this._uActions && this._uActions[n] && !this._uActions[n](i)) return delete this._in_progress[r];
    this._in_progress[r] !== "wait" && this.setUpdated(t, !1);
    const o = t;
    switch (n) {
      case "inserted":
      case "insert":
        e != t && (this.setUpdated(t, !1), this.$gantt[this._methods[2]](t, e), t = e);
        break;
      case "delete":
      case "deleted":
        if (this.deleteAfterConfirmation && this._ganttMode === "task") {
          if (this._ganttMode === "task" && this.$gantt.isTaskExists(t)) {
            this.$gantt.setUserData(t, this.action_param, "true_deleted", this._ganttMode);
            const l = this.$gantt.getTask(t);
            this.$gantt.silent(() => {
              this.$gantt.deleteTask(t);
            }), this.$gantt.callEvent("onAfterTaskDelete", [t, l]), this.$gantt.render(), delete this._in_progress[r];
          }
          return this.callEvent("onAfterUpdate", [t, n, e, i]);
        }
        return this.$gantt.setUserData(t, this.action_param, "true_deleted", this._ganttMode), this.$gantt[this._methods[3]](t), delete this._in_progress[r], this.callEvent("onAfterUpdate", [t, n, e, i]);
    }
    this._in_progress[r] !== "wait" ? (s && this.$gantt.setUserData(t, this.action_param, "", this._ganttMode), delete this._in_progress[r]) : (delete this._in_progress[r], this.setUpdated(e, !0, this.$gantt.getUserData(t, this.action_param, this._ganttMode))), this.callEvent("onAfterUpdate", [o, n, e, i]);
  }
  afterUpdate(t, e, n) {
    let i;
    i = arguments.length === 3 ? arguments[1] : arguments[4];
    let a = this.getGanttMode();
    const r = i.filePath || i.url;
    a = this._tMode !== "REST" && this._tMode !== "REST-JSON" ? r.indexOf("gantt_mode=links") !== -1 ? "link" : r.indexOf("gantt_mode=assignments") !== -1 ? "assignment" : r.indexOf("gantt_mode=baselines") !== -1 ? "baseline" : "task" : r.indexOf("/link") >= 0 ? "link" : r.indexOf("/assignment") >= 0 ? "assignment" : r.indexOf("/baseline") >= 0 ? "baseline" : "task", this.setGanttMode(a);
    const s = this.$gantt.ajax;
    let o;
    try {
      o = JSON.parse(e.xmlDoc.responseText);
    } catch {
      e.xmlDoc.responseText.length || (o = {});
    }
    const l = (u) => {
      const h = o.action || this.getState(u) || "updated", _ = o.sid || u[0], p = o.tid || u[0];
      t.afterUpdateCallback(_, p, h, o, a);
    };
    if (o) return Array.isArray(n) && n.length > 1 ? n.forEach((u) => l(u)) : l(n), t.finalizeUpdate(), void this.setGanttMode(a);
    const c = s.xmltop("data", e.xmlDoc);
    if (!c) return this.cleanUpdate(n);
    const d = s.xpath("//data/action", c);
    if (!d.length) return this.cleanUpdate(n);
    for (let u = 0; u < d.length; u++) {
      const h = d[u], _ = h.getAttribute("type"), p = h.getAttribute("sid"), y = h.getAttribute("tid");
      t.afterUpdateCallback(p, y, _, h, a);
    }
    t.finalizeUpdate();
  }
  cleanUpdate(t) {
    if (t) for (let e = 0; e < t.length; e++) delete this._in_progress[t[e]];
  }
  finalizeUpdate() {
    this._waitMode && this._waitMode--, this.callEvent("onAfterUpdateFinish", []), this.updatedRows.length || this.callEvent("onFullSync", []);
  }
  init(t) {
    if (this._initialized) return;
    this.$gantt = t, this.$gantt._dp_init && this.$gantt._dp_init(this), this._setDefaultTransactionMode(), this.styles = { updated: "gantt_updated", order: "gantt_updated", inserted: "gantt_inserted", deleted: "gantt_deleted", delete_confirmation: "gantt_deleted", invalid: "gantt_invalid", error: "gantt_error", clear: "" }, this._methods = ["_row_style", "setCellTextStyle", "_change_id", "_delete_task"], function(n, i) {
      n.getUserData = function(a, r, s) {
        return this.userdata || (this.userdata = {}), this.userdata[s] = this.userdata[s] || {}, this.userdata[s][a] && this.userdata[s][a][r] ? this.userdata[s][a][r] : "";
      }, n.setUserData = function(a, r, s, o) {
        this.userdata || (this.userdata = {}), this.userdata[o] = this.userdata[o] || {}, this.userdata[o][a] = this.userdata[o][a] || {}, this.userdata[o][a][r] = s;
      }, n._change_id = function(a, r) {
        switch (this._dp._ganttMode) {
          case "task":
            this.changeTaskId(a, r);
            break;
          case "link":
            this.changeLinkId(a, r);
            break;
          case "assignment":
            this.$data.assignmentsStore.changeId(a, r);
            break;
          case "resource":
            this.$data.resourcesStore.changeId(a, r);
            break;
          case "baseline":
            this.$data.baselineStore.changeId(a, r);
            break;
          default:
            throw new Error(`Invalid mode of the dataProcessor after database id is received: ${this._dp._ganttMode}, new id: ${r}`);
        }
      }, n._row_style = function(a, r) {
        this._dp._ganttMode === "task" && n.isTaskExists(a) && (n.getTask(a).$dataprocessor_class = r, n.refreshTask(a));
      }, n._delete_task = function(a, r) {
      }, n._sendTaskOrder = function(a, r) {
        r.$drop_target && (this._dp.setGanttMode("task"), this.getTask(a).target = r.$drop_target, this._dp.setUpdated(a, !0, "order"), delete this.getTask(a).$drop_target);
      }, n.setDp = function() {
        this._dp = i;
      }, n.setDp();
    }(this.$gantt, this);
    const e = new ei(this.$gantt, this);
    e.attach(), this.attachEvent("onDestroy", function() {
      delete this.setGanttMode, delete this._getRowData, delete this.$gantt._dp, delete this.$gantt._change_id, delete this.$gantt._row_style, delete this.$gantt._delete_task, delete this.$gantt._sendTaskOrder, delete this.$gantt, e.detach();
    }), this.$gantt.callEvent("onDataProcessorReady", [this]), this._initialized = !0;
  }
  setOnAfterUpdate(t) {
    this.attachEvent("onAfterUpdate", t);
  }
  setOnBeforeUpdateHandler(t) {
    this.attachEvent("onBeforeDataSending", t);
  }
  setAutoUpdate(t, e) {
    t = t || 2e3, this._user = e || (/* @__PURE__ */ new Date()).valueOf(), this._needUpdate = !1, this._updateBusy = !1, this.attachEvent("onAfterUpdate", this.afterAutoUpdate), this.attachEvent("onFullSync", this.fullSync), setInterval(() => {
      this.loadUpdate();
    }, t);
  }
  afterAutoUpdate(t, e, n, i) {
    return e !== "collision" || (this._needUpdate = !0, !1);
  }
  fullSync() {
    return this._needUpdate && (this._needUpdate = !1, this.loadUpdate()), !0;
  }
  getUpdates(t, e) {
    const n = this.$gantt.ajax;
    if (this._updateBusy) return !1;
    this._updateBusy = !0, n.get(t, e);
  }
  loadUpdate() {
    const t = this.$gantt.ajax, e = this.$gantt.getUserData(0, "version", this._ganttMode);
    let n = this.serverProcessor + t.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + e].join("&");
    n = n.replace("editing=true&", ""), this.getUpdates(n, (i) => {
      const a = t.xpath("//userdata", i);
      this.$gantt.setUserData(0, "version", this._getXmlNodeValue(a[0]), this._ganttMode);
      const r = t.xpath("//update", i);
      if (r.length) {
        this._silent_mode = !0;
        for (let s = 0; s < r.length; s++) {
          const o = r[s].getAttribute("status"), l = r[s].getAttribute("id"), c = r[s].getAttribute("parent");
          switch (o) {
            case "inserted":
              this.callEvent("insertCallback", [r[s], l, c]);
              break;
            case "updated":
              this.callEvent("updateCallback", [r[s], l, c]);
              break;
            case "deleted":
              this.callEvent("deleteCallback", [r[s], l, c]);
          }
        }
        this._silent_mode = !1;
      }
      this._updateBusy = !1;
    });
  }
  destructor() {
    this.callEvent("onDestroy", []), this.detachAllEvents(), this.updatedRows = [], this._in_progress = {}, this._invalid = {}, this._storage.clear(), this._storage = null, this._headers = null, this._payload = null, delete this._initialized;
  }
  setGanttMode(t) {
    t === "tasks" ? t = "task" : t === "links" && (t = "link");
    const e = this.modes || {}, n = this.getGanttMode();
    n && (e[n] = { _in_progress: this._in_progress, _invalid: this._invalid, _storage: this._storage, updatedRows: this.updatedRows });
    let i = e[t];
    i || (i = e[t] = { _in_progress: {}, _invalid: {}, _storage: Jt.create(), updatedRows: [] }), this._in_progress = i._in_progress, this._invalid = i._invalid, this._storage = i._storage, this.updatedRows = i.updatedRows, this.modes = e, this._ganttMode = t;
  }
  getGanttMode() {
    return this._ganttMode;
  }
  storeItem(t) {
    this._storage.storeItem(t);
  }
  url(t) {
    this.serverProcessor = this._serverProcessor = t;
  }
  _beforeSendData(t, e) {
    if (!this.callEvent("onBeforeUpdate", [e, this.getState(e), t])) return !1;
    this._sendData(t, e);
  }
  _serializeAsJSON(t) {
    if (typeof t == "string") return t;
    const e = q(t);
    return this._tMode === "REST-JSON" && (delete e.id, delete e[this.action_param]), JSON.stringify(e);
  }
  _applyPayload(t) {
    const e = this.$gantt.ajax;
    if (this._payload) for (const n in this._payload) t = t + e.urlSeparator(t) + this.escape(n) + "=" + this.escape(this._payload[n]);
    return t;
  }
  _cleanupArgumentsBeforeSend(t) {
    let e;
    if (t[this.action_param] === void 0) {
      e = {};
      for (const n in t) e[n] = this._cleanupArgumentsBeforeSend(t[n]);
    } else e = this._cleanupItemBeforeSend(t);
    return e;
  }
  _cleanupItemBeforeSend(t) {
    let e = null;
    return t && (t[this.action_param] === "deleted" ? (e = {}, e.id = t.id, e[this.action_param] = t[this.action_param]) : e = t), e;
  }
  _sendData(t, e) {
    if (!t) return;
    if (!this.callEvent("onBeforeDataSending", e ? [e, this.getState(e), t] : [null, null, t])) return !1;
    e && (this._in_progress[e] = (/* @__PURE__ */ new Date()).valueOf());
    const n = this.$gantt.ajax;
    if (this._tMode === "CUSTOM") {
      const l = this.getState(e), c = this.getActionByState(l);
      delete t[this.action_param];
      const d = this.getGanttMode(), u = (_) => {
        let p = l || "updated", y = e, k = e;
        _ && (p = _.action || l, y = _.sid || y, k = _.id || _.tid || k), this.afterUpdateCallback(y, k, p, _, d);
      };
      let h;
      if (this._router instanceof Function) if (this._routerParametersFormat === "object") {
        const _ = { entity: d, action: c, data: t, id: e };
        h = this._router(_);
      } else h = this._router(d, c, t, e);
      else if (this._router[d] instanceof Function) h = this._router[d](c, t, e);
      else {
        const _ = "Incorrect configuration of gantt.createDataProcessor", p = `
You need to either add missing properties to the dataProcessor router object or to use a router function.
See https://docs.dhtmlx.com/gantt/desktop__server_side.html#customrouting and https://docs.dhtmlx.com/gantt/api__gantt_createdataprocessor.html for details.`;
        if (!this._router[d]) throw new Error(`${_}: router for the **${d}** entity is not defined. ${p}`);
        switch (l) {
          case "inserted":
            if (!this._router[d].create) throw new Error(`${_}: **create** action for the **${d}** entity is not defined. ${p}`);
            h = this._router[d].create(t);
            break;
          case "deleted":
            if (!this._router[d].delete) throw new Error(`${_}: **delete** action for the **${d}** entity is not defined. ${p}`);
            h = this._router[d].delete(e);
            break;
          default:
            if (!this._router[d].update) throw new Error(`${_}: **update**" action for the **${d}** entity is not defined. ${p}`);
            h = this._router[d].update(t, e);
        }
      }
      if (h) {
        if (!h.then && h.id === void 0 && h.tid === void 0 && h.action === void 0) throw new Error("Incorrect router return value. A Promise or a response object is expected");
        h.then ? h.then(u).catch((_) => {
          _ && _.action ? u(_) : u({ action: "error", value: _ });
        }) : u(h);
      } else u(null);
      return;
    }
    let i;
    i = { callback: (l) => {
      const c = [];
      if (e) c.push(e);
      else if (t) for (const d in t) c.push(d);
      return this.afterUpdate(this, l, c);
    }, headers: this._headers };
    const a = "dhx_version=" + this.$gantt.getUserData(0, "version", this._ganttMode), r = this.serverProcessor + (this._user ? n.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, a].join("&") : "");
    let s, o = this._applyPayload(r);
    switch (this._tMode) {
      case "GET":
        s = this._cleanupArgumentsBeforeSend(t), i.url = o + n.urlSeparator(o) + this.serialize(s, e), i.method = "GET";
        break;
      case "POST":
        s = this._cleanupArgumentsBeforeSend(t), i.url = o, i.method = "POST", i.data = this.serialize(s, e);
        break;
      case "JSON":
        s = {};
        const l = this._cleanupItemBeforeSend(t);
        for (const c in l) c !== this.action_param && c !== "id" && c !== "gr_id" && (s[c] = l[c]);
        i.url = o, i.method = "POST", i.data = JSON.stringify({ id: e, action: t[this.action_param], data: s });
        break;
      case "REST":
      case "REST-JSON":
        switch (o = r.replace(/(&|\?)editing=true/, ""), s = "", this.getState(e)) {
          case "inserted":
            i.method = "POST", i.data = this.serialize(t, e);
            break;
          case "deleted":
            i.method = "DELETE", o = o + (o.slice(-1) === "/" ? "" : "/") + e;
            break;
          default:
            i.method = "PUT", i.data = this.serialize(t, e), o = o + (o.slice(-1) === "/" ? "" : "/") + e;
        }
        i.url = this._applyPayload(o);
    }
    return this._waitMode++, n.query(i);
  }
  _forEachUpdatedRow(t) {
    const e = this.updatedRows.slice();
    for (let n = 0; n < e.length; n++) {
      const i = e[n];
      this.$gantt.getUserData(i, this.action_param, this._ganttMode) && t.call(this, i);
    }
  }
  _setDefaultTransactionMode() {
    this.serverProcessor && (this.setTransactionMode("POST", !0), this.serverProcessor += (this.serverProcessor.indexOf("?") !== -1 ? "&" : "?") + "editing=true", this._serverProcessor = this.serverProcessor);
  }
  _getXmlNodeValue(t) {
    return t.firstChild ? t.firstChild.nodeValue : "";
  }
  _getAllData() {
    const t = {};
    let e = !1;
    return this._forEachUpdatedRow(function(n) {
      if (this._in_progress[n] || this.is_invalid(n)) return;
      const i = this._getRowData(n);
      this.callEvent("onBeforeUpdate", [n, this.getState(n), i]) && (t[n] = i, e = !0, this._in_progress[n] = (/* @__PURE__ */ new Date()).valueOf());
    }), e ? t : null;
  }
  _prepareDate(t) {
    return this.$gantt.defined(this.$gantt.templates.xml_format) ? this.$gantt.templates.xml_format(t) : this.$gantt.templates.format_date(t);
  }
  _prepareArray(t, e) {
    return e.push(t), t.map((n) => Q(n) ? this._prepareDate(n) : Array.isArray(n) && !zt(e, n) ? this._prepareArray(n, e) : n && typeof n == "object" && !zt(e, n) ? this._prepareObject(n, e) : n);
  }
  _prepareObject(t, e) {
    const n = {};
    e.push(t);
    for (const i in t) {
      if (i.substr(0, 1) === "$") continue;
      const a = t[i];
      Q(a) ? n[i] = this._prepareDate(a) : a === null ? n[i] = "" : Array.isArray(a) && !zt(e, a) ? n[i] = this._prepareArray(a, e) : a && typeof a == "object" && !zt(e, a) ? n[i] = this._prepareObject(a, e) : n[i] = a;
    }
    return n;
  }
  _prepareDataItem(t) {
    const e = this._prepareObject(t, []);
    return e[this.action_param] = this.$gantt.getUserData(t.id, this.action_param, this._ganttMode), e;
  }
  getStoredItem(t) {
    return this._storage.getStoredItem(t);
  }
  _getRowData(t) {
    let e;
    const n = this.$gantt;
    return this.getGanttMode() === "task" ? n.isTaskExists(t) && (e = this.$gantt.getTask(t)) : this.getGanttMode() === "assignment" ? this.$gantt.$data.assignmentsStore.exists(t) && (e = this.$gantt.$data.assignmentsStore.getItem(t)) : this.getGanttMode() === "baseline" ? this.$gantt.$data.baselineStore.exists(t) && (e = this.$gantt.$data.baselineStore.getItem(t)) : n.isLinkExists(t) && (e = this.$gantt.getLink(t)), e || (e = this.getStoredItem(t)), e || (e = { id: t }), this._prepareDataItem(e);
  }
};
const ni = function(t) {
  return new un(t);
}, ii = function(t) {
  let e, n, i;
  t instanceof Function ? e = t : t.hasOwnProperty("router") ? e = t.router : t.hasOwnProperty("assignment") || t.hasOwnProperty("baseline") || t.hasOwnProperty("link") || t.hasOwnProperty("task") ? e = t : t.hasOwnProperty("headers") && (i = t.headers), n = e ? "CUSTOM" : t.mode || "REST-JSON";
  const a = new un(t.url);
  return a.init(this), a.setTransactionMode({ mode: n, router: e, headers: i }, t.batchUpdate), t.deleteAfterConfirmation && (a.deleteAfterConfirmation = t.deleteAfterConfirmation), a;
};
function ai(t) {
  var e = {}, n = !1;
  function i(l, c) {
    c = typeof c == "function" ? c : function() {
    }, e[l] || (e[l] = this[l], this[l] = c);
  }
  function a(l) {
    e[l] && (this[l] = e[l], e[l] = null);
  }
  function r(l) {
    for (var c in l) i.call(this, c, l[c]);
  }
  function s() {
    for (var l in e) a.call(this, l);
  }
  function o(l) {
    try {
      l();
    } catch (c) {
      Z.console.error(c);
    }
  }
  return t.$services.getService("state").registerProvider("batchUpdate", function() {
    return { batch_update: n };
  }, !1), function(l, c) {
    if (n) o(l);
    else {
      var d, u = this._dp && this._dp.updateMode != "off";
      u && (d = this._dp.updateMode, this._dp.setUpdateMode("off"));
      var h = {}, _ = { render: !0, refreshData: !0, refreshTask: !0, refreshLink: !0, resetProjectDates: function(y) {
        h[y.id] = y;
      } };
      for (var p in r.call(this, _), n = !0, this.callEvent("onBeforeBatchUpdate", []), o(l), this.callEvent("onAfterBatchUpdate", []), s.call(this), h) this.resetProjectDates(h[p]);
      n = !1, c || this.render(), u && (this._dp.setUpdateMode(d), this._dp.setGanttMode("task"), this._dp.sendData(), this._dp.setGanttMode("link"), this._dp.sendData());
    }
  };
}
function ri(t) {
  t.batchUpdate = ai(t);
}
function si(t) {
  const e = /* @__PURE__ */ function(i) {
    return { _needRecalc: !0, reset: function() {
      this._needRecalc = !0;
    }, _isRecalcNeeded: function() {
      return !this._isGroupSort() && this._needRecalc;
    }, _isGroupSort: function() {
      return !!i.getState().group_mode;
    }, _getWBSCode: function(a) {
      return a ? (this._isRecalcNeeded() && this._calcWBS(), a.$virtual ? "" : this._isGroupSort() ? a.$wbs || "" : (a.$wbs || (this.reset(), this._calcWBS()), a.$wbs)) : "";
    }, _setWBSCode: function(a, r) {
      a.$wbs = r;
    }, getWBSCode: function(a) {
      return this._getWBSCode(a);
    }, getByWBSCode: function(a) {
      let r = a.split("."), s = i.config.root_id;
      for (let o = 0; o < r.length; o++) {
        const l = i.getChildren(s);
        let c = 1 * r[o] - 1;
        if (!i.isTaskExists(l[c])) return null;
        s = l[c];
      }
      return i.isTaskExists(s) ? i.getTask(s) : null;
    }, _calcWBS: function() {
      if (!this._isRecalcNeeded()) return;
      let a = !0;
      i.eachTask(function(r) {
        if (r.type == i.config.types.placeholder) return;
        if (a) return a = !1, void this._setWBSCode(r, "1");
        const s = this._getPrevNonPlaceholderSibling(r.id);
        if (s !== null) this._increaseWBS(r, s);
        else {
          let o = i.getParent(r.id);
          this._setWBSCode(r, i.getTask(o).$wbs + ".1");
        }
      }, i.config.root_id, this), this._needRecalc = !1;
    }, _increaseWBS: function(a, r) {
      let s = i.getTask(r).$wbs;
      s && (s = s.split("."), s[s.length - 1]++, this._setWBSCode(a, s.join(".")));
    }, _getPrevNonPlaceholderSibling: function(a) {
      let r, s = a;
      do
        r = i.getPrevSibling(s), s = r;
      while (r !== null && i.getTask(r).type == i.config.types.placeholder);
      return r;
    } };
  }(t);
  function n() {
    return e.reset(), !0;
  }
  t.getWBSCode = function(i) {
    return e.getWBSCode(i);
  }, t.getTaskByWBSCode = function(i) {
    return e.getByWBSCode(i);
  }, t.attachEvent("onAfterTaskMove", n), t.attachEvent("onBeforeParse", n), t.attachEvent("onAfterTaskDelete", n), t.attachEvent("onAfterTaskAdd", n), t.attachEvent("onAfterSort", n);
}
function oi(t) {
  var e = {}, n = !1;
  t.$data.tasksStore.attachEvent("onStoreUpdated", function() {
    e = {}, n = !1;
  }), t.attachEvent("onBeforeGanttRender", function() {
    e = {};
  });
  var i = String(Math.random());
  function a(l) {
    return l === null ? i + String(l) : String(l);
  }
  function r(l, c, d) {
    return Array.isArray(l) ? l.map(function(u) {
      return a(u);
    }).join("_") + `_${c}_${d}` : a(l) + `_${c}_${d}`;
  }
  function s(l, c, d) {
    var u, h = r(c, l, JSON.stringify(d)), _ = {};
    return kt(c, function(p) {
      _[a(p)] = !0;
    }), e[h] ? u = e[h] : (u = e[h] = [], t.eachTask(function(p) {
      if (d) {
        if (!d[t.getTaskType(p)]) return;
      } else if (p.type == t.config.types.project) return;
      l in p && kt(fe(p[l]) ? p[l] : [p[l]], function(y) {
        var k = y && y.resource_id ? y.resource_id : y;
        if (_[a(k)]) u.push(p);
        else if (!n) {
          var b = r(y, l);
          e[b] || (e[b] = []), e[b].push(p);
        }
      });
    }), n = !0), u;
  }
  function o(l, c, d) {
    var u = t.config.resource_property, h = [];
    if (t.getDatastore("task").exists(c)) {
      var _ = t.getTask(c);
      h = _[u] || [];
    }
    Array.isArray(h) || (h = [h]);
    for (var p = 0; p < h.length; p++) h[p].resource_id == l && d.push({ task_id: _.id, resource_id: h[p].resource_id, value: h[p].value });
  }
  return { getTaskBy: function(l, c, d) {
    return typeof l == "function" ? (u = l, h = [], t.eachTask(function(_) {
      u(_) && h.push(_);
    }), h) : fe(c) ? s(l, c, d) : s(l, [c], d);
    var u, h;
  }, getResourceAssignments: function(l, c) {
    var d = [], u = t.config.resource_property;
    return c !== void 0 ? o(l, c, d) : t.getTaskBy(u, l).forEach(function(h) {
      o(l, h.id, d);
    }), d;
  } };
}
function li(t) {
  var e = oi(t);
  t.ext.resources = /* @__PURE__ */ function(a) {
    const r = { renderEditableLabel: function(s, o, l, c, d) {
      const u = a.config.readonly ? "" : "contenteditable";
      if (s < l.end_date && o > l.start_date) {
        for (let h = 0; h < d.length; h++) {
          const _ = d[h];
          return "<div " + u + " data-assignment-cell data-assignment-id='" + _.id + "' data-row-id='" + l.id + "' data-task='" + l.$task_id + "' data-start-date='" + a.templates.format_date(s) + "' data-end-date='" + a.templates.format_date(o) + "'>" + _.value + "</div>";
        }
        return "<div " + u + " data-assignment-cell data-empty  data-row-id='" + l.id + "' data-resource-id='" + l.$resource_id + "' data-task='" + l.$task_id + "' data-start-date='" + a.templates.format_date(s) + "''  data-end-date='" + a.templates.format_date(o) + "'>-</div>";
      }
      return "";
    }, renderSummaryLabel: function(s, o, l, c, d) {
      let u = d.reduce(function(h, _) {
        return h + Number(_.value);
      }, 0);
      return u % 1 && (u = Math.round(10 * u) / 10), u ? "<div>" + u + "</div>" : "";
    }, editableResourceCellTemplate: function(s, o, l, c, d) {
      return l.$role === "task" ? r.renderEditableLabel(s, o, l, c, d) : r.renderSummaryLabel(s, o, l, c, d);
    }, editableResourceCellClass: function(s, o, l, c, d) {
      const u = [];
      u.push("resource_marker"), l.$role === "task" ? u.push("task_cell") : u.push("resource_cell");
      const h = d.reduce(function(p, y) {
        return p + Number(y.value);
      }, 0);
      let _ = Number(l.capacity);
      return isNaN(_) && (_ = 8), h <= _ ? u.push("workday_ok") : u.push("workday_over"), u.join(" ");
    }, getSummaryResourceAssignments: function(s) {
      let o;
      const l = a.getDatastore(a.config.resource_store), c = l.getItem(s);
      return c.$role === "task" ? o = a.getResourceAssignments(c.$resource_id, c.$task_id) : (o = a.getResourceAssignments(s), l.eachItem && l.eachItem(function(d) {
        d.$role !== "task" && (o = o.concat(a.getResourceAssignments(d.id)));
      }, s)), o;
    }, initEditableDiagram: function() {
      a.config.resource_render_empty_cells = !0, function() {
        let l = null;
        function c() {
          return l && cancelAnimationFrame(l), l = requestAnimationFrame(function() {
            a.$container && Array.prototype.slice.call(a.$container.querySelectorAll(".resourceTimeline_cell [data-assignment-cell]")).forEach(function(d) {
              d.contentEditable = !0;
            });
          }), !0;
        }
        a.attachEvent("onGanttReady", function() {
          a.getDatastore(a.config.resource_assignment_store).attachEvent("onStoreUpdated", c), a.getDatastore(a.config.resource_store).attachEvent("onStoreUpdated", c);
        }, { once: !0 }), a.attachEvent("onGanttLayoutReady", function() {
          a.$layout.getCellsByType("viewCell").forEach(function(d) {
            d.$config && d.$config.view === "resourceTimeline" && d.$content && d.$content.attachEvent("onScroll", c);
          });
        });
      }();
      let s = null;
      function o() {
        setTimeout(function() {
          const l = Lt(a.$container);
          s > -1 && l[s + 1].focus();
        }, 300);
      }
      a.attachEvent("onGanttReady", function() {
        let l = !1;
        a.event(a.$container, "keypress", function(c) {
          var d = c.target.closest(".resourceTimeline_cell [data-assignment-cell]");
          d && (c.keyCode !== 13 && c.keyCode !== 27 || d.blur());
        }), a.event(a.$container, "keydown", function(c) {
          c.key === "Tab" && (s = Lt(a.$container).indexOf(document.activeElement));
        }), a.event(a.$container, "focusout", function(c) {
          if (!l) {
            l = !0, setTimeout(function() {
              l = !1;
            }, 300);
            var d = c.target.closest(".resourceTimeline_cell [data-assignment-cell]");
            if (d) {
              var u = (d.innerText || "").trim();
              u == "-" && (u = "0");
              var h = Number(u), _ = d.getAttribute("data-row-id"), p = d.getAttribute("data-assignment-id"), y = d.getAttribute("data-task"), k = d.getAttribute("data-resource-id"), b = a.templates.parse_date(d.getAttribute("data-start-date")), g = a.templates.parse_date(d.getAttribute("data-end-date")), m = a.getDatastore(a.config.resource_assignment_store);
              if (isNaN(h)) a.getDatastore(a.config.resource_store).refresh(_);
              else {
                var f = a.getTask(y);
                if (a.plugins().undo && a.ext.undo.saveState(y, "task"), p) {
                  if (h === (x = m.getItem(p)).value) return;
                  if (x.start_date.valueOf() === b.valueOf() && x.end_date.valueOf() === g.valueOf()) x.value = h, h ? m.updateItem(x.id) : m.removeItem(x.id);
                  else {
                    if (x.end_date.valueOf() > g.valueOf()) {
                      var v = a.copy(x);
                      v.id = a.uid(), v.start_date = g, v.duration = a.calculateDuration({ start_date: v.start_date, end_date: v.end_date, task: f }), v.delay = a.calculateDuration({ start_date: f.start_date, end_date: v.start_date, task: f }), v.mode = x.mode || "default", v.duration !== 0 && m.addItem(v);
                    }
                    x.start_date.valueOf() < b.valueOf() ? (x.end_date = b, x.duration = a.calculateDuration({ start_date: x.start_date, end_date: x.end_date, task: f }), x.mode = "fixedDuration", x.duration === 0 ? m.removeItem(x.id) : m.updateItem(x.id)) : m.removeItem(x.id), h && m.addItem({ task_id: x.task_id, resource_id: x.resource_id, value: h, start_date: b, end_date: g, duration: a.calculateDuration({ start_date: b, end_date: g, task: f }), delay: a.calculateDuration({ start_date: f.start_date, end_date: b, task: f }), mode: "fixedDuration" });
                  }
                  a.updateTaskAssignments(f.id), a.updateTask(f.id), o();
                } else if (h) {
                  var x = { task_id: y, resource_id: k, value: h, start_date: b, end_date: g, duration: a.calculateDuration({ start_date: b, end_date: g, task: f }), delay: a.calculateDuration({ start_date: f.start_date, end_date: b, task: f }), mode: "fixedDuration" };
                  m.addItem(x), a.updateTaskAssignments(f.id), a.updateTask(f.id), o();
                }
              }
            }
          }
        });
      }, { once: !0 });
    } };
    return r;
  }(t), t.config.resources = { dataprocessor_assignments: !1, dataprocessor_resources: !1, editable_resource_diagram: !1, resource_store: { type: "treeDataStore", fetchTasks: !1, initItem: function(a) {
    return a.parent = a.parent || t.config.root_id, a[t.config.resource_property] = a.parent, a.open = !0, a;
  } }, lightbox_resources: function(a) {
    const r = [], s = t.getDatastore(t.config.resource_store);
    return a.forEach(function(o) {
      if (!s.hasChild(o.id)) {
        const l = t.copy(o);
        l.key = o.id, l.label = o.text, r.push(l);
      }
    }), r;
  } }, t.attachEvent("onBeforeGanttReady", function() {
    if (t.getDatastore(t.config.resource_store)) return;
    const a = t.config.resources ? t.config.resources.resource_store : void 0;
    let r = a ? a.fetchTasks : void 0;
    t.config.resources && t.config.resources.editable_resource_diagram && (r = !0);
    let s = function(l) {
      return l.parent = l.parent || t.config.root_id, l[t.config.resource_property] = l.parent, l.open = !0, l;
    };
    a && a.initItem && (s = a.initItem);
    const o = a && a.type ? a.type : "treeDatastore";
    t.$resourcesStore = t.createDatastore({ name: t.config.resource_store, type: o, fetchTasks: r !== void 0 && r, initItem: s }), t.$data.resourcesStore = t.$resourcesStore, t.$resourcesStore.attachEvent("onParse", function() {
      let l, c = function(d) {
        const u = [];
        return d.forEach(function(h) {
          const _ = t.copy(h);
          _.key = h.id, _.label = h.text, u.push(_);
        }), u;
      };
      t.config.resources && t.config.resources.lightbox_resources && (c = t.config.resources.lightbox_resources), t.config.resources && t.config.resources.editable_resource_diagram ? l = c(t.$resourcesStore.getItems().filter((d) => {
        let u = t.getResourceAssignments(d.id);
        if (!t.$resourcesStore.hasChild(d.id) || u && u.length) return !d.$resource_id || !d.$task_id;
      })) : l = c(t.$resourcesStore.getItems()), t.updateCollection("resourceOptions", l);
    });
  }), t.getTaskBy = e.getTaskBy, t.getResourceAssignments = e.getResourceAssignments, t.config.resource_property = "owner_id", t.config.resource_store = "resource", t.config.resource_render_empty_cells = !1, t.templates.histogram_cell_class = function(a, r, s, o, l) {
  }, t.templates.histogram_cell_label = function(a, r, s, o, l) {
    return o.length + "/3";
  }, t.templates.histogram_cell_allocated = function(a, r, s, o, l) {
    return o.length / 3;
  }, t.templates.histogram_cell_capacity = function(a, r, s, o, l) {
    return 0;
  };
  const n = function(a, r, s, o, l) {
    return o.length <= 1 ? "gantt_resource_marker_ok" : "gantt_resource_marker_overtime";
  }, i = function(a, r, s, o, l) {
    return 8 * o.length;
  };
  t.templates.resource_cell_value = i, t.templates.resource_cell_class = n, t.attachEvent("onBeforeGanttReady", function() {
    t.config.resources && t.config.resources.editable_resource_diagram && (t.config.resource_render_empty_cells = !0, t.templates.resource_cell_value === i && (t.templates.resource_cell_value = t.ext.resources.editableResourceCellTemplate), t.templates.resource_cell_class === n && (t.templates.resource_cell_class = t.ext.resources.editableResourceCellClass), t.ext.resources.initEditableDiagram(t));
  });
}
function di(t) {
  var e = "$resourceAssignments";
  t.config.resource_assignment_store = "resourceAssignments", t.config.process_resource_assignments = !0;
  var n = "auto", i = "singleValue", a = "valueArray", r = "resourceValueArray", s = "assignmentsArray", o = n, l = "fixedDates", c = "fixedDuration", d = "default";
  function u(f, v) {
    f.start_date ? f.start_date = t.date.parseDate(f.start_date, "parse_date") : f.start_date = null, f.end_date ? f.end_date = t.date.parseDate(f.end_date, "parse_date") : f.end_date = null;
    var x = Number(f.delay), $ = !1;
    if (isNaN(x) ? (f.delay = 0, $ = !0) : f.delay = x, t.defined(f.value) || (f.value = null), !f.task_id || !f.resource_id) return !1;
    if (f.mode = f.mode || d, f.mode === c && (isNaN(Number(f.duration)) && (v = v || t.getTask(f.task_id), f.duration = t.calculateDuration({ start_date: f.start_date, end_date: f.end_date, id: v })), $ && (v = v || t.getTask(f.task_id), f.delay = t.calculateDuration({ start_date: v.start_date, end_date: f.start_date, id: v }))), f.mode !== l && (v || t.isTaskExists(f.task_id))) {
      var w = _(f, v = v || t.getTask(f.task_id));
      f.start_date = w.start_date, f.end_date = w.end_date, f.duration = w.duration;
    }
  }
  var h = t.createDatastore({ name: t.config.resource_assignment_store, initItem: function(f) {
    return f.id || (f.id = t.uid()), u(f), f;
  } });
  function _(f, v) {
    if (f.mode === l) return { start_date: f.start_date, end_date: f.end_date, duration: f.duration };
    var x, $, w = f.delay ? t.calculateEndDate({ start_date: v.start_date, duration: f.delay, task: v }) : new Date(v.start_date);
    return f.mode === c ? (x = t.calculateEndDate({ start_date: w, duration: f.duration, task: v }), $ = f.duration) : (x = new Date(v.end_date), $ = v.duration - f.delay), { start_date: w, end_date: x, duration: $ };
  }
  function p(f) {
    const v = t.config.resource_property;
    let x = f[v];
    const $ = [];
    let w = o === n;
    if (t.defined(x) && x) {
      Array.isArray(x) || (x = [x], w && (o = i, w = !1));
      const S = {};
      x.forEach(function(T) {
        T.resource_id || (T = { resource_id: T }, w && (o = a, w = !1)), w && (T.id && T.resource_id ? (o = s, w = !1) : (o = r, w = !1));
        let E, C = d;
        T.mode || (T.start_date && T.end_date || T.start_date && T.duration) && (C = c), E = T.id || !T.$id || S[T.$id] ? T.id && !S[T.id] ? T.id : t.uid() : T.$id, S[E] = !0;
        const D = { id: E, start_date: T.start_date, duration: T.duration, end_date: T.end_date, delay: T.delay, task_id: f.id, resource_id: T.resource_id, value: T.value, mode: T.mode || C };
        Object.keys(T).forEach((M) => {
          M != "$id" && (D[M] = T[M]);
        }), D.start_date && D.start_date.getMonth && D.end_date && D.end_date.getMonth && typeof D.duration == "number" || u(D, f), $.push(D);
      });
    }
    return $;
  }
  function y(f) {
    if (t.isTaskExists(f)) {
      var v = t.getTask(f);
      k(v, t.getTaskAssignments(v.id));
    }
  }
  function k(f, v) {
    v.sort(function(x, $) {
      return x.start_date && $.start_date && x.start_date.valueOf() != $.start_date.valueOf() ? x.start_date - $.start_date : 0;
    }), o == s ? f[t.config.resource_property] = v : o == r && (f[t.config.resource_property] = v.map(function(x) {
      return { $id: x.id, start_date: x.start_date, duration: x.duration, end_date: x.end_date, delay: x.delay, resource_id: x.resource_id, value: x.value, mode: x.mode };
    })), f[e] = v;
  }
  function b(f) {
    var v = p(f);
    return v.forEach(function(x) {
      x.id = x.id || t.uid();
    }), v;
  }
  function g(f, v) {
    var x = function($, w) {
      var S = { inBoth: [], inTaskNotInStore: [], inStoreNotInTask: [] };
      if (o == i) {
        var T = $[0], E = T ? T.resource_id : null, C = !1;
        w.forEach(function(A) {
          A.resource_id != E ? S.inStoreNotInTask.push(A) : A.resource_id == E && (S.inBoth.push({ store: A, task: T }), C = !0);
        }), !C && T && S.inTaskNotInStore.push(T);
      } else if (o == a) {
        var D = {}, M = {}, I = {};
        $.forEach(function(A) {
          D[A.resource_id] = A;
        }), w.forEach(function(A) {
          M[A.resource_id] = A;
        }), $.concat(w).forEach(function(A) {
          if (!I[A.resource_id]) {
            I[A.resource_id] = !0;
            var N = D[A.resource_id], L = M[A.resource_id];
            N && L ? S.inBoth.push({ store: L, task: N }) : N && !L ? S.inTaskNotInStore.push(N) : !N && L && S.inStoreNotInTask.push(L);
          }
        });
      } else o != s && o != r || (D = {}, M = {}, I = {}, $.forEach(function(A) {
        D[A.id || A.$id] = A;
      }), w.forEach(function(A) {
        M[A.id] = A;
      }), $.concat(w).forEach(function(A) {
        var N = A.id || A.$id;
        if (!I[N]) {
          I[N] = !0;
          var L = D[N], O = M[N];
          L && O ? S.inBoth.push({ store: O, task: L }) : L && !O ? S.inTaskNotInStore.push(L) : !L && O && S.inStoreNotInTask.push(O);
        }
      }));
      return S;
    }(p(f), v);
    x.inStoreNotInTask.forEach(function($) {
      h.removeItem($.id);
    }), x.inTaskNotInStore.forEach(function($) {
      h.addItem($);
    }), x.inBoth.forEach(function($) {
      if (function(S, T) {
        var E = { id: !0 };
        for (var C in S) if (!E[C] && String(S[C]) !== String(T[C])) return !0;
        return !1;
      }($.task, $.store)) (function(S, T) {
        var E = { id: !0 };
        for (var C in S) E[C] || (T[C] = S[C]);
      })($.task, $.store), h.updateItem($.store.id);
      else if ($.task.start_date && $.task.end_date && $.task.mode !== l) {
        var w = _($.store, f);
        $.store.start_date.valueOf() == w.start_date.valueOf() && $.store.end_date.valueOf() == w.end_date.valueOf() || ($.store.start_date = w.start_date, $.store.end_date = w.end_date, $.store.duration = w.duration, h.updateItem($.store.id));
      }
    }), y(f.id);
  }
  function m(f) {
    var v = f[e] || h.find(function(x) {
      return x.task_id == f.id;
    });
    g(f, v);
  }
  t.$data.assignmentsStore = h, t.attachEvent("onGanttReady", function() {
    if (t.config.process_resource_assignments) {
      t.attachEvent("onParse", function() {
        t.silent(function() {
          h.clearAll();
          var E = [];
          t.eachTask(function(C) {
            if (C.type !== t.config.types.project) {
              var D = b(C);
              k(C, D), D.forEach(function(M) {
                E.push(M);
              });
            }
          }), h.parse(E);
        });
      });
      var f = !1, v = !1, x = {}, $ = !1;
      t.attachEvent("onBeforeBatchUpdate", function() {
        f = !0;
      }), t.attachEvent("onAfterBatchUpdate", function() {
        if (v) {
          var E = {};
          for (var C in x) E[C] = t.getTaskAssignments(x[C].id);
          for (var C in t.config.process_resource_assignments && o === "resourceValueArray" && (T = null), x) g(x[C], E[C]);
        }
        v = !1, f = !1, x = {};
      }), t.attachEvent("onTaskCreated", function(E) {
        var C = b(E);
        return h.parse(C), k(E, C), !0;
      }), t.attachEvent("onAfterTaskUpdate", function(E, C) {
        f ? (v = !0, x[E] = C) : C.unscheduled || m(C);
      }), t.attachEvent("onAfterTaskAdd", function(E, C) {
        f ? (v = !0, x[E] = C) : m(C);
      }), t.attachEvent("onRowDragEnd", function(E) {
        m(t.getTask(E));
      }), t.$data.tasksStore.attachEvent("onAfterDeleteConfirmed", function(E, C) {
        var D, M = [E];
        t.eachTask(function(I) {
          M.push(I.id);
        }, E), D = {}, M.forEach(function(I) {
          D[I] = !0;
        }), h.find(function(I) {
          return D[I.task_id];
        }).forEach(function(I) {
          h.removeItem(I.id);
        });
      }), t.$data.tasksStore.attachEvent("onClearAll", function() {
        return w = null, S = null, T = null, h.clearAll(), !0;
      }), t.attachEvent("onTaskIdChange", function(E, C) {
        h.find(function(D) {
          return D.task_id == E;
        }).forEach(function(D) {
          D.task_id = C, h.updateItem(D.id);
        }), y(C);
      }), t.attachEvent("onBeforeUndo", function(E) {
        return $ = !0, !0;
      }), t.attachEvent("onAfterUndo", function(E) {
        $ = !0;
      });
      var w = null, S = null, T = null;
      h.attachEvent("onStoreUpdated", function() {
        return f && !$ || (w = null, S = null, T = null), !0;
      }), t.getResourceAssignments = function(E, C) {
        var D = t.defined(C) && C !== null;
        return w === null && (w = {}, S = {}, h.eachItem(function(M) {
          w[M.resource_id] || (w[M.resource_id] = []), w[M.resource_id].push(M);
          var I = M.resource_id + "-" + M.task_id;
          S[I] || (S[I] = []), S[I].push(M);
        })), D ? (S[E + "-" + C] || []).slice() : (w[E] || []).slice();
      }, t.getTaskAssignments = function(E) {
        if (T === null) {
          var C = [];
          T = {}, h.eachItem(function(D) {
            T[D.task_id] || (T[D.task_id] = []), T[D.task_id].push(D), D.task_id == E && C.push(D);
          });
        }
        return (T[E] || []).slice();
      }, t.getTaskResources = function(E) {
        const C = t.getDatastore("resource"), D = t.getTaskAssignments(E), M = {};
        D.forEach(function(A) {
          M[A.resource_id] || (M[A.resource_id] = A.resource_id);
        });
        const I = [];
        for (const A in M) {
          const N = C.getItem(M[A]);
          N && I.push(N);
        }
        return I;
      }, t.updateTaskAssignments = y;
    }
  }, { once: !0 });
}
function ci(t) {
  function e(o) {
    return function() {
      return !t.config.placeholder_task || o.apply(this, arguments);
    };
  }
  function n() {
    var o = t.getTaskBy("type", t.config.types.placeholder);
    if (!o.length || !t.isTaskExists(o[0].id)) {
      var l = { unscheduled: !0, type: t.config.types.placeholder, duration: 0, text: t.locale.labels.new_task };
      if (t.callEvent("onTaskCreated", [l]) === !1) return;
      t.addTask(l);
    }
  }
  function i(o) {
    var l = t.getTask(o);
    l.type == t.config.types.placeholder && (l.start_date && l.end_date && l.unscheduled && (l.unscheduled = !1), t.batchUpdate(function() {
      var c = t.copy(l);
      t.silent(function() {
        t.deleteTask(l.id);
      }), delete c["!nativeeditor_status"], c.type = t.config.types.task, c.id = t.uid(), t.addTask(c);
    }));
  }
  t.config.types.placeholder = "placeholder", t.attachEvent("onDataProcessorReady", e(function(o) {
    o && !o._silencedPlaceholder && (o._silencedPlaceholder = !0, o.attachEvent("onBeforeUpdate", e(function(l, c, d) {
      return d.type != t.config.types.placeholder || (o.setUpdated(l, !1), !1);
    })));
  }));
  var a = !1;
  function r(o) {
    return !!(t.config.types.placeholder && t.isTaskExists(o) && t.getTask(o).type == t.config.types.placeholder);
  }
  function s(o) {
    return !(!r(o.source) && !r(o.target));
  }
  t.attachEvent("onGanttReady", function() {
    a || (a = !0, t.attachEvent("onAfterTaskUpdate", e(i)), t.attachEvent("onAfterTaskAdd", e(function(o, l) {
      l.type != t.config.types.placeholder && (t.getTaskBy("type", t.config.types.placeholder).forEach(function(c) {
        t.silent(function() {
          t.isTaskExists(c.id) && t.deleteTask(c.id);
        });
      }), n());
    })), t.attachEvent("onParse", e(n)));
  }), t.attachEvent("onLinkValidation", function(o) {
    return !s(o);
  }), t.attachEvent("onBeforeLinkAdd", function(o, l) {
    return !s(l);
  }), t.attachEvent("onBeforeUndoStack", function(o) {
    for (var l = 0; l < o.commands.length; l++) {
      var c = o.commands[l];
      c.entity === "task" && c.value.type === t.config.types.placeholder && (o.commands.splice(l, 1), l--);
    }
    return !0;
  });
}
function ui(t) {
  function e(d) {
    return function() {
      return !t.config.auto_types || t.getTaskType(t.config.types.project) != t.config.types.project || d.apply(this, arguments);
    };
  }
  function n(d, u) {
    var h = t.getTask(d), _ = r(h);
    _ !== !1 && t.getTaskType(h) !== _ && (u.$needsUpdate = !0, u[h.id] = { task: h, type: _ });
  }
  function i(d) {
    if (!t.getState().group_mode) {
      var u = function(h, _) {
        return n(h, _ = _ || {}), t.eachParent(function(p) {
          n(p.id, _);
        }, h), _;
      }(d);
      u.$needsUpdate && t.batchUpdate(function() {
        (function(h) {
          for (var _ in h) if (h[_] && h[_].task) {
            var p = h[_].task;
            p.type = h[_].type, t.updateTask(p.id);
          }
        })(u);
      });
    }
  }
  var a;
  function r(d) {
    var u = t.config.types, h = t.hasChild(d.id), _ = t.getTaskType(d.type);
    return h && _ === u.task ? u.project : !h && _ === u.project && u.task;
  }
  var s, o, l = !0;
  function c(d) {
    d != t.config.root_id && t.isTaskExists(d) && i(d);
  }
  t.attachEvent("onParse", e(function() {
    l = !1, t.getState().group_mode || (t.batchUpdate(function() {
      t.eachTask(function(d) {
        var u = r(d);
        u !== !1 && function(h, _) {
          t.getState().group_mode || (h.type = _, t.updateTask(h.id));
        }(d, u);
      });
    }), l = !0);
  })), t.attachEvent("onAfterTaskAdd", e(function(d) {
    l && i(d);
  })), t.attachEvent("onAfterTaskUpdate", e(function(d) {
    l && i(d);
  })), t.attachEvent("onBeforeTaskDelete", e(function(d, u) {
    return a = t.getParent(d), !0;
  })), t.attachEvent("onAfterTaskDelete", e(function(d, u) {
    c(a);
  })), t.attachEvent("onRowDragStart", e(function(d, u, h) {
    return s = t.getParent(d), !0;
  })), t.attachEvent("onRowDragEnd", e(function(d, u) {
    c(s), i(d);
  })), t.attachEvent("onBeforeTaskMove", e(function(d, u, h) {
    return o = t.getParent(d), !0;
  })), t.attachEvent("onAfterTaskMove", e(function(d, u, h) {
    document.querySelector(".gantt_drag_marker") || (c(o), i(d));
  }));
}
const Zt = class Zt {
  constructor() {
    this.canParse = (e) => !isNaN(this.parse(e)), this.format = (e) => String(e), this.parse = (e) => parseInt(e, 10);
  }
};
Zt.create = (e = null) => new Zt();
let Pt = Zt;
const Qt = class Qt {
  constructor(e) {
    this.format = (n) => this._getWBSCode(n.source), this.canParse = (n) => this._linkReg.test(n), this.parse = (n) => {
      if (!this.canParse(n)) return null;
      const i = this._linkReg.exec(n)[0].trim();
      return { id: void 0, source: this._findSource(i) || null, target: null, type: this._gantt.config.links.finish_to_start, lag: 0 };
    }, this._getWBSCode = (n) => {
      const i = this._gantt.getTask(n);
      return this._gantt.getWBSCode(i);
    }, this._findSource = (n) => {
      const i = new RegExp("^[0-9.]+", "i");
      if (i.exec(n)) {
        const a = i.exec(n)[0], r = this._gantt.getTaskByWBSCode(a);
        if (r) return r.id;
      }
      return null;
    }, this._linkReg = /^[0-9\.]+/, this._gantt = e;
  }
};
Qt.create = (e = null, n) => new Qt(n);
let ke = Qt;
function hi(t) {
  t.ext.formatters = { durationFormatter: function(e) {
    return e || (e = {}), e.store || (e.store = t.config.duration_unit), e.enter || (e.enter = t.config.duration_unit), Pt.create(e, t);
  }, linkFormatter: function(e) {
    return ke.create(e, t);
  } };
}
function _i(t) {
  t.ext = t.ext || {}, t.config.show_empty_state = !1, t.ext.emptyStateElement = t.ext.emptyStateElement || { isEnabled: () => t.config.show_empty_state === !0, isGanttEmpty: () => !t.getTaskByTime().length, renderContent(e) {
    const n = `<div class='gantt_empty_state'><div class='gantt_empty_state_image'></div>${`<div class='gantt_empty_state_text'>
    <div class='gantt_empty_state_text_link' data-empty-state-create-task>${t.locale.labels.empty_state_text_link}</div>
    <div class='gantt_empty_state_text_description'>${t.locale.labels.empty_state_text_description}</div>
    </div>`}</div>`;
    e.innerHTML = n;
  }, clickEvents: [], attachAddTaskEvent() {
    const e = t.attachEvent("onEmptyClick", function(n) {
      t.utils.dom.closest(n.target, "[data-empty-state-create-task]") && t.createTask({ id: t.uid(), text: "New Task" });
    });
    this.clickEvents.push(e);
  }, detachAddTaskEvents() {
    this.clickEvents.forEach(function(e) {
      t.detachEvent(e);
    }), this.clickEvents = [];
  }, getContainer() {
    if (t.$container) {
      const e = t.utils.dom;
      if (t.$container.contains(t.$grid_data)) return e.closest(t.$grid_data, ".gantt_layout_content");
      if (t.$container.contains(t.$task_data)) return e.closest(t.$task_data, ".gantt_layout_content");
    }
    return null;
  }, getNode() {
    const e = this.getContainer();
    return e ? e.querySelector(".gantt_empty_state_wrapper") : null;
  }, show() {
    const e = this.getContainer();
    if (!e && this.isGanttEmpty()) return null;
    const n = document.createElement("div");
    n.className = "gantt_empty_state_wrapper", n.style.marginTop = t.config.scale_height - e.offsetHeight + "px";
    const i = t.$container.querySelectorAll(".gantt_empty_state_wrapper");
    Array.prototype.forEach.call(i, function(a) {
      a.parentNode.removeChild(a);
    }), this.detachAddTaskEvents(), this.attachAddTaskEvent(), e.appendChild(n), this.renderContent(n);
  }, hide() {
    const e = this.getNode();
    if (!e) return !1;
    e.parentNode.removeChild(e);
  }, init() {
  } }, t.attachEvent("onDataRender", function() {
    const e = t.ext.emptyStateElement;
    e.isEnabled() && e.isGanttEmpty() ? e.show() : e.hide();
  });
}
const hn = function(t, e) {
  const n = e.baselines && e.baselines.length, i = t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow";
  if (n && i) return !0;
}, $t = function(t) {
  return t.render && t.render == "split" && !t.$open;
};
function gi(t) {
  t.config.baselines = { datastore: "baselines", render_mode: !1, dataprocessor_baselines: !1, row_height: 16, bar_height: 8 };
  const e = t.createDatastore({ name: t.config.baselines.datastore, initItem: function(a) {
    return a.id || (a.id = t.uid()), function(r) {
      if (!r.task_id || !r.start_date && !r.end_date) return !1;
      r.start_date ? r.start_date = t.date.parseDate(r.start_date, "parse_date") : r.start_date = null, r.end_date ? r.end_date = t.date.parseDate(r.end_date, "parse_date") : r.end_date = null, r.duration = r.duration || 1, r.start_date && !r.end_date ? r.end_date = t.calculateEndDate(r.start_date, r.duration) : r.end_date && !r.start_date && (r.start_date = t.calculateEndDate(r.end_date, -r.duration));
    }(a), a;
  } });
  function n(a) {
    let r = 0;
    t.adjustTaskHeightForBaselines(a), t.eachTask(function(s) {
      let o = s.row_height || t.config.row_height;
      r = r || o, o > r && (r = o);
    }, a.id), a.row_height < r && (a.row_height = r);
  }
  function i(a) {
    t.eachParent(function(r) {
      if ($t(r)) {
        const s = r.row_height || t.getLayoutView("timeline").getBarHeight(r.id);
        let o = a.row_height;
        t.getChildren(r.id).forEach(function(l) {
          const c = t.getTask(l);
          if (c.id == a.id) return;
          const d = c.row_height || t.getLayoutView("timeline").getBarHeight(c.id);
          o = o || d, d > o && (o = d);
        }), r.row_height = o, r.bar_height = r.bar_height || s;
      }
    }, a.id);
  }
  t.$data.baselineStore = e, t.adjustTaskHeightForBaselines = function(a) {
    let r, s, o = a.baselines && a.baselines.length || 0;
    const l = t.config.baselines.row_height, c = t.getLayoutView("timeline");
    if (c && t.config.show_chart) switch (t.config.baselines.render_mode) {
      case "taskRow":
      default:
        a.row_height = a.bar_height + 8;
        break;
      case "separateRow":
        r = c.getBarHeight(a.id), o ? (a.bar_height = a.bar_height || r, a.bar_height > r && (r = a.bar_height), a.row_height = r + l) : a.bar_height && (a.row_height = a.bar_height + 4), i(a);
        break;
      case "individualRow":
        r = c.getBarHeight(a.id), o ? (a.bar_height = a.bar_height || r, a.bar_height > r && (r = a.bar_height), s = l * o, a.row_height = r + s + 2) : a.bar_height && (a.row_height = a.bar_height + 4), i(a);
    }
  }, t.attachEvent("onGanttReady", function() {
    t.config.baselines && (t.attachEvent("onParse", function() {
      e.eachItem(function(a) {
        const r = a.task_id;
        if (t.isTaskExists(r)) {
          const s = t.getTask(r);
          s.baselines = s.baselines || [];
          let o = !0;
          for (let l = 0; l < s.baselines.length; l++) {
            let c = s.baselines[l];
            if (c.id == a.id) {
              o = !1, t.mixin(c, a, !0);
              break;
            }
          }
          o && s.baselines.push(a), F(t) || ($t(s) ? n(s) : t.adjustTaskHeightForBaselines(s));
        }
      });
    }), t.attachEvent("onBeforeTaskUpdate", function(a, r) {
      return function(s) {
        let o = !1;
        const l = {}, c = s.baselines || [], d = t.getTaskBaselines(s.id);
        c.length != d.length && (o = !0), c.forEach(function(u) {
          l[u.id] = !0;
          const h = e.getItem(u.id);
          if (h) {
            const _ = +h.start_date != +u.start_date, p = +h.end_date != +u.end_date;
            (_ || p) && e.updateItem(u.id, u);
          } else e.addItem(u);
        }), d.forEach(function(u) {
          l[u.id] || e.removeItem(u.id);
        }), o && ($t(s) ? n(s) : t.adjustTaskHeightForBaselines(s), t.render());
      }(r), !0;
    }), t.attachEvent("onAfterUndo", function(a) {
      if ((t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow") && a) {
        let r = !1;
        a.commands.forEach(function(s) {
          if (s.entity == "task") {
            const o = s.value.id;
            if (t.isTaskExists(o)) {
              const l = t.getTask(o);
              if (l.parent && t.isTaskExists(l.parent)) {
                const c = t.getTask(l.parent);
                $t(c) && (n(c), r = !0);
              }
            }
          }
        }), r && t.render();
      }
    }), t.attachEvent("onAfterTaskDelete", function(a, r) {
      if (hn && r.parent && t.isTaskExists(r.parent)) {
        const s = t.getTask(r.parent);
        $t(s) && n(s);
      }
      e.eachItem(function(s) {
        t.isTaskExists(s.task_id) || e.removeItem(s.id);
      });
    }), t.getTaskBaselines = function(a) {
      const r = [];
      return e.eachItem(function(s) {
        s.task_id == a && r.push(s);
      }), r;
    }, t.$data.baselineStore.attachEvent("onClearAll", function() {
      return t.eachTask(function(a) {
        a.baselines && delete a.baselines;
      }), !0;
    }), t.$data.tasksStore.attachEvent("onClearAll", function() {
      return e.clearAll(), !0;
    }), t.attachEvent("onTaskIdChange", function(a, r) {
      e.find(function(s) {
        return s.task_id == a;
      }).forEach(function(s) {
        s.task_id = r, e.updateItem(s.id);
      });
    }));
  }, { once: !0 });
}
function fi(t) {
  function e(n) {
    throw t.assert(!1, "Can't parse data: incorrect value of gantt.parse or gantt.load method. Actual argument value: " + JSON.stringify(n)), new Error("Invalid argument for gantt.parse or gantt.load. An object or a JSON string of format https://docs.dhtmlx.com/gantt/desktop__supported_data_formats.html#json is expected. Actual argument value: " + JSON.stringify(n));
  }
  t.load = function() {
    throw new Error("gantt.load() method is not available in the node.js, use gantt.parse() instead");
  }, t.parse = function(n, i) {
    this.on_load({ xmlDoc: { responseText: n } }, i);
  }, t.serialize = function(n) {
    return this[n = n || "json"].serialize();
  }, t.on_load = function(n, i) {
    if (n.xmlDoc && n.xmlDoc.status === 404) this.assert(!1, "Failed to load the data from <a href='" + n.xmlDoc.responseURL + "' target='_blank'>" + n.xmlDoc.responseURL + "</a>, server returns 404");
    else if (!t.$destroyed) {
      this.callEvent("onBeforeParse", []), i || (i = "json"), this.assert(this[i], "Invalid data type:'" + i + "'");
      var a = n.xmlDoc.responseText, r = this[i].parse(a, n);
      this._process_loading(r);
    }
  }, t._process_loading = function(n) {
    n.collections && this._load_collections(n.collections), n.resources && this.$data.resourcesStore && this.$data.resourcesStore.parse(n.resources), t.config.baselines && n.baselines && this.$data.baselineStore && this.$data.baselineStore.parse(n.baselines);
    const i = n.data || n.tasks;
    n.assignments && function(r, s) {
      const o = {};
      s.forEach((l) => {
        o[l.task_id] || (o[l.task_id] = []), o[l.task_id].push(l);
      }), r.forEach((l) => {
        l[t.config.resource_property] = o[l.id] || [];
      });
    }(i, n.assignments), this.$data.tasksStore.parse(i);
    var a = n.links || (n.collections && n.collections.links ? n.collections.links : []);
    this.$data.linksStore.parse(a), this.callEvent("onParse", []), this.render();
  }, t._load_collections = function(n) {
    var i = !1;
    for (var a in n) if (n.hasOwnProperty(a)) {
      i = !0;
      var r = n[a];
      this.serverList[a] = this.serverList[a] || [];
      var s = this.serverList[a];
      if (!s) continue;
      s.splice(0, s.length);
      for (var o = 0; o < r.length; o++) {
        var l = r[o], c = this.copy(l);
        for (var d in c.key = c.value, l) if (l.hasOwnProperty(d)) {
          if (d == "value" || d == "label") continue;
          c[d] = l[d];
        }
        s.push(c);
      }
    }
    i && this.callEvent("onOptionsLoad", []);
  }, t.attachEvent("onBeforeTaskDisplay", function(n, i) {
    return !i.$ignore;
  }), t.json = { parse: function(n) {
    if (n || e(n), typeof n == "string") if (typeof JSON != null) try {
      n = JSON.parse(n);
    } catch {
      e(n);
    }
    else t.assert(!1, "JSON is not supported");
    return n.data || n.tasks || e(n), n.dhx_security && (t.security_key = n.dhx_security), n;
  }, serializeTask: function(n) {
    return this._copyObject(n);
  }, serializeLink: function(n) {
    return this._copyLink(n);
  }, _copyLink: function(n) {
    var i = {};
    for (var a in n) i[a] = n[a];
    return i;
  }, _copyObject: function(n) {
    var i = {};
    for (var a in n) a.charAt(0) != "$" && (i[a] = n[a], Q(i[a]) && (i[a] = t.defined(t.templates.xml_format) ? t.templates.xml_format(i[a]) : t.templates.format_date(i[a])));
    return i;
  }, serialize: function() {
    var n = [], i = [];
    let a = [];
    t.eachTask(function(o) {
      t.resetProjectDates(o), n.push(this.serializeTask(o));
    }, t.config.root_id, this);
    for (var r = t.getLinks(), s = 0; s < r.length; s++) i.push(this.serializeLink(r[s]));
    return t.getDatastore("baselines").eachItem(function(o) {
      const l = t.json.serializeTask(o);
      a.push(l);
    }), { data: n, links: i, baselines: a };
  } }, t.xml = { _xmlNodeToJSON: function(n, i) {
    for (var a = {}, r = 0; r < n.attributes.length; r++) a[n.attributes[r].name] = n.attributes[r].value;
    if (!i) {
      for (r = 0; r < n.childNodes.length; r++) {
        var s = n.childNodes[r];
        s.nodeType == 1 && (a[s.tagName] = s.firstChild ? s.firstChild.nodeValue : "");
      }
      a.text || (a.text = n.firstChild ? n.firstChild.nodeValue : "");
    }
    return a;
  }, _getCollections: function(n) {
    for (var i = {}, a = t.ajax.xpath("//coll_options", n), r = 0; r < a.length; r++) for (var s = i[a[r].getAttribute("for")] = [], o = t.ajax.xpath(".//item", a[r]), l = 0; l < o.length; l++) {
      for (var c = o[l].attributes, d = { key: o[l].getAttribute("value"), label: o[l].getAttribute("label") }, u = 0; u < c.length; u++) {
        var h = c[u];
        h.nodeName != "value" && h.nodeName != "label" && (d[h.nodeName] = h.nodeValue);
      }
      s.push(d);
    }
    return i;
  }, _getXML: function(n, i, a) {
    a = a || "data", i.getXMLTopNode || (i = t.ajax.parse(i));
    var r = t.ajax.xmltop(a, i.xmlDoc);
    r && r.tagName == a || function(o) {
      throw t.assert(!1, "Can't parse data: incorrect value of gantt.parse or gantt.load method. Actual argument value: " + JSON.stringify(o)), new Error("Invalid argument for gantt.parse or gantt.load. An XML of format https://docs.dhtmlx.com/gantt/desktop__supported_data_formats.html#xmldhtmlxgantt20 is expected. Actual argument value: " + JSON.stringify(o));
    }(n);
    var s = r.getAttribute("dhx_security");
    return s && (t.security_key = s), r;
  }, parse: function(n, i) {
    i = this._getXML(n, i);
    for (var a = {}, r = a.data = [], s = t.ajax.xpath("//task", i), o = 0; o < s.length; o++) r[o] = this._xmlNodeToJSON(s[o]);
    return a.collections = this._getCollections(i), a;
  }, _copyLink: function(n) {
    return "<item id='" + n.id + "' source='" + n.source + "' target='" + n.target + "' type='" + n.type + "' />";
  }, _copyObject: function(n) {
    return "<task id='" + n.id + "' parent='" + (n.parent || "") + "' start_date='" + n.start_date + "' duration='" + n.duration + "' open='" + !!n.open + "' progress='" + n.progress + "' end_date='" + n.end_date + "'><![CDATA[" + n.text + "]]></task>";
  }, serialize: function() {
    for (var n = [], i = [], a = t.json.serialize(), r = 0, s = a.data.length; r < s; r++) n.push(this._copyObject(a.data[r]));
    for (r = 0, s = a.links.length; r < s; r++) i.push(this._copyLink(a.links[r]));
    return "<data>" + n.join("") + "<coll_options for='links'>" + i.join("") + "</coll_options></data>";
  } }, t.oldxml = { parse: function(n, i) {
    i = t.xml._getXML(n, i, "projects");
    for (var a = { collections: { links: [] } }, r = a.data = [], s = t.ajax.xpath("//task", i), o = 0; o < s.length; o++) {
      r[o] = t.xml._xmlNodeToJSON(s[o]);
      var l = s[o].parentNode;
      l.tagName == "project" ? r[o].parent = "project-" + l.getAttribute("id") : r[o].parent = l.parentNode.getAttribute("id");
    }
    for (s = t.ajax.xpath("//project", i), o = 0; o < s.length; o++)
      (c = t.xml._xmlNodeToJSON(s[o], !0)).id = "project-" + c.id, r.push(c);
    for (o = 0; o < r.length; o++) {
      var c;
      (c = r[o]).start_date = c.startdate || c.est, c.end_date = c.enddate, c.text = c.name, c.duration = c.duration / 8, c.open = 1, c.duration || c.end_date || (c.duration = 1), c.predecessortasks && a.collections.links.push({ target: c.id, source: c.predecessortasks, type: t.config.links.finish_to_start });
    }
    return a;
  }, serialize: function() {
    t.message("Serialization to 'old XML' is not implemented");
  } }, t.serverList = function(n, i) {
    return i ? this.serverList[n] = i.slice(0) : this.serverList[n] || (this.serverList[n] = []), this.serverList[n];
  };
}
function ae(t, e, n, i, a) {
  return this.date = t, this.unit = e, this.task = n, this.id = i, this.calendar = a, this;
}
function re(t, e, n, i, a, r) {
  return this.date = t, this.dir = e, this.unit = n, this.task = i, this.id = a, this.calendar = r, this;
}
function se(t, e, n, i, a, r, s) {
  return this.start_date = t, this.duration = e, this.unit = n, this.step = i, this.task = a, this.id = r, this.calendar = s, this;
}
function pi(t, e, n, i) {
  return this.start_date = t, this.end_date = e, this.task = n, this.calendar = i, this.unit = null, this.step = null, this;
}
var _n = function(t) {
  return { getWorkHoursArguments: function() {
    var e = arguments[0];
    if (!bt((e = Q(e) ? { date: e } : P({}, e)).date)) throw t.assert(!1, "Invalid date argument for getWorkHours method"), new Error("Invalid date argument for getWorkHours method");
    return e;
  }, setWorkTimeArguments: function() {
    return arguments[0];
  }, unsetWorkTimeArguments: function() {
    return arguments[0];
  }, isWorkTimeArguments: function() {
    var e, n = arguments[0];
    if (n instanceof ae) return n;
    if ((e = n.date ? new ae(n.date, n.unit, n.task, null, n.calendar) : new ae(arguments[0], arguments[1], arguments[2], null, arguments[3])).unit = e.unit || t.config.duration_unit, !bt(e.date)) throw t.assert(!1, "Invalid date argument for isWorkTime method"), new Error("Invalid date argument for isWorkTime method");
    return e;
  }, getClosestWorkTimeArguments: function(e) {
    var n, i = arguments[0];
    if (i instanceof re) return i;
    if (n = Q(i) ? new re(i) : new re(i.date, i.dir, i.unit, i.task, null, i.calendar), i.id && (n.task = i), n.dir = i.dir || "any", n.unit = i.unit || t.config.duration_unit, !bt(n.date)) throw t.assert(!1, "Invalid date argument for getClosestWorkTime method"), new Error("Invalid date argument for getClosestWorkTime method");
    return n;
  }, _getStartEndConfig: function(e) {
    var n, i = pi;
    if (e instanceof i) return e;
    if (Q(e) ? n = new i(arguments[0], arguments[1], arguments[2], arguments[3]) : (n = new i(e.start_date, e.end_date, e.task), e.id !== null && e.id !== void 0 && (n.task = e)), n.unit = n.unit || t.config.duration_unit, n.step = n.step || t.config.duration_step, n.start_date = n.start_date || n.start || n.date, !bt(n.start_date)) throw t.assert(!1, "Invalid start_date argument for getDuration method"), new Error("Invalid start_date argument for getDuration method");
    if (!bt(n.end_date)) throw t.assert(!1, "Invalid end_date argument for getDuration method"), new Error("Invalid end_date argument for getDuration method");
    return n;
  }, getDurationArguments: function(e, n, i, a) {
    return this._getStartEndConfig.apply(this, arguments);
  }, hasDurationArguments: function(e, n, i, a) {
    return this._getStartEndConfig.apply(this, arguments);
  }, calculateEndDateArguments: function(e, n, i, a) {
    var r, s = arguments[0];
    if (s instanceof se) return s;
    if (r = Q(s) ? new se(arguments[0], arguments[1], arguments[2], void 0, arguments[3], void 0, arguments[4]) : new se(s.start_date, s.duration, s.unit, s.step, s.task, null, s.calendar), s.id !== null && s.id !== void 0 && (r.task = s, r.unit = null, r.step = null), r.unit = r.unit || t.config.duration_unit, r.step = r.step || t.config.duration_step, !bt(r.start_date)) throw t.assert(!1, "Invalid start_date argument for calculateEndDate method"), new Error("Invalid start_date argument for calculateEndDate method");
    return r;
  } };
};
function gn() {
}
gn.prototype = { _getIntervals: function(t) {
  for (var e = [], n = 0; n < t.length; n += 2) e.push({ start: t[n], end: t[n + 1] });
  return e;
}, _toHoursArray: function(t) {
  var e = [];
  function n(a) {
    var r, s = Math.floor(a / 3600), o = a - 60 * s * 60, l = Math.floor(o / 60);
    return s + ":" + ((r = String(l)).length < 2 && (r = "0" + r), r);
  }
  for (var i = 0; i < t.length; i++) e.push(n(t[i].start) + "-" + n(t[i].end));
  return e;
}, _intersectHourRanges: function(t, e) {
  var n = [], i = t.length > e.length ? t : e, a = t === i ? e : t;
  i = i.slice(), a = a.slice(), n = [];
  for (var r = 0; r < i.length; r++) for (var s = i[r], o = 0; o < a.length; o++) {
    var l = a[o];
    l.start < s.end && l.end > s.start && (n.push({ start: Math.max(s.start, l.start), end: Math.min(s.end, l.end) }), s.end > l.end && (a.splice(o, 1), o--, r--));
  }
  return n;
}, _mergeAdjacentIntervals: function(t) {
  var e = t.slice();
  e.sort(function(r, s) {
    return r.start - s.start;
  });
  for (var n = e[0], i = 1; i < e.length; i++) {
    var a = e[i];
    a.start <= n.end ? (a.end > n.end && (n.end = a.end), e.splice(i, 1), i--) : n = a;
  }
  return e;
}, _mergeHoursConfig: function(t, e) {
  return this._mergeAdjacentIntervals(this._intersectHourRanges(t, e));
}, merge: function(t, e) {
  const n = q(t.getConfig()), i = q(e.getConfig()), a = n.parsed, r = i.parsed;
  a.customWeeks = n.customWeeks, r.customWeeks = i.customWeeks;
  var s = { hours: this._toHoursArray(this._mergeHoursConfig(a.hours, r.hours)), dates: {}, customWeeks: {} };
  const o = (c, d) => {
    for (let u in c.dates) {
      const h = c.dates[u];
      +u > 1e3 && (s.dates[u] = !1);
      for (const _ in d.dates) {
        const p = d.dates[_];
        if (_ == u && (s.dates[u] = !(!h || !p)), Array.isArray(h)) {
          const y = Array.isArray(p) ? p : d.hours;
          s.dates[u] = this._toHoursArray(this._mergeHoursConfig(h, y));
        }
      }
    }
  };
  if (o(a, r), o(r, a), a.customWeeks) for (var l in a.customWeeks) s.customWeeks[l] = a.customWeeks[l];
  if (r.customWeeks) for (var l in r.customWeeks) s.customWeeks[l] ? s.customWeeks[l + "_second"] = r.customWeeks[l] : s.customWeeks[l] = r.customWeeks[l];
  return s;
} };
class mi {
  constructor() {
    this.clear();
  }
  getItem(e, n, i) {
    if (this._cache.has(e)) {
      const a = this._cache.get(e)[i.getFullYear()];
      if (a && a.has(n)) return a.get(n);
    }
    return -1;
  }
  setItem(e, n, i, a) {
    if (!e || !n) return;
    const r = this._cache, s = a.getFullYear();
    let o;
    r.has(e) ? o = r.get(e) : (o = [], r.set(e, o));
    let l = o[s];
    l || (l = o[s] = /* @__PURE__ */ new Map()), l.set(n, i);
  }
  clear() {
    this._cache = /* @__PURE__ */ new Map();
  }
}
class vi {
  constructor() {
    this.clear();
  }
  getItem(e, n, i) {
    const a = this._cache;
    if (a && a[e]) {
      const r = a[e];
      if (r === void 0) return -1;
      const s = r[i.getFullYear()];
      if (s && s[n] !== void 0) return s[n];
    }
    return -1;
  }
  setItem(e, n, i, a) {
    if (!e || !n) return;
    const r = this._cache;
    if (!r) return;
    r[e] || (r[e] = []);
    const s = r[e], o = a.getFullYear();
    let l = s[o];
    l || (l = s[o] = {}), l[n] = i;
  }
  clear() {
    this._cache = {};
  }
}
class ki {
  constructor(e) {
    this.getMinutesPerWeek = (n) => {
      const i = n.valueOf();
      if (this._weekCache.has(i)) return this._weekCache.get(i);
      const a = this._calendar, r = this._calendar.$gantt;
      let s = 0, o = r.date.week_start(new Date(n));
      for (let l = 0; l < 7; l++) s += 60 * a.getHoursPerDay(o), o = r.date.add(o, 1, "day");
      return this._weekCache.set(i, s), s;
    }, this.getMinutesPerMonth = (n) => {
      const i = n.valueOf();
      if (this._monthCache.has(i)) return this._monthCache.get(i);
      const a = this._calendar, r = this._calendar.$gantt;
      let s = 0, o = r.date.week_start(new Date(n));
      const l = r.date.add(o, 1, "month").valueOf();
      for (; o.valueOf() < l; ) s += 60 * a.getHoursPerDay(o), o = r.date.add(o, 1, "day");
      return this._monthCache.set(i, s), s;
    }, this.clear = () => {
      this._weekCache = /* @__PURE__ */ new Map(), this._monthCache = /* @__PURE__ */ new Map();
    }, this.clear(), this._calendar = e;
  }
}
class yi {
  constructor() {
    this.clear();
  }
  _getCacheObject(e, n, i) {
    const a = this._cache;
    a[n] || (a[n] = []);
    let r = a[n];
    r || (r = a[n] = {});
    let s = r[i];
    s || (s = r[i] = {});
    const o = e.getFullYear();
    let l = s[o];
    return l || (l = s[o] = { durations: {}, endDates: {} }), l;
  }
  _endDateCacheKey(e, n) {
    return String(e) + "-" + String(n);
  }
  _durationCacheKey(e, n) {
    return String(e) + "-" + String(n);
  }
  getEndDate(e, n, i, a, r) {
    const s = this._getCacheObject(e, i, a), o = e.valueOf(), l = this._endDateCacheKey(o, n);
    let c;
    if (s.endDates[l] === void 0) {
      const d = r(), u = d.valueOf();
      s.endDates[l] = u, s.durations[this._durationCacheKey(o, u)] = n, c = d;
    } else c = new Date(s.endDates[l]);
    return c;
  }
  getDuration(e, n, i, a, r) {
    const s = this._getCacheObject(e, i, a), o = e.valueOf(), l = n.valueOf(), c = this._durationCacheKey(o, l);
    let d;
    if (s.durations[c] === void 0) {
      const u = r();
      s.durations[c] = u.valueOf(), d = u;
    } else d = s.durations[c];
    return d;
  }
  clear() {
    this._cache = {};
  }
}
function ye(t, e) {
  this.argumentsHelper = e, this.$gantt = t, this._workingUnitsCache = typeof Map < "u" ? new mi() : new vi(), this._largeUnitsCache = new ki(this), this._dateDurationCache = new yi(), this._worktime = null, this._cached_timestamps = {}, this._cached_timestamps_count = 0;
}
ye.prototype = { units: ["year", "month", "week", "day", "hour", "minute"], _clearCaches: function() {
  this._workingUnitsCache.clear(), this._largeUnitsCache.clear(), this._dateDurationCache.clear();
}, _getUnitOrder: function(t) {
  for (var e = 0, n = this.units.length; e < n; e++) if (this.units[e] == t) return e;
}, _resetTimestampCache: function() {
  this._cached_timestamps = {}, this._cached_timestamps_count = 0;
}, _timestamp: function(t) {
  this._cached_timestamps_count > 1e6 && this._resetTimestampCache();
  var e = null;
  if (t.day || t.day === 0) e = t.day;
  else if (t.date) {
    var n = String(t.date.valueOf());
    this._cached_timestamps[n] ? e = this._cached_timestamps[n] : (e = Date.UTC(t.date.getFullYear(), t.date.getMonth(), t.date.getDate()), this._cached_timestamps[n] = e, this._cached_timestamps_count++);
  }
  return e;
}, _checkIfWorkingUnit: function(t, e) {
  if (!this["_is_work_" + e]) {
    const n = this.$gantt.date[`${e}_start`](new Date(t)), i = this.$gantt.date.add(n, 1, e);
    return this.hasDuration(n, i);
  }
  return this["_is_work_" + e](t);
}, _is_work_day: function(t) {
  var e = this._getWorkHours(t);
  return !!Array.isArray(e) && e.length > 0;
}, _is_work_hour: function(t) {
  for (var e = this._getWorkHours(t), n = t.getHours(), i = 0; i < e.length; i++) if (n >= e[i].startHour && n < e[i].endHour) return !0;
  return !1;
}, _getTimeOfDayStamp: function(t, e) {
  var n = t.getHours();
  return t.getHours() || t.getMinutes() || !e || (n = 24), 60 * n * 60 + 60 * t.getMinutes();
}, _is_work_minute: function(t) {
  for (var e = this._getWorkHours(t), n = this._getTimeOfDayStamp(t), i = 0; i < e.length; i++) if (n >= e[i].start && n < e[i].end) return !0;
  return !1;
}, _nextDate: function(t, e, n) {
  return this.$gantt.date.add(t, n, e);
}, _getWorkUnitsBetweenGeneric: function(t, e, n, i) {
  var a = this.$gantt.date, r = new Date(t), s = new Date(e);
  i = i || 1;
  var o, l, c = 0, d = null, u = !1;
  (o = a[n + "_start"](new Date(r))).valueOf() != r.valueOf() && (u = !0);
  var h = !1;
  (l = a[n + "_start"](new Date(e))).valueOf() != e.valueOf() && (h = !0);
  for (var _ = !1; r.valueOf() < s.valueOf(); ) {
    if (_ = (d = this._nextDate(r, n, i)).valueOf() > s.valueOf(), this._isWorkTime(r, n)) (u || h && _) && (o = a[n + "_start"](new Date(r)), l = a.add(o, i, n)), u ? (u = !1, d = this._nextDate(o, n, i), c += (l.valueOf() - r.valueOf()) / (l.valueOf() - o.valueOf())) : h && _ ? (h = !1, c += (s.valueOf() - r.valueOf()) / (l.valueOf() - o.valueOf())) : c++;
    else {
      var p = this._getUnitOrder(n), y = this.units[p - 1];
      y && !this._isWorkTime(r, y) && (d = this._getClosestWorkTimeFuture(r, y));
    }
    r = d;
  }
  return c;
}, _getMinutesPerHour: function(t) {
  var e = this._getTimeOfDayStamp(t), n = this._getTimeOfDayStamp(this._nextDate(t, "hour", 1));
  n === 0 && (n = 86400);
  for (var i = this._getWorkHours(t), a = 0; a < i.length; a++) {
    var r = i[a];
    if (e >= r.start && n <= r.end) return 60;
    if (e < r.end && n > r.start) return (Math.min(n, r.end) - Math.max(e, r.start)) / 60;
  }
  return 0;
}, _getMinutesPerDay: function(t) {
  var e = this._getWorkHours(t), n = 0;
  return e.forEach(function(i) {
    n += i.durationMinutes;
  }), n;
}, getHoursPerDay: function(t) {
  var e = this._getWorkHours(t), n = 0;
  return e.forEach(function(i) {
    n += i.durationHours;
  }), n;
}, _getWorkUnitsForRange: function(t, e, n, i) {
  var a, r = 0, s = new Date(t), o = new Date(e);
  for (a = R(n == "minute" ? this._getMinutesPerDay : this.getHoursPerDay, this); s.valueOf() < o.valueOf(); ) if (o - s > 27648e5 && s.getDate() === 0) {
    var l = this._largeUnitsCache.getMinutesPerMonth(s);
    n == "hour" && (l /= 60), r += l, s = this.$gantt.date.add(s, 1, "month");
  } else {
    if (o - s > 13824e5) {
      var c = this.$gantt.date.week_start(new Date(s));
      if (s.valueOf() === c.valueOf()) {
        l = this._largeUnitsCache.getMinutesPerWeek(s), n == "hour" && (l /= 60), r += l, s = this.$gantt.date.add(s, 7, "day");
        continue;
      }
    }
    r += a(s), s = this._nextDate(s, "day", 1);
  }
  return r / i;
}, _getMinutesBetweenSingleDay: function(t, e) {
  for (var n = this._getIntervalTimestamp(t, e), i = this._getWorkHours(t), a = 0, r = 0; r < i.length; r++) {
    var s = i[r];
    if (n.end >= s.start && n.start <= s.end) {
      var o = Math.max(s.start, n.start), l = Math.min(s.end, n.end);
      a += (l - o) / 60, n.start = l;
    }
  }
  return Math.floor(a);
}, _getMinutesBetween: function(t, e, n, i) {
  var a = new Date(t), r = new Date(e);
  i = i || 1;
  var s = new Date(a), o = this.$gantt.date.add(this.$gantt.date.day_start(new Date(a)), 1, "day");
  if (r.valueOf() <= o.valueOf()) return this._getMinutesBetweenSingleDay(t, e);
  var l = this.$gantt.date.day_start(new Date(r)), c = r, d = this._getMinutesBetweenSingleDay(s, o), u = this._getMinutesBetweenSingleDay(l, c);
  return d + this._getWorkUnitsForRange(o, l, n, i) + u;
}, _getHoursBetween: function(t, e, n, i) {
  var a = new Date(t), r = new Date(e);
  i = i || 1;
  var s = new Date(a), o = this.$gantt.date.add(this.$gantt.date.day_start(new Date(a)), 1, "day");
  if (r.valueOf() <= o.valueOf()) return Math.round(this._getMinutesBetweenSingleDay(t, e) / 60);
  var l = this.$gantt.date.day_start(new Date(r)), c = r, d = this._getMinutesBetweenSingleDay(s, o, n, i) / 60, u = this._getMinutesBetweenSingleDay(l, c, n, i) / 60, h = d + this._getWorkUnitsForRange(o, l, n, i) + u;
  return Math.round(h);
}, getConfig: function() {
  return this._worktime;
}, _setConfig: function(t) {
  this._worktime = t, this._parseSettings(), this._clearCaches();
}, _parseSettings: function() {
  var t = this.getConfig();
  for (var e in t.parsed = { dates: {}, hours: null, haveCustomWeeks: !1, customWeeks: {}, customWeeksRangeStart: null, customWeeksRangeEnd: null, customWeeksBoundaries: [] }, t.parsed.hours = this._parseHours(t.hours), t.dates) t.parsed.dates[e] = this._parseHours(t.dates[e]);
  if (t.customWeeks) {
    var n = null, i = null;
    for (var e in t.customWeeks) {
      var a = t.customWeeks[e];
      if (a.from && a.to) {
        var r = a.from, s = a.to;
        (!n || n > r.valueOf()) && (n = r.valueOf()), (!i || i < s.valueOf()) && (i = s.valueOf()), t.parsed.customWeeksBoundaries.push({ from: r.valueOf(), fromReadable: new Date(r), to: s.valueOf(), toReadable: new Date(s), name: e }), t.parsed.haveCustomWeeks = !0;
        var o = t.parsed.customWeeks[e] = { from: a.from, to: a.to, hours: this._parseHours(a.hours), dates: {} };
        for (var l in a.dates) o.dates[l] = this._parseHours(a.dates[l]);
      }
    }
    t.parsed.customWeeksRangeStart = n, t.parsed.customWeeksRangeEnd = i;
  }
}, _tryChangeCalendarSettings: function(t) {
  var e = JSON.stringify(this.getConfig());
  return t(), !!this.hasWorkTime() || (this._setConfig(JSON.parse(e)), this._clearCaches(), !1);
}, _arraysEqual: function(t, e) {
  if (t === e) return !0;
  if (!t || !e || t.length != e.length) return !1;
  for (var n = 0; n < t.length; ++n) if (t[n] !== e[n]) return !1;
  return !0;
}, _compareSettings: function(t, e) {
  if (!this._arraysEqual(t.hours, e.hours)) return !1;
  var n = Object.keys(t.dates), i = Object.keys(e.dates);
  if (n.sort(), i.sort(), !this._arraysEqual(n, i)) return !1;
  for (var a = 0; a < n.length; a++) {
    var r = n[a], s = t.dates[r], o = t.dates[r];
    if (s !== o && !(Array.isArray(s) && Array.isArray(o) && this._arraysEqual(s, o))) return !1;
  }
  return !0;
}, equals: function(t) {
  if (!(t instanceof ye)) return !1;
  var e = this.getConfig(), n = t.getConfig();
  if (!this._compareSettings(e, n)) return !1;
  if (e.parsed.haveCustomWeeks && n.parsed.haveCustomWeeks) {
    if (e.parsed.customWeeksBoundaries.length != n.parsed.customWeeksBoundaries.length) return !1;
    for (var i in e.parsed.customWeeks) {
      var a = e.parsed.customWeeks[i], r = n.parsed.customWeeks[i];
      if (!r || !this._compareSettings(a, r)) return !1;
    }
  } else if (e.parse.haveCustomWeeks !== n.parsed.haveCustomWeeks) return !1;
  return !0;
}, getWorkHours: function() {
  var t = this.argumentsHelper.getWorkHoursArguments.apply(this.argumentsHelper, arguments);
  return this._getWorkHours(t.date, !1);
}, _getWorkHours: function(t, e) {
  var n = this.getConfig();
  if (e !== !1 && (n = n.parsed), !t) return n.hours;
  var i = this._timestamp({ date: t });
  if (n.haveCustomWeeks && n.customWeeksRangeStart <= i && n.customWeeksRangeEnd > i) {
    for (var a = 0; a < n.customWeeksBoundaries.length; a++) if (n.customWeeksBoundaries[a].from <= i && n.customWeeksBoundaries[a].to > i) {
      n = n.customWeeks[n.customWeeksBoundaries[a].name];
      break;
    }
  }
  var r = !0;
  return n.dates[i] !== void 0 ? r = n.dates[i] : n.dates[t.getDay()] !== void 0 && (r = n.dates[t.getDay()]), r === !0 ? n.hours : r || [];
}, _getIntervalTimestamp: function(t, e) {
  var n = { start: 0, end: 0 };
  n.start = 60 * t.getHours() * 60 + 60 * t.getMinutes() + t.getSeconds();
  var i = e.getHours();
  return !i && !e.getMinutes() && !e.getSeconds() && t.valueOf() < e.valueOf() && (i = 24), n.end = 60 * i * 60 + 60 * e.getMinutes() + e.getSeconds(), n;
}, _parseHours: function(t) {
  if (Array.isArray(t)) {
    var e = [];
    t.forEach(function(o) {
      typeof o == "number" ? e.push(60 * o * 60) : typeof o == "string" && o.split("-").map(function(l) {
        return l.trim();
      }).forEach(function(l) {
        var c = l.split(":").map(function(u) {
          return u.trim();
        }), d = parseInt(60 * c[0] * 60);
        c[1] && (d += parseInt(60 * c[1])), c[2] && (d += parseInt(c[2])), e.push(d);
      });
    });
    for (var n = [], i = 0; i < e.length; i += 2) {
      var a = e[i], r = e[i + 1], s = r - a;
      n.push({ start: a, end: r, startHour: Math.floor(a / 3600), startMinute: Math.floor(a / 60), endHour: Math.ceil(r / 3600), endMinute: Math.ceil(r / 60), durationSeconds: s, durationMinutes: s / 60, durationHours: s / 3600 });
    }
    return n;
  }
  return t;
}, setWorkTime: function(t) {
  return this._tryChangeCalendarSettings(R(function() {
    var e = t.hours === void 0 || t.hours, n = this._timestamp(t), i = this.getConfig();
    if (n !== null ? i.dates[n] = e : t.customWeeks || (i.hours = e), t.customWeeks) {
      if (i.customWeeks || (i.customWeeks = {}), typeof t.customWeeks == "string") n !== null ? i.customWeeks[t.customWeeks].dates[n] = e : t.customWeeks || (i.customWeeks[t.customWeeks].hours = e);
      else if (typeof t.customWeeks == "object" && Function.prototype.toString.call(t.customWeeks.constructor) === "function Object() { [native code] }") for (var a in t.customWeeks) i.customWeeks[a] = t.customWeeks[a];
    }
    this._parseSettings(), this._clearCaches();
  }, this));
}, unsetWorkTime: function(t) {
  return this._tryChangeCalendarSettings(R(function() {
    if (t) {
      var e = this._timestamp(t);
      e !== null && delete this.getConfig().dates[e];
    } else this.reset_calendar();
    this._parseSettings(), this._clearCaches();
  }, this));
}, _isWorkTime: function(t, e) {
  var n, i = -1;
  return n = String(t.valueOf()), (i = this._workingUnitsCache.getItem(e, n, t)) == -1 && (i = this._checkIfWorkingUnit(t, e), this._workingUnitsCache.setItem(e, n, i, t)), i;
}, isWorkTime: function() {
  var t = this.argumentsHelper.isWorkTimeArguments.apply(this.argumentsHelper, arguments);
  return this._isWorkTime(t.date, t.unit);
}, calculateDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments);
  if (!t.unit) return !1;
  var e = this;
  return this._dateDurationCache.getDuration(t.start_date, t.end_date, t.unit, t.step, function() {
    return e._calculateDuration(t.start_date, t.end_date, t.unit, t.step);
  });
}, _calculateDuration: function(t, e, n, i) {
  var a = 0, r = 1;
  if (t.valueOf() > e.valueOf()) {
    var s = e;
    e = t, t = s, r = -1;
  }
  return a = n == "hour" && i == 1 ? this._getHoursBetween(t, e, n, i) : n == "minute" && i == 1 ? this._getMinutesBetween(t, e, n, i) : this._getWorkUnitsBetweenGeneric(t, e, n, i), r * Math.round(a);
}, hasDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments), e = t.start_date, n = t.end_date, i = t.unit, a = t.step;
  if (!i) return !1;
  var r = new Date(e), s = new Date(n);
  for (a = a || 1; r.valueOf() < s.valueOf(); ) {
    if (this._isWorkTime(r, i)) return !0;
    r = this._nextDate(r, i, a);
  }
  return !1;
}, calculateEndDate: function() {
  var t = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, arguments), e = t.start_date, n = t.duration, i = t.unit, a = t.step;
  if (!i) return !1;
  var r = t.duration >= 0 ? 1 : -1;
  n = Math.abs(1 * n);
  var s = this;
  return this._dateDurationCache.getEndDate(e, n, i, a * r, function() {
    return s._calculateEndDate(e, n, i, a * r);
  });
}, _calculateEndDate: function(t, e, n, i) {
  return !!n && (i == 1 && n == "minute" ? this._calculateMinuteEndDate(t, e, i) : i == -1 && n == "minute" ? this._subtractMinuteDate(t, e, i) : i == 1 && n == "hour" ? this._calculateHourEndDate(t, e, i) : this._addInterval(t, e, n, i, null).end);
}, _addInterval: function(t, e, n, i, a) {
  for (var r = 0, s = t, o = !1; r < e && (!a || !a(s)); ) {
    var l = this._nextDate(s, n, i);
    n == "day" && (o = o || !s.getHours() && l.getHours()) && (l.setHours(0), l.getHours() || (o = !1));
    var c = new Date(l.valueOf() + 1);
    i > 0 && (c = new Date(l.valueOf() - 1)), this._isWorkTime(c, n) && !o && r++, s = l;
  }
  return { end: s, start: t, added: r };
}, _addHoursUntilDayEnd: function(t, e) {
  for (var n = this.$gantt.date.add(this.$gantt.date.day_start(new Date(t)), 1, "day"), i = 0, a = e, r = this._getIntervalTimestamp(t, n), s = this._getWorkHours(t), o = 0; o < s.length && i < e; o++) {
    var l = s[o];
    if (r.end >= l.start && r.start <= l.end) {
      var c = Math.max(l.start, r.start), d = Math.min(l.end, r.end), u = (d - c) / 3600;
      u > a && (u = a, d = c + 60 * a * 60);
      var h = Math.round((d - c) / 3600);
      i += h, a -= h, r.start = d;
    }
  }
  var _ = n;
  return i === e && (_ = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, r.start)), { added: i, end: _ };
}, _calculateHourEndDate: function(t, e, n) {
  var i = new Date(t), a = 0;
  n = n || 1, e = Math.abs(1 * e);
  var r = this._addHoursUntilDayEnd(i, e);
  if (a = r.added, i = r.end, c = e - a) {
    for (var s = i; a < e; ) {
      var o = this._nextDate(s, "day", n);
      o.setHours(0), o.setMinutes(0), o.setSeconds(0);
      var l = 0;
      if (a + (l = n > 0 ? this.getHoursPerDay(new Date(o.valueOf() - 1)) : this.getHoursPerDay(new Date(o.valueOf() + 1))) >= e) break;
      a += l, s = o;
    }
    i = s;
  }
  if (a < e) {
    var c = e - a;
    i = (r = this._addHoursUntilDayEnd(i, c)).end;
  }
  return i;
}, _addMinutesUntilHourEnd: function(t, e) {
  if (t.getMinutes() === 0) return { added: 0, end: new Date(t) };
  for (var n = this.$gantt.date.add(this.$gantt.date.hour_start(new Date(t)), 1, "hour"), i = 0, a = e, r = this._getIntervalTimestamp(t, n), s = this._getWorkHours(t), o = 0; o < s.length && i < e; o++) {
    var l = s[o];
    if (r.end >= l.start && r.start <= l.end) {
      var c = Math.max(l.start, r.start), d = Math.min(l.end, r.end), u = (d - c) / 60;
      u > a && (u = a, d = c + 60 * a);
      var h = Math.round((d - c) / 60);
      a -= h, i += h, r.start = d;
    }
  }
  var _ = n;
  return i === e && (_ = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, r.start)), { added: i, end: _ };
}, _subtractMinutesUntilHourStart: function(t, e) {
  for (var n = this.$gantt.date.hour_start(new Date(t)), i = 0, a = e, r = 60 * n.getHours() * 60 + 60 * n.getMinutes() + n.getSeconds(), s = 60 * t.getHours() * 60 + 60 * t.getMinutes() + t.getSeconds(), o = this._getWorkHours(t), l = o.length - 1; l >= 0 && i < e; l--) {
    var c = o[l];
    if (s > c.start && r <= c.end) {
      var d = Math.min(s, c.end), u = Math.max(r, c.start), h = (d - u) / 60;
      h > a && (h = a, u = d - 60 * a);
      var _ = Math.abs(Math.round((d - u) / 60));
      a -= _, i += _, s = u;
    }
  }
  var p = n;
  return i === e && (p = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, s)), { added: i, end: p };
}, _subtractMinuteDate: function(t, e, n) {
  var i = this.getClosestWorkTime({ date: t, dir: "past", unit: "minute" }), a = 0;
  n = n || -1, e = Math.abs(1 * e), e = Math.round(e);
  const r = this._isMinutePrecision(i);
  let s = this._subtractMinutesUntilHourStart(i, e);
  a += s.added, i = s.end;
  for (var o = 0, l = [], c = 0; a < e; ) {
    var d = this.$gantt.date.day_start(new Date(i)), u = !1;
    i.valueOf() === d.valueOf() && (d = this.$gantt.date.add(d, -1, "day"), u = !0);
    var h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).valueOf();
    h !== o && (l = this._getWorkHours(d), c = this._getMinutesPerDay(d), o = h);
    var _ = e - a, p = this._getTimeOfDayStamp(i, u);
    if (l.length && c) if (l[l.length - 1].end <= p && _ > c) a += c, i = this.$gantt.date.add(i, -1, "day");
    else {
      for (var y = !1, k = null, b = null, g = l.length - 1; g >= 0; g--) if (l[g].start < p - 1 && l[g].end >= p - 1) {
        y = !0, k = l[g], b = l[g - 1];
        break;
      }
      if (y) if (p === k.end && _ >= k.durationMinutes) a += k.durationMinutes, i = this.$gantt.date.add(i, -k.durationMinutes, "minute");
      else if (!r && _ <= p / 60 - k.startMinute) a += _, i = this.$gantt.date.add(i, -_, "minute");
      else if (r) _ <= p / 60 - k.startMinute ? (a += _, i = this.$gantt.date.add(i, -_, "minute")) : (a += p / 60 - k.startMinute, i = b ? new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, b.end) : this.$gantt.date.day_start(i));
      else {
        var m = this._getMinutesPerHour(i);
        m <= _ ? (a += m, i = this._nextDate(i, "hour", n)) : (s = this._subtractMinutesUntilHourStart(i, _), a += s.added, i = s.end);
      }
      else if (i.getHours() === 0 && i.getMinutes() === 0 && i.getSeconds() === 0) {
        if ((f = this._getClosestWorkTimePast(i, "hour")).valueOf() === i.valueOf()) {
          var f = this.$gantt.date.add(i, -1, "day"), v = this._getWorkHours(f);
          if (v.length) {
            var x = v[v.length - 1];
            f.setSeconds(x.durationSeconds);
          }
        }
        i = f;
      } else i = this._getClosestWorkTimePast(new Date(i - 1), "hour");
    }
    else i = this.$gantt.date.add(i, -1, "day");
  }
  if (a < e) {
    var $ = e - a;
    s = this._subtractMinutesUntilHourStart(i, $), a += s.added, i = s.end;
  }
  return i;
}, _calculateMinuteEndDate: function(t, e, n) {
  var i = new Date(t), a = 0;
  n = n || 1, e = Math.abs(1 * e), e = Math.round(e);
  var r = this._addMinutesUntilHourEnd(i, e);
  a += r.added, i = r.end;
  for (var s = 0, o = [], l = 0, c = this._isMinutePrecision(i); a < e; ) {
    var d = this.$gantt.date.day_start(new Date(i)).valueOf();
    d !== s && (o = this._getWorkHours(i), l = this._getMinutesPerDay(i), s = d);
    var u = e - a, h = this._getTimeOfDayStamp(i);
    if (o.length && l) if (o[0].start >= h && u >= l) {
      if (a += l, u == l) {
        i = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, o[o.length - 1].end);
        break;
      }
      i = this.$gantt.date.add(i, 1, "day"), i = this.$gantt.date.day_start(i);
    } else {
      for (var _ = !1, p = null, y = 0; y < o.length; y++) if (o[y].start <= h && o[y].end > h) {
        _ = !0, p = o[y];
        break;
      }
      if (_) if (h === p.start && u >= p.durationMinutes) a += p.durationMinutes, i = this.$gantt.date.add(i, p.durationMinutes, "minute");
      else if (u <= p.endMinute - h / 60) a += u, i = this.$gantt.date.add(i, u, "minute");
      else {
        var k = this._getMinutesPerHour(i);
        k <= u ? (a += k, i = c ? this.$gantt.date.add(i, k, "minute") : this._nextDate(i, "hour", n)) : (a += (r = this._addMinutesUntilHourEnd(i, u)).added, i = r.end);
      }
      else i = this._getClosestWorkTimeFuture(i, "hour");
    }
    else i = this.$gantt.date.add(this.$gantt.date.day_start(i), 1, "day");
  }
  if (a < e) {
    var b = e - a;
    a += (r = this._addMinutesUntilHourEnd(i, b)).added, i = r.end;
  }
  return i;
}, getClosestWorkTime: function() {
  var t = this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, arguments);
  return this._getClosestWorkTime(t.date, t.unit, t.dir);
}, _getClosestWorkTime: function(t, e, n) {
  var i = new Date(t);
  if (this._isWorkTime(i, e)) return i;
  if (i = this.$gantt.date[e + "_start"](i), n != "any" && n) i = n == "past" ? this._getClosestWorkTimePast(i, e) : this._getClosestWorkTimeFuture(i, e);
  else {
    var a = this._getClosestWorkTimeFuture(i, e), r = this._getClosestWorkTimePast(i, e);
    i = Math.abs(a - t) <= Math.abs(t - r) ? a : r;
  }
  return i;
}, _getClosestWorkTimeFuture: function(t, e) {
  return this._getClosestWorkTimeGeneric(t, e, 1);
}, _getClosestWorkTimePast: function(t, e) {
  var n = this._getClosestWorkTimeGeneric(t, e, -1);
  return this.$gantt.date.add(n, 1, e);
}, _findClosestTimeInDay: function(t, e, n) {
  var i = new Date(t), a = null, r = !1;
  this._getWorkHours(i).length || (i = this._getClosestWorkTime(i, "day", e < 0 ? "past" : "future"), e < 0 && (i = new Date(i.valueOf() - 1), r = !0), n = this._getWorkHours(i));
  var s = this._getTimeOfDayStamp(i);
  if (r && (s = this._getTimeOfDayStamp(new Date(i.valueOf() + 1), r)), e > 0) {
    for (var o = 0; o < n.length; o++) if (n[o].start >= s) {
      a = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, n[o].start);
      break;
    }
  } else for (o = n.length - 1; o >= 0; o--) {
    if (n[o].end <= s) {
      a = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, n[o].end);
      break;
    }
    if (n[o].end > s && n[o].start <= s) {
      a = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, s);
      break;
    }
  }
  return a;
}, _getClosestWorkMinute: function(t, e, n) {
  var i = new Date(t), a = this._getWorkHours(i), r = this._findClosestTimeInDay(i, n, a);
  return r || (n > 0 ? (i = this.calculateEndDate(i, n, e), i = this.$gantt.date.day_start(i)) : (i = this.calculateEndDate(i, n, "day"), i = this.$gantt.date.day_start(i), i = this.$gantt.date.add(i, 1, "day"), i = new Date(i.valueOf() - 1)), a = this._getWorkHours(i), r = this._findClosestTimeInDay(i, n, a)), n < 0 && (r = this.$gantt.date.add(r, -1, e)), r;
}, _getClosestWorkTimeGeneric: function(t, e, n) {
  if (e === "hour" || e === "minute") return this._getClosestWorkMinute(t, e, n);
  for (var i = this._getUnitOrder(e), a = this.units[i - 1], r = t, s = 0; !this._isWorkTime(r, e) && (!a || this._isWorkTime(r, a) || (r = n > 0 ? this._getClosestWorkTimeFuture(r, a) : this._getClosestWorkTimePast(r, a), !this._isWorkTime(r, e))); ) {
    if (++s > 3e3) return this.$gantt.assert(!1, "Invalid working time check"), !1;
    var o = r.getTimezoneOffset();
    r = this.$gantt.date.add(r, n, e), r = this.$gantt._correct_dst_change(r, o, n, e), this.$gantt.date[e + "_start"] && (r = this.$gantt.date[e + "_start"](r));
  }
  return r;
}, hasWorkTime: function() {
  var t = this.getConfig(), e = t.dates;
  for (var n in t.dates) ;
  var i = this._checkWorkHours(t.hours), a = !1;
  return [0, 1, 2, 3, 4, 5, 6].forEach((function(r) {
    if (!a) {
      var s = e[r];
      s === !0 ? a = i : Array.isArray(s) && (a = this._checkWorkHours(s));
    }
  }).bind(this)), a;
}, _checkWorkHours: function(t) {
  if (t.length === 0) return !1;
  for (var e = !1, n = 0; n < t.length; n += 2) t[n] !== t[n + 1] && (e = !0);
  return e;
}, _isMinutePrecision: function(t) {
  let e = !1;
  return this._getWorkHours(t).forEach(function(n) {
    (n.startMinute % 60 || n.endMinute % 60) && (e = !0);
  }), e;
} };
const It = { isLegacyResourceCalendarFormat: function(t) {
  if (!t) return !1;
  for (var e in t) if (t[e] && typeof t[e] == "object") return !0;
  return !1;
}, getResourceProperty: function(t) {
  var e = t.resource_calendars, n = t.resource_property;
  if (this.isLegacyResourceCalendarFormat(e)) for (var i in t) {
    n = i;
    break;
  }
  return n;
}, getCalendarIdFromLegacyConfig: function(t, e) {
  if (e) for (var n in e) {
    var i = e[n];
    if (t[n]) {
      var a = i[t[n]];
      if (a) return a;
    }
  }
  return null;
} }, bi = (Wt = {}, { getCalendarIdFromMultipleResources: function(t, e) {
  var n = function(a) {
    return a.map(function(r) {
      return r && r.resource_id ? r.resource_id : r;
    }).sort().join("-");
  }(t);
  if (t.length) {
    if (t.length === 1) return e.getResourceCalendar(n).id;
    if (Wt[n]) return Wt[n].id;
    var i = function(a, r) {
      return r.mergeCalendars(a.map(function(s) {
        var o = s && s.resource_id ? s.resource_id : s;
        return r.getResourceCalendar(o);
      }));
    }(t, e);
    return Wt[n] = i, e.addCalendar(i);
  }
  return null;
} });
var Wt;
function fn(t) {
  this.$gantt = t, this._calendars = {}, this._legacyConfig = void 0, this.$gantt.attachEvent("onGanttReady", (function() {
    this.$gantt.config.resource_calendars && (this._isLegacyConfig = It.isLegacyResourceCalendarFormat(this.$gantt.config.resource_calendars));
  }).bind(this)), this.$gantt.attachEvent("onBeforeGanttReady", (function() {
    this.createDefaultCalendars();
  }).bind(this)), this.$gantt.attachEvent("onBeforeGanttRender", (function() {
    this.createDefaultCalendars();
  }).bind(this));
}
function be(t, e) {
  this.argumentsHelper = e, this.$gantt = t;
}
function pn(t) {
  this.$gantt = t.$gantt, this.argumentsHelper = _n(this.$gantt), this.calendarManager = t, this.$disabledCalendar = new be(this.$gantt, this.argumentsHelper);
}
fn.prototype = { _calendars: {}, _convertWorkTimeSettings: function(t) {
  var e = t.days;
  if (e && !t.dates) {
    t.dates = t.dates || {};
    for (var n = 0; n < e.length; n++) t.dates[n] = e[n], e[n] instanceof Array || (t.dates[n] = !!e[n]);
  }
  return delete t.days, t;
}, mergeCalendars: function() {
  var t = [], e = arguments;
  if (Array.isArray(e[0])) t = e[0].slice();
  else for (var n = 0; n < arguments.length; n++) t.push(arguments[n]);
  var i, a = new gn();
  return t.forEach((function(r) {
    i = i ? this._createCalendarFromConfig(a.merge(i, r)) : r;
  }).bind(this)), this.createCalendar(i);
}, _createCalendarFromConfig: function(t) {
  var e = new ye(this.$gantt, _n(this.$gantt));
  e.id = String(st());
  var n = this._convertWorkTimeSettings(t);
  if (n.customWeeks) for (var i in n.customWeeks) n.customWeeks[i] = this._convertWorkTimeSettings(n.customWeeks[i]);
  return e._setConfig(n), e;
}, createCalendar: function(t) {
  var e;
  return t || (t = {}), P(e = t.getConfig ? q(t.getConfig()) : t.worktime ? q(t.worktime) : q(t), q(this.defaults.fulltime.worktime)), this._createCalendarFromConfig(e);
}, getCalendar: function(t) {
  t = t || "global";
  var e = this._calendars[t];
  return e || (this.createDefaultCalendars(), e = this._calendars[t]), e;
}, getCalendars: function() {
  var t = [];
  for (var e in this._calendars) t.push(this.getCalendar(e));
  return t;
}, _getOwnCalendar: function(t) {
  var e = this.$gantt.config;
  if (t[e.calendar_property]) return this.getCalendar(t[e.calendar_property]);
  if (e.resource_calendars) {
    var n;
    if (n = this._legacyConfig === !1 ? e.resource_property : It.getResourceProperty(e), Array.isArray(t[n]) && t[n].length) e.dynamic_resource_calendars ? i = bi.getCalendarIdFromMultipleResources(t[n], this) : a = this.getResourceCalendar(t[n]);
    else if (this._legacyConfig === void 0 && (this._legacyConfig = It.isLegacyResourceCalendarFormat(e.resource_calendars)), this._legacyConfig) var i = It.getCalendarIdFromLegacyConfig(t, e.resource_calendars);
    else if (n && t[n] && e.resource_calendars[t[n]]) var a = this.getResourceCalendar(t[n]);
    if (i && (a = this.getCalendar(i)), a) return a;
  }
  return null;
}, getResourceCalendar: function(t) {
  if (t == null) return this.getCalendar();
  var e = null;
  e = typeof t == "number" || typeof t == "string" ? t : t.id || t.key;
  var n = this.$gantt.config, i = n.resource_calendars, a = null;
  if (Array.isArray(t) && t.length === 1 && (e = typeof t[0] == "object" ? t[0].resource_id : t[0]), i) {
    if (this._legacyConfig === void 0 && (this._legacyConfig = It.isLegacyResourceCalendarFormat(n.resource_calendars)), this._legacyConfig) {
      for (var r in i) if (i[r][e]) {
        a = i[r][e];
        break;
      }
    } else a = i[e];
    if (a) return this.getCalendar(a);
  }
  return this.getCalendar();
}, getTaskCalendar: function(t) {
  var e, n = this.$gantt;
  if (t == null) return this.getCalendar();
  if (!(e = typeof t != "number" && typeof t != "string" || !n.isTaskExists(t) ? t : n.getTask(t))) return this.getCalendar();
  var i = this._getOwnCalendar(e), a = !!n.getState().group_mode;
  if (!i && n.config.inherit_calendar && n.isTaskExists(e.parent)) {
    for (var r = e; n.isTaskExists(r.parent) && (r = n.getTask(r.parent), !n.isSummaryTask(r) || !(i = this._getOwnCalendar(r))); ) ;
    a && !i && t.$effective_calendar && (i = this.getCalendar(t.$effective_calendar));
  }
  return i || this.getCalendar();
}, addCalendar: function(t) {
  if (!this.isCalendar(t)) {
    var e = t.id;
    (t = this.createCalendar(t)).id = e;
  }
  if (t._tryChangeCalendarSettings(function() {
  })) {
    var n = this.$gantt.config;
    return t.id = t.id || st(), this._calendars[t.id] = t, n.worktimes || (n.worktimes = {}), n.worktimes[t.id] = t.getConfig(), t.id;
  }
  return this.$gantt.callEvent("onCalendarError", [{ message: "Invalid calendar settings, no worktime available" }, t]), null;
}, deleteCalendar: function(t) {
  var e = this.$gantt.config;
  return !!t && !!this._calendars[t] && (delete this._calendars[t], e.worktimes && e.worktimes[t] && delete e.worktimes[t], !0);
}, restoreConfigCalendars: function(t) {
  for (var e in t) if (!this._calendars[e]) {
    var n = t[e], i = this.createCalendar(n);
    i.id = e, this.addCalendar(i);
  }
}, defaults: { global: { id: "global", worktime: { hours: [8, 12, 13, 17], days: [0, 1, 1, 1, 1, 1, 0] } }, fulltime: { id: "fulltime", worktime: { hours: [0, 24], days: [1, 1, 1, 1, 1, 1, 1] } } }, createDefaultCalendars: function() {
  var t = this.$gantt.config;
  this.restoreConfigCalendars(this.defaults), this.restoreConfigCalendars(t.worktimes);
}, isCalendar: function(t) {
  return [t.isWorkTime, t.setWorkTime, t.getWorkHours, t.unsetWorkTime, t.getClosestWorkTime, t.calculateDuration, t.hasDuration, t.calculateEndDate].every(function(e) {
    return e instanceof Function;
  });
} }, be.prototype = { getWorkHours: function() {
  return [0, 24];
}, setWorkTime: function() {
  return !0;
}, unsetWorkTime: function() {
  return !0;
}, isWorkTime: function() {
  return !0;
}, getClosestWorkTime: function(t) {
  return this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, arguments).date;
}, calculateDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments), e = t.start_date, n = t.end_date, i = t.unit, a = t.step;
  return this._calculateDuration(e, n, i, a);
}, _calculateDuration: function(t, e, n, i) {
  var a = this.$gantt.date, r = { week: 6048e5, day: 864e5, hour: 36e5, minute: 6e4 }, s = 0;
  if (r[n]) s = Math.round((e - t) / (i * r[n]));
  else {
    for (var o = new Date(t), l = new Date(e); o.valueOf() < l.valueOf(); ) s += 1, o = a.add(o, i, n);
    o.valueOf() != e.valueOf() && (s += (l - o) / (a.add(o, i, n) - o));
  }
  return Math.round(s);
}, hasDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments), e = t.start_date, n = t.end_date;
  return !!t.unit && (e = new Date(e), n = new Date(n), e.valueOf() < n.valueOf());
}, hasWorkTime: function() {
  return !0;
}, equals: function(t) {
  return t instanceof be;
}, calculateEndDate: function() {
  var t = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, arguments), e = t.start_date, n = t.duration, i = t.unit, a = t.step;
  return this.$gantt.date.add(e, a * n, i);
} }, pn.prototype = { _getCalendar: function(t) {
  var e;
  if (this.$gantt.config.work_time) {
    var n = this.calendarManager;
    t.task ? e = n.getTaskCalendar(t.task) : t.id ? e = n.getTaskCalendar(t) : t.calendar && (e = t.calendar), e || (e = n.getTaskCalendar());
  } else e = this.$disabledCalendar;
  return e;
}, getWorkHours: function(t) {
  return t = this.argumentsHelper.getWorkHoursArguments.apply(this.argumentsHelper, arguments), this._getCalendar(t).getWorkHours(t.date);
}, setWorkTime: function(t, e) {
  return t = this.argumentsHelper.setWorkTimeArguments.apply(this.argumentsHelper, arguments), e || (e = this.calendarManager.getCalendar()), e.setWorkTime(t);
}, unsetWorkTime: function(t, e) {
  return t = this.argumentsHelper.unsetWorkTimeArguments.apply(this.argumentsHelper, arguments), e || (e = this.calendarManager.getCalendar()), e.unsetWorkTime(t);
}, isWorkTime: function(t, e, n, i) {
  var a = this.argumentsHelper.isWorkTimeArguments.apply(this.argumentsHelper, arguments);
  return (i = this._getCalendar(a)).isWorkTime(a);
}, getClosestWorkTime: function(t) {
  return t = this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, arguments), this._getCalendar(t).getClosestWorkTime(t);
}, calculateDuration: function() {
  var t = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments);
  return this._getCalendar(t).calculateDuration(t);
}, hasDuration: function() {
  var t = this.argumentsHelper.hasDurationArguments.apply(this.argumentsHelper, arguments);
  return this._getCalendar(t).hasDuration(t);
}, calculateEndDate: function(t) {
  return t = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, arguments), this._getCalendar(t).calculateEndDate(t);
} };
const xi = function(t, e) {
  return { getWorkHours: function(n) {
    return e.getWorkHours(n);
  }, setWorkTime: function(n) {
    return e.setWorkTime(n);
  }, unsetWorkTime: function(n) {
    e.unsetWorkTime(n);
  }, isWorkTime: function(n, i, a) {
    return e.isWorkTime(n, i, a);
  }, getClosestWorkTime: function(n) {
    return e.getClosestWorkTime(n);
  }, calculateDuration: function(n, i, a) {
    return e.calculateDuration(n, i, a);
  }, _hasDuration: function(n, i, a) {
    return e.hasDuration(n, i, a);
  }, calculateEndDate: function(n, i, a, r) {
    return e.calculateEndDate(n, i, a, r);
  }, mergeCalendars: R(t.mergeCalendars, t), createCalendar: R(t.createCalendar, t), addCalendar: R(t.addCalendar, t), getCalendar: R(t.getCalendar, t), getCalendars: R(t.getCalendars, t), getResourceCalendar: R(t.getResourceCalendar, t), getTaskCalendar: R(t.getTaskCalendar, t), deleteCalendar: R(t.deleteCalendar, t) };
};
function $i(t) {
  t.isUnscheduledTask = function(s) {
    return t.assert(s && s instanceof Object, "Invalid argument <b>task</b>=" + s + " of gantt.isUnscheduledTask. Task object was expected"), !!s.unscheduled || !s.start_date;
  }, t._isAllowedUnscheduledTask = function(s) {
    return !(!s.unscheduled || !t.config.show_unscheduled);
  }, t._isTaskInTimelineLimits = function(s) {
    var o = s.start_date ? s.start_date.valueOf() : null, l = s.end_date ? s.end_date.valueOf() : null;
    return !!(o && l && o <= this._max_date.valueOf() && l >= this._min_date.valueOf());
  }, t.isTaskVisible = function(s) {
    if (!this.isTaskExists(s)) return !1;
    var o = this.getTask(s);
    return !(!this._isAllowedUnscheduledTask(o) && !this._isTaskInTimelineLimits(o)) && this.getGlobalTaskIndex(s) >= 0;
  }, t._getProjectEnd = function() {
    if (t.config.project_end) return t.config.project_end;
    var s = t.getTaskByTime();
    return (s = s.sort(function(o, l) {
      return +o.end_date > +l.end_date ? 1 : -1;
    })).length ? s[s.length - 1].end_date : null;
  }, t._getProjectStart = function() {
    if (t.config.project_start) return t.config.project_start;
    if (t.config.start_date) return t.config.start_date;
    if (t.getState().min_date) return t.getState().min_date;
    var s = t.getTaskByTime();
    return (s = s.sort(function(o, l) {
      return +o.start_date > +l.start_date ? 1 : -1;
    })).length ? s[0].start_date : null;
  };
  var e = function(s, o) {
    var l = !!(o && o != t.config.root_id && t.isTaskExists(o)) && t.getTask(o), c = null;
    if (l) if (t.config.schedule_from_end) c = t.calculateEndDate({ start_date: l.end_date, duration: -t.config.duration_step, task: s });
    else {
      if (!l.start_date) return e(l, t.getParent(l));
      c = l.start_date;
    }
    else if (t.config.schedule_from_end) c = t.calculateEndDate({ start_date: t._getProjectEnd(), duration: -t.config.duration_step, task: s });
    else {
      const d = t.getTaskByIndex(0), u = t.config.start_date || t.getState().min_date;
      c = d ? d.start_date ? d.start_date : d.end_date ? t.calculateEndDate({ start_date: d.end_date, duration: -t.config.duration_step, task: s }) : u : u;
    }
    return t.assert(c, "Invalid dates"), new Date(c);
  };
  t._set_default_task_timing = function(s) {
    s.start_date = s.start_date || e(s, t.getParent(s)), s.duration = s.duration || t.config.duration_step, s.end_date = s.end_date || t.calculateEndDate(s);
  }, t.createTask = function(s, o, l) {
    if (s = s || {}, t.defined(s.id) || (s.id = t.uid()), s.start_date || (s.start_date = e(s, o)), s.text === void 0 && (s.text = t.locale.labels.new_task), s.duration === void 0 && (s.duration = 1), this.isTaskExists(o)) {
      this.setParent(s, o, !0);
      var c = this.getTask(o);
      c.$open = !0, this.config.details_on_create || this.callEvent("onAfterParentExpand", [o, c]);
    }
    return this.callEvent("onTaskCreated", [s]) ? (this.config.details_on_create ? (t.isTaskExists(s.id) ? t.getTask(s.id).$index != s.$index && (s.start_date && typeof s.start_date == "string" && (s.start_date = this.date.parseDate(s.start_date, "parse_date")), s.end_date && typeof s.end_date == "string" && (s.end_date = this.date.parseDate(s.end_date, "parse_date")), this.$data.tasksStore.updateItem(s.id, s)) : (s.$new = !0, this.silent(function() {
      t.$data.tasksStore.addItem(s, l);
    })), this.selectTask(s.id), this.refreshData(), this.showLightbox(s.id)) : this.addTask(s, o, l) && (this.showTask(s.id), this.selectTask(s.id)), s.id) : null;
  }, t._update_flags = function(s, o) {
    var l = t.$data.tasksStore;
    s === void 0 ? (this._lightbox_id = null, l.silent(function() {
      l.unselect();
    }), this.getSelectedTasks && this._multiselect.reset(), this._tasks_dnd && this._tasks_dnd.drag && (this._tasks_dnd.drag.id = null)) : (this._lightbox_id == s && (this._lightbox_id = o), l.getSelectedId() == s && l.silent(function() {
      l.unselect(s), l.select(o);
    }), this._tasks_dnd && this._tasks_dnd.drag && this._tasks_dnd.drag.id == s && (this._tasks_dnd.drag.id = o));
  };
  var n = function(s, o) {
    var l = t.getTaskType(s.type), c = { type: l, $no_start: !1, $no_end: !1, scheduled_summary: !1 };
    return l === t.config.types.project && s.auto_scheduling === !1 && (c.scheduled_summary = !0), o || l != s.$rendered_type ? (l == t.config.types.project ? c.$no_end = c.$no_start = !0 : l != t.config.types.milestone && (c.$no_end = !(s.end_date || s.duration), c.$no_start = !s.start_date, t._isAllowedUnscheduledTask(s) && (c.$no_end = c.$no_start = !1)), c) : (c.$no_start = s.$no_start, c.$no_end = s.$no_end, c);
  };
  function i(s) {
    s.$effective_calendar = t.getTaskCalendar(s).id, s.start_date = t.getClosestWorkTime({ dir: "future", date: s.start_date, unit: t.config.duration_unit, task: s }), s.end_date = t.calculateEndDate(s);
  }
  function a(s, o, l, c) {
    const d = { start: "start_date", end: "end_date" }, u = { start: "$auto_start_date", end: "$auto_end_date" };
    let h;
    h = s.type === t.config.types.project && s.auto_scheduling === !1 ? u : d, o.$no_start && (s[h.start] = l ? new Date(l) : e(s, this.getParent(s))), o.$no_end && (s[h.end] = c ? new Date(c) : this.calculateEndDate({ start_date: s[h.start], duration: this.config.duration_step, task: s })), (o.$no_start || o.$no_end) && this._init_task_timing(s);
  }
  function r(s) {
    var o = null, l = null, c = s !== void 0 ? s : t.config.root_id, d = [];
    return t.eachTask(function(u) {
      const h = t.getTaskType(u.type) == t.config.types.project && u.auto_scheduling === !1;
      t.getTaskType(u.type) == t.config.types.project && !h || t.isUnscheduledTask(u) || (u.rollup && d.push(u.id), !u.start_date || u.$no_start && !h || o && !(o > u.start_date.valueOf()) || (o = u.start_date.valueOf()), !u.end_date || u.$no_end && !h || l && !(l < u.end_date.valueOf()) || (l = u.end_date.valueOf()));
    }, c), { start_date: o ? new Date(o) : null, end_date: l ? new Date(l) : null, rollup: d };
  }
  t._init_task_timing = function(s) {
    var o = n(s, !0), l = s.$rendered_type != o.type, c = o.type;
    l && (s.$no_start = o.$no_start, s.$no_end = o.$no_end, s.$rendered_type = o.type), l && c != this.config.types.milestone && c == this.config.types.project && (this._set_default_task_timing(s), s.$calculate_duration = !1), c == this.config.types.milestone && (s.end_date = s.start_date), s.start_date && s.end_date && s.$calculate_duration !== !1 && (s.duration = this.calculateDuration(s)), s.$calculate_duration || (s.$calculate_duration = !0), s.end_date || (s.end_date = s.start_date), s.duration = s.duration || 0, this.config.min_duration === 0 && s.duration === 0 && (s.$no_end = !1, s.type === t.config.types.project && t.hasChild(s.id) && (s.$no_end = !0));
    var d = this.getTaskCalendar(s);
    s.$effective_calendar && s.$effective_calendar !== d.id && (i(s), this.config.inherit_calendar && this.isSummaryTask(s) && this.eachTask(function(u) {
      i(u);
    }, s.id)), s.$effective_calendar = d.id;
  }, t.isSummaryTask = function(s) {
    t.assert(s && s instanceof Object, "Invalid argument <b>task</b>=" + s + " of gantt.isSummaryTask. Task object was expected");
    var o = n(s);
    return !(!o.$no_end && !o.$no_start);
  }, t.resetProjectDates = function(s) {
    var o = n(s);
    if (o.$no_end || o.$no_start) {
      var l = r(s.id);
      a.call(this, s, o, l.start_date, l.end_date), s.$rollup = l.rollup;
    }
  }, t.getSubtaskDuration = function(s) {
    var o = 0, l = s !== void 0 ? s : t.config.root_id;
    return this.eachTask(function(c) {
      this.getTaskType(c.type) == t.config.types.project || this.isUnscheduledTask(c) || (o += c.duration);
    }, l), o;
  }, t.getSubtaskDates = function(s) {
    var o = r(s);
    return { start_date: o.start_date, end_date: o.end_date };
  }, t._update_parents = function(s, o, l) {
    if (s) {
      var c = this.getTask(s);
      c.rollup && (l = !0);
      var d = this.getParent(c), u = n(c), h = !0;
      if (l || c.start_date && c.end_date && (u.$no_start || u.$no_end)) {
        const y = c.$auto_start_date ? "$auto_start_date" : "start_date", k = c.$auto_end_date ? "$auto_end_date" : "end_date";
        var _ = c[y].valueOf(), p = c[k].valueOf();
        t.resetProjectDates(c), l || _ != c[y].valueOf() || p != c[k].valueOf() || (h = !1), h && !o && this.refreshTask(c.id, !0), u.scheduled_summary && (h = !0);
      }
      h && d && this.isTaskExists(d) && this._update_parents(d, o, l);
    }
  }, t.roundDate = function(s) {
    var o = t.getScale();
    Q(s) && (s = { date: s, unit: o ? o.unit : t.config.duration_unit, step: o ? o.step : t.config.duration_step });
    var l, c, d, u = s.date, h = s.step, _ = s.unit;
    if (!o) return u;
    if (_ == o.unit && h == o.step && +u >= +o.min_date && +u <= +o.max_date) d = Math.floor(t.columnIndexByDate(u)), o.trace_x[d] || (d -= 1, o.rtl && (d = 0)), c = new Date(o.trace_x[d]), l = t.date.add(c, h, _);
    else {
      for (d = Math.floor(t.columnIndexByDate(u)), l = t.date[_ + "_start"](new Date(o.min_date)), o.trace_x[d] && (l = t.date[_ + "_start"](o.trace_x[d])); +l < +u; ) {
        var p = (l = t.date[_ + "_start"](t.date.add(l, h, _))).getTimezoneOffset();
        l = t._correct_dst_change(l, p, l, _), t.date[_ + "_start"] && (l = t.date[_ + "_start"](l));
      }
      c = t.date.add(l, -1 * h, _);
    }
    return s.dir && s.dir == "future" ? l : s.dir && s.dir == "past" || Math.abs(u - c) < Math.abs(l - u) ? c : l;
  }, t.correctTaskWorkTime = function(s) {
    t.config.work_time && t.config.correct_work_time && (this.isWorkTime(s.start_date, void 0, s) ? this.isWorkTime(new Date(+s.end_date - 1), void 0, s) || (s.end_date = this.calculateEndDate(s)) : (s.start_date = this.getClosestWorkTime({ date: s.start_date, dir: "future", task: s }), s.end_date = this.calculateEndDate(s)));
  }, t.attachEvent("onBeforeTaskUpdate", function(s, o) {
    return t._init_task_timing(o), !0;
  }), t.attachEvent("onBeforeTaskAdd", function(s, o) {
    return t._init_task_timing(o), !0;
  }), t.attachEvent("onAfterTaskMove", function(s, o, l) {
    return t._init_task_timing(t.getTask(s)), !0;
  });
}
function Oe(t, e) {
  var n, i = t.config.container_resize_timeout || 20;
  let a = Be(t);
  if (t.config.container_resize_method == "timeout") l();
  else try {
    t.event(e, "resize", function() {
      if (t.$scrollbarRepaint) t.$scrollbarRepaint = null;
      else {
        let c = Be(t);
        if (a.x == c.x && a.y == c.y) return;
        a = c, r();
      }
    });
  } catch {
    l();
  }
  function r() {
    clearTimeout(n), n = setTimeout(function() {
      t.$destroyed || t.render();
    }, i);
  }
  var s = t.$root.offsetHeight, o = t.$root.offsetWidth;
  function l() {
    t.$root.offsetHeight == s && t.$root.offsetWidth == o || r(), s = t.$root.offsetHeight, o = t.$root.offsetWidth, setTimeout(l, i);
  }
}
function Be(t) {
  return { x: t.$root.offsetWidth, y: t.$root.offsetHeight };
}
function wi(t) {
  t.assert = /* @__PURE__ */ function(r) {
    return function(s, o) {
      s || r.config.show_errors && r.callEvent("onError", [o]) !== !1 && (r.message ? r.message({ type: "error", text: o, expire: -1 }) : console.log(o));
    };
  }(t);
  var e = "Invalid value of the first argument of `gantt.init`. Supported values: HTMLElement, String (element id).This error means that either invalid object is passed into `gantt.init` or that the element with the specified ID doesn't exist on the page when `gantt.init` is called.";
  function n(r) {
    if (!r || typeof r == "string" && document.getElementById(r) || function(s) {
      try {
        s.cloneNode(!1);
      } catch {
        return !1;
      }
      return !0;
    }(r)) return !0;
    throw t.assert(!1, e), new Error(e);
  }
  t.init = function(r, s, o) {
    t.env.isNode ? r = null : n(r), s && o && (this.config.start_date = this._min_date = new Date(s), this.config.end_date = this._max_date = new Date(o)), this.date.init(), this.init = function(l) {
      t.env.isNode ? l = null : n(l), this.$container && this.$container.parentNode && (this.$container.parentNode.removeChild(this.$container), this.$container = null), this.$layout && this.$layout.clear(), this._reinit(l);
    }, this._reinit(r);
  }, t._quickRefresh = function(r) {
    for (var s = this._getDatastores.call(this), o = 0; o < s.length; o++) s[o]._quick_refresh = !0;
    for (r(), o = 0; o < s.length; o++) s[o]._quick_refresh = !1;
  };
  var i = (function() {
    this._clearTaskLayers && this._clearTaskLayers(), this._clearLinkLayers && this._clearLinkLayers(), this.$layout && (this.$layout.destructor(), this.$layout = null, this.$ui.reset());
  }).bind(t), a = (function() {
    F(t) || (this.$root.innerHTML = "", this.$root.gantt = this, me(this), this.config.layout.id = "main", this.$layout = this.$ui.createView("layout", this.$root, this.config.layout), this.$layout.attachEvent("onBeforeResize", function() {
      for (var r = t.$services.getService("datastores"), s = 0; s < r.length; s++) t.getDatastore(r[s]).filter(), t.$data.tasksStore._skipTaskRecalculation ? t.$data.tasksStore._skipTaskRecalculation != "lightbox" && (t.$data.tasksStore._skipTaskRecalculation = !1) : t.getDatastore(r[s]).callEvent("onBeforeRefreshAll", []);
    }), this.$layout.attachEvent("onResize", function() {
      t._quickRefresh(function() {
        t.refreshData();
      });
    }), this.callEvent("onGanttLayoutReady", []), this.$layout.render(), this.$container = this.$layout.$container.firstChild, function(r) {
      window.getComputedStyle(r.$root).getPropertyValue("position") == "static" && (r.$root.style.position = "relative");
      var s = document.createElement("iframe");
      s.className = "gantt_container_resize_watcher", s.tabIndex = -1, r.config.wai_aria_attributes && (s.setAttribute("role", "none"), s.setAttribute("aria-hidden", !0)), r.env.isSalesforce && (r.config.container_resize_method = "timeout"), r.$root.appendChild(s), s.contentWindow ? Oe(r, s.contentWindow) : (r.$root.removeChild(s), Oe(r, window));
    }(this));
  }).bind(t);
  t.resetLayout = function() {
    i(), a(), this.render();
  }, t._reinit = function(r) {
    this.callEvent("onBeforeGanttReady", []), this._update_flags(), this.$services.getService("templateLoader").initTemplates(this), i(), this.$root = null, r && (this.$root = we(r), a(), this.$mouseEvents.reset(this.$root), function(s) {
      s.$container && !s.config.autosize && s.$root.offsetHeight < 50 && console.warn(`The Gantt container has a small height, so you cannot see its content. If it is not intended, you need to set the 'height' style rule to the container:
https://docs.dhtmlx.com/gantt/faq.html#theganttchartisntrenderedcorrectly`);
    }(t)), this.callEvent("onTemplatesReady", []), this.callEvent("onGanttReady", []), this.render();
  }, t.$click = { buttons: { edit: function(r) {
    t.isReadonly(t.getTask(r)) || t.showLightbox(r);
  }, delete: function(r) {
    var s = t.getTask(r);
    if (!t.isReadonly(s)) {
      var o = t.locale.labels.confirm_deleting, l = t.locale.labels.confirm_deleting_title;
      t._delete_task_confirm({ task: s, message: o, title: l, callback: function() {
        t.isTaskExists(r) && (s.$new ? (t.$data.tasksStore._skipTaskRecalculation = "lightbox", t.silent(function() {
          t.deleteTask(r, !0);
        }), t.$data.tasksStore._skipTaskRecalculation = !1, t.refreshData()) : (t.$data.tasksStore._skipTaskRecalculation = !0, t.deleteTask(r))), t.hideLightbox();
      } });
    }
  } } }, t.render = function() {
    var r;
    if (this.callEvent("onBeforeGanttRender", []), !F(t)) {
      !this.config.sort && this._sort && (this._sort = void 0), this.$root && (this.config.rtl ? (this.$root.classList.add("gantt_rtl"), this.$root.firstChild.classList.add("gantt_rtl")) : (this.$root.classList.remove("gantt_rtl"), this.$root.firstChild.classList.remove("gantt_rtl")));
      var s = this.getScrollState(), o = s ? s.x : 0;
      this._getHorizontalScrollbar() && (o = this._getHorizontalScrollbar().$config.codeScrollLeft || o || 0), r = null, o && (r = t.dateFromPos(o + this.config.task_scroll_offset));
    }
    if (me(this), F(t)) t.refreshData();
    else {
      this.$layout.$config.autosize = this.config.autosize;
      var l = this.config.preserve_scroll;
      if (this.config.preserve_scroll = !1, this.$layout.resize(), this.config.preserve_scroll = l, this.config.preserve_scroll && s) {
        if (o || s.y) {
          var c = t.getScrollState();
          if (+r != +t.dateFromPos(c.x) || c.y != s.y) {
            o = null;
            var d = null;
            r && (o = Math.max(t.posFromDate(r) - t.config.task_scroll_offset, 0)), s.y && (d = s.y), t.scrollTo(o, d);
          }
        }
        this.$layout.getScrollbarsInfo().forEach((u) => {
          const h = t.$ui.getView(u.id), _ = t.utils.dom.isChildOf(h.$view, t.$container);
          u.boundViews.forEach((p) => {
            const y = t.$ui.getView(p);
            u.y && u.y != s.y && y && !_ && y.scrollTo(void 0, 0), u.x_pos && u.x_pos != s.x && y && _ && y.scrollTo(u.x_pos, void 0);
          });
        });
      }
    }
    this.callEvent("onGanttRender", []);
  }, t.setSizes = t.render, t.getTaskRowNode = function(r) {
    for (var s = this.$grid_data.childNodes, o = this.config.task_attribute, l = 0; l < s.length; l++)
      if (s[l].getAttribute && s[l].getAttribute(o) == r) return s[l];
    return null;
  }, t.changeLightboxType = function(r) {
    if (this.getLightboxType() == r) return !0;
    t._silent_redraw_lightbox(r);
  }, t._get_link_type = function(r, s) {
    var o = null;
    return r && s ? o = t.config.links.start_to_start : !r && s ? o = t.config.links.finish_to_start : r || s ? r && !s && (o = t.config.links.start_to_finish) : o = t.config.links.finish_to_finish, o;
  }, t.isLinkAllowed = function(r, s, o, l) {
    var c = null;
    if (!(c = typeof r == "object" ? r : { source: r, target: s, type: this._get_link_type(o, l) }) || !(c.source && c.target && c.type) || c.source == c.target) return !1;
    var d = !0;
    return this.checkEvent("onLinkValidation") && (d = this.callEvent("onLinkValidation", [c])), d;
  }, t._correct_dst_change = function(r, s, o, l) {
    var c = Vt(l) * o;
    if (c > 3600 && c < 86400) {
      var d = r.getTimezoneOffset() - s;
      d && (r = t.date.add(r, d, "minute"));
    }
    return r;
  }, t.isSplitTask = function(r) {
    return t.assert(r && r instanceof Object, "Invalid argument <b>task</b>=" + r + " of gantt.isSplitTask. Task object was expected"), this.$data.tasksStore._isSplitItem(r);
  }, t._is_icon_open_click = function(r) {
    if (!r) return !1;
    var s = r.target || r.srcElement;
    if (!s || !s.className) return !1;
    var o = X(s);
    return o.indexOf("gantt_tree_icon") !== -1 && (o.indexOf("gantt_close") !== -1 || o.indexOf("gantt_open") !== -1);
  };
}
const Si = { date: { month_full: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"], month_short: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_full: ["الأحد", "الأثنين", "ألثلاثاء", "الأربعاء", "ألحميس", "ألجمعة", "السبت"], day_short: ["احد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"] }, labels: { new_task: "مهمة جديد", icon_save: "اخزن", icon_cancel: "الغاء", icon_details: "تفاصيل", icon_edit: "تحرير", icon_delete: "حذف", confirm_closing: "التغييرات سوف تضيع, هل انت متأكد؟", confirm_deleting: "الحدث سيتم حذفها نهائيا ، هل أنت متأكد؟", section_description: "الوصف", section_time: "الفترة الزمنية", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "الغاء", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ti = { date: { month_full: ["Студзень", "Люты", "Сакавік", "Красавік", "Maй", "Чэрвень", "Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Снежань"], month_short: ["Студз", "Лют", "Сак", "Крас", "Maй", "Чэр", "Ліп", "Жнів", "Вер", "Каст", "Ліст", "Снеж"], day_full: ["Нядзеля", "Панядзелак", "Аўторак", "Серада", "Чацвер", "Пятніца", "Субота"], day_short: ["Нд", "Пн", "Аўт", "Ср", "Чцв", "Пт", "Сб"] }, labels: { new_task: "Новае заданне", icon_save: "Захаваць", icon_cancel: "Адмяніць", icon_details: "Дэталі", icon_edit: "Змяніць", icon_delete: "Выдаліць", confirm_closing: "", confirm_deleting: "Падзея будзе выдалена незваротна, працягнуць?", section_description: "Апісанне", section_time: "Перыяд часу", section_type: "Тып", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "ІСР", column_text: "Задача", column_start_date: "Пачатак", column_duration: "Працяг", column_add: "", link: "Сувязь", confirm_link_deleting: "будзе выдалена", link_start: "(пачатак)", link_end: "(канец)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Хвiлiна", hours: "Гадзiна", days: "Дзень", weeks: "Тыдзень", months: "Месяц", years: "Год", message_ok: "OK", message_cancel: "Адмяніць", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ei = { date: { month_full: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], month_short: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"], day_full: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"], day_short: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"] }, labels: { new_task: "Nova tasca", icon_save: "Guardar", icon_cancel: "Cancel·lar", icon_details: "Detalls", icon_edit: "Editar", icon_delete: "Esborrar", confirm_closing: "", confirm_deleting: "L'esdeveniment s'esborrarà definitivament, continuar ?", section_description: "Descripció", section_time: "Periode de temps", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Cancel·lar", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ci = { date: { month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], day_short: ["日", "一", "二", "三", "四", "五", "六"] }, labels: { new_task: "新任務", icon_save: "保存", icon_cancel: "关闭", icon_details: "详细", icon_edit: "编辑", icon_delete: "删除", confirm_closing: "请确认是否撤销修改!", confirm_deleting: "是否删除日程?", section_description: "描述", section_time: "时间范围", section_type: "类型", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "工作分解结构", column_text: "任务名", column_start_date: "开始时间", column_duration: "持续时间", column_add: "", link: "关联", confirm_link_deleting: "将被删除", link_start: " (开始)", link_end: " (结束)", type_task: "任务", type_project: "项目", type_milestone: "里程碑", minutes: "分钟", hours: "小时", days: "天", weeks: "周", months: "月", years: "年", message_ok: "OK", message_cancel: "关闭", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Di = { date: { month_full: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], month_short: ["Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čec", "Srp", "Září", "Říj", "List", "Pro"], day_full: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"], day_short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"] }, labels: { new_task: "Nová práce", icon_save: "Uložit", icon_cancel: "Zpět", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Smazat", confirm_closing: "", confirm_deleting: "Událost bude trvale smazána, opravdu?", section_description: "Poznámky", section_time: "Doba platnosti", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Zpět", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ai = { date: { month_full: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny opgave", icon_save: "Gem", icon_cancel: "Fortryd", icon_details: "Detaljer", icon_edit: "Tilret", icon_delete: "Slet", confirm_closing: "Dine rettelser vil gå tabt.. Er dy sikker?", confirm_deleting: "Bigivenheden vil blive slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Fortryd", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ii = { date: { month_full: [" Januar", " Februar", " März ", " April", " Mai", " Juni", " Juli", " August", " September ", " Oktober", " November ", " Dezember"], month_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], day_full: ["Sonntag", "Montag", "Dienstag", " Mittwoch", " Donnerstag", "Freitag", "Samstag"], day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"] }, labels: { new_task: "Neue Aufgabe", icon_save: "Speichern", icon_cancel: "Abbrechen", icon_details: "Details", icon_edit: "Ändern", icon_delete: "Löschen", confirm_closing: "", confirm_deleting: "Der Eintrag wird gelöscht", section_description: "Beschreibung", section_time: "Zeitspanne", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "PSP", column_text: "Task-Namen", column_start_date: "Startzeit", column_duration: "Dauer", column_add: "", link: "Link", confirm_link_deleting: "werden gelöscht", link_start: "(starten)", link_end: "(ende)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minuten", hours: "Stunden", days: "Tage", weeks: "Wochen", months: "Monate", years: "Jahre", message_ok: "OK", message_cancel: "Abbrechen", section_constraint: "Regel", constraint_type: "Regel", constraint_date: "Regel - Datum", asap: "So bald wie möglich", alap: "So spät wie möglich", snet: "Beginn nicht vor", snlt: "Beginn nicht später als", fnet: "Fertigstellung nicht vor", fnlt: "Fertigstellung nicht später als", mso: "Muss beginnen am", mfo: "Muss fertig sein am", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Mi = { date: { month_full: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], month_short: ["ΙΑΝ", "ΦΕΒ", "ΜΑΡ", "ΑΠΡ", "ΜΑΙ", "ΙΟΥΝ", "ΙΟΥΛ", "ΑΥΓ", "ΣΕΠ", "ΟΚΤ", "ΝΟΕ", "ΔΕΚ"], day_full: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Κυριακή"], day_short: ["ΚΥ", "ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"] }, labels: { new_task: "Νέα εργασία", icon_save: "Αποθήκευση", icon_cancel: "Άκυρο", icon_details: "Λεπτομέρειες", icon_edit: "Επεξεργασία", icon_delete: "Διαγραφή", confirm_closing: "", confirm_deleting: "Το έργο θα διαγραφεί οριστικά. Θέλετε να συνεχίσετε;", section_description: "Περιγραφή", section_time: "Χρονική περίοδος", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Άκυρο", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ni = { date: { month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, labels: { new_task: "New task", icon_save: "Save", icon_cancel: "Cancel", icon_details: "Details", icon_edit: "Edit", icon_delete: "Delete", confirm_closing: "", confirm_deleting: "Task will be deleted permanently, are you sure?", section_description: "Description", section_time: "Time period", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Cancel", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Li = { date: { month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] }, labels: { new_task: "Nueva tarea", icon_save: "Guardar", icon_cancel: "Cancelar", icon_details: "Detalles", icon_edit: "Editar", icon_delete: "Eliminar", confirm_closing: "", confirm_deleting: "El evento se borrará definitivamente, ¿continuar?", section_description: "Descripción", section_time: "Período", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "EDT", column_text: "Tarea", column_start_date: "Inicio", column_duration: "Duración", column_add: "", link: "Enlace", confirm_link_deleting: "será borrada", link_start: " (inicio)", link_end: " (fin)", type_task: "Tarea", type_project: "Proyecto", type_milestone: "Hito", minutes: "Minutos", hours: "Horas", days: "Días", weeks: "Semanas", months: "Meses", years: "Años", message_ok: "OK", message_cancel: "Cancelar", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Pi = { date: { month_full: ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"], month_short: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], day_full: ["يکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"], day_short: ["ی", "د", "س", "چ", "پ", "ج", "ش"] }, labels: { new_task: "وظیفه جدید", icon_save: "ذخیره", icon_cancel: "لغو", icon_details: "جزییات", icon_edit: "ویرایش", icon_delete: "حذف", confirm_closing: "تغییرات شما ازدست خواهد رفت، آیا مطمئن هستید؟", confirm_deleting: "این مورد برای همیشه حذف خواهد شد، آیا مطمئن هستید؟", section_description: "توضیحات", section_time: "مدت زمان", section_type: "نوع", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "عنوان", column_start_date: "زمان شروع", column_duration: "مدت", column_add: "", link: "ارتباط", confirm_link_deleting: "حذف خواهد شد", link_start: " (آغاز)", link_end: " (پایان)", type_task: "وظیفه", type_project: "پروژه", type_milestone: "نگارش", minutes: "دقایق", hours: "ساعات", days: "روزها", weeks: "هفته", months: "ماه‌ها", years: "سال‌ها", message_ok: "تایید", message_cancel: "لغو", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ri = { date: { month_full: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], month_short: ["Tam", "Hel", "Maa", "Huh", "Tou", "Kes", "Hei", "Elo", "Syy", "Lok", "Mar", "Jou"], day_full: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"], day_short: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"] }, labels: { new_task: "Uusi tehtävä", icon_save: "Tallenna", icon_cancel: "Peru", icon_details: "Tiedot", icon_edit: "Muokkaa", icon_delete: "Poista", confirm_closing: "", confirm_deleting: "Haluatko varmasti poistaa tapahtuman?", section_description: "Kuvaus", section_time: "Aikajakso", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Peru", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Hi = { date: { month_full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], month_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"], day_full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] }, labels: { new_task: "Nouvelle tâche", icon_save: "Enregistrer", icon_cancel: "Annuler", icon_details: "Détails", icon_edit: "Modifier", icon_delete: "Effacer", confirm_closing: "", confirm_deleting: "L'événement sera effacé sans appel, êtes-vous sûr ?", section_description: "Description", section_time: "Période", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "OTP", column_text: "Nom de la tâche", column_start_date: "Date initiale", column_duration: "Durée", column_add: "", link: "Le lien", confirm_link_deleting: "sera supprimé", link_start: "(début)", link_end: "(fin)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Heures", days: "Jours", weeks: "Semaines", months: "Mois", years: "Années", message_ok: "OK", message_cancel: "Annuler", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Oi = { date: { month_full: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], month_short: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], day_full: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"], day_short: ["א", "ב", "ג", "ד", "ה", "ו", "ש"] }, labels: { new_task: "משימה חדש", icon_save: "שמור", icon_cancel: "בטל", icon_details: "פרטים", icon_edit: "ערוך", icon_delete: "מחק", confirm_closing: "", confirm_deleting: "ארוע ימחק סופית.להמשיך?", section_description: "הסבר", section_time: "תקופה", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "בטל", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Bi = { date: { month_full: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"], month_short: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"], day_full: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"], day_short: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"] }, labels: { new_task: "Novi Zadatak", icon_save: "Spremi", icon_cancel: "Odustani", icon_details: "Detalji", icon_edit: "Izmjeni", icon_delete: "Obriši", confirm_closing: "", confirm_deleting: "Zadatak će biti trajno izbrisan, jeste li sigurni?", section_description: "Opis", section_time: "Vremenski Period", section_type: "Tip", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Naziv Zadatka", column_start_date: "Početno Vrijeme", column_duration: "Trajanje", column_add: "", link: "Poveznica", confirm_link_deleting: "će biti izbrisan", link_start: " (početak)", link_end: " (kraj)", type_task: "Zadatak", type_project: "Projekt", type_milestone: "Milestone", minutes: "Minute", hours: "Sati", days: "Dani", weeks: "Tjedni", months: "Mjeseci", years: "Godine", message_ok: "OK", message_cancel: "Odustani", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, zi = { date: { month_full: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], month_short: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Vasárnap", "Hétfõ", "Kedd", "Szerda", "Csütörtök", "Péntek", "szombat"], day_short: ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"] }, labels: { new_task: "Új feladat", icon_save: "Mentés", icon_cancel: "Mégse", icon_details: "Részletek", icon_edit: "Szerkesztés", icon_delete: "Törlés", confirm_closing: "", confirm_deleting: "Az esemény törölve lesz, biztosan folytatja?", section_description: "Leírás", section_time: "Idõszak", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Mégse", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Wi = { date: { month_full: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"], day_full: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], day_short: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] }, labels: { new_task: "Tugas baru", icon_save: "Simpan", icon_cancel: "Batal", icon_details: "Detail", icon_edit: "Edit", icon_delete: "Hapus", confirm_closing: "", confirm_deleting: "Acara akan dihapus", section_description: "Keterangan", section_time: "Periode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Batal", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ji = { date: { month_full: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], month_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"], day_full: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"], day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"] }, labels: { new_task: "Nuovo compito", icon_save: "Salva", icon_cancel: "Chiudi", icon_details: "Dettagli", icon_edit: "Modifica", icon_delete: "Elimina", confirm_closing: "", confirm_deleting: "Sei sicuro di confermare l'eliminazione?", section_description: "Descrizione", section_time: "Periodo di tempo", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Nome Attività", column_start_date: "Inizio", column_duration: "Durata", column_add: "", link: "Link", confirm_link_deleting: "sarà eliminato", link_start: " (inizio)", link_end: " (fine)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minuti", hours: "Ore", days: "Giorni", weeks: "Settimane", months: "Mesi", years: "Anni", message_ok: "OK", message_cancel: "Chiudi", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Fi = { date: { month_full: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], day_short: ["日", "月", "火", "水", "木", "金", "土"] }, labels: { new_task: "新しい仕事", icon_save: "保存", icon_cancel: "キャンセル", icon_details: "詳細", icon_edit: "編集", icon_delete: "削除", confirm_closing: "", confirm_deleting: "イベント完全に削除されます、宜しいですか？", section_description: "デスクリプション", section_time: "期間", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "キャンセル", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Vi = { date: { month_full: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], month_short: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], day_full: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], day_short: ["일", "월", "화", "수", "목", "금", "토"] }, labels: { new_task: "이름없는 작업", icon_save: "저장", icon_cancel: "취소", icon_details: "세부 사항", icon_edit: "수정", icon_delete: "삭제", confirm_closing: "", confirm_deleting: "작업을 삭제하시겠습니까?", section_description: "설명", section_time: "기간", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "작업명", column_start_date: "시작일", column_duration: "기간", column_add: "", link: "전제", confirm_link_deleting: "삭제 하시겠습니까?", link_start: " (start)", link_end: " (end)", type_task: "작업", type_project: "프로젝트", type_milestone: "마일스톤", minutes: "분", hours: "시간", days: "일", weeks: "주", months: "달", years: "년", message_ok: "OK", message_cancel: "취소", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } };
class Ui {
  constructor(e) {
    this.addLocale = (n, i) => {
      this._locales[n] = i;
    }, this.getLocale = (n) => this._locales[n], this._locales = {};
    for (const n in e) this._locales[n] = e[n];
  }
}
const qi = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Mon", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny oppgave", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Rediger", icon_delete: "Slett", confirm_closing: "", confirm_deleting: "Hendelsen vil bli slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Gi = { date: { month_full: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"], day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"] }, labels: { new_task: "Nieuwe taak", icon_save: "Opslaan", icon_cancel: "Annuleren", icon_details: "Details", icon_edit: "Bewerken", icon_delete: "Verwijderen", confirm_closing: "", confirm_deleting: "Item zal permanent worden verwijderd, doorgaan?", section_description: "Beschrijving", section_time: "Tijd periode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Taak omschrijving", column_start_date: "Startdatum", column_duration: "Duur", column_add: "", link: "Koppeling", confirm_link_deleting: "zal worden verwijderd", link_start: " (start)", link_end: " (eind)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "minuten", hours: "uren", days: "dagen", weeks: "weken", months: "maanden", years: "jaren", message_ok: "OK", message_cancel: "Annuleren", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Yi = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny oppgave", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Endre", icon_delete: "Slett", confirm_closing: "Endringer blir ikke lagret, er du sikker?", confirm_deleting: "Oppføringen vil bli slettet, er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ji = { date: { month_full: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"], month_short: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"], day_full: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"], day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"] }, labels: { new_task: "Nowe zadanie", icon_save: "Zapisz", icon_cancel: "Anuluj", icon_details: "Szczegóły", icon_edit: "Edytuj", icon_delete: "Usuń", confirm_closing: "", confirm_deleting: "Zdarzenie zostanie usunięte na zawsze, kontynuować?", section_description: "Opis", section_time: "Okres czasu", section_type: "Typ", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Nazwa zadania", column_start_date: "Początek", column_duration: "Czas trwania", column_add: "", link: "Link", confirm_link_deleting: "zostanie usunięty", link_start: " (początek)", link_end: " (koniec)", type_task: "Zadanie", type_project: "Projekt", type_milestone: "Milestone", minutes: "Minuty", hours: "Godziny", days: "Dni", weeks: "Tydzień", months: "Miesiące", years: "Lata", message_ok: "OK", message_cancel: "Anuluj", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ki = { date: { month_full: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], month_short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], day_full: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"], day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] }, labels: { new_task: "Nova tarefa", icon_save: "Salvar", icon_cancel: "Cancelar", icon_details: "Detalhes", icon_edit: "Editar", icon_delete: "Excluir", confirm_closing: "", confirm_deleting: "As tarefas serão excluidas permanentemente, confirme?", section_description: "Descrição", section_time: "Período", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "EAP", column_text: "Nome tarefa", column_start_date: "Data início", column_duration: "Duração", column_add: "", link: "Link", confirm_link_deleting: "Será excluído!", link_start: " (início)", link_end: " (fim)", type_task: "Task", type_project: "Projeto", type_milestone: "Marco", minutes: "Minutos", hours: "Horas", days: "Dias", weeks: "Semanas", months: "Meses", years: "Anos", message_ok: "OK", message_cancel: "Cancelar", section_constraint: "Restrição", constraint_type: "Tipo Restrição", constraint_date: "Data restrição", asap: "Mais breve possível", alap: "Mais tarde possível", snet: "Não começar antes de", snlt: "Não começar depois de", fnet: "Não terminar antes de", fnlt: "Não terminar depois de", mso: "Precisa começar em", mfo: "Precisa terminar em", resources_filter_placeholder: "Tipo de filtros", resources_filter_label: "Ocultar vazios", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Xi = { date: { month_full: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "November", "December"], month_short: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"], day_short: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"] }, labels: { new_task: "Sarcina noua", icon_save: "Salveaza", icon_cancel: "Anuleaza", icon_details: "Detalii", icon_edit: "Editeaza", icon_delete: "Sterge", confirm_closing: "Schimbarile nu vor fi salvate, esti sigur?", confirm_deleting: "Evenimentul va fi sters permanent, esti sigur?", section_description: "Descriere", section_time: "Interval", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Anuleaza", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Zi = { date: { month_full: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"], month_short: ["Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек"], day_full: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"], day_short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] }, labels: { new_task: "Новое задание", icon_save: "Сохранить", icon_cancel: "Отменить", icon_details: "Детали", icon_edit: "Изменить", icon_delete: "Удалить", confirm_closing: "", confirm_deleting: "Событие будет удалено безвозвратно, продолжить?", section_description: "Описание", section_time: "Период времени", section_type: "Тип", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "ИСР", column_text: "Задача", column_start_date: "Начало", column_duration: "Длительность", column_add: "", link: "Связь", confirm_link_deleting: "будет удалена", link_start: " (начало)", link_end: " (конец)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Минута", hours: "Час", days: "День", weeks: "Неделя", months: "Месяц", years: "Год", message_ok: "OK", message_cancel: "Отменить", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "начните вводить слово для фильтрации", resources_filter_label: "спрятать не установленные", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Qi = { date: { month_full: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"], day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"] }, labels: { new_task: "Nova naloga", icon_save: "Shrani", icon_cancel: "Prekliči", icon_details: "Podrobnosti", icon_edit: "Uredi", icon_delete: "Izbriši", confirm_closing: "", confirm_deleting: "Dogodek bo izbrisan. Želite nadaljevati?", section_description: "Opis", section_time: "Časovni okvir", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Prekliči", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ta = { date: { month_full: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sept", "Okt", "Nov", "Dec"], day_full: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"], day_short: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"] }, labels: { new_task: "Nová úloha", icon_save: "Uložiť", icon_cancel: "Späť", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Zmazať", confirm_closing: "Vaše zmeny nebudú uložené. Skutočne?", confirm_deleting: "Udalosť bude natrvalo vymazaná. Skutočne?", section_description: "Poznámky", section_time: "Doba platnosti", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Späť", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ea = { date: { month_full: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"], day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] }, labels: { new_task: "Ny uppgift", icon_save: "Spara", icon_cancel: "Avbryt", icon_details: "Detajer", icon_edit: "Ändra", icon_delete: "Ta bort", confirm_closing: "", confirm_deleting: "Är du säker på att du vill ta bort händelsen permanent?", section_description: "Beskrivning", section_time: "Tid", section_type: "Typ", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Uppgiftsnamn", column_start_date: "Starttid", column_duration: "Varaktighet", column_add: "", link: "Länk", confirm_link_deleting: "kommer tas bort", link_start: " (start)", link_end: " (slut)", type_task: "Uppgift", type_project: "Projekt", type_milestone: "Milstolpe", minutes: "Minuter", hours: "Timmar", days: "Dagar", weeks: "Veckor", months: "Månader", years: "År", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, na = { date: { month_full: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], month_short: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], day_full: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], day_short: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"] }, labels: { new_task: "Yeni görev", icon_save: "Kaydet", icon_cancel: "İptal", icon_details: "Detaylar", icon_edit: "Düzenle", icon_delete: "Sil", confirm_closing: "", confirm_deleting: "Görev silinecek, emin misiniz?", section_description: "Açıklama", section_time: "Zaman Aralığı", section_type: "Tip", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Görev Adı", column_start_date: "Başlangıç", column_duration: "Süre", column_add: "", link: "Bağlantı", confirm_link_deleting: "silinecek", link_start: " (başlangıç)", link_end: " (bitiş)", type_task: "Görev", type_project: "Proje", type_milestone: "Kilometretaşı", minutes: "Dakika", hours: "Saat", days: "Gün", weeks: "Hafta", months: "Ay", years: "Yıl", message_ok: "OK", message_cancel: "Ýptal", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ia = { date: { month_full: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], month_short: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], day_full: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"] }, labels: { new_task: "Нове завдання", icon_save: "Зберегти", icon_cancel: "Відміна", icon_details: "Деталі", icon_edit: "Редагувати", icon_delete: "Вилучити", confirm_closing: "", confirm_deleting: "Подія вилучиться назавжди. Ви впевнені?", section_description: "Опис", section_time: "Часовий проміжок", section_type: "Тип", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Відміна", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } };
function aa() {
  this.constants = Un, this.version = "9.0.13", this.license = "gpl", this.templates = {}, this.ext = {}, this.keys = { edit_save: this.constants.KEY_CODES.ENTER, edit_cancel: this.constants.KEY_CODES.ESC };
}
function ra(t) {
  var e = new aa(), n = new qn(t), i = {};
  e.plugins = function(l) {
    for (var c in l) if (l[c] && !i[c]) {
      var d = n.getExtension(c);
      d && (d(e), i[c] = !0);
    }
    return i;
  }, e.$services = /* @__PURE__ */ function() {
    var l = {};
    return { services: {}, setService: function(c, d) {
      l[c] = d;
    }, getService: function(c) {
      return l[c] ? l[c]() : null;
    }, dropService: function(c) {
      l[c] && delete l[c];
    }, destructor: function() {
      for (var c in l) if (l[c]) {
        var d = l[c];
        d && d.destructor && d.destructor();
      }
      l = null;
    } };
  }(), e.config = { layout: { css: "gantt_container", rows: [{ cols: [{ view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" }, { resizer: !0, width: 1 }, { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" }, { view: "scrollbar", id: "scrollVer" }] }, { view: "scrollbar", id: "scrollHor", height: 20 }] }, links: { finish_to_start: "0", start_to_start: "1", finish_to_finish: "2", start_to_finish: "3" }, types: { task: "task", project: "project", milestone: "milestone" }, auto_types: !1, duration_unit: "day", work_time: !1, correct_work_time: !1, skip_off_time: !1, cascade_delete: !0, autosize: !1, autosize_min_width: 0, autoscroll: !0, autoscroll_speed: 30, deepcopy_on_parse: !1, show_links: !0, show_task_cells: !0, static_background: !1, static_background_cells: !0, branch_loading: !1, branch_loading_property: "$has_child", show_loading: !1, show_chart: !0, show_grid: !0, min_duration: 36e5, date_format: "%d-%m-%Y %H:%i", xml_date: void 0, start_on_monday: !0, server_utc: !1, show_progress: !0, fit_tasks: !1, select_task: !0, scroll_on_click: !0, smart_rendering: !0, preserve_scroll: !0, readonly: !1, container_resize_timeout: 20, deadlines: !0, date_grid: "%Y-%m-%d", drag_links: !0, drag_progress: !0, drag_resize: !0, drag_project: !1, drag_move: !0, drag_mode: { resize: "resize", progress: "progress", move: "move", ignore: "ignore" }, round_dnd_dates: !0, link_wrapper_width: 20, link_arrow_size: 12, root_id: 0, autofit: !1, columns: [{ name: "text", tree: !0, width: "*", resize: !0 }, { name: "start_date", align: "center", resize: !0 }, { name: "duration", align: "center" }, { name: "add", width: 44 }], scale_offset_minimal: !0, inherit_scale_class: !1, scales: [{ unit: "day", step: 1, date: "%d %M" }], time_step: 60, duration_step: 1, task_date: "%d %F %Y", time_picker: "%H:%i", task_attribute: "data-task-id", link_attribute: "data-link-id", layer_attribute: "data-layer", buttons_left: ["gantt_save_btn", "gantt_cancel_btn"], _migrate_buttons: { dhx_save_btn: "gantt_save_btn", dhx_cancel_btn: "gantt_cancel_btn", dhx_delete_btn: "gantt_delete_btn" }, buttons_right: ["gantt_delete_btn"], lightbox: { sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "time", type: "duration", map_to: "auto" }], project_sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "type", type: "typeselect", map_to: "type" }, { name: "time", type: "duration", readonly: !0, map_to: "auto" }], milestone_sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "type", type: "typeselect", map_to: "type" }, { name: "time", type: "duration", single_date: !0, map_to: "auto" }] }, drag_lightbox: !0, sort: !1, details_on_create: !0, details_on_dblclick: !0, initial_scroll: !0, task_scroll_offset: 100, order_branch: !1, order_branch_free: !1, task_height: void 0, bar_height: "full", bar_height_padding: 9, min_column_width: 70, min_grid_column_width: 70, grid_resizer_column_attribute: "data-column-index", keep_grid_width: !1, grid_resize: !1, grid_elastic_columns: !1, show_tasks_outside_timescale: !1, show_unscheduled: !0, resize_rows: !1, task_grid_row_resizer_attribute: "data-row-index", min_task_grid_row_height: 30, row_height: 36, readonly_property: "readonly", editable_property: "editable", calendar_property: "calendar_id", resource_calendars: {}, dynamic_resource_calendars: !1, inherit_calendar: !1, type_renderers: {}, open_tree_initially: !1, optimize_render: !0, prevent_default_scroll: !1, show_errors: !0, wai_aria_attributes: !0, smart_scales: !0, rtl: !1, placeholder_task: !1, horizontal_scroll_key: "shiftKey", drag_timeline: { useKey: void 0, ignore: ".gantt_task_line, .gantt_task_link", render: !1 }, drag_multiple: !0, csp: "auto" }, e.ajax = /* @__PURE__ */ function(l) {
    return { cache: !0, method: "get", parse: function(c) {
      return typeof c != "string" ? c : (c = c.replace(/^[\s]+/, ""), typeof DOMParser > "u" || mt.isIE ? Z.ActiveXObject !== void 0 && ((d = new Z.ActiveXObject("Microsoft.XMLDOM")).async = "false", d.loadXML(c)) : d = new DOMParser().parseFromString(c, "text/xml"), d);
      var d;
    }, xmltop: function(c, d, u) {
      if (d.status === void 0 || d.status < 400) {
        var h = d.responseXML ? d.responseXML || d : this.parse(d.responseText || d);
        if (h && h.documentElement !== null && !h.getElementsByTagName("parsererror").length) return h.getElementsByTagName(c)[0];
      }
      return u !== -1 && l.callEvent("onLoadXMLError", ["Incorrect XML", arguments[1], u]), document.createElement("DIV");
    }, xpath: function(c, d) {
      if (d.nodeName || (d = d.responseXML || d), mt.isIE) return d.selectNodes(c) || [];
      for (var u, h = [], _ = (d.ownerDocument || d).evaluate(c, d, null, XPathResult.ANY_TYPE, null); u = _.iterateNext(); ) h.push(u);
      return h;
    }, query: function(c) {
      return this._call(c.method || "GET", c.url, c.data || "", c.async || !0, c.callback, c.headers);
    }, get: function(c, d, u) {
      var h = xt("GET", arguments);
      return this.query(h);
    }, getSync: function(c, d) {
      var u = xt("GET", arguments);
      return u.async = !1, this.query(u);
    }, put: function(c, d, u, h) {
      var _ = xt("PUT", arguments);
      return this.query(_);
    }, del: function(c, d, u) {
      var h = xt("DELETE", arguments);
      return this.query(h);
    }, post: function(c, d, u, h) {
      arguments.length == 1 ? d = "" : arguments.length == 2 && typeof d == "function" && (u = d, d = "");
      var _ = xt("POST", arguments);
      return this.query(_);
    }, postSync: function(c, d, u) {
      d = d === null ? "" : String(d);
      var h = xt("POST", arguments);
      return h.async = !1, this.query(h);
    }, _call: function(c, d, u, h, _, p) {
      return new l.Promise(function(y, k) {
        var b = typeof XMLHttpRequest !== void 0 ? new XMLHttpRequest() : new Z.ActiveXObject("Microsoft.XMLHTTP"), g = navigator.userAgent.match(/AppleWebKit/) !== null && navigator.userAgent.match(/Qt/) !== null && navigator.userAgent.match(/Safari/) !== null;
        h && (b.onreadystatechange = function() {
          if (b.readyState == 4 || g && b.readyState == 3) {
            if ((b.status < 200 || b.status > 299 || b.responseText === "") && !l.callEvent("onAjaxError", [b])) return;
            setTimeout(function() {
              typeof _ == "function" && _.apply(Z, [{ xmlDoc: b, filePath: d }]), y(b), typeof _ == "function" && (_ = null, b = null);
            }, 0);
          }
        });
        var m = !this || !this.cache;
        if (c == "GET" && m && (d += (d.indexOf("?") >= 0 ? "&" : "?") + "dhxr" + (/* @__PURE__ */ new Date()).getTime() + "=1"), b.open(c, d, h), p) for (var f in p) b.setRequestHeader(f, p[f]);
        else c.toUpperCase() == "POST" || c == "PUT" || c == "DELETE" ? b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : c == "GET" && (u = null);
        if (b.setRequestHeader("X-Requested-With", "XMLHttpRequest"), b.send(u), !h) return { xmlDoc: b, filePath: d };
      });
    }, urlSeparator: function(c) {
      return c.indexOf("?") != -1 ? "&" : "?";
    } };
  }(e), e.date = Gn(e), e.RemoteEvents = Jn;
  var a = function(l) {
    function c(u) {
      return { target: u.target || u.srcElement, pageX: u.pageX, pageY: u.pageY, clientX: u.clientX, clientY: u.clientY, metaKey: u.metaKey, shiftKey: u.shiftKey, ctrlKey: u.ctrlKey, altKey: u.altKey };
    }
    function d(u, h) {
      this._obj = u, this._settings = h || {}, ot(this);
      var _ = this.getInputMethods();
      this._drag_start_timer = null, l.attachEvent("onGanttScroll", R(function(k, b) {
        this.clearDragTimer();
      }, this));
      for (var p = { passive: !1 }, y = 0; y < _.length; y++) R(function(k) {
        l.event(u, k.down, R(function(g) {
          k.accessor(g) && (g.button !== void 0 && g.button !== 0 || (h.preventDefault && h.selector && dt(g.target, h.selector) && g.preventDefault(), l.config.touch && g.timeStamp && g.timeStamp - 0 < 300 || (this._settings.original_target = c(g), this._settings.original_element_sizes = { ...rt(g, nn(u)), width: g.target.offsetWidth, height: g.target.offsetHeight }, l.config.touch ? (this.clearDragTimer(), this._drag_start_timer = setTimeout(R(function() {
            l.getState().lightbox || this.dragStart(u, g, k);
          }, this), l.config.touch_drag)) : this.dragStart(u, g, k))));
        }, this), p);
        var b = document.body;
        l.event(b, k.up, R(function(g) {
          k.accessor(g) && this.clearDragTimer();
        }, this), p);
      }, this)(_[y]);
    }
    return d.prototype = { traceDragEvents: function(u, h) {
      var _ = R(function(m) {
        return this.dragMove(u, m, h.accessor);
      }, this);
      R(function(m) {
        return this.dragScroll(u, m);
      }, this);
      var p = R(function(m) {
        if (!this.config.started || !W(this.config.updates_per_second) || dn(this, this.config.updates_per_second)) {
          var f = _(m);
          if (f) try {
            m && m.preventDefault && m.cancelable && m.preventDefault();
          } catch {
          }
          return f;
        }
      }, this), y = vt(l.$root), k = this.config.mousemoveContainer || vt(l.$root), b = { passive: !1 }, g = R(function(m) {
        return l.eventRemove(k, h.move, p), l.eventRemove(y, h.up, g, b), this.dragEnd(u);
      }, this);
      l.event(k, h.move, p, b), l.event(y, h.up, g, b);
    }, checkPositionChange: function(u) {
      var h = u.x - this.config.pos.x, _ = u.y - this.config.pos.y;
      return Math.sqrt(Math.pow(Math.abs(h), 2) + Math.pow(Math.abs(_), 2)) > this.config.sensitivity;
    }, initDnDMarker: function() {
      var u = this.config.marker = document.createElement("div");
      u.className = "gantt_drag_marker", u.innerHTML = "", document.body.appendChild(u);
    }, backupEventTarget: function(u, h) {
      if (l.config.touch) {
        var _ = h(u), p = _.target || _.srcElement, y = p.cloneNode(!0);
        this.config.original_target = c(_), this.config.original_target.target = y, this.config.backup_element = p, p.parentNode.appendChild(y), p.style.display = "none", (this.config.mousemoveContainer || document.body).appendChild(p);
      }
    }, getInputMethods: function() {
      var u = [];
      if (u.push({ move: "mousemove", down: "mousedown", up: "mouseup", accessor: function(_) {
        return _;
      } }), l.config.touch) {
        var h = !0;
        try {
          document.createEvent("TouchEvent");
        } catch {
          h = !1;
        }
        h ? u.push({ move: "touchmove", down: "touchstart", up: "touchend", accessor: function(_) {
          return _.touches && _.touches.length > 1 ? null : _.touches[0] ? { target: document.elementFromPoint(_.touches[0].clientX, _.touches[0].clientY), pageX: _.touches[0].pageX, pageY: _.touches[0].pageY, clientX: _.touches[0].clientX, clientY: _.touches[0].clientY } : _;
        } }) : Z.navigator.pointerEnabled ? u.push({ move: "pointermove", down: "pointerdown", up: "pointerup", accessor: function(_) {
          return _.pointerType == "mouse" ? null : _;
        } }) : Z.navigator.msPointerEnabled && u.push({ move: "MSPointerMove", down: "MSPointerDown", up: "MSPointerUp", accessor: function(_) {
          return _.pointerType == _.MSPOINTER_TYPE_MOUSE ? null : _;
        } });
      }
      return u;
    }, clearDragTimer: function() {
      this._drag_start_timer && (clearTimeout(this._drag_start_timer), this._drag_start_timer = null);
    }, dragStart: function(u, h, _) {
      this.config && this.config.started || (this.config = { obj: u, marker: null, started: !1, pos: this.getPosition(h), sensitivity: 4 }, this._settings && P(this.config, this._settings, !0), this.traceDragEvents(u, _), l._prevent_touch_scroll = !0, h.target.closest(".gantt_row") && !l.config.order_branch && (l._prevent_touch_scroll = !1), document.body.classList.add("gantt_noselect"), l.config.touch && this.dragMove(u, h, _.accessor));
    }, dragMove: function(u, h, _) {
      var p = _(h);
      if (!p) return !1;
      if (!this.config.marker && !this.config.started) {
        var y = this.getPosition(p);
        if (l.config.touch || this.checkPositionChange(y)) {
          if (this.config.started = !0, this.config.ignore = !1, l._touch_drag = !0, this.callEvent("onBeforeDragStart", [u, this.config.original_target]) === !1) return this.config.ignore = !0, !1;
          this.backupEventTarget(h, _), this.initDnDMarker(), l._touch_feedback(), this.callEvent("onAfterDragStart", [u, this.config.original_target]);
        } else this.config.ignore = !0;
      }
      return this.config.ignore ? !1 : h.targetTouches && !p.target ? void 0 : (p.pos = this.getPosition(p), this.config.marker.style.left = p.pos.x + "px", this.config.marker.style.top = p.pos.y + "px", this.callEvent("onDragMove", [u, p]), !0);
    }, dragEnd: function(u) {
      var h = this.config.backup_element;
      h && h.parentNode && h.parentNode.removeChild(h), l._prevent_touch_scroll = !1, this.config.marker && (this.config.marker.parentNode.removeChild(this.config.marker), this.config.marker = null, this.callEvent("onDragEnd", [])), this.config.started = !1, l._touch_drag = !1, document.body.classList.remove("gantt_noselect");
    }, getPosition: function(u) {
      var h = 0, _ = 0;
      return u.pageX || u.pageY ? (h = u.pageX, _ = u.pageY) : (u.clientX || u.clientY) && (h = u.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, _ = u.clientY + document.body.scrollTop + document.documentElement.scrollTop), { x: h, y: _ };
    } }, d;
  }(e);
  e.$services.setService("dnd", function() {
    return a;
  });
  var r = /* @__PURE__ */ function(l) {
    var c = {};
    function d(u, h, _) {
      _ = _ || u;
      var p = l.config, y = l.templates;
      l.config[u] && c[_] != p[u] && (h && y[_] || (y[_] = l.date.date_to_str(p[u]), c[_] = p[u]));
    }
    return { initTemplates: function() {
      var u = l.date, h = u.date_to_str, _ = l.config, p = h(_.xml_date || _.date_format, _.server_utc), y = u.str_to_date(_.xml_date || _.date_format, _.server_utc);
      d("date_scale", !0, void 0, l.config, l.templates), d("date_grid", !0, "grid_date_format", l.config, l.templates), d("task_date", !0, void 0, l.config, l.templates), l.mixin(l.templates, { xml_format: void 0, format_date: p, xml_date: void 0, parse_date: y, progress_text: function(k, b, g) {
        return "";
      }, grid_header_class: function(k, b) {
        return "";
      }, task_text: function(k, b, g) {
        return g.text;
      }, task_class: function(k, b, g) {
        return "";
      }, task_end_date: function(k) {
        return l.templates.task_date(k);
      }, grid_row_class: function(k, b, g) {
        return "";
      }, task_row_class: function(k, b, g) {
        return "";
      }, timeline_cell_class: function(k, b) {
        return "";
      }, timeline_cell_content: function(k, b) {
        return "";
      }, scale_cell_class: function(k) {
        return "";
      }, scale_row_class: function(k) {
        return "";
      }, grid_indent: function(k) {
        return "<div class='gantt_tree_indent'></div>";
      }, grid_folder: function(k) {
        return "<div class='gantt_tree_icon gantt_folder_" + (k.$open ? "open" : "closed") + "'></div>";
      }, grid_file: function(k) {
        return "<div class='gantt_tree_icon gantt_file'></div>";
      }, grid_open: function(k) {
        return "<div class='gantt_tree_icon gantt_" + (k.$open ? "close" : "open") + "'></div>";
      }, grid_blank: function(k) {
        return "<div class='gantt_tree_icon gantt_blank'></div>";
      }, date_grid: function(k, b, g) {
        return b && l.isUnscheduledTask(b) && l.config.show_unscheduled ? l.templates.task_unscheduled_time(b) : l.templates.grid_date_format(k, g);
      }, task_time: function(k, b, g) {
        return l.isUnscheduledTask(g) && l.config.show_unscheduled ? l.templates.task_unscheduled_time(g) : l.templates.task_date(k) + " - " + l.templates.task_end_date(b);
      }, task_unscheduled_time: function(k) {
        return "";
      }, time_picker: h(_.time_picker), link_class: function(k) {
        return "";
      }, link_description: function(k) {
        var b = l.getTask(k.source), g = l.getTask(k.target);
        return "<b>" + b.text + "</b> &ndash;  <b>" + g.text + "</b>";
      }, drag_link: function(k, b, g, m) {
        k = l.getTask(k);
        var f = l.locale.labels, v = "<b>" + k.text + "</b> " + (b ? f.link_start : f.link_end) + "<br/>";
        return g && (v += "<b> " + (g = l.getTask(g)).text + "</b> " + (m ? f.link_start : f.link_end) + "<br/>"), v;
      }, drag_link_class: function(k, b, g, m) {
        var f = "";
        return k && g && (f = " " + (l.isLinkAllowed(k, g, b, m) ? "gantt_link_allow" : "gantt_link_deny")), "gantt_link_tooltip" + f;
      }, tooltip_date_format: u.date_to_str("%Y-%m-%d"), tooltip_text: function(k, b, g) {
        return `<div>Task: ${g.text}</div>
				<div>Start date: ${l.templates.tooltip_date_format(k)}</div>
				<div>End date: ${l.templates.tooltip_date_format(b)}</div>`;
      }, baseline_text: function(k, b, g) {
        return "";
      } });
    }, initTemplate: d };
  }(e);
  e.$services.setService("templateLoader", function() {
    return r;
  }), ot(e);
  var s = new Kn();
  s.registerProvider("global", function() {
    var l = { min_date: e._min_date, max_date: e._max_date, selected_task: null };
    return e.$data && e.$data.tasksStore && (l.selected_task = e.$data.tasksStore.getSelectedId()), l;
  }), e.getState = s.getState, e.$services.setService("state", function() {
    return s;
  }), P(e, Bn), e.Promise = Xn, e.env = mt, function(l) {
    var c = Qn.create();
    P(l, c);
    var d, u = l.createDatastore({ name: "task", type: "treeDatastore", rootId: function() {
      return l.config.root_id;
    }, initItem: R(function(m) {
      this.defined(m.id) || (m.id = this.uid()), m.start_date && (m.start_date = l.date.parseDate(m.start_date, "parse_date")), m.end_date && (m.end_date = l.date.parseDate(m.end_date, "parse_date"));
      var f = null;
      (m.duration || m.duration === 0) && (m.duration = f = 1 * m.duration), f && (m.start_date && !m.end_date ? m.end_date = this.calculateEndDate(m) : !m.start_date && m.end_date && (m.start_date = this.calculateEndDate({ start_date: m.end_date, duration: -m.duration, task: m }))), l.config.deadlines !== !1 && m.deadline && (m.deadline = l.date.parseDate(m.deadline, "parse_date")), m.progress = Number(m.progress) || 0, this._isAllowedUnscheduledTask(m) && this._set_default_task_timing(m), this._init_task_timing(m), m.start_date && m.end_date && this.correctTaskWorkTime(m), m.$source = [], m.$target = [];
      var v = this.$data.tasksStore.getItem(m.id);
      return v && !W(m.open) && (m.$open = v.$open), m.parent === void 0 && (m.parent = this.config.root_id), m.open && (m.$open = !0), m;
    }, l), getConfig: function() {
      return l.config;
    } }), h = l.createDatastore({ name: "link", initItem: R(function(m) {
      return this.defined(m.id) || (m.id = this.uid()), m;
    }, l) });
    function _(m) {
      var f = l.isTaskVisible(m);
      if (!f && l.isTaskExists(m)) {
        var v = l.getParent(m);
        l.isTaskExists(v) && l.isTaskVisible(v) && (v = l.getTask(v), l.isSplitTask(v) && (f = !0));
      }
      return f;
    }
    function p(m) {
      if (l.isTaskExists(m.source)) {
        var f = l.getTask(m.source);
        f.$source = f.$source || [], y(m.id, f.$source) && f.$source.push(m.id);
      }
      if (l.isTaskExists(m.target)) {
        var v = l.getTask(m.target);
        v.$target = v.$target || [], y(m.id, v.$target) && v.$target.push(m.id);
      }
    }
    function y(m, f) {
      return f.indexOf(String(m)) === -1 && f.indexOf(Number(m)) === -1;
    }
    function k(m) {
      if (l.isTaskExists(m.source)) {
        for (var f = l.getTask(m.source), v = 0; v < f.$source.length; v++) if (f.$source[v] == m.id) {
          f.$source.splice(v, 1);
          break;
        }
      }
      if (l.isTaskExists(m.target)) {
        var x = l.getTask(m.target);
        for (v = 0; v < x.$target.length; v++) if (x.$target[v] == m.id) {
          x.$target.splice(v, 1);
          break;
        }
      }
    }
    function b() {
      for (var m = null, f = l.$data.tasksStore.getItems(), v = 0, x = f.length; v < x; v++) (m = f[v]).$source = [], m.$target = [];
      var $ = l.$data.linksStore.getItems();
      for (v = 0, x = $.length; v < x; v++) p($[v]);
    }
    function g(m) {
      var f = m.source, v = m.target;
      for (var x in m.events) (function($, w) {
        f.attachEvent($, function() {
          return v.callEvent(w, Array.prototype.slice.call(arguments));
        }, w);
      })(x, m.events[x]);
    }
    l.attachEvent("onDestroy", function() {
      u.destructor(), h.destructor();
    }), l.attachEvent("onLinkValidation", function(m) {
      if (l.isLinkExists(m.id) || m.id === "predecessor_generated") return !0;
      for (var f = l.getTask(m.source).$source, v = 0; v < f.length; v++) {
        var x = l.getLink(f[v]), $ = m.source == x.source, w = m.target == x.target, S = m.type == x.type;
        if ($ && w && S) return !1;
      }
      return !0;
    }), u.attachEvent("onBeforeRefreshAll", function() {
      if (!u._skipTaskRecalculation) for (var m = u.getVisibleItems(), f = 0; f < m.length; f++) {
        var v = m[f];
        v.$index = f, v.$local_index = l.getTaskIndex(v.id), l.resetProjectDates(v);
      }
    }), u.attachEvent("onFilterItem", function(m, f) {
      if (l.config.show_tasks_outside_timescale) return !0;
      var v = null, x = null;
      if (l.config.start_date && l.config.end_date) {
        if (l._isAllowedUnscheduledTask(f)) return !0;
        if (v = l.config.start_date.valueOf(), x = l.config.end_date.valueOf(), +f.start_date > x || +f.end_date < +v) return !1;
      }
      return !0;
    }), u.attachEvent("onIdChange", function(m, f) {
      l._update_flags(m, f);
      var v = l.getTask(f);
      u.isSilent() || (v.$split_subtask || v.rollup) && l.eachParent(function(x) {
        l.refreshTask(x.id);
      }, f);
    }), u.attachEvent("onAfterUpdate", function(m) {
      if (l._update_parents(m), l.getState("batchUpdate").batch_update) return !0;
      var f = u.getItem(m);
      f.$source || (f.$source = []);
      for (var v = 0; v < f.$source.length; v++) h.refresh(f.$source[v]);
      for (f.$target || (f.$target = []), v = 0; v < f.$target.length; v++) h.refresh(f.$target[v]);
    }), u.attachEvent("onBeforeItemMove", function(m, f, v) {
      return !Rt(m, l, u) || (console.log("The placeholder task cannot be moved to another position."), !1);
    }), u.attachEvent("onAfterItemMove", function(m, f, v) {
      var x = l.getTask(m);
      this.getNextSibling(m) !== null ? x.$drop_target = this.getNextSibling(m) : this.getPrevSibling(m) !== null ? x.$drop_target = "next:" + this.getPrevSibling(m) : x.$drop_target = "next:null";
    }), u.attachEvent("onStoreUpdated", function(m, f, v) {
      if (v == "delete" && l._update_flags(m, null), !l.$services.getService("state").getState("batchUpdate").batch_update) {
        if (l.config.fit_tasks && v !== "paint") {
          var x = l.getState();
          me(l);
          var $ = l.getState();
          if (+x.min_date != +$.min_date || +x.max_date != +$.max_date) return l.render(), l.callEvent("onScaleAdjusted", []), !0;
        }
        v == "add" || v == "move" || v == "delete" ? l.$layout && (this.$config.name != "task" || v != "add" && v != "delete" || this._skipTaskRecalculation != "lightbox" && (this._skipTaskRecalculation = !0), l.$layout.resize()) : m || h.refresh();
      }
    }), h.attachEvent("onAfterAdd", function(m, f) {
      p(f);
    }), h.attachEvent("onAfterUpdate", function(m, f) {
      b();
    }), h.attachEvent("onAfterDelete", function(m, f) {
      k(f);
    }), h.attachEvent("onAfterSilentDelete", function(m, f) {
      k(f);
    }), h.attachEvent("onBeforeIdChange", function(m, f) {
      k(l.mixin({ id: m }, l.$data.linksStore.getItem(f))), p(l.$data.linksStore.getItem(f));
    }), h.attachEvent("onFilterItem", function(m, f) {
      if (!l.config.show_links) return !1;
      var v = _(f.source), x = _(f.target);
      return !(!v || !x || l._isAllowedUnscheduledTask(l.getTask(f.source)) || l._isAllowedUnscheduledTask(l.getTask(f.target))) && l.callEvent("onBeforeLinkDisplay", [m, f]);
    }), d = {}, l.attachEvent("onBeforeTaskDelete", function(m, f) {
      return d[m] = ve.getSubtreeLinks(l, m), !0;
    }), l.attachEvent("onAfterTaskDelete", function(m, f) {
      d[m] && l.$data.linksStore.silent(function() {
        for (var v in d[m]) l.isLinkExists(v) && l.$data.linksStore.removeItem(v), k(d[m][v]);
        d[m] = null;
      });
    }), l.attachEvent("onAfterLinkDelete", function(m, f) {
      l.isTaskExists(f.source) && l.refreshTask(f.source), l.isTaskExists(f.target) && l.refreshTask(f.target);
    }), l.attachEvent("onParse", b), g({ source: h, target: l, events: { onItemLoading: "onLinkLoading", onBeforeAdd: "onBeforeLinkAdd", onAfterAdd: "onAfterLinkAdd", onBeforeUpdate: "onBeforeLinkUpdate", onAfterUpdate: "onAfterLinkUpdate", onBeforeDelete: "onBeforeLinkDelete", onAfterDelete: "onAfterLinkDelete", onIdChange: "onLinkIdChange" } }), g({ source: u, target: l, events: { onItemLoading: "onTaskLoading", onBeforeAdd: "onBeforeTaskAdd", onAfterAdd: "onAfterTaskAdd", onBeforeUpdate: "onBeforeTaskUpdate", onAfterUpdate: "onAfterTaskUpdate", onBeforeDelete: "onBeforeTaskDelete", onAfterDelete: "onAfterTaskDelete", onIdChange: "onTaskIdChange", onBeforeItemMove: "onBeforeTaskMove", onAfterItemMove: "onAfterTaskMove", onFilterItem: "onBeforeTaskDisplay", onItemOpen: "onTaskOpened", onItemClose: "onTaskClosed", onBeforeSelect: "onBeforeTaskSelected", onAfterSelect: "onTaskSelected", onAfterUnselect: "onTaskUnselected" } }), l.$data = { tasksStore: u, linksStore: h };
  }(e), e.dataProcessor = ni, e.createDataProcessor = ii, function(l) {
    l.ext || (l.ext = {});
    for (var c = [ri, si, li, di, ci, ui, hi, _i, gi], d = 0; d < c.length; d++) c[d] && c[d](l);
  }(e), function(l) {
    l.getGridColumn = function(c) {
      for (var d = l.config.columns, u = 0; u < d.length; u++) if (d[u].name == c) return d[u];
      return null;
    }, l.getGridColumns = function() {
      return l.config.columns.slice();
    };
  }(e), function(l) {
    l.isReadonly = function(c) {
      return typeof c != "number" && typeof c != "string" || !l.isTaskExists(c) || (c = l.getTask(c)), (!c || !c[this.config.editable_property]) && (c && c[this.config.readonly_property] || this.config.readonly);
    };
  }(e), fi(e), function(l) {
    var c = new fn(l), d = new pn(c);
    P(l, xi(c, d));
  }(e), $i(e), function(l) {
    l.getTaskType = function(c) {
      return "task";
    };
  }(e), function(l) {
    function c() {
      return l._cached_functions.update_if_changed(l), l._cached_functions.active || l._cached_functions.activate(), !0;
    }
    l._cached_functions = { cache: {}, mode: !1, critical_path_mode: !1, wrap_methods: function(u, h) {
      if (h._prefetch_originals) for (var _ in h._prefetch_originals) h[_] = h._prefetch_originals[_];
      for (h._prefetch_originals = {}, _ = 0; _ < u.length; _++) this.prefetch(u[_], h);
    }, prefetch: function(u, h) {
      var _ = h[u];
      if (_) {
        var p = this;
        h._prefetch_originals[u] = _, h[u] = function() {
          for (var y = new Array(arguments.length), k = 0, b = arguments.length; k < b; k++) y[k] = arguments[k];
          if (p.active) {
            var g = p.get_arguments_hash(Array.prototype.slice.call(y));
            p.cache[u] || (p.cache[u] = {});
            var m = p.cache[u];
            if (p.has_cached_value(m, g)) return p.get_cached_value(m, g);
            var f = _.apply(this, y);
            return p.cache_value(m, g, f), f;
          }
          return _.apply(this, y);
        };
      }
      return _;
    }, cache_value: function(u, h, _) {
      this.is_date(_) && (_ = new Date(_)), u[h] = _;
    }, has_cached_value: function(u, h) {
      return u.hasOwnProperty(h);
    }, get_cached_value: function(u, h) {
      var _ = u[h];
      return this.is_date(_) && (_ = new Date(_)), _;
    }, is_date: function(u) {
      return u && u.getUTCDate;
    }, get_arguments_hash: function(u) {
      for (var h = [], _ = 0; _ < u.length; _++) h.push(this.stringify_argument(u[_]));
      return "(" + h.join(";") + ")";
    }, stringify_argument: function(u) {
      return (u.id ? u.id : this.is_date(u) ? u.valueOf() : u) + "";
    }, activate: function() {
      this.clear(), this.active = !0;
    }, deactivate: function() {
      this.clear(), this.active = !1;
    }, clear: function() {
      this.cache = {};
    }, setup: function(u) {
      var h = [], _ = ["_isProjectEnd", "_getProjectEnd", "_getSlack"];
      this.mode == "auto" ? u.config.highlight_critical_path && (h = _) : this.mode === !0 && (h = _), this.wrap_methods(h, u);
    }, update_if_changed: function(u) {
      (this.critical_path_mode != u.config.highlight_critical_path || this.mode !== u.config.optimize_render) && (this.critical_path_mode = u.config.highlight_critical_path, this.mode = u.config.optimize_render, this.setup(u));
    } }, l.attachEvent("onBeforeGanttRender", c), l.attachEvent("onBeforeDataRender", c), l.attachEvent("onBeforeSmartRender", function() {
      c();
    }), l.attachEvent("onBeforeParse", c), l.attachEvent("onDataRender", function() {
      l._cached_functions.deactivate();
    });
    var d = null;
    l.attachEvent("onSmartRender", function() {
      d && clearTimeout(d), d = setTimeout(function() {
        l._cached_functions.deactivate();
      }, 1e3);
    }), l.attachEvent("onBeforeGanttReady", function() {
      return l._cached_functions.update_if_changed(l), !0;
    });
  }(e), wi(e), function(l) {
    l.destructor = function() {
      for (var c in this.clearAll(), this.callEvent("onDestroy", []), this._getDatastores().forEach(function(d) {
        d.destructor();
      }), this.$root && delete this.$root.gantt, this._eventRemoveAll && this._eventRemoveAll(), this.$layout && this.$layout.destructor(), this.resetLightbox && this.resetLightbox(), this.ext.inlineEditors && this.ext.inlineEditors.destructor && this.ext.inlineEditors.destructor(), this._dp && this._dp.destructor && this._dp.destructor(), this.$services.destructor(), this.detachAllEvents(), this) c.indexOf("$") === 0 && delete this[c];
      this.$destroyed = !0;
    };
  }(e);
  var o = new Ui({ en: Ni, ar: Si, be: Ti, ca: Ei, cn: Ci, cs: Di, da: Ai, de: Ii, el: Mi, es: Li, fa: Pi, fi: Ri, fr: Hi, he: Oi, hr: Bi, hu: zi, id: Wi, it: ji, jp: Fi, kr: Vi, nb: qi, nl: Gi, no: Yi, pl: Ji, pt: Ki, ro: Xi, ru: Zi, si: Qi, sk: ta, sv: ea, tr: na, ua: ia });
  return e.i18n = { addLocale: o.addLocale, setLocale: function(l) {
    if (typeof l == "string") {
      var c = o.getLocale(l);
      c || (c = o.getLocale("en")), e.locale = c;
    } else if (l) if (e.locale) for (var d in l) l[d] && typeof l[d] == "object" ? (e.locale[d] || (e.locale[d] = {}), e.mixin(e.locale[d], l[d], !0)) : e.locale[d] = l[d];
    else e.locale = l;
    const u = e.locale.labels;
    u.gantt_save_btn = u.gantt_save_btn || u.icon_save, u.gantt_cancel_btn = u.gantt_cancel_btn || u.icon_cancel, u.gantt_delete_btn = u.gantt_delete_btn || u.icon_delete;
  }, getLocale: o.getLocale }, e.i18n.setLocale("en"), e;
}
function sa(t) {
  var e = "data-dhxbox", n = null;
  function i(g, m) {
    var f = g.callback;
    y.hide(g.box), n = g.box = null, f && f(m);
  }
  function a(g) {
    if (n) {
      var m = g.which || g.keyCode, f = !1;
      if (k.keyboard) {
        if (m == 13 || m == 32) {
          var v = g.target || g.srcElement;
          X(v).indexOf("gantt_popup_button") > -1 && v.click ? v.click() : (i(n, !0), f = !0);
        }
        m == 27 && (i(n, !1), f = !0);
      }
      return f ? (g.preventDefault && g.preventDefault(), !(g.cancelBubble = !0)) : void 0;
    }
  }
  var r = vt(t.$root) || document;
  function s(g) {
    s.cover || (s.cover = document.createElement("div"), s.cover.onkeydown = a, s.cover.className = "dhx_modal_cover", document.body.appendChild(s.cover)), s.cover.style.display = g ? "inline-block" : "none";
  }
  function o(g, m, f) {
    return "<div " + t._waiAria.messageButtonAttrString(g) + " class='gantt_popup_button " + ("gantt_" + m.toLowerCase().replace(/ /g, "_") + "_button") + "' data-result='" + f + "' result='" + f + "' ><div>" + g + "</div></div>";
  }
  function l() {
    for (var g = [].slice.apply(arguments, [0]), m = 0; m < g.length; m++) if (g[m]) return g[m];
  }
  function c(g, m, f) {
    var v = g.tagName ? g : function(w, S, T) {
      var E = document.createElement("div"), C = st();
      t._waiAria.messageModalAttr(E, C), E.className = " gantt_modal_box gantt-" + w.type, E.setAttribute(e, 1);
      var D = "";
      if (w.width && (E.style.width = w.width), w.height && (E.style.height = w.height), w.title && (D += '<div class="gantt_popup_title">' + w.title + "</div>"), D += '<div class="gantt_popup_text" id="' + C + '"><span>' + (w.content ? "" : w.text) + '</span></div><div  class="gantt_popup_controls">', S && (D += o(l(w.ok, t.locale.labels.message_ok, "OK"), "ok", !0)), T && (D += o(l(w.cancel, t.locale.labels.message_cancel, "Cancel"), "cancel", !1)), w.buttons) for (var M = 0; M < w.buttons.length; M++) {
        var I = w.buttons[M];
        D += typeof I == "object" ? o(I.label, I.css || "gantt_" + I.label.toLowerCase() + "_button", I.value || M) : o(I, I, M);
      }
      if (D += "</div>", E.innerHTML = D, w.content) {
        var A = w.content;
        typeof A == "string" && (A = document.getElementById(A)), A.style.display == "none" && (A.style.display = ""), E.childNodes[w.title ? 1 : 0].appendChild(A);
      }
      return E.onclick = function(N) {
        var L = N.target || N.srcElement;
        if (L.className || (L = L.parentNode), dt(L, ".gantt_popup_button")) {
          var O = L.getAttribute("data-result");
          i(w, O = O == "true" || O != "false" && O);
        }
      }, w.box = E, (S || T) && (n = w), E;
    }(g, m, f);
    g.hidden || s(!0), document.body.appendChild(v);
    var x = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - v.offsetWidth) / 2)), $ = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - v.offsetHeight) / 2));
    return g.position == "top" ? v.style.top = "-3px" : v.style.top = $ + "px", v.style.left = x + "px", v.onkeydown = a, y.focus(v), g.hidden && y.hide(v), t.callEvent("onMessagePopup", [v]), v;
  }
  function d(g) {
    return c(g, !0, !1);
  }
  function u(g) {
    return c(g, !0, !0);
  }
  function h(g) {
    return c(g);
  }
  function _(g, m, f) {
    return typeof g != "object" && (typeof m == "function" && (f = m, m = ""), g = { text: g, type: m, callback: f }), g;
  }
  function p(g, m, f, v) {
    return typeof g != "object" && (g = { text: g, type: m, expire: f, id: v }), g.id = g.id || st(), g.expire = g.expire || k.expire, g;
  }
  t.event(r, "keydown", a, !0);
  var y = function() {
    var g = _.apply(this, arguments);
    return g.type = g.type || "alert", h(g);
  };
  y.hide = function(g) {
    for (; g && g.getAttribute && !g.getAttribute(e); ) g = g.parentNode;
    g && (g.parentNode.removeChild(g), s(!1), t.callEvent("onAfterMessagePopup", [g]));
  }, y.focus = function(g) {
    setTimeout(function() {
      var m = Lt(g);
      m.length && m[0].focus && m[0].focus();
    }, 1);
  };
  var k = function(g, m, f, v) {
    switch ((g = p.apply(this, arguments)).type = g.type || "info", g.type.split("-")[0]) {
      case "alert":
        return d(g);
      case "confirm":
        return u(g);
      case "modalbox":
        return h(g);
      default:
        return function(x) {
          k.area || (k.area = document.createElement("div"), k.area.className = "gantt_message_area", k.area.style[k.position] = "5px"), Y(k.area, document.body) || document.body.appendChild(k.area), k.hide(x.id);
          var $ = document.createElement("div");
          return $.innerHTML = "<div>" + x.text + "</div>", $.className = "gantt-info gantt-" + x.type, $.onclick = function() {
            k.hide(x.id), x = null;
          }, t._waiAria.messageInfoAttr($), k.position == "bottom" && k.area.firstChild ? k.area.insertBefore($, k.area.firstChild) : k.area.appendChild($), x.expire > 0 && (k.timers[x.id] = window.setTimeout(function() {
            k && k.hide(x.id);
          }, x.expire)), k.pull[x.id] = $, $ = null, x.id;
        }(g);
    }
  };
  k.seed = (/* @__PURE__ */ new Date()).valueOf(), k.uid = st, k.expire = 4e3, k.keyboard = !0, k.position = "top", k.pull = {}, k.timers = {}, k.hideAll = function() {
    for (var g in k.pull) k.hide(g);
  }, k.hide = function(g) {
    var m = k.pull[g];
    m && m.parentNode && (window.setTimeout(function() {
      m.parentNode.removeChild(m), m = null;
    }, 2e3), m.className += " hidden", k.timers[g] && window.clearTimeout(k.timers[g]), delete k.pull[g]);
  };
  var b = [];
  return t.attachEvent("onMessagePopup", function(g) {
    b.push(g);
  }), t.attachEvent("onAfterMessagePopup", function(g) {
    for (var m = 0; m < b.length; m++) b[m] === g && (b.splice(m, 1), m--);
  }), t.attachEvent("onDestroy", function() {
    s.cover && s.cover.parentNode && s.cover.parentNode.removeChild(s.cover);
    for (var g = 0; g < b.length; g++) b[g].parentNode && b[g].parentNode.removeChild(b[g]);
    b = null, k.area && k.area.parentNode && k.area.parentNode.removeChild(k.area), k = null;
  }), { alert: function() {
    var g = _.apply(this, arguments);
    return g.type = g.type || "confirm", d(g);
  }, confirm: function() {
    var g = _.apply(this, arguments);
    return g.type = g.type || "alert", u(g);
  }, message: k, modalbox: y };
}
function ze(t, e) {
  var n = this.$config[t];
  return n ? (n.$extendedConfig || (n.$extendedConfig = !0, Object.setPrototypeOf(n, e)), n) : e;
}
function oa(t, e) {
  var n, i, a;
  P(t, (n = e, { $getConfig: function() {
    return i || (i = n ? n.$getConfig() : this.$gantt.config), this.$config.config ? ze.call(this, "config", i) : i;
  }, $getTemplates: function() {
    return a || (a = n ? n.$getTemplates() : this.$gantt.templates), this.$config.templates ? ze.call(this, "templates", a) : a;
  } }));
}
const la = function(t) {
  var e = {}, n = {};
  function i(a, r, s, o) {
    var l = e[a];
    if (!l || !l.create) return !1;
    a != "resizer" || s.mode || (o.$config.cols ? s.mode = "x" : s.mode = "y"), a != "viewcell" || s.view != "scrollbar" || s.scroll || (o.$config.cols ? s.scroll = "y" : s.scroll = "x"), (s = q(s)).id || n[s.view] || (s.id = s.view), s.id && !s.css && (s.css = s.id + "_cell");
    var c = new l.create(r, s, this, t);
    return l.configure && l.configure(c), oa(c, o), c.$id || (c.$id = s.id || t.uid()), c.$parent || typeof r != "object" || (c.$parent = r), c.$config || (c.$config = s), n[c.$id] && (c.$id = t.uid()), n[c.$id] = c, c;
  }
  return { initUI: function(a, r) {
    var s = "cell";
    return a.view ? s = "viewcell" : a.resizer ? s = "resizer" : a.rows || a.cols ? s = "layout" : a.views && (s = "multiview"), i.call(this, s, null, a, r);
  }, reset: function() {
    n = {};
  }, registerView: function(a, r, s) {
    e[a] = { create: r, configure: s };
  }, createView: i, getView: function(a) {
    return n[a];
  } };
};
var da = /* @__PURE__ */ function(t) {
  return function(e) {
    var n = { click: {}, doubleclick: {}, contextMenu: {} };
    function i(h, _, p, y) {
      n[h][_] || (n[h][_] = []), n[h][_].push({ handler: p, root: y });
    }
    function a(h) {
      h = h || window.event;
      var _ = e.locate(h), p = s(h, n.click), y = !0;
      if (_ !== null ? y = !e.checkEvent("onTaskClick") || e.callEvent("onTaskClick", [_, h]) : e.callEvent("onEmptyClick", [h]), y) {
        if (!o(p, h, _)) return;
        switch (h.target.nodeName) {
          case "SELECT":
          case "INPUT":
            return;
        }
        _ && e.getTask(_) && !e._multiselect && e.config.select_task && e.selectTask(_);
      }
    }
    function r(h) {
      var _ = (h = h || window.event).target || h.srcElement, p = e.locate(_), y = e.locate(_, e.config.link_attribute), k = !e.checkEvent("onContextMenu") || e.callEvent("onContextMenu", [p, y, h]);
      return k || (h.preventDefault ? h.preventDefault() : h.returnValue = !1), k;
    }
    function s(h, _) {
      for (var p = h.target || h.srcElement, y = []; p; ) {
        var k = t.getClassName(p);
        if (k) {
          k = k.split(" ");
          for (var b = 0; b < k.length; b++) if (k[b] && _[k[b]]) for (var g = _[k[b]], m = 0; m < g.length; m++) g[m].root && !t.isChildOf(p, g[m].root) || y.push(g[m].handler);
        }
        p = p.parentNode;
      }
      return y;
    }
    function o(h, _, p) {
      for (var y = !0, k = 0; k < h.length; k++) {
        var b = h[k].call(e, _, p, _.target || _.srcElement);
        y = y && !(b !== void 0 && b !== !0);
      }
      return y;
    }
    function l(h) {
      h = h || window.event;
      var _ = e.locate(h), p = s(h, n.doubleclick), y = !e.checkEvent("onTaskDblClick") || _ === null || e.callEvent("onTaskDblClick", [_, h]);
      if (y) {
        if (!o(p, h, _)) return;
        _ !== null && e.getTask(_) && y && e.config.details_on_dblclick && !e.isReadonly(_) && e.showLightbox(_);
      }
    }
    function c(h) {
      if (e.checkEvent("onMouseMove")) {
        var _ = e.locate(h);
        e._last_move_event = h, e.callEvent("onMouseMove", [_, h]);
      }
    }
    var d = e._createDomEventScope();
    function u(h) {
      d.detachAll(), h && (d.attach(h, "click", a), d.attach(h, "dblclick", l), d.attach(h, "mousemove", c), d.attach(h, "contextmenu", r));
    }
    return { reset: u, global: function(h, _, p) {
      i(h, _, p, null);
    }, delegate: i, detach: function(h, _, p, y) {
      if (n[h] && n[h][_]) {
        for (var k = n[h], b = k[_], g = 0; g < b.length; g++) b[g].root == y && (b.splice(g, 1), g--);
        b.length || delete k[_];
      }
    }, callHandler: function(h, _, p, y) {
      var k = n[h][_];
      if (k) for (var b = 0; b < k.length; b++) (p || k[b].root) && k[b].root !== p || k[b].handler.apply(this, y);
    }, onDoubleClick: l, onMouseMove: c, onContextMenu: r, onClick: a, destructor: function() {
      u(), n = null, d = null;
    } };
  };
}(rn);
const ca = { init: da };
function We(t, e, n) {
  return !!e && !(e.left > t.x_end || e.left + e.width < t.x) && !(e.top > t.y_end || e.top + e.height < t.y);
}
function Nt(t) {
  return t.config.smart_rendering && t._smart_render;
}
function Kt(t, e, n) {
  return { top: e.getItemTop(t.id), height: e.getItemHeight(t.id), left: 0, right: 1 / 0 };
}
function ft(t, e, n, i, a) {
  var r = e.getItemIndexByTopPosition(a.y) || 0, s = e.getItemIndexByTopPosition(a.y_end) || i.count(), o = Math.max(0, r - 1), l = Math.min(i.count(), s + 1);
  const c = [];
  if (t.config.keyboard_navigation && t.getSelectedId()) {
    let d = t.getTask(t.getSelectedId());
    d.$expanded_branch && !d.$split_subtask && c.push(t.getSelectedId());
  }
  if (t.$ui.getView("grid") && t.ext.inlineEditors && t.ext.inlineEditors.getState().id) {
    let d = t.ext.inlineEditors.getState().id;
    i.exists(d) && c.push(d);
  }
  return { start: o, end: l, ids: c };
}
var ua = function(t) {
  var e = /* @__PURE__ */ function(n) {
    var i = {}, a = {};
    function r(o) {
      var l = null;
      return typeof o.view == "string" ? l = n.$ui.getView(o.view) : o.view && (l = o.view), l;
    }
    function s(o, l, c) {
      if (a[o]) return a[o];
      l.renderer || n.assert(!1, "Invalid renderer call");
      var d = null, u = null, h = null, _ = null, p = null;
      typeof l.renderer == "function" ? (d = l.renderer, h = Kt) : (d = l.renderer.render, u = l.renderer.update, _ = l.renderer.onrender, l.renderer.isInViewPort ? p = l.renderer.isInViewPort : h = l.renderer.getRectangle, h || h === null || (h = Kt));
      var y = l.filter;
      return c && c.setAttribute(n.config.layer_attribute, !0), a[o] = { render_item: function(k, b, g, m, f) {
        if (b = b || c, !y || y(k)) {
          var v = m || r(l), x = f || (v ? v.$getConfig() : null), $ = g;
          !$ && x && x.smart_rendering && ($ = v.getViewPort());
          var w = null;
          !Nt(n) && (h || p) && $ ? (p ? p(k, $, v, x, n) : We($, h(k, v, x, n))) && (w = d.call(n, k, v, x, $)) : w = d.call(n, k, v, x, $), this.append(k, w, b);
          var S = b.nodeType == 11;
          _ && !S && w && _.call(n, k, w, v);
        } else this.remove_item(k.id);
      }, clear: function(k) {
        this.rendered = i[o] = {}, l.append || this.clear_container(k);
      }, clear_container: function(k) {
        (k = k || c) && (k.innerHTML = "");
      }, get_visible_range: function(k) {
        var b, g, m = r(l), f = m ? m.$getConfig() : null;
        return f && f.smart_rendering && (b = m.getViewPort()), m && b && (typeof l.renderer == "function" ? g = ft(n, m, 0, k, b) : l.renderer && l.renderer.getVisibleRange && (g = l.renderer.getVisibleRange(n, m, f, k, b))), g || (g = { start: 0, end: k.count() }), g;
      }, prepare_data: function(k) {
        if (l.renderer && l.renderer.prepareData) return l.renderer.prepareData(k, n, l);
      }, render_items: function(k, b) {
        b = b || c;
        var g = document.createDocumentFragment();
        this.clear(b);
        var m = null, f = r(l), v = f ? f.$getConfig() : null;
        v && v.smart_rendering && (m = f.getViewPort());
        for (var x = 0, $ = k.length; x < $; x++) this.render_item(k[x], g, m, f, v);
        b.appendChild(g, b);
        var w = {};
        k.forEach(function(E) {
          w[E.id] = E;
        });
        var S = {};
        if (_) {
          var T = {};
          for (var x in this.rendered) S[x] || (T[x] = this.rendered[x], _.call(n, w[x], this.rendered[x], f));
        }
      }, update_items: function(k, b) {
        var g = r(l), m = g ? g.$getConfig() : null;
        if (g && g.$getConfig().smart_rendering && !Nt(n) && this.rendered && (h || p)) {
          b = b || c;
          var f = document.createDocumentFragment(), v = null;
          g && (v = g.getViewPort());
          var x = {};
          k.forEach(function(I) {
            x[I.id] = I;
          });
          var $ = {}, w = {};
          for (var S in this.rendered) w[S] = !0, $[S] = !0;
          for (var T = {}, E = (S = 0, k.length); S < E; S++) {
            var C = k[S], D = this.rendered[C.id];
            w[C.id] = !1, D && D.parentNode ? (p ? p(C, v, g, m, n) : We(v, h(C, g, m, n))) ? (u && u.call(n, C, D, g, m, v), this.restore(C, f)) : w[C.id] = !0 : (T[k[S].id] = !0, this.render_item(k[S], f, v, g, m));
          }
          for (var S in w) w[S] && this.hide(S);
          if (f.childNodes.length && b.appendChild(f, b), _) {
            var M = {};
            for (var S in this.rendered) $[S] && !T[S] || (M[S] = this.rendered[S], _.call(n, x[S], this.rendered[S], g));
          }
        }
      }, append: function(k, b, g) {
        this.rendered && (b ? (this.rendered[k.id] && this.rendered[k.id].parentNode ? this.replace_item(k.id, b) : g.appendChild(b), this.rendered[k.id] = b) : this.rendered[k.id] && this.remove_item(k.id));
      }, replace_item: function(k, b) {
        var g = this.rendered[k];
        g && g.parentNode && g.parentNode.replaceChild(b, g), this.rendered[k] = b;
      }, remove_item: function(k) {
        this.hide(k), delete this.rendered[k];
      }, hide: function(k) {
        var b = this.rendered[k];
        b && b.parentNode && b.parentNode.removeChild(b), delete this.rendered[k];
      }, restore: function(k, b) {
        var g = this.rendered[k.id];
        g ? g.parentNode || this.append(k, g, b || c) : this.render_item(k, b || c);
      }, change_id: function(k, b) {
        this.rendered[b] = this.rendered[k], delete this.rendered[k];
      }, rendered: i[o], node: c, destructor: function() {
        this.clear(), delete a[o], delete i[o];
      } }, a[o];
    }
    return { getRenderer: s, clearRenderers: function() {
      for (var o in a) s(o).destructor();
    } };
  }(t);
  return { createGroup: function(n, i, a, r) {
    var s = { tempCollection: [], renderers: {}, container: n, filters: [], getLayers: function() {
      this._add();
      var o = [];
      for (var l in this.renderers) o.push(this.renderers[l]);
      return o;
    }, getLayer: function(o) {
      return this.renderers[o];
    }, _add: function(o) {
      o && (o.id = o.id || st(), this.tempCollection.push(o));
      const l = this.container(), c = this.tempCollection;
      for (let d = 0; d < c.length; d++) {
        if (o = c[d], !(this.container() || o && o.container && o.container.isConnected)) continue;
        let u = o.container, h = o.id, _ = o.topmost;
        if (!u.parentNode) if (_) l.appendChild(u);
        else {
          let p = i ? i() : l.firstChild;
          p && p.parentNode == l ? l.insertBefore(u, p) : l.appendChild(u);
        }
        this.renderers[h] = e.getRenderer(h, o, u), r && r(o, t), this.tempCollection.splice(d, 1), d--;
      }
    }, addLayer: function(o) {
      if (o) {
        typeof o == "function" && (o = { renderer: o }), o.filter === void 0 ? o.filter = je(a || []) : o.filter instanceof Array && (o.filter.push(a), o.filter = je(o.filter)), o.container || (o.container = document.createElement("div"));
        var l = this;
        o.requestUpdate = function() {
          t.config.smart_rendering && !Nt(t) && l.renderers[o.id] && l.onUpdateRequest(l.renderers[o.id]);
        };
      }
      return this._add(o), o ? o.id : void 0;
    }, onUpdateRequest: function(o) {
    }, eachLayer: function(o) {
      for (var l in this.renderers) o(this.renderers[l]);
    }, removeLayer: function(o) {
      this.renderers[o] && (this.renderers[o].destructor(), delete this.renderers[o]);
    }, clear: function() {
      for (var o in this.renderers) this.renderers[o].destructor();
      this.renderers = {};
    } };
    return t.attachEvent("onDestroy", function() {
      s.clear(), s = null;
    }), s;
  } };
};
function je(t) {
  return t instanceof Array || (t = Array.prototype.slice.call(arguments, 0)), function(e) {
    for (var n = !0, i = 0, a = t.length; i < a; i++) {
      var r = t[i];
      r && (n = n && r(e.id, e) !== !1);
    }
    return n;
  };
}
function Fe(t, e, n) {
  if (!t.start_date || !t.end_date) return null;
  var i = e.posFromDate(t.start_date), a = e.posFromDate(t.end_date), r = Math.min(i, a) - 200, s = Math.max(i, a) + 200;
  return { top: e.getItemTop(t.id), height: e.getItemHeight(t.id), left: r, width: s - r };
}
function mn() {
  var t = [], e = !1;
  function n() {
    t = [], e = !1;
  }
  function i(r, s, o) {
    s.$getConfig(), r.getVisibleItems().forEach(function(l) {
      var c = function(d, u, h, _) {
        if (!_.isTaskExists(d.source) || !_.isTaskExists(d.target)) return null;
        var p = Fe(_.getTask(d.source), u), y = Fe(_.getTask(d.target), u);
        if (!p || !y) return null;
        var k = 100, b = Math.min(p.left, y.left) - k, g = Math.max(p.left + p.width, y.left + y.width) + k, m = Math.min(p.top, y.top) - k, f = Math.max(p.top + p.height, y.top + y.height) + k;
        return { top: m, height: f - m, bottom: f, left: b, width: g - b, right: g };
      }(l, s, 0, o);
      c && t.push({ id: l.id, rec: c });
    }), t.sort(function(l, c) {
      return l.rec.right < c.rec.right ? -1 : 1;
    }), e = !0;
  }
  var a = !1;
  return function(r, s, o, l, c) {
    (function(p) {
      a || (a = !0, p.attachEvent("onPreFilter", n), p.attachEvent("onStoreUpdated", n), p.attachEvent("onClearAll", n), p.attachEvent("onBeforeStoreUpdate", n));
    })(l), e || i(l, s, r);
    for (var d = [], u = 0; u < t.length; u++) {
      var h = t[u], _ = h.rec;
      _.right < c.x || _.left < c.x_end && _.right > c.x && _.top < c.y_end && _.bottom > c.y && d.push(h.id);
    }
    return { ids: d };
  };
}
function vn(t, e, n, i, a) {
  var r = n.$gantt.getTask(t.source), s = n.$gantt.getTask(t.target), o = n.getItemTop(r.id), l = n.getItemHeight(r.id), c = n.getItemTop(s.id), d = n.getItemHeight(s.id);
  if (e.y > o + l && e.y > c + d || e.y_end < c && e.y_end < o) return !1;
  var u = n.posFromDate(r.start_date), h = n.posFromDate(r.end_date), _ = n.posFromDate(s.start_date), p = n.posFromDate(s.end_date);
  if (u > h) {
    var y = h;
    h = u, u = y;
  }
  return _ > p && (y = p, p = _, _ = y), u += -100, h += 100, _ += -100, p += 100, !(e.x > h && e.x > p) && !(e.x_end < u && e.x_end < _);
}
function ha(t, e) {
  if (t.view) {
    var n = t.view;
    typeof n == "string" && (n = e.$ui.getView(n)), n && n.attachEvent && n.attachEvent("onScroll", function() {
      e.$services.getService("state").getState("batchUpdate").batch_update || n.$config.$skipSmartRenderOnScroll || t.requestUpdate && t.requestUpdate();
    });
  }
}
var Ht = function() {
  function t(e, n, i, a) {
    e && (this.$container = we(e), this.$parent = e), this.$config = P(n, { headerHeight: 33 }), this.$gantt = a, this.$domEvents = a._createDomEventScope(), this.$id = n.id || "c" + st(), this.$name = "cell", this.$factory = i, this.$externalComponent = null, ot(this);
  }
  return t.prototype.destructor = function() {
    this.$parent = this.$container = this.$view = null, this.$gantt.$services.getService("mouseEvents").detach("click", "gantt_header_arrow", this._headerClickHandler), this.$domEvents.detachAll(), this.callEvent("onDestroy", []), this.detachAllEvents();
  }, t.prototype.cell = function(e) {
    return null;
  }, t.prototype.scrollTo = function(e, n) {
    var i = this.$view;
    this.$config.html && (i = this.$view.firstChild), 1 * e == e && (i.scrollLeft = e), 1 * n == n && (i.scrollTop = n);
  }, t.prototype.clear = function() {
    this.getNode().innerHTML = "", this.getNode().className = "gantt_layout_content", this.getNode().style.padding = "0";
  }, t.prototype.resize = function(e) {
    if (this.$parent) return this.$parent.resize(e);
    e === !1 && (this.$preResize = !0);
    var n = this.$container, i = n.offsetWidth, a = n.offsetHeight, r = this.getSize();
    n === document.body && (i = document.body.offsetWidth, a = document.body.offsetHeight), i < r.minWidth && (i = r.minWidth), i > r.maxWidth && (i = r.maxWidth), a < r.minHeight && (a = r.minHeight), a > r.maxHeight && (a = r.maxHeight), this.setSize(i, a), this.$preResize, this.$preResize = !1;
  }, t.prototype.hide = function() {
    this._hide(!0), this.resize();
  }, t.prototype.show = function(e) {
    this._hide(!1), e && this.$parent && this.$parent.show(), this.resize();
  }, t.prototype._hide = function(e) {
    if (e === !0 && this.$view.parentNode) this.$view.parentNode.removeChild(this.$view);
    else if (e === !1 && !this.$view.parentNode) {
      var n = this.$parent.cellIndex(this.$id);
      this.$parent.moveView(this, n);
    }
    this.$config.hidden = e;
  }, t.prototype.$toHTML = function(e, n) {
    e === void 0 && (e = ""), n = [n || "", this.$config.css || ""].join(" ");
    var i = this.$config, a = "";
    if (i.raw) e = typeof i.raw == "string" ? i.raw : "";
    else {
      if (!e) {
        let r = null;
        r = typeof i.html == "function" ? i.html() : i.html, this.$gantt.config.external_render && this.$gantt.config.external_render.isElement(r) && (this.$externalComponent = r, r = null), e = "<div class='gantt_layout_content' " + (n ? " class='" + n + "' " : "") + " >" + (r || "") + "</div>";
      }
      i.header && (a = "<div class='gantt_layout_header'>" + (i.canCollapse ? "<div class='gantt_layout_header_arrow'></div>" : "") + "<div class='gantt_layout_header_content'>" + i.header + "</div></div>");
    }
    return "<div class='gantt_layout_cell " + n + "' data-cell-id='" + this.$id + "'>" + a + e + "</div>";
  }, t.prototype.$fill = function(e, n) {
    this.$view = e, this.$parent = n, this.init();
  }, t.prototype.getNode = function() {
    return this.$view.querySelector("gantt_layout_cell") || this.$view;
  }, t.prototype.init = function() {
    var e = this;
    this._headerClickHandler = function(n) {
      nt(n, "data-cell-id") == e.$id && e.toggle();
    }, this.$gantt.$services.getService("mouseEvents").delegate("click", "gantt_header_arrow", this._headerClickHandler), this.callEvent("onReady", []);
  }, t.prototype.toggle = function() {
    this.$config.collapsed = !this.$config.collapsed, this.resize();
  }, t.prototype.getSize = function() {
    var e = { height: this.$config.height || 0, width: this.$config.width || 0, gravity: this.$config.gravity || 1, minHeight: this.$config.minHeight || 0, minWidth: this.$config.minWidth || 0, maxHeight: this.$config.maxHeight || 1e11, maxWidth: this.$config.maxWidth || 1e11 };
    if (this.$config.collapsed) {
      var n = this.$config.mode === "x";
      e[n ? "width" : "height"] = e[n ? "maxWidth" : "maxHeight"] = this.$config.headerHeight;
    }
    return e;
  }, t.prototype.getContentSize = function() {
    var e = this.$lastSize.contentX;
    e !== 1 * e && (e = this.$lastSize.width);
    var n = this.$lastSize.contentY;
    return n !== 1 * n && (n = this.$lastSize.height), { width: e, height: n };
  }, t.prototype._getBorderSizes = function() {
    var e = { top: 0, right: 0, bottom: 0, left: 0, horizontal: 0, vertical: 0 };
    return this._currentBorders && (this._currentBorders[this._borders.left] && (e.left = 1, e.horizontal++), this._currentBorders[this._borders.right] && (e.right = 1, e.horizontal++), this._currentBorders[this._borders.top] && (e.top = 1, e.vertical++), this._currentBorders[this._borders.bottom] && (e.bottom = 1, e.vertical++)), e;
  }, t.prototype.setSize = function(e, n) {
    this.$view.style.width = e + "px", this.$view.style.height = n + "px";
    var i = this._getBorderSizes(), a = n - i.vertical, r = e - i.horizontal;
    this.$lastSize = { x: e, y: n, contentX: r, contentY: a }, this.$config.header ? this._sizeHeader() : this._sizeContent();
  }, t.prototype._borders = { left: "gantt_layout_cell_border_left", right: "gantt_layout_cell_border_right", top: "gantt_layout_cell_border_top", bottom: "gantt_layout_cell_border_bottom" }, t.prototype._setBorders = function(e, n) {
    n || (n = this);
    var i = n.$view;
    for (var a in this._borders) Gt(i, this._borders[a]);
    typeof e == "string" && (e = [e]);
    var r = {};
    for (a = 0; a < e.length; a++) wt(i, e[a]), r[e[a]] = !0;
    n._currentBorders = r;
  }, t.prototype._sizeContent = function() {
    var e = this.$view.childNodes[0];
    e && e.className == "gantt_layout_content" && (e.style.height = this.$lastSize.contentY + "px");
  }, t.prototype._sizeHeader = function() {
    var e = this.$lastSize;
    e.contentY -= this.$config.headerHeight;
    var n = this.$view.childNodes[0], i = this.$view.childNodes[1], a = this.$config.mode === "x";
    if (this.$config.collapsed) if (i.style.display = "none", a) {
      n.className = "gantt_layout_header collapsed_x", n.style.width = e.y + "px";
      var r = Math.floor(e.y / 2 - e.x / 2);
      n.style.transform = "rotate(90deg) translate(" + r + "px, " + r + "px)", i.style.display = "none";
    } else n.className = "gantt_layout_header collapsed_y";
    else n.className = a ? "gantt_layout_header" : "gantt_layout_header vertical", n.style.width = "auto", n.style.transform = "", i.style.display = "", i.style.height = e.contentY + "px";
    n.style.height = this.$config.headerHeight + "px";
  }, t;
}();
function z(t, e) {
  for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
  function i() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (i.prototype = e.prototype, new i());
}
var kn = function(t) {
  function e(n, i, a) {
    var r = t.apply(this, arguments) || this;
    return n && (r.$root = !0), r._parseConfig(i), r.$name = "layout", r;
  }
  return z(e, t), e.prototype.destructor = function() {
    this.$container && this.$view && Qe(this.$view);
    for (var n = 0; n < this.$cells.length; n++)
      this.$cells[n].destructor();
    this.$cells = [], t.prototype.destructor.call(this);
  }, e.prototype._resizeScrollbars = function(n, i) {
    var a = !1, r = [], s = [];
    const o = [];
    function l(p) {
      p.$parent.show(), a = !0, r.push(p);
    }
    function c(p) {
      p.$parent.hide(), a = !0, s.push(p);
    }
    for (var d, u = 0; u < i.length; u++) n[(d = i[u]).$config.scroll] ? c(d) : d.shouldHide() ? o.push(d) : d.shouldShow() ? l(d) : d.isVisible() ? r.push(d) : s.push(d);
    var h = {};
    for (u = 0; u < r.length; u++) r[u].$config.group && (h[r[u].$config.group] = !0);
    for (o.forEach(function(p) {
      p.$config.group && h[p.$config.group] || c(p);
    }), u = 0; u < s.length; u++) if ((d = s[u]).$config.group && h[d.$config.group]) {
      l(d);
      for (var _ = 0; _ < r.length; _++) if (r[_] == d) {
        this.$gantt.$scrollbarRepaint = !0;
        break;
      }
    }
    return a;
  }, e.prototype.getScrollbarsInfo = function() {
    const n = this.getCellsByType("scroller"), i = [];
    return n.forEach((a) => {
      let r = {};
      const { visible: s, direction: o, size: l, scrollSize: c, position: d } = a.getScrollState();
      let u = a._getLinkedViews().map((h) => h.$config.id);
      r.id = a.$id, r.visible = s, r.boundViews = u, o === "x" ? (r.x = l, r.x_inner = c, r.x_pos = d || 0) : (r.y = l, r.y_inner = c, r.y_pos = d || 0), i.push(r);
    }), i;
  }, e.prototype._syncCellSizes = function(n, i) {
    if (n) {
      var a = {};
      return this._eachChild(function(r) {
        r.$config.group && r.$name != "scrollbar" && r.$name != "resizer" && (a[r.$config.group] || (a[r.$config.group] = []), a[r.$config.group].push(r));
      }), a[n] && this._syncGroupSize(a[n], i), a[n];
    }
  }, e.prototype._syncGroupSize = function(n, i) {
    if (n.length) for (var a = n[0].$parent._xLayout ? "width" : "height", r = n[0].$parent.getNextSibling(n[0].$id) ? 1 : -1, s = i.value, o = i.isGravity, l = 0; l < n.length; l++) {
      var c = n[l].getSize(), d = r > 0 ? n[l].$parent.getNextSibling(n[l].$id) : n[l].$parent.getPrevSibling(n[l].$id);
      d.$name == "resizer" && (d = r > 0 ? d.$parent.getNextSibling(d.$id) : d.$parent.getPrevSibling(d.$id));
      var u = d.getSize();
      if (o) n[l].$config.gravity = s;
      else if (d[a]) {
        var h = c.gravity + u.gravity, _ = c[a] + u[a], p = h / _;
        n[l].$config.gravity = p * s, d.$config[a] = _ - s, d.$config.gravity = h - p * s;
      } else n[l].$config[a] = s;
      var y = this.$gantt.$ui.getView("grid");
      !y || n[l].$content !== y || y.$config.scrollable || o || (this.$gantt.config.grid_width = s);
    }
  }, e.prototype.resize = function(n) {
    var i = !1;
    if (this.$root && !this._resizeInProgress && (this.callEvent("onBeforeResize", []), i = !0, this._resizeInProgress = !0), t.prototype.resize.call(this, !0), t.prototype.resize.call(this, !1), i) {
      var a = [];
      a = (a = (a = a.concat(this.getCellsByType("viewCell"))).concat(this.getCellsByType("viewLayout"))).concat(this.getCellsByType("hostCell"));
      for (var r = this.getCellsByType("scroller"), s = 0; s < a.length; s++) a[s].$config.hidden || a[s].setContentSize();
      var o = this._getAutosizeMode(this.$config.autosize), l = this._resizeScrollbars(o, r);
      if (this.$config.autosize && (this.autosize(this.$config.autosize), a.forEach(function(c) {
        const d = c.$parent, u = d.getContentSize(o);
        o.x && (d.$config.$originalWidthStored || (d.$config.$originalWidthStored = !0, d.$config.$originalWidth = d.$config.width), d.$config.width = u.width), o.y && (d.$config.$originalHeightStored || (d.$config.$originalHeightStored = !0, d.$config.$originalHeight = d.$config.height), d.$config.height = u.height);
      }), l = !0), l)
        for (this.resize(), s = 0; s < a.length; s++) a[s].$config.hidden || a[s].setContentSize();
      this.callEvent("onResize", []);
    }
    i && (this._resizeInProgress = !1);
  }, e.prototype._eachChild = function(n, i) {
    if (n(i = i || this), i.$cells) for (var a = 0; a < i.$cells.length; a++) this._eachChild(n, i.$cells[a]);
  }, e.prototype.isChild = function(n) {
    var i = !1;
    return this._eachChild(function(a) {
      a !== n && a.$content !== n || (i = !0);
    }), i;
  }, e.prototype.getCellsByType = function(n) {
    var i = [];
    if (n === this.$name && i.push(this), this.$content && this.$content.$name == n && i.push(this.$content), this.$cells) for (var a = 0; a < this.$cells.length; a++) {
      var r = e.prototype.getCellsByType.call(this.$cells[a], n);
      r.length && i.push.apply(i, r);
    }
    return i;
  }, e.prototype.getNextSibling = function(n) {
    var i = this.cellIndex(n);
    return i >= 0 && this.$cells[i + 1] ? this.$cells[i + 1] : null;
  }, e.prototype.getPrevSibling = function(n) {
    var i = this.cellIndex(n);
    return i >= 0 && this.$cells[i - 1] ? this.$cells[i - 1] : null;
  }, e.prototype.cell = function(n) {
    for (var i = 0; i < this.$cells.length; i++) {
      var a = this.$cells[i];
      if (a.$id === n) return a;
      var r = a.cell(n);
      if (r) return r;
    }
  }, e.prototype.cellIndex = function(n) {
    for (var i = 0; i < this.$cells.length; i++) if (this.$cells[i].$id === n) return i;
    return -1;
  }, e.prototype.moveView = function(n, i) {
    if (this.$cells[i] !== n) return window.alert("Not implemented");
    i += this.$config.header ? 1 : 0;
    var a = this.$view;
    i >= a.childNodes.length ? a.appendChild(n.$view) : a.insertBefore(n.$view, a.childNodes[i]);
  }, e.prototype._parseConfig = function(n) {
    this.$cells = [], this._xLayout = !n.rows;
    for (var i = n.rows || n.cols || n.views, a = 0; a < i.length; a++) {
      var r = i[a];
      r.mode = this._xLayout ? "x" : "y";
      var s = this.$factory.initUI(r, this);
      s ? (s.$parent = this, this.$cells.push(s)) : (i.splice(a, 1), a--);
    }
  }, e.prototype.getCells = function() {
    return this.$cells;
  }, e.prototype.render = function() {
    var n = Ze(this.$container, this.$toHTML());
    this.$fill(n, null);
    const i = this.$gantt;
    this._eachChild((a) => {
      a.$externalComponent && (i.config.external_render.renderElement(a.$externalComponent, a.$view.querySelector(".gantt_layout_content")), a.$externalComponent = null);
    }), this.callEvent("onReady", []), this.resize(), this.render = this.resize;
  }, e.prototype.$fill = function(n, i) {
    this.$view = n, this.$parent = i;
    for (var a = tn(n, "gantt_layout_cell"), r = a.length - 1; r >= 0; r--) {
      var s = this.$cells[r];
      s.$fill(a[r], this), s.$config.hidden && s.$view.parentNode.removeChild(s.$view);
    }
  }, e.prototype.$toHTML = function() {
    for (var n = this._xLayout ? "x" : "y", i = [], a = 0; a < this.$cells.length; a++) i.push(this.$cells[a].$toHTML());
    return t.prototype.$toHTML.call(this, i.join(""), (this.$root ? "gantt_layout_root " : "") + "gantt_layout gantt_layout_" + n);
  }, e.prototype.getContentSize = function(n) {
    for (var i, a, r, s = 0, o = 0, l = 0; l < this.$cells.length; l++) (a = this.$cells[l]).$config.hidden || (i = a.getContentSize(n), a.$config.view === "scrollbar" && n[a.$config.scroll] && (i.height = 0, i.width = 0), a.$config.resizer && (this._xLayout ? i.height = 0 : i.width = 0), r = a._getBorderSizes(), this._xLayout ? (s += i.width + r.horizontal, o = Math.max(o, i.height + r.vertical)) : (s = Math.max(s, i.width + r.horizontal), o += i.height + r.vertical));
    return { width: s += (r = this._getBorderSizes()).horizontal, height: o += r.vertical };
  }, e.prototype._cleanElSize = function(n) {
    return 1 * (n || "").toString().replace("px", "") || 0;
  }, e.prototype._getBoxStyles = function(n) {
    var i = null, a = ["width", "height", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"], r = { boxSizing: (i = window.getComputedStyle ? window.getComputedStyle(n, null) : { width: n.clientWidth, height: n.clientHeight }).boxSizing == "border-box" };
    i.MozBoxSizing && (r.boxSizing = i.MozBoxSizing == "border-box");
    for (var s = 0; s < a.length; s++) r[a[s]] = i[a[s]] ? this._cleanElSize(i[a[s]]) : 0;
    var o = { horPaddings: r.paddingLeft + r.paddingRight + r.borderLeftWidth + r.borderRightWidth, vertPaddings: r.paddingTop + r.paddingBottom + r.borderTopWidth + r.borderBottomWidth, borderBox: r.boxSizing, innerWidth: r.width, innerHeight: r.height, outerWidth: r.width, outerHeight: r.height };
    return o.borderBox ? (o.innerWidth -= o.horPaddings, o.innerHeight -= o.vertPaddings) : (o.outerWidth += o.horPaddings, o.outerHeight += o.vertPaddings), o;
  }, e.prototype._getAutosizeMode = function(n) {
    var i = { x: !1, y: !1 };
    return n === "xy" ? i.x = i.y = !0 : n === "y" || n === !0 ? i.y = !0 : n === "x" && (i.x = !0), i;
  }, e.prototype.autosize = function(n) {
    var i = this._getAutosizeMode(n), a = this._getBoxStyles(this.$container), r = this.getContentSize(n), s = this.$container;
    i.x && (a.borderBox && (r.width += a.horPaddings), s.style.width = r.width + "px"), i.y && (a.borderBox && (r.height += a.vertPaddings), s.style.height = r.height + "px");
  }, e.prototype.getSize = function() {
    this._sizes = [];
    for (var n = 0, i = 0, a = 1e11, r = 0, s = 1e11, o = 0, l = 0; l < this.$cells.length; l++) {
      var c = this._sizes[l] = this.$cells[l].getSize();
      this.$cells[l].$config.hidden || (this._xLayout ? (!c.width && c.minWidth ? n += c.minWidth : n += c.width, a += c.maxWidth, i += c.minWidth, r = Math.max(r, c.height), s = Math.min(s, c.maxHeight), o = Math.max(o, c.minHeight)) : (!c.height && c.minHeight ? r += c.minHeight : r += c.height, s += c.maxHeight, o += c.minHeight, n = Math.max(n, c.width), a = Math.min(a, c.maxWidth), i = Math.max(i, c.minWidth)));
    }
    var d = t.prototype.getSize.call(this);
    return d.maxWidth >= 1e5 && (d.maxWidth = a), d.maxHeight >= 1e5 && (d.maxHeight = s), d.minWidth = d.minWidth != d.minWidth ? 0 : d.minWidth, d.minHeight = d.minHeight != d.minHeight ? 0 : d.minHeight, this._xLayout ? (d.minWidth += this.$config.margin * this.$cells.length || 0, d.minWidth += 2 * this.$config.padding || 0, d.minHeight += 2 * this.$config.padding || 0) : (d.minHeight += this.$config.margin * this.$cells.length || 0, d.minHeight += 2 * this.$config.padding || 0), d;
  }, e.prototype._calcFreeSpace = function(n, i, a) {
    var r = a ? i.minWidth : i.minHeight, s = i.maxWidth, o = n;
    return o ? (o > s && (o = s), o < r && (o = r), this._free -= o) : ((o = Math.floor(this._free / this._gravity * i.gravity)) > s && (o = s, this._free -= o, this._gravity -= i.gravity), o < r && (o = r, this._free -= o, this._gravity -= i.gravity)), o;
  }, e.prototype._calcSize = function(n, i, a) {
    var r = n, s = a ? i.minWidth : i.minHeight, o = a ? i.maxWidth : i.maxHeight;
    return r || (r = Math.floor(this._free / this._gravity * i.gravity)), r > o && (r = o), r < s && (r = s), r;
  }, e.prototype._configureBorders = function() {
    this.$root && this._setBorders([this._borders.left, this._borders.top, this._borders.right, this._borders.bottom], this);
    for (var n = this._xLayout ? this._borders.right : this._borders.bottom, i = this.$cells, a = i.length - 1, r = a; r >= 0; r--) if (!i[r].$config.hidden) {
      a = r;
      break;
    }
    for (r = 0; r < i.length; r++) if (!i[r].$config.hidden) {
      var s = r >= a, o = "";
      !s && i[r + 1] && i[r + 1].$config.view == "scrollbar" && (this._xLayout ? s = !0 : o = "gantt_layout_cell_border_transparent"), this._setBorders(s ? [] : [n, o], i[r]);
    }
  }, e.prototype._updateCellVisibility = function() {
    for (var n = this._visibleCells || {}, i = !this._visibleCells, a = {}, r = null, s = [], o = 0; o < this._sizes.length; o++) (r = this.$cells[o]).$config.hide_empty && s.push(r), !i && r.$config.hidden && n[r.$id] ? r._hide(!0) : r.$config.hidden || n[r.$id] || r._hide(!1), r.$config.hidden || (a[r.$id] = !0);
    for (this._visibleCells = a, o = 0; o < s.length; o++) {
      var l = (r = s[o]).$cells, c = !0;
      l.forEach(function(d) {
        d.$config.hidden || d.$config.resizer || (c = !1);
      }), r.$config.hidden = c;
    }
  }, e.prototype.setSize = function(n, i) {
    this._configureBorders(), t.prototype.setSize.call(this, n, i), i = this.$lastSize.contentY, n = this.$lastSize.contentX;
    var a, r, s = this.$config.padding || 0;
    this.$view.style.padding = s + "px", this._gravity = 0, this._free = this._xLayout ? n : i, this._free -= 2 * s, this._updateCellVisibility();
    for (var o = 0; o < this._sizes.length; o++) if (!(a = this.$cells[o]).$config.hidden) {
      var l = this.$config.margin || 0;
      a.$name != "resizer" || l || (l = -1);
      var c = a.$view, d = this._xLayout ? "marginRight" : "marginBottom";
      o !== this.$cells.length - 1 && (c.style[d] = l + "px", this._free -= l), r = this._sizes[o], this._xLayout ? r.width || (this._gravity += r.gravity) : r.height || (this._gravity += r.gravity);
    }
    for (o = 0; o < this._sizes.length; o++) if (!(a = this.$cells[o]).$config.hidden) {
      var u = (r = this._sizes[o]).width, h = r.height;
      this._xLayout ? this._calcFreeSpace(u, r, !0) : this._calcFreeSpace(h, r, !1);
    }
    for (o = 0; o < this.$cells.length; o++) if (!(a = this.$cells[o]).$config.hidden) {
      r = this._sizes[o];
      var _ = void 0, p = void 0;
      this._xLayout ? (_ = this._calcSize(r.width, r, !0), p = i - 2 * s) : (_ = n - 2 * s, p = this._calcSize(r.height, r, !1)), a.setSize(_, p);
    }
  }, e;
}(Ht), _a = function(t) {
  function e(n, i, a) {
    for (var r = t.apply(this, arguments) || this, s = 0; s < r.$cells.length; s++) r.$cells[s].$config.hidden = s !== 0;
    return r.$cell = r.$cells[0], r.$name = "viewLayout", r;
  }
  return z(e, t), e.prototype.cell = function(n) {
    var i = t.prototype.cell.call(this, n);
    return i.$view || this.$fill(null, this), i;
  }, e.prototype.moveView = function(n) {
    var i = this.$view;
    this.$cell && (this.$cell.$config.hidden = !0, i.removeChild(this.$cell.$view)), this.$cell = n, i.appendChild(n.$view);
  }, e.prototype.setSize = function(n, i) {
    Ht.prototype.setSize.call(this, n, i);
  }, e.prototype.setContentSize = function() {
    var n = this.$lastSize;
    this.$cell.setSize(n.contentX, n.contentY);
  }, e.prototype.getSize = function() {
    var n = t.prototype.getSize.call(this);
    if (this.$cell) {
      var i = this.$cell.getSize();
      if (this.$config.byMaxSize) for (var a = 0; a < this.$cells.length; a++) {
        var r = this.$cells[a].getSize();
        for (var s in i) i[s] = Math.max(i[s], r[s]);
      }
      for (var o in n) n[o] = n[o] || i[o];
      n.gravity = Math.max(n.gravity, i.gravity);
    }
    return n;
  }, e;
}(kn), ga = function(t) {
  function e(n, i, a) {
    var r = t.apply(this, arguments) || this;
    if (i.view) {
      i.id && (this.$id = st());
      var s = q(i);
      if (delete s.config, delete s.templates, this.$content = this.$factory.createView(i.view, this, s, this), !this.$content) return !1;
    }
    return r.$name = "viewCell", r;
  }
  return z(e, t), e.prototype.destructor = function() {
    this.clear(), t.prototype.destructor.call(this);
  }, e.prototype.clear = function() {
    if (this.$initialized = !1, this.$content) {
      var n = this.$content.unload || this.$content.destructor;
      n && n.call(this.$content);
    }
    t.prototype.clear.call(this);
  }, e.prototype.scrollTo = function(n, i) {
    this.$content && this.$content.scrollTo ? this.$content.scrollTo(n, i) : t.prototype.scrollTo.call(this, n, i);
  }, e.prototype._setContentSize = function(n, i) {
    var a = this._getBorderSizes();
    if (typeof n == "number") {
      var r = n + a.horizontal;
      this.$config.width = r;
    }
    if (typeof i == "number") {
      var s = i + a.vertical;
      this.$config.height = s;
    }
  }, e.prototype.setSize = function(n, i) {
    if (t.prototype.setSize.call(this, n, i), !this.$preResize && this.$content && !this.$initialized) {
      this.$initialized = !0;
      var a = this.$view.childNodes[0], r = this.$view.childNodes[1];
      r || (r = a), this.$content.init(r);
    }
  }, e.prototype.setContentSize = function() {
    !this.$preResize && this.$content && this.$initialized && this.$content.setSize(this.$lastSize.contentX, this.$lastSize.contentY);
  }, e.prototype.getContentSize = function() {
    var n = t.prototype.getContentSize.call(this);
    if (this.$content && this.$initialized) {
      var i = this.$content.getSize();
      n.width = i.contentX === void 0 ? i.width : i.contentX, n.height = i.contentY === void 0 ? i.height : i.contentY;
    }
    var a = this._getBorderSizes();
    return n.width += a.horizontal, n.height += a.vertical, n;
  }, e;
}(Ht), fa = function(t) {
  var e = ["altKey", "shiftKey", "metaKey"];
  function n(a, r, s, o) {
    var l = t.apply(this, arguments) || this;
    this.$config = P(r, { scroll: "x" }), l._scrollHorizontalHandler = R(l._scrollHorizontalHandler, l), l._scrollVerticalHandler = R(l._scrollVerticalHandler, l), l._outerScrollVerticalHandler = R(l._outerScrollVerticalHandler, l), l._outerScrollHorizontalHandler = R(l._outerScrollHorizontalHandler, l), l._mouseWheelHandler = R(l._mouseWheelHandler, l), this.$config.hidden = !0;
    var c = o.config.scroll_size;
    return o.env.isIE && (c += 1), this._isHorizontal() ? (l.$config.height = c, l.$parent.$config.height = c) : (l.$config.width = c, l.$parent.$config.width = c), this.$config.scrollPosition = 0, l.$name = "scroller", l;
  }
  function i(a, r) {
    if (r.push(a), a.$cells) for (var s = 0; s < a.$cells.length; s++) i(a.$cells[s], r);
  }
  return z(n, t), n.prototype.init = function(a) {
    a.innerHTML = this.$toHTML(), this.$view = a.firstChild, this.$view || this.init(), this._isVertical() ? this._initVertical() : this._initHorizontal(), this._initMouseWheel(), this._initLinkedViews();
  }, n.prototype.$toHTML = function() {
    return "<div class='gantt_layout_cell " + (this._isHorizontal() ? "gantt_hor_scroll" : "gantt_ver_scroll") + "'><div style='" + (this._isHorizontal() ? "width:2000px" : "height:2000px") + "'></div></div>";
  }, n.prototype._getRootParent = function() {
    for (var a = this.$parent; a && a.$parent; ) a = a.$parent;
    if (a) return a;
  }, n.prototype._eachView = function() {
    var a = [];
    return i(this._getRootParent(), a), a;
  }, n.prototype._getLinkedViews = function() {
    for (var a = this._eachView(), r = [], s = 0; s < a.length; s++) a[s].$config && (this._isVertical() && a[s].$config.scrollY == this.$id || this._isHorizontal() && a[s].$config.scrollX == this.$id) && r.push(a[s]);
    return r;
  }, n.prototype._initHorizontal = function() {
    this.$scroll_hor = this.$view, this.$domEvents.attach(this.$view, "scroll", this._scrollHorizontalHandler);
  }, n.prototype._initLinkedViews = function() {
    for (var a = this._getLinkedViews(), r = this._isVertical() ? "gantt_layout_outer_scroll gantt_layout_outer_scroll_vertical" : "gantt_layout_outer_scroll gantt_layout_outer_scroll_horizontal", s = 0; s < a.length; s++) wt(a[s].$view || a[s].getNode(), r);
  }, n.prototype._initVertical = function() {
    this.$scroll_ver = this.$view, this.$domEvents.attach(this.$view, "scroll", this._scrollVerticalHandler);
  }, n.prototype._updateLinkedViews = function() {
  }, n.prototype._initMouseWheel = function() {
    mt.isFF ? this.$domEvents.attach(this._getRootParent().$view, "wheel", this._mouseWheelHandler, { passive: !1 }) : this.$domEvents.attach(this._getRootParent().$view, "mousewheel", this._mouseWheelHandler, { passive: !1 });
  }, n.prototype.scrollHorizontally = function(a) {
    if (!this._scrolling) {
      this._scrolling = !0, this.$scroll_hor.scrollLeft = a, this.$config.codeScrollLeft = a, a = this.$scroll_hor.scrollLeft;
      for (var r = this._getLinkedViews(), s = 0; s < r.length; s++) r[s].scrollTo && r[s].scrollTo(a, void 0);
      var o = this.$config.scrollPosition;
      this.$config.scrollPosition = a, this.callEvent("onScroll", [o, a, this.$config.scroll]), this._scrolling = !1;
    }
  }, n.prototype.scrollVertically = function(a) {
    if (!this._scrolling) {
      this._scrolling = !0, this.$scroll_ver.scrollTop = a, a = this.$scroll_ver.scrollTop;
      for (var r = this._getLinkedViews(), s = 0; s < r.length; s++) r[s].scrollTo && r[s].scrollTo(void 0, a);
      var o = this.$config.scrollPosition;
      this.$config.scrollPosition = a, this.callEvent("onScroll", [o, a, this.$config.scroll]), this._scrolling = !1;
    }
  }, n.prototype._isVertical = function() {
    return this.$config.scroll == "y";
  }, n.prototype._isHorizontal = function() {
    return this.$config.scroll == "x";
  }, n.prototype._scrollHorizontalHandler = function(a) {
    if (!this._isVertical() && !this._scrolling) {
      if (/* @__PURE__ */ new Date() - (this._wheel_time || 0) < 100) return !0;
      var r = this.$scroll_hor.scrollLeft;
      this.scrollHorizontally(r), this._oldLeft = this.$scroll_hor.scrollLeft;
    }
  }, n.prototype._outerScrollHorizontalHandler = function(a) {
    this._isVertical();
  }, n.prototype.show = function() {
    this.$parent.show();
  }, n.prototype.hide = function() {
    this.$parent.hide();
  }, n.prototype._getScrollSize = function() {
    for (var a, r = 0, s = 0, o = this._isHorizontal(), l = this._getLinkedViews(), c = o ? "scrollWidth" : "scrollHeight", d = o ? "contentX" : "contentY", u = o ? "x" : "y", h = this._getScrollOffset(), _ = 0; _ < l.length; _++) if ((a = l[_]) && a.$content && a.$content.getSize && !a.$config.hidden) {
      var p, y = a.$content.getSize();
      if (p = y.hasOwnProperty(c) ? y[c] : y[d], h) y[d] > y[u] && y[d] > r && p > y[u] - h + 2 && (r = p + (o ? 0 : 2), s = y[u]);
      else {
        var k = Math.max(y[d] - p, 0);
        (p += k) > Math.max(y[u] - k, 0) && p > r && (r = p, s = y[u]);
      }
    }
    return { outerScroll: s, innerScroll: r };
  }, n.prototype.scroll = function(a) {
    this._isHorizontal() ? this.scrollHorizontally(a) : this.scrollVertically(a);
  }, n.prototype.getScrollState = function() {
    return { visible: this.isVisible(), direction: this.$config.scroll, size: this.$config.outerSize, scrollSize: this.$config.scrollSize || 0, position: this.$config.scrollPosition || 0 };
  }, n.prototype.setSize = function(a, r) {
    t.prototype.setSize.apply(this, arguments);
    var s = this._getScrollSize(), o = (this._isVertical() ? r : a) - this._getScrollOffset() + (this._isHorizontal() ? 1 : 0);
    s.innerScroll && o > s.outerScroll && (s.innerScroll += o - s.outerScroll), this.$config.scrollSize = s.innerScroll, this.$config.width = a, this.$config.height = r, this._setScrollSize(s.innerScroll);
  }, n.prototype.isVisible = function() {
    return !(!this.$parent || !this.$parent.$view.parentNode);
  }, n.prototype.shouldShow = function() {
    var a = this._getScrollSize();
    return !(!a.innerScroll && this.$parent && this.$parent.$view.parentNode) && !(!a.innerScroll || this.$parent && this.$parent.$view.parentNode);
  }, n.prototype.shouldHide = function() {
    return !(this._getScrollSize().innerScroll || !this.$parent || !this.$parent.$view.parentNode);
  }, n.prototype.toggleVisibility = function() {
    this.shouldHide() ? this.hide() : this.shouldShow() && this.show();
  }, n.prototype._getScaleOffset = function(a) {
    var r = 0;
    return !a || a.$config.view != "timeline" && a.$config.view != "grid" || (r = a.$content.$getConfig().scale_height), r;
  }, n.prototype._getScrollOffset = function() {
    var a = 0;
    if (this._isVertical()) {
      var r = this.$parent.$parent;
      a = Math.max(this._getScaleOffset(r.getPrevSibling(this.$parent.$id)), this._getScaleOffset(r.getNextSibling(this.$parent.$id)));
    } else for (var s = this._getLinkedViews(), o = 0; o < s.length; o++) {
      var l = s[o].$parent.$cells, c = l[l.length - 1];
      if (c && c.$config.view == "scrollbar" && c.$config.hidden === !1) {
        a = c.$config.width;
        break;
      }
    }
    return a || 0;
  }, n.prototype._setScrollSize = function(a) {
    var r = this._isHorizontal() ? "width" : "height", s = this._isHorizontal() ? this.$scroll_hor : this.$scroll_ver, o = this._getScrollOffset(), l = s.firstChild;
    o ? this._isVertical() ? (this.$config.outerSize = this.$config.height - o + 3, s.style.height = this.$config.outerSize + "px", s.style.top = o - 1 + "px", wt(s, this.$parent._borders.top), wt(s.parentNode, "gantt_task_vscroll")) : (this.$config.outerSize = this.$config.width - o + 1, s.style.width = this.$config.outerSize + "px") : (s.style.top = "auto", Gt(s, this.$parent._borders.top), Gt(s.parentNode, "gantt_task_vscroll"), this.$config.outerSize = this.$config.height), l.style[r] = a + "px";
  }, n.prototype._scrollVerticalHandler = function(a) {
    if (!this._scrollHorizontalHandler() && !this._scrolling) {
      var r = this.$scroll_ver.scrollTop;
      r != this._oldTop && (this.scrollVertically(r), this._oldTop = this.$scroll_ver.scrollTop);
    }
  }, n.prototype._outerScrollVerticalHandler = function(a) {
    this._scrollHorizontalHandler();
  }, n.prototype._checkWheelTarget = function(a) {
    for (var r = this._getLinkedViews().concat(this), s = 0; s < r.length; s++)
      if (Y(a, r[s].$view)) return !0;
    return !1;
  }, n.prototype._mouseWheelHandler = function(a) {
    var r = a.target || a.srcElement;
    if (this._checkWheelTarget(r)) {
      this._wheel_time = /* @__PURE__ */ new Date();
      var s = {}, o = { x: 1, y: 1 }, l = this.$gantt.config.wheel_scroll_sensitivity;
      typeof l == "number" && l ? o = { x: l, y: l } : {}.toString.apply(l) == "[object Object]" && (o = { x: l.x, y: l.y });
      var c = mt.isFF, d = c ? a.deltaX : a.wheelDeltaX, u = c ? a.deltaY : a.wheelDelta, h = -20;
      if (c) {
        const v = parseInt(navigator.userAgent.split("Firefox/")[1]);
        h = v <= 87 ? a.deltaMode !== 0 ? -40 : -10 : v <= 90 ? -3 : v <= 96 ? -1.5 : -1;
      }
      var _ = c ? d * h * o.x : 2 * d * o.x, p = c ? u * h * o.y : u * o.y, y = this.$gantt.config.horizontal_scroll_key;
      if (y !== !1 && e.indexOf(y) >= 0 && (!a[y] || a.deltaX || a.wheelDeltaX || (_ = 2 * p, p = 0)), _ && Math.abs(_) > Math.abs(p)) {
        if (this._isVertical()) return;
        if (s.x || !this.$scroll_hor || !this.$scroll_hor.offsetWidth) return !0;
        var k = _ / -40, b = this._oldLeft, g = b + 30 * k;
        if (this.scrollHorizontally(g), this.$scroll_hor.scrollLeft = g, b == this.$scroll_hor.scrollLeft) return !0;
        this._oldLeft = this.$scroll_hor.scrollLeft;
      } else {
        if (this._isHorizontal()) return;
        if (s.y || !this.$scroll_ver || !this.$scroll_ver.offsetHeight) return !0;
        k = p / -40, p === void 0 && (k = a.detail);
        var m = this._oldTop, f = this.$scroll_ver.scrollTop + 30 * k;
        if (this.scrollVertically(f), this.$scroll_ver.scrollTop = f, m == this.$scroll_ver.scrollTop) return !0;
        this._oldTop = this.$scroll_ver.scrollTop;
      }
      return a.preventDefault && a.preventDefault(), a.cancelBubble = !0, !1;
    }
  }, n;
}(Ht);
function yn(t) {
  var e = {}, n = {}, i = null, a = -1, r = null, s = /* @__PURE__ */ function(o) {
    var l = -1, c = -1;
    return { resetCache: function() {
      l = -1, c = -1;
    }, _getRowHeight: function() {
      return l === -1 && (l = o.$getConfig().row_height), l;
    }, _refreshState: function() {
      this.resetCache(), c = !0;
      var d = o.$config.rowStore;
      if (d) for (var u = this._getRowHeight(), h = 0; h < d.fullOrder.length; h++) {
        var _ = d.getItem(d.fullOrder[h]);
        if (_ && _.row_height && _.row_height !== u) {
          c = !1;
          break;
        }
      }
    }, canUseSimpleCalculation: function() {
      return c === -1 && this._refreshState(), c;
    }, getRowTop: function(d) {
      return o.$config.rowStore ? d * this._getRowHeight() : 0;
    }, getItemHeight: function(d) {
      return this._getRowHeight();
    }, getTotalHeight: function() {
      return o.$config.rowStore ? o.$config.rowStore.countVisible() * this._getRowHeight() : 0;
    }, getItemIndexByTopPosition: function(d) {
      return o.$config.rowStore ? Math.floor(d / this._getRowHeight()) : 0;
    } };
  }(t);
  return { _resetTopPositionHeight: function() {
    e = {}, n = {}, s.resetCache();
  }, _resetHeight: function() {
    var o = this.$config.rowStore, l = this.getCacheStateTotalHeight(o);
    r ? this.shouldClearHeightCache(r, l) && (r = l, i = null) : r = l, a = -1, s.resetCache();
  }, getRowTop: function(o) {
    if (s.canUseSimpleCalculation()) return s.getRowTop(o);
    var l = this.$config.rowStore;
    if (!l) return 0;
    if (n[o] !== void 0) return n[o];
    for (var c = l.getIndexRange(), d = 0, u = 0, h = 0; h < c.length; h++) n[h] = d, d += this.getItemHeight(c[h].id), h < o && (u = d);
    return u;
  }, getItemTop: function(o) {
    if (this.$config.rowStore) {
      if (e[o] !== void 0) return e[o];
      var l = this.$config.rowStore;
      if (!l) return 0;
      var c = l.getIndexById(o);
      if (c === -1 && l.getParent && l.exists(o)) {
        var d = l.getParent(o);
        if (l.exists(d)) {
          var u = l.getItem(d);
          if (this.$gantt.isSplitTask(u)) return this.getItemTop(d);
        }
      }
      return e[o] = this.getRowTop(c), e[o];
    }
    return 0;
  }, getItemHeight: function(o) {
    if (s.canUseSimpleCalculation()) return s.getItemHeight(o);
    if (!i && this.$config.rowStore && this._fillHeightCache(this.$config.rowStore), i[o] !== void 0) return i[o];
    var l = this.$getConfig().row_height;
    if (this.$config.rowStore) {
      var c = this.$config.rowStore;
      if (!c) return l;
      var d = c.getItem(o);
      return i[o] = d && d.row_height || l;
    }
    return l;
  }, _fillHeightCache: function(o) {
    if (o) {
      i = {};
      var l = this.$getConfig().row_height;
      o.eachItem(function(c) {
        return i[c.id] = c && c.row_height || l;
      });
    }
  }, getCacheStateTotalHeight: function(o) {
    var l = this.$getConfig().row_height, c = {}, d = [], u = 0;
    return o && o.eachItem(function(h) {
      d.push(h), c[h.id] = h.row_height, u += h.row_height || l;
    }), { globalHeight: l, items: d, count: d.length, sumHeight: u };
  }, shouldClearHeightCache: function(o, l) {
    if (o.count != l.count || o.globalHeight != l.globalHeight || o.sumHeight != l.sumHeight) return !0;
    for (var c in o.items) {
      var d = l.items[c];
      if (d !== void 0 && d != o.items[c]) return !0;
    }
    return !1;
  }, getTotalHeight: function() {
    if (s.canUseSimpleCalculation()) return s.getTotalHeight();
    if (a != -1) return a;
    if (this.$config.rowStore) {
      var o = this.$config.rowStore;
      this._fillHeightCache(o);
      var l = this.getItemHeight.bind(this), c = o.getVisibleItems(), d = 0;
      return c.forEach(function(u) {
        d += l(u.id);
      }), a = d, d;
    }
    return 0;
  }, getItemIndexByTopPosition: function(o) {
    if (this.$config.rowStore) {
      if (s.canUseSimpleCalculation()) return s.getItemIndexByTopPosition(o);
      for (var l = this.$config.rowStore, c = 0; c < l.countVisible(); c++) {
        var d = this.getRowTop(c), u = this.getRowTop(c + 1);
        if (!u) {
          var h = l.getIdByIndex(c);
          u = d + this.getItemHeight(h);
        }
        if (o >= d && o < u) return c;
      }
      return l.countVisible() + 2;
    }
    return 0;
  } };
}
const pa = function() {
  return { render: function() {
  }, destroy: function() {
  } };
};
var Ut = function(t, e, n, i) {
  this.$config = P({}, e || {}), this.$scaleHelper = new pe(i), this.$gantt = i, this._posFromDateCache = {}, this._timelineDragScroll = null, P(this, yn(this)), ot(this);
};
Ut.prototype = { init: function(t) {
  t.innerHTML += "<div class='gantt_task' style='width:inherit;height:inherit;'></div>", this.$task = t.childNodes[0], this.$task.innerHTML = "<div class='gantt_task_scale'></div><div class='gantt_data_area'></div>", this.$task_scale = this.$task.childNodes[0], this.$task_data = this.$task.childNodes[1], this.$task_data.innerHTML = "<div class='gantt_task_bg'></div><div class='gantt_task_baselines'></div><div class='gantt_links_area'></div><div class='gantt_bars_area'></div><div class='gantt_task_constraints'></div><div class='gantt_task_deadlines'></div>", this.$task_bg = this.$task_data.childNodes[0], this.$task_baselines = this.$task_data.childNodes[1], this.$task_links = this.$task_data.childNodes[2], this.$task_bars = this.$task_data.childNodes[3], this.$task_constraints = this.$task_data.childNodes[4], this.$task_deadlines = this.$task_data.childNodes[5], this._tasks = { col_width: 0, width: [], full_width: 0, trace_x: [], rendered: {} };
  var e = this.$getConfig(), n = e[this.$config.bind + "_attribute"], i = e[this.$config.bindLinks + "_attribute"];
  !n && this.$config.bind && (n = "data-" + this.$config.bind + "-id"), !i && this.$config.bindLinks && (i = "data-" + this.$config.bindLinks + "-id"), this.$config.item_attribute = n || null, this.$config.link_attribute = i || null;
  var a = this._createLayerConfig();
  this.$config.layers || (this.$config.layers = a.tasks), this.$config.linkLayers || (this.$config.linkLayers = a.links), this._attachLayers(this.$gantt), this.callEvent("onReady", []), this.$gantt.ext.dragTimeline && (this._timelineDragScroll = this.$gantt.ext.dragTimeline.create(), this._timelineDragScroll.attach(this));
}, setSize: function(t, e) {
  var n = this.$getConfig();
  if (1 * t === t && (this.$config.width = t), 1 * e === e) {
    this.$config.height = e;
    var i = Math.max(this.$config.height - n.scale_height);
    this.$task_data.style.height = i + "px";
  }
  this.refresh(), this.$task_bg.style.backgroundImage = "", n.smart_rendering && this.$config.rowStore ? this.$task_bg.style.height = this.getTotalHeight() + "px" : this.$task_bg.style.height = "";
  for (var a = this._tasks, r = this.$task_data.childNodes, s = 0, o = r.length; s < o; s++) {
    var l = r[s];
    l.hasAttribute("data-layer") && l.style && (l.style.width = a.full_width + "px");
  }
}, isVisible: function() {
  return this.$parent && this.$parent.$config ? !this.$parent.$config.hidden : this.$task.offsetWidth;
}, getSize: function() {
  var t = this.$getConfig(), e = this.$config.rowStore ? this.getTotalHeight() : 0, n = this.isVisible() ? this._tasks.full_width : 0;
  return { x: this.isVisible() ? this.$config.width : 0, y: this.isVisible() ? this.$config.height : 0, contentX: this.isVisible() ? n : 0, contentY: this.isVisible() ? t.scale_height + e : 0, scrollHeight: this.isVisible() ? e : 0, scrollWidth: this.isVisible() ? n : 0 };
}, scrollTo: function(t, e) {
  if (this.isVisible()) {
    var n = !1;
    this.$config.scrollTop = this.$config.scrollTop || 0, this.$config.scrollLeft = this.$config.scrollLeft || 0, 1 * e === e && (this.$config.scrollTop = e, this.$task_data.scrollTop = this.$config.scrollTop, n = !0), 1 * t === t && (this.$task.scrollLeft = t, this.$config.scrollLeft = this.$task.scrollLeft, this._refreshScales(), n = !0), n && this.callEvent("onScroll", [this.$config.scrollLeft, this.$config.scrollTop]);
  }
}, _refreshScales: function() {
  if (this.isVisible() && this.$getConfig().smart_scales) {
    var t = this.getViewPort(), e = this._scales;
    this.$task_scale.innerHTML = this._getScaleChunkHtml(e, t.x, t.x_end);
  }
}, getViewPort: function() {
  var t = this.$config.scrollLeft || 0, e = this.$config.scrollTop || 0, n = this.$config.height || 0, i = this.$config.width || 0;
  return { y: e, y_end: e + n, x: t, x_end: t + i, height: n, width: i };
}, _createLayerConfig: function() {
  var t = this, e = function() {
    return t.isVisible();
  };
  this.$gantt;
  var n = [{ expose: !0, renderer: this.$gantt.$ui.layers.taskBar(), container: this.$task_bars, filter: [e, function(i, a) {
    return !a.hide_bar;
  }] }];
  return n.push({ renderer: this.$gantt.$ui.layers.taskBg(), container: this.$task_bg, filter: [e] }), { tasks: n, links: [{ expose: !0, renderer: this.$gantt.$ui.layers.link(), container: this.$task_links, filter: [e] }] };
}, _attachLayers: function(t) {
  this._taskLayers = [], this._linkLayers = [];
  var e = this, n = this.$gantt.$services.getService("layers");
  if (this.$config.bind) {
    this._bindStore();
    var i = n.getDataRender(this.$config.bind);
    i || (i = n.createDataRender({ name: this.$config.bind, defaultContainer: function() {
      return e.$task_data;
    } })), i.container = function() {
      return e.$task_data;
    };
    for (var a = this.$config.layers, r = 0; a && r < a.length; r++) {
      typeof (c = a[r]) == "string" && (c = this.$gantt.$ui.layers[c]()), (typeof c == "function" || c && c.render && c.update) && (c = { renderer: c }), c.view = this;
      var s = i.addLayer(c);
      this._taskLayers.push(s), c.expose && (this._taskRenderer = i.getLayer(s));
    }
    this._initStaticBackgroundRender();
  }
  if (this.$config.bindLinks) {
    e.$config.linkStore = e.$gantt.getDatastore(e.$config.bindLinks);
    var o = n.getDataRender(this.$config.bindLinks);
    o || (o = n.createDataRender({ name: this.$config.bindLinks, defaultContainer: function() {
      return e.$task_data;
    } }));
    var l = this.$config.linkLayers;
    for (r = 0; l && r < l.length; r++) {
      var c;
      typeof c == "string" && (c = this.$gantt.$ui.layers[c]()), (c = l[r]).view = this;
      var d = o.addLayer(c);
      this._taskLayers.push(d), l[r].expose && (this._linkRenderer = o.getLayer(d));
    }
  }
}, _initStaticBackgroundRender: function() {
  var t = this, e = pa(), n = t.$config.rowStore;
  n && (this._staticBgHandler = n.attachEvent("onStoreUpdated", function(i, a, r) {
    if (i === null && t.isVisible()) {
      var s = t.$getConfig();
      if (s.static_background || s.timeline_placeholder) {
        var o = t.$gantt.getDatastore(t.$config.bind), l = t.$task_bg_static;
        if (l || ((l = document.createElement("div")).className = "gantt_task_bg", t.$task_bg_static = l, t.$task_bg.nextSibling ? t.$task_data.insertBefore(l, t.$task_bg.nextSibling) : t.$task_data.appendChild(l)), o) {
          var c = t.getTotalHeight();
          s.timeline_placeholder && (c = s.timeline_placeholder.height || t.$task_data.offsetHeight || 99999), e.render(l, s, t.getScale(), c, t.getItemHeight(a ? a.id : null));
        }
      } else s.static_background && t.$task_bg_static && t.$task_bg_static.parentNode && t.$task_bg_static.parentNode.removeChild(t.$task_bg_static);
    }
  }), this.attachEvent("onDestroy", function() {
  }), this._initStaticBackgroundRender = function() {
  });
}, _clearLayers: function(t) {
  var e = this.$gantt.$services.getService("layers"), n = e.getDataRender(this.$config.bind), i = e.getDataRender(this.$config.bindLinks);
  if (this._taskLayers) for (var a = 0; a < this._taskLayers.length; a++) n.removeLayer(this._taskLayers[a]);
  if (this._linkLayers) for (a = 0; a < this._linkLayers.length; a++) i.removeLayer(this._linkLayers[a]);
  this._linkLayers = [], this._taskLayers = [];
}, _render_tasks_scales: function() {
  var t = this.$getConfig(), e = "", n = 0, i = 0, a = this.$gantt.getState();
  if (this.isVisible()) {
    var r = this.$scaleHelper, s = this._getScales();
    i = t.scale_height;
    var o = this.$config.width;
    t.autosize != "x" && t.autosize != "xy" || (o = Math.max(t.autosize_min_width, 0));
    var l = r.prepareConfigs(s, t.min_column_width, o, i - 1, a.min_date, a.max_date, t.rtl), c = this._tasks = l[l.length - 1];
    this._scales = l, this._posFromDateCache = {}, e = this._getScaleChunkHtml(l, 0, this.$config.width), n = c.full_width + "px", i += "px";
  }
  this.$task_scale.style.height = i, this.$task_data.style.width = this.$task_scale.style.width = n, this.$task_scale.innerHTML = e;
}, _getScaleChunkHtml: function(t, e, n) {
  for (var i = [], a = this.$gantt.templates.scale_row_class, r = 0; r < t.length; r++) {
    var s = "gantt_scale_line", o = a(t[r]);
    o && (s += " " + o), i.push('<div class="' + s + '" style="height:' + t[r].height + "px;position:relative;line-height:" + t[r].height + 'px">' + this._prepareScaleHtml(t[r], e, n, r) + "</div>");
  }
  return i.join("");
}, _prepareScaleHtml: function(t, e, n, i) {
  var a = this.$getConfig(), r = this.$gantt.templates, s = [], o = null, l = null, c = t.format || t.template || t.date;
  typeof c == "string" && (c = this.$gantt.date.date_to_str(c));
  var d = 0, u = t.count;
  !a.smart_scales || isNaN(e) || isNaN(n) || (d = At(t.left, e), u = At(t.left, n) + 1), l = t.css || function() {
  }, !t.css && a.inherit_scale_class && (l = r.scale_cell_class);
  for (var h = d; h < u && t.trace_x[h]; h++) {
    o = new Date(t.trace_x[h]);
    var _ = c.call(this, o), p = t.width[h];
    t.height;
    var y = t.left[h], k = "", b = "", g = "";
    if (p) {
      k = "width:" + p + "px;" + (a.smart_scales ? "position:absolute;left:" + y + "px" : "");
      const f = this.getViewPort(), v = (a.scales[i] || {}).sticky;
      let x = "";
      const $ = 70;
      if (v !== !1 && p > $ || v === !0) {
        if (y < f.x && y + p / 2 - $ / 2 < f.x) x = ` style='position:absolute;left: ${f.x - y + 10}px;' `;
        else if (y + p / 2 + $ / 2 > f.x_end && p > $) {
          let w = f.x_end - y - 10, S = "-100%";
          w < $ && (w = $, S = `-${w}px`), x = ` style='position:absolute;left: ${w}px;transform: translate(${S},0);' `;
        }
      }
      g = "gantt_scale_cell" + (h == t.count - 1 ? " gantt_last_cell" : ""), (b = l.call(this, o)) && (g += " " + b);
      var m = `<div class='${g}' ${this.$gantt._waiAria.getTimelineCellAttr(_)} style='${k}'><span ${x}>${_}</span></div>`;
      s.push(m);
    }
  }
  return s.join("");
}, dateFromPos: function(t) {
  var e = this._tasks;
  if (t < 0 || t > e.full_width || !e.full_width) return null;
  var n = At(this._tasks.left, t), i = this._tasks.left[n], a = e.width[n] || e.col_width, r = 0;
  a && (r = (t - i) / a, e.rtl && (r = 1 - r));
  var s = 0;
  return r && (s = this._getColumnDuration(e, e.trace_x[n])), new Date(e.trace_x[n].valueOf() + Math.round(r * s));
}, posFromDate: function(t) {
  if (!this.isVisible() || !t) return 0;
  var e = String(t.valueOf());
  if (this._posFromDateCache[e] !== void 0) return this._posFromDateCache[e];
  var n = this.columnIndexByDate(t);
  this.$gantt.assert(n >= 0, "Invalid day index");
  var i = Math.floor(n), a = n % 1, r = this._tasks.left[Math.min(i, this._tasks.width.length - 1)];
  i == this._tasks.width.length && (r += this._tasks.width[this._tasks.width.length - 1]), a && (i < this._tasks.width.length ? r += this._tasks.width[i] * (a % 1) : r += 1);
  var s = Math.round(r);
  return this._posFromDateCache[e] = s, Math.round(s);
}, _getNextVisibleColumn: function(t, e, n) {
  for (var i = +e[t], a = t; n[i]; ) i = +e[++a];
  return a;
}, _getPrevVisibleColumn: function(t, e, n) {
  for (var i = +e[t], a = t; n[i]; ) i = +e[--a];
  return a;
}, _getClosestVisibleColumn: function(t, e, n) {
  var i = this._getNextVisibleColumn(t, e, n);
  return e[i] || (i = this._getPrevVisibleColumn(t, e, n)), i;
}, columnIndexByDate: function(t) {
  var e = new Date(t).valueOf(), n = this._tasks.trace_x_ascending, i = this._tasks.ignore_x, a = this.$gantt.getState();
  if (e <= a.min_date) return this._tasks.rtl ? n.length : 0;
  if (e >= a.max_date) return this._tasks.rtl ? 0 : n.length;
  var r = At(n, e), s = this._getClosestVisibleColumn(r, n, i), o = n[s], l = this._tasks.trace_index_transition;
  if (!o) return l ? l[0] : 0;
  var c = (t - n[s]) / this._getColumnDuration(this._tasks, n[s]);
  return l ? l[s] + (1 - c) : s + c;
}, getItemPosition: function(t, e, n) {
  var i, a, r;
  let s = e || t.start_date || t.$auto_start_date, o = n || t.end_date || t.$auto_end_date;
  return this._tasks.rtl ? (a = this.posFromDate(s), i = this.posFromDate(o)) : (i = this.posFromDate(s), a = this.posFromDate(o)), r = Math.max(a - i, 0), { left: i, top: this.getItemTop(t.id), height: this.getBarHeight(t.id), width: r, rowHeight: this.getItemHeight(t.id) };
}, getBarHeight: function(t, e) {
  var n = this.$getConfig(), i = this.$config.rowStore.getItem(t), a = i.task_height || i.bar_height || n.bar_height || n.task_height, r = this.getItemHeight(t);
  return a == "full" && (a = r - (n.bar_height_padding || 3)), a = Math.min(a, r), e && (a = Math.round(a / Math.sqrt(2))), Math.max(a, 0);
}, getScale: function() {
  return this._tasks;
}, _getScales: function() {
  var t = this.$getConfig(), e = this.$scaleHelper, n = [e.primaryScale(t)].concat(e.getSubScales(t));
  return e.sortScales(n), n;
}, _getColumnDuration: function(t, e) {
  return this.$gantt.date.add(e, t.step, t.unit) - e;
}, _bindStore: function() {
  if (this.$config.bind) {
    var t = this.$gantt.getDatastore(this.$config.bind);
    if (this.$config.rowStore = t, t && !t._timelineCacheAttached) {
      var e = this;
      t._timelineCacheAttached = t.attachEvent("onBeforeFilter", function() {
        e._resetTopPositionHeight();
      });
    }
  }
}, _unbindStore: function() {
  if (this.$config.bind) {
    var t = this.$gantt.getDatastore(this.$config.bind);
    t && t._timelineCacheAttached && (t.detachEvent(t._timelineCacheAttached), t._timelineCacheAttached = !1);
  }
}, refresh: function() {
  this._bindStore(), this.$config.bindLinks && (this.$config.linkStore = this.$gantt.getDatastore(this.$config.bindLinks)), this._resetTopPositionHeight(), this._resetHeight(), this._initStaticBackgroundRender(), this._render_tasks_scales();
}, destructor: function() {
  var t = this.$gantt;
  this._clearLayers(t), this._unbindStore(), this.$task = null, this.$task_scale = null, this.$task_data = null, this.$task_bg = null, this.$task_links = null, this.$task_bars = null, this.$gantt = null, this.$config.rowStore && (this.$config.rowStore.detachEvent(this._staticBgHandler), this.$config.rowStore = null), this.$config.linkStore && (this.$config.linkStore = null), this._timelineDragScroll && (this._timelineDragScroll.destructor(), this._timelineDragScroll = null), this.callEvent("onDestroy", []), this.detachAllEvents();
} };
class ma {
  constructor(e) {
    this._scrollOrder = 0;
    const { gantt: n, grid: i, dnd: a, getCurrentX: r } = e;
    this.$gantt = n, this.$grid = i, this._dnd = a, this.getCurrentX = r, this._scrollView = this.$gantt.$ui.getView(this.$grid.$config.scrollX), this.attachEvents();
  }
  attachEvents() {
    this.isScrollable() && (this._dnd.attachEvent("onDragMove", (e, n) => {
      const i = this.$grid.$grid.getBoundingClientRect(), a = i.right, r = i.left, s = this.getCurrentX(n.clientX);
      return s >= a - 20 && (this.autoscrollRight(), this.autoscrollStart()), s <= r + 20 && (this.autoscrollLeft(), this.autoscrollStart()), s < a - 20 && s > r + 20 && this.autoscrollStop(), !0;
    }), this._dnd.attachEvent("onDragEnd", () => {
      this.autoscrollStop();
    }));
  }
  autoscrollStart() {
    if (this._scrollOrder === 0) return;
    const e = 10 * this._scrollOrder, n = this._scrollView.getScrollState();
    this._scrollView.scrollTo(n.position + e), setTimeout(() => {
      this.autoscrollStart();
    }, 50);
  }
  autoscrollRight() {
    this._scrollOrder = 1;
  }
  autoscrollLeft() {
    this._scrollOrder = -1;
  }
  autoscrollStop() {
    this._scrollOrder = 0;
  }
  getCorrection() {
    return this.isScrollable() ? this._scrollView.getScrollState().position : 0;
  }
  isScrollable() {
    return !!this.$grid.$config.scrollable;
  }
}
const Ve = "data-column-id";
class va {
  constructor(e, n) {
    this._targetMarker = null, this.calculateCurrentPosition = (i) => {
      const a = this.$grid.$grid.getBoundingClientRect(), r = a.right, s = a.left;
      let o = i;
      return o > r && (o = r), o < s && (o = s), o;
    }, this.$gantt = e, this.$grid = n;
  }
  init() {
    const e = this.$gantt.$services.getService("dnd");
    this._dnd = new e(this.$grid.$grid_scale, { updates_per_second: 60 }), this._scrollableGrid = new ma({ gantt: this.$gantt, grid: this.$grid, dnd: this._dnd, getCurrentX: this.calculateCurrentPosition }), this.attachEvents();
  }
  attachEvents() {
    this._dnd.attachEvent("onBeforeDragStart", (e, n) => {
      if (this._draggedCell = this.$gantt.utils.dom.closest(n.target, ".gantt_grid_head_cell"), !this._draggedCell) return;
      const i = this.$grid.$getConfig().columns, a = this._draggedCell.getAttribute(Ve);
      let r, s;
      return i.map(function(o, l) {
        o.name === a && (r = o, s = l);
      }), this.$grid.callEvent("onBeforeColumnDragStart", [{ draggedColumn: r, draggedIndex: s }]) !== !1 && !(!this._draggedCell || !r) && (this._gridConfig = this.$grid.$getConfig(), this._originAutoscroll = this.$gantt.config.autoscroll, this.$gantt.config.autoscroll = !1, !0);
    }), this._dnd.attachEvent("onAfterDragStart", (e, n) => {
      this._draggedCell && (this._dnd.config.column = this._draggedCell.getAttribute(Ve), this._dnd.config.marker.innerHTML = this._draggedCell.outerHTML, this._dnd.config.marker.classList.add("gantt_column_drag_marker"), this._dnd.config.marker.style.height = this._gridConfig.scale_height + "px", this._dnd.config.marker.style.lineHeight = this._gridConfig.scale_height + "px", this._draggedCell.classList.add("gantt_grid_head_cell_dragged"));
    }), this._dnd.attachEvent("onDragMove", (e, n) => {
      if (!this._draggedCell) return;
      this._dragX = n.clientX;
      const i = this.calculateCurrentPosition(n.clientX), a = this.findColumnsIndexes();
      return this.setMarkerPosition(i), this.drawTargetMarker(a), !0;
    }), this._dnd.attachEvent("onDragEnd", () => {
      if (!this._draggedCell) return;
      const e = this.findColumnsIndexes(), n = e.targetIndex, i = e.draggedIndex, a = this.$grid.$getConfig().columns, r = a[i], s = a[n];
      if (this.$grid.callEvent("onColumnDragMove", [{ draggedColumn: r, targetColumn: s, draggedIndex: i, targetIndex: n }]) === !1) return this.cleanTargetMarker(), void this.$gantt.render();
      this.$gantt.config.autoscroll = this._originAutoscroll, this._draggedCell.classList.remove("gantt_grid_head_cell_dragged"), this.cleanTargetMarker(), this.reorderColumns();
    });
  }
  reorderColumns() {
    const { targetIndex: e, draggedIndex: n } = this.findColumnsIndexes(), i = this.$grid.$getConfig().columns, a = i[n], r = i[e];
    this.$grid.callEvent("onBeforeColumnReorder", [{ draggedColumn: a, targetColumn: r, draggedIndex: n, targetIndex: e }]) !== !1 && e !== n && (i.splice(n, 1), i.splice(e, 0, a), this.$gantt.render(), this.$grid.callEvent("onAfterColumnReorder", [{ draggedColumn: a, targetColumn: r, draggedIndex: n, targetIndex: e }]));
  }
  findColumnsIndexes() {
    const e = this._dnd.config.column, n = this.$grid.$getConfig().columns;
    let i, a, r, s;
    const o = { startX: 0, endX: 0 };
    let l, c = 0, d = n.length - 1, u = (p, y) => p <= y, h = (p) => ++p;
    this.$gantt.config.rtl && (c = n.length - 1, d = 0, u = (p, y) => p >= y, h = (p) => --p);
    const _ = this._dragX - this.$grid.$grid.getBoundingClientRect().left + this._scrollableGrid.getCorrection();
    for (let p = c; u(p, d) && (i === void 0 || a === void 0); p = h(p)) n[p].hide || (o.startX = o.endX, o.endX += n[p].width, _ >= o.startX && (_ <= o.endX || !u(h(p), d)) && (i = p, r = o.startX, s = o.endX, l = (_ - o.startX) / (o.endX - o.startX)), e === n[p].name && (a = p));
    return { targetIndex: i, draggedIndex: a, xBefore: r, xAfter: s, columnRelativePos: l };
  }
  setMarkerPosition(e, n = 10) {
    const { marker: i } = this._dnd.config, a = this._dnd._obj.getBoundingClientRect();
    i.style.top = `${a.y + n}px`, i.style.left = `${e}px`;
  }
  drawTargetMarker({ targetIndex: e, draggedIndex: n, xBefore: i, xAfter: a, columnRelativePos: r }) {
    let s;
    this._targetMarker || (this._targetMarker = document.createElement("div"), wt(this._targetMarker, "gantt_grid_target_marker"), this._targetMarker.style.display = "none", this._targetMarker.style.height = `${this._gridConfig.scale_height}px`), this._targetMarker.parentNode || this.$grid.$grid_scale.appendChild(this._targetMarker), s = e > n ? a : e < n ? i : r > 0.5 ? a : i, this._targetMarker.style.left = `${s}px`, this._targetMarker.style.display = "block";
  }
  cleanTargetMarker() {
    this._targetMarker && this._targetMarker.parentNode && this.$grid.$grid_scale.removeChild(this._targetMarker), this._targetMarker = null;
  }
}
function Te(t) {
  var e = [];
  return { delegate: function(n, i, a, r) {
    e.push([n, i, a, r]), t.$services.getService("mouseEvents").delegate(n, i, a, r);
  }, destructor: function() {
    for (var n = t.$services.getService("mouseEvents"), i = 0; i < e.length; i++) {
      var a = e[i];
      n.detach(a[0], a[1], a[2], a[3]);
    }
    e = [];
  } };
}
var xe = function(t, e, n, i) {
  this.$config = P({}, e || {}), this.$gantt = i, this.$parent = t, ot(this), this.$state = {}, P(this, yn(this));
};
xe.prototype = { init: function(t) {
  var e = this.$gantt, n = e._waiAria.gridAttrString(), i = e._waiAria.gridDataAttrString(), a = this.$getConfig(), r = a.reorder_grid_columns || !1;
  this.$config.reorder_grid_columns !== void 0 && (r = this.$config.reorder_grid_columns), t.innerHTML = "<div class='gantt_grid' style='height:inherit;width:inherit;' " + n + "></div>", this.$grid = t.childNodes[0], this.$grid.innerHTML = "<div class='gantt_grid_scale' " + e._waiAria.gridScaleRowAttrString() + "></div><div class='gantt_grid_data' " + i + "></div>", this.$grid_scale = this.$grid.childNodes[0], this.$grid_data = this.$grid.childNodes[1];
  var s = a[this.$config.bind + "_attribute"];
  if (!s && this.$config.bind && (s = "data-" + this.$config.bind + "-id"), this.$config.item_attribute = s || null, !this.$config.layers) {
    var o = this._createLayerConfig();
    this.$config.layers = o;
  }
  var l = { init: function() {
  }, doOnRender: function() {
  } };
  this._renderHeaderResizers = l.doOnRender, this._mouseDelegates = Te(e);
  var c = function(d, u) {
    var h = { row_before_start: d.bind(function(_, p, y) {
      var k = u.$getConfig(), b = u.$config.rowStore;
      if (!nt(y, k.task_grid_row_resizer_attribute)) return !1;
      var g = this.locate(y, k.task_grid_row_resizer_attribute), m = b.getItem(g);
      return u.callEvent("onBeforeRowResize", [m]) !== !1 && void 0;
    }, d), row_after_start: d.bind(function(_, p, y) {
      var k = u.$getConfig(), b = this.locate(y, k.task_grid_row_resizer_attribute);
      _.config.marker.innerHTML = "", _.config.marker.className += " gantt_row_grid_resize_area", _.config.marker.style.width = u.$grid.offsetWidth + "px", _.config.drag_id = b;
    }, d), row_drag_move: d.bind(function(_, p, y) {
      var k = u.$config.rowStore, b = u.$getConfig(), g = _.config, m = g.drag_id, f = u.getItemHeight(m), v = u.getItemTop(m) - p.scrollTop, x = V(u.$grid_data), $ = parseInt(g.marker.style.top, 10), w = v + x.y, S = 0, T = b.min_task_grid_row_height;
      return (S = $ - w) < T && (S = T), g.marker.style.left = x.x + "px", g.marker.style.top = w - 1 + "px", g.marker.style.height = Math.abs(S) + 1 + "px", g.marker_height = S, u.callEvent("onRowResize", [m, k.getItem(m), S + f]), !0;
    }, d), row_drag_end: d.bind(function(_, p, y) {
      var k = u.$config.rowStore, b = _.config, g = b.drag_id, m = k.getItem(g), f = u.getItemHeight(g), v = b.marker_height;
      u.callEvent("onBeforeRowResizeEnd", [g, m, v]) !== !1 && m.row_height != v && (m.row_height = v, k.updateItem(g), u.callEvent("onAfterRowResize", [g, m, f, v]), this.render());
    }, d) };
    return { init: function() {
      var _ = d.$services.getService("dnd"), p = u.$getConfig(), y = new _(u.$grid_data, { updates_per_second: 60 });
      d.defined(p.dnd_sensitivity) && (y.config.sensitivity = p.dnd_sensitivity), y.attachEvent("onBeforeDragStart", function(k, b) {
        return h.row_before_start(y, k, b);
      }), y.attachEvent("onAfterDragStart", function(k, b) {
        return h.row_after_start(y, k, b);
      }), y.attachEvent("onDragMove", function(k, b) {
        return h.row_drag_move(y, k, b);
      }), y.attachEvent("onDragEnd", function(k, b) {
        return h.row_drag_end(y, k, b);
      });
    } };
  }(e, this);
  c.init(), this._addLayers(this.$gantt), this._initEvents(), r && (this._columnDND = new va(e, this), this._columnDND.init()), this.callEvent("onReady", []);
}, _validateColumnWidth: function(t, e) {
  var n = t[e];
  if (n && n != "*") {
    var i = this.$gantt, a = 1 * n;
    isNaN(a) ? i.assert(!1, "Wrong " + e + " value of column " + t.name) : t[e] = a;
  }
}, setSize: function(t, e) {
  this.$config.width = this.$state.width = t, this.$config.height = this.$state.height = e;
  for (var n, i = this.getGridColumns(), a = 0, r = (c = this.$getConfig()).grid_elastic_columns, s = 0, o = i.length; s < o; s++) this._validateColumnWidth(i[s], "min_width"), this._validateColumnWidth(i[s], "max_width"), this._validateColumnWidth(i[s], "width"), a += 1 * i[s].width;
  if (!isNaN(a) && this.$config.scrollable || (a = n = this._setColumnsWidth(t + 1)), this.$config.scrollable && r && !isNaN(a)) {
    let u = "width";
    r == "min_width" && (u = "min_width");
    let h = 0;
    i.forEach(function(_) {
      h += _[u] || c.min_grid_column_width;
    });
    var l = Math.max(h, t);
    a = this._setColumnsWidth(l), n = t;
  }
  this.$config.scrollable ? (this.$grid_scale.style.width = a + "px", this.$grid_data.style.width = a + "px") : (this.$grid_scale.style.width = "inherit", this.$grid_data.style.width = "inherit"), this.$config.width -= 1;
  var c = this.$getConfig();
  n !== t && (n !== void 0 ? (c.grid_width = n, this.$config.width = n - 1) : isNaN(a) || (this._setColumnsWidth(a), c.grid_width = a, this.$config.width = a - 1));
  var d = Math.max(this.$state.height - c.scale_height, 0);
  this.$grid_data.style.height = d + "px", this.refresh();
}, getSize: function() {
  var t = this.$getConfig(), e = this.$config.rowStore ? this.getTotalHeight() : 0, n = this._getGridWidth();
  return { x: this.$state.width, y: this.$state.height, contentX: this.isVisible() ? n : 0, contentY: this.isVisible() ? t.scale_height + e : 0, scrollHeight: this.isVisible() ? e : 0, scrollWidth: this.isVisible() ? n : 0 };
}, _bindStore: function() {
  if (this.$config.bind) {
    var t = this.$gantt.getDatastore(this.$config.bind);
    if (this.$config.rowStore = t, t && !t._gridCacheAttached) {
      var e = this;
      t._gridCacheAttached = t.attachEvent("onBeforeFilter", function() {
        e._resetTopPositionHeight();
      });
    }
  }
}, _unbindStore: function() {
  if (this.$config.bind) {
    var t = this.$gantt.getDatastore(this.$config.bind);
    t && t._gridCacheAttached && (t.detachEvent(t._gridCacheAttached), t._gridCacheAttached = !1);
  }
}, refresh: function() {
  this._bindStore(), this._resetTopPositionHeight(), this._resetHeight(), this._initSmartRenderingPlaceholder(), this._calculateGridWidth(), this._renderGridHeader();
}, getViewPort: function() {
  var t = this.$config.scrollLeft || 0, e = this.$config.scrollTop || 0, n = this.$config.height || 0, i = this.$config.width || 0;
  return { y: e, y_end: e + n, x: t, x_end: t + i, height: n, width: i };
}, scrollTo: function(t, e) {
  if (this.isVisible()) {
    var n = !1;
    this.$config.scrollTop = this.$config.scrollTop || 0, this.$config.scrollLeft = this.$config.scrollLeft || 0, 1 * t == t && (this.$config.scrollLeft = this.$state.scrollLeft = this.$grid.scrollLeft = t, n = !0), 1 * e == e && (this.$config.scrollTop = this.$state.scrollTop = this.$grid_data.scrollTop = e, n = !0), n && this.callEvent("onScroll", [this.$config.scrollLeft, this.$config.scrollTop]);
  }
}, getColumnIndex: function(t, e) {
  for (var n = this.$getConfig().columns, i = 0, a = 0; a < n.length; a++) if (e && n[a].hide && i++, n[a].name == t) return a - i;
  return null;
}, getColumn: function(t) {
  var e = this.getColumnIndex(t);
  return e === null ? null : this.$getConfig().columns[e];
}, getGridColumns: function() {
  return this.$getConfig().columns.slice();
}, isVisible: function() {
  return this.$parent && this.$parent.$config ? !this.$parent.$config.hidden : this.$grid.offsetWidth;
}, _createLayerConfig: function() {
  var t = this.$gantt, e = this;
  return [{ renderer: t.$ui.layers.gridLine(), container: this.$grid_data, filter: [function() {
    return e.isVisible();
  }] }, { renderer: t.$ui.layers.gridTaskRowResizer(), container: this.$grid_data, append: !0, filter: [function() {
    return t.config.resize_rows;
  }] }];
}, _addLayers: function(t) {
  if (this.$config.bind) {
    this._taskLayers = [];
    var e = this, n = this.$gantt.$services.getService("layers"), i = n.getDataRender(this.$config.bind);
    i || (i = n.createDataRender({ name: this.$config.bind, defaultContainer: function() {
      return e.$grid_data;
    } }));
    for (var a = this.$config.layers, r = 0; a && r < a.length; r++) {
      var s = a[r];
      s.view = this;
      var o = i.addLayer(s);
      this._taskLayers.push(o);
    }
    this._bindStore(), this._initSmartRenderingPlaceholder();
  }
}, _refreshPlaceholderOnStoreUpdate: function(t) {
  var e = this.$getConfig(), n = this.$config.rowStore;
  if (n && t === null && this.isVisible() && e.smart_rendering) {
    var i;
    if (this.$config.scrollY) {
      var a = this.$gantt.$ui.getView(this.$config.scrollY);
      a && (i = a.getScrollState().scrollSize);
    }
    if (i || (i = n ? this.getTotalHeight() : 0), i) {
      this.$rowsPlaceholder && this.$rowsPlaceholder.parentNode && this.$rowsPlaceholder.parentNode.removeChild(this.$rowsPlaceholder);
      var r = this.$rowsPlaceholder = document.createElement("div");
      r.style.visibility = "hidden", r.style.height = i + "px", r.style.width = "1px", this.$grid_data.appendChild(r);
    }
  }
}, _initSmartRenderingPlaceholder: function() {
  var t = this.$config.rowStore;
  t && (this._initSmartRenderingPlaceholder = function() {
  }, this._staticBgHandler = t.attachEvent("onStoreUpdated", R(this._refreshPlaceholderOnStoreUpdate, this)));
}, _initEvents: function() {
  var t = this.$gantt;
  this._mouseDelegates.delegate("click", "gantt_close", t.bind(function(e, n, i) {
    var a = this.$config.rowStore;
    if (!a) return !0;
    var r = nt(e, this.$config.item_attribute);
    return r && a.close(r.getAttribute(this.$config.item_attribute)), !1;
  }, this), this.$grid), this._mouseDelegates.delegate("click", "gantt_open", t.bind(function(e, n, i) {
    var a = this.$config.rowStore;
    if (!a) return !0;
    var r = nt(e, this.$config.item_attribute);
    return r && a.open(r.getAttribute(this.$config.item_attribute)), !1;
  }, this), this.$grid);
}, _clearLayers: function(t) {
  var e = this.$gantt.$services.getService("layers").getDataRender(this.$config.bind);
  if (this._taskLayers) for (var n = 0; n < this._taskLayers.length; n++) e.removeLayer(this._taskLayers[n]);
  this._taskLayers = [];
}, _getColumnWidth: function(t, e, n) {
  var i = t.min_width || e.min_grid_column_width, a = Math.max(n, i || 10);
  return t.max_width && (a = Math.min(a, t.max_width)), a;
}, _checkGridColumnMinWidthLimits: function(t, e) {
  for (var n = 0, i = t.length; n < i; n++) {
    var a = 1 * t[n].width;
    !t[n].min_width && a < e.min_grid_column_width && (t[n].min_width = a);
  }
}, _getGridWidthLimits: function() {
  for (var t = this.$getConfig(), e = this.getGridColumns(), n = 0, i = 0, a = 0; a < e.length; a++) n += e[a].min_width ? e[a].min_width : t.min_grid_column_width, i !== void 0 && (i = e[a].max_width ? i + e[a].max_width : void 0);
  return this._checkGridColumnMinWidthLimits(e, t), [n, i];
}, _setColumnsWidth: function(t, e) {
  var n = this.$getConfig(), i = this.getGridColumns(), a = 0, r = t;
  e = window.isNaN(e) ? -1 : e;
  for (var s = 0, o = i.length; s < o; s++) a += 1 * i[s].width;
  if (window.isNaN(a))
    for (this._calculateGridWidth(), a = 0, s = 0, o = i.length; s < o; s++) a += 1 * i[s].width;
  var l = r - a, c = 0;
  for (s = 0; s < e + 1; s++) c += i[s].width;
  for (a -= c, s = e + 1; s < i.length; s++) {
    var d = i[s], u = Math.round(l * (d.width / a));
    l < 0 ? d.min_width && d.width + u < d.min_width ? u = d.min_width - d.width : !d.min_width && n.min_grid_column_width && d.width + u < n.min_grid_column_width && (u = n.min_grid_column_width - d.width) : d.max_width && d.width + u > d.max_width && (u = d.max_width - d.width), a -= d.width, d.width += u, l -= u;
  }
  for (var h = l > 0 ? 1 : -1; l > 0 && h === 1 || l < 0 && h === -1; ) {
    var _ = l;
    for (s = e + 1; s < i.length; s++) {
      var p;
      if ((p = i[s].width + h) == this._getColumnWidth(i[s], n, p) && (l -= h, i[s].width = p), !l) break;
    }
    if (_ == l) break;
  }
  return l && e > -1 && (p = i[e].width + l) == this._getColumnWidth(i[e], n, p) && (i[e].width = p), this._getColsTotalWidth();
}, _getColsTotalWidth: function() {
  for (var t = this.getGridColumns(), e = 0, n = 0; n < t.length; n++) {
    var i = parseFloat(t[n].width);
    if (window.isNaN(i)) return !1;
    e += i;
  }
  return e;
}, _calculateGridWidth: function() {
  for (var t = this.$getConfig(), e = this.getGridColumns(), n = 0, i = [], a = [], r = 0; r < e.length; r++) {
    var s = parseFloat(e[r].width);
    window.isNaN(s) && (s = t.min_grid_column_width || 10, i.push(r)), a[r] = s, n += s;
  }
  var o = this._getGridWidth() + 1;
  if (t.autofit || i.length) {
    var l = o - n;
    if (t.autofit && !t.grid_elastic_columns) for (r = 0; r < a.length; r++) {
      var c = Math.round(l / (a.length - r));
      a[r] += c, (d = this._getColumnWidth(e[r], t, a[r])) != a[r] && (c = d - a[r], a[r] = d), l -= c;
    }
    else if (i.length) for (r = 0; r < i.length; r++) {
      c = Math.round(l / (i.length - r));
      var d, u = i[r];
      a[u] += c, (d = this._getColumnWidth(e[u], t, a[u])) != a[u] && (c = d - a[u], a[u] = d), l -= c;
    }
    for (r = 0; r < a.length; r++) e[r].width = a[r];
  } else {
    var h = o != n;
    this.$config.width = n - 1, t.grid_width = n, h && this.$parent._setContentSize(this.$config.width, null);
  }
}, _renderGridHeader: function() {
  var t = this.$gantt, e = this.$getConfig(), n = this.$gantt.locale, i = this.$gantt.templates, a = this.getGridColumns();
  e.rtl && (a = a.reverse());
  var r = [], s = 0, o = n.labels, l = e.scale_height - 1;
  const c = {};
  for (var d = 0; d < a.length; d++) {
    var u = d == a.length - 1, h = a[d];
    h.name || (h.name = t.uid() + "");
    var _ = 1 * h.width, p = this._getGridWidth();
    u && p > s + _ && (h.width = _ = p - s), s += _;
    var y = t._sort && h.name == t._sort.name ? `<div data-column-id="${h.name}" class="gantt_sort gantt_${t._sort.direction}"></div>` : "", k = ["gantt_grid_head_cell", "gantt_grid_head_" + h.name, u ? "gantt_last_cell" : "", i.grid_header_class(h.name, h)].join(" "), b = "width:" + (_ - (u ? 1 : 0)) + "px;", g = h.label || o["column_" + h.name] || o[h.name];
    typeof g == "function" && (g = g.call(t, h.name, h)), g = g || "";
    let f = !1;
    t.config.external_render && t.config.external_render.isElement(g) && (f = !0, c[h.name] = g);
    var m = "<div class='" + k + "' style='" + b + "' " + t._waiAria.gridScaleCellAttrString(h, g) + " data-column-id='" + h.name + "' column_id='" + h.name + "' data-column-name='" + h.name + "' data-column-index='" + d + "'>" + (f ? "<div data-component-container></div>" : g) + y + "</div>";
    r.push(m);
  }
  this.$grid_scale.style.height = e.scale_height + "px", this.$grid_scale.style.lineHeight = l + "px", this.$grid_scale.innerHTML = r.join("");
  for (let f in c) t.config.external_render.renderElement(c[f], this.$grid_scale.querySelector("[data-column-id='" + f + "'] [data-component-container]"));
  this._renderHeaderResizers && this._renderHeaderResizers();
}, _getGridWidth: function() {
  return this.$config.width;
}, destructor: function() {
  this._clearLayers(this.$gantt), this._mouseDelegates && (this._mouseDelegates.destructor(), this._mouseDelegates = null), this._unbindStore(), this.$grid = null, this.$grid_scale = null, this.$grid_data = null, this.$gantt = null, this.$config.rowStore && (this.$config.rowStore.detachEvent(this._staticBgHandler), this.$config.rowStore = null), this.callEvent("onDestroy", []), this.detachAllEvents();
} };
const ka = { init: function(t, e) {
  var n = e.$gantt;
  n.attachEvent("onTaskClick", function(i, a) {
    if (n._is_icon_open_click(a)) return !0;
    var r = t.getState(), s = t.locateCell(a.target);
    return !s || !t.getEditorConfig(s.columnName) || (t.isVisible() && r.id == s.id && r.columnName == s.columnName || t.startEdit(s.id, s.columnName), !1);
  }), n.attachEvent("onEmptyClick", function() {
    return t.isVisible() && t.isChanged() ? t.save() : t.hide(), !0;
  }), n.attachEvent("onTaskDblClick", function(i, a) {
    var r = t.getState(), s = t.locateCell(a.target);
    return !s || !t.isVisible() || s.columnName != r.columnName;
  });
}, onShow: function(t, e, n) {
  var i = n.$gantt;
  i.ext && i.ext.keyboardNavigation && i.ext.keyboardNavigation.attachEvent("onKeyDown", function(a, r) {
    var s = i.constants.KEY_CODES, o = !1;
    return r.keyCode === s.SPACE && t.isVisible() && (o = !0), !o;
  }), e.onkeydown = function(a) {
    a = a || window.event;
    var r = i.constants.KEY_CODES;
    if (!(a.defaultPrevented || a.shiftKey && a.keyCode != r.TAB)) {
      var s = !0;
      switch (a.keyCode) {
        case i.keys.edit_save:
          t.save();
          break;
        case i.keys.edit_cancel:
          t.hide();
          break;
        case r.UP:
        case r.DOWN:
          t.isVisible() && (t.hide(), s = !1);
          break;
        case r.TAB:
          a.shiftKey ? t.editPrevCell(!0) : t.editNextCell(!0);
          break;
        default:
          s = !1;
      }
      s && a.preventDefault();
    }
  };
}, onHide: function() {
}, destroy: function() {
} }, ya = { init: function(t, e) {
  var n = t, i = e.$gantt, a = null, r = i.ext.keyboardNavigation;
  r.attachEvent("onBeforeFocus", function(s) {
    var o = t.locateCell(s);
    if (clearTimeout(a), o) {
      var l = o.columnName, c = o.id, d = n.getState();
      if (n.isVisible() && d.id == c && d.columnName === l) return !1;
    }
    return !0;
  }), r.attachEvent("onFocus", function(s) {
    var o = t.locateCell(s), l = t.getState();
    return clearTimeout(a), !o || o.id == l.id && o.columnName == l.columnName || n.isVisible() && n.save(), !0;
  }), t.attachEvent("onHide", function() {
    clearTimeout(a);
  }), r.attachEvent("onBlur", function() {
    return a = setTimeout(function() {
      n.save();
    }), !0;
  }), i.attachEvent("onTaskDblClick", function(s, o) {
    var l = t.getState(), c = t.locateCell(o.target);
    return !c || !t.isVisible() || c.columnName != l.columnName;
  }), i.attachEvent("onTaskClick", function(s, o) {
    if (i._is_icon_open_click(o)) return !0;
    var l = t.getState(), c = t.locateCell(o.target);
    return !c || !t.getEditorConfig(c.columnName) || (t.isVisible() && l.id == c.id && l.columnName == c.columnName || t.startEdit(c.id, c.columnName), !1);
  }), i.attachEvent("onEmptyClick", function() {
    return n.save(), !0;
  }), r.attachEvent("onKeyDown", function(s, o) {
    var l = t.locateCell(o.target), c = !!l && t.getEditorConfig(l.columnName), d = t.getState(), u = i.constants.KEY_CODES, h = o.keyCode, _ = !1;
    switch (h) {
      case u.ENTER:
        t.isVisible() ? (t.save(), o.preventDefault(), _ = !0) : c && !(o.ctrlKey || o.metaKey || o.shiftKey) && (n.startEdit(l.id, l.columnName), o.preventDefault(), _ = !0);
        break;
      case u.ESC:
        t.isVisible() && (t.hide(), o.preventDefault(), _ = !0);
        break;
      case u.UP:
      case u.DOWN:
        break;
      case u.LEFT:
      case u.RIGHT:
        (c && t.isVisible() || d.editorType === "date") && (_ = !0);
        break;
      case u.SPACE:
        t.isVisible() && (_ = !0), c && !t.isVisible() && (n.startEdit(l.id, l.columnName), o.preventDefault(), _ = !0);
        break;
      case u.DELETE:
        c && !t.isVisible() ? (n.startEdit(l.id, l.columnName), _ = !0) : c && t.isVisible() && (_ = !0);
        break;
      case u.TAB:
        if (t.isVisible()) {
          o.shiftKey ? t.editPrevCell(!0) : t.editNextCell(!0);
          var p = t.getState();
          p.id && r.focus({ type: "taskCell", id: p.id, column: p.columnName }), o.preventDefault(), _ = !0;
        }
        break;
      default:
        if (t.isVisible()) _ = !0;
        else if (h >= 48 && h <= 57 || h > 95 && h < 112 || h >= 64 && h <= 91 || h > 185 && h < 193 || h > 218 && h < 223) {
          var y = s.modifiers, k = y.alt || y.ctrl || y.meta || y.shift;
          y.alt || k && r.getCommandHandler(s, "taskCell") || c && !t.isVisible() && (n.startEdit(l.id, l.columnName), _ = !0);
        }
    }
    return !_;
  });
}, onShow: function(t, e, n) {
}, onHide: function(t, e, n) {
  const i = n.$gantt;
  i && i.focus();
}, destroy: function() {
} };
function St(t) {
  var e = function() {
  };
  return e.prototype = { show: function(n, i, a, r) {
  }, hide: function() {
  }, set_value: function(n, i, a, r) {
    this.get_input(r).value = n;
  }, get_value: function(n, i, a) {
    return this.get_input(a).value || "";
  }, is_changed: function(n, i, a, r) {
    var s = this.get_value(i, a, r);
    return s && n && s.valueOf && n.valueOf ? s.valueOf() != n.valueOf() : s != n;
  }, is_valid: function(n, i, a, r) {
    return !0;
  }, save: function(n, i, a) {
  }, get_input: function(n) {
    return n.querySelector("input");
  }, focus: function(n) {
    var i = this.get_input(n);
    i && (i.focus && i.focus(), i.select && i.select());
  } }, e;
}
function ba(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  return z(n, e), P(n.prototype, { show: function(i, a, r, s) {
    var o = `<div role='cell'><input type='text' name='${a.name}' title='${a.name}'></div>`;
    s.innerHTML = o;
  } }, !0), n;
}
function xa(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  return z(n, e), P(n.prototype, { show: function(i, a, r, s) {
    var o = r.min || 0, l = r.max || 100, c = `<div role='cell'><input type='number' min='${o}' max='${l}' name='${a.name}' title='${a.name}'></div>`;
    s.innerHTML = c, s.oninput = function(d) {
      +d.target.value < o && (d.target.value = o), +d.target.value > l && (d.target.value = l);
    };
  }, get_value: function(i, a, r) {
    return this.get_input(r).value || "";
  }, is_valid: function(i, a, r, s) {
    return !isNaN(parseInt(i, 10));
  } }, !0), n;
}
function $a(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  return z(n, e), P(n.prototype, { show: function(i, a, r, s) {
    for (var o = `<div role='cell'><select name='${a.name}' title='${a.name}'>`, l = [], c = r.options || [], d = 0; d < c.length; d++) l.push("<option value='" + r.options[d].key + "'>" + c[d].label + "</option>");
    o += l.join("") + "</select></div>", s.innerHTML = o;
  }, get_input: function(i) {
    return i.querySelector("select");
  } }, !0), n;
}
function wa(t) {
  var e = St(), n = "%Y-%m-%d", i = null, a = null;
  function r() {
    return e.apply(this, arguments) || this;
  }
  return z(r, e), P(r.prototype, { show: function(s, o, l, c) {
    i || (i = t.date.date_to_str(n)), a || (a = t.date.str_to_date(n));
    var d = null, u = null;
    d = typeof l.min == "function" ? l.min(s, o) : l.min, u = typeof l.max == "function" ? l.max(s, o) : l.max;
    var h = `<div style='width:140px' role='cell'><input type='date' ${d ? " min='" + i(d) + "' " : ""} ${u ? " max='" + i(u) + "' " : ""} name='${o.name}' title='${o.name}'></div>`;
    c.innerHTML = h, c.oninput = function(_) {
      _.target.value && (d || u) && (+t.date.str_to_date("%Y-%m-%d")(_.target.value) < +d && (_.target.value = t.date.date_to_str("%Y-%m-%d")(d)), +t.date.str_to_date("%Y-%m-%d")(_.target.value) > +u && (_.target.value = t.date.date_to_str("%Y-%m-%d")(u)));
    };
  }, set_value: function(s, o, l, c) {
    s && s.getFullYear ? this.get_input(c).value = i(s) : this.get_input(c).value = s;
  }, is_valid: function(s, o, l, c) {
    return !(!s || isNaN(s.getTime()));
  }, get_value: function(s, o, l) {
    var c;
    try {
      c = a(this.get_input(l).value || "");
    } catch {
      c = null;
    }
    return c;
  } }, !0), r;
}
function Sa(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  function i(l) {
    return l.formatter || t.ext.formatters.linkFormatter();
  }
  function a(l, c) {
    for (var d = (l || "").split(c.delimiter || ","), u = 0; u < d.length; u++) {
      var h = d[u].trim();
      h ? d[u] = h : (d.splice(u, 1), u--);
    }
    return d.sort(), d;
  }
  function r(l, c, d) {
    for (var u = l.$target, h = [], _ = 0; _ < u.length; _++) {
      var p = d.getLink(u[_]);
      h.push(i(c).format(p));
    }
    return h.join((c.delimiter || ",") + " ");
  }
  function s(l) {
    return l.source + "_" + l.target + "_" + l.type + "_" + (l.lag || 0);
  }
  function o(l, c, d) {
    var u = function(k, b, g) {
      var m = [];
      return [...new Set(b)].forEach(function(f) {
        var v = i(g).parse(f);
        v && (v.target = k, v.id = "predecessor_generated", t.isLinkAllowed(v) && (v.id = void 0, m.push(v)));
      }), m;
    }(l.id, c, d), h = {};
    l.$target.forEach(function(k) {
      var b = t.getLink(k);
      h[s(b)] = b.id;
    });
    var _ = [];
    u.forEach(function(k) {
      var b = s(k);
      h[b] ? delete h[b] : _.push(k);
    });
    var p = [];
    for (var y in h) p.push(h[y]);
    return { add: _, remove: p };
  }
  return z(n, e), P(n.prototype, { show: function(l, c, d, u) {
    var h = `<div role='cell'><input type='text' name='${c.name}' title='${c.name}'></div>`;
    u.innerHTML = h;
  }, hide: function() {
  }, set_value: function(l, c, d, u) {
    this.get_input(u).value = r(l, d.editor, t);
  }, get_value: function(l, c, d) {
    return a(this.get_input(d).value || "", c.editor);
  }, save: function(l, c, d) {
    var u = o(t.getTask(l), this.get_value(l, c, d), c.editor);
    (u.add.length || u.remove.length) && t.batchUpdate(function() {
      u.add.forEach(function(h) {
        t.addLink(h);
      }), u.remove.forEach(function(h) {
        t.deleteLink(h);
      }), t.autoSchedule && t.autoSchedule();
    });
  }, is_changed: function(l, c, d, u) {
    var h = this.get_value(c, d, u), _ = a(r(l, d.editor, t), d.editor);
    return h.join() !== _.join();
  } }, !0), n;
}
function Ta(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  function i(a) {
    return a.formatter || t.ext.formatters.durationFormatter();
  }
  return z(n, e), P(n.prototype, { show: function(a, r, s, o) {
    var l = `<div role='cell'><input type='text' name='${r.name}' title='${r.name}'></div>`;
    o.innerHTML = l;
  }, set_value: function(a, r, s, o) {
    this.get_input(o).value = i(s.editor).format(a);
  }, get_value: function(a, r, s) {
    return i(r.editor).parse(this.get_input(s).value || "");
  } }, !0), n;
}
function Ea(t) {
  return function(n, i, a) {
    a == "keepDates" ? function(r, s) {
      s == "duration" ? r.end_date = t.calculateEndDate(r) : s != "end_date" && s != "start_date" || (r.duration = t.calculateDuration(r));
    }(n, i) : a == "keepDuration" ? function(r, s) {
      s == "end_date" ? r.start_date = e(r) : s != "start_date" && s != "duration" || (r.end_date = t.calculateEndDate(r));
    }(n, i) : function(r, s) {
      t.config.schedule_from_end ? s == "end_date" || s == "duration" ? r.start_date = e(r) : s == "start_date" && (r.duration = t.calculateDuration(r)) : s == "start_date" || s == "duration" ? r.end_date = t.calculateEndDate(r) : s == "end_date" && (r.duration = t.calculateDuration(r));
    }(n, i);
  };
  function e(n) {
    return t.calculateEndDate({ start_date: n.end_date, duration: -n.duration, task: n });
  }
}
function Ca(t) {
  t.config.editor_types = { text: new (ba())(), number: new (xa())(), select: new ($a())(), date: new (wa(t))(), predecessor: new (Sa(t))(), duration: new (Ta(t))() };
}
function Da(t) {
  var e = /* @__PURE__ */ function(a) {
    var r = null;
    return { setMapping: function(s) {
      r = s;
    }, getMapping: function() {
      return r || (a.config.keyboard_navigation_cells && a.ext.keyboardNavigation ? ya : ka);
    } };
  }(t), n = {};
  ot(n);
  var i = { init: Ca, createEditors: function(a) {
    function r(u, h) {
      var _ = a.$getConfig(), p = function(b, g) {
        for (var m = a.$getConfig(), f = a.getItemTop(b), v = a.getItemHeight(b), x = a.getGridColumns(), $ = 0, w = 0, S = 0, T = 0; T < x.length; T++) {
          if (x[T].name == g) {
            S = x[T].width;
            break;
          }
          m.rtl ? w += x[T].width : $ += x[T].width;
        }
        return m.rtl ? { top: f, right: w, height: v, width: S } : { top: f, left: $, height: v, width: S };
      }(u, h), y = document.createElement("div");
      y.className = "gantt_grid_editor_placeholder", y.setAttribute(a.$config.item_attribute, u), y.setAttribute(a.$config.bind + "_id", u), y.setAttribute("data-column-name", h);
      var k = function(b, g) {
        for (var m = b.getGridColumns(), f = 0; f < m.length; f++) if (m[f].name == g) return f;
        return 0;
      }(a, h);
      return y.setAttribute("data-column-index", k), t._waiAria.inlineEditorAttr(y), _.rtl ? y.style.cssText = ["top:" + p.top + "px", "right:" + p.right + "px", "width:" + p.width + "px", "height:" + p.height + "px"].join(";") : y.style.cssText = ["top:" + p.top + "px", "left:" + p.left + "px", "width:" + p.width + "px", "height:" + p.height + "px"].join(";"), y;
    }
    var s = Ea(t), o = [], l = [], c = null, d = { _itemId: null, _columnName: null, _editor: null, _editorType: null, _placeholder: null, locateCell: function(u) {
      if (!Y(u, a.$grid)) return null;
      var h = nt(u, a.$config.item_attribute), _ = nt(u, "data-column-name");
      if (h && _) {
        var p = _.getAttribute("data-column-name");
        return { id: h.getAttribute(a.$config.item_attribute), columnName: p };
      }
      return null;
    }, getEditorConfig: function(u) {
      return a.getColumn(u).editor;
    }, init: function() {
      var u = e.getMapping();
      u.init && u.init(this, a), c = a.$gantt.getDatastore(a.$config.bind);
      var h = this;
      o.push(c.attachEvent("onIdChange", function(_, p) {
        h._itemId == _ && (h._itemId = p);
      })), o.push(c.attachEvent("onStoreUpdated", function() {
        a.$gantt.getState("batchUpdate").batch_update || h.isVisible() && !c.isVisible(h._itemId) && h.hide();
      })), l.push(t.attachEvent("onDataRender", function() {
        h._editor && h._placeholder && !Y(h._placeholder, t.$root) && a.$grid_data.appendChild(h._placeholder);
      })), this.init = function() {
      };
    }, getState: function() {
      return { editor: this._editor, editorType: this._editorType, placeholder: this._placeholder, id: this._itemId, columnName: this._columnName };
    }, startEdit: function(u, h) {
      if (this.isVisible() && this.save(), !c.exists(u)) return;
      var _ = { id: u, columnName: h };
      if (t.isReadonly(c.getItem(u))) return void this.callEvent("onEditPrevent", [_]);
      if (this.callEvent("onBeforeEditStart", [_]) === !1) return void this.callEvent("onEditPrevent", [_]);
      const p = this.show(_.id, _.columnName);
      p && p.then ? p.then((function() {
        this.setValue(), this.callEvent("onEditStart", [_]);
      }).bind(this)) : (this.setValue(), this.callEvent("onEditStart", [_]));
    }, isVisible: function() {
      return !(!this._editor || !Y(this._placeholder, t.$root));
    }, show: function(u, h) {
      this.isVisible() && this.save();
      var _ = { id: u, columnName: h }, p = a.getColumn(_.columnName), y = this.getEditorConfig(p.name);
      if (!y) return;
      var k = a.$getConfig().editor_types[y.type], b = r(_.id, _.columnName);
      a.$grid_data.appendChild(b);
      const g = (function() {
        this._editor = k, this._placeholder = b, this._itemId = _.id, this._columnName = _.columnName, this._editorType = y.type;
        var f = e.getMapping();
        f.onShow && f.onShow(this, b, a), b._onReMount = (function() {
          this.setValue();
        }).bind(this);
      }).bind(this), m = k.show(_.id, p, y, b);
      if (m && m.then) return m.then(() => {
        g();
      });
      g();
    }, setValue: function() {
      var u = this.getState(), h = u.id, _ = u.columnName, p = a.getColumn(_), y = c.getItem(h), k = this.getEditorConfig(_);
      if (k) {
        var b = y[k.map_to];
        k.map_to == "auto" && (b = c.getItem(h)), this._editor.set_value(b, h, p, this._placeholder), this.focus();
      }
    }, focus: function() {
      this._editor.focus(this._placeholder);
    }, getValue: function() {
      var u = a.getColumn(this._columnName);
      return this._editor.get_value(this._itemId, u, this._placeholder);
    }, _getItemValue: function() {
      var u = this.getEditorConfig(this._columnName);
      if (u) {
        var h = t.getTask(this._itemId)[u.map_to];
        return u.map_to == "auto" && (h = c.getItem(this._itemId)), h;
      }
    }, isChanged: function() {
      var u = a.getColumn(this._columnName), h = this._getItemValue();
      return this._editor.is_changed(h, this._itemId, u, this._placeholder);
    }, hide: function() {
      if (this._itemId) {
        var u = this._itemId, h = this._columnName, _ = e.getMapping();
        _.onHide && _.onHide(this, this._placeholder, a), this._itemId = null, this._columnName = null, this._editorType = null, this._placeholder && (this._editor && this._editor.hide && this._editor.hide(this._placeholder), this._editor = null, this._placeholder.parentNode && this._placeholder.parentNode.removeChild(this._placeholder), this._placeholder = null, this.callEvent("onEditEnd", [{ id: u, columnName: h }]));
      }
    }, save: function() {
      if (this.isVisible() && c.exists(this._itemId) && this.isChanged()) {
        var u = this._itemId, h = this._columnName;
        if (c.exists(u)) {
          var _ = c.getItem(u), p = this.getEditorConfig(h), y = { id: u, columnName: h, newValue: this.getValue(), oldValue: this._getItemValue() };
          if (this.callEvent("onBeforeSave", [y]) !== !1 && (!this._editor.is_valid || this._editor.is_valid(y.newValue, y.id, a.getColumn(h), this._placeholder))) {
            var k = p.map_to, b = y.newValue;
            k != "auto" ? (_[k] = b, s(_, k, t.config.inline_editors_date_processing), c.updateItem(u)) : this._editor.save(u, a.getColumn(h), this._placeholder), this.callEvent("onSave", [y]);
          }
          this.hide();
        }
      } else this.hide();
    }, _findEditableCell: function(u, h) {
      var _ = u, p = a.getGridColumns()[_], y = p ? p.name : null;
      if (y) {
        for (; y && !this.getEditorConfig(y); ) y = this._findEditableCell(u + h, h);
        return y;
      }
      return null;
    }, getNextCell: function(u) {
      return this._findEditableCell(a.getColumnIndex(this._columnName, !0) + u, u);
    }, getFirstCell: function() {
      return this._findEditableCell(0, 1);
    }, getLastCell: function() {
      return this._findEditableCell(a.getGridColumns().length - 1, -1);
    }, editNextCell: function(u) {
      var h = this.getNextCell(1);
      if (h) {
        var _ = this.getNextCell(1);
        _ && this.getEditorConfig(_) && this.startEdit(this._itemId, _);
      } else if (u && this.moveRow(1)) {
        var p = this.moveRow(1);
        (h = this.getFirstCell()) && this.getEditorConfig(h) && this.startEdit(p, h);
      }
    }, editPrevCell: function(u) {
      var h = this.getNextCell(-1);
      if (h) {
        var _ = this.getNextCell(-1);
        _ && this.getEditorConfig(_) && this.startEdit(this._itemId, _);
      } else if (u && this.moveRow(-1)) {
        var p = this.moveRow(-1);
        (h = this.getLastCell()) && this.getEditorConfig(h) && this.startEdit(p, h);
      }
    }, moveRow: function(u) {
      for (var h = u > 0 ? t.getNext : t.getPrev, _ = (h = t.bind(h, t))(this._itemId); t.isTaskExists(_) && t.isReadonly(t.getTask(_)); ) _ = h(_);
      return _;
    }, editNextRow: function(u) {
      var h = this.getState().id;
      if (t.isTaskExists(h)) {
        var _ = null;
        _ = u ? this.moveRow(1) : t.getNext(h), t.isTaskExists(_) && this.startEdit(_, this._columnName);
      }
    }, editPrevRow: function(u) {
      var h = this.getState().id;
      if (t.isTaskExists(h)) {
        var _ = null;
        _ = u ? this.moveRow(-1) : t.getPrev(h), t.isTaskExists(_) && this.startEdit(_, this._columnName);
      }
    }, detachStore: function() {
      o.forEach(function(u) {
        c.detachEvent(u);
      }), l.forEach(function(u) {
        t.detachEvent(u);
      }), o = [], l = [], c = null, this.hide();
    }, destructor: function() {
      this.detachStore(), this.detachAllEvents();
    } };
    return P(d, e), P(d, n), d;
  } };
  return P(i, e), P(i, n), i;
}
function $e(t, e, n, i, a) {
  if (!t.start_date || !t.end_date) return null;
  var r = n.getItemTop(t.id), s = n.getItemHeight(t.id);
  if (r > e.y_end || r + s < e.y) return !1;
  var o = n.posFromDate(t.start_date), l = n.posFromDate(t.end_date), c = Math.min(o, l) - 200, d = Math.max(o, l) + 200;
  return !(c > e.x_end || d < e.x);
}
function bn(t) {
  function e(r, s, o) {
    if (t._isAllowedUnscheduledTask(r) || !t._isTaskInTimelineLimits(r)) return;
    var l = s.getItemPosition(r), c = o, d = s.$getTemplates(), u = t.getTaskType(r.type), h = s.getBarHeight(r.id, u == c.types.milestone), _ = 0;
    u == c.types.milestone && (_ = (h - l.height) / 2);
    var p = Math.floor((s.getItemHeight(r.id) - h) / 2);
    const y = t.config.baselines && r.baselines && r.baselines.length, k = t.config.baselines && (t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow");
    if (y && k && r.bar_height !== "full" && r.bar_height < r.row_height) if (u === c.types.milestone) {
      let T = s.getBarHeight(r.id, !0), E = Math.sqrt(2 * T * T);
      p = Math.floor((E - h) / 2) + 2;
    } else p = 2;
    u == c.types.milestone && (l.left -= Math.round(h / 2), l.width = h);
    var b = document.createElement("div"), g = Math.round(l.width);
    s.$config.item_attribute && (b.setAttribute(s.$config.item_attribute, r.id), b.setAttribute(s.$config.bind + "_id", r.id)), c.show_progress && u != c.types.milestone && function(T, E, C, D, M) {
      var I = 1 * T.progress || 0;
      C = Math.max(C, 0);
      var A = document.createElement("div"), N = Math.round(C * I);
      N = Math.min(C, N), A.style.width = N + "px", A.className = "gantt_task_progress", A.innerHTML = M.progress_text(T.start_date, T.end_date, T), D.rtl && (A.style.position = "absolute", A.style.right = "0px");
      var L = document.createElement("div");
      L.className = "gantt_task_progress_wrapper", L.appendChild(A), E.appendChild(L);
      const O = !t.isReadonly(T), G = t.ext.dragTimeline && t.ext.dragTimeline._isDragInProgress();
      if (t.config.drag_progress && (O || G)) {
        var j = document.createElement("div"), H = N;
        D.rtl && (H = C - N), j.style.left = H + "px", j.className = "gantt_task_progress_drag", j.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
<path d="M5.58397 1.52543C5.78189 1.22856 6.21811 1.22856 6.41602 1.52543L10.5475 7.72265C10.769 8.05493 10.5308 8.5 10.1315 8.5L1.86852 8.5C1.46917 8.5 1.23097 8.05493 1.45249 7.72265L5.58397 1.52543Z" fill="var(--dhx-gantt-progress-handle-background)" stroke="var(--dhx-gantt-progress-handle-border)"/>
</svg>`, A.appendChild(j), E.appendChild(j);
      }
    }(r, b, g, c, d);
    var m = function(T, E, C) {
      var D = document.createElement("div");
      return t.getTaskType(T.type) != t.config.types.milestone ? D.innerHTML = C.task_text(T.start_date, T.end_date, T) : t.getTaskType(T.type) == t.config.types.milestone && E && (D.style.height = D.style.width = E + "px"), D.className = "gantt_task_content", D;
    }(r, g, d);
    b.appendChild(m);
    var f = function(T, E, C, D) {
      var M = D.$getConfig(), I = [T];
      E && I.push(E);
      var A = t.getState(), N = t.getTask(C);
      if (t.getTaskType(N.type) == M.types.milestone ? I.push("gantt_milestone") : t.getTaskType(N.type) == M.types.project && I.push("gantt_project"), I.push("gantt_bar_" + t.getTaskType(N.type)), t.isSummaryTask(N) && I.push("gantt_dependent_task"), t.isSplitTask(N) && (M.open_split_tasks && !N.$open || !M.open_split_tasks) && I.push("gantt_split_parent"), M.select_task && t.isSelectedTask(C) && I.push("gantt_selected"), C == A.drag_id && (I.push("gantt_drag_" + A.drag_mode), A.touch_drag && I.push("gantt_touch_" + A.drag_mode)), A.link_source_id == C && (I.push("gantt_link_source"), A.link_from_start ? I.push("gantt_link_from_start") : I.push("gantt_link_from_end")), A.link_target_id == C && I.push("gantt_link_target"), M.highlight_critical_path && t.isCriticalTask && t.isCriticalTask(N) && I.push("gantt_critical_task"), A.link_landing_area && A.link_target_id && A.link_source_id && A.link_target_id != A.link_source_id && (A.link_target_id == C || A.link_source_id == C)) {
        var L = A.link_source_id, O = A.link_from_start, G = A.link_to_start, j = "";
        j = t.isLinkAllowed(L, C, O, G) ? G ? "link_start_allow" : "link_finish_allow" : G ? "link_start_deny" : "link_finish_deny", I.push(j);
      }
      return I.join(" ");
    }("gantt_task_line", d.task_class(r.start_date, r.end_date, r), r.id, s);
    (r.color || r.progressColor || r.textColor) && (f += " gantt_task_inline_color"), l.width < 20 && (f += " gantt_thin_task"), b.className = f;
    var v = ["left:" + l.left + "px", "top:" + (p + l.top) + "px", "height:" + h + "px", "line-height:" + Math.max(h < 30 ? h - 2 : h, 0) + "px", "width:" + g + "px"];
    b.style.cssText = v.join(";"), r.color && b.style.setProperty("--dhx-gantt-task-background", r.color), r.textColor && b.style.setProperty("--dhx-gantt-task-color", r.textColor), r.progressColor && b.style.setProperty("--dhx-gantt-task-progress-color", r.progressColor);
    var x = function(T, E, C, D) {
      var M = "gantt_left " + i(!E.rtl, T), I = null;
      return D && (I = { type: "marginRight", value: D }), n(T, C.leftside_text, M, I);
    }(r, c, d, _);
    x && b.appendChild(x), x = function(T, E, C, D) {
      var M = "gantt_right " + i(!!E.rtl, T), I = null;
      return D && (I = { type: "marginLeft", value: D }), n(T, C.rightside_text, M, I);
    }(r, c, d, _), x && b.appendChild(x), t._waiAria.setTaskBarAttr(r, b);
    var $ = t.getState();
    const w = !t.isReadonly(r), S = t.ext.dragTimeline && t.ext.dragTimeline._isDragInProgress();
    return (w || S) && (c.drag_resize && !t.isSummaryTask(r) && u != c.types.milestone && a(b, "gantt_task_drag", r, function(T) {
      var E = document.createElement("div");
      return E.className = T, E;
    }, c), c.drag_links && c.show_links && a(b, "gantt_link_control", r, function(T) {
      var E = document.createElement("div");
      E.className = T, E.style.cssText = ["height:" + h + "px", "line-height:" + h + "px"].join(";");
      var C = document.createElement("div");
      C.className = "gantt_link_point";
      var D = !1;
      return $.link_source_id && c.touch && (D = !0), C.style.display = D ? "block" : "", E.appendChild(C), E;
    }, c, _)), b;
  }
  function n(r, s, o, l) {
    if (!s) return null;
    var c = s(r.start_date, r.end_date, r);
    if (!c) return null;
    var d = document.createElement("div");
    return d.className = "gantt_side_content " + o, d.innerHTML = c, l && (d.style[l.type] = Math.abs(l.value) + "px"), d;
  }
  function i(r, s) {
    var o = r ? { $source: [t.config.links.start_to_start], $target: [t.config.links.start_to_start, t.config.links.finish_to_start] } : { $source: [t.config.links.finish_to_start, t.config.links.finish_to_finish], $target: [t.config.links.finish_to_finish] };
    for (var l in o) for (var c = s[l], d = 0; d < c.length; d++) for (var u = t.getLink(c[d]), h = 0; h < o[l].length; h++) if (u.type == o[l][h]) return "gantt_link_crossing";
    return "";
  }
  function a(r, s, o, l, c, d) {
    var u, h = t.getState();
    +o.start_date >= +h.min_date && ((u = l([s, c.rtl ? "task_right" : "task_left", "task_start_date"].join(" "))).setAttribute("data-bind-property", "start_date"), d && (u.style.marginLeft = d + "px"), r.appendChild(u)), +o.end_date <= +h.max_date && ((u = l([s, c.rtl ? "task_left" : "task_right", "task_end_date"].join(" "))).setAttribute("data-bind-property", "end_date"), d && (u.style.marginRight = d + "px"), r.appendChild(u));
  }
  return function(r, s, o) {
    var l = (o = s.$getConfig()).type_renderers[t.getTaskType(r.type)], c = e;
    return l ? l.call(t, r, function(d) {
      return c.call(t, d, s, o);
    }, s) : c.call(t, r, s, o);
  };
}
function Ue(t) {
  return { render: bn(t), update: null, isInViewPort: $e, getVisibleRange: ft };
}
function Ct() {
  return console.error("You are trying to use a Pro feature that is not available in the GPL version."), { render: function() {
  }, isInViewPort: function() {
  }, getVisibleRange: function() {
  } };
}
function qe(t, e, n) {
  return { top: e.getItemTop(t.id), height: e.getItemHeight(t.id), left: 0, right: 1 / 0 };
}
function jt(t, e) {
  var n = 0, i = t.left.length - 1;
  if (e) for (var a = 0; a < t.left.length; a++) {
    var r = t.left[a];
    if (r < e.x && (n = a), r > e.x_end) {
      i = a;
      break;
    }
  }
  return { start: n, end: i };
}
function oe(t, e, n, i) {
  var a = e.width[t];
  if (a <= 0) return !1;
  if (!i.config.smart_rendering || Nt(i)) return !0;
  var r = e.left[t] - a, s = e.left[t] + a;
  return r <= n.x_end && s >= n.x;
}
function Aa(t, e) {
  var n = e.config.timeline_placeholder;
  if (t = t || [], n && t.filter((l) => l.id === "timeline_placeholder_task").length === 0) {
    var i = e.getState(), a = null, r = i.min_date, s = i.max_date;
    t.length && (a = t[t.length - 1].id);
    var o = { start_date: r, end_date: s, row_height: n.height || 0, id: "timeline_placeholder_task", unscheduled: !0, lastTaskId: a, calendar_id: n.calendar || "global", $source: [], $target: [] };
    t.push(o);
  }
}
function Ia(t) {
  var e = { current_pos: null, dirs: { left: "left", right: "right", up: "up", down: "down" }, path: [], clear: function() {
    this.current_pos = null, this.path = [];
  }, point: function(a) {
    this.current_pos = t.copy(a);
  }, get_lines: function(a) {
    this.clear(), this.point(a[0]);
    for (var r = 1; r < a.length; r++) this.line_to(a[r]);
    return this.get_path();
  }, line_to: function(a) {
    var r = t.copy(a), s = this.current_pos, o = this._get_line(s, r);
    this.path.push(o), this.current_pos = r;
  }, get_path: function() {
    return this.path;
  }, get_wrapper_sizes: function(a, r, s) {
    var o, l = r.$getConfig().link_wrapper_width, c = a.y - l / 2;
    switch (a.direction) {
      case this.dirs.left:
        o = { top: c, height: l, lineHeight: l, left: a.x - a.size - l / 2, width: a.size + l };
        break;
      case this.dirs.right:
        o = { top: c, lineHeight: l, height: l, left: a.x - l / 2, width: a.size + l };
        break;
      case this.dirs.up:
        o = { top: c - a.size, lineHeight: a.size + l, height: a.size + l, left: a.x - l / 2, width: l };
        break;
      case this.dirs.down:
        o = { top: c, lineHeight: a.size + l, height: a.size + l, left: a.x - l / 2, width: l };
    }
    return o;
  }, get_line_sizes: function(a, r) {
    var s, o = r.$getConfig(), l = o.link_line_width, c = o.link_wrapper_width, d = a.size + l;
    switch (a.direction) {
      case this.dirs.left:
      case this.dirs.right:
        s = { height: l, width: d, marginTop: (c - l) / 2, marginLeft: (c - l) / 2 };
        break;
      case this.dirs.up:
      case this.dirs.down:
        s = { height: d, width: l, marginTop: (c - l) / 2, marginLeft: (c - l) / 2 };
    }
    return s;
  }, render_line: function(a, r, s, o) {
    var l = this.get_wrapper_sizes(a, s, o), c = document.createElement("div");
    c.style.cssText = ["top:" + l.top + "px", "left:" + l.left + "px", "height:" + l.height + "px", "width:" + l.width + "px"].join(";"), c.className = "gantt_line_wrapper";
    var d = this.get_line_sizes(a, s), u = document.createElement("div");
    return u.style.cssText = ["height:" + d.height + "px", "width:" + d.width + "px", "margin-top:" + d.marginTop + "px", "margin-left:" + d.marginLeft + "px"].join(";"), u.className = "gantt_link_line_" + a.direction, c.appendChild(u), c;
  }, render_corner: function(a, r) {
    const s = a.radius, o = r.$getConfig(), l = o.link_line_width || 2, c = document.createElement("div");
    let d, u;
    return c.classList.add("gantt_link_corner"), c.classList.add(`gantt_link_corner_${a.direction.from}_${a.direction.to}`), c.style.width = `${s}px`, c.style.height = `${s}px`, a.direction.from === "right" && a.direction.to === "down" ? (d = "Right", u = "Top", c.style.left = a.x - o.link_line_width / 2 + "px", c.style.top = `${a.y}px`) : a.direction.from === "down" && a.direction.to === "right" ? (d = "Left", u = "Bottom", c.style.left = a.x - o.link_line_width / 2 + "px", c.style.top = `${a.y}px`) : a.direction.from === "right" && a.direction.to === "up" ? (d = "Right", u = "Bottom", c.style.left = a.x - o.link_line_width / 2 + "px", c.style.top = a.y - s + "px") : a.direction.from === "up" && a.direction.to === "right" ? (d = "Left", u = "Top", c.style.left = a.x - o.link_line_width / 2 + "px", c.style.top = a.y - s + "px") : a.direction.from === "left" && a.direction.to === "down" ? (d = "Left", u = "Top", c.style.left = a.x - s - o.link_line_width / 2 + "px", c.style.top = `${a.y}px`) : a.direction.from === "down" && a.direction.to === "left" ? (d = "Right", u = "Bottom", c.style.left = a.x - s - o.link_line_width / 2 + "px", c.style.top = `${a.y}px`) : a.direction.from === "left" && a.direction.to === "up" ? (d = "Left", u = "Bottom", c.style.left = a.x - s - o.link_line_width / 2 + "px", c.style.top = a.y - s + "px") : a.direction.from === "up" && a.direction.to === "left" && (d = "Right", u = "Top", c.style.left = a.x - s - o.link_line_width / 2 + "px", c.style.top = a.y - s + "px"), c.style[`border${u}Width`] = `${l}px`, c.style[`border${d}Width`] = `${l}px`, c.style[`border${d}Style`] = "solid", c.style[`border${u}Style`] = "solid", c.style[`border${u}${d}Radius`] = `${s}px`, c;
  }, render_arrow(a, r) {
    var s = document.createElement("div"), o = a.y, l = a.x, c = r.link_arrow_size;
    s.style.setProperty("--dhx-gantt-icon-size", `${c}px`);
    var d = "gantt_link_arrow gantt_link_arrow_" + a.direction;
    return s.style.top = o + "px", s.style.left = l + "px", s.className = d, s;
  }, _get_line: function(a, r) {
    var s = this.get_direction(a, r), o = { x: a.x, y: a.y, direction: this.get_direction(a, r) };
    return s == this.dirs.left || s == this.dirs.right ? o.size = Math.abs(a.x - r.x) : o.size = Math.abs(a.y - r.y), o;
  }, get_direction: function(a, r) {
    return r.x < a.x ? this.dirs.left : r.x > a.x ? this.dirs.right : r.y > a.y ? this.dirs.down : this.dirs.up;
  } }, n = { path: [], clear: function() {
    this.path = [];
  }, current: function() {
    return this.path[this.path.length - 1];
  }, point: function(a) {
    return a ? (this.path.push(t.copy(a)), a) : this.current();
  }, point_to: function(a, r, s) {
    s = s ? { x: s.x, y: s.y } : t.copy(this.point());
    var o = e.dirs;
    switch (a) {
      case o.left:
        s.x -= r;
        break;
      case o.right:
        s.x += r;
        break;
      case o.up:
        s.y -= r;
        break;
      case o.down:
        s.y += r;
    }
    return this.point(s);
  }, get_points: function(a, r, s, o) {
    var l = this.get_endpoint(a, r, s, o), c = t.config, d = l.e_y - l.y, u = l.e_x - l.x, h = e.dirs, _ = r.getItemHeight(a.source);
    this.clear(), this.point({ x: l.x, y: l.y });
    var p = 2 * c.link_arrow_size, y = this.get_line_type(a, r.$getConfig()), k = l.e_x > l.x;
    if (y.from_start && y.to_start) this.point_to(h.left, p), k ? (this.point_to(h.down, d), this.point_to(h.right, u)) : (this.point_to(h.right, u), this.point_to(h.down, d)), this.point_to(h.right, p);
    else if (!y.from_start && y.to_start) if (d !== 0 && (k = l.e_x > l.x + 2 * p), this.point_to(h.right, p), k) u -= p, this.point_to(h.down, d), this.point_to(h.right, u);
    else {
      u -= 2 * p;
      var b = d > 0 ? 1 : -1;
      this.point_to(h.down, b * (_ / 2)), this.point_to(h.right, u), this.point_to(h.down, b * (Math.abs(d) - _ / 2)), this.point_to(h.right, p);
    }
    else y.from_start || y.to_start ? y.from_start && !y.to_start && (d !== 0 && (k = l.e_x > l.x - 2 * p), this.point_to(h.left, p), k ? (u += 2 * p, b = d > 0 ? 1 : -1, this.point_to(h.down, b * (_ / 2)), this.point_to(h.right, u), this.point_to(h.down, b * (Math.abs(d) - _ / 2)), this.point_to(h.left, p)) : (u += p, this.point_to(h.down, d), this.point_to(h.right, u))) : (this.point_to(h.right, p), k ? (this.point_to(h.right, u), this.point_to(h.down, d)) : (this.point_to(h.down, d), this.point_to(h.right, u)), this.point_to(h.left, p));
    return this.path;
  }, get_line_type: function(a, r) {
    var s = r.links, o = !1, l = !1;
    return a.type == s.start_to_start ? o = l = !0 : a.type == s.finish_to_finish ? o = l = !1 : a.type == s.finish_to_start ? (o = !1, l = !0) : a.type == s.start_to_finish ? (o = !0, l = !1) : t.assert(!1, "Invalid link type"), r.rtl && (o = !o, l = !l), { from_start: o, to_start: l };
  }, get_endpoint: function(a, r, s, o) {
    var l = r.$getConfig(), c = this.get_line_type(a, l), d = c.from_start, u = c.to_start, h = i(s, r, l), _ = i(o, r, l);
    return { x: d ? h.left : h.left + h.width, e_x: u ? _.left : _.left + _.width, y: h.top + h.rowHeight / 2 - 1, e_y: _.top + _.rowHeight / 2 - 1 };
  } };
  function i(a, r, s) {
    var o = r.getItemPosition(a);
    let l = function(p, y, k, b) {
      let g = b || y.$task_data.scrollHeight, m = !1, f = !1;
      return p.eachParent(function(v) {
        if ($t(v)) {
          f = !0;
          const x = y.getItemPosition(v).rowHeight;
          x < g && (g = x, m = !0);
        }
      }, k.id), { maxHeight: g, shrinkHeight: m, splitChild: f };
    }(t, r, a), c = l.maxHeight, d = l.splitChild;
    const u = t.config.baselines && (t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow") && a.baselines && a.baselines.length;
    let h;
    l.shrinkHeight && (o.rowHeight = c);
    let _ = t.getTaskType(a.type) == s.types.milestone;
    if (_) {
      let p = r.getBarHeight(a.id, !0);
      h = Math.sqrt(2 * p * p), l.shrinkHeight && c < p && (p = c, h = c), o.left -= h / 2, o.width = h;
    }
    if (d) if (c >= o.height) {
      const p = function(y, k) {
        let b = !1;
        return y.eachTask(function(g) {
          b || (b = hn(y, g));
        }, k), b;
      }(t, a.parent);
      u || p ? _ ? (o.rowHeight = o.height + 4, o.left += (o.width - o.rowHeight + 4) / 2, o.width = o.rowHeight - 3) : o.rowHeight = o.height + 6 : _ && (o.left += (h - o.height) / 2);
    } else o.rowHeight = c + 2, _ && (o.left += (o.width - o.rowHeight + 4) / 2, o.width = o.rowHeight - 3);
    else u && (o.rowHeight = o.height + 4);
    return o;
  }
  return { render: function(a, r, s) {
    var o = t.getTask(a.source);
    if (o.hide_bar) return;
    var l = t.getTask(a.target);
    if (l.hide_bar) return;
    var c = n.get_endpoint(a, r, o, l), d = c.e_y - c.y;
    if (!(c.e_x - c.x) && !d) return null;
    var u = n.get_points(a, r, o, l);
    const h = function(k, b) {
      const g = b.link_radius || 4, m = b.link_arrow_size || 6, f = [];
      for (let x = 0; x < k.length; x++) {
        const $ = k[x], w = k[x + 1];
        if (!w || b.link_radius <= 1) f.push({ type: "line", data: $ });
        else if ($.direction !== w.direction) {
          if ($.size < g || w.size < g) {
            f.push({ type: "line", data: $ });
            continue;
          }
          $.size -= g, f.push({ type: "line", data: $ });
          let S = $.x, T = $.y - b.link_line_width / 2;
          switch ($.direction) {
            case "right":
              S += $.size;
              break;
            case "left":
              S -= $.size;
              break;
            case "down":
              T += $.size;
              break;
            case "up":
              T -= $.size;
          }
          const E = { x: S, y: T, direction: { from: $.direction, to: w.direction }, radius: g };
          switch (f.push({ type: "corner", data: E }), w.direction) {
            case "right":
              w.x += g, w.size -= g;
              break;
            case "left":
              w.x -= g, w.size -= g;
              break;
            case "down":
              w.y += g, w.size -= g;
              break;
            case "up":
              w.y -= g, w.size -= g;
          }
        } else f.push({ type: "line", data: $ });
      }
      const v = k[k.length - 1];
      if (v.direction === "right" || v.direction === "left") {
        v.size -= 3 * m / 4;
        let x = v.direction === "right" ? v.x + v.size : v.x - v.size - m / 2, $ = v.y - b.link_line_width / 2 - m / 2 + 1;
        v.direction === "left" ? ($ -= 1, x -= 2) : x -= 1;
        const w = { x, y: $, size: m, direction: v.direction };
        f.push({ type: "line", data: v }), f.push({ type: "arrow", data: w });
      } else f.push({ type: "line", data: v });
      return f;
    }(e.get_lines(u, r).filter((k) => k.size > 0), s), _ = function(k, b, g, m) {
      const f = document.createElement("div");
      return k.forEach((v) => {
        let x;
        v.type === "line" ? x = e.render_line(v.data, null, b, g.source) : v.type === "corner" ? x = e.render_corner(v.data, b) : v.type === "arrow" && (x = e.render_arrow(v.data, m)), f.appendChild(x);
      }), f;
    }(h, r, a, s);
    var p = "gantt_task_link";
    a.color && (p += " gantt_link_inline_color");
    var y = t.templates.link_class ? t.templates.link_class(a) : "";
    return y && (p += " " + y), s.highlight_critical_path && t.isCriticalLink && t.isCriticalLink(a) && (p += " gantt_critical_link"), _.className = p, r.$config.link_attribute && (_.setAttribute(r.$config.link_attribute, a.id), _.setAttribute("link_id", a.id)), a.color && _.style.setProperty("--dhx-gantt-link-background", a.color), t._waiAria.linkAttr(a, _), _;
  }, update: null, isInViewPort: vn, getVisibleRange: mn() };
}
function Ma(t, e, n, i, a) {
  if (a.$ui.getView("grid") && (a.config.keyboard_navigation && a.getSelectedId() || a.ext.inlineEditors && a.ext.inlineEditors.getState().id)) return !!t.$expanded_branch;
  var r = n.getItemTop(t.id), s = n.getItemHeight(t.id);
  return !(r > e.y_end || r + s < e.y);
}
function Na(t) {
  let e = {};
  return t.$data.tasksStore.attachEvent("onStoreUpdated", function() {
    e = {};
  }), function(n, i, a, r) {
    const s = n.id + "_" + i + "_" + a.unit + "_" + a.step;
    let o;
    return o = e[s] ? e[s] : e[s] = function(l, c, d, u) {
      let h, _ = !1, p = {};
      t.config.process_resource_assignments && c === t.config.resource_property ? (h = l.$role == "task" ? t.getResourceAssignments(l.$resource_id, l.$task_id) : t.getResourceAssignments(l.id), _ = !0) : h = l.$role == "task" ? [] : t.getTaskBy(c, l.id), p = function(w, S, T) {
        const E = S.unit, C = S.step, D = {}, M = {};
        for (let I = 0; I < w.length; I++) {
          const A = w[I];
          let N = A;
          if (T && (N = t.getTask(A.task_id)), N.unscheduled) continue;
          let L = A.start_date || N.start_date, O = A.end_date || N.end_date;
          T && (A.start_date && (L = new Date(Math.max(A.start_date.valueOf(), N.start_date.valueOf()))), A.end_date && (O = new Date(Math.min(A.end_date.valueOf(), N.end_date.valueOf()))), A.mode && A.mode == "fixedDates" && (L = A.start_date, O = A.end_date));
          let G = At(S.trace_x, L.valueOf()), j = new Date(S.trace_x[G] || t.date[E + "_start"](new Date(L))), H = new Date(Math.min(L.valueOf(), j.valueOf())), tt = t.config.work_time ? t.getTaskCalendar(N) : t;
          for (M[tt.id] = {}; H < O; ) {
            const J = M[tt.id], B = H.valueOf();
            H = t.date.add(H, C, E), J[B] !== !1 && (D[B] || (D[B] = { tasks: [], assignments: [] }), D[B].tasks.push(N), T && D[B].assignments.push(A));
          }
        }
        return D;
      }(h, d, _);
      const y = d.unit, k = d.step, b = [];
      let g, m, f, v, x;
      const $ = u.$getConfig();
      for (let w = 0; w < d.trace_x.length; w++) g = new Date(d.trace_x[w]), m = t.date.add(g, k, y), x = p[g.valueOf()] || {}, f = x.tasks || [], v = x.assignments || [], f.length || $.resource_render_empty_cells ? b.push({ start_date: g, end_date: m, tasks: f, assignments: v }) : b.push(null);
      return b;
    }(n, i, a, r), o;
  };
}
const La = { init: function(t, e) {
  var n = t.$services.getService("dnd");
  if (e.$config.bind && t.getDatastore(e.$config.bind)) {
    var i = new n(e.$grid_data, { updates_per_second: 60 });
    t.defined(e.$getConfig().dnd_sensitivity) && (i.config.sensitivity = e.$getConfig().dnd_sensitivity), i.attachEvent("onBeforeDragStart", t.bind(function(o, l) {
      var c = a(l);
      if (!c || (t.hideQuickInfo && t.hideQuickInfo(), dt(l.target, ".gantt_grid_editor_placeholder"))) return !1;
      var d = c.getAttribute(e.$config.item_attribute);
      if (s(d)) return !1;
      var u = r().getItem(d);
      return !t.isReadonly(u) && (i.config.initial_open_state = u.$open, !!t.callEvent("onRowDragStart", [d, l.target || l.srcElement, l]) && void 0);
    }, t)), i.attachEvent("onAfterDragStart", t.bind(function(o, l) {
      var c = a(l);
      i.config.marker.innerHTML = c.outerHTML;
      var d = i.config.marker.firstChild;
      d && (d.style.position = "static"), i.config.id = c.getAttribute(e.$config.item_attribute);
      var u = r(), h = u.getItem(i.config.id);
      i.config.index = u.getBranchIndex(i.config.id), i.config.parent = h.parent, h.$open = !1, h.$transparent = !0, this.refreshData();
    }, t)), i.lastTaskOfLevel = function(o) {
      for (var l = null, c = r().getItems(), d = 0, u = c.length; d < u; d++) c[d].$level == o && (l = c[d]);
      return l ? l.id : null;
    }, i._getGridPos = t.bind(function(o) {
      var l = V(e.$grid_data), c = l.x + e.$grid.scrollLeft, d = o.pos.y - 10, u = e.getItemHeight(i.config.id);
      d < l.y && (d = l.y);
      var h = e.getTotalHeight();
      d > l.y + h - u && (d = l.y + h - u);
      const _ = l.y + l.height;
      return d > _ - u && (d = _ - u), l.x = c, l.y = d, l;
    }, t), i._getTargetY = t.bind(function(o) {
      var l = V(e.$grid_data), c = e.$state.scrollTop || 0, d = t.$grid_data.getBoundingClientRect().height + c, u = o.pageY - l.y + c;
      return u > d ? u = d : u < c && (u = c), u;
    }, t), i._getTaskByY = t.bind(function(o, l) {
      var c = r();
      o = o || 0;
      var d = e.getItemIndexByTopPosition(o);
      return (d = l < d ? d - 1 : d) > c.countVisible() - 1 ? null : c.getIdByIndex(d);
    }, t), i.attachEvent("onDragMove", t.bind(function(o, l) {
      var c = t.$grid_data.getBoundingClientRect(), d = c.height + c.y + (e.$state.scrollTop || 0) + window.scrollY, u = i.config, h = i._getGridPos(l);
      t._waiAria.reorderMarkerAttr(u.marker);
      var _ = e.$getConfig(), p = r();
      h.y < d ? u.marker.style.top = h.y + "px" : u.marker.style.top = d + "px", u.marker.style.left = h.x + 10 + "px";
      const y = V(t.$root);
      h.width > y.width && (u.marker.style.width = y.width - 10 - 2 + "px", u.marker.style.overflow = "hidden");
      var k = p.getItem(i.config.id), b = i._getTargetY(l), g = i._getTaskByY(b, p.getIndexById(k.id));
      function m(D, M) {
        return !p.isChildOf(f.id, M.id) && (D.$level == M.$level || _.order_branch_free);
      }
      if (p.exists(g) || (g = i.lastTaskOfLevel(_.order_branch_free ? k.$level : 0)) == i.config.id && (g = null), p.exists(g)) {
        var f = p.getItem(g), v = e.getItemTop(f.id), x = e.getItemHeight(f.id);
        if (v + x / 2 < b) {
          var $ = p.getIndexById(f.id), w = p.getNext(f.id), S = p.getItem(w);
          if (s(w)) {
            var T = p.getPrev(S.id);
            S = p.getItem(T);
          }
          if (S) {
            if (S.id == k.id) return _.order_branch_free && p.isChildOf(k.id, f.id) && p.getChildren(f.id).length == 1 ? void p.move(k.id, p.getBranchIndex(f.id) + 1, p.getParent(f.id)) : void 0;
            f = S;
          } else if (w = p.getIdByIndex($), S = p.getItem(w), s(w) && (T = p.getPrev(S.id), S = p.getItem(T)), m(S, k) && S.id != k.id) return void p.move(k.id, -1, p.getParent(S.id));
        } else if (_.order_branch_free && f.id != k.id && m(f, k) && !s(f.id)) {
          if (!p.hasChild(f.id)) return f.$open = !0, void p.move(k.id, -1, f.id);
          if (p.getIndexById(f.id) || x / 3 < b) return;
        }
        $ = p.getIndexById(f.id), T = p.getIdByIndex($ - 1);
        for (var E = p.getItem(T), C = 1; (!E || E.id == f.id) && $ - C >= 0; ) T = p.getIdByIndex($ - C), E = p.getItem(T), C++;
        if (k.id == f.id || s(f.id)) return;
        m(f, k) && k.id != f.id ? p.move(k.id, 0, 0, f.id) : f.$level != k.$level - 1 || p.getChildren(f.id).length ? E && m(E, k) && k.id != E.id && p.move(k.id, -1, p.getParent(E.id)) : p.move(k.id, 0, f.id);
      }
      return !0;
    }, t)), i.attachEvent("onDragEnd", t.bind(function() {
      var o = r(), l = o.getItem(i.config.id);
      l.$transparent = !1, l.$open = i.config.initial_open_state, this.callEvent("onBeforeRowDragEnd", [i.config.id, i.config.parent, i.config.index]) === !1 ? (o.move(i.config.id, i.config.index, i.config.parent), l.$drop_target = null) : this.callEvent("onRowDragEnd", [i.config.id, l.$drop_target]), t.render(), this.refreshData();
    }, t));
  }
  function a(o) {
    return nt(o, e.$config.item_attribute);
  }
  function r() {
    return t.getDatastore(e.$config.bind);
  }
  function s(o) {
    return Rt(o, t, r());
  }
} }, K = { createDropTargetObject: function(t) {
  var e = { targetParent: null, targetIndex: 0, targetId: null, child: !1, nextSibling: !1, prevSibling: !1 };
  return t && P(e, t, !0), e;
}, nextSiblingTarget: function(t, e, n) {
  var i = this.createDropTargetObject();
  return i.targetId = e, i.nextSibling = !0, i.targetParent = n.getParent(i.targetId), i.targetIndex = n.getBranchIndex(i.targetId), (n.getParent(t) != i.targetParent || i.targetIndex < n.getBranchIndex(t)) && (i.targetIndex += 1), i;
}, prevSiblingTarget: function(t, e, n) {
  var i = this.createDropTargetObject();
  return i.targetId = e, i.prevSibling = !0, i.targetParent = n.getParent(i.targetId), i.targetIndex = n.getBranchIndex(i.targetId), n.getParent(t) == i.targetParent && i.targetIndex > n.getBranchIndex(t) && (i.targetIndex -= 1), i;
}, firstChildTarget: function(t, e, n) {
  var i = this.createDropTargetObject();
  return i.targetId = e, i.targetParent = i.targetId, i.targetIndex = 0, i.child = !0, i;
}, lastChildTarget: function(t, e, n) {
  var i = n.getChildren(e), a = this.createDropTargetObject();
  return a.targetId = i[i.length - 1], a.targetParent = e, a.targetIndex = i.length, a.nextSibling = !0, a;
} };
function xn(t, e, n, i, a) {
  for (var r = e; i.exists(r); ) {
    var s = i.calculateItemLevel(i.getItem(r));
    if ((s === n || s === n - 1) && i.getBranchIndex(r) > -1) break;
    r = a ? i.getPrev(r) : i.getNext(r);
  }
  return i.exists(r) ? i.calculateItemLevel(i.getItem(r)) === n ? a ? K.nextSiblingTarget(t, r, i) : K.prevSiblingTarget(t, r, i) : K.firstChildTarget(t, r, i) : null;
}
function le(t, e, n, i) {
  return xn(t, e, n, i, !0);
}
function Ge(t, e, n, i) {
  return xn(t, e, n, i, !1);
}
function Ye(t, e, n, i, a, r) {
  var s;
  if (e !== a.$getRootId()) {
    var o = a.getItem(e), l = a.calculateItemLevel(o);
    if (l === r) {
      var c = a.getPrevSibling(e);
      n < 0.5 && !c ? s = K.prevSiblingTarget(t, e, a) : (n < 0.5 && (e = c), s = K.nextSiblingTarget(t, e, a));
    } else if (l > r) a.eachParent(function(p) {
      a.calculateItemLevel(p) === r && (e = p.id);
    }, o), s = le(t, e, r, a);
    else {
      var d = le(t, e, r, a), u = Ge(t, e, r, a);
      s = n < 0.5 ? d : u;
    }
  } else {
    var h = a.$getRootId(), _ = a.getChildren(h);
    s = K.createDropTargetObject(), s = _.length && i >= 0 ? le(t, function(p) {
      for (var y = p.getNext(); p.exists(y); ) {
        var k = p.getNext(y);
        if (!p.exists(k)) return y;
        y = k;
      }
      return null;
    }(a), r, a) : Ge(t, h, r, a);
  }
  return s;
}
function Je(t, e) {
  var n = V(e.$grid_data);
  return t.x += n.x + e.$grid.scrollLeft, t.y += n.y - e.$grid_data.scrollTop, t;
}
function de(t, e, n = 0) {
  const i = V(t.$root);
  return e > i.width && (e = i.width - n - 2), e;
}
const Ke = { removeLineHighlight: function(t) {
  t.markerLine && t.markerLine.parentNode && t.markerLine.parentNode.removeChild(t.markerLine), t.markerLine = null;
}, highlightPosition: function(t, e, n) {
  var i = function(r, s) {
    var o = V(s.$grid_data), l = rt(r, s.$grid_data), c = o.x + s.$grid.scrollLeft, d = l.y - 10, u = s.getItemHeight(r.targetId);
    d < o.y && (d = o.y);
    var h = s.getTotalHeight();
    return d > o.y + h - u && (d = o.y + h - u), o.x = c, o.y = d, o.width = de(s.$gantt, o.width, 9), o;
  }(t, n);
  e.marker.style.left = i.x + 9 + "px", e.marker.style.width = i.width + "px", e.marker.style.overflow = "hidden";
  var a = e.markerLine;
  a || ((a = document.createElement("div")).className = "gantt_drag_marker gantt_grid_dnd_marker", a.innerHTML = "<div class='gantt_grid_dnd_marker_line'></div>", a.style.pointerEvents = "none"), t.child ? function(r, s, o) {
    var l = r.targetParent, c = Je({ x: 0, y: o.getItemTop(l) }, o), d = o.$grid_data.getBoundingClientRect().bottom + window.scrollY;
    let u = de(o.$gantt, o.$grid_data.offsetWidth);
    s.innerHTML = "<div class='gantt_grid_dnd_marker_folder'></div>", s.style.width = u + "px", s.style.top = c.y + "px", s.style.left = c.x + "px", s.style.height = o.getItemHeight(l) + "px", c.y > d && (s.style.top = d + "px");
  }(t, a, n) : function(r, s, o) {
    var l = function(u, h) {
      var _ = h.$config.rowStore, p = { x: 0, y: 0 }, y = h.$grid_data.querySelector(".gantt_tree_indent"), k = 15, b = 0;
      y && (k = y.offsetWidth);
      var g = 40;
      if (u.targetId !== _.$getRootId()) {
        var m = h.getItemTop(u.targetId), f = h.getItemHeight(u.targetId);
        if (b = _.exists(u.targetId) ? _.calculateItemLevel(_.getItem(u.targetId)) : 0, u.prevSibling) p.y = m;
        else if (u.nextSibling) {
          var v = 0;
          _.eachItem(function(x) {
            _.getIndexById(x.id) !== -1 && v++;
          }, u.targetId), p.y = m + f + v * f;
        } else p.y = m + f, b += 1;
      }
      return p.x = g + b * k, p.width = de(h.$gantt, Math.max(h.$grid_data.offsetWidth - p.x, 0), p.x), Je(p, h);
    }(r, o), c = o.$grid_data.getBoundingClientRect().bottom + window.scrollY;
    s.innerHTML = "<div class='gantt_grid_dnd_marker_line'></div>", s.style.left = l.x + "px", s.style.height = "4px";
    var d = l.y - 2;
    s.style.top = d + "px", s.style.width = l.width + "px", d > c && (s.style.top = c + "px");
  }(t, a, n), e.markerLine || (document.body.appendChild(a), e.markerLine = a);
} }, Pa = { init: function(t, e) {
  var n = t.$services.getService("dnd");
  if (e.$config.bind && t.getDatastore(e.$config.bind)) {
    var i = new n(e.$grid_data, { updates_per_second: 60 });
    t.defined(e.$getConfig().dnd_sensitivity) && (i.config.sensitivity = e.$getConfig().dnd_sensitivity), i.attachEvent("onBeforeDragStart", t.bind(function(o, l) {
      var c = a(l);
      if (!c || (t.hideQuickInfo && t.hideQuickInfo(), dt(l.target, ".gantt_grid_editor_placeholder"))) return !1;
      var d = c.getAttribute(e.$config.item_attribute), u = e.$config.rowStore.getItem(d);
      return !t.isReadonly(u) && !r(d) && (i.config.initial_open_state = u.$open, !!t.callEvent("onRowDragStart", [d, l.target || l.srcElement, l]) && void 0);
    }, t)), i.attachEvent("onAfterDragStart", t.bind(function(o, l) {
      var c = a(l);
      i.config.marker.innerHTML = c.outerHTML;
      var d = i.config.marker.firstChild;
      d && (i.config.marker.style.opacity = 0.4, d.style.position = "static", d.style.pointerEvents = "none"), i.config.id = c.getAttribute(e.$config.item_attribute);
      var u = e.$config.rowStore, h = u.getItem(i.config.id);
      i.config.level = u.calculateItemLevel(h), i.config.drop_target = K.createDropTargetObject({ targetParent: u.getParent(h.id), targetIndex: u.getBranchIndex(h.id), targetId: h.id, nextSibling: !0 }), h.$open = !1, h.$transparent = !0, this.refreshData();
    }, t)), i.attachEvent("onDragMove", t.bind(function(o, l) {
      var c = s(l);
      return c && t.callEvent("onBeforeRowDragMove", [i.config.id, c.targetParent, c.targetIndex]) !== !1 || (c = K.createDropTargetObject(i.config.drop_target)), Ke.highlightPosition(c, i.config, e), i.config.drop_target = c, t._waiAria.reorderMarkerAttr(i.config.marker), this.callEvent("onRowDragMove", [i.config.id, c.targetParent, c.targetIndex]), !0;
    }, t)), i.attachEvent("onDragEnd", t.bind(function() {
      var o = e.$config.rowStore, l = o.getItem(i.config.id);
      Ke.removeLineHighlight(i.config), l.$transparent = !1, l.$open = i.config.initial_open_state;
      var c = i.config.drop_target;
      this.callEvent("onBeforeRowDragEnd", [i.config.id, c.targetParent, c.targetIndex]) === !1 ? l.$drop_target = null : (o.move(i.config.id, c.targetIndex, c.targetParent), t.render(), this.callEvent("onRowDragEnd", [i.config.id, c.targetParent, c.targetIndex])), o.refresh(l.id);
    }, t));
  }
  function a(o) {
    return nt(o, e.$config.item_attribute);
  }
  function r(o) {
    return Rt(o, t, t.getDatastore(e.$config.bind));
  }
  function s(o) {
    var l, c = function(p) {
      var y = rt(p, e.$grid_data).y, k = e.$config.rowStore;
      document.doctype || (y += window.scrollY), y = y || 0;
      var b = e.$state.scrollTop || 0, g = t.$grid_data.getBoundingClientRect().height + b + window.scrollY, m = b, f = e.getItemIndexByTopPosition(e.$state.scrollTop);
      if (k.exists(f) || (f = k.countVisible() - 1), f < 0) return k.$getRootId();
      var v = k.getIdByIndex(f), x = e.$state.scrollTop / e.getItemHeight(v), $ = x - Math.floor(x);
      $ > 0.1 && $ < 0.9 && (g -= e.getItemHeight(v) * $, m += e.getItemHeight(v) * (1 - $));
      const w = V(e.$grid_data), S = w.y + w.height, T = i.config.marker.offsetHeight;
      y + T + window.scrollY >= g && (i.config.marker.style.top = S - T + "px"), y >= g ? y = g : y <= m && (y = m, i.config.marker.style.top = w.y + "px");
      var E = e.getItemIndexByTopPosition(y);
      if (E > k.countVisible() - 1 || E < 0) return k.$getRootId();
      var C = k.getIdByIndex(E);
      return r(C) ? k.getPrevSibling(C) : k.getIdByIndex(E);
    }(o), d = null, u = e.$config.rowStore, h = !e.$getConfig().order_branch_free, _ = rt(o, e.$grid_data).y;
    return document.doctype || (_ += window.scrollY), c !== u.$getRootId() && (d = (_ - e.getItemTop(c)) / e.getItemHeight(c)), h ? (l = Ye(i.config.id, c, d, _, u, i.config.level)) && l.targetParent && r(l.targetParent) && (c = u.getPrevSibling(l.targetParent), l = Ye(i.config.id, c, d, _, u, i.config.level)) : l = function(p, y, k, b, g) {
      var m;
      if (y !== g.$getRootId()) m = k < 0.25 ? K.prevSiblingTarget(p, y, g) : !(k > 0.6) || g.hasChild(y) && g.getItem(y).$open ? K.firstChildTarget(p, y, g) : K.nextSiblingTarget(p, y, g);
      else {
        var f = g.$getRootId();
        m = g.hasChild(f) && b >= 0 ? K.lastChildTarget(p, f, g) : K.firstChildTarget(p, f, g);
      }
      return m;
    }(i.config.id, c, d, _, u), l;
  }
} };
var Ra = function(t) {
  return { onCreated: function(e) {
    e.$config = P(e.$config, { bind: "task" }), e.$config.id == "grid" && (this.extendGantt(e), t.ext.inlineEditors = t.ext._inlineEditors.createEditors(e), t.ext.inlineEditors.init()), this._mouseDelegates = Te(t);
  }, onInitialized: function(e) {
    var n = e.$getConfig();
    n.order_branch && (n.order_branch == "marker" ? Pa.init(e.$gantt, e) : La.init(e.$gantt, e)), this.initEvents(e, t), e.$config.id == "grid" && this.extendDom(e);
  }, onDestroyed: function(e) {
    e.$config.id == "grid" && t.ext.inlineEditors.detachStore(), this.clearEvents(e, t);
  }, initEvents: function(e, n) {
    this._mouseDelegates.delegate("click", "gantt_row", n.bind(function(i, a, r) {
      const s = e.$getConfig();
      if (a !== null) {
        const o = this.getTask(a);
        if (s.scroll_on_click) {
          const l = !n._is_icon_open_click(i), c = n.$ui.getView("timeline");
          l && c && this.showDate(o.start_date);
        }
        n.callEvent("onTaskRowClick", [a, r]);
      }
    }, n), e.$grid), this._mouseDelegates.delegate("click", "gantt_grid_head_cell", n.bind(function(i, a, r) {
      var s = r.getAttribute("data-column-id");
      if (n.callEvent("onGridHeaderClick", [s, i])) {
        var o = e.$getConfig();
        if (s != "add") {
          if (o.sort && s) {
            for (var l, c = s, d = 0; d < o.columns.length; d++) if (o.columns[d].name == s) {
              l = o.columns[d];
              break;
            }
            if (l && l.sort !== void 0 && l.sort !== !0 && !(c = l.sort)) return;
            var u = this._sort && this._sort.direction && this._sort.name == s ? this._sort.direction : "desc";
            u = u == "desc" ? "asc" : "desc", this._sort = { name: s, direction: u }, this.sort(c, u == "desc");
          }
        } else n.$services.getService("mouseEvents").callHandler("click", "gantt_add", e.$grid, [i, o.root_id]);
      }
    }, n), e.$grid), this._mouseDelegates.delegate("click", "gantt_add", n.bind(function(i, a, r) {
      if (!e.$getConfig().readonly) return this.createTask({}, a || n.config.root_id), !1;
    }, n), e.$grid);
  }, clearEvents: function(e, n) {
    this._mouseDelegates.destructor(), this._mouseDelegates = null;
  }, extendDom: function(e) {
    t.$grid = e.$grid, t.$grid_scale = e.$grid_scale, t.$grid_data = e.$grid_data;
  }, extendGantt: function(e) {
    t.getGridColumns = t.bind(e.getGridColumns, e), e.attachEvent("onColumnResizeStart", function() {
      return t.callEvent("onColumnResizeStart", arguments);
    }), e.attachEvent("onColumnResize", function() {
      return t.callEvent("onColumnResize", arguments);
    }), e.attachEvent("onColumnResizeEnd", function() {
      return t.callEvent("onColumnResizeEnd", arguments);
    }), e.attachEvent("onColumnResizeComplete", function(n, i) {
      t.config.grid_width = i;
    }), e.attachEvent("onBeforeRowResize", function() {
      return t.callEvent("onBeforeRowResize", arguments);
    }), e.attachEvent("onRowResize", function() {
      return t.callEvent("onRowResize", arguments);
    }), e.attachEvent("onBeforeRowResizeEnd", function() {
      return t.callEvent("onBeforeRowResizeEnd", arguments);
    }), e.attachEvent("onAfterRowResize", function() {
      return t.callEvent("onAfterRowResize", arguments);
    });
  } };
};
const Ha = { createTaskDND: function() {
  var t;
  return { extend: function(e) {
    e.roundTaskDates = function(n) {
      t.round_task_dates(n);
    };
  }, init: function(e, n) {
    return t = function(i, a) {
      var r = a.$services;
      return { drag: null, dragMultiple: {}, _events: { before_start: {}, before_finish: {}, after_finish: {} }, _handlers: {}, init: function() {
        this._domEvents = a._createDomEventScope(), this.clear_drag_state();
        var s = a.config.drag_mode;
        this.set_actions(), r.getService("state").registerProvider("tasksDnd", R(function() {
          return { drag_id: this.drag ? this.drag.id : void 0, drag_mode: this.drag ? this.drag.mode : void 0, drag_from_start: this.drag ? this.drag.left : void 0 };
        }, this));
        var o = { before_start: "onBeforeTaskDrag", before_finish: "onBeforeTaskChanged", after_finish: "onAfterTaskDrag" };
        for (var l in this._events) for (var c in s) this._events[l][c] = o[l];
        this._handlers[s.move] = this._move, this._handlers[s.resize] = this._resize, this._handlers[s.progress] = this._resize_progress;
      }, set_actions: function() {
        var s = i.$task_data;
        this._domEvents.attach(s, "mousemove", a.bind(function(o) {
          this.on_mouse_move(o);
        }, this)), this._domEvents.attach(s, "mousedown", a.bind(function(o) {
          this.on_mouse_down(o);
        }, this)), this._domEvents.attach(document.body, "mouseup", a.bind(function(o) {
          this.on_mouse_up(o);
        }, this));
      }, clear_drag_state: function() {
        this.drag = { id: null, mode: null, pos: null, start_x: null, start_y: null, obj: null, left: null }, this.dragMultiple = {};
      }, _resize: function(s, o, l) {
        var c = i.$getConfig(), d = this._drag_task_coords(s, l);
        l.left ? (s.start_date = a.dateFromPos(d.start + o), s.start_date || (s.start_date = new Date(a.getState().min_date))) : (s.end_date = a.dateFromPos(d.end + o), s.end_date || (s.end_date = new Date(a.getState().max_date)));
        var u = this._calculateMinDuration(c.min_duration, c.duration_unit);
        s.end_date - s.start_date < c.min_duration && (l.left ? s.start_date = a.calculateEndDate(s.end_date, -u, c.duration_unit, s) : s.end_date = a.calculateEndDate(s.start_date, u, c.duration_unit, s)), a._init_task_timing(s);
      }, _calculateMinDuration: function(s, o) {
        return Math.ceil(s / { minute: 6e4, hour: 36e5, day: 864e5, week: 6048e5, month: 24192e5, year: 31356e6 }[o]);
      }, _resize_progress: function(s, o, l) {
        var c = this._drag_task_coords(s, l), d = i.$getConfig().rtl ? c.start - l.pos.x : l.pos.x - c.start, u = Math.max(0, d);
        s.progress = Math.min(1, u / Math.abs(c.end - c.start));
      }, _find_max_shift: function(s, o) {
        var l;
        for (var c in s) {
          var d = s[c], u = a.getTask(d.id);
          if (!u.unscheduled) {
            var h = this._drag_task_coords(u, d), _ = a.posFromDate(new Date(a.getState().min_date)), p = a.posFromDate(new Date(a.getState().max_date));
            if (h.end + o > p) {
              var y = p - h.end;
              (y < l || l === void 0) && (l = y);
            } else if (h.start + o < _) {
              var k = _ - h.start;
              (k > l || l === void 0) && (l = k);
            }
          }
        }
        return l;
      }, _move: function(s, o, l, c) {
        var d = this._drag_task_coords(s, l), u = null, h = null;
        c ? (u = new Date(+l.obj.start_date + c), h = new Date(+l.obj.end_date + c)) : (u = a.dateFromPos(d.start + o), h = a.dateFromPos(d.end + o)), u ? h ? (s.start_date = u, s.end_date = h) : (s.end_date = new Date(a.getState().max_date), s.start_date = a.dateFromPos(a.posFromDate(s.end_date) - (d.end - d.start))) : (s.start_date = new Date(a.getState().min_date), s.end_date = a.dateFromPos(a.posFromDate(s.start_date) + (d.end - d.start)));
      }, _drag_task_coords: function(s, o) {
        return { start: o.obj_s_x = o.obj_s_x || a.posFromDate(s.start_date), end: o.obj_e_x = o.obj_e_x || a.posFromDate(s.end_date) };
      }, _mouse_position_change: function(s, o) {
        var l = s.x - o.x, c = s.y - o.y;
        return Math.sqrt(l * l + c * c);
      }, _is_number: function(s) {
        return !isNaN(parseFloat(s)) && isFinite(s);
      }, on_mouse_move: function(s) {
        if (this.drag.start_drag) {
          var o = rt(s, a.$task_data), l = this.drag.start_drag.start_x, c = this.drag.start_drag.start_y;
          (Date.now() - this.drag.timestamp > 50 || this._is_number(l) && this._is_number(c) && this._mouse_position_change({ x: l, y: c }, o) > 20) && this._start_dnd(s);
        }
        if (this.drag.mode) {
          if (!dn(this, 40)) return;
          this._update_on_move(s);
        }
      }, _update_item_on_move: function(s, o, l, c, d, u) {
        var h = a.getTask(o), _ = a.mixin({}, h), p = a.mixin({}, h);
        this._handlers[l].apply(this, [p, s, c, u]), a.mixin(h, p, !0), a.callEvent("onTaskDrag", [h.id, l, p, _, d]), a.mixin(h, p, !0), a.refreshTask(o);
      }, _update_on_move: function(s) {
        var o = this.drag, l = i.$getConfig();
        if (o.mode) {
          var c = rt(s, i.$task_data);
          if (o.pos && o.pos.x == c.x) return;
          o.pos = c;
          var d = a.dateFromPos(c.x);
          if (!d || isNaN(d.getTime())) return;
          var u = c.x - o.start_x, h = a.getTask(o.id);
          if (this._handlers[o.mode]) {
            if (o.mode === l.drag_mode.move) {
              var _ = {};
              this._isMultiselect() && a.getSelectedTasks().indexOf(o.id) >= 0 && (_ = this.dragMultiple);
              var p = !1;
              if (a.isSummaryTask(h) && a.config.drag_project) {
                var y = {};
                y[o.id] = q(o), p = !0, _ = P(y, this.dragMultiple);
              }
              var k = this._find_max_shift(_, u);
              let m;
              if (k !== void 0 && (u = k), this._update_item_on_move(u, o.id, o.mode, o, s), k === void 0) {
                const f = a.posFromDate(o.obj.start_date), v = a.posFromDate(o.obj.end_date);
                if (o.handle_offset === void 0) {
                  const $ = v - f, w = o.start_x - f;
                  o.handle_offset = w / $;
                }
                let x = f + Math.abs(v - f) * o.handle_offset;
                m = d - a.dateFromPos(x);
              }
              for (var b in _) {
                var g = _[b];
                p && g.id != o.id && (a._bulk_dnd = !0), this._update_item_on_move(u, g.id, g.mode, g, s, m);
              }
              a._bulk_dnd = !1;
            } else this._update_item_on_move(u, o.id, o.mode, o, s);
            a._update_parents(o.id);
          }
        }
      }, on_mouse_down: function(s, o) {
        if (s.button != 2 || s.button === void 0) {
          var l = i.$getConfig(), c = a.locate(s), d = null;
          if (a.isTaskExists(c) && (d = a.getTask(c)), !a.isReadonly(d) && !this.drag.mode) {
            this.clear_drag_state();
            var u = X(o = o || s.target || s.srcElement), h = this._get_drag_mode(u, o);
            if (!u || !h) return o.parentNode ? this.on_mouse_down(s, o.parentNode) : void 0;
            if (h) if (h.mode && h.mode != l.drag_mode.ignore && l["drag_" + h.mode]) {
              if (c = a.locate(o), d = a.copy(a.getTask(c) || {}), a.isReadonly(d)) return this.clear_drag_state(), !1;
              if (a.isSummaryTask(d) && d.auto_scheduling !== !1 && !l.drag_project && h.mode != l.drag_mode.progress) return void this.clear_drag_state();
              h.id = c;
              var _ = rt(s, a.$task_data);
              h.start_x = _.x, h.start_y = _.y, h.obj = d, this.drag.start_drag = h, this.drag.timestamp = Date.now();
            } else this.clear_drag_state();
            else if (a.checkEvent("onMouseDown") && a.callEvent("onMouseDown", [u.split(" ")[0]]) && o.parentNode) return this.on_mouse_down(s, o.parentNode);
          }
        }
      }, _fix_dnd_scale_time: function(s, o) {
        var l = i.$getConfig(), c = a.getScale().unit, d = a.getScale().step;
        function u(h) {
          if (a.config.correct_work_time) {
            var _ = i.$getConfig();
            a.isWorkTime(h.start_date, void 0, h) || (h.start_date = a.calculateEndDate({ start_date: h.start_date, duration: -1, unit: _.duration_unit, task: h }));
          }
        }
        l.round_dnd_dates || (c = "minute", d = l.time_step), o.mode == l.drag_mode.resize ? o.left ? (s.start_date = a.roundDate({ date: s.start_date, unit: c, step: d }), u(s)) : (s.end_date = a.roundDate({ date: s.end_date, unit: c, step: d }), function(h) {
          if (a.config.correct_work_time) {
            var _ = i.$getConfig();
            a.isWorkTime(new Date(h.end_date - 1), void 0, h) || (h.end_date = a.calculateEndDate({ start_date: h.end_date, duration: 1, unit: _.duration_unit, task: h }));
          }
        }(s)) : o.mode == l.drag_mode.move && (s.start_date = a.roundDate({ date: s.start_date, unit: c, step: d }), u(s), s.end_date = a.calculateEndDate(s));
      }, _fix_working_times: function(s, o) {
        var l = i.$getConfig();
        (o = o || { mode: l.drag_mode.move }).mode == l.drag_mode.resize ? o.left ? s.start_date = a.getClosestWorkTime({ date: s.start_date, dir: "future", task: s }) : s.end_date = a.getClosestWorkTime({ date: s.end_date, dir: "past", task: s }) : o.mode == l.drag_mode.move && a.correctTaskWorkTime(s);
      }, _finalize_mouse_up: function(s, o, l, c) {
        var d = a.getTask(s);
        if (o.work_time && o.correct_work_time && this._fix_working_times(d, l), this._fix_dnd_scale_time(d, l), this._fireEvent("before_finish", l.mode, [s, l.mode, a.copy(l.obj), c])) {
          var u = s;
          a._init_task_timing(d), this.clear_drag_state(), a.updateTask(d.id), this._fireEvent("after_finish", l.mode, [u, l.mode, c]);
        } else if (this.clear_drag_state(), s == l.id && (l.obj._dhx_changed = !1, a.mixin(d, l.obj, !0)), a.refreshTask(d.id), d.$level > 100) {
          let h = !1;
          a.eachParent(function(_) {
            if (!h && _.type === a.config.types.project) {
              const p = { start_date: _.start_date, end_date: _.end_date };
              a.resetProjectDates(_), +p.start_date == +_.start_date && +p.end_date == +_.end_date || (h = !0);
            }
          }, d.id), h && a.refreshData();
        } else a.eachParent(function(h) {
          if (h.type === a.config.types.project) {
            const _ = { start_date: h.start_date, end_date: h.end_date };
            a.resetProjectDates(h), +_.start_date == +h.start_date && +_.end_date == +h.end_date || a.refreshTask(h.id);
          }
        }, d.id);
      }, on_mouse_up: function(s) {
        var o = this.drag;
        if (o.mode && o.id) {
          var l = i.$getConfig(), c = a.getTask(o.id), d = this.dragMultiple, u = !1, h = 0;
          o.mode === l.drag_mode.move && (a.isSummaryTask(c) && l.drag_project || this._isMultiselect()) && (u = !0, h = Object.keys(d).length);
          var _ = function() {
            if (u) for (var p in d) d[p].id != o.id && this._finalize_mouse_up(d[p].id, l, d[p], s);
            this._finalize_mouse_up(o.id, l, o, s);
          };
          u && h > 10 ? a.batchUpdate((function() {
            _.call(this);
          }).bind(this)) : _.call(this);
        }
        this.clear_drag_state();
      }, _get_drag_mode: function(s, o) {
        var l = i.$getConfig().drag_mode, c = { mode: null, left: null };
        switch ((s || "").split(" ")[0]) {
          case "gantt_task_line":
          case "gantt_task_content":
            c.mode = l.move;
            break;
          case "gantt_task_drag":
            c.mode = l.resize;
            var d = o.getAttribute("data-bind-property");
            c.left = d == "start_date";
            break;
          case "gantt_task_progress_drag":
            c.mode = l.progress;
            break;
          case "gantt_link_control":
          case "gantt_link_point":
            c.mode = l.ignore;
            break;
          default:
            c = null;
        }
        return c;
      }, _start_dnd: function(s) {
        var o = this.drag = this.drag.start_drag;
        delete o.start_drag;
        var l = i.$getConfig(), c = o.id;
        if (l["drag_" + o.mode] && a.callEvent("onBeforeDrag", [c, o.mode, s]) && this._fireEvent("before_start", o.mode, [c, o.mode, s])) {
          delete o.start_drag;
          var d = a.getTask(c);
          if (a.isReadonly(d)) return void this.clear_drag_state();
          if (this._isMultiselect()) {
            var u = a.getSelectedTasks();
            u.indexOf(o.id) >= 0 && kt(u, a.bind(function(h) {
              var _ = a.getTask(h);
              a.isSummaryTask(_) && a.config.drag_project && o.mode == l.drag_mode.move && this._addSubtasksToDragMultiple(_.id), this.dragMultiple[h] = a.mixin({ id: _.id, obj: a.copy(_) }, this.drag);
            }, this));
          }
          a.isSummaryTask(d) && a.config.drag_project && o.mode == l.drag_mode.move && this._addSubtasksToDragMultiple(d.id), a.callEvent("onTaskDragStart", []);
        } else this.clear_drag_state();
      }, _fireEvent: function(s, o, l) {
        a.assert(this._events[s], "Invalid stage:{" + s + "}");
        var c = this._events[s][o];
        return a.assert(c, "Unknown after drop mode:{" + o + "}"), a.assert(l, "Invalid event arguments"), !a.checkEvent(c) || a.callEvent(c, l);
      }, round_task_dates: function(s) {
        var o = this.drag, l = i.$getConfig();
        o || (o = { mode: l.drag_mode.move }), this._fix_dnd_scale_time(s, o);
      }, destructor: function() {
        this._domEvents.detachAll();
      }, _isMultiselect: function() {
        return a.config.drag_multiple && !!(a.getSelectedTasks && a.getSelectedTasks().length > 0);
      }, _addSubtasksToDragMultiple: function(s) {
        a.eachTask(function(o) {
          this.dragMultiple[o.id] = a.mixin({ id: o.id, obj: a.copy(o) }, this.drag);
        }, s, this);
      } };
    }(e, n), e._tasks_dnd = t, t.init(n);
  }, destructor: function() {
    t && (t.destructor(), t = null);
  } };
} };
var Oa = function(t, e) {
  var n, i, a, r, s;
  function o() {
    return { link_source_id: r, link_target_id: i, link_from_start: s, link_to_start: a, link_landing_area: n };
  }
  var l = e.$services, c = l.getService("state"), d = l.getService("dnd");
  c.registerProvider("linksDnD", o);
  var u = "gantt_link_point", h = "gantt_link_control", _ = new d(t.$task_bars, { sensitivity: 0, updates_per_second: 60, mousemoveContainer: e.$root, selector: "." + u, preventDefault: !0 });
  function p(m, f) {
    var v, x = _.getPosition(m), $ = function(M) {
      var I = 0, A = 0;
      return M && (I = M.offsetWidth || 0, A = M.offsetHeight || 0), { width: I, height: A };
    }(f), w = { right: (v = e.$root).offsetWidth, bottom: v.offsetHeight }, S = e.config.tooltip_offset_x || 10, T = e.config.tooltip_offset_y || 10, E = e.config.scroll_size || 18, C = e.$container.getBoundingClientRect().y + window.scrollY, D = { y: x.y + T, x: x.x + S, bottom: x.y + $.height + T + E, right: x.x + $.width + S + E };
    return D.bottom > w.bottom + C && (D.y = w.bottom + C - $.height - T), D.right > w.right && (D.x = w.right - $.width - S), D;
  }
  function y(m) {
    var f = o();
    f.link_source_id && f.link_target_id && e.isLinkAllowed(f.link_source_id, f.link_target_id, f.link_from_start, f.link_to_start);
    var v = "<div class='" + e.templates.drag_link_class(f.link_source_id, f.link_from_start, f.link_target_id, f.link_to_start) + "'>" + e.templates.drag_link(f.link_source_id, f.link_from_start, f.link_target_id, f.link_to_start) + "</div>";
    m.innerHTML = v;
  }
  function k() {
    r = s = i = null, a = !0;
  }
  function b(m, f, v, x) {
    var $ = function() {
      return _._direction && _._direction.parentNode || (_._direction = document.createElement("div"), t.$task_links.appendChild(_._direction)), _._direction;
    }(), w = o(), S = ["gantt_link_direction"];
    e.templates.link_direction_class && S.push(e.templates.link_direction_class(w.link_source_id, w.link_from_start, w.link_target_id, w.link_to_start));
    var T = Math.sqrt(Math.pow(v - m, 2) + Math.pow(x - f, 2));
    if (T = Math.max(0, T - 3)) {
      $.className = S.join(" ");
      var E = (x - f) / (v - m), C = Math.atan(E);
      g(m, v, f, x) == 2 ? C += Math.PI : g(m, v, f, x) == 3 && (C -= Math.PI);
      var D = Math.sin(C), M = Math.cos(C), I = Math.round(f), A = Math.round(m), N = ["-webkit-transform: rotate(" + C + "rad)", "-moz-transform: rotate(" + C + "rad)", "-ms-transform: rotate(" + C + "rad)", "-o-transform: rotate(" + C + "rad)", "transform: rotate(" + C + "rad)", "width:" + Math.round(T) + "px"];
      if (window.navigator.userAgent.indexOf("MSIE 8.0") != -1) {
        N.push('-ms-filter: "' + function(G, j) {
          return "progid:DXImageTransform.Microsoft.Matrix(M11 = " + j + ",M12 = -" + G + ",M21 = " + G + ",M22 = " + j + ",SizingMethod = 'auto expand')";
        }(D, M) + '"');
        var L = Math.abs(Math.round(m - v)), O = Math.abs(Math.round(x - f));
        switch (g(m, v, f, x)) {
          case 1:
            I -= O;
            break;
          case 2:
            A -= L, I -= O;
            break;
          case 3:
            A -= L;
        }
      }
      N.push("top:" + I + "px"), N.push("left:" + A + "px"), $.style.cssText = N.join(";");
    }
  }
  function g(m, f, v, x) {
    return f >= m ? x <= v ? 1 : 4 : x <= v ? 2 : 3;
  }
  _.attachEvent("onBeforeDragStart", e.bind(function(m, f) {
    var v = f.target || f.srcElement;
    if (k(), e.getState("tasksDnd").drag_id) return !1;
    if (pt(v, u)) {
      pt(v, "task_start_date") && (s = !0);
      var x = e.locate(f);
      r = x;
      var $ = e.getTask(x);
      return e.isReadonly($) ? (k(), !1) : (this._dir_start = { x: _.config.original_element_sizes.x + _.config.original_element_sizes.width / 2, y: _.config.original_element_sizes.y + _.config.original_element_sizes.height / 2 }, !0);
    }
    return !1;
  }, this)), _.attachEvent("onAfterDragStart", e.bind(function(m, f) {
    e.config.touch && e.refreshData(), y(_.config.marker);
  }, this)), _.attachEvent("onDragMove", e.bind(function(m, f) {
    var v = _.config, x = p(f, v.marker);
    (function(M, I) {
      M.style.left = I.x + "px", M.style.top = I.y + "px";
    })(v.marker, x);
    var $ = !!pt(f, h), w = i, S = n, T = a, E = e.locate(f), C = !0;
    if (Y(yt(f), e.$root) || ($ = !1, E = null), $ && (C = !pt(f, "task_end_date"), $ = !!E), i = E, n = $, a = C, $) {
      const M = pt(f, h).querySelector(`.${u}`);
      if (M) {
        const I = en(M, t.$task_bg);
        this._dir_end = { x: I.x + M.offsetWidth / 2, y: I.y + M.offsetHeight / 2 };
      }
    } else this._dir_end = rt(f, t.$task_data), e.env.isEdge && (this._dir_end.y += window.scrollY);
    var D = !(S == $ && w == E && T == C);
    return D && (w && e.refreshTask(w, !1), E && e.refreshTask(E, !1)), D && y(v.marker), b(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y), !0;
  }, this)), _.attachEvent("onDragEnd", e.bind(function() {
    var m = o();
    if (m.link_source_id && m.link_target_id && m.link_source_id != m.link_target_id) {
      var f = e._get_link_type(m.link_from_start, m.link_to_start), v = { source: m.link_source_id, target: m.link_target_id, type: f };
      v.type && e.isLinkAllowed(v) && e.callEvent("onLinkCreated", [v]) && e.addLink(v);
    }
    k(), e.config.touch ? e.refreshData() : (m.link_source_id && e.refreshTask(m.link_source_id, !1), m.link_target_id && e.refreshTask(m.link_target_id, !1)), _._direction && (_._direction.parentNode && _._direction.parentNode.removeChild(_._direction), _._direction = null);
  }, this)), e.attachEvent("onGanttRender", e.bind(function() {
    _._direction && b(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y);
  }, this));
};
const Ba = function() {
  return { init: Oa };
};
var za = function(t) {
  var e = t.$services;
  return { onCreated: function(n) {
    var i = n.$config;
    i.bind = W(i.bind) ? i.bind : "task", i.bindLinks = W(i.bindLinks) ? i.bindLinks : "link", n._linksDnD = Ba(), n._tasksDnD = Ha.createTaskDND(), n._tasksDnD.extend(n), this._mouseDelegates = Te(t);
  }, onInitialized: function(n) {
    this._attachDomEvents(t), this._attachStateProvider(t, n), n._tasksDnD.init(n, t), n._linksDnD.init(n, t), n.$config.id == "timeline" && this.extendDom(n);
  }, onDestroyed: function(n) {
    this._clearDomEvents(t), this._clearStateProvider(t), n._tasksDnD && n._tasksDnD.destructor();
  }, extendDom: function(n) {
    t.$task = n.$task, t.$task_scale = n.$task_scale, t.$task_data = n.$task_data, t.$task_bg = n.$task_bg, t.$task_links = n.$task_links, t.$task_bars = n.$task_bars;
  }, _clearDomEvents: function() {
    this._mouseDelegates.destructor(), this._mouseDelegates = null;
  }, _attachDomEvents: function(n) {
    function i(a, r) {
      if (a && this.callEvent("onLinkDblClick", [a, r])) {
        var s = this.getLink(a);
        if (this.isReadonly(s)) return;
        var o = this.locale.labels.link + " " + this.templates.link_description(this.getLink(a)) + " " + this.locale.labels.confirm_link_deleting;
        window.setTimeout(function() {
          n._delete_link_confirm({ link: s, message: o, title: "", callback: function() {
            n.deleteLink(a);
          } });
        }, this.config.touch ? 300 : 1);
      }
    }
    this._mouseDelegates.delegate("click", "gantt_task_link", n.bind(function(a, r) {
      var s = this.locate(a, this.config.link_attribute);
      s && this.callEvent("onLinkClick", [s, a]);
    }, n), this.$task), this._mouseDelegates.delegate("click", "gantt_scale_cell", n.bind(function(a, r) {
      var s = rt(a, n.$task_data), o = n.dateFromPos(s.x), l = Math.floor(n.columnIndexByDate(o)), c = n.getScale().trace_x[l];
      n.callEvent("onScaleClick", [a, c]);
    }, n), this.$task), this._mouseDelegates.delegate("doubleclick", "gantt_task_link", n.bind(function(a, r, s) {
      r = this.locate(a, n.config.link_attribute), i.call(this, r, a);
    }, n), this.$task), this._mouseDelegates.delegate("doubleclick", "gantt_link_point", n.bind(function(a, r, s) {
      r = this.locate(a);
      var o = this.getTask(r), l = null;
      return s.parentNode && X(s.parentNode) && (l = X(s.parentNode).indexOf("_left") > -1 ? o.$target[0] : o.$source[0]), l && i.call(this, l, a), !1;
    }, n), this.$task);
  }, _attachStateProvider: function(n, i) {
    var a = i;
    e.getService("state").registerProvider("tasksTimeline", function() {
      return { scale_unit: a._tasks ? a._tasks.unit : void 0, scale_step: a._tasks ? a._tasks.step : void 0 };
    });
  }, _clearStateProvider: function() {
    e.getService("state").unregisterProvider("tasksTimeline");
  } };
}, Wa = function(t) {
  return { getVerticalScrollbar: function() {
    return t.$ui.getView("scrollVer");
  }, getHorizontalScrollbar: function() {
    return t.$ui.getView("scrollHor");
  }, _legacyGridResizerClass: function(e) {
    for (var n = e.getCellsByType("resizer"), i = 0; i < n.length; i++) {
      var a = n[i], r = !1, s = a.$parent.getPrevSibling(a.$id);
      if (s && s.$config && s.$config.id === "grid") r = !0;
      else {
        var o = a.$parent.getNextSibling(a.$id);
        o && o.$config && o.$config.id === "grid" && (r = !0);
      }
      r && (a.$config.css = (a.$config.css ? a.$config.css + " " : "") + "gantt_grid_resize_wrap");
    }
  }, onCreated: function(e) {
    var n = !0;
    this._legacyGridResizerClass(e), e.attachEvent("onBeforeResize", function() {
      var i = t.$ui.getView("timeline");
      i && (i.$config.hidden = i.$parent.$config.hidden = !t.config.show_chart);
      var a = t.$ui.getView("grid");
      if (a) {
        var r = a._getColsTotalWidth(), s = !t.config.show_grid || !t.config.grid_width || r === 0;
        if (n && !s && r !== !1 && (t.config.grid_width = r), a.$config.hidden = a.$parent.$config.hidden = s, !a.$config.hidden) {
          var o = a._getGridWidthLimits();
          if (o[0] && t.config.grid_width < o[0] && (t.config.grid_width = o[0]), o[1] && t.config.grid_width > o[1] && (t.config.grid_width = o[1]), i && t.config.show_chart) {
            if (a.$config.width = t.config.grid_width - 1, !a.$config.scrollable && a.$config.scrollY && t.$root.offsetWidth) {
              var l = a.$gantt.$layout.$container.offsetWidth, c = t.$ui.getView(a.$config.scrollY).$config.width, d = l - (a.$config.width + c) - 4;
              d < 0 && (a.$config.width += d, t.config.grid_width += d);
            }
            if (n) a.$parent.$config.width = t.config.grid_width, a.$parent.$config.group && t.$layout._syncCellSizes(a.$parent.$config.group, { value: a.$parent.$config.width, isGravity: !1 });
            else if (i && !Y(i.$task, e.$view)) {
              if (!a.$config.original_grid_width) {
                var u = t.skins[t.skin];
                u && u.config && u.config.grid_width ? a.$config.original_grid_width = u.config.grid_width : a.$config.original_grid_width = 0;
              }
              t.config.grid_width = a.$config.original_grid_width, a.$parent.$config.width = t.config.grid_width;
            } else a.$parent._setContentSize(a.$config.width, null), t.$layout._syncCellSizes(a.$parent.$config.group, { value: t.config.grid_width, isGravity: !1 });
          } else i && Y(i.$task, e.$view) && (a.$config.original_grid_width = t.config.grid_width), n || (a.$parent.$config.width = 0);
        }
        n = !1;
      }
    }), this._initScrollStateEvents(e);
  }, _initScrollStateEvents: function(e) {
    t._getVerticalScrollbar = this.getVerticalScrollbar, t._getHorizontalScrollbar = this.getHorizontalScrollbar;
    var n = this.getVerticalScrollbar(), i = this.getHorizontalScrollbar();
    n && n.attachEvent("onScroll", function(a, r, s) {
      var o = t.getScrollState();
      t.callEvent("onGanttScroll", [o.x, a, o.x, r]);
    }), i && i.attachEvent("onScroll", function(a, r, s) {
      var o = t.getScrollState();
      t.callEvent("onGanttScroll", [a, o.y, r, o.y]);
      var l = t.$ui.getView("grid");
      l && l.$grid_data && !l.$config.scrollable && (l.$grid_data.style.left = l.$grid.scrollLeft + "px", l.$grid_data.scrollLeft = l.$grid.scrollLeft);
    }), e.attachEvent("onResize", function() {
      n && !t.$scroll_ver && (t.$scroll_ver = n.$scroll_ver), i && !t.$scroll_hor && (t.$scroll_hor = i.$scroll_hor);
    });
  }, _findGridResizer: function(e, n) {
    for (var i, a = e.getCellsByType("resizer"), r = !0, s = 0; s < a.length; s++) {
      var o = a[s];
      o._getSiblings();
      var l = o._behind, c = o._front;
      if (l && l.$content === n || l.isChild && l.isChild(n)) {
        i = o, r = !0;
        break;
      }
      if (c && c.$content === n || c.isChild && c.isChild(n)) {
        i = o, r = !1;
        break;
      }
    }
    return { resizer: i, gridFirst: r };
  }, onInitialized: function(e) {
    var n = t.$ui.getView("grid"), i = this._findGridResizer(e, n);
    if (i.resizer) {
      var a, r = i.gridFirst, s = i.resizer;
      if (s.$config.mode !== "x") return;
      s.attachEvent("onResizeStart", function(o, l) {
        var c = t.$ui.getView("grid"), d = c ? c.$parent : null;
        if (d) {
          var u = c._getGridWidthLimits();
          c.$config.scrollable || (d.$config.minWidth = u[0]), d.$config.maxWidth = u[1];
        }
        return a = r ? o : l, t.callEvent("onGridResizeStart", [a]);
      }), s.attachEvent("onResize", function(o, l) {
        var c = r ? o : l;
        return t.callEvent("onGridResize", [a, c]);
      }), s.attachEvent("onResizeEnd", function(o, l, c, d) {
        var u = r ? o : l, h = r ? c : d, _ = t.$ui.getView("grid"), p = _ ? _.$parent : null;
        p && (p.$config.minWidth = void 0);
        var y = t.callEvent("onGridResizeEnd", [u, h]);
        return y && h !== 0 && (t.config.grid_width = h), y;
      });
    }
  }, onDestroyed: function(e) {
  } };
};
const ja = { init: function(t) {
  function e(r, s) {
    var o = s(t);
    o.onCreated && o.onCreated(r), r.attachEvent("onReady", function() {
      o.onInitialized && o.onInitialized(r);
    }), r.attachEvent("onDestroy", function() {
      o.onDestroyed && o.onDestroyed(r);
    });
  }
  var n = la(t);
  n.registerView("cell", Ht), n.registerView("resizer", null), n.registerView("scrollbar", fa), n.registerView("layout", kn, function(r) {
    (r.$config ? r.$config.id : null) === "main" && e(r, Wa);
  }), n.registerView("viewcell", ga), n.registerView("multiview", _a), n.registerView("timeline", Ut, function(r) {
    (r.$config ? r.$config.id : null) !== "timeline" && r.$config.bind != "task" || e(r, za);
  }), n.registerView("grid", xe, function(r) {
    (r.$config ? r.$config.id : null) !== "grid" && r.$config.bind != "task" || e(r, Ra);
  }), n.registerView("resourceGrid", xe), n.registerView("resourceTimeline", Ut), n.registerView("resourceHistogram", Ut);
  var i = function(r) {
    var s = ua(r);
    return { getDataRender: function(o) {
      return r.$services.getService("layer:" + o) || null;
    }, createDataRender: function(o) {
      var l = o.name, c = o.defaultContainer, d = o.defaultContainerSibling, u = s.createGroup(c, d, function(h, _) {
        if (!u.filters) return !0;
        for (var p = 0; p < u.filters.length; p++) if (u.filters[p](h, _) === !1) return !1;
      }, ha);
      return r.$services.setService("layer:" + l, function() {
        return u;
      }), r.attachEvent("onGanttReady", function() {
        u.addLayer();
      }), u;
    }, init: function() {
      var o = this.createDataRender({ name: "task", defaultContainer: function() {
        return r.$task_data ? r.$task_data : r.$ui.getView("timeline") ? r.$ui.getView("timeline").$task_data : void 0;
      }, defaultContainerSibling: function() {
        return r.$task_links ? r.$task_links : r.$ui.getView("timeline") ? r.$ui.getView("timeline").$task_links : void 0;
      }, filter: function(c) {
      } }, r), l = this.createDataRender({ name: "link", defaultContainer: function() {
        return r.$task_data ? r.$task_data : r.$ui.getView("timeline") ? r.$ui.getView("timeline").$task_data : void 0;
      } }, r);
      return { addTaskLayer: function(c) {
        const d = ft;
        return typeof c == "function" ? c = { renderer: { render: c, getVisibleRange: d } } : c.renderer && !c.renderer.getVisibleRange && (c.renderer.getVisibleRange = d), c.view = "timeline", o.addLayer(c);
      }, _getTaskLayers: function() {
        return o.getLayers();
      }, removeTaskLayer: function(c) {
        o.removeLayer(c);
      }, _clearTaskLayers: function() {
        o.clear();
      }, addLinkLayer: function(c) {
        const d = mn();
        return typeof c == "function" ? c = { renderer: { render: c, getVisibleRange: d } } : c.renderer && !c.renderer.getVisibleRange && (c.renderer.getVisibleRange = d), c.view = "timeline", c && c.renderer && (c.renderer.getRectangle || c.renderer.isInViewPort || (c.renderer.isInViewPort = vn)), l.addLayer(c);
      }, _getLinkLayers: function() {
        return l.getLayers();
      }, removeLinkLayer: function(c) {
        l.removeLayer(c);
      }, _clearLinkLayers: function() {
        l.clear();
      } };
    } };
  }(t), a = Da(t);
  return t.ext.inlineEditors = a, t.ext._inlineEditors = a, a.init(t), { factory: n, mouseEvents: ca.init(t), layersApi: i.init(), render: { gridLine: function() {
    return /* @__PURE__ */ function(r) {
      return { render: function(s, o, l, c) {
        for (var d = o.getGridColumns(), u = o.$getTemplates(), h = o.$config.rowStore, _ = [], p = 0; p < d.length; p++) {
          var y, k, b, g = p == d.length - 1, m = d[p];
          m.name == "add" ? (k = "<div " + (S = r._waiAria.gridAddButtonAttrString(m)) + " class='gantt_add'></div>", b = "") : (Q(k = m.template ? m.template(s) : s[m.name]) && (k = u.date_grid(k, s, m.name)), k == null && (k = ""), b = k, k = "<div class='gantt_tree_content'>" + k + "</div>");
          var f = "gantt_cell" + (g ? " gantt_last_cell" : ""), v = [];
          if (m.tree) {
            f += " gantt_cell_tree";
            for (var x = 0; x < s.$level; x++) v.push(u.grid_indent(s));
            !h.hasChild(s.id) || r.isSplitTask(s) && !r.config.open_split_tasks ? (v.push(u.grid_blank(s)), v.push(u.grid_file(s))) : (v.push(u.grid_open(s)), v.push(u.grid_folder(s)));
          }
          var $ = "width:" + (m.width - (g ? 1 : 0)) + "px;";
          if (this.defined(m.align)) {
            var w = { right: "flex-end", left: "flex-start", center: "center" }[m.align];
            $ += "text-align:" + m.align + ";justify-content:" + w + ";";
          }
          var S = r._waiAria.gridCellAttrString(m, b, s);
          v.push(k), y = "<div class='" + f + "' data-column-index='" + p + "' data-column-name='" + m.name + "' style='" + $ + "' " + S + ">" + v.join("") + "</div>", _.push(y);
        }
        switch (f = "", h.$config.name) {
          case "task":
            f = r.getGlobalTaskIndex(s.id) % 2 == 0 ? "" : " odd";
            break;
          case "resource":
            f = h.visibleOrder.indexOf(s.id) % 2 == 0 ? "" : " odd";
        }
        if (f += s.$transparent ? " gantt_transparent" : "", f += s.$dataprocessor_class ? " " + s.$dataprocessor_class : "", u.grid_row_class) {
          var T = u.grid_row_class.call(r, s.start_date, s.end_date, s);
          T && (f += " " + T);
        }
        h.isSelected(s.id) && (f += " gantt_selected");
        var E = document.createElement("div");
        E.className = "gantt_row" + f + " gantt_row_" + r.getTaskType(s.type);
        var C = o.getItemHeight(s.id);
        return E.style.height = C + "px", E.style.lineHeight = C + "px", l.smart_rendering && (E.style.position = "absolute", E.style.left = "0px", E.style.top = o.getItemTop(s.id) + "px"), o.$config.item_attribute && (E.setAttribute(o.$config.item_attribute, s.id), E.setAttribute(o.$config.bind + "_id", s.id)), r._waiAria.taskRowAttr(s, E), E.innerHTML = _.join(""), E;
      }, update: null, getRectangle: Kt, isInViewPort: Ma, getVisibleRange: ft, onrender: function(s, o, l) {
        for (var c = l.getGridColumns(), d = 0; d < c.length; d++) {
          var u = c[d];
          if (u.onrender) {
            var h = o.querySelector(`[data-column-name="${u.name}"]`);
            if (h) {
              var _ = u.onrender(s, h);
              if (_ && typeof _ == "string") h.innerHTML = _;
              else if (_ && typeof _ == "object" && r.config.external_render) {
                var p = r.config.external_render;
                p.isElement(_) && p.renderElement(_, h);
              }
            }
          }
        }
      } };
    }(t);
  }, taskBg: function() {
    return /* @__PURE__ */ function(r) {
      var s = {}, o = {};
      function l(_, p) {
        return !(!s[_.id][p] || !s[_.id][p].parentNode);
      }
      function c(_, p) {
        s[_] && s[_][p] && s[_][p].parentNode && s[_][p].parentNode.removeChild(s[_][p]);
      }
      function d(_) {
        var p, y = _.$getTemplates();
        return y.task_cell_class !== void 0 ? (p = y.task_cell_class, (console.warn || console.log)("gantt.templates.task_cell_class template is deprecated and will be removed soon. Please use gantt.templates.timeline_cell_class instead.")) : p = y.timeline_cell_class, p;
      }
      function u(_) {
        return _.$getTemplates().timeline_cell_content;
      }
      function h(_, p, y, k, b, g, m, f) {
        var v = _.width[p], x = "";
        if (oe(p, _, k, r)) {
          var $ = g(y, _.trace_x[p]), w = "";
          if (m && (w = m(y, _.trace_x[p])), f.static_background) {
            var S = !(!$ && !w);
            if (!f.static_background_cells || !S) return null;
          }
          if (s[y.id][p]) return o[y.id][p] = p, s[y.id][p];
          var T = document.createElement("div");
          return T.style.width = v + "px", x = "gantt_task_cell" + (p == b - 1 ? " gantt_last_cell" : ""), $ && (x += " " + $), T.className = x, w && (T.innerHTML = w), T.style.position = "absolute", T.style.left = _.left[p] + "px", s[y.id][p] = T, o[y.id][p] = p, T;
        }
        return null;
      }
      return { render: function(_, p, y, k) {
        var b = p.$getTemplates(), g = p.getScale(), m = g.count;
        if (y.static_background && !y.static_background_cells) return null;
        var f, v = document.createElement("div"), x = d(p), $ = u(p);
        if (f = k && y.smart_rendering && !Nt(r) ? jt(g, k.x) : { start: 0, end: m - 1 }, y.show_task_cells) {
          s[_.id] = {}, o[_.id] = {};
          for (var w = f.start; w <= f.end; w++) {
            var S = h(g, w, _, k, m, x, $, y);
            S && v.appendChild(S);
          }
        }
        const T = p.$config.rowStore, E = T.getIndexById(_.id) % 2 != 0;
        var C = b.task_row_class(_.start_date, _.end_date, _), D = "gantt_task_row" + (E ? " odd" : "") + (C ? " " + C : "");
        if (T.isSelected(_.id) && (D += " gantt_selected"), v.className = D, y.smart_rendering ? (v.style.position = "absolute", v.style.top = p.getItemTop(_.id) + "px", v.style.width = "100%") : v.style.position = "relative", v.style.height = p.getItemHeight(_.id) + "px", _.id == "timeline_placeholder_task") {
          var M = 0;
          _.lastTaskId && (M = p.getItemTop(_.lastTaskId) + p.getItemHeight(_.lastTaskId));
          var I = (_.row_height || p.$task_data.offsetHeight) - M;
          I < 0 && (I = 0), y.smart_rendering && (v.style.top = M + "px"), v.style.height = I + "px";
        }
        return p.$config.item_attribute && (v.setAttribute(p.$config.item_attribute, _.id), v.setAttribute(p.$config.bind + "_id", _.id)), v;
      }, update: function(_, p, y, k, b) {
        var g = y.getScale(), m = g.count, f = d(y), v = u(y);
        if (k.show_task_cells) {
          s[_.id] || (s[_.id] = {}), o[_.id] || (o[_.id] = {});
          var x = jt(g, b);
          for (var $ in o[_.id]) {
            var w = o[_.id][$];
            (Number(w) < x.start || Number(w) > x.end) && c(_.id, w);
          }
          o[_.id] = {};
          for (var S = x.start; S <= x.end; S++) {
            var T = h(g, S, _, b, m, f, v, k);
            !T && l(_, S) ? c(_.id, S) : T && !T.parentNode && p.appendChild(T);
          }
        }
      }, getRectangle: qe, getVisibleRange: ft, prepareData: Aa };
    }(t);
  }, taskBar: function() {
    return Ue(t);
  }, timedProjectBar: function() {
    return Ue(t);
  }, taskRollupBar: function() {
    return function(r) {
      const s = bn(r), o = {};
      function l(u, h, _, p, y) {
        let k = !0;
        return p.smart_rendering && (k = $e(u, h, _)), k;
      }
      function c(u, h, _, p) {
        const y = r.copy(r.getTask(h.id));
        if (y.$rendered_at = u.id, r.callEvent("onBeforeRollupTaskDisplay", [y.id, y, u.id]) === !1) return;
        const k = s(y, _);
        if (!k) return;
        const b = _.getBarHeight(u.id, h.type == r.config.types.milestone), g = Math.floor((_.getItemHeight(u.id) - b) / 2);
        return k.style.top = p.top + g + "px", k.classList.add("gantt_rollup_child"), k.setAttribute("data-rollup-parent-id", u.id), k;
      }
      function d(u, h) {
        return u + "_" + h;
      }
      return { render: function(u, h, _, p) {
        if (u.rollup !== !1 && u.$rollup && u.$rollup.length) {
          const y = document.createElement("div"), k = r.getTaskPosition(u);
          return p && (p.y = 0, p.y_end = r.$task_bg.scrollHeight), u.$rollup.forEach(function(b) {
            if (!r.isTaskExists(b)) return;
            const g = r.getTask(b);
            if (!l(g, p, h, _)) return;
            const m = c(u, g, h, k);
            m ? (o[d(g.id, u.id)] = m, y.appendChild(m)) : o[d(g.id, u.id)] = !1;
          }), y;
        }
        return !1;
      }, update: function(u, h, _, p, y) {
        const k = document.createElement("div"), b = r.getTaskPosition(u);
        y.y = 0, y.y_end = r.$task_bg.scrollHeight, u.$rollup.forEach(function(g) {
          const m = r.getTask(g), f = d(m.id, u.id);
          let v = l(m, y, _, p);
          if (v !== !!o[f]) if (v) {
            const x = c(u, m, _, b);
            o[f] = x || !1;
          } else o[f] = !1;
          o[f] && k.appendChild(o[f]), h.innerHTML = "", h.appendChild(k);
        });
      }, isInViewPort: $e, getVisibleRange: ft };
    }(t);
  }, taskSplitBar: function() {
    return Ct();
  }, taskConstraints: function() {
    return Ct();
  }, taskDeadline: function() {
    return Ct();
  }, taskBaselines: function() {
    return Ct();
  }, link: function() {
    return Ia(t);
  }, resourceRow: function() {
    return function(r) {
      var s = Na(r), o = {};
      function l(d, u, h, _, p) {
        var y = h.resource_cell_class(u.start_date, u.end_date, d, u.tasks, u.assignments), k = h.resource_cell_value(u.start_date, u.end_date, d, u.tasks, u.assignments), b = p.getItemHeight(d.id) - 1;
        if (y || k) {
          var g = p.getItemPosition(d, u.start_date, u.end_date), m = document.createElement("div");
          return m.setAttribute(p.$config.item_attribute, d.id), m.className = ["gantt_resource_marker", y].join(" "), m.style.cssText = ["left:" + g.left + "px", "width:" + g.width + "px", "height:" + b + "px", "line-height:" + b + "px", "top:" + g.top + "px"].join(";"), k && (m.innerHTML = k), m;
        }
        return null;
      }
      function c(d, u) {
        o[d] && o[d][u] && o[d][u].parentNode && o[d][u].parentNode.removeChild(o[d][u]);
      }
      return { render: function(d, u, h, _) {
        var p = u.$getTemplates(), y = u.getScale(), k = s(d, h.resource_property, u.getScale(), u), b = !!_, g = [];
        o[d.id] = {};
        for (var m = jt(y, _), f = m.start; f <= m.end; f++) {
          var v = k[f];
          if (v && (!b || oe(f, y, _, r))) {
            var x = l(d, v, p, 0, u);
            x && (g.push(x), o[d.id][f] = x);
          }
        }
        var $ = null;
        if (g.length) {
          $ = document.createElement("div");
          for (var w = 0; w < g.length; w++) $.appendChild(g[w]);
        }
        return $;
      }, update: function(d, u, h, _, p) {
        var y = h.$getTemplates(), k = h.getScale(), b = s(d, _.resource_property, h.getScale(), h), g = jt(k, p), m = {};
        if (o && o[d.id]) for (var f in o[d.id]) m[f] = f;
        for (var v = g.start; v <= g.end; v++) {
          var x = b[v];
          if (m[v] = !1, x) if (oe(v, k, p, r)) if (o[d.id] && o[d.id][v]) o[d.id] && o[d.id][v] && !o[d.id][v].parentNode && u.appendChild(o[d.id][v]);
          else {
            var $ = l(d, x, y, 0, h);
            $ && (u.appendChild($), o[d.id][v] = $);
          }
          else c(d.id, v);
        }
        for (var f in m) m[f] !== !1 && c(d.id, f);
      }, getRectangle: qe, getVisibleRange: ft };
    }(t);
  }, resourceHistogram: function() {
    return Ct();
  }, gridTaskRowResizer: function() {
    return /* @__PURE__ */ function(r) {
      return { render: function(s, o, l) {
        var c = o.$getConfig(), d = document.createElement("div");
        return d.className = "gantt_task_grid_row_resize_wrap", d.style.top = o.getItemTop(s.id) + o.getItemHeight(s.id) + "px", d.innerHTML = "<div class='gantt_task_grid_row_resize' role='cell'></div>", d.setAttribute(c.task_grid_row_resizer_attribute, s.id), r._waiAria.rowResizerAttr(d), d;
      }, update: null, getRectangle: Kt, getVisibleRange: ft };
    }(t);
  } }, layersService: { getDataRender: function(r) {
    return i.getDataRender(r, t);
  }, createDataRender: function(r) {
    return i.createDataRender(r, t);
  } } };
} };
function ce(t, e) {
  const n = getComputedStyle(e.$root).getPropertyValue("--dhx-gantt-theme");
  let i, a = !!n;
  if (a) i = n;
  else {
    var r = e.skin;
    if (i = r, !r || t) for (var s = document.getElementsByTagName("link"), o = 0; o < s.length; o++) {
      var l = s[o].href.match("dhtmlxgantt_([a-z_]+).css");
      if (l && (e.skins[l[1]] || !r)) {
        i = l[1];
        break;
      }
    }
  }
  e._theme_info = { theme: i, cssVarTheme: a }, e.skin = i || "terrace";
  var c = e.skins[e.skin] || e.skins.terrace;
  (function(h, _, p) {
    for (var y in _) (h[y] === void 0 || p) && (h[y] = _[y]);
  })(e.config, c.config, t), a || (e.config.link_radius = 1);
  var d = e.getGridColumns();
  for (d[1] && !e.defined(d[1].width) && (d[1].width = c._second_column_width), d[2] && !e.defined(d[2].width) && (d[2].width = c._third_column_width), o = 0; o < d.length; o++) {
    var u = d[o];
    u.name == "add" && (u.width || (u.width = 44), e.defined(u.min_width) && e.defined(u.max_width) || (u.min_width = u.min_width || u.width, u.max_width = u.max_width || u.width), u.min_width && (u.min_width = +u.min_width), u.max_width && (u.max_width = +u.max_width), u.width && (u.width = +u.width, u.width = u.min_width && u.min_width > u.width ? u.min_width : u.width, u.width = u.max_width && u.max_width < u.width ? u.max_width : u.width));
  }
  c.config.task_height && (e.config.task_height = c.config.task_height || "full"), c.config.bar_height && (e.config.bar_height = c.config.bar_height || "full"), c._lightbox_template && (e._lightbox_template = c._lightbox_template), c._redefine_lightbox_buttons && (e.config.buttons_right = c._redefine_lightbox_buttons.buttons_right, e.config.buttons_left = c._redefine_lightbox_buttons.buttons_left), e.resetLightbox();
}
function Fa(t) {
  var e = null, n = !1, i = null, a = { started: !1 }, r = {};
  function s(_) {
    return _ && Y(_, t.$root) && _.offsetHeight;
  }
  function o() {
    var _ = !!document.querySelector(".gantt_drag_marker"), p = !!document.querySelector(".gantt_drag_marker.gantt_grid_resize_area") || !!document.querySelector(".gantt_drag_marker.gantt_row_grid_resize_area"), y = !!document.querySelector(".gantt_link_direction"), k = t.getState(), b = k.autoscroll;
    return n = _ && !p && !y, !(!k.drag_mode && !_ || p) || b;
  }
  function l(_) {
    if (i && (clearTimeout(i), i = null), _) {
      var p = t.config.autoscroll_speed;
      p && p < 10 && (p = 10), i = setTimeout(function() {
        e = setInterval(u, p || 50);
      }, t.config.autoscroll_delay || 10);
    }
  }
  function c(_) {
    _ ? (l(!0), a.started || (a.x = r.x, a.y = r.y, a.started = !0)) : (e && (clearInterval(e), e = null), l(!1), a.started = !1);
  }
  function d(_) {
    var p = o();
    if (!e && !i || p || c(!1), !t.config.autoscroll || !p) return !1;
    r = { x: _.clientX, y: _.clientY }, _.type == "touchmove" && (r.x = _.targetTouches[0].clientX, r.y = _.targetTouches[0].clientY), !e && p && c(!0);
  }
  function u() {
    if (!o()) return c(!1), !1;
    var _ = s(t.$task) ? t.$task : s(t.$grid) ? t.$grid : t.$root;
    if (_) {
      var p = !1;
      [".gantt_drag_marker.gantt_grid_resize_area", ".gantt_drag_marker .gantt_row.gantt_row_task", ".gantt_drag_marker.gantt_grid_dnd_marker"].forEach(function(C) {
        p = p || !!document.querySelector(C);
      }), p && (_ = t.$grid);
      var y = V(_), k = r.x - y.x, b = r.y - y.y + window.scrollY, g = n ? 0 : h(k, y.width, a.x - y.x), m = h(b, y.height, a.y - y.y + window.scrollY), f = t.getScrollState(), v = f.y, x = f.inner_height, $ = f.height, w = f.x, S = f.inner_width, T = f.width;
      (m && !x || m < 0 && !v || m > 0 && v + x >= $ + 2) && (m = 0), (g && !S || g < 0 && !w || g > 0 && w + S >= T) && (g = 0);
      var E = t.config.autoscroll_step;
      E && E < 2 && (E = 2), m *= E || 30, ((g *= E || 30) || m) && function(C, D) {
        var M = t.getScrollState(), I = null, A = null;
        C && (I = M.x + C, I = Math.min(M.width, I), I = Math.max(0, I)), D && (A = M.y + D, A = Math.min(M.height, A), A = Math.max(0, A)), t.scrollTo(I, A);
      }(g, m);
    }
  }
  function h(_, p, y) {
    return _ - 50 < 0 && _ < y ? -1 : _ > p - 50 && _ > y ? 1 : 0;
  }
  t.attachEvent("onGanttReady", function() {
    if (!F(t)) {
      var _ = vt(t.$root) || document.body;
      t.eventRemove(_, "mousemove", d), t.event(_, "mousemove", d), t.eventRemove(_, "touchmove", d), t.event(_, "touchmove", d), t.eventRemove(_, "pointermove", d), t.event(_, "pointermove", d);
    }
  }), t.attachEvent("onDestroy", function() {
    c(!1);
  });
}
var ue, he;
typeof window < "u" && window.jQuery && (ue = window.jQuery, he = [], ue.fn.dhx_gantt = function(t) {
  if (typeof (t = t || {}) != "string") {
    var e = [];
    return this.each(function() {
      if (this && this.getAttribute) if (this.gantt || window.gantt.$root == this) e.push(typeof this.gantt == "object" ? this.gantt : window.gantt);
      else {
        var n = window.gantt.$container && window.Gantt ? window.Gantt.getGanttInstance() : window.gantt;
        for (var i in t) i != "data" && (n.config[i] = t[i]);
        n.init(this), t.data && n.parse(t.data), e.push(n);
      }
    }), e.length === 1 ? e[0] : e;
  }
  if (he[t]) return he[t].apply(this, []);
  ue.error("Method " + t + " does not exist on jQuery.dhx_gantt");
});
typeof window < "u" && window.dhtmlx && (window.dhtmlx.attaches || (window.dhtmlx.attaches = {}), window.dhtmlx.attaches.attachGantt = function(t, e, n) {
  var i = document.createElement("DIV");
  n = n || window.gantt, i.id = "gantt_" + n.uid(), i.style.width = "100%", i.style.height = "100%", i.cmp = "grid", document.body.appendChild(i), this.attachObject(i.id), this.dataType = "gantt", this.dataObj = n;
  var a = this.vs[this.av];
  return a.grid = n, n.init(i.id, t, e), i.firstChild.style.border = "none", a.gridId = i.id, a.gridObj = i, this.vs[this._viewRestore()].grid;
}), typeof window < "u" && window.dhtmlXCellObject !== void 0 && (window.dhtmlXCellObject.prototype.attachGantt = function(t, e, n) {
  n = n || window.gantt;
  var i = document.createElement("DIV");
  return i.id = "gantt_" + n.uid(), i.style.width = "100%", i.style.height = "100%", i.cmp = "grid", document.body.appendChild(i), this.attachObject(i.id), this.dataType = "gantt", this.dataObj = n, n.init(i.id, t, e), i.firstChild.style.border = "none", i = null, this.callEvent("_onContentAttach", []), this.dataObj;
});
const Va = ["ctrlKey", "altKey", "shiftKey", "metaKey"], Ua = [[{ unit: "month", date: "%M", step: 1 }, { unit: "day", date: "%d", step: 1 }], [{ unit: "day", date: "%d %M", step: 1 }], [{ unit: "day", date: "%d %M", step: 1 }, { unit: "hour", date: "%H:00", step: 8 }], [{ unit: "day", date: "%d %M", step: 1 }, { unit: "hour", date: "%H:00", step: 1 }]];
class qa {
  constructor(e) {
    this.zoomIn = () => {
      const n = this.getCurrentLevel() - 1;
      n < 0 || this.setLevel(n);
    }, this.zoomOut = () => {
      const n = this.getCurrentLevel() + 1;
      n > this._levels.length - 1 || this.setLevel(n);
    }, this.getCurrentLevel = () => this._activeLevelIndex, this.getLevels = () => this._levels, this.setLevel = (n) => {
      const i = this._getZoomIndexByName(n);
      i === -1 && this.$gantt.assert(i !== -1, "Invalid zoom level for gantt.ext.zoom.setLevel. " + n + " is not an expected value."), this._setLevel(i, 0);
    }, this._getZoomIndexByName = (n) => {
      let i = -1;
      if (typeof n == "string") {
        if (!isNaN(Number(n)) && this._levels[Number(n)]) i = Number(n);
        else for (let a = 0; a < this._levels.length; a++) if (this._levels[a].name === n) {
          i = a;
          break;
        }
      } else i = n;
      return i;
    }, this._getVisibleDate = () => {
      if (!this.$gantt.$task) return null;
      const n = this.$gantt.getScrollState().x, i = this.$gantt.$task.offsetWidth;
      this._visibleDate = this.$gantt.dateFromPos(n + i / 2);
    }, this._setLevel = (n, i) => {
      this._activeLevelIndex = n;
      const a = this.$gantt, r = a.copy(this._levels[this._activeLevelIndex]), s = a.copy(r);
      if (delete s.name, a.mixin(a.config, s, !0), ["resourceTimeline", "resourceHistogram"].forEach(function(o) {
        const l = a.$ui.getView(o);
        if (l) {
          const c = l.$getConfig();
          c.fixed_scales || a.mixin(c, s, !0);
        }
      }), a.$root && a.$task) {
        if (i) {
          const o = this.$gantt.dateFromPos(i + this.$gantt.getScrollState().x);
          this.$gantt.render();
          const l = this.$gantt.posFromDate(o);
          this.$gantt.scrollTo(l - i);
        } else {
          const o = this.$gantt.$task.offsetWidth;
          this._visibleDate || this._getVisibleDate();
          const l = this._visibleDate;
          this.$gantt.render();
          const c = this.$gantt.posFromDate(l);
          this.$gantt.scrollTo(c - o / 2);
        }
        this.callEvent("onAfterZoom", [this._activeLevelIndex, r]);
      }
    }, this._attachWheelEvent = (n) => {
      const i = mt.isFF ? "wheel" : "mousewheel";
      let a;
      a = typeof n.element == "function" ? n.element() : n.element, a && this._domEvents.attach(a, i, this.$gantt.bind(function(r) {
        if (this._useKey && (Va.indexOf(this._useKey) < 0 || !r[this._useKey]))
          return !1;
        if (typeof this._handler == "function") return this._handler.apply(this, [r]), !0;
      }, this), { passive: !1 });
    }, this._defaultHandler = (n) => {
      const i = this.$gantt.$task.getBoundingClientRect().x, a = n.clientX - i;
      let r = !1;
      (this.$gantt.env.isFF ? -40 * n.deltaY : n.wheelDelta) > 0 && (r = !0), n.preventDefault(), n.stopPropagation(), this._setScaleSettings(r, a);
    }, this._setScaleDates = () => {
      this._initialStartDate && this._initialEndDate && (this.$gantt.config.start_date = this._initialStartDate, this.$gantt.config.end_date = this._initialEndDate);
    }, this.$gantt = e, this._domEvents = this.$gantt._createDomEventScope();
  }
  init(e) {
    this.$gantt.env.isNode || (this._initialStartDate = e.startDate, this._initialEndDate = e.endDate, this._activeLevelIndex = e.activeLevelIndex ? e.activeLevelIndex : 0, this._levels = this._mapScales(e.levels || Ua), this._handler = e.handler || this._defaultHandler, this._minColumnWidth = e.minColumnWidth || 60, this._maxColumnWidth = e.maxColumnWidth || 240, this._widthStep = e.widthStep || 3 / 8 * e.minColumnWidth, this._useKey = e.useKey, this._initialized || (ot(this), this.$gantt.attachEvent("onGanttScroll", () => {
      this._getVisibleDate();
    })), this._domEvents.detachAll(), e.trigger === "wheel" && (this.$gantt.$root ? this._attachWheelEvent(e) : this.$gantt.attachEvent("onGanttLayoutReady", () => {
      this.$gantt.attachEvent("onGanttRender", () => {
        this._attachWheelEvent(e);
      }, { once: !0 });
    })), this._initialized = !0, this.setLevel(this._activeLevelIndex));
  }
  _mapScales(e) {
    return e.map((n) => Array.isArray(n) ? { scales: n } : n);
  }
  _setScaleSettings(e, n) {
    e ? this._stepUp(n) : this._stepDown(n);
  }
  _stepUp(e) {
    if (this._activeLevelIndex >= this._levels.length - 1) return;
    let n = this._activeLevelIndex;
    if (this._setScaleDates(), this._widthStep) {
      let i = this.$gantt.config.min_column_width + this._widthStep;
      i > this._maxColumnWidth && (i = this._minColumnWidth, n++), this.$gantt.config.min_column_width = i;
    } else n++;
    this._setLevel(n, e);
  }
  _stepDown(e) {
    if (this._activeLevelIndex < 1) return;
    let n = this._activeLevelIndex;
    if (this._setScaleDates(), this._widthStep) {
      let i = this.$gantt.config.min_column_width - this._widthStep;
      i < this._minColumnWidth && (i = this._maxColumnWidth, n--), this.$gantt.config.min_column_width = i;
    } else n--;
    this._setLevel(n, e);
  }
}
function Ga(t) {
  function e() {
    if (t.config.touch != "force" && (t.config.touch = t.config.touch && (navigator.userAgent.indexOf("Mobile") != -1 || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("Android") != -1 || navigator.userAgent.indexOf("Touch") != -1) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1), t.config.touch) {
      var r = !0;
      try {
        document.createEvent("TouchEvent");
      } catch {
        r = !1;
      }
      r ? t._touch_events(["touchmove", "touchstart", "touchend"], function(s) {
        return s.touches && s.touches.length > 1 ? null : s.touches[0] ? { target: s.target, pageX: s.touches[0].pageX, pageY: s.touches[0].pageY, clientX: s.touches[0].clientX, clientY: s.touches[0].clientY } : s;
      }, function(s) {
        return s.defaultPrevented;
      }) : window.navigator.pointerEnabled ? t._touch_events(["pointermove", "pointerdown", "pointerup"], function(s) {
        return s.pointerType == "mouse" ? null : s;
      }, function(s) {
        return !s || s.pointerType == "mouse";
      }) : window.navigator.msPointerEnabled && t._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function(s) {
        return s.pointerType == s.MSPOINTER_TYPE_MOUSE ? null : s;
      }, function(s) {
        return !s || s.pointerType == s.MSPOINTER_TYPE_MOUSE;
      });
    }
  }
  function n(r) {
    var s = r.$config.scrollX ? t.$ui.getView(r.$config.scrollX) : null, o = r.$config.scrollY ? t.$ui.getView(r.$config.scrollY) : null, l = { x: null, y: null };
    return s && s.getScrollState().visible && (l.x = s.$view.scrollLeft), o && o.getScrollState().visible && (l.y = o.$view.scrollTop), l;
  }
  function i() {
    var r;
    return t.$ui.getView("timeline") && (r = t.$ui.getView("timeline")._tasks_dnd), r;
  }
  t.config.touch_drag = 75, t.config.touch = !0, t.config.touch_feedback = !0, t.config.touch_feedback_duration = 1, t._prevent_touch_scroll = !1, t._touch_feedback = function() {
    t.config.touch_feedback && navigator.vibrate && navigator.vibrate(t.config.touch_feedback_duration);
  }, t.attachEvent("onGanttReady", function() {
    t.$container && e();
  }), t.attachEvent("onGanttLayoutReady", function() {
    t.$container && t.attachEvent("onGanttRender", e, { once: !0 });
  });
  var a = [];
  t._touch_events = function(r, s, o) {
    var l, c = 0, d = !1, u = !1, h = null, _ = null, p = null, y = [], k = null;
    let b = {};
    for (var g = 0; g < a.length; g++) t.eventRemove(a[g][0], a[g][1], a[g][2]);
    (a = []).push([t.$container, r[0], function(f) {
      var v = i();
      if (!o(f) && d) {
        _ && clearTimeout(_);
        var x = s(f);
        if (v && (v.drag.id || v.drag.start_drag)) return v.on_mouse_move(x), f.preventDefault && f.preventDefault(), f.cancelBubble = !0, !1;
        if (!t._prevent_touch_scroll) {
          if (x && h) {
            var $ = h.pageX - x.pageX, w = h.pageY - x.pageY;
            if (!u && (Math.abs($) > 5 || Math.abs(w) > 5) && (u = !0, c = 0, l = k ? n(k) : t.getScrollState()), u) {
              var S, T = l.x + $, E = l.y + w;
              if (k ? (function(C, D, M) {
                var I = C.$config.scrollX ? t.$ui.getView(C.$config.scrollX) : null, A = C.$config.scrollY ? t.$ui.getView(C.$config.scrollY) : null;
                I && I.scrollTo(D, null), A && A.scrollTo(null, M);
              }(k, T, E), S = n(k)) : (t.scrollTo(T, E), S = t.getScrollState()), l.x != S.x && w > 2 * $ || l.y != S.y && $ > 2 * w) return m(f);
            }
          }
          return m(f);
        }
        return !0;
      }
    }]);
    try {
      document.addEventListener("touchmove", function(f) {
        t._touch_drag && m(f);
      }, { passive: !1 });
    } catch {
      console.warn("Cannot prevent touch event for the page drag");
    }
    for (a.push([this.$container, "contextmenu", function(f) {
      if (d) return m(f);
    }]), a.push([this.$container, r[1], function(f) {
      if (b = f.touches.length, document && document.body && document.body.classList.add("gantt_touch_active"), !o(f)) if (f.touches && f.touches.length > 1) d = !1;
      else {
        h = s(f), k = function(x) {
          for (var $ = t.$layout.getCellsByType("viewCell"), w = 0; w < $.length; w++) {
            var S = $[w].$view.getBoundingClientRect();
            if (x.clientX >= S.left && x.clientX <= S.right && x.clientY <= S.bottom && x.clientY >= S.top) return $[w];
          }
        }(h), t._locate_css(h, "gantt_hor_scroll") || t._locate_css(h, "gantt_ver_scroll") || (d = !0);
        var v = i();
        _ = setTimeout(function() {
          var x = t.locate(h);
          v && x && !t._locate_css(h, "gantt_link_control") && !t._locate_css(h, "gantt_grid_data") && (v.on_mouse_down(h), v.drag && v.drag.start_drag && (function($) {
            const w = t._getTaskLayers();
            let S = t.getTask($);
            if (S) {
              let T = t.isTaskVisible($);
              if (T) {
                p = $;
                for (let E = 0; E < w.length; E++) if (S = w[E].rendered[$], S && S.getAttribute(t.config.task_attribute) && S.getAttribute(t.config.task_attribute) == $) {
                  const C = S.cloneNode(!0);
                  y.push(S), w[E].rendered[$] = C, S.style.display = "none", C.className += " gantt_drag_move ", S.parentNode.appendChild(C);
                }
              } else if (S.$split_subtask) {
                let E = S.$rendered_parent;
                if (T = t.isTaskVisible(E), !T) return;
                p = $;
                for (let C = 0; C < w.length; C++) {
                  const D = w[C].rendered[E];
                  let M;
                  if (D && D.childNodes && (M = D.querySelector(`[${t.config.task_attribute}="${S.id}"]`)), M) {
                    const I = M.cloneNode(!0);
                    M.parentNode.appendChild(I), t.$task_bars.appendChild(M), M.style.display = "none", y.push(M), M = null;
                  }
                }
              }
            }
          }(x), v._start_dnd(h), t._touch_drag = !0, t.refreshTask(x), t._touch_feedback())), _ = null;
        }, t.config.touch_drag);
      }
    }]), a.push([this.$container, r[2], function(f) {
      if (document && document.body && document.body.classList.remove("gantt_touch_active"), !o(f)) {
        _ && clearTimeout(_), t._touch_drag = !1, d = !1;
        var v = s(f), x = i();
        if (x && x.on_mouse_up(v), p && t.isTaskExists(p) && (t.refreshTask(p), y.length && (y.forEach(function(w) {
          w.parentNode && w.parentNode.removeChild(w);
        }), t._touch_feedback())), d = u = !1, y = [], p = null, h && c) {
          var $ = /* @__PURE__ */ new Date();
          $ - c < 500 && b <= 1 ? (t.$services.getService("mouseEvents").onDoubleClick(h), m(f)) : c = $;
        } else c = /* @__PURE__ */ new Date();
      }
    }]), g = 0; g < a.length; g++) t.event(a[g][0], a[g][1], a[g][2]);
    function m(f) {
      return f && f.preventDefault && f.cancelable && f.preventDefault(), f.cancelBubble = !0, !1;
    }
  };
}
function Ft() {
  console.log("Method is not implemented.");
}
function Mt() {
}
function ht(t) {
  return Mt;
}
Mt.prototype.render = Ft, Mt.prototype.set_value = Ft, Mt.prototype.get_value = Ft, Mt.prototype.focus = Ft;
var $n = { getHtmlSelect: function(t, e, n) {
  var i = "", a = this;
  return kt(t = t || [], function(r) {
    var s = [{ key: "value", value: r.key }];
    n == r.key && (s[s.length] = { key: "selected", value: "selected" }), r.attributes && (s = s.concat(r.attributes)), i += a.getHtmlOption({ innerHTML: r.label }, s);
  }), Dt("select", { innerHTML: i }, e);
}, getHtmlOption: function(t, e) {
  return Dt("option", t, e);
}, getHtmlButton: function(t, e) {
  return Dt("button", t, e);
}, getHtmlDiv: function(t, e) {
  return Dt("div", t, e);
}, getHtmlLabel: function(t, e) {
  return Dt("label", t, e);
}, getHtmlInput: function(t) {
  return "<input" + wn(t || []) + ">";
} };
function Dt(t, e, n) {
  return e = e || [], "<" + t + wn(n || []) + ">" + (e.innerHTML || "") + "</" + t + ">";
}
function wn(t) {
  var e = "";
  return kt(t, function(n) {
    e += " " + n.key + "='" + n.value + "'";
  }), e;
}
function qt(t) {
  const e = ht();
  function n() {
    return e.apply(this, arguments) || this;
  }
  return z(n, e), n.prototype.render = function(i) {
    const a = i.height ? `height:${i.height}px;` : "";
    let r = `<div class='gantt_cal_ltext gantt_section_${i.name}' ${a ? `style='${a}'` : ""}>`;
    return r += $n.getHtmlSelect(i.options, [{ key: "style", value: "width:100%;" }, { key: "title", value: i.name }]), r += "</div>", r;
  }, n.prototype.set_value = function(i, a, r, s) {
    var o = i.firstChild;
    !o._dhx_onchange && s.onchange && (o.onchange = s.onchange, o._dhx_onchange = !0), a === void 0 && (a = (o.options[0] || {}).value), o.value = a || "";
  }, n.prototype.get_value = function(i) {
    return i.firstChild.value;
  }, n.prototype.focus = function(i) {
    var a = i.firstChild;
    t._focus(a, !0);
  }, n;
}
function Ya(t) {
  var e = qt(t);
  function n() {
    return e.apply(this, arguments) || this;
  }
  function i(a, r) {
    var s = [], o = [];
    r && (s = t.getTaskByTime(), a.allow_root && s.unshift({ id: t.config.root_id, text: a.root_label || "" }), s = function(u, h, _) {
      var p = h.filter || function() {
        return !0;
      };
      u = u.slice(0);
      for (var y = 0; y < u.length; y++) {
        var k = u[y];
        (k.id == _ || t.isChildOf(k.id, _) || p(k.id, k) === !1) && (u.splice(y, 1), y--);
      }
      return u;
    }(s, a, r), a.sort && s.sort(a.sort));
    for (var l = a.template || t.templates.task_text, c = 0; c < s.length; c++) {
      var d = l.apply(t, [s[c].start_date, s[c].end_date, s[c]]);
      d === void 0 && (d = ""), o.push({ key: s[c].id, label: d });
    }
    return a.options = o, a.map_to = a.map_to || "parent", t.form_blocks.select.render.apply(this, arguments);
  }
  return z(n, e), n.prototype.render = function(a) {
    return i(a, !1);
  }, n.prototype.set_value = function(a, r, s, o) {
    r === 0 && (r = "0"), !s.id && t.getState().lightbox && (s.id = t.getLightboxValues().id);
    var l = document.createElement("div");
    l.innerHTML = i(o, s.id);
    var c = l.removeChild(l.firstChild);
    return a.onselect = null, a.parentNode.replaceChild(c, a), t.form_blocks.select.set_value.apply(t, [c, r, s, o]);
  }, n;
}
function Ja(t) {
  var e = function() {
    const g = ht();
    function m() {
      return g.apply(this, arguments) || this;
    }
    return z(m, g), m.prototype.render = function(f) {
      let v = f.height ? `${f.height}px` : "";
      return `<div class='gantt_cal_ltext gantt_cal_template gantt_section_${f.name}' ${v ? `style='height:${v};'` : ""}></div>`;
    }, m.prototype.set_value = function(f, v) {
      f.innerHTML = v || "";
    }, m.prototype.get_value = function(f) {
      return f.innerHTML || "";
    }, m.prototype.focus = function() {
    }, m;
  }(), n = function(g) {
    const m = ht();
    function f() {
      return m.apply(this, arguments) || this;
    }
    return z(f, m), f.prototype.render = function(v) {
      const x = (v.height || "130") + "px", $ = v.placeholder ? `placeholder='${v.placeholder}'` : "";
      return `<div class='gantt_cal_ltext gantt_section_${v.name}' style='height:${x};' ${$}><textarea></textarea></div>`;
    }, f.prototype.set_value = function(v, x) {
      g.form_blocks.textarea._get_input(v).value = x || "";
    }, f.prototype.get_value = function(v) {
      return g.form_blocks.textarea._get_input(v).value;
    }, f.prototype.focus = function(v) {
      var x = g.form_blocks.textarea._get_input(v);
      g._focus(x, !0);
    }, f.prototype._get_input = function(v) {
      return v.querySelector("textarea");
    }, f;
  }(t), i = function(g) {
    const m = ht();
    function f() {
      return m.apply(this, arguments) || this;
    }
    return z(f, m), f.prototype.render = function(v) {
      var x = g.form_blocks.getTimePicker.call(this, v);
      let $ = "gantt_section_time";
      v.name !== "time" && ($ += " gantt_section_" + v.name);
      var w = "<div style='padding-top:0px;font-size:inherit;text-align:center;' class='" + $ + "'>";
      return w += x, v.single_date ? (x = g.form_blocks.getTimePicker.call(this, v, !0), w += "<span></span>") : w += "<span class='gantt_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>", (w += x) + "</div>";
    }, f.prototype.set_value = function(v, x, $, w) {
      var S = w, T = v.getElementsByTagName("select"), E = w._time_format_order;
      if (S.auto_end_date) for (var C = function() {
        I = new Date(T[E[2]].value, T[E[1]].value, T[E[0]].value, 0, 0), A = g.calculateEndDate({ start_date: I, duration: 1, task: $ }), g.form_blocks._fill_lightbox_select(T, E.size, A, E, S);
      }, D = 0; D < 4; D++) T[D].onchange = C;
      var M = g._resolve_default_mapping(w);
      typeof M == "string" && (M = { start_date: M });
      var I = $[M.start_date] || /* @__PURE__ */ new Date(), A = $[M.end_date] || g.calculateEndDate({ start_date: I, duration: 1, task: $ });
      g.form_blocks._fill_lightbox_select(T, 0, I, E, S), g.form_blocks._fill_lightbox_select(T, E.size, A, E, S);
    }, f.prototype.get_value = function(v, x, $) {
      var w, S = v.getElementsByTagName("select"), T = $._time_format_order;
      return w = g.form_blocks.getTimePickerValue(S, $), typeof g._resolve_default_mapping($) == "string" ? w : { start_date: w, end_date: function(E, C, D) {
        var M = g.form_blocks.getTimePickerValue(E, $, C.size);
        return M <= D && ($.autofix_end !== !1 || $.single_date) ? g.date.add(D, g._get_timepicker_step(), "minute") : M;
      }(S, T, w) };
    }, f.prototype.focus = function(v) {
      g._focus(v.getElementsByTagName("select")[0]);
    }, f;
  }(t), a = qt(t), r = function(g) {
    var m = ht();
    function f() {
      return m.apply(this, arguments) || this;
    }
    return z(f, m), f.prototype.render = function(v) {
      const x = v.height ? `height:${v.height}px;` : "";
      let $ = `<div class='gantt_cal_ltext gantt_cal_lcheckbox gantt_section_${v.name}' ${x ? `style='${x}'` : ""}>`;
      if (v.options && v.options.length) for (var w = 0; w < v.options.length; w++) $ += "<label><input type='checkbox' value='" + v.options[w].key + "' name='" + v.name + "'>" + v.options[w].label + "</label>";
      else v.single_value = !0, $ += "<label><input type='checkbox' name='" + v.name + "'></label>";
      return $ += "</div>", $;
    }, f.prototype.set_value = function(v, x, $, w) {
      var S = Array.prototype.slice.call(v.querySelectorAll("input[type=checkbox]"));
      !v._dhx_onchange && w.onchange && (v.onchange = w.onchange, v._dhx_onchange = !0), w.single_value ? S[0].checked = !!x : kt(S, function(T) {
        T.checked = !!x && x.indexOf(T.value) >= 0;
      });
    }, f.prototype.get_value = function(v, x, $) {
      return $.single_value ? v.querySelector("input[type=checkbox]").checked : function(w, S) {
        if (w.map) return w.map(S);
        for (var T = w.slice(), E = [], C = 0; C < T.length; C++) E.push(S(T[C], C));
        return E;
      }(Array.prototype.slice.call(v.querySelectorAll("input[type=checkbox]:checked")), function(w) {
        return w.value;
      });
    }, f.prototype.focus = function(v) {
      g._focus(v.querySelector("input[type=checkbox]"));
    }, f;
  }(t), s = function(g) {
    const m = ht();
    function f() {
      return m.apply(this, arguments) || this;
    }
    return z(f, m), f.prototype.render = function(v) {
      const x = v.height ? `${v.height}px` : "";
      let $ = `<div class='gantt_cal_ltext gantt_cal_lradio gantt_section_${v.name}' ${x ? `style='height:${x};'` : ""}>`;
      if (v.options && v.options.length) for (var w = 0; w < v.options.length; w++) $ += "<label><input type='radio' value='" + v.options[w].key + "' name='" + v.name + "'>" + v.options[w].label + "</label>";
      return $ += "</div>", $;
    }, f.prototype.set_value = function(v, x, $, w) {
      var S;
      w.options && w.options.length && (S = v.querySelector("input[type=radio][value='" + x + "']") || v.querySelector("input[type=radio][value='" + w.default_value + "']")) && (!v._dhx_onchange && w.onchange && (v.onchange = w.onchange, v._dhx_onchange = !0), S.checked = !0);
    }, f.prototype.get_value = function(v, x) {
      var $ = v.querySelector("input[type=radio]:checked");
      return $ ? $.value : "";
    }, f.prototype.focus = function(v) {
      g._focus(v.querySelector("input[type=radio]"));
    }, f;
  }(t), o = function(g) {
    var m = ht();
    function f() {
      return m.apply(this, arguments) || this;
    }
    function v(w) {
      return w.formatter || new Pt();
    }
    function x(w, S) {
      var T = w.getElementsByTagName("select"), E = S._time_format_order, C = 0, D = 0;
      if (g.defined(E[3])) {
        var M = T[E[3]], I = parseInt(M.value, 10);
        isNaN(I) && M.hasAttribute("data-value") && (I = parseInt(M.getAttribute("data-value"), 10)), C = Math.floor(I / 60), D = I % 60;
      }
      return new Date(T[E[2]].value, T[E[1]].value, T[E[0]].value, C, D);
    }
    function $(w, S) {
      var T = w.getElementsByTagName("input")[1];
      return (T = v(S).parse(T.value)) && !window.isNaN(T) || (T = 1), T < 0 && (T *= -1), T;
    }
    return z(f, m), f.prototype.render = function(w) {
      var S = "<div class='gantt_time_selects'>" + g.form_blocks.getTimePicker.call(this, w) + "</div>", T = " " + g.locale.labels[g.config.duration_unit + "s"] + " ", E = w.single_date ? " style='display:none'" : "", C = w.readonly ? " disabled='disabled'" : "", D = g._waiAria.lightboxDurationInputAttrString(w), M = "gantt_duration_value";
      w.formatter && (T = "", M += " gantt_duration_value_formatted");
      var I = "<div class='gantt_duration' " + E + "><div class='gantt_duration_inputs'><input type='button' class='gantt_duration_dec' value='−'" + C + "><input type='text' value='5days' class='" + M + "'" + C + " " + D + "><input type='button' class='gantt_duration_inc' value='+'" + C + "></div><div class='gantt_duration_end_date'>" + T + "<span></span></div></div></div>";
      let A = "gantt_section_time gantt_section_duration";
      return w.name !== "time" && (A += " gantt_section_" + w.name), "<div style='padding-top:0px;font-size:inherit;' class='" + A + "'>" + S + " " + I + "</div>";
    }, f.prototype.set_value = function(w, S, T, E) {
      var C, D, M, I, A = w.getElementsByTagName("select"), N = w.getElementsByTagName("input"), L = N[1], O = [N[0], N[2]], G = w.getElementsByTagName("span")[0], j = E._time_format_order;
      function H() {
        var J = x.call(g, w, E), B = $.call(g, w, E), _t = g.calculateEndDate({ start_date: J, duration: B, task: T }), Tt = g.templates.task_end_date || g.templates.task_date;
        G.innerHTML = Tt(_t);
      }
      function tt(J) {
        var B = L.value;
        B = v(E).parse(B), window.isNaN(B) && (B = 0), (B += J) < 1 && (B = 1), L.value = v(E).format(B), H();
      }
      O[0].onclick = g.bind(function() {
        tt(-1 * g.config.duration_step);
      }, this), O[1].onclick = g.bind(function() {
        tt(1 * g.config.duration_step);
      }, this), A[0].onchange = H, A[1].onchange = H, A[2].onchange = H, A[3] && (A[3].onchange = H), L.onkeydown = g.bind(function(J) {
        var B;
        return (B = (J = J || window.event).charCode || J.keyCode || J.which) == g.constants.KEY_CODES.DOWN ? (tt(-1 * g.config.duration_step), !1) : B == g.constants.KEY_CODES.UP ? (tt(1 * g.config.duration_step), !1) : void window.setTimeout(H, 1);
      }, this), L.onchange = g.bind(H, this), typeof (C = g._resolve_default_mapping(E)) == "string" && (C = { start_date: C }), D = T[C.start_date] || /* @__PURE__ */ new Date(), M = T[C.end_date] || g.calculateEndDate({ start_date: D, duration: 1, task: T }), I = Math.round(T[C.duration]) || g.calculateDuration({ start_date: D, end_date: M, task: T }), I = v(E).format(I), g.form_blocks._fill_lightbox_select(A, 0, D, j, E), L.value = I, H();
    }, f.prototype.get_value = function(w, S, T) {
      var E = x(w, T), C = $(w, T), D = g.calculateEndDate({ start_date: E, duration: C, task: S });
      return typeof g._resolve_default_mapping(T) == "string" ? E : { start_date: E, end_date: D, duration: C };
    }, f.prototype.focus = function(w) {
      g._focus(w.getElementsByTagName("select")[0]);
    }, f;
  }(t), l = Ya(t), c = qt(t), d = function(g) {
    var m = ht();
    function f() {
      return m.apply(this, arguments) || this;
    }
    function v($) {
      return !$ || $ === g.config.constraint_types.ASAP || $ === g.config.constraint_types.ALAP;
    }
    function x($, w) {
      for (var S = v(w), T = 0; T < $.length; T++) $[T].disabled = S;
    }
    return z(f, m), f.prototype.render = function($) {
      const w = $.height ? `height:${$.height}px;` : "";
      let S = `<div class='gantt_cal_ltext gantt_section_${$.name}' ${w ? `style='${w}'` : ""}>`;
      var T = [];
      for (var E in g.config.constraint_types) T.push({ key: g.config.constraint_types[E], label: g.locale.labels[g.config.constraint_types[E]] });
      return $.options = $.options || T, S += "<span data-constraint-type-select>" + $n.getHtmlSelect($.options, [{ key: "data-type", value: "constraint-type" }]) + "</span>", S += "<label data-constraint-time-select>" + (g.locale.labels.constraint_date || "Constraint date") + ": " + g.form_blocks.getTimePicker.call(this, $) + "</label>", S += "</div>", S;
    }, f.prototype.set_value = function($, w, S, T) {
      var E = $.querySelector("[data-constraint-type-select] select"), C = $.querySelectorAll("[data-constraint-time-select] select"), D = T._time_format_order, M = g._resolve_default_mapping(T);
      E._eventsInitialized || (E.addEventListener("change", function(N) {
        x(C, N.target.value);
      }), E._eventsInitialized = !0);
      var I = S[M.constraint_date] || /* @__PURE__ */ new Date();
      g.form_blocks._fill_lightbox_select(C, 0, I, D, T);
      var A = S[M.constraint_type] || g.getConstraintType(S);
      E.value = A, x(C, A);
    }, f.prototype.get_value = function($, w, S) {
      var T = $.querySelector("[data-constraint-type-select] select"), E = $.querySelectorAll("[data-constraint-time-select] select"), C = T.value, D = null;
      return v(C) || (D = g.form_blocks.getTimePickerValue(E, S)), { constraint_type: C, constraint_date: D };
    }, f.prototype.focus = function($) {
      g._focus($.querySelector("select"));
    }, f;
  }(t), u = function(g) {
    const m = qt(g);
    function f() {
      return m.apply(this, arguments) || this;
    }
    return z(f, m), f.prototype.render = function(v) {
      var x = g.config.types, $ = g.locale.labels, w = [], S = v.filter || function(C, D) {
        return !x.placeholder || D !== x.placeholder;
      };
      for (var T in x) !S(T, x[T]) == 0 && w.push({ key: x[T], label: $["type_" + T] });
      v.options = w;
      var E = v.onchange;
      return v.onchange = function() {
        g._lightbox_current_type = this.value, g.changeLightboxType(this.value), typeof E == "function" && E.apply(this, arguments);
      }, m.prototype.render.apply(this, arguments);
    }, f;
  }(t), h = function(g) {
    var m = ht();
    function f() {
      return m.apply(this, arguments) || this;
    }
    function v(S) {
      return S.formatter || new Pt();
    }
    function x(S, T, E, C) {
      const D = "<div class='gantt_time_selects'>" + g.form_blocks.getTimePicker.call(g, C) + "</div>";
      let M = " " + g.locale.labels[g.config.duration_unit + "s"] + " ";
      const I = C.single_date ? " style='display:none'" : "", A = C.readonly ? " disabled='disabled'" : "", N = g._waiAria.lightboxDurationInputAttrString(C), L = g.locale.labels.baselines_remove_button;
      let O = "gantt_duration_value";
      C.formatter && (M = "", O += " gantt_duration_value_formatted");
      const G = "<div class='gantt_duration' " + I + "><div class='gantt_duration_inputs'><input type='button' class='gantt_duration_dec' value='−'" + A + "><input type='text' value='5days' class='" + O + "'" + A + " " + N + "><input type='button' class='gantt_duration_inc' value='+'" + A + "></div><div class='gantt_duration_end_date'>" + M + "<span></span></div></div></div>", j = `<div><div class='baseline_delete_button gantt_custom_button'>${L}</div></div>`, H = document.createElement("div");
      H.className = "gantt_section_time gantt_section_duration", H.setAttribute("data-baseline-id", T.id), H.innerHTML = D + G + j + "<br>", S.appendChild(H);
      var tt, J, B, _t = H.getElementsByTagName("select"), Tt = H.getElementsByTagName("input"), Et = Tt[1], Ee = [Tt[0], Tt[2]], Sn = H.getElementsByTagName("span")[0], Tn = C._time_format_order;
      function gt() {
        var ct = $.call(g, H, C), U = w.call(g, H, C), En = g.calculateEndDate({ start_date: ct, duration: U, task: E }), Cn = g.templates.task_end_date || g.templates.task_date;
        Sn.innerHTML = Cn(En);
      }
      function Ot(ct) {
        var U = Et.value;
        U = v(C).parse(U), window.isNaN(U) && (U = 0), (U += ct) < 1 && (U = 1), Et.value = v(C).format(U), gt();
      }
      H.querySelector(".baseline_delete_button").onclick = function(ct) {
        const U = H.parentNode;
        H.innerHTML = "", H.remove(), U.innerHTML === "" && (U.innerHTML = g.locale.labels.baselines_section_placeholder);
      }, Ee[0].onclick = g.bind(function() {
        Ot(-1 * g.config.duration_step);
      }, g), Ee[1].onclick = g.bind(function() {
        Ot(1 * g.config.duration_step);
      }, g), _t[0].onchange = gt, _t[1].onchange = gt, _t[2].onchange = gt, _t[3] && (_t[3].onchange = gt), Et.onkeydown = g.bind(function(ct) {
        var U;
        return (U = (ct = ct || window.event).charCode || ct.keyCode || ct.which) == g.constants.KEY_CODES.DOWN ? (Ot(-1 * g.config.duration_step), !1) : U == g.constants.KEY_CODES.UP ? (Ot(1 * g.config.duration_step), !1) : void window.setTimeout(gt, 1);
      }, g), Et.onchange = g.bind(gt, g), g._resolve_default_mapping(C), tt = T.start_date || /* @__PURE__ */ new Date(), J = T.end_date || g.calculateEndDate({ start_date: tt, duration: 1, task: E }), B = g.calculateDuration({ start_date: tt, end_date: J, task: E }), B = v(C).format(B), g.form_blocks._fill_lightbox_select(_t, 0, tt, Tn, C), Et.value = B, gt();
    }
    function $(S, T) {
      var E = S.getElementsByTagName("select"), C = T._time_format_order, D = 0, M = 0;
      if (g.defined(C[3])) {
        var I = E[C[3]], A = parseInt(I.value, 10);
        isNaN(A) && I.hasAttribute("data-value") && (A = parseInt(I.getAttribute("data-value"), 10)), D = Math.floor(A / 60), M = A % 60;
      }
      return new Date(E[C[2]].value, E[C[1]].value, E[C[0]].value, D, M);
    }
    function w(S, T) {
      var E = S.getElementsByTagName("input")[1];
      return (E = v(T).parse(E.value)) && !window.isNaN(E) || (E = 1), E < 0 && (E *= -1), E;
    }
    return z(f, m), f.prototype.render = function(S) {
      return `<div style='height: ${S.height || 100}px; padding-top:0px; font-size:inherit;' class='gantt_section_baselines'></div>`;
    }, f.prototype.set_value = function(S, T, E, C) {
      E.baselines ? (S.innerHTML = "", E.baselines.forEach((D) => {
        x(S, D, E, C);
      })) : S.innerHTML = g.locale.labels.baselines_section_placeholder;
    }, f.prototype.get_value = function(S, T, E) {
      const C = [];
      return S.querySelectorAll("[data-baseline-id]").forEach((D) => {
        const M = D.dataset.baselineId;
        let I, A = g.getDatastore("baselines").getItem(M);
        I = A ? g.copy(A) : { id: g.uid(), task_id: T.id, text: "Baseline 1" }, I.start_date = $(D, E), I.duration = w(D, E), I.end_date = g.calculateEndDate({ start_date: I.start_date, duration: I.duration, task: T }), C.push(I);
      }), C;
    }, f.prototype.button_click = function(S, T, E, C) {
      if (g.callEvent("onSectionButton", [g._lightbox_id, E]) !== !1 && (T.closest(".gantt_custom_button.gantt_remove_baselines") && (C.innerHTML = g.locale.labels.baselines_section_placeholder), T.closest(".gantt_custom_button.gantt_add_baselines"))) {
        C.innerHTML == g.locale.labels.baselines_section_placeholder && (C.innerHTML = "");
        const D = g.getTask(g._lightbox_id);
        x(C, { id: g.uid(), task_id: D.id, start_date: D.start_date, end_date: D.end_date }, D, g._get_typed_lightbox_config()[S]);
      }
    }, f.prototype.focus = function(S) {
      g._focus(S.getElementsByTagName("select")[0]);
    }, f;
  }(t);
  t._lightbox_methods = {}, t._lightbox_template = "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span></div><div class='gantt_cal_larea'></div>", t._lightbox_template = `<div class='gantt_cal_ltitle'><div class="dhx_cal_ltitle_descr"><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='dhx_title'></span>
</div>
<div class="gantt_cal_ltitle_controls">
	<a class="gantt_cal_ltitle_close_btn dhx_gantt_icon dhx_gantt_icon_close"></a>

</div></div><div class='gantt_cal_larea'></div>`, t._lightbox_root = t.$root, t.$services.getService("state").registerProvider("lightbox", function() {
    return { lightbox: t._lightbox_id };
  }), t.showLightbox = function(g) {
    var m = this.getTask(g);
    if (this.callEvent("onBeforeLightbox", [g])) {
      var f = this.getLightbox(this.getTaskType(m.type));
      this.showCover(f), this._fill_lightbox(g, f), this._setLbPosition(f), this._waiAria.lightboxVisibleAttr(f), this.callEvent("onLightbox", [g]);
    } else t.isTaskExists(g) && t.getTask(g).$new && this.$data.tasksStore._updateOrder();
  }, t._get_timepicker_step = function() {
    if (this.config.round_dnd_dates) {
      var g;
      if (function(f) {
        var v = f.$ui.getView("timeline");
        return !(!v || !v.isVisible());
      }(this)) {
        var m = t.getScale();
        g = Vt(m.unit) * m.step / 60;
      }
      return (!g || g >= 1440) && (g = this.config.time_step), g;
    }
    return this.config.time_step;
  }, t.getLabel = function(g, m) {
    for (var f = this._get_typed_lightbox_config(), v = 0; v < f.length; v++) if (f[v].map_to == g) {
      for (var x = f[v].options, $ = 0; $ < x.length; $++) if (x[$].key == m) return x[$].label;
    }
    return "";
  }, t.updateCollection = function(g, m) {
    m = m.slice(0);
    var f = t.serverList(g);
    if (!f) return !1;
    f.splice(0, f.length), f.push.apply(f, m || []), t.resetLightbox();
  }, t.getLightboxType = function() {
    return this.getTaskType(this._lightbox_type);
  }, t.getLightbox = function(g) {
    var m, f, v, x, $, w = "";
    if (t.config.csp === !0 || t.env.isSalesforce ? t._lightbox_root = t.$root : t._lightbox_root = document.body, g === void 0 && (g = this.getLightboxType()), !this._lightbox || this.getLightboxType() != this.getTaskType(g)) {
      this._lightbox_type = this.getTaskType(g), m = document.createElement("div"), w = "gantt_cal_light", f = this._is_lightbox_timepicker(), t.config.wide_form && (w += " gantt_cal_light_wide"), f && (w += " gantt_cal_light_full"), m.className = w, m.style.visibility = "hidden", v = this._lightbox_template, v += "<div class='gantt_cal_lcontrols'>", v += y(this.config.buttons_left), v += "<div class='gantt_cal_lcontrols_push_right'></div>", v += y(this.config.buttons_right), v += "</div>", m.innerHTML = v, t._waiAria.lightboxAttr(m), t.config.drag_lightbox && (m.firstChild.onmousedown = t._ready_to_dnd, m.firstChild.ontouchstart = function(T) {
        t._ready_to_dnd(T.touches[0]);
      }, m.firstChild.onselectstart = function() {
        return !1;
      }, m.firstChild.style.cursor = "pointer", t._init_dnd_events()), this._lightbox && this.resetLightbox(), _(), this._cover.insertBefore(m, this._cover.firstChild), this._lightbox = m, x = this._get_typed_lightbox_config(g), v = this._render_sections(x);
      var S = ($ = m.querySelector("div.gantt_cal_larea")).style.overflow;
      $.style.overflow = "hidden", $.innerHTML = v, function(T) {
        var E, C, D, M, I, A;
        for (A = 0; A < T.length; A++) E = T[A], D = t._lightbox_root.querySelector("#" + E.id), E.id && D && (C = D.querySelector("label"), (M = D.nextSibling) && (I = M.querySelector("input, select, textarea")) && (I.id = I.id || "input_" + t.uid(), E.inputId = I.id, C.setAttribute("for", E.inputId)));
      }(x), $.style.overflow = S, this._init_lightbox_events(this), m.style.display = "none", m.style.visibility = "visible";
    }
    return this._lightbox;
  }, t._render_sections = function(g) {
    for (var m = "", f = 0; f < g.length; f++) {
      var v = this.form_blocks[g[f].type];
      if (v) {
        g[f].id = "area_" + this.uid();
        var x = g[f].hidden ? " style='display:none'" : "", $ = "";
        g[f].button && ($ = "<div class='gantt_custom_button' data-index='" + f + "'><div class='gantt_custom_button_" + g[f].button + "'></div><div class='gantt_custom_button_label'>" + this.locale.labels["button_" + g[f].button] + "</div></div>"), g[f].type == "baselines" && ($ = "<div class='gantt_custom_button gantt_remove_baselines' data-index='" + f + "'><div class='gantt_custom_button_delete_baselines'></div><div class='gantt_custom_button_label'>" + this.locale.labels.baselines_remove_all_button + "</div></div><div class='gantt_custom_button gantt_add_baselines' data-index='" + f + "'><div class='gantt_custom_button_add_baseline'></div><div class='gantt_custom_button_label'>" + this.locale.labels.baselines_add_button + "</div></div>"), this.config.wide_form && (m += "<div class='gantt_wrap_section' " + x + ">"), m += "<div id='" + g[f].id + "' class='gantt_cal_lsection'><label>" + $ + (g[f].label || this.locale.labels["section_" + g[f].name] || g[f].name) + "</label></div>" + v.render.call(this, g[f]), m += "</div>";
      }
    }
    return m;
  }, t._center_lightbox = function(g) {
    t._setLbPosition(g);
  }, t._setLbPosition = function(g) {
    if (!g) return;
    const m = t._lightbox_root || t.$root;
    g.style.top = Math.max(m.offsetHeight / 2 - g.offsetHeight / 2, 0) + "px", g.style.left = Math.max(m.offsetWidth / 2 - g.offsetWidth / 2, 0) + "px";
  }, t.showCover = function(g) {
    g && (g.style.display = "block", this._setLbPosition(g)), _(), this._cover.style.display = "";
  };
  const _ = function() {
    t._cover || (t._cover = document.createElement("div"), t._cover.className = "gantt_cal_cover", t._cover.style.display = "none", t.event(t._cover, "mousemove", t._move_while_dnd), t.event(t._cover, "mouseup", t._finish_dnd), (t._lightbox_root || t.$root).appendChild(t._cover));
  };
  function p(g) {
    for (var m in this.config.types) if (this.config.types[m] == g) return m;
    return "task";
  }
  function y(g, m) {
    var f, v, x = "";
    for (v = 0; v < g.length; v++) f = t.config._migrate_buttons[g[v]] ? t.config._migrate_buttons[g[v]] : g[v], x += "<div " + t._waiAria.lightboxButtonAttrString(f) + " class='gantt_btn_set gantt_left_btn_set " + f + "_set'><div dhx_button='1' data-dhx-button='1' class='" + f + "'></div><div>" + t.locale.labels[f] + "</div></div>";
    return x;
  }
  function k(g) {
    var m, f;
    return g.time_format ? g.time_format : (f = ["%d", "%m", "%Y"], Vt((m = t.getScale()) ? m.unit : t.config.duration_unit) < Vt("day") && f.push("%H:%i"), f);
  }
  function b(g, m, f) {
    var v, x, $, w, S, T, E = "";
    switch (f.timeFormat[m]) {
      case "%Y":
        for (g._time_format_order[2] = m, g._time_format_order.size++, g.year_range && (isNaN(g.year_range) ? g.year_range.push && ($ = g.year_range[0], w = g.year_range[1]) : v = g.year_range), v = v || 10, x = x || Math.floor(v / 2), $ = $ || f.date.getFullYear() - x, w = w || t.getState().max_date.getFullYear() + x, S = $; S <= w; S++) E += "<option value='" + S + "'>" + S + "</option>";
        break;
      case "%m":
        for (g._time_format_order[1] = m, g._time_format_order.size++, S = 0; S < 12; S++) E += "<option value='" + S + "'>" + t.locale.date.month_full[S] + "</option>";
        break;
      case "%d":
        for (g._time_format_order[0] = m, g._time_format_order.size++, S = 1; S < 32; S++) E += "<option value='" + S + "'>" + S + "</option>";
        break;
      case "%H:%i":
        for (g._time_format_order[3] = m, g._time_format_order.size++, S = f.first, T = f.date.getDate(), g._time_values = []; S < f.last; ) E += "<option value='" + S + "'>" + t.templates.time_picker(f.date) + "</option>", g._time_values.push(S), f.date.setTime(f.date.valueOf() + 60 * t._get_timepicker_step() * 1e3), S = 24 * (f.date.getDate() != T ? 1 : 0) * 60 + 60 * f.date.getHours() + f.date.getMinutes();
    }
    return E;
  }
  t._init_lightbox_events = function() {
    t.lightbox_events = {}, t.lightbox_events.gantt_save_btn = function() {
      t._save_lightbox();
    }, t.lightbox_events.gantt_delete_btn = function() {
      t._lightbox_current_type = null, t.callEvent("onLightboxDelete", [t._lightbox_id]) && (t.isTaskExists(t._lightbox_id) ? t.$click.buttons.delete(t._lightbox_id) : t.hideLightbox());
    }, t.lightbox_events.gantt_cancel_btn = function() {
      t._cancel_lightbox();
    }, t.lightbox_events.default = function(g, m) {
      if (m.getAttribute("data-dhx-button")) t.callEvent("onLightboxButton", [m.className, m, g]);
      else {
        var f, v, x = X(m);
        if (x.indexOf("gantt_custom_button") != -1) if (x.indexOf("gantt_custom_button_") != -1) for (f = m.parentNode.getAttribute("data-index"), v = m; v && X(v).indexOf("gantt_cal_lsection") == -1; ) v = v.parentNode;
        else f = m.getAttribute("data-index"), v = m.closest(".gantt_cal_lsection"), m = m.firstChild;
        var $ = t._get_typed_lightbox_config();
        f && (f *= 1, t.form_blocks[$[1 * f].type].button_click(f, m, v, v.nextSibling));
      }
    }, this.event(t.getLightbox(), "click", function(g) {
      g.target.closest(".gantt_cal_ltitle_close_btn") && t._cancel_lightbox();
      var m = yt(g), f = X(m);
      return f || (f = X(m = m.previousSibling)), m && f && f.indexOf("gantt_btn_set") === 0 && (f = X(m = m.firstChild)), !(!m || !f) && (t.defined(t.lightbox_events[m.className]) ? t.lightbox_events[m.className] : t.lightbox_events.default)(g, m);
    }), t.getLightbox().onkeydown = function(g) {
      var m = g || window.event, f = g.target || g.srcElement, v = X(f).indexOf("gantt_btn_set") > -1;
      switch ((g || m).keyCode) {
        case t.constants.KEY_CODES.SPACE:
          if ((g || m).shiftKey) return;
          v && f.click && f.click();
          break;
        case t.keys.edit_save:
          if ((g || m).shiftKey) return;
          v && f.click ? f.click() : t._save_lightbox();
          break;
        case t.keys.edit_cancel:
          t._cancel_lightbox();
      }
    };
  }, t._cancel_lightbox = function() {
    var g = this.getLightboxValues();
    t._lightbox_current_type = null, this.callEvent("onLightboxCancel", [this._lightbox_id, g.$new]), t.isTaskExists(g.id) && g.$new && (this.silent(function() {
      t.$data.tasksStore.removeItem(g.id), t._update_flags(g.id, null);
    }), this.refreshData()), this.hideLightbox();
  }, t._save_lightbox = function() {
    var g = this.getLightboxValues();
    t._lightbox_current_type = null, this.callEvent("onLightboxSave", [this._lightbox_id, g, !!g.$new]) && (t.$data.tasksStore._skipTaskRecalculation = "lightbox", g.$new ? (delete g.$new, this.addTask(g, g.parent, this.getTaskIndex(g.id))) : this.isTaskExists(g.id) && (this.mixin(this.getTask(g.id), g, !0), this.refreshTask(g.id), this.updateTask(g.id)), t.$data.tasksStore._skipTaskRecalculation = !1, this.refreshData(), this.hideLightbox());
  }, t._resolve_default_mapping = function(g) {
    var m = g.map_to;
    return { time: !0, time_optional: !0, duration: !0, duration_optional: !0 }[g.type] ? g.map_to == "auto" ? m = { start_date: "start_date", end_date: "end_date", duration: "duration" } : typeof g.map_to == "string" && (m = { start_date: g.map_to }) : g.type === "constraint" && (g.map_to && typeof g.map_to != "string" || (m = { constraint_type: "constraint_type", constraint_date: "constraint_date" })), m;
  }, t.getLightboxValues = function() {
    let g = {};
    t.isTaskExists(this._lightbox_id) && (g = this.mixin({}, this.getTask(this._lightbox_id)));
    const m = [...this._get_typed_lightbox_config()].sort((f, v) => f.name === "time" ? 1 : v.name === "time" ? -1 : 0);
    for (let f = 0; f < m.length; f++) {
      let v = t._lightbox_root.querySelector("#" + m[f].id);
      v = v && v.nextSibling;
      let x = this.form_blocks[m[f].type];
      if (!x) continue;
      let $ = x.get_value.call(this, v, g, m[f]), w = t._resolve_default_mapping(m[f]);
      if (typeof w == "string" && w != "auto") g[w] = $;
      else if (typeof w == "object") for (let S in w) w[S] && (g[w[S]] = $[S]);
    }
    return t._lightbox_current_type && (g.type = t._lightbox_current_type), g;
  }, t.hideLightbox = function() {
    var g = this.getLightbox();
    g && (g.style.display = "none"), this._waiAria.lightboxHiddenAttr(g), this._lightbox_id = null, this.hideCover(g), this.resetLightbox(), this.callEvent("onAfterLightbox", []);
  }, t.hideCover = function(g) {
    g && (g.style.display = "none"), this._cover && this._cover.parentNode.removeChild(this._cover), this._cover = null;
  }, t.resetLightbox = function() {
    t._lightbox && !t._custom_lightbox && t._lightbox.remove(), t._lightbox = null;
  }, t._set_lightbox_values = function(g, m) {
    var f = g, v = m.getElementsByTagName("span"), x = [];
    t.templates.lightbox_header ? (x.push(""), x.push(t.templates.lightbox_header(f.start_date, f.end_date, f)), v[1].innerHTML = "", v[2].innerHTML = t.templates.lightbox_header(f.start_date, f.end_date, f)) : (x.push(this.templates.task_time(f.start_date, f.end_date, f)), x.push(String(this.templates.task_text(f.start_date, f.end_date, f) || "").substr(0, 70)), v[1].innerHTML = this.templates.task_time(f.start_date, f.end_date, f), v[2].innerHTML = String(this.templates.task_text(f.start_date, f.end_date, f) || "").substr(0, 70)), v[1].innerHTML = x[0], v[2].innerHTML = x[1], t._waiAria.lightboxHeader(m, x.join(" "));
    for (var $ = this._get_typed_lightbox_config(this.getLightboxType()), w = 0; w < $.length; w++) {
      var S = $[w];
      if (this.form_blocks[S.type]) {
        var T = t._lightbox_root.querySelector("#" + S.id).nextSibling, E = this.form_blocks[S.type], C = t._resolve_default_mapping($[w]), D = this.defined(f[C]) ? f[C] : S.default_value;
        E.set_value.call(t, T, D, f, S), S.focus && E.focus.call(t, T);
      }
    }
    t.isTaskExists(g.id) && (t._lightbox_id = g.id);
  }, t._fill_lightbox = function(g, m) {
    var f = this.getTask(g);
    this._set_lightbox_values(f, m);
  }, t.getLightboxSection = function(g) {
    for (var m = this._get_typed_lightbox_config(), f = 0; f < m.length && m[f].name != g; f++) ;
    var v = m[f];
    if (!v) return null;
    this._lightbox || this.getLightbox();
    var x = t._lightbox_root.querySelector("#" + v.id), $ = x.nextSibling, w = { section: v, header: x, node: $, getValue: function(T) {
      return t.form_blocks[v.type].get_value.call(t, $, T || {}, v);
    }, setValue: function(T, E) {
      return t.form_blocks[v.type].set_value.call(t, $, T, E || {}, v);
    } }, S = this._lightbox_methods["get_" + v.type + "_control"];
    return S ? S(w) : w;
  }, t._lightbox_methods.get_template_control = function(g) {
    return g.control = g.node, g;
  }, t._lightbox_methods.get_select_control = function(g) {
    return g.control = g.node.getElementsByTagName("select")[0], g;
  }, t._lightbox_methods.get_textarea_control = function(g) {
    return g.control = g.node.getElementsByTagName("textarea")[0], g;
  }, t._lightbox_methods.get_time_control = function(g) {
    return g.control = g.node.getElementsByTagName("select"), g;
  }, t._init_dnd_events = function() {
    var g = t._lightbox_root;
    this.event(g, "mousemove", t._move_while_dnd), this.event(g, "mouseup", t._finish_dnd), this.event(g, "touchmove", function(m) {
      t._move_while_dnd(m.touches[0]);
    }), this.event(g, "touchend", function(m) {
      t._finish_dnd(m.touches[0]);
    });
  }, t._move_while_dnd = function(g) {
    if (t._dnd_start_lb) {
      document.gantt_unselectable || (t._lightbox_root.className += " gantt_unselectable", document.gantt_unselectable = !0);
      var m = t.getLightbox(), f = [g.pageX, g.pageY];
      m.style.top = t._lb_start[1] + f[1] - t._dnd_start_lb[1] + "px", m.style.left = t._lb_start[0] + f[0] - t._dnd_start_lb[0] + "px";
    }
  }, t._ready_to_dnd = function(g) {
    var m = t.getLightbox();
    t._lb_start = [m.offsetLeft, m.offsetTop], t._dnd_start_lb = [g.pageX, g.pageY];
  }, t._finish_dnd = function() {
    t._lb_start && (t._lb_start = t._dnd_start_lb = !1, t._lightbox_root.className = t._lightbox_root.className.replace(" gantt_unselectable", ""), document.gantt_unselectable = !1);
  }, t._focus = function(g, m) {
    if (g && g.focus && !t.config.touch) try {
      m && g.select && g.select(), g.focus();
    } catch {
    }
  }, t.form_blocks = { getTimePicker: function(g, m) {
    var f, v, x, $ = "", w = this.config, S = { first: 0, last: 1440, date: this.date.date_part(new Date(t._min_date.valueOf())), timeFormat: k(g) };
    for (g._time_format_order = { size: 0 }, t.config.limit_time_select && (S.first = 60 * w.first_hour, S.last = 60 * w.last_hour + 1, S.date.setHours(w.first_hour)), f = 0; f < S.timeFormat.length; f++) f > 0 && ($ += " "), (v = b(g, f, S)) && (x = t._waiAria.lightboxSelectAttrString(S.timeFormat[f]), $ += "<select " + (g.readonly ? "disabled='disabled'" : "") + (m ? " style='display:none' " : "") + x + ">" + v + "</select>");
    return $;
  }, getTimePickerValue: function(g, m, f) {
    var v, x = m._time_format_order, $ = 0, w = 0, S = f || 0;
    return t.defined(x[3]) && (v = parseInt(g[x[3] + S].value, 10), $ = Math.floor(v / 60), w = v % 60), new Date(g[x[2] + S].value, g[x[1] + S].value, g[x[0] + S].value, $, w);
  }, _fill_lightbox_select: function(g, m, f, v) {
    if (g[m + v[0]].value = f.getDate(), g[m + v[1]].value = f.getMonth(), g[m + v[2]].value = f.getFullYear(), t.defined(v[3])) {
      var x = 60 * f.getHours() + f.getMinutes();
      x = Math.round(x / t._get_timepicker_step()) * t._get_timepicker_step();
      var $ = g[m + v[3]];
      $.value = x, $.setAttribute("data-value", x);
    }
  }, template: new e(), textarea: new n(), select: new a(), time: new i(), duration: new o(), parent: new l(), radio: new s(), checkbox: new r(), resources: new c(), constraint: new d(), baselines: new h(), typeselect: new u() }, t._is_lightbox_timepicker = function() {
    for (var g = this._get_typed_lightbox_config(), m = 0; m < g.length; m++) if (g[m].name == "time" && g[m].type == "time") return !0;
    return !1;
  }, t._delete_task_confirm = function({ task: g, message: m, title: f, callback: v, ok: x }) {
    t._simple_confirm(m, f, v, x);
  }, t._delete_link_confirm = function({ link: g, message: m, title: f, callback: v, ok: x }) {
    t._simple_confirm(m, f, v, x);
  }, t._simple_confirm = function(g, m, f, v) {
    if (!g) return f();
    var x = { text: g };
    m && (x.title = m), v && (x.ok = v), f && (x.callback = function($) {
      $ && f();
    }), t.confirm(x);
  }, t._get_typed_lightbox_config = function(g) {
    g === void 0 && (g = this.getLightboxType());
    var m = p.call(this, g);
    return t.config.lightbox[m + "_sections"] ? t.config.lightbox[m + "_sections"] : t.config.lightbox.sections;
  }, t._silent_redraw_lightbox = function(g) {
    var m = this.getLightboxType();
    if (this.getState().lightbox) {
      var f = this.getState().lightbox, v = this.getLightboxValues(), x = this.copy(this.getTask(f));
      this.resetLightbox();
      var $ = this.mixin(x, v, !0), w = this.getLightbox(g || void 0);
      this._set_lightbox_values($, w), this.showCover(w);
    } else this.resetLightbox(), this.getLightbox(g || void 0);
    this.callEvent("onLightboxChange", [m, this.getLightboxType()]);
  };
}
function Ka(t) {
  if (!mt.isNode) {
    t.utils = { arrayFind: Ln, dom: rn };
    var e = Se();
    t.event = e.attach, t.eventRemove = e.detach, t._eventRemoveAll = e.detachAll, t._createDomEventScope = e.extend, P(t, sa(t));
    var n = ja.init(t);
    t.$ui = n.factory, t.$ui.layers = n.render, t.$mouseEvents = n.mouseEvents, t.$services.setService("mouseEvents", function() {
      return t.$mouseEvents;
    }), t.mixin(t, n.layersApi), function(i) {
      delete i.addTaskLayer, delete i.addLinkLayer;
    }(t), t.$services.setService("layers", function() {
      return n.layersService;
    }), t.mixin(t, /* @__PURE__ */ function() {
      function i(u) {
        return u.$ui.getView("timeline");
      }
      function a(u) {
        return u.$ui.getView("grid");
      }
      function r(u) {
        var h = i(u);
        if (h && !h.$config.hidden) return h;
        var _ = a(u);
        return _ && !_.$config.hidden ? _ : null;
      }
      function s(u) {
        var h = null, _ = !1;
        return [".gantt_drag_marker.gantt_grid_resize_area", ".gantt_drag_marker .gantt_row.gantt_row_task", ".gantt_drag_marker.gantt_grid_dnd_marker"].forEach(function(p) {
          _ = _ || !!document.querySelector(p);
        }), (h = _ ? a(u) : r(u)) ? l(u, h, "scrollY") : null;
      }
      function o(u) {
        var h = r(u);
        return h && h.id != "grid" ? l(u, h, "scrollX") : null;
      }
      function l(u, h, _) {
        var p = h.$config[_];
        return u.$ui.getView(p);
      }
      var c = "DEFAULT_VALUE";
      function d(u, h, _, p) {
        var y = u(this);
        return y && y.isVisible() ? y[h].apply(y, _) : p ? p() : c;
      }
      return { getColumnIndex: function(u) {
        var h = d.call(this, a, "getColumnIndex", [u]);
        return h === c ? 0 : h;
      }, dateFromPos: function(u) {
        var h = d.call(this, i, "dateFromPos", Array.prototype.slice.call(arguments));
        return h === c ? this.getState().min_date : h;
      }, posFromDate: function(u) {
        var h = d.call(this, i, "posFromDate", [u]);
        return h === c ? 0 : h;
      }, getRowTop: function(u) {
        var h = this, _ = d.call(h, i, "getRowTop", [u], function() {
          return d.call(h, a, "getRowTop", [u]);
        });
        return _ === c ? 0 : _;
      }, getTaskTop: function(u) {
        var h = this, _ = d.call(h, i, "getItemTop", [u], function() {
          return d.call(h, a, "getItemTop", [u]);
        });
        return _ === c ? 0 : _;
      }, getTaskPosition: function(u, h, _) {
        var p = d.call(this, i, "getItemPosition", [u, h, _]);
        return p === c ? { left: 0, top: this.getTaskTop(u.id), height: this.getTaskBarHeight(u.id), width: 0 } : p;
      }, getTaskBarHeight: function(u, h) {
        var _ = this, p = d.call(_, i, "getBarHeight", [u, h], function() {
          return d.call(_, a, "getItemHeight", [u]);
        });
        return p === c ? 0 : p;
      }, getTaskHeight: function(u) {
        var h = this, _ = d.call(h, i, "getItemHeight", [u], function() {
          return d.call(h, a, "getItemHeight", [u]);
        });
        return _ === c ? 0 : _;
      }, columnIndexByDate: function(u) {
        var h = d.call(this, i, "columnIndexByDate", [u]);
        return h === c ? 0 : h;
      }, roundTaskDates: function() {
        d.call(this, i, "roundTaskDates", []);
      }, getScale: function() {
        var u = d.call(this, i, "getScale", []);
        return u === c ? null : u;
      }, getTaskNode: function(u) {
        var h = i(this);
        if (h && h.isVisible()) {
          var _ = h._taskRenderer.rendered[u];
          if (!_) {
            var p = h.$config.item_attribute;
            _ = h.$task_bars.querySelector("[" + p + "='" + u + "']");
          }
          return _ || null;
        }
        return null;
      }, getLinkNode: function(u) {
        var h = i(this);
        return h.isVisible() ? h._linkRenderer.rendered[u] : null;
      }, scrollTo: function(u, h) {
        var _ = s(this), p = o(this), y = { position: 0 }, k = { position: 0 };
        _ && (k = _.getScrollState()), p && (y = p.getScrollState());
        var b = p && 1 * u == u, g = _ && 1 * h == h;
        if (b && g) for (var m = _._getLinkedViews(), f = p._getLinkedViews(), v = [], x = 0; x < m.length; x++) for (var $ = 0; $ < f.length; $++) m[x].$config.id && f[$].$config.id && m[x].$config.id === f[$].$config.id && v.push(m[x].$config.id);
        b && (v && v.forEach((function(T) {
          this.$ui.getView(T).$config.$skipSmartRenderOnScroll = !0;
        }).bind(this)), p.scroll(u), v && v.forEach((function(T) {
          this.$ui.getView(T).$config.$skipSmartRenderOnScroll = !1;
        }).bind(this))), g && _.scroll(h);
        var w = { position: 0 }, S = { position: 0 };
        _ && (w = _.getScrollState()), p && (S = p.getScrollState()), this.callEvent("onGanttScroll", [y.position, k.position, S.position, w.position]);
      }, showDate: function(u) {
        var h = this.posFromDate(u), _ = Math.max(h - this.config.task_scroll_offset, 0);
        this.scrollTo(_);
      }, showTask: function(u) {
        var h = this.getTaskPosition(this.getTask(u)), _ = h.left;
        this.config.rtl && (_ = h.left + h.width);
        var p, y = Math.max(_ - this.config.task_scroll_offset, 0), k = this._scroll_state().y;
        p = k ? h.top - (k - this.getTaskBarHeight(u)) / 2 : h.top, this.scrollTo(y, p);
        var b = a(this), g = i(this);
        b && g && b.$config.scrollY != g.$config.scrollY && l(this, b, "scrollY").scrollTo(null, p);
      }, _scroll_state: function() {
        var u = { x: !1, y: !1, x_pos: 0, y_pos: 0, scroll_size: this.config.scroll_size + 1, x_inner: 0, y_inner: 0 }, h = s(this), _ = o(this);
        if (_) {
          var p = _.getScrollState();
          p.visible && (u.x = p.size, u.x_inner = p.scrollSize), u.x_pos = p.position || 0;
        }
        if (h) {
          var y = h.getScrollState();
          y.visible && (u.y = y.size, u.y_inner = y.scrollSize), u.y_pos = y.position || 0;
        }
        return u;
      }, getScrollState: function() {
        var u = this._scroll_state();
        return { x: u.x_pos, y: u.y_pos, inner_width: u.x, inner_height: u.y, width: u.x_inner, height: u.y_inner };
      }, getLayoutView: function(u) {
        return this.$ui.getView(u);
      }, scrollLayoutCell: function(u, h, _) {
        const p = this.$ui.getView(u);
        if (!p) return !1;
        if (h !== null) {
          const y = this.$ui.getView(p.$config.scrollX);
          y && y.scrollTo(h, null);
        }
        if (_ !== null) {
          const y = this.$ui.getView(p.$config.scrollY);
          y && y.scrollTo(null, _);
        }
      } };
    }()), function(i) {
      i.resetSkin || (i.resetSkin = function() {
        this.skin = "", ce(!0, this);
      }, i.skins = {}, i.attachEvent("onGanttLayoutReady", function() {
        ce(!1, this), r();
      })), i._addThemeClass = function() {
        document.documentElement.setAttribute("data-gantt-theme", i.skin);
      }, i.setSkin = function(s) {
        const o = this.skin !== s;
        this.skin = s, i._addThemeClass(), r(), i.$root && (ce(!o, i), this.render());
      };
      let a = null;
      function r() {
        const s = i.$root;
        a && clearInterval(a), s && (a = setInterval(() => {
          const o = getComputedStyle(s).getPropertyValue("--dhx-gantt-theme");
          o && o !== i.skin && i.setSkin(o);
        }, 100));
      }
      i.attachEvent("onDestroy", function() {
        clearInterval(a);
      });
    }(t), function(i) {
      i.skins.skyblue = { config: { grid_width: 370, row_height: 27, bar_height_padding: 4, scale_height: 27, link_line_width: 1, link_arrow_size: 8, link_radius: 2, lightbox_additional_height: 75 }, _second_column_width: 95, _third_column_width: 80 };
    }(t), function(i) {
      i.skins.dark = { config: { grid_width: 390, row_height: 36, scale_height: 36, link_line_width: 2, link_arrow_size: 12, bar_height_padding: 9, lightbox_additional_height: 75 }, _second_column_width: 100, _third_column_width: 70 };
    }(t), function(i) {
      i.skins.meadow = { config: { grid_width: 380, row_height: 27, scale_height: 30, link_line_width: 2, link_arrow_size: 10, bar_height_padding: 4, lightbox_additional_height: 72 }, _second_column_width: 95, _third_column_width: 80 };
    }(t), function(i) {
      i.skins.terrace = { config: { grid_width: 390, row_height: 36, scale_height: 36, link_line_width: 2, link_arrow_size: 12, bar_height_padding: 9, lightbox_additional_height: 75 }, _second_column_width: 100, _third_column_width: 70 };
    }(t), function(i) {
      i.skins.broadway = { config: { grid_width: 390, row_height: 35, scale_height: 35, link_line_width: 1, link_arrow_size: 9, bar_height_padding: 4, lightbox_additional_height: 86 }, _second_column_width: 100, _third_column_width: 80, _lightbox_template: "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span><div class='gantt_cancel_btn'></div></div><div class='gantt_cal_larea'></div>", _config_buttons_left: {}, _config_buttons_right: { gantt_delete_btn: "icon_delete", gantt_save_btn: "icon_save" } };
    }(t), function(i) {
      i.skins.material = { config: { grid_width: 411, row_height: 34, scale_height: 36, link_line_width: 2, link_arrow_size: 12, bar_height_padding: 9, lightbox_additional_height: 80 }, _second_column_width: 110, _third_column_width: 75, _redefine_lightbox_buttons: { buttons_left: ["dhx_delete_btn"], buttons_right: ["dhx_cancel_btn", "dhx_save_btn"] } }, i.attachEvent("onAfterTaskDrag", function(a) {
        var r = i.getTaskNode(a);
        r && (r.className += " gantt_drag_animation", setTimeout(function() {
          var s = r.className.indexOf(" gantt_drag_animation");
          s > -1 && (r.className = r.className.slice(0, s));
        }, 200));
      });
    }(t), function(i) {
      i.skins.contrast_black = { config: { grid_width: 390, row_height: 35, scale_height: 35, link_line_width: 2, link_arrow_size: 12, lightbox_additional_height: 75 }, _second_column_width: 100, _third_column_width: 80 };
    }(t), function(i) {
      i.skins.contrast_white = { config: { grid_width: 390, row_height: 35, scale_height: 35, link_line_width: 2, link_arrow_size: 12, lightbox_additional_height: 75 }, _second_column_width: 100, _third_column_width: 80 };
    }(t), function(i) {
      i.ext || (i.ext = {});
      for (var a = [Fa, null, null], r = 0; r < a.length; r++) a[r] && a[r](i);
      i.ext.zoom = new qa(i);
    }(t), Ga(t), Ja(t), function(i) {
      i._extend_to_optional = function(a) {
        var r = a, s = { render: r.render, focus: r.focus, set_value: function(o, l, c, d) {
          var u = i._resolve_default_mapping(d);
          if (!c[u.start_date] || u.start_date == "start_date" && this._isAllowedUnscheduledTask(c)) {
            s.disable(o, d);
            var h = {};
            for (var _ in u) h[u[_]] = c[_];
            return r.set_value.call(i, o, l, h, d);
          }
          return s.enable(o, d), r.set_value.call(i, o, l, c, d);
        }, get_value: function(o, l, c) {
          return c.disabled ? { start_date: null } : r.get_value.call(i, o, l, c);
        }, update_block: function(o, l) {
          if (i.callEvent("onSectionToggle", [i._lightbox_id, l]), o.style.display = l.disabled ? "none" : "", l.button) {
            var c = o.previousSibling.querySelector(".gantt_custom_button_label"), d = i.locale.labels, u = l.disabled ? d[l.name + "_enable_button"] : d[l.name + "_disable_button"];
            c.innerHTML = u;
          }
        }, disable: function(o, l) {
          l.disabled = !0, s.update_block(o, l);
        }, enable: function(o, l) {
          l.disabled = !1, s.update_block(o, l);
        }, button_click: function(o, l, c, d) {
          if (i.callEvent("onSectionButton", [i._lightbox_id, c]) !== !1) {
            var u = i._get_typed_lightbox_config()[o];
            u.disabled ? s.enable(d, u) : s.disable(d, u);
          }
        } };
        return s;
      }, i.form_blocks.duration_optional = i._extend_to_optional(i.form_blocks.duration), i.form_blocks.time_optional = i._extend_to_optional(i.form_blocks.time);
    }(t), function(i) {
      var a = new RegExp(`<(?:.|
)*?>`, "gm"), r = new RegExp(" +", "gm");
      function s(d) {
        return (d + "").replace(a, " ").replace(r, " ");
      }
      var o = new RegExp("'", "gm");
      function l(d) {
        return (d + "").replace(o, "&#39;");
      }
      for (var c in i._waiAria = { getAttributeString: function(d) {
        var u = [" "];
        for (var h in d) {
          var _ = l(s(d[h]));
          u.push(h + "='" + _ + "'");
        }
        return u.push(" "), u.join(" ");
      }, getTimelineCellAttr: function(d) {
        return i._waiAria.getAttributeString({ "aria-label": d });
      }, _taskCommonAttr: function(d, u) {
        d.start_date && d.end_date && (u.setAttribute("aria-label", s(i.templates.tooltip_text(d.start_date, d.end_date, d))), d.$dataprocessor_class && u.setAttribute("aria-busy", !0));
      }, setTaskBarAttr: function(d, u) {
        this._taskCommonAttr(d, u), u.setAttribute("role", "img"), !i.isReadonly(d) && i.config.drag_move && (d.id != i.getState("tasksDnd").drag_id ? u.setAttribute("aria-grabbed", !1) : u.setAttribute("aria-grabbed", !0));
      }, taskRowAttr: function(d, u) {
        this._taskCommonAttr(d, u), !i.isReadonly(d) && i.config.order_branch && u.setAttribute("aria-grabbed", !1), u.setAttribute("role", "row"), u.setAttribute("aria-selected", i.isSelectedTask(d.id) ? "true" : "false"), u.setAttribute("aria-level", d.$level + 1 || 1), i.hasChild(d.id) && u.setAttribute("aria-expanded", d.$open ? "true" : "false");
      }, linkAttr: function(d, u) {
        var h = i.config.links, _ = d.type == h.finish_to_start || d.type == h.start_to_start, p = d.type == h.start_to_start || d.type == h.start_to_finish, y = i.locale.labels.link + " " + i.templates.drag_link(d.source, p, d.target, _);
        u.setAttribute("role", "img"), u.setAttribute("aria-label", s(y));
      }, gridSeparatorAttr: function(d) {
        d.setAttribute("role", "columnheader");
      }, rowResizerAttr: function(d) {
        d.setAttribute("role", "row");
      }, lightboxHiddenAttr: function(d) {
        d.setAttribute("aria-hidden", "true");
      }, lightboxVisibleAttr: function(d) {
        d.setAttribute("aria-hidden", "false");
      }, lightboxAttr: function(d) {
        d.setAttribute("role", "dialog"), d.setAttribute("aria-hidden", "true"), d.firstChild.setAttribute("role", "heading"), d.firstChild.setAttribute("aria-level", "1");
      }, lightboxButtonAttrString: function(d) {
        return this.getAttributeString({ role: "button", "aria-label": i.locale.labels[d], tabindex: "0" });
      }, lightboxHeader: function(d, u) {
        d.setAttribute("aria-label", u);
      }, lightboxSelectAttrString: function(d) {
        var u = "";
        switch (d) {
          case "%Y":
            u = i.locale.labels.years;
            break;
          case "%m":
            u = i.locale.labels.months;
            break;
          case "%d":
            u = i.locale.labels.days;
            break;
          case "%H:%i":
            u = i.locale.labels.hours + i.locale.labels.minutes;
        }
        return i._waiAria.getAttributeString({ "aria-label": u });
      }, lightboxDurationInputAttrString: function(d) {
        return this.getAttributeString({ "aria-label": i.locale.labels.column_duration, "aria-valuemin": "0", role: "spinbutton" });
      }, inlineEditorAttr: function(d) {
        d.setAttribute("role", "row");
      }, gridAttrString: function() {
        return [" role='treegrid'", i.config.multiselect ? "aria-multiselectable='true'" : "aria-multiselectable='false'", " "].join(" ");
      }, gridScaleRowAttrString: function() {
        return "role='row'";
      }, gridScaleCellAttrString: function(d, u) {
        var h = "";
        if (d.name == "add") h = this.getAttributeString({ role: "columnheader", "aria-label": i.locale.labels.new_task });
        else {
          var _ = { role: "columnheader", "aria-label": i.config.external_render && i.config.external_render.isElement(u) ? "" : u };
          i._sort && i._sort.name == d.name && (i._sort.direction == "asc" ? _["aria-sort"] = "ascending" : _["aria-sort"] = "descending"), h = this.getAttributeString(_);
        }
        return h;
      }, gridDataAttrString: function() {
        return "role='rowgroup'";
      }, reorderMarkerAttr: function(d) {
        d.setAttribute("role", "grid"), d.firstChild.removeAttribute("aria-level"), d.firstChild.setAttribute("aria-grabbed", "true");
      }, gridCellAttrString: function(d, u, h) {
        var _ = { role: "gridcell", "aria-label": u };
        return d.editor && !i.isReadonly(h) || (_["aria-readonly"] = !0), this.getAttributeString(_);
      }, gridAddButtonAttrString: function(d) {
        return this.getAttributeString({ role: "button", "aria-label": i.locale.labels.new_task });
      }, messageButtonAttrString: function(d) {
        return "tabindex='0' role='button' aria-label='" + d + "'";
      }, messageInfoAttr: function(d) {
        d.setAttribute("role", "alert");
      }, messageModalAttr: function(d, u) {
        d.setAttribute("role", "dialog"), u && d.setAttribute("aria-labelledby", u);
      }, quickInfoAttr: function(d) {
        d.setAttribute("role", "dialog");
      }, quickInfoHeaderAttrString: function() {
        return " role='heading' aria-level='1' ";
      }, quickInfoHeader: function(d, u) {
        d.setAttribute("aria-label", u);
      }, quickInfoButtonAttrString: function(d) {
        return i._waiAria.getAttributeString({ role: "button", "aria-label": d, tabindex: "0" });
      }, tooltipAttr: function(d) {
        d.setAttribute("role", "tooltip");
      }, tooltipVisibleAttr: function(d) {
        d.setAttribute("aria-hidden", "false");
      }, tooltipHiddenAttr: function(d) {
        d.setAttribute("aria-hidden", "true");
      } }, i._waiAria) i._waiAria[c] = /* @__PURE__ */ function(d) {
        return function() {
          return i.config.wai_aria_attributes ? d.apply(this, arguments) : "";
        };
      }(i._waiAria[c]);
    }(t), t.locate = function(i) {
      var a = yt(i);
      if (dt(a, ".gantt_task_row")) return null;
      var r = arguments[1] || this.config.task_attribute, s = nt(a, r);
      return s ? s.getAttribute(r) : null;
    }, t._locate_css = function(i, a, r) {
      return pt(i, a, r);
    }, t._locateHTML = function(i, a) {
      return nt(i, a || this.config.task_attribute);
    };
  }
  t.attachEvent("onParse", function() {
    F(t) || t.attachEvent("onGanttRender", function() {
      if (t.config.initial_scroll) {
        var i = t.getTaskByIndex(0), a = i ? i.id : t.config.root_id;
        t.isTaskExists(a) && t.$task && t.utils.dom.isChildOf(t.$task, t.$container) && t.showTask(a);
      }
    }, { once: !0 });
  }), t.attachEvent("onBeforeGanttReady", function() {
    this.config.scroll_size || (this.config.scroll_size = Xe() || 15), F(t) || (this._eventRemoveAll(), this.$mouseEvents.reset(), this.resetLightbox());
  }), t.attachEvent("onGanttReady", function() {
    !F(t) && t.config.rtl && t.$layout.getCellsByType("viewCell").forEach(function(i) {
      var a = i.$config.scrollX;
      if (a) {
        var r = t.$ui.getView(a);
        r && r.scrollTo(r.$config.scrollSize, 0);
      }
    });
  }), t.attachEvent("onGanttReady", function() {
    if (!F(t)) {
      var i = t.plugins(), a = { auto_scheduling: t.autoSchedule, click_drag: t.ext.clickDrag, critical_path: t.isCriticalTask, drag_timeline: t.ext.dragTimeline, export_api: t.exportToPDF, fullscreen: t.ext.fullscreen, grouping: t.groupBy, keyboard_navigation: t.ext.keyboardNavigation, marker: t.addMarker, multiselect: t.eachSelectedTask, overlay: t.ext.overlay, quick_info: t.templates.quick_info_content, tooltip: t.ext.tooltips, undo: t.undo };
      for (let r in a) a[r] && !i[r] && console.warn(`You connected the '${r}' extension via an obsolete file. 
To fix it, you need to remove the obsolete file and connect the extension via the plugins method: https://docs.dhtmlx.com/gantt/api__gantt_plugins.html`);
    }
  });
}
const Xa = Z.gantt = function(t) {
  var e = ra(t);
  return e.env.isNode || (Ka(e), function(n) {
    n.load = function(i, a, r) {
      this._load_url = i, this.assert(arguments.length, "Invalid load arguments");
      var s = "json", o = null;
      return arguments.length >= 3 ? (s = a, o = r) : typeof arguments[1] == "string" ? s = arguments[1] : typeof arguments[1] == "function" && (o = arguments[1]), this._load_type = s, this.callEvent("onLoadStart", [i, s]), this.ajax.get(i, n.bind(function(l) {
        this.on_load(l, s), this.callEvent("onLoadEnd", [i, s]), typeof o == "function" && o.call(this);
      }, this));
    };
  }(e)), e;
}(Vn);
export {
  Xa as default,
  Xa as gantt
};
//# sourceMappingURL=dhtmlxgantt.es.js.map
