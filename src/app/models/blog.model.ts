import { Destination } from "./destination.model";
import { User } from "./user.model";

export class Blog {
    id?: any;
    postName?: string;
    thumbnail?: string;
    postPhoto?: string;
    shortDescription?: string;
    content?: string;
    category?: string;
    date?: string;
    status?: number;
    destination?: Destination;
    user?: User;
}
