import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'

// export const Server = "http://192.168.1.37:5000";
export const Server = "https://fudtopia.el.r.appspot.com";
export const AppVersion = "1.0.0";

const readToken = async () => {
    try {
        const result = await AsyncStorage.getItem('token');
        return result;
    } catch (err) {
        console.log('Token read error');
        return "";
    }
}

export const fetchJSON = async (apiName, body = {}, method = 'POST') => {
    let token = await readToken();
    if (token == null)
        token = '';
    try {
        let response = await fetch(Server + '/api/delivery/' + AppVersion + '/' + apiName,
            {
                method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                    'x-app-version': AppVersion
                },
                body: method === 'GET' ? undefined : JSON.stringify(body)
            });

        if (response.status == 200) {
            const responseJSON = await response.json();
            return responseJSON;
        }
        else {
            const result = await response.json();
            switch (result.msg) {
                case 'PASSWORD_ERROR':
                case 'USERNAME_ERROR':
                case 'ORDER_NOT_FOUND':
                case 'ORDER_ALREADY_DELIVERED':
                    return result
                default:
                    return null
            }
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}

export const logout = async (navigation) => {
    const keys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(keys)
    navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }]
    }));
}