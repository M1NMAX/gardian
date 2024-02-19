import classNames from 'classnames';
import React, {
  ComponentProps,
  FC,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  Placement,
  shift
} from '@floating-ui/dom';
import {
  Middleware,
  useClick,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole
} from '@floating-ui/react-dom-interactions';


interface FloatingProps
  extends PropsWithChildren<Omit<ComponentProps<'div'>, 'style'>> {
  content: ReactNode;
  placement?: 'auto' | Placement;
  trigger?: 'hover' | 'click';
  style?: 'dark' | 'light' | 'auto';
  animation?: false | `duration-${number}`;
  arrow?: boolean;
  closeRequestKey?: string;
}

const getMiddleware = ({
  arrowRef,
  placement,
}: {
  arrowRef: RefObject<HTMLDivElement>;
  placement: 'auto' | Placement;
}): Middleware[] => {
  const middleware = [];
  middleware.push(offset(8));
  middleware.push(placement === 'auto' ? autoPlacement() : flip());
  middleware.push(shift({ padding: 8 }));

  if (arrowRef.current) {
    middleware.push(arrow({ element: arrowRef.current }));
  }

  return middleware;
};

const getPlacement = ({
  placement,
}: {
  placement: 'auto' | Placement;
}): Placement | undefined => {
  return placement === 'auto' ? undefined : placement;
};

const getArrowPlacement = ({
  placement,
}: {
  placement: Placement;
}): Placement => {
  return {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]] as Placement;
};

const Floating: FC<FloatingProps> = (props) => {
  const {
    children,
    content,
    animation = 'durantion-300',
    arrow = true,
    placement = 'top',
    trigger = 'hover',
    style = 'dark',
    closeRequestKey,
    ...theirProps
  } = props;
  const arrowRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const floatingTooltip = useFloating<HTMLElement>({
    middleware: getMiddleware({ arrowRef, placement }),
    onOpenChange: setOpen,
    open,
    placement: getPlacement({ placement }),
  });

  const {
    context,
    floating,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    reference,
    refs,
    strategy,
    update,
    x,
    y,
  } = floatingTooltip;

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useClick(context, { enabled: trigger === 'click' }),
    useFocus(context),
    useHover(context, { enabled: trigger === 'hover' }),
    useRole(context, { role: 'tooltip' }),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, refs.floating, refs.reference, update]);

  useEffect(() => {
    if (closeRequestKey !== undefined) setOpen(false);
  }, [closeRequestKey]);

  return (
    <>
      <div className='w-fit' {...getReferenceProps({ ref: reference })}>
        {children}
      </div>
      <div
        {...getFloatingProps({
          className: classNames(
            'absolute inline-block z-10 rounded-lg py-2 px-3 text-sm font-mediun shadow-sm',
            animation && `transition-opacity ${animation}`,
            { 'invisible opacity-0': !open },
            { 'bg-gray-900 text-white dark:bg-gray-700': style === 'dark' },
            {
              'border border-gray-200 bg-white text-gray-900':
                style === 'light',
            },
            {
              'border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white':
                style === 'auto',
            }
          ),
          ref: floating,
          style: { position: strategy, top: y ?? '', left: x ?? ' ' },
          ...theirProps,
        })}>
        <div className='relative z-20'>{content}</div>

        {arrow && (
          <div
            className={classNames(
              'absolute z-10 h-2 w-2 rotate-45',
              { 'bg-gray-900 dark:bg-gray-700': style === 'dark' },
              { 'bg-white': style === 'light' },
              { 'bg-white  dark:bg-gray-700': style === 'auto' }
            )}
            ref={arrowRef}
            style={{
              top: arrowY ?? ' ',
              left: arrowX ?? ' ',
              right: ' ',
              bottom: ' ',
              [getArrowPlacement({ placement: floatingTooltip.placement })]:
                '-4px',
            }}>
            &nbsp;
          </div>
        )}
      </div>
    </>
  );
};

export default Floating;
