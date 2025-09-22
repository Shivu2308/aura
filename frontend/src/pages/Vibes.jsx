import React from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import VibeCard from '../components/VibeCard'
import { useSelector } from 'react-redux'

const Vibes = () => {
  const navigate = useNavigate()
  const { vibeData } = useSelector(state => state.vibe)
  // console.log(vibeData)
  return (
    <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center'>
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed z-[100] top-[10px] left-[10px]'>
        <MdOutlineKeyboardBackspace className='text-white w-[25px] h-[25px] cursor-pointer ' onClick={() => navigate(`/`)} />
        <h1 className='text-white text-[20px] font-semibold'>Vibes</h1>
      </div>
      <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>
        {vibeData.map((vibe) => (
          <div key={vibe?._id} className='h-screen snap-start'>
            <VibeCard vibe={vibe}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Vibes
