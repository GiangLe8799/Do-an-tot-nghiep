import { Destination } from "./destination.model";
import { Service } from "./service.model";
import { User } from "./user.model";

export class Homestay {
    id?: any;
    homestayName?: string;
    status?: number;
    description?: string;
    address?: string;
    homestayTypeName?: string;
    maxPeople?: number;
    cost?: number;
    thumbnail?: string;
    numbOfBedroom?: number;
    numbOfBathroom?: number;
    services?: Service[];
    destination?: Destination;
    user?: User;
}
