import { useState, useRef } from 'react';

import {clamp} from './math'

export const useDocumentTitle = (title: string) => {
  document.title = title
}

export const useDragging = () => {
  const [dragging, setDragging] = useState(false);
  const [translate, setTranslate] = useState([0,0])
  const origin = useRef({x: 0, y: 0});
  const pan = useRef({x: 0, y: 0})

  const onMouseMove = useRef((e: MouseEvent) => {
    setTranslate([pan.current.x + e.clientX - origin.current.x, pan.current.y + e.clientY - origin.current.y])
  })

  const onMouseUp = useRef((e: MouseEvent) => {
    setDragging(false);
    pan.current = {x: pan.current.x + e.clientX - origin.current.x, y: pan.current.y + e.clientY - origin.current.y}
    document.removeEventListener('mousemove', onMouseMove.current)
  });

  return [
    {
      onMouseDown: (e: MouseEvent) => {
        origin.current = {x: e.clientX, y: e.clientY};
        setDragging(true);
        document.addEventListener('mousemove', onMouseMove.current)
        document.addEventListener('mouseup', onMouseUp.current)
        e.preventDefault()
      },

    },
    translate,
    dragging
  ]
}

const SCROLL_DELTA = 0.1

export const useZoom = ([min, max]: [number, number]) => {
  const lmin = Math.log(min)
  const lmax = Math.log(max)
  const [scale, setScale] = useState(clamp(Math.log(1.0), [lmin, lmax]))

  return [
    {
      onWheel: (e: WheelEvent) => {
        const dy = e.deltaY > 0 ? -SCROLL_DELTA : e.deltaY < 0 ? SCROLL_DELTA : 0
        setScale(scale => clamp(scale + dy, [lmin, lmax]))
        e.preventDefault()
      }
    },
    Math.exp(scale)
  ]
}
