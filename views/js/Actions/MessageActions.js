import dispatcher from "../dispatcher";

export function sendMessage(content) {
    dispatcher.dispatch({
        type: "SEND_MESSAGE",
        content: content
    });
}

export function reportMovement(moved, eaten, sX, sY) {
    dispatcher.dispatch({
        type: "SEND_EVENT",
        moved,
        eaten,
        sX,
        sY
    });
}