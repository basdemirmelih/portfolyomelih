// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom'da olmayan tarayıcı API'leri. Testte "hareketi azalt" açık kabul edilir:
// yükleme perdesi ve akıcı kaydırma devre dışı kalır, içerik doğrudan görünür.
window.matchMedia = () => ({
    matches: true,
    media: '',
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
});
window.IntersectionObserver = class { observe() {} disconnect() {} };
HTMLCanvasElement.prototype.getContext = () => null;
window.scrollTo = () => {};
