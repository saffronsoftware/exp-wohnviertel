export function bindContext(ctx, fn) {
  return function() {
    fn.apply(ctx, [].concat([this]).concat([].slice.call(arguments)))
  }
}
