import {User} from "@/models/User";
import {User as ReqUser} from "@/types/express";


export class AuthService {
    static async logout(user: ReqUser) {
        await User.findOneAndUpdate({_id: user.id}, {loginIP: null, loginAt: null}, {new: true})
        return {success: true}
    }
}