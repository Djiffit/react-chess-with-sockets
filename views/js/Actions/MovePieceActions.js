import dispatcher from "../dispatcher";

export function movePiece(sX, sY, eX, eY) {
    dispatcher.dispatch({
        type: "MOVE_PIECE",
        sX: sX,
        sY: sY,
        eX: eX,
        eY: eY,
    });
}

export function movePieceOnline(sX, sY, eX, eY, blackTime, whiteTime) {
    dispatcher.dispatch({
        type: "MOVE_PIECE_ONLINE",
        sX: sX,
        sY: sY,
        eX: eX,
        eY: eY,
        blackTime: blackTime,
        whiteTime: whiteTime
    });
}

export function newGame() {
    dispatcher.dispatch({
        type: "NEW_GAME",
    })
}