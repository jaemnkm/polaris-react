import React from 'react';
import {mountWithAppProvider, trigger} from 'test-utilities/legacy';
import {calculateDraggerY, hueForDraggerY} from '../utilities';
import {Slidable} from '../../Slidable';
import {HuePicker} from '../HuePicker';

describe('<HuePicker />', () => {
  const mockProps = {
    hue: 0,
    onChange: noop,
    onDraggingEnd: noop,
  };

  describe('hue', () => {
    it('is used to calculate Slidable’s draggerY coordinate', () => {
      const hue = 44;
      const expectedHue = calculateDraggerY(hue, 0, 0);
      const huePicker = mountWithAppProvider(
        <HuePicker {...mockProps} hue={hue} />,
      );
      expect(huePicker.find(Slidable).prop('draggerY')).toBe(expectedHue);
    });
  });

  describe('onChange()', () => {
    it('gets called when slidable changes', () => {
      const onChangeSpy = jest.fn();
      const huePicker = mountWithAppProvider(
        <HuePicker {...mockProps} onChange={onChangeSpy} />,
      );
      trigger(huePicker.find(Slidable), 'onChange', {
        y: 0,
      });
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('gets called with the new hue value', () => {
      const onChangeSpy = jest.fn();
      const huePicker = mountWithAppProvider(
        <HuePicker {...mockProps} onChange={onChangeSpy} />,
      );
      const yPosition = 7;
      const expectedHue = hueForDraggerY(yPosition, 0);
      trigger(huePicker.find(Slidable), 'onChange', {
        y: yPosition,
      });
      expect(onChangeSpy).toHaveBeenCalledWith(expectedHue);
    });
  });

  describe('<Slidable />', () => {
    it('receives dragger height changes and uses them to calculate draggerY', () => {
      const hue = 80;
      const huePicker = mountWithAppProvider(
        <HuePicker {...mockProps} hue={hue} />,
      );
      const newDraggerHeight = 7;
      const expectedNewHue = calculateDraggerY(hue, 0, newDraggerHeight);
      trigger(huePicker.find(Slidable), 'onDraggerHeight', newDraggerHeight);
      expect(huePicker.find(Slidable).prop('draggerY')).toBe(expectedNewHue);
    });

    it('passes draggerX to Slidable with value 0', () => {
      const huePicker = mountWithAppProvider(<HuePicker {...mockProps} />);
      expect(huePicker.find(Slidable).prop('draggerX')).toBe(0);
    });

    it('onDraggingEnd is called when dragging event ends with mouseup', () => {
      const spy = jest.fn();
      mountWithAppProvider(<HuePicker {...mockProps} onDraggingEnd={spy} />)
        .find(Slidable)
        .simulate('mousedown');

      const event = new MouseEvent('mouseup', {
        clientX: 0,
        clientY: 100,
      } as MouseEventInit);
      Object.assign(event, {preventDefault: jest.fn()});

      window.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });

    it('onDraggingEnd is called when dragging event ends with touchend', () => {
      const spy = jest.fn();
      mountWithAppProvider(<HuePicker {...mockProps} onDraggingEnd={spy} />)
        .find(Slidable)
        .simulate('touchstart');

      const event = new MouseEvent('touchend', {
        clientX: 0,
        clientY: 100,
      } as TouchEventInit);
      Object.assign(event, {preventDefault: jest.fn()});

      window.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });

    it('onDraggingEnd is called when dragging event ends with touchcancel', () => {
      const spy = jest.fn();
      mountWithAppProvider(<HuePicker {...mockProps} onDraggingEnd={spy} />)
        .find(Slidable)
        .simulate('touchstart');

      const event = new MouseEvent('touchcancel', {
        clientX: 0,
        clientY: 100,
      } as TouchEventInit);
      Object.assign(event, {preventDefault: jest.fn()});

      window.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });
  });
});

function noop() {}
