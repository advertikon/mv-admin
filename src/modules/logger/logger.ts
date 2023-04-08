class Logger {
    info(message: string): void {
        console.log(message); // eslint-disable-line no-console
    }

    warn(message: string): void {
        console.warn(message); // eslint-disable-line no-console
    }

    error(message: string): void {
        console.error(message); // eslint-disable-line no-console
    }
}

export default new Logger();
