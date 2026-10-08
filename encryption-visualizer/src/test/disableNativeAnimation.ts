import { beforeAll, afterAll } from 'vitest';
// Happy DOM rejects canceled native animation promises during real Motion transitions.
// Use Motion's JavaScript fallback here; actual browser motion is covered by e2e.
const nativeAnimation = Object.getOwnPropertyDescriptor(Element.prototype, 'animate');
beforeAll(() => Object.defineProperty(Element.prototype, 'animate', { configurable: true, value: undefined }));
afterAll(() => {
  if (nativeAnimation) Object.defineProperty(Element.prototype, 'animate', nativeAnimation);
});
