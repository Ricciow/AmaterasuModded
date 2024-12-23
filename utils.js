export function getMagnitudeScale(number) {
    number = Math.abs(number)
    if (number <= 0) {
        return -1
    }
    return Math.floor(Math.log10(number));
}