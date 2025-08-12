function getCurrentSeason() {
    const mm = new Date().getMonth();
    const dd = new Date().getDate();

    switch (mm) {
        case 0:
            return "WINTER";
        case 1:
            return "WINTER";
        case 2:
            if (dd > 20) {
                return "SPRING";
            } else {
                return "WINTER";
            }
        case 3:
            return "SPRING";
        case 4:
            return "SPRING";
        case 5:
            if (dd > 21) {
                return "SUMMER";
            } else {
                return "SPRING";
            }
        case 6:
            return "SUMMER";
        case 7:
            return "SUMMER";
        case 8:
            if (dd > 22) {
                return "FALL";
            } else {
                return "SUMMER";
            }
        case 9:
            return "FALL";
        case 10:
            return "FALL";
        case 11:
            if (dd > 21) {
                return "WINTER";
            } else {
                return "FALL";
            }
        default:
            return "SUMMER";
    }
}

exports.getCurrentSeason = getCurrentSeason;