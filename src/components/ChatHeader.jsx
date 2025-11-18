import { BotMessageSquare } from 'lucide-react';


function ChatHeader(){
    return(
        <div className="w-full flex gap-2 bg-indigo-600 shadow-md p-4 shadow-md border-b text-white ">
            <BotMessageSquare size={30}/>
            <h1 className="font-bold tracking-wide text-2xl"> myChatbot</h1>
        </div>
    )
}

export default ChatHeader