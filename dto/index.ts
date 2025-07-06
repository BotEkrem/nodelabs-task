import {LoginDto} from "./auth/login.dto";
import {RegisterDto} from "./auth/register.dto";
import {SendMessageDto} from "@/dto/message/sendmessage.dto";
import {ConversationCreateDto} from "@/dto/conversation/create.dto";

export const dtos = {
    "login": LoginDto,
    "register": RegisterDto,
    "api/messages": SendMessageDto,
    "api/conversations": ConversationCreateDto
}