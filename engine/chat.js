import { SYSTEM_PROMPT } from "./system";

export async function askTanzai(messages){

 const apiKey = process.env.OPENROUTER_API_KEY;

 if(!apiKey){
  return "Syleri Engine demo mode active.";
 }

 const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
   method:"POST",
   headers:{
    Authorization:`Bearer ${apiKey}`,
    "Content-Type":"application/json"
   },
   body:JSON.stringify({
    model:process.env.OPENROUTER_MODEL || "openrouter/auto",
    messages:[
      {
       role:"system",
       content:SYSTEM_PROMPT
      },
      ...messages
    ]
   })
  }
 );

 const data = await response.json();

 return data?.choices?.[0]?.message?.content || "Syleri Engine temporary error.";
}