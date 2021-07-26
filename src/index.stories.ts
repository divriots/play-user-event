import {screen} from '@testing-library/dom';
import userEvent from './index';

export const story1 = () => '<button>foo</button><br/><br/><br/><br/><br/><br/><br/><br/><br/><button>bar</button><br/><br/><br/><input></input>'

setTimeout(async () => {
  await userEvent.click(screen.getByText('foo'))
  await userEvent.click(screen.getByText('bar'))
  await userEvent.type(screen.getByRole('textbox'), 'abcdfeghijklmn')
  await userEvent.click(screen.getByText('bar'))
  await userEvent.click(screen.getByText('foo'))
}, 1000)