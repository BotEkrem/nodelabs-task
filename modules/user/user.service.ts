import {User} from "@/models/User";

export class UserService {
    static async list() {
        const users = await User.find().select('-password -loginIP');
        return {users}
    }
}