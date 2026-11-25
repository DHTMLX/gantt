import extensions from "./ext/extensions";
import GanttFactory from "./factory/gantt_factory";
import factoryMethod from "./factory/make_instance_web";
import scope from "./utils/global";

// Use the factory so several independent gantt instances can coexist on a
// page (Gantt.getGanttInstance()); mirrors the enterprise/web entry. The
// default singleton is published as `gantt`.
const Gantt = new GanttFactory(factoryMethod, extensions);
const gantt = Gantt.getGanttInstance();

(scope as any).gantt = gantt;
(scope as any).Gantt = Gantt;

export default gantt;
export { gantt, Gantt };

export {
	escapeHTML,
	allowRawHTML,
	basicSanitizeHTML,
	applyTemplatePolicy
} from "./utils/template_security";
export type { HtmlTemplatePolicy } from "./utils/template_security";

// top-level Toolbar alias (design T2)
import { Toolbar } from "./core/ui/controls/toolbar_alias";
(scope as any).Toolbar = Toolbar;
export { Toolbar };
