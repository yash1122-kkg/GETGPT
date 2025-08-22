import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevprompts, setPrevprompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setRecentPrompt("");
        setInput("");
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        let currentPrompt;
        if (prompt !== undefined) {
            currentPrompt = prompt;
            setRecentPrompt(prompt);
        } else {
            currentPrompt = input;
            setRecentPrompt(input);
            setPrevprompts(prev => [...prev, input]);
        }
        
        try {
            const response = await runChat(currentPrompt);

            let responseArray = response.split("**");
            let newResponse = "";
            
            for(let i = 0; i < responseArray.length; i++) {
                if(i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            
            let newResponse2 = newResponse.split("*").join("</br>");
            let newResponseArray = newResponse2.split(" ");
            
            setResultData("");
            setLoading(false);

            for(let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
            
        } catch (error) {
            console.error("Error in runChat:", error);
            setResultData("Sorry, there was an error generating the response. Please try again.");
            setLoading(false);
        }
        
        setInput("");
    };

    const contextValue = {
        prevprompts,
        setPrevprompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;