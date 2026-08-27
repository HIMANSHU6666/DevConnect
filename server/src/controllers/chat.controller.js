import {chatWithGemini} from '../services/chat.service.js';
import { formatContext, getContext } from '../services/rag.service.js';

export const chat = async (req,res) => {
    try{
        const {message}  = req.body;
        if(!message){
            return res.status(400).json ({success:false,message:"please enter a message"})
        }
        const context = await getContext(message, req.user.id);
        // Only pass formatted context if relevant DB data was actually found
        const formattedContext = context ? formatContext(context, message) : null;

       const result = await chatWithGemini(message, formattedContext);
       return res.status(200).json({success:true,result});
    }
    catch(error){
        return res.status(500).json({success:false , message:error.message});
    }
}