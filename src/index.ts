import userEvent from '@testing-library/user-event';
import { clickOptions } from '@testing-library/user-event/dist/click';
import { typeOptions } from '@testing-library/user-event/dist/type/typeImplementation';

const DELAY = 500;
const DELAY2 = 100;

const template = /*html*/ `
<style>
:host {
  position: fixed;
  z-index: 9999;
  transition: all 500ms ease;
}

.click {
  animation-name: grow;
  animation-duration: 100ms;
  animation-iteration-count: 1;
  animation-timing-function: linear;
}

.fade {
  animation-name: fade;
  animation-duration: 5000ms;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes grow {
    from {
        transform:scale(1);
    }
    to {
        transform:scale(2);
    }
}

@keyframes fade {
    from {
        opacity: 1
    }
    to {
        opacity: 0
    }
}

#cursor {
  width: 10px;
  height: 10px;
  border: 2px solid #fefefe;
  border-radius: 100%;
  border-color: red;
  pointer-events: none;
  mix-blend-mode: difference;
}
</style>
<div id="fader">
<div id="cursor"></div>
</div>
`

class Cursor extends HTMLElement {
  root: ShadowRoot
  cursor: HTMLDivElement
  fader: HTMLDivElement
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = template
    this.cursor = this.root.getElementById('cursor') as HTMLDivElement;
    this.fader = this.root.getElementById('fader') as HTMLDivElement;
  }

  clickEffect() {
    this.cursor.style.animation = 'none'
    this.cursor.offsetHeight; /* trigger reflow */
    this.cursor.style.animation = null as any;
    this.cursor.className = 'click'
    this.fade();
  }

  moveTo({top, left}: {top: number, left: number}) {
    this.setAttribute('style', `top:${top}px;left:${left}px`)
    this.fade();
  }

  fade() {
    this.fader.style.animation = 'none'
    this.fader.offsetHeight; /* trigger reflow */
    this.fader.style.animation = null as any;
    this.fader.className = 'fade'
  }
}

customElements.define('demo-user-event-cursor', Cursor)

const cursor = new Cursor();

function ensureCursor(): Cursor {
  if (document.body.getElementsByTagName('demo-user-event-cursor').length === 0) {
    document.body.appendChild(cursor);
  }
  return cursor;
}

async function moveCursorTo(element: Element): Promise<void> {
  const {left, top} = element.getBoundingClientRect()
  ensureCursor().moveTo({top: Math.floor(top)+5, left: Math.floor(left)+5})
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type CancellationToken = {
  isCancellationRequested: boolean
}

type WithCancellationToken<T> = T & {
  // introduced by divriots (deprecated)
  token?: CancellationToken;
  // later introduced by storybook
  abortSignal?: AbortSignal
}

async function wrapCall(element: Element, token: CancellationToken | undefined, abortSignal: AbortSignal | undefined, cb: VoidFunction) {
  const isCancelled = () => token?.isCancellationRequested || abortSignal?.aborted || !document.body.contains(element)
  if (isCancelled()) return;
  await moveCursorTo(element)
  if (isCancelled()) return;
  await sleep(DELAY);
  if (isCancelled()) return;
  ensureCursor().clickEffect();
  if (isCancelled()) return;
  await cb();
  if (isCancelled()) return;
  await sleep(DELAY2);
}

export type PlayUserEvent = {
  click(element: Element, init?: MouseEventInit, options?: WithCancellationToken<clickOptions>): Promise<void>
  dblClick(element: Element, init?: MouseEventInit, options?: WithCancellationToken<{}>): Promise<void>
  hover(element: Element, init?: MouseEventInit, options?: WithCancellationToken<{}>): Promise<void>
  type(element: Element, text: string, options?: WithCancellationToken<typeOptions>): Promise<void>
}

const playUserEvent: PlayUserEvent = {
  click(element, init, { token, abortSignal, ...options } = {}) {
    return wrapCall(element, token, abortSignal, () => userEvent.click(element, init, options))
  },
  dblClick(element, init, { token, abortSignal } = {}) {
    return wrapCall(element, token, abortSignal, () => userEvent.dblClick(element, init))
  },
  hover(element, init, { token, abortSignal } = {}) {
    return wrapCall(element, token, abortSignal, () => userEvent.hover(element, init))
  },
  type(element, text: string, { token, abortSignal, ...options } = {}) {
    return wrapCall(element, token, abortSignal, () => userEvent.type(element, text, {
      delay: DELAY2,
      ...options
    }))
  },
}

export default playUserEvent;