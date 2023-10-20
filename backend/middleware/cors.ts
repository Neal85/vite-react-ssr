export default (config: any) => {
    return (req: any, res: any, next: any) => {
        const {
            cors: { enable, domains },
        } = config;

        enable && res.set('Access-Control-Allow-Origin', domains);

        next();
    };
}
