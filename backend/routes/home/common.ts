
function health(req: any, res: any) {
    
    throw new Error('Test error');

    res.status(200).send(`Good health!`);
}


export default {
    health
}