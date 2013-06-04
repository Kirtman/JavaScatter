// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

// jQuery Mousewheel intent - http://jscrollpane.kelvinluck.com/script/mwheelIntent.js
// Increases the usability of the mousewheel in nested scroll areas. Cf. http://jscrollpane.kelvinluck.com/mwheel_intent.html
// Compressed with http://jscompress.com/
(function(e){function a(){if(this===t.elem){t.pos=[-260,-260];t.elem=false;n=3}}var t={pos:[-260,-260]},n=3,r=document,i=r.documentElement,s=r.body,o,u;e.event.special.mwheelIntent={setup:function(){var t=e(this).bind("mousewheel",e.event.special.mwheelIntent.handler);if(this!==r&&this!==i&&this!==s){t.bind("mouseleave",a)}t=null;return true},teardown:function(){e(this).unbind("mousewheel",e.event.special.mwheelIntent.handler).unbind("mouseleave",a);return true},handler:function(r,i){var s=[r.clientX,r.clientY];if(this===t.elem||Math.abs(t.pos[0]-s[0])>n||Math.abs(t.pos[1]-s[1])>n){t.elem=this;t.pos=s;n=250;clearTimeout(u);u=setTimeout(function(){n=10},200);clearTimeout(o);o=setTimeout(function(){n=3},1500);r=e.extend({},r,{type:"mwheelIntent"});return e.event.handle.apply(this,arguments)}}};e.fn.extend({mwheelIntent:function(e){return e?this.bind("mwheelIntent",e):this.trigger("mwheelIntent")},unmwheelIntent:function(e){return this.unbind("mwheelIntent",e)}});e(function(){s=r.body;e(r).bind("mwheelIntent.mwheelIntentDefault",e.noop)})})(jQuery)