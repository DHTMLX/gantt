function withSampleToolbar(layout) {
	if (layout.rows?.[0]?.view === "toolbar") {
		return layout;
	}

	const { css, ...chartLayout } = layout;
	return {
		css: css || "gantt_container",
		rows: [
			// Leave room for a horizontal scrollbar when the controls overflow.
			{ view: "toolbar", id: "toolbar", height: 51 },
			chartLayout
		]
	};
}
