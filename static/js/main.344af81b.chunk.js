(this["webpackJsonpteconnect-pay-poc"]=this["webpackJsonpteconnect-pay-poc"]||[]).push([[0],{14:function(e,t,n){"use strict";n.r(t);var c=n(1),o=n.n(c),a=n(4),s=n.n(a),r=n(2),u=n(5),i=n(6),l=n(0),j={currencyCode:"USD",countryCode:"US",supportedNetworks:["visa","masterCard","amex","discover","jcb"],merchantCapabilities:["supports3DS"],total:{label:"Test Transaction",amount:"1.00",type:"final"}},b=function(){var e=Object(c.useState)((function(){return!1})),t=Object(i.a)(e,2),n=t[0],o=t[1],a=Object(r.useTecPaymentsRequest)();return Object(c.useEffect)((function(){if(a){var e=a(j);console.log("real interface",e),e.canMakePayments().then((function(t){console.log("canMakePayments Result: ",t),t.applePay&&o(e)}))}console.log("useTecPaymentsRequest hook:",a)}),[a]),Object(l.jsxs)("div",{style:{height:"100%"},children:[Object(l.jsx)("h1",{children:"TEC Demo"}),n&&Object(l.jsx)(r.TecPaymentRequestButtons,{paymentRequestInterface:n})]})},p=Object(u.createTEConnect)("Y2xpZW50VG9rZW5Qb2NDb2RlL2NsaWVudFRva2VuUG9jVXNlcjpQYXNzd29yZDEh",{enableTecPR:!0}),d=function(){return Object(l.jsx)(r.TEConnect,{teConnect:p,children:Object(l.jsx)(b,{})})},h=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,15)).then((function(t){var n=t.getCLS,c=t.getFID,o=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),c(e),o(e),a(e),s(e)}))};s.a.render(Object(l.jsx)(o.a.StrictMode,{children:Object(l.jsx)(d,{})}),document.getElementById("root")),h()}},[[14,1,2]]]);
//# sourceMappingURL=main.344af81b.chunk.js.map