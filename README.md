# Play user event

This a a _play_ wrapper for [@testing-library/user-event](https://github.com/testing-library/user-event), for use in DOM context only.

The interactions are played slowly, with a fake cursor displayed & moving around, for use in component demo purposes (storybook `play` function [introduced in csf v3](https://storybook.js.org/blog/component-story-format-3-0/))

## Table of Contents

- [Install](#install)
- [Usage](#usage)

## Install

This project uses [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --save @divriots/play-user-event
```

```javascript
import userEvent from "@divriots/play-user-event";
```

## Usage

[Live demo](https://components.studio/edit/ygIx12JTnqYNYBLXJ7AU/src/index.stories.js)

```js
import MyCounter from "../src/index.vue";
import userEvent from '@divriots/demo-user-event';
import {screen} from '@testing-library/dom';

export default {
  component: MyCounter,
  parameters: {
    layout: "centered",
  },
};

export const story1 = {
  play: async () => {
    const inc = screen.getByText('+')
    const dec = screen.getByText('-')
    await userEvent.click(inc)
    await userEvent.click(dec)
    await userEvent.click(inc)
    await userEvent.click(dec)
    await userEvent.click(inc)
    await userEvent.click(dec)
    await userEvent.click(inc)
    await userEvent.click(dec)
  }
};
```

![play-demo](https://user-images.githubusercontent.com/604263/126957529-bb23928a-7254-4aaa-b823-180d5e085e6b.gif)
