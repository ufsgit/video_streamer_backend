const completionRateService = require('./completionRate.service');

const getCompletionRate = async (req, res) => {
    try {
        const data = await completionRateService.getCompletionRate();
        
        // Format to 1 decimal place with a percentage sign (e.g., "78.2%")
        const formattedRate = `${parseFloat(data.completion_rate).toFixed(1)}%`;

        res.status(200).json({
            success: true,
            data: {
                completion_rate: formattedRate,
                raw_rate: parseFloat(data.completion_rate) // Optional: providing the raw number for Flutter to use in charts
            }
        });
    } catch (error) {
        console.error('Error fetching completion rate:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getCompletionRate
};
