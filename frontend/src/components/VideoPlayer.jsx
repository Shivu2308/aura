import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'

const VideoPlayer = ({ media }) => {
    const [mute, setmute] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)
    const videoTag = useRef()

     useEffect(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const video = videoTag.current
                    if (!video) return
    
                    if (entry.isIntersecting) {
                        video.play()
                            .then(() => {
                                setIsPlaying(true)
                            })
                            .catch((error) => {
                                // console.log('Autoplay failed:', error)
                            })
                    } else {
                        video.pause()
                        setIsPlaying(false)
                    }
                })
            }, { 
                threshold: 0.6,
                rootMargin: '0px'
            })
            const timer = setTimeout(() => {
                if (videoTag.current) {
                    observer.observe(videoTag.current)
                }
            }, 100)
    
            return () => {
                clearTimeout(timer)
                if (videoTag.current) {
                    observer.unobserve(videoTag.current)
                }
            }
        }, [])
    

    const handleClick = () =>{
        if(isPlaying){
            videoTag.current.pause()
            setIsPlaying(false)
        }else{
            videoTag.current.play()
            setIsPlaying(true)
        }
    }

    
    return (
        <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
            <video onClick={handleClick}
                ref={videoTag}
                src={media} autoPlay loop muted={mute} className='h-[100%] cursor-pointer w-full object-cover rounded-2xl' />
            <div onClick={() => setmute(prev => !prev)}
             className='absolute bottom-[10px] right-[10px]'>
                { mute ? <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold'/> : <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold'/>}
            </div>
        </div>
    )
}

export default VideoPlayer
