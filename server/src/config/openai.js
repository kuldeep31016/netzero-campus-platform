const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = process.env.OPENAI_API_KEY ? new OpenAIApi(configuration) : null;

// AI service for generating sustainability recommendations
const aiService = {
  generateRecommendations: async (data) => {
    if (!openai) {
      // Return mock recommendations if OpenAI is not configured
      return [
        {
          id: 1,
          title: "Optimize HVAC Schedule",
          description: "Adjust heating and cooling schedules based on building occupancy patterns to reduce energy consumption by 15-20%.",
          category: "energy",
          impact: "high",
          effort: "medium",
          savings: "15-20% energy reduction"
        },
        {
          id: 2,
          title: "Implement Water-Saving Fixtures",
          description: "Install low-flow faucets and toilets to reduce water consumption by 30%.",
          category: "water",
          impact: "medium",
          effort: "low",
          savings: "30% water reduction"
        }
      ];
    }

    try {
      const prompt = `Based on the following campus sustainability data, provide 3-5 specific, actionable recommendations:

Energy Usage: ${data.energyUsage || 'N/A'} kWh/month
Water Usage: ${data.waterUsage || 'N/A'} gallons/month
Waste Production: ${data.wasteProduction || 'N/A'} tons/month
Transportation: ${data.transportationEmissions || 'N/A'} kg CO2/month
Current Goals: ${data.goals || 'Net Zero by 2030'}

Please provide recommendations in this exact JSON format:
[
  {
    "title": "Recommendation title",
    "description": "Detailed description with specific actions",
    "category": "energy|water|waste|mobility",
    "impact": "high|medium|low",
    "effort": "high|medium|low",
    "savings": "Expected savings/impact"
  }
]`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return JSON.parse(response.data.choices[0].text.trim());
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Return fallback recommendations
      return aiService.generateRecommendations({});
    }
  },

  analyzeEmissions: async (data) => {
    const totalEmissions = (data.energy * 0.4) + (data.transportation * 1.0) + (data.waste * 0.5);
    const recommendations = [];

    if (data.energy > 1000) {
      recommendations.push("Consider implementing energy-efficient lighting and HVAC systems");
    }
    
    if (data.transportation > 500) {
      recommendations.push("Promote electric vehicle adoption and public transportation");
    }

    if (data.waste > 10) {
      recommendations.push("Implement comprehensive recycling and composting programs");
    }

    return {
      totalEmissions,
      breakdown: {
        energy: data.energy * 0.4,
        transportation: data.transportation * 1.0,
        waste: data.waste * 0.5
      },
      recommendations
    };
  }
};

module.exports = {
  openai,
  aiService
};