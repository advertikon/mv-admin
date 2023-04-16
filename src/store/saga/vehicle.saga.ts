import { call, put, takeLeading } from 'redux-saga/effects';
import { setIsVehicleStacksLoading, setVehicleStacks } from '@slice/vehicle.slice';
import { ServiceVehicleGetStack } from '@services/vehicle.service';

function* fetchStacks() {
    yield put(setIsVehicleStacksLoading(true));
    const data: string[] = yield call(ServiceVehicleGetStack);
    yield put(setVehicleStacks(data));
    yield put(setIsVehicleStacksLoading(true));
}

export function* SagaVehicleGetStacks() {
    yield takeLeading(VEHICLE_GET_STACKS, fetchStacks);
}

export const VEHICLE_GET_STACKS = 'vehicle/get_stacks';
