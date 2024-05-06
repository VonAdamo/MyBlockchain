
const fetchBlockchain =(req, res, next) => {
    res.status(200).json({ success: true, data: "Blockchain fetched successfully"})
};

const createBlock = (req, res, next) => {
    res.status(200).json({ success: true, data: "Block created successfully"})
};

export { fetchBlockchain, createBlock };a