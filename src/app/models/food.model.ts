import { Destination } from "./destination.model";
import { Province } from "./province.model";

export class Food {
    id?: any;
    foodName?: string;
    price?: number;
    description?: string;
    province?: Province;
    status?: number;
}
