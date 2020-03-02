import { AddFlight } from './flight.action';
import { Flight } from './flight.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';

export class FlightStateModel {
    flights: Flight[];
}

@State<FlightStateModel>({
    name: 'flights',
    defaults: {
        flights: []
    }
})

export class FlightState {

    @Selector()
    static getFlights(state: FlightStateModel) {
        return state.flights
    }

    @Action(AddFlight)
    AddFlight({ getState, patchState }: StateContext<FlightStateModel>, { payload }: AddFlight) {
        patchState({
            flights: payload
        })
    }

    // @Action(RemoveFlight)
    // RemoveFlight({ getState, patchState }: StateContext<FlightStateModel>, { payload }: RemoveFlight) {
    //     patchState({
    //         flights: getState().flights
    //     })
    // }

}