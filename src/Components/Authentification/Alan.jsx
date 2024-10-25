import React, { useState, useEffect } from "react";
import TextToSpeech from "./text-to-speech/TextToSpeech";
import SpeechToText from "./speech-to-text/SpeechToText ";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../pages/authContext';
import AuthenticationService from "@/Services/Authentification/AuthentificationService";
import Statistiques from "@/Services/statistiques/Statistiques";
export default function Alan() {
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();
  const [speech, setSpeech] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [services, setServices] = useState([]);
  const [scroll, setScroll] = useState(0);
  const [titleService, setTitles] = useState(false);
  const [newsPromptSpoken, setNewsPromptSpoken] = useState(false);
  const [actor, setActor] = useState(2);
  const location = useLocation();
  const { authData, setAuthUserData } = useAuth();
  const [logoutSure, setLogoutSure ] = useState(false);
  const [emailSure, setEmailSure ] = useState(false);
  const [areyousure,setAreyouSure]=useState(false);
  const [areyousure2,setAreyouSure2]=useState(false);
  const authenticationService = new AuthenticationService();
  const statistique = new Statistiques();
  const [sendEmail, setEmail] = useState("");
    
  const logout = () => {
    setAuthUserData({
      user: null,
      accessToken: null,
      refreshToken: null,
    });

    localStorage.setItem('authData', JSON.stringify({
      user: null,
      accessToken: null,
      refreshToken: null,
    }));
  };

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript.toUpperCase());
    setSpeech(null);
  };

  const handleLogout = () => {
  
    setAuthUserData({
      user: null,
      accessToken: null,
      refreshToken: null,
    });

    localStorage.setItem('authData', JSON.stringify({
      user: null,
      accessToken: null,
      refreshToken: null,
    }));
    navigate("/");
  };

  useEffect(() => {
    const storedConsultations = localStorage.getItem("consultations");
    if (storedConsultations) {
      setConsultations(JSON.parse(storedConsultations));
    }

    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      if (transcript.includes("ALAN") || transcript.includes("ALLEN") || transcript.includes("HELLO") ) {
          const response = await statistique.geminiwithtext(`this is only an informations for you don't talk about it when you response me :(so let me explain i'm working on web site like upwork and fevrr our name is Collabhub and i'm working on voice assistance based on ia so act like it and i want you to give me a short response without (*) ) now this is the response: ${transcript}`);
          const action = {
              text: response,
              language: "en-US",
              voiceIndex: actor
          };
          setSpeech(action);
      }
  };
    if (!speech) {
      let action = null;
      fetchData();

      if (transcript.includes("GO TO SERVICE")) {
        action = {
          text: "Yes, going right now.",
          language: "en-US",
          voiceIndex: actor
        };
        const destination = transcript.includes("GO TO SERVICES") ? "/buyProject" : "/buyProject";
        setTimeout(() => {
          navigate(destination);
          setTimeout(() => {
            setSpeech({
              text: "Do you want me to read the titles for you?",
              language: "en-US",
              voiceIndex: actor
            });
            setNewsPromptSpoken(true);
          }, 1000);
        }, 2500);
      } else if (transcript.includes("GO TO STORE")) {
        action = {
          text: "Yes, going right now.",
          language: "en-US",
          voiceIndex: actor
        };
        setTimeout(() => {
          navigate("/store?type=gaming");
        }, 2500);
      }else if (transcript.includes("GO TO BLOG")) {
        action = {
          text: "Yes, going right now.",
          language: "en-US",
          voiceIndex: actor
        };
        setTimeout(() => {
          navigate("/blog");
        }, 2500);
      } 
      else if (transcript.includes("SIGN IN")) {
        action = {
          text: "Yes, going right now.",
          language: "en-US",
          voiceIndex: actor
        };
        setTimeout(() => {
          navigate("/sign-in");
        }, 2500);
      } 
      else if (transcript.includes("SIGN UP")) {
        action = {
          text: "Yes, going right now.",
          language: "en-US",
          voiceIndex: actor
        };
        setTimeout(() => {
          navigate("/sign-up");
        }, 2500);
      }
    
      else if (transcript.includes("LOG OUT") || transcript.includes("LOOK OUT.")) {
        if (authData.user)
        {
          action = {
            text: "Are you sure you want to log out.",
            language: "en-US",
            voiceIndex: actor
          };
          setLogoutSure(true)
        }
        else {
          setSpeech({
            text: "You are already disconnected",
            language: "en-US",
            voiceIndex: actor
          });
        }
      }
      else if (transcript.includes("E-MAIL") || transcript.includes("EMAIL") ) {
        if (authData.user)
        {
          setSpeech({
            text: "Enter your your Message to sen a quick email to superviser",
            language: "en-US",
            voiceIndex: actor
          });
          setEmailSure(true)
        }
        else{
          setSpeech({
            text: "Please log in to our service so you can send email",
            language: "en-US",
            voiceIndex: actor})
        }
      }

      if (action) {
        setSpeech(action);
      }

    }
  }, [transcript, speech, navigate]);

  useEffect(() => {


    if (speech && transcript.includes("STOP")) {
      setSpeech(null);
      setScroll(0);
    } else if (!speech) {
      if (newsPromptSpoken && transcript.includes("YES")) {
        setTitles(true);
        setNewsPromptSpoken(false);
        setScroll(300);
      } else if (newsPromptSpoken && transcript.includes("NO")) {
        setSpeech({
          text: "As you like, do you need something else?",
          language: "en-US",
          voiceIndex: actor
        });
        setNewsPromptSpoken(false);

      } else if (logoutSure && transcript.includes("YES")) {

        setSpeech({
          text: "You've been disconnected, see you later",
          language: "en-US",
          voiceIndex: actor
        });
        handleLogout();
        setLogoutSure(false);
      } else if (logoutSure && transcript.includes("NO")) {
        setSpeech({
          text: "Logout canceled",
          language: "en-US",
          voiceIndex: actor
        });
        setLogoutSure(false);
      } else if (emailSure) {
        if (!areyousure) {
          setSpeech({
            text: "Do you want to review your message before sending it?",
            language: "en-US",
            voiceIndex: actor
          });
          setEmail(transcript.toLowerCase())
          setAreyouSure(true);
        } else {
          if (transcript.includes("YES")) {
            setSpeech({
              text: "Your message is: " + sendEmail + ". Do you want to send it?",
              language: "en-US",
              voiceIndex: actor
            });
            setAreyouSure(false);
            setEmailSure(false)
            setAreyouSure2(true);
          } else if (transcript.includes("NO")) {
            setSpeech({
              text: "do you want to send it ?",
              language: "en-US",
              voiceIndex: actor
            });
            setAreyouSure(false);
            setEmailSure(false)
            setAreyouSure2(true);
          }
        }
      } else if (areyousure2) {
        if (transcript.includes("YES")) {
          setSpeech({
            text: "Your email has been sent.",
            language: "en-US",
            voiceIndex: actor
          });
          if (authData.user)
          {
            authenticationService.sendEmailToAdmin(authData.user?.email,sendEmail,authData.user?.nom + " " +authData.user?.prenom)
          }
          else{
            setSpeech({
              text: "Please log in to send email",
              language: "en-US",
              voiceIndex: actor})
          }
         
          
        } else if (transcript.includes("NO")) {
          setSpeech({
            text: "Your email has been canceled.",
            language: "en-US",
            voiceIndex: actor
          });
        }
        setAreyouSure2(false);
      }
    }
  
  }, [transcript, newsPromptSpoken, speech, logoutSure, emailSure, areyousure, areyousure2]);
  
  
  
  useEffect(() => {
    window.scrollTo({
      top: scroll,
      behavior: "smooth"
    });
  }, [scroll]);

  useEffect(() => {
    if (titleService) {
      let delay = 0;
      services.forEach((service, index) => {
        setTimeout(() => {
          if (index % 4 === 0 && index !== 0)
            setScroll((prevScroll) => prevScroll + 550);
          setSpeech({
            text: service.title,
            language: "en-US",
            voiceIndex: actor,
          });
        }, delay);

        delay += 3800;
      });

      setTitles(false);
    }
  }, [titleService, services]);

  useEffect(() => {
    const normalizedTranscript = transcript.trim().toLowerCase();
    switch (normalizedTranscript) {
      case "who are you?":
      case "who are you":
        setSpeech({
          text: "I am Alan, a computer program created by students. Devoid of personal experiences or identity, my purpose is to assist and provide information to the best of my abilities. How may I assist you today",
          language: "en-US",
          voiceIndex: actor,
        });
        break;
      case "hello.":
      case "help.":
      case "help":
        setSpeech({
          text: "",
          language: "en-US",
          voiceIndex: actor,
        });
        break;
      case "thank you.":
      case "thank you":
        setSpeech({
          text: "You are welcome",
          language: "en-US",
          voiceIndex: actor,
        });
        break;
 
    }
  }, [transcript]);

 return (
  <div style={{
    position: 'fixed',
    bottom: '20px',
    left: '20px', // Changed from right to left
    zIndex: 1000, // High z-index to ensure it's on top of other content
    width: 'auto', // Adjust width as necessary
    padding: '10px', // Add padding for better visibility
    
  }}>
    <SpeechToText onTranscriptChange={handleTranscriptChange} language={"en-US"} />
    {speech && <TextToSpeech text={speech.text} language={speech.language} voiceIndex={speech.voiceIndex} />}
  </div>
);

}