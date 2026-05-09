import { askTanzai } from "@/engine/chat";

export async function POST(req){

 const body = await req.json();

 const reply = await askTanzai(body.messages || []);

 return Response.json({
  reply
 });

}