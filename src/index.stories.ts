import {screen} from '@testing-library/dom';
import demoUserEvent from './index';

export const story1 = () => '<button>foo</button><br/><br/><br/><br/><br/><br/><br/><br/><br/><button>bar</button>'

setTimeout(async () => {
  await demoUserEvent.click(screen.getByText('foo'))
  await demoUserEvent.click(screen.getByText('bar'))
  await demoUserEvent.click(screen.getByText('foo'))
  await demoUserEvent.click(screen.getByText('bar'))
  await demoUserEvent.click(screen.getByText('foo'))
  await demoUserEvent.click(screen.getByText('bar'))
}, 1000)