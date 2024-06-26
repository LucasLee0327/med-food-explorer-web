import mypic from './food-web-meme.png'

function About() {
  return(
    <>
      <div className="container mx-auto flex justify-center items-center px-10 py-24 md:flex-row flex-col text-center">
        <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
          <img class="object-cover object-center rounded" alt="my selfie" src={mypic} />
        </div>
        <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <p class="text-4xl mb-4 text-gray-900">難餓舍</p>
                
          <p class="my-8 leading-relaxed">
            因為在台大醫學院a.k.a.美食沙漠餓瘋了
            <br/>
            所以就吃飽太閒(?)搞出了這傻X東西
            <br/>
            欸嘿( 。ω。)b
          </p>
          <p>
            <strong>本網站使用ChatGPT協助建造與設計</strong>
            <br/>
            <strong>新手上路，請鞭小力一點QwQ</strong>
          </p>
        </div>
      </div>
    </> 
  ) 
}

export default About
