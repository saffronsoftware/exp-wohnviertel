export function bindContext(ctx, fn) {
  /*
  For a context `ctx` and a function `fn`, returns a function `fn0`, that:
  - When called with [a, b, ...], will call `fn` with [this, a, b, ...]
  - Will have `ctx` as the context (`this`)

  Basically, you can do this:

  Dom(el).bind('click', bindContext(this, this.doSomething()))

  Which will call this.doSomething() with the proper context (`this`), while
  the context coming from the handler will be used as the first argument.
  This means that you can use `this` normally, while the stuff you need e.g.
  from the event handler will be passed as the first argument, with the rest
  of the arguments following.
  */
  return function() {
    fn.apply(ctx, [].concat([this]).concat([].slice.call(arguments)))
  }
}
