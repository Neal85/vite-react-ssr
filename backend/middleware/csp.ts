export default (config: any) => {
    return function (req: any, res: any, next: any) {
        const {
            csp: { enable, rules },
        } = config;

        enable && res.set('Content-Security-Policy', rules);

        next();
    };
}
