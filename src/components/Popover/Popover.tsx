import React, {useRef, useEffect, useCallback, useState} from 'react';
import {
  focusFirstFocusableNode,
  findFirstFocusableNode,
} from '@shopify/javascript-utilities/focus';

import {PreferredPosition, PreferredAlignment} from '../PositionedOverlay';
import {Portal} from '../Portal';
import {useUniqueId} from '../../utilities/unique-id';
import {CloseSource, Pane, PopoverOverlay, Section} from './components';

export {CloseSource};

// keyof JSX.IntrinsicElements contains all elements that are valid in both HTML and SVG
// HTMLOnlyJsxIntrinsicElementsKeys only the keys of HTML elements
type FilteredKeys<T, U> = {[P in keyof T]: T[P] extends U ? P : never}[keyof T];
type HTMLOnlyJsxIntrinsicElementsKeys = FilteredKeys<
  JSX.IntrinsicElements,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
>;

export interface PopoverProps {
  /** The content to display inside the popover */
  children?: React.ReactNode;
  /** The preferred direction to open the popover */
  preferredPosition?: PreferredPosition;
  /** The preferred alignment of the popover relative to its activator */
  preferredAlignment?: PreferredAlignment;
  /** Show or hide the Popover */
  active: boolean;
  /** The element to activate the Popover */
  activator: React.ReactElement<any>;
  /**
   * The element type to wrap the activator with
   * @default 'div'
   */
  activatorWrapper?: HTMLOnlyJsxIntrinsicElementsKeys;
  /** Prevent automatic focus of the first field on activation */
  preventAutofocus?: boolean;
  /** Automatically add wrap content in a section */
  sectioned?: boolean;
  /** Allow popover to stretch to the full width of its activator */
  fullWidth?: boolean;
  /** Allow popover to stretch to fit content vertically */
  fullHeight?: boolean;
  /** Remains in a fixed position */
  fixed?: boolean;
  /** Callback when popover is closed */
  onClose(source: CloseSource): void;
}

export function Popover({
  activatorWrapper = 'div',
  children,
  onClose,
  activator,
  active,
  fixed,
  ...rest
}: PopoverProps) {
  const [activatorNode, setActivatorNode] = useState();
  const activatorContainer = useRef<HTMLElement>(null);

  const id = useUniqueId('popover');

  const setAccessibilityAttributes = useCallback(() => {
    if (activatorContainer.current == null) {
      return;
    }

    const firstFocusable = findFirstFocusableNode(activatorContainer.current);
    const focusableActivator = firstFocusable || activatorContainer.current;
    focusableActivator.tabIndex = focusableActivator.tabIndex || 0;
    focusableActivator.setAttribute('aria-controls', id);
    focusableActivator.setAttribute('aria-owns', id);
    focusableActivator.setAttribute('aria-haspopup', 'true');
    focusableActivator.setAttribute('aria-expanded', String(active));
  }, [active, id]);

  const handleClose = (source: CloseSource) => {
    onClose(source);

    if (activatorContainer.current == null) {
      return;
    }
    if (
      source === CloseSource.FocusOut ||
      source === CloseSource.EscapeKeypress
    ) {
      focusFirstFocusableNode(activatorContainer.current, false);
    }
  };

  useEffect(() => {
    if (!activatorNode && activatorContainer.current) {
      setActivatorNode(activatorContainer.current.firstElementChild);
    } else if (
      activatorNode &&
      activatorContainer.current &&
      !activatorContainer.current.contains(activatorNode)
    ) {
      setActivatorNode(activatorContainer.current.firstElementChild);
    }
    setAccessibilityAttributes();
  }, [activatorNode, setAccessibilityAttributes]);

  useEffect(() => {
    if (activatorNode && activatorContainer.current) {
      setActivatorNode(activatorContainer.current.firstElementChild);
    }
    setAccessibilityAttributes();
  }, [activatorNode, setAccessibilityAttributes]);

  const portal = activatorNode ? (
    <Portal idPrefix="popover" testID="portal">
      <PopoverOverlay
        testID="popoverOverlay"
        id={id}
        activator={activatorNode}
        onClose={handleClose}
        active={active}
        fixed={fixed}
        {...rest}
      >
        {children}
      </PopoverOverlay>
    </Portal>
  ) : null;

  return React.createElement(
    activatorWrapper,
    {ref: activatorContainer},
    React.Children.only(activator),
    portal,
  );
}

Popover.Pane = Pane;
Popover.Section = Section;
