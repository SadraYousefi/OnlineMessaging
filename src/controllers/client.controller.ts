import { Body, Controller, Get, Param, Post, Query, Render, Req, Res, UnauthorizedException } from "@nestjs/common";
import { Response , Request } from 'express'
import { GetConversationMessagesDto } from "src/core";
import { GetConversationViewDto, LoginViewDto } from "src/core/dtos/view-dtos";
import { ConversationUseCases } from "src/use-cases/conversation/conversation.use-case";
import { SocketUseCases } from "src/use-cases/socket/socket.use-cases";

@Controller('view')
export class ClientController {
    constructor(
        private conversationUseCases: ConversationUseCases ,
        private socketUseCases: SocketUseCases

    ){}

    
    @Get('login')
    @Render('login')
    loginView() {
        return {msg: "login"}  
    }

    @Get("chat")
    @Render('chatroom')
    async chatView(@Req() req) {

        const activeChats = await this.conversationUseCases.getUserChatContacts(+req.user) ;
        return {chats: activeChats}
    }


    @Get('create')
    @Render("create")
    getContactList(@Req() req) {
        const contacts = this.socketUseCases.findUserContacts(+req.user)
        return {contacts}
    }

    @Get('createConversation')
    createConversation(@Query() data: GetConversationViewDto ,@Req() req , @Res() res: Response ){
        this.conversationUseCases.findOrCreateConversation([data.userId , req.user])
        return res.redirect(`/view/conversation?userId=${data.userId}`)
    }

    @Get('conversation')
    @Render('chat')
    async getConversationMessages(@Query() data: GetConversationViewDto , @Req() req) {
        const user = req.user ;
        const recipient = data.userId ;
        const body: GetConversationMessagesDto = {
            contactId: String(recipient) ,
            userId: req.user ,
            onlyPinned: false ,
        }
        const messages = await this.conversationUseCases.getConversationMessages(body)
        return {messages }
    }

    @Post('login')
    login(@Body() data: LoginViewDto , @Res() res: Response){
         const userId = data.userId ;
         const user = this.socketUseCases.findUserById(userId) ;
         if(!user)
            throw new UnauthorizedException("login first") ;

        res.cookie('token' , user.id , {expires: new Date(Date.now() + 1000*60*60)})
        return res.redirect("/view/chat") 
    }

}