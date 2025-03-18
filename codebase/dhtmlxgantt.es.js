/** @license

dhtmlxGantt v.9.0.6 Standard

This version of dhtmlxGantt is distributed under GPL 2.0 license and can be legally used in GPL projects.

To use dhtmlxGantt in non-GPL projects (and get Pro version of the product), please obtain Individual, Commercial, Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing or contact us at info@dhtmlx.com

(c) XB Software

*/
function F(t) {
  var e = 0, n = 0, i = 0, a = 0;
  if (t.getBoundingClientRect) {
    var r = t.getBoundingClientRect(), s = document.body, o = document.documentElement || document.body.parentNode || document.body, l = window.pageYOffset || o.scrollTop || s.scrollTop, d = window.pageXOffset || o.scrollLeft || s.scrollLeft, c = o.clientTop || s.clientTop || 0, u = o.clientLeft || s.clientLeft || 0;
    e = r.top + l - c, n = r.left + d - u, i = document.body.offsetWidth - r.right, a = document.body.offsetHeight - r.bottom;
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
function be(t) {
  for (var e = t.querySelectorAll(["a[href]", "area[href]", "input", "select", "textarea", "button", "iframe", "object", "embed", "[tabindex]", "[contenteditable]"].join(", ")), n = Array.prototype.slice.call(e, 0), i = 0; i < n.length; i++) n[i].$position = i;
  for (n.sort(function(r, s) {
    return r.tabIndex === 0 && s.tabIndex !== 0 ? 1 : r.tabIndex !== 0 && s.tabIndex === 0 ? -1 : r.tabIndex === s.tabIndex ? r.$position - s.$position : r.tabIndex < s.tabIndex ? -1 : 1;
  }), i = 0; i < n.length; i++) {
    var a = n[i];
    (An(a) || Mn(a) || In(a)) && Dn(a) || (n.splice(i, 1), i--);
  }
  return n;
}
function Ze() {
  var t = document.createElement("div");
  t.style.cssText = "visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;", document.body.appendChild(t);
  var e = t.offsetWidth - t.clientWidth;
  return document.body.removeChild(t), Math.max(e, 15);
}
function K(t) {
  if (!t) return "";
  var e = t.className || "";
  return e.baseVal && (e = e.baseVal), e.indexOf || (e = ""), ce(e);
}
function wt(t, e) {
  e && t.className.indexOf(e) === -1 && (t.className += " " + e);
}
function qt(t, e) {
  e = e.split(" ");
  for (var n = 0; n < e.length; n++) {
    var i = new RegExp("\\s?\\b" + e[n] + "\\b(?![-_.])", "");
    t.className = t.className.replace(i, "");
  }
}
function xe(t) {
  return typeof t == "string" ? document.getElementById(t) || document.querySelector(t) || document.body : t || document.body;
}
var Ot;
function Qe(t, e) {
  Ot || (Ot = document.createElement("div")), Ot.innerHTML = e;
  var n = Ot.firstChild;
  return t.appendChild(n), n;
}
function tn(t) {
  t && t.parentNode && t.parentNode.removeChild(t);
}
function en(t, e) {
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
function tt(t, e) {
  if (e) {
    for (var n = yt(t); n; ) {
      if (n.getAttribute && n.getAttribute(e)) return n;
      n = n.parentNode;
    }
    return null;
  }
}
function ce(t) {
  return (String.prototype.trim || function() {
    return this.replace(/^\s+|\s+$/g, "");
  }).apply(t);
}
function pt(t, e, n) {
  var i = yt(t), a = "";
  for (n === void 0 && (n = !0); i; ) {
    if (a = K(i)) {
      var r = a.indexOf(e);
      if (r >= 0) {
        if (!n) return i;
        var s = r === 0 || !ce(a.charAt(r - 1)), o = r + e.length >= a.length || !ce(a.charAt(r + e.length));
        if (s && o) return i;
      }
    }
    i = i.parentNode;
  }
  return null;
}
function at(t, e) {
  var n = document.documentElement, i = F(e);
  return { x: t.clientX + n.scrollLeft - n.clientLeft - i.x + e.scrollLeft, y: t.clientY + n.scrollTop - n.clientTop - i.y + e.scrollTop };
}
function nn(t, e) {
  const n = F(t), i = F(e);
  return { x: n.x - i.x, y: n.y - i.y };
}
function G(t, e) {
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
function an(t) {
  for (; t; ) {
    if (t.offsetWidth > 0 && t.offsetHeight > 0) return t;
    t = t.parentElement;
  }
  return null;
}
function rn() {
  return document.head.createShadowRoot || document.head.attachShadow;
}
function ue() {
  var t = document.activeElement;
  return t.shadowRoot && (t = t.shadowRoot.activeElement), t === document.body && document.getSelection && (t = document.getSelection().focusNode || document.body), t;
}
function vt(t) {
  if (!t || !rn()) return document.body;
  for (; t.parentNode && (t = t.parentNode); ) if (t instanceof ShadowRoot) return t.host;
  return document.body;
}
const sn = Object.freeze(Object.defineProperty({ __proto__: null, addClassName: wt, closest: dt, getActiveElement: ue, getChildNodes: en, getClassName: K, getClosestSizedElement: an, getFocusableNodes: be, getNodePosition: F, getRelativeEventPosition: at, getRelativeNodePosition: nn, getRootNode: vt, getScrollSize: Ze, getTargetNode: yt, hasClass: function(t, e) {
  return "classList" in t ? t.classList.contains(e) : new RegExp("\\b" + e + "\\b").test(t.className);
}, hasShadowParent: function(t) {
  return !!vt(t);
}, insertNode: Qe, isChildOf: G, isShadowDomSupported: rn, locateAttribute: tt, locateClassName: pt, removeClassName: qt, removeNode: tn, toNode: xe }, Symbol.toStringTag, { value: "Module" })), lt = typeof window < "u" ? window : global;
let Nn = class {
  constructor(t) {
    this._mouseDown = !1, this._gantt = t, this._domEvents = t._createDomEventScope();
  }
  attach(t, e, n) {
    const i = this._gantt, a = t.getViewPort();
    this._originPosition = lt.getComputedStyle(a).display, this._restoreOriginPosition = () => {
      a.style.position = this._originPosition;
    }, this._originPosition === "static" && (a.style.position = "relative");
    const r = i.$services.getService("state");
    r.registerProvider("clickDrag", () => ({ autoscroll: !1 }));
    let s = null;
    const o = () => {
      s && (this._mouseDown = !0, t.setStart(i.copy(s)), t.setPosition(i.copy(s)), t.setEnd(i.copy(s)), s = null);
    };
    this._domEvents.attach(a, "mousedown", (d) => {
      s = null;
      let c = ".gantt_task_line, .gantt_task_link";
      n !== void 0 && (c = n instanceof Array ? n.join(", ") : n), c && i.utils.dom.closest(d.target, c) || (r.registerProvider("clickDrag", () => ({ autoscroll: this._mouseDown })), e && d[e] !== !0 || (s = this._getCoordinates(d, t)));
    });
    const l = vt(i.$root) || document.body;
    this._domEvents.attach(l, "mouseup", (d) => {
      if (s = null, (!e || d[e] === !0) && this._mouseDown === !0) {
        this._mouseDown = !1;
        const c = this._getCoordinates(d, t);
        t.dragEnd(c);
      }
    }), this._domEvents.attach(a, "mousemove", (d) => {
      if (e && d[e] !== !0) return;
      const c = this._gantt.ext.clickDrag, u = (this._gantt.config.drag_timeline || {}).useKey;
      if (c && u && !e && d[u]) return;
      let h = null;
      if (!this._mouseDown && s) return h = this._getCoordinates(d, t), void (Math.abs(s.relative.left - h.relative.left) > 5 && o());
      this._mouseDown === !0 && (h = this._getCoordinates(d, t), t.setEnd(h), t.render());
    });
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
var on = function() {
  this._silent_mode = !1, this.listeners = {};
};
on.prototype = { _silentStart: function() {
  this._silent_mode = !0;
}, _silentEnd: function() {
  this._silent_mode = !1;
} };
var Ln = function(t) {
  var e = {}, n = 0, i = function() {
    var a = !0;
    for (var r in e) {
      var s = e[r].apply(t, arguments);
      a = a && s;
    }
    return a;
  };
  return i.addEvent = function(a, r) {
    if (typeof a == "function") {
      var s;
      if (r && r.id ? s = r.id : (s = n, n++), r && r.once) {
        var o = a;
        a = function() {
          o(), i.removeEvent(s);
        };
      }
      return e[s] = a, s;
    }
    return !1;
  }, i.removeEvent = function(a) {
    delete e[a];
  }, i.clear = function() {
    e = {};
  }, i;
};
function st(t) {
  var e = new on();
  t.attachEvent = function(n, i, a) {
    n = "ev_" + n.toLowerCase(), e.listeners[n] || (e.listeners[n] = Ln(this)), a && a.thisObject && (i = i.bind(a.thisObject));
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
var Ee = { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2592e3, quarter: 7776e3, year: 31536e3 };
function Ft(t) {
  return Ee[t] || Ee.hour;
}
function kt(t, e) {
  if (t.forEach) t.forEach(e);
  else for (var n = t.slice(), i = 0; i < n.length; i++) e(n[i], i);
}
function Pn(t, e) {
  if (t.find) return t.find(e);
  for (var n = 0; n < t.length; n++) if (e(t[n], n)) return t[n];
}
function Bt(t, e) {
  if (t.includes) return t.includes(e);
  for (var n = 0; n < t.length; n++) if (t[n] === e) return !0;
  return !1;
}
function he(t) {
  return Array.isArray ? Array.isArray(t) : t && t.length !== void 0 && t.pop && t.push;
}
function X(t) {
  return !(!t || typeof t != "object") && !!(t.getFullYear && t.getMonth && t.getDate);
}
function bt(t) {
  return X(t) && !isNaN(t.getTime());
}
function Ce(t, e) {
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
function it(t, e) {
  return De(t) && !De(e) && (t = "0"), t;
}
function De(t) {
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
class Rn {
  constructor(e, n, i) {
    var a;
    this._el = document.createElement("div"), this.defaultRender = (r, s) => {
      this._el || (this._el = document.createElement("div"));
      const o = this._el, l = Math.min(r.relative.top, s.relative.top), d = Math.max(r.relative.top, s.relative.top), c = Math.min(r.relative.left, s.relative.left), u = Math.max(r.relative.left, s.relative.left);
      if (this._singleRow) {
        const h = this._getTaskPositionByTop(this._startPoint.relative.top);
        o.style.height = h.height + "px", o.style.top = h.top + "px";
      } else o.style.height = Math.abs(d - l) + "px", o.style.top = l + "px";
      return o.style.width = Math.abs(u - c) + "px", o.style.left = c + "px", o;
    }, this._gantt = n, this._view = i, this._viewPort = e.viewPort, this._el.classList.add(e.className), typeof e.callback == "function" && (this._callback = e.callback), this.render = () => {
      let r;
      r = e.render ? e.render(this._startPoint, this._endPoint) : this.defaultRender(this._startPoint, this._endPoint), r !== this._el && (this._el && this._el.parentNode && this._el.parentNode.removeChild(this._el), this._el = r), e.className !== "" && this._el.classList.add(e.className), this.draw();
    }, (a = this._viewPort).attachEvent && a.detachEvent || st(this._viewPort), this._singleRow = e.singleRow, this._useRequestAnimationFrame = e.useRequestAnimationFrame;
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
    for (let d = s; d <= o; d++)
      i.getTaskByIndex(d) && l.push(i.getTaskByIndex(d));
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
class $e {
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
      if (this._trace = [], i.$root.classList.remove("gantt_noselect"), this._originalReadonly !== void 0 && (i.config.readonly = this._originalReadonly, this._mouseDown && i.config.drag_timeline && i.config.drag_timeline.render && i.render()), this._originAutoscroll !== void 0 && (i.config.autoscroll = this._originAutoscroll), i.config.drag_timeline) {
        const { useKey: a } = i.config.drag_timeline;
        if (a && n[a] !== !0) return;
      }
      this._mouseDown = !1;
    }, this._startDrag = (n) => {
      const i = this._gantt;
      this._originAutoscroll = i.config.autoscroll, i.config.autoscroll = !1, i.$root.classList.add("gantt_noselect"), this._originalReadonly = i.config.readonly, i.config.readonly = !0, i.config.drag_timeline && i.config.drag_timeline.render && i.render(), this._trace = [], this._mouseDown = !0;
      const { x: a, y: r } = this._getScrollPosition(this._timeline);
      this._scrollState = { x: a, y: r }, this._startPoint = { x: n.clientX, y: n.clientY }, this._trace.push(this._startPoint);
    }, this._gantt = e, this._domEvents = e._createDomEventScope(), this._trace = [];
  }
  static create(e) {
    return new $e(e);
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
function Hn(t) {
  (function() {
    var e = [];
    function n() {
      return !!e.length;
    }
    function i(d) {
      setTimeout(function() {
        n() || t.$destroyed || t.focus();
      }, 1);
    }
    function a(d) {
      t.eventRemove(d, "keydown", s), t.event(d, "keydown", s), e.push(d);
    }
    function r() {
      var d = e.pop();
      d && t.eventRemove(d, "keydown", s), i();
    }
    function s(d) {
      var c = d.currentTarget;
      c == e[e.length - 1] && t.$keyboardNavigation.trapFocus(c, d);
    }
    function o() {
      a(t.getLightbox());
    }
    t.attachEvent("onLightbox", o), t.attachEvent("onAfterLightbox", r), t.attachEvent("onLightboxChange", function() {
      r(), o();
    }), t.attachEvent("onAfterQuickInfo", function() {
      i();
    }), t.attachEvent("onMessagePopup", function(d) {
      l = t.utils.dom.getActiveElement(), a(d);
    }), t.attachEvent("onAfterMessagePopup", function() {
      r(), setTimeout(function() {
        l && (l.focus(), l = null);
      }, 1);
    });
    var l = null;
    t.$keyboardNavigation.isModal = n;
  })();
}
class On {
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
      const s = r.querySelector(".gantt_cal_qi_title"), o = s.querySelector(".gantt_cal_qi_tcontent"), l = s.querySelector(".gantt_cal_qi_tdate"), d = r.querySelector(".gantt_cal_qi_content"), c = r.querySelector(".gantt_cal_qi_controls");
      i._waiAria.quickInfoHeader(r, [n.header.title, n.header.date].join(" ")), o.innerHTML = n.header.title, l.innerHTML = n.header.date, n.header.title || n.header.date ? s.style.display = "" : s.style.display = "none", d.innerHTML = n.content;
      const u = n.buttons;
      u.length ? c.style.display = "" : c.style.display = "none";
      let h = "";
      for (let g = 0; g < u.length; g++) {
        const f = i._waiAria.quickInfoButtonAttrString(i.locale.labels[u[g]]);
        h += `<div class="gantt_qi_big_icon ${u[g]} dhx_gantt_${u[g]}" title="${i.locale.labels[u[g]]}" ${f}>
            <div class='dhx_menu_icon dhx_gantt_icon ${u[g]} gantt_menu_icon dhx_gantt_${u[g]}'></div>
            <div>${i.locale.labels[u[g]]}</div>
         </div>`;
      }
      c.innerHTML = h, i.eventRemove(r, "click", this._qiButtonClickHandler), i.eventRemove(r, "keypress", this._qiKeyPressHandler), i.event(r, "click", this._qiButtonClickHandler), i.event(r, "keypress", this._qiKeyPressHandler);
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
    let d = s;
    if (r.utils.dom.isChildOf(d, i)) for (; d && d !== i; ) o += d.offsetLeft, d = d.offsetParent;
    const c = r.getScrollState();
    return d ? { left: o, top: l, dx: o + s.offsetWidth / 2 - c.x > i.offsetWidth / 2 ? 1 : 0, dy: l + s.offsetHeight / 2 - c.y > a.offsetHeight / 2 ? 1 : 0, width: s.offsetWidth, height: s.offsetHeight } : null;
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
      const s = a.offsetWidth, o = a.offsetHeight, l = i.getScrollState(), d = r.xViewport, c = r.yViewport, u = d.offsetWidth + l.x - s, h = e.top - l.y + o;
      let g = e.top;
      h > c.offsetHeight / 2 && (g = e.top - (o + e.height + 2 * n), g < l.y && h <= c.offsetHeight && (g = e.top)), g < l.y && (g = l.y);
      const f = Math.min(Math.max(l.x, e.left - e.dx * (s - e.width)), u), y = g;
      this._appendAtCoordinates(f, y);
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
var Zt, Bn = {}.constructor.toString();
function q(t) {
  var e, n;
  if (t && typeof t == "object") switch (!0) {
    case X(t):
      n = new Date(t);
      break;
    case he(t):
      for (n = new Array(t.length), e = 0; e < t.length; e++) n[e] = q(t[e]);
      break;
    default:
      for (e in n = function(i) {
        return i.constructor.toString() !== Bn;
      }(t) ? Object.create(t) : {}, t) Object.prototype.hasOwnProperty.apply(t, [e]) && (n[e] = q(t[e]));
  }
  return n || t;
}
function N(t, e, n) {
  for (var i in e) (t[i] === void 0 || n) && (t[i] = e[i]);
  return t;
}
function W(t) {
  return t !== void 0;
}
function rt() {
  return Zt || (Zt = (/* @__PURE__ */ new Date()).valueOf()), ++Zt;
}
function R(t, e) {
  return t.bind ? t.bind(e) : function() {
    return t.apply(e, arguments);
  };
}
function ln(t, e, n, i) {
  t.addEventListener ? t.addEventListener(e, n, i !== void 0 && i) : t.attachEvent && t.attachEvent("on" + e, n);
}
function dn(t, e, n, i) {
  t.removeEventListener ? t.removeEventListener(e, n, i !== void 0 && i) : t.detachEvent && t.detachEvent("on" + e, n);
}
const zn = Object.freeze(Object.defineProperty({ __proto__: null, bind: R, copy: q, defined: W, event: ln, eventRemove: dn, mixin: N, uid: rt }, Symbol.toStringTag, { value: "Module" }));
function we(t, e) {
  t = t || ln, e = e || dn;
  var n = [], i = { attach: function(a, r, s, o) {
    n.push({ element: a, event: r, callback: s, capture: o }), t(a, r, s, o);
  }, detach: function(a, r, s, o) {
    e(a, r, s, o);
    for (var l = 0; l < n.length; l++) {
      var d = n[l];
      d.element === a && d.event === r && d.callback === s && d.capture === o && (n.splice(l, 1), l--);
    }
  }, detachAll: function() {
    for (var a = n.slice(), r = 0; r < a.length; r++) {
      var s = a[r];
      i.detach(s.element, s.event, s.callback, s.capture), i.detach(s.element, s.event, s.callback, void 0), i.detach(s.element, s.event, s.callback, !1), i.detach(s.element, s.event, s.callback, !0);
    }
    n.splice(0, n.length);
  }, extend: function() {
    return we(this.event, this.eventRemove);
  } };
  return i;
}
class Wn {
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
    if (G(r, a) || (this.hide(), r.style.top = r.style.top || "0px", r.style.left = r.style.left || "0px", a.appendChild(r)), this._isLikeMouseEvent(e)) {
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
    const n = this._gantt, i = this._getViewPortSize(), a = this.getNode(), r = { top: 0, left: 0, width: a.offsetWidth, height: a.offsetHeight, bottom: 0, right: 0 }, s = n.config.tooltip_offset_x, o = n.config.tooltip_offset_y, l = document.body, d = at(e, l), c = F(l);
    d.y += c.y, r.top = d.y, r.left = d.x, r.top += o, r.left += s, r.bottom = r.top + r.height, r.right = r.left + r.width;
    const u = window.scrollY + l.scrollTop;
    return r.top < i.top - u ? (r.top = i.top, r.bottom = r.top + r.height) : r.bottom > i.bottom && (r.bottom = i.bottom, r.top = r.bottom - r.height), r.left < i.left ? (r.left = i.left, r.right = i.left + r.width) : r.right > i.right && (r.right = i.right, r.left = r.right - r.width), d.x >= r.left && d.x <= r.right && (r.left = d.x - r.width - s, r.right = r.left + r.width), d.y >= r.top && d.y <= r.bottom && (r.top = d.y - r.height - o, r.bottom = r.top + r.height), r;
  }
  _getViewPortSize() {
    const e = this._gantt, n = this._getViewPort();
    let i, a = n, r = window.scrollY + document.body.scrollTop, s = window.scrollX + document.body.scrollLeft;
    return n === e.$task_data ? (a = e.$task, r = 0, s = 0, i = F(e.$task)) : i = F(a), { left: i.x + s, top: i.y + r, width: i.width, height: i.height, bottom: i.y + i.height + r, right: i.x + i.width + s };
  }
}
class jn {
  constructor(e) {
    this._listeners = {}, this.tooltip = new Wn(e), this._gantt = e, this._domEvents = we(), this._initDelayedFunctions();
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
      if (G(o, this.tooltip.getNode())) return;
      const d = () => {
        a = l, e.onmouseenter(s, l);
      };
      a ? l && l === a ? e.onmousemove(s, l) : (e.onmouseleave(s, a), a = null, l && l !== a && d()) : l && d();
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
    this.delayShow && this.delayShow.$cancelTimeout(), this.delayHide && this.delayHide.$cancelTimeout(), this.tooltip.hide(), this.delayShow = Ce((n, i) => {
      e.callEvent("onBeforeTooltip", [n]) === !1 ? this.tooltip.hide() : (this.tooltip.setContent(i), this.tooltip.show(n));
    }, e.config.tooltip_timeout || 1), this.delayHide = Ce(() => {
      this.delayShow.$cancelTimeout(), this.tooltip.hide();
    }, e.config.tooltip_hide_timeout || 1);
  }
}
const Ae = { onBeforeUndo: "onAfterUndo", onBeforeRedo: "onAfterRedo" }, Ie = ["onTaskDragStart", "onAfterTaskUpdate", "onAfterParentExpand", "onAfterTaskDelete", "onBeforeBatchUpdate"];
class Fn {
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
    if (!this._ignore) {
      e.$local_index = this._gantt.getTaskIndex(e.id);
      const n = this.getInitialTask(e.id);
      if (e.$local_index === n.$local_index && this._gantt.getParent(e) === this._gantt.getParent(n)) return;
      this._storeEntityCommand(e, this.getInitialTask(e.id), this._undo.command.type.move, this._undo.command.entity.task);
    }
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
    for (let d = 0; d < n.length; d++) a = this.setInitialTask(n[d]), s = s.concat(this._getLinks(a)), r.push(a);
    const o = {};
    for (let d = 0; d < s.length; d++) o[s[d]] = !0;
    const l = [];
    for (const d in o) l.push(this.setInitialLink(d));
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
    for (const l in Ae) n.attachEvent(l, () => (this.startIgnore(), !0)), n.attachEvent(Ae[l], () => (this.stopIgnore(), !0));
    for (let l = 0; l < Ie.length; l++) n.attachEvent(Ie[l], () => (this.startBatchAction(), !0));
    n.attachEvent("onParse", () => {
      this._undo.clearUndoStack(), this._undo.clearRedoStack(), i();
    }), n.attachEvent("onAfterTaskAdd", (l, d) => {
      this.setInitialTask(l, !0), this.onTaskAdded(d);
    }), n.attachEvent("onAfterTaskUpdate", (l, d) => {
      this.onTaskUpdated(d);
    }), n.attachEvent("onAfterParentExpand", (l, d) => {
      this.onTaskUpdated(d);
    }), n.attachEvent("onAfterTaskDelete", (l, d) => {
      this.onTaskDeleted(d);
    }), n.attachEvent("onAfterLinkAdd", (l, d) => {
      this.setInitialLink(l, !0), this.onLinkAdded(d);
    }), n.attachEvent("onAfterLinkUpdate", (l, d) => {
      this.onLinkUpdated(d);
    }), n.attachEvent("onAfterLinkDelete", (l, d) => {
      this.onLinkDeleted(d);
    }), n.attachEvent("onRowDragEnd", (l, d) => (this.onTaskMoved(a(l)), this.toggleIgnoreMoveEvents(), !0)), n.attachEvent("onBeforeTaskDelete", (l) => {
      this.store(l, n.config.undo_types.task);
      const d = [];
      return i(), n.eachTask((c) => {
        d.push(c.id);
      }, l), this.setNestedTasks(l, d), !0;
    });
    const r = n.getDatastore("task");
    r.attachEvent("onBeforeItemMove", (l, d, c) => (this.isMoveEventsIgnored() || i(), !0)), r.attachEvent("onAfterItemMove", (l, d, c) => (this.isMoveEventsIgnored() || this.onTaskMoved(a(l)), !0)), n.attachEvent("onRowDragStart", (l, d, c) => (this.toggleIgnoreMoveEvents(!0), i(), !0));
    let s = null, o = !1;
    if (n.attachEvent("onBeforeTaskDrag", (l) => {
      if (s = n.getState().drag_id, s === l) {
        const d = n.getTask(l);
        n.isSummaryTask(d) && n.config.drag_project && (o = !0);
      }
      if (n.plugins().multiselect) {
        const d = n.getSelectedTasks();
        d.length > 1 && d.forEach((c) => {
          this.store(c, n.config.undo_types.task, !0);
        });
      }
      return this.store(l, n.config.undo_types.task);
    }), n.attachEvent("onAfterTaskDrag", (l) => {
      (o || n.plugins().multiselect && n.getSelectedTasks().length > 1) && s === l && (o = !1, s = null, this.stopBatchAction()), this.store(l, n.config.undo_types.task, !0);
    }), n.attachEvent("onLightbox", (l) => this.store(l, n.config.undo_types.task)), n.attachEvent("onBeforeTaskAutoSchedule", (l) => (this.store(l.id, n.config.undo_types.task, !0), !0)), n.ext.inlineEditors) {
      let l = null, d = null;
      n.attachEvent("onGanttLayoutReady", () => {
        l && n.ext.inlineEditors.detachEvent(l), d && n.ext.inlineEditors.detachEvent(d), d = n.ext.inlineEditors.attachEvent("onEditStart", (c) => {
          this.store(c.id, n.config.undo_types.task);
        }), l = n.ext.inlineEditors.attachEvent("onBeforeEditStart", (c) => (this.stopBatchAction(), !0));
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
class Vn {
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
        const l = s[n.entity][n.type], d = s[n.entity].get, c = s[n.entity].isExists;
        if (n.type === a.add) r[l](n.oldValue, n.oldValue.parent, n.oldValue.$local_index);
        else if (n.type === a.remove) r[c](n.value.id) && r[l](n.value.id);
        else if (n.type === a.update) {
          const u = r[d](n.value.id);
          for (const h in n.value) {
            let g = !(h.startsWith("$") || h.startsWith("_"));
            ["$open"].indexOf(h) > -1 && (g = !0), g && (u[h] = n.value[h]);
          }
          r[l](n.value.id);
        } else n.type === a.move && (r[l](n.value.id, n.value.$local_index, n.value.parent), r.callEvent("onRowDragEnd", [n.value.id]));
      }
    });
  }
}
const Un = { click_drag: function(t) {
  t.ext || (t.ext = {});
  const e = { className: "gantt_click_drag_rect", useRequestAnimationFrame: !0, callback: void 0, singleRow: !1 };
  function n() {
    const i = { viewPort: t.$task_data, ...e };
    t.ext.clickDrag && t.ext.clickDrag.destructor(), t.ext.clickDrag = new Nn(t);
    const a = t.config.click_drag;
    i.render = a.render || e.render, i.className = a.className || e.className, i.callback = a.callback || e.callback, i.viewPort = a.viewPort || t.$task_data, i.useRequestAnimationFrame = a.useRequestAnimationFrame === void 0 ? e.useRequestAnimationFrame : a.useRequestAnimationFrame, i.singleRow = a.singleRow === void 0 ? e.singleRow : a.singleRow;
    const r = t.$ui.getView("timeline"), s = new Rn(i, t, r);
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
  t.ext || (t.ext = {}), t.ext.dragTimeline = { create: () => $e.create(t) }, t.config.drag_timeline = { enabled: !0, render: !1 };
}, fullscreen: function(t) {
  function e() {
    const c = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    return !(!c || c !== document.body);
  }
  function n() {
    try {
      return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
    } catch (c) {
      console.error("Fullscreen is not available:", c);
    }
  }
  t.$services.getService("state").registerProvider("fullscreen", () => n() ? { fullscreen: e() } : void 0);
  let i = { overflow: null, padding: null, paddingTop: null, paddingRight: null, paddingBottom: null, paddingLeft: null };
  const a = { width: null, height: null, top: null, left: null, position: null, zIndex: null, modified: !1 };
  let r = null;
  function s(c, u) {
    u.width = c.width, u.height = c.height, u.top = c.top, u.left = c.left, u.position = c.position, u.zIndex = c.zIndex;
  }
  let o = !1;
  function l() {
    if (!t.$container) return;
    let c;
    e() ? o && (c = "onExpand", function() {
      const u = t.ext.fullscreen.getFullscreenElement(), h = document.body;
      s(u.style, a), i = { overflow: h.style.overflow, padding: h.style.padding ? h.style.padding : null, paddingTop: h.style.paddingTop ? h.style.paddingTop : null, paddingRight: h.style.paddingRight ? h.style.paddingRight : null, paddingBottom: h.style.paddingBottom ? h.style.paddingBottom : null, paddingLeft: h.style.paddingLeft ? h.style.paddingLeft : null }, h.style.padding && (h.style.padding = "0"), h.style.paddingTop && (h.style.paddingTop = "0"), h.style.paddingRight && (h.style.paddingRight = "0"), h.style.paddingBottom && (h.style.paddingBottom = "0"), h.style.paddingLeft && (h.style.paddingLeft = "0"), h.style.overflow = "hidden", u.style.width = "100vw", u.style.height = "100vh", u.style.top = "0px", u.style.left = "0px", u.style.position = "absolute", u.style.zIndex = 1, a.modified = !0, r = function(g) {
        let f = g.parentNode;
        const y = [];
        for (; f && f.style; ) y.push({ element: f, originalPositioning: f.style.position }), f.style.position = "static", f = f.parentNode;
        return y;
      }(u);
    }()) : o && (o = !1, c = "onCollapse", function() {
      const u = t.ext.fullscreen.getFullscreenElement(), h = document.body;
      a.modified && (i.padding && (h.style.padding = i.padding), i.paddingTop && (h.style.paddingTop = i.paddingTop), i.paddingRight && (h.style.paddingRight = i.paddingRight), i.paddingBottom && (h.style.paddingBottom = i.paddingBottom), i.paddingLeft && (h.style.paddingLeft = i.paddingLeft), h.style.overflow = i.overflow, i = { overflow: null, padding: null, paddingTop: null, paddingRight: null, paddingBottom: null, paddingLeft: null }, s(a, u.style), a.modified = !1), r.forEach((g) => {
        g.element.style.position = g.originalPositioning;
      }), r = null;
    }()), setTimeout(() => {
      t.render();
    }), setTimeout(() => {
      t.callEvent(c, [t.ext.fullscreen.getFullscreenElement()]);
    });
  }
  function d() {
    return !t.$container || !t.ext.fullscreen.getFullscreenElement() ? !0 : n() ? !1 : ((console.warning || console.log)("The `fullscreen` feature not being allowed, or full-screen mode not being supported"), !0);
  }
  t.ext.fullscreen = { expand() {
    if (d() || e() || !t.callEvent("onBeforeExpand", [this.getFullscreenElement()])) return;
    o = !0;
    const c = document.body, u = c.webkitRequestFullscreen ? [Element.ALLOW_KEYBOARD_INPUT] : [], h = c.msRequestFullscreen || c.mozRequestFullScreen || c.webkitRequestFullscreen || c.requestFullscreen;
    h && h.apply(c, u);
  }, collapse() {
    if (d() || !e() || !t.callEvent("onBeforeCollapse", [this.getFullscreenElement()])) return;
    const c = document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.exitFullscreen;
    c && c.apply(document);
  }, toggle() {
    d() || (e() ? this.collapse() : this.expand());
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
          for (var o = this.getWords(r[s]), l = this.createCommand(), d = 0; d < o.length; d++) this.commandKeys[o[d]] ? l.modifiers[o[d]] = !0 : this.specialKeys[o[d]] ? l.keyCode = this.specialKeys[o[d]] : l.keyCode = o[d].charCodeAt(0);
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
      n.$keyboardNavigation.getFocusableNodes = be, n.$keyboardNavigation.trapFocus = function(i, a) {
        if (a.keyCode != 9) return !1;
        for (var r = n.$keyboardNavigation.getFocusableNodes(i), s = ue(), o = -1, l = 0; l < r.length; l++) if (r[l] == s) {
          o = l;
          break;
        }
        if (a.shiftKey) {
          if (o <= 0) {
            var d = r[r.length - 1];
            if (d) return d.focus(), a.preventDefault(), !0;
          }
        } else if (o >= r.length - 1) {
          var c = r[0];
          if (c) return c.focus(), a.preventDefault(), !0;
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
        return n.$grid_scale.childNodes[this.index];
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
        ue().click();
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
          o = n.$task ? n.$task.offsetWidth : s.inner_width, l = n.$grid_data || n.$task_data ? (n.$grid_data || n.$task_data).offsetHeight : s.inner_height, a.top < s.y || a.top + r > s.y + l ? n.scrollTo(null, a.top - 20) : n.config.scroll_on_click && n.config.show_chart && (a.left > s.x + o ? n.scrollTo(a.left - n.config.task_scroll_offset) : a.left + a.width < s.x && n.scrollTo(a.left + a.width - n.config.task_scroll_offset));
        }
        n.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this, [i]), function() {
          var a = n.$ui.getView("grid"), r = parseInt(a.$grid.scrollLeft), s = parseInt(a.$grid_data.scrollTop), o = a.$config.scrollX;
          if (o && a.$config.scrollable) {
            var l = n.$ui.getView(o);
            l && l.scrollTo(r, s);
          }
          var d = a.$config.scrollY;
          if (d) {
            var c = n.$ui.getView(d);
            c && c.scrollTo(r, s);
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
        if (!(i = it(i, n.config.root_id))) {
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
          var r = 0, s = tt(i, "data-column-index");
          return s && (r = 1 * s.getAttribute("data-column-index")), new n.$keyboardNavigation.TaskCell(a, r);
        }
        return null;
      }, getNode: function() {
        if (n.isTaskExists(this.taskId) && (n.isTaskVisible(this.taskId) || n.config.show_tasks_outside_timescale)) {
          if (n.config.show_grid) {
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
    }(e), Hn(e), function(n) {
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
      n.isTaskFocused = function(v) {
        var b = n.activeNode;
        return (b instanceof e.$keyboardNavigation.TaskRow || b instanceof e.$keyboardNavigation.TaskCell) && b.taskId == v;
      };
      var i = function(v) {
        if (e.config.keyboard_navigation && (e.config.keyboard_navigation_cells || !s(v)) && !o(v) && !function(b) {
          return !!dt(b.target, ".gantt_cal_light");
        }(v)) return n.keyDownHandler(v);
      }, a = function(v) {
        if (n.$preventDefault) return v.preventDefault(), e.$container.blur(), !1;
        n.awaitsFocus() || n.focusGlobalNode();
      }, r = function() {
        if (!n.isEnabled()) return;
        const v = !G(document.activeElement, e.$container) && document.activeElement.localName != "body";
        var b = n.getActiveNode();
        if (b && !v) {
          var _, m, p = b.getNode();
          p && p.parentNode && (_ = p.parentNode.scrollTop, m = p.parentNode.scrollLeft), b.focus(!0), p && p.parentNode && (p.parentNode.scrollTop = _, p.parentNode.scrollLeft = m);
        }
      };
      function s(v) {
        return !!dt(v.target, ".gantt_grid_editor_placeholder");
      }
      function o(v) {
        return !!dt(v.target, ".no_keyboard_navigation");
      }
      function l(v) {
        if (!e.config.keyboard_navigation || !e.config.keyboard_navigation_cells && s(v)) return !0;
        if (!o(v)) {
          var b, _ = n.fromDomElement(v);
          _ && (n.activeNode instanceof e.$keyboardNavigation.TaskCell && G(v.target, e.$task) && (_ = new e.$keyboardNavigation.TaskCell(_.taskId, n.activeNode.columnIndex)), b = _), b ? n.isEnabled() ? n.delay(function() {
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
      var d = e.attachEvent("onGanttReady", function() {
        if (e.detachEvent(d), e.$data.tasksStore.attachEvent("onStoreUpdated", function(b) {
          if (e.config.keyboard_navigation && n.isEnabled()) {
            const _ = n.getActiveNode(), m = e.$ui.getView("grid"), p = m.getItemTop(b), k = m.$grid_data.scrollTop, $ = k + m.$grid_data.getBoundingClientRect().height;
            _ && _.taskId == b && k <= p && $ >= p && r();
          }
        }), e._smart_render) {
          var v = e._smart_render._redrawTasks;
          e._smart_render._redrawTasks = function(b, _) {
            if (e.config.keyboard_navigation && n.isEnabled()) {
              var m = n.getActiveNode();
              if (m && m.taskId !== void 0) {
                for (var p = !1, k = 0; k < _.length; k++) if (_[k].id == m.taskId && _[k].start_date) {
                  p = !0;
                  break;
                }
                p || _.push(e.getTask(m.taskId));
              }
            }
            return v.apply(this, arguments);
          };
        }
      });
      let c = null, u = !1;
      e.attachEvent("onTaskCreated", function(v) {
        return c = v.id, !0;
      }), e.attachEvent("onAfterTaskAdd", function(v, b) {
        if (!e.config.keyboard_navigation) return !0;
        if (n.isEnabled()) {
          if (v == c && (u = !0, setTimeout(() => {
            u = !1, c = null;
          })), u && b.type == e.config.types.placeholder) return;
          var _ = 0, m = n.activeNode;
          m instanceof e.$keyboardNavigation.TaskCell && (_ = m.columnIndex);
          var p = e.config.keyboard_navigation_cells ? e.$keyboardNavigation.TaskCell : e.$keyboardNavigation.TaskRow;
          b.type == e.config.types.placeholder && e.config.placeholder_task.focusOnCreate === !1 || n.setActiveNode(new p(v, _));
        }
      }), e.attachEvent("onTaskIdChange", function(v, b) {
        if (!e.config.keyboard_navigation) return !0;
        var _ = n.activeNode;
        return n.isTaskFocused(v) && (_.taskId = b), !0;
      });
      var h = setInterval(function() {
        e.config.keyboard_navigation && (n.isEnabled() || n.enable());
      }, 500);
      function g(v) {
        var b = { gantt: e.$keyboardNavigation.GanttNode, headerCell: e.$keyboardNavigation.HeaderCell, taskRow: e.$keyboardNavigation.TaskRow, taskCell: e.$keyboardNavigation.TaskCell };
        return b[v] || b.gantt;
      }
      function f(v) {
        for (var b = e.getGridColumns(), _ = 0; _ < b.length; _++) if (b[_].name == v) return _;
        return 0;
      }
      e.attachEvent("onDestroy", function() {
        clearInterval(h);
      });
      var y = {};
      st(y), e.mixin(y, { addShortcut: function(v, b, _) {
        var m = g(_);
        m && m.prototype.bind(v, b);
      }, getShortcutHandler: function(v, b) {
        var _ = e.$keyboardNavigation.shortcuts.parse(v);
        if (_.length) return y.getCommandHandler(_[0], b);
      }, getCommandHandler: function(v, b) {
        var _ = g(b);
        if (_ && v) return _.prototype.findHandler(v);
      }, removeShortcut: function(v, b) {
        var _ = g(b);
        _ && _.prototype.unbind(v);
      }, focus: function(v) {
        var b, _ = v ? v.type : null, m = g(_);
        switch (_) {
          case "taskCell":
            b = new m(v.id, f(v.column));
            break;
          case "taskRow":
            b = new m(v.id);
            break;
          case "headerCell":
            b = new m(f(v.column));
        }
        n.delay(function() {
          b ? n.setActiveNode(b) : (n.enable(), n.getActiveNode() ? n.awaitsFocus() || n.enable() : n.setDefaultNode());
        });
      }, getActiveNode: function() {
        if (n.isEnabled()) {
          var v = n.getActiveNode(), b = (m = v) instanceof e.$keyboardNavigation.GanttNode ? "gantt" : m instanceof e.$keyboardNavigation.HeaderCell ? "headerCell" : m instanceof e.$keyboardNavigation.TaskRow ? "taskRow" : m instanceof e.$keyboardNavigation.TaskCell ? "taskCell" : null, _ = e.getGridColumns();
          switch (b) {
            case "taskCell":
              return { type: "taskCell", id: v.taskId, column: _[v.columnIndex].name };
            case "taskRow":
              return { type: "taskRow", id: v.taskId };
            case "headerCell":
              return { type: "headerCell", column: _[v.index].name };
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
  t.ext || (t.ext = {}), t.ext.quickInfo = new On(t), t.config.quickinfo_buttons = ["icon_edit", "icon_delete"], t.config.quick_info_detached = !0, t.config.show_quick_info = !0, t.templates.quick_info_title = function(a, r, s) {
    return s.text.substr(0, 50);
  }, t.templates.quick_info_content = function(a, r, s) {
    return s.details || s.text;
  }, t.templates.quick_info_date = function(a, r, s) {
    return t.templates.task_time(a, r, s);
  }, t.templates.quick_info_class = function(a, r, s) {
    return "";
  }, t.attachEvent("onTaskClick", function(a, r) {
    return t.utils.dom.closest(r.target, ".gantt_add") || setTimeout(function() {
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
  const e = new jn(t);
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
  const e = new Vn(t), n = new Fn(e, t);
  function i(d, c, u) {
    d && (d.id === c && (d.id = u), d.parent === c && (d.parent = u));
  }
  function a(d, c, u) {
    i(d.value, c, u), i(d.oldValue, c, u);
  }
  function r(d, c, u) {
    d && (d.source === c && (d.source = u), d.target === c && (d.target = u));
  }
  function s(d, c, u) {
    r(d.value, c, u), r(d.oldValue, c, u);
  }
  function o(d, c, u) {
    const h = e;
    for (let g = 0; g < d.length; g++) {
      const f = d[g];
      for (let y = 0; y < f.commands.length; y++) f.commands[y].entity === h.command.entity.task ? a(f.commands[y], c, u) : f.commands[y].entity === h.command.entity.link && s(f.commands[y], c, u);
    }
  }
  function l(d, c, u) {
    const h = e;
    for (let g = 0; g < d.length; g++) {
      const f = d[g];
      for (let y = 0; y < f.commands.length; y++) {
        const v = f.commands[y];
        v.entity === h.command.entity.link && (v.value && v.value.id === c && (v.value.id = u), v.oldValue && v.oldValue.id === c && (v.oldValue.id = u));
      }
    }
  }
  t.config.undo = !0, t.config.redo = !0, t.config.undo_types = { link: "link", task: "task" }, t.config.undo_actions = { update: "update", remove: "remove", add: "add", move: "move" }, t.ext || (t.ext = {}), t.ext.undo = { undo: () => e.undo(), redo: () => e.redo(), getUndoStack: () => e.getUndoStack(), setUndoStack: (d) => e.setUndoStack(d), getRedoStack: () => e.getRedoStack(), setRedoStack: (d) => e.setRedoStack(d), clearUndoStack: () => e.clearUndoStack(), clearRedoStack: () => e.clearRedoStack(), saveState: (d, c) => n.store(d, c, !0), getInitialState: (d, c) => c === t.config.undo_types.link ? n.getInitialLink(d) : n.getInitialTask(d) }, t.undo = t.ext.undo.undo, t.redo = t.ext.undo.redo, t.getUndoStack = t.ext.undo.getUndoStack, t.getRedoStack = t.ext.undo.getRedoStack, t.clearUndoStack = t.ext.undo.clearUndoStack, t.clearRedoStack = t.ext.undo.clearRedoStack, t.attachEvent("onTaskIdChange", (d, c) => {
    const u = e;
    o(u.getUndoStack(), d, c), o(u.getRedoStack(), d, c);
  }), t.attachEvent("onLinkIdChange", (d, c) => {
    const u = e;
    l(u.getUndoStack(), d, c), l(u.getRedoStack(), d, c);
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
      var d = t.posFromDate(i.end_date);
      r.style.width = Math.max(d - o, 0) + "px";
    }
    return i.text && (r.innerHTML = "<div class='gantt_marker_content' >" + i.text + "</div>"), r;
  }
  function n() {
    if (t.$task_data) {
      var i = document.createElement("div");
      i.className = "gantt_marker_area", t.$task_data.appendChild(i), t.$marker_area = i;
    }
  }
  t._markers || (t._markers = t.createDatastore({ name: "marker", initItem: function(i) {
    return i.id = i.id || t.uid(), i;
  } })), t.config.show_markers = !0, t.attachEvent("onBeforeGanttRender", function() {
    t.$marker_area || n();
  }), t.attachEvent("onDataRender", function() {
    t.$marker_area || (n(), t.renderMarkers());
  }), t.attachEvent("onGanttLayoutReady", function() {
    t.attachEvent("onBeforeGanttRender", function() {
      n(), t.$services.getService("layers").createDataRender({ name: "marker", defaultContainer: function() {
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
      var c = t.ext.inlineEditors, u = c.getState(), h = c.locateCell(e.target);
      t.config.inline_editors_multiselect_open && h && c.getEditorConfig(h.columnName) && (c.isVisible() && u.id == h.id && u.columnName == h.columnName || c.startEdit(h.id, h.columnName)), this.setFirstSelected(n), this.isSelected(n) || this.select(n, e), i = this.getSelected();
      for (var g = 0; g < i.length; g++) i[g] !== n && this.unselect(i[g], e);
    }).bind(this), d = (function() {
      if (s) {
        if (n) {
          var c = t.getGlobalTaskIndex(this.getFirstSelected()), u = t.getGlobalTaskIndex(n), h = t.getGlobalTaskIndex(s);
          c != -1 && h != -1 || (c = u, this.reset());
          for (var g = s; t.getGlobalTaskIndex(g) !== c; ) this.unselect(g, e), g = c > h ? t.getNext(g) : t.getPrev(g);
          for (g = n; t.getGlobalTaskIndex(g) !== c; ) this.select(g, e) && !r && (r = !0, a = g), g = c > u ? t.getNext(g) : t.getPrev(g);
        }
      } else s = n;
    }).bind(this);
    return o && (e.ctrlKey || e.metaKey) ? (this.isSelected(n) || this.setFirstSelected(n), n && this.toggle(n, e)) : o && e.shiftKey ? (t.isTaskExists(this.getFirstSelected()) && this.getFirstSelected() !== null || this.setFirstSelected(n), i.length ? d() : l()) : l(), this.isSelected(n) ? this.setLastSelected(n) : a ? n == s && this.setLastSelected(e.shiftKey ? a : this.getDefaultSelected()) : this.setLastSelected(null), this.getSelected().length || this.setLastSelected(null), this.getLastSelected() && this.isSelected(this.getFirstSelected()) || this.setFirstSelected(this.getLastSelected()), !0;
  } }, function() {
    var e = t.selectTask;
    t.selectTask = function(i) {
      if (!(i = it(i, this.config.root_id))) return !1;
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
            const d = i(o, r[l]);
            d && n.data[s].styles.push({ index: l, styles: t.ext.export_api._getStyles(d) });
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
      const d = [];
      n.push(d);
      const c = i[s];
      r = Math.max(r, c.trace_x.length);
      const u = c.format || c.template || (c.date ? t.date.date_to_str(c.date) : t.config.date_scale);
      for (let h = 0; h < c.trace_x.length; h++) {
        const g = c.trace_x[h];
        l = o + Math.round(c.width[h] / a);
        const f = { text: u(g), start: o, end: l, styles: "" };
        if (e.cellColors) {
          const y = c.css || t.templates.scaleCell_class;
          if (y) {
            const v = y(g);
            v && (f.styles = t.ext.export_api._getStyles(v));
          }
        }
        d.push(f), o = l;
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
    for (let d = 0; d < o.length; d++) {
      if (r[o[d]]) continue;
      const c = n[o[d]], u = i[c._target];
      l[u.id] && t.ext.export_api._onCircDependencyFind(c, n, a, r), l[u.id] = !0, t.ext.export_api._clearCircDependencies(u, n, i, a, r, c);
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
} }, qn = { KEY_CODES: { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, SPACE: 32, ENTER: 13, DELETE: 46, ESC: 27, TAB: 9 } };
class Gn {
  constructor(e) {
    this.addExtension = (n, i) => {
      this._extensions[n] = i;
    }, this.getExtension = (n) => this._extensions[n], this._extensions = {};
    for (const n in e) this._extensions[n] = e[n];
  }
}
const Yn = () => ({ layout: { css: "gantt_container", rows: [{ cols: [{ view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" }, { resizer: !0, width: 1 }, { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" }, { view: "scrollbar", id: "scrollVer" }] }, { view: "scrollbar", id: "scrollHor", height: 20 }] }, links: { finish_to_start: "0", start_to_start: "1", finish_to_finish: "2", start_to_finish: "3" }, types: { task: "task", project: "project", milestone: "milestone" }, auto_types: !1, duration_unit: "day", work_time: !1, correct_work_time: !1, skip_off_time: !1, cascade_delete: !0, autosize: !1, autosize_min_width: 0, autoscroll: !0, autoscroll_speed: 30, deepcopy_on_parse: !1, show_links: !0, show_task_cells: !0, static_background: !1, static_background_cells: !0, branch_loading: !1, branch_loading_property: "$has_child", show_loading: !1, show_chart: !0, show_grid: !0, min_duration: 36e5, date_format: "%d-%m-%Y %H:%i", xml_date: void 0, start_on_monday: !0, server_utc: !1, show_progress: !0, fit_tasks: !1, select_task: !0, scroll_on_click: !0, smart_rendering: !0, preserve_scroll: !0, readonly: !1, container_resize_timeout: 20, deadlines: !0, date_grid: "%Y-%m-%d", drag_links: !0, drag_progress: !0, drag_resize: !0, drag_project: !1, drag_move: !0, drag_mode: { resize: "resize", progress: "progress", move: "move", ignore: "ignore" }, round_dnd_dates: !0, link_wrapper_width: 20, link_arrow_size: 12, root_id: 0, autofit: !1, columns: [{ name: "text", tree: !0, width: "*", resize: !0 }, { name: "start_date", align: "center", resize: !0 }, { name: "duration", align: "center" }, { name: "add", width: 44 }], scale_offset_minimal: !0, inherit_scale_class: !1, scales: [{ unit: "day", step: 1, date: "%d %M" }], time_step: 60, duration_step: 1, task_date: "%d %F %Y", time_picker: "%H:%i", task_attribute: "data-task-id", link_attribute: "data-link-id", layer_attribute: "data-layer", buttons_left: ["gantt_save_btn", "gantt_cancel_btn"], _migrate_buttons: { dhx_save_btn: "gantt_save_btn", dhx_cancel_btn: "gantt_cancel_btn", dhx_delete_btn: "gantt_delete_btn" }, buttons_right: ["gantt_delete_btn"], lightbox: { sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "time", type: "duration", map_to: "auto" }], project_sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "type", type: "typeselect", map_to: "type" }, { name: "time", type: "duration", readonly: !0, map_to: "auto" }], milestone_sections: [{ name: "description", height: 70, map_to: "text", type: "textarea", focus: !0 }, { name: "type", type: "typeselect", map_to: "type" }, { name: "time", type: "duration", single_date: !0, map_to: "auto" }] }, drag_lightbox: !0, sort: !1, details_on_create: !0, details_on_dblclick: !0, initial_scroll: !0, task_scroll_offset: 100, order_branch: !1, order_branch_free: !1, task_height: void 0, bar_height: "full", bar_height_padding: 9, min_column_width: 70, min_grid_column_width: 70, grid_resizer_column_attribute: "data-column-index", keep_grid_width: !1, grid_resize: !1, grid_elastic_columns: !1, show_tasks_outside_timescale: !1, show_unscheduled: !0, resize_rows: !1, task_grid_row_resizer_attribute: "data-row-index", min_task_grid_row_height: 30, row_height: 36, readonly_property: "readonly", editable_property: "editable", calendar_property: "calendar_id", resource_calendars: {}, dynamic_resource_calendars: !1, inherit_calendar: !1, type_renderers: {}, open_tree_initially: !1, optimize_render: !0, prevent_default_scroll: !1, show_errors: !0, wai_aria_attributes: !0, smart_scales: !0, rtl: !1, placeholder_task: !1, horizontal_scroll_key: "shiftKey", drag_timeline: { useKey: void 0, ignore: ".gantt_task_line, .gantt_task_link", render: !1 }, drag_multiple: !0, csp: "auto" });
var et = typeof window < "u";
const mt = { isIE: et && (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0), isIE6: et && !XMLHttpRequest && navigator.userAgent.indexOf("MSIE") >= 0, isIE7: et && navigator.userAgent.indexOf("MSIE 7.0") >= 0 && navigator.userAgent.indexOf("Trident") < 0, isIE8: et && navigator.userAgent.indexOf("MSIE 8.0") >= 0 && navigator.userAgent.indexOf("Trident") >= 0, isOpera: et && navigator.userAgent.indexOf("Opera") >= 0, isChrome: et && navigator.userAgent.indexOf("Chrome") >= 0, isKHTML: et && (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0), isFF: et && navigator.userAgent.indexOf("Firefox") >= 0, isIPad: et && navigator.userAgent.search(/iPad/gi) >= 0, isEdge: et && navigator.userAgent.indexOf("Edge") != -1, isNode: !et || typeof navigator > "u" || !1 };
function Me(t) {
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
  if (e.length === 1) return typeof e[0] == "string" ? (n.url = e[0], n.async = !0) : (n.url = e[0].url, n.async = e[0].async || !0, n.callback = e[0].callback, n.headers = e[0].headers), e[0].data ? typeof e[0].data != "string" ? n.data = Me(e[0].data) : n.data = e[0].data : n.data = "", n;
  switch (n.url = e[0], t) {
    case "GET":
    case "DELETE":
      n.callback = e[1], n.headers = e[2];
      break;
    case "POST":
    case "PUT":
      e[1] ? typeof e[1] != "string" ? n.data = Me(e[1]) : n.data = e[1] : n.data = "", n.callback = e[2], n.headers = e[3];
  }
  return n;
}
const Ne = { date_to_str: (t, e, n) => {
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
} }, Le = { date_to_str: (t, e, n) => (i) => t.replace(/%[a-zA-Z]/g, (a) => {
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
function Jn(t) {
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
    var o = r >= 0, l = !s.getHours() && a.getHours(), d = a.getDate() <= s.getDate() || a.getMonth() < s.getMonth() || a.getFullYear() < s.getFullYear();
    return o && l && d && a.setTime(a.getTime() + 36e5 * (24 - a.getHours())), r > 1 && l && a.setHours(0), a;
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
    var s = Ne;
    return n() && (s = Le), s.date_to_str(a, r, t);
  }, str_to_date: function(a, r) {
    var s = Ne;
    return n() && (s = Le), s.str_to_date(a, r, t);
  }, getISOWeek: function(a) {
    return t.date._getWeekNumber(a, !0);
  }, _getWeekNumber: function(a, r) {
    if (!a) return !1;
    var s = a.getDay();
    r && s === 0 && (s = 7);
    var o = new Date(a.valueOf());
    o.setDate(a.getDate() + (4 - s));
    var l = o.getFullYear(), d = Math.round((o.getTime() - new Date(l, 0, 1).getTime()) / 864e5);
    return 1 + Math.floor(d / 7);
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
class Kn {
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
      return l.onclose = () => setTimeout(() => n.connect(), 2e3), l.onmessage = (d) => {
        const c = JSON.parse(d.data);
        switch (c.action) {
          case "result":
            n.result(c.body, []);
            break;
          case "event":
            n.fire(c.body.name, c.body.value);
            break;
          case "start":
            r();
            break;
          default:
            n.onError(c.data);
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
const Xn = function(t, e) {
  const n = new Kn({ url: t, token: e });
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
function cn(t, e) {
  if (!e) return !0;
  if (t._on_timeout) return !1;
  var n = Math.ceil(1e3 / e);
  return n < 2 || (setTimeout(function() {
    delete t._on_timeout;
  }, n), t._on_timeout = !0), !0;
}
var Zn = function() {
  var t = {};
  return { getState: function(e) {
    if (t[e]) return t[e].method();
    var n = {};
    for (var i in t) t[i].internal || N(n, t[i].method(), !0);
    return n;
  }, registerProvider: function(e, n, i) {
    t[e] = { method: n, internal: i };
  }, unregisterProvider: function(e) {
    delete t[e];
  } };
};
const Qn = Promise;
var Q = { $create: function(t) {
  return N(t || [], this);
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
function Pt(t, e, n, i) {
  return (i = e ? e.config : i) && i.placeholder_task && n.exists(t) ? n.getItem(t).type === i.types.placeholder : !1;
}
var nt = function(t) {
  return this.pull = {}, this.$initItem = t.initItem, this.visibleOrder = Q.$create(), this.fullOrder = Q.$create(), this._skip_refresh = !1, this._filterRule = null, this._searchVisibleOrder = {}, this._indexRangeCache = {}, this._getItemsCache = null, this.$config = t, st(this), this._attachDataChange(function() {
    return this._indexRangeCache = {}, this._getItemsCache = null, !0;
  }), this;
};
nt.prototype = { _attachDataChange: function(t) {
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
  N(this.pull[t], e, !0), this.isSilent() || (this.callEvent("onAfterUpdate", [e.id, e]), this.callEvent("onStoreUpdated", [e.id, e, "update"]));
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
  this.pull[t.id] = t, this.isSilent() || this._updateOrder(function() {
    this.$find(t.id) === -1 && this.$insertAt(t.id, e);
  }), this.filter();
}, isVisible: function(t) {
  return this.visibleOrder.$find(t) > -1;
}, getVisibleItems: function() {
  return this.getIndexRange();
}, addItem: function(t, e) {
  return W(t.id) || (t.id = rt()), this.$initItem && (t = this.$initItem(t)), !(!this.isSilent() && this.callEvent("onBeforeAdd", [t.id, t]) === !1) && (this._addItemInner(t, e), this.isSilent() || (this.callEvent("onAfterAdd", [t.id, t]), this.callEvent("onStoreUpdated", [t.id, t, "add"])), t.id);
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
  }), this.pull = {}, this.visibleOrder = Q.$create(), this.fullOrder = Q.$create(), this.isSilent() || (this.callEvent("onClearAll", []), this.refresh()));
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
  if (!this.isSilent() && (t && (n = this.getItem(t)), i = t ? [t, n, "paint"] : [null, null, null], this.callEvent("onBeforeStoreUpdate", i) !== !1)) {
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
  var e = Q.$create(), n = [];
  this.eachItem(function(a) {
    this.callEvent("onFilterItem", [a.id, a]) && (Pt(a.id, null, this, this._ganttConfig) ? n.push(a.id) : e.push(a.id));
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
var un = function(t) {
  var e;
  nt.apply(this, [t]), this._branches = {}, this.pull = {}, this.$initItem = function(o) {
    var l = o;
    t.initItem && (l = t.initItem(l));
    var d = this.getItem(o.id);
    return d && !ot(d.parent, l.parent) && this.move(l.id, l.$index || -1, l.parent || this._ganttConfig.root_id), l;
  }, this.$parentProperty = t.parentProperty || "parent", typeof t.rootId != "function" ? this.$getRootId = (e = t.rootId || 0, function() {
    return e;
  }) : this.$getRootId = t.rootId, this.$openInitially = t.openInitially, this.visibleOrder = Q.$create(), this.fullOrder = Q.$create(), this._searchVisibleOrder = {}, this._indexRangeCache = {}, this._eachItemMainRangeCache = null, this._getItemsCache = null, this._skip_refresh = !1, this._ganttConfig = null, t.getConfig && (this._ganttConfig = t.getConfig());
  var n = {}, i = {}, a = {}, r = {}, s = !1;
  return this._attachDataChange(function() {
    return this._indexRangeCache = {}, this._eachItemMainRangeCache = null, this._getItemsCache = null, !0;
  }), this.attachEvent("onPreFilter", function() {
    this._indexRangeCache = {}, this._eachItemMainRangeCache = null, n = {}, i = {}, a = {}, r = {}, s = !1, this.eachItem(function(o) {
      var l = this.getParent(o.id);
      o.$open && a[l] !== !1 ? a[o.id] = !0 : a[o.id] = !1, this._isSplitItem(o) && (s = !0, n[o.id] = !0, i[o.id] = !0), s && i[l] && (i[o.id] = !0), a[l] || a[l] === void 0 ? r[o.id] = !0 : r[o.id] = !1;
    });
  }), this.attachEvent("onFilterItem", function(o, l) {
    var d = !1;
    this._ganttConfig && (d = this._ganttConfig.open_split_tasks);
    var c = r[l.id];
    return s && (c && i[l.id] && !n[l.id] && (c = !!d), i[l.id] && !n[l.id] && (l.$split_subtask = !0)), l.$expanded_branch = !!r[l.id], !!c;
  }), this.attachEvent("onFilter", function() {
    n = {}, i = {}, a = {}, r = {};
  }), this;
};
function ot(t, e) {
  return String(t) === String(e);
}
function j(t) {
  return mt.isNode || !t.$root;
}
un.prototype = N({ _buildTree: function(t) {
  for (var e = null, n = this.$getRootId(), i = 0, a = t.length; i < a; i++) e = t[i], this.setParent(e, it(this.getParent(e), n) || n);
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
  1 * i !== i && (i = void 0), nt.prototype._addItemInner.call(this, t, i), this.setParent(t, n), t.hasOwnProperty("$rendered_parent") && this._move_branch(t, t.$rendered_parent), this._add_branch(t, e);
}, _changeIdInner: function(t, e) {
  var n = this.getChildren(t), i = this._searchVisibleOrder[t];
  nt.prototype._changeIdInner.call(this, t, e);
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
  this.fullOrder = Q.$create(), this._traverseBranches(function(e) {
    this.fullOrder.push(e);
  }), t && nt.prototype._updateOrder.call(this, t);
}, _removeItemInner: function(t) {
  var e = [];
  this.eachItem(function(i) {
    e.push(i);
  }, t), e.push(this.getItem(t));
  for (var n = 0; n < e.length; n++) this._move_branch(e[n], this.getParent(e[n]), null), nt.prototype._removeItemInner.call(this, e[n].id), this._move_branch(e[n], this.getParent(e[n]), null);
}, move: function(t, e, n) {
  var i = arguments[3], a = (this._ganttConfig || {}).root_id || 0;
  if (i = it(i, a)) {
    if (i === t) return;
    n = this.getParent(i), e = this.getBranchIndex(i);
  }
  if (!ot(t, n)) {
    W(n) || (n = this.$getRootId());
    var r = this.getItem(t), s = this.getParent(r.id), o = this.getChildren(n);
    if (e == -1 && (e = o.length + 1), ot(s, n) && this.getBranchIndex(t) == e) return;
    if (this.callEvent("onBeforeItemMove", [t, n, e]) === !1) return !1;
    for (var l = [], d = 0; d < o.length; d++) Pt(o[d], null, this, this._ganttConfig) && (l.push(o[d]), o.splice(d, 1), d--);
    this._replace_branch_child(s, t);
    var c = (o = this.getChildren(n))[e];
    (c = it(c, a)) ? o = o.slice(0, e).concat([t]).concat(o.slice(e)) : o.push(t), l.length && (o = o.concat(l)), ot(r.$rendered_parent, s) || ot(s, n) || (r.$rendered_parent = s), this.setParent(r, n), this._branches[n] = o;
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
  return e || Q.$create();
}, isChildOf: function(t, e) {
  if (!this.exists(t)) return !1;
  if (e === this.$getRootId()) return !0;
  if (!this.hasChild(e)) return !1;
  var n = this.getItem(t), i = this.getParent(t);
  if (this.getItem(e).$level >= n.$level) return !1;
  for (; n && this.exists(i); ) {
    if ((n = this.getItem(i)) && ot(n.id, e)) return !0;
    i = this.getParent(n);
  }
  return !1;
}, getSiblings: function(t) {
  if (!this.exists(t)) return Q.$create();
  var e = this.getParent(t);
  return this.getChildren(e);
}, getNextSibling: function(t) {
  for (var e = this.getSiblings(t), n = 0, i = e.length; n < i; n++) if (ot(e[n], t)) {
    var a = e[n + 1];
    return a === 0 && n > 0 && (a = "0"), a || null;
  }
  return null;
}, getPrevSibling: function(t) {
  for (var e = this.getSiblings(t), n = 0, i = e.length; n < i; n++) if (ot(e[n], t)) {
    var a = e[n - 1];
    return a === 0 && n > 0 && (a = "0"), a || null;
  }
  return null;
}, getParent: function(t) {
  var e = null;
  return (e = t.id !== void 0 ? t : this.getItem(t)) ? e[this.$parentProperty] : this.$getRootId();
}, clearAll: function() {
  this._branches = {}, nt.prototype.clearAll.call(this);
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
  var i = it(e, n) || n, a = !1, r = !1, s = null;
  i === n && (this._eachItemMainRangeCache ? (a = !0, s = this._eachItemMainRangeCache) : (r = !0, s = this._eachItemMainRangeCache = [])), a ? this._eachItemCached(t, s) : this._eachItemIterate(t, i, r ? s : null);
}, eachParent: function(t, e) {
  for (var n = {}, i = e, a = this.getParent(i); this.exists(a); ) {
    if (n[a]) throw new Error("Invalid tasks tree. Cyclic reference has been detected on task " + a);
    n[a] = !0, i = this.getItem(a), t.call(this, i), a = this.getParent(i);
  }
}, _add_branch: function(t, e, n) {
  var i = n === void 0 ? this.getParent(t) : n;
  this.hasChild(i) || (this._branches[i] = Q.$create());
  var a = this.getChildren(i);
  a.indexOf(t.id + "") > -1 || a.indexOf(+t.id) > -1 || (1 * e == e ? a.splice(e, 0, t.id) : a.push(t.id), t.$rendered_parent = i);
}, _move_branch: function(t, e, n) {
  this._eachItemMainRangeCache = null, this._replace_branch_child(e, t.id), this.exists(n) || ot(n, this.$getRootId()) ? this._add_branch(t, void 0, n) : delete this._branches[t.id], t.$level = this.calculateItemLevel(t), this.eachItem(function(i) {
    i.$level = this.calculateItemLevel(i);
  }, t.id);
}, _replace_branch_child: function(t, e, n) {
  var i = this.getChildren(t);
  if (i && t !== void 0) {
    var a = Q.$create();
    let r = i.indexOf(e + "");
    r != -1 || isNaN(+e) || (r = i.indexOf(+e)), r > -1 && (n ? i.splice(r, 1, n) : i.splice(r, 1)), a = i, this._branches[t] = a;
  }
}, sort: function(t, e, n) {
  this.exists(n) || (n = this.$getRootId()), t || (t = "order");
  var i = typeof t == "string" ? function(l, d) {
    return l[t] == d[t] || X(l[t]) && X(d[t]) && l[t].valueOf() == d[t].valueOf() ? 0 : l[t] > d[t] ? 1 : -1;
  } : t;
  if (e) {
    var a = i;
    i = function(l, d) {
      return a(d, l);
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
    ot(n, i) || this._move_branch(this.pull[e], n, i);
  }
  return nt.prototype.filter.apply(this, arguments);
}, open: function(t) {
  this.exists(t) && (this.getItem(t).$open = !0, this._skipTaskRecalculation = !0, this.callEvent("onItemOpen", [t]));
}, close: function(t) {
  this.exists(t) && (this.getItem(t).$open = !1, this._skipTaskRecalculation = !0, this.callEvent("onItemClose", [t]));
}, destructor: function() {
  nt.prototype.destructor.call(this), this._branches = null, this._indexRangeCache = {}, this._eachItemMainRangeCache = null;
} }, nt.prototype);
const ti = function(t, e) {
  const n = e.getDatastore(t), i = function(o, l) {
    const d = l.getLayers(), c = n.getItem(o);
    if (c && n.isVisible(o)) for (let u = 0; u < d.length; u++) d[u].render_item(c);
  }, a = function(o) {
    const l = o.getLayers();
    for (let g = 0; g < l.length; g++) l[g].clear();
    let d = null;
    const c = {};
    for (let g = 0; g < l.length; g++) {
      const f = l[g];
      let y;
      if (f.get_visible_range) {
        var u = f.get_visible_range(n);
        if (u.start !== void 0 && u.end !== void 0) {
          var h = u.start + " - " + u.end;
          c[h] ? y = c[h] : (y = n.getIndexRange(u.start, u.end), c[h] = y);
        } else {
          if (u.ids === void 0) throw new Error("Invalid range returned from 'getVisibleRange' of the layer");
          y = u.ids.map(function(v) {
            return n.getItem(v);
          });
        }
      } else d || (d = n.getVisibleItems()), y = d;
      f.prepare_data && f.prepare_data(y), l[g].render_items(y);
    }
  }, r = function(o) {
    if (o.update_items) {
      let d = [];
      if (o.get_visible_range) {
        var l = o.get_visible_range(n);
        if (l.start !== void 0 && l.end !== void 0 && (d = n.getIndexRange(l.start, l.end)), l.ids !== void 0) {
          let c = l.ids.map(function(u) {
            return n.getItem(u);
          });
          c.length > 0 && (c = c.filter((u) => u !== void 0), d = d.concat(c));
        }
        if ((l.start == null || l.end == null) && l.ids == null) throw new Error("Invalid range returned from 'getVisibleRange' of the layer");
      } else d = n.getVisibleItems();
      o.prepare_data && o.prepare_data(d, o), o.update_items(d);
    }
  };
  function s(o) {
    return !!o.$services.getService("state").getState("batchUpdate").batch_update;
  }
  n.attachEvent("onStoreUpdated", function(o, l, d) {
    if (j(e)) return !0;
    const c = e.$services.getService("layers").getDataRender(t);
    c && (c.onUpdateRequest = function(u) {
      r(u);
    });
  }), n.attachEvent("onStoreUpdated", function(o, l, d) {
    s(e) || (o && d != "move" && d != "delete" ? (n.callEvent("onBeforeRefreshItem", [l.id]), n.callEvent("onAfterRefreshItem", [l.id])) : (n.callEvent("onBeforeRefreshAll", []), n.callEvent("onAfterRefreshAll", [])));
  }), n.attachEvent("onAfterRefreshAll", function() {
    if (j(e)) return !0;
    const o = e.$services.getService("layers").getDataRender(t);
    o && !s(e) && a(o);
  }), n.attachEvent("onAfterRefreshItem", function(o) {
    if (j(e)) return !0;
    const l = e.$services.getService("layers").getDataRender(t);
    l && i(o, l);
  }), n.attachEvent("onItemOpen", function() {
    if (j(e)) return !0;
    e.render();
  }), n.attachEvent("onItemClose", function() {
    if (j(e)) return !0;
    e.render();
  }), n.attachEvent("onIdChange", function(o, l) {
    if (j(e)) return !0;
    if (n.callEvent("onBeforeIdChange", [o, l]), !s(e) && !n.isSilent()) {
      const d = e.$services.getService("layers").getDataRender(t);
      d ? (function(c, u, h) {
        for (let g = 0; g < c.length; g++) c[g].change_id(u, h);
      }(d.getLayers(), o, l, n.getItem(l)), i(l, d)) : e.render();
    }
  });
};
function Qt() {
  for (var t = this.$services.getService("datastores"), e = [], n = 0; n < t.length; n++) {
    var i = this.getDatastore(t[n]);
    i.$destroyed || e.push(i);
  }
  return e;
}
const ei = { create: function() {
  var t = N({}, { createDatastore: function(e) {
    var n = (e.type || "").toLowerCase() == "treedatastore" ? un : nt;
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
      var l = null, d = o._removeItemInner;
      function c(u) {
        l = null, this.callEvent("onAfterUnselect", [u]);
      }
      return o._removeItemInner = function(u) {
        return l == u && c.call(this, u), l && this.eachItem && this.eachItem(function(h) {
          h.id == l && c.call(this, h.id);
        }, u), d.apply(this, arguments);
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
        (u = u || l) && (l = null, this._skip_refresh || (this.refresh(u), c.call(this, u)));
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
      }), s.push(e.name)), ti(e.name, this);
    }
    return a;
  }, getDatastore: function(e) {
    return this.$services.getService("datastore:" + e);
  }, _getDatastores: Qt, refreshData: function() {
    var e;
    j(this) || (e = this.getScrollState()), this.callEvent("onBeforeDataRender", []);
    for (var n = Qt.call(this), i = 0; i < n.length; i++) n[i].refresh();
    this.config.preserve_scroll && !j(this) && (e.x || e.y) && this.scrollTo(e.x, e.y), this.callEvent("onDataRender", []);
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
    for (var e = Qt.call(this), n = 0; n < e.length; n++) e[n].silent(function() {
      e[n].clearAll();
    });
    for (n = 0; n < e.length; n++) e[n].clearAll();
    this._update_flags(), this.userdata = {}, this.callEvent("onClear", []), this.render();
  }, _clear_data: function() {
    this.$data.tasksStore.clearAll(), this.$data.linksStore.clearAll(), this._update_flags(), this.userdata = {};
  }, selectTask: function(e) {
    var n = this.$data.tasksStore;
    if (!this.config.select_task) return !1;
    if (e = it(e, this.config.root_id)) {
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
  return N(t, { getTask: function(e) {
    e = it(e, this.config.root_id), this.assert(e, "Invalid argument for gantt.getTask");
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
    if (W(e.id) || (e.id = rt()), this.isTaskExists(e.id) && this.getTask(e.id).$index != e.$index) return e.start_date && typeof e.start_date == "string" && (e.start_date = this.date.parseDate(e.start_date, "parse_date")), e.end_date && typeof e.end_date == "string" && (e.end_date = this.date.parseDate(e.end_date, "parse_date")), this.$data.tasksStore.updateItem(e.id, e);
    if (W(n) || (n = this.getParent(e) || 0), this.isTaskExists(n) || (n = this.config.root_id), this.setParent(e, n), this.getState().lightbox && this.isTaskExists(n)) {
      var a = this.getTask(n);
      this.callEvent("onAfterParentExpand", [n, a]);
    }
    return this.$data.tasksStore.addItem(e, i, n);
  }, deleteTask: function(e) {
    return e = it(e, this.config.root_id), this.$data.tasksStore.removeItem(e);
  }, getTaskCount: function() {
    return this.$data.tasksStore.count();
  }, getVisibleTaskCount: function() {
    return this.$data.tasksStore.countVisible();
  }, getTaskIndex: function(e) {
    return this.$data.tasksStore.getBranchIndex(e);
  }, getGlobalTaskIndex: function(e) {
    return e = it(e, this.config.root_id), this.assert(e, "Invalid argument"), this.$data.tasksStore.getIndexById(e);
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
    return i = it(i, this.config.root_id), this.$data.tasksStore.move.apply(this.$data.tasksStore, arguments);
  }, sort: function(e, n, i, a) {
    var r = !a;
    this.$data.tasksStore.sort(e, n, i), this.callEvent("onAfterSort", [e, n, i]), r && this.render();
  } }), N(t, { getLinkCount: function() {
    return this.$data.linksStore.count();
  }, getLink: function(e) {
    return this.$data.linksStore.getItem(e);
  }, getLinks: function() {
    return this.$data.linksStore.getItems();
  }, isLinkExists: function(e) {
    return this.$data.linksStore.exists(e);
  }, addLink: function(e) {
    const n = this.$data.linksStore.addItem(e);
    return this.$data.linksStore.isSilent() && this.$data.linksStore.fullOrder.push(n), n;
  }, updateLink: function(e, n) {
    W(n) || (n = this.getLink(e)), this.$data.linksStore.updateItem(e, n);
  }, deleteLink: function(e) {
    return this.$data.linksStore.removeItem(e);
  }, changeLinkId: function(e, n) {
    return this.$data.linksStore.changeId(e, n);
  } }), t;
} };
function _e(t) {
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
      var d = i - this.getSum(o, r, s);
      this.adjustSize(d, o, r, s), this.adjustSize(-d, o, s + 1), a.full_width = this.getSum(o);
    }
  }, splitSize: function(i, a) {
    for (var r = [], s = 0; s < a; s++) r[s] = 0;
    return this.adjustSize(i, r), r;
  }, adjustSize: function(i, a, r, s) {
    r || (r = 0), s === void 0 && (s = a.length - 1);
    for (var o = s - r + 1, l = this.getSum(a, r, s), d = r; d <= s; d++) {
      var c = Math.floor(i * (l ? a[d] / l : 1 / o));
      l -= a[d], i -= c, o--, a[d] += c;
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
  }, prepareConfigs: function(i, a, r, s, o, l, d) {
    for (var c = this.splitSize(s, i.length), u = r, h = [], g = i.length - 1; g >= 0; g--) {
      var f = g == i.length - 1, y = this.initScaleConfig(i[g], o, l);
      f && this.processIgnores(y), this.initColSizes(y, a, u, c[g]), this.limitVisibleRange(y), f && (u = y.full_width), h.unshift(y);
    }
    for (g = 0; g < h.length - 1; g++) this.alineScaleColumns(h[h.length - 1], h[g]);
    for (g = 0; g < h.length; g++) d && this.reverseScale(h[g]), this.setPosSettings(h[g]);
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
    for (var d = i.ignore_x || {}, c = 0; c < i.trace_x.length; c++) if (d[i.trace_x[c].valueOf()] || i.display_count == i.count) i.width[c] = 0;
    else {
      var u = 1;
      i.unit == "month" && (u = Math.round((e.add(i.trace_x[c], i.step, i.unit) - i.trace_x[c]) / 864e5)), i.width[c] = u;
    }
    this.adjustSize(o - this.getSum(i.width), i.width), i.full_width = this.getSum(i.width);
  }, initScaleConfig: function(i, a, r) {
    var s = N({ count: 0, col_width: 0, full_width: 0, height: 0, width: [], left: [], trace_x: [], trace_indexes: {}, min_date: new Date(a), max_date: new Date(r) }, i);
    return this.eachColumn(i.unit, i.step, a, r, function(o) {
      s.count++, s.trace_x.push(new Date(o)), s.trace_indexes[o.valueOf()] = s.trace_x.length - 1;
    }), s.trace_x_ascending = s.trace_x.slice(), s;
  }, iterateScales: function(i, a, r, s, o) {
    for (var l = a.trace_x, d = i.trace_x, c = r || 0, u = s || d.length - 1, h = 0, g = 1; g < l.length; g++) {
      var f = i.trace_indexes[+l[g]];
      f !== void 0 && f <= u && (o && o.apply(this, [h, g, c, f]), c = f, h = g);
    }
  }, alineScaleColumns: function(i, a, r, s) {
    this.iterateScales(i, a, r, s, function(o, l, d, c) {
      var u = this.getSum(i.width, d, c - 1);
      this.getSum(a.width, o, l - 1) != u && this.setSumWidth(u, a, o, l - 1);
    });
  }, eachColumn: function(i, a, r, s, o) {
    var l = new Date(r), d = new Date(s);
    e[i + "_start"] && (l = e[i + "_start"](l));
    var c = new Date(l);
    for (+c >= +d && (d = e.add(c, a, i)); +c < +d; ) {
      o.call(this, new Date(c));
      var u = c.getTimezoneOffset();
      c = e.add(c, a, i), c = t._correct_dst_change(c, u, a, i), e[i + "_start"] && (c = e[i + "_start"](c));
    }
  }, limitVisibleRange: function(i) {
    var a = i.trace_x, r = i.width.length - 1, s = 0;
    if (+a[0] < +i.min_date && r != 0) {
      var o = Math.floor(i.width[0] * ((a[1] - i.min_date) / (a[1] - a[0])));
      s += i.width[0] - o, i.width[0] = o, a[0] = new Date(i.min_date);
    }
    var l = a.length - 1, d = a[l], c = e.add(d, i.step, i.unit);
    if (+c > +i.max_date && l > 0 && (o = i.width[l] - Math.floor(i.width[l] * ((c - i.max_date) / (c - d))), s += i.width[l] - o, i.width[l] = o), s) {
      for (var u = this.getSum(i.width), h = 0, g = 0; g < i.width.length; g++) {
        var f = Math.floor(s * (i.width[g] / u));
        i.width[g] += f, h += f;
      }
      this.adjustSize(s - h, i.width);
    }
  } };
}
function ni(t) {
  var e = function(c) {
    var u = new _e(c).primaryScale(), h = u.unit, g = u.step;
    if (c.config.scale_offset_minimal) {
      var f = new _e(c), y = [f.primaryScale()].concat(f.getSubScales());
      f.sortScales(y), h = y[y.length - 1].unit, g = y[y.length - 1].step || 1;
    }
    return { unit: h, step: g };
  }(t), n = e.unit, i = e.step, a = function(c, u) {
    var h = { start_date: null, end_date: null };
    if (u.config.start_date && u.config.end_date) {
      h.start_date = u.date[c + "_start"](new Date(u.config.start_date));
      var g = new Date(u.config.end_date), f = u.date[c + "_start"](new Date(g));
      g = +g != +f ? u.date.add(f, 1, c) : f, h.end_date = g;
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
      var l = s[0].start_date, d = t.date.add(l, 1, t.config.duration_unit);
      a = { start_date: new Date(l), end_date: new Date(d) };
    } else a = t.getSubtaskDates();
    a.start_date && a.end_date || (a = { start_date: /* @__PURE__ */ new Date(), end_date: /* @__PURE__ */ new Date() }), t.eachTask(function(c) {
      t.config.deadlines && c.deadline && te(a, c.deadline, c.deadline), c.constraint_date && c.constraint_type && t.config.constraint_types && c.constraint_type !== t.config.constraint_types.ASAP && c.constraint_type !== t.config.constraint_types.ALAP && te(a, c.constraint_date, c.constraint_date), t.config.baselines && c.baselines && c.baselines.forEach(function(u) {
        te(a, u.start_date, u.end_date);
      });
    }), a.start_date = t.date[n + "_start"](a.start_date), a.start_date = t.calculateEndDate({ start_date: t.date[n + "_start"](a.start_date), duration: -1, unit: n, step: i }), a.end_date = t.date[n + "_start"](a.end_date), a.end_date = t.calculateEndDate({ start_date: a.end_date, duration: 2, unit: n, step: i });
  }
  t._min_date = a.start_date, t._max_date = a.end_date;
}
function te(t, e, n) {
  e < t.start_date && (t.start_date = new Date(e)), n > t.end_date && (t.end_date = new Date(n));
}
function ge(t) {
  ni(t), function(e) {
    if (e.config.fit_tasks) {
      var n = +e._min_date, i = +e._max_date;
      if (+e._min_date != n || +e._max_date != i) return e.render(), e.callEvent("onScaleAdjusted", []), !0;
    }
  }(t);
}
function Pe(t, e, n) {
  for (var i = 0; i < e.length; i++) t.isLinkExists(e[i]) && (n[e[i]] = t.getLink(e[i]));
}
function Re(t, e, n) {
  Pe(t, e.$source, n), Pe(t, e.$target, n);
}
const fe = { getSubtreeLinks: function(t, e) {
  var n = {};
  return t.isTaskExists(e) && Re(t, t.getTask(e), n), t.eachTask(function(i) {
    Re(t, i, n);
  }, e), n;
}, getSubtreeTasks: function(t, e) {
  var n = {};
  return t.eachTask(function(i) {
    n[i.id] = i;
  }, e), n;
} };
class ii {
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
      return n.config.cascade_delete && (i[o] = { tasks: fe.getSubtreeTasks(n, o), links: fe.getSubtreeLinks(n, o) }), !e.deleteAfterConfirmation || (e.setGanttMode("tasks"), e.setUpdated(o, !0, "deleted"), !1);
    })), this._dataProcessorHandlers.push(n.attachEvent("onAfterTaskDelete", function(o, l) {
      e.setGanttMode("tasks");
      const d = !a(o), c = n.config.cascade_delete && i[o];
      if (d || c) {
        if (c) {
          const u = e.updateMode;
          e.setUpdateMode("off");
          const h = i[o];
          for (const g in h.tasks) a(g) || (e.storeItem(h.tasks[g]), e.setUpdated(g, !0, "deleted"));
          e.setGanttMode("links");
          for (const g in h.links) a(g) || (e.storeItem(h.links[g]), e.setUpdated(g, !0, "deleted"));
          i[o] = null, u !== "off" && e.sendAllData(), e.setGanttMode("tasks"), e.setUpdateMode(u);
        }
        d && (e.storeItem(l), e.deleteAfterConfirmation || e.setUpdated(o, !0, "deleted")), e.updateMode === "off" || e._tSend || e.sendAllData();
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
      const d = n.getChildren(l);
      if (d.length) {
        r = r || {};
        for (let u = 0; u < d.length; u++) {
          const h = this.getTask(d[u]);
          r[h.id] = h;
        }
      }
      const c = function(u) {
        let h = [];
        return u.$source && (h = h.concat(u.$source)), u.$target && (h = h.concat(u.$target)), h;
      }(this.getTask(l));
      if (c.length) {
        s = s || {};
        for (let u = 0; u < c.length; u++) {
          const h = this.getLink(c[u]);
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
    }), e.attachEvent("insertCallback", function(o, l, d, c) {
      const u = o.data || n.xml._xmlNodeToJSON(o.firstChild), h = { add: n.addTask, isExist: n.isTaskExists };
      c === "links" && (h.add = n.addLink, h.isExist = n.isLinkExists), h.isExist.call(n, l) || (u.id = l, h.add.call(n, u));
    }), e.attachEvent("updateCallback", function(o, l) {
      const d = o.data || n.xml._xmlNodeToJSON(o.firstChild);
      if (!n.isTaskExists(l)) return;
      const c = n.getTask(l);
      for (const u in d) {
        let h = d[u];
        switch (u) {
          case "id":
            continue;
          case "start_date":
          case "end_date":
            h = n.defined(n.templates.xml_date) ? n.templates.xml_date(h) : n.templates.parse_date(h);
            break;
          case "duration":
            c.end_date = n.calculateEndDate({ start_date: c.start_date, duration: h, task: c });
        }
        c[u] = h;
      }
      n.updateTask(l), n.refreshData();
    }), e.attachEvent("deleteCallback", function(o, l, d, c) {
      const u = { delete: n.deleteTask, isExist: n.isTaskExists };
      c === "links" ? (u.delete = n.deleteLink, u.isExist = n.isLinkExists) : c === "assignment" && (u.delete = function(h) {
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
      a[l.task_id] ? function(d) {
        r[d.id] = d, a[d.task_id] = !0;
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
const Jt = class Jt {
  constructor() {
    this.clear = () => {
      this._storage = {};
    }, this.storeItem = (e) => {
      this._storage[e.id] = q(e);
    }, this.getStoredItem = (e) => this._storage[e] || null, this._storage = {};
  }
};
Jt.create = () => new Jt();
let Gt = Jt, He = class {
  constructor(t) {
    this.serverProcessor = t, this.action_param = "!nativeeditor_status", this.updatedRows = [], this.autoUpdate = !0, this.updateMode = "cell", this._headers = null, this._payload = null, this._postDelim = "_", this._routerParametersFormat = "parameters", this._waitMode = 0, this._in_progress = {}, this._storage = Gt.create(), this._invalid = {}, this.messages = [], this.styles = { updated: "font-weight:bold;", inserted: "font-weight:bold;", deleted: "text-decoration : line-through;", invalid: "background-color:FFE0E0;", invalid_cell: "border-bottom:2px solid red;", error: "color:red;", clear: "font-weight:normal;text-decoration:none;" }, this.enableUTFencoding(!0), st(this);
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
    this._silent_mode = !0, t.call(e || lt), this._silent_mode = !1;
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
      const h = o.action || this.getState(u) || "updated", g = o.sid || u[0], f = o.tid || u[0];
      t.afterUpdateCallback(g, f, h, o, a);
    };
    if (o) return Array.isArray(n) && n.length > 1 ? n.forEach((u) => l(u)) : l(n), t.finalizeUpdate(), void this.setGanttMode(a);
    const d = s.xmltop("data", e.xmlDoc);
    if (!d) return this.cleanUpdate(n);
    const c = s.xpath("//data/action", d);
    if (!c.length) return this.cleanUpdate(n);
    for (let u = 0; u < c.length; u++) {
      const h = c[u], g = h.getAttribute("type"), f = h.getAttribute("sid"), y = h.getAttribute("tid");
      t.afterUpdateCallback(f, y, g, h, a);
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
    const e = new ii(this.$gantt, this);
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
          const o = r[s].getAttribute("status"), l = r[s].getAttribute("id"), d = r[s].getAttribute("parent");
          switch (o) {
            case "inserted":
              this.callEvent("insertCallback", [r[s], l, d]);
              break;
            case "updated":
              this.callEvent("updateCallback", [r[s], l, d]);
              break;
            case "deleted":
              this.callEvent("deleteCallback", [r[s], l, d]);
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
    i || (i = e[t] = { _in_progress: {}, _invalid: {}, _storage: Gt.create(), updatedRows: [] }), this._in_progress = i._in_progress, this._invalid = i._invalid, this._storage = i._storage, this.updatedRows = i.updatedRows, this.modes = e, this._ganttMode = t;
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
      const l = this.getState(e), d = this.getActionByState(l), c = this.getGanttMode(), u = (g) => {
        let f = l || "updated", y = e, v = e;
        g && (f = g.action || l, y = g.sid || y, v = g.id || g.tid || v), this.afterUpdateCallback(y, v, f, g, c);
      };
      let h;
      if (this._router instanceof Function) if (this._routerParametersFormat === "object") {
        const g = { entity: c, action: d, data: t, id: e };
        h = this._router(g);
      } else h = this._router(c, d, t, e);
      else if (this._router[c] instanceof Function) h = this._router[c](d, t, e);
      else {
        const g = "Incorrect configuration of gantt.createDataProcessor", f = `
You need to either add missing properties to the dataProcessor router object or to use a router function.
See https://docs.dhtmlx.com/gantt/desktop__server_side.html#customrouting and https://docs.dhtmlx.com/gantt/api__gantt_createdataprocessor.html for details.`;
        if (!this._router[c]) throw new Error(`${g}: router for the **${c}** entity is not defined. ${f}`);
        switch (l) {
          case "inserted":
            if (!this._router[c].create) throw new Error(`${g}: **create** action for the **${c}** entity is not defined. ${f}`);
            h = this._router[c].create(t);
            break;
          case "deleted":
            if (!this._router[c].delete) throw new Error(`${g}: **delete** action for the **${c}** entity is not defined. ${f}`);
            h = this._router[c].delete(e);
            break;
          default:
            if (!this._router[c].update) throw new Error(`${g}: **update**" action for the **${c}** entity is not defined. ${f}`);
            h = this._router[c].update(t, e);
        }
      }
      if (h) {
        if (!h.then && h.id === void 0 && h.tid === void 0 && h.action === void 0) throw new Error("Incorrect router return value. A Promise or a response object is expected");
        h.then ? h.then(u).catch((g) => {
          g && g.action ? u(g) : u({ action: "error", value: g });
        }) : u(h);
      } else u(null);
      return;
    }
    let i;
    i = { callback: (l) => {
      const d = [];
      if (e) d.push(e);
      else if (t) for (const c in t) d.push(c);
      return this.afterUpdate(this, l, d);
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
        for (const d in l) d !== this.action_param && d !== "id" && d !== "gr_id" && (s[d] = l[d]);
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
    return e.push(t), t.map((n) => X(n) ? this._prepareDate(n) : Array.isArray(n) && !Bt(e, n) ? this._prepareArray(n, e) : n && typeof n == "object" && !Bt(e, n) ? this._prepareObject(n, e) : n);
  }
  _prepareObject(t, e) {
    const n = {};
    e.push(t);
    for (const i in t) {
      if (i.substr(0, 1) === "$") continue;
      const a = t[i];
      X(a) ? n[i] = this._prepareDate(a) : a === null ? n[i] = "" : Array.isArray(a) && !Bt(e, a) ? n[i] = this._prepareArray(a, e) : a && typeof a == "object" && !Bt(e, a) ? n[i] = this._prepareObject(a, e) : n[i] = a;
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
const Oe = { DEPRECATED_api: function(t) {
  return new He(t);
}, createDataProcessor: function(t) {
  let e, n, i;
  t instanceof Function ? e = t : t.hasOwnProperty("router") ? e = t.router : t.hasOwnProperty("assignment") || t.hasOwnProperty("baseline") || t.hasOwnProperty("link") || t.hasOwnProperty("task") ? e = t : t.hasOwnProperty("headers") && (i = t.headers), n = e ? "CUSTOM" : t.mode || "REST-JSON";
  const a = new He(t.url);
  return a.init(this), a.setTransactionMode({ mode: n, router: e, headers: i }, t.batchUpdate), t.deleteAfterConfirmation && (a.deleteAfterConfirmation = t.deleteAfterConfirmation), a;
} };
function ai(t) {
  var e = {}, n = !1;
  function i(l, d) {
    d = typeof d == "function" ? d : function() {
    }, e[l] || (e[l] = this[l], this[l] = d);
  }
  function a(l) {
    e[l] && (this[l] = e[l], e[l] = null);
  }
  function r(l) {
    for (var d in l) i.call(this, d, l[d]);
  }
  function s() {
    for (var l in e) a.call(this, l);
  }
  function o(l) {
    try {
      l();
    } catch (d) {
      lt.console.error(d);
    }
  }
  return t.$services.getService("state").registerProvider("batchUpdate", function() {
    return { batch_update: n };
  }, !1), function(l, d) {
    if (n) o(l);
    else {
      var c, u = this._dp && this._dp.updateMode != "off";
      u && (c = this._dp.updateMode, this._dp.setUpdateMode("off"));
      var h = {}, g = { render: !0, refreshData: !0, refreshTask: !0, refreshLink: !0, resetProjectDates: function(y) {
        h[y.id] = y;
      } };
      for (var f in r.call(this, g), n = !0, this.callEvent("onBeforeBatchUpdate", []), o(l), this.callEvent("onAfterBatchUpdate", []), s.call(this), h) this.resetProjectDates(h[f]);
      n = !1, d || this.render(), u && (this._dp.setUpdateMode(c), this._dp.setGanttMode("task"), this._dp.sendData(), this._dp.setGanttMode("link"), this._dp.sendData());
    }
  };
}
function ri(t) {
  t.batchUpdate = ai(t);
}
var si = function(t) {
  return { _needRecalc: !0, reset: function() {
    this._needRecalc = !0;
  }, _isRecalcNeeded: function() {
    return !this._isGroupSort() && this._needRecalc;
  }, _isGroupSort: function() {
    return !!t.getState().group_mode;
  }, _getWBSCode: function(e) {
    return e ? (this._isRecalcNeeded() && this._calcWBS(), e.$virtual ? "" : this._isGroupSort() ? e.$wbs || "" : (e.$wbs || (this.reset(), this._calcWBS()), e.$wbs)) : "";
  }, _setWBSCode: function(e, n) {
    e.$wbs = n;
  }, getWBSCode: function(e) {
    return this._getWBSCode(e);
  }, getByWBSCode: function(e) {
    for (var n = e.split("."), i = t.config.root_id, a = 0; a < n.length; a++) {
      var r = t.getChildren(i), s = 1 * n[a] - 1;
      if (!t.isTaskExists(r[s])) return null;
      i = r[s];
    }
    return t.isTaskExists(i) ? t.getTask(i) : null;
  }, _calcWBS: function() {
    if (this._isRecalcNeeded()) {
      var e = !0;
      t.eachTask(function(n) {
        if (e) return e = !1, void this._setWBSCode(n, "1");
        var i = t.getPrevSibling(n.id);
        if (i !== null) {
          var a = t.getTask(i).$wbs;
          a && ((a = a.split("."))[a.length - 1]++, this._setWBSCode(n, a.join(".")));
        } else {
          var r = t.getParent(n.id);
          this._setWBSCode(n, t.getTask(r).$wbs + ".1");
        }
      }, t.config.root_id, this), this._needRecalc = !1;
    }
  } };
};
function oi(t) {
  var e = si(t);
  function n() {
    return e.reset(), !0;
  }
  t.getWBSCode = function(i) {
    return e.getWBSCode(i);
  }, t.getTaskByWBSCode = function(i) {
    return e.getByWBSCode(i);
  }, t.attachEvent("onAfterTaskMove", n), t.attachEvent("onBeforeParse", n), t.attachEvent("onAfterTaskDelete", n), t.attachEvent("onAfterTaskAdd", n), t.attachEvent("onAfterSort", n);
}
function li(t) {
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
  function r(l, d, c) {
    return Array.isArray(l) ? l.map(function(u) {
      return a(u);
    }).join("_") + `_${d}_${c}` : a(l) + `_${d}_${c}`;
  }
  function s(l, d, c) {
    var u, h = r(d, l, JSON.stringify(c)), g = {};
    return kt(d, function(f) {
      g[a(f)] = !0;
    }), e[h] ? u = e[h] : (u = e[h] = [], t.eachTask(function(f) {
      if (c) {
        if (!c[t.getTaskType(f)]) return;
      } else if (f.type == t.config.types.project) return;
      l in f && kt(he(f[l]) ? f[l] : [f[l]], function(y) {
        var v = y && y.resource_id ? y.resource_id : y;
        if (g[a(v)]) u.push(f);
        else if (!n) {
          var b = r(y, l);
          e[b] || (e[b] = []), e[b].push(f);
        }
      });
    }), n = !0), u;
  }
  function o(l, d, c) {
    var u = t.config.resource_property, h = [];
    if (t.getDatastore("task").exists(d)) {
      var g = t.getTask(d);
      h = g[u] || [];
    }
    Array.isArray(h) || (h = [h]);
    for (var f = 0; f < h.length; f++) h[f].resource_id == l && c.push({ task_id: g.id, resource_id: h[f].resource_id, value: h[f].value });
  }
  return { getTaskBy: function(l, d, c) {
    return typeof l == "function" ? (u = l, h = [], t.eachTask(function(g) {
      u(g) && h.push(g);
    }), h) : he(d) ? s(l, d, c) : s(l, [d], c);
    var u, h;
  }, getResourceAssignments: function(l, d) {
    var c = [], u = t.config.resource_property;
    return d !== void 0 ? o(l, d, c) : t.getTaskBy(u, l).forEach(function(h) {
      o(l, h.id, c);
    }), c;
  } };
}
function di(t) {
  var e = li(t);
  t.ext.resources = /* @__PURE__ */ function(a) {
    const r = { renderEditableLabel: function(s, o, l, d, c) {
      const u = a.config.readonly ? "" : "contenteditable";
      if (s < l.end_date && o > l.start_date) {
        for (let h = 0; h < c.length; h++) {
          const g = c[h];
          return "<div " + u + " data-assignment-cell data-assignment-id='" + g.id + "' data-row-id='" + l.id + "' data-task='" + l.$task_id + "' data-start-date='" + a.templates.format_date(s) + "' data-end-date='" + a.templates.format_date(o) + "'>" + g.value + "</div>";
        }
        return "<div " + u + " data-assignment-cell data-empty  data-row-id='" + l.id + "' data-resource-id='" + l.$resource_id + "' data-task='" + l.$task_id + "' data-start-date='" + a.templates.format_date(s) + "''  data-end-date='" + a.templates.format_date(o) + "'>-</div>";
      }
      return "";
    }, renderSummaryLabel: function(s, o, l, d, c) {
      let u = c.reduce(function(h, g) {
        return h + Number(g.value);
      }, 0);
      return u % 1 && (u = Math.round(10 * u) / 10), u ? "<div>" + u + "</div>" : "";
    }, editableResourceCellTemplate: function(s, o, l, d, c) {
      return l.$role === "task" ? r.renderEditableLabel(s, o, l, d, c) : r.renderSummaryLabel(s, o, l, d, c);
    }, editableResourceCellClass: function(s, o, l, d, c) {
      const u = [];
      u.push("resource_marker"), l.$role === "task" ? u.push("task_cell") : u.push("resource_cell");
      const h = c.reduce(function(f, y) {
        return f + Number(y.value);
      }, 0);
      let g = Number(l.capacity);
      return isNaN(g) && (g = 8), h <= g ? u.push("workday_ok") : u.push("workday_over"), u.join(" ");
    }, getSummaryResourceAssignments: function(s) {
      let o;
      const l = a.getDatastore(a.config.resource_store), d = l.getItem(s);
      return d.$role === "task" ? o = a.getResourceAssignments(d.$resource_id, d.$task_id) : (o = a.getResourceAssignments(s), l.eachItem && l.eachItem(function(c) {
        c.$role !== "task" && (o = o.concat(a.getResourceAssignments(c.id)));
      }, s)), o;
    }, initEditableDiagram: function() {
      a.config.resource_render_empty_cells = !0, function() {
        let s = null;
        function o() {
          return s && cancelAnimationFrame(s), s = requestAnimationFrame(function() {
            a.$container && Array.prototype.slice.call(a.$container.querySelectorAll(".resourceTimeline_cell [data-assignment-cell]")).forEach(function(l) {
              l.contentEditable = !0;
            });
          }), !0;
        }
        a.attachEvent("onGanttReady", function() {
          a.getDatastore(a.config.resource_assignment_store).attachEvent("onStoreUpdated", o), a.getDatastore(a.config.resource_store).attachEvent("onStoreUpdated", o);
        }, { once: !0 }), a.attachEvent("onGanttLayoutReady", function() {
          a.$layout.getCellsByType("viewCell").forEach(function(l) {
            l.$config && l.$config.view === "resourceTimeline" && l.$content && l.$content.attachEvent("onScroll", o);
          });
        });
      }(), a.attachEvent("onGanttReady", function() {
        let s = !1;
        a.event(a.$container, "keypress", function(o) {
          var l = o.target.closest(".resourceTimeline_cell [data-assignment-cell]");
          l && (o.keyCode !== 13 && o.keyCode !== 27 || l.blur());
        }), a.event(a.$container, "focusout", function(o) {
          if (!s) {
            s = !0, setTimeout(function() {
              s = !1;
            }, 300);
            var l = o.target.closest(".resourceTimeline_cell [data-assignment-cell]");
            if (l) {
              var d = (l.innerText || "").trim();
              d == "-" && (d = "0");
              var c = Number(d), u = l.getAttribute("data-row-id"), h = l.getAttribute("data-assignment-id"), g = l.getAttribute("data-task"), f = l.getAttribute("data-resource-id"), y = a.templates.parse_date(l.getAttribute("data-start-date")), v = a.templates.parse_date(l.getAttribute("data-end-date")), b = a.getDatastore(a.config.resource_assignment_store);
              if (isNaN(c)) a.getDatastore(a.config.resource_store).refresh(u);
              else {
                var _ = a.getTask(g);
                if (a.plugins().undo && a.ext.undo.saveState(g, "task"), h) {
                  if (c === (p = b.getItem(h)).value) return;
                  if (p.start_date.valueOf() === y.valueOf() && p.end_date.valueOf() === v.valueOf()) p.value = c, c ? b.updateItem(p.id) : b.removeItem(p.id);
                  else {
                    if (p.end_date.valueOf() > v.valueOf()) {
                      var m = a.copy(p);
                      m.id = a.uid(), m.start_date = v, m.duration = a.calculateDuration({ start_date: m.start_date, end_date: m.end_date, task: _ }), m.delay = a.calculateDuration({ start_date: _.start_date, end_date: m.start_date, task: _ }), m.mode = p.mode || "default", m.duration !== 0 && b.addItem(m);
                    }
                    p.start_date.valueOf() < y.valueOf() ? (p.end_date = y, p.duration = a.calculateDuration({ start_date: p.start_date, end_date: p.end_date, task: _ }), p.mode = "fixedDuration", p.duration === 0 ? b.removeItem(p.id) : b.updateItem(p.id)) : b.removeItem(p.id), c && b.addItem({ task_id: p.task_id, resource_id: p.resource_id, value: c, start_date: y, end_date: v, duration: a.calculateDuration({ start_date: y, end_date: v, task: _ }), delay: a.calculateDuration({ start_date: _.start_date, end_date: y, task: _ }), mode: "fixedDuration" });
                  }
                  a.updateTaskAssignments(_.id), a.updateTask(_.id);
                } else if (c) {
                  var p = { task_id: g, resource_id: f, value: c, start_date: y, end_date: v, duration: a.calculateDuration({ start_date: y, end_date: v, task: _ }), delay: a.calculateDuration({ start_date: _.start_date, end_date: y, task: _ }), mode: "fixedDuration" };
                  b.addItem(p), a.updateTaskAssignments(_.id), a.updateTask(_.id);
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
      let l, d = function(c) {
        const u = [];
        return c.forEach(function(h) {
          const g = t.copy(h);
          g.key = h.id, g.label = h.text, u.push(g);
        }), u;
      };
      t.config.resources && t.config.resources.lightbox_resources && (d = t.config.resources.lightbox_resources), t.config.resources && t.config.resources.editable_resource_diagram ? l = d(t.$resourcesStore.getItems().filter((c) => {
        let u = t.getResourceAssignments(c.id);
        if (!t.$resourcesStore.hasChild(c.id) || u && u.length) return !c.$resource_id || !c.$task_id;
      })) : l = d(t.$resourcesStore.getItems()), t.updateCollection("resourceOptions", l);
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
function ci(t) {
  var e = "$resourceAssignments";
  t.config.resource_assignment_store = "resourceAssignments", t.config.process_resource_assignments = !0;
  var n = { auto: "auto", singleValue: "singleValue", valueArray: "valueArray", resourceValueArray: "resourceValueArray", assignmentsArray: "assignmentsArray" }, i = n.auto, a = { fixedDates: "fixedDates", fixedDuration: "fixedDuration", default: "default" };
  function r(f, y) {
    f.start_date ? f.start_date = t.date.parseDate(f.start_date, "parse_date") : f.start_date = null, f.end_date ? f.end_date = t.date.parseDate(f.end_date, "parse_date") : f.end_date = null;
    var v = Number(f.delay), b = !1;
    if (isNaN(v) ? (f.delay = 0, b = !0) : f.delay = v, t.defined(f.value) || (f.value = null), !f.task_id || !f.resource_id) return !1;
    if (f.mode = f.mode || a.default, f.mode === a.fixedDuration && (isNaN(Number(f.duration)) && (y = y || t.getTask(f.task_id), f.duration = t.calculateDuration({ start_date: f.start_date, end_date: f.end_date, id: y })), b && (y = y || t.getTask(f.task_id), f.delay = t.calculateDuration({ start_date: y.start_date, end_date: f.start_date, id: y }))), f.mode !== a.fixedDates && (y || t.isTaskExists(f.task_id))) {
      var _ = o(f, y = y || t.getTask(f.task_id));
      f.start_date = _.start_date, f.end_date = _.end_date, f.duration = _.duration;
    }
  }
  var s = t.createDatastore({ name: t.config.resource_assignment_store, initItem: function(f) {
    return f.id || (f.id = t.uid()), r(f), f;
  } });
  function o(f, y) {
    if (f.mode === a.fixedDates) return { start_date: f.start_date, end_date: f.end_date, duration: f.duration };
    var v, b, _ = f.delay ? t.calculateEndDate({ start_date: y.start_date, duration: f.delay, task: y }) : new Date(y.start_date);
    return f.mode === a.fixedDuration ? (v = t.calculateEndDate({ start_date: _, duration: f.duration, task: y }), b = f.duration) : (v = new Date(y.end_date), b = y.duration - f.delay), { start_date: _, end_date: v, duration: b };
  }
  function l(f) {
    const y = t.config.resource_property;
    let v = f[y];
    const b = [];
    let _ = i === n.auto;
    if (t.defined(v) && v) {
      Array.isArray(v) || (v = [v], _ && (i = n.singleValue, _ = !1));
      const m = {};
      v.forEach(function(p) {
        p.resource_id || (p = { resource_id: p }, _ && (i = n.valueArray, _ = !1)), _ && (p.id && p.resource_id ? (i = n.assignmentsArray, _ = !1) : (i = n.resourceValueArray, _ = !1));
        let k, $ = a.default;
        p.mode || (p.start_date && p.end_date || p.start_date && p.duration) && ($ = a.fixedDuration), k = p.id || !p.$id || m[p.$id] ? p.id && !m[p.id] ? p.id : t.uid() : p.$id, m[k] = !0;
        const w = { id: k, start_date: p.start_date, duration: p.duration, end_date: p.end_date, delay: p.delay, task_id: f.id, resource_id: p.resource_id, value: p.value, mode: p.mode || $ };
        Object.keys(p).forEach((x) => {
          x != "$id" && (w[x] = p[x]);
        }), w.start_date && w.start_date.getMonth && w.end_date && w.end_date.getMonth && typeof w.duration == "number" || r(w, f), b.push(w);
      });
    }
    return b;
  }
  function d(f) {
    if (t.isTaskExists(f)) {
      var y = t.getTask(f);
      c(y, t.getTaskAssignments(y.id));
    }
  }
  function c(f, y) {
    y.sort(function(v, b) {
      return v.start_date && b.start_date && v.start_date.valueOf() != b.start_date.valueOf() ? v.start_date - b.start_date : 0;
    }), i == n.assignmentsArray ? f[t.config.resource_property] = y : i == n.resourceValueArray && (f[t.config.resource_property] = y.map(function(v) {
      return { $id: v.id, start_date: v.start_date, duration: v.duration, end_date: v.end_date, delay: v.delay, resource_id: v.resource_id, value: v.value, mode: v.mode };
    })), f[e] = y;
  }
  function u(f) {
    var y = l(f);
    return y.forEach(function(v) {
      v.id = v.id || t.uid();
    }), y;
  }
  function h(f, y) {
    var v = function(b, _) {
      var m = { inBoth: [], inTaskNotInStore: [], inStoreNotInTask: [] };
      if (i == n.singleValue) {
        var p = b[0], k = p ? p.resource_id : null, $ = !1;
        _.forEach(function(T) {
          T.resource_id != k ? m.inStoreNotInTask.push(T) : T.resource_id == k && (m.inBoth.push({ store: T, task: p }), $ = !0);
        }), !$ && p && m.inTaskNotInStore.push(p);
      } else if (i == n.valueArray) {
        var w = {}, x = {}, S = {};
        b.forEach(function(T) {
          w[T.resource_id] = T;
        }), _.forEach(function(T) {
          x[T.resource_id] = T;
        }), b.concat(_).forEach(function(T) {
          if (!S[T.resource_id]) {
            S[T.resource_id] = !0;
            var E = w[T.resource_id], C = x[T.resource_id];
            E && C ? m.inBoth.push({ store: C, task: E }) : E && !C ? m.inTaskNotInStore.push(E) : !E && C && m.inStoreNotInTask.push(C);
          }
        });
      } else i != n.assignmentsArray && i != n.resourceValueArray || (w = {}, x = {}, S = {}, b.forEach(function(T) {
        w[T.id || T.$id] = T;
      }), _.forEach(function(T) {
        x[T.id] = T;
      }), b.concat(_).forEach(function(T) {
        var E = T.id || T.$id;
        if (!S[E]) {
          S[E] = !0;
          var C = w[E], D = x[E];
          C && D ? m.inBoth.push({ store: D, task: C }) : C && !D ? m.inTaskNotInStore.push(C) : !C && D && m.inStoreNotInTask.push(D);
        }
      }));
      return m;
    }(l(f), y);
    v.inStoreNotInTask.forEach(function(b) {
      s.removeItem(b.id);
    }), v.inTaskNotInStore.forEach(function(b) {
      s.addItem(b);
    }), v.inBoth.forEach(function(b) {
      if (function(m, p) {
        var k = { id: !0 };
        for (var $ in m) if (!k[$] && String(m[$]) !== String(p[$])) return !0;
        return !1;
      }(b.task, b.store)) (function(m, p) {
        var k = { id: !0 };
        for (var $ in m) k[$] || (p[$] = m[$]);
      })(b.task, b.store), s.updateItem(b.store.id);
      else if (b.task.start_date && b.task.end_date && b.task.mode !== a.fixedDates) {
        var _ = o(b.store, f);
        b.store.start_date.valueOf() == _.start_date.valueOf() && b.store.end_date.valueOf() == _.end_date.valueOf() || (b.store.start_date = _.start_date, b.store.end_date = _.end_date, b.store.duration = _.duration, s.updateItem(b.store.id));
      }
    }), d(f.id);
  }
  function g(f) {
    var y = f[e] || s.find(function(v) {
      return v.task_id == f.id;
    });
    h(f, y);
  }
  t.$data.assignmentsStore = s, t.attachEvent("onGanttReady", function() {
    if (t.config.process_resource_assignments) {
      t.attachEvent("onParse", function() {
        t.silent(function() {
          s.clearAll();
          var k = [];
          t.eachTask(function($) {
            if ($.type !== t.config.types.project) {
              var w = u($);
              c($, w), w.forEach(function(x) {
                k.push(x);
              });
            }
          }), s.parse(k);
        });
      });
      var f = !1, y = !1, v = {}, b = !1;
      t.attachEvent("onBeforeBatchUpdate", function() {
        f = !0;
      }), t.attachEvent("onAfterBatchUpdate", function() {
        if (y) {
          var k = {};
          for (var $ in v) k[$] = t.getTaskAssignments(v[$].id);
          for (var $ in t.config.process_resource_assignments && i === "resourceValueArray" && (p = null), v) h(v[$], k[$]);
        }
        y = !1, f = !1, v = {};
      }), t.attachEvent("onTaskCreated", function(k) {
        var $ = u(k);
        return s.parse($), c(k, $), !0;
      }), t.attachEvent("onAfterTaskUpdate", function(k, $) {
        f ? (y = !0, v[k] = $) : $.unscheduled || g($);
      }), t.attachEvent("onAfterTaskAdd", function(k, $) {
        f ? (y = !0, v[k] = $) : g($);
      }), t.attachEvent("onRowDragEnd", function(k) {
        g(t.getTask(k));
      }), t.$data.tasksStore.attachEvent("onAfterDeleteConfirmed", function(k, $) {
        var w, x = [k];
        t.eachTask(function(S) {
          x.push(S.id);
        }, k), w = {}, x.forEach(function(S) {
          w[S] = !0;
        }), s.find(function(S) {
          return w[S.task_id];
        }).forEach(function(S) {
          s.removeItem(S.id);
        });
      }), t.$data.tasksStore.attachEvent("onClearAll", function() {
        return _ = null, m = null, p = null, s.clearAll(), !0;
      }), t.attachEvent("onTaskIdChange", function(k, $) {
        s.find(function(w) {
          return w.task_id == k;
        }).forEach(function(w) {
          w.task_id = $, s.updateItem(w.id);
        }), d($);
      }), t.attachEvent("onBeforeUndo", function(k) {
        return b = !0, !0;
      }), t.attachEvent("onAfterUndo", function(k) {
        b = !0;
      });
      var _ = null, m = null, p = null;
      s.attachEvent("onStoreUpdated", function() {
        return f && !b || (_ = null, m = null, p = null), !0;
      }), t.getResourceAssignments = function(k, $) {
        var w = t.defined($) && $ !== null;
        return _ === null && (_ = {}, m = {}, s.eachItem(function(x) {
          _[x.resource_id] || (_[x.resource_id] = []), _[x.resource_id].push(x);
          var S = x.resource_id + "-" + x.task_id;
          m[S] || (m[S] = []), m[S].push(x);
        })), w ? (m[k + "-" + $] || []).slice() : (_[k] || []).slice();
      }, t.getTaskAssignments = function(k) {
        if (p === null) {
          var $ = [];
          p = {}, s.eachItem(function(w) {
            p[w.task_id] || (p[w.task_id] = []), p[w.task_id].push(w), w.task_id == k && $.push(w);
          });
        }
        return (p[k] || []).slice();
      }, t.getTaskResources = function(k) {
        const $ = t.getDatastore("resource"), w = t.getTaskAssignments(k), x = {};
        w.forEach(function(T) {
          x[T.resource_id] || (x[T.resource_id] = T.resource_id);
        });
        const S = [];
        for (const T in x) {
          const E = $.getItem(x[T]);
          E && S.push(E);
        }
        return S;
      }, t.updateTaskAssignments = d;
    }
  }, { once: !0 });
}
function ui(t) {
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
      var d = t.copy(l);
      t.silent(function() {
        t.deleteTask(l.id);
      }), delete d["!nativeeditor_status"], d.type = t.config.types.task, d.id = t.uid(), t.addTask(d);
    }));
  }
  t.config.types.placeholder = "placeholder", t.attachEvent("onDataProcessorReady", e(function(o) {
    o && !o._silencedPlaceholder && (o._silencedPlaceholder = !0, o.attachEvent("onBeforeUpdate", e(function(l, d, c) {
      return c.type != t.config.types.placeholder || (o.setUpdated(l, !1), !1);
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
      l.type != t.config.types.placeholder && (t.getTaskBy("type", t.config.types.placeholder).forEach(function(d) {
        t.silent(function() {
          t.isTaskExists(d.id) && t.deleteTask(d.id);
        });
      }), n());
    })), t.attachEvent("onParse", e(n)));
  }), t.attachEvent("onLinkValidation", function(o) {
    return !s(o);
  }), t.attachEvent("onBeforeLinkAdd", function(o, l) {
    return !s(l);
  }), t.attachEvent("onBeforeUndoStack", function(o) {
    for (var l = 0; l < o.commands.length; l++) {
      var d = o.commands[l];
      d.entity === "task" && d.value.type === t.config.types.placeholder && (o.commands.splice(l, 1), l--);
    }
    return !0;
  });
}
function hi(t) {
  function e(c) {
    return function() {
      return !t.config.auto_types || t.getTaskType(t.config.types.project) != t.config.types.project || c.apply(this, arguments);
    };
  }
  function n(c, u) {
    var h = t.getTask(c), g = r(h);
    g !== !1 && t.getTaskType(h) !== g && (u.$needsUpdate = !0, u[h.id] = { task: h, type: g });
  }
  function i(c) {
    if (!t.getState().group_mode) {
      var u = function(h, g) {
        return n(h, g = g || {}), t.eachParent(function(f) {
          n(f.id, g);
        }, h), g;
      }(c);
      u.$needsUpdate && t.batchUpdate(function() {
        (function(h) {
          for (var g in h) if (h[g] && h[g].task) {
            var f = h[g].task;
            f.type = h[g].type, t.updateTask(f.id);
          }
        })(u);
      });
    }
  }
  var a;
  function r(c) {
    var u = t.config.types, h = t.hasChild(c.id), g = t.getTaskType(c.type);
    return h && g === u.task ? u.project : !h && g === u.project && u.task;
  }
  var s, o, l = !0;
  function d(c) {
    c != t.config.root_id && t.isTaskExists(c) && i(c);
  }
  t.attachEvent("onParse", e(function() {
    l = !1, t.getState().group_mode || (t.batchUpdate(function() {
      t.eachTask(function(c) {
        var u = r(c);
        u !== !1 && function(h, g) {
          t.getState().group_mode || (h.type = g, t.updateTask(h.id));
        }(c, u);
      });
    }), l = !0);
  })), t.attachEvent("onAfterTaskAdd", e(function(c) {
    l && i(c);
  })), t.attachEvent("onAfterTaskUpdate", e(function(c) {
    l && i(c);
  })), t.attachEvent("onBeforeTaskDelete", e(function(c, u) {
    return a = t.getParent(c), !0;
  })), t.attachEvent("onAfterTaskDelete", e(function(c, u) {
    d(a);
  })), t.attachEvent("onRowDragStart", e(function(c, u, h) {
    return s = t.getParent(c), !0;
  })), t.attachEvent("onRowDragEnd", e(function(c, u) {
    d(s), i(c);
  })), t.attachEvent("onBeforeTaskMove", e(function(c, u, h) {
    return o = t.getParent(c), !0;
  })), t.attachEvent("onAfterTaskMove", e(function(c, u, h) {
    document.querySelector(".gantt_drag_marker") || (d(o), i(c));
  }));
}
const Kt = class Kt {
  constructor() {
    this.canParse = (e) => !isNaN(this.parse(e)), this.format = (e) => String(e), this.parse = (e) => parseInt(e, 10);
  }
};
Kt.create = (e = null) => new Kt();
let Lt = Kt;
const Xt = class Xt {
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
Xt.create = (e = null, n) => new Xt(n);
let pe = Xt;
function _i(t) {
  t.ext.formatters = { durationFormatter: function(e) {
    return e || (e = {}), e.store || (e.store = t.config.duration_unit), e.enter || (e.enter = t.config.duration_unit), Lt.create(e, t);
  }, linkFormatter: function(e) {
    return pe.create(e, t);
  } };
}
function gi(t) {
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
}, fi = function(t, e) {
  let n = !1;
  return t.eachTask(function(i) {
    n || (n = hn(t, i));
  }, e), n;
}, $t = function(t) {
  return t.render && t.render == "split" && !t.$open;
}, pi = function(t, e, n, i) {
  let a = i || e.$task_data.scrollHeight, r = !1, s = !1;
  return t.eachParent(function(o) {
    if ($t(o)) {
      s = !0;
      const l = e.getItemPosition(o).rowHeight;
      l < a && (a = l, r = !0);
    }
  }, n.id), { maxHeight: a, shrinkHeight: r, splitChild: s };
};
function mi(t) {
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
          const d = t.getTask(l);
          if (d.id == a.id) return;
          const c = d.row_height || t.getLayoutView("timeline").getBarHeight(d.id);
          o = o || c, c > o && (o = c);
        }), r.row_height = o, r.bar_height = r.bar_height || s;
      }
    }, a.id);
  }
  t.$data.baselineStore = e, t.adjustTaskHeightForBaselines = function(a) {
    let r, s, o = a.baselines && a.baselines.length || 0;
    const l = t.config.baselines.row_height, d = t.getLayoutView("timeline");
    if (d && t.config.show_chart) switch (t.config.baselines.render_mode) {
      case "taskRow":
        a.row_height = a.bar_height + 4;
        break;
      case "separateRow":
        r = d.getBarHeight(a.id), o ? (a.bar_height = a.bar_height || r, a.bar_height > r && (r = a.bar_height), a.row_height = r + l) : a.bar_height && (a.row_height = a.bar_height + 4), i(a);
        break;
      case "individualRow":
        r = d.getBarHeight(a.id), o ? (a.bar_height = a.bar_height || r, a.bar_height > r && (r = a.bar_height), s = l * o, a.row_height = r + s + 2) : a.bar_height && (a.row_height = a.bar_height + 4), i(a);
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
            let d = s.baselines[l];
            if (d.id == a.id) {
              o = !1, t.mixin(d, a, !0);
              break;
            }
          }
          o && s.baselines.push(a), j(t) || ($t(s) ? n(s) : t.adjustTaskHeightForBaselines(s));
        }
      });
    }), t.attachEvent("onBeforeTaskUpdate", function(a, r) {
      return function(s) {
        let o = !1;
        const l = {}, d = s.baselines || [], c = t.getTaskBaselines(s.id);
        d.length != c.length && (o = !0), d.forEach(function(u) {
          l[u.id] = !0;
          const h = e.getItem(u.id);
          if (h) {
            const g = +h.start_date != +u.start_date, f = +h.end_date != +u.end_date;
            (g || f) && e.updateItem(u.id, u);
          } else e.addItem(u);
        }), c.forEach(function(u) {
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
                const d = t.getTask(l.parent);
                $t(d) && (n(d), r = !0);
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
function vi(t) {
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
        var l = r[o], d = this.copy(l);
        for (var c in d.key = d.value, l) if (l.hasOwnProperty(c)) {
          if (c == "value" || c == "label") continue;
          d[c] = l[c];
        }
        s.push(d);
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
    for (var a in n) a.charAt(0) != "$" && (i[a] = n[a], X(i[a]) && (i[a] = t.defined(t.templates.xml_format) ? t.templates.xml_format(i[a]) : t.templates.format_date(i[a])));
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
      for (var d = o[l].attributes, c = { key: o[l].getAttribute("value"), label: o[l].getAttribute("label") }, u = 0; u < d.length; u++) {
        var h = d[u];
        h.nodeName != "value" && h.nodeName != "label" && (c[h.nodeName] = h.nodeValue);
      }
      s.push(c);
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
      (d = t.xml._xmlNodeToJSON(s[o], !0)).id = "project-" + d.id, r.push(d);
    for (o = 0; o < r.length; o++) {
      var d;
      (d = r[o]).start_date = d.startdate || d.est, d.end_date = d.enddate, d.text = d.name, d.duration = d.duration / 8, d.open = 1, d.duration || d.end_date || (d.duration = 1), d.predecessortasks && a.collections.links.push({ target: d.id, source: d.predecessortasks, type: t.config.links.finish_to_start });
    }
    return a;
  }, serialize: function() {
    t.message("Serialization to 'old XML' is not implemented");
  } }, t.serverList = function(n, i) {
    return i ? this.serverList[n] = i.slice(0) : this.serverList[n] || (this.serverList[n] = []), this.serverList[n];
  };
}
function ee(t, e, n, i, a) {
  return this.date = t, this.unit = e, this.task = n, this.id = i, this.calendar = a, this;
}
function ne(t, e, n, i, a, r) {
  return this.date = t, this.dir = e, this.unit = n, this.task = i, this.id = a, this.calendar = r, this;
}
function ie(t, e, n, i, a, r, s) {
  return this.start_date = t, this.duration = e, this.unit = n, this.step = i, this.task = a, this.id = r, this.calendar = s, this;
}
function ki(t, e, n, i) {
  return this.start_date = t, this.end_date = e, this.task = n, this.calendar = i, this.unit = null, this.step = null, this;
}
var _n = function(t) {
  return { getWorkHoursArguments: function() {
    var e = arguments[0];
    if (!bt((e = X(e) ? { date: e } : N({}, e)).date)) throw t.assert(!1, "Invalid date argument for getWorkHours method"), new Error("Invalid date argument for getWorkHours method");
    return e;
  }, setWorkTimeArguments: function() {
    return arguments[0];
  }, unsetWorkTimeArguments: function() {
    return arguments[0];
  }, isWorkTimeArguments: function() {
    var e, n = arguments[0];
    if (n instanceof ee) return n;
    if ((e = n.date ? new ee(n.date, n.unit, n.task, null, n.calendar) : new ee(arguments[0], arguments[1], arguments[2], null, arguments[3])).unit = e.unit || t.config.duration_unit, !bt(e.date)) throw t.assert(!1, "Invalid date argument for isWorkTime method"), new Error("Invalid date argument for isWorkTime method");
    return e;
  }, getClosestWorkTimeArguments: function(e) {
    var n, i = arguments[0];
    if (i instanceof ne) return i;
    if (n = X(i) ? new ne(i) : new ne(i.date, i.dir, i.unit, i.task, null, i.calendar), i.id && (n.task = i), n.dir = i.dir || "any", n.unit = i.unit || t.config.duration_unit, !bt(n.date)) throw t.assert(!1, "Invalid date argument for getClosestWorkTime method"), new Error("Invalid date argument for getClosestWorkTime method");
    return n;
  }, _getStartEndConfig: function(e) {
    var n, i = ki;
    if (e instanceof i) return e;
    if (X(e) ? n = new i(arguments[0], arguments[1], arguments[2], arguments[3]) : (n = new i(e.start_date, e.end_date, e.task), e.id !== null && e.id !== void 0 && (n.task = e)), n.unit = n.unit || t.config.duration_unit, n.step = n.step || t.config.duration_step, n.start_date = n.start_date || n.start || n.date, !bt(n.start_date)) throw t.assert(!1, "Invalid start_date argument for getDuration method"), new Error("Invalid start_date argument for getDuration method");
    if (!bt(n.end_date)) throw t.assert(!1, "Invalid end_date argument for getDuration method"), new Error("Invalid end_date argument for getDuration method");
    return n;
  }, getDurationArguments: function(e, n, i, a) {
    return this._getStartEndConfig.apply(this, arguments);
  }, hasDurationArguments: function(e, n, i, a) {
    return this._getStartEndConfig.apply(this, arguments);
  }, calculateEndDateArguments: function(e, n, i, a) {
    var r, s = arguments[0];
    if (s instanceof ie) return s;
    if (r = X(s) ? new ie(arguments[0], arguments[1], arguments[2], void 0, arguments[3], void 0, arguments[4]) : new ie(s.start_date, s.duration, s.unit, s.step, s.task, null, s.calendar), s.id !== null && s.id !== void 0 && (r.task = s, r.unit = null, r.step = null), r.unit = r.unit || t.config.duration_unit, r.step = r.step || t.config.duration_step, !bt(r.start_date)) throw t.assert(!1, "Invalid start_date argument for calculateEndDate method"), new Error("Invalid start_date argument for calculateEndDate method");
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
  var n = q(t.getConfig().parsed), i = q(e.getConfig().parsed), a = { hours: this._toHoursArray(this._mergeHoursConfig(n.hours, i.hours)), dates: {}, customWeeks: {} };
  const r = (o, l) => {
    for (let d in o.dates) {
      const c = o.dates[d];
      +d > 1e3 && (a.dates[d] = !1);
      for (const u in l.dates) {
        const h = l.dates[u];
        if (u == d && (a.dates[d] = !(!c || !h)), Array.isArray(c)) {
          const g = Array.isArray(h) ? h : l.hours;
          a.dates[d] = this._toHoursArray(this._mergeHoursConfig(c, g));
        }
      }
    }
  };
  if (r(n, i), r(i, n), n.customWeeks) for (var s in n.customWeeks) a.customWeeks[s] = n.customWeeks[s];
  if (i.customWeeks) for (var s in i.customWeeks) a.customWeeks[s] = i.customWeeks[s];
  return a;
} };
class yi {
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
class bi {
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
class xi {
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
class $i {
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
    let d;
    if (s.endDates[l] === void 0) {
      const c = r(), u = c.valueOf();
      s.endDates[l] = u, s.durations[this._durationCacheKey(o, u)] = n, d = c;
    } else d = new Date(s.endDates[l]);
    return d;
  }
  getDuration(e, n, i, a, r) {
    const s = this._getCacheObject(e, i, a), o = e.valueOf(), l = n.valueOf(), d = this._durationCacheKey(o, l);
    let c;
    if (s.durations[d] === void 0) {
      const u = r();
      s.durations[d] = u.valueOf(), c = u;
    } else c = s.durations[d];
    return c;
  }
  clear() {
    this._cache = {};
  }
}
function me(t, e) {
  this.argumentsHelper = e, this.$gantt = t, this._workingUnitsCache = typeof Map < "u" ? new yi() : new bi(), this._largeUnitsCache = new xi(this), this._dateDurationCache = new $i(), this._worktime = null, this._cached_timestamps = {}, this._cached_timestamps_count = 0;
}
me.prototype = { units: ["year", "month", "week", "day", "hour", "minute"], _clearCaches: function() {
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
  var o, l, d = 0, c = null, u = !1;
  (o = a[n + "_start"](new Date(r))).valueOf() != r.valueOf() && (u = !0);
  var h = !1;
  (l = a[n + "_start"](new Date(e))).valueOf() != e.valueOf() && (h = !0);
  for (var g = !1; r.valueOf() < s.valueOf(); ) {
    if (g = (c = this._nextDate(r, n, i)).valueOf() > s.valueOf(), this._isWorkTime(r, n)) (u || h && g) && (o = a[n + "_start"](new Date(r)), l = a.add(o, i, n)), u ? (u = !1, c = this._nextDate(o, n, i), d += (l.valueOf() - r.valueOf()) / (l.valueOf() - o.valueOf())) : h && g ? (h = !1, d += (s.valueOf() - r.valueOf()) / (l.valueOf() - o.valueOf())) : d++;
    else {
      var f = this._getUnitOrder(n), y = this.units[f - 1];
      y && !this._isWorkTime(r, y) && (c = this._getClosestWorkTimeFuture(r, y));
    }
    r = c;
  }
  return d;
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
      var d = this.$gantt.date.week_start(new Date(s));
      if (s.valueOf() === d.valueOf()) {
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
  var l = this.$gantt.date.day_start(new Date(r)), d = r, c = this._getMinutesBetweenSingleDay(s, o), u = this._getMinutesBetweenSingleDay(l, d);
  return c + this._getWorkUnitsForRange(o, l, n, i) + u;
}, _getHoursBetween: function(t, e, n, i) {
  var a = new Date(t), r = new Date(e);
  i = i || 1;
  var s = new Date(a), o = this.$gantt.date.add(this.$gantt.date.day_start(new Date(a)), 1, "day");
  if (r.valueOf() <= o.valueOf()) return Math.round(this._getMinutesBetweenSingleDay(t, e) / 60);
  var l = this.$gantt.date.day_start(new Date(r)), d = r, c = this._getMinutesBetweenSingleDay(s, o, n, i) / 60, u = this._getMinutesBetweenSingleDay(l, d, n, i) / 60, h = c + this._getWorkUnitsForRange(o, l, n, i) + u;
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
  if (!(t instanceof me)) return !1;
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
        var d = l.split(":").map(function(u) {
          return u.trim();
        }), c = parseInt(60 * d[0] * 60);
        d[1] && (c += parseInt(60 * d[1])), d[2] && (c += parseInt(d[2])), e.push(c);
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
    var d = new Date(l.valueOf() + 1);
    i > 0 && (d = new Date(l.valueOf() - 1)), this._isWorkTime(d, n) && !o && r++, s = l;
  }
  return { end: s, start: t, added: r };
}, _addHoursUntilDayEnd: function(t, e) {
  for (var n = this.$gantt.date.add(this.$gantt.date.day_start(new Date(t)), 1, "day"), i = 0, a = e, r = this._getIntervalTimestamp(t, n), s = this._getWorkHours(t), o = 0; o < s.length && i < e; o++) {
    var l = s[o];
    if (r.end >= l.start && r.start <= l.end) {
      var d = Math.max(l.start, r.start), c = Math.min(l.end, r.end), u = (c - d) / 3600;
      u > a && (u = a, c = d + 60 * a * 60);
      var h = Math.round((c - d) / 3600);
      i += h, a -= h, r.start = c;
    }
  }
  var g = n;
  return i === e && (g = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, r.start)), { added: i, end: g };
}, _calculateHourEndDate: function(t, e, n) {
  var i = new Date(t), a = 0;
  n = n || 1, e = Math.abs(1 * e);
  var r = this._addHoursUntilDayEnd(i, e);
  if (a = r.added, i = r.end, d = e - a) {
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
    var d = e - a;
    i = (r = this._addHoursUntilDayEnd(i, d)).end;
  }
  return i;
}, _addMinutesUntilHourEnd: function(t, e) {
  if (t.getMinutes() === 0) return { added: 0, end: new Date(t) };
  for (var n = this.$gantt.date.add(this.$gantt.date.hour_start(new Date(t)), 1, "hour"), i = 0, a = e, r = this._getIntervalTimestamp(t, n), s = this._getWorkHours(t), o = 0; o < s.length && i < e; o++) {
    var l = s[o];
    if (r.end >= l.start && r.start <= l.end) {
      var d = Math.max(l.start, r.start), c = Math.min(l.end, r.end), u = (c - d) / 60;
      u > a && (u = a, c = d + 60 * a);
      var h = Math.round((c - d) / 60);
      a -= h, i += h, r.start = c;
    }
  }
  var g = n;
  return i === e && (g = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, r.start)), { added: i, end: g };
}, _subtractMinutesUntilHourStart: function(t, e) {
  for (var n = this.$gantt.date.hour_start(new Date(t)), i = 0, a = e, r = 60 * n.getHours() * 60 + 60 * n.getMinutes() + n.getSeconds(), s = 60 * t.getHours() * 60 + 60 * t.getMinutes() + t.getSeconds(), o = this._getWorkHours(t), l = o.length - 1; l >= 0 && i < e; l--) {
    var d = o[l];
    if (s > d.start && r <= d.end) {
      var c = Math.min(s, d.end), u = Math.max(r, d.start), h = (c - u) / 60;
      h > a && (h = a, u = c - 60 * a);
      var g = Math.abs(Math.round((c - u) / 60));
      a -= g, i += g, s = u;
    }
  }
  var f = n;
  return i === e && (f = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, s)), { added: i, end: f };
}, _subtractMinuteDate: function(t, e, n) {
  var i = this.getClosestWorkTime({ date: t, dir: "past", unit: "minute" }), a = 0;
  n = n || -1, e = Math.abs(1 * e), e = Math.round(e);
  const r = this._isMinutePrecision(i);
  let s = this._subtractMinutesUntilHourStart(i, e);
  a += s.added, i = s.end;
  for (var o = 0, l = [], d = 0; a < e; ) {
    var c = this.$gantt.date.day_start(new Date(i)), u = !1;
    i.valueOf() === c.valueOf() && (c = this.$gantt.date.add(c, -1, "day"), u = !0);
    var h = new Date(c.getFullYear(), c.getMonth(), c.getDate(), 23, 59, 59, 999).valueOf();
    h !== o && (l = this._getWorkHours(c), d = this._getMinutesPerDay(c), o = h);
    var g = e - a, f = this._getTimeOfDayStamp(i, u);
    if (l.length && d) if (l[l.length - 1].end <= f && g > d) a += d, i = this.$gantt.date.add(i, -1, "day");
    else {
      for (var y = !1, v = null, b = null, _ = l.length - 1; _ >= 0; _--) if (l[_].start < f - 1 && l[_].end >= f - 1) {
        y = !0, v = l[_], b = l[_ - 1];
        break;
      }
      if (y) if (f === v.end && g >= v.durationMinutes) a += v.durationMinutes, i = this.$gantt.date.add(i, -v.durationMinutes, "minute");
      else if (!r && g <= f / 60 - v.startMinute) a += g, i = this.$gantt.date.add(i, -g, "minute");
      else if (r) g <= f / 60 - v.startMinute ? (a += g, i = this.$gantt.date.add(i, -g, "minute")) : (a += f / 60 - v.startMinute, i = b ? new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, b.end) : this.$gantt.date.day_start(i));
      else {
        var m = this._getMinutesPerHour(i);
        m <= g ? (a += m, i = this._nextDate(i, "hour", n)) : (s = this._subtractMinutesUntilHourStart(i, g), a += s.added, i = s.end);
      }
      else if (i.getHours() === 0 && i.getMinutes() === 0 && i.getSeconds() === 0) {
        if ((p = this._getClosestWorkTimePast(i, "hour")).valueOf() === i.valueOf()) {
          var p = this.$gantt.date.add(i, -1, "day"), k = this._getWorkHours(p);
          if (k.length) {
            var $ = k[k.length - 1];
            p.setSeconds($.durationSeconds);
          }
        }
        i = p;
      } else i = this._getClosestWorkTimePast(new Date(i - 1), "hour");
    }
    else i = this.$gantt.date.add(i, -1, "day");
  }
  if (a < e) {
    var w = e - a;
    s = this._subtractMinutesUntilHourStart(i, w), a += s.added, i = s.end;
  }
  return i;
}, _calculateMinuteEndDate: function(t, e, n) {
  var i = new Date(t), a = 0;
  n = n || 1, e = Math.abs(1 * e), e = Math.round(e);
  var r = this._addMinutesUntilHourEnd(i, e);
  a += r.added, i = r.end;
  for (var s = 0, o = [], l = 0, d = this._isMinutePrecision(i); a < e; ) {
    var c = this.$gantt.date.day_start(new Date(i)).valueOf();
    c !== s && (o = this._getWorkHours(i), l = this._getMinutesPerDay(i), s = c);
    var u = e - a, h = this._getTimeOfDayStamp(i);
    if (o.length && l) if (o[0].start >= h && u >= l) {
      if (a += l, u == l) {
        i = new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, o[o.length - 1].end);
        break;
      }
      i = this.$gantt.date.add(i, 1, "day"), i = this.$gantt.date.day_start(i);
    } else {
      for (var g = !1, f = null, y = 0; y < o.length; y++) if (o[y].start <= h && o[y].end > h) {
        g = !0, f = o[y];
        break;
      }
      if (g) if (h === f.start && u >= f.durationMinutes) a += f.durationMinutes, i = this.$gantt.date.add(i, f.durationMinutes, "minute");
      else if (u <= f.endMinute - h / 60) a += u, i = this.$gantt.date.add(i, u, "minute");
      else {
        var v = this._getMinutesPerHour(i);
        v <= u ? (a += v, i = d ? this.$gantt.date.add(i, v, "minute") : this._nextDate(i, "hour", n)) : (a += (r = this._addMinutesUntilHourEnd(i, u)).added, i = r.end);
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
} }, wi = (zt = {}, { getCalendarIdFromMultipleResources: function(t, e) {
  var n = function(a) {
    return a.map(function(r) {
      return r && r.resource_id ? r.resource_id : r;
    }).sort().join("-");
  }(t);
  if (t.length) {
    if (t.length === 1) return e.getResourceCalendar(n).id;
    if (zt[n]) return zt[n].id;
    var i = function(a, r) {
      return r.mergeCalendars(a.map(function(s) {
        var o = s && s.resource_id ? s.resource_id : s;
        return r.getResourceCalendar(o);
      }));
    }(t, e);
    return zt[n] = i, e.addCalendar(i);
  }
  return null;
} });
var zt;
function fn(t) {
  this.$gantt = t, this._calendars = {}, this._legacyConfig = void 0, this.$gantt.attachEvent("onGanttReady", (function() {
    this.$gantt.config.resource_calendars && (this._isLegacyConfig = It.isLegacyResourceCalendarFormat(this.$gantt.config.resource_calendars));
  }).bind(this)), this.$gantt.attachEvent("onBeforeGanttReady", (function() {
    this.createDefaultCalendars();
  }).bind(this)), this.$gantt.attachEvent("onBeforeGanttRender", (function() {
    this.createDefaultCalendars();
  }).bind(this));
}
function ve(t, e) {
  this.argumentsHelper = e, this.$gantt = t;
}
function pn(t) {
  this.$gantt = t.$gantt, this.argumentsHelper = _n(this.$gantt), this.calendarManager = t, this.$disabledCalendar = new ve(this.$gantt, this.argumentsHelper);
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
  var e = new me(this.$gantt, _n(this.$gantt));
  e.id = String(rt());
  var n = this._convertWorkTimeSettings(t);
  if (n.customWeeks) for (var i in n.customWeeks) n.customWeeks[i] = this._convertWorkTimeSettings(n.customWeeks[i]);
  return e._setConfig(n), e;
}, createCalendar: function(t) {
  var e;
  return t || (t = {}), N(e = t.getConfig ? q(t.getConfig()) : t.worktime ? q(t.worktime) : q(t), q(this.defaults.fulltime.worktime)), this._createCalendarFromConfig(e);
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
    if (n = this._legacyConfig === !1 ? e.resource_property : It.getResourceProperty(e), Array.isArray(t[n])) e.dynamic_resource_calendars ? i = wi.getCalendarIdFromMultipleResources(t[n], this) : a = this.getResourceCalendar(t[n]);
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
    return t.id = t.id || rt(), this._calendars[t.id] = t, n.worktimes || (n.worktimes = {}), n.worktimes[t.id] = t.getConfig(), t.id;
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
} }, ve.prototype = { getWorkHours: function() {
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
  return t instanceof ve;
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
const Si = { create: function(t, e) {
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
} };
function Ti(t) {
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
    var l = !!(o && o != t.config.root_id && t.isTaskExists(o)) && t.getTask(o), d = null;
    if (l) if (t.config.schedule_from_end) d = t.calculateEndDate({ start_date: l.end_date, duration: -t.config.duration_step, task: s });
    else {
      if (!l.start_date) return e(l, t.getParent(l));
      d = l.start_date;
    }
    else if (t.config.schedule_from_end) d = t.calculateEndDate({ start_date: t._getProjectEnd(), duration: -t.config.duration_step, task: s });
    else {
      const c = t.getTaskByIndex(0), u = t.config.start_date || t.getState().min_date;
      d = c ? c.start_date ? c.start_date : c.end_date ? t.calculateEndDate({ start_date: c.end_date, duration: -t.config.duration_step, task: s }) : u : u;
    }
    return t.assert(d, "Invalid dates"), new Date(d);
  };
  t._set_default_task_timing = function(s) {
    s.start_date = s.start_date || e(s, t.getParent(s)), s.duration = s.duration || t.config.duration_step, s.end_date = s.end_date || t.calculateEndDate(s);
  }, t.createTask = function(s, o, l) {
    if (s = s || {}, t.defined(s.id) || (s.id = t.uid()), s.start_date || (s.start_date = e(s, o)), s.text === void 0 && (s.text = t.locale.labels.new_task), s.duration === void 0 && (s.duration = 1), this.isTaskExists(o)) {
      this.setParent(s, o, !0);
      var d = this.getTask(o);
      d.$open = !0, this.config.details_on_create || this.callEvent("onAfterParentExpand", [o, d]);
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
    var l = t.getTaskType(s.type), d = { type: l, $no_start: !1, $no_end: !1, scheduled_summary: !1 };
    return l === t.config.types.project && s.auto_scheduling === !1 && (d.scheduled_summary = !0), o || l != s.$rendered_type ? (l == t.config.types.project ? d.$no_end = d.$no_start = !0 : l != t.config.types.milestone && (d.$no_end = !(s.end_date || s.duration), d.$no_start = !s.start_date, t._isAllowedUnscheduledTask(s) && (d.$no_end = d.$no_start = !1)), d) : (d.$no_start = s.$no_start, d.$no_end = s.$no_end, d);
  };
  function i(s) {
    s.$effective_calendar = t.getTaskCalendar(s).id, s.start_date = t.getClosestWorkTime({ dir: "future", date: s.start_date, unit: t.config.duration_unit, task: s }), s.end_date = t.calculateEndDate(s);
  }
  function a(s, o, l, d) {
    const c = { start: "start_date", end: "end_date" }, u = { start: "$auto_start_date", end: "$auto_end_date" };
    let h;
    h = s.type === t.config.types.project && s.auto_scheduling === !1 ? u : c, o.$no_start && (s[h.start] = l ? new Date(l) : e(s, this.getParent(s))), o.$no_end && (s[h.end] = d ? new Date(d) : this.calculateEndDate({ start_date: s[h.start], duration: this.config.duration_step, task: s })), (o.$no_start || o.$no_end) && this._init_task_timing(s);
  }
  function r(s) {
    var o = null, l = null, d = s !== void 0 ? s : t.config.root_id, c = [];
    return t.eachTask(function(u) {
      const h = t.getTaskType(u.type) == t.config.types.project && u.auto_scheduling === !1;
      t.getTaskType(u.type) == t.config.types.project && !h || t.isUnscheduledTask(u) || (u.rollup && c.push(u.id), !u.start_date || u.$no_start && !h || o && !(o > u.start_date.valueOf()) || (o = u.start_date.valueOf()), !u.end_date || u.$no_end && !h || l && !(l < u.end_date.valueOf()) || (l = u.end_date.valueOf()));
    }, d), { start_date: o ? new Date(o) : null, end_date: l ? new Date(l) : null, rollup: c };
  }
  t._init_task_timing = function(s) {
    var o = n(s, !0), l = s.$rendered_type != o.type, d = o.type;
    l && (s.$no_start = o.$no_start, s.$no_end = o.$no_end, s.$rendered_type = o.type), l && d != this.config.types.milestone && d == this.config.types.project && (this._set_default_task_timing(s), s.$calculate_duration = !1), d == this.config.types.milestone && (s.end_date = s.start_date), s.start_date && s.end_date && s.$calculate_duration !== !1 && (s.duration = this.calculateDuration(s)), s.$calculate_duration || (s.$calculate_duration = !0), s.end_date || (s.end_date = s.start_date), s.duration = s.duration || 0, this.config.min_duration === 0 && s.duration === 0 && (s.$no_end = !1);
    var c = this.getTaskCalendar(s);
    s.$effective_calendar && s.$effective_calendar !== c.id && (i(s), this.config.inherit_calendar && this.isSummaryTask(s) && this.eachTask(function(u) {
      i(u);
    }, s.id)), s.$effective_calendar = c.id;
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
    return this.eachTask(function(d) {
      this.getTaskType(d.type) == t.config.types.project || this.isUnscheduledTask(d) || (o += d.duration);
    }, l), o;
  }, t.getSubtaskDates = function(s) {
    var o = r(s);
    return { start_date: o.start_date, end_date: o.end_date };
  }, t._update_parents = function(s, o, l) {
    if (s) {
      var d = this.getTask(s);
      d.rollup && (l = !0);
      var c = this.getParent(d), u = n(d), h = !0;
      if (l || d.start_date && d.end_date && (u.$no_start || u.$no_end)) {
        const y = d.$auto_start_date ? "$auto_start_date" : "start_date", v = d.$auto_end_date ? "$auto_end_date" : "end_date";
        var g = d[y].valueOf(), f = d[v].valueOf();
        t.resetProjectDates(d), l || g != d[y].valueOf() || f != d[v].valueOf() || (h = !1), h && !o && this.refreshTask(d.id, !0), u.scheduled_summary && (h = !0);
      }
      h && c && this.isTaskExists(c) && this._update_parents(c, o, l);
    }
  }, t.roundDate = function(s) {
    var o = t.getScale();
    X(s) && (s = { date: s, unit: o ? o.unit : t.config.duration_unit, step: o ? o.step : t.config.duration_step });
    var l, d, c, u = s.date, h = s.step, g = s.unit;
    if (!o) return u;
    if (g == o.unit && h == o.step && +u >= +o.min_date && +u <= +o.max_date) c = Math.floor(t.columnIndexByDate(u)), o.trace_x[c] || (c -= 1, o.rtl && (c = 0)), d = new Date(o.trace_x[c]), l = t.date.add(d, h, g);
    else {
      for (c = Math.floor(t.columnIndexByDate(u)), l = t.date[g + "_start"](new Date(o.min_date)), o.trace_x[c] && (l = t.date[g + "_start"](o.trace_x[c])); +l < +u; ) {
        var f = (l = t.date[g + "_start"](t.date.add(l, h, g))).getTimezoneOffset();
        l = t._correct_dst_change(l, f, l, g), t.date[g + "_start"] && (l = t.date[g + "_start"](l));
      }
      d = t.date.add(l, -1 * h, g);
    }
    return s.dir && s.dir == "future" ? l : s.dir && s.dir == "past" || Math.abs(u - d) < Math.abs(l - u) ? d : l;
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
function Be(t, e) {
  var n, i = t.config.container_resize_timeout || 20;
  let a = ze(t);
  if (t.config.container_resize_method == "timeout") l();
  else try {
    t.event(e, "resize", function() {
      if (t.$scrollbarRepaint) t.$scrollbarRepaint = null;
      else {
        let d = ze(t);
        if (a.x == d.x && a.y == d.y) return;
        a = d, r();
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
function ze(t) {
  return { x: t.$root.offsetWidth, y: t.$root.offsetHeight };
}
function Ei(t) {
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
    j(t) || (this.$root.innerHTML = "", this.$root.gantt = this, ge(this), this.config.layout.id = "main", this.$layout = this.$ui.createView("layout", this.$root, this.config.layout), this.$layout.attachEvent("onBeforeResize", function() {
      for (var r = t.$services.getService("datastores"), s = 0; s < r.length; s++) t.getDatastore(r[s]).filter(), t.$data.tasksStore._skipTaskRecalculation ? t.$data.tasksStore._skipTaskRecalculation != "lightbox" && (t.$data.tasksStore._skipTaskRecalculation = !1) : t.getDatastore(r[s]).callEvent("onBeforeRefreshAll", []);
    }), this.$layout.attachEvent("onResize", function() {
      t._quickRefresh(function() {
        t.refreshData();
      });
    }), this.callEvent("onGanttLayoutReady", []), this.$layout.render(), this.$container = this.$layout.$container.firstChild, function(r) {
      window.getComputedStyle(r.$root).getPropertyValue("position") == "static" && (r.$root.style.position = "relative");
      var s = document.createElement("iframe");
      s.className = "gantt_container_resize_watcher", s.tabIndex = -1, r.config.wai_aria_attributes && (s.setAttribute("role", "none"), s.setAttribute("aria-hidden", !0)), (window.Sfdc || window.$A || window.Aura) && (r.config.container_resize_method = "timeout"), r.$root.appendChild(s), s.contentWindow ? Be(r, s.contentWindow) : (r.$root.removeChild(s), Be(r, window));
    }(this));
  }).bind(t);
  t.resetLayout = function() {
    i(), a(), this.render();
  }, t._reinit = function(r) {
    this.callEvent("onBeforeGanttReady", []), this._update_flags(), this.$services.getService("templateLoader").initTemplates(this), i(), this.$root = null, r && (this.$root = xe(r), a(), this.$mouseEvents.reset(this.$root), function(s) {
      s.$container && !s.config.autosize && s.$root.offsetHeight < 50 && console.warn(`The Gantt container has a small height, so you cannot see its content. If it is not intended, you need to set the 'height' style rule to the container:
https://docs.dhtmlx.com/gantt/faq.html#theganttchartisntrenderedcorrectly`);
    }(t)), this.callEvent("onTemplatesReady", []), this.callEvent("onGanttReady", []), this.render();
  }, t.$click = { buttons: { edit: function(r) {
    t.isReadonly(t.getTask(r)) || t.showLightbox(r);
  }, delete: function(r) {
    var s = t.getTask(r);
    if (!t.isReadonly(s)) {
      var o = t.locale.labels.confirm_deleting, l = t.locale.labels.confirm_deleting_title;
      t._simple_confirm(o, l, function() {
        t.isTaskExists(r) && (s.$new ? (t.$data.tasksStore._skipTaskRecalculation = "lightbox", t.silent(function() {
          t.deleteTask(r, !0);
        }), t.$data.tasksStore._skipTaskRecalculation = !1, t.refreshData()) : (t.$data.tasksStore._skipTaskRecalculation = !0, t.deleteTask(r))), t.hideLightbox();
      });
    }
  } } }, t.render = function() {
    var r;
    if (this.callEvent("onBeforeGanttRender", []), !j(t)) {
      !this.config.sort && this._sort && (this._sort = void 0), this.$root && (this.config.rtl ? (this.$root.classList.add("gantt_rtl"), this.$root.firstChild.classList.add("gantt_rtl")) : (this.$root.classList.remove("gantt_rtl"), this.$root.firstChild.classList.remove("gantt_rtl")));
      var s = this.getScrollState(), o = s ? s.x : 0;
      this._getHorizontalScrollbar() && (o = this._getHorizontalScrollbar().$config.codeScrollLeft || o || 0), r = null, o && (r = t.dateFromPos(o + this.config.task_scroll_offset));
    }
    if (ge(this), j(t)) t.refreshData();
    else {
      this.$layout.$config.autosize = this.config.autosize;
      var l = this.config.preserve_scroll;
      if (this.config.preserve_scroll = !1, this.$layout.resize(), this.config.preserve_scroll = l, this.config.preserve_scroll && s) {
        if (o || s.y) {
          var d = t.getScrollState();
          if (+r != +t.dateFromPos(d.x) || d.y != s.y) {
            o = null;
            var c = null;
            r && (o = Math.max(t.posFromDate(r) - t.config.task_scroll_offset, 0)), s.y && (c = s.y), t.scrollTo(o, c);
          }
        }
        this.$layout.getScrollbarsInfo().forEach((u) => {
          const h = t.$ui.getView(u.id), g = t.utils.dom.isChildOf(h.$view, t.$container);
          u.boundViews.forEach((f) => {
            const y = t.$ui.getView(f);
            u.y && u.y != s.y && y && !g && y.scrollTo(void 0, 0);
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
    var d = null;
    if (!(d = typeof r == "object" ? r : { source: r, target: s, type: this._get_link_type(o, l) }) || !(d.source && d.target && d.type) || d.source == d.target) return !1;
    var c = !0;
    return this.checkEvent("onLinkValidation") && (c = this.callEvent("onLinkValidation", [d])), c;
  }, t._correct_dst_change = function(r, s, o, l) {
    var d = Ft(l) * o;
    if (d > 3600 && d < 86400) {
      var c = r.getTimezoneOffset() - s;
      c && (r = t.date.add(r, c, "minute"));
    }
    return r;
  }, t.isSplitTask = function(r) {
    return t.assert(r && r instanceof Object, "Invalid argument <b>task</b>=" + r + " of gantt.isSplitTask. Task object was expected"), this.$data.tasksStore._isSplitItem(r);
  }, t._is_icon_open_click = function(r) {
    if (!r) return !1;
    var s = r.target || r.srcElement;
    if (!s || !s.className) return !1;
    var o = K(s);
    return o.indexOf("gantt_tree_icon") !== -1 && (o.indexOf("gantt_close") !== -1 || o.indexOf("gantt_open") !== -1);
  };
}
const Ci = { date: { month_full: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"], month_short: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_full: ["الأحد", "الأثنين", "ألثلاثاء", "الأربعاء", "ألحميس", "ألجمعة", "السبت"], day_short: ["احد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"] }, labels: { new_task: "مهمة جديد", icon_save: "اخزن", icon_cancel: "الغاء", icon_details: "تفاصيل", icon_edit: "تحرير", icon_delete: "حذف", confirm_closing: "التغييرات سوف تضيع, هل انت متأكد؟", confirm_deleting: "الحدث سيتم حذفها نهائيا ، هل أنت متأكد؟", section_description: "الوصف", section_time: "الفترة الزمنية", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "الغاء", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Di = { date: { month_full: ["Студзень", "Люты", "Сакавік", "Красавік", "Maй", "Чэрвень", "Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Снежань"], month_short: ["Студз", "Лют", "Сак", "Крас", "Maй", "Чэр", "Ліп", "Жнів", "Вер", "Каст", "Ліст", "Снеж"], day_full: ["Нядзеля", "Панядзелак", "Аўторак", "Серада", "Чацвер", "Пятніца", "Субота"], day_short: ["Нд", "Пн", "Аўт", "Ср", "Чцв", "Пт", "Сб"] }, labels: { new_task: "Новае заданне", icon_save: "Захаваць", icon_cancel: "Адмяніць", icon_details: "Дэталі", icon_edit: "Змяніць", icon_delete: "Выдаліць", confirm_closing: "", confirm_deleting: "Падзея будзе выдалена незваротна, працягнуць?", section_description: "Апісанне", section_time: "Перыяд часу", section_type: "Тып", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "ІСР", column_text: "Задача", column_start_date: "Пачатак", column_duration: "Працяг", column_add: "", link: "Сувязь", confirm_link_deleting: "будзе выдалена", link_start: "(пачатак)", link_end: "(канец)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Хвiлiна", hours: "Гадзiна", days: "Дзень", weeks: "Тыдзень", months: "Месяц", years: "Год", message_ok: "OK", message_cancel: "Адмяніць", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ai = { date: { month_full: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], month_short: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"], day_full: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"], day_short: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"] }, labels: { new_task: "Nova tasca", icon_save: "Guardar", icon_cancel: "Cancel·lar", icon_details: "Detalls", icon_edit: "Editar", icon_delete: "Esborrar", confirm_closing: "", confirm_deleting: "L'esdeveniment s'esborrarà definitivament, continuar ?", section_description: "Descripció", section_time: "Periode de temps", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Cancel·lar", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ii = { date: { month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], day_short: ["日", "一", "二", "三", "四", "五", "六"] }, labels: { new_task: "新任務", icon_save: "保存", icon_cancel: "关闭", icon_details: "详细", icon_edit: "编辑", icon_delete: "删除", confirm_closing: "请确认是否撤销修改!", confirm_deleting: "是否删除日程?", section_description: "描述", section_time: "时间范围", section_type: "类型", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "工作分解结构", column_text: "任务名", column_start_date: "开始时间", column_duration: "持续时间", column_add: "", link: "关联", confirm_link_deleting: "将被删除", link_start: " (开始)", link_end: " (结束)", type_task: "任务", type_project: "项目", type_milestone: "里程碑", minutes: "分钟", hours: "小时", days: "天", weeks: "周", months: "月", years: "年", message_ok: "OK", message_cancel: "关闭", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Mi = { date: { month_full: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], month_short: ["Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čec", "Srp", "Září", "Říj", "List", "Pro"], day_full: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"], day_short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"] }, labels: { new_task: "Nová práce", icon_save: "Uložit", icon_cancel: "Zpět", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Smazat", confirm_closing: "", confirm_deleting: "Událost bude trvale smazána, opravdu?", section_description: "Poznámky", section_time: "Doba platnosti", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Zpět", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ni = { date: { month_full: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny opgave", icon_save: "Gem", icon_cancel: "Fortryd", icon_details: "Detaljer", icon_edit: "Tilret", icon_delete: "Slet", confirm_closing: "Dine rettelser vil gå tabt.. Er dy sikker?", confirm_deleting: "Bigivenheden vil blive slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Fortryd", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Li = { date: { month_full: [" Januar", " Februar", " März ", " April", " Mai", " Juni", " Juli", " August", " September ", " Oktober", " November ", " Dezember"], month_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], day_full: ["Sonntag", "Montag", "Dienstag", " Mittwoch", " Donnerstag", "Freitag", "Samstag"], day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"] }, labels: { new_task: "Neue Aufgabe", icon_save: "Speichern", icon_cancel: "Abbrechen", icon_details: "Details", icon_edit: "Ändern", icon_delete: "Löschen", confirm_closing: "", confirm_deleting: "Der Eintrag wird gelöscht", section_description: "Beschreibung", section_time: "Zeitspanne", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "PSP", column_text: "Task-Namen", column_start_date: "Startzeit", column_duration: "Dauer", column_add: "", link: "Link", confirm_link_deleting: "werden gelöscht", link_start: "(starten)", link_end: "(ende)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minuten", hours: "Stunden", days: "Tage", weeks: "Wochen", months: "Monate", years: "Jahre", message_ok: "OK", message_cancel: "Abbrechen", section_constraint: "Regel", constraint_type: "Regel", constraint_date: "Regel - Datum", asap: "So bald wie möglich", alap: "So spät wie möglich", snet: "Beginn nicht vor", snlt: "Beginn nicht später als", fnet: "Fertigstellung nicht vor", fnlt: "Fertigstellung nicht später als", mso: "Muss beginnen am", mfo: "Muss fertig sein am", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Pi = { date: { month_full: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], month_short: ["ΙΑΝ", "ΦΕΒ", "ΜΑΡ", "ΑΠΡ", "ΜΑΙ", "ΙΟΥΝ", "ΙΟΥΛ", "ΑΥΓ", "ΣΕΠ", "ΟΚΤ", "ΝΟΕ", "ΔΕΚ"], day_full: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Κυριακή"], day_short: ["ΚΥ", "ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"] }, labels: { new_task: "Νέα εργασία", icon_save: "Αποθήκευση", icon_cancel: "Άκυρο", icon_details: "Λεπτομέρειες", icon_edit: "Επεξεργασία", icon_delete: "Διαγραφή", confirm_closing: "", confirm_deleting: "Το έργο θα διαγραφεί οριστικά. Θέλετε να συνεχίσετε;", section_description: "Περιγραφή", section_time: "Χρονική περίοδος", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Άκυρο", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ri = { date: { month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, labels: { new_task: "New task", icon_save: "Save", icon_cancel: "Cancel", icon_details: "Details", icon_edit: "Edit", icon_delete: "Delete", confirm_closing: "", confirm_deleting: "Task will be deleted permanently, are you sure?", section_description: "Description", section_time: "Time period", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Cancel", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Hi = { date: { month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] }, labels: { new_task: "Nueva tarea", icon_save: "Guardar", icon_cancel: "Cancelar", icon_details: "Detalles", icon_edit: "Editar", icon_delete: "Eliminar", confirm_closing: "", confirm_deleting: "El evento se borrará definitivamente, ¿continuar?", section_description: "Descripción", section_time: "Período", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "EDT", column_text: "Tarea", column_start_date: "Inicio", column_duration: "Duración", column_add: "", link: "Enlace", confirm_link_deleting: "será borrada", link_start: " (inicio)", link_end: " (fin)", type_task: "Tarea", type_project: "Proyecto", type_milestone: "Hito", minutes: "Minutos", hours: "Horas", days: "Días", weeks: "Semanas", months: "Meses", years: "Años", message_ok: "OK", message_cancel: "Cancelar", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Oi = { date: { month_full: ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"], month_short: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], day_full: ["يکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"], day_short: ["ی", "د", "س", "چ", "پ", "ج", "ش"] }, labels: { new_task: "وظیفه جدید", icon_save: "ذخیره", icon_cancel: "لغو", icon_details: "جزییات", icon_edit: "ویرایش", icon_delete: "حذف", confirm_closing: "تغییرات شما ازدست خواهد رفت، آیا مطمئن هستید؟", confirm_deleting: "این مورد برای همیشه حذف خواهد شد، آیا مطمئن هستید؟", section_description: "توضیحات", section_time: "مدت زمان", section_type: "نوع", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "عنوان", column_start_date: "زمان شروع", column_duration: "مدت", column_add: "", link: "ارتباط", confirm_link_deleting: "حذف خواهد شد", link_start: " (آغاز)", link_end: " (پایان)", type_task: "وظیفه", type_project: "پروژه", type_milestone: "نگارش", minutes: "دقایق", hours: "ساعات", days: "روزها", weeks: "هفته", months: "ماه‌ها", years: "سال‌ها", message_ok: "تایید", message_cancel: "لغو", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Bi = { date: { month_full: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], month_short: ["Tam", "Hel", "Maa", "Huh", "Tou", "Kes", "Hei", "Elo", "Syy", "Lok", "Mar", "Jou"], day_full: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"], day_short: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"] }, labels: { new_task: "Uusi tehtävä", icon_save: "Tallenna", icon_cancel: "Peru", icon_details: "Tiedot", icon_edit: "Muokkaa", icon_delete: "Poista", confirm_closing: "", confirm_deleting: "Haluatko varmasti poistaa tapahtuman?", section_description: "Kuvaus", section_time: "Aikajakso", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Peru", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, zi = { date: { month_full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], month_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"], day_full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] }, labels: { new_task: "Nouvelle tâche", icon_save: "Enregistrer", icon_cancel: "Annuler", icon_details: "Détails", icon_edit: "Modifier", icon_delete: "Effacer", confirm_closing: "", confirm_deleting: "L'événement sera effacé sans appel, êtes-vous sûr ?", section_description: "Description", section_time: "Période", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "OTP", column_text: "Nom de la tâche", column_start_date: "Date initiale", column_duration: "Durée", column_add: "", link: "Le lien", confirm_link_deleting: "sera supprimé", link_start: "(début)", link_end: "(fin)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Heures", days: "Jours", weeks: "Semaines", months: "Mois", years: "Années", message_ok: "OK", message_cancel: "Annuler", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Wi = { date: { month_full: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], month_short: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], day_full: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"], day_short: ["א", "ב", "ג", "ד", "ה", "ו", "ש"] }, labels: { new_task: "משימה חדש", icon_save: "שמור", icon_cancel: "בטל", icon_details: "פרטים", icon_edit: "ערוך", icon_delete: "מחק", confirm_closing: "", confirm_deleting: "ארוע ימחק סופית.להמשיך?", section_description: "הסבר", section_time: "תקופה", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "בטל", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ji = { date: { month_full: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"], month_short: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"], day_full: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"], day_short: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"] }, labels: { new_task: "Novi Zadatak", icon_save: "Spremi", icon_cancel: "Odustani", icon_details: "Detalji", icon_edit: "Izmjeni", icon_delete: "Obriši", confirm_closing: "", confirm_deleting: "Zadatak će biti trajno izbrisan, jeste li sigurni?", section_description: "Opis", section_time: "Vremenski Period", section_type: "Tip", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Naziv Zadatka", column_start_date: "Početno Vrijeme", column_duration: "Trajanje", column_add: "", link: "Poveznica", confirm_link_deleting: "će biti izbrisan", link_start: " (početak)", link_end: " (kraj)", type_task: "Zadatak", type_project: "Projekt", type_milestone: "Milestone", minutes: "Minute", hours: "Sati", days: "Dani", weeks: "Tjedni", months: "Mjeseci", years: "Godine", message_ok: "OK", message_cancel: "Odustani", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Fi = { date: { month_full: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], month_short: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Vasárnap", "Hétfõ", "Kedd", "Szerda", "Csütörtök", "Péntek", "szombat"], day_short: ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"] }, labels: { new_task: "Új feladat", icon_save: "Mentés", icon_cancel: "Mégse", icon_details: "Részletek", icon_edit: "Szerkesztés", icon_delete: "Törlés", confirm_closing: "", confirm_deleting: "Az esemény törölve lesz, biztosan folytatja?", section_description: "Leírás", section_time: "Idõszak", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Mégse", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Vi = { date: { month_full: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"], day_full: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], day_short: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] }, labels: { new_task: "Tugas baru", icon_save: "Simpan", icon_cancel: "Batal", icon_details: "Detail", icon_edit: "Edit", icon_delete: "Hapus", confirm_closing: "", confirm_deleting: "Acara akan dihapus", section_description: "Keterangan", section_time: "Periode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Batal", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ui = { date: { month_full: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], month_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"], day_full: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"], day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"] }, labels: { new_task: "Nuovo compito", icon_save: "Salva", icon_cancel: "Chiudi", icon_details: "Dettagli", icon_edit: "Modifica", icon_delete: "Elimina", confirm_closing: "", confirm_deleting: "Sei sicuro di confermare l'eliminazione?", section_description: "Descrizione", section_time: "Periodo di tempo", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Nome Attività", column_start_date: "Inizio", column_duration: "Durata", column_add: "", link: "Link", confirm_link_deleting: "sarà eliminato", link_start: " (inizio)", link_end: " (fine)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minuti", hours: "Ore", days: "Giorni", weeks: "Settimane", months: "Mesi", years: "Anni", message_ok: "OK", message_cancel: "Chiudi", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, qi = { date: { month_full: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], day_short: ["日", "月", "火", "水", "木", "金", "土"] }, labels: { new_task: "新しい仕事", icon_save: "保存", icon_cancel: "キャンセル", icon_details: "詳細", icon_edit: "編集", icon_delete: "削除", confirm_closing: "", confirm_deleting: "イベント完全に削除されます、宜しいですか？", section_description: "デスクリプション", section_time: "期間", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "キャンセル", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Gi = { date: { month_full: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], month_short: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], day_full: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], day_short: ["일", "월", "화", "수", "목", "금", "토"] }, labels: { new_task: "이름없는 작업", icon_save: "저장", icon_cancel: "취소", icon_details: "세부 사항", icon_edit: "수정", icon_delete: "삭제", confirm_closing: "", confirm_deleting: "작업을 삭제하시겠습니까?", section_description: "설명", section_time: "기간", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "작업명", column_start_date: "시작일", column_duration: "기간", column_add: "", link: "전제", confirm_link_deleting: "삭제 하시겠습니까?", link_start: " (start)", link_end: " (end)", type_task: "작업", type_project: "프로젝트", type_milestone: "마일스톤", minutes: "분", hours: "시간", days: "일", weeks: "주", months: "달", years: "년", message_ok: "OK", message_cancel: "취소", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } };
class Yi {
  constructor(e) {
    this.addLocale = (n, i) => {
      this._locales[n] = i;
    }, this.getLocale = (n) => this._locales[n], this._locales = {};
    for (const n in e) this._locales[n] = e[n];
  }
}
const Ji = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Mon", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny oppgave", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Rediger", icon_delete: "Slett", confirm_closing: "", confirm_deleting: "Hendelsen vil bli slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Ki = { date: { month_full: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"], day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"] }, labels: { new_task: "Nieuwe taak", icon_save: "Opslaan", icon_cancel: "Annuleren", icon_details: "Details", icon_edit: "Bewerken", icon_delete: "Verwijderen", confirm_closing: "", confirm_deleting: "Item zal permanent worden verwijderd, doorgaan?", section_description: "Beschrijving", section_time: "Tijd periode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Taak omschrijving", column_start_date: "Startdatum", column_duration: "Duur", column_add: "", link: "Koppeling", confirm_link_deleting: "zal worden verwijderd", link_start: " (start)", link_end: " (eind)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "minuten", hours: "uren", days: "dagen", weeks: "weken", months: "maanden", years: "jaren", message_ok: "OK", message_cancel: "Annuleren", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Xi = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { new_task: "Ny oppgave", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Endre", icon_delete: "Slett", confirm_closing: "Endringer blir ikke lagret, er du sikker?", confirm_deleting: "Oppføringen vil bli slettet, er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Zi = { date: { month_full: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"], month_short: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"], day_full: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"], day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"] }, labels: { new_task: "Nowe zadanie", icon_save: "Zapisz", icon_cancel: "Anuluj", icon_details: "Szczegóły", icon_edit: "Edytuj", icon_delete: "Usuń", confirm_closing: "", confirm_deleting: "Zdarzenie zostanie usunięte na zawsze, kontynuować?", section_description: "Opis", section_time: "Okres czasu", section_type: "Typ", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Nazwa zadania", column_start_date: "Początek", column_duration: "Czas trwania", column_add: "", link: "Link", confirm_link_deleting: "zostanie usunięty", link_start: " (początek)", link_end: " (koniec)", type_task: "Zadanie", type_project: "Projekt", type_milestone: "Milestone", minutes: "Minuty", hours: "Godziny", days: "Dni", weeks: "Tydzień", months: "Miesiące", years: "Lata", message_ok: "OK", message_cancel: "Anuluj", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, Qi = { date: { month_full: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], month_short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], day_full: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"], day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] }, labels: { new_task: "Nova tarefa", icon_save: "Salvar", icon_cancel: "Cancelar", icon_details: "Detalhes", icon_edit: "Editar", icon_delete: "Excluir", confirm_closing: "", confirm_deleting: "As tarefas serão excluidas permanentemente, confirme?", section_description: "Descrição", section_time: "Período", section_type: "Tipo", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "EAP", column_text: "Nome tarefa", column_start_date: "Data início", column_duration: "Duração", column_add: "", link: "Link", confirm_link_deleting: "Será excluído!", link_start: " (início)", link_end: " (fim)", type_task: "Task", type_project: "Projeto", type_milestone: "Marco", minutes: "Minutos", hours: "Horas", days: "Dias", weeks: "Semanas", months: "Meses", years: "Anos", message_ok: "OK", message_cancel: "Cancelar", section_constraint: "Restrição", constraint_type: "Tipo Restrição", constraint_date: "Data restrição", asap: "Mais breve possível", alap: "Mais tarde possível", snet: "Não começar antes de", snlt: "Não começar depois de", fnet: "Não terminar antes de", fnlt: "Não terminar depois de", mso: "Precisa começar em", mfo: "Precisa terminar em", resources_filter_placeholder: "Tipo de filtros", resources_filter_label: "Ocultar vazios", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ta = { date: { month_full: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "November", "December"], month_short: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"], day_short: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"] }, labels: { new_task: "Sarcina noua", icon_save: "Salveaza", icon_cancel: "Anuleaza", icon_details: "Detalii", icon_edit: "Editeaza", icon_delete: "Sterge", confirm_closing: "Schimbarile nu vor fi salvate, esti sigur?", confirm_deleting: "Evenimentul va fi sters permanent, esti sigur?", section_description: "Descriere", section_time: "Interval", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Anuleaza", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ea = { date: { month_full: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"], month_short: ["Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек"], day_full: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"], day_short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] }, labels: { new_task: "Новое задание", icon_save: "Сохранить", icon_cancel: "Отменить", icon_details: "Детали", icon_edit: "Изменить", icon_delete: "Удалить", confirm_closing: "", confirm_deleting: "Событие будет удалено безвозвратно, продолжить?", section_description: "Описание", section_time: "Период времени", section_type: "Тип", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "ИСР", column_text: "Задача", column_start_date: "Начало", column_duration: "Длительность", column_add: "", link: "Связь", confirm_link_deleting: "будет удалена", link_start: " (начало)", link_end: " (конец)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Минута", hours: "Час", days: "День", weeks: "Неделя", months: "Месяц", years: "Год", message_ok: "OK", message_cancel: "Отменить", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "начните вводить слово для фильтрации", resources_filter_label: "спрятать не установленные", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, na = { date: { month_full: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"], day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"] }, labels: { new_task: "Nova naloga", icon_save: "Shrani", icon_cancel: "Prekliči", icon_details: "Podrobnosti", icon_edit: "Uredi", icon_delete: "Izbriši", confirm_closing: "", confirm_deleting: "Dogodek bo izbrisan. Želite nadaljevati?", section_description: "Opis", section_time: "Časovni okvir", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Prekliči", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ia = { date: { month_full: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sept", "Okt", "Nov", "Dec"], day_full: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"], day_short: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"] }, labels: { new_task: "Nová úloha", icon_save: "Uložiť", icon_cancel: "Späť", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Zmazať", confirm_closing: "Vaše zmeny nebudú uložené. Skutočne?", confirm_deleting: "Udalosť bude natrvalo vymazaná. Skutočne?", section_description: "Poznámky", section_time: "Doba platnosti", section_type: "Type", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Späť", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, aa = { date: { month_full: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"], day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] }, labels: { new_task: "Ny uppgift", icon_save: "Spara", icon_cancel: "Avbryt", icon_details: "Detajer", icon_edit: "Ändra", icon_delete: "Ta bort", confirm_closing: "", confirm_deleting: "Är du säker på att du vill ta bort händelsen permanent?", section_description: "Beskrivning", section_time: "Tid", section_type: "Typ", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Uppgiftsnamn", column_start_date: "Starttid", column_duration: "Varaktighet", column_add: "", link: "Länk", confirm_link_deleting: "kommer tas bort", link_start: " (start)", link_end: " (slut)", type_task: "Uppgift", type_project: "Projekt", type_milestone: "Milstolpe", minutes: "Minuter", hours: "Timmar", days: "Dagar", weeks: "Veckor", months: "Månader", years: "År", message_ok: "OK", message_cancel: "Avbryt", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, ra = { date: { month_full: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], month_short: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], day_full: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], day_short: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"] }, labels: { new_task: "Yeni görev", icon_save: "Kaydet", icon_cancel: "İptal", icon_details: "Detaylar", icon_edit: "Düzenle", icon_delete: "Sil", confirm_closing: "", confirm_deleting: "Görev silinecek, emin misiniz?", section_description: "Açıklama", section_time: "Zaman Aralığı", section_type: "Tip", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Görev Adı", column_start_date: "Başlangıç", column_duration: "Süre", column_add: "", link: "Bağlantı", confirm_link_deleting: "silinecek", link_start: " (başlangıç)", link_end: " (bitiş)", type_task: "Görev", type_project: "Proje", type_milestone: "Kilometretaşı", minutes: "Dakika", hours: "Saat", days: "Gün", weeks: "Hafta", months: "Ay", years: "Yıl", message_ok: "OK", message_cancel: "Ýptal", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } }, sa = { date: { month_full: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], month_short: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], day_full: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"] }, labels: { new_task: "Нове завдання", icon_save: "Зберегти", icon_cancel: "Відміна", icon_details: "Деталі", icon_edit: "Редагувати", icon_delete: "Вилучити", confirm_closing: "", confirm_deleting: "Подія вилучиться назавжди. Ви впевнені?", section_description: "Опис", section_time: "Часовий проміжок", section_type: "Тип", section_deadline: "Deadline", section_baselines: "Baselines", column_wbs: "WBS", column_text: "Task name", column_start_date: "Start time", column_duration: "Duration", column_add: "", link: "Link", confirm_link_deleting: "will be deleted", link_start: " (start)", link_end: " (end)", type_task: "Task", type_project: "Project", type_milestone: "Milestone", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Week", months: "Months", years: "Years", message_ok: "OK", message_cancel: "Відміна", section_constraint: "Constraint", constraint_type: "Constraint type", constraint_date: "Constraint date", asap: "As Soon As Possible", alap: "As Late As Possible", snet: "Start No Earlier Than", snlt: "Start No Later Than", fnet: "Finish No Earlier Than", fnlt: "Finish No Later Than", mso: "Must Start On", mfo: "Must Finish On", resources_filter_placeholder: "type to filter", resources_filter_label: "hide empty", empty_state_text_link: "Click here", empty_state_text_description: "to create your first task", baselines_section_placeholder: "Start adding a new baseline", baselines_add_button: "Add Baseline", baselines_remove_button: "Remove", baselines_remove_all_button: "Remove All", deadline_enable_button: "Set", deadline_disable_button: "Remove" } };
function oa() {
  this.constants = qn, this.version = "9.0.6", this.license = "gpl", this.templates = {}, this.ext = {}, this.keys = { edit_save: this.constants.KEY_CODES.ENTER, edit_cancel: this.constants.KEY_CODES.ESC };
}
function la(t) {
  var e = new oa(), n = new Gn(t), i = {};
  e.plugins = function(l) {
    for (var d in l) if (l[d] && !i[d]) {
      var c = n.getExtension(d);
      c && (c(e), i[d] = !0);
    }
    return i;
  }, e.$services = /* @__PURE__ */ function() {
    var l = {};
    return { services: {}, setService: function(d, c) {
      l[d] = c;
    }, getService: function(d) {
      return l[d] ? l[d]() : null;
    }, dropService: function(d) {
      l[d] && delete l[d];
    }, destructor: function() {
      for (var d in l) if (l[d]) {
        var c = l[d];
        c && c.destructor && c.destructor();
      }
      l = null;
    } };
  }(), e.config = Yn(), e.ajax = /* @__PURE__ */ function(l) {
    return { cache: !0, method: "get", parse: function(d) {
      return typeof d != "string" ? d : (d = d.replace(/^[\s]+/, ""), typeof DOMParser > "u" || mt.isIE ? lt.ActiveXObject !== void 0 && ((c = new lt.ActiveXObject("Microsoft.XMLDOM")).async = "false", c.loadXML(d)) : c = new DOMParser().parseFromString(d, "text/xml"), c);
      var c;
    }, xmltop: function(d, c, u) {
      if (c.status === void 0 || c.status < 400) {
        var h = c.responseXML ? c.responseXML || c : this.parse(c.responseText || c);
        if (h && h.documentElement !== null && !h.getElementsByTagName("parsererror").length) return h.getElementsByTagName(d)[0];
      }
      return u !== -1 && l.callEvent("onLoadXMLError", ["Incorrect XML", arguments[1], u]), document.createElement("DIV");
    }, xpath: function(d, c) {
      if (c.nodeName || (c = c.responseXML || c), mt.isIE) return c.selectNodes(d) || [];
      for (var u, h = [], g = (c.ownerDocument || c).evaluate(d, c, null, XPathResult.ANY_TYPE, null); u = g.iterateNext(); ) h.push(u);
      return h;
    }, query: function(d) {
      return this._call(d.method || "GET", d.url, d.data || "", d.async || !0, d.callback, d.headers);
    }, get: function(d, c, u) {
      var h = xt("GET", arguments);
      return this.query(h);
    }, getSync: function(d, c) {
      var u = xt("GET", arguments);
      return u.async = !1, this.query(u);
    }, put: function(d, c, u, h) {
      var g = xt("PUT", arguments);
      return this.query(g);
    }, del: function(d, c, u) {
      var h = xt("DELETE", arguments);
      return this.query(h);
    }, post: function(d, c, u, h) {
      arguments.length == 1 ? c = "" : arguments.length == 2 && typeof c == "function" && (u = c, c = "");
      var g = xt("POST", arguments);
      return this.query(g);
    }, postSync: function(d, c, u) {
      c = c === null ? "" : String(c);
      var h = xt("POST", arguments);
      return h.async = !1, this.query(h);
    }, _call: function(d, c, u, h, g, f) {
      return new l.Promise(function(y, v) {
        var b = typeof XMLHttpRequest !== void 0 ? new XMLHttpRequest() : new lt.ActiveXObject("Microsoft.XMLHTTP"), _ = navigator.userAgent.match(/AppleWebKit/) !== null && navigator.userAgent.match(/Qt/) !== null && navigator.userAgent.match(/Safari/) !== null;
        h && (b.onreadystatechange = function() {
          if (b.readyState == 4 || _ && b.readyState == 3) {
            if ((b.status != 200 || b.responseText === "") && !l.callEvent("onAjaxError", [b])) return;
            setTimeout(function() {
              typeof g == "function" && g.apply(lt, [{ xmlDoc: b, filePath: c }]), y(b), typeof g == "function" && (g = null, b = null);
            }, 0);
          }
        });
        var m = !this || !this.cache;
        if (d == "GET" && m && (c += (c.indexOf("?") >= 0 ? "&" : "?") + "dhxr" + (/* @__PURE__ */ new Date()).getTime() + "=1"), b.open(d, c, h), f) for (var p in f) b.setRequestHeader(p, f[p]);
        else d.toUpperCase() == "POST" || d == "PUT" || d == "DELETE" ? b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : d == "GET" && (u = null);
        if (b.setRequestHeader("X-Requested-With", "XMLHttpRequest"), b.send(u), !h) return { xmlDoc: b, filePath: c };
      });
    }, urlSeparator: function(d) {
      return d.indexOf("?") != -1 ? "&" : "?";
    } };
  }(e), e.date = Jn(e), e.RemoteEvents = Xn;
  var a = function(l) {
    function d(u) {
      return { target: u.target || u.srcElement, pageX: u.pageX, pageY: u.pageY, clientX: u.clientX, clientY: u.clientY, metaKey: u.metaKey, shiftKey: u.shiftKey, ctrlKey: u.ctrlKey, altKey: u.altKey };
    }
    function c(u, h) {
      this._obj = u, this._settings = h || {}, st(this);
      var g = this.getInputMethods();
      this._drag_start_timer = null, l.attachEvent("onGanttScroll", R(function(v, b) {
        this.clearDragTimer();
      }, this));
      for (var f = { passive: !1 }, y = 0; y < g.length; y++) R(function(v) {
        l.event(u, v.down, R(function(_) {
          v.accessor(_) && (_.button !== void 0 && _.button !== 0 || (h.preventDefault && h.selector && dt(_.target, h.selector) && _.preventDefault(), l.config.touch && _.timeStamp && _.timeStamp - 0 < 300 || (this._settings.original_target = d(_), this._settings.original_element_sizes = { ...at(_, an(u)), width: _.target.offsetWidth, height: _.target.offsetHeight }, l.config.touch ? (this.clearDragTimer(), this._drag_start_timer = setTimeout(R(function() {
            l.getState().lightbox || this.dragStart(u, _, v);
          }, this), l.config.touch_drag)) : this.dragStart(u, _, v))));
        }, this), f);
        var b = document.body;
        l.event(b, v.up, R(function(_) {
          v.accessor(_) && this.clearDragTimer();
        }, this), f);
      }, this)(g[y]);
    }
    return c.prototype = { traceDragEvents: function(u, h) {
      var g = R(function(m) {
        return this.dragMove(u, m, h.accessor);
      }, this);
      R(function(m) {
        return this.dragScroll(u, m);
      }, this);
      var f = R(function(m) {
        if (!this.config.started || !W(this.config.updates_per_second) || cn(this, this.config.updates_per_second)) {
          var p = g(m);
          if (p) try {
            m && m.preventDefault && m.cancelable && m.preventDefault();
          } catch {
          }
          return p;
        }
      }, this), y = vt(l.$root), v = this.config.mousemoveContainer || vt(l.$root), b = { passive: !1 }, _ = R(function(m) {
        return l.eventRemove(v, h.move, f), l.eventRemove(y, h.up, _, b), this.dragEnd(u);
      }, this);
      l.event(v, h.move, f, b), l.event(y, h.up, _, b);
    }, checkPositionChange: function(u) {
      var h = u.x - this.config.pos.x, g = u.y - this.config.pos.y;
      return Math.sqrt(Math.pow(Math.abs(h), 2) + Math.pow(Math.abs(g), 2)) > this.config.sensitivity;
    }, initDnDMarker: function() {
      var u = this.config.marker = document.createElement("div");
      u.className = "gantt_drag_marker", u.innerHTML = "", document.body.appendChild(u);
    }, backupEventTarget: function(u, h) {
      if (l.config.touch) {
        var g = h(u), f = g.target || g.srcElement, y = f.cloneNode(!0);
        this.config.original_target = d(g), this.config.original_target.target = y, this.config.backup_element = f, f.parentNode.appendChild(y), f.style.display = "none", (this.config.mousemoveContainer || document.body).appendChild(f);
      }
    }, getInputMethods: function() {
      var u = [];
      if (u.push({ move: "mousemove", down: "mousedown", up: "mouseup", accessor: function(g) {
        return g;
      } }), l.config.touch) {
        var h = !0;
        try {
          document.createEvent("TouchEvent");
        } catch {
          h = !1;
        }
        h ? u.push({ move: "touchmove", down: "touchstart", up: "touchend", accessor: function(g) {
          return g.touches && g.touches.length > 1 ? null : g.touches[0] ? { target: document.elementFromPoint(g.touches[0].clientX, g.touches[0].clientY), pageX: g.touches[0].pageX, pageY: g.touches[0].pageY, clientX: g.touches[0].clientX, clientY: g.touches[0].clientY } : g;
        } }) : lt.navigator.pointerEnabled ? u.push({ move: "pointermove", down: "pointerdown", up: "pointerup", accessor: function(g) {
          return g.pointerType == "mouse" ? null : g;
        } }) : lt.navigator.msPointerEnabled && u.push({ move: "MSPointerMove", down: "MSPointerDown", up: "MSPointerUp", accessor: function(g) {
          return g.pointerType == g.MSPOINTER_TYPE_MOUSE ? null : g;
        } });
      }
      return u;
    }, clearDragTimer: function() {
      this._drag_start_timer && (clearTimeout(this._drag_start_timer), this._drag_start_timer = null);
    }, dragStart: function(u, h, g) {
      this.config && this.config.started || (this.config = { obj: u, marker: null, started: !1, pos: this.getPosition(h), sensitivity: 4 }, this._settings && N(this.config, this._settings, !0), this.traceDragEvents(u, g), l._prevent_touch_scroll = !0, document.body.classList.add("gantt_noselect"), l.config.touch && this.dragMove(u, h, g.accessor));
    }, dragMove: function(u, h, g) {
      var f = g(h);
      if (!f) return !1;
      if (!this.config.marker && !this.config.started) {
        var y = this.getPosition(f);
        if (l.config.touch || this.checkPositionChange(y)) {
          if (this.config.started = !0, this.config.ignore = !1, l._touch_drag = !0, this.callEvent("onBeforeDragStart", [u, this.config.original_target]) === !1) return this.config.ignore = !0, !1;
          this.backupEventTarget(h, g), this.initDnDMarker(), l._touch_feedback(), this.callEvent("onAfterDragStart", [u, this.config.original_target]);
        } else this.config.ignore = !0;
      }
      return this.config.ignore ? !1 : h.targetTouches && !f.target ? void 0 : (f.pos = this.getPosition(f), this.config.marker.style.left = f.pos.x + "px", this.config.marker.style.top = f.pos.y + "px", this.callEvent("onDragMove", [u, f]), !0);
    }, dragEnd: function(u) {
      var h = this.config.backup_element;
      h && h.parentNode && h.parentNode.removeChild(h), l._prevent_touch_scroll = !1, this.config.marker && (this.config.marker.parentNode.removeChild(this.config.marker), this.config.marker = null, this.callEvent("onDragEnd", [])), this.config.started = !1, l._touch_drag = !1, document.body.classList.remove("gantt_noselect");
    }, getPosition: function(u) {
      var h = 0, g = 0;
      return u.pageX || u.pageY ? (h = u.pageX, g = u.pageY) : (u.clientX || u.clientY) && (h = u.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, g = u.clientY + document.body.scrollTop + document.documentElement.scrollTop), { x: h, y: g };
    } }, c;
  }(e);
  e.$services.setService("dnd", function() {
    return a;
  });
  var r = /* @__PURE__ */ function(l) {
    var d = {};
    function c(u, h, g) {
      g = g || u;
      var f = l.config, y = l.templates;
      l.config[u] && d[g] != f[u] && (h && y[g] || (y[g] = l.date.date_to_str(f[u]), d[g] = f[u]));
    }
    return { initTemplates: function() {
      var u = l.date, h = u.date_to_str, g = l.config, f = h(g.xml_date || g.date_format, g.server_utc), y = u.str_to_date(g.xml_date || g.date_format, g.server_utc);
      c("date_scale", !0, void 0, l.config, l.templates), c("date_grid", !0, "grid_date_format", l.config, l.templates), c("task_date", !0, void 0, l.config, l.templates), l.mixin(l.templates, { xml_format: void 0, format_date: f, xml_date: void 0, parse_date: y, progress_text: function(v, b, _) {
        return "";
      }, grid_header_class: function(v, b) {
        return "";
      }, task_text: function(v, b, _) {
        return _.text;
      }, task_class: function(v, b, _) {
        return "";
      }, task_end_date: function(v) {
        return l.templates.task_date(v);
      }, grid_row_class: function(v, b, _) {
        return "";
      }, task_row_class: function(v, b, _) {
        return "";
      }, timeline_cell_class: function(v, b) {
        return "";
      }, timeline_cell_content: function(v, b) {
        return "";
      }, scale_cell_class: function(v) {
        return "";
      }, scale_row_class: function(v) {
        return "";
      }, grid_indent: function(v) {
        return "<div class='gantt_tree_indent'></div>";
      }, grid_folder: function(v) {
        return "<div class='gantt_tree_icon gantt_folder_" + (v.$open ? "open" : "closed") + "'></div>";
      }, grid_file: function(v) {
        return "<div class='gantt_tree_icon gantt_file'></div>";
      }, grid_open: function(v) {
        return "<div class='gantt_tree_icon gantt_" + (v.$open ? "close" : "open") + "'></div>";
      }, grid_blank: function(v) {
        return "<div class='gantt_tree_icon gantt_blank'></div>";
      }, date_grid: function(v, b, _) {
        return b && l.isUnscheduledTask(b) && l.config.show_unscheduled ? l.templates.task_unscheduled_time(b) : l.templates.grid_date_format(v, _);
      }, task_time: function(v, b, _) {
        return l.isUnscheduledTask(_) && l.config.show_unscheduled ? l.templates.task_unscheduled_time(_) : l.templates.task_date(v) + " - " + l.templates.task_end_date(b);
      }, task_unscheduled_time: function(v) {
        return "";
      }, time_picker: h(g.time_picker), link_class: function(v) {
        return "";
      }, link_description: function(v) {
        var b = l.getTask(v.source), _ = l.getTask(v.target);
        return "<b>" + b.text + "</b> &ndash;  <b>" + _.text + "</b>";
      }, drag_link: function(v, b, _, m) {
        v = l.getTask(v);
        var p = l.locale.labels, k = "<b>" + v.text + "</b> " + (b ? p.link_start : p.link_end) + "<br/>";
        return _ && (k += "<b> " + (_ = l.getTask(_)).text + "</b> " + (m ? p.link_start : p.link_end) + "<br/>"), k;
      }, drag_link_class: function(v, b, _, m) {
        var p = "";
        return v && _ && (p = " " + (l.isLinkAllowed(v, _, b, m) ? "gantt_link_allow" : "gantt_link_deny")), "gantt_link_tooltip" + p;
      }, tooltip_date_format: u.date_to_str("%Y-%m-%d"), tooltip_text: function(v, b, _) {
        return `<div>Task: ${_.text}</div>
				<div>Start date: ${l.templates.tooltip_date_format(v)}</div>
				<div>End date: ${l.templates.tooltip_date_format(b)}</div>`;
      }, baseline_text: function(v, b, _) {
        return "";
      } });
    }, initTemplate: c };
  }(e);
  e.$services.setService("templateLoader", function() {
    return r;
  }), st(e);
  var s = new Zn();
  s.registerProvider("global", function() {
    var l = { min_date: e._min_date, max_date: e._max_date, selected_task: null };
    return e.$data && e.$data.tasksStore && (l.selected_task = e.$data.tasksStore.getSelectedId()), l;
  }), e.getState = s.getState, e.$services.setService("state", function() {
    return s;
  }), N(e, zn), e.Promise = Qn, e.env = mt, function(l) {
    var d = ei.create();
    N(l, d);
    var c, u = l.createDatastore({ name: "task", type: "treeDatastore", rootId: function() {
      return l.config.root_id;
    }, initItem: R(function(_) {
      this.defined(_.id) || (_.id = this.uid()), _.start_date && (_.start_date = l.date.parseDate(_.start_date, "parse_date")), _.end_date && (_.end_date = l.date.parseDate(_.end_date, "parse_date"));
      var m = null;
      (_.duration || _.duration === 0) && (_.duration = m = 1 * _.duration), m && (_.start_date && !_.end_date ? _.end_date = this.calculateEndDate(_) : !_.start_date && _.end_date && (_.start_date = this.calculateEndDate({ start_date: _.end_date, duration: -_.duration, task: _ }))), l.config.deadlines !== !1 && _.deadline && (_.deadline = l.date.parseDate(_.deadline, "parse_date")), _.progress = Number(_.progress) || 0, this._isAllowedUnscheduledTask(_) && this._set_default_task_timing(_), this._init_task_timing(_), _.start_date && _.end_date && this.correctTaskWorkTime(_), _.$source = [], _.$target = [];
      var p = this.$data.tasksStore.getItem(_.id);
      return p && !W(_.open) && (_.$open = p.$open), _.parent === void 0 && (_.parent = this.config.root_id), _.open && (_.$open = !0), _;
    }, l), getConfig: function() {
      return l.config;
    } }), h = l.createDatastore({ name: "link", initItem: R(function(_) {
      return this.defined(_.id) || (_.id = this.uid()), _;
    }, l) });
    function g(_) {
      var m = l.isTaskVisible(_);
      if (!m && l.isTaskExists(_)) {
        var p = l.getParent(_);
        l.isTaskExists(p) && l.isTaskVisible(p) && (p = l.getTask(p), l.isSplitTask(p) && (m = !0));
      }
      return m;
    }
    function f(_) {
      if (l.isTaskExists(_.source)) {
        var m = l.getTask(_.source);
        m.$source = m.$source || [], m.$source.push(_.id);
      }
      if (l.isTaskExists(_.target)) {
        var p = l.getTask(_.target);
        p.$target = p.$target || [], p.$target.push(_.id);
      }
    }
    function y(_) {
      if (l.isTaskExists(_.source)) {
        for (var m = l.getTask(_.source), p = 0; p < m.$source.length; p++) if (m.$source[p] == _.id) {
          m.$source.splice(p, 1);
          break;
        }
      }
      if (l.isTaskExists(_.target)) {
        var k = l.getTask(_.target);
        for (p = 0; p < k.$target.length; p++) if (k.$target[p] == _.id) {
          k.$target.splice(p, 1);
          break;
        }
      }
    }
    function v() {
      for (var _ = null, m = l.$data.tasksStore.getItems(), p = 0, k = m.length; p < k; p++) (_ = m[p]).$source = [], _.$target = [];
      var $ = l.$data.linksStore.getItems();
      for (p = 0, k = $.length; p < k; p++) f($[p]);
    }
    function b(_) {
      var m = _.source, p = _.target;
      for (var k in _.events) (function($, w) {
        m.attachEvent($, function() {
          return p.callEvent(w, Array.prototype.slice.call(arguments));
        }, w);
      })(k, _.events[k]);
    }
    l.attachEvent("onDestroy", function() {
      u.destructor(), h.destructor();
    }), l.attachEvent("onLinkValidation", function(_) {
      if (l.isLinkExists(_.id) || _.id === "predecessor_generated") return !0;
      for (var m = l.getTask(_.source).$source, p = 0; p < m.length; p++) {
        var k = l.getLink(m[p]), $ = _.source == k.source, w = _.target == k.target, x = _.type == k.type;
        if ($ && w && x) return !1;
      }
      return !0;
    }), u.attachEvent("onBeforeRefreshAll", function() {
      if (!u._skipTaskRecalculation) for (var _ = u.getVisibleItems(), m = 0; m < _.length; m++) {
        var p = _[m];
        p.$index = m, p.$local_index = l.getTaskIndex(p.id), l.resetProjectDates(p);
      }
    }), u.attachEvent("onFilterItem", function(_, m) {
      if (l.config.show_tasks_outside_timescale) return !0;
      var p = null, k = null;
      if (l.config.start_date && l.config.end_date) {
        if (l._isAllowedUnscheduledTask(m)) return !0;
        if (p = l.config.start_date.valueOf(), k = l.config.end_date.valueOf(), +m.start_date > k || +m.end_date < +p) return !1;
      }
      return !0;
    }), u.attachEvent("onIdChange", function(_, m) {
      l._update_flags(_, m);
      var p = l.getTask(m);
      u.isSilent() || (p.$split_subtask || p.rollup) && l.eachParent(function(k) {
        l.refreshTask(k.id);
      }, m);
    }), u.attachEvent("onAfterUpdate", function(_) {
      if (l._update_parents(_), l.getState("batchUpdate").batch_update) return !0;
      var m = u.getItem(_);
      m.$source || (m.$source = []);
      for (var p = 0; p < m.$source.length; p++) h.refresh(m.$source[p]);
      for (m.$target || (m.$target = []), p = 0; p < m.$target.length; p++) h.refresh(m.$target[p]);
    }), u.attachEvent("onBeforeItemMove", function(_, m, p) {
      return !Pt(_, l, u) || (console.log("The placeholder task cannot be moved to another position."), !1);
    }), u.attachEvent("onAfterItemMove", function(_, m, p) {
      var k = l.getTask(_);
      this.getNextSibling(_) !== null ? k.$drop_target = this.getNextSibling(_) : this.getPrevSibling(_) !== null ? k.$drop_target = "next:" + this.getPrevSibling(_) : k.$drop_target = "next:null";
    }), u.attachEvent("onStoreUpdated", function(_, m, p) {
      if (p == "delete" && l._update_flags(_, null), !l.$services.getService("state").getState("batchUpdate").batch_update) {
        if (l.config.fit_tasks && p !== "paint") {
          var k = l.getState();
          ge(l);
          var $ = l.getState();
          if (+k.min_date != +$.min_date || +k.max_date != +$.max_date) return l.render(), l.callEvent("onScaleAdjusted", []), !0;
        }
        p == "add" || p == "move" || p == "delete" ? l.$layout && (this.$config.name != "task" || p != "add" && p != "delete" || this._skipTaskRecalculation != "lightbox" && (this._skipTaskRecalculation = !0), l.$layout.resize()) : _ || h.refresh();
      }
    }), h.attachEvent("onAfterAdd", function(_, m) {
      f(m);
    }), h.attachEvent("onAfterUpdate", function(_, m) {
      v();
    }), h.attachEvent("onAfterDelete", function(_, m) {
      y(m);
    }), h.attachEvent("onAfterSilentDelete", function(_, m) {
      y(m);
    }), h.attachEvent("onBeforeIdChange", function(_, m) {
      y(l.mixin({ id: _ }, l.$data.linksStore.getItem(m))), f(l.$data.linksStore.getItem(m));
    }), h.attachEvent("onFilterItem", function(_, m) {
      if (!l.config.show_links) return !1;
      var p = g(m.source), k = g(m.target);
      return !(!p || !k || l._isAllowedUnscheduledTask(l.getTask(m.source)) || l._isAllowedUnscheduledTask(l.getTask(m.target))) && l.callEvent("onBeforeLinkDisplay", [_, m]);
    }), c = {}, l.attachEvent("onBeforeTaskDelete", function(_, m) {
      return c[_] = fe.getSubtreeLinks(l, _), !0;
    }), l.attachEvent("onAfterTaskDelete", function(_, m) {
      c[_] && l.$data.linksStore.silent(function() {
        for (var p in c[_]) l.isLinkExists(p) && l.$data.linksStore.removeItem(p), y(c[_][p]);
        c[_] = null;
      });
    }), l.attachEvent("onAfterLinkDelete", function(_, m) {
      l.isTaskExists(m.source) && l.refreshTask(m.source), l.isTaskExists(m.target) && l.refreshTask(m.target);
    }), l.attachEvent("onParse", v), b({ source: h, target: l, events: { onItemLoading: "onLinkLoading", onBeforeAdd: "onBeforeLinkAdd", onAfterAdd: "onAfterLinkAdd", onBeforeUpdate: "onBeforeLinkUpdate", onAfterUpdate: "onAfterLinkUpdate", onBeforeDelete: "onBeforeLinkDelete", onAfterDelete: "onAfterLinkDelete", onIdChange: "onLinkIdChange" } }), b({ source: u, target: l, events: { onItemLoading: "onTaskLoading", onBeforeAdd: "onBeforeTaskAdd", onAfterAdd: "onAfterTaskAdd", onBeforeUpdate: "onBeforeTaskUpdate", onAfterUpdate: "onAfterTaskUpdate", onBeforeDelete: "onBeforeTaskDelete", onAfterDelete: "onAfterTaskDelete", onIdChange: "onTaskIdChange", onBeforeItemMove: "onBeforeTaskMove", onAfterItemMove: "onAfterTaskMove", onFilterItem: "onBeforeTaskDisplay", onItemOpen: "onTaskOpened", onItemClose: "onTaskClosed", onBeforeSelect: "onBeforeTaskSelected", onAfterSelect: "onTaskSelected", onAfterUnselect: "onTaskUnselected" } }), l.$data = { tasksStore: u, linksStore: h };
  }(e), e.dataProcessor = Oe.DEPRECATED_api, e.createDataProcessor = Oe.createDataProcessor, function(l) {
    l.ext || (l.ext = {});
    for (var d = [ri, oi, di, ci, ui, hi, _i, gi, mi], c = 0; c < d.length; c++) d[c] && d[c](l);
  }(e), function(l) {
    l.getGridColumn = function(d) {
      for (var c = l.config.columns, u = 0; u < c.length; u++) if (c[u].name == d) return c[u];
      return null;
    }, l.getGridColumns = function() {
      return l.config.columns.slice();
    };
  }(e), function(l) {
    l.isReadonly = function(d) {
      return typeof d != "number" && typeof d != "string" || !l.isTaskExists(d) || (d = l.getTask(d)), (!d || !d[this.config.editable_property]) && (d && d[this.config.readonly_property] || this.config.readonly);
    };
  }(e), vi(e), function(l) {
    var d = new fn(l), c = new pn(d);
    N(l, Si.create(d, c));
  }(e), Ti(e), function(l) {
    l.getTaskType = function(d) {
      return "task";
    };
  }(e), function(l) {
    function d() {
      return l._cached_functions.update_if_changed(l), l._cached_functions.active || l._cached_functions.activate(), !0;
    }
    l._cached_functions = { cache: {}, mode: !1, critical_path_mode: !1, wrap_methods: function(u, h) {
      if (h._prefetch_originals) for (var g in h._prefetch_originals) h[g] = h._prefetch_originals[g];
      for (h._prefetch_originals = {}, g = 0; g < u.length; g++) this.prefetch(u[g], h);
    }, prefetch: function(u, h) {
      var g = h[u];
      if (g) {
        var f = this;
        h._prefetch_originals[u] = g, h[u] = function() {
          for (var y = new Array(arguments.length), v = 0, b = arguments.length; v < b; v++) y[v] = arguments[v];
          if (f.active) {
            var _ = f.get_arguments_hash(Array.prototype.slice.call(y));
            f.cache[u] || (f.cache[u] = {});
            var m = f.cache[u];
            if (f.has_cached_value(m, _)) return f.get_cached_value(m, _);
            var p = g.apply(this, y);
            return f.cache_value(m, _, p), p;
          }
          return g.apply(this, y);
        };
      }
      return g;
    }, cache_value: function(u, h, g) {
      this.is_date(g) && (g = new Date(g)), u[h] = g;
    }, has_cached_value: function(u, h) {
      return u.hasOwnProperty(h);
    }, get_cached_value: function(u, h) {
      var g = u[h];
      return this.is_date(g) && (g = new Date(g)), g;
    }, is_date: function(u) {
      return u && u.getUTCDate;
    }, get_arguments_hash: function(u) {
      for (var h = [], g = 0; g < u.length; g++) h.push(this.stringify_argument(u[g]));
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
      var h = [], g = ["_isProjectEnd", "_getProjectEnd", "_getSlack"];
      this.mode == "auto" ? u.config.highlight_critical_path && (h = g) : this.mode === !0 && (h = g), this.wrap_methods(h, u);
    }, update_if_changed: function(u) {
      (this.critical_path_mode != u.config.highlight_critical_path || this.mode !== u.config.optimize_render) && (this.critical_path_mode = u.config.highlight_critical_path, this.mode = u.config.optimize_render, this.setup(u));
    } }, l.attachEvent("onBeforeGanttRender", d), l.attachEvent("onBeforeDataRender", d), l.attachEvent("onBeforeSmartRender", function() {
      d();
    }), l.attachEvent("onBeforeParse", d), l.attachEvent("onDataRender", function() {
      l._cached_functions.deactivate();
    });
    var c = null;
    l.attachEvent("onSmartRender", function() {
      c && clearTimeout(c), c = setTimeout(function() {
        l._cached_functions.deactivate();
      }, 1e3);
    }), l.attachEvent("onBeforeGanttReady", function() {
      return l._cached_functions.update_if_changed(l), !0;
    });
  }(e), Ei(e), function(l) {
    l.destructor = function() {
      for (var d in this.clearAll(), this.callEvent("onDestroy", []), this.$root && delete this.$root.gantt, this._eventRemoveAll && this._eventRemoveAll(), this.$layout && this.$layout.destructor(), this.resetLightbox && this.resetLightbox(), this.ext.inlineEditors && this.ext.inlineEditors.destructor(), this._dp && this._dp.destructor && this._dp.destructor(), this.$services.destructor(), this.detachAllEvents(), this) d.indexOf("$") === 0 && delete this[d];
      this.$destroyed = !0;
    };
  }(e);
  var o = new Yi({ en: Ri, ar: Ci, be: Di, ca: Ai, cn: Ii, cs: Mi, da: Ni, de: Li, el: Pi, es: Hi, fa: Oi, fi: Bi, fr: zi, he: Wi, hr: ji, hu: Fi, id: Vi, it: Ui, jp: qi, kr: Gi, nb: Ji, nl: Ki, no: Xi, pl: Zi, pt: Qi, ro: ta, ru: ea, si: na, sk: ia, sv: aa, tr: ra, ua: sa });
  return e.i18n = { addLocale: o.addLocale, setLocale: function(l) {
    if (typeof l == "string") {
      var d = o.getLocale(l);
      d || (d = o.getLocale("en")), e.locale = d;
    } else if (l) if (e.locale) for (var c in l) l[c] && typeof l[c] == "object" ? (e.locale[c] || (e.locale[c] = {}), e.mixin(e.locale[c], l[c], !0)) : e.locale[c] = l[c];
    else e.locale = l;
    const u = e.locale.labels;
    u.gantt_save_btn = u.gantt_save_btn || u.icon_save, u.gantt_cancel_btn = u.gantt_cancel_btn || u.icon_cancel, u.gantt_delete_btn = u.gantt_delete_btn || u.icon_delete;
  }, getLocale: o.getLocale }, e.i18n.setLocale("en"), e;
}
function da(t) {
  var e = "data-dhxbox", n = null;
  function i(_, m) {
    var p = _.callback;
    y.hide(_.box), n = _.box = null, p && p(m);
  }
  function a(_) {
    if (n) {
      var m = _.which || _.keyCode, p = !1;
      if (v.keyboard) {
        if (m == 13 || m == 32) {
          var k = _.target || _.srcElement;
          K(k).indexOf("gantt_popup_button") > -1 && k.click ? k.click() : (i(n, !0), p = !0);
        }
        m == 27 && (i(n, !1), p = !0);
      }
      return p ? (_.preventDefault && _.preventDefault(), !(_.cancelBubble = !0)) : void 0;
    }
  }
  var r = vt(t.$root) || document;
  function s(_) {
    s.cover || (s.cover = document.createElement("div"), s.cover.onkeydown = a, s.cover.className = "dhx_modal_cover", document.body.appendChild(s.cover)), s.cover.style.display = _ ? "inline-block" : "none";
  }
  function o(_, m, p) {
    return "<div " + t._waiAria.messageButtonAttrString(_) + " class='gantt_popup_button " + ("gantt_" + m.toLowerCase().replace(/ /g, "_") + "_button") + "' data-result='" + p + "' result='" + p + "' ><div>" + _ + "</div></div>";
  }
  function l() {
    for (var _ = [].slice.apply(arguments, [0]), m = 0; m < _.length; m++) if (_[m]) return _[m];
  }
  function d(_, m, p) {
    var k = _.tagName ? _ : function(x, S, T) {
      var E = document.createElement("div"), C = rt();
      t._waiAria.messageModalAttr(E, C), E.className = " gantt_modal_box gantt-" + x.type, E.setAttribute(e, 1);
      var D = "";
      if (x.width && (E.style.width = x.width), x.height && (E.style.height = x.height), x.title && (D += '<div class="gantt_popup_title">' + x.title + "</div>"), D += '<div class="gantt_popup_text" id="' + C + '"><span>' + (x.content ? "" : x.text) + '</span></div><div  class="gantt_popup_controls">', S && (D += o(l(x.ok, t.locale.labels.message_ok, "OK"), "ok", !0)), T && (D += o(l(x.cancel, t.locale.labels.message_cancel, "Cancel"), "cancel", !1)), x.buttons) for (var A = 0; A < x.buttons.length; A++) {
        var I = x.buttons[A];
        D += typeof I == "object" ? o(I.label, I.css || "gantt_" + I.label.toLowerCase() + "_button", I.value || A) : o(I, I, A);
      }
      if (D += "</div>", E.innerHTML = D, x.content) {
        var M = x.content;
        typeof M == "string" && (M = document.getElementById(M)), M.style.display == "none" && (M.style.display = ""), E.childNodes[x.title ? 1 : 0].appendChild(M);
      }
      return E.onclick = function(L) {
        var P = L.target || L.srcElement;
        if (P.className || (P = P.parentNode), dt(P, ".gantt_popup_button")) {
          var H = P.getAttribute("data-result");
          i(x, H = H == "true" || H != "false" && H);
        }
      }, x.box = E, (S || T) && (n = x), E;
    }(_, m, p);
    _.hidden || s(!0), document.body.appendChild(k);
    var $ = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - k.offsetWidth) / 2)), w = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - k.offsetHeight) / 2));
    return _.position == "top" ? k.style.top = "-3px" : k.style.top = w + "px", k.style.left = $ + "px", k.onkeydown = a, y.focus(k), _.hidden && y.hide(k), t.callEvent("onMessagePopup", [k]), k;
  }
  function c(_) {
    return d(_, !0, !1);
  }
  function u(_) {
    return d(_, !0, !0);
  }
  function h(_) {
    return d(_);
  }
  function g(_, m, p) {
    return typeof _ != "object" && (typeof m == "function" && (p = m, m = ""), _ = { text: _, type: m, callback: p }), _;
  }
  function f(_, m, p, k) {
    return typeof _ != "object" && (_ = { text: _, type: m, expire: p, id: k }), _.id = _.id || rt(), _.expire = _.expire || v.expire, _;
  }
  t.event(r, "keydown", a, !0);
  var y = function() {
    var _ = g.apply(this, arguments);
    return _.type = _.type || "alert", h(_);
  };
  y.hide = function(_) {
    for (; _ && _.getAttribute && !_.getAttribute(e); ) _ = _.parentNode;
    _ && (_.parentNode.removeChild(_), s(!1), t.callEvent("onAfterMessagePopup", [_]));
  }, y.focus = function(_) {
    setTimeout(function() {
      var m = be(_);
      m.length && m[0].focus && m[0].focus();
    }, 1);
  };
  var v = function(_, m, p, k) {
    switch ((_ = f.apply(this, arguments)).type = _.type || "info", _.type.split("-")[0]) {
      case "alert":
        return c(_);
      case "confirm":
        return u(_);
      case "modalbox":
        return h(_);
      default:
        return function($) {
          v.area || (v.area = document.createElement("div"), v.area.className = "gantt_message_area", v.area.style[v.position] = "5px", document.body.appendChild(v.area)), v.hide($.id);
          var w = document.createElement("div");
          return w.innerHTML = "<div>" + $.text + "</div>", w.className = "gantt-info gantt-" + $.type, w.onclick = function() {
            v.hide($.id), $ = null;
          }, t._waiAria.messageInfoAttr(w), v.position == "bottom" && v.area.firstChild ? v.area.insertBefore(w, v.area.firstChild) : v.area.appendChild(w), $.expire > 0 && (v.timers[$.id] = window.setTimeout(function() {
            v && v.hide($.id);
          }, $.expire)), v.pull[$.id] = w, w = null, $.id;
        }(_);
    }
  };
  v.seed = (/* @__PURE__ */ new Date()).valueOf(), v.uid = rt, v.expire = 4e3, v.keyboard = !0, v.position = "top", v.pull = {}, v.timers = {}, v.hideAll = function() {
    for (var _ in v.pull) v.hide(_);
  }, v.hide = function(_) {
    var m = v.pull[_];
    m && m.parentNode && (window.setTimeout(function() {
      m.parentNode.removeChild(m), m = null;
    }, 2e3), m.className += " hidden", v.timers[_] && window.clearTimeout(v.timers[_]), delete v.pull[_]);
  };
  var b = [];
  return t.attachEvent("onMessagePopup", function(_) {
    b.push(_);
  }), t.attachEvent("onAfterMessagePopup", function(_) {
    for (var m = 0; m < b.length; m++) b[m] === _ && (b.splice(m, 1), m--);
  }), t.attachEvent("onDestroy", function() {
    s.cover && s.cover.parentNode && s.cover.parentNode.removeChild(s.cover);
    for (var _ = 0; _ < b.length; _++) b[_].parentNode && b[_].parentNode.removeChild(b[_]);
    b = null, v.area && v.area.parentNode && v.area.parentNode.removeChild(v.area), v = null;
  }), { alert: function() {
    var _ = g.apply(this, arguments);
    return _.type = _.type || "confirm", c(_);
  }, confirm: function() {
    var _ = g.apply(this, arguments);
    return _.type = _.type || "alert", u(_);
  }, message: v, modalbox: y };
}
function We(t, e) {
  var n = this.$config[t];
  return n ? (n.$extendedConfig || (n.$extendedConfig = !0, Object.setPrototypeOf(n, e)), n) : e;
}
function ca(t, e) {
  var n, i, a;
  N(t, (n = e, { $getConfig: function() {
    return i || (i = n ? n.$getConfig() : this.$gantt.config), this.$config.config ? We.call(this, "config", i) : i;
  }, $getTemplates: function() {
    return a || (a = n ? n.$getTemplates() : this.$gantt.templates), this.$config.templates ? We.call(this, "templates", a) : a;
  } }));
}
const ua = function(t) {
  var e = {}, n = {};
  function i(a, r, s, o) {
    var l = e[a];
    if (!l || !l.create) return !1;
    a != "resizer" || s.mode || (o.$config.cols ? s.mode = "x" : s.mode = "y"), a != "viewcell" || s.view != "scrollbar" || s.scroll || (o.$config.cols ? s.scroll = "y" : s.scroll = "x"), (s = q(s)).id || n[s.view] || (s.id = s.view), s.id && !s.css && (s.css = s.id + "_cell");
    var d = new l.create(r, s, this, t);
    return l.configure && l.configure(d), ca(d, o), d.$id || (d.$id = s.id || t.uid()), d.$parent || typeof r != "object" || (d.$parent = r), d.$config || (d.$config = s), n[d.$id] && (d.$id = t.uid()), n[d.$id] = d, d;
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
var ha = /* @__PURE__ */ function(t) {
  return function(e) {
    var n = { click: {}, doubleclick: {}, contextMenu: {} };
    function i(h, g, f, y) {
      n[h][g] || (n[h][g] = []), n[h][g].push({ handler: f, root: y });
    }
    function a(h) {
      h = h || window.event;
      var g = e.locate(h), f = s(h, n.click), y = !0;
      if (g !== null ? y = !e.checkEvent("onTaskClick") || e.callEvent("onTaskClick", [g, h]) : e.callEvent("onEmptyClick", [h]), y) {
        if (!o(f, h, g)) return;
        switch (h.target.nodeName) {
          case "SELECT":
          case "INPUT":
            return;
        }
        g && e.getTask(g) && !e._multiselect && e.config.select_task && e.selectTask(g);
      }
    }
    function r(h) {
      var g = (h = h || window.event).target || h.srcElement, f = e.locate(g), y = e.locate(g, e.config.link_attribute), v = !e.checkEvent("onContextMenu") || e.callEvent("onContextMenu", [f, y, h]);
      return v || (h.preventDefault ? h.preventDefault() : h.returnValue = !1), v;
    }
    function s(h, g) {
      for (var f = h.target || h.srcElement, y = []; f; ) {
        var v = t.getClassName(f);
        if (v) {
          v = v.split(" ");
          for (var b = 0; b < v.length; b++) if (v[b] && g[v[b]]) for (var _ = g[v[b]], m = 0; m < _.length; m++) _[m].root && !t.isChildOf(f, _[m].root) || y.push(_[m].handler);
        }
        f = f.parentNode;
      }
      return y;
    }
    function o(h, g, f) {
      for (var y = !0, v = 0; v < h.length; v++) {
        var b = h[v].call(e, g, f, g.target || g.srcElement);
        y = y && !(b !== void 0 && b !== !0);
      }
      return y;
    }
    function l(h) {
      h = h || window.event;
      var g = e.locate(h), f = s(h, n.doubleclick), y = !e.checkEvent("onTaskDblClick") || g === null || e.callEvent("onTaskDblClick", [g, h]);
      if (y) {
        if (!o(f, h, g)) return;
        g !== null && e.getTask(g) && y && e.config.details_on_dblclick && !e.isReadonly(g) && e.showLightbox(g);
      }
    }
    function d(h) {
      if (e.checkEvent("onMouseMove")) {
        var g = e.locate(h);
        e._last_move_event = h, e.callEvent("onMouseMove", [g, h]);
      }
    }
    var c = e._createDomEventScope();
    function u(h) {
      c.detachAll(), h && (c.attach(h, "click", a), c.attach(h, "dblclick", l), c.attach(h, "mousemove", d), c.attach(h, "contextmenu", r));
    }
    return { reset: u, global: function(h, g, f) {
      i(h, g, f, null);
    }, delegate: i, detach: function(h, g, f, y) {
      if (n[h] && n[h][g]) {
        for (var v = n[h], b = v[g], _ = 0; _ < b.length; _++) b[_].root == y && (b.splice(_, 1), _--);
        b.length || delete v[g];
      }
    }, callHandler: function(h, g, f, y) {
      var v = n[h][g];
      if (v) for (var b = 0; b < v.length; b++) (f || v[b].root) && v[b].root !== f || v[b].handler.apply(this, y);
    }, onDoubleClick: l, onMouseMove: d, onContextMenu: r, onClick: a, destructor: function() {
      u(), n = null, c = null;
    } };
  };
}(sn);
const _a = { init: ha };
function je(t, e, n) {
  return !!e && !(e.left > t.x_end || e.left + e.width < t.x) && !(e.top > t.y_end || e.top + e.height < t.y);
}
function Nt(t) {
  return t.config.smart_rendering && t._smart_render;
}
function Yt(t, e, n) {
  return { top: e.getItemTop(t.id), height: e.getItemHeight(t.id), left: 0, right: 1 / 0 };
}
function ft(t, e, n, i, a) {
  var r = e.getItemIndexByTopPosition(a.y) || 0, s = e.getItemIndexByTopPosition(a.y_end) || i.count(), o = Math.max(0, r - 1), l = Math.min(i.count(), s + 1);
  const d = [];
  if (t.config.keyboard_navigation && t.getSelectedId() && t.getTask(t.getSelectedId()).$expanded_branch && d.push(t.getSelectedId()), t.$ui.getView("grid") && t.ext.inlineEditors && t.ext.inlineEditors.getState().id) {
    let c = t.ext.inlineEditors.getState().id;
    i.exists(c) && d.push(c);
  }
  return { start: o, end: l, ids: d };
}
var ga = function(t) {
  var e = /* @__PURE__ */ function(n) {
    var i = {}, a = {};
    function r(o) {
      var l = null;
      return typeof o.view == "string" ? l = n.$ui.getView(o.view) : o.view && (l = o.view), l;
    }
    function s(o, l, d) {
      if (a[o]) return a[o];
      l.renderer || n.assert(!1, "Invalid renderer call");
      var c = null, u = null, h = null, g = null, f = null;
      typeof l.renderer == "function" ? (c = l.renderer, h = Yt) : (c = l.renderer.render, u = l.renderer.update, g = l.renderer.onrender, l.renderer.isInViewPort ? f = l.renderer.isInViewPort : h = l.renderer.getRectangle, h || h === null || (h = Yt));
      var y = l.filter;
      return d && d.setAttribute(n.config.layer_attribute, !0), a[o] = { render_item: function(v, b, _, m, p) {
        if (b = b || d, !y || y(v)) {
          var k = m || r(l), $ = p || (k ? k.$getConfig() : null), w = _;
          !w && $ && $.smart_rendering && (w = k.getViewPort());
          var x = null;
          !Nt(n) && (h || f) && w ? (f ? f(v, w, k, $, n) : je(w, h(v, k, $, n))) && (x = c.call(n, v, k, $, w)) : x = c.call(n, v, k, $, w), this.append(v, x, b);
          var S = b.nodeType == 11;
          g && !S && x && g.call(n, v, x, k);
        } else this.remove_item(v.id);
      }, clear: function(v) {
        this.rendered = i[o] = {}, l.append || this.clear_container(v);
      }, clear_container: function(v) {
        (v = v || d) && (v.innerHTML = "");
      }, get_visible_range: function(v) {
        var b, _, m = r(l), p = m ? m.$getConfig() : null;
        return p && p.smart_rendering && (b = m.getViewPort()), m && b && (typeof l.renderer == "function" ? _ = ft(n, m, 0, v, b) : l.renderer && l.renderer.getVisibleRange && (_ = l.renderer.getVisibleRange(n, m, p, v, b))), _ || (_ = { start: 0, end: v.count() }), _;
      }, prepare_data: function(v) {
        if (l.renderer && l.renderer.prepareData) return l.renderer.prepareData(v, n, l);
      }, render_items: function(v, b) {
        b = b || d;
        var _ = document.createDocumentFragment();
        this.clear(b);
        var m = null, p = r(l), k = p ? p.$getConfig() : null;
        k && k.smart_rendering && (m = p.getViewPort());
        for (var $ = 0, w = v.length; $ < w; $++) this.render_item(v[$], _, m, p, k);
        b.appendChild(_, b);
        var x = {};
        v.forEach(function(E) {
          x[E.id] = E;
        });
        var S = {};
        if (g) {
          var T = {};
          for (var $ in this.rendered) S[$] || (T[$] = this.rendered[$], g.call(n, x[$], this.rendered[$], p));
        }
      }, update_items: function(v, b) {
        var _ = r(l), m = _ ? _.$getConfig() : null;
        if (_ && _.$getConfig().smart_rendering && !Nt(n) && this.rendered && (h || f)) {
          b = b || d;
          var p = document.createDocumentFragment(), k = null;
          _ && (k = _.getViewPort());
          var $ = {};
          v.forEach(function(I) {
            $[I.id] = I;
          });
          var w = {}, x = {};
          for (var S in this.rendered) x[S] = !0, w[S] = !0;
          for (var T = {}, E = (S = 0, v.length); S < E; S++) {
            var C = v[S], D = this.rendered[C.id];
            x[C.id] = !1, D && D.parentNode ? (f ? f(C, k, _, m, n) : je(k, h(C, _, m, n))) ? (u && u.call(n, C, D, _, m, k), this.restore(C, p)) : x[C.id] = !0 : (T[v[S].id] = !0, this.render_item(v[S], p, k, _, m));
          }
          for (var S in x) x[S] && this.hide(S);
          if (p.childNodes.length && b.appendChild(p, b), g) {
            var A = {};
            for (var S in this.rendered) w[S] && !T[S] || (A[S] = this.rendered[S], g.call(n, $[S], this.rendered[S], _));
          }
        }
      }, append: function(v, b, _) {
        this.rendered && (b ? (this.rendered[v.id] && this.rendered[v.id].parentNode ? this.replace_item(v.id, b) : _.appendChild(b), this.rendered[v.id] = b) : this.rendered[v.id] && this.remove_item(v.id));
      }, replace_item: function(v, b) {
        var _ = this.rendered[v];
        _ && _.parentNode && _.parentNode.replaceChild(b, _), this.rendered[v] = b;
      }, remove_item: function(v) {
        this.hide(v), delete this.rendered[v];
      }, hide: function(v) {
        var b = this.rendered[v];
        b && b.parentNode && b.parentNode.removeChild(b);
      }, restore: function(v, b) {
        var _ = this.rendered[v.id];
        _ ? _.parentNode || this.append(v, _, b || d) : this.render_item(v, b || d);
      }, change_id: function(v, b) {
        this.rendered[b] = this.rendered[v], delete this.rendered[v];
      }, rendered: i[o], node: d, destructor: function() {
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
      o && (o.id = o.id || rt(), this.tempCollection.push(o));
      for (var l = this.container(), d = this.tempCollection, c = 0; c < d.length; c++) if (o = d[c], this.container() || o && o.container && G(o.container, document.body)) {
        var u = o.container, h = o.id, g = o.topmost;
        if (!u.parentNode) if (g) l.appendChild(u);
        else {
          var f = i ? i() : l.firstChild;
          f && f.parentNode == l ? l.insertBefore(u, f) : l.appendChild(u);
        }
        this.renderers[h] = e.getRenderer(h, o, u), r && r(o, t), this.tempCollection.splice(c, 1), c--;
      }
    }, addLayer: function(o) {
      if (o) {
        typeof o == "function" && (o = { renderer: o }), o.filter === void 0 ? o.filter = Fe(a || []) : o.filter instanceof Array && (o.filter.push(a), o.filter = Fe(o.filter)), o.container || (o.container = document.createElement("div"));
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
function Fe(t) {
  return t instanceof Array || (t = Array.prototype.slice.call(arguments, 0)), function(e) {
    for (var n = !0, i = 0, a = t.length; i < a; i++) {
      var r = t[i];
      r && (n = n && r(e.id, e) !== !1);
    }
    return n;
  };
}
function Ve(t, e, n) {
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
      var d = function(c, u, h, g) {
        if (!g.isTaskExists(c.source) || !g.isTaskExists(c.target)) return null;
        var f = Ve(g.getTask(c.source), u), y = Ve(g.getTask(c.target), u);
        if (!f || !y) return null;
        var v = 100, b = Math.min(f.left, y.left) - v, _ = Math.max(f.left + f.width, y.left + y.width) + v, m = Math.min(f.top, y.top) - v, p = Math.max(f.top + f.height, y.top + y.height) + v;
        return { top: m, height: p - m, bottom: p, left: b, width: _ - b, right: _ };
      }(l, s, 0, o);
      d && t.push({ id: l.id, rec: d });
    }), t.sort(function(l, d) {
      return l.rec.right < d.rec.right ? -1 : 1;
    }), e = !0;
  }
  var a = !1;
  return function(r, s, o, l, d) {
    (function(f) {
      a || (a = !0, f.attachEvent("onPreFilter", n), f.attachEvent("onStoreUpdated", n), f.attachEvent("onClearAll", n), f.attachEvent("onBeforeStoreUpdate", n));
    })(l), e || i(l, s, r);
    for (var c = [], u = 0; u < t.length; u++) {
      var h = t[u], g = h.rec;
      g.right < d.x || g.left < d.x_end && g.right > d.x && g.top < d.y_end && g.bottom > d.y && c.push(h.id);
    }
    return { ids: c };
  };
}
function vn(t, e, n, i, a) {
  var r = n.$gantt.getTask(t.source), s = n.$gantt.getTask(t.target), o = n.getItemTop(r.id), l = n.getItemHeight(r.id), d = n.getItemTop(s.id), c = n.getItemHeight(s.id);
  if (e.y > o + l && e.y > d + c || e.y_end < d && e.y_end < o) return !1;
  var u = 100, h = n.posFromDate(r.start_date), g = n.posFromDate(r.end_date), f = n.posFromDate(s.start_date), y = n.posFromDate(s.end_date);
  if (h > g) {
    var v = g;
    g = h, h = v;
  }
  return f > y && (v = y, y = f, f = v), h += -100, g += u, f += -100, y += u, !(e.x > g && e.x > y) && !(e.x_end < h && e.x_end < f);
}
function fa(t, e) {
  if (t.view) {
    var n = t.view;
    typeof n == "string" && (n = e.$ui.getView(n)), n && n.attachEvent && n.attachEvent("onScroll", function() {
      e.$services.getService("state").getState("batchUpdate").batch_update || n.$config.$skipSmartRenderOnScroll || t.requestUpdate && t.requestUpdate();
    });
  }
}
var Rt = function() {
  function t(e, n, i, a) {
    e && (this.$container = xe(e), this.$parent = e), this.$config = N(n, { headerHeight: 33 }), this.$gantt = a, this.$domEvents = a._createDomEventScope(), this.$id = n.id || "c" + rt(), this.$name = "cell", this.$factory = i, st(this);
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
    return i.raw ? e = typeof i.raw == "string" ? i.raw : "" : (e || (e = "<div class='gantt_layout_content' " + (n ? " class='" + n + "' " : "") + " >" + (i.html || "") + "</div>"), i.header && (a = "<div class='gantt_layout_header'>" + (i.canCollapse ? "<div class='gantt_layout_header_arrow'></div>" : "") + "<div class='gantt_layout_header_content'>" + i.header + "</div></div>")), "<div class='gantt_layout_cell " + n + "' data-cell-id='" + this.$id + "'>" + a + e + "</div>";
  }, t.prototype.$fill = function(e, n) {
    this.$view = e, this.$parent = n, this.init();
  }, t.prototype.getNode = function() {
    return this.$view.querySelector("gantt_layout_cell") || this.$view;
  }, t.prototype.init = function() {
    var e = this;
    this._headerClickHandler = function(n) {
      tt(n, "data-cell-id") == e.$id && e.toggle();
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
    for (var a in this._borders) qt(i, this._borders[a]);
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
    this.$container && this.$view && tn(this.$view);
    for (var n = 0; n < this.$cells.length; n++)
      this.$cells[n].destructor();
    this.$cells = [], t.prototype.destructor.call(this);
  }, e.prototype._resizeScrollbars = function(n, i) {
    var a = !1, r = [], s = [];
    const o = [];
    function l(f) {
      f.$parent.show(), a = !0, r.push(f);
    }
    function d(f) {
      f.$parent.hide(), a = !0, s.push(f);
    }
    for (var c, u = 0; u < i.length; u++) n[(c = i[u]).$config.scroll] ? d(c) : c.shouldHide() ? o.push(c) : c.shouldShow() ? l(c) : c.isVisible() ? r.push(c) : s.push(c);
    var h = {};
    for (u = 0; u < r.length; u++) r[u].$config.group && (h[r[u].$config.group] = !0);
    for (o.forEach(function(f) {
      f.$config.group && h[f.$config.group] || d(f);
    }), u = 0; u < s.length; u++) if ((c = s[u]).$config.group && h[c.$config.group]) {
      l(c);
      for (var g = 0; g < r.length; g++) if (r[g] == c) {
        this.$gantt.$scrollbarRepaint = !0;
        break;
      }
    }
    return a;
  }, e.prototype.getScrollbarsInfo = function() {
    const n = this.getCellsByType("scroller"), i = [];
    return n.forEach((a) => {
      let r = {};
      const { visible: s, direction: o, size: l, scrollSize: d, position: c } = a.getScrollState();
      let u = a._getLinkedViews().map((h) => h.$config.id);
      r.id = a.$id, r.visible = s, r.boundViews = u, o === "x" ? (r.x = l, r.x_inner = d, r.x_pos = c || 0) : (r.y = l, r.y_inner = d, r.y_pos = c || 0), i.push(r);
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
      var d = n[l].getSize(), c = r > 0 ? n[l].$parent.getNextSibling(n[l].$id) : n[l].$parent.getPrevSibling(n[l].$id);
      c.$name == "resizer" && (c = r > 0 ? c.$parent.getNextSibling(c.$id) : c.$parent.getPrevSibling(c.$id));
      var u = c.getSize();
      if (o) n[l].$config.gravity = s;
      else if (c[a]) {
        var h = d.gravity + u.gravity, g = d[a] + u[a], f = h / g;
        n[l].$config.gravity = f * s, c.$config[a] = g - s, c.$config.gravity = h - f * s;
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
      if (this.$config.autosize && (this.autosize(this.$config.autosize), a.forEach(function(d) {
        const c = d.$parent, u = c.getContentSize(o);
        o.x && (c.$config.$originalWidthStored || (c.$config.$originalWidthStored = !0, c.$config.$originalWidth = c.$config.width), c.$config.width = u.width), o.y && (c.$config.$originalHeightStored || (c.$config.$originalHeightStored = !0, c.$config.$originalHeight = c.$config.height), c.$config.height = u.height);
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
    var n = Qe(this.$container, this.$toHTML());
    this.$fill(n, null), this.callEvent("onReady", []), this.resize(), this.render = this.resize;
  }, e.prototype.$fill = function(n, i) {
    this.$view = n, this.$parent = i;
    for (var a = en(n, "gantt_layout_cell"), r = a.length - 1; r >= 0; r--) {
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
      var d = this._sizes[l] = this.$cells[l].getSize();
      this.$cells[l].$config.hidden || (this._xLayout ? (!d.width && d.minWidth ? n += d.minWidth : n += d.width, a += d.maxWidth, i += d.minWidth, r = Math.max(r, d.height), s = Math.min(s, d.maxHeight), o = Math.max(o, d.minHeight)) : (!d.height && d.minHeight ? r += d.minHeight : r += d.height, s += d.maxHeight, o += d.minHeight, n = Math.max(n, d.width), a = Math.min(a, d.maxWidth), i = Math.max(i, d.minWidth)));
    }
    var c = t.prototype.getSize.call(this);
    return c.maxWidth >= 1e5 && (c.maxWidth = a), c.maxHeight >= 1e5 && (c.maxHeight = s), c.minWidth = c.minWidth != c.minWidth ? 0 : c.minWidth, c.minHeight = c.minHeight != c.minHeight ? 0 : c.minHeight, this._xLayout ? (c.minWidth += this.$config.margin * this.$cells.length || 0, c.minWidth += 2 * this.$config.padding || 0, c.minHeight += 2 * this.$config.padding || 0) : (c.minHeight += this.$config.margin * this.$cells.length || 0, c.minHeight += 2 * this.$config.padding || 0), c;
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
      var l = (r = s[o]).$cells, d = !0;
      l.forEach(function(c) {
        c.$config.hidden || c.$config.resizer || (d = !1);
      }), r.$config.hidden = d;
    }
  }, e.prototype.setSize = function(n, i) {
    this._configureBorders(), t.prototype.setSize.call(this, n, i), i = this.$lastSize.contentY, n = this.$lastSize.contentX;
    var a, r, s = this.$config.padding || 0;
    this.$view.style.padding = s + "px", this._gravity = 0, this._free = this._xLayout ? n : i, this._free -= 2 * s, this._updateCellVisibility();
    for (var o = 0; o < this._sizes.length; o++) if (!(a = this.$cells[o]).$config.hidden) {
      var l = this.$config.margin || 0;
      a.$name != "resizer" || l || (l = -1);
      var d = a.$view, c = this._xLayout ? "marginRight" : "marginBottom";
      o !== this.$cells.length - 1 && (d.style[c] = l + "px", this._free -= l), r = this._sizes[o], this._xLayout ? r.width || (this._gravity += r.gravity) : r.height || (this._gravity += r.gravity);
    }
    for (o = 0; o < this._sizes.length; o++) if (!(a = this.$cells[o]).$config.hidden) {
      var u = (r = this._sizes[o]).width, h = r.height;
      this._xLayout ? this._calcFreeSpace(u, r, !0) : this._calcFreeSpace(h, r, !1);
    }
    for (o = 0; o < this.$cells.length; o++) if (!(a = this.$cells[o]).$config.hidden) {
      r = this._sizes[o];
      var g = void 0, f = void 0;
      this._xLayout ? (g = this._calcSize(r.width, r, !0), f = i - 2 * s) : (g = n - 2 * s, f = this._calcSize(r.height, r, !1)), a.setSize(g, f);
    }
  }, e;
}(Rt), pa = function(t) {
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
    Rt.prototype.setSize.call(this, n, i);
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
}(kn), ma = function(t) {
  function e(n, i, a) {
    var r = t.apply(this, arguments) || this;
    if (i.view) {
      i.id && (this.$id = rt());
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
}(Rt), va = function(t) {
  var e = ["altKey", "shiftKey", "metaKey"];
  function n(a, r, s, o) {
    var l = t.apply(this, arguments) || this;
    this.$config = N(r, { scroll: "x" }), l._scrollHorizontalHandler = R(l._scrollHorizontalHandler, l), l._scrollVerticalHandler = R(l._scrollVerticalHandler, l), l._outerScrollVerticalHandler = R(l._outerScrollVerticalHandler, l), l._outerScrollHorizontalHandler = R(l._outerScrollHorizontalHandler, l), l._mouseWheelHandler = R(l._mouseWheelHandler, l), this.$config.hidden = !0;
    var d = o.config.scroll_size;
    return o.env.isIE && (d += 1), this._isHorizontal() ? (l.$config.height = d, l.$parent.$config.height = d) : (l.$config.width = d, l.$parent.$config.width = d), this.$config.scrollPosition = 0, l.$name = "scroller", l;
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
    for (var a, r = 0, s = 0, o = this._isHorizontal(), l = this._getLinkedViews(), d = o ? "scrollWidth" : "scrollHeight", c = o ? "contentX" : "contentY", u = o ? "x" : "y", h = this._getScrollOffset(), g = 0; g < l.length; g++) if ((a = l[g]) && a.$content && a.$content.getSize && !a.$config.hidden) {
      var f, y = a.$content.getSize();
      if (f = y.hasOwnProperty(d) ? y[d] : y[c], h) y[c] > y[u] && y[c] > r && f > y[u] - h + 2 && (r = f + (o ? 0 : 2), s = y[u]);
      else {
        var v = Math.max(y[c] - f, 0);
        (f += v) > Math.max(y[u] - v, 0) && f > r && (r = f, s = y[u]);
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
      var l = s[o].$parent.$cells, d = l[l.length - 1];
      if (d && d.$config.view == "scrollbar" && d.$config.hidden === !1) {
        a = d.$config.width;
        break;
      }
    }
    return a || 0;
  }, n.prototype._setScrollSize = function(a) {
    var r = this._isHorizontal() ? "width" : "height", s = this._isHorizontal() ? this.$scroll_hor : this.$scroll_ver, o = this._getScrollOffset(), l = s.firstChild;
    o ? this._isVertical() ? (this.$config.outerSize = this.$config.height - o + 3, s.style.height = this.$config.outerSize + "px", s.style.top = o - 1 + "px", wt(s, this.$parent._borders.top), wt(s.parentNode, "gantt_task_vscroll")) : (this.$config.outerSize = this.$config.width - o + 1, s.style.width = this.$config.outerSize + "px") : (s.style.top = "auto", qt(s, this.$parent._borders.top), qt(s.parentNode, "gantt_task_vscroll"), this.$config.outerSize = this.$config.height), l.style[r] = a + "px";
  }, n.prototype._scrollVerticalHandler = function(a) {
    if (!this._scrollHorizontalHandler() && !this._scrolling) {
      var r = this.$scroll_ver.scrollTop;
      r != this._oldTop && (this.scrollVertically(r), this._oldTop = this.$scroll_ver.scrollTop);
    }
  }, n.prototype._outerScrollVerticalHandler = function(a) {
    this._scrollHorizontalHandler();
  }, n.prototype._checkWheelTarget = function(a) {
    for (var r = this._getLinkedViews().concat(this), s = 0; s < r.length; s++)
      if (G(a, r[s].$view)) return !0;
    return !1;
  }, n.prototype._mouseWheelHandler = function(a) {
    var r = a.target || a.srcElement;
    if (this._checkWheelTarget(r)) {
      this._wheel_time = /* @__PURE__ */ new Date();
      var s = {}, o = { x: 1, y: 1 }, l = this.$gantt.config.wheel_scroll_sensitivity;
      typeof l == "number" && l ? o = { x: l, y: l } : {}.toString.apply(l) == "[object Object]" && (o = { x: l.x, y: l.y });
      var d = mt.isFF, c = d ? a.deltaX : a.wheelDeltaX, u = d ? a.deltaY : a.wheelDelta, h = -20;
      d && (h = a.deltaMode !== 0 ? -40 : -10);
      var g = d ? c * h * o.x : 2 * c * o.x, f = d ? u * h * o.y : u * o.y, y = this.$gantt.config.horizontal_scroll_key;
      if (y !== !1 && e.indexOf(y) >= 0 && (!a[y] || a.deltaX || a.wheelDeltaX || (g = 2 * f, f = 0)), g && Math.abs(g) > Math.abs(f)) {
        if (this._isVertical()) return;
        if (s.x || !this.$scroll_hor || !this.$scroll_hor.offsetWidth) return !0;
        var v = g / -40, b = this._oldLeft, _ = b + 30 * v;
        if (this.scrollHorizontally(_), this.$scroll_hor.scrollLeft = _, b == this.$scroll_hor.scrollLeft) return !0;
        this._oldLeft = this.$scroll_hor.scrollLeft;
      } else {
        if (this._isHorizontal()) return;
        if (s.y || !this.$scroll_ver || !this.$scroll_ver.offsetHeight) return !0;
        v = f / -40, f === void 0 && (v = a.detail);
        var m = this._oldTop, p = this.$scroll_ver.scrollTop + 30 * v;
        if (this.scrollVertically(p), this.$scroll_ver.scrollTop = p, m == this.$scroll_ver.scrollTop) return !0;
        this._oldTop = this.$scroll_ver.scrollTop;
      }
      return a.preventDefault && a.preventDefault(), a.cancelBubble = !0, !1;
    }
  }, n;
}(Rt);
function yn(t) {
  var e = {}, n = {}, i = null, a = -1, r = null, s = /* @__PURE__ */ function(o) {
    var l = -1, d = -1;
    return { resetCache: function() {
      l = -1, d = -1;
    }, _getRowHeight: function() {
      return l === -1 && (l = o.$getConfig().row_height), l;
    }, _refreshState: function() {
      this.resetCache(), d = !0;
      var c = o.$config.rowStore;
      if (c) for (var u = this._getRowHeight(), h = 0; h < c.fullOrder.length; h++) {
        var g = c.getItem(c.fullOrder[h]);
        if (g && g.row_height && g.row_height !== u) {
          d = !1;
          break;
        }
      }
    }, canUseSimpleCalculation: function() {
      return d === -1 && this._refreshState(), d;
    }, getRowTop: function(c) {
      return o.$config.rowStore ? c * this._getRowHeight() : 0;
    }, getItemHeight: function(c) {
      return this._getRowHeight();
    }, getTotalHeight: function() {
      return o.$config.rowStore ? o.$config.rowStore.countVisible() * this._getRowHeight() : 0;
    }, getItemIndexByTopPosition: function(c) {
      return o.$config.rowStore ? Math.floor(c / this._getRowHeight()) : 0;
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
    for (var d = l.getIndexRange(), c = 0, u = 0, h = 0; h < d.length; h++) n[h] = c, c += this.getItemHeight(d[h].id), h < o && (u = c);
    return u;
  }, getItemTop: function(o) {
    if (this.$config.rowStore) {
      if (e[o] !== void 0) return e[o];
      var l = this.$config.rowStore;
      if (!l) return 0;
      var d = l.getIndexById(o);
      if (d === -1 && l.getParent && l.exists(o)) {
        var c = l.getParent(o);
        if (l.exists(c)) {
          var u = l.getItem(c);
          if (this.$gantt.isSplitTask(u)) return this.getItemTop(c);
        }
      }
      return e[o] = this.getRowTop(d), e[o];
    }
    return 0;
  }, getItemHeight: function(o) {
    if (s.canUseSimpleCalculation()) return s.getItemHeight(o);
    if (!i && this.$config.rowStore && this._fillHeightCache(this.$config.rowStore), i[o] !== void 0) return i[o];
    var l = this.$getConfig().row_height;
    if (this.$config.rowStore) {
      var d = this.$config.rowStore;
      if (!d) return l;
      var c = d.getItem(o);
      return i[o] = c && c.row_height || l;
    }
    return l;
  }, _fillHeightCache: function(o) {
    if (o) {
      i = {};
      var l = this.$getConfig().row_height;
      o.eachItem(function(d) {
        return i[d.id] = d && d.row_height || l;
      });
    }
  }, getCacheStateTotalHeight: function(o) {
    var l = this.$getConfig().row_height, d = {}, c = [], u = 0;
    return o && o.eachItem(function(h) {
      c.push(h), d[h.id] = h.row_height, u += h.row_height || l;
    }), { globalHeight: l, items: c, count: c.length, sumHeight: u };
  }, shouldClearHeightCache: function(o, l) {
    if (o.count != l.count || o.globalHeight != l.globalHeight || o.sumHeight != l.sumHeight) return !0;
    for (var d in o.items) {
      var c = l.items[d];
      if (c !== void 0 && c != o.items[d]) return !0;
    }
    return !1;
  }, getTotalHeight: function() {
    if (s.canUseSimpleCalculation()) return s.getTotalHeight();
    if (a != -1) return a;
    if (this.$config.rowStore) {
      var o = this.$config.rowStore;
      this._fillHeightCache(o);
      var l = this.getItemHeight.bind(this), d = o.getVisibleItems(), c = 0;
      return d.forEach(function(u) {
        c += l(u.id);
      }), a = c, c;
    }
    return 0;
  }, getItemIndexByTopPosition: function(o) {
    if (this.$config.rowStore) {
      if (s.canUseSimpleCalculation()) return s.getItemIndexByTopPosition(o);
      for (var l = this.$config.rowStore, d = 0; d < l.countVisible(); d++) {
        var c = this.getRowTop(d), u = this.getRowTop(d + 1);
        if (!u) {
          var h = l.getIdByIndex(d);
          u = c + this.getItemHeight(h);
        }
        if (o >= c && o < u) return d;
      }
      return l.countVisible() + 2;
    }
    return 0;
  } };
}
const ka = function() {
  return { render: function() {
  }, destroy: function() {
  } };
};
var Vt = function(t, e, n, i) {
  this.$config = N({}, e || {}), this.$scaleHelper = new _e(i), this.$gantt = i, this._posFromDateCache = {}, this._timelineDragScroll = null, N(this, yn(this)), st(this);
};
Vt.prototype = { init: function(t) {
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
      typeof (d = a[r]) == "string" && (d = this.$gantt.$ui.layers[d]()), (typeof d == "function" || d && d.render && d.update) && (d = { renderer: d }), d.view = this;
      var s = i.addLayer(d);
      this._taskLayers.push(s), d.expose && (this._taskRenderer = i.getLayer(s));
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
      var d;
      typeof d == "string" && (d = this.$gantt.$ui.layers[d]()), (d = l[r]).view = this;
      var c = o.addLayer(d);
      this._taskLayers.push(c), l[r].expose && (this._linkRenderer = o.getLayer(c));
    }
  }
}, _initStaticBackgroundRender: function() {
  var t = this, e = ka(), n = t.$config.rowStore;
  n && (this._staticBgHandler = n.attachEvent("onStoreUpdated", function(i, a, r) {
    if (i === null && t.isVisible()) {
      var s = t.$getConfig();
      if (s.static_background || s.timeline_placeholder) {
        var o = t.$gantt.getDatastore(t.$config.bind), l = t.$task_bg_static;
        if (l || ((l = document.createElement("div")).className = "gantt_task_bg", t.$task_bg_static = l, t.$task_bg.nextSibling ? t.$task_data.insertBefore(l, t.$task_bg.nextSibling) : t.$task_data.appendChild(l)), o) {
          var d = t.getTotalHeight();
          s.timeline_placeholder && (d = s.timeline_placeholder.height || t.$task_data.offsetHeight || 99999), e.render(l, s, t.getScale(), d, t.getItemHeight(a ? a.id : null));
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
    var l = r.prepareConfigs(s, t.min_column_width, o, i - 1, a.min_date, a.max_date, t.rtl), d = this._tasks = l[l.length - 1];
    this._scales = l, this._posFromDateCache = {}, e = this._getScaleChunkHtml(l, 0, this.$config.width), n = d.full_width + "px", i += "px";
  }
  this.$task_scale.style.height = i, this.$task_data.style.width = this.$task_scale.style.width = n, this.$task_scale.innerHTML = e;
}, _getScaleChunkHtml: function(t, e, n) {
  for (var i = [], a = this.$gantt.templates.scale_row_class, r = 0; r < t.length; r++) {
    var s = "gantt_scale_line", o = a(t[r]);
    o && (s += " " + o), i.push('<div class="' + s + '" style="height:' + t[r].height + "px;position:relative;line-height:" + t[r].height + 'px">' + this._prepareScaleHtml(t[r], e, n, r) + "</div>");
  }
  return i.join("");
}, _prepareScaleHtml: function(t, e, n, i) {
  var a = this.$getConfig(), r = this.$gantt.templates, s = [], o = null, l = null, d = t.format || t.template || t.date;
  typeof d == "string" && (d = this.$gantt.date.date_to_str(d));
  var c = 0, u = t.count;
  !a.smart_scales || isNaN(e) || isNaN(n) || (c = At(t.left, e), u = At(t.left, n) + 1), l = t.css || function() {
  }, !t.css && a.inherit_scale_class && (l = r.scale_cell_class);
  for (var h = c; h < u && t.trace_x[h]; h++) {
    o = new Date(t.trace_x[h]);
    var g = d.call(this, o), f = t.width[h];
    t.height;
    var y = t.left[h], v = "", b = "", _ = "";
    if (f) {
      v = "width:" + f + "px;" + (a.smart_scales ? "position:absolute;left:" + y + "px" : "");
      const p = this.getViewPort(), k = (a.scales[i] || {}).sticky;
      let $ = "";
      const w = 70;
      if (k !== !1 && f > w || k === !0) {
        if (y < p.x && y + f / 2 - w / 2 < p.x) $ = ` style='position:absolute;left: ${p.x - y + 10}px;' `;
        else if (y + f / 2 + w / 2 > p.x_end && f > w) {
          let x = p.x_end - y - 10, S = "-100%";
          x < w && (x = w, S = `-${x}px`), $ = ` style='position:absolute;left: ${x}px;transform: translate(${S},0);' `;
        }
      }
      _ = "gantt_scale_cell" + (h == t.count - 1 ? " gantt_last_cell" : ""), (b = l.call(this, o)) && (_ += " " + b);
      var m = `<div class='${_}' ${this.$gantt._waiAria.getTimelineCellAttr(g)} style='${v}'><span ${$}>${g}</span></div>`;
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
  var d = (t - n[s]) / this._getColumnDuration(this._tasks, n[s]);
  return l ? l[s] + (1 - d) : s + d;
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
class ya {
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
const Ue = "data-column-id";
class ba {
  constructor(e, n) {
    this._targetMarker = null, this.calculateCurrentPosition = (i) => {
      const a = this.$grid.$grid.getBoundingClientRect(), r = a.right, s = a.left;
      let o = i;
      return o > r && (o = r), o < s && (o = s), o;
    }, this.$gantt = e, this.$grid = n;
  }
  init() {
    const e = this.$gantt.$services.getService("dnd");
    this._dnd = new e(this.$grid.$grid_scale, { updates_per_second: 60 }), this._scrollableGrid = new ya({ gantt: this.$gantt, grid: this.$grid, dnd: this._dnd, getCurrentX: this.calculateCurrentPosition }), this.attachEvents();
  }
  attachEvents() {
    this._dnd.attachEvent("onBeforeDragStart", (e, n) => {
      if (this._draggedCell = this.$gantt.utils.dom.closest(n.target, ".gantt_grid_head_cell"), !this._draggedCell) return;
      const i = this.$grid.$getConfig().columns, a = this._draggedCell.getAttribute(Ue);
      let r, s;
      return i.map(function(o, l) {
        o.name === a && (r = o, s = l);
      }), this.$grid.callEvent("onBeforeColumnDragStart", [{ draggedColumn: r, draggedIndex: s }]) !== !1 && !(!this._draggedCell || !r) && (this._gridConfig = this.$grid.$getConfig(), this._originAutoscroll = this.$gantt.config.autoscroll, this.$gantt.config.autoscroll = !1, !0);
    }), this._dnd.attachEvent("onAfterDragStart", (e, n) => {
      this._draggedCell && (this._dnd.config.column = this._draggedCell.getAttribute(Ue), this._dnd.config.marker.innerHTML = this._draggedCell.outerHTML, this._dnd.config.marker.classList.add("gantt_column_drag_marker"), this._dnd.config.marker.style.height = this._gridConfig.scale_height + "px", this._dnd.config.marker.style.lineHeight = this._gridConfig.scale_height + "px", this._draggedCell.classList.add("gantt_grid_head_cell_dragged"));
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
    let l, d = 0, c = n.length - 1, u = (f, y) => f <= y, h = (f) => ++f;
    this.$gantt.config.rtl && (d = n.length - 1, c = 0, u = (f, y) => f >= y, h = (f) => --f);
    const g = this._dragX - this.$grid.$grid.getBoundingClientRect().left + this._scrollableGrid.getCorrection();
    for (let f = d; u(f, c) && (i === void 0 || a === void 0); f = h(f)) n[f].hide || (o.startX = o.endX, o.endX += n[f].width, g >= o.startX && (g <= o.endX || !u(h(f), c)) && (i = f, r = o.startX, s = o.endX, l = (g - o.startX) / (o.endX - o.startX)), e === n[f].name && (a = f));
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
function Se(t) {
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
var ke = function(t, e, n, i) {
  this.$config = N({}, e || {}), this.$gantt = i, this.$parent = t, st(this), this.$state = {}, N(this, yn(this));
};
ke.prototype = { init: function(t) {
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
  this._renderHeaderResizers = l.doOnRender, this._mouseDelegates = Se(e);
  var d = function(c, u) {
    var h = { row_before_start: c.bind(function(g, f, y) {
      var v = u.$getConfig(), b = u.$config.rowStore;
      if (!tt(y, v.task_grid_row_resizer_attribute)) return !1;
      var _ = this.locate(y, v.task_grid_row_resizer_attribute), m = b.getItem(_);
      return u.callEvent("onBeforeRowResize", [m]) !== !1 && void 0;
    }, c), row_after_start: c.bind(function(g, f, y) {
      var v = u.$getConfig(), b = this.locate(y, v.task_grid_row_resizer_attribute);
      g.config.marker.innerHTML = "", g.config.marker.className += " gantt_row_grid_resize_area", g.config.marker.style.width = u.$grid.offsetWidth + "px", g.config.drag_id = b;
    }, c), row_drag_move: c.bind(function(g, f, y) {
      var v = u.$config.rowStore, b = u.$getConfig(), _ = g.config, m = _.drag_id, p = u.getItemHeight(m), k = u.getItemTop(m) - f.scrollTop, $ = F(u.$grid_data), w = parseInt(_.marker.style.top, 10), x = k + $.y, S = 0, T = b.min_task_grid_row_height;
      return (S = w - x) < T && (S = T), _.marker.style.left = $.x + "px", _.marker.style.top = x - 1 + "px", _.marker.style.height = Math.abs(S) + 1 + "px", _.marker_height = S, u.callEvent("onRowResize", [m, v.getItem(m), S + p]), !0;
    }, c), row_drag_end: c.bind(function(g, f, y) {
      var v = u.$config.rowStore, b = g.config, _ = b.drag_id, m = v.getItem(_), p = u.getItemHeight(_), k = b.marker_height;
      u.callEvent("onBeforeRowResizeEnd", [_, m, k]) !== !1 && m.row_height != k && (m.row_height = k, v.updateItem(_), u.callEvent("onAfterRowResize", [_, m, p, k]), this.render());
    }, c) };
    return { init: function() {
      var g = c.$services.getService("dnd"), f = u.$getConfig(), y = new g(u.$grid_data, { updates_per_second: 60 });
      c.defined(f.dnd_sensitivity) && (y.config.sensitivity = f.dnd_sensitivity), y.attachEvent("onBeforeDragStart", function(v, b) {
        return h.row_before_start(y, v, b);
      }), y.attachEvent("onAfterDragStart", function(v, b) {
        return h.row_after_start(y, v, b);
      }), y.attachEvent("onDragMove", function(v, b) {
        return h.row_drag_move(y, v, b);
      }), y.attachEvent("onDragEnd", function(v, b) {
        return h.row_drag_end(y, v, b);
      });
    } };
  }(e, this);
  d.init(), this._addLayers(this.$gantt), this._initEvents(), r && (this._columnDND = new ba(e, this), this._columnDND.init()), this.callEvent("onReady", []);
}, _validateColumnWidth: function(t, e) {
  var n = t[e];
  if (n && n != "*") {
    var i = this.$gantt, a = 1 * n;
    isNaN(a) ? i.assert(!1, "Wrong " + e + " value of column " + t.name) : t[e] = a;
  }
}, setSize: function(t, e) {
  this.$config.width = this.$state.width = t, this.$config.height = this.$state.height = e;
  for (var n, i = this.getGridColumns(), a = 0, r = (d = this.$getConfig()).grid_elastic_columns, s = 0, o = i.length; s < o; s++) this._validateColumnWidth(i[s], "min_width"), this._validateColumnWidth(i[s], "max_width"), this._validateColumnWidth(i[s], "width"), a += 1 * i[s].width;
  if (!isNaN(a) && this.$config.scrollable || (a = n = this._setColumnsWidth(t + 1)), this.$config.scrollable && r && !isNaN(a)) {
    let u = "width";
    r == "min_width" && (u = "min_width");
    let h = 0;
    i.forEach(function(g) {
      h += g[u] || d.min_grid_column_width;
    });
    var l = Math.max(h, t);
    a = this._setColumnsWidth(l), n = t;
  }
  this.$config.scrollable ? (this.$grid_scale.style.width = a + "px", this.$grid_data.style.width = a + "px") : (this.$grid_scale.style.width = "inherit", this.$grid_data.style.width = "inherit"), this.$config.width -= 1;
  var d = this.$getConfig();
  n !== t && (n !== void 0 ? (d.grid_width = n, this.$config.width = n - 1) : isNaN(a) || (this._setColumnsWidth(a), d.grid_width = a, this.$config.width = a - 1));
  var c = Math.max(this.$state.height - d.scale_height, 0);
  this.$grid_data.style.height = c + "px", this.refresh();
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
    var r = tt(e, this.$config.item_attribute);
    return r && a.close(r.getAttribute(this.$config.item_attribute)), !1;
  }, this), this.$grid), this._mouseDelegates.delegate("click", "gantt_open", t.bind(function(e, n, i) {
    var a = this.$config.rowStore;
    if (!a) return !0;
    var r = tt(e, this.$config.item_attribute);
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
  var l = r - a, d = 0;
  for (s = 0; s < e + 1; s++) d += i[s].width;
  for (a -= d, s = e + 1; s < i.length; s++) {
    var c = i[s], u = Math.round(l * (c.width / a));
    l < 0 ? c.min_width && c.width + u < c.min_width ? u = c.min_width - c.width : !c.min_width && n.min_grid_column_width && c.width + u < n.min_grid_column_width && (u = n.min_grid_column_width - c.width) : c.max_width && c.width + u > c.max_width && (u = c.max_width - c.width), a -= c.width, c.width += u, l -= u;
  }
  for (var h = l > 0 ? 1 : -1; l > 0 && h === 1 || l < 0 && h === -1; ) {
    var g = l;
    for (s = e + 1; s < i.length; s++) {
      var f;
      if ((f = i[s].width + h) == this._getColumnWidth(i[s], n, f) && (l -= h, i[s].width = f), !l) break;
    }
    if (g == l) break;
  }
  return l && e > -1 && (f = i[e].width + l) == this._getColumnWidth(i[e], n, f) && (i[e].width = f), this._getColsTotalWidth();
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
      var d = Math.round(l / (a.length - r));
      a[r] += d, (c = this._getColumnWidth(e[r], t, a[r])) != a[r] && (d = c - a[r], a[r] = c), l -= d;
    }
    else if (i.length) for (r = 0; r < i.length; r++) {
      d = Math.round(l / (i.length - r));
      var c, u = i[r];
      a[u] += d, (c = this._getColumnWidth(e[u], t, a[u])) != a[u] && (d = c - a[u], a[u] = c), l -= d;
    }
    for (r = 0; r < a.length; r++) e[r].width = a[r];
  } else {
    var h = o != n;
    this.$config.width = n - 1, t.grid_width = n, h && this.$parent._setContentSize(this.$config.width, null);
  }
}, _renderGridHeader: function() {
  var t = this.$gantt, e = this.$getConfig(), n = this.$gantt.locale, i = this.$gantt.templates, a = this.getGridColumns();
  e.rtl && (a = a.reverse());
  for (var r = [], s = 0, o = n.labels, l = e.scale_height - 1, d = 0; d < a.length; d++) {
    var c = d == a.length - 1, u = a[d];
    u.name || (u.name = t.uid() + "");
    var h = 1 * u.width, g = this._getGridWidth();
    c && g > s + h && (u.width = h = g - s), s += h;
    var f = t._sort && u.name == t._sort.name ? `<div data-column-id="${u.name}" class="gantt_sort gantt_${t._sort.direction}"></div>` : "", y = ["gantt_grid_head_cell", "gantt_grid_head_" + u.name, c ? "gantt_last_cell" : "", i.grid_header_class(u.name, u)].join(" "), v = "width:" + (h - (c ? 1 : 0)) + "px;", b = u.label || o["column_" + u.name] || o[u.name];
    b = b || "";
    var _ = "<div class='" + y + "' style='" + v + "' " + t._waiAria.gridScaleCellAttrString(u, b) + " data-column-id='" + u.name + "' column_id='" + u.name + "' data-column-name='" + u.name + "' data-column-index='" + d + "'>" + b + f + "</div>";
    r.push(_);
  }
  this.$grid_scale.style.height = e.scale_height + "px", this.$grid_scale.style.lineHeight = l + "px", this.$grid_scale.innerHTML = r.join(""), this._renderHeaderResizers && this._renderHeaderResizers();
}, _getGridWidth: function() {
  return this.$config.width;
}, destructor: function() {
  this._clearLayers(this.$gantt), this._mouseDelegates && (this._mouseDelegates.destructor(), this._mouseDelegates = null), this._unbindStore(), this.$grid = null, this.$grid_scale = null, this.$grid_data = null, this.$gantt = null, this.$config.rowStore && (this.$config.rowStore.detachEvent(this._staticBgHandler), this.$config.rowStore = null), this.callEvent("onDestroy", []), this.detachAllEvents();
} };
const xa = { init: function(t, e) {
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
} }, $a = { init: function(t, e) {
  var n = t, i = e.$gantt, a = null, r = i.ext.keyboardNavigation;
  r.attachEvent("onBeforeFocus", function(s) {
    var o = t.locateCell(s);
    if (clearTimeout(a), o) {
      var l = o.columnName, d = o.id, c = n.getState();
      if (n.isVisible() && c.id == d && c.columnName === l) return !1;
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
    var l = t.getState(), d = t.locateCell(o.target);
    return !d || !t.isVisible() || d.columnName != l.columnName;
  }), i.attachEvent("onTaskClick", function(s, o) {
    if (i._is_icon_open_click(o)) return !0;
    var l = t.getState(), d = t.locateCell(o.target);
    return !d || !t.getEditorConfig(d.columnName) || (t.isVisible() && l.id == d.id && l.columnName == d.columnName || t.startEdit(d.id, d.columnName), !1);
  }), i.attachEvent("onEmptyClick", function() {
    return n.save(), !0;
  }), r.attachEvent("onKeyDown", function(s, o) {
    var l = t.locateCell(o.target), d = !!l && t.getEditorConfig(l.columnName), c = t.getState(), u = i.constants.KEY_CODES, h = o.keyCode, g = !1;
    switch (h) {
      case u.ENTER:
        t.isVisible() ? (t.save(), o.preventDefault(), g = !0) : d && !(o.ctrlKey || o.metaKey || o.shiftKey) && (n.startEdit(l.id, l.columnName), o.preventDefault(), g = !0);
        break;
      case u.ESC:
        t.isVisible() && (t.hide(), o.preventDefault(), g = !0);
        break;
      case u.UP:
      case u.DOWN:
        break;
      case u.LEFT:
      case u.RIGHT:
        (d && t.isVisible() || c.editorType === "date") && (g = !0);
        break;
      case u.SPACE:
        t.isVisible() && (g = !0), d && !t.isVisible() && (n.startEdit(l.id, l.columnName), o.preventDefault(), g = !0);
        break;
      case u.DELETE:
        d && !t.isVisible() ? (n.startEdit(l.id, l.columnName), g = !0) : d && t.isVisible() && (g = !0);
        break;
      case u.TAB:
        if (t.isVisible()) {
          o.shiftKey ? t.editPrevCell(!0) : t.editNextCell(!0);
          var f = t.getState();
          f.id && r.focus({ type: "taskCell", id: f.id, column: f.columnName }), o.preventDefault(), g = !0;
        }
        break;
      default:
        if (t.isVisible()) g = !0;
        else if (h >= 48 && h <= 57 || h > 95 && h < 112 || h >= 64 && h <= 91 || h > 185 && h < 193 || h > 218 && h < 223) {
          var y = s.modifiers, v = y.alt || y.ctrl || y.meta || y.shift;
          y.alt || v && r.getCommandHandler(s, "taskCell") || d && !t.isVisible() && (n.startEdit(l.id, l.columnName), g = !0);
        }
    }
    return !g;
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
function wa(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  return z(n, e), N(n.prototype, { show: function(i, a, r, s) {
    var o = `<div role='cell'><input type='text' name='${a.name}' title='${a.name}'></div>`;
    s.innerHTML = o;
  } }, !0), n;
}
function Sa(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  return z(n, e), N(n.prototype, { show: function(i, a, r, s) {
    var o = r.min || 0, l = r.max || 100, d = `<div role='cell'><input type='number' min='${o}' max='${l}' name='${a.name}' title='${a.name}'></div>`;
    s.innerHTML = d, s.oninput = function(c) {
      +c.target.value < o && (c.target.value = o), +c.target.value > l && (c.target.value = l);
    };
  }, get_value: function(i, a, r) {
    return this.get_input(r).value || "";
  }, is_valid: function(i, a, r, s) {
    return !isNaN(parseInt(i, 10));
  } }, !0), n;
}
function Ta(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  return z(n, e), N(n.prototype, { show: function(i, a, r, s) {
    for (var o = `<div role='cell'><select name='${a.name}' title='${a.name}'>`, l = [], d = r.options || [], c = 0; c < d.length; c++) l.push("<option value='" + r.options[c].key + "'>" + d[c].label + "</option>");
    o += l.join("") + "</select></div>", s.innerHTML = o;
  }, get_input: function(i) {
    return i.querySelector("select");
  } }, !0), n;
}
function Ea(t) {
  var e = St(), n = "%Y-%m-%d", i = null, a = null;
  function r() {
    return e.apply(this, arguments) || this;
  }
  return z(r, e), N(r.prototype, { show: function(s, o, l, d) {
    i || (i = t.date.date_to_str(n)), a || (a = t.date.str_to_date(n));
    var c = null, u = null;
    c = typeof l.min == "function" ? l.min(s, o) : l.min, u = typeof l.max == "function" ? l.max(s, o) : l.max;
    var h = `<div style='width:140px' role='cell'><input type='date' ${c ? " min='" + i(c) + "' " : ""} ${u ? " max='" + i(u) + "' " : ""} name='${o.name}' title='${o.name}'></div>`;
    d.innerHTML = h, d.oninput = function(g) {
      g.target.value && (c || u) && (+t.date.str_to_date("%Y-%m-%d")(g.target.value) < +c && (g.target.value = t.date.date_to_str("%Y-%m-%d")(c)), +t.date.str_to_date("%Y-%m-%d")(g.target.value) > +u && (g.target.value = t.date.date_to_str("%Y-%m-%d")(u)));
    };
  }, set_value: function(s, o, l, d) {
    s && s.getFullYear ? this.get_input(d).value = i(s) : this.get_input(d).value = s;
  }, is_valid: function(s, o, l, d) {
    return !(!s || isNaN(s.getTime()));
  }, get_value: function(s, o, l) {
    var d;
    try {
      d = a(this.get_input(l).value || "");
    } catch {
      d = null;
    }
    return d;
  } }, !0), r;
}
function Ca(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  function i(l) {
    return l.formatter || t.ext.formatters.linkFormatter();
  }
  function a(l, d) {
    for (var c = (l || "").split(d.delimiter || ","), u = 0; u < c.length; u++) {
      var h = c[u].trim();
      h ? c[u] = h : (c.splice(u, 1), u--);
    }
    return c.sort(), c;
  }
  function r(l, d, c) {
    for (var u = l.$target, h = [], g = 0; g < u.length; g++) {
      var f = c.getLink(u[g]);
      h.push(i(d).format(f));
    }
    return h.join((d.delimiter || ",") + " ");
  }
  function s(l) {
    return l.source + "_" + l.target + "_" + l.type + "_" + (l.lag || 0);
  }
  function o(l, d, c) {
    var u = function(v, b, _) {
      var m = [];
      return [...new Set(b)].forEach(function(p) {
        var k = i(_).parse(p);
        k && (k.target = v, k.id = "predecessor_generated", t.isLinkAllowed(k) && (k.id = void 0, m.push(k)));
      }), m;
    }(l.id, d, c), h = {};
    l.$target.forEach(function(v) {
      var b = t.getLink(v);
      h[s(b)] = b.id;
    });
    var g = [];
    u.forEach(function(v) {
      var b = s(v);
      h[b] ? delete h[b] : g.push(v);
    });
    var f = [];
    for (var y in h) f.push(h[y]);
    return { add: g, remove: f };
  }
  return z(n, e), N(n.prototype, { show: function(l, d, c, u) {
    var h = `<div role='cell'><input type='text' name='${d.name}' title='${d.name}'></div>`;
    u.innerHTML = h;
  }, hide: function() {
  }, set_value: function(l, d, c, u) {
    this.get_input(u).value = r(l, c.editor, t);
  }, get_value: function(l, d, c) {
    return a(this.get_input(c).value || "", d.editor);
  }, save: function(l, d, c) {
    var u = o(t.getTask(l), this.get_value(l, d, c), d.editor);
    (u.add.length || u.remove.length) && t.batchUpdate(function() {
      u.add.forEach(function(h) {
        t.addLink(h);
      }), u.remove.forEach(function(h) {
        t.deleteLink(h);
      }), t.autoSchedule && t.autoSchedule();
    });
  }, is_changed: function(l, d, c, u) {
    var h = this.get_value(d, c, u), g = a(r(l, c.editor, t), c.editor);
    return h.join() !== g.join();
  } }, !0), n;
}
function Da(t) {
  var e = St();
  function n() {
    return e.apply(this, arguments) || this;
  }
  function i(a) {
    return a.formatter || t.ext.formatters.durationFormatter();
  }
  return z(n, e), N(n.prototype, { show: function(a, r, s, o) {
    var l = `<div role='cell'><input type='text' name='${r.name}' title='${r.name}'></div>`;
    o.innerHTML = l;
  }, set_value: function(a, r, s, o) {
    this.get_input(o).value = i(s.editor).format(a);
  }, get_value: function(a, r, s) {
    return i(r.editor).parse(this.get_input(s).value || "");
  } }, !0), n;
}
function Aa(t) {
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
function Ia(t) {
  t.config.editor_types = { text: new (wa())(), number: new (Sa())(), select: new (Ta())(), date: new (Ea(t))(), predecessor: new (Ca(t))(), duration: new (Da(t))() };
}
function Ma(t) {
  var e = /* @__PURE__ */ function(a) {
    var r = null;
    return { setMapping: function(s) {
      r = s;
    }, getMapping: function() {
      return r || (a.config.keyboard_navigation_cells && a.ext.keyboardNavigation ? $a : xa);
    } };
  }(t), n = {};
  st(n);
  var i = { init: Ia, createEditors: function(a) {
    function r(u, h) {
      var g = a.$getConfig(), f = function(b, _) {
        for (var m = a.$getConfig(), p = a.getItemTop(b), k = a.getItemHeight(b), $ = a.getGridColumns(), w = 0, x = 0, S = 0, T = 0; T < $.length; T++) {
          if ($[T].name == _) {
            S = $[T].width;
            break;
          }
          m.rtl ? x += $[T].width : w += $[T].width;
        }
        return m.rtl ? { top: p, right: x, height: k, width: S } : { top: p, left: w, height: k, width: S };
      }(u, h), y = document.createElement("div");
      y.className = "gantt_grid_editor_placeholder", y.setAttribute(a.$config.item_attribute, u), y.setAttribute(a.$config.bind + "_id", u), y.setAttribute("data-column-name", h);
      var v = function(b, _) {
        for (var m = b.getGridColumns(), p = 0; p < m.length; p++) if (m[p].name == _) return p;
        return 0;
      }(a, h);
      return y.setAttribute("data-column-index", v), t._waiAria.inlineEditorAttr(y), g.rtl ? y.style.cssText = ["top:" + f.top + "px", "right:" + f.right + "px", "width:" + f.width + "px", "height:" + f.height + "px"].join(";") : y.style.cssText = ["top:" + f.top + "px", "left:" + f.left + "px", "width:" + f.width + "px", "height:" + f.height + "px"].join(";"), y;
    }
    var s = Aa(t), o = [], l = [], d = null, c = { _itemId: null, _columnName: null, _editor: null, _editorType: null, _placeholder: null, locateCell: function(u) {
      if (!G(u, a.$grid)) return null;
      var h = tt(u, a.$config.item_attribute), g = tt(u, "data-column-name");
      if (h && g) {
        var f = g.getAttribute("data-column-name");
        return { id: h.getAttribute(a.$config.item_attribute), columnName: f };
      }
      return null;
    }, getEditorConfig: function(u) {
      return a.getColumn(u).editor;
    }, init: function() {
      var u = e.getMapping();
      u.init && u.init(this, a), d = a.$gantt.getDatastore(a.$config.bind);
      var h = this;
      o.push(d.attachEvent("onIdChange", function(g, f) {
        h._itemId == g && (h._itemId = f);
      })), o.push(d.attachEvent("onStoreUpdated", function() {
        a.$gantt.getState("batchUpdate").batch_update || h.isVisible() && !d.isVisible(h._itemId) && h.hide();
      })), l.push(t.attachEvent("onDataRender", function() {
        h._editor && h._placeholder && !G(h._placeholder, t.$root) && a.$grid_data.appendChild(h._placeholder);
      })), this.init = function() {
      };
    }, getState: function() {
      return { editor: this._editor, editorType: this._editorType, placeholder: this._placeholder, id: this._itemId, columnName: this._columnName };
    }, startEdit: function(u, h) {
      if (this.isVisible() && this.save(), d.exists(u)) {
        var g = { id: u, columnName: h };
        t.isReadonly(d.getItem(u)) ? this.callEvent("onEditPrevent", [g]) : this.callEvent("onBeforeEditStart", [g]) !== !1 ? (this.show(g.id, g.columnName), this.setValue(), this.callEvent("onEditStart", [g])) : this.callEvent("onEditPrevent", [g]);
      }
    }, isVisible: function() {
      return !(!this._editor || !G(this._placeholder, t.$root));
    }, show: function(u, h) {
      this.isVisible() && this.save();
      var g = { id: u, columnName: h }, f = a.getColumn(g.columnName), y = this.getEditorConfig(f.name);
      if (y) {
        var v = a.$getConfig().editor_types[y.type], b = r(g.id, g.columnName);
        a.$grid_data.appendChild(b), v.show(g.id, f, y, b), this._editor = v, this._placeholder = b, this._itemId = g.id, this._columnName = g.columnName, this._editorType = y.type;
        var _ = e.getMapping();
        _.onShow && _.onShow(this, b, a);
      }
    }, setValue: function() {
      var u = this.getState(), h = u.id, g = u.columnName, f = a.getColumn(g), y = d.getItem(h), v = this.getEditorConfig(g);
      if (v) {
        var b = y[v.map_to];
        v.map_to == "auto" && (b = d.getItem(h)), this._editor.set_value(b, h, f, this._placeholder), this.focus();
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
        return u.map_to == "auto" && (h = d.getItem(this._itemId)), h;
      }
    }, isChanged: function() {
      var u = a.getColumn(this._columnName), h = this._getItemValue();
      return this._editor.is_changed(h, this._itemId, u, this._placeholder);
    }, hide: function() {
      if (this._itemId) {
        var u = this._itemId, h = this._columnName, g = e.getMapping();
        g.onHide && g.onHide(this, this._placeholder, a), this._itemId = null, this._columnName = null, this._editorType = null, this._placeholder && (this._editor && this._editor.hide && this._editor.hide(this._placeholder), this._editor = null, this._placeholder.parentNode && this._placeholder.parentNode.removeChild(this._placeholder), this._placeholder = null, this.callEvent("onEditEnd", [{ id: u, columnName: h }]));
      }
    }, save: function() {
      if (this.isVisible() && d.exists(this._itemId) && this.isChanged()) {
        var u = this._itemId, h = this._columnName;
        if (d.exists(u)) {
          var g = d.getItem(u), f = this.getEditorConfig(h), y = { id: u, columnName: h, newValue: this.getValue(), oldValue: this._getItemValue() };
          if (this.callEvent("onBeforeSave", [y]) !== !1 && (!this._editor.is_valid || this._editor.is_valid(y.newValue, y.id, a.getColumn(h), this._placeholder))) {
            var v = f.map_to, b = y.newValue;
            v != "auto" ? (g[v] = b, s(g, v, t.config.inline_editors_date_processing), d.updateItem(u)) : this._editor.save(u, a.getColumn(h), this._placeholder), this.callEvent("onSave", [y]);
          }
          this.hide();
        }
      } else this.hide();
    }, _findEditableCell: function(u, h) {
      var g = u, f = a.getGridColumns()[g], y = f ? f.name : null;
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
        var g = this.getNextCell(1);
        g && this.getEditorConfig(g) && this.startEdit(this._itemId, g);
      } else if (u && this.moveRow(1)) {
        var f = this.moveRow(1);
        (h = this.getFirstCell()) && this.getEditorConfig(h) && this.startEdit(f, h);
      }
    }, editPrevCell: function(u) {
      var h = this.getNextCell(-1);
      if (h) {
        var g = this.getNextCell(-1);
        g && this.getEditorConfig(g) && this.startEdit(this._itemId, g);
      } else if (u && this.moveRow(-1)) {
        var f = this.moveRow(-1);
        (h = this.getLastCell()) && this.getEditorConfig(h) && this.startEdit(f, h);
      }
    }, moveRow: function(u) {
      for (var h = u > 0 ? t.getNext : t.getPrev, g = (h = t.bind(h, t))(this._itemId); t.isTaskExists(g) && t.isReadonly(t.getTask(g)); ) g = h(g);
      return g;
    }, editNextRow: function(u) {
      var h = this.getState().id;
      if (t.isTaskExists(h)) {
        var g = null;
        g = u ? this.moveRow(1) : t.getNext(h), t.isTaskExists(g) && this.startEdit(g, this._columnName);
      }
    }, editPrevRow: function(u) {
      var h = this.getState().id;
      if (t.isTaskExists(h)) {
        var g = null;
        g = u ? this.moveRow(-1) : t.getPrev(h), t.isTaskExists(g) && this.startEdit(g, this._columnName);
      }
    }, detachStore: function() {
      o.forEach(function(u) {
        d.detachEvent(u);
      }), l.forEach(function(u) {
        t.detachEvent(u);
      }), o = [], l = [], d = null, this.hide();
    }, destructor: function() {
      this.detachStore(), this.detachAllEvents();
    } };
    return N(c, e), N(c, n), c;
  } };
  return N(i, e), N(i, n), i;
}
function ye(t, e, n, i, a) {
  if (!t.start_date || !t.end_date) return null;
  var r = n.getItemTop(t.id), s = n.getItemHeight(t.id);
  if (r > e.y_end || r + s < e.y) return !1;
  var o = n.posFromDate(t.start_date), l = n.posFromDate(t.end_date), d = Math.min(o, l) - 200, c = Math.max(o, l) + 200;
  return !(d > e.x_end || c < e.x);
}
function bn(t) {
  function e(r, s, o) {
    if (t._isAllowedUnscheduledTask(r) || !t._isTaskInTimelineLimits(r)) return;
    var l = s.getItemPosition(r), d = o, c = s.$getTemplates(), u = t.getTaskType(r.type), h = s.getBarHeight(r.id, u == d.types.milestone), g = 0;
    u == d.types.milestone && (g = (h - l.height) / 2);
    var f = Math.floor((s.getItemHeight(r.id) - h) / 2);
    const y = t.config.baselines && r.baselines && r.baselines.length, v = t.config.baselines && (t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow");
    if (y && v && r.bar_height !== "full" && r.bar_height < r.row_height) if (u === d.types.milestone) {
      let x = s.getBarHeight(r.id, !0), S = Math.sqrt(2 * x * x);
      f = Math.floor((S - h) / 2) + 2;
    } else f = 2;
    u == d.types.milestone && (l.left -= Math.round(h / 2), l.width = h);
    var b = document.createElement("div"), _ = Math.round(l.width);
    s.$config.item_attribute && (b.setAttribute(s.$config.item_attribute, r.id), b.setAttribute(s.$config.bind + "_id", r.id)), d.show_progress && u != d.types.milestone && function(x, S, T, E, C) {
      var D = 1 * x.progress || 0;
      T = Math.max(T - 2, 0);
      var A = document.createElement("div"), I = Math.round(T * D);
      I = Math.min(T, I), A.style.width = I + "px", A.className = "gantt_task_progress", A.innerHTML = C.progress_text(x.start_date, x.end_date, x), E.rtl && (A.style.position = "absolute", A.style.right = "0px");
      var M = document.createElement("div");
      if (M.className = "gantt_task_progress_wrapper", M.appendChild(A), S.appendChild(M), t.config.drag_progress && !t.isReadonly(x)) {
        var L = document.createElement("div"), P = I;
        E.rtl && (P = T - I), L.style.left = P + "px", L.className = "gantt_task_progress_drag", L.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
<path d="M5.58397 1.52543C5.78189 1.22856 6.21811 1.22856 6.41602 1.52543L10.5475 7.72265C10.769 8.05493 10.5308 8.5 10.1315 8.5L1.86852 8.5C1.46917 8.5 1.23097 8.05493 1.45249 7.72265L5.58397 1.52543Z" fill="var(--dhx-gantt-progress-handle-background)" stroke="var(--dhx-gantt-progress-handle-border)"/>
</svg>`, A.appendChild(L), S.appendChild(L);
      }
    }(r, b, _, d, c);
    var m = function(x, S, T) {
      var E = document.createElement("div");
      return t.getTaskType(x.type) != t.config.types.milestone ? E.innerHTML = T.task_text(x.start_date, x.end_date, x) : t.getTaskType(x.type) == t.config.types.milestone && S && (E.style.height = E.style.width = S + "px"), E.className = "gantt_task_content", E;
    }(r, _, c);
    b.appendChild(m);
    var p = function(x, S, T, E) {
      var C = E.$getConfig(), D = [x];
      S && D.push(S);
      var A = t.getState(), I = t.getTask(T);
      if (t.getTaskType(I.type) == C.types.milestone ? D.push("gantt_milestone") : t.getTaskType(I.type) == C.types.project && D.push("gantt_project"), D.push("gantt_bar_" + t.getTaskType(I.type)), t.isSummaryTask(I) && D.push("gantt_dependent_task"), t.isSplitTask(I) && (C.open_split_tasks && !I.$open || !C.open_split_tasks) && D.push("gantt_split_parent"), C.select_task && t.isSelectedTask(T) && D.push("gantt_selected"), T == A.drag_id && (D.push("gantt_drag_" + A.drag_mode), A.touch_drag && D.push("gantt_touch_" + A.drag_mode)), A.link_source_id == T && (D.push("gantt_link_source"), A.link_from_start ? D.push("gantt_link_from_start") : D.push("gantt_link_from_end")), A.link_target_id == T && D.push("gantt_link_target"), C.highlight_critical_path && t.isCriticalTask && t.isCriticalTask(I) && D.push("gantt_critical_task"), A.link_landing_area && A.link_target_id && A.link_source_id && A.link_target_id != A.link_source_id && (A.link_target_id == T || A.link_source_id == T)) {
        var M = A.link_source_id, L = A.link_from_start, P = A.link_to_start, H = "";
        H = t.isLinkAllowed(M, T, L, P) ? P ? "link_start_allow" : "link_finish_allow" : P ? "link_start_deny" : "link_finish_deny", D.push(H);
      }
      return D.join(" ");
    }("gantt_task_line", c.task_class(r.start_date, r.end_date, r), r.id, s);
    (r.color || r.progressColor || r.textColor) && (p += " gantt_task_inline_color"), l.width < 20 && (p += " gantt_thin_task"), b.className = p;
    var k = ["left:" + l.left + "px", "top:" + (f + l.top) + "px", "height:" + h + "px", "line-height:" + Math.max(h < 30 ? h - 2 : h, 0) + "px", "width:" + _ + "px"];
    b.style.cssText = k.join(";"), r.color && b.style.setProperty("--dhx-gantt-task-background", r.color), r.textColor && b.style.setProperty("--dhx-gantt-task-color", r.textColor), r.progressColor && b.style.setProperty("--dhx-gantt-task-progress-color", r.progressColor);
    var $ = function(x, S, T, E) {
      var C = "gantt_left " + i(!S.rtl, x), D = null;
      return E && (D = { type: "marginRight", value: E }), n(x, T.leftside_text, C, D);
    }(r, d, c, g);
    $ && b.appendChild($), $ = function(x, S, T, E) {
      var C = "gantt_right " + i(!!S.rtl, x), D = null;
      return E && (D = { type: "marginLeft", value: E }), n(x, T.rightside_text, C, D);
    }(r, d, c, g), $ && b.appendChild($), t._waiAria.setTaskBarAttr(r, b);
    var w = t.getState();
    return t.isReadonly(r) || (d.drag_resize && !t.isSummaryTask(r) && u != d.types.milestone && a(b, "gantt_task_drag", r, function(x) {
      var S = document.createElement("div");
      return S.className = x, S;
    }, d), d.drag_links && d.show_links && a(b, "gantt_link_control", r, function(x) {
      var S = document.createElement("div");
      S.className = x, S.style.cssText = ["height:" + h + "px", "line-height:" + h + "px"].join(";");
      var T = document.createElement("div");
      T.className = "gantt_link_point";
      var E = !1;
      return w.link_source_id && d.touch && (E = !0), T.style.display = E ? "block" : "", S.appendChild(T), S;
    }, d, g)), b;
  }
  function n(r, s, o, l) {
    if (!s) return null;
    var d = s(r.start_date, r.end_date, r);
    if (!d) return null;
    var c = document.createElement("div");
    return c.className = "gantt_side_content " + o, c.innerHTML = d, l && (c.style[l.type] = Math.abs(l.value) + "px"), c;
  }
  function i(r, s) {
    var o = r ? { $source: [t.config.links.start_to_start], $target: [t.config.links.start_to_start, t.config.links.finish_to_start] } : { $source: [t.config.links.finish_to_start, t.config.links.finish_to_finish], $target: [t.config.links.finish_to_finish] };
    for (var l in o) for (var d = s[l], c = 0; c < d.length; c++) for (var u = t.getLink(d[c]), h = 0; h < o[l].length; h++) if (u.type == o[l][h]) return "gantt_link_crossing";
    return "";
  }
  function a(r, s, o, l, d, c) {
    var u, h = t.getState();
    +o.start_date >= +h.min_date && ((u = l([s, d.rtl ? "task_right" : "task_left", "task_start_date"].join(" "))).setAttribute("data-bind-property", "start_date"), c && (u.style.marginLeft = c + "px"), r.appendChild(u)), +o.end_date <= +h.max_date && ((u = l([s, d.rtl ? "task_left" : "task_right", "task_end_date"].join(" "))).setAttribute("data-bind-property", "end_date"), c && (u.style.marginRight = c + "px"), r.appendChild(u));
  }
  return function(r, s, o) {
    var l = (o = s.$getConfig()).type_renderers[t.getTaskType(r.type)], d = e;
    return l ? l.call(t, r, function(c) {
      return d.call(t, c, s, o);
    }, s) : d.call(t, r, s, o);
  };
}
function qe(t) {
  return { render: bn(t), update: null, isInViewPort: ye, getVisibleRange: ft };
}
function Ct() {
  return console.error("You are trying to use a Pro feature that is not available in the GPL version."), { render: function() {
  }, isInViewPort: function() {
  }, getVisibleRange: function() {
  } };
}
function Ge(t, e, n) {
  return { top: e.getItemTop(t.id), height: e.getItemHeight(t.id), left: 0, right: 1 / 0 };
}
function Wt(t, e) {
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
function ae(t, e, n, i) {
  var a = e.width[t];
  if (a <= 0) return !1;
  if (!i.config.smart_rendering || Nt(i)) return !0;
  var r = e.left[t] - a, s = e.left[t] + a;
  return r <= n.x_end && s >= n.x;
}
function Na(t, e) {
  var n = e.config.timeline_placeholder;
  if (t = t || [], n && t.filter((l) => l.id === "timeline_placeholder_task").length === 0) {
    var i = e.getState(), a = null, r = i.min_date, s = i.max_date;
    t.length && (a = t[t.length - 1].id);
    var o = { start_date: r, end_date: s, row_height: n.height || 0, id: "timeline_placeholder_task", unscheduled: !0, lastTaskId: a, calendar_id: n.calendar || "global", $source: [], $target: [] };
    t.push(o);
  }
}
function La(t) {
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
    var o, l = r.$getConfig().link_wrapper_width, d = a.y - l / 2;
    switch (a.direction) {
      case this.dirs.left:
        o = { top: d, height: l, lineHeight: l, left: a.x - a.size - l / 2, width: a.size + l };
        break;
      case this.dirs.right:
        o = { top: d, lineHeight: l, height: l, left: a.x - l / 2, width: a.size + l };
        break;
      case this.dirs.up:
        o = { top: d - a.size, lineHeight: a.size + l, height: a.size + l, left: a.x - l / 2, width: l };
        break;
      case this.dirs.down:
        o = { top: d, lineHeight: a.size + l, height: a.size + l, left: a.x - l / 2, width: l };
    }
    return o;
  }, get_line_sizes: function(a, r) {
    var s, o = r.$getConfig(), l = o.link_line_width, d = o.link_wrapper_width, c = a.size + l;
    switch (a.direction) {
      case this.dirs.left:
      case this.dirs.right:
        s = { height: l, width: c, marginTop: (d - l) / 2, marginLeft: (d - l) / 2 };
        break;
      case this.dirs.up:
      case this.dirs.down:
        s = { height: c, width: l, marginTop: (d - l) / 2, marginLeft: (d - l) / 2 };
    }
    return s;
  }, render_line: function(a, r, s, o) {
    var l = this.get_wrapper_sizes(a, s, o), d = document.createElement("div");
    d.style.cssText = ["top:" + l.top + "px", "left:" + l.left + "px", "height:" + l.height + "px", "width:" + l.width + "px"].join(";"), d.className = "gantt_line_wrapper";
    var c = this.get_line_sizes(a, s), u = document.createElement("div");
    return u.style.cssText = ["height:" + c.height + "px", "width:" + c.width + "px", "margin-top:" + c.marginTop + "px", "margin-left:" + c.marginLeft + "px"].join(";"), u.className = "gantt_link_line_" + a.direction, d.appendChild(u), d;
  }, render_corner: function(a, r) {
    const s = a.radius, o = r.$getConfig(), l = o.link_line_width || 2, d = document.createElement("div");
    let c, u;
    return d.classList.add("gantt_link_corner"), d.classList.add(`gantt_link_corner_${a.direction.from}_${a.direction.to}`), d.style.width = `${s}px`, d.style.height = `${s}px`, a.direction.from === "right" && a.direction.to === "down" ? (c = "Right", u = "Top", d.style.left = a.x - o.link_line_width / 2 + "px", d.style.top = `${a.y}px`) : a.direction.from === "down" && a.direction.to === "right" ? (c = "Left", u = "Bottom", d.style.left = a.x - o.link_line_width / 2 + "px", d.style.top = `${a.y}px`) : a.direction.from === "right" && a.direction.to === "up" ? (c = "Right", u = "Bottom", d.style.left = a.x - o.link_line_width / 2 + "px", d.style.top = a.y - s + "px") : a.direction.from === "up" && a.direction.to === "right" ? (c = "Left", u = "Top", d.style.left = a.x - o.link_line_width / 2 + "px", d.style.top = a.y - s + "px") : a.direction.from === "left" && a.direction.to === "down" ? (c = "Left", u = "Top", d.style.left = a.x - s - o.link_line_width / 2 + "px", d.style.top = `${a.y}px`) : a.direction.from === "down" && a.direction.to === "left" ? (c = "Right", u = "Bottom", d.style.left = a.x - s - o.link_line_width / 2 + "px", d.style.top = `${a.y}px`) : a.direction.from === "left" && a.direction.to === "up" ? (c = "Left", u = "Bottom", d.style.left = a.x - s - o.link_line_width / 2 + "px", d.style.top = a.y - s + "px") : a.direction.from === "up" && a.direction.to === "left" && (c = "Right", u = "Top", d.style.left = a.x - s - o.link_line_width / 2 + "px", d.style.top = a.y - s + "px"), d.style[`border${u}Width`] = `${l}px`, d.style[`border${c}Width`] = `${l}px`, d.style[`border${c}Style`] = "solid", d.style[`border${u}Style`] = "solid", d.style[`border${u}${c}Radius`] = `${s}px`, d;
  }, render_arrow(a, r) {
    var s = document.createElement("div"), o = a.y, l = a.x, d = r.link_arrow_size;
    s.style.setProperty("--dhx-gantt-icon-size", `${d}px`);
    var c = "gantt_link_arrow gantt_link_arrow_" + a.direction;
    return s.style.top = o + "px", s.style.left = l + "px", s.className = c, s;
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
    var l = this.get_endpoint(a, r, s, o), d = t.config, c = l.e_y - l.y, u = l.e_x - l.x, h = e.dirs, g = r.getItemHeight(a.source);
    this.clear(), this.point({ x: l.x, y: l.y });
    var f = 2 * d.link_arrow_size, y = this.get_line_type(a, r.$getConfig()), v = l.e_x > l.x;
    if (y.from_start && y.to_start) this.point_to(h.left, f), v ? (this.point_to(h.down, c), this.point_to(h.right, u)) : (this.point_to(h.right, u), this.point_to(h.down, c)), this.point_to(h.right, f);
    else if (!y.from_start && y.to_start) if (c !== 0 && (v = l.e_x > l.x + 2 * f), this.point_to(h.right, f), v) u -= f, this.point_to(h.down, c), this.point_to(h.right, u);
    else {
      u -= 2 * f;
      var b = c > 0 ? 1 : -1;
      this.point_to(h.down, b * (g / 2)), this.point_to(h.right, u), this.point_to(h.down, b * (Math.abs(c) - g / 2)), this.point_to(h.right, f);
    }
    else y.from_start || y.to_start ? y.from_start && !y.to_start && (c !== 0 && (v = l.e_x > l.x - 2 * f), this.point_to(h.left, f), v ? (u += 2 * f, b = c > 0 ? 1 : -1, this.point_to(h.down, b * (g / 2)), this.point_to(h.right, u), this.point_to(h.down, b * (Math.abs(c) - g / 2)), this.point_to(h.left, f)) : (u += f, this.point_to(h.down, c), this.point_to(h.right, u))) : (this.point_to(h.right, f), v ? (this.point_to(h.right, u), this.point_to(h.down, c)) : (this.point_to(h.down, c), this.point_to(h.right, u)), this.point_to(h.left, f));
    return this.path;
  }, get_line_type: function(a, r) {
    var s = r.links, o = !1, l = !1;
    return a.type == s.start_to_start ? o = l = !0 : a.type == s.finish_to_finish ? o = l = !1 : a.type == s.finish_to_start ? (o = !1, l = !0) : a.type == s.start_to_finish ? (o = !0, l = !1) : t.assert(!1, "Invalid link type"), r.rtl && (o = !o, l = !l), { from_start: o, to_start: l };
  }, get_endpoint: function(a, r, s, o) {
    var l = r.$getConfig(), d = this.get_line_type(a, l), c = d.from_start, u = d.to_start, h = i(s, r, l), g = i(o, r, l);
    return { x: c ? h.left : h.left + h.width, e_x: u ? g.left : g.left + g.width, y: h.top + h.rowHeight / 2 - 1, e_y: g.top + g.rowHeight / 2 - 1 };
  } };
  function i(a, r, s) {
    var o = r.getItemPosition(a);
    let l = pi(t, r, a), d = l.maxHeight, c = l.splitChild;
    const u = t.config.baselines && (t.config.baselines.render_mode == "separateRow" || t.config.baselines.render_mode == "individualRow") && a.baselines && a.baselines.length;
    let h;
    l.shrinkHeight && (o.rowHeight = d);
    let g = t.getTaskType(a.type) == s.types.milestone;
    if (g) {
      let f = r.getBarHeight(a.id, !0);
      h = Math.sqrt(2 * f * f), l.shrinkHeight && d < f && (f = d, h = d), o.left -= h / 2, o.width = h;
    }
    if (c) if (d >= o.height) {
      const f = fi(t, a.parent);
      u || f ? g ? (o.rowHeight = o.height + 4, o.left += (o.width - o.rowHeight + 4) / 2, o.width = o.rowHeight - 3) : o.rowHeight = o.height + 6 : g && (o.left += (h - o.height) / 2);
    } else o.rowHeight = d + 2, g && (o.left += (o.width - o.rowHeight + 4) / 2, o.width = o.rowHeight - 3);
    else u && (o.rowHeight = o.height + 4);
    return o;
  }
  return { render: function(a, r, s) {
    var o = t.getTask(a.source);
    if (o.hide_bar) return;
    var l = t.getTask(a.target);
    if (l.hide_bar) return;
    var d = n.get_endpoint(a, r, o, l), c = d.e_y - d.y;
    if (!(d.e_x - d.x) && !c) return null;
    var u = n.get_points(a, r, o, l);
    const h = function(v, b) {
      const _ = b.link_radius || 4, m = b.link_arrow_size || 6, p = [];
      for (let $ = 0; $ < v.length; $++) {
        const w = v[$], x = v[$ + 1];
        if (!x || b.link_radius <= 1) p.push({ type: "line", data: w });
        else if (w.direction !== x.direction) {
          if (w.size < _ || x.size < _) {
            p.push({ type: "line", data: w });
            continue;
          }
          w.size -= _, p.push({ type: "line", data: w });
          let S = w.x, T = w.y - b.link_line_width / 2;
          switch (w.direction) {
            case "right":
              S += w.size;
              break;
            case "left":
              S -= w.size;
              break;
            case "down":
              T += w.size;
              break;
            case "up":
              T -= w.size;
          }
          const E = { x: S, y: T, direction: { from: w.direction, to: x.direction }, radius: _ };
          switch (p.push({ type: "corner", data: E }), x.direction) {
            case "right":
              x.x += _, x.size -= _;
              break;
            case "left":
              x.x -= _, x.size -= _;
              break;
            case "down":
              x.y += _, x.size -= _;
              break;
            case "up":
              x.y -= _, x.size -= _;
          }
        } else p.push({ type: "line", data: w });
      }
      const k = v[v.length - 1];
      if (k.direction === "right" || k.direction === "left") {
        k.size -= 3 * m / 4;
        let $ = k.direction === "right" ? k.x + k.size : k.x - k.size - m / 2, w = k.y - b.link_line_width / 2 - m / 2 + 1;
        k.direction === "left" ? (w -= 1, $ -= 2) : $ -= 1;
        const x = { x: $, y: w, size: m, direction: k.direction };
        p.push({ type: "line", data: k }), p.push({ type: "arrow", data: x });
      } else p.push({ type: "line", data: k });
      return p;
    }(e.get_lines(u, r).filter((v) => v.size > 0), s), g = function(v, b, _, m) {
      const p = document.createElement("div");
      return v.forEach((k) => {
        let $;
        k.type === "line" ? $ = e.render_line(k.data, null, b, _.source) : k.type === "corner" ? $ = e.render_corner(k.data, b) : k.type === "arrow" && ($ = e.render_arrow(k.data, m)), p.appendChild($);
      }), p;
    }(h, r, a, s);
    var f = "gantt_task_link";
    a.color && (f += " gantt_link_inline_color");
    var y = t.templates.link_class ? t.templates.link_class(a) : "";
    return y && (f += " " + y), s.highlight_critical_path && t.isCriticalLink && t.isCriticalLink(a) && (f += " gantt_critical_link"), g.className = f, r.$config.link_attribute && (g.setAttribute(r.$config.link_attribute, a.id), g.setAttribute("link_id", a.id)), a.color && g.style.setProperty("--dhx-gantt-link-background", a.color), t._waiAria.linkAttr(a, g), g;
  }, update: null, isInViewPort: vn, getVisibleRange: mn() };
}
function Pa(t, e, n, i, a) {
  if (a.$ui.getView("grid") && (a.config.keyboard_navigation && a.getSelectedId() || a.ext.inlineEditors && a.ext.inlineEditors.getState().id)) return !!t.$expanded_branch;
  var r = n.getItemTop(t.id), s = n.getItemHeight(t.id);
  return !(r > e.y_end || r + s < e.y);
}
function Ra(t) {
  let e = {};
  return t.$data.tasksStore.attachEvent("onStoreUpdated", function() {
    e = {};
  }), function(n, i, a, r) {
    const s = n.id + "_" + i + "_" + a.unit + "_" + a.step;
    let o;
    return o = e[s] ? e[s] : e[s] = function(l, d, c, u) {
      let h, g = !1, f = {};
      t.config.process_resource_assignments && d === t.config.resource_property ? (h = l.$role == "task" ? t.getResourceAssignments(l.$resource_id, l.$task_id) : t.getResourceAssignments(l.id), g = !0) : h = l.$role == "task" ? [] : t.getTaskBy(d, l.id), f = function(x, S, T) {
        const E = S.unit, C = S.step, D = {}, A = {};
        for (let I = 0; I < x.length; I++) {
          const M = x[I];
          let L = M;
          if (T && (L = t.getTask(M.task_id)), L.unscheduled) continue;
          let P = M.start_date || L.start_date, H = M.end_date || L.end_date;
          T && (M.start_date && (P = new Date(Math.max(M.start_date.valueOf(), L.start_date.valueOf()))), M.end_date && (H = new Date(Math.min(M.end_date.valueOf(), L.end_date.valueOf()))), M.mode && M.mode == "fixedDates" && (P = M.start_date, H = M.end_date));
          let V = At(S.trace_x, P.valueOf()), ht = new Date(S.trace_x[V] || t.date[E + "_start"](new Date(P))), O = new Date(Math.min(P.valueOf(), ht.valueOf())), Z = t.config.work_time ? t.getTaskCalendar(L) : t;
          for (A[Z.id] = {}; O < H; ) {
            const Y = A[Z.id], B = O.valueOf();
            O = t.date.add(O, C, E), Y[B] !== !1 && (D[B] || (D[B] = { tasks: [], assignments: [] }), D[B].tasks.push(L), T && D[B].assignments.push(M));
          }
        }
        return D;
      }(h, c, g);
      const y = c.unit, v = c.step, b = [];
      let _, m, p, k, $;
      const w = u.$getConfig();
      for (let x = 0; x < c.trace_x.length; x++) _ = new Date(c.trace_x[x]), m = t.date.add(_, v, y), $ = f[_.valueOf()] || {}, p = $.tasks || [], k = $.assignments || [], p.length || w.resource_render_empty_cells ? b.push({ start_date: _, end_date: m, tasks: p, assignments: k }) : b.push(null);
      return b;
    }(n, i, a, r), o;
  };
}
const Ha = { init: function(t, e) {
  var n = t.$services.getService("dnd");
  if (e.$config.bind && t.getDatastore(e.$config.bind)) {
    var i = new n(e.$grid_data, { updates_per_second: 60 });
    t.defined(e.$getConfig().dnd_sensitivity) && (i.config.sensitivity = e.$getConfig().dnd_sensitivity), i.attachEvent("onBeforeDragStart", t.bind(function(o, l) {
      var d = a(l);
      if (!d || (t.hideQuickInfo && t.hideQuickInfo(), dt(l.target, ".gantt_grid_editor_placeholder"))) return !1;
      var c = d.getAttribute(e.$config.item_attribute);
      if (s(c)) return !1;
      var u = r().getItem(c);
      return !t.isReadonly(u) && (i.config.initial_open_state = u.$open, !!t.callEvent("onRowDragStart", [c, l.target || l.srcElement, l]) && void 0);
    }, t)), i.attachEvent("onAfterDragStart", t.bind(function(o, l) {
      var d = a(l);
      i.config.marker.innerHTML = d.outerHTML;
      var c = i.config.marker.firstChild;
      c && (c.style.position = "static"), i.config.id = d.getAttribute(e.$config.item_attribute);
      var u = r(), h = u.getItem(i.config.id);
      i.config.index = u.getBranchIndex(i.config.id), i.config.parent = h.parent, h.$open = !1, h.$transparent = !0, this.refreshData();
    }, t)), i.lastTaskOfLevel = function(o) {
      for (var l = null, d = r().getItems(), c = 0, u = d.length; c < u; c++) d[c].$level == o && (l = d[c]);
      return l ? l.id : null;
    }, i._getGridPos = t.bind(function(o) {
      var l = F(e.$grid_data), d = l.x + e.$grid.scrollLeft, c = o.pos.y - 10, u = e.getItemHeight(i.config.id);
      c < l.y && (c = l.y);
      var h = e.getTotalHeight();
      c > l.y + h - u && (c = l.y + h - u);
      const g = l.y + l.height;
      return c > g - u && (c = g - u), l.x = d, l.y = c, l;
    }, t), i._getTargetY = t.bind(function(o) {
      var l = F(e.$grid_data), d = e.$state.scrollTop || 0, c = t.$grid_data.getBoundingClientRect().height + d, u = o.pageY - l.y + d;
      return u > c ? u = c : u < d && (u = d), u;
    }, t), i._getTaskByY = t.bind(function(o, l) {
      var d = r();
      o = o || 0;
      var c = e.getItemIndexByTopPosition(o);
      return (c = l < c ? c - 1 : c) > d.countVisible() - 1 ? null : d.getIdByIndex(c);
    }, t), i.attachEvent("onDragMove", t.bind(function(o, l) {
      var d = t.$grid_data.getBoundingClientRect(), c = d.height + d.y + (e.$state.scrollTop || 0) + window.scrollY, u = i.config, h = i._getGridPos(l);
      t._waiAria.reorderMarkerAttr(u.marker);
      var g = e.$getConfig(), f = r();
      h.y < c ? u.marker.style.top = h.y + "px" : u.marker.style.top = c + "px", u.marker.style.left = h.x + 10 + "px";
      const y = F(t.$root);
      h.width > y.width && (u.marker.style.width = y.width - 10 - 2 + "px", u.marker.style.overflow = "hidden");
      var v = f.getItem(i.config.id), b = i._getTargetY(l), _ = i._getTaskByY(b, f.getIndexById(v.id));
      function m(D, A) {
        return !f.isChildOf(p.id, A.id) && (D.$level == A.$level || g.order_branch_free);
      }
      if (f.exists(_) || (_ = i.lastTaskOfLevel(g.order_branch_free ? v.$level : 0)) == i.config.id && (_ = null), f.exists(_)) {
        var p = f.getItem(_), k = e.getItemTop(p.id), $ = e.getItemHeight(p.id);
        if (k + $ / 2 < b) {
          var w = f.getIndexById(p.id), x = f.getNext(p.id), S = f.getItem(x);
          if (s(x)) {
            var T = f.getPrev(S.id);
            S = f.getItem(T);
          }
          if (S) {
            if (S.id == v.id) return g.order_branch_free && f.isChildOf(v.id, p.id) && f.getChildren(p.id).length == 1 ? void f.move(v.id, f.getBranchIndex(p.id) + 1, f.getParent(p.id)) : void 0;
            p = S;
          } else if (x = f.getIdByIndex(w), S = f.getItem(x), s(x) && (T = f.getPrev(S.id), S = f.getItem(T)), m(S, v) && S.id != v.id) return void f.move(v.id, -1, f.getParent(S.id));
        } else if (g.order_branch_free && p.id != v.id && m(p, v) && !s(p.id)) {
          if (!f.hasChild(p.id)) return p.$open = !0, void f.move(v.id, -1, p.id);
          if (f.getIndexById(p.id) || $ / 3 < b) return;
        }
        w = f.getIndexById(p.id), T = f.getIdByIndex(w - 1);
        for (var E = f.getItem(T), C = 1; (!E || E.id == p.id) && w - C >= 0; ) T = f.getIdByIndex(w - C), E = f.getItem(T), C++;
        if (v.id == p.id || s(p.id)) return;
        m(p, v) && v.id != p.id ? f.move(v.id, 0, 0, p.id) : p.$level != v.$level - 1 || f.getChildren(p.id).length ? E && m(E, v) && v.id != E.id && f.move(v.id, -1, f.getParent(E.id)) : f.move(v.id, 0, p.id);
      }
      return !0;
    }, t)), i.attachEvent("onDragEnd", t.bind(function() {
      var o = r(), l = o.getItem(i.config.id);
      l.$transparent = !1, l.$open = i.config.initial_open_state, this.callEvent("onBeforeRowDragEnd", [i.config.id, i.config.parent, i.config.index]) === !1 ? (o.move(i.config.id, i.config.index, i.config.parent), l.$drop_target = null) : this.callEvent("onRowDragEnd", [i.config.id, l.$drop_target]), t.render(), this.refreshData();
    }, t));
  }
  function a(o) {
    return tt(o, e.$config.item_attribute);
  }
  function r() {
    return t.getDatastore(e.$config.bind);
  }
  function s(o) {
    return Pt(o, t, r());
  }
} }, J = { createDropTargetObject: function(t) {
  var e = { targetParent: null, targetIndex: 0, targetId: null, child: !1, nextSibling: !1, prevSibling: !1 };
  return t && N(e, t, !0), e;
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
  return i.exists(r) ? i.calculateItemLevel(i.getItem(r)) === n ? a ? J.nextSiblingTarget(t, r, i) : J.prevSiblingTarget(t, r, i) : J.firstChildTarget(t, r, i) : null;
}
function re(t, e, n, i) {
  return xn(t, e, n, i, !0);
}
function Ye(t, e, n, i) {
  return xn(t, e, n, i, !1);
}
function Je(t, e, n, i, a, r) {
  var s;
  if (e !== a.$getRootId()) {
    var o = a.getItem(e), l = a.calculateItemLevel(o);
    if (l === r) {
      var d = a.getPrevSibling(e);
      n < 0.5 && !d ? s = J.prevSiblingTarget(t, e, a) : (n < 0.5 && (e = d), s = J.nextSiblingTarget(t, e, a));
    } else if (l > r) a.eachParent(function(f) {
      a.calculateItemLevel(f) === r && (e = f.id);
    }, o), s = re(t, e, r, a);
    else {
      var c = re(t, e, r, a), u = Ye(t, e, r, a);
      s = n < 0.5 ? c : u;
    }
  } else {
    var h = a.$getRootId(), g = a.getChildren(h);
    s = J.createDropTargetObject(), s = g.length && i >= 0 ? re(t, function(f) {
      for (var y = f.getNext(); f.exists(y); ) {
        var v = f.getNext(y);
        if (!f.exists(v)) return y;
        y = v;
      }
      return null;
    }(a), r, a) : Ye(t, h, r, a);
  }
  return s;
}
function Ke(t, e) {
  var n = F(e.$grid_data);
  return t.x += n.x + e.$grid.scrollLeft, t.y += n.y - e.$grid_data.scrollTop, t;
}
function se(t, e, n = 0) {
  const i = F(t.$root);
  return e > i.width && (e = i.width - n - 2), e;
}
const Xe = { removeLineHighlight: function(t) {
  t.markerLine && t.markerLine.parentNode && t.markerLine.parentNode.removeChild(t.markerLine), t.markerLine = null;
}, highlightPosition: function(t, e, n) {
  var i = function(r, s) {
    var o = F(s.$grid_data), l = at(r, s.$grid_data), d = o.x + s.$grid.scrollLeft, c = l.y - 10, u = s.getItemHeight(r.targetId);
    c < o.y && (c = o.y);
    var h = s.getTotalHeight();
    return c > o.y + h - u && (c = o.y + h - u), o.x = d, o.y = c, o.width = se(s.$gantt, o.width, 9), o;
  }(t, n);
  e.marker.style.left = i.x + 9 + "px", e.marker.style.width = i.width + "px", e.marker.style.overflow = "hidden";
  var a = e.markerLine;
  a || ((a = document.createElement("div")).className = "gantt_drag_marker gantt_grid_dnd_marker", a.innerHTML = "<div class='gantt_grid_dnd_marker_line'></div>", a.style.pointerEvents = "none"), t.child ? function(r, s, o) {
    var l = r.targetParent, d = Ke({ x: 0, y: o.getItemTop(l) }, o), c = o.$grid_data.getBoundingClientRect().bottom + window.scrollY;
    let u = se(o.$gantt, o.$grid_data.offsetWidth);
    s.innerHTML = "<div class='gantt_grid_dnd_marker_folder'></div>", s.style.width = u + "px", s.style.top = d.y + "px", s.style.left = d.x + "px", s.style.height = o.getItemHeight(l) + "px", d.y > c && (s.style.top = c + "px");
  }(t, a, n) : function(r, s, o) {
    var l = function(u, h) {
      var g = h.$config.rowStore, f = { x: 0, y: 0 }, y = h.$grid_data.querySelector(".gantt_tree_indent"), v = 15, b = 0;
      y && (v = y.offsetWidth);
      var _ = 40;
      if (u.targetId !== g.$getRootId()) {
        var m = h.getItemTop(u.targetId), p = h.getItemHeight(u.targetId);
        if (b = g.exists(u.targetId) ? g.calculateItemLevel(g.getItem(u.targetId)) : 0, u.prevSibling) f.y = m;
        else if (u.nextSibling) {
          var k = 0;
          g.eachItem(function($) {
            g.getIndexById($.id) !== -1 && k++;
          }, u.targetId), f.y = m + p + k * p;
        } else f.y = m + p, b += 1;
      }
      return f.x = _ + b * v, f.width = se(h.$gantt, Math.max(h.$grid_data.offsetWidth - f.x, 0), f.x), Ke(f, h);
    }(r, o), d = o.$grid_data.getBoundingClientRect().bottom + window.scrollY;
    s.innerHTML = "<div class='gantt_grid_dnd_marker_line'></div>", s.style.left = l.x + "px", s.style.height = "4px";
    var c = l.y - 2;
    s.style.top = c + "px", s.style.width = l.width + "px", c > d && (s.style.top = d + "px");
  }(t, a, n), e.markerLine || (document.body.appendChild(a), e.markerLine = a);
} }, Oa = { init: function(t, e) {
  var n = t.$services.getService("dnd");
  if (e.$config.bind && t.getDatastore(e.$config.bind)) {
    var i = new n(e.$grid_data, { updates_per_second: 60 });
    t.defined(e.$getConfig().dnd_sensitivity) && (i.config.sensitivity = e.$getConfig().dnd_sensitivity), i.attachEvent("onBeforeDragStart", t.bind(function(o, l) {
      var d = a(l);
      if (!d || (t.hideQuickInfo && t.hideQuickInfo(), dt(l.target, ".gantt_grid_editor_placeholder"))) return !1;
      var c = d.getAttribute(e.$config.item_attribute), u = e.$config.rowStore.getItem(c);
      return !t.isReadonly(u) && !r(c) && (i.config.initial_open_state = u.$open, !!t.callEvent("onRowDragStart", [c, l.target || l.srcElement, l]) && void 0);
    }, t)), i.attachEvent("onAfterDragStart", t.bind(function(o, l) {
      var d = a(l);
      i.config.marker.innerHTML = d.outerHTML;
      var c = i.config.marker.firstChild;
      c && (i.config.marker.style.opacity = 0.4, c.style.position = "static", c.style.pointerEvents = "none"), i.config.id = d.getAttribute(e.$config.item_attribute);
      var u = e.$config.rowStore, h = u.getItem(i.config.id);
      i.config.level = u.calculateItemLevel(h), i.config.drop_target = J.createDropTargetObject({ targetParent: u.getParent(h.id), targetIndex: u.getBranchIndex(h.id), targetId: h.id, nextSibling: !0 }), h.$open = !1, h.$transparent = !0, this.refreshData();
    }, t)), i.attachEvent("onDragMove", t.bind(function(o, l) {
      var d = s(l);
      return d && t.callEvent("onBeforeRowDragMove", [i.config.id, d.targetParent, d.targetIndex]) !== !1 || (d = J.createDropTargetObject(i.config.drop_target)), Xe.highlightPosition(d, i.config, e), i.config.drop_target = d, t._waiAria.reorderMarkerAttr(i.config.marker), this.callEvent("onRowDragMove", [i.config.id, d.targetParent, d.targetIndex]), !0;
    }, t)), i.attachEvent("onDragEnd", t.bind(function() {
      var o = e.$config.rowStore, l = o.getItem(i.config.id);
      Xe.removeLineHighlight(i.config), l.$transparent = !1, l.$open = i.config.initial_open_state;
      var d = i.config.drop_target;
      this.callEvent("onBeforeRowDragEnd", [i.config.id, d.targetParent, d.targetIndex]) === !1 ? l.$drop_target = null : (o.move(i.config.id, d.targetIndex, d.targetParent), t.render(), this.callEvent("onRowDragEnd", [i.config.id, d.targetParent, d.targetIndex])), o.refresh(l.id);
    }, t));
  }
  function a(o) {
    return tt(o, e.$config.item_attribute);
  }
  function r(o) {
    return Pt(o, t, t.getDatastore(e.$config.bind));
  }
  function s(o) {
    var l, d = function(f) {
      var y = at(f, e.$grid_data).y, v = e.$config.rowStore;
      document.doctype || (y += window.scrollY), y = y || 0;
      var b = e.$state.scrollTop || 0, _ = t.$grid_data.getBoundingClientRect().height + b + window.scrollY, m = b, p = e.getItemIndexByTopPosition(e.$state.scrollTop);
      if (v.exists(p) || (p = v.countVisible() - 1), p < 0) return v.$getRootId();
      var k = v.getIdByIndex(p), $ = e.$state.scrollTop / e.getItemHeight(k), w = $ - Math.floor($);
      w > 0.1 && w < 0.9 && (_ -= e.getItemHeight(k) * w, m += e.getItemHeight(k) * (1 - w));
      const x = F(e.$grid_data), S = x.y + x.height, T = i.config.marker.offsetHeight;
      y + T + window.scrollY >= _ && (i.config.marker.style.top = S - T + "px"), y >= _ ? y = _ : y <= m && (y = m, i.config.marker.style.top = x.y + "px");
      var E = e.getItemIndexByTopPosition(y);
      if (E > v.countVisible() - 1 || E < 0) return v.$getRootId();
      var C = v.getIdByIndex(E);
      return r(C) ? v.getPrevSibling(C) : v.getIdByIndex(E);
    }(o), c = null, u = e.$config.rowStore, h = !e.$getConfig().order_branch_free, g = at(o, e.$grid_data).y;
    return document.doctype || (g += window.scrollY), d !== u.$getRootId() && (c = (g - e.getItemTop(d)) / e.getItemHeight(d)), h ? (l = Je(i.config.id, d, c, g, u, i.config.level)) && l.targetParent && r(l.targetParent) && (d = u.getPrevSibling(l.targetParent), l = Je(i.config.id, d, c, g, u, i.config.level)) : l = function(f, y, v, b, _) {
      var m;
      if (y !== _.$getRootId()) m = v < 0.25 ? J.prevSiblingTarget(f, y, _) : !(v > 0.6) || _.hasChild(y) && _.getItem(y).$open ? J.firstChildTarget(f, y, _) : J.nextSiblingTarget(f, y, _);
      else {
        var p = _.$getRootId();
        m = _.hasChild(p) && b >= 0 ? J.lastChildTarget(f, p, _) : J.firstChildTarget(f, p, _);
      }
      return m;
    }(i.config.id, d, c, g, u), l;
  }
} };
var Ba = function(t) {
  return { onCreated: function(e) {
    e.$config = N(e.$config, { bind: "task" }), e.$config.id == "grid" && (this.extendGantt(e), t.ext.inlineEditors = t.ext._inlineEditors.createEditors(e), t.ext.inlineEditors.init()), this._mouseDelegates = Se(t);
  }, onInitialized: function(e) {
    var n = e.$getConfig();
    n.order_branch && (n.order_branch == "marker" ? Oa.init(e.$gantt, e) : Ha.init(e.$gantt, e)), this.initEvents(e, t), e.$config.id == "grid" && this.extendDom(e);
  }, onDestroyed: function(e) {
    e.$config.id == "grid" && t.ext.inlineEditors.detachStore(), this.clearEvents(e, t);
  }, initEvents: function(e, n) {
    this._mouseDelegates.delegate("click", "gantt_row", n.bind(function(i, a, r) {
      var s = e.$getConfig();
      if (a !== null) {
        var o = this.getTask(a);
        s.scroll_on_click && !n._is_icon_open_click(i) && this.showDate(o.start_date), n.callEvent("onTaskRowClick", [a, r]);
      }
    }, n), e.$grid), this._mouseDelegates.delegate("click", "gantt_grid_head_cell", n.bind(function(i, a, r) {
      var s = r.getAttribute("data-column-id");
      if (n.callEvent("onGridHeaderClick", [s, i])) {
        var o = e.$getConfig();
        if (s != "add") {
          if (o.sort && s) {
            for (var l, d = s, c = 0; c < o.columns.length; c++) if (o.columns[c].name == s) {
              l = o.columns[c];
              break;
            }
            if (l && l.sort !== void 0 && l.sort !== !0 && !(d = l.sort)) return;
            var u = this._sort && this._sort.direction && this._sort.name == s ? this._sort.direction : "desc";
            u = u == "desc" ? "asc" : "desc", this._sort = { name: s, direction: u }, this.sort(d, u == "desc");
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
const za = { createTaskDND: function() {
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
        for (var l in this._events) for (var d in s) this._events[l][d] = o[l];
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
        var d = i.$getConfig(), c = this._drag_task_coords(s, l);
        l.left ? (s.start_date = a.dateFromPos(c.start + o), s.start_date || (s.start_date = new Date(a.getState().min_date))) : (s.end_date = a.dateFromPos(c.end + o), s.end_date || (s.end_date = new Date(a.getState().max_date)));
        var u = this._calculateMinDuration(d.min_duration, d.duration_unit);
        s.end_date - s.start_date < d.min_duration && (l.left ? s.start_date = a.calculateEndDate(s.end_date, -u, d.duration_unit, s) : s.end_date = a.calculateEndDate(s.start_date, u, d.duration_unit, s)), a._init_task_timing(s);
      }, _calculateMinDuration: function(s, o) {
        return Math.ceil(s / { minute: 6e4, hour: 36e5, day: 864e5, week: 6048e5, month: 24192e5, year: 31356e6 }[o]);
      }, _resize_progress: function(s, o, l) {
        var d = this._drag_task_coords(s, l), c = i.$getConfig().rtl ? d.start - l.pos.x : l.pos.x - d.start, u = Math.max(0, c);
        s.progress = Math.min(1, u / Math.abs(d.end - d.start));
      }, _find_max_shift: function(s, o) {
        var l;
        for (var d in s) {
          var c = s[d], u = a.getTask(c.id), h = this._drag_task_coords(u, c), g = a.posFromDate(new Date(a.getState().min_date)), f = a.posFromDate(new Date(a.getState().max_date));
          if (h.end + o > f) {
            var y = f - h.end;
            (y < l || l === void 0) && (l = y);
          } else if (h.start + o < g) {
            var v = g - h.start;
            (v > l || l === void 0) && (l = v);
          }
        }
        return l;
      }, _move: function(s, o, l, d) {
        var c = this._drag_task_coords(s, l), u = null, h = null;
        d ? (u = new Date(+l.obj.start_date + d), h = new Date(+l.obj.end_date + d)) : (u = a.dateFromPos(c.start + o), h = a.dateFromPos(c.end + o)), u ? h ? (s.start_date = u, s.end_date = h) : (s.end_date = new Date(a.getState().max_date), s.start_date = a.dateFromPos(a.posFromDate(s.end_date) - (c.end - c.start))) : (s.start_date = new Date(a.getState().min_date), s.end_date = a.dateFromPos(a.posFromDate(s.start_date) + (c.end - c.start)));
      }, _drag_task_coords: function(s, o) {
        return { start: o.obj_s_x = o.obj_s_x || a.posFromDate(s.start_date), end: o.obj_e_x = o.obj_e_x || a.posFromDate(s.end_date) };
      }, _mouse_position_change: function(s, o) {
        var l = s.x - o.x, d = s.y - o.y;
        return Math.sqrt(l * l + d * d);
      }, _is_number: function(s) {
        return !isNaN(parseFloat(s)) && isFinite(s);
      }, on_mouse_move: function(s) {
        if (this.drag.start_drag) {
          var o = at(s, a.$task_data), l = this.drag.start_drag.start_x, d = this.drag.start_drag.start_y;
          (Date.now() - this.drag.timestamp > 50 || this._is_number(l) && this._is_number(d) && this._mouse_position_change({ x: l, y: d }, o) > 20) && this._start_dnd(s);
        }
        if (this.drag.mode) {
          if (!cn(this, 40)) return;
          this._update_on_move(s);
        }
      }, _update_item_on_move: function(s, o, l, d, c, u) {
        var h = a.getTask(o), g = a.mixin({}, h), f = a.mixin({}, h);
        this._handlers[l].apply(this, [f, s, d, u]), a.mixin(h, f, !0), a.callEvent("onTaskDrag", [h.id, l, f, g, c]), a.mixin(h, f, !0), a.refreshTask(o);
      }, _update_on_move: function(s) {
        var o = this.drag, l = i.$getConfig();
        if (o.mode) {
          var d = at(s, i.$task_data);
          if (o.pos && o.pos.x == d.x) return;
          o.pos = d;
          var c = a.dateFromPos(d.x);
          if (!c || isNaN(c.getTime())) return;
          var u = d.x - o.start_x, h = a.getTask(o.id);
          if (this._handlers[o.mode]) {
            if (o.mode === l.drag_mode.move) {
              var g = {};
              this._isMultiselect() && a.getSelectedTasks().indexOf(o.id) >= 0 && (g = this.dragMultiple);
              var f = !1;
              if (a.isSummaryTask(h) && a.config.drag_project) {
                var y = {};
                y[o.id] = q(o), f = !0, g = N(y, this.dragMultiple);
              }
              var v = this._find_max_shift(g, u);
              let m;
              if (v !== void 0 && (u = v), this._update_item_on_move(u, o.id, o.mode, o, s), v === void 0) {
                const p = a.posFromDate(o.obj.start_date), k = a.posFromDate(o.obj.end_date);
                if (o.handle_offset === void 0) {
                  const w = k - p, x = o.start_x - p;
                  o.handle_offset = x / w;
                }
                let $ = p + Math.abs(k - p) * o.handle_offset;
                m = c - a.dateFromPos($);
              }
              for (var b in g) {
                var _ = g[b];
                f && _.id != o.id && (a._bulk_dnd = !0), this._update_item_on_move(u, _.id, _.mode, _, s, m);
              }
              a._bulk_dnd = !1;
            } else this._update_item_on_move(u, o.id, o.mode, o, s);
            a._update_parents(o.id);
          }
        }
      }, on_mouse_down: function(s, o) {
        if (s.button != 2 || s.button === void 0) {
          var l = i.$getConfig(), d = a.locate(s), c = null;
          if (a.isTaskExists(d) && (c = a.getTask(d)), !a.isReadonly(c) && !this.drag.mode) {
            this.clear_drag_state();
            var u = K(o = o || s.target || s.srcElement), h = this._get_drag_mode(u, o);
            if (!u || !h) return o.parentNode ? this.on_mouse_down(s, o.parentNode) : void 0;
            if (h) if (h.mode && h.mode != l.drag_mode.ignore && l["drag_" + h.mode]) {
              if (d = a.locate(o), c = a.copy(a.getTask(d) || {}), a.isReadonly(c)) return this.clear_drag_state(), !1;
              if (a.isSummaryTask(c) && c.auto_scheduling !== !1 && !l.drag_project && h.mode != l.drag_mode.progress) return void this.clear_drag_state();
              h.id = d;
              var g = at(s, a.$task_data);
              h.start_x = g.x, h.start_y = g.y, h.obj = c, this.drag.start_drag = h, this.drag.timestamp = Date.now();
            } else this.clear_drag_state();
            else if (a.checkEvent("onMouseDown") && a.callEvent("onMouseDown", [u.split(" ")[0]]) && o.parentNode) return this.on_mouse_down(s, o.parentNode);
          }
        }
      }, _fix_dnd_scale_time: function(s, o) {
        var l = i.$getConfig(), d = a.getScale().unit, c = a.getScale().step;
        function u(h) {
          if (a.config.correct_work_time) {
            var g = i.$getConfig();
            a.isWorkTime(h.start_date, void 0, h) || (h.start_date = a.calculateEndDate({ start_date: h.start_date, duration: -1, unit: g.duration_unit, task: h }));
          }
        }
        l.round_dnd_dates || (d = "minute", c = l.time_step), o.mode == l.drag_mode.resize ? o.left ? (s.start_date = a.roundDate({ date: s.start_date, unit: d, step: c }), u(s)) : (s.end_date = a.roundDate({ date: s.end_date, unit: d, step: c }), function(h) {
          if (a.config.correct_work_time) {
            var g = i.$getConfig();
            a.isWorkTime(new Date(h.end_date - 1), void 0, h) || (h.end_date = a.calculateEndDate({ start_date: h.end_date, duration: 1, unit: g.duration_unit, task: h }));
          }
        }(s)) : o.mode == l.drag_mode.move && (s.start_date = a.roundDate({ date: s.start_date, unit: d, step: c }), u(s), s.end_date = a.calculateEndDate(s));
      }, _fix_working_times: function(s, o) {
        var l = i.$getConfig();
        (o = o || { mode: l.drag_mode.move }).mode == l.drag_mode.resize ? o.left ? s.start_date = a.getClosestWorkTime({ date: s.start_date, dir: "future", task: s }) : s.end_date = a.getClosestWorkTime({ date: s.end_date, dir: "past", task: s }) : o.mode == l.drag_mode.move && a.correctTaskWorkTime(s);
      }, _finalize_mouse_up: function(s, o, l, d) {
        var c = a.getTask(s);
        if (o.work_time && o.correct_work_time && this._fix_working_times(c, l), this._fix_dnd_scale_time(c, l), this._fireEvent("before_finish", l.mode, [s, l.mode, a.copy(l.obj), d])) {
          var u = s;
          a._init_task_timing(c), this.clear_drag_state(), a.updateTask(c.id), this._fireEvent("after_finish", l.mode, [u, l.mode, d]);
        } else this.clear_drag_state(), s == l.id && (l.obj._dhx_changed = !1, a.mixin(c, l.obj, !0)), a.refreshTask(c.id);
      }, on_mouse_up: function(s) {
        var o = this.drag;
        if (o.mode && o.id) {
          var l = i.$getConfig(), d = a.getTask(o.id), c = this.dragMultiple, u = !1, h = 0;
          o.mode === l.drag_mode.move && (a.isSummaryTask(d) && l.drag_project || this._isMultiselect()) && (u = !0, h = Object.keys(c).length);
          var g = function() {
            if (u) for (var f in c) c[f].id != o.id && this._finalize_mouse_up(c[f].id, l, c[f], s);
            this._finalize_mouse_up(o.id, l, o, s);
          };
          u && h > 10 ? a.batchUpdate((function() {
            g.call(this);
          }).bind(this)) : g.call(this);
        }
        this.clear_drag_state();
      }, _get_drag_mode: function(s, o) {
        var l = i.$getConfig().drag_mode, d = { mode: null, left: null };
        switch ((s || "").split(" ")[0]) {
          case "gantt_task_line":
          case "gantt_task_content":
            d.mode = l.move;
            break;
          case "gantt_task_drag":
            d.mode = l.resize;
            var c = o.getAttribute("data-bind-property");
            d.left = c == "start_date";
            break;
          case "gantt_task_progress_drag":
            d.mode = l.progress;
            break;
          case "gantt_link_control":
          case "gantt_link_point":
            d.mode = l.ignore;
            break;
          default:
            d = null;
        }
        return d;
      }, _start_dnd: function(s) {
        var o = this.drag = this.drag.start_drag;
        delete o.start_drag;
        var l = i.$getConfig(), d = o.id;
        if (l["drag_" + o.mode] && a.callEvent("onBeforeDrag", [d, o.mode, s]) && this._fireEvent("before_start", o.mode, [d, o.mode, s])) {
          delete o.start_drag;
          var c = a.getTask(d);
          if (a.isReadonly(c)) return void this.clear_drag_state();
          if (this._isMultiselect()) {
            var u = a.getSelectedTasks();
            u.indexOf(o.id) >= 0 && kt(u, a.bind(function(h) {
              var g = a.getTask(h);
              a.isSummaryTask(g) && a.config.drag_project && o.mode == l.drag_mode.move && this._addSubtasksToDragMultiple(g.id), this.dragMultiple[h] = a.mixin({ id: g.id, obj: a.copy(g) }, this.drag);
            }, this));
          }
          a.isSummaryTask(c) && a.config.drag_project && o.mode == l.drag_mode.move && this._addSubtasksToDragMultiple(c.id), a.callEvent("onTaskDragStart", []);
        } else this.clear_drag_state();
      }, _fireEvent: function(s, o, l) {
        a.assert(this._events[s], "Invalid stage:{" + s + "}");
        var d = this._events[s][o];
        return a.assert(d, "Unknown after drop mode:{" + o + "}"), a.assert(l, "Invalid event arguments"), !a.checkEvent(d) || a.callEvent(d, l);
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
var Wa = function(t, e) {
  var n, i, a, r, s;
  function o() {
    return { link_source_id: r, link_target_id: i, link_from_start: s, link_to_start: a, link_landing_area: n };
  }
  var l = e.$services, d = l.getService("state"), c = l.getService("dnd");
  d.registerProvider("linksDnD", o);
  var u = "gantt_link_point", h = "gantt_link_control", g = new c(t.$task_bars, { sensitivity: 0, updates_per_second: 60, mousemoveContainer: e.$root, selector: "." + u, preventDefault: !0 });
  function f(m, p) {
    var k, $ = g.getPosition(m), w = function(A) {
      var I = 0, M = 0;
      return A && (I = A.offsetWidth || 0, M = A.offsetHeight || 0), { width: I, height: M };
    }(p), x = { right: (k = e.$root).offsetWidth, bottom: k.offsetHeight }, S = e.config.tooltip_offset_x || 10, T = e.config.tooltip_offset_y || 10, E = e.config.scroll_size || 18, C = e.$container.getBoundingClientRect().y + window.scrollY, D = { y: $.y + T, x: $.x + S, bottom: $.y + w.height + T + E, right: $.x + w.width + S + E };
    return D.bottom > x.bottom + C && (D.y = x.bottom + C - w.height - T), D.right > x.right && (D.x = x.right - w.width - S), D;
  }
  function y(m) {
    var p = o();
    p.link_source_id && p.link_target_id && e.isLinkAllowed(p.link_source_id, p.link_target_id, p.link_from_start, p.link_to_start);
    var k = "<div class='" + e.templates.drag_link_class(p.link_source_id, p.link_from_start, p.link_target_id, p.link_to_start) + "'>" + e.templates.drag_link(p.link_source_id, p.link_from_start, p.link_target_id, p.link_to_start) + "</div>";
    m.innerHTML = k;
  }
  function v() {
    r = s = i = null, a = !0;
  }
  function b(m, p, k, $) {
    var w = function() {
      return g._direction && g._direction.parentNode || (g._direction = document.createElement("div"), t.$task_links.appendChild(g._direction)), g._direction;
    }(), x = o(), S = ["gantt_link_direction"];
    e.templates.link_direction_class && S.push(e.templates.link_direction_class(x.link_source_id, x.link_from_start, x.link_target_id, x.link_to_start));
    var T = Math.sqrt(Math.pow(k - m, 2) + Math.pow($ - p, 2));
    if (T = Math.max(0, T - 3)) {
      w.className = S.join(" ");
      var E = ($ - p) / (k - m), C = Math.atan(E);
      _(m, k, p, $) == 2 ? C += Math.PI : _(m, k, p, $) == 3 && (C -= Math.PI);
      var D = Math.sin(C), A = Math.cos(C), I = Math.round(p), M = Math.round(m), L = ["-webkit-transform: rotate(" + C + "rad)", "-moz-transform: rotate(" + C + "rad)", "-ms-transform: rotate(" + C + "rad)", "-o-transform: rotate(" + C + "rad)", "transform: rotate(" + C + "rad)", "width:" + Math.round(T) + "px"];
      if (window.navigator.userAgent.indexOf("MSIE 8.0") != -1) {
        L.push('-ms-filter: "' + function(V, ht) {
          return "progid:DXImageTransform.Microsoft.Matrix(M11 = " + ht + ",M12 = -" + V + ",M21 = " + V + ",M22 = " + ht + ",SizingMethod = 'auto expand')";
        }(D, A) + '"');
        var P = Math.abs(Math.round(m - k)), H = Math.abs(Math.round($ - p));
        switch (_(m, k, p, $)) {
          case 1:
            I -= H;
            break;
          case 2:
            M -= P, I -= H;
            break;
          case 3:
            M -= P;
        }
      }
      L.push("top:" + I + "px"), L.push("left:" + M + "px"), w.style.cssText = L.join(";");
    }
  }
  function _(m, p, k, $) {
    return p >= m ? $ <= k ? 1 : 4 : $ <= k ? 2 : 3;
  }
  g.attachEvent("onBeforeDragStart", e.bind(function(m, p) {
    var k = p.target || p.srcElement;
    if (v(), e.getState("tasksDnd").drag_id) return !1;
    if (pt(k, u)) {
      pt(k, "task_start_date") && (s = !0);
      var $ = e.locate(p);
      r = $;
      var w = e.getTask($);
      return e.isReadonly(w) ? (v(), !1) : (this._dir_start = { x: g.config.original_element_sizes.x + g.config.original_element_sizes.width / 2, y: g.config.original_element_sizes.y + g.config.original_element_sizes.height / 2 }, !0);
    }
    return !1;
  }, this)), g.attachEvent("onAfterDragStart", e.bind(function(m, p) {
    e.config.touch && e.refreshData(), y(g.config.marker);
  }, this)), g.attachEvent("onDragMove", e.bind(function(m, p) {
    var k = g.config, $ = f(p, k.marker);
    (function(A, I) {
      A.style.left = I.x + "px", A.style.top = I.y + "px";
    })(k.marker, $);
    var w = !!pt(p, h), x = i, S = n, T = a, E = e.locate(p), C = !0;
    if (G(yt(p), e.$root) || (w = !1, E = null), w && (C = !pt(p, "task_end_date"), w = !!E), i = E, n = w, a = C, w) {
      const A = pt(p, h).querySelector(`.${u}`);
      if (A) {
        const I = nn(A, t.$task_bg);
        this._dir_end = { x: I.x + A.offsetWidth / 2, y: I.y + A.offsetHeight / 2 };
      }
    } else this._dir_end = at(p, t.$task_data), e.env.isEdge && (this._dir_end.y += window.scrollY);
    var D = !(S == w && x == E && T == C);
    return D && (x && e.refreshTask(x, !1), E && e.refreshTask(E, !1)), D && y(k.marker), b(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y), !0;
  }, this)), g.attachEvent("onDragEnd", e.bind(function() {
    var m = o();
    if (m.link_source_id && m.link_target_id && m.link_source_id != m.link_target_id) {
      var p = e._get_link_type(m.link_from_start, m.link_to_start), k = { source: m.link_source_id, target: m.link_target_id, type: p };
      k.type && e.isLinkAllowed(k) && e.callEvent("onLinkCreated", [k]) && e.addLink(k);
    }
    v(), e.config.touch ? e.refreshData() : (m.link_source_id && e.refreshTask(m.link_source_id, !1), m.link_target_id && e.refreshTask(m.link_target_id, !1)), g._direction && (g._direction.parentNode && g._direction.parentNode.removeChild(g._direction), g._direction = null);
  }, this)), e.attachEvent("onGanttRender", e.bind(function() {
    g._direction && b(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y);
  }, this));
};
const ja = function() {
  return { init: Wa };
};
var Fa = function(t) {
  var e = t.$services;
  return { onCreated: function(n) {
    var i = n.$config;
    i.bind = W(i.bind) ? i.bind : "task", i.bindLinks = W(i.bindLinks) ? i.bindLinks : "link", n._linksDnD = ja(), n._tasksDnD = za.createTaskDND(), n._tasksDnD.extend(n), this._mouseDelegates = Se(t);
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
          n._simple_confirm(o, "", function() {
            n.deleteLink(a);
          });
        }, this.config.touch ? 300 : 1);
      }
    }
    this._mouseDelegates.delegate("click", "gantt_task_link", n.bind(function(a, r) {
      var s = this.locate(a, this.config.link_attribute);
      s && this.callEvent("onLinkClick", [s, a]);
    }, n), this.$task), this._mouseDelegates.delegate("click", "gantt_scale_cell", n.bind(function(a, r) {
      var s = at(a, n.$task_data), o = n.dateFromPos(s.x), l = Math.floor(n.columnIndexByDate(o)), d = n.getScale().trace_x[l];
      n.callEvent("onScaleClick", [a, d]);
    }, n), this.$task), this._mouseDelegates.delegate("doubleclick", "gantt_task_link", n.bind(function(a, r, s) {
      r = this.locate(a, n.config.link_attribute), i.call(this, r, a);
    }, n), this.$task), this._mouseDelegates.delegate("doubleclick", "gantt_link_point", n.bind(function(a, r, s) {
      r = this.locate(a);
      var o = this.getTask(r), l = null;
      return s.parentNode && K(s.parentNode) && (l = K(s.parentNode).indexOf("_left") > -1 ? o.$target[0] : o.$source[0]), l && i.call(this, l, a), !1;
    }, n), this.$task);
  }, _attachStateProvider: function(n, i) {
    var a = i;
    e.getService("state").registerProvider("tasksTimeline", function() {
      return { scale_unit: a._tasks ? a._tasks.unit : void 0, scale_step: a._tasks ? a._tasks.step : void 0 };
    });
  }, _clearStateProvider: function() {
    e.getService("state").unregisterProvider("tasksTimeline");
  } };
}, Va = function(t) {
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
              var l = a.$gantt.$layout.$container.offsetWidth, d = t.$ui.getView(a.$config.scrollY).$config.width, c = l - (a.$config.width + d) - 4;
              c < 0 && (a.$config.width += c, t.config.grid_width += c);
            }
            if (n) a.$parent.$config.width = t.config.grid_width, a.$parent.$config.group && t.$layout._syncCellSizes(a.$parent.$config.group, { value: a.$parent.$config.width, isGravity: !1 });
            else if (i && !G(i.$task, e.$view)) {
              if (!a.$config.original_grid_width) {
                var u = t.skins[t.skin];
                u && u.config && u.config.grid_width ? a.$config.original_grid_width = u.config.grid_width : a.$config.original_grid_width = 0;
              }
              t.config.grid_width = a.$config.original_grid_width, a.$parent.$config.width = t.config.grid_width;
            } else a.$parent._setContentSize(a.$config.width, null), t.$layout._syncCellSizes(a.$parent.$config.group, { value: t.config.grid_width, isGravity: !1 });
          } else i && G(i.$task, e.$view) && (a.$config.original_grid_width = t.config.grid_width), n || (a.$parent.$config.width = 0);
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
      var l = o._behind, d = o._front;
      if (l && l.$content === n || l.isChild && l.isChild(n)) {
        i = o, r = !0;
        break;
      }
      if (d && d.$content === n || d.isChild && d.isChild(n)) {
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
        var d = t.$ui.getView("grid"), c = d ? d.$parent : null;
        if (c) {
          var u = d._getGridWidthLimits();
          d.$config.scrollable || (c.$config.minWidth = u[0]), c.$config.maxWidth = u[1];
        }
        return a = r ? o : l, t.callEvent("onGridResizeStart", [a]);
      }), s.attachEvent("onResize", function(o, l) {
        var d = r ? o : l;
        return t.callEvent("onGridResize", [a, d]);
      }), s.attachEvent("onResizeEnd", function(o, l, d, c) {
        var u = r ? o : l, h = r ? d : c, g = t.$ui.getView("grid"), f = g ? g.$parent : null;
        f && (f.$config.minWidth = void 0);
        var y = t.callEvent("onGridResizeEnd", [u, h]);
        return y && h !== 0 && (t.config.grid_width = h), y;
      });
    }
  }, onDestroyed: function(e) {
  } };
};
const Ua = { init: function(t) {
  function e(r, s) {
    var o = s(t);
    o.onCreated && o.onCreated(r), r.attachEvent("onReady", function() {
      o.onInitialized && o.onInitialized(r);
    }), r.attachEvent("onDestroy", function() {
      o.onDestroyed && o.onDestroyed(r);
    });
  }
  var n = ua(t);
  n.registerView("cell", Rt), n.registerView("resizer", null), n.registerView("scrollbar", va), n.registerView("layout", kn, function(r) {
    (r.$config ? r.$config.id : null) === "main" && e(r, Va);
  }), n.registerView("viewcell", ma), n.registerView("multiview", pa), n.registerView("timeline", Vt, function(r) {
    (r.$config ? r.$config.id : null) !== "timeline" && r.$config.bind != "task" || e(r, Fa);
  }), n.registerView("grid", ke, function(r) {
    (r.$config ? r.$config.id : null) !== "grid" && r.$config.bind != "task" || e(r, Ba);
  }), n.registerView("resourceGrid", ke), n.registerView("resourceTimeline", Vt), n.registerView("resourceHistogram", Vt);
  var i = function(r) {
    var s = ga(r);
    return { getDataRender: function(o) {
      return r.$services.getService("layer:" + o) || null;
    }, createDataRender: function(o) {
      var l = o.name, d = o.defaultContainer, c = o.defaultContainerSibling, u = s.createGroup(d, c, function(h, g) {
        if (!u.filters) return !0;
        for (var f = 0; f < u.filters.length; f++) if (u.filters[f](h, g) === !1) return !1;
      }, fa);
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
      }, filter: function(d) {
      } }, r), l = this.createDataRender({ name: "link", defaultContainer: function() {
        return r.$task_data ? r.$task_data : r.$ui.getView("timeline") ? r.$ui.getView("timeline").$task_data : void 0;
      } }, r);
      return { addTaskLayer: function(d) {
        const c = ft;
        return typeof d == "function" ? d = { renderer: { render: d, getVisibleRange: c } } : d.renderer && !d.renderer.getVisibleRange && (d.renderer.getVisibleRange = c), d.view = "timeline", o.addLayer(d);
      }, _getTaskLayers: function() {
        return o.getLayers();
      }, removeTaskLayer: function(d) {
        o.removeLayer(d);
      }, _clearTaskLayers: function() {
        o.clear();
      }, addLinkLayer: function(d) {
        const c = mn();
        return typeof d == "function" ? d = { renderer: { render: d, getVisibleRange: c } } : d.renderer && !d.renderer.getVisibleRange && (d.renderer.getVisibleRange = c), d.view = "timeline", d && d.renderer && (d.renderer.getRectangle || d.renderer.isInViewPort || (d.renderer.isInViewPort = vn)), l.addLayer(d);
      }, _getLinkLayers: function() {
        return l.getLayers();
      }, removeLinkLayer: function(d) {
        l.removeLayer(d);
      }, _clearLinkLayers: function() {
        l.clear();
      } };
    } };
  }(t), a = Ma(t);
  return t.ext.inlineEditors = a, t.ext._inlineEditors = a, a.init(t), { factory: n, mouseEvents: _a.init(t), layersApi: i.init(), render: { gridLine: function() {
    return /* @__PURE__ */ function(r) {
      return { render: function(s, o, l, d) {
        for (var c = o.getGridColumns(), u = o.$getTemplates(), h = o.$config.rowStore, g = [], f = 0; f < c.length; f++) {
          var y, v, b, _ = f == c.length - 1, m = c[f];
          m.name == "add" ? (v = "<div " + (S = r._waiAria.gridAddButtonAttrString(m)) + " class='gantt_add'></div>", b = "") : (X(v = m.template ? m.template(s) : s[m.name]) && (v = u.date_grid(v, s, m.name)), v == null && (v = ""), b = v, v = "<div class='gantt_tree_content'>" + v + "</div>");
          var p = "gantt_cell" + (_ ? " gantt_last_cell" : ""), k = [];
          if (m.tree) {
            p += " gantt_cell_tree";
            for (var $ = 0; $ < s.$level; $++) k.push(u.grid_indent(s));
            !h.hasChild(s.id) || r.isSplitTask(s) && !r.config.open_split_tasks ? (k.push(u.grid_blank(s)), k.push(u.grid_file(s))) : (k.push(u.grid_open(s)), k.push(u.grid_folder(s)));
          }
          var w = "width:" + (m.width - (_ ? 1 : 0)) + "px;";
          if (this.defined(m.align)) {
            var x = { right: "flex-end", left: "flex-start", center: "center" }[m.align];
            w += "text-align:" + m.align + ";justify-content:" + x + ";";
          }
          var S = r._waiAria.gridCellAttrString(m, b, s);
          k.push(v), y = "<div class='" + p + "' data-column-index='" + f + "' data-column-name='" + m.name + "' style='" + w + "' " + S + ">" + k.join("") + "</div>", g.push(y);
        }
        switch (p = "", h.$config.name) {
          case "task":
            p = r.getGlobalTaskIndex(s.id) % 2 == 0 ? "" : " odd";
            break;
          case "resource":
            p = h.visibleOrder.indexOf(s.id) % 2 == 0 ? "" : " odd";
        }
        if (p += s.$transparent ? " gantt_transparent" : "", p += s.$dataprocessor_class ? " " + s.$dataprocessor_class : "", u.grid_row_class) {
          var T = u.grid_row_class.call(r, s.start_date, s.end_date, s);
          T && (p += " " + T);
        }
        h.isSelected(s.id) && (p += " gantt_selected");
        var E = document.createElement("div");
        E.className = "gantt_row" + p + " gantt_row_" + r.getTaskType(s.type);
        var C = o.getItemHeight(s.id);
        return E.style.height = C + "px", E.style.lineHeight = C + "px", l.smart_rendering && (E.style.position = "absolute", E.style.left = "0px", E.style.top = o.getItemTop(s.id) + "px"), o.$config.item_attribute && (E.setAttribute(o.$config.item_attribute, s.id), E.setAttribute(o.$config.bind + "_id", s.id)), r._waiAria.taskRowAttr(s, E), E.innerHTML = g.join(""), E;
      }, update: null, getRectangle: Yt, isInViewPort: Pa, getVisibleRange: ft, onrender: function(s, o, l) {
        for (var d = l.getGridColumns(), c = 0; c < d.length; c++) {
          var u = d[c];
          if (u.onrender) {
            var h = o.querySelector("[data-column-name=" + u.name + "]");
            if (h) {
              var g = u.onrender(s, h);
              if (g && typeof g == "string") h.innerHTML = g;
              else if (g && typeof g == "object" && r.config.external_render) {
                var f = r.config.external_render;
                f.isElement(g) && f.renderElement(g, h);
              }
            }
          }
        }
      } };
    }(t);
  }, taskBg: function() {
    return /* @__PURE__ */ function(r) {
      var s = {}, o = {};
      function l(g, f) {
        return !(!s[g.id][f] || !s[g.id][f].parentNode);
      }
      function d(g, f) {
        s[g] && s[g][f] && s[g][f].parentNode && s[g][f].parentNode.removeChild(s[g][f]);
      }
      function c(g) {
        var f, y = g.$getTemplates();
        return y.task_cell_class !== void 0 ? (f = y.task_cell_class, (console.warn || console.log)("gantt.templates.task_cell_class template is deprecated and will be removed soon. Please use gantt.templates.timeline_cell_class instead.")) : f = y.timeline_cell_class, f;
      }
      function u(g) {
        return g.$getTemplates().timeline_cell_content;
      }
      function h(g, f, y, v, b, _, m, p) {
        var k = g.width[f], $ = "";
        if (ae(f, g, v, r)) {
          var w = _(y, g.trace_x[f]), x = "";
          if (m && (x = m(y, g.trace_x[f])), p.static_background) {
            var S = !(!w && !x);
            if (!p.static_background_cells || !S) return null;
          }
          if (s[y.id][f]) return o[y.id][f] = f, s[y.id][f];
          var T = document.createElement("div");
          return T.style.width = k + "px", $ = "gantt_task_cell" + (f == b - 1 ? " gantt_last_cell" : ""), w && ($ += " " + w), T.className = $, x && (T.innerHTML = x), T.style.position = "absolute", T.style.left = g.left[f] + "px", s[y.id][f] = T, o[y.id][f] = f, T;
        }
        return null;
      }
      return { render: function(g, f, y, v) {
        var b = f.$getTemplates(), _ = f.getScale(), m = _.count;
        if (y.static_background && !y.static_background_cells) return null;
        var p, k = document.createElement("div"), $ = c(f), w = u(f);
        if (p = v && y.smart_rendering && !Nt(r) ? Wt(_, v.x) : { start: 0, end: m - 1 }, y.show_task_cells) {
          s[g.id] = {}, o[g.id] = {};
          for (var x = p.start; x <= p.end; x++) {
            var S = h(_, x, g, v, m, $, w, y);
            S && k.appendChild(S);
          }
        }
        const T = f.$config.rowStore, E = T.getIndexById(g.id) % 2 != 0;
        var C = b.task_row_class(g.start_date, g.end_date, g), D = "gantt_task_row" + (E ? " odd" : "") + (C ? " " + C : "");
        if (T.isSelected(g.id) && (D += " gantt_selected"), k.className = D, y.smart_rendering ? (k.style.position = "absolute", k.style.top = f.getItemTop(g.id) + "px", k.style.width = "100%") : k.style.position = "relative", k.style.height = f.getItemHeight(g.id) + "px", g.id == "timeline_placeholder_task") {
          var A = 0;
          g.lastTaskId && (A = f.getItemTop(g.lastTaskId) + f.getItemHeight(g.lastTaskId));
          var I = (g.row_height || f.$task_data.offsetHeight) - A;
          I < 0 && (I = 0), y.smart_rendering && (k.style.top = A + "px"), k.style.height = I + "px";
        }
        return f.$config.item_attribute && (k.setAttribute(f.$config.item_attribute, g.id), k.setAttribute(f.$config.bind + "_id", g.id)), k;
      }, update: function(g, f, y, v, b) {
        var _ = y.getScale(), m = _.count, p = c(y), k = u(y);
        if (v.show_task_cells) {
          s[g.id] || (s[g.id] = {}), o[g.id] || (o[g.id] = {});
          var $ = Wt(_, b);
          for (var w in o[g.id]) {
            var x = o[g.id][w];
            (Number(x) < $.start || Number(x) > $.end) && d(g.id, x);
          }
          o[g.id] = {};
          for (var S = $.start; S <= $.end; S++) {
            var T = h(_, S, g, b, m, p, k, v);
            !T && l(g, S) ? d(g.id, S) : T && !T.parentNode && f.appendChild(T);
          }
        }
      }, getRectangle: Ge, getVisibleRange: ft, prepareData: Na };
    }(t);
  }, taskBar: function() {
    return qe(t);
  }, timedProjectBar: function() {
    return qe(t);
  }, taskRollupBar: function() {
    return function(r) {
      const s = bn(r), o = {};
      function l(u, h, g, f, y) {
        let v = !0;
        return f.smart_rendering && (v = ye(u, h, g)), v;
      }
      function d(u, h, g, f) {
        const y = r.copy(r.getTask(h.id));
        if (y.$rendered_at = u.id, r.callEvent("onBeforeRollupTaskDisplay", [y.id, y, u.id]) === !1) return;
        const v = s(y, g);
        if (!v) return;
        const b = g.getBarHeight(u.id, h.type == r.config.types.milestone), _ = Math.floor((g.getItemHeight(u.id) - b) / 2);
        return v.style.top = f.top + _ + "px", v.classList.add("gantt_rollup_child"), v.setAttribute("data-rollup-parent-id", u.id), v;
      }
      function c(u, h) {
        return u + "_" + h;
      }
      return { render: function(u, h, g, f) {
        if (u.rollup !== !1 && u.$rollup && u.$rollup.length) {
          const y = document.createElement("div"), v = r.getTaskPosition(u);
          return f && (f.y = 0, f.y_end = r.$task_bg.scrollHeight), u.$rollup.forEach(function(b) {
            if (!r.isTaskExists(b)) return;
            const _ = r.getTask(b);
            if (!l(_, f, h, g)) return;
            const m = d(u, _, h, v);
            m ? (o[c(_.id, u.id)] = m, y.appendChild(m)) : o[c(_.id, u.id)] = !1;
          }), y;
        }
        return !1;
      }, update: function(u, h, g, f, y) {
        const v = document.createElement("div"), b = r.getTaskPosition(u);
        y.y = 0, y.y_end = r.$task_bg.scrollHeight, u.$rollup.forEach(function(_) {
          const m = r.getTask(_), p = c(m.id, u.id);
          let k = l(m, y, g, f);
          if (k !== !!o[p]) if (k) {
            const $ = d(u, m, g, b);
            o[p] = $ || !1;
          } else o[p] = !1;
          o[p] && v.appendChild(o[p]), h.innerHTML = "", h.appendChild(v);
        });
      }, isInViewPort: ye, getVisibleRange: ft };
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
    return La(t);
  }, resourceRow: function() {
    return function(r) {
      var s = Ra(r), o = {};
      function l(c, u, h, g, f) {
        var y = h.resource_cell_class(u.start_date, u.end_date, c, u.tasks, u.assignments), v = h.resource_cell_value(u.start_date, u.end_date, c, u.tasks, u.assignments), b = f.getItemHeight(c.id) - 1;
        if (y || v) {
          var _ = f.getItemPosition(c, u.start_date, u.end_date), m = document.createElement("div");
          return m.setAttribute(f.$config.item_attribute, c.id), m.className = ["gantt_resource_marker", y].join(" "), m.style.cssText = ["left:" + _.left + "px", "width:" + _.width + "px", "height:" + b + "px", "line-height:" + b + "px", "top:" + _.top + "px"].join(";"), v && (m.innerHTML = v), m;
        }
        return null;
      }
      function d(c, u) {
        o[c] && o[c][u] && o[c][u].parentNode && o[c][u].parentNode.removeChild(o[c][u]);
      }
      return { render: function(c, u, h, g) {
        var f = u.$getTemplates(), y = u.getScale(), v = s(c, h.resource_property, u.getScale(), u), b = !!g, _ = [];
        o[c.id] = {};
        for (var m = Wt(y, g), p = m.start; p <= m.end; p++) {
          var k = v[p];
          if (k && (!b || ae(p, y, g, r))) {
            var $ = l(c, k, f, 0, u);
            $ && (_.push($), o[c.id][p] = $);
          }
        }
        var w = null;
        if (_.length) {
          w = document.createElement("div");
          for (var x = 0; x < _.length; x++) w.appendChild(_[x]);
        }
        return w;
      }, update: function(c, u, h, g, f) {
        var y = h.$getTemplates(), v = h.getScale(), b = s(c, g.resource_property, h.getScale(), h), _ = Wt(v, f), m = {};
        if (o && o[c.id]) for (var p in o[c.id]) m[p] = p;
        for (var k = _.start; k <= _.end; k++) {
          var $ = b[k];
          if (m[k] = !1, $) if (ae(k, v, f, r)) if (o[c.id] && o[c.id][k]) o[c.id] && o[c.id][k] && !o[c.id][k].parentNode && u.appendChild(o[c.id][k]);
          else {
            var w = l(c, $, y, 0, h);
            w && (u.appendChild(w), o[c.id][k] = w);
          }
          else d(c.id, k);
        }
        for (var p in m) m[p] !== !1 && d(c.id, p);
      }, getRectangle: Ge, getVisibleRange: ft };
    }(t);
  }, resourceHistogram: function() {
    return Ct();
  }, gridTaskRowResizer: function() {
    return /* @__PURE__ */ function(r) {
      return { render: function(s, o, l) {
        var d = o.$getConfig(), c = document.createElement("div");
        return c.className = "gantt_task_grid_row_resize_wrap", c.style.top = o.getItemTop(s.id) + o.getItemHeight(s.id) + "px", c.innerHTML = "<div class='gantt_task_grid_row_resize' role='cell'></div>", c.setAttribute(d.task_grid_row_resizer_attribute, s.id), r._waiAria.rowResizerAttr(c), c;
      }, update: null, getRectangle: Yt, getVisibleRange: ft };
    }(t);
  } }, layersService: { getDataRender: function(r) {
    return i.getDataRender(r, t);
  }, createDataRender: function(r) {
    return i.createDataRender(r, t);
  } } };
} };
function oe(t, e) {
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
  var d = e.skins[e.skin] || e.skins.terrace;
  (function(h, g, f) {
    for (var y in g) (h[y] === void 0 || f) && (h[y] = g[y]);
  })(e.config, d.config, t), a || (e.config.link_radius = 1);
  var c = e.getGridColumns();
  for (c[1] && !e.defined(c[1].width) && (c[1].width = d._second_column_width), c[2] && !e.defined(c[2].width) && (c[2].width = d._third_column_width), o = 0; o < c.length; o++) {
    var u = c[o];
    u.name == "add" && (u.width || (u.width = 44), e.defined(u.min_width) && e.defined(u.max_width) || (u.min_width = u.min_width || u.width, u.max_width = u.max_width || u.width), u.min_width && (u.min_width = +u.min_width), u.max_width && (u.max_width = +u.max_width), u.width && (u.width = +u.width, u.width = u.min_width && u.min_width > u.width ? u.min_width : u.width, u.width = u.max_width && u.max_width < u.width ? u.max_width : u.width));
  }
  d.config.task_height && (e.config.task_height = d.config.task_height || "full"), d.config.bar_height && (e.config.bar_height = d.config.bar_height || "full"), d._lightbox_template && (e._lightbox_template = d._lightbox_template), d._redefine_lightbox_buttons && (e.config.buttons_right = d._redefine_lightbox_buttons.buttons_right, e.config.buttons_left = d._redefine_lightbox_buttons.buttons_left), e.resetLightbox();
}
function qa(t) {
  var e = 50, n = 30, i = 10, a = 50, r = null, s = !1, o = null, l = { started: !1 }, d = {};
  function c(b) {
    return b && G(b, t.$root) && b.offsetHeight;
  }
  function u() {
    var b = !!document.querySelector(".gantt_drag_marker"), _ = !!document.querySelector(".gantt_drag_marker.gantt_grid_resize_area") || !!document.querySelector(".gantt_drag_marker.gantt_row_grid_resize_area"), m = !!document.querySelector(".gantt_link_direction"), p = t.getState(), k = p.autoscroll;
    return s = b && !_ && !m, !(!p.drag_mode && !b || _) || k;
  }
  function h(b) {
    if (o && (clearTimeout(o), o = null), b) {
      var _ = t.config.autoscroll_speed;
      _ && _ < 10 && (_ = 10), o = setTimeout(function() {
        r = setInterval(y, _ || a);
      }, t.config.autoscroll_delay || i);
    }
  }
  function g(b) {
    b ? (h(!0), l.started || (l.x = d.x, l.y = d.y, l.started = !0)) : (r && (clearInterval(r), r = null), h(!1), l.started = !1);
  }
  function f(b) {
    var _ = u();
    if (!r && !o || _ || g(!1), !t.config.autoscroll || !_) return !1;
    d = { x: b.clientX, y: b.clientY }, b.type == "touchmove" && (d.x = b.targetTouches[0].clientX, d.y = b.targetTouches[0].clientY), !r && _ && g(!0);
  }
  function y() {
    if (!u()) return g(!1), !1;
    var b = c(t.$task) ? t.$task : c(t.$grid) ? t.$grid : t.$root;
    if (b) {
      var _ = !1;
      [".gantt_drag_marker.gantt_grid_resize_area", ".gantt_drag_marker .gantt_row.gantt_row_task", ".gantt_drag_marker.gantt_grid_dnd_marker"].forEach(function(M) {
        _ = _ || !!document.querySelector(M);
      }), _ && (b = t.$grid);
      var m = F(b), p = d.x - m.x, k = d.y - m.y + window.scrollY, $ = s ? 0 : v(p, m.width, l.x - m.x), w = v(k, m.height, l.y - m.y + window.scrollY), x = t.getScrollState(), S = x.y, T = x.inner_height, E = x.height, C = x.x, D = x.inner_width, A = x.width;
      (w && !T || w < 0 && !S || w > 0 && S + T >= E + 2) && (w = 0), ($ && !D || $ < 0 && !C || $ > 0 && C + D >= A) && ($ = 0);
      var I = t.config.autoscroll_step;
      I && I < 2 && (I = 2), w *= I || n, (($ *= I || n) || w) && function(M, L) {
        var P = t.getScrollState(), H = null, V = null;
        M && (H = P.x + M, H = Math.min(P.width, H), H = Math.max(0, H)), L && (V = P.y + L, V = Math.min(P.height, V), V = Math.max(0, V)), t.scrollTo(H, V);
      }($, w);
    }
  }
  function v(b, _, m) {
    return b - e < 0 && b < m ? -1 : b > _ - e && b > m ? 1 : 0;
  }
  t.attachEvent("onGanttReady", function() {
    if (!j(t)) {
      var b = vt(t.$root) || document.body;
      t.eventRemove(b, "mousemove", f), t.event(b, "mousemove", f), t.eventRemove(b, "touchmove", f), t.event(b, "touchmove", f), t.eventRemove(b, "pointermove", f), t.event(b, "pointermove", f);
    }
  }), t.attachEvent("onDestroy", function() {
    g(!1);
  });
}
var le, de;
window.jQuery && (le = window.jQuery, de = [], le.fn.dhx_gantt = function(t) {
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
  if (de[t]) return de[t].apply(this, []);
  le.error("Method " + t + " does not exist on jQuery.dhx_gantt");
});
const Ga = null;
window.dhtmlx && (window.dhtmlx.attaches || (window.dhtmlx.attaches = {}), window.dhtmlx.attaches.attachGantt = function(t, e, n) {
  var i = document.createElement("DIV");
  n = n || window.gantt, i.id = "gantt_" + n.uid(), i.style.width = "100%", i.style.height = "100%", i.cmp = "grid", document.body.appendChild(i), this.attachObject(i.id), this.dataType = "gantt", this.dataObj = n;
  var a = this.vs[this.av];
  return a.grid = n, n.init(i.id, t, e), i.firstChild.style.border = "none", a.gridId = i.id, a.gridObj = i, this.vs[this._viewRestore()].grid;
}), window.dhtmlXCellObject !== void 0 && (window.dhtmlXCellObject.prototype.attachGantt = function(t, e, n) {
  n = n || window.gantt;
  var i = document.createElement("DIV");
  return i.id = "gantt_" + n.uid(), i.style.width = "100%", i.style.height = "100%", i.cmp = "grid", document.body.appendChild(i), this.attachObject(i.id), this.dataType = "gantt", this.dataObj = n, n.init(i.id, t, e), i.firstChild.style.border = "none", i = null, this.callEvent("_onContentAttach", []), this.dataObj;
});
const Ya = null, Ja = ["ctrlKey", "altKey", "shiftKey", "metaKey"], Ka = [[{ unit: "month", date: "%M", step: 1 }, { unit: "day", date: "%d", step: 1 }], [{ unit: "day", date: "%d %M", step: 1 }], [{ unit: "day", date: "%d %M", step: 1 }, { unit: "hour", date: "%H:00", step: 8 }], [{ unit: "day", date: "%d %M", step: 1 }, { unit: "hour", date: "%H:00", step: 1 }]];
class Xa {
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
          const d = l.$getConfig();
          d.fixed_scales || a.mixin(d, s, !0);
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
          const d = this.$gantt.posFromDate(l);
          this.$gantt.scrollTo(d - o / 2);
        }
        this.callEvent("onAfterZoom", [this._activeLevelIndex, r]);
      }
    }, this._attachWheelEvent = (n) => {
      const i = mt.isFF ? "wheel" : "mousewheel";
      let a;
      a = typeof n.element == "function" ? n.element() : n.element, a && this._domEvents.attach(a, i, this.$gantt.bind(function(r) {
        if (this._useKey && (Ja.indexOf(this._useKey) < 0 || !r[this._useKey]))
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
    this.$gantt.env.isNode || (this._initialStartDate = e.startDate, this._initialEndDate = e.endDate, this._activeLevelIndex = e.activeLevelIndex ? e.activeLevelIndex : 0, this._levels = this._mapScales(e.levels || Ka), this._handler = e.handler || this._defaultHandler, this._minColumnWidth = e.minColumnWidth || 60, this._maxColumnWidth = e.maxColumnWidth || 240, this._widthStep = e.widthStep || 3 / 8 * e.minColumnWidth, this._useKey = e.useKey, this._initialized || (st(this), this.$gantt.attachEvent("onGanttScroll", () => {
      this._getVisibleDate();
    })), this._domEvents.detachAll(), e.trigger === "wheel" && (this.$gantt.$root ? this._attachWheelEvent(e) : this.$gantt.attachEvent("onGanttReady", () => {
      this._attachWheelEvent(e);
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
function Za(t) {
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
      }, function() {
        return !1;
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
    var l, d = 0, c = !1, u = !1, h = null, g = null, f = null, y = [], v = null;
    let b = {};
    for (var _ = 0; _ < a.length; _++) t.eventRemove(a[_][0], a[_][1], a[_][2]);
    (a = []).push([t.$container, r[0], function(p) {
      var k = i();
      if (!o(p) && c) {
        g && clearTimeout(g);
        var $ = s(p);
        if (k && (k.drag.id || k.drag.start_drag)) return k.on_mouse_move($), p.preventDefault && p.preventDefault(), p.cancelBubble = !0, !1;
        if (!t._prevent_touch_scroll) {
          if ($ && h) {
            var w = h.pageX - $.pageX, x = h.pageY - $.pageY;
            if (!u && (Math.abs(w) > 5 || Math.abs(x) > 5) && (u = !0, d = 0, l = v ? n(v) : t.getScrollState()), u) {
              var S, T = l.x + w, E = l.y + x;
              if (v ? (function(C, D, A) {
                var I = C.$config.scrollX ? t.$ui.getView(C.$config.scrollX) : null, M = C.$config.scrollY ? t.$ui.getView(C.$config.scrollY) : null;
                I && I.scrollTo(D, null), M && M.scrollTo(null, A);
              }(v, T, E), S = n(v)) : (t.scrollTo(T, E), S = t.getScrollState()), l.x != S.x && x > 2 * w || l.y != S.y && w > 2 * x) return m(p);
            }
          }
          return m(p);
        }
        return !0;
      }
    }]);
    try {
      document.addEventListener("touchmove", function(p) {
        t._touch_drag && m(p);
      }, { passive: !1 });
    } catch {
      console.warn("Cannot prevent touch event for the page drag");
    }
    for (a.push([this.$container, "contextmenu", function(p) {
      if (c) return m(p);
    }]), a.push([this.$container, r[1], function(p) {
      if (b = p.touches.length, document && document.body && document.body.classList.add("gantt_touch_active"), !o(p)) if (p.touches && p.touches.length > 1) c = !1;
      else {
        h = s(p), v = function($) {
          for (var w = t.$layout.getCellsByType("viewCell"), x = 0; x < w.length; x++) {
            var S = w[x].$view.getBoundingClientRect();
            if ($.clientX >= S.left && $.clientX <= S.right && $.clientY <= S.bottom && $.clientY >= S.top) return w[x];
          }
        }(h), t._locate_css(h, "gantt_hor_scroll") || t._locate_css(h, "gantt_ver_scroll") || (c = !0);
        var k = i();
        g = setTimeout(function() {
          var $ = t.locate(h);
          k && $ && !t._locate_css(h, "gantt_link_control") && !t._locate_css(h, "gantt_grid_data") && (k.on_mouse_down(h), k.drag && k.drag.start_drag && (function(w) {
            const x = t._getTaskLayers();
            let S = t.getTask(w);
            if (S) {
              let T = t.isTaskVisible(w);
              if (T) {
                f = w;
                for (let E = 0; E < x.length; E++) if (S = x[E].rendered[w], S && S.getAttribute(t.config.task_attribute) && S.getAttribute(t.config.task_attribute) == w) {
                  const C = S.cloneNode(!0);
                  y.push(S), x[E].rendered[w] = C, S.style.display = "none", C.className += " gantt_drag_move ", S.parentNode.appendChild(C);
                }
              } else if (S.$split_subtask) {
                let E = S.$rendered_parent;
                if (T = t.isTaskVisible(E), !T) return;
                f = w;
                for (let C = 0; C < x.length; C++) {
                  const D = x[C].rendered[E];
                  let A;
                  if (D && D.childNodes && (A = D.querySelector(`[${t.config.task_attribute}="${S.id}"]`)), A) {
                    const I = A.cloneNode(!0);
                    A.parentNode.appendChild(I), t.$task_bars.appendChild(A), A.style.display = "none", y.push(A), A = null;
                  }
                }
              }
            }
          }($), k._start_dnd(h), t._touch_drag = !0, t.refreshTask($), t._touch_feedback())), g = null;
        }, t.config.touch_drag);
      }
    }]), a.push([this.$container, r[2], function(p) {
      if (document && document.body && document.body.classList.remove("gantt_touch_active"), !o(p)) {
        g && clearTimeout(g), t._touch_drag = !1, c = !1;
        var k = s(p), $ = i();
        if ($ && $.on_mouse_up(k), f && t.isTaskExists(f) && (t.refreshTask(f), y.length && (y.forEach(function(x) {
          x.parentNode && x.parentNode.removeChild(x);
        }), t._touch_feedback())), c = u = !1, y = [], f = null, h && d) {
          var w = /* @__PURE__ */ new Date();
          w - d < 500 && b <= 1 ? (t.$services.getService("mouseEvents").onDoubleClick(h), m(p)) : d = w;
        } else d = /* @__PURE__ */ new Date();
      }
    }]), _ = 0; _ < a.length; _++) t.event(a[_][0], a[_][1], a[_][2]);
    function m(p) {
      return p && p.preventDefault && p.cancelable && p.preventDefault(), p.cancelBubble = !0, !1;
    }
  };
}
function jt() {
  console.log("Method is not implemented.");
}
function Mt() {
}
function ut(t) {
  return Mt;
}
Mt.prototype.render = jt, Mt.prototype.set_value = jt, Mt.prototype.get_value = jt, Mt.prototype.focus = jt;
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
function Ut(t) {
  const e = ut();
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
function Qa(t) {
  var e = Ut(t);
  function n() {
    return e.apply(this, arguments) || this;
  }
  function i(a, r) {
    var s = [], o = [];
    r && (s = t.getTaskByTime(), a.allow_root && s.unshift({ id: t.config.root_id, text: a.root_label || "" }), s = function(u, h, g) {
      var f = h.filter || function() {
        return !0;
      };
      u = u.slice(0);
      for (var y = 0; y < u.length; y++) {
        var v = u[y];
        (v.id == g || t.isChildOf(v.id, g) || f(v.id, v) === !1) && (u.splice(y, 1), y--);
      }
      return u;
    }(s, a, r), a.sort && s.sort(a.sort));
    for (var l = a.template || t.templates.task_text, d = 0; d < s.length; d++) {
      var c = l.apply(t, [s[d].start_date, s[d].end_date, s[d]]);
      c === void 0 && (c = ""), o.push({ key: s[d].id, label: c });
    }
    return a.options = o, a.map_to = a.map_to || "parent", t.form_blocks.select.render.apply(this, arguments);
  }
  return z(n, e), n.prototype.render = function(a) {
    return i(a, !1);
  }, n.prototype.set_value = function(a, r, s, o) {
    r === 0 && (r = "0");
    var l = document.createElement("div");
    l.innerHTML = i(o, s.id);
    var d = l.removeChild(l.firstChild);
    return a.onselect = null, a.parentNode.replaceChild(d, a), t.form_blocks.select.set_value.apply(t, [d, r, s, o]);
  }, n;
}
function tr(t) {
  var e = function() {
    const _ = ut();
    function m() {
      return _.apply(this, arguments) || this;
    }
    return z(m, _), m.prototype.render = function(p) {
      let k = p.height ? `${p.height}px` : "";
      return `<div class='gantt_cal_ltext gantt_cal_template gantt_section_${p.name}' ${k ? `style='height:${k};'` : ""}></div>`;
    }, m.prototype.set_value = function(p, k) {
      p.innerHTML = k || "";
    }, m.prototype.get_value = function(p) {
      return p.innerHTML || "";
    }, m.prototype.focus = function() {
    }, m;
  }(), n = function(_) {
    const m = ut();
    function p() {
      return m.apply(this, arguments) || this;
    }
    return z(p, m), p.prototype.render = function(k) {
      const $ = (k.height || "130") + "px", w = k.placeholder ? `placeholder='${k.placeholder}'` : "";
      return `<div class='gantt_cal_ltext gantt_section_${k.name}' style='height:${$};' ${w}><textarea></textarea></div>`;
    }, p.prototype.set_value = function(k, $) {
      _.form_blocks.textarea._get_input(k).value = $ || "";
    }, p.prototype.get_value = function(k) {
      return _.form_blocks.textarea._get_input(k).value;
    }, p.prototype.focus = function(k) {
      var $ = _.form_blocks.textarea._get_input(k);
      _._focus($, !0);
    }, p.prototype._get_input = function(k) {
      return k.querySelector("textarea");
    }, p;
  }(t), i = function(_) {
    const m = ut();
    function p() {
      return m.apply(this, arguments) || this;
    }
    return z(p, m), p.prototype.render = function(k) {
      var $ = _.form_blocks.getTimePicker.call(this, k);
      let w = "gantt_section_time";
      k.name !== "time" && (w += " gantt_section_" + k.name);
      var x = "<div style='padding-top:0px;font-size:inherit;text-align:center;' class='" + w + "'>";
      return x += $, k.single_date ? ($ = _.form_blocks.getTimePicker.call(this, k, !0), x += "<span></span>") : x += "<span class='gantt_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>", (x += $) + "</div>";
    }, p.prototype.set_value = function(k, $, w, x) {
      var S = x, T = k.getElementsByTagName("select"), E = x._time_format_order;
      if (S.auto_end_date) for (var C = function() {
        I = new Date(T[E[2]].value, T[E[1]].value, T[E[0]].value, 0, 0), M = _.calculateEndDate({ start_date: I, duration: 1, task: w }), _.form_blocks._fill_lightbox_select(T, E.size, M, E, S);
      }, D = 0; D < 4; D++) T[D].onchange = C;
      var A = _._resolve_default_mapping(x);
      typeof A == "string" && (A = { start_date: A });
      var I = w[A.start_date] || /* @__PURE__ */ new Date(), M = w[A.end_date] || _.calculateEndDate({ start_date: I, duration: 1, task: w });
      _.form_blocks._fill_lightbox_select(T, 0, I, E, S), _.form_blocks._fill_lightbox_select(T, E.size, M, E, S);
    }, p.prototype.get_value = function(k, $, w) {
      var x, S = k.getElementsByTagName("select"), T = w._time_format_order;
      return x = _.form_blocks.getTimePickerValue(S, w), typeof _._resolve_default_mapping(w) == "string" ? x : { start_date: x, end_date: function(E, C, D) {
        var A = _.form_blocks.getTimePickerValue(E, w, C.size);
        return A <= D && (w.autofix_end !== !1 || w.single_date) ? _.date.add(D, _._get_timepicker_step(), "minute") : A;
      }(S, T, x) };
    }, p.prototype.focus = function(k) {
      _._focus(k.getElementsByTagName("select")[0]);
    }, p;
  }(t), a = Ut(t), r = function(_) {
    var m = ut();
    function p() {
      return m.apply(this, arguments) || this;
    }
    return z(p, m), p.prototype.render = function(k) {
      const $ = k.height ? `height:${k.height}px;` : "";
      let w = `<div class='gantt_cal_ltext gantt_cal_lcheckbox gantt_section_${k.name}' ${$ ? `style='${$}'` : ""}>`;
      if (k.options && k.options.length) for (var x = 0; x < k.options.length; x++) w += "<label><input type='checkbox' value='" + k.options[x].key + "' name='" + k.name + "'>" + k.options[x].label + "</label>";
      else k.single_value = !0, w += "<label><input type='checkbox' name='" + k.name + "'></label>";
      return w += "</div>", w;
    }, p.prototype.set_value = function(k, $, w, x) {
      var S = Array.prototype.slice.call(k.querySelectorAll("input[type=checkbox]"));
      !k._dhx_onchange && x.onchange && (k.onchange = x.onchange, k._dhx_onchange = !0), x.single_value ? S[0].checked = !!$ : kt(S, function(T) {
        T.checked = !!$ && $.indexOf(T.value) >= 0;
      });
    }, p.prototype.get_value = function(k, $, w) {
      return w.single_value ? k.querySelector("input[type=checkbox]").checked : function(x, S) {
        if (x.map) return x.map(S);
        for (var T = x.slice(), E = [], C = 0; C < T.length; C++) E.push(S(T[C], C));
        return E;
      }(Array.prototype.slice.call(k.querySelectorAll("input[type=checkbox]:checked")), function(x) {
        return x.value;
      });
    }, p.prototype.focus = function(k) {
      _._focus(k.querySelector("input[type=checkbox]"));
    }, p;
  }(t), s = function(_) {
    const m = ut();
    function p() {
      return m.apply(this, arguments) || this;
    }
    return z(p, m), p.prototype.render = function(k) {
      const $ = k.height ? `${k.height}px` : "";
      let w = `<div class='gantt_cal_ltext gantt_cal_lradio gantt_section_${k.name}' ${$ ? `style='height:${$};'` : ""}>`;
      if (k.options && k.options.length) for (var x = 0; x < k.options.length; x++) w += "<label><input type='radio' value='" + k.options[x].key + "' name='" + k.name + "'>" + k.options[x].label + "</label>";
      return w += "</div>", w;
    }, p.prototype.set_value = function(k, $, w, x) {
      var S;
      x.options && x.options.length && (S = k.querySelector("input[type=radio][value='" + $ + "']") || k.querySelector("input[type=radio][value='" + x.default_value + "']")) && (!k._dhx_onchange && x.onchange && (k.onchange = x.onchange, k._dhx_onchange = !0), S.checked = !0);
    }, p.prototype.get_value = function(k, $) {
      var w = k.querySelector("input[type=radio]:checked");
      return w ? w.value : "";
    }, p.prototype.focus = function(k) {
      _._focus(k.querySelector("input[type=radio]"));
    }, p;
  }(t), o = function(_) {
    var m = ut();
    function p() {
      return m.apply(this, arguments) || this;
    }
    function k(x) {
      return x.formatter || new Lt();
    }
    function $(x, S) {
      var T = x.getElementsByTagName("select"), E = S._time_format_order, C = 0, D = 0;
      if (_.defined(E[3])) {
        var A = T[E[3]], I = parseInt(A.value, 10);
        isNaN(I) && A.hasAttribute("data-value") && (I = parseInt(A.getAttribute("data-value"), 10)), C = Math.floor(I / 60), D = I % 60;
      }
      return new Date(T[E[2]].value, T[E[1]].value, T[E[0]].value, C, D);
    }
    function w(x, S) {
      var T = x.getElementsByTagName("input")[1];
      return (T = k(S).parse(T.value)) && !window.isNaN(T) || (T = 1), T < 0 && (T *= -1), T;
    }
    return z(p, m), p.prototype.render = function(x) {
      var S = "<div class='gantt_time_selects'>" + _.form_blocks.getTimePicker.call(this, x) + "</div>", T = " " + _.locale.labels[_.config.duration_unit + "s"] + " ", E = x.single_date ? " style='display:none'" : "", C = x.readonly ? " disabled='disabled'" : "", D = _._waiAria.lightboxDurationInputAttrString(x), A = "gantt_duration_value";
      x.formatter && (T = "", A += " gantt_duration_value_formatted");
      var I = "<div class='gantt_duration' " + E + "><div class='gantt_duration_inputs'><input type='button' class='gantt_duration_dec' value='−'" + C + "><input type='text' value='5days' class='" + A + "'" + C + " " + D + "><input type='button' class='gantt_duration_inc' value='+'" + C + "></div><div class='gantt_duration_end_date'>" + T + "<span></span></div></div></div>";
      let M = "gantt_section_time gantt_section_duration";
      return x.name !== "time" && (M += " gantt_section_" + x.name), "<div style='padding-top:0px;font-size:inherit;' class='" + M + "'>" + S + " " + I + "</div>";
    }, p.prototype.set_value = function(x, S, T, E) {
      var C, D, A, I, M = x.getElementsByTagName("select"), L = x.getElementsByTagName("input"), P = L[1], H = [L[0], L[2]], V = x.getElementsByTagName("span")[0], ht = E._time_format_order;
      function O() {
        var Y = $.call(_, x, E), B = w.call(_, x, E), _t = _.calculateEndDate({ start_date: Y, duration: B, task: T }), Tt = _.templates.task_end_date || _.templates.task_date;
        V.innerHTML = Tt(_t);
      }
      function Z(Y) {
        var B = P.value;
        B = k(E).parse(B), window.isNaN(B) && (B = 0), (B += Y) < 1 && (B = 1), P.value = k(E).format(B), O();
      }
      H[0].onclick = _.bind(function() {
        Z(-1 * _.config.duration_step);
      }, this), H[1].onclick = _.bind(function() {
        Z(1 * _.config.duration_step);
      }, this), M[0].onchange = O, M[1].onchange = O, M[2].onchange = O, M[3] && (M[3].onchange = O), P.onkeydown = _.bind(function(Y) {
        var B;
        return (B = (Y = Y || window.event).charCode || Y.keyCode || Y.which) == _.constants.KEY_CODES.DOWN ? (Z(-1 * _.config.duration_step), !1) : B == _.constants.KEY_CODES.UP ? (Z(1 * _.config.duration_step), !1) : void window.setTimeout(O, 1);
      }, this), P.onchange = _.bind(O, this), typeof (C = _._resolve_default_mapping(E)) == "string" && (C = { start_date: C }), D = T[C.start_date] || /* @__PURE__ */ new Date(), A = T[C.end_date] || _.calculateEndDate({ start_date: D, duration: 1, task: T }), I = Math.round(T[C.duration]) || _.calculateDuration({ start_date: D, end_date: A, task: T }), I = k(E).format(I), _.form_blocks._fill_lightbox_select(M, 0, D, ht, E), P.value = I, O();
    }, p.prototype.get_value = function(x, S, T) {
      var E = $(x, T), C = w(x, T), D = _.calculateEndDate({ start_date: E, duration: C, task: S });
      return typeof _._resolve_default_mapping(T) == "string" ? E : { start_date: E, end_date: D, duration: C };
    }, p.prototype.focus = function(x) {
      _._focus(x.getElementsByTagName("select")[0]);
    }, p;
  }(t), l = Qa(t), d = Ut(t), c = function(_) {
    var m = ut();
    function p() {
      return m.apply(this, arguments) || this;
    }
    function k(w) {
      return !w || w === _.config.constraint_types.ASAP || w === _.config.constraint_types.ALAP;
    }
    function $(w, x) {
      for (var S = k(x), T = 0; T < w.length; T++) w[T].disabled = S;
    }
    return z(p, m), p.prototype.render = function(w) {
      const x = w.height ? `height:${w.height}px;` : "";
      let S = `<div class='gantt_cal_ltext gantt_section_${w.name}' ${x ? `style='${x}'` : ""}>`;
      var T = [];
      for (var E in _.config.constraint_types) T.push({ key: _.config.constraint_types[E], label: _.locale.labels[_.config.constraint_types[E]] });
      return w.options = w.options || T, S += "<span data-constraint-type-select>" + $n.getHtmlSelect(w.options, [{ key: "data-type", value: "constraint-type" }]) + "</span>", S += "<label data-constraint-time-select>" + (_.locale.labels.constraint_date || "Constraint date") + ": " + _.form_blocks.getTimePicker.call(this, w) + "</label>", S += "</div>", S;
    }, p.prototype.set_value = function(w, x, S, T) {
      var E = w.querySelector("[data-constraint-type-select] select"), C = w.querySelectorAll("[data-constraint-time-select] select"), D = T._time_format_order, A = _._resolve_default_mapping(T);
      E._eventsInitialized || (E.addEventListener("change", function(L) {
        $(C, L.target.value);
      }), E._eventsInitialized = !0);
      var I = S[A.constraint_date] || /* @__PURE__ */ new Date();
      _.form_blocks._fill_lightbox_select(C, 0, I, D, T);
      var M = S[A.constraint_type] || _.getConstraintType(S);
      E.value = M, $(C, M);
    }, p.prototype.get_value = function(w, x, S) {
      var T = w.querySelector("[data-constraint-type-select] select"), E = w.querySelectorAll("[data-constraint-time-select] select"), C = T.value, D = null;
      return k(C) || (D = _.form_blocks.getTimePickerValue(E, S)), { constraint_type: C, constraint_date: D };
    }, p.prototype.focus = function(w) {
      _._focus(w.querySelector("select"));
    }, p;
  }(t), u = function(_) {
    const m = Ut(_);
    function p() {
      return m.apply(this, arguments) || this;
    }
    return z(p, m), p.prototype.render = function(k) {
      var $ = _.config.types, w = _.locale.labels, x = [], S = k.filter || function(C, D) {
        return !$.placeholder || D !== $.placeholder;
      };
      for (var T in $) !S(T, $[T]) == 0 && x.push({ key: $[T], label: w["type_" + T] });
      k.options = x;
      var E = k.onchange;
      return k.onchange = function() {
        _._lightbox_current_type = this.value, _.changeLightboxType(this.value), typeof E == "function" && E.apply(this, arguments);
      }, m.prototype.render.apply(this, arguments);
    }, p;
  }(t), h = function(_) {
    var m = ut();
    function p() {
      return m.apply(this, arguments) || this;
    }
    function k(S) {
      return S.formatter || new Lt();
    }
    function $(S, T, E, C) {
      const D = "<div class='gantt_time_selects'>" + _.form_blocks.getTimePicker.call(_, C) + "</div>";
      let A = " " + _.locale.labels[_.config.duration_unit + "s"] + " ";
      const I = C.single_date ? " style='display:none'" : "", M = C.readonly ? " disabled='disabled'" : "", L = _._waiAria.lightboxDurationInputAttrString(C), P = _.locale.labels.baselines_remove_button;
      let H = "gantt_duration_value";
      C.formatter && (A = "", H += " gantt_duration_value_formatted");
      const V = "<div class='gantt_duration' " + I + "><div class='gantt_duration_inputs'><input type='button' class='gantt_duration_dec' value='−'" + M + "><input type='text' value='5days' class='" + H + "'" + M + " " + L + "><input type='button' class='gantt_duration_inc' value='+'" + M + "></div><div class='gantt_duration_end_date'>" + A + "<span></span></div></div></div>", ht = `<div><div class='baseline_delete_button gantt_custom_button'>${P}</div></div>`, O = document.createElement("div");
      O.className = "gantt_section_time gantt_section_duration", O.setAttribute("data-baseline-id", T.id), O.innerHTML = D + V + ht + "<br>", S.appendChild(O);
      var Z, Y, B, _t = O.getElementsByTagName("select"), Tt = O.getElementsByTagName("input"), Et = Tt[1], Te = [Tt[0], Tt[2]], Sn = O.getElementsByTagName("span")[0], Tn = C._time_format_order;
      function gt() {
        var ct = w.call(_, O, C), U = x.call(_, O, C), En = _.calculateEndDate({ start_date: ct, duration: U, task: E }), Cn = _.templates.task_end_date || _.templates.task_date;
        Sn.innerHTML = Cn(En);
      }
      function Ht(ct) {
        var U = Et.value;
        U = k(C).parse(U), window.isNaN(U) && (U = 0), (U += ct) < 1 && (U = 1), Et.value = k(C).format(U), gt();
      }
      O.querySelector(".baseline_delete_button").onclick = function(ct) {
        const U = O.parentNode;
        O.innerHTML = "", O.remove(), U.innerHTML === "" && (U.innerHTML = _.locale.labels.baselines_section_placeholder);
      }, Te[0].onclick = _.bind(function() {
        Ht(-1 * _.config.duration_step);
      }, _), Te[1].onclick = _.bind(function() {
        Ht(1 * _.config.duration_step);
      }, _), _t[0].onchange = gt, _t[1].onchange = gt, _t[2].onchange = gt, _t[3] && (_t[3].onchange = gt), Et.onkeydown = _.bind(function(ct) {
        var U;
        return (U = (ct = ct || window.event).charCode || ct.keyCode || ct.which) == _.constants.KEY_CODES.DOWN ? (Ht(-1 * _.config.duration_step), !1) : U == _.constants.KEY_CODES.UP ? (Ht(1 * _.config.duration_step), !1) : void window.setTimeout(gt, 1);
      }, _), Et.onchange = _.bind(gt, _), _._resolve_default_mapping(C), Z = T.start_date || /* @__PURE__ */ new Date(), Y = T.end_date || _.calculateEndDate({ start_date: Z, duration: 1, task: E }), B = _.calculateDuration({ start_date: Z, end_date: Y, task: E }), B = k(C).format(B), _.form_blocks._fill_lightbox_select(_t, 0, Z, Tn, C), Et.value = B, gt();
    }
    function w(S, T) {
      var E = S.getElementsByTagName("select"), C = T._time_format_order, D = 0, A = 0;
      if (_.defined(C[3])) {
        var I = E[C[3]], M = parseInt(I.value, 10);
        isNaN(M) && I.hasAttribute("data-value") && (M = parseInt(I.getAttribute("data-value"), 10)), D = Math.floor(M / 60), A = M % 60;
      }
      return new Date(E[C[2]].value, E[C[1]].value, E[C[0]].value, D, A);
    }
    function x(S, T) {
      var E = S.getElementsByTagName("input")[1];
      return (E = k(T).parse(E.value)) && !window.isNaN(E) || (E = 1), E < 0 && (E *= -1), E;
    }
    return z(p, m), p.prototype.render = function(S) {
      return `<div style='height: ${S.height || 100}px; padding-top:0px; font-size:inherit;' class='gantt_section_baselines'></div>`;
    }, p.prototype.set_value = function(S, T, E, C) {
      E.baselines ? (S.innerHTML = "", E.baselines.forEach((D) => {
        $(S, D, E, C);
      })) : S.innerHTML = _.locale.labels.baselines_section_placeholder;
    }, p.prototype.get_value = function(S, T, E) {
      const C = [];
      return S.querySelectorAll("[data-baseline-id]").forEach((D) => {
        const A = D.dataset.baselineId;
        let I, M = _.getDatastore("baselines").getItem(A);
        I = M ? _.copy(M) : { id: _.uid(), task_id: T.id, text: "Baseline 1" }, I.start_date = w(D, E), I.duration = x(D, E), I.end_date = _.calculateEndDate({ start_date: I.start_date, duration: I.duration, task: T }), C.push(I);
      }), C;
    }, p.prototype.button_click = function(S, T, E, C) {
      if (_.callEvent("onSectionButton", [_._lightbox_id, E]) !== !1 && (T.closest(".gantt_custom_button.gantt_remove_baselines") && (C.innerHTML = _.locale.labels.baselines_section_placeholder), T.closest(".gantt_custom_button.gantt_add_baselines"))) {
        C.innerHTML == _.locale.labels.baselines_section_placeholder && (C.innerHTML = "");
        const D = _.getTask(_._lightbox_id);
        $(C, { id: _.uid(), task_id: D.id, text: "Baseline 1", start_date: D.start_date, end_date: D.end_date }, D, _._get_typed_lightbox_config()[S]);
      }
    }, p.prototype.focus = function(S) {
      _._focus(S.getElementsByTagName("select")[0]);
    }, p;
  }(t);
  t._lightbox_methods = {}, t._lightbox_template = "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span></div><div class='gantt_cal_larea'></div>", t._lightbox_template = `<div class='gantt_cal_ltitle'><div class="dhx_cal_ltitle_descr"><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='dhx_title'></span>
</div>
<div class="gantt_cal_ltitle_controls">
	<a class="gantt_cal_ltitle_close_btn dhx_gantt_icon dhx_gantt_icon_close"></a>

</div></div><div class='gantt_cal_larea'></div>`, t._lightbox_root = t.$root, t.$services.getService("state").registerProvider("lightbox", function() {
    return { lightbox: t._lightbox_id };
  }), t.showLightbox = function(_) {
    var m = this.getTask(_);
    if (this.callEvent("onBeforeLightbox", [_])) {
      var p = this.getLightbox(this.getTaskType(m.type));
      this.showCover(p), this._fill_lightbox(_, p), this._setLbPosition(p), this._waiAria.lightboxVisibleAttr(p), this.callEvent("onLightbox", [_]);
    } else t.isTaskExists(_) && t.getTask(_).$new && this.$data.tasksStore._updateOrder();
  }, t._get_timepicker_step = function() {
    if (this.config.round_dnd_dates) {
      var _;
      if (function(p) {
        var k = p.$ui.getView("timeline");
        return !(!k || !k.isVisible());
      }(this)) {
        var m = t.getScale();
        _ = Ft(m.unit) * m.step / 60;
      }
      return (!_ || _ >= 1440) && (_ = this.config.time_step), _;
    }
    return this.config.time_step;
  }, t.getLabel = function(_, m) {
    for (var p = this._get_typed_lightbox_config(), k = 0; k < p.length; k++) if (p[k].map_to == _) {
      for (var $ = p[k].options, w = 0; w < $.length; w++) if ($[w].key == m) return $[w].label;
    }
    return "";
  }, t.updateCollection = function(_, m) {
    m = m.slice(0);
    var p = t.serverList(_);
    if (!p) return !1;
    p.splice(0, p.length), p.push.apply(p, m || []), t.resetLightbox();
  }, t.getLightboxType = function() {
    return this.getTaskType(this._lightbox_type);
  }, t.getLightbox = function(_) {
    var m, p, k, $, w, x = "";
    if (function() {
      const T = t.config.csp === !0, E = !!window.Sfdc || !!window.$A || window.Aura || "$shadowResolver$" in document.body;
      t._lightbox_root = T || E ? t.$root : document.body;
    }(), _ === void 0 && (_ = this.getLightboxType()), !this._lightbox || this.getLightboxType() != this.getTaskType(_)) {
      this._lightbox_type = this.getTaskType(_), m = document.createElement("div"), x = "gantt_cal_light", p = this._is_lightbox_timepicker(), t.config.wide_form && (x += " gantt_cal_light_wide"), p && (x += " gantt_cal_light_full"), m.className = x, m.style.visibility = "hidden", k = this._lightbox_template, k += "<div class='gantt_cal_lcontrols'>", k += y(this.config.buttons_left), k += "<div class='gantt_cal_lcontrols_push_right'></div>", k += y(this.config.buttons_right), k += "</div>", m.innerHTML = k, t._waiAria.lightboxAttr(m), t.config.drag_lightbox && (m.firstChild.onmousedown = t._ready_to_dnd, m.firstChild.ontouchstart = function(T) {
        t._ready_to_dnd(T.touches[0]);
      }, m.firstChild.onselectstart = function() {
        return !1;
      }, m.firstChild.style.cursor = "pointer", t._init_dnd_events()), this._lightbox && this.resetLightbox(), g(), this._cover.insertBefore(m, this._cover.firstChild), this._lightbox = m, $ = this._get_typed_lightbox_config(_), k = this._render_sections($);
      var S = (w = m.querySelector("div.gantt_cal_larea")).style.overflow;
      w.style.overflow = "hidden", w.innerHTML = k, function(T) {
        var E, C, D, A, I, M;
        for (M = 0; M < T.length; M++) E = T[M], D = t._lightbox_root.querySelector("#" + E.id), E.id && D && (C = D.querySelector("label"), (A = D.nextSibling) && (I = A.querySelector("input, select, textarea")) && (I.id = I.id || "input_" + t.uid(), E.inputId = I.id, C.setAttribute("for", E.inputId)));
      }($), w.style.overflow = S, this._init_lightbox_events(this), m.style.display = "none", m.style.visibility = "visible";
    }
    return this._lightbox;
  }, t._render_sections = function(_) {
    for (var m = "", p = 0; p < _.length; p++) {
      var k = this.form_blocks[_[p].type];
      if (k) {
        _[p].id = "area_" + this.uid();
        var $ = _[p].hidden ? " style='display:none'" : "", w = "";
        _[p].button && (w = "<div class='gantt_custom_button' data-index='" + p + "'><div class='gantt_custom_button_" + _[p].button + "'></div><div class='gantt_custom_button_label'>" + this.locale.labels["button_" + _[p].button] + "</div></div>"), _[p].type == "baselines" && (w = "<div class='gantt_custom_button gantt_remove_baselines' data-index='" + p + "'><div class='gantt_custom_button_delete_baselines'></div><div class='gantt_custom_button_label'>" + this.locale.labels.baselines_remove_all_button + "</div></div><div class='gantt_custom_button gantt_add_baselines' data-index='" + p + "'><div class='gantt_custom_button_add_baseline'></div><div class='gantt_custom_button_label'>" + this.locale.labels.baselines_add_button + "</div></div>"), this.config.wide_form && (m += "<div class='gantt_wrap_section' " + $ + ">"), m += "<div id='" + _[p].id + "' class='gantt_cal_lsection'><label>" + w + this.locale.labels["section_" + _[p].name] + "</label></div>" + k.render.call(this, _[p]), m += "</div>";
      }
    }
    return m;
  }, t._center_lightbox = function(_) {
    t._setLbPosition(_);
  }, t._setLbPosition = function(_) {
    if (!_) return;
    const m = t._lightbox_root || t.$root;
    _.style.top = Math.max(m.offsetHeight / 2 - _.offsetHeight / 2, 0) + "px", _.style.left = Math.max(m.offsetWidth / 2 - _.offsetWidth / 2, 0) + "px";
  }, t.showCover = function(_) {
    _ && (_.style.display = "block", this._setLbPosition(_)), g(), this._cover.style.display = "";
  };
  const g = function() {
    t._cover || (t._cover = document.createElement("div"), t._cover.className = "gantt_cal_cover", t._cover.style.display = "none", t.event(t._cover, "mousemove", t._move_while_dnd), t.event(t._cover, "mouseup", t._finish_dnd), (t._lightbox_root || t.$root).appendChild(t._cover));
  };
  function f(_) {
    for (var m in this.config.types) if (this.config.types[m] == _) return m;
    return "task";
  }
  function y(_, m) {
    var p, k, $ = "";
    for (k = 0; k < _.length; k++) p = t.config._migrate_buttons[_[k]] ? t.config._migrate_buttons[_[k]] : _[k], $ += "<div " + t._waiAria.lightboxButtonAttrString(p) + " class='gantt_btn_set gantt_left_btn_set " + p + "_set'><div dhx_button='1' data-dhx-button='1' class='" + p + "'></div><div>" + t.locale.labels[p] + "</div></div>";
    return $;
  }
  function v(_) {
    var m, p;
    return _.time_format ? _.time_format : (p = ["%d", "%m", "%Y"], Ft((m = t.getScale()) ? m.unit : t.config.duration_unit) < Ft("day") && p.push("%H:%i"), p);
  }
  function b(_, m, p) {
    var k, $, w, x, S, T, E = "";
    switch (p.timeFormat[m]) {
      case "%Y":
        for (_._time_format_order[2] = m, _._time_format_order.size++, _.year_range && (isNaN(_.year_range) ? _.year_range.push && (w = _.year_range[0], x = _.year_range[1]) : k = _.year_range), k = k || 10, $ = $ || Math.floor(k / 2), w = w || p.date.getFullYear() - $, x = x || t.getState().max_date.getFullYear() + $, S = w; S <= x; S++) E += "<option value='" + S + "'>" + S + "</option>";
        break;
      case "%m":
        for (_._time_format_order[1] = m, _._time_format_order.size++, S = 0; S < 12; S++) E += "<option value='" + S + "'>" + t.locale.date.month_full[S] + "</option>";
        break;
      case "%d":
        for (_._time_format_order[0] = m, _._time_format_order.size++, S = 1; S < 32; S++) E += "<option value='" + S + "'>" + S + "</option>";
        break;
      case "%H:%i":
        for (_._time_format_order[3] = m, _._time_format_order.size++, S = p.first, T = p.date.getDate(), _._time_values = []; S < p.last; ) E += "<option value='" + S + "'>" + t.templates.time_picker(p.date) + "</option>", _._time_values.push(S), p.date.setTime(p.date.valueOf() + 60 * t._get_timepicker_step() * 1e3), S = 24 * (p.date.getDate() != T ? 1 : 0) * 60 + 60 * p.date.getHours() + p.date.getMinutes();
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
    }, t.lightbox_events.default = function(_, m) {
      if (m.getAttribute("data-dhx-button")) t.callEvent("onLightboxButton", [m.className, m, _]);
      else {
        var p, k, $ = K(m);
        if ($.indexOf("gantt_custom_button") != -1) if ($.indexOf("gantt_custom_button_") != -1) for (p = m.parentNode.getAttribute("data-index"), k = m; k && K(k).indexOf("gantt_cal_lsection") == -1; ) k = k.parentNode;
        else p = m.getAttribute("data-index"), k = m.closest(".gantt_cal_lsection"), m = m.firstChild;
        var w = t._get_typed_lightbox_config();
        p && (p *= 1, t.form_blocks[w[1 * p].type].button_click(p, m, k, k.nextSibling));
      }
    }, this.event(t.getLightbox(), "click", function(_) {
      _.target.closest(".gantt_cal_ltitle_close_btn") && t._cancel_lightbox();
      var m = yt(_), p = K(m);
      return p || (p = K(m = m.previousSibling)), m && p && p.indexOf("gantt_btn_set") === 0 && (p = K(m = m.firstChild)), !(!m || !p) && (t.defined(t.lightbox_events[m.className]) ? t.lightbox_events[m.className] : t.lightbox_events.default)(_, m);
    }), t.getLightbox().onkeydown = function(_) {
      var m = _ || window.event, p = _.target || _.srcElement, k = K(p).indexOf("gantt_btn_set") > -1;
      switch ((_ || m).keyCode) {
        case t.constants.KEY_CODES.SPACE:
          if ((_ || m).shiftKey) return;
          k && p.click && p.click();
          break;
        case t.keys.edit_save:
          if ((_ || m).shiftKey) return;
          k && p.click ? p.click() : t._save_lightbox();
          break;
        case t.keys.edit_cancel:
          t._cancel_lightbox();
      }
    };
  }, t._cancel_lightbox = function() {
    var _ = this.getLightboxValues();
    t._lightbox_current_type = null, this.callEvent("onLightboxCancel", [this._lightbox_id, _.$new]), t.isTaskExists(_.id) && _.$new && (this.silent(function() {
      t.$data.tasksStore.removeItem(_.id), t._update_flags(_.id, null);
    }), this.refreshData()), this.hideLightbox();
  }, t._save_lightbox = function() {
    var _ = this.getLightboxValues();
    t._lightbox_current_type = null, this.callEvent("onLightboxSave", [this._lightbox_id, _, !!_.$new]) && (t.$data.tasksStore._skipTaskRecalculation = "lightbox", _.$new ? (delete _.$new, this.addTask(_, _.parent, this.getTaskIndex(_.id))) : this.isTaskExists(_.id) && (this.mixin(this.getTask(_.id), _, !0), this.refreshTask(_.id), this.updateTask(_.id)), t.$data.tasksStore._skipTaskRecalculation = !1, this.refreshData(), this.hideLightbox());
  }, t._resolve_default_mapping = function(_) {
    var m = _.map_to;
    return { time: !0, time_optional: !0, duration: !0, duration_optional: !0 }[_.type] ? _.map_to == "auto" ? m = { start_date: "start_date", end_date: "end_date", duration: "duration" } : typeof _.map_to == "string" && (m = { start_date: _.map_to }) : _.type === "constraint" && (_.map_to && typeof _.map_to != "string" || (m = { constraint_type: "constraint_type", constraint_date: "constraint_date" })), m;
  }, t.getLightboxValues = function() {
    var _ = {};
    t.isTaskExists(this._lightbox_id) && (_ = this.mixin({}, this.getTask(this._lightbox_id)));
    for (var m = this._get_typed_lightbox_config(), p = 0; p < m.length; p++) {
      var k = t._lightbox_root.querySelector("#" + m[p].id);
      k = k && k.nextSibling;
      var $ = this.form_blocks[m[p].type];
      if ($) {
        var w = $.get_value.call(this, k, _, m[p]), x = t._resolve_default_mapping(m[p]);
        if (typeof x == "string" && x != "auto") _[x] = w;
        else if (typeof x == "object") for (var S in x) x[S] && (_[x[S]] = w[S]);
      }
    }
    return t._lightbox_current_type && (_.type = t._lightbox_current_type), _;
  }, t.hideLightbox = function() {
    var _ = this.getLightbox();
    _ && (_.style.display = "none"), this._waiAria.lightboxHiddenAttr(_), this._lightbox_id = null, this.hideCover(_), this.resetLightbox(), this.callEvent("onAfterLightbox", []);
  }, t.hideCover = function(_) {
    _ && (_.style.display = "none"), this._cover && this._cover.parentNode.removeChild(this._cover), this._cover = null;
  }, t.resetLightbox = function() {
    t._lightbox && !t._custom_lightbox && t._lightbox.remove(), t._lightbox = null;
  }, t._set_lightbox_values = function(_, m) {
    var p = _, k = m.getElementsByTagName("span"), $ = [];
    t.templates.lightbox_header ? ($.push(""), $.push(t.templates.lightbox_header(p.start_date, p.end_date, p)), k[1].innerHTML = "", k[2].innerHTML = t.templates.lightbox_header(p.start_date, p.end_date, p)) : ($.push(this.templates.task_time(p.start_date, p.end_date, p)), $.push(String(this.templates.task_text(p.start_date, p.end_date, p) || "").substr(0, 70)), k[1].innerHTML = this.templates.task_time(p.start_date, p.end_date, p), k[2].innerHTML = String(this.templates.task_text(p.start_date, p.end_date, p) || "").substr(0, 70)), k[1].innerHTML = $[0], k[2].innerHTML = $[1], t._waiAria.lightboxHeader(m, $.join(" "));
    for (var w = this._get_typed_lightbox_config(this.getLightboxType()), x = 0; x < w.length; x++) {
      var S = w[x];
      if (this.form_blocks[S.type]) {
        var T = t._lightbox_root.querySelector("#" + S.id).nextSibling, E = this.form_blocks[S.type], C = t._resolve_default_mapping(w[x]), D = this.defined(p[C]) ? p[C] : S.default_value;
        E.set_value.call(t, T, D, p, S), S.focus && E.focus.call(t, T);
      }
    }
    t.isTaskExists(_.id) && (t._lightbox_id = _.id);
  }, t._fill_lightbox = function(_, m) {
    var p = this.getTask(_);
    this._set_lightbox_values(p, m);
  }, t.getLightboxSection = function(_) {
    for (var m = this._get_typed_lightbox_config(), p = 0; p < m.length && m[p].name != _; p++) ;
    var k = m[p];
    if (!k) return null;
    this._lightbox || this.getLightbox();
    var $ = t._lightbox_root.querySelector("#" + k.id), w = $.nextSibling, x = { section: k, header: $, node: w, getValue: function(T) {
      return t.form_blocks[k.type].get_value.call(t, w, T || {}, k);
    }, setValue: function(T, E) {
      return t.form_blocks[k.type].set_value.call(t, w, T, E || {}, k);
    } }, S = this._lightbox_methods["get_" + k.type + "_control"];
    return S ? S(x) : x;
  }, t._lightbox_methods.get_template_control = function(_) {
    return _.control = _.node, _;
  }, t._lightbox_methods.get_select_control = function(_) {
    return _.control = _.node.getElementsByTagName("select")[0], _;
  }, t._lightbox_methods.get_textarea_control = function(_) {
    return _.control = _.node.getElementsByTagName("textarea")[0], _;
  }, t._lightbox_methods.get_time_control = function(_) {
    return _.control = _.node.getElementsByTagName("select"), _;
  }, t._init_dnd_events = function() {
    var _ = t._lightbox_root;
    this.event(_, "mousemove", t._move_while_dnd), this.event(_, "mouseup", t._finish_dnd), this.event(_, "touchmove", function(m) {
      t._move_while_dnd(m.touches[0]);
    }), this.event(_, "touchend", function(m) {
      t._finish_dnd(m.touches[0]);
    });
  }, t._move_while_dnd = function(_) {
    if (t._dnd_start_lb) {
      document.gantt_unselectable || (t._lightbox_root.className += " gantt_unselectable", document.gantt_unselectable = !0);
      var m = t.getLightbox(), p = [_.pageX, _.pageY];
      m.style.top = t._lb_start[1] + p[1] - t._dnd_start_lb[1] + "px", m.style.left = t._lb_start[0] + p[0] - t._dnd_start_lb[0] + "px";
    }
  }, t._ready_to_dnd = function(_) {
    var m = t.getLightbox();
    t._lb_start = [m.offsetLeft, m.offsetTop], t._dnd_start_lb = [_.pageX, _.pageY];
  }, t._finish_dnd = function() {
    t._lb_start && (t._lb_start = t._dnd_start_lb = !1, t._lightbox_root.className = t._lightbox_root.className.replace(" gantt_unselectable", ""), document.gantt_unselectable = !1);
  }, t._focus = function(_, m) {
    if (_ && _.focus && !t.config.touch) try {
      m && _.select && _.select(), _.focus();
    } catch {
    }
  }, t.form_blocks = { getTimePicker: function(_, m) {
    var p, k, $, w = "", x = this.config, S = { first: 0, last: 1440, date: this.date.date_part(new Date(t._min_date.valueOf())), timeFormat: v(_) };
    for (_._time_format_order = { size: 0 }, t.config.limit_time_select && (S.first = 60 * x.first_hour, S.last = 60 * x.last_hour + 1, S.date.setHours(x.first_hour)), p = 0; p < S.timeFormat.length; p++) p > 0 && (w += " "), (k = b(_, p, S)) && ($ = t._waiAria.lightboxSelectAttrString(S.timeFormat[p]), w += "<select " + (_.readonly ? "disabled='disabled'" : "") + (m ? " style='display:none' " : "") + $ + ">" + k + "</select>");
    return w;
  }, getTimePickerValue: function(_, m, p) {
    var k, $ = m._time_format_order, w = 0, x = 0, S = p || 0;
    return t.defined($[3]) && (k = parseInt(_[$[3] + S].value, 10), w = Math.floor(k / 60), x = k % 60), new Date(_[$[2] + S].value, _[$[1] + S].value, _[$[0] + S].value, w, x);
  }, _fill_lightbox_select: function(_, m, p, k) {
    if (_[m + k[0]].value = p.getDate(), _[m + k[1]].value = p.getMonth(), _[m + k[2]].value = p.getFullYear(), t.defined(k[3])) {
      var $ = 60 * p.getHours() + p.getMinutes();
      $ = Math.round($ / t._get_timepicker_step()) * t._get_timepicker_step();
      var w = _[m + k[3]];
      w.value = $, w.setAttribute("data-value", $);
    }
  }, template: new e(), textarea: new n(), select: new a(), time: new i(), duration: new o(), parent: new l(), radio: new s(), checkbox: new r(), resources: new d(), constraint: new c(), baselines: new h(), typeselect: new u() }, t._is_lightbox_timepicker = function() {
    for (var _ = this._get_typed_lightbox_config(), m = 0; m < _.length; m++) if (_[m].name == "time" && _[m].type == "time") return !0;
    return !1;
  }, t._simple_confirm = function(_, m, p, k) {
    if (!_) return p();
    var $ = { text: _ };
    m && ($.title = m), k && ($.ok = k), p && ($.callback = function(w) {
      w && p();
    }), t.confirm($);
  }, t._get_typed_lightbox_config = function(_) {
    _ === void 0 && (_ = this.getLightboxType());
    var m = f.call(this, _);
    return t.config.lightbox[m + "_sections"] ? t.config.lightbox[m + "_sections"] : t.config.lightbox.sections;
  }, t._silent_redraw_lightbox = function(_) {
    var m = this.getLightboxType();
    if (this.getState().lightbox) {
      var p = this.getState().lightbox, k = this.getLightboxValues(), $ = this.copy(this.getTask(p));
      this.resetLightbox();
      var w = this.mixin($, k, !0), x = this.getLightbox(_ || void 0);
      this._set_lightbox_values(w, x), this.showCover(x);
    } else this.resetLightbox(), this.getLightbox(_ || void 0);
    this.callEvent("onLightboxChange", [m, this.getLightboxType()]);
  };
}
function er(t) {
  if (!mt.isNode) {
    t.utils = { arrayFind: Pn, dom: sn };
    var e = we();
    t.event = e.attach, t.eventRemove = e.detach, t._eventRemoveAll = e.detachAll, t._createDomEventScope = e.extend, N(t, da(t));
    var n = Ua.init(t);
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
        var g = a(u);
        return g && !g.$config.hidden ? g : null;
      }
      function s(u) {
        var h = null, g = !1;
        return [".gantt_drag_marker.gantt_grid_resize_area", ".gantt_drag_marker .gantt_row.gantt_row_task", ".gantt_drag_marker.gantt_grid_dnd_marker"].forEach(function(f) {
          g = g || !!document.querySelector(f);
        }), (h = g ? a(u) : r(u)) ? l(u, h, "scrollY") : null;
      }
      function o(u) {
        var h = r(u);
        return h && h.id != "grid" ? l(u, h, "scrollX") : null;
      }
      function l(u, h, g) {
        var f = h.$config[g];
        return u.$ui.getView(f);
      }
      var d = "DEFAULT_VALUE";
      function c(u, h, g, f) {
        var y = u(this);
        return y && y.isVisible() ? y[h].apply(y, g) : f ? f() : d;
      }
      return { getColumnIndex: function(u) {
        var h = c.call(this, a, "getColumnIndex", [u]);
        return h === d ? 0 : h;
      }, dateFromPos: function(u) {
        var h = c.call(this, i, "dateFromPos", Array.prototype.slice.call(arguments));
        return h === d ? this.getState().min_date : h;
      }, posFromDate: function(u) {
        var h = c.call(this, i, "posFromDate", [u]);
        return h === d ? 0 : h;
      }, getRowTop: function(u) {
        var h = this, g = c.call(h, i, "getRowTop", [u], function() {
          return c.call(h, a, "getRowTop", [u]);
        });
        return g === d ? 0 : g;
      }, getTaskTop: function(u) {
        var h = this, g = c.call(h, i, "getItemTop", [u], function() {
          return c.call(h, a, "getItemTop", [u]);
        });
        return g === d ? 0 : g;
      }, getTaskPosition: function(u, h, g) {
        var f = c.call(this, i, "getItemPosition", [u, h, g]);
        return f === d ? { left: 0, top: this.getTaskTop(u.id), height: this.getTaskBarHeight(u.id), width: 0 } : f;
      }, getTaskBarHeight: function(u, h) {
        var g = this, f = c.call(g, i, "getBarHeight", [u, h], function() {
          return c.call(g, a, "getItemHeight", [u]);
        });
        return f === d ? 0 : f;
      }, getTaskHeight: function(u) {
        var h = this, g = c.call(h, i, "getItemHeight", [u], function() {
          return c.call(h, a, "getItemHeight", [u]);
        });
        return g === d ? 0 : g;
      }, columnIndexByDate: function(u) {
        var h = c.call(this, i, "columnIndexByDate", [u]);
        return h === d ? 0 : h;
      }, roundTaskDates: function() {
        c.call(this, i, "roundTaskDates", []);
      }, getScale: function() {
        var u = c.call(this, i, "getScale", []);
        return u === d ? null : u;
      }, getTaskNode: function(u) {
        var h = i(this);
        if (h && h.isVisible()) {
          var g = h._taskRenderer.rendered[u];
          if (!g) {
            var f = h.$config.item_attribute;
            g = h.$task_bars.querySelector("[" + f + "='" + u + "']");
          }
          return g || null;
        }
        return null;
      }, getLinkNode: function(u) {
        var h = i(this);
        return h.isVisible() ? h._linkRenderer.rendered[u] : null;
      }, scrollTo: function(u, h) {
        var g = s(this), f = o(this), y = { position: 0 }, v = { position: 0 };
        g && (v = g.getScrollState()), f && (y = f.getScrollState());
        var b = f && 1 * u == u, _ = g && 1 * h == h;
        if (b && _) for (var m = g._getLinkedViews(), p = f._getLinkedViews(), k = [], $ = 0; $ < m.length; $++) for (var w = 0; w < p.length; w++) m[$].$config.id && p[w].$config.id && m[$].$config.id === p[w].$config.id && k.push(m[$].$config.id);
        b && (k && k.forEach((function(T) {
          this.$ui.getView(T).$config.$skipSmartRenderOnScroll = !0;
        }).bind(this)), f.scroll(u), k && k.forEach((function(T) {
          this.$ui.getView(T).$config.$skipSmartRenderOnScroll = !1;
        }).bind(this))), _ && g.scroll(h);
        var x = { position: 0 }, S = { position: 0 };
        g && (x = g.getScrollState()), f && (S = f.getScrollState()), this.callEvent("onGanttScroll", [y.position, v.position, S.position, x.position]);
      }, showDate: function(u) {
        var h = this.posFromDate(u), g = Math.max(h - this.config.task_scroll_offset, 0);
        this.scrollTo(g);
      }, showTask: function(u) {
        var h = this.getTaskPosition(this.getTask(u)), g = h.left;
        this.config.rtl && (g = h.left + h.width);
        var f, y = Math.max(g - this.config.task_scroll_offset, 0), v = this._scroll_state().y;
        f = v ? h.top - (v - this.getTaskBarHeight(u)) / 2 : h.top, this.scrollTo(y, f);
        var b = a(this), _ = i(this);
        b && _ && b.$config.scrollY != _.$config.scrollY && l(this, b, "scrollY").scrollTo(null, f);
      }, _scroll_state: function() {
        var u = { x: !1, y: !1, x_pos: 0, y_pos: 0, scroll_size: this.config.scroll_size + 1, x_inner: 0, y_inner: 0 }, h = s(this), g = o(this);
        if (g) {
          var f = g.getScrollState();
          f.visible && (u.x = f.size, u.x_inner = f.scrollSize), u.x_pos = f.position || 0;
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
      }, scrollLayoutCell: function(u, h, g) {
        const f = this.$ui.getView(u);
        if (!f) return !1;
        if (h !== null) {
          const y = this.$ui.getView(f.$config.scrollX);
          y && y.scrollTo(h, null);
        }
        if (g !== null) {
          const y = this.$ui.getView(f.$config.scrollY);
          y && y.scrollTo(null, g);
        }
      } };
    }()), function(i) {
      i.resetSkin || (i.resetSkin = function() {
        this.skin = "", oe(!0, this);
      }, i.skins = {}, i.attachEvent("onGanttLayoutReady", function() {
        oe(!1, this), r();
      })), i._addThemeClass = function() {
        document.documentElement.setAttribute("data-gantt-theme", i.skin);
      }, i.setSkin = function(s) {
        this.skin = s, i._addThemeClass(), r(), i.$root && (oe(!0, i), this.render());
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
      for (var a = [qa, Ga, Ya], r = 0; r < a.length; r++) a[r] && a[r](i);
      i.ext.zoom = new Xa(i);
    }(t), Za(t), tr(t), function(i) {
      i._extend_to_optional = function(a) {
        var r = a, s = { render: r.render, focus: r.focus, set_value: function(o, l, d, c) {
          var u = i._resolve_default_mapping(c);
          if (!d[u.start_date] || u.start_date == "start_date" && this._isAllowedUnscheduledTask(d)) {
            s.disable(o, c);
            var h = {};
            for (var g in u) h[u[g]] = d[g];
            return r.set_value.call(i, o, l, h, c);
          }
          return s.enable(o, c), r.set_value.call(i, o, l, d, c);
        }, get_value: function(o, l, d) {
          return d.disabled ? { start_date: null } : r.get_value.call(i, o, l, d);
        }, update_block: function(o, l) {
          if (i.callEvent("onSectionToggle", [i._lightbox_id, l]), o.style.display = l.disabled ? "none" : "", l.button) {
            var d = o.previousSibling.querySelector(".gantt_custom_button_label"), c = i.locale.labels, u = l.disabled ? c[l.name + "_enable_button"] : c[l.name + "_disable_button"];
            d.innerHTML = u;
          }
        }, disable: function(o, l) {
          l.disabled = !0, s.update_block(o, l);
        }, enable: function(o, l) {
          l.disabled = !1, s.update_block(o, l);
        }, button_click: function(o, l, d, c) {
          if (i.callEvent("onSectionButton", [i._lightbox_id, d]) !== !1) {
            var u = i._get_typed_lightbox_config()[o];
            u.disabled ? s.enable(c, u) : s.disable(c, u);
          }
        } };
        return s;
      }, i.form_blocks.duration_optional = i._extend_to_optional(i.form_blocks.duration), i.form_blocks.time_optional = i._extend_to_optional(i.form_blocks.time);
    }(t), function(i) {
      var a = new RegExp(`<(?:.|
)*?>`, "gm"), r = new RegExp(" +", "gm");
      function s(c) {
        return (c + "").replace(a, " ").replace(r, " ");
      }
      var o = new RegExp("'", "gm");
      function l(c) {
        return (c + "").replace(o, "&#39;");
      }
      for (var d in i._waiAria = { getAttributeString: function(c) {
        var u = [" "];
        for (var h in c) {
          var g = l(s(c[h]));
          u.push(h + "='" + g + "'");
        }
        return u.push(" "), u.join(" ");
      }, getTimelineCellAttr: function(c) {
        return i._waiAria.getAttributeString({ "aria-label": c });
      }, _taskCommonAttr: function(c, u) {
        c.start_date && c.end_date && (u.setAttribute("aria-label", s(i.templates.tooltip_text(c.start_date, c.end_date, c))), c.$dataprocessor_class && u.setAttribute("aria-busy", !0));
      }, setTaskBarAttr: function(c, u) {
        this._taskCommonAttr(c, u), u.setAttribute("role", "img"), !i.isReadonly(c) && i.config.drag_move && (c.id != i.getState("tasksDnd").drag_id ? u.setAttribute("aria-grabbed", !1) : u.setAttribute("aria-grabbed", !0));
      }, taskRowAttr: function(c, u) {
        this._taskCommonAttr(c, u), !i.isReadonly(c) && i.config.order_branch && u.setAttribute("aria-grabbed", !1), u.setAttribute("role", "row"), u.setAttribute("aria-selected", i.isSelectedTask(c.id) ? "true" : "false"), u.setAttribute("aria-level", c.$level + 1 || 1), i.hasChild(c.id) && u.setAttribute("aria-expanded", c.$open ? "true" : "false");
      }, linkAttr: function(c, u) {
        var h = i.config.links, g = c.type == h.finish_to_start || c.type == h.start_to_start, f = c.type == h.start_to_start || c.type == h.start_to_finish, y = i.locale.labels.link + " " + i.templates.drag_link(c.source, f, c.target, g);
        u.setAttribute("role", "img"), u.setAttribute("aria-label", s(y)), i.isReadonly(c) && u.setAttribute("aria-readonly", !0);
      }, gridSeparatorAttr: function(c) {
        c.setAttribute("role", "columnheader");
      }, rowResizerAttr: function(c) {
        c.setAttribute("role", "row");
      }, lightboxHiddenAttr: function(c) {
        c.setAttribute("aria-hidden", "true");
      }, lightboxVisibleAttr: function(c) {
        c.setAttribute("aria-hidden", "false");
      }, lightboxAttr: function(c) {
        c.setAttribute("role", "dialog"), c.setAttribute("aria-hidden", "true"), c.firstChild.setAttribute("role", "heading"), c.firstChild.setAttribute("aria-level", "1");
      }, lightboxButtonAttrString: function(c) {
        return this.getAttributeString({ role: "button", "aria-label": i.locale.labels[c], tabindex: "0" });
      }, lightboxHeader: function(c, u) {
        c.setAttribute("aria-label", u);
      }, lightboxSelectAttrString: function(c) {
        var u = "";
        switch (c) {
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
      }, lightboxDurationInputAttrString: function(c) {
        return this.getAttributeString({ "aria-label": i.locale.labels.column_duration, "aria-valuemin": "0", role: "spinbutton" });
      }, inlineEditorAttr: function(c) {
        c.setAttribute("role", "row");
      }, gridAttrString: function() {
        return [" role='treegrid'", i.config.multiselect ? "aria-multiselectable='true'" : "aria-multiselectable='false'", " "].join(" ");
      }, gridScaleRowAttrString: function() {
        return "role='row'";
      }, gridScaleCellAttrString: function(c, u) {
        var h = "";
        if (c.name == "add") h = this.getAttributeString({ role: "columnheader", "aria-label": i.locale.labels.new_task });
        else {
          var g = { role: "columnheader", "aria-label": u };
          i._sort && i._sort.name == c.name && (i._sort.direction == "asc" ? g["aria-sort"] = "ascending" : g["aria-sort"] = "descending"), h = this.getAttributeString(g);
        }
        return h;
      }, gridDataAttrString: function() {
        return "role='rowgroup'";
      }, reorderMarkerAttr: function(c) {
        c.setAttribute("role", "grid"), c.firstChild.removeAttribute("aria-level"), c.firstChild.setAttribute("aria-grabbed", "true");
      }, gridCellAttrString: function(c, u, h) {
        var g = { role: "gridcell", "aria-label": u };
        return c.editor && !i.isReadonly(h) || (g["aria-readonly"] = !0), this.getAttributeString(g);
      }, gridAddButtonAttrString: function(c) {
        return this.getAttributeString({ role: "button", "aria-label": i.locale.labels.new_task });
      }, messageButtonAttrString: function(c) {
        return "tabindex='0' role='button' aria-label='" + c + "'";
      }, messageInfoAttr: function(c) {
        c.setAttribute("role", "alert");
      }, messageModalAttr: function(c, u) {
        c.setAttribute("role", "dialog"), u && c.setAttribute("aria-labelledby", u);
      }, quickInfoAttr: function(c) {
        c.setAttribute("role", "dialog");
      }, quickInfoHeaderAttrString: function() {
        return " role='heading' aria-level='1' ";
      }, quickInfoHeader: function(c, u) {
        c.setAttribute("aria-label", u);
      }, quickInfoButtonAttrString: function(c) {
        return i._waiAria.getAttributeString({ role: "button", "aria-label": c, tabindex: "0" });
      }, tooltipAttr: function(c) {
        c.setAttribute("role", "tooltip");
      }, tooltipVisibleAttr: function(c) {
        c.setAttribute("aria-hidden", "false");
      }, tooltipHiddenAttr: function(c) {
        c.setAttribute("aria-hidden", "true");
      } }, i._waiAria) i._waiAria[d] = /* @__PURE__ */ function(c) {
        return function() {
          return i.config.wai_aria_attributes ? c.apply(this, arguments) : "";
        };
      }(i._waiAria[d]);
    }(t), t.locate = function(i) {
      var a = yt(i);
      if (dt(a, ".gantt_task_row")) return null;
      var r = arguments[1] || this.config.task_attribute, s = tt(a, r);
      return s ? s.getAttribute(r) : null;
    }, t._locate_css = function(i, a, r) {
      return pt(i, a, r);
    }, t._locateHTML = function(i, a) {
      return tt(i, a || this.config.task_attribute);
    };
  }
  t.attachEvent("onParse", function() {
    j(t) || t.attachEvent("onGanttRender", function() {
      if (t.config.initial_scroll) {
        var i = t.getTaskByIndex(0), a = i ? i.id : t.config.root_id;
        t.isTaskExists(a) && t.$task && t.utils.dom.isChildOf(t.$task, t.$container) && t.showTask(a);
      }
    }, { once: !0 });
  }), t.attachEvent("onBeforeGanttReady", function() {
    this.config.scroll_size || (this.config.scroll_size = Ze() || 15), j(t) || (this._eventRemoveAll(), this.$mouseEvents.reset(), this.resetLightbox());
  }), t.attachEvent("onGanttReady", function() {
    !j(t) && t.config.rtl && t.$layout.getCellsByType("viewCell").forEach(function(i) {
      var a = i.$config.scrollX;
      if (a) {
        var r = t.$ui.getView(a);
        r && r.scrollTo(r.$config.scrollSize, 0);
      }
    });
  }), t.attachEvent("onGanttReady", function() {
    if (!j(t)) {
      var i = t.plugins(), a = { auto_scheduling: t.autoSchedule, click_drag: t.ext.clickDrag, critical_path: t.isCriticalTask, drag_timeline: t.ext.dragTimeline, export_api: t.exportToPDF, fullscreen: t.ext.fullscreen, grouping: t.groupBy, keyboard_navigation: t.ext.keyboardNavigation, marker: t.addMarker, multiselect: t.eachSelectedTask, overlay: t.ext.overlay, quick_info: t.templates.quick_info_content, tooltip: t.ext.tooltips, undo: t.undo };
      for (let r in a) a[r] && !i[r] && console.warn(`You connected the '${r}' extension via an obsolete file. 
To fix it, you need to remove the obsolete file and connect the extension via the plugins method: https://docs.dhtmlx.com/gantt/api__gantt_plugins.html`);
    }
  });
}
const nr = lt.gantt = function(t) {
  var e = la(t);
  return e.env.isNode || (er(e), function(n) {
    n.load = function(i, a, r) {
      this._load_url = i, this.assert(arguments.length, "Invalid load arguments");
      var s = "json", o = null;
      return arguments.length >= 3 ? (s = a, o = r) : typeof arguments[1] == "string" ? s = arguments[1] : typeof arguments[1] == "function" && (o = arguments[1]), this._load_type = s, this.callEvent("onLoadStart", [i, s]), this.ajax.get(i, n.bind(function(l) {
        this.on_load(l, s), this.callEvent("onLoadEnd", [i, s]), typeof o == "function" && o.call(this);
      }, this));
    };
  }(e)), e;
}(Un);
export {
  nr as default,
  nr as gantt
};
//# sourceMappingURL=dhtmlxgantt.es.js.map
