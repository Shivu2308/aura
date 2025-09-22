import React from 'react'
import { FaRegHeart } from "react-icons/fa6";
import { RiChatSmile2Line } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import assets from '../assets/assets';
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
import { useNavigate } from 'react-router-dom';
import InstagramSkeletonLoading from '../pages/InstagramSkeletonLoading';
const Feed = () => {

  const navigate = useNavigate()
  const { postData } = useSelector(state => state.post)
  // console.log(postData)
  const { userData, notificationsData } = useSelector(state => state.user)
  const { allStoriesData, currentUserStory } = useSelector(state => state.story)
  // console.log(allStoriesData)

  // {
  //   !userData && !postData && (<InstagramSkeletonLoading />)
  // }

  return (
    <div className='w-full lg:w-[50%] min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto bg-[black]'>
      <div className='w-full h-[80px] md:h-[100px] flex items-center justify-between p-[10px] lg:hidden'>
        <div className='flex items-center justify-center'>
          <img src={assets.appfavicon} alt="" className='w-[30px]' />
          <img src={assets.auralogowords} alt="" className='w-[70px]' />
        </div>
        <div className='flex items-center justify-center gap-3 '>
          <div onClick={() => navigate("/notifications")} className='relative cursor-pointer'>
            <FaRegHeart className='text-white w-[25px] h-[25px]' />
            {
            (notificationsData?.length > 0 && notificationsData.some(noti => noti.isRead === false)) &&
          <div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 -right-1'></div>
          }
          </div>
          <RiChatSmile2Line className='text-white w-[28px] h-[28px] cursor-pointer' onClick={() => navigate("/messages")} />
        </div>
      </div>

      <div className='w-full overflow-auto flex gap-[10px] md:gap-5 items-center py-3 px-5 sm:p-5'>
        <StoryDp userName={"Your Story"} profileImage={userData.profileImage} story={currentUserStory} />
        {allStoriesData && allStoriesData?.map((story, i) => (
          <StoryDp key={i} userName={story?.author?.userName} profileImage={story?.author?.profileImage} story={story} />
        ))}
      </div>

      <div className='w-full min-h-[100vh] flex flex-col items-center mt-[10px] gap-5 pt-[20px] bg-white rounded-t-[60px] relative pb-[120px]'>

        <Nav />

        {postData?.map((post, i) => (
          <Post post={post} key={i} />
        ))}
      </div>


    </div>
  )
}

export default Feed
