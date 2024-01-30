import React, {forwardRef} from 'react'

const SizeAwareComponent = ({style, className, key, children, value, size, gridRef, ...props})=> {
  var newChildren = React.Children.map(children, function (child) {
    return React.cloneElement(child, {
      width: style.width,
      height: style.height
    })
  });

  return (
    <div style={{...style}} className={['GridCard', className].join(' ')} key={key} {...props} ref={gridRef}>
        {/* children is needed for the resizable corner component */}
        {newChildren}
    </div>
  )
}

export default (forwardRef((props, ref) => {return <SizeAwareComponent {...props} gridRef={ref} />}))