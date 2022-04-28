import { useEffect, useState, Fragment, cloneElement, useRef, FC, ReactElement } from "react";
import ReactDOM from "react-dom";

// Type checking for TooltipContent props
interface TooltipContentProps {
    tooltipClass: string,
    content: string,
    position: { top: number, left: number },
    tooltipPosition: string
}

// Tooltip content
const TooltipContent: FC<TooltipContentProps> = (props) => {
    // Destructuring props object to use passed in properties without the need of "props." every time
    const { content, position, tooltipClass, tooltipPosition } = props
    // To hold and persist the tooltip element 
    const tooltipElement = useRef<HTMLDivElement | null>(null);
    // Retrieving the root element
    const targetElement = document.getElementById('root')

    useEffect(() => {
        // Tooltip element
        const element = tooltipElement.current
        if (element) {
            // Initializing position styling to default top position
            let top = `${position.top - element.clientHeight}px`
            let left = `${position.left}px`
            // Translating style scale to 1 
            let transform = `translate(-50%, -15px) scale(1)`
            // Updating position styling as per the tooltipPosition property
            switch (tooltipPosition) {
                case 'bottom':
                    top = `${position.top}px`
                    transform = `translate(-50%, 15px) scale(1)`
                    break;
                case 'left':
                    top = `${position.top}px`
                    left = `${position.left - element.clientWidth}px`
                    transform = `translate(-15px, -50%) scale(1)`
                    break;
                case 'right':
                    top = `${position.top}px`
                    transform = `translate(15px, -50%) scale(1)`
                    break;
            }
            // Setting the tooltip style
            element.style.top = top
            element.style.left = left
            element.style.transform = transform
        }
    }, []);

    // Tooltip element
    const output = <div className={tooltipClass} ref={tooltipElement}>{content}</div>
    // Tooltip to be mounted directly under the Root element, else to be mounted under its container element
    return targetElement ? ReactDOM.createPortal(output, targetElement) : output
}

// Type checking for Tooltip props
interface TooltipProps {
    content: string,
    position: 'top' | 'bottom' | 'left' | 'right',
    children: ReactElement,
    trigger?: 'click',
    variant?: 'danger' | 'success'
}

// Tooltip with cloned target element
export const Tooltip: FC<TooltipProps> = (props) => {
    // Destructuring props object to use passed in properties without the need of "props." every time
    const { children, content, position, trigger, variant } = props
    // Initializing component state
    const [elementPosition, setElementPosition] = useState({ top: 0, left: 0 });
    const [show, setShow] = useState(false);
    // To be appended to className attribute of Tooltip for styling purposes
    let tooltipClass = "tooltip rounded-lg"

    // Sets the position of the tooltip with respect to the target element and the window scroll location
    const setPosition = (e: React.MouseEvent<HTMLElement>) => {
        // Target element coordinate and dimension information
        const pos = e.currentTarget.getBoundingClientRect()

        // Controls the position of the tooltip relative to the target component.
        switch (position) {
            case 'bottom':
                setElementPosition({ top: pos.bottom + window.scrollY, left: pos.left + (pos.width / 2) + window.scrollX })
                break;
            case 'left':
                setElementPosition({ top: pos.top + (pos.height / 2) + window.scrollY, left: pos.left + window.scrollX })
                break;
            case 'right':
                setElementPosition({ top: pos.top + (pos.height / 2) + window.scrollY, left: pos.left + pos.width + window.scrollX })
                break;
            default: // Top position is the default position
                setElementPosition({ top: pos.top + window.scrollY, left: pos.left + (pos.width / 2) + window.scrollX })
                break;
        }

        // Controls the visibility of the tooltip
        switch (trigger) {
            case 'click': // Visibility is set on click event of the target element
                setShow(show ? false : true)
                break;
            default: // On Mouse Over is the default trigger to show tooltip
                setShow(true)
                break;
        }
    }

    // Adds class to tooltip that sets the initial Scale (0) and translation (depending on 'position' property)
    // values before tooltip is shown/visible
    switch (position) {
        case 'bottom':
            tooltipClass += ' tooltip--bottom'
            break;
        case 'left':
            tooltipClass += ' tooltip--left'
            break;
        case 'right':
            tooltipClass += ' tooltip--right'
            break;
        default: // tooltip--top is the default class to be appended to className attribute of 
            tooltipClass += ' tooltip--top'
            break;
    }

    // Controls the variant of the tooltip (red, green, or blue background color)
    switch (variant) {
        case 'success':
            tooltipClass += ' tooltip--success tooltip--success--after'
            break;
        case 'danger':
            tooltipClass += ' tooltip--danger tooltip--danger--after'
            break;
        default: // Default is blue theme
            tooltipClass += ' tooltip--primary tooltip--primary--after'
            break;
    }

    // Cloning the target element and appending the attributes to handle the trigger functionality
    // Hover trigger functionality is the default 
    let targetElement = cloneElement(children, { ...children.props, onMouseOver: setPosition, onMouseLeave: () => setShow(false) });
    if (trigger === 'click') {
        // Click of target element triggers the tooltip
        targetElement = cloneElement(children, { ...children.props, onClick: setPosition })
    }

    return (
        <Fragment>
            {/* Displays the Tooltip component. Processed user input is forwared to the TooltipContent component */}
            {show && <TooltipContent tooltipClass={tooltipClass} position={elementPosition} content={content}
                tooltipPosition={position} />}
            {/* Displays the target component */}
            {targetElement}
        </Fragment>
    )
}

export default Tooltip