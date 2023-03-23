import Head from "next/head";
import Answer from "../components/Answer";
import Footer from "../components/Footer";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import * as homeStyles from "../styles/Home.module.css";
import Image from "next/image";
import Carousel from "react-bootstrap/Carousel";
import 'bootstrap/dist/css/bootstrap.css'
import { supabase } from "../../../utils/supabase";
import { properCase } from "../../../utils/proper-case";
export default function Home() {
  const router = useRouter();
  console.log("router", router.query)
  const bookName  = router.query.bookName;
  const [bookId, setBookId] = useState(0);
  const [showName, setShowName] = useState("");
  if(bookName != undefined && showName == ""){
    setShowName(properCase(bookName))
  }

  async function getColours(){
    await  supabase.from('book-database')
    .select(`*`)
    .then((result) => {
      // Handle the result here
      setBookId([result.data.findIndex(x => x.bookName == bookName)])
      setColours([result.data[bookId].primaryCol,result.data[bookId].secondaryCol])

    })
    .catch((error) => {
      // Handle the error here
      console.error(error)
    })
  }

  const [firstLoad, setFirstLoad] = useState(true);
  const [question, setQuestion] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [gotResult, setGotResult] = useState(true);
  const [result, setResult] = useState("");
  const [passages, setPassages] = useState(["", "", ""]);
  const [gotEmbeddings, setGotEmbeddings] = useState(true);
  const answerRef = useRef(null);
  const [colours, setColours] = useState(["", ""]);
  if(firstLoad){
    getColours()
    setFirstLoad(false)
  }
  function handleChange(event) {
    setQuestion(event.target.value);
  }
const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      generateAnswer();
    }
  };
  async function generateAnswer() {
    let btnSubmit = document.getElementById("btnSubmit");
    if (question === "") {
      return;
    }
    //deploy w vercel
    btnSubmit.disabled = true;
    setGotResult(false);
    setShowResult(true);
    handleScroll(answerRef.current);
    let check = "false";
    const passageResponse = await fetch("/api/passages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookName,question }),
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    const passageData = passageResponse;
    setPassages([
      passageData.top_3_passages[0]["Content"],
      passageData.top_3_passages[1]["Content"],
      passageData.top_3_passages[2]["Content"],
    ]);
    const answerResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookName: bookName,
        question: question,
        passages: passageData.all_passages,
      }),
    });
    const data = answerResponse.body;

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let answerResult = "";

    setGotResult(true);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      answerResult += chunkValue;
      setResult(answerResult);
    }

    btnSubmit.disabled = false;
  }

  const handleScroll = (ref) => {
    setTimeout(() => {
      window.scrollTo({
        top: ref.offsetTop,
        left: 100,
        behavior: "smooth",
      });
    }, 50);
  };

  

  return (
    <>
      <Head>
        <title>{showName} GPT</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      <main>
      <div
          className={`container ${homeStyles.container} ${homeStyles["landing-container"]}`}
        >
          <div
            className={`row ml-0 ${homeStyles.row} ${homeStyles["landing-card"]} ${homeStyles["landing-bg"]}`}
          >
             
              <div className={`col-sm ${homeStyles["col-sm"]}`}>
                <div className={homeStyles["landing-header"]}>
                  I&apos;m {showName}
                </div>
                <div className={homeStyles["form-container"]}>
                  <input
                    className={` col ${homeStyles.col} ${homeStyles["landing-search"]}`}
                    type="input"
                    placeholder=" Ask Me Anything"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  ></input>
                  <button
                    id="btnSubmit"
                    className={`${homeStyles.btnSubmit}`}
                    onClick={generateAnswer}
                    type="submit"
                  ></button>
                </div>
              </div>

            <div className={`col homeStyles.col`}>
                <div
                  className={`row ${homeStyles.row} ${homeStyles["template-mockup"]}`}
                >
                  <Carousel
                    controls={false}
                    interval="3000"
                    fade
                    variant="dark"
                  >
                    <Carousel.Item>
                      <a
                        href="https://bamitsmanas.gumroad.com/l/the-most-awesome-atomic-habits-guide-in-the-universe?layout=profile"
                        target="__blank"
                      >
                        <Image
                          className={homeStyles["template-mockup-image"]}
                          width="100"
                          height={100}
                          src={`https://qhaaptobpyvibymtemus.supabase.co/storage/v1/object/public/gptbookclub/${bookName}/notion-mockup-1.png`}
                          alt="Notion Mockup"
                          priority
                        />
                      </a>
                    </Carousel.Item>
                    <Carousel.Item>
                      <a
                        href="https://bamitsmanas.gumroad.com/l/the-most-awesome-atomic-habits-guide-in-the-universe?layout=profile"
                        target="__blank"
                      >
                        <Image
                          className={homeStyles["template-mockup-image"]}
                          layout="fill"
                          src={`https://qhaaptobpyvibymtemus.supabase.co/storage/v1/object/public/gptbookclub/${bookName}/notion-mockup-2.png`}
                          alt="Notion Mockup"
                          priority
                        />
                      </a>
                    </Carousel.Item>
                    <Carousel.Item>
                      <a
                        href="https://bamitsmanas.gumroad.com/l/the-most-awesome-atomic-habits-guide-in-the-universe?layout=profile"
                        target="__blank"
                      >
                        <Image
                          className={homeStyles["template-mockup-image"]}
                          layout="fill"
                          src={`https://qhaaptobpyvibymtemus.supabase.co/storage/v1/object/public/gptbookclub/${bookName}/notion-mockup-3.png`}
                          alt="Notion Mockup"
                          priority
                        />
                      </a>
                    </Carousel.Item>
                  </Carousel>
                  <div className={homeStyles["template-mockup-text"]}>
                    <a
                      href="https://bamitsmanas.gumroad.com/l/the-most-awesome-atomic-habits-guide-in-the-universe?layout=profile"
                      target="__blank"
                      className={homeStyles["cta-link"]}
                    >
                      Actualise Your Potential Now
                    </a>
                  </div>
                </div>
            </div>
          </div>
        </div>
        
        <div ref={answerRef}>
          {showResult ? (
            <Answer
              bookName={bookName}
              showName ={showName}
              gotResult={gotResult}
              answer={result}
              para1={passages[0]}
              para2={passages[1]}
              para3={passages[2]}
            />
          ) : (
            <div></div>
          )}
        </div>
        <Footer/>
        <style global jsx>
          {`
          body{
              scroll-behavior: smooth;
              font-family: 'Roboto', sans-serif;
              max-width: 100vw;
              overflow:visible;
                --bg-color: ${colours[0]};
                --dot-color: #fec702;
                
                /* Dimensions */
                --dot-size: 3px;
                --dot-space: 22px;
                
                background:
                  linear-gradient(90deg, var(--bg-color) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center,
                  linear-gradient(var(--bg-color) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center,
                  var(--dot-color);
                background-size: var(--dot-space) var(--dot-space);
          }
          a {
            color: inherit;
            text-decoration: none;
          }
          a:active{
            color: inherit;
            text-decoration: none;
          }
          a:hover{
            color:white;
            text-decoration: none;
          }
          `}
          
        </style>
        
      </main>

    </>
    
  );
}
