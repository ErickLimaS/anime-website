import React from 'react'
import * as C from './styles'
import { useSelector } from 'react-redux'
import AnimesReleasingThisWeek from '../Home/AnimesReleasingThisWeekList'

export default function FromSameFranchise({ data }: any) {

  // dark mode
  const darkModeSwitchConst = useSelector((state: any) => state.darkModeSwitch)
  const { darkMode } = darkModeSwitchConst

  // drag overflowing elements instead of using scrollbar
  function dragMouseEvent() {
    const slider: any = document.querySelector('.list-from-same-franchise');
    let isDown = false;
    let startX: any;
    let scrollLeft: any;

    slider.addEventListener('mousedown', (e: any) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = 'grab'
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style.cursor = 'default'
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style.cursor = 'default'
    });
    slider.addEventListener('mousemove', (e: any) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
      console.log(walk);
    });
  }

  return (
    <C.Container darkMode={darkMode}>
      <div className='heading-section'>
        <h2>From Same Franchise</h2>
        <span>Drag to Scroll</span>
      </div>

      <ul onDrag={() => dragMouseEvent()} className='list-from-same-franchise'>
        {data.map((item: any) => (
          <li key={item.id}>
            <AnimesReleasingThisWeek data={item} />
          </li>
        ))}
      </ul>


    </C.Container>
  )
}
