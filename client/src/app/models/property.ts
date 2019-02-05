import { Address } from './address';
import { User } from './user';

export class Property {
    _id: string;
    address: Address;
    description: string;
    imageURL: string;
    agent: User;
}
