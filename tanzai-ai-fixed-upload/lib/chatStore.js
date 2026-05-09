export async function saveChatPlaceholder({userId,messages}){return {ok:true,userId:userId||"demo-user",count:messages?.length||0}}
export async function listChatsPlaceholder(){return [{id:"demo-1",title:"Tanzai AI launch plan",updatedAt:"Today"},{id:"demo-2",title:"Google Cloud deployment",updatedAt:"Yesterday"},{id:"demo-3",title:"Pricing strategy",updatedAt:"This week"}]}
