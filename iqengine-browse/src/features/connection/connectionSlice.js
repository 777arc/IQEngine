// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const initialState = {accountName: "",
                      containerName: "",
                      sasToken: ""}

export default function connectionReducer(state = initialState, action) {
    const newState = {...state};
    switch (action.type) {
        case 'connection/setConnectionInfo': {
            newState.accountName = action.accountName;
            newState.containerName = action.containerName;
            newState.sasToken = action.sasToken;
            break;
        }
        default:
        {
            break;
        }
    }
    return newState
}