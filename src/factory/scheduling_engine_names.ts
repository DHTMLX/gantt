// The MIT and GPL builds have the factory that registers names too, so this
// module imports only the public engine type: no scheduling code may reach them.
import type { SchedulingEngine } from "../types/gantt_types";

/** Creates a new engine for one chart. */
export type SchedulingEngineFactory = () => SchedulingEngine;

const factories = new Map<string, SchedulingEngineFactory>();

/**
 * Make an engine selectable in `config.auto_scheduling.engine`. Registration is
 * global; registering a name again replaces the factory for charts that create
 * their engine later.
 */
export function registerSchedulingEngine(name: string, createEngine: SchedulingEngineFactory): void {
	if (typeof name !== "string" || !name.trim()) {
		throw new Error("A scheduling engine needs a name");
	}
	if (name === "v2") {
		throw new Error("\"v2\" is the built-in scheduling engine and cannot be registered");
	}
	if (typeof createEngine !== "function") {
		throw new Error(`Scheduling engine "${name}" needs a function that creates the engine`);
	}
	factories.set(name, createEngine);
}

export function getSchedulingEngineFactory(name: string): SchedulingEngineFactory | undefined {
	return factories.get(name);
}
