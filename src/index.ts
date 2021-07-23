import userEvent from '@testing-library/user-event';

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

@keyframes grow {
    from {
        transform:scale(1);
    }
    to {
        transform:scale(2);
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
<div id="cursor"></div>
`

class Cursor extends HTMLElement {
  root: ShadowRoot
  cursor: HTMLDivElement
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = template
    this.cursor = this.root.getElementById('cursor') as HTMLDivElement;
  }

  clickEffect() {
    this.cursor.style.animation = 'none'
    this.cursor.offsetHeight; /* trigger reflow */
    this.cursor.style.animation = null as any
    this.cursor.className = 'click'
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
  const {left, top, height, width} = element.getBoundingClientRect()
  ensureCursor().setAttribute('style', `top:${Math.floor(top)+5}px;left:${Math.floor(left)+5}px`)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const demoUserEvent: Partial<typeof userEvent> = {
  async click(element, init, { token, ...options }: any = {}) {
    if (token?.isCancellationRequested) return;
    await moveCursorTo(element)
    if (token?.isCancellationRequested) return;
    await sleep(DELAY);
    if (token?.isCancellationRequested) return;
    ensureCursor().clickEffect();
    if (token?.isCancellationRequested) return;
    userEvent.click(element, init, options);
    if (token?.isCancellationRequested) return;
    await sleep(DELAY2);
  }
}

export default demoUserEvent;