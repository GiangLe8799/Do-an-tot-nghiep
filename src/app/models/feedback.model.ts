import { Homestay } from "./homestay.model";
import { User } from "./user.model";

export class Feedback {
    id?: any;
    content?: string;
    feedbackPhoto?: string;
    homestay?: Homestay;
    user?: User;
    score?: number;
}
