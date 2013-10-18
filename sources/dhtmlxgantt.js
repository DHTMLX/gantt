/*
This software is allowed to use under GPL or you need to obtain Commercial or Enterise License 
 to use it in non-GPL project. Please contact sales@dhtmlx.com for details
*/
/*jsl:ignore*/
dhtmlx=function(obj){
    for (var a in obj) dhtmlx[a]=obj[a];
    return dhtmlx; //simple singleton
};
dhtmlx.extend_api=function(name,map,ext){
    var t = window[name];
    if (!t) return; //component not defined
    window[name]=function(obj){
        if (obj && typeof obj == "object" && !obj.tagName){
            var that = t.apply(this,(map._init?map._init(obj):arguments));
            //global settings
            for (var a in dhtmlx)
                if (map[a]) this[map[a]](dhtmlx[a]);
            //local settings
            for (var a in obj){
                if (map[a]) this[map[a]](obj[a]);
                else if (a.indexOf("on")==0){
                    this.attachEvent(a,obj[a]);
                }
            }
        } else
            var that = t.apply(this,arguments);
        if (map._patch) map._patch(this);
        return that||this;
    };
    window[name].prototype=t.prototype;
    if (ext)
        dhtmlXHeir(window[name].prototype,ext);
};

dhtmlxAjax={
    get:function(url,callback){
        var t=new dtmlXMLLoaderObject(true);
        t.async=(arguments.length<3);
        t.waitCall=callback;
        t.loadXML(url)
        return t;
    },
    post:function(url,post,callback){
        var t=new dtmlXMLLoaderObject(true);
        t.async=(arguments.length<4);
        t.waitCall=callback;
        t.loadXML(url,true,post)
        return t;
    },
    getSync:function(url){
        return this.get(url,null,true)
    },
    postSync:function(url,post){
        return this.post(url,post,null,true);
    }
}

/**
 *     @desc: xmlLoader object
 *     @type: private
 *     @param: funcObject - xml parser function
 *     @param: object - jsControl object
 *     @param: async - sync/async mode (async by default)
 *     @param: rSeed - enable/disable random seed ( prevent IE caching)
 *     @topic: 0
 */
function dtmlXMLLoaderObject(funcObject, dhtmlObject, async, rSeed){
    this.xmlDoc="";

    if (typeof (async) != "undefined")
        this.async=async;
    else
        this.async=true;

    this.onloadAction=funcObject||null;
    this.mainObject=dhtmlObject||null;
    this.waitCall=null;
    this.rSeed=rSeed||false;
    return this;
};

dtmlXMLLoaderObject.count = 0;

/**
 *     @desc: xml loading handler
 *     @type: private
 *     @param: dtmlObject - xmlLoader object
 *     @topic: 0
 */
dtmlXMLLoaderObject.prototype.waitLoadFunction=function(dhtmlObject){
    var once = true;
    this.check=function (){
        if ((dhtmlObject)&&(dhtmlObject.onloadAction != null)){
            if ((!dhtmlObject.xmlDoc.readyState)||(dhtmlObject.xmlDoc.readyState == 4)){
                if (!once)
                    return;

                once=false; //IE 5 fix
                dtmlXMLLoaderObject.count++;
                if (typeof dhtmlObject.onloadAction == "function")
                    dhtmlObject.onloadAction(dhtmlObject.mainObject, null, null, null, dhtmlObject);

                if (dhtmlObject.waitCall){
                    dhtmlObject.waitCall.call(this,dhtmlObject);
                    dhtmlObject.waitCall=null;
                }
            }
        }
    };
    return this.check;
};

/**
 *     @desc: return XML top node
 *     @param: tagName - top XML node tag name (not used in IE, required for Safari and Mozilla)
 *     @type: private
 *     @returns: top XML node
 *     @topic: 0
 */
dtmlXMLLoaderObject.prototype.getXMLTopNode=function(tagName, oldObj){
    if (this.xmlDoc.responseXML){
        var temp = this.xmlDoc.responseXML.getElementsByTagName(tagName);
        if(temp.length==0 && tagName.indexOf(":")!=-1)
            var temp = this.xmlDoc.responseXML.getElementsByTagName((tagName.split(":"))[1]);
        var z = temp[0];
    } else
        var z = this.xmlDoc.documentElement;

    if (z){
        this._retry=false;
        return z;
    }

    if (!this._retry&&_isIE){
        this._retry=true;
        var oldObj = this.xmlDoc;
        this.loadXMLString(this.xmlDoc.responseText.replace(/^[\s]+/,""), true);
        return this.getXMLTopNode(tagName, oldObj);
    }

    dhtmlxError.throwError("LoadXML", "Incorrect XML", [
        (oldObj||this.xmlDoc),
        this.mainObject
    ]);

    return document.createElement("DIV");
};

/**
 *     @desc: load XML from string
 *     @type: private
 *     @param: xmlString - xml string
 *     @topic: 0
 */
dtmlXMLLoaderObject.prototype.loadXMLString=function(xmlString, silent){

    if (!_isIE){
        var parser = new DOMParser();
        this.xmlDoc=parser.parseFromString(xmlString, "text/xml");
    } else {
        this.xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        this.xmlDoc.async=this.async;
        this.xmlDoc.onreadystatechange = function(){};
        this.xmlDoc["loadXM"+"L"](xmlString);
    }

    if (silent)
        return;

    if (this.onloadAction)
        this.onloadAction(this.mainObject, null, null, null, this);

    if (this.waitCall){
        this.waitCall();
        this.waitCall=null;
    }
}
/**
 *     @desc: load XML
 *     @type: private
 *     @param: filePath - xml file path
 *     @param: postMode - send POST request
 *     @param: postVars - list of vars for post request
 *     @topic: 0
 */
dtmlXMLLoaderObject.prototype.loadXML=function(filePath, postMode, postVars, rpc){
    if (this.rSeed)
        filePath+=((filePath.indexOf("?") != -1) ? "&" : "?")+"a_dhx_rSeed="+(new Date()).valueOf();
    this.filePath=filePath;

    if ((!_isIE)&&(window.XMLHttpRequest))
        this.xmlDoc=new XMLHttpRequest();
    else {
        this.xmlDoc=new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (this.async)
        this.xmlDoc.onreadystatechange=new this.waitLoadFunction(this);
    this.xmlDoc.open(postMode ? "POST" : "GET", filePath, this.async);

    if (rpc){
        this.xmlDoc.setRequestHeader("User-Agent", "dhtmlxRPC v0.1 ("+navigator.userAgent+")");
        this.xmlDoc.setRequestHeader("Content-type", "text/xml");
    }

    else if (postMode)
        this.xmlDoc.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    this.xmlDoc.setRequestHeader("X-Requested-With","XMLHttpRequest");
    this.xmlDoc.send(null||postVars);

    if (!this.async)
        (new this.waitLoadFunction(this))();
};
/**
 *     @desc: destructor, cleans used memory
 *     @type: private
 *     @topic: 0
 */
dtmlXMLLoaderObject.prototype.destructor=function(){
    this._filterXPath = null;
    this._getAllNamedChilds = null;
    this._retry = null;
    this.async = null;
    this.rSeed = null;
    this.filePath = null;
    this.onloadAction = null;
    this.mainObject = null;
    this.xmlDoc = null;
    this.doXPath = null;
    this.doXPathOpera = null;
    this.doXSLTransToObject = null;
    this.doXSLTransToString = null;
    this.loadXML = null;
    this.loadXMLString = null;
    // this.waitLoadFunction = null;
    this.doSerialization = null;
    this.xmlNodeToJSON = null;
    this.getXMLTopNode = null;
    this.setXSLParamValue = null;
    return null;
}

dtmlXMLLoaderObject.prototype.xmlNodeToJSON = function(node){
    var t={};
    for (var i=0; i<node.attributes.length; i++)
        t[node.attributes[i].name]=node.attributes[i].value;
    t["_tagvalue"]=node.firstChild?node.firstChild.nodeValue:"";
    for (var i=0; i<node.childNodes.length; i++){
        var name=node.childNodes[i].tagName;
        if (name){
            if (!t[name]) t[name]=[];
            t[name].push(this.xmlNodeToJSON(node.childNodes[i]));
        }
    }
    return t;
}

/**
 *     @desc: Call wrapper
 *     @type: private
 *     @param: funcObject - action handler
 *     @param: dhtmlObject - user data
 *     @returns: function handler
 *     @topic: 0
 */
function callerFunction(funcObject, dhtmlObject){
    this.handler=function(e){
        if (!e)
            e=window.event;
        funcObject(e, dhtmlObject);
        return true;
    };
    return this.handler;
};

/**
 *     @desc: Calculate absolute position of html object
 *     @type: private
 *     @param: htmlObject - html object
 *     @topic: 0
 */
function getAbsoluteLeft(htmlObject){
    return getOffset(htmlObject).left;
}
/**
 *     @desc: Calculate absolute position of html object
 *     @type: private
 *     @param: htmlObject - html object
 *     @topic: 0
 */
function getAbsoluteTop(htmlObject){
    return getOffset(htmlObject).top;
}

function getOffsetSum(elem) {
    var top=0, left=0;
    while(elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }
    return {top: top, left: left};
}
function getOffsetRect(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return { top: Math.round(top), left: Math.round(left) };
}
function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        return getOffsetRect(elem);
    } else {
        return getOffsetSum(elem);
    }
}

/**
 *     @desc: Convert string to it boolean representation
 *     @type: private
 *     @param: inputString - string for covertion
 *     @topic: 0
 */
function convertStringToBoolean(inputString){
    if (typeof (inputString) == "string")
        inputString=inputString.toLowerCase();

    switch (inputString){
        case "1":
        case "true":
        case "yes":
        case "y":
        case 1:
        case true:
            return true;
            break;

        default: return false;
    }
}

/**
 *     @desc: find out what symbol to use as url param delimiters in further params
 *     @type: private
 *     @param: str - current url string
 *     @topic: 0
 */
function getUrlSymbol(str){
    if (str.indexOf("?") != -1)
        return "&"
    else
        return "?"
}

function dhtmlDragAndDropObject(){
    if (window.dhtmlDragAndDrop)
        return window.dhtmlDragAndDrop;

    this.lastLanding=0;
    this.dragNode=0;
    this.dragStartNode=0;
    this.dragStartObject=0;
    this.tempDOMU=null;
    this.tempDOMM=null;
    this.waitDrag=0;
    window.dhtmlDragAndDrop=this;

    return this;
};

dhtmlDragAndDropObject.prototype.removeDraggableItem=function(htmlNode){
    htmlNode.onmousedown=null;
    htmlNode.dragStarter=null;
    htmlNode.dragLanding=null;
}
dhtmlDragAndDropObject.prototype.addDraggableItem=function(htmlNode, dhtmlObject){
    htmlNode.onmousedown=this.preCreateDragCopy;
    htmlNode.dragStarter=dhtmlObject;
    this.addDragLanding(htmlNode, dhtmlObject);
}
dhtmlDragAndDropObject.prototype.addDragLanding=function(htmlNode, dhtmlObject){
    htmlNode.dragLanding=dhtmlObject;
}
dhtmlDragAndDropObject.prototype.preCreateDragCopy=function(e){
    if ((e||window.event) && (e||event).button == 2)
        return;

    if (window.dhtmlDragAndDrop.waitDrag){
        window.dhtmlDragAndDrop.waitDrag=0;
        document.body.onmouseup=window.dhtmlDragAndDrop.tempDOMU;
        document.body.onmousemove=window.dhtmlDragAndDrop.tempDOMM;
        return false;
    }

    if (window.dhtmlDragAndDrop.dragNode)
        window.dhtmlDragAndDrop.stopDrag(e);

    window.dhtmlDragAndDrop.waitDrag=1;
    window.dhtmlDragAndDrop.tempDOMU=document.body.onmouseup;
    window.dhtmlDragAndDrop.tempDOMM=document.body.onmousemove;
    window.dhtmlDragAndDrop.dragStartNode=this;
    window.dhtmlDragAndDrop.dragStartObject=this.dragStarter;
    document.body.onmouseup=window.dhtmlDragAndDrop.preCreateDragCopy;
    document.body.onmousemove=window.dhtmlDragAndDrop.callDrag;
    window.dhtmlDragAndDrop.downtime = new Date().valueOf();


    if ((e)&&(e.preventDefault)){
        e.preventDefault();
        return false;
    }
    return false;
};
dhtmlDragAndDropObject.prototype.callDrag=function(e){
    if (!e)
        e=window.event;
    dragger=window.dhtmlDragAndDrop;
    if ((new Date()).valueOf()-dragger.downtime<100) return;

    //if ((e.button == 0)&&(_isIE))
    //	return dragger.stopDrag();

    if (!dragger.dragNode){
        if (dragger.waitDrag){
            dragger.dragNode=dragger.dragStartObject._createDragNode(dragger.dragStartNode, e);

            if (!dragger.dragNode)
                return dragger.stopDrag();

            dragger.dragNode.onselectstart=function(){return false;}
            dragger.gldragNode=dragger.dragNode;
            document.body.appendChild(dragger.dragNode);
            document.body.onmouseup=dragger.stopDrag;
            dragger.waitDrag=0;
            dragger.dragNode.pWindow=window;
            dragger.initFrameRoute();
        }
        else return dragger.stopDrag(e, true);
    }

    if (dragger.dragNode.parentNode != window.document.body && dragger.gldragNode){
        var grd = dragger.gldragNode;

        if (dragger.gldragNode.old)
            grd=dragger.gldragNode.old;

        //if (!document.all) dragger.calculateFramePosition();
        grd.parentNode.removeChild(grd);
        var oldBody = dragger.dragNode.pWindow;

        if (grd.pWindow &&	grd.pWindow.dhtmlDragAndDrop.lastLanding)
            grd.pWindow.dhtmlDragAndDrop.lastLanding.dragLanding._dragOut(grd.pWindow.dhtmlDragAndDrop.lastLanding);

        //		var oldp=dragger.dragNode.parentObject;
        if (_isIE){
            var div = document.createElement("Div");
            div.innerHTML=dragger.dragNode.outerHTML;
            dragger.dragNode=div.childNodes[0];
        } else
            dragger.dragNode=dragger.dragNode.cloneNode(true);

        dragger.dragNode.pWindow=window;
        //		dragger.dragNode.parentObject=oldp;

        dragger.gldragNode.old=dragger.dragNode;
        document.body.appendChild(dragger.dragNode);
        oldBody.dhtmlDragAndDrop.dragNode=dragger.dragNode;
    }

    dragger.dragNode.style.left=e.clientX+15+(dragger.fx
        ? dragger.fx*(-1)
        : 0)
        +(document.body.scrollLeft||document.documentElement.scrollLeft)+"px";
    dragger.dragNode.style.top=e.clientY+3+(dragger.fy
        ? dragger.fy*(-1)
        : 0)
        +(document.body.scrollTop||document.documentElement.scrollTop)+"px";

    if (!e.srcElement)
        var z = e.target;
    else
        z=e.srcElement;
    dragger.checkLanding(z, e);
}

dhtmlDragAndDropObject.prototype.calculateFramePosition=function(n){
    //this.fx = 0, this.fy = 0;
    if (window.name){
        var el = parent.frames[window.name].frameElement.offsetParent;
        var fx = 0;
        var fy = 0;

        while (el){
            fx+=el.offsetLeft;
            fy+=el.offsetTop;
            el=el.offsetParent;
        }

        if ((parent.dhtmlDragAndDrop)){
            var ls = parent.dhtmlDragAndDrop.calculateFramePosition(1);
            fx+=ls.split('_')[0]*1;
            fy+=ls.split('_')[1]*1;
        }

        if (n)
            return fx+"_"+fy;
        else
            this.fx=fx;
        this.fy=fy;
    }
    return "0_0";
}
dhtmlDragAndDropObject.prototype.checkLanding=function(htmlObject, e){
    if ((htmlObject)&&(htmlObject.dragLanding)){
        if (this.lastLanding)
            this.lastLanding.dragLanding._dragOut(this.lastLanding);
        this.lastLanding=htmlObject;
        this.lastLanding=this.lastLanding.dragLanding._dragIn(this.lastLanding, this.dragStartNode, e.clientX,
            e.clientY, e);
        this.lastLanding_scr=(_isIE ? e.srcElement : e.target);
    } else {
        if ((htmlObject)&&(htmlObject.tagName != "BODY"))
            this.checkLanding(htmlObject.parentNode, e);
        else {
            if (this.lastLanding)
                this.lastLanding.dragLanding._dragOut(this.lastLanding, e.clientX, e.clientY, e);
            this.lastLanding=0;

            if (this._onNotFound)
                this._onNotFound();
        }
    }
}
dhtmlDragAndDropObject.prototype.stopDrag=function(e, mode){
    dragger=window.dhtmlDragAndDrop;

    if (!mode){
        dragger.stopFrameRoute();
        var temp = dragger.lastLanding;
        dragger.lastLanding=null;

        if (temp)
            temp.dragLanding._drag(dragger.dragStartNode, dragger.dragStartObject, temp, (_isIE
                ? event.srcElement
                : e.target));
    }
    dragger.lastLanding=null;

    if ((dragger.dragNode)&&(dragger.dragNode.parentNode == document.body))
        dragger.dragNode.parentNode.removeChild(dragger.dragNode);
    dragger.dragNode=0;
    dragger.gldragNode=0;
    dragger.fx=0;
    dragger.fy=0;
    dragger.dragStartNode=0;
    dragger.dragStartObject=0;
    document.body.onmouseup=dragger.tempDOMU;
    document.body.onmousemove=dragger.tempDOMM;
    dragger.tempDOMU=null;
    dragger.tempDOMM=null;
    dragger.waitDrag=0;
}

dhtmlDragAndDropObject.prototype.stopFrameRoute=function(win){
    if (win)
        window.dhtmlDragAndDrop.stopDrag(1, 1);

    for (var i = 0; i < window.frames.length; i++){
        try{
            if ((window.frames[i] != win)&&(window.frames[i].dhtmlDragAndDrop))
                window.frames[i].dhtmlDragAndDrop.stopFrameRoute(window);
        } catch(e){}
    }

    try{
        if ((parent.dhtmlDragAndDrop)&&(parent != window)&&(parent != win))
            parent.dhtmlDragAndDrop.stopFrameRoute(window);
    } catch(e){}
}
dhtmlDragAndDropObject.prototype.initFrameRoute=function(win, mode){
    if (win){
        window.dhtmlDragAndDrop.preCreateDragCopy();
        window.dhtmlDragAndDrop.dragStartNode=win.dhtmlDragAndDrop.dragStartNode;
        window.dhtmlDragAndDrop.dragStartObject=win.dhtmlDragAndDrop.dragStartObject;
        window.dhtmlDragAndDrop.dragNode=win.dhtmlDragAndDrop.dragNode;
        window.dhtmlDragAndDrop.gldragNode=win.dhtmlDragAndDrop.dragNode;
        window.document.body.onmouseup=window.dhtmlDragAndDrop.stopDrag;
        window.waitDrag=0;

        if (((!_isIE)&&(mode))&&((!_isFF)||(_FFrv < 1.8)))
            window.dhtmlDragAndDrop.calculateFramePosition();
    }
    try{
        if ((parent.dhtmlDragAndDrop)&&(parent != window)&&(parent != win))
            parent.dhtmlDragAndDrop.initFrameRoute(window);
    }catch(e){}

    for (var i = 0; i < window.frames.length; i++){
        try{
            if ((window.frames[i] != win)&&(window.frames[i].dhtmlDragAndDrop))
                window.frames[i].dhtmlDragAndDrop.initFrameRoute(window, ((!win||mode) ? 1 : 0));
        } catch(e){}
    }
}

_isFF = false;
_isIE = false;
_isOpera = false;
_isKHTML = false;
_isMacOS = false;
_isChrome = false;
_FFrv = false;
_KHTMLrv = false;
_OperaRv = false;

if (navigator.userAgent.indexOf('Macintosh') != -1)
    _isMacOS=true;


if (navigator.userAgent.toLowerCase().indexOf('chrome')>-1)
    _isChrome=true;

if ((navigator.userAgent.indexOf('Safari') != -1)||(navigator.userAgent.indexOf('Konqueror') != -1)){
    _KHTMLrv = parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Safari')+7, 5));

    if (_KHTMLrv > 525){ //mimic FF behavior for Safari 3.1+
        _isFF=true;
        _FFrv = 1.9;
    } else
        _isKHTML=true;
} else if (navigator.userAgent.indexOf('Opera') != -1){
    _isOpera=true;
    _OperaRv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Opera')+6, 3));
}


else if (navigator.appName.indexOf("Microsoft") != -1){
    _isIE=true;
    if ((navigator.appVersion.indexOf("MSIE 8.0")!= -1 || navigator.appVersion.indexOf("MSIE 9.0")!= -1 || navigator.appVersion.indexOf("MSIE 10.0")!= -1 ) && document.compatMode != "BackCompat"){
        _isIE=8;
    }
} else {
    _isFF=true;
    _FFrv = parseFloat(navigator.userAgent.split("rv:")[1])
}


//multibrowser Xpath processor
dtmlXMLLoaderObject.prototype.doXPath=function(xpathExp, docObj, namespace, result_type){
    if (_isKHTML || (!_isIE && !window.XPathResult))
        return this.doXPathOpera(xpathExp, docObj);

    if (_isIE){ //IE
        if (!docObj)
            if (!this.xmlDoc.nodeName)
                docObj=this.xmlDoc.responseXML
            else
                docObj=this.xmlDoc;

        if (!docObj)
            dhtmlxError.throwError("LoadXML", "Incorrect XML", [
                (docObj||this.xmlDoc),
                this.mainObject
            ]);

        if (namespace != null)
            docObj.setProperty("SelectionNamespaces", "xmlns:xsl='"+namespace+"'"); //

        if (result_type == 'single'){
            return docObj.selectSingleNode(xpathExp);
        }
        else {
            return docObj.selectNodes(xpathExp)||new Array(0);
        }
    } else { //Mozilla
        var nodeObj = docObj;

        if (!docObj){
            if (!this.xmlDoc.nodeName){
                docObj=this.xmlDoc.responseXML
            }
            else {
                docObj=this.xmlDoc;
            }
        }

        if (!docObj)
            dhtmlxError.throwError("LoadXML", "Incorrect XML", [
                (docObj||this.xmlDoc),
                this.mainObject
            ]);

        if (docObj.nodeName.indexOf("document") != -1){
            nodeObj=docObj;
        }
        else {
            nodeObj=docObj;
            docObj=docObj.ownerDocument;
        }
        var retType = XPathResult.ANY_TYPE;

        if (result_type == 'single')
            retType=XPathResult.FIRST_ORDERED_NODE_TYPE
        var rowsCol = new Array();
        var col = docObj.evaluate(xpathExp, nodeObj, function(pref){
            return namespace
        }, retType, null);

        if (retType == XPathResult.FIRST_ORDERED_NODE_TYPE){
            return col.singleNodeValue;
        }
        var thisColMemb = col.iterateNext();

        while (thisColMemb){
            rowsCol[rowsCol.length]=thisColMemb;
            thisColMemb=col.iterateNext();
        }
        return rowsCol;
    }
}

function _dhtmlxError(type, name, params){
    if (!this.catches)
        this.catches=new Array();

    return this;
}

_dhtmlxError.prototype.catchError=function(type, func_name){
    this.catches[type]=func_name;
}
_dhtmlxError.prototype.throwError=function(type, name, params){
    if (this.catches[type])
        return this.catches[type](type, name, params);

    if (this.catches["ALL"])
        return this.catches["ALL"](type, name, params);

    alert("Error type: "+arguments[0]+"\nDescription: "+arguments[1]);
    return null;
}

window.dhtmlxError=new _dhtmlxError();


//opera fake, while 9.0 not released
//multibrowser Xpath processor
dtmlXMLLoaderObject.prototype.doXPathOpera=function(xpathExp, docObj){
    //this is fake for Opera
    var z = xpathExp.replace(/[\/]+/gi, "/").split('/');
    var obj = null;
    var i = 1;

    if (!z.length)
        return [];

    if (z[0] == ".")
        obj=[docObj]; else if (z[0] == ""){
        obj=(this.xmlDoc.responseXML||this.xmlDoc).getElementsByTagName(z[i].replace(/\[[^\]]*\]/g, ""));
        i++;
    } else
        return [];

    for (i; i < z.length; i++)obj=this._getAllNamedChilds(obj, z[i]);

    if (z[i-1].indexOf("[") != -1)
        obj=this._filterXPath(obj, z[i-1]);
    return obj;
}

dtmlXMLLoaderObject.prototype._filterXPath=function(a, b){
    var c = new Array();
    var b = b.replace(/[^\[]*\[\@/g, "").replace(/[\[\]\@]*/g, "");

    for (var i = 0; i < a.length; i++)
        if (a[i].getAttribute(b))
            c[c.length]=a[i];

    return c;
}
dtmlXMLLoaderObject.prototype._getAllNamedChilds=function(a, b){
    var c = new Array();

    if (_isKHTML)
        b=b.toUpperCase();

    for (var i = 0; i < a.length; i++)for (var j = 0; j < a[i].childNodes.length; j++){
        if (_isKHTML){
            if (a[i].childNodes[j].tagName&&a[i].childNodes[j].tagName.toUpperCase() == b)
                c[c.length]=a[i].childNodes[j];
        }

        else if (a[i].childNodes[j].tagName == b)
            c[c.length]=a[i].childNodes[j];
    }

    return c;
}

function dhtmlXHeir(a, b){
    for (var c in b)
        if (typeof (b[c]) == "function")
            a[c]=b[c];
    return a;
}

function dhtmlxEvent(el, event, handler){
    if (el.addEventListener)
        el.addEventListener(event, handler, false);

    else if (el.attachEvent)
        el.attachEvent("on"+event, handler);
}

//============= XSL Extension ===================================

dtmlXMLLoaderObject.prototype.xslDoc=null;
dtmlXMLLoaderObject.prototype.setXSLParamValue=function(paramName, paramValue, xslDoc){
    if (!xslDoc)
        xslDoc=this.xslDoc

    if (xslDoc.responseXML)
        xslDoc=xslDoc.responseXML;
    var item =
        this.doXPath("/xsl:stylesheet/xsl:variable[@name='"+paramName+"']", xslDoc,
            "http:/\/www.w3.org/1999/XSL/Transform", "single");

    if (item != null)
        item.firstChild.nodeValue=paramValue
}
dtmlXMLLoaderObject.prototype.doXSLTransToObject=function(xslDoc, xmlDoc){
    if (!xslDoc)
        xslDoc=this.xslDoc;

    if (xslDoc.responseXML)
        xslDoc=xslDoc.responseXML

    if (!xmlDoc)
        xmlDoc=this.xmlDoc;

    if (xmlDoc.responseXML)
        xmlDoc=xmlDoc.responseXML

    //MOzilla
    if (!_isIE){
        if (!this.XSLProcessor){
            this.XSLProcessor=new XSLTProcessor();
            this.XSLProcessor.importStylesheet(xslDoc);
        }
        var result = this.XSLProcessor.transformToDocument(xmlDoc);
    } else {
        var result = new ActiveXObject("Msxml2.DOMDocument.3.0");
        try{
            xmlDoc.transformNodeToObject(xslDoc, result);
        }catch(e){
            result = xmlDoc.transformNode(xslDoc);
        }
    }
    return result;
}

dtmlXMLLoaderObject.prototype.doXSLTransToString=function(xslDoc, xmlDoc){
    var res = this.doXSLTransToObject(xslDoc, xmlDoc);
    if(typeof(res)=="string")
        return res;
    return this.doSerialization(res);
}

dtmlXMLLoaderObject.prototype.doSerialization=function(xmlDoc){
    if (!xmlDoc)
        xmlDoc=this.xmlDoc;
    if (xmlDoc.responseXML)
        xmlDoc=xmlDoc.responseXML
    if (!_isIE){
        var xmlSerializer = new XMLSerializer();
        return xmlSerializer.serializeToString(xmlDoc);
    } else
        return xmlDoc.xml;
}

/**
 *   @desc:
 *   @type: private
 */
dhtmlxEventable=function(obj){
    obj.attachEvent=function(name, catcher, callObj){
        name='ev_'+name.toLowerCase();
        if (!this[name])
            this[name]=new this.eventCatcher(callObj||this);

        return(name+':'+this[name].addEvent(catcher)); //return ID (event name & event ID)
    }
    obj.callEvent=function(name, arg0){
        name='ev_'+name.toLowerCase();
        if (this[name])
            return this[name].apply(this, arg0);
        return true;
    }
    obj.checkEvent=function(name){
        return (!!this['ev_'+name.toLowerCase()])
    }
    obj.eventCatcher=function(obj){
        var dhx_catch = [];
        var z = function(){
            var res = true;
            for (var i = 0; i < dhx_catch.length; i++){
                if (dhx_catch[i] != null){
                    var zr = dhx_catch[i].apply(obj, arguments);
                    res=res&&zr;
                }
            }
            return res;
        }
        z.addEvent=function(ev){
            if (typeof (ev) != "function")
                ev=eval(ev);
            if (ev)
                return dhx_catch.push(ev)-1;
            return false;
        }
        z.removeEvent=function(id){
            dhx_catch[id]=null;
        }
        return z;
    }
    obj.detachEvent=function(id){
        if (id != false){
            var list = id.split(':');           //get EventName and ID
            this[list[0]].removeEvent(list[1]); //remove event
        }
    }
    obj.detachAllEvents = function(){
        for (var name in this){
            if (name.indexOf("ev_")==0){
                this.detachEvent(name);
                this[name] = null;
            }
        }
    }
    obj = null;
};
/*jsl:end*/
if(!window.dhtmlx)
	window.dhtmlx = {};

(function(){
	var _dhx_msg_cfg = null;
	function callback(config, result){
			var usercall = config.callback;
			modality(false);
			config.box.parentNode.removeChild(config.box);
			_dhx_msg_cfg = config.box = null;
			if (usercall)
				usercall(result);
	}
	function modal_key(e){
		if (_dhx_msg_cfg){
			e = e||event;
			var code = e.which||event.keyCode;
			if (dhtmlx.message.keyboard){
				if (code == 13 || code == 32)
					callback(_dhx_msg_cfg, true);
				if (code == 27)
					callback(_dhx_msg_cfg, false);
			}
			if (e.preventDefault)
				e.preventDefault();
			return !(e.cancelBubble = true);
		}
	}
	if (document.attachEvent)
		document.attachEvent("onkeydown", modal_key);
	else
		document.addEventListener("keydown", modal_key, true);
		
	function modality(mode){
		if(!modality.cover){
			modality.cover = document.createElement("DIV");
			//necessary for IE only
			modality.cover.onkeydown = modal_key;
			modality.cover.className = "dhx_modal_cover";
			document.body.appendChild(modality.cover);
		}
		var height =  document.body.scrollHeight;
		modality.cover.style.display = mode?"inline-block":"none";
	}

	function button(text, result){
		var button_css = "dhtmlx_"+text.toLowerCase().replace(/ /g, "_")+"_button"; // dhtmlx_ok_button, dhtmlx_click_me_button
		return "<div class='dhtmlx_popup_button "+button_css+"' result='"+result+"' ><div>"+text+"</div></div>";
	}

	function info(text){
		if (!t.area){
			t.area = document.createElement("DIV");
			t.area.className = "dhtmlx_message_area";
			t.area.style[t.position]="5px";
			document.body.appendChild(t.area);
		}

		t.hide(text.id);
		var message = document.createElement("DIV");
		message.innerHTML = "<div>"+text.text+"</div>";
		message.className = "dhtmlx-info dhtmlx-" + text.type;
		message.onclick = function(){
			t.hide(text.id);
			text = null;
		};

		if (t.position == "bottom" && t.area.firstChild)
			t.area.insertBefore(message,t.area.firstChild);
		else
			t.area.appendChild(message);
		
		if (text.expire > 0)
			t.timers[text.id]=window.setTimeout(function(){
				t.hide(text.id);
			}, text.expire);

		t.pull[text.id] = message;
		message = null;

		return text.id;
	}
	function _boxStructure(config, ok, cancel){
		var box = document.createElement("DIV");
		box.className = " dhtmlx_modal_box dhtmlx-"+config.type;
		box.setAttribute("dhxbox", 1);
			
		var inner = '';

		if (config.width)
			box.style.width = config.width;
		if (config.height)
			box.style.height = config.height;
		if (config.title)
			inner+='<div class="dhtmlx_popup_title">'+config.title+'</div>';
		inner+='<div class="dhtmlx_popup_text"><span>'+(config.content?'':config.text)+'</span></div><div  class="dhtmlx_popup_controls">';
		if (ok)
			inner += button(config.ok || "OK", true);
		if (cancel)
			inner += button(config.cancel || "Cancel", false);
		if (config.buttons){
			for (var i=0; i<config.buttons.length; i++)
				inner += button(config.buttons[i],i);
		}
		inner += '</div>';
		box.innerHTML = inner;

		if (config.content){
			var node = config.content;
			if (typeof node == "string") 
				node = document.getElementById(node);
			if (node.style.display == 'none')
				node.style.display = "";
			box.childNodes[config.title?1:0].appendChild(node);
		}

		box.onclick = function(e){
			e = e ||event;
			var source = e.target || e.srcElement;
			if (!source.className) source = source.parentNode;
			if (source.className.split(" ")[0] == "dhtmlx_popup_button"){
				var result = source.getAttribute("result");
				result = (result == "true")||(result == "false"?false:result);
				callback(config, result);
			}
		};
		config.box = box;
		if (ok||cancel)
			_dhx_msg_cfg = config;

		return box;
	}
	function _createBox(config, ok, cancel){
		var box = config.tagName ? config : _boxStructure(config, ok, cancel);
		
		if (!config.hidden)
			modality(true);
		document.body.appendChild(box);
		var x = Math.abs(Math.floor(((window.innerWidth||document.documentElement.offsetWidth) - box.offsetWidth)/2));
		var y = Math.abs(Math.floor(((window.innerHeight||document.documentElement.offsetHeight) - box.offsetHeight)/2));
		if (config.position == "top")
			box.style.top = "-3px";
		else
			box.style.top = y+'px';
		box.style.left = x+'px';
		//necessary for IE only
		box.onkeydown = modal_key;

		box.focus();
		if (config.hidden)
			dhtmlx.modalbox.hide(box);

		return box;
	}

	function alertPopup(config){
		return _createBox(config, true, false);
	}
	function confirmPopup(config){
		return _createBox(config, true, true);
	}
	function boxPopup(config){
		return _createBox(config);
	}
	function box_params(text, type, callback){
		if (typeof text != "object"){
			if (typeof type == "function"){
				callback = type;
				type = "";
			}
			text = {text:text, type:type, callback:callback };
		}
		return text;
	}
	function params(text, type, expire, id){
		if (typeof text != "object")
			text = {text:text, type:type, expire:expire, id:id};
		text.id = text.id||t.uid();
		text.expire = text.expire||t.expire;
		return text;
	}
	dhtmlx.alert = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "confirm";
		return alertPopup(text);
	};
	dhtmlx.confirm = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return confirmPopup(text);
	};
	dhtmlx.modalbox = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return boxPopup(text);
	};
	dhtmlx.modalbox.hide = function(node){
		while (node && node.getAttribute && !node.getAttribute("dhxbox"))
			node = node.parentNode;
		if (node){
			node.parentNode.removeChild(node);
			modality(false);
		}
	};
	var t = dhtmlx.message = function(text, type, expire, id){
		text = params.apply(this, arguments);
		text.type = text.type||"info";

		var subtype = text.type.split("-")[0];
		switch (subtype){
			case "alert":
				return alertPopup(text);
			case "confirm":
				return confirmPopup(text);
			case "modalbox":
				return boxPopup(text);
			default:
				return info(text);
			break;
		}
	};

	t.seed = (new Date()).valueOf();
	t.uid = function(){return t.seed++;};
	t.expire = 4000;
	t.keyboard = true;
	t.position = "top";
	t.pull = {};
	t.timers = {};

	t.hideAll = function(){
		for (var key in t.pull)
			t.hide(key);
	};
	t.hide = function(id){
		var obj = t.pull[id];
		if (obj && obj.parentNode){
			window.setTimeout(function(){
				obj.parentNode.removeChild(obj);
				obj = null;
			},2000);
			obj.className+=" hidden";
			
			if(t.timers[id])
				window.clearTimeout(t.timers[id]);
			delete t.pull[id];
		}
	};
})();
gantt = {
	version:"2.0.0"
};

/*jsl:ignore*/
//import from dhtmlxcommon.js

function dhtmlxDetachEvent(el, event, handler){
    if (el.removeEventListener)
        el.removeEventListener(event, handler, false);

    else if (el.detachEvent)
        el.detachEvent("on"+event, handler);
}


/** Overrides event functionality.
 *  Includes all default methods from dhtmlx.common but adds _silentStart, _silendEnd
 *   @desc:
 *   @type: private
 */
dhtmlxEventable=function(obj){
    obj._silent_mode = false;
    obj._silentStart = function() {
        this._silent_mode = true;
    };
    obj._silentEnd = function() {
        this._silent_mode = false;
    };
	obj.attachEvent=function(name, catcher, callObj){
		name='ev_'+name.toLowerCase();
		if (!this[name])
			this[name]=new this._eventCatcher(callObj||this);

		return(name+':'+this[name].addEvent(catcher)); //return ID (event name & event ID)
	}
	obj.callEvent=function(name, arg0){
        if (this._silent_mode) return true;
		name='ev_'+name.toLowerCase();
		if (this[name])
			return this[name].apply(this, arg0);
		return true;
	}
	obj.checkEvent=function(name){
		return (!!this['ev_'+name.toLowerCase()])
	}
	obj._eventCatcher=function(obj){
		var dhx_catch = [];
		var z = function(){
			var res = true;
			for (var i = 0; i < dhx_catch.length; i++){
				if (dhx_catch[i] != null){
					var zr = dhx_catch[i].apply(obj, arguments);
					res=res&&zr;
				}
			}
			return res;
		}
		z.addEvent=function(ev){
			if (typeof (ev) != "function")
				ev=eval(ev);
			if (ev)
				return dhx_catch.push(ev)-1;
			return false;
		}
		z.removeEvent=function(id){
			dhx_catch[id]=null;
		}
		return z;
	}
	obj.detachEvent=function(id){
		if (id != false){
			var list = id.split(':');           //get EventName and ID
			this[list[0]].removeEvent(list[1]); //remove event
		}
	}
	obj.detachAllEvents = function(){
		for (var name in this){
			if (name.indexOf("ev_")==0)
				delete this[name];
		}
	}
	obj = null;
};


/*jsl:end*/


dhtmlx.copy = function(object) {
    var i, t, result; // iterator, types array, result

    if (object && typeof object == "object") {
        result = {};
        t = [Array,Date,Number,String,Boolean];
        for (i=0; i<t.length; i++) {
            if (object instanceof t[i])
                result = i ? new t[i](object) : new t[i](); // first one is array
        }

        for (i in object) {
            if (Object.prototype.hasOwnProperty.apply(object, [i]))
                result[i] = dhtmlx.copy(object[i]);
        }
    }
    return result || object;
};

dhtmlx.mixin = function(target, source, force){
    for (var f in source)
        if ((!target[f] || force)) target[f]=source[f];
    return target;
};


dhtmlx.defined = function(obj) {
    return typeof(obj) != "undefined";
};

dhtmlx.uid = function() {
    if (!this._seed)
        this._seed = (new Date).valueOf();
    
    this._seed++;
    return this._seed;
};


//creates function with specified "this" pointer
dhtmlx.bind=function(functor, object){
    return function(){ return functor.apply(object,arguments); };
};


//returns position of html element on the page
gantt._get_position = function(elem) {
    if (elem.getBoundingClientRect) { //HTML5 method
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { y: Math.round(top), x: Math.round(left), width:elem.offsetHeight, height:elem.offsetWidth };
    } else { //fallback to naive approach
        var top=0, left=0;
        while(elem) {
            top = top + parseInt(elem.offsetTop,10);
            left = left + parseInt(elem.offsetLeft,10);
            elem = elem.offsetParent;
        }
        return { y: top, x: left, width:elem.offsetHeight, height:elem.offsetWidth };
    }
};


gantt._detectScrollSize = function(){
    var div = document.createElement("div");
    div.style.cssText="visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;";

    document.body.appendChild(div);
    var width = div.offsetWidth-div.clientWidth;
    document.body.removeChild(div);

    return width;
};

dhtmlxEventable(gantt);

gantt._click = {};
gantt._dbl_click = {};
gantt._context_menu = {};
gantt._on_click = function(e) {
    e = e || window.event;
    var trg = e.target || e.srcElement;
    var id = gantt.locate(e);

	var default_action = gantt._find_ev_handler(e, trg, gantt._click, id);
    if(!default_action)
		return;

    if (id !== null){
        var res = !gantt.checkEvent("onTaskClick") || gantt.callEvent("onTaskClick", [id, e]);
		if(res && gantt.config.select_task){
			gantt.selectTask(id);
		}
	}else{
        gantt.callEvent("onEmptyClick", [e]);
	}
};
gantt._on_contextmenu = function(e){
	e = e || window.event;
	var src = e.target||e.srcElement,
		taskId = gantt.locate(src),
		linkId = gantt.locate(src, gantt.config.link_attribute);

	var res = !gantt.checkEvent("onContextMenu") || gantt.callEvent("onContextMenu", [taskId, linkId, e]);
	if(!res)
		e.preventDefault();
	return res;
};
gantt._find_ev_handler = function(e, trg, hash, id){
	var res = true;
	while (trg && trg.parentNode){
		var css = trg.className;
		if (css) {
			css = css.split(" ");
			for (var i = 0; i < css.length; i++) {
				if (!css[i]) continue;
				if (hash[css[i]]){
					res =  hash[css[i]].call(gantt, e, id, trg);
					res = !(typeof res!="undefined"&&res!==true);
				}
			}
		}
		trg=trg.parentNode;
	}
	return res;
};
gantt._on_dblclick = function(e) {
	e = e || window.event;
	var trg = e.target || e.srcElement;
    var id = gantt.locate(e);

	var default_action = gantt._find_ev_handler(e, trg, gantt._dbl_click, id);
	if(!default_action)
		return;

    if (id !== null){
        var res = !gantt.checkEvent("onTaskDblClick") || gantt.callEvent("onTaskDblClick", [id, e]);
		if(res && gantt.config.details_on_dblclick){
			gantt.showLightbox(id);
		}
	}
};

gantt._on_mousemove = function(e){
	if (gantt.checkEvent("onMouseMove")){
    	var id = gantt.locate(e);
    	gantt._last_move_event = e;
		gantt.callEvent("onMouseMove", [id,e]);
	}
};
function dhtmlxDnD(obj, config) {
    if(config){
        this._settings = config;
    }
    dhtmlxEventable(this);
    dhtmlxEvent(obj, "mousedown", dhtmlx.bind(function(e) {
        this.dragStart(obj, e);
    }, this));

}
dhtmlxDnD.prototype = {
    dragStart: function(obj, e) {
        this.config = {
            obj: obj,
            marker: null,
            started: false,
            pos: this.getPosition(e),
            sensitivity: 4
        };
        if(this._settings)
            dhtmlx.mixin(this.config, this._settings, true);

        var mousemove = dhtmlx.bind(function(e) { return this.dragMove(obj, e); }, this);
        var scroll = dhtmlx.bind(function(e) { return this.dragScroll(obj, e); }, this);

        var limited_mousemove = dhtmlx.bind(function(e) {
            if(dhtmlx.defined(this.config.updates_per_second)){
                if(!gantt._checkTimeout(this, this.config.updates_per_second))
                    return true;
            }

			return mousemove(e);
        }, this);

        var mouseup = dhtmlx.bind(function(e) {
            dhtmlxDetachEvent(document.body, "mousemove", limited_mousemove);
            dhtmlxDetachEvent(document.body, "mouseup", mouseup);
            return this.dragEnd(obj);
        }, this);


        dhtmlxEvent(document.body, "mousemove", limited_mousemove);
        dhtmlxEvent(document.body, "mouseup", mouseup);
        document.body.className += " gantt_noselect";
    },
    dragMove: function(obj, e) {
        if (!this.config.marker && !this.config.started) {
            var pos = this.getPosition(e);
            var diff_x = pos.x - this.config.pos.x;
            var diff_y = pos.y - this.config.pos.y;
            var distance = Math.sqrt(Math.pow(Math.abs(diff_x), 2) + Math.pow(Math.abs(diff_y), 2));

            if (distance > this.config.sensitivity) {
                // real drag starts here,
                // when user moves mouse at first time after onmousedown
                this.config.started = true;
                this.config.ignore = false;
                if (this.callEvent("onBeforeDragStart", [obj,e]) === false) {
                    this.config.ignore = true;
                    return true;
                }

                // initialize dnd marker
                var marker = this.config.marker = document.createElement("div");
                marker.className = "gantt_drag_marker";
                marker.innerHTML = "Dragging object";
                document.body.appendChild(marker);

                this.callEvent("onAfterDragStart", [obj,e]);
            } else
                this.config.ignore = true;
        }
        if (!this.config.ignore) {
            e.pos = this.getPosition(e);
            this.config.marker.style.left = e.pos.x + "px";
            this.config.marker.style.top = e.pos.y + "px";
            this.callEvent("onDragMove", [obj,e]);
        }
    },

    dragEnd: function(obj) {
        if (this.config.marker) {
            this.config.marker.parentNode.removeChild(this.config.marker);
            this.config.marker = null;
            this.callEvent("onDragEnd", []);
        }
        document.body.className = document.body.className.replace(" gantt_noselect", "");
    },

    getPosition: function(e) {
        var x = 0, y = 0;
        e = e || window.event;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else if (e.clientX || e.clientY) 	{
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x:x, y:y };
    }
};
gantt._init_grid = function() {
    this._click.gantt_close = dhtmlx.bind(function(e, id, trg) {
        this.close(id);
    }, this);
    this._click.gantt_open = dhtmlx.bind(function(e, id, trg) {
        this.open(id);
    }, this);


    this._click.gantt_row = dhtmlx.bind(function(e, id, trg) {
        if (id!==null) {
            var el = this.getTaskNode(id);
            var left = Math.max(el.offsetLeft - this.config.task_scroll_offset, 0);
            this._scroll_task_area(left);
			this.callEvent("onTaskRowClick", [id, trg]);
        }
    }, this);

	this._click.gantt_grid_head_cell = dhtmlx.bind(function(e, id, trg) {
		var column = trg.getAttribute("column_id");

		if(!this.callEvent("onGridHeaderClick", [column, e]))
			return;

		if (column == "add") {
			this._click.gantt_add(e, 0);
		} else if (this.config.sort){
			var sort = (this._sort && this._sort.direction && this._sort.name == column) ? this._sort.direction : "desc";
			// invert sort direction
			sort = (sort == "desc") ? "asc" : "desc";
			this._sort = {
				name: column,
				direction: sort
			};
			this._render_grid_header();

			this.sort(column, sort == "desc");
		}
	}, this);

    if(!this.config.sort && this.config.order_branch) {
        this._init_dnd();
    }

    this._click.gantt_add = dhtmlx.bind(function(e, id, trg) {
		var parent = id ? this.getTask(id) : false,
			startDate = '';
		if(parent){
			startDate = parent.start_date;
		}else{
			var first = this._order[0];
			startDate = first ? this.getTask(first).start_date : this.config.start_date;
		}


		if(parent)
			parent.$open = true;

        var item = { text:gantt.locale.labels.new_task, start_date:this.templates.xml_format(startDate), duration: 1, progress: 0, parent: id };
        this.callEvent("onTaskCreated", [item]);
        this.addTask(item);
        this.showTask(item.id);
        if (this.config.details_on_create)
            this.showLightbox(item.id);
    }, this);


};

gantt._render_grid = function(){
    this._calc_grid_width();
    this._render_grid_header();
};

gantt._calc_grid_width = function() {
    if (this.config.autofit) {
        var columns = this.config.columns;
        var cols_width = 0;
        var unknown = [];
        var width = [];
        for (var i = 0; i < columns.length; i++) {
            var v = parseInt(columns[i].width, 10);
            if (window.isNaN(v)) {
                v = 50;
                unknown.push(i);
            }
            width[i] = v;
            cols_width += v;
        }
        var diff = this.config.grid_width - cols_width;
        // TODO: logic may be improved for proportional changing of width
        var step = diff/(unknown.length > 0 ? unknown.length : (width.length > 0 ? width.length : 1));
        if (unknown.length > 0) {
            // there are several columns with undefined width
            var delta = diff/(unknown.length ? unknown.length : 1);
            for (var i = 0; i < unknown.length; i++) {
                var index = unknown[i];
                width[index] += delta;
            }
        } else {
            // delta must be added for all columns
            var delta = diff/(width.length ? width.length : 1);
            for (var i = 0; i < width.length; i++)
                width[i] += delta;
        }

        for (var i = 0; i < width.length; i++) {
            columns[i].width = width[i];
        }
    }
};

gantt._render_grid_header = function() {
    var columns = this.config.columns;
    var cells = [];
    var width = 0,
		labels = this.locale.labels;

    var lineHeigth = this.config.scale_height-2;

    for (var i = 0; i < columns.length; i++) {
        var last = i == columns.length-1;
        var col = columns[i];
        if (last && this.config.grid_width > width+col.width)
            col.width = this.config.grid_width - width;
        width += col.width;
        var sort = (this._sort && col.name == this._sort.name) ? ("<div class='gantt_sort gantt_" + this._sort.direction + "'></div>") : "";
        var cssClass = "gantt_grid_head_cell" + (" gantt_grid_head_" + col.name)
			+ (last ? " gantt_last_cell" : "") + this.templates.grid_header_class(col.name, col);

        var style = "width:" + (col.width-(last?1:0)) + "px;";
		var label = (labels["column_" + col.name] || col.label);
		label = label || "";
        var cell = "<div class='" + cssClass + "' style='" + style + "' column_id='" + col.name + "'>" + label + sort +  "</div>";
        cells.push(cell);
    }
    this.$grid_scale.style.height = (this.config.scale_height-1) + "px";
    this.$grid_scale.style.lineHeight = lineHeigth + "px";
    this.$grid_scale.style.width = (width-1) + "px";
    this.$grid_scale.innerHTML = cells.join("");
};



gantt._render_grid_item = function(item) {
    var columns = this.config.columns;
    var cells = [];
    var width = 0;
    for (var i = 0; i < columns.length; i++) {
        var last = i == columns.length-1;
        var col = columns[i];
        var cell;

        var value;
        if (col.name == "add" && i == columns.length-1) {
            value = "<div class='gantt_add'></div>";
        } else {
            if (col.template)
                value = col.template(item);
            else
                value = item[col.name];

            if (value instanceof Date)
                value = this.templates.date_grid(value);
			value = "<div class='gantt_tree_content'>" + value + "</div>";
        }
        var css = "gantt_cell" + (last ? " gantt_last_cell" : "");

        var tree = "";
        if (col.tree) {
            for (var j = 0; j < item.$level; j++)
                tree += this.templates.grid_indent(item);

            var has_child = (this._branches[item.id] && this._branches[item.id].length > 0);
            if (has_child) {
                tree += this.templates.grid_open(item);
                tree += this.templates.grid_folder(item);
            } else {
                tree += this.templates.grid_blank(item);
                tree += this.templates.grid_file(item);
            }
        }
        var style = "width:" + (col.width-(last ? 1 : 0)) + "px;";
        if (dhtmlx.defined(col.align))
            style += "text-align:" + col.align + ";";
        cell = "<div class='" + css + "' style='" + style + "'>" + tree + value + "</div>";
        cells.push(cell);
    }
    var css = item.$index%2 === 0 ? "" : " odd";
    css += (item.$transparent) ? " gantt_transparent" : "";
    if (this.templates.grid_row_class) {
        var css_template = this.templates.grid_row_class.call(this, item.start_date, item.end_date, item);
        if (css_template)
            css += " " + css_template;
    }

	if(this.getState().selected_task == item.id){
		css += " gantt_selected";
	}
	var el = document.createElement("div");
	el.className = "gantt_row" + css;
	el.style.height = this.config.row_height + "px";
	el.style.lineHeight = (gantt.config.row_height)+"px";
	el.setAttribute(this.config.task_attribute, item.id);
	el.innerHTML = cells.join("");
	return el;
};


gantt.open = function(id){
	gantt._set_item_state(id, true);
	this.callEvent("onTaskOpened", [id]);
};
gantt.close = function(id){
	gantt._set_item_state(id, false);
	this.callEvent("onTaskClosed", [id]);
};
gantt._set_item_state = function(id, state) {
    if (id && this._pull[id]) {
        this._pull[id].$open = state;
		this.refreshData();
    }
};

gantt.getTaskIndex = function(id){
    var branch = this._branches[this.getTask(id).parent];
    for (var i = 0; i < branch.length; i++)
            if (branch[i] == id)
                return i;

    return -1;
};
gantt.getGlobalTaskIndex = function(id){
    var branch = this._order;
    for (var i = 0; i < branch.length; i++)
            if (branch[i] == id)
                return i;

    return -1;
};
gantt.moveTask = function(sid, tindex, parent){
    //target id as 4th parameter
    var id = arguments[3];
    if (id){
        if (id === sid) return;

        parent = this.getTask(id).parent;
        tindex = this.getTaskIndex(id);
    }

        parent = parent || 0;
    var source = this.getTask(sid);
    var sbranch = this._branches[source.parent];

    var tbranch = this._branches[parent];
    if (tindex == -1)
        tindex = tbranch.length + 1;
    if (source.parent == parent){
        var sindex = this.getTaskIndex(sid);
        if (sindex == tindex) return;
        if (sindex < tindex)
            tindex--;
    }

    this._branch_update(source.parent, sid);
    tbranch = this._branches[parent];

    var tid = tbranch[tindex];
    if (!tid) //adding as last element
        tbranch.push(sid);
    else
        tbranch = tbranch.slice(0, tindex).concat([ sid ]).concat(tbranch.slice(tindex));
    
    source.parent = parent;
    this._branches[parent] = tbranch;
    this.refreshData();
};

gantt._init_dnd = function() {
    var dnd = new dhtmlxDnD(this.$grid_data, {updates_per_second : 60});
    if (dhtmlx.defined(this.config.dnd_sensitivity))
        dnd.config.sensitivity = this.config.dnd_sensitivity;

    dnd.attachEvent("onBeforeDragStart", dhtmlx.bind(function(obj,e) {
        var el = this._locateHTML(e);
        if (!el) return false;
        if (this.hideQuickInfo) this._hideQuickInfo();
    }, this));

    dnd.attachEvent("onAfterDragStart", dhtmlx.bind(function(obj,e) {
        var el = this._locateHTML(e);
        dnd.config.marker.innerHTML = el.outerHTML;

        dnd.config.id = this.locate(e);
        var task = this.getTask(dnd.config.id);
        task.$open = false;
        task.$transparent = true;
		this.refreshData();
    }, this));



    dnd.attachEvent("onDragMove", dhtmlx.bind(function(obj,e) {
        var dd = dnd.config;
        var pos = this._get_position(this.$grid_data);

        // row offset
        var x = pos.x + 10;
        var y = e.pos.y - 10;

        // prevent moving row out of grid_data container
        if (y < pos.y) y = pos.y;
        if (y > pos.y + this.$grid_data.offsetHeight - this.config.row_height) y = pos.y + this.$grid_data.offsetHeight - this.config.row_height;

        // setting position of row
        dd.marker.style.left = x + "px";
        dd.marker.style.top = y + "px";


        // highlight row when mouseover
        var target = document.elementFromPoint(pos.x-document.body.scrollLeft+1, y-document.body.scrollTop);
        var el = this.locate(target);

        if (this.isTaskExists(el)) {
            var box = gantt._get_position(target);
            var over = this.getTask(el);
            var item = this.getTask(dnd.config.id);

            if (box.y + target.offsetHeight/2 < y){
                //hovering over bottom part of item, check can be drop to bottom
                var index = this.getGlobalTaskIndex(over.id);
                var next = this._pull[this._order[index+1+(over.id == item.id ? 1 : 0)]]; //adds +1 when hovering over placeholder
                if (next){
                    if (next.id != item.id)
                        over = next; //there is a valid target
                    else
                        return;
                } else {
                    //we at end of the list, check and drop at the end of list
                    next = this._pull[this._order[index+1]];
                    if (next.$level == item.$level){
                        this.moveTask(item.id, -1, next.parent);
                        dd.target = "next:"+next.id;
                        return 
                    }
                }
            }

            //replacing item under cursor
            if (over.$level == item.$level && item.id != over.id){
                this.moveTask(item.id, 0, 0, over.id);
                dd.target = over.id;
            } else {
                //if item is on different level, check the one before it
                if (item.id == over.id) return;

                var index = this.getGlobalTaskIndex(over.id);
                var prev = this._pull[this._order[index-1]];
                if (prev && prev.$level == item.$level && item.id != prev.id){
                    this.moveTask(item.id, -1, prev.parent);
                    dd.target = "next:"+prev.id;
                }
            }
        }
        return true;
    }, this));


    dnd.attachEvent("onDragEnd", dhtmlx.bind(function(){
        this.getTask(dnd.config.id).$transparent = false;
        this.refreshData();
        this.callEvent("onRowDragEnd", [dnd.config.id, dnd.config.target]);
    }, this));
};
gantt._scale_helpers = {
	getSum : function(sizes, from, to){
		if(to === undefined)
			to = sizes.length - 1;
		if(from === undefined)
			from = 0;

		var summ = 0;
		for(var i=from; i <= to; i++)
			summ += sizes[i];

		return summ;
	},
	setSumWidth : function(sum_width, scale, from, to){
		var parts = scale.width;

		if(to === undefined)
			to = parts.length - 1;
		if(from === undefined)
			from = 0;
		var length = to - from + 1;
		if(from > parts.length - 1 || length <= 0 || to > parts.length - 1 || !sum_width )
			return;

		var oldWidth = this.getSum(parts, from, to);

		var diff = sum_width - oldWidth;

		this.adjustSize(diff, parts, from, to);
		this.adjustSize(- diff, parts, to + 1);

		scale.full_width = this.getSum(parts);
	},
	splitSize : function(width, count){
		var arr = [];
		for(var i=0; i < count; i++) arr[i] = 0;

		this.adjustSize(width, arr);
		return arr;

	},
	adjustSize : function(width, parts, from, to){

		if(!from)
			from = 0;
		if(to === undefined)
			to = parts.length - 1;

		var length = to - from + 1;

		var full = this.getSum(parts, from, to);

		var shared = 0;
		for(var i = from; i <= to; i++){
			var share = Math.floor(width*(full ? (parts[i]/full) : (1/length)));
			parts[i] += share;
			shared += share;
		}
		parts[parts.length - 1] += width - shared;
	},
	sortScales : function(scales){
		function cellSize(unit, step){
			var d = new Date(1970, 0, 1);
			return gantt.date.add(d, step, unit) - d;
		}

		scales.sort(function(a, b){
			return cellSize(a.unit, a.step) < cellSize(b.unit, b.step) ? 1 : -1;
		});
	},
	primaryScale : function(){

		gantt._init_template("date_scale");

		return {
			unit: gantt.config.scale_unit,
			step: gantt.config.step,
			template : gantt.templates.date_scale,
			date : gantt.config.date_scale,
			css: gantt.templates.scale_cell_class
		};
	},

	prepareConfigs : function(scales, min_coll_width, container_width, scale_height){

		var width = this.prepareScaleConfig(scales[scales.length - 1], min_coll_width, container_width).full_width;
		var heights = this.splitSize(scale_height, scales.length);
		var configs = [];
		for(var i=0; i < scales.length; i++){
			var cfg = this.prepareScaleConfig(scales[i], min_coll_width, width, heights[i]);

			this.formatScales(cfg);
			configs.push(cfg);
		}

		for( var i =0; i < configs.length-1; i++){
			this.alineScaleColumns(configs[configs.length-1], configs[i]);
		}

		return configs;

	},
	prepareScaleConfig : function(config, min_col_width, full_width, line_height){
		var cfg = dhtmlx.mixin({
			count:0,
			col_width:0,
			full_width:0,
			height:line_height,
			width:[],
			trace_x:[]
		}, config);

		this.eachColumn(config.unit, config.step, function(date){
			cfg.count++;
			cfg.trace_x.push(new Date(date));
		});

		var cont_width = full_width;

		cfg.col_width = Math.floor(cont_width/cfg.count);

		if(min_col_width){
			if (cfg.col_width < min_col_width){
				cfg.col_width = min_col_width;
				cont_width = cfg.col_width*cfg.count;
			}
		}

		cfg.width = this.splitSize(cont_width, cfg.count);
		cfg.full_width = this.getSum(cfg.width);

		return cfg;
	},
	alineScaleColumns : function(lower_scale, upper_scale, from, to){
		var upper_dates = upper_scale.trace_x;
		var lower_dates = lower_scale.trace_x;

		var prev = from || 0;
		var end = to || (lower_dates.length - 1);
		var prevUpper = 0;
		for(var up=1; up < upper_dates.length; up++){
			for(var next=prev; next <= end; next++){
				if(+lower_dates[next] == +upper_dates[up]){
					var targetWidth = this.getSum(lower_scale.width, prev, next - 1);
					var actualWidth = this.getSum(upper_scale.width, prevUpper, up - 1);
					if(actualWidth != targetWidth){
						this.setSumWidth(targetWidth, upper_scale, prevUpper, up - 1);
					}
					prev = next;
					prevUpper = up;
					continue;
				}
			}
		}
	},
	eachColumn : function(unit, step, callback){
		var start = new Date(gantt._min_date),
			end = new Date(gantt._max_date);
		if(gantt.date[unit + "_start"]){
			start = gantt.date[unit + "_start"](start);
		}

		var curr = new Date(start);
		while(+curr < +end){
			callback.call(this, new Date(curr));
			curr = gantt.date.add(curr, step, unit);
		}
	},
	formatScales : function(cfg, upper_scales){
		var dates = cfg.trace_x;
		var ind = -1;

		var left = 0, right = cfg.width.length-1;
		var diff = 0;
		if(+dates[0] < +gantt._min_date && left != right){
			var width = Math.floor(cfg.width[0] * ((dates[1] - gantt._min_date)/ (dates[1] - dates[0])));
			diff += cfg.width[0] - width;
			cfg.width[0] = width;

			dates[0] = new Date(gantt._min_date);
		}

		var last = dates.length - 1;
		var lastDate = dates[last];
		var outDate = gantt.date.add(lastDate, cfg.step, cfg.unit);
		if(+outDate > +gantt._max_date && last > 0){
			var width = cfg.width[last] - Math.floor(cfg.width[last] * ((outDate - gantt._max_date)/(outDate - lastDate)));
			diff += cfg.width[last] - width;
			cfg.width[last] = width;
		}

		if(diff){
			var full = this.getSum(cfg.width);
			var shared = 0;
			for(var i =0; i < cfg.width.length; i++){
				var share = Math.floor(diff*(cfg.width[i]/full));
				cfg.width[i] += share;
				shared += share;
			}
			this.adjustSize(diff - shared, cfg.width);
		}

	}
};
gantt._tasks_dnd = {
	drag : null,
	_events:{
		before_start:{},
		before_finish:{},
		after_finish:{}
	},
	_handlers:{},
	init:function(){
		this.clear_drag_state();
		var drag = gantt.config.drag_mode;
		this.set_actions();

		var evs = {
			"before_start":"onBeforeTaskDrag",
			"before_finish":"onBeforeTaskChanged",
			"after_finish":"onAfterTaskDrag"
		};
		//for now, all drag operations will trigger the same events
		for(var stage in this._events){
			for(var mode in drag){
				this._events[stage][mode] = evs[stage];
			}
		}

		this._handlers[drag.move] = this._move;
		this._handlers[drag.resize] = this._resize;
		this._handlers[drag.progress] = this._resize_progress;

	},
	set_actions:function(){
		var data = gantt.$task_data;
		dhtmlxEvent(data, "mousemove", dhtmlx.bind(function(e){
			this.on_mouse_move(e||event);
		}, this));
		dhtmlxEvent(data, "mousedown", dhtmlx.bind(function(e){
			this.on_mouse_down(e||event);
		}, this));
		dhtmlxEvent(data, "mouseup", dhtmlx.bind(function(e){
			this.on_mouse_up(e||event);
		}, this));
	},

	clear_drag_state : function(){
		this.drag = {
			id:null,
			mode:null,
			pos:null,
			start:null,
			obj:null,
			left:null
		};
	},
	_drag_timeout : function(){
		if(this._cancel_drag)
			return false;

		setTimeout(dhtmlx.bind(function(){
			this._cancel_drag = false;
		}, this), 1000/40);

		return this._cancel_drag = true;
	},
	_resize : function(ev, shift, drag){
		var cfg = gantt.config;
		if(drag.left){
			ev.start_date = new Date(drag.start.valueOf() +  shift);
		}else{
			ev.end_date = new Date(drag.start.valueOf() +  shift);
		}

		if (ev.end_date - ev.start_date < cfg.min_duration){
			if(drag.left)
				ev.start_date = new Date(ev.end_date.valueOf() - cfg.min_duration);
			else
				ev.end_date = new Date(ev.start_date.valueOf() + cfg.min_duration);
		}
		gantt._update_task_duration(ev);
	},
	_resize_progress:function(ev, shift, drag){
		var start = drag.obj_s_x = drag.obj_s_x || gantt._pos_from_date(ev.start_date);
		var end = drag.obj_e_x = drag.obj_e_x || gantt._pos_from_date(ev.end_date);

		var diff = Math.max(0, drag.pos.x - start);
		ev.progress = Math.min(1, diff / (end-start));
	},
	_move : function(ev, shift, drag){
		ev.start_date = new Date(drag.obj.start_date.valueOf() + shift);
		ev.end_date = new Date(drag.obj.end_date.valueOf() + shift);
	},
	on_mouse_move : function(e){
		if(this.drag.start_drag)
			this._start_dnd(e);

		var drag = this.drag;

		if (drag.mode){
			if(!gantt._checkTimeout(this, 40))//limit update frequency
				return;

			this._update_on_move(e);

		}
	},
	_update_on_move : function(e){
		var drag = this.drag;

		if (drag.mode){
			var pos = gantt._get_mouse_pos(e);
			if(drag.pos && drag.pos.x == pos.x)
				return;

			drag.pos=pos;

			var curr_date = gantt._date_from_pos(pos.x);
			if(!curr_date || isNaN( curr_date.getTime() ))
				return;

			var shift = curr_date - drag.start ;
			var ev = gantt.getTask(drag.id);


			if(this._handlers[drag.mode]){
				var original = dhtmlx.mixin({}, ev);
				var copy =  dhtmlx.mixin({}, ev);
				this._handlers[drag.mode].apply(this, [copy, shift, drag]);
				dhtmlx.mixin(ev, copy, true);
				gantt._update_parents(drag.id, true);
				gantt.callEvent("onTaskDrag", [ev.id, drag.mode, copy, original, e]);


				dhtmlx.mixin(ev, copy, true);
				gantt._update_parents(drag.id);
				gantt.refreshTask(drag.id);
			}

		}
	},

	on_mouse_down : function(e, src){
		// on Mac we do not get onmouseup event when clicking right mouse button leaving us in dnd state
		// let's ignore right mouse button then
		if (e.button == 2)
			return;

		if (gantt.config.readonly || this.drag.mode) return;

		this.clear_drag_state();

		src = src||(e.target||e.srcElement);

		var className = gantt._trim(src.className || "");
		if(!className || !this._get_drag_mode(className)){
			if(src.parentNode)
				return this.on_mouse_down(e, src.parentNode);
			else
				return;
		}

		var drag = this._get_drag_mode(className);

		if(!drag){
			if (gantt.checkEvent("onMouseDown") && gantt.callEvent("onMouseDown", [className.split(" ")[0]])) {
				if (src.parentNode)
					return this.on_mouse_down(e,src.parentNode);

			}
		}else{
			if (drag.mode && drag.mode != gantt.config.drag_mode.ignore && gantt.config["drag_" + drag.mode]){
				var id =  gantt.locate(src),
					task = dhtmlx.copy(gantt.getTask(id) || {});

				if(gantt._is_flex_task(task) && drag.mode != gantt.config.drag_mode.progress){//only progress drag is allowed for tasks with flexible duration
					this.clear_drag_state();
					return;
				}

				drag.id = id;
				var pos = gantt._get_mouse_pos(e);
				drag.start = gantt._date_from_pos(pos.x);
				drag.obj = task;
				this.drag.start_drag = drag;

			}else
				this.clear_drag_state();
		}
	},
	on_mouse_up : function(e){
		var drag = this.drag;
		if (drag.mode && drag.id){
			//drop
			var ev=gantt.getTask(drag.id);


			if(!this._fireEvent("before_finish", drag.mode, [drag.id, drag.mode, dhtmlx.copy(drag.obj), e])){
				drag.obj._dhx_changed = false;
				dhtmlx.mixin(ev, drag.obj, true);
				gantt.updateTask(ev.id);
			} else {
				var drag_id = drag.id;
				this.clear_drag_state();

				if(gantt.config.round_dnd_dates){
					var scale = gantt._tasks;
					gantt._round_task_dates(ev, scale.step, scale.unit);

				}else{
					gantt._round_task_dates(ev, gantt.config.time_step, "minute");
				}
				gantt._update_task_duration(ev);
				gantt.updateTask(ev.id);
				this._fireEvent("after_finish", drag.mode, [drag_id, drag.mode, e]);
			}

		}
		this.clear_drag_state();
	},
	_get_drag_mode : function(className){
		var modes = gantt.config.drag_mode;
		var classes = (className || "").split(" ");
		var classname = classes[0];
		var drag = {mode:null, left:null};
		switch (classname) {
			case "gantt_task_line":
			case "gantt_task_content":
				drag.mode = modes.move;
				break;
			case "gantt_task_drag":
				drag.mode = modes.resize;
				if(classes[1] && classes[1].indexOf("left", classes[1].length - "left".length) !== -1){
					drag.left = true;
				}
				break;
			case "gantt_task_progress_drag":
				drag.mode = modes.progress;
				break;
			case "gantt_link_control":
			case "gantt_link_point":
				drag.mode = modes.ignore;
				break;
			default:
				drag = null;
				break;
		}
		return drag;

	},

	_start_dnd : function(e){
		var drag = this.drag = this.drag.start_drag;
		delete drag.start_drag;

		var cfg = gantt.config;
		var id = drag.id;
		if (!cfg["drag_"+drag.mode] || !gantt.callEvent("onBeforeDrag",[id, drag.mode, e]) || !this._fireEvent("before_start", drag.mode, [id, drag.mode, e])){
			this.clear_drag_state();
		}else {
			delete drag.start_drag;
		}

	},
	_fireEvent:function(stage, mode, params){
		dhtmlx.assert(this._events[stage], "Invalid stage:{" + stage + "}");

		var trigger = this._events[stage][mode];

		dhtmlx.assert(trigger, "Unknown after drop mode:{" + mode + "}");
		dhtmlx.assert(params, "Invalid event arguments");


		if(!gantt.checkEvent(trigger))
			return true;

		return gantt.callEvent(trigger, params);
	}
};







gantt._render_link = function(id){
	var link = this.getLink(id);
	gantt._linkRenderer.render_item(link, this.$task_links);
};
gantt._get_link_type = function(from_start, to_start){
	var type;
	if(from_start && to_start){
		type = gantt.config.links.start_to_start;
	}else if(!from_start && to_start){
		type = gantt.config.links.finish_to_start;
	}else if(!from_start && !to_start){
		type = gantt.config.links.finish_to_finish;
	}else if(from_start && !to_start){
		type = null;
	}
	return type;
};

gantt.isLinkAllowed = function(from, to, from_start, to_start){
	if(typeof(from) == "object"){
		var link = from;
	}else{
		var link = {source:from, target:to, type: this._get_link_type(from_start, to_start)};
	}

	if(!link) return false;
	if(!(link.source && link.target && link.type)) return false;
	if(link.source == link.target) return false;

	var res = true;
	//any custom rules
	if(this.checkEvent("onLinkValidation"))
		res = this.callEvent("onLinkValidation", [link]);

	return res;
};

gantt._render_link_element = function(link){
	if(!(gantt.isTaskVisible(link.source) && gantt.isTaskVisible(link.target)))
		return;

	var dots = this._path_builder.get_points(link);
	var drawer = gantt._drawer;
	var lines = drawer.get_lines(dots);

	var div = document.createElement("div");


	var css = "gantt_task_link";
	var cssTemplate = this.templates.link_class ? this.templates.link_class(link) : "";
	if(cssTemplate){
		css += " " + cssTemplate;
	}


	div.className = css;
	div.setAttribute(gantt.config.link_attribute, link.id);
	for(var i=0; i < lines.length; i++){
		if(i == lines.length - 1){
			lines[i].size -= gantt.config.link_arrow_size;
		}
		div.appendChild(drawer.render_line(lines[i], lines[i+1]));
	}

	var direction = lines[lines.length - 1].direction;
	var endpoint = gantt._render_link_arrow(dots[dots.length - 1], direction);
	div.appendChild(endpoint);

	return div;
};

gantt._render_link_arrow = function(point, direction){
	var div = document.createElement("div");
	var drawer = gantt._drawer;
	var top = point.y;
	var left = point.x;

	var size = gantt.config.link_arrow_size;
	var line_width = gantt.config.row_height;
	var className = "gantt_link_arrow gantt_link_arrow_" + direction;
	switch (direction){
		case drawer.dirs.right:
			top -= (size - line_width)/2;
			left -= size;
			break;
		case drawer.dirs.left:
			top -= (size - line_width)/2;
			break;
		case drawer.dirs.up:
			left -= (size - line_width)/2;
			break;
		case drawer.dirs.down:
			top -= size;
			left -= (size - line_width)/2;
			break;
		default:
			break;
	}
	div.style.cssText = [
		"top:"+top + "px",
		"left:"+left+'px'].join(';');
	div.className = className;

	return div;
};


gantt._drawer = {
	current_pos:null,
	dirs:{"left":'left',"right":'right',"up":'up', "down":'down'},
	path:[],
	clear:function(){
		this.current_pos = null;
		this.path = [];
	},
	point:function(pos){
		this.current_pos = dhtmlx.copy(pos);
	},
	get_lines:function(dots){
		this.clear();
		this.point(dots[0]);
		for(var i=1; i<dots.length ; i++){
			this.line_to(dots[i]);
		}
		return this.get_path();
	},
	line_to:function(pos){
		var next = dhtmlx.copy(pos);
		var prev = this.current_pos;

		var line = this._get_line(prev, next);
		this.path.push(line);
		this.current_pos = next;
	},
	get_path:function(){
		return this.path;
	},
	get_wrapper_sizes :function(v){
		var res,
			wrapper_size = gantt.config.link_wrapper_width,
			line_size = gantt.config.link_line_width,
			y = v.y + (gantt.config.row_height - wrapper_size)/2;
		switch (v.direction){
			case this.dirs.left:
				res = {	top : y,
					height : wrapper_size,
					lineHeight : wrapper_size,
					left : v.x - v.size - wrapper_size/2 ,
					width : v.size +wrapper_size};
				break;
			case this.dirs.right:
				res = {	top : y,
					lineHeight : wrapper_size,
					height : wrapper_size,
					left : v.x - wrapper_size/2,
					width : v.size + wrapper_size};
				break;
			case this.dirs.up:
				res = {	top : y - v.size,
					lineHeight: v.size + wrapper_size,
					height : v.size + wrapper_size,
					left : v.x - wrapper_size/2,
					width : wrapper_size};
				break;
			case this.dirs.down:
				res = {	top : y,
					lineHeight: v.size + wrapper_size,
					height : v.size + wrapper_size,
					left : v.x - wrapper_size/2,
					width : wrapper_size};
				break;
			default:
				break;
		}

		return res;
	},
	get_line_sizes : function(v){
		var res,
			line_size = gantt.config.link_line_width,
			wrapper_size = gantt.config.link_wrapper_width,
			size =  v.size + line_size;
		switch (v.direction){
			case this.dirs.left:
			case this.dirs.right:
				res = {
					height : line_size,
					width : size,
					marginTop: (wrapper_size - line_size)/2,
					marginLeft: (wrapper_size - line_size)/2
				};
				break;
			case this.dirs.up:
			case this.dirs.down:
				res = {
					height : size,
					width : line_size,
					marginTop: (wrapper_size - line_size)/2,
					marginLeft: (wrapper_size - line_size)/2
				};
				break;
			default:
				break;
		}



		return res;
	},
	render_line : function(v){
		var pos = this.get_wrapper_sizes(v);
		var wrapper = document.createElement("div");
		wrapper.style.cssText = [
			"top:" + pos.top + "px",
			"left:" + pos.left + "px",
			"height:" + pos.height + "px",
			"width:" + pos.width + "px"
		].join(';');
		wrapper.className = "gantt_line_wrapper";

		var innerPos = this.get_line_sizes(v);
		var inner = document.createElement("div");
		inner.style.cssText = [
			"height:" + innerPos.height + "px",
			"width:" + innerPos.width + "px",
			"margin-top:" + innerPos.marginTop + "px",
			"margin-left:" + innerPos.marginLeft + "px"
		].join(";");

		inner.className = "gantt_link_line_" + v.direction;
		wrapper.appendChild(inner);

		return wrapper;
	},
	_get_line:function(from, to){
		var direction = this.get_direction(from, to);
		var vect = {
			x : from.x,
			y : from.y,
			direction : this.get_direction(from, to)
		};
		if(direction == this.dirs.left || direction == this.dirs.right){
			vect.size =  Math.abs(from.x - to.x);
		}else{
			vect.size =  Math.abs(from.y - to.y);
		}
		return vect;
	},
	get_direction:function(from, to){
		var direction = 0;
		if(to.x < from.x){
			direction = this.dirs.left;
		}else if (to.x > from.x){
			direction = this.dirs.right;
		}else if (to.y > from.y){
			direction = this.dirs.down;
		}else {
			direction = this.dirs.up;
		}
		return direction;
	}

};
gantt._y_from_ind = function(index){
	return (index)*gantt.config.row_height;
};
gantt._path_builder = {

	path:[],
	clear:function(){
		this.path = [];
	},
	current:function(){
		return this.path[this.path.length - 1];
	},
	point:function(next){
		if(!next)
			return this.current();

		this.path.push(dhtmlx.copy(next));
		return next;
	},
	point_to:function(direction, diff, point){
		if(!point)
			point = dhtmlx.copy(this.point());
		else
			point = {x:point.x, y:point.y};
		var dir = gantt._drawer.dirs;
		switch (direction){
			case (dir.left):
				point.x -= diff;
				break;
			case (dir.right):
				point.x += diff;
				break;
			case (dir.up):
				point.y -= diff;
				break;
			case (dir.down):
				point.y += diff;
				break;
			default:
				break;
		}
		return this.point(point);
	},
	get_points:function(link){
		var pt = this.get_endpoint(link);
		var xy = gantt.config;


		var dy = pt.e_y - pt.y;
		var dx = pt.e_x - pt.x;

		var dir = gantt._drawer.dirs;

		this.clear();
		this.point({x: pt.x, y : pt.y});

		var shiftX = 2*xy.link_arrow_size;//just random size for first line


		var forward = (pt.e_x > pt.x);
		if(link.type == gantt.config.links.start_to_start){
			this.point_to(dir.left, shiftX);
			if(forward){
				this.point_to(dir.down, dy);
				this.point_to(dir.right,  dx);
			}else{
				this.point_to(dir.right, dx);
				this.point_to(dir.down, dy);
			}
			this.point_to(dir.right, shiftX);

		}else if(link.type == gantt.config.links.finish_to_start){
			forward = (pt.e_x > (pt.x + 2*shiftX));
			this.point_to(dir.right, shiftX);
			if(forward){
				dx -= shiftX;
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			}else{
				dx -= 2*shiftX;
				var sign = dy > 0 ? 1 : -1;

				this.point_to(dir.down, sign * (xy.row_height/2));
				this.point_to(dir.right, dx);
				this.point_to(dir.down, sign * ( Math.abs(dy) - (xy.row_height/2)));
				this.point_to(dir.right, shiftX);
			}

		}else if(link.type == gantt.config.links.finish_to_finish){
			this.point_to(dir.right, shiftX);
			if(forward){
				this.point_to(dir.right, dx);
				this.point_to(dir.down, dy);
			}else{
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			}
			this.point_to(dir.left, shiftX);
		}

		return this.path;
	},
	get_endpoint : function(link){
		var types = gantt.config.links;
		var start_top = gantt._get_visible_order(link.source);
		var end_top = gantt._get_visible_order(link.target);

		var start_left, end_left;

		if(link.type == types.start_to_start){
			start_left = gantt._pull[link.source].start_date;
			end_left = gantt._pull[link.target].start_date;
		}else if(link.type == types.finish_to_finish){
			start_left = gantt._pull[link.source].end_date;
			end_left = gantt._pull[link.target].end_date;
		}else if(link.type == types.finish_to_start){
			start_left = gantt._pull[link.source].end_date;
			end_left = gantt._pull[link.target].start_date;
		}else{
			dhtmlx.assert(false, "Invalid link type");
		}


		return {
			x :  gantt._pos_from_date(start_left),
			e_x : gantt._pos_from_date(end_left),
			y : gantt._y_from_ind(start_top) ,
			e_y : gantt._y_from_ind(end_top)
		};
	}
};

gantt._init_links_dnd = function() {
	var dnd = new dhtmlxDnD(this.$task_bars, { sensitivity : 0, updates_per_second : 60 });
	var start_marker = "task_left";
	var link_edge_marker = "gantt_link_point";
	var link_landing_hover_area = "gantt_link_control";

	dnd.attachEvent("onBeforeDragStart", dhtmlx.bind(function(obj,e) {
		var target = (e.target||e.srcElement);
		resetDndState();
		if(gantt.getState().drag_id)
			return false;


		if(gantt._locate_css(target, link_edge_marker)){
			if(gantt._locate_css(target, start_marker))
				gantt._link_source_task_start = true;

			var sid = gantt._link_source_task = this.locate(e);
			var t = gantt.getTask(sid);
			this._dir_start = {
				y : gantt._y_from_ind(gantt._get_visible_order(sid)) + gantt.config.row_height/2,
				x : gantt._pos_from_date(gantt._link_source_task_start ? t.start_date : t.end_date)
			};
			return true;
		}else{
			return false;
		}

	}, this));

	dnd.attachEvent("onAfterDragStart", dhtmlx.bind(function(obj,e) {
		updateMarkedHtml(dnd.config.marker);
	}, this));

	dnd.attachEvent("onDragMove", dhtmlx.bind(function(obj,e) {
		var dd = dnd.config;
		var pos = dnd.getPosition(e);
		advanceMarker(dd.marker, pos);
		var landing = gantt._is_link_drop_area(e);

		var prevTarget = gantt._link_target_task;
		var prevLanding = gantt._link_landing;
		var prevToStart = gantt._link_target_task_start;

		var targ = gantt.locate(e);
		if(landing){
			//refreshTask
			var to_start = false;


			var to_start = !!gantt._locate_css(e, start_marker);
			var landing = !!targ;
		}

		gantt._link_target_task = targ;
		gantt._link_landing = landing;
		gantt._link_target_task_start = to_start;

		if(landing){
			var t = gantt.getTask(targ);
			var shift = Math.floor((e.srcElement || e.target).offsetWidth  / 2);
			this._dir_end = {
				y : gantt._y_from_ind(gantt._get_visible_order(targ)) + gantt.config.row_height/2,
				x : gantt._pos_from_date(to_start ? t.start_date : t.end_date) + (to_start ? -1 : 1)*shift
			};
		}else{
			this._dir_end = gantt._get_mouse_pos(e);
		}

		var targetChanged = !(prevLanding == landing && prevTarget == targ && prevToStart == to_start);
		if(targetChanged){
			if(prevTarget)
				gantt.refreshTask(prevTarget, false);
			if(targ)
				gantt.refreshTask(targ, false);
		}

		if(targetChanged){
			updateMarkedHtml(dd.marker);
		}



		showDirectingLine(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y);

		return true;
	}, this));


	dnd.attachEvent("onDragEnd", dhtmlx.bind(function() {
		var link = getDndState();

		if(link.from && link.to && link.from != link.to){
			var type = gantt._get_link_type(link.from_start, link.to_start);

			if(type)
				gantt.addLink({source : link.from, target: link.to, type:type});
		}

		resetDndState();

		if(link.from)
			gantt.refreshTask(link.from, false);
		if(link.to)
			gantt.refreshTask(link.to, false);
		removeDirectionLine();
	}, this));

	function updateMarkedHtml(marker){
		var link = getDndState();

		var css = ["gantt_link_tooltip"];
		if(link.from && link.to){
			if(gantt.isLinkAllowed(link.from, link.to, link.from_start, link.to_start)){
				css.push("gantt_allowed_link");
			}else{
				css.push("gantt_invalid_link");
			}
		}

		var className = gantt.templates.drag_link_class(link.from, link.from_start, link.to, link.to_start);
		if(className)
			css.push(className);

		var html = "<div class='"+className+ "'>" +
			gantt.templates.drag_link(link.from, link.from_start, link.to, link.to_start) +
			"</div>";
		marker.innerHTML = html;
	}

	function advanceMarker(marker, pos){
		marker.style.left = pos.x + 5 + "px";
		marker.style.top = pos.y + 5 + "px";
	}
	function getDndState(){
		return { from : gantt._link_source_task,
				to : gantt._link_target_task,
				from_start : gantt._link_source_task_start,
				to_start : gantt._link_target_task_start};
	}
	function resetDndState(){
		gantt._link_source_task =
			gantt._link_source_task_start =
				gantt._link_target_task =
					gantt._link_target_task_start = null;
	}
	function showDirectingLine(s_x, s_y, e_x, e_y){
		var div = getDirectionLine();

		var link = getDndState();

		var css = ["gantt_link_direction"];
		if(gantt.templates.link_direction_class){
			css.push(gantt.templates.link_direction_class(link.from, link.from_start, link.to, link.to_start));
		}

		var dist =Math.sqrt( (Math.pow(e_x - s_x, 2)) + (Math.pow(e_y - s_y, 2)) );
		dist = Math.max(0, dist - 3);
		if(!dist)
			return;

		div.className = css.join(" ");
		var tan = (e_y - s_y)/(e_x - s_x),
			angle = Math.atan(tan);

		if(coordinateCircleQuarter(s_x, e_x, s_y, e_y) == 2){
			angle += Math.PI;
		}else if(coordinateCircleQuarter(s_x, e_x, s_y, e_y) == 3){
			angle -= Math.PI;
		}



		var sin = Math.sin(angle),
			cos = Math.cos(angle),
			top = Math.round(s_y),
			left = Math.round(s_x);


		var style = [
			"-webkit-transform: rotate("+angle+"rad)",
			"-moz-transform: rotate("+angle+"rad)",
			"-ms-transform: rotate("+angle+"rad)",
			"-o-transform: rotate("+angle+"rad)",
			"transform: rotate("+angle+"rad)",
			"width:" + Math.round(dist) + "px"
		];

		if(window.navigator.userAgent.indexOf("MSIE 8.0") != -1){
			//ms-filter breaks styles in ie9, so add it only for 8th
			style.push("-ms-filter: \"" + ieTransform(sin, cos) + "\"");

			var shiftLeft = Math.abs(Math.round(s_x - e_x)),
				shiftTop = Math.abs(Math.round(e_y - s_y));
			//fix rotation axis
			switch(coordinateCircleQuarter(s_x, e_x, s_y, e_y)){
				case 1:
					top -= shiftTop;
					break;
				case 2:
					left -= shiftLeft;
					top -= shiftTop;
					break;
				case 3:
					left -= shiftLeft;
					break;
				default:
					break;
			}

		}

		style.push("top:" +  top + "px");
		style.push("left:" +  left + "px");

		div.style.cssText = style.join(";");
	}

	function ieTransform(sin, cos){
		return "progid:DXImageTransform.Microsoft.Matrix("+
			"M11 = "+cos+","+
			"M12 = -"+sin+","+
			"M21 = "+sin+","+
			"M22 = "+cos+","+
			"SizingMethod = 'auto expand'"+
		")";
	}
	function coordinateCircleQuarter(sX, eX, sY, eY){
		if(eX >= sX){
			if(eY <= sY){
				return 1;
			}else{
				return 4;
			}
		}else{
			if(eY <= sY){
				return 2;
			}else{
				return 3;
			}
		}

	}
	function getDirectionLine(){
		if(!dnd._direction){
			dnd._direction = document.createElement("div");
			gantt.$task_links.appendChild(dnd._direction);
		}
		return dnd._direction;
	}
	function removeDirectionLine(){
		if(dnd._direction){
			dnd._direction.parentNode.removeChild(dnd._direction);

			dnd._direction = null;
		}
	}

	gantt._is_link_drop_area = function(e){
		return !!gantt._locate_css(e, link_landing_hover_area);
	};
};
gantt._get_link_state = function(){
	return {
		link_landing_area : this._link_landing,
		link_target_id : this._link_target_task,
		link_target_start : this._link_target_task_start,
		link_source_id : this._link_source_task,
		link_source_start : this._link_source_task_start
	}
};

gantt._init_tasks = function(){
	//store temporary configs
	this._tasks = {
		col_width:this.config.columnWidth,
        width: [], // width of each column
        full_width: 0, // width of all columns
		trace_x:[],
		rendered:{}
	};


	this._click.gantt_task_link = dhtmlx.bind(function(e, trg){
		var id = this.locate(e, gantt.config.link_attribute);
		if(id){
			this.callEvent("onLinkClick", [id, e]);
		}
	}, this);

	this._dbl_click.gantt_task_link = dhtmlx.bind(function(e, id, trg){
		var id = this.locate(e, gantt.config.link_attribute);
		this._delete_link_handler(id, e);
	}, this);

	this._dbl_click.gantt_link_point = dhtmlx.bind(function(e, id, trg){
		var id = this.locate(e),
			task = this.getTask(id);


		var link = null;
		if(trg.parentNode && trg.parentNode.className){
			if(trg.parentNode.className.indexOf("_left") > -1){
				link = task.$target[0];
			}else{
				link = task.$source[0];
			}
		}
		if(link)
			this._delete_link_handler(link, e);
		return false;
	}, this);

	this._tasks_dnd.init();
	this._init_links_dnd();
	this._taskRenderer = gantt._task_renderer("line", this._render_task_element, this.$task_bars);
	this._linkRenderer = gantt._task_renderer("links", this._render_link_element, this.$task_links);
	this._gridRenderer = gantt._task_renderer("grid_items", this._render_grid_item, this.$grid_data);
	this._bgRenderer = gantt._task_renderer("bg_lines", this._render_bg_line, this.$task_bg);



	function refreshId(renders, oldId, newId, item){
		for(var i =0; i < renders.length; i++){
			renders[i].change_id(oldId, newId);
			renders[i].render_item(item);
		}
	}
	this.attachEvent("onTaskIdChange", function(oldId, newId){
		var render = this._get_task_renderers();
		refreshId(render, oldId, newId, this.getTask(newId));
	});

	this.attachEvent("onLinkIdChange", function(oldId, newId){
		var render = this._get_link_renderers();
		refreshId(render, oldId, newId, this.getLink(newId));
	});

};
gantt._get_task_renderers = function(){
	return [
		this._taskRenderer,
		this._gridRenderer,
		this._bgRenderer
	];
};
gantt._get_link_renderers = function(){
	return [
		this._linkRenderer
	];
};
gantt._delete_link_handler = function(id, e){
	if(id && this.callEvent("onLinkDblClick", [id, e])){

		var title = "";
		var question = gantt.locale.labels.link + " " +this.templates.link_description(this.getLink(id)) + " " + gantt.locale.labels.confirm_link_deleting;
		
		window.setTimeout(function(){
			gantt._dhtmlx_confirm(question, title, function(){
				gantt.deleteLink(id);
			});		
		},(gantt.config.touch ? 300 : 1));
	}
};
gantt.getTaskNode = function(id){
	return this._taskRenderer.rendered[id];
};
gantt.getLinkNode = function(id){
	return this._linkRenderer.rendered[id];
};





gantt._get_tasks_data = function(){
	var rows = [];
	for(var i=0; i < this._order.length; i++){
		var item = this._pull[this._order[i]];
		item.$index = i;
		this._update_parents(item.id, true);
		rows.push(item);
	}
	return rows;
};
gantt._get_links_data = function(){
	var links = [];
	for(var i in this._lpull)
		links.push(this._lpull[i]);

	return links;
};
gantt._render_data = function(){
	this._update_layout_sizes();

	var data = this._get_tasks_data();

	var renderers = this._get_task_renderers();
	for(var i=0; i < renderers.length; i++){
		renderers[i].render_items(data);
	}

	var links = gantt._get_links_data();
	renderers = this._get_link_renderers();
	for(var i=0; i < renderers.length; i++)
		renderers[i].render_items(links);
};

gantt._update_layout_sizes = function(){
	var cfg = this._tasks;

	// height of the bar item
	var height = this.config.task_height;
	if(height == "full")
		height = this.config.row_height - 5;
	//item height cannot be bigger than row height
	height = Math.min(height, this.config.row_height);
	cfg.bar_height = height;

	//task bars layer
	this.$task_data.style.height = this.$task.offsetHeight - this.config.scale_height + 'px';

	//background layer
	this.$task_bg.style.width = cfg.full_width + "px";

	//grid area
	var columns = this.config.columns;
	var width = 0;
	for (var i = 0; i < columns.length; i++)
		width += columns[i].width;
	this.$grid_data.style.width = (width-1) + "px";
};


gantt._init_tasks_range = function(){
	var unit = this.config.scale_unit;
	if(this.config.start_date && this.config.end_date){
		this._min_date = this.date[unit + "_start"]( new Date(this.config.start_date));
		this._max_date = this.date[unit + "_start"]( new Date(this.config.end_date));
		return;
	}

	var data = this._get_tasks_data();
	var root = this._init_task({id:0});
	data.push(root);


	var max = -Infinity,
		min = Infinity;

	this.eachTask(function(child){
		if(+child.end_date > +max){
			max = new Date(child.end_date);
		}
	}, '0');

	this.eachTask(function(child){
		if(+child.start_date < +min){
			min = new Date(child.start_date);
		}
	}, '0');

	this._min_date = min;
	this._max_date = max;
	
	if(!max || max == -Infinity){
		this._min_date = new Date();
		this._max_date = new Date(this._min_date);
	}

	this._min_date = this.date[unit + "_start"](this._min_date);
	if(+this._min_date == +min)
		this._min_date = this.date.add(this.date[unit + "_start"](this._min_date), -1, unit);

	this._max_date = this.date[unit + "_start"](this._max_date);
	this._max_date = this.date.add(this._max_date, 1, unit);
};



gantt._prepare_scale_html = function(config){
	var cells = [];
	var date = null, content = null, css = null;

	if(config.template || config.date){
		content = config.template || this.date.date_to_str(config.date);
	}


	css = config.css || gantt.templates.scale_cell_class;


	for (var i = 0; i < config.count; i++) {
		date = new Date(config.trace_x[i]);
		var value = content.call(this, date);
		var width = config.width[i];
		var style = "width:"+(width)+"px;";

	//	style += "height:100%;line-height:100%;";
		var cssclass = "gantt_scale_cell" + (i == config.count-1 ? " gantt_last_cell" : "");

		var template = css.call(this, date);
		if(template) cssclass += " " + template;

		var cell = "<div class='" + cssclass + "' style='" + style + "'>" + value + "</div>";
		cells.push(cell);
	}
	return cells.join("");
};

gantt._render_tasks_scales = function() {
	this._init_tasks_range();
    this._scroll_resize();
    this._set_sizes();

	var helpers = this._scale_helpers;
	var scales = [helpers.primaryScale()].concat(this.config.subscales);


	helpers.sortScales(scales);

	var cfgs = helpers.prepareConfigs(scales,this.config.min_column_width, this.$task.offsetWidth, this.config.scale_height - 1);
	var cfg = this._tasks = cfgs[cfgs.length - 1];

	var html = [];
	for(var i=0; i < cfgs.length; i++){
		html.push("<div class=\"gantt_scale_line\" style=\"height:"+(cfgs[i].height)+"px;line-height:"+(cfgs[i].height)+"px\">" + this._prepare_scale_html(cfgs[i]) + "</div>");
	}


    this.$task_scale.style.height = (this.config.scale_height-1) + "px";

    this.$task_data.style.width =
	this.$task_scale.style.width = cfg.full_width + this.$scroll_ver.offsetWidth + "px";
	this.$task_links.style.width =
		this.$task_bars.style.width = cfg.full_width + "px";

	scales =  html.join("");
    this.$task_scale.innerHTML = scales;
};



gantt._render_bg_line = function(item){
	var cfg = gantt._tasks;
	var count = cfg.count;
	var cells = [];

	for (var j = 0; j < count; j++) {
		var width = cfg.width[j];
		var style = "width:"+(width)+"px;";
		var cssclass = "gantt_task_cell" + (j == count-1 ? " gantt_last_cell" : "");

		cssTemplate = this.templates.task_cell_class(item, cfg.trace_x[j]);
		if(cssTemplate)
			cssclass += " " + cssTemplate;

		var cell = "<div class='" + cssclass + "' style='" + style + "'></div>";
		cells.push(cell);
	}
	var odd = item.$index%2 !== 0;
	var cssTemplate = gantt.templates.task_row_class(item.start_date, item.end_date, item);
	var css = "gantt_task_row" + (odd ? " odd" : "") + (cssTemplate ? ' '+cssTemplate : '');

	if(this.getState().selected_task == item.id){
		css += " gantt_selected";
	}

	//var row = "<div class='" + css + "' " + this.config.task_attribute + "='" + item.id + "'>" + cells.join("") + "</div>";
	var row = document.createElement("div");
	row.className = css;
	row.style.height = (gantt.config.row_height)+"px";
	row.setAttribute(this.config.task_attribute, item.id);
	row.innerHTML = cells.join("");
	return row;
};


gantt._adjust_scales = function(){
	if(this.config.fit_tasks){
		var old_min = +this._min_date,
			old_max = +this._max_date;
		this._init_tasks_range();
		if(+this._min_date != old_min || +this._max_date != old_max){
			this.render();

			this.callEvent("onScaleAdjusted", []);
			return true;
		}
	}
	return false;
};

//refresh task and related links
gantt.refreshTask = function(taskId, refresh_links){
	var renders = this._get_task_renderers();

	var task = this.getTask(taskId);
	if(task && this.isTaskVisible(taskId)){
		for(var i =0; i < renders.length; i++)
			renders[i].render_item(task);
	}else{
		for(var i =0; i < renders.length; i++)
			renders[i].remove_item(taskId);
	}


	if(refresh_links !== undefined && !refresh_links)
		return;

	var task = this.getTask(taskId);
	for(var i=0; i < task.$source.length; i++){
		gantt.refreshLink(task.$source[i]);
	}
	for(var i=0; i < task.$target.length; i++){
		gantt.refreshLink(task.$target[i]);
	}
};
gantt.refreshLink = function(linkId){
	if(this.isLinkExists(linkId))
		gantt._render_link(linkId);
	else
		gantt._linkRenderer.remove_item(linkId);
};



gantt._combine_item_class = function(basic, template, itemId){
	var css = [basic];
	if(template)
		css.push(template);

	var state = gantt.getState();

	if(this._is_flex_task(this.getTask(itemId)))
		css.push("gantt_dependent_task")

	if(this.config.select_task && itemId == state.selected_task)
		css.push("gantt_selected");

	if(itemId == state.drag_id)
		css.push("gantt_drag_" + state.drag_mode);

	var links = gantt._get_link_state();
	if(links.link_source_id == itemId)
		css.push("gantt_link_source");

	if(links.link_target_id == itemId)
		css.push("gantt_link_target");

	if(links.link_landing_area
		&& (links.link_target_id && links.link_source_id)
		&& (links.link_target_id != links.link_source_id)){

		var from_id = links.link_source_id;
		var from_start = links.link_source_start;
		var to_start = links.link_target_start;

		var allowDrag = gantt.isLinkAllowed(from_id, itemId, from_start, to_start);

		var dragClass = "";
		if(allowDrag){
			if(to_start)
				dragClass = "link_start_allow";
			else
				dragClass = "link_finish_allow";
		}else{
			if(to_start)
				dragClass = "link_start_deny";
			else
				dragClass = "link_finish_deny";
		}
		css.push(dragClass);
	}
	return css.join(" ");
};

gantt._render_pair = function(parent, css, task, content){
	var state = gantt.getState();

	if(+task.end_date <= +state.max_date)
		parent.appendChild(content(css+" task_right"));

	if(+task.start_date >= +state.min_date)
		parent.appendChild(content(css+" task_left"));
};

gantt._render_task_element = function(task){
	if(!(+task.start_date < +this._max_date && +task.end_date > +this._min_date))
		return false;

	var pos = this._get_task_coord(task);
	var end = this._pos_from_date(task.end_date);

	var cfg = this.config;
	var height = this._tasks.bar_height;

	//item height cannot be bigger than row height
	height = Math.min(height, this.config.row_height);

	var padd = Math.floor((this.config.row_height - height)/2);
	var div = document.createElement("div");
	var width = Math.round(end - pos.x);
	div.setAttribute(this.config.task_attribute, task.id);
	//use separate div to display content above progress bar
	div.appendChild(gantt._render_task_content(task, width));

	div.className = this._combine_item_class("gantt_task_line",
		this.templates.task_class(task.start_date, task.end_date, task),
		task.id);


	div.style.cssText = [
		"left:" + pos.x + "px",
		"top:" + (padd + pos.y) + 'px',
		"height:" + height + 'px',
		"line-height:" + height + 'px',
		"width:" + width + 'px'
	].join(";");

	var side = this._render_leftside_content(task);
	if(side) div.appendChild(side);

	side = this._render_rightside_content(task);
	if(side) div.appendChild(side);

	if(cfg.show_progress){
		this._render_task_progress(task,div, width);
	}


	if(cfg.drag_resize && !this._is_flex_task(task)){
		gantt._render_pair(div, "gantt_task_drag", task, function(css){
			var el = document.createElement("div");
			el.className = css;
			return el;
		});
	}
	if(cfg.drag_links){
		gantt._render_pair(div, "gantt_link_control", task, function(css){
			var outer = document.createElement("div");
			outer.className = css;
			outer.style.cssText = [
				"height:" + height + 'px',
				"line-height:" + height + 'px'
			].join(";");
			var inner = document.createElement("div");
			inner.className = "gantt_link_point";
			outer.appendChild(inner);
			return outer;
		});
	}
	return div;
};

gantt._render_side_content = function(task, template, cssClass){
	if(!template) return null;

	var text = template(task.start_date, task.end_date, task);
	if(!text) return null;
	var content = document.createElement("div");
	content.className = "gantt_side_content " + cssClass;
	content.innerHTML = text;
	return content;
};



gantt._render_leftside_content = function(task){
	var css = "gantt_left " + gantt._get_link_crossing_css(true, task);
	return gantt._render_side_content(task, this.templates.leftside_text, css);
};
gantt._render_rightside_content = function(task){
	var css = "gantt_right " + gantt._get_link_crossing_css(false, task);
	return gantt._render_side_content(task, this.templates.rightside_text, css);
};

gantt._get_conditions = function(leftside){
	if(leftside){
		return {
			$source : [
				gantt.config.links.start_to_start
			],
			$target : [
				gantt.config.links.start_to_start,
				gantt.config.links.finish_to_start
			]
		};
	}else{
		return {
			$source : [
				gantt.config.links.finish_to_start,
				gantt.config.links.finish_to_finish
			],
			$target : [
				gantt.config.links.finish_to_finish
			]
		};
	}
};

gantt._get_link_crossing_css = function(left, task){
	var cond = gantt._get_conditions(left);

	for(var i in cond){
		var links = task[i];
		for(var ln =0; ln < links.length; ln++){
			var link = gantt.getLink(links[ln]);

			for(var tp =0; tp < cond[i].length; tp++){
				if(link.type == cond[i][tp]){
					return "gantt_link_crossing";
				}
			}
		}
	}
	return "";
};



gantt._render_task_content = function(task, width){
	var content = document.createElement("div");
	content.innerHTML = this.templates.task_text(task.start_date, task.end_date, task);
	content.className = "gantt_task_content";
	content.style.width = width + 'px';
	return content;
};
gantt._render_task_progress = function(task, element, maxWidth){
	var done = task.progress*1 || 0;

	maxWidth = Math.max(maxWidth - 2, 0);//2px for borders
	var pr = document.createElement("div");
	var width = Math.round(maxWidth*done);
	pr.style.width = width + 'px';
	pr.className = "gantt_task_progress";
	pr.innerHTML = this.templates.progress_text(task.start_date, task.end_date, task);
	element.appendChild(pr);
	if(this.config.drag_progress){
		var drag = document.createElement("div");
		drag.style.left = width + 'px';
		drag.className = "gantt_task_progress_drag";
		pr.appendChild(drag);
		element.appendChild(drag);
	}
};
gantt._get_line = function(step) {
    var steps = {
        "second": 1,
        "minute": 60,
        "hour": 60*60,
        "day": 60*60*24,
        "week": 60*60*24*7,
        "month": 60*60*24*30,
        "year": 60*60*24*365
    };
    return steps[step] || 0;
};


gantt._date_from_pos = function(x){
	var scale = this._tasks;
	if(x < 0 || x > scale.full_width){
		return null;
	}
	var ind = 0;
	var summ = 0;
	while(summ + scale.width[ind] < x){
		ind++;
		summ += scale.width[ind];
	}
	var part = (x - summ)/scale.width[ind];

	var unit =  gantt._get_coll_duration(scale, scale.trace_x[ind]);


	var date = new Date(scale.trace_x[ind].valueOf() +  Math.round(part*unit));
	return date;
};

gantt._pos_from_date = function(date){
	var ind = gantt._day_index_by_date(date);
	dhtmlx.assert(ind >= 0, "Invalid day index");

	var wholeCells = Math.floor(ind);
	var partCell = ind % 1;

	var pos = 0;
	for(var i=1; i <= wholeCells; i++)
		pos += gantt._tasks.width[i-1];

	if(partCell){
		if(wholeCells < gantt._tasks.width.length){
			pos += gantt._tasks.width[wholeCells]*(partCell % 1);
		}else{
			pos += 1;
		}

	}
	return pos;
};

gantt._day_index_by_date = function(date){
	var pos = new Date(date);
	var days = gantt._tasks.trace_x;

	if(+pos <= this._min_date)
		return 0;

	if(+pos >= this._max_date)
		return days.length;

	for (var xind = 0; xind < days.length-1; xind++) {
		// | 8:00, 8:30 | 8:15 should be checked against 8:30
		// clicking at the most left part of the cell, say 8:30 should create event in that cell, not previous one
		if (+pos < days[xind+1])
			break;
	}
	return xind + ((date - days[xind]) / gantt._get_coll_duration(gantt._tasks, days[xind]));
};
gantt._get_coll_duration = function(scale, date){
	return gantt.date.add(date, scale.step, scale.unit) -  date;
};
gantt._get_y_pos = function(task_id){
	var index = this._get_visible_order(task_id);
	dhtmlx.assert((index != -1), "Task index not found");

	return index * this.config.row_height;
};

gantt._get_task_coord = function(task){
	return {
		x:gantt._pos_from_date(task.start_date),
		y:gantt._get_y_pos(task.id)
	};
};

gantt._correct_shift=function(start, back){
	return start-=((new Date(gantt._min_date)).getTimezoneOffset()-(new Date(start)).getTimezoneOffset())*60000*(back?-1:1);
};

gantt._scroll_task_area = function(left, top){
	if(left*1 === left){
		this.$task.scrollLeft = left;
	}
	if(top*1 === top){
		this.$task_data.scrollTop = top;
	}
};


gantt._get_mouse_pos = function(ev){
	if (ev.pageX || ev.pageY)
		var pos = {x:ev.pageX, y:ev.pageY};

	var d = _isIE ? document.documentElement : document.body;
	var pos = {
		x:ev.clientX + d.scrollLeft - d.clientLeft,
		y:ev.clientY + d.scrollTop - d.clientTop
	};

	var box = gantt._get_position(gantt.$task_data);
	pos.x = pos.x - box.x + gantt.$task_data.scrollLeft;
	pos.y = pos.y - box.y + gantt.$task_data.scrollTop;
	return pos;
};

//helper for rendering bars and links
gantt._task_renderer = function(id, render_one, node){
	//hash of dom elements is needed to redraw single bar/link
	if(!this._task_area_pulls)
		this._task_area_pulls = {};

	if(!this._task_area_renderers)
		this._task_area_renderers = {};

	if(this._task_area_renderers[id])
		return this._task_area_renderers[id];

	if(!render_one)
		dhtmlx.assert(false, "Invalid renderer call");

	this._task_area_renderers[id] = {
		render_item : function(item, container){
			var pull = gantt._task_area_pulls[id];
			container = container || node;
			var dom = render_one.call(gantt, item);
			if(!dom) return;
			if(pull[item.id]){
				this.replace_item(item.id, dom);
			}else{
				pull[item.id] = dom;
				container.appendChild(dom);
			}
		},
		render_items : function(items, container){
			this.rendered = gantt._task_area_pulls[id] = {};
			container = container || node;
			container.innerHTML = "";
			var buffer = document.createDocumentFragment();
			for(var i= 0, vis = items.length; i < vis; i++){
				this.render_item(items[i], buffer);
			}
			container.appendChild(buffer);
		},
		replace_item: function(item_id, newNode){
			var item = this.rendered[item_id];
			if(item && item.parentNode){
				item.parentNode.replaceChild(newNode, item);
			}
			this.rendered[item_id] = newNode;
		},
		remove_item:function(item_id){
			var item = this.rendered[item_id];
			if(item && item.parentNode){
				item.parentNode.removeChild(item);
			}
			delete this.rendered[item_id];
		},
        change_id: function(oldid, newid) {
            this.rendered[newid] = this.rendered[oldid];
            delete this.rendered[oldid];
        },
		rendered : this._task_area_pulls[id],
		node: node
	};

	return this._task_area_renderers[id];
};


gantt.showTask = function(id) {
    var el = this.getTaskNode(id);
    var left = Math.max(el.offsetLeft - this.config.task_scroll_offset, 0);
    var top = el.offsetTop - (this.$task_data.offsetHeight - this.config.row_height)/2;
    this._scroll_task_area(left, top);
};

gantt._pull = {};
gantt._branches = {};
gantt._order = [];
gantt._lpull = {};

gantt.load = function(url, type, callback){
	dhtmlx.assert(arguments.length, "Invalid load arguments");
	this.callEvent("onLoadStart", []);
	var tp = 'json', cl = null;
	if(arguments.length >= 3){
		tp = type;
		cl = callback;
	}else{
		if(typeof arguments[1] == "string")
			tp = arguments[1];
		else if(typeof arguments[1] == "function")
			cl = arguments[1];
	}

	dhtmlxAjax.get(url, dhtmlx.bind(function(l) {
		this.on_load(l, tp);
		if(typeof cl == "function")
			cl.call(this);
	}, this));
};
gantt.parse = function(data, type) {
	this.on_load({xmlDoc: {responseText: data}}, type);
};

gantt.serialize = function(type){
	type = type || "json";
	return this[type].serialize();
};

/*
tasks and relations
{
data:[
	{
		"id":"string",
		"text":"...",
		"start_date":"Date or string",
		"end_date":"Date or string",
		"duration":"number",
		"progress":"0..1",
		"parent_id":"string",
		"order":"number"
	},...],
links:[
	{
		id:"string",
		source:"string",
		target:"string",
		type:"string"
	},...],
collections:{
		collectionName:[
			{key:, label:, optional:...},...
		],...
	}
}

 gantt._pull - id to object hash
 gantt._branch - array of per branch arrays of objects|ids
 gantt._order - array of visible elements
 gantt._order_full - array of all elements

 gantt._links
* */

gantt.on_load = function(resp, type){
	if(!type)
		type = "json";
	dhtmlx.assert(this[type], "Invalid data type:'" + type + "'");

	var raw = resp.xmlDoc.responseText;

	var data = this[type].parse(raw, resp);
	this._process_loading(data);
	this.callEvent("onLoadEnd", []);
};



gantt._process_loading = function(data){
	if(data.collections)
		this._load_collections(data.collections);

	var evs = {};
	var tasks = data.data;

	for (var i = 0; i < tasks.length; i++) {
		var task = tasks[i];
		this._init_task(task);
		if (!this.callEvent("onTaskLoading", [evs[i]])) continue;

		evs[task.id] = task;
		if (!this._branches[task.parent])
			this._branches[task.parent]  = [];
		this._branches[task.parent].push(task.id);
	}

	dhtmlx.mixin(this._pull, evs, true);

    this._sync_order();

    // calculating $level for each item
    for (var i in this._pull)
        this._pull[i].$level = this._item_level(this._pull[i]);

	this._init_links(data.links || (data.collections ? data.collections.links : []));

};


gantt._init_links = function(links){
	if (links)
		for(var i=0; i < links.length; i++){
	        var link = this._init_link(links[i]);
	        this._lpull[link.id] = link;
		}
    this._sync_links();
};


gantt._load_collections = function(collections){
	var collections_loaded = false;
	for (var key in collections) {
		if (collections.hasOwnProperty(key)) {
			collections_loaded = true;
			var collection = collections[key];
			var arr = this.serverList[key];
			if (!arr) continue;
			arr.splice(0, arr.length); //clear old options
			for (var j = 0; j < collection.length; j++) {
				var option = collection[j];
				var obj =  dhtmlx.copy(option);
				obj.key = obj.value;// resulting option object

				for (var option_key in option) {
					if (option.hasOwnProperty(option_key)) {
						if (option_key == "value" || option_key == "label")
							continue;
						obj[option_key] = option[option_key]; // obj['value'] = option['value']
					}
				}
				arr.push(obj);
			}
		}
	}
	if (collections_loaded)
		this.callEvent("onOptionsLoad", []);
};

gantt._sync_order = function() {
    this._order = [];
    this._sync_order_item({parent:0, $open:true, $ignore:true, id:0});

    this._scroll_resize();
    this._set_sizes();
};
gantt.attachEvent("onBeforeTaskDisplay", function(id, task){
	return !task.$ignore;
});
gantt._sync_order_item = function(item) {

	if(item.id && //do not trigger event for virtual root
		this.callEvent("onBeforeTaskDisplay", [item.id, item])){
		this._order.push(item.id);
	}


    if (item.$open) {
        var children = this._branches[item.id];
        if (children)
        	for (var i = 0; i < children.length; i++)
        		this._sync_order_item(this._pull[children[i]]);            	
    }
};

gantt._get_visible_order = function(id){
	dhtmlx.assert(id, "Invalid argument");
	var ord = this._order;
	for(var i= 0, count = ord.length; i < count; i++)
		if(ord[i] == id) return i;

	return -1;
};



gantt.eachTask = function(code, parent, master){
	parent = parent || 0;
	master = master || this;

	var branch = this._branches[parent];
	if (branch)
		for (var i=0; i<branch.length; i++){
			var item = this._pull[branch[i]];
			code.call(master, item);
			if (this._branches[item.id])
				this.eachTask(code, item.id, master);
		}
};

gantt.json = {
	parse : function(data){
		dhtmlx.assert(data, "Invalid data");

		if (typeof data == "string") {
			if(window.JSON)
				data = JSON.parse(data);
			else{
				gantt._temp = eval("(" + data + ")");
				data = gantt._temp || {};
				gantt._temp = null;
			}
		}

		if (data.dhx_security)
			dhtmlx.security_key = data.dhx_security;
		return data;
	},
	_copyLink:function(obj){
		var copy = {};
		for (var key in obj)
			copy[key] = obj[key];
		return copy;
	},
	_copyObject:function(obj){
		var copy = {};
		for (var key in obj){
			if (key.charAt(0) == "$")
				continue;
			copy[key] = obj[key];
		}
		copy.start_date = gantt.templates.xml_format(copy.start_date);
		if (copy.end_date)
			copy.end_date = gantt.templates.xml_format(copy.end_date);
		return copy;
	},
	serialize:function(){
		var tasks = [];
		var links = [];

		gantt.eachTask(function(obj){
			tasks.push(this._copyObject(obj));
		}, 0, this);
		for (var key in gantt._lpull)
			links.push(this._copyLink(gantt._lpull[key]));

		return {
			data : tasks,
			links: links
		};
	}
};

/*
<data>
	<task id:"some" parent_id="0" progress="0.5">
		<text>My task 1</text>
		<start_date>16.08.2013</start_date>
		<end_date>22.08.2013</end_date>
	</task>
	<coll_options>
		<links>
			<link source='a1' target='b2' type='c3' />
		</links>
	</coll_options>
</data>
*/

gantt.xml = {
	_xmlNodeToJSON:function(node, attrs_only){
		var t = {};
		for (var i = 0; i < node.attributes.length; i++)
			t[node.attributes[i].name] = node.attributes[i].value;

		if (!attrs_only){
			for (var i = 0; i < node.childNodes.length; i++) {
				var child = node.childNodes[i];
				if (child.nodeType == 1)
					t[child.tagName] = child.firstChild ? child.firstChild.nodeValue : "";
			}

			if (!t.text) t.text = node.firstChild ? node.firstChild.nodeValue : "";
		}

		return t;
	},
	_getCollections:function(loader){
		var collection = {};
		var opts = loader.doXPath("//coll_options");
		for (var i = 0; i < opts.length; i++) {
			var bind = opts[i].getAttribute("for");
			var arr = collection[bind] = [];
			var itms = loader.doXPath(".//item", opts[i]);
			for (var j = 0; j < itms.length; j++) {
				var itm = itms[j];
				var attrs = itm.attributes;
				var obj = { key: itms[j].getAttribute("value"), label: itms[j].getAttribute("label")};
				for (var k = 0; k < attrs.length; k++) {
					var attr = attrs[k];
					if (attr.nodeName == "value" || attr.nodeName == "label")
						continue;
					obj[attr.nodeName] = attr.nodeValue;
				}
				arr.push(obj);
			}
		}
		return collection;
	},
	_getXML:function(text, loader, toptag){
		toptag = toptag || "data";
		if (!loader.getXMLTopNode){
			loader = new dtmlXMLLoaderObject(function() {});
			loader.loadXMLString(text);	
		}

		xml = loader.getXMLTopNode(toptag);
		if (xml.tagName != toptag) throw "Invalid XML data";

		var skey = xml.getAttribute("dhx_security");
		if (skey)
			dhtmlx.security_key = skey;

		return loader;
	},
	parse:function(text, loader){
		loader = this._getXML(text, loader);
		var data = { };

		var evs = data.data = [];
		xml = loader.doXPath("//task");

		for (var i = 0; i < xml.length; i++)
			evs[i] = this._xmlNodeToJSON(xml[i]);

		data.collections = this._getCollections(loader);
		return data;
	},
	_copyLink:function(obj){
		return "<item id='"+obj.id+"' source='"+obj.source+"' target='"+obj.target+"' type='"+obj.type+"' />";
	},
	_copyObject:function(obj){
		var start_date = gantt.templates.xml_format(obj.start_date);
		var end_date   = gantt.templates.xml_format(obj.end_date);

		return "<task id='"+obj.id+"' parent='"+(obj.parent||"")+"' start_date='"+start_date+"' duration='"+obj.duration+"' open='"+(!!obj.open)+"' progress='"+obj.progress+"' end_date='"+end_date+"'><![CDATA["+obj.text+"]]></task>";
	},
	serialize:function(){
		var tasks = [];
		var links = [];

		gantt.eachTask(function(obj){
			tasks.push(this._copyObject(obj));
		},0, this);
		for (var key in gantt._lpull)
			links.push(this._copyLink(gantt._lpull[key]));

		return "<data>"+tasks.join("")+"<coll_options for='links'>"+links.join("")+"</coll_options></data>";			
	}
};


gantt.oldxml = {
	parse:function(text, loader){
		loader = gantt.xml._getXML(text, loader, "projects");
		var data = { collections:{ links:[] } };

		var evs = data.data = [];
		xml = loader.doXPath("//task");
		for (var i = 0; i < xml.length; i++){
			evs[i] = gantt.xml._xmlNodeToJSON(xml[i]);
			var parent = xml[i].parentNode;

			if (parent.tagName == "project")
				evs[i].parent = "project-"+parent.getAttribute("id");
			else
				evs[i].parent = parent.parentNode.getAttribute("id");
		}

		xml = loader.doXPath("//project");
		for (var i = 0; i < xml.length; i++){
			var ev = gantt.xml._xmlNodeToJSON(xml[i], true);
			ev.id ="project-"+ev.id;
			evs.push(ev);
		}

		for (var i=0; i<evs.length; i++){
			var ev = evs[i];
			ev.start_date = ev.startdate || ev.est;
			ev.end_date = ev.enddate;
			ev.text = ev.name;
			ev.duration = ev.duration / 8;
			ev.open = 1;
			if (!ev.duration && !ev.end_date) ev.duration = 1;
			if (ev.predecessortasks)
				data.collections.links.push({ target:ev.id, source:ev.predecessortasks, type:gantt.config.links.finish_to_start });
		}

		return data;
	},
	serialize:function(){
		webix.message("Serialization to 'old XML' is not implemented");
	}
};

gantt.serverList = function(name, array) {
    if (array) {
        return this.serverList[name] = array.slice(0);
    }
    return this.serverList[name] = (this.serverList[name] || []);
};
gantt.getTask = function(id) {
    dhtmlx.assert(this._pull[id]);
    return this._pull[id];
};
gantt.getTaskByTime = function(from, to){
	var p = this._pull,
		res = [],
		pos = 0,
		taken = 0;

	if(!(from || to)){
        for (var t in p) res.push(p[t]);
	}else{
		from = +from || -Infinity;
		to = +to || Infinity;
        for (var t in p){
            var task = p[t];
            if (+task.start_date < to && +task.end_date > from)
                res.push(task);
        }
	}

	return res;
};

gantt.isTaskExists = function(id) {
    return dhtmlx.defined(this._pull[id]);
};

gantt.isTaskVisible = function(id){
	if(!this._pull[id])
		return false;

	if(!(+this._pull[id].start_date < +this._max_date && +this._pull[id].end_date > +this._min_date))
		return false;

	for(var i= 0, count = this._order.length; i < count; i++)
		if(this._order[i] == id) return true;
	return false;
};


gantt.updateTask = function(id, item) {
    if (!dhtmlx.defined(item)) item = this.getTask(id);
    if (this.callEvent("onBeforeTaskUpdate", [id, item])===false) return false;

    this._pull[item.id] = item;
	this._update_parents(item.id);
    this.refreshTask(item.id);

    this.callEvent("onAfterTaskUpdate", [id, item]);

    this._sync_order();

	this._adjust_scales();
};
gantt.addTask = function(item, parent) {
    if (!dhtmlx.defined(parent)) parent = item.parent || 0;
    if (!dhtmlx.defined(this._pull[parent])) parent = 0;
    item.parent = parent;
    item = this._init_task(item);

    if (this.callEvent("onBeforeTaskAdd", [item.id, item])===false) return false;

    this._pull[item.id] = item;

    if (!this._branches[item.parent])
        this._branches[item.parent] = [];
    this._branches[item.parent].push(item.id);

    this.refreshData();

    this.callEvent("onAfterTaskAdd", [item.id, item]);
	this._adjust_scales();
    return item.id;
};

gantt.deleteTask = function(id) {
    return this._deleteTask(id);
};

gantt._deleteTask = function(id, silent) {
    var item = this.getTask(id);
    if (!silent && this.callEvent("onBeforeTaskDelete", [id, item])===false) return false;

    if (!silent && this._dp)
        this._dp.setUpdateMode("off");
    var branches = this._branches[item.id] || [];

    if(this._selected_task == id)
        this._selected_task = null;

    for (var i = 0; i < branches.length; i++) {
        this._silentStart();
        this._deleteTask(branches[i], true);
        // add deleted subrow into dataprocessor update list manually
        // because silent mode is on
        if (this._dp) {
            this._dp._ganttMode = "tasks";
            this._dp.setUpdated(branches[i],true,"deleted");
        }
        this._silentEnd();
    }
    if (!silent && this._dp)
        this._dp.setUpdateMode("cell");

    while (item.$source.length > 0)
        this.deleteLink(item.$source[0]);
    while (item.$target.length > 0)
        this.deleteLink(item.$target[0]);

    delete this._pull[id];
    delete this._branches[id];
    this._branch_update(item.parent, id);

    if (!silent) {
        this.callEvent("onAfterTaskDelete", [id, item]);
        this.refreshData();
    }
    return true;
};

gantt.clearAll = function() {
    this._pull = {};
    this._branches = {};
    this._order = [];
    this._order_full = [];
    this._lpull = {};

	this.refreshData();

    this.callEvent("onClear", []);
};

gantt.changeTaskId = function(oldid, newid) {
    var item = this._pull[newid] = this._pull[oldid];
    this._pull[newid].id = newid;
    delete this._pull[oldid];
    for (var id in this._pull) {
        if (this._pull[id].parent == oldid)
            this._pull[id].parent = newid;
    }
    if (this._lightbox_id == oldid)
        this._lightbox_id = newid;
    this._branch_update(item.parent, oldid, newid);
	this._sync_order();
	this.callEvent("onTaskIdChange", [oldid, newid]);
};

gantt._branch_update = function(id, key, newkey){
    var branch = this._branches[id];
    if (branch){
        var newbranch = [];
        for (var i=0; i<branch.length; i++){
            if (branch[i] != key)
                newbranch.push(branch[i]);
            else if (newkey)
                newbranch.push(newkey);
        }
        this._branches[id] = newbranch;
    }
};
gantt._get_duration_unit = function(){
	return (gantt._get_line(this.config.duration_unit)*1000) || this.config.duration_unit;
};
gantt._init_task = function(task){
    if (!dhtmlx.defined(task.id))
        task.id = dhtmlx.uid();

    //dhtmlx.assert(((task.start_date && task.duration) || (task.start_date && task.end_date)), "Invalid task time or duration");

	if(task.start_date)
    	task.start_date = gantt.date.parseDate(task.start_date, "xml_date");
	if(task.end_date)
		task.end_date = gantt.date.parseDate(task.end_date, "xml_date");

    var d = this._get_duration_unit();

    if (task.start_date && task.duration)
        task.end_date = new Date(task.start_date.valueOf() + task.duration*d);

	gantt._init_task_timing(task);

    task.$source = [];
    task.$target = [];
    task.parent = task.parent || 0;
    task.$open = dhtmlx.defined(task.open) ? task.open : false;
    task.$level = this._item_level(task);
    return task;
};

gantt._init_task_timing = function(task){
	task.$no_end = !(task.end_date || task.duration);
	task.$no_start = !task.start_date;
};
gantt._is_flex_task = function(task){
	return !!(task.$no_end || task.$no_start);
};

gantt._update_parents = function(taskId, silent){
	if(!taskId) return;

	var task = this.getTask(taskId);

	while(!(task.$no_end || task.$no_start) && task.parent && this.isTaskExists(task.parent)){
		task = this.getTask(task.parent);
	}

	if(task.$no_end){
		var max = 0;
		this.eachTask(function(child){
			if(+child.end_date > +max){
				max = new Date(child.end_date);
			}
		}, task.id);

		if(max){
			task.end_date = max;
		}
	}
	if(task.$no_start){
		var min = Infinity;
		this.eachTask(function(child){
			if(+child.start_date < +min){
				min = new Date(child.start_date);
			}
		}, task.id);

		if(min != Infinity){
			task.start_date = min;
		}
	}

	if((task.$no_end || task.$no_start)){
		this._update_task_duration(task);
		if(!silent)
			this.refreshTask(task.id, true);
	}
	if(task.parent && this.isTaskExists(task.parent)){
		this._update_parents(task.parent, silent);
	}
};


gantt._round_date = function(date, steps, unit){
	var epoch = new Date(1970,0,1),
		unit = gantt.date.add(epoch, steps, unit) -  epoch,
		val = date - epoch,
		diff = val % unit,
		rounded_val = val - diff + Math.round(diff/unit)*unit;

	return new Date(+epoch + rounded_val);

};
gantt._round_task_dates = function(task, step, unit){
	task.start_date = this._round_date(+task.start_date, step, unit);
	task.end_date = this._round_date(+task.end_date, step, unit);
	if(task.end_date <= task.start_date){
		task.end_date = gantt.date.add(task.start_date,  step, unit);
	}
};
gantt._update_task_duration = function(task){
	if (task.start_date && task.end_date){
		task.duration = Math.round((task.end_date - task.start_date)/(this.config.duration_step * this._get_duration_unit()));
	}
};
gantt._item_level = function(item) {
    var level = 0;
    while (item.parent) {
        if (!dhtmlx.defined(this._pull[item.parent])) break;
        item = this._pull[item.parent];
        level++;
    }
    return level;
};


gantt.sort = function(field, desc, parent) {
    var render = !arguments[3];//4th argument to cancel redraw after sorting

    if (!dhtmlx.defined(parent)) {
        parent = 0;
    }

    if (!dhtmlx.defined(field)) field = "order";
    var criteria = (typeof(field) == "string") ? (function(a, b) {
        var result = a[field] > b[field];
        if (desc) result = !result;
        return result ? 1 : -1;
    }) : field;


    var els = this._branches[parent];
    if (els){
        var temp = [];
        for (var i = els.length - 1; i >= 0; i--)
            temp[i] = this._pull[els[i]];

        temp.sort(criteria);

        for (var i = 0; i < temp.length; i++) {
            els[i] = temp[i].id;
            this.sort(field, desc, els[i], true);
        }
    }

    if (render) {
		this.refreshData();
    }
};

gantt.getNext = function(id) {
    for (var i = 0; i < this._order.length-1; i++) {
        if (this._order[i] == id)
            return this._order[i+1];
    }
    return null;
};
gantt.getPrev = function(id) {
    for (var i = 1; i < this._order.length; i++) {
        if (this._order[i] == id)
            return this._order[i-1];
    }
    return null;
};

gantt._dp_init = function(dp) {
    dp.setTransactionMode("POST", true);
    dp.serverProcessor += (dp.serverProcessor.indexOf("?") != -1 ? "&" : "?") + "editing=true";
    dp._serverProcessor = dp.serverProcessor;

    dp.styles = {
        updated:"gantt_updated",
        inserted:"gantt_inserted",
        deleted:"gantt_deleted",
        invalid:"gantt_invalid",
        error:"gantt_error",
        clear:""
    };

    dp._methods=["_row_style","setCellTextStyle","_change_id","_delete_task"];
    this.attachEvent("onAfterTaskAdd", function(id, item) {
        dp._ganttMode = "tasks";
        dp.setUpdated(id,true,"inserted");
    });
    this.attachEvent("onAfterTaskUpdate", function(id, item) {
        dp._ganttMode = "tasks";
        dp.setUpdated(id,true);
    });
    this.attachEvent("onAfterTaskDelete", function(id, item) {
        dp._ganttMode = "tasks";
        dp.setUpdated(id,true,"deleted");
    });

    this.attachEvent("onAfterLinkUpdate", function(id, item) {
        dp._ganttMode = "links";
        dp.setUpdated(id, true);
    });
    this.attachEvent("onAfterLinkAdd", function(id, item) {
        dp._ganttMode = "links";
        dp.setUpdated(id, true,"inserted");
    });
    this.attachEvent("onAfterLinkDelete", function(id, item) {
        dp._ganttMode = "links";
        dp.setUpdated(id, true,"deleted");
    });
    this.attachEvent("onRowDragEnd", function(id, target) {
        dp._ganttMode = "tasks";
        this.getTask(id).target = target;
        dp.setUpdated(id, true,"order");
    });

    dp.attachEvent("onBeforeDataSending", function() {
        this.serverProcessor = this._serverProcessor + getUrlSymbol(this._serverProcessor) + "gantt_mode=" + this._ganttMode;
        return true;
    });

    dp._getRowData=dhtmlx.bind(function(id, pref) {
        var task;
        if (dp._ganttMode == "tasks")
            task = this.isTaskExists(id) ? this.getTask(id) : { id: id };
        else
            task = this.isLinkExists(id) ? this.getLink(id) : { id: id };

        var data = {};
        for (var key in task) {
            if (key.substr(0, 1) == "$") continue;
            var value = task[key];
            if (value instanceof Date)
                data[key] = this.templates.xml_format(value);
            else
                data[key] = value;
        }
		if(task.$no_start){
			task.start_date = "";
			task.duration = "";
		}
		if(task.$no_end){
			task.end_date = "";
			task.duration = "";
		}
        data[dp.action_param] = this.getUserData(id, dp.action_param);
        return data;
    }, this);

    this._change_id = dhtmlx.bind(function(oldid, newid) {
        if (dp._ganttMode != "tasks")
            this.changeLinkId(oldid, newid);
        else
            this.changeTaskId(oldid, newid);
    }, this);

    this._row_style = function(row_id, classname){
        if (dp._ganttMode != "tasks") return;
        var el = gantt.getTaskRowNode(row_id);
        if (!el) return;
        if (!classname) {
            var regexp = / (gantt_updated|gantt_inserted|gantt_deleted|gantt_invalid|gantt_error)/g;
            el.className = el.className.replace(regexp, "");
        } else
            el.className += " " + classname;
    };

    // fake method for dataprocessor
    this._delete_task = function(row_id, node){};

    this._dp = dp;
};

gantt.getUserData = function(id, name) {
    if (!this.userdata) this.userdata = {};
    if (this.userdata[id] && this.userdata[id][name]) return this.userdata[id][name];
    return "";
};
gantt.setUserData = function(id, name, value) {
    if (!this.userdata) this.userdata = {};
    if (!this.userdata[id]) this.userdata[id] = {};
    this.userdata[id][name] = value;
};


gantt._init_link = function(link) {
    if (!dhtmlx.defined(link.id))
        link.id = dhtmlx.uid();
    return link;
};

gantt._sync_links = function() {
    for (var id in this._pull) {
        this._pull[id].$source = [];
        this._pull[id].$target = [];
    }
    for (var id in this._lpull) {
        var link = this._lpull[id];
        if(this._pull[link.source])
            this._pull[link.source].$source.push(id);
        if(this._pull[link.target])
            this._pull[link.target].$target.push(id);
    }
};

gantt.getLink = function(id) {
    dhtmlx.assert(this._lpull[id], "Link doesn't exist");
    return this._lpull[id];
};

gantt.isLinkExists = function(id) {
    return dhtmlx.defined(this._lpull[id]);
};

gantt.addLink = function(link) {
    link = this._init_link(link);

    if (this.callEvent("onBeforeLinkAdd", [link.id, link])===false) return false;

    this._lpull[link.id] = link;
    this._sync_links();
	this._render_link(link.id);
    this.callEvent("onAfterLinkAdd", [link.id, link]);
    return link.id;
};

gantt.updateLink = function(id, data) {
    if (!dhtmlx.defined(data))
        data = this.getLink(id);

    if (this.callEvent("onBeforeLinkUpdate", [id, data]) === false) return false;

    this._lpull[id] = data;
    this._sync_links();
	this._render_link(id);
    this.callEvent("onAfterLinkUpdate", [id, data]);
    return true;
};

gantt.deleteLink = function(id) {
    return this._deleteLink(id);
};

gantt._deleteLink = function(id, silent) {
    var link = this.getLink(id);
    if (!silent && this.callEvent("onBeforeLinkDelete", [id, link])===false) return false;

    delete this._lpull[id];
    this._sync_links();
    this.refreshLink(id);
    if (!silent) this.callEvent("onAfterLinkDelete", [id, link]);
    return true;
};

gantt.changeLinkId = function(oldid, newid) {
    this._lpull[newid] = this._lpull[oldid];
    this._lpull[newid].id = newid;
    delete this._lpull[oldid];

    this._sync_links();
	this.callEvent("onLinkIdChange", [oldid, newid]);
};


gantt.getChildren = function(id) {
    return dhtmlx.defined(this._branches[id]) ? this._branches[id] : [];
};
gantt.hasChild = function(id) {
    return dhtmlx.defined(this._branches[id]);
};


gantt.refreshData = function(){
	this._sync_order();
	this._render_data();
};


gantt._configure = function(col, data){
	for (var key in data)
		if (typeof col[key] == "undefined")
			col[key] = data[key];
};
gantt._init_skin = function(){
	if (!gantt.skin){
		var links = document.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			var res = links[i].href.match("dhtmlxgantt_([a-z]+).css");
			if (res){
				gantt.skin = res[1];
				break;
			}
		}
	}

	if (!gantt.skin) gantt.skin = "terrace";
	var skinset = gantt.skins[gantt.skin];

	//apply skin related settings
	this._configure(gantt.config, skinset.config);

	var config = gantt.config.columns;
	if (config[1] && typeof config[1].width == "undefined")
		config[1].width = skinset._second_column_width;
	if (config[2] && typeof config[2].width == "undefined")
		config[2].width = skinset._third_column_width;
	
	if (skinset._lightbox_template)
		gantt._lightbox_template = skinset._lightbox_template;
	
	gantt._init_skin = function(){};
};
gantt.skins = {};


gantt._lightbox_methods = {};
gantt._lightbox_template="<div class='dhx_cal_ltitle'><span class='dhx_mark'>&nbsp;</span><span class='dhx_time'></span><span class='dhx_title'></span></div><div class='dhx_cal_larea'></div>";

gantt.showLightbox=function(id){
    if (!id) return;
    if (!this.callEvent("onBeforeLightbox",[id])) return;
    var box = this.getLightbox();

    this._center_lightbox(box);
    this.showCover();
    this._fill_lightbox(id,box);
    this.callEvent("onLightbox",[id]);
};
gantt._get_timepicker_step = function(){
	if(this.config.round_dnd_dates){
		var scale = gantt._tasks,
			step = (this._get_line(scale.unit) * scale.step)/60;//timepicker step is measured in minutes
		if(step >= 60*24){
			step = this.config.time_step;
		}
		return step;
	}
	return this.config.time_step;
};
gantt.getLabel = function(property, key) {
    var sections = this.config.lightbox.sections;
    for (var i=0; i<sections.length; i++) {
        if(sections[i].map_to == property) {
            var options = sections[i].options;
            for (var j=0; j<options.length; j++) {
                if(options[j].key == key) {
                    return options[j].label;
                }
            }
        }
    }
    return "";
};

gantt.getLightbox = function(){
    if (!this._lightbox){
        var d=document.createElement("DIV");
        d.className="dhx_cal_light";

        var full_width = this._is_lightbox_timepicker();
        if (gantt.config.wide_form || full_width)
            d.className+=" dhx_cal_light_wide";

        if (full_width) {
            gantt.config.wide_form = true;
            d.className+=" dhx_cal_light_full";
        }


        d.style.visibility="hidden";
        var html = this._lightbox_template;

        var buttons = this.config.buttons_left;
        for (var i in buttons)
            html+="<div class='dhx_btn_set dhx_left_btn_set "+buttons[i]+"_set'><div dhx_button='1' class='"+buttons[i]+"'></div><div>"+this.locale.labels[buttons[i]]+"</div></div>";

        buttons = this.config.buttons_right;
        for (var i in buttons)
            html+="<div class='dhx_btn_set dhx_right_btn_set "+buttons[i]+"_set' style='float:right;'><div dhx_button='1' class='"+buttons[i]+"'></div><div>"+this.locale.labels[buttons[i]]+"</div></div>";

        html+="</div>";
        d.innerHTML=html;

        if (gantt.config.drag_lightbox){
            d.firstChild.onmousedown = gantt._ready_to_dnd;
            d.firstChild.onselectstart = function(){ return false; };
            d.firstChild.style.cursor = "pointer";
            gantt._init_dnd_events();

        }

        document.body.insertBefore(d,document.body.firstChild);
        this._lightbox=d;

        var sns=this.config.lightbox.sections;
        html = this._render_sections(sns);

        var ds=d.getElementsByTagName("div");
        for (var i=0; i<ds.length; i++) {
            var t_ds = ds[i];
            if (t_ds.className == "dhx_cal_larea") {
                t_ds.innerHTML = html;
                break;
            }
        }

        //sizes
        this.resizeLightbox();

        this._init_lightbox_events(this);
        d.style.display="none";
        d.style.visibility="visible";
    }
    return this._lightbox;
};

gantt._render_sections = function(sns) {
    var html="";
    for (var i=0; i < sns.length; i++) {
        var block=this.form_blocks[sns[i].type];
        if (!block) continue; //ignore incorrect blocks
        sns[i].id="area_"+dhtmlx.uid();
        var button = "";
        if (sns[i].button){
            button = "<div class='dhx_custom_button' index='"+i+"'><div class='dhx_custom_button_"+sns[i].button+"'></div><div>"+this.locale.labels["button_"+sns[i].button]+"</div></div>";
        }
        if (this.config.wide_form){
            html+="<div class='dhx_wrap_section'>";
        }
        html+="<div id='"+sns[i].id+"' class='dhx_cal_lsection'>"+button+this.locale.labels["section_"+sns[i].name]+"</div>"+block.render.call(this,sns[i]);
        html+="</div>";
    }
    return html;
};


gantt.resizeLightbox=function(){
    var d = this._lightbox;
    if (!d) return;

    var con = d.childNodes[1];
    con.style.height="0px";
    con.style.height=con.scrollHeight+"px";
    d.style.height=con.scrollHeight+this.config.lightbox_additional_height+"px";
    con.style.height=con.scrollHeight+"px"; //it is incredible , how ugly IE can be


};

gantt._center_lightbox = function(box) {
    if (box){
        box.style.display="block";

        var scroll_top = window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop;
        var scroll_left = window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft;

        var view_height = window.innerHeight||document.documentElement.clientHeight;

        if(scroll_top) // if vertical scroll on window
            box.style.top=Math.round(scroll_top+Math.max((view_height-box.offsetHeight)/2, 0))+"px";
        else // vertical scroll on body
            box.style.top=Math.round(Math.max(((view_height-box.offsetHeight)/2), 0) + 9)+"px"; // +9 for compatibility with auto tests

        // not quite accurate but used for compatibility reasons
        if(document.documentElement.scrollWidth > document.body.offsetWidth) // if horizontal scroll on the window
            box.style.left=Math.round(scroll_left+(document.body.offsetWidth-box.offsetWidth)/2)+"px";
        else // horizontal scroll on the body
            box.style.left=Math.round((document.body.offsetWidth-box.offsetWidth)/2)+"px";
    }
};
gantt.showCover = function(){
    this._cover=document.createElement("DIV");
    this._cover.className="dhx_cal_cover";
    var _document_height = ((document.height !== undefined) ? document.height : document.body.offsetHeight);
    var _scroll_height = ((document.documentElement) ? document.documentElement.scrollHeight : 0);
    this._cover.style.height = Math.max(_document_height, _scroll_height) + 'px';
    document.body.appendChild(this._cover);
};


gantt._init_lightbox_events = function(){
    gantt.lightbox_events = {};


    gantt.lightbox_events["dhx_save_btn"] = function(e) {
        gantt._save_lightbox();
    };


    gantt.lightbox_events["dhx_delete_btn"] = function(e) {
		if(!gantt.callEvent("onLightboxDelete", [gantt._lightbox_id]))
			return;

        gantt.$click.buttons["delete"](gantt._lightbox_id);
    };


    gantt.lightbox_events["dhx_cancel_btn"] = function(e) {
        gantt._cancel_lightbox();
    };


    gantt.lightbox_events["default"] = function(e, src) {
        if (src.getAttribute("dhx_button")) {
            gantt.callEvent("onLightboxButton", [src.className, src, e]);
        } else {
            var index, block, sec;
            if (src.className.indexOf("dhx_custom_button") != -1) {
                if (src.className.indexOf("dhx_custom_button_") != -1) {
                    index = src.parentNode.getAttribute("index");
                    sec = src.parentNode.parentNode;
                } else {
                    index = src.getAttribute("index");
                    sec = src.parentNode;
                    src = src.firstChild;
                }
            }
            if (index) {
                block = gantt.form_blocks[gantt.config.lightbox.sections[index].type];
                block.button_click(index, src, sec, sec.nextSibling);
            }
        }
    };
    dhtmlxEvent(gantt.getLightbox(), "click", function(e) {
        e = e || window.event;
        var src = e.target ? e.target : e.srcElement;

        if (!src.className)
            src = src.previousSibling;
        if (src && src.className && src.className.indexOf("dhx_btn_set") === 0)
            src = src.firstChild;
        if (src && src.className) {
            var func = dhtmlx.defined(gantt.lightbox_events[src.className]) ? gantt.lightbox_events[src.className] : gantt.lightbox_events["default"];
            return func(e, src);
        }
        return false;
    });

    gantt.getLightbox().onkeydown=function(e){
        switch((e||event).keyCode){
            case gantt.keys.edit_save:
                if ((e||event).shiftKey) return;
                gantt._save_lightbox();
                break;
            case gantt.keys.edit_cancel:
                gantt._cancel_lightbox();
                break;
            default:
                break;
        }
    };
};


gantt._cancel_lightbox=function(){
    this.callEvent("onLightboxCancel",[this._lightbox_id, this.$new]);
    this.hideLightbox();
};

gantt._save_lightbox=function(){
    var task = this.getLightboxValues();
	if(!this.callEvent("onLightboxSave", [this._lightbox_id, task, !!task.$new]))
		return;

    if (task.$new){
        this.addTask(task);
	}else{
		dhtmlx.mixin(this.getTask(task.id), task, true);
        this.updateTask(task.id);
	}
	this.refreshData();

    // TODO: do we need any blockable events here to prevent closing lightbox?
    this.hideLightbox();
};

gantt.getLightboxValues=function(){
    var task = dhtmlx.mixin({}, this.getTask(this._lightbox_id));

    var sns = this.config.lightbox.sections;
    for (var i=0; i < sns.length; i++) {
        var node = document.getElementById(sns[i].id);
        node=(node?node.nextSibling:node);
        var block=this.form_blocks[sns[i].type];
        var res=block.get_value.call(this,node,task, sns[i]);
        if (sns[i].map_to!="auto")
            task[sns[i].map_to]=res;
    }
    return task;
};


gantt.hideLightbox=function(id){
    var box = this.getLightbox();
    if (box) box.style.display="none";
    this._lightbox_id=null;

    this.hideCover();
    this.callEvent("onAfterLightbox",[]);
};
gantt.hideCover=function(){
    if (this._cover)
        this._cover.parentNode.removeChild(this._cover);
    this._cover=null;
};

gantt.resetLightbox = function(){
    if (gantt._lightbox && !gantt._custom_lightbox)
        gantt._lightbox.parentNode.removeChild(gantt._lightbox);
    gantt._lightbox = null;
};

gantt._fill_lightbox = function(id, box) {
    var task = this.getTask(id);
    var s = box.getElementsByTagName("span");
    if (gantt.templates.lightbox_header) {
        s[1].innerHTML = "";
        s[2].innerHTML = gantt.templates.lightbox_header(task.start_date, task.end_date, task);
    } else {
        s[1].innerHTML = this.templates.task_time(task.start_date, task.end_date, task);
        s[2].innerHTML = (this.templates.task_text(task.start_date, task.end_date, task) || "").substr(0, 70); //IE6 fix
    }

    var sns = this.config.lightbox.sections;
    for (var i = 0; i < sns.length; i++) {
        var section = sns[i];
        var node = document.getElementById(section.id).nextSibling;
        var block = this.form_blocks[section.type];
        var value = dhtmlx.defined(task[section.map_to]) ? task[section.map_to] : section.default_value;
        block.set_value.call(this, node, value, task, section);
        if (section.focus)
            block.focus.call(this, node);
    }
    gantt._lightbox_id = id;
};


gantt.getLightboxSection = function(name){
    var config = this.config.lightbox.sections;
    var i =0;
    for (i; i < config.length; i++)
        if (config[i].name == name)
            break;
    var section = config[i];
    if (!this._lightbox)
        this.getLightbox();
    var header = document.getElementById(section.id);
    var node = header.nextSibling;

    var result = {
        section: section,
        header: header,
        node: node,
        getValue:function(ev){
            return this.form_blocks[section.type].get_value(node, (ev||{}), section);
        },
        setValue:function(value, ev){
            return this.form_blocks[section.type].set_value(node, value, (ev||{}), section);
        }
    };

    var handler = this._lightbox_methods["get_"+section.type+"_control"];
    return handler?handler(result):result;
};

gantt._lightbox_methods.get_template_control = function(result) {
    result.control = result.node;
    return result;
};
gantt._lightbox_methods.get_select_control = function(result) {
    result.control = result.node.getElementsByTagName('select')[0];
    return result;
};
gantt._lightbox_methods.get_textarea_control = function(result) {
    result.control = result.node.getElementsByTagName('textarea')[0];
    return result;
};
gantt._lightbox_methods.get_time_control = function(result) {
    result.control = result.node.getElementsByTagName('select'); // array
    return result;
};





gantt._init_dnd_events = function(){
    dhtmlxEvent(document.body, "mousemove", gantt._move_while_dnd);
    dhtmlxEvent(document.body, "mouseup", gantt._finish_dnd);
    gantt._init_dnd_events = function(){};
};
gantt._move_while_dnd = function(e){
    if (gantt._dnd_start_lb){
        if (!document.dhx_unselectable){
            document.body.className += " dhx_unselectable";
            document.dhx_unselectable = true;
        }
        var lb = gantt.getLightbox();
        var now = (e&&e.target)?[e.pageX, e.pageY]:[event.clientX, event.clientY];
        lb.style.top = gantt._lb_start[1]+now[1]-gantt._dnd_start_lb[1]+"px";
        lb.style.left = gantt._lb_start[0]+now[0]-gantt._dnd_start_lb[0]+"px";
    }
};
gantt._ready_to_dnd = function(e){
    var lb = gantt.getLightbox();
    gantt._lb_start = [parseInt(lb.style.left,10), parseInt(lb.style.top,10)];
    gantt._dnd_start_lb = (e&&e.target)?[e.pageX, e.pageY]:[event.clientX, event.clientY];
};
gantt._finish_dnd = function(){
    if (gantt._lb_start){
        gantt._lb_start = gantt._dnd_start_lb = false;
        document.body.className = document.body.className.replace(" dhx_unselectable","");
        document.dhx_unselectable = false;
    }
};




gantt._focus = function(node, select){
    if (node && node.focus){
        if (gantt.config.touch){
            //do not focus editor, to prevent auto-zoom
        } else {
            if (select && node.select) node.select();
            node.focus();
        }
    }
};


gantt.form_blocks={
    getTimePicker: function(sns) {
		var time_format = sns.time_format;
        if (!time_format) {
            // default order
            var time_format = ["%d", "%m", "%Y"];
			if(gantt._get_line(gantt._tasks.unit) < gantt._get_line("day")){
				time_format.push("%H:%i");
			}
        }
        // map: default order => real one
        sns._time_format_order = { size:0 };


        var cfg = this.config;
        var dt = this.date.date_part(new Date(gantt._min_date.valueOf()));
        var last = 24*60, first = 0;
        if(gantt.config.limit_time_select){
            last = 60*cfg.last_hour+1;
            first = 60*cfg.first_hour;
            dt.setHours(cfg.first_hour);
        }
        var html = "";

        for (var p = 0; p < time_format.length; p++) {
            var time_option = time_format[p];

            // adding spaces between selects
            if (p > 0) {
                html += " ";
            }

            switch (time_option) {
                case "%Y":
                    sns._time_format_order[2] = p;
                    sns._time_format_order.size++;
                    //year
                    html+="<select>";
                    var year = dt.getFullYear()-5; //maybe take from config?
                    for (var i=0; i < 10; i++)
                        html+="<option value='"+(year+i)+"'>"+(year+i)+"</option>";
                    html+="</select> ";
                    break;
                case "%m":
                    sns._time_format_order[1] = p;
                    sns._time_format_order.size++;
                    //month
                    html+="<select>";
                    for (var i=0; i < 12; i++)
                        html+="<option value='"+i+"'>"+this.locale.date.month_full[i]+"</option>";
                    html += "</select>";
                    break;
                case "%d":
                    sns._time_format_order[0] = p;
                    sns._time_format_order.size++;
                    //days
                    html+="<select>";
                    for (var i=1; i < 32; i++)
                        html+="<option value='"+i+"'>"+i+"</option>";
                    html += "</select>";
                    break;
                case "%H:%i":
                    var last = 24*60, first = 0;
                    sns._time_format_order[3] = p;
                    sns._time_format_order.size++;
                    //hours
                    html += "<select>";
                    var i = first;
                    var tdate = dt.getDate();
                    sns._time_values = [];

                    while(i<last){
                        var time=this.templates.time_picker(dt);
                        html+="<option value='"+i+"'>"+time+"</option>";
                        sns._time_values.push(i);
                        dt.setTime(dt.valueOf()+this._get_timepicker_step()*60*1000);
                        var diff = (dt.getDate()!=tdate)?1:0; // moved or not to the next day
                        i=diff*24*60+dt.getHours()*60+dt.getMinutes();
                    }
                    html += "</select>";
                    break;
                default:
                    break;
            }
        }
        return html;
    },
    _fill_lightbox_select: function (s,i,d,map,cfg) {
        s[i+map[0]].value=d.getDate();
        s[i+map[1]].value=d.getMonth();
        s[i+map[2]].value=d.getFullYear();
        if (dhtmlx.defined(map[3])) {
            var v = d.getHours()*60+ d.getMinutes();
            v = Math.round(v/gantt._get_timepicker_step())*gantt._get_timepicker_step();
            s[i+map[3]].value= v;
        }
    },
    template:{
        render: function(sns){
            var height=(sns.height||"30")+"px";
            return "<div class='dhx_cal_ltext dhx_cal_template' style='height:"+height+";'></div>";
        },
        set_value:function(node,value,ev,config){
            node.innerHTML = value||"";
        },
        get_value:function(node,ev,config){
            return node.innerHTML||"";
        },
        focus: function(node){
        }
    },
    textarea:{
        render:function(sns){
            var height=(sns.height||"130")+"px";
            return "<div class='dhx_cal_ltext' style='height:"+height+";'><textarea></textarea></div>";
        },
        set_value:function(node,value,ev){
            node.firstChild.value=value||"";
        },
        get_value:function(node,ev){
            return node.firstChild.value;
        },
        focus:function(node){
            var a=node.firstChild; gantt._focus(a, true);
        }
    },
    select:{
        render:function(sns){
            var height=(sns.height||"23")+"px";
            var html="<div class='dhx_cal_ltext' style='height:"+height+";'><select style='width:100%;'>";
            for (var i=0; i < sns.options.length; i++)
                html+="<option value='"+sns.options[i].key+"'>"+sns.options[i].label+"</option>";
            html+="</select></div>";
            return html;
        },
        set_value:function(node,value,ev,sns){
            var select = node.firstChild;
            if (!select._dhx_onchange && sns.onchange) {
                select.onchange = sns.onchange;
                select._dhx_onchange = true;
            }
            if (typeof value == "undefined")
                value = (select.options[0]||{}).value;
            select.value=value||"";
        },
        get_value:function(node,ev){
            return node.firstChild.value;
        },
        focus:function(node){
            var a=node.firstChild; gantt._focus(a, true);
        }
    },
    time:{
        render:function(sns) {
            var time = this.form_blocks.getTimePicker.call(this, sns);
            var html = "<div style='height:30px;padding-top:0px;font-size:inherit;text-align:center;' class='dhx_section_time'>"+time+"<span style='font-weight:normal; font-size:10pt;'> &nbsp;&ndash;&nbsp; </span>"+time+"</div>";
            return html;
        },
        set_value:function(node,value,ev,config){
            var cfg = this.config;
            var s=node.getElementsByTagName("select");

            var map = config._time_format_order;
            var map_size = config._time_format_size;

            if(cfg.auto_end_date && cfg.event_duration) {
                function _update_lightbox_select() {
                    var start_date = new Date(s[map[2]].value,s[map[1]].value,s[map[0]].value,0,0);
                    var end_date = new Date(start_date.getTime() + (gantt.config.event_duration * 60 * 1000));
                    this.form_blocks._fill_lightbox_select(s,map.size, end_date,map,cfg);
                }
                for(var i=0; i<4; i++) {
                    s[i].onchange = _update_lightbox_select;
                }
            }

            this.form_blocks._fill_lightbox_select(s,0,ev.start_date,map,cfg);
            this.form_blocks._fill_lightbox_select(s,map.size,ev.end_date,map,cfg);
        },

        get_value:function(node, ev, config) {
            var s=node.getElementsByTagName("select");
            var map = config._time_format_order;

            var hours = 0, minutes = 0;
            if (dhtmlx.defined(map[3])) {
                var time = parseInt(s[map[3]].value, 10);
                hours = Math.floor(time/60);
                minutes = time%60;
            }
            ev.start_date=new Date(s[map[2]].value,s[map[1]].value,s[map[0]].value,hours,minutes);

            hours = minutes = 0;
            if (dhtmlx.defined(map[3])) {
                var time = parseInt(s[map.size+map[3]].value, 10);
                hours = Math.floor(time/60);
                minutes = time%60;
            }
            ev.end_date=new Date(s[map[2]+map.size].value,s[map[1]+map.size].value,s[map[0]+map.size].value,hours,minutes);

            if (ev.end_date<=ev.start_date)
                ev.end_date=gantt.date.add(ev.start_date, gantt._get_timepicker_step(),"minute");
            return {
                start_date: new Date(ev.start_date),
                end_date: new Date(ev.end_date)
            };
        },
        focus:function(node){
            gantt._focus(node.getElementsByTagName("select")[0]);
        }
    },
    duration:{
        render:function(sns) {
            var time = this.form_blocks.getTimePicker.call(this, sns);
            time = "<div class='dhx_time_selects'>"+time+"</div>";
            var label = this.locale.labels[this._tasks.unit + "s"];
            var duration = "<div class='dhx_gantt_duration'><input type='button' class='dhx_gantt_duration_dec' value='-'><input type='text' value='5' class='dhx_gantt_duration_value'><input type='button' class='dhx_gantt_duration_inc' value='+'> " + label + " <span></span></div>";
            var html = "<div style='height:30px;padding-top:0px;font-size:inherit;' class='dhx_section_time'>"+time+" "+duration+"</div>";
            return html;
        },
        set_value:function(node,value,ev,config){
            var cfg = this.config;
            var s=node.getElementsByTagName("select");
	        var inps = node.getElementsByTagName("input");

            var duration = inps[1];
            var btns=[inps[0],inps[2]];
            var endspan = node.getElementsByTagName("span")[0];

            var map = config._time_format_order;

            function _calc_date() {
                var start_date = gantt.form_blocks.duration._get_start_date.call(gantt, node ,config);
                var duration = gantt.form_blocks.duration._get_duration.call(gantt, node ,config);
                var end_date = gantt.date.add(start_date, duration, gantt._tasks.unit);
                endspan.innerHTML = gantt.templates.task_date(end_date);
            }

            function _change_duration(step) {
                var value = duration.value;
                value = parseInt(value, 10);
                if (window.isNaN(value))
                    value = 0;
                value+=step;
                if (value < 1) value = 1;
                duration.value = value;
                _calc_date();
            }

            btns[0].onclick = dhtmlx.bind(function() { _change_duration(-1*this.config.duration_step); }, this);
            btns[1].onclick = dhtmlx.bind(function() { _change_duration(1*this.config.duration_step); }, this);
            s[0].onchange = _calc_date;
            s[1].onchange = _calc_date;
            s[2].onchange = _calc_date;
            if (s[3]) s[3].onchange = _calc_date;
            duration.onkeydown = dhtmlx.bind(function(e) {
                e = e || window.event;
                // up
                var code = (e.charCode || e.keyCode || e.which);

                if (code == 40) {
                    _change_duration(-1*this.config.duration_step);
                    return false;
                }
                // down
                if (code == 38) {
                    _change_duration(1*this.config.duration_step);
                    return false;
                }
                window.setTimeout(function(e) {
                    _calc_date();
                }, 1);
            }, this);

            duration.onchange = dhtmlx.bind(function(e) { _calc_date(); }, this);

            this.form_blocks._fill_lightbox_select(s,0,ev.start_date,map,cfg);
            
            var final_value;
            var unit = gantt._tasks.unit;
            if (!ev.end_date)
                final_value = ev.duration;
            else
                final_value = (ev.end_date.valueOf() - ev.start_date.valueOf())/(this._get_line(unit)*1000);
            final_value = Math.round(final_value);
            duration.value = final_value;
            _calc_date();
        },

        _get_start_date: function(node, config) {
            var s=node.getElementsByTagName("select");
            var map = config._time_format_order;
            var hours = 0;
            var minutes = 0;
            if (dhtmlx.defined(map[3])) {
                var time = parseInt(s[map[3]].value, 10);
                hours = Math.floor(time/60);
                minutes = time%60;
            }
            return new Date(s[map[2]].value,s[map[1]].value,s[map[0]].value,hours,minutes);
        },
        _get_duration: function(node, config) {
            var duration = node.getElementsByTagName("input")[1];
            duration = parseInt(duration.value, 10);
            if (window.isNaN(duration)) duration = 1;
            if (duration < 0) duration *= -1;
            return duration;
        },

        get_value:function(node, ev, config) {
            ev.start_date = this.form_blocks.duration._get_start_date(node, config);
            var duration = this.form_blocks.duration._get_duration(node, config);

            ev.end_date=this.date.add(ev.start_date, duration, this._tasks.unit);
            ev.duration=duration;

            return {
                start_date: new Date(ev.start_date),
                end_date: new Date(ev.end_date)
            };
        },
        focus:function(node){
            gantt._focus(node.getElementsByTagName("select")[0]);
        }
    }
};

gantt._is_lightbox_timepicker = function() {
    var s = this.config.lightbox.sections;
    for (var i = 0; i < s.length; i++)
        if (s[i].name == "time" && s[i].type == "time")
            return true;
    return false;
};

gantt._dhtmlx_confirm = function(message, title, callback, ok) {
    if (!message)
        return callback();
    var opts = { text: message };
    if (title)
        opts.title = title;
	if(ok){
		opts.ok = ok;
	}
    if (callback) {
        opts.callback = function(result) {
            if (result)
                callback();
        };
    }
    dhtmlx.confirm(opts);
};
/*jsl:ignore*/
/**
	* 	@desc: constructor, data processor object 
	*	@param: serverProcessorURL - url used for update
	*	@type: public
	*/
function dataProcessor(serverProcessorURL){
    this.serverProcessor = serverProcessorURL;
    this.action_param="!nativeeditor_status";
    
	this.object = null;
	this.updatedRows = []; //ids of updated rows
	
	this.autoUpdate = true;
	this.updateMode = "cell";
	this._tMode="GET"; 
	this.post_delim = "_";
	
    this._waitMode=0;
    this._in_progress={};//?
    this._invalid={};
    this.mandatoryFields=[];
    this.messages=[];
    
    this.styles={
    	updated:"font-weight:bold;",
    	inserted:"font-weight:bold;",
    	deleted:"text-decoration : line-through;",
    	invalid:"background-color:FFE0E0;",
    	invalid_cell:"border-bottom:2px solid red;",
    	error:"color:red;",
    	clear:"font-weight:normal;text-decoration:none;"
    };
    
    this.enableUTFencoding(true);
    dhtmlxEventable(this);

    return this;
    }

dataProcessor.prototype={
	/**
	* 	@desc: select GET or POST transaction model
	*	@param: mode - GET/POST
	*	@param: total - true/false - send records row by row or all at once (for grid only)
	*	@type: public
	*/
	setTransactionMode:function(mode,total){
        this._tMode=mode;
		this._tSend=total;
    },
    escape:function(data){
    	if (this._utf)
    		return encodeURIComponent(data);
    	else
        	return escape(data);
	},
    /**
	* 	@desc: allows to set escaping mode
	*	@param: true - utf based escaping, simple - use current page encoding
	*	@type: public
	*/	
	enableUTFencoding:function(mode){
        this._utf=convertStringToBoolean(mode);
    },
    /**
	* 	@desc: allows to define, which column may trigger update
	*	@param: val - array or list of true/false values
	*	@type: public
	*/
	setDataColumns:function(val){
		this._columns=(typeof val == "string")?val.split(","):val;
    },
    /**
	* 	@desc: get state of updating
	*	@returns:   true - all in sync with server, false - some items not updated yet.
	*	@type: public
	*/
	getSyncState:function(){
		return !this.updatedRows.length;
	},
	/**
	* 	@desc: enable/disable named field for data syncing, will use column ids for grid
	*	@param:   mode - true/false
	*	@type: public
	*/
	enableDataNames:function(mode){
		this._endnm=convertStringToBoolean(mode);
	},
	/**
	* 	@desc: enable/disable mode , when only changed fields and row id send to the server side, instead of all fields in default mode
	*	@param:   mode - true/false
	*	@type: public
	*/
	enablePartialDataSend:function(mode){
		this._changed=convertStringToBoolean(mode);
	},
	/**
	* 	@desc: set if rows should be send to server automaticaly
	*	@param: mode - "row" - based on row selection changed, "cell" - based on cell editing finished, "off" - manual data sending
	*	@type: public
	*/
	setUpdateMode:function(mode,dnd){
		this.autoUpdate = (mode=="cell");
		this.updateMode = mode;
		this.dnd=dnd;
	},
	ignore:function(code,master){
		this._silent_mode=true;
		code.call(master||window);
		this._silent_mode=false;
	},
	/**
	* 	@desc: mark row as updated/normal. check mandatory fields,initiate autoupdate (if turned on)
	*	@param: rowId - id of row to set update-status for
	*	@param: state - true for "updated", false for "not updated"
	*	@param: mode - update mode name
	*	@type: public
	*/
	setUpdated:function(rowId,state,mode){
		if (this._silent_mode) return;
		var ind=this.findRow(rowId);
		
		mode=mode||"updated";
		var existing = this.obj.getUserData(rowId,this.action_param);
		if (existing && mode == "updated") mode=existing;
		if (state){
			this.set_invalid(rowId,false); //clear previous error flag
			this.updatedRows[ind]=rowId;
			this.obj.setUserData(rowId,this.action_param,mode);
			if (this._in_progress[rowId]) 
				this._in_progress[rowId]="wait";
		} else{
			if (!this.is_invalid(rowId)){
				this.updatedRows.splice(ind,1);
				this.obj.setUserData(rowId,this.action_param,"");
			}
		}

		//clear changed flag
		if (!state)
			this._clearUpdateFlag(rowId);
     			
		this.markRow(rowId,state,mode);
		if (state && this.autoUpdate) this.sendData(rowId);
	},
	_clearUpdateFlag:function(id){},
	markRow:function(id,state,mode){ 
		var str="";
		var invalid=this.is_invalid(id);
		if (invalid){
        	str=this.styles[invalid];
        	state=true;
    	}
		if (this.callEvent("onRowMark",[id,state,mode,invalid])){
			//default logic
			str=this.styles[state?mode:"clear"]+str;
			
        	this.obj[this._methods[0]](id,str);

			if (invalid && invalid.details){
				str+=this.styles[invalid+"_cell"];
				for (var i=0; i < invalid.details.length; i++)
					if (invalid.details[i])
        				this.obj[this._methods[1]](id,i,str);
			}
		}
	},
	getState:function(id){
		return this.obj.getUserData(id,this.action_param);
	},
	is_invalid:function(id){
		return this._invalid[id];
	},
	set_invalid:function(id,mode,details){ 
		if (details) mode={value:mode, details:details, toString:function(){ return this.value.toString(); }};
		this._invalid[id]=mode;
	},
	/**
	* 	@desc: check mandatory fields and varify values of cells, initiate update (if specified)
	*	@param: rowId - id of row to set update-status for
	*	@type: public
	*/
	checkBeforeUpdate:function(rowId){ 
		return true;
	},
	/**
	* 	@desc: send row(s) values to server
	*	@param: rowId - id of row which data to send. If not specified, then all "updated" rows will be send
	*	@type: public
	*/
	sendData:function(rowId){
		if (this._waitMode && (this.obj.mytype=="tree" || this.obj._h2)) return;
		if (this.obj.editStop) this.obj.editStop();
	
		
		if(typeof rowId == "undefined" || this._tSend) return this.sendAllData();
		if (this._in_progress[rowId]) return false;
		
		this.messages=[];
		if (!this.checkBeforeUpdate(rowId) && this.callEvent("onValidationError",[rowId,this.messages])) return false;
		this._beforeSendData(this._getRowData(rowId),rowId);
    },
    _beforeSendData:function(data,rowId){
    	if (!this.callEvent("onBeforeUpdate",[rowId,this.getState(rowId),data])) return false;	
		this._sendData(data,rowId);
    },
    serialize:function(data, id){
    	if (typeof data == "string")
    		return data;
    	if (typeof id != "undefined")
    		return this.serialize_one(data,"");
    	else{
    		var stack = [];
    		var keys = [];
    		for (var key in data)
    			if (data.hasOwnProperty(key)){
    				stack.push(this.serialize_one(data[key],key+this.post_delim));
    				keys.push(key);
				}
    		stack.push("ids="+this.escape(keys.join(",")));
    		if (dhtmlx.security_key)
				stack.push("dhx_security="+dhtmlx.security_key);
    		return stack.join("&");
    	}
    },
    serialize_one:function(data, pref){
    	if (typeof data == "string")
    		return data;
    	var stack = [];
    	for (var key in data)
    		if (data.hasOwnProperty(key))
    			stack.push(this.escape((pref||"")+key)+"="+this.escape(data[key]));
		return stack.join("&");
    },
    _sendData:function(a1,rowId){
    	if (!a1) return; //nothing to send
		if (!this.callEvent("onBeforeDataSending",rowId?[rowId,this.getState(rowId),a1]:[null, null, a1])) return false;				
		
    	if (rowId)
			this._in_progress[rowId]=(new Date()).valueOf();
		var a2=new dtmlXMLLoaderObject(this.afterUpdate,this,true);
		
		var a3 = this.serverProcessor+(this._user?(getUrlSymbol(this.serverProcessor)+["dhx_user="+this._user,"dhx_version="+this.obj.getUserData(0,"version")].join("&")):"");

		if (this._tMode!="POST")
        	a2.loadXML(a3+((a3.indexOf("?")!=-1)?"&":"?")+this.serialize(a1,rowId));
		else
        	a2.loadXML(a3,true,this.serialize(a1,rowId));

		this._waitMode++;
    },
	sendAllData:function(){
		if (!this.updatedRows.length) return;			

		this.messages=[]; var valid=true;
		for (var i=0; i<this.updatedRows.length; i++)
			valid&=this.checkBeforeUpdate(this.updatedRows[i]);
		if (!valid && !this.callEvent("onValidationError",["",this.messages])) return false;
	
		if (this._tSend) 
			this._sendData(this._getAllData());
		else
			for (var i=0; i<this.updatedRows.length; i++)
				if (!this._in_progress[this.updatedRows[i]]){
					if (this.is_invalid(this.updatedRows[i])) continue;
					this._beforeSendData(this._getRowData(this.updatedRows[i]),this.updatedRows[i]);
					if (this._waitMode && (this.obj.mytype=="tree" || this.obj._h2)) return; //block send all for tree
				}
	},
    
	
	
	
	
	
	
	
	_getAllData:function(rowId){
		var out={};
		var has_one = false;
		for(var i=0;i<this.updatedRows.length;i++){
			var id=this.updatedRows[i];
			if (this._in_progress[id] || this.is_invalid(id)) continue;
			if (!this.callEvent("onBeforeUpdate",[id,this.getState(id)])) continue;	
			out[id]=this._getRowData(id,id+this.post_delim);
			has_one = true;
			this._in_progress[id]=(new Date()).valueOf();
		}
		return has_one?out:null;
	},
	
	
	/**
	* 	@desc: specify column which value should be varified before sending to server
	*	@param: ind - column index (0 based)
	*	@param: verifFunction - function (object) which should verify cell value (if not specified, then value will be compared to empty string). Two arguments will be passed into it: value and column name
	*	@type: public
	*/
	setVerificator:function(ind,verifFunction){
		this.mandatoryFields[ind] = verifFunction||(function(value){return (value!="");});
	},
	/**
	* 	@desc: remove column from list of those which should be verified
	*	@param: ind - column Index (0 based)
	*	@type: public
	*/
	clearVerificator:function(ind){
		this.mandatoryFields[ind] = false;
	},
	
	
	
	
	
	findRow:function(pattern){
		var i=0;
    	for(i=0;i<this.updatedRows.length;i++)
		    if(pattern==this.updatedRows[i]) break;
	    return i;
    },

   
	


    





	/**
	* 	@desc: define custom actions
	*	@param: name - name of action, same as value of action attribute
	*	@param: handler - custom function, which receives a XMl response content for action
	*	@type: private
	*/
	defineAction:function(name,handler){
        if (!this._uActions) this._uActions=[];
            this._uActions[name]=handler;
	},




	/**
*     @desc: used in combination with setOnBeforeUpdateHandler to create custom client-server transport system
*     @param: sid - id of item before update
*     @param: tid - id of item after up0ate
*     @param: action - action name
*     @type: public
*     @topic: 0
*/
	afterUpdateCallback:function(sid, tid, action, btag) {
		var marker = sid;
		var correct=(action!="error" && action!="invalid");
		if (!correct) this.set_invalid(sid,action);
		if ((this._uActions)&&(this._uActions[action])&&(!this._uActions[action](btag))) 
			return (delete this._in_progress[marker]);
			
		if (this._in_progress[marker]!="wait")
	    	this.setUpdated(sid, false);
	    	
	    var soid = sid;
	
	    switch (action) {
	    case "inserted":
	    case "insert":
	        if (tid != sid) {
	            this.obj[this._methods[2]](sid, tid);
	            sid = tid;
	        }
	        break;
	    case "delete":
	    case "deleted":
	    	this.obj.setUserData(sid, this.action_param, "true_deleted");
	        this.obj[this._methods[3]](sid);
	        delete this._in_progress[marker];
	        return this.callEvent("onAfterUpdate", [sid, action, tid, btag]);
	        break;
	    }
	    
	    if (this._in_progress[marker]!="wait"){
	    	if (correct) this.obj.setUserData(sid, this.action_param,'');
	    	delete this._in_progress[marker];
    	} else {
    		delete this._in_progress[marker];
    		this.setUpdated(tid,true,this.obj.getUserData(sid,this.action_param));
		}
	    
	    this.callEvent("onAfterUpdate", [soid, action, tid, btag]);
	},

	/**
	* 	@desc: response from server
	*	@param: xml - XMLLoader object with response XML
	*	@type: private
	*/
	afterUpdate:function(that,b,c,d,xml){
		xml.getXMLTopNode("data"); //fix incorrect content type in IE
		if (!xml.xmlDoc.responseXML) return;
		var atag=xml.doXPath("//data/action");
		for (var i=0; i<atag.length; i++){
        	var btag=atag[i];
			var action = btag.getAttribute("type");
			var sid = btag.getAttribute("sid");
			var tid = btag.getAttribute("tid");
			
			that.afterUpdateCallback(sid,tid,action,btag);
		}
		that.finalizeUpdate();
	},
	finalizeUpdate:function(){
		if (this._waitMode) this._waitMode--;
		
		if ((this.obj.mytype=="tree" || this.obj._h2) && this.updatedRows.length) 
			this.sendData();
		this.callEvent("onAfterUpdateFinish",[]);
		if (!this.updatedRows.length)
			this.callEvent("onFullSync",[]);
	},




	
	/**
	* 	@desc: initializes data-processor
	*	@param: anObj - dhtmlxGrid object to attach this data-processor to
	*	@type: public
	*/
	init:function(anObj){
		this.obj = anObj;
		if (this.obj._dp_init) 
			this.obj._dp_init(this);
	},
	
	
	setOnAfterUpdate:function(ev){
		this.attachEvent("onAfterUpdate",ev);
	},
	enableDebug:function(mode){
	},
	setOnBeforeUpdateHandler:function(func){  
		this.attachEvent("onBeforeDataSending",func);
	},



	/*! starts autoupdate mode
		@param interval
			time interval for sending update requests
	*/
	setAutoUpdate: function(interval, user) {
		interval = interval || 2000;
		
		this._user = user || (new Date()).valueOf();
		this._need_update = false;
		this._loader = null;
		this._update_busy = false;
		
		this.attachEvent("onAfterUpdate",function(sid,action,tid,xml_node){
			this.afterAutoUpdate(sid, action, tid, xml_node);
		});
		this.attachEvent("onFullSync",function(){
			this.fullSync();
		});
		
		var self = this;
		window.setInterval(function(){
			self.loadUpdate();
		}, interval);
	},


	/*! process updating request answer
		if status == collision version is depricated
		set flag for autoupdating immidiatly
	*/
	afterAutoUpdate: function(sid, action, tid, xml_node) {
		if (action == 'collision') {
			this._need_update = true;
			return false;
		} else {
			return true;
		}
	},


	/*! callback function for onFillSync event
		call update function if it's need
	*/
	fullSync: function() {
		if (this._need_update == true) {
			this._need_update = false;
			this.loadUpdate();
		}
		return true;
	},


	/*! sends query to the server and call callback function
	*/
	getUpdates: function(url,callback){
		if (this._update_busy) 
			return false;
		else
			this._update_busy = true;
		
		this._loader = this._loader || new dtmlXMLLoaderObject(true);
		
		this._loader.async=true;
		this._loader.waitCall=callback;
		this._loader.loadXML(url);
	},


	/*! returns xml node value
		@param node
			xml node
	*/
	_v: function(node) {
		if (node.firstChild) return node.firstChild.nodeValue;
		return "";
	},


	/*! returns values array of xml nodes array
		@param arr
			array of xml nodes
	*/
	_a: function(arr) {
		var res = [];
		for (var i=0; i < arr.length; i++) {
			res[i]=this._v(arr[i]);
		};
		return res;
	},


	/*! loads updates and processes them
	*/
	loadUpdate: function(){
		var self = this;
		var version = this.obj.getUserData(0,"version");
		var url = this.serverProcessor+getUrlSymbol(this.serverProcessor)+["dhx_user="+this._user,"dhx_version="+version].join("&");
		url = url.replace("editing=true&","");
		this.getUpdates(url, function(){
			var vers = self._loader.doXPath("//userdata");
			self.obj.setUserData(0,"version",self._v(vers[0]));
			
			var upds = self._loader.doXPath("//update");
			if (upds.length){
				self._silent_mode = true;
				
				for (var i=0; i<upds.length; i++) {
					var status = upds[i].getAttribute('status');
					var id = upds[i].getAttribute('id');
					var parent = upds[i].getAttribute('parent');
					switch (status) {
						case 'inserted':
							self.callEvent("insertCallback",[upds[i], id, parent]);
							break;
						case 'updated':
							self.callEvent("updateCallback",[upds[i], id, parent]);
							break;
						case 'deleted':
							self.callEvent("deleteCallback",[upds[i], id, parent]);
							break;
					}
				}
				
				self._silent_mode = false;
			}
			
			self._update_busy = false;
			self = null;
		});
	}

};
/*jsl:end*/



/*
 	asserts will be removed in final code, so you can place them anythere
	without caring about performance impacts
*/
dhtmlx.assert = function(check, message){
	if (!check){
		dhtmlx.message({ type:"error", text:message, expire:-1 });
		debugger;
	}
};

//initial initialization
gantt.init = function(node, from, to){
	if(from && to){
		this.config.start_date = this._min_date = new Date(from);
		this.config.end_date = this._max_date = new Date(to);
	}
	this._init_skin();
	
    if (!this.config.scroll_size)
        this.config.scroll_size = this._detectScrollSize();


    this._reinit(node);

    this.attachEvent("onLoadEnd", this.render);
    dhtmlxEvent(window, "resize", this._on_resize);


	//can be called only once
	this.init = function(node){ 
        if (this.$container)
            this.$container.innerHTML = "";
        this._reinit(node); 
    };
	this.callEvent("onGanttReady", []);

};

gantt._reinit = function(node){
    this._init_html_area(node);
    this._set_sizes();

    this._task_area_pulls = {};
    this._task_area_renderers = {};

    this._init_touch_events();
    this._init_templates();
    this._init_grid();
    this._init_tasks();

    this.render();

    dhtmlxEvent(this.$container, "click", this._on_click);
    dhtmlxEvent(this.$container, "dblclick", this._on_dblclick);
    dhtmlxEvent(this.$container, "mousemove", this._on_mousemove);
    dhtmlxEvent(this.$container, "contextmenu", this._on_contextmenu);
}

//renders initial html markup
gantt._init_html_area = function(node){
	if (typeof node == "string")
		this._obj = document.getElementById(node);
	else 
		this._obj = node;
	dhtmlx.assert(this._obj, "Invalid html container: "+node);

    var html = "<div class='gantt_container'><div class='gantt_grid'></div><div class='gantt_task'></div>";
    html += "<div class='gantt_ver_scroll'><div></div></div><div class='gantt_hor_scroll'><div></div></div></div>";
	this._obj.innerHTML = html;
	//store linsk for further reference
    this.$container = this._obj.firstChild;
    var childs = this.$container.childNodes;
	this.$grid = childs[0];
	this.$task = childs[1];
    this.$scroll_ver = childs[2];
    this.$scroll_hor = childs[3];

    this.$grid.innerHTML = "<div class='gantt_grid_scale'></div><div class='gantt_grid_data'></div>";
    this.$grid_scale = this.$grid.childNodes[0];
    this.$grid_data = this.$grid.childNodes[1];

	this.$task.innerHTML = "<div class='gantt_task_scale'></div><div class='gantt_data_area'><div class='gantt_task_bg'></div><div class='gantt_links_area'></div><div class='gantt_bars_area'></div></div>";
	this.$task_scale = this.$task.childNodes[0];

	this.$task_data = this.$task.childNodes[1];

	this.$task_bg = this.$task_data.childNodes[0];
	this.$task_links = this.$task_data.childNodes[1];
	this.$task_bars = this.$task_data.childNodes[2];
};

gantt.$click={
    buttons:{
        "edit":function(id){
            gantt.showLightbox(id);
        },
        "delete":function(id){
            var question = gantt.locale.labels.confirm_deleting;
            var title = gantt.locale.labels.confirm_deleting_title;

            gantt._dhtmlx_confirm(question, title, function(){
                gantt.deleteTask(id);
                gantt.hideLightbox();
            });
        }
    }
};

//set sizes to top level html element
gantt._set_sizes = function(){
	this._x = this._obj.clientWidth;
	this._y = this._obj.clientHeight;

	//same height
	this.$grid.style.height = this.$task.style.height = (this._y - this.$scroll_hor.offsetHeight - 2)+"px";
    this.$grid_data.style.height = this.$task_data.style.height = (this._y - (this.config.scale_height||0) - this.$scroll_hor.offsetHeight - 2) + "px";

	//share width
	this.$grid.style.width = (this.config.grid_width-1)+"px";
    this.$grid_data.style.width = (this.config.grid_width-1)+"px";
	this.$task.style.width = (this._x - this.config.grid_width - 2)+"px";
};

gantt.getScrollState=function(){
    return { x:this.$task.scrollLeft, y:this.$task_data.scrollTop };
};
gantt.scrollTo = function(left, top){
    if (left !== null)
        this.$task.scrollLeft = left;
    if(top !== null)
        this.$task_data.scrollTop = top;
};

//called after window resize
gantt._on_resize = gantt.setSizes = function(){
    gantt._set_sizes();
    gantt._render_scroll();
};

//renders self
gantt.render = function(){
	this._render_grid();	//grid.js
	this._render_tasks_scales()	//tasks.js
    this._render_scroll();
    this._on_resize();
	this._render_data();
    if(this.config.initial_scroll){
		var id = (this._order[0] || 0);
		if(id)
			this.showTask(id);
	}
};


gantt._render_scroll = function() {
    this._scroll_resize();
    var self = this;
    dhtmlxEvent(this.$scroll_hor, "scroll", function() {
        if (gantt._touch_scroll_active) return;
        var left = self.$scroll_hor.scrollLeft;
		self._scroll_task_area(left);
    });
    dhtmlxEvent(this.$scroll_ver, "scroll", function() {
        if (gantt._touch_scroll_active) return;
        var top = self.$scroll_ver.scrollTop;
        self.$grid_data.scrollTop = top;
		self._scroll_task_area(null, top);
    });
    dhtmlxEvent(this.$task, "scroll", function() {
        var left = self.$task.scrollLeft;
        self.$scroll_hor.scrollLeft = left;
    });
    dhtmlxEvent(this.$task_data, "scroll", function() {
        var top = self.$task_data.scrollTop;
        self.$scroll_ver.scrollTop = self.$grid_data.scrollTop = top;
    });

    dhtmlxEvent(this.$container, "mousewheel", function(e){
        if (e.wheelDeltaX){
            var dir  = e.wheelDeltaX/-40;
            var left = self.$task.scrollLeft+dir*30;
            self._scroll_task_area(left, null);
            self.$scroll_hor.scrollTop = top;
        } else {
            var dir  = e.wheelDelta/-40;
            if (typeof e.wheelDelta == "undefined")
                dir = e.detail;

            var top = self.$grid_data.scrollTop+dir*30;
    		self._scroll_task_area(null, top);
            self.$scroll_ver.scrollTop = top;
        }

        if (e.preventDefault)
            e.preventDefault();
        e.cancelBubble=true;
        return false;
    });

    this._render_scroll = this._scroll_resize;
};



gantt._scroll_resize = function() {
    var grid_width = this.config.grid_width;

    var task_width = this._x - grid_width;
    var task_height = this._y - this.config.scale_height;

    var task_data_width = this.$task_data.offsetWidth - this.config.scroll_size;
    var task_data_height = this.config.row_height*this._order.length;

    var scroll_hor = (task_data_width > task_width);
    var scroll_ver = (task_data_height > task_height);

    this.$scroll_hor.style.display = scroll_hor ? "block" : "none";
    this.$scroll_hor.style.height = (scroll_hor ? this.config.scroll_size : 0) + "px";
    this.$scroll_hor.style.width = (this._x - (scroll_ver ? this.config.scroll_size : 2)) + "px";
    this.$scroll_hor.firstChild.style.width = (task_data_width + grid_width + this.config.scroll_size + 2) + "px";

    this.$scroll_ver.style.display = scroll_ver ? "block" : "none";
    this.$scroll_ver.style.width = (scroll_ver ? this.config.scroll_size : 0) + "px";
    this.$scroll_ver.style.height = (this._y - (scroll_hor ? this.config.scroll_size : 0) - this.config.scale_height) + "px";
    this.$scroll_ver.style.top = this.config.scale_height + "px";
    this.$scroll_ver.firstChild.style.height = (this.config.scale_height + task_data_height) + "px";
};

gantt.locate = function(e) {
    var trg = gantt._get_target_node(e);

    //ignore empty cells
    if (trg.className == "gantt_task_cell") return null;

    var attribute = arguments[1] || this.config.task_attribute;

    while (trg){
        if (trg.getAttribute){	//text nodes has not getAttribute
            var test = trg.getAttribute(attribute);
            if (test) return test;
        }
        trg=trg.parentNode;
    }
    return null;
};
gantt._get_target_node = function(e){
	var trg;
	if (e.tagName)
		trg = e;
	else {
		e=e||window.event;
		trg=e.target||e.srcElement;
	}
	return trg;
};
gantt._trim = function(str){
	var func = String.prototype.trim || function(){ return this.replace(/^\s+|\s+$/g, ""); };
	return func.apply(str);
};

gantt._locate_css = function(e, classname, strict){
	if(strict === undefined)
		strict = true;

	var trg = gantt._get_target_node(e);
	var css = '';
	var test = false;
	while (trg){
		css = trg.className;

		if(css){
			var ind = css.indexOf(classname);
			if (ind >= 0){
				if (!strict)
					return trg;

				//check that we have exact match
				var left = (ind === 0) || (!gantt._trim(css.charAt(ind - 1)));
				var right = ((ind + classname.length >= css.length)) || (!gantt._trim(css.charAt(ind + classname.length)));

				if (left && right)
					return trg;
			}
		}
		
		trg=trg.parentNode;
	}
	return null;
};
gantt._locateHTML = function(e, attribute) {
	var trg = gantt._get_target_node(e);
    attribute = attribute || this.config.task_attribute;

    while (trg){
        if (trg.getAttribute){	//text nodes has not getAttribute
            var test = trg.getAttribute(attribute);
            if (test) return trg;
        }
        trg=trg.parentNode;
    }
    return null;
};

gantt.getTaskRowNode = function(id) {
    var els = this.$grid_data.childNodes;
    var attribute = this.config.task_attribute;
    for (var i = 0; i < els.length; i++) {
        if (els[i].getAttribute) {
            var value = els[i].getAttribute(attribute);
            if (value == id) return els[i];
        }
    }
    return null;
};

gantt.getState = function(){
	return {
		drag_id : this._tasks_dnd.drag.id,
		drag_mode : this._tasks_dnd.drag.mode,
		selected_task : this._selected_task,
		min_date : this._min_date,
		max_date : this._max_date,
		lightbox : this._lightbox_id
	};

};


gantt._checkTimeout = function(host, updPerSecond){
	if(!updPerSecond)
		return true;
	var timeout = 1000/updPerSecond;
	if(timeout < 1) return true;

	if(host._on_timeout)
		return false;

	setTimeout(function(){
		delete host._on_timeout;
	}, timeout);

	return host._on_timeout = true;
};

gantt.selectTask = function(id){
	if(!this.config.select_task)
		return;
	if (id){

		if(this._selected_task == id)
			return this._selected_task;

		if(!this.callEvent("onBeforeTaskSelected", [id])){
			return false;
		}

		this.unselectTask();
		this._selected_task = id;

		this.refreshTask(id);
		this.callEvent("onTaskSelected", [id]);
	}
	return this._selected_task;
};
gantt.unselectTask = function(){
	var id = this._selected_task;
	if(!id)
		return;
	this._selected_task = null;
	this.refreshTask(id);
	this.callEvent("onTaskUnselected", [id]);
};
gantt.getSelectedId = function() {
    return dhtmlx.defined(this._selected_task) ? this._selected_task : null;
};



gantt.date={
	init:function(){
		var s = gantt.locale.date.month_short;
		var t = gantt.locale.date.month_short_hash = {};
		for (var i = 0; i < s.length; i++)
			t[s[i]]=i;

		var s = gantt.locale.date.month_full;
		var t = gantt.locale.date.month_full_hash = {};
		for (var i = 0; i < s.length; i++)
			t[s[i]]=i;
	},
	date_part:function(date){
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		if (date.getHours())
			date.setTime(date.getTime() + 60 * 60 * 1000 * (24 - date.getHours()));
		return date;
	},
	time_part:function(date){
		return (date.valueOf()/1000 - date.getTimezoneOffset()*60)%86400;
	},
	week_start:function(date){
		var shift=date.getDay();
		if (gantt.config.start_on_monday){
			if (shift===0) shift=6;
			else shift--;
		}
		return this.date_part(this.add(date,-1*shift,"day"));
	},
	month_start:function(date){
		date.setDate(1);
		return this.date_part(date);
	},
	year_start:function(date){
		date.setMonth(0);
		return this.month_start(date);
	},
	day_start:function(date){
		return this.date_part(date);
	},
	hour_start:function(date){
		var hour = date.getHours();
		this.day_start(date);
		date.setHours(hour);
		return date;
	},
	minute_start:function(date){
		var min = date.getMinutes();
		this.hour_start(date);
		date.setMinutes(min);
		return date;
	},
	add:function(date,inc,mode){
		/*jsl:ignore*/
		var ndate=new Date(date.valueOf());
		switch(mode){
			case "week":
				inc *= 7;
			case "day":
				ndate.setDate(ndate.getDate() + inc);
				if (!date.getHours() && ndate.getHours()) //shift to yesterday
					ndate.setTime(ndate.getTime() + 60 * 60 * 1000 * (24 - ndate.getHours()));
				break;
			case "month": ndate.setMonth(ndate.getMonth()+inc); break;
			case "year": ndate.setYear(ndate.getFullYear()+inc); break;
			case "hour": ndate.setHours(ndate.getHours()+inc); break;
			case "minute": ndate.setMinutes(ndate.getMinutes()+inc); break;
			default:
				return gantt.date["add_"+mode](date,inc,mode);
		}
		return ndate;
		/*jsl:end*/
	},
	to_fixed:function(num){
		if (num<10)	return "0"+num;
		return num;
	},
	copy:function(date){
		return new Date(date.valueOf());
	},
	date_to_str:function(format,utc){
		format=format.replace(/%[a-zA-Z]/g,function(a){
			switch(a){
				case "%d": return "\"+gantt.date.to_fixed(date.getDate())+\"";
				case "%m": return "\"+gantt.date.to_fixed((date.getMonth()+1))+\"";
				case "%j": return "\"+date.getDate()+\"";
				case "%n": return "\"+(date.getMonth()+1)+\"";
				case "%y": return "\"+gantt.date.to_fixed(date.getFullYear()%100)+\""; 
				case "%Y": return "\"+date.getFullYear()+\"";
				case "%D": return "\"+gantt.locale.date.day_short[date.getDay()]+\"";
				case "%l": return "\"+gantt.locale.date.day_full[date.getDay()]+\"";
				case "%M": return "\"+gantt.locale.date.month_short[date.getMonth()]+\"";
				case "%F": return "\"+gantt.locale.date.month_full[date.getMonth()]+\"";
				case "%h": return "\"+gantt.date.to_fixed((date.getHours()+11)%12+1)+\"";
				case "%g": return "\"+((date.getHours()+11)%12+1)+\"";
				case "%G": return "\"+date.getHours()+\"";
				case "%H": return "\"+gantt.date.to_fixed(date.getHours())+\"";
				case "%i": return "\"+gantt.date.to_fixed(date.getMinutes())+\"";
				case "%a": return "\"+(date.getHours()>11?\"pm\":\"am\")+\"";
				case "%A": return "\"+(date.getHours()>11?\"PM\":\"AM\")+\"";
				case "%s": return "\"+gantt.date.to_fixed(date.getSeconds())+\"";
				case "%W": return "\"+gantt.date.to_fixed(gantt.date.getISOWeek(date))+\"";
				default: return a;
			}
		});
		if (utc) format=format.replace(/date\.get/g,"date.getUTC");
		return new Function("date","return \""+format+"\";");
	},
	str_to_date:function(format,utc){
		var splt="var temp=date.match(/[a-zA-Z]+|[0-9]+/g);";
		var mask=format.match(/%[a-zA-Z]/g);
		for (var i=0; i<mask.length; i++){
			switch(mask[i]){
				case "%j":
				case "%d": splt+="set[2]=temp["+i+"]||1;";
					break;
				case "%n":
				case "%m": splt+="set[1]=(temp["+i+"]||1)-1;";
					break;
				case "%y": splt+="set[0]=temp["+i+"]*1+(temp["+i+"]>50?1900:2000);";
					break;
				case "%g":
				case "%G":
				case "%h": 
				case "%H":
							splt+="set[3]=temp["+i+"]||0;";
					break;
				case "%i":
							splt+="set[4]=temp["+i+"]||0;";
					break;
				case "%Y": splt+="set[0]=temp["+i+"]||0;";
					break;
				case "%a":					
				case "%A": splt+="set[3]=set[3]%12+((temp["+i+"]||'').toLowerCase()=='am'?0:12);";
					break;					
				case "%s": splt+="set[5]=temp["+i+"]||0;";
					break;
				case "%M": splt+="set[1]=gantt.locale.date.month_short_hash[temp["+i+"]]||0;";
					break;
				case "%F": splt+="set[1]=gantt.locale.date.month_full_hash[temp["+i+"]]||0;";
					break;
				default:
					break;
			}
		}
		var code ="set[0],set[1],set[2],set[3],set[4],set[5]";
		if (utc) code =" Date.UTC("+code+")";
		return new Function("date","var set=[0,0,1,0,0,0]; "+splt+" return new Date("+code+");");
	},
	getISOWeek: function(ndate) {
		if(!ndate) return false;
		var nday = ndate.getDay();
		if (nday === 0) {
			nday = 7;
		}
		var first_thursday = new Date(ndate.valueOf());
		first_thursday.setDate(ndate.getDate() + (4 - nday));
		var year_number = first_thursday.getFullYear(); // year of the first Thursday
		var ordinal_date = Math.round( (first_thursday.getTime() - new Date(year_number, 0, 1).getTime()) / 86400000); //ordinal date of the first Thursday - 1 (so not really ordinal date)
		var week_number = 1 + Math.floor( ordinal_date / 7);
		return week_number;
	},
	getUTCISOWeek: function(ndate){
		return this.getISOWeek(ndate);
	},
	convert_to_utc: function(date) {
		return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	},
    parseDate: function(date, format) {
        if (typeof(date) == "string") {
            if (dhtmlx.defined(format)){
                if (typeof(format) == "string")
                    format = dhtmlx.defined(gantt.templates[format]) ? gantt.templates[format] : gantt.date.str_to_date(format);
                else
                    format = gantt.templates.xml_date;
            }
            date = format(date);
        }
        return date;
    }
};
/*
 %d - the day as a number with a leading zero ( 01 to 31 );
 %j - the day as a number without a leading zero ( 1 to 31 );
 %D - the day as an abbreviation ( Sun to Sat );
 %l - the day as a full name ( Sunday to Saturday );
 %W - the ISO-8601 week number of the year. Weeks start on Monday; 1)
 %m - the month as a number without a leading zero ( 1 to 12 );
 %n - the month as a number with a leading zero ( 01 to 12);
 %M - the month as an abbreviation ( Jan to Dec );
 %F - the month as a full name ( January to December );
 %y - the year as a two-digit number ( 00 to 99 );
 %Y - the year as a four-digit number ( 1900–9999 );
 %h - the hour based on the 12-hour clock ( 00 to 11 );
 %H - the hour based on the 24-hour clock ( 00 to 23 );
 %i - the minute as a number with a leading zero ( 00 to 59 );
 %s - the second as a number without a leading zero ( 00 to 59 ); 2)
 %a - displays am (for times from midnight until noon) and pm (for times from noon until midnight);
 %A - displays AM (for times from midnight until noon) and PM (for times from noon until midnight).

 */

if(!gantt.config) gantt.config = {};
if(!gantt.config) gantt.config = {};
if(!gantt.templates) gantt.templates = {};

(function(){

dhtmlx.mixin(gantt.config,
	{links : {
		"finish_to_start":"0",
		"start_to_start":"1",
		"finish_to_finish":"2"
	},
	duration_unit : "day",
	min_duration : 60*60*1000,
	xml_date : "%d-%m-%Y %H:%i",
	api_date : "%d-%m-%Y %H:%i",
	start_on_monday: true,
	server_utc : false,
	show_progress:true,
	fit_tasks : false,
	select_task:true,

	readonly:false,

	/*grid */
	date_grid: "%Y-%m-%d",

	drag_links : true,
	drag_progress:true,
	drag_resize:true,
	drag_move:true,
	drag_mode:{
		"resize":"resize",
		"progress":"progress",
		"move":"move",
		"ignore":"ignore"
	},
	round_dnd_dates:true,
	link_wrapper_width:20,


    autofit: true, // grid column automatic fit
	columns: [
		{name:"text", tree:true, width:'*' },
		{name:"start_date", align: "center" },
		{name:"duration", align: "center" },
		{name:"add", width:'44' }
	],

	/*scale*/
	step: 1,
	scale_unit: "day",
	subscales : [

	],
    time_step: 60,
    duration_step: 1,
	date_scale: "%d %M",
    task_date: "%d %F %Y",
    time_picker: "%H:%i",
    task_attribute: "task_id",
    link_attribute: "link_id",
    buttons_left: [
        "dhx_save_btn",
        "dhx_cancel_btn"
    ],
    buttons_right: [
        "dhx_delete_btn"
    ],
    lightbox: {
        sections: [
            {name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
            {name: "time", height: 72, type: "duration", map_to: "auto"}
        ]
    },
    drag_lightbox: true,
    sort: false,
    details_on_create: true,
	details_on_dblclick:true,
	initial_scroll : true,
	task_scroll_offset : 100,

	task_height: "full",//number px of 'full' for row height
	min_column_width:70
});
gantt.keys={
    edit_save:13,
    edit_cancel:27
};

gantt._init_template = function(name){
	if(!this.config[name].$used){
		this.templates[name] = this.date.date_to_str(this.config[name]);
		this.config[name].$used = true;
	}
};
gantt._init_templates = function(){
	var labels = gantt.locale.labels;
	labels.dhx_save_btn 	= labels.icon_save;
	labels.dhx_cancel_btn 	= labels.icon_cancel;
	labels.dhx_delete_btn 	= labels.icon_delete;



	//build configuration based templates
	var d = this.date.date_to_str;
	var c = this.config;
	gantt._init_template("date_scale");
	gantt._init_template("date_grid");
	gantt._init_template("task_date");

	dhtmlx.mixin(this.templates,{
		xml_date:this.date.str_to_date(c.xml_date,c.server_utc),
		xml_format:d(c.xml_date,c.server_utc),
		api_date:this.date.str_to_date(c.api_date),
		progress_text:function(start, end, task){return "";},
		grid_header_class : function(column, config){
			return "";
		},

		task_text:function(start, end, task){
			return task.text;
		},
		task_class:function(start, end, task){return "";},
		grid_row_class:function(start, end, task){
			return "";
		},
		task_row_class:function(start, end, task){
			return "";
		},
		task_cell_class:function(item, date){return "";},
		scale_cell_class:function(date){return "";},

        task_class:function(start, end, task){
            return "";
        },
        grid_indent:function(item) {
            return "<div class='gantt_tree_indent'></div>";
        },
        grid_folder:function(item) {
            return "<div class='gantt_tree_icon gantt_folder_" + (item.$open ? "open" : "closed") + "'></div>";
        },
        grid_file:function(item) {
            return "<div class='gantt_tree_icon gantt_file'></div>";
        },
        grid_open:function(item) {
            return "<div class='gantt_tree_icon gantt_" + (item.$open ? "close" : "open") + "'></div>";
        },
        grid_blank:function(item) {
            return "<div class='gantt_tree_icon gantt_blank'></div>";
        },


        task_time:function(start,end,ev){
            return gantt.templates.task_date(start)+" - "+gantt.templates.task_date(end);
        },
        time_picker:d(c.time_picker),
		link_class : function(link){
			return "";
		},
		link_description : function(link){
			var from = gantt.getTask(link.source),
				to = gantt.getTask(link.target);

			return "<b>" + from.text + "</b> &ndash;  <b>" + to.text+"</b>";;
		},

		drag_link : function(from, from_start, to, to_start) {
			from = gantt.getTask(from);
			var labels = gantt.locale.labels;

			var text = "<b>" + from.text + "</b> " + (from_start ? labels.link_start : labels.link_end)+"<br/>";
			if(to){
				to = gantt.getTask(to);
				text += "<b> " + to.text + "</b> "+ (to_start ? labels.link_start : labels.link_end)+"<br/>";
			}
			return text;
		},
		drag_link_class: function(from, from_start, to, to_start) {
			var add = "";

			if(from && to){
				var allowed = gantt.isLinkAllowed(from, to, from_start, to_start);
				add = " " + (allowed ? "gantt_link_allow" : "gantt_link_deny");
			}

			return "gantt_link_tooltip" + add;
		}
    });

	this.callEvent("onTemplatesReady",[]);
};

})();
if (window.jQuery){

(function( $ ){

	var methods = [];
	$.fn.dhx_gantt = function(config){
		if (typeof(config) === 'string') {
			if (methods[config] ) {
				return methods[config].apply(this, []);
			}else {
				$.error('Method ' +  config + ' does not exist on jQuery.dhx_gantt');
			}
		} else {
			var views = [];
			this.each(function() {
				if (this && this.getAttribute){
					if (!this.getAttribute("dhxgantt")){
						for (var key in config)
							if (key!="data")
								gantt.config[key] = config[key];

						gantt.init(this);
						if (config.data)
							gantt.parse(config.data);

						views.push(gantt);
					}
				}
			});

		
			if (views.length === 1) return views[0];
			return views;
		}
	};
	

	

})(jQuery);

}
gantt.locale = {
	date:{
		month_full:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		month_short:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		day_full:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		day_short:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	},
	labels:{
		new_task:"New task",
		icon_save:"Save",
		icon_cancel:"Cancel",
		icon_details:"Details",
		icon_edit:"Edit",
		icon_delete:"Delete",
		confirm_closing:"",//Your changes will be lost, are your sure ?
		confirm_deleting:"Task will be deleted permanently, are you sure?",
        section_description:"Description",
        section_time:"Time period",

        /* grid columns */

        column_text : "Task name",
        column_start_date : "Start time",
        column_duration : "Duration",
        column_add : "",

		/* link confirmation */
		link: "Link",
		confirm_link_deleting:"will be deleted",
		link_start: " (start)",
		link_end: " (end)",


        minutes: "Minutes",
        hours: "Hours",
        days: "Days",
        weeks: "Week",
        months: "Months",
        years: "Years"
	}
};




gantt.skins.skyblue = {
	config:{
		grid_width:350,
		row_height: 27,
		scale_height: 27,
		task_height: 24,
		link_line_width:1,
		link_arrow_size:8,
		lightbox_additional_height:75
	},
	_second_column_width:95,
	_third_column_width:80
};
gantt.skins.meadow = {
	config:{
		grid_width:350,
		row_height: 27,
		scale_height: 30,
		task_height:24,
		link_line_width:2,
		link_arrow_size:6,
		lightbox_additional_height:72
	},
	_second_column_width:95,
	_third_column_width:80
};

gantt.skins.terrace = {
	config:{
		grid_width:360,
		row_height: 35,
		scale_height: 35,
		task_height: 24,
		link_line_width:2,
		link_arrow_size:6,
		lightbox_additional_height:75
	},
	_second_column_width:90,
	_third_column_width:70		
};
gantt.skins.broadway = {
	config:{
		grid_width:360,
		row_height: 35,
		scale_height: 35,
		task_height: 24,
		link_line_width:1,
		link_arrow_size:7,
		lightbox_additional_height:86
	},
	_second_column_width:90,
	_third_column_width:80,

	_lightbox_template:"<div class='dhx_cal_ltitle'><span class='dhx_mark'>&nbsp;</span><span class='dhx_time'></span><span class='dhx_title'></span><div class='dhx_cancel_btn'></div></div><div class='dhx_cal_larea'></div>",
	_config_buttons_left: {},
	_config_buttons_right: {
		"dhx_delete_btn": "icon_delete",
		"dhx_save_btn": "icon_save"
	}
};


gantt.config.touch_drag = 50; //nearly immediate dnd
gantt.config.touch = true;

gantt._init_touch_events = function(){
	if (this.config.touch != "force")
		this.config.touch = this.config.touch 
			&& (   (navigator.userAgent.indexOf("Mobile")!=-1)
				|| (navigator.userAgent.indexOf("iPad")!=-1)
				|| (navigator.userAgent.indexOf("Android")!=-1)
				|| (navigator.userAgent.indexOf("Touch")!=-1));

	if (this.config.touch){
		if (window.navigator.msPointerEnabled){
			this._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function(ev){
				if (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE ) return null;
				return ev;
			}, function(ev){
				return (!ev || ev.pointerType == ev.MSPOINTER_TYPE_MOUSE);
			});
		} else
			this._touch_events(["touchmove", "touchstart", "touchend"], function(ev){
				if (ev.touches && ev.touches.length > 1) return null;
				if (ev.touches[0])
					return { target:ev.target, pageX:ev.touches[0].pageX, pageY:ev.touches[0].pageY };
				else 
					return ev;
			}, function(){ return false; });
	}
};


//we can't use native scrolling, as we need to sync momentum between different parts
//so we will block native scroll and use the custom one
//in future we can add custom momentum
gantt._touch_events = function(names, accessor, ignore){
	//webkit on android need to be handled separately
	var dblclicktime = 0;
	var action_mode = false;
	var scroll_mode = false;
	var dblclick_timer = 0;
	var action_start = null;
	var scroll_state;

	//touch move
	if (!this._gantt_touch_event_ready){
		this._gantt_touch_event_ready = 1;
		dhtmlxEvent(document.body, names[0], function(e){
			if (ignore(e)) return;

			//ignore common and scrolling moves
			if (!action_mode) return;

			var source = accessor(e);
			if (source && action_start){
				var dx = action_start.pageX - source.pageX;
				var dy = action_start.pageY - source.pageY;
				if (!scroll_mode && (Math.abs(dx) > 5 || Math.abs(dy) > 5)){
					gantt._touch_scroll_active = scroll_mode = true;
					dblclicktime = 0;
					scroll_state = gantt.getScrollState();
				}

				if (scroll_mode){
					gantt.scrollTo(scroll_state.x + dx, scroll_state.y + dy);
				}
			}
			return block_action(e);
		});
	}


	//common helper, prevents event
	function block_action(e){
		if (e && e.preventDefault)
			e.preventDefault();
		(e||event).cancelBubble = true;
		return false;
	}

	//block touch context menu in IE10
	dhtmlxEvent(this.$container, "contextmenu", function(e){
		if (action_mode)
			return block_action(e);
	});

	//touch start
	dhtmlxEvent(this.$container, names[1], function(e){
		if (ignore(e)) return;
		if (e.touches && e.touches.length > 1){
			action_mode = false;
			return;
		}

		action_mode = true;
		action_start = accessor(e);



		//dbl-tap handling
		if (action_start && dblclicktime){
			var now = new Date();
			if ((now - dblclicktime) < 500 ){
				gantt._on_dblclick(action_start);
				block_action(e);
			} else
				dblclicktime = now;
		} else {
			dblclicktime = new Date();
		}
	});
	
	//touch end
	dhtmlxEvent(this.$container, names[2], function(e){
		if (ignore(e)) return;
		gantt._touch_scroll_active = action_mode = scroll_mode = false;
	});	
};