export const PLAYER_STATE = Object.freeze({
    "Inactive": -1, // Initialization state
    "Play": 1,
    "Pause": 0
});

export const POPUP_STATE = Object.freeze({
    "OutLobby": 0,
    "InLobby": 1,
    "ConnectLobby": 2
});

export const READY_STATE= Object.freeze({
    "Unsent": 0,
    "Opened": 1,
    "Headers": 2,
    "Loaded": 3,
    "Done": 4
});