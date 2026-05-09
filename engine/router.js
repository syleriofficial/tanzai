export async function routeRequest(type){
if(type==="coding") return "deepseek";
if(type==="creative") return "gemini";
if(type==="fast") return "groq";
return "syleri-auto";
}