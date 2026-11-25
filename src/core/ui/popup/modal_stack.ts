/**
 * Per-gantt-instance LIFO stack of open modal popups.
 * ESC and focus logic only ever applies to the topmost modal,
 * so two stacked modals (or two gantt instances) don't fight each other.
 */
export interface IModalStack {
	push(item: object): void;
	remove(item: object): void;
	isTop(item: object): boolean;
	size(): number;
}

export function createModalStack(): IModalStack {
	const stack: object[] = [];
	return {
		push(item: object): void {
			if (stack.indexOf(item) === -1) {
				stack.push(item);
			}
		},
		remove(item: object): void {
			const index = stack.indexOf(item);
			if (index !== -1) {
				stack.splice(index, 1);
			}
		},
		isTop(item: object): boolean {
			return stack.length > 0 && stack[stack.length - 1] === item;
		},
		size(): number {
			return stack.length;
		}
	};
}
