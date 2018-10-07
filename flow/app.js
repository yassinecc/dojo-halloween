declare type ViewLayoutEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
};

declare type EmitterSubscription<T: string> = {
  emitter: EventEmitter<T>,
  listener: Function,
  context: ?Object,
  remove(): void,
};

declare type EventEmitter<T: string> = {
  emit(eventType: T, ...args: any[]): void,
  addListener(eventType: T, listener: Function, context: ?Object): EmitterSubscription<T>,
  once(eventType: T, listener: Function, context: ?Object): EmitterSubscription<T>,
  removeAllListeners(): void,
  removeCurrentListener(): void,
  removeSubscription(subscription: EmitterSubscription<T>): void,
  listeners(eventType: T): [EmitterSubscription<T>],
  removeListener(eventType: T, listener: Function): void,
};

declare type Point<T> = {
  x: T,
  y: T,
  type?: string,
};
