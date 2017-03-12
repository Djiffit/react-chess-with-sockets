
export function pieceAt(x, y, pieces) {
    for (let j = 0; j < pieces.white.length; ++j) {
        if (x === pieces.white[j].x && y === pieces.white[j].y) {
            let p = pieces.white[j];
            p.black = false;
            return p;
        }
    }
    for (let j = 0; j < pieces.black.length; ++j) {
        if (x === pieces.black[j].x && y === pieces.black[j].y) {
            let p = pieces.black[j];
            p.black = true;
            return p;
        }
    }
    return null;
}

export function canMove(sx, sy, toX, toY, type, black, piecePositions) {
    const dx = toX - sx;
    if (sx == toX && sy == toY) return false;
    const dy = toY - sy;
    switch(type) {
        case "King" : {
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return false;
            let p = pieceAt(toX, toY, piecePositions);
            if (p == null || p.black != black) return true;
            return false;
        }
        case "Queen" : {
            if (sx != toX && sy == toY) {
                for (let i = Math.max(sx, toX); i >= Math.min(sx, toX); i--) {
                    if (i == sx) continue;
                    let p = pieceAt(i, toY, piecePositions);
                    if (i == toX && p != null && p.black == black){
                        return false;
                    } else if (p != null && i != toX) return false;
                }
                return true;
            } else if (sy != toY && sx == toX) {
                for (let i = Math.max(sy, toY); i >= Math.min(sy, toY); i--) {
                    if (i == sy) continue;
                    let p = pieceAt(toX, i, piecePositions);
                    if (i == toY && p != null && p.black == black){
                        return false;
                    } else if (p != null && i != toY) return false;
                }
                return true;
            }
            if (Math.abs(dy) != Math.abs(dx)) return false;
            if (toY > sy && toX > sx) {
                let j = toX;
                for (let i = toY; i > sy ; j--, i--) {
                    let p = pieceAt(j, i, piecePositions);
                    if (i == toY && p != null && p.black == black) return false;
                    else if (p != null && i != toY) return false;
                }
            } else if (toY > sy && toX < sx) {
                let j = toX;
                for (let i = toY; i > sy ;j++, i--) {
                    let p = pieceAt(j, i, piecePositions);
                    if (i == toY && p != null && p.black == black) return false;
                    else if (p != null && i != toY) return false;
                }
            } else if (toY < sy && toX < sx) {
                let j = toX;
                for (let i = toY; i < sy; j++, i++) {
                    let p = pieceAt(j, i, piecePositions);
                    if (i == toY && p != null && p.black == black) return false;
                    else if (p != null && i != toY) return false;
                }
            } else {
                let j = toX;
                for (let i = toY; i < sy; j--, i++) {
                    let p = pieceAt(j, i, piecePositions);
                    if (i == toY && p != null && p.black == black) return false;
                    else if (p != null && i != toY) return false;
                }
            }
            return true;
        }

        case "Pawn" : {
            if (black) {
                if (sy == 1) {
                    if (sx == toX) {
                        if (toY - sy == 1) {
                            return pieceAt(toX, toY, piecePositions) == null;
                        } else if (toY - sy == 2) {
                            return pieceAt(toX, toY, piecePositions) == null && pieceAt(toX, toY-1, piecePositions) == null;
                        } else {
                            return false;
                        }
                    } else {
                        if (Math.abs(sx-toX) == 1 && toY - sy == 1) {
                            let p = pieceAt(toX, toY, piecePositions);
                            return p != null && p.black != black;
                        } else {
                            return false;
                        }
                    }
                } else {
                    if (sx == toX) {
                        if (toY - sy == 1) {
                            return pieceAt(toX, toY, piecePositions) == null;
                        } else {
                            return false;
                        }
                    } else {
                        if (Math.abs(sx-toX) == 1 && toY - sy == 1) {
                            let p = pieceAt(toX, toY, piecePositions);
                            return p != null && p.black != black;
                        } else {
                            return false;
                        }
                    }
                }
            } else {
                if (sy == 6) {
                    if (sx == toX) {
                        if (toY - sy == -1) {
                            return pieceAt(toX, toY, piecePositions) == null;
                        } else if (toY - sy == -2) {
                            return pieceAt(toX, toY, piecePositions) == null && pieceAt(toX, toY+1, piecePositions) == null;
                        } else {
                            return false;
                        }
                    } else {
                        if (Math.abs(sx-toX) == 1 && toY - sy == -1) {
                            let p = pieceAt(toX, toY, piecePositions);
                            return p != null && p.black != black;
                        } else {
                            return false;
                        }
                    }
                } else {
                    if (sx == toX) {
                        if (toY - sy == -1) {
                            return pieceAt(toX, toY, piecePositions) == null;
                        } else {
                            return false;
                        }
                    } else {
                        if (Math.abs(sx-toX) == 1 && toY - sy == -1) {
                            let p = pieceAt(toX, toY, piecePositions);
                            return p != null && p.black != black;
                        } else {
                            return false;
                        }
                    }
                }
            }
        }
        case "Rook" : {
            if (sx != toX && sy != toY) return false;
            if (sx != toX) {
                for (let i = Math.max(sx, toX); i >= Math.min(sx, toX); i--) {
                    if (i == sx) continue;
                    let p = pieceAt(i, toY, piecePositions);
                    if (i == toX && p != null && p.black == black){
                        return false;
                    } else if (p != null && i != toX) return false;
                }
                return true;
            } else {
                for (let i = Math.max(sy, toY); i >= Math.min(sy, toY); i--) {
                    if (i == sy) continue;
                    let p = pieceAt(toX, i, piecePositions);
                    if (i == toY && p != null && p.black == black){
                        return false;
                    } else if (p != null && i != toY) return false;
                }
                return true;
            }
        }
        case "Bishop" : {
            if (Math.abs(dy) != Math.abs(dx)) return false;
            if (toY > sy && toX > sx) {
                let j = toX;
                for (let i = toY; i > sy ; j--, i--) {
                    let p = pieceAt(j, i, piecePositions);
                    if (i == toY && p != null && p.black == black) return false;
                    else if (p != null && i != toY) return false;
                }
            } else if (toY > sy && toX < sx) {
                let j = toX;
                for (let i = toY; i > sy ;j++, i--) {
                    let p = pieceAt(j, i, piecePositions);
                    if (i == toY && p != null && p.black == black) return false;
                    else if (p != null && i != toY) return false;
                }
            } else if (toY < sy && toX < sx) {
                let j = toX;
                for (let i = toY; i < sy; j++, i++) {
                    let p = pieceAt(j, i, piecePositions);
                    if (i == toY && p != null && p.black == black) return false;
                    else if (p != null && i != toY) return false;
                }
            } else {
                let j = toX;
                for (let i = toY; i < sy; j--, i++) {
                    let p = pieceAt(j, i, piecePositions);
                    if (i == toY && p != null && p.black == black) return false;
                    else if (p != null && i != toY) return false;
                }
            }
            return true;
        }
        case "Knight" : {
            const p = pieceAt(toX, toY, piecePositions);

            return ((Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
                (Math.abs(dx) === 1 && Math.abs(dy) === 2)) && (p == null || p.black != black);
        }

    }

}