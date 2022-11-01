import React, { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';
import { Placement } from '@floating-ui/core';
import Floating from '../Floating';


interface TooltipProps
  extends PropsWithChildren<
    Omit<ComponentProps<'div'>, 'className' | 'style'>
  > {
  content: ReactNode;
  placement?: 'auto' | Placement;
  trigger?: 'hover' | 'click';
  style?: 'dark' | 'light' | 'auto';
  animation?: false | `duration-${number}`;
  arrow?: boolean;
}

const Tooltip: FC<TooltipProps> = (props) => {
  const {
    children,
    content,
    animation = 'duration-300',
    arrow = true,
    placement = 'top',
    style = 'dark',
    trigger = 'hover',
    ...theirProps
  } = props;
  return (
    <Floating
      content={content}
      style={style}
      animation={animation}
      placement={placement}
      arrow={arrow}
      trigger={trigger}
      {...theirProps}>
      {children}
    </Floating>
  );
};

export default Tooltip;
