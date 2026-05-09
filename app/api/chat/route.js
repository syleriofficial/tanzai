
import { SYSTEM_PROMPT } from "@/engine/system";

export async function POST(req){

const body = await req.json();

const apiKey = process.env.OPENROUTER_API_KEY;

if(!apiKey){
 return Response.json({
  reply:"Syleri Engine demo mode active."
 });
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
    ...(body.messages || [])
   ]
  })
 }
);

const data = await response.json();

return Response.json({
 reply:data?.choices?.[0]?.message?.content || "Syleri Engine temporary error."
});

}
