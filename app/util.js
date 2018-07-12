import * as d3 from 'd3'

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


export function sampleEvenly(data, count) {
  /*
  From ICGenealogy:
  Evenly sample `count` elements from the `data`. The first element is chosen
  first, then the last element, then the middle portion is considered,
  splitting it recursively into half and choosing the middle element when
  the length is odd until the requested number of elements is chosen.
  */
  function sample(data, count) {
    /*
    Repeatedly split a list, choosing the middle element if the length is
    odd. Return the chosen element (if any), surrounded on the left and
    right by the elements chosen by the respective recursive calls. Return
    an empty list if there are no more elements to pick.
    */
    if (count <= 0) {
      return []
    }
    let chosen = []
    let rightHalfOffset = 0

    // If the list's length is odd, choose the middle element before
    // splitting the list in two.
    let iMid = Math.floor(data.length / 2)
    if (data.length % 2 != 0) {
      rightHalfOffset = 1
      chosen.push(data[iMid])
      count--
    }

    // Split the list into two parts, skipping the middle element if the
    // list's length is odd.
    let leftHalf = data.slice(0, iMid)
    let rightHalf = data.slice(iMid + rightHalfOffset, data.length)

    // Recursively sample these two parts, splitting the count into two.
    // If the count is not divisible by two, give the remainder to the
    // right half.
    let chosenLeft = sample(leftHalf, Math.floor(count / 2))
    let chosenRight = sample(rightHalf, Math.ceil(count / 2))

    return [].concat(chosenLeft, chosen, chosenRight)
  }

  if (count <= 0) {
    return []
  }
  if (count == 1) {
    return data[0]
  }
  if (data.length <= count) {
    return data
  }

  let firstElement = data[0]
  let lastElement = data[data.length - 1]
  let middlePortion = data.slice(1, data.length - 1)
  let middleElements = sample(middlePortion, count - 2)

  return [].concat([firstElement], middleElements, [lastElement])
}

export function linspace(start, end, n) {
  const delta = (end - start) / (n - 1)
  const values = [...Array(n).keys()].map((idx) => {
    return start + (idx * delta)
  })
  return values
}

export function makeChartId(length) {
  // Weird base36 thing I don't totally understand but OK.
  // https://stackoverflow.com/a/10727155
  length = length || 8
  const number = (Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
  return Math.round(number).toString(36).slice(1)
}

export function formatChf(n) {
  return d3.format(',d')(n) + ' CHF'
}

export function formatChfShort(n) {
  return d3.format(',.2s')(n) + ' CHF'
}
