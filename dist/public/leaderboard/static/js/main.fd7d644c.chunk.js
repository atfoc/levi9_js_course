(this.webpackJsonphighscores=this.webpackJsonphighscores||[]).push([[0],{10:function(e,t,n){},14:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(2),l=n.n(c);n(10);function o(e){for(var t=e.data[0].length,n=[],r=0;r<t;++r)n.push([]);var c=e.data.reduce((function(e,n){if(n.length!==t)throw new Error("All rows must have same number of columns");return n.forEach((function(t,n){e[n].push(a.a.createElement("div",{className:"table-row"},t))})),e}),n).map((function(e){return a.a.createElement("div",{className:"table-col"},e)}));return a.a.createElement("div",{style:{justifyContent:"center",display:"flex",flexDirection:"row"}},c)}var u=n(4),i=n(5);n(11);function s(e){var t=Object(r.useState)(null),n=Object(i.a)(t,2),c=n[0],l=n[1],s=null!==e.url&&void 0!==e.url?e.url:"http://localhost:3000/highScores";return Object(r.useEffect)((function(){fetch(s).then((function(e){return e.json()})).then((function(e){var t=e.map((function(e){return[e.nickname,e.score]}));l([["Nickname","Score"]].concat(Object(u.a)(t)))}))}),[s]),null===c?a.a.createElement("h1",null,"Loading..."):a.a.createElement(o,{data:c})}var f=function(){return a.a.createElement("div",{style:{width:"100vw",display:"flex",justifyContent:"center",flexDirection:"row"}},a.a.createElement("div",{style:{width:"50vw"}},a.a.createElement(s,null)))};l.a.render(a.a.createElement(f,null),document.getElementById("root"))},6:function(e,t,n){e.exports=n(14)}},[[6,1,2]]]);
//# sourceMappingURL=main.fd7d644c.chunk.js.map