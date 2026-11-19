# AGENTS.md

Guidance for AI coding agents working with DHTMLX Gantt in this project.

## What this is

DHTMLX Gantt, MIT edition (`dhtmlx-gantt` v10+) — an open source JavaScript Gantt chart library. Many Gantt examples online describe the PRO edition, so some APIs you know may be missing here (see Edition limits).

- Install, import and the first chart: [README.md](README.md), "Quick start".
- Changing the library source code: see `CONTRIBUTING.md` in the [GitHub repository](https://github.com/DHTMLX/gantt).

## Before you write code

Use these instead of working from memory:

- **DHTMLX MCP server** (`https://docs.dhtmlx.com/mcp`): current API and docs. Use it to confirm config, method and event names and signatures.
  - Claude Code: `claude mcp add --transport http dhtmlx-mcp https://docs.dhtmlx.com/mcp`
  - Codex: `codex mcp add dhtmlx-mcp --url https://docs.dhtmlx.com/mcp`
  - Other clients: add the same URL as an HTTP MCP server.
- **Agent skill** `dhtmlx-js-gantt`: integration patterns and known pitfalls. Install: `npx skills add DHTMLX/skills --skill dhtmlx-js-gantt` ([source](https://github.com/DHTMLX/skills/tree/main/dhtmlx-js-gantt)).

If they are not installed, suggest that the user installs them. Without MCP, use the [docs](https://docs.dhtmlx.com/gantt/).

## Edition limits

Some features are kept out of this community build; the PRO edition has them. The list is in [README.md](README.md), "Community vs PRO".

- These APIs do not throw. They are missing or silent no-ops, so a chart that loads fine can still lack the feature. Enabling a plugin that is not in this build does nothing.
- `codebase/dhtmlxgantt.d.ts` describes the full product. Types and autocomplete do not prove a feature exists here.
- MCP and the docs cover PRO too. Check every feature you use against the list above.
- If a requested feature is not in this edition, tell the user before writing code: name the feature and say it is a PRO feature ([comparison](https://docs.dhtmlx.com/gantt/guides/editions-comparison/), [30-day trial](https://dhtmlx.com/docs/products/dhtmlxGantt/download.shtml)). Then still write the requested code. Do not silently replace or drop it.
- Check the edition at runtime with `gantt.license` (`"mit"` here).
- `ReactGantt`, `VueGantt` and `AngularGantt` are PRO components. For React, Angular and Vue, use the [integration guides](https://docs.dhtmlx.com/gantt/integrations/react/js-gantt-react/) with the core library.

## Rules that prevent common bugs

- Give the Gantt container an explicit height, and import `dhtmlx-gantt/codebase/dhtmlxgantt.css`.
- Set config and call `gantt.plugins({...})` before `gantt.init()`.
- Pass dates as `Date` objects or strings that match `gantt.config.date_format`. A mismatch shifts dates by years.
- Template return values are inserted as raw HTML. Escape user-supplied text before it reaches a template.
- For several charts, or a chart inside a component lifecycle, use `Gantt.getGanttInstance()` and call `destructor()` on that instance. Never call `destructor()` on the default `gantt` export, and never use `gantt.detachAllEvents()`.
- `gantt.init()` fires `onGanttReady` every time. Attach handlers and create the DataProcessor once, not inside a repeated `onGanttReady`.
- Apply changes that come from outside (a socket, another user) inside `gantt.silent(...)`, so the DataProcessor does not send them back.
- Use documented API only. Verify unfamiliar names and signatures with MCP.

## Links

- [Documentation](https://docs.dhtmlx.com/gantt/) and [API reference](https://docs.dhtmlx.com/gantt/api/)
- [Samples](https://docs.dhtmlx.com/gantt/samples/) (also in `samples/` of the repository)
- [Community forum](https://forum.dhtmlx.com/c/gantt)
