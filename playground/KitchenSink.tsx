import React from 'react';
import {Page} from '../src';
// eslint-disable-next-line import/namespace
import * as Stories from './stories';

export function KitchenSink() {
  const exclude = new RegExp(
    'AllExamples|frame|theme|ContextualSaveBar|topbar|defaultloading',
    'i',
  );
  const keys = Object.keys(Stories);
  console.log({keys});

  return keys
    .filter((key) => key.match(exclude) == null)
    .map((key, index) => {
      // eslint-disable-next-line import/namespace
      const JsxProxy = Stories[key];
      return <JsxProxy key={index} />;
    });
}
