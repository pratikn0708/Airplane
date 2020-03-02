import { Flight } from './flight.model';

export class AddFlight {
    static readonly type = '[Flight] AddFlight'

    constructor(public payload: Flight[]) {}
}

// export class RemoveFlight {
//     static readonly type = '[Flight] RemoveFlight'

//     constructor(public payload: string) {}
// }