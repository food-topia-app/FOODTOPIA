import { UPDATE_FCM_TOKEN, UPDATE_MAIN_SCREEN, LOCATION_UPDATE } from './types'

export const changeScreen = (screen) => {
    return {
        type: UPDATE_MAIN_SCREEN,
        payload: screen
    }
}

export const changeLocation = (branchName, branchId) => {
    return {
        type: LOCATION_UPDATE,
        payload: { branchName, branchId }
    }
}

export const updateFCMToken = (fcmToken) => {
    return {
        type: UPDATE_FCM_TOKEN,
        payload: { fcmToken }
    }
}