import { Homestay } from "./homestay.model";
import { Service } from "./service.model";
import { User } from "./user.model";

export class Reservation {
    id?: any;
    status?: number;
    startDate?: string;
    endDate?: string;
    numberOfPeople?: number;
    createdDate?: string;
    checkinDate?: string;
    checkoutDate?: string;
    cost?: number;
    user?: User;
    homestay?: Homestay;
}
