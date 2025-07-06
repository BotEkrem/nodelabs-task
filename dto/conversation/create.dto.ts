import {IsString, IsNotEmpty} from 'class-validator';

export class ConversationCreateDto {
    @IsString()
    @IsNotEmpty()
    participant: string;
}