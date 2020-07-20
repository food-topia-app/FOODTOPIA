import { UPDATE_FCM_TOKEN, LOCATION_UPDATE, UPDATE_MAIN_SCREEN } from '../actions/types'

const initialState = {
    fcmToken: '',
    branchId: undefined,
    branchName: 'Select Branch',
    mainScreen: 'home'
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_FCM_TOKEN:
            state.fcmToken = action.payload.fcmToken;
            return state;
        case LOCATION_UPDATE:
            return {
                ...state,
                branchName: action.payload.branchName,
                branchId: action.payload.branchId
            }
        case UPDATE_MAIN_SCREEN:
            return {
                ...state,
                mainScreen: action.payload
            }
        default:
            return state;
    }
}