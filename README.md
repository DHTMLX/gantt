# dhtmlxGantt #

[![dhtmlx.com](https://img.shields.io/badge/made%20by-DHTMLX-blue)](https://dhtmlx.com/)
[![npm: v.7.1.9](https://img.shields.io/badge/npm-v.7.1.9-blue.svg)](https://www.npmjs.com/package/dhtmlx-gantt)
[![License: GPL v2](https://img.shields.io/badge/license-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

[Getting started](#getting-started) | [Features](#features) | [Follow us](#followus) | [License](#license) | [Useful links](#links)

[dhtmlxGantt](https://dhtmlx.com/docs/products/dhtmlxGantt) is an open source JavaScript Gantt chart that helps you illustrate a project schedule in a nice-looking chart.

It can show the dependencies between tasks as lines and allows you to set up different relationships between tasks (finish-to-start, start-to-start, finish-to-finish, start-to-finish).

dhtmlxGantt provides a flexible API and a large number of event handlers, which gives you the freedom to customize it for your needs.

![gantt-demo](https://dhtmlx.com/blog/wp-content/uploads/2019/11/MS-Project.gif)

[Check more samples >](https://docs.dhtmlx.com/gantt/samples/)

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

- [Vue.js](https://dhtmlx.com/blog/use-dhtmlxgantt-vue-js-framework-demo/)
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

| Functionality | GNU GPL v2 | Commercial	| Enterprise	| Ultimate |
|---	|---	|---	|---	|---	|
| [Standard features](https://docs.dhtmlx.com/gantt/desktop__editions_comparison.html)  	|  :heavy_check_mark:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Auto scheduling  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Baselines, deadlines and other custom elements  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Critical path calculation 	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Custom content in the overlay  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Custom tasks types 	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Decimal units for tasks durations  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Dynamic loading  |  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Expanding/collapsing split tasks  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Free local module for MS Project export/import 	|  :x: 	|   :x:	|  :x: 	|   :heavy_check_mark:	|
| Free local PDF/PNG export module 	|  :x: 	|  :x: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| MS Project link formatting  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Multiple resources per task  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Online export to PDF/PNG without watermark 	|  :x:	|  1 year 	|  1 year 	|   Perpetual	|
| Project-level work calendars  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Project and milestones task types  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Resizing grid columns and the grid itself from the UI	|  :x: |  :heavy_check_mark: |  :heavy_check_mark: 	|  :heavy_check_mark:	|
| Resource histogram 	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Resource management 	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| S-curve to show the progress of a project  |  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Setting task types automatically |  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Several Gantt charts on 1 page | :x: | :x: |  :heavy_check_mark: | :heavy_check_mark: 	|
| Simple API for hiding/showing columns of the grid  |  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Splitting tasks into subtasks 	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Tasks grouping  	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Time constraints for tasks  |  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|
| Working calendar for the whole project	|  :x:	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|  :heavy_check_mark: 	|


<a name="followus"></a>
## Follow us ##

Star our GitHub repo :star:

Check our [roadmap](https://trello.com/b/fhOySHPj/gantt-roadmap) for future updates :wrench:

Read us on [Medium](https://medium.com/@dhtmlx) :newspaper:

Follow us on [Twitter](https://twitter.com/dhtmlx) :bird:

Like our page on [Facebook](https://www.facebook.com/dhtmlx/) :thumbsup:

<a name="license"></a>
## License ##

dhtmlxGantt v.7.1.9 Standard

This version of dhtmlxGantt is distributed under GPL 2.0 license and can be legally used in GPL projects.

To use dhtmlxGantt in non-GPL projects (and get Pro version of the product), please obtain Commercial/Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing or contact us at sales@dhtmlx.com

(c) XB Software Ltd.


<a name="links"></a>
## Useful links

- [Online  documentation](https://docs.dhtmlx.com/gantt/)
- [Support forum](https://forum.dhtmlx.com/c/gantt)
