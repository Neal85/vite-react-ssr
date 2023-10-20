export default (config: any) => {
    return function (req: any, res: any, next: any) {
        const {
            headers: { enable, items },
        } = config;

        if (enable) {
            items.forEach((item: any) => {
                const { pattern, field, value } = item;
                
                if (pattern.test(req.path)) {
                    res.header(field, value);
                }
            });
        }

        next();
    };
}
