import mypic from './pikachu-surprised.jpg'
import chatgpt1 from './ChatGPT1.png'
import chatgpt2 from './ChatGPT2.png'
import chatgpt3 from './ChatGPT3.png'
import skillmeme from './skill issue.png'

function About() {
  return(
    <>
      <div className="container mx-auto flex justify-center items-center px-10 py-24 md:flex-row flex-col text-center">
        <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
          <img class="object-cover object-center rounded" alt="my selfie" src={mypic} />
        </div>
        <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <p class="text-2xl mb-4 text-gray-900">國立臺灣大學 醫學系</p>
          <p class="text-3xl hidden lg:inline-block">李承洋</p>
                
          <p class="my-8 leading-relaxed">
            我是李承洋，是醫學系大二的學生。
            <br/>
            你問我來修這個幹嘛?學程不容易啊。
            <br/>
            欸嘿( 。ω。)b
          </p>
          <p>
            <strong>本網站使用ChatGPT協助建造與防禦設計</strong>
            <br/>
            <strong>新手上路，請鞭小力一點QwQ</strong>
          </p>
        </div>
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h2 class="text-3xl font-bold mb-6">ChatGPT 合作剪影</h2>
        <div class="flex justify-center">
          <img class="w-1/4 mx-2" src={chatgpt1} alt="ChatGPT 1" />
          <img class="w-1/4 mx-2" src={chatgpt2} alt="ChatGPT 2" />
          <img class="w-1/4 mx-2" src={chatgpt3} alt="ChatGPT 3" />
        </div>
        <img class="w-1/2 mx-auto mt-6" src={skillmeme} alt="Skill Meme" /> 
      </div>
    </> 
  ) 
}

export default About
