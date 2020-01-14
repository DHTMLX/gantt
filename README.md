# dhtmlxGantt #

[![dhtmlx.com](https://img.shields.io/badge/made%20by-DHTMLX-blue)](https://dhtmlx.com/)
[![npm: v.6.3.4](https://img.shields.io/badge/npm-v.6.3.4-blue.svg)](https://www.npmjs.com/package/dhtmlx-gantt)
[![License: GPL v2](https://img.shields.io/badge/license-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

[Getting started](#getting-started) | [Features](#features) | [Support](#support) | [License](#license) | [Useful links](#links)

[dhtmlxGantt](https://dhtmlx.com/docs/products/dhtmlxGantt) is an open source JavaScript Gantt chart that helps you illustrate a project schedule in a nice-looking chart.

It can show the dependencies between tasks as lines and allows you to set up different relationships between tasks (finish-to-start, start-to-start, finish-to-finish, start-to-finish).

dhtmlxGantt provides a flexible API and a large number of event handlers, which gives you the freedom to customize it for your needs.

![gantt-demo](https://dhtmlx.com/blog/wp-content/uploads/2019/11/MS-Project.gif)

[Check more samples >](https://docs.dhtmlx.com/gantt/samples/?_ga=2.207689174.557456657.1578902403-1229728879.1572866128)

<a name="getting-started"></a>
## Getting started ##

Add files:

~~~html
<script src="dhtmlxgantt.js" ></script>
<link rel="stylesheet" href="dhtmlxgantt.css" type="text/css">
~~~

Add markup:

~~~html
<div id="gantt_here" style='width:100%; height:100vh;'></div>
~~~

And initialize:

~~~js
gantt.config.date_format = "%Y-%m-%d %H:%i";
gantt.init("gantt_here");
gantt.parse({
  data: [
    {id: 1, text: "Project #1", start_date: null, duration: null, parent:0, progress: 0, open: true},
    {id: 2, text: "Task #1", start_date: "2019-08-01 00:00", duration:5, parent:1, progress: 1},
    {id: 3, text: "Task #2", start_date: "2019-08-06 00:00", duration:2, parent:1, progress: 0.5},
    {id: 4, text: "Task #3", start_date: null, duration: null, parent:1, progress: 0.8, open: true},
    {id: 5, text: "Task #3.1", start_date: "2019-08-09 00:00", duration:2, parent:4, progress: 0.2},
    {id: 6, text: "Task #3.2", start_date: "2019-08-11 00:00", duration:1, parent:4, progress: 0}
  ],
  links:[
    {id:1, source:2, target:3, type:"0"},
    {id:2, source:3, target:4, type:"0"},
    {id:3, source:5, target:6, type:"0"}
  ]
});
~~~

==> [Check the live demo](https://snippet.dhtmlx.com/a69d7378a)

### Complete guides ###

- [Angular](https://dhtmlx.com/blog/dhtmlx-gantt-chart-usage-angularjs-2-framework/)
- [React](https://dhtmlx.com/blog/create-react-gantt-chart-component-dhtmlxgantt/)
- [Node](https://docs.dhtmlx.com/gantt/desktop__howtostart_nodejs.html)
- ASP.NET
  - [ASP.NET MVC 5](https://docs.dhtmlx.com/gantt/desktop__howtostart_dotnet.html)
  - [ASP.NET Core](https://docs.dhtmlx.com/gantt/desktop__howtostart_dotnet_core.html)
- PHP
  - [Laravel](https://docs.dhtmlx.com/gantt/desktop__howtostart_php_laravel.html)
  - [Slim framework](https://docs.dhtmlx.com/gantt/desktop__howtostart_php_laravel.html)
- [Ruby on Rails](https://docs.dhtmlx.com/gantt/desktop__howtostart_ruby.html)

#### All tutorials ####

[https://docs.dhtmlx.com/gantt/desktop__howtostart_guides.html](https://docs.dhtmlx.com/gantt/desktop__howtostart_guides.html)

#### Video guides ####

[https://www.youtube.com/user/dhtmlx/videos](https://www.youtube.com/user/dhtmlx/videos)

<a name="features"></a>
## Features ##


<a name="support"></a>
## Support ##

Star our GitHub repo

Check our [roadmap](https://trello.com/b/fhOySHPj/gantt-roadmap) for future updates

Read us on [Medium](https://medium.com/@dhtmlx)

Follow us on [Twitter](https://twitter.com/dhtmlx)

Like our page on [Facebook](https://www.facebook.com/dhtmlx/)

<a name="license"></a>
## License ##

dhtmlxGantt v.6.3.4 Standard

This version of dhtmlxGantt is distributed under GPL 2.0 license and can be legally used in GPL projects.

To use dhtmlxGantt in non-GPL projects (and get Pro version of the product), please obtain Commercial/Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing or contact us at sales@dhtmlx.com

(c) XB Software Ltd.

<a name="links"></a>
## Useful links

- [Online  documentation](https://docs.dhtmlx.com/gantt/)
- [Support forum](https://forum.dhtmlx.com/c/gantt)
