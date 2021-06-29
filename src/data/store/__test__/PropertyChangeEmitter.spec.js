/* eslint-env jest */
import PropertyChangeEmitter from '../PropertyChangeEmitter';

describe('PropertyChangeEmitter Tests', () => {
	describe('listeners', () => {
		test('calls all listeners', () => {
			const emitter = new PropertyChangeEmitter();

			const prop = 'test';
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			emitter.subscribeToProperties(prop, listener1);
			emitter.subscribeToProperties(prop, listener2);

			emitter.onChange(prop);

			expect(listener1).toHaveBeenCalledTimes(1);
			expect(listener2).toHaveBeenCalledTimes(1);
		});

		test('calls all listeners for all changed props', () => {
			const emitter = new PropertyChangeEmitter();

			const prop1 = 'test';
			const prop2 = 'test2';
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			emitter.subscribeToProperties(prop1, listener1);
			emitter.subscribeToProperties(prop2, listener2);

			emitter.onChange(prop1, prop2);

			expect(listener1).toHaveBeenCalledTimes(1);
			expect(listener2).toHaveBeenCalledTimes(1);
		});

		test('calls listener for all subscribed keys', () => {
			const emitter = new PropertyChangeEmitter();

			const prop1 = 'test';
			const prop2 = 'test2';
			const listener = jest.fn();

			emitter.subscribeToProperties([prop1, prop2], listener);

			emitter.onChange(prop1);

			expect(listener).toHaveBeenCalledTimes(1);

			emitter.onChange(prop2);

			expect(listener).toHaveBeenCalledTimes(2);
		});

		test('calls listener when added for different keys', () => {
			const emitter = new PropertyChangeEmitter();

			const prop1 = 'test';
			const prop2 = 'test2';
			const listener = jest.fn();

			emitter.subscribeToProperties(prop1, listener);
			emitter.subscribeToProperties(prop2, listener);

			emitter.onChange(prop1);

			expect(listener).toHaveBeenCalledTimes(1);

			emitter.onChange(prop2);

			expect(listener).toHaveBeenCalledTimes(2);
		});

		test('does not double call listeners', () => {
			const emitter = new PropertyChangeEmitter();

			const prop1 = 'test';
			const prop2 = 'test2';
			const listener = jest.fn();

			emitter.subscribeToProperties([prop1, prop2], listener);
			emitter.subscribeToProperties(prop1, listener);
			emitter.subscribeToProperties(prop2, listener);

			emitter.onChange([prop1, prop2]);

			expect(listener).toHaveBeenCalledTimes(1);
		});

		test('does not call listeners after unsubscribing', () => {
			const emitter = new PropertyChangeEmitter();

			const prop = 'test';
			const listener = jest.fn();

			const unsubscribe = emitter.subscribeToProperties(prop, listener);

			emitter.onChange(prop);
			expect(listener).toHaveBeenCalledTimes(1);

			unsubscribe();

			emitter.onChange(prop);
			expect(listener).toHaveBeenCalledTimes(1);
		});
	});

	describe('change events', () => {
		test('calls for all props in array first arg', () => {
			const emitter = new PropertyChangeEmitter();

			const props = ['test', 'test2'];
			const listener = jest.fn();

			emitter.subscribeToProperties(props, listener);

			emitter.onChange(props);

			expect(listener).toHaveBeenCalled();
		});

		test('calls for all props in var arg', () => {
			const emitter = new PropertyChangeEmitter();

			const props = ['test', 'test2'];
			const listener = jest.fn();

			emitter.subscribeToProperties(props, listener);

			emitter.onChange(...props);

			expect(listener).toHaveBeenCalled();
		});

		test('calls dependent props', () => {
			class WithDependents extends PropertyChangeEmitter {
				static DependentProperties = {
					dependent: ['source1', 'source2'],
				};
			}

			const emitter = new WithDependents();

			const listener1 = jest.fn();
			const listener2 = jest.fn();

			emitter.addDependentProperty('dependent2', ['source3', 'source4']);

			emitter.subscribeToProperties('dependent', listener1);
			emitter.subscribeToProperties('dependent2', listener2);

			emitter.onChange('source1', 'source3');

			expect(listener1).toHaveBeenCalledTimes(1);
			expect(listener2).toHaveBeenCalledTimes(1);

			emitter.onChange('source2', 'source4');

			expect(listener1).toHaveBeenCalledTimes(2);
			expect(listener2).toHaveBeenCalledTimes(2);
		});
	});
});
