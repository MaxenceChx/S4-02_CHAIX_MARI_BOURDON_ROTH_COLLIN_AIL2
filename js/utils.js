function isAppleDevice() {
    return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
}

export { isAppleDevice };